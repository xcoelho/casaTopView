import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, knob, line, shade } from '../../catalog/draw';

export default {
  id: 'tanque',
  name: 'Tanque de lavar roupa',
  category: 'lavanderia',
  w: 60,
  d: 55,
  keywords: ['tanque', 'lavanderia', 'lavar', 'roupa', 'cuba', 'servico'],
  colors: { main: '#e6e0d3', accent: '#f7f7f4', metal: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Gabinete', palette: 'paint' },
    { key: 'accent', label: 'Louça', palette: 'paint' },
    { key: 'metal', label: 'Torneira', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#5a5346', 0.4), 1.5);
    box(ctx, 4, 4, w - 8, d - 8, 3, colors.accent, alpha('#8d9498', 0.45), 1.3);
    box(
      ctx,
      9,
      9,
      w - 18,
      d - 22,
      2.5,
      alpha(shade(colors.accent, -0.06), 0.92),
      alpha('#8d9498', 0.55),
      1.2,
    );
    circle(ctx, w / 2, 5, 3.4, colors.metal, alpha('#4b5056', 0.4), 1.1);
    line(ctx, w / 2, 8, w / 2, 14, colors.metal, 2.2);
    knob(ctx, w - 10, d - 8, colors.metal, 2);
  },
} satisfies FurnitureDef;
