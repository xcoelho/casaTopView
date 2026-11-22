import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line, shade } from '../../catalog/draw';

export default {
  id: 'divisoria-plantas',
  name: 'Divisória com plantas',
  category: 'decoracao',
  w: 160,
  d: 28,
  keywords: ['divisoria', 'plantas', 'metal', 'sala', 'orquidea', 'verde'],
  colors: { main: '#3b3f45', accent: '#6f8f5c' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'metal' },
    { key: 'accent', label: 'Folhagem', palette: 'plant' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 2, alpha(colors.main, 0.9), alpha('#14171b', 0.45), 1.6);
    const cols = 4;
    for (let i = 0; i < cols; i++) {
      const x = 4 + i * ((w - 8) / cols);
      line(ctx, x + (w - 8) / cols / 2, 3, x + (w - 8) / cols / 2, d - 3, alpha('#ffffff', 0.14), 1.1);
      circle(ctx, x + (w - 8) / cols / 2, d * 0.62, 4.6, shade(colors.accent, i % 2 ? 0 : -0.12), alpha('#2c3a26', 0.5), 1.2);
      circle(ctx, x + (w - 8) / cols / 2, d * 0.3, 3, alpha('#ffffff', 0.75), null);
    }
    line(ctx, 3, d * 0.78, w - 3, d * 0.78, alpha(colors.main, 0.6), 1.4);
  },
} satisfies FurnitureDef;
