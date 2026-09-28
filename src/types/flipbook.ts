/* ==========================================================================
   Tipos del libro digital (flipbook)
   --------------------------------------------------------------------------
   El libro se describe con DATOS, no con JSX. Un único array de páginas
   alimenta a la vez el motor de volteo, las plantillas de página y el índice.
   Por eso el índice no puede desincronizarse del contenido: se deriva de aquí.
   ========================================================================== */

/** Imagen del libro: URL absoluta o ruta bajo `public/`. */
export interface BookImage {
  src: string;
  /** Texto alternativo. Obligatorio: la página se lee sin imágenes. */
  alt: string;
}

/** Obra citada en la lista corta del pie de una página. */
export interface BookWork {
  name: string;
  /** Año de entrega. Si no consta, la obra se muestra sin año. */
  year?: number;
}

/**
 * Plantilla con la que se dibuja la página.
 *
 * - `cover` / `back`: tapas duras a página completa, sin texto corrido.
 * - `page`: página de papel con título, texto, media y lista de obras.
 */
export type BookPageKind = "page" | "cover" | "back";

/**
 * Una página del libro. Todos los campos son opcionales salvo `kind` y `label`,
 * de modo que añadir una página es añadir un objeto: no tocar ningún
 * componente. El orden del array ES el orden de las páginas.
 */
export interface BookPage {
  kind: BookPageKind;
  /**
   * Título de la página y, a la vez, etiqueta de su entrada en el índice.
   * Se escribe una sola vez: el índice lo lee de aquí.
   */
  label: string;
  /** Antetítulo en versalitas (área, periodo, apartado). */
  kicker?: string;
  /** Texto corrido de la página. */
  body?: string;
  /** Pie de foto o de imagen. */
  caption?: string;
  /** Foto principal: ocupa el alto disponible de la página. */
  image?: BookImage;
  /** Dos fotos comparativas, siempre en el orden `antes`, `después`. */
  gallery?: readonly [BookImage, BookImage];
  /** Video ampliable. Tiene prioridad sobre `image` si vienen ambos. */
  video?: BookImage;
  /** Obras citadas al pie de la página. */
  works?: readonly BookWork[];
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
  coverLines: readonly string[];
  /** Texto bajo el rótulo de la tapa. */
  coverNote: string;
  /** Título de la contraportada. */
  backTitle: string;
  /** Texto de la contraportada. */
  backText: string;
  /** Pie de foto de la página comparativa antes/después. */
  compareCaption: string;
}


/* --------------------------------------------------------------------------
   Estado interno del visor
   -------------------------------------------------------------------------- */

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

