import type { FurnitureDef } from '../../catalog/types';
import { top, legs } from '../shared/mesas';
import { alpha, line } from '../../catalog/draw';

export default {
  id: 'mesa-jantar-6',
  name: 'Mesa de jantar 6',
  category: 'mesas',
  w: 200,
  d: 100,
  keywords: ['mesa', 'jantar', 'refeicao'],
  colors: { main: '#c19a6b' },
  colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
  draw: ({ ctx, w, d, colors }) => {
    legs(ctx, w, d, colors.main, 4);
    top(ctx, w, d, colors.main);
    line(ctx, 12, d / 2, w - 12, d / 2, alpha('#ffffff', 0.18), 1);
  },
} satisfies FurnitureDef;
