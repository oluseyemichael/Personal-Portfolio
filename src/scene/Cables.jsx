import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { theme, hex } from '../config/theme.js';
import { LAYERS } from './CameraPath.js';

/**
 * Cable runs. Sparse layout (8 bundles) but each runs CONTINUOUSLY
 * from surface to bare metal - no cuts at layer boundaries.
 * Pulses kept slow.
 */

const Y_TOP = LAYERS.surface - 0.5;
const Y_BOTTOM = LAYERS.metal - 0.4;

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// One continuous curve spanning the whole stack, gently undulating
function makeContinuousCable(x, z, sway, rng) {
  const points = [];
  const segments = 20;
  const phase = rng() * Math.PI * 2;
  const freq = 1.5 + rng() * 1.5;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = Y_TOP + (Y_BOTTOM - Y_TOP) * t;
    const taper = Math.sin(t * Math.PI);
    const swayAmount = sway * (0.35 + taper * 0.65);
    points.push(new THREE.Vector3(
      x + Math.sin(t * Math.PI * freq + phase) * swayAmount,
      y,
      z + Math.cos(t * Math.PI * (freq * 0.7) + phase) * swayAmount,
    ));
  }
  return new THREE.CatmullRomCurve3(points);
}

function Cat6Cable({ curve, color, radius = 0.045 }) {
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 80, radius, 6, false),
    [curve, radius],
  );
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.85}
        metalness={0.05}
        emissive={color}
        emissiveIntensity={0.06}
      />
    </mesh>
  );
}

function FibreStrand({ curve, pulseSpeed, pulseOffset, pulseCount }) {
  const pulseRefs = useRef([]);
  const gold = useMemo(() => new THREE.Color(hex(theme.colors.accentPrimary)), []);
  const cream = useMemo(() => new THREE.Color(hex('#FFF8E7')), []);

  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 80, 0.012, 4, false),
    [curve],
  );

  useFrame(({ clock }) => {
    pulseRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = (clock.elapsedTime * pulseSpeed + pulseOffset + i / pulseCount) % 1;
      const point = curve.getPointAt(t);
      mesh.position.copy(point);
      const fade = Math.sin(t * Math.PI);
      mesh.scale.setScalar(0.4 + fade * 0.7);
    });
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={gold} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      {Array.from({ length: pulseCount }, (_, i) => (
        <mesh key={i} ref={el => (pulseRefs.current[i] = el)}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={cream} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function CableBundle({ x, z, seed }) {
  const rng = useMemo(() => seededRandom(seed), [seed]);

  const jacketColors = useMemo(() => [
    new THREE.Color(hex(theme.colors.accentDeep)),
    new THREE.Color(hex(theme.colors.bgLight)),
    new THREE.Color(hex('#8A7350')),
    new THREE.Color(hex(theme.colors.bgLight)),
    new THREE.Color(hex('#6B5B3E')),
  ], []);

  const cables = useMemo(() => {
    const c = [];
    const count = 3 + Math.floor(rng() * 3);
    for (let i = 0; i < count; i++) {
      const offsetX = (rng() - 0.5) * 0.35;
      const offsetZ = (rng() - 0.5) * 0.35;
      c.push({
        id: `cat6-${i}`,
        curve: makeContinuousCable(x + offsetX, z + offsetZ, 0.35 + rng() * 0.5, rng),
        color: jacketColors[i % jacketColors.length],
        radius: 0.035 + rng() * 0.02,
      });
    }
    return c;
  }, [x, z, rng, jacketColors]);

  const fibres = useMemo(() => {
    const f = [];
    const count = 1 + Math.floor(rng() * 2);
    for (let i = 0; i < count; i++) {
      const offsetX = (rng() - 0.5) * 0.4;
      const offsetZ = (rng() - 0.5) * 0.4;
      f.push({
        id: `fibre-${i}`,
        curve: makeContinuousCable(x + offsetX, z + offsetZ, 0.25 + rng() * 0.35, rng),
        pulseSpeed: 0.05 + rng() * 0.04,
        pulseOffset: rng(),
        pulseCount: 3 + Math.floor(rng() * 2),
      });
    }
    return f;
  }, [x, z, rng]);

  return (
    <group>
      {cables.map(c => (
        <Cat6Cable key={c.id} curve={c.curve} color={c.color} radius={c.radius} />
      ))}
      {fibres.map(f => (
        <FibreStrand key={f.id} curve={f.curve} pulseSpeed={f.pulseSpeed} pulseOffset={f.pulseOffset} pulseCount={f.pulseCount} />
      ))}
    </group>
  );
}

export function Cables() {
  // 8 bundles around the perimeter, each running the FULL height
  const runs = useMemo(() => [
    { x: -6.5, z: -2,   seed: 101 },
    { x: 5.5,  z: -3.5, seed: 102 },
    { x: 7,    z: -1,   seed: 103 },
    { x: -5.5, z: -4,   seed: 104 },
    { x: -7,   z: -2.5, seed: 105 },
    { x: 6,    z: -4,   seed: 106 },
    { x: 5.5,  z: -1.5, seed: 107 },
    { x: -6,   z: -3,   seed: 108 },
  ], []);

  return (
    <group>
      {runs.map(run => (
        <CableBundle key={run.seed} {...run} />
      ))}
    </group>
  );
}
