/** Ferramenta de medição livre. */
import type { Vec2 } from '../core/geometry';
import { snapDrawPoint } from './snapping';
import type { ToolDeps, ToolHandler } from './types';

export function createMeasureTool(deps: ToolDeps): ToolHandler {
  const { store } = deps;
  let start: Vec2 | null = null;

  function clear(): void {
    start = null;
    store.setOverlay(null);
  }

  return {
    down(world) {
      start = snapDrawPoint(store, world);
      store.setOverlay({ type: 'measure', a: start, b: start });
    },
    move(world, _screen, event) {
      if (!start) return;
      const end = event.shiftKey ? world : snapDrawPoint(store, world);
      store.setOverlay({ type: 'measure', a: start, b: end });
    },
    up() {
      /* medida permanece até a próxima */
    },
    finish: clear,
    cancel: clear,
  };
}
