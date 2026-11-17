/** Portas, janelas e vãos desenhados sobre as paredes. */
import type { Opening, Plan } from '../../core/document';
import { THEME } from '../theme';
import type { Camera } from '../viewport';
import { wallFrame } from './walls';

const LEAF = '#39404a';
const FRAME = '#8d9498';

function jambs(ctx: CanvasRenderingContext2D, start: number, width: number, thickness: number): void {
  ctx.strokeStyle = 'rgba(24, 29, 35, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(start, -thickness / 2);
  ctx.lineTo(start, thickness / 2);
  ctx.moveTo(start + width, -thickness / 2);
  ctx.lineTo(start + width, thickness / 2);
  ctx.stroke();
}

function drawDoor(
  ctx: CanvasRenderingContext2D,
  opening: Opening,
  start: number,
  thickness: number,
): void {
  const w = opening.width;
  const side = opening.flip ? 1 : -1;
  const hingeAtStart = opening.hinge !== 'dir';
  const hingeX = hingeAtStart ? start : start + w;
  const closedAngle = hingeAtStart ? 0 : Math.PI;
  const openAngle = closedAngle + side * (Math.PI / 2) * 0.92;

  ctx.save();
  // soleira
  ctx.strokeStyle = 'rgba(24, 29, 35, 0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(start, 0);
  ctx.lineTo(start + w, 0);
  ctx.stroke();

  // folha aberta
  ctx.strokeStyle = LEAF;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.moveTo(hingeX, 0);
  ctx.lineTo(hingeX + Math.cos(openAngle) * w, Math.sin(openAngle) * w);
  ctx.stroke();

  // arco de abertura
  ctx.beginPath();
  ctx.setLineDash([5, 4]);
  ctx.strokeStyle = 'rgba(57, 64, 74, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.arc(
    hingeX,
    0,
    w,
    Math.min(closedAngle, openAngle),
    Math.max(closedAngle, openAngle),
  );
  ctx.stroke();
  ctx.restore();

  jambs(ctx, start, w, thickness);
}

function drawDoubleDoor(
  ctx: CanvasRenderingContext2D,
  opening: Opening,
  start: number,
  thickness: number,
): void {
  const w = opening.width / 2;
  const side = opening.flip ? 1 : -1;
  ctx.save();
  ctx.strokeStyle = 'rgba(24, 29, 35, 0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(start, 0);
  ctx.lineTo(start + w * 2, 0);
  ctx.stroke();

  ctx.strokeStyle = LEAF;
  ctx.lineWidth = 2.2;
  for (const mirror of [1, -1]) {
    const hingeX = mirror > 0 ? start : start + w * 2;
    const closed = mirror > 0 ? 0 : Math.PI;
    const open = closed + side * (Math.PI / 2) * 0.92;
    ctx.beginPath();
    ctx.moveTo(hingeX, 0);
    ctx.lineTo(hingeX + Math.cos(open) * w, Math.sin(open) * w);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = 'rgba(57, 64, 74, 0.42)';
    ctx.lineWidth = 1.2;
    ctx.arc(hingeX, 0, w, Math.min(closed, open), Math.max(closed, open));
    ctx.stroke();
    ctx.strokeStyle = LEAF;
    ctx.lineWidth = 2.2;
  }
  ctx.restore();
  jambs(ctx, start, opening.width, thickness);
}

function drawSliding(
  ctx: CanvasRenderingContext2D,
  opening: Opening,
  start: number,
  thickness: number,
): void {
  const w = opening.width;
  const panelW = w * 0.56;
  const side = opening.flip ? 1 : -1;
  ctx.save();
  ctx.fillStyle = 'rgba(57, 64, 74, 0.16)';
  ctx.fillRect(start, -thickness / 2, w, thickness);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.fillRect(start + 1, -thickness * 0.34, panelW, thickness * 0.3);
  ctx.fillRect(start + w - panelW - 1, thickness * 0.04, panelW, thickness * 0.3);
  ctx.strokeStyle = 'rgba(57, 64, 74, 0.6)';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(start + 1, -thickness * 0.34, panelW, thickness * 0.3);
  ctx.strokeRect(start + w - panelW - 1, thickness * 0.04, panelW, thickness * 0.3);
  ctx.restore();
  void side;
}

function drawGarage(
  ctx: CanvasRenderingContext2D,
  opening: Opening,
  start: number,
  thickness: number,
): void {
  const w = opening.width;
  ctx.save();
  ctx.fillStyle = 'rgba(57, 64, 74, 0.12)';
  ctx.fillRect(start, -thickness / 2, w, thickness);
  ctx.strokeStyle = 'rgba(57, 64, 74, 0.55)';
  ctx.lineWidth = 1.4;
  ctx.strokeRect(start, -thickness / 2, w, thickness);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(57, 64, 74, 0.35)';
  ctx.beginPath();
  for (let i = 1; i < 5; i++) {
    const y = -thickness / 2 + (thickness / 5) * i;
    ctx.moveTo(start + 1, y);
    ctx.lineTo(start + w - 1, y);
  }
  ctx.stroke();
  ctx.restore();
  jambs(ctx, start, w, thickness);
}

function drawWindow(
  ctx: CanvasRenderingContext2D,
  opening: Opening,
  start: number,
  thickness: number,
): void {
  const w = opening.width;
  const h = thickness * 0.62;
  const sliding = opening.kind === 'janela-correr';
  ctx.save();
  ctx.fillStyle = THEME.glass;
  ctx.fillRect(start, -h / 2, w, h);
  ctx.strokeStyle = 'rgba(80, 106, 112, 0.75)';
  ctx.lineWidth = 1.3;
  ctx.strokeRect(start, -h / 2, w, h);

  ctx.strokeStyle = 'rgba(80, 106, 112, 0.55)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  const panes = sliding ? 3 : 2;
  for (let i = 1; i <= panes; i++) {
    const x = start + (w / (panes + 1)) * i;
    ctx.moveTo(x, -h / 2);
    ctx.lineTo(x, h / 2);
  }
  ctx.moveTo(start, 0);
  ctx.lineTo(start + w, 0);
  ctx.stroke();

  ctx.restore();
  jambs(ctx, start, w, thickness);
  // peitoril
  ctx.save();
  ctx.strokeStyle = 'rgba(80, 106, 112, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(start, -thickness / 2);
  ctx.lineTo(start + w, -thickness / 2);
  ctx.moveTo(start, thickness / 2);
  ctx.lineTo(start + w, thickness / 2);
  ctx.stroke();
  ctx.restore();
}

export function drawOpenings(
  ctx: CanvasRenderingContext2D,
  plan: Plan,
  cam: Camera,
  dpr: number,
): void {
  if (!plan.openings.length) return;
  ctx.setTransform(dpr * cam.zoom, 0, 0, dpr * cam.zoom, dpr * cam.x, dpr * cam.y);

  for (const opening of plan.openings) {
    const wall = plan.walls.find((w) => w.id === opening.wallId);
    if (!wall) continue;
    const frame = wallFrame(wall);
    if (frame.length < 1) continue;
    const start = opening.offset - opening.width / 2;
    ctx.save();
    ctx.translate(wall.a.x, wall.a.y);
    ctx.rotate(frame.angle);
    switch (opening.kind) {
      case 'porta':
        drawDoor(ctx, opening, start, wall.thickness);
        break;
      case 'porta-dupla':
        drawDoubleDoor(ctx, opening, start, wall.thickness);
        break;
      case 'porta-correr':
        drawSliding(ctx, opening, start, wall.thickness);
        break;
      case 'porta-garagem':
        drawGarage(ctx, opening, start, wall.thickness);
        break;
      case 'janela':
      case 'janela-correr':
        drawWindow(ctx, opening, start, wall.thickness);
        break;
      case 'vao':
        ctx.strokeStyle = 'rgba(57, 64, 74, 0.28)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(start, -wall.thickness * 0.35);
        ctx.lineTo(start + opening.width, -wall.thickness * 0.35);
        ctx.moveTo(start, wall.thickness * 0.35);
        ctx.lineTo(start + opening.width, wall.thickness * 0.35);
        ctx.stroke();
        break;
    }
    ctx.restore();
  }
}

export const OPENING_FRAME = FRAME;
