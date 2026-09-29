import type { ImagenObra } from '@constant';
import { request } from './http';
import { toQueryString, type PageQuery, type Paginated } from './pagination';

export type WorkImage = ImagenObra;

/** Lo que el administrador edita de una obra. */
export interface WorkInput {
  categoria: string;
  titulo: string;
  descripcion: string;
  estado?: string;
  area?: string;
  portada: WorkImage;
  imagenes: WorkImage[];
  /** Solo las publicadas aparecen en la página de Gestión. */
  publicada: boolean;
}

export interface Work extends WorkInput {
  id: number;
}

const path = (id: number) => `/api/works/${id}`;

export interface WorkQuery extends PageQuery {
  category?: string;
  q?: string;
}

/** Una página de obras (publicadas y borradores) con los filtros indicados. */
export const listWorks = (query: WorkQuery = {}) =>
  request<Paginated<Work>>(`/api/works${toQueryString({ ...query })}`);

export const createWork = (input: WorkInput) => request<{ work: Work }>('/api/works', { method: 'POST', body: input });

export const updateWork = (id: number, input: WorkInput) =>
  request<{ work: Work }>(path(id), { method: 'PUT', body: input });

export const setWorkPublished = (id: number, publicada: boolean) =>
  request<{ ok: true }>(path(id), { method: 'PATCH', body: { publicada } });

export const deleteWork = (id: number) => request<{ ok: true }>(path(id), { method: 'DELETE' });

/** Sube una imagen y devuelve la URL pública (`/media/<id>`) para usarla en una obra. */
export const uploadImage = (file: File) => {
  const body = new FormData();
  body.append('file', file);
  return request<{ url: string }>('/api/media', { method: 'POST', body });
};
