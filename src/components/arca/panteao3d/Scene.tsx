import { MeshReflectorMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { type RefObject, Suspense, useRef } from "react";
import { Vector3 } from "three";
import { Column } from "./Column";
import { Dust } from "./Dust";
import { SPACING, xAt } from "./layout";
import { StatueModel } from "./StatueModel";

/** Câmara guiada: percorre a galeria (pan do utilizador) e foca a selecionada. */
function CameraRig({
  selected,
  count,
  portrait,
  panRef,
}: {
  selected: number | null;
  count: number;
  portrait: boolean;
  panRef: RefObject<number>;
}) {
  const look = useRef(new Vector3(0, 1.5, 0));

  useFrame((state, dt) => {
    const lookAt = look.current;
    let tx: number;
    let ty: number;
    let tz: number;
    let lx: number;
    let ly: number;
    let lz: number;

    if (selected === null) {
      const px = panRef.current;
      tx = px;
      ty = 2.2;
      tz = portrait ? 14.5 : 10.5;
      lx = px;
      ly = 1.5;
      lz = 0;
    } else {
      const xs = xAt(selected, count);
      if (portrait) {
        tx = xs;
        ty = 1.75;
        tz = 7.6;
        lx = xs;
        ly = 2.05;
        lz = 0;
      } else {
        tx = xs + 1.7;
        ty = 1.7;
        tz = 5.4;
        lx = xs + 1.7;
        ly = 1.5;
        lz = 0;
      }
    }

    const camera = state.camera;
    const a = 1 - Math.exp(-3.4 * dt);
    camera.position.x += (tx - camera.position.x) * a;
    camera.position.y += (ty - camera.position.y) * a;
    camera.position.z += (tz - camera.position.z) * a;
    lookAt.x += (lx - lookAt.x) * a;
    lookAt.y += (ly - lookAt.y) * a;
    lookAt.z += (lz - lookAt.z) * a;
    camera.lookAt(lookAt);
  });

  return null;
}

type SceneProps = {
  modelUrl: string;
  count: number;
  selected: number | null;
  onSelect: (i: number | null) => void;
  panRef: RefObject<number>;
};

export default function Scene({
  modelUrl,
  count,
  selected,
  onSelect,
  panRef,
}: SceneProps) {
  const portrait =
    typeof window !== "undefined" && window.innerHeight > window.innerWidth;
  const fov = portrait ? 46 : 40;

  const indices = Array.from({ length: count }, (_, i) => i);

  return (
    <Canvas
      camera={{ position: [0, 1.4, 22], fov }}
      dpr={[1, 2]}
      onPointerMissed={() => onSelect(null)}
      shadows
    >
      <color args={["#070f1c"]} attach="background" />
      <fog args={["#070f1c", 10, 30]} attach="fog" />

      <hemisphereLight
        args={["#dce8ff", "#16223a", 0.85]}
        position={[0, 8, 0]}
      />
      <ambientLight intensity={0.5} />
      <spotLight
        angle={0.7}
        castShadow
        color="#fff1da"
        decay={0}
        intensity={2.8}
        penumbra={0.95}
        position={[0, 9, 6]}
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight color="#ffffff" intensity={0.7} position={[0, 4, 8]} />
      <directionalLight color="#7da0ff" intensity={1.5} position={[0, 6, -8]} />

      {/* Parede de fundo */}
      <mesh position={[0, 4, -7.5]}>
        <planeGeometry args={[60, 16]} />
        <meshStandardMaterial color="#141d30" roughness={1} />
      </mesh>

      {/* Arquitrave sobre a colunata */}
      <mesh castShadow position={[0, 7.7, -2.6]}>
        <boxGeometry args={[count * SPACING + 4, 0.6, 1.2]} />
        <meshStandardMaterial color="#26334a" roughness={0.85} />
      </mesh>

      {/* Chão de mármore reflexivo */}
      <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <MeshReflectorMaterial
          blur={[340, 110]}
          color="#0b1828"
          depthScale={1.1}
          maxDepthThreshold={1.2}
          metalness={0.6}
          minDepthThreshold={0.4}
          mixBlur={1}
          mixStrength={50}
          resolution={512}
          roughness={0.85}
        />
      </mesh>

      {/* Colunata + estátuas */}
      {indices.map((i) => {
        const x = xAt(i, count);
        return (
          <group key={i}>
            <Column position={[x, 0, -2.6]} />
            {/* Plinto da estátua */}
            <mesh castShadow position={[x, -0.16, 0]} receiveShadow>
              <cylinderGeometry args={[1.2, 1.35, 0.32, 40]} />
              <meshStandardMaterial color="#3a4256" roughness={0.7} />
            </mesh>
            <group position={[x, 0, 0]}>
              <Suspense fallback={null}>
                <StatueModel
                  dimmed={selected !== null && selected !== i}
                  onSelect={() => onSelect(i)}
                  url={modelUrl}
                />
              </Suspense>
            </group>
          </group>
        );
      })}

      {/* Colunas de extremidade (profundidade) */}
      <Column height={8} position={[xAt(0, count) - SPACING, 0, -5.5]} />
      <Column
        height={8}
        position={[xAt(count - 1, count) + SPACING, 0, -5.5]}
      />

      <Dust />

      <CameraRig
        count={count}
        panRef={panRef}
        portrait={portrait}
        selected={selected}
      />
    </Canvas>
  );
}
