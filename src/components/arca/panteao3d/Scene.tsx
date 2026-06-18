import { MeshReflectorMaterial, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { StatueMesh } from "./StatueMesh";
import { StatueModel } from "./StatueModel";

const COLUMNS: [number, number, number][] = [
  [-3.6, 2.4, -2.2],
  [3.6, 2.4, -2.2],
  [-4.2, 2.4, 1.4],
  [4.2, 2.4, 1.4],
];

type SceneProps = { onSelect: () => void; modelUrl?: string | null };

export default function Scene({ onSelect, modelUrl }: SceneProps) {
  // Câmara responsiva: em ecrãs verticais (mobile) recua para a figura caber.
  const portrait =
    typeof window !== "undefined" && window.innerHeight > window.innerWidth;
  const camZ = portrait ? 10.5 : 7.4;
  const fov = portrait ? 42 : 38;

  return (
    <Canvas camera={{ position: [0, 1.7, camZ], fov }} dpr={[1, 2]} shadows>
      <color args={["#070f1c"]} attach="background" />
      <fog args={["#070f1c", 7, 19]} attach="fog" />

      <hemisphereLight
        args={["#dce8ff", "#1a2740", 1.1]}
        position={[0, 6, 0]}
      />
      <ambientLight intensity={0.7} />
      <spotLight
        angle={0.6}
        castShadow
        color="#fff1da"
        decay={0}
        intensity={3}
        penumbra={0.9}
        position={[0, 7.5, 4]}
        shadow-mapSize={[1024, 1024]}
      />
      {/* Preenchimento frontal para a estátua não ficar escura */}
      <directionalLight color="#ffffff" intensity={1.1} position={[0, 3, 6]} />
      <directionalLight
        color="#5d79ff"
        intensity={0.6}
        position={[-5, 4, -4]}
      />

      {/* Chão de mármore reflexivo (PBR) */}
      <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          blur={[300, 90]}
          color="#0b1828"
          depthScale={1.1}
          maxDepthThreshold={1.2}
          metalness={0.6}
          minDepthThreshold={0.4}
          mixBlur={1}
          mixStrength={42}
          resolution={512}
          roughness={0.85}
        />
      </mesh>

      {/* Pedestal — só para a estátua estilizada (os modelos trazem base própria) */}
      {!modelUrl && (
        <mesh castShadow position={[0, -0.3, 0]} receiveShadow>
          <cylinderGeometry args={[1, 1.16, 0.6, 48]} />
          <meshStandardMaterial color="#cabfa6" roughness={0.6} />
        </mesh>
      )}

      {/* Colunas */}
      {COLUMNS.map(([x, y, z]) => (
        <mesh castShadow key={`${x}:${z}`} position={[x, y, z]}>
          <cylinderGeometry args={[0.4, 0.42, 7.2, 24]} />
          <meshStandardMaterial color="#5f5848" roughness={0.8} />
        </mesh>
      ))}

      {modelUrl ? (
        <Suspense fallback={<StatueMesh onSelect={onSelect} />}>
          <StatueModel onSelect={onSelect} url={modelUrl} />
        </Suspense>
      ) : (
        <StatueMesh onSelect={onSelect} />
      )}

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.35}
        enableDamping
        enablePan={false}
        makeDefault
        maxDistance={12}
        maxPolarAngle={1.52}
        minDistance={4.5}
        minPolarAngle={1.05}
        target={[0, 1.55, 0]}
      />
    </Canvas>
  );
}
