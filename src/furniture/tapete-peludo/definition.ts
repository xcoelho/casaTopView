import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, hatch, shade } from '../../catalog/draw';

export default {
  id: 'tapete-peludo',
  name: 'Tapete peludo',
  category: 'decoracao',
  w: 180,
  d: 130,
  keywords: ['tapete', 'peludo', 'quarto', 'sala'],
  flat: true,
  zBias: -4,
  colors: { main: '#f0e8da', accent: '#cbb79a' },
  colorKeys: [
    { key: 'main', label: 'Fundo', palette: 'fabric' },
    { key: 'accent', label: 'Detalhe', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 6, alpha(colors.main, 0.95), alpha(shade(colors.main, -0.35), 0.5), 1.3);
    hatch(ctx, 2, 2, w - 4, d - 4, alpha(colors.accent, 0.35), 5, 1);
    box(ctx, 10, 10, w - 20, d - 20, 4, null, alpha(colors.accent, 0.6), 1.2);
    circle(ctx, w / 2, d / 2, Math.min(w, d) * 0.2, null, alpha(colors.accent, 0.4), 1);
  },
} satisfies FurnitureDef;
