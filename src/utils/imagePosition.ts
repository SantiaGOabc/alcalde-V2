import type { Encuadre } from "@types";

/**
 * Maps framing option ("rostro" | "centro") to CSS object-position.
 */
export const imagePosition = (framing: Encuadre = "centro"): string =>
  framing === "rostro" ? "50% 12%" : "50% 50%";

/** @deprecated Use `imagePosition` */
export const ajustaImagen = imagePosition;
