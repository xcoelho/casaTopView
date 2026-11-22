import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line } from '../../catalog/draw';

export default {
  id: 'secadora',
  name: 'Secadora',
  category: 'eletro',
  w: 62,
  d: 64,
  keywords: ['secadora', 'roupa', 'lavanderia'],
  colors: { main: '#e6e0d3', accent: '#3b3f45' },
  colorKeys: [
    { key: 'main', label: 'Corpo', palette: 'paint' },
    { key: 'accent', label: 'Painel', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 4, colors.main, alpha('#8d9498', 0.5), 1.4);
    box(ctx, 2, d - 14, w - 4, 11, 2, colors.accent, null);
    circle(ctx, 12, d - 8.5, 2.2, alpha('#ffffff', 0.6), null);
    circle(ctx, 22, d - 8.5, 2.2, alpha('#ffffff', 0.4), null);
    circle(ctx, w / 2, d * 0.42, Math.min(w, d) * 0.27, alpha('#fdfcf7', 0.8), colors.accent, 1.5);
    line(ctx, w / 2 - 10, d * 0.42, w / 2 + 10, d * 0.42, alpha('#8d9498', 0.4), 1.1);
  },
} satisfies FurnitureDef;
