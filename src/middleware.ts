import { defineMiddleware } from 'astro:middleware';
import { PREVIEW_PARAM } from '@/cms/preview';
import { getSessionUser, hasSessionCookie, isAdminConfigured, runWithPreview } from '@/lib/server';

/**
 * Resuelve UNA vez por petición quién es el administrador (`locals.admin`) para
 * que el navbar, el panel y los endpoints no repitan la consulta.
 *
 * Solo una petición con `?cms-preview` Y sesión de administrador ve los
 * borradores del panel; para cualquier otra persona el parámetro no hace nada.
 */
export const onRequest = defineMiddleware(async ({ url, cookies, locals }, next) => {
  const admin =
    isAdminConfigured() && hasSessionCookie(cookies) ? await getSessionUser(cookies).catch(() => null) : null;
  locals.admin = admin;

  if (!admin) return next();

  const response = url.searchParams.has(PREVIEW_PARAM) ? await runWithPreview(admin.id, next) : await next();
  // Contiene datos de la sesión (enlace al panel): que ninguna caché compartida lo guarde.
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
});
