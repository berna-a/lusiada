import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points as ThreePoints } from "three";
import { AdditiveBlending, BufferAttribute, BufferGeometry } from "three";

/** Poeira dourada suspensa, a flutuar devagar na luz. */
export function Dust({ count = 140 }: { count?: number }) {
  const ref = useRef<ThreePoints>(null);

  const { geometry, positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = Math.random() * 6.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    return { geometry: geo, positions: pos };
  }, [count]);

  useFrame((_, delta) => {
    const points = ref.current;
    if (!points) {
      return;
    }
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] += delta * 0.12;
      if (positions[i] > 6.5) {
        positions[i] = 0;
      }
    }
    points.geometry.getAttribute("position").needsUpdate = true;
    points.rotation.y += delta * 0.01;
  });

  return (
    <points geometry={geometry} ref={ref}>
      <pointsMaterial
        blending={AdditiveBlending}
        color="#e8c873"
        depthWrite={false}
        opacity={0.5}
        size={0.035}
        sizeAttenuation
        transparent
      />
    </points>
  );
}
