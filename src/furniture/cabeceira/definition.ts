import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line } from '../../catalog/draw';

export default {
  id: 'cabeceira',
  name: 'Cabeceira',
  category: 'camas',
  w: 160,
  d: 14,
  keywords: ['cabeceira', 'cama', 'quarto'],
  flat: true,
  colors: { main: '#8f9a76', accent: '#c19a6b' },
  colorKeys: [
    { key: 'main', label: 'Estofado', palette: 'fabric' },
    { key: 'accent', label: 'Detalhe', palette: 'wood' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 4, colors.main, alpha('#2c3024', 0.35), 1.3);
    for (let i = 1; i < 4; i++) {
      line(ctx, (w / 4) * i, 2, (w / 4) * i, d - 2, alpha('#2c3024', 0.16), 1.1);
    }
    line(ctx, 4, d - 3.5, w - 4, d - 3.5, colors.accent, 1.6);
  },
} satisfies FurnitureDef;
