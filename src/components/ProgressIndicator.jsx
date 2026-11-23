import { theme } from '../config/theme.js';
import { playHover, playClick } from '../audio/soundEngine.js';

const KEYS = ['landing', 'about', 'work', 'skills', 'contact'];

function scrollToProgress(target) {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: scrollHeight * target, behavior: 'smooth' });
}

/** A thin depth gauge on the right edge. Each tick jumps to its layer. */
export function ProgressIndicator({ scrollProgress, portrait = false }) {
  return (
    <nav
      aria-label="Depth"
      className={`fixed top-1/2 -translate-y-1/2 z-20 pointer-events-auto ${
        portrait ? 'right-[max(0.5rem,env(safe-area-inset-right))]' : 'right-5 md:right-8'
      }`}
    >
      <div className={`relative w-px bg-cream/15 ${portrait ? 'h-60' : 'h-56'}`}>
        <div className="absolute top-0 left-0 w-px bg-gold-500" style={{ height: `${scrollProgress * 100}%` }} />
        {KEYS.map((key) => {
          const zone = theme.zones[key];
          const active = scrollProgress >= zone.start && scrollProgress < zone.end;
          return (
            <button
              key={key}
              type="button"
              aria-label={`Jump to ${zone.label}`}
              onClick={() => {
                playClick();
                scrollToProgress(zone.focus);
              }}
              onMouseEnter={playHover}
              className={`group absolute -translate-y-1/2 flex items-center justify-center cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500 rounded-full ${
                portrait ? '-left-[22px] w-11 h-11' : '-left-[11px] w-6 h-6'
              }`}
              style={{ top: `${zone.focus * 100}%` }}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  active ? 'w-2 h-2 bg-gold-500' : 'w-1.5 h-1.5 bg-cream/40 group-hover:bg-cream'
                }`}
              />
              {!portrait && (
                <span className="absolute right-7 text-[10px] uppercase tracking-[0.22em] whitespace-nowrap text-cream/0 group-hover:text-cream/80 transition-colors">
                  {zone.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
