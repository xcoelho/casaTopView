/** Hit test e seleção por marquise. */
import { itemBounds } from '../core/document';
import type { Store } from '../core/store';
import type { Rect, Vec2 } from '../core/geometry';
import {
  closestPointOnSegment,
  dist,
  pointInObb,
  pointInPolygon,
  rectContains,
} from '../core/geometry';
import { drawOrder } from '../catalog/registry';

export function hitTest(store: Store, world: Vec2, tolerance = 10): string | null {
  const plan = store.doc;

  const items = [...plan.items].filter((item) => !item.hidden).sort((a, b) => drawOrder(b, a));
  for (const item of items) {
    if (
      pointInObb(
        world,
        { x: item.x, y: item.y },
        item.w + tolerance * 2,
        item.d + tolerance * 2,
        item.rot,
      )
    ) {
      return item.id;
    }
  }

  for (const opening of plan.openings) {
    const wall = plan.walls.find((w) => w.id === opening.wallId);
    if (!wall) continue;
    const hit = closestPointOnSegment(world, wall.a, wall.b);
    const along = hit.t * dist(wall.a, wall.b);
    if (
      hit.dist <= wall.thickness / 2 + tolerance &&
      Math.abs(along - opening.offset) <= opening.width / 2 + tolerance
    ) {
      return opening.id;
    }
  }

  for (const wall of plan.walls) {
    const hit = closestPointOnSegment(world, wall.a, wall.b);
    if (hit.dist <= wall.thickness / 2 + tolerance) return wall.id;
  }

  const rooms = [...plan.rooms].reverse();
  for (const room of rooms) {
    if (pointInPolygon(world, room.points)) return room.id;
  }
  return null;
}

export function marqueeIds(store: Store, rect: Rect): string[] {
  const ids: string[] = [];
  const plan = store.doc;

  for (const item of plan.items) {
    if (item.hidden) continue;
    const box = itemBounds(item);
    const center = { x: box.x + box.w / 2, y: box.y + box.h / 2 };
    if (rectContains(rect, box) || rectContains(rect, center)) ids.push(item.id);
  }

  for (const wall of plan.walls) {
    const mid = { x: (wall.a.x + wall.b.x) / 2, y: (wall.a.y + wall.b.y) / 2 };
    if ((rectContains(rect, wall.a) && rectContains(rect, wall.b)) || rectContains(rect, mid)) {
      ids.push(wall.id);
    }
  }

  for (const room of plan.rooms) {
    const inside = room.points.filter((p) => rectContains(rect, p)).length;
    if (inside >= Math.max(2, Math.ceil(room.points.length * 0.6))) ids.push(room.id);
  }

  for (const opening of plan.openings) {
    const wall = plan.walls.find((w) => w.id === opening.wallId);
    if (!wall) continue;
    const length = dist(wall.a, wall.b);
    if (length <= 0) continue;
    const t = opening.offset / length;
    const point = {
      x: wall.a.x + (wall.b.x - wall.a.x) * t,
      y: wall.a.y + (wall.b.y - wall.a.y) * t,
    };
    if (rectContains(rect, point)) ids.push(opening.id);
  }

  return ids;
}
