import type { FurnitureDef } from '../types';
import { alpha, box, circle, cushion, grain, knob, line, shade } from '../draw';

function bed(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  wood: string,
  linen: string,
  pillows: number,
): void {
  const frame = shade(wood, -0.1);
  box(ctx, 0, 0, w, d, 7, frame, alpha('#3a2a1c', 0.4), 1.6);
  grain(ctx, 1, 1, w - 2, d - 2, wood, 16);
  // cabeceira
  box(ctx, 2, 1.5, w - 4, 12, 4, shade(wood, -0.22), alpha('#2c2014', 0.35), 1.2);
  // colchão
  box(ctx, 5, 14, w - 10, d - 19, 6, '#f6f1e4', alpha('#8a7a63', 0.4), 1.3);
  // edredom
  box(ctx, 5, 52, w - 10, d - 57, 6, linen, alpha(shade(linen, -0.4), 0.4), 1.3);
  line(ctx, 7, 58, w - 7, 58, alpha('#ffffff', 0.55), 1.6);
  // travesseiros
  const gap = 6;
  const pw = (w - 10 - gap * (pillows + 1)) / pillows;
  for (let i = 0; i < pillows; i++) {
    cushion(ctx, 10 + i * (pw + gap), 18, pw, 26, 6, '#fbf6ea');
  }
}

export const camas: FurnitureDef[] = [
  {
    id: 'cama-solteiro',
    name: 'Cama de solteiro',
    category: 'camas',
    w: 95,
    d: 195,
    keywords: ['cama', 'solteiro', 'quarto'],
    colors: { main: '#c19a6b', accent: '#e6ddcd' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'wood' },
      { key: 'accent', label: 'Roupa de cama', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => bed(ctx, w, d, colors.main, colors.accent, 1),
  },
  {
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
  },
  {
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
  },
  {
    id: 'cama-casal',
    name: 'Cama de casal',
    category: 'camas',
    w: 145,
    d: 200,
    keywords: ['cama', 'casal', 'quarto'],
    colors: { main: '#c19a6b', accent: '#dfd6c5' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'wood' },
      { key: 'accent', label: 'Roupa de cama', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => bed(ctx, w, d, colors.main, colors.accent, 2),
  },
  {
    id: 'cama-king',
    name: 'Cama king',
    category: 'camas',
    w: 195,
    d: 210,
    keywords: ['cama', 'king', 'quarto'],
    colors: { main: '#8a6142', accent: '#efe8db' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'wood' },
      { key: 'accent', label: 'Roupa de cama', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => bed(ctx, w, d, colors.main, colors.accent, 3),
  },
  {
    id: 'berco',
    name: 'Berço',
    category: 'camas',
    w: 75,
    d: 135,
    keywords: ['berco', 'bebe', 'quarto'],
    colors: { main: '#e6e0d3', accent: '#f6f1e4' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'paint' },
      { key: 'accent', label: 'Colchão', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 5, colors.main, alpha('#5a5346', 0.35), 1.5);
      box(ctx, 6, 6, w - 12, d - 12, 4, colors.accent, alpha('#8a7a63', 0.4), 1.2);
      for (let i = 0; i < Math.floor((d - 12) / 9); i++) {
        line(ctx, 3, 8 + i * 9, 8, 8 + i * 9, alpha('#5a5346', 0.35), 1.1);
        line(ctx, w - 8, 8 + i * 9, w - 3, 8 + i * 9, alpha('#5a5346', 0.35), 1.1);
      }
      line(ctx, 8, 12, w - 8, 12, alpha('#5a5346', 0.25), 1.2);
    },
  },
  {
    id: 'criado-mudo',
    name: 'Criado-mudo',
    category: 'camas',
    w: 45,
    d: 40,
    keywords: ['criado', 'mudo', 'mesa', 'quarto'],
    colors: { main: '#c19a6b', accent: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Madeira', palette: 'wood' },
      { key: 'accent', label: 'Puxador', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, colors.main, alpha('#3a2a1c', 0.4), 1.5);
      grain(ctx, 1, 1, w - 2, d - 2, colors.main, 9);
      line(ctx, 4, d * 0.62, w - 4, d * 0.62, alpha('#3a2a1c', 0.28), 1.1);
      knob(ctx, w / 2, d * 0.4, colors.accent, 2);
      knob(ctx, w / 2, d * 0.82, colors.accent, 2);
    },
  },
  {
    id: 'cabeceira',
    name: 'Cabeceira',
    category: 'camas',
    w: 160,
    d: 14,
    keywords: ['cabeceira', 'cama', 'quarto'],
    flat: true,
    colors: { main: '#8f9a76', accent: '#c19a6b' },
    colorKeys: [
      { key: 'main', label: 'Estofado', palette: 'fabric' },
      { key: 'accent', label: 'Detalhe', palette: 'wood' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, colors.main, alpha('#2c3024', 0.35), 1.3);
      for (let i = 1; i < 4; i++) {
        line(ctx, (w / 4) * i, 2, (w / 4) * i, d - 2, alpha('#2c3024', 0.16), 1.1);
      }
      line(ctx, 4, d - 3.5, w - 4, d - 3.5, colors.accent, 1.6);
    },
  },
];
