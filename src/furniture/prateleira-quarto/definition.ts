import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line, shade } from '../../catalog/draw';

export default {
  id: 'prateleira-quarto',
  name: 'Prateleira suspensa',
  category: 'armarios',
  w: 90,
  d: 22,
  keywords: ['prateleira', 'suspensa', 'quarto', 'parede', 'livros'],
  colors: { main: '#d8bb92', accent: '#3b3f45' },
  colorKeys: [
    { key: 'main', label: 'Prateleira', palette: 'wood' },
    { key: 'accent', label: 'Suportes', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 1.6, colors.main, alpha('#3a2a1c', 0.38), 1.3);
    box(ctx, 2, 2, w - 4, d - 4, 1, null, alpha(shade(colors.accent, 0.3), 0.28), 1);
    for (const x of [10, w - 10]) {
      line(ctx, x, 2, x, d - 2, colors.accent, 2.4);
      circle(ctx, x, d / 2, 1.5, colors.accent, null);
    }
    const bookColors = ['#b46a55', '#5b7c8d', '#8f9a76', '#c2a469', '#7a6a8a'];
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = bookColors[i];
      ctx.globalAlpha = 0.75;
      ctx.fillRect(w * 0.26 + i * 4.4, d * 0.3, 3, d * 0.4);
      ctx.globalAlpha = 1;
    }
    circle(ctx, w * 0.72, d * 0.5, 3.4, alpha('#f1efe8', 0.9), alpha('#5a5346', 0.3), 1);
  },
} satisfies FurnitureDef;
