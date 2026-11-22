import type { FurnitureDef } from '../../catalog/types';
import { windowSymbol } from '../shared/aberturas';

export default {
  id: 'janela-grande',
  name: 'Janela ampla',
  category: 'aberturas',
  w: 260,
  d: 15,
  kind: 'opening',
  opening: { kind: 'janela', width: 260 },
  keywords: ['janela', 'ampla', 'vidro', 'varanda'],
  draw: ({ ctx, w, d }) => windowSymbol(ctx, w, d, 4),
} satisfies FurnitureDef;
