import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = ({ activeSection, setActiveSection, isAdminLoggedIn, onAdminClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Journey', id: 'welfare' },
    { label: 'Filmography', id: 'filmography' },
    { label: 'Gallery', id: 'media-library' },
    { label: 'Updates', id: 'news' },
    { label: 'Contact', id: 'contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 110; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-[110px] z-50 transition-all duration-300 flex items-center glass-navbar shadow-lg">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-[110px]">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer flex items-center gap-4" onClick={() => handleNavClick('home')}>
            <img 
              src="/logo.png" 
              className="w-[110px] h-[110px] object-contain rounded-full border border-primary/20 shadow-md" 
              alt="Gautham Ram Karthik Logo" 
            />
            <span className="font-extrabold text-lg sm:text-xl md:text-2xl tracking-wider text-white uppercase whitespace-nowrap">
              Gautham Ram <span className="text-primary text-glow-gold">Karthik</span>
            </span>
          </div>

          {/* Desktop Menu & CTA */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <div className="flex items-center space-x-4 xl:space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-xs xl:text-base font-extrabold tracking-wide uppercase transition-colors duration-200 nav-link-hover ${
                    activeSection === item.id 
                      ? 'text-primary text-glow-gold' 
                      : 'text-gray-300 hover:text-primary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handleNavClick('fan-club')}
              className="px-5 py-2.5 bg-accent text-white border border-primary/30 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-black hover:border-primary transition-all duration-300 shadow-blue-glow hover:shadow-gold-glow-intense cursor-pointer"
            >
              Member Registration
            </button>
            
            {isAdminLoggedIn && (
              <button
                onClick={onAdminClick}
                className="px-5 py-2.5 bg-primary text-black border border-primary rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:border-white transition-all duration-300 shadow-gold-glow cursor-pointer"
              >
                Admin Panel
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-screen border-b border-white/10 bg-background/95 backdrop-blur-lg' : 'max-h-0'
      }`}>
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 flex flex-col items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full py-3 text-center text-base font-medium transition-colors border-b border-white/5 last:border-0 ${
                activeSection === item.id 
                  ? 'text-primary' 
                  : 'text-gray-300 hover:text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('fan-club')}
            className="w-4/5 my-4 py-2.5 bg-accent text-white border border-primary/30 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-black hover:border-primary transition-all text-center"
          >
            Member Registration
          </button>
          
          {isAdminLoggedIn && (
            <button
              onClick={() => { setIsOpen(false); onAdminClick(); }}
              className="w-4/5 my-2 py-2.5 bg-primary text-black border border-primary rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-all text-center"
            >
              Admin Panel
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
