import * as THREE from 'three';
import type { ModelBuildContext } from '../../view3d/modelApi';
import { cylinderAt, latheAt, roundedBoxAt, sphereAt, torusAt, tubeAt } from '../../view3d/modelApi';

export const modelId = 'vaso-coqueiro';
export const modelHeight = 185;
export const modelBase = 0;

export function build({ body, palette }: ModelBuildContext): void {
  const { w, d, h, main, accent } = palette;
  const R = Math.min(w, d) / 2;
  const k = h / 185;
  const potR = R * 0.36;
  const potH = 46 * k;

  const P = (r: number, y: number): [number, number] => [r, (y / 46) * potH];
  latheAt(
    body,
    [
      P(0, 0), P(0.62, 0), P(0.78, 3), P(0.97, 34), P(1, 42), P(1, 46),
      P(0.9, 46), P(0.88, 40), P(0, 40),
    ],
    0,
    0,
    0,
    main,
    'ceramic',
    30,
    potR,
    potR,
  );
  cylinderAt(body, potR * 0.84, 2, 0, 0, potH - 7, '#3d2f23', 1, 'matte');

  const lean = R * 0.08;
  const crownY = 148 * k;
  const trunkPts: Array<[number, number, number]> = [];
  for (let i = 0; i <= 6; i++) {
    const t = i / 6;
    trunkPts.push([lean * t * t, potH - 6 + (crownY - potH + 6) * t, 0]);
  }
  tubeAt(body, trunkPts, 4.6, 0, 0, 0, '#8a6a48', 'wood');
  for (let i = 1; i <= 6; i++) {
    const t = i / 7;
    torusAt(body, 4.8, 0.6, lean * t * t, 0, potH - 6 + (crownY - potH + 6) * t, '#75593c', 'wood');
  }

  const green = accent;
  const rib = '#' + new THREE.Color(green).multiplyScalar(0.72).getHexString();
  const crownX = lean;
  const frondLen = R * 0.8;
  const arch = (t: number): number => (24 * t * (1 - t) - 18 * t * t) * k;
  const nFronds = 8;
  for (let f = 0; f < nFronds; f++) {
    const g = new THREE.Group();
    g.position.set(crownX, crownY, 0);
    g.rotation.y = (f / nFronds) * Math.PI * 2 + 0.3;
    body.add(g);

    const pts: Array<[number, number, number]> = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      pts.push([frondLen * t, arch(t), 0]);
    }
    tubeAt(g, pts, 0.8, 0, 0, 0, rib, 'matte');

    for (let i = 0; i < 7; i++) {
      const t = 0.16 + i * 0.122;
      const x = frondLen * t;
      const y = arch(t);
      const L = frondLen * 0.34 * (1 - t * 0.55);
      for (const s of [-1, 1]) {
        roundedBoxAt(g, 2.6, L, 0.9, x - L * 0.18, s * L * 0.46, y - 0.6, green, 0.4, 'foliage', 1, s * -0.35, s * 0.3, 0);
      }
    }
  }

  for (let i = 0; i < 3; i++) {
    const g = new THREE.Group();
    g.position.set(crownX, crownY, 0);
    g.rotation.y = i * 2.1 + 0.8;
    body.add(g);
    const L = (46 + i * 6) * k;
    roundedBoxAt(g, L, 3.2, 1, L * 0.18, 0, 2 * k, green, 0.5, 'foliage', 1, 0, 0, 1.15);
  }

  for (let i = 0; i < 4; i++) {
    const ang = i * 1.7;
    sphereAt(body, 4, crownX + Math.cos(ang) * 5.5, crownY - 3 - (i % 2) * 3, Math.sin(ang) * 5.5, '#7a5a3a', [1, 1, 1], 'matte');
  }
}
