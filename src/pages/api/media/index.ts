import type { APIRoute } from 'astro';
import { MAX_MEDIA_BYTES, adminOnly, fail, json, saveImage, type MediaError } from '@/lib/server';

const MESSAGES: Record<MediaError, [string, number]> = {
  missing: ['Selecciona una imagen.', 400],
  type: ['Solo se admiten imágenes JPG, PNG, WebP o GIF.', 415],
  size: [`La imagen no puede superar ${MAX_MEDIA_BYTES / 1024 / 1024} MB.`, 413],
};

export const POST: APIRoute = adminOnly(async ({ request }) => {
  const form = await request.formData().catch(() => null);
  const result = await saveImage(form?.get('file'));

  if ('error' in result) return fail(...MESSAGES[result.error]);
  return json(result, 201);
});
