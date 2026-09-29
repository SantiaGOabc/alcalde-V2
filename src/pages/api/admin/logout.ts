import type { APIRoute } from 'astro';
import { destroySession, isDbConfigured, json } from '@/lib/server';

export const POST: APIRoute = async ({ cookies }) => {
  if (isDbConfigured()) {
    await destroySession(cookies).catch((error) => console.error('[api] logout', error));
  }
  return json({ ok: true });
};
