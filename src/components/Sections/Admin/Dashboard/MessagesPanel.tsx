import { useEffect, useState } from 'react';
import { MAILBOX_MESSAGE_TYPES } from '@constant';
import { FIELD_CLASS } from '@/components/ui/fieldStyles';
import Pagination from '@/components/ui/Pagination';
import { useDebouncedValue, usePagedList } from '@/hooks';
import { ApiError, listMailboxMessages, markMailboxMessageRead, type MailboxMessage, type MailboxStatus } from '@/lib';
import { showToast } from '@utils';

interface MessagesPanelProps {
  /** Avisa el total de mensajes sin leer (lo muestra la insignia de la pestaña). */
  onUnreadChange: (unread: number) => void;
}

const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: MailboxStatus; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'unread', label: 'Sin leer' },
  { value: 'read', label: 'Leídos' },
];

const typeLabel = (value: string) => MAILBOX_MESSAGE_TYPES.find((type) => type.value === value)?.label ?? value;
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('es-BO', { dateStyle: 'medium', timeStyle: 'short' });

export default function MessagesPanel({ onUnreadChange }: MessagesPanelProps) {
  const [type, setType] = useState('');
  const [status, setStatus] = useState<MailboxStatus>('all');
  const [search, setSearch] = useState('');

  const q = useDebouncedValue(search.trim());
  const list = usePagedList((query) => listMailboxMessages({ ...query, pageSize: PAGE_SIZE }), { type, status, q });

  // El total de sin leer viene con cada página del servidor.
  const unread = list.extra?.unread;
  useEffect(() => {
    if (unread !== undefined) onUnreadChange(unread);
  }, [unread, onUnreadChange]);

  const toggleRead = async (message: MailboxMessage) => {
    const isRead = !message.isRead;
    try {
      await markMailboxMessageRead(message.id, isRead);
      list.patchItem((item) => item.id === message.id, { isRead });
      onUnreadChange((unread ?? 0) + (isRead ? -1 : 1));
    } catch (error) {
      showToast({ variant: 'error', message: error instanceof ApiError ? error.message : 'No se pudo actualizar el mensaje.' });
    }
  };

  return (
    <section className="flex flex-col gap-5" aria-label="Buzón ciudadano">
      <header className="flex flex-wrap items-end gap-3">
        <div className="mr-auto">
          <h2 className="text-2xl font-extrabold text-slate-900">Buzón ciudadano</h2>
          <p className="text-sm text-slate-500">{list.total} mensajes con este filtro</p>
        </div>
        <input type="search" aria-label="Buscar en el buzón" placeholder="Buscar por nombre, correo o texto" value={search} onChange={(e) => setSearch(e.target.value)} className={`${FIELD_CLASS} w-full sm:w-72`} />
        <select aria-label="Tipo de mensaje" value={type} onChange={(e) => setType(e.target.value)} className={`${FIELD_CLASS} w-auto`}>
          <option value="">Todos los tipos</option>
          {MAILBOX_MESSAGE_TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select aria-label="Estado" value={status} onChange={(e) => setStatus(e.target.value as MailboxStatus)} className={`${FIELD_CLASS} w-auto`}>
          {STATUS_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
      </header>

      {list.error && <p role="alert" className="text-sm font-semibold text-red-700">{list.error}</p>}

      <div className={`flex flex-col gap-3 transition-opacity ${list.isLoading ? 'opacity-50' : ''}`}>
        {list.items.map((message) => (
          <article
            key={message.id}
            className={`rounded-brand border p-4 ${message.isRead ? 'border-slate-200 bg-white' : 'border-(--brand-primary)/40 bg-(--brand-primary)/5'}`}
          >
            <header className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">{typeLabel(message.type)}</span>
                <span className="text-sm font-bold text-slate-900">{message.fullName}</span>
                <a href={`mailto:${message.email}`} className="text-xs text-(--brand-primary) hover:underline">{message.email}</a>
              </div>
              <time dateTime={message.createdAt} className="text-xs text-slate-400">{formatDate(message.createdAt)}</time>
            </header>
            <p className="mt-3 text-sm leading-6 whitespace-pre-line text-slate-700">{message.message}</p>
            <button type="button" onClick={() => toggleRead(message)} className="mt-3 text-xs font-semibold text-slate-500 hover:text-(--brand-primary)">
              {message.isRead ? 'Marcar como no leído' : 'Marcar como leído'}
            </button>
          </article>
        ))}
      </div>

      {!list.isLoading && list.items.length === 0 && !list.error && (
        <p className="py-12 text-center text-sm text-slate-500">No hay mensajes con ese filtro.</p>
      )}

      <Pagination page={list.page} pageSize={list.pageSize} total={list.total} isLoading={list.isLoading} onPageChange={list.setPage} />
    </section>
  );
}
