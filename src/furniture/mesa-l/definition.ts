import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, grain, shade } from '../../catalog/draw';

export default {
  id: 'mesa-l',
  name: 'Mesa em L',
  category: 'mesas',
  w: 170,
  d: 150,
  keywords: ['mesa', 'escritorio', 'home office', 'L'],
  colors: { main: '#d8bb92', accent: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Tampo', palette: 'wood' },
    { key: 'accent', label: 'Pés', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const t = 62;
    box(ctx, 0, 0, w, t, 4, colors.main, alpha('#2c2418', 0.35), 1.6);
    box(ctx, 0, t - 1, t + 10, d - t + 1, 4, colors.main, alpha('#2c2418', 0.35), 1.6);
    grain(ctx, 2, 2, w - 4, t - 4, colors.main, 12);
    grain(ctx, 2, t + 2, t + 6, d - t - 4, colors.main, 12, true);
    circle(ctx, w - 26, t / 2, 3.2, alpha('#2c2418', 0.4), null);
    circle(ctx, 30, d - 22, 3.2, alpha('#2c2418', 0.4), null);
    for (const [x, y] of [
      [6, d - 6],
      [w - 6, 6],
    ]) {
      circle(ctx, x, y, 3.4, shade(colors.accent, -0.15), null);
    }
  },
} satisfies FurnitureDef;
