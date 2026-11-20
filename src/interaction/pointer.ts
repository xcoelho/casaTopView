/** Controlador central do ponteiro sobre a planta. */
import type { Store, ToolId } from '../core/store';
import type { Vec2 } from '../core/geometry';
import { rectFromPoints } from '../core/geometry';
import type { Renderer } from '../render/renderer';
import { panBy, screenToWorld } from '../render/viewport';
import { HANDLE_HIT, WALL_HANDLE_HIT, getItemHandles, getWallHandles } from '../render/layers/selection';
import { attachWheelZoom } from './camera';
import { beginMove, endMove, updateMove } from './move';
import type { MoveSession } from './move';
import { beginResize, endResize, updateResize } from './resize';
import type { ResizeSession } from './resize';
import { beginRotate, endRotate, updateRotate } from './rotate';
import type { RotateSession } from './rotate';
import { beginWallResize, endWallResize, updateWallResize } from './wallResize';
import type { WallResizeSession } from './wallResize';
import { hitTest, marqueeIds } from './selection';
import { createWallTool } from './wallTool';
import { createMeasureTool } from './measureTool';
import { createOpeningTool } from './openingTool';
import { createCalibrateTool } from './calibrateTool';
import type { ToolHandler } from './types';

type Drag =
  | { kind: 'pan'; last: Vec2 }
  | { kind: 'marquee'; start: Vec2; additive: boolean }
  | { kind: 'move'; session: MoveSession }
  | { kind: 'resize'; session: ResizeSession }
  | { kind: 'wallResize'; session: WallResizeSession }
  | { kind: 'rotate'; session: RotateSession }
  | { kind: 'tool' };

export class PointerController {
  private canvas: HTMLCanvasElement;
  private store: Store;
  private renderer: Renderer;
  private tools = new Map<ToolId, ToolHandler>();
  private drag: Drag | null = null;
  private activeTool: ToolHandler | null = null;
  private lastTool: ToolId = 'select';
  private syncing = false;
  private cleanups: (() => void)[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    store: Store,
    renderer: Renderer,
    notify: (message: string) => void,
    onMeasure: (a: Vec2, b: Vec2) => void,
  ) {
    this.canvas = canvas;
    this.store = store;
    this.renderer = renderer;

    this.tools.set('wall', createWallTool({ store, notify }));
    this.tools.set('measure', createMeasureTool({ store, notify }));
    this.tools.set('door', createOpeningTool({ store, notify }, 'porta'));
    this.tools.set('window', createOpeningTool({ store, notify }, 'janela'));
    this.tools.set('calibrate', createCalibrateTool({ store, notify }, onMeasure));

    this.cleanups.push(attachWheelZoom(canvas, store));

    const onDown = (event: PointerEvent) => this.onPointerDown(event);
    const onMove = (event: PointerEvent) => this.onPointerMove(event);
    const onUp = (event: PointerEvent) => this.onPointerUp(event);
    const onCancel = () => this.cancel();
    const onDouble = (event: MouseEvent) => this.onDoubleClick(event);
    const onContext = (event: MouseEvent) => {
      event.preventDefault();
      this.cancel();
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onCancel);
    canvas.addEventListener('dblclick', onDouble);
    canvas.addEventListener('contextmenu', onContext);

    this.cleanups.push(() => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onCancel);
      canvas.removeEventListener('dblclick', onDouble);
      canvas.removeEventListener('contextmenu', onContext);
    });

    store.viewChanged.on(() => {
      if (this.syncing) return;
      if (this.store.tool !== this.lastTool) {
        this.syncing = true;
        for (const [id, tool] of this.tools) {
          if (id !== this.store.tool) tool.cancel();
        }
        this.syncing = false;
        this.lastTool = this.store.tool;
        this.drag = null;
      }
    });
  }

  private screen(event: MouseEvent): Vec2 {
    const rect = this.canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  private world(event: MouseEvent): Vec2 {
    return screenToWorld(this.store.view, this.screen(event));
  }

  private setCursor(cursor: string): void {
    this.canvas.style.cursor = cursor;
  }

  private onPointerDown(event: PointerEvent): void {
    const screen = this.screen(event);
    const world = screenToWorld(this.store.view, screen);

    // Botão direito (ou do meio) e espaço: arrastar a planta.
    if (event.button === 1 || event.button === 2 || this.store.spaceHeld) {
      event.preventDefault();
      this.drag = { kind: 'pan', last: screen };
      this.canvas.setPointerCapture(event.pointerId);
      this.setCursor('grabbing');
      return;
    }

    if (event.button !== 0) return;
    this.canvas.setPointerCapture(event.pointerId);

    const tool = this.tools.get(this.store.tool);
    if (tool) {
      this.activeTool = tool;
      this.drag = { kind: 'tool' };
      tool.down(world, screen, event);
      return;
    }

    const single =
      this.store.selection.length === 1 ? this.store.findItem(this.store.selection[0]) : null;
    if (single && !single.locked) {
      const handles = getItemHandles(single, this.store.view);
      const rotate = handles.find((h) => h.id === 'rotate');
      if (rotate && Math.hypot(screen.x - rotate.pos.x, screen.y - rotate.pos.y) <= 13) {
        const session = beginRotate(this.store, single.id, world);
        if (session) {
          this.drag = { kind: 'rotate', session };
          this.setCursor('grabbing');
          return;
        }
      }
      for (const handle of handles) {
        if (handle.id === 'rotate') continue;
        if (Math.hypot(screen.x - handle.pos.x, screen.y - handle.pos.y) <= HANDLE_HIT) {
          const session = beginResize(this.store, single.id, handle.id);
          if (session) {
            this.drag = { kind: 'resize', session };
            return;
          }
        }
      }
    }

    const selectedWall =
      this.store.selection.length === 1 ? this.store.findWall(this.store.selection[0]) : null;
    if (selectedWall) {
      for (const handle of getWallHandles(selectedWall, this.store.view)) {
        if (Math.hypot(screen.x - handle.pos.x, screen.y - handle.pos.y) <= WALL_HANDLE_HIT) {
          const session = beginWallResize(this.store, selectedWall.id, handle.end);
          if (session) {
            this.drag = { kind: 'wallResize', session };
            this.setCursor('grabbing');
            return;
          }
        }
      }
    }

    const hit = hitTest(this.store, world, 8 / this.store.view.zoom);
    if (hit) {
      if (event.shiftKey) {
        this.store.toggleSelection(hit);
      } else if (!this.store.selection.includes(hit)) {
        this.store.select([hit]);
      }
      this.drag = { kind: 'move', session: beginMove(this.store, world) };
      this.setCursor('grabbing');
      return;
    }

    if (!event.shiftKey) this.store.clearSelection();
    this.drag = { kind: 'marquee', start: world, additive: event.shiftKey };
    this.setCursor('crosshair');
  }

  private onPointerMove(event: PointerEvent): void {
    const screen = this.screen(event);
    const world = screenToWorld(this.store.view, screen);
    this.store.setCursor(world);

    const drag = this.drag;
    if (!drag) {
      if (this.store.tool === 'select') {
        this.updateHover(world);
      } else {
        this.store.setHover(null);
        this.tools.get(this.store.tool)?.move(world, screen, event);
      }
      return;
    }

    switch (drag.kind) {
      case 'pan': {
        this.store.setView(panBy(this.store.view, screen.x - drag.last.x, screen.y - drag.last.y));
        drag.last = screen;
        break;
      }
      case 'marquee': {
        this.store.setOverlay({ type: 'marquee', rect: rectFromPoints(drag.start, world) });
        break;
      }
      case 'move': {
        updateMove(this.store, drag.session, world, event.shiftKey);
        break;
      }
      case 'resize': {
        updateResize(this.store, drag.session, world, event.shiftKey);
        break;
      }
      case 'wallResize': {
        updateWallResize(this.store, drag.session, world, event.shiftKey);
        break;
      }
      case 'rotate': {
        updateRotate(this.store, drag.session, world, event.shiftKey);
        break;
      }
      case 'tool': {
        this.activeTool?.move(world, screen, event);
        break;
      }
    }
  }

  private onPointerUp(event: PointerEvent): void {
    const screen = this.screen(event);
    const world = screenToWorld(this.store.view, screen);
    const drag = this.drag;
    this.drag = null;
    try {
      this.canvas.releasePointerCapture(event.pointerId);
    } catch {
      /* ignora */
    }

    if (!drag) {
      this.setCursor('default');
      return;
    }

    switch (drag.kind) {
      case 'marquee': {
        const rect = rectFromPoints(drag.start, world);
        const ids = marqueeIds(this.store, rect);
        this.store.select(drag.additive ? [...new Set([...this.store.selection, ...ids])] : ids);
        this.store.setOverlay(null);
        break;
      }
      case 'move': {
        endMove(this.store, drag.session);
        break;
      }
      case 'resize': {
        endResize(this.store, drag.session);
        break;
      }
      case 'wallResize': {
        endWallResize(this.store, drag.session);
        break;
      }
      case 'rotate': {
        endRotate(this.store, drag.session);
        break;
      }
      case 'tool': {
        this.activeTool?.up(world, screen, event);
        this.activeTool = null;
        break;
      }
    }
    this.setCursor(this.store.tool === 'select' ? 'default' : 'crosshair');
  }

  private onDoubleClick(event: MouseEvent): void {
    const tool = this.tools.get(this.store.tool);
    if (tool) {
      tool.finish();
      return;
    }
    const world = this.world(event);
    const hit = hitTest(this.store, world, 8 / this.store.view.zoom);
    if (hit) this.store.select([hit]);
  }

  private updateHover(world: Vec2): void {
    const single =
      this.store.selection.length === 1 ? this.store.findItem(this.store.selection[0]) : null;
    if (single && !single.locked) {
      const screen = {
        x: world.x * this.store.view.zoom + this.store.view.x,
        y: world.y * this.store.view.zoom + this.store.view.y,
      };
      const handles = getItemHandles(single, this.store.view);
      for (const handle of handles) {
        if (Math.hypot(screen.x - handle.pos.x, screen.y - handle.pos.y) <= HANDLE_HIT) {
          this.setCursor(handle.id === 'rotate' ? 'grab' : 'nwse-resize');
          this.store.setHover(null);
          return;
        }
      }
    }
    const selectedWall =
      this.store.selection.length === 1 ? this.store.findWall(this.store.selection[0]) : null;
    if (selectedWall) {
      const screen = {
        x: world.x * this.store.view.zoom + this.store.view.x,
        y: world.y * this.store.view.zoom + this.store.view.y,
      };
      for (const handle of getWallHandles(selectedWall, this.store.view)) {
        if (Math.hypot(screen.x - handle.pos.x, screen.y - handle.pos.y) <= WALL_HANDLE_HIT) {
          this.setCursor('crosshair');
          this.store.setHover(null);
          return;
        }
      }
    }
    const hit = hitTest(this.store, world, 8 / this.store.view.zoom);
    this.store.setHover(hit);
    this.setCursor(hit ? 'move' : 'default');
  }

  /** Esc: cancela arraste/ferramenta. Retorna true se algo foi cancelado. */
  cancel(): boolean {
    const drag = this.drag;
    this.drag = null;
    this.activeTool = null;
    let cancelled = false;
    if (drag) {
      cancelled = true;
      if (
        drag.kind === 'move' ||
        drag.kind === 'resize' ||
        drag.kind === 'wallResize' ||
        drag.kind === 'rotate'
      ) {
        this.store.setDoc(drag.session.before);
      }
    }
    this.syncing = true;
    for (const tool of this.tools.values()) tool.cancel();
    this.syncing = false;
    if (this.store.overlay) {
      this.store.setOverlay(null);
      cancelled = true;
    }
    this.store.setGuides([]);
    this.setCursor('default');
    return cancelled;
  }

  /** Enter: conclui a ferramenta ativa (fecha cômodo, termina polilinha). */
  finishTool(): void {
    const tool = this.tools.get(this.store.tool);
    tool?.finish();
    this.drag = null;
  }

  destroy(): void {
    for (const cleanup of this.cleanups) cleanup();
    this.cleanups = [];
  }
}
