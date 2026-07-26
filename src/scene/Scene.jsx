import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { CameraRig } from './CameraRig.jsx';
import { StackLayers } from './StackLayers.jsx';
import { AbstractAvatar } from './AbstractAvatar.jsx';
import { Particles } from './Particles.jsx';
import { Cables } from './Cables.jsx';
import { DepthMarkers } from './DepthMarkers.jsx';
import { LAYERS } from './CameraPath.js';
import { theme, hex } from '../config/theme.js';

export function Scene({ scrollRef }) {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 7], fov: 55, near: 0.1, far: 200 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(new THREE.Color(hex(theme.colors.bgDeep)));
        scene.fog = new THREE.Fog(hex(theme.colors.fog), 10, 55);
      }}
    >
      <Suspense fallback={null}>
        {/* Minimal lighting - emissive materials do the work */}
        <ambientLight intensity={0.15} color={hex(theme.colors.accentDeep)} />

        {/* One point light per layer so each level has presence */}
        <pointLight position={[0, LAYERS.surface + 4, 4]} intensity={2} color={hex(theme.colors.accentPrimary)} distance={18} />
        {/* Warm key light on the avatar's face */}
        <spotLight position={[2, LAYERS.surface + 3, 5]} target-position={[0, LAYERS.surface + 1.5, 0]} intensity={2.5} angle={0.6} penumbra={0.8} color={hex('#FFD86B')} distance={16} />
        <pointLight position={[0, LAYERS.application + 3, 3]} intensity={1.5} color={hex(theme.colors.accentSecondary)} distance={16} />
        <pointLight position={[0, LAYERS.server + 3, 3]} intensity={1.8} color={hex(theme.colors.accentPrimary)} distance={16} />
        <pointLight position={[0, LAYERS.network + 3, 3]} intensity={1.5} color={hex(theme.colors.accentSecondary)} distance={16} />
        <pointLight position={[0, LAYERS.metal + 3, 3]} intensity={2} color={hex(theme.colors.accentPrimary)} distance={18} />

        {/* The avatar greets at the surface */}
        <AbstractAvatar position={[0, LAYERS.surface, 0]} />

        {/* The five layers of the stack */}
        <StackLayers />

        {/* Cable runs connecting the layers - Cat6 bundles + fibre with light pulses */}
        <Cables />

        {/* Submarine-style depth readout down the side */}
        <DepthMarkers />

        {/* Atmosphere */}
        <Particles />

        {/* Camera driven by scroll */}
        <CameraRig scrollRef={scrollRef} />
      </Suspense>
    </Canvas>
  );
}
