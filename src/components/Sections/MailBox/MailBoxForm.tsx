import { useState } from 'react';

type Form = { nombre: string; correo: string; mensaje: string };

export default function MailBoxForm() {
  const [form, setForm] = useState<Form>({ nombre: '', correo: '', mensaje: '' });
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'listo'>('idle');

  const set = (k: keyof Form) => (e: any) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  //actualiza el form
  const limpiar = () => setForm({ nombre: '', correo: '', mensaje: '' });

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado('enviando');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setEstado('listo');
    setTimeout(() => {
      limpiar();
      setEstado('idle');
    }, 3000);
  }
  const inputClass = "w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 hover:bg-slate-100 hover:border-slate-300 focus:bg-white focus:border-(--home-accent) focus:ring-4 focus:ring-(--home-accent)/10 transition-all duration-300 outline-none";

  return (
    <form onSubmit={enviar} className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <div className="mb-2 lg:hidden">
         <h3 className="text-2xl font-bold text-slate-900">Buzón Ciudadano</h3>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="nombre" className="text-xs font-bold text-slate-800 tracking-wider uppercase cursor-pointer">
          Nombre completo
        </label>
        <input id="nombre" type="text" value={form.nombre} onInput={set('nombre')} className={inputClass} placeholder="Ej: Ana López" required />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="correo" className="text-xs font-bold text-slate-800 tracking-wider uppercase cursor-pointer">
          Correo electrónico
        </label>
        <input id="correo" type="email" value={form.correo} onInput={set('correo')} className={inputClass} placeholder="ana@ejemplo.com" required />
      </div>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="mensaje" className="text-xs font-bold text-slate-800 tracking-wider uppercase cursor-pointer">
          Mensaje
        </label>
        <textarea 
          id="mensaje"
          value={form.mensaje} 
          onInput={set('mensaje')} 
          className={`${inputClass} resize-none h-32`} 
          placeholder=""
          required 
        />
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-2 pt-6 border-t border-slate-100">
        <button 
          type="button" 
          onClick={limpiar} 
          className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-(--home-accent) bg-transparent border-2 border-(--home-accent) rounded-full hover:bg-(--home-accent)/10 active:scale-95 transition-all duration-200">
          Cancelar
        </button>
        <button 
          type="button" 
          disabled={estado === 'enviando'} 
          className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-(--home-accent) rounded-full shadow-lg shadow-(--home-accent)/30 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-(--home-accent)/50 active:scale-95 disabled:transform-none disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex justify-center items-center"
        >
          {estado === 'enviando' ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </div>

      {estado === 'listo' && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center text-sm font-semibold animate-pulse">
          ¡Mensaje enviado correctamente!
        </div>
      )}
    </form>
  );
}