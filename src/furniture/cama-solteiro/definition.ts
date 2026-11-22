import type { FurnitureDef } from '../../catalog/types';
import { bed } from '../shared/camas';

export default {
  id: 'cama-solteiro',
  name: 'Cama de solteiro',
  category: 'camas',
  w: 95,
  d: 195,
  keywords: ['cama', 'solteiro', 'quarto'],
  colors: { main: '#c19a6b', accent: '#e6ddcd' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'wood' },
    { key: 'accent', label: 'Roupa de cama', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => bed(ctx, w, d, colors.main, colors.accent, 1),
} satisfies FurnitureDef;
