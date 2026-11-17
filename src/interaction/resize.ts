/** Redimensionamento pelas alças. */
import type { Plan } from '../core/document';
import type { Store } from '../core/store';
import type { Vec2 } from '../core/geometry';
import type { HandleId } from '../render/layers/selection';

export interface ResizeSession {
  itemId: string;
  handle: HandleId;
  before: Plan;
  origin: { x: number; y: number; w: number; d: number; rot: number };
  minSize: number;
}

const SIDES: Record<string, [number, number]> = {
  nw: [-1, -1],
  n: [0, -1],
  ne: [1, -1],
  e: [1, 0],
  se: [1, 1],
  s: [0, 1],
  sw: [-1, 1],
  w: [-1, 0],
};

export function beginResize(
  store: Store,
  itemId: string,
  handle: HandleId,
  minSize = 12,
): ResizeSession | null {
  const item = store.findItem(itemId);
  if (!item || handle === 'rotate') return null;
  return {
    itemId,
    handle,
    before: store.snapshot(),
    origin: { x: item.x, y: item.y, w: item.w, d: item.d, rot: item.rot },
    minSize,
  };
}

export function updateResize(
  store: Store,
  session: ResizeSession,
  world: Vec2,
  shiftKey: boolean,
): void {
  const item = store.findItem(session.itemId);
  if (!item) return;
  const { origin, handle } = session;
  const [sx, sy] = SIDES[handle] ?? [0, 0];
  const rad = (origin.rot * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const dx = world.x - origin.x;
  const dy = world.y - origin.y;
  const lx = dx * cos + dy * sin;
  const ly = -dx * sin + dy * cos;

  const anchorX = (-sx * origin.w) / 2;
  const anchorY = (-sy * origin.d) / 2;

  let newW = origin.w;
  let newD = origin.d;
  if (sx !== 0) newW = (lx - anchorX) * sx;
  if (sy !== 0) newD = (ly - anchorY) * sy;

  newW = Math.max(session.minSize, newW);
  newD = Math.max(session.minSize, newD);

  if (shiftKey && sx !== 0 && sy !== 0) {
    const scale = Math.max(newW / origin.w, newD / origin.d);
    newW = origin.w * scale;
    newD = origin.d * scale;
  }

  const step = store.doc.settings.snap ? 5 : 1;
  newW = Math.max(session.minSize, Math.round(newW / step) * step);
  newD = Math.max(session.minSize, Math.round(newD / step) * step);

  const anchorWorldX = origin.x + anchorX * cos - anchorY * sin;
  const anchorWorldY = origin.y + anchorX * sin + anchorY * cos;

  item.w = newW;
  item.d = newD;
  item.x = anchorWorldX + ((sx * newW) / 2) * cos - ((sy * newD) / 2) * sin;
  item.y = anchorWorldY + ((sx * newW) / 2) * sin + ((sy * newD) / 2) * cos;
  store.emit();
}

export function endResize(store: Store, session: ResizeSession): void {
  store.commit('Redimensionar', session.before);
}
