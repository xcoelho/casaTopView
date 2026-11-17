/** Imagem da maquete 3D gerada fora da tela, usada na exportação em PDF. */
import * as THREE from 'three';
import type { Plan } from '../core/document';
import { planBounds } from '../core/document';
import { buildFloors, buildWalls } from './architecture';
import { applyRealisticEnvironment } from './env';
import { buildFurniture } from './furniture';

const DEG = Math.PI / 180;

export interface SnapshotOptions {
  width?: number;
  height?: number;
  /** Inclui as paredes na maquete (padrão: sim). */
  walls?: boolean;
}

/** Desenha a planta em 3D num canvas novo (sem depender da vista 3D estar aberta). */
export function renderPlanSnapshot(plan: Plan, options: SnapshotOptions = {}): HTMLCanvasElement | null {
  const width = Math.max(640, Math.round(options.width ?? 1800));
  const height = Math.max(420, Math.round(options.height ?? 1200));

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f1eee6');
  const disposeEnv = applyRealisticEnvironment(renderer, scene, 0.36);

  const bounds = planBounds(plan) ?? { x: -500, y: -350, w: 1000, h: 700 };
  const cx = bounds.x + bounds.w / 2;
  const cz = bounds.y + bounds.h / 2;
  const radius = Math.max(bounds.w, bounds.h, 300) / 2 + 250;

  scene.add(new THREE.HemisphereLight(0xfaf8f2, 0x8f8b80, 0.38));

  const sun = new THREE.DirectionalLight(0xfff4e0, 1.22);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 2;
  sun.position.set(cx + radius, radius * 1.7, cz - radius * 0.6);
  sun.target.position.set(cx, 0, cz);
  scene.add(sun, sun.target);

  const shadowCamera = sun.shadow.camera;
  shadowCamera.left = -radius * 1.5;
  shadowCamera.right = radius * 1.5;
  shadowCamera.top = radius * 1.5;
  shadowCamera.bottom = -radius * 1.5;
  shadowCamera.near = 1;
  shadowCamera.far = radius * 8;
  shadowCamera.updateProjectionMatrix();

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

  const world = new THREE.Group();
  const walls = buildWalls(plan);
  walls.visible = options.walls ?? true;
  world.add(buildFloors(plan), walls);
  for (const item of plan.items) {
    if (!item.hidden) world.add(buildFurniture(item));
  }
  scene.add(world);

  const camera = new THREE.PerspectiveCamera(50, width / height, 5, 60000);
  const center = new THREE.Vector3(cx, 55, cz);
  const frameRadius = Math.hypot(bounds.w, bounds.h) / 2 + 150;
  const halfV = (camera.fov * DEG) / 2;
  const halfH = Math.atan(Math.tan(halfV) * camera.aspect);
  const distance = (frameRadius / Math.sin(Math.min(halfV, halfH))) * 0.95;
  camera.position.copy(center).addScaledVector(new THREE.Vector3(0.7, 1.1, 1).normalize(), distance);
  camera.near = Math.max(4, distance / 400);
  camera.far = distance * 12 + 20000;
  camera.lookAt(center);
  camera.updateProjectionMatrix();

  renderer.render(scene, camera);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f1eee6';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(renderer.domElement, 0, 0);
  }

  disposeEnv();
  ground.geometry.dispose();
  (ground.material as THREE.Material).dispose();
  renderer.dispose();
  renderer.forceContextLoss();

  return ctx ? canvas : null;
}
