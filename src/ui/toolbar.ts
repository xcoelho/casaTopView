/** Barra superior: ferramentas, histórico, projeto e exportação. */
import type { Store, ToolId } from '../core/store';
import type { Shell } from './shell';
import { button, el, icon } from './controls';
import { openMenu } from './exportMenu';
import type { PdfMode } from '../export/pdf';

export interface ToolbarDeps {
  store: Store;
  onOpenProjects: () => void;
  onOpenHelp: () => void;
  onExportPng: (transparent: boolean) => void;
  onExportPdf: (mode: PdfMode) => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onOpen3D: () => void;
  onOpenUnderlay: () => void;
  onOpenMaterials: () => void;
  onFit: () => void;
  onZoom: (factor: number) => void;
}

export interface ToolbarHandle {
  update: () => void;
}

const TOOLS: { id: ToolId; label: string; icon: string; key: string }[] = [
  { id: 'select', label: 'Selecionar', icon: 'select', key: 'V' },
  { id: 'wall', label: 'Parede', icon: 'wall', key: 'P' },
  { id: 'room', label: 'Cômodo', icon: 'room', key: 'C' },
  { id: 'door', label: 'Porta', icon: 'door', key: 'T' },
  { id: 'window', label: 'Janela', icon: 'window', key: 'J' },
  { id: 'measure', label: 'Medir', icon: 'ruler', key: 'M' },
];

export function mountToolbar(shell: Shell, deps: ToolbarDeps): ToolbarHandle {
  const { store } = deps;
  const toolButtons = new Map<ToolId, HTMLButtonElement>();

  for (const tool of TOOLS) {
    const btn = button({
      label: tool.label,
      icon: tool.icon,
      variant: 'tool',
      title: `${tool.label} (${tool.key})`,
      onClick: () => store.setTool(tool.id),
    });
    toolButtons.set(tool.id, btn);
    shell.tools.append(btn);
  }

  const undo = button({
    icon: 'undo',
    variant: 'ghost icon',
    title: 'Desfazer (Ctrl+Z)',
    onClick: () => store.undo(),
  });
  const redo = button({
    icon: 'redo',
    variant: 'ghost icon',
    title: 'Refazer (Ctrl+Shift+Z)',
    onClick: () => store.redo(),
  });
  shell.history.append(undo, redo);

  const projectName = el('b', {});
  const projectChip = el(
    'button',
    { class: 'project-chip', type: 'button', onClick: deps.onOpenProjects, title: 'Meus projetos (Ctrl+O)' },
    icon('folder', 16),
    projectName,
    icon('chevron', 14),
  );

  let exportBtn: HTMLButtonElement;
  exportBtn = button({
    label: 'Exportar',
    icon: 'download',
    title: 'Exportar imagem ou arquivo',
    onClick: () => {
      openMenu(
        exportBtn,
        [
          { label: 'PDF · planta 2D + vista 3D', icon: 'file', onClick: () => deps.onExportPdf('both') },
          { label: 'PDF · só a planta 2D', icon: 'image', onClick: () => deps.onExportPdf('plan') },
          { label: 'PDF · só a vista 3D', icon: 'cube', onClick: () => deps.onExportPdf('view3d') },
          { label: 'Imagem PNG', icon: 'image', separatorBefore: true, onClick: () => deps.onExportPng(false) },
          { label: 'PNG com fundo transparente', icon: 'image', onClick: () => deps.onExportPng(true) },
          {
            label: 'Imagem de fundo…',
            icon: 'image',
            separatorBefore: true,
            onClick: deps.onOpenUnderlay,
          },
          { label: 'Salvar planta em JSON', icon: 'file', separatorBefore: true, onClick: deps.onExportJson },
          { label: 'Importar planta em JSON', icon: 'upload', onClick: deps.onImportJson },
        ],
        'Exportar planta',
      );
    },
  });

  // Em telas estreitas os painéis viram gavetas (classes show-*); em telas largas
  // continuam no grid (classes no-*). Mantém os dois modos sincronizados.
  function togglePanel(side: 'left' | 'right'): void {
    const app = shell.app;
    const narrow =
      side === 'left'
        ? window.matchMedia('(max-width: 720px)').matches
        : window.matchMedia('(max-width: 950px)').matches;
    const noClass = side === 'left' ? 'no-left' : 'no-right';
    const showClass = side === 'left' ? 'show-left' : 'show-right';
    if (narrow) {
      app.classList.remove(noClass);
      app.classList.toggle(showClass);
    } else {
      app.classList.remove(showClass);
      app.classList.toggle(noClass);
    }
  }

  const panelLeft = button({
    icon: 'panelLeft',
    variant: 'ghost icon',
    title: 'Mostrar/ocultar catálogo',
    onClick: () => togglePanel('left'),
  });
  const panelRight = button({
    icon: 'panelRight',
    variant: 'ghost icon',
    title: 'Mostrar/ocultar inspetor',
    onClick: () => togglePanel('right'),
  });
  const help = button({
    icon: 'help',
    variant: 'ghost icon',
    title: 'Ajuda e atalhos (?)',
    onClick: deps.onOpenHelp,
  });

  const threeD = button({
    label: '3D',
    icon: 'cube',
    title: 'Ver a planta em 3D (3)',
    onClick: deps.onOpen3D,
  });

  const materials = button({
    label: 'Materiais',
    icon: 'layers',
    title: 'Quantitativos: áreas, paredes, aberturas e móveis',
    onClick: deps.onOpenMaterials,
  });

  shell.actions.append(projectChip, threeD, materials, exportBtn, panelLeft, panelRight, help);

  // controles de zoom no palco
  const zoomOut = button({
    icon: 'zoomOut',
    variant: 'ghost icon sm',
    title: 'Diminuir zoom (-)',
    onClick: () => deps.onZoom(1 / 1.25),
  });
  const zoomValue = el('span', { style: { fontSize: '11px', fontWeight: '600', minWidth: '38px', textAlign: 'center' } }, '100%');
  const zoomIn = button({
    icon: 'zoomIn',
    variant: 'ghost icon sm',
    title: 'Aumentar zoom (+)',
    onClick: () => deps.onZoom(1.25),
  });
  const fit = button({
    icon: 'fit',
    variant: 'ghost icon sm',
    title: 'Enquadrar planta (Ctrl+0)',
    onClick: deps.onFit,
  });
  shell.zoomControls.append(zoomOut, zoomValue, zoomIn, fit);

  function update(): void {
    for (const [id, btn] of toolButtons) {
      btn.classList.toggle('active', store.tool === id);
    }
    undo.disabled = !store.canUndo;
    redo.disabled = !store.canRedo;
    undo.title = store.canUndo ? `Desfazer ${store.undoLabel} (Ctrl+Z)` : 'Nada para desfazer';
    redo.title = store.canRedo ? `Refazer ${store.redoLabel} (Ctrl+Shift+Z)` : 'Nada para refazer';
    projectName.textContent = store.doc.name;
    zoomValue.textContent = `${Math.round(store.view.zoom * 100)}%`;
    fit.classList.toggle('active', false);
  }

  update();
  return { update };
}
