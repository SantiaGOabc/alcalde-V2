/**
 * La lista de diapositivas del antes/después y cómo se pinta cada foto.
 *
 * Vive aparte de los componentes porque es lo único que decide: qué pares están
 * completos, cuál es la obra del alcalde (la que se parte en dos mitades) y
 * dónde entra la frase de transición. Los `.astro` solo pintan lo que aquí ya
 * está ordenado.
 */
import type { ComparacionImagen, Slide } from "@types";

/**
 * Empareja `before` y `after` por índice y monta las diapositivas.
 *
 * Solo se aceptan pares completos: si a una de las dos fotos todavía le falta la
 * URL, la pareja no se muestra. La frase entra una sola vez, entre la primera
 * obra y la segunda, que es donde el "antes y después" da el salto.
 */
export const buildSlides = (
  before: ReadonlyArray<ComparacionImagen>,
  after: ReadonlyArray<ComparacionImagen>,
  transitionPhrase: string,
): Slide[] => {
  const comparisons = before.flatMap((beforeImage, index) => {
    const afterImage = after[index];
    if (!beforeImage.imageURL || !afterImage?.imageURL) return [];

    return [{ before: beforeImage, after: afterImage }];
  });

  return comparisons.flatMap((comparison, index): Slide[] => {
    const interlude: Slide[] =
      index === 1 ? [{ kind: "interlude", text: transitionPhrase }] : [];

    // La primera obra es siempre la del alcalde: es la única que se parte en dos
    // mitades fijas, y el resto lleva divisor arrastrable.
    return index === 0
      ? [...interlude, { kind: "mayor", ...comparison }]
      : [...interlude, { kind: "comparison", ...comparison }];
  });
};

/**
 * Cómo se pinta una foto dentro de la caja.
 *
 * `contain` la deja entera pegada arriba y `cover` la recorta al marco. Los
 * tamaños son los de la caja, no los del archivo: son los que el navegador
 * reserva mientras la foto llega, y por eso no pueden depender de ella.
 */
export const foto = (image: ComparacionImagen, layout: string) => ({
  class: `${layout} select-none object-cover ${image.imageFit === "contain" ? "object-top" : "object-center"}`,
  width: image.imageFit === "contain" ? 900 : 1400,
  height: image.imageFit === "contain" ? 1400 : 900,
});