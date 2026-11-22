import type { FurnitureDef } from '../../catalog/types';
import { doorSymbol } from '../shared/aberturas';

export default {
  id: 'porta-correr',
  name: 'Porta de correr',
  category: 'aberturas',
  w: 160,
  d: 15,
  kind: 'opening',
  opening: { kind: 'porta-correr', width: 160 },
  keywords: ['porta', 'correr', 'deslizante'],
  draw: ({ ctx, w, d }) => doorSymbol(ctx, w, d, false, true),
} satisfies FurnitureDef;
