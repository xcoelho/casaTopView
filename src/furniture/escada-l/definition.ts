import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, line } from '../../catalog/draw';

export default {
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
} satisfies FurnitureDef;
