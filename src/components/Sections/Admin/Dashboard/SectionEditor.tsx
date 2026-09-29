import { useEffect } from 'react';
import type { CmsSectionState } from '@/cms/sections';
import Button from '@/components/ui/Button';
import { useConfirm } from '@/components/ui/Confirm';
import { useLivePreview, useSectionEditor } from '@/hooks';
import { showToast } from '@utils';
import ContentField from './ContentField';
import PreviewFrame from './PreviewFrame';

interface SectionEditorProps {
  section: CmsSectionState;
  onPersisted: (next: CmsSectionState) => void;
  onDirtyChange: (isDirty: boolean) => void;
}

/** Formulario de la sección a la izquierda; la página real, en vivo, a la derecha. */
export default function SectionEditor({ section, onPersisted, onDirtyChange }: SectionEditorProps) {
  const confirm = useConfirm();
  const { draft, isDirty, overridden, status, update, save, restoreDefaults, discard } = useSectionEditor(
    section,
    onPersisted,
  );
  const reloadToken = useLivePreview(section.key, draft, isDirty);
  const isBusy = status.kind === 'saving';

  useEffect(() => onDirtyChange(isDirty), [isDirty, onDirtyChange]);

  // El resultado de guardar/restaurar se comunica con un toast, no con texto en el formulario.
  useEffect(() => {
    if (status.kind === 'saved') showToast({ variant: 'success', title: section.label, message: status.message });
    if (status.kind === 'error') showToast({ variant: 'error', title: 'No se pudo guardar', message: status.message });
  }, [status, section.label]);

  const handleSave = async () => {
    const accepted = await confirm({
      title: 'Publicar cambios',
      message: `Los cambios de «${section.label}» se guardarán y se verán de inmediato en el sitio.`,
      confirmLabel: 'Sí, publicar',
    });
    if (accepted) await save();
  };

  const handleRestore = async () => {
    const accepted = await confirm({
      title: 'Restaurar contenido original',
      message: 'Se descartará la versión editada de esta sección y volverá el contenido original del sitio.',
      confirmLabel: 'Restaurar',
      tone: 'danger',
    });
    if (accepted) await restoreDefaults();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(24rem,30rem)_1fr]">
      <form
        className="flex min-w-0 flex-col gap-6"
        // Guardar pide confirmación en un modal, así que pulsar Enter en un campo no publica nada.
        onSubmit={(event) => event.preventDefault()}
      >
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{section.page}</p>
            <h2 className="text-2xl font-extrabold text-slate-900">{section.label}</h2>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${overridden ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}
          >
            {overridden ? 'Editado' : 'Contenido original'}
          </span>
        </header>

        <div className="flex flex-col gap-5">
          {Object.entries(draft as Record<string, unknown>).map(([key, value]) => (
            <ContentField
              key={key}
              label={key}
              value={value}
              path={[key]}
              defaults={section.defaults}
              onChange={update}
            />
          ))}
        </div>

        <footer className="sticky bottom-0 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <Button type="button" disabled={!isDirty || isBusy} isLoading={isBusy} onClick={handleSave}>
            Guardar cambios
          </Button>
          <Button type="button" variant="ghost" disabled={!isDirty || isBusy} onClick={discard}>
            Descartar
          </Button>
          <Button type="button" variant="outline" disabled={!overridden || isBusy} onClick={handleRestore}>
            Restaurar original
          </Button>
          {isDirty && <p className="basis-full text-sm text-slate-500">Tienes cambios sin guardar.</p>}
        </footer>
      </form>

      <aside aria-label="Vista previa" className="h-[70vh] xl:sticky xl:top-20 xl:h-[calc(100vh-6rem)]">
        <PreviewFrame path={section.path} anchor={section.anchor} reloadToken={reloadToken} />
      </aside>
    </div>
  );
}
