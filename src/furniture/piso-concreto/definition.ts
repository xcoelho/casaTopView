import type { FurnitureDef } from '../../catalog/types';
import { paintFloorPattern } from '../shared/pisos';

export default {
  id: 'piso-concreto',
  name: 'Piso concreto',
  category: 'decoracao',
  w: 300,
  d: 300,
  keywords: ['piso', 'concreto'],
  flat: true,
  zBias: -10,
  colors: { main: '#dedbd2' },
  draw: ({ ctx, w, d, px }) => {
    paintFloorPattern(ctx, w, d, 'concreto', px);
  },
} satisfies FurnitureDef;
