import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line, shade } from '../../catalog/draw';

export default {
  id: 'cadeira-executiva',
  name: 'Cadeira executiva',
  category: 'assentos',
  w: 70,
  d: 78,
  keywords: ['cadeira', 'executiva', 'escritorio', 'presidente', 'apoio-pes', 'giratoria'],
  colors: { main: '#2b2e33', accent: '#d9dde1' },
  colorKeys: [
    { key: 'main', label: 'Couro', palette: 'fabric' },
    { key: 'accent', label: 'Base', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2 - 4;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      line(
        ctx,
        cx,
        cy,
        cx + Math.cos(a) * (w / 2 - 5),
        cy + Math.sin(a) * (d / 2 - 8),
        colors.accent,
        3.2,
      );
    }
    circle(ctx, cx, cy, 4.5, shade(colors.accent, -0.2), null);
    box(ctx, cx - 18, cy - 14, 36, 30, 8, colors.main, alpha('#14171b', 0.45), 1.5);
    box(ctx, cx - 20, 2, 40, 13, 7, shade(colors.main, 0.08), alpha('#14171b', 0.45), 1.5);
    box(ctx, cx - 16, d - 16, 32, 10, 4, shade(colors.main, -0.08), alpha('#14171b', 0.4), 1.3);
    line(ctx, cx - 16, d - 16, cx + 16, d - 16, colors.accent, 2);
  },
} satisfies FurnitureDef;
