import { theme } from '../config/theme.js';
import { playHover, playClick } from '../audio/soundEngine.js';

const ZONE_ORDER = ['landing', 'about', 'work', 'skills', 'contact'];

function scrollToProgress(target) {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: scrollHeight * target, behavior: 'smooth' });
}

export function ProgressIndicator({ scrollProgress }) {
  const depth = Math.round(scrollProgress * 48);

  return (
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-20 pointer-events-none">
      <div className="glass-panel py-4 px-2 rounded-full flex flex-col items-center gap-4 pointer-events-auto shadow-xl">
        <div className="relative w-0.5 h-44 bg-white/10 rounded-full">
          <div
            className="absolute top-0 left-0 w-full bg-amber-400 origin-top shadow-[0_0_8px_rgba(255,193,69,0.8)] rounded-full transition-all duration-75"
            style={{ height: `${scrollProgress * 100}%` }}
          />
          {ZONE_ORDER.map((key) => {
            const zone = theme.zones[key];
            const top = `${zone.start * 100}%`;
            const isActive = scrollProgress >= zone.start && scrollProgress <= zone.end;

            return (
              <button
                key={key}
                type="button"
                aria-label={`Jump to ${zone.label}`}
                onClick={() => { playClick(); scrollToProgress(zone.start); }}
                onMouseEnter={playHover}
                className="group absolute -left-2 flex items-center justify-center w-5 h-5 -translate-y-1/2 cursor-pointer"
                style={{ top }}
              >
                <span
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-2.5 h-2.5 bg-amber-400 shadow-[0_0_10px_#FFC145]'
                      : 'w-1.5 h-1.5 bg-slate-500 group-hover:bg-amber-300'
                  }`}
                />

                {/* Tooltip on hover */}
                <div className="absolute right-7 px-2.5 py-1 rounded bg-[#070b19]/90 border border-white/15 font-mono text-[9px] text-amber-300 uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-md">
                  {zone.label}
                </div>
              </button>
            );
          })}
        </div>

        <span className="font-mono text-[9px] text-amber-400 font-semibold tracking-widest tabular-nums">
          -{depth.toString().padStart(2, '0')}M
        </span>
      </div>
    </div>
  );
}

