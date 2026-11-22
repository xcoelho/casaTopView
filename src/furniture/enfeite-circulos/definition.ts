import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line } from '../../catalog/draw';

export default {
  id: 'enfeite-circulos',
  name: 'Enfeite círculos preto',
  category: 'decoracao',
  w: 110,
  d: 10,
  keywords: ['enfeite', 'parede', 'circulos', 'moderno', 'preto', 'abstrato'],
  flat: true,
  zBias: 4,
  colors: { main: '#33373c' },
  colorKeys: [{ key: 'main', label: 'Metal', palette: 'metal' }],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 2, alpha('#000000', 0.04), null);
    line(ctx, w * 0.32, 1, w * 0.32, d - 1, colors.main, 1.6);
    line(ctx, w * 0.68, 1, w * 0.68, d - 1, colors.main, 1.6);
    circle(ctx, w * 0.32, d / 2, 3.6, null, colors.main, 1.6);
    circle(ctx, w * 0.68, d / 2, 4.4, null, colors.main, 1.8);
    circle(ctx, w * 0.32, 2, 1.2, colors.main, null);
    circle(ctx, w * 0.68, d - 2, 1.2, colors.main, null);
  },
} satisfies FurnitureDef;
