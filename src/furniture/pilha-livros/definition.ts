import type { FurnitureDef } from '../../catalog/types';
import { box, circle, shade } from '../../catalog/draw';

const PAGES = '#ece5d2';

export default {
  id: 'pilha-livros',
  name: 'Pilha de livros',
  category: 'decoracao',
  w: 28,
  d: 22,
  zBias: 5,
  keywords: ['livro', 'livros', 'pilha', 'tigela', 'estante', 'decoracao'],
  colors: { main: '#9a5b43', accent: '#ddd6c8' },
  colorKeys: [
    { key: 'main', label: 'Livros', palette: 'fabric' },
    { key: 'accent', label: 'Tigela', palette: 'paint' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    // de baixo para cima, com os mesmos deslocamentos do 3D
    const books = [
      { bw: 27, bd: 20, ox: 0, oz: 0, c: colors.main },
      { bw: 25, bd: 18.5, ox: 0.9, oz: -0.6, c: shade(colors.main, -0.25) },
      { bw: 23.5, bd: 17, ox: -0.8, oz: 0.5, c: shade(colors.main, 0.2) },
      { bw: 21, bd: 15.5, ox: 0.4, oz: 0.9, c: shade(colors.main, -0.45) },
    ];
    for (const b of books) {
      const x = cx + b.ox - b.bw / 2;
      const y = cy + b.oz - b.bd / 2;
      box(ctx, x, y, b.bw, b.bd, 1.2, b.c, shade(b.c, -0.35), 1.2);
      // corte de páginas na frente e na lateral direita
      box(ctx, x + b.bw - 1.1, y + 1, 0.9, b.bd - 2, 0.4, PAGES, null);
      box(ctx, x + 1.6, y + b.bd - 1, b.bw - 3, 0.8, 0.4, PAGES, null);
      // lombada
      box(ctx, x + 0.5, y + 0.7, 1.3, b.bd - 1.4, 0.5, shade(b.c, -0.28), null);
    }
    // tigela no topo
    circle(ctx, cx + 0.4, cy + 0.9, 6.2, colors.accent, shade(colors.accent, -0.3));
    circle(ctx, cx + 0.4, cy + 0.9, 4.7, shade(colors.accent, -0.16), null);
    circle(ctx, cx + 0.4, cy + 0.9, 4, shade(colors.accent, -0.28), null);
    // bolas de ratã
    circle(ctx, cx - 0.9, cy + 0.3, 1.15, '#a8845c', null);
    circle(ctx, cx + 1.6, cy + 0.7, 1.15, '#8f6d48', null);
    circle(ctx, cx + 0.3, cy + 2.3, 1.15, '#b99a72', null);
  },
} satisfies FurnitureDef;