import type { FurnitureDef } from '../../catalog/types';
import { bed } from '../shared/camas';

export default {
  id: 'cama-casal',
  name: 'Cama de casal',
  category: 'camas',
  w: 145,
  d: 200,
  keywords: ['cama', 'casal', 'quarto'],
  colors: { main: '#c19a6b', accent: '#dfd6c5' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'wood' },
    { key: 'accent', label: 'Roupa de cama', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => bed(ctx, w, d, colors.main, colors.accent, 2),
} satisfies FurnitureDef;
