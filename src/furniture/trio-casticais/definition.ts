import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle, shade } from '../../catalog/draw';

export default {
  id: 'trio-casticais',
  name: 'Trio de castiçais',
  category: 'decoracao',
  w: 30,
  d: 12,
  zBias: 5,
  keywords: ['vela', 'velas', 'castical', 'casticais', 'candelabro', 'decoracao'],
  colors: { main: '#efe6d4', accent: '#b08d57' },
  colorKeys: [
    { key: 'main', label: 'Velas', palette: 'paint' },
    { key: 'accent', label: 'Castiçais', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    // mesmos centros do 3D: x = -10, 0, +10; z = -0.8, +1.2, -0.6
    const spots = [
      { x: cx - 10, y: cy - 0.8 },
      { x: cx, y: cy + 1.2 },
      { x: cx + 10, y: cy - 0.6 },
    ];
    for (const s of spots) {
      circle(ctx, s.x, s.y, 4.2, colors.accent, shade(colors.accent, -0.35));
      circle(ctx, s.x, s.y, 2.4, shade(colors.accent, -0.18), null);
      circle(ctx, s.x, s.y, 1.3, colors.main, shade(colors.main, -0.2));
      circle(ctx, s.x, s.y, 1, alpha('#ff9a3d', 0.3), null);
      circle(ctx, s.x, s.y, 0.35, '#4a3a28', null);
    }
  },
} satisfies FurnitureDef;