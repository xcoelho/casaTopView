import type { FurnitureDef } from '../../catalog/types';
import { paintFloorPattern } from '../shared/pisos';

export default {
  id: 'piso-ceramica',
  name: 'Piso cerâmica',
  category: 'decoracao',
  w: 300,
  d: 300,
  keywords: ['piso', 'ceramica'],
  flat: true,
  zBias: -10,
  colors: { main: '#e8e5db' },
  draw: ({ ctx, w, d, px }) => {
    paintFloorPattern(ctx, w, d, 'ceramica', px);
  },
} satisfies FurnitureDef;
