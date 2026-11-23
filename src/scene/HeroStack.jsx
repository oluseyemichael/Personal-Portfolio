import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { playClick } from '../audio/soundEngine.js';
import { usePortrait } from './usePortrait.js';

/**
 * The idea of the site as one object: five slabs, one per layer of the
 * stack (Product at the top, Bare Metal at the bottom). It hovers and
 * sways gently at the landing. Clicking it five times in a row is the
 * hidden easter egg.
 */

const LAYER_NAMES = ['Product', 'Application', 'Server', 'Network', 'Bare metal'];
const W = 3.4;
const D = 2.2;
const CLICKS_TO_TRIGGER = 5;
const CLICK_WINDOW_MS = 1500;

function Slab({ index, y, h, labelSize }) {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(W, h, D)), [h]);
  const strength = 1 - index * 0.17; // fades from the surface down
  return (
    <group position={[0, y, 0]} rotation={[0, index * 0.09, 0]}>
      <mesh>
        <boxGeometry args={[W, h, D]} />
        <meshStandardMaterial color="#1a2133" metalness={0.55} roughness={0.38} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#FFC145" transparent opacity={0.25 + strength * 0.65} toneMapped={false} />
      </lineSegments>
      <Text
        position={[-W / 2 + 0.22, 0, D / 2 + 0.002]}
        fontSize={labelSize}
        letterSpacing={0.18}
        anchorX="left"
        anchorY="middle"
        color="#FFF8E7"
        fillOpacity={0.45 + strength * 0.5}
      >
        {`0${index}  ${LAYER_NAMES[index].toUpperCase()}`}
      </Text>
    </group>
  );
}

export function HeroStack({ position = [2.9, 1.1, 0] }) {
  const portrait = usePortrait();
  // Portrait: centred, with thicker slabs so the layer names stay legible
  const pos = portrait ? [0, position[1] + 0.3, 0] : position;
  const h = portrait ? 0.3 : 0.15;
  const pitch = portrait ? 0.64 : 0.46;
  const labelSize = portrait ? 0.15 : 0.075;
  const group = useRef();
  const clicks = useRef({ count: 0, last: 0 });

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.rotation.y = -0.5 + Math.sin(t * 0.22) * 0.3;
    group.current.position.y = pos[1] + Math.sin(t * 0.5) * 0.06;
  });

  const onClick = () => {
    playClick();
    const now = performance.now();
    const c = clicks.current;
    if (now - c.last > CLICK_WINDOW_MS) c.count = 0;
    c.last = now;
    c.count += 1;
    if (c.count >= CLICKS_TO_TRIGGER) {
      c.count = 0;
      window.dispatchEvent(
        new CustomEvent('easter-egg', { detail: { message: "Okay, okay. Back to work." } }),
      );
    }
  };

  return (
    <group ref={group} position={pos} scale={portrait ? 0.88 : 1} onClick={onClick}>
      {LAYER_NAMES.map((_, i) => (
        <Slab key={i} index={i} y={(2 - i) * pitch} h={h} labelSize={labelSize} />
      ))}
      <pointLight position={[0, -2.4, 1.2]} intensity={4} distance={5} color="#FFB347" />
    </group>
  );
}
