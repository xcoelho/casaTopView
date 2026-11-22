import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle, line } from '../../catalog/draw';

export default {
  id: 'mesa-lateral-tambor',
  name: 'Mesa lateral tambor',
  category: 'mesas',
  w: 50,
  d: 50,
  keywords: ['mesa', 'lateral', 'tambor', 'apoio', 'redonda'],
  colors: { main: '#3b3f45', accent: '#eeeee9' },
  colorKeys: [
    { key: 'main', label: 'Corpo', palette: 'metal' },
    { key: 'accent', label: 'Tampo', palette: 'stone' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    const r = Math.min(w, d) / 2 - 2;
    circle(ctx, cx, cy, r, colors.main, alpha('#14171b', 0.45), 1.5);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      line(ctx, cx, cy, cx + Math.cos(a) * r, cy + Math.sin(a) * r, alpha('#ffffff', 0.1), 1);
    }
    circle(ctx, cx, cy, r - 4, colors.accent, alpha('#8d9498', 0.4), 1.2);
  },
} satisfies FurnitureDef;
