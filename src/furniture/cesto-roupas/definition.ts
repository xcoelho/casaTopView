import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, hatch } from '../../catalog/draw';

export default {
  id: 'cesto-roupas',
  name: 'Cesto de roupas',
  category: 'lavanderia',
  w: 48,
  d: 48,
  keywords: ['cesto', 'roupa', 'lavanderia', 'organizador', 'cesto de roupa'],
  colors: { main: '#cbb79a', accent: '#e6ddcd' },
  colorKeys: [
    { key: 'main', label: 'Cesto', palette: 'wood' },
    { key: 'accent', label: 'Tecido', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    circle(ctx, cx, cy, Math.min(w, d) / 2 - 2, colors.main, alpha('#5a4a38', 0.45), 1.5);
    circle(ctx, cx, cy, Math.min(w, d) / 2 - 8, alpha(colors.accent, 0.9), alpha('#5a4a38', 0.3), 1.2);
    // Alças laterais e roupa dobrada à mostra.
    box(ctx, 0, cy - 5, 5, 10, 2, colors.main, alpha('#5a4a38', 0.4), 1.1);
    box(ctx, w - 5, cy - 5, 5, 10, 2, colors.main, alpha('#5a4a38', 0.4), 1.1);
    hatch(ctx, cx - 9, cy - 9, 18, 18, alpha('#5a4a38', 0.18), 5, 1);
  },
} satisfies FurnitureDef;
