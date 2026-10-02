/**
 * Datos del tablero del buzón: qué se enseña y con qué texto.
 *
 * Todo lo que hay aquí son funciones puras sobre los mensajes del servidor. No
 * tocan el DOM ni conocen la API, así que el HTML de Astro y el `<script>` del
 * tablero pueden derivar exactamente lo mismo y nunca enseñar dos versiones
 * distintas del mismo mensaje (un asunto en la tarjeta y otro en el modal era
 * justo el tipo de deriva que hace imposible depurar esta pantalla).
 */

import {
    MAILBOX_BOARD,
    MAILBOX_COLUMNS,
    MAILBOX_MESSAGE_TYPES,
    type MailboxColumnId,
} from '@constant';
import type { MailboxMessage } from '@/lib';
import { formatDateTime, formatDay, truncate } from '@utils';

/** Fin de frase. Cubre más casos que el `SENTENCE_END` de `truncate`, que solo corta en `.`. */
const SENTENCE_END = /(?<=[.!?…])\s+/;
/** Cuántos caracteres caben en el asunto de la tarjeta y en la cabecera del modal. */
const SUBJECT_MAX = 90;
/** Cuántos del resto del mensaje se dejan ver bajo el asunto. */
const PREVIEW_MAX = 140;

/**
 * Un mensaje ya derivado para pintarlo. La tarjeta y el modal parten de aquí, así
 * que el asunto, el rótulo de tipo y las fechas se calculan una sola vez.
 */
export interface MailboxEntry {
    /** El mensaje tal cual, para los datos que la tarjeta necesita en crudo. */
    message: MailboxMessage;
    /** Primera frase del mensaje: el asunto de la tarjeta y la cabecera del modal. */
    subject: string;
    /** El resto del mensaje, ya sin la primera frase, para que la tarjeta no lo repita. */
    preview: string;
    /** Rótulo legible del tipo; `message.type` guarda el valor crudo que envía el formulario. */
    typeLabel: string;
    /** Fecha y hora ya formateadas: las muestra el modal. */
    date: string;
    /** Solo el día: lo que cabe en la esquina de la tarjeta. */
    day: string;
}

/**
 * El mismo mensaje, visto como registro del payload que consume el `<script>`.
 * Va plano y en camelCase porque cruza la frontera HTML → navegador.
 */
export interface MailboxRecord {
    id: number;
    sender: string;
    email: string;
    /** Valor crudo del tipo (el `value` de `MAILBOX_MESSAGE_TYPES`); el filtro compara contra él. */
    type: string;
    typeLabel: string;
    /** Fecha y hora ya formateadas. */
    date: string;
    /** ISO-8601: es lo que permite reordenar una tarjeta al moverla de columna. */
    createdAt: string;
    subject: string;
    body: string;
    isRead: boolean;
}

/** Rótulo legible de un tipo de mensaje. Un tipo desconocido se enseña tal cual. */
export const mailboxTypeLabel = (type: string) =>
    MAILBOX_MESSAGE_TYPES.find((option) => option.value === type)?.label ?? type;

/** El buzón se lee de más nuevo a más viejo, y la primera frase hace de asunto. */
const firstSentence = (message: string) => message.split(SENTENCE_END)[0] ?? message;

/** Deriva la vista previa de cada mensaje. */
export const buildMailboxEntries = (messages: readonly MailboxMessage[]): MailboxEntry[] =>
    messages.map((message) => {
        const sentence = firstSentence(message.message);
        return {
            message,
            subject: truncate(sentence, SUBJECT_MAX),
            preview: truncate(message.message.slice(sentence.length).trim(), PREVIEW_MAX),
            typeLabel: mailboxTypeLabel(message.type),
            date: formatDateTime(message.createdAt),
            day: formatDay(message.createdAt),
        };
    });

/**
 * Un solo listado repartido en tres columnas: `is_read` decide entre "No leídos"
 * y "Leídos". "En revisión" arranca vacía y se llena desde el cliente, porque es
 * estado de trabajo, no estado guardado (ver `bindMailboxBoard.ts`).
 */
export const splitMailboxColumns = (
    entries: readonly MailboxEntry[],
): Record<MailboxColumnId, MailboxEntry[]> => ({
    unread: entries.filter((entry) => !entry.message.isRead),
    reviewing: [],
    read: entries.filter((entry) => entry.message.isRead),
});

/** Aplana las entradas al registro que el modal y los filtros necesitan. */
export const toMailboxRecords = (entries: readonly MailboxEntry[]): MailboxRecord[] =>
    entries.map(({ message, subject, typeLabel, date }) => ({
        id: message.id,
        sender: message.fullName,
        email: message.email,
        type: message.type,
        typeLabel,
        date,
        subject,
        body: message.message,
        isRead: message.isRead,
        createdAt: message.createdAt,
    }));

/**
 * Los datos que el modal necesita, en un `<script type="application/json">` para
 * que el DOM inicial solo lleve la vista previa truncada.
 */
export const buildMailboxPayload = (entries: readonly MailboxEntry[]) =>
    JSON.stringify(toMailboxRecords(entries))
        // Evita que un "</script>" dentro de un mensaje cierre el propio script.
        .replace(/</g, '\\u003c');

/** Da la vuelta al payload. Un texto corrupto deja el tablero vacío, pero no lo rompe. */
export const parseMailboxPayload = (text: string | null): MailboxRecord[] => {
    try {
        const parsed: unknown = JSON.parse(text ?? '[]');
        return Array.isArray(parsed) ? (parsed as MailboxRecord[]) : [];
    } catch {
        return [];
    }
};

/** Resumen de la barra de filtros: "42 mensajes", o "3 de 42" con filtros puestos.
 *
 *  `capped` avisa que el tablero solo trae una página de la bandeja, así que no se
 *  está viendo todo aunque los filtros estén en "Todos". Se decide al cargar, no
 *  al filtrar, porque no depende de los controles. */
export const mailboxSummary = ({
    visible,
    total,
    capped,
    filtered,
}: {
    visible: number;
    total: number;
    capped: boolean;
    filtered: boolean;
}) => {
    const count = filtered ? `${visible} ${MAILBOX_BOARD.showing} ${total}` : `${total}`;
    const notice = capped ? ` · ${MAILBOX_BOARD.capped}` : '';
    return `${count} ${MAILBOX_BOARD.messages}${notice}`;
};

/** Orden de recorrido del flujo. Se deriva de las columnas para que no puedan separarse. */
export const MAILBOX_COLUMN_ORDER: readonly MailboxColumnId[] = MAILBOX_COLUMNS.map((column) => column.id);