import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, grain, knob, line } from '../../catalog/draw';

export default {
  id: 'comoda',
  name: 'Cômoda',
  category: 'armarios',
  w: 120,
  d: 50,
  keywords: ['comoda', 'gavetas', 'quarto'],
  colors: { main: '#c19a6b', accent: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Madeira', palette: 'wood' },
    { key: 'accent', label: 'Puxadores', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#3a2a1c', 0.42), 1.6);
    grain(ctx, 1, 1, w - 2, d - 2, colors.main, 12);
    for (let i = 1; i < 3; i++) {
      line(ctx, 2, (d / 3) * i, w - 2, (d / 3) * i, alpha('#3a2a1c', 0.3), 1.2);
    }
    for (let i = 0; i < 3; i++) {
      knob(ctx, w / 2, (d / 3) * i + d / 6, colors.accent, 2.2);
    }
    box(ctx, 3, 3, w - 6, d - 6, 2, null, alpha('#ffffff', 0.26), 1);
  },
} satisfies FurnitureDef;
