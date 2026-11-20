/** Registro de todos os móveis disponíveis. */
import type { Item } from '../core/document';
import type { CategoryId, CategoryInfo, FurnitureDef } from './types';
import { assentos } from './items/assentos';
import { mesas } from './items/mesas';
import { camas } from './items/camas';
import { armarios } from './items/armarios';
import { cozinha } from './items/cozinha';
import { banheiro } from './items/banheiro';
import { eletro } from './items/eletro';
import { lavanderia } from './items/lavanderia';
import { closet } from './items/closet';
import { infantil } from './items/infantil';
import { escritorio } from './items/escritorio';
import { gourmet } from './items/gourmet';
import { decoracao } from './items/decoracao';
import { pisos } from './items/pisos';
import { externo } from './items/externo';
import { estrutura } from './items/estrutura';
import { aberturas } from './items/aberturas';
import { uid } from '../core/ids';

export const CATEGORIES: CategoryInfo[] = [
  { id: 'assentos', name: 'Assentos' },
  { id: 'mesas', name: 'Mesas' },
  { id: 'camas', name: 'Camas' },
  { id: 'armarios', name: 'Armários' },
  { id: 'cozinha', name: 'Cozinha' },
  { id: 'banheiro', name: 'Banheiro' },
  { id: 'eletro', name: 'Eletro' },
  { id: 'lavanderia', name: 'Lavanderia' },
  { id: 'decoracao', name: 'Decoração' },
  { id: 'externo', name: 'Externo' },
  { id: 'estrutura', name: 'Estrutura' },
  { id: 'aberturas', name: 'Aberturas' },
];

export const DEFS: FurnitureDef[] = [
  ...aberturas,
  ...assentos,
  ...mesas,
  ...camas,
  ...armarios,
  ...cozinha,
  ...banheiro,
  ...eletro,
  ...lavanderia,
  ...closet,
  ...infantil,
  ...escritorio,
  ...gourmet,
  ...decoracao,
  ...pisos,
  ...externo,
  ...estrutura,
];

const byId = new Map<string, FurnitureDef>(DEFS.map((def) => [def.id, def]));

export function getDef(id: string): FurnitureDef | undefined {
  return byId.get(id);
}

const FALLBACK = '#c9a37a';

export function defaultColors(def: FurnitureDef): Record<string, string> {
  const colors: Record<string, string> = { ...(def.colors ?? {}) };
  for (const key of def.colorKeys ?? []) {
    if (!colors[key.key]) colors[key.key] = FALLBACK;
  }
  if (!colors.main) colors.main = FALLBACK;
  return colors;
}

export function createItem(
  defId: string,
  x: number,
  y: number,
  opts: Partial<Item> = {},
): Item | null {
  const def = getDef(defId);
  if (!def) return null;
  return {
    id: uid('it'),
    defId,
    x,
    y,
    w: opts.w ?? def.w,
    d: opts.d ?? def.d,
    rot: opts.rot ?? 0,
    colors: { ...defaultColors(def), ...(opts.colors ?? {}) },
    label: opts.label,
    locked: opts.locked ?? false,
    hidden: opts.hidden ?? false,
    z: opts.z ?? 0,
  };
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function searchDefs(query: string, category: CategoryId | 'todos'): FurnitureDef[] {
  const q = normalize(query.trim());
  return DEFS.filter((def) => {
    if (category !== 'todos' && def.category !== category) return false;
    if (!q) return true;
    const haystack = normalize(`${def.name} ${(def.keywords ?? []).join(' ')} ${def.category}`);
    return haystack.includes(q);
  });
}

export function categoryName(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}

/** Ordem de desenho: camadas (zBias) e depois a ordem informada. */
export function drawOrder(a: Item, b: Item): number {
  const biasA = getDef(a.defId)?.zBias ?? 0;
  const biasB = getDef(b.defId)?.zBias ?? 0;
  if (biasA !== biasB) return biasA - biasB;
  return a.z - b.z;
}
