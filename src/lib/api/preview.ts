import type { CmsKey } from '@/cms/sections';
import { request } from './http';

const path = (key: CmsKey) => `/api/preview/${encodeURIComponent(key)}`;

/** Publica el borrador solo para la vista previa del panel. */
export const pushPreview = (key: CmsKey, value: unknown) =>
  request<{ ok: true }>(path(key), { method: 'PUT', body: { value } });

export const clearPreview = (key: CmsKey) => request<{ ok: true }>(path(key), { method: 'DELETE' });
