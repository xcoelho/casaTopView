import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line, shade } from '../../catalog/draw';

export default {
  id: 'cadeira-escritorio',
  name: 'Cadeira de escritório',
  category: 'assentos',
  w: 64,
  d: 64,
  keywords: ['cadeira', 'escritorio', 'giratória'],
  colors: { main: '#5d6169', accent: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Estofado', palette: 'fabric' },
    { key: 'accent', label: 'Base', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2 + 2;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      line(
        ctx,
        cx,
        cy,
        cx + Math.cos(a) * (w / 2 - 5),
        cy + Math.sin(a) * (d / 2 - 5),
        colors.accent,
        3.2,
      );
    }
    circle(ctx, cx, cy, 4.5, shade(colors.accent, -0.2), null);
    box(ctx, cx - 17, cy - 16, 34, 26, 7, colors.main, alpha('#1d2024', 0.4), 1.4);
    box(ctx, cx - 19, 2, 38, 12, 6, shade(colors.main, -0.1), alpha('#1d2024', 0.4), 1.4);
  },
} satisfies FurnitureDef;
