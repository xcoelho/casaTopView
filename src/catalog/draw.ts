/** Utilidades de desenho vetorial compartilhadas por todos os móveis. */
import type { PaletteId } from './types';

export interface SwatchOption {
  name: string;
  value: string;
}

export const PALETTES: Record<PaletteId, { label: string; options: SwatchOption[] }> = {
  wood: {
    label: 'Madeira',
    options: [
      { name: 'Carvalho claro', value: '#d8bb92' },
      { name: 'Freijó', value: '#c19a6b' },
      { name: 'Nogueira', value: '#8a6142' },
      { name: 'Ébano', value: '#4a3a30' },
      { name: 'Laca branca', value: '#efeae1' },
    ],
  },
  fabric: {
    label: 'Tecido',
    options: [
      { name: 'Linho', value: '#ded4c1' },
      { name: 'Areia', value: '#cbb79a' },
      { name: 'Verde-oliva', value: '#8f9a76' },
      { name: 'Terracota', value: '#c07f63' },
      { name: 'Grafite', value: '#5d6169' },
      { name: 'Azul-petróleo', value: '#43626b' },
    ],
  },
  metal: {
    label: 'Metal',
    options: [
      { name: 'Aço escovado', value: '#b8bcc1' },
      { name: 'Preto fosco', value: '#3b3f45' },
      { name: 'Latão', value: '#c2a469' },
      { name: 'Cromado', value: '#d9dde1' },
    ],
  },
  stone: {
    label: 'Pedra',
    options: [
      { name: 'Mármore branco', value: '#eeeee9' },
      { name: 'Granito cinza', value: '#a9a9a4' },
      { name: 'Ardósia', value: '#575b5e' },
      { name: 'Quartzo bege', value: '#dcd2c1' },
    ],
  },
  paint: {
    label: 'Acabamento',
    options: [
      { name: 'Branco', value: '#f4f1ea' },
      { name: 'Off-white', value: '#e6e0d3' },
      { name: 'Cinza claro', value: '#c9ccce' },
      { name: 'Verde-sálvia', value: '#9aa992' },
      { name: 'Preto', value: '#33373c' },
    ],
  },
  plant: {
    label: 'Folhagem',
    options: [
      { name: 'Verde', value: '#6f8f5c' },
      { name: 'Verde-escuro', value: '#4d6b45' },
      { name: 'Variegada', value: '#93a86a' },
      { name: 'Seca', value: '#b09a6a' },
    ],
  },
  glass: {
    label: 'Vidro',
    options: [
      { name: 'Transparente', value: '#cfe3e8' },
      { name: 'Fumê', value: '#8c9aa0' },
      { name: 'Jateado', value: '#e2ebec' },
    ],
  },
};

export function paletteColor(palette: PaletteId, index = 0): string {
  const options = PALETTES[palette].options;
  return (options[index] ?? options[0]).value;
}

/** Clareia (amount > 0) ou escurece (amount < 0) uma cor hex. */
export function shade(hex: string, amount: number): string {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = Number.parseInt(full, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;
  if (amount >= 0) {
    r = Math.round(r + (255 - r) * amount);
    g = Math.round(g + (255 - g) * amount);
    b = Math.round(b + (255 - b) * amount);
  } else {
    const k = 1 + amount;
    r = Math.round(r * k);
    g = Math.round(g * k);
    b = Math.round(b * k);
  }
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function alpha(hex: string, opacity: number): string {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = Number.parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/* ---------------- Formas ---------------- */

export const LINE = 'rgba(48, 40, 31, 0.34)';
export const LINE_SOFT = 'rgba(48, 40, 31, 0.18)';

export function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r = 0,
): void {
  const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, radius);
    return;
  }
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/** Retângulo arredondado preenchido, com contorno opcional. */
export function box(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string | CanvasGradient | null,
  stroke: string | null = LINE,
  lw = 1.6,
): void {
  if (w <= 0 || h <= 0) return;
  rr(ctx, x, y, w, h, r);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
}

export function circle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  fill: string | null,
  stroke: string | null = LINE,
  lw = 1.6,
): void {
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(radius, 0), 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
}

export function line(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  lw = 1.4,
  dash: number[] = [],
): void {
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash(dash);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

/** Assento estofado com costura interna. */
export function cushion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
): void {
  box(ctx, x, y, w, h, r, fill, alpha(shade(fill, -0.45), 0.45), 1.3);
  box(ctx, x + 3, y + 3, Math.max(w - 6, 1), Math.max(h - 6, 1), Math.max(r - 1.5, 0), null, alpha(shade(fill, 0.35), 0.5), 1);
}

/** Veios de madeira sutis. */
export function grain(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  base: string,
  gap = 7,
  vertical = false,
): void {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = alpha(shade(base, -0.35), 0.22);
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  if (vertical) {
    for (let i = gap; i < w; i += gap) {
      ctx.moveTo(x + i, y);
      ctx.bezierCurveTo(x + i + 1.6, y + h * 0.35, x + i - 1.6, y + h * 0.7, x + i, y + h);
    }
  } else {
    for (let i = gap; i < h; i += gap) {
      ctx.moveTo(x, y + i);
      ctx.bezierCurveTo(x + w * 0.35, y + i + 1.6, x + w * 0.7, y + i - 1.6, x + w, y + i);
    }
  }
  ctx.stroke();
  ctx.restore();
}

/** Hachura diagonal, para pilares e vidros. */
export function hatch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  step = 6,
  lw = 1,
): void {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.beginPath();
  for (let i = -h; i < w + h; i += step) {
    ctx.moveTo(x + i, y + h);
    ctx.lineTo(x + i + h, y);
  }
  ctx.stroke();
  ctx.restore();
}

export function knob(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  color = '#6c7077',
  radius = 1.8,
): void {
  circle(ctx, cx, cy, radius, color, alpha('#1b1f24', 0.35), 1);
  circle(ctx, cx - radius * 0.25, cy - radius * 0.25, radius * 0.35, alpha('#ffffff', 0.65), null);
}

export function metalBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  r = 1.6,
): void {
  box(ctx, x, y, w, h, r, color, alpha(shade(color, -0.5), 0.4), 1);
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, alpha('#ffffff', 0.35));
  grad.addColorStop(0.5, alpha('#ffffff', 0));
  grad.addColorStop(1, alpha('#000000', 0.08));
  box(ctx, x, y, w, h, r, grad, null);
}

export function glass(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  tint: string,
  r = 1.2,
): void {
  box(ctx, x, y, w, h, r, alpha(tint, 0.5), alpha(shade(tint, -0.55), 0.55), 1.2);
  line(ctx, x + 1.4, y + h - 1.4, x + w * 0.42, y + 1.4, alpha('#ffffff', 0.6), 1.2);
}

/** Sombra suave projetada sob o móvel, em coordenadas locais. */
export function softShadow(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  radius: number,
  opacity = 0.075,
): void {
  ctx.save();
  ctx.globalAlpha = opacity;
  box(ctx, 2.5, 3.5, w, d, radius, '#20242a', null);
  ctx.globalAlpha = opacity * 0.6;
  box(ctx, 5, 7, w, d, radius, '#20242a', null);
  ctx.restore();
}

export function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
  color: string,
  align: CanvasTextAlign = 'center',
  weight = '600',
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${'Inter, Segoe UI, system-ui, sans-serif'}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x, y);
  ctx.restore();
}
