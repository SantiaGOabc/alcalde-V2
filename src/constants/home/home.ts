export const NAVBAR = [
  {
    path: "/",
    label: "Inicio",
  },
  {
    path: "/about",
    label: "Sobre mí",
  },
  {
    path: "/management",
    label: "Gestión",
  },
  {
    path: "/mailbox",
    label: "Buzón ciudadano",
  },
];

export const CONTENT_HERO_HOME = {
  title: "El Valor del Trabajo, la Cercanía y el Compromiso",
  description: "Manfred Reyes Villa",
};

export const SECTION_BIOGRAPHY_CONTENT = {
  title: "¿Quién soy?",
  description: `Manfred Reyes Villa es un líder político boliviano con una trayectoria dedicada al desarrollo 
        de Cochabamba. Con experiencia en gestión pública y un compromiso inquebrantable con el 
        progreso de su ciudad, ha impulsado proyectos fundamentales que transforman la vida de los 
        cochabambinos.`,
  buttons: [
    {
      primary: "Más sobre mí",
      url: "/about",
    },
    {
      secondary: "Gestión completa",
      url: "/management",
    },
  ],
  video: {
    poster: "....",
    type: "video/mp4",
    url: "https://res.cloudinary.com/dxjv8gq3e/video/upload/v1697040915/hero-video_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1.mp4",
  },
};
