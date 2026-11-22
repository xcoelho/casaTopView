import type { FurnitureDef } from '../../catalog/types';
import { WALL } from '../shared/aberturas';
import { alpha, box, line } from '../../catalog/draw';

export default {
  id: 'porta-garagem',
  name: 'Porta de garagem',
  category: 'aberturas',
  w: 300,
  d: 15,
  kind: 'opening',
  opening: { kind: 'porta-garagem', width: 300 },
  keywords: ['porta', 'garagem', 'carro'],
  draw: ({ ctx, w, d }) => {
    const mid = d / 2;
    box(ctx, 0, mid - 4, w, 8, 0, alpha('#39404a', 0.12), WALL, 1.4);
    for (let i = 1; i < 5; i++) {
      line(ctx, 3, mid - 4 + (8 / 5) * i, w - 3, mid - 4 + (8 / 5) * i, alpha('#39404a', 0.4), 1);
    }
  },
} satisfies FurnitureDef;
