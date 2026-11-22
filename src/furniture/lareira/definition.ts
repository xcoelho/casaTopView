import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, hatch, line } from '../../catalog/draw';

export default {
  id: 'lareira',
  name: 'Lareira',
  category: 'decoracao',
  w: 120,
  d: 45,
  keywords: ['lareira', 'fogo', 'sala'],
  colors: { main: '#a9a9a4', accent: '#3b3f45' },
  colorKeys: [
    { key: 'main', label: 'Revestimento', palette: 'stone' },
    { key: 'accent', label: 'Boca', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 4, colors.main, alpha('#4a4f52', 0.35), 1.4);
    hatch(ctx, 2, 2, w - 4, d - 4, alpha('#4a4f52', 0.1), 9, 1);
    box(ctx, w * 0.2, 10, w * 0.6, d - 16, 3, colors.accent, alpha('#14171b', 0.5), 1.3);
    for (let i = 0; i < 3; i++) {
      line(ctx, w * 0.26 + i * 12, d - 14, w * 0.3 + i * 12, 15, alpha('#d9a13b', 0.55), 2);
    }
  },
} satisfies FurnitureDef;
