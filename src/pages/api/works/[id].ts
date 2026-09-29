import type { APIRoute } from 'astro';
import {
  adminOnly,
  deleteWork,
  fail,
  json,
  parseWorkInput,
  readJson,
  setWorkPublished,
  updateWork,
} from '@/lib/server';

const parseId = (value: string | undefined): number | null => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export const PUT: APIRoute = adminOnly(async ({ params, request }) => {
  const id = parseId(params.id);
  const input = parseWorkInput(await readJson(request));
  if (!id || !input) return fail('Revisa los datos de la obra.', 422);

  const work = await updateWork(id, input);
  return work ? json({ work }) : fail('La obra no existe.', 404);
});

/** Publicar / despublicar sin tocar el resto de la obra. */
export const PATCH: APIRoute = adminOnly(async ({ params, request }) => {
  const id = parseId(params.id);
  const body = (await readJson(request)) as { publicada?: unknown } | null;
  if (!id || typeof body?.publicada !== 'boolean') return fail('Solicitud inválida.', 400);

  return (await setWorkPublished(id, body.publicada)) ? json({ ok: true }) : fail('La obra no existe.', 404);
});

export const DELETE: APIRoute = adminOnly(async ({ params }) => {
  const id = parseId(params.id);
  if (!id) return fail('Solicitud inválida.', 400);

  return (await deleteWork(id)) ? json({ ok: true }) : fail('La obra no existe.', 404);
});
