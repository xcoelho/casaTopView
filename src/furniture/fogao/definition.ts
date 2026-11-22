import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line } from '../../catalog/draw';

export default {
  id: 'fogao',
  name: 'Fogão / cooktop',
  category: 'cozinha',
  w: 62,
  d: 60,
  keywords: ['fogao', 'cooktop', 'cozinha'],
  colors: { main: '#3b3f45', accent: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Tampo', palette: 'metal' },
    { key: 'accent', label: 'Grelhas', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 4, colors.main, alpha('#1b1e22', 0.45), 1.6);
    const positions = [
      [w * 0.3, d * 0.3],
      [w * 0.7, d * 0.3],
      [w * 0.3, d * 0.72],
      [w * 0.7, d * 0.72],
    ];
    for (const [x, y] of positions) {
      circle(ctx, x, y, 8.5, alpha('#14171b', 0.55), alpha('#000000', 0.35), 1.2);
      circle(ctx, x, y, 4.2, alpha('#6d737a', 0.5), colors.accent, 1.2);
    }
    line(ctx, 4, d - 8, w - 4, d - 8, alpha('#c9ccd0', 0.35), 1.4);
  },
} satisfies FurnitureDef;
