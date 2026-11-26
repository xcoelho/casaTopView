import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

const CLIENT_VIEWER_ID = 'virtual:client-viewer';
const CLIENT_VIEWER_RESOLVED = '\0' + CLIENT_VIEWER_ID;
const CLIENT_CSS_FILES = [
  'src/styles/tokens.css',
  'src/styles/layout.css',
  'src/styles/components.css',
  'src/client/client.css',
];

/** Expõe ao editor o runtime já compilado do visualizador do cliente. */
function clientViewerAssets(): Plugin {
  return {
    name: 'client-viewer-assets',
    resolveId(id) {
      if (id === CLIENT_VIEWER_ID) return CLIENT_VIEWER_RESOLVED;
      return null;
    },
    load(id) {
      if (id !== CLIENT_VIEWER_RESOLVED) return null;

      const root = process.cwd();
      const jsPath = join(root, '.cache/client/client.js');
      const cssPaths = CLIENT_CSS_FILES.map((file) => join(root, file));

      for (const file of [jsPath, ...cssPaths]) this.addWatchFile(file);

      let js: string;
      try {
        js = readFileSync(jsPath, 'utf8');
      } catch {
        throw new Error(
          'Runtime do cliente não encontrado. Rode "npm run build:client" antes de iniciar o Vite.',
        );
      }
      const css = cssPaths.map((file) => readFileSync(file, 'utf8')).join('\n');

      return `export const js = ${JSON.stringify(js)};\nexport const css = ${JSON.stringify(css)};`;
    },
  };
}

/* Configuração do Vite — imports apenas de Node e do próprio Vite. */
export default {
  plugins: [clientViewerAssets()],
  server: { port: 5173, strictPort: true, watch: { ignored: ['**/*.rar'] } },
  build: { target: 'es2022', outDir: 'dist' },
};
