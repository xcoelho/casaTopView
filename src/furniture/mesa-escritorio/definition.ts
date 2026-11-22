import type { FurnitureDef } from '../../catalog/types';
import { top } from '../shared/mesas';
import { alpha, box, circle, line } from '../../catalog/draw';

export default {
  id: 'mesa-escritorio',
  name: 'Mesa de escritório',
  category: 'mesas',
  w: 140,
  d: 70,
  keywords: ['mesa', 'escritorio', 'home office'],
  colors: { main: '#d8bb92' },
  colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
  draw: ({ ctx, w, d, colors }) => {
    top(ctx, w, d, colors.main, 3);
    box(ctx, w - 40, 6, 34, d - 12, 3, null, alpha('#2c2418', 0.25), 1.2);
    circle(ctx, w - 22, 14, 2.4, alpha('#2c2418', 0.45), null);
    line(ctx, 10, 8, 10, d - 8, alpha('#2c2418', 0.12), 1);
  },
} satisfies FurnitureDef;
