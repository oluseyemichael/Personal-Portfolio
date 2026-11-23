import { theme } from '../config/theme.js';
import { playClick, playHover } from '../audio/soundEngine.js';

const KEYS = ['landing', 'about', 'work', 'skills', 'contact'];

function scrollToProgress(target) {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: scrollHeight * target, behavior: 'smooth' });
}

export function Header({ scrollProgress = 0, portrait = false }) {
  const index = Math.max(
    0,
    KEYS.findIndex((k) => scrollProgress >= theme.zones[k].start && scrollProgress < theme.zones[k].end),
  );

  if (portrait) {
    // Compact phone header: name, the layer you are on, and a lite-version escape hatch.
    return (
      <header
        className="fixed top-0 inset-x-0 z-30 flex items-center justify-between pl-5 pr-16 pointer-events-none"
        style={{ paddingTop: 'env(safe-area-inset-top)', height: 'calc(3.5rem + env(safe-area-inset-top))' }}
      >
        <div className="pointer-events-auto leading-tight">
          <p className="font-display text-base text-cream tracking-tight">Michael Oluseye</p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold-500">
            <span className="tabular-nums">0{index}</span>
            <span className="text-cream/50"> / 04 &nbsp;</span>
            <span className="text-cream/75">{theme.zones[KEYS[index]].label}</span>
          </p>
        </div>
        <a
          href="?view=2d"
          className="pointer-events-auto inline-flex items-center min-h-11 px-2 text-[11px] uppercase tracking-[0.2em] text-cream/65 active:text-gold-500"
        >
          Lite
        </a>
      </header>
    );
  }

  return (
    <header className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-6 md:px-16 lg:px-24 h-20 pointer-events-none">
      <a
        href="/"
        className="pointer-events-auto font-display text-lg text-cream tracking-tight"
        aria-label="Michael Oluseye, home"
      >
        SeyeTheGreat
      </a>

      <nav className="hidden lg:flex items-center gap-8 pointer-events-auto" aria-label="Sections">
        {KEYS.map((key) => {
          const zone = theme.zones[key];
          const active = scrollProgress >= zone.start && scrollProgress < zone.end;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                playClick();
                scrollToProgress(zone.focus);
              }}
              onMouseEnter={playHover}
              aria-current={active ? 'true' : undefined}
              className={`relative py-2 text-[11px] uppercase tracking-[0.24em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500 ${
                active ? 'text-gold-500' : 'text-cream/50 hover:text-cream'
              }`}
            >
              {zone.label}
              <span
                className={`absolute left-0 right-0 -bottom-0.5 h-px bg-gold-500 origin-left transition-transform duration-300 ${
                  active ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          );
        })}
      </nav>
    </header>
  );
}
