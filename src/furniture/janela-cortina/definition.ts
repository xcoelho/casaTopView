import type { FurnitureDef } from '../../catalog/types';
import { windowSymbol } from '../shared/aberturas';
import { alpha, box } from '../../catalog/draw';

export default {
  id: 'janela-cortina',
  name: 'Janela com cortina',
  category: 'aberturas',
  w: 160,
  d: 15,
  kind: 'opening',
  opening: { kind: 'janela', width: 160 },
  keywords: ['janela', 'cortina', 'tecido', 'sala', 'quarto'],
  draw: ({ ctx, w, d }) => {
    windowSymbol(ctx, w, d, 2);
    // Laterais de cortina (faixas verticais)
    box(ctx, 0, 0, 14, d, 0, alpha('#7a5c48', 0.55), alpha('#7a5c48', 0.85), 1);
    box(ctx, w - 14, 0, 14, d, 0, alpha('#7a5c48', 0.55), alpha('#7a5c48', 0.85), 1);
  },
} satisfies FurnitureDef;
