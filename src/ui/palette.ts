/** Catálogo lateral de móveis com busca e categorias. */
import type { CategoryId, FurnitureDef } from '../catalog/types';
import { CATEGORIES, searchDefs } from '../catalog/registry';
import { fmtLength } from '../core/units';
import type { Store } from '../core/store';
import type { Renderer } from '../render/renderer';
import { itemThumb } from '../render/thumbnail';
import { attachPaletteDrop } from '../interaction/dropFromPalette';
import type { Shell } from './shell';
import { el, icon } from './controls';

export interface PaletteDeps {
  store: Store;
  canvas: HTMLCanvasElement;
  renderer: Renderer;
  notify: (message: string) => void;
}

export interface PaletteHandle {
  update: () => void;
}

export function mountPalette(shell: Shell, deps: PaletteDeps): PaletteHandle {
  const { store, canvas, renderer, notify } = deps;
  let category: CategoryId | 'todos' = 'todos';
  let query = '';

  const count = el('span', { style: { fontSize: '10.5px', color: 'var(--ink-faint)', fontWeight: '600' } }, '');
  const title = el('div', { class: 'panel-title' }, el('h2', {}, 'Catálogo'), count);

  const searchInput = el('input', {
    type: 'search',
    placeholder: 'Buscar móvel, mesa, porta…',
    'aria-label': 'Buscar no catálogo',
  }) as HTMLInputElement;
  const search = el('div', { class: 'input search' }, icon('search', 15), searchInput);

  const chips = el('div', { class: 'chips' });
  const chipButtons: { id: CategoryId | 'todos'; node: HTMLElement }[] = [];
  const allChips: { id: CategoryId | 'todos'; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    ...CATEGORIES.map((c) => ({ id: c.id as CategoryId | 'todos', label: c.name })),
  ];
  for (const chip of allChips) {
    const node = el('button', {
      class: 'chip',
      type: 'button',
      onClick: () => {
        category = chip.id;
        updateChips();
        renderGrid();
      },
    }, chip.label);
    chipButtons.push({ id: chip.id, node });
    chips.append(node);
  }

  shell.paletteHead.append(title, search, chips);

  const grid = el('div', { class: 'catalog-grid' });
  const empty = el(
    'div',
    { class: 'catalog-empty' },
    'Nenhum móvel encontrado.',
    el('br'),
    'Tente outro termo ou categoria.',
  );
  const foot = el(
    'div',
    { class: 'catalog-foot' },
    'Arraste um item para a planta ou clique para inserir no centro da vista. Itens de parede se prendem sozinhos.',
  );

  shell.paletteScroll.append(grid, empty, foot);

  function updateChips(): void {
    for (const chip of chipButtons) chip.node.classList.toggle('active', chip.id === category);
  }

  function makeCard(def: FurnitureDef): HTMLElement {
    const card = el('button', {
      class: `cat-card${def.kind === 'opening' ? ' wall' : ''}`,
      type: 'button',
      dataset: { def: def.id },
      title: `${def.name} · ${fmtLength(def.w)} × ${fmtLength(def.d)}`,
    });
    const img = el('img', {
      src: itemThumb(def, 120, 76),
      alt: def.name,
      draggable: 'false',
    }) as HTMLImageElement;
    card.append(img, el('span', { class: 'cat-name' }, def.name));
    return card;
  }

  function renderGrid(): void {
    const defs = searchDefs(query, category);
    grid.replaceChildren(...defs.map((def) => makeCard(def)));
    empty.style.display = defs.length ? 'none' : 'block';
    grid.style.display = defs.length ? 'grid' : 'none';
    count.textContent = `${defs.length} ${defs.length === 1 ? 'item' : 'itens'}`;
  }

  updateChips();
  renderGrid();

  searchInput.addEventListener('input', () => {
    query = searchInput.value;
    renderGrid();
  });

  attachPaletteDrop(shell.paletteScroll, canvas, { store, renderer, notify });

  return {
    update: () => {
      /* o catálogo é estático; nada a atualizar por enquanto */
    },
  };
}
