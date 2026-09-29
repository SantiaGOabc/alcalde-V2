import type { BookLayout, BookPage, BookPhoto } from "@types";

/* ==========================================================================
   El bento
   --------------------------------------------------------------------------
   Cuántas fotos trae una hoja y en qué forma se reparten son la misma decisión.
   Si quien escribe la página tuviera que declarar las dos, se podrían
   contradecir —cuatro fotos con una forma que solo admite tres, cinco con la de
   cuatro— y el fallo sale en la hoja, ya en el navegador.

   Aquí se deciden las dos juntas: la página dice cuántas fotos tiene y esta
   tabla dice qué forma las contiene. Por eso `BookPage.layout` es opcional y
   solo existe para las páginas que deserven saltarse el criterio.
   ========================================================================== */

/**
 * Cuántas fotos caben en cada forma.
 *
 * Es el techo, no la cuenta: una página puede traer menos de las que su forma
 * admite (una sola foto en `quad-grid` deja tres huecos vacíos) y `BookBento`
 * dibuja las que haya, sin huecos de relleno.
 */
export const BENTO_CAPACITY: Record<BookLayout, number> = {
	single: 1,
	"double-vertical": 2,
	"triple-top": 3,
	"triple-bottom": 3,
	"quad-grid": 4,
	"quad-featured-bottom": 4,
	"five-bottom-featured": 5,
	"five-top-featured": 5,
	"grid-three": 9,
};

/**
 * La forma que le toca a cada número de fotos.
 *
 * La cuenta empieza en uno y sube de uno en uno, así que la tabla es también el
 * índice: `AUTO_BENTO[n]` es la respuesta a "¿qué hago con n fotos?". No hay
 * entradas porque no hacen falta, y por eso se cubre con `grid-three` todo lo
 * que se pase del máximo.
 */
const AUTO_BENTO: Record<number, BookLayout> = {
	1: "single",
	2: "double-vertical",
	3: "triple-top",
	4: "quad-grid",
	5: "five-bottom-featured",
};

/**
 * La forma con la que se dibuja una hoja.
 *
 * `forced` es el `layout` que la página declara a mano, si lo declara: manda
 * sobre el criterio. Solo lo usan las páginas que lo necesitan.
 */
export const bentoLayoutOf = (
	photos: number,
	forced?: BookLayout,
): BookLayout => forced ?? (AUTO_BENTO[photos] ?? "grid-three");

/**
 * Las fotos que de verdad se pintan, recortadas a lo que la forma admite.
 *
 * Recortar aquí y no en la plantilla deja el recorte en un solo sitio: la
 * plantilla recibe siempre exactamente las fotos que va a dibujar, y no tiene
 * que saber cuántas caben.
 */
export const bentoPhotosOf = (
	photos: readonly BookPhoto[],
	layout: BookLayout,
): BookPhoto[] => photos.slice(0, BENTO_CAPACITY[layout]);

/**
 * Las fotos de una hoja, de donde vengan.
 *
 * `image` es el atajo de siempre para la página de una sola foto, y `photos` la
 * forma larga. Aceptar las dos evita reescribir las páginas que ya estaban.
 */
export const photosOfPage = (page: BookPage): readonly BookPhoto[] =>
	page.photos ?? (page.image ? [{ ...page.image }] : []);

/**
 * Si la hoja lleva bento o es una foto a sangre.
 *
 * Una sola foto NO lleva bento: llena la hoja entera y se lee como una
 * fotografía grande, que es lo que se busca. El bento es para cuando hay que
 * comparar o recorrer varias en la misma página, y con dos ya tiene sentido.
 */
export const isBentoPage = (photos: readonly BookPhoto[]): boolean =>
	photos.length > 1;
