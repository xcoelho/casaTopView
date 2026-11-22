import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, grain, hatch, line, shade } from '../../catalog/draw';

export function leaves(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  count: number,
  radius: number,
  color: string,
): void {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + 0.4;
    const dist = radius * (0.45 + 0.35 * ((i % 3) / 2));
    const lx = cx + Math.cos(angle) * dist;
    const ly = cy + Math.sin(angle) * dist;
    ctx.beginPath();
    ctx.ellipse(lx, ly, radius * 0.34, radius * 0.17, angle, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 ? color : shade(color, -0.12);
    ctx.fill();
    ctx.strokeStyle = alpha(shade(color, -0.45), 0.4);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
