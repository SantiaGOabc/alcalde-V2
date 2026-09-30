import type { ClosingContent } from "@types";
import { alcalde, raiz } from "@utils";

// Textos de la página de Gestión que no viven en `projects.ts`. Ese archivo se
// mantiene libre de imports porque `scripts/db-setup.mjs` lo lee directamente.

/**
 * Hero de Gestión: el mismo componente que la home, con su propio mensaje y su
 * propio carrusel.
 *
 * Las imágenes son de obra, no de persona: en esta página lo que va delante es
 * lo que se construyó, que es justo lo que viene a contar el resto de la
 * página.
 */
export const CONTENT_HERO_MANAGEMENT = {
  title: "Obras que transformaron Cochabamba",
  description: "Gestión municipal",
  images: [
    raiz("parque vial.jpg"),
    raiz("puenteCalaCala.png"),
    alcalde("IMG_2941.jpg"),
    alcalde("alcaldeObra.jpg"),
  ],
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
