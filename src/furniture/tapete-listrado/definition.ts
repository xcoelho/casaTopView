import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line, shade } from '../../catalog/draw';

export default {
  id: 'tapete-listrado',
  name: 'Tapete listrado',
  category: 'decoracao',
  w: 240,
  d: 170,
  keywords: ['tapete', 'listrado', 'sala', 'quarto'],
  flat: true,
  zBias: -4,
  colors: { main: '#e6ddcd', accent: '#8f9a76' },
  colorKeys: [
    { key: 'main', label: 'Fundo', palette: 'fabric' },
    { key: 'accent', label: 'Listras', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 4, alpha(colors.main, 0.92), alpha(shade(colors.main, -0.4), 0.55), 1.3);
    for (let i = 0; i < 7; i++) {
      const y = 14 + i * ((d - 28) / 6);
      line(ctx, 0, y, w, y, alpha(colors.accent, i % 2 ? 0.55 : 0.28), i % 2 ? 5 : 2.5);
    }
    box(ctx, 8, 8, w - 16, d - 16, 2, null, alpha(colors.accent, 0.5), 1.2);
  },
} satisfies FurnitureDef;
