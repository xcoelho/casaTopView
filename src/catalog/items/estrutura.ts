import type { FurnitureDef } from '../types';
import { alpha, box, circle, hatch, line, shade } from '../draw';

export const estrutura: FurnitureDef[] = [
  {
    id: 'pilar',
    name: 'Pilar',
    category: 'estrutura',
    w: 30,
    d: 30,
    keywords: ['pilar', 'coluna', 'estrutura'],
    colors: { main: '#6f767e' },
    colorKeys: [{ key: 'main', label: 'Concreto', palette: 'stone' }],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 1.5, colors.main, alpha('#2a2f36', 0.5), 1.6);
      hatch(ctx, 1, 1, w - 2, d - 2, alpha('#ffffff', 0.22), 6, 1.4);
    },
  },
  {
    id: 'escada-reta',
    name: 'Escada reta',
    category: 'estrutura',
    w: 100,
    d: 260,
    keywords: ['escada', 'degrau', 'estrutura', 'subida'],
    colors: { main: '#cfc9bb', accent: '#6f767e' },
    colorKeys: [
      { key: 'main', label: 'Degraus', palette: 'stone' },
      { key: 'accent', label: 'Estrutura', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 2, alpha(colors.main, 0.75), alpha('#4a4f52', 0.4), 1.5);
      const steps = 13;
      for (let i = 1; i < steps; i++) {
        line(ctx, 2, (d / steps) * i, w - 2, (d / steps) * i, alpha('#4a4f52', 0.35), 1.3);
      }
      ctx.save();
      ctx.strokeStyle = alpha(colors.accent, 0.85);
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(w / 2, d - 24);
      ctx.lineTo(w / 2, 26);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w / 2 - 7, 34);
      ctx.lineTo(w / 2, 22);
      ctx.lineTo(w / 2 + 7, 34);
      ctx.stroke();
      ctx.restore();
      circle(ctx, w / 2, d - 26, 2.2, alpha(colors.accent, 0.8), null);
    },
  },
  {
    id: 'escada-l',
    name: 'Escada em L',
    category: 'estrutura',
    w: 210,
    d: 210,
    keywords: ['escada', 'L', 'degrau', 'estrutura'],
    colors: { main: '#cfc9bb', accent: '#6f767e' },
    colorKeys: [
      { key: 'main', label: 'Degraus', palette: 'stone' },
      { key: 'accent', label: 'Estrutura', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      const run = 90;
      box(ctx, 0, 0, w, run, 2, alpha(colors.main, 0.75), alpha('#4a4f52', 0.4), 1.5);
      box(ctx, 0, 0, run, d, 2, alpha(colors.main, 0.75), alpha('#4a4f52', 0.4), 1.5);
      const steps = 7;
      for (let i = 1; i < steps; i++) {
        line(ctx, (w / steps) * i, 2, (w / steps) * i, run - 2, alpha('#4a4f52', 0.32), 1.2);
        line(ctx, 2, (d / steps) * i, run - 2, (d / steps) * i, alpha('#4a4f52', 0.32), 1.2);
      }
      ctx.save();
      ctx.strokeStyle = alpha(colors.accent, 0.8);
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(w - 16, run / 2);
      ctx.lineTo(run / 2 + 8, run / 2);
      ctx.quadraticCurveTo(run / 2, run / 2, run / 2, run / 2 + 8);
      ctx.lineTo(run / 2, d - 18);
      ctx.stroke();
      ctx.restore();
    },
  },
];
