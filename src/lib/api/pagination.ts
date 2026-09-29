/** Respuesta paginada estándar de los listados del panel. */
export interface Paginated<T> {
  items: T[];
  /** Total de resultados con los filtros aplicados (no solo los de esta página). */
  total: number;
  page: number;
  pageSize: number;
}

/** Parámetros comunes de un listado paginado. */
export interface PageQuery {
  page?: number;
  pageSize?: number;
}

type QueryValue = string | number | boolean | null | undefined;

/** `{ page: 2, q: '' }` → `?page=2` (omite los valores vacíos). */
export const toQueryString = (params: Record<string, QueryValue>): string => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : '';
};
