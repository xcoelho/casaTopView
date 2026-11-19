/** Itens de closet: ilha central, arara e closets abertos por tamanho. */
import type { FurnitureDef } from '../types';
import { alpha, box, grain, line, metalBar, shade } from '../draw';

function drawClosetAberto(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  colors: Record<string, string>,
  cols: number,
): void {
  box(ctx, 0, 0, w, d, 3, colors.main, alpha('#3a2a1c', 0.42), 1.6);
  grain(ctx, 1, 1, w - 2, d - 2, colors.main, 12, true);
  const cw = w / cols;
  for (let i = 1; i < cols; i++) {
    line(ctx, cw * i, 2, cw * i, d - 2, alpha('#3a2a1c', 0.35), 1.5);
  }
  for (let c = 0; c < cols; c++) {
    const x = cw * c;
    line(ctx, x + 5, 6, x + cw - 5, 6, alpha('#6c7077', 0.8), 2);
    const cloth = ['#b46a55', '#5b7c8d', '#8f9a76', '#c2a469', '#7a6a8a'];
    const n = 3 + (c % 2);
    for (let i = 0; i < n; i++) {
      const bx = x + 8 + i * ((cw - 16) / n);
      ctx.fillStyle = cloth[(c + i) % cloth.length];
      ctx.globalAlpha = 0.8;
      ctx.fillRect(bx, 9, (cw - 16) / n - 2, d * 0.3);
      ctx.globalAlpha = 1;
    }
    line(ctx, x + 5, d * 0.48, x + cw - 5, d * 0.48, alpha('#3a2a1c', 0.3), 1.3);
    ctx.fillStyle = alpha(colors.accent, 0.55);
    ctx.fillRect(x + 8, d * 0.52, cw - 16, d * 0.2);
    line(ctx, x + 8, d * 0.78, x + cw - 8, d * 0.78, alpha('#3a2a1c', 0.3), 1.3);
    box(ctx, x + cw / 2 - 9, d * 0.8, 18, d * 0.14, 1.4, alpha(shade(colors.main, -0.1), 0.8), null);
  }
}

export const closet: FurnitureDef[] = [
  {
    id: 'ilha-closet',
    name: 'Ilha de closet',
    category: 'armarios',
    w: 160,
    d: 70,
    keywords: ['ilha', 'closet', 'gavetas', 'roupa', 'quarto'],
    colors: { main: '#c19a6b', accent: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Madeira', palette: 'wood' },
      { key: 'accent', label: 'Puxadores', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, colors.main, alpha('#3a2a1c', 0.42), 1.6);
      grain(ctx, 1, 1, w - 2, d - 2, colors.main, 14);
      // Bancadas de gavetas nas pontas e bandeja central de vidro.
      for (const x of [w * 0.26, w * 0.74]) {
        line(ctx, x, 4, x, d - 4, alpha('#3a2a1c', 0.2), 1.3);
      }
      box(ctx, w * 0.3, 10, w * 0.4, d - 20, 3, alpha('#dfeef2', 0.6), alpha('#3a2a1c', 0.25), 1.2);
    },
  },
  {
    id: 'arara-roupas',
    name: 'Arara de roupas',
    category: 'armarios',
    w: 120,
    d: 55,
    keywords: ['arara', 'cabide', 'roupa', 'closet', 'pendurar'],
    colors: { main: '#3b3f45', accent: '#cbb79a' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'metal' },
      { key: 'accent', label: 'Roupas', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      metalBar(ctx, 3, 3, 3, d - 6, colors.main, 1.2);
      metalBar(ctx, w - 6, 3, 3, d - 6, colors.main, 1.2);
      line(ctx, 4.5, d * 0.36, w - 4.5, d * 0.36, alpha(colors.main, 0.95), 2.4);
      const count = 5;
      for (let i = 0; i < count; i++) {
        const x = 14 + i * ((w - 28) / (count - 1));
        line(ctx, x, d * 0.36, x, d * 0.44, alpha('#6c7077', 0.75), 1.3);
        box(ctx, x - 9, d * 0.44, 18, d * 0.5, 2, alpha(colors.accent, 0.72), alpha('#5a4a38', 0.3), 1.1);
      }
    },
  },
  {
    id: 'closet-aberto-pequeno',
    name: 'Closet aberto pequeno',
    category: 'armarios',
    w: 120,
    d: 60,
    keywords: ['closet', 'aberto', 'roupa', 'quarto', 'sem porta', 'pequeno'],
    colors: { main: '#e6e0d3', accent: '#d8bb92' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'paint' },
      { key: 'accent', label: 'Roupas', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => drawClosetAberto(ctx, w, d, colors, 2),
  },
  {
    id: 'closet-aberto-medio',
    name: 'Closet aberto médio',
    category: 'armarios',
    w: 180,
    d: 60,
    keywords: ['closet', 'aberto', 'roupa', 'quarto', 'sem porta', 'medio'],
    colors: { main: '#e6e0d3', accent: '#d8bb92' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'paint' },
      { key: 'accent', label: 'Roupas', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => drawClosetAberto(ctx, w, d, colors, 3),
  },
  {
    id: 'closet-aberto-grande',
    name: 'Closet aberto grande',
    category: 'armarios',
    w: 240,
    d: 62,
    keywords: ['closet', 'aberto', 'roupa', 'quarto', 'sem porta', 'grande'],
    colors: { main: '#efeae1', accent: '#d8bb92' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'paint' },
      { key: 'accent', label: 'Roupas', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => drawClosetAberto(ctx, w, d, colors, 4),
  },
];
