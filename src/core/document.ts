/** Modelo de dados versionado da planta. */
import type { Rect, Vec2 } from './geometry';
import { boundsOfPoints, obbCorners, polygonArea, unionRect } from './geometry';
import { uid } from './ids';
import { createItem, getDef } from '../catalog/registry';

export type Id = string;

export type OpeningKind =
  | 'porta'
  | 'porta-dupla'
  | 'porta-correr'
  | 'porta-garagem'
  | 'janela'
  | 'janela-correr'
  | 'vao';

export interface Wall {
  id: Id;
  a: Vec2;
  b: Vec2;
  thickness: number;
  /** Cor legada aplicada às duas faces; ausente usa o acabamento padrão. */
  color?: string;
  /** Cor da face à esquerda ao seguir a direção de a para b. */
  colorLeft?: string;
  /** Cor da face à direita ao seguir a direção de a para b. */
  colorRight?: string;
}

/** Acabamento padrão das paredes. */
export const DEFAULT_WALL_COLOR = '#f1ede3';

/** Resolve as duas faces, preservando a cor única das plantas antigas. */
export function wallFaceColors(wall: Wall): { left: string; right: string } {
  const fallback = wall.color ?? DEFAULT_WALL_COLOR;
  return {
    left: wall.colorLeft ?? fallback,
    right: wall.colorRight ?? fallback,
  };
}

export interface WallColor {
  name: string;
  value: string;
}

/** Cores de parede oferecidas no inspetor. */
export const WALL_COLORS: WallColor[] = [
  { name: 'Branco gelo', value: DEFAULT_WALL_COLOR },
  { name: 'Branco', value: '#f4f1ea' },
  { name: 'Off-white', value: '#e6e0d3' },
  { name: 'Cinza claro', value: '#c9ccce' },
  { name: 'Bege', value: '#dcd2c1' },
  { name: 'Verde-sálvia', value: '#9aa992' },
  { name: 'Areia', value: '#d8bb92' },
];

export interface Opening {
  id: Id;
  wallId: Id;
  /** distância em cm do início da parede até o centro do vão */
  offset: number;
  width: number;
  kind: OpeningKind;
  /** inverte o lado de abertura */
  flip: boolean;
  /** lado da dobradiça quando aplicável */
  hinge: 'esq' | 'dir';
  /** cor da folha no 3D; ausente usa o acabamento padrão */
  color?: string;
}

/** Acabamento padrão da folha das portas. */
export const DEFAULT_DOOR_COLOR = '#d9c4a5';

export interface DoorColor {
  name: string;
  value: string;
}

/** Cores de folha oferecidas no inspetor. */
export const DOOR_COLORS: DoorColor[] = [
  { name: 'Pinho', value: DEFAULT_DOOR_COLOR },
  { name: 'Carvalho claro', value: '#d8bb92' },
  { name: 'Freijó', value: '#c19a6b' },
  { name: 'Nogueira', value: '#8a6142' },
  { name: 'Ébano', value: '#4a3a30' },
  { name: 'Branco', value: '#f4f1ea' },
  { name: 'Off-white', value: '#e6e0d3' },
  { name: 'Cinza claro', value: '#c9ccce' },
  { name: 'Verde-sálvia', value: '#9aa992' },
  { name: 'Preto', value: '#33373c' },
];

export type FloorKey = 'madeira' | 'amadeirado' | 'porcelanato' | 'ceramica' | 'granito' | 'marmore' | 'concreto' | 'carpete' | 'grama';

export interface FloorMaterial {
  key: FloorKey;
  name: string;
  base: string;
  line: string;
}

export const FLOORS: FloorMaterial[] = [
  { key: 'madeira', name: 'Madeira', base: '#e9d9c0', line: 'rgba(150, 112, 72, 0.32)' },
  { key: 'amadeirado', name: 'Amadeirado', base: '#8a5a34', line: 'rgba(58, 32, 16, 0.55)' },
  { key: 'porcelanato', name: 'Porcelanato', base: '#efece4', line: 'rgba(130, 130, 124, 0.18)' },
  { key: 'ceramica', name: 'Cerâmica', base: '#e8e5db', line: 'rgba(112, 122, 124, 0.26)' },
  { key: 'granito', name: 'Granito', base: '#3c4046', line: 'rgba(18, 21, 25, 0.62)' },
  { key: 'marmore', name: 'Mármore', base: '#e0cfae', line: 'rgba(126, 104, 74, 0.42)' },
  { key: 'concreto', name: 'Concreto', base: '#dedbd2', line: 'rgba(96, 100, 104, 0.14)' },
  { key: 'carpete', name: 'Carpete', base: '#dcd6c7', line: 'rgba(124, 112, 96, 0.2)' },
  { key: 'grama', name: 'Grama', base: '#ccd8b6', line: 'rgba(88, 108, 68, 0.26)' },
];

export function floorMaterial(key: FloorKey): FloorMaterial {
  return FLOORS.find((f) => f.key === key) ?? FLOORS[0];
}

export interface Room {
  id: Id;
  points: Vec2[];
  name: string;
  floor: FloorKey;
}

export interface Item {
  id: Id;
  defId: string;
  /** centro do móvel em cm */
  x: number;
  y: number;
  w: number;
  d: number;
  /** rotação em graus, horária */
  rot: number;
  /** altura da base no 3D, em cm; ausente usa a altura padrão do modelo */
  elevation?: number;
  colors: Record<string, string>;
  label?: string;
  locked?: boolean;
  hidden?: boolean;
  z: number;
}

/** Imagem de referência (planta escaneada ou foto) usada por baixo do desenho. */
export interface Underlay {
  /** data URL já reduzida (JPEG) */
  image: string;
  /** canto superior esquerdo em cm */
  x: number;
  y: number;
  /** largura em cm (define a escala) */
  w: number;
  /** altura em cm, derivada da proporção da imagem */
  h: number;
  /** rotação em graus, em torno do centro */
  rot: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
}

export interface PlanSettings {
  grid: number;
  snap: boolean;
  showGrid: boolean;
  showDims: boolean;
  showAreas: boolean;
  wallThickness: number;
  /** Cor do papel de desenho no editor e nas exportações com fundo. */
  background: string;
}

export interface BackgroundColor {
  name: string;
  value: string;
}

/** Fundos rápidos para dar contraste à planta. */
export const BACKGROUND_COLORS: BackgroundColor[] = [
  { name: 'Papel', value: '#f1eee6' },
  { name: 'Cinza suave', value: '#d9dde1' },
  { name: 'Azul névoa', value: '#d3dce6' },
  { name: 'Areia', value: '#e1d6c4' },
  { name: 'Verde suave', value: '#d3ddd0' },
  { name: 'Grafite', value: '#4b5560' },
];

export interface Plan {
  id: Id;
  version: number;
  name: string;
  settings: PlanSettings;
  walls: Wall[];
  openings: Opening[];
  rooms: Room[];
  items: Item[];
  underlay?: Underlay;
}

export const PLAN_VERSION = 2;

export function defaultSettings(): PlanSettings {
  return {
    grid: 10,
    snap: true,
    showGrid: true,
    showDims: true,
    showAreas: true,
    wallThickness: 15,
    background: '#f1eee6',
  };
}

export function emptyPlan(name = 'Nova planta'): Plan {
  return {
    id: uid('plan'),
    version: PLAN_VERSION,
    name,
    settings: defaultSettings(),
    walls: [],
    openings: [],
    rooms: [],
    items: [],
  };
}

export function clonePlan(plan: Plan): Plan {
  return JSON.parse(JSON.stringify(plan)) as Plan;
}

/** Limite de tamanho da imagem embutida, para não estourar o armazenamento local. */
const MAX_UNDERLAY_IMAGE = 2_800_000;

function normalizeUnderlay(raw: unknown): Underlay | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const data = raw as Partial<Underlay>;
  if (typeof data.image !== 'string' || data.image.length < 32 || data.image.length > MAX_UNDERLAY_IMAGE) {
    return undefined;
  }
  const w = Number(data.w);
  const h = Number(data.h);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w < 5 || h < 5) return undefined;

  const x = Number(data.x);
  const y = Number(data.y);
  const rot = Number(data.rot);
  const opacity = Number(data.opacity);
  return {
    image: data.image,
    x: Number.isFinite(x) ? x : 0,
    y: Number.isFinite(y) ? y : 0,
    w,
    h,
    rot: Number.isFinite(rot) ? rot : 0,
    opacity: Number.isFinite(opacity) ? Math.min(1, Math.max(0.05, opacity)) : 0.45,
    visible: data.visible !== false,
    locked: !!data.locked,
  };
}

/** Normaliza dados carregados de JSON/localStorage com tolerância a versões antigas. */
export function normalizePlan(raw: unknown): Plan {
  const base = emptyPlan();
  if (!raw || typeof raw !== 'object') return base;
  const data = raw as Partial<Plan>;
  const plan: Plan = {
    id: typeof data.id === 'string' && data.id ? data.id : base.id,
    version: PLAN_VERSION,
    name: typeof data.name === 'string' && data.name.trim() ? data.name.trim() : base.name,
    settings: {
      ...base.settings,
      ...(data.settings ?? {}),
      background:
        typeof data.settings?.background === 'string' && /^#[0-9a-f]{6}$/i.test(data.settings.background)
          ? data.settings.background
          : base.settings.background,
    },
    walls: Array.isArray(data.walls)
      ? data.walls
          .filter((w): w is Wall => !!w && !!w.a && !!w.b)
          .map((w) => ({
            id: w.id ?? uid('wl'),
            a: { x: Number(w.a.x) || 0, y: Number(w.a.y) || 0 },
            b: { x: Number(w.b.x) || 0, y: Number(w.b.y) || 0 },
            thickness: Number(w.thickness) || base.settings.wallThickness,
            color: typeof w.color === 'string' && w.color ? w.color : undefined,
            colorLeft: typeof w.colorLeft === 'string' && w.colorLeft ? w.colorLeft : undefined,
            colorRight: typeof w.colorRight === 'string' && w.colorRight ? w.colorRight : undefined,
          }))
      : [],
    openings: [],
    rooms: Array.isArray(data.rooms)
      ? data.rooms
          .filter((r): r is Room => !!r && Array.isArray(r.points) && r.points.length >= 3)
          .map((r) => ({
            id: r.id ?? uid('rm'),
            points: r.points.map((p) => ({ x: Number(p.x) || 0, y: Number(p.y) || 0 })),
            name: r.name || 'Ambiente',
            floor: r.floor ?? 'madeira',
          }))
      : [],
    items: Array.isArray(data.items)
      ? data.items
          .filter((i): i is Item => !!i && typeof i.defId === 'string' && !!getDef((i as Item).defId))
          .map((i) => {
            const def = getDef(i.defId)!;
            return {
              id: i.id ?? uid('it'),
              defId: i.defId,
              x: Number(i.x) || 0,
              y: Number(i.y) || 0,
              w: Number(i.w) || def.w,
              d: Number(i.d) || def.d,
              rot: Number(i.rot) || 0,
              elevation: Number.isFinite(Number(i.elevation))
                ? Math.max(0, Number(i.elevation))
                : undefined,
              colors: { ...(def.colors ?? {}), ...(i.colors ?? {}) },
              label: i.label,
              locked: !!i.locked,
              hidden: !!i.hidden,
              z: Number(i.z) || 0,
            };
          })
      : [],
    underlay: normalizeUnderlay(data.underlay),
  };

  const wallIds = new Set(plan.walls.map((w) => w.id));
  plan.openings = Array.isArray(data.openings)
    ? data.openings
        .filter((o): o is Opening => !!o && wallIds.has(o.wallId))
        .map((o) => ({
          id: o.id ?? uid('op'),
          wallId: o.wallId,
          offset: Number(o.offset) || 0,
          width: Math.max(20, Number(o.width) || 90),
          kind: o.kind ?? 'porta',
          flip: !!o.flip,
          hinge: o.hinge === 'dir' ? 'dir' : 'esq',
          color: typeof o.color === 'string' && o.color ? o.color : undefined,
        }))
    : [];
  return plan;
}

/** Trecho ocupado de uma parede, já descontando os vãos das aberturas. */
export function wallParts(wall: Wall, openings: Opening[]): [number, number][] {
  const len = Math.hypot(wall.b.x - wall.a.x, wall.b.y - wall.a.y);
  const gaps = openings
    .filter((o) => o.wallId === wall.id)
    .map((o) => {
      const half = Math.min(o.width, len) / 2;
      return [Math.max(0, o.offset - half), Math.min(len, o.offset + half)] as [number, number];
    })
    .sort((p, q) => p[0] - q[0]);

  const parts: [number, number][] = [];
  let cursor = 0;
  for (const [start, end] of gaps) {
    if (end <= cursor) continue;
    if (start > cursor + 0.5) parts.push([cursor, Math.min(start, len)]);
    cursor = Math.max(cursor, end);
  }
  if (cursor < len - 0.5) parts.push([cursor, len]);
  return parts;
}

export function itemBounds(item: Item): Rect {
  return boundsOfPoints(obbCorners({ x: item.x, y: item.y }, item.w, item.d, item.rot));
}

export function planBounds(plan: Plan): Rect | null {
  let rect: Rect | null = null;
  for (const w of plan.walls) {
    const pad = w.thickness / 2;
    const wallRect: Rect = {
      x: Math.min(w.a.x, w.b.x) - pad,
      y: Math.min(w.a.y, w.b.y) - pad,
      w: Math.abs(w.a.x - w.b.x) + pad * 2,
      h: Math.abs(w.a.y - w.b.y) + pad * 2,
    };
    rect = unionRect(rect, wallRect);
  }
  for (const room of plan.rooms) {
    if (room.points.length) rect = unionRect(rect, boundsOfPoints(room.points));
  }
  for (const item of plan.items) {
    if (item.hidden) continue;
    rect = unionRect(rect, itemBounds(item));
  }
  return rect;
}

export interface PlanStats {
  items: number;
  walls: number;
  rooms: number;
  areaCm2: number;
}

export function planStats(plan: Plan): PlanStats {
  return {
    items: plan.items.length,
    walls: plan.walls.length,
    rooms: plan.rooms.length,
    areaCm2: plan.rooms.reduce((sum, room) => sum + polygonArea(room.points), 0),
  };
}

export function roomAreaCm2(room: Room): number {
  return polygonArea(room.points);
}

/** Planta mobiliada de exemplo, aberta no primeiro acesso. */
export function examplePlan(): Plan {
  const plan = emptyPlan('Casa Exemplo');
  const t = 15;
  const wall = (id: string, ax: number, ay: number, bx: number, by: number): Wall => ({
    id,
    a: { x: ax, y: ay },
    b: { x: bx, y: by },
    thickness: t,
  });

  plan.walls = [
    wall('wl_topo', 0, 0, 1100, 0),
    wall('wl_dir', 1100, 0, 1100, 780),
    wall('wl_base', 0, 780, 1100, 780),
    wall('wl_esq', 0, 0, 0, 780),
    wall('wl_central', 560, 0, 560, 780),
    wall('wl_cozinha', 0, 470, 560, 470),
    wall('wl_q1', 560, 340, 1100, 340),
    wall('wl_corredor', 560, 450, 1100, 450),
    wall('wl_banho', 830, 450, 830, 780),
  ];

  plan.rooms = [];

  /* Pisos manuais (itens piso-*), um por ambiente do exemplo. */
  let zcPiso = -100;
  const piso = (defId: string, x0: number, y0: number, x1: number, y1: number): void => {
    const item = createItem(defId, (x0 + x1) / 2, (y0 + y1) / 2, { w: x1 - x0, d: y1 - y0 });
    if (!item) return;
    item.z = ++zcPiso;
    plan.items.push(item);
  };
  piso('piso-madeira', 0, 0, 560, 470);
  piso('piso-porcelanato', 0, 470, 560, 780);
  piso('piso-madeira', 560, 0, 1100, 340);
  piso('piso-madeira', 560, 340, 1100, 450);
  piso('piso-madeira', 560, 450, 830, 780);
  piso('piso-ceramica', 830, 450, 1100, 780);
  piso('piso-concreto', 1180, 60, 1680, 700);

  const op = (
    wallId: string,
    offset: number,
    width: number,
    kind: OpeningKind,
    extra: Partial<Opening> = {},
  ): Opening => ({ id: uid('op'), wallId, offset, width, kind, flip: false, hinge: 'esq', ...extra });

  plan.openings = [
    op('wl_esq', 250, 100, 'porta'),
    op('wl_topo', 280, 180, 'janela'),
    op('wl_topo', 830, 150, 'janela'),
    op('wl_dir', 180, 140, 'janela'),
    op('wl_dir', 610, 100, 'janela'),
    op('wl_base', 150, 150, 'janela-correr'),
    op('wl_base', 700, 120, 'janela'),
    op('wl_esq', 610, 120, 'janela'),
    op('wl_cozinha', 180, 200, 'vao'),
    op('wl_central', 395, 90, 'porta', { hinge: 'dir' }),
    op('wl_q1', 350, 85, 'porta'),
    op('wl_corredor', 120, 80, 'porta', { hinge: 'dir' }),
    op('wl_corredor', 480, 75, 'porta', { flip: true }),
  ];

  let zc = 0;
  const put = (defId: string, x: number, y: number, rot = 0, extra: Partial<Item> = {}): void => {
    const item = createItem(defId, x, y, { rot, ...extra });
    if (!item) return;
    item.z = ++zc;
    plan.items.push(item);
  };

  /* ---- Sala ---- */
  put('tapete', 250, 300, 0, { w: 280, d: 220 });
  put('sofa-3', 250, 405, 180);
  put('mesa-centro', 250, 285, 0);
  put('rack-tv', 250, 62, 0);
  put('tv', 250, 22, 0);
  put('poltrona', 450, 345, 165);
  put('planta-grande', 55, 70);
  put('luminaria-piso', 505, 400);
  put('mesa-jantar-6', 430, 180, 0);
  put('cadeira-jantar', 355, 100, 0);
  put('cadeira-jantar', 505, 100, 0);
  put('cadeira-jantar', 355, 258, 180);
  put('cadeira-jantar', 505, 258, 180);
  put('pendente', 430, 180, 0);

  /* ---- Cozinha ---- */
  put('pia', 120, 508, 0);
  put('balcao', 258, 508, 0);
  put('fogao', 348, 508, 0);
  put('coifa', 348, 496, 0);
  put('geladeira', 500, 515, 0);
  put('balcao', 48, 650, 90);
  put('ilha', 230, 700, 0);
  put('banqueta', 185, 632, 0);
  put('banqueta', 275, 632, 0);

  /* ---- Quarto 1 ---- */
  put('cama-casal', 770, 118, 0);
  put('cabeceira', 770, 16, 0);
  put('criado-mudo', 632, 38, 0);
  put('criado-mudo', 908, 38, 0);
  put('guarda-roupa', 600, 200, 90);
  put('poltrona', 1028, 178, 180);
  put('planta-vaso', 1042, 300);

  /* ---- Quarto 2 ---- */
  put('cama-solteiro', 640, 560, 0);
  put('criado-mudo', 728, 486, 0);
  put('estante', 796, 660, 90);

  /* ---- Banho ---- */
  put('box', 878, 502, 0);
  put('lavatorio', 975, 490, 0);
  put('vaso', 890, 730, 180);
  put('banheira', 1000, 660, 0);
  put('espelho', 975, 458, 0);

  /* ---- Varanda ---- */
  put('piscina', 1400, 200, 0);
  put('espreguicadeira', 1240, 450, 0);
  put('espreguicadeira', 1330, 450, 0);
  put('churrasqueira', 1450, 620, 0);
  put('mesa-varanda', 1250, 250, 0);

  return plan;
}
