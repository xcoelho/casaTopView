import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle } from '../../catalog/draw';

export default {
  id: 'arandela-led-tubular',
  name: 'Arandela LED tubular',
  category: 'eletro',
  w: 12,
  d: 10,
  flat: true,
  zBias: 10,
  keywords: ['arandela', 'led', 'luminaria', 'parede', 'tubo', 'moderna'],
  colors: { main: '#3c4046', accent: '#ffe9c4' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'metal' },
    { key: 'accent', label: 'Luz', palette: 'paint' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    box(ctx, 1, 0, w - 2, 2.5, 1, colors.main, alpha('#14161a', 0.5), 0.8);
    box(ctx, cx - 1, 2, 2, d - 5.5, 0.8, colors.main, null);
    circle(ctx, cx, d - 3.5, 3.4, alpha(colors.accent, 0.3), null);
    circle(ctx, cx, d - 3.5, 2.4, colors.accent, alpha('#8a6f3c', 0.6));
  },
} satisfies FurnitureDef;
