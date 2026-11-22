import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line } from '../../catalog/draw';

export default {
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
} satisfies FurnitureDef;
