import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, grain } from '../../catalog/draw';

export default {
  id: 'ilha',
  name: 'Ilha de cozinha',
  category: 'cozinha',
  w: 160,
  d: 90,
  keywords: ['ilha', 'cozinha', 'bancada'],
  colors: { main: '#e6e0d3', accent: '#eeeee9' },
  colorKeys: [
    { key: 'main', label: 'Armários', palette: 'paint' },
    { key: 'accent', label: 'Bancada', palette: 'stone' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 6, 6, w - 12, d - 12, 4, colors.main, alpha('#5a5346', 0.3), 1.2);
    box(ctx, 0, 0, w, d, 5, colors.accent, alpha('#5a5346', 0.4), 1.7);
    grain(ctx, 3, 3, w - 6, d - 6, colors.accent, 30);
    box(ctx, 3.5, 3.5, w - 7, d - 7, 4, null, alpha('#ffffff', 0.4), 1.1);
  },
} satisfies FurnitureDef;
