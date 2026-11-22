import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "poltrona-egg";
export const modelHeight = 112;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { CHROME, DARK_METAL, bar, cylinderAt, latheAt, roundedBoxAt, sphereAt } = shared;
  /** Poltrona egg: concha torneada inclinada sobre base giratória de alumínio. */
  function eggChair(g: G, p: Palette): void {
    const { w, d, h, main, light, accent } = p;
    const r = Math.min(w, d) / 2;
    const seatY = 42;
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const len = r * 0.92;
      bar(g, [0, 8, 0], [Math.cos(a) * len, 3, Math.sin(a) * len], 2.4, CHROME, 'chrome');
      sphereAt(g, 2.2, Math.cos(a) * len, 2.4, Math.sin(a) * len, DARK_METAL, [1, 1, 1], 'metal');
    }
    cylinderAt(g, 4.2, seatY - 8, 0, 0, 6, CHROME, 1, 'chrome');
    cylinderAt(g, 7, 3, 0, 0, seatY - 8, DARK_METAL, 1, 'metal');
  
    const shell = new THREE.Group();
    shell.position.set(0, seatY, -4);
    shell.rotation.x = 1.02;
    g.add(shell);
    const H = h - seatY;
    latheAt(
      shell,
      [
        [0, 0], [r * 0.5, 0], [r * 0.84, H * 0.14], [r, H * 0.46], [r * 0.97, H * 0.78],
        [r * 0.88, H], [r * 0.82, H], [r * 0.9, H * 0.76], [r * 0.93, H * 0.46],
        [r * 0.78, H * 0.16], [r * 0.46, 5], [0, 5],
      ],
      0,
      0,
      0,
      main,
      'fabric',
      36,
    );
    roundedBoxAt(shell, r * 1.5, r * 1.3, 12, 0, r * 0.1, 5, light, 5, 'fabric');
    roundedBoxAt(shell, r * 1.3, 12, r * 0.7, 0, -r * 0.5, 10, accent, 5, 'fabric', 1, 0, -0.2);
  }

  eggChair(body, palette);
}
