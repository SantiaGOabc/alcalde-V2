import type { APIRoute } from 'astro';
import { CMS_SECTIONS, isCmsKey } from '@/cms/sections';
import { matchesShape, reconcile } from '@/cms/shape';
import { adminOnly, clearPreviewDraft, fail, json, readJson, resetContent, saveContent } from '@/lib/server';

export const PUT: APIRoute = adminOnly(async ({ params, request }, user) => {
  const { key } = params;
  if (!isCmsKey(key)) return fail('Sección desconocida.', 404);

  const body = (await readJson(request)) as { value?: unknown } | null;
  const { defaults } = CMS_SECTIONS[key];

  if (!body || !matchesShape(defaults, body.value)) {
    return fail('El contenido no respeta la estructura de la sección.', 422);
  }

  // Se guarda ya reconciliado: nunca entran a la base campos que el código no conoce.
  const value = reconcile(defaults, body.value);
  await saveContent(key, value, user.username);
  clearPreviewDraft(user.id, key);
  return json({ value });
});

export const DELETE: APIRoute = adminOnly(async ({ params }, user) => {
  const { key } = params;
  if (!isCmsKey(key)) return fail('Sección desconocida.', 404);

  await resetContent(key);
  clearPreviewDraft(user.id, key);
  return json({ ok: true });
});
