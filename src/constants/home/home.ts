// Todas las fotos de la web viven en `public/` y se nombran con el ayudante de su
// carpeta (`raiz`, `alcalde`, `premio`, `book` — ver `src/utils/images.ts`). Antes
// estas rutas apuntaban al deploy viejo de Netlify, que ya no responde (503), así
// que cada card se veía sin foto. Ahora ninguna depende de fuera.
import { alcalde, antes, book, premio, raiz } from "@utils";

export const CONTENT_HERO_HOME = {
  title: "El Valor del Trabajo, la Cercanía y el Compromiso",
  description: "Manfred Reyes Villa",
  // Carrusel del hero: las cuatro panorámicas más anchas de la ciudad, que son las
  // que aguantan un recorte a pantalla completa. Cuando el CMS exponga las
  // imágenes del hero (getImages() de @utils), este arreglo pasa a ser el valor
  // por defecto y lo de arriba es solo el respaldo.
  images: [
    alcalde("niños.webp"),
    alcalde("colegio.webp"),
    alcalde("señora.webp"),
    alcalde("IMG_8396.jpg")
  ],
};

export const SECTION_BIOGRAPHY_CONTENT = {
  title: "¿Quién soy?",
  description: `Manfred Reyes Villa es un líder político boliviano con una trayectoria dedicada al desarrollo de Cochabamba. Con experiencia en gestión pública y un compromiso inquebrantable con el progreso de su ciudad, ha impulsado proyectos fundamentales que transforman la vida de los cochabambinos.`,
  buttons: [
    {
      primary: "Más sobre mí",
      url: "/about",
    },
    {
      secondary: "Gestión completa",
      url: "/management",
    },
  ] as const,
  video: {
    // Póster del video: la foto que se ve mientras carga. Sin él el reproductor
    // aparece en negro, que es lo que pasaba antes con la foto del deploy viejo.
    poster: alcalde("alcalde.jpg"),
    type: "video/mp4",
    url: "https://res.cloudinary.com/dxjv8gq3e/video/upload/v1697040915/hero-video_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1.mp4",
  },
};

export const SECTION_PHRASES_CONTENT = {
  // Cada frase lleva la foto que la acompaña. Las cuatro son de gente y de calles,
  // que es justo de lo que hablan: el trabajo, la familia, los animales, el barrio.
  philosophy: {
    phrase:
      "El trabajo honesto y la cercanía con la gente son la base de todo.",
    imageURL: alcalde("colegio.webp"),
  },
  family: {
    phrase:
      "En la familia aprendemos el valor de estar, incluso cuando nadie mira.",
    imageURL: alcalde("esposa.jpg"),
  },
  pets: {
    phrase: "Los que nunca piden palabras enseñan lo que es la lealtad.",
    imageURL: alcalde("perrito.webp"),
  },
  community: {
    phrase:
      "Una ciudad cambia el día en que sus vecinos vuelven a sentirse parte.",
    imageURL: alcalde("niños.webp"),
  },
};

// Las listas `before` y `after` se alinean por índice: cada par es la misma
// obra antes y después de la gestión.
export const SECTION_BEFORE_AFTER_CONTENT: {
  title: string;
  description: string;
  transitionPhrase: string;
  before: Array<{
    title: string;
    imageURL: string;
    imageFit: "contain" | "cover";
  }>;
  after: Array<{
    title: string;
    imageURL: string;
    imageFit: "contain" | "cover";
  }>;
} = {
  title: "Un Legado de Progreso",
  description:
    "Las fotografías cuentan aquello que muchas veces las palabras no pueden explicar",
  transitionPhrase: "De una ciudad de ayer a una ciudad que mira al futuro",
  before: [
    {
      title: "Capitán Manfred Reyes Villa",
      imageURL: alcalde("policia.jpeg"),
      imageFit: "contain",
    },
    {
      title: "Laguna Coña Coña",
      imageURL: raiz("CoñaCoñaAntes.jpg"),
      imageFit: "cover",
    },
    {
      title: "Plaza de las banderas",
      imageURL: raiz("PlazaBanderasAntes.png"),
      imageFit: "cover",
    },
    {
      title: "Laguna Alalay",
      imageURL: raiz("LagunaAlalayAntes.jpg"),
      imageFit: "cover",
    },
  ],
  after: [
    {
      title: "Prefecto Manfred Reyes Villa",
      imageURL: alcalde("prefecto.jpg"),
      imageFit: "contain",
    },
    {
      title: "Playa Turquesa",
      imageURL: raiz("playaTurquesa.JPG"),
      imageFit: "cover",
    },
    {
      title: "Plaza de las banderas",
      imageURL: raiz("plazaBanderas.jpg"),
      imageFit: "cover",
    },
    {
      title: "Laguna Alalay",
      imageURL: raiz("lagunaAlalay.jpeg"),
      imageFit: "cover",
    },
  ],
} as const;

export const SECTION_BOOK_CONTENT = {
  title: "Cocha, la mejor ciudad",
  eyebrow: "El libro digital · Cochabamba",
  description:
    "Un recorrido en imágenes por las obras que transformaron Cochabamba, desde los años 90 hasta la gestión 2021–2026. Fotografías y videos, página por página.",
  // Foto de la tarjeta del libro y de su tapa: la misma imagen en los dos sitios,
  // para que la tarjeta y el libro no puedan contradecirse.
  imageURL: book("LIBRO PKK_Optimizer_page_1.webp"),
  imageAlt: "La tapa de Cocha, la mejor ciudad",
  button: "Abrir libro",
};

