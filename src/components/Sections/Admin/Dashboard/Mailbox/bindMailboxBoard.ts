/**
 * El tablero en el navegador.
 *
 * Une el marcado que Astro pintó en el servidor y le añade el flujo de trabajo:
 * filtrar, mover tarjetas y recorrer los mensajes en el modal. Sin framework: el
 * tablero es HTML normal y esto solo mueve nodos y llama a la API.
 *
 * El archivo se divide en tres, cada uno con una sola responsabilidad:
 *
 * - `mailboxBoardModel.ts` — qué se enseña y con qué texto. Puro, sin DOM.
 * - `mailboxBoardDom.ts`     — dónde está cada nodo. Sin estado ni reglas.
 * - este archivo             — qué pasa cuando el visitante hace algo.
 *
 * Todo lo que hay dentro son funciones porque no hay estado que encapsular: el
 * estado son las variables del cierre, y una clase solo añadiría `this` delante
 * de cada una.
 */

import { MAILBOX_BOARD, MAILBOX_EVENTS, isMailboxLocked, type MailboxColumnId } from '@constant';
import { deleteMailboxMessage, markMailboxMessageRead } from '@/lib';
import { onPageLoad, showToast } from '@utils';
import {
    MAILBOX_COLUMN_ORDER,
    mailboxSummary,
    parseMailboxPayload,
    type MailboxRecord,
} from './mailboxBoardModel';
import {
    cardOf,
    cardsIn,
    find,
    insertByDate,
    pickBoard,
    setDropzone,
    visibleIds,
    writeText,
} from './mailboxBoardDom';

/** Espera antes de filtrar, para no recorrer todas las tarjetas en cada tecla. */
const SEARCH_DEBOUNCE_MS = 200;

/**
 * Devuelve una función de limpieza, como todos los que se registran con `onPageLoad`.
 * Todo lo que se enlaza cuelga de `root` con un `AbortController` común, así que
 * salir es un solo `abort()`.
 */
export const bindMailboxBoard = () => {
    const board = pickBoard();
    if (!board) return;
    const { root, panel, tabbed, dialog, lists, counters, controls, summary } = board;

    const controller = new AbortController();
    const { signal } = controller;

    const records = new Map<number, MailboxRecord>();
    parseMailboxPayload(find<HTMLScriptElement>(root, '[data-mailbox-data]')?.textContent ?? null).forEach(
        (record) => records.set(record.id, record),
    );

    // El servidor pidió la bandeja sin filtros, así que estos dos son los totales
    // reales del buzón: el tablero solo trae una página.
    const serverUnread = Number(root.dataset.mailboxUnread ?? '0');
    const serverTotal = Number(root.dataset.mailboxTotal ?? '0');
    /** Cuando la bandeja tiene más mensajes de los que trae la página, lo decimos. */
    const capped = records.size < serverTotal;

    const columnOf = (id: number) => cardOf(root, id)?.dataset.state as MailboxColumnId | undefined;
    const timeOf = (card: HTMLElement) => Date.parse(records.get(Number(card.dataset.id))?.createdAt ?? '') || 0;

    // ------------------------------------------------------------- contadores

    /**
     * Los no leídos se cuentan desde los datos y no desde el DOM: así la insignia
     * no depende de qué columnas estén a la vista ni de los filtros. El servidor
     * cuenta toda la bandeja; aquí solo se corrige la diferencia de la página cargada.
     */
    const countUnread = () => {
        let unread = 0;
        records.forEach((record) => {
            if (!record.isRead) unread += 1;
        });
        return unread;
    };
    const unreadAtStart = countUnread();

    const publishUnread = () => {
        const unread = Math.max(0, serverUnread + countUnread() - unreadAtStart);
        document.dispatchEvent(new CustomEvent(MAILBOX_EVENTS.unread, { detail: { unread } }));
    };

    /** Con algún control tocado, el resumen pasa a decir "3 de 42 mensajes". */
    const hasFilters = () =>
        Boolean(controls.type?.value) ||
        controls.status?.value !== 'all' ||
        Boolean(controls.search?.value.trim());

    const refreshCounts = () => {
        for (const [id, counter] of counters) counter.textContent = String(cardsIn(lists.get(id)));
        for (const list of lists.values()) {
            find(list, '[data-mailbox-empty]')?.toggleAttribute('hidden', cardsIn(list) > 0);
        }
        if (summary) {
            const visible = Array.from(lists.keys()).reduce((sum, id) => sum + cardsIn(lists.get(id)), 0);
            summary.textContent = mailboxSummary({
                visible,
                total: serverTotal,
                capped,
                filtered: hasFilters(),
            });
        }
    };

    // ---------------------------------------------------------------- filtros

    /**
     * Filtrar es ocultar tarjetas, no repintarlas: la búsqueda, el tipo y el estado se
     * resuelven en el cliente sobre los datos que ya trae el payload. Así el tablero
     * no pierde la pestaña activa ni el estado de las columnas al filtrar.
     */
    const applyFilters = () => {
        const type = controls.type?.value ?? '';
        const status = controls.status?.value ?? 'all';
        const needle = controls.search?.value.trim().toLowerCase() ?? '';

        root.querySelectorAll<HTMLElement>('[data-mailbox-card]').forEach((card) => {
            const record = records.get(Number(card.dataset.id));
            const matchesType = !type || card.dataset.type === type;
            // "En revisión" sigue siendo un mensaje sin leer: solo `read` marca leído.
            const matchesStatus = status === 'all' || (card.dataset.state === 'read') === (status === 'read');
            const haystack = record ? `${record.sender} ${record.email} ${record.body}`.toLowerCase() : '';
            const matchesSearch = !needle || haystack.includes(needle);

            card.hidden = !(matchesType && matchesStatus && matchesSearch);
        });

        refreshCounts();
    };

    let searchTimer: ReturnType<typeof setTimeout> | undefined;

    controls.search?.addEventListener(
        'input',
        () => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(applyFilters, SEARCH_DEBOUNCE_MS);
        },
        { signal },
    );
    controls.type?.addEventListener('change', applyFilters, { signal });
    controls.status?.addEventListener('change', applyFilters, { signal });

    // ------------------------------------------------------------- movimiento

    /** Pone la tarjeta en la columna `to`, en su lugar por fecha, y repinta su estado. */
    const relocate = (id: number, to: MailboxColumnId) => {
        const card = cardOf(root, id);
        const list = lists.get(to);
        if (card && list) {
            insertByDate(list, card, timeOf);
            card.dataset.state = to;

            // El bloqueo sigue a la columna: lo leído ya no se arrastra ni se mueve.
            const locked = isMailboxLocked(to);
            card.dataset.locked = locked ? 'true' : 'false';
            card.draggable = !locked;
            // El doble check y la franja lateral leen su propio `data-state`.
            find(card, '[data-mailbox-checks]')?.setAttribute('data-state', to);
        }
        refreshCounts();
    };

    const moveCard = (id: number, to: MailboxColumnId) => {
        const record = records.get(id);
        const from = columnOf(id);
        if (!record || !from || from === to) return;
        // Un mensaje ya leído está bloqueado en "Leídos": es el final del flujo. El
        // arrastre ya no deja ni empezar en esas tarjetas; esto es la red de seguridad.
        if (record.isRead && to !== 'read') return;

        relocate(id, to);
        // Un filtro de estado puede acabar de ocultar la tarjeta que se acaba de mover.
        applyFilters();

        const isRead = to === 'read';
        if (isRead === record.isRead) return;

        record.isRead = isRead;
        markMailboxMessageRead(record.id, isRead)
            .then(publishUnread)
            .catch(() => {
                record.isRead = !isRead;
                relocate(id, from);
                applyFilters();
                showToast({ variant: 'error', message: MAILBOX_BOARD.errors.move });
            });
    };

    const discard = (id: number) => {
        cardOf(root, id)?.remove();
        records.delete(id);
        // Con un filtro activo, quitar una tarjeta puede vaciar su columna o cambiar el total.
        applyFilters();
        publishUnread();
    };

    // ------------------------------------------------------------------ modal

    let currentId: number | null = null;

    const renderDialog = () => {
        if (currentId === null) return;
        const record = records.get(currentId);
        if (!record) {
            closeDialog();
            return;
        }

        writeText(dialog, '[data-mailbox-badge]', record.typeLabel);
        writeText(dialog, '[data-mailbox-title]', record.subject);
        writeText(dialog, '[data-mailbox-sender]', record.sender);
        writeText(dialog, '[data-mailbox-date]', record.date);
        writeText(dialog, '[data-mailbox-body]', record.body);

        const email = find<HTMLAnchorElement>(dialog, '[data-mailbox-email]');
        if (email) {
            email.textContent = record.email;
            email.href = `mailto:${record.email}`;
        }

        const order = visibleIds(root);
        const position = order.indexOf(record.id);
        writeText(dialog, '[data-mailbox-counter]', `${position + 1} de ${order.length}`);

        const prev = find<HTMLButtonElement>(dialog, '[data-mailbox-prev]');
        const next = find<HTMLButtonElement>(dialog, '[data-mailbox-next]');
        if (prev) prev.disabled = position <= 0;
        if (next) next.disabled = position >= order.length - 1;
    };

    function closeDialog() {
        currentId = null;
        if (dialog.open) dialog.close();
    }

    /** Abrir un mensaje es empezar a atenderlo: pasa a "En revisión". */
    const openDialog = (id: number) => {
        currentId = id;
        renderDialog();
        if (!dialog.open) dialog.showModal();
        if (columnOf(id) === 'unread') moveCard(id, 'reviewing');
    };

    const step = (delta: number) => {
        const order = visibleIds(root);
        const next = order[order.indexOf(currentId ?? -1) + delta];
        if (next === undefined) return;
        currentId = next;
        renderDialog();
        if (columnOf(next) === 'unread') moveCard(next, 'reviewing');
    };

    const approve = () => {
        if (currentId === null) return;
        moveCard(currentId, 'read');
        closeDialog();
        showToast({
            variant: 'success',
            title: MAILBOX_BOARD.toasts.approved,
            message: MAILBOX_BOARD.toasts.approvedDetail,
        });
    };

    const reject = () => {
        if (currentId === null) return;
        discard(currentId);
        closeDialog();
        showToast({ variant: 'info', message: MAILBOX_BOARD.toasts.rejected });
    };

    const remove = async (id: number) => {
        // `window.confirm` y no el `ConfirmProvider` de React: este tablero es HTML
        // de Astro, está fuera de la isla, así que no alcanza el contexto.
        if (!window.confirm(MAILBOX_BOARD.removeConfirm)) return;
        try {
            await deleteMailboxMessage(id);
            discard(id);
            showToast({ variant: 'success', message: MAILBOX_BOARD.toasts.removed });
        } catch {
            showToast({ variant: 'error', message: MAILBOX_BOARD.errors.remove });
        }
    };

    // ------------------------------------------------------- eventos tablero

    /** El mensaje que se está arrastrando; `null` cuando no hay arrastre en curso. */
    let draggingId: number | null = null;

    root.addEventListener(
        'dragstart',
        (event) => {
            const card = (event.target as HTMLElement).closest<HTMLElement>('[data-mailbox-card]');
            if (!card) return;
            // Un mensaje leído no se arrastra: está bloqueado en "Leídos".
            if (card.dataset.locked === 'true') return event.preventDefault();

            draggingId = Number(card.dataset.id);
            card.dataset.dragging = 'true';
            if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', String(draggingId));
            }
        },
        { signal },
    );

    root.addEventListener(
        'dragend',
        () => {
            draggingId = null;
            setDropzone(root, null);
            root.querySelectorAll('[data-dragging="true"]').forEach((card) => card.removeAttribute('data-dragging'));
        },
        { signal },
    );

    root.addEventListener(
        'dragover',
        (event) => {
            if (draggingId === null) return;
            const list = (event.target as HTMLElement).closest<HTMLElement>('[data-mailbox-list]');
            if (!list) return;
            event.preventDefault();
            if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
            setDropzone(root, list.closest<HTMLElement>('[data-mailbox-column]'));
        },
        { signal },
    );

    root.addEventListener(
        'drop',
        (event) => {
            if (draggingId === null) return;
            const list = (event.target as HTMLElement).closest<HTMLElement>('[data-mailbox-list]');
            if (!list) return;
            event.preventDefault();
            const id = draggingId;
            draggingId = null;
            setDropzone(root, null);
            moveCard(id, list.dataset.mailboxList as MailboxColumnId);
        },
        { signal },
    );

    // Un solo oyente para todas las tarjetas: el tablero tiene cientos de botones
    // y no puede llevar un manejador por tarjeta.
    root.addEventListener(
        'click',
        (event) => {
            const target = event.target as HTMLElement;
            const card = target.closest<HTMLElement>('[data-mailbox-card]');
            if (!card) return;
            const id = Number(card.dataset.id);

            if (target.closest('[data-mailbox-view]')) openDialog(id);
            if (target.closest('[data-mailbox-remove]')) remove(id);
        },
        { signal },
    );

    /** Alternativa al arrastre: con la tarjeta enfocada, Ctrl + flechas la mueven. */
    root.addEventListener(
        'keydown',
        (event) => {
            if (!event.ctrlKey) return;
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            const card = (event.target as HTMLElement).closest<HTMLElement>('[data-mailbox-card]');
            if (!card) return;
            // Las leídas tampoco se mueven con el atajo: mismo bloqueo que el arrastre.
            if (card.dataset.locked === 'true') return;
            event.preventDefault();

            const index = MAILBOX_COLUMN_ORDER.indexOf(card.dataset.state as MailboxColumnId);
            const next = MAILBOX_COLUMN_ORDER[index + (event.key === 'ArrowRight' ? 1 : -1)];
            if (!next) return;
            moveCard(Number(card.dataset.id), next);
            card.focus();
        },
        { signal },
    );

    // ------------------------------------------------------- eventos del modal

    dialog.addEventListener('close', () => (currentId = null), { signal });

    dialog.addEventListener(
        'click',
        (event) => {
            // Un clic sobre el propio <dialog> (no sobre su contenido) es el fondo.
            if (event.target === dialog) return closeDialog();

            const target = event.target as HTMLElement;
            if (target.closest('[data-mailbox-close]')) closeDialog();
            else if (target.closest('[data-mailbox-approve]')) approve();
            else if (target.closest('[data-mailbox-reject]')) reject();
            else if (target.closest('[data-mailbox-prev]')) step(-1);
            else if (target.closest('[data-mailbox-next]')) step(1);
        },
        { signal },
    );

    dialog.addEventListener(
        'keydown',
        (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                step(-1);
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                step(1);
            }
        },
        { signal },
    );

    // ------------------------------------------------------ pestaña del panel

    // Solo si el tablero es una pestaña: una pantalla suelta (la previsualización) no
    // tiene `CmsPanel` que la destape, y escucharla la dejaría escondida para siempre.
    if (tabbed) {
        // El panel nace `hidden` en el HTML y lo destapa `CmsPanel` al recibir este
        // evento. Se repite aquí para que su estado no dependa de que este script
        // llegara a tiempo de oír el primer `tab`: la isla React hidrata antes que
        // este módulo, así que ese primer evento se pierde.
        if (panel) panel.hidden = true;
        document.addEventListener(
            MAILBOX_EVENTS.tab,
            (event) => {
                const active = (event as CustomEvent<{ tab: string }>).detail?.tab === MAILBOX_BOARD.tab;
                if (panel) panel.hidden = !active;
                if (!active) closeDialog();
            },
            { signal },
        );
    }

    // El temporizador del buscador sobrevive al `abort` (no es un oyente), así que se
    // cancela aquí para no filtrar contra un tablero que ya está desmontado.
    return () => {
        clearTimeout(searchTimer);
        controller.abort();
    };
};

onPageLoad(bindMailboxBoard);