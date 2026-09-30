/* ==========================================================================
   El visor del libro
   --------------------------------------------------------------------------
   Ajustes que el JavaScript necesita conocer. Números, no estilos: cómo se
   ven las cosas es cosa de `src/styles/flipbook.css`.

   Van agrupados en objetos y no sueltos porque se usan siempre juntos. Una
   constante aislada obliga a buscarla; un objeto dice de entrada a qué
   pertenece y dónde está la empresa de sus colegas.
   ========================================================================== */

/**
 * Cómo se mide una hoja.
 *
 * El libro abierto son dos hojas, así que su proporción es el doble de la de
 * una; en pantalla estrecha no cabe el doble y se muestra una sola.
 */
export const BOOK_SHEET = {
  /** Proporción de UNA hoja (ancho / alto). Las páginas son 1388 x 1700 (~0.816). */
  aspect: 0.816,
  /** Proporción del libro respecto a la ventana. */
  fit: 0.9,
  /** Ensanche del libro abierto. */
  spreadBoost: 1.0,
  /**
   * Por debajo de este ancho de hoja, dos páginas a la vez se leen peor que una.
   *
   * Es un criterio de legibilidad, no de dispositivo: decide el tamaño que sale
   * de medir, no una marca de pantalla. Un teléfono pequeño y una ventana
   * estrecha en un monitor comparten la misma respuesta, que es la correcta.
   */
  minReadableWidth: 260,
  /**
   * Umbral con el que el motor de volteo decide si el doblece va en horizontal
   * o en vertical. page-flip compara el ancho del bloque contra el doble de
   * este valor, así que debe quedar entre la mitad y el ancho de UNA hoja.
   */
  orientationWidth: 200,
  /** Aire alrededor del libro abierto. */
  margin: 16,
  /** Reservado arriba, donde vive la barra de controles. */
  topInset: 56,
  /** Reservado abajo, donde viven el índice y el tamaño de letra. */
  bottomInset: 70,
  /**
   * Cuánto de la ventana pueden comerse los controles, como fracción.
   *
   * Los dosInsets de arriba son fijos, y en una ventana baja se comen el
   * libro entero: a 420px de alto quedaban 250px de aire y el doblece caía a
   * una hoja diminuta. Con este tope los controles ceden antes.
   */
  insetCap: 0.28,
  /** Tope del ancho de una hoja en pantalla estrecha. */
  narrowMax: 480,
} as const;

/**
 * Niveles del zoom de lectura, en orden creciente.
 *
 * La rueda no lleva un factor continuo sino que recorre esta lista, y el primer
 * elemento es el libro tal cual se abre. Escalonado y no continuo por una razón
 * práctica: con un factor continuo no hay forma de parar en un nivel concreto,
 * en un trackpad la rueda llega en impulsos finos y el libro nunca se queda
 * quieto, y la única forma de deshacer el zoom es devolver la rueda en sentido
 * contrario. Con una lista, un nivel por muesca, se sabe siempre en cuál se está
 * y se vuelve atrás igual de rápido que se avanza.
 *
 * Son factores sobre las medidas de `BOOK_SHEET`, no tamaños: subirlos agranda
 * la hoja de verdad —la vuelve a medir el motor— en vez de estirar la anterior.
 */
export const BOOK_ZOOM_STEPS = [1, 1.25, 1.5, 2, 2.5, 3] as const;

/**
 * Proporción con la que el motor dibuja UNA hoja.
 *
 * El papel mide 0,625, pero el ensanche existe para compensar la perspectiva con
 * la que se voltea el doblece, y eso ensancha la hoja: de ahí el `x spreadBoost`.
 * Ojo al signo, porque el motor calcula la altura como `ancho / proporción` y
 * cualquier equivocación ahí se ve de inmediato: con la proporción sin ensanchar
 * las hojas salían cuadradas y con la proporción del papel quedaban huecos a los
 * lados del libro.
 */
export const BOOK_RENDERED_ASPECT =
  BOOK_SHEET.aspect * BOOK_SHEET.spreadBoost;

/** Cada cuánto se desplaza el contenido al entrar una hoja. */
export const BOOK_REVEAL_STAGGER_MS = 70;

/**
 * Transiciones y sus redes de seguridad.
 *
 * Abrir y cerrar avisan con `transitionend`, pero esa señal no siempre llega
 * (movimiento reducido, pestaña en segundo plano, pestaña cerrada a mitad).
 * Cada duración tiene su red: la que la reemplaza si el evento no aparece.
 */
export const BOOK_TRANSITION = {
  open: 750,
  close: 650,
  /** Red de seguridad de `open`, holgada porque solo se usa si no hay evento. */
  openFallback: 1500,
  /** Red de seguridad de `close`. */
  closeFallback: 1400,
  /** Cuánto tarda el motor en voltear una hoja. */
  flip: 800,
  /** Barandilla: por encima de la red, ya es un fallo y no una lentitud. */
  guard: 3000,
} as const;

/**
 * Alto de hoja, en píxeles, al que están calibrados los tamaños en rem de las
 * plantillas de página.
 *
 * El texto de una hoja se escribe en rem, que no sabe nada del tamaño en
 * píxeles que mide `measureBookSheet`. Sin este ancla, la misma preferencia de
 * letra se leería cómoda en una ventana alta y desbordada en una baja: el
 * visor divide el alto medido entre este número para saber cuánto de grande o
 * pequeña quedó la hoja respecto al tamaño para el que se diseñó el texto.
 */
export const BOOK_TEXT_REFERENCE_HEIGHT = 640;

/**
 * Bordes del escalado resultante.
 *
 * Sin tope, una ventana muy baja dejaría el texto ilegible y una muy alta lo
 * dejaría enorme; estos números son los extremos en los que el texto se lee
 * bien sin desbordar la hoja.
 */
export const BOOK_TEXT_SCALE_RANGE = { min: 0.62, max: 1.4 } as const;

/* --------------------------------------------------------------------------
   Contrato entre las plantillas y el visor
   --------------------------------------------------------------------------
   Las hojas las escribe Astro y el visor las busca en el DOM, así que se
   comunican por atributos. Todos viven aquí para que una plantilla y el visor
   no puedan dejar de hablarse. Cada atributo tiene también su selector, que es
   lo mismo escrito con corchetes: se generan de aquí los dos.
   -------------------------------------------------------------------------- */

/** Marca cada parte del visor y de las hojas con la que se comunica. */
export const BOOK_ATTR = {
  /** Raíz de la sección. El visor se monta una vez aquí. */
  section: "data-book",
  /** Ya montado. Evita un segundo visor si el script corre dos veces. */
  ready: "data-book-ready",
  /** Cualquier cosa que abra el libro. */
  open: "data-book-open",
  /** Libro cerrado: de aquí sale el libro al abrirse. */
  anchor: "data-book-anchor",
  /** Donde Astro deja las hojas antes de que las coja el motor. */
  pages: "data-book-pages",
  /** El marcador que dice que el visor ya está montado. */
  overlay: "data-book-overlay",
  backdrop: "data-book-backdrop",
  frame: "data-book-frame",
  inner: "data-book-inner",
  block: "data-book-block",
  toolbar: "data-book-toolbar",
  footer: "data-book-footer",
  close: "data-book-close",
  prev: "data-book-prev",
  next: "data-book-next",
  /** Índice del libro: va por dobleces, no por hojas. */
  range: "data-book-range",
  pageLabel: "data-book-page-label",
  media: "data-book-media",
  mediaBody: "data-book-media-body",
  mediaAlt: "data-book-media-alt",
  mediaBack: "data-book-media-back",
  /** Título de la hoja, del que se deriva la entrada del índice. */
  label: "data-book-label",
  /** Convierte cualquier elemento de una hoja en algo ampliable. */
  expand: "data-book-expand",
  /** Marca un bloque para la animación de entrada de la hoja. */
  reveal: "data-book-reveal",
  /** URL del video de un elemento ampliable. */
  videoUrl: "data-book-video-url",
  /** Foto de portada de ese video: es el póster del reproductor. */
  videoPoster: "data-book-video-poster",
  /** Hoja ya visitada: dispara su contenido. La pinta el visor. */
  shown: "data-page-shown",
} as const;

/** El nombre de un atributo en forma de selector. */
export const attrSelector = (name: string): string => `[${name}]`;

/** Los selectores de todas las partes del visor, derivados de `BOOK_ATTR`. */
export const BOOK_SELECT = Object.fromEntries(
  Object.entries(BOOK_ATTR).map(([key, name]) => [key, attrSelector(name)]),
) as Record<keyof typeof BOOK_ATTR, string>;

/** Atributos que HTML escribe con guiones y JS lee con `dataset`. */
export const datasetKey = (name: string): string =>
  name.slice(5).replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
