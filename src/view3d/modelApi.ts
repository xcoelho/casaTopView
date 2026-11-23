/** API pública para módulos de modelos 3D individuais. */
import type * as THREE from 'three';
import type { Item, Opening } from '../core/document';
import type { Palette } from './modelShared';

export { boxAt, coneAt, cylinderAt, floorSurface, latheAt, roundedBoxAt, sphereAt, torusAt, tubeAt } from './materials';
export type { MaterialKind } from './materials';
export type { Palette } from './modelShared';

export interface ModelBuildContext {
  /** Grupo local do móvel. A origem fica no centro da base, em centímetros. */
  body: THREE.Group;
  /** Dimensões, altura e acabamentos já resolvidos pelo projeto. */
  palette: Palette;
  item: Item;
  main: string;
  height: number;
}

/**
 * Contexto de uma abertura de parede. O grupo já está centrado no vão e girado
 * com a parede (+X acompanha a parede, +Y sobe, +Z atravessa a espessura).
 */
export interface OpeningBuildContext {
  group: THREE.Group;
  opening: Opening;
  /** largura livre do vão, já limitada ao comprimento da parede */
  width: number;
  /** altura livre do vão: DOOR_HEIGHT, GARAGE_HEIGHT etc. */
  height: number;
  /** espessura da parede */
  thickness: number;
  /** cor da folha escolhida no inspetor */
  color: string;
  /** cor das esquadrias */
  frame: string;
  /** cor do vidro */
  glass: string;
}

export interface OpeningModelModule {
  /** Mesmo id da definição 2D, por exemplo "porta-simples". */
  modelId: string;
  /** Constrói a folha/aro dentro do grupo do vão. */
  buildOpening?: (context: OpeningBuildContext) => void;
}

export interface FurnitureModelModule {
  /** Mesmo id da definição 2D no catálogo, por exemplo "mesa-reuniao". */
  modelId: string;
  /** Altura vertical em centímetros, opcional quando há altura por categoria. */
  modelHeight?: number;
  /** Elevação inicial da base em centímetros. Use 0 para móveis apoiados no chão. */
  modelBase?: number;
  /** Se omitido, o projeto usa o modelo genérico da categoria. */
  build?: (context: ModelBuildContext) => void;
}
