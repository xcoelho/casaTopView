import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, cushion, line, shade } from '../../catalog/draw';

export default {
  id: 'cadeira-concha',
  name: 'Cadeira concha',
  category: 'assentos',
  w: 60,
  d: 58,
  keywords: ['cadeira', 'concha', 'sala', 'jantar', 'acento', 'trançada'],
  colors: { main: '#33373c', accent: '#d8bb92' },
  colorKeys: [
    { key: 'main', label: 'Concha', palette: 'paint' },
    { key: 'accent', label: 'Pés', palette: 'wood' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 2, 2, w - 4, d - 4, 15, colors.main, alpha('#14171b', 0.45), 1.6);
    box(ctx, 8, 12, w - 16, d - 22, 11, shade(colors.main, 0.12), alpha('#000000', 0.3), 1.2);
    cushion(ctx, 12, d - 26, w - 24, 14, 7, shade(colors.main, 0.18));
    for (let i = 0; i < 3; i++) {
      line(ctx, 10, 8 + i * 4, w - 10, 8 + i * 4, alpha('#ffffff', 0.14), 1.1);
    }
    for (const [x, y] of [
      [10, 10],
      [w - 10, 10],
      [10, d - 10],
      [w - 10, d - 10],
    ]) {
      circle(ctx, x, y, 3, colors.accent, alpha('#3a2c1e', 0.4), 1.1);
    }
  },
} satisfies FurnitureDef;
