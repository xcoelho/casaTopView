import type { FurnitureDef } from '../types';
import { alpha, box, circle, cushion, line, shade } from '../draw';

function drawSofa(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  fabric: string,
  seats: number,
): void {
  const dark = shade(fabric, -0.15);
  const light = shade(fabric, 0.1);
  box(ctx, 0, 0, w, d, 9, fabric, alpha(shade(fabric, -0.5), 0.42), 1.6);
  box(ctx, 3, 2, w - 6, 21, 6, dark, alpha(shade(fabric, -0.55), 0.3), 1.2);
  const arm = 15;
  box(ctx, 2, 18, arm, d - 21, 5, dark, alpha(shade(fabric, -0.55), 0.3), 1.2);
  box(ctx, w - 2 - arm, 18, arm, d - 21, 5, dark, alpha(shade(fabric, -0.55), 0.3), 1.2);
  const x0 = arm + 4;
  const x1 = w - arm - 4;
  const sw = (x1 - x0) / seats;
  for (let i = 0; i < seats; i++) {
    cushion(ctx, x0 + i * sw + 1.5, 24, sw - 3, d - 29, 5, light);
  }
  line(ctx, 4, d - 3.5, w - 4, d - 3.5, alpha('#2c241c', 0.16), 1.2);
}

export const assentos: FurnitureDef[] = [
  {
    id: 'sofa-2',
    name: 'Sofá 2 lugares',
    category: 'assentos',
    w: 165,
    d: 88,
    keywords: ['sofa', 'sala', 'estar'],
    colors: { main: '#cbb79a' },
    colorKeys: [{ key: 'main', label: 'Estofado', palette: 'fabric' }],
    draw: ({ ctx, w, d, colors }) => drawSofa(ctx, w, d, colors.main, 2),
  },
  {
    id: 'sofa-3',
    name: 'Sofá 3 lugares',
    category: 'assentos',
    w: 220,
    d: 90,
    keywords: ['sofa', 'sala', 'estar'],
    colors: { main: '#cbb79a' },
    colorKeys: [{ key: 'main', label: 'Estofado', palette: 'fabric' }],
    draw: ({ ctx, w, d, colors }) => drawSofa(ctx, w, d, colors.main, 3),
  },
  {
    id: 'sofa-chaise',
    name: 'Sofá com chaise',
    category: 'assentos',
    w: 250,
    d: 165,
    keywords: ['sofa', 'chaise', 'retratil'],
    colors: { main: '#8f9a76' },
    colorKeys: [{ key: 'main', label: 'Estofado', palette: 'fabric' }],
    draw: ({ ctx, w, d, colors }) => {
      const f = colors.main;
      const dark = shade(f, -0.15);
      const light = shade(f, 0.1);
      const sofaD = 88;
      const chaiseW = 104;
      box(ctx, 0, 0, w, sofaD, 9, f, null);
      box(ctx, w - chaiseW, sofaD - 4, chaiseW, d - sofaD + 4, 9, f, null);
      box(ctx, 0, 0, w, d, 9, null, alpha(shade(f, -0.5), 0.42), 1.6);
      box(ctx, 3, 2, w - 6, 21, 6, dark, null);
      box(ctx, 2, 18, 15, sofaD - 21, 5, dark, null);
      box(ctx, w - chaiseW + 4, sofaD + 2, 13, d - sofaD - 8, 5, dark, null);
      const x0 = 20;
      const x1 = w - chaiseW;
      const sw = (x1 - x0) / 2;
      cushion(ctx, x0 + 1.5, 24, sw - 3, sofaD - 29, 5, light);
      cushion(ctx, x0 + sw + 1.5, 24, sw - 3, sofaD - 29, 5, light);
      cushion(ctx, w - chaiseW + 6, sofaD + 4, chaiseW - 24, d - sofaD - 12, 5, light);
    },
  },
  {
    id: 'poltrona',
    name: 'Poltrona',
    category: 'assentos',
    w: 90,
    d: 85,
    keywords: ['poltrona', 'cadeira', 'leitura'],
    colors: { main: '#8f9a76' },
    colorKeys: [{ key: 'main', label: 'Estofado', palette: 'fabric' }],
    draw: ({ ctx, w, d, colors }) => drawSofa(ctx, w, d, colors.main, 1),
  },
  {
    id: 'puff',
    name: 'Puff',
    category: 'assentos',
    w: 62,
    d: 62,
    keywords: ['puff', 'banco'],
    colors: { main: '#c07f63' },
    colorKeys: [{ key: 'main', label: 'Tecido', palette: 'fabric' }],
    draw: ({ ctx, w, d, colors }) => {
      const f = colors.main;
      const cx = w / 2;
      const cy = d / 2;
      const r = Math.min(w, d) / 2 - 3;
      circle(ctx, cx, cy, r, f, alpha(shade(f, -0.5), 0.42), 1.6);
      circle(ctx, cx, cy, r * 0.62, null, alpha(shade(f, 0.4), 0.55), 1.2);
      line(ctx, cx - r * 0.6, cy, cx + r * 0.6, cy, alpha(shade(f, -0.4), 0.35), 1.1);
      line(ctx, cx, cy - r * 0.6, cx, cy + r * 0.6, alpha(shade(f, -0.4), 0.35), 1.1);
    },
  },
  {
    id: 'cadeira-jantar',
    name: 'Cadeira de jantar',
    category: 'assentos',
    w: 48,
    d: 52,
    keywords: ['cadeira', 'jantar', 'mesa'],
    colors: { main: '#c19a6b', accent: '#ded4c1' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'wood' },
      { key: 'accent', label: 'Assento', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 4, 1, w - 8, 11, 4, colors.main, alpha('#3a2c1e', 0.4), 1.3);
      box(ctx, 3, 6, 6, d - 10, 3, colors.main, null);
      box(ctx, w - 9, 6, 6, d - 10, 3, colors.main, null);
      cushion(ctx, 6, 13, w - 12, d - 20, 5, colors.accent);
      circle(ctx, 7, d - 4, 2, shade(colors.main, -0.25), null);
      circle(ctx, w - 7, d - 4, 2, shade(colors.main, -0.25), null);
    },
  },
  {
    id: 'cadeira-escritorio',
    name: 'Cadeira de escritório',
    category: 'assentos',
    w: 64,
    d: 64,
    keywords: ['cadeira', 'escritorio', 'giratória'],
    colors: { main: '#5d6169', accent: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Estofado', palette: 'fabric' },
      { key: 'accent', label: 'Base', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      const cx = w / 2;
      const cy = d / 2 + 2;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        line(
          ctx,
          cx,
          cy,
          cx + Math.cos(a) * (w / 2 - 5),
          cy + Math.sin(a) * (d / 2 - 5),
          colors.accent,
          3.2,
        );
      }
      circle(ctx, cx, cy, 4.5, shade(colors.accent, -0.2), null);
      box(ctx, cx - 17, cy - 16, 34, 26, 7, colors.main, alpha('#1d2024', 0.4), 1.4);
      box(ctx, cx - 19, 2, 38, 12, 6, shade(colors.main, -0.1), alpha('#1d2024', 0.4), 1.4);
    },
  },
  {
    id: 'banqueta',
    name: 'Banqueta',
    category: 'assentos',
    w: 38,
    d: 38,
    keywords: ['banqueta', 'banco', 'ilha'],
    colors: { main: '#b08968', accent: '#3b3f45' },
    colorKeys: [
      { key: 'main', label: 'Assento', palette: 'wood' },
      { key: 'accent', label: 'Pés', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      const cx = w / 2;
      const cy = d / 2;
      const r = Math.min(w, d) / 2 - 3;
      circle(ctx, cx, cy, r + 2.5, null, colors.accent, 1.6);
      circle(ctx, cx, cy, r, colors.main, alpha('#3a2c1e', 0.4), 1.4);
      circle(ctx, cx, cy, r * 0.38, null, alpha('#3a2c1e', 0.22), 1.1);
    },
  },
  {
    id: 'cadeira-concha',
    name: 'Cadeira concha',
    category: 'assentos',
    w: 60,
    d: 58,
    keywords: ['cadeira', 'concha', 'sala', 'jantar', 'acento', 'trançada'],
    colors: { main: '#33373c', accent: '#d8bb92' },
    colorKeys: [
      { key: 'main', label: 'Concha', palette: 'paint' },
      { key: 'accent', label: 'Pés', palette: 'wood' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 2, 2, w - 4, d - 4, 15, colors.main, alpha('#14171b', 0.45), 1.6);
      box(ctx, 8, 12, w - 16, d - 22, 11, shade(colors.main, 0.12), alpha('#000000', 0.3), 1.2);
      cushion(ctx, 12, d - 26, w - 24, 14, 7, shade(colors.main, 0.18));
      for (let i = 0; i < 3; i++) {
        line(ctx, 10, 8 + i * 4, w - 10, 8 + i * 4, alpha('#ffffff', 0.14), 1.1);
      }
      for (const [x, y] of [
        [10, 10],
        [w - 10, 10],
        [10, d - 10],
        [w - 10, d - 10],
      ]) {
        circle(ctx, x, y, 3, colors.accent, alpha('#3a2c1e', 0.4), 1.1);
      }
    },
  },
  {
    id: 'cadeira-executiva',
    name: 'Cadeira executiva',
    category: 'assentos',
    w: 70,
    d: 78,
    keywords: ['cadeira', 'executiva', 'escritorio', 'presidente', 'apoio-pes', 'giratoria'],
    colors: { main: '#2b2e33', accent: '#d9dde1' },
    colorKeys: [
      { key: 'main', label: 'Couro', palette: 'fabric' },
      { key: 'accent', label: 'Base', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      const cx = w / 2;
      const cy = d / 2 - 4;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        line(
          ctx,
          cx,
          cy,
          cx + Math.cos(a) * (w / 2 - 5),
          cy + Math.sin(a) * (d / 2 - 8),
          colors.accent,
          3.2,
        );
      }
      circle(ctx, cx, cy, 4.5, shade(colors.accent, -0.2), null);
      box(ctx, cx - 18, cy - 14, 36, 30, 8, colors.main, alpha('#14171b', 0.45), 1.5);
      box(ctx, cx - 20, 2, 40, 13, 7, shade(colors.main, 0.08), alpha('#14171b', 0.45), 1.5);
      box(ctx, cx - 16, d - 16, 32, 10, 4, shade(colors.main, -0.08), alpha('#14171b', 0.4), 1.3);
      line(ctx, cx - 16, d - 16, cx + 16, d - 16, colors.accent, 2);
    },
  },
  {
    id: 'sofa-modular-l',
    name: 'Sofá modular em L',
    category: 'assentos',
    w: 240,
    d: 170,
    keywords: ['sofa', 'modular', 'L', 'chaise', 'sala'],
    colors: { main: '#8f9a76' },
    colorKeys: [{ key: 'main', label: 'Estofado', palette: 'fabric' }],
    draw: ({ ctx, w, d, colors }) => {
      const dark = shade(colors.main, -0.15);
      const light = shade(colors.main, 0.1);
      const mainD = d * 0.62;
      box(ctx, 0, 0, w, mainD, 9, colors.main, alpha(shade(colors.main, -0.5), 0.42), 1.6);
      box(ctx, 3, 2, w - 6, 21, 6, dark, alpha(shade(colors.main, -0.55), 0.3), 1.2);
      const arm = 15;
      box(ctx, 2, 18, arm, mainD - 21, 5, dark, alpha(shade(colors.main, -0.55), 0.3), 1.2);
      box(ctx, w - 2 - arm, 18, arm, d - 21, 5, dark, alpha(shade(colors.main, -0.55), 0.3), 1.2);
      const x0 = arm + 4;
      const x1 = w - 60;
      const sw = (x1 - x0) / 2;
      for (let i = 0; i < 2; i++) {
        cushion(ctx, x0 + i * sw + 1.5, 24, sw - 3, mainD - 29, 5, light);
      }
      box(ctx, w - 58, 2, 56, d - 4, 8, colors.main, alpha(shade(colors.main, -0.5), 0.42), 1.6);
      cushion(ctx, w - 54, 24, 48, d - 34, 5, light);
    },
  },
  {
    id: 'poltrona-egg',
    name: 'Poltrona egg',
    category: 'assentos',
    w: 90,
    d: 90,
    keywords: ['poltrona', 'egg', 'giratória', 'leitura', 'design'],
    colors: { main: '#c07f63', accent: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Concha', palette: 'fabric' },
      { key: 'accent', label: 'Base', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      const cx = w / 2;
      const cy = d / 2;
      const r = Math.min(w, d) / 2 - 3;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        line(ctx, cx, cy, cx + Math.cos(a) * r, cy + Math.sin(a) * r, colors.accent, 2.6);
      }
      circle(ctx, cx, cy, 4, shade(colors.accent, -0.2), null);
      circle(ctx, cx, cy, r - 8, colors.main, alpha(shade(colors.main, -0.5), 0.42), 1.6);
      circle(ctx, cx, cy - 4, r * 0.55, null, alpha(shade(colors.main, 0.3), 0.5), 1.1);
      cushion(ctx, cx - 16, cy - 2, 32, 20, 8, shade(colors.main, 0.1));
    },
  },
  {
    id: 'banqueta-industrial',
    name: 'Banqueta industrial',
    category: 'assentos',
    w: 45,
    d: 45,
    keywords: ['banqueta', 'industrial', 'metal', 'ilha', 'bar'],
    colors: { main: '#5d6169', accent: '#3b3f45' },
    colorKeys: [
      { key: 'main', label: 'Assento', palette: 'metal' },
      { key: 'accent', label: 'Estrutura', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      const cx = w / 2;
      const cy = d / 2;
      const r = Math.min(w, d) / 2 - 3;
      circle(ctx, cx, cy, r + 2.5, null, colors.accent, 1.6);
      circle(ctx, cx, cy, r, colors.main, alpha('#1d2024', 0.4), 1.4);
      circle(ctx, cx, cy, r * 0.5, null, alpha('#ffffff', 0.25), 1.1);
      for (const [x, y] of [
        [7, 7],
        [w - 7, 7],
        [7, d - 7],
        [w - 7, d - 7],
      ]) {
        circle(ctx, x, y, 2.2, colors.accent, null);
      }
    },
  },
];
