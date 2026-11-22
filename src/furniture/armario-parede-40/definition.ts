import type { FurnitureDef } from '../../catalog/types';
import { drawArmarioParede } from '../shared/armario-parede';

export default {
  id: 'armario-parede-40',
  name: 'Armário de parede 40',
  category: 'armarios',
  w: 40,
  d: 35,
  keywords: ['armario', 'parede', 'aereo', 'cozinha', 'suspenso', 'porta'],
  colors: { main: '#f6f3ec', accent: '#d7c4a3' },
  colorKeys: [
    { key: 'main', label: 'Porta', palette: 'paint' },
    { key: 'accent', label: 'Caixa', palette: 'wood' },
  ],
  zBias: 5,
  flat: true,
  draw: drawArmarioParede,
} satisfies FurnitureDef;
