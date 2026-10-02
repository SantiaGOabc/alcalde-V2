/**
 * Lectura y escritura del DOM del tablero, sin estado ni lógica de negocio.
 *
 * Dos reglas que este módulo hace posibles y que se verían en cualquier otro
 * sitio del archivo:
 *
 * 1. Toda consulta cuelga del tablero (`root`), nunca del documento. Por eso el
 *    payload (`data-mailbox-data`) tiene que estar DENTRO de `[data-mailbox-board]`:
 *    una búsqueda desde `document` lo encontraría fuera, pero una acotada a los
 *    descendientes, no. Ese detalle ya rompió el tablero una vez.
 * 2. Nada se busca dos veces: los nodos que no cambian se resuelven una vez aquí.
 */

import { MAILBOX_BOARD, type MailboxColumnId } from '@constant';

/** Controles de la barra de filtros. */
export interface FilterControls {
    search: HTMLInputElement | null;
    type: HTMLSelectElement | null;
    status: HTMLSelectElement | null;
}

/** Todo lo que el tablero necesita del HTML que Astro pintó. */
export interface BoardNodes {
    root: HTMLElement;
    /** El panel completo; lo muestra y lo esconde `CmsPanel` según la pestaña activa. */
    panel: HTMLElement | null;
    /** `true` si el tablero vive dentro de una pestaña del panel y debe seguirla. */
    tabbed: boolean;
    dialog: HTMLDialogElement;
    lists: Map<MailboxColumnId, HTMLElement>;
    counters: Map<MailboxColumnId, HTMLElement>;
    controls: FilterControls;
    /** Contador de la cabecera: "42 mensajes", o "3 de 42" con filtros. */
    summary: HTMLElement | null;
}

/** Busca un nodo sin asumir que está: si falta, se sigue y se nota antes de usarlo. */
export const find = <T extends Element = HTMLElement>(scope: ParentNode, selector: string) =>
    scope.querySelector<T>(selector);

/** Igual que `find`, pero devuelve una lista real para poder recorrerla y filtrarla. */
export const findAll = <T extends Element = HTMLElement>(scope: ParentNode, selector: string) =>
    Array.from(scope.querySelectorAll<T>(selector));

/** Convierte `data-column` en un id de columna, descartando lo que no lo sea. */
const asColumnId = (value: string | undefined): MailboxColumnId | null => {
    switch (value) {
        case 'unread':
        case 'reviewing':
        case 'read':
            return value;
        default:
            return null;
    }
};

/**
 * Reúne los nodos del tablero. Devuelve `null` si falta el modal o el payload:
 * sin ellos no hay nada que enlazar, y es mejor no registrar medio tablero que
 * fingir que funciona.
 */
export const pickBoard = (): BoardNodes | null => {
    const root = document.querySelector<HTMLElement>('[data-mailbox-board]');
    if (!root) return null;

    const dialog = find<HTMLDialogElement>(root, '[data-mailbox-dialog]');
    const payload = find<HTMLScriptElement>(root, '[data-mailbox-data]');
    if (!dialog || !payload) return null;

    const lists = new Map<MailboxColumnId, HTMLElement>();
    const counters = new Map<MailboxColumnId, HTMLElement>();
    findAll(root, '[data-mailbox-column]').forEach((column) => {
        const id = asColumnId(column.dataset.column);
        const list = find(column, '[data-mailbox-list]');
        const counter = find(column, '[data-mailbox-count]');
        if (!id || !list || !counter) return;
        lists.set(id, list);
        counters.set(id, counter);
    });

    return {
        root,
        // El panel completo. Solo se mira si el tablero es una pestaña: una pantalla
        // suelta (la previsualización) no tiene `CmsPanel` que la destape.
        panel: document.getElementById(MAILBOX_BOARD.panelId),
        tabbed: root.closest('[data-mailbox-tabbed]') !== null,
        dialog,
        lists,
        counters,
        controls: {
            search: find<HTMLInputElement>(root, '[data-mailbox-search]'),
            type: find<HTMLSelectElement>(root, '[data-mailbox-type]'),
            status: find<HTMLSelectElement>(root, '[data-mailbox-status]'),
        },
        summary: find(root, '[data-mailbox-summary]'),
    };
};

/** La tarjeta de un mensaje concreto, esté o no visible por los filtros. */
export const cardOf = (root: HTMLElement, id: number) =>
    find(root, `[data-mailbox-card][data-id="${id}"]`);

/** Solo las tarjetas que se ven: los contadores y el modal ignoran lo filtrado. */
export const cardsIn = (list: HTMLElement | undefined) =>
    list ? findAll(list, '[data-mailbox-card]:not([hidden])').length : 0;

/** Orden de lectura del modal: el de las tres columnas, saltando lo filtrado. */
export const visibleIds = (root: HTMLElement) =>
    findAll(root, '[data-mailbox-card]:not([hidden])').map((card) => Number(card.dataset.id));

/** Escribe texto en un nodo. `textContent`, nunca `innerHTML`: el mensaje del
 *  ciudadano es texto del visitante y no se interpreta como HTML. */
export const writeText = (scope: ParentNode, selector: string, value: string) => {
    const node = find(scope, selector);
    if (node) node.textContent = value;
};

/**
 * Deja la tarjeta donde le toca por fecha. El buzón se lee de más nuevo a más
 * viejo, así que hay que insertarla delante de la primera más antigua y no al
 * final de la columna; si se colgara del final, el orden se rompería al arrastrar.
 */
export const insertByDate = (list: HTMLElement, card: HTMLElement, timeOf: (card: HTMLElement) => number) => {
    const older = findAll(list, '[data-mailbox-card]').find((other) => timeOf(other) < timeOf(card));
    list.insertBefore(card, older ?? null);
};

/** Marca una columna como destino válido del arrastre en curso. */
export const setDropzone = (root: HTMLElement, column: HTMLElement | null) => {
    findAll(root, '[data-mailbox-dropzone]').forEach((node) => node.removeAttribute('data-mailbox-dropzone'));
    column?.setAttribute('data-mailbox-dropzone', 'true');
};