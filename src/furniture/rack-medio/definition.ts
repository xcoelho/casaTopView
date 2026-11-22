import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, grain, line, shade } from '../../catalog/draw';

export default {
  id: 'rack-medio',
  name: 'Rack médio retrô',
  category: 'armarios',
  w: 140,
  d: 44,
  keywords: ['rack', 'medio', 'retro', 'tv', 'sala', 'pes-palito'],
  colors: { main: '#b9834f', accent: '#3b3f45' },
  colorKeys: [
    { key: 'main', label: 'Madeira', palette: 'wood' },
    { key: 'accent', label: 'Detalhe', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 2, w, d - 4, 3, colors.main, alpha('#2c2014', 0.42), 1.5);
    grain(ctx, 2, 4, w - 4, d - 8, colors.main, 11);
    const mid = w / 2;
    line(ctx, mid - 22, 4, mid - 22, d - 4, alpha('#2c2014', 0.35), 1.4);
    line(ctx, mid + 22, 4, mid + 22, d - 4, alpha('#2c2014', 0.35), 1.4);
    box(ctx, mid - 18, 8, 36, d - 18, 2, null, alpha('#2c2014', 0.3), 1.2);
    box(ctx, 10, 7, w * 0.22, d - 16, 2, alpha('#ffffff', 0.14), null);
    box(ctx, w - 10 - w * 0.22, 7, w * 0.22, d - 16, 2, alpha('#ffffff', 0.14), null);
    for (const [x, y] of [
      [10, 6],
      [w - 10, 6],
      [10, d - 6],
      [w - 10, d - 6],
    ]) {
      circle(ctx, x, y, 2.6, shade(colors.main, -0.3), alpha('#241c14', 0.35), 1);
    }
  },
} satisfies FurnitureDef;
