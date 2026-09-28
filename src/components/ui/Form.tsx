import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

interface FormProps {
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  children: ReactNode;
  submitText: string;
  loadingText: string;
  cancelText: string;
  successMessage: string;
  className?: string;
}
export default function Form({ 
  onSubmit, 
  onCancel, 
  children, 
  submitText, 
  loadingText, 
  cancelText, 
  successMessage,
  className 
}: FormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      await onSubmit();
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        onCancel();
      }, 3000);
    } catch (error) {
      setStatus('idle');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 pt-4 border-t border-slate-100">
        <button 
          type="submit" 
          disabled={status === 'submitting'} 
          className="w-full sm:w-auto min-w-[120px] px-6 py-2.5 text-sm font-bold text-white bg-(--home-accent) rounded-full shadow-md hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-60 transition-all duration-300"
        >
          {status === 'submitting' ? (loadingText || 'Enviando...') : (submitText || 'Enviar')}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-(--home-accent) bg-transparent border-2 border-(--home-accent) hover:bg-(--home-accent-strong) hover:text-white hover:border-(--home-accent-strong) active:scale-95 rounded-full transition-all duration-200"
        >
          {cancelText || 'Cancelar'}
        </button>

      </div>
      {status === 'success' && (
        <div className="p-3 bg-green-50 text-green-700 rounded-lg text-center text-sm font-semibold mt-4 animate-pulse">
          {successMessage || '¡Mensaje enviado!'}
        </div>
      )}
    </form>
  );
}