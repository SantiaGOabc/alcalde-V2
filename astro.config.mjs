// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
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
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});