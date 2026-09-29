import type { APIRoute } from 'astro';
import type { MailboxStatus } from '@/lib';
import {
  adminOnly,
  fail,
  isDbConfigured,
  json,
  parsePageParams,
  parseSearch,
  parseMailboxPayload,
  readJson,
  saveMailboxMessage,
  searchMailboxMessages,
} from '@/lib/server';

const STATUSES: readonly MailboxStatus[] = ['all', 'unread', 'read'];

/** Público: recibe el formulario del buzón ciudadano. */
export const POST: APIRoute = async ({ request }) => {
  if (!isDbConfigured()) return fail('El buzón no está disponible por ahora.', 503);

  const payload = parseMailboxPayload(await readJson(request));
  if (!payload) return fail('Revisa los datos del formulario.', 422);

  try {
    await saveMailboxMessage(payload);
    return json({ ok: true }, 201);
  } catch (error) {
    console.error('[api] mailbox', error);
    return fail('No se pudo guardar tu mensaje.', 500);
  }
};

/** Bandeja paginada para el panel: ?page=&pageSize=&type=&status=&q= */
export const GET: APIRoute = adminOnly(async ({ url }) => {
  const { page, pageSize } = parsePageParams(url.searchParams, { defaultSize: 10, maxSize: 50 });
  const status = url.searchParams.get('status') as MailboxStatus | null;

  return json(
    await searchMailboxMessages({
      page,
      pageSize,
      type: url.searchParams.get('type'),
      status: status && STATUSES.includes(status) ? status : 'all',
      search: parseSearch(url.searchParams),
    }),
  );
});
