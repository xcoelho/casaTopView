import type { FurnitureDef } from '../../catalog/types';
import { paintFloorPattern } from '../shared/pisos';

export default {
  id: 'piso-amadeirado',
  name: 'Piso amadeirado',
  category: 'decoracao',
  w: 300,
  d: 300,
  keywords: ['piso', 'amadeirado', 'madeira', 'nogueira', 'taco'],
  flat: true,
  zBias: -10,
  colors: { main: '#8a5a34' },
  draw: ({ ctx, w, d, px }) => {
    paintFloorPattern(ctx, w, d, 'amadeirado', px);
  },
} satisfies FurnitureDef;
