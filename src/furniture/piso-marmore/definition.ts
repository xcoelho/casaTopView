import type { FurnitureDef } from '../../catalog/types';
import { paintFloorPattern } from '../shared/pisos';

export default {
  id: 'piso-marmore',
  name: 'Piso mármore',
  category: 'decoracao',
  w: 300,
  d: 300,
  keywords: ['piso', 'marmore', 'pedra', 'veio', 'travertino'],
  flat: true,
  zBias: -10,
  colors: { main: '#e0cfae' },
  draw: ({ ctx, w, d, px }) => {
    paintFloorPattern(ctx, w, d, 'marmore', px);
  },
} satisfies FurnitureDef;
