import type { FurnitureDef } from '../types';
import { alpha, box, circle, glass, line, shade } from '../draw';

export const banheiro: FurnitureDef[] = [
  {
    id: 'vaso',
    name: 'Vaso sanitário',
    category: 'banheiro',
    w: 40,
    d: 66,
    keywords: ['vaso', 'sanitario', 'banheiro', 'wc'],
    colors: { main: '#f7f7f4' },
    colorKeys: [{ key: 'main', label: 'Louça', palette: 'paint' }],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 4, 2, w - 8, 16, 3, colors.main, alpha('#8d9498', 0.55), 1.4);
      ctx.beginPath();
      ctx.ellipse(w / 2, d * 0.62, w / 2 - 4, d * 0.32, 0, 0, Math.PI * 2);
      ctx.fillStyle = colors.main;
      ctx.fill();
      ctx.strokeStyle = alpha('#8d9498', 0.6);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(w / 2, d * 0.62, w / 2 - 10, d * 0.22, 0, 0, Math.PI * 2);
      ctx.strokeStyle = alpha('#8d9498', 0.35);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      circle(ctx, w / 2, 10, 2.2, alpha('#8d9498', 0.6), null);
    },
  },
  {
    id: 'lavatorio',
    name: 'Lavatório com gabinete',
    category: 'banheiro',
    w: 90,
    d: 50,
    keywords: ['lavatorio', 'pia', 'banheiro', 'cuba'],
    colors: { main: '#e6e0d3', accent: '#f7f7f4', metal: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Gabinete', palette: 'paint' },
      { key: 'accent', label: 'Louça', palette: 'paint' },
      { key: 'metal', label: 'Torneira', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 3, colors.main, alpha('#5a5346', 0.35), 1.4);
      box(ctx, 3, 3, w - 6, d - 6, 3, colors.accent, alpha('#8d9498', 0.4), 1.3);
      ctx.beginPath();
      ctx.ellipse(w / 2, d / 2 + 2, w / 2 - 16, d / 2 - 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#fbfbf8';
      ctx.fill();
      ctx.strokeStyle = alpha('#8d9498', 0.5);
      ctx.lineWidth = 1.4;
      ctx.stroke();
      circle(ctx, w / 2, 8, 3.6, colors.metal, alpha('#4b5056', 0.4), 1.1);
      line(ctx, w / 2, 9, w / 2, 16, colors.metal, 2.4);
    },
  },
  {
    id: 'banheira',
    name: 'Banheira',
    category: 'banheiro',
    w: 170,
    d: 78,
    keywords: ['banheira', 'banho', 'banheiro'],
    colors: { main: '#f7f7f4', accent: '#cdd6d8' },
    colorKeys: [
      { key: 'main', label: 'Louça', palette: 'paint' },
      { key: 'accent', label: 'Água', palette: 'glass' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 16, colors.main, alpha('#8d9498', 0.55), 1.7);
      box(ctx, 7, 7, w - 14, d - 14, 13, alpha(colors.accent, 0.55), alpha('#8d9498', 0.4), 1.3);
      circle(ctx, w - 22, d / 2, 3.2, alpha('#8d9498', 0.7), null);
      circle(ctx, 22, d / 2, 4, colors.accent, alpha('#4b5056', 0.35), 1.1);
    },
  },
  {
    id: 'box',
    name: 'Box de chuveiro',
    category: 'banheiro',
    w: 90,
    d: 90,
    keywords: ['box', 'chuveiro', 'banheiro', 'ducha'],
    colors: { main: '#eef1f1', accent: '#cfe3e8' },
    colorKeys: [
      { key: 'main', label: 'Piso', palette: 'paint' },
      { key: 'accent', label: 'Vidro', palette: 'glass' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 2, alpha(colors.main, 0.85), alpha('#8d9498', 0.4), 1.4);
      for (let i = 1; i < 6; i++) {
        line(ctx, (w / 6) * i, 3, (w / 6) * i, d - 3, alpha('#8d9498', 0.16), 1);
      }
      circle(ctx, w / 2, d / 2, 5, alpha('#8d9498', 0.4), alpha('#8d9498', 0.5), 1.2);
      glass(ctx, 1.5, 1.5, w - 3, 3, colors.accent);
      glass(ctx, 1.5, 1.5, 3, d - 3, colors.accent);
    },
  },
  {
    id: 'espelho',
    name: 'Espelho',
    category: 'banheiro',
    w: 70,
    d: 6,
    keywords: ['espelho', 'banheiro'],
    flat: true,
    zBias: 4,
    colors: { main: '#cfe3e8' },
    colorKeys: [{ key: 'main', label: 'Reflexo', palette: 'glass' }],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 2, alpha(colors.main, 0.8), alpha('#6c7b80', 0.5), 1.2);
      line(ctx, w * 0.25, d - 1, w * 0.4, 1, alpha('#ffffff', 0.85), 1.4);
      line(ctx, w * 0.55, d - 1, w * 0.7, 1, alpha('#ffffff', 0.6), 1.1);
    },
  },
  {
    id: 'lavatorio-suspenso-quadrado',
    name: 'Lavatório suspenso quadrado',
    category: 'banheiro',
    w: 90,
    d: 50,
    keywords: ['lavatorio', 'pia', 'suspenso', 'quadrado', 'cuba preta', 'prateleira'],
    colors: { main: '#eeeee9', accent: '#33373c', metal: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Bancada', palette: 'stone' },
      { key: 'accent', label: 'Cuba', palette: 'paint' },
      { key: 'metal', label: 'Torneira', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, colors.main, alpha('#5a5346', 0.35), 1.5);
      box(ctx, 4, 4, w - 8, d - 8, 3, null, alpha('#ffffff', 0.35), 1);
      box(ctx, w / 2 - 20, 10, 40, 24, 3, colors.accent, alpha('#14171b', 0.45), 1.4);
      box(ctx, w / 2 - 16, 14, 32, 16, 2, shade(colors.accent, 0.15), null);
      circle(ctx, w / 2, 6, 3.2, colors.metal, alpha('#4b5056', 0.4), 1.1);
      line(ctx, w / 2, 7, w / 2, 12, colors.metal, 2.2);
      box(ctx, 10, d - 12, w - 20, 6, 2, alpha(shade(colors.main, -0.12), 0.7), null);
      box(ctx, w - 26, d - 9, 12, 3, 1.4, alpha(colors.accent, 0.5), null);
    },
  },
  {
    id: 'lavatorio-suspenso-redondo',
    name: 'Lavatório suspenso redondo',
    category: 'banheiro',
    w: 90,
    d: 52,
    keywords: ['lavatorio', 'pia', 'suspenso', 'redondo', 'espelho', 'gabinete'],
    colors: { main: '#3b3f45', accent: '#f7f7f4', metal: '#b8bcc1' },
    colorKeys: [
      { key: 'main', label: 'Gabinete', palette: 'paint' },
      { key: 'accent', label: 'Louça', palette: 'paint' },
      { key: 'metal', label: 'Torneira', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 3, colors.main, alpha('#14171b', 0.45), 1.5);
      line(ctx, 4, d * 0.55, w - 4, d * 0.55, alpha('#ffffff', 0.18), 1.2);
      box(ctx, w / 2 - 24, 8, 48, 26, 10, colors.accent, alpha('#8d9498', 0.5), 1.5);
      ctx.beginPath();
      ctx.ellipse(w / 2, 21, 18, 9, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#fbfbf8';
      ctx.fill();
      ctx.strokeStyle = alpha('#8d9498', 0.4);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      circle(ctx, w / 2, 5, 3, colors.metal, alpha('#4b5056', 0.4), 1);
      box(ctx, w / 2 - 14, d - 8, 28, 3, 1.2, alpha(colors.metal, 0.7), null);
    },
  },
  {
    id: 'espelho-quadrado-led',
    name: 'Espelho quadrado com LED',
    category: 'banheiro',
    w: 80,
    d: 7,
    keywords: ['espelho', 'quadrado', 'led', 'banheiro', 'iluminado'],
    flat: true,
    zBias: 4,
    colors: { main: '#cfe3e8', accent: '#fff3cf' },
    colorKeys: [
      { key: 'main', label: 'Reflexo', palette: 'glass' },
      { key: 'accent', label: 'LED', palette: 'paint' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 2, colors.accent, alpha('#c2a469', 0.6), 1.6);
      box(ctx, 2.5, 1.5, w - 5, d - 3, 1.4, alpha(colors.main, 0.9), alpha('#6c7b80', 0.5), 1.2);
      line(ctx, w * 0.3, d - 1.4, w * 0.45, 1.6, alpha('#ffffff', 0.9), 1.4);
      line(ctx, w * 0.6, d - 1.4, w * 0.72, 1.6, alpha('#ffffff', 0.6), 1.1);
    },
  },
  {
    id: 'espelho-redondo-pendente',
    name: 'Espelho redondo pendente',
    category: 'banheiro',
    w: 62,
    d: 8,
    keywords: ['espelho', 'redondo', 'pendente', 'banheiro', 'alca couro'],
    flat: true,
    zBias: 4,
    colors: { main: '#cfe3e8', accent: '#3b3f45' },
    colorKeys: [
      { key: 'main', label: 'Reflexo', palette: 'glass' },
      { key: 'accent', label: 'Alça', palette: 'paint' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 2, alpha(colors.main, 0.85), alpha('#6c7b80', 0.5), 1.2);
      circle(ctx, w / 2, d / 2, 2.2, colors.accent, null);
      line(ctx, w * 0.3, d - 1, w * 0.44, 1, alpha('#ffffff', 0.85), 1.3);
      line(ctx, w * 0.58, d - 1, w * 0.7, 1, alpha('#ffffff', 0.55), 1);
      box(ctx, w / 2 - 7, 1, 14, d - 2, 1, colors.accent, null);
    },
  },
];
