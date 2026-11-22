import type { FurnitureDef } from '../../catalog/types';
import { drawSofa } from '../shared/assentos';

export default {
  id: 'sofa-2',
  name: 'Sofá 2 lugares',
  category: 'assentos',
  w: 165,
  d: 88,
  keywords: ['sofa', 'sala', 'estar'],
  colors: { main: '#cbb79a' },
  colorKeys: [{ key: 'main', label: 'Estofado', palette: 'fabric' }],
  draw: ({ ctx, w, d, colors }) => drawSofa(ctx, w, d, colors.main, 2),
} satisfies FurnitureDef;
