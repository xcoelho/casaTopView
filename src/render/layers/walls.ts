/** Paredes desenhadas como blocos com os vãos das aberturas. */
import type { Plan, Wall } from '../../core/document';
import { wallParts } from '../../core/document';
import { THEME } from '../theme';
import type { Camera } from '../viewport';

export interface WallFrame {
  length: number;
  angle: number;
  dx: number;
  dy: number;
}

export function wallFrame(wall: Wall): WallFrame {
  const dx = wall.b.x - wall.a.x;
  const dy = wall.b.y - wall.a.y;
  return { length: Math.hypot(dx, dy), angle: Math.atan2(dy, dx), dx, dy };
}

export function drawWalls(
  ctx: CanvasRenderingContext2D,
  plan: Plan,
  cam: Camera,
  dpr: number,
): void {
  if (!plan.walls.length) return;
  ctx.setTransform(dpr * cam.zoom, 0, 0, dpr * cam.zoom, dpr * cam.x, dpr * cam.y);
  ctx.fillStyle = THEME.wallFill;

  for (const wall of plan.walls) {
    const frame = wallFrame(wall);
    if (frame.length < 0.5) continue;
    const parts = wallParts(wall, plan.openings);
    ctx.save();
    ctx.translate(wall.a.x, wall.a.y);
    ctx.rotate(frame.angle);
    for (const [start, end] of parts) {
      if (end - start <= 0.4) continue;
      ctx.fillRect(start, -wall.thickness / 2, end - start, wall.thickness);
    }
    if (parts.length) {
      // junções arredondadas para fechar cantos
      ctx.beginPath();
      ctx.arc(0, 0, wall.thickness / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(frame.length, 0, wall.thickness / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

/** Contorno de destaque usado em hover/seleção de parede. */
export function wallOutline(
  ctx: CanvasRenderingContext2D,
  wall: Wall,
  cam: Camera,
  dpr: number,
  color: string,
  width: number,
): void {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(wall.a.x * cam.zoom + cam.x, wall.a.y * cam.zoom + cam.y);
  ctx.lineTo(wall.b.x * cam.zoom + cam.x, wall.b.y * cam.zoom + cam.y);
  ctx.stroke();
  ctx.restore();
}
