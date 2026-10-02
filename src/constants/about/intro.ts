import type { ClosingContent } from "@types";
import { alcalde } from "@utils";

/**
 * Hero de "Sobre mí": el mismo componente que la home, con su propio mensaje y
 * su propio carrusel.
 *
 * Las imágenes son de persona, no de obra: en esta página lo que se quiere
 * poner delante es quién es la persona, no lo que construyó.
 */
export const CONTENT_HERO_ABOUT = {
  title: "El inicio de una nueva era",
  description: "Manfred Reyes Villa",
  images: [
    alcalde("alcalde.jpg"),
    alcalde("esposa.jpg"),
    alcalde("prefecto.jpg"),
  ],
};

// TODO: LOS TEXTOS EN PRIMERA PERSONA DE ESTA PÁGINA (intro, pasiones y cierre)
// DEBEN SER VALIDADOS POR EL EQUIPO DEL ALCALDE. Se apoyan solo en lo que ya dicen
// las frases de la home, los reconocimientos y las obras; las anécdotas, fotos y
// datos personales reales los aporta el equipo.
export const SECTION_ABOUT_PERSON = {
  kicker: "Antes que el cargo",
  title: "Soy más que un título en una puerta",
  imageURL: alcalde("alcalde.jpg"),
  imageAlt: "Manfred Reyes Villa",
  imageCaption: "Manfred Reyes Villa",
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
  phrase: "Conocerme es escucharme, pero lo más importante para mí es",
  enphasis: "escucharte a ti",
  description: "Cuéntame qué piensas, qué necesitas o qué te gustaría ver en Cochabamba.",
  primary: { label: "Escríbeme", href: "/mailbox" },
};
