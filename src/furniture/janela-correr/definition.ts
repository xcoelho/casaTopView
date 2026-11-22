import type { FurnitureDef } from '../../catalog/types';
import { windowSymbol } from '../shared/aberturas';

export default {
  id: 'janela-correr',
  name: 'Janela de correr',
  category: 'aberturas',
  w: 200,
  d: 15,
  kind: 'opening',
  opening: { kind: 'janela-correr', width: 200 },
  keywords: ['janela', 'correr', 'vidro'],
  draw: ({ ctx, w, d }) => windowSymbol(ctx, w, d, 3),
} satisfies FurnitureDef;
