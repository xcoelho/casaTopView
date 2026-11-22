import type { FurnitureDef } from '../../catalog/types';
import { paintFloorPattern } from '../shared/pisos';

export default {
  id: 'piso-grama',
  name: 'Piso grama',
  category: 'decoracao',
  w: 300,
  d: 300,
  keywords: ['piso', 'grama'],
  flat: true,
  zBias: -10,
  colors: { main: '#ccd8b6' },
  draw: ({ ctx, w, d, px }) => {
    paintFloorPattern(ctx, w, d, 'grama', px);
  },
} satisfies FurnitureDef;
