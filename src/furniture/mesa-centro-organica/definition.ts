import type { FurnitureDef } from '../../catalog/types';
import { alpha, line, shade } from '../../catalog/draw';

export default {
  id: 'mesa-centro-organica',
  name: 'Mesa de centro orgânica',
  category: 'mesas',
  w: 120,
  d: 70,
  keywords: ['mesa', 'centro', 'organica', 'vidro', 'sala'],
  colors: { main: '#cfe3e8', accent: '#8a6142' },
  colorKeys: [
    { key: 'main', label: 'Tampo', palette: 'glass' },
    { key: 'accent', label: 'Base', palette: 'wood' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(w / 2, d / 2, w / 2 - 2, d / 2 - 2, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = alpha(colors.main, 0.8);
    ctx.fill();
    ctx.strokeStyle = alpha(shade(colors.main, -0.55), 0.55);
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.restore();
    line(ctx, w * 0.35, d * 0.3, w * 0.6, d * 0.75, colors.accent, 4);
    line(ctx, w * 0.6, d * 0.3, w * 0.4, d * 0.75, shade(colors.accent, -0.15), 4);
  },
} satisfies FurnitureDef;
