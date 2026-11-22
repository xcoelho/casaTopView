import type { FurnitureDef } from '../../catalog/types';
import { doorSymbol } from '../shared/aberturas';

export default {
  id: 'porta-dupla',
  name: 'Porta dupla',
  category: 'aberturas',
  w: 150,
  d: 15,
  kind: 'opening',
  opening: { kind: 'porta-dupla', width: 150 },
  keywords: ['porta', 'dupla', 'abertura'],
  draw: ({ ctx, w, d }) => doorSymbol(ctx, w, d, true, false),
} satisfies FurnitureDef;
