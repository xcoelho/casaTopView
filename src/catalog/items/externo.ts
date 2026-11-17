import type { FurnitureDef } from '../types';
import { alpha, box, circle, grain, line, shade } from '../draw';

export const externo: FurnitureDef[] = [
  {
    id: 'mesa-varanda',
    name: 'Mesa de varanda',
    category: 'externo',
    w: 150,
    d: 80,
    keywords: ['mesa', 'varanda', 'jardim', 'externa'],
    colors: { main: '#b08968' },
    colorKeys: [{ key: 'main', label: 'Madeira', palette: 'wood' }],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, colors.main, alpha('#3a2a1c', 0.4), 1.5);
      for (let i = 1; i < 12; i++) {
        line(ctx, (w / 12) * i, 3, (w / 12) * i, d - 3, alpha('#3a2a1c', 0.18), 1.2);
      }
      box(ctx, 6, d * 0.3, 0.6, d * 0.4, 0, null, alpha('#3a2a1c', 0.1), 1);
      circle(ctx, 12, d - 8, 3, shade(colors.main, -0.25), null);
    },
  },
  {
    id: 'espreguicadeira',
    name: 'Espreguiçadeira',
    category: 'externo',
    w: 70,
    d: 185,
    keywords: ['espreguicadeira', 'praia', 'piscina', 'varanda'],
    colors: { main: '#b08968', accent: '#e6ddcd' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'wood' },
      { key: 'accent', label: 'Estofado', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 6, colors.main, alpha('#3a2a1c', 0.4), 1.4);
      box(ctx, 5, 8, w - 10, d - 16, 5, colors.accent, alpha('#5a4a38', 0.35), 1.2);
      box(ctx, 5, 8, w - 10, 34, 5, shade(colors.accent, -0.12), alpha('#5a4a38', 0.35), 1.2);
      line(ctx, 5, 60, w - 5, 60, alpha('#5a4a38', 0.3), 1.2);
      for (let i = 0; i < 4; i++) {
        line(ctx, 10 + i * 14, d - 12, 14 + i * 14, 46, alpha('#3a2a1c', 0.12), 1);
      }
    },
  },
  {
    id: 'churrasqueira',
    name: 'Churrasqueira',
    category: 'externo',
    w: 120,
    d: 62,
    keywords: ['churrasqueira', 'churrasco', 'varanda', 'externa'],
    colors: { main: '#a9a9a4', accent: '#3b3f45' },
    colorKeys: [
      { key: 'main', label: 'Alvenaria', palette: 'stone' },
      { key: 'accent', label: 'Grelha', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, colors.main, alpha('#4a4f52', 0.35), 1.4);
      box(ctx, 8, 8, w * 0.62, d - 16, 3, colors.accent, alpha('#14171b', 0.4), 1.3);
      for (let i = 1; i < 8; i++) {
        line(ctx, (w * 0.62 / 8) * i + 8, 10, (w * 0.62 / 8) * i + 8, d - 10, alpha('#d9dde1', 0.35), 1.4);
      }
      box(ctx, w * 0.74, 14, w * 0.2, d - 28, 2, alpha('#ffffff', 0.3), alpha('#4a4f52', 0.3), 1.1);
      circle(ctx, w * 0.84, d / 2, 3, alpha('#8d9498', 0.6), null);
    },
  },
  {
    id: 'piscina',
    name: 'Piscina',
    category: 'externo',
    w: 500,
    d: 250,
    keywords: ['piscina', 'agua', 'externo', 'jardim'],
    flat: true,
    zBias: -3,
    colors: { main: '#8fc8d4', accent: '#eeeee9' },
    colorKeys: [
      { key: 'main', label: 'Água', palette: 'glass' },
      { key: 'accent', label: 'Borda', palette: 'stone' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 10, colors.accent, alpha('#6f7a7d', 0.4), 1.6);
      box(ctx, 14, 14, w - 28, d - 28, 6, alpha(colors.main, 0.9), alpha(shade(colors.main, -0.4), 0.6), 1.4);
      for (let i = 1; i < 7; i++) {
        ctx.beginPath();
        ctx.strokeStyle = alpha('#ffffff', 0.35);
        ctx.lineWidth = 1.4;
        for (let x = 20; x < w - 20; x += 6) {
          const y = 20 + (d - 40) * (i / 7) + Math.sin(x / 26 + i) * 4;
          if (x === 20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      box(ctx, w - 60, 20, 26, 34, 3, alpha('#ffffff', 0.5), alpha('#6f7a7d', 0.4), 1.1);
    },
  },
  {
    id: 'banco-jardim',
    name: 'Banco de jardim',
    category: 'externo',
    w: 150,
    d: 50,
    keywords: ['banco', 'jardim', 'externo'],
    colors: { main: '#b08968', accent: '#3b3f45' },
    colorKeys: [
      { key: 'main', label: 'Madeira', palette: 'wood' },
      { key: 'accent', label: 'Ferragens', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d * 0.34, 3, colors.main, alpha('#3a2a1c', 0.4), 1.3);
      box(ctx, 0, d * 0.4, w, d * 0.6, 3, colors.main, alpha('#3a2a1c', 0.4), 1.3);
      grain(ctx, 2, d * 0.42, w - 4, d * 0.56, colors.main, 8);
      for (const x of [8, w - 12]) {
        box(ctx, x, d * 0.32, 4, d * 0.14, 1, colors.accent, null);
      }
    },
  },
];
