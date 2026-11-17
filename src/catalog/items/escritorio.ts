/** Itens de escritório: gaveteiro volante e quadro branco. */
import type { FurnitureDef } from '../types';
import { alpha, box, circle, line } from '../draw';

export const escritorio: FurnitureDef[] = [
  {
    id: 'gaveteiro',
    name: 'Gaveteiro volante',
    category: 'armarios',
    w: 42,
    d: 52,
    keywords: ['gaveteiro', 'escritorio', 'gavetas', 'home office', 'arquivo'],
    colors: { main: '#e6e0d3', accent: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Corpo', palette: 'wood' },
      { key: 'accent', label: 'Puxadores', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 3, colors.main, alpha('#3a2a1c', 0.42), 1.5);
      for (let i = 1; i < 3; i++) {
        line(ctx, 2, (d / 3) * i, w - 2, (d / 3) * i, alpha('#3a2a1c', 0.24), 1.2);
      }
      for (let i = 0; i < 3; i++) {
        line(ctx, w * 0.3, (d / 3) * i + d / 6, w * 0.7, (d / 3) * i + d / 6, colors.accent, 2.2);
      }
      for (const x of [6, w - 6]) {
        for (const y of [6, d - 6]) circle(ctx, x, y, 2.4, alpha('#3b3f45', 0.8), null);
      }
    },
  },
  {
    id: 'quadro-branco',
    name: 'Quadro branco',
    category: 'decoracao',
    w: 120,
    d: 6,
    keywords: ['quadro', 'branco', 'lousa', 'escritorio', 'reuniao', 'parede'],
    flat: true,
    zBias: 4,
    colors: { main: '#c9ccce' },
    colorKeys: [{ key: 'main', label: 'Moldura', palette: 'metal' }],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 1.5, colors.main, alpha('#2c2f33', 0.5), 1.2);
      box(ctx, 3, 1.2, w - 6, d - 2.4, 1, '#fbfcfd', alpha('#8d9498', 0.45), 1);
      line(ctx, w * 0.2, d - 1, w * 0.8, d - 1, alpha('#6c7077', 0.8), 2);
      const pens = ['#c07f63', '#43626b', '#3b3f45'];
      for (let i = 0; i < pens.length; i++) {
        line(ctx, w * 0.36 + i * 10, d - 2.4, w * 0.36 + i * 10 + 6, d - 2.4, pens[i], 2);
      }
    },
  },
];
