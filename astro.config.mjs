// @ts-check
import { defineConfig, envField } from 'astro/config';

import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // SSR: el contenido sale de la base de datos y el panel /admin necesita sesión.
  output: 'server',
  adapter: node({ mode: 'standalone' }),

  // Ambas son opcionales a propósito: sin DATABASE_URL el sitio funciona solo
  // con los constants, y sin ADMIN_SECRET_CODE o JWT_SECRET el panel queda deshabilitado.
  env: {
    schema: {
      DATABASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      ADMIN_SECRET_CODE: envField.string({ context: 'server', access: 'secret', optional: true }),
      JWT_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'manfredreyesvilla.netlify.app',
        pathname: '/_astro/**'
      }
    ]
  },
  vite: {
    plugins: [tailwindcss()],
    // Solo afecta a `astro dev`: deja entrar por el link de tunnelmole. El build y
    // el servidor de producción no usan esta opción.
    server: { allowedHosts: ['.tunnelmole.net'] },
  },

  integrations: [react()]
});
