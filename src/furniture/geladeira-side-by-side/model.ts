import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "geladeira-side-by-side";
export const modelHeight = 192;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { CHROME, DARK_METAL, boxAt, roundedBoxAt, shade } = shared;
  /** Geladeira side by side inox: duas portas verticais, dispenser e gaveta inferior. */
  function sideBySideFridge(g: G, p: Palette): void {
    const { w, d, h, main } = p;
    const feet = 5;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        boxAt(g, 5, 5, feet, sx * (w / 2 - 8), sz * (d / 2 - 8), 0, DARK_METAL, 1, 0, 'metal');
      }
    }
    roundedBoxAt(g, w, d, h - feet, 0, 0, feet, shade(main, -0.05), 2.4, 'metal');
  
    const drawerTop = feet + h * 0.32;
    const doorBase = drawerTop + 3;
    const doorH = h - doorBase - 3;
    const lw = (w - 8) * 0.42;
    const rw = w - 8 - lw - 2;
    const lx = -w / 2 + 3 + lw / 2;
    const rx = w / 2 - 3 - rw / 2;
    roundedBoxAt(g, lw, 2.6, doorH, lx, d / 2 + 0.8, doorBase, shade(main, 0.03), 1.4, 'metal');
    roundedBoxAt(g, rw, 2.6, doorH, rx, d / 2 + 0.8, doorBase, main, 1.4, 'metal');
    // Puxadores verticais no encontro das portas.
    boxAt(g, 2.6, 4.4, doorH * 0.78, lx + lw / 2 - 5, d / 2 + 3, doorBase + doorH * 0.1, CHROME, 1, 0, 'chrome');
    boxAt(g, 2.6, 4.4, doorH * 0.78, rx - rw / 2 + 5, d / 2 + 3, doorBase + doorH * 0.1, CHROME, 1, 0, 'chrome');
    // Gaveta do freezer.
    roundedBoxAt(g, w - 6, 2.6, drawerTop - feet - 4, 0, d / 2 + 0.8, feet + 2, shade(main, -0.02), 1.4, 'metal');
    boxAt(g, w * 0.5, 4, 3, 0, d / 2 + 3, drawerTop - 11, CHROME, 1, 0, 'chrome');
    // Dispenser de água e gelo.
    const dy = doorBase + doorH * 0.54;
    boxAt(g, lw * 0.68, 1.4, 30, lx, d / 2 + 2.2, dy - 15, '#2a2e33', 1, 0, 'matte');
    boxAt(g, lw * 0.5, 3.2, 2, lx, d / 2 + 2.6, dy - 16, '#5c6167', 1, 0, 'metal');
    boxAt(g, lw * 0.28, 1.2, 9, lx, d / 2 + 3, dy + 1, '#9aa3a8', 1, 0, 'metal');
    boxAt(g, lw * 0.5, 0.8, 4, lx, d / 2 + 2.8, dy + 12, '#8fd3c2', 1, 0, 'emissive');
    // Display e grade inferior.
    boxAt(g, rw * 0.38, 0.9, 5, rx + rw * 0.16, d / 2 + 2.4, doorBase + doorH - 16, '#8fd3c2', 1, 0, 'emissive');
    boxAt(g, w - 10, 1.6, 4, 0, d / 2 + 1, feet, '#7d858c', 1, 0, 'metal');
  }

  sideBySideFridge(body, palette);
}
