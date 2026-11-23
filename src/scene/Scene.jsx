import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Environment, PerformanceMonitor } from '@react-three/drei';
import { Suspense, useState } from 'react';
import * as THREE from 'three';
import { CameraRig } from './CameraRig.jsx';
import { StackLayers } from './StackLayers.jsx';
import { Particles } from './Particles.jsx';
import { theme, hex } from '../config/theme.js';

export function Scene({ scrollRef, onSelectProject, gpuTier: initialTier = 3 }) {
  // Runtime-adaptive tier: PerformanceMonitor steps it down if the
  // measured framerate stays poor, so slow devices degrade smoothly.
  const [tierCap, setTierCap] = useState(3);
  const tier = Math.min(tierCap, initialTier);
  const high = tier >= 3;
  const low = tier <= 1;

  return (
    <Canvas
      camera={{ position: [0, 2.5, 7], fov: 50, near: 0.1, far: 120 }}
      dpr={low ? [1, 1] : [1, 1.5]}
      gl={{
        antialias: !low,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(new THREE.Color(hex(theme.colors.bgDeep)));
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        scene.fog = new THREE.Fog(hex(theme.colors.bgDeep), theme.scene.fogNear, theme.scene.fogFar);
      }}
    >
      <PerformanceMonitor
        onDecline={() => setTierCap((t) => Math.max(1, t - 1))}
        flipflops={3}
        onFallback={() => setTierCap(1)}
      />
      <Suspense fallback={null}>
        {/* One lighting language for the whole descent: a warm key from
            the upper left, a cool sky fill, and soft ground bounce.
            Individual layers add a single local accent light. */}
        <hemisphereLight args={['#9db4e6', '#1a1208', low ? 0.9 : 0.6]} />
        <directionalLight position={[-5, 8, 6]} intensity={high ? 1.7 : 1.4} color="#FFE2B8" />
        {high && <Environment preset="city" background={false} resolution={128} environmentIntensity={0.45} />}

        <StackLayers onSelectProject={onSelectProject} gpuTier={tier} />
        <Particles count={low ? 40 : high ? 180 : 100} />
        <CameraRig scrollRef={scrollRef} />

        {!low && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={high ? 0.45 : 0.3}
              luminanceThreshold={0.85}
              luminanceSmoothing={0.3}
              mipmapBlur
              resolutionScale={high ? 0.5 : 0.25}
            />
            <Vignette offset={0.25} darkness={0.55} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
