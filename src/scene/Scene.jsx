import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
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
  const high = gpuTier >= 3;
  const low = gpuTier <= 1;

  return (
    <Canvas
      camera={{ position: [0, 2.5, 7], fov: 55, near: 0.1, far: 200 }}
      dpr={low ? [1, 1] : [1, 1.5]}
      shadows={high ? 'soft' : false}
      gl={{
        antialias: !low,
        alpha: false,
        powerPreference: 'high-performance',
        // Reduce internal precision on mobile for speed
        ...(low ? { precision: 'mediump' } : {}),
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(new THREE.Color(hex(theme.colors.bgDeep)));
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
        scene.fog = new THREE.Fog(
          hex(theme.colors.fog),
          low ? 8 : theme.scene.fogNear,
          low ? 50 : theme.scene.fogFar,
        );
      }}
    >
      <Suspense fallback={null}>
        {/* Ambient fill */}
        <ambientLight intensity={low ? 0.5 : 0.35} color={hex('#1E293B')} />

        {/* Environment reflection map — skip on low-tier (expensive) */}
        {high && <Environment preset="city" background={false} resolution={256} />}

        {/* Lighting — reduced set on low-tier */}
        <pointLight position={[3, LAYERS.surface + 4, 4]} intensity={2.4} color={hex('#06B6D4')} distance={20} />
        <directionalLight position={[-4, LAYERS.surface + 6, -3]} intensity={1.5} color={hex('#CBD5E1')} />
        {!low && (
          <spotLight
            position={[2, LAYERS.surface + 3, 5]}
            target-position={[0, LAYERS.surface + 1.5, 0]}
            intensity={2.6}
            angle={0.6}
            penumbra={0.8}
            color={hex('#F59E0B')}
            distance={18}
            castShadow={high}
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0005}
          />
        )}

        {/* Application Layer */}
        {!low && <pointLight position={[-3, LAYERS.application + 3, 3]} intensity={2.0} color={hex('#10B981')} distance={18} />}
        {!low && <directionalLight position={[4, LAYERS.application + 4, -2]} intensity={1.3} color={hex('#06B6D4')} />}

        {/* Server Layer */}
        <pointLight position={[0, LAYERS.server + 4, 4]} intensity={2.6} color={hex('#06B6D4')} distance={22} />
        {!low && <directionalLight position={[-4, LAYERS.server + 2, -3]} intensity={1.8} color={hex('#10B981')} />}

        {/* Network Layer */}
        <pointLight position={[3, LAYERS.network + 3, 3]} intensity={2.2} color={hex('#EC4899')} distance={18} />
        {!low && <directionalLight position={[-3, LAYERS.network + 4, -2]} intensity={1.5} color={hex('#06B6D4')} />}

        {/* Bare Metal Layer */}
        <pointLight position={[0, LAYERS.metal + 4, 4]} intensity={3.0} color={hex('#06B6D4')} distance={24} />
        <pointLight position={[0, LAYERS.metal + 1, 0]} intensity={4.5} color={hex('#F59E0B')} distance={14} />

        {/* Avatar */}
        <AbstractAvatar position={[0, LAYERS.surface, 0]} castShadows={high} />

        {/* Stack layers */}
        <StackLayers onSelectProject={onSelectProject} gpuTier={gpuTier} />

        {/* Cables — skip on low-tier (very geometry-heavy) */}
        {!low && <Cables />}

        {/* Depth markers */}
        <DepthMarkers />

        {/* Particles — scale by tier */}
        <Particles count={low ? 60 : (high ? theme.scene.particleCount : Math.round(theme.scene.particleCount * 0.4))} />

        {/* Camera */}
        <CameraRig scrollRef={scrollRef} />

        {/* Post-processing — skip entirely on low-tier */}
        {!low && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={high ? 0.65 : 0.4}
              luminanceThreshold={0.7}
              luminanceSmoothing={0.4}
              mipmapBlur
              resolutionScale={high ? 0.5 : 0.25}
            />
            <Vignette offset={0.2} darkness={0.65} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
