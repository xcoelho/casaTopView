import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle, shade } from '../../catalog/draw';

export default {
  id: 'vaso-coqueiro',
  name: 'Vaso com coqueiro',
  category: 'decoracao',
  w: 150,
  d: 150,
  keywords: ['vaso', 'coqueiro', 'palmeira', 'planta', 'folhas', 'tropical'],
  colors: { main: '#a8623f', accent: '#3f7d3a' },
  colorKeys: [
    { key: 'main', label: 'Vaso', palette: 'paint' },
    { key: 'accent', label: 'Folhas', palette: 'plant' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    const R = Math.min(w, d) / 2 - 3;
    const potR = R * 0.37;
    circle(ctx, cx, cy, potR, colors.main, alpha('#4c2c1c', 0.5));
    circle(ctx, cx, cy, potR - 4, shade(colors.main, -0.18), null);
    circle(ctx, cx, cy, potR - 7, '#4a3826', null);
    const n = 9;
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + 0.25;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.ellipse(R * 0.58, 0, R * 0.4, R * 0.12, 0, 0, Math.PI * 2);
      ctx.fillStyle = alpha(colors.accent, 0.92);
      ctx.fill();
      ctx.strokeStyle = shade(colors.accent, -0.25);
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(potR * 0.3, 0);
      ctx.lineTo(R * 0.96, 0);
      ctx.strokeStyle = shade(colors.accent, -0.35);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.lineWidth = 0.7;
      for (let t = 0.32; t < 0.95; t += 0.09) {
        const x = R * t;
        const half = R * 0.12 * Math.sin((Math.PI * (t - 0.18)) / 0.8);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - R * 0.05, half);
        ctx.moveTo(x, 0);
        ctx.lineTo(x - R * 0.05, -half);
        ctx.stroke();
      }
      ctx.restore();
    }
    circle(ctx, cx, cy, 4.5, shade(colors.accent, -0.3), null);
    circle(ctx, cx - 5, cy + 3, 2.6, '#7a5a3a', null);
    circle(ctx, cx + 4, cy + 5, 2.6, '#7a5a3a', null);
    circle(ctx, cx + 1, cy - 6, 2.6, '#7a5a3a', null);
  },
} satisfies FurnitureDef;
