import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { theme, hex } from '../config/theme.js';

/**
 * An interactive node marking a real project, placed inside whichever
 * layer matches project.layer. Distinct from ambient nodes: ring collar,
 * hover glow/scale, and a floating title label. Click hands the project
 * up to the ProjectDetail overlay via onSelect.
 */
export function ProjectMarker({ project, position, onSelect }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const color = useMemo(() => new THREE.Color(hex(theme.colors.accentPrimary)), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const target = hovered ? 1.35 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project);
        }}
      >
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? theme.emissive.nodeHover : theme.emissive.nodeIdle}
          toneMapped={false}
        />
      </mesh>

      {/* Collar ring - signals "this one is clickable" vs ambient nodes */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.46, 0.52, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.9 : 0.4}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            background: 'rgba(5,8,24,0.85)',
            border: '1px solid rgba(255,193,69,0.4)',
            color: '#FFF8E7',
            fontSize: '11px',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
            padding: '6px 10px',
            borderRadius: '2px',
            whiteSpace: 'nowrap',
            transform: 'translateY(-30px)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s',
          }}
        >
          {project.title}
        </div>
      </Html>
    </group>
  );
}
