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
        background: open ? 'rgba(5, 8, 24, 0.55)' : 'transparent',
        transition: 'background 0.3s ease',
      }}
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-md bg-[#0A0E24] border-l border-gold-400/20 px-8 md:px-10 py-10 overflow-y-auto"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: open ? '-20px 0 60px rgba(0,0,0,0.4)' : 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {displayProject && (
          <>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="mb-10 font-mono text-[10px] text-cream/50 hover:text-gold-400 tracking-[0.3em] uppercase transition-colors"
            >
              &larr; Close
            </button>

            <p className="font-mono text-[10px] text-gold-400/70 tracking-[0.3em] uppercase mb-3">
              {displayProject.role}
            </p>
            <h3 className="font-display text-3xl md:text-4xl font-light text-cream leading-tight mb-2">
              {displayProject.title}
            </h3>
            <p className="font-body text-sm text-cream/50 mb-8">{displayProject.subtitle}</p>

            <p className="font-body text-base text-cream/70 leading-relaxed mb-8">
              {displayProject.description}
            </p>

            <div className="mb-8">
              <p className="font-mono text-[10px] text-cream/40 tracking-[0.25em] uppercase mb-3">
                Tech
              </p>
              <div className="flex flex-wrap gap-2">
                {displayProject.tech.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[11px] text-cream/70 border border-cream/15 rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-cream/10 pt-6">
              <p className="font-body text-sm italic text-gold-400/90">{displayProject.highlight}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
