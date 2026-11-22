import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line, metalBar } from '../../catalog/draw';

export default {
  id: 'varal',
  name: 'Varal de parede',
  category: 'lavanderia',
  w: 140,
  d: 45,
  keywords: ['varal', 'secar', 'roupa', 'lavanderia', 'estender'],
  colors: { main: '#d8dce0', accent: '#cbb79a' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'metal' },
    { key: 'accent', label: 'Roupas', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    metalBar(ctx, 2, 4, 3, d - 8, colors.main, 1.2);
    metalBar(ctx, w - 5, 4, 3, d - 8, colors.main, 1.2);
    for (let i = 0; i < 3; i++) {
      const y = 8 + i * ((d - 16) / 2);
      line(ctx, 2, y, w - 2, y, alpha(colors.main, 0.9), 2.2);
    }
    const pieces = 4;
    for (let i = 0; i < pieces; i++) {
      const x = 12 + i * ((w - 24) / (pieces - 1));
      box(ctx, x - 8, 12, 16, d - 24, 2, alpha(colors.accent, 0.75), alpha('#5a4a38', 0.3), 1.1);
      line(ctx, x, 7, x, 12, alpha('#6c7077', 0.7), 1.2);
    }
  },
} satisfies FurnitureDef;
