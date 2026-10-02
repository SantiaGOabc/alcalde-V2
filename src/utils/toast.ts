/**
 * Notificaciones (toasts) reutilizables. No dependen de ningún framework: se
 * llaman igual desde un script de Astro que desde un componente React.
 *
 *   showToast({ variant: 'success', title: '¡Enviado!', message: 'Gracias por escribirnos.' });
 *
 * Se pintan dentro de `#toast-region` (ver `ToastRegion.astro`); si la página no
 * la tiene, se crea al vuelo.
 */
export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastOptions {
  message: string;
  title?: string;
  variant?: ToastVariant;
  /** Milisegundos hasta que se cierra sola. */
  durationMs?: number;
}

export const TOAST_REGION_ID = 'toast-region';
const DEFAULT_DURATION_MS = 5000;
const EXIT_ANIMATION_MS = 200;

const VARIANTS: Record<ToastVariant, { accent: string; bar: string; icon: string }> = {
  success: {
    accent: 'border-emerald-500 text-emerald-600',
    bar: 'bg-emerald-500',
    icon: '<path d="M20 6 9 17l-5-5" />',
  },
  error: {
    accent: 'border-red-500 text-red-600',
    bar: 'bg-red-500',
    icon: '<circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />',
  },
  info: {
    accent: 'border-(--brand-primary) text-(--brand-primary)',
    bar: 'bg-(--brand-primary)',
    icon: '<circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />',
  },
};

const svg = (paths: string, className: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="${className}">${paths}</svg>`;

const getRegion = (): HTMLElement => {
  const existing = document.getElementById(TOAST_REGION_ID);
  if (existing) return existing;

  const region = document.createElement('div');
  region.id = TOAST_REGION_ID;
  region.setAttribute('aria-live', 'polite');
  region.className =
    'pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-3 p-4 sm:items-end sm:p-6';
  document.body.append(region);
  return region;
};

const textElement = (tag: 'p', className: string, text: string): HTMLElement => {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text; // textContent: el mensaje nunca se interpreta como HTML
  return element;
};

export function showToast({
  message,
  title,
  variant = 'info',
  durationMs = DEFAULT_DURATION_MS,
}: ToastOptions): void {
  const style = VARIANTS[variant];

  const toast = document.createElement('div');
  toast.setAttribute('role', variant === 'error' ? 'alert' : 'status');
  toast.className = `pointer-events-auto relative w-full max-w-sm translate-y-3 overflow-hidden rounded-brand border-l-4 bg-white opacity-0 shadow-xl ring-1 ring-black/5 transition duration-200 ${style.accent}`;

  const body = document.createElement('div');
  body.className = 'flex items-start gap-3 p-4 pr-10';
  body.insertAdjacentHTML('afterbegin', svg(style.icon, 'mt-0.5 size-5 shrink-0'));

  const text = document.createElement('div');
  if (title) text.append(textElement('p', 'text-sm font-bold text-slate-900', title));
  text.append(textElement('p', 'text-sm text-slate-600', message));
  body.append(text);

  const close = document.createElement('button');
  close.type = 'button';
  close.setAttribute('aria-label', 'Cerrar notificación');
  close.className = 'absolute top-3 right-3 text-slate-400 transition-colors hover:text-slate-700';
  close.insertAdjacentHTML('afterbegin', svg('<path d="M18 6 6 18M6 6l12 12" />', 'size-4'));

  const bar = document.createElement('div');
  bar.className = `absolute bottom-0 left-0 h-0.5 w-full origin-left ${style.bar}`;
  bar.style.transition = `transform ${durationMs}ms linear`;

  toast.append(body, close, bar);
  getRegion().append(toast);

  const dismiss = () => {
    toast.classList.add('translate-y-3', 'opacity-0');
    setTimeout(() => toast.remove(), EXIT_ANIMATION_MS);
  };

  // Entrada: se pinta en su estado inicial y en el siguiente frame pasa al final (transición CSS).
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
    bar.style.transform = 'scaleX(0)';
  });

  const timer = setTimeout(dismiss, durationMs);
  close.addEventListener('click', () => {
    clearTimeout(timer);
    dismiss();
  });
}
