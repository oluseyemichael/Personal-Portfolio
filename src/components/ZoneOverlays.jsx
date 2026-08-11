import { theme } from '../config/theme.js';
import { content } from '../config/content.js';

function useZoneOpacity(scrollProgress, start, end, fadeIn = 0.04, fadeOut = 0.04) {
  if (scrollProgress < start) return 0;
  if (scrollProgress > end) return 0;

  if (start > 0 && scrollProgress < start + fadeIn) return (scrollProgress - start) / fadeIn;
  if (end < 1 && scrollProgress > end - fadeOut) return (end - scrollProgress) / fadeOut;
  return 1;
}

function TelemetryHeader({ code, label }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="status-dot" />
      <span className="font-mono text-[11px] text-amber-400 font-semibold tracking-[0.25em] uppercase">
        SYS // {code}
      </span>
      <span className="w-8 h-px bg-amber-400/40" />
      <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}

export function ZoneOverlays({ scrollProgress }) {
  const landingOpacity = useZoneOpacity(scrollProgress, 0.0, 0.15);
  const aboutOpacity = useZoneOpacity(scrollProgress, 0.15, 0.35);

  // WORK ZONE STAGGERED FLOW:
  // 0.35 - 0.47: 2D Project List Card shows.
  // 0.48 - 0.62: 2D text completely disappears so 3D racks can be explored in isolation!
  const workListOpacity = useZoneOpacity(scrollProgress, 0.35, 0.47, 0.04, 0.03);
  const workFocusActive = scrollProgress >= 0.47 && scrollProgress <= 0.62;

  // SKILLS ZONE STAGGERED FLOW:
  // 0.65 - 0.73: 2D Skills Summary Card shows.
  // 0.74 - 0.83: 2D text completely disappears so 3D constellation can be explored!
  const skillsListOpacity = useZoneOpacity(scrollProgress, 0.65, 0.73, 0.04, 0.03);
  const skillsFocusActive = scrollProgress >= 0.73 && scrollProgress <= 0.83;

  const contactOpacity = useZoneOpacity(scrollProgress, 0.85, 1.0);

  return (
    <>
      {/* ============ LANDING ============ */}
      <div
        className="fixed inset-0 flex items-center md:items-end justify-start pointer-events-none px-6 md:px-16 pb-12 md:pb-20"
        style={{ opacity: landingOpacity, transition: 'opacity 0.08s linear' }}
      >
        <div className="glass-panel p-6 md:p-10 rounded-2xl max-w-2xl shadow-2xl pointer-events-auto">
          <TelemetryHeader code="00_SURFACE" label="PRODUCT LAYER" />
          <p className="font-mono text-[10px] text-slate-400 tracking-[0.3em] uppercase mb-3">
            {content.name} &nbsp;&bull;&nbsp; {content.location}
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-light text-slate-100 leading-[1.05] mb-4">
            Every<span className="italic text-amber-400"> layer</span>.
          </h1>
          <p className="font-body text-sm md:text-base text-slate-300/80 leading-relaxed max-w-lg mb-6">
            Infrastructure, code, and product. A descent through
            everything I&rsquo;ve built, from the surface to bare metal.
          </p>

          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[10px] uppercase tracking-wider">
              SCROLL TO DESCEND &darr;
            </span>
            <span className="font-mono text-[10px] text-slate-500">5 STACK DEPTHS</span>
          </div>
        </div>
      </div>

      {/* ============ ABOUT ============ */}
      <div
        className="fixed inset-0 flex items-center justify-start pointer-events-none px-6 md:px-16"
        style={{ opacity: aboutOpacity, transition: 'opacity 0.08s linear' }}
      >
        <div className="glass-panel p-6 md:p-10 rounded-2xl max-w-2xl shadow-2xl pointer-events-auto">
          <TelemetryHeader code="01_APPLICATION" label="ABOUT & JOURNEY" />
          <h2 className="font-display text-3xl md:text-5xl font-light text-slate-100 leading-tight mb-6">
            From server racks to <span className="italic text-amber-400">product strategy</span>.
          </h2>
          <p className="font-body text-sm md:text-base text-slate-300/80 leading-relaxed">
            {content.bio.body}
          </p>
        </div>
      </div>

      {/* ============ WORK (PHASE 1): 2D Project List Card ============ */}
      <div
        className="fixed inset-0 flex items-center justify-start px-6 md:px-16 pointer-events-none"
        style={{
          opacity: workListOpacity,
          transition: 'opacity 0.08s linear',
        }}
      >
        <div
          className="glass-panel p-6 md:p-10 rounded-2xl max-w-3xl shadow-2xl"
          style={{ pointerEvents: workListOpacity > 0.4 ? 'auto' : 'none' }}
        >
          <TelemetryHeader code="02_SERVER" label="PROJECT LIST" />
          <h2 className="font-display text-3xl md:text-5xl font-light text-slate-100 leading-tight mb-6">
            Built and <span className="italic text-amber-400">shipped</span>.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.projects.slice(0, 4).map((p, i) => (
              <div key={p.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-amber-400 font-bold">0{i + 1}</span>
                  <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">{p.role}</span>
                </div>
                <p className="font-display text-lg text-slate-100 font-light">{p.title}</p>
                <p className="font-body text-xs text-slate-400 mt-1 line-clamp-2">{p.highlight}</p>
              </div>
            ))}
          </div>
          <p className="font-mono text-[10px] text-amber-400/80 mt-4 tracking-wider">
            &darr; KEEP SCROLLING TO ENTER & EXPLORE 3D SERVER RACKS
          </p>
        </div>
      </div>

      {/* ============ SKILLS (PHASE 1): 2D Skills Summary Card ============ */}
      <div
        className="fixed inset-0 flex items-center justify-start px-6 md:px-16 pointer-events-none"
        style={{
          opacity: skillsListOpacity,
          transition: 'opacity 0.08s linear',
        }}
      >
        <div
          className="glass-panel p-6 md:p-8 rounded-2xl max-w-4xl shadow-2xl"
          style={{ pointerEvents: skillsListOpacity > 0.4 ? 'auto' : 'none' }}
        >
          <TelemetryHeader code="03_NETWORK" label="SKILLS SUMMARY" />
          <h2 className="font-display text-3xl md:text-4xl font-light text-slate-100 leading-tight mb-5">
            The full stack, <span className="italic text-amber-400">literally</span>.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {content.skills.map(group => (
              <div key={group.group} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="font-mono text-[10px] text-amber-400 font-semibold tracking-wider uppercase mb-1">
                  {group.group}
                </p>
                <p className="font-body text-xs text-slate-300/90 leading-relaxed">
                  {group.items.slice(0, 4).join(' • ')}
                </p>
              </div>
            ))}
          </div>
          <p className="font-mono text-[10px] text-amber-400/80 mt-4 tracking-wider">
            &darr; KEEP SCROLLING TO ENTER & EXPLORE 3D NETWORK CONSTELLATION
          </p>
        </div>
      </div>

      {/* ============ CONTACT ============ */}
      <div
        className="fixed inset-0 flex items-center justify-start pointer-events-none px-6 md:px-16"
        style={{
          opacity: contactOpacity,
          transition: 'opacity 0.08s linear',
          pointerEvents: contactOpacity > 0.5 ? 'auto' : 'none',
        }}
      >
        <div className="glass-panel p-6 md:p-10 rounded-2xl max-w-2xl shadow-2xl pointer-events-auto">
          <TelemetryHeader code="04_BARE_METAL" label="CORE CONNECTION" />
          <h2 className="font-display text-3xl md:text-5xl font-light text-slate-100 leading-tight mb-4">
            Let&rsquo;s build something that
            <span className="italic text-amber-400"> holds up</span>.
          </h2>
          <p className="font-body text-xs text-slate-400 mb-6">{content.location}</p>

          <div className="flex flex-wrap gap-4 font-body text-sm">
            <a
              href={`mailto:${content.contact.email}`}
              className="px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
            >
              {content.contact.email}
            </a>
            <a
              href={content.contact.linkedin}
              target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors"
            >
              LinkedIn &rarr;
            </a>
            <a
              href={content.contact.github}
              target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors"
            >
              GitHub &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* ============ PERSISTENT 360° CAMERA CONTROL BADGE ============ */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2.5 shadow-xl border border-amber-400/30 text-amber-300 font-mono text-[10px] tracking-wider uppercase">
          <svg className="w-4 h-4 animate-spin-slow text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{workFocusActive || skillsFocusActive ? '360° VIEWPORT ACTIVE • DRAG TO ROTATE' : 'DRAG TO ROTATE 360°'}</span>
        </div>
      </div>
    </>
  );
}


