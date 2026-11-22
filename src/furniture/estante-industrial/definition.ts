import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line } from '../../catalog/draw';

export default {
  id: 'estante-industrial',
  name: 'Estante industrial',
  category: 'armarios',
  w: 100,
  d: 40,
  keywords: ['estante', 'industrial', 'metal', 'livros', 'prateleira'],
  colors: { main: '#c19a6b', accent: '#3b3f45' },
  colorKeys: [
    { key: 'main', label: 'Prateleiras', palette: 'wood' },
    { key: 'accent', label: 'Estrutura', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 2, colors.main, alpha('#3a2a1c', 0.42), 1.5);
    for (let i = 1; i < 4; i++) {
      line(ctx, 2, (d / 4) * i, w - 2, (d / 4) * i, colors.accent, 2);
    }
    for (const x of [3, w - 3]) {
      line(ctx, x, 2, x, d - 2, colors.accent, 2.6);
    }
    line(ctx, 3, 2, w - 3, d - 2, alpha(colors.accent, 0.5), 1.2);
    line(ctx, w - 3, 2, 3, d - 2, alpha(colors.accent, 0.5), 1.2);
    const bookColors = ['#b46a55', '#5b7c8d', '#8f9a76', '#c2a469'];
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = bookColors[i];
      ctx.globalAlpha = 0.72;
      ctx.fillRect(8 + i * 5, 4, 3.6, d / 4 - 6);
      ctx.globalAlpha = 1;
    }
  },
} satisfies FurnitureDef;
