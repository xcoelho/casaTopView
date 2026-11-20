import type { FloorKey } from '../../core/document';
import { floorMaterial } from '../../core/document';
import type { FurnitureDef } from '../types';

const FLOOR_KEYS: Record<string, FloorKey> = {
  'piso-madeira': 'madeira',
  'piso-porcelanato': 'porcelanato',
  'piso-ceramica': 'ceramica',
  'piso-concreto': 'concreto',
  'piso-carpete': 'carpete',
  'piso-grama': 'grama',
};

export function floorKeyForPisoDef(defId: string): FloorKey | undefined {
  return FLOOR_KEYS[defId];
}

function paintFloorPattern(
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
  }
  ctx.stroke();
  ctx.restore();
}

function piso(id: string, name: string, material: string, main: string): FurnitureDef {
  const floor: FloorKey = floorKeyForPisoDef(id) as FloorKey;
  return {
    id,
    name,
    category: 'decoracao',
    w: 300,
    d: 300,
    keywords: ['piso', material],
    flat: true,
    zBias: -10,
    colors: { main },
    draw: ({ ctx, w, d, px }) => {
      paintFloorPattern(ctx, w, d, floor, px);
    },
  };
}

export const pisos: FurnitureDef[] = [
  piso('piso-madeira', 'Piso madeira', 'madeira', '#e9d9c0'),
  piso('piso-porcelanato', 'Piso porcelanato', 'porcelanato', '#efece4'),
  piso('piso-ceramica', 'Piso cerâmica', 'ceramica', '#e8e5db'),
  piso('piso-concreto', 'Piso concreto', 'concreto', '#dedbd2'),
  piso('piso-carpete', 'Piso carpete', 'carpete', '#dcd6c7'),
  piso('piso-grama', 'Piso grama', 'grama', '#ccd8b6'),
];
