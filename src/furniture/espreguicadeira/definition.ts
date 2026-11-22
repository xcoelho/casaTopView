import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line, shade } from '../../catalog/draw';

export default {
  id: 'espreguicadeira',
  name: 'Espreguiçadeira',
  category: 'externo',
  w: 70,
  d: 185,
  keywords: ['espreguicadeira', 'praia', 'piscina', 'varanda'],
  colors: { main: '#b08968', accent: '#e6ddcd' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'wood' },
    { key: 'accent', label: 'Estofado', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 6, colors.main, alpha('#3a2a1c', 0.4), 1.4);
    box(ctx, 5, 8, w - 10, d - 16, 5, colors.accent, alpha('#5a4a38', 0.35), 1.2);
    box(ctx, 5, 8, w - 10, 34, 5, shade(colors.accent, -0.12), alpha('#5a4a38', 0.35), 1.2);
    line(ctx, 5, 60, w - 5, 60, alpha('#5a4a38', 0.3), 1.2);
    for (let i = 0; i < 4; i++) {
      line(ctx, 10 + i * 14, d - 12, 14 + i * 14, 46, alpha('#3a2a1c', 0.12), 1);
    }
  },
} satisfies FurnitureDef;
