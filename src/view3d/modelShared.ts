/** Modelos de móveis compostos por primitivas, com acabamentos PBR e detalhes construtivos. */
import * as THREE from 'three';
import type { CategoryId } from '../catalog/types';
import type { Item } from '../core/document';
import { WALL_HEIGHT } from '../core/constants';
import { getDef } from '../catalog/registry';
import { getFurnitureModel } from './modelRegistry';
import { floorKeyForPisoDef } from '../catalog/floors';
import { shade } from '../catalog/draw';
import {
  boxAt,
  coneAt,
  cylinderAt,
  floorSurface,
  latheAt,
  roundedBoxAt,
  sphereAt,
  torusAt,
  tubeAt,
  type MaterialKind,
} from './materials';

export const DEG = Math.PI / 180;

export const CHROME = '#c9ced3';
export const STEEL = '#b9bec4';
export const DARK_METAL = '#4b5057';
export const PORCELAIN = '#fbfaf6';
export const GLASS = '#c6e6f2';

export const CATEGORY_HEIGHT: Record<CategoryId, number> = {
  assentos: 80,
  mesas: 74,
  camas: 55,
  armarios: 170,
  cozinha: 90,
  banheiro: 72,
  eletro: 105,
  lavanderia: 90,
  decoracao: 65,
  externo: 52,
  estrutura: 210,
  aberturas: 205,
};

export interface ModelSize {
  height: number;
  base: number;
}

export function itemHeight(defId: string): ModelSize {
  const model = getFurnitureModel(defId);
  if (model?.modelHeight !== undefined) return { height: model.modelHeight, base: model.modelBase ?? 0 };
  const def = getDef(defId);
  const category = def?.category ?? 'decoracao';
  return { height: CATEGORY_HEIGHT[category], base: 0 };
}

/** Altura da base padrão do modelo, em cm. */
export function defaultElevation(defId: string): number {
  return itemHeight(defId).base;
}

/** Maior altura de base sem o topo do modelo ultrapassar o teto. */
export function maxElevation(defId: string): number {
  return Math.max(0, WALL_HEIGHT - itemHeight(defId).height);
}

/** Itens que nascem suspensos (parede ou teto) aceitam ajuste de altura. */
export function isElevatable(defId: string): boolean {
  return itemHeight(defId).base > 0;
}

/** Limita a altura da base entre o chão e o teto livre. */
export function clampElevation(value: number, defId: string): number {
  const safe = Number.isFinite(value) ? value : defaultElevation(defId);
  return Math.min(maxElevation(defId), Math.max(0, safe));
}

/** Altura efetiva da base: a escolhida no item ou a padrão do modelo. */
export function itemElevation(item: Item): number {
  return clampElevation(item.elevation ?? defaultElevation(item.defId), item.defId);
}

export type Palette = {
  w: number;
  d: number;
  h: number;
  base: number;
  ceil: number;
  main: string;
  accent: string;
  dark: string;
  light: string;
  metal: string;
  id: string;
};

export type G = THREE.Group;

/** Pseudoaleatório determinístico: dá variação sem quebrar o cache de geometria. */
export function hash(i: number): number {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
}

export function fourLegs(g: G, w: number, d: number, h: number, inset: number, top: number, bottom: number, color: string, kind: MaterialKind = 'wood'): void {
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      coneAt(g, top, bottom, h, sx * (w / 2 - inset), sz * (d / 2 - inset), 0, color, 1, kind, 12);
    }
  }
}

/** Tampo de bancada com vão real para a cuba (4 peças em volta do furo). */
export function slabWithHole(
  g: G,
  w: number,
  d: number,
  t: number,
  y: number,
  color: string,
  hole: { x: number; z: number; w: number; d: number },
  kind: MaterialKind = 'stone',
): void {
  const left = -w / 2;
  const right = w / 2;
  const front = -d / 2;
  const back = d / 2;
  const hl = hole.x - hole.w / 2;
  const hr = hole.x + hole.w / 2;
  const hf = hole.z - hole.d / 2;
  const hb = hole.z + hole.d / 2;
  if (hl - left > 0.5) boxAt(g, hl - left, d, t, (left + hl) / 2, 0, y, color, 1, 0, kind);
  if (right - hr > 0.5) boxAt(g, right - hr, d, t, (hr + right) / 2, 0, y, color, 1, 0, kind);
  if (hf - front > 0.5) boxAt(g, hole.w, hf - front, t, hole.x, (front + hf) / 2, y, color, 1, 0, kind);
  if (back - hb > 0.5) boxAt(g, hole.w, back - hb, t, hole.x, (hb + back) / 2, y, color, 1, 0, kind);
}

export function basin(
  g: G,
  w: number,
  d: number,
  depth: number,
  top: number,
  color: string,
  kind: MaterialKind = 'matte',
): void {
  const t = 1.6;
  boxAt(g, w, t, depth, 0, -d / 2, top - depth, color, 1, 0, kind);
  boxAt(g, w, t, depth, 0, d / 2, top - depth, color, 1, 0, kind);
  boxAt(g, t, d, depth, -w / 2, 0, top - depth, color, 1, 0, kind);
  boxAt(g, t, d, depth, w / 2, 0, top - depth, color, 1, 0, kind);
  boxAt(g, w, d, t, 0, 0, top - depth - t, shade(color, -0.3), 1, 0, kind);
  // Aro rebaixado que desenha o vão na bancada.
  const rim = shade(color, -0.35);
  boxAt(g, w + 2.6, 1.2, 0.8, 0, -d / 2 - 0.6, top - 0.8, rim, 1, 0, kind);
  boxAt(g, w + 2.6, 1.2, 0.8, 0, d / 2 + 0.6, top - 0.8, rim, 1, 0, kind);
  boxAt(g, 1.2, d + 2.6, 0.8, -w / 2 - 0.6, 0, top - 0.8, rim, 1, 0, kind);
  boxAt(g, 1.2, d + 2.6, 0.8, w / 2 + 0.6, 0, top - 0.8, rim, 1, 0, kind);
}

export function faucet(g: G, x: number, z: number, y: number, color: string, height = 18, reach = 10): void {
  cylinderAt(g, 2.6, 3, x, z, y, color, 1, 'chrome');
  cylinderAt(g, 1.7, height * 0.55, x, z, y + 3, color, 1, 'chrome');
  tubeAt(
    g,
    [
      [0, 0, 0],
      [0, height * 0.5, 0],
      [0, height, reach * 0.45],
      [0, height * 0.92, reach],
    ],
    1.6,
    x,
    z,
    y + 3 + height * 0.5,
    color,
    'chrome',
  );
}

export function sofa(g: G, p: Palette, seats: number, chaise: boolean): void {
  const { w, d, h, main, light, dark, accent } = p;
  const a = w / 2;
  const back = -d / 2;
  const bodyD = chaise ? Math.min(96, d * 0.6) : d;
  const cz = back + bodyD / 2;
  const arm = 15;
  const legH = 7;
  const chaiseW = chaise ? Math.min(112, w * 0.44) : 0;

  fourLegs(g, w, bodyD, legH, 10, 1.8, 2.6, dark, 'wood');
  roundedBoxAt(g, w, bodyD, 26, 0, cz, legH, dark, 3, 'fabric');
  roundedBoxAt(g, w - 4, bodyD - 4, 16, 0, cz, legH + 26, main, 4, 'fabric');
  roundedBoxAt(g, w - 26, 16, h - 46, 0, back + 9, 44, main, 6, 'fabric');

  for (const sx of [-1, 1]) {
    if (chaise && sx === 1) continue;
    roundedBoxAt(g, arm, bodyD, 24, sx * (a - arm / 2), cz, 44, main, 6.5, 'fabric');
  }

  // Costura (piping) no topo do encosto e nos braços: dá o "relevo" de estofado real.
  roundedBoxAt(g, w - 26, 8, 7, 0, back + 9, h - 8, shade(main, 0.05), 3, 'fabric');
  for (const sx of [-1, 1]) {
    if (chaise && sx === 1) continue;
    roundedBoxAt(g, arm - 2, bodyD - 4, 5, sx * (a - arm / 2), cz, 66, shade(main, 0.05), 2.4, 'fabric');
  }

  const leftEdge = -a + arm;
  const rightEdge = chaise ? a - chaiseW : a - arm;
  const cw = (rightEdge - leftEdge - 4) / seats;
  for (let i = 0; i < seats; i++) {
    const x = leftEdge + 2 + cw * (i + 0.5);
    roundedBoxAt(g, cw - 2, bodyD - 26, 12, x, cz + 5, 48, light, 4, 'fabric');
    // Costura na borda frontal de cada almofada do assento.
    roundedBoxAt(g, cw - 4, 2.2, 2.2, x, cz + 5 - (bodyD - 26) / 2 + 1.1, 52, shade(light, -0.16), 1, 'fabric');
    roundedBoxAt(g, cw - 4, 13, 27, x, back + 21, 50, light, 4.5, 'fabric', 1, 0, -0.19);
  }

  roundedBoxAt(g, 26, 9, 26, leftEdge + 26, back + 26, 58, accent, 5, 'fabric', 1, 0.32, -0.3);
  if (w > 180) {
    roundedBoxAt(g, 24, 9, 24, rightEdge - 24, back + 26, 58, accent, 5, 'fabric', 1, -0.3, -0.3);
  }

  if (chaise) {
    const extD = d - bodyD;
    const cx = a - chaiseW / 2;
    roundedBoxAt(g, chaiseW, extD + 2, 42, cx, back + bodyD + extD / 2 - 1, legH, dark, 3, 'fabric');
    roundedBoxAt(g, chaiseW - 4, extD - 2, 12, cx, back + bodyD + extD / 2, 48, light, 4, 'fabric');
  }
}

/** Rack com painel ripado e bancada suspensa, como na referência de hack. */
export function mediaWall(g: G, p: Palette, large: boolean): void {
  const { w, d, h, main, accent } = p;
  const plinth = 8;
  const panelH = large ? 150 : 0;
  if (large) {
    boxAt(g, w, 3, panelH, 0, -d / 2 + 1.5, 24, main, 1, 0, 'wood');
    const slats = Math.max(8, Math.round(w / 12));
    for (let i = 0; i < slats; i++) {
      const x = -w / 2 + 6 + (i * (w - 12)) / Math.max(slats - 1, 1);
      boxAt(g, 2.4, 1.2, panelH - 8, x, -d / 2 + 2.4, 28, shade(main, -0.14), 1, 0, 'wood');
    }
    boxAt(g, w * 0.34, 22, 3, w * 0.2, -d / 2 + 4, 128, shade(accent, -0.02), 1, 0, 'wood');
  }
  const bodyH = large ? 46 : h - plinth - 4;
  const baseY = large ? 24 : plinth;
  if (!large) {
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        coneAt(g, 1.8, 1.2, plinth, sx * (w / 2 - 10), sz * (d / 2 - 8), 0, shade(main, -0.3), 1, 'wood', 10);
      }
    }
  }
  roundedBoxAt(g, w, d, bodyH - 6, 0, 0, baseY + 3, large ? accent : main, 1.4, large ? 'paint' : 'wood');
  roundedBoxAt(g, w + 2, d + 1, 3.4, 0, 0, baseY + bodyH - 1, shade(large ? accent : main, 0.05), 1, large ? 'paint' : 'wood');
  const mid = 0;
  const nicheW = Math.min(52, w * 0.26);
  boxAt(g, 2.4, d - 8, bodyH - 14, mid - nicheW / 2, 0, baseY + 6, shade(large ? accent : main, -0.15), 1, 0, large ? 'paint' : 'wood');
  boxAt(g, 2.4, d - 8, bodyH - 14, mid + nicheW / 2, 0, baseY + 6, shade(large ? accent : main, -0.15), 1, 0, large ? 'paint' : 'wood');
  boxAt(g, nicheW - 10, d * 0.4, 5, mid, 0, baseY + 8, '#2b2f34', 1, 0, 'metal');
  boxAt(g, w - 30, d - 12, 2.2, -w / 4, 0, baseY + 6, shade(large ? accent : main, -0.08), 1, 0, large ? 'paint' : 'wood');
}

/** Closet aberto com módulos de cabide, dobrados e gavetas, por tamanho. */
export function openCloset(g: G, p: Palette, cols: number): void {
  const { w, d, h, main, accent } = p;
  const t = 3;
  const cw = (w - t * (cols + 1)) / cols;
  boxAt(g, w, d, t, 0, 0, 0, shade(main, -0.1), 1, 0, 'paint');
  boxAt(g, w, d, t, 0, 0, h - t, shade(main, 0.04), 1, 0, 'paint');
  boxAt(g, w, 1.6, h, 0, -d / 2 + 0.8, 0, shade(main, -0.18), 1, 0, 'paint');
  for (let i = 0; i <= cols; i++) {
    const x = -w / 2 + t / 2 + i * (cw + t);
    boxAt(g, t, d, h, x, 0, 0, main, 1, 0, 'paint');
  }
  const cloth = [accent, shade(accent, -0.16), shade(accent, 0.14), '#8f9a76'];
  for (let c = 0; c < cols; c++) {
    const x0 = -w / 2 + t + c * (cw + t);
    const cx = x0 + cw / 2;
    boxAt(g, cw - 8, 2, 2, cx, 0, h - 34, DARK_METAL, 1, 0, 'metal');
    const n = 4;
    const pieceW = (cw - 16) / n;
    for (let i = 0; i < n; i++) {
      const bx = x0 + 8 + i * pieceW;
      boxAt(g, pieceW - 2, 1.6, h * 0.22, bx + pieceW / 2, 0, h - 38 - h * 0.22, cloth[(c + i) % cloth.length], 1, 0, 'fabric');
    }
    boxAt(g, cw - 8, d - 8, 2.4, cx, 0, h * 0.52, shade(main, -0.06), 1, 0, 'paint');
    // gaveteira de madeira apoiada no fundo do modulo, com frentes e puxadores reais
    const towerY = t;
    const towerH = h * 0.52 - 2 - towerY;
    const drawerCount = 4;
    const gap = 2.5;
    const dh = (towerH - gap * (drawerCount - 1)) / drawerCount;
    const zf = d / 2 - 9;
    roundedBoxAt(g, cw - 2, d - 14, towerH, cx, -2, towerY, shade(main, -0.08), 1.2, 'wood');
    for (let i = 0; i < drawerCount; i++) {
      const y = towerY + i * (dh + gap);
      roundedBoxAt(g, cw - 4, 2.4, dh, cx, zf + 1.2, y, shade(main, -0.04), 1, 'wood');
      boxAt(g, cw - 12, 1, dh - 8, cx, zf + 2.55, y + 4, shade(main, -0.12), 1, 0, 'wood');
      roundedBoxAt(g, Math.min(cw * 0.26, 20), 2.4, 2.2, cx, zf + 3.6, y + dh / 2 - 1.1, DARK_METAL, 1, 'metal');
    }
  }
}

/** Lavatório suspenso com cuba de apoio e prateleira inferior. */
export function floatingVanity(g: G, p: Palette, square: boolean): void {
  const { w, d, h, main, accent, metal } = p;
  const topY = 34;
  roundedBoxAt(g, w, d, 5, 0, 0, topY, main, 1, 'stone');
  boxAt(g, w - 14, d - 14, 22, 0, 0, topY - 22, shade(main, -0.14), 1, 0, 'stone');
  boxAt(g, w - 14, d - 20, 2.4, 0, -2, topY - 23.5, shade(main, -0.2), 1, 0, 'stone');
  if (square) {
    // Cuba de apoio retangular vazada (paredes + fundo), no lugar do bloco maciço.
    basin(g, 36, 26, 13, topY + 19.6, accent, 'ceramic');
    cylinderAt(g, 2.4, 0.8, 0, 0, topY + 6.6, shade(accent, -0.45), 1, 'matte');
  } else {
    latheAt(g, [[0, 0], [15, 0], [17, 4], [17, 11], [15, 13], [13, 11], [13, 4], [0, 3]], 0, 1, topY + 5, PORCELAIN, 'ceramic', 30, 1, 0.78);
  }
  faucet(g, 0, -d * 0.3, topY + 5, metal, 17, 11);
  boxAt(g, Math.min(w * 0.2, 18), 8, 2, -w / 2 + 14, 2, topY - 14, shade(accent, 0.05), 1, 0, 'fabric');
}

export function table(g: G, p: Palette): void {
  const { w, d, h, main, dark } = p;
  fourLegs(g, w, d, h - 5, 9, 3.2, 2.2, dark, 'wood');

  boxAt(g, w - 22, 4, 7, 0, -d / 2 + 11, h - 16, dark, 1, 0, 'wood');
  boxAt(g, w - 22, 4, 7, 0, d / 2 - 11, h - 16, dark, 1, 0, 'wood');
  boxAt(g, 4, d - 22, 7, -w / 2 + 11, 0, h - 16, dark, 1, 0, 'wood');
  boxAt(g, 4, d - 22, 7, w / 2 - 11, 0, h - 16, dark, 1, 0, 'wood');

  roundedBoxAt(g, w, d, 4.5, 0, 0, h - 4.5, main, 1.2, 'wood');
}

export function roundTable(g: G, p: Palette): void {
  const { w, d, h, main, dark } = p;
  const r = Math.min(w, d) / 2;
  latheAt(
    g,
    [[0, 0], [r * 0.4, 0], [r * 0.4, 3], [r * 0.13, 6], [r * 0.1, h - 6], [0, h - 6]],
    0,
    0,
    0,
    dark,
    'wood',
    30,
  );
  latheAt(g, [[0, 0], [r - 2, 0], [r - 0.7, 1.4], [r, 3], [r, 5], [0, 5]], 0, 0, h - 5, main, 'wood', 40);
}

export function desk(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  roundedBoxAt(g, w, d, 4, 0, 0, h - 4, main, 1, 'wood');

  for (const sx of [-1, 1]) {
    boxAt(g, 4, 4, h - 4, sx * (w / 2 - 6), d / 2 - 9, 0, accent, 1, 0, 'metal');
    boxAt(g, 4, 4, h - 4, sx * (w / 2 - 6), -d / 2 + 9, 0, accent, 1, 0, 'metal');
    boxAt(g, 4, d - 14, 4, sx * (w / 2 - 6), 0, 0, accent, 1, 0, 'metal');
  }

  const unitW = Math.min(40, w * 0.3);
  const ux = w / 2 - unitW / 2 - 6;
  roundedBoxAt(g, unitW, d - 14, h - 14, ux, 0, 2, shade(main, -0.05), 1.5, 'wood');
  const dh = (h - 24) / 3 - 3;
  for (let i = 0; i < 3; i++) {
    const y = 7 + i * (dh + 4);
    boxAt(g, unitW - 4, 2, dh, ux, d / 2 - 7, y, shade(main, -0.12), 1, 0, 'wood');
    boxAt(g, unitW * 0.34, 2.6, 2, ux, d / 2 - 5.4, y + dh / 2 - 1, accent, 1, 0, 'metal');
  }
  cylinderAt(g, 2.6, 0.8, -w / 2 + 16, 0, h - 4.6, DARK_METAL, 1, 'metal');
}

export function bed(g: G, p: Palette): void {
  const { w, d, main, accent, dark } = p;
  const b = d / 2;

  fourLegs(g, w, d, 10, 9, 2.6, 3.4, dark, 'wood');
  roundedBoxAt(g, w, d - 10, 20, 0, 6, 8, main, 2.5, 'wood');
  roundedBoxAt(g, w - 6, d - 18, 20, 0, 8, 27, PORCELAIN, 4.5, 'fabric');
  // Piping da borda do colchão.
  roundedBoxAt(g, w - 4, d - 16, 2, 0, 8, 45.5, shade(PORCELAIN, -0.12), 1, 'fabric');
  roundedBoxAt(g, w - 2, d * 0.55, 9, 0, b - d * 0.275, 44, accent, 3.5, 'fabric');
  // Dobra virada do edredom na frente da cama.
  roundedBoxAt(g, w - 2, 4, 7, 0, b - d * 0.55 + 2, 47, shade(accent, 0.12), 3, 'fabric');
  roundedBoxAt(g, w - 4, 13, 10, 0, -d * 0.055, 44, shade(accent, 0.14), 3, 'fabric');

  roundedBoxAt(g, w + 6, 9, 96, 0, -b + 4, 0, main, 3, 'wood');
  roundedBoxAt(g, w - 12, 5, 74, 0, -b + 8.6, 14, accent, 3, 'fabric');
  // Capitonê: costuras verticais na cabeceira estofada.
  const tufts = Math.max(3, Math.round(w / 26));
  for (let i = 1; i < tufts; i++) {
    const x = -w / 2 + (w * i) / tufts;
    boxAt(g, 1.1, 1.4, 68, x, -b + 11.3, 16, shade(accent, -0.22), 1, 0, 'fabric');
  }

  const n = w > 130 ? 2 : 1;
  const pw = (w - 26 - (n - 1) * 8) / n;
  for (let i = 0; i < n; i++) {
    roundedBoxAt(g, pw, 30, 14, -w / 2 + 13 + pw / 2 + i * (pw + 8), -b + 34, 45, '#fffdf7', 5, 'fabric', 1, 0, -0.12);
  }

  roundedBoxAt(g, w - 4, 24, 4, 0, b - 18, 51, shade(accent, -0.12), 1.5, 'fabric');
}

export function drawers(g: G, p: Palette, count: number, withLegs = true): void {
  const { w, d, h, main, dark, accent } = p;
  const legH = withLegs ? 8 : 0;

  if (withLegs) fourLegs(g, w, d, legH, 5, 1.5, 1.9, dark, 'wood');
  roundedBoxAt(g, w, d - 3, h - legH - 4, 0, 0, legH, main, 1.6, 'wood');
  roundedBoxAt(g, w + 2, d, 4, 0, 0, h - 4, shade(main, 0.06), 1.2, 'wood');
  // Linha de recuo escura logo acima da base: separa o corpo do rodapé.
  boxAt(g, w - 6, 1.4, 2.2, 0, d / 2 - 1.4, legH + 1, shade(main, -0.5), 1, 0, 'paint');

  const gap = 2.5;
  const dh = (h - legH - 12 - gap * (count - 1)) / count;
  for (let i = 0; i < count; i++) {
    const y = legH + 4 + i * (dh + gap);
    roundedBoxAt(g, w - 8, 2.5, dh, 0, d / 2 - 1.2, y, shade(main, -0.04), 1, 'wood');
    boxAt(g, w - 16, 1, dh - 8, 0, d / 2 + 0.2, y + 4, shade(main, -0.11), 1, 0, 'wood');
    const hw = Math.min(w * 0.26, 22);
    roundedBoxAt(g, hw, 2.4, 2.2, 0, d / 2 + 0.9, y + dh / 2 - 1.1, accent, 1, 'metal');
  }
}

export function counter(g: G, p: Palette, withSink: boolean): void {
  const { w, d, h, main, accent, metal } = p;
  const plinth = 8;
  const bodyD = d - 6;
  const bodyH = h - plinth - 4;
  const sinkW = Math.min(w * 0.46, 56);
  const sinkD = d * 0.52;
  const sinkX = 0;

  boxAt(g, w - 10, d - 12, plinth, 0, 0, 0, shade(main, -0.4), 1, 0, 'paint');

  if (withSink) {
    // Corpo vazado no entorno da cuba, para o vão ficar de fato aberto.
    const hl = sinkX - sinkW / 2;
    const hr = sinkX + sinkW / 2;
    const hf = -sinkD / 2;
    const hb = sinkD / 2;
    boxAt(g, hl + w / 2, bodyD, bodyH, (-w / 2 + hl) / 2, 0, plinth, main, 1, 0, 'paint');
    boxAt(g, w / 2 - hr, bodyD, bodyH, (hr + w / 2) / 2, 0, plinth, main, 1, 0, 'paint');
    boxAt(g, sinkW, bodyD / 2 - hb, bodyH, sinkX, (hb + bodyD / 2) / 2, plinth, main, 1, 0, 'paint');
    boxAt(g, sinkW, hf + bodyD / 2, bodyH, sinkX, (-bodyD / 2 + hf) / 2, plinth, main, 1, 0, 'paint');
  } else {
    roundedBoxAt(g, w, bodyD, bodyH, 0, 0, plinth, main, 1, 'paint');
  }

  const doors = Math.max(2, Math.round(w / 55));
  const dw = (w - 4 - (doors - 1) * 2) / doors;
  for (let i = 0; i < doors; i++) {
    const x = -w / 2 + 2 + dw / 2 + i * (dw + 2);
    roundedBoxAt(g, dw, 2, h - plinth - 14, x, d / 2 - 2.4, plinth + 4, shade(main, i % 2 ? -0.04 : 0), 1, 'paint');
    boxAt(g, 16, 2.6, 2, x, d / 2 - 0.9, h - plinth - 14, metal, 1, 0, 'metal');
  }

  if (withSink) {
    slabWithHole(g, w + 3, d + 3, 4, h - 4, accent, { x: sinkX, z: 0, w: sinkW, d: sinkD }, 'stone');
    boxAt(g, w + 3, 1.6, 5, 0, -d / 2 - 0.6, h - 4, accent, 1, 0, 'stone');
    boxAt(g, w + 3, 1.4, 4.2, 0, d / 2 + 1.2, h - 4.6, shade(accent, -0.12), 1, 0, 'stone');
    basin(g, sinkW, sinkD, 16, h - 4, '#9aa3a8');
    cylinderAt(g, 3, 0.8, sinkX, 0, h - 21, '#6f7a80', 1, 'matte');
    faucet(g, sinkX, -d / 2 + 7, h - 4, metal, 20, 13);
  } else {
    roundedBoxAt(g, w + 3, d + 3, 4, 0, 0, h - 4, accent, 1, 'stone');
    boxAt(g, w + 3, 1.6, 5, 0, -d / 2 - 0.6, h - 4, accent, 1, 0, 'stone');
  }
}

export function appliance(g: G, p: Palette, dryer: boolean): void {
  const { w, d, h, main, accent } = p;
  const feet = 6;

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      boxAt(g, 4, 4, feet, sx * (w / 2 - 6), sz * (d / 2 - 6), 0, DARK_METAL, 1, 0, 'metal');
    }
  }

  roundedBoxAt(g, w, d, h - feet, 0, 0, feet, main, 2.4, 'paint');
  roundedBoxAt(g, w - 3, 2.6, h - 12, 0, d / 2 + 0.7, feet + 1, shade(main, 0.03), 1.6, 'paint');
  boxAt(g, w - 14, 1.2, 1.4, 0, d / 2 + 2.1, h - 16, shade(main, -0.2), 1, 0, 'metal');

  const doorR = Math.min(w, d) * 0.3;
  const doorY = feet + (h - feet) * 0.46;
  const ring = torusAt(g, doorR, 2.6, 0, d / 2 + 1.6, doorY, accent, 'metal', 0);
  ring.scale.set(1, 1, 0.6);
  const glass = cylinderAt(g, doorR - 1.6, 1.4, 0, d / 2 + 1.4, doorY - 0.7, dryer ? '#dfe6e8' : '#c9d6da', 0.5, 'glass');
  glass.rotation.x = Math.PI / 2;

  boxAt(g, w - 14, 2, 10, 0, d / 2 + 1.4, h - 24, '#e8e6e0', 1, 0, 'paint');
  cylinderAt(g, 4.4, 1.8, w / 2 - 13, d / 2 + 2.2, h - 21, accent, 1, 'metal');
  boxAt(g, 12, 0.8, 3, -w / 2 + 14, d / 2 + 2.1, h - 20, '#8fd3c2', 1, 0, 'emissive');
}

export function bunkBed(g: G, p: Palette, desk: boolean): void {
  const { w, d, main, accent, dark } = p;
  const b = d / 2;
  const post = 6;
  // postes nos 4 cantos
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      roundedBoxAt(g, post, post, 165, sx * (w / 2 - post / 2), sz * (b - post / 2), 0, main, 1.2, 'wood');
    }
  }
  // cabeceiras
  for (const sz of [-1, 1]) {
    roundedBoxAt(g, w, post, 34, 0, sz * (b - post / 2), 131, main, 1.2, 'wood');
  }
  // estrados, colchões e travesseiros por nível
  const levels: Array<{ y: number; withMattress: boolean }> = desk
    ? [{ y: 110, withMattress: true }]
    : [
        { y: 22, withMattress: true },
        { y: 110, withMattress: true },
      ];
  for (const lvl of levels) {
    roundedBoxAt(g, w - 4, d - 8, 10, 0, 0, lvl.y, main, 1.5, 'wood');
    if (lvl.withMattress) {
      roundedBoxAt(g, w - 10, d - 16, 18, 0, 0, lvl.y + 10, PORCELAIN, 4, 'fabric');
      roundedBoxAt(g, w - 6, d * 0.52, 9, 0, b - d * 0.26, lvl.y + 25, accent, 3.5, 'fabric');
      roundedBoxAt(g, w - 22, 28, 13, 0, -b + 26, lvl.y + 27, '#fffdf7', 5, 'fabric', 1, 0, -0.12);
    }
  }
  // guarda-corpo superior
  roundedBoxAt(g, w - 6, 3, 20, 0, b - post + 1, 126, main, 1, 'wood');
  for (const sx of [-1, 1]) {
    roundedBoxAt(g, 3, d - 20, 20, sx * (w / 2 - post + 1), 0, 126, main, 1, 'wood');
  }
  // escada tradicional: duas travessas verticais no lado direito, ligadas por 3 degraus
  const ladderX = w / 2 - 2;
  const ladderZ = b - 28;
  const railGap = 26;
  for (const sz of [-1, 1]) {
    roundedBoxAt(g, 4, 4, 122, ladderX, ladderZ + sz * (railGap / 2), 0, main, 1, 'wood');
  }
  for (const y of [28, 60, 92]) {
    roundedBoxAt(g, 4, railGap, 4, ladderX, ladderZ, y, dark, 1, 'wood');
  }
  if (desk) {
    // escrivaninha embaixo: tampo + pés + gaveta
    const deskY = 74;
    roundedBoxAt(g, w - 10, d * 0.62, 4, 0, -b + 10 + d * 0.31, deskY, main, 1, 'wood');
    for (const sx of [-1, 1]) {
      roundedBoxAt(g, 4, d * 0.58, deskY, sx * (w / 2 - 8), -b + 10 + d * 0.29, 0, dark, 1, 'wood');
    }
    roundedBoxAt(g, 30, d * 0.5, 14, w / 2 - 24, -b + 8 + d * 0.25, 46, shade(main, -0.06), 1, 'wood');
    boxAt(g, 18, 2, 2.4, w / 2 - 24, -b + 8 + d * 0.25 + d * 0.25 + 1, 52, accent, 1, 0, 'metal');
  }
}

/** Piso-item manual: plano w×d com a mesma textura do piso do ambiente. */
export function pisoItem(g: G, p: Palette, key: string): void {
  const shape = new THREE.Shape();
  shape.moveTo(-p.w / 2, -p.d / 2);
  shape.lineTo(p.w / 2, -p.d / 2);
  shape.lineTo(p.w / 2, p.d / 2);
  shape.lineTo(-p.w / 2, p.d / 2);
  shape.closePath();
  const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), floorSurface(floorKeyForPisoDef(key) ?? 'madeira'));
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = 0.8;
  mesh.receiveShadow = true;
  g.add(mesh);
}

export function plant(g: G, p: Palette, height: number): void {
  const { w, d, main, accent } = p;
  const potH = Math.min(height * 0.3, 46);
  const potR = Math.min(w, d) * 0.34;

  latheAt(
    g,
    [
      [0, 0], [potR * 0.72, 0], [potR * 0.8, potH * 0.16], [potR, potH * 0.86],
      [potR * 1.08, potH], [potR * 0.99, potH], [potR * 0.92, potH * 0.86], [0, potH * 0.86],
    ],
    0,
    0,
    0,
    main,
    'stone',
    28,
  );
  cylinderAt(g, potR * 0.9, 1.6, 0, 0, potH - 3.4, '#3d3128', 1, 'matte');

  const trunkH = height * 0.46;
  const trunk = cylinderAt(g, 1.6, trunkH, 0, 0, potH - 2, shade(accent, -0.42), 1, 'matte');
  trunk.rotation.z = 0.05;

  const count = height > 110 ? 15 : 10;
  for (let i = 0; i < count; i++) {
    const ang = i * 2.39996 + 0.4;
    const t = i / Math.max(count - 1, 1);
    const ly = potH + trunkH * (0.3 + 0.62 * t);
    const reach = potR * (1.12 - 0.34 * t) + 3;
    const len = potR * (0.64 - 0.2 * t);
    const leaf = sphereAt(
      g,
      len,
      Math.cos(ang) * reach,
      ly,
      Math.sin(ang) * reach,
      i % 3 === 0 ? shade(accent, 0.12) : accent,
      [0.44, 0.075, 1],
      'foliage',
    );
    leaf.rotation.set(-0.42 - 0.25 * (1 - t), Math.PI / 2 - ang, 0, 'YXZ');
  }
}

export function stairs(g: G, p: Palette, lShape: boolean): void {
  const { w, d, main, accent } = p;
  const total = 210;
  const tread = 3;
  const riser = shade(main, -0.16);
  const nose = shade(main, -0.34);

  const step = (x: number, z: number, sw: number, sd: number, top: number, dirX = false): void => {
    boxAt(g, sw, sd, top - tread, x, z, 0, riser, 1, 0, 'stone');
    boxAt(g, sw, sd, tread, x, z, top - tread, main, 1, 0, 'stone');
    if (dirX) boxAt(g, 1.8, sd, 1.4, x + sw / 2 - 0.9, z, top - 1.4, nose, 1, 0, 'stone');
    else boxAt(g, sw, 1.8, 1.4, x, z + sd / 2 - 0.9, top - 1.4, nose, 1, 0, 'stone');
  };

  if (!lShape) {
    const steps = Math.max(6, Math.round(d / 22));
    const stepD = d / steps;
    for (let i = 0; i < steps; i++) {
      const top = ((i + 1) * total) / steps;
      step(0, d / 2 - stepD * (i + 0.5), w, stepD, top);
    }
    const railX = -w / 2 + 3;
    for (let i = 0; i < steps; i += 2) {
      const top = ((i + 1) * total) / steps;
      cylinderAt(g, 1.4, 82, railX, d / 2 - stepD * (i + 0.5), top, accent, 1, 'metal');
    }
    tubeAt(
      g,
      [
        [railX, total / steps + 80, d / 2 - stepD * 0.5],
        [railX, total + 80, d / 2 - stepD * (steps - 0.5)],
      ],
      1.9,
      0,
      0,
      0,
      accent,
      'metal',
    );
    return;
  }

  // Escada em L: primeiro lance sobe para a esquerda, patamar no canto e segundo lance sobe em +z.
  const legX = Math.min(92, d * 0.42);
  const legZ = Math.min(92, w * 0.42);
  const stepsX = Math.max(3, Math.round((w - legX) / 20));
  const stepsZ = Math.max(3, Math.round((d - legZ) / 20));
  const rise = total / (stepsX + stepsZ);
  const landingTop = stepsX * rise;
  const stepW = (w - legX) / stepsX;
  const stepD = (d - legZ) / stepsZ;
  const zFirst = -d / 2 + legZ / 2;
  const xSecond = -w / 2 + legX / 2;

  for (let i = 0; i < stepsX; i++) {
    const top = (i + 1) * rise;
    step(w / 2 - stepW * (i + 0.5), zFirst, stepW, legZ, top, true);
  }

  boxAt(g, legX, legZ, landingTop - tread, -w / 2 + legX / 2, -d / 2 + legZ / 2, 0, riser, 1, 0, 'stone');
  boxAt(g, legX, legZ, tread, -w / 2 + legX / 2, -d / 2 + legZ / 2, landingTop - tread, main, 1, 0, 'stone');

  for (let j = 0; j < stepsZ; j++) {
    const top = landingTop + (j + 1) * rise;
    step(xSecond, -d / 2 + legZ + stepD * (j + 0.5), legX, stepD, top);
  }

  const zRail = -d / 2 + legZ - 5;
  const xRail = -w / 2 + legX - 5;
  for (let i = 0; i < stepsX; i += 2) {
    cylinderAt(g, 1.4, 82, w / 2 - stepW * (i + 0.5), zRail, (i + 1) * rise, accent, 1, 'metal');
  }
  tubeAt(
    g,
    [
      [w / 2, rise + 80, zRail],
      [-w / 2 + legX, landingTop + 80, zRail],
      [xRail, landingTop + 80, -d / 2 + legZ],
      [xRail, total + 80, d / 2],
    ],
    1.9,
    0,
    0,
    0,
    accent,
    'metal',
  );
  for (let j = 0; j < stepsZ; j += 2) {
    cylinderAt(g, 1.4, 82, xRail, -d / 2 + legZ + stepD * (j + 0.5), landingTop + (j + 1) * rise, accent, 1, 'metal');
  }
}

/** Cores das roupas penduradas, derivadas do tecido escolhido. */
export function clothColors(accent: string): string[] {
  return [accent, shade(accent, -0.18), shade(accent, 0.16), '#8f9a76', '#c07f63'];
}

/* ────────────────────────── novos móveis (qwen4) ────────────────────────── */

/** Barra reta entre dois pontos: pernas inclinadas, travessas, alças. */
export function bar(
  g: G,
  a: [number, number, number],
  b: [number, number, number],
  r: number,
  color: string,
  kind: MaterialKind = 'metal',
): void {
  tubeAt(g, [a, b], r, 0, 0, 0, color, kind);
}

/** Perna/painel inclinado no plano ZY: do pé (z = footZ, y = 0) ao topo (z = 0, y = topY). */
export function rakedLeg(
  g: G,
  tx: number,
  wz: number,
  x: number,
  footZ: number,
  topY: number,
  color: string,
  kind: MaterialKind = 'wood',
): void {
  const len = Math.hypot(footZ, topY);
  const pivot = new THREE.Group();
  pivot.position.set(x, topY / 2, footZ / 2);
  pivot.rotation.x = Math.atan2(-footZ, topY);
  g.add(pivot);
  boxAt(pivot, tx, wz, len, 0, 0, -len / 2, color, 1, 0, kind);
}

/** Garrafa torneada para o carrinho de bar e a cristaleira. */
export function bottle(g: G, x: number, z: number, y: number, h: number, r: number, color: string): void {
  latheAt(
    g,
    [[0, 0], [r, 0], [r, h * 0.5], [r * 0.9, h * 0.62], [r * 0.3, h * 0.74], [r * 0.28, h * 0.96], [r * 0.36, h], [0, h]],
    x,
    z,
    y,
    color,
    'matte',
    22,
  );
  cylinderAt(g, r * 0.38, h * 0.08, x, z, y + h, CHROME, 1, 'chrome');
}

export function wardrobe(g: G, p: Palette): void {
  const { w, d, h, main, dark, accent } = p;
  const plinth = 9;

  boxAt(g, w - 10, d - 12, plinth, 0, 0, 0, shade(main, -0.35), 1, 0, 'wood');
  roundedBoxAt(g, w, d, h - plinth, 0, 0, plinth, main, 1.2, 'wood');
  roundedBoxAt(g, w + 3, d + 2, 3, 0, 0, h - 3, shade(main, 0.05), 1, 'wood');

  const doors = w > 170 ? 4 : 2;
  const dw = (w - 4 - (doors - 1) * 2) / doors;
  for (let i = 0; i < doors; i++) {
    const x = -w / 2 + 2 + dw / 2 + i * (dw + 2);
    roundedBoxAt(g, dw, 2, h - plinth - 10, x, d / 2 + 0.6, plinth + 3, shade(main, i % 2 ? -0.02 : 0.02), 1, 'wood');
    boxAt(g, dw - 9, 1, h - plinth - 28, x, d / 2 + 1.8, plinth + 12, shade(main, -0.07), 1, 0, 'wood');
    const hx = i % 2 === 0 ? x + dw / 2 - 5 : x - dw / 2 + 5;
    boxAt(g, 2, 3.4, 26, hx, d / 2 + 2.8, h * 0.5, accent, 1, 0, 'metal');
  }
  boxAt(g, w - 10, 1.5, 1.5, 0, d / 2 + 1.7, h - 16, dark, 1, 0, 'wood');
}

export function generic(g: G, p: Palette, category: CategoryId): void {
  const { w, d, h, main, accent, dark, light } = p;
  switch (category) {
    case 'armarios':
      wardrobe(g, p);
      break;
    case 'banheiro':
      roundedBoxAt(g, w, d * 0.82, h, 0, 0, 0, PORCELAIN, 2, 'ceramic');
      latheAt(g, [[0, 0], [Math.min(w, d) * 0.24, 0], [Math.min(w, d) * 0.26, 8], [0, 8]], 0, 0, h, PORCELAIN, 'ceramic');
      break;
    case 'assentos':
      sofa(g, p, Math.max(1, Math.round(w / 90)), false);
      break;
    case 'mesas':
      table(g, p);
      break;
    case 'camas':
      bed(g, p);
      break;
    case 'eletro':
      roundedBoxAt(g, w, d, h, 0, 0, 0, '#f2f1ec', 2, 'paint');
      boxAt(g, w - 8, 2, h * 0.4, 0, d / 2 - 0.5, h * 0.3, '#dcdad3', 1, 0, 'metal');
      break;
    default:
      roundedBoxAt(g, w, d, h, 0, 0, 0, main, 1.6, 'matte');
      boxAt(g, w * 0.88, 2, 2, 0, d / 2 + 0.6, h * 0.42, accent, 1, 0, 'matte');
      boxAt(g, w * 0.6, 1.2, h * 0.3, 0, d / 2 + 0.8, h * 0.55, light, 1, 0, 'matte');
      break;
  }
}

export { THREE, WALL_HEIGHT, boxAt, coneAt, cylinderAt, floorKeyForPisoDef, floorSurface, getDef, getFurnitureModel, latheAt, roundedBoxAt, shade, sphereAt, torusAt, tubeAt };
export type { CategoryId, Item, MaterialKind };
