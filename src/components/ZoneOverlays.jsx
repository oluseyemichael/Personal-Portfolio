import { theme } from '../config/theme.js';
import { content } from '../config/content.js';

/**
 * Editorial UI layer. Serif display (Fraunces), restrained glow,
 * left-aligned hero, generous whitespace.
 */

function useZoneOpacity(scrollProgress, zone) {
  const { start, end } = zone;
  const fadeIn = 0.05;
  const fadeOut = 0.05;

  if (scrollProgress < start) return 0;
  if (scrollProgress > end) return 0;

  // Scroll can't go below 0 or above 1, so the very first zone is
  // already fully visible at rest (nothing to fade in from) and the
  // very last stays fully visible at rest (nothing to fade out to).
  // Only fade at boundaries actually shared with an adjacent zone.
  if (start > 0 && scrollProgress < start + fadeIn) return (scrollProgress - start) / fadeIn;
  if (end < 1 && scrollProgress > end - fadeOut) return (end - scrollProgress) / fadeOut;
  return 1;
}

// text-shadow is inherited, so setting it once on each zone's content
// wrapper darkens the ground behind every heading/paragraph/link inside
// it. Keeps text readable over bright/glowing scene elements (the
// bare-metal core especially) without needing an opaque panel, and
// without depending on how bright the 3D scene happens to be tuned -
// matters most on mobile, where the text has far less side margin and
// sits much closer to the center of the scene.
const TEXT_SHADOW = {
  textShadow: '0 1px 3px rgba(5,8,24,0.9), 0 2px 18px rgba(5,8,24,0.85), 0 6px 36px rgba(5,8,24,0.6)',
};

function Kicker({ children }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-10 h-px bg-gold-400/50" />
      <p className="font-mono text-[10px] text-gold-400/90 tracking-[0.35em] uppercase">
        {children}
      </p>
    </div>
  );
}

export function ZoneOverlays({ scrollProgress }) {
  const landingOpacity = useZoneOpacity(scrollProgress, theme.zones.landing);
  const aboutOpacity = useZoneOpacity(scrollProgress, theme.zones.about);
  const workOpacity = useZoneOpacity(scrollProgress, theme.zones.work);
  const skillsOpacity = useZoneOpacity(scrollProgress, theme.zones.skills);
  const contactOpacity = useZoneOpacity(scrollProgress, theme.zones.contact);

  return (
    <>
      {/* ============ LANDING - left-aligned editorial hero ============ */}
      <div
        className="fixed inset-0 flex items-end pointer-events-none"
        style={{ opacity: landingOpacity, transition: 'opacity 0.08s linear' }}
      >
        <div className="w-full px-8 md:px-16 pb-24 md:pb-28 max-w-5xl" style={TEXT_SHADOW}>
          <p className="font-mono text-[10px] text-cream/40 tracking-[0.35em] uppercase mb-6">
            {content.name} &nbsp;&mdash;&nbsp; {content.location}
          </p>
          <h1 className="font-display text-6xl md:text-8xl font-light text-cream leading-[0.95] mb-6">
            Every<span className="italic text-gold-400"> layer</span>.
          </h1>
          <p className="font-body text-base md:text-lg text-cream/55 max-w-md leading-relaxed">
            Infrastructure, code, and product. A descent through
            everything I&rsquo;ve built, from the surface to bare metal.
          </p>
        </div>

        {/* Scroll cue - bottom right, quiet */}
        <div className="absolute bottom-10 right-8 md:right-16 flex items-center gap-3">
          <p className="font-mono text-[10px] text-cream/35 tracking-[0.3em] uppercase">
            Scroll to descend
          </p>
          <div className="w-px h-10 bg-gradient-to-b from-gold-400/50 to-transparent" />
        </div>
      </div>

      {/* ============ ABOUT ============ */}
      <div
        className="fixed inset-0 flex items-center pointer-events-none"
        style={{ opacity: aboutOpacity, transition: 'opacity 0.08s linear' }}
      >
        <div className="px-8 md:px-16 max-w-3xl" style={TEXT_SHADOW}>
          <Kicker>Layer 01 &nbsp;/&nbsp; Application</Kicker>
          <h2 className="font-display text-4xl md:text-6xl font-light text-cream leading-tight mb-8">
            From server racks to <span className="italic text-gold-400">product strategy</span>.
          </h2>
          <p className="font-body text-base md:text-lg text-cream/60 leading-relaxed max-w-xl">
            {content.bio.body}
          </p>
        </div>
      </div>

      {/* ============ WORK ============ */}
      <div
        className="fixed inset-0 flex items-center pointer-events-none"
        style={{ opacity: workOpacity, transition: 'opacity 0.08s linear' }}
      >
        <div className="px-8 md:px-16 w-full max-w-4xl" style={TEXT_SHADOW}>
          <Kicker>Layer 02 &nbsp;/&nbsp; Server</Kicker>
          <h2 className="font-display text-4xl md:text-6xl font-light text-cream leading-tight mb-10">
            Built and <span className="italic text-gold-400">shipped</span>.
          </h2>
          <div className="space-y-5 max-w-2xl">
            {content.projects.slice(0, 4).map((p, i) => (
              <div key={p.id} className="flex items-baseline gap-6 border-b border-cream/8 pb-5">
                <span className="font-mono text-[10px] text-gold-400/60 w-6 shrink-0">
                  0{i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-display text-xl md:text-2xl text-cream font-light">{p.title}</p>
                  <p className="font-body text-sm text-cream/45 mt-1">{p.highlight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ SKILLS ============ */}
      <div
        className="fixed inset-0 flex items-center pointer-events-none"
        style={{ opacity: skillsOpacity, transition: 'opacity 0.08s linear' }}
      >
        <div className="px-8 md:px-16 max-w-4xl" style={TEXT_SHADOW}>
          <Kicker>Layer 03 &nbsp;/&nbsp; Network</Kicker>
          <h2 className="font-display text-4xl md:text-6xl font-light text-cream leading-tight mb-10">
            The full stack, <span className="italic text-gold-400">literally</span>.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 max-w-2xl">
            {content.skills.slice(0, 4).map(group => (
              <div key={group.group}>
                <p className="font-mono text-[10px] text-gold-400/70 tracking-[0.25em] uppercase mb-2">
                  {group.group}
                </p>
                <p className="font-body text-sm text-cream/55 leading-relaxed">
                  {group.items.slice(0, 5).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ CONTACT ============ */}
      <div
        className="fixed inset-0 flex items-center"
        style={{
          opacity: contactOpacity,
          transition: 'opacity 0.08s linear',
          pointerEvents: contactOpacity > 0.5 ? 'auto' : 'none',
        }}
      >
        <div className="px-8 md:px-16 max-w-3xl" style={TEXT_SHADOW}>
          <Kicker>Layer 04 &nbsp;/&nbsp; Bare Metal</Kicker>
          <h2 className="font-display text-4xl md:text-6xl font-light text-cream leading-tight mb-4">
            Let&rsquo;s build something that
            <span className="italic text-gold-400"> holds up</span>.
          </h2>
          <p className="font-body text-cream/45 mb-10">{content.location}</p>
          <div className="flex flex-wrap gap-x-10 gap-y-4 font-body text-sm">
            <a
              href={`mailto:${content.contact.email}`}
              className="text-cream/80 hover:text-gold-400 transition-colors duration-300 underline underline-offset-8 decoration-gold-400/30 hover:decoration-gold-400"
            >
              {content.contact.email}
            </a>
            <a
              href={content.contact.linkedin}
              target="_blank" rel="noopener noreferrer"
              className="text-cream/80 hover:text-gold-400 transition-colors duration-300 underline underline-offset-8 decoration-gold-400/30 hover:decoration-gold-400"
            >
              LinkedIn
            </a>
            <a
              href={content.contact.github}
              target="_blank" rel="noopener noreferrer"
              className="text-cream/80 hover:text-gold-400 transition-colors duration-300 underline underline-offset-8 decoration-gold-400/30 hover:decoration-gold-400"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
