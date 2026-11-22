import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line } from '../../catalog/draw';

export default {
  id: 'estante',
  name: 'Estante',
  category: 'armarios',
  w: 160,
  d: 35,
  keywords: ['estante', 'livros', 'prateleira'],
  colors: { main: '#c19a6b', accent: '#8a6142' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'wood' },
    { key: 'accent', label: 'Prateleiras', palette: 'wood' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 2, colors.main, alpha('#3a2a1c', 0.42), 1.5);
    for (let i = 1; i < 3; i++) {
      line(ctx, (w / 3) * i, 2, (w / 3) * i, d - 2, colors.accent, 2.2);
    }
    const bookColors = ['#b46a55', '#5b7c8d', '#8f9a76', '#c2a469', '#7a6a8a'];
    for (let i = 0; i < 16; i++) {
      const x = 5 + (i % 8) * ((w - 10) / 8);
      const cell = Math.floor(i / 8);
      ctx.fillStyle = bookColors[i % bookColors.length];
      ctx.globalAlpha = 0.72;
      ctx.fillRect(x, cell === 0 ? 5 : d / 2 + 3, 3.6, d / 2 - 9);
      ctx.globalAlpha = 1;
    }
    line(ctx, 2, d / 2, w - 2, d / 2, colors.accent, 1.8);
  },
} satisfies FurnitureDef;
