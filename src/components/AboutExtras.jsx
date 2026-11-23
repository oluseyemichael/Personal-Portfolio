import { content } from '../config/content.js';

/**
 * Proof that backs up the About copy: where Michael works right now, and
 * (when there's room) the numbers behind the claims.
 */
export function AboutExtras({ portrait = false, stats = true }) {
  return (
    <>
      <div className={portrait ? 'mt-4' : 'mt-6'}>
        <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-gold-500">{content.copy.nowLabel}</p>
        <ul className="space-y-1 text-[13px] sm:text-sm">
          {content.now.map((n) => (
            <li key={n.org}>
              <span className="text-cream">{n.org}</span>
              <span className="text-cream/65"> &middot; {n.role}</span>
            </li>
          ))}
        </ul>
      </div>
      {stats && (
        <dl
          className={`mt-7 grid-cols-2 gap-x-6 gap-y-5 border-t border-cream/10 pt-6 ${
            stats === 'auto' ? 'hidden [@media(min-height:780px)]:grid' : 'grid'
          }`}
        >
          {content.stats.map((s) => (
            <div key={s.value}>
              <dt className="font-display text-2xl sm:text-3xl font-light text-gold-500 tabular-nums">{s.value}</dt>
              <dd className="mt-1 text-xs leading-snug text-cream/70">{s.label}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );
}
