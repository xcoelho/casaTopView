/** Modelos de móveis compostos por primitivas, com acabamentos PBR e detalhes construtivos. */
import * as THREE from 'three';
import type { CategoryId } from '../catalog/types';
import type { Item } from '../core/document';
import { getDef } from '../catalog/registry';
import { floorKeyForPisoDef } from '../catalog/items/pisos';
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

const DEG = Math.PI / 180;
const CEILING = 262;

const CHROME = '#c9ced3';
const STEEL = '#b9bec4';
const DARK_METAL = '#4b5057';
const PORCELAIN = '#fbfaf6';
const GLASS = '#c6e6f2';

const CATEGORY_HEIGHT: Record<CategoryId, number> = {
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

/** [altura, base] em cm para itens que fogem do padrão da categoria. */
const ITEM_HEIGHT: Record<string, [number, number?]> = {
  tapete: [2],
  'tapete-redondo': [2],
  'tapete-listrado': [2],
  'tapete-peludo': [2],
  'piso-madeira': [2],
  'piso-porcelanato': [2],
  'piso-ceramica': [2],
  'piso-concreto': [2],
  'piso-carpete': [2],
  'piso-grama': [2],
  piscina: [10],
  espelho: [72, 108],
  quadro: [80, 140],
  tv: [72, 88],
  'ar-split': [30, 208],
  pendente: [26, 192],
  coifa: [46, 152],
  'luminaria-piso': [165],
  cabeceira: [110],
  'sofa-2': [82],
  'sofa-3': [82],
  'sofa-chaise': [82],
  poltrona: [82],
  puff: [42],
  'cadeira-jantar': [92],
  'cadeira-escritorio': [112],
  banqueta: [66],
  'cama-solteiro': [52],
  'beliche-simples': [165, 0],
  'beliche-escritorio': [165, 0],
  'cama-casal': [52],
  'cama-king': [52],
  berco: [88],
  'criado-mudo': [52],
  'guarda-roupa': [226],
  comoda: [86],
  sapateira: [100],
  estante: [196],
  'nicho-quarto': [76, 92],
  'prateleira-quarto': [18, 138],
  'prateleira-cozinha': [20, 146],
  'estante-cubos': [186],
  'rack-tv': [46],
  balcao: [90],
  pia: [90],
  fogao: [90],
  geladeira: [186],
  'lava-loucas': [85],
  ilha: [92],
  vaso: [42],
  lavatorio: [86],
  banheira: [58],
  box: [205],
  'maquina-lavar': [88],
  secadora: [88],
  'mesa-jantar-4': [76],
  'mesa-jantar-6': [76],
  'mesa-redonda': [76],
  'mesa-centro': [42],
  'mesa-lateral': [56],
  'mesa-escritorio': [75],
  'mesa-l': [75],
  'mesa-varanda': [74],
  espreguicadeira: [38],
  churrasqueira: [110],
  'banco-jardim': [85],
  'planta-vaso': [80],
  'planta-grande': [150],
  lareira: [118],
  pilar: [262],
  'escada-reta': [12],
  'escada-l': [12],
  tanque: [90],
  varal: [175],
  'cesto-roupas': [58],
  'ilha-closet': [92],
  'arara-roupas': [170],
  'closet-aberto-pequeno': [212],
  'closet-aberto-medio': [212],
  'closet-aberto-grande': [212],
  'cadeira-concha': [82],
  'cadeira-executiva': [128],
  'rack-painel-grande': [185],
  'rack-medio': [64],
  'lavatorio-suspenso-quadrado': [56, 34],
  'lavatorio-suspenso-redondo': [62, 28],
  'espelho-quadrado-led': [90, 112],
  'espelho-redondo-pendente': [72, 128],
  'enfeite-peixes': [42, 140],
  'enfeite-circulos': [112, 108],
  'divisoria-plantas': [190],
  trocador: [95],
  'poltrona-amamentacao': [100],
  gaveteiro: [62],
  'quadro-branco': [100, 90],
  pergolado: [240],
  jardineira: [55],
  'geladeira-side-by-side': [192],
  'geladeira-retro': [152],
  'mesa-jantar-cavalete': [76],
  'mesa-jantar-vidro': [76],
  'mesa-tulipa': [76],
  'mesa-centro-organica': [40],
  'mesa-lateral-tambor': [55],
  'sofa-modular-l': [76],
  'poltrona-egg': [112],
  'banqueta-industrial': [92],
  'aparador-mid-century': [85],
  cristaleira: [195],
  'estante-industrial': [200],
  'carrinho-bar': [88],
};

export interface ModelSize {
  height: number;
  base: number;
}

export function itemHeight(defId: string): ModelSize {
  const override = ITEM_HEIGHT[defId];
  if (override) return { height: override[0], base: override[1] ?? 0 };
  const def = getDef(defId);
  const category = def?.category ?? 'decoracao';
  return { height: CATEGORY_HEIGHT[category], base: 0 };
}

type Palette = {
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

type G = THREE.Group;

/** Pseudoaleatório determinístico: dá variação sem quebrar o cache de geometria. */
function hash(i: number): number {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
}

function fourLegs(g: G, w: number, d: number, h: number, inset: number, top: number, bottom: number, color: string, kind: MaterialKind = 'wood'): void {
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      coneAt(g, top, bottom, h, sx * (w / 2 - inset), sz * (d / 2 - inset), 0, color, 1, kind, 12);
    }
  }
}

/** Tampo de bancada com vão real para a cuba (4 peças em volta do furo). */
function slabWithHole(
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

function basin(g: G, w: number, d: number, depth: number, top: number, color: string): void {
  const t = 1.6;
  boxAt(g, w, t, depth, 0, -d / 2, top - depth, color, 1, 0, 'matte');
  boxAt(g, w, t, depth, 0, d / 2, top - depth, color, 1, 0, 'matte');
  boxAt(g, t, d, depth, -w / 2, 0, top - depth, color, 1, 0, 'matte');
  boxAt(g, t, d, depth, w / 2, 0, top - depth, color, 1, 0, 'matte');
  boxAt(g, w, d, t, 0, 0, top - depth - t, shade(color, -0.3), 1, 0, 'matte');
  // Aro rebaixado que desenha o vão na bancada.
  const rim = shade(color, -0.35);
  boxAt(g, w + 2.6, 1.2, 0.8, 0, -d / 2 - 0.6, top - 0.8, rim, 1, 0, 'matte');
  boxAt(g, w + 2.6, 1.2, 0.8, 0, d / 2 + 0.6, top - 0.8, rim, 1, 0, 'matte');
  boxAt(g, 1.2, d + 2.6, 0.8, -w / 2 - 0.6, 0, top - 0.8, rim, 1, 0, 'matte');
  boxAt(g, 1.2, d + 2.6, 0.8, w / 2 + 0.6, 0, top - 0.8, rim, 1, 0, 'matte');
}

function faucet(g: G, x: number, z: number, y: number, color: string, height = 18, reach = 10): void {
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

function sofa(g: G, p: Palette, seats: number, chaise: boolean): void {
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

  const leftEdge = -a + arm;
  const rightEdge = chaise ? a - chaiseW : a - arm;
  const cw = (rightEdge - leftEdge - 4) / seats;
  for (let i = 0; i < seats; i++) {
    const x = leftEdge + 2 + cw * (i + 0.5);
    roundedBoxAt(g, cw - 2, bodyD - 26, 12, x, cz + 5, 48, light, 4, 'fabric');
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

function chair(g: G, p: Palette): void {
  const { w, d, h, main, accent, dark } = p;
  const a = w / 2;
  const b = d / 2;
  const seatY = 45;

  for (const sx of [-1, 1]) {
    coneAt(g, 2.0, 2.5, h - 6, sx * (a - 3.5), -b + 4, 0, main, 1, 'wood', 10);
    coneAt(g, 1.6, 2.1, seatY - 4, sx * (a - 3.5), b - 4, 0, main, 1, 'wood', 10);
  }

  roundedBoxAt(g, w - 2, d - 4, 5, 0, 1, seatY - 5, main, 1.4, 'wood');
  roundedBoxAt(g, w - 10, d - 12, 4, 0, 1, seatY, accent, 1.8, 'fabric');
  boxAt(g, w - 14, 3, 5, 0, -b + 8, seatY - 10, dark, 1, 0, 'wood');

  for (const sx of [-1, 1]) {
    boxAt(g, 3.4, 4, h - seatY - 2, sx * (a - 3.5), -b + 4, seatY - 2, main, 1, 0, 'wood');
  }
  roundedBoxAt(g, w - 8, 3.6, 10, 0, -b + 4.4, h - 16, main, 1.2, 'wood');
  for (let i = 0; i < 3; i++) {
    const x = -a + 11 + ((w - 22) * i) / 2;
    boxAt(g, 2.2, 2.2, h - seatY - 21, x, -b + 4, seatY + 6, main, 1, 0, 'wood');
  }
}

function officeChair(g: G, p: Palette, baseColor: string): void {
  const { w, d, main, accent } = p;
  const r = Math.min(w, d) / 2 - 4;

  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2;
    boxAt(g, r, 3.6, 3, (Math.cos(ang) * r) / 2, (Math.sin(ang) * r) / 2, 6, baseColor, 1, -ang, 'metal');
    sphereAt(g, 2.7, Math.cos(ang) * r, 4, Math.sin(ang) * r, DARK_METAL, [1, 1, 1], 'metal');
  }

  cylinderAt(g, 4.4, 26, 0, 0, 6, CHROME, 1, 'chrome');
  cylinderAt(g, 6, 4, 0, 0, 30, DARK_METAL, 1, 'metal');
  roundedBoxAt(g, w - 8, d - 12, 9, 0, 0, 34, main, 3.5, 'fabric');
  roundedBoxAt(g, w - 12, 8, 40, 0, -d * 0.36, 44, main, 3.5, 'fabric', 1, 0, -0.14);
  roundedBoxAt(g, w - 24, 5, 12, 0, -d * 0.31, 52, accent, 2.5, 'fabric');
  roundedBoxAt(g, w - 20, 6, 9, 0, -d * 0.38, 86, main, 3, 'fabric');

  for (const sx of [-1, 1]) {
    boxAt(g, 3.4, 10, 16, sx * (w / 2 - 4), -d * 0.1, 30, baseColor, 1, 0, 'metal');
    roundedBoxAt(g, 6, 22, 4, sx * (w / 2 - 4), -d * 0.08, 46, baseColor, 1.5, 'metal');
  }
}

function stool(g: G, p: Palette): void {
  const { w, d, main, metal } = p;
  const r = Math.min(w, d) / 2 - 2;
  latheAt(g, [[0, 0], [r - 1.6, 0], [r, 2.2], [r, 5], [0, 5]], 0, 0, 60, main, 'wood', 28);
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      coneAt(g, 1.5, 1.5, 60, sx * (r - 8), sz * (r - 8), 0, metal, 1, 'metal', 12);
    }
  }
  const ring = (r - 8) * 1.41;
  torusAt(g, ring, 0.9, 0, 0, 20, metal, 'metal');
  torusAt(g, ring, 0.9, 0, 0, 44, metal, 'metal');
}

/** Cadeira concha com pés palito de madeira, inspirada na referência. */
function shellChair(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const a = w / 2;
  const b = d / 2;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      coneAt(g, 1.7, 2.3, 45, sx * (a - 5), sz * (b - 5), 0, accent, 1, 'wood', 10);
    }
  }
  roundedBoxAt(g, w - 6, d - 6, 7, 0, 0, 44, shade(main, 0.1), 3, 'matte');
  roundedBoxAt(g, w, 4, h - 45, 0, -b + 2, 45, main, 2, 'matte');
  for (const sx of [-1, 1]) {
    roundedBoxAt(g, 4, d - 8, h - 52, sx * (a - 2), 0, 48, main, 2, 'matte');
  }
  boxAt(g, w - 22, 1.6, h - 62, 0, 1, 52, shade(main, 0.22), 0.5, 0, 'matte');
  boxAt(g, w - 26, 1.6, h - 62, -2, 1, 52, shade(main, 0.22), 0.35, 0, 'matte');
  boxAt(g, w - 26, 1.6, h - 62, 2, 1, 52, shade(main, 0.22), 0.35, 0, 'matte');
}

/** Cadeira executiva alta com apoio de pés e base de 5 rodízios. */
function executiveChair(g: G, p: Palette): void {
  const { w, d, main, accent } = p;
  const r = Math.min(w, d) / 2 - 4;
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2;
    boxAt(g, r, 3.4, 2.6, (Math.cos(ang) * r) / 2, (Math.sin(ang) * r) / 2, 5, accent, 1, -ang, 'metal');
    sphereAt(g, 2.6, Math.cos(ang) * r, 3, Math.sin(ang) * r, DARK_METAL, [1, 1, 1], 'metal');
  }
  cylinderAt(g, 4.2, 30, 0, 0, 5, CHROME, 1, 'chrome');
  roundedBoxAt(g, w - 10, d - 14, 10, 0, 0, 34, main, 3.5, 'fabric');
  roundedBoxAt(g, w - 14, 8, 52, 0, -d * 0.36, 44, main, 3.5, 'fabric', 1, 0, -0.1);
  roundedBoxAt(g, w - 22, 6, 14, 0, -d * 0.32, 56, shade(main, 0.08), 2.5, 'fabric');
  for (const sx of [-1, 1]) {
    boxAt(g, 3.2, 9, 14, sx * (w / 2 - 4), -d * 0.08, 30, accent, 1, 0, 'metal');
    roundedBoxAt(g, 5.5, 20, 3.5, sx * (w / 2 - 4), -d * 0.06, 44, accent, 1.5, 'metal');
  }
  boxAt(g, w - 24, 4, 3, 0, d * 0.3, 22, accent, 1, 0, 'metal');
  roundedBoxAt(g, w - 24, 12, 4, 0, d * 0.36, 25, shade(main, -0.05), 1.6, 'fabric');
}

/** Rack com painel ripado e bancada suspensa, como na referência de hack. */
function mediaWall(g: G, p: Palette, large: boolean): void {
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
function openCloset(g: G, p: Palette, cols: number): void {
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
    boxAt(g, cw - 16, d - 14, 14, cx, 0, h * 0.3, shade(accent, 0.06), 1, 0, 'fabric');
    boxAt(g, cw - 16, d - 14, 14, cx, 0, h * 0.16, shade(accent, -0.04), 1, 0, 'fabric');
    boxAt(g, cw * 0.4, 2, 2, cx, d / 2 - 1, h * 0.36, DARK_METAL, 1, 0, 'metal');
  }
}

/** Lavatório suspenso com cuba de apoio e prateleira inferior. */
function floatingVanity(g: G, p: Palette, square: boolean): void {
  const { w, d, h, main, accent, metal } = p;
  const topY = 34;
  roundedBoxAt(g, w, d, 5, 0, 0, topY, main, 1, 'stone');
  boxAt(g, w - 14, d - 14, 22, 0, 0, topY - 22, shade(main, -0.14), 1, 0, 'stone');
  boxAt(g, w - 14, d - 20, 2.4, 0, -2, topY - 23.5, shade(main, -0.2), 1, 0, 'stone');
  if (square) {
    boxAt(g, 36, 26, 13, 0, 1, topY + 5, accent, 1, 0, 'ceramic');
    boxAt(g, 30, 20, 2, 0, 1, topY + 14, shade(accent, 0.2), 1, 0, 'ceramic');
  } else {
    latheAt(g, [[0, 0], [15, 0], [17, 4], [17, 11], [15, 13], [13, 11], [13, 4], [0, 3]], 0, 1, topY + 5, PORCELAIN, 'ceramic', 30, 1, 0.78);
  }
  faucet(g, 0, -d * 0.3, topY + 5, metal, 17, 11);
  boxAt(g, Math.min(w * 0.2, 18), 8, 2, -w / 2 + 14, 2, topY - 14, shade(accent, 0.05), 1, 0, 'fabric');
}

/** Espelho quadrado iluminado com moldura de LED. */
function ledMirror(g: G, p: Palette): void {
  const { w, h } = p;
  boxAt(g, w, 2, h, 0, 0, 0, '#fff3cf', 1, 0, 'emissive');
  boxAt(g, w - 6, 1.2, h - 6, 0, 0.6, 3, '#cfe3e8', 1, 0, 'screen');
  boxAt(g, w - 14, 0.6, h * 0.6, -w * 0.1, 1.2, h * 0.24, '#ffffff', 0.4, 0, 'screen');
}

/** Espelho redondo com alça de couro, como na referência. */
function strapMirror(g: G, p: Palette): void {
  const { h, main, accent } = p;
  const r = Math.min(31, h * 0.24);
  boxAt(g, 3, 3, 26, 0, 0, h - 8, accent, 1, 0, 'matte');
  torusAt(g, r, 1.8, 0, 0, h - r - 18, accent, 'matte', 0, 0);
  const glass = cylinderAt(g, r - 1.4, 1, 0, 0, h - r - 18.6, main, 1, 'screen');
  glass.rotation.x = Math.PI / 2;
}

/** Enfeites de parede: peixes de madeira e círculos de metal. */
function wallFish(g: G, p: Palette): void {
  const { w, h, main } = p;
  const sizes = [44, 30, 34];
  for (let i = 0; i < 3; i++) {
    const x = -w / 2 + w * (0.28 + i * 0.22);
    const y = h * (0.5 + (i % 2 ? 0.14 : -0.06));
    const len = sizes[i];
    const fish = sphereAt(g, len / 2, x, y, 1.6, main, [1, 0.22, 0.12], 'wood');
    fish.rotation.z = i === 1 ? Math.PI : 0;
    coneAt(g, 4, 1.4, 7, x + (i === 1 ? -len / 2 : len / 2), y, 0, shade(main, -0.1), 1, 'wood', 12);
  }
}

function wallCircles(g: G, p: Palette): void {
  const { w, h, main } = p;
  for (const fx of [-0.22, 0.22]) {
    const x = w * fx;
    boxAt(g, 2.2, 1.6, h * 0.9, x, 0, h * 0.05, main, 1, 0, 'metal');
    torusAt(g, h * 0.16, 1.8, x, 0, h * 0.42, main, 'metal', 0, 0);
    torusAt(g, h * 0.1, 1.5, x, 0, h * 0.62, main, 'metal', 0, 0);
  }
  boxAt(g, 9, 1.4, 1.4, -w * 0.22, 0, h * 0.78, main, 1, 0, 'metal');
}

/** Divisória vazada de metal com vasos e orquídeas. */
function plantDivider(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const cols = 4;
  const cw = w / cols;
  for (const sx of [-1, 1]) {
    boxAt(g, 3, d, h, sx * (w / 2 - 1.5), 0, 0, main, 1, 0, 'metal');
  }
  boxAt(g, w, d, 3, 0, 0, 0, main, 1, 0, 'metal');
  boxAt(g, w, d, 3, 0, 0, h - 3, main, 1, 0, 'metal');
  for (let i = 1; i < cols; i++) {
    boxAt(g, 2.4, d, h, -w / 2 + cw * i, 0, 0, main, 1, 0, 'metal');
  }
  const rows = 3;
  for (let r = 0; r < rows; r++) {
    const y = 24 + (r * (h - 60)) / Math.max(rows - 1, 1);
    for (let c = 0; c < cols; c++) {
      if ((r + c) % 2 === 0) continue;
      const x = -w / 2 + cw * (c + 0.5);
      boxAt(g, cw - 10, d - 6, 2.4, x, 0, y, main, 1, 0, 'metal');
      cylinderAt(g, 5.5, 10, x, 0, y + 2.4, '#8a6142', 1, 'ceramic');
      sphereAt(g, 5, x, y + 16, 0, accent, [1, 0.75, 1], 'foliage');
      sphereAt(g, 3.4, x + 4, y + 19, 2, '#f1efe8', [1, 0.9, 1], 'foliage');
      sphereAt(g, 3, x - 4, y + 18, -2, shade(accent, 0.14), [1, 0.85, 1], 'foliage');
    }
  }
}

function table(g: G, p: Palette): void {
  const { w, d, h, main, dark } = p;
  fourLegs(g, w, d, h - 5, 9, 3.2, 2.2, dark, 'wood');

  boxAt(g, w - 22, 4, 7, 0, -d / 2 + 11, h - 16, dark, 1, 0, 'wood');
  boxAt(g, w - 22, 4, 7, 0, d / 2 - 11, h - 16, dark, 1, 0, 'wood');
  boxAt(g, 4, d - 22, 7, -w / 2 + 11, 0, h - 16, dark, 1, 0, 'wood');
  boxAt(g, 4, d - 22, 7, w / 2 - 11, 0, h - 16, dark, 1, 0, 'wood');

  roundedBoxAt(g, w, d, 4.5, 0, 0, h - 4.5, main, 1.2, 'wood');
}

function roundTable(g: G, p: Palette): void {
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

function coffeeTable(g: G, p: Palette): void {
  const { w, d, h, main, dark } = p;
  fourLegs(g, w, d, h - 4, 6, 1.9, 1.9, dark, 'metal');
  roundedBoxAt(g, w, d, 4, 0, 0, h - 4, main, 1.4, 'wood');
  roundedBoxAt(g, w - 4, d - 4, 1.2, 0, 0, h - 5.2, shade(main, 0.08), 1, 'wood');
  boxAt(g, w - 14, d - 14, 2.5, 0, 0, 12, shade(main, -0.1), 1, 0, 'wood');
  for (const sx of [-1, 1]) {
    boxAt(g, 2, d - 14, 1.5, sx * (w / 2 - 7), 0, 11, dark, 1, 0, 'metal');
  }
}

function sideTable(g: G, p: Palette): void {
  const { w, d, h, main, dark } = p;
  const r = Math.min(w, d) / 2;
  latheAt(g, [[0, 0], [r * 0.55, 0], [r * 0.55, 2], [r * 0.16, 4], [r * 0.13, h - 5], [0, h - 5]], 0, 0, 0, dark, 'wood', 26);
  latheAt(g, [[0, 0], [r - 1.5, 0], [r - 0.5, 1.2], [r, 2.6], [r, 4], [0, 4]], 0, 0, h - 4, main, 'wood', 36);
}

function desk(g: G, p: Palette): void {
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

function lDesk(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const t = Math.min(64, d * 0.44);
  const legH = h - 4;

  roundedBoxAt(g, w, t, 4, 0, -d / 2 + t / 2, legH, main, 1, 'wood');
  roundedBoxAt(g, t + 8, d - t, 4, -w / 2 + (t + 8) / 2, -d / 2 + t + (d - t) / 2, legH, main, 1, 'wood');

  const pts: Array<[number, number]> = [
    [-w / 2 + 9, -d / 2 + 9],
    [w / 2 - 9, -d / 2 + 9],
    [w / 2 - 9, -d / 2 + t - 9],
    [-w / 2 + 9, d / 2 - 9],
    [-w / 2 + t - 1, d / 2 - 9],
  ];
  for (const [x, z] of pts) coneAt(g, 2.4, 2.0, legH, x, z, 0, accent, 1, 'metal', 12);

  boxAt(g, w - 26, 1.6, h * 0.4, 0, -d / 2 + t - 2.5, legH - h * 0.4, shade(main, -0.08), 1, 0, 'wood');
  boxAt(g, w - 60, 2, 10, w / 2 - 40, -d / 2 + t - 4, legH - 26, accent, 1, 0, 'metal');
}

function bed(g: G, p: Palette): void {
  const { w, d, main, accent, dark } = p;
  const b = d / 2;

  fourLegs(g, w, d, 10, 9, 2.6, 3.4, dark, 'wood');
  roundedBoxAt(g, w, d - 10, 20, 0, 6, 8, main, 2.5, 'wood');
  roundedBoxAt(g, w - 6, d - 18, 20, 0, 8, 27, PORCELAIN, 4.5, 'fabric');
  roundedBoxAt(g, w - 2, d * 0.55, 9, 0, b - d * 0.275, 44, accent, 3.5, 'fabric');
  roundedBoxAt(g, w - 4, 13, 10, 0, -d * 0.055, 44, shade(accent, 0.14), 3, 'fabric');

  roundedBoxAt(g, w + 6, 9, 96, 0, -b + 4, 0, main, 3, 'wood');
  roundedBoxAt(g, w - 12, 5, 74, 0, -b + 8.6, 14, accent, 3, 'fabric');

  const n = w > 130 ? 2 : 1;
  const pw = (w - 26 - (n - 1) * 8) / n;
  for (let i = 0; i < n; i++) {
    roundedBoxAt(g, pw, 30, 14, -w / 2 + 13 + pw / 2 + i * (pw + 8), -b + 34, 45, '#fffdf7', 5, 'fabric', 1, 0, -0.12);
  }

  roundedBoxAt(g, w - 4, 24, 4, 0, b - 18, 51, shade(accent, -0.12), 1.5, 'fabric');
}

function crib(g: G, p: Palette): void {
  const { w, d, main, accent } = p;
  const railH = 80;

  roundedBoxAt(g, w, d, 10, 0, 0, 0, main, 2, 'wood');
  roundedBoxAt(g, w - 10, d - 10, 12, 0, 0, 30, accent, 3, 'fabric');

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      roundedBoxAt(g, 5, 5, railH + 6, sx * (w / 2 - 3), sz * (d / 2 - 3), 0, main, 1.4, 'wood');
    }
  }

  const rails = Math.max(5, Math.round(w / 11));
  for (let i = 0; i < rails; i++) {
    const x = -w / 2 + 7 + ((w - 14) * i) / (rails - 1);
    boxAt(g, 2.4, 3, railH - 10, x, -d / 2 + 3, 8, main, 1, 0, 'wood');
    boxAt(g, 2.4, 3, railH - 10, x, d / 2 - 3, 8, main, 1, 0, 'wood');
  }
  const sideRails = Math.max(4, Math.round(d / 16));
  for (let i = 0; i < sideRails; i++) {
    const z = -d / 2 + 9 + ((d - 18) * i) / (sideRails - 1);
    boxAt(g, 3, 2.4, railH - 10, -w / 2 + 3, z, 8, main, 1, 0, 'wood');
    boxAt(g, 3, 2.4, railH - 10, w / 2 - 3, z, 8, main, 1, 0, 'wood');
  }

  boxAt(g, w - 4, 3.4, 4, 0, -d / 2 + 3, railH + 2, main, 1, 0, 'wood');
  boxAt(g, w - 4, 3.4, 4, 0, d / 2 - 3, railH + 2, main, 1, 0, 'wood');
  boxAt(g, 3.4, d - 4, 4, -w / 2 + 3, 0, railH + 2, main, 1, 0, 'wood');
  boxAt(g, 3.4, d - 4, 4, w / 2 - 3, 0, railH + 2, main, 1, 0, 'wood');
}

function nightstand(g: G, p: Palette): void {
  const { w, d, h, main, dark, accent } = p;
  const legH = 8;

  fourLegs(g, w, d, legH, 5, 1.5, 1.9, dark, 'wood');
  roundedBoxAt(g, w, d - 3, h - legH - 4, 0, 0, legH, main, 1.6, 'wood');
  roundedBoxAt(g, w + 2, d, 4, 0, 0, h - 4, shade(main, 0.06), 1.2, 'wood');

  const gap = 2;
  const dh = (h - legH - 12 - gap) / 2;
  for (let i = 0; i < 2; i++) {
    const y = legH + 4 + i * (dh + gap);
    roundedBoxAt(g, w - 8, 2.5, dh, 0, d / 2 - 1.2, y, shade(main, i === 0 ? -0.03 : -0.06), 1, 'wood');
    boxAt(g, 13, 2.6, 2.2, 0, d / 2 + 0.8, y + dh / 2 - 1.1, accent, 1, 0, 'metal');
  }
}

function wardrobe(g: G, p: Palette): void {
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

function drawers(g: G, p: Palette, count: number, withLegs = true): void {
  const { w, d, h, main, dark, accent } = p;
  const legH = withLegs ? 8 : 0;

  if (withLegs) fourLegs(g, w, d, legH, 5, 1.5, 1.9, dark, 'wood');
  roundedBoxAt(g, w, d - 3, h - legH - 4, 0, 0, legH, main, 1.6, 'wood');
  roundedBoxAt(g, w + 2, d, 4, 0, 0, h - 4, shade(main, 0.06), 1.2, 'wood');

  const gap = 2.5;
  const dh = (h - legH - 12 - gap * (count - 1)) / count;
  for (let i = 0; i < count; i++) {
    const y = legH + 4 + i * (dh + gap);
    roundedBoxAt(g, w - 8, 2.5, dh, 0, d / 2 - 1.2, y, shade(main, -0.04), 1, 'wood');
    boxAt(g, w - 16, 1, dh - 8, 0, d / 2 + 0.2, y + 4, shade(main, -0.11), 1, 0, 'wood');
    const hw = Math.min(w * 0.26, 22);
    boxAt(g, hw, 2.6, 2.2, 0, d / 2 + 0.9, y + dh / 2 - 1.1, accent, 1, 0, 'metal');
  }
}

/** Nicho de parede para quarto: fundo fechado, três módulos e objetos. */
function wallNiche(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const t = 2.6;
  const shelfY = h * 0.52;

  boxAt(g, w - 1, 1.4, h, 0, -d / 2 + 0.7, 0, shade(main, -0.16), 1, 0, 'paint');
  for (const sx of [-1, 1]) {
    boxAt(g, t, d, h, sx * (w / 2 - t / 2), 0, 0, main, 1, 0, 'paint');
    boxAt(g, 2, d - 2, h - 2 * t, sx * (w / 6), 0, t, accent, 1, 0, 'wood');
  }
  boxAt(g, w, d, t, 0, 0, 0, shade(main, -0.06), 1, 0, 'paint');
  boxAt(g, w, d, t, 0, 0, h - t, shade(main, 0.04), 1, 0, 'paint');
  boxAt(g, w - 2 * t, d - 2, 2.2, 0, 0, shelfY, accent, 1, 0, 'wood');

  const bookColors = ['#a8583f', '#4f6d7a', '#7d8a63', '#c2a469'];
  for (let i = 0; i < 4; i++) {
    const bw = 2.4 + hash(i) * 1.3;
    const bh = 14 + hash(i + 5) * 9;
    boxAt(g, bw, d * 0.5, bh, -w / 3 - 14 + i * 5, -d * 0.1, t, bookColors[i], 1, 0, 'matte');
  }
  boxAt(g, 15, d - 9, 12, 0, 0, t, shade(accent, -0.28), 1, 0, 'matte');
  cylinderAt(g, 3.4, 15, w / 3 + 4, 0, t, PORCELAIN, 1, 'ceramic');
  sphereAt(g, 3.6, w / 3 + 4, t + 18, 0, '#7d8a63', [1, 0.82, 1], 'foliage');
}

/** Prateleira suspensa para quarto, com mãos-francesas e livros. */
function wallShelf(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const t = 3.2;

  boxAt(g, w, d, t, 0, 0, h - t, main, 1, 0, 'wood');
  for (const sx of [-1, 1]) {
    const x = sx * (w / 2 - 10);
    boxAt(g, 2.2, 2.2, h - t, x, -d / 2 + 2.2, 0, accent, 1, 0, 'metal');
    boxAt(g, 2.2, d * 0.7, 2.2, x, -d / 2 + 2.2 + d * 0.35, h - t, accent, 1, 0, 'metal');
  }

  const bookColors = ['#a8583f', '#4f6d7a', '#7d8a63', '#c2a469', '#6f5f7a'];
  for (let i = 0; i < 5; i++) {
    const bw = 2.4 + hash(i + 11) * 1.2;
    const bh = 14 + hash(i + 17) * 8;
    boxAt(g, bw, d * 0.55, bh, -w * 0.24 + i * 4.6, -d * 0.08, h, bookColors[i], 1, 0, 'matte');
  }
  cylinderAt(g, 3.2, 12, w * 0.3, 0, h, PORCELAIN, 1, 'ceramic');
  sphereAt(g, 3.4, w * 0.3, h + 14, 0, '#7d8a63', [1, 0.8, 1], 'foliage');
}

/** Prateleira aberta de cozinha com potes e tábua. */
function kitchenShelf(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const t = 3.4;

  boxAt(g, w, d, t, 0, 0, h - t, main, 1, 0, 'wood');
  for (const sx of [-1, 1]) {
    const x = sx * (w / 2 - 9);
    boxAt(g, 2.2, 2.2, h - t, x, -d / 2 + 2.4, 0, accent, 1, 0, 'metal');
    boxAt(g, 2.2, d * 0.68, 2.2, x, -d / 2 + 2.4 + d * 0.34, h - t, accent, 1, 0, 'metal');
  }

  const jarX = [-w * 0.32, -w * 0.11, w * 0.12, w * 0.33];
  const jarH = [14, 18, 12, 16];
  const jarColor = ['#f1efe8', '#dcd2c1', '#c9ccce', '#f1efe8'];
  for (let i = 0; i < jarX.length; i++) {
    cylinderAt(g, 4.2, jarH[i], jarX[i], 0, h, jarColor[i], 1, 'ceramic');
    cylinderAt(g, 4.35, 1.6, jarX[i], 0, h + jarH[i], accent, 1, 'metal');
  }
  boxAt(g, 2.2, d * 0.66, 22, w * 0.23, 0, h, shade(main, 0.08), 1, 0, 'wood');
}

/** Estante de cubos para escritório, com nichos abertos. */
function cubeShelf(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const t = 2.8;
  const rows = 3;
  const cols = 3;
  const innerW = w - 2 * t;
  const cellW = innerW / cols;

  boxAt(g, w - 2, 0.8, h, 0, -d / 2 + 0.4, 0, shade(main, -0.2), 1, 0, 'wood');
  for (const sx of [-1, 1]) {
    boxAt(g, t, d, h, sx * (w / 2 - t / 2), 0, 0, main, 1, 0, 'wood');
  }
  for (let i = 0; i <= rows; i++) {
    const y = (i * (h - 3)) / rows;
    const edge = i === 0 || i === rows;
    boxAt(g, w, d, edge ? 3 : 2.2, 0, 0, y, edge ? shade(main, i ? 0.05 : -0.08) : accent, 1, 0, 'wood');
  }
  for (let i = 1; i < cols; i++) {
    boxAt(g, 2, d, h, -w / 2 + t + cellW * i, 0, 0, accent, 1, 0, 'wood');
  }

  const bookColors = ['#a8583f', '#4f6d7a', '#7d8a63', '#c2a469', '#6f5f7a'];
  let seed = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r + c) % 2 === 0) continue;
      const cx = -w / 2 + t + cellW * (c + 0.5);
      const baseY = (r * (h - 3)) / rows + 3.4;
      for (let b = 0; b < 4; b++) {
        const bw = 2.2 + hash(seed) * 1.2;
        const bh = 12 + hash(seed + 1) * 8;
        boxAt(g, bw, d * 0.5, bh, cx - 7 + b * 4.2, -d * 0.1, baseY, bookColors[seed % bookColors.length], 1, 0, 'matte');
        seed++;
      }
    }
  }
}

function shelf(g: G, p: Palette): void {
  const { w, d, h, main, dark } = p;
  const t = 2.4;

  boxAt(g, w, 1.6, h, 0, -d / 2 + 0.8, 0, shade(main, -0.2), 1, 0, 'wood');
  boxAt(g, 3, d, h, -w / 2 + 1.5, 0, 0, main, 1, 0, 'wood');
  boxAt(g, 3, d, h, w / 2 - 1.5, 0, 0, main, 1, 0, 'wood');
  boxAt(g, w, d, 3, 0, 0, h - 3, shade(main, 0.05), 1, 0, 'wood');
  boxAt(g, w - 6, d - 2, 3, 0, 0, 0, shade(main, -0.1), 1, 0, 'wood');

  const shelves = 4;
  for (let i = 1; i < shelves; i++) {
    boxAt(g, w - 6, d - 2, t, 0, 0, (i * (h - 6)) / shelves, main, 1, 0, 'wood');
  }

  const bookColors = ['#a8583f', '#4f6d7a', '#7d8a63', '#c2a469', '#6f5f7a', '#8a6142', '#3f4d5c'];
  const slots = 7;
  for (let s = 0; s < shelves; s++) {
    const baseY = s === 0 ? 3 : (s * (h - 6)) / shelves + t;
    const topY = s === shelves - 1 ? h - 6 : ((s + 1) * (h - 6)) / shelves;
    const room = topY - baseY - 3;
    if (room < 8) continue;
    for (let i = 0; i < slots; i++) {
      const seed = s * 17 + i;
      const bw = 3.2 + hash(seed) * 2.6;
      const bh = Math.min(room, 12 + hash(seed + 3) * (room - 10));
      const x = -w / 2 + 9 + (i + 0.5) * ((w - 18) / slots);
      boxAt(g, bw, d * 0.62, bh, x, -d * 0.12, baseY, bookColors[(s * 3 + i) % bookColors.length], 1, 0, 'matte');
    }
  }
  boxAt(g, w - 6, 2, 2, 0, d / 2 - 2, h - 5, dark, 1, 0, 'wood');
}

function rack(g: G, p: Palette): void {
  const { w, d, h, main, dark, accent } = p;
  const plinth = 7;
  const t = 4;
  const innerY = plinth + t;
  const innerH = h - plinth - t;

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      coneAt(g, 1.3, 1.6, plinth, sx * (w / 2 - 9), sz * (d / 2 - 7), 0, DARK_METAL, 1, 'metal', 10);
    }
  }

  // Estrutura vazada: base, tampo, laterais e fundo escuro.
  boxAt(g, w, d, t, 0, 0, plinth, shade(main, -0.08), 1, 0, 'wood');
  roundedBoxAt(g, w + 2, d + 1, t, 0, 0, h - t, shade(main, 0.05), 1, 'wood');
  for (const sx of [-1, 1]) {
    boxAt(g, t, d, innerH, sx * (w / 2 - t / 2), 0, innerY, main, 1, 0, 'wood');
  }
  boxAt(g, w - 2 * t, 1.4, innerH, 0, -d / 2 + 0.7, innerY, '#241c15', 1, 0, 'matte');

  // Módulo central com gaveta entre dois nichos abertos.
  const centerW = Math.min(46, w * 0.3);
  const dividerT = 3;
  for (const sx of [-1, 1]) {
    boxAt(g, dividerT, d - 2, innerH, sx * (centerW / 2 + dividerT / 2), 0, innerY, main, 1, 0, 'wood');
  }
  const dh = innerH - 8;
  roundedBoxAt(g, centerW, 2.2, dh, 0, d / 2 - 1.1, innerY + 4, shade(main, 0.02), 1, 'wood');
  boxAt(g, centerW * 0.5, 2.4, 2, 0, d / 2 + 0.4, innerY + 4 + dh / 2, accent, 1, 0, 'metal');

  const nicheW = (w - centerW - 2 * dividerT - 2 * t) / 2;
  for (const sx of [-1, 1]) {
    const x = sx * (centerW / 2 + dividerT + nicheW / 2);
    boxAt(g, nicheW - 1, d - 5, 2.4, x, 0, innerY + innerH * 0.52, shade(main, -0.05), 1, 0, 'wood');
    boxAt(g, nicheW - 8, 0.8, 1.2, x, d / 2 - 2, innerY + 3, shade(main, -0.3), 1, 0, 'matte');
  }

  // Aparelho eletrônico no nicho direito.
  const rx = centerW / 2 + dividerT + nicheW / 2;
  const devY = innerY + innerH * 0.52 + 1.2;
  boxAt(g, nicheW - 12, d * 0.5, 7, rx, 0, devY, '#2b2f34', 1, 0, 'metal');
  boxAt(g, 2.2, 0.8, 1.2, rx + nicheW * 0.3, d * 0.5, devY + 4, '#8fd3c2', 1, 0, 'emissive');
  boxAt(g, 10, 0.8, 0.8, rx - nicheW * 0.22, d * 0.5, devY + 2, '#7d858c', 1, 0, 'metal');

  boxAt(g, w - 24, 1.6, 1.6, 0, -d / 2 + 3, plinth + 1.5, dark, 1, 0, 'wood');
}

function counter(g: G, p: Palette, withSink: boolean): void {
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

function stove(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;

  boxAt(g, w - 6, d - 6, 8, 0, 0, 0, DARK_METAL, 1, 0, 'metal');
  roundedBoxAt(g, w, d, h - 8, 0, 0, 8, PORCELAIN, 1.2, 'paint');

  roundedBoxAt(g, w - 8, 2.4, h * 0.5, 0, d / 2 + 0.6, 12, '#3c4046', 1, 'metal');
  roundedBoxAt(g, w - 20, 1.4, h * 0.3, 0, d / 2 + 2.2, 20, '#1b1f24', 2, 'screen');
  boxAt(g, w - 16, 3.6, 3.6, 0, d / 2 + 4.4, h * 0.52, CHROME, 1, 0, 'chrome');

  boxAt(g, w - 8, 2, 9, 0, d / 2 + 1, h - 13, '#dcdad5', 1, 0, 'paint');
  for (let i = 0; i < 3; i++) {
    const knob = cylinderAt(g, 2.2, 2.6, -w * 0.28 + i * w * 0.16, d / 2 + 2.6, h - 11, DARK_METAL, 1, 'metal');
    knob.rotation.x = Math.PI / 2;
  }

  roundedBoxAt(g, w, d - 2, 3, 0, 0, h, '#25292e', 1, 'screen');
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const bx = sx * w * 0.22;
      const bz = sz * d * 0.2;
      torusAt(g, Math.min(w, d) * 0.13, 0.9, bx, bz, h + 3, '#15181b', 'metal');
      cylinderAt(g, Math.min(w, d) * 0.075, 1, bx, bz, h + 3, '#2f3338', 1, 'metal');
    }
  }

  boxAt(g, w, 2, 28, 0, -d / 2 + 1, h + 3, '#dcdad5', 1, 0, 'paint');
  boxAt(g, w, 2, 2.5, 0, -d / 2 + 1, h + 31, accent, 1, 0, 'metal');
}

function hood(g: G, p: Palette): void {
  const { w, d, h, main, ceil } = p;

  boxAt(g, w * 0.36, d * 0.36, Math.max(ceil - h, 4), 0, 0, h, shade(main, -0.12), 1, 0, 'metal');
  roundedBoxAt(g, w, d, h * 0.36, 0, 0, 0, main, 2.2, 'metal');
  boxAt(g, w + 2, d + 2, 2.5, 0, 0, 0, CHROME, 1, 0, 'chrome');
  boxAt(g, w - 16, d - 16, 1.6, 0, 0, 1.5, '#8f969c', 1, 0, 'metal');
  for (const sx of [-1, 1]) {
    cylinderAt(g, 2.2, 1, sx * w * 0.24, 0, 0.6, '#fff3cf', 1, 'emissive');
  }
  boxAt(g, w * 0.5, 1.6, 6, 0, d / 2 - 0.5, h * 0.06, '#b9bec4', 1, 0, 'metal');
}

function fridge(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const feet = 6;

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      boxAt(g, 4, 4, feet, sx * (w / 2 - 7), sz * (d / 2 - 7), 0, DARK_METAL, 1, 0, 'metal');
    }
  }

  roundedBoxAt(g, w, d, h - feet, 0, 0, feet, main, 3, 'metal');

  const topBase = feet + h * 0.38;
  const topH = h * 0.56;
  roundedBoxAt(g, w - 4, 2.5, topH, 0, d / 2 + 0.7, topBase, shade(main, 0.03), 1.6, 'metal');
  roundedBoxAt(g, w - 4, 2.5, h * 0.34, 0, d / 2 + 0.7, feet + 3, shade(main, -0.02), 1.6, 'metal');
  boxAt(g, w - 6, 1.4, 1.6, 0, d / 2 + 1.4, feet + 3 + h * 0.345, '#8f969c', 1, 0, 'metal');

  boxAt(g, 2.8, 5, h * 0.2, w / 2 - 11, d / 2 + 3.4, topBase + h * 0.06, accent, 1, 0, 'metal');
  boxAt(g, 2.8, 5, h * 0.16, w / 2 - 11, d / 2 + 3.4, feet + h * 0.08, accent, 1, 0, 'metal');
  boxAt(g, w * 0.22, 1, 2.4, -w * 0.16, d / 2 + 2.2, topBase + topH - 10, '#7d858c', 1, 0, 'metal');
}

function dishwasher(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;

  boxAt(g, w - 6, d - 6, 6, 0, 0, 0, DARK_METAL, 1, 0, 'metal');
  roundedBoxAt(g, w, d, h - 6, 0, 0, 6, main, 1.6, 'metal');
  roundedBoxAt(g, w - 6, 2.4, h - 18, 0, d / 2 + 0.6, 8, shade(main, 0.04), 1.2, 'metal');
  boxAt(g, w - 8, 1.4, 8, 0, d / 2 + 2, h - 18, accent, 1, 0, 'metal');
  boxAt(g, w - 18, 3.4, 3.4, 0, d / 2 + 3.6, h - 13, CHROME, 1, 0, 'chrome');
  boxAt(g, 14, 1, 3, -w / 2 + 14, d / 2 + 2.1, h - 17, '#8fd3c2', 1, 0, 'emissive');
  boxAt(g, 10, 1, 1.6, w / 2 - 14, d / 2 + 2.1, h - 16, '#5c6167', 1, 0, 'metal');
}

function island(g: G, p: Palette): void {
  const { w, d, h, main, accent, metal } = p;
  const plinth = 7;

  boxAt(g, w - 16, d - 16, plinth, 0, 0, 0, shade(main, -0.4), 1, 0, 'paint');
  roundedBoxAt(g, w, d, h - plinth - 4, 0, 0, plinth, main, 1.2, 'paint');

  const doors = Math.max(2, Math.round(w / 70));
  const dw = (w - 6 - (doors - 1) * 2) / doors;
  for (let i = 0; i < doors; i++) {
    const x = -w / 2 + 3 + dw / 2 + i * (dw + 2);
    roundedBoxAt(g, dw, 2, h - plinth - 14, x, d / 2 + 1, plinth + 4, shade(main, i % 2 ? -0.04 : 0), 1, 'paint');
    boxAt(g, 18, 2.6, 2, x, d / 2 + 2.4, h - plinth - 14, metal, 1, 0, 'metal');
  }

  roundedBoxAt(g, w + 14, d + 10, 4, 0, 0, h - 4, accent, 1, 'stone');
  boxAt(g, w + 14, 1.6, 5, 0, -d / 2 - 3.8, h - 4, accent, 1, 0, 'stone');
  boxAt(g, w + 14, 1.6, 5, 0, d / 2 + 3.8, h - 4, accent, 1, 0, 'stone');
}

function toilet(g: G, p: Palette): void {
  const { w, d, main } = p;
  const b = d / 2;
  const bowlZ = 8;
  const rimY = 40;
  const cisternZ = -b + 8;
  const cisternD = 17;

  // Base estreita sob a bacia, apoiada no piso.
  latheAt(
    g,
    [[0, 0], [10, 0], [11, 2], [9, 6], [0, 6]],
    0,
    bowlZ,
    0,
    shade(main, -0.06),
    'ceramic',
    26,
    0.86,
    1,
  );

  // Bacia oval, mais estreita na base e aberta no aro.
  latheAt(
    g,
    [
      [0, 4], [10, 4], [13, 9], [16.5, 20], [18.5, 31], [19, rimY],
      [17.5, rimY], [17, 31], [15.5, 21], [12, 12], [0, 11],
    ],
    0,
    bowlZ,
    0,
    main,
    'ceramic',
    32,
    0.82,
    1.02,
  );

  // Aro do assento + tampa fechada.
  const ring = torusAt(g, 17.6, 1.5, 0, bowlZ, rimY, shade(main, 0.05), 'ceramic');
  ring.scale.set(0.84, 1, 1.02);
  latheAt(
    g,
    [[0, 0], [17.4, 0], [17.4, 2], [16, 3.4], [0, 3.4]],
    0,
    bowlZ,
    rimY + 1.2,
    shade(main, 0.02),
    'ceramic',
    32,
    0.84,
    1.02,
  );
  cylinderAt(g, 2.4, 0.6, 0, bowlZ - 12, rimY + 3.4, shade(main, -0.12), 1, 'ceramic');

  // Caixa acoplada encostada na bacia.
  roundedBoxAt(g, w - 4, cisternD, 42, 0, cisternZ, 34, main, 3, 'ceramic');
  roundedBoxAt(g, w - 6, cisternD - 1.5, 3.4, 0, cisternZ, 75.4, shade(main, -0.04), 2, 'ceramic');
  cylinderAt(g, 3.4, 1.4, 0, cisternZ, 78.6, CHROME, 1, 'chrome');

  // Ligação bacia-caixa e rodapé.
  roundedBoxAt(g, w - 14, cisternD + 8, 30, 0, cisternZ + 4, 4, shade(main, -0.04), 2, 'ceramic');
  boxAt(g, w - 8, cisternD + 6, 4, 0, cisternZ + 3, 0, shade(main, -0.12), 1, 0, 'ceramic');
}

function vanity(g: G, p: Palette): void {
  const { w, d, h, main, accent, metal } = p;

  boxAt(g, w - 12, d - 14, 6, 0, 0, 0, shade(main, -0.4), 1, 0, 'paint');
  roundedBoxAt(g, w, d - 4, h - 24, 0, -2, 8, main, 1.5, 'paint');

  for (const sx of [-1, 1]) {
    roundedBoxAt(g, w / 2 - 4, 2, h - 34, sx * (w / 4), d / 2 - 3.6, 12, shade(main, sx < 0 ? 0.02 : -0.02), 1, 'paint');
    boxAt(g, 2.4, 3, 10, sx * 4, d / 2 - 1.8, h * 0.52, metal, 1, 0, 'metal');
  }

  roundedBoxAt(g, w + 2, d + 1, 5, 0, 0, h - 5, accent, 1, 'stone');

  latheAt(
    g,
    [[0, 0], [16, 0], [18, 4], [18, 12], [16, 14], [15, 12], [15, 4], [0, 3]],
    0,
    0,
    h,
    PORCELAIN,
    'ceramic',
    32,
    1,
    0.72,
  );

  faucet(g, 0, -d * 0.3, h, metal, 17, 11);
}

function bathtub(g: G, p: Palette): void {
  const { w, d, main, accent, metal } = p;
  const wall = 8;
  const h = 56;

  roundedBoxAt(g, w, d, 8, 0, 0, 0, main, 3, 'ceramic');
  boxAt(g, w, wall, h, 0, -d / 2 + wall / 2, 0, main, 1, 0, 'ceramic');
  boxAt(g, w, wall, h, 0, d / 2 - wall / 2, 0, main, 1, 0, 'ceramic');
  boxAt(g, wall, d - wall * 2, h, -w / 2 + wall / 2, 0, 0, main, 1, 0, 'ceramic');
  boxAt(g, wall, d - wall * 2, h, w / 2 - wall / 2, 0, 0, main, 1, 0, 'ceramic');

  for (const sz of [-1, 1]) {
    roundedBoxAt(g, w, wall, 4, 0, sz * (d / 2 - wall / 2), h - 4, shade(main, 0.04), 3, 'ceramic');
  }
  for (const sx of [-1, 1]) {
    roundedBoxAt(g, wall, d - wall * 2, 4, sx * (w / 2 - wall / 2), 0, h - 4, shade(main, 0.04), 3, 'ceramic');
  }

  boxAt(g, w - wall * 2, d - wall * 2, 1.5, 0, 0, h - 9, accent, 0.72, 0, 'water');

  cylinderAt(g, 2.2, 14, w / 2 - 12, -d / 2 + 14, h - 4, metal, 1, 'chrome');
  tubeAt(g, [[0, 0, 0], [0, 12, 0], [-6, 15, 0], [-12, 14, 0]], 1.4, w / 2 - 12, -d / 2 + 14, h + 10, metal, 'chrome');
  cylinderAt(g, 2.2, 6, w / 2 - 12, -d / 2 + 14, 20, metal, 1, 'chrome');
}

function shower(g: G, p: Palette): void {
  const { w, d, main, accent, metal } = p;

  roundedBoxAt(g, w, d, 7, 0, 0, 0, main, 2, 'ceramic');
  cylinderAt(g, 4, 0.8, 0, 0, 7, '#aeb8bd', 1, 'metal');
  boxAt(g, w - 10, d - 10, 0.6, 0, 0, 7, shade(main, 0.06), 1, 0, 'ceramic');

  boxAt(g, 1.2, d - 4, 190, -w / 2 + 2, 0, 8, accent, 0.24, 0, 'glass');
  boxAt(g, w - 4, 1.2, 190, 0, -d / 2 + 2, 8, accent, 0.24, 0, 'glass');
  boxAt(g, 2.6, 2.6, 196, -w / 2 + 2, 0, 6, metal, 1, 0, 'metal');
  boxAt(g, 2.6, 2.6, 196, 0, -d / 2 + 2, 6, metal, 1, 0, 'metal');
  boxAt(g, w - 4, 2.4, 2.4, 0, -d / 2 + 2, 200, metal, 1, 0, 'metal');
  boxAt(g, 2.4, d - 4, 2.4, -w / 2 + 2, 0, 200, metal, 1, 0, 'metal');

  const colX = w / 2 - 6;
  const colZ = d / 2 - 6;
  boxAt(g, 3, 3, 190, colX, colZ, 7, metal, 1, 0, 'metal');
  tubeAt(g, [[0, 0, 0], [0, 0, -d * 0.36]], 1.3, colX, colZ, 194, metal, 'chrome');
  cylinderAt(g, 11, 2, colX, colZ - d * 0.36, 192, metal, 1, 'chrome');
  cylinderAt(g, 4.2, 2.4, colX, colZ, 110, metal, 1, 'chrome');
  cylinderAt(g, 1.4, 12, colX, colZ, 96, metal, 1, 'chrome');
}

function mirror(g: G, p: Palette): void {
  const { w, d, h, main } = p;

  roundedBoxAt(g, w, d, h, 0, 0, 0, '#d9d6ce', 1, 'metal');
  boxAt(g, w - 4, 1.2, h - 4, 0, d / 2 + 0.7, 2, main, 1, 0, 'screen');
  boxAt(g, w - 8, 0.6, 1.6, 0, d / 2 + 1.4, h * 0.72, '#ffffff', 0.55, 0, 'screen');
  boxAt(g, w - 12, 0.6, 1.2, -w * 0.12, d / 2 + 1.4, h * 0.28, '#ffffff', 0.32, 0, 'screen');
}

function tv(g: G, p: Palette): void {
  const { w, d, h } = p;

  roundedBoxAt(g, w, d, h, 0, 0, 0, '#22262b', 1.2, 'metal');
  roundedBoxAt(g, w - 5, 1.4, h - 5, 0, d / 2 + 0.5, 2.5, '#0b0e12', 1, 'screenGlow');
  boxAt(g, w * 0.3, 2, 2, 0, d / 2 + 1, 1, '#3a4048', 1, 0, 'metal');
  cylinderAt(g, 0.9, 0.4, w / 2 - 8, d / 2 + 1.2, 3, '#5c6167', 1, 'emissive');
}

function airSplit(g: G, p: Palette): void {
  const { w, d, h } = p;

  roundedBoxAt(g, w, d, h, 0, 0, 0, '#f7f6f2', 2.6, 'paint');
  roundedBoxAt(g, w - 3, 2.5, h * 0.62, 0, d / 2 + 0.6, h * 0.22, '#fbfaf6', 1.4, 'paint');
  for (let i = 0; i < 6; i++) {
    boxAt(g, w - 16, 1, 1, 0, d / 2 + 1.6, h * 0.3 + i * 2.2, '#dcdad3', 1, 0, 'paint');
  }
  boxAt(g, 11, 0.8, 2.6, w / 2 - 15, d / 2 + 1.7, h * 0.72, '#8fd3c2', 1, 0, 'emissive');
  boxAt(g, w * 0.5, 1.2, 1.6, 0, -d / 2 - 0.5, h * 0.3, '#e2e0d9', 1, 0, 'paint');
}

function appliance(g: G, p: Palette, dryer: boolean): void {
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

function rugRound(g: G, p: Palette): void {
  const { w, d, main, accent } = p;
  const r = Math.min(w, d) / 2;
  latheAt(g, [[0, 0], [r - 1.5, 0], [r, 1.2], [r, 2], [0, 2]], 0, 0, 0, main, 'fabric', 44);
  latheAt(g, [[0, 0], [r - 10, 0], [r - 9, 0.8], [r - 9, 2.2], [0, 2.2]], 0, 0, 0, accent, 'fabric', 44);
  latheAt(g, [[0, 0], [r - 18, 0], [r - 17, 0.5], [r - 17, 2.4], [0, 2.4]], 0, 0, 0, shade(main, 0.06), 'fabric', 40);
}

function rugStriped(g: G, p: Palette): void {
  const { w, d, main, accent } = p;
  roundedBoxAt(g, w, d, 1.8, 0, 0, 0, main, 1.6, 'fabric');
  const stripes = 7;
  for (let i = 0; i < stripes; i++) {
    const z = -d / 2 + 12 + (i * (d - 24)) / (stripes - 1);
    boxAt(g, w - 8, i % 2 ? 4.5 : 2.2, 0.8, 0, z, 1.8, i % 2 ? accent : shade(accent, -0.2), 1, 0, 'fabric');
  }
  roundedBoxAt(g, w - 16, d - 16, 0.6, 0, 0, 1.8, shade(main, 0.04), 1, 'fabric');
}

function rugFluffy(g: G, p: Palette): void {
  const { w, d, main, accent } = p;
  roundedBoxAt(g, w, d, 3.2, 0, 0, 0, main, 4, 'fabric');
  roundedBoxAt(g, w - 20, d - 20, 1.2, 0, 0, 3, accent, 3, 'fabric');
  const tufts = 40;
  for (let i = 0; i < tufts; i++) {
    const x = -w / 2 + 10 + hash(i) * (w - 20);
    const z = -d / 2 + 10 + hash(i + 50) * (d - 20);
    sphereAt(g, 2.4 + hash(i + 20) * 2, x, 3.4, z, i % 2 ? accent : shade(main, 0.1), [1, 0.5, 1], 'fabric');
  }
}

function bunkBed(g: G, p: Palette, desk: boolean): void {
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
  // escada lateral (belief: 5 degraus)
  const steps = 5;
  const stepW = 24;
  const stepD = (d - 30) / steps;
  for (let i = 0; i < steps; i++) {
    const y = 18 + i * ((110 - 18) / (steps - 1));
    const z = -b + 22 + (i + 0.5) * stepD;
    roundedBoxAt(g, stepW, stepD - 3, 4, w / 2 + stepW / 2 - 4, z, y, dark, 1, 'wood');
  }
  for (const sz of [-1, 1]) {
    roundedBoxAt(g, 3, d - 30, 4, w / 2 + stepW - 4, 0, 110, main, 1, 'wood');
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
function pisoItem(g: G, p: Palette, key: string): void {
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

function rug(g: G, p: Palette): void {
  const { w, d, main, accent } = p;

  roundedBoxAt(g, w, d, 1.6, 0, 0, 0, main, 1.6, 'fabric');
  roundedBoxAt(g, w - 18, d - 18, 0.9, 0, 0, 1.6, accent, 1.2, 'fabric');
  roundedBoxAt(g, w - 34, d - 34, 0.5, 0, 0, 2.4, shade(main, 0.06), 1, 'fabric');

  const fringes = Math.max(10, Math.round(w / 14));
  for (const sz of [-1, 1]) {
    for (let i = 0; i < fringes; i++) {
      const x = -w / 2 + 8 + (i * (w - 16)) / (fringes - 1);
      boxAt(g, 1.2, 3.4, 0.9, x, sz * (d / 2 + 2.2), 0, shade(main, -0.2), 1, 0, 'fabric');
    }
  }
}

function plant(g: G, p: Palette, height: number): void {
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

function floorLamp(g: G, p: Palette): void {
  const { main, metal } = p;

  latheAt(g, [[0, 0], [12, 0], [13.4, 2.4], [13.4, 3.6], [0, 3.6]], 0, 0, 0, metal, 'metal', 28);
  cylinderAt(g, 1.4, 132, 0, 0, 3, metal, 1, 'metal');
  cylinderAt(g, 3.4, 2, 0, 0, 133, metal, 1, 'metal');
  coneAt(g, 9, 16, 24, 0, 0, 135, main, 1, 'fabric', 28, true);
  sphereAt(g, 5.6, 0, 143, 0, '#fff3cf', [1, 1, 1], 'emissive');
}

function pendant(g: G, p: Palette): void {
  const { w, d, h, main, ceil } = p;
  const r = Math.min(w, d) / 2;

  const cordTop = ceil - 2;
  if (cordTop > h + 2) {
    cylinderAt(g, 0.5, cordTop - h, 0, 0, h, '#3a3a3a', 1, 'matte');
    cylinderAt(g, 4.6, 2, 0, 0, cordTop, '#3a3a3a', 1, 'metal');
  }
  coneAt(g, r * 0.5, r, 22, 0, 0, h, main, 1, 'metal', 30, true);
  cylinderAt(g, r * 0.52, 1.4, 0, 0, h + 20, main, 1, 'metal');
  sphereAt(g, 4.4, 0, h + 5, 0, '#fff3cf', [1, 1, 1], 'emissive');
}

function picture(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const t = 5;

  boxAt(g, w, d, t, 0, 0, h - t, main, 1, 0, 'wood');
  boxAt(g, w, d, t, 0, 0, 0, main, 1, 0, 'wood');
  boxAt(g, t, d, h - 2 * t, -w / 2 + t / 2, 0, t, main, 1, 0, 'wood');
  boxAt(g, t, d, h - 2 * t, w / 2 - t / 2, 0, t, main, 1, 0, 'wood');
  boxAt(g, w - 2 * t, 1.5, h - 2 * t, 0, d / 2 - 0.8, t, accent, 1, 0, 'paint');
  boxAt(g, w - 2 * t - 9, 1, h - 2 * t - 9, 0, d / 2 + 0.2, t + 4.5, shade(accent, 0.12), 1, 0, 'paint');
  boxAt(g, w - 2 * t - 18, 0.6, 1.4, 0, d / 2 + 0.9, t + 14, '#ffffff', 0.35, 0, 'paint');
}

function fireplace(g: G, p: Palette): void {
  const { w, d, h, main } = p;
  const side = w * 0.22;

  boxAt(g, side, d, h, -w / 2 + side / 2, 0, 0, main, 1, 0, 'stone');
  boxAt(g, side, d, h, w / 2 - side / 2, 0, 0, main, 1, 0, 'stone');
  boxAt(g, w, d, h * 0.44, 0, 0, h * 0.56, main, 1, 0, 'stone');
  boxAt(g, w * 0.56, 3, h * 0.56, 0, -d / 2 + 1.5, 0, '#2b2724', 1, 0, 'matte');
  boxAt(g, w * 0.56, d - 3, 2, 0, 0, 0, '#38322d', 1, 0, 'matte');

  for (let i = 0; i < 3; i++) {
    const log = cylinderAt(g, 3.4, w * 0.26, 0, d / 2 - d * 0.34 + i * 5.5, 10 + i * 3, '#6b4a30', 1, 'wood');
    log.rotation.z = Math.PI / 2;
    log.rotation.y = -0.28 + i * 0.26;
  }
  boxAt(g, w * 0.3, 7, 1.8, 0, d / 2 - d * 0.24, 8, '#ff9a4a', 1, 0, 'emissive');
  boxAt(g, w * 0.12, 3.4, 1.2, -w * 0.11, d / 2 - d * 0.2, 9, '#ffd08a', 1, 0, 'emissive');

  roundedBoxAt(g, w + 10, d + 6, 5, 0, 0, h - 5, shade(main, 0.08), 1.6, 'stone');
  boxAt(g, w + 14, d + 12, 3, 0, 0, 0, '#cfc8ba', 1, 0, 'stone');
  boxAt(g, w * 0.6, 2, 2, 0, d / 2 + 3.2, h - 9, shade(main, -0.18), 1, 0, 'stone');
}

function pool(g: G, p: Palette): void {
  const { w, d, main, accent } = p;
  const cop = 15;

  boxAt(g, w, cop, 10, 0, -d / 2 + cop / 2, 0, accent, 1, 0, 'stone');
  boxAt(g, w, cop, 10, 0, d / 2 - cop / 2, 0, accent, 1, 0, 'stone');
  boxAt(g, cop, d - cop * 2, 10, -w / 2 + cop / 2, 0, 0, accent, 1, 0, 'stone');
  boxAt(g, cop, d - cop * 2, 10, w / 2 - cop / 2, 0, 0, accent, 1, 0, 'stone');

  const iw = w - cop * 2;
  const id = d - cop * 2;
  const tile = shade(main, -0.24);
  boxAt(g, iw, 2, 10, 0, -d / 2 + cop + 1, 0, tile, 1, 0, 'ceramic');
  boxAt(g, iw, 2, 10, 0, d / 2 - cop - 1, 0, tile, 1, 0, 'ceramic');
  boxAt(g, 2, id, 10, -w / 2 + cop + 1, 0, 0, tile, 1, 0, 'ceramic');
  boxAt(g, 2, id, 10, w / 2 - cop - 1, 0, 0, tile, 1, 0, 'ceramic');

  boxAt(g, iw, id, 6, 0, 0, 1, shade(main, -0.48), 1, 0, 'ceramic');
  boxAt(g, iw - 2, id - 2, 2.6, 0, 0, 6.4, main, 0.6, 0, 'water');

  const lx = w / 2 - cop - 12;
  for (let i = 0; i < 3; i++) {
    cylinderAt(g, 1.4, 12, lx, d / 2 - cop - 2, 10 + i * 12, CHROME, 1, 'chrome');
  }
  boxAt(g, 2.6, 2.6, 3, lx, d / 2 - cop - 2, 34, CHROME, 1, 0, 'chrome');
  boxAt(g, 22, 26, 1.6, -w / 2 + cop + 26, -d / 2 + cop + 20, 10, '#ffffff', 0.45, 0, 'paint');
}

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

function grill(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const bodyH = h * 0.62;

  boxAt(g, w * 0.72, d, bodyH, -w * 0.14, 0, 0, main, 1, 0, 'stone');
  boxAt(g, w * 0.64, d - 12, bodyH * 0.55, -w * 0.14, 2, bodyH * 0.4, '#2f2b28', 1, 0, 'matte');

  for (let i = 0; i < 7; i++) {
    boxAt(g, 1.6, d - 18, 2, -w * 0.14 - w * 0.24 + i * (w * 0.08), 0, bodyH * 0.52, accent, 1, 0, 'metal');
  }

  boxAt(g, w * 0.78, d + 4, 4, -w * 0.14, 0, bodyH, '#4a4d51', 1, 0, 'metal');
  boxAt(g, w * 0.34, d * 0.7, 2.6, -w * 0.14, -d * 0.15, bodyH + 4, '#3b3f45', 1, 0, 'metal');
  for (let i = 0; i < 6; i++) {
    boxAt(g, 1.4, d * 0.62, 1.2, -w * 0.14 - w * 0.13 + i * (w * 0.052), -d * 0.15, bodyH + 7, '#6b7075', 1, 0, 'metal');
  }

  boxAt(g, w * 0.2, d, 4, w * 0.36, 0, h * 0.62, '#b9bec4', 1, 0, 'metal');
  boxAt(g, w * 0.2, d * 0.8, 2, w * 0.36, 0, h * 0.62 + 4, '#8f969c', 1, 0, 'metal');

  const chimneyH = Math.max(10, p.ceil - h);
  boxAt(g, w * 0.18, d * 0.32, chimneyH, -w * 0.14, -d * 0.2, h, shade(main, -0.08), 1, 0, 'stone');
}

function gardenBench(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const seatY = 42;

  for (const sx of [-1, 1]) {
    const x = sx * (w / 2 - 6);
    boxAt(g, 4, 4, seatY, x, d * 0.28, 0, accent, 1, 0, 'metal');
    boxAt(g, 4, 4, h, x, -d * 0.32, 0, accent, 1, 0, 'metal');
    boxAt(g, 4, d * 0.62, 4, x, -d * 0.02, seatY - 4, accent, 1, 0, 'metal');
    boxAt(g, 4, d * 0.4, 4, x, -d * 0.12, h - 6, accent, 1, 0, 'metal');
  }

  for (let i = 0; i < 4; i++) {
    boxAt(g, w - 10, d * 0.12, 3, 0, d * 0.06 + i * d * 0.14, seatY, main, 1, 0, 'wood');
  }
  for (let i = 0; i < 3; i++) {
    boxAt(g, w - 10, 3, d * 0.1, 0, -d * 0.3, seatY + 14 + i * 11, main, 1, 0, 'wood');
  }
}

function stairs(g: G, p: Palette, lShape: boolean): void {
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

function pillar(g: G, p: Palette): void {
  const { w, d, h, main } = p;

  boxAt(g, w + 10, d + 10, 10, 0, 0, 0, shade(main, -0.1), 1, 0, 'stone');
  boxAt(g, w, d, h - 20, 0, 0, 10, main, 1, 0, 'stone');
  boxAt(g, w + 8, d + 8, 10, 0, 0, h - 10, shade(main, -0.06), 1, 0, 'stone');
  boxAt(g, w + 2, d + 2, 2, 0, 0, 9, shade(main, 0.06), 1, 0, 'stone');
  boxAt(g, w + 2, d + 2, 2, 0, 0, h - 12, shade(main, 0.06), 1, 0, 'stone');
}

function laundrySink(g: G, p: Palette): void {
  const { w, d, h, main, accent, metal } = p;
  const plinth = 8;
  const tubW = w - 24;
  const tubD = d - 28;

  boxAt(g, w - 8, d - 10, plinth, 0, 0, 0, shade(main, -0.38), 1, 0, 'paint');
  roundedBoxAt(g, w, d, h - plinth - 4, 0, 0, plinth, main, 1.4, 'paint');

  // Duas portas com puxadores verticais.
  const dw = (w - 8) / 2;
  for (let i = 0; i < 2; i++) {
    const x = -w / 2 + 4 + dw / 2 + i * dw;
    roundedBoxAt(g, dw - 3, 2.2, h - plinth - 14, x, d / 2 - 1, plinth + 4, shade(main, i ? -0.02 : 0.02), 1, 'paint');
    boxAt(g, 2, 2.4, 10, x, d / 2 + 0.4, plinth + (h - plinth) * 0.5, metal, 1, 0, 'metal');
  }

  // Bancada de pedra com cuba rebaixada, espelho e torneira.
  slabWithHole(g, w + 2, d + 2, 4, h - 4, accent, { x: 0, z: -4, w: tubW, d: tubD }, 'stone');
  basin(g, tubW, tubD, 18, h - 4, accent);
  boxAt(g, w + 2, 4, 12, 0, -d / 2, h, shade(accent, -0.06), 1, 0, 'stone');
  faucet(g, 0, -d / 2 + 8, h, metal, 20, 14);
}

/** Cores das roupas penduradas, derivadas do tecido escolhido. */
function clothColors(accent: string): string[] {
  return [accent, shade(accent, -0.18), shade(accent, 0.16), '#8f9a76', '#c07f63'];
}

/** Varal de parede: braços laterais, ripas e roupas penduradas. */
function dryingRack(g: G, p: Palette): void {
  const { w, d, h, accent, metal } = p;
  const rails = 3;
  const step = (d - 14) / (rails - 1);
  const cloth = clothColors(accent);

  // Braços e chapas de fixação na parede.
  for (const sx of [-1, 1]) {
    boxAt(g, 3, d - 8, 3, sx * (w / 2 - 6), 0, h - 3, metal, 1, 0, 'metal');
    boxAt(g, 5, 3, 22, sx * (w / 2 - 6), -d / 2 + 2, h - 22, metal, 1, 0, 'metal');
  }

  for (let r = 0; r < rails; r++) {
    const z = -d / 2 + 7 + r * step;
    boxAt(g, w - 6, 1.8, 1.8, 0, z, h - 3 - r * 3, metal, 1, 0, 'metal');
    for (let i = 0; i < 2; i++) {
      const height = h * (0.34 + ((r + i) % 3) * 0.04);
      const x = (i ? 1 : -1) * w * 0.26;
      boxAt(g, w * 0.24, 2.2, height, x, z + (i ? 2 : -2), h - 6 - r * 3 - height, cloth[(r * 2 + i) % cloth.length], 1, i ? 0.08 : -0.06, 'fabric');
    }
  }
}

function laundryBasket(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const top = Math.min(w, d) / 2 - 1;
  const bottom = top * 0.76;

  // Cesto afunilado com aro de reforço.
  latheAt(
    g,
    [[0, 0], [bottom, 0], [bottom * 1.06, 6], [top * 0.96, h - 5], [top, h - 1], [0, h - 1]],
    0,
    0,
    0,
    main,
    'wood',
    26,
  );
  torusAt(g, top, 1.5, 0, 0, h - 1, shade(main, -0.16), 'wood');

  // Roupas dobradas na boca do cesto.
  boxAt(g, top * 1.5, top * 1.2, 9, 0, 0, h - 6, accent, 1, 0.12, 'fabric');
  boxAt(g, top * 1.2, top, 7, 0, 0, h - 1, shade(accent, 0.12), 1, -0.2, 'fabric');
}

function closetIsland(g: G, p: Palette): void {
  const { w, d, h, main, accent, metal } = p;
  const plinth = 7;

  boxAt(g, w - 12, d - 14, plinth, 0, 0, 0, shade(main, -0.4), 1, 0, 'paint');
  roundedBoxAt(g, w, d, h - plinth - 5, 0, 0, plinth, main, 1.4, 'paint');

  // Gavetas nas duas faces longitudinais.
  const dw = (w - 10) / 3;
  for (let i = 0; i < 3; i++) {
    const x = -w / 2 + 5 + dw / 2 + i * dw;
    for (const sz of [-1, 1]) {
      roundedBoxAt(g, dw - 3, 2.4, (h - plinth) * 0.6, x, sz * (d / 2 - 1), plinth + 4, shade(main, sz < 0 ? 0.02 : -0.02), 1, 'paint');
      boxAt(g, Math.min(dw * 0.42, 24), 2.6, 2, x, sz * (d / 2 + 0.4), plinth + (h - plinth) * 0.32, metal, 1, 0, 'metal');
    }
  }

  // Tampo de pedra com bandeja de vidro para acessórios.
  roundedBoxAt(g, w + 6, d + 6, 5, 0, 0, h - 5, accent, 1.4, 'stone');
  boxAt(g, w * 0.32, d * 0.44, 1.4, 0, 0, h + 0.4, '#dfeef2', 0.45, 0, 'glass');
}

/** Arara de roupas: estrutura tubular com barra e peças penduradas. */
function garmentRack(g: G, p: Palette): void {
  const { w, d, h, accent, metal } = p;

  for (const sz of [-1, 1]) boxAt(g, w, 3, 4, 0, sz * (d / 2 - 3), 0, metal, 1, 0, 'metal');
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      cylinderAt(g, 1.5, h, sx * (w / 2 - 4), sz * (d / 2 - 4), 0, metal, 1, 'metal');
    }
  }
  boxAt(g, w - 4, 2.4, 2.4, 0, 0, h - 3, metal, 1, 0, 'metal');

  const count = 5;
  const step = (w - 28) / (count - 1);
  const cloth = clothColors(accent);
  for (let i = 0; i < count; i++) {
    const x = -w / 2 + 14 + i * step;
    const height = h * (0.42 + (i % 3) * 0.06);
    boxAt(g, step * 0.66, 2.2, height, x, 0, h - 12 - height, cloth[i % cloth.length], 1, (i % 2 ? 1 : -1) * 0.05, 'fabric');
    boxAt(g, 1.6, 1.6, 6, x, 0, h - 7, metal, 1, 0, 'metal');
    boxAt(g, step * 0.5, 1.6, 1.6, x, 0, h - 9, metal, 1, 0, 'metal');
  }
}

function changingTable(g: G, p: Palette): void {
  const { w, d, h, main, accent, metal } = p;
  const legH = 9;

  fourLegs(g, w, d, legH, 6, 1.8, 2.2, shade(main, -0.32), 'wood');
  roundedBoxAt(g, w, d - 4, h - legH - 18, 0, 0, legH, main, 1.6, 'wood');

  const dh = (h - legH - 26) / 3;
  for (let i = 0; i < 3; i++) {
    const y = legH + 6 + i * dh;
    roundedBoxAt(g, w - 10, 2.2, dh - 3, 0, d / 2 - 1.6, y, shade(main, -0.03), 1, 'wood');
    boxAt(g, 9, 2.4, 2, w / 2 - 12, d / 2 - 0.2, y + dh * 0.4, metal, 1, 0, 'metal');
  }

  // Prateleira inferior, tampo e colchonete.
  boxAt(g, w - 8, d - 10, 2, 0, 0, legH + 2, shade(main, -0.08), 1, 0, 'wood');
  roundedBoxAt(g, w + 2, d, 4, 0, 0, h - 18, shade(main, 0.06), 1.2, 'wood');
  roundedBoxAt(g, w - 14, d - 12, 8, 0, 1, h - 14, accent, 3, 'fabric');

  // Bordas de segurança nas laterais do colchonete.
  for (const sx of [-1, 1]) {
    boxAt(g, 2.4, d - 8, 13, sx * (w / 2 - 9), 0, h - 13, shade(main, -0.1), 1, 0, 'wood');
  }
}

function nursingChair(g: G, p: Palette): void {
  const { w, d, h, main, accent, dark } = p;
  const legH = 9;
  const seatH = 24;

  fourLegs(g, w, d, legH, 8, 2, 2.6, dark, 'wood');
  roundedBoxAt(g, w, d * 0.84, seatH, 0, 2, legH, main, 4, 'fabric');
  roundedBoxAt(g, w - 10, d * 0.62, 13, 0, 4, legH + seatH, accent, 4, 'fabric');

  // Braços largos e encosto alto, com almofada lombar.
  for (const sx of [-1, 1]) {
    roundedBoxAt(g, 11, d * 0.72, 26, sx * (w / 2 - 5), 2, legH + 8, shade(main, -0.05), 4, 'fabric');
  }
  roundedBoxAt(g, w, 15, h - legH - 6, 0, -d / 2 + 7, legH, main, 5, 'fabric');
  roundedBoxAt(g, w - 24, 9, 30, 0, -d / 2 + 16, legH + 20, accent, 4, 'fabric');
}

function whiteboard(g: G, p: Palette): void {
  const { w, d, h, metal } = p;
  const frame = shade(metal, -0.12);

  boxAt(g, w, d, h, 0, 0, 0, frame, 1, 0, 'metal');
  boxAt(g, w - 4, 1.4, h - 4, 0, d / 2 - 0.2, 2, '#fbfcfd', 1, 0, 'paint');
  boxAt(g, w * 0.62, 6, 2.2, 0, d / 2 + 1.8, 1, frame, 1, 0, 'metal');

  const pens = ['#c07f63', '#43626b', '#3b3f45'];
  for (let i = 0; i < pens.length; i++) {
    boxAt(g, 10, 1.6, 1.6, -w * 0.2 + i * 13, d / 2 + 2, 3.2, pens[i], 1, 0, 'paint');
  }
}

/** Pergolado: quatro pilares, vigas perimetrais e ripas de madeira. */
function pergola(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const post = 14;
  const beam = 14;
  const top = h - beam - 4;

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const x = sx * (w / 2 - post / 2);
      const z = sz * (d / 2 - post / 2);
      boxAt(g, post + 8, post + 8, 10, x, z, 0, accent, 1, 0, 'stone');
      boxAt(g, post, post, top - 10, x, z, 10, shade(main, -0.1), 1, 0, 'wood');
    }
  }

  for (const sz of [-1, 1]) boxAt(g, w, 9, beam, 0, sz * (d / 2 - 5), top, main, 1, 0, 'wood');
  for (const sx of [-1, 1]) boxAt(g, 9, d - 18, beam, sx * (w / 2 - 5), 0, top, main, 1, 0, 'wood');

  const slats = Math.max(4, Math.round(d / 40));
  for (let i = 0; i < slats; i++) {
    const z = -d / 2 + 14 + ((d - 28) * i) / Math.max(slats - 1, 1);
    boxAt(g, w - 12, 3.6, 5, 0, z, top + beam, shade(main, 0.05), 1, 0, 'wood');
  }
}

function planterBox(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const t = 4;
  const bodyH = h - 6;

  boxAt(g, w, t, bodyH, 0, -d / 2 + t / 2, 0, main, 1, 0, 'stone');
  boxAt(g, w, t, bodyH, 0, d / 2 - t / 2, 0, main, 1, 0, 'stone');
  boxAt(g, t, d - t * 2, bodyH, -w / 2 + t / 2, 0, 0, main, 1, 0, 'stone');
  boxAt(g, t, d - t * 2, bodyH, w / 2 - t / 2, 0, 0, main, 1, 0, 'stone');
  boxAt(g, w - t * 2, d - t * 2, 2, 0, 0, bodyH - 4, '#3d3128', 1, 0, 'matte');

  const count = Math.max(3, Math.round(w / 34));
  for (let i = 0; i < count; i++) {
    const x = -w / 2 + 18 + ((w - 36) * i) / Math.max(count - 1, 1);
    const r = 6 + (i % 3) * 2;
    cylinderAt(g, 1, 12, x, 0, bodyH - 8, shade(accent, -0.42), 1, 'matte');
    sphereAt(g, r, x, bodyH + 2, 0, accent, [1, 0.82, 1], 'matte');
    sphereAt(g, r * 0.72, x + r * 0.7, bodyH + 8, r * 0.4, shade(accent, 0.12), [1, 0.85, 1], 'matte');
    sphereAt(g, r * 0.6, x - r * 0.6, bodyH + 7, -r * 0.35, shade(accent, -0.1), [1, 0.9, 1], 'matte');
  }
}

/* ────────────────────────── novos móveis (qwen4) ────────────────────────── */

/** Barra reta entre dois pontos: pernas inclinadas, travessas, alças. */
function bar(
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
function rakedLeg(
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
function bottle(g: G, x: number, z: number, y: number, h: number, r: number, color: string): void {
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

/** Mesa de jantar cavalete: tampo ripado grosso, pés em A e barra com cunhas. */
function trestleTable(g: G, p: Palette): void {
  const { w, d, h, main, dark } = p;
  const topT = 6;
  const topY = h - topT;
  roundedBoxAt(g, w, d, topT, 0, 0, topY, main, 1.4, 'wood');
  const planks = Math.max(3, Math.round(d / 26));
  for (let i = 1; i < planks; i++) {
    boxAt(g, w - 6, 0.9, 0.7, 0, -d / 2 + (i * d) / planks, h - 0.7, shade(main, -0.16), 1, 0, 'wood');
  }
  boxAt(g, w - 60, 5, 8, 0, -d / 2 + 12, topY - 8, dark, 1, 0, 'wood');
  boxAt(g, w - 60, 5, 8, 0, d / 2 - 12, topY - 8, dark, 1, 0, 'wood');

  const legX = w / 2 - Math.min(52, w * 0.22);
  const spread = d / 2 - 14;
  const apex = topY - 6;
  const braceY = apex * 0.34;
  for (const sx of [-1, 1]) {
    const x = sx * legX;
    for (const sz of [-1, 1]) rakedLeg(g, 8, 8, x, sz * spread, apex, dark, 'wood');
    boxAt(g, 9, spread * 1.34 + 8, 7, x, 0, braceY, dark, 1, 0, 'wood');
    boxAt(g, 12, spread * 2 + 10, 5, x, 0, 0, shade(dark, -0.1), 1, 0, 'wood');
  }
  boxAt(g, legX * 2, 7, 9, 0, 0, braceY, dark, 1, 0, 'wood');
  for (const sx of [-1, 1]) {
    boxAt(g, 5, 9, 15, sx * (legX - 9), 0, braceY - 2, shade(main, -0.24), 1, 0, 'wood');
  }
}

/** Mesa de jantar de vidro com duas bases em X de madeira e tirante cromado. */
function glassDiningTable(g: G, p: Palette): void {
  const { w, d, h, main } = p;
  const topT = 3;
  const topY = h - topT;
  const stationX = w / 2 - Math.min(60, w * 0.24);
  const spread = d * 0.34;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      rakedLeg(g, 7, 16, sx * stationX, sz * spread, topY - 2, main, 'wood');
      boxAt(g, 9, 18, 2.5, sx * stationX, sz * spread, 0, DARK_METAL, 1, 0, 'metal');
    }
    boxAt(g, 10, 20, 3, sx * stationX, 0, topY - 3, DARK_METAL, 1, 0, 'metal');
  }
  bar(g, [-stationX, h * 0.34, 0], [stationX, h * 0.34, 0], 2.2, CHROME, 'chrome');
  roundedBoxAt(g, w, d, topT, 0, 0, topY, GLASS, 1.2, 'glass', 0.42);
  boxAt(g, w - 3, d - 3, 0.8, 0, 0, topY + topT - 0.8, '#e8f4f8', 0.5, 0, 'glass');
}

/** Mesa tulipa: pedestal único torneado e tampo redondo de mármore. */
function tulipTable(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const r = Math.min(w, d) / 2;
  const baseR = r * 0.44;
  latheAt(
    g,
    [[0, 0], [baseR, 0], [baseR, 2], [baseR * 0.92, 5], [r * 0.16, h * 0.5], [r * 0.11, h - 5], [0, h - 5]],
    0,
    0,
    0,
    main,
    'paint',
    40,
  );
  latheAt(g, [[0, 0], [r - 1, 0], [r, 1.6], [r, 4], [0, 4]], 0, 0, h - 4, accent, 'stone', 48);
  // Veios do mármore.
  for (let i = 0; i < 4; i++) {
    const a = hash(i + 3) * Math.PI;
    const len = r * (0.7 + hash(i) * 0.8);
    boxAt(g, len, 1.1 + hash(i + 7), 0.5, (hash(i + 2) - 0.5) * r * 0.5, (hash(i + 5) - 0.5) * r * 0.5, h - 0.5, shade(accent, -0.16), 0.55, a, 'stone');
  }
}

/** Mesa de centro orgânica: tampo oval de vidro sobre blocos de madeira cruzados. */
function organicCoffeeTable(g: G, p: Palette): void {
  const { w, d, h, main, dark } = p;
  const r = Math.min(w, d) / 2;
  roundedBoxAt(g, w * 0.52, 16, h - 4, -w * 0.06, -d * 0.05, 0, dark, 4, 'wood', 1, 0.42);
  roundedBoxAt(g, w * 0.4, 14, h - 6, w * 0.14, d * 0.1, 0, shade(main, -0.1), 4, 'wood', 1, -0.62);
  cylinderAt(g, 3.2, h - 4, w * 0.02, 0, 0, shade(main, -0.22), 1, 'wood');
  const top = cylinderAt(g, r, 3, 0, 0, h - 3, GLASS, 0.42, 'glass');
  top.scale.set(1, 1, 0.76);
  const shine = cylinderAt(g, r * 0.94, 0.6, 0, 0, h - 0.6, '#eaf6fa', 0.4, 'glass');
  shine.scale.set(1, 1, 0.76);
}

/** Mesa lateral tambor: corpo metálico estriado com tampo de pedra. */
function drumSideTable(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const r = Math.min(w, d) / 2;
  latheAt(g, [[0, 0], [r * 0.94, 0], [r, 3], [r, h - 6], [r * 0.97, h - 4], [0, h - 4]], 0, 0, 0, main, 'metal', 40);
  const flutes = 22;
  for (let i = 0; i < flutes; i++) {
    const a = (i / flutes) * Math.PI * 2;
    boxAt(g, 2.2, 1.6, h - 14, Math.cos(a) * r, Math.sin(a) * r, 6, shade(main, -0.14), 1, -a, 'metal');
  }
  torusAt(g, r * 0.99, 0.9, 0, 0, 5, shade(main, 0.12), 'metal');
  torusAt(g, r * 0.99, 0.9, 0, 0, h - 8, shade(main, 0.12), 'metal');
  latheAt(g, [[0, 0], [r + 1.2, 0], [r + 2, 1.4], [r + 2, 4], [0, 4]], 0, 0, h - 4, accent, 'stone', 44);
}

/** Sofá modular em L: base baixa, chaise à direita e almofadas soltas. */
function sectionalSofa(g: G, p: Palette): void {
  const { w, d, h, main, light, dark, accent } = p;
  const arm = 16;
  const backD = 20;
  const plinth = 10;
  const mainD = Math.max(88, d * 0.56);
  const extD = d - mainD;
  const chaiseW = Math.min(w * 0.38, 130);
  const cz = -d / 2 + mainD / 2;
  const seatY = plinth + 22;

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      cylinderAt(g, 2, plinth, sx * (w / 2 - 10), sz * (d / 2 - 10), 0, DARK_METAL, 1, 'metal');
    }
  }
  roundedBoxAt(g, w, mainD, 22, 0, cz, plinth, dark, 3, 'fabric');
  roundedBoxAt(g, chaiseW, extD + 2, 22, w / 2 - chaiseW / 2, -d / 2 + mainD + extD / 2 - 1, plinth, dark, 3, 'fabric');
  roundedBoxAt(g, w, backD, h - seatY, 0, -d / 2 + backD / 2, seatY, main, 5, 'fabric');
  roundedBoxAt(g, arm, mainD, 24, -w / 2 + arm / 2, cz, seatY - 4, main, 6, 'fabric');
  roundedBoxAt(g, arm, d, 24, w / 2 - arm / 2, 0, seatY - 4, main, 6, 'fabric');

  const zStart = -d / 2 + backD + 2;
  const seatL = -w / 2 + arm;
  const seatR = w / 2 - chaiseW;
  const cw = (seatR - seatL - 4) / 2;
  for (let i = 0; i < 2; i++) {
    const x = seatL + 2 + cw * (i + 0.5);
    const dep = mainD - backD - 8;
    roundedBoxAt(g, cw - 3, dep, 14, x, zStart + dep / 2, seatY, light, 4, 'fabric');
    roundedBoxAt(g, cw - 6, 14, 30, x, -d / 2 + backD + 8, seatY + 6, light, 5, 'fabric', 1, 0, -0.16);
  }
  const chW = chaiseW - arm - 2;
  const chX = w / 2 - arm - chW / 2;
  const chDep = d / 2 - 4 - zStart;
  roundedBoxAt(g, chW, chDep, 14, chX, zStart + chDep / 2, seatY, light, 4, 'fabric');
  roundedBoxAt(g, chW - 6, 14, 30, chX, -d / 2 + backD + 8, seatY + 6, light, 5, 'fabric', 1, 0, -0.16);
  // Almofadas decorativas e manta sobre a chaise.
  roundedBoxAt(g, 34, 10, 34, seatL + 26, -d / 2 + backD + 18, seatY + 12, accent, 5, 'fabric', 1, 0.3, -0.28);
  roundedBoxAt(g, 30, 10, 30, seatR - 22, -d / 2 + backD + 18, seatY + 12, shade(accent, 0.16), 5, 'fabric', 1, -0.26, -0.28);
  roundedBoxAt(g, chW - 10, 46, 3, chX, d / 2 - 32, seatY + 14, shade(accent, -0.18), 2, 'fabric', 1, 0.06);
}

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

/** Banqueta industrial: assento estampado, pernas abertas e travessas tubulares. */
function industrialStool(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const seatY = h * 0.72;
  const footX = w / 2 - 2;
  const footZ = d / 2 - 2;
  const topX = w / 2 - 9;
  const topZ = d / 2 - 9;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      bar(g, [sx * footX, 0, sz * footZ], [sx * topX, seatY, sz * topZ], 1.7, accent, 'metal');
      sphereAt(g, 1.9, sx * footX, 1.2, sz * footZ, DARK_METAL, [1, 0.6, 1], 'metal');
    }
  }
  const braceY = h * 0.3;
  const t = braceY / seatY;
  const bx = footX + (topX - footX) * t;
  const bz = footZ + (topZ - footZ) * t;
  for (const sz of [-1, 1]) bar(g, [-bx, braceY, sz * bz], [bx, braceY, sz * bz], 1.3, accent, 'metal');
  for (const sx of [-1, 1]) bar(g, [sx * bx, braceY, -bz], [sx * bx, braceY, bz], 1.3, accent, 'metal');

  roundedBoxAt(g, w - 12, d - 12, 3.4, 0, 0, seatY, main, 1.4, 'metal');
  boxAt(g, w - 18, d - 18, 1, 0, 0, seatY + 3.4, shade(main, 0.08), 1, 0, 'metal');
  for (const sx of [-1, 1]) {
    boxAt(g, 2, d - 14, 3, sx * (w / 2 - 7), 0, seatY - 2, shade(main, -0.12), 1, 0, 'metal');
    bar(g, [sx * topX, seatY, -topZ], [sx * (topX - 2), h - 6, -topZ + 3], 1.6, accent, 'metal');
  }
  roundedBoxAt(g, w - 16, 3, 14, 0, -topZ + 3, h - 16, main, 1.4, 'metal');
}

/** Aparador mid-century: portas ripadas, pés palito inclinados e puxadores latão. */
function midCenturySideboard(g: G, p: Palette): void {
  const { w, d, h, main, dark, accent } = p;
  const legH = 22;
  const bodyH = h - legH - 4;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      bar(
        g,
        [sx * (w / 2 - 6), 0, sz * (d / 2 - 6)],
        [sx * (w / 2 - 14), legH, sz * (d / 2 - 12)],
        2.2,
        dark,
        'wood',
      );
    }
  }
  roundedBoxAt(g, w, d, bodyH, 0, 0, legH, main, 1.2, 'wood');
  roundedBoxAt(g, w + 4, d + 3, 4, 0, 0, h - 4, shade(main, 0.06), 1, 'wood');
  const doors = 4;
  const dw = (w - 6 - (doors - 1) * 2) / doors;
  for (let i = 0; i < doors; i++) {
    const x = -w / 2 + 3 + dw / 2 + i * (dw + 2);
    roundedBoxAt(g, dw, 2, bodyH - 8, x, d / 2 + 0.6, legH + 4, shade(main, i % 2 ? -0.03 : 0.02), 0.8, 'wood');
    const slats = Math.max(4, Math.round(dw / 6));
    for (let s = 0; s < slats; s++) {
      const sx2 = x - dw / 2 + 2.5 + (s * (dw - 5)) / Math.max(slats - 1, 1);
      boxAt(g, 1.8, 1.2, bodyH - 14, sx2, d / 2 + 1.8, legH + 7, shade(main, -0.16), 1, 0, 'wood');
    }
    boxAt(g, 2.2, 3, 12, x + (i % 2 ? -dw / 2 + 4 : dw / 2 - 4), d / 2 + 2.4, legH + bodyH * 0.45, accent, 1, 0, 'metal');
  }
  boxAt(g, w - 8, 1.6, 1.6, 0, -d / 2 + 2, legH + 2, shade(main, -0.2), 1, 0, 'wood');
}

/** Cristaleira: portas de vidro com caixilho, prateleiras de vidro, louças e LED. */
function displayCabinet(g: G, p: Palette): void {
  const { w, d, h, main, dark, accent } = p;
  const plinth = 10;
  const t = 3;
  boxAt(g, w - 8, d - 8, plinth, 0, 0, 0, shade(main, -0.3), 1, 0, 'wood');
  for (const sx of [-1, 1]) boxAt(g, t, d, h - plinth, sx * (w / 2 - t / 2), 0, plinth, main, 1, 0, 'wood');
  boxAt(g, w - 2 * t, 1.6, h - plinth, 0, -d / 2 + 0.8, plinth, shade(main, -0.22), 1, 0, 'wood');
  boxAt(g, w, d, t, 0, 0, plinth, shade(main, -0.08), 1, 0, 'wood');
  boxAt(g, w + 6, d + 4, 5, 0, 0, h - 5, shade(main, 0.05), 1, 0, 'wood');
  boxAt(g, w + 2, d + 2, 3, 0, 0, h - 8, dark, 1, 0, 'wood');

  const rows = 3;
  const innerH = h - plinth - 14;
  for (let i = 1; i <= rows; i++) {
    const y = plinth + (i * innerH) / (rows + 1);
    boxAt(g, w - 2 * t - 2, d - 6, 1.6, 0, 0, y, GLASS, 0.4, 0, 'glass');
    for (let k = 0; k < 3; k++) {
      const plate = cylinderAt(g, 9, 1.2, -w * 0.26 + k * 3.2, -d * 0.05, y + 10.4, PORCELAIN, 1, 'ceramic');
      plate.rotation.x = Math.PI / 2;
    }
    for (let k = 0; k < 3; k++) {
      cylinderAt(g, 3, 11, w * 0.1 + k * 8, d * 0.05, y + 1.6, '#dfeef2', 0.55, 'glass');
    }
    latheAt(g, [[0, 0], [6, 0], [8, 5], [8.6, 8], [7.4, 8], [6.6, 5], [0, 2]], w * 0.32, -d * 0.12, y + 1.6, accent, 'ceramic', 24);
  }
  bottle(g, -w * 0.3, d * 0.12, plinth + t, 26, 4, shade(accent, -0.3));

  const dw = (w - 4) / 2;
  const dh = h - plinth - 14;
  const y0 = plinth + 5;
  for (let i = 0; i < 2; i++) {
    const x = -w / 2 + 2 + dw / 2 + i * dw;
    boxAt(g, dw - 4, 1.2, dh - 8, x, d / 2 - 0.6, y0 + 4, GLASS, 0.26, 0, 'glass');
    for (const sx of [-1, 1]) boxAt(g, 4, 2.4, dh, x + sx * (dw / 2 - 2), d / 2 - 0.6, y0, main, 1, 0, 'wood');
    boxAt(g, dw, 2.4, 4, x, d / 2 - 0.6, y0, main, 1, 0, 'wood');
    boxAt(g, dw, 2.4, 4, x, d / 2 - 0.6, y0 + dh - 4, main, 1, 0, 'wood');
    boxAt(g, dw - 6, 2, 2, x, d / 2 - 0.6, y0 + dh * 0.5, main, 1, 0, 'wood');
    boxAt(g, 2, 2.6, 14, x + (i ? -dw / 2 + 5 : dw / 2 - 5), d / 2 + 0.8, y0 + dh * 0.42, accent, 1, 0, 'metal');
  }
  boxAt(g, w - 14, 1.2, 1.2, 0, d / 2 - 6, h - 12, '#fff3cf', 1, 0, 'emissive');
}

/** Estante industrial: montantes metálicos, X no fundo e prateleiras de madeira. */
function industrialShelf(g: G, p: Palette): void {
  const { w, d, h, main, accent } = p;
  const post = 3.4;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      boxAt(g, post, post, h, sx * (w / 2 - post / 2), sz * (d / 2 - post / 2), 0, accent, 1, 0, 'metal');
      boxAt(g, post + 3, post + 3, 1.6, sx * (w / 2 - post / 2), sz * (d / 2 - post / 2), 0, DARK_METAL, 1, 0, 'metal');
    }
  }
  bar(g, [-w / 2 + 3, 5, -d / 2 + 2], [w / 2 - 3, h - 5, -d / 2 + 2], 1.2, accent, 'metal');
  bar(g, [w / 2 - 3, 5, -d / 2 + 2], [-w / 2 + 3, h - 5, -d / 2 + 2], 1.2, accent, 'metal');

  const bookColors = ['#a8583f', '#4f6d7a', '#7d8a63', '#c2a469', '#6f5f7a'];
  const rows = 5;
  for (let i = 0; i < rows; i++) {
    const y = 6 + (i * (h - 18)) / (rows - 1);
    boxAt(g, w - 4, d - 2, 3.2, 0, 0, y, main, 1, 0, 'wood');
    boxAt(g, w - 4, 1.4, 1.4, 0, d / 2 - 1, y + 3.2, shade(main, -0.18), 1, 0, 'wood');
    const top = y + 3.2;
    if (i % 3 === 0) {
      for (let b = 0; b < 6; b++) {
        const bh = 16 + hash(i * 9 + b) * 10;
        boxAt(g, 3.4, d * 0.6, bh, -w / 2 + 12 + b * 4.6, -d * 0.06, top, bookColors[(i + b) % bookColors.length], 1, 0, 'matte');
      }
      boxAt(g, 26, d * 0.62, 18, w * 0.26, 0, top, shade(main, -0.12), 1, 0, 'wood');
    } else if (i % 3 === 1) {
      boxAt(g, w * 0.3, d * 0.66, 20, -w * 0.24, 0, top, '#d9d2c4', 1, 0, 'fabric');
      boxAt(g, w * 0.3, d * 0.66, 1.6, -w * 0.24, 0, top + 20, shade(accent, -0.1), 1, 0, 'metal');
      cylinderAt(g, 5, 12, w * 0.22, 0, top, '#8a6142', 1, 'ceramic');
      sphereAt(g, 7, w * 0.22, top + 20, 0, '#7d8a63', [1, 0.85, 1], 'foliage');
    } else {
      for (let b = 0; b < 4; b++) {
        boxAt(g, 3, d * 0.55, 20, w * 0.1 + b * 4, 0, top, bookColors[(i + b) % bookColors.length], 1, 0, 'matte');
      }
      latheAt(g, [[0, 0], [6, 0], [7.5, 6], [6, 14], [4, 17], [0, 17]], -w * 0.26, 0, top, PORCELAIN, 'ceramic', 24);
    }
  }
}

/** Carrinho de bar: tubular dourado com rodízios, vidros, garrafas e balde de gelo. */
function barCart(g: G, p: Palette): void {
  const { w, d, h, accent } = p;
  const low = 18;
  const top = h - 14;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      bar(g, [sx * (w / 2 - 4), 6, sz * (d / 2 - 4)], [sx * (w / 2 - 4), top + 4, sz * (d / 2 - 4)], 2, accent, 'metal');
      const wheel = cylinderAt(g, 3.2, 2, sx * (w / 2 - 4), sz * (d / 2 - 4), 3, DARK_METAL, 1, 'metal');
      wheel.rotation.z = Math.PI / 2;
    }
  }
  tubeAt(
    g,
    [[-w / 2 + 4, top + 4, -d / 2 + 4], [-w / 2 + 4, h, -d / 2 + 4], [w / 2 - 4, h, -d / 2 + 4], [w / 2 - 4, top + 4, -d / 2 + 4]],
    2,
    0,
    0,
    0,
    accent,
    'metal',
  );
  for (const y of [low, top]) {
    boxAt(g, w - 8, d - 8, 1.6, 0, 0, y, GLASS, 0.4, 0, 'glass');
    for (const sz of [-1, 1]) bar(g, [-w / 2 + 4, y + 1.6, sz * (d / 2 - 4)], [w / 2 - 4, y + 1.6, sz * (d / 2 - 4)], 1.4, accent, 'metal');
    for (const sx of [-1, 1]) bar(g, [sx * (w / 2 - 4), y + 1.6, -d / 2 + 4], [sx * (w / 2 - 4), y + 1.6, d / 2 - 4], 1.4, accent, 'metal');
  }
  bottle(g, -w * 0.3, -d * 0.1, top + 1.6, 30, 4.2, '#3f5d43');
  bottle(g, -w * 0.14, d * 0.12, top + 1.6, 24, 4.6, '#8a4a2c');
  bottle(g, w * 0.02, -d * 0.14, top + 1.6, 27, 4, '#2f3f52');
  for (let i = 0; i < 3; i++) {
    cylinderAt(g, 3.2, 9, w * 0.2 + i * 8, d * 0.14, top + 1.6, '#dfeef2', 0.5, 'glass');
  }
  latheAt(g, [[0, 0], [8, 0], [9.5, 4], [10, 16], [9, 16], [8.6, 4], [0, 2]], w * 0.26, -d * 0.12, low + 1.6, CHROME, 'chrome', 26);
  sphereAt(g, 3, w * 0.26, low + 17, -d * 0.12, '#eaf6fa', [1, 0.8, 1], 'glass');
  for (let i = 0; i < 4; i++) {
    bottle(g, -w * 0.3 + i * 11, d * 0.08, low + 1.6, 22, 3.6, i % 2 ? '#4a5d3a' : '#6b3f2a');
  }
}

function generic(g: G, p: Palette, category: CategoryId): void {
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

export function buildFurniture(item: Item): THREE.Group {
  const group = new THREE.Group();
  group.position.set(item.x, 0, item.y);
  group.rotation.y = -item.rot * DEG;

  const { height, base } = itemHeight(item.defId);
  const main = item.colors.main ?? '#c9a37a';
  const accent = item.colors.accent ?? shade(main, 0.14);
  const palette: Palette = {
    id: item.defId,
    w: item.w,
    d: item.d,
    h: height,
    base,
    ceil: CEILING - base,
    main,
    accent,
    dark: shade(main, -0.16),
    light: shade(main, 0.1),
    metal: item.colors.metal ?? accent,
  };

  const body = new THREE.Group();
  body.position.y = base;
  group.add(body);

  switch (item.defId) {
    case 'sofa-2':
      sofa(body, palette, 2, false);
      break;
    case 'sofa-3':
      sofa(body, palette, 3, false);
      break;
    case 'sofa-chaise':
      sofa(body, palette, 2, true);
      break;
    case 'poltrona':
      sofa(body, palette, 1, false);
      break;
    case 'puff': {
      const r = Math.min(item.w, item.d) / 2 - 2;
      latheAt(
        body,
        [[0, 0], [r * 0.84, 0], [r * 0.96, 5], [r, 14], [r, 30], [r * 0.96, 37], [r * 0.82, 42], [0, 42]],
        0,
        0,
        0,
        main,
        'fabric',
        30,
      );
      torusAt(body, r * 0.985, 0.9, 0, 0, 22, shade(main, -0.16), 'fabric');
      fourLegs(body, item.w, item.d, 6, 8, 1.2, 1.6, shade(main, -0.35), 'wood');
      break;
    }
    case 'cadeira-jantar':
      chair(body, palette);
      break;
    case 'cadeira-escritorio':
      officeChair(body, palette, item.colors.accent ?? '#b8bcc1');
      break;
    case 'cadeira-executiva':
      executiveChair(body, palette);
      break;
    case 'cadeira-concha':
      shellChair(body, palette);
      break;
    case 'banqueta':
      stool(body, palette);
      break;
    case 'rack-painel-grande':
      mediaWall(body, palette, true);
      break;
    case 'rack-medio':
      mediaWall(body, palette, false);
      break;
    case 'closet-aberto-pequeno':
      openCloset(body, palette, 2);
      break;
    case 'closet-aberto-medio':
      openCloset(body, palette, 3);
      break;
    case 'closet-aberto-grande':
      openCloset(body, palette, 4);
      break;
    case 'mesa-jantar-4':
    case 'mesa-jantar-6':
      table(body, palette);
      break;
    case 'mesa-centro':
      coffeeTable(body, palette);
      break;
    case 'mesa-lateral':
      sideTable(body, palette);
      break;
    case 'mesa-escritorio':
      desk(body, palette);
      break;
    case 'mesa-l':
      lDesk(body, palette);
      break;
    case 'mesa-redonda':
    case 'mesa-varanda':
      roundTable(body, palette);
      break;
    case 'cama-solteiro':
    case 'cama-casal':
    case 'cama-king':
      bed(body, palette);
      break;
    case 'beliche-simples':
      bunkBed(body, palette, false);
      break;
    case 'beliche-escritorio':
      bunkBed(body, palette, true);
      break;
    case 'berco':
      crib(body, palette);
      break;
    case 'criado-mudo':
      nightstand(body, palette);
      break;
    case 'cabeceira': {
      roundedBoxAt(body, item.w, item.d, height, 0, 0, 0, main, 3, 'fabric');
      const channels = Math.max(3, Math.round(item.w / 40));
      const cw = item.w / channels;
      for (let i = 1; i < channels; i++) {
        boxAt(body, 1.2, 2, height - 12, -item.w / 2 + cw * i, item.d / 2 - 0.6, 6, shade(main, -0.16), 1, 0, 'fabric');
      }
      boxAt(body, item.w, 2.4, 4, 0, item.d / 2 - 0.4, height - 5, shade(main, 0.08), 1, 0, 'wood');
      break;
    }
    case 'guarda-roupa':
      wardrobe(body, palette);
      break;
    case 'comoda':
      drawers(body, palette, 3);
      break;
    case 'sapateira':
      drawers(body, palette, 4);
      break;
    case 'estante':
      shelf(body, palette);
      break;
    case 'nicho-quarto':
      wallNiche(body, palette);
      break;
    case 'prateleira-quarto':
      wallShelf(body, palette);
      break;
    case 'prateleira-cozinha':
      kitchenShelf(body, palette);
      break;
    case 'estante-cubos':
      cubeShelf(body, palette);
      break;
    case 'rack-tv':
      rack(body, palette);
      break;
    case 'balcao':
      counter(body, palette, false);
      break;
    case 'pia':
      counter(body, palette, true);
      break;
    case 'fogao':
      stove(body, palette);
      break;
    case 'coifa':
      hood(body, palette);
      break;
    case 'geladeira':
      fridge(body, palette);
      break;
    case 'lava-loucas':
      dishwasher(body, palette);
      break;
    case 'ilha':
      island(body, palette);
      break;
    case 'vaso':
      toilet(body, palette);
      break;
    case 'lavatorio':
      vanity(body, palette);
      break;
    case 'banheira':
      bathtub(body, palette);
      break;
    case 'box':
      shower(body, palette);
      break;
    case 'espelho':
      mirror(body, palette);
      break;
    case 'espelho-quadrado-led':
      ledMirror(body, palette);
      break;
    case 'espelho-redondo-pendente':
      strapMirror(body, palette);
      break;
    case 'lavatorio-suspenso-quadrado':
      floatingVanity(body, palette, true);
      break;
    case 'lavatorio-suspenso-redondo':
      floatingVanity(body, palette, false);
      break;
    case 'tv':
      tv(body, palette);
      break;
    case 'ar-split':
      airSplit(body, palette);
      break;
    case 'maquina-lavar':
      appliance(body, palette, false);
      break;
    case 'secadora':
      appliance(body, palette, true);
      break;
    case 'piso-madeira':
    case 'piso-porcelanato':
    case 'piso-ceramica':
    case 'piso-concreto':
    case 'piso-carpete':
    case 'piso-grama':
      pisoItem(body, palette, item.defId);
      break;
    case 'tapete':
      rug(body, palette);
      break;
    case 'tapete-redondo':
      rugRound(body, palette);
      break;
    case 'tapete-listrado':
      rugStriped(body, palette);
      break;
    case 'tapete-peludo':
      rugFluffy(body, palette);
      break;
    case 'planta-vaso':
      plant(body, palette, 80);
      break;
    case 'planta-grande':
      plant(body, palette, 150);
      break;
    case 'luminaria-piso':
      floorLamp(body, palette);
      break;
    case 'pendente':
      pendant(body, palette);
      break;
    case 'quadro':
      picture(body, palette);
      break;
    case 'lareira':
      fireplace(body, palette);
      break;
    case 'enfeite-peixes':
      wallFish(body, palette);
      break;
    case 'enfeite-circulos':
      wallCircles(body, palette);
      break;
    case 'divisoria-plantas':
      plantDivider(body, palette);
      break;
    case 'piscina':
      pool(body, palette);
      break;
    case 'espreguicadeira':
      lounger(body, palette);
      break;
    case 'churrasqueira':
      grill(body, palette);
      break;
    case 'banco-jardim':
      gardenBench(body, palette);
      break;
    case 'pilar':
      pillar(body, palette);
      break;
    case 'escada-reta':
      stairs(body, palette, false);
      break;
    case 'escada-l':
      stairs(body, palette, true);
      break;
    case 'tanque':
      laundrySink(body, palette);
      break;
    case 'varal':
      dryingRack(body, palette);
      break;
    case 'cesto-roupas':
      laundryBasket(body, palette);
      break;
    case 'ilha-closet':
      closetIsland(body, palette);
      break;
    case 'arara-roupas':
      garmentRack(body, palette);
      break;
    case 'trocador':
      changingTable(body, palette);
      break;
    case 'poltrona-amamentacao':
      nursingChair(body, palette);
      break;
    case 'gaveteiro':
      drawers(body, palette, 3, false);
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          sphereAt(body, 2.6, sx * (item.w / 2 - 5), 3, sz * (item.d / 2 - 5), DARK_METAL, [1, 1, 1], 'metal');
        }
      }
      break;
    case 'quadro-branco':
      whiteboard(body, palette);
      break;
    case 'pergolado':
      pergola(body, palette);
      break;
    case 'jardineira':
      planterBox(body, palette);
      break;
    case 'geladeira-side-by-side':
      sideBySideFridge(body, palette);
      break;
    case 'geladeira-retro':
      retroFridge(body, palette);
      break;
    case 'mesa-jantar-cavalete':
      trestleTable(body, palette);
      break;
    case 'mesa-jantar-vidro':
      glassDiningTable(body, palette);
      break;
    case 'mesa-tulipa':
      tulipTable(body, palette);
      break;
    case 'mesa-centro-organica':
      organicCoffeeTable(body, palette);
      break;
    case 'mesa-lateral-tambor':
      drumSideTable(body, palette);
      break;
    case 'sofa-modular-l':
      sectionalSofa(body, palette);
      break;
    case 'poltrona-egg':
      eggChair(body, palette);
      break;
    case 'banqueta-industrial':
      industrialStool(body, palette);
      break;
    case 'aparador-mid-century':
      midCenturySideboard(body, palette);
      break;
    case 'cristaleira':
      displayCabinet(body, palette);
      break;
    case 'estante-industrial':
      industrialShelf(body, palette);
      break;
    case 'carrinho-bar':
      barCart(body, palette);
      break;
    default:
      generic(body, palette, getDef(item.defId)?.category ?? 'decoracao');
      break;
  }

  return group;
}
