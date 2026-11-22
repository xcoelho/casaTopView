import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, cushion, line, shade } from '../../catalog/draw';

export default {
  id: 'beliche-simples',
  name: 'Beliche simples',
  category: 'camas',
  w: 95,
  d: 195,
  keywords: ['beliche', 'cama', 'quarto', 'infantil'],
  colors: { main: '#c19a6b', accent: '#e6ddcd' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'wood' },
    { key: 'accent', label: 'Roupa de cama', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const wood = colors.main;
    const linen = colors.accent;
    // estrutura: postes e cabeceiras
    box(ctx, 0, 0, w, d, 4, shade(wood, -0.12), alpha('#3a2a1c', 0.4), 1.4);
    for (const x of [3, w - 3]) {
      box(ctx, x - 2.5, 0, 5, d, 2, shade(wood, -0.28), alpha('#2c2014', 0.4), 1.2);
    }
    // cama de baixo
    box(ctx, 8, 12, w - 16, d - 24, 4, '#f6f1e4', alpha('#8a7a63', 0.4), 1.2);
    box(ctx, 8, d * 0.58, w - 16, d * 0.42 - 12, 4, linen, alpha(shade(linen, -0.35), 0.4), 1.1);
    cushion(ctx, 13, 16, w - 26, 22, 5, '#fbf6ea');
    // cama de cima
    box(ctx, 8, 14, w - 16, d - 26, 4, '#f6f1e4', alpha('#8a7a63', 0.4), 1.2);
    line(ctx, 8, d * 0.45, w - 8, d * 0.45, shade(wood, -0.3), 2.4);
    box(ctx, 8, d * 0.46, w - 16, d * 0.54 - 12, 4, linen, alpha(shade(linen, -0.35), 0.4), 1.1);
    cushion(ctx, 13, 18, w - 26, 22, 5, '#fbf6ea');
    // guarda-corpo superior
    line(ctx, 6, 96, 6, d - 40, alpha('#2c2014', 0.35), 1.4);
    line(ctx, w - 6, 96, w - 6, d - 40, alpha('#2c2014', 0.35), 1.4);
    // escada
    for (let i = 0; i < 4; i++) {
      const y = 96 + i * ((d - 40 - 96) / 4);
      box(ctx, w - 26, y, 20, 7, 2, wood, alpha('#3a2a1c', 0.4), 1);
    }
  },
} satisfies FurnitureDef;
