import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle } from '../../catalog/draw';

export default {
  id: 'banqueta',
  name: 'Banqueta',
  category: 'assentos',
  w: 38,
  d: 38,
  keywords: ['banqueta', 'banco', 'ilha'],
  colors: { main: '#b08968', accent: '#3b3f45' },
  colorKeys: [
    { key: 'main', label: 'Assento', palette: 'wood' },
    { key: 'accent', label: 'Pés', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    const r = Math.min(w, d) / 2 - 3;
    circle(ctx, cx, cy, r + 2.5, null, colors.accent, 1.6);
    circle(ctx, cx, cy, r, colors.main, alpha('#3a2c1e', 0.4), 1.4);
    circle(ctx, cx, cy, r * 0.38, null, alpha('#3a2c1e', 0.22), 1.1);
  },
} satisfies FurnitureDef;
