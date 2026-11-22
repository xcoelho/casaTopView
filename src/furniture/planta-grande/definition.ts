import type { FurnitureDef } from '../../catalog/types';
import { leaves } from '../shared/decoracao';
import { alpha, circle, shade } from '../../catalog/draw';

export default {
  id: 'planta-grande',
  name: 'Planta grande',
  category: 'decoracao',
  w: 85,
  d: 85,
  keywords: ['planta', 'vaso', 'grande', 'decoracao'],
  colors: { main: '#8a6142', accent: '#4d6b45' },
  colorKeys: [
    { key: 'main', label: 'Vaso', palette: 'stone' },
    { key: 'accent', label: 'Folhas', palette: 'plant' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    circle(ctx, cx, cy, Math.min(w, d) * 0.3, colors.main, alpha('#4a3a30', 0.4), 1.5);
    circle(ctx, cx, cy, Math.min(w, d) * 0.22, alpha(shade(colors.main, -0.25), 0.6), null);
    leaves(ctx, cx, cy, 9, Math.min(w, d) / 2 - 2, colors.accent);
  },
} satisfies FurnitureDef;
