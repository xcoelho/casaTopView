import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line } from '../../catalog/draw';

export default {
  id: 'churrasqueira',
  name: 'Churrasqueira',
  category: 'externo',
  w: 120,
  d: 62,
  keywords: ['churrasqueira', 'churrasco', 'varanda', 'externa'],
  colors: { main: '#a9a9a4', accent: '#3b3f45' },
  colorKeys: [
    { key: 'main', label: 'Alvenaria', palette: 'stone' },
    { key: 'accent', label: 'Grelha', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 4, colors.main, alpha('#4a4f52', 0.35), 1.4);
    box(ctx, 8, 8, w * 0.62, d - 16, 3, colors.accent, alpha('#14171b', 0.4), 1.3);
    for (let i = 1; i < 8; i++) {
      line(ctx, (w * 0.62 / 8) * i + 8, 10, (w * 0.62 / 8) * i + 8, d - 10, alpha('#d9dde1', 0.35), 1.4);
    }
    box(ctx, w * 0.74, 14, w * 0.2, d - 28, 2, alpha('#ffffff', 0.3), alpha('#4a4f52', 0.3), 1.1);
    circle(ctx, w * 0.84, d / 2, 3, alpha('#8d9498', 0.6), null);
  },
} satisfies FurnitureDef;
