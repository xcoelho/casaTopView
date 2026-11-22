import type { FloorKey } from '../core/document';

const FLOOR_KEYS: Record<string, FloorKey> = {
  'piso-madeira': 'madeira',
  'piso-porcelanato': 'porcelanato',
  'piso-ceramica': 'ceramica',
  'piso-concreto': 'concreto',
  'piso-carpete': 'carpete',
  'piso-grama': 'grama',
};

/** Converte o id de uma definição de piso (piso-madeira…) no piso do documento. */
export function floorKeyForPisoDef(defId: string): FloorKey | undefined {
  return FLOOR_KEYS[defId];
}
