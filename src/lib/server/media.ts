import { query } from './db';

export const MAX_MEDIA_BYTES = 5 * 1024 * 1024;

/** Tipos admitidos y su firma (magic bytes): no se confía solo en el `Content-Type` del cliente. */
const SIGNATURES: Record<string, (bytes: Uint8Array) => boolean> = {
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/png': (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  'image/gif': (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46,
  'image/webp': (b) => b[0] === 0x52 && b[1] === 0x49 && b[8] === 0x57 && b[9] === 0x45,
};

export type MediaError = 'missing' | 'type' | 'size';

/** Guarda una imagen validada y devuelve su URL pública, o el motivo del rechazo. */
export async function saveImage(file: unknown): Promise<{ url: string } | { error: MediaError }> {
  if (!(file instanceof File) || file.size === 0) return { error: 'missing' };
  if (file.size > MAX_MEDIA_BYTES) return { error: 'size' };

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!SIGNATURES[file.type]?.(bytes)) return { error: 'type' };

  const { rows } = await query<{ id: string }>(
    'INSERT INTO media (mime_type, file_name, data) VALUES ($1, $2, $3) RETURNING id',
    [file.type, file.name.slice(0, 200), Buffer.from(bytes)],
  );
  return { url: `/media/${rows[0].id}` };
}

export async function getStoredImage(id: number): Promise<{ mimeType: string; data: Buffer } | null> {
  const { rows } = await query<{ mime_type: string; data: Buffer }>(
    'SELECT mime_type, data FROM media WHERE id = $1',
    [id],
  );
  return rows[0] ? { mimeType: rows[0].mime_type, data: rows[0].data } : null;
}
