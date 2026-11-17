import type { FurnitureDef } from '../types';
import { alpha, box, circle, line, metalBar, shade } from '../draw';

export const eletro: FurnitureDef[] = [
  {
    id: 'ar-split',
    name: 'Ar-condicionado split',
    category: 'eletro',
    w: 90,
    d: 22,
    keywords: ['ar', 'condicionado', 'split', 'clima'],
    flat: true,
    zBias: 3,
    colors: { main: '#f4f1ea' },
    colorKeys: [{ key: 'main', label: 'Corpo', palette: 'paint' }],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, colors.main, alpha('#8d9498', 0.5), 1.3);
      for (let i = 1; i < 3; i++) {
        line(ctx, 6, (d / 3) * i, w - 6, (d / 3) * i, alpha('#8d9498', 0.4), 1);
      }
      circle(ctx, w - 12, d / 2, 2.2, alpha('#7f8790', 0.7), null);
    },
  },
  {
    id: 'maquina-lavar',
    name: 'Máquina de lavar',
    category: 'eletro',
    w: 62,
    d: 64,
    keywords: ['maquina', 'lavar', 'lava', 'roupa', 'lavanderia'],
    colors: { main: '#f4f1ea', accent: '#8d9498' },
    colorKeys: [
      { key: 'main', label: 'Corpo', palette: 'paint' },
      { key: 'accent', label: 'Detalhes', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, colors.main, alpha('#8d9498', 0.5), 1.4);
      box(ctx, 2, 2, w - 4, 12, 2, alpha('#ffffff', 0.4), alpha('#8d9498', 0.3), 1);
      circle(ctx, w / 2, d * 0.6, Math.min(w, d) * 0.28, alpha('#d9e4e6', 0.9), colors.accent, 1.6);
      circle(ctx, w / 2, d * 0.6, Math.min(w, d) * 0.16, alpha('#b9c9cc', 0.6), alpha('#8d9498', 0.4), 1.1);
      circle(ctx, w - 12, 8, 2.2, colors.accent, null);
    },
  },
  {
    id: 'secadora',
    name: 'Secadora',
    category: 'eletro',
    w: 62,
    d: 64,
    keywords: ['secadora', 'roupa', 'lavanderia'],
    colors: { main: '#e6e0d3', accent: '#3b3f45' },
    colorKeys: [
      { key: 'main', label: 'Corpo', palette: 'paint' },
      { key: 'accent', label: 'Painel', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, colors.main, alpha('#8d9498', 0.5), 1.4);
      box(ctx, 2, d - 14, w - 4, 11, 2, colors.accent, null);
      circle(ctx, 12, d - 8.5, 2.2, alpha('#ffffff', 0.6), null);
      circle(ctx, 22, d - 8.5, 2.2, alpha('#ffffff', 0.4), null);
      circle(ctx, w / 2, d * 0.42, Math.min(w, d) * 0.27, alpha('#fdfcf7', 0.8), colors.accent, 1.5);
      line(ctx, w / 2 - 10, d * 0.42, w / 2 + 10, d * 0.42, alpha('#8d9498', 0.4), 1.1);
    },
  },
  {
    id: 'tv',
    name: 'TV',
    category: 'eletro',
    w: 130,
    d: 9,
    keywords: ['tv', 'televisao', 'sala', 'parede'],
    flat: true,
    zBias: 4,
    colors: { main: '#2c3036' },
    colorKeys: [{ key: 'main', label: 'Moldura', palette: 'metal' }],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 1.6, colors.main, alpha('#101215', 0.5), 1.2);
      box(ctx, 3, 2.4, w - 6, d - 4.8, 1, alpha('#7f8b96', 0.45), null);
      line(ctx, 3, d / 2, w * 0.42, d / 2, alpha('#ffffff', 0.22), 1.1);
      box(ctx, w / 2 - 6, d - 0.5, 12, 3, 1, shade(colors.main, -0.2), null);
    },
  },
];
