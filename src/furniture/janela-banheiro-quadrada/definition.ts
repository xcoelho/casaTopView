import type { FurnitureDef } from '../../catalog/types';
import { windowSymbol } from '../shared/aberturas';
import { alpha, line } from '../../catalog/draw';

export default {
  id: 'janela-banheiro-quadrada',
  name: 'Janela alta de banheiro quadrada',
  category: 'aberturas',
  w: 80,
  d: 15,
  kind: 'opening',
  opening: { kind: 'janela-correr', width: 80 },
  keywords: ['janela', 'banheiro', 'alta', 'ventilação'],
  draw: ({ ctx, w, d }) => {
    windowSymbol(ctx, w, d, 1);
    // Peitoril alto: linha tracejada indica altura (sill elevado, vão curto)
    ctx.save();
    ctx.setLineDash([4, 3]);
    line(ctx, 0, d - 2.5, w, d - 2.5, alpha('#6c7b80', 0.75), 1.2);
    ctx.restore();
  },
} satisfies FurnitureDef;
