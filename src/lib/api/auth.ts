import { request } from './http';

export interface LoginPayload {
  /** Código secreto de la URL /admin/<code>. */
  code: string;
  username: string;
  password: string;
}

export const login = (payload: LoginPayload) =>
  request<{ username: string }>('/api/admin/login', { method: 'POST', body: payload });

export const logout = () => request<{ ok: true }>('/api/admin/logout', { method: 'POST' });
