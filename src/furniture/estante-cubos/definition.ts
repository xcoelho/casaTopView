import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line, shade } from '../../catalog/draw';

export default {
  id: 'estante-cubos',
  name: 'Estante de cubos',
  category: 'armarios',
  w: 120,
  d: 34,
  keywords: ['estante', 'cubos', 'escritorio', 'livros', 'prateleira'],
  colors: { main: '#e6e0d3', accent: '#c19a6b' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'paint' },
    { key: 'accent', label: 'Nichos', palette: 'wood' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 2, colors.main, alpha('#3a2a1c', 0.42), 1.6);
    box(ctx, 3, 3, w - 6, d - 6, 1, alpha(shade(colors.main, -0.08), 0.5), null);
    const cols = 3;
    for (let i = 1; i < cols; i++) {
      line(ctx, (w / cols) * i, 2, (w / cols) * i, d - 2, alpha('#3a2a1c', 0.34), 1.5);
    }
    line(ctx, 2, d / 2, w - 2, d / 2, alpha('#3a2a1c', 0.34), 1.5);
    const bookColors = ['#b46a55', '#5b7c8d', '#8f9a76', '#c2a469'];
    let k = 0;
    for (let i = 0; i < cols; i++) {
      if (i === 1) continue;
      for (let j = 0; j < 3; j++) {
        ctx.fillStyle = bookColors[k % bookColors.length];
        ctx.globalAlpha = 0.7;
        ctx.fillRect((w / cols) * i + 9 + j * 4.2, 6, 2.8, d / 2 - 9);
        ctx.globalAlpha = 1;
        k++;
      }
    }
    box(ctx, w / 3 + 8, d / 2 + 5, w / 3 - 16, d / 2 - 10, 1.4, alpha(colors.accent, 0.35), null);
  },
} satisfies FurnitureDef;
