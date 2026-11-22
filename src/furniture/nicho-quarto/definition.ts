import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line, shade } from '../../catalog/draw';

export default {
  id: 'nicho-quarto',
  name: 'Nicho de quarto',
  category: 'armarios',
  w: 110,
  d: 30,
  keywords: ['nicho', 'prateleira', 'quarto', 'estante', 'parede'],
  colors: { main: '#e6e0d3', accent: '#c19a6b' },
  colorKeys: [
    { key: 'main', label: 'Acabamento', palette: 'paint' },
    { key: 'accent', label: 'Prateleiras', palette: 'wood' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 2.5, colors.main, alpha('#5a5346', 0.4), 1.5);
    box(ctx, 3, 3, w - 6, d - 7, 1, alpha(shade(colors.main, -0.12), 0.55), null);
    for (let i = 1; i < 3; i++) {
      line(ctx, (w / 3) * i, 3, (w / 3) * i, d - 4, alpha('#5a5346', 0.3), 1.5);
    }
    line(ctx, 3, d - 4.5, w - 3, d - 4.5, colors.accent, 1.8);
    const bookColors = ['#b46a55', '#5b7c8d', '#8f9a76', '#c2a469'];
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = bookColors[i];
      ctx.globalAlpha = 0.75;
      ctx.fillRect(9 + i * 4.6, d * 0.32, 3.2, d * 0.34);
      ctx.globalAlpha = 1;
    }
    box(ctx, w / 2 - 8, d * 0.3, 16, d * 0.4, 1.5, alpha(colors.accent, 0.45), alpha('#5a5346', 0.25), 1);
    circle(ctx, w - 18, d * 0.5, 4.2, alpha('#f1efe8', 0.9), alpha('#5a5346', 0.3), 1);
  },
} satisfies FurnitureDef;
