import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line, shade } from '../../catalog/draw';

export default {
  id: 'carrinho-bar',
  name: 'Carrinho de bar',
  category: 'externo',
  w: 80,
  d: 45,
  keywords: ['carrinho', 'bar', 'bebidas', 'garrafas', 'gourmet', 'dourado'],
  colors: { main: '#c2a469', accent: '#3f5d43' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'metal' },
    { key: 'accent', label: 'Garrafas', palette: 'plant' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 2, 2, w - 4, d - 4, 3, null, colors.main, 1.6);
    line(ctx, 4, d * 0.32, w - 4, d * 0.32, colors.main, 1.6);
    line(ctx, 4, d * 0.66, w - 4, d * 0.66, colors.main, 1.6);
    for (let i = 0; i < 3; i++) {
      const x = 14 + i * 12;
      circle(ctx, x, d * 0.22, 4, colors.accent, alpha(shade(colors.accent, -0.4), 0.4), 1.1);
      circle(ctx, w - 16 - i * 10, d * 0.8, 3.4, alpha('#dfeef2', 0.8), alpha('#5a5346', 0.3), 1);
    }
    for (const [x, y] of [
      [7, 7],
      [w - 7, 7],
      [7, d - 7],
      [w - 7, d - 7],
    ]) {
      circle(ctx, x, y, 2.6, colors.main, alpha('#14171b', 0.4), 1);
    }
  },
} satisfies FurnitureDef;
