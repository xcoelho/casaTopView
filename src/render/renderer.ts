/** Renderer do canvas do editor. */
import type { Plan } from '../core/document';
import type { Store } from '../core/store';
import { THEME } from './theme';
import type { Camera } from './viewport';
import { drawBackground } from './layers/grid';
import { drawUnderlay } from './layers/underlay';
import { drawRooms } from './layers/rooms';
import { drawWalls } from './layers/walls';
import { drawOpenings } from './layers/openings';
import { drawItems } from './layers/furniture';
import { drawDimensions } from './layers/dimensions';
import { drawSelection } from './layers/selection';
import { drawOverlay } from './layers/guides';

export interface PaintOptions {
  width: number;
  height: number;
  dpr: number;
  grid: boolean;
  dims: boolean;
  areas: boolean;
  roomNames: boolean;
  background?: string | null;
  /** fotos de fundo não entram em miniaturas nem no PNG por padrão */
  underlay?: boolean;
}

/** Desenha somente a planta (sem seleção/overlays) — usado em miniaturas e exportações. */
export function paintPlan(
  ctx: CanvasRenderingContext2D,
  plan: Plan,
  cam: Camera,
  opts: PaintOptions,
  onUnderlayReady?: () => void,
): void {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, opts.width * opts.dpr, opts.height * opts.dpr);
  drawBackground(
    ctx,
    cam,
    opts.width,
    opts.height,
    opts.dpr,
    opts.grid,
    opts.background === null ? null : (opts.background ?? THEME.paper),
  );
  if (opts.underlay) drawUnderlay(ctx, plan, cam, opts.dpr, onUnderlayReady);
  drawRooms(ctx, plan, cam, opts.dpr, {
    showAreas: opts.areas,
    showNames: opts.roomNames,
  });
  drawWalls(ctx, plan, cam, opts.dpr);
  drawOpenings(ctx, plan, cam, opts.dpr);
  drawItems(ctx, plan, cam, opts.dpr);
  if (opts.dims) drawDimensions(ctx, plan, cam, opts.dpr);
}

export class Renderer {
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private store: Store;
  private dpr = 1;
  private raf = 0;
  width = 0;
  height = 0;

  constructor(canvas: HTMLCanvasElement, store: Store) {
    this.canvas = canvas;
    this.store = store;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D não disponível');
    this.ctx = ctx;
    this.resize();

    if (typeof ResizeObserver !== 'undefined') {
      const parent = canvas.parentElement ?? canvas;
      new ResizeObserver(() => this.resize()).observe(parent);
    }
    window.addEventListener('resize', () => this.resize());
    store.changed.on(() => this.invalidate());
    store.viewChanged.on(() => this.invalidate());
  }

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    this.dpr = dpr;
    this.width = width;
    this.height = height;
    const pixelW = Math.round(width * dpr);
    const pixelH = Math.round(height * dpr);
    if (this.canvas.width !== pixelW || this.canvas.height !== pixelH) {
      this.canvas.width = pixelW;
      this.canvas.height = pixelH;
    }
    this.invalidate();
  }

  invalidate(): void {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.draw();
    });
  }

  private draw(): void {
    if (!this.width || !this.height) return;
    const { doc, view, selection } = this.store;
    paintPlan(this.ctx, doc, view, {
      width: this.width,
      height: this.height,
      dpr: this.dpr,
      grid: doc.settings.showGrid,
      dims: doc.settings.showDims,
      areas: doc.settings.showAreas,
      roomNames: doc.settings.showAreas,
      background: doc.settings.background,
      underlay: true,
    }, () => this.invalidate());
    if (selection.length) drawSelection(this.ctx, this.store, view, this.dpr);
    else if (this.store.hover) drawSelection(this.ctx, this.store, view, this.dpr);
    drawOverlay(this.ctx, this.store, view, this.dpr);
  }
}
