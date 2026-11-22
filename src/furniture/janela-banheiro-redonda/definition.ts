import type { FurnitureDef } from '../../catalog/types';
import { WALL } from '../shared/aberturas';
import { alpha } from '../../catalog/draw';

export default {
  id: 'janela-banheiro-redonda',
  name: 'Janela alta de banheiro redonda',
  category: 'aberturas',
  w: 70,
  d: 15,
  kind: 'opening',
  opening: { kind: 'janela', width: 70 },
  keywords: ['janela', 'banheiro', 'redonda', 'óculo'],
  draw: ({ ctx, w, d }) => {
    const cx = w / 2;
    const cy = d / 2;
    const r = Math.min(w / 2 - 2, 6.5);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
    ctx.fillStyle = alpha('#cfe3e8', 0.7);
    ctx.fill();
    ctx.strokeStyle = WALL;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2, false);
    ctx.strokeStyle = alpha('#6c7b80', 0.5);
    ctx.lineWidth = 1;
    ctx.stroke();
  },
} satisfies FurnitureDef;
