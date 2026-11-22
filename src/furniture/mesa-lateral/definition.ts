import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle, shade } from '../../catalog/draw';

export default {
  id: 'mesa-lateral',
  name: 'Mesa lateral',
  category: 'mesas',
  w: 45,
  d: 45,
  keywords: ['mesa', 'lateral', 'apoio'],
  colors: { main: '#8a6142' },
  colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    circle(ctx, cx, cx, Math.min(w, d) / 2 - 2, colors.main, alpha(shade(colors.main, -0.55), 0.45), 1.5);
    circle(ctx, cx, cx, 6, null, alpha('#ffffff', 0.35), 1);
  },
} satisfies FurnitureDef;
