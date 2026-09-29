/** Helpers puros del editor del panel: rutas inmutables, valores en blanco y etiquetas. */

export type Path = readonly (string | number)[];

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const getIn = (root: unknown, path: Path): unknown =>
  path.reduce<unknown>(
    (node, key) => (node === null || typeof node !== 'object' ? undefined : (node as Record<string | number, unknown>)[key]),
    root,
  );

/** Copia `root` reemplazando el valor en `path` (no muta nada). */
export const setIn = <T>(root: T, path: Path, value: unknown): T => {
  if (path.length === 0) return value as T;

  const [head, ...rest] = path;
  const copy = (Array.isArray(root) ? [...root] : { ...(root as object) }) as Record<string | number, unknown>;
  copy[head] = setIn(copy[head], rest, value);
  return copy as T;
};

/** Un elemento nuevo con la misma forma que `sample`, pero vacío. */
export const blankLike = (sample: unknown): unknown => {
  if (Array.isArray(sample)) return [];
  if (isRecord(sample)) return Object.fromEntries(Object.entries(sample).map(([key, item]) => [key, blankLike(item)]));
  if (typeof sample === 'number') return 0;
  if (typeof sample === 'boolean') return false;
  return '';
};

/** `imageURL` → "Image URL", `titulo` → "Titulo". */
export const humanize = (key: string | number): string => {
  if (typeof key === 'number') return `Elemento ${key + 1}`;
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const IMAGE_PATTERN = /\.(webp|jpe?g|png|gif|avif|jfif|svg)(\?.*)?$/i;
const TITLE_KEYS = ['titulo', 'title', 'name', 'label', 'phrase', 'anio'];

export const isImageUrl = (value: string): boolean => /^https?:\/\//.test(value) && IMAGE_PATTERN.test(value);

export const isLongText = (value: string): boolean => value.length > 90 || value.includes('\n');

/** Nombre corto de un elemento de lista, para la cabecera de su tarjeta. */
export const itemTitle = (item: unknown, index: number): string => {
  if (typeof item === 'string' && item) return item;
  if (isRecord(item)) {
    for (const key of TITLE_KEYS) {
      const candidate = item[key];
      if (typeof candidate === 'string' && candidate) return candidate;
    }
  }
  return humanize(index);
};
