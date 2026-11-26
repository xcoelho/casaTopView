/**
 * Visualizador exportado para o cliente: mesma cena da Vista 3D, mas sem
 * seleção, arraste, inspetor ou qualquer ação de edição.
 */
import { normalizePlan } from '../core/document';
import { button, el, icon } from '../ui/controls';
import { createView3D, type View3DHandle } from '../view3d/viewer';
import { CLIENT_PLAN_ELEMENT_ID, type ClientViewPayload } from './payload';

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('pt-BR');
}

function readPayload(): ClientViewPayload | null {
  const node = document.getElementById(CLIENT_PLAN_ELEMENT_ID);
  if (!node) return null;
  try {
    const parsed = JSON.parse(node.textContent || '{}') as Partial<ClientViewPayload>;
    if (!parsed.plan || typeof parsed.plan !== 'object') return null;
    return {
      version: 1,
      plan: normalizePlan(parsed.plan),
      createdAt: typeof parsed.createdAt === 'string' ? parsed.createdAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function showError(loading: HTMLElement, message: string): void {
  loading.classList.add('client-error');
  loading.replaceChildren(
    el('div', { class: 'client-error-mark' }, '!'),
    el('p', {}, message),
  );
}

function boot(): void {
  const app = document.getElementById('app') ?? document.body;
  const payload = readPayload();
  if (!payload) {
    app.innerHTML =
      '<div class="client-invalid">Não foi possível ler os dados desta visualização.</div>';
    return;
  }

  const plan = payload.plan;
  const projectName = plan.name || 'Visualização 3D';
  document.title = `${projectName} — Visualização 3D`;

  const host = el('div', { class: 'viewer3d-canvas-host' });
  const loading = el(
    'div',
    { class: 'client-loading' },
    el('div', { class: 'client-spinner' }),
    el('p', {}, 'Montando a vista 3D…'),
  );

  let view: View3DHandle | null = null;
  let wallsOn = true;
  let qualityOn = false;

  const wallsButton = button({
    label: 'Paredes',
    icon: 'wall',
    title: 'Mostrar ou ocultar paredes',
    disabled: true,
  });
  wallsButton.setAttribute('aria-pressed', 'true');
  wallsButton.addEventListener('click', () => {
    wallsOn = !wallsOn;
    wallsButton.classList.toggle('active', wallsOn);
    wallsButton.setAttribute('aria-pressed', String(wallsOn));
    view?.setWalls(wallsOn);
  });

  const fitButton = button({
    label: 'Enquadrar',
    icon: 'fit',
    title: 'Enquadrar o projeto inteiro na tela',
    disabled: true,
    onClick: () => view?.fit(),
  });

  const qualityButton = button({
    label: 'Alta qualidade',
    icon: 'sparkles',
    title: 'Liga oclusão de ambiente, sombras suaves e anti-aliasing (mais pesado)',
    disabled: true,
  });
  qualityButton.setAttribute('aria-pressed', 'false');
  qualityButton.addEventListener('click', () => {
    qualityOn = !qualityOn;
    // O visualizador cai para render direto se a GPU não suportar o pós-processamento.
    const active = view?.setHighQuality(qualityOn) ?? qualityOn;
    qualityOn = active;
    qualityButton.classList.toggle('active', active);
    qualityButton.setAttribute('aria-pressed', String(active));
  });

  const canFullscreen =
    document.fullscreenEnabled &&
    typeof document.exitFullscreen === 'function' &&
    typeof document.documentElement.requestFullscreen === 'function';
  const fullscreenButton = canFullscreen
    ? button({
        label: 'Tela cheia',
        icon: 'expand',
        title: 'Entrar ou sair da tela cheia',
      })
    : null;
  fullscreenButton?.setAttribute('aria-pressed', 'false');

  const dateLabel = formatDate(payload.createdAt);
  const title = el(
    'div',
    { class: 'viewer3d-title' },
    icon('cube', 18),
    el(
      'div',
      {},
      el('b', { title: projectName }, projectName),
      el('span', {}, dateLabel ? `Visualização 3D · ${dateLabel}` : 'Visualização 3D'),
    ),
  );

  const actions = el(
    'div',
    { class: 'viewer3d-actions' },
    wallsButton,
    fitButton,
    qualityButton,
    ...(fullscreenButton ? [fullscreenButton] : []),
  );

  const touch = window.matchMedia('(pointer: coarse)').matches;
  const hint = el(
    'div',
    { class: 'viewer3d-hint' },
    touch
      ? 'Arraste para girar · Pinça para zoom · Dois dedos para mover'
      : 'Arraste para girar · Rolagem para zoom · Botão direito para mover',
  );

  const root = el(
    'div',
    { class: 'viewer3d client-viewer' },
    host,
    el('div', { class: 'viewer3d-head' }, title, actions),
    hint,
    loading,
  );
  app.append(root);

  async function toggleFullscreen(): Promise<void> {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await root.requestFullscreen();
    } catch (error) {
      console.warn('Não foi possível alternar a tela cheia', error);
    }
  }

  fullscreenButton?.addEventListener('click', () => {
    void toggleFullscreen();
  });
  document.addEventListener('fullscreenchange', () => {
    const active = document.fullscreenElement === root;
    fullscreenButton?.classList.toggle('active', active);
    fullscreenButton?.setAttribute('aria-pressed', String(active));
  });

  // Deixa o aviso de carregamento aparecer antes de montar a cena, que bloqueia a thread.
  requestAnimationFrame(() => {
    try {
      view = createView3D(host, plan, null);
      wallsButton.disabled = false;
      fitButton.disabled = false;
      qualityButton.disabled = false;
      wallsButton.classList.add('active');
      loading.classList.add('client-loading-done');
      window.setTimeout(() => loading.remove(), 450);
    } catch (error) {
      console.error('WebGL indisponível na visualização do cliente', error);
      showError(
        loading,
        'Não foi possível iniciar a visualização 3D. Atualize o navegador ou verifique se a aceleração de hardware está ativa.',
      );
    }
  });

  window.addEventListener('pagehide', (event) => {
    // Eventos vindos do bfcache (voltar/avançar) não destroem a cena.
    if (event.persisted) return;
    view?.dispose();
    view = null;
  });
}

boot();
