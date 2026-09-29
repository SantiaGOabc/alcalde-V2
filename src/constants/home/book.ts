import type {
  BookImage,
  BookMeta,
  BookPage,
  BookPhoto,
  BookVideo,
} from "@types";
import { SECTION_BOOK_CONTENT } from "./home";

/* ==========================================================================
   El libro digital
   --------------------------------------------------------------------------
   El libro es un ÁLBUM DE FOTOGRAFÍAS, y en eso se diferencia de un documento.
   Las hojas de contenido NO llevan texto encima: ni antetítulo, ni párrafo, ni
   pies, ni listas de obras. Solo fotos, pegadas al papel.

   El texto va en sus propias hojas: una hoja EN BLANCO con el título centrado
   en el medio de la plana, cada dos hojas de fotos. Por eso hay dos `kind` y no
   uno con texto opcional —si el título fuera un campo de la hoja de fotos,
   tarde o temprano volvería a aparecer texto sobre una imagen.

   Eso también se ve en los tipos: `BookPage` solo tiene `kind`, `label`,
   `photos`, `layout` y, si hace falta, la banda de video.

   CÓMO SE ESCRIBE UNA HOJA
   ------------------------
   Hoja de fotos:

       {
         kind: "page",
         label: "El Centro y sus Espacios",
         photos: [una, dos, tres],
       }

   Hoja de título:

       { kind: "section", label: "La Ciudad que Cambió" }

   - `label` es lo que se ve (en la hoja de título) y lo que aparece en el
     índice. En una hoja de fotos solo se usa para el índice.
   - `photos` decide la forma de la hoja por cuántas sean: dos en fila, tres con
     una ancha debajo, cuatro en cuadrícula, cinco con una ancha debajo (ver
     `BookGroup.astro`).
   - `layout` existe para las pocas páginas que deserven saltarse el criterio.
   - El título de cada foto va en su pie, en blanco y centrado. `badge` es la
     etiqueta corta de la esquina, para lo que merece ser marcado (`PANORÁMICA`,
     `RENOVADA`…). `title: "clean"` deja la foto sin rótulo.
   ========================================================================== */

/**
 * Textos de las tapas y del rótulo del libro cerrado.
 *
 * Deliberadamente NO incluye el antetítulo, el título, la bajada ni el texto
 * del botón: esos son de la tarjeta de la sección y llegan a `Book.astro` como
 * props desde `SECTION_BOOK_CONTENT`, de modo que la tarjeta y el libro no
 * puedan contradecirse.
 */
export const BOOK_META: BookMeta = {
  coverKicker: SECTION_BOOK_CONTENT.eyebrow,
  coverImage: SECTION_BOOK_CONTENT.imageURL,
  coverAlt: SECTION_BOOK_CONTENT.imageAlt,
  coverLines: ["Cocha,", "la mejor ciudad", "de Bolivia"],
  coverNote: "De los años 90 a la gestión 2021–2026",
  coverHint: "Toca para abrir",
  backTitle: "Una visión puede cambiar una ciudad",
  backText:
    "De los primeros puentes a la tecnología; de los parques a los hospitales; del agua a las grandes avenidas, la historia de Cochabamba sigue escribiéndose. Porque una obra puede cambiar un lugar. Pero una visión puede cambiar una ciudad.",
  backCredits:
    "Gobierno Autónomo Municipal de Cochabamba · Gestión Manfred Reyes Villa · 2021–2026",
};

/* --------------------------------------------------------------------------
   Fotografías
   --------------------------------------------------------------------------
   Las fotos están en `public/`, así que van como ruta y ya está: no hay que
   importarlas ni registrar nada. Cuando se añada una, se escribe su ruta en
   esta tabla y se le da un nombre, y la hoja correspondiente.

   `BookImage` acepta igual una URL, un archivo de `public/` o una imagen
   importada de `src/assets`, así que cambiar una de estas fotos por una
   importada no obliga a tocar nada más del libro.
   -------------------------------------------------------------------------- */

/** Una foto de `public/`, con su texto alternativo. */
const photo = (src: string, alt: string): BookImage => ({ src, alt });

/** Una foto con el título que sale en su pie dentro del bento. */
const titled = (
  image: BookImage,
  name: string,
  extra?: Pick<BookPhoto, "badge" | "title">,
) => ({ ...image, name, ...extra });

const PHOTO = {
  cocha: photo("/cocha.jpg", "Panorámica de la ciudad de Cochabamba"),
  alalay: photo("/lagunaAlalay.jpeg", "Laguna Alalay recuperada"),
  turquesa: photo("/playaTurquesa.JPG", "Playa Turquesa, espacio público recuperado"),
  banderas: photo("/plazaBanderas.jpg", "Plaza de las Banderas"),
  teleferico: photo("/teleferico.jpg", "El teleférico y el centro de la ciudad"),
  alcalde: photo("/alcalde/alcalde.jpg", "El alcalde trabajando"),
  cinta: photo("/alcalde/cinta.jpg", "Corte de cinta de una obra"),
  colegio: photo("/alcalde/colegio.webp", "Módulo educativo"),
  ninos: photo("/alcalde/niños.webp", "Los niños de la comunidad"),
  perrito: photo("/alcalde/perrito.webp", "Un perro de la comunidad"),
  policia: photo("/alcalde/policia.jpeg", "Supervisión en obra"),
  senora: photo("/alcalde/señora.webp", "Una vecina de la comunidad"),
  premio1: photo("/premios/premio1.JPG", "Reconocimiento"),
  premio2: photo("/premios/premio2.JPG", "Entrega de un premio"),
  premio3: photo("/premios/premio3.jpeg", "Premio a la gestión municipal"),
} as const;

/** Video del libro. Cloudinary, igual que el video de la biografía. */
const VIDEO_OBRAS: BookVideo = {
  src: "https://res.cloudinary.com/dxjv8gq3e/video/upload/v1697040915/hero-video_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1.mp4",
  alt: "Panorámica de las obras de la gestión 2021–2026",
};

/* --------------------------------------------------------------------------
   Las hojas, en orden de lectura
   --------------------------------------------------------------------------
   El orden del array ES el orden de las páginas. `kind` decide con qué
   plantilla se dibuja cada una; añadir una hoja es añadir un objeto, sin
   tocar ningún componente.

   LA REGLA: dos hojas de fotos y, delante de cada pareja, una hoja en blanco
   con el título en el centro. Ni la hoja en blanco lleva fotos, ni las hojas de
   fotos llevan título. Son dos cosas separadas, y por eso hay dos `kind`.

   Con 15 fotos salen tres bloques de dos hojas: 2 + 3, 2 + 3 y 2 + 3. Cada
   bloque abre con su título, así que el libro entero queda en 9 hojas más las
   dos tapas.
   -------------------------------------------------------------------------- */
export const BOOK_PAGES: readonly BookPage[] = [
  { kind: "cover", label: "Portada" },

  /* ══ BLOQUE 1: LA CIUDAD ══ */
  { kind: "section", label: "La Ciudad que Cambió" },
  {
    kind: "page",
    label: "Cochabamba Hoy",
    photos: [
      titled(PHOTO.cocha, "Cochabamba Ciudad Jardín", { badge: "PANORÁMICA" }),
      titled(PHOTO.turquesa, "Playa Turquesa"),
    ],
  },
  {
    kind: "page",
    label: "El Centro y sus Espacios",
    photos: [
      titled(PHOTO.teleferico, "El Teleférico"),
      titled(PHOTO.banderas, "Plaza de las Banderas", { badge: "RENOVADA" }),
      titled(PHOTO.alalay, "Laguna Alalay", { badge: "MEDIO AMBIENTE" }),
    ],
  },

  /* ══ BLOQUE 2: OBRAS ══ */
  { kind: "section", label: "Obras de Impacto" },
  {
    kind: "page",
    label: "Espacios Públicos",
    photos: [
      titled(PHOTO.premio2, "Reconocimiento a la obra", { badge: "DESTACADO" }),
      titled(PHOTO.cinta, "Corte de Cinta"),
    ],
  },
  {
    kind: "page",
    label: "Educación y Salud",
    photos: [
      titled(PHOTO.premio1, "Premio a la gestión"),
      titled(PHOTO.colegio, "Nuevos Módulos Educativos"),
      titled(PHOTO.premio3, "Placas de reconocimiento"),
    ],
    banner: {
      title: "Conoce más →",
      subtitle: "Ver video oficial de las obras",
      video: VIDEO_OBRAS,
      poster: PHOTO.turquesa,
      actionLabel: "Reproducir",
    },
  },

  /* ══ BLOQUE 3: LA GENTE ══ */
  { kind: "section", label: "Cerca de la Gente" },
  {
    kind: "page",
    label: "La Comunidad",
    photos: [
      titled(PHOTO.ninos, "Educación y Niñez"),
      titled(PHOTO.senora, "Vizinanza y Cuidado"),
    ],
  },
  {
    kind: "page",
    label: "Supervisión en Obra",
    photos: [
      titled(PHOTO.alcalde, "El alcalde en obra"),
      titled(PHOTO.policia, "Vigilancia y seguridad"),
      titled(PHOTO.perrito, "La comunidad también"),
    ],
  },

  { kind: "back", label: "Contraportada" },
];
