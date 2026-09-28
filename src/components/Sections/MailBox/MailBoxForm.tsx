import { useState } from 'react';

type Form = { nombre: string; correo: string; mensaje: string };

export default function ContactForm() {
  const [form, setForm] = useState<Form>({ nombre: '', correo: '', mensaje: '' });
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'listo'>('idle');
  //actualiza el form
  const set = (k: keyof Form) => (e: any) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

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

  const inputClass = "w-full rounded-xl bg-gray-50 border border-transparent px-4 py-3 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all outline-none";

  return (
    <form onSubmit={enviar} className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Buzón Ciudadano
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="nombre" className="text-sm font-semibold text-gray-700 cursor-pointer">
          Nombre completo
        </label>
        <input id="nombre" type="text" name="nombre" value={form.nombre} onInput={set('nombre')} className={inputClass} placeholder="Ej: Ana López" required />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="correo" className="text-sm font-semibold text-gray-700 cursor-pointer">
          Correo electrónico
        </label>
        <input id="correo" type="email" name="correo" value={form.correo} onInput={set('correo')} className={inputClass} placeholder="ana@ejemplo.com" required />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="mensaje" className="text-sm font-semibold text-gray-700 cursor-pointer">
          Escribe tu mensaje
        </label>
        <textarea 
          id="mensaje"
          value={form.mensaje} 
          onInput={set('mensaje')} 
          className={`${inputClass} resize-none h-32`} 
          placeholder="Escribe tu mensaje aquí..."
          required 
        />
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-4 pt-6 border-t border-gray-50">
        <button type="button" onClick={limpiar} 
          className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-purple-600 bg-transparent border-2 border-purple-600 rounded-full hover:bg-purple-50 transition-colors"
        >
          Cancelar
        </button>

        <button 
          type="submit" 
          disabled={estado === 'enviando'} 
          className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white bg-purple-600 rounded-full shadow-md shadow-purple-600/20 hover:bg-purple-700 disabled:bg-purple-400 disabled:shadow-none transition-all flex justify-center items-center gap-2"
        >
          {estado === 'enviando' ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </div>

      {estado === 'listo' && (
        <div className="p-4 bg-purple-50 border border-purple-100 text-purple-700 rounded-xl text-center text-sm font-semibold animate-pulse">
          ¡Mensaje enviado correctamente! Gracias por tu tiempo.
        </div>
      )}
    </form>
  );
}