/** Papel de desenho com grade métrica. */
import type { Camera } from '../viewport';
import { THEME } from '../theme';

function isDark(color: string): boolean {
  const match = /^#([0-9a-f]{6})$/i.exec(color);
  if (!match) return false;
  const value = Number.parseInt(match[1], 16);
  const r = value >> 16;
  const g = (value >> 8) & 0xff;
  const b = value & 0xff;
  return (r * 299 + g * 587 + b * 114) / 1000 < 145;
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  width: number,
  height: number,
  dpr: number,
  showGrid: boolean,
  paper: string | null = THEME.paper,
): void {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (paper) {
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, width, height);
  }

  if (!showGrid) return;

  const lightGrid = paper !== null && isDark(paper);
  const gridMinor = lightGrid ? 'rgba(255, 255, 255, 0.10)' : THEME.gridMinor;
  const gridMajor = lightGrid ? 'rgba(255, 255, 255, 0.20)' : THEME.gridMajor;
  const gridAxis = lightGrid ? 'rgba(255, 255, 255, 0.34)' : THEME.gridAxis;

  const zoom = cam.zoom;
  const left = -cam.x / zoom;
  const top = -cam.y / zoom;
  const right = (width - cam.x) / zoom;
  const bottom = (height - cam.y) / zoom;

  const minorStep = 10;
  const majorStep = 100;
  const minorPx = minorStep * zoom;

  ctx.lineWidth = 1;
  ctx.strokeStyle = gridMinor;
  if (minorPx >= 5) {
    ctx.beginPath();
    const startX = Math.floor(left / minorStep) * minorStep;
    for (let x = startX; x <= right; x += minorStep) {
      if (x % majorStep === 0) continue;
      const sx = Math.round(x * zoom + cam.x) + 0.5;
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
    }
    const startY = Math.floor(top / minorStep) * minorStep;
    for (let y = startY; y <= bottom; y += minorStep) {
      if (y % majorStep === 0) continue;
      const sy = Math.round(y * zoom + cam.y) + 0.5;
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
    }
    ctx.stroke();
  }

  if (majorStep * zoom >= 5) {
    ctx.strokeStyle = gridMajor;
    ctx.beginPath();
    const startX = Math.floor(left / majorStep) * majorStep;
    for (let x = startX; x <= right; x += majorStep) {
      const sx = Math.round(x * zoom + cam.x) + 0.5;
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
    }
    const startY = Math.floor(top / majorStep) * majorStep;
    for (let y = startY; y <= bottom; y += majorStep) {
      const sy = Math.round(y * zoom + cam.y) + 0.5;
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
    }
    ctx.stroke();
  }

  // eixos de origem
  ctx.strokeStyle = gridAxis;
  ctx.beginPath();
  const originX = Math.round(cam.x) + 0.5;
  const originY = Math.round(cam.y) + 0.5;
  if (originX > 0 && originX < width) {
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
  }
  if (originY > 0 && originY < height) {
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
  }
  ctx.stroke();
}
