import type { FurnitureDef } from '../../catalog/types';
import { drawClosetAberto } from '../shared/closet';

export default {
  id: 'closet-aberto-medio',
  name: 'Closet aberto médio',
  category: 'armarios',
  w: 180,
  d: 60,
  keywords: ['closet', 'aberto', 'roupa', 'quarto', 'sem porta', 'medio'],
  colors: { main: '#e6e0d3', accent: '#d8bb92' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'paint' },
    { key: 'accent', label: 'Roupas', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => drawClosetAberto(ctx, w, d, colors, 3),
} satisfies FurnitureDef;
