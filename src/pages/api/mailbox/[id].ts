import type { APIRoute } from 'astro';
import { adminOnly, fail, json, readJson, setMailboxMessageRead } from '@/lib/server';

export const PATCH: APIRoute = adminOnly(async ({ params, request }) => {
  const id = Number(params.id);
  const body = (await readJson(request)) as { isRead?: unknown } | null;

  if (!Number.isInteger(id) || typeof body?.isRead !== 'boolean') return fail('Solicitud inválida.', 400);

  await setMailboxMessageRead(id, body.isRead);
  return json({ ok: true });
});
