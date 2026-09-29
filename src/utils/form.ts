import { ApiError } from '@/lib';
import { submitMailboxForm } from './mailbox';
import { showToast } from './toast';

export type FormValues = Record<string, string>;
export type FormService = (values: FormValues) => Promise<void>;

/**
 * Registro de servicios de envío. `Form.astro` recibe el nombre por la prop
 * `service`; añadir un formulario nuevo es añadir una entrada aquí.
 */
export const FORM_SERVICES = {
  mailbox: submitMailboxForm,
} satisfies Record<string, FormService>;

export type FormServiceName = keyof typeof FORM_SERVICES;

export type FormStatus = 'idle' | 'submitting' | 'error';

export const serializeForm = (form: HTMLFormElement): FormValues =>
  Object.fromEntries(
    Array.from(new FormData(form), ([name, value]) => [name, String(value)]),
  );

const isServiceName = (name: string | undefined): name is FormServiceName =>
  name !== undefined && name in FORM_SERVICES;

const setStatus = (form: HTMLFormElement, status: FormStatus): void => {
  form.dataset.status = status;

  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
  if (submit) submit.disabled = status === 'submitting';
};

/**
 * Conecta un `<form data-form data-service="...">` con su servicio de envío.
 * El estado vive en `data-status` (el CSS decide el texto del botón) y el resultado
 * se comunica con un toast, con los textos que el formulario trae en `data-*`.
 */
export const bindForm = (form: HTMLFormElement): void => {
  const { service } = form.dataset;

  if (!isServiceName(service)) {
    console.warn(`[form] Servicio desconocido: "${service}"`);
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus(form, 'submitting');

    const { successTitle, successMessage, errorTitle, errorMessage } = form.dataset;

    try {
      await FORM_SERVICES[service](serializeForm(form));
      form.reset(); // dispara 'reset' → estado 'idle'
      showToast({ variant: 'success', title: successTitle, message: successMessage ?? '' });
    } catch (error) {
      setStatus(form, 'error');
      // Si el servidor explicó el motivo (datos inválidos, servicio caído), se muestra; si no, el texto genérico.
      showToast({
        variant: 'error',
        title: errorTitle,
        message: error instanceof ApiError ? error.message : (errorMessage ?? ''),
      });
    }
  });

  form.addEventListener('reset', () => setStatus(form, 'idle'));
};

export const bindForms = (): void => {
  document
    .querySelectorAll<HTMLFormElement>('form[data-form]')
    .forEach(bindForm);
};
