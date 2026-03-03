"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

// ── Layout constants ──
const W = 0.06;
const WH = 0.5;
const FH = 0.02;
const FLOOR_Y = -0.3; // group offset

// ── Material colors ──
const WALL = "#f0ebe3";
const WOOD_DARK = "#7a5c3a";
const WOOD_MED = "#a07850";
const SOFA_COLOR = "#6a7b8c";
const SOFA_CUSHION = "#7d8e9f";
const BED_SHEET = "#e0d8ce";
const BLANKET_BLUE = "#8ab4cc";
const BLANKET_GREEN = "#8abca0";
const PILLOW_COLOR = "#f0ebe3";
const CERAMIC = "#e8e4de";
const COUNTER_BODY = "#e0dbd4";
const COUNTER_TOP = "#c8c0b4";
const METAL = "#9aa0a8";
const SCREEN = "#1a1a2e";
const WATER = "#d4e8f0";

const FL_LIVING = "#c8a878";
const FL_KITCHEN = "#dcd4c8";
const FL_MASTER = "#b89868";
const FL_BED2 = "#ccb488";
const FL_HALL = "#d4c4a4";
const FL_BATH = "#cce0d8";

// ── Room definitions ──
export interface RoomDef {
  id: string;
  name: string;
  dimensions: string;
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
  floorCenter: [number, number, number];
  floorSize: [number, number];
}

export const ROOMS: RoomDef[] = [
  {
    id: "living",
    name: "Living Room",
    dimensions: "6.0m × 4.0m",
    cameraPos: [-1, 0.0, -0.3],
    lookAt: [-1, -0.15, -1.7],
    floorCenter: [-1, 0.03 + FLOOR_Y, -1],
    floorSize: [3, 2],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    dimensions: "4.0m × 4.0m",
    cameraPos: [1.2, 0.0, -0.6],
    lookAt: [2.0, -0.15, -1.5],
    floorCenter: [1.5, 0.03 + FLOOR_Y, -1],
    floorSize: [2, 2],
  },
  {
    id: "master",
    name: "Master Bedroom",
    dimensions: "4.0m × 4.0m",
    cameraPos: [-1.5, 0.0, 0.5],
    lookAt: [-1.5, -0.15, 1.2],
    floorCenter: [-1.5, 0.03 + FLOOR_Y, 1],
    floorSize: [2, 2],
  },
  {
    id: "bathroom",
    name: "Bathroom",
    dimensions: "1.0m × 2.6m",
    cameraPos: [2.25, 0.0, 0.4],
    lookAt: [2.25, -0.15, 0.9],
    floorCenter: [2.25, 0.03 + FLOOR_Y, 0.65],
    floorSize: [0.5, 1.3],
  },
];

const OVERVIEW_POS = new THREE.Vector3(0, 6, 6);
const OVERVIEW_LOOKAT = new THREE.Vector3(0, -0.3, 0);

// ── Base geometry components ──

function SolidWall({
  pos,
  size,
}: {
  pos: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={pos}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={WALL} />
    </mesh>
  );
}

function Floor({
  pos,
  size,
  color,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={pos}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function RoomLabel({
  pos,
  label,
  size = 0.16,
}: {
  pos: [number, number, number];
  label: string;
  size?: number;
}) {
  return (
    <Text
      position={pos}
      fontSize={size}
      color="#5a524a"
      anchorX="center"
      anchorY="middle"
      rotation={[-Math.PI / 2, 0, 0]}
    >
      {label}
    </Text>
  );
}

// ── Furniture components ──

function Sofa({
  pos,
  rotation = 0,
}: {
  pos: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={pos} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[1.2, 0.12, 0.5]} />
        <meshStandardMaterial color={SOFA_COLOR} />
      </mesh>
      <mesh position={[0, 0.15, -0.2]}>
        <boxGeometry args={[1.2, 0.12, 0.1]} />
        <meshStandardMaterial color={SOFA_COLOR} />
      </mesh>
      <mesh position={[-0.57, 0.1, 0]}>
        <boxGeometry args={[0.06, 0.08, 0.5]} />
        <meshStandardMaterial color={SOFA_COLOR} />
      </mesh>
      <mesh position={[0.57, 0.1, 0]}>
        <boxGeometry args={[0.06, 0.08, 0.5]} />
        <meshStandardMaterial color={SOFA_COLOR} />
      </mesh>
      <mesh position={[-0.27, 0.13, 0.02]}>
        <boxGeometry args={[0.48, 0.03, 0.34]} />
        <meshStandardMaterial color={SOFA_CUSHION} />
      </mesh>
      <mesh position={[0.27, 0.13, 0.02]}>
        <boxGeometry args={[0.48, 0.03, 0.34]} />
        <meshStandardMaterial color={SOFA_CUSHION} />
      </mesh>
    </group>
  );
}

function CoffeeTable({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.6, 0.025, 0.35]} />
        <meshStandardMaterial color={WOOD_MED} />
      </mesh>
      {(
        [
          [-0.25, -0.14],
          [0.25, -0.14],
          [-0.25, 0.14],
          [0.25, 0.14],
        ] as [number, number][]
      ).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.03, z]}>
          <boxGeometry args={[0.03, 0.06, 0.03]} />
          <meshStandardMaterial color={WOOD_DARK} />
        </mesh>
      ))}
    </group>
  );
}

function TVUnit({
  pos,
  rotation = 0,
}: {
  pos: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={pos} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.25]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
      <mesh position={[0, 0.18, -0.08]}>
        <boxGeometry args={[0.85, 0.16, 0.02]} />
        <meshStandardMaterial color={SCREEN} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.12, 0.01, 0.08]} />
        <meshStandardMaterial color={METAL} />
      </mesh>
    </group>
  );
}

function DiningTable({
  pos,
  rotation = 0,
}: {
  pos: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={pos} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.55, 0.025, 0.55]} />
        <meshStandardMaterial color={WOOD_MED} />
      </mesh>
      {(
        [
          [-0.22, -0.22],
          [0.22, -0.22],
          [-0.22, 0.22],
          [0.22, 0.22],
        ] as [number, number][]
      ).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.055, z]}>
          <boxGeometry args={[0.03, 0.1, 0.03]} />
          <meshStandardMaterial color={WOOD_DARK} />
        </mesh>
      ))}
    </group>
  );
}

function Chair({
  pos,
  rotation = 0,
}: {
  pos: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={pos} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.075, 0]}>
        <boxGeometry args={[0.14, 0.015, 0.14]} />
        <meshStandardMaterial color={WOOD_MED} />
      </mesh>
      <mesh position={[0, 0.14, -0.065]}>
        <boxGeometry args={[0.12, 0.1, 0.015]} />
        <meshStandardMaterial color={WOOD_MED} />
      </mesh>
      {(
        [
          [-0.055, -0.055],
          [0.055, -0.055],
          [-0.055, 0.055],
          [0.055, 0.055],
        ] as [number, number][]
      ).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.033, z]}>
          <boxGeometry args={[0.015, 0.065, 0.015]} />
          <meshStandardMaterial color={WOOD_DARK} />
        </mesh>
      ))}
    </group>
  );
}

function KitchenCounter({
  pos,
  size,
}: {
  pos: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <group position={pos}>
      <mesh position={[0, size[1] / 2, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={COUNTER_BODY} />
      </mesh>
      <mesh position={[0, size[1] + 0.01, 0]}>
        <boxGeometry args={[size[0] + 0.02, 0.02, size[2] + 0.02]} />
        <meshStandardMaterial color={COUNTER_TOP} />
      </mesh>
    </group>
  );
}

function DoubleBed({
  pos,
  rotation = 0,
}: {
  pos: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={pos} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[1.3, 0.06, 1.5]} />
        <meshStandardMaterial color={WOOD_MED} />
      </mesh>
      <mesh position={[0, 0.09, 0.02]}>
        <boxGeometry args={[1.24, 0.05, 1.42]} />
        <meshStandardMaterial color={BED_SHEET} />
      </mesh>
      <mesh position={[0, 0.17, -0.72]}>
        <boxGeometry args={[1.3, 0.2, 0.06]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
      <mesh position={[-0.3, 0.13, -0.55]}>
        <boxGeometry args={[0.42, 0.04, 0.2]} />
        <meshStandardMaterial color={PILLOW_COLOR} />
      </mesh>
      <mesh position={[0.3, 0.13, -0.55]}>
        <boxGeometry args={[0.42, 0.04, 0.2]} />
        <meshStandardMaterial color={PILLOW_COLOR} />
      </mesh>
      <mesh position={[0, 0.125, 0.25]}>
        <boxGeometry args={[1.2, 0.025, 0.8]} />
        <meshStandardMaterial color={BLANKET_BLUE} />
      </mesh>
    </group>
  );
}

function SingleBed({
  pos,
  rotation = 0,
}: {
  pos: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={pos} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.7, 0.06, 1.1]} />
        <meshStandardMaterial color={WOOD_MED} />
      </mesh>
      <mesh position={[0, 0.08, 0.02]}>
        <boxGeometry args={[0.64, 0.04, 1.02]} />
        <meshStandardMaterial color={BED_SHEET} />
      </mesh>
      <mesh position={[0, 0.15, -0.52]}>
        <boxGeometry args={[0.7, 0.16, 0.06]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
      <mesh position={[0, 0.11, -0.38]}>
        <boxGeometry args={[0.38, 0.035, 0.16]} />
        <meshStandardMaterial color={PILLOW_COLOR} />
      </mesh>
      <mesh position={[0, 0.105, 0.15]}>
        <boxGeometry args={[0.62, 0.025, 0.55]} />
        <meshStandardMaterial color={BLANKET_GREEN} />
      </mesh>
    </group>
  );
}

function Nightstand({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.22, 0.12, 0.22]} />
        <meshStandardMaterial color={WOOD_MED} />
      </mesh>
      <mesh position={[0, 0.06, 0.111]}>
        <boxGeometry args={[0.16, 0.04, 0.002]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
    </group>
  );
}

function Wardrobe({
  pos,
  size = [1.3, 0.35, 0.35],
}: {
  pos: [number, number, number];
  size?: [number, number, number];
}) {
  return (
    <group position={pos}>
      <mesh position={[0, size[1] / 2, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={WOOD_MED} />
      </mesh>
      <mesh position={[0, size[1] / 2, size[2] / 2 + 0.001]}>
        <boxGeometry args={[0.003, size[1] - 0.04, 0.002]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
    </group>
  );
}

function Desk({
  pos,
  rotation = 0,
}: {
  pos: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={pos} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.6, 0.025, 0.3]} />
        <meshStandardMaterial color={WOOD_MED} />
      </mesh>
      <mesh position={[-0.27, 0.055, 0]}>
        <boxGeometry args={[0.025, 0.1, 0.28]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
      <mesh position={[0.27, 0.055, 0]}>
        <boxGeometry args={[0.025, 0.1, 0.28]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
    </group>
  );
}

function DeskChair({
  pos,
  rotation = 0,
}: {
  pos: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={pos} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.16, 0.015, 0.16]} />
        <meshStandardMaterial color="#4a5a6a" />
      </mesh>
      <mesh position={[0, 0.13, -0.07]}>
        <boxGeometry args={[0.14, 0.09, 0.015]} />
        <meshStandardMaterial color="#4a5a6a" />
      </mesh>
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.015, 8]} />
        <meshStandardMaterial color={METAL} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.05, 6]} />
        <meshStandardMaterial color={METAL} />
      </mesh>
    </group>
  );
}

function Toilet({
  pos,
  rotation = 0,
}: {
  pos: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={pos} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.05, 0.03]}>
        <boxGeometry args={[0.18, 0.1, 0.22]} />
        <meshStandardMaterial color={CERAMIC} />
      </mesh>
      <mesh position={[0, 0.1, -0.09]}>
        <boxGeometry args={[0.16, 0.12, 0.06]} />
        <meshStandardMaterial color={CERAMIC} />
      </mesh>
      <mesh position={[0, 0.105, 0.03]}>
        <boxGeometry args={[0.16, 0.008, 0.18]} />
        <meshStandardMaterial color="#f5f0eb" />
      </mesh>
    </group>
  );
}

function Bathtub({
  pos,
  rotation = 0,
}: {
  pos: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={pos} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.4, 0.12, 0.65]} />
        <meshStandardMaterial color={CERAMIC} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.32, 0.06, 0.57]} />
        <meshStandardMaterial color={WATER} />
      </mesh>
    </group>
  );
}

function Vanity({
  pos,
  size = [0.45, 0.14, 0.22],
  rotation = 0,
}: {
  pos: [number, number, number];
  size?: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={pos} rotation={[0, rotation, 0]}>
      <mesh position={[0, size[1] / 2, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={COUNTER_BODY} />
      </mesh>
      <mesh position={[0, size[1] + 0.008, 0]}>
        <boxGeometry args={[size[0] + 0.02, 0.015, size[2] + 0.02]} />
        <meshStandardMaterial color={COUNTER_TOP} />
      </mesh>
      <mesh position={[0, size[1] + 0.012, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.008, 16]} />
        <meshStandardMaterial color={WATER} />
      </mesh>
    </group>
  );
}

function ShowerStall({
  pos,
  size = [0.5, 0.35, 0.5],
  rotation = 0,
}: {
  pos: [number, number, number];
  size?: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={pos} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[size[0], 0.02, size[2]]} />
        <meshStandardMaterial color={CERAMIC} />
      </mesh>
      <mesh position={[size[0] / 2, size[1] / 2, 0]}>
        <boxGeometry args={[0.01, size[1], size[2]]} />
        <meshStandardMaterial color="#a8d4e4" transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, size[1] / 2, size[2] / 2]}>
        <boxGeometry args={[size[0], size[1], 0.01]} />
        <meshStandardMaterial color="#a8d4e4" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

// ── Room click zones ──

function RoomClickZone({
  room,
  onClick,
  isOverview,
}: {
  room: RoomDef;
  onClick: () => void;
  isOverview: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  return (
    <mesh
      ref={meshRef}
      position={room.floorCenter}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={(e) => {
        if (!isOverview) return;
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => {
        if (isOverview) document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
      visible={false}
    >
      <planeGeometry args={[room.floorSize[0], room.floorSize[1]]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

// ── Room interior details (lights + ceiling) ──

function RoomInterior({
  room,
  active,
}: {
  room: RoomDef;
  active: boolean;
}) {
  const ceilY = WH + FLOOR_Y;
  const cx = room.floorCenter[0];
  const cz = room.floorCenter[2];

  return (
    <group visible={active}>
      <pointLight
        position={[cx, ceilY - 0.05, cz]}
        intensity={active ? 0.6 : 0}
        color="#fff5e6"
        distance={3}
      />
      {/* Ceiling */}
      <mesh position={[cx, ceilY, cz]}>
        <planeGeometry args={[room.floorSize[0], room.floorSize[1]]} />
        <meshStandardMaterial color="#f5f0eb" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ── Camera controller ──

type ViewMode = "overview" | "transitioning" | "room";

function CameraController({
  viewMode,
  targetRoom,
  onTransitionComplete,
  controlsRef,
}: {
  viewMode: ViewMode;
  targetRoom: RoomDef | null;
  onTransitionComplete: () => void;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();
  const targetPos = useRef(OVERVIEW_POS.clone());
  const targetLook = useRef(OVERVIEW_LOOKAT.clone());
  const currentLook = useRef(OVERVIEW_LOOKAT.clone());
  const waypointPos = useRef<THREE.Vector3 | null>(null);
  const waypointReached = useRef(false);
  const transitionSpeed = useRef(2.0);

  const setTarget = useCallback(
    (pos: THREE.Vector3, look: THREE.Vector3, waypoint?: THREE.Vector3) => {
      if (waypoint) {
        waypointPos.current = waypoint;
        waypointReached.current = false;
        targetPos.current.copy(waypoint);
        targetLook.current.copy(
          new THREE.Vector3().lerpVectors(currentLook.current, look, 0.3)
        );
      } else {
        waypointPos.current = null;
        waypointReached.current = true;
        targetPos.current.copy(pos);
        targetLook.current.copy(look);
      }
      // Store final destination
      (targetPos.current as THREE.Vector3 & { _finalPos?: THREE.Vector3 })._finalPos =
        pos;
      (targetLook.current as THREE.Vector3 & { _finalLook?: THREE.Vector3 })._finalLook =
        look;
    },
    []
  );

  // React to viewMode/targetRoom changes
  useMemo(() => {
    if (viewMode === "transitioning" && targetRoom) {
      const roomPos = new THREE.Vector3(...targetRoom.cameraPos);
      const roomLook = new THREE.Vector3(...targetRoom.lookAt);
      const waypoint = new THREE.Vector3(
        targetRoom.floorCenter[0],
        1.5,
        targetRoom.floorCenter[2]
      );
      transitionSpeed.current = 2.5;
      setTarget(roomPos, roomLook, waypoint);
    } else if (viewMode === "transitioning" && !targetRoom) {
      transitionSpeed.current = 2.0;
      setTarget(OVERVIEW_POS, OVERVIEW_LOOKAT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, targetRoom]);

  useFrame((_, delta) => {
    const speed = transitionSpeed.current;
    const lerpFactor = 1 - Math.pow(0.001, delta * speed);

    if (viewMode === "overview") {
      // OrbitControls handles camera in overview — sync lookAt ref
      if (controlsRef.current) {
        controlsRef.current.target.lerp(OVERVIEW_LOOKAT, 0.05);
        currentLook.current.copy(controlsRef.current.target);
        controlsRef.current.enabled = true;
      }
      return;
    }

    // Disable orbit controls during transitions
    if (viewMode === "transitioning" && controlsRef.current) {
      controlsRef.current.enabled = false;
    }

    // Check if waypoint needs handling
    if (waypointPos.current && !waypointReached.current) {
      camera.position.lerp(waypointPos.current, lerpFactor);
      currentLook.current.lerp(targetLook.current, lerpFactor);
      camera.lookAt(currentLook.current);

      if (camera.position.distanceTo(waypointPos.current) < 0.15) {
        waypointReached.current = true;
        const finalPos = (
          targetPos.current as THREE.Vector3 & { _finalPos?: THREE.Vector3 }
        )._finalPos;
        const finalLook = (
          targetLook.current as THREE.Vector3 & { _finalLook?: THREE.Vector3 }
        )._finalLook;
        if (finalPos) targetPos.current.copy(finalPos);
        if (finalLook) targetLook.current.copy(finalLook);
      }
      return;
    }

    // Lerp to final target
    camera.position.lerp(targetPos.current, lerpFactor);
    currentLook.current.lerp(targetLook.current, lerpFactor);
    camera.lookAt(currentLook.current);

    if (
      viewMode === "transitioning" &&
      camera.position.distanceTo(targetPos.current) < 0.05
    ) {
      // Hand off to OrbitControls for room view
      if (controlsRef.current && targetRoom) {
        controlsRef.current.target.copy(targetLook.current);
        controlsRef.current.enabled = true;
      }
      onTransitionComplete();
    }

    // In room mode OrbitControls handles interaction
    if (viewMode === "room") {
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }
    }
  });

  return null;
}

// ── Condo Floor Plan (same layout as FloatingHouse) ──

function CondoFloorPlan({
  onRoomClick,
  isOverview,
  activeRoomId,
}: {
  onRoomClick: (roomId: string) => void;
  isOverview: boolean;
  activeRoomId: string | null;
}) {
  return (
    <group position={[0, FLOOR_Y, 0]}>
      {/* ── Room Floors ── */}
      <Floor pos={[-1, FH / 2, -1]} size={[3, FH, 2]} color={FL_LIVING} />
      <Floor pos={[1.5, FH / 2, -1]} size={[2, FH, 2]} color={FL_KITCHEN} />
      <Floor pos={[-1.5, FH / 2, 1]} size={[2, FH, 2]} color={FL_MASTER} />
      <Floor
        pos={[0.25, FH / 2, 0.55]}
        size={[1.5, FH, 1.1]}
        color={FL_HALL}
      />
      <Floor pos={[1.5, FH / 2, 0.65]} size={[1, FH, 1.3]} color={FL_BED2} />
      <Floor
        pos={[2.25, FH / 2, 0.65]}
        size={[0.5, FH, 1.3]}
        color={FL_BATH}
      />
      <Floor
        pos={[0.25, FH / 2, 1.6]}
        size={[1.5, FH, 0.8]}
        color={FL_BATH}
      />
      <Floor
        pos={[1.75, FH / 2, 1.6]}
        size={[1.5, FH, 0.8]}
        color={FL_BATH}
      />

      {/* ── Outer Walls ── */}
      <SolidWall pos={[0, WH / 2, -2]} size={[5, WH, W]} />
      <SolidWall pos={[0, WH / 2, 2]} size={[5, WH, W]} />
      <SolidWall pos={[-2.5, WH / 2, 0]} size={[W, WH, 4]} />
      <SolidWall pos={[2.5, WH / 2, 0]} size={[W, WH, 4]} />

      {/* ── Interior Walls ── */}
      <SolidWall pos={[0.5, WH / 2, -1.5]} size={[W, WH, 1]} />
      <SolidWall pos={[-2, WH / 2, 0]} size={[1, WH, W]} />
      <SolidWall pos={[0.5, WH / 2, 0]} size={[2, WH, W]} />
      <SolidWall pos={[2.25, WH / 2, 0]} size={[0.5, WH, W]} />
      <SolidWall pos={[-0.5, WH / 2, 1]} size={[W, WH, 2]} />
      <SolidWall pos={[1, WH / 2, 0.65]} size={[W, WH, 1.3]} />
      <SolidWall pos={[2, WH / 2, 0.65]} size={[W, WH, 1.3]} />
      <SolidWall pos={[1, WH / 2, 1.3]} size={[3, WH, W]} />

      {/* ── Living Room ── */}
      <Sofa pos={[-1.5, 0, -0.4]} rotation={Math.PI} />
      <CoffeeTable pos={[-1.5, 0, -0.95]} />
      <TVUnit pos={[-1.5, 0, -1.75]} />
      <DiningTable pos={[0, 0, -0.8]} />
      <Chair pos={[0, 0, -0.45]} rotation={Math.PI} />
      <Chair pos={[0, 0, -1.15]} />
      <Chair pos={[-0.35, 0, -0.8]} rotation={Math.PI / 2} />
      <Chair pos={[0.35, 0, -0.8]} rotation={-Math.PI / 2} />

      {/* ── Kitchen ── */}
      <KitchenCounter pos={[1.5, 0, -1.82]} size={[1.8, 0.22, 0.3]} />
      <KitchenCounter pos={[2.32, 0, -0.8]} size={[0.3, 0.22, 1.4]} />
      <KitchenCounter pos={[1.3, 0, -0.8]} size={[0.8, 0.16, 0.35]} />

      {/* ── Master Bedroom ── */}
      <DoubleBed pos={[-1.5, 0, 0.85]} />
      <Nightstand pos={[-2.2, 0, 0.25]} />
      <Nightstand pos={[-0.8, 0, 0.25]} />
      <Wardrobe pos={[-1.5, 0, 1.82]} />

      {/* ── Bedroom 2 ── */}
      <SingleBed pos={[1.5, 0, 0.5]} />
      <Desk pos={[1.65, 0, 1.1]} rotation={Math.PI / 2} />
      <DeskChair pos={[1.35, 0, 1.1]} rotation={-Math.PI / 2} />

      {/* ── Main Bathroom ── */}
      <Vanity pos={[2.3, 0, 0.2]} size={[0.3, 0.14, 0.25]} />
      <Toilet pos={[2.3, 0, 0.85]} rotation={-Math.PI / 2} />

      {/* ── Master Bath ── */}
      <Vanity pos={[0.5, 0, 1.85]} size={[0.4, 0.14, 0.2]} />
      <Bathtub pos={[-0.15, 0, 1.6]} />
      <Toilet pos={[0.85, 0, 1.45]} />

      {/* ── Second Bath ── */}
      <ShowerStall pos={[2.0, 0, 1.65]} size={[0.6, 0.35, 0.5]} />

      {/* ── Room Labels (visible in overview) ── */}
      {isOverview && (
        <>
          <RoomLabel pos={[-1.5, 0.52, -1.5]} label="Living Room" />
          <RoomLabel pos={[1.5, 0.52, -1.5]} label="Kitchen" />
          <RoomLabel pos={[-1.5, 0.52, 1.2]} label="Master Bed" />
          <RoomLabel pos={[1.5, 0.52, 0.3]} label="Bedroom 2" size={0.12} />
          <RoomLabel pos={[2.25, 0.52, 0.65]} label="Bath" size={0.09} />
          <RoomLabel pos={[0.25, 0.52, 0.4]} label="Hall" size={0.12} />
          <RoomLabel pos={[0.25, 0.52, 1.6]} label="M. Bath" size={0.1} />
        </>
      )}

      {/* ── Click zones ── */}
      {ROOMS.map((room) => (
        <RoomClickZone
          key={room.id}
          room={room}
          isOverview={isOverview}
          onClick={() => onRoomClick(room.id)}
        />
      ))}

      {/* ── Room interiors (ceilings + lights) ── */}
      {ROOMS.map((room) => (
        <RoomInterior
          key={`interior-${room.id}`}
          room={room}
          active={activeRoomId === room.id}
        />
      ))}
    </group>
  );
}

// ── Ambient particles ──

function FloatingParticles({ count = 20 }: { count?: number }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.025}
        color="#b8a890"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// ── Main export ──

export default function ShowcaseScene({
  viewMode,
  activeRoomId,
  onRoomClick,
  onTransitionComplete,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  activeRoomId: string | null;
  onRoomClick: (roomId: string) => void;
  onTransitionComplete: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const targetRoom = activeRoomId
    ? ROOMS.find((r) => r.id === activeRoomId) ?? null
    : null;

  return (
    <Canvas
      camera={{ position: [0, 6, 6], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 3]} intensity={0.8} />
      <directionalLight position={[-3, 5, -2]} intensity={0.3} />

      <OrbitControls
        ref={controlsRef}
        autoRotate={viewMode === "overview"}
        autoRotateSpeed={0.8}
        enablePan={viewMode === "room"}
        enabled={viewMode !== "transitioning"}
        minDistance={viewMode === "room" ? 0.3 : 4}
        maxDistance={viewMode === "room" ? 2.0 : 12}
        minPolarAngle={viewMode === "room" ? 0.1 : 0.3}
        maxPolarAngle={viewMode === "room" ? Math.PI - 0.1 : Math.PI / 2.2}
        enableZoom={viewMode === "room"}
        panSpeed={0.5}
        rotateSpeed={0.5}
        target={[0, -0.3, 0]}
      />

      <CameraController
        viewMode={viewMode}
        targetRoom={targetRoom}
        onTransitionComplete={onTransitionComplete}
        controlsRef={controlsRef}
      />

      <CondoFloorPlan
        onRoomClick={onRoomClick}
        isOverview={viewMode === "overview"}
        activeRoomId={activeRoomId}
      />

      <FloatingParticles />
    </Canvas>
  );
}
