/** Itens de closet: ilha central, arara e closets abertos por tamanho. */
import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, grain, line, metalBar, shade } from '../../catalog/draw';

export function drawClosetAberto(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  colors: Record<string, string>,
  cols: number,
): void {
  box(ctx, 0, 0, w, d, 3, colors.main, alpha('#3a2a1c', 0.42), 1.6);
  grain(ctx, 1, 1, w - 2, d - 2, colors.main, 12, true);
  const cw = w / cols;
  for (let i = 1; i < cols; i++) {
    line(ctx, cw * i, 2, cw * i, d - 2, alpha('#3a2a1c', 0.35), 1.5);
  }
  for (let c = 0; c < cols; c++) {
    const x = cw * c;
    line(ctx, x + 5, 6, x + cw - 5, 6, alpha('#6c7077', 0.8), 2);
    const cloth = ['#b46a55', '#5b7c8d', '#8f9a76', '#c2a469', '#7a6a8a'];
    const n = 3 + (c % 2);
    for (let i = 0; i < n; i++) {
      const bx = x + 8 + i * ((cw - 16) / n);
      ctx.fillStyle = cloth[(c + i) % cloth.length];
      ctx.globalAlpha = 0.8;
      ctx.fillRect(bx, 9, (cw - 16) / n - 2, d * 0.3);
      ctx.globalAlpha = 1;
    }
    line(ctx, x + 5, d * 0.48, x + cw - 5, d * 0.48, alpha('#3a2a1c', 0.3), 1.3);
    ctx.fillStyle = alpha(colors.accent, 0.55);
    ctx.fillRect(x + 8, d * 0.52, cw - 16, d * 0.2);
    line(ctx, x + 8, d * 0.78, x + cw - 8, d * 0.78, alpha('#3a2a1c', 0.3), 1.3);
    box(ctx, x + cw / 2 - 9, d * 0.8, 18, d * 0.14, 1.4, alpha(shade(colors.main, -0.1), 0.8), null);
  }
}
