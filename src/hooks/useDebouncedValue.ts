import { useEffect, useState } from 'react';

/** Devuelve `value` solo cuando deja de cambiar durante `delayMs` (útil para no consultar en cada tecla). */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
