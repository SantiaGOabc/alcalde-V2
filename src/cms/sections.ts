import {
  CONTENT_HERO_ABOUT,
  CONTENT_HERO_HOME,
  CONTENT_HERO_MANAGEMENT,
  MAILBOX_CONTENT,
  SECTION_ABOUT_CLOSING,
  SECTION_ABOUT_HITOS,
  SECTION_ABOUT_PASIONES,
  SECTION_ABOUT_PASSIONS,
  SECTION_ABOUT_PERSON,
  SECTION_BEFORE_AFTER_CONTENT,
  SECTION_BIOGRAPHY_CONTENT,
  SECTION_BOOK_CONTENT,
  SECTION_GESTION,
  SECTION_MANAGEMENT_CLOSING,
  SECTION_PHRASES_CONTENT,
  SECTION_TIKTOK_CONTENT,
} from '@constant';

/** Página pública donde se ve cada sección: es lo que muestra la vista previa. */
const PAGES = {
  home: { page: 'Inicio', path: '/' },
  about: { page: 'Sobre mí', path: '/about' },
  management: { page: 'Gestión', path: '/management' },
  mailbox: { page: 'Buzón ciudadano', path: '/mailbox' },
} as const;

/**
 * Registro de secciones editables desde el panel.
 *
 * Cada entrada liga una clave (la de `site_content.key`) con sus datos POR
 * DEFECTO: los `constants`. Para volver editable una sección nueva basta con
 * añadirla aquí y leerla con `getContent(clave)` en la página.
 *
 * Regla: los defaults son siempre un objeto en la raíz (los arreglos van dentro
 * de una clave, p. ej. `items`) para poder completarlos con `reconcile`.
 */
export const CMS_SECTIONS = {
  'home.hero': { ...PAGES.home, label: 'Hero', defaults: CONTENT_HERO_HOME },
  'home.biography': { ...PAGES.home, label: '¿Quién soy?', defaults: SECTION_BIOGRAPHY_CONTENT },
  'home.phrases': { ...PAGES.home, label: 'Frases', defaults: SECTION_PHRASES_CONTENT },
  'home.beforeAfter': { ...PAGES.home, label: 'Antes y después', defaults: SECTION_BEFORE_AFTER_CONTENT },
  'home.book': { ...PAGES.home, label: 'Libro digital (tarjeta)', defaults: SECTION_BOOK_CONTENT },
  'home.tiktok': { ...PAGES.home, label: 'Feed de TikTok', defaults: SECTION_TIKTOK_CONTENT },

  'about.hero': { ...PAGES.about, label: 'Hero', defaults: CONTENT_HERO_ABOUT },
  'about.person': { ...PAGES.about, label: 'La persona', defaults: SECTION_ABOUT_PERSON },
  'about.passions': {
    ...PAGES.about,
    label: 'Mis pasiones',
    defaults: { header: SECTION_ABOUT_PASSIONS, items: SECTION_ABOUT_PASIONES },
  },
  'about.hitos': { ...PAGES.about, label: 'Línea de tiempo', defaults: { items: SECTION_ABOUT_HITOS } },
  'about.closing': { ...PAGES.about, label: 'Cierre', defaults: SECTION_ABOUT_CLOSING },

  'management.hero': { ...PAGES.management, label: 'Hero', defaults: CONTENT_HERO_MANAGEMENT },
  'management.header': { ...PAGES.management, label: 'Presentación', defaults: SECTION_GESTION },
  'management.closing': { ...PAGES.management, label: 'Cierre', defaults: SECTION_MANAGEMENT_CLOSING },

  mailbox: { ...PAGES.mailbox, label: 'Textos del formulario', defaults: MAILBOX_CONTENT },
} as const;

export type CmsKey = keyof typeof CMS_SECTIONS;
export type CmsContent<K extends CmsKey> = (typeof CMS_SECTIONS)[K]['defaults'];

export const isCmsKey = (key: unknown): key is CmsKey =>
  typeof key === 'string' && Object.hasOwn(CMS_SECTIONS, key);

/** Sección tal como la recibe el panel: contenido vigente + defaults + si está sobrescrita. */
export interface CmsSectionState {
  key: CmsKey;
  page: string;
  /** Ruta pública de la página donde se ve la sección. */
  path: string;
  /** Id HTML del bloque dentro de esa página (ver anchors.ts). */
  anchor: string;
  label: string;
  value: unknown;
  defaults: unknown;
  overridden: boolean;
}
