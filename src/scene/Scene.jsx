import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, N8AO, Vignette } from '@react-three/postprocessing';
import { Environment } from '@react-three/drei';
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

export function Scene({ scrollRef, onSelectProject, gpuTier = 3 }) {
  const highTier = gpuTier >= 3;

  return (
    <Canvas
      camera={{ position: [0, 2.5, 7], fov: 55, near: 0.1, far: 200 }}
      dpr={[1, 1.5]}
      shadows={highTier ? 'soft' : false}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(new THREE.Color(hex(theme.colors.bgDeep)));
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
        scene.fog = new THREE.Fog(hex(theme.colors.fog), theme.scene.fogNear, theme.scene.fogFar);
      }}
    >
      <Suspense fallback={null}>
        {/* Soft, rich ambient fill for PBR shadows */}
        <ambientLight intensity={0.35} color={hex('#1E293B')} />

        {/* Environment reflection map for metals & glass */}
        {highTier && <Environment preset="city" background={false} resolution={256} />}

        {/* Key & Rim Studio Lights per layer for metallic highlights */}
        {/* Surface / Product Key & Rim */}
        <pointLight position={[3, LAYERS.surface + 4, 4]} intensity={2.4} color={hex('#06B6D4')} distance={20} />
        <directionalLight position={[-4, LAYERS.surface + 6, -3]} intensity={1.5} color={hex('#CBD5E1')} />
        <spotLight
          position={[2, LAYERS.surface + 3, 5]}
          target-position={[0, LAYERS.surface + 1.5, 0]}
          intensity={2.6}
          angle={0.6}
          penumbra={0.8}
          color={hex('#F59E0B')}
          distance={18}
          castShadow={highTier}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0005}
        />

        {/* Application Layer Key & Rim */}
        <pointLight position={[-3, LAYERS.application + 3, 3]} intensity={2.0} color={hex('#10B981')} distance={18} />
        <directionalLight position={[4, LAYERS.application + 4, -2]} intensity={1.3} color={hex('#06B6D4')} />

        {/* Server Layer Key & Rim */}
        <pointLight position={[0, LAYERS.server + 4, 4]} intensity={2.6} color={hex('#06B6D4')} distance={22} />
        <directionalLight position={[-4, LAYERS.server + 2, -3]} intensity={1.8} color={hex('#10B981')} />

        {/* Network Layer Key & Rim */}
        <pointLight position={[3, LAYERS.network + 3, 3]} intensity={2.2} color={hex('#EC4899')} distance={18} />
        <directionalLight position={[-3, LAYERS.network + 4, -2]} intensity={1.5} color={hex('#06B6D4')} />

        {/* Bare Metal Layer Key & Core Light */}
        <pointLight position={[0, LAYERS.metal + 4, 4]} intensity={3.0} color={hex('#06B6D4')} distance={24} />
        <pointLight position={[0, LAYERS.metal + 1, 0]} intensity={4.5} color={hex('#F59E0B')} distance={14} />

        {/* Surface avatar figure */}
        <AbstractAvatar position={[0, LAYERS.surface, 0]} castShadows={highTier} />

        {/* Stack environments with PBR materials */}
        <StackLayers onSelectProject={onSelectProject} gpuTier={gpuTier} />

        {/* Cable conduits & fiber strands */}
        <Cables />

        {/* Submarine-style telemetry depth readout */}
        <DepthMarkers />

        {/* Floating atmospheric dust */}
        <Particles count={highTier ? theme.scene.particleCount : Math.round(theme.scene.particleCount * 0.4)} />

        {/* Scroll-driven camera controller */}
        <CameraRig scrollRef={scrollRef} />

        {/* Crisp post-processing bloom (optimized zero multisampling) */}
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={highTier ? 0.65 : 0.4}
            luminanceThreshold={0.7}
            luminanceSmoothing={0.4}
            mipmapBlur
            resolutionScale={0.5}
          />
          <Vignette offset={0.2} darkness={0.65} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}

