/** Estrutura base da aplicação (topbar, painéis, palco, rodapé). */
import { el, icon } from './controls';

export interface Shell {
  app: HTMLElement;
  tools: HTMLElement;
  history: HTMLElement;
  actions: HTMLElement;
  palette: HTMLElement;
  paletteHead: HTMLElement;
  paletteScroll: HTMLElement;
  canvas: HTMLCanvasElement;
  stage: HTMLElement;
  stageUi: HTMLElement;
  zoomControls: HTMLElement;
  scaleBar: HTMLElement;
  scaleLabel: HTMLElement;
  inspectorScroll: HTMLElement;
  statusbar: HTMLElement;
}

export function buildShell(mount: HTMLElement): Shell {
  const brand = el(
    'div',
    { class: 'brand' },
    el('div', { class: 'brand-mark' }, icon('plan', 17)),
    el('div', { class: 'brand-name' }, el('b', {}, 'casaTopView'), el('span', {}, 'plantas em vista de cima')),
  );

  const tools = el('div', { class: 'tool-group' });
  const history = el('div', { class: 'topbar-actions' });
  const actions = el('div', { class: 'topbar-actions' });

  const topbar = el(
    'header',
    { class: 'topbar' },
    brand,
    el('div', { class: 'topbar-sep' }),
    tools,
    el('div', { class: 'topbar-sep' }),
    history,
    el('div', { class: 'topbar-spacer' }),
    actions,
  );

  const paletteHead = el('div', { class: 'panel-head' });
  const paletteScroll = el('div', { class: 'panel-scroll' });
  const palette = el('aside', { class: 'panel panel-left' }, paletteHead, paletteScroll);

  const canvas = el('canvas', { class: 'plan' }) as HTMLCanvasElement;
  const zoomControls = el('div', { class: 'stage-corner bottom-right' });
  const scaleBar = el('span', { class: 'scale-bar' }, el('i'));
  const scaleLabel = el('span', { class: 'scale-label' }, '1 m');
  const scaleCorner = el(
    'div',
    { class: 'stage-corner bottom-left' },
    scaleBar,
    scaleLabel,
  );
  const stageUi = el('div', { class: 'stage-ui' }, zoomControls, scaleCorner);
  const stage = el('main', { class: 'stage' }, canvas, stageUi);

  const inspectorScroll = el('div', { class: 'panel-scroll' });
  const inspector = el('aside', { class: 'panel panel-right' }, inspectorScroll);

  const statusbar = el('footer', { class: 'statusbar' });

  const app = el(
    'div',
    { class: 'app' },
    topbar,
    el('div', { class: 'workspace' }, palette, stage, inspector),
    statusbar,
  );

  mount.append(app);

  return {
    app,
    tools,
    history,
    actions,
    palette,
    paletteHead,
    paletteScroll,
    canvas,
    stage,
    stageUi,
    zoomControls,
    scaleBar,
    scaleLabel,
    inspectorScroll,
    statusbar,
  };
}
