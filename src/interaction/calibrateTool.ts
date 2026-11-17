/** Ferramenta temporária: dois cliques marcam a medida conhecida da imagem de fundo. */
import type { Vec2 } from '../core/geometry';
import { dist } from '../core/geometry';
import type { ToolDeps, ToolHandler } from './types';

export function createCalibrateTool(
  deps: ToolDeps,
  onMeasure: (a: Vec2, b: Vec2) => void,
): ToolHandler {
  const { store, notify } = deps;
  let start: Vec2 | null = null;

  function clear(): void {
    start = null;
    store.setOverlay(null);
  }

  function backToSelect(): void {
    if (store.tool === 'calibrate') store.setTool('select');
  }

  function complete(end: Vec2): void {
    if (!start) return;
    const a = start;
    if (dist(a, end) < 1) {
      clear();
      notify('Clique em dois pontos mais afastados para calibrar');
      backToSelect();
      return;
    }
    clear();
    onMeasure(a, end);
    backToSelect();
  }

  return {
    down(world) {
      if (!start) {
        start = world;
        store.setOverlay({ type: 'measure', a: world, b: world });
        return;
      }
      complete(world);
    },
    move(world) {
      if (!start) return;
      store.setOverlay({ type: 'measure', a: start, b: world });
    },
    up() {
      /* calibragem por dois cliques */
    },
    finish() {
      if (start && store.cursor) complete(store.cursor);
      else {
        clear();
        backToSelect();
      }
    },
    cancel() {
      clear();
      backToSelect();
    },
  };
}
