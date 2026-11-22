import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line } from '../../catalog/draw';

export default {
  id: 'quadro',
  name: 'Quadro',
  category: 'decoracao',
  w: 90,
  d: 7,
  keywords: ['quadro', 'arte', 'parede', 'decoracao'],
  flat: true,
  zBias: 4,
  colors: { main: '#8a6142', accent: '#c9a86f' },
  colorKeys: [
    { key: 'main', label: 'Moldura', palette: 'wood' },
    { key: 'accent', label: 'Arte', palette: 'paint' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 1.5, colors.main, alpha('#2c2014', 0.4), 1.2);
    box(ctx, 4, 1.8, w - 8, d - 3.6, 0.8, colors.accent, alpha('#2c2014', 0.2), 1);
    line(ctx, 6, d / 2, w * 0.45, d / 2, alpha('#ffffff', 0.35), 1);
  },
} satisfies FurnitureDef;
