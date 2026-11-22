import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, grain, line } from '../../catalog/draw';

export default {
  id: 'rack-tv',
  name: 'Rack de TV',
  category: 'armarios',
  w: 160,
  d: 45,
  keywords: ['rack', 'tv', 'sala', 'estante'],
  colors: { main: '#8a6142', accent: '#3b3f45' },
  colorKeys: [
    { key: 'main', label: 'Madeira', palette: 'wood' },
    { key: 'accent', label: 'Detalhe', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#2c2014', 0.42), 1.5);
    grain(ctx, 1, 1, w - 2, d - 2, colors.main, 12);
    const mid = w / 2;
    box(ctx, mid - 56, 8, 52, d - 16, 2, null, alpha('#2c2014', 0.35), 1.2);
    box(ctx, mid + 4, 8, 52, d - 16, 2, null, alpha('#2c2014', 0.35), 1.2);
    line(ctx, mid - 52, d / 2, mid - 8, d / 2, colors.accent, 1.8);
    line(ctx, mid + 8, d / 2, mid + 52, d / 2, colors.accent, 1.8);
    box(ctx, 10, 9, 40, d - 18, 2, alpha('#ffffff', 0.18), null);
  },
} satisfies FurnitureDef;
