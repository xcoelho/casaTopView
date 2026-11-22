import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, shade } from '../../catalog/draw';

export default {
  id: 'microondas',
  name: 'Micro-ondas',
  category: 'eletro',
  w: 50,
  d: 38,
  keywords: ['microondas', 'micro-ondas', 'forno', 'eletro', 'cozinha'],
  colors: { main: '#4a5058', accent: '#23262b', metal: '#c3c8cf' },
  colorKeys: [
    { key: 'main', label: 'Gabinete', palette: 'paint' },
    { key: 'accent', label: 'Porta', palette: 'paint' },
    { key: 'metal', label: 'Alça', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 2.5, colors.main, alpha('#14161a', 0.5), 1.2);
    for (let i = 0; i < 6; i++) {
      box(ctx, 8 + i * 6, 6, 3.4, 12, 1.6, shade(colors.main, -0.18), null);
    }
    box(ctx, 2, d - 7, w * 0.66, 5, 1.5, colors.accent, null);
    box(ctx, w * 0.7, d - 7, w * 0.28 - 2, 5, 1.5, shade(colors.accent, 0.12), null);
    box(ctx, w * 0.6, d - 8.5, 3, 7, 1.4, colors.metal, null);
    box(ctx, w * 0.73, d - 6, w * 0.16, 2.6, 1, '#79d989', null);
  },
} satisfies FurnitureDef;
