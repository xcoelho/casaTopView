import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle, line, shade } from '../../catalog/draw';

export default {
  id: 'puff',
  name: 'Puff',
  category: 'assentos',
  w: 62,
  d: 62,
  keywords: ['puff', 'banco'],
  colors: { main: '#c07f63' },
  colorKeys: [{ key: 'main', label: 'Tecido', palette: 'fabric' }],
  draw: ({ ctx, w, d, colors }) => {
    const f = colors.main;
    const cx = w / 2;
    const cy = d / 2;
    const r = Math.min(w, d) / 2 - 3;
    circle(ctx, cx, cy, r, f, alpha(shade(f, -0.5), 0.42), 1.6);
    circle(ctx, cx, cy, r * 0.62, null, alpha(shade(f, 0.4), 0.55), 1.2);
    line(ctx, cx - r * 0.6, cy, cx + r * 0.6, cy, alpha(shade(f, -0.4), 0.35), 1.1);
    line(ctx, cx, cy - r * 0.6, cx, cy + r * 0.6, alpha(shade(f, -0.4), 0.35), 1.1);
  },
} satisfies FurnitureDef;
