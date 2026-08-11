import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { theme, hex } from '../config/theme.js';
import { LAYERS } from './CameraPath.js';

const Y_TOP = LAYERS.surface + 2;
const Y_BOTTOM = LAYERS.metal - 2;

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Generates smooth vertical conduit curve for main trunk
function makeTrunkCurve(x, z, sway) {
  const points = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = Y_TOP + (Y_BOTTOM - Y_TOP) * t;
    const swayX = Math.sin(t * Math.PI * 2) * sway;
    const swayZ = Math.cos(t * Math.PI * 1.5) * (sway * 0.5);
    points.push(new THREE.Vector3(x + swayX, y, z + swayZ));
  }
  return new THREE.CatmullRomCurve3(points);
}

// Single Industrial Fiber Optic Trunk (Matching Reference Image)
function FiberOpticTrunk({ x, z, sway = 0.5, seed = 1 }) {
  const rng = useMemo(() => seededRandom(seed), [seed]);
  const mainCurve = useMemo(() => makeTrunkCurve(x, z, sway), [x, z, sway]);

  // Main Outer Sheath Geometry (Optimized Segment Count)
  const sheathGeo = useMemo(
    () => new THREE.TubeGeometry(mainCurve, 50, 0.22, 10, false),
    [mainCurve],
  );

  // Sub-cable jackets inside the trunk (Cyan, Gold, Emerald, Magenta, Blue, Yellow)
  const subCableColors = useMemo(() => [
    hex('#06B6D4'), // Cyan
    hex('#F59E0B'), // Gold
    hex('#10B981'), // Emerald
    hex('#EC4899'), // Magenta
    hex('#EAB308'), // Yellow
    hex('#0284C7'), // Blue
  ], []);

  const subCurves = useMemo(() => {
    return subCableColors.map((color, idx) => {
      const angle = (idx / subCableColors.length) * Math.PI * 2;
      const rOffset = 0.12;
      const points = mainCurve.points.map((pt, pIdx) => {
        const t = pIdx / (mainCurve.points.length - 1);
        const spread = t > 0.85 ? (t - 0.85) * 4 : 1; // fan out near bare metal
        const ox = Math.cos(angle + t * 2) * rOffset * spread;
        const oz = Math.sin(angle + t * 2) * rOffset * spread;
        return new THREE.Vector3(pt.x + ox, pt.y, pt.z + oz);
      });
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.TubeGeometry(curve, 40, 0.045, 8, false);
      return {
        id: idx,
        color,
        curve,
        geo,
      };
    });
  }, [mainCurve, subCableColors]);

  // Glass Fiber Filaments (Translucent glass strands with light pulses)
  const fiberPulsesRef = useRef([]);
  const fiberCurves = useMemo(() => {
    return subCurves.flatMap((sub, sIdx) => {
      return [0, 1].map((fIdx) => {
        const angle = (fIdx / 2) * Math.PI * 2;
        const fPoints = sub.curve.points.map((pt, pIdx) => {
          const t = pIdx / (sub.curve.points.length - 1);
          const fan = t > 0.75 ? (t - 0.75) * 5 : 0.8;
          return new THREE.Vector3(
            pt.x + Math.cos(angle + t * 4) * 0.05 * fan,
            pt.y,
            pt.z + Math.sin(angle + t * 4) * 0.05 * fan,
          );
        });
        const curve = new THREE.CatmullRomCurve3(fPoints);
        const geo = new THREE.TubeGeometry(curve, 32, 0.014, 5, false);
        return {
          id: `${sIdx}-${fIdx}`,
          curve,
          geo,
          speed: 0.08 + rng() * 0.06,
          offset: rng(),
          color: sub.color,
        };
      });
    });
  }, [subCurves, rng]);

  // Metallic Collar Joint Positions along the vertical shaft
  const collarPositions = useMemo(() => [
    LAYERS.surface - 1,
    LAYERS.application - 1,
    LAYERS.server - 1,
    LAYERS.network - 1,
    LAYERS.metal + 1,
  ], []);

  useFrame(({ clock }) => {
    fiberCurves.forEach((f, i) => {
      const pulse = fiberPulsesRef.current[i];
      if (pulse) {
        const t = (clock.elapsedTime * f.speed + f.offset) % 1;
        const pt = f.curve.getPointAt(t);
        pulse.position.copy(pt);
        const glow = Math.sin(t * Math.PI);
        pulse.scale.setScalar(0.6 + glow * 0.8);
      }
    });
  });

  return (
    <group>
      {/* 1. Dark Outer Protective Sheath */}
      <mesh geometry={sheathGeo}>
        <meshPhysicalMaterial
          color={hex('#0F172A')}
          roughness={0.45}
          metalness={0.2}
          clearcoat={0.3}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* 2. Metallic Threaded Collar Rings at Layer Junctions */}
      {collarPositions.map((yPos, idx) => {
        const tVal = Math.max(0, Math.min(1, (Y_TOP - yPos) / (Y_TOP - Y_BOTTOM)));
        const point = mainCurve.getPointAt(tVal);
        return (
          <group key={idx} position={[point.x, yPos, point.z]}>
            {/* Outer Ribbed Silver Collar */}
            <mesh>
              <cylinderGeometry args={[0.26, 0.26, 0.25, 20]} />
              <meshStandardMaterial
                color={hex(theme.colors.metalSilver)}
                metalness={0.95}
                roughness={0.1}
              />
            </mesh>
            {/* Threaded Ring Details */}
            {[-0.08, 0, 0.08].map((offset, rIdx) => (
              <mesh key={rIdx} position={[0, offset, 0]}>
                <torusGeometry args={[0.27, 0.015, 6, 20]} />
                <meshStandardMaterial color={hex('#94A3B8')} metalness={0.9} roughness={0.15} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* 3. Colorful Sub-Cable Jackets inside Trunk */}
      {subCurves.map((sub) => (
        <mesh key={sub.id} geometry={sub.geo}>
          <meshPhysicalMaterial
            color={sub.color}
            roughness={0.25}
            metalness={0.4}
            clearcoat={0.6}
            emissive={sub.color}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}

      {/* 4. Translucent Glass Fiber Optic Filaments */}
      {fiberCurves.map((f, i) => (
        <group key={f.id}>
          <mesh geometry={f.geo}>
            <meshPhysicalMaterial
              color={f.color}
              transmission={0.9}
              opacity={0.8}
              transparent
              roughness={0.05}
              ior={1.45}
              emissive={f.color}
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Traveling Light Pulse */}
          <mesh ref={(el) => (fiberPulsesRef.current[i] = el)}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color={f.color} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Cables() {
  // 2 primary industrial fiber optic trunks framing the stack
  return (
    <group raycast={() => null}>
      <FiberOpticTrunk x={-6.8} z={-2.2} sway={0.6} seed={101} />
      <FiberOpticTrunk x={6.8} z={-2.2} sway={-0.6} seed={202} />
    </group>
  );
}

