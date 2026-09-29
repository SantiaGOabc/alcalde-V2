import { useState, type FormEvent } from 'react';
import Button from '@/components/ui/Button';
import { LOGIN_CONTENT } from '@constant';
import { FIELD_CLASS } from '@/components/ui/fieldStyles';
import { ApiError, login } from '@/lib';

interface LoginFormProps {
  /** Código secreto de la URL; el servidor lo vuelve a validar al iniciar sesión. */
  code: string;
}

export default function LoginForm({ code }: LoginFormProps) {
  const { form: staticText } = LOGIN_CONTENT;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login({ code, username, password });
      // La misma URL pasa a mostrar el panel cuando ya hay sesión.
      window.location.reload();
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : staticText.unexpectedError);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium leading-relaxed text-red-800"
        >
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="admin-username" className="text-[11px] font-bold tracking-wide text-slate-700 uppercase">
          {staticText.usernameLabel}
        </label>
        <input
          id="admin-username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className={FIELD_CLASS}
          placeholder={staticText.usernamePlaceholder}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="admin-password" className="text-[11px] font-bold tracking-wide text-slate-700 uppercase">
          {staticText.passwordLabel}
        </label>
        <div className="relative">
          <input
            id="admin-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`${FIELD_CLASS} pr-20`}
            placeholder={staticText.passwordPlaceholder}
            required
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 px-3.5 text-xs font-semibold text-slate-500 transition-colors hover:text-(--brand-primary)"
          >
            {showPassword ? staticText.hidePassword : staticText.showPassword}
          </button>
        </div>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} isLoading={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? staticText.loadingText : staticText.submitButton}
      </Button>

      <a
        href="/"
        className="pt-2 text-center text-xs font-semibold text-slate-500 transition-colors hover:text-(--brand-primary)"
      >
        {staticText.backToHome}
      </a>
    </form>
  );
}
