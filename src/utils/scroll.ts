export interface ScrollProgressOptions {
	/** Elemento observado. Por defecto, el propio que contiene al script. */
	target?: HTMLElement | null;
	/** Propiedad CSS donde se escribe el progreso. */
	property?: string;
	/** Margen en px para empezar a contar antes de que el bloque entre en pantalla. */
	start?: number;
	/** Margen en px para dejar de contar. */
	end?: number;
}

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/**
 * Escribe en una CSS custom property el progreso 0→1 de un bloque a medida que
 * se recorre con el scroll vertical. Pensado para sliders horizontales.
 *
 * Solo se suscribe mientras el bloque está en pantalla y se desuscribe solo si
 * el usuario pide menos movimiento, así que no cuesta nada fuera de vista.
 *
 * Marca el elemento con `data-scroll-progress` para que el CSS sepa que puede
 * activar el modo "pinned"; sin JS el bloque queda como fallback utilizable.
 *
 * @example
 * ```astro
 * <div class="slider" style="--items: 4">…</div>
 * <script>
 *   import { bindScrollProgress } from '@utils';
 *   bindScrollProgress({ target: document.querySelector('.slider') });
 * </script>
 * ```
 */
export const bindScrollProgress = ({
	target,
	property = '--progress',
	start = 0,
	end = 0,
}: ScrollProgressOptions = {}): (() => void) => {
	const noop = () => undefined;
	if (!target) return noop;

	const reduceMotion =
		window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

	if (reduceMotion || !('IntersectionObserver' in window)) return noop;

	let frame = 0;

	const update = () => {
		frame = 0;

		const rect = target.getBoundingClientRect();
		const distance = rect.height - window.innerHeight;

		if (distance <= 0) {
			target.style.setProperty(property, '1');
			return;
		}

		const progress = clamp01(
			(-rect.top - start) / (distance + start - end),
		);

		target.style.setProperty(property, progress.toFixed(4));
	};

	const request = () => {
		if (frame) return;
		frame = requestAnimationFrame(update);
	};

	target.setAttribute('data-scroll-progress', '');

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					window.addEventListener('scroll', request, { passive: true });
					window.addEventListener('resize', request);
					request();
				} else {
					// Se desconecta el scroll, pero NO se borra la propiedad: al
					// volver a entrar se recalcula, y mientras tanto el bloque
					// conserva la ultima posicion en vez de volver al inicio.
					window.removeEventListener('scroll', request);
					window.removeEventListener('resize', request);
				}
			});
		},
		{ rootMargin: `${start}px 0px ${-end}px 0px` },
	);

	observer.observe(target);

	return () => {
		observer.disconnect();
		window.removeEventListener('scroll', request);
		window.removeEventListener('resize', request);
		if (frame) cancelAnimationFrame(frame);
	};
};
