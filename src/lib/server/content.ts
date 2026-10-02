import { sectionId } from '@/cms/anchors';
import {
  CMS_IMAGE_FIELDS,
  CMS_SECTIONS,
  type CmsContent,
  type CmsKey,
  type CmsSectionState,
} from '@/cms/sections';
import { reconcile } from '@/cms/shape';
import { isDbConfigured, query } from './db';
import { getPreviewDraft } from './preview';

interface ContentRow {
  key: CmsKey;
  value: unknown;
}

/**
 * Contenido vigente de una sección: lo guardado en la base de datos completado
 * con los defaults, o los defaults (`constants`) si no hay fila, no hay base o
 * ésta falla. Una caída de la base nunca tumba el sitio público.
 */
export async function getContent<K extends CmsKey>(key: K): Promise<CmsContent<K>> {
  const { defaults } = CMS_SECTIONS[key];

  const draft = getPreviewDraft(key);
  if (draft !== undefined) return reconcile(defaults, draft);

  if (!isDbConfigured()) return defaults;

  try {
    const { rows } = await query<ContentRow>('SELECT key, value FROM site_content WHERE key = $1', [key]);
    return rows[0] ? reconcile(defaults, rows[0].value) : defaults;
  } catch (error) {
    console.warn(`[cms] No se pudo leer "${key}", se usan los valores por defecto.`, error);
    return defaults;
  }
}

/** Todas las secciones con su valor vigente, para el panel. */
export async function listContent(): Promise<CmsSectionState[]> {
  const stored = new Map<string, unknown>();

  if (isDbConfigured()) {
    const { rows } = await query<ContentRow>('SELECT key, value FROM site_content');
    rows.forEach((row) => stored.set(row.key, row.value));
  }

  return (Object.keys(CMS_SECTIONS) as CmsKey[]).map((key) => {
    const { page, path, label, defaults } = CMS_SECTIONS[key];
    const overridden = stored.has(key);

    return {
      key,
      page,
      path,
      anchor: sectionId(key),
      label,
      defaults,
      overridden,
      // Las claves de imagen son un dato del panel, no del contenido: se leen del
      // registro aparte para no meter el formulario dentro de los `constants`.
      imageFields: CMS_IMAGE_FIELDS[key] ?? [],
      value: overridden ? reconcile(defaults, stored.get(key)) : defaults,
    };
  });
}

export async function saveContent(key: CmsKey, value: unknown, username: string): Promise<void> {
  await query(
    `INSERT INTO site_content (key, value, updated_by) VALUES ($1, $2::jsonb, $3)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = now()`,
    [key, JSON.stringify(value), username],
  );
}

/** Restaura los defaults: borrar la fila hace que vuelvan a mandar los `constants`. */
export async function resetContent(key: CmsKey): Promise<void> {
  await query('DELETE FROM site_content WHERE key = $1', [key]);
}
