import type { OpeningBuildContext } from '../../view3d/modelApi';
import { boxAt } from '../../view3d/modelApi';
import { addSwingLeaf } from '../shared/porta-3d';

export const modelId = 'porta-pivotante';

export function buildOpening({ group, opening, width, height, color }: OpeningBuildContext): void {
  addSwingLeaf(group, opening, width, (leaf, leafWidth, side) => {
    boxAt(leaf, leafWidth - 1, 4, height - 2, (side * leafWidth) / 2, 0, 1, color, 1, 0, 'wood');
    // Puxador barra vertical.
    boxAt(leaf, 2.5, 3, 60, side * (leafWidth - 10), 0, 100, '#8a867d');
  });
}
