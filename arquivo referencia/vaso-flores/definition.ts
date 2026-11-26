import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle, shade } from '../../catalog/draw';

const GREEN = '#5f8049';
const LEAF = '#6b8f52';
const BREATH = '#f3efe4';

export default {
  id: 'vaso-flores',
  name: 'Vaso de flores',
  category: 'decoracao',
  w: 24,
  d: 24,
  zBias: 5,
  keywords: ['vaso', 'flores', 'buque', 'arranjo', 'planta', 'decoracao'],
  colors: { main: '#e7e0d2', accent: '#d76a8c' },
  colorKeys: [
    { key: 'main', label: 'Vaso', palette: 'paint' },
    { key: 'accent', label: 'Flores', palette: 'paint' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    // vaso visto de cima + boca
    circle(ctx, cx, cy, 8.6, colors.main, shade(colors.main, -0.3));
    circle(ctx, cx, cy, 4.6, shade(colors.main, -0.45), null);
    // folhagem (mesmas posições do 3D: y2d = cy + z)
    circle(ctx, cx - 6, cy - 6, 3, alpha(GREEN, 0.9), null);
    circle(ctx, cx + 6.5, cy + 5.5, 2.8, alpha(GREEN, 0.9), null);
    circle(ctx, cx - 2, cy + 7, 2.6, alpha(GREEN, 0.9), null);
    circle(ctx, cx + 8, cy - 1, 2.4, alpha(GREEN, 0.9), null);
    circle(ctx, cx - 5.2, cy - 5.4, 1.5, alpha(LEAF, 0.9), null);
    circle(ctx, cx + 7.2, cy + 6, 1.4, alpha(LEAF, 0.9), null);
    // rosas
    circle(ctx, cx - 4.5, cy - 2, 2.7, colors.accent, shade(colors.accent, -0.25));
    circle(ctx, cx - 4.5, cy - 2, 1.1, shade(colors.accent, -0.3), null);
    circle(ctx, cx + 5, cy + 2.5, 2.7, colors.accent, shade(colors.accent, -0.25));
    circle(ctx, cx + 5, cy + 2.5, 1.1, shade(colors.accent, -0.3), null);
    circle(ctx, cx + 0.5, cy - 5, 2.7, colors.accent, shade(colors.accent, -0.25));
    circle(ctx, cx + 0.5, cy - 5, 1.1, shade(colors.accent, -0.3), null);
    // tulipas
    circle(ctx, cx - 7.5, cy + 4, 2.2, shade(colors.accent, 0.18), shade(colors.accent, -0.1));
    circle(ctx, cx - 7.5, cy + 4, 0.8, shade(colors.accent, -0.15), null);
    circle(ctx, cx + 7.5, cy - 4, 2.2, shade(colors.accent, 0.18), shade(colors.accent, -0.1));
    circle(ctx, cx + 7.5, cy - 4, 0.8, shade(colors.accent, -0.15), null);
    circle(ctx, cx + 2.5, cy + 6.5, 2.2, shade(colors.accent, 0.18), shade(colors.accent, -0.1));
    circle(ctx, cx + 2.5, cy + 6.5, 0.8, shade(colors.accent, -0.15), null);
    // mosquitinhos
    circle(ctx, cx - 9, cy + 1.5, 0.8, BREATH, null);
    circle(ctx, cx + 9, cy + 3, 0.8, BREATH, null);
    circle(ctx, cx - 3, cy - 8.5, 0.8, BREATH, null);
    circle(ctx, cx + 4, cy - 7.5, 0.8, BREATH, null);
    circle(ctx, cx - 8.3, cy + 2.1, 0.5, BREATH, null);
    circle(ctx, cx + 4.7, cy - 7, 0.5, BREATH, null);
  },
} satisfies FurnitureDef;