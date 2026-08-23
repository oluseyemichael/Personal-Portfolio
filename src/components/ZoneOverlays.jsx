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
      <span className="font-mono text-[11px] text-sky-400 font-semibold tracking-[0.25em] uppercase">
        SYS // {code}
      </span>
      <span className="w-8 h-px bg-white/10" />
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
      {/* ============ LANDING (00_SURFACE) ============ */}
      <div
        className="fixed inset-0 flex items-center md:items-end justify-start pointer-events-none px-6 md:px-16 pb-12 md:pb-20"
        style={{ opacity: landingOpacity, transition: 'opacity 0.08s linear' }}
      >
        <div className="glass-panel p-8 md:p-12 rounded-xl max-w-2xl border border-white/10 shadow-2xl pointer-events-auto">
          <TelemetryHeader code="00_SURFACE" label="PRODUCT LAYER" />
          <p className="font-mono text-[10px] text-slate-400 tracking-[0.3em] uppercase mb-4">
            {content.name} &nbsp;&bull;&nbsp; {content.location}
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-normal text-slate-100 leading-[1.05] tracking-tight mb-5">
            Every layer.
          </h1>
          <p className="font-body text-sm md:text-base text-slate-300/90 leading-relaxed max-w-lg mb-8">
            Infrastructure, code, and product strategy. A structured descent through
            everything I&rsquo;ve built, from the surface to bare metal.
          </p>

          <div className="flex items-center gap-4 pt-5 border-t border-white/10">
            <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono text-[10px] uppercase tracking-wider">
              SCROLL TO DESCEND &darr;
            </span>
            <span className="font-mono text-[10px] text-slate-400">5 STACK DEPTHS</span>
          </div>
        </div>
      </div>

      {/* ============ ABOUT (01_APPLICATION) ============ */}
      <div
        className="fixed inset-0 flex items-center justify-start pointer-events-none px-6 md:px-16"
        style={{ opacity: aboutOpacity, transition: 'opacity 0.08s linear' }}
      >
        <div className="glass-panel p-8 md:p-12 rounded-xl max-w-2xl border border-white/10 shadow-2xl pointer-events-auto">
          <TelemetryHeader code="01_APPLICATION" label="ABOUT & JOURNEY" />
          <h2 className="font-display text-3xl md:text-5xl font-normal text-slate-100 leading-tight tracking-tight mb-6">
            From server racks to product strategy.
          </h2>
          <p className="font-body text-sm md:text-base text-slate-300/90 leading-relaxed">
            {content.bio.body}
          </p>
        </div>
      </div>

      {/* ============ WORK (02_SERVER): 2D Project List Card ============ */}
      <div
        className="fixed inset-0 flex items-center justify-start px-6 md:px-16 pointer-events-none"
        style={{
          opacity: workListOpacity,
          transition: 'opacity 0.08s linear',
        }}
      >
        <div
          className="glass-panel p-8 md:p-10 rounded-xl max-w-3xl border border-white/10 shadow-2xl"
          style={{ pointerEvents: workListOpacity > 0.4 ? 'auto' : 'none' }}
        >
          <TelemetryHeader code="02_SERVER" label="PROJECT LIST" />
          <h2 className="font-display text-3xl md:text-5xl font-normal text-slate-100 leading-tight tracking-tight mb-6">
            Built and shipped.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.projects.slice(0, 4).map((p, i) => (
              <div key={p.id} className="p-4 rounded-lg bg-slate-900/60 border border-white/10 hover:border-slate-400 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-sky-400 font-semibold">[ 0{i + 1} ]</span>
                  <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">{p.role}</span>
                </div>
                <p className="font-display text-lg text-slate-100 font-medium mb-1">{p.title}</p>
                <p className="font-body text-xs text-slate-400 line-clamp-2 leading-relaxed">{p.highlight}</p>
              </div>
            ))}
          </div>
          <p className="font-mono text-[10px] text-sky-400/90 mt-5 tracking-wider uppercase">
            &darr; KEEP SCROLLING TO ENTER & EXPLORE 3D SERVER RACKS
          </p>
        </div>
      </div>

      {/* ============ SKILLS (03_NETWORK): 2D Skills Summary Card ============ */}
      <div
        className="fixed inset-0 flex items-center justify-start px-6 md:px-16 pointer-events-none"
        style={{
          opacity: skillsListOpacity,
          transition: 'opacity 0.08s linear',
        }}
      >
        <div
          className="glass-panel p-8 md:p-10 rounded-xl max-w-4xl border border-white/10 shadow-2xl"
          style={{ pointerEvents: skillsListOpacity > 0.4 ? 'auto' : 'none' }}
        >
          <TelemetryHeader code="03_NETWORK" label="SKILLS SUMMARY" />
          <h2 className="font-display text-3xl md:text-4xl font-normal text-slate-100 leading-tight tracking-tight mb-6">
            The full stack, literally.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {content.skills.map(group => (
              <div key={group.group} className="p-3.5 rounded-lg bg-slate-900/60 border border-white/10">
                <p className="font-mono text-[10px] text-sky-400 font-semibold tracking-wider uppercase mb-1.5">
                  {group.group}
                </p>
                <p className="font-body text-xs text-slate-300 leading-relaxed">
                  {group.items.slice(0, 4).join(' • ')}
                </p>
              </div>
            ))}
          </div>
          <p className="font-mono text-[10px] text-sky-400/90 mt-5 tracking-wider uppercase">
            &darr; KEEP SCROLLING TO ENTER & EXPLORE 3D NETWORK CONSTELLATION
          </p>
        </div>
      </div>

      {/* ============ CONTACT (04_BARE_METAL) ============ */}
      <div
        className="fixed inset-0 flex items-center justify-start pointer-events-none px-6 md:px-16"
        style={{
          opacity: contactOpacity,
          transition: 'opacity 0.08s linear',
          pointerEvents: contactOpacity > 0.5 ? 'auto' : 'none',
        }}
      >
        <div className="glass-panel p-8 md:p-12 rounded-xl max-w-2xl border border-white/10 shadow-2xl pointer-events-auto">
          <TelemetryHeader code="04_BARE_METAL" label="CORE CONNECTION" />
          <h2 className="font-display text-3xl md:text-5xl font-normal text-slate-100 leading-tight tracking-tight mb-4">
            Let&rsquo;s build something that holds up.
          </h2>
          <p className="font-body text-xs text-slate-400 mb-8">{content.location}</p>

          <div className="flex flex-wrap gap-4 font-body text-sm">
            <a
              href={`mailto:${content.contact.email}`}
              className="px-5 py-2.5 rounded-lg bg-slate-100 text-slate-950 font-medium hover:bg-white transition-colors shadow-lg shadow-white/10"
            >
              {content.contact.email}
            </a>
            <a
              href={content.contact.linkedin}
              target="_blank" rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
            >
              LinkedIn &rarr;
            </a>
            <a
              href={content.contact.github}
              target="_blank" rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
            >
              GitHub &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* ============ PERSISTENT 360° CAMERA CONTROL BADGE ============ */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2.5 shadow-xl border border-white/10 text-slate-300 font-mono text-[10px] tracking-wider uppercase">
          <svg className="w-4 h-4 animate-spin-slow text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{workFocusActive || skillsFocusActive ? '360° VIEWPORT ACTIVE • DRAG TO ROTATE' : 'DRAG TO ROTATE 360°'}</span>
        </div>
      </div>
    </>
  );
}
