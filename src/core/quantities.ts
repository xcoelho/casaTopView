/** Quantitativos da planta: pisos, paredes, aberturas e móveis. */
import type { OpeningKind, Plan } from './document';
import { FLOORS, floorMaterial, roomAreaCm2, wallParts } from './document';
import { WALL_HEIGHT, openingHeight } from './constants';
import { dist } from './geometry';
import { getDef } from '../catalog/registry';
import { floorKeyForPisoDef } from '../catalog/items/pisos';

export const OPENING_LABELS: Record<OpeningKind, string> = {
  porta: 'Porta',
  'porta-dupla': 'Porta dupla',
  'porta-correr': 'Porta de correr',
  'porta-garagem': 'Porta de garagem',
  janela: 'Janela',
  'janela-correr': 'Janela de correr',
  vao: 'Vão livre',
};

export interface FloorRow {
  key: string;
  name: string;
  roomCount: number;
  areaCm2: number;
}

export interface RoomRow {
  id: string;
  name: string;
  floorName: string;
  areaCm2: number;
}

export interface OpeningRow {
  kind: OpeningKind;
  label: string;
  count: number;
  widthCm: number;
  heightCm: number;
}

export interface FurnitureRow {
  defId: string;
  name: string;
  count: number;
  w: number;
  d: number;
  areaCm2: number;
}

export interface Quantities {
  rooms: RoomRow[];
  floors: FloorRow[];
  totalFloorCm2: number;
  wallLengthCm: number;
  wallGrossCm2: number;
  wallOpeningCm2: number;
  wallNetCm2: number;
  /** perímetro das paredes já descontando os vãos (base do rodapé) */
  baseboardCm: number;
  openings: OpeningRow[];
  furniture: FurnitureRow[];
  totalFurnitureAreaCm2: number;
  itemCount: number;
}

export function computeQuantities(plan: Plan): Quantities {
  const rooms: RoomRow[] = plan.rooms.map((room) => ({
    id: room.id,
    name: room.name,
    floorName: floorMaterial(room.floor).name,
    areaCm2: roomAreaCm2(room),
  }));

  const floorTotals = new Map<string, { roomCount: number; areaCm2: number }>();
  for (const room of plan.rooms) {
    const entry = floorTotals.get(room.floor) ?? { roomCount: 0, areaCm2: 0 };
    entry.roomCount += 1;
    entry.areaCm2 += roomAreaCm2(room);
    floorTotals.set(room.floor, entry);
  }
  // Peças de piso (itens piso-*) somam área em floors, sem contar como móvel.
  for (const item of plan.items) {
    const floorKey = floorKeyForPisoDef(item.defId);
    if (!floorKey) continue;
    const entry = floorTotals.get(floorKey) ?? { roomCount: 0, areaCm2: 0 };
    entry.roomCount += 1;
    entry.areaCm2 += item.w * item.d;
    floorTotals.set(floorKey, entry);
  }
  const floors: FloorRow[] = FLOORS.filter((floor) => (floorTotals.get(floor.key)?.roomCount ?? 0) > 0).map(
    (floor) => {
      const entry = floorTotals.get(floor.key)!;
      return { key: floor.key, name: floor.name, roomCount: entry.roomCount, areaCm2: entry.areaCm2 };
    },
  );
  const totalFloorCm2 = floors.reduce((sum, floor) => sum + floor.areaCm2, 0);

  let wallLengthCm = 0;
  let wallGrossCm2 = 0;
  let wallOpeningCm2 = 0;
  let baseboardCm = 0;

  for (const wall of plan.walls) {
    const length = dist(wall.a, wall.b);
    if (length < 0.5) continue;
    wallLengthCm += length;
    wallGrossCm2 += length * WALL_HEIGHT;
    for (const [start, end] of wallParts(wall, plan.openings)) baseboardCm += Math.max(0, end - start);
    for (const opening of plan.openings) {
      if (opening.wallId !== wall.id) continue;
      wallOpeningCm2 += Math.min(opening.width, length) * openingHeight(opening.kind);
    }
  }
  const wallNetCm2 = Math.max(0, wallGrossCm2 - wallOpeningCm2);

  const openingTotals = new Map<OpeningKind, OpeningRow>();
  for (const opening of plan.openings) {
    const row = openingTotals.get(opening.kind) ?? {
      kind: opening.kind,
      label: OPENING_LABELS[opening.kind],
      count: 0,
      widthCm: 0,
      heightCm: openingHeight(opening.kind),
    };
    row.count += 1;
    row.widthCm += opening.width;
    openingTotals.set(opening.kind, row);
  }
  const openings: OpeningRow[] = (Object.keys(OPENING_LABELS) as OpeningKind[])
    .map((kind) => openingTotals.get(kind))
    .filter((row): row is OpeningRow => !!row);

  const furnitureMap = new Map<string, FurnitureRow>();
  const furnitureItems = plan.items.filter((item) => !floorKeyForPisoDef(item.defId));
  for (const item of furnitureItems) {
    const name = getDef(item.defId)?.name ?? item.defId;
    const row = furnitureMap.get(item.defId) ?? {
      defId: item.defId,
      name,
      count: 0,
      w: item.w,
      d: item.d,
      areaCm2: 0,
    };
    row.count += 1;
    row.areaCm2 += item.w * item.d;
    furnitureMap.set(item.defId, row);
  }
  const furniture = [...furnitureMap.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name, 'pt-BR'),
  );

  return {
    rooms,
    floors,
    totalFloorCm2,
    wallLengthCm,
    wallGrossCm2,
    wallOpeningCm2,
    wallNetCm2,
    baseboardCm,
    openings,
    furniture,
    totalFurnitureAreaCm2: furniture.reduce((sum, row) => sum + row.areaCm2, 0),
    itemCount: furnitureItems.length,
  };
}
