import { sendMailboxMessage } from '@/lib';
import type { FormService } from './form';

/** Adapta los valores crudos del formulario al contrato del API del buzón. */
export const submitMailboxForm: FormService = ({ fullName, email, type, message }) =>
  sendMailboxMessage({ fullName, email, type, message }).then(() => undefined);
