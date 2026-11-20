/** Arraste da seleção, com encaixes e deslizamento de aberturas. */
import type { Plan } from '../core/document';
import type { Store } from '../core/store';
import type { Rect, Vec2 } from '../core/geometry';
import { closestPointOnSegment, dist, obbCorners, unionRect } from '../core/geometry';
import type { Guide } from './guides';
import { computeMoveSnap } from './snapping';

interface ItemSnapshot {
  id: string;
  x: number;
  y: number;
  w: number;
  d: number;
  rot: number;
}

export interface MoveSession {
  start: Vec2;
  before: Plan;
  items: ItemSnapshot[];
  walls: { id: string; a: Vec2; b: Vec2 }[];
  openingIds: string[];
  moved: boolean;
}

export function beginMove(store: Store, world: Vec2): MoveSession {
  const items = store.selectedItems().filter((i) => !i.locked);
  const walls = store.selectedWalls();
  const openings = store.selectedOpenings();
  return {
    start: world,
    before: store.snapshot(),
    items: items.map((i) => ({ id: i.id, x: i.x, y: i.y, w: i.w, d: i.d, rot: i.rot })),
    walls: walls.map((w) => ({ id: w.id, a: { ...w.a }, b: { ...w.b } })),
    openingIds: openings.map((o) => o.id),
    moved: false,
  };
}

function boxOfPoints(points: Vec2[]): Rect {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function sessionBounds(session: MoveSession): Rect | null {
  let rect: Rect | null = null;
  for (const entry of session.items) {
    rect = unionRect(
      rect,
      boxOfPoints(obbCorners({ x: entry.x, y: entry.y }, entry.w, entry.d, entry.rot)),
    );
  }
  for (const wall of session.walls) rect = unionRect(rect, boxOfPoints([wall.a, wall.b]));
  return rect;
}

export function updateMove(store: Store, session: MoveSession, world: Vec2, shiftKey: boolean): void {
  const raw: Vec2 = { x: world.x - session.start.x, y: world.y - session.start.y };
  if (Math.abs(raw.x) > 0.01 || Math.abs(raw.y) > 0.01) session.moved = true;

  const onlyOpenings =
    session.items.length === 0 &&
    session.walls.length === 0 &&
    session.openingIds.length > 0;

  if (onlyOpenings) {
    for (const id of session.openingIds) {
      const opening = store.findOpening(id);
      if (!opening) continue;
      const wall = store.findWall(opening.wallId);
      if (!wall) continue;
      const hit = closestPointOnSegment(world, wall.a, wall.b);
      const length = dist(wall.a, wall.b);
      let offset = hit.t * length;
      if (store.doc.settings.snap) offset = Math.round(offset / 5) * 5;
      const half = opening.width / 2;
      opening.offset = Math.max(half, Math.min(length - half, offset));
    }
    store.setGuides([]);
    store.emit();
    return;
  }

  let offset = raw;
  let guides: Guide[] = [];
  const bbox = sessionBounds(session);
  if (bbox && !shiftKey) {
    const ids = new Set<string>([
      ...session.items.map((i) => i.id),
      ...session.walls.map((w) => w.id),
    ]);
    const snapped = computeMoveSnap(store, ids, bbox, raw);
    offset = snapped.offset;
    guides = snapped.guides;
  }

  for (const entry of session.items) {
    const item = store.findItem(entry.id);
    if (!item) continue;
    item.x = entry.x + offset.x;
    item.y = entry.y + offset.y;
  }
  for (const entry of session.walls) {
    const wall = store.findWall(entry.id);
    if (!wall) continue;
    wall.a = { x: entry.a.x + offset.x, y: entry.a.y + offset.y };
    wall.b = { x: entry.b.x + offset.x, y: entry.b.y + offset.y };
  }
  store.setGuides(guides);
  store.emit();
}

export function endMove(store: Store, session: MoveSession): void {
  store.setGuides([]);
  if (session.moved) store.commit('Mover', session.before);
  store.emit();
}
