import { defineConfig } from 'vite';

export default defineConfig({
  // Относительные пути, чтобы сборка открывалась и с GitHub Pages, и из подпапки
  base: './',
  css: {
    devSourcemap: true,
  },
  build: {
    assetsInlineLimit: 0,
  },
});
