import { getElementById } from './dom';

/** Scroll (px) a partir del cual el navbar transparente pasa a fondo sólido. */
const SOLID_AFTER_SCROLL = 16;

/** Breakpoint (Tailwind `md`) desde el que el menú móvil deja de existir. */
const DESKTOP_QUERY = '(min-width: 768px)';

/**
 * Un navbar `data-transparent` arranca sin fondo (sobre un hero) y se vuelve
 * sólido al hacer scroll. Los demás nacen sólidos desde el CSS.
 */
const bindScrollState = (navbar: HTMLElement, signal: AbortSignal): void => {
  if (navbar.dataset.transparent !== 'true') return;

  const update = () => {
    navbar.dataset.solid = String(window.scrollY > SOLID_AFTER_SCROLL);
  };

  update();
  window.addEventListener('scroll', update, { passive: true, signal });
};

/** Menú móvil a pantalla completa: abre/cierra y bloquea el scroll del fondo. */
const bindMobileMenu = (
  navbar: HTMLElement,
  menu: HTMLElement,
  toggle: HTMLElement,
  signal: AbortSignal,
): void => {
  const isOpen = () => menu.dataset.open === 'true';

  const setOpen = (open: boolean) => {
    navbar.dataset.menuOpen = String(open);
    menu.dataset.open = String(open);
    menu.inert = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.documentElement.classList.toggle('overflow-hidden', open);
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()), { signal });
  menu
    .querySelectorAll('a')
    .forEach((link) => link.addEventListener('click', () => setOpen(false), { signal }));
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && isOpen()) setOpen(false);
    },
    { signal },
  );
  window.matchMedia(DESKTOP_QUERY).addEventListener(
    'change',
    (event) => {
      if (event.matches) setOpen(false);
    },
    { signal },
  );

  // Al salir de la página el menú no debe dejar el scroll bloqueado.
  signal.addEventListener('abort', () => document.documentElement.classList.remove('overflow-hidden'));
};

/** Conecta el navbar de la página actual. Devuelve la función que quita todos sus oyentes. */
export const initNavbar = (): (() => void) => {
  const navbar = getElementById('site-navbar');
  if (!navbar) return () => undefined;

  const controller = new AbortController();
  const { signal } = controller;

  bindScrollState(navbar, signal);

  const menu = getElementById('mobile-menu');
  const toggle = getElementById('menu-toggle');
  if (menu && toggle) bindMobileMenu(navbar, menu, toggle, signal);

  return () => controller.abort();
};
