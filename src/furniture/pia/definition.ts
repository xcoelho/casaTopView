import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, grain, line } from '../../catalog/draw';

export default {
  id: 'pia',
  name: 'Bancada com pia',
  category: 'cozinha',
  w: 120,
  d: 60,
  keywords: ['pia', 'cuba', 'cozinha', 'bancada'],
  colors: { main: '#e6e0d3', accent: '#eeeee9', metal: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Armários', palette: 'paint' },
    { key: 'accent', label: 'Bancada', palette: 'stone' },
    { key: 'metal', label: 'Torneira', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#5a5346', 0.35), 1.4);
    box(ctx, 0, 0, w, d * 0.72, 3, colors.accent, alpha('#5a5346', 0.35), 1.4);
    grain(ctx, 2, 2, w - 4, d * 0.68, colors.accent, 22);
    // cuba
    box(ctx, w / 2 - 26, 8, 52, d - 26, 6, '#f7f7f4', alpha('#8d9498', 0.55), 1.6);
    box(ctx, w / 2 - 22, 12, 44, d - 34, 5, null, alpha('#8d9498', 0.3), 1);
    circle(ctx, w / 2, 14, 2.4, '#9aa1a6', null);
    // torneira
    circle(ctx, w / 2, 4, 4, colors.metal, alpha('#4b5056', 0.4), 1.2);
    line(ctx, w / 2, 5, w / 2, 12, colors.metal, 2.6);
    for (let i = 0; i < 2; i++) {
      line(ctx, 10 + i * 10, d - 14, 20 + i * 10, d - 14, '#8c9198', 2);
    }
  },
} satisfies FurnitureDef;
