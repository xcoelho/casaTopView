import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, cushion, line, shade } from '../../catalog/draw';

export function drawSofa(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  fabric: string,
  seats: number,
): void {
  const dark = shade(fabric, -0.15);
  const light = shade(fabric, 0.1);
  box(ctx, 0, 0, w, d, 9, fabric, alpha(shade(fabric, -0.5), 0.42), 1.6);
  box(ctx, 3, 2, w - 6, 21, 6, dark, alpha(shade(fabric, -0.55), 0.3), 1.2);
  const arm = 15;
  box(ctx, 2, 18, arm, d - 21, 5, dark, alpha(shade(fabric, -0.55), 0.3), 1.2);
  box(ctx, w - 2 - arm, 18, arm, d - 21, 5, dark, alpha(shade(fabric, -0.55), 0.3), 1.2);
  const x0 = arm + 4;
  const x1 = w - arm - 4;
  const sw = (x1 - x0) / seats;
  for (let i = 0; i < seats; i++) {
    cushion(ctx, x0 + i * sw + 1.5, 24, sw - 3, d - 29, 5, light);
  }
  line(ctx, 4, d - 3.5, w - 4, d - 3.5, alpha('#2c241c', 0.16), 1.2);
}
