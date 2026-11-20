/** Store central: documento, seleção, ferramenta, câmera e histórico. */
import type { Camera } from '../render/viewport';
import { MAX_ZOOM, MIN_ZOOM } from '../render/viewport';
import type { Id, Item, Opening, Plan, Room, Wall } from './document';
import { clonePlan, planBounds } from './document';
import type { Guide } from '../interaction/guides';
import type { Rect, Vec2 } from './geometry';
import { Signal } from './emitter';
import { itemBounds } from './document';
import { boundsOfPoints, obbCorners, unionRect } from './geometry';
import { createItem, getDef } from '../catalog/registry';

export type ToolId = 'select' | 'wall' | 'door' | 'window' | 'measure' | 'calibrate';

export type EntityKind = 'item' | 'wall' | 'room' | 'opening';

export type Overlay =
  | { type: 'wall'; a: Vec2; b: Vec2; angle: number; length: number; valid: boolean }
  | { type: 'measure'; a: Vec2; b: Vec2 }
  | { type: 'marquee'; rect: Rect }
  | { type: 'ghost'; defId: string; x: number; y: number; rot: number; w: number; d: number }
  | { type: 'wallTarget'; wallId: Id; offset: number; width: number };

export interface HistoryEntry {
  label: string;
  doc: Plan;
}

const HISTORY_LIMIT = 80;

export class Store {
  doc: Plan;
  selection: Id[] = [];
  tool: ToolId = 'select';
  view: Camera = { x: 0, y: 0, zoom: 0.55 };
  overlay: Overlay | null = null;
  guides: Guide[] = [];
  cursor: Vec2 | null = null;
  hover: Id | null = null;
  spaceHeld = false;
  clipboard: Item[] = [];

  /** Emitido quando o documento muda de fato (autosave, histórico, inspetor). */
  readonly changed = new Signal<void>();
  /** Emitido em mudanças transitórias de câmera, hover, overlay, ferramenta e seleção. */
  readonly viewChanged = new Signal<void>();
  readonly selectionChanged = new Signal<void>();
  readonly cursorMoved = new Signal<Vec2 | null>();

  private undoStack: HistoryEntry[] = [];
  private redoStack: HistoryEntry[] = [];

  constructor(doc: Plan) {
    this.doc = doc;
  }

  /* ---------------- Ciclo básico ---------------- */

  /** Solicita apenas um redesenho/atualização de UI, sem marcar o documento como alterado. */
  emit(): void {
    this.viewChanged.emit();
  }

  touch(): void {
    this.changed.emit();
  }

  snapshot(): Plan {
    return clonePlan(this.doc);
  }

  commit(label: string, before: Plan): boolean {
    if (JSON.stringify(before) === JSON.stringify(this.doc)) return false;
    this.undoStack.push({ label, doc: before });
    if (this.undoStack.length > HISTORY_LIMIT) this.undoStack.shift();
    this.redoStack = [];
    this.changed.emit();
    return true;
  }

  /** Executa uma mutação com um passo de histórico. */
  tx(label: string, fn: () => void): boolean {
    const before = this.snapshot();
    fn();
    return this.commit(label, before);
  }

  setDoc(doc: Plan, resetHistory = false): void {
    this.doc = doc;
    if (resetHistory) {
      this.undoStack = [];
      this.redoStack = [];
    }
    this.selection = this.selection.filter((id) => this.exists(id));
    this.overlay = null;
    this.guides = [];
    this.changed.emit();
    this.viewChanged.emit();
    this.selectionChanged.emit();
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  get undoLabel(): string {
    return this.undoStack[this.undoStack.length - 1]?.label ?? '';
  }

  get redoLabel(): string {
    return this.redoStack[this.redoStack.length - 1]?.label ?? '';
  }

  undo(): void {
    const entry = this.undoStack.pop();
    if (!entry) return;
    this.redoStack.push({ label: entry.label, doc: this.snapshot() });
    this.doc = entry.doc;
    this.selection = this.selection.filter((id) => this.exists(id));
    this.overlay = null;
    this.guides = [];
    this.changed.emit();
    this.viewChanged.emit();
    this.selectionChanged.emit();
  }

  redo(): void {
    const entry = this.redoStack.pop();
    if (!entry) return;
    this.undoStack.push({ label: entry.label, doc: this.snapshot() });
    this.doc = entry.doc;
    this.selection = this.selection.filter((id) => this.exists(id));
    this.overlay = null;
    this.guides = [];
    this.changed.emit();
    this.viewChanged.emit();
    this.selectionChanged.emit();
  }

  /* ---------------- Ferramenta, câmera, overlays ---------------- */

  setTool(tool: ToolId): void {
    if (this.tool === tool) return;
    this.tool = tool;
    this.overlay = null;
    this.guides = [];
    this.emit();
  }

  setView(view: Camera): void {
    this.view = view;
    this.emit();
  }

  setOverlay(overlay: Overlay | null): void {
    this.overlay = overlay;
    this.emit();
  }

  setGuides(guides: Guide[]): void {
    if (!guides.length && !this.guides.length) return;
    this.guides = guides;
    this.emit();
  }

  setCursor(cursor: Vec2 | null): void {
    this.cursor = cursor;
    this.cursorMoved.emit(cursor);
  }

  setHover(id: Id | null): void {
    if (this.hover === id) return;
    this.hover = id;
    this.emit();
  }

  /* ---------------- Consultas ---------------- */

  findItem(id: Id): Item | undefined {
    return this.doc.items.find((i) => i.id === id);
  }

  findWall(id: Id): Wall | undefined {
    return this.doc.walls.find((w) => w.id === id);
  }

  findRoom(id: Id): Room | undefined {
    return this.doc.rooms.find((r) => r.id === id);
  }

  findOpening(id: Id): Opening | undefined {
    return this.doc.openings.find((o) => o.id === id);
  }

  kindOf(id: Id): EntityKind | null {
    if (this.findItem(id)) return 'item';
    if (this.findWall(id)) return 'wall';
    if (this.findRoom(id)) return 'room';
    if (this.findOpening(id)) return 'opening';
    return null;
  }

  exists(id: Id): boolean {
    return this.kindOf(id) !== null;
  }

  selectedItems(): Item[] {
    return this.doc.items.filter((i) => this.selection.includes(i.id));
  }

  selectedWalls(): Wall[] {
    return this.doc.walls.filter((w) => this.selection.includes(w.id));
  }

  selectedOpenings(): Opening[] {
    return this.doc.openings.filter((o) => this.selection.includes(o.id));
  }

  selectionBounds(): Rect | null {
    let rect: Rect | null = null;
    for (const id of this.selection) {
      const item = this.findItem(id);
      if (item) {
        rect = unionRect(rect, itemBounds(item));
        continue;
      }
      const wall = this.findWall(id);
      if (wall) {
        rect = unionRect(
          rect,
          boundsOfPoints([wall.a, wall.b]),
        );
        continue;
      }
    }
    return rect;
  }

  /* ---------------- Seleção ---------------- */

  select(ids: Id[]): void {
    const next = ids.filter((id, index) => ids.indexOf(id) === index && this.exists(id));
    if (next.length === this.selection.length && next.every((id, i) => id === this.selection[i])) {
      return;
    }
    this.selection = next;
    this.viewChanged.emit();
    this.selectionChanged.emit();
  }

  toggleSelection(id: Id): void {
    if (this.selection.includes(id)) {
      this.select(this.selection.filter((s) => s !== id));
    } else {
      this.select([...this.selection, id]);
    }
  }

  clearSelection(): void {
    this.select([]);
  }

  /* ---------------- Mutações ---------------- */

  insertItem(defId: string, x: number, y: number, rot = 0, selectAfter = true): Item | null {
    const def = getDef(defId);
    if (!def) return null;
    const item = createItem(defId, x, y, { rot });
    if (!item) return null;
    item.z = this.nextZ();
    this.tx(`Inserir ${def.name}`, () => {
      this.doc.items.push(item);
    });
    if (selectAfter) this.select([item.id]);
    return item;
  }

  insertOpening(wall: Wall, offset: number, kind: Opening['kind'], width: number): Opening {
    const len = Math.hypot(wall.b.x - wall.a.x, wall.b.y - wall.a.y);
    const safeWidth = Math.min(Math.max(10, width), Math.max(len, 1));
    const half = safeWidth / 2;
    const opening: Opening = {
      id: `op_${Math.random().toString(36).slice(2, 9)}`,
      wallId: wall.id,
      offset: Math.min(Math.max(offset, half), Math.max(half, len - half)),
      width: safeWidth,
      kind,
      flip: false,
      hinge: 'esq',
    };
    this.tx('Inserir abertura', () => {
      this.doc.openings.push(opening);
    });
    this.select([opening.id]);
    return opening;
  }

  insertWall(a: Vec2, b: Vec2, thickness: number): Wall | null {
    if (Math.hypot(b.x - a.x, b.y - a.y) < 8) return null;
    let created: Wall | null = null;
    this.tx('Desenhar parede', () => {
      created = {
        id: `wl_${Math.random().toString(36).slice(2, 9)}`,
        a: { ...a },
        b: { ...b },
        thickness,
      };
      this.doc.walls.push(created);
    });
    return created;
  }

  nextZ(): number {
    return this.doc.items.reduce((max, item) => Math.max(max, item.z), 0) + 1;
  }

  removeSelection(): void {
    if (!this.selection.length) return;
    const ids = new Set(this.selection);
    this.tx('Excluir', () => {
      this.doc.items = this.doc.items.filter((i) => !ids.has(i.id));
      this.doc.openings = this.doc.openings.filter((o) => !ids.has(o.id));
      this.doc.rooms = this.doc.rooms.filter((r) => !ids.has(r.id));
      const removedWalls = this.doc.walls.filter((w) => ids.has(w.id)).map((w) => w.id);
      this.doc.walls = this.doc.walls.filter((w) => !ids.has(w.id));
      if (removedWalls.length) {
        const removedSet = new Set(removedWalls);
        this.doc.openings = this.doc.openings.filter((o) => !removedSet.has(o.wallId));
      }
    });
    this.clearSelection();
  }

  removeById(id: Id): void {
    const before = this.snapshot();
    this.doc.items = this.doc.items.filter((i) => i.id !== id);
    this.doc.rooms = this.doc.rooms.filter((r) => r.id !== id);
    this.doc.openings = this.doc.openings.filter((o) => o.id !== id);
    const wall = this.doc.walls.find((w) => w.id === id);
    if (wall) {
      this.doc.walls = this.doc.walls.filter((w) => w.id !== id);
      this.doc.openings = this.doc.openings.filter((o) => o.wallId !== id);
    }
    this.commit('Excluir', before);
    this.clearSelection();
  }

  copySelection(): number {
    const items = this.selectedItems();
    if (!items.length) return 0;
    this.clipboard = items.map((i) => ({ ...i, colors: { ...i.colors } }));
    return items.length;
  }

  pasteClipboard(offset = 30): Item[] {
    if (!this.clipboard.length) return [];
    const created: Item[] = [];
    this.tx('Colar', () => {
      for (const source of this.clipboard) {
        const item: Item = {
          ...source,
          colors: { ...source.colors },
          id: `it_${Math.random().toString(36).slice(2, 9)}`,
          x: source.x + offset,
          y: source.y + offset,
          z: this.nextZ(),
        };
        this.doc.items.push(item);
        created.push(item);
      }
    });
    if (created.length) this.select(created.map((i) => i.id));
    return created;
  }

  duplicateSelection(): Item[] {
    const items = this.selectedItems();
    if (!items.length) return [];
    const created: Item[] = [];
    this.tx('Duplicar', () => {
      for (const source of items) {
        const copy: Item = {
          ...source,
          colors: { ...source.colors },
          id: `it_${Math.random().toString(36).slice(2, 9)}`,
          x: source.x + 30,
          y: source.y + 30,
          z: this.nextZ(),
        };
        this.doc.items.push(copy);
        created.push(copy);
      }
    });
    if (created.length) this.select(created.map((i) => i.id));
    return created;
  }

  nudgeSelection(dx: number, dy: number): void {
    const items = this.selectedItems().filter((i) => !i.locked);
    const walls = this.selectedWalls();
    const openings = this.selectedOpenings();
    if (!items.length && !walls.length && !openings.length) return;
    this.tx('Mover', () => {
      for (const item of items) {
        item.x += dx;
        item.y += dy;
      }
      for (const wall of walls) {
        wall.a = { x: wall.a.x + dx, y: wall.a.y + dy };
        wall.b = { x: wall.b.x + dx, y: wall.b.y + dy };
      }
      for (const opening of openings) {
        const wall = this.findWall(opening.wallId);
        if (!wall) continue;
        const length = Math.hypot(wall.b.x - wall.a.x, wall.b.y - wall.a.y);
        if (length < 0.5) continue;
        // Projeta o deslocamento no eixo da parede: aberturas só deslizam ao longo dela.
        const along = (dx * (wall.b.x - wall.a.x) + dy * (wall.b.y - wall.a.y)) / length;
        const half = Math.min(opening.width, length) / 2;
        opening.offset = Math.max(half, Math.min(length - half, opening.offset + along));
      }
    });
  }

  alignSelection(mode: 'left' | 'centerX' | 'right' | 'top' | 'middle' | 'bottom'): void {
    const items = this.selectedItems().filter((i) => !i.locked);
    if (items.length < 2) return;
    const boxes = items.map((item) => ({ item, rect: itemBounds(item) }));
    let group: Rect | null = null;
    for (const entry of boxes) group = unionRect(group, entry.rect);
    if (!group) return;
    const g = group;
    this.tx('Alinhar', () => {
      for (const { item, rect } of boxes) {
        switch (mode) {
          case 'left':
            item.x += g.x - rect.x;
            break;
          case 'right':
            item.x += g.x + g.w - (rect.x + rect.w);
            break;
          case 'centerX':
            item.x += g.x + g.w / 2 - (rect.x + rect.w / 2);
            break;
          case 'top':
            item.y += g.y - rect.y;
            break;
          case 'bottom':
            item.y += g.y + g.h - (rect.y + rect.h);
            break;
          case 'middle':
            item.y += g.y + g.h / 2 - (rect.y + rect.h / 2);
            break;
        }
      }
    });
  }

  rotateSelection(degrees: number): void {
    const items = this.selectedItems().filter((i) => !i.locked);
    if (!items.length) return;
    this.tx('Rotacionar', () => {
      for (const item of items) item.rot = (((item.rot + degrees) % 360) + 360) % 360;
    });
  }

  updateItem(id: Id, patch: Partial<Item>, label = 'Editar'): void {
    const item = this.findItem(id);
    if (!item) return;
    this.tx(label, () => Object.assign(item, patch));
  }

  updateItems(patch: Partial<Item>, label = 'Editar'): void {
    const items = this.selectedItems();
    if (!items.length) return;
    this.tx(label, () => {
      for (const item of items) Object.assign(item, patch);
    });
  }

  bringToFront(): void {
    const items = this.selectedItems();
    if (!items.length) return;
    this.tx('Trazer para frente', () => {
      let z = this.nextZ();
      for (const item of items) item.z = z++;
    });
  }

  sendToBack(): void {
    const items = this.selectedItems();
    if (!items.length) return;
    this.tx('Enviar para trás', () => {
      let z = this.doc.items.reduce((min, i) => Math.min(min, i.z), 0) - items.length;
      for (const item of items) item.z = z++;
    });
  }

  /** Câmera que mostra a planta inteira. */
  fitView(width: number, height: number, padding = 90): void {
    const bounds = planBounds(this.doc);
    if (!bounds || !width || !height) return;
    const zoom = Math.min(
      MAX_ZOOM,
      Math.max(
        MIN_ZOOM,
        Math.min(
          (width - padding * 2) / Math.max(bounds.w, 60),
          (height - padding * 2) / Math.max(bounds.h, 60),
        ),
      ),
    );
    const x = (width - bounds.w * zoom) / 2 - bounds.x * zoom;
    const y = (height - bounds.h * zoom) / 2 - bounds.y * zoom;
    this.setView({ x, y, zoom });
  }

  /** Centro da área visível em cm. */
  viewCenter(width: number, height: number): Vec2 {
    return {
      x: (width / 2 - this.view.x) / this.view.zoom,
      y: (height / 2 - this.view.y) / this.view.zoom,
    };
  }

  /** Cantos da seleção em espaço de mundo. */
  selectionCorners(): Vec2[] {
    const items = this.selectedItems();
    if (items.length === 1) {
      const item = items[0];
      return obbCorners({ x: item.x, y: item.y }, item.w, item.d, item.rot);
    }
    return [];
  }
}
