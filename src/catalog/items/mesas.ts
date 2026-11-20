import type { FurnitureDef } from '../types';
import { alpha, box, circle, grain, line, shade } from '../draw';

function top(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  color: string,
  radius = 5,
): void {
  box(ctx, 0, 0, w, d, radius, color, alpha(shade(color, -0.62), 0.45), 1.7);
  grain(ctx, 2, 2, w - 4, d - 4, color, 13);
  box(ctx, 3.5, 3.5, w - 7, d - 7, Math.max(radius - 2, 1), null, alpha('#ffffff', 0.4), 1);
}

function legs(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  color: string,
  r = 3.4,
): void {
  const dark = shade(color, -0.3);
  for (const [x, y] of [
    [9, 9],
    [w - 9, 9],
    [9, d - 9],
    [w - 9, d - 9],
  ]) {
    circle(ctx, x, y, r, dark, alpha('#241c14', 0.3), 1);
  }
}

export const mesas: FurnitureDef[] = [
  {
    id: 'mesa-jantar-4',
    name: 'Mesa de jantar 4',
    category: 'mesas',
    w: 140,
    d: 85,
    keywords: ['mesa', 'jantar', 'refeicao'],
    colors: { main: '#c19a6b' },
    colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
    draw: ({ ctx, w, d, colors }) => {
      legs(ctx, w, d, colors.main);
      top(ctx, w, d, colors.main);
    },
  },
  {
    id: 'mesa-jantar-6',
    name: 'Mesa de jantar 6',
    category: 'mesas',
    w: 200,
    d: 100,
    keywords: ['mesa', 'jantar', 'refeicao'],
    colors: { main: '#c19a6b' },
    colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
    draw: ({ ctx, w, d, colors }) => {
      legs(ctx, w, d, colors.main, 4);
      top(ctx, w, d, colors.main);
      line(ctx, 12, d / 2, w - 12, d / 2, alpha('#ffffff', 0.18), 1);
    },
  },
  {
    id: 'mesa-redonda',
    name: 'Mesa redonda',
    category: 'mesas',
    w: 120,
    d: 120,
    keywords: ['mesa', 'redonda', 'jantar'],
    colors: { main: '#c19a6b' },
    colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
    draw: ({ ctx, w, d, colors }) => {
      const cx = w / 2;
      const cy = d / 2;
      const r = Math.min(w, d) / 2 - 2;
      circle(ctx, cx, cy, r, colors.main, alpha(shade(colors.main, -0.62), 0.45), 1.7);
      circle(ctx, cx, cy, r - 4, null, alpha('#ffffff', 0.4), 1.1);
      circle(ctx, cx, cy, 7, shade(colors.main, -0.2), alpha('#2c2116', 0.25), 1);
    },
  },
  {
    id: 'mesa-centro',
    name: 'Mesa de centro',
    category: 'mesas',
    w: 110,
    d: 60,
    keywords: ['mesa', 'centro', 'sala'],
    colors: { main: '#8a6142' },
    colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 6, 6, w - 12, d - 12, 4, colors.main, alpha(shade(colors.main, -0.55), 0.45), 1.5);
      grain(ctx, 7, 7, w - 14, d - 14, colors.main, 11);
      box(ctx, 0, 0, w, d, 6, null, alpha(shade(colors.main, -0.5), 0.55), 1.6);
    },
  },
  {
    id: 'mesa-lateral',
    name: 'Mesa lateral',
    category: 'mesas',
    w: 45,
    d: 45,
    keywords: ['mesa', 'lateral', 'apoio'],
    colors: { main: '#8a6142' },
    colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
    draw: ({ ctx, w, d, colors }) => {
      const cx = w / 2;
      circle(ctx, cx, cx, Math.min(w, d) / 2 - 2, colors.main, alpha(shade(colors.main, -0.55), 0.45), 1.5);
      circle(ctx, cx, cx, 6, null, alpha('#ffffff', 0.35), 1);
    },
  },
  {
    id: 'mesa-escritorio',
    name: 'Mesa de escritório',
    category: 'mesas',
    w: 140,
    d: 70,
    keywords: ['mesa', 'escritorio', 'home office'],
    colors: { main: '#d8bb92' },
    colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
    draw: ({ ctx, w, d, colors }) => {
      top(ctx, w, d, colors.main, 3);
      box(ctx, w - 40, 6, 34, d - 12, 3, null, alpha('#2c2418', 0.25), 1.2);
      circle(ctx, w - 22, 14, 2.4, alpha('#2c2418', 0.45), null);
      line(ctx, 10, 8, 10, d - 8, alpha('#2c2418', 0.12), 1);
    },
  },
  {
    id: 'mesa-l',
    name: 'Mesa em L',
    category: 'mesas',
    w: 170,
    d: 150,
    keywords: ['mesa', 'escritorio', 'home office', 'L'],
    colors: { main: '#d8bb92', accent: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Tampo', palette: 'wood' },
      { key: 'accent', label: 'Pés', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      const t = 62;
      box(ctx, 0, 0, w, t, 4, colors.main, alpha('#2c2418', 0.35), 1.6);
      box(ctx, 0, t - 1, t + 10, d - t + 1, 4, colors.main, alpha('#2c2418', 0.35), 1.6);
      grain(ctx, 2, 2, w - 4, t - 4, colors.main, 12);
      grain(ctx, 2, t + 2, t + 6, d - t - 4, colors.main, 12, true);
      circle(ctx, w - 26, t / 2, 3.2, alpha('#2c2418', 0.4), null);
      circle(ctx, 30, d - 22, 3.2, alpha('#2c2418', 0.4), null);
      for (const [x, y] of [
        [6, d - 6],
        [w - 6, 6],
      ]) {
        circle(ctx, x, y, 3.4, shade(colors.accent, -0.15), null);
      }
    },
  },
  {
    id: 'mesa-jantar-cavalete',
    name: 'Mesa de jantar cavalete',
    category: 'mesas',
    w: 200,
    d: 100,
    keywords: ['mesa', 'jantar', 'cavalete', 'rustica', 'madeira'],
    colors: { main: '#8a6142' },
    colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, colors.main, alpha(shade(colors.main, -0.5), 0.45), 1.6);
      grain(ctx, 2, 2, w - 4, d - 4, colors.main, 13);
      for (let i = 1; i < 4; i++) {
        line(ctx, 4, (d / 4) * i, w - 4, (d / 4) * i, alpha('#ffffff', 0.14), 1.2);
      }
      for (const x of [w * 0.2, w * 0.8]) {
        box(ctx, x - 6, 6, 12, d - 12, 2, shade(colors.main, -0.25), alpha('#241c14', 0.3), 1.2);
      }
    },
  },
  {
    id: 'mesa-jantar-vidro',
    name: 'Mesa de jantar de vidro',
    category: 'mesas',
    w: 180,
    d: 95,
    keywords: ['mesa', 'jantar', 'vidro', 'moderna'],
    colors: { main: '#cfe3e8', accent: '#8a6142' },
    colorKeys: [
      { key: 'main', label: 'Tampo', palette: 'glass' },
      { key: 'accent', label: 'Base', palette: 'wood' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      for (const x of [w * 0.2, w * 0.8]) {
        line(ctx, x - 8, 8, x + 8, d - 8, colors.accent, 3.4);
        line(ctx, x + 8, 8, x - 8, d - 8, colors.accent, 3.4);
      }
      box(ctx, 0, 0, w, d, 6, alpha(colors.main, 0.75), alpha(shade(colors.main, -0.55), 0.55), 1.6);
      line(ctx, 6, d - 6, w * 0.42, 6, alpha('#ffffff', 0.6), 1.2);
    },
  },
  {
    id: 'mesa-tulipa',
    name: 'Mesa tulipa',
    category: 'mesas',
    w: 110,
    d: 110,
    keywords: ['mesa', 'tulipa', 'redonda', 'marmore', 'jantar'],
    colors: { main: '#eeeee9', accent: '#f4f1ea' },
    colorKeys: [
      { key: 'main', label: 'Tampo', palette: 'stone' },
      { key: 'accent', label: 'Base', palette: 'paint' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      const cx = w / 2;
      const cy = d / 2;
      const r = Math.min(w, d) / 2 - 2;
      circle(ctx, cx, cy, 8, shade(colors.accent, -0.15), null);
      circle(ctx, cx, cy, r, colors.main, alpha('#8d9498', 0.5), 1.6);
      circle(ctx, cx, cy, r - 5, null, alpha('#ffffff', 0.4), 1);
      grain(ctx, cx - r + 6, cy - r + 6, r * 2 - 12, r * 2 - 12, colors.main, 22);
    },
  },
  {
    id: 'mesa-centro-organica',
    name: 'Mesa de centro orgânica',
    category: 'mesas',
    w: 120,
    d: 70,
    keywords: ['mesa', 'centro', 'organica', 'vidro', 'sala'],
    colors: { main: '#cfe3e8', accent: '#8a6142' },
    colorKeys: [
      { key: 'main', label: 'Tampo', palette: 'glass' },
      { key: 'accent', label: 'Base', palette: 'wood' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(w / 2, d / 2, w / 2 - 2, d / 2 - 2, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = alpha(colors.main, 0.8);
      ctx.fill();
      ctx.strokeStyle = alpha(shade(colors.main, -0.55), 0.55);
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();
      line(ctx, w * 0.35, d * 0.3, w * 0.6, d * 0.75, colors.accent, 4);
      line(ctx, w * 0.6, d * 0.3, w * 0.4, d * 0.75, shade(colors.accent, -0.15), 4);
    },
  },
  {
    id: 'mesa-lateral-tambor',
    name: 'Mesa lateral tambor',
    category: 'mesas',
    w: 50,
    d: 50,
    keywords: ['mesa', 'lateral', 'tambor', 'apoio', 'redonda'],
    colors: { main: '#3b3f45', accent: '#eeeee9' },
    colorKeys: [
      { key: 'main', label: 'Corpo', palette: 'metal' },
      { key: 'accent', label: 'Tampo', palette: 'stone' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      const cx = w / 2;
      const cy = d / 2;
      const r = Math.min(w, d) / 2 - 2;
      circle(ctx, cx, cy, r, colors.main, alpha('#14171b', 0.45), 1.5);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        line(ctx, cx, cy, cx + Math.cos(a) * r, cy + Math.sin(a) * r, alpha('#ffffff', 0.1), 1);
      }
      circle(ctx, cx, cy, r - 4, colors.accent, alpha('#8d9498', 0.4), 1.2);
    },
  },
];
