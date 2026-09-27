export const CONTENT_HERO_HOME = {
  title: "El Valor del Trabajo, la Cercanía y el Compromiso",
  description: "Manfred Reyes Villa",
  // TODO: ESTAS IMAGENES DEBERIAN VENIR DEL CMS CON getImages() DE UTILS
  images: [
    "https://manfredreyesvilla.netlify.app/_astro/DSC_0802_ZuLMnQ.webp",
    "https://manfredreyesvilla.netlify.app/_astro/6P9A2287_V5pXO.webp",
    "https://manfredreyesvilla.netlify.app/_astro/DSC_0802_ZuLMnQ.webp",
    "https://manfredreyesvilla.netlify.app/_astro/6P9A2287_V5pXO.webp",
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
    poster: "https://manfredreyesvilla.netlify.app/_astro/DSC_0802_ZuLMnQ.webp", // TODO: AÑADIR POSTER DEL VIDEO
    type: "video/mp4",
    url: "https://res.cloudinary.com/dxjv8gq3e/video/upload/v1697040915/hero-video_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1.mp4",
  },
};

export const SECTION_PHRASES_CONTENT = {
  philosophy: {
    phrase:
      "El trabajo honesto y la cercanía con la gente son la base de todo.",
    imageURL:
      "https://manfredreyesvilla.netlify.app/_astro/DSC_0802_ZuLMnQ.webp",
  },
  family: {
    phrase:
      "En la familia aprendemos el valor de estar, incluso cuando nadie mira.",
    imageURL:
      "https://manfredreyesvilla.netlify.app/_astro/DSC_0803_ZuLMnQ.webp",
  },
  pets: {
    phrase: "Los que nunca piden palabras enseñan lo que es la lealtad.",
    imageURL:
      "https://manfredreyesvilla.netlify.app/_astro/DSC_0804_ZuLMnQ.webp",
  },
  community: {
    phrase:
      "Una ciudad cambia el día en que sus vecinos vuelven a sentirse parte.",
    imageURL:
      "https://manfredreyesvilla.netlify.app/_astro/DSC_0805_ZuLMnQ.webp",
  },
};

export const SECTION_BEFORE_AFTER_CONTENT = {
  title: "Una persona, ciudad que transforman",
  description:
    "Imágenes que muestran cómo cambian sus espacios y la vida de sus habitantes.",
  transitionPhrase: "Pioneros en ...",
  before: [
    {
      title: "Capitán Manfred Reyes Villa",
      imageURL: "https://manfredreyesvilla.netlify.app/_astro/DSC_0801_ZuLMnQ.webp",
      imageFit: "contain",
    },
    {
      title: "Laguna Coña Coña",
      imageURL:
        "https://manfredreyesvilla.netlify.app/_astro/DSC_0806_ZuLMnQ.webp",
      imageFit: "cover",
    },
    {
      title: "Plaza de las banderas",
      imageURL:
        "https://manfredreyesvilla.netlify.app/_astro/DSC_0807_ZuLMnQ.webp",
        imageFit: "cover",
    },
    {
      title: "Laguna Alalay",
      imageURL:
        "https://manfredreyesvilla.netlify.app/_astro/DSC_0808_ZuLMnQ.webp",
        imageFit: "cover",
    },
  ],

  after: [
    {
      title: "Prefecto Manfred Reyes Villa",
      imageURL: "https://manfredreyesvilla.netlify.app/_astro/DSC_0802_ZuLMnQ.webp",
      imageFit: "contain",
    },
    {
      title: "Playa Turquesa",
      imageURL:
        "https://manfredreyesvilla.netlify.app/_astro/6P9A2287_V5pXO.webp",
        imageFit: "cover",
    },
    {
      title: "Plaza de las banderas",
      imageURL:
        "https://manfredreyesvilla.netlify.app/_astro/DSC_0810_ZuLMnQ.webp",
        imageFit: "cover",
    },
    {
      title: "Laguna Alalay",
      imageURL:
        "https://manfredreyesvilla.netlify.app/_astro/DSC_0811_ZuLMnQ.webp",
        imageFit: "cover",
    },
  ],
};

export const SECTION_BOOK_CONTENT = {
  title: "Cocha, la mejor ciudad",
  eyebrow: "El libro digital · Cochabamba",
  description:
    "Un recorrido en imágenes por las obras que transformaron Cochabamba, desde los años 90 hasta la gestión 2021–2026. Fotografías y videos, página por página.",
  imageURL:
    "https://manfredreyesvilla.netlify.app/_astro/6P9A2287_V5pXO.webp",
  imageAlt: "Playa Turquesa, uno de los espacios transformados de Cochabamba",
  button: "Abrir libro",
};
