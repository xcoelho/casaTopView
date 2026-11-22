import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, grain } from '../../catalog/draw';

export default {
  id: 'banco-jardim',
  name: 'Banco de jardim',
  category: 'externo',
  w: 150,
  d: 50,
  keywords: ['banco', 'jardim', 'externo'],
  colors: { main: '#b08968', accent: '#3b3f45' },
  colorKeys: [
    { key: 'main', label: 'Madeira', palette: 'wood' },
    { key: 'accent', label: 'Ferragens', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d * 0.34, 3, colors.main, alpha('#3a2a1c', 0.4), 1.3);
    box(ctx, 0, d * 0.4, w, d * 0.6, 3, colors.main, alpha('#3a2a1c', 0.4), 1.3);
    grain(ctx, 2, d * 0.42, w - 4, d * 0.56, colors.main, 8);
    for (const x of [8, w - 12]) {
      box(ctx, x, d * 0.32, 4, d * 0.14, 1, colors.accent, null);
    }
  },
} satisfies FurnitureDef;
