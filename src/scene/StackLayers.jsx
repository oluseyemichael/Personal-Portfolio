import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { content } from '../config/content.js';
import { Connection } from './Connection.jsx';
import { HeroStack } from './HeroStack.jsx';
import { ServerRack } from './ServerRack.jsx';
import { playHover } from '../audio/soundEngine.js';
import { LAYERS } from './CameraPath.js';
import { usePortrait } from './usePortrait.js';

const AMBER = '#FFC145';
const CREAM = '#FFF8E7';

// Deterministic pseudo-random so the scene is identical on every load
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Subtle ground plane that grounds a layer without competing with it. */
function Floor({ y = 0, fade = 16 }) {
  return (
    <Grid
      position={[0, y, 0]}
      args={[60, 60]}
      cellSize={0.6}
      cellThickness={0.6}
      cellColor="#1f2740"
      sectionSize={3}
      sectionThickness={1}
      sectionColor="#5b4720"
      fadeDistance={fade}
      fadeStrength={1.6}
      infiniteGrid
    />
  );
}

/* ---------------------------------------------------------------------------
 * LAYER 1 - APPLICATION: a handful of service panels, calmly drifting
 * ------------------------------------------------------------------------ */
function ServicePanel({ position, w, h, rotY, seed, floatSpeed }) {
  const ref = useRef();
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, 0.06)), [w, h]);
  const lines = useMemo(() => {
    const r = seededRandom(seed);
    return Array.from({ length: 4 }, (_, i) => ({
      width: (0.25 + r() * 0.5) * (w - 0.3),
      indent: i % 2 === 1 ? 0.12 : 0,
      hot: i === 0,
    }));
  }, [seed, w]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * floatSpeed + seed) * 0.12;
  });

  return (
    <group ref={ref} position={position} rotation={[0, rotY, 0]}>
      <mesh>
        <boxGeometry args={[w, h, 0.06]} />
        <meshStandardMaterial color="#141a2b" metalness={0.5} roughness={0.4} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={AMBER} transparent opacity={0.35} toneMapped={false} />
      </lineSegments>
      {lines.map((l, i) => (
        <mesh key={i} position={[-w / 2 + 0.15 + l.indent + l.width / 2, h / 2 - 0.2 - i * 0.14, 0.035]}>
          <boxGeometry args={[l.width, 0.035, 0.005]} />
          <meshBasicMaterial color={l.hot ? AMBER : '#5a6580'} transparent opacity={l.hot ? 0.95 : 0.6} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function ApplicationLayer() {
  const portrait = usePortrait();
  const panels = useMemo(() => {
    const r = seededRandom(23);
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      // Landscape: panels fill the right half. Portrait: a tight, centred column.
      position: portrait
        ? [(r() - 0.5) * 2.4, 2.6 - i * 0.95 + (r() - 0.5) * 0.3, -1.5 + r() * 1.5]
        : [1.2 + r() * 6.5, (r() - 0.5) * 5, -3.5 + r() * 4],
      w: portrait ? 1.6 + r() * 0.6 : 1.5 + r() * 1.2,
      h: portrait ? 0.7 + r() * 0.2 : 0.8 + r() * 0.5,
      rotY: -0.35 + r() * 0.3,
      seed: i * 7 + 3,
      floatSpeed: 0.3 + r() * 0.3,
    }));
  }, [portrait]);

  const links = useMemo(
    () => [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]].map(([a, b], i) => ({
      id: i,
      from: panels[a].position,
      to: panels[b].position,
      flowSpeed: 0.25 + i * 0.05,
      offset: i * 0.7,
    })),
    [panels],
  );

  return (
    <group position={[0, LAYERS.application, 0]}>
      {panels.map((p) => <ServicePanel key={p.id} {...p} />)}
      {links.map((l) => <Connection key={l.id} {...l} />)}
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * LAYER 3 - NETWORK: skills constellation. Names appear on hover.
 * ------------------------------------------------------------------------ */
function SkillNode({ position, size, name, portrait, labelSize }) {
  const core = useRef();
  const scale = useRef(1);
  const hideTimer = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Touch has no hover: a tap shows the name for a couple of seconds.
  const onTap = (e) => {
    e.stopPropagation();
    setHovered(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setHovered(false), 2200);
  };
  useEffect(() => () => clearTimeout(hideTimer.current), []);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : '';
    return () => { document.body.style.cursor = ''; };
  }, [hovered]);

  useFrame((_, delta) => {
    scale.current += ((hovered ? 1.8 : 1) - scale.current) * (1 - Math.exp(-delta * 14));
    if (core.current) core.current.scale.setScalar(scale.current);
  });

  return (
    <group position={position}>
      <mesh ref={core}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={AMBER}
          emissive={AMBER}
          emissiveIntensity={hovered ? 1.5 : 0.55}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      {/* generous invisible hit area so nodes are easy to hover */}
      <mesh
        onPointerOver={(e) => {
          if (portrait) return;
          e.stopPropagation();
          setHovered(true);
          playHover();
        }}
        onPointerOut={() => { if (!portrait) setHovered(false); }}
        onClick={portrait ? onTap : undefined}
      >
        <sphereGeometry args={[size * (portrait ? 9 : 3.2), 8, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {hovered && (
        <Billboard position={[0, size * 3, 0]}>
          <Text
            fontSize={labelSize}
            color={CREAM}
            anchorY="bottom"
            outlineWidth={0.018}
            outlineColor="#050818"
          >
            {name}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

function NetworkLayer() {
  const portrait = usePortrait();
  const clusterLabelSize = portrait ? 0.5 : 0.34;
  const nodeLabelSize = portrait ? 0.75 : 0.4;
  const clusters = useMemo(() => {
    const groups = content.skills.filter((g) => g.items && g.items.length > 0);
    return groups.map((group, gi) => {
      const angle = (gi / groups.length) * Math.PI * 2;
      const cx = Math.cos(angle) * 6.5;
      const cz = Math.sin(angle) * 6.5 - 1;
      const cy = (gi % 2 === 0 ? 1 : -1) * 0.8;
      const r = seededRandom(gi * 101 + 7);
      const count = group.items.length;
      const radius = 1.5 + (count > 6 ? 0.4 : 0);
      const nodes = group.items.map((name, ni) => {
        const a = (ni / count) * Math.PI * 2;
        return {
          id: `${group.group}-${ni}`,
          name,
          position: [cx + Math.cos(a) * radius, cy + ((ni % 3) - 1) * 0.6, cz + Math.sin(a) * radius],
          size: 0.12,
        };
      });
      const center = [cx, cy, cz];
      const links = nodes.map((n) => ({
        id: `${n.id}-hub`,
        from: center,
        to: n.position,
        flowSpeed: 0.3 + r() * 0.4,
        offset: r() * Math.PI * 2,
      }));
      return { id: group.group, label: group.group, center, labelPosition: [cx, cy + 1.9, cz], nodes, links };
    });
  }, []);

  const backbone = useMemo(
    () => clusters.map((a, i) => ({
      id: `backbone-${i}`,
      from: a.center,
      to: clusters[(i + 1) % clusters.length].center,
      flowSpeed: 0.25,
      offset: i * 0.6,
    })),
    [clusters],
  );

  return (
    <group
      position={portrait ? [0, LAYERS.network + 0.9, -1.5] : [4.6, LAYERS.network, -4]}
      rotation={portrait ? [0.6, 0, 0] : [0, 0, 0]}
      scale={portrait ? 0.235 : 0.5}
    >
      {clusters.map((cluster) => (
        <group key={cluster.id}>
          <Billboard position={cluster.labelPosition}>
            <Text
              fontSize={clusterLabelSize}
              letterSpacing={0.14}
              color={AMBER}
              anchorY="middle"
              textAlign="center"
              maxWidth={portrait ? 5 : 100}
            >
              {cluster.label.toUpperCase()}
            </Text>
          </Billboard>
          {cluster.nodes.map((node) => (
            <SkillNode key={node.id} {...node} portrait={portrait} labelSize={nodeLabelSize} />
          ))}
          {cluster.links.map((link) => <Connection key={link.id} {...link} />)}
        </group>
      ))}
      {backbone.map((link) => <Connection key={link.id} {...link} />)}
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * LAYER 4 - BARE METAL: a circuit floor and one glowing core
 * ------------------------------------------------------------------------ */
function MetalLayer() {
  const traces = useMemo(() => {
    const r = seededRandom(61);
    return Array.from({ length: 14 }, (_, i) => {
      const horizontal = r() > 0.5;
      const len = 1 + r() * 3;
      return {
        id: i,
        position: [(r() - 0.5) * 14, -0.45, (r() - 0.5) * 12],
        scale: horizontal ? [len, 0.02, 0.05] : [0.05, 0.02, len],
        speed: 0.4 + r() * 1,
        offset: r() * Math.PI * 2,
      };
    });
  }, []);

  const mats = useRef([]);
  useFrame(({ clock }) => {
    mats.current.forEach((m, i) => {
      if (m) m.opacity = 0.2 + Math.abs(Math.sin(clock.elapsedTime * traces[i].speed + traces[i].offset)) * 0.5;
    });
  });

  return (
    <group position={[0, LAYERS.metal, 0]}>
      <Floor y={-0.5} fade={18} />
      {traces.map((t, i) => (
        <mesh key={t.id} position={t.position} scale={t.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial ref={(el) => (mats.current[i] = el)} color={AMBER} transparent toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 0.4, -1]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.9} metalness={0.8} roughness={0.2} />
      </mesh>
      <pointLight position={[0, 1.2, -1]} intensity={14} distance={9} color="#FFB347" />
    </group>
  );
}

/**
 * Renders a layer only while the camera is near it. Layers are 12 units
 * apart, so everything else is off-screen or hidden in fog anyway; skipping
 * it saves GPU work and stops neighbouring layers bleeding into the frame
 * (very visible in portrait, where the field of view is wide).
 * The first few frames render everything so static baked effects
 * (the rack's contact shadow) capture their subject.
 */
function LayerGate({ y, range = 9, children }) {
  const ref = useRef();
  const frames = useRef(0);
  useFrame(({ camera }) => {
    if (!ref.current) return;
    frames.current += 1;
    ref.current.visible = frames.current < 12 || Math.abs(camera.position.y - y) < range;
  });
  return <group ref={ref}>{children}</group>;
}

/* ---------------------------------------------------------------------------
 * The full stack
 * ------------------------------------------------------------------------ */
// The rack stands to the right of centre so the left half of the screen
// is free for copy. Floor of the server layer sits 2.4 below its centre.
const RACK_POSITION = [3.1, LAYERS.server - 2.9, -0.5];

export function StackLayers({ onSelectProject, gpuTier = 3 }) {
  const portrait = usePortrait();
  const rackPosition = portrait ? [0, RACK_POSITION[1] - 0.85, RACK_POSITION[2]] : RACK_POSITION;
  return (
    <group>
      <LayerGate y={LAYERS.surface}>
        <HeroStack position={[2.9, LAYERS.surface + 1.1, 0]} />
      </LayerGate>
      <LayerGate y={LAYERS.application}>
        <ApplicationLayer />
      </LayerGate>
      <LayerGate y={LAYERS.server}>
        <group position={[0, LAYERS.server - 2.9, 0]}>
          <Floor fade={15} />
        </group>
        <ServerRack
          position={rackPosition}
          onSelectProject={onSelectProject}
          tier={gpuTier}
          scale={portrait ? 1.17 : 1.2}
          rotationY={portrait ? -0.1 : -0.2}
        />
      </LayerGate>
      <LayerGate y={LAYERS.network}>
        <NetworkLayer />
      </LayerGate>
      <LayerGate y={LAYERS.metal}>
        <MetalLayer />
      </LayerGate>
    </group>
  );
}
