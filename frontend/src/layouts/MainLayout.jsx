import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { placeholderProfile } from '../utils/constants';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [showAdminLink, setShowAdminLink] = useState(false);

  useEffect(() => {
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
    if (params.get('admin') === '1' || location.pathname === '/admin') {
      setShowAdminLink(true);
    } else {
      setShowAdminLink(false);
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
      revealObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [location.pathname, location.search]);

  return (
    <div className="relative overflow-hidden text-ink">
      <div className="noise pointer-events-none fixed inset-0 z-0" />
      <div className="stars z-0" />
      <div className="pointer-events-none fixed -top-24 right-0 z-0 h-64 w-64 rounded-full bg-ember/10 blur-3xl float-layer soft-pulse" />
      <div className="pointer-events-none fixed bottom-0 left-0 z-0 h-72 w-72 rounded-full bg-moss/10 blur-3xl float-layer soft-pulse" />

      <div className="fixed left-0 top-0 z-20 h-1 w-full bg-white/5">
        <div className="scroll-progress h-full" style={{ width: `${Math.round(scrollProgress * 100)}%` }} />
      </div>

      <Navbar
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        showAdminLink={showAdminLink}
        onAdminClick={() => navigate('/admin')}
        placeholderProfile={placeholderProfile}
      />

      <main className="relative z-10 px-0 pb-16 pt-16">
        <Outlet context={{ parallaxOffset }} />
      </main>

      <footer className="relative z-10 mx-auto flex w-full flex-col gap-4 px-6 pb-10 text-xs text-ink/50 sm:text-sm md:flex-row md:items-center md:justify-between md:px-12">
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
