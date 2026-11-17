/**
 * Torna dist/index.html autocontido: embute o JS e o CSS gerados pelo Vite.
 * Assim o arquivo pode ser aberto com duplo clique (file://), sem servidor.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const indexPath = join(dist, 'index.html');
let html = readFileSync(indexPath, 'utf8');
let scripts = 0;
let styles = 0;

html = html.replace(
  /<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g,
  (_match, src) => {
    const file = join(dist, src.replace(/^\.?\//, ''));
    const code = readFileSync(file, 'utf8').replace(/<\/script/gi, '<\\/script');
    scripts += 1;
    return `<script type="module">\n${code}\n</script>`;
  },
);

html = html.replace(
  /<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"[^>]*>/g,
  (_match, href) => {
    const file = join(dist, href.replace(/^\.?\//, ''));
    const css = readFileSync(file, 'utf8').replace(/<\/style/gi, '<\\/style');
    styles += 1;
    return `<style>\n${css}\n</style>`;
  },
);

if (!scripts) {
  throw new Error('Nenhum script encontrado em dist/index.html — o build do Vite mudou?');
}

writeFileSync(indexPath, html);
console.log(`dist/index.html autocontido: ${scripts} script(s) e ${styles} estilo(s) embutidos.`);
