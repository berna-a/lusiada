import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import { Box3, Mesh, MeshStandardMaterial, Vector3 } from "three";

// Altura-alvo da estátua (unidades da cena). Escalada para esta altura, com a
// base em y=0, independentemente do tamanho nativo do modelo.
const TARGET_HEIGHT = 3.2;

/**
 * Estátua a partir de um modelo 3D (.glb/.gltf): clonada (evita o bug de reuso
 * da cache do GLTF), convertida a mármore com material próprio (para brilho de
 * hover individual), auto-centrada e auto-escalada para assentar no pedestal.
 */
export function StatueModel({
  url,
  onSelect,
  dimmed = false,
}: {
  url: string;
  onSelect: () => void;
  dimmed?: boolean;
}) {
  const { scene } = useGLTF(url);

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#e9e2d4",
        roughness: 0.5,
        metalness: 0,
        emissive: "#caa24a",
        emissiveIntensity: 0,
      }),
    []
  );

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.material = material;
        obj.castShadow = true;
      }
    });
    return clone;
  }, [scene, material]);

  // Esmaecer as estátuas não selecionadas.
  material.color.set(dimmed ? "#7e8596" : "#e9e2d4");

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
    material.emissiveIntensity = 0.14;
  };
  const leave = () => {
    document.body.style.cursor = "auto";
    material.emissiveIntensity = 0;
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
