/** Exportação dos quantitativos em CSV (separador ";" para o Excel pt-BR). */
import type { Plan } from '../core/document';
import { computeQuantities } from '../core/quantities';

function slug(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'planta'
  );
}

function cell(value: string | number): string {
  const text = String(value).replace(/"/g, '""');
  return /[";\r\n]/.test(text) ? `"${text}"` : text;
}

function m2(cm2: number): string {
  return (cm2 / 10000).toFixed(2).replace('.', ',');
}

function m(cm: number): string {
  return (cm / 100).toFixed(2).replace('.', ',');
}

export function quantitiesCSV(plan: Plan): string {
  const q = computeQuantities(plan);
  const rows: (string | number)[][] = [];

  rows.push(['casaTopView — quantitativos', plan.name]);
  rows.push(['Gerado em', new Date().toLocaleString('pt-BR')]);
  rows.push([]);

  rows.push(['Área de piso', 'm²']);
  for (const floor of q.floors) rows.push([`${floor.name} (${floor.roomCount})`, m2(floor.areaCm2)]);
  rows.push(['Total', m2(q.totalFloorCm2)]);
  rows.push([]);

  rows.push(['Paredes', '']);
  rows.push(['Comprimento total (m)', m(q.wallLengthCm)]);
  rows.push(['Área bruta (m²)', m2(q.wallGrossCm2)]);
  rows.push(['Vãos descontados (m²)', m2(q.wallOpeningCm2)]);
  rows.push(['Área líquida (m²)', m2(q.wallNetCm2)]);
  rows.push(['Rodapé / perímetro sem vãos (m)', m(q.baseboardCm)]);
  rows.push([]);

  rows.push(['Aberturas', 'Quantidade', 'Largura total (m)']);
  for (const opening of q.openings) rows.push([opening.label, opening.count, m(opening.widthCm)]);
  rows.push([]);

  rows.push(['Cômodos', 'Piso', 'Área (m²)']);
  for (const room of q.rooms) rows.push([room.name, room.floorName, m2(room.areaCm2)]);
  rows.push([]);

  rows.push(['Móveis', 'Quantidade', 'Largura (cm)', 'Profundidade (cm)', 'Área (m²)']);
  for (const item of q.furniture) {
    rows.push([item.name, item.count, Math.round(item.w), Math.round(item.d), m2(item.areaCm2)]);
  }
  rows.push(['Total', q.itemCount, '', '', m2(q.totalFurnitureAreaCm2)]);

  return rows.map((row) => row.map(cell).join(';')).join('\r\n');
}

export function downloadQuantitiesCSV(plan: Plan): void {
  const blob = new Blob(['\ufeff', quantitiesCSV(plan)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${slug(plan.name)}-quantitativos.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
