import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";

/**
 * Estátua a partir de um modelo 3D (.glb/.gltf). Usada quando a figura tem
 * `model_url`. Posicionada sobre o pedestal; ajustar scale/position conforme
 * o modelo concreto.
 */
export function StatueModel({
  url,
  onSelect,
}: {
  url: string;
  onSelect: () => void;
}) {
  const { scene } = useGLTF(url);

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
    <primitive
      object={scene}
      onClick={click}
      onPointerOut={leave}
      onPointerOver={enter}
      position={[0, 0, 0]}
    />
  );
}
