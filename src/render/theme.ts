/** Paleta e padrões de piso usados no canvas. */
import type { FloorKey } from '../core/document';
import { floorMaterial } from '../core/document';
import type { Vec2 } from '../core/geometry';
import { boundsOfPoints } from '../core/geometry';

export const FONT = "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif";

export const THEME = {
  paper: '#f1eee6',
  paperShade: '#e9e4d9',
  gridMinor: 'rgba(58, 52, 42, 0.055)',
  gridMajor: 'rgba(58, 52, 42, 0.11)',
  gridAxis: 'rgba(58, 52, 42, 0.18)',
  wall: '#39404a',
  wallFill: '#3d444e',
  wallEdge: 'rgba(24, 29, 35, 0.45)',
  accent: '#0f766e',
  accentSoft: 'rgba(15, 118, 110, 0.12)',
  accentLine: 'rgba(15, 118, 110, 0.55)',
  guide: '#d93b73',
  ink: '#1f242b',
  inkSoft: 'rgba(60, 60, 56, 0.72)',
  inkFaint: 'rgba(60, 60, 56, 0.45)',
  handle: '#ffffff',
  measureBg: 'rgba(31, 36, 43, 0.92)',
  glass: 'rgba(207, 227, 232, 0.85)',
  metal: '#8d9498',
};

function relativeLuminance(hex: string): number {
  const value = hex.replace('#', '');
  if (value.length !== 6) return 1;
  const channel = (offset: number): number => {
    const v = parseInt(value.slice(offset, offset + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

/** Texto do cômodo: claro sobre pisos escuros, escuro sobre os claros. */
export function floorInk(floor: FloorKey): { name: string; area: string } {
  return relativeLuminance(floorMaterial(floor).base) < 0.28
    ? { name: 'rgba(247, 246, 241, 0.94)', area: 'rgba(238, 236, 229, 0.72)' }
    : { name: THEME.inkSoft, area: THEME.inkFaint };
}

export function paintFloor(
  ctx: CanvasRenderingContext2D,
  points: Vec2[],
  floor: FloorKey,
  zoom: number,
): void {
  if (points.length < 3) return;
  const mat = floorMaterial(floor);
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
  ctx.closePath();
  ctx.fillStyle = mat.base;
  ctx.fill();

  if (zoom < 0.14) return;
  const bounds = boundsOfPoints(points);

  ctx.save();
  ctx.clip();
  ctx.strokeStyle = mat.line;
  ctx.lineWidth = Math.max(0.5, 0.6);
  ctx.beginPath();

  switch (floor) {
    case 'madeira': {
      const step = 24;
      for (let y = bounds.y; y <= bounds.y + bounds.h; y += step) {
        ctx.moveTo(bounds.x, y);
        ctx.lineTo(bounds.x + bounds.w, y);
      }
      if (zoom > 0.3) {
        let row = 0;
        for (let y = bounds.y; y <= bounds.y + bounds.h; y += step) {
          const offset = row % 2 ? 55 : 0;
          for (let x = bounds.x + offset; x <= bounds.x + bounds.w; x += 110) {
            ctx.moveTo(x, y);
            ctx.lineTo(x, Math.min(y + step, bounds.y + bounds.h));
          }
          row++;
        }
      }
      break;
    }
    case 'porcelanato': {
      const step = 80;
      for (let x = bounds.x; x <= bounds.x + bounds.w; x += step) {
        ctx.moveTo(x, bounds.y);
        ctx.lineTo(x, bounds.y + bounds.h);
      }
      for (let y = bounds.y; y <= bounds.y + bounds.h; y += step) {
        ctx.moveTo(bounds.x, y);
        ctx.lineTo(bounds.x + bounds.w, y);
      }
      break;
    }
    case 'ceramica': {
      const step = 33;
      for (let x = bounds.x; x <= bounds.x + bounds.w; x += step) {
        ctx.moveTo(x, bounds.y);
        ctx.lineTo(x, bounds.y + bounds.h);
      }
      for (let y = bounds.y; y <= bounds.y + bounds.h; y += step) {
        ctx.moveTo(bounds.x, y);
        ctx.lineTo(bounds.x + bounds.w, y);
      }
      break;
    }
    case 'concreto': {
      const step = 200;
      for (let x = bounds.x; x <= bounds.x + bounds.w; x += step) {
        ctx.moveTo(x, bounds.y);
        ctx.lineTo(x, bounds.y + bounds.h);
      }
      break;
    }
    case 'carpete': {
      if (zoom < 0.32) break;
      const step = 16;
      for (let i = bounds.x - bounds.h; i < bounds.x + bounds.w; i += step) {
        ctx.moveTo(i, bounds.y);
        ctx.lineTo(i + bounds.h, bounds.y + bounds.h);
      }
      break;
    }
    case 'grama': {
      if (zoom < 0.22) break;
      for (let y = bounds.y; y < bounds.y + bounds.h; y += 18) {
        for (let x = bounds.x; x < bounds.x + bounds.w; x += 26) {
          const jitter = (Math.round(x / 26) + Math.round(y / 18)) % 2 ? 5 : -4;
          ctx.moveTo(x, y);
          ctx.lineTo(x + 4, y + jitter);
        }
      }
      break;
    }
    case 'granito': {
      const slab = 60;
      for (let x = Math.floor(bounds.x / slab) * slab; x <= bounds.x + bounds.w; x += slab) {
        ctx.moveTo(x, bounds.y);
        ctx.lineTo(x, bounds.y + bounds.h);
      }
      for (let y = Math.floor(bounds.y / slab) * slab; y <= bounds.y + bounds.h; y += slab) {
        ctx.moveTo(bounds.x, y);
        ctx.lineTo(bounds.x + bounds.w, y);
      }
      break;
    }
    case 'marmore': {
      if (zoom > 0.18) {
        ctx.save();
        ctx.strokeStyle = 'rgba(132, 108, 74, 0.2)';
        for (let v = 0; v < 3; v++) {
          ctx.lineWidth = 2.4 - v * 0.5;
          ctx.beginPath();
          const baseY = bounds.y + bounds.h * (0.22 + v * 0.28);
          const amp = bounds.h * 0.05;
          const phase = v * 2.1;
          for (let x = bounds.x; x <= bounds.x + bounds.w; x += 10) {
            const t = (x - bounds.x) / Math.max(bounds.w, 1);
            const y = baseY + Math.sin(t * Math.PI * 2 * (1.1 + v * 0.5) + phase) * amp;
            if (x === bounds.x) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.beginPath();
      const slab = 120;
      for (let x = Math.floor(bounds.x / slab) * slab; x <= bounds.x + bounds.w; x += slab) {
        ctx.moveTo(x, bounds.y);
        ctx.lineTo(x, bounds.y + bounds.h);
      }
      for (let y = Math.floor(bounds.y / slab) * slab; y <= bounds.y + bounds.h; y += slab) {
        ctx.moveTo(bounds.x, y);
        ctx.lineTo(bounds.x + bounds.w, y);
      }
      break;
    }
    case 'amadeirado': {
      const row = 20;
      const plank = 120;
      for (let y = Math.floor(bounds.y / row) * row; y <= bounds.y + bounds.h; y += row) {
        ctx.moveTo(bounds.x, y);
        ctx.lineTo(bounds.x + bounds.w, y);
        const offset = Math.round(y / row) % 2 ? plank / 2 : 0;
        for (let x = Math.floor((bounds.x - offset) / plank) * plank + offset; x <= bounds.x + bounds.w; x += plank) {
          ctx.moveTo(x, y);
          ctx.lineTo(x, Math.min(y + row, bounds.y + bounds.h));
        }
      }
      break;
    }
  }
  ctx.stroke();
  ctx.restore();
}
