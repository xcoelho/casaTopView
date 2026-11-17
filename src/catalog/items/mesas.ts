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
];
