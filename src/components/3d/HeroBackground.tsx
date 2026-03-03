"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

// ── Layout constants ──
const W = 0.06;
const WH = 0.5;
const FH = 0.02;

// ── Muted wireframe colors (subtle ghost style) ──
const WALL_EDGE = "#4a4a6a";
const FLOOR_EDGE = "#3a3a5a";
const FURNITURE_EDGE = "#3b3b5b";
const ACCENT = "#6366f1";

// ── Base components (wireframe style for subtlety) ──

function GhostWall({
  pos,
  size,
}: {
  pos: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={pos}>
      <boxGeometry args={size} />
      <meshBasicMaterial transparent opacity={0} />
      <Edges color={WALL_EDGE} />
    </mesh>
  );
}

function GhostFloor({
  pos,
  size,
}: {
  pos: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={pos}>
      <boxGeometry args={size} />
      <meshBasicMaterial color={FLOOR_EDGE} transparent opacity={0.04} />
      <Edges color={FLOOR_EDGE} />
    </mesh>
  );
}

function GhostBox({
  pos,
  size,
  color = FURNITURE_EDGE,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  color?: string;
}) {
  return (
    <mesh position={pos}>
      <boxGeometry args={size} />
      <meshBasicMaterial transparent opacity={0} />
      <Edges color={color} />
    </mesh>
  );
}

// ── Simplified floor plan (wireframe ghost) ──

function GhostFloorPlan() {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Floors */}
      <GhostFloor pos={[-1, FH / 2, -1]} size={[3, FH, 2]} />
      <GhostFloor pos={[1.5, FH / 2, -1]} size={[2, FH, 2]} />
      <GhostFloor pos={[-1.5, FH / 2, 1]} size={[2, FH, 2]} />
      <GhostFloor pos={[0.25, FH / 2, 0.55]} size={[1.5, FH, 1.1]} />
      <GhostFloor pos={[1.5, FH / 2, 0.65]} size={[1, FH, 1.3]} />
      <GhostFloor pos={[2.25, FH / 2, 0.65]} size={[0.5, FH, 1.3]} />
      <GhostFloor pos={[0.25, FH / 2, 1.6]} size={[1.5, FH, 0.8]} />
      <GhostFloor pos={[1.75, FH / 2, 1.6]} size={[1.5, FH, 0.8]} />

      {/* Outer walls */}
      <GhostWall pos={[0, WH / 2, -2]} size={[5, WH, W]} />
      <GhostWall pos={[0, WH / 2, 2]} size={[5, WH, W]} />
      <GhostWall pos={[-2.5, WH / 2, 0]} size={[W, WH, 4]} />
      <GhostWall pos={[2.5, WH / 2, 0]} size={[W, WH, 4]} />

      {/* Interior walls */}
      <GhostWall pos={[0.5, WH / 2, -1.5]} size={[W, WH, 1]} />
      <GhostWall pos={[-2, WH / 2, 0]} size={[1, WH, W]} />
      <GhostWall pos={[0.5, WH / 2, 0]} size={[2, WH, W]} />
      <GhostWall pos={[2.25, WH / 2, 0]} size={[0.5, WH, W]} />
      <GhostWall pos={[-0.5, WH / 2, 1]} size={[W, WH, 2]} />
      <GhostWall pos={[1, WH / 2, 0.65]} size={[W, WH, 1.3]} />
      <GhostWall pos={[2, WH / 2, 0.65]} size={[W, WH, 1.3]} />
      <GhostWall pos={[1, WH / 2, 1.3]} size={[3, WH, W]} />

      {/* Simplified furniture outlines */}
      {/* Living */}
      <GhostBox pos={[-1.5, 0.08, -0.4]} size={[1.2, 0.14, 0.5]} color={ACCENT} />
      <GhostBox pos={[-1.5, 0.06, -0.95]} size={[0.6, 0.06, 0.35]} />
      <GhostBox pos={[-1.5, 0.08, -1.75]} size={[1.2, 0.1, 0.25]} />
      <GhostBox pos={[0, 0.1, -0.8]} size={[0.55, 0.06, 0.55]} />

      {/* Kitchen */}
      <GhostBox pos={[1.5, 0.12, -1.82]} size={[1.8, 0.22, 0.3]} />
      <GhostBox pos={[2.32, 0.12, -0.8]} size={[0.3, 0.22, 1.4]} />
      <GhostBox pos={[1.3, 0.09, -0.8]} size={[0.8, 0.16, 0.35]} />

      {/* Master bedroom */}
      <GhostBox pos={[-1.5, 0.08, 0.85]} size={[1.3, 0.14, 1.5]} color={ACCENT} />
      <GhostBox pos={[-2.2, 0.06, 0.25]} size={[0.22, 0.12, 0.22]} />
      <GhostBox pos={[-0.8, 0.06, 0.25]} size={[0.22, 0.12, 0.22]} />
      <GhostBox pos={[-1.5, 0.16, 1.82]} size={[1.3, 0.3, 0.35]} />

      {/* Bedroom 2 */}
      <GhostBox pos={[1.5, 0.06, 0.5]} size={[0.7, 0.1, 1.1]} />
      <GhostBox pos={[1.65, 0.06, 1.1]} size={[0.3, 0.1, 0.6]} />

      {/* Bathroom fixtures */}
      <GhostBox pos={[2.3, 0.06, 0.2]} size={[0.3, 0.12, 0.25]} />
      <GhostBox pos={[2.3, 0.06, 0.85]} size={[0.18, 0.1, 0.22]} />
      <GhostBox pos={[-0.15, 0.06, 1.6]} size={[0.4, 0.12, 0.65]} />

    </group>
  );
}

// ── Mouse parallax + auto-rotate ──

function SceneController({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ pointer, clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    // Slow auto-rotation
    const autoY = t * 0.08;

    // Subtle mouse influence
    const mouseX = pointer.x * 0.15;
    const mouseY = pointer.y * 0.08;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      autoY + mouseX,
      0.03
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouseY,
      0.03
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

// ── Floating particles ──

function GhostParticles({ count = 30 }: { count?: number }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.025}
        color="#6366f1"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}

// ── Main export ──

export default function HeroBackground() {
  return (
    <Canvas
      camera={{ position: [4, 5.5, 5.5], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <SceneController>
        <GhostFloorPlan />
      </SceneController>

      <GhostParticles />
    </Canvas>
  );
}
