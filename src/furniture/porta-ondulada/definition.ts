import type { FurnitureDef } from '../../catalog/types';
import { doorSymbol, FRAME } from '../shared/aberturas';
import { alpha, line, metalBar } from '../../catalog/draw';

/** Mesma curva usada no modelo 3D, em fração da largura da folha. */
function seamX(t: number): number {
  return 0.47 + 0.17 * Math.sin((t - 0.05) * Math.PI * 1.1);
}

export default {
  id: 'porta-ondulada',
  name: 'Porta ondulada',
  category: 'aberturas',
  w: 90,
  d: 15,
  kind: 'opening',
  opening: { kind: 'porta', width: 90 },
  keywords: ['porta', 'ondulada', 'curva', 'ripas', 'madeira', 'entrada'],
  draw: ({ ctx, w, d }) => {
    doorSymbol(ctx, w, d, false, false);
    const mid = d / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(1, mid - 3.2, w - 2, 6.4);
    ctx.clip();
    // Veio curvo e ripas horizontais do lado direito da folha.
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const x = w * seamX(t);
      const y = mid + 3.2 - 6.4 * t;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = alpha('#5b4632', 0.62);
    ctx.lineWidth = 1.1;
    ctx.stroke();
    for (let i = 1; i <= 6; i++) {
      const t = i / 7;
      const y = mid + 3.2 - 6.4 * t;
      line(ctx, w * seamX(t), y, w - 3, y, alpha('#5b4632', 0.45), 0.8);
    }
    ctx.restore();
    metalBar(ctx, w - 10, mid - 2.5, 2.5, 5, FRAME, 1.2);
  },
} satisfies FurnitureDef;
