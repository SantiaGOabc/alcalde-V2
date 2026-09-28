import type { PlacaDolly } from "@types";

/** Campo de la placa que pinta un bloque de la tarjeta de información. */
export type CampoCardInfo = keyof Pick<
  PlacaDolly,
  "etapa" | "titulo" | "anio" | "resumen"
>;

export interface BloqueCardInfo {
  /** Dato de la placa que se muestra. */
  campo: CampoCardInfo;
  /** Clase de `timeline.css` para el bloque en la tarjeta del dolly. */
  clase: string;
  /** Clase equivalente en la tarjeta del carrusel móvil. */
  claseMovil: string;
}

export interface CardInfo {
  /** Bloques en orden de aparición; los vacíos no se pintan. */
  bloques: BloqueCardInfo[];
  accion: { etiqueta: string; clase: string; claseMovil: string };
}

/**
 * Contenido de las tarjetas de información de la línea de tiempo.
 *
 * Está todo aquí para que crear una tarjeta nueva (o añadir un dato a las
 * existentes) sea tocar esta constante y no el componente: el renderer
 * (`CardInfo.tsx`) solo recorre `bloques` y pone el `accion` al final.
 */
export const CARD_INFO: CardInfo = {
    bloques: [
        {
            campo: "etapa",
            clase: "timeline-info-kicker",
            claseMovil: "timeline-movil-kicker",
        },
        {
            campo: "titulo",
            clase: "timeline-info-titulo",
            claseMovil: "timeline-movil-titulo",
        },
        {
            campo: "anio",
            clase: "timeline-info-anio",
            claseMovil: "timeline-movil-anio",
        },
        {
            campo: "resumen",
            clase: "timeline-info-resumen",
            claseMovil: "timeline-movil-resumen",
        },
    ],
    accion: {
        etiqueta: "Leer más",
        clase: "timeline-info-boton",
        claseMovil: "timeline-movil-boton",
    },
};
