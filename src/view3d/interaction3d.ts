/** Picking de clique 3D: raycast sobre grupos de móveis e seleção via store. */
import * as THREE from 'three';
import type { Plan } from '../core/document';
import type { Store } from '../core/store';

export interface AttachItemPickingOptions {
  canvas: HTMLCanvasElement;
  camera: THREE.PerspectiveCamera;
  groups: () => Map<string, THREE.Group>;
  store: Store;
}

function pickGroup(
  event: { clientX: number; clientY: number },
  canvas: HTMLCanvasElement,
  camera: THREE.PerspectiveCamera,
  groups: Map<string, THREE.Group>,
): THREE.Group | null {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const pointer = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([...groups.values()], true);
  for (const hit of hits) {
    let obj: THREE.Object3D | null = hit.object;
    while (obj) {
      if (typeof obj.userData?.itemId === 'string' && obj.userData.itemId) {
        return obj as THREE.Group;
      }
      obj = obj.parent;
    }
  }
  return null;
}

export function attachItemPicking(opts: AttachItemPickingOptions): () => void {
  const { canvas, camera, groups, store } = opts;
  let downX: number | null = null;
  let downY: number | null = null;

  function onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    downX = event.clientX;
    downY = event.clientY;
  }

  function onClick(event: MouseEvent): void {
    if (downX === null || downY === null) return;
    const dx = event.clientX - downX;
    const dy = event.clientY - downY;
    downX = null;
    downY = null;
    if (dx * dx + dy * dy > 16) return;
    const group = pickGroup(event, canvas, camera, groups());
    const id = group?.userData.itemId as string | undefined;
    if (!id) {
      store.clearSelection();
      return;
    }
    const item = store.findItem(id);
    if (!item || item.hidden) {
      store.clearSelection();
      return;
    }
    // locked apenas seleciona — o mover vem depois e não é implementado aqui.
    if (event.shiftKey) store.toggleSelection(id);
    else store.select([id]);
  }

  function onPointerCancel(): void {
    downX = null;
    downY = null;
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('click', onClick);
  canvas.addEventListener('pointercancel', onPointerCancel);
  return () => {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('click', onClick);
    canvas.removeEventListener('pointercancel', onPointerCancel);
  };
}

export interface AttachSelectionHighlightOptions {
  scene: THREE.Scene;
  groups: () => Map<string, THREE.Group>;
  store: Store;
}

export interface SelectionHighlightHandle {
  refresh: () => void;
  /** Recalcula a caixa a partir da world matrix atual (usado durante o arrasto). */
  update: () => void;
  dispose: () => void;
}

export function attachSelectionHighlight(opts: AttachSelectionHighlightOptions): SelectionHighlightHandle {
  const { scene, groups, store } = opts;
  let helper: THREE.BoxHelper | null = null;

  function clear(): void {
    if (!helper) return;
    scene.remove(helper);
    helper.dispose();
    helper = null;
  }

  function refresh(): void {
    clear();
    if (store.selection.length !== 1) return;
    const group = groups().get(store.selection[0]);
    if (!group) return;
    helper = new THREE.BoxHelper(group, 0x0f766e);
    scene.add(helper);
  }

  const off = store.selectionChanged.on(refresh);
  refresh();
  return {
    refresh,
    // BoxHelper.update recalcula a caixa a partir da world matrix do grupo.
    update: () => {
      helper?.update();
    },
    dispose: () => {
      off();
      clear();
    },
  };
}

export interface AttachItemFocusOptions {
  canvas: HTMLCanvasElement;
  camera: THREE.PerspectiveCamera;
  controls: {
    target: THREE.Vector3;
    minDistance: number;
    maxDistance: number;
    update: () => void;
  };
  groups: () => Map<string, THREE.Group>;
  store: Store;
}

export function attachItemFocus(opts: AttachItemFocusOptions): () => void {
  const { canvas, camera, controls, groups, store } = opts;

  function onDoubleClick(event: MouseEvent): void {
    const group = pickGroup(event, canvas, camera, groups());
    if (!group) return;
    const id = group.userData.itemId as string | undefined;
    if (!id) return;
    const item = store.findItem(id);
    if (!item || item.hidden) return;
    const center = new THREE.Box3().setFromObject(group).getCenter(new THREE.Vector3());
    const direction = camera.position.clone().sub(controls.target);
    const distance = Math.min(
      Math.max(direction.length(), controls.minDistance),
      controls.maxDistance,
    );
    // Câmera exatamente sobre o target deixa direction ~0 e normalize() produziria NaN.
    if (direction.lengthSq() < 1e-12) direction.set(0, 1, 1);
    direction.normalize();
    controls.target.copy(center);
    camera.position.copy(center).addScaledVector(direction, distance);
    controls.update();
  }

  canvas.addEventListener('dblclick', onDoubleClick);
  return () => {
    canvas.removeEventListener('dblclick', onDoubleClick);
  };
}

export interface AttachItemDragOptions {
  canvas: HTMLCanvasElement;
  camera: THREE.PerspectiveCamera;
  controls: { enabled: boolean; update: () => void };
  groups: () => Map<string, THREE.Group>;
  store: Store;
  /** Contorno da seleção: repassado para o destaque acompanhar o arrasto. */
  highlight: { update: () => void };
}

/**
 * Arrasta um móvel com o botão esquerdo no plano do piso (y = 0).
 * Durante o gesto escreve direto nas referências vivas do store e emite viewChanged
 * (sem histórico); no pointerup gera um único passo 'Mover'.
 */
export function attachItemDrag(opts: AttachItemDragOptions): () => void {
  const { canvas, camera, controls, groups, store } = opts;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();

  let dragging = false;
  let moved = false;
  let pointerId: number | null = null;
  let dragId: string | null = null;
  /** Snapshot preguiçoso: só nasce no primeiro move que passa do guarda de 4px. */
  let before: Plan | null = null;
  /** Documento do pointerdown: se o store trocar de doc no meio, o gesto é cancelado. */
  let docAtDown: Plan | null = null;
  /** Valores do item no pointerdown: o snap é aplicado sobre o delta, não sobre o centro. */
  let baseX = 0;
  let baseZ = 0;
  let downPointX = 0;
  let downPointZ = 0;
  let downX = 0;
  let downY = 0;
  let capturedHere = false;
  let controlsOff = false;
  /** Estado da órbita antes do gesto: o arrasto devolve exatamente o que encontrou. */
  let controlsWasEnabled = true;

  function pointOnFloor(event: { clientX: number; clientY: number }): THREE.Vector3 | null {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    return raycaster.ray.intersectPlane(floorPlane, hit);
  }

  /** Arredonda o deslocamento (não o centro absoluto) para a grade, como no 2D. */
  function snappedDelta(delta: number): number {
    const settings = store.doc.settings;
    if (!settings.snap) return delta;
    const grid = settings.grid > 0 ? settings.grid : 10;
    return Math.round(delta / grid) * grid;
  }

  function releaseControls(): void {
    if (!controlsOff) return;
    controls.enabled = controlsWasEnabled;
    controlsOff = false;
  }

  function releaseCapture(): void {
    if (!capturedHere || pointerId === null) return;
    capturedHere = false;
    const id = pointerId;
    try {
      if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
    } catch {
      /* o navegador pode já ter solto a captura. */
    }
  }

  function resetState(): void {
    dragging = false;
    moved = false;
    pointerId = null;
    dragId = null;
    before = null;
    docAtDown = null;
    capturedHere = false;
  }

  function onPointerDown(event: PointerEvent): void {
    // Shift é modificador de seleção (o picking cuida do toggle): nunca inicia arrasto,
    // senão o select([id]) abaixo colapsaria a seleção múltipla.
    if (event.shiftKey) return;
    if (event.button !== 0 || dragging) return;
    // Sem acerto de móvel nada acontece: o OrbitControls orbita normalmente.
    const group = pickGroup(event, canvas, camera, groups());
    const id = group?.userData.itemId as string | undefined;
    if (!id) return;
    const item = store.findItem(id);
    if (!item || item.hidden) return;
    if (item.locked) {
      // Mesma regra do clique: só seleciona se o item ainda não estiver selecionado.
      if (!store.selection.includes(id)) store.select([id]);
      return;
    }
    const point = pointOnFloor(event);
    if (!point) return;

    if (!store.selection.includes(id)) store.select([id]);
    // Sem snapshot aqui: ele nasce no primeiro move, quando o gesto vira arrasto de fato.
    baseX = item.x;
    baseZ = item.y;
    downPointX = point.x;
    downPointZ = point.z;
    docAtDown = store.doc;
    dragId = id;
    pointerId = event.pointerId;
    downX = event.clientX;
    downY = event.clientY;
    dragging = true;
    moved = false;
    controlsWasEnabled = controls.enabled;
    controls.enabled = false;
    controlsOff = true;
    // O OrbitControls já capturou o ponteiro no mesmo canvas; só capturamos se ninguém o fez.
    if (!canvas.hasPointerCapture(event.pointerId)) {
      try {
        canvas.setPointerCapture(event.pointerId);
        capturedHere = true;
      } catch {
        /* sem captura o arrasto segue válido enquanto o ponteiro fica sobre o canvas. */
      }
    }
  }

  function onPointerMove(event: PointerEvent): void {
    if (!dragging || dragId === null) return;
    if (pointerId !== null && event.pointerId !== pointerId) return;
    // Botão solto fora do canvas: o gesto termina aqui mesmo sem pointerup.
    if (event.buttons === 0) {
      finishDrag(moved);
      return;
    }
    // Mantém o guarda de 4px do picking: abaixo disso ainda é clique, não arrasto.
    if (!moved) {
      const dx = event.clientX - downX;
      const dy = event.clientY - downY;
      if (dx * dx + dy * dy <= 16) return;
      moved = true;
      // Snapshot preguiçoso: só aqui sabemos que o clique virou arrasto.
      before = store.snapshot();
    }
    // Documento trocado no meio do gesto (undo, abrir planta...): o snapshot não vale mais.
    if (!before || store.doc !== docAtDown) {
      releaseCapture();
      releaseControls();
      resetState();
      return;
    }
    const item = store.findItem(dragId);
    if (!item) return;
    const point = pointOnFloor(event);
    if (!point) return;

    // Snap sobre o delta (paridade com o 2D): preserva o offset de grab do ponteiro.
    const nextX = baseX + snappedDelta(point.x - downPointX);
    const nextZ = baseZ + snappedDelta(point.z - downPointZ);
    // item é a referência viva do store: escrever aqui evita tx por frame.
    item.x = nextX;
    // No plano 2D o y do item é a profundidade, que vira z na cena. A altura nunca é tocada.
    item.y = nextZ;
    const group = groups().get(dragId);
    if (group) {
      group.position.set(nextX, 0, nextZ);
      // O contorno vem de um BoxHelper: sem isto ele ficaria parado no lugar de origem.
      opts.highlight.update();
    }
    store.emit();
  }

  function onPointerUp(event: PointerEvent): void {
    if (!dragging) return;
    if (pointerId !== null && event.pointerId !== pointerId) return;
    // Só o botão esquerdo encerra o gesto; botões extras não commitam nada.
    if (event.button !== 0) return;
    finishDrag(moved);
  }

  /** Encerra o gesto: um único commit se houve movimento, senão volta ao snapshot. */
  function finishDrag(commit: boolean): void {
    if (!dragging) return;
    const snapshot = before;
    releaseCapture();
    releaseControls();
    resetState();
    if (commit && snapshot) store.commit('Mover', snapshot);
    else if (snapshot) store.setDoc(snapshot, false);
  }

  function cancelDrag(): void {
    finishDrag(false);
  }

  function onPointerCancel(): void {
    cancelDrag();
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    if (!dragging) return;
    // Este listener é registrado antes do listener de Escape que fecha o painel em
    // ui/viewer3d.ts; parar a propagação impede que a mesma tecla feche o painel.
    event.stopImmediatePropagation();
    event.preventDefault();
    cancelDrag();
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerCancel);
  // Rede de segurança: o ponteiro pode ser solto fora do canvas.
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerCancel);
  window.addEventListener('keydown', onKeyDown);
  return () => {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerCancel);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerCancel);
    window.removeEventListener('keydown', onKeyDown);
    // Dispose com gesto ativo: desfaz a posição mutada (sem passo de histórico).
    if (dragging && before) store.setDoc(before, false);
    releaseCapture();
    releaseControls();
    resetState();
  };
}
