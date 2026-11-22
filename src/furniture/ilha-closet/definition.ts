import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, grain, line } from '../../catalog/draw';

export default {
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
} satisfies FurnitureDef;
