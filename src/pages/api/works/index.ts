import type { APIRoute } from 'astro';
import {
  adminOnly,
  createWork,
  fail,
  json,
  parsePageParams,
  parseSearch,
  parseWorkInput,
  readJson,
  searchWorks,
} from '@/lib/server';

/** Listado paginado para el panel: ?page=&pageSize=&category=&q= */
export const GET: APIRoute = adminOnly(async ({ url }) => {
  const { page, pageSize } = parsePageParams(url.searchParams, { defaultSize: 8, maxSize: 50 });
  const category = url.searchParams.get('category');

  return json(await searchWorks({ page, pageSize, category, search: parseSearch(url.searchParams) }));
});

export const POST: APIRoute = adminOnly(async ({ request }) => {
  const input = parseWorkInput(await readJson(request));
  if (!input) return fail('Revisa los datos de la obra.', 422);

  return json({ work: await createWork(input) }, 201);
});
