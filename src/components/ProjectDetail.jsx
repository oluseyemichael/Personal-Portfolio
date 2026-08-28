import { useEffect, useState } from 'react';

/**
 * 2D detail panel for a project node. Slides in from the right over
 * the dimmed 3D scene. Closes on the X button, a click outside the
 * panel, or Escape.
 */
export function ProjectDetail({ project, onClose }) {
  const open = Boolean(project);
  // Keep rendering the last project's content while the panel slides
  // out, so the copy doesn't vanish mid-animation.
  const [displayProject, setDisplayProject] = useState(project);

  useEffect(() => {
    if (project) setDisplayProject(project);
  }, [project]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end"
      style={{
        pointerEvents: open ? 'auto' : 'none',
        background: open ? 'rgba(5, 8, 24, 0.75)' : 'transparent',
        transition: 'background 0.3s ease',
      }}
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-md bg-[#0A0E24] border-l border-white/12 px-8 md:px-10 py-10 overflow-y-auto"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: open ? '-20px 0 60px rgba(0,0,0,0.6)' : 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {displayProject && (
          <>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="mb-8 font-mono text-[10px] text-slate-400 hover:text-amber-400 tracking-[0.3em] uppercase transition-colors flex items-center gap-2"
            >
              <span>&larr;</span> CLOSE PANEL
            </button>

            <p className="font-mono text-[10px] text-amber-400 font-semibold tracking-[0.3em] uppercase mb-2">
              [ {displayProject.role} ]
            </p>
            <h3 className="font-display text-3xl md:text-4xl font-normal text-slate-100 leading-tight mb-2 tracking-tight">
              {displayProject.title}
            </h3>
            <p className="font-body text-sm text-slate-400 mb-6">{displayProject.subtitle}</p>

            {displayProject.liveUrl && (
              <div className="flex flex-wrap gap-3 mb-8">
                <a
                  href={displayProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 text-slate-950 font-mono text-xs font-semibold hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
                >
                  <span>VISIT LIVE SITE</span>
                  <span>&rarr;</span>
                </a>
              </div>
            )}

            <p className="font-body text-base text-slate-300 leading-relaxed mb-8">
              {displayProject.description}
            </p>

            {/* Screenshots Gallery with IP Confidentiality Badge */}
            {displayProject.images && displayProject.images.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-[10px] text-amber-400 font-semibold tracking-[0.25em] uppercase">
                    INTERFACE SNAPSHOTS
                  </p>
                  <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    CONFIDENTIAL PREVIEW
                  </span>
                </div>
                <div className="space-y-4">
                  {displayProject.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border border-white/10 shadow-2xl group">
                      <img src={imgUrl} alt={`${displayProject.title} preview ${idx + 1}`} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                      <div className="absolute bottom-2.5 left-3 font-mono text-[9px] text-amber-300 bg-slate-950/90 px-2 py-0.5 rounded border border-amber-400/30">
                        {idx === 0 ? 'Billing & Reports Module' : 'Drug & Pharmacy Catalogue'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <p className="font-mono text-[10px] text-slate-400 tracking-[0.25em] uppercase mb-3">
                Tech Stack & Competencies
              </p>
              <div className="flex flex-wrap gap-2">
                {displayProject.tech.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[11px] text-slate-300 border border-white/10 rounded-md px-3 py-1 bg-white/5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="font-body text-sm italic text-amber-400/90 leading-relaxed">{displayProject.highlight}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
