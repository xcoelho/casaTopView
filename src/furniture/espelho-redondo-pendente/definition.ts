import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, glass, line } from '../../catalog/draw';

export default {
  id: 'espelho-redondo-pendente',
  name: 'Espelho redondo pendente',
  category: 'banheiro',
  w: 62,
  d: 8,
  keywords: ['espelho', 'redondo', 'pendente', 'banheiro', 'alca couro'],
  flat: true,
  zBias: 4,
  colors: { main: '#cfe3e8', accent: '#3b3f45' },
  colorKeys: [
    { key: 'main', label: 'Reflexo', palette: 'glass' },
    { key: 'accent', label: 'Alça', palette: 'paint' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 2, alpha(colors.main, 0.85), alpha('#6c7b80', 0.5), 1.2);
    circle(ctx, w / 2, d / 2, 2.2, colors.accent, null);
    line(ctx, w * 0.3, d - 1, w * 0.44, 1, alpha('#ffffff', 0.85), 1.3);
    line(ctx, w * 0.58, d - 1, w * 0.7, 1, alpha('#ffffff', 0.55), 1);
    box(ctx, w / 2 - 7, 1, 14, d - 2, 1, colors.accent, null);
  },
} satisfies FurnitureDef;
