import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Button } from '@components';
import { LOGIN_CONTENT } from '@constant';
import { loginService } from '@utils';

export default function LoginForm() {
  const { form: staticText } = LOGIN_CONTENT;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const result = await loginService({
        username,
        password,
        rememberMe,
      });

      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          window.location.href = '/admin';
        }, 900);
      } else {
        setErrorMessage(result.message);
        setIsSubmitting(false);
      }
    } catch {
      setErrorMessage('Ocurrió un error inesperado al procesar la solicitud.');
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-(--brand-primary) focus:ring-2 focus:ring-(--brand-primary)/20 transition-all duration-200 outline-none';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {/* Banner de Error (con icono SVG profesional, sin emojis) */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-800 text-xs leading-relaxed animate-fadeIn"
        >
          <svg
            className="size-4 shrink-0 mt-0.5 text-red-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Banner de Éxito (con icono SVG profesional, sin emojis) */}
      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold animate-fadeIn"
        >
          <svg
            className="size-4 shrink-0 text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Campo: Usuario / Correo */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="admin-username"
          className="text-[11px] font-bold text-slate-700 tracking-wide uppercase"
        >
          {staticText.usernameLabel}
        </label>
        <div className="relative">
          <input
            id="admin-username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            className={inputClass}
            placeholder={staticText.usernamePlaceholder}
            required
            disabled={isSubmitting}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Campo: Contraseña con Visor SVG */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="admin-password"
            className="text-[11px] font-bold text-slate-700 tracking-wide uppercase"
          >
            {staticText.passwordLabel}
          </label>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert('Para restablecer la clave, contacte con la Unidad de Sistemas del GAMC.');
            }}
            className="text-xs font-semibold text-(--brand-accent) hover:underline"
          >
            {staticText.forgotPassword}
          </a>
        </div>
        <div className="relative">
          <input
            id="admin-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className={`${inputClass} pr-11`}
            placeholder={staticText.passwordPlaceholder}
            required
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? (
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Checkbox: Recordarme */}
      <div className="flex items-center gap-2 pt-1">
        <input
          id="admin-remember"
          type="checkbox"
          checked={rememberMe}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
          className="size-4 rounded border-slate-300 text-(--brand-primary) focus:ring-(--brand-primary)/30 accent-(--brand-primary)"
        />
        <label htmlFor="admin-remember" className="text-xs text-slate-600 select-none">
          {staticText.rememberMe}
        </label>
      </div>

      {/* Botón de Envío Reutilizando Primitive Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="w-full shadow-md hover:shadow-lg"
        >
          {isSubmitting ? staticText.loadingText : staticText.submitButton}
        </Button>
      </div>

      {/* Aviso de Modo Demo (sin emojis) */}
      <p className="text-[11px] text-center text-slate-400 bg-slate-50 border border-slate-100 rounded-lg py-2 px-3">
        {staticText.demoNotice}
      </p>

      {/* Enlace de regreso al portal */}
      <div className="pt-2 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-(--brand-primary) transition-colors"
        >
          <svg
            className="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          {staticText.backToHome}
        </a>
      </div>
    </form>
  );
}
