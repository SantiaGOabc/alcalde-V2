import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { ADMIN_SECRET_CODE } from 'astro:env/server';
import { isDbConfigured, query } from './db';
import { isJwtConfigured, signSessionToken, verifySessionToken } from './jwt';
import { verifyPassword } from './password';

const COOKIE_NAME = 'admin_session';
/** Duración de la sesión: una jornada de trabajo. Pasado ese tiempo hay que volver a ingresar. */
const SESSION_TTL_SECONDS = 60 * 60 * 12;

export interface AdminUser {
  id: number;
  username: string;
}

const sha256 = (value: string): Buffer => createHash('sha256').update(value).digest();

/** Comparación en tiempo constante (se comparan hashes para igualar longitudes). */
const safeEqual = (a: string, b: string): boolean => timingSafeEqual(sha256(a), sha256(b));

/** El panel solo existe si hay base de datos, código secreto y clave JWT. */
export const isAdminConfigured = (): boolean => isDbConfigured() && Boolean(ADMIN_SECRET_CODE) && isJwtConfigured();

/** El código de la URL debe coincidir con ADMIN_SECRET_CODE; sin él, el panel no existe. */
export const isValidAdminCode = (code: unknown): code is string =>
  Boolean(ADMIN_SECRET_CODE) && typeof code === 'string' && safeEqual(code, ADMIN_SECRET_CODE!);

/** Ruta del panel para el navbar; solo se calcula para un administrador con sesión. */
export const getAdminPanelPath = (): string | null => (ADMIN_SECRET_CODE ? `/admin/${ADMIN_SECRET_CODE}` : null);

/** Valida usuario y contraseña; devuelve `null` si no coinciden. */
export async function authenticate(username: string, password: string): Promise<AdminUser | null> {
  const { rows } = await query<{ id: string; username: string; password_hash: string }>(
    'SELECT id, username, password_hash FROM admin_users WHERE username = $1',
    [username.trim().toLowerCase()],
  );
  const user = rows[0];

  if (!user || !(await verifyPassword(password, user.password_hash))) return null;
  return { id: Number(user.id), username: user.username };
}

/**
 * Abre una sesión: registra el `jti` en la base (permite revocarla) y entrega el
 * JWT en una cookie `httpOnly` + `SameSite=Strict` (+ `Secure` bajo HTTPS), que
 * JavaScript del navegador no puede leer.
 */
export async function createSession(cookies: AstroCookies, user: AdminUser, secure: boolean): Promise<void> {
  const sessionId = randomUUID();
  const token = await signSessionToken({ userId: user.id, username: user.username, sessionId }, SESSION_TTL_SECONDS);

  await query('DELETE FROM admin_sessions WHERE expires_at < now()');
  await query(
    `INSERT INTO admin_sessions (token_hash, user_id, expires_at)
     VALUES ($1, $2, now() + make_interval(secs => $3))`,
    [sha256(sessionId).toString('hex'), user.id, SESSION_TTL_SECONDS],
  );

  cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export const hasSessionCookie = (cookies: AstroCookies): boolean => cookies.has(COOKIE_NAME);

/**
 * Administrador de la sesión actual, o `null`. Además de la firma y la vigencia
 * del JWT, exige que su `jti` siga registrado: un token revocado deja de servir
 * aunque no haya expirado.
 */
export async function getSessionUser(cookies: AstroCookies): Promise<AdminUser | null> {
  const token = cookies.get(COOKIE_NAME)?.value;
  if (!token || !isJwtConfigured()) return null;

  const claims = await verifySessionToken(token);
  if (!claims) return null;

  const { rows } = await query<{ id: string; username: string }>(
    `SELECT u.id, u.username FROM admin_sessions s
     JOIN admin_users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.user_id = $2 AND s.expires_at > now()`,
    [sha256(claims.sessionId).toString('hex'), claims.userId],
  );

  return rows[0] ? { id: Number(rows[0].id), username: rows[0].username } : null;
}

/** Cierra la sesión: revoca el `jti` en la base y borra la cookie. */
export async function destroySession(cookies: AstroCookies): Promise<void> {
  const token = cookies.get(COOKIE_NAME)?.value;
  const claims = token && isJwtConfigured() ? await verifySessionToken(token) : null;

  if (claims) await query('DELETE FROM admin_sessions WHERE token_hash = $1', [sha256(claims.sessionId).toString('hex')]);
  cookies.delete(COOKIE_NAME, { path: '/' });
}
