/* ==========================================================================
   El índice del libro
   --------------------------------------------------------------------------
   Funciones puras sobre las hojas: ni DOM, ni estado, ni números mágicos.
   Todo lo que se puede decidir leyendo la lista de títulos se decide aquí, y
   por eso se puede razonar sin abrir el navegador.
   ========================================================================== */

import { datasetKey } from "@constant";

/** Título de cada hoja, en el orden del libro. Lo lee del DOM al montar. */
export const readLabels = (pages: ParentNode, attr: string): string[] => {
	const key = datasetKey(attr);
	return Array.from(pages.querySelectorAll<HTMLElement>(`[${attr}]`), (sheet) =>
		(sheet.dataset[key] ?? "").trim(),
	);
};

/**
 * Cuántos dobleces tiene el libro.
 *
 * El índice va por dobleces y no por hojas, porque eso es lo que el lector
 * ve: pasar del 3 al 4 no ocurre nunca, se pasa del doblece 2 al 3.
 */
export const countSpreads = (total: number): number =>
	total <= 1 ? 1 : 1 + Math.ceil((total - 1) / 2);

/** Doblece en el que está una hoja, contando la portada como pliego individual. */
export const spreadOf = (page: number, spreads: number): number =>
	Math.min(page === 0 ? 0 : Math.ceil(page / 2), spreads - 1);

/**
 * Hojas que se ven a la vez en el doblece donde empieza `page`.
 *
 * La portada va sola; los pliegos interiores empiezan en índices impares.
 */
export const sheetsInSpread = (page: number, total: number): number[] =>
	page === 0
		? [0]
		: page % 2 === 1
			? [page, page + 1].filter((sheet) => sheet < total)
			: [page - 1, page];

/** Primera hoja de un pliego del deslizador. */
export const pageOfSpread = (spread: number): number =>
	spread === 0 ? 0 : spread * 2 - 1;

/** "Página 4 de 20 · Los espejos de agua" */
export const describePage = (page: number, labels: readonly string[]): string => {
	const position = `Página ${page + 1} de ${labels.length}`;
	return labels[page] ? `${position} · ${labels[page]}` : position;
};
