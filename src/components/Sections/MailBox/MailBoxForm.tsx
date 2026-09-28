import { Form } from '@components';
import { useForm } from '../../../hooks/useForm';
import { MAILBOX_CONTENT } from '../../../constants/global/mailbox';

type MailboxData = { fullName: string; email: string; message: string };
export default function MailBoxForm() {
  const { form: staticText } = MAILBOX_CONTENT;
  const { values, handleChange, resetForm } = useForm<MailboxData>({
    fullName: '',
    email: '',
    message: ''
  });
  const submitData = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Datos enviados:", values);
  };

  const inputClass = "w-full rounded-lg bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-(--home-accent) focus:ring-2 focus:ring-(--home-accent)/20 transition-all duration-200 outline-none";

  return (
    <Form 
      onSubmit={submitData}
      onCancel={resetForm}
      submitText={staticText.submitButton}
      loadingText={staticText.loadingText}
      cancelText={staticText.cancelButton}
      successMessage={staticText.successMessage}
      className="flex flex-col gap-4 w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-[11px] font-bold text-slate-700 tracking-wide uppercase">
            {staticText.fullNameLabel}
          </label>
          <input 
            id="fullName" name="fullName" type="text" value={values.fullName} onChange={handleChange} className={inputClass} placeholder={staticText.fullNamePlaceholder} required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[11px] font-bold text-slate-700 tracking-wide uppercase">
            {staticText.emailLabel}
          </label>
          <input 
            id="email" name="email" type="email" value={values.email} onChange={handleChange} className={inputClass} placeholder={staticText.emailPlaceholder} required 
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-[11px] font-bold text-slate-700 tracking-wide uppercase">
          {staticText.messageLabel}
        </label>
        <textarea 
          id="message" name="message" value={values.message} onChange={handleChange} className={`${inputClass} resize-none h-24`} required 
        />
      </div>
    </Form>
  )
}