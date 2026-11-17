/** Rotação pela alça. */
import type { Plan } from '../core/document';
import type { Store } from '../core/store';
import type { Vec2 } from '../core/geometry';
import { normalizeAngle, snapAngle } from '../core/geometry';

export interface RotateSession {
  itemId: string;
  before: Plan;
  center: Vec2;
  startAngle: number;
  startRot: number;
}

export function beginRotate(store: Store, itemId: string, world: Vec2): RotateSession | null {
  const item = store.findItem(itemId);
  if (!item || item.locked) return null;
  const center = { x: item.x, y: item.y };
  return {
    itemId,
    before: store.snapshot(),
    center,
    startAngle: Math.atan2(world.y - center.y, world.x - center.x),
    startRot: item.rot,
  };
}

export function updateRotate(
  store: Store,
  session: RotateSession,
  world: Vec2,
  shiftKey: boolean,
): void {
  const item = store.findItem(session.itemId);
  if (!item) return;
  const angle = Math.atan2(world.y - session.center.y, world.x - session.center.x);
  let rot = session.startRot + ((angle - session.startAngle) * 180) / Math.PI;
  rot = normalizeAngle(rot);
  if (!shiftKey) rot = snapAngle(rot, 15);
  item.rot = normalizeAngle(rot);
  store.setGuides([
    {
      a: { x: session.center.x - 40, y: session.center.y },
      b: { x: session.center.x + 40, y: session.center.y },
      kind: 'align',
      label: `${Math.round(item.rot)}°`,
    },
  ]);
  store.emit();
}

export function endRotate(store: Store, session: RotateSession): void {
  store.setGuides([]);
  store.commit('Rotacionar', session.before);
}
