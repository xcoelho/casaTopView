/** Rodapé com dica, coordenadas, zoom e estados do documento. */
import type { Store, ToolId } from '../core/store';
import { fmtLength } from '../core/units';
import type { Shell } from './shell';
import { el } from './controls';

export interface StatusbarDeps {
  store: Store;
  isSaving: () => boolean;
  onFit: () => void;
}

export interface StatusbarHandle {
  update: () => void;
}

const HINTS: Record<ToolId, string> = {
  select: 'Clique para selecionar · arraste para mover · Shift + clique soma itens · espaço + arraste navega',
  wall: 'Clique para cada canto da parede · Enter ou Esc termina · arrastar cria uma parede única',
  door: 'Passe o mouse sobre uma parede e clique para abrir o vão da porta',
  window: 'Passe o mouse sobre uma parede e clique para abrir o vão da janela',
  measure: 'Arraste entre dois pontos para medir · Shift solta o encaixe',
  calibrate: 'Clique nos dois pontos da imagem e informe a medida real',
};

const TOOL_LABELS: Record<ToolId, string> = {
  select: 'Selecionar',
  wall: 'Parede',
  door: 'Porta',
  window: 'Janela',
  measure: 'Medir',
  calibrate: 'Calibrar escala',
};

export function mountStatusbar(shell: Shell, deps: StatusbarDeps): StatusbarHandle {
  const { store } = deps;

  const hint = el('span', { class: 'hint' });
  const coords = el('span', { class: 'status-item' }, '—');
  const counts = el('span', { class: 'status-item' });
  const saveDot = el('i', { class: 'save-dot' });
  const saveText = el('span', {}, 'Salvo');
  const save = el('span', { class: 'status-item' }, saveDot, saveText);

  const gridToggle = el('button', { class: 'status-toggle', type: 'button', title: 'Grade (G)' }, 'Grade');
  const snapToggle = el('button', { class: 'status-toggle', type: 'button', title: 'Encaixe (S)' }, 'Encaixe');
  const dimsToggle = el('button', { class: 'status-toggle', type: 'button', title: 'Cotas (I)' }, 'Cotas');

  gridToggle.addEventListener('click', () =>
    store.tx('Grade', () => {
      store.doc.settings.showGrid = !store.doc.settings.showGrid;
    }),
  );
  snapToggle.addEventListener('click', () =>
    store.tx('Encaixe', () => {
      store.doc.settings.snap = !store.doc.settings.snap;
    }),
  );
  dimsToggle.addEventListener('click', () =>
    store.tx('Cotas', () => {
      store.doc.settings.showDims = !store.doc.settings.showDims;
    }),
  );

  shell.statusbar.append(hint, coords, counts, gridToggle, snapToggle, dimsToggle, save);

  const updateCoords = (): void => {
    if (!store.cursor) {
      coords.textContent = '—';
      return;
    }
    coords.textContent = `X ${fmtLength(store.cursor.x)} · Y ${fmtLength(store.cursor.y)}`;
  };

  function update(): void {
    hint.innerHTML = '';
    const strong = document.createElement('b');
    strong.textContent = `${TOOL_LABELS[store.tool]} · `;
    hint.append(strong, document.createTextNode(HINTS[store.tool]));

    const stats = store.doc;
    const pisoCount = stats.items.filter((item) => item.defId.startsWith('piso-')).length;
    const moveisCount = stats.items.length - pisoCount;
    counts.textContent = `${moveisCount} móveis · ${stats.walls.length} paredes · ${pisoCount} pisos`;
    gridToggle.classList.toggle('on', stats.settings.showGrid);
    snapToggle.classList.toggle('on', stats.settings.snap);
    dimsToggle.classList.toggle('on', stats.settings.showDims);

    const saving = deps.isSaving();
    saveDot.classList.toggle('pending', saving);
    saveText.textContent = saving ? 'Salvando…' : 'Salvo';
    updateCoords();
  }

  store.cursorMoved.on(updateCoords);
  update();
  return { update };
}
