/** API pública para módulos de modelos 3D individuais. */
import type * as THREE from 'three';
import type { Item } from '../core/document';
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
