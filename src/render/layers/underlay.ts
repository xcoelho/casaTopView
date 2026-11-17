/** Imagem de referência desenhada sob a planta, para traçar plantas existentes. */
import type { Plan } from '../../core/document';
import { DEG } from '../../core/geometry';
import type { Camera } from '../viewport';

interface LoadedImage {
  img: HTMLImageElement;
  ready: boolean;
  listeners: Set<() => void>;
}

const cache = new Map<string, LoadedImage>();

function imageFor(src: string, onReady?: () => void): HTMLImageElement | null {
  let entry = cache.get(src);
  if (!entry) {
    const img = new Image();
    const created: LoadedImage = { img, ready: false, listeners: new Set() };
    entry = created;
    img.addEventListener('load', () => {
      created.ready = true;
      for (const listener of created.listeners) listener();
      created.listeners.clear();
    });
    img.addEventListener('error', () => created.listeners.clear());
    img.src = src;
    cache.set(src, created);
  }
  if (!entry.ready && onReady) entry.listeners.add(onReady);
  return entry.ready ? entry.img : null;
}

export function drawUnderlay(
  ctx: CanvasRenderingContext2D,
  plan: Plan,
  cam: Camera,
  dpr: number,
  onReady?: () => void,
): void {
  const underlay = plan.underlay;
  if (!underlay || !underlay.visible || underlay.w < 1 || underlay.h < 1) return;
  const img = imageFor(underlay.image, onReady);
  if (!img) return;

  const cx = underlay.x + underlay.w / 2;
  const cy = underlay.y + underlay.h / 2;
  ctx.save();
  ctx.setTransform(dpr * cam.zoom, 0, 0, dpr * cam.zoom, dpr * cam.x, dpr * cam.y);
  ctx.globalAlpha = Math.min(1, Math.max(0.02, underlay.opacity));
  ctx.translate(cx, cy);
  ctx.rotate(underlay.rot * DEG);
  ctx.drawImage(img, -underlay.w / 2, -underlay.h / 2, underlay.w, underlay.h);
  ctx.restore();
}
