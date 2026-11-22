import type { FurnitureDef } from '../../catalog/types';
import { leaves } from '../shared/decoracao';
import { alpha, circle, shade } from '../../catalog/draw';

export default {
  id: 'planta-vaso',
  name: 'Planta em vaso',
  category: 'decoracao',
  w: 46,
  d: 46,
  keywords: ['planta', 'vaso', 'decoracao'],
  colors: { main: '#c07f63', accent: '#6f8f5c' },
  colorKeys: [
    { key: 'main', label: 'Vaso', palette: 'stone' },
    { key: 'accent', label: 'Folhas', palette: 'plant' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    circle(ctx, cx, cy, Math.min(w, d) / 2 - 1, colors.main, alpha('#4a3a30', 0.4), 1.4);
    circle(ctx, cx, cy, Math.min(w, d) / 2 - 6, alpha(shade(colors.main, -0.3), 0.5), null);
    leaves(ctx, cx, cy, 7, Math.min(w, d) / 2 - 2, colors.accent);
  },
} satisfies FurnitureDef;
