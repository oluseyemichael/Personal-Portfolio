import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { theme, hex } from '../config/theme.js';

/**
 * A single glowing neural node.
 * Pulses subtly on its own timing so the scene feels alive.
 */
export function NeuralNode({ position, size = 0.15, pulseSpeed = 1, pulseOffset = 0 }) {
  const meshRef = useRef();
  const materialRef = useRef();

  // Cache the color object so we're not recreating it every frame
  const color = useMemo(() => new THREE.Color(hex(theme.colors.accentPrimary)), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime * pulseSpeed + pulseOffset;
    // Gentle scale pulse
    const scale = 1 + Math.sin(t) * 0.15;
    meshRef.current.scale.setScalar(scale);
    // Emissive intensity breathing
    if (materialRef.current) {
      materialRef.current.emissiveIntensity =
        theme.emissive.nodeIdle + Math.sin(t) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={theme.emissive.nodeIdle}
        toneMapped={false}
      />
    </mesh>
  );
}
