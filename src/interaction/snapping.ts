/** Encaixes e guias de alinhamento. */
import type { Plan, Wall } from '../core/document';
import { itemBounds } from '../core/document';
import type { Rect, Vec2 } from '../core/geometry';
import {
  DEG,
  angleDeg,
  boundsOfPoints,
  closestPointOnSegment,
  dist,
  snapAngle,
  unionRect,
  obbCorners,
} from '../core/geometry';
import type { Store } from '../core/store';
import type { Guide } from './guides';

export interface NearestWall {
  wall: Wall;
  offset: number;
  dist: number;
  length: number;
}

export function nearestWall(plan: Plan, point: Vec2, maxDist: number): NearestWall | null {
  let best: NearestWall | null = null;
  for (const wall of plan.walls) {
    const hit = closestPointOnSegment(point, wall.a, wall.b);
    if (hit.dist > maxDist) continue;
    const length = dist(wall.a, wall.b);
    const offset = hit.t * length;
    if (!best || hit.dist < best.dist) best = { wall, offset, dist: hit.dist, length };
  }
  return best;
}

/** Prende um ponto em cantos de paredes/cômodos e na grade. */
export function snapDrawPoint(store: Store, point: Vec2, thresholdPx = 14): Vec2 {
  const threshold = thresholdPx / store.view.zoom;
  let best = point;
  let bestDist = threshold;

  for (const wall of store.doc.walls) {
    for (const endpoint of [wall.a, wall.b]) {
      const d = dist(point, endpoint);
      if (d < bestDist) {
        bestDist = d;
        best = { x: endpoint.x, y: endpoint.y };
      }
    }
  }
  for (const room of store.doc.rooms) {
    for (const vertex of room.points) {
      const d = dist(point, vertex);
      if (d < bestDist) {
        bestDist = d;
        best = { x: vertex.x, y: vertex.y };
      }
    }
  }
  if (bestDist < threshold) return best;

  if (store.doc.settings.snap) {
    const grid = store.doc.settings.grid || 10;
    return { x: Math.round(point.x / grid) * grid, y: Math.round(point.y / grid) * grid };
  }
  return point;
}

/** Mantém o segmento em múltiplos de 15° e comprimento múltiplo de 5 cm. */
export function constrainSegment(a: Vec2, b: Vec2, enabled = true): Vec2 {
  if (!enabled) return b;
  const len = dist(a, b);
  if (len < 0.5) return b;
  const angle = snapAngle(angleDeg(a, b), 15);
  const snappedLen = Math.max(5, Math.round(len / 5) * 5);
  const rad = angle * DEG;
  return { x: a.x + Math.cos(rad) * snappedLen, y: a.y + Math.sin(rad) * snappedLen };
}

function entityBounds(store: Store, id: string): Rect | null {
  const item = store.findItem(id);
  if (item) return itemBounds(item);
  const wall = store.findWall(id);
  if (wall) return boundsOfPoints([wall.a, wall.b]);
  const room = store.findRoom(id);
  if (room) return boundsOfPoints(room.points);
  return null;
}

export function boundsOfIds(store: Store, ids: string[]): Rect | null {
  let rect: Rect | null = null;
  for (const id of ids) {
    const b = entityBounds(store, id);
    if (b) rect = unionRect(rect, b);
  }
  return rect;
}

function movedBounds(rect: Rect, delta: Vec2): Rect {
  return { x: rect.x + delta.x, y: rect.y + delta.y, w: rect.w, h: rect.h };
}

interface Candidate {
  delta: number;
  target: number;
  guide?: { min: number; max: number };
}

export interface MoveSnap {
  offset: Vec2;
  guides: Guide[];
}

/** Calcula o deslocamento final de um arraste, alinhando bordas e centros. */
export function computeMoveSnap(
  store: Store,
  ids: Set<string>,
  bbox: Rect,
  raw: Vec2,
  thresholdPx = 9,
): MoveSnap {
  const snapEnabled = store.doc.settings.snap;
  const threshold = thresholdPx / store.view.zoom;
  const grid = store.doc.settings.grid || 10;
  const moved = movedBounds(bbox, raw);

  const xCandidates: Candidate[] = [];
  const yCandidates: Candidate[] = [];

  if (snapEnabled) {
    for (const anchor of [moved.x, moved.x + moved.w / 2, moved.x + moved.w]) {
      const target = Math.round(anchor / grid) * grid;
      xCandidates.push({ delta: target - anchor, target });
    }
    for (const anchor of [moved.y, moved.y + moved.h / 2, moved.y + moved.h]) {
      const target = Math.round(anchor / grid) * grid;
      yCandidates.push({ delta: target - anchor, target });
    }
  }

  const others: Rect[] = [];
  for (const item of store.doc.items) {
    if (ids.has(item.id) || item.hidden) continue;
    others.push(itemBounds(item));
  }
  for (const wall of store.doc.walls) {
    if (ids.has(wall.id)) continue;
    others.push(boundsOfPoints([wall.a, wall.b]));
  }
  for (const room of store.doc.rooms) {
    if (ids.has(room.id)) continue;
    others.push(boundsOfPoints(room.points));
  }

  for (const other of others) {
    const minY = Math.min(moved.y, other.y);
    const maxY = Math.max(moved.y + moved.h, other.y + other.h);
    for (const anchor of [moved.x, moved.x + moved.w / 2, moved.x + moved.w]) {
      for (const target of [other.x, other.x + other.w / 2, other.x + other.w]) {
        if (Math.abs(target - anchor) > threshold) continue;
        xCandidates.push({ delta: target - anchor, target, guide: { min: minY, max: maxY } });
      }
    }
    const minX = Math.min(moved.x, other.x);
    const maxX = Math.max(moved.x + moved.w, other.x + other.w);
    for (const anchor of [moved.y, moved.y + moved.h / 2, moved.y + moved.h]) {
      for (const target of [other.y, other.y + other.h / 2, other.y + other.h]) {
        if (Math.abs(target - anchor) > threshold) continue;
        yCandidates.push({ delta: target - anchor, target, guide: { min: minX, max: maxX } });
      }
    }
  }

  const pick = (candidates: Candidate[], wanted: number): Candidate | null => {
    let best: Candidate | null = null;
    let bestScore = Infinity;
    for (const candidate of candidates) {
      const score = Math.abs(candidate.delta - wanted);
      if (score > threshold) continue;
      if (score < bestScore) {
        bestScore = score;
        best = candidate;
      }
    }
    return best;
  };

  const bestX = pick(xCandidates, 0);
  const bestY = pick(yCandidates, 0);
  const offset: Vec2 = { x: raw.x + (bestX ? bestX.delta : 0), y: raw.y + (bestY ? bestY.delta : 0) };
  const guides: Guide[] = [];
  const finalBox = movedBounds(bbox, offset);

  if (bestX?.guide) {
    guides.push({
      a: { x: bestX.target, y: bestX.guide.min + (offset.y - raw.y) },
      b: { x: bestX.target, y: bestX.guide.max + (offset.y - raw.y) },
      kind: 'align',
    });
  }
  if (bestY?.guide) {
    guides.push({
      a: { x: bestY.guide.min + (offset.x - raw.x), y: bestY.target },
      b: { x: bestY.guide.max + (offset.x - raw.x), y: bestY.target },
      kind: 'align',
    });
  }
  void finalBox;
  return { offset, guides };
}

/** Cantos de um móvel para marquise/hit test. */
export function itemCorners(x: number, y: number, w: number, d: number, rot: number): Vec2[] {
  return obbCorners({ x, y }, w, d, rot);
}
