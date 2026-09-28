import pageFlipModule from "page-flip";
import {
	BOOK_RENDERED_ASPECT,
	BOOK_SHEET,
	BOOK_TRANSITION,
} from "@constant";

/**
 * `page-flip` se publica como un bundle UMD, o sea CommonJS, y sus exports no
 * son estáticos: un empaquetador no puede verlos y se niega a importarlos por
 * nombre. La única forma fiable es tomar el default y desestructurarlo aquí, una
 * sola vez, para que el resto del visor ni se entere.
 */
const { PageFlip } = pageFlipModule;

/* ==========================================================================
   El motor de volteo
   --------------------------------------------------------------------------
   Todo lo que sabe de `page-flip` vive aquí. El resto del visor solo pide saltos
   de página y no tiene por qué conocer la librería.

   Tres cosas que la librería no deja elegir y conviene no olvidar:

   - `destroy()` hace `block.remove()` y su bucle de animación no tiene forma de
     pararse. Montar un motor por apertura dejaría un bucle huérfano por cada
     una, así que aquí se crea UNA vez y se reutiliza siempre.
   - En modo `stretch` el motor NO mide la hoja en píxeles: reparte el bloque que
     le des y deduce la proporción de `width / height`. Por eso en los ajustes
     va una proporción, y el tamaño en píxeles lo pone el visor midiendo la
     ventana.
   - `minWidth` decide la orientación: el motor compara el ancho del bloque
     contra su doble. Como el visor pone el bloque a lo que ha medido, dos hojas
     pasan siempre ese doble y una nunca, y no hay que reconfigurar nada.
   ========================================================================== */

/** Ajustes del motor, en el nombre que usa la librería. */
const SETTINGS = {
	size: "stretch",
	/**
	 * Proporción de la hoja YA ENSANCHADA. Pasarle la del papel en vez de esta
	 * sacaba hojas cuadradas, y el libro se veía pequeño en el centro.
	 */
	width: BOOK_RENDERED_ASPECT,
	height: 1,
	/** Umbral de orientación, según lo explicado arriba. */
	minWidth: BOOK_SHEET.orientationWidth,
	/** La caja manda sobre el bloque, no al revés. */
	autoSize: false,
	usePortrait: true,
	showCover: true,
	drawShadow: true,
	maxShadowOpacity: 0.45,
	showPageCorners: true,
	/** Permite ampliar una foto con un clic sin que el motor se lo quede. */
	clickEventForward: true,
	mobileScrollSupport: true,
	flippingTime: BOOK_TRANSITION.flip,
} as const;

/** Lo que el visor le pide al motor. */
export interface BookEngine {
	/** El bloque donde el motor ha depositado las hojas. */
	readonly block: HTMLElement | null;
	/** Salta a una hoja concreta. */
	flip(page: number): void;
	flipNext(): void;
	flipPrev(): void;
	/** Recalcula el motor tras un cambio de tamaño. */
	update(): void;
}

/**
 * Crea el motor y le entrega las hojas.
 *
 * Las hojas se escriben en el servidor y llegan aquí como nodos: `page-flip`
 * mueve los elementos que recibe, así que tienen que ser reales, no cadenas.
 */
export const createBookEngine = (
	block: HTMLElement,
	pages: HTMLElement[],
	startPage: number,
	onFlip: (page: number) => void,
): BookEngine => {
	const flip = new PageFlip(block, { ...SETTINGS, startPage });

	flip.on("flip", (event) => onFlip(Number(event.data)));
	flip.loadFromHTML(pages);

	const blockOf = () => flip.getUI()?.getDistElement() ?? null;

	return {
		get block() {
			return blockOf();
		},
		flip: (page) => flip.flip(page),
		flipNext: () => flip.flipNext(),
		flipPrev: () => flip.flipPrev(),
		update: () => flip.update(),
	};
};
