import { content } from '../config/content.js';

/**
 * 2D fallback for narrow viewports and no-WebGL devices. Same identity
 * (dark navy, warm gold glow, same fonts and copy) as the 3D experience,
 * but plain stacked scroll - no canvas, no scroll hijacking.
 */
function Glow({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl opacity-30 ${className}`}
      style={{ background: 'radial-gradient(circle, #FFC145 0%, transparent 70%)' }}
    />
  );
}

function SectionKicker({ children }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-8 h-px bg-gold-500/50" />
      <p className="font-mono text-[10px] text-gold-400/90 tracking-[0.35em] uppercase">
        {children}
      </p>
    </div>
  );
}

function ProjectCard({ project, index }) {
  return (
    <div className="relative border border-cream/10 rounded-lg p-6 bg-navy-900/60">
      <p className="font-mono text-[10px] text-gold-400/60 mb-3">0{index + 1}</p>
      <h3 className="font-display text-xl text-cream font-light mb-1">{project.title}</h3>
      <p className="font-body text-sm text-cream/45 mb-4">{project.subtitle}</p>
      <p className="font-body text-sm text-cream/65 leading-relaxed mb-5">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {project.tech.map((t) => (
          <span key={t} className="font-mono text-[10px] text-cream/60 border border-cream/15 rounded-full px-2.5 py-1">
            {t}
          </span>
        ))}
      </div>
      <p className="font-body text-sm italic text-gold-400/90">{project.highlight}</p>
    </div>
  );
}

export function MobileFallback() {
  return (
    <div className="relative min-h-screen bg-navy-950 text-cream overflow-x-hidden">
      <Glow className="w-72 h-72 -top-20 -right-20" />
      <Glow className="w-64 h-64 top-[120vh] -left-20" />

      {/* HERO */}
      <section className="relative px-6 pt-24 pb-20 flex flex-col justify-end min-h-[90vh]">
        <p className="font-mono text-[10px] text-cream/40 tracking-[0.35em] uppercase mb-6">
          {content.name} &nbsp;&mdash;&nbsp; {content.location}
        </p>
        <h1 className="font-display text-5xl font-light leading-[0.95] mb-6">
          Every<span className="italic text-gold-400"> layer</span>.
        </h1>
        <p className="font-body text-base text-cream/55 leading-relaxed mb-2">
          {content.bio.short}
        </p>
        <p className="font-mono text-[10px] text-cream/35 tracking-[0.3em] uppercase mt-10">
          Scroll to explore
        </p>
      </section>

      {/* ABOUT */}
      <section className="relative px-6 py-20 border-t border-cream/5">
        <SectionKicker>Layer 01 / Application</SectionKicker>
        <h2 className="font-display text-3xl font-light leading-tight mb-6">
          From server racks to <span className="italic text-gold-400">product strategy</span>.
        </h2>
        <p className="font-body text-base text-cream/60 leading-relaxed">{content.bio.body}</p>
      </section>

      {/* WORK */}
      <section className="relative px-6 py-20 border-t border-cream/5">
        <SectionKicker>Layer 02 / Server</SectionKicker>
        <h2 className="font-display text-3xl font-light leading-tight mb-8">
          Built and <span className="italic text-gold-400">shipped</span>.
        </h2>
        <div className="flex flex-col gap-5">
          {content.projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section className="relative px-6 py-20 border-t border-cream/5">
        <SectionKicker>Layer 03 / Network</SectionKicker>
        <h2 className="font-display text-3xl font-light leading-tight mb-8">
          The full stack, <span className="italic text-gold-400">literally</span>.
        </h2>
        <div className="flex flex-col gap-6">
          {content.skills.map((group) => (
            <div key={group.group}>
              <p className="font-mono text-[10px] text-gold-400/70 tracking-[0.25em] uppercase mb-2">
                {group.group}
              </p>
              <p className="font-body text-sm text-cream/55 leading-relaxed">
                {group.items.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="relative px-6 py-24 border-t border-cream/5">
        <SectionKicker>Layer 04 / Bare Metal</SectionKicker>
        <h2 className="font-display text-3xl font-light leading-tight mb-4">
          Let&rsquo;s build something that <span className="italic text-gold-400">holds up</span>.
        </h2>
        <p className="font-body text-cream/45 mb-8">{content.location}</p>
        <div className="flex flex-col gap-4 font-body text-base">
          <a
            href={`mailto:${content.contact.email}`}
            className="text-cream/80 hover:text-gold-400 transition-colors underline underline-offset-8 decoration-gold-400/30"
          >
            {content.contact.email}
          </a>
          <a
            href={content.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/80 hover:text-gold-400 transition-colors underline underline-offset-8 decoration-gold-400/30"
          >
            LinkedIn
          </a>
          <a
            href={content.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/80 hover:text-gold-400 transition-colors underline underline-offset-8 decoration-gold-400/30"
          >
            GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
