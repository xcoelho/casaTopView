/** Ferramenta de criação de cômodos (polígonos de piso). */
import type { Vec2 } from '../core/geometry';
import { dist } from '../core/geometry';
import { snapDrawPoint } from './snapping';
import type { ToolDeps, ToolHandler } from './types';

export function createRoomTool(deps: ToolDeps): ToolHandler {
  const { store, notify } = deps;
  let points: Vec2[] = [];

  function preview(cursor: Vec2): void {
    store.setOverlay({ type: 'room', points: [...points], cursor });
  }

  function reset(): void {
    points = [];
    store.setOverlay(null);
  }

  function finish(): void {
    if (points.length >= 3) {
      const room = store.insertRoom(points, store.roomName, store.roomFloor);
      if (room) notify(`Cômodo "${room.name}" criado — renomeie no inspetor`);
    }
    reset();
  }

  return {
    down(world) {
      const point = snapDrawPoint(store, world);
      if (points.length >= 3) {
        const first = points[0];
        if (dist(point, first) * store.view.zoom < 16) {
          finish();
          return;
        }
      }
      points.push(point);
      preview(point);
    },
    move(world, _screen, event) {
      if (!points.length) return;
      const point = event.shiftKey ? world : snapDrawPoint(store, world);
      preview(point);
    },
    up() {
      /* fechamento por clique */
    },
    finish,
    cancel: reset,
  };
}
