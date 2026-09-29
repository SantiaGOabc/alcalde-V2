import type { CmsKey } from '@/cms/sections';
import { request } from './http';

const path = (key: CmsKey) => `/api/content/${encodeURIComponent(key)}`;

export const saveContent = (key: CmsKey, value: unknown) =>
  request<{ value: unknown }>(path(key), { method: 'PUT', body: { value } });

/** Borra la sobrescritura: la sección vuelve a mostrar los `constants`. */
export const resetContent = (key: CmsKey) => request<{ ok: true }>(path(key), { method: 'DELETE' });
