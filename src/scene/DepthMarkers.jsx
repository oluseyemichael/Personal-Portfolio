import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { theme, hex } from '../config/theme.js';
import { LAYERS } from './CameraPath.js';

/**
 * Depth markers floating at the edge of the descent, like a submarine
 * dive readout. Reinforces the "going down through the stack" feeling.
 */

const MARKERS = [
  { y: LAYERS.surface - 3,     depth: '00m', label: 'SURFACE' },
  { y: LAYERS.application,      depth: '12m', label: 'APPLICATION' },
  { y: LAYERS.server,          depth: '24m', label: 'SERVER' },
  { y: LAYERS.network,         depth: '36m', label: 'NETWORK' },
  { y: LAYERS.metal,           depth: '48m', label: 'BARE METAL' },
];

function Marker({ y, depth, label }) {
  const gold = useMemo(() => hex(theme.colors.accentPrimary), []);
  const muted = useMemo(() => hex('#8A7350'), []);

  return (
    <group position={[-5.5, y, 1]}>
      {/* Depth number */}
      <Text
        fontSize={0.55}
        color={gold}
        anchorX="right"
        anchorY="middle"
        font={undefined}
        position={[0, 0, 0]}
      >
        {depth}
      </Text>
      {/* Label */}
      <Text
        fontSize={0.22}
        color={muted}
        anchorX="right"
        anchorY="middle"
        letterSpacing={0.2}
        position={[0, -0.45, 0]}
      >
        {label}
      </Text>
      {/* Tick line */}
      <mesh position={[0.6, 0, 0]}>
        <boxGeometry args={[1.2, 0.015, 0.015]} />
        <meshBasicMaterial color={gold} transparent opacity={0.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function DepthMarkers() {
  return (
    <group>
      {MARKERS.map(m => (
        <Marker key={m.label} {...m} />
      ))}
    </group>
  );
}
