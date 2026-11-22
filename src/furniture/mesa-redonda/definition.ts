import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle, shade } from '../../catalog/draw';

export default {
  id: 'mesa-redonda',
  name: 'Mesa redonda',
  category: 'mesas',
  w: 120,
  d: 120,
  keywords: ['mesa', 'redonda', 'jantar'],
  colors: { main: '#c19a6b' },
  colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    const r = Math.min(w, d) / 2 - 2;
    circle(ctx, cx, cy, r, colors.main, alpha(shade(colors.main, -0.62), 0.45), 1.7);
    circle(ctx, cx, cy, r - 4, null, alpha('#ffffff', 0.4), 1.1);
    circle(ctx, cx, cy, 7, shade(colors.main, -0.2), alpha('#2c2116', 0.25), 1);
  },
} satisfies FurnitureDef;
