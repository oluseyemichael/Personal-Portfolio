import { theme } from '../config/theme.js';

/**
 * Hairline progress track, right edge. Depth counter in metres
 * to match the descent metaphor.
 */
export function ProgressIndicator({ scrollProgress }) {
  const depth = Math.round(scrollProgress * 48);

  return (
    <div className="fixed right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 pointer-events-none z-20">
      <div className="relative w-px h-48 bg-cream/8">
        <div
          className="absolute top-0 left-0 w-full bg-gold-400/80 origin-top"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>
      <p className="font-mono text-[10px] text-cream/35 tracking-widest tabular-nums">
        &minus;{depth.toString().padStart(2, '0')}m
      </p>
    </div>
  );
}
