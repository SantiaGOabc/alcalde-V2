import { BOOK_ATTR, BOOK_SELECT, datasetKey } from "@constant";
import { YOUTUBE_ALLOW, isYoutube, youtubeEmbed, youtubeId } from "@utils";

/* ==========================================================================
   Los nodos del visor
   --------------------------------------------------------------------------
   Se piden todos al montar y se guardan en un objeto. Un `querySelector` por
   nodo, escrito en el sitio donde se usa, obliga a repetir el selector cada
   vez y a comprobar en cada lectura que el nodo existe. Esta tabla lo resuelve
   una vez: si falta algo, revienta al montar y no al hacer clic.
   ========================================================================== */

/**
 * Qué busca cada nodo.
 *
 * El tipo de `BookNodes` sale de esta tabla, así que añadir un nodo es añadirlo
 * aquí y nada más: no puede quedar un `interface` desincronizado de la búsqueda.
 */
const NODES = {
	overlay: BOOK_SELECT.overlay,
	backdrop: BOOK_SELECT.backdrop,
	/** El marco se posiciona y se dimensiona desde el visor. */
	frame: BOOK_SELECT.frame,
	inner: BOOK_SELECT.inner,
	block: BOOK_SELECT.block,
	/** El libro cerrado de la tarjeta: de aquí sale el libro al abrirse. */
	anchor: BOOK_SELECT.anchor,
	/** Donde Astro deja las hojas antes de que las coja el motor. */
	pages: BOOK_SELECT.pages,
	toolbar: BOOK_SELECT.toolbar,
	footer: BOOK_SELECT.footer,
	close: BOOK_SELECT.close,
	prev: BOOK_SELECT.prev,
	next: BOOK_SELECT.next,
	/** Índice del libro: va por dobleces, no por hojas. */
	range: BOOK_SELECT.range,
	pageLabel: BOOK_SELECT.pageLabel,
	media: BOOK_SELECT.media,
	mediaBody: BOOK_SELECT.mediaBody,
	mediaAlt: BOOK_SELECT.mediaAlt,
	mediaBack: BOOK_SELECT.mediaBack,
} as const;

/** Botones: se les hace clic. */
type Buttons = "close" | "prev" | "next" | "mediaBack";

/** Deslizadores: además se les lee y se les escribe `value`. */
type Ranges = "range";

/** Nodos que el visor maneja, ya resueltos y tipados por su nombre. */
export type BookNodes = {
	[Name in keyof typeof NODES]: Name extends Ranges
		? HTMLInputElement
		: Name extends Buttons
			? HTMLButtonElement
			: HTMLElement;
};

/** Resuelve todos los nodos del visor, o falla diciendo cuál falta. */
export const pickBookNodes = (root: ParentNode): BookNodes =>
	Object.fromEntries(
		Object.entries(NODES).map(([name, selector]) => {
			const node = root.querySelector<HTMLElement>(selector);
			if (!node) throw new Error(`El visor del libro no encuentra ${selector}`);
			return [name, node];
		}),
	) as BookNodes;

/* ==========================================================================
   Fotografías y videos
   --------------------------------------------------------------------------
   Ampliar una hoja es abrir un medio encima del libro. Hay tres, y cada uno se
   construye de una forma, así que van los tres juntos: añadir un cuarto es una
   entrada más en la tabla, no un `else` más en el visor.
   ========================================================================== */

/** Lo que el visor necesita saber de un medio abierto. */
export interface OpenMedia {
	type: "image" | "video" | "embed";
	src: string;
	alt: string;
	/** Póster de un video. Sin él, el reproductor arranca en negro. */
	poster?: string;
}

const VIDEO_FILE = /\.(mp4|webm|ogv|mov)(\?|#|$)/i;

/** Cómo se decide qué tipo de medio es una URL. El primero que encaja gana. */
const MEDIA_RULES: readonly { type: OpenMedia["type"]; matches: (src: string) => boolean }[] = [
	{ type: "video", matches: (src) => VIDEO_FILE.test(src) },
	{ type: "embed", matches: isYoutube },
];

const buildImage = ({ src, alt }: OpenMedia): HTMLElement => {
	const image = document.createElement("img");
	image.src = src;
	image.alt = alt;
	image.decoding = "async";
	// `w-auto` y no `w-full`: con el ancho al 100 % una foto vertical se
	// estiraría hasta quedar más alta que la pantalla. Aquí manda el alto y el
	// ancho se acomoda.
	image.className = "book-media__frame max-h-[72svh] w-auto rounded-brand object-contain";
	return image;
};

/**
 * El reproductor.
 *
 * El póster no es adorno: sin él el primer fotograma del video aparece sobre un
 * rectángulo negro, que es justo lo que hace que un reproductor parezca roto.
 *
 * Se reproducen en bucle y solos porque el libro se lee pasando hojas, y un
 * video parado a media escena se queda ahí esperando a que nadie vuelva.
 */
const buildVideo = ({ src, poster }: OpenMedia): HTMLElement => {
	const video = document.createElement("video");
	video.src = src;
	if (poster) video.poster = poster;
	video.controls = true;
	video.autoplay = true;
	video.loop = true;
	video.playsInline = true;
	// El bucle y la reproducción automática necesitan que el archivo esté
	// preparado; con `none` algunos navegadores no arrancan hasta el primer
	// toque, que es justo lo que se quiere evitar aquí.
	video.preload = "auto";
	video.className =
		"book-media__frame max-h-[72svh] w-auto rounded-brand bg-black object-contain";
	return video;
};

const buildEmbed = ({ src, alt }: OpenMedia): HTMLElement => {
	const id = youtubeId(src);
	// `mediaTypeOf` only routes here when the URL matched `isYoutube`, so this
	// guard is unreachable. It is here to keep the types honest.
	if (!id) return buildImage({ type: "image", src, alt });

	const frame = document.createElement("iframe");
	frame.src = youtubeEmbed(id);
	frame.title = alt;
	frame.allow = YOUTUBE_ALLOW;
	frame.allowFullscreen = true;
	frame.className =
		"book-media__frame aspect-video w-full max-w-5xl rounded-brand border-0";
	return frame;
};

const MEDIA_BUILDERS: Record<OpenMedia["type"], (media: OpenMedia) => HTMLElement> =
	{ image: buildImage, video: buildVideo, embed: buildEmbed };

/** Construye el elemento que corresponde al tipo de medio. */
export const buildMedia = (media: OpenMedia): HTMLElement =>
	MEDIA_BUILDERS[media.type](media);

/** Clasifica una URL. Si nada encaja es una imagen, que es el caso normal. */
export const mediaTypeOf = (src: string): OpenMedia["type"] =>
	MEDIA_RULES.find((rule) => rule.matches(src))?.type ?? "image";

/**
 * El medio que hay detrás de un elemento ampliable, o `null` si no lo hay.
 *
 * El video manda sobre la imagen: una hoja que trae los dos enseña el video.
 * El texto alternativo sale del propio elemento para no duplicarlo.
 */
export const mediaUnder = (target: HTMLElement): OpenMedia | null => {
	const labelled = target.getAttribute("aria-label") ?? "";
	const videoUrl = target.dataset[datasetKey(BOOK_ATTR.videoUrl)];

	if (videoUrl) {
		const poster = target.dataset[datasetKey(BOOK_ATTR.videoPoster)];
		return { type: mediaTypeOf(videoUrl), src: videoUrl, alt: labelled, poster };
	}

	const image = target.querySelector("img");
	return image
		? { type: "image", src: image.currentSrc || image.src, alt: image.alt }
		: null;
};
