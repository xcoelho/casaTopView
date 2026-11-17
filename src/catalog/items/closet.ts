/** Itens de closet: ilha central e arara de roupas. */
import type { FurnitureDef } from '../types';
import { alpha, box, grain, line, metalBar } from '../draw';

export const closet: FurnitureDef[] = [
  {
    id: 'ilha-closet',
    name: 'Ilha de closet',
    category: 'armarios',
    w: 160,
    d: 70,
    keywords: ['ilha', 'closet', 'gavetas', 'roupa', 'quarto'],
    colors: { main: '#c19a6b', accent: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Madeira', palette: 'wood' },
      { key: 'accent', label: 'Puxadores', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, colors.main, alpha('#3a2a1c', 0.42), 1.6);
      grain(ctx, 1, 1, w - 2, d - 2, colors.main, 14);
      // Bancadas de gavetas nas pontas e bandeja central de vidro.
      for (const x of [w * 0.26, w * 0.74]) {
        line(ctx, x, 4, x, d - 4, alpha('#3a2a1c', 0.2), 1.3);
      }
      box(ctx, w * 0.3, 10, w * 0.4, d - 20, 3, alpha('#dfeef2', 0.6), alpha('#3a2a1c', 0.25), 1.2);
    },
  },
  {
    id: 'arara-roupas',
    name: 'Arara de roupas',
    category: 'armarios',
    w: 120,
    d: 55,
    keywords: ['arara', 'cabide', 'roupa', 'closet', 'pendurar'],
    colors: { main: '#3b3f45', accent: '#cbb79a' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'metal' },
      { key: 'accent', label: 'Roupas', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      metalBar(ctx, 3, 3, 3, d - 6, colors.main, 1.2);
      metalBar(ctx, w - 6, 3, 3, d - 6, colors.main, 1.2);
      line(ctx, 4.5, d * 0.36, w - 4.5, d * 0.36, alpha(colors.main, 0.95), 2.4);
      const count = 5;
      for (let i = 0; i < count; i++) {
        const x = 14 + i * ((w - 28) / (count - 1));
        line(ctx, x, d * 0.36, x, d * 0.44, alpha('#6c7077', 0.75), 1.3);
        box(ctx, x - 9, d * 0.44, 18, d * 0.5, 2, alpha(colors.accent, 0.72), alpha('#5a4a38', 0.3), 1.1);
      }
    },
  },
];
