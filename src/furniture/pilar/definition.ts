import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, hatch } from '../../catalog/draw';

export default {
  id: 'pilar',
  name: 'Pilar',
  category: 'estrutura',
  w: 30,
  d: 30,
  keywords: ['pilar', 'coluna', 'estrutura'],
  colors: { main: '#6f767e' },
  colorKeys: [{ key: 'main', label: 'Concreto', palette: 'stone' }],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 1.5, colors.main, alpha('#2a2f36', 0.5), 1.6);
    hatch(ctx, 1, 1, w - 2, d - 2, alpha('#ffffff', 0.22), 6, 1.4);
  },
} satisfies FurnitureDef;
