import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line } from '../../catalog/draw';

export default {
  id: 'quadro-branco',
  name: 'Quadro branco',
  category: 'decoracao',
  w: 120,
  d: 6,
  keywords: ['quadro', 'branco', 'lousa', 'escritorio', 'reuniao', 'parede'],
  flat: true,
  zBias: 4,
  colors: { main: '#c9ccce' },
  colorKeys: [{ key: 'main', label: 'Moldura', palette: 'metal' }],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 1.5, colors.main, alpha('#2c2f33', 0.5), 1.2);
    box(ctx, 3, 1.2, w - 6, d - 2.4, 1, '#fbfcfd', alpha('#8d9498', 0.45), 1);
    line(ctx, w * 0.2, d - 1, w * 0.8, d - 1, alpha('#6c7077', 0.8), 2);
    const pens = ['#c07f63', '#43626b', '#3b3f45'];
    for (let i = 0; i < pens.length; i++) {
      line(ctx, w * 0.36 + i * 10, d - 2.4, w * 0.36 + i * 10 + 6, d - 2.4, pens[i], 2);
    }
  },
} satisfies FurnitureDef;
