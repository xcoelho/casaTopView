/** Texturas procedurais cacheadas para micro-relevo e quebra especular dos materiais 3D. */
import * as THREE from 'three';
import type { FloorKey } from '../core/document';

const cache = new Map<string, THREE.CanvasTexture>();

function makeTexture(
  key: string,
  size: number,
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  repeat = 1,
): THREE.CanvasTexture {
  const existing = cache.get(key);
  if (existing) return existing;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.needsUpdate = true;
  cache.set(key, tex);
  return tex;
}

/** Veios orgânicos de madeira em escala de cinza (para bump/roughness). */
export function woodGrainTexture(): THREE.CanvasTexture {
  return makeTexture(
    'wood-grain',
    256,
    (ctx, s) => {
      ctx.fillStyle = '#909090';
      ctx.fillRect(0, 0, s, s);
      let seed = 42;
      const rand = (): number => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      for (let i = 0; i < 140; i++) {
        const y = rand() * s;
        const v = Math.floor(110 + rand() * 80);
        ctx.strokeStyle = `rgba(${v},${v},${v},0.35)`;
        ctx.lineWidth = 0.8 + rand() * 2.2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        const amp = 1.5 + rand() * 4;
        const freq = 0.02 + rand() * 0.03;
        const phase = rand() * Math.PI * 2;
        for (let x = 0; x <= s; x += 16) {
          ctx.lineTo(x, y + Math.sin(x * freq + phase) * amp);
        }
        ctx.stroke();
      }
    },
    2,
  );
}

/** Trama cruzada de tecido (linho/algodão) para estofados e tapetes. */
export function fabricWeaveTexture(): THREE.CanvasTexture {
  return makeTexture(
    'fabric-weave',
    128,
    (ctx, s) => {
      ctx.fillStyle = '#888888';
      ctx.fillRect(0, 0, s, s);
      const step = 4;
      for (let y = 0; y < s; y += step) {
        for (let x = 0; x < s; x += step) {
          const checker = ((x / step + y / step) & 1) === 0;
          ctx.fillStyle = checker ? '#a4a4a4' : '#6c6c6c';
          ctx.fillRect(x, y, step - 1, step - 1);
        }
      }
    },
    6,
  );
}

/** Riscos finos de metal escovado. */
export function brushedMetalTexture(): THREE.CanvasTexture {
  return makeTexture(
    'brushed-metal',
    128,
    (ctx, s) => {
      ctx.fillStyle = '#858585';
      ctx.fillRect(0, 0, s, s);
      let seed = 1337;
      const rand = (): number => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      for (let i = 0; i < 220; i++) {
        const y = rand() * s;
        const v = Math.floor(100 + rand() * 90);
        ctx.strokeStyle = `rgba(${v},${v},${v},0.28)`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(s, y);
        ctx.stroke();
      }
    },
    2,
  );
}

/** Grão sutil de pedra/mármore para bancadas e pisos. */
export function stoneSpeckleTexture(): THREE.CanvasTexture {
  return makeTexture(
    'stone-speckle',
    256,
    (ctx, s) => {
      ctx.fillStyle = '#8c8c8c';
      ctx.fillRect(0, 0, s, s);
      let seed = 9001;
      const rand = (): number => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      for (let i = 0; i < 650; i++) {
        const x = rand() * s;
        const y = rand() * s;
        const r = 0.7 + rand() * 2.4;
        const v = Math.floor(105 + rand() * 90);
        ctx.fillStyle = `rgba(${v},${v},${v},0.28)`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    2,
  );
}

/** Ondulações suaves para a superfície da água. */
export function waterRippleTexture(): THREE.CanvasTexture {
  return makeTexture(
    'water-ripple',
    256,
    (ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 14; i++) {
        const cy = (i / 14) * s;
        ctx.strokeStyle = i % 2 ? 'rgba(210,210,210,0.32)' : 'rgba(58,58,58,0.26)';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let x = 0; x <= s; x += 8) {
          const y = cy + Math.sin((x / s) * Math.PI * 4 + i * 1.7) * 6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    },
    3,
  );
}

/** Tela desligada com reflexo diagonal suave, sem depender de iluminação. */
export function screenSheenTexture(): THREE.CanvasTexture {
  const key = 'screen-sheen';
  const existing = cache.get(key);
  if (existing) return existing;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 288;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const base = ctx.createLinearGradient(0, 0, 512, 288);
    base.addColorStop(0, '#151b23');
    base.addColorStop(0.55, '#0a0e13');
    base.addColorStop(1, '#070a0e');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 512, 288);

    const sheen = ctx.createLinearGradient(0, 288, 420, 0);
    sheen.addColorStop(0, 'rgba(150,190,225,0)');
    sheen.addColorStop(0.42, 'rgba(150,190,225,0.12)');
    sheen.addColorStop(0.58, 'rgba(195,225,248,0.19)');
    sheen.addColorStop(1, 'rgba(195,225,248,0)');
    ctx.fillStyle = sheen;
    ctx.beginPath();
    ctx.moveTo(-40, 288);
    ctx.lineTo(200, 0);
    ctx.lineTo(330, 0);
    ctx.lineTo(90, 288);
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  cache.set(key, tex);
  return tex;
}

export interface FloorTextureSet {
  map: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
}

/** Tamanho do patch em cm; as UVs do piso já vêm nas coordenadas do mundo. */
const FLOOR_PATCH: Record<FloorKey, number> = {
  madeira: 240,
  porcelanato: 240,
  ceramica: 264,
  concreto: 200,
  carpete: 160,
  grama: 180,
};

const floorTextures = new Map<FloorKey, FloorTextureSet>();

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** Repete a elipse nas bordas para o padrão continuar ao ladrilhar. */
function wrappedEllipse(
  ctx: CanvasRenderingContext2D,
  size: number,
  x: number,
  y: number,
  rx: number,
  ry: number,
  rotation = 0,
): void {
  for (const dx of [-size, 0, size]) {
    for (const dy of [-size, 0, size]) {
      ctx.beginPath();
      ctx.ellipse(x + dx, y + dy, rx, ry, rotation, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawWoodFloor(ctx: CanvasRenderingContext2D, s: number, base: string, line: string): void {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = 'rgba(150, 105, 60, 0.08)';
  ctx.fillRect(0, 0, s, s);

  const rand = seededRandom(101);
  const rows = 12;
  const rowHeight = s / rows;
  const plankWidth = s / 2;
  const seam = 'rgba(108, 74, 44, 0.42)';

  for (let row = 0; row < rows; row++) {
    const y = row * rowHeight;
    ctx.fillStyle =
      row % 3 === 0
        ? 'rgba(255, 255, 255, 0.035)'
        : row % 3 === 1
          ? 'rgba(96, 64, 34, 0.035)'
          : 'rgba(255, 255, 255, 0.012)';
    ctx.fillRect(0, y, s, rowHeight);

    const offset = row % 2 ? plankWidth / 2 : 0;
    for (let x = offset - plankWidth; x < s; x += plankWidth) {
      const x0 = Math.max(0, x);
      const x1 = Math.min(s, x + plankWidth);
      if (x1 <= x0) continue;
      const startNorm = ((x % s) + s) % s;
      const toneSeed = Math.floor(startNorm / plankWidth) * 17 + row * 31;
      const tone = Math.abs(Math.sin(toneSeed * 12.9898) * 43758.5453) % 1;
      ctx.fillStyle =
        tone > 0.5
          ? `rgba(255, 255, 255, ${0.02 + tone * 0.04})`
          : `rgba(112, 76, 42, ${0.025 + tone * 0.04})`;
      ctx.fillRect(x0, y, x1 - x0, rowHeight);
    }

    ctx.strokeStyle = seam;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let x = offset; x < s; x += plankWidth) {
      ctx.moveTo(x + 0.5, y);
      ctx.lineTo(x + 0.5, y + rowHeight);
    }
    ctx.stroke();

    for (let grain = 0; grain < 4; grain++) {
      const gy = y + rowHeight * (0.18 + grain * 0.21) + rand() * rowHeight * 0.06;
      const amp = 1 + rand() * 2;
      const freq = 2 + Math.floor(rand() * 3);
      const phase = rand() * Math.PI * 2;
      ctx.strokeStyle = rand() > 0.45 ? 'rgba(255, 255, 255, 0.13)' : 'rgba(96, 64, 36, 0.16)';
      ctx.lineWidth = 0.8 + rand() * 0.9;
      ctx.beginPath();
      for (let x = 0; x <= s; x += 8) {
        const yy = gy + Math.sin((x / s) * Math.PI * 2 * freq + phase) * amp;
        if (x === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
  }

  ctx.strokeStyle = seam;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  for (let row = 0; row < rows; row++) {
    const y = row * rowHeight + 0.5;
    ctx.moveTo(0, y);
    ctx.lineTo(s, y);
  }
  ctx.stroke();

  for (let knot = 0; knot < 6; knot++) {
    ctx.strokeStyle = 'rgba(104, 70, 40, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(
      rand() * s,
      rand() * s,
      1.5 + rand() * 2,
      1 + rand() * 1.5,
      rand() * Math.PI,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }
}

function drawPorcelainFloor(ctx: CanvasRenderingContext2D, s: number, base: string, line: string): void {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, s, s);

  const rand = seededRandom(202);
  const tiles = 3;
  const tile = s / tiles;

  for (let row = 0; row < tiles; row++) {
    for (let col = 0; col < tiles; col++) {
      const index = row * tiles + col;
      ctx.fillStyle =
        index % 4 === 0
          ? 'rgba(255, 255, 255, 0.04)'
          : index % 4 === 1
            ? 'rgba(0, 0, 0, 0.018)'
            : index % 4 === 2
              ? 'rgba(255, 255, 255, 0.018)'
              : 'rgba(0, 0, 0, 0.01)';
      ctx.fillRect(col * tile, row * tile, tile, tile);
    }
  }

  for (let i = 0; i < 900; i++) {
    const value = 120 + Math.floor(rand() * 60);
    ctx.fillStyle = `rgba(${value},${value},${value - 4},${0.05 + rand() * 0.08})`;
    ctx.fillRect(rand() * s, rand() * s, 0.6 + rand() * 1.2, 0.6 + rand() * 1.2);
  }

  ctx.strokeStyle = 'rgba(120, 120, 114, 0.42)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < tiles; i++) {
    const p = i * tile + 0.5;
    ctx.moveTo(p, 0);
    ctx.lineTo(p, s);
    ctx.moveTo(0, p);
    ctx.lineTo(s, p);
  }
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  for (let i = 0; i < tiles; i++) {
    const p = i * tile + 2.5;
    ctx.moveTo(p, 0);
    ctx.lineTo(p, s);
    ctx.moveTo(0, p);
    ctx.lineTo(s, p);
  }
  ctx.stroke();
}

function drawCeramicFloor(ctx: CanvasRenderingContext2D, s: number, base: string, line: string): void {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, s, s);

  const rand = seededRandom(303);
  const tiles = 8;
  const tile = s / tiles;

  for (let row = 0; row < tiles; row++) {
    for (let col = 0; col < tiles; col++) {
      const index = row * 3 + col;
      ctx.fillStyle =
        index % 5 === 0
          ? 'rgba(255, 255, 255, 0.035)'
          : index % 5 === 1
            ? 'rgba(0, 0, 0, 0.025)'
            : index % 5 === 2
              ? 'rgba(255, 255, 255, 0.015)'
              : 'rgba(0, 0, 0, 0.012)';
      ctx.fillRect(col * tile, row * tile, tile, tile);
    }
  }

  for (let i = 0; i < 520; i++) {
    const value = 110 + Math.floor(rand() * 70);
    ctx.fillStyle = `rgba(${value},${value},${value - 3},${0.04 + rand() * 0.07})`;
    ctx.fillRect(rand() * s, rand() * s, 0.5 + rand() * 1.1, 0.5 + rand() * 1.1);
  }

  ctx.strokeStyle = 'rgba(104, 114, 116, 0.46)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < tiles; i++) {
    const p = i * tile + 0.5;
    ctx.moveTo(p, 0);
    ctx.lineTo(p, s);
    ctx.moveTo(0, p);
    ctx.lineTo(s, p);
  }
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  for (let i = 0; i < tiles; i++) {
    const p = i * tile + 2;
    ctx.moveTo(p, 0);
    ctx.lineTo(p, s);
    ctx.moveTo(0, p);
    ctx.lineTo(s, p);
  }
  ctx.stroke();
}

function drawConcreteFloor(ctx: CanvasRenderingContext2D, s: number, base: string, line: string): void {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, s, s);

  const rand = seededRandom(404);
  for (let i = 0; i < 55; i++) {
    const light = rand() > 0.5;
    ctx.fillStyle = light
      ? `rgba(255, 255, 255, ${0.015 + rand() * 0.025})`
      : `rgba(68, 68, 66, ${0.015 + rand() * 0.03})`;
    wrappedEllipse(
      ctx,
      s,
      rand() * s,
      rand() * s,
      18 + rand() * 80,
      14 + rand() * 60,
      rand() * Math.PI,
    );
  }

  for (let i = 0; i < 1400; i++) {
    const value = 100 + Math.floor(rand() * 80);
    ctx.fillStyle = `rgba(${value},${value},${value - 2},${0.035 + rand() * 0.06})`;
    ctx.fillRect(rand() * s, rand() * s, 0.5 + rand() * 1.4, 0.5 + rand() * 1.4);
  }

  ctx.strokeStyle = 'rgba(100, 100, 96, 0.32)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0.5, 0);
  ctx.lineTo(0.5, s);
  ctx.moveTo(0, 0.5);
  ctx.lineTo(s, 0.5);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(2.5, 0);
  ctx.lineTo(2.5, s);
  ctx.moveTo(0, 2.5);
  ctx.lineTo(s, 2.5);
  ctx.stroke();
}

function drawCarpetFloor(ctx: CanvasRenderingContext2D, s: number, base: string, line: string): void {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, s, s);

  const rand = seededRandom(505);
  for (let x = -s; x < s * 2; x += 4) {
    const light = rand() > 0.5;
    ctx.strokeStyle = light
      ? `rgba(255, 255, 255, ${0.025 + rand() * 0.035})`
      : `rgba(90, 80, 64, ${0.03 + rand() * 0.04})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + s, s);
    ctx.stroke();
  }

  for (let i = 0; i < 1800; i++) {
    const value = 110 + Math.floor(rand() * 70);
    ctx.fillStyle = `rgba(${value},${value},${value - 5},${0.04 + rand() * 0.06})`;
    ctx.fillRect(rand() * s, rand() * s, 0.6 + rand() * 1.1, 0.6 + rand() * 1.1);
  }

}

function drawGrassFloor(ctx: CanvasRenderingContext2D, s: number, base: string, line: string): void {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, s, s);

  const rand = seededRandom(606);
  for (let i = 0; i < 45; i++) {
    const light = rand() > 0.5;
    ctx.fillStyle = light
      ? `rgba(228, 240, 194, ${0.03 + rand() * 0.04})`
      : `rgba(70, 104, 48, ${0.03 + rand() * 0.04})`;
    wrappedEllipse(
      ctx,
      s,
      rand() * s,
      rand() * s,
      20 + rand() * 70,
      12 + rand() * 50,
      rand() * Math.PI,
    );
  }

  for (let i = 0; i < 1800; i++) {
    const x = rand() * s;
    const y = rand() * s;
    const len = 1.5 + rand() * 4;
    const angle = -Math.PI / 2 + (rand() - 0.5) * 1.1;
    ctx.strokeStyle =
      rand() > 0.5
        ? `rgba(74, 106, 52, ${0.12 + rand() * 0.12})`
        : `rgba(225, 238, 190, ${0.08 + rand() * 0.1})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }

}

function drawFloorTexture(
  ctx: CanvasRenderingContext2D,
  s: number,
  key: FloorKey,
  base: string,
  line: string,
): void {
  switch (key) {
    case 'madeira':
      drawWoodFloor(ctx, s, base, line);
      break;
    case 'porcelanato':
      drawPorcelainFloor(ctx, s, base, line);
      break;
    case 'ceramica':
      drawCeramicFloor(ctx, s, base, line);
      break;
    case 'concreto':
      drawConcreteFloor(ctx, s, base, line);
      break;
    case 'carpete':
      drawCarpetFloor(ctx, s, base, line);
      break;
    case 'grama':
      drawGrassFloor(ctx, s, base, line);
      break;
    default:
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, s, s);
      break;
  }
}

/** Albedo + bump de um piso; a textura é repetida em escala real (cm). */
export function floorTexture(key: FloorKey, base: string, line: string): FloorTextureSet {
  const cached = floorTextures.get(key);
  if (cached) return cached;

  const map = makeTexture(
    `floor-${key}`,
    512,
    (ctx, s) => drawFloorTexture(ctx, s, key, base, line),
    1 / FLOOR_PATCH[key],
  );
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  map.needsUpdate = true;

  const bump = map.clone();
  bump.colorSpace = THREE.NoColorSpace;
  bump.anisotropy = 8;
  bump.needsUpdate = true;

  const set = { map, bump };
  floorTextures.set(key, set);
  return set;
}

/** Ruído fino de pintura para bump/roughness das paredes. */
export function wallPaintTexture(): THREE.CanvasTexture {
  return makeTexture(
    'wall-paint',
    256,
    (ctx, s) => {
      ctx.fillStyle = '#8a8a8a';
      ctx.fillRect(0, 0, s, s);
      const rand = seededRandom(707);
      for (let i = 0; i < 2600; i++) {
        const value = 120 + Math.floor(rand() * 28);
        ctx.fillStyle = `rgba(${value},${value},${value},${0.08 + rand() * 0.12})`;
        const size = 0.8 + rand() * 1.5;
        ctx.fillRect(rand() * s, rand() * s, size, size);
      }
    },
    3,
  );
}
