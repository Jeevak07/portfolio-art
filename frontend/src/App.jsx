import { useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || '';


const placeholderProfile = {
  name: 'Jeeva K',
  tagline: 'Anime sketches and pencil portraits.',
  location: 'India,TN',
  availability: 'Run by Sketchwew',
  about:'I like to draw anime characters and human potraits. Pencil sketches and portraits are my favorite. I also do custom commissions. I have been drawing for many years and have a collection of 5+ sketchbooks filled with my art.Check out my Instagram(@sketchwew) for more of my work and updates.',
  whatsappNumber: '9952859522',
  instagramId: 'sketchwew',
};

const stats = [
  { label: 'Anime Sketches', value: '80+' },
  { label: 'Human Portraits', value: '50+' },
  { label: 'Sketchbooks', value: '5+' },
];

const process = [
  {
    step: '01',
    title: 'Mood Board',
    text: 'We gather references and decide on vibe, color, and emotion.',
  },
  {
    step: '02',
    title: 'Line Sketch',
    text: 'Loose anime linework, pose variations, and composition flow.',
  },
  {
    step: '03',
    title: 'Hatch Shading',
    text: 'Gentle values, subtle blush, and clean details.',
  },
  {
    step: '04',
    title: 'Final Touches',
    text: 'Glow, texture, and export in high resolution.',
  },
];

const highlights = [
  'Soft anime portraits with delicate linework',
  'Cozy background studies and gentle lighting',
  'Custom commissions for characters and scenes',
];

function classNames(...items) {
  return items.filter(Boolean).join(' ');
}

function App() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('All');
  const [selectedWork, setSelectedWork] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('adminKey') || '');
  const [adminMode, setAdminMode] = useState(() => Boolean(sessionStorage.getItem('adminKey')));
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [navOpen, setNavOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);
  const [showAdminSection, setShowAdminSection] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function loadWorks() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/works`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Failed to load works');
        const data = await response.json();
        if (!isActive) return;
        setWorks(data.items || []);
        setLoadError(false);
      } catch (error) {
        if (!isActive || controller.signal.aborted || error?.name === 'AbortError') {
          return;
        }
        try {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const retryResponse = await fetch(`${API_BASE}/api/works`, {
            signal: controller.signal,
          });
          if (!retryResponse.ok) throw new Error('Retry failed');
          const retryData = await retryResponse.json();
          if (!isActive) return;
          setWorks(retryData.items || []);
          setLoadError(false);
        } catch (retryError) {
          if (!isActive || controller.signal.aborted || retryError?.name === 'AbortError') {
            return;
          }
          setWorks([]);
          setLoadError(true);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadWorks();

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-6');
      revealObserver.observe(el);
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1') {
      setShowAdminLink(true);
      setShowAdminSection(true);
    }

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? Math.min(scrollTop / height, 1) : 0;
      setScrollProgress(progress);
      setShowTop(scrollTop > 520);
    };

    const onMouseMove = (event) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 18;
      const y = (event.clientY / innerHeight - 0.5) * 18;
      setParallaxOffset({ x, y });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove);
    onScroll();

    return () => {
      isActive = false;
      controller.abort();
      revealObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const tags = useMemo(() => {
    const unique = new Set(['All']);
    works.forEach((work) => unique.add(work.tag || 'Sketch'));
    return Array.from(unique);
  }, [works]);

  const filteredWorks = useMemo(() => {
    if (activeTag === 'All') return works;
    return works.filter((work) => work.tag === activeTag);
  }, [activeTag, works]);

  async function handleUpload(event) {
    event.preventDefault();
    setUploadError('');

    const formData = new FormData(event.currentTarget);
    const file = formData.get('image');
    if (!file || !file.name) {
      setUploadError('Please select an image.');
      return;
    }

    try {
      setUploading(true);
      const response = await fetch(`${API_BASE}/api/works`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Admin-Key': adminKey,
        },
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      setWorks((prev) => [data, ...prev]);
      event.currentTarget.reset();
    } catch (error) {
      setUploadError('Upload failed. Check admin access and backend.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(workId) {
    if (!workId) return;
    setDeleteTarget(workId);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      const response = await fetch(`${API_BASE}/api/works/${deleteTarget}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Key': adminKey,
        },
      });
      if (!response.ok) throw new Error('Delete failed');
      setWorks((prev) => prev.filter((item) => item.id !== deleteTarget));
      setSelectedWork(null);
    } catch (error) {
      setUploadError('Delete failed. Check admin access and backend.');
    } finally {
      setDeleteTarget(null);
    }
  }

  function cancelDelete() {
    setDeleteTarget(null);
  }

  function handleAdminLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const key = formData.get('adminKey');
    if (!key || !String(key).trim()) {
      setUploadError('Enter admin key.');
      return;
    }
    const trimmed = String(key).trim();
    sessionStorage.setItem('adminKey', trimmed);
    setAdminKey(trimmed);
    setAdminMode(true);
    setShowAdminSection(true);
    setUploadError('');
    event.currentTarget.reset();
  }

  function handleAdminLogout() {
    sessionStorage.removeItem('adminKey');
    setAdminKey('');
    setAdminMode(false);
    setShowAdminSection(false);
  }

  return (
    <div className="relative overflow-hidden text-ink">
      <div className="noise pointer-events-none fixed inset-0 z-0" />
      <div className="stars z-0" />
      <div className="pointer-events-none fixed -top-24 right-0 z-0 h-64 w-64 rounded-full bg-ember/10 blur-3xl float-layer soft-pulse" />
      <div className="pointer-events-none fixed bottom-0 left-0 z-0 h-72 w-72 rounded-full bg-moss/10 blur-3xl float-layer soft-pulse" />
      <div className="fixed left-0 top-0 z-20 h-1 w-full bg-white/5">
        <div
          className="scroll-progress h-full"
          style={{ width: `${Math.round(scrollProgress * 100)}%` }}
        />
      </div>

      <header className="relative z-10 px-5 pt-8 md:px-12">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full border border-white/15 bg-[#1b1b20] shadow-soft">
              <img
                src="/sketchwew_logo.jpg"
                alt="Sketchwew logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-display text-xl tracking-[0.2em] md:text-2xl md:tracking-[0.3em]">{placeholderProfile.name}</p>
              <p className="text-[10px] uppercase tracking-[0.35em] text-ink/60 md:text-xs md:tracking-[0.4em]">Drawing Portfolio</p>
              <a
                href={`https://instagram.com/${placeholderProfile.instagramId}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-[10px] uppercase tracking-[0.3em] text-ink/50 hover:text-ink md:text-xs"
              >
                @{placeholderProfile.instagramId}
              </a>
            </div>
          </div>
          {showAdminLink && (
            <button
              className="btn-animate hidden rounded-full border border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-ink/70 md:inline-flex"
              onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Admin
            </button>
          )}
          <button
            className="glass-nav flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden"
            onClick={() => setNavOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <div className="glass-nav hidden gap-4 rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-ink/70 sm:text-xs md:flex md:text-sm md:tracking-[0.3em]">
            <a href="#works" className="hover:text-ink">Works</a>
            <a href="#about" className="hover:text-ink">About</a>
            <a href="#process" className="hover:text-ink">Process</a>
            <a href="#contact" className="hover:text-ink">Contact</a>
          </div>
        </nav>
        {navOpen && (
          <div className="mt-4 md:hidden">
            <div className="glass-nav flex flex-col gap-3 rounded-2xl px-4 py-4 text-xs uppercase tracking-[0.3em] text-ink/80">
              <a href="#works" onClick={() => setNavOpen(false)} className="hover:text-ink">Works</a>
              <a href="#about" onClick={() => setNavOpen(false)} className="hover:text-ink">About</a>
              <a href="#process" onClick={() => setNavOpen(false)} className="hover:text-ink">Process</a>
              <a href="#contact" onClick={() => setNavOpen(false)} className="hover:text-ink">Contact</a>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 px-5 pb-16 md:px-12">
        <section className="mx-auto mt-12 flex max-w-6xl flex-col gap-10 lg:mt-16 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
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
            <p className="mt-5 max-w-xl text-base text-ink/70 md:text-lg">
              {placeholderProfile.about}
            </p>
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

        <section id="works" className="mx-auto mt-20 max-w-6xl reveal md:mt-24" data-reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="section-subtitle text-xs uppercase text-ink/50">Gallery</p>
              <h2 className="mt-3 font-display text-4xl tracking-[0.08em] md:text-5xl">My Works</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className={classNames(
                    'btn-animate glass-chip rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.28em] transition md:text-xs',
                    activeTag === tag
                      ? 'chip-active text-ink shadow-glow'
                      : 'text-ink/70 hover:text-ink'
                  )}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="skeleton animate-shimmer h-72 rounded-3xl"
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loadError && (
                <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-white/10 bg-[#121216] p-4 text-sm text-ink/70">
                  Backend is offline — connect the server to load your uploads.
                </div>
              )}
              {!loadError && filteredWorks.length === 0 && (
                <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-white/10 bg-[#121216] p-6 text-sm text-ink/70">
                  No artworks yet. Log in as admin and upload your first drawing.
                </div>
              )}
              {filteredWorks.map((work) => (
                <button
                  key={work.id}
                  className="group text-left"
                  onClick={() => setSelectedWork(work)}
                >
                  <div
                    className={classNames(
                      'overflow-hidden rounded-3xl glass-soft hover-lift',
                      selectedWork?.id === work.id ? 'ring-2 ring-ember/80 shadow-glow' : ''
                    )}
                  >
                    <div className="relative h-80 w-full">
                      <img
                        src={work.imageUrl}
                        alt={work.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-90 transition duration-500 group-hover:opacity-60" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-ink/50">
                        <span>{work.tag || 'Sketch'}</span>
                        <span>{work.year || '2025'}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-ink">{work.title}</h3>
                      <p className="mt-2 text-sm text-ink/60">{work.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section id="about" className="mx-auto mt-20 max-w-6xl reveal md:mt-24" data-reveal>
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
                <p className="mt-2 text-sm text-ink/60">
                  I want people to stop and take a look at the work.
                </p>
              </div>
              <div className="rounded-3xl p-6 glass-soft">
                <p className="text-xs uppercase tracking-[0.4em] text-ink/50">Tools</p>
                <p className="mt-3 text-lg font-semibold">Pencil Sketches · Hatching · Clean Linework</p>
                <p className="mt-2 text-sm text-ink/60">
                  Mostly pencil work with strong hatching and texture.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="mx-auto mt-20 max-w-6xl reveal md:mt-24" data-reveal>
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

        {showAdminSection && (
          <section id="upload" className="mx-auto mt-20 max-w-6xl reveal md:mt-24" data-reveal>
            <div className="rounded-3xl p-8 glass">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="section-subtitle text-xs uppercase text-ink/50">Studio</p>
                  <h2 className="mt-3 font-display text-4xl tracking-[0.08em]">Upload New Work</h2>
                  <p className="mt-2 text-sm text-ink/60">
                    Use this panel to add new drawings. Images are stored in the Python backend.
                  </p>
                </div>
                <div className="chip rounded-full px-5 py-2 text-xs uppercase tracking-[0.3em] text-ink/70">
                  Admin Only
                </div>
              </div>
              {adminMode ? (
                <>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#1b1b20]/80 px-4 py-3 text-sm">
                    <span>Admin mode enabled</span>
                    <button
                      className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em]"
                      onClick={handleAdminLogout}
                    >
                      Logout
                    </button>
                  </div>
                  <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleUpload}>
                    <input
                      className="rounded-2xl border border-white/10 bg-[#1b1b20] px-4 py-3 text-sm text-ink placeholder:text-ink/40"
                      name="title"
                      placeholder="Artwork title"
                      required
                    />
                    <input
                      className="rounded-2xl border border-white/10 bg-[#1b1b20] px-4 py-3 text-sm text-ink placeholder:text-ink/40"
                      name="tag"
                      placeholder="Tag (Anime, Portrait...)"
                    />
                    <input
                      className="rounded-2xl border border-white/10 bg-[#1b1b20] px-4 py-3 text-sm text-ink placeholder:text-ink/40"
                      name="year"
                      placeholder="Year"
                    />
                    <input
                      className="rounded-2xl border border-white/10 bg-[#1b1b20] px-4 py-3 text-sm text-ink"
                      name="image"
                      type="file"
                      accept="image/*"
                      required
                    />
                    <textarea
                      className="md:col-span-2 rounded-2xl border border-white/10 bg-[#1b1b20] px-4 py-3 text-sm text-ink placeholder:text-ink/40"
                      name="description"
                      placeholder="Short description"
                      rows={3}
                    />
                    <div className="md:col-span-2 flex flex-wrap items-center gap-4">
                      <button
                        className="btn-animate button-primary w-full rounded-full px-6 py-3 text-xs uppercase tracking-[0.3em] sm:w-auto"
                        type="submit"
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : 'Upload Artwork'}
                      </button>
                      {uploadError && <p className="text-sm text-ember">{uploadError}</p>}
                    </div>
                  </form>
                </>
              ) : (
                <form className="mt-8 flex flex-wrap items-center gap-4" onSubmit={handleAdminLogin}>
                  <input
                    className="min-w-[220px] rounded-2xl border border-white/10 bg-[#1b1b20] px-4 py-3 text-sm text-ink placeholder:text-ink/40"
                    name="adminKey"
                    type="password"
                    placeholder="Enter admin key"
                  />
                  <button
                    className="btn-animate button-primary w-full rounded-full px-6 py-3 text-xs uppercase tracking-[0.3em] sm:w-auto"
                    type="submit"
                  >
                    Unlock
                  </button>
                  {uploadError && <p className="text-sm text-ember">{uploadError}</p>}
                </form>
              )}
            </div>
          </section>
        )}

        <section id="contact" className="mx-auto mt-20 max-w-6xl reveal md:mt-24" data-reveal>
          <div className="rounded-3xl px-10 py-12 text-ink glass md:px-16 md:py-16 lg:px-20 lg:py-20">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="section-subtitle text-xs uppercase text-ink/60">Contact</p>
                <h2 className="mt-3 font-display text-4xl tracking-[0.08em]">
                  Let&apos;s Create Something Soft
                </h2>
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
      </main>

      {selectedWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <button
            className="absolute right-6 top-6 rounded-full border border-white/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white"
            onClick={() => setSelectedWork(null)}
          >
            Close
          </button>
          <div className="w-fit max-w-[90vw] overflow-hidden rounded-3xl bg-[#121216] shadow-soft">
            <img
              src={selectedWork.imageUrl}
              alt={selectedWork.title}
              className="block h-auto w-auto max-h-[80vh] max-w-[90vw] object-contain bg-black"
            />
            <div className="p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-ink/50">
                <span>{selectedWork.tag || 'Sketch'}</span>
                <span>{selectedWork.year || '2025'}</span>
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-ink">{selectedWork.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{selectedWork.description}</p>
              {adminMode && (
                <div className="mt-6">
                  <button
                    className="btn-animate rounded-full border border-red-400/60 px-5 py-2 text-xs uppercase tracking-[0.3em] text-red-300"
                    onClick={() => handleDelete(selectedWork.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6">
          <div className="glass w-full max-w-md rounded-3xl p-6 text-ink shadow-soft">
            <p className="text-xs uppercase tracking-[0.4em] text-ink/60">Confirm Delete</p>
            <h3 className="mt-3 text-2xl font-semibold">Delete this artwork?</h3>
            <p className="mt-2 text-sm text-ink/70">
              This will remove the image and its details permanently.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="btn-animate button-ghost rounded-full px-5 py-2 text-xs uppercase tracking-[0.3em] text-ink"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="btn-animate rounded-full bg-red-500/80 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="relative z-10 mx-auto flex max-w-6xl flex-col gap-4 px-5 pb-10 text-xs text-ink/50 sm:text-sm md:flex-row md:items-center md:justify-between">
        <p>© 2026 {placeholderProfile.name}. All drawings reserved.</p>
        <p>Crafted with care in {placeholderProfile.location}.</p>
      </footer>

      {showTop && (
        <button
          className="btn-animate fixed bottom-6 right-6 z-30 rounded-full border border-white/15 bg-[#121216] px-4 py-3 text-xs uppercase tracking-[0.3em] text-ink shadow-soft"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default App;
