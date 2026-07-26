/**
 * Minimal fixed header. Quiet, editorial.
 */
export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-8 md:px-16 py-7 flex justify-between items-baseline pointer-events-none">
      <p className="font-display text-base text-cream/90 pointer-events-auto">
        M<span className="text-gold-400">.</span>O
      </p>
      <p className="font-mono text-[10px] text-cream/30 tracking-[0.3em] uppercase">
        Portfolio &mdash; 2026
      </p>
    </header>
  );
}
