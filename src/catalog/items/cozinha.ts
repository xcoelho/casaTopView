import type { FurnitureDef } from '../types';
import { alpha, box, circle, grain, line, metalBar, shade } from '../draw';

export const cozinha: FurnitureDef[] = [
  {
    id: 'balcao',
    name: 'Armário com balcão',
    category: 'cozinha',
    w: 120,
    d: 60,
    keywords: ['armario', 'balcao', 'cozinha', 'bancada'],
    colors: { main: '#e6e0d3', accent: '#eeeee9' },
    colorKeys: [
      { key: 'main', label: 'Armários', palette: 'paint' },
      { key: 'accent', label: 'Bancada', palette: 'stone' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 3, colors.main, alpha('#5a5346', 0.35), 1.4);
      for (let i = 1; i < 3; i++) {
        line(ctx, (w / 4) * i * 2 > w ? w / 4 : (w / 3) * i, 2, (w / 3) * i, d - 2, alpha('#5a5346', 0.2), 1.1);
      }
      box(ctx, 0, 0, w, d * 0.66, 3, colors.accent, alpha('#5a5346', 0.35), 1.4);
      grain(ctx, 2, 2, w - 4, d * 0.62, colors.accent, 22);
      for (let i = 0; i < 3; i++) {
        line(ctx, (w / 3) * i + 10, d - 12, (w / 3) * (i + 1) - 10, d - 12, '#8c9198', 2);
      }
    },
  },
  {
    id: 'pia',
    name: 'Bancada com pia',
    category: 'cozinha',
    w: 120,
    d: 60,
    keywords: ['pia', 'cuba', 'cozinha', 'bancada'],
    colors: { main: '#e6e0d3', accent: '#eeeee9', metal: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Armários', palette: 'paint' },
      { key: 'accent', label: 'Bancada', palette: 'stone' },
      { key: 'metal', label: 'Torneira', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 3, colors.main, alpha('#5a5346', 0.35), 1.4);
      box(ctx, 0, 0, w, d * 0.72, 3, colors.accent, alpha('#5a5346', 0.35), 1.4);
      grain(ctx, 2, 2, w - 4, d * 0.68, colors.accent, 22);
      // cuba
      box(ctx, w / 2 - 26, 8, 52, d - 26, 6, '#f7f7f4', alpha('#8d9498', 0.55), 1.6);
      box(ctx, w / 2 - 22, 12, 44, d - 34, 5, null, alpha('#8d9498', 0.3), 1);
      circle(ctx, w / 2, 14, 2.4, '#9aa1a6', null);
      // torneira
      circle(ctx, w / 2, 4, 4, colors.metal, alpha('#4b5056', 0.4), 1.2);
      line(ctx, w / 2, 5, w / 2, 12, colors.metal, 2.6);
      for (let i = 0; i < 2; i++) {
        line(ctx, 10 + i * 10, d - 14, 20 + i * 10, d - 14, '#8c9198', 2);
      }
    },
  },
  {
    id: 'fogao',
    name: 'Fogão / cooktop',
    category: 'cozinha',
    w: 62,
    d: 60,
    keywords: ['fogao', 'cooktop', 'cozinha'],
    colors: { main: '#3b3f45', accent: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Tampo', palette: 'metal' },
      { key: 'accent', label: 'Grelhas', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, colors.main, alpha('#1b1e22', 0.45), 1.6);
      const positions = [
        [w * 0.3, d * 0.3],
        [w * 0.7, d * 0.3],
        [w * 0.3, d * 0.72],
        [w * 0.7, d * 0.72],
      ];
      for (const [x, y] of positions) {
        circle(ctx, x, y, 8.5, alpha('#14171b', 0.55), alpha('#000000', 0.35), 1.2);
        circle(ctx, x, y, 4.2, alpha('#6d737a', 0.5), colors.accent, 1.2);
      }
      line(ctx, 4, d - 8, w - 4, d - 8, alpha('#c9ccd0', 0.35), 1.4);
    },
  },
  {
    id: 'coifa',
    name: 'Coifa',
    category: 'cozinha',
    w: 90,
    d: 52,
    keywords: ['coifa', 'exaustor', 'cozinha'],
    zBias: 5,
    flat: true,
    colors: { main: '#c9ccd0' },
    colorKeys: [{ key: 'main', label: 'Acabamento', palette: 'metal' }],
    draw: ({ ctx, w, d, colors }) => {
      ctx.save();
      ctx.setLineDash([6, 5]);
      box(ctx, 2, 2, w - 4, d - 4, 4, alpha(colors.main, 0.16), alpha('#5f666d', 0.65), 1.6);
      ctx.restore();
      box(ctx, w * 0.22, d * 0.14, w * 0.56, d * 0.72, 3, alpha('#ffffff', 0.32), alpha('#5f666d', 0.4), 1.2);
      line(ctx, w * 0.22, d * 0.36, w * 0.78, d * 0.36, alpha('#5f666d', 0.35), 1);
      line(ctx, w * 0.22, d * 0.62, w * 0.78, d * 0.62, alpha('#5f666d', 0.35), 1);
    },
  },
  {
    id: 'geladeira',
    name: 'Geladeira',
    category: 'cozinha',
    w: 72,
    d: 70,
    keywords: ['geladeira', 'refrigerador', 'cozinha'],
    colors: { main: '#d9dde1', accent: '#3b3f45' },
    colorKeys: [
      { key: 'main', label: 'Corpo', palette: 'metal' },
      { key: 'accent', label: 'Puxadores', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 5, colors.main, alpha('#5f666d', 0.45), 1.6);
      const grad = ctx.createLinearGradient(0, 0, w, d);
      grad.addColorStop(0, alpha('#ffffff', 0.35));
      grad.addColorStop(0.5, alpha('#ffffff', 0));
      grad.addColorStop(1, alpha('#000000', 0.06));
      box(ctx, 0, 0, w, d, 5, grad, null);
      line(ctx, 4, 26, w - 4, 26, alpha('#5f666d', 0.45), 1.4);
      metalBar(ctx, w / 2 - 16, 5, 3.4, 18, colors.accent, 1.6);
      metalBar(ctx, w / 2 + 12, 30, 3.4, 32, colors.accent, 1.6);
    },
  },
  {
    id: 'lava-loucas',
    name: 'Lava-louças',
    category: 'cozinha',
    w: 60,
    d: 60,
    keywords: ['lava', 'loucas', 'maquina', 'cozinha'],
    colors: { main: '#d9dde1', accent: '#3b3f45' },
    colorKeys: [
      { key: 'main', label: 'Frente', palette: 'metal' },
      { key: 'accent', label: 'Painel', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, colors.main, alpha('#5f666d', 0.45), 1.5);
      box(ctx, 3, d - 16, w - 6, 12, 2, colors.accent, null);
      for (let i = 0; i < 3; i++) {
        circle(ctx, 10 + i * 7, d - 10, 2, alpha('#ffffff', 0.55), null);
      }
      line(ctx, 8, 10, w - 8, 10, alpha('#ffffff', 0.4), 1.4);
      line(ctx, 8, 14, w - 8, 14, alpha('#5f666d', 0.25), 1);
    },
  },
  {
    id: 'ilha',
    name: 'Ilha de cozinha',
    category: 'cozinha',
    w: 160,
    d: 90,
    keywords: ['ilha', 'cozinha', 'bancada'],
    colors: { main: '#e6e0d3', accent: '#eeeee9' },
    colorKeys: [
      { key: 'main', label: 'Armários', palette: 'paint' },
      { key: 'accent', label: 'Bancada', palette: 'stone' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 6, 6, w - 12, d - 12, 4, colors.main, alpha('#5a5346', 0.3), 1.2);
      box(ctx, 0, 0, w, d, 5, colors.accent, alpha('#5a5346', 0.4), 1.7);
      grain(ctx, 3, 3, w - 6, d - 6, colors.accent, 30);
      box(ctx, 3.5, 3.5, w - 7, d - 7, 4, null, alpha('#ffffff', 0.4), 1.1);
    },
  },
  {
    id: 'prateleira-cozinha',
    name: 'Prateleira de cozinha',
    category: 'cozinha',
    w: 100,
    d: 26,
    keywords: ['prateleira', 'cozinha', 'parede', 'potes', 'temperos'],
    colors: { main: '#c19a6b', accent: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Prateleira', palette: 'wood' },
      { key: 'accent', label: 'Suportes e tampas', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 1.6, colors.main, alpha('#3a2a1c', 0.4), 1.4);
      grain(ctx, 1.5, 1.5, w - 3, d - 3, colors.main, 18, true);
      for (const x of [9, w - 9]) {
        box(ctx, x - 2, 2, 4, d - 4, 1, alpha(colors.accent, 0.55), alpha('#5f666d', 0.35), 1);
      }
      const jarColors = ['#f1efe8', '#dcd2c1', '#c07f63'];
      for (let i = 0; i < 3; i++) {
        const cx = w * (0.32 + i * 0.16);
        circle(ctx, cx, d * 0.5, 4.4, jarColors[i], alpha('#5a5346', 0.3), 1.1);
        circle(ctx, cx, d * 0.5, 2.4, alpha('#ffffff', 0.3), null);
      }
      box(ctx, w * 0.2, 6, 7, d - 12, 1, alpha('#d8bb92', 0.85), alpha('#3a2a1c', 0.3), 1);
    },
  },
  {
    id: 'geladeira-side-by-side',
    name: 'Geladeira side by side',
    category: 'cozinha',
    w: 95,
    d: 75,
    keywords: ['geladeira', 'side by side', 'inox', 'dispenser', 'cozinha'],
    colors: { main: '#d9dde1', accent: '#3b3f45' },
    colorKeys: [
      { key: 'main', label: 'Corpo', palette: 'metal' },
      { key: 'accent', label: 'Detalhes', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 5, colors.main, alpha('#5f666d', 0.45), 1.6);
      line(ctx, w / 2, 3, w / 2, d - 3, alpha('#5f666d', 0.5), 1.6);
      metalBar(ctx, w / 2 - 7, 6, 3.4, 26, colors.accent, 1.6);
      metalBar(ctx, w / 2 + 3.6, 6, 3.4, 26, colors.accent, 1.6);
      box(ctx, w * 0.08, d - 14, w * 0.34, 10, 2, colors.accent, null);
      box(ctx, w / 2 + 10, 8, 16, 18, 2, null, alpha('#5f666d', 0.4), 1.2);
    },
  },
  {
    id: 'geladeira-retro',
    name: 'Geladeira retrô',
    category: 'cozinha',
    w: 70,
    d: 70,
    keywords: ['geladeira', 'retro', 'colorida', 'cozinha'],
    colors: { main: '#c07f63', accent: '#d9dde1' },
    colorKeys: [
      { key: 'main', label: 'Corpo', palette: 'paint' },
      { key: 'accent', label: 'Detalhes', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 9, colors.main, alpha(shade(colors.main, -0.5), 0.45), 1.6);
      line(ctx, 5, d * 0.32, w - 5, d * 0.32, alpha('#ffffff', 0.35), 1.4);
      metalBar(ctx, w - 12, 6, 3.4, d * 0.56, colors.accent, 1.6);
      circle(ctx, w / 2 - 6, d * 0.2, 2.4, colors.accent, null);
    },
  },
];
