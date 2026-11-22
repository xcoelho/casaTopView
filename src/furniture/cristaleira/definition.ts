import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line, shade } from '../../catalog/draw';

export default {
  id: 'cristaleira',
  name: 'Cristaleira',
  category: 'armarios',
  w: 120,
  d: 45,
  keywords: ['cristaleira', 'louças', 'vidro', 'sala', 'jantar'],
  colors: { main: '#8a6142', accent: '#cfe3e8' },
  colorKeys: [
    { key: 'main', label: 'Madeira', palette: 'wood' },
    { key: 'accent', label: 'Vidro', palette: 'glass' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#3a2a1c', 0.42), 1.6);
    box(ctx, 4, 4, w - 8, d - 8, 2, alpha(colors.accent, 0.55), alpha(shade(colors.accent, -0.5), 0.4), 1.2);
    line(ctx, w / 2, 4, w / 2, d - 4, colors.main, 2.4);
    for (const x of [w * 0.28, w * 0.72]) {
      circle(ctx, x, d * 0.35, 4.5, alpha('#f1efe8', 0.9), alpha('#5a5346', 0.3), 1);
    }
    circle(ctx, w * 0.5, d * 0.7, 3, alpha('#dfeef2', 0.8), alpha('#5a5346', 0.3), 1);
    line(ctx, 4, d / 2, w - 4, d / 2, alpha(colors.main, 0.4), 1);
  },
} satisfies FurnitureDef;
