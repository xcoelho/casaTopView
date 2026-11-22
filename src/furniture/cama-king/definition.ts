import type { FurnitureDef } from '../../catalog/types';
import { bed } from '../shared/camas';

export default {
  id: 'cama-king',
  name: 'Cama king',
  category: 'camas',
  w: 195,
  d: 210,
  keywords: ['cama', 'king', 'quarto'],
  colors: { main: '#8a6142', accent: '#efe8db' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'wood' },
    { key: 'accent', label: 'Roupa de cama', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => bed(ctx, w, d, colors.main, colors.accent, 3),
} satisfies FurnitureDef;
