import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle } from '../../catalog/draw';

export default {
  id: 'pendente',
  name: 'Pendente',
  category: 'decoracao',
  w: 42,
  d: 42,
  keywords: ['pendente', 'luminaria', 'teto', 'luz'],
  flat: true,
  zBias: 6,
  colors: { main: '#c2a469' },
  colorKeys: [{ key: 'main', label: 'Acabamento', palette: 'metal' }],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    ctx.save();
    ctx.setLineDash([4, 4]);
    circle(ctx, cx, cx, Math.min(w, d) / 2 - 2, alpha(colors.main, 0.18), alpha(colors.main, 0.7), 1.4);
    ctx.restore();
    circle(ctx, cx, cx, Math.min(w, d) / 2 - 8, alpha('#fff3cf', 0.85), alpha(colors.main, 0.6), 1.2);
    circle(ctx, cx, cx, 2.4, colors.main, null);
  },
} satisfies FurnitureDef;
