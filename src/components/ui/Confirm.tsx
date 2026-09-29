import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import Button from './Button';
import Modal from './Modal';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `danger` pinta el botón de confirmar de rojo (eliminar, descartar…). */
  tone?: 'default' | 'danger';
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

interface PendingConfirm extends ConfirmOptions {
  settle: (accepted: boolean) => void;
}

/**
 * Da a todo el árbol una confirmación con modal propio, en lugar de `window.confirm`:
 *
 *   const confirm = useConfirm();
 *   if (await confirm({ title: 'Eliminar obra', message: '…', tone: 'danger' })) { … }
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback<ConfirmFn>(
    (options) =>
      new Promise((resolve) =>
        setPending({
          ...options,
          settle: (accepted) => {
            setPending(null);
            resolve(accepted);
          },
        }),
      ),
    [],
  );

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={pending !== null}
        onClose={() => pending?.settle(false)}
        title={pending?.title ?? ''}
        footer={
          <>
            <Button type="button" variant="ghost" size="sm" onClick={() => pending?.settle(false)}>
              {pending?.cancelLabel ?? 'Cancelar'}
            </Button>
            <Button
              type="button"
              size="sm"
              className={pending?.tone === 'danger' ? 'bg-red-600 focus-visible:ring-red-600/50' : undefined}
              onClick={() => pending?.settle(true)}
            >
              {pending?.confirmLabel ?? 'Aceptar'}
            </Button>
          </>
        }
      >
        {pending?.message}
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm debe usarse dentro de <ConfirmProvider>.');
  return confirm;
}
