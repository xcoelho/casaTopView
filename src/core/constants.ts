/** Alturas construtivas compartilhadas entre a vista 3D e os quantitativos. */
import type { OpeningKind } from './document';

/** Altura livre do pé-direito (parede pronta), em cm. */
export const WALL_HEIGHT = 262;

export const DOOR_HEIGHT = 208;
export const GARAGE_HEIGHT = 232;
export const WINDOW_SILL = 92;
export const WINDOW_HEAD = 208;
export const PASS_HEIGHT = 226;

/** Altura livre do vão de cada tipo de abertura, em cm. */
export function openingHeight(kind: OpeningKind): number {
  switch (kind) {
    case 'vao':
      return PASS_HEIGHT;
    case 'porta-garagem':
      return GARAGE_HEIGHT;
    case 'janela':
    case 'janela-correr':
      return WINDOW_HEAD - WINDOW_SILL;
    default:
      return DOOR_HEIGHT;
  }
}
