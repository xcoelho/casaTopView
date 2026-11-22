/** Cena WebGL da planta: luz de céu + sol com sombras, órbita e zoom. */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Plan } from '../core/document';
import { planBounds } from '../core/document';
import type { Store } from '../core/store';
import { buildFloors, buildWalls } from './architecture';
import { applyRealisticEnvironment } from './env';
import { buildFurniture } from './furniture';
import { createQualityRenderer, type QualityRenderer } from './quality';
import {
  attachElevationHandle,
  attachItemDrag,
  attachItemFocus,
  attachItemPicking,
  attachSelectionHighlight,
  type ElevationHandle,
} from './interaction3d';

const DEG = Math.PI / 180;

/** Intensidade do IBL: mais forte em alta qualidade para os metais e vidros reagirem. */
const ENV_INTENSITY = 0.36;
const ENV_INTENSITY_HQ = 0.5;
const SHADOW_MAP = 2048;
const SHADOW_MAP_HQ = 4096;
/** Blur do PCF: quanto maior, mais suave a borda da sombra. */
const SHADOW_RADIUS = 3;
const SHADOW_RADIUS_HQ = 5;

export interface View3DHandle {
  update(plan: Plan): void;
  setWalls(visible: boolean): void;
  setHighQuality(enabled: boolean): void;
  fit(): void;
  dispose(): void;
}

export function createView3D(container: HTMLElement, initial: Plan, store: Store): View3DHandle {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.className = 'viewer3d-canvas';
  container.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f1eee6');
  const disposeEnv = applyRealisticEnvironment(renderer, scene, ENV_INTENSITY);

  const camera = new THREE.PerspectiveCamera(50, 1, 5, 40000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI / 2 - 0.06;
  controls.minDistance = 120;
  controls.maxDistance = 20000;

  scene.add(new THREE.HemisphereLight(0xfaf8f2, 0x8f8b80, 0.38));

  const sun = new THREE.DirectionalLight(0xfff4e0, 1.22);
  sun.castShadow = true;
  sun.shadow.mapSize.set(SHADOW_MAP, SHADOW_MAP);
  sun.shadow.radius = SHADOW_RADIUS;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 2;
  scene.add(sun);
  scene.add(sun.target);

  const fill = new THREE.DirectionalLight(0xe2ecff, 0.22);
  fill.position.set(-1, 0.6, 1);
  scene.add(fill);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60000, 60000),
    new THREE.MeshStandardMaterial({ color: '#cbc6b8', roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1;
  ground.receiveShadow = true;
  scene.add(ground);

  let plan = initial;
  let world: THREE.Group | null = null;
  let walls: THREE.Object3D | null = null;
  let wallsVisible = true;
  let groupsById = new Map<string, THREE.Group>();

  function configureSun(): void {
    const bounds = planBounds(plan) ?? { x: -500, y: -350, w: 1000, h: 700 };
    const cx = bounds.x + bounds.w / 2;
    const cz = bounds.y + bounds.h / 2;
    const radius = Math.max(bounds.w, bounds.h, 300) / 2 + 250;

    sun.position.set(cx + radius * 1, radius * 1.7, cz - radius * 0.6);
    sun.target.position.set(cx, 0, cz);

    const shadowCamera = sun.shadow.camera;
    shadowCamera.left = -radius * 1.5;
    shadowCamera.right = radius * 1.5;
    shadowCamera.top = radius * 1.5;
    shadowCamera.bottom = -radius * 1.5;
    shadowCamera.near = 1;
    shadowCamera.far = radius * 8;
    shadowCamera.updateProjectionMatrix();
  }

  /** Troca o shadow map em runtime; a textura precisa ser descartada para recriar. */
  function setShadowQuality(high: boolean): void {
    sun.shadow.radius = high ? SHADOW_RADIUS_HQ : SHADOW_RADIUS;
    const size = high ? SHADOW_MAP_HQ : SHADOW_MAP;
    if (sun.shadow.mapSize.x === size) return;
    sun.shadow.mapSize.set(size, size);
    sun.shadow.map?.dispose();
    sun.shadow.map = null;
  }

  function rebuild(next: Plan): void {
    plan = next;
    if (world) {
      scene.remove(world);
      world = null;
    }

    world = new THREE.Group();
    walls = buildWalls(next);
    walls.visible = wallsVisible;
    world.add(buildFloors(next), walls);

    // Índice id -> grupo apenas para itens visíveis (paredes/pisos nunca entram).
    groupsById = new Map<string, THREE.Group>();
    for (const item of next.items) {
      if (!item.hidden) {
        const g = buildFurniture(item);
        world.add(g);
        groupsById.set(item.id, g);
      }
    }

    scene.add(world);
    configureSun();
  }

  function fit(): void {
    const bounds = planBounds(plan) ?? { x: -500, y: -350, w: 1000, h: 700 };
    const center = new THREE.Vector3(bounds.x + bounds.w / 2, 55, bounds.y + bounds.h / 2);
    const radius = Math.hypot(bounds.w, bounds.h) / 2 + 150;
    const distance = (radius / Math.sin((camera.fov * DEG) / 2)) * 0.95;
    const direction = new THREE.Vector3(0.7, 1.1, 1).normalize();

    camera.position.copy(center).addScaledVector(direction, distance);
    camera.near = Math.max(4, distance / 400);
    camera.far = distance * 12 + 20000;
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    controls.minDistance = Math.max(120, radius * 0.25);
    controls.maxDistance = radius * 8;
    controls.update();
  }

  let quality: QualityRenderer | null = null;
  let highQuality = false;

  function resize(): void {
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    quality?.setSize(width, height);
  }

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  window.addEventListener('resize', resize);

  let raf = 0;
  let elevationGizmo: ElevationHandle | null = null;
  function loop(): void {
    raf = requestAnimationFrame(loop);
    controls.update();
    elevationGizmo?.tick();
    if (highQuality && quality) quality.render();
    else renderer.render(scene, camera);
  }

  rebuild(initial);
  resize();
  fit();
  loop();
  const disposePicking = attachItemPicking({
    canvas: renderer.domElement,
    camera,
    groups: () => groupsById,
    store,
  });
  const highlight = attachSelectionHighlight({
    scene,
    groups: () => groupsById,
    store,
  });
  const disposeFocus = attachItemFocus({
    canvas: renderer.domElement,
    camera,
    controls,
    groups: () => groupsById,
    store,
  });
  const disposeDrag = attachItemDrag({
    canvas: renderer.domElement,
    camera,
    controls,
    groups: () => groupsById,
    store,
    highlight,
  });
  elevationGizmo = attachElevationHandle({
    canvas: renderer.domElement,
    camera,
    scene,
    controls,
    groups: () => groupsById,
    store,
    highlight,
  });
  // Garante medidas corretas no primeiro frame, quando o painel acabou de entrar no DOM.
  requestAnimationFrame(() => {
    resize();
    fit();
  });

  return {
    update: (next) => {
      rebuild(next);
      // rebuild() recria os grupos: contorno e alça precisam reapontar para o novo grupo.
      highlight.refresh();
      elevationGizmo?.refresh();
    },
    setWalls: (visible) => {
      wallsVisible = visible;
      if (walls) walls.visible = visible;
    },
    setHighQuality: (enabled) => {
      if (enabled) {
        if (!quality) {
          const width = Math.max(1, container.clientWidth);
          const height = Math.max(1, container.clientHeight);
          quality = createQualityRenderer(renderer, scene, camera, { width, height });
        }
        highQuality = quality !== null;
      } else {
        highQuality = false;
      }

      scene.environmentIntensity = highQuality ? ENV_INTENSITY_HQ : ENV_INTENSITY;
      renderer.toneMappingExposure = highQuality ? 0.96 : 0.98;
      setShadowQuality(highQuality);
    },
    fit,
    dispose: () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      disposePicking();
      highlight.dispose();
      disposeFocus();
      disposeDrag();
      elevationGizmo?.dispose();
      quality?.dispose();
      controls.dispose();
      if (world) scene.remove(world);
      disposeEnv();
      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
