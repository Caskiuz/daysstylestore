"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows } from "@react-three/drei";
import type { Mesh, Group } from "three";

const GOLD = "#d4af37";
const GOLD_LIGHT = "#f0dfa0";
const GOLD_DEEP = "#8a6d1d";

function TorusJewel() {
  const ref = useRef<Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.18;
    ref.current.rotation.y += delta * 0.24;
    // sutil seguimiento del mouse
    const { x, y } = state.pointer;
    ref.current.position.x += (x * 0.35 - ref.current.position.x) * 0.04;
    ref.current.position.y += (y * 0.25 - ref.current.position.y) * 0.04;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.1}>
      <mesh ref={ref} castShadow>
        <torusKnotGeometry args={[1.05, 0.34, 220, 36]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.16} envMapIntensity={1} />
      </mesh>
    </Float>
  );
}

function OrbitingGems() {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.35;
  });
  const gems = [
    { pos: [2.3, 0.4, 0.6] as const, size: 0.22, color: GOLD_LIGHT },
    { pos: [-2.1, -0.6, 0.9] as const, size: 0.17, color: GOLD },
    { pos: [1.6, -1.15, -0.7] as const, size: 0.13, color: GOLD_DEEP },
    { pos: [-1.7, 1.05, -0.5] as const, size: 0.15, color: GOLD_LIGHT },
    { pos: [0.4, 1.6, 0.9] as const, size: 0.11, color: GOLD },
    { pos: [-0.5, -1.7, 0.4] as const, size: 0.12, color: GOLD_LIGHT },
  ];
  return (
    <group ref={group}>
      {gems.map((g, i) => (
        <Float key={i} speed={2.2 + i * 0.3} floatIntensity={2} rotationIntensity={1.4}>
          <mesh position={g.pos as unknown as [number, number, number]} castShadow>
            <icosahedronGeometry args={[g.size, 0]} />
            <meshStandardMaterial color={g.color} metalness={1} roughness={0.12} flatShading />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 4]} intensity={1.6} color="#fff3cf" castShadow />
      <pointLight position={[-5, -2, 3]} intensity={22} color={GOLD} distance={12} />
      <pointLight position={[5, -3, -2]} intensity={14} color={GOLD_LIGHT} distance={10} />

      <TorusJewel />
      <OrbitingGems />

      <Sparkles count={90} scale={[7, 5, 3]} size={2.6} speed={0.35} color={GOLD_LIGHT} opacity={0.7} />
      <Sparkles count={40} scale={[9, 6, 4]} size={1.4} speed={0.2} color="#ffffff" opacity={0.4} />

      <ContactShadows position={[0, -2.4, 0]} opacity={0.38} scale={10} blur={2.6} far={4} color="#8a6d1d" />
    </Canvas>
  );
}
