import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line } from '../../catalog/draw';

export default {
  id: 'lavatorio-suspenso-redondo',
  name: 'Lavatório suspenso redondo',
  category: 'banheiro',
  w: 90,
  d: 52,
  keywords: ['lavatorio', 'pia', 'suspenso', 'redondo', 'espelho', 'gabinete'],
  colors: { main: '#3b3f45', accent: '#f7f7f4', metal: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Gabinete', palette: 'paint' },
    { key: 'accent', label: 'Louça', palette: 'paint' },
    { key: 'metal', label: 'Torneira', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#14171b', 0.45), 1.5);
    line(ctx, 4, d * 0.55, w - 4, d * 0.55, alpha('#ffffff', 0.18), 1.2);
    box(ctx, w / 2 - 24, 8, 48, 26, 10, colors.accent, alpha('#8d9498', 0.5), 1.5);
    ctx.beginPath();
    ctx.ellipse(w / 2, 21, 18, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fbfbf8';
    ctx.fill();
    ctx.strokeStyle = alpha('#8d9498', 0.4);
    ctx.lineWidth = 1.2;
    ctx.stroke();
    circle(ctx, w / 2, 5, 3, colors.metal, alpha('#4b5056', 0.4), 1);
    box(ctx, w / 2 - 14, d - 8, 28, 3, 1.2, alpha(colors.metal, 0.7), null);
  },
} satisfies FurnitureDef;
