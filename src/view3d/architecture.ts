/** Paredes com vãos, esquadrias, portas entreabertas e pisos dos cômodos. */
import * as THREE from 'three';
import type { Plan, Wall } from '../core/document';
import { DEFAULT_DOOR_COLOR, DEFAULT_WALL_COLOR, itemBounds, wallParts } from '../core/document';
import { floorKeyForPisoDef } from '../catalog/items/pisos';
import { pointInPolygon } from '../core/geometry';
import { shade } from '../catalog/draw';
import { boxAt, cylinderAt, floorSurface, roundedBoxAt, torusAt } from './materials';
import {
  DOOR_HEIGHT,
  GARAGE_HEIGHT,
  PASS_HEIGHT,
  WALL_HEIGHT,
  WINDOW_HEAD,
  WINDOW_SILL,
} from '../core/constants';

const DEG = Math.PI / 180;

export { WALL_HEIGHT };
const WALL_COLOR = DEFAULT_WALL_COLOR;
const FRAME_COLOR = '#fbfaf6';
const GLASS_COLOR = '#bfe3f2';
const BASEBOARD_COLOR = '#fbfaf6';
const BASEBOARD_HEIGHT = 8;
const BASEBOARD_THICKNESS = 1.2;

function buildOpening(
  group: THREE.Group,
  wall: Wall,
  opening: Plan['openings'][number],
  length: number,
  ux: number,
  uy: number,
  angle: number,
  thickness: number,
): void {
  const half = Math.min(opening.width, length) / 2;
  const start = Math.max(0, opening.offset - half);
  const end = Math.min(length, opening.offset + half);
  const width = end - start;
  if (width < 1) return;

  const centerDist = (start + end) / 2;
  const cx = wall.a.x + ux * centerDist;
  const cz = wall.a.y + uy * centerDist;

  const frame = new THREE.Group();
  frame.position.set(cx, 0, cz);
  frame.rotation.y = -angle;
  group.add(frame);

  if (opening.kind === 'vao') return;

  if (opening.kind.startsWith('porta')) {
    const doorColor = opening.color ?? DEFAULT_DOOR_COLOR;

    if (opening.kind === 'porta-garagem') {
      boxAt(frame, width - 4, 4, GARAGE_HEIGHT - 2, 0, 0, 1, doorColor, 1, 0, 'wood');
      for (let i = 1; i < 8; i++) {
        boxAt(frame, width - 8, 1.5, 2, 0, 2.2, (GARAGE_HEIGHT / 8) * i, shade(doorColor, -0.14));
      }
      return;
    }

    if (opening.kind === 'porta-correr') {
      boxAt(frame, width / 2, 3, DOOR_HEIGHT - 4, -width / 4, 2.5, 2, doorColor, 1, 0, 'wood');
      boxAt(frame, width / 2, 3, DOOR_HEIGHT - 4, width / 4, -2.5, 2, shade(doorColor, -0.1), 1, 0, 'wood');
      boxAt(frame, width / 2, 4, 3, width / 4, -2.5, 120, '#8a867d');
      return;
    }

    const leaves = opening.kind === 'porta-dupla' ? 2 : 1;
    // buildOpening só recebe Opening (sem defId), então a diferenciação é por
    // faixa de width: porta-pivotante (100) puxador barra vertical; porta-vidro
    // (85–100) folha em vidro com moldura de madeira e puxador barra curto.
    // Existentes não atingem as faixas: porta-simples (80), porta-dupla (150, 2 folhas).
    const isPivotante = leaves === 1 && width >= 100;
    const isVidro = leaves === 1 && width >= 85 && width < 100;
    for (let i = 0; i < leaves; i++) {
      const atEnd = leaves === 2 ? i === 1 : opening.hinge === 'dir';
      const hingeDist = atEnd ? end : start;
      const leafWidth = width / leaves;
      const hingeX = wall.a.x + ux * hingeDist;
      const hingeZ = wall.a.y + uy * hingeDist;
      const side = atEnd ? -1 : 1;
      const swing = (opening.flip ? -1 : 1) * side * (leaves === 2 ? 1 : 1) * 62 * DEG;

      const leaf = new THREE.Group();
      leaf.position.set(hingeX, 0, hingeZ);
      leaf.rotation.y = -angle + swing;
      group.add(leaf);

      if (isVidro) {
        const glassWidth = leafWidth - 10;
        boxAt(leaf, glassWidth, 2, DOOR_HEIGHT - 12, (side * leafWidth) / 2, 0, 6, GLASS_COLOR, 0.5, 0, 'glass');
        // Moldura de madeira nas bordas: 2 montantes + 2 travessas.
        boxAt(leaf, 5, 5, DOOR_HEIGHT - 2, side * 2.5, 0, 1, doorColor, 1, 0, 'wood');
        boxAt(leaf, 5, 5, DOOR_HEIGHT - 2, side * (leafWidth - 2.5), 0, 1, doorColor, 1, 0, 'wood');
        boxAt(leaf, leafWidth - 1, 5, 6, (side * leafWidth) / 2, 0, 1, doorColor, 1, 0, 'wood');
        boxAt(leaf, leafWidth - 1, 5, 6, (side * leafWidth) / 2, 0, DOOR_HEIGHT - 7, doorColor, 1, 0, 'wood');
        // Puxador barra curto.
        boxAt(leaf, 2, 4, 30, side * (leafWidth - 10), 0, 90, '#8a867d');
      } else {
        boxAt(leaf, leafWidth - 1, 4, DOOR_HEIGHT - 2, (side * leafWidth) / 2, 0, 1, doorColor, 1, 0, 'wood');
        if (isPivotante) {
          boxAt(leaf, 2.5, 3, 60, side * (leafWidth - 10), 0, 100, '#8a867d');
        } else {
          boxAt(leaf, 2, 6, 6, side * (leafWidth - 10), 0, 100, '#8a867d');
        }
      }
    }
    return;
  }

  // Janelas: vidro + esquadria branca
  // Estreitas (banheiro): peitoril alto — vão curto e elevado.
  const sill = width <= 90 ? 150 : WINDOW_SILL;
  const head = WINDOW_HEAD;
  // Óculo redondo: janelas muito estreitas usam vidro circular com aro.
  if (width <= 75) {
    const r = Math.max(width / 2 - 4, 6);
    const centerY = (sill + head) / 2;
    const glass = cylinderAt(frame, r, 3, 0, 0, centerY - 1.5, GLASS_COLOR, 0.34);
    glass.rotation.x = Math.PI / 2;
    torusAt(frame, r, 2, 0, 0, centerY, FRAME_COLOR, 'matte', 0);
  } else {
    boxAt(frame, width - 8, 3, head - sill - 8, 0, 0, sill + 4, GLASS_COLOR, 0.34);
    boxAt(frame, width, Math.min(6, thickness), 6, 0, 0, sill, FRAME_COLOR);
    boxAt(frame, width, Math.min(6, thickness), 6, 0, 0, head - 6, FRAME_COLOR);
    boxAt(frame, 5, Math.min(6, thickness), head - sill, -width / 2 + 2.5, 0, sill, FRAME_COLOR);
    boxAt(frame, 5, Math.min(6, thickness), head - sill, width / 2 - 2.5, 0, sill, FRAME_COLOR);
    boxAt(frame, 3, Math.min(5, thickness), head - sill, 0, 0, sill, FRAME_COLOR);
  }
  // Janelas largas: cortinas laterais em tecido + varão.
  if (width >= 150) {
    const curtain = '#8a6a4f';
    boxAt(frame, 14, 5, head - sill, -width / 2 + 7, 5, sill, curtain, 1, 0, 'matte');
    boxAt(frame, 14, 5, head - sill, width / 2 - 7, 5, sill, curtain, 1, 0, 'matte');
    const rod = cylinderAt(frame, 1.2, width + 12, 0, 5, head + 2, '#8a867d');
    rod.rotation.z = Math.PI / 2;
  }
}

export function buildWalls(plan: Plan): THREE.Group {
  const group = new THREE.Group();
  const roomPolygons = plan.rooms
    .filter((room) => room.points.length >= 3)
    .map((room) => room.points);
  const pisoBounds = plan.items
    .filter((item) => !item.hidden && floorKeyForPisoDef(item.defId))
    .map((item) => itemBounds(item));

  for (const wall of plan.walls) {
    const dx = wall.b.x - wall.a.x;
    const dy = wall.b.y - wall.a.y;
    const length = Math.hypot(dx, dy);
    if (length < 1) continue;

    const ux = dx / length;
    const uy = dy / length;
    const angle = Math.atan2(dy, dx);
    const thickness = Math.max(4, wall.thickness);
    const openings = plan.openings.filter((o) => o.wallId === wall.id);

    const segment = (start: number, end: number, base: number, height: number): void => {
      if (end - start < 1 || height < 1) return;
      const dist = (start + end) / 2;
      const x = wall.a.x + ux * dist;
      const z = wall.a.y + uy * dist;
      boxAt(group, end - start, thickness, height, x, z, base, wall.color ?? WALL_COLOR, 1, -angle, 'wallPaint');
    };

    /** O rodapé só existe no lado da parede que dá para um cômodo ou piso manual. */
    const sideTouchesRoom = (start: number, end: number, side: number): boolean => {
      if (!roomPolygons.length && !pisoBounds.length) return false;
      const nx = -uy * side;
      const nz = ux * side;
      for (const t of [0.15, 0.5, 0.85]) {
        const dist = start + (end - start) * t;
        const x = wall.a.x + ux * dist;
        const z = wall.a.y + uy * dist;
        for (const offset of [2, 10]) {
          const probe = {
            x: x + nx * (thickness / 2 + offset),
            y: z + nz * (thickness / 2 + offset),
          };
          if (roomPolygons.some((points) => pointInPolygon(probe, points))) return true;
          if (
            pisoBounds.some(
              (bounds) =>
                probe.x >= bounds.x && probe.x <= bounds.x + bounds.w && probe.y >= bounds.y && probe.y <= bounds.y + bounds.h,
            )
          ) {
            return true;
          }
        }
      }
      return false;
    };

    const baseboard = (start: number, end: number): void => {
      const length = end - start;
      if (length < 2) return;
      const dist = (start + end) / 2;
      const x = wall.a.x + ux * dist;
      const z = wall.a.y + uy * dist;
      const offset = thickness / 2 + BASEBOARD_THICKNESS / 2;
      for (const side of [-1, 1]) {
        if (!sideTouchesRoom(start, end, side)) continue;
        roundedBoxAt(
          group,
          length,
          BASEBOARD_THICKNESS,
          BASEBOARD_HEIGHT,
          x - uy * offset * side,
          z + ux * offset * side,
          0,
          BASEBOARD_COLOR,
          0.3,
          'paint',
          1,
          -angle,
        );
      }
    };

    for (const [start, end] of wallParts(wall, plan.openings)) {
      segment(start, end, 0, WALL_HEIGHT);
      baseboard(start, end);
    }

    for (const opening of openings) {
      const half = Math.min(opening.width, length) / 2;
      const start = Math.max(0, opening.offset - half);
      const end = Math.min(length, opening.offset + half);
      if (end - start < 1) continue;

      if (opening.kind === 'vao') {
        segment(start, end, PASS_HEIGHT, WALL_HEIGHT - PASS_HEIGHT);
      } else if (opening.kind.startsWith('porta')) {
        const head = opening.kind === 'porta-garagem' ? GARAGE_HEIGHT : DOOR_HEIGHT;
        segment(start, end, head, WALL_HEIGHT - head);
      } else {
        const wWidth = end - start;
        const sill = wWidth <= 90 ? 150 : WINDOW_SILL;
        segment(start, end, 0, sill);
        segment(start, end, WINDOW_HEAD, WALL_HEIGHT - WINDOW_HEAD);
        baseboard(start, end);
      }

      buildOpening(group, wall, opening, length, ux, uy, angle, thickness);
    }
  }

  return group;
}

export function buildFloors(plan: Plan): THREE.Group {
  const group = new THREE.Group();

  for (const room of plan.rooms) {
    if (room.points.length < 3) continue;
    const shape = new THREE.Shape(room.points.map((p) => new THREE.Vector2(p.x, p.y)));
    const geometry = new THREE.ShapeGeometry(shape);
    const mesh = new THREE.Mesh(geometry, floorSurface(room.floor));
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = 0.8;
    mesh.receiveShadow = true;
    group.add(mesh);
  }

  return group;
}
