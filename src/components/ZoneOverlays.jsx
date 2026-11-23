import { content } from '../config/content.js';
import { playHover, playClick } from '../audio/soundEngine.js';
import { AboutExtras } from './AboutExtras.jsx';

function zoneOpacity(p, start, end, fadeIn = 0.04, fadeOut = 0.04) {
  if (p < start || p > end) return 0;
  if (start > 0 && p < start + fadeIn) return (p - start) / fadeIn;
  if (end < 1 && p > end - fadeOut) return (end - p) / fadeOut;
  return 1;
}

function Kicker({ n, children, portrait }) {
  return (
    <p
      className={`flex items-center gap-3 text-gold-500 uppercase ${
        portrait ? 'mb-3 text-[11px] tracking-[0.24em]' : 'mb-5 text-[11px] tracking-[0.28em]'
      }`}
    >
      <span className="tabular-nums">{n}</span>
      <span className="w-8 h-px bg-gold-500/50" />
      <span className="text-cream/60">{children}</span>
    </p>
  );
}

/**
 * Desktop: copy sits mid-left, the 3D subject on the right.
 * Portrait: the 3D subject owns the upper half of the screen and the copy
 * sits at the bottom, clear of the thumb-zone controls.
 */
function Zone({ opacity, portrait, align = 'center', children }) {
  const interactive = opacity > 0.4;
  const layout = portrait
    ? 'items-end px-5 pb-[calc(5.25rem+env(safe-area-inset-bottom))]'
    : `px-6 md:px-16 lg:px-24 ${align === 'end' ? 'items-end pb-16 md:pb-24' : 'items-center'}`;
  return (
    <section
      className={`fixed inset-0 flex justify-start pointer-events-none ${layout}`}
      style={{ opacity, transition: 'opacity 0.1s linear', visibility: opacity > 0.01 ? 'visible' : 'hidden' }}
      aria-hidden={!interactive}
    >
      <div className={portrait ? 'w-full' : 'max-w-[34rem]'} style={{ pointerEvents: interactive ? 'auto' : 'none' }}>
        {children}
      </div>
    </section>
  );
}

const headline = 'font-display font-light text-cream leading-[1.04] tracking-[-0.02em]';

export function ZoneOverlays({ scrollProgress: p, onSelectProject, portrait = false }) {
  const landing = zoneOpacity(p, 0, 0.2, 0.04, 0.05);
  const about = zoneOpacity(p, 0.2, 0.4, 0.05, 0.05);
  const work = zoneOpacity(p, 0.4, 0.6, 0.05, 0.05);
  const skills = zoneOpacity(p, 0.6, 0.8, 0.05, 0.05);
  const contact = zoneOpacity(p, 0.8, 1.0, 0.05, 0.05);

  const scrim = Math.max(landing, about, work, skills, contact);

  const h2 = portrait ? 'text-[clamp(1.75rem,8.4vw,2.5rem)]' : 'h-display';
  const h2Space = portrait ? 'mb-3' : 'mb-6';
  const body = portrait ? 'text-[15px] leading-relaxed text-cream/80' : 'text-base leading-relaxed text-cream/75';

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: scrim,
          transition: 'opacity 0.1s linear',
          background: portrait
            ? 'linear-gradient(0deg, rgba(5,8,24,0.96) 0%, rgba(5,8,24,0.86) 34%, rgba(5,8,24,0) 62%)'
            : 'linear-gradient(90deg, rgba(5,8,24,0.88) 0%, rgba(5,8,24,0.62) 32%, rgba(5,8,24,0) 60%)',
        }}
      />

      {/* Landing */}
      <Zone opacity={landing} portrait={portrait} align="end">
        <p className={`text-[11px] uppercase text-cream/65 ${portrait ? 'mb-3 tracking-[0.22em]' : 'mb-6 tracking-[0.28em]'}`}>
          {content.name} &nbsp;/&nbsp; {content.location}
        </p>
        <h1 className={`${headline} ${portrait ? 'text-[clamp(2.5rem,12.5vw,3.5rem)] mb-2' : 'h-hero mb-6'}`}>
          Servers to <em className="italic text-gold-500">strategy.</em>
        </h1>
        <p className={`${body} ${portrait ? 'mb-4 max-w-sm' : 'md:text-lg max-w-md mb-10'}`}>
          {content.copy.hero}
        </p>
        <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.26em] text-cream/65">
          <span className="relative w-px h-9 bg-cream/25 overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-4 bg-gold-500 animate-[scrollcue_1.8s_ease-in-out_infinite]" />
          </span>
          {portrait ? 'Swipe up to descend' : 'Scroll to descend'}
        </p>
      </Zone>

      {/* About */}
      <Zone opacity={about} portrait={portrait}>
        <Kicker n="01" portrait={portrait}>
          About
        </Kicker>
        <h2 className={`${headline} ${h2} ${h2Space}`}>{content.bio.headline}</h2>
        <p className={body}>{content.bio.body}</p>
        <AboutExtras portrait={portrait} stats={portrait ? false : 'auto'} />
      </Zone>

      {/* Work: on a phone the rack IS the interface, so the copy stays short.
          The list is kept (visually hidden) for screen readers and keyboards. */}
      <Zone opacity={work} portrait={portrait}>
        <Kicker n="02" portrait={portrait}>
          Work
        </Kicker>
        <h2 className={`${headline} ${h2} ${portrait ? 'mb-2' : 'mb-6'}`}>{content.copy.workHeading}</h2>
        {portrait && (
          <p className="flex items-center gap-2 text-[13px] text-cream/75">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" aria-hidden="true" />
            Tap a server. See what I built.
          </p>
        )}
        <ul className={portrait ? 'sr-only' : 'border-t border-cream/10'}>
          {content.projects.map((project, i) => (
            <li key={project.id} className={portrait ? '' : 'border-b border-cream/10'}>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onSelectProject(project);
                }}
                onMouseEnter={playHover}
                className="group w-full flex items-baseline gap-4 py-[1.2vh] text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500"
              >
                <span className="text-[11px] tabular-nums text-cream/50 w-6">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-display text-[clamp(1.1rem,2.6vh,1.5rem)] text-cream group-hover:text-gold-500 transition-colors duration-200">
                    {project.title}
                  </span>
                  <span className="block text-xs text-cream/60 mt-0.5 truncate">{project.role}</span>
                </span>
                <span
                  className="text-gold-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                  aria-hidden="true"
                >
                  &rarr;
                </span>
              </button>
            </li>
          ))}
        </ul>
        {!portrait && (
          <p className="mt-5 text-[11px] uppercase tracking-[0.24em] text-cream/55">Or click a server in the rack</p>
        )}
      </Zone>

      {/* Skills */}
      <Zone opacity={skills} portrait={portrait}>
        <Kicker n="03" portrait={portrait}>
          Skills
        </Kicker>
        <h2 className={`${headline} ${h2} ${portrait ? 'mb-4' : 'mb-6'}`}>{content.copy.skillsHeading}</h2>
        <dl className={portrait ? 'space-y-2' : 'space-y-4'}>
          {content.skills
            .filter((g) => g.items?.length)
            .map((group) => (
              <div key={group.group} className={portrait ? '' : 'grid grid-cols-[7.5rem_1fr] gap-x-4'}>
                <dt className={`text-[11px] uppercase tracking-[0.2em] text-gold-500 ${portrait ? 'mb-0.5' : 'pt-0.5'}`}>
                  {group.group}
                </dt>
                <dd className={`${portrait ? 'text-[13px] truncate' : 'text-sm'} text-cream/75 leading-snug`}>
                  {group.items.slice(0, portrait ? 3 : 5).join('  ·  ')}
                </dd>
              </div>
            ))}
        </dl>
        <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-cream/55">
          {portrait ? 'Tap a node to read it' : 'Hover a node to read it'}
        </p>
      </Zone>

      {/* Contact */}
      <Zone opacity={contact} portrait={portrait}>
        <Kicker n="04" portrait={portrait}>
          Contact
        </Kicker>
        <h2 className={`${headline} ${h2} ${portrait ? 'mb-2' : 'mb-4'}`}>{content.copy.contactHeading}</h2>
        <p className={`text-sm text-cream/60 ${portrait ? 'mb-5' : 'mb-9'}`}>{content.copy.contactNote}</p>
        <a
          href={`mailto:${content.contact.email}`}
          className={`inline-flex items-center justify-center rounded-full bg-gold-500 text-navy-950 font-medium text-sm hover:bg-gold-400 active:bg-gold-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 ${
            portrait ? 'w-full min-h-12 px-5 break-all text-center' : 'px-6 py-3'
          }`}
        >
          {content.contact.email}
        </a>
        <div className={`flex text-sm ${portrait ? 'mt-3 gap-3' : 'mt-6 gap-6'}`}>
          {[
            ['LinkedIn', content.contact.linkedin],
            ['GitHub', content.contact.github],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                portrait
                  ? 'flex-1 inline-flex items-center justify-center min-h-11 rounded-full border border-cream/20 text-cream/85 active:bg-cream/10'
                  : 'text-cream/70 hover:text-gold-500 underline underline-offset-4 decoration-cream/25 hover:decoration-gold-500 transition-colors'
              }
            >
              {label} &rarr;
            </a>
          ))}
        </div>
        {!portrait && (
          <>
            <p className="mt-9 max-w-md text-xs leading-relaxed text-cream/60">{content.copy.proof}</p>
            <p className="mt-2 max-w-md text-xs text-cream/45">{content.copy.built}</p>
          </>
        )}
        {portrait && (
          <p className="mt-4 text-center text-xs text-cream/55">
            Phone struggling?{' '}
            <a href="?view=2d" className="underline underline-offset-2 text-cream/75">
              Switch to the lite version
            </a>
          </p>
        )}
      </Zone>
    </>
  );
}
