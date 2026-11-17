/** Arrastar móveis do catálogo para a planta. */
import { getDef } from '../catalog/registry';
import type { Store } from '../core/store';
import { itemThumb } from '../render/thumbnail';
import type { Renderer } from '../render/renderer';
import { screenToWorld } from '../render/viewport';
import { nearestWall } from './snapping';

export interface PaletteDropDeps {
  store: Store;
  renderer: Renderer;
  notify: (message: string) => void;
}

interface DragSession {
  defId: string;
  pointerId: number;
  startX: number;
  startY: number;
  active: boolean;
  ghost: HTMLElement | null;
  overCanvas: boolean;
}

export function attachPaletteDrop(
  container: HTMLElement,
  canvas: HTMLCanvasElement,
  deps: PaletteDropDeps,
): () => void {
  const { store, renderer, notify } = deps;
  let session: DragSession | null = null;

  function canvasPoint(event: PointerEvent): { screen: { x: number; y: number }; world: { x: number; y: number } } | null {
    const rect = canvas.getBoundingClientRect();
    const screen = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (screen.x < 0 || screen.y < 0 || screen.x > rect.width || screen.y > rect.height) return null;
    return { screen, world: screenToWorld(store.view, screen) };
  }

  function snappedWorld(world: { x: number; y: number }): { x: number; y: number } {
    if (!store.doc.settings.snap) return world;
    const grid = store.doc.settings.grid || 10;
    return { x: Math.round(world.x / grid) * grid, y: Math.round(world.y / grid) * grid };
  }

  function createGhost(defId: string): HTMLElement | null {
    const def = getDef(defId);
    if (!def) return null;
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    const img = document.createElement('img');
    img.src = itemThumb(def, 96, 68);
    img.alt = '';
    img.style.width = '84px';
    img.style.height = '60px';
    ghost.appendChild(img);
    document.body.appendChild(ghost);
    return ghost;
  }

  function cleanup(): void {
    session?.ghost?.remove();
    session = null;
    store.setOverlay(null);
  }

  function place(defId: string, world: { x: number; y: number }): void {
    const def = getDef(defId);
    if (!def) return;
    if (def.kind === 'opening' && def.opening) {
      const near = nearestWall(store.doc, world, 90 / store.view.zoom);
      if (!near) {
        notify('Solte a porta ou janela sobre uma parede');
        return;
      }
      const width = Math.max(1, Math.min(def.opening.width, near.length - 10));
      const half = width / 2;
      const offset = Math.max(half, Math.min(near.length - half, Math.round(near.offset / 5) * 5));
      store.insertOpening(near.wall, offset, def.opening.kind, width);
      return;
    }
    store.insertItem(defId, world.x, world.y);
  }

  function onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement | null;
    const card = target?.closest<HTMLElement>('.cat-card');
    if (!card || !card.dataset.def) return;
    event.preventDefault();
    session = {
      defId: card.dataset.def,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
      ghost: null,
      overCanvas: false,
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(event: PointerEvent): void {
    if (!session) return;
    const moved = Math.hypot(event.clientX - session.startX, event.clientY - session.startY);
    if (!session.active && moved < 5) return;
    if (!session.active) {
      session.active = true;
      session.ghost = createGhost(session.defId);
    }
    if (session.ghost) {
      session.ghost.style.left = `${event.clientX}px`;
      session.ghost.style.top = `${event.clientY}px`;
    }

    const point = canvasPoint(event);
    session.overCanvas = !!point;
    if (!point) {
      store.setOverlay(null);
      store.setGuides([]);
      return;
    }
    const def = getDef(session.defId);
    if (!def) return;
    if (def.kind === 'opening' && def.opening) {
      const near = nearestWall(store.doc, point.world, 90 / store.view.zoom);
      if (near) {
        const width = Math.max(1, Math.min(def.opening.width, near.length - 10));
        const half = width / 2;
        store.setOverlay({
          type: 'wallTarget',
          wallId: near.wall.id,
          offset: Math.max(half, Math.min(near.length - half, near.offset)),
          width,
        });
      } else {
        store.setOverlay(null);
      }
      return;
    }
    const world = snappedWorld(point.world);
    store.setOverlay({
      type: 'ghost',
      defId: session.defId,
      x: world.x,
      y: world.y,
      rot: 0,
      w: def.w,
      d: def.d,
    });
  }

  function onPointerUp(event: PointerEvent): void {
    if (!session) return;
    const defId = session.defId;
    const wasActive = session.active;
    const point = canvasPoint(event);
    const world = point ? snappedWorld(point.world) : null;
    cleanup();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);

    if (wasActive) {
      if (point && world) place(defId, world);
      renderer.invalidate();
      return;
    }
    // clique simples: insere no centro da vista
    const center = store.viewCenter(renderer.width, renderer.height);
    place(defId, snappedWorld(center));
    renderer.invalidate();
  }

  container.addEventListener('pointerdown', onPointerDown);

  return () => {
    container.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    cleanup();
  };
}
