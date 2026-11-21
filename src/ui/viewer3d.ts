/** Painel "Vista 3D": maquete WebGL da planta com órbita, pan e zoom. */
import type { Store } from '../core/store';
import type { Shell } from './shell';
import { button, el, icon } from './controls';
import { createView3D, type View3DHandle } from '../view3d/viewer';

export interface Viewer3DOptions {
  shell: Shell;
  store: Store;
}

export function open3DViewer({ shell, store }: Viewer3DOptions): void {
  if (shell.stage.querySelector('.viewer3d')) return;

  const host = el('div', { class: 'viewer3d-canvas-host' });
  const title = el(
    'div',
    { class: 'viewer3d-title' },
    icon('cube', 18),
    el('div', {}, el('b', {}, 'Vista 3D'), el('span', {}, 'Maquete gerada a partir da planta')),
  );

  let wallsOn = true;
  let view: View3DHandle | null = null;

  const wallsButton = button({
    label: 'Paredes',
    icon: 'wall',
    title: 'Mostrar/ocultar paredes',
    disabled: true,
    onClick: () => {
      wallsOn = !wallsOn;
      wallsButton.classList.toggle('active', wallsOn);
      view?.setWalls(wallsOn);
    },
  });
  const fitButton = button({
    label: 'Enquadrar',
    icon: 'fit',
    disabled: true,
    onClick: () => view?.fit(),
  });
  const closeButton = button({ label: 'Fechar', icon: 'close', onClick: () => close() });

  const head = el(
    'div',
    { class: 'viewer3d-head' },
    title,
    el('div', { class: 'viewer3d-actions' }, wallsButton, fitButton, closeButton),
  );

  const hint = el(
    'div',
    { class: 'viewer3d-hint' },
    'Clique seleciona · Arraste o móvel para mover · Alça vertical ajusta a altura · Duplo-clique centraliza · Arraste no vazio para girar',
  );

  const root = el('div', { class: 'viewer3d' }, host, head, hint);
  // O canvas precisa estar no documento para medir o palco antes de criar a cena.
  shell.stage.append(root);

  try {
    view = createView3D(host, store.doc, store);
    wallsButton.disabled = false;
    fitButton.disabled = false;
    wallsButton.classList.add('active');
  } catch (error) {
    console.error('WebGL indisponível para a vista 3D', error);
    hint.textContent = 'Seu navegador não conseguiu iniciar o WebGL';
  }

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') close();
  };
  window.addEventListener('keydown', onKeyDown);

  const offChanged = store.changed.on(() => view?.update(store.doc));

  function close(): void {
    offChanged();
    window.removeEventListener('keydown', onKeyDown);
    view?.dispose();
    view = null;
    root.remove();
  }
}
