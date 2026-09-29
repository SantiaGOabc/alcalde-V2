import { CATEGORIAS_GESTION, ESTADOS_GESTION, OBRAS_GESTION, type Obra } from '@constant';
import type { Paginated, Work, WorkImage, WorkInput } from '@/lib';
import { isDbConfigured, query } from './db';
import { containsPattern } from './pagination';

interface WorkRow {
  id: string;
  category: string;
  title: string;
  description: string;
  status: string | null;
  area: string | null;
  cover: WorkImage;
  gallery: WorkImage[];
  is_published: boolean;
}

const rowToWork = (row: WorkRow): Work => ({
  id: Number(row.id),
  categoria: row.category,
  titulo: row.title,
  descripcion: row.description,
  estado: row.status ?? undefined,
  area: row.area ?? undefined,
  portada: row.cover,
  imagenes: row.gallery,
  publicada: row.is_published,
});

/** Forma que consume la página pública (la misma que `OBRAS_GESTION`). */
const workToObra = ({ categoria, titulo, descripcion, estado, area, portada, imagenes }: Work): Obra => ({
  categoria,
  titulo,
  descripcion,
  estado,
  area,
  portada,
  imagenes,
});

/**
 * Obras que ve el visitante: las publicadas en la base de datos, o las de los
 * `constants` si no hay base o ésta falla (nunca se cae la página).
 */
export async function getPublishedWorks(): Promise<Obra[]> {
  if (!isDbConfigured()) return OBRAS_GESTION;

  try {
    const { rows } = await query<WorkRow>(
      'SELECT * FROM works WHERE is_published ORDER BY sort_order, id',
    );
    return rows.map((row) => workToObra(rowToWork(row)));
  } catch (error) {
    console.warn('[works] No se pudieron leer las obras, se usan los valores por defecto.', error);
    return OBRAS_GESTION;
  }
}

export interface WorkSearch {
  page: number;
  pageSize: number;
  category: string | null;
  search: string | null;
}

/**
 * Búsqueda paginada para el panel (publicadas y borradores). El filtrado y el
 * recorte se hacen en SQL: la lista puede crecer sin cargar todas las obras.
 */
export async function searchWorks({ page, pageSize, category, search }: WorkSearch): Promise<Paginated<Work>> {
  const filters = `WHERE ($1::text IS NULL OR category = $1)
    AND ($2::text IS NULL OR title ILIKE $2)`;
  const params = [category, search ? containsPattern(search) : null];

  const [count, rows] = await Promise.all([
    query<{ total: string }>(`SELECT count(*) AS total FROM works ${filters}`, params),
    query<WorkRow>(`SELECT * FROM works ${filters} ORDER BY sort_order, id LIMIT $3 OFFSET $4`, [
      ...params,
      pageSize,
      (page - 1) * pageSize,
    ]),
  ]);

  return { items: rows.rows.map(rowToWork), total: Number(count.rows[0].total), page, pageSize };
}

const columns = (input: WorkInput) => [
  input.categoria,
  input.titulo,
  input.descripcion,
  input.estado || null,
  input.area || null,
  JSON.stringify(input.portada),
  JSON.stringify(input.imagenes),
  input.publicada,
];

export async function createWork(input: WorkInput): Promise<Work> {
  const { rows } = await query<WorkRow>(
    `INSERT INTO works (category, title, description, status, area, cover, gallery, is_published, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM works))
     RETURNING *`,
    columns(input),
  );
  return rowToWork(rows[0]);
}

export async function updateWork(id: number, input: WorkInput): Promise<Work | null> {
  const { rows } = await query<WorkRow>(
    `UPDATE works SET category = $1, title = $2, description = $3, status = $4, area = $5,
       cover = $6::jsonb, gallery = $7::jsonb, is_published = $8, updated_at = now()
     WHERE id = $9 RETURNING *`,
    [...columns(input), id],
  );
  return rows[0] ? rowToWork(rows[0]) : null;
}

export async function setWorkPublished(id: number, isPublished: boolean): Promise<boolean> {
  const { rowCount } = await query('UPDATE works SET is_published = $2, updated_at = now() WHERE id = $1', [
    id,
    isPublished,
  ]);
  return Boolean(rowCount);
}

export async function deleteWork(id: number): Promise<boolean> {
  const { rowCount } = await query('DELETE FROM works WHERE id = $1', [id]);
  return Boolean(rowCount);
}

/* ── Validación de lo que llega del panel ─────────────────────────────── */

const MAX = { title: 200, description: 4000, area: 120, alt: 300, gallery: 40 } as const;

const text = (value: unknown, max: number): string | null =>
  typeof value === 'string' && value.trim().length <= max ? value.trim() : null;

/** Solo URLs http(s) o imágenes propias subidas al panel (`/media/<id>`). */
const isAllowedSource = (src: string): boolean => /^https?:\/\/\S+$/.test(src) || /^\/media\/\d+$/.test(src);

const parseImage = (input: unknown): WorkImage | null => {
  if (typeof input !== 'object' || input === null) return null;
  const { tipo, src, alt, encuadre, poster } = input as Record<string, unknown>;

  const cleanSrc = text(src, 2000);
  const cleanAlt = text(alt ?? '', MAX.alt);
  if (!cleanSrc || !isAllowedSource(cleanSrc) || cleanAlt === null) return null;
  if (tipo !== undefined && tipo !== 'foto' && tipo !== 'video') return null;

  const cleanPoster = typeof poster === 'string' && poster ? text(poster, 2000) : undefined;
  if (cleanPoster && !isAllowedSource(cleanPoster)) return null;

  return {
    tipo,
    src: cleanSrc,
    alt: cleanAlt,
    ...(encuadre ? { encuadre: encuadre as WorkImage['encuadre'] } : {}),
    ...(cleanPoster ? { poster: cleanPoster } : {}),
  };
};

/** Valida y normaliza el cuerpo de crear/editar. `null` = inválido. */
export function parseWorkInput(input: unknown): WorkInput | null {
  if (typeof input !== 'object' || input === null) return null;
  const { categoria, titulo, descripcion, estado, area, portada, imagenes, publicada } = input as Record<string, unknown>;

  const cleanTitle = text(titulo, MAX.title);
  const cleanDescription = text(descripcion, MAX.description);
  const cleanArea = text(area ?? '', MAX.area);
  const cleanCover = parseImage(portada);

  if (!cleanTitle || cleanDescription === null || cleanArea === null || !cleanCover) return null;
  if (typeof categoria !== 'string' || !CATEGORIAS_GESTION.includes(categoria)) return null;
  if (estado && (typeof estado !== 'string' || !(estado in ESTADOS_GESTION))) return null;
  if (typeof publicada !== 'boolean') return null;
  if (!Array.isArray(imagenes) || imagenes.length > MAX.gallery) return null;

  const gallery = imagenes.map(parseImage);
  if (gallery.some((image) => image === null)) return null;

  return {
    categoria,
    titulo: cleanTitle,
    descripcion: cleanDescription,
    estado: estado ? String(estado) : undefined,
    area: cleanArea || undefined,
    portada: cleanCover,
    imagenes: gallery as WorkImage[],
    publicada,
  };
}
