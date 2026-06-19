import { MeshReflectorMaterial, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { StatueMesh } from "./StatueMesh";
import { StatueModel } from "./StatueModel";

const COLUMNS: [number, number, number][] = [
  [-3.6, 2.4, -2.2],
  [3.6, 2.4, -2.2],
  [-4.2, 2.4, 1.4],
  [4.2, 2.4, 1.4],
];

const TARGET_Y = 1.55;

/** Entrada cinematográfica: a câmara avança do fundo da sala até à estátua. */
function IntroDolly({
  restY,
  restZ,
  startY,
  startZ,
  onDone,
}: {
  restY: number;
  restZ: number;
  startY: number;
  startZ: number;
  onDone: () => void;
}) {
  const progress = useRef(0);
  const done = useRef(false);

  useFrame((state, delta) => {
    if (done.current) {
      return;
    }
    progress.current = Math.min(1, progress.current + delta / 2.6);
    const e = 1 - (1 - progress.current) ** 3; // easeOutCubic
    const cam = state.camera;
    cam.position.set(
      0,
      startY + (restY - startY) * e,
      startZ + (restZ - startZ) * e
    );
    cam.lookAt(0, TARGET_Y, 0);
    if (progress.current >= 1) {
      done.current = true;
      onDone();
    }
  });

  return null;
}

type SceneProps = { onSelect: () => void; modelUrl?: string | null };

export default function Scene({ onSelect, modelUrl }: SceneProps) {
  // Câmara responsiva: em ecrãs verticais (mobile) recua para a figura caber.
  const portrait =
    typeof window !== "undefined" && window.innerHeight > window.innerWidth;
  const restZ = portrait ? 10.5 : 7.4;
  const fov = portrait ? 42 : 38;
  const startZ = restZ + 4;
  const startY = 0.85;

  const [ready, setReady] = useState(false);

  return (
    <Canvas
      camera={{ position: [0, startY, startZ], fov }}
      dpr={[1, 2]}
      shadows
    >
      <color args={["#070f1c"]} attach="background" />
      <fog args={["#070f1c", 8, 22]} attach="fog" />

      <hemisphereLight
        args={["#dce8ff", "#16223a", 0.9]}
        position={[0, 6, 0]}
      />
      <ambientLight intensity={0.55} />
      {/* Luz-chave quente, de cima */}
      <spotLight
        angle={0.55}
        castShadow
        color="#fff1da"
        decay={0}
        intensity={3.2}
        penumbra={0.95}
        position={[0, 8, 4]}
        shadow-mapSize={[1024, 1024]}
      />
      {/* Preenchimento frontal */}
      <directionalLight color="#ffffff" intensity={0.9} position={[0, 3, 6]} />
      {/* Contraluz fria atrás da estátua, para a destacar do fundo */}
      <directionalLight color="#7da0ff" intensity={1.4} position={[0, 5, -6]} />
      <directionalLight
        color="#3f5da8"
        intensity={0.5}
        position={[-5, 4, -4]}
      />

      {/* Chão de mármore reflexivo (PBR) */}
      <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          blur={[320, 100]}
          color="#0b1828"
          depthScale={1.1}
          maxDepthThreshold={1.2}
          metalness={0.6}
          minDepthThreshold={0.4}
          mixBlur={1}
          mixStrength={48}
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
        <Suspense fallback={null}>
          <StatueModel onSelect={onSelect} url={modelUrl} />
        </Suspense>
      ) : (
        <StatueMesh onSelect={onSelect} />
      )}

      {!ready && (
        <IntroDolly
          onDone={() => setReady(true)}
          restY={1.7}
          restZ={restZ}
          startY={startY}
          startZ={startZ}
        />
      )}
      <OrbitControls
        autoRotate={ready}
        autoRotateSpeed={0.3}
        enableDamping
        enabled={ready}
        enablePan={false}
        makeDefault
        maxDistance={12}
        maxPolarAngle={1.52}
        minDistance={4.5}
        minPolarAngle={1.05}
        target={[0, TARGET_Y, 0]}
      />
    </Canvas>
  );
}
