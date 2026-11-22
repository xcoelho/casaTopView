import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, cushion, grain, line, shade } from '../../catalog/draw';

export default {
  id: 'beliche-escritorio',
  name: 'Beliche com escrivaninha',
  category: 'camas',
  w: 95,
  d: 195,
  keywords: ['beliche', 'escritorio', 'cama', 'quarto', 'mesa'],
  colors: { main: '#8a6142', accent: '#ded4c1' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'wood' },
    { key: 'accent', label: 'Roupa de cama', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const wood = colors.main;
    const linen = colors.accent;
    // estrutura: postes
    box(ctx, 0, 0, w, d, 4, shade(wood, -0.12), alpha('#3a2a1c', 0.4), 1.4);
    for (const x of [3, w - 3]) {
      box(ctx, x - 2.5, 0, 5, d, 2, shade(wood, -0.28), alpha('#2c2014', 0.4), 1.2);
    }
    // cama alta
    box(ctx, 8, 12, w - 16, d - 24, 4, '#f6f1e4', alpha('#8a7a63', 0.4), 1.2);
    line(ctx, 8, d * 0.5, w - 8, d * 0.5, shade(wood, -0.3), 2.4);
    box(ctx, 8, d * 0.51, w - 16, d * 0.49 - 12, 4, linen, alpha(shade(linen, -0.35), 0.4), 1.1);
    cushion(ctx, 13, 16, w - 26, 22, 5, '#fbf6ea');
    line(ctx, 8, 100, w - 8, 100, alpha('#2c2014', 0.35), 1.4);
    // escrivaninha embaixo
    const deskY = d * 0.62;
    box(ctx, 8, deskY, w - 16, d - deskY - 10, 3, shade(wood, 0.06), alpha('#3a2a1c', 0.4), 1.2);
    grain(ctx, 9, deskY + 1, w - 18, d - deskY - 12, wood, 9);
    box(ctx, 12, d - 34, w - 24, 12, 2, shade(wood, -0.18), alpha('#2c2014', 0.35), 1);
    line(ctx, 8, deskY, w - 8, deskY, shade(wood, -0.3), 2);
  },
} satisfies FurnitureDef;
