import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { theme, hex } from '../config/theme.js';
import { content } from '../config/content.js';
import { Connection } from './Connection.jsx';
import { playHover, playClick } from '../audio/soundEngine.js';
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
    <group position={[0, y, 0]} raycast={() => null}>
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
 * LAYER 0 - SURFACE / PRODUCT: floating glass UI panels with metallic trims
 * ------------------------------------------------------------------------ */
function GrowthIcon({ color, accent }) {
  const heights = [0.12, 0.22, 0.34, 0.5];
  return (
    <group position={[0, -0.05, 0.05]}>
      {heights.map((h, i) => (
        <mesh key={i} position={[-0.24 + i * 0.16, h / 2 - 0.05, 0]}>
          <boxGeometry args={[0.1, h, 0.02]} />
          <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.9} />
        </mesh>
      ))}
      <mesh position={[0.36, 0.3, 0]} rotation={[0, 0, -0.6]}>
        <coneGeometry args={[0.05, 0.14, 4]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
    </group>
  );
}

function AdIcon({ color, accent }) {
  return (
    <group position={[0, 0, 0.05]}>
      <mesh position={[-0.15, 0.06, 0]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color={color} wireframe toneMapped={false} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0.16, 0.16, 0]}>
        <boxGeometry args={[0.2, 0.03, 0.01]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.16, 0.08, 0]}>
        <boxGeometry args={[0.14, 0.03, 0.01]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.45} />
      </mesh>
      <mesh position={[0.02, -0.14, 0.01]} rotation={[0, 0, Math.PI / 8]}>
        <octahedronGeometry args={[0.075, 0]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
    </group>
  );
}

function OpsIcon({ color }) {
  const teeth = 8;
  return (
    <group position={[0, 0, 0.05]}>
      <mesh>
        <torusGeometry args={[0.16, 0.045, 12, 24]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.85} />
      </mesh>
      {Array.from({ length: teeth }, (_, i) => {
        const a = (i / teeth) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.22, Math.sin(a) * 0.22, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.07, 0.05, 0.02]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function TechIcon({ color }) {
  const offsets = [-0.08, 0, 0.08];
  return (
    <group position={[0, 0, 0.05]}>
      <mesh>
        <boxGeometry args={[0.26, 0.26, 0.02]} />
        <meshBasicMaterial color={color} wireframe toneMapped={false} />
      </mesh>
      {offsets.map((o, j) => (
        <group key={j}>
          <mesh position={[o, 0.17, 0]}><boxGeometry args={[0.02, 0.06, 0.01]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
          <mesh position={[o, -0.17, 0]}><boxGeometry args={[0.02, 0.06, 0.01]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
        </group>
      ))}
    </group>
  );
}

function SecurityIcon({ color, accent }) {
  return (
    <group position={[0, 0, 0.05]}>
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.26, 0.26, 0.02]} />
        <meshBasicMaterial color={color} wireframe toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.09, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.13, 0.15, 3]} />
        <meshBasicMaterial color={color} wireframe toneMapped={false} />
      </mesh>
    </group>
  );
}

const CARD_ICONS = {
  growth: GrowthIcon,
  ad: AdIcon,
  ops: OpsIcon,
  tech: TechIcon,
  security: SecurityIcon,
};

function ProductLayer({ gpuTier = 3 }) {
  const low = gpuTier <= 1;
  const groupRef = useRef();
  const gold = useMemo(GOLD, []);
  const amber = useMemo(AMBER, []);

  const cards = useMemo(() => {
    const r = seededRandom(11);
    const types = ['growth', 'ad', 'ops', 'tech', 'security'];
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      type: types[i],
      position: [
        (r() > 0.5 ? 1 : -1) * (5 + r() * 4),
        1 + r() * 4,
        -6 - r() * 5,
      ],
      scale: [1.2 + r() * 1.2, 0.8 + r() * 0.6, 0.05],
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
    <group position={[0, LAYERS.surface, 0]} raycast={() => null}>
      <group ref={groupRef}>
        {cards.map(card => {
          const Icon = CARD_ICONS[card.type];
          return (
            <group key={card.id} position={card.position} rotation={[0, card.rotY, 0]}>
              {/* Glass PBR Panel */}
              <mesh scale={card.scale}>
                <boxGeometry args={[1, 1, 1]} />
                {low ? (
                  <meshStandardMaterial
                    color={hex('#0F172A')}
                    metalness={0.3}
                    roughness={0.3}
                    transparent
                    opacity={0.7}
                  />
                ) : (
                  <meshPhysicalMaterial
                    color={hex('#0F172A')}
                    metalness={0.1}
                    roughness={0.1}
                    transmission={0.85}
                    thickness={0.5}
                    clearcoat={1.0}
                    clearcoatRoughness={0.1}
                    transparent
                    opacity={0.8}
                  />
                )}
              </mesh>
              {/* Sleek Rim Border */}
              <mesh scale={[card.scale[0] * 1.02, card.scale[1] * 1.02, card.scale[2] * 1.02]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                  color={gold}
                  metalness={0.8}
                  roughness={0.2}
                  wireframe
                  transparent
                  opacity={0.35}
                />
              </mesh>
              <Icon color={gold} accent={amber} />
            </group>
          );
        })}
      </group>
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * LAYER 1 - APPLICATION: living code blocks & PBR acrylic panels
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
      <sphereGeometry args={[0.08, 12, 12]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function ApplicationLayer() {
  const gold = useMemo(GOLD, []);
  const amber = useMemo(AMBER, []);
  const cyan = useMemo(() => new THREE.Color(hex('#38BDF8')), []);

  const blocks = useMemo(() => {
    const r = seededRandom(23);
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      position: [
        (r() - 0.5) * 13,
        (r() - 0.3) * 5,
        (r() - 0.5) * 8 - 1,
      ],
      w: 0.9 + r() * 1.4,
      h: 0.5 + r() * 0.5,
      rotSpeed: (r() - 0.5) * 0.15,
    }));
  }, []);

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
          color: r() > 0.5 ? cyan : amber,
        });
      }
    }
    return reqs;
  }, [blocks, cyan, amber]);

  const brackets = useMemo(() => {
    const r = seededRandom(91);
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      position: [(r() - 0.5) * 14, (r() - 0.3) * 6, (r() - 0.5) * 9 - 1],
      char: ['{', '}', '<', '>', '/', '[', ']'][Math.floor(r() * 7)],
      size: 0.35 + r() * 0.4,
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
    <group position={[0, LAYERS.application, 0]} raycast={() => null}>
      <LayerDisc y={0} radius={8.5} />

      {/* Function blocks */}
      <group ref={blocksRef}>
        {blocks.map(b => (
          <group key={b.id} position={b.position}>
            {/* Acrylic dark frame */}
            <mesh>
              <boxGeometry args={[b.w, b.h, 0.08]} />
              <meshPhysicalMaterial
                color={hex('#090D1F')}
                metalness={0.2}
                roughness={0.2}
                clearcoat={0.8}
                transparent
                opacity={0.85}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[b.w + 0.02, b.h + 0.02, 0.07]} />
              <meshStandardMaterial color={cyan} wireframe transparent opacity={0.35} />
            </mesh>
            {/* Code lines */}
            <mesh position={[0, b.h * 0.2, 0.05]}>
              <boxGeometry args={[b.w * 0.6, 0.03, 0.01]} />
              <meshBasicMaterial color={amber} transparent opacity={0.8} toneMapped={false} />
            </mesh>
            <mesh position={[-b.w * 0.1, 0, 0.05]}>
              <boxGeometry args={[b.w * 0.4, 0.03, 0.01]} />
              <meshBasicMaterial color={cyan} transparent opacity={0.6} toneMapped={false} />
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
            color={hex('#38BDF8')}
            anchorX="center"
            anchorY="middle"
          >
            {b.char}
          </Text>
        ))}
      </group>

      {/* Request pulses */}
      {requests.map(req => (
        <RequestPulse key={req.id} {...req} />
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * LAYER 2 - SERVER: One big realistic server rack cabinet.
 * Each project is a rack unit (switch) stacked vertically.
 * All front panels face the camera at the same z — zero raycasting issues.
 * ------------------------------------------------------------------------ */

/* --- Individual clickable project rack unit (switch/server) --- */
function ProjectUnit({ yPos, project, index, onSelect }) {
  const gold = useMemo(GOLD, []);
  const amber = useMemo(AMBER, []);
  const green = useMemo(() => new THREE.Color(hex('#10B981')), []);
  const cyan = useMemo(() => new THREE.Color(hex('#06B6D4')), []);
  const [hovered, setHovered] = useState(false);
  const ledRefs = useRef([]);
  const UNIT_W = 3.6;
  const UNIT_H = 0.55;

  // LED colors per project slot
  const ledColors = useMemo(() => [green, amber, cyan, green], [green, amber, cyan]);

  useFrame(({ clock }) => {
    ledRefs.current.forEach((mat, i) => {
      if (mat) {
        mat.opacity = 0.5 + Math.abs(Math.sin(clock.elapsedTime * (1.2 + i * 0.7) + index * 2 + i)) * 0.5;
      }
    });
  });

  return (
    <group position={[0, yPos, 0]} raycast={() => null}>
      {/* SINGLE front-panel mesh */}
      <mesh position={[0, 0, 0.58]} raycast={() => null}>
        <boxGeometry args={[UNIT_W - 0.2, UNIT_H, 0.16]} />
        <meshPhysicalMaterial
          color={hovered ? hex('#1a2744') : hex('#0d1528')}
          metalness={0.88}
          roughness={0.15}
          clearcoat={0.6}
          emissive={gold}
          emissiveIntensity={hovered ? 0.25 : 0.02}
        />
      </mesh>

      {/* Subtle ambient light on hover */}
      <pointLight position={[0, 0, 1.5]} color={gold} intensity={hovered ? 1.2 : 0} distance={3} />

      {/* Left handle/latch */}
      <mesh position={[-UNIT_W / 2 + 0.22, 0, 0.62]} raycast={() => null}>
        <boxGeometry args={[0.06, UNIT_H * 0.7, 0.04]} />
        <meshStandardMaterial
          color={hovered ? gold : hex('#94A3B8')}
          metalness={0.95}
          roughness={0.1}
          emissive={gold}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Right handle/latch */}
      <mesh position={[UNIT_W / 2 - 0.22, 0, 0.62]} raycast={() => null}>
        <boxGeometry args={[0.06, UNIT_H * 0.7, 0.04]} />
        <meshStandardMaterial
          color={hovered ? gold : hex('#94A3B8')}
          metalness={0.95}
          roughness={0.1}
          emissive={gold}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      {/* LED status lights — blinking */}
      {ledColors.map((color, j) => (
        <mesh key={j} position={[UNIT_W / 2 - 0.55 - j * 0.15, 0.12, 0.62]} raycast={() => null}>
          <boxGeometry args={[0.07, 0.04, 0.01]} />
          <meshBasicMaterial
            ref={el => (ledRefs.current[j] = el)}
            color={color}
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Horizontal ventilation lines */}
      {[-0.12, 0, 0.12].map((yOff, k) => (
        <mesh key={k} position={[0.3, yOff, 0.62]} raycast={() => null}>
          <boxGeometry args={[0.8, 0.015, 0.005]} />
          <meshBasicMaterial color={hex('#1E293B')} toneMapped={false} />
        </mesh>
      ))}

      {/* Interactive 2D HTML text label button — carries hover and click */}
      <Html center position={[0, 0, 0.7]} distanceFactor={6}>
        <button
          type="button"
          onMouseEnter={() => { setHovered(true); playHover(); }}
          onMouseLeave={() => { setHovered(false); }}
          onClick={(e) => { e.stopPropagation(); playClick(); onSelect(project); }}
          className={`cursor-pointer px-4 py-2 rounded-xl border text-[11px] font-mono whitespace-nowrap transition-all duration-200 shadow-xl ${
            hovered
              ? 'bg-[#0A0E24] border-amber-400 text-white shadow-[0_0_24px_rgba(255,193,69,0.6)] scale-105 ring-2 ring-amber-400/50'
              : 'bg-[#0A0E24]/90 border-amber-400/40 text-amber-300 hover:border-amber-400 hover:text-white'
          }`}
        >
          <span className="text-emerald-400 mr-2 animate-pulse">●</span>
          <span className="font-bold tracking-wide">{project.title}</span>
          <span className="text-white/30 mx-2">|</span>
          <span className="text-amber-200/80 text-[10px] uppercase tracking-wider">{project.role}</span>
          <span className="ml-2.5 text-amber-400 text-[10px] font-bold">&rarr;</span>
        </button>
      </Html>
    </group>
  );
}

/* --- Decorative patch panel (non-interactive top section) --- */
function PatchPanel({ yPos, width }) {
  const gold = useMemo(GOLD, []);
  const colors = useMemo(() => [
    new THREE.Color(hex('#FACC15')), // yellow
    new THREE.Color(hex('#38BDF8')), // blue
    new THREE.Color(hex('#F97316')), // orange
    new THREE.Color(hex('#10B981')), // green
    new THREE.Color(hex('#EC4899')), // pink
  ], []);

  // Ethernet port grid
  const ports = useMemo(() => {
    const p = [];
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 12; col++) {
        p.push({
          x: -width / 2 + 0.45 + col * 0.24,
          y: 0.08 - row * 0.18,
          color: colors[Math.floor(col / 2.5) % colors.length],
        });
      }
    }
    return p;
  }, [width, colors]);

  return (
    <group position={[0, yPos, 0]}>
      {/* Patch panel faceplate */}
      <mesh position={[0, 0, 0.52]} raycast={() => null}>
        <boxGeometry args={[width - 0.2, 0.45, 0.1]} />
        <meshPhysicalMaterial
          color={hex('#0F172A')}
          metalness={0.9}
          roughness={0.2}
          clearcoat={0.5}
        />
      </mesh>

      {/* Ports */}
      {ports.map((port, i) => (
        <mesh key={i} position={[port.x, yPos === undefined ? port.y : port.y, 0.58]} raycast={() => null}>
          <boxGeometry args={[0.12, 0.08, 0.02]} />
          <meshBasicMaterial color={port.color} toneMapped={false} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* --- Cable bundles running down the side of the rack --- */
function CableBundles({ cabinetH, cabinetW, projectCount }) {
  const colors = useMemo(() => [
    hex('#FACC15'), // yellow
    hex('#38BDF8'), // blue
    hex('#F97316'), // orange
    hex('#10B981'), // green
    hex('#A78BFA'), // purple
  ], []);

  const cables = useMemo(() => {
    return Array.from({ length: projectCount }, (_, i) => {
      const yStart = cabinetH / 2 - 0.5; // top patch panel
      const yEnd = cabinetH / 2 - 1.2 - i * 0.75; // each project unit
      const xSide = cabinetW / 2 + 0.15;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(xSide, yStart, 0.45),
        new THREE.Vector3(xSide + 0.15 + i * 0.04, yStart - 0.2, 0.5),
        new THREE.Vector3(xSide + 0.2 + i * 0.04, yEnd + 0.2, 0.5),
        new THREE.Vector3(xSide, yEnd, 0.45),
      ], false, 'catmullrom', 0.5);
      return { curve, color: colors[i % colors.length] };
    });
  }, [cabinetH, cabinetW, projectCount, colors]);

  return (
    <group>
      {cables.map((cable, i) => {
        const geo = new THREE.TubeGeometry(cable.curve, 20, 0.025, 6, false);
        return (
          <mesh key={i} geometry={geo} raycast={() => null}>
            <meshStandardMaterial
              color={cable.color}
              metalness={0.3}
              roughness={0.6}
              emissive={cable.color}
              emissiveIntensity={0.15}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* --- Full Server Layer: one big rack cabinet --- */
function ServerLayer({ onSelectProject }) {
  const gold = useMemo(GOLD, []);
  const projects = content.projects;
  const CABINET_W = 3.8;
  const CABINET_H = projects.length * 0.75 + 1.8; // ~5.55
  const CABINET_D = 1.1;

  return (
    <group position={[0, LAYERS.server, 0]}>
      <LayerDisc y={0} radius={9} />

      {/* Sleek Horizontal 3D Action Callout */}
      <Html position={[0, CABINET_H / 2 + 1.5, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div className="glass-panel px-5 py-2 rounded-full border border-amber-400/40 text-amber-300 font-mono text-[10px] tracking-widest uppercase shadow-[0_0_18px_rgba(255,193,69,0.35)] flex flex-row items-center gap-3 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span>CLICK ANY RACK UNIT TO INSPECT PROJECT &darr;</span>
        </div>
      </Html>

      {/* ==================== THE CABINET ==================== */}
      <group position={[0, CABINET_H / 2 - 1.5, -1]}>

        {/* Back panel — dark brushed aluminum */}
        <mesh position={[0, 0, 0]} raycast={() => null}>
          <boxGeometry args={[CABINET_W, CABINET_H, CABINET_D]} />
          <meshPhysicalMaterial
            color={hex('#070B19')}
            metalness={0.92}
            roughness={0.18}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
          />
        </mesh>

        {/* 4 chrome corner posts */}
        {[
          [-CABINET_W / 2, CABINET_D / 2],
          [CABINET_W / 2, CABINET_D / 2],
          [-CABINET_W / 2, -CABINET_D / 2],
          [CABINET_W / 2, -CABINET_D / 2],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0, z]} raycast={() => null}>
            <cylinderGeometry args={[0.04, 0.04, CABINET_H, 12]} />
            <meshStandardMaterial color={hex('#94A3B8')} metalness={0.98} roughness={0.08} />
          </mesh>
        ))}

        {/* Vertical mounting rails (front face) */}
        {[-CABINET_W / 2 + 0.12, CABINET_W / 2 - 0.12].map((x, i) => (
          <mesh key={`rail-${i}`} position={[x, 0, CABINET_D / 2 + 0.01]} raycast={() => null}>
            <boxGeometry args={[0.06, CABINET_H - 0.1, 0.02]} />
            <meshStandardMaterial
              color={gold}
              metalness={0.95}
              roughness={0.1}
              emissive={gold}
              emissiveIntensity={0.05}
            />
          </mesh>
        ))}

        {/* Wireframe overlay for that server-rack edge aesthetic */}
        <mesh position={[0, 0, 0]} raycast={() => null}>
          <boxGeometry args={[CABINET_W + 0.04, CABINET_H + 0.04, CABINET_D + 0.04]} />
          <meshBasicMaterial color={gold} wireframe transparent opacity={0.12} toneMapped={false} />
        </mesh>

        {/* ---- Patch Panel at top ---- */}
        <PatchPanel yPos={CABINET_H / 2 - 0.4} width={CABINET_W} />

        {/* ---- Project Rack Units — stacked vertically ---- */}
        {projects.map((project, i) => (
          <ProjectUnit
            key={project.id}
            yPos={CABINET_H / 2 - 1.2 - i * 0.75}
            project={project}
            index={i}
            onSelect={onSelectProject}
          />
        ))}

        {/* ---- Cable bundles on the right side ---- */}
        <CableBundles cabinetH={CABINET_H} cabinetW={CABINET_W} projectCount={projects.length} />

        {/* ---- Bottom decorative blank panel ---- */}
        <mesh position={[0, -CABINET_H / 2 + 0.25, 0.52]} raycast={() => null}>
          <boxGeometry args={[CABINET_W - 0.2, 0.35, 0.1]} />
          <meshPhysicalMaterial
            color={hex('#0B1120')}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}


/* ---------------------------------------------------------------------------
 * LAYER 3 - NETWORK: skills constellation
 * ------------------------------------------------------------------------ */
function SkillNode({ position, size, pulseSpeed, pulseOffset, name, gpuTier = 3 }) {
  const outerMeshRef = useRef();
  const innerMeshRef = useRef();
  const materialRef = useRef();
  const hoverScaleRef = useRef(1);
  const [hovered, setHovered] = useState(false);
  const color = useMemo(() => new THREE.Color(hex(theme.colors.accentPrimary)), []);
  const gold = useMemo(GOLD, []);
  const low = gpuTier <= 1;
  const segs = low ? 8 : 16;
  const outerSegs = low ? 10 : 20;

  useFrame(({ clock }, delta) => {
    if (!outerMeshRef.current) return;
    const t = clock.elapsedTime * pulseSpeed + pulseOffset;
    const breathe = 1 + Math.sin(t) * 0.15;
    const smoothing = 1 - Math.pow(1 - 0.18, delta * 60);
    hoverScaleRef.current += ((hovered ? 1.7 : 1) - hoverScaleRef.current) * smoothing;
    const currentScale = breathe * hoverScaleRef.current;
    outerMeshRef.current.scale.setScalar(currentScale);
    if (innerMeshRef.current) innerMeshRef.current.scale.setScalar(currentScale * 0.55);
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = hovered
        ? theme.emissive.nodeHover * 1.5
        : theme.emissive.nodeIdle + Math.sin(t) * 0.4;
    }
  });

  return (
    <group position={position} raycast={() => null}>
      {/* Inner Glowing Metallic Core */}
      <mesh ref={innerMeshRef} raycast={() => null}>
        <sphereGeometry args={[size, segs, segs]} />
        <meshStandardMaterial
          ref={materialRef}
          color={gold}
          emissive={gold}
          emissiveIntensity={theme.emissive.nodeIdle}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Outer Translucent Glass Shell */}
      <mesh ref={outerMeshRef} raycast={() => null}>
        <sphereGeometry args={[size, outerSegs, outerSegs]} />
        {low ? (
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.5}
            metalness={0.3}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.15}
          />
        ) : (
          <meshPhysicalMaterial
            color={color}
            transmission={0.88}
            thickness={0.4}
            roughness={0.05}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            ior={1.48}
            transparent
            opacity={0.85}
          />
        )}
      </mesh>

      {/* Interactive 2D HTML skill text label button — carries hover */}
      <Html center distanceFactor={8}>
        <button
          type="button"
          onMouseEnter={() => { setHovered(true); playHover(); }}
          onMouseLeave={() => { setHovered(false); }}
          className={`cursor-pointer px-3 py-1.5 rounded-lg border text-[11px] font-mono whitespace-nowrap transition-all duration-200 ${
            hovered
              ? 'bg-[#0A0E24] border-amber-400 text-white shadow-[0_0_16px_rgba(255,193,69,0.6)] scale-110'
              : 'bg-[#0A0E24]/85 border-white/20 text-slate-200 hover:border-amber-400/60'
          }`}
        >
          <span className={`mr-1.5 ${hovered ? 'text-amber-400' : 'text-slate-400'}`}>◆</span>
          {name}
        </button>
      </Html>
    </group>
  );
}

function ClusterLabel({ position, label }) {
  return (
    <Html center position={position} distanceFactor={9} style={{ pointerEvents: 'none' }}>
      <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase drop-shadow-[0_0_8px_rgba(255,193,69,0.5)] whitespace-nowrap">
        {label}
      </div>
    </Html>
  );
}

function NetworkLayer({ gpuTier = 3 }) {
  const clusters = useMemo(() => {
    // Filter out empty skill groups
    const groups = content.skills.filter(g => g.items && g.items.length > 0);
    return groups.map((group, gi) => {
      const angle = (gi / groups.length) * Math.PI * 2;
      const cx = Math.cos(angle) * 6.5;
      const cz = Math.sin(angle) * 6.5 - 1;
      const cy = (gi % 2 === 0 ? 1 : -1) * 0.8;
      const r = seededRandom(gi * 101 + 7);
      const itemCount = group.items.length;
      // Fixed radius for entire cluster — no per-node randomness ensures even spacing
      const clusterRadius = 1.5 + (itemCount > 6 ? 0.4 : 0);

      const nodes = group.items.map((name, ni) => {
        // Even angular spacing ensures every node is visible
        const a = (ni / itemCount) * Math.PI * 2;
        // Deterministic y-offset using node index instead of random to avoid vertical overlap
        const yOff = ((ni % 3) - 1) * 0.6;
        return {
          id: `${group.group}-${ni}`,
          name,
          position: [
            cx + Math.cos(a) * clusterRadius,
            cy + yOff,
            cz + Math.sin(a) * clusterRadius,
          ],
          size: 0.13,
          pulseSpeed: 0.5 + (ni * 0.15),
          pulseOffset: (ni / itemCount) * Math.PI * 2,
        };
      });

      const center = [cx, cy, cz];
      const links = nodes.map(n => ({
        id: `${n.id}-hub`,
        from: center,
        to: n.position,
        flowSpeed: 0.3 + r() * 0.5,
        offset: r() * Math.PI * 2,
      }));

      return { id: group.group, label: group.group, center, labelPosition: [cx, cy + 1.8, cz], nodes, links };
    });
  }, []);

  const backbone = useMemo(() => {
    const l = [];
    for (let i = 0; i < clusters.length; i++) {
      const a = clusters[i];
      const b = clusters[(i + 1) % clusters.length];
      l.push({ id: `backbone-${i}`, from: a.center, to: b.center, flowSpeed: 0.25, offset: i * 0.6 });
    }
    return l;
  }, [clusters]);

  return (
    <group position={[0, LAYERS.network, 0]}>
      <LayerDisc y={0} radius={9} />

      {/* Sleek Horizontal 3D Action Callout Pill above Constellation */}
      <Html position={[0, 4.5, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div className="glass-panel px-5 py-2 rounded-full border border-amber-400/40 text-amber-300 font-mono text-[10px] tracking-widest uppercase shadow-[0_0_18px_rgba(255,193,69,0.35)] flex flex-row items-center gap-3 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span>HOVER ON ANY NODE TO VIEW SKILL &darr;</span>
        </div>
      </Html>

      {clusters.map(cluster => (
        <group key={cluster.id}>
          <ClusterLabel position={cluster.labelPosition} label={cluster.label} />
          {cluster.nodes.map(node => (
            <SkillNode key={node.id} {...node} gpuTier={gpuTier} />
          ))}
          {cluster.links.map(link => (
            <Connection key={link.id} {...link} />
          ))}
        </group>
      ))}

      {backbone.map(link => (
        <Connection key={link.id} {...link} />
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * LAYER 4 - BARE METAL: circuit floor & metallic core
 * ------------------------------------------------------------------------ */
function MetalLayer({ gpuTier = 3 }) {
  const gold = useMemo(GOLD, []);
  const amber = useMemo(AMBER, []);
  const dim = gpuTier >= 3 ? 1 : 0.55;

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
        mat.opacity = (0.3 + Math.abs(Math.sin(clock.elapsedTime * tr.pulseSpeed + tr.pulseOffset)) * 0.5) * dim;
      }
    });
  });

  return (
    <group position={[0, LAYERS.metal, 0]} raycast={() => null}>
      <gridHelper
        args={[24, 24, hex(theme.colors.accentDeep), hex(theme.colors.metalDark)]}
        position={[0, -0.5, 0]}
      />
      {traces.map((tr, i) => (
        <mesh key={tr.id} position={tr.position} scale={tr.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            ref={el => (traceMats.current[i] = el)}
            color={i % 4 === 0 ? amber : gold}
            transparent
            opacity={0.5 * dim}
            toneMapped={false}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.4, -1]}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshPhysicalMaterial
          color={gold}
          emissive={gold}
          emissiveIntensity={0.8 * dim}
          metalness={0.9}
          roughness={0.15}
          clearcoat={1.0}
        />
      </mesh>
    </group>
  );
}


/* ---------------------------------------------------------------------------
 * Export the full stack
 * ------------------------------------------------------------------------ */
export function StackLayers({ onSelectProject, gpuTier = 3 }) {
  return (
    <group>
      <ProductLayer gpuTier={gpuTier} />
      <ApplicationLayer />
      <ServerLayer onSelectProject={onSelectProject} />
      <NetworkLayer gpuTier={gpuTier} />
      <MetalLayer gpuTier={gpuTier} />
    </group>
  );
}
