import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// TV touch vertical (9:16) instalada como PWA en un stand. La app es 100%
// estática, así que Workbox precachea todo (fuentes incluidas) y funciona sin
// red, que es el requisito real del evento.
export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'fonts/lato-400.woff2',
        'fonts/lato-700.woff2',
        'fonts/lato-900.woff2',
        'brand/logo.svg',
        'brand/iso.svg',
        'brand/icon-white.svg',
      ],
      manifest: {
        name: 'Leasing Argentina — Trivia',
        short_name: 'Trivia Leasing',
        description: 'Trivia de 3 preguntas sobre leasing — Leasing Argentina.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'fullscreen',
        display_override: ['fullscreen'],
        orientation: 'portrait',
        background_color: '#005C9C',
        theme_color: '#005C9C',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      },
      devOptions: {
        // Desactivado en dev: el service worker precachea assets y sirve
        // versiones viejas al iterar. La PWA funciona en la build de producción.
        enabled: false,
        type: 'module',
      },
    }),
  ],
});
