import type { FurnitureDef } from '../types';
import { alpha, box, circle, grain, knob, line, shade } from '../draw';

export const armarios: FurnitureDef[] = [
  {
    id: 'guarda-roupa',
    name: 'Guarda-roupa',
    category: 'armarios',
    w: 200,
    d: 62,
    keywords: ['guarda', 'roupa', 'armario', 'quarto'],
    colors: { main: '#d8bb92', accent: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Madeira', palette: 'wood' },
      { key: 'accent', label: 'Puxadores', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 3, colors.main, alpha('#3a2a1c', 0.42), 1.6);
      grain(ctx, 1, 1, w - 2, d - 2, colors.main, 14, true);
      const doors = 4;
      const dw = w / doors;
      for (let i = 1; i < doors; i++) {
        line(ctx, dw * i, 2, dw * i, d - 2, alpha('#3a2a1c', 0.32), 1.3);
      }
      for (let i = 0; i < doors; i++) {
        const x = dw * i + dw / 2;
        const handleX = i % 2 === 0 ? x + dw / 2 - 6 : x - dw / 2 + 6;
        line(ctx, handleX, d * 0.32, handleX, d * 0.68, colors.accent, 2.4);
      }
      box(ctx, 3, 3, w - 6, d - 6, 2, null, alpha('#ffffff', 0.28), 1);
    },
  },
  {
    id: 'comoda',
    name: 'Cômoda',
    category: 'armarios',
    w: 120,
    d: 50,
    keywords: ['comoda', 'gavetas', 'quarto'],
    colors: { main: '#c19a6b', accent: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Madeira', palette: 'wood' },
      { key: 'accent', label: 'Puxadores', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 3, colors.main, alpha('#3a2a1c', 0.42), 1.6);
      grain(ctx, 1, 1, w - 2, d - 2, colors.main, 12);
      for (let i = 1; i < 3; i++) {
        line(ctx, 2, (d / 3) * i, w - 2, (d / 3) * i, alpha('#3a2a1c', 0.3), 1.2);
      }
      for (let i = 0; i < 3; i++) {
        knob(ctx, w / 2, (d / 3) * i + d / 6, colors.accent, 2.2);
      }
      box(ctx, 3, 3, w - 6, d - 6, 2, null, alpha('#ffffff', 0.26), 1);
    },
  },
  {
    id: 'sapateira',
    name: 'Sapateira',
    category: 'armarios',
    w: 90,
    d: 36,
    keywords: ['sapateira', 'sapato', 'entrada'],
    colors: { main: '#e6e0d3', accent: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Acabamento', palette: 'paint' },
      { key: 'accent', label: 'Detalhe', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 3, colors.main, alpha('#5a5346', 0.35), 1.4);
      for (let i = 1; i < 4; i++) {
        line(ctx, (w / 4) * i, 2, (w / 4) * i, d - 2, alpha('#5a5346', 0.22), 1.1);
      }
      for (let i = 0; i < 4; i++) {
        line(ctx, (w / 4) * i + w / 8 - 5, d / 2, (w / 4) * i + w / 8 + 5, d / 2, colors.accent, 2);
      }
    },
  },
  {
    id: 'estante',
    name: 'Estante',
    category: 'armarios',
    w: 160,
    d: 35,
    keywords: ['estante', 'livros', 'prateleira'],
    colors: { main: '#c19a6b', accent: '#8a6142' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'wood' },
      { key: 'accent', label: 'Prateleiras', palette: 'wood' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 2, colors.main, alpha('#3a2a1c', 0.42), 1.5);
      for (let i = 1; i < 3; i++) {
        line(ctx, (w / 3) * i, 2, (w / 3) * i, d - 2, colors.accent, 2.2);
      }
      const bookColors = ['#b46a55', '#5b7c8d', '#8f9a76', '#c2a469', '#7a6a8a'];
      for (let i = 0; i < 16; i++) {
        const x = 5 + (i % 8) * ((w - 10) / 8);
        const cell = Math.floor(i / 8);
        ctx.fillStyle = bookColors[i % bookColors.length];
        ctx.globalAlpha = 0.72;
        ctx.fillRect(x, cell === 0 ? 5 : d / 2 + 3, 3.6, d / 2 - 9);
        ctx.globalAlpha = 1;
      }
      line(ctx, 2, d / 2, w - 2, d / 2, colors.accent, 1.8);
    },
  },
  {
    id: 'rack-tv',
    name: 'Rack de TV',
    category: 'armarios',
    w: 160,
    d: 45,
    keywords: ['rack', 'tv', 'sala', 'estante'],
    colors: { main: '#8a6142', accent: '#3b3f45' },
    colorKeys: [
      { key: 'main', label: 'Madeira', palette: 'wood' },
      { key: 'accent', label: 'Detalhe', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 3, colors.main, alpha('#2c2014', 0.42), 1.5);
      grain(ctx, 1, 1, w - 2, d - 2, colors.main, 12);
      const mid = w / 2;
      box(ctx, mid - 56, 8, 52, d - 16, 2, null, alpha('#2c2014', 0.35), 1.2);
      box(ctx, mid + 4, 8, 52, d - 16, 2, null, alpha('#2c2014', 0.35), 1.2);
      line(ctx, mid - 52, d / 2, mid - 8, d / 2, colors.accent, 1.8);
      line(ctx, mid + 8, d / 2, mid + 52, d / 2, colors.accent, 1.8);
      box(ctx, 10, 9, 40, d - 18, 2, alpha('#ffffff', 0.18), null);
    },
  },
  {
    id: 'nicho-quarto',
    name: 'Nicho de quarto',
    category: 'armarios',
    w: 110,
    d: 30,
    keywords: ['nicho', 'prateleira', 'quarto', 'estante', 'parede'],
    colors: { main: '#e6e0d3', accent: '#c19a6b' },
    colorKeys: [
      { key: 'main', label: 'Acabamento', palette: 'paint' },
      { key: 'accent', label: 'Prateleiras', palette: 'wood' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 2.5, colors.main, alpha('#5a5346', 0.4), 1.5);
      box(ctx, 3, 3, w - 6, d - 7, 1, alpha(shade(colors.main, -0.12), 0.55), null);
      for (let i = 1; i < 3; i++) {
        line(ctx, (w / 3) * i, 3, (w / 3) * i, d - 4, alpha('#5a5346', 0.3), 1.5);
      }
      line(ctx, 3, d - 4.5, w - 3, d - 4.5, colors.accent, 1.8);
      const bookColors = ['#b46a55', '#5b7c8d', '#8f9a76', '#c2a469'];
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = bookColors[i];
        ctx.globalAlpha = 0.75;
        ctx.fillRect(9 + i * 4.6, d * 0.32, 3.2, d * 0.34);
        ctx.globalAlpha = 1;
      }
      box(ctx, w / 2 - 8, d * 0.3, 16, d * 0.4, 1.5, alpha(colors.accent, 0.45), alpha('#5a5346', 0.25), 1);
      circle(ctx, w - 18, d * 0.5, 4.2, alpha('#f1efe8', 0.9), alpha('#5a5346', 0.3), 1);
    },
  },
  {
    id: 'prateleira-quarto',
    name: 'Prateleira suspensa',
    category: 'armarios',
    w: 90,
    d: 22,
    keywords: ['prateleira', 'suspensa', 'quarto', 'parede', 'livros'],
    colors: { main: '#d8bb92', accent: '#3b3f45' },
    colorKeys: [
      { key: 'main', label: 'Prateleira', palette: 'wood' },
      { key: 'accent', label: 'Suportes', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 1.6, colors.main, alpha('#3a2a1c', 0.38), 1.3);
      box(ctx, 2, 2, w - 4, d - 4, 1, null, alpha(shade(colors.accent, 0.3), 0.28), 1);
      for (const x of [10, w - 10]) {
        line(ctx, x, 2, x, d - 2, colors.accent, 2.4);
        circle(ctx, x, d / 2, 1.5, colors.accent, null);
      }
      const bookColors = ['#b46a55', '#5b7c8d', '#8f9a76', '#c2a469', '#7a6a8a'];
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = bookColors[i];
        ctx.globalAlpha = 0.75;
        ctx.fillRect(w * 0.26 + i * 4.4, d * 0.3, 3, d * 0.4);
        ctx.globalAlpha = 1;
      }
      circle(ctx, w * 0.72, d * 0.5, 3.4, alpha('#f1efe8', 0.9), alpha('#5a5346', 0.3), 1);
    },
  },
  {
    id: 'estante-cubos',
    name: 'Estante de cubos',
    category: 'armarios',
    w: 120,
    d: 34,
    keywords: ['estante', 'cubos', 'escritorio', 'livros', 'prateleira'],
    colors: { main: '#e6e0d3', accent: '#c19a6b' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'paint' },
      { key: 'accent', label: 'Nichos', palette: 'wood' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 2, colors.main, alpha('#3a2a1c', 0.42), 1.6);
      box(ctx, 3, 3, w - 6, d - 6, 1, alpha(shade(colors.main, -0.08), 0.5), null);
      const cols = 3;
      for (let i = 1; i < cols; i++) {
        line(ctx, (w / cols) * i, 2, (w / cols) * i, d - 2, alpha('#3a2a1c', 0.34), 1.5);
      }
      line(ctx, 2, d / 2, w - 2, d / 2, alpha('#3a2a1c', 0.34), 1.5);
      const bookColors = ['#b46a55', '#5b7c8d', '#8f9a76', '#c2a469'];
      let k = 0;
      for (let i = 0; i < cols; i++) {
        if (i === 1) continue;
        for (let j = 0; j < 3; j++) {
          ctx.fillStyle = bookColors[k % bookColors.length];
          ctx.globalAlpha = 0.7;
          ctx.fillRect((w / cols) * i + 9 + j * 4.2, 6, 2.8, d / 2 - 9);
          ctx.globalAlpha = 1;
          k++;
        }
      }
      box(ctx, w / 3 + 8, d / 2 + 5, w / 3 - 16, d / 2 - 10, 1.4, alpha(colors.accent, 0.35), null);
    },
  },
  {
    id: 'rack-painel-grande',
    name: 'Rack com painel grande',
    category: 'armarios',
    w: 220,
    d: 48,
    keywords: ['rack', 'painel', 'ripado', 'tv', 'sala', 'hack'],
    colors: { main: '#c19a6b', accent: '#efeae1' },
    colorKeys: [
      { key: 'main', label: 'Madeira', palette: 'wood' },
      { key: 'accent', label: 'Rack', palette: 'paint' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 3, colors.main, alpha('#2c2014', 0.42), 1.5);
      for (let x = 6; x < w - 4; x += 8) {
        line(ctx, x, 3, x, d - 3, alpha('#2c2014', 0.28), 1.4);
      }
      box(ctx, 4, d * 0.42, w - 8, d * 0.5, 3, colors.accent, alpha('#2c2014', 0.4), 1.5);
      grain(ctx, 6, d * 0.42 + 2, w - 12, d * 0.5 - 4, colors.accent, 10);
      const mid = w / 2;
      box(ctx, mid - 46, d * 0.46, 44, d * 0.42, 2, null, alpha('#2c2014', 0.3), 1.2);
      box(ctx, mid + 2, d * 0.46, 44, d * 0.42, 2, null, alpha('#2c2014', 0.3), 1.2);
      box(ctx, 12, d * 0.48, 26, 12, 2, alpha(colors.main, 0.5), null);
      box(ctx, w - 44, d * 0.56, 30, 10, 2, alpha(colors.main, 0.45), null);
    },
  },
  {
    id: 'rack-medio',
    name: 'Rack médio retrô',
    category: 'armarios',
    w: 140,
    d: 44,
    keywords: ['rack', 'medio', 'retro', 'tv', 'sala', 'pes-palito'],
    colors: { main: '#b9834f', accent: '#3b3f45' },
    colorKeys: [
      { key: 'main', label: 'Madeira', palette: 'wood' },
      { key: 'accent', label: 'Detalhe', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 2, w, d - 4, 3, colors.main, alpha('#2c2014', 0.42), 1.5);
      grain(ctx, 2, 4, w - 4, d - 8, colors.main, 11);
      const mid = w / 2;
      line(ctx, mid - 22, 4, mid - 22, d - 4, alpha('#2c2014', 0.35), 1.4);
      line(ctx, mid + 22, 4, mid + 22, d - 4, alpha('#2c2014', 0.35), 1.4);
      box(ctx, mid - 18, 8, 36, d - 18, 2, null, alpha('#2c2014', 0.3), 1.2);
      box(ctx, 10, 7, w * 0.22, d - 16, 2, alpha('#ffffff', 0.14), null);
      box(ctx, w - 10 - w * 0.22, 7, w * 0.22, d - 16, 2, alpha('#ffffff', 0.14), null);
      for (const [x, y] of [
        [10, 6],
        [w - 10, 6],
        [10, d - 6],
        [w - 10, d - 6],
      ]) {
        circle(ctx, x, y, 2.6, shade(colors.main, -0.3), alpha('#241c14', 0.35), 1);
      }
    },
  },
];
