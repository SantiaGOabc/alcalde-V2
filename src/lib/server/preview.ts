import { AsyncLocalStorage } from 'node:async_hooks';
import type { CmsKey } from '@/cms/sections';

/**
 * Vista previa en vivo del panel: la página REAL se renderiza en un iframe con
 * `?cms-preview`, y `getContent` sustituye lo guardado por el borrador que el
 * administrador está escribiendo, sin publicar nada.
 *
 * Los borradores viven en memoria (por administrador), así que un reinicio los
 * descarta y, con varias instancias del servidor, cada una tendría los suyos.
 */
type Drafts = Map<CmsKey, unknown>;

const draftsByUser = new Map<number, Drafts>();
const requestDrafts = new AsyncLocalStorage<Drafts>();

export const setPreviewDraft = (userId: number, key: CmsKey, value: unknown): void => {
  const drafts = draftsByUser.get(userId) ?? new Map();
  drafts.set(key, value);
  draftsByUser.set(userId, drafts);
};

export const clearPreviewDraft = (userId: number, key: CmsKey): void => {
  draftsByUser.get(userId)?.delete(key);
};

/** Ejecuta `callback` (el render de una página) viendo los borradores de ese administrador. */
export const runWithPreview = <T>(userId: number, callback: () => T): T =>
  requestDrafts.run(draftsByUser.get(userId) ?? new Map(), callback);

/** Borrador de `key` para la petición en curso, si es una vista previa. */
export const getPreviewDraft = (key: CmsKey): unknown => requestDrafts.getStore()?.get(key);
