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
  SITE_BRAND,
} from '@constant';

/** Página pública donde se ve cada sección: es lo que muestra la vista previa. */
const PAGES = {
  home: { page: 'Inicio', path: '/' },
  about: { page: 'Sobre mí', path: '/about' },
  management: { page: 'Gestión', path: '/management' },
  mailbox: { page: 'Buzón ciudadano', path: '/mailbox' },
  // El navbar está en todas las páginas, pero la vista previa necesita una sola
  // ruta: se enseña en la home, donde además se ve tal cual la ve el visitante.
  site: { page: 'Sitio (todas las páginas)', path: '/' },
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

  // Va al final a propósito: el panel abre la primera sección del registro, y
  // añadirla al principio cambiaría la sección con la que arranca el administrador.
  'site.brand': { ...PAGES.site, label: 'Logotipo', defaults: SITE_BRAND },
} as const;

export type CmsKey = keyof typeof CMS_SECTIONS;
export type CmsContent<K extends CmsKey> = (typeof CMS_SECTIONS)[K]['defaults'];

/**
 * Claves cuyo valor es una IMAGEN y por lo tanto el panel les pone subida de
 * archivo y miniatura en vez de un campo de texto.
 *
 * Va aparte del registro a propósito: esto no dice qué contiene la sección, sino
 * cómo se edita. Mezclarlo en `CMS_SECTIONS` obligaría a repetir una lista vacía
 * en las catorce secciones que no tienen imágenes, y a inventar un tipo de campo
 * dentro de los `constants`, que según la regla de oro guardan valores, no
 * formularios.
 *
 * Se nombran por su clave, no por lo que parece su valor: un campo se declara
 * aquí y el editor recursivo lo reconoce a cualquier profundidad. Añadir un campo
 * de imagen es escribir su nombre en esta línea.
 */
export const CMS_IMAGE_FIELDS: Partial<Record<CmsKey, readonly string[]>> = {
  'site.brand': ['logo'],
};

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
  /** Claves de esta sección que son imágenes (ver `CMS_IMAGE_FIELDS`). */
  imageFields: readonly string[];
}
