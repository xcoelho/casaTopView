import type { ModelBuildContext } from '../../view3d/modelApi';
import { buildArmarioParede } from '../shared/armario-parede';

export const modelId = 'armario-parede-120';
export const modelHeight = 50;
export const modelBase = 150;

export function build(ctx: ModelBuildContext): void {
  buildArmarioParede(ctx);
}
