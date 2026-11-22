import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle, grain, shade } from '../../catalog/draw';

export default {
  id: 'mesa-tulipa',
  name: 'Mesa tulipa',
  category: 'mesas',
  w: 110,
  d: 110,
  keywords: ['mesa', 'tulipa', 'redonda', 'marmore', 'jantar'],
  colors: { main: '#eeeee9', accent: '#f4f1ea' },
  colorKeys: [
    { key: 'main', label: 'Tampo', palette: 'stone' },
    { key: 'accent', label: 'Base', palette: 'paint' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    const r = Math.min(w, d) / 2 - 2;
    circle(ctx, cx, cy, 8, shade(colors.accent, -0.15), null);
    circle(ctx, cx, cy, r, colors.main, alpha('#8d9498', 0.5), 1.6);
    circle(ctx, cx, cy, r - 5, null, alpha('#ffffff', 0.4), 1);
    grain(ctx, cx - r + 6, cy - r + 6, r * 2 - 12, r * 2 - 12, colors.main, 22);
  },
} satisfies FurnitureDef;
