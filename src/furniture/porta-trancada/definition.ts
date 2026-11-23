import type { FurnitureDef } from '../../catalog/types';
import { doorSymbol } from '../shared/aberturas';
import { alpha, line, metalBar } from '../../catalog/draw';

export default {
  id: 'porta-trancada',
  name: 'Porta trançada',
  category: 'aberturas',
  w: 90,
  d: 15,
  kind: 'opening',
  opening: { kind: 'porta', width: 90 },
  keywords: ['porta', 'trançada', 'mosaico', 'palha', 'madeira', 'entrada', 'artesanal'],
  draw: ({ ctx, w, d }) => {
    doorSymbol(ctx, w, d, false, false);
    const mid = d / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(2, mid - 3.2, w - 4, 6.4);
    ctx.clip();
    // Malha trançada nas faixas superior e inferior.
    for (let i = 1; i < 7; i++) {
      const x = 2 + ((w - 4) / 7) * i;
      line(ctx, x, mid - 3.2, x, mid + 3.2, alpha('#6b4b2d', 0.38), 0.8);
    }
    for (let i = 1; i < 3; i++) {
      const y = mid - 3.2 + (6.4 / 3) * i;
      line(ctx, 2, y, w - 2, y, alpha('#6b4b2d', 0.38), 0.8);
    }
    ctx.restore();
    metalBar(ctx, w - 10, mid - 4, 2.4, 8, '#c3c7cb', 1.2);
  },
} satisfies FurnitureDef;
