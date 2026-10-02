/**
 * Los datos del antes/después: qué comparaciones hay, con qué forma y con qué
 * dibujo.
 *
 * Vive en los tipos y no en el componente porque es la parte que no se pinta: los
 * `.astro` solo la dibujan, y así ninguno tiene que preguntar por el tipo de la
 * diapositiva que le toca.
 */

/** Una foto de la obra, tal y como llega del contenido. */
export type ComparacionImagen = {
  title: string;
  imageURL: string;
  imageFit: "contain" | "cover";
};

/** Una obra con su foto de antes y su foto de después. */
export type Comparacion = {
  before: ComparacionImagen;
  after: ComparacionImagen;
};

/**
 * Los tres dibujos que puede tener el carrusel, uno por miembro de la unión:
 *
 * - `mayor`: el retrato del alcalde, partido en dos mitades fijas.
 * - `comparison`: la obra con el divisor arrastrable de por medio.
 * - `interlude`: la frase que separa el antes del después.
 *
 * Cada caso es un miembro propio y no un `kind` con varias opciones porque es lo
 * que deja que TypeScript estreche el tipo al preguntar por el `kind`: con un
 * solo miembro `"mayor" | "comparison"` la pregunta respondería "puede ser
 * cualquiera de los dos" y las props de la diapositiva no se concretan.
 */
export type Slide =
  | ({ kind: "mayor" } & Comparacion)
  | ({ kind: "comparison" } & Comparacion)
  | { kind: "interlude"; text: string };