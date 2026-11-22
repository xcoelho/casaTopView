import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, cushion, shade } from '../../catalog/draw';

export default {
  id: 'sofa-modular-l',
  name: 'Sofá modular em L',
  category: 'assentos',
  w: 240,
  d: 170,
  keywords: ['sofa', 'modular', 'L', 'chaise', 'sala'],
  colors: { main: '#8f9a76' },
  colorKeys: [{ key: 'main', label: 'Estofado', palette: 'fabric' }],
  draw: ({ ctx, w, d, colors }) => {
    const dark = shade(colors.main, -0.15);
    const light = shade(colors.main, 0.1);
    const mainD = d * 0.62;
    box(ctx, 0, 0, w, mainD, 9, colors.main, alpha(shade(colors.main, -0.5), 0.42), 1.6);
    box(ctx, 3, 2, w - 6, 21, 6, dark, alpha(shade(colors.main, -0.55), 0.3), 1.2);
    const arm = 15;
    box(ctx, 2, 18, arm, mainD - 21, 5, dark, alpha(shade(colors.main, -0.55), 0.3), 1.2);
    box(ctx, w - 2 - arm, 18, arm, d - 21, 5, dark, alpha(shade(colors.main, -0.55), 0.3), 1.2);
    const x0 = arm + 4;
    const x1 = w - 60;
    const sw = (x1 - x0) / 2;
    for (let i = 0; i < 2; i++) {
      cushion(ctx, x0 + i * sw + 1.5, 24, sw - 3, mainD - 29, 5, light);
    }
    box(ctx, w - 58, 2, 56, d - 4, 8, colors.main, alpha(shade(colors.main, -0.5), 0.42), 1.6);
    cushion(ctx, w - 54, 24, 48, d - 34, 5, light);
  },
} satisfies FurnitureDef;
