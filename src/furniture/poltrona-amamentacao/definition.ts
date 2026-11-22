import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, cushion } from '../../catalog/draw';

export default {
  id: 'poltrona-amamentacao',
  name: 'Poltrona de amamentação',
  category: 'assentos',
  w: 85,
  d: 85,
  keywords: ['poltrona', 'amamentacao', 'bebe', 'quarto', 'infantil', 'conforto'],
  colors: { main: '#ded4c1', accent: '#cbb79a' },
  colorKeys: [
    { key: 'main', label: 'Tecido', palette: 'fabric' },
    { key: 'accent', label: 'Almofadas', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d * 0.26, 10, colors.main, alpha('#5a4a38', 0.42), 1.4);
    box(ctx, 0, d * 0.18, w, d * 0.82, 8, colors.main, alpha('#5a4a38', 0.42), 1.5);
    // braços
    box(ctx, 2, d * 0.26, 12, d * 0.68, 5, colors.main, alpha('#5a4a38', 0.3), 1.2);
    box(ctx, w - 14, d * 0.26, 12, d * 0.68, 5, colors.main, alpha('#5a4a38', 0.3), 1.2);
    // assento e almofadas
    cushion(ctx, 16, d * 0.32, w - 32, d * 0.56, 6, colors.accent);
    cushion(ctx, w * 0.3, d * 0.18, w * 0.4, d * 0.26, 8, colors.accent);
  },
} satisfies FurnitureDef;
