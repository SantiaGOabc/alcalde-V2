import type { ObserveTarget, ObserveVisibilityOptions, RevealOptions } from '@types';
import { $$ } from "@utils";

const OBSERVED_ATTR = 'data-reveal-observed';

let viewTransitionsBound = false;

const toElements = (targets?: ObserveTarget | null): Element[] => {
	if (!targets) return Array.from($$('[data-reveal]'));
	if (targets instanceof Element) return [targets];
	return Array.from(targets);
};

const prefersReducedMotion = (): boolean =>
	window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

/**
 * Primitiva: llama `onVisible` cada vez que un elemento entra en el viewport.
 * Si el navegador no soporta IntersectionObserver o el usuario pidió menos
 * movimiento, se ejecuta de inmediato para no dejar contenido inaccesible.
 */
export const observeVisibility = (
	targets: ObserveTarget | null,
	onVisible: (element: Element) => void,
	{
		rootMargin = '0px 0px -10% 0px',
		threshold = 0.15,
		once = true,
	}: ObserveVisibilityOptions = {},
): void => {
	const elements = toElements(targets);

	if (elements.length === 0) return;

	if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
		elements.forEach((element) => onVisible(element));
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				onVisible(entry.target);
				if (once) observer.unobserve(entry.target);
			});
		},
		{ rootMargin, threshold },
	);

	elements.forEach((element) => observer.observe(element));
};

/**
 * Marca cualquier elemento con `data-reveal` para que se anime al entrar en
 * pantalla. El CSS hace el resto: solo necesita ocultar `[data-reveal]` cuando
 * el documento lleva `[data-js-reveal]`, así nunca se oculta nada sin JS.
 *
 * @example
 * ```astro
 * <div data-reveal>…</div>
 * <script>
 *   import { initRevealOnScroll } from '@utils';
 *   initRevealOnScroll();
 * </script>
 * ```
 */
export const initRevealOnScroll = ({
	targets,
	visibleClass = 'is-in',
	onReveal,
	...observeOptions
}: RevealOptions = {}): void => {
	const reveal = () => {
		const elements = toElements(targets).filter(
			(element) => !element.hasAttribute(OBSERVED_ATTR),
		);

		if (elements.length === 0) return;

		elements.forEach((element) => element.setAttribute(OBSERVED_ATTR, ''));

		// Se marca el documento justo antes de ocultar, para que el CSS solo
		// aplique el estado inicial cuando ya hay quien lo va a revertir.
		document.documentElement.setAttribute('data-js-reveal', '');

		observeVisibility(elements, (element) => {
			element.classList.add(visibleClass);
			onReveal?.(element);
		}, observeOptions);
	};

	reveal();

	// Reejecuta tras navegaciones de Astro View Transitions.
	if (viewTransitionsBound) return;
	viewTransitionsBound = true;
	document.addEventListener('astro:page-load', reveal);
};
