import type { FloorKey } from '../../core/document';
import { floorMaterial } from '../../core/document';

/** Desenha o padrão de um piso, compartilhado pelos pacotes de piso. */
export function paintFloorPattern(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  floor: FloorKey,
  px: number | undefined,
): void {
  const mat = floorMaterial(floor);
  ctx.fillStyle = mat.base;
  ctx.fillRect(0, 0, w, d);
  const zoom = px ?? 0;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, w, d);
  ctx.clip();
  ctx.strokeStyle = mat.line;
  ctx.lineWidth = 0.6;
  ctx.beginPath();

  switch (floor) {
    case 'madeira': {
      const step = 24;
      for (let y = 0; y <= d; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      if (zoom > 0.3) {
        let row = 0;
        for (let y = 0; y <= d; y += step) {
          const offset = row % 2 ? 55 : 0;
          for (let x = offset; x <= w; x += 110) {
            ctx.moveTo(x, y);
            ctx.lineTo(x, Math.min(y + step, d));
          }
          row++;
        }
      }
      break;
    }
    case 'porcelanato': {
      const step = 80;
      for (let x = 0; x <= w; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, d);
      }
      for (let y = 0; y <= d; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      break;
    }
    case 'ceramica': {
      const step = 33;
      for (let x = 0; x <= w; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, d);
      }
      for (let y = 0; y <= d; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      break;
    }
    case 'concreto': {
      const step = 200;
      for (let x = 0; x <= w; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, d);
      }
      break;
    }
    case 'carpete': {
      if (zoom <= 0.32) break;
      const step = 16;
      for (let i = -d; i < w; i += step) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i + d, d);
      }
      break;
    }
    case 'grama': {
      if (zoom <= 0.22) break;
      for (let y = 0; y < d; y += 18) {
        for (let x = 0; x < w; x += 26) {
          const jitter = (Math.round(x / 26) + Math.round(y / 18)) % 2 ? 5 : -4;
          ctx.moveTo(x, y);
          ctx.lineTo(x + 4, y + jitter);
        }
      }
      break;
    }
    case 'granito': {
      const slab = 60;
      for (let x = 0; x <= w; x += slab) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, d);
      }
      for (let y = 0; y <= d; y += slab) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
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
          const baseY = d * (0.22 + v * 0.28);
          const amp = d * 0.05;
          const phase = v * 2.1;
          for (let x = 0; x <= w; x += 8) {
            const t = x / Math.max(w, 1);
            const y = baseY + Math.sin(t * Math.PI * 2 * (1.1 + v * 0.5) + phase) * amp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.beginPath();
      const slab = 120;
      for (let x = 0; x <= w; x += slab) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, d);
      }
      for (let y = 0; y <= d; y += slab) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      break;
    }
    case 'amadeirado': {
      const row = 20;
      const plank = 120;
      for (let y = 0; y <= d; y += row) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        const offset = Math.round(y / row) % 2 ? plank / 2 : 0;
        for (let x = offset; x <= w; x += plank) {
          ctx.moveTo(x, y);
          ctx.lineTo(x, Math.min(y + row, d));
        }
      }
      break;
    }
  }
  ctx.stroke();
  ctx.restore();
}
