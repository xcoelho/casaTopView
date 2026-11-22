import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, cushion, shade } from '../../catalog/draw';

export default {
  id: 'sofa-chaise',
  name: 'Sofá com chaise',
  category: 'assentos',
  w: 250,
  d: 165,
  keywords: ['sofa', 'chaise', 'retratil'],
  colors: { main: '#8f9a76' },
  colorKeys: [{ key: 'main', label: 'Estofado', palette: 'fabric' }],
  draw: ({ ctx, w, d, colors }) => {
    const f = colors.main;
    const dark = shade(f, -0.15);
    const light = shade(f, 0.1);
    const sofaD = 88;
    const chaiseW = 104;
    box(ctx, 0, 0, w, sofaD, 9, f, null);
    box(ctx, w - chaiseW, sofaD - 4, chaiseW, d - sofaD + 4, 9, f, null);
    box(ctx, 0, 0, w, d, 9, null, alpha(shade(f, -0.5), 0.42), 1.6);
    box(ctx, 3, 2, w - 6, 21, 6, dark, null);
    box(ctx, 2, 18, 15, sofaD - 21, 5, dark, null);
    box(ctx, w - chaiseW + 4, sofaD + 2, 13, d - sofaD - 8, 5, dark, null);
    const x0 = 20;
    const x1 = w - chaiseW;
    const sw = (x1 - x0) / 2;
    cushion(ctx, x0 + 1.5, 24, sw - 3, sofaD - 29, 5, light);
    cushion(ctx, x0 + sw + 1.5, 24, sw - 3, sofaD - 29, 5, light);
    cushion(ctx, w - chaiseW + 6, sofaD + 4, chaiseW - 24, d - sofaD - 12, 5, light);
  },
} satisfies FurnitureDef;
