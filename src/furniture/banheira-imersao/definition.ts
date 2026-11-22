import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, shade } from '../../catalog/draw';

export default {
  id: 'banheira-imersao',
  name: 'Banheira de imersão',
  category: 'banheiro',
  w: 170,
  d: 78,
  keywords: ['banheira', 'banho', 'imersao', 'tub', 'hidro'],
  colors: { main: '#f2efe9', accent: '#9fd3d8', metal: '#b9bfc7' },
  colorKeys: [
    { key: 'main', label: 'Casco', palette: 'paint' },
    { key: 'accent', label: 'Água', palette: 'glass' },
    { key: 'metal', label: 'Metais', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, d / 2, colors.main, alpha('#5a5148', 0.4), 1.2);
    ctx.beginPath();
    ctx.ellipse(w / 2, d / 2, w / 2 - 10, d / 2 - 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = shade(colors.main, -0.08);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w / 2, d / 2, w / 2 - 15, d / 2 - 15, 0, 0, Math.PI * 2);
    ctx.fillStyle = alpha(colors.accent, 0.9);
    ctx.fill();
    circle(ctx, w - 30, d / 2, 2.2, alpha('#3c4046', 0.55), null);
    box(ctx, 4, d / 2 - 3.5, 9, 7, 2, colors.metal, null);
    circle(ctx, 16, d / 2, 1.7, colors.metal, null);
    circle(ctx, 8.5, d / 2 - 9, 2, colors.metal, null);
    circle(ctx, 8.5, d / 2 + 9, 2, colors.metal, null);
  },
} satisfies FurnitureDef;
