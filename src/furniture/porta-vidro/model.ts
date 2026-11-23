import type { OpeningBuildContext } from '../../view3d/modelApi';
import { boxAt } from '../../view3d/modelApi';
import { addSwingLeaf } from '../shared/porta-3d';

export const modelId = 'porta-vidro';

export function buildOpening({ group, opening, width, height, color, glass }: OpeningBuildContext): void {
  addSwingLeaf(group, opening, width, (leaf, leafWidth, side) => {
    const handle = '#8a867d';
    boxAt(leaf, leafWidth - 10, 2, height - 12, (side * leafWidth) / 2, 0, 6, glass, 0.5, 0, 'glass');
    // Moldura de madeira nas bordas: dois montantes e duas travessas.
    boxAt(leaf, 5, 5, height - 2, side * 2.5, 0, 1, color, 1, 0, 'wood');
    boxAt(leaf, 5, 5, height - 2, side * (leafWidth - 2.5), 0, 1, color, 1, 0, 'wood');
    boxAt(leaf, leafWidth - 1, 5, 6, (side * leafWidth) / 2, 0, 1, color, 1, 0, 'wood');
    boxAt(leaf, leafWidth - 1, 5, 6, (side * leafWidth) / 2, 0, height - 7, color, 1, 0, 'wood');
    // Puxador barra curto.
    boxAt(leaf, 2, 4, 30, side * (leafWidth - 10), 0, 90, handle);
  });
}
