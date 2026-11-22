import type { FurnitureDef } from '../../catalog/types';
import { doorSymbol, FRAME } from '../shared/aberturas';
import { metalBar } from '../../catalog/draw';

export default {
  id: 'porta-pivotante',
  name: 'Porta pivotante com puxador barra',
  category: 'aberturas',
  w: 100,
  d: 15,
  kind: 'opening',
  opening: { kind: 'porta', width: 100 },
  keywords: ['porta', 'pivotante', 'barra', 'entrada', 'hall'],
  draw: ({ ctx, w, d }) => {
    doorSymbol(ctx, w, d, false, false);
    // Puxador barra vertical no vão da porta (metalBar vertical).
    metalBar(ctx, w - 10, d / 2 - 4.5, 3, 9, FRAME, 1.4);
  },
} satisfies FurnitureDef;
