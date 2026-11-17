import type { Vec2 } from '../core/geometry';
import type { Store } from '../core/store';

export interface ToolDeps {
  store: Store;
  notify: (message: string) => void;
}

export interface ToolHandler {
  down(world: Vec2, screen: Vec2, event: PointerEvent): void;
  move(world: Vec2, screen: Vec2, event: PointerEvent): void;
  up(world: Vec2, screen: Vec2, event: PointerEvent): void;
  finish(): void;
  cancel(): void;
}
