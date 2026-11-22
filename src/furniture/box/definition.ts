import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, glass, line } from '../../catalog/draw';

export default {
  id: 'box',
  name: 'Box de chuveiro',
  category: 'banheiro',
  w: 90,
  d: 90,
  keywords: ['box', 'chuveiro', 'banheiro', 'ducha'],
  colors: { main: '#eef1f1', accent: '#cfe3e8' },
  colorKeys: [
    { key: 'main', label: 'Piso', palette: 'paint' },
    { key: 'accent', label: 'Vidro', palette: 'glass' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 2, alpha(colors.main, 0.85), alpha('#8d9498', 0.4), 1.4);
    for (let i = 1; i < 6; i++) {
      line(ctx, (w / 6) * i, 3, (w / 6) * i, d - 3, alpha('#8d9498', 0.16), 1);
    }
    circle(ctx, w / 2, d / 2, 5, alpha('#8d9498', 0.4), alpha('#8d9498', 0.5), 1.2);
    glass(ctx, 1.5, 1.5, w - 3, 3, colors.accent);
    glass(ctx, 1.5, 1.5, 3, d - 3, colors.accent);
  },
} satisfies FurnitureDef;
