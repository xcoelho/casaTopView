import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line, metalBar } from '../../catalog/draw';

export default {
  id: 'arara-roupas',
  name: 'Arara de roupas',
  category: 'armarios',
  w: 120,
  d: 55,
  keywords: ['arara', 'cabide', 'roupa', 'closet', 'pendurar'],
  colors: { main: '#3b3f45', accent: '#cbb79a' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'metal' },
    { key: 'accent', label: 'Roupas', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    metalBar(ctx, 3, 3, 3, d - 6, colors.main, 1.2);
    metalBar(ctx, w - 6, 3, 3, d - 6, colors.main, 1.2);
    line(ctx, 4.5, d * 0.36, w - 4.5, d * 0.36, alpha(colors.main, 0.95), 2.4);
    const count = 5;
    for (let i = 0; i < count; i++) {
      const x = 14 + i * ((w - 28) / (count - 1));
      line(ctx, x, d * 0.36, x, d * 0.44, alpha('#6c7077', 0.75), 1.3);
      box(ctx, x - 9, d * 0.44, 18, d * 0.5, 2, alpha(colors.accent, 0.72), alpha('#5a4a38', 0.3), 1.1);
    }
  },
} satisfies FurnitureDef;
