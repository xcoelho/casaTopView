import type { FurnitureDef } from '../../catalog/types';
import { paintFloorPattern } from '../shared/pisos';

export default {
  id: 'piso-madeira',
  name: 'Piso madeira',
  category: 'decoracao',
  w: 300,
  d: 300,
  keywords: ['piso', 'madeira'],
  flat: true,
  zBias: -10,
  colors: { main: '#e9d9c0' },
  draw: ({ ctx, w, d, px }) => {
    paintFloorPattern(ctx, w, d, 'madeira', px);
  },
} satisfies FurnitureDef;
