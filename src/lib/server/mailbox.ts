import { MAILBOX_MESSAGE_TYPES } from '@constant';
import type { MailboxMessage, MailboxPage, MailboxPayload, MailboxStatus } from '@/lib';
import { query } from './db';
import { containsPattern } from './pagination';

const MAX = { fullName: 120, email: 254, message: 2000 } as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valida y normaliza lo que llega del formulario público. `null` = inválido. */
export function parseMailboxPayload(input: unknown): MailboxPayload | null {
  if (typeof input !== 'object' || input === null) return null;
  const { fullName, email, type, message } = input as Record<string, unknown>;

  if (typeof fullName !== 'string' || typeof email !== 'string') return null;
  if (typeof type !== 'string' || typeof message !== 'string') return null;

  const payload = {
    fullName: fullName.trim(),
    email: email.trim(),
    type,
    message: message.trim(),
  };

  const validType = MAILBOX_MESSAGE_TYPES.some((option) => option.value === payload.type);
  const validLengths =
    payload.fullName.length > 0 && payload.fullName.length <= MAX.fullName &&
    payload.message.length > 0 && payload.message.length <= MAX.message &&
    payload.email.length <= MAX.email;

  return validType && validLengths && EMAIL_PATTERN.test(payload.email) ? payload : null;
}

export async function saveMailboxMessage({ fullName, email, type, message }: MailboxPayload): Promise<void> {
  await query('INSERT INTO mailbox_messages (full_name, email, type, message) VALUES ($1, $2, $3, $4)', [
    fullName,
    email,
    type,
    message,
  ]);
}

interface MessageRow {
  id: string;
  full_name: string;
  email: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: Date;
}

const rowToMessage = (row: MessageRow): MailboxMessage => ({
  id: Number(row.id),
  fullName: row.full_name,
  email: row.email,
  type: row.type,
  message: row.message,
  isRead: row.is_read,
  createdAt: row.created_at.toISOString(),
});

export interface MailboxSearch {
  page: number;
  pageSize: number;
  type: string | null;
  status: MailboxStatus;
  search: string | null;
}

/** Mensajes sin leer en total (para la insignia de la pestaña), sin importar los filtros. */
export async function countUnreadMessages(): Promise<number> {
  const { rows } = await query<{ total: string }>('SELECT count(*) AS total FROM mailbox_messages WHERE NOT is_read');
  return Number(rows[0].total);
}

/**
 * Búsqueda paginada del buzón. Todo el filtrado ocurre en SQL, así que la
 * bandeja puede tener miles de mensajes sin que el panel cargue más de una página.
 */
export async function searchMailboxMessages({ page, pageSize, type, status, search }: MailboxSearch): Promise<MailboxPage> {
  const filters = `WHERE ($1::text IS NULL OR type = $1)
    AND ($2::boolean IS NULL OR is_read = $2)
    AND ($3::text IS NULL OR full_name ILIKE $3 OR email ILIKE $3 OR message ILIKE $3)`;
  const params = [type, status === 'all' ? null : status === 'read', search ? containsPattern(search) : null];

  const [count, rows, unread] = await Promise.all([
    query<{ total: string }>(`SELECT count(*) AS total FROM mailbox_messages ${filters}`, params),
    query<MessageRow>(
      `SELECT * FROM mailbox_messages ${filters} ORDER BY created_at DESC, id DESC LIMIT $4 OFFSET $5`,
      [...params, pageSize, (page - 1) * pageSize],
    ),
    countUnreadMessages(),
  ]);

  return { items: rows.rows.map(rowToMessage), total: Number(count.rows[0].total), page, pageSize, unread };
}

export async function setMailboxMessageRead(id: number, isRead: boolean): Promise<void> {
  await query('UPDATE mailbox_messages SET is_read = $2 WHERE id = $1', [id, isRead]);
}
