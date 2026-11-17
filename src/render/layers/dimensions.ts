/** Cotas de comprimento por parede. */
import type { Plan } from '../../core/document';
import { fmtLength } from '../../core/units';
import type { Camera } from '../viewport';
import { worldToScreen } from '../viewport';
import { drawPill } from './guides';
import { wallFrame } from './walls';

export function drawDimensions(
  ctx: CanvasRenderingContext2D,
  plan: Plan,
  cam: Camera,
  dpr: number,
): void {
  if (!plan.walls.length || cam.zoom < 0.22) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  for (const wall of plan.walls) {
    const frame = wallFrame(wall);
    if (frame.length < 45) continue;
    const mid = worldToScreen(cam, {
      x: (wall.a.x + wall.b.x) / 2,
      y: (wall.a.y + wall.b.y) / 2,
    });
    // desloca perpendicularmente em pixels de tela
    const nx = -Math.sin(frame.angle);
    const ny = Math.cos(frame.angle);
    const offset = Math.max(14, (wall.thickness / 2) * cam.zoom + 12);
    drawPill(ctx, mid.x + nx * offset, mid.y + ny * offset, fmtLength(frame.length), {
      bg: 'rgba(255, 253, 248, 0.92)',
      color: 'rgba(60, 60, 56, 0.72)',
      size: 9.5,
    });
  }
}
