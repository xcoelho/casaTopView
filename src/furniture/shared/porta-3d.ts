/** Posiciona folhas de porta no grupo do vão: dobradiça, lado e ângulo de abertura. */
import * as THREE from 'three';
import type { Opening } from '../../core/document';

/** Ângulo de entreabertura usado pelas portas de giro. */
export const DOOR_SWING = (62 * Math.PI) / 180;

export type LeafSide = 1 | -1;

function addLeafAt(
  group: THREE.Group,
  opening: Opening,
  hingeX: number,
  leafWidth: number,
  atEnd: boolean,
  build: (leaf: THREE.Group, leafWidth: number, side: LeafSide) => void,
): void {
  const side: LeafSide = atEnd ? -1 : 1;
  const leaf = new THREE.Group();
  leaf.position.x = hingeX;
  // O grupo do vão já acompanha a parede; aqui só entra o giro da folha.
  leaf.rotation.y = (opening.flip ? -1 : 1) * side * DOOR_SWING;
  group.add(leaf);
  build(leaf, leafWidth, side);
}

/** Folha única: abre a partir da esquerda ou da direita, conforme `opening.hinge`. */
export function addSwingLeaf(
  group: THREE.Group,
  opening: Opening,
  width: number,
  build: (leaf: THREE.Group, leafWidth: number, side: LeafSide) => void,
): void {
  const atEnd = opening.hinge === 'dir';
  addLeafAt(group, opening, atEnd ? width / 2 : -width / 2, width, atEnd, build);
}

/** Duas folhas: cada uma nasce na ponta oposta do vão. */
export function addDoubleSwingLeaves(
  group: THREE.Group,
  opening: Opening,
  width: number,
  build: (leaf: THREE.Group, leafWidth: number, side: LeafSide) => void,
): void {
  addLeafAt(group, opening, -width / 2, width / 2, false, build);
  addLeafAt(group, opening, width / 2, width / 2, true, build);
}
