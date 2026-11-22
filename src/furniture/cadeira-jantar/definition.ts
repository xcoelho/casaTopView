import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, cushion, shade } from '../../catalog/draw';

export default {
  id: 'cadeira-jantar',
  name: 'Cadeira de jantar',
  category: 'assentos',
  w: 48,
  d: 52,
  keywords: ['cadeira', 'jantar', 'mesa'],
  colors: { main: '#c19a6b', accent: '#ded4c1' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'wood' },
    { key: 'accent', label: 'Assento', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 4, 1, w - 8, 11, 4, colors.main, alpha('#3a2c1e', 0.4), 1.3);
    box(ctx, 3, 6, 6, d - 10, 3, colors.main, null);
    box(ctx, w - 9, 6, 6, d - 10, 3, colors.main, null);
    cushion(ctx, 6, 13, w - 12, d - 20, 5, colors.accent);
    circle(ctx, 7, d - 4, 2, shade(colors.main, -0.25), null);
    circle(ctx, w - 7, d - 4, 2, shade(colors.main, -0.25), null);
  },
} satisfies FurnitureDef;
