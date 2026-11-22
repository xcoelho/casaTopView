import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line, shade } from '../../catalog/draw';

export default {
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
} satisfies FurnitureDef;
