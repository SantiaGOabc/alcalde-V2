import type { APIRoute } from 'astro';
import { getStoredImage, isDbConfigured } from '@/lib/server';

/** Sirve las imágenes subidas desde el panel. El id nunca cambia de contenido: caché largo. */
export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!isDbConfigured() || !Number.isInteger(id) || id <= 0) return new Response(null, { status: 404 });

  const image = await getStoredImage(id).catch(() => null);
  if (!image) return new Response(null, { status: 404 });

  return new Response(new Uint8Array(image.data), {
    headers: {
      'Content-Type': image.mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
