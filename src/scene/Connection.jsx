import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { theme, hex } from '../config/theme.js';

/**
 * A glowing line/synapse between two nodes.
 * Uses a thin cylinder oriented between the two points.
 */
export function Connection({ from, to, thickness = 0.02, flowSpeed = 0.5, offset = 0 }) {
  const meshRef = useRef();
  const materialRef = useRef();

  const { position, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    const up = new THREE.Vector3(0, 1, 0);
    const dirNorm = dir.clone().normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dirNorm);

    return { position: mid, quaternion: quat, length: len };
  }, [from, to]);

  const color = useMemo(() => new THREE.Color(hex(theme.colors.accentPrimary)), []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Subtle flowing shimmer
      const t = clock.elapsedTime * flowSpeed + offset;
      materialRef.current.opacity = 0.35 + Math.sin(t) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={position} quaternion={quaternion}>
      <cylinderGeometry args={[thickness, thickness, length, 6, 1, true]} />
      <meshBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0.4}
        toneMapped={false}
      />
    </mesh>
  );
}
