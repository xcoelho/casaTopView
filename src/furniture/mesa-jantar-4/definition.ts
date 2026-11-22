import type { FurnitureDef } from '../../catalog/types';
import { top, legs } from '../shared/mesas';

export default {
  id: 'mesa-jantar-4',
  name: 'Mesa de jantar 4',
  category: 'mesas',
  w: 140,
  d: 85,
  keywords: ['mesa', 'jantar', 'refeicao'],
  colors: { main: '#c19a6b' },
  colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
  draw: ({ ctx, w, d, colors }) => {
    legs(ctx, w, d, colors.main);
    top(ctx, w, d, colors.main);
  },
} satisfies FurnitureDef;
