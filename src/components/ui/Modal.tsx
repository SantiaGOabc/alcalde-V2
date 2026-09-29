import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@utils';

interface ModalProps {
  open: boolean;
  /** Se llama al pulsar Escape, la X o el fondo oscuro. */
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Botones de acción, alineados a la derecha al pie. */
  footer?: ReactNode;
  className?: string;
}

/**
 * Modal accesible sobre el elemento nativo `<dialog>`: el navegador aporta la
 * captura del foco, el cierre con Escape y el aislamiento del resto de la página.
 */
export default function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="modal-title"
      // Escape dispara `cancel`: se delega en `onClose` para que el estado de React mande.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // Un clic sobre el propio <dialog> (no sobre su contenido) es un clic en el fondo.
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className={cn(
        'm-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white p-0 text-slate-800 shadow-2xl backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm',
        className,
      )}
    >
      <div className="flex flex-col gap-4 p-6">
        <header className="flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-lg font-extrabold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-slate-400 transition-colors hover:text-slate-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="size-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="text-sm leading-6 text-slate-600">{children}</div>

        {footer && <footer className="mt-2 flex flex-wrap justify-end gap-2">{footer}</footer>}
      </div>
    </dialog>
  );
}
