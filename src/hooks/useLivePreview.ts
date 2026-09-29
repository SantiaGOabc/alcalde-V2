import { useEffect, useState } from 'react';
import type { CmsKey } from '@/cms/sections';
import { clearPreview, pushPreview } from '@/lib';

/** Espera tras la última tecla antes de refrescar la vista previa. */
const PUSH_DELAY_MS = 500;

/**
 * Mantiene la vista previa de la página al día con el borrador: publica el
 * borrador en el servidor (solo visible con `?cms-preview`) y devuelve un
 * `reloadToken` que cambia cada vez que el iframe debe recargarse.
 *
 * Sin cambios pendientes descarta cualquier borrador, así la vista previa
 * nunca muestra algo distinto de lo que el editor considera guardado.
 */
export function useLivePreview(key: CmsKey, draft: unknown, isDirty: boolean): number {
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await (isDirty ? pushPreview(key, draft) : clearPreview(key));
        setReloadToken((token) => token + 1);
      } catch {
        // La vista previa es un apoyo: si falla, el editor sigue funcionando.
      }
    }, PUSH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [key, draft, isDirty]);

  // Al salir de la sección se limpia el borrador para no contaminar otras vistas.
  useEffect(() => () => void clearPreview(key).catch(() => undefined), [key]);

  return reloadToken;
}
