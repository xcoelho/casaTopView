import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line } from '../../catalog/draw';

export default {
  id: 'sapateira',
  name: 'Sapateira',
  category: 'armarios',
  w: 90,
  d: 36,
  keywords: ['sapateira', 'sapato', 'entrada'],
  colors: { main: '#e6e0d3', accent: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Acabamento', palette: 'paint' },
    { key: 'accent', label: 'Detalhe', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#5a5346', 0.35), 1.4);
    for (let i = 1; i < 4; i++) {
      line(ctx, (w / 4) * i, 2, (w / 4) * i, d - 2, alpha('#5a5346', 0.22), 1.1);
    }
    for (let i = 0; i < 4; i++) {
      line(ctx, (w / 4) * i + w / 8 - 5, d / 2, (w / 4) * i + w / 8 + 5, d / 2, colors.accent, 2);
    }
  },
} satisfies FurnitureDef;
