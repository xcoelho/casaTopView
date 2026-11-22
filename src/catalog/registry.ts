/** Catálogo de móveis, descoberto a partir das pastas em src/furniture/. */
import type { Item } from '../core/document';
import type { CategoryId, CategoryInfo, FurnitureDef } from './types';
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

/**
 * Cada peça é um pacote autocontido: `src/furniture/<id>/definition.ts` exporta a
 * `FurnitureDef` (metadados + desenho 2D) e, quando existir, `model.ts` na mesma
 * pasta traz o modelo 3D. Novas peças entram apenas criando a pasta, sem editar
 * este registro nem qualquer outro arquivo central.
 */
const packages = import.meta.glob<{ default: FurnitureDef }>('../furniture/*/definition.ts', {
  eager: true,
});

const categoryOrder = new Map(CATEGORIES.map((category, index) => [category.id, index]));

export const DEFS: FurnitureDef[] = Object.entries(packages)
  .map(([file, mod]) => {
    const def = mod.default;
    const folder = file.split('/').slice(-2)[0];
    if (!def?.id) throw new Error('Pacote de móvel sem definição: ' + file);
    if (folder !== def.id) throw new Error(`Pacote ${folder} deve ter o mesmo id da definição (${def.id})`);
    if (typeof def.draw !== 'function') throw new Error('Pacote de móvel sem desenho 2D: ' + file);
    if (!categoryOrder.has(def.category)) {
      throw new Error(`Categoria desconhecida em ${file}: ${def.category}`);
    }
    return def;
  })
  .sort(
    (a, b) =>
      categoryOrder.get(a.category)! - categoryOrder.get(b.category)! || a.id.localeCompare(b.id),
  );

const byId = new Map<string, FurnitureDef>();
for (const def of DEFS) {
  if (byId.has(def.id)) throw new Error('id de móvel duplicado: ' + def.id);
  byId.set(def.id, def);
}

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
