import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, shade } from '../../catalog/draw';

export default {
  id: 'jardineira',
  name: 'Jardineira',
  category: 'externo',
  w: 120,
  d: 45,
  keywords: ['jardineira', 'planta', 'jardim', 'externo', 'vaso', 'gourmet'],
  colors: { main: '#a9a9a4', accent: '#6f8f5c' },
  colorKeys: [
    { key: 'main', label: 'Caixa', palette: 'stone' },
    { key: 'accent', label: 'Plantas', palette: 'plant' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#4a4f52', 0.45), 1.5);
    box(ctx, 4, 4, w - 8, d - 8, 2, alpha('#3d3128', 0.75), alpha('#2b2724', 0.3), 1.1);
    const count = 6;
    for (let i = 0; i < count; i++) {
      const x = 14 + i * ((w - 28) / (count - 1));
      circle(
        ctx,
        x,
        d / 2,
        10 - (i % 3),
        alpha(colors.accent, 0.85),
        alpha(shade(colors.accent, -0.4), 0.4),
        1.1,
      );
    }
  },
} satisfies FurnitureDef;
