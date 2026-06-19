import type { ColorRepresentation } from "three";

const STONE = "#2c3a52";

/**
 * Coluna clássica: plinto + base + fuste (com leve éntase) + colarinho +
 * capitel. Dá carácter arquitetónico à sala sem geometria pesada.
 */
export function Column({
  position,
  height = 7.2,
  color = STONE,
}: {
  position: [number, number, number];
  height?: number;
  color?: ColorRepresentation;
}) {
  const shaftH = height - 1.1;
  const [x, baseY, z] = position;

  return (
    <group position={[x, baseY, z]}>
      {/* Plinto + base */}
      <mesh castShadow position={[0, 0.18, 0]} receiveShadow>
        <boxGeometry args={[1.15, 0.36, 1.15]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.52, 0.6, 0.34, 24]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Fuste com leve éntase (mais fino no topo) */}
      <mesh castShadow position={[0, 0.7 + shaftH / 2, 0]}>
        <cylinderGeometry args={[0.4, 0.48, shaftH, 28, 1]} />
        <meshStandardMaterial color={color} roughness={0.78} />
      </mesh>
      {/* Colarinho */}
      <mesh position={[0, 0.7 + shaftH + 0.04, 0]}>
        <cylinderGeometry args={[0.42, 0.4, 0.12, 24]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      {/* Capitel (equino + ábaco) */}
      <mesh castShadow position={[0, 0.7 + shaftH + 0.24, 0]}>
        <cylinderGeometry args={[0.62, 0.42, 0.3, 24]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      <mesh castShadow position={[0, 0.7 + shaftH + 0.48, 0]}>
        <boxGeometry args={[1.3, 0.22, 1.3]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}
