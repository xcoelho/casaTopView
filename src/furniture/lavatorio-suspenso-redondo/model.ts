import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "lavatorio-suspenso-redondo";
export const modelHeight = 62;
export const modelBase = 28;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { floatingVanity } = shared;

  floatingVanity(body, palette, false);
}
