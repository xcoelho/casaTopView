import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, glass, line } from '../../catalog/draw';

export default {
  id: 'espelho-quadrado-led',
  name: 'Espelho quadrado com LED',
  category: 'banheiro',
  w: 80,
  d: 7,
  keywords: ['espelho', 'quadrado', 'led', 'banheiro', 'iluminado'],
  flat: true,
  zBias: 4,
  colors: { main: '#cfe3e8', accent: '#fff3cf' },
  colorKeys: [
    { key: 'main', label: 'Reflexo', palette: 'glass' },
    { key: 'accent', label: 'LED', palette: 'paint' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 2, colors.accent, alpha('#c2a469', 0.6), 1.6);
    box(ctx, 2.5, 1.5, w - 5, d - 3, 1.4, alpha(colors.main, 0.9), alpha('#6c7b80', 0.5), 1.2);
    line(ctx, w * 0.3, d - 1.4, w * 0.45, 1.6, alpha('#ffffff', 0.9), 1.4);
    line(ctx, w * 0.6, d - 1.4, w * 0.72, 1.6, alpha('#ffffff', 0.6), 1.1);
  },
} satisfies FurnitureDef;
