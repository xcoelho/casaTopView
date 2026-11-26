import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, shade } from '../../catalog/draw';

export default {
  id: 'bandeja-vinhos',
  name: 'Bandeja com vinhos',
  category: 'decoracao',
  w: 40,
  d: 22,
  zBias: 5,
  keywords: ['bandeja', 'vinho', 'vinhos', 'garrafa', 'garrafas', 'bar', 'adega'],
  colors: { main: '#8a5f3c', accent: '#2f4a28' },
  colorKeys: [
    { key: 'main', label: 'Bandeja', palette: 'wood' },
    { key: 'accent', label: 'Garrafas', palette: 'glass' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    // bandeja: borda + fundo
    box(ctx, 0.5, 0.5, w - 1, d - 1, 3, colors.main, shade(colors.main, -0.3), 1.4);
    box(ctx, 1.8, 1.8, w - 3.6, d - 3.6, 1.6, shade(colors.main, 0.08), null);
    // garrafas vistas de cima (x3d = -12, 0, +12; z3d = -1.5, +1.2, -0.8)
    const bottles = [
      { x: cx - 12, y: cy - 1.5, c: colors.accent },
      { x: cx, y: cy + 1.2, c: shade(colors.accent, -0.35) },
      { x: cx + 12, y: cy - 0.8, c: shade(colors.accent, 0.25) },
    ];
    for (const b of bottles) {
      circle(ctx, b.x + 0.5, b.y + 0.6, 4, alpha('#2a1c10', 0.18), null);
      circle(ctx, b.x, b.y, 3.8, b.c, shade(b.c, -0.4));
      circle(ctx, b.x - 1.3, b.y - 1.3, 1, alpha('#ffffff', 0.28), null);
      circle(ctx, b.x, b.y, 1.35, '#2e2a26', null);
      circle(ctx, b.x, b.y, 0.45, shade('#2e2a26', 0.25), null);
    }
  },
} satisfies FurnitureDef;