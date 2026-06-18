import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import { Box3, Mesh, MeshStandardMaterial, Vector3 } from "three";

// Altura-alvo da estátua (unidades da cena). O modelo é escalado para esta
// altura e assenta com a base em y=0, independentemente do tamanho nativo.
const TARGET_HEIGHT = 3.2;

// Mármore uniforme — aplicado por cima do material do modelo para dar o look
// de estátua e garantir visibilidade sem mapa de ambiente (IBL).
const MARBLE = new MeshStandardMaterial({
  color: "#e9e2d4",
  roughness: 0.5,
  metalness: 0,
});

/**
 * Estátua a partir de um modelo 3D (.glb/.gltf): clonado (evita o bug de reuso
 * da cache do GLTF), convertido a mármore, auto-centrado e auto-escalado para
 * assentar no pedestal. Usado quando a figura tem `model_url`.
 */
export function StatueModel({
  url,
  onSelect,
}: {
  url: string;
  onSelect: () => void;
}) {
  const { scene } = useGLTF(url);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.material = MARBLE;
        obj.castShadow = true;
      }
    });
    return clone;
  }, [scene]);

  // Medir sobre o `scene` original (matrizes do loader já válidas); o clone
  // tem a mesma geometria/transformações.
  const box = new Box3().setFromObject(scene);
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());
  const scale = size.y > 0 ? TARGET_HEIGHT / size.y : 1;
  const position: [number, number, number] = [
    -center.x * scale,
    -box.min.y * scale,
    -center.z * scale,
  ];

  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect();
  };
  const enter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };
  const leave = () => {
    document.body.style.cursor = "auto";
  };

  return (
    <group
      onClick={click}
      onPointerOut={leave}
      onPointerOver={enter}
      position={position}
      scale={scale}
    >
      <primitive object={model} />
    </group>
  );
}
