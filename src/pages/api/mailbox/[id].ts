import type { APIRoute } from 'astro';
import { adminOnly, deleteMailboxMessage, fail, json, readJson, setMailboxMessageRead } from '@/lib/server';

export const PATCH: APIRoute = adminOnly(async ({ params, request }) => {
  const id = Number(params.id);
  const body = (await readJson(request)) as { isRead?: unknown } | null;

  if (!Number.isInteger(id) || typeof body?.isRead !== 'boolean') return fail('Solicitud inválido.', 400);

  await setMailboxMessageRead(id, body.isRead);
  return json({ ok: true });
});

export const DELETE: APIRoute = adminOnly(async ({ params }) => {
  const id = Number(params.id);

  if (!Number.isInteger(id)) return fail('Solicitud inválido.', 400);

  await deleteMailboxMessage(id);
  return json({ ok: true });
});
