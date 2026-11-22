import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line, metalBar } from '../../catalog/draw';

export default {
  id: 'geladeira',
  name: 'Geladeira',
  category: 'cozinha',
  w: 72,
  d: 70,
  keywords: ['geladeira', 'refrigerador', 'cozinha'],
  colors: { main: '#d9dde1', accent: '#3b3f45' },
  colorKeys: [
    { key: 'main', label: 'Corpo', palette: 'metal' },
    { key: 'accent', label: 'Puxadores', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 5, colors.main, alpha('#5f666d', 0.45), 1.6);
    const grad = ctx.createLinearGradient(0, 0, w, d);
    grad.addColorStop(0, alpha('#ffffff', 0.35));
    grad.addColorStop(0.5, alpha('#ffffff', 0));
    grad.addColorStop(1, alpha('#000000', 0.06));
    box(ctx, 0, 0, w, d, 5, grad, null);
    line(ctx, 4, 26, w - 4, 26, alpha('#5f666d', 0.45), 1.4);
    metalBar(ctx, w / 2 - 16, 5, 3.4, 18, colors.accent, 1.6);
    metalBar(ctx, w / 2 + 12, 30, 3.4, 32, colors.accent, 1.6);
  },
} satisfies FurnitureDef;
