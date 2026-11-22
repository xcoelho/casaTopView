import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, cushion, shade } from '../../catalog/draw';

export default {
  id: 'cadeira-balanco',
  name: 'Cadeira de balanço',
  category: 'assentos',
  w: 55,
  d: 85,
  keywords: ['cadeira', 'balanco', 'vovo', 'madeira', 'descanso'],
  colors: { main: '#8a5f3c', accent: '#c9b18c' },
  colorKeys: [
    { key: 'main', label: 'Madeira', palette: 'wood' },
    { key: 'accent', label: 'Estofado', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 4, 2, 5, d - 4, 2.5, shade(colors.main, -0.2), null);
    box(ctx, w - 9, 2, 5, d - 4, 2.5, shade(colors.main, -0.2), null);
    box(ctx, 5, 3, w - 10, 9, 3, colors.main, alpha('#3a2c1e', 0.4), 1.2);
    box(ctx, 2.5, 16, 6, d - 34, 3, shade(colors.main, 0.1), null);
    box(ctx, w - 8.5, 16, 6, d - 34, 3, shade(colors.main, 0.1), null);
    box(ctx, 7, 20, w - 14, d - 34, 4, colors.main, null);
    cushion(ctx, 10, 24, w - 20, d - 42, 5, colors.accent);
    circle(ctx, 8, d - 12, 2, shade(colors.main, -0.3), null);
    circle(ctx, w - 8, d - 12, 2, shade(colors.main, -0.3), null);
  },
} satisfies FurnitureDef;
