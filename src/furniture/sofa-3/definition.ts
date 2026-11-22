import type { FurnitureDef } from '../../catalog/types';
import { drawSofa } from '../shared/assentos';

export default {
  id: 'sofa-3',
  name: 'Sofá 3 lugares',
  category: 'assentos',
  w: 220,
  d: 90,
  keywords: ['sofa', 'sala', 'estar'],
  colors: { main: '#cbb79a' },
  colorKeys: [{ key: 'main', label: 'Estofado', palette: 'fabric' }],
  draw: ({ ctx, w, d, colors }) => drawSofa(ctx, w, d, colors.main, 3),
} satisfies FurnitureDef;
