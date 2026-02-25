import { useOutletContext } from 'react-router-dom';
import { highlights, placeholderProfile, process, stats } from '../utils/constants';

export default function Home() {
  const { parallaxOffset } = useOutletContext();

  return (
    <>
      <section className="mx-auto mt-12 flex w-full flex-col gap-10 px-6 lg:mt-16 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center md:px-12">
        <div className="reveal" data-reveal>
          <p className="section-subtitle text-xs uppercase text-ink/50">Portfolio</p>
          <h1
            className="parallax-title mt-4 font-display text-4xl tracking-[0.06em] sm:text-5xl md:text-7xl"
            style={{
              '--px': `${parallaxOffset.x}px`,
              '--py': `${parallaxOffset.y}px`,
            }}
          >
            {placeholderProfile.tagline}
          </h1>
          <p className="mt-5 max-w-xl text-base text-ink/70 md:text-lg">{placeholderProfile.about}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              className="btn-animate button-primary w-full rounded-full px-6 py-3 text-xs uppercase tracking-[0.3em] shadow-glow sm:w-auto md:text-sm"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Let&apos;s Talk
            </button>
            <button
              className="btn-animate button-ghost w-full rounded-full px-6 py-3 text-xs uppercase tracking-[0.3em] text-ink sm:w-auto md:text-sm"
              onClick={() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Works
            </button>
          </div>
          <div className="mt-7 flex flex-wrap gap-6 text-xs text-ink/60 sm:text-sm">
            <span>{placeholderProfile.location}</span>
            <span>{placeholderProfile.availability}</span>
          </div>
        </div>

        <div className="reveal" data-reveal>
          <div className="glow-card rounded-[28px] p-8 glass">
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#1b1b20] p-5">
                  <p className="text-3xl font-semibold text-ink">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-ink/50">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-2 text-sm text-ink/70">
              {highlights.map((item) => (
                <p key={item} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-ember" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto mt-20 w-full reveal px-6 md:mt-24 md:px-12" data-reveal>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="section-subtitle text-xs uppercase text-ink/50">About</p>
            <h2 className="mt-3 font-display text-4xl tracking-[0.08em]">Anime Artist Statement</h2>
            <p className="mt-5 text-base text-ink/70 md:text-lg">
              I started sketching anime as soon as I started watching it, beginning with my favorite shows and
              growing from there. One Piece is my all-time favorite, and I’m still pushing my style every day.
            </p>
            <div className="mt-8 rounded-3xl p-6 glass">
              <p className="text-xs uppercase tracking-[0.4em] text-ink/50">Availability</p>
              <p className="mt-3 text-lg font-semibold">{placeholderProfile.availability}</p>
              <p className="mt-2 text-sm text-ink/60">Open for commissions and collaborations.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl p-6 glass-soft">
              <p className="text-xs uppercase tracking-[0.4em] text-ink/50">Focus</p>
              <p className="mt-3 text-lg font-semibold">Anime Characters · Pencil Sketches · Portraits</p>
              <p className="mt-2 text-sm text-ink/60">I want people to stop and take a look at the work.</p>
            </div>
            <div className="rounded-3xl p-6 glass-soft">
              <p className="text-xs uppercase tracking-[0.4em] text-ink/50">Tools</p>
              <p className="mt-3 text-lg font-semibold">Pencil Sketches · Hatching · Clean Linework</p>
              <p className="mt-2 text-sm text-ink/60">Mostly pencil work with strong hatching and texture.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="mx-auto mt-20 w-full reveal px-6 md:mt-24 md:px-12" data-reveal>
        <p className="section-subtitle text-xs uppercase text-ink/50">Process</p>
        <h2 className="mt-3 font-display text-4xl tracking-[0.08em]">From Brief to Final</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((item) => (
            <div key={item.step} className="rounded-3xl p-6 glass-soft">
              <p className="text-xs uppercase tracking-[0.4em] text-ink/50">{item.step}</p>
              <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto mt-20 w-full reveal px-6 md:mt-24 md:px-12" data-reveal>
        <div className="rounded-3xl border-y border-white/10 bg-white/5 px-10 py-12 text-ink md:px-16 md:py-16 lg:px-20 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            <div>
              <p className="section-subtitle text-xs uppercase text-ink/60">Contact</p>
              <h2 className="mt-3 font-display text-4xl tracking-[0.08em]">Let&apos;s Create Something Soft</h2>
              <p className="mt-4 max-w-xl text-sm text-ink/70">
                Share your idea, references, and timeline. I&apos;ll get back to you with the next steps.
              </p>
              <div className="mt-5 text-base font-semibold text-ink/80 md:text-lg">
                Open for commissions · Collaborations · Turnaround: 2 weeks
              </div>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <a
                className="btn-animate button-ghost rounded-full px-6 py-3 text-center uppercase tracking-[0.3em] text-ink"
                href={`https://wa.me/${placeholderProfile.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp DM
              </a>
              <a
                className="btn-animate button-ghost rounded-full px-6 py-3 text-center uppercase tracking-[0.3em] text-ink"
                href={`https://instagram.com/${placeholderProfile.instagramId}`}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
