/** Alteração do comprimento das paredes: arraste das pontas e campo numérico. */
import type { Plan, Wall } from '../core/document';
import type { Store } from '../core/store';
import type { Vec2 } from '../core/geometry';
import { DEG, angleDeg, dist } from '../core/geometry';

export type WallEnd = 'a' | 'b';

export const MIN_WALL_LENGTH = 10;

export interface WallResizeSession {
  wallId: string;
  end: WallEnd;
  before: Plan;
  /** ponta que fica presa enquanto a outra se move */
  anchor: Vec2;
  /** ângulo original, da ponta presa para a ponta arrastada */
  angle: number;
}

export function wallLength(wall: Wall): number {
  return dist(wall.a, wall.b);
}

export function beginWallResize(
  store: Store,
  wallId: string,
  end: WallEnd,
): WallResizeSession | null {
  const wall = store.findWall(wallId);
  if (!wall) return null;
  const anchor = { ...(end === 'a' ? wall.b : wall.a) };
  const moving = end === 'a' ? wall.a : wall.b;
  if (dist(anchor, moving) < 0.5) return null;
  return { wallId, end, before: store.snapshot(), anchor, angle: angleDeg(anchor, moving) };
}

/** Mantém as aberturas dentro da parede depois de encurtá-la. */
export function clampWallOpenings(store: Store, wall: Wall): void {
  const length = wallLength(wall);
  for (const opening of store.doc.openings) {
    if (opening.wallId !== wall.id) continue;
    opening.width = Math.min(opening.width, Math.max(MIN_WALL_LENGTH, length));
    const half = opening.width / 2;
    opening.offset = Math.min(Math.max(opening.offset, half), Math.max(half, length - half));
  }
}

/** Canto de parede ou de cômodo próximo, para a ponta se prender na estrutura. */
function nearbyEndpoint(
  store: Store,
  wallId: string,
  point: Vec2,
  thresholdPx = 14,
): Vec2 | null {
  const threshold = thresholdPx / Math.max(store.view.zoom, 0.0001);
  let best: Vec2 | null = null;
  let bestDist = threshold;

  for (const wall of store.doc.walls) {
    if (wall.id === wallId) continue;
    for (const endpoint of [wall.a, wall.b]) {
      const d = dist(point, endpoint);
      if (d < bestDist) {
        bestDist = d;
        best = endpoint;
      }
    }
  }
  for (const room of store.doc.rooms) {
    for (const vertex of room.points) {
      const d = dist(point, vertex);
      if (d < bestDist) {
        bestDist = d;
        best = vertex;
      }
    }
  }
  return best;
}

export function updateWallResize(
  store: Store,
  session: WallResizeSession,
  world: Vec2,
  shiftKey: boolean,
): void {
  const wall = store.findWall(session.wallId);
  if (!wall) return;

  const rad = session.angle * DEG;
  const ux = Math.cos(rad);
  const uy = Math.sin(rad);
  // O ponteiro desliza apenas sobre o eixo da parede: o ângulo não muda.
  const rawLength = (world.x - session.anchor.x) * ux + (world.y - session.anchor.y) * uy;
  let length = Math.max(MIN_WALL_LENGTH, rawLength);

  const pointAt = (value: number): Vec2 => ({
    x: session.anchor.x + ux * value,
    y: session.anchor.y + uy * value,
  });

  let point = pointAt(length);
  if (!shiftKey) {
    const nearby = nearbyEndpoint(store, wall.id, point);
    if (nearby && dist(session.anchor, nearby) >= MIN_WALL_LENGTH) {
      point = { ...nearby };
    } else if (store.doc.settings.snap) {
      length = Math.max(MIN_WALL_LENGTH, Math.round(length / 5) * 5);
      point = pointAt(length);
    }
  }

  if (session.end === 'a') wall.a = point;
  else wall.b = point;

  clampWallOpenings(store, wall);
  store.emit();
}

export function endWallResize(store: Store, session: WallResizeSession): void {
  store.commit('Comprimento da parede', session.before);
  store.emit();
}

/** Define o comprimento mantendo a ponta inicial e o ângulo da parede. */
export function setWallLength(store: Store, wall: Wall, length: number): void {
  const current = wallLength(wall);
  if (current < 0.5) return;
  const next = Math.max(MIN_WALL_LENGTH, length);
  const ux = (wall.b.x - wall.a.x) / current;
  const uy = (wall.b.y - wall.a.y) / current;
  store.tx('Comprimento da parede', () => {
    wall.b = { x: wall.a.x + ux * next, y: wall.a.y + uy * next };
    clampWallOpenings(store, wall);
  });
}
