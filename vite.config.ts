// Use a same-origin endpoint to avoid browser CORS restrictions on government data.
import { economicHandler } from './server/economic-data';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // Mount the production data handler during development and preview.
    plugins: [react(), tailwindcss(), { name: 'official-economic-data',
      configureServer(server) { server.middlewares.use('/api/economic-params', economicHandler); },
      configurePreviewServer(server) { server.middlewares.use('/api/economic-params', economicHandler); }
    }],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
