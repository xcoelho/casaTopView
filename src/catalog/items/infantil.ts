/** Itens de quarto de bebê: trocador e poltrona de amamentação. */
import type { FurnitureDef } from '../types';
import { alpha, box, cushion, knob, line } from '../draw';

export const infantil: FurnitureDef[] = [
  {
    id: 'trocador',
    name: 'Trocador com gavetas',
    category: 'armarios',
    w: 95,
    d: 55,
    keywords: ['trocador', 'bebe', 'quarto', 'fralda', 'infantil'],
    colors: { main: '#efeae1', accent: '#ded4c1', metal: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Gabinete', palette: 'wood' },
      { key: 'accent', label: 'Colchonete', palette: 'fabric' },
      { key: 'metal', label: 'Puxadores', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 3, colors.main, alpha('#3a2a1c', 0.42), 1.5);
      box(ctx, 2, 4, 4, d - 8, 1.5, alpha(colors.main, 0.9), alpha('#3a2a1c', 0.3), 1.1);
      box(ctx, w - 6, 4, 4, d - 8, 1.5, alpha(colors.main, 0.9), alpha('#3a2a1c', 0.3), 1.1);
      // colchonete com borda elevada
      box(ctx, 9, 7, w - 18, d - 14, 6, colors.accent, alpha('#5a4a38', 0.35), 1.3);
      box(ctx, 13, 11, w - 26, d - 22, 4, null, alpha('#5a4a38', 0.22), 1);
      for (let i = 1; i < 3; i++) {
        line(ctx, 8, (d / 3) * i, w - 8, (d / 3) * i, alpha('#3a2a1c', 0.16), 1);
      }
      for (let i = 0; i < 3; i++) {
        knob(ctx, w - 12, (d / 3) * i + d / 6, colors.metal, 2);
      }
    },
  },
  {
    id: 'poltrona-amamentacao',
    name: 'Poltrona de amamentação',
    category: 'assentos',
    w: 85,
    d: 85,
    keywords: ['poltrona', 'amamentacao', 'bebe', 'quarto', 'infantil', 'conforto'],
    colors: { main: '#ded4c1', accent: '#cbb79a' },
    colorKeys: [
      { key: 'main', label: 'Tecido', palette: 'fabric' },
      { key: 'accent', label: 'Almofadas', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d * 0.26, 10, colors.main, alpha('#5a4a38', 0.42), 1.4);
      box(ctx, 0, d * 0.18, w, d * 0.82, 8, colors.main, alpha('#5a4a38', 0.42), 1.5);
      // braços
      box(ctx, 2, d * 0.26, 12, d * 0.68, 5, colors.main, alpha('#5a4a38', 0.3), 1.2);
      box(ctx, w - 14, d * 0.26, 12, d * 0.68, 5, colors.main, alpha('#5a4a38', 0.3), 1.2);
      // assento e almofadas
      cushion(ctx, 16, d * 0.32, w - 32, d * 0.56, 6, colors.accent);
      cushion(ctx, w * 0.3, d * 0.18, w * 0.4, d * 0.26, 8, colors.accent);
    },
  },
];
