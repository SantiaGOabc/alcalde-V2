import { useCallback, useEffect, useState } from 'react';
import { ApiError, type Paginated } from '@/lib';

interface ListState<T> {
  items: T[];
  total: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
}

/**
 * Lista paginada en el servidor: pide UNA página a la vez y vuelve a la 1 cuando
 * cambian los filtros. Sirve para cualquier listado que devuelva `Paginated<T>`.
 *
 *   const list = usePagedList((query) => listWorks(query), { category, q });
 *
 * `filters` debe ser un objeto simple (se compara por su contenido).
 */
export function usePagedList<Page extends Paginated<unknown>, Filters extends object>(
  fetchPage: (query: Filters & { page: number }) => Promise<Page>,
  filters: Filters,
) {
  type Item = Extract<Page['items'][number], object>;

  const filtersKey = JSON.stringify(filters);
  // La página se guarda junto a los filtros con los que se eligió: si cambian, vuelve a 1 sin efectos extra.
  const [pageState, setPageState] = useState({ filtersKey, page: 1 });
  const [reloadToken, setReloadToken] = useState(0);
  const [state, setState] = useState<ListState<Item>>({ items: [], total: 0, pageSize: 10, isLoading: true, error: null });
  // Respuesta completa de la última página: por si el servidor añade datos propios (p. ej. `unread`).
  const [extra, setExtra] = useState<Page | null>(null);

  const page = pageState.filtersKey === filtersKey ? pageState.page : 1;

  useEffect(() => {
    let isStale = false;
    setState((current) => ({ ...current, isLoading: true }));

    fetchPage({ ...(JSON.parse(filtersKey) as Filters), page })
      .then((result) => {
        if (isStale) return;
        setExtra(result);
        setState({ items: result.items as Item[], total: result.total, pageSize: result.pageSize, isLoading: false, error: null });
      })
      .catch((error) => {
        if (isStale) return;
        const message = error instanceof ApiError ? error.message : 'No se pudo cargar la lista.';
        setState((current) => ({ ...current, isLoading: false, error: message }));
      });

    // Si llega otra petición antes que ésta, se descarta la respuesta vieja.
    return () => {
      isStale = true;
    };
    // `fetchPage` se define inline en cada render; los filtros y la página son la verdadera dependencia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, page, reloadToken]);

  const setPage = useCallback((next: number) => setPageState({ filtersKey, page: next }), [filtersKey]);
  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  /** Actualiza un elemento ya cargado sin volver a pedir la página (p. ej. marcar un mensaje como leído). */
  const patchItem = useCallback(
    (matches: (item: Item) => boolean, changes: Partial<Item>) =>
      setState((current) => ({
        ...current,
        items: current.items.map((item) => (matches(item) ? { ...item, ...changes } : item)),
      })),
    [],
  );

  return { ...state, page, extra, setPage, refresh, patchItem };
}
