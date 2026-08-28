import { theme } from '../config/theme.js';
import { playClick, playHover } from '../audio/soundEngine.js';

function scrollToProgress(target) {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: scrollHeight * target, behavior: 'smooth' });
}

export function Header({ scrollProgress = 0 }) {
  const LAYER_KEYS = ['landing', 'about', 'work', 'skills', 'contact'];

  return (
    <header className="fixed top-4 left-4 right-4 md:top-6 md:left-8 md:right-8 z-30 flex items-center justify-between pointer-events-none">
      {/* Brand & Live Telemetry Badge */}
      <div className="glass-panel px-4 py-2 rounded-lg border border-white/12 flex items-center gap-3 pointer-events-auto shadow-xl">
        <div className="status-dot" />
        <span className="font-display text-sm font-medium text-slate-100 tracking-tight">
          SeyeTheGreat
        </span>
        <span className="hidden sm:inline-block w-px h-3.5 bg-white/10" />
        <span className="hidden sm:inline-block font-mono text-[10px] text-slate-400 tracking-widest uppercase">
          SYS // 2026
        </span>
      </div>

      {/* Interactive Layer Quick Jump Navbar */}
      <nav className="hidden lg:flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-lg border border-white/12 pointer-events-auto shadow-xl">
        {LAYER_KEYS.map((key) => {
          const zone = theme.zones[key];
          const isActive = scrollProgress >= zone.start && scrollProgress <= zone.end;
          return (
            <button
              key={key}
              type="button"
              onClick={() => { playClick(); scrollToProgress(zone.start); }}
              onMouseEnter={playHover}
              className={`px-3 py-1 rounded-md font-mono text-[11px] uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_10px_rgba(255,193,69,0.2)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              {zone.label}
            </button>
          );
        })}
      </nav>

      {/* Telemetry Coordinate Readout */}
      <div className="glass-panel px-4 py-2 rounded-lg border border-white/12 hidden md:flex items-center gap-2 pointer-events-auto">
        <span className="font-mono text-[10px] text-amber-400 font-semibold tracking-widest uppercase">
          DEPTH: -{Math.round(scrollProgress * 48).toString().padStart(2, '0')}M
        </span>
      </div>
    </header>
  );
}
