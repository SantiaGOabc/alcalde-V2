/* ==========================================================================
   Tipos del libro digital (flipbook)
   --------------------------------------------------------------------------
   El libro se describe con DATOS, no con JSX. Un único array de páginas
   alimenta a la vez el motor de volteo, las plantillas de página y el índice.
   Por eso el índice no puede desincronizarse del contenido: se deriva de aquí.
   ========================================================================== */

import type { ImageMetadata } from "astro";

/**
 * Imagen del libro.
 *
 * `src` admite tres cosas y por eso es unión: una URL absoluta (las fotos que
 * hay hoy, servidas desde el dominio permitido en `astro.config.mjs`), una ruta
 * bajo `public/`, o una imagen importada de `src/assets` —que llega ya como
 * `ImageMetadata` con sus medidas, y así el libro puede aceptar fotos locales
 * sin tocar una sola línea más.
 */
export interface BookImage {
  src: string | ImageMetadata;
  /** Texto alternativo. Obligatorio: la página se lee sin imágenes. */
  alt: string;
}

/**
 * Cómo se rotula una foto dentro del bento.
 *
 * Solo hay dos, porque solo hay dos cosas que se pueden hacer con el texto: ponerlo
 * o no ponerlo.
 *
 * - `overlay`: el título en blanco, centrado, al pie de la foto, sobre un velo
 *   negro degradado. Es el que dice qué es, así que es el de por defecto.
 * - `clean`: sin título. Para las panorámicas que ya se leen solas.
 */
export type BookPhotoTitle = "overlay" | "clean";

/**
 * Video: siempre una URL.
 *
 * Es un tipo aparte y no un `BookImage` porque a un video no se le pide ancho ni
 * alto, y `ImageMetadata` no significaría nada ahí. Pasarlo por el mismo tipo
 * dejaría abierta la posibilidad de importarlo, y el error saldría al pintar
 * `data-book-video-url`.
 */
export interface BookVideo {
  /** URL del archivo de video, o de un embed de YouTube. */
  src: string;
  /** Texto alternativo: es lo que se anuncia y lo que sale bajo el video. */
  alt: string;
}

/** Una foto del bento: una imagen y, si hace falta, su título. */
export interface BookPhoto extends BookImage {
  /** Título de la foto. Es lo que aparece bajo ella y al ampliarla. */
  name?: string;
  /** Etiqueta corta arriba a la izquierda: `PANORÁMICA`, `ANTES`… */
  badge?: string;
  /** Cómo se pinta `name`. Por defecto, `overlay`. */
  title?: BookPhotoTitle;
}

/**
 * Formas del bento, de menos a más fotos.
 *
 * El libro elige solo la que le toca por cuántas fotos traiga la página (ver
 * `bentoLayoutOf` en `bookBento.ts`), así que normalmente nadie escribe esto a
 * mano. Está en los tipos porque hay páginas que deservecen una forma concreta
 * aunque su número de fotos no la imponga: se declara en `BookPage.layout` y
 * manda sobre el criterio automático.
 */
export type BookLayout =
  /** Una foto a sangre, la hoja entera. */
  | "single"
  /** Dos apiladas: una arriba, otra abajo. */
  | "double-vertical"
  /** Tres: dos arriba y una ancha abajo. */
  | "triple-top"
  /** Tres: una ancha arriba y dos abajo. */
  | "triple-bottom"
  /** Cuatro en cuadrícula 2×2. */
  | "quad-grid"
  /** Cuatro: tres en fila arriba y una panorámica abajo. */
  | "quad-featured-bottom"
  /** Cinco: 2×2 arriba y una panorámica abajo. */
  | "five-bottom-featured"
  /** Cinco: una panorámica arriba y 2×2 abajo. */
  | "five-top-featured"
  /** Seis o más, en tres columnas. */
  | "grid-three";

/**
 * Banda de video dentro de una hoja.
 *
 * Es una llamada a la acción, no un reproductor: muestra la portada del video y
 * un botón. Al pulsarla se abre el reproductor del visor por encima del libro,
 * que es donde se reproduce. Añadirla es opt-in: si la página no trae `banner`,
 * no se pinta banda.
 */
export interface BookBanner {
  title: string;
  subtitle?: string;
  /** El video a reproducir. */
  video: BookVideo;
  /**
   * Foto de portada del video. Si viene, la banda la pinta de fondo y el
   * reproductor la usa como póster, para que al abrir no salte un rectángulo
   * negro en mitad de la hoja.
   */
  poster?: BookImage;
  /** Texto del botón. Por defecto, "Reproducir". */
  actionLabel?: string;
  /**
   * Dónde se coloca dentro de la hoja. Solo `double-vertical` lo usa, porque es
   * la única forma que tiene huecos donde meter una banda: arriba, en medio o
   * abajo de las dos fotos.
   */
  position?: "top" | "middle" | "bottom";
}

/**
 * Plantilla con la que se dibuja la página.
 *
 * - `cover` / `back`: una foto a sangre, tapa dura a página completa. La `cover`
 *   toma la foto de la propia página y, si no trae ninguna, cae a la de
 *   `BookMeta`, que es el caso de la tapa real.
 * - `page`: hoja de álbum, solo fotos en bento. Sin título encima.
 * - `section`: hoja de papel blanco con el título centrado en el medio y nada
 *   más. Es la que separa los bloques de dos en dos.
 */
export type BookPageKind = "page" | "section" | "cover" | "back";

/**
 * Una página del libro.
 *
 * El libro es un álbum de fotos, no un texto. En una hoja de contenido solo hay
 * fotos: ni antetítulo, ni párrafo, ni pie de foto, ni lista de obras. El
 * título de cada bloque va en su propia hoja en blanco, la de `section`.
 *
 * Todos los campos son opcionales salvo `kind` y `label`, de modo que añadir
 * una página es añadir un objeto sin tocar ningún componente. El orden del
 * array ES el orden de las páginas.
 *
 * La forma de la hoja sale de las fotos que trae, no de un campo aparte (ver
 * `bookBento.ts`): una sola foto llena la página a sangre, dos o más se reparten
 * en bento.
 */
export interface BookPage {
  kind: BookPageKind;
  /**
   * Título de la página y, a la vez, etiqueta de su entrada en el índice.
   * Se escribe una vez: el índice lo lee de aquí.
   */
  label: string;
  /**
   * Fotos de la página. Es lo que decide la forma de la hoja, así que casi
   * siempre es lo único que hace falta escribir.
   *
   * En una hoja `cover` solo se dibuja la primera: la hoja es una única foto a
   * sangre, así que las que sobren no llegan a verse.
   */
  photos?: readonly BookPhoto[];
  /**
   * Fuerza una forma concreta en vez de dejar que la elija el número de fotos.
   * Solo para las páginas que la necesitan: el resto no lo lleva.
   */
  layout?: BookLayout;
  /**
   * Foto principal a sangre. Es el atajo para la página de una sola foto: con
   * `photos` no hace falta.
   */
  image?: BookImage;
  /** Banda de video. Añade una llamada a la acción sobre el libro. */
  banner?: BookBanner;
  /** Video sin banda. Dibuja la misma tarjeta, con el rótulo por defecto. */
  video?: BookVideo;
}

/**
 * Textos de las tapas y del rótulo que se ve en el libro cerrado.
 *
 * Solo guarda lo que el libro necesita. El antetítulo, el título, la bajada y
 * el texto del botón NO viven aquí: son de la tarjeta de la sección y llegan
 * al componente como props, para que la tarjeta y el libro no puedan
 * contradecirse.
 */
export interface BookMeta {
  /** Antetítulo de la tapa. */
  coverKicker: string;
  /** Imagen de tapa: alimenta la tapa del visor y el libro cerrado en 3D. */
  coverImage: string;
  /** Texto alternativo de la imagen de tapa. */
  coverAlt: string;
  /** Rótulo de la tapa: normalmente dos o tres líneas cortas. */
}

/**
 * Fases del visor. Es una máquina de estados explícita porque abrir y cerrar
 * son animaciones y no un simple booleano: hay que saber si terminar la
 * animación de entrada (`opening`) o la de salida (`closing`).
 */
export type BookPhase = "closed" | "opening" | "open" | "closing";

/** Medidas de una hoja del libro, ya ajustadas a la ventana del navegador. */
export interface BookSheet {
  /** Ancho de UNA hoja. El libro abierto muestra dos. */
  width: number;
  /** Alto de la hoja. */
  height: number;
  /** Ancho del libro abierto: el doble de `width`. */
  spread: number;
}

