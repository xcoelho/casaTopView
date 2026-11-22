import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line } from '../../catalog/draw';

export default {
  id: 'lava-loucas',
  name: 'Lava-louças',
  category: 'cozinha',
  w: 60,
  d: 60,
  keywords: ['lava', 'loucas', 'maquina', 'cozinha'],
  colors: { main: '#d9dde1', accent: '#3b3f45' },
  colorKeys: [
    { key: 'main', label: 'Frente', palette: 'metal' },
    { key: 'accent', label: 'Painel', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 4, colors.main, alpha('#5f666d', 0.45), 1.5);
    box(ctx, 3, d - 16, w - 6, 12, 2, colors.accent, null);
    for (let i = 0; i < 3; i++) {
      circle(ctx, 10 + i * 7, d - 10, 2, alpha('#ffffff', 0.55), null);
    }
    line(ctx, 8, 10, w - 8, 10, alpha('#ffffff', 0.4), 1.4);
    line(ctx, 8, 14, w - 8, 14, alpha('#5f666d', 0.25), 1);
  },
} satisfies FurnitureDef;
