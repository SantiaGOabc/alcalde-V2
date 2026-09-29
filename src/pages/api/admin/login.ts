import type { APIRoute } from 'astro';
import {
  authenticate,
  createSession,
  fail,
  isAdminConfigured,
  isSecureRequest,
  isValidAdminCode,
  json,
  readJson,
} from '@/lib/server';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const INVALID = 'Credenciales inválidas.';

/** Intentos fallidos por IP (en memoria: suficiente para una sola instancia). */
const failures = new Map<string, { count: number; resetAt: number }>();

const isBlocked = (ip: string): boolean => {
  const entry = failures.get(ip);
  return Boolean(entry && entry.resetAt > Date.now() && entry.count >= MAX_ATTEMPTS);
};

const registerFailure = (ip: string): void => {
  const entry = failures.get(ip);
  failures.set(
    ip,
    entry && entry.resetAt > Date.now()
      ? { ...entry, count: entry.count + 1 }
      : { count: 1, resetAt: Date.now() + WINDOW_MS },
  );
};

export const POST: APIRoute = async ({ request, cookies, clientAddress, url }) => {
  if (!isAdminConfigured()) return fail('El panel no está configurado (base de datos, código y JWT_SECRET).', 503);
  if (isBlocked(clientAddress)) return fail('Demasiados intentos. Espera unos minutos.', 429);

  const body = (await readJson(request)) as Record<string, unknown> | null;
  const { code, username, password } = body ?? {};

  if (typeof username !== 'string' || typeof password !== 'string' || !isValidAdminCode(code)) {
    registerFailure(clientAddress);
    return fail(INVALID, 401);
  }

  try {
    const user = await authenticate(username, password);
    if (!user) {
      registerFailure(clientAddress);
      return fail(INVALID, 401);
    }

    failures.delete(clientAddress);
    await createSession(cookies, user, isSecureRequest(url));
    return json({ username: user.username });
  } catch (error) {
    console.error('[api] login', error);
    return fail('Error interno del servidor.', 500);
  }
};
