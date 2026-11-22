import type { FurnitureDef } from '../../catalog/types';
import { drawSofa } from '../shared/assentos';

export default {
  id: 'poltrona',
  name: 'Poltrona',
  category: 'assentos',
  w: 90,
  d: 85,
  keywords: ['poltrona', 'cadeira', 'leitura'],
  colors: { main: '#8f9a76' },
  colorKeys: [{ key: 'main', label: 'Estofado', palette: 'fabric' }],
  draw: ({ ctx, w, d, colors }) => drawSofa(ctx, w, d, colors.main, 1),
} satisfies FurnitureDef;
