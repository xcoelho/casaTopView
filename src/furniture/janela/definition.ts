import type { FurnitureDef } from '../../catalog/types';
import { windowSymbol } from '../shared/aberturas';

export default {
  id: 'janela',
  name: 'Janela',
  category: 'aberturas',
  w: 120,
  d: 15,
  kind: 'opening',
  opening: { kind: 'janela', width: 120 },
  keywords: ['janela', 'vidro', 'abertura'],
  draw: ({ ctx, w, d }) => windowSymbol(ctx, w, d, 2),
} satisfies FurnitureDef;
