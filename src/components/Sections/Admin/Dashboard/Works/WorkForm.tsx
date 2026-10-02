import { useState, type FormEvent } from 'react';
import { CATEGORIAS_GESTION, ESTADOS_GESTION, LABELS_CATEGORIA } from '@constant';
import Button from '@/components/ui/Button';
import { FIELD_CLASS } from '@/components/ui/fieldStyles';
import { ApiError, type Work, type WorkImage, type WorkInput } from '@/lib';
import ImageField from './ImageField';

interface WorkFormProps {
  /** `null` = obra nueva. */
  work: Work | null;
  onSave: (input: WorkInput) => Promise<void>;
  onCancel: () => void;
}

const EMPTY_IMAGE: WorkImage = { tipo: 'foto', src: '', alt: '' };

const EMPTY_WORK: WorkInput = {
  categoria: CATEGORIAS_GESTION[0],
  titulo: '',
  descripcion: '',
  portada: EMPTY_IMAGE,
  imagenes: [],
  publicada: true,
};

const LABEL_CLASS = 'text-[11px] font-bold tracking-wide text-slate-700 uppercase';

const toInput = ({ id: _id, ...input }: Work): WorkInput => input;

/** Alta y edición de una obra. Las fotos se suben desde el equipo o se pegan por URL. */
export default function WorkForm({ work, onSave, onCancel }: WorkFormProps) {
  const [draft, setDraft] = useState<WorkInput>(work ? toInput(work) : EMPTY_WORK);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patch = (changes: Partial<WorkInput>) => setDraft((current) => ({ ...current, ...changes }));

  const patchImage = (index: number, changes: Partial<WorkImage>) =>
    patch({ imagenes: draft.imagenes.map((image, i) => (i === index ? { ...image, ...changes } : image)) });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!draft.portada.src.trim()) {
      setError('Agrega una foto de portada.');
      return;
    }

    // Las imágenes sin fuente se descartan y las sin descripción usan el título.
    const withAlt = (image: WorkImage): WorkImage => ({ ...image, alt: image.alt.trim() || draft.titulo });
    const cleaned: WorkInput = {
      ...draft,
      portada: withAlt(draft.portada),
      imagenes: draft.imagenes.filter((image) => image.src.trim()).map(withAlt),
    };

    setIsSaving(true);
    try {
      await onSave(cleaned);
    } catch (failure) {
      setError(failure instanceof ApiError ? failure.message : 'No se pudo guardar la obra.');
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <header className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-extrabold text-slate-900">{work ? 'Editar obra' : 'Nueva obra'}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>← Volver</Button>
      </header>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="work-title" className={LABEL_CLASS}>Título</label>
        <input id="work-title" required maxLength={200} value={draft.titulo} onChange={(e) => patch({ titulo: e.target.value })} className={FIELD_CLASS} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="work-category" className={LABEL_CLASS}>Categoría</label>
          <select id="work-category" value={draft.categoria} onChange={(e) => patch({ categoria: e.target.value })} className={FIELD_CLASS}>
            {CATEGORIAS_GESTION.map((id) => <option key={id} value={id}>{LABELS_CATEGORIA[id] ?? id}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="work-status" className={LABEL_CLASS}>Estado</label>
          <select id="work-status" value={draft.estado ?? ''} onChange={(e) => patch({ estado: e.target.value || undefined })} className={FIELD_CLASS}>
            <option value="">Sin estado</option>
            {Object.entries(ESTADOS_GESTION).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="work-area" className={LABEL_CLASS}>Etiqueta de área (opcional)</label>
        <input id="work-area" maxLength={120} value={draft.area ?? ''} placeholder="Ej. Medio ambiente" onChange={(e) => patch({ area: e.target.value })} className={FIELD_CLASS} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="work-description" className={LABEL_CLASS}>Descripción</label>
        <textarea id="work-description" required rows={5} maxLength={4000} value={draft.descripcion} onChange={(e) => patch({ descripcion: e.target.value })} className={`${FIELD_CLASS} resize-y`} />
      </div>

      <ImageField label="Foto de portada" value={draft.portada.src} onChange={(src) => patch({ portada: { ...draft.portada, src, alt: draft.portada.alt || draft.titulo } })} />

      <fieldset className="flex flex-col gap-3">
        <legend className={LABEL_CLASS}>Galería (fotos y videos)</legend>
        {draft.imagenes.map((image, index) => {
          const isVideo = image.tipo === 'video';
          return (
            <div key={index} className="flex flex-col gap-3 rounded-brand border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <select aria-label="Tipo" value={image.tipo ?? 'foto'} onChange={(e) => patchImage(index, { tipo: e.target.value as WorkImage['tipo'] })} className={`${FIELD_CLASS} w-auto`}>
                  <option value="foto">Foto</option>
                  <option value="video">Video (mp4 o link de YouTube)</option>
                </select>
                <Button type="button" variant="ghost" size="sm" className="text-red-600" onClick={() => patch({ imagenes: draft.imagenes.filter((_, i) => i !== index) })}>
                  Quitar
                </Button>
              </div>
              <ImageField label={isVideo ? 'URL del video (mp4 o link de YouTube)' : 'Foto'} value={image.src} allowUpload={!isVideo} onChange={(src) => patchImage(index, { src })} />
              {isVideo && <ImageField label="Imagen de portada del video" value={image.poster ?? ''} onChange={(poster) => patchImage(index, { poster })} />}
              <input aria-label="Texto alternativo" placeholder="Descripción breve de la imagen" value={image.alt} onChange={(e) => patchImage(index, { alt: e.target.value })} className={FIELD_CLASS} />
            </div>
          );
        })}
        <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => patch({ imagenes: [...draft.imagenes, EMPTY_IMAGE] })}>
          + Añadir a la galería
        </Button>
      </fieldset>

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input type="checkbox" checked={draft.publicada} onChange={(e) => patch({ publicada: e.target.checked })} className="size-4 accent-(--brand-primary)" />
        Publicada (visible en la página de Gestión)
      </label>

      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" isLoading={isSaving}>{work ? 'Guardar cambios' : 'Crear obra'}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
