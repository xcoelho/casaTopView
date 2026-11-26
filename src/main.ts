/** Ponto de entrada do casaTopView. */
import './styles/tokens.css';
import './styles/layout.css';
import './styles/components.css';

import type { Plan } from './core/document';
import { examplePlan } from './core/document';
import { Store } from './core/store';
import {
  createAutosave,
  currentProjectId,
  getProjectMeta,
  listProjects,
  loadPlan,
  savePlan,
} from './core/persistence';
import { Renderer } from './render/renderer';
import { planThumb } from './render/thumbnail';
import { PointerController } from './interaction/pointer';
import { attachKeyboard } from './interaction/keyboard';
import { zoomAround } from './interaction/camera';
import { buildShell } from './ui/shell';
import { mountToolbar } from './ui/toolbar';
import { mountPalette } from './ui/palette';
import { mountInspector } from './ui/inspector';
import { mountStatusbar } from './ui/statusbar';
import { notify } from './ui/toast';
import { openHelpDialog } from './ui/helpDialog';
import { open3DViewer } from './ui/viewer3d';
import { openProjectsDialog } from './ui/projectsDialog';
import { openUnderlayDialog, scaleUnderlayBetween } from './ui/underlayDialog';
import { openMaterialsDialog } from './ui/materialsDialog';
import { button, el, openModal } from './ui/controls';
import { fmtLength, parseNumber } from './core/units';
import type { Vec2 } from './core/geometry';
import { exportPlanPNG } from './export/png';
import { exportPlanPdf, type PdfMode } from './export/pdf';
import { exportPlanGLB } from './export/glb';
import { exportPlanClientHtml } from './export/clientHtml';
import { downloadPlanJSON, pickPlanJSON } from './export/json';

const mount = document.getElementById('app');
if (!mount) throw new Error('Elemento #app não encontrado');

function initialPlan(): Plan {
  const currentId = currentProjectId();
  if (currentId) {
    const plan = loadPlan(currentId);
    if (plan) return plan;
  }
  const recent = listProjects()[0];
  if (recent) {
    const plan = loadPlan(recent.id);
    if (plan) return plan;
  }
  const example = examplePlan();
  savePlan(example, planThumb(example));
  return example;
}

const shell = buildShell(mount);
const store = new Store(initialPlan());
const renderer = new Renderer(shell.canvas, store);
const pointer = new PointerController(shell.canvas, store, renderer, notify, (a, b) =>
  askCalibrationDistance(a, b),
);

const autosave = createAutosave(650);
let saving = false;

function fitView(): void {
  store.fitView(renderer.width, renderer.height);
  updateScaleBar();
}

function updateScaleBar(): void {
  const zoom = store.view.zoom;
  const options = [0.25, 0.5, 1, 2, 5, 10];
  let meters = options[options.length - 1];
  for (const candidate of options) {
    if (candidate * 100 * zoom >= 62) {
      meters = candidate;
      break;
    }
  }
  const px = meters * 100 * zoom;
  shell.scaleBar.style.width = `${Math.round(Math.min(px, 220))}px`;
  shell.scaleLabel.textContent = meters >= 1 ? `${meters} m` : `${Math.round(meters * 100)} cm`;
}

/** Depois dos dois cliques da calibragem, pede a medida real do trecho. */
function askCalibrationDistance(a: Vec2, b: Vec2): void {
  const current = Math.hypot(b.x - a.x, b.y - a.y);
  const input = el('input', {
    type: 'number',
    min: '1',
    step: '1',
    value: String(Math.round(current * 10) / 10),
  }) as HTMLInputElement;

  const modal = openModal({
    title: 'Calibrar escala',
    subtitle: 'Informe a medida real entre os dois pontos clicados',
    narrow: true,
    body: el(
      'div',
      {},
      el(
        'p',
        { class: 'ud-note' },
        `Distância entre os cliques: ${fmtLength(current)}. Meça esse mesmo trecho na planta real e informe abaixo para a imagem ficar na escala certa.`,
      ),
      el(
        'div',
        { class: 'field', style: { marginTop: '12px' } },
        el('span', { class: 'field-label' }, 'Medida real'),
        el('div', { class: 'input' }, input, el('span', { class: 'unit' }, 'cm')),
      ),
    ),
    footer: el(
      'div',
      { class: 'modal-actions' },
      button({ label: 'Cancelar', variant: 'ghost', onClick: () => modal.close() }),
      button({
        label: 'Aplicar escala',
        icon: 'ruler',
        variant: 'primary',
        onClick: () => {
          const value = parseNumber(input.value, 0);
          if (!(value > 0)) {
            notify('Informe uma medida maior que zero');
            return;
          }
          if (scaleUnderlayBetween(store, a, b, value)) {
            modal.close();
            notify('Escala da imagem ajustada', 'accent');
          } else {
            notify('Não foi possível calibrar — importe uma imagem de fundo primeiro');
          }
        },
      }),
    ),
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') input.blur();
  });
  input.focus();
  input.select();
}

function openPlan(plan: Plan): void {
  store.setDoc(plan, true);
  const thumb = getProjectMeta(plan.id)?.thumb;
  savePlan(plan, thumb);
  requestAnimationFrame(() => fitView());
  notify(`Projeto "${plan.name}" aberto`, 'accent');
}

async function importJson(): Promise<void> {
  const plan = await pickPlanJSON();
  if (!plan) {
    notify('Arquivo JSON inválido ou vazio');
    return;
  }
  savePlan(plan);
  store.setDoc(plan, true);
  requestAnimationFrame(() => fitView());
  notify(`Planta importada: ${plan.name}`, 'accent');
}

let exportingGlb = false;

async function exportGlb(): Promise<void> {
  if (exportingGlb) return;
  exportingGlb = true;
  notify('Gerando modelo 3D…');
  try {
    const ok = await exportPlanGLB(store.doc);
    if (ok) notify('Modelo GLB exportado', 'accent');
    else notify('A planta está vazia — adicione paredes, pisos ou móveis');
  } catch (error) {
    console.error('Falha ao exportar o modelo GLB', error);
    notify('Não foi possível gerar o arquivo GLB');
  } finally {
    exportingGlb = false;
  }
}

let exportingClientHtml = false;

function exportClientHtml(): void {
  if (exportingClientHtml) return;
  exportingClientHtml = true;
  try {
    const ok = exportPlanClientHtml(store.doc);
    if (ok) notify('Visualização para cliente exportada', 'accent');
    else notify('A planta está vazia — adicione paredes, pisos ou móveis');
  } catch (error) {
    console.error('Falha ao gerar a visualização para cliente', error);
    notify('Não foi possível gerar o HTML para o cliente');
  } finally {
    exportingClientHtml = false;
  }
}

function open3D(): void {
  open3DViewer({
    shell,
    store,
    onExportGlb: exportGlb,
    onExportClientHtml: exportClientHtml,
  });
}

function openProjects(): void {
  openProjectsDialog({
    store,
    onOpen: openPlan,
    notify,
    onImportJson: () => {
      void importJson();
    },
  });
}

const toolbar = mountToolbar(shell, {
  store,
  onOpenProjects: openProjects,
  onOpenHelp: openHelpDialog,
  onExportPng: (transparent) => {
    const ok = exportPlanPNG(store.doc, transparent);
    notify(ok ? 'Imagem PNG exportada' : 'A planta está vazia — adicione paredes ou móveis');
  },
  onExportPdf: (mode) => {
    notify('Gerando PDF…');
    // Espera o aviso aparecer antes de montar a cena 3D, que bloqueia a thread.
    window.setTimeout(() => {
      const ok = exportPlanPdf(store.doc, mode);
      if (ok) notify('PDF exportado', 'accent');
      else notify('Não foi possível gerar o PDF — verifique a planta e o suporte a WebGL');
    }, 40);
  },
  onExportGlb: () => {
    void exportGlb();
  },
  onExportClientHtml: exportClientHtml,
  onExportJson: () => {
    downloadPlanJSON(store.doc);
    notify('Planta salva em JSON');
  },
  onImportJson: () => {
    void importJson();
  },
  onOpen3D: open3D,
  onOpenUnderlay: () =>
    openUnderlayDialog({
      store,
      notify,
      getViewSize: () => ({ width: renderer.width, height: renderer.height }),
      onCalibrate: () => {
        store.setTool('calibrate');
        notify('Clique nos dois pontos da imagem cuja distância real você conhece');
      },
    }),
  onOpenMaterials: () => openMaterialsDialog({ store, notify }),
  onFit: fitView,
  onZoom: (factor) => zoomAround(shell.canvas, store, factor),
});

mountPalette(shell, { store, canvas: shell.canvas, renderer, notify });

mountInspector(shell, { store, notify, onFit: fitView });

const statusbar = mountStatusbar(shell, {
  store,
  isSaving: () => saving,
  onFit: fitView,
});

attachKeyboard(store, {
  cancel: () => pointer.cancel(),
  finish: () => pointer.finishTool(),
  fitView,
  zoomBy: (factor) => zoomAround(shell.canvas, store, factor),
  openHelp: openHelpDialog,
  openProjects,
  exportJson: () => {
    downloadPlanJSON(store.doc);
    notify('Planta salva em JSON');
  },
  importJson: () => {
    void importJson();
  },
  open3D,
});

function syncUi(): void {
  toolbar.update();
  statusbar.update();
  updateScaleBar();
  const title = `${store.doc.name} — casaTopView`;
  if (document.title !== title) document.title = title;
}

// Mudanças transitórias (câmera, hover, ferramenta, seleção) só atualizam a interface.
store.viewChanged.on(syncUi);

// Somente alterações reais do documento disparam autosave.
store.changed.on(() => {
  syncUi();
  saving = true;
  statusbar.update();
  autosave.schedule(
    () => store.doc,
    () => planThumb(store.doc),
  );
});

window.setInterval(() => {
  if (!saving) return;
  if (autosave.isPending) return;
  saving = false;
  statusbar.update();
}, 500);

window.addEventListener('beforeunload', () => {
  savePlan(store.doc);
});

requestAnimationFrame(() => {
  fitView();
  toolbar.update();
  statusbar.update();
  document.title = `${store.doc.name} — casaTopView`;
});
