import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, shade } from '../../catalog/draw';

export default {
  id: 'arandela-classica',
  name: 'Arandela clássica',
  category: 'eletro',
  w: 20,
  d: 20,
  flat: true,
  zBias: 10,
  keywords: ['arandela', 'luminaria', 'parede', 'cupula', 'luz', 'abajur'],
  colors: { main: '#e9ddc6', metal: '#a8865a' },
  colorKeys: [
    { key: 'main', label: 'Cúpula', palette: 'fabric' },
    { key: 'metal', label: 'Metal', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    box(ctx, cx - 5, 0, 10, 3, 1.2, colors.metal, alpha('#3a2c1e', 0.4), 0.8);
    box(ctx, cx - 0.9, 2, 1.8, d / 2 - 1, 0.8, shade(colors.metal, -0.15), null);
    circle(ctx, cx, d / 2 + 1, 7.5, colors.main, alpha('#6b5a3c', 0.5));
    circle(ctx, cx, d / 2 + 1, 3, '#ffd98c', null);
  },
} satisfies FurnitureDef;
