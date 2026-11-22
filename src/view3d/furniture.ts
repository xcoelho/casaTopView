/** Constrói itens 3D usando o model.ts de cada pacote em ../furniture/<id>/. */
import * as THREE from 'three';
import type { Item } from '../core/document';
import { getDef } from '../catalog/registry';
import { getFurnitureModel } from './modelRegistry';
import { shade } from '../catalog/draw';
import { WALL_HEIGHT } from '../core/constants';
import { generic, itemElevation, itemHeight, type Palette } from './modelShared';
import type { ModelBuildContext } from './modelApi';

export { clampElevation, defaultElevation, isElevatable, itemElevation, itemHeight, maxElevation } from './modelShared';
export type { ModelSize, Palette } from './modelShared';


export function buildFurniture(item: Item): THREE.Group {
  const group = new THREE.Group();
  const elevation = itemElevation(item);
  group.position.set(item.x, elevation, item.y);
  group.rotation.y = -item.rot * Math.PI / 180;
  group.userData.itemId = item.id;

  const { height } = itemHeight(item.defId);
  const main = item.colors.main ?? '#c9a37a';
  const accent = item.colors.accent ?? shade(main, 0.14);
  const palette: Palette = {
    id: item.defId, w: item.w, d: item.d, h: height, base: elevation,
    ceil: WALL_HEIGHT - elevation, main, accent,
    dark: shade(main, -0.16), light: shade(main, 0.1),
    metal: item.colors.metal ?? accent,
  };

  const body = new THREE.Group();
  group.add(body);
  const model = getFurnitureModel(item.defId);
  if (model?.build) {
    const context: ModelBuildContext = { body, palette, item, main, height };
    model.build(context);
  } else {
    generic(body, palette, getDef(item.defId)?.category ?? 'decoracao');
  }
  return group;
}
