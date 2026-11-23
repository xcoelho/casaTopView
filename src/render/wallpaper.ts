/** Desenho dos papéis de parede na planta 2D e nas miniaturas do inspetor. */
import type { WallpaperPreset } from '../core/wallpapers';

const tileCache = new Map<string, HTMLCanvasElement>();

/** Repetição quadrada do padrão. 1 px por cm por padrão. */
export function wallpaperTile(preset: WallpaperPreset, pxPerCm = 1): HTMLCanvasElement {
  const px = Math.max(16, Math.round(preset.tileCm * pxPerCm));
  const key = `${preset.id}|${px}`;
  const existing = tileCache.get(key);
  if (existing) return existing;

  const canvas = document.createElement('canvas');
  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext('2d');
  if (ctx) preset.drawTile(ctx, px);
  tileCache.set(key, canvas);
  return canvas;
}

/** Preenche uma face de parede: cor lisa ou padrão repetido. */
export function paintWallpaperRect(
  ctx: CanvasRenderingContext2D,
  preset: WallpaperPreset | undefined,
  fallbackColor: string,
  x: number,
  y: number,
  w: number,
  h: number,
  tileScale = 1,
): void {
  if (w <= 0 || h <= 0) return;
  ctx.fillStyle = preset?.base ?? fallbackColor;
  ctx.fillRect(x, y, w, h);
  if (!preset) return;

  const pattern = ctx.createPattern(wallpaperTile(preset, tileScale), 'repeat');
  if (!pattern) return;
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = pattern;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

function grain(ctx: CanvasRenderingContext2D, w: number, h: number, color: string): void {
  let seed = 71;
  const rand = (): number => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.7;
  for (let i = 0; i < 70; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const length = 2 + rand() * 10;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y);
    ctx.stroke();
  }
  ctx.restore();
}

/** Miniatura 16:9 de um modelo, usada nos cartões do inspetor. */
export function createWallpaperSwatch(
  preset: WallpaperPreset | null,
  fallbackColor: string,
  width = 96,
  height = 54,
): HTMLCanvasElement {
  const dpr = 2;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  if (preset) {
    // A amostra representa uma parede de 1,70 m; assim a escala relativa
    // entre estampas grandes e pequenas fica fiel ao resultado 3D.
    paintWallpaperRect(ctx, preset, fallbackColor, 0, 0, canvas.width, canvas.height, canvas.width / 170);
  } else {
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    grain(ctx, canvas.width, canvas.height, 'rgba(31, 36, 43, 0.055)');
  }

  // Luz de cima e sombra na base dão a sensação de amostra de parede.
  const depth = ctx.createLinearGradient(0, 0, 0, canvas.height);
  depth.addColorStop(0, 'rgba(255, 255, 255, 0.24)');
  depth.addColorStop(0.36, 'rgba(255, 255, 255, 0)');
  depth.addColorStop(1, 'rgba(20, 18, 15, 0.16)');
  ctx.fillStyle = depth;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const edge = ctx.createLinearGradient(0, 0, canvas.width, 0);
  edge.addColorStop(0, 'rgba(20, 18, 15, 0.09)');
  edge.addColorStop(0.12, 'rgba(20, 18, 15, 0)');
  edge.addColorStop(1, 'rgba(255, 255, 255, 0.06)');
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvas;
}
