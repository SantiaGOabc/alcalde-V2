import type { ClosingContent } from "@types";
import { CONTENT_HERO_HOME } from "../home/home";

// Textos de la página de Gestión que no viven en `projects.ts`. Ese archivo se
// mantiene libre de imports porque `scripts/db-setup.mjs` lo lee directamente.

/** Mismo hero (componente e imágenes) que la home, con su propio mensaje. */
export const CONTENT_HERO_MANAGEMENT = {
  title: "Obras que transformaron Cochabamba",
  description: "Gestión municipal",
  images: CONTENT_HERO_HOME.images,
};

/** Etiquetas de la línea de datos, calculada con las obras publicadas: "06 obras · 04 áreas". */
export const SECTION_MANAGEMENT_STATS = {
  works: "obras",
  areas: "áreas",
};

export const SECTION_MANAGEMENT_CLOSING: ClosingContent = {
  phrase: "Una ciudad se construye con obras, y también con las ideas de sus vecinos.",
  description: "¿Tienes una sugerencia para la próxima obra? Cuéntanos y la escuchamos.",
  primary: { label: "Enviar una sugerencia", href: "/mailbox" },
  secondary: { label: "Conocer al alcalde", href: "/about" },
};
