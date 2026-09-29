import { SignJWT, jwtVerify } from 'jose';
import { JWT_SECRET } from 'astro:env/server';

/**
 * Sesión de administrador como JWT firmado (HS256).
 *
 * Medidas de seguridad:
 *  - Algoritmo fijado al verificar (`algorithms`): nunca se acepta `none` ni otro.
 *  - `iss` y `aud` propios: un token de otro sistema con la misma clave no sirve.
 *  - `exp` corto y obligatorio; `jti` único por sesión, que además se guarda en la
 *    base de datos para poder revocarlo (cerrar sesión invalida el token de verdad).
 *  - El payload solo lleva lo imprescindible; nunca contraseñas ni permisos.
 *  - La clave (`JWT_SECRET`) exige 32+ caracteres y vive solo en el servidor.
 */
const ISSUER = 'alcalde-cms';
const AUDIENCE = 'admin-panel';
const ALGORITHM = 'HS256';
const MIN_SECRET_LENGTH = 32;

export interface SessionClaims {
  userId: number;
  username: string;
  /** Identificador único de la sesión (`jti`). */
  sessionId: string;
}

export const isJwtConfigured = (): boolean => Boolean(JWT_SECRET && JWT_SECRET.length >= MIN_SECRET_LENGTH);

const secretKey = (): Uint8Array => {
  if (!JWT_SECRET || JWT_SECRET.length < MIN_SECRET_LENGTH) {
    throw new Error(`JWT_SECRET debe tener al menos ${MIN_SECRET_LENGTH} caracteres.`);
  }
  return new TextEncoder().encode(JWT_SECRET);
};

export const signSessionToken = ({ userId, username, sessionId }: SessionClaims, ttlSeconds: number): Promise<string> =>
  new SignJWT({ usr: username })
    .setProtectedHeader({ alg: ALGORITHM, typ: 'JWT' })
    .setSubject(String(userId))
    .setJti(sessionId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + ttlSeconds)
    .sign(secretKey());

/** Devuelve los datos del token si su firma, emisor, audiencia y vigencia son válidos; si no, `null`. */
export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: [ALGORITHM],
      issuer: ISSUER,
      audience: AUDIENCE,
      requiredClaims: ['sub', 'jti', 'exp'],
    });

    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || typeof payload.jti !== 'string' || typeof payload.usr !== 'string') return null;

    return { userId, username: payload.usr, sessionId: payload.jti };
  } catch {
    return null;
  }
}
