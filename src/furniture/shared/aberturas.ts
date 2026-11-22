import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, glass, line, metalBar } from '../../catalog/draw';

export const WALL = 'rgba(57, 64, 74, 0.55)';
export const FRAME = '#7f878e';

/** Símbolo de porta para miniaturas e prévia de arraste. */
export function doorSymbol(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  double: boolean,
  sliding: boolean,
): void {
  const mid = d / 2;
  box(ctx, 0, mid - 3, w, 6, 0, alpha('#39404a', 0.1), null);
  line(ctx, 0, mid - 4, 0, mid + 4, WALL, 2);
  line(ctx, w, mid - 4, w, mid + 4, WALL, 2);
  if (sliding) {
    metalBar(ctx, 3, mid - 5, w * 0.58, 3, FRAME, 1);
    metalBar(ctx, w * 0.4, mid + 1, w * 0.58, 3, FRAME, 1);
    return;
  }
  const leaf = double ? w / 2 : w;
  const hingeX = 0;
  ctx.save();
  ctx.strokeStyle = alpha('#39404a', 0.75);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(hingeX, mid);
  ctx.lineTo(hingeX, mid - leaf);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(hingeX, mid, leaf, -Math.PI / 2, 0, false);
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = alpha('#39404a', 0.4);
  ctx.stroke();
  ctx.restore();
  if (double) {
    ctx.save();
    ctx.strokeStyle = alpha('#39404a', 0.75);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(w, mid);
    ctx.lineTo(w, mid - leaf);
    ctx.stroke();
    ctx.restore();
  }
}

export function windowSymbol(ctx: CanvasRenderingContext2D, w: number, d: number, panes: number): void {
  const mid = d / 2;
  box(ctx, 0, mid - 4, w, 8, 0, alpha('#cfe3e8', 0.7), WALL, 1.4);
  for (let i = 1; i <= panes; i++) {
    line(ctx, (w / (panes + 1)) * i, mid - 4, (w / (panes + 1)) * i, mid + 4, alpha('#6c7b80', 0.6), 1.2);
  }
  line(ctx, 0, mid, w, mid, alpha('#6c7b80', 0.35), 1);
}
