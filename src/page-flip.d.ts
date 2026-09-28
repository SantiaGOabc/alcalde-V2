/**
 * Tipos de `page-flip`, la librería que animate el volteo de páginas.
 *
 * El paquete no los publica, así que aquí se declara solo la superficie que el
 * visor usa de verdad. Deliberadamente corta: si algún día se actualiza la
 * librería, esta declaración avisa en vez de romperse en silencio.
 *
 * Un detalle importante del formato: el `main` del paquete es un UMD
 * compilado, no un módulo ESM. Sus exports no se pueden leer como
 * `import { PageFlip } from "page-flip"`, porque un CommonJS no declara sus
 * exports de forma estática y el empaquetador no puede verlos. La única forma
 * fiable es tomar el default y desestructurarlo, que es justo lo que hace
 * `bookEngine.ts`. El bundle de ESM que sí trae el paquete no está en el
 * `package.json`, así que no se puede pedir.
 */
declare module "page-flip" {
	/** Ajustes del motor de volteo. */
	export interface FlipSetting {
		/** Página por la que se empieza a leer. */
		startPage: number;
		/** `stretch` adapta la hoja al contenedor; `fixed` respeta width/height. */
		size: "fixed" | "stretch";
		/** Ancho de UNA hoja, en píxeles. El libro abierto muestra dos. */
		width: number;
		/** Alto de la hoja, en píxeles. */
		height: number;
		/** Iguala el tamaño del contenedor al del libro, en vez de al revés. */
		autoSize: boolean;
		/** Encuadre en móvil: por debajo de dos hojas, mostrar una sola. */
		usePortrait: boolean;
		/** Duración del volteo, en milisegundos. */
		flippingTime: number;
		/** Dibuja la sombra bajo la hoja que se levanta. */
		drawShadow: boolean;
		/** Intensidad de esa sombra, de 0 a 1. */
		maxShadowOpacity: number;
		/** Marca la primera y la última hoja como tapas y las muestra solas. */
		showCover: boolean;
		/** Evita que un arrastre horizontal mueva la página en móvil. */
		mobileScrollSupport: boolean;
		/** Reenvía a las hojas los clics en botones y enlaces que contienen. */
		clickEventForward: boolean;
		/** Pliega la esquina que está bajo el puntero, en los dos lados. */
		showPageCorners: boolean;
		/** Distancia mínima de arrastre, en píxeles, para contar como volteo. */
		swipeDistance?: number;
		/** Bloquea el volteo por clic y obliga a usar las esquinas. */
		disableFlipByClick?: boolean;
	}

	/** Payload que recibe un listener de `PageFlip.on`. */
	export interface FlipEvent<T> {
		data: T;
		object: PageFlip;
	}

	/** Contenedor interno del libro, donde el motor deposita las hojas. */
	export interface FlipUI {
		getDistElement(): HTMLElement;
	}

	/**
	 * Motor de volteo. Se construye sobre un contenedor vacío y se le entregan
	 * las hojas ya renderizadas: no crea ni modifica su contenido, solo las
	 * mueve y las anima.
	 */
	export class PageFlip {
		constructor(element: HTMLElement, settings: FlipSetting);

		/** Entrega las hojas al motor. `elements` se mueven al contenedor. */
		loadFromHTML(elements: HTMLElement[]): void;

		/** Sustituye las hojas conservando la página actual. */
		updateFromHtml(elements: HTMLElement[]): void;

		/** Vuelve a medir el libro contra el contenedor. Tras un `resize`. */
		update(): void;

		/** Salta a una página concreta, animando el volteo. */
		flip(page: number, corner?: "top" | "bottom"): void;

		/** Salta a la página siguiente o a la anterior. */
		flipNext(corner?: "top" | "bottom"): void;
		flipPrev(corner?: "top" | "bottom"): void;

		/** Cambia de página sin animación. */
		turnToPage(page: number): void;
		turnToNextPage(): void;
		turnToPrevPage(): void;

		/** Página que se está leyendo, en base 0. */
		getCurrentPageIndex(): number;

		/** Cuántas hojas tiene el libro. */
		getPageCount(): number;

		/** Contenedor interno del libro. */
		getUI(): FlipUI;

		/** Escucha `init`, `flip`, `changeState` o `changeOrientation`. */
		on(event: string, handler: (event: FlipEvent<unknown>) => void): this;

		/** Cancela un listener previamente registrado con `on`. */
		off(event: string): this;
	}

	/**
	 * El módulo tal como lo ve un importador de un paquete CommonJS: un objeto
	 * con los exports colgando, no los exports en sí. Es la forma en la que
	 * `bookEngine.ts` tiene que importar la librería.
	 */
	const pageFlip: { PageFlip: typeof PageFlip };

	export default pageFlip;
}
