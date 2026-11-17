/** Ferramenta de desenho de paredes. */
import type { Vec2 } from '../core/geometry';
import { angleDeg, dist } from '../core/geometry';
import { constrainSegment, snapDrawPoint } from './snapping';
import type { ToolDeps, ToolHandler } from './types';

export function createWallTool(deps: ToolDeps): ToolHandler {
  const { store } = deps;
  let points: Vec2[] = [];
  let downPoint: Vec2 | null = null;
  let shiftHeld = false;

  const thickness = (): number => store.doc.settings.wallThickness;

  function target(world: Vec2): Vec2 {
    // Shift ignora todos os encaixes, como nas demais ferramentas.
    if (shiftHeld) return world;
    const snapped = snapDrawPoint(store, world);
    if (store.doc.settings.snap) return snapped;
    const last = points[points.length - 1];
    return last ? constrainSegment(last, snapped, true) : snapped;
  }

  function preview(world: Vec2): void {
    const last = points[points.length - 1];
    if (!last) {
      store.setOverlay(null);
      return;
    }
    const end = target(world);
    const length = dist(last, end);
    store.setOverlay({
      type: 'wall',
      a: last,
      b: end,
      angle: angleDeg(last, end),
      length,
      valid: length >= 8,
    });
  }

  function reset(): void {
    points = [];
    downPoint = null;
    store.setOverlay(null);
  }

  return {
    down(world, _screen, event) {
      shiftHeld = event.shiftKey;
      const point = target(world);
      if (!points.length) {
        points = [point];
        downPoint = point;
        preview(world);
        return;
      }
      const last = points[points.length - 1];
      const end = target(world);
      if (dist(last, end) >= 8) {
        store.insertWall(last, end, thickness());
        points.push(end);
      }
      preview(world);
    },
    move(world, _screen, event) {
      shiftHeld = event.shiftKey;
      preview(world);
    },
    up(world) {
      const end = target(world);
      if (points.length === 1 && downPoint && dist(downPoint, end) > 15) {
        store.insertWall(downPoint, end, thickness());
        reset();
        return;
      }
      downPoint = null;
      if (points.length) preview(world);
    },
    finish() {
      reset();
    },
    cancel() {
      reset();
    },
  };
}
