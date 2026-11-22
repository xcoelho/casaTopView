import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, shade } from '../../catalog/draw';

export default {
  id: 'piscina',
  name: 'Piscina',
  category: 'externo',
  w: 500,
  d: 250,
  keywords: ['piscina', 'agua', 'externo', 'jardim'],
  flat: true,
  zBias: -3,
  colors: { main: '#8fc8d4', accent: '#eeeee9' },
  colorKeys: [
    { key: 'main', label: 'Água', palette: 'glass' },
    { key: 'accent', label: 'Borda', palette: 'stone' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 10, colors.accent, alpha('#6f7a7d', 0.4), 1.6);
    box(ctx, 14, 14, w - 28, d - 28, 6, alpha(colors.main, 0.9), alpha(shade(colors.main, -0.4), 0.6), 1.4);
    for (let i = 1; i < 7; i++) {
      ctx.beginPath();
      ctx.strokeStyle = alpha('#ffffff', 0.35);
      ctx.lineWidth = 1.4;
      for (let x = 20; x < w - 20; x += 6) {
        const y = 20 + (d - 40) * (i / 7) + Math.sin(x / 26 + i) * 4;
        if (x === 20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    box(ctx, w - 60, 20, 26, 34, 3, alpha('#ffffff', 0.5), alpha('#6f7a7d', 0.4), 1.1);
  },
} satisfies FurnitureDef;
