import { request } from './http';
import { toQueryString, type PageQuery, type Paginated } from './pagination';

export interface MailboxPayload {
  fullName: string;
  email: string;
  type: string;
  message: string;
}

export interface MailboxMessage extends MailboxPayload {
  id: number;
  isRead: boolean;
  createdAt: string;
}

/** Público: lo usa el formulario del buzón ciudadano. */
export const sendMailboxMessage = (payload: MailboxPayload) =>
  request<{ ok: true }>('/api/mailbox', { method: 'POST', body: payload });

export type MailboxStatus = 'all' | 'unread' | 'read';

export interface MailboxQuery extends PageQuery {
  /** Valor de tipo de mensaje (`sugerencia`, `felicitacion`…); vacío = todos. */
  type?: string;
  status?: MailboxStatus;
  q?: string;
}

/** Una página del buzón + el total de mensajes sin leer (sin importar los filtros). */
export interface MailboxPage extends Paginated<MailboxMessage> {
  unread: number;
}

/** Solo administradores. */
export const listMailboxMessages = (query: MailboxQuery = {}) =>
  request<MailboxPage>(`/api/mailbox${toQueryString({ ...query })}`);

export const markMailboxMessageRead = (id: number, isRead: boolean) =>
  request<{ ok: true }>(`/api/mailbox/${id}`, { method: 'PATCH', body: { isRead } });
