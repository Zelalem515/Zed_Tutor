import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X, ArrowRight } from 'lucide-react';

const LOGO_SRC = '/assets/branding/logo.png';

function BrandLogo() {
  const [imgFailed, setImgFailed] = useState(false);

  if (!imgFailed) {
    return (
      <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-transparent flex-shrink-0">
        <img
          src={LOGO_SRC}
          alt="ZED_Tutor logo"
          className="w-full h-full object-contain"
          onError={() => setImgFailed(true)}
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 to-academic-500 flex items-center justify-center flex-shrink-0 shadow-sm">
      <GraduationCap className="w-5 h-5 text-gold-400" />
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen]         = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // Add shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Home',              path: '/' },
    { name: 'About',             path: '/about' },
    { name: 'Academic Evidence', path: '/academic-evidence' },
    { name: 'Tutoring',          path: '/tutoring' },
    { name: 'Certificates',      path: '/certificates' },
    { name: 'Testimonials',      path: '/testimonials' },
    { name: 'Contact',           path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`sticky top-0 z-50 bg-white/96 backdrop-blur-md border-b border-slate-100 transition-shadow duration-200 ${
      scrolled ? 'shadow-[0_2px_12px_rgba(0,0,0,0.07)]' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* ── Brand ── */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="ZED_Tutor — home">
            <div className="group-hover:scale-105 transition-transform duration-200">
              <BrandLogo />
            </div>
            <div>
              <span className="text-[18px] font-bold tracking-tight text-navy-950 block leading-none" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                ZED<span className="text-academic-500">_Tutor</span>
              </span>
              <span className="text-[11px] font-medium text-slate-400 block tracking-wide mt-0.5">
                Zelalem Birhan
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-3.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                  isActive(link.path)
                    ? 'text-academic-600 bg-academic-50 font-semibold'
                    : 'text-slate-600 hover:text-academic-600 hover:bg-[#EFF6FF]'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-academic-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex items-center">
            <Link
              to="/contact#inquiry"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 shadow-sm hover:shadow-card-md transition-all duration-200 active:scale-[0.98]"
              style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
            >
              Request Tutoring
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex lg:hidden p-2.5 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-50 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-3 pb-5 space-y-0.5 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-academic-600 bg-academic-50 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 mt-2">
            <Link
              to="/contact#inquiry"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 shadow-sm transition-colors"
            >
              Request Tutoring
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
