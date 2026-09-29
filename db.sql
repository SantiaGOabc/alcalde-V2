-- ============================================================================
--  Base de datos del sitio del alcalde (PostgreSQL 14+)
--
--  Es idempotente: se puede ejecutar cuantas veces haga falta.
--  No incluye CREATE DATABASE ni el usuario administrador: de eso se encarga
--  `npm run db:setup` (scripts/db-setup.mjs), que además ejecuta este archivo.
--
--  Contenido del sitio: los `src/constants` son los DATOS POR DEFECTO. Una fila
--  en `site_content` SOBRESCRIBE la sección con esa clave; borrarla restaura el
--  contenido por defecto. Las claves válidas están en src/cms/sections.ts.
-- ============================================================================

-- Contenido editable (CMS)
CREATE TABLE IF NOT EXISTS site_content (
    key         TEXT        PRIMARY KEY,               -- p. ej. 'home.hero'
    value       JSONB       NOT NULL,                  -- misma forma que el default
    updated_by  TEXT,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Administradores del panel
CREATE TABLE IF NOT EXISTS admin_users (
    id             BIGSERIAL   PRIMARY KEY,
    username       TEXT        NOT NULL UNIQUE,
    password_hash  TEXT        NOT NULL,               -- scrypt$<salt>$<hash>
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Solo se guarda el hash SHA-256 del token: una fuga de la tabla no da sesiones.
CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash  TEXT        PRIMARY KEY,
    user_id     BIGINT      NOT NULL REFERENCES admin_users (id) ON DELETE CASCADE,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx ON admin_sessions (expires_at);

-- Buzón ciudadano
CREATE TABLE IF NOT EXISTS mailbox_messages (
    id          BIGSERIAL   PRIMARY KEY,
    full_name   TEXT        NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 120),
    email       TEXT        NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
    type        TEXT        NOT NULL CHECK (type IN ('sugerencia', 'felicitacion')),
    message     TEXT        NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
    is_read     BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mailbox_messages_created_at_idx ON mailbox_messages (created_at DESC);

-- Obras de la pagina de Gestion. Los `src/constants/management/projects.ts` son
-- los datos por defecto: `npm run db:setup` los siembra si esta tabla esta vacia.
-- `cover` y `gallery` guardan las imagenes ({ tipo, src, alt, encuadre, poster }).
CREATE TABLE IF NOT EXISTS works (
    id            BIGSERIAL   PRIMARY KEY,
    category      TEXT        NOT NULL,
    title         TEXT        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
    description   TEXT        NOT NULL CHECK (char_length(description) <= 4000),
    status        TEXT,
    area          TEXT,
    cover         JSONB       NOT NULL,
    gallery       JSONB       NOT NULL DEFAULT '[]'::jsonb,
    is_published  BOOLEAN     NOT NULL DEFAULT TRUE,
    sort_order    INTEGER     NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS works_published_order_idx ON works (is_published, sort_order, id);

-- Imagenes subidas desde el panel (se sirven en /media/<id>).
CREATE TABLE IF NOT EXISTS media (
    id          BIGSERIAL   PRIMARY KEY,
    mime_type   TEXT        NOT NULL,
    file_name   TEXT,
    data        BYTEA       NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
