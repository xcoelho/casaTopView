import type { FurnitureDef } from '../../catalog/types';
import { drawClosetAberto } from '../shared/closet';

export default {
  id: 'closet-aberto-pequeno',
  name: 'Closet aberto pequeno',
  category: 'armarios',
  w: 120,
  d: 60,
  keywords: ['closet', 'aberto', 'roupa', 'quarto', 'sem porta', 'pequeno'],
  colors: { main: '#e6e0d3', accent: '#d8bb92' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'paint' },
    { key: 'accent', label: 'Roupas', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => drawClosetAberto(ctx, w, d, colors, 2),
} satisfies FurnitureDef;
