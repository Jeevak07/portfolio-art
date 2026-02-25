import { Link, NavLink } from 'react-router-dom';

export default function Navbar({
  navOpen,
  setNavOpen,
  showAdminLink,
  onAdminClick,
  placeholderProfile,
}) {
  return (
    <header className="fixed top-0 z-30 w-full border-b border-white/10 bg-[#0b0b0c]/70 py-1.5 backdrop-blur-md">
      <nav className="mx-auto flex w-full items-center justify-between gap-4 px-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-white/15 bg-[#1b1b20] shadow-soft">
            <img src="/sketchwew_logo.jpg" alt="Sketchwew logo" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-display text-2xl font-semibold tracking-[0.18em] md:text-3xl md:tracking-[0.24em]">
              {placeholderProfile.name}
            </p>
            <p className="text-[10px] uppercase tracking-[0.32em] text-ink/60 md:text-xs md:tracking-[0.38em]">
              Drawing Portfolio
            </p>
          </div>
        </div>

        {showAdminLink && (
          <button
            className="btn-animate hidden rounded-full border border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-ink/70 md:inline-flex"
            onClick={onAdminClick}
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

        <div className="glass-nav hidden gap-5 rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-ink/70 sm:text-xs md:flex md:text-sm md:tracking-[0.3em]">
          <NavLink to="/" className="hover:text-ink">Works</NavLink>
          <a href="/#about" className="hover:text-ink">About</a>
          <a href="/#process" className="hover:text-ink">Process</a>
          <a href="/#contact" className="hover:text-ink">Contact</a>
          <a
            href={`https://instagram.com/${placeholderProfile.instagramId}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            @{placeholderProfile.instagramId}
          </a>
        </div>
      </nav>

      {navOpen && (
        <div className="mt-3 px-3 md:hidden">
          <div className="glass-nav animate-fadeDown flex flex-col gap-3 rounded-2xl px-4 py-4 text-xs uppercase tracking-[0.3em] text-ink/80">
            <Link to="/" onClick={() => setNavOpen(false)} className="hover:text-ink">Works</Link>
            <a href="/#about" onClick={() => setNavOpen(false)} className="hover:text-ink">About</a>
            <a href="/#process" onClick={() => setNavOpen(false)} className="hover:text-ink">Process</a>
            <a href="/#contact" onClick={() => setNavOpen(false)} className="hover:text-ink">Contact</a>
            <a
              href={`https://instagram.com/${placeholderProfile.instagramId}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              @{placeholderProfile.instagramId}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
