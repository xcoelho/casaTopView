import type { FurnitureDef } from '../../catalog/types';
import { doorSymbol } from '../shared/aberturas';

export default {
  id: 'porta-simples',
  name: 'Porta simples',
  category: 'aberturas',
  w: 80,
  d: 15,
  kind: 'opening',
  opening: { kind: 'porta', width: 80 },
  keywords: ['porta', 'abertura'],
  draw: ({ ctx, w, d }) => doorSymbol(ctx, w, d, false, false),
} satisfies FurnitureDef;
