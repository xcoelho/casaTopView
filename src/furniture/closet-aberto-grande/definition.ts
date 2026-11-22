import type { FurnitureDef } from '../../catalog/types';
import { drawClosetAberto } from '../shared/closet';

export default {
  id: 'closet-aberto-grande',
  name: 'Closet aberto grande',
  category: 'armarios',
  w: 240,
  d: 62,
  keywords: ['closet', 'aberto', 'roupa', 'quarto', 'sem porta', 'grande'],
  colors: { main: '#efeae1', accent: '#d8bb92' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'paint' },
    { key: 'accent', label: 'Roupas', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => drawClosetAberto(ctx, w, d, colors, 4),
} satisfies FurnitureDef;
