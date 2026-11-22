import type { FurnitureDef } from '../../catalog/types';
import { paintFloorPattern } from '../shared/pisos';

export default {
  id: 'piso-granito',
  name: 'Piso granito',
  category: 'decoracao',
  w: 300,
  d: 300,
  keywords: ['piso', 'granito', 'pedra', 'polido'],
  flat: true,
  zBias: -10,
  colors: { main: '#3c4046' },
  draw: ({ ctx, w, d, px }) => {
    paintFloorPattern(ctx, w, d, 'granito', px);
  },
} satisfies FurnitureDef;
