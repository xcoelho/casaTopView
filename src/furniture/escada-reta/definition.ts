import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, line } from '../../catalog/draw';

export default {
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
} satisfies FurnitureDef;
