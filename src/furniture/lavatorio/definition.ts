import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line } from '../../catalog/draw';

export default {
  id: 'lavatorio',
  name: 'Lavatório com gabinete',
  category: 'banheiro',
  w: 90,
  d: 50,
  keywords: ['lavatorio', 'pia', 'banheiro', 'cuba'],
  colors: { main: '#e6e0d3', accent: '#f7f7f4', metal: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Gabinete', palette: 'paint' },
    { key: 'accent', label: 'Louça', palette: 'paint' },
    { key: 'metal', label: 'Torneira', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#5a5346', 0.35), 1.4);
    box(ctx, 3, 3, w - 6, d - 6, 3, colors.accent, alpha('#8d9498', 0.4), 1.3);
    ctx.beginPath();
    ctx.ellipse(w / 2, d / 2 + 2, w / 2 - 16, d / 2 - 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fbfbf8';
    ctx.fill();
    ctx.strokeStyle = alpha('#8d9498', 0.5);
    ctx.lineWidth = 1.4;
    ctx.stroke();
    circle(ctx, w / 2, 8, 3.6, colors.metal, alpha('#4b5056', 0.4), 1.1);
    line(ctx, w / 2, 9, w / 2, 16, colors.metal, 2.4);
  },
} satisfies FurnitureDef;
