import { useId, useState } from 'react';
import { ApiError, uploadImage } from '@/lib';
import { FIELD_CLASS } from './fieldStyles';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (src: string) => void;
  /** `false` para videos: solo se admite una URL (no se suben archivos de video). */
  allowUpload?: boolean;
  placeholder?: string;
}

const LABEL_CLASS = 'text-[11px] font-bold tracking-wide text-slate-700 uppercase';

/**
 * URL de imagen con subida de archivo y miniatura.
 *
 * Vive en `ui/` porque lo usan dos sitios del panel que no tienen nada que ver
 * entre sí: el formulario de obras y el editor de contenido (`ContentField`, para
 * los campos de imagen de una sección del CMS).
 */
export default function ImageField({ label, value, onChange, allowUpload = true, placeholder = 'https://…' }: ImageFieldProps) {
  const id = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setIsUploading(true);
    try {
      const { url } = await uploadImage(file);
      onChange(url);
    } catch (failure) {
      setError(failure instanceof ApiError ? failure.message : 'No se pudo subir la imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={LABEL_CLASS}>{label}</label>
      <div className="flex gap-2">
        <input id={id} type="text" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={FIELD_CLASS} />
        {allowUpload && (
          <label className="inline-flex shrink-0 cursor-pointer items-center rounded-brand border border-slate-200 px-3 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100 has-disabled:opacity-50">
            {isUploading ? 'Subiendo…' : 'Subir'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={isUploading}
              className="sr-only"
              onChange={(event) => {
                void handleFile(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
          </label>
        )}
      </div>
      {error && <p role="alert" className="text-xs font-semibold text-red-700">{error}</p>}
      {allowUpload && value && (
        <img src={value} alt="" loading="lazy" className="mt-1 h-20 w-32 rounded-brand border border-slate-200 object-cover" />
      )}
    </div>
  );
}
