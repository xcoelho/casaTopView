import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, knob, line } from '../../catalog/draw';

export default {
  id: 'trocador',
  name: 'Trocador com gavetas',
  category: 'armarios',
  w: 95,
  d: 55,
  keywords: ['trocador', 'bebe', 'quarto', 'fralda', 'infantil'],
  colors: { main: '#efeae1', accent: '#ded4c1', metal: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Gabinete', palette: 'wood' },
    { key: 'accent', label: 'Colchonete', palette: 'fabric' },
    { key: 'metal', label: 'Puxadores', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#3a2a1c', 0.42), 1.5);
    box(ctx, 2, 4, 4, d - 8, 1.5, alpha(colors.main, 0.9), alpha('#3a2a1c', 0.3), 1.1);
    box(ctx, w - 6, 4, 4, d - 8, 1.5, alpha(colors.main, 0.9), alpha('#3a2a1c', 0.3), 1.1);
    // colchonete com borda elevada
    box(ctx, 9, 7, w - 18, d - 14, 6, colors.accent, alpha('#5a4a38', 0.35), 1.3);
    box(ctx, 13, 11, w - 26, d - 22, 4, null, alpha('#5a4a38', 0.22), 1);
    for (let i = 1; i < 3; i++) {
      line(ctx, 8, (d / 3) * i, w - 8, (d / 3) * i, alpha('#3a2a1c', 0.16), 1);
    }
    for (let i = 0; i < 3; i++) {
      knob(ctx, w - 12, (d / 3) * i + d / 6, colors.metal, 2);
    }
  },
} satisfies FurnitureDef;
