export interface PageParams {
  page: number;
  pageSize: number;
  offset: number;
}

interface PageLimits {
  defaultSize?: number;
  maxSize?: number;
}

const toPositiveInt = (value: string | null, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

/** Lee `?page=&pageSize=` con valores seguros: nunca menos de 1 ni más de `maxSize` filas. */
export const parsePageParams = (
  params: URLSearchParams,
  { defaultSize = 10, maxSize = 50 }: PageLimits = {},
): PageParams => {
  const page = toPositiveInt(params.get('page'), 1);
  const pageSize = Math.min(toPositiveInt(params.get('pageSize'), defaultSize), maxSize);
  return { page, pageSize, offset: (page - 1) * pageSize };
};

/** Patrón para `ILIKE '%…%'` con los comodines del usuario (`%`, `_`, `\`) escapados. */
export const containsPattern = (text: string): string => `%${text.replace(/[\\%_]/g, '\\$&')}%`;

/** Texto de búsqueda limpio y acotado, o `null` si no hay. */
export const parseSearch = (params: URLSearchParams, maxLength = 100): string | null =>
  params.get('q')?.trim().slice(0, maxLength) || null;
