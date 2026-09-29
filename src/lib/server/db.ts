import pg from 'pg';
import { DATABASE_URL } from 'astro:env/server';

let pool: pg.Pool | undefined;

/** Sin DATABASE_URL el sitio sigue funcionando con los `constants`. */
export const isDbConfigured = (): boolean => Boolean(DATABASE_URL);

export const query = <Row extends pg.QueryResultRow>(text: string, params?: unknown[]) => {
  if (!DATABASE_URL) throw new Error('DATABASE_URL no está configurada.');
  pool ??= new pg.Pool({ connectionString: DATABASE_URL });
  return pool.query<Row>(text, params);
};
