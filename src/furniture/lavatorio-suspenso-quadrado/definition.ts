import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line, shade } from '../../catalog/draw';

export default {
  id: 'lavatorio-suspenso-quadrado',
  name: 'Lavatório suspenso quadrado',
  category: 'banheiro',
  w: 90,
  d: 50,
  keywords: ['lavatorio', 'pia', 'suspenso', 'quadrado', 'cuba preta', 'prateleira'],
  colors: { main: '#eeeee9', accent: '#33373c', metal: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Bancada', palette: 'stone' },
    { key: 'accent', label: 'Cuba', palette: 'paint' },
    { key: 'metal', label: 'Torneira', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 4, colors.main, alpha('#5a5346', 0.35), 1.5);
    box(ctx, 4, 4, w - 8, d - 8, 3, null, alpha('#ffffff', 0.35), 1);
    box(ctx, w / 2 - 20, 10, 40, 24, 3, colors.accent, alpha('#14171b', 0.45), 1.4);
    box(ctx, w / 2 - 16, 14, 32, 16, 2, shade(colors.accent, 0.15), null);
    circle(ctx, w / 2, 6, 3.2, colors.metal, alpha('#4b5056', 0.4), 1.1);
    line(ctx, w / 2, 7, w / 2, 12, colors.metal, 2.2);
    box(ctx, 10, d - 12, w - 20, 6, 2, alpha(shade(colors.main, -0.12), 0.7), null);
    box(ctx, w - 26, d - 9, 12, 3, 1.4, alpha(colors.accent, 0.5), null);
  },
} satisfies FurnitureDef;
