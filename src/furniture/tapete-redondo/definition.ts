import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle, shade } from '../../catalog/draw';

export default {
  id: 'tapete-redondo',
  name: 'Tapete redondo',
  category: 'decoracao',
  w: 200,
  d: 200,
  keywords: ['tapete', 'redondo', 'sala', 'quarto'],
  flat: true,
  zBias: -4,
  colors: { main: '#dccdb6', accent: '#b99f80' },
  colorKeys: [
    { key: 'main', label: 'Fundo', palette: 'fabric' },
    { key: 'accent', label: 'Borda', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    const r = Math.min(w, d) / 2 - 1;
    circle(ctx, cx, cy, r, alpha(colors.main, 0.92), alpha(shade(colors.main, -0.4), 0.55), 1.3);
    circle(ctx, cx, cy, r - 8, null, alpha(colors.accent, 0.75), 1.4);
    circle(ctx, cx, cy, r - 14, null, alpha(colors.accent, 0.35), 1);
    for (const rr2 of [r * 0.66, r * 0.44]) {
      circle(ctx, cx, cy, rr2, null, alpha(colors.accent, 0.16), 1);
    }
  },
} satisfies FurnitureDef;
