import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, grain, line } from '../../catalog/draw';

export default {
  id: 'rack-painel-grande',
  name: 'Rack com painel grande',
  category: 'armarios',
  w: 220,
  d: 48,
  keywords: ['rack', 'painel', 'ripado', 'tv', 'sala', 'hack'],
  colors: { main: '#c19a6b', accent: '#efeae1' },
  colorKeys: [
    { key: 'main', label: 'Madeira', palette: 'wood' },
    { key: 'accent', label: 'Rack', palette: 'paint' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#2c2014', 0.42), 1.5);
    for (let x = 6; x < w - 4; x += 8) {
      line(ctx, x, 3, x, d - 3, alpha('#2c2014', 0.28), 1.4);
    }
    box(ctx, 4, d * 0.42, w - 8, d * 0.5, 3, colors.accent, alpha('#2c2014', 0.4), 1.5);
    grain(ctx, 6, d * 0.42 + 2, w - 12, d * 0.5 - 4, colors.accent, 10);
    const mid = w / 2;
    box(ctx, mid - 46, d * 0.46, 44, d * 0.42, 2, null, alpha('#2c2014', 0.3), 1.2);
    box(ctx, mid + 2, d * 0.46, 44, d * 0.42, 2, null, alpha('#2c2014', 0.3), 1.2);
    box(ctx, 12, d * 0.48, 26, 12, 2, alpha(colors.main, 0.5), null);
    box(ctx, w - 44, d * 0.56, 30, 10, 2, alpha(colors.main, 0.45), null);
  },
} satisfies FurnitureDef;
