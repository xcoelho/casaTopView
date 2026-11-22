import type { FurnitureDef } from '../../catalog/types';
import { doorSymbol, FRAME } from '../shared/aberturas';
import { glass, metalBar } from '../../catalog/draw';

export default {
  id: 'porta-vidro',
  name: 'Porta de vidro com puxador',
  category: 'aberturas',
  w: 90,
  d: 15,
  kind: 'opening',
  opening: { kind: 'porta', width: 90 },
  keywords: ['porta', 'vidro', 'divisória', 'escritório', 'cozinha'],
  draw: ({ ctx, w, d }) => {
    doorSymbol(ctx, w, d, false, false);
    // Miolo de vidro azulado sobre a folha e puxador barra curto.
    glass(ctx, 6, d / 2 - 3, w - 12, 6, '#cfe3e8');
    metalBar(ctx, w - 10, d / 2 - 3, 3, 6, FRAME, 1.2);
  },
} satisfies FurnitureDef;
