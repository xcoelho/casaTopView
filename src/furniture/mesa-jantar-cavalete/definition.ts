import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, grain, line, shade } from '../../catalog/draw';

export default {
  id: 'mesa-jantar-cavalete',
  name: 'Mesa de jantar cavalete',
  category: 'mesas',
  w: 200,
  d: 100,
  keywords: ['mesa', 'jantar', 'cavalete', 'rustica', 'madeira'],
  colors: { main: '#8a6142' },
  colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 4, colors.main, alpha(shade(colors.main, -0.5), 0.45), 1.6);
    grain(ctx, 2, 2, w - 4, d - 4, colors.main, 13);
    for (let i = 1; i < 4; i++) {
      line(ctx, 4, (d / 4) * i, w - 4, (d / 4) * i, alpha('#ffffff', 0.14), 1.2);
    }
    for (const x of [w * 0.2, w * 0.8]) {
      box(ctx, x - 6, 6, 12, d - 12, 2, shade(colors.main, -0.25), alpha('#241c14', 0.3), 1.2);
    }
  },
} satisfies FurnitureDef;
