import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line, metalBar } from '../../catalog/draw';

export default {
  id: 'geladeira-side-by-side',
  name: 'Geladeira side by side',
  category: 'cozinha',
  w: 95,
  d: 75,
  keywords: ['geladeira', 'side by side', 'inox', 'dispenser', 'cozinha'],
  colors: { main: '#d9dde1', accent: '#3b3f45' },
  colorKeys: [
    { key: 'main', label: 'Corpo', palette: 'metal' },
    { key: 'accent', label: 'Detalhes', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 5, colors.main, alpha('#5f666d', 0.45), 1.6);
    line(ctx, w / 2, 3, w / 2, d - 3, alpha('#5f666d', 0.5), 1.6);
    metalBar(ctx, w / 2 - 7, 6, 3.4, 26, colors.accent, 1.6);
    metalBar(ctx, w / 2 + 3.6, 6, 3.4, 26, colors.accent, 1.6);
    box(ctx, w * 0.08, d - 14, w * 0.34, 10, 2, colors.accent, null);
    box(ctx, w / 2 + 10, 8, 16, 18, 2, null, alpha('#5f666d', 0.4), 1.2);
  },
} satisfies FurnitureDef;
