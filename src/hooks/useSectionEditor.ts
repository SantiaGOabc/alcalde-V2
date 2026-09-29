import { useCallback, useMemo, useState } from 'react';
import type { CmsSectionState } from '@/cms/sections';
import { setIn, type Path } from '@/cms/editor';
import { ApiError, resetContent, saveContent } from '@/lib';

export type EditorStatus =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'saved'; message: string }
  | { kind: 'error'; message: string };

const errorMessage = (error: unknown) => (error instanceof ApiError ? error.message : 'No se pudo completar la acción.');

/**
 * Estado de edición de UNA sección: borrador, guardado y restauración de los
 * valores por defecto. Toda la comunicación con el servidor pasa por `lib/api`.
 */
export function useSectionEditor(section: CmsSectionState, onPersisted: (next: CmsSectionState) => void) {
  const [saved, setSaved] = useState<unknown>(section.value);
  const [draft, setDraft] = useState<unknown>(section.value);
  const [overridden, setOverridden] = useState(section.overridden);
  const [status, setStatus] = useState<EditorStatus>({ kind: 'idle' });

  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  const update = useCallback((path: Path, value: unknown) => {
    setDraft((current: unknown) => setIn(current, path, value));
    setStatus({ kind: 'idle' });
  }, []);

  const persist = (value: unknown, isOverridden: boolean, message: string) => {
    setSaved(value);
    setDraft(value);
    setOverridden(isOverridden);
    setStatus({ kind: 'saved', message });
    onPersisted({ ...section, value, overridden: isOverridden });
  };

  const save = async () => {
    setStatus({ kind: 'saving' });
    try {
      const { value } = await saveContent(section.key, draft);
      persist(value, true, 'Cambios guardados. Ya se ven en el sitio.');
    } catch (error) {
      setStatus({ kind: 'error', message: errorMessage(error) });
    }
  };

  const restoreDefaults = async () => {
    setStatus({ kind: 'saving' });
    try {
      await resetContent(section.key);
      persist(section.defaults, false, 'Se restauró el contenido original.');
    } catch (error) {
      setStatus({ kind: 'error', message: errorMessage(error) });
    }
  };

  const discard = () => {
    setDraft(saved);
    setStatus({ kind: 'idle' });
  };

  return { draft, isDirty, overridden, status, update, save, restoreDefaults, discard };
}
