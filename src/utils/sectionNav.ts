import { $$ } from './dom';

export interface SectionNavOptions {
  /** Selector de los bloques que se recorren; su valor de `data-*` enlaza con el índice. */
  sections: string;
  /** Selector de los enlaces del índice. */
  links: string;
}

/**
 * Índice lateral que resalta (`aria-current`) la sección que ocupa el centro de
 * la pantalla. El id de cada sección coincide con el `data-*` de su enlace.
 * Devuelve la función que desconecta el observer.
 */
export const bindSectionNav = ({ sections, links }: SectionNavOptions): (() => void) => {
  const blocks = Array.from($$<HTMLElement>(sections));
  const anchors = Array.from($$<HTMLElement>(links));
  if (!blocks.length || !anchors.length || !('IntersectionObserver' in window)) return () => undefined;

  const highlight = (id: string) =>
    anchors.forEach((anchor) => {
      const isActive = Object.values(anchor.dataset).includes(id);
      isActive ? anchor.setAttribute('aria-current', 'true') : anchor.removeAttribute('aria-current');
    });

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && highlight(entry.target.id)),
    // Franja fina en el centro del viewport: solo una sección a la vez la cruza.
    { rootMargin: '-45% 0px -50% 0px' },
  );

  blocks.forEach((block) => observer.observe(block));
  return () => observer.disconnect();
};
