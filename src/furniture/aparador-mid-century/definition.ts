import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, grain, line } from '../../catalog/draw';

export default {
  id: 'aparador-mid-century',
  name: 'Aparador mid-century',
  category: 'armarios',
  w: 180,
  d: 45,
  keywords: ['aparador', 'mid-century', 'ripado', 'sala', 'retrô'],
  colors: { main: '#c19a6b', accent: '#c2a469' },
  colorKeys: [
    { key: 'main', label: 'Madeira', palette: 'wood' },
    { key: 'accent', label: 'Puxadores', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 3, colors.main, alpha('#3a2a1c', 0.42), 1.6);
    grain(ctx, 1, 1, w - 2, d - 2, colors.main, 12);
    const doors = 4;
    const dw = w / doors;
    for (let i = 1; i < doors; i++) {
      line(ctx, dw * i, 2, dw * i, d - 2, alpha('#3a2a1c', 0.32), 1.3);
    }
    for (let i = 0; i < doors; i++) {
      for (let s = 0; s < 3; s++) {
        line(ctx, dw * i + 8 + s * 6, 6, dw * i + 8 + s * 6, d - 6, alpha('#3a2a1c', 0.18), 1);
      }
    }
    for (let i = 0; i < doors; i++) {
      const x = dw * i + dw / 2;
      const handleX = i % 2 === 0 ? x + dw / 2 - 7 : x - dw / 2 + 7;
      line(ctx, handleX, d * 0.35, handleX, d * 0.65, colors.accent, 2.2);
    }
  },
} satisfies FurnitureDef;
