/**
 * Fechas del sitio.
 *
 * El formato se fija aquí a propósito: el servidor renderiza las fechas y el
 * navegador las vuelve a pintar al filtrar o al mover una tarjeta. Si cada uno
 * eligiera su configuración regional, el mismo mensaje se vería distinto según
 * quién lo mirara.
 */

/** Español de Bolivia: "28 sept, 2:32 p. m.". */
const LOCALE = "es-BO";

/** Convierte a `Date` devolviendo `null` en vez de `Invalid Date`. */
export const toDate = (value: string | number | Date): Date | null => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Fecha y hora en corto: "28 sept, 2:32 p. m.". */
export const formatDateTime = (value: string | number | Date): string =>
  toDate(value)?.toLocaleString(LOCALE, { dateStyle: "medium", timeStyle: "short" }) ?? "";

/** Solo el día, para donde la hora estorba. */
export const formatDay = (value: string | number | Date): string =>
  toDate(value)?.toLocaleDateString(LOCALE) ?? "";