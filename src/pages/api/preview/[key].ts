import type { APIRoute } from 'astro';
import { CMS_SECTIONS, isCmsKey } from '@/cms/sections';
import { matchesShape } from '@/cms/shape';
import { adminOnly, clearPreviewDraft, fail, json, readJson, setPreviewDraft } from '@/lib/server';

/** Guarda el borrador que la vista previa mostrará (no publica nada). */
export const PUT: APIRoute = adminOnly(async ({ params, request }, user) => {
  const { key } = params;
  if (!isCmsKey(key)) return fail('Sección desconocida.', 404);

  const body = (await readJson(request)) as { value?: unknown } | null;
  if (!body || !matchesShape(CMS_SECTIONS[key].defaults, body.value)) {
    return fail('El contenido no respeta la estructura de la sección.', 422);
  }

  setPreviewDraft(user.id, key, body.value);
  return json({ ok: true });
});

export const DELETE: APIRoute = adminOnly(({ params }, user) => {
  const { key } = params;
  if (!isCmsKey(key)) return fail('Sección desconocida.', 404);

  clearPreviewDraft(user.id, key);
  return json({ ok: true });
});
