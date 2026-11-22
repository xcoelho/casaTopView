import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle, cushion, line, shade } from '../../catalog/draw';

export default {
  id: 'poltrona-egg',
  name: 'Poltrona egg',
  category: 'assentos',
  w: 90,
  d: 90,
  keywords: ['poltrona', 'egg', 'giratória', 'leitura', 'design'],
  colors: { main: '#c07f63', accent: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Concha', palette: 'fabric' },
    { key: 'accent', label: 'Base', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    const r = Math.min(w, d) / 2 - 3;
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      line(ctx, cx, cy, cx + Math.cos(a) * r, cy + Math.sin(a) * r, colors.accent, 2.6);
    }
    circle(ctx, cx, cy, 4, shade(colors.accent, -0.2), null);
    circle(ctx, cx, cy, r - 8, colors.main, alpha(shade(colors.main, -0.5), 0.42), 1.6);
    circle(ctx, cx, cy - 4, r * 0.55, null, alpha(shade(colors.main, 0.3), 0.5), 1.1);
    cushion(ctx, cx - 16, cy - 2, 32, 20, 8, shade(colors.main, 0.1));
  },
} satisfies FurnitureDef;
