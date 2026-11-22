import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle } from '../../catalog/draw';

export default {
  id: 'maquina-lavar',
  name: 'Máquina de lavar',
  category: 'eletro',
  w: 62,
  d: 64,
  keywords: ['maquina', 'lavar', 'lava', 'roupa', 'lavanderia'],
  colors: { main: '#f4f1ea', accent: '#8d9498' },
  colorKeys: [
    { key: 'main', label: 'Corpo', palette: 'paint' },
    { key: 'accent', label: 'Detalhes', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    box(ctx, 0, 0, w, d, 4, colors.main, alpha('#8d9498', 0.5), 1.4);
    box(ctx, 2, 2, w - 4, 12, 2, alpha('#ffffff', 0.4), alpha('#8d9498', 0.3), 1);
    circle(ctx, w / 2, d * 0.6, Math.min(w, d) * 0.28, alpha('#d9e4e6', 0.9), colors.accent, 1.6);
    circle(ctx, w / 2, d * 0.6, Math.min(w, d) * 0.16, alpha('#b9c9cc', 0.6), alpha('#8d9498', 0.4), 1.1);
    circle(ctx, w - 12, 8, 2.2, colors.accent, null);
  },
} satisfies FurnitureDef;
