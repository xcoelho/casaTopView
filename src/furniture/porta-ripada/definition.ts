import type { FurnitureDef } from '../../catalog/types';
import { doorSymbol } from '../shared/aberturas';
import { alpha, box, line, metalBar } from '../../catalog/draw';

const DARK_METAL = '#3b4044';

export default {
  id: 'porta-ripada',
  name: 'Porta ripada com puxador',
  category: 'aberturas',
  w: 110,
  d: 15,
  kind: 'opening',
  opening: { kind: 'porta', width: 110 },
  keywords: ['porta', 'ripada', 'ripas', 'metal', 'moderna', 'entrada', 'pivotante'],
  draw: ({ ctx, w, d }) => {
    doorSymbol(ctx, w, d, false, false);
    const mid = d / 2;
    // Moldura metálica escura e ripas horizontais vazadas na folha.
    box(ctx, 2, mid - 3.4, w - 4, 6.8, 0, null, DARK_METAL, 1.3);
    for (let i = 1; i <= 5; i++) {
      const y = mid - 3.4 + (6.8 / 6) * i;
      line(ctx, 4, y, w - 4, y, alpha(DARK_METAL, 0.5), 0.9);
    }
    metalBar(ctx, w - 11, mid - 4, 2.5, 8, DARK_METAL, 1.2);
  },
} satisfies FurnitureDef;
