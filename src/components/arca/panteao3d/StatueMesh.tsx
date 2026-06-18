import type { ThreeEvent } from "@react-three/fiber";
import { useState } from "react";
import { Vector2 } from "three";

// Perfil do manto (raio, altura) — revolvido em torno do eixo Y dá um corpo
// togado com volume real.
const ROBE_PROFILE = [
  new Vector2(0.17, 2.55),
  new Vector2(0.36, 2.36),
  new Vector2(0.42, 2.0),
  new Vector2(0.44, 1.4),
  new Vector2(0.48, 0.8),
  new Vector2(0.58, 0.28),
  new Vector2(0.66, 0.04),
  new Vector2(0.68, 0),
];

export function StatueMesh({ onSelect }: { onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);

  const enter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const leave = () => {
    setHovered(false);
    document.body.style.cursor = "auto";
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <group onClick={click} onPointerOut={leave} onPointerOver={enter}>
      {/* Manto */}
      <mesh castShadow>
        <latheGeometry args={[ROBE_PROFILE, 48]} />
        <meshStandardMaterial
          color="#ece4d2"
          emissive="#d8b15a"
          emissiveIntensity={hovered ? 0.18 : 0}
          roughness={0.55}
        />
      </mesh>
      {/* Ombros / cabeçal do manto */}
      <mesh castShadow position={[0, 2.42, 0]} scale={[1, 0.5, 0.78]}>
        <sphereGeometry args={[0.46, 28, 24]} />
        <meshStandardMaterial color="#e7dfce" roughness={0.56} />
      </mesh>
      {/* Pescoço */}
      <mesh position={[0, 2.62, 0]}>
        <cylinderGeometry args={[0.13, 0.16, 0.22, 20]} />
        <meshStandardMaterial color="#efe8d8" roughness={0.5} />
      </mesh>
      {/* Cabeça */}
      <mesh castShadow position={[0, 2.92, 0]} scale={[1, 1.15, 0.95]}>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshStandardMaterial color="#efe8d8" roughness={0.5} />
      </mesh>
      {/* Coroa de louros */}
      <mesh position={[0, 3.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.04, 14, 36]} />
        <meshStandardMaterial
          color="#cdbf8e"
          metalness={0.35}
          roughness={0.42}
        />
      </mesh>
      {/* Livro */}
      <mesh
        castShadow
        position={[0.2, 1.55, 0.46]}
        rotation={[0.35, -0.25, 0.12]}
      >
        <boxGeometry args={[0.46, 0.34, 0.08]} />
        <meshStandardMaterial color="#e3dccb" roughness={0.62} />
      </mesh>
    </group>
  );
}
