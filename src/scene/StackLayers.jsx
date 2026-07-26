import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { theme, hex } from '../config/theme.js';
import { NeuralNode } from './NeuralNode.jsx';
import { Connection } from './Connection.jsx';
import { LAYERS } from './CameraPath.js';

const GOLD = () => new THREE.Color(hex(theme.colors.accentPrimary));
const AMBER = () => new THREE.Color(hex(theme.colors.accentSecondary));
const DEEP = () => new THREE.Color(hex(theme.colors.accentDeep));

// Deterministic pseudo-random
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/* ---------------------------------------------------------------------------
 * Shared: faint translucent disc grounding each layer
 * ------------------------------------------------------------------------ */
function LayerDisc({ y, radius = 9 }) {
  const color = useMemo(GOLD, []);
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <ringGeometry args={[radius - 0.05, radius, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <circleGeometry args={[radius, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.02} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * LAYER 0 - SURFACE / PRODUCT: floating UI fragments
 * ------------------------------------------------------------------------ */
function ProductLayer() {
  const groupRef = useRef();
  const gold = useMemo(GOLD, []);
  const deep = useMemo(DEEP, []);

  const cards = useMemo(() => {
    const r = seededRandom(11);
    // Fewer cards, pushed back and to the sides so they frame the
    // avatar as ambient "product surface" texture, not foreground clutter.
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      position: [
        (r() > 0.5 ? 1 : -1) * (5 + r() * 4),   // pushed to the sides
        1 + r() * 4,
        -6 - r() * 5,                             // pushed well back
      ],
      scale: [1 + r() * 1.2, 0.7 + r() * 0.6, 0.04],
      rotY: (r() - 0.5) * 0.6,
      floatSpeed: 0.25 + r() * 0.4,
      floatOffset: r() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const card = cards[i];
      if (card) {
        child.position.y = card.position[1] + Math.sin(clock.elapsedTime * card.floatSpeed + card.floatOffset) * 0.15;
      }
    });
  });

  return (
    <group position={[0, LAYERS.surface, 0]}>
      <group ref={groupRef}>
        {cards.map(card => (
          <mesh key={card.id} position={card.position} scale={card.scale} rotation={[0, card.rotY, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={gold}
              emissive={gold}
              emissiveIntensity={0.25}
              transparent
              opacity={0.1}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      {/* Faint wireframe outlines */}
      {cards.map(card => (
        <mesh key={`w${card.id}`} position={card.position} scale={card.scale} rotation={[0, card.rotY, 0]}>
          <boxGeometry args={[1.02, 1.02, 1.02]} />
          <meshBasicMaterial color={deep} wireframe transparent opacity={0.25} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * LAYER 1 - APPLICATION: living code - brackets, blocks, request pulses
 * ------------------------------------------------------------------------ */
function RequestPulse({ from, to, speed, offset, color }) {
  const ref = useRef();
  const a = useMemo(() => new THREE.Vector3(...from), [from]);
  const b = useMemo(() => new THREE.Vector3(...to), [to]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.elapsedTime * speed + offset) % 1;
    ref.current.position.lerpVectors(a, b, t);
    const fade = Math.sin(t * Math.PI);
    ref.current.scale.setScalar(0.5 + fade * 0.6);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function ApplicationLayer() {
  const gold = useMemo(GOLD, []);
  const amber = useMemo(AMBER, []);
  const deep = useMemo(DEEP, []);
  const cream = useMemo(() => new THREE.Color(hex('#FFF8E7')), []);

  // Function blocks the code "runs" between
  const blocks = useMemo(() => {
    const r = seededRandom(23);
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      position: [
        (r() - 0.5) * 13,
        (r() - 0.3) * 5,
        (r() - 0.5) * 8 - 1,
      ],
      w: 0.8 + r() * 1.4,
      h: 0.4 + r() * 0.5,
      rotSpeed: (r() - 0.5) * 0.15,
    }));
  }, []);

  // Request/response pulses travel between random block pairs
  const requests = useMemo(() => {
    const r = seededRandom(77);
    const reqs = [];
    for (let i = 0; i < 10; i++) {
      const a = blocks[Math.floor(r() * blocks.length)];
      const b = blocks[Math.floor(r() * blocks.length)];
      if (a && b && a.id !== b.id) {
        reqs.push({
          id: i,
          from: a.position,
          to: b.position,
          speed: 0.2 + r() * 0.3,
          offset: r(),
          color: r() > 0.5 ? cream : amber,
        });
      }
    }
    return reqs;
  }, [blocks, cream, amber]);

  // Floating bracket glyphs
  const brackets = useMemo(() => {
    const r = seededRandom(91);
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      position: [(r() - 0.5) * 14, (r() - 0.3) * 6, (r() - 0.5) * 9 - 1],
      char: ['{', '}', '<', '>', '/', '[', ']'][Math.floor(r() * 7)],
      size: 0.3 + r() * 0.4,
      floatSpeed: 0.3 + r() * 0.5,
      floatOffset: r() * Math.PI * 2,
    }));
  }, []);

  const blocksRef = useRef();
  const bracketsRef = useRef();
  useFrame(({ clock }) => {
    if (blocksRef.current) {
      blocksRef.current.children.forEach((child, i) => {
        const b = blocks[i];
        if (b) child.rotation.y = clock.elapsedTime * b.rotSpeed;
      });
    }
    if (bracketsRef.current) {
      bracketsRef.current.children.forEach((child, i) => {
        const b = brackets[i];
        if (b) child.position.y = b.position[1] + Math.sin(clock.elapsedTime * b.floatSpeed + b.floatOffset) * 0.3;
      });
    }
  });

  return (
    <group position={[0, LAYERS.application, 0]}>
      <LayerDisc y={0} radius={8.5} />

      {/* Function blocks (flat panels like code windows) */}
      <group ref={blocksRef}>
        {blocks.map(b => (
          <group key={b.id} position={b.position}>
            <mesh>
              <boxGeometry args={[b.w, b.h, 0.06]} />
              <meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={0.4} transparent opacity={0.18} toneMapped={false} />
            </mesh>
            <mesh>
              <boxGeometry args={[b.w + 0.02, b.h + 0.02, 0.05]} />
              <meshBasicMaterial color={deep} wireframe transparent opacity={0.6} toneMapped={false} />
            </mesh>
            {/* Code lines inside the block */}
            <mesh position={[0, b.h * 0.2, 0.04]}>
              <boxGeometry args={[b.w * 0.6, 0.03, 0.01]} />
              <meshBasicMaterial color={amber} transparent opacity={0.7} toneMapped={false} />
            </mesh>
            <mesh position={[-b.w * 0.1, 0, 0.04]}>
              <boxGeometry args={[b.w * 0.4, 0.03, 0.01]} />
              <meshBasicMaterial color={amber} transparent opacity={0.5} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Bracket glyphs */}
      <group ref={bracketsRef}>
        {brackets.map(b => (
          <Text
            key={b.id}
            position={b.position}
            fontSize={b.size}
            color={hex(theme.colors.accentPrimary)}
            anchorX="center"
            anchorY="middle"
          >
            {b.char}
          </Text>
        ))}
      </group>

      {/* Request/response pulses */}
      {requests.map(req => (
        <RequestPulse key={req.id} {...req} />
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * LAYER 2 - SERVER: glowing racks
 * ------------------------------------------------------------------------ */
function ServerRack({ position, slots = 6, seed = 1 }) {
  const gold = useMemo(GOLD, []);
  const amber = useMemo(AMBER, []);
  const lightsRef = useRef([]);
  const rng = useMemo(() => seededRandom(seed), [seed]);
  const blinkSpeeds = useMemo(() => Array.from({ length: slots }, () => 0.5 + rng() * 3), [slots, rng]);

  useFrame(({ clock }) => {
    lightsRef.current.forEach((mat, i) => {
      if (mat) {
        mat.opacity = 0.4 + Math.abs(Math.sin(clock.elapsedTime * blinkSpeeds[i] + i)) * 0.6;
      }
    });
  });

  const rackH = slots * 0.4 + 0.3;

  return (
    <group position={position}>
      {/* Rack frame */}
      <mesh position={[0, rackH / 2, 0]}>
        <boxGeometry args={[1.4, rackH, 1]} />
        <meshStandardMaterial
          color={hex(theme.colors.bgLight)}
          emissive={gold}
          emissiveIntensity={0.05}
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh position={[0, rackH / 2, 0]}>
        <boxGeometry args={[1.45, rackH + 0.05, 1.05]} />
        <meshBasicMaterial color={gold} wireframe transparent opacity={0.3} toneMapped={false} />
      </mesh>
      {/* Slot lights */}
      {Array.from({ length: slots }, (_, i) => (
        <mesh key={i} position={[0.45, 0.35 + i * 0.4, 0.51]}>
          <planeGeometry args={[0.35, 0.08]} />
          <meshBasicMaterial
            ref={el => (lightsRef.current[i] = el)}
            color={i % 3 === 0 ? amber : gold}
            transparent
            opacity={0.7}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function ServerLayer() {
  const racks = useMemo(() => {
    const r = seededRandom(31);
    return Array.from({ length: 7 }, (_, i) => ({
      id: i,
      position: [
        -6 + i * 2 + (r() - 0.5),
        -0.5,
        (r() - 0.5) * 6 - 1,
      ],
      slots: 4 + Math.floor(r() * 4),
      seed: i * 13 + 5,
    }));
  }, []);

  return (
    <group position={[0, LAYERS.server, 0]}>
      <LayerDisc y={0} radius={9} />
      {racks.map(rack => (
        <ServerRack key={rack.id} position={rack.position} slots={rack.slots} seed={rack.seed} />
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * LAYER 3 - NETWORK: topology grid (reuses NeuralNode + Connection)
 * ------------------------------------------------------------------------ */
function NetworkLayer() {
  const { nodes, links } = useMemo(() => {
    const r = seededRandom(47);
    const n = [];
    // Semi-flat grid with jitter - reads as topology, not brain
    for (let x = -3; x <= 3; x++) {
      for (let z = -2; z <= 2; z++) {
        if (r() > 0.25) {
          n.push({
            id: `${x}-${z}`,
            position: [
              x * 2.2 + (r() - 0.5) * 0.8,
              (r() - 0.3) * 1.5,
              z * 2.2 + (r() - 0.5) * 0.8 - 1,
            ],
            size: 0.1 + r() * 0.1,
            pulseSpeed: 0.5 + r() * 1,
            pulseOffset: r() * Math.PI * 2,
          });
        }
      }
    }
    // Connect neighbors
    const l = [];
    const maxDist = 3.2;
    for (let i = 0; i < n.length; i++) {
      for (let j = i + 1; j < n.length; j++) {
        const dx = n[i].position[0] - n[j].position[0];
        const dy = n[i].position[1] - n[j].position[1];
        const dz = n[i].position[2] - n[j].position[2];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < maxDist && r() > 0.4) {
          l.push({
            id: `${n[i].id}-${n[j].id}`,
            from: n[i].position,
            to: n[j].position,
            flowSpeed: 0.3 + r() * 0.6,
            offset: r() * Math.PI * 2,
          });
        }
      }
    }
    return { nodes: n, links: l };
  }, []);

  return (
    <group position={[0, LAYERS.network, 0]}>
      <LayerDisc y={0} radius={9} />
      {nodes.map(node => (
        <NeuralNode key={node.id} {...node} />
      ))}
      {links.map(link => (
        <Connection key={link.id} {...link} />
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * LAYER 4 - BARE METAL: circuit floor
 * ------------------------------------------------------------------------ */
function MetalLayer() {
  const gold = useMemo(GOLD, []);
  const amber = useMemo(AMBER, []);

  // Circuit traces: L-shaped glowing paths on the floor
  const traces = useMemo(() => {
    const r = seededRandom(61);
    const t = [];
    for (let i = 0; i < 16; i++) {
      const x = (r() - 0.5) * 14;
      const z = (r() - 0.5) * 12;
      const len = 1 + r() * 3;
      const horizontal = r() > 0.5;
      t.push({
        id: i,
        position: [x, -0.45, z],
        scale: horizontal ? [len, 0.03, 0.06] : [0.06, 0.03, len],
        pulseSpeed: 0.4 + r() * 1.2,
        pulseOffset: r() * Math.PI * 2,
      });
    }
    return t;
  }, []);

  const traceMats = useRef([]);
  useFrame(({ clock }) => {
    traceMats.current.forEach((mat, i) => {
      if (mat) {
        const tr = traces[i];
        mat.opacity = 0.3 + Math.abs(Math.sin(clock.elapsedTime * tr.pulseSpeed + tr.pulseOffset)) * 0.5;
      }
    });
  });

  return (
    <group position={[0, LAYERS.metal, 0]}>
      {/* Grid floor */}
      <gridHelper
        args={[24, 24, hex(theme.colors.accentDeep), hex(theme.colors.bgLight)]}
        position={[0, -0.5, 0]}
      />
      {/* Circuit traces */}
      {traces.map((tr, i) => (
        <mesh key={tr.id} position={tr.position} scale={tr.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            ref={el => (traceMats.current[i] = el)}
            color={i % 4 === 0 ? amber : gold}
            transparent
            opacity={0.5}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* Central core - the destination */}
      <mesh position={[0, 0.4, -1]}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color={gold}
          emissive={gold}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * Export the full stack
 * ------------------------------------------------------------------------ */
export function StackLayers() {
  return (
    <group>
      <ProductLayer />
      <ApplicationLayer />
      <ServerLayer />
      <NetworkLayer />
      <MetalLayer />
    </group>
  );
}
