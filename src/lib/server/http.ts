import type { APIContext } from 'astro';
import type { AdminUser } from './auth';
import { isDbConfigured } from './db';

/** Respuesta JSON. Los errores llevan `{ message }` (lo que lee `lib/api/http.ts`). */
export const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export const fail = (message: string, status: number): Response => json({ message }, status);

export const readJson = async (request: Request): Promise<unknown> => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

/** `true` si la petición viaja por HTTPS (decide el flag `secure` de la cookie). */
export const isSecureRequest = (url: URL): boolean => url.protocol === 'https:';

type Handler = (context: APIContext, user: AdminUser) => Response | Promise<Response>;

/**
 * Envuelve un endpoint que exige sesión de administrador. Centraliza la
 * comprobación de base de datos y de sesión y el manejo de errores inesperados.
 */
export const adminOnly =
  (handler: Handler) =>
  async (context: APIContext): Promise<Response> => {
    if (!isDbConfigured()) return fail('Base de datos no configurada.', 503);

    try {
      const user = context.locals.admin;
      return user ? await handler(context, user) : fail('No autorizado.', 401);
    } catch (error) {
      console.error('[api]', error);
      return fail('Error interno del servidor.', 500);
    }
  };
