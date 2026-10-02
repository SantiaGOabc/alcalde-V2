import { blankLike, getIn, humanize, isImageUrl, isLongText, isRecord, itemTitle, type Path } from '@/cms/editor';
import ImageField from '@/components/ui/ImageField';
import { FIELD_CLASS } from '@/components/ui/fieldStyles';

interface ContentFieldProps {
  label: string;
  value: unknown;
  path: Path;
  /** Datos por defecto de la sección: sirven de molde para añadir elementos a una lista. */
  defaults: unknown;
  /** Claves de la sección cuyo valor es una imagen (ver `CMS_IMAGE_FIELDS`). */
  imageFields: readonly string[];
  onChange: (path: Path, value: unknown) => void;
}

const LABEL_CLASS = 'text-[11px] font-bold tracking-wide text-slate-700 uppercase';
const SMALL_BUTTON =
  'rounded-brand border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent';

/** Última clave de la ruta: el nombre del campo, sea cual sea su profundidad. */
const fieldKey = (path: Path): string => String(path[path.length - 1] ?? '');

/**
 * Editor recursivo: dibuja el control que corresponde al tipo del valor
 * (texto, número, casilla, objeto o lista), de modo que cualquier sección
 * nueva del registro es editable sin escribir un formulario a medida.
 */
export default function ContentField({ label, value, path, defaults, imageFields, onChange }: ContentFieldProps) {
  const id = `field-${path.join('.')}`;
  const child = (key: string | number, item: unknown) => (
    <ContentField
      key={key}
      label={humanize(key)}
      value={item}
      path={[...path, key]}
      defaults={defaults}
      imageFields={imageFields}
      onChange={onChange}
    />
  );

  if (Array.isArray(value)) {
    const sample = (getIn(defaults, path) as unknown[] | undefined)?.[0] ?? value[0];
    const move = (from: number, to: number) => {
      const next = [...value];
      [next[from], next[to]] = [next[to], next[from]];
      onChange(path, next);
    };

    return (
      <fieldset className="flex flex-col gap-3">
        <legend className={LABEL_CLASS}>{label}</legend>
        {value.map((item, index) => (
          <details key={index} className="rounded-brand border border-slate-200 bg-white" open={value.length === 1}>
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-slate-800">
              <span className="truncate">{itemTitle(item, index)}</span>
              <span className="flex shrink-0 gap-1" onClick={(event) => event.preventDefault()}>
                <button type="button" className={SMALL_BUTTON} disabled={index === 0} onClick={() => move(index, index - 1)} aria-label="Subir">↑</button>
                <button type="button" className={SMALL_BUTTON} disabled={index === value.length - 1} onClick={() => move(index, index + 1)} aria-label="Bajar">↓</button>
                <button type="button" className={`${SMALL_BUTTON} text-red-600`} onClick={() => onChange(path, value.filter((_, i) => i !== index))}>Eliminar</button>
              </span>
            </summary>
            <div className="flex flex-col gap-4 border-t border-slate-100 p-4">
              {isRecord(item) ? (
                Object.entries(item).map(([key, inner]) => (
                  <ContentField
                    key={key}
                    label={humanize(key)}
                    value={inner}
                    path={[...path, index, key]}
                    defaults={defaults}
                    imageFields={imageFields}
                    onChange={onChange}
                  />
                ))
              ) : (
                <ContentField
                  label={label}
                  value={item}
                  path={[...path, index]}
                  defaults={defaults}
                  imageFields={imageFields}
                  onChange={onChange}
                />
              )}
            </div>
          </details>
        ))}
        <button
          type="button"
          className={`${SMALL_BUTTON} self-start px-3 py-1.5`}
          disabled={sample === undefined}
          onClick={() => onChange(path, [...value, blankLike(sample)])}
        >
          + Añadir
        </button>
      </fieldset>
    );
  }

  if (isRecord(value)) {
    return (
      <fieldset className="flex flex-col gap-4 rounded-brand border border-slate-200 p-4">
        <legend className={`${LABEL_CLASS} px-1`}>{label}</legend>
        {Object.entries(value).map(([key, item]) => child(key, item))}
      </fieldset>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={value} onChange={(event) => onChange(path, event.target.checked)} className="size-4 accent-(--brand-primary)" />
        {label}
      </label>
    );
  }

  if (typeof value === 'number') {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className={LABEL_CLASS}>{label}</label>
        <input id={id} type="number" value={value} onChange={(event) => onChange(path, Number(event.target.value))} className={FIELD_CLASS} />
      </div>
    );
  }

  const text = typeof value === 'string' ? value : '';

  /*
    Campo de imagen declarado en `CMS_IMAGE_FIELDS`: se dibuja con `ImageField`, el
    mismo control que usa el formulario de obras, y por lo tanto con subida de
    archivo y miniatura. Se decide por el NOMBRE del campo y no por lo que parece
    su valor, porque un campo recién vacío no tiene nada que delatarlo.

    El valor sigue siendo una URL de texto, así que el resto de la sección (la
    validación de `matchesShape`, la vista previa, el sitio) no cambia nada: solo
    se le da una forma cómoda de escribirla.
  */
  if (imageFields.includes(fieldKey(path))) {
    return <ImageField label={label} value={text} onChange={(src) => onChange(path, src)} />;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={LABEL_CLASS}>{label}</label>
      {isLongText(text) ? (
        <textarea id={id} value={text} rows={5} onChange={(event) => onChange(path, event.target.value)} className={`${FIELD_CLASS} resize-y`} />
      ) : (
        <input id={id} type="text" value={text} onChange={(event) => onChange(path, event.target.value)} className={FIELD_CLASS} />
      )}
      {isImageUrl(text) && <img src={text} alt="" loading="lazy" className="mt-1 h-20 w-32 rounded-brand border border-slate-200 object-cover" />}
    </div>
  );
}
