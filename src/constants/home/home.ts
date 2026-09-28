import type { BookImage, BookMeta, BookPage } from "@types";

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

export const SECTION_BEFORE_AFTER_CONTENT: {
  title: string;
  description: string;
  transitionPhrase: string;
  before: Array<{
    title: string;
    imageURL: string;
    imageFit: "contain" | "cover";
  }>,
  after: Array<{
    title: string;
    imageURL: string;
    imageFit: "contain" | "cover";
  }>;
} = {
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

/* ==========================================================================
   El libro digital
   --------------------------------------------------------------------------
   El libro se describe con DATOS, no con plantillas. Un único array de
   páginas alimenta a la vez el motor de volteo, la plantilla `BookPage.astro`
   y el índice de navegación, así que el índice no puede quedar desfasado
   respecto al contenido: se deriva de aquí.
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
  backTitle: "Una visión puede cambiar una ciudad",
  backText:
    "De los primeros puentes a la tecnología; de los parques a los hospitales; del agua a las grandes avenidas, la historia de Cochabamba sigue escribiéndose. Porque una obra puede cambiar un lugar. Pero una visión puede cambiar una ciudad.",
  compareCaption: "Fotografías comparativas a través de los años.",
};

/* --------------------------------------------------------------------------
   Fotografías y video
   --------------------------------------------------------------------------
   TODO: ESTAS IMÁGENES DEBERÍAN VENIR DEL CMS CON getImages() DE @utils.
   De momento son las mismas URLs remotas que usa el resto de la home, ya
   permitidas por `image.remotePatterns` en `astro.config.mjs`.
   -------------------------------------------------------------------------- */
const PHOTO = {
  laguna: {
    src: "https://manfredreyesvilla.netlify.app/_astro/DSC_0801_ZuLMnQ.webp",
    alt: "Laguna Coña Coña, uno de los espejos de agua de la ciudad",
  },
  turquesa: {
    src: "https://manfredreyesvilla.netlify.app/_astro/6P9A2287_V5pXO.webp",
    alt: "Playa Turquesa, espacio público recuperado en el centro",
  },
  lago: {
    src: "https://manfredreyesvilla.netlify.app/_astro/DSC_0806_ZuLMnQ.webp",
    alt: "Laguna de la ciudad recuperada como espacio de encuentro",
  },
  banderasAntes: {
    src: "https://manfredreyesvilla.netlify.app/_astro/DSC_0807_ZuLMnQ.webp",
    alt: "Plaza de las Banderas antes de la intervención",
  },
  banderasDespues: {
    src: "https://manfredreyesvilla.netlify.app/_astro/DSC_0810_ZuLMnQ.webp",
    alt: "Plaza de las Banderas después de la intervención",
  },
  alalayAntes: {
    src: "https://manfredreyesvilla.netlify.app/_astro/DSC_0808_ZuLMnQ.webp",
    alt: "Laguna Alalay antes de la intervención",
  },
  alalayDespues: {
    src: "https://manfredreyesvilla.netlify.app/_astro/DSC_0811_ZuLMnQ.webp",
    alt: "Laguna Alalay después de la intervención",
  },
  escuela: {
    src: "https://manfredreyesvilla.netlify.app/_astro/DSC_0803_ZuLMnQ.webp",
    alt: "Manfred Reyes Villa con estudiantes",
  },
  ceremonia: {
    src: "https://manfredreyesvilla.netlify.app/_astro/DSC_0804_ZuLMnQ.webp",
    alt: "Manfred Reyes Villa en un acto municipal",
  },
  familia: {
    src: "https://manfredreyesvilla.netlify.app/_astro/DSC_0805_ZuLMnQ.webp",
    alt: "Manfred Reyes Villa con su familia",
  },
  teatro: {
    src: "https://manfredreyesvilla.netlify.app/_astro/DSC_0802_ZuLMnQ.webp",
    alt: "Playa Turquesa junto al Teatro Municipal",
  },
} as const;

/** Video del libro. Cloudinary, igual que el video de la biografía. */
const VIDEO_OBRAS: BookImage = {
  src: "https://res.cloudinary.com/dxjv8gq3e/video/upload/v1697040915/hero-video_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1.mp4",
  alt: "Panorámica de las obras de la gestión 2021–2026",
};

/* --------------------------------------------------------------------------
   Las páginas, en orden de lectura
   --------------------------------------------------------------------------
   El orden del array ES el orden de las páginas. `kind` decide con qué
   plantilla se dibuja cada una; añadir una página es añadir un objeto, sin
   tocar ningún componente.
   -------------------------------------------------------------------------- */
export const BOOK_PAGES: readonly BookPage[] = [
  { kind: "cover", label: "Portada" },

  {
    kind: "page",
    label: "Un legado de progreso",
    kicker: "Presentación del alcalde",
    body: "Este libro reúne más de tres décadas de trabajo por Cochabamba: un compendio del esfuerzo por transformar nuestra Llajta, convencido de que servir a esta tierra es uno de los mayores honores y responsabilidades que una persona puede asumir. No pretende ser únicamente una memoria de obras y decisiones, sino el testimonio de una visión de ciudad que se ha mantenido firme en sus propósitos y que ha sabido renovarse ante los desafíos de cada época. Tienes en las manos el legado de progreso de la mejor ciudad de Bolivia.",
    image: PHOTO.ceremonia,
    caption: "Cap. Manfred Reyes Villa Bacigalupi · Alcalde Constitucional, Gobierno Autónomo Municipal de Cochabamba",
  },

  {
    kind: "page",
    label: "Cómo ha crecido Cochabamba",
    kicker: "De una ciudad de ayer a una ciudad que mira al futuro",
    body: "Las fotografías cuentan aquello que muchas veces las palabras no pueden explicar: el paso del tiempo y la transformación de una ciudad. Cochabamba conserva en sus calles, plazas, barrios y edificios la memoria de lo que fue, pero también muestra, en cada avenida y espacio renovado, el impulso de una ciudad que comenzó a proyectarse hacia el futuro.",
    gallery: [PHOTO.banderasAntes, PHOTO.banderasDespues],
    caption: BOOK_META.compareCaption,
  },

  {
    kind: "page",
    label: "El inicio de una nueva Cochabamba",
    kicker: "Visión moderna de ciudad y planificación urbana",
    body: "Con la llegada de una nueva etapa de gestión municipal, Cochabamba comenzó a plantearse un desafío distinto: dejar de responder únicamente a las necesidades del presente y empezar a planificar la ciudad que sus habitantes necesitarían en el futuro.",
    image: PHOTO.escuela,
  },

  {
    kind: "page",
    label: "Las obras son memorias",
    kicker: "Antes de esta gestión · años 90",
    body: "La transformación de Cochabamba durante los años 90 no puede entenderse únicamente a través de una lista de obras. Cada avenida, parque, puente, plaza y programa social representa una parte de la historia de una ciudad que comenzaba a mirar más allá de su presente. Cada proyecto refleja una época en la que Cochabamba comenzó a imaginarse como una ciudad moderna, integrada y con vocación de futuro.",
    image: PHOTO.lago,
    caption: "Cochabamba de los años 90, cuando la ciudad empezó a imaginarse moderna.",
  },

  {
    kind: "page",
    label: "Pioneros en pasos a desnivel y puentes",
    kicker: "Años 90 · Movilidad",
    body: "Cochabamba fue pionera en Bolivia en la implementación de pasos a desnivel y puentes para ordenar el tránsito y conectar la ciudad con su periferia.",
    works: [
      { name: "Puente Cala Cala", year: 1993 },
      { name: "Puente Los Andes", year: 1993 },
      { name: "Puente Kyllmann", year: 1994 },
      { name: "Viaducto", year: 1996 },
      { name: "Puente Antezana", year: 1996 },
      { name: "Puente Muyurina", year: 2004 },
    ],
  },

  {
    kind: "page",
    label: "La conectividad: motor del crecimiento urbano",
    kicker: "Años 90 · Vialidad",
    body: "Asfalto y pavimento rígido en las avenidas estructurantes que ordenaron la expansión de la ciudad.",
    works: [
      { name: "Av. Suecia" },
      { name: "Av. Cap. Ustariz" },
      { name: "Av. D'Orbigni" },
      { name: "Av. Melchor Pérez" },
      { name: "Av. Independencia" },
      { name: "Av. Petrolera" },
      { name: "Av. Gabriel René Moreno" },
      { name: "Av. Beijing" },
    ],
  },

  {
    kind: "page",
    label: "Ciudad Jardín: áreas verdes y parques",
    kicker: "Años 90 · Espacio público",
    body: "Parques y plazas que consolidaron la identidad de Cochabamba como Ciudad Jardín y de la Eterna Primavera.",
    image: PHOTO.turquesa,
    works: [
      { name: "Parque de Educación Vial" },
      { name: "Parque del Niño" },
      { name: "Parque Mariscal Santa Cruz", year: 1998 },
      { name: "Parque Kanata" },
      { name: "Parque San Pedro" },
      { name: "Plaza 14 de Septiembre" },
      { name: "Plaza Colón" },
      { name: "Plaza Recoleta" },
      { name: "Plaza Quintanilla" },
      { name: "Plaza de las Banderas" },
    ],
  },

  {
    kind: "page",
    label: "Hitos que marcaron época",
    kicker: "Años 90 · Programas",
    body: "Programas y obras con los que Cochabamba se adelantó al resto del país.",
    works: [
      { name: "Desayuno Escolar", year: 1994 },
      { name: "Iluminación: cambio de luces de mercurio a sodio", year: 1994 },
      { name: "Misicuni" },
      { name: "Defensorías Municipales de la Niñez y Adolescencia", year: 1997 },
      { name: "Cristo de la Concordia", year: 1994 },
      { name: "Primer Teleférico de Bolivia", year: 1999 },
      { name: "Día del Peatón y del Ciclista", year: 1999 },
    ],
  },

  {
    kind: "page",
    label: "Cuando una ciudad vuelve a soñar en grande",
    kicker: "Gestión 2021–2026",
    body: "En 2021, Cochabamba inició una nueva etapa de transformación urbana y social. La experiencia acumulada y una visión de ciudad moderna volvieron a encontrarse con las necesidades de una población que exigía soluciones concretas. Agua, salud, educación, movilidad, medio ambiente, cultura, tecnología, deporte y desarrollo productivo se convirtieron en parte de una agenda municipal orientada a recuperar espacios, modernizar servicios y llevar obras a los distintos distritos.",
    image: PHOTO.familia,
  },

  {
    kind: "page",
    label: "Salud de calidad",
    kicker: "Gestión 2021–2026 · Salud",
    body: "La emergencia sanitaria dejó una enseñanza: la infraestructura y el equipamiento médico pueden marcar la diferencia entre la vida y la muerte. Fortalecer el sistema de salud fue primordial.",
    works: [
      { name: "Primera Planta Criogénica Municipal de Oxígeno" },
      { name: "Unidades de Terapia Intensiva" },
      { name: "Red Municipal de Ambulancias" },
      { name: "Equipamiento hospitalario" },
      { name: "Fichaje Virtual — INNOVA" },
      { name: "Salud Sobre Ruedas" },
      { name: "Campañas de cirugías gratuitas Manitos Arriba" },
      { name: "Centro de Salud Ambulatorio Gloria" },
      { name: "Centro de Salud Integral Villa Israel" },
      { name: "Clínica veterinaria y Centro de Adiestramiento Canino" },
    ],
  },

  {
    kind: "page",
    label: "Cobertura de agua potable: deuda social",
    kicker: "Gestión 2021–2026 · Agua",
    body: "Garantizar agua significa garantizar salud, dignidad y oportunidades. La ampliación de redes, sistemas de abastecimiento, colectores y proyectos de saneamiento se convirtió en uno de los principales desafíos de la gestión municipal.",
    works: [
      { name: "Planta de Tratamiento de Aguas Residuales de Albarrancho" },
      { name: "Renovación del sistema de agua potable del centro" },
      { name: "Cobertura del 96 % de agua potable" },
      { name: "Ampliaciones y renovaciones de servicios básicos" },
      { name: "Emisario Sud Este" },
      { name: "Colector Av. 6 de Agosto" },
      { name: "Colector Av. Ayacucho" },
    ],
  },

  {
    kind: "page",
    label: "Cochabamba, Ciudad Jardín: recreación y encuentro",
    kicker: "Gestión 2021–2026 · Espacios verdes",
    body: "La Ciudad Jardín y de la Eterna Primavera renueva su esencia con plazas, parques y espacios llenos de color y vegetación, con el Plan Maestro de Forestación y Reforestación Municipal, Bosques Urbanos y Arborización.",
    works: [
      { name: "Parque de la Integración" },
      { name: "Plaza Julio León Prado" },
      { name: "Prado Av. Humberto Asín" },
      { name: "La Casa de Piedra" },
      { name: "Jardineras centrales y áreas verdes" },
      { name: "Bosques urbanos" },
      { name: "Remozado y mejoramiento de fuentes" },
    ],
  },

  {
    kind: "page",
    label: "Un compromiso con el futuro ecológico",
    kicker: "Gestión 2021–2026 · Ecología",
    body: "La llajta avanza hacia un futuro más verde, limpio y sostenible. Recuperar áreas naturales, mejorar la calidad del aire, promover una movilidad sostenible y fortalecer la conciencia ambiental es un compromiso con las presentes y futuras generaciones.",
    works: [
      { name: "Cierre definitivo de ladrilleras" },
      { name: "Plan Maestro de Ciclovías" },
      { name: "Centro de Inspección Vehicular Ambiental" },
      { name: "Centro de Educación Ambiental Municipal" },
      { name: "Manfred Reyes Villa, Embajador de Ciudades Sostenibles 2026" },
    ],
  },

  {
    kind: "page",
    label: "Nuestros espejos de agua",
    kicker: "Gestión 2021–2026 · Lagunas",
    body: "Cochabamba vuelve a mirar hacia sus espejos de agua como espacios de vida, encuentro y recreación. La recuperación de la Laguna Alalay y Coña Coña fue uno de los grandes desafíos ambientales de la ciudad.",
    image: PHOTO.laguna,
    caption: "Laguna Coña Coña, recuperada.",
    works: [
      { name: "Dragado y recuperación de la Laguna Alalay" },
      { name: "Complejo Recreacional Coña Coña" },
      { name: "Bordes públicos y ciclovía perilagunaria" },
      { name: "Playa Turquesa" },
    ],
  },

  {
    kind: "page",
    label: "Educación integral",
    kicker: "Gestión 2021–2026 · Educación",
    body: "El gobierno municipal ha destinado importantes esfuerzos a la construcción, ampliación y mejoramiento de infraestructuras educativas, beneficiando a miles de estudiantes con ambientes dignos, modernos y adecuados para aprender.",
    works: [
      { name: "Construcción de nuevas infraestructuras educativas" },
      { name: "Ampliación y mejoramiento de infraestructuras educativas" },
      { name: "Alimentación Complementaria Escolar" },
      { name: "Entrega de mobiliario educativo" },
      { name: "Internet gratuito para unidades educativas" },
    ],
  },

  {
    kind: "page",
    label: "Cochabamba conectada: infraestructura vial",
    kicker: "Gestión 2021–2026 · Vialidad",
    body: "La infraestructura vial volvió a ocupar un lugar central en la transformación de Cochabamba. Puentes, distribuidores, pavimento rígido, asfaltos y nuevas conexiones para una ciudad que crece y necesita desplazarse mejor.",
    video: VIDEO_OBRAS,
    works: [
      { name: "Distribuidor Quintanilla" },
      { name: "Distribuidor Av. Perú y Av. Blanco Galindo" },
      { name: "Reposición de la plataforma del Puente caído" },
      { name: "Pavimento rígido Av. Segunda Circunvalación" },
      { name: "Pavimento rígido Av. Humberto Asín" },
      { name: "Túnel de la Integración" },
      { name: "Micropavimento" },
      { name: "Recarpetado de avenidas estructurantes" },
    ],
  },

  {
    kind: "page",
    label: "Cochabamba a la vanguardia del progreso",
    kicker: "Gestión 2021–2026 · Infraestructura",
    body: "La ciudad avanza con soluciones innovadoras que mejoran la vida cotidiana, recuperan y hacen más accesibles los espacios públicos, optimizan los servicios y fortalecen su infraestructura.",
    works: [
      { name: "Contenedores soterrados" },
      { name: "Caceras inclusivas en el Casco Viejo" },
      { name: "Renovación del alumbrado público a tecnología LED" },
      { name: "Construcción del Edificio Municipal" },
      { name: "Accesos a la nueva Terminal de Buses" },
    ],
  },

  {
    kind: "page",
    label: "Pioneros en alianzas público-privadas",
    kicker: "Gestión 2021–2026 · Alianzas",
    body: "Cuando las ideas se suman, el desarrollo multiplica su fuerza. El municipio abre nuevas oportunidades a través de alianzas que unen la visión pública con la iniciativa privada.",
    image: PHOTO.teatro,
    caption: "Espacios públicos recuperados en el centro de la ciudad.",
    works: [
      { name: "Feria Exposición Internacional de Cochabamba (Fexco)" },
      { name: "Pórtico de acceso principal" },
      { name: "Pabellón Kanata" },
      { name: "Fexco Arena" },
      { name: "Auditorio Fexco" },
      { name: "Ampliación de la Plaza de Comidas" },
      { name: "Pabellón del Emprendedor y artesanos" },
      { name: "Karting" },
      { name: "Tirolesa en la serranía de San Pedro" },
      { name: "Restaurante Casa de Piedra" },
      { name: "Jardín Botánico" },
      { name: "Parque de Diversiones Fexco" },
    ],
  },

  {
    kind: "page",
    label: "Cochabamba se visita: se vive",
    kicker: "Gestión 2021–2026 · Turismo",
    body: "La ciudad de la eterna primavera cautiva con un clima privilegiado, paisajes que invitan a quedarse y una gastronomía que convierte cada plato en parte de su identidad. Pero su mayor atractivo está en su gente: amable, trabajadora y orgullosa de sus raíces. Entre sabores, tradiciones y montañas, la Llajta se descubre con los sentidos y se queda en el corazón.",
    works: [
      { name: "14 Estaciones del Viacrucis y renovación de 1.400 escalinatas" },
      { name: "Restaurante Patrimonio" },
      { name: "Cochabamba, Ciudad de la Navidad" },
      { name: "Feria de la Chicha y el Chicharrón" },
      { name: "Carnaval de la Concordia" },
      { name: "Pasaje Portales Tunari" },
      { name: "Miradores de Leuquepampa" },
    ],
  },

  {
    kind: "page",
    label: "Cochabamba, primera ciudad inteligente de Bolivia",
    kicker: "Gestión 2021–2026 · Tecnología",
    body: "La tecnología se convierte en servicio cuando está al alcance de todos. La digitalización de trámites, los pagos QR, el internet gratuito y una red propia de 500 kilómetros de fibra óptica conectan escuelas, centros de salud, plazas y espacios públicos, acercando la gestión municipal a la población.",
    works: [
      { name: "Digitalización de los servicios municipales" },
      { name: "Pagos QR a través de la app INNOVA" },
      { name: "Centro de Atención Virtual y línea gratuita 151" },
      { name: "Internet gratuito y wifi libre en plazas y centros de salud" },
      { name: "Semáforos inteligentes sonoros" },
      { name: 'Concurso Nacional de Programación "Cocha Somos Innovación"' },
      { name: 'Feria Tecnológica "Cocha Innova"' },
    ],
  },

  {
    kind: "page",
    label: "Revalorización de la cultura",
    kicker: "Gestión 2021–2026 · Cultura",
    body: "Cochabamba guarda en sus calles, monumentos, teatros y en la música de su gente una identidad que atraviesa generaciones. Esa memoria vuelve a cobrar vida con la preservación de la Torre de la Catedral Metropolitana, la restauración del Teatro Achá y el fortalecimiento de la Orquesta Sinfónica, los coros y la Banda Municipal.",
    works: [
      { name: "Preservación de la Torre de la Catedral Metropolitana" },
      { name: "Restauración del Teatro Achá" },
      { name: "Orquesta Sinfónica Municipal" },
      { name: "Coro Municipal y Coro de Niños" },
      { name: "Banda Municipal" },
    ],
  },

  {
    kind: "page",
    label: "Apoyando al deporte",
    kicker: "Gestión 2021–2026 · Deporte",
    body: "El municipio impulsa el deporte como una herramienta de formación y encuentro, con la dotación de material deportivo, trofeos y reconocimientos, y el mejoramiento de campos y canchas múltiples en los distintos distritos.",
    works: [
      { name: "Campeonatos internacionales, nacionales, departamentales y municipales" },
      { name: 'Juegos Universitarios "Cap. Manfred Reyes Villa"' },
      { name: "Escuelas deportivas municipales" },
    ],
  },

  {
    kind: "page",
    label: "Protección social",
    kicker: "Gestión 2021–2026 · Familia y niñez",
    body: "Una ciudad que avanza no deja a nadie atrás: fortalece una política social centrada en las personas, promoviendo igualdad de oportunidades, protección y acompañamiento para niñas, niños, adolescentes y familias.",
    works: [
      { name: "Ley Municipal de Corresponsabilidad en el Trabajo del Cuidado no Remunerado" },
      { name: "Centros Infantiles Municipales" },
      { name: "Ludotecas municipales" },
      { name: "Parvulario Municipal" },
      { name: "Línea de Atención al Adolescente (LIA)" },
      { name: "Centro de Atención Integral a la Familia (CAIF)" },
    ],
  },

  {
    kind: "page",
    label: "Cochabamba productiva: oportunidades para todos",
    kicker: "Gestión 2021–2026 · Desarrollo productivo",
    body: "La alcaldía fortalece su vocación productiva apoyando a quienes trabajan la tierra, impulsando la producción agropecuaria y generando espacios dignos para la comercialización. La entrega de semillas, las campañas de sanidad animal y el fortalecimiento de mercados modelo conectan al productor con las familias.",
    works: [
      { name: 'Ferias "CochaEmprende"' },
      { name: "Plataforma para emprendedores" },
      { name: "Mercado Integración del Sur" },
      { name: "Mercado Coraca" },
      { name: "Mercado Calatayud" },
      { name: "Mercado Papa Paulo" },
    ],
  },

  {
    kind: "page",
    label: "Cochabamba: una ciudad que sigue construyendo su historia",
    kicker: "Gestión 2021–2026 · Vivienda y propiedad",
    body: 'A través de la regularización del derecho propietario y el programa "Mi Casa Segura", Cochabamba avanza en la consolidación de hogares con mayor seguridad jurídica y patrimonial. Detrás de cada documento existe una historia, un esfuerzo y el sueño de una familia de llamar suyo al lugar que construyó.',
    works: [
      { name: "Resoluciones Administrativas Municipales (RAMs)" },
      { name: 'Programa "Mi Casa Segura"' },
    ],
  },

  { kind: "back", label: "Contraportada" },
];
