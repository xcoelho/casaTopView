/** Diálogo "Materiais": quantitativos da planta prontos para orçar. */
import { computeQuantities } from '../core/quantities';
import type { Store } from '../core/store';
import { fmtArea, fmtMeters } from '../core/units';
import { downloadQuantitiesCSV } from '../export/csv';
import { button, el, openModal, readOnlyRow } from './controls';

export interface MaterialsDeps {
  store: Store;
  notify: (message: string) => void;
}

function section(title: string, ...children: Node[]): HTMLElement {
  return el('section', { class: 'qty-section' }, el('h3', {}, title), ...children);
}

function summaryCell(value: string, label: string): HTMLElement {
  return el('div', { class: 'summary-cell' }, el('b', {}, value), el('span', {}, label));
}

function table(
  headers: string[],
  rows: (string | number)[][],
  total?: (string | number)[],
): HTMLElement {
  const head = el(
    'tr',
    {},
    ...headers.map((label, index) => el('th', { class: index ? 'num' : '' }, label)),
  );
  const bodyNode = el('tbody');
  for (const row of rows) {
    bodyNode.append(
      el(
        'tr',
        {},
        ...row.map((value, index) => el('td', { class: index ? 'num' : '' }, String(value))),
      ),
    );
  }
  if (total) {
    bodyNode.append(
      el(
        'tr',
        { class: 'total' },
        ...total.map((value, index) => el('td', { class: index ? 'num' : '' }, String(value))),
      ),
    );
  }
  return el('table', { class: 'qty' }, el('thead', {}, head), bodyNode);
}

export function openMaterialsDialog(deps: MaterialsDeps): void {
  const { store, notify } = deps;
  const quantities = computeQuantities(store.doc);
  const body = el('div', { class: 'qty-body' });

  body.append(
    el(
      'div',
      { class: 'summary-grid' },
      summaryCell(fmtArea(quantities.totalFloorCm2), 'área de piso'),
      summaryCell(fmtArea(quantities.wallNetCm2), 'parede líquida'),
      summaryCell(
        String(quantities.openings.reduce((sum, row) => sum + row.count, 0)),
        'aberturas',
      ),
      summaryCell(String(quantities.itemCount), 'móveis'),
    ),
  );

  const empty =
    !quantities.rooms.length && !quantities.itemCount && quantities.wallLengthCm < 1;
  if (empty) {
    body.append(
      el('p', { class: 'ud-note' }, 'A planta está vazia — desenhe paredes e cômodos para ver os quantitativos.'),
    );
  }

  if (quantities.floors.length) {
    body.append(
      section(
        'Pisos por acabamento',
        table(
          ['Acabamento', 'Ambientes', 'Área'],
          quantities.floors.map((floor) => [floor.name, floor.roomCount, fmtArea(floor.areaCm2)]),
          ['Total', quantities.rooms.length, fmtArea(quantities.totalFloorCm2)],
        ),
      ),
    );
  }

  if (quantities.wallLengthCm >= 1) {
    body.append(
      section(
        'Paredes',
        readOnlyRow('Comprimento total', fmtMeters(quantities.wallLengthCm)),
        readOnlyRow('Área bruta', fmtArea(quantities.wallGrossCm2)),
        readOnlyRow('Vãos descontados', fmtArea(quantities.wallOpeningCm2)),
        readOnlyRow('Área líquida', fmtArea(quantities.wallNetCm2)),
        readOnlyRow('Rodapé (perímetro sem vãos)', fmtMeters(quantities.baseboardCm)),
      ),
    );
  }

  if (quantities.openings.length) {
    body.append(
      section(
        'Aberturas',
        table(
          ['Tipo', 'Qtd.', 'Largura total'],
          quantities.openings.map((row) => [row.label, row.count, fmtMeters(row.widthCm)]),
        ),
      ),
    );
  }

  if (quantities.rooms.length) {
    body.append(
      section(
        'Cômodos',
        table(
          ['Ambiente', 'Piso', 'Área'],
          quantities.rooms.map((room) => [room.name, room.floorName, fmtArea(room.areaCm2)]),
        ),
      ),
    );
  }

  body.append(
    section(
      'Móveis',
      quantities.furniture.length
        ? table(
            ['Item', 'Qtd.', 'Dimensões', 'Área'],
            quantities.furniture.map((row) => [
              row.name,
              row.count,
              `${Math.round(row.w)} × ${Math.round(row.d)} cm`,
              fmtArea(row.areaCm2),
            ]),
            ['Total', quantities.itemCount, '', fmtArea(quantities.totalFurnitureAreaCm2)],
          )
        : el('p', { class: 'ud-note' }, 'Nenhum móvel na planta.'),
    ),
  );

  const modal = openModal({
    title: 'Materiais e quantitativos',
    subtitle: `${store.doc.name} · áreas, paredes, aberturas e móveis`,
    body,
    footer: el(
      'div',
      { class: 'modal-actions' },
      button({ label: 'Fechar', variant: 'ghost', onClick: () => modal.close() }),
      button({
        label: 'Exportar CSV',
        icon: 'download',
        variant: 'primary',
        onClick: () => {
          downloadQuantitiesCSV(store.doc);
          notify('Quantitativos exportados em CSV');
        },
      }),
    ),
  });
}
