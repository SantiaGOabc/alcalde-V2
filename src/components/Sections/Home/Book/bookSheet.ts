import { BOOK_RENDERED_ASPECT, BOOK_SHEET } from "@constant";
import type { BookSheet } from "@types";

/**
 * Proporción del libro abierto: dos hojas. Es la que manda en el doblece.
 */
const SPREAD_ASPECT = 2 * BOOK_RENDERED_ASPECT;

/**
 * Lo que le sobra a la ventana una vez descontados márgenes y barras.
 *
 * Los controles tienen una altura fija, pero no pueden raparse más de la fracción
 * que se les concede: si no, en una ventana baja se comen el libro entero.
 */
const room = () => {
  const margin = BOOK_SHEET.margin * 2;
  const height = window.innerHeight - margin;
  const insets = Math.min(
    BOOK_SHEET.topInset + BOOK_SHEET.bottomInset,
    height * BOOK_SHEET.insetCap,
  );

  return { width: window.innerWidth - margin, height: height - insets };
};

/**
 * Esa misma caja, ya como medidas de hoja, para que el visor pueda colocar el
 * marco sin volver a hacer la cuenta.
 *
 * Se exporta porque con zoom el marco se suelta del libro y se vuelve el
 * espacio disponible: el doblece ampliado ya no cabe y lo que sobra es
 * justamente lo que el lector tiene que recorrer.
 */
export const bookViewport = (): BookSheet => {
  const { width, height } = room();

  return { width, height, spread: width };
};

/** El más pequeño de los topes, ya en píxeles enteros de pantalla. */
const clamp = (...limits: number[]): number => Math.floor(Math.min(...limits));

/**
 * Doblece: dos hojas, la lectura normal en escritorio.
 *
 * El alto disponible es el que manda, porque de él sale la proporción del
 * doblece; el ancho de la ventana solo actúa de tope.
 */
const spreadSheet = (maxHeight: number, availableWidth: number): BookSheet => {
	const width = Math.floor(
		Math.min(availableWidth, maxHeight * SPREAD_ASPECT) / 2,
	);

	return { width, height: Math.floor((width * 2) / SPREAD_ASPECT), spread: width * 2 };
};

/**
 * Una sola hoja, para cuando el doblece quedaría demasiado estrecho.
 *
 * Acá manda el ancho: una hoja sola aprovecha mucho mejor una ventana
 * estrecha, y el alto solo la acota.
 */
const singleSheet = (maxHeight: number, availableWidth: number): BookSheet => {
	const width = clamp(
		availableWidth,
		maxHeight * BOOK_RENDERED_ASPECT,
		BOOK_SHEET.narrowMax,
	);

	return { width, height: Math.floor(width / BOOK_RENDERED_ASPECT), spread: width };
};

/**
 * Cómo mide el visor una hoja. `page-flip` mide en píxeles, no en porcentajes.
 *
 * Se miden las dos layouts y se elige el doblece salvo que su hoja quede más
 * estrecha que lo que se lee bien. Por eso la decisión no depende de una marca
 * de pantalla: una tablet con sitio de sobra lee de dos en dos, y un teléfono
 * y una ventana estrecha comparten la misma respuesta, que es la correcta.
 */
export const measureBookSheet = (): BookSheet => {
	const space = room();
	const maxHeight = space.height * BOOK_SHEET.fit;
	const availableWidth = space.width * BOOK_SHEET.fit;

	const twoUp = spreadSheet(maxHeight, availableWidth);

	return twoUp.width >= BOOK_SHEET.minReadableWidth
		? twoUp
		: singleSheet(maxHeight, availableWidth);
};
