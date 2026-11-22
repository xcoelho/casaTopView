import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line, metalBar, shade } from '../../catalog/draw';

export default {
  id: 'geladeira-retro',
  name: 'Geladeira retrô',
  category: 'cozinha',
  w: 70,
  d: 70,
  keywords: ['geladeira', 'retro', 'colorida', 'cozinha'],
  colors: { main: '#c07f63', accent: '#d9dde1' },
  colorKeys: [
    { key: 'main', label: 'Corpo', palette: 'paint' },
    { key: 'accent', label: 'Detalhes', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 9, colors.main, alpha(shade(colors.main, -0.5), 0.45), 1.6);
    line(ctx, 5, d * 0.32, w - 5, d * 0.32, alpha('#ffffff', 0.35), 1.4);
    metalBar(ctx, w - 12, 6, 3.4, d * 0.56, colors.accent, 1.6);
    circle(ctx, w / 2 - 6, d * 0.2, 2.4, colors.accent, null);
  },
} satisfies FurnitureDef;
