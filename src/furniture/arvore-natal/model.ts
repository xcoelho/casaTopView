import type { ModelBuildContext } from '../../view3d/modelApi';
import { coneAt, cylinderAt, sphereAt, tubeAt } from '../../view3d/modelApi';

export const modelId = 'arvore-natal';
export const modelHeight = 210;
export const modelBase = 0;

const rnd = (i: number): number => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export function build({ body, palette }: ModelBuildContext): void {
  const { w, d, h, main, accent, metal } = palette;
  const R = Math.min(w, d) / 2;
  const k = h / 210;

  cylinderAt(body, R * 0.27, 20 * k, 0, 0, 0, '#8a2f2f', 1, 'ceramic');
  cylinderAt(body, R * 0.07, 34 * k, 0, 0, 16 * k, '#6d4c33', 1, 'wood');

  const layers = [
    { y: 24, hh: 56, rb: 1.0, rt: 0.13 },
    { y: 62, hh: 52, rb: 0.84, rt: 0.11 },
    { y: 98, hh: 48, rb: 0.67, rt: 0.09 },
    { y: 132, hh: 44, rb: 0.5, rt: 0.07 },
    { y: 164, hh: 38, rb: 0.34, rt: 0.0 },
  ];
  for (const L of layers) {
    coneAt(body, L.rt * R, L.rb * R, L.hh * k, 0, 0, L.y * k, main, 1, 'foliage', 26);
  }

  const radiusAt = (ycm: number): number => {
    let r = 0.05;
    for (const L of layers) {
      if (ycm >= L.y && ycm <= L.y + L.hh) {
        const t = (ycm - L.y) / L.hh;
        r = Math.max(r, L.rb + (L.rt - L.rb) * t);
      }
    }
    return r * R;
  };

  for (let i = 0; i < 22; i++) {
    const L = layers[i % layers.length];
    const t = 0.12 + rnd(i) * 0.45;
    const ang = rnd(i + 9) * Math.PI * 2;
    const r = (L.rb + (L.rt - L.rb) * t) * R * 0.95;
    const y = (L.y + L.hh * t) * k;
    const col = i % 3 === 0 ? metal : i % 3 === 1 ? accent : '#e8e2d4';
    sphereAt(body, 2.6, Math.cos(ang) * r, y, Math.sin(ang) * r, col, [1, 1, 1], 'chrome');
  }

  const turns = 5.5;
  const pts: Array<[number, number, number]> = [];
  for (let i = 0; i <= 70; i++) {
    const t = i / 70;
    const ycm = 30 + t * 166;
    const rr = radiusAt(ycm) * 1.03 + 0.6;
    const ang = t * turns * Math.PI * 2;
    pts.push([Math.cos(ang) * rr, ycm * k, Math.sin(ang) * rr]);
  }
  tubeAt(body, pts, 0.7, 0, 0, 0, '#caa64e', 'metal');

  for (let i = 0; i < 16; i++) {
    const t = (i + 0.5) / 16;
    const ycm = 30 + t * 164;
    const rr = radiusAt(ycm) * 1.03 + 0.8;
    const ang = t * turns * Math.PI * 2 + 0.4;
    sphereAt(body, 1.3, Math.cos(ang) * rr, ycm * k, Math.sin(ang) * rr, '#ffd98c', [1, 1, 1], 'emissive');
  }

  const topY = 200 * k;
  coneAt(body, 0, 5.5, 6 * k, 0, 0, topY, '#f5c542', 1, 'emissive', 5);
  coneAt(body, 5.5, 0, 6 * k, 0, 0, topY - 6 * k, '#f5c542', 1, 'emissive', 5);
  sphereAt(body, 2.2, 0, topY, 0, '#fff1bd', [1, 1, 1], 'emissive');
}
