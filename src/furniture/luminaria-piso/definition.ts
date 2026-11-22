import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle, shade } from '../../catalog/draw';

export default {
  id: 'luminaria-piso',
  name: 'Luminária de piso',
  category: 'decoracao',
  w: 36,
  d: 36,
  keywords: ['luminaria', 'luz', 'abraçadeira', 'decoracao'],
  flat: true,
  colors: { main: '#e8c98a', accent: '#c2a469' },
  colorKeys: [
    { key: 'main', label: 'Cúpula', palette: 'paint' },
    { key: 'accent', label: 'Base', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    circle(ctx, cx, cx, 5, colors.accent, alpha('#5d4a22', 0.4), 1.2);
    circle(ctx, cx, cx, Math.min(w, d) / 2 - 4, alpha(colors.main, 0.55), alpha(shade(colors.main, -0.4), 0.5), 1.4);
    circle(ctx, cx, cx, Math.min(w, d) / 2 - 10, alpha('#fff6dd', 0.55), null);
  },
} satisfies FurnitureDef;
