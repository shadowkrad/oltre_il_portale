import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  build: { format: 'directory' },
  // Solo sviluppo: inoltra /api al servizio "Il muro scrive" avviato in locale (api/server.js, porta 3055).
  vite: { server: { proxy: { '/api': 'http://127.0.0.1:3055' } } },
});
