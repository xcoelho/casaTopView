/** Primitivas, geometrias cacheadas e materiais PBR para os modelos da vista 3D. */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { floorMaterial } from '../core/document';
import type { FloorKey } from '../core/document';
import {
  brushedMetalTexture,
  fabricAlbedoTexture,
  fabricWeaveTexture,
  floorTexture,
  screenSheenTexture,
  stoneAlbedoTexture,
  stoneSpeckleTexture,
  wallPaintTexture,
  waterRippleTexture,
  woodAlbedoTexture,
  woodGrainTexture,
} from './textures';

export type MaterialKind =
  | 'matte'
  | 'wood'
  | 'fabric'
  | 'metal'
  | 'chrome'
  | 'glass'
  | 'ceramic'
  | 'stone'
  | 'paint'
  | 'wallPaint'
  | 'screen'
  | 'screenGlow'
  | 'foliage'
  | 'emissive'
  | 'water';

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 24);
const sphereGeometry = new THREE.SphereGeometry(1, 20, 14);

const materials = new Map<string, THREE.Material>();
const floorMaterials = new Map<FloorKey, THREE.Material>();
const geometryCache = new Map<string, THREE.BufferGeometry>();
const doubleSided = new Map<THREE.Material, THREE.Material>();

const FLOOR_ROUGHNESS: Record<FloorKey, number> = {
  madeira: 0.52,
  porcelanato: 0.3,
  ceramica: 0.38,
  concreto: 0.82,
  carpete: 0.96,
  grama: 0.94,
};

const FLOOR_BUMP: Record<FloorKey, number> = {
  madeira: 0.2,
  porcelanato: 0.4,
  ceramica: 0.4,
  concreto: 0.3,
  carpete: 0.15,
  grama: 0.18,
};

const FLOOR_ENV: Record<FloorKey, number> = {
  madeira: 0.3,
  porcelanato: 0.5,
  ceramica: 0.45,
  concreto: 0.25,
  carpete: 0.15,
  grama: 0.2,
};

const q = (v: number): number => Math.round(v * 2) / 2;

function cachedGeometry(key: string, create: () => THREE.BufferGeometry): THREE.BufferGeometry {
  const existing = geometryCache.get(key);
  if (existing) return existing;
  const geom = create();
  geometryCache.set(key, geom);
  return geom;
}

/** Variante com faces duplas, sem contaminar o material compartilhado. */
function doubleSidedMaterial(source: THREE.Material): THREE.Material {
  const cached = doubleSided.get(source);
  if (cached) return cached;
  const clone = source.clone();
  clone.side = THREE.DoubleSide;
  doubleSided.set(source, clone);
  return clone;
}

export function material(
  color: string,
  opacity = 1,
  kind: MaterialKind = 'matte',
): THREE.Material {
  const key = `${kind}|${color}|${opacity.toFixed(2)}`;
  const cached = materials.get(key);
  if (cached) return cached;

  const transparent = opacity < 1;
  let created: THREE.Material;

  switch (kind) {
    case 'wood': {
      const tex = woodGrainTexture();
      created = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.56,
        metalness: 0.04,
        map: woodAlbedoTexture(),
        bumpMap: tex,
        bumpScale: 0.55,
        roughnessMap: tex,
        transparent,
        opacity,
      });
      break;
    }
    case 'fabric': {
      const tex = fabricWeaveTexture();
      created = new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.92,
        metalness: 0,
        map: fabricAlbedoTexture(),
        bumpMap: tex,
        bumpScale: 0.45,
        sheen: 0.22,
        sheenRoughness: 0.9,
        sheenColor: new THREE.Color('#ffffff'),
        transparent,
        opacity,
      });
      break;
    }
    case 'metal': {
      const tex = brushedMetalTexture();
      created = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.32,
        metalness: 0.78,
        bumpMap: tex,
        bumpScale: 0.25,
        envMapIntensity: 1.6,
        transparent,
        opacity,
      });
      break;
    }
    case 'chrome':
      created = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.18,
        metalness: 0.88,
        envMapIntensity: 2.4,
        transparent,
        opacity,
      });
      break;
    case 'glass':
      created = new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.06,
        metalness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 1.8,
        transparent: true,
        opacity: opacity < 1 ? opacity : 0.32,
        depthWrite: false,
      });
      break;
    case 'ceramic':
      created = new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.18,
        metalness: 0.04,
        clearcoat: 0.7,
        clearcoatRoughness: 0.12,
        envMapIntensity: 1.1,
        transparent,
        opacity,
      });
      break;
    case 'stone': {
      const tex = stoneSpeckleTexture();
      created = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.48,
        metalness: 0.04,
        map: stoneAlbedoTexture(),
        bumpMap: tex,
        bumpScale: 0.35,
        roughnessMap: tex,
        transparent,
        opacity,
      });
      break;
    }
    case 'paint':
      created = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.44,
        metalness: 0.02,
        transparent,
        opacity,
      });
      break;
    case 'wallPaint': {
      const tex = wallPaintTexture();
      created = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.86,
        metalness: 0,
        bumpMap: tex,
        bumpScale: 0.12,
        envMapIntensity: 0.3,
        transparent,
        opacity,
      });
      break;
    }
    case 'screen':
      created = new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.12,
        metalness: 0.22,
        clearcoat: 0.9,
        clearcoatRoughness: 0.08,
        envMapIntensity: 2.2,
      });
      break;
    case 'screenGlow':
      created = new THREE.MeshBasicMaterial({
        map: screenSheenTexture(),
        transparent,
        opacity,
        toneMapped: false,
      });
      break;
    case 'foliage':
      created = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.66,
        metalness: 0.02,
        side: THREE.DoubleSide,
        transparent,
        opacity,
      });
      break;
    case 'emissive':
      created = new THREE.MeshStandardMaterial({
        color,
        emissive: new THREE.Color(color),
        emissiveIntensity: 1.05,
        roughness: 0.35,
        metalness: 0,
      });
      break;
    case 'water': {
      const tex = waterRippleTexture();
      created = new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.06,
        metalness: 0.02,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        envMapIntensity: 2.6,
        bumpMap: tex,
        bumpScale: 0.3,
        transparent: true,
        opacity: opacity < 1 ? opacity : 0.74,
      });
      break;
    }
    default:
      created = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.76,
        metalness: 0.03,
        transparent,
        opacity,
      });
      break;
  }

  materials.set(key, created);
  return created;
}

/** Piso por ambiente com textura procedural na escala real e bump de rejunte/veio. */
export function floorSurface(key: FloorKey): THREE.Material {
  const cached = floorMaterials.get(key);
  if (cached) return cached;

  const info = floorMaterial(key);
  const texture = floorTexture(key, info.base, info.line);
  const created = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    map: texture.map,
    bumpMap: texture.bump,
    bumpScale: FLOOR_BUMP[key],
    roughness: FLOOR_ROUGHNESS[key],
    metalness: 0,
    envMapIntensity: FLOOR_ENV[key],
    side: THREE.DoubleSide,
  });
  floorMaterials.set(key, created);
  return created;
}

/** Caixa com base em `baseY`; `x`/`z` no plano e `rotY` em radianos. */
export function boxAt(
  parent: THREE.Object3D,
  w: number,
  d: number,
  h: number,
  x: number,
  z: number,
  baseY: number,
  color: string,
  opacity = 1,
  rotY = 0,
  kind: MaterialKind = 'matte',
): THREE.Mesh {
  const mesh = new THREE.Mesh(boxGeometry, material(color, opacity, kind));
  mesh.scale.set(Math.max(w, 0.01), Math.max(h, 0.01), Math.max(d, 0.01));
  mesh.position.set(x, baseY + h / 2, z);
  mesh.rotation.y = rotY;
  mesh.castShadow = opacity >= 1;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

/** Caixa com cantos arredondados (geometria cacheada por dimensão em passos de 0.5 cm). */
export function roundedBoxAt(
  parent: THREE.Object3D,
  w: number,
  d: number,
  h: number,
  x: number,
  z: number,
  baseY: number,
  color: string,
  radius = 1.6,
  kind: MaterialKind = 'matte',
  opacity = 1,
  rotY = 0,
  rotX = 0,
  rotZ = 0,
): THREE.Mesh {
  const qw = Math.max(q(w), 0.5);
  const qh = Math.max(q(h), 0.5);
  const qd = Math.max(q(d), 0.5);
  const maxR = Math.min(qw, qh, qd) * 0.45;
  const qr = Math.max(0.2, Math.min(q(radius), maxR));

  const geom = cachedGeometry(
    `rbox|${qw}|${qh}|${qd}|${qr}`,
    () => new RoundedBoxGeometry(qw, qh, qd, 3, qr),
  );
  const mesh = new THREE.Mesh(geom, material(color, opacity, kind));
  mesh.position.set(x, baseY + h / 2, z);
  mesh.rotation.set(rotX, rotY, rotZ);
  mesh.castShadow = opacity >= 1;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function cylinderAt(
  parent: THREE.Object3D,
  radius: number,
  h: number,
  x: number,
  z: number,
  baseY: number,
  color: string,
  opacity = 1,
  kind: MaterialKind = 'matte',
): THREE.Mesh {
  const mesh = new THREE.Mesh(cylinderGeometry, material(color, opacity, kind));
  mesh.scale.set(Math.max(radius, 0.01), Math.max(h, 0.01), Math.max(radius, 0.01));
  mesh.position.set(x, baseY + h / 2, z);
  mesh.castShadow = opacity >= 1;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

/** Cone/tronco de cone cacheado, para abajures, pendentes e pés afunilados. */
export function coneAt(
  parent: THREE.Object3D,
  radiusTop: number,
  radiusBottom: number,
  h: number,
  x: number,
  z: number,
  baseY: number,
  color: string,
  opacity = 1,
  kind: MaterialKind = 'matte',
  radialSegments = 24,
  openEnded = false,
): THREE.Mesh {
  const rt = Math.max(q(radiusTop), 0.1);
  const rb = Math.max(q(radiusBottom), 0.1);
  const qh = Math.max(q(h), 0.5);
  const geom = cachedGeometry(
    `cone|${rt}|${rb}|${qh}|${radialSegments}|${openEnded ? 1 : 0}`,
    () => new THREE.CylinderGeometry(rt, rb, qh, radialSegments, 1, openEnded),
  );
  const base = material(color, opacity, kind);
  const mat = openEnded ? doubleSidedMaterial(base) : base;
  const mesh = new THREE.Mesh(geom, mat);  mesh.position.set(x, baseY + h / 2, z);
  mesh.castShadow = opacity >= 1;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function sphereAt(
  parent: THREE.Object3D,
  radius: number,
  x: number,
  y: number,
  z: number,
  color: string,
  scale: [number, number, number] = [1, 1, 1],
  kind: MaterialKind = 'matte',
  opacity = 1,
): THREE.Mesh {
  const mesh = new THREE.Mesh(sphereGeometry, material(color, opacity, kind));
  mesh.scale.set(radius * scale[0], radius * scale[1], radius * scale[2]);
  mesh.position.set(x, y, z);
  mesh.castShadow = opacity >= 1;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

/** Perfil revolvido (LatheGeometry cacheado) para louças, vasos, luminárias e tampos boleados. */
export function latheAt(
  parent: THREE.Object3D,
  profile: Array<[number, number]>,
  x: number,
  z: number,
  baseY: number,
  color: string,
  kind: MaterialKind = 'ceramic',
  segments = 28,
  scaleX = 1,
  scaleZ = 1,
  opacity = 1,
): THREE.Mesh {
  const key = `lathe|${segments}|${profile.map(([r, y]) => `${q(r)},${q(y)}`).join(';')}`;
  const geom = cachedGeometry(key, () => {
    const pts = profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 0), y));
    return new THREE.LatheGeometry(pts, segments);
  });
  const mat = material(color, opacity, kind);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.scale.set(scaleX, 1, scaleZ);
  mesh.position.set(x, baseY, z);
  mesh.castShadow = opacity >= 1;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

/** Anel/toro cacheado, para aros de banqueta, visor de máquina de lavar e alças. */
export function torusAt(
  parent: THREE.Object3D,
  radius: number,
  tube: number,
  x: number,
  z: number,
  y: number,
  color: string,
  kind: MaterialKind = 'chrome',
  rotX = Math.PI / 2,
  rotY = 0,
  arc = Math.PI * 2,
  opacity = 1,
): THREE.Mesh {
  const qr = Math.max(q(radius), 0.5);
  const qt = Math.max(q(tube), 0.25);
  const qa = Math.round(arc * 100);
  const geom = cachedGeometry(
    `torus|${qr}|${qt}|${qa}`,
    () => new THREE.TorusGeometry(qr, qt, 12, 28, arc),
  );
  const mesh = new THREE.Mesh(geom, material(color, opacity, kind));
  mesh.position.set(x, y, z);
  mesh.rotation.set(rotX, rotY, 0);
  mesh.castShadow = opacity >= 1;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

/** Tubo curvo ao longo de pontos 3D (torneiras, pés curvos, corrimão), cacheado por pontos. */
export function tubeAt(
  parent: THREE.Object3D,
  points: Array<[number, number, number]>,
  radius: number,
  x: number,
  z: number,
  baseY: number,
  color: string,
  kind: MaterialKind = 'chrome',
  opacity = 1,
): THREE.Mesh {
  const qr = Math.max(q(radius), 0.25);
  const key = `tube|${qr}|${points.map(([px, py, pz]) => `${q(px)},${q(py)},${q(pz)}`).join(';')}`;
  const geom = cachedGeometry(key, () => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(([px, py, pz]) => new THREE.Vector3(px, py, pz)),
    );
    return new THREE.TubeGeometry(curve, Math.max(12, points.length * 6), qr, 10, false);
  });
  const mesh = new THREE.Mesh(geom, material(color, opacity, kind));
  mesh.position.set(x, baseY, z);
  mesh.castShadow = opacity >= 1;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
