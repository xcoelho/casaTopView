import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, grain, shade } from '../../catalog/draw';

export default {
  id: 'enfeite-peixes',
  name: 'Enfeite peixes madeira',
  category: 'decoracao',
  w: 120,
  d: 10,
  keywords: ['enfeite', 'parede', 'peixes', 'madeira', 'quadro', 'sala'],
  flat: true,
  zBias: 4,
  colors: { main: '#c19a6b' },
  colorKeys: [{ key: 'main', label: 'Madeira', palette: 'wood' }],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 2, alpha('#000000', 0.04), null);
    const fish = (cx: number, cy: number, len: number, flip: boolean) => {
      const dir = flip ? -1 : 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, len / 2, 2.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = colors.main;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx - dir * (len / 2), cy);
      ctx.lineTo(cx - dir * (len / 2 + 7), cy - 4.4);
      ctx.lineTo(cx - dir * (len / 2 + 7), cy + 4.4);
      ctx.closePath();
      ctx.fillStyle = shade(colors.main, -0.08);
      ctx.fill();
      grain(ctx, cx - len / 2, cy - 2.6, len, 5.2, colors.main, 6);
    };
    fish(w * 0.32, 3.4, 44, false);
    fish(w * 0.52, 6.6, 30, true);
    fish(w * 0.72, 3.2, 34, false);
  },
} satisfies FurnitureDef;
