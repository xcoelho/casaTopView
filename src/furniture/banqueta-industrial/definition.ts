import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle } from '../../catalog/draw';

export default {
  id: 'banqueta-industrial',
  name: 'Banqueta industrial',
  category: 'assentos',
  w: 45,
  d: 45,
  keywords: ['banqueta', 'industrial', 'metal', 'ilha', 'bar'],
  colors: { main: '#5d6169', accent: '#3b3f45' },
  colorKeys: [
    { key: 'main', label: 'Assento', palette: 'metal' },
    { key: 'accent', label: 'Estrutura', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    const r = Math.min(w, d) / 2 - 3;
    circle(ctx, cx, cy, r + 2.5, null, colors.accent, 1.6);
    circle(ctx, cx, cy, r, colors.main, alpha('#1d2024', 0.4), 1.4);
    circle(ctx, cx, cy, r * 0.5, null, alpha('#ffffff', 0.25), 1.1);
    for (const [x, y] of [
      [7, 7],
      [w - 7, 7],
      [7, d - 7],
      [w - 7, d - 7],
    ]) {
      circle(ctx, x, y, 2.2, colors.accent, null);
    }
  },
} satisfies FurnitureDef;
