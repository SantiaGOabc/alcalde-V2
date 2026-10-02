/**
 * Tablero del buzón ciudadano (panel de administración).
 *
 * Hay una columna por estado de trabajo del mensaje. Solo `unread` y `read`
 * existen en el servidor (columna `is_read`); `reviewing` es estado de flujo
 * —el mensaje está siendo atendido— y por eso se mantiene en el cliente.
 * Cuando se quiera persistir, el cambio es una columna `status` en
 * `mailbox_messages` y nada más en esta capa.
 */
export type MailboxColumnId = 'unread' | 'reviewing' | 'read';

export interface MailboxColumn {
    id: MailboxColumnId;
    label: string;
    /** Texto secundario de la cabecera. */
    hint: string;
    /**
     * Tinte de la columna. Se deriva de `--brand-primary` con `color-mix`
     * para no introducir colores nuevos: cambiar la marca en `global.css`
     * repinta el tablero entero.
     */
    tint: string;
}

export const MAILBOX_COLUMNS: readonly MailboxColumn[] = [
    {
        id: 'unread',
        label: 'No leídos',
        hint: 'Entran aquí',
        tint: 'var(--brand-primary)',
    },
    {
        id: 'reviewing',
        label: 'En revisión',
        hint: 'En trabajo',
        tint: 'color-mix(in srgb, var(--brand-primary) 70%, white)',
    },
    {
        id: 'read',
        label: 'Leídos',
        hint: 'Atendidos',
        tint: 'color-mix(in srgb, var(--brand-primary) 40%, white)',
    },
];

/** Rótulos de los controles. El contenido editable del buzón vive en el CMS; esto es la interfaz. */
export const MAILBOX_ACTIONS = {
    view: 'Ver',
    remove: 'Eliminar',
    approve: 'Aprobar',
    reject: 'Rechazar',
    close: 'Cerrar',
    previous: 'Anterior',
    next: 'Siguiente',
} as const;

/** Estado que filtra el tablero. Son los mismos valores que acepta la API (`MailboxStatus`). */
export type MailboxFilterStatus = 'all' | 'unread' | 'read';

export const MAILBOX_STATUS_FILTERS: readonly { value: MailboxFilterStatus; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'unread', label: 'Sin leer' },
    { value: 'read', label: 'Leídos' },
];

/**
 * Todo el texto de la herramienta del tablero, en un solo sitio.
 *
 * El contenido que edita el CMS es `MAILBOX_CONTENT`; esto es el chrome de la
 * herramienta, que no se edita. Cada cadena que el tablero pinta —título,
 * rótulos, avisos, avisos de error y toasts— sale de aquí, así que revisar la
 * interfaz o traducirla es leer un objeto y no recorrer cuatro archivos.
 */
export const MAILBOX_BOARD = {
    title: 'Buzón ciudadano',
    /** Id de la pestaña en `CmsPanel`. Es lo que viaja en `MAILBOX_EVENTS.tab`. */
    tab: 'messages',
    /** `id` del panel que el tablero monta y `CmsPanel` muestra y esconde. */
    panelId: 'panel-messages',
    /** Aviso de una columna sin tarjetas visibles. */
    empty: 'Sin mensajes aquí.',
    /** Contador del resumen: "42 mensajes" o "3 de 42 mensajes" con filtros. */
    messages: 'mensajes',
    /** Separador del resumen cuando hay filtros activos. */
    showing: 'de',
    /**
     * El tablero pide una sola página de la bandeja, así que cuando hay más mensajes de
     * los que caben en ella, el total se enseña con este aviso en vez de fingir que
     * se está viendo todo.
     */
    capped: 'mostrando los más recientes',
    filters: {
        searchLabel: 'Buscar en el buzón',
        search: 'Buscar por nombre, correo o texto',
        /** Sin tipo = cualquier tipo de mensaje (`value` de `MAILBOX_MESSAGE_TYPES`). */
        typeLabel: 'Tipo de mensaje',
        everyType: 'Todos los tipos',
        statusLabel: 'Estado del mensaje',
    },
    /** Fallos de red. El error concreto lo pone el navegador. */
    errors: {
        move: 'No se pudo actualizar el estado del mensaje.',
        remove: 'No se pudo eliminar el mensaje.',
    },
    /** Confirmación antes de borrar: no hay dónde deshacerlo. */
    removeConfirm: '¿Eliminar este mensaje del buzón? Esta acción no se puede deshacer.',
    toasts: {
        approved: 'Mensaje aprobado',
        approvedDetail: 'Se movió a la columna Leídos.',
        rejected: 'Mensaje rechazado y retirado del tablero.',
        removed: 'Mensaje eliminado.',
    },
} as const;

/**
 * Un mensaje `read` es el final del flujo: ya no se mueve ni se vuelve a abrir.
 * El tablero marca esas tarjetas con `data-locked` y el `<script>` se niega a
 * arrastrarlas, para que el bloqueo se vea y no solo se intente.
 */
export const isMailboxLocked = (state: MailboxColumnId) => state === 'read';

/** Eventos que el tablero comparte con el panel (ver `CmsPanel.tsx`). */
export const MAILBOX_EVENTS = {
    /** `{ tab }`: el panel dice en qué pestaña está para mostrar u ocultar el tablero. */
    tab: 'mailbox:tab',
    /** `{ unread }`: el tablero avisa el total de no leídos para la insignia de la pestaña. */
    unread: 'mailbox:unread',
} as const;
