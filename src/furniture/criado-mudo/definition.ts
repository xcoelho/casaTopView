import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, grain, knob, line } from '../../catalog/draw';

export default {
  id: 'criado-mudo',
  name: 'Criado-mudo',
  category: 'camas',
  w: 45,
  d: 40,
  keywords: ['criado', 'mudo', 'mesa', 'quarto'],
  colors: { main: '#c19a6b', accent: '#b8bcc1' },
  colorKeys: [
    { key: 'main', label: 'Madeira', palette: 'wood' },
    { key: 'accent', label: 'Puxador', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 4, colors.main, alpha('#3a2a1c', 0.4), 1.5);
    grain(ctx, 1, 1, w - 2, d - 2, colors.main, 9);
    line(ctx, 4, d * 0.62, w - 4, d * 0.62, alpha('#3a2a1c', 0.28), 1.1);
    knob(ctx, w / 2, d * 0.4, colors.accent, 2);
    knob(ctx, w / 2, d * 0.82, colors.accent, 2);
  },
} satisfies FurnitureDef;
