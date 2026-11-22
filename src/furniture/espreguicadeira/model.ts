import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "espreguicadeira";
export const modelHeight = 38;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { DARK_METAL, boxAt, roundedBoxAt } = shared;
  function lounger(g: G, p: Palette): void {
    const { w, d, main, accent } = p;
    const seatY = 26;
    const railW = 5;
    const seatFront = d * 0.44;
    const seatBack = -d * 0.24;
    const seatLen = seatFront - seatBack;
  
    for (const sx of [-1, 1]) {
      boxAt(g, railW, seatLen + 6, 5, sx * (w / 2 - railW / 2), (seatFront + seatBack) / 2, seatY, main, 1, 0, 'wood');
      boxAt(g, 3, 3, seatY, sx * (w / 2 - 4), seatFront - 8, 0, DARK_METAL, 1, 0, 'metal');
      boxAt(g, 3, 3, seatY, sx * (w / 2 - 4), seatBack + 10, 0, DARK_METAL, 1, 0, 'metal');
    }
  
    const slats = 7;
    const slatD = seatLen / slats;
    for (let i = 0; i < slats; i++) {
      boxAt(g, w - 8, slatD - 1.2, 3, 0, seatBack + (i + 0.5) * slatD, seatY + 5, main, 1, 0, 'wood');
    }
  
    const back = new THREE.Group();
    back.position.set(0, seatY + 6, seatBack + 2);
    back.rotation.x = -0.98;
    g.add(back);
  
    const backLen = d * 0.5;
    const rows = 6;
    for (let i = 0; i < rows; i++) {
      boxAt(back, w - 8, 3, backLen / rows - 1.2, 0, 0, 4 + (i + 0.5) * (backLen / rows), main, 1, 0, 'wood');
    }
    for (const sx of [-1, 1]) {
      boxAt(back, 4, 4, backLen, sx * (w / 2 - 5), 0, 4 + backLen / 2, main, 1, 0, 'wood');
    }
  
    roundedBoxAt(g, w - 12, seatLen - 8, 5, 0, seatBack + 3 + (seatLen - 8) / 2, seatY + 8, accent, 2.4, 'fabric');
    roundedBoxAt(back, w - 22, 7, backLen * 0.42, 0, 4, 6 + backLen * 0.33, accent, 3, 'fabric');
  }

  lounger(body, palette);
}
