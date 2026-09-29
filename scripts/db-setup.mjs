/**
 * Crea la base de datos en PostgreSQL de forma automática (idempotente):
 *   1. Crea la base indicada en DATABASE_URL si todavía no existe.
 *   2. Ejecuta db.sql (tablas e índices).
 *   3. Siembra las obras de los constants si la tabla `works` está vacía.
 *   4. Crea/actualiza el administrador con ADMIN_USERNAME y ADMIN_PASSWORD.
 *   5. Imprime la URL secreta del panel (/admin/<ADMIN_SECRET_CODE>).
 *
 * Uso:  npm run db:setup      (lee las variables de .env)
 * No requiere `psql`: solo Node y un PostgreSQL accesible.
 */
import { readFile } from 'node:fs/promises';
import pg from 'pg';
import { OBRAS_GESTION } from '../src/constants/management/projects.ts';
import { hashPassword } from '../src/lib/server/password.ts';

const { DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SECRET_CODE, SITE_URL = 'http://localhost:4321' } = process.env;

const fail = (message) => {
  console.error(`✖ ${message}`);
  process.exit(1);
};

if (!DATABASE_URL) fail('Falta DATABASE_URL (revisa tu .env, ver .env.example).');

const target = new URL(DATABASE_URL);
const databaseName = decodeURIComponent(target.pathname.slice(1));

if (!/^[A-Za-z0-9_]+$/.test(databaseName)) {
  fail(`Nombre de base inválido: "${databaseName}" (solo letras, números y guion bajo).`);
}

/** Abre una conexión, ejecuta `work` y la cierra siempre. */
const withClient = async (connectionString, work) => {
  const client = new pg.Client({ connectionString });
  await client.connect();
  try {
    return await work(client);
  } finally {
    await client.end();
  }
};

/**
 * Crea la base siempre en UTF-8: en Windows PostgreSQL usa WIN1252 por defecto y
 * rechazaría el texto Unicode del contenido. Algunos locales del sistema no son
 * compatibles con UTF-8, en cuyo caso se reintenta con collation "C".
 */
const createUtf8Database = async (client) => {
  const base = `CREATE DATABASE "${databaseName}" TEMPLATE template0 ENCODING 'UTF8'`;
  try {
    await client.query(base);
  } catch {
    await client.query(`${base} LC_COLLATE 'C' LC_CTYPE 'C'`);
  }
};

const ensureDatabase = async () => {
  const maintenance = new URL(DATABASE_URL);
  maintenance.pathname = '/postgres';

  await withClient(maintenance.toString(), async (client) => {
    const { rows } = await client.query(
      'SELECT pg_encoding_to_char(encoding) AS encoding FROM pg_database WHERE datname = $1',
      [databaseName],
    );

    if (!rows.length) {
      // El nombre está validado arriba; CREATE DATABASE no admite parámetros.
      await createUtf8Database(client);
      console.log(`✔ Base "${databaseName}" creada (UTF8).`);
    } else if (rows[0].encoding !== 'UTF8') {
      console.warn(`! La base "${databaseName}" usa ${rows[0].encoding}, no UTF8: el contenido con Unicode podría fallar.`);
    } else {
      console.log(`• La base "${databaseName}" ya existe.`);
    }
  });
};

const applySchema = async (client) => {
  await client.query(await readFile(new URL('../db.sql', import.meta.url), 'utf8'));
  console.log('✔ Esquema aplicado (db.sql).');
};

/** Siembra las obras de los constants solo si la tabla esta vacia (nunca pisa lo editado). */
const seedWorks = async (client) => {
  const { rows } = await client.query('SELECT count(*)::int AS total FROM works');
  if (rows[0].total > 0) return;

  for (const [index, obra] of OBRAS_GESTION.entries()) {
    await client.query(
      `INSERT INTO works (category, title, description, status, area, cover, gallery, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        obra.categoria,
        obra.titulo,
        obra.descripcion,
        obra.estado ?? null,
        obra.area ?? null,
        JSON.stringify(obra.portada),
        JSON.stringify(obra.imagenes ?? []),
        index,
      ],
    );
  }
  console.log(`✔ ${OBRAS_GESTION.length} obras iniciales sembradas desde los constants.`);
};

const upsertAdmin = async (client) => {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.log('• ADMIN_USERNAME / ADMIN_PASSWORD no definidos: no se crea administrador.');
    return;
  }

  await client.query(
    `INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [ADMIN_USERNAME.trim().toLowerCase(), await hashPassword(ADMIN_PASSWORD)],
  );
  console.log(`✔ Administrador "${ADMIN_USERNAME}" listo.`);
};

try {
  await ensureDatabase();
  await withClient(DATABASE_URL, async (client) => {
    await applySchema(client);
    await seedWorks(client);
    await upsertAdmin(client);
  });
  console.log('Listo.');
  if (ADMIN_SECRET_CODE) {
    console.log(`\nPanel de administración: ${SITE_URL}/admin/${ADMIN_SECRET_CODE}`);
  }
} catch (error) {
  fail(`No se pudo preparar la base de datos: ${error.message}`);
}
