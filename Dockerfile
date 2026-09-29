# syntax=docker/dockerfile:1
# Node 22 reciente: scripts/db-setup.mjs importa un .ts (type stripping nativo, 22.18+).
FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
# Lo mínimo para preparar la base al arrancar (db.sql + script + hashing).
COPY db.sql ./
COPY scripts ./scripts
COPY src/lib/server/password.ts ./src/lib/server/password.ts
COPY src/constants/management/projects.ts ./src/constants/management/projects.ts

EXPOSE 4321
# La preparación es idempotente: crea tablas/admin si faltan y luego levanta el sitio.
CMD ["sh", "-c", "node scripts/db-setup.mjs && node dist/server/entry.mjs"]
