import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line, shade } from '../../catalog/draw';

export default {
  id: 'tapete',
  name: 'Tapete',
  category: 'decoracao',
  w: 240,
  d: 170,
  keywords: ['tapete', 'sala', 'quarto'],
  flat: true,
  zBias: -4,
  colors: { main: '#dccdb6', accent: '#b99f80' },
  colorKeys: [
    { key: 'main', label: 'Fundo', palette: 'fabric' },
    { key: 'accent', label: 'Borda', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 4, alpha(colors.main, 0.92), alpha(shade(colors.main, -0.4), 0.55), 1.3);
    box(ctx, 8, 8, w - 16, d - 16, 2, null, alpha(colors.accent, 0.75), 1.4);
    box(ctx, 14, 14, w - 28, d - 28, 2, null, alpha(colors.accent, 0.35), 1);
    for (let i = 1; i < 6; i++) {
      line(ctx, 14, (d / 6) * i, w - 14, (d / 6) * i, alpha(colors.accent, 0.16), 1);
    }
  },
} satisfies FurnitureDef;
