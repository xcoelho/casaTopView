import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, glass } from '../../catalog/draw';

export default {
  id: 'banheira',
  name: 'Banheira',
  category: 'banheiro',
  w: 170,
  d: 78,
  keywords: ['banheira', 'banho', 'banheiro'],
  colors: { main: '#f7f7f4', accent: '#cdd6d8' },
  colorKeys: [
    { key: 'main', label: 'Louça', palette: 'paint' },
    { key: 'accent', label: 'Água', palette: 'glass' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 16, colors.main, alpha('#8d9498', 0.55), 1.7);
    box(ctx, 7, 7, w - 14, d - 14, 13, alpha(colors.accent, 0.55), alpha('#8d9498', 0.4), 1.3);
    circle(ctx, w - 22, d / 2, 3.2, alpha('#8d9498', 0.7), null);
    circle(ctx, 22, d / 2, 4, colors.accent, alpha('#4b5056', 0.35), 1.1);
  },
} satisfies FurnitureDef;
