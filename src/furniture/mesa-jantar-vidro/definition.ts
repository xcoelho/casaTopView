import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line, shade } from '../../catalog/draw';

export default {
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
} satisfies FurnitureDef;
