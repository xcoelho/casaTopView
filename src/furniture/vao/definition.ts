import type { FurnitureDef } from '../../catalog/types';
import { alpha, line } from '../../catalog/draw';

export default {
  id: 'vao',
  name: 'Vão livre',
  category: 'aberturas',
  w: 200,
  d: 15,
  kind: 'opening',
  opening: { kind: 'vao', width: 200 },
  keywords: ['vao', 'passagem', 'arco', 'abertura'],
  draw: ({ ctx, w, d }) => {
    const mid = d / 2;
    line(ctx, 0, mid - 3, w, mid - 3, alpha('#39404a', 0.35), 1.2);
    line(ctx, 0, mid + 3, w, mid + 3, alpha('#39404a', 0.35), 1.2);
    line(ctx, 2, mid, w - 2, mid, alpha('#39404a', 0.18), 1);
  },
} satisfies FurnitureDef;
