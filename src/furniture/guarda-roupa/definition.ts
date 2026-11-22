import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, grain, line } from '../../catalog/draw';

export default {
  id: 'guarda-roupa',
  name: 'Guarda-roupa',
  category: 'armarios',
  w: 200,
  d: 62,
  keywords: ['guarda', 'roupa', 'armario', 'quarto'],
  colors: { main: '#d8bb92', accent: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Madeira', palette: 'wood' },
    { key: 'accent', label: 'Puxadores', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#3a2a1c', 0.42), 1.6);
    grain(ctx, 1, 1, w - 2, d - 2, colors.main, 14, true);
    const doors = 4;
    const dw = w / doors;
    for (let i = 1; i < doors; i++) {
      line(ctx, dw * i, 2, dw * i, d - 2, alpha('#3a2a1c', 0.32), 1.3);
    }
    for (let i = 0; i < doors; i++) {
      const x = dw * i + dw / 2;
      const handleX = i % 2 === 0 ? x + dw / 2 - 6 : x - dw / 2 + 6;
      line(ctx, handleX, d * 0.32, handleX, d * 0.68, colors.accent, 2.4);
    }
    box(ctx, 3, 3, w - 6, d - 6, 2, null, alpha('#ffffff', 0.28), 1);
  },
} satisfies FurnitureDef;
