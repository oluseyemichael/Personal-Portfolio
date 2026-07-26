import { theme } from '../config/theme.js';

const ZONE_ORDER = ['landing', 'about', 'work', 'skills', 'contact'];

function scrollToProgress(target) {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: scrollHeight * target, behavior: 'smooth' });
}

/**
 * Hairline progress track, right edge. Depth counter in metres
 * to match the descent metaphor. Each zone has a clickable tick
 * mark that jumps the scroll position straight there.
 */
export function ProgressIndicator({ scrollProgress }) {
  const depth = Math.round(scrollProgress * 48);

  return (
    <div className="fixed right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20">
      <div className="relative w-px h-48 bg-cream/8 pointer-events-auto">
        <div
          className="absolute top-0 left-0 w-full bg-gold-400/80 origin-top pointer-events-none"
          style={{ height: `${scrollProgress * 100}%` }}
        />
        {ZONE_ORDER.map((key) => {
          const zone = theme.zones[key];
          const top = `${zone.start * 100}%`;
          return (
            <button
              key={key}
              type="button"
              aria-label={`Jump to ${zone.label}`}
              onClick={() => scrollToProgress(zone.start)}
              className="group absolute -left-2 flex items-center justify-center w-5 h-5 -translate-y-1/2"
              style={{ top }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cream/30 group-hover:bg-gold-400 transition-colors" />
            </button>
          );
        })}
      </div>
      <p className="font-mono text-[10px] text-cream/35 tracking-widest tabular-nums pointer-events-none">
        &minus;{depth.toString().padStart(2, '0')}m
      </p>
    </div>
  );
}
