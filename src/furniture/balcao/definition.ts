import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, grain, line } from '../../catalog/draw';

export default {
  id: 'balcao',
  name: 'Armário com balcão',
  category: 'cozinha',
  w: 120,
  d: 60,
  keywords: ['armario', 'balcao', 'cozinha', 'bancada'],
  colors: { main: '#e6e0d3', accent: '#eeeee9' },
  colorKeys: [
    { key: 'main', label: 'Armários', palette: 'paint' },
    { key: 'accent', label: 'Bancada', palette: 'stone' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#5a5346', 0.35), 1.4);
    for (let i = 1; i < 3; i++) {
      line(ctx, (w / 4) * i * 2 > w ? w / 4 : (w / 3) * i, 2, (w / 3) * i, d - 2, alpha('#5a5346', 0.2), 1.1);
    }
    box(ctx, 0, 0, w, d * 0.66, 3, colors.accent, alpha('#5a5346', 0.35), 1.4);
    grain(ctx, 2, 2, w - 4, d * 0.62, colors.accent, 22);
    for (let i = 0; i < 3; i++) {
      line(ctx, (w / 3) * i + 10, d - 12, (w / 3) * (i + 1) - 10, d - 12, '#8c9198', 2);
    }
  },
} satisfies FurnitureDef;
