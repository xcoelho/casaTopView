import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "geladeira-retro";
export const modelHeight = 152;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { CHROME, boxAt, coneAt, roundedBoxAt, shade, sphereAt, tubeAt } = shared;
  /** Geladeira retrô: corpo abaulado, puxador cromado curvo e emblema. */
  function retroFridge(g: G, p: Palette): void {
    const { w, d, h, main } = p;
    const feet = 8;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        coneAt(g, 2, 3, feet, sx * (w / 2 - 10), sz * (d / 2 - 10), 0, CHROME, 1, 'chrome', 12);
      }
    }
    const bodyH = h - feet;
    roundedBoxAt(g, w, d, bodyH, 0, 0, feet, main, 9, 'paint');
    roundedBoxAt(g, w - 6, d - 4, 10, 0, 0, h - 12, shade(main, 0.05), 5, 'paint');
  
    const doorBase = feet + 4;
    const freeH = bodyH * 0.26;
    const doorH = bodyH - freeH - 12;
    const freeBase = doorBase + doorH + 4;
    roundedBoxAt(g, w - 8, 3, doorH, 0, d / 2 + 0.4, doorBase, shade(main, 0.04), 2, 'paint');
    roundedBoxAt(g, w - 8, 3, freeH, 0, d / 2 + 0.4, freeBase, shade(main, 0.02), 2, 'paint');
    // Puxadores cromados curvos.
    tubeAt(
      g,
      [[0, 0, 0], [0, 5, 4], [0, doorH * 0.62 - 5, 4], [0, doorH * 0.62, 0]],
      1.9,
      w / 2 - 13,
      d / 2 + 2,
      doorBase + doorH * 0.18,
      CHROME,
      'chrome',
    );
    tubeAt(
      g,
      [[0, 0, 0], [0, 4, 3.4], [0, freeH * 0.5 - 4, 3.4], [0, freeH * 0.5, 0]],
      1.7,
      w / 2 - 13,
      d / 2 + 2,
      freeBase + freeH * 0.22,
      CHROME,
      'chrome',
    );
    // Emblema e dobradiças aparentes.
    boxAt(g, w * 0.26, 1, 4.5, -w * 0.1, d / 2 + 2.2, doorBase + doorH - 18, CHROME, 1, 0, 'chrome');
    sphereAt(g, 2.2, -w * 0.1, doorBase + doorH - 15.6, d / 2 + 2.6, shade(main, -0.3), [1, 1, 0.5], 'chrome');
    for (const y of [doorBase + 8, doorBase + doorH - 12]) {
      boxAt(g, 4, 3, 5, -w / 2 + 8, d / 2 + 1.6, y, CHROME, 1, 0, 'chrome');
    }
    boxAt(g, w - 14, 2, 3, 0, d / 2 + 1, feet, shade(main, -0.25), 1, 0, 'metal');
  }

  retroFridge(body, palette);
}
