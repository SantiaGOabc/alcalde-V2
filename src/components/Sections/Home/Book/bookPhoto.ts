import type { BookImage } from "@types";

/* ==========================================================================
   Las medidas de una foto
   --------------------------------------------------------------------------
   `astro:assets` no acepta `<Image src="una/url">` sin `width` y `height`, y una
   URL no los trae. Para una foto importada de `src/assets` sí los trae, y
   además son los de verdad: pasándole unos inventados, Astro redimensiona o
   recorta la foto sin avisar.

   Las dos cosas se resuelven aquí, en un solo sitio, y no en cada celda del
   bento: quien dibuja solo pide el tamaño y nunca decide.
   ========================================================================== */

/** Ancho al que se piden las fotos remotas, que llegan sin dimensiones. */
const REMOTE_WIDTH = 1000;

/** Ancho máximo al que se optimiza una foto local que ya trae medidas. */
const LOCAL_MAX_WIDTH = 1600;

export interface BookPhotoSize {
	width: number;
	height: number;
}

/**
 * Tamaño con el que se pide una foto.
 *
 * De una foto local se usan sus medidas, acotadas a `LOCAL_MAX_WIDTH` para no
 * pagar una transformación gigante, y con la misma proporción para que el
 * alto no sea un segundo invento. De una remota se toma un alto de proporción
 * vertical, que es la forma de hoja del libro, y por eso el segundo parámetro.
 */
export const photoSize = (
	src: BookImage["src"],
	ratio = 3 / 4,
): BookPhotoSize => {
	if (typeof src !== "string") {
		const width = Math.min(src.width, LOCAL_MAX_WIDTH);
		return { width, height: Math.round((width * src.height) / src.width) };
	}

	return { width: REMOTE_WIDTH, height: Math.round(REMOTE_WIDTH / ratio) };
};

/**
 * La URL de una foto, siempre como texto.
 *
 * Hace falta porque hay atributos HTML donde solo caben cadenas: el póster de
 * un `<video>`, o la URL que el visor lee de `data-book-video-poster`. Si la
 * foto es local, `src` es un `ImageMetadata` y Volcarlo tal cual en un atributo
 * escribiría "[object Object]" en el HTML, y el póster no saldría.
 */
export const imageUrl = (image: BookImage): string =>
	typeof image.src === "string" ? image.src : image.src.src;
