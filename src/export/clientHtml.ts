/**
 * Exporta a vista 3D como um HTML autocontido para o cliente.
 *
 * O arquivo leva o runtime do visualizador, o CSS e um snapshot da planta.
 * Não abre o editor, não salva nada e não faz requisições externas.
 */
import { css as clientCss, js as clientRuntime } from 'virtual:client-viewer';
import type { Plan } from '../core/document';
import { CLIENT_PLAN_ELEMENT_ID, type ClientViewPayload } from '../client/payload';
import { planFileSlug } from './png';
import { hasPlanContent } from './planContent';

/** Remove o que não é necessário no cliente e exclui itens ocultos. */
export function clientPlanSnapshot(plan: Plan): Plan | null {
  if (!hasPlanContent(plan)) return null;

  const { underlay: _underlay, ...base } = plan;
  return {
    ...base,
    settings: { ...plan.settings },
    walls: plan.walls.map((wall) => ({ ...wall })),
    openings: plan.openings.map((opening) => ({ ...opening })),
    rooms: plan.rooms.map((room) => ({ ...room })),
    items: plan.items.filter((item) => !item.hidden).map((item) => ({ ...item })),
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

/** Impede que um `</script>` dentro dos dados feche o bloco antes da hora. */
function escapeJsonForHtml(json: string): string {
  return json.replace(/</g, '\\u003c');
}

function buildPayload(plan: Plan): ClientViewPayload {
  return {
    version: 1,
    plan,
    createdAt: new Date().toISOString(),
  };
}

export function buildClientHtml(plan: Plan): string | null {
  const snapshot = clientPlanSnapshot(plan);
  if (!snapshot) return null;

  const payload = escapeJsonForHtml(JSON.stringify(buildPayload(snapshot)));
  const title = `${snapshot.name || 'Projeto'} — Visualização 3D`;
  const runtime = clientRuntime.replace(/<\/script/gi, '<\\/script');
  const style = clientCss.replace(/<\/style/gi, '<\\/style');

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta name="color-scheme" content="light" />
    <meta name="theme-color" content="#f2efe8" />
    <meta name="generator" content="casaTopView" />
    <meta name="robots" content="noindex, nofollow" />
    <title>${escapeHtml(title)}</title>
    <link
      rel="icon"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230f766e'/%3E%3Cpath d='M6 10h20v12H6z' fill='none' stroke='%23fff' stroke-width='2.4'/%3E%3Cpath d='M16 10v12M6 18h6' stroke='%23fff' stroke-width='2.4'/%3E%3C/svg%3E"
    />
    <style>
${style}
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script id="${CLIENT_PLAN_ELEMENT_ID}" type="application/json">${payload}</script>
    <noscript>
      <div class="client-invalid">Ative o JavaScript para ver a visualização 3D.</div>
    </noscript>
    <script>
${runtime}
    </script>
  </body>
</html>
`;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Gera e baixa o HTML. Retorna false quando não há nada visível para exportar. */
export function exportPlanClientHtml(plan: Plan): boolean {
  const html = buildClientHtml(plan);
  if (!html) return false;

  downloadBlob(
    new Blob([html], { type: 'text/html;charset=utf-8' }),
    `${planFileSlug(plan.name)}-cliente.html`,
  );
  return true;
}
