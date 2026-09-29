/**
 * La ESTRUCTURA de cada sección la define el código (los `constants`); la base de
 * datos solo guarda VALORES. Este módulo mantiene ambas cosas en sintonía:
 *
 *  - `matchesShape`: valida lo que llega del panel antes de guardarlo.
 *  - `reconcile`: adapta lo guardado a la estructura actual al leerlo, así cambiar
 *    un `constant` (quitar un kicker, añadir un campo, cambiar un tipo) no exige
 *    migrar la base de datos ni deja campos huérfanos en el panel.
 */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * `true` si `value` respeta los tipos del molde. Se toleran claves ausentes o
 * extra (los opcionales); en arreglos, cada elemento se compara con el molde
 * de su misma posición y, si no hay, con el primero.
 */
export const matchesShape = (template: unknown, value: unknown): boolean => {
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return false;
    return value.every((item, index) => {
      const sample = template[index] ?? template[0];
      return sample === undefined || matchesShape(sample, item);
    });
  }

  if (isRecord(template)) {
    if (!isRecord(value)) return false;
    return Object.entries(value).every(
      ([key, item]) => !(key in template) || matchesShape(template[key], item),
    );
  }

  return typeof template === typeof value;
};

/**
 * Un elemento "en blanco": todo vacío (textos sin contenido, listas vacías). Es lo que crea el
 * botón "+ Añadir" del panel antes de que se rellene; los números y booleanos nunca cuentan
 * como vacíos porque `0` y `false` son valores reales.
 */
const isBlank = (value: unknown): boolean => {
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.every(isBlank);
  if (isRecord(value)) return Object.values(value).every(isBlank);
  return value === null || value === undefined;
};

/** Reconcilia un elemento de lista con los moldes de la lista (que pueden ser varios). */
const reconcileItem = (templates: unknown[], item: unknown, index: number): unknown => {
  const sample = templates[index] ?? templates[0];
  if (sample === undefined) return item;

  if (isRecord(sample) && isRecord(item)) {
    // Claves permitidas: las de CUALQUIER molde de la lista (hay campos opcionales que
    // solo aparecen en algunos elementos). Las que ya no existen en el código se descartan.
    const recordTemplates = templates.filter(isRecord);
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(item)) {
      const owner = recordTemplates.find((template) => key in template);
      if (owner) result[key] = reconcile(owner[key], value);
    }
    return result;
  }

  return reconcile(sample, item);
};

/**
 * Adapta lo `stored` en la base a la estructura actual `defaults`:
 *  - claves que el código ya no tiene → se descartan;
 *  - claves nuevas en el código → toman su valor por defecto;
 *  - un valor cuyo tipo cambió → vuelve al valor por defecto;
 *  - listas → se conservan completas (los elementos se reconcilian uno a uno) salvo los
 *    elementos totalmente en blanco, que se descartan: nunca llegan al sitio ni a la base.
 */
export const reconcile = <T>(defaults: T, stored: unknown): T => {
  if (stored === undefined) return defaults;

  if (Array.isArray(defaults)) {
    if (!Array.isArray(stored)) return defaults;
    return stored.filter((item) => !isBlank(item)).map((item, index) => reconcileItem(defaults, item, index)) as T;
  }

  if (isRecord(defaults)) {
    if (!isRecord(stored)) return defaults;

    return Object.fromEntries(
      Object.entries(defaults).map(([key, fallback]) => [key, reconcile(fallback, stored[key])]),
    ) as T;
  }

  return (typeof stored === typeof defaults ? stored : defaults) as T;
};
