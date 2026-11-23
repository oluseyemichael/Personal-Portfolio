import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { theme, hex } from '../config/theme.js';

/**
 * A cloud of drifting particles filling the scene background.
 * Uses a single Points object for performance.
 */
export function Particles({ count = theme.scene.particleCount }) {
  const pointsRef = useRef();

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Fill the vertical descent shaft
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = 5 - Math.random() * 58;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
      sz[i] = Math.random() * 0.05 + 0.02;
    }
    return { positions: pos, sizes: sz };
  }, [count]);

  const color = useMemo(() => new THREE.Color(hex(theme.colors.accentPrimary)), []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    // Slow rotation for gentle drift
    pointsRef.current.rotation.y = clock.elapsedTime * 0.01;
  });

  return (
    <points ref={pointsRef} raycast={() => null}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.3}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
