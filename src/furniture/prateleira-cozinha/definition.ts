import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, grain } from '../../catalog/draw';

export default {
  id: 'prateleira-cozinha',
  name: 'Prateleira de cozinha',
  category: 'cozinha',
  w: 100,
  d: 26,
  keywords: ['prateleira', 'cozinha', 'parede', 'potes', 'temperos'],
  colors: { main: '#c19a6b', accent: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Prateleira', palette: 'wood' },
    { key: 'accent', label: 'Suportes e tampas', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 1.6, colors.main, alpha('#3a2a1c', 0.4), 1.4);
    grain(ctx, 1.5, 1.5, w - 3, d - 3, colors.main, 18, true);
    for (const x of [9, w - 9]) {
      box(ctx, x - 2, 2, 4, d - 4, 1, alpha(colors.accent, 0.55), alpha('#5f666d', 0.35), 1);
    }
    const jarColors = ['#f1efe8', '#dcd2c1', '#c07f63'];
    for (let i = 0; i < 3; i++) {
      const cx = w * (0.32 + i * 0.16);
      circle(ctx, cx, d * 0.5, 4.4, jarColors[i], alpha('#5a5346', 0.3), 1.1);
      circle(ctx, cx, d * 0.5, 2.4, alpha('#ffffff', 0.3), null);
    }
    box(ctx, w * 0.2, 6, 7, d - 12, 1, alpha('#d8bb92', 0.85), alpha('#3a2a1c', 0.3), 1);
  },
} satisfies FurnitureDef;
