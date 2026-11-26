/* Build separado do visualizador enviado ao cliente (sem o editor). */
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  logLevel: 'warn',
  build: {
    outDir: '.cache/client',
    emptyOutDir: true,
    target: 'es2022',
    minify: 'esbuild',
    cssCodeSplit: false,
    lib: {
      entry: 'src/client/main.ts',
      formats: ['iife'],
      name: 'CasaTopViewClient',
      fileName: () => 'client.js',
    },
  },
});
