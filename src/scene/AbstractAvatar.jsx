import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { theme, hex } from '../config/theme.js';

/**
 * LEGO-style minifig avatar built from primitives.
 * Lighter palette per feedback: brighter skin tone, lifted jacket,
 * so it reads clearly against the dark scene.
 */

const COLORS = {
  skin: '#A9683E',       // lighter warm brown
  skinShadow: '#875232',
  hair: '#1E1A16',
  jacket: '#3A3A42',     // lifted charcoal (was near-black)
  jacketShine: '#52525E',
  tee: '#F7F3EA',
  pants: '#727A45',      // lighter olive
  hands: '#A9683E',
  smile: '#3A2418',
};

function Box({ args, position, color, rotation, roughness = 0.35, metalness = 0.1, emissive, emissiveIntensity = 0 }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        emissive={emissive || color}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}

export function AbstractAvatar({ position = [0, 0, 0] }) {
  const groupRef = useRef();
  const entranceRef = useRef(0);
  const glowColor = useMemo(() => new THREE.Color(hex(theme.colors.accentPrimary)), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (entranceRef.current < 1) {
      entranceRef.current = Math.min(1, entranceRef.current + 0.012);
    }
    const e = 1 - Math.pow(1 - entranceRef.current, 3);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(e * 0.85);
      groupRef.current.position.y = position[1] + Math.sin(t * 0.7) * 0.04 + (1 - e) * -0.6;
      groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Warm rim glow behind the figure */}
      <mesh position={[0, 1.4, -0.6]}>
        <circleGeometry args={[2.2, 32]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.08} toneMapped={false} />
      </mesh>

      {/* ===== HEAD ===== */}
      <mesh position={[0, 2.55, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.72, 32]} />
        <meshStandardMaterial color={COLORS.skin} roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[0, 2.9, 0]}>
        <sphereGeometry args={[0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={COLORS.skin} roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[0, 3.02, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.12, 20]} />
        <meshStandardMaterial color={COLORS.skin} roughness={0.4} />
      </mesh>

      {/* ===== FACE ===== */}
      <Box args={[0.09, 0.09, 0.02]} position={[-0.16, 2.62, 0.42]} color={COLORS.smile} roughness={0.3} />
      <Box args={[0.09, 0.09, 0.02]} position={[0.16, 2.62, 0.42]} color={COLORS.smile} roughness={0.3} />
      <Box args={[0.14, 0.03, 0.02]} position={[-0.16, 2.74, 0.42]} color={COLORS.smile} />
      <Box args={[0.14, 0.03, 0.02]} position={[0.16, 2.74, 0.42]} color={COLORS.smile} />
      <Box args={[0.22, 0.03, 0.02]} position={[0, 2.42, 0.42]} color={COLORS.smile} />
      <Box args={[0.03, 0.05, 0.02]} position={[-0.12, 2.45, 0.42]} color={COLORS.smile} />
      <Box args={[0.03, 0.05, 0.02]} position={[0.12, 2.45, 0.42]} color={COLORS.smile} />
      <Box args={[0.16, 0.04, 0.015]} position={[0, 2.47, 0.43]} color={COLORS.tee} roughness={0.3} />

      {/* ===== HAIR ===== */}
      {useMemo(() => {
        const pieces = [];
        let s = 5;
        const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
        for (let i = 0; i < 34; i++) {
          const theta = rng() * Math.PI * 2;
          const r = 0.28 + rng() * 0.16;
          const height = 3.0 + rng() * 0.28;
          const px = Math.cos(theta) * r;
          const pz = Math.sin(theta) * r * 0.85;
          pieces.push(
            <mesh key={i} position={[px, height, pz]}>
              <sphereGeometry args={[0.1 + rng() * 0.05, 8, 8]} />
              <meshStandardMaterial color={COLORS.hair} roughness={0.7} />
            </mesh>
          );
        }
        return pieces;
      }, [])}
      <mesh position={[0, 2.98, 0.05]}>
        <cylinderGeometry args={[0.44, 0.44, 0.16, 32, 1, true]} />
        <meshStandardMaterial color={COLORS.hair} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* ===== NECK ===== */}
      <mesh position={[0, 2.12, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.14, 20]} />
        <meshStandardMaterial color={COLORS.skinShadow} roughness={0.5} />
      </mesh>

      {/* ===== TORSO ===== */}
      <mesh position={[0, 1.55, 0]}>
        <boxGeometry args={[0.95, 1.0, 0.55]} />
        <meshStandardMaterial color={COLORS.jacket} roughness={0.4} metalness={0.1} />
      </mesh>
      <Box args={[0.3, 0.35, 0.02]} position={[0, 1.85, 0.28]} color={COLORS.tee} roughness={0.4} />
      <Box args={[0.03, 0.9, 0.02]} position={[0, 1.5, 0.29]} color={COLORS.jacketShine} metalness={0.5} roughness={0.3} />
      <Box args={[0.16, 0.32, 0.04]} position={[-0.18, 1.9, 0.27]} color={COLORS.jacket} rotation={[0, 0, 0.3]} />
      <Box args={[0.16, 0.32, 0.04]} position={[0.18, 1.9, 0.27]} color={COLORS.jacket} rotation={[0, 0, -0.3]} />
      <Box args={[0.2, 0.13, 0.02]} position={[0.26, 1.62, 0.29]} color="#C24747" roughness={0.4} />
      <Box args={[0.08, 0.13, 0.021]} position={[0.19, 1.62, 0.3]} color="#4A5A8A" roughness={0.4} />

      {/* ===== ARMS ===== */}
      <mesh position={[-0.62, 1.55, 0]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[0.26, 0.85, 0.32]} />
        <meshStandardMaterial color={COLORS.jacket} roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0.62, 1.55, 0]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.26, 0.85, 0.32]} />
        <meshStandardMaterial color={COLORS.jacket} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* ===== HANDS ===== */}
      <mesh position={[-0.72, 1.05, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.05, 12, 20, Math.PI * 1.5]} />
        <meshStandardMaterial color={COLORS.hands} roughness={0.4} />
      </mesh>
      <mesh position={[0.72, 1.05, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.05, 12, 20, Math.PI * 1.5]} />
        <meshStandardMaterial color={COLORS.hands} roughness={0.4} />
      </mesh>

      {/* ===== HIPS ===== */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[0.85, 0.3, 0.5]} />
        <meshStandardMaterial color={COLORS.pants} roughness={0.5} metalness={0.05} />
      </mesh>

      {/* ===== LEGS ===== */}
      <mesh position={[-0.22, 0.4, 0]}>
        <boxGeometry args={[0.38, 0.85, 0.5]} />
        <meshStandardMaterial color={COLORS.pants} roughness={0.5} metalness={0.05} />
      </mesh>
      <mesh position={[0.22, 0.4, 0]}>
        <boxGeometry args={[0.38, 0.85, 0.5]} />
        <meshStandardMaterial color={COLORS.pants} roughness={0.5} metalness={0.05} />
      </mesh>
      <Box args={[0.04, 0.6, 0.5]} position={[0, 0.3, 0]} color={theme.colors.bgDeep} />
      <Box args={[0.14, 0.2, 0.02]} position={[-0.32, 0.42, 0.26]} color="#5E6438" roughness={0.6} />
      <Box args={[0.14, 0.2, 0.02]} position={[0.32, 0.42, 0.26]} color="#5E6438" roughness={0.6} />

      {/* ===== FEET ===== */}
      <Box args={[0.38, 0.16, 0.6]} position={[-0.22, -0.08, 0.05]} color={COLORS.hair} roughness={0.5} />
      <Box args={[0.38, 0.16, 0.6]} position={[0.22, -0.08, 0.05]} color={COLORS.hair} roughness={0.5} />
    </group>
  );
}
