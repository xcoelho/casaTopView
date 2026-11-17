/** Ferramenta de inserir portas e janelas em paredes. */
import type { Vec2 } from '../core/geometry';
import { nearestWall } from './snapping';
import type { ToolDeps, ToolHandler } from './types';

export const DEFAULT_DOOR_WIDTH = 90;
export const DEFAULT_WINDOW_WIDTH = 140;

export function createOpeningTool(deps: ToolDeps, mode: 'porta' | 'janela'): ToolHandler {
  const { store, notify } = deps;
  const width = mode === 'porta' ? DEFAULT_DOOR_WIDTH : DEFAULT_WINDOW_WIDTH;
  let notified = false;

  function targetAt(world: Vec2) {
    const plan = store.doc;
    const near = nearestWall(plan, world, 70 / store.view.zoom);
    if (!near) return null;
    const w = Math.max(1, Math.min(width, near.length - 10));
    const half = w / 2;
    let offset = Math.round(near.offset / 5) * 5;
    offset = Math.max(half, Math.min(near.length - half, offset));
    return { wall: near.wall, offset, width: w };
  }

  function update(world: Vec2): void {
    const target = targetAt(world);
    if (!target) {
      store.setOverlay(null);
      return;
    }
    store.setOverlay({
      type: 'wallTarget',
      wallId: target.wall.id,
      offset: target.offset,
      width: target.width,
    });
  }

  return {
    down(world) {
      const target = targetAt(world);
      if (!target) {
        if (!notified) {
          notify('Passe o mouse sobre uma parede para inserir');
          notified = true;
        }
        return;
      }
      store.insertOpening(
        target.wall,
        target.offset,
        mode === 'porta' ? 'porta' : 'janela',
        target.width,
      );
      store.setOverlay(null);
      notify(
        mode === 'porta'
          ? 'Porta inserida — ajuste largura e lado no inspetor'
          : 'Janela inserida — ajuste largura no inspetor',
      );
    },
    move(world) {
      update(world);
    },
    up() {
      /* inserção no clique */
    },
    finish() {
      store.setOverlay(null);
      store.setTool('select');
    },
    cancel() {
      store.setOverlay(null);
    },
  };
}
