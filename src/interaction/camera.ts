/** Zoom por roda do mouse e pan da câmera. */
import type { Store } from '../core/store';
import type { Vec2 } from '../core/geometry';
import { panBy, zoomAt } from '../render/viewport';

export function attachWheelZoom(canvas: HTMLCanvasElement, store: Store): () => void {
  const onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const screen = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const intensity = event.ctrlKey ? 0.012 : 0.0022;
    const factor = Math.exp(-event.deltaY * intensity);
    store.setView(zoomAt(store.view, screen, factor));
  };
  canvas.addEventListener('wheel', onWheel, { passive: false });
  return () => canvas.removeEventListener('wheel', onWheel);
}

export function panCamera(store: Store, delta: Vec2): void {
  store.setView(panBy(store.view, delta.x, delta.y));
}

export function zoomAround(
  canvas: HTMLCanvasElement,
  store: Store,
  factor: number,
  anchor?: Vec2,
): void {
  const rect = canvas.getBoundingClientRect();
  const point = anchor ?? { x: rect.width / 2, y: rect.height / 2 };
  store.setView(zoomAt(store.view, point, factor));
}
