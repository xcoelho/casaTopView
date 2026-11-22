import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, cushion, grain, knob, line, shade } from '../../catalog/draw';

export function bed(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  wood: string,
  linen: string,
  pillows: number,
): void {
  const frame = shade(wood, -0.1);
  box(ctx, 0, 0, w, d, 7, frame, alpha('#3a2a1c', 0.4), 1.6);
  grain(ctx, 1, 1, w - 2, d - 2, wood, 16);
  // cabeceira
  box(ctx, 2, 1.5, w - 4, 12, 4, shade(wood, -0.22), alpha('#2c2014', 0.35), 1.2);
  // colchão
  box(ctx, 5, 14, w - 10, d - 19, 6, '#f6f1e4', alpha('#8a7a63', 0.4), 1.3);
  // edredom
  box(ctx, 5, 52, w - 10, d - 57, 6, linen, alpha(shade(linen, -0.4), 0.4), 1.3);
  line(ctx, 7, 58, w - 7, 58, alpha('#ffffff', 0.55), 1.6);
  // travesseiros
  const gap = 6;
  const pw = (w - 10 - gap * (pillows + 1)) / pillows;
  for (let i = 0; i < pillows; i++) {
    cushion(ctx, 10 + i * (pw + gap), 18, pw, 26, 6, '#fbf6ea');
  }
}
