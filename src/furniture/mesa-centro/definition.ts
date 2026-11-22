import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, grain, shade } from '../../catalog/draw';

export default {
  id: 'mesa-centro',
  name: 'Mesa de centro',
  category: 'mesas',
  w: 110,
  d: 60,
  keywords: ['mesa', 'centro', 'sala'],
  colors: { main: '#8a6142' },
  colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 6, 6, w - 12, d - 12, 4, colors.main, alpha(shade(colors.main, -0.55), 0.45), 1.5);
    grain(ctx, 7, 7, w - 14, d - 14, colors.main, 11);
    box(ctx, 0, 0, w, d, 6, null, alpha(shade(colors.main, -0.5), 0.55), 1.6);
  },
} satisfies FurnitureDef;
