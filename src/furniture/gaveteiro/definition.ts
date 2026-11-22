import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line } from '../../catalog/draw';

export default {
  id: 'gaveteiro',
  name: 'Gaveteiro volante',
  category: 'armarios',
  w: 42,
  d: 52,
  keywords: ['gaveteiro', 'escritorio', 'gavetas', 'home office', 'arquivo'],
  colors: { main: '#e6e0d3', accent: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Corpo', palette: 'wood' },
    { key: 'accent', label: 'Puxadores', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#3a2a1c', 0.42), 1.5);
    for (let i = 1; i < 3; i++) {
      line(ctx, 2, (d / 3) * i, w - 2, (d / 3) * i, alpha('#3a2a1c', 0.24), 1.2);
    }
    for (let i = 0; i < 3; i++) {
      line(ctx, w * 0.3, (d / 3) * i + d / 6, w * 0.7, (d / 3) * i + d / 6, colors.accent, 2.2);
    }
    for (const x of [6, w - 6]) {
      for (const y of [6, d - 6]) circle(ctx, x, y, 2.4, alpha('#3b3f45', 0.8), null);
    }
  },
} satisfies FurnitureDef;
