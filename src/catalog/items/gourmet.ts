/** Itens de área gourmet e jardim: pergolado e jardineira. */
import type { FurnitureDef } from '../types';
import { alpha, box, circle, line, shade } from '../draw';

export const gourmet: FurnitureDef[] = [
  {
    id: 'pergolado',
    name: 'Pergolado',
    category: 'externo',
    w: 300,
    d: 300,
    keywords: ['pergolado', 'pergola', 'gourmet', 'externo', 'cobertura', 'jardim'],
    flat: true,
    zBias: 7,
    colors: { main: '#b08968', accent: '#a9a9a4' },
    colorKeys: [
      { key: 'main', label: 'Madeira', palette: 'wood' },
      { key: 'accent', label: 'Pilares', palette: 'stone' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 3, alpha(colors.main, 0.1), alpha('#3a2a1c', 0.35), 1.6);
      for (const x of [12, w - 12]) {
        for (const y of [12, d - 12]) {
          box(ctx, x - 9, y - 9, 18, 18, 2, colors.accent, alpha('#4a4f52', 0.45), 1.4);
        }
      }
      box(ctx, 0, 0, w, 10, 2, alpha(colors.main, 0.55), alpha('#3a2a1c', 0.4), 1.4);
      box(ctx, 0, d - 10, w, 10, 2, alpha(colors.main, 0.55), alpha('#3a2a1c', 0.4), 1.4);
      box(ctx, 0, 0, 10, d, 2, alpha(colors.main, 0.55), alpha('#3a2a1c', 0.4), 1.4);
      box(ctx, w - 10, 0, 10, d, 2, alpha(colors.main, 0.55), alpha('#3a2a1c', 0.4), 1.4);
      const slats = Math.max(6, Math.round(d / 30));
      for (let i = 1; i < slats; i++) {
        const y = (d / slats) * i;
        line(ctx, 10, y, w - 10, y, alpha(colors.main, 0.65), 3);
      }
    },
  },
  {
    id: 'jardineira',
    name: 'Jardineira',
    category: 'externo',
    w: 120,
    d: 45,
    keywords: ['jardineira', 'planta', 'jardim', 'externo', 'vaso', 'gourmet'],
    colors: { main: '#a9a9a4', accent: '#6f8f5c' },
    colorKeys: [
      { key: 'main', label: 'Caixa', palette: 'stone' },
      { key: 'accent', label: 'Plantas', palette: 'plant' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 3, colors.main, alpha('#4a4f52', 0.45), 1.5);
      box(ctx, 4, 4, w - 8, d - 8, 2, alpha('#3d3128', 0.75), alpha('#2b2724', 0.3), 1.1);
      const count = 6;
      for (let i = 0; i < count; i++) {
        const x = 14 + i * ((w - 28) / (count - 1));
        circle(
          ctx,
          x,
          d / 2,
          10 - (i % 3),
          alpha(colors.accent, 0.85),
          alpha(shade(colors.accent, -0.4), 0.4),
          1.1,
        );
      }
    },
  },
];
