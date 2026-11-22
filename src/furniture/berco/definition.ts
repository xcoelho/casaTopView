import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line } from '../../catalog/draw';

export default {
  id: 'berco',
  name: 'Berço',
  category: 'camas',
  w: 75,
  d: 135,
  keywords: ['berco', 'bebe', 'quarto'],
  colors: { main: '#e6e0d3', accent: '#f6f1e4' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'paint' },
    { key: 'accent', label: 'Colchão', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 5, colors.main, alpha('#5a5346', 0.35), 1.5);
    box(ctx, 6, 6, w - 12, d - 12, 4, colors.accent, alpha('#8a7a63', 0.4), 1.2);
    for (let i = 0; i < Math.floor((d - 12) / 9); i++) {
      line(ctx, 3, 8 + i * 9, 8, 8 + i * 9, alpha('#5a5346', 0.35), 1.1);
      line(ctx, w - 8, 8 + i * 9, w - 3, 8 + i * 9, alpha('#5a5346', 0.35), 1.1);
    }
    line(ctx, 8, 12, w - 8, 12, alpha('#5a5346', 0.25), 1.2);
  },
} satisfies FurnitureDef;
