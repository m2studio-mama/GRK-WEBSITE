'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Film, Image, Newspaper, Users, Mail, Star, Home, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '#home', icon: Home },
  { label: 'About', href: '#about', icon: Star },
  { label: 'Filmography', href: '#filmography', icon: Film },
  { label: 'Media', href: '#media-library', icon: Image },
  { label: 'News', href: '#news', icon: Newspaper },
  { label: 'Fan Club', href: '#fan-club', icon: Users },
  { label: 'Contact', href: '#contact', icon: Mail },
];

interface NavbarProps {
  onAdminClick: () => void;
}

export default function Navbar({ onAdminClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = NAV_LINKS.map(l => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActive(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 h-[110px] flex items-center glass-navbar shadow-lg`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-[110px]">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('#home')}
              className="flex items-center gap-4 group text-left"
              aria-label="Gautham Ram Karthik Fan Club Home"
            >
              <img
                src="/logo.png"
                className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] object-contain rounded-full border border-[#FFD700]/20 shadow-md transition-transform duration-300 group-hover:scale-105"
                alt="Gautham Ram Karthik Logo"
              />
              <span className="font-extrabold text-sm sm:text-base md:text-xl tracking-wider text-white uppercase whitespace-nowrap">
                Gautham Ram <span className="text-[#FFD700] text-glow-gold">Karthik</span>
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`relative px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-full nav-link-hover ${
                    active === link.href.replace('#', '')
                      ? 'text-[#FFD700]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {active === link.href.replace('#', '') && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD700]" />
                  )}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onAdminClick}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFD700] text-[#0B0F19] rounded text-[10px] font-black uppercase tracking-wider hover:bg-white transition-colors shadow-gold-glow"
                aria-label="Admin Dashboard"
              >
                Admin
              </button>

              {/* Mobile Hamburger */}
              <button
                className="lg:hidden p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-[#0B0F19]/98 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  active === link.href.replace('#', '')
                    ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon size={16} className="flex-shrink-0" />
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { setMobileOpen(false); onAdminClick(); }}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-3 mt-2 bg-[#FFD700] text-[#0B0F19] rounded-lg text-sm font-black uppercase tracking-wider"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
