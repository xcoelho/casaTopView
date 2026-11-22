import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, grain, line, shade } from '../../catalog/draw';

export function top(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  color: string,
  radius = 5,
): void {
  box(ctx, 0, 0, w, d, radius, color, alpha(shade(color, -0.62), 0.45), 1.7);
  grain(ctx, 2, 2, w - 4, d - 4, color, 13);
  box(ctx, 3.5, 3.5, w - 7, d - 7, Math.max(radius - 2, 1), null, alpha('#ffffff', 0.4), 1);
}

export function legs(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  color: string,
  r = 3.4,
): void {
  const dark = shade(color, -0.3);
  for (const [x, y] of [
    [9, 9],
    [w - 9, 9],
    [9, d - 9],
    [w - 9, d - 9],
  ]) {
    circle(ctx, x, y, r, dark, alpha('#241c14', 0.3), 1);
  }
}
