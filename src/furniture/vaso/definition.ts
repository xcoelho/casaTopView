import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle } from '../../catalog/draw';

export default {
  id: 'vaso',
  name: 'Vaso sanitário',
  category: 'banheiro',
  w: 40,
  d: 66,
  keywords: ['vaso', 'sanitario', 'banheiro', 'wc'],
  colors: { main: '#f7f7f4' },
  colorKeys: [{ key: 'main', label: 'Louça', palette: 'paint' }],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 4, 2, w - 8, 16, 3, colors.main, alpha('#8d9498', 0.55), 1.4);
    ctx.beginPath();
    ctx.ellipse(w / 2, d * 0.62, w / 2 - 4, d * 0.32, 0, 0, Math.PI * 2);
    ctx.fillStyle = colors.main;
    ctx.fill();
    ctx.strokeStyle = alpha('#8d9498', 0.6);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(w / 2, d * 0.62, w / 2 - 10, d * 0.22, 0, 0, Math.PI * 2);
    ctx.strokeStyle = alpha('#8d9498', 0.35);
    ctx.lineWidth = 1.2;
    ctx.stroke();
    circle(ctx, w / 2, 10, 2.2, alpha('#8d9498', 0.6), null);
  },
} satisfies FurnitureDef;
