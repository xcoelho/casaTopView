/** Painel direito com propriedades da seleção e do documento. */
import { DEFAULT_DOOR_COLOR, DEFAULT_WALL_COLOR, DOOR_COLORS, FLOORS, WALL_COLORS } from '../core/document';
import type { Item, Opening, Room, Wall } from '../core/document';
import { roomAreaCm2 } from '../core/document';
import { getDef } from '../catalog/registry';
import { PALETTES } from '../catalog/draw';
import type { SwatchOption } from '../catalog/draw';
import { fmtArea, fmtLength } from '../core/units';
import type { Store } from '../core/store';
import { itemThumb } from '../render/thumbnail';
import { createItemPreview } from '../view3d/preview';
import { isElevatable, itemElevation, maxElevation } from '../view3d/furniture';
import { setWallLength, wallLength } from '../interaction/wallResize';
import type { Shell } from './shell';
import {
  button,
  el,
  field,
  icon,
  numberField,
  readOnlyRow,
  section,
  selectField,
  swatchField,
  textField,
  toggleRow,
} from './controls';

export interface InspectorDeps {
  store: Store;
  notify: (message: string) => void;
  onFit: () => void;
}

export interface InspectorHandle {
  update: () => void;
}

export function mountInspector(shell: Shell, deps: InspectorDeps): InspectorHandle {
  const { store, notify } = deps;
  const host = shell.inspectorScroll;
  const preview = createItemPreview();
  let scheduled = false;

  function schedule(): void {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      render();
    });
  }

  function itemHeading(item: Item): HTMLElement {
    const def = getDef(item.defId);
    const thumb = def ? el('img', { class: 'insp-head-thumb', src: itemThumb(def, 52, 44), alt: '' }) : null;
    return el(
      'div',
      { class: 'insp-head' },
      thumb,
      el(
        'div',
        { class: 'insp-head-text' },
        el('b', {}, item.label || def?.name || 'Móvel'),
        el('span', {}, def ? `${fmtLength(item.w)} × ${fmtLength(item.d)}` : ''),
      ),
    );
  }

  function rotationsRow(): HTMLElement {
    return el(
      'div',
      { class: 'mini-grid' },
      ...[0, 90, 180, 270].map((angle) =>
        button({
          label: `${angle}°`,
          variant: 'ghost',
          title: `Rotação ${angle}°`,
          onClick: () => store.updateItems({ rot: angle }, 'Rotacionar'),
        }),
      ),
    );
  }

  function actionsRow(): HTMLElement {
    return el(
      'div',
      { class: 'row-actions' },
      button({ label: 'Duplicar', icon: 'copy', onClick: () => store.duplicateSelection() }),
      button({
        label: 'Travar',
        icon: 'lock',
        onClick: () => {
          const items = store.selectedItems();
          const lock = !items.every((item) => item.locked);
          store.tx(lock ? 'Travar' : 'Destravar', () => {
            for (const item of items) item.locked = lock;
          });
          notify(lock ? 'Seleção travada' : 'Seleção destravada');
        },
      }),
      button({
        label: 'Ocultar',
        icon: 'eye',
        onClick: () => {
          const items = store.selectedItems();
          const hide = !items.every((item) => item.hidden);
          store.tx(hide ? 'Ocultar' : 'Mostrar', () => {
            for (const item of items) item.hidden = hide;
          });
          if (hide) store.clearSelection();
        },
      }),
      button({ label: 'Frente', icon: 'front', onClick: () => store.bringToFront() }),
      button({ label: 'Trás', icon: 'back', onClick: () => store.sendToBack() }),
      button({
        label: 'Excluir',
        icon: 'trash',
        variant: 'danger',
        onClick: () => store.removeSelection(),
      }),
    );
  }

  function renderItem(item: Item): Node[] {
    const def = getDef(item.defId);
    const multi = store.selection.length > 1;
    const nodes: Node[] = [section('Móvel', itemHeading(item))];

    const xField = numberField({
      label: 'X (centro)',
      value: item.x,
      step: 5,
      unit: 'cm',
      onCommit: (value) => (multi ? store.updateItems({ x: value }) : store.updateItem(item.id, { x: value })),
    });
    const yField = numberField({
      label: 'Y (centro)',
      value: item.y,
      step: 5,
      unit: 'cm',
      onCommit: (value) => (multi ? store.updateItems({ y: value }) : store.updateItem(item.id, { y: value })),
    });

    const wField = numberField({
      label: 'Largura',
      value: item.w,
      min: 10,
      step: 5,
      unit: 'cm',
      onCommit: (value) => (multi ? store.updateItems({ w: value }) : store.updateItem(item.id, { w: value })),
    });
    const dField = numberField({
      label: 'Profundidade',
      value: item.d,
      min: 10,
      step: 5,
      unit: 'cm',
      onCommit: (value) => (multi ? store.updateItems({ d: value }) : store.updateItem(item.id, { d: value })),
    });

    const rotField = numberField({
      label: 'Rotação',
      value: item.rot,
      step: 15,
      unit: '°',
      onCommit: (value) => (multi ? store.updateItems({ rot: value }) : store.updateItem(item.id, { rot: value })),
    });

    const elevationField = isElevatable(item.defId)
      ? numberField({
          label: 'Altura da base',
          value: itemElevation(item),
          min: 0,
          max: maxElevation(item.defId),
          step: 5,
          unit: 'cm',
          onCommit: (value) => store.updateItem(item.id, { elevation: value }, 'Altura'),
        })
      : null;

    nodes.push(
      section(
        'Posição',
        el('div', { class: 'field-row' }, xField, yField),
        el('div', { class: 'field-row' }, wField, dField),
        ...(elevationField ? [elevationField] : []),
        rotField,
        rotationsRow(),
      ),
    );

    if (def?.colorKeys?.length) {
      const colorNodes: Node[] = [];
      for (const key of def.colorKeys) {
        const palette = PALETTES[key.palette];
        const options: SwatchOption[] = palette.options;
        const current = item.colors[key.key] ?? options[0].value;
        colorNodes.push(
          swatchField(key.label, options, current, (value) => {
            const items = multi ? store.selectedItems() : [item];
            store.tx('Material', () => {
              for (const target of items) target.colors = { ...target.colors, [key.key]: value };
            });
          }),
        );
      }
      nodes.push(section('Material', ...colorNodes));
    }

    const labelValue = item.label ?? '';
    nodes.push(
      section(
        'Identificação',
        textField({
          label: 'Etiqueta',
          value: labelValue,
          placeholder: def?.name ?? 'Móvel',
          onCommit: (value) => {
            const items = multi ? store.selectedItems() : [item];
            store.tx('Etiqueta', () => {
              for (const target of items) target.label = value || undefined;
            });
          },
        }),
        el(
          'div',
          { class: 'row-actions' },
          button({
            label: item.locked ? 'Destravar' : 'Travar',
            icon: 'lock',
            onClick: () => {
              const items = multi ? store.selectedItems() : [item];
              store.tx('Travar', () => {
                for (const target of items) target.locked = !target.locked;
              });
            },
          }),
          button({
            label: item.hidden ? 'Mostrar' : 'Ocultar',
            icon: 'eye',
            onClick: () => {
              const items = multi ? store.selectedItems() : [item];
              const hide = !items.every((target) => target.hidden);
              store.tx('Ocultar', () => {
                for (const target of items) target.hidden = hide;
              });
              if (hide) store.clearSelection();
            },
          }),
        ),
        actionsRow(),
      ),
    );

    if (preview) {
      preview.show(item);
      nodes.push(section('Vista 3D', preview.element));
    }

    return nodes;
  }

  function renderWall(wall: Wall): Node[] {
    const length = wallLength(wall);
    const angle = (Math.atan2(wall.b.y - wall.a.y, wall.b.x - wall.a.x) * 180) / Math.PI;
    const openings = store.doc.openings.filter((o) => o.wallId === wall.id);
    return [
      section(
        'Parede',
        numberField({
          label: 'Comprimento',
          value: Math.round(length * 10) / 10,
          min: 10,
          step: 5,
          unit: 'cm',
          onCommit: (value) => setWallLength(store, wall, value),
        }),
        readOnlyRow('Ângulo', `${Math.round(angle)}°`),
        selectField({
          label: 'Espessura',
          value: String(wall.thickness),
          options: [
            { value: '10', label: '10 cm — divisória' },
            { value: '15', label: '15 cm — alvenaria' },
            { value: '20', label: '20 cm — externa' },
            { value: '25', label: '25 cm — estrutural' },
          ],
          onChange: (value) =>
            store.tx('Espessura', () => {
              wall.thickness = Number(value);
            }),
        }),
        readOnlyRow('Aberturas', String(openings.length)),
        swatchField(
          'Cor da parede (3D)',
          WALL_COLORS,
          wall.color ?? DEFAULT_WALL_COLOR,
          (value) =>
            store.tx('Cor da parede', () => {
              wall.color = value;
            }),
        ),
        el(
          'div',
          { class: 'row-actions' },
          button({
            label: 'Excluir parede',
            icon: 'trash',
            variant: 'danger',
            onClick: () => store.removeById(wall.id),
          }),
        ),
      ),
    ];
  }

  function renderOpening(opening: Opening): Node[] {
    const wall = store.findWall(opening.wallId);
    const length = wall ? Math.hypot(wall.b.x - wall.a.x, wall.b.y - wall.a.y) : 0;
    return [
      section(
        'Abertura',
        selectField({
          label: 'Tipo',
          value: opening.kind,
          options: [
            { value: 'porta', label: 'Porta' },
            { value: 'porta-dupla', label: 'Porta dupla' },
            { value: 'porta-correr', label: 'Porta de correr' },
            { value: 'porta-garagem', label: 'Porta de garagem' },
            { value: 'janela', label: 'Janela' },
            { value: 'janela-correr', label: 'Janela de correr' },
            { value: 'vao', label: 'Vão livre' },
          ],
          onChange: (value) =>
            store.tx('Tipo de abertura', () => {
              opening.kind = value as Opening['kind'];
            }),
        }),
        ...(opening.kind.startsWith('porta')
          ? [
              swatchField(
                'Cor da folha',
                DOOR_COLORS,
                opening.color ?? DEFAULT_DOOR_COLOR,
                (value) =>
                  store.tx('Cor da porta', () => {
                    opening.color = value;
                  }),
              ),
            ]
          : []),
        el(
          'div',
          { class: 'field-row' },
          numberField({
            label: 'Largura',
            value: opening.width,
            min: 1,
            max: Math.max(1, length),
            step: 5,
            unit: 'cm',
            onCommit: (value) =>
              store.tx('Largura', () => {
                const next = Math.min(value, length);
                const half = next / 2;
                opening.width = next;
                opening.offset = Math.max(half, Math.min(length - half, opening.offset));
              }),
          }),
          numberField({
            label: 'Posição',
            value: opening.offset,
            min: 0,
            max: length,
            step: 5,
            unit: 'cm',
            onCommit: (value) =>
              store.tx('Posição', () => {
                const half = opening.width / 2;
                opening.offset = Math.max(half, Math.min(length - half, value));
              }),
          }),
        ),
        selectField({
          label: 'Dobradiça',
          value: opening.hinge,
          options: [
            { value: 'esq', label: 'Início da parede' },
            { value: 'dir', label: 'Fim da parede' },
          ],
          onChange: (value) =>
            store.tx('Dobradiça', () => {
              opening.hinge = value === 'dir' ? 'dir' : 'esq';
            }),
        }),
        toggleRow('Abrir para o outro lado', opening.flip, (checked) =>
          store.tx('Lado da abertura', () => {
            opening.flip = checked;
          }),
        ),
        el(
          'div',
          { class: 'row-actions' },
          button({
            label: 'Excluir abertura',
            icon: 'trash',
            variant: 'danger',
            onClick: () => store.removeById(opening.id),
          }),
        ),
      ),
    ];
  }

  function renderMulti(): Node[] {
    return [
      section(
        `${store.selection.length} itens`,
        el(
          'div',
          { class: 'mini-grid' },
          button({ label: 'Esq.', title: 'Alinhar à esquerda', onClick: () => store.alignSelection('left') }),
          button({ label: 'Centro', title: 'Alinhar ao centro', onClick: () => store.alignSelection('centerX') }),
          button({ label: 'Dir.', title: 'Alinhar à direita', onClick: () => store.alignSelection('right') }),
          button({ label: 'Topo', title: 'Alinhar ao topo', onClick: () => store.alignSelection('top') }),
          button({ label: 'Meio', title: 'Alinhar ao meio', onClick: () => store.alignSelection('middle') }),
          button({ label: 'Base', title: 'Alinhar à base', onClick: () => store.alignSelection('bottom') }),
        ),
        actionsRow(),
      ),
    ];
  }

  function renderDocument(): Node[] {
    const settings = store.doc.settings;
    const floorItems = store.doc.items.filter((item) => item.defId.startsWith('piso-'));
    const area =
      store.doc.rooms.reduce((sum, room) => sum + roomAreaCm2(room), 0) +
      floorItems.reduce((sum, item) => sum + item.w * item.d, 0);
    return [
      section(
        'Documento',
        el(
          'div',
          { class: 'summary-grid' },
          el('div', { class: 'summary-cell' }, el('b', {}, String(store.doc.items.length - floorItems.length)), el('span', {}, 'móveis')),
          el('div', { class: 'summary-cell' }, el('b', {}, String(store.doc.walls.length)), el('span', {}, 'paredes')),
          el('div', { class: 'summary-cell' }, el('b', {}, String(store.doc.rooms.length + floorItems.length)), el('span', {}, 'pisos')),
          el('div', { class: 'summary-cell' }, el('b', {}, fmtArea(area)), el('span', {}, 'área')),
        ),
      ),
      section(
        'Desenho',
        el(
          'div',
          { class: 'field-row' },
          numberField({
            label: 'Grade',
            value: settings.grid,
            min: 5,
            max: 100,
            step: 5,
            unit: 'cm',
            onCommit: (value) =>
              store.tx('Grade', () => {
                store.doc.settings.grid = value;
              }),
          }),
          selectField({
            label: 'Parede',
            value: String(settings.wallThickness),
            options: [
              { value: '10', label: '10 cm' },
              { value: '15', label: '15 cm' },
              { value: '20', label: '20 cm' },
              { value: '25', label: '25 cm' },
            ],
            onChange: (value) =>
              store.tx('Espessura padrão', () => {
                store.doc.settings.wallThickness = Number(value);
              }),
          }),
        ),
        toggleRow('Mostrar grade', settings.showGrid, (checked) =>
          store.tx('Grade', () => {
            store.doc.settings.showGrid = checked;
          }),
        ),
        toggleRow('Encaixar ao arrastar', settings.snap, (checked) =>
          store.tx('Encaixe', () => {
            store.doc.settings.snap = checked;
          }),
        ),
        toggleRow('Cotas das paredes', settings.showDims, (checked) =>
          store.tx('Cotas', () => {
            store.doc.settings.showDims = checked;
          }),
        ),
        toggleRow('Rótulos de área', settings.showAreas, (checked) =>
          store.tx('Rótulos', () => {
            store.doc.settings.showAreas = checked;
          }),
        ),
      ),
      section(
        'Dicas',
        el(
          'div',
          { class: 'kbd-list' },
          el('div', { class: 'kbd-row' }, el('span', {}, 'Arrastar do catálogo'), el('span', {}, el('kbd', { class: 'k' }, 'arraste'))),
          el('div', { class: 'kbd-row' }, el('span', {}, 'Girar 90°'), el('span', {}, el('kbd', { class: 'k' }, 'R'))),
        ),
        el(
          'div',
          { class: 'row-actions' },
          button({
            icon: 'fit',
            label: 'Enquadrar planta',
            onClick: () => deps.onFit(),
          }),
        ),
      ),
    ];
  }

  function render(): void {
    if (host.contains(document.activeElement)) return;
    const nodes: Node[] = [];

    const selection = store.selection;
    if (!selection.length) {
      nodes.push(...renderDocument());
    } else {
      const item = selection.length === 1 ? store.findItem(selection[0]) : null;
      const wall = selection.length === 1 ? store.findWall(selection[0]) : null;
      const opening = selection.length === 1 ? store.findOpening(selection[0]) : null;

      if (item) nodes.push(...renderItem(item));
      else if (wall) nodes.push(...renderWall(wall));
      else if (opening) nodes.push(...renderOpening(opening));
      else nodes.push(...renderMulti());
    }

    host.replaceChildren(...nodes);
  }

  store.changed.on(schedule);
  store.selectionChanged.on(schedule);
  render();

  return { update: schedule };
}
