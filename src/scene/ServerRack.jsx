import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, ContactShadows } from '@react-three/drei';
import { content } from '../config/content.js';
import { playHover, playClick } from '../audio/soundEngine.js';
import { usePortrait } from './usePortrait.js';

/**
 * A real 19" equipment rack. Every project is a 2U server mounted in it:
 * the title is engraved on the faceplate, and the whole unit is the click
 * target. Hovering pulls the server forward out of the rack, like sliding
 * a chassis out on its rails.
 */

const U = 0.3; // height of one rack unit
const FACE_W = 2.5;
const FRAME_W = 2.74;
const DEPTH = 1.3;
const FRONT_Z = DEPTH / 2;
const PULL = 0.18;

const AMBER = '#FFC145';
const CREAM = '#FFF8E7';
const MUTED = '#8f98ad';
const FACE = '#323c58';
const FACE_DARK = '#212840';
const VOID = '#080b14';

const pad = (n) => String(n + 1).padStart(2, '0');

function Plate({ h, color = FACE, children }) {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[FACE_W, h, 0.06]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.42} />
      {children}
    </mesh>
  );
}

function Ears({ h }) {
  return (
    <>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (FACE_W / 2 - 0.07), 0, 0.01]}>
          <mesh>
            <boxGeometry args={[0.14, h, 0.07]} />
            <meshStandardMaterial color="#2f374c" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.012, 12]} />
            <meshStandardMaterial color="#7b849b" metalness={0.9} roughness={0.25} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* ----------------------------- project server ----------------------------- */

function ProjectUnit({ y, h, project, index, onSelect }) {
  const portrait = usePortrait();
  const group = useRef();
  const strip = useRef();
  const face = useRef();
  const leds = useRef([]);
  const pull = useRef(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : '';
    return () => { document.body.style.cursor = ''; };
  }, [hovered]);

  useFrame(({ clock }, delta) => {
    const k = 1 - Math.exp(-delta * 12);
    pull.current += ((hovered ? 1 : 0) - pull.current) * k;
    if (group.current) group.current.position.z = FRONT_Z - 0.04 + pull.current * PULL;
    if (strip.current) strip.current.material.opacity = pull.current;
    if (face.current) {
      face.current.emissiveIntensity = pull.current * 0.28;
    }
    leds.current.forEach((m, i) => {
      if (m) m.opacity = 0.45 + Math.abs(Math.sin(clock.elapsedTime * (0.9 + i * 0.5) + index * 1.7)) * 0.55;
    });
  });

  const title = project.title;
  const titleSize = Math.min(0.115, 1.3 / (title.length * 0.56));

  return (
    <group
      ref={group}
      position={[0, y, FRONT_Z - 0.04]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); playHover(); }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        playClick();
        if (navigator.vibrate) navigator.vibrate(10);
        onSelect(project);
      }}
    >
      {/* chassis sliding back into the rack */}
      <mesh position={[0, 0, -0.45]}>
        <boxGeometry args={[FACE_W - 0.1, h - 0.04, 0.9]} />
        <meshStandardMaterial color={VOID} metalness={0.4} roughness={0.7} />
      </mesh>

      {/* faceplate */}
      <mesh>
        <boxGeometry args={[FACE_W, h, 0.06]} />
        <meshStandardMaterial
          ref={face}
          color={FACE}
          metalness={0.5}
          roughness={0.42}
          emissive={AMBER}
          emissiveIntensity={0}
        />
      </mesh>
      <Ears h={h} />

      {/* recessed label panel */}
      <mesh position={[-0.12, 0, 0.034]}>
        <boxGeometry args={[1.85, h - 0.14, 0.012]} />
        <meshStandardMaterial color={FACE_DARK} metalness={0.2} roughness={0.8} />
      </mesh>

      <Text
        position={[-FACE_W / 2 + 0.33, 0, 0.045]}
        fontSize={0.085}
        color="#69728a"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        {pad(index)}
      </Text>
      {portrait ? (
        <Text
          position={[-FACE_W / 2 + 0.5, 0, 0.045]}
          fontSize={0.108}
          lineHeight={1.08}
          maxWidth={1.28}
          color={hovered ? AMBER : CREAM}
          anchorX="left"
          anchorY="middle"
        >
          {title}
        </Text>
      ) : (
        <>
          <Text
            position={[-FACE_W / 2 + 0.5, 0.068, 0.045]}
            fontSize={titleSize}
            color={hovered ? AMBER : CREAM}
            anchorX="left"
            anchorY="middle"
            whiteSpace="nowrap"
          >
            {title}
          </Text>
          <Text
            position={[-FACE_W / 2 + 0.5, -0.1, 0.045]}
            fontSize={0.052}
            color={MUTED}
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.08}
            whiteSpace="nowrap"
          >
            {project.role.toUpperCase()}
          </Text>
        </>
      )}

      {/* drive bays */}
      {[0, 1, 2].map((i) => (
        <group key={i} position={[0.66 + i * 0.15, 0, 0.034]}>
          <mesh>
            <boxGeometry args={[0.115, h - 0.2, 0.012]} />
            <meshStandardMaterial color="#05070c" metalness={0.3} roughness={0.6} />
          </mesh>
          <mesh position={[0, (h - 0.2) / 2 - 0.045, 0.008]}>
            <boxGeometry args={[0.03, 0.014, 0.004]} />
            <meshBasicMaterial
              ref={(el) => (leds.current[i] = el)}
              color={i === 0 ? '#34d399' : AMBER}
              transparent
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* power LED */}
      <mesh position={[1.04, 0.07, 0.034]}>
        <boxGeometry args={[0.03, 0.03, 0.01]} />
        <meshBasicMaterial color="#34d399" toneMapped={false} />
      </mesh>

      {/* hover edge light */}
      <mesh ref={strip} position={[0, -h / 2 + 0.008, 0.035]}>
        <boxGeometry args={[FACE_W, 0.014, 0.01]} />
        <meshBasicMaterial color={AMBER} transparent opacity={0} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------ filler units ------------------------------ */

function BlankUnit({ y, h }) {
  return (
    <group position={[0, y, FRONT_Z - 0.04]}>
      <Plate h={h} color={FACE_DARK} />
      <Ears h={h} />
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} position={[-0.78 + i * 0.12, 0, 0.032]}>
          <boxGeometry args={[0.012, h * 0.55, 0.008]} />
          <meshStandardMaterial color="#06080d" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function SwitchUnit({ y, h }) {
  const leds = useRef([]);
  useFrame(({ clock }) => {
    leds.current.forEach((m, i) => {
      if (m) m.opacity = 0.25 + Math.abs(Math.sin(clock.elapsedTime * (1 + (i % 5) * 0.6) + i)) * 0.75;
    });
  });
  return (
    <group position={[0, y, FRONT_Z - 0.04]}>
      <Plate h={h} color={FACE_DARK} />
      <Ears h={h} />
      {Array.from({ length: 16 }, (_, i) => (
        <group key={i} position={[-0.88 + i * 0.118, -0.025, 0.032]}>
          <mesh>
            <boxGeometry args={[0.085, 0.07, 0.01]} />
            <meshStandardMaterial color="#05070c" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.062, 0.004]}>
            <boxGeometry args={[0.02, 0.012, 0.004]} />
            <meshBasicMaterial
              ref={(el) => (leds.current[i] = el)}
              color={i % 7 === 0 ? AMBER : '#34d399'}
              transparent
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function UpsUnit({ y, h }) {
  return (
    <group position={[0, y, FRONT_Z - 0.04]}>
      <Plate h={h} color={FACE_DARK} />
      <Ears h={h} />
      <mesh position={[-0.55, 0.12, 0.034]}>
        <boxGeometry args={[0.9, 0.3, 0.012]} />
        <meshStandardMaterial color="#05070c" roughness={0.5} />
      </mesh>
      <Text position={[-0.95, 0.15, 0.045]} fontSize={0.05} color={MUTED} anchorX="left" letterSpacing={0.1}>
        UPTIME
      </Text>
      <Text position={[-0.95, 0.07, 0.045]} fontSize={0.12} color={AMBER} anchorX="left">
        99.5%
      </Text>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[0.45, 0.28 - i * 0.07, 0.032]}>
          <boxGeometry args={[0.85, 0.012, 0.008]} />
          <meshStandardMaterial color="#06080d" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* --------------------------------- the rack -------------------------------- */

export function ServerRack({ position = [0, 0, 0], onSelectProject, tier = 3, scale = 1.2, rotationY = -0.2 }) {
  const projects = content.projects;

  const { slots, innerH, H } = useMemo(() => {
    const list = [{ type: 'switch', u: 1 }, { type: 'blank', u: 1 }];
    projects.forEach((project, index) => list.push({ type: 'project', u: 2, project, index }));
    list.push({ type: 'blank', u: 1 }, { type: 'ups', u: 3 });
    const totalU = list.reduce((s, x) => s + x.u, 0);
    const inner = totalU * U;
    let cursor = 0;
    const placed = list.map((s) => {
      const h = s.u * U - 0.03;
      const yy = inner / 2 - cursor - (s.u * U) / 2;
      cursor += s.u * U;
      return { ...s, h, y: yy };
    });
    return { slots: placed, innerH: inner, H: inner + 0.3 };
  }, [projects]);

  const metal = { metalness: 0.75, roughness: 0.38 };

  return (
    <group position={[position[0], position[1] + (H / 2 + 0.12) * scale, position[2]]} scale={scale} rotation={[0, rotationY, 0]}>
      {/* base */}
      <mesh position={[0, -H / 2 - 0.06, 0]}>
        <boxGeometry args={[FRAME_W + 0.12, 0.12, DEPTH + 0.12]} />
        <meshStandardMaterial color="#141a29" {...metal} />
      </mesh>

      {/* posts */}
      {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => (
        <mesh key={`${sx}${sz}`} position={[sx * (FRAME_W / 2 - 0.04), 0, sz * (DEPTH / 2 - 0.04)]}>
          <boxGeometry args={[0.08, H, 0.08]} />
          <meshStandardMaterial color="#1b2233" {...metal} />
        </mesh>
      )))}

      {/* top and bottom plates */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, s * (H / 2 - 0.075), 0]}>
          <boxGeometry args={[FRAME_W, 0.15, DEPTH]} />
          <meshStandardMaterial color="#141a29" {...metal} />
        </mesh>
      ))}

      {/* side + back panels */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (FRAME_W / 2 - 0.015), 0, 0]}>
          <boxGeometry args={[0.03, innerH, DEPTH - 0.1]} />
          <meshStandardMaterial color="#161d30" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0, -DEPTH / 2 + 0.03]}>
        <boxGeometry args={[FRAME_W - 0.1, innerH, 0.03]} />
        <meshStandardMaterial color={VOID} roughness={0.9} />
      </mesh>

      {/* front mounting rails */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (FACE_W / 2 + 0.06), 0, FRONT_Z - 0.08]}>
          <boxGeometry args={[0.07, innerH, 0.04]} />
          <meshStandardMaterial color="#2a3245" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* amber accent line + engraved rack label on the top plate */}
      <mesh position={[0, H / 2 - 0.004, FRONT_Z + 0.002]}>
        <boxGeometry args={[FRAME_W, 0.012, 0.012]} />
        <meshBasicMaterial color={AMBER} toneMapped={false} />
      </mesh>
      <Text
        position={[0, H / 2 - 0.08, FRONT_Z + 0.005]}
        fontSize={0.06}
        color={MUTED}
        letterSpacing={0.28}
        anchorX="center"
        anchorY="middle"
      >
        RACK 02 / SELECTED WORK
      </Text>

      {/* mounted equipment */}
      {slots.map((s, i) => {
        if (s.type === 'project') {
          return <ProjectUnit key={s.project.id} y={s.y} h={s.h} project={s.project} index={s.index} onSelect={onSelectProject} />;
        }
        if (s.type === 'switch') return <SwitchUnit key={i} y={s.y} h={s.h} />;
        if (s.type === 'ups') return <UpsUnit key={i} y={s.y} h={s.h} />;
        return <BlankUnit key={i} y={s.y} h={s.h} />;
      })}

      {/* local lighting: warm key from above-front, cool fill from the left */}
      <pointLight position={[0.8, H / 2 + 0.4, 3]} intensity={tier >= 2 ? 40 : 50} distance={14} color="#FFE2B0" />
      <pointLight position={[-3, 0.5, 2.5]} intensity={14} distance={10} color="#9db8ff" />
      <pointLight position={[3.2, 1.5, -1.5]} intensity={10} distance={8} color="#FFC145" />

      {tier >= 2 && (
        <ContactShadows
          position={[0, -H / 2 - 0.115, 0.2]}
          opacity={0.75}
          scale={8}
          blur={2.4}
          far={1.2}
          resolution={256}
          frames={1}
          color="#000000"
        />
      )}
    </group>
  );
}

