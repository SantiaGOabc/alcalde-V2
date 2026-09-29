import type { ClosingContent } from "@types";
import { CONTENT_HERO_HOME } from "../home/home";

/** Mismo hero (componente e imágenes) que la home, con su propio mensaje. */
export const CONTENT_HERO_ABOUT = {
  title: "Conoce a la persona detrás del cargo",
  description: "Manfred Reyes Villa",
  images: CONTENT_HERO_HOME.images,
};

// TODO: LOS TEXTOS EN PRIMERA PERSONA DE ESTA PÁGINA (intro, pasiones y cierre)
// DEBEN SER VALIDADOS POR EL EQUIPO DEL ALCALDE. Se apoyan solo en lo que ya dicen
// las frases de la home, los reconocimientos y las obras; las anécdotas, fotos y
// datos personales reales los aporta el equipo.
export const SECTION_ABOUT_PERSON = {
  kicker: "Antes que el cargo",
  title: "Soy más que un título en una puerta",
  imageURL: "https://manfredreyesvilla.netlify.app/_astro/DSC_0807_Z2rxRve.webp",
  imageAlt: "Manfred Reyes Villa",
  imageCaption: "Manfred Reyes Villa Bacigalupi",
  paragraphs: [
    "Detrás de las obras y de los años de gestión hay alguien que valora a su familia, respeta a los animales y se siente en casa entre su gente.",
    "Esta página no es un currículum: para eso está la línea de tiempo. Es una invitación a conocer lo que me mueve, lo que disfruto y lo que le da sentido a todo lo demás.",
  ],
  likesTitle: "Lo que me llena el corazón",
  likes: [
    { label: "El trabajo honesto", href: "#trabajo" },
    { label: "Mi familia", href: "#familia" },
    { label: "Los animales", href: "#animales" },
    { label: "Caminar mis barrios", href: "#gente" },
  ],
};

export const SECTION_ABOUT_CLOSING: ClosingContent = {
  kicker: "Sigamos conversando",
  phrase: "Conocerme es escucharme, pero lo más importante para mí es escucharte a ti.",
  description: "Cuéntame qué piensas, qué necesitas o qué te gustaría ver en Cochabamba.",
  primary: { label: "Escríbeme", href: "/mailbox" },
  secondary: { label: "Ver la gestión", href: "/management" },
};
