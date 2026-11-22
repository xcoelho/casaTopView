import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, glass, line } from '../../catalog/draw';

export default {
  id: 'espelho',
  name: 'Espelho',
  category: 'banheiro',
  w: 70,
  d: 6,
  keywords: ['espelho', 'banheiro'],
  flat: true,
  zBias: 4,
  colors: { main: '#cfe3e8' },
  colorKeys: [{ key: 'main', label: 'Reflexo', palette: 'glass' }],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 2, alpha(colors.main, 0.8), alpha('#6c7b80', 0.5), 1.2);
    line(ctx, w * 0.25, d - 1, w * 0.4, 1, alpha('#ffffff', 0.85), 1.4);
    line(ctx, w * 0.55, d - 1, w * 0.7, 1, alpha('#ffffff', 0.6), 1.1);
  },
} satisfies FurnitureDef;
