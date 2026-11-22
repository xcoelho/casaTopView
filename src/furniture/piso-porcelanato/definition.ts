import type { FurnitureDef } from '../../catalog/types';
import { paintFloorPattern } from '../shared/pisos';

export default {
  id: 'piso-porcelanato',
  name: 'Piso porcelanato',
  category: 'decoracao',
  w: 300,
  d: 300,
  keywords: ['piso', 'porcelanato'],
  flat: true,
  zBias: -10,
  colors: { main: '#efece4' },
  draw: ({ ctx, w, d, px }) => {
    paintFloorPattern(ctx, w, d, 'porcelanato', px);
  },
} satisfies FurnitureDef;
