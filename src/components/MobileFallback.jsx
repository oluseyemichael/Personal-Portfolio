import { useCallback, useEffect, useRef, useState } from 'react';
import { content } from '../config/content.js';
// AI guide is switched off for now. To bring it back, uncomment the import and the element, and set ANTHROPIC_API_KEY.
// import { AICompanion } from './AICompanion.jsx';
import { AboutExtras } from './AboutExtras.jsx';
import { ProjectDetail } from './ProjectDetail.jsx';
import { goToZone } from '../lib/navigate.js';
import { trackEvent } from '../analytics.js';

/**
 * The 2D edition of the site: phones, small windows, and browsers without
 * WebGL. Same identity as the 3D experience (editorial serif, one amber
 * accent on graphite, the five-layer idea) in a plain, fast, accessible
 * scroll. No canvas, no scroll hijacking.
 */

const SECTIONS = [
  { key: 'landing', nav: 'Top', layer: 'Product' },
  { key: 'about', nav: 'About', layer: 'Application' },
  { key: 'work', nav: 'Work', layer: 'Server' },
  { key: 'skills', nav: 'Skills', layer: 'Network' },
  { key: 'contact', nav: 'Contact', layer: 'Bare metal' },
];

/** Fades content up once as it enters the viewport. */
function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} ${className}`}
    >
      {children}
    </div>
  );
}

function Kicker({ n, children }) {
  return (
    <p className="flex items-center gap-3 mb-4 text-xs uppercase tracking-[0.24em] text-gold-500">
      <span className="tabular-nums">{n}</span>
      <span className="w-8 h-px bg-gold-500/50" />
      <span className="text-cream/70">{children}</span>
    </p>
  );
}

const h2 = 'font-display font-light text-cream leading-[1.06] tracking-[-0.02em] text-[clamp(2rem,9vw,3rem)]';
const link =
  'underline underline-offset-4 decoration-cream/30 hover:decoration-gold-500 hover:text-gold-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500';

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MobileFallback() {
  const [active, setActive] = useState('landing');
  const [selected, setSelected] = useState(null);

  // Highlight the nav tab for the section currently in view.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id.replace('zone-', ''));
        });
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(`zone-${s.key}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const openProject = useCallback((project) => {
    trackEvent('project_click', { project: project.id });
    setSelected(project);
  }, []);
  const closeProject = useCallback(() => setSelected(null), []);

  const wrap = 'mx-auto w-full max-w-2xl px-5 sm:px-8';

  return (
    <div className="relative min-h-dvh bg-navy-950 text-cream overflow-x-hidden font-body">
      {/* Sticky header: name + section tabs */}
      <header
        className="sticky top-0 z-30 bg-navy-950/90 backdrop-blur-md border-b border-cream/10"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className={`${wrap} flex items-center justify-between h-14`}>
          <a href="#zone-landing" className="font-display text-lg tracking-tight" aria-label="Michael Oluseye, back to top">
            Michael Oluseye
          </a>
        </div>
        <nav aria-label="Sections" className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className={`${wrap} flex justify-between min-w-max sm:min-w-0 sm:justify-start sm:gap-1`}>
            {SECTIONS.map((s) => {
              const on = active === s.key;
              return (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => goToZone(s.key)}
                    aria-current={on ? 'true' : undefined}
                    className={`relative h-11 px-2 sm:px-3 text-xs uppercase tracking-[0.14em] sm:tracking-[0.2em] whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500 ${
                      on ? 'text-gold-500' : 'text-cream/60 hover:text-cream'
                    }`}
                  >
                    {s.nav}
                    <span
                      className={`absolute left-2 right-2 sm:left-3 sm:right-3 bottom-0 h-0.5 bg-gold-500 origin-left transition-transform duration-300 ${
                        on ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section id="zone-landing" className="relative scroll-mt-28 pt-14 pb-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #FFC145 0%, transparent 70%)' }}
          />
          <div className={`${wrap} relative`}>
            <p className="mb-5 text-xs uppercase tracking-[0.24em] text-cream/65">
              {content.name} &nbsp;/&nbsp; {content.location}
            </p>
            <h1 className="font-display font-light leading-[0.98] tracking-[-0.03em] text-[clamp(3.5rem,19vw,6.5rem)] mb-6">
              Every <em className="italic text-gold-500">layer.</em>
            </h1>
            <p className="text-lg sm:text-xl text-cream/90 leading-relaxed mb-4">{content.copy.hero}</p>
            <p className="text-base text-cream/70 leading-relaxed mb-10">{content.bio.short}</p>

            {/* The five layers, as a tappable index */}
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-cream/65">Descend</p>
            <ol className="space-y-2">
              {SECTIONS.map((s, i) => (
                <li key={s.key} style={{ marginLeft: `${i * 6}px` }}>
                  <button
                    type="button"
                    onClick={() => goToZone(s.key)}
                    className="group w-full min-h-12 flex items-center justify-between px-4 rounded-md bg-navy-800/80 border border-cream/10 border-t-2 text-left transition-colors active:bg-navy-700 hover:border-gold-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500"
                    style={{ borderTopColor: `rgba(255,193,69,${1 - i * 0.18})` }}
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="text-xs tabular-nums text-cream/55">0{i}</span>
                      <span className="text-sm uppercase tracking-[0.18em] text-cream/90">{s.layer}</span>
                    </span>
                    <span className="text-gold-500 transition-transform group-hover:translate-x-0.5">
                      <Chevron />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ABOUT */}
        <section id="zone-about" className="scroll-mt-28 py-16 border-t border-cream/10">
          <Reveal className={wrap}>
            <Kicker n="01">About</Kicker>
            <h2 className={`${h2} mb-6`}>{content.bio.headline}</h2>
            <p className="text-base text-cream/80 leading-relaxed">{content.bio.body}</p>
            <AboutExtras />
          </Reveal>
        </section>

        {/* WORK */}
        <section id="zone-work" className="scroll-mt-28 py-16 border-t border-cream/10">
          <div className={wrap}>
            <Reveal>
              <Kicker n="02">Work</Kicker>
              <h2 className={`${h2} mb-8`}>{content.copy.workHeading}</h2>
            </Reveal>
            <ul className="border-t border-cream/10">
              {content.projects.map((project, i) => (
                <li key={project.id} className="border-b border-cream/10">
                  <button
                    type="button"
                    onClick={() => openProject(project)}
                    className="group w-full min-h-[76px] flex items-center gap-4 py-4 text-left cursor-pointer active:bg-cream/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500"
                  >
                    <span className="text-xs tabular-nums text-cream/55 w-6 shrink-0 self-start pt-1.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-display text-xl sm:text-2xl text-cream group-hover:text-gold-500 transition-colors">
                        {project.title}
                      </span>
                      <span className="block text-sm text-cream/65 mt-0.5">{project.role}</span>
                      <span className="block text-sm text-cream/75 mt-2 leading-snug">{project.highlight}</span>
                    </span>
                    <span className="text-gold-500 shrink-0">
                      <Chevron />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SKILLS */}
        <section id="zone-skills" className="scroll-mt-28 py-16 border-t border-cream/10">
          <Reveal className={wrap}>
            <Kicker n="03">Skills</Kicker>
            <h2 className={`${h2} mb-8`}>{content.copy.skillsHeading}</h2>
            <dl className="space-y-6">
              {content.skills
                .filter((g) => g.items?.length)
                .map((group) => (
                  <div key={group.group}>
                    <dt className="mb-2 text-xs uppercase tracking-[0.2em] text-gold-500">{group.group}</dt>
                    <dd className="text-[15px] text-cream/80 leading-relaxed">{group.items.join('  ·  ')}</dd>
                  </div>
                ))}
            </dl>
          </Reveal>
        </section>

        {/* CONTACT */}
        <section id="zone-contact" className="scroll-mt-28 py-16 border-t border-cream/10">
          <Reveal className={wrap}>
            <Kicker n="04">Contact</Kicker>
            <h2 className={`${h2} mb-3`}>{content.copy.contactHeading}</h2>
            <p className="text-sm text-cream/65 mb-8">{content.copy.contactNote}</p>
            <a
              href={`mailto:${content.contact.email}`}
              className="flex items-center justify-center min-h-12 px-6 rounded-full bg-gold-500 text-navy-950 font-medium text-[15px] break-all text-center hover:bg-gold-400 active:bg-gold-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
            >
              {content.contact.email}
            </a>
            <ul className="mt-4 divide-y divide-cream/10 border-y border-cream/10">
              {[
                ['LinkedIn', content.contact.linkedin],
                ['GitHub', content.contact.github],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between min-h-12 text-[15px] text-cream/85 hover:text-gold-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500"
                  >
                    {label}
                    <Chevron />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gold-500">Credentials</p>
              <ul className="space-y-2 text-sm text-cream/75 leading-snug">
                {content.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-cream/10 pt-8 pb-28" style={{ paddingBottom: 'max(7rem, env(safe-area-inset-bottom))' }}>
        <div className={`${wrap} flex flex-wrap items-center justify-between gap-3 text-xs text-cream/60`}>
          <span>&copy; {new Date().getFullYear()} {content.name}</span>
          <span className="basis-full text-cream/50">{content.copy.built}</span>
          <a href="?view=3d" className={link}>
            Open the 3D experience
          </a>
        </div>
      </footer>

      <ProjectDetail project={selected} onClose={closeProject} />
      {/* <AICompanion /> */}
    </div>
  );
}
