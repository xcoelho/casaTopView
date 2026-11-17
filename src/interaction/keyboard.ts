/** Atalhos de teclado do editor. */
import type { Store } from '../core/store';

export interface KeyboardActions {
  cancel: () => boolean;
  finish: () => void;
  fitView: () => void;
  zoomBy: (factor: number) => void;
  openHelp: () => void;
  openProjects: () => void;
  exportJson: () => void;
  importJson: () => void;
  open3D: () => void;
}

function isEditable(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  if (!element) return false;
  const tag = element.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    element.isContentEditable === true
  );
}

export function attachKeyboard(store: Store, actions: KeyboardActions): () => void {
  const onKeyDown = (event: KeyboardEvent): void => {
    if (isEditable(event.target)) return;
    const key = event.key.toLowerCase();
    const mod = event.ctrlKey || event.metaKey;

    if (key === ' ' || event.code === 'Space') {
      store.spaceHeld = true;
      event.preventDefault();
      return;
    }

    if (mod) {
      switch (key) {
        case 'z':
          event.preventDefault();
          if (event.shiftKey) store.redo();
          else store.undo();
          return;
        case 'y':
          event.preventDefault();
          store.redo();
          return;
        case 'd':
          event.preventDefault();
          store.duplicateSelection();
          return;
        case 'c':
          event.preventDefault();
          store.copySelection();
          return;
        case 'x':
          event.preventDefault();
          store.copySelection();
          store.removeSelection();
          return;
        case 'v':
          event.preventDefault();
          store.pasteClipboard();
          return;
        case 'a':
          event.preventDefault();
          store.select(store.doc.items.map((item) => item.id));
          return;
        case 's':
          event.preventDefault();
          actions.exportJson();
          return;
        case 'o':
          event.preventDefault();
          actions.openProjects();
          return;
        case '0':
          event.preventDefault();
          actions.fitView();
          return;
        case '=':
        case '+':
          event.preventDefault();
          actions.zoomBy(1.25);
          return;
        case '-':
          event.preventDefault();
          actions.zoomBy(1 / 1.25);
          return;
        default:
          return;
      }
    }

    const step = event.shiftKey ? 10 : 1;
    switch (key) {
      case 'v':
        store.setTool('select');
        break;
      case 'p':
        store.setTool('wall');
        break;
      case 'c':
        store.setTool('room');
        break;
      case 't':
        store.setTool('door');
        break;
      case 'j':
        store.setTool('window');
        break;
      case 'm':
        store.setTool('measure');
        break;
      case '3':
        actions.open3D();
        break;
      case 'r':
        store.rotateSelection(90);
        break;
      case 'l':
        if (store.selection.length) {
          const items = store.selectedItems();
          const lock = !items.every((item) => item.locked);
          store.tx('Travar', () => {
            for (const item of items) item.locked = lock;
          });
        }
        break;
      case 'g':
        store.tx('Grade', () => {
          store.doc.settings.showGrid = !store.doc.settings.showGrid;
        });
        break;
      case 's':
        store.tx('Encaixe', () => {
          store.doc.settings.snap = !store.doc.settings.snap;
        });
        break;
      case 'd':
        store.setTool('measure');
        break;
      case 'delete':
      case 'backspace':
        store.removeSelection();
        break;
      case 'escape':
        if (!actions.cancel()) store.clearSelection();
        break;
      case 'enter':
        actions.finish();
        break;
      case 'arrowleft':
        event.preventDefault();
        store.nudgeSelection(-step, 0);
        break;
      case 'arrowright':
        event.preventDefault();
        store.nudgeSelection(step, 0);
        break;
      case 'arrowup':
        event.preventDefault();
        store.nudgeSelection(0, -step);
        break;
      case 'arrowdown':
        event.preventDefault();
        store.nudgeSelection(0, step);
        break;
      case '/':
      case '?':
      case 'f1':
        event.preventDefault();
        actions.openHelp();
        break;
      case 'i':
        store.tx('Cotas', () => {
          store.doc.settings.showDims = !store.doc.settings.showDims;
        });
        break;
      default:
        return;
    }
  };

  const onKeyUp = (event: KeyboardEvent): void => {
    if (event.key === ' ' || event.code === 'Space') store.spaceHeld = false;
  };

  const onBlur = (): void => {
    store.spaceHeld = false;
  };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);

  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', onBlur);
  };
}
