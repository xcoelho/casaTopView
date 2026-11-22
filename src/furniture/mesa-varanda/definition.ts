import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line, shade } from '../../catalog/draw';

export default {
  id: 'mesa-varanda',
  name: 'Mesa de varanda',
  category: 'externo',
  w: 150,
  d: 80,
  keywords: ['mesa', 'varanda', 'jardim', 'externa'],
  colors: { main: '#b08968' },
  colorKeys: [{ key: 'main', label: 'Madeira', palette: 'wood' }],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 4, colors.main, alpha('#3a2a1c', 0.4), 1.5);
    for (let i = 1; i < 12; i++) {
      line(ctx, (w / 12) * i, 3, (w / 12) * i, d - 3, alpha('#3a2a1c', 0.18), 1.2);
    }
    box(ctx, 6, d * 0.3, 0.6, d * 0.4, 0, null, alpha('#3a2a1c', 0.1), 1);
    circle(ctx, 12, d - 8, 3, shade(colors.main, -0.25), null);
  },
} satisfies FurnitureDef;
