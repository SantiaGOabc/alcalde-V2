import {
	BOOK_ATTR,
	BOOK_REVEAL_STAGGER_MS,
	BOOK_SELECT,
	BOOK_TEXT_REFERENCE_HEIGHT,
	BOOK_TEXT_SCALE_RANGE,
	BOOK_TRANSITION,
	datasetKey,
} from "@constant";
import type { BookPhase, BookSheet } from "@types";
import { buildMedia, mediaUnder, pickBookNodes } from "./bookDom";
import { createBookEngine, type BookEngine } from "./bookEngine";
import {
	countSpreads,
	describePage,
	readLabels,
	pageOfSpread,
	sheetsInSpread,
	spreadOf,
} from "./bookIndex";
import { measureBookSheet } from "./bookSheet";

/* ==========================================================================
   El visor
   --------------------------------------------------------------------------
   Abre el libro, lo deja manejable y lo devuelve a la tarjeta. Todo son
   funciones porque no hay estado que encapsular: el estado son las variables
   del cierre, y una clase solo añadiría `this` delante de cada una.

   Dos decisiones que dan forma al resto:

   - Abrir y cerrar son animaciones, no un booleano. De ahí las cuatro fases en
     vez de dos, y de ahí que cada una lleve su red de seguridad: `transitionend`
     es la señal normal pero no siempre llega —movimiento reducido, pestaña en
     segundo plano, pestaña cerrada a mitad— y sin red el libro se quedaría a
     medio abrir para siempre.
   - Lo que se puede tabular está tabulado. Un `if` por fase, por tecla y por
     tipo de medio se convierte en una tabla que se lee de arriba abajo, y
     añadir un caso pasa a ser añadir una fila.
   ========================================================================== */

/** Una caja en píxeles de pantalla. */
interface Box {
	x: number;
	y: number;
	width: number;
	height: number;
}

/** Los dos sentidos en los que el marco puede viajar. */
type Travel = "open" | "closed";

/** Lo que devuelve `createBookViewer`. */
export interface BookViewer {
	/** Abre el libro desde un disparador cualquiera. */
	open(trigger: HTMLElement): void;
	/** Cierra el libro. */
	close(): void;
	/** Fase actual, por si hace falta inspeccionarla. */
	phase(): BookPhase;
	/** Quita los oyentes globales (teclado, resize): se llama al salir de la página. */
	destroy(): void;
}

/** Las hojas que el motor deposita, y los bloques que entran escalonados. */
const SHEETS = ".stf__item";
const REVEAL = `[${BOOK_ATTR.reveal}]`;

/**
 * Conecta el visor de una sección del libro.
 *
 * Es idempotente: si la sección ya tiene visor, no monta otro, así el `<script>`
 * del componente puede llamarla sin miedo aunque corra dos veces.
 */
export const createBookViewer = (root: ParentNode): BookViewer | null => {
	const section = root.querySelector<HTMLElement>(BOOK_SELECT.section);
	if (!section || datasetKey(BOOK_ATTR.ready) in section.dataset) return null;

	section.dataset[datasetKey(BOOK_ATTR.ready)] = "";
	const el = pickBookNodes(section);
	const expand = `[${BOOK_ATTR.expand}]`;

	/* ---------------------------------------------------------------------- */
	/* Estado                                                                   */
	/* ---------------------------------------------------------------------- */

	const labels = readLabels(el.pages, BOOK_ATTR.label);
	const spreads = countSpreads(labels.length);

	const state = {
		phase: "closed" as BookPhase,
		/** Hoja que se está leyendo, en base 0. Sobrevive a las aperturas. */
		page: 0,
		/** El motor se crea la primera vez que se abre y se reutiliza siempre. */
		engine: null as BookEngine | null,
		/** Medidas de la apertura actual. Se recalculan en cada `resize`. */
		sheet: null as BookSheet | null,
		/** Quién tenía el foco antes de abrir, para devolvérselo al cerrar. */
		focus: null as HTMLElement | null,
		/** Válvula de seguridad por si la transición CSS no llega a disparar. */
		timer: 0,
	};

	/* ---------------------------------------------------------------------- */
	/* El marco                                                                  */
	/* ---------------------------------------------------------------------- */

	/**
	 * La tapa es la única hoja que el motor enseña sola dentro de un bloque
	 * pensado para dos: en modo doblece la deja pegada al canto derecho, con
	 * el hueco de la hoja que falta a su izquierda. Mientras se ve sola, el
	 * marco y el corrimiento de más abajo tienen que razonar sobre el ancho de
	 * UNA hoja, no sobre el doblece entero, o la tapa queda descentrada.
	 */
	const soloCover = (): boolean =>
		state.page === 0 && state.sheet !== null && state.sheet.width !== state.sheet.spread;

	/** Ancho a centrar: el de una hoja sola si solo se ve la tapa, si no el doblece. */
	const visibleWidth = (sheet: BookSheet): number => (soloCover() ? sheet.width : sheet.spread);

	/** La caja que ocupa el libro abierto, centrada en la ventana. */
	const centered = (sheet: BookSheet): Box => {
		const width = visibleWidth(sheet);

		return {
			x: (window.innerWidth - width) / 2,
			y: (window.innerHeight - sheet.height) / 2,
			width,
			height: sheet.height,
		};
	};

	/**
	 * Escribe la posición del marco y la escala del libro dentro de él.
	 *
	 * Cuando el marco solo enseña una hoja, el bloque interior sigue midiendo
	 * el doblece completo (el motor lo necesita así); se corre hacia la
	 * izquierda el ancho de una hoja para que sea la mitad con la tapa, y no
	 * el hueco vacío, la que cae dentro del marco.
	 */
	const place = (box: Box, scale: number): void => {
		const { style } = el.frame;

		style.left = `${box.x}px`;
		style.top = `${box.y}px`;
		style.width = `${box.width}px`;
		style.height = `${box.height}px`;

		const shift = soloCover() ? -(state.sheet as BookSheet).width : 0;
		el.inner.style.transform = `scale(${scale}) translateX(${shift}px)`;
	};

	/** Quita la transición del marco sin tocar la de las hojas. */
	const freeze = (): void => {
		el.frame.style.transition = "none";
		el.inner.style.transition = "none";
	};

	/**
	 * Lleva el marco de una caja a otra interpolando entre las dos.
	 *
	 * La primera se escribe sin transición y la segunda a continuación, tras
	 * forzar un reflow. Esa pareja es la que hace que el navegador anime el
	 * cambio en vez de saltarlo.
	 */
	const travel = (from: Box, to: Box, scaleFrom: number, scaleTo: number): void => {
		freeze();
		place(from, scaleFrom);
		void el.frame.offsetHeight;

		el.frame.style.transition = "";
		el.inner.style.transition = "";
		place(to, scaleTo);
	};

	/**
	 * Vuelve a calcular `--book-text-scale` a partir del alto de hoja medido.
	 *
	 * Las plantillas escriben sus tamaños en rem contra un alto de referencia
	 * (`BOOK_TEXT_REFERENCE_HEIGHT`); esta es la conversión de esa referencia al
	 * alto real, para que la letra se lea igual de proporcionada sea cual sea
	 * la ventana, sin que el lector tenga que ajustar nada.
	 */
	const applyTextScale = (): void => {
		const sheet = state.sheet;
		if (!sheet) return;

		const responsive = sheet.height / BOOK_TEXT_REFERENCE_HEIGHT;
		const scale = Math.min(
			BOOK_TEXT_SCALE_RANGE.max,
			Math.max(BOOK_TEXT_SCALE_RANGE.min, responsive),
		);

		el.inner.style.setProperty("--book-text-scale", String(scale));
	};

	/** Aplica la caja medida al bloque del motor, al marco interior y a la letra. */
	const sizeBlock = (): void => {
		const sheet = state.sheet;
		if (!sheet) return;

		for (const node of [el.block, el.inner]) {
			node.style.width = `${sheet.spread}px`;
			node.style.height = `${sheet.height}px`;
		}

		applyTextScale();
		state.engine?.update();
	};

	/**
	 * Recoloca el marco sobre la hoja actual, sin animación.
	 *
	 * Hace falta porque solo la tapa se ve sola: en cuanto el lector pasa a la
	 * primera hoja interior, el marco vuelve a medir el doblece completo, y
	 * viceversa al volver a la tapa. Sin este ajuste en cada volteo, el marco
	 * se quedaría con el ancho de la apertura y recortaría el doblece.
	 */
	const syncFrame = (): void => {
		if (state.phase !== "open" || !state.sheet) return;

		freeze();
		place(centered(state.sheet), 1);
	};

	/* ---------------------------------------------------------------------- */
	/* Abrir y cerrar                                                            */
	/* ---------------------------------------------------------------------- */

	/**
	 * La caja que ocupa el libro abierto al posarse sobre su tarjeta.
	 *
	 * La tarjeta y el libro abierto no tienen la misma proporción —3:4 contra
	 * algo más alargado, porque el doblece lleva el ensanche de la perspectiva—
	 * así que la escala sale del lado que más manda y la diferencia se reparte
	 * a los lados. Escalar solo por la altura dejaría una franja vacía.
	 */
	const onCard = (card: DOMRect, sheet: BookSheet, scale: number): Box => {
		const width = visibleWidth(sheet) * scale;
		const height = sheet.height * scale;

		return {
			x: card.x + (card.width - width) / 2,
			y: card.y + (card.height - height) / 2,
			width,
			height,
		};
	};

	/** Los dos extremos de cada viaje: sale de la tarjeta, o vuelve a ella. */
	const route = (direction: Travel): { from: Box; to: Box; scale: number } => {
		const sheet = state.sheet as BookSheet;
		const card = el.anchor.getBoundingClientRect();
		const cardWidth = card.width > 0 ? card.width : 280;
		const cardHeight = card.height > 0 ? card.height : 360;
		const scale = Math.min(cardWidth / visibleWidth(sheet), cardHeight / sheet.height);

		const folded = onCard(
			card.width > 0
				? card
				: ({
						x: (window.innerWidth - cardWidth) / 2,
						y: (window.innerHeight - cardHeight) / 2,
						width: cardWidth,
						height: cardHeight,
					} as DOMRect),
			sheet,
			scale,
		);
		const open = centered(sheet);

		return direction === "open"
			? { from: folded, to: open, scale }
			: { from: open, to: folded, scale };
	};

	/**
	 * Empieza un viaje del marco y pone su red de seguridad.
	 *
	 * Abrir y cerrar son el mismo movimiento en direcciones opuestas, así que
	 * comparten esta función: lo único que cambia es la fila de la tabla.
	 */
	const depart = (direction: Travel): void => {
		const { from, to, scale } = route(direction);
		const opening = direction === "open";

		hideMedia();
		state.phase = opening ? "opening" : "closing";
		state.timer = window.setTimeout(
			() => settle(direction),
			BOOK_TRANSITION[opening ? "openFallback" : "closeFallback"],
		);

		travel(from, to, opening ? scale : 1, opening ? 1 : scale);
	};

	/** Qué queda del marco al terminar de abrir, o de cerrar. */
	const LANDING: Record<Travel, () => void> = {
		open: () => {
			freeze();
			place(centered(state.sheet as BookSheet), 1);
			state.phase = "open";
		},
		closed: () => {
			state.phase = "closed";
			hideMedia();
			unlockScroll();
			el.overlay.hidden = true;
			state.focus?.focus({ preventScroll: true });
			state.focus = null;
		},
	};

	/** Termina el viaje en curso, llegue como llegue. */
	const settle = (direction: Travel): void => {
		window.clearTimeout(state.timer);
		LANDING[direction]();
	};

	/* ---------------------------------------------------------------------- */
	/* Navegación                                                                */
	/* ---------------------------------------------------------------------- */

	/** Refleja la hoja actual en el índice, las flechas y la etiqueta. */
	const syncControls = (): void => {
		el.range.value = String(spreadOf(state.page, spreads));
		el.pageLabel.textContent = describePage(state.page, labels);
		el.prev.disabled = state.page === 0;
		el.next.disabled = state.page >= labels.length - 1;
	};

	/**
	 * Anima la entrada del contenido de las hojas que se están viendo.
	 *
	 * El escalonado se escribe en una variable CSS por bloque, así que el
	 * estilo solo tiene que saber que existe.
	 */
	const revealAround = (page: number): void => {
		const block = state.engine?.block;
		if (!block) return;

		const visible = new Set(sheetsInSpread(page, labels.length));

		block.querySelectorAll<HTMLElement>(SHEETS).forEach((sheet, index) => {
			// Se quita y se vuelve a poner para que la animación corra de cero
			// aunque la hoja ya estuviera marcada de una visita anterior.
			sheet.removeAttribute(BOOK_ATTR.shown);
			if (!visible.has(index)) return;

			void sheet.offsetWidth;
			sheet.setAttribute(BOOK_ATTR.shown, "true");
			sheet.querySelectorAll<HTMLElement>(REVEAL).forEach((target, order) =>
				target.style.setProperty("--book-delay", `${order * BOOK_REVEAL_STAGGER_MS}ms`),
			);
		});
	};

	/* ---------------------------------------------------------------------- */
	/* Fotografías y videos                                                      */
	/* ---------------------------------------------------------------------- */

	const hideMedia = (): void => {
		if (el.media.hidden) return;

		// Vaciar el contenido es lo que detiene un video: quitarlo del DOM lo pausa.
		el.mediaBody.replaceChildren();
		el.media.hidden = true;
	};

	const showMedia = (media: Parameters<typeof buildMedia>[0]): void => {
		el.mediaBody.replaceChildren(buildMedia(media));
		el.mediaAlt.textContent = media.alt;
		el.media.hidden = false;
		el.mediaBack.focus({ preventScroll: true });
	};

	/* ---------------------------------------------------------------------- */
	/* Teclado                                                                  */
	/* ---------------------------------------------------------------------- */

	/**
	 * Lo que está abierto por encima del libro, de la capa más alta a la más
	 * baja. La tecla Escape las recorre y se detiene en la primera abierta, así
	 * que añadir una capa —un comentario, un mapa— es añadir una fila.
	 */
	const LAYERS: readonly { isOpen: () => boolean; close: () => void }[] = [
		{ isOpen: () => !el.media.hidden, close: hideMedia },
	];

	/** Si la tecla le corresponde a un control, no al libro. */
	const isTyping = (target: EventTarget | null): boolean =>
		target instanceof HTMLElement && /^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName);

	/* ---------------------------------------------------------------------- */
	/* Acciones                                                                 */
	/* ---------------------------------------------------------------------- */

	/** Abre el libro. Si ya está en cualquier otro punto, no hace nada. */
	const open = (trigger: HTMLElement): void => {
		if (state.phase !== "closed") return;

		// Si el libro está en la portada cerrada, abrirlo muestra directamente
		// el primer doblece con las páginas para que se vea abierto de inmediato.
		if (state.page === 0) {
			state.page = 1;
			state.engine?.flip(1);
		}

		// Se mide antes de bloquear el scroll: bloquearlo puede desplazar la
		// página, y con ella el sitio del que sale el libro.
		state.sheet = measureBookSheet();
		state.focus = trigger;

		el.overlay.hidden = false;
		el.range.max = String(spreads - 1);

		// `page-flip` mide el bloque al construirse. Darle sus dimensiones antes
		// evita que calcule orientación y tamaño con una caja de 0 × 0.
		sizeBlock();
		mount();
		syncControls();
		revealAround(state.page);

		lockScroll();
		el.close.focus({ preventScroll: true });
		depart("open");
	};

	/** Cierra el libro. Es un pedido porque cerrar es una animación. */
	const close = (): void => {
		if (state.phase === "closed" || state.phase === "closing") return;

		// Sin medidas no hay viaje posible, así que se cierra de golpe.
		if (state.sheet) depart("closed");
		else settle("closed");
	};

	/** Crea el motor una única vez y le entrega las hojas que escribió Astro. */
	const mount = (): void => {
		if (state.engine) return;

		state.engine = createBookEngine(
			el.block,
			Array.from(el.pages.children) as HTMLElement[],
			state.page,
			(page) => {
				state.page = page;
				revealAround(page);
				syncControls();
				syncFrame();
			},
		);
	};

	/* ---------------------------------------------------------------------- */
	/* Scroll de la página                                                      */
	/* ---------------------------------------------------------------------- */

	/**
	 * El libro ocupa la pantalla entera, así que detrás no debe quedar scroll.
	 * Se guarda lo que hubiera y se restaura al cerrar, porque otra cosa puede
	 * haberlo fijado antes.
	 */
	let scrollBefore: string | null = null;

	const lockScroll = (): void => {
		scrollBefore = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		document.documentElement.style.overflow = "hidden";
	};

	const unlockScroll = (): void => {
		document.body.style.overflow = scrollBefore ?? "";
		document.documentElement.style.overflow = "";
		scrollBefore = null;
	};

	/* ---------------------------------------------------------------------- */
	/* Escucha                                                                  */
	/* ---------------------------------------------------------------------- */

	/**
	 * A qué viaje cierra la fase en curso, o `undefined` si no hay ninguno.
	 *
	 * Hace falta porque el marco anima cuatro propiedades a la vez y cada una
	 * dispara su propio `transitionend`. El primero da por terminado el viaje;
	 * los otros tres llegan con el libro ya abierto y, sin esta tabla, se
	 * tomarían por el final de un cierre y lo cerrarían solos. Solo las fases en
	 * movimiento tienen entrada, así que los que sobran se descartan.
	 */
	const TRAVEL_ENDS: Partial<Record<BookPhase, Travel>> = {
		opening: "open",
		closing: "closed",
	};

	const onTransitionEnd = (event: TransitionEvent): void => {
		if (event.target !== el.frame) return;

		const travel = TRAVEL_ENDS[state.phase];
		if (!travel) return;

		settle(travel);
	};

	const onKeyDown = (event: KeyboardEvent): void => {
		if (state.phase === "closed" || isTyping(event.target)) return;

		const KEYS: Record<string, () => void> = {
			Escape: () => (LAYERS.find((layer) => layer.isOpen())?.close ?? close)(),
			ArrowLeft: () => state.engine?.flipPrev(),
			ArrowRight: () => state.engine?.flipNext(),
		};

		const action = KEYS[event.key];
		if (!action) return;

		event.preventDefault();
		action();
	};

	/** El motor solo se mueve al soltar: durante el arrastre manda el índice. */
	const onScrub = (): void => {
		el.pageLabel.textContent = describePage(pageOfSpread(Number(el.range.value)), labels);
	};

	const onScrubCommit = (): void => {
		const target = pageOfSpread(Number(el.range.value));
		if (target !== state.page) state.engine?.flip(target);
	};

	/** Recalcula medidas, y recoloca solo si el libro ya está quieto. */
	const onResize = (): void => {
		if (state.phase === "closed") return;

		state.sheet = measureBookSheet();
		sizeBlock();

		// Durante la apertura, escribir la caja final la cancelaría.
		if (state.phase === "open") {
			freeze();
			place(centered(state.sheet), 1);
		}
	};

	/**
	 * Corta el gesto antes de que el motor lo lea como un intento de volteo.
	 *
	 * El volteo se dispara con `mousedown`, así que para que ampliar una foto no
	 * se confunda con un arrastre hay que cortarlo en fase de captura, antes de
	 * que llegue a los listeners del motor.
	 */
	const swallowExpand = (event: Event): void => {
		if ((event.target as Element | null)?.closest?.(expand)) event.stopPropagation();
	};

	const onExpand = (event: Event): void => {
		const target = (event.target as Element | null)?.closest?.<HTMLElement>(expand);
		if (!target) return;

		const media = mediaUnder(target);
		if (!media) return;

		event.preventDefault();
		showMedia(media);
	};

	const bind = (): void => {
		// Todo elemento marcado como disparador abre el libro: el botón de la
		// tarjeta y el propio libro cerrado en 3D.
		section
			.querySelectorAll<HTMLElement>(BOOK_SELECT.open)
			.forEach((trigger) =>
				trigger.addEventListener("click", (event) => {
					event.preventDefault();
					open(trigger);
				}),
			);

		el.close.addEventListener("click", close);
		el.backdrop.addEventListener("click", close);
		el.mediaBack.addEventListener("click", hideMedia);
		el.prev.addEventListener("click", () => state.engine?.flipPrev());
		el.next.addEventListener("click", () => state.engine?.flipNext());

		el.frame.addEventListener("transitionend", onTransitionEnd);
		el.range.addEventListener("input", onScrub);
		el.range.addEventListener("change", onScrubCommit);

		document.addEventListener("keydown", onKeyDown);
		window.addEventListener("resize", onResize);

		el.overlay.addEventListener("mousedown", swallowExpand, true);
		el.overlay.addEventListener("touchstart", swallowExpand, true);
		el.overlay.addEventListener("click", onExpand);
	};

	bind();

	return {
		open,
		close,
		phase: () => state.phase,
		destroy: () => {
			document.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("resize", onResize);
		},
	};
};
