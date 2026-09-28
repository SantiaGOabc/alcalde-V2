/**
 * Clamps a number between a minimum and a maximum range.
 */
export const clamp = (value: number, min = 0, max = 1): number =>
  value < min ? min : value > max ? max : value;

/** @deprecated Use `clamp` */
export const limita = clamp;
