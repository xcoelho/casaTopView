import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line } from '../../catalog/draw';

export default {
  id: 'coifa',
  name: 'Coifa',
  category: 'cozinha',
  w: 90,
  d: 52,
  keywords: ['coifa', 'exaustor', 'cozinha'],
  zBias: 5,
  flat: true,
  colors: { main: '#c9ccd0' },
  colorKeys: [{ key: 'main', label: 'Acabamento', palette: 'metal' }],
  draw: ({ ctx, w, d, colors }) => {
    ctx.save();
    ctx.setLineDash([6, 5]);
    box(ctx, 2, 2, w - 4, d - 4, 4, alpha(colors.main, 0.16), alpha('#5f666d', 0.65), 1.6);
    ctx.restore();
    box(ctx, w * 0.22, d * 0.14, w * 0.56, d * 0.72, 3, alpha('#ffffff', 0.32), alpha('#5f666d', 0.4), 1.2);
    line(ctx, w * 0.22, d * 0.36, w * 0.78, d * 0.36, alpha('#5f666d', 0.35), 1);
    line(ctx, w * 0.22, d * 0.62, w * 0.78, d * 0.62, alpha('#5f666d', 0.35), 1);
  },
} satisfies FurnitureDef;
