import type { FurnitureDef } from '../../catalog/types';
import { drawArmarioParede } from '../shared/armario-parede';

export default {
  id: 'armario-parede-120',
  name: 'Armário de parede 120',
  category: 'armarios',
  w: 120,
  d: 35,
  keywords: ['armario', 'parede', 'aereo', 'cozinha', 'suspenso', 'portas'],
  colors: { main: '#f6f3ec', accent: '#d7c4a3' },
  colorKeys: [
    { key: 'main', label: 'Portas', palette: 'paint' },
    { key: 'accent', label: 'Caixa', palette: 'wood' },
  ],
  zBias: 5,
  flat: true,
  draw: drawArmarioParede,
} satisfies FurnitureDef;
