/** Itens de lavanderia: tanque, varal e cesto de roupas. */
import type { FurnitureDef } from '../types';
import { alpha, box, circle, hatch, knob, line, metalBar, shade } from '../draw';

export const lavanderia: FurnitureDef[] = [
  {
    id: 'tanque',
    name: 'Tanque de lavar roupa',
    category: 'lavanderia',
    w: 60,
    d: 55,
    keywords: ['tanque', 'lavanderia', 'lavar', 'roupa', 'cuba', 'servico'],
    colors: { main: '#e6e0d3', accent: '#f7f7f4', metal: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Gabinete', palette: 'paint' },
      { key: 'accent', label: 'Louça', palette: 'paint' },
      { key: 'metal', label: 'Torneira', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 3, colors.main, alpha('#5a5346', 0.4), 1.5);
      box(ctx, 4, 4, w - 8, d - 8, 3, colors.accent, alpha('#8d9498', 0.45), 1.3);
      box(
        ctx,
        9,
        9,
        w - 18,
        d - 22,
        2.5,
        alpha(shade(colors.accent, -0.06), 0.92),
        alpha('#8d9498', 0.55),
        1.2,
      );
      circle(ctx, w / 2, 5, 3.4, colors.metal, alpha('#4b5056', 0.4), 1.1);
      line(ctx, w / 2, 8, w / 2, 14, colors.metal, 2.2);
      knob(ctx, w - 10, d - 8, colors.metal, 2);
    },
  },
  {
    id: 'varal',
    name: 'Varal de parede',
    category: 'lavanderia',
    w: 140,
    d: 45,
    keywords: ['varal', 'secar', 'roupa', 'lavanderia', 'estender'],
    colors: { main: '#d8dce0', accent: '#cbb79a' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'metal' },
      { key: 'accent', label: 'Roupas', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      metalBar(ctx, 2, 4, 3, d - 8, colors.main, 1.2);
      metalBar(ctx, w - 5, 4, 3, d - 8, colors.main, 1.2);
      for (let i = 0; i < 3; i++) {
        const y = 8 + i * ((d - 16) / 2);
        line(ctx, 2, y, w - 2, y, alpha(colors.main, 0.9), 2.2);
      }
      const pieces = 4;
      for (let i = 0; i < pieces; i++) {
        const x = 12 + i * ((w - 24) / (pieces - 1));
        box(ctx, x - 8, 12, 16, d - 24, 2, alpha(colors.accent, 0.75), alpha('#5a4a38', 0.3), 1.1);
        line(ctx, x, 7, x, 12, alpha('#6c7077', 0.7), 1.2);
      }
    },
  },
  {
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
  },
];
