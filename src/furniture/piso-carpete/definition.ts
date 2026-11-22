import type { FurnitureDef } from '../../catalog/types';
import { paintFloorPattern } from '../shared/pisos';

export default {
  id: 'piso-carpete',
  name: 'Piso carpete',
  category: 'decoracao',
  w: 300,
  d: 300,
  keywords: ['piso', 'carpete'],
  flat: true,
  zBias: -10,
  colors: { main: '#dcd6c7' },
  draw: ({ ctx, w, d, px }) => {
    paintFloorPattern(ctx, w, d, 'carpete', px);
  },
} satisfies FurnitureDef;
