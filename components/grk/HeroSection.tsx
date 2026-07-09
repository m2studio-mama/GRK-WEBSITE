'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Play, Star, Award, Film } from 'lucide-react';

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [count, setCount] = useState({ movies: 0, fans: 0, awards: 0 });
  const countersRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const target = countersRef.current;
    if (!target) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const targets = { movies: 20, fans: 1200, awards: 12 };
        const duration = 1800;
        const steps = 50;
        const increment = duration / steps;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const progress = step / steps;
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount({
            movies: Math.floor(targets.movies * ease),
            fans: Math.floor(targets.fans * ease),
            awards: Math.floor(targets.awards * ease),
          });
          if (step >= steps) clearInterval(timer);
        }, increment);
      }
    }, { threshold: 0.3 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-[125px] pb-12"
      aria-label="Gautham Ram Karthik Fan Club Hero"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0B0F19]">
        {/* Hero Background Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover lg:bg-contain bg-center bg-no-repeat scale-105 animate-zoom-in opacity-85"
          style={{ backgroundImage: "url('/hero_banner.jpg')" }}
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/30 via-transparent to-[#0B0F19]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-transparent to-[#0B0F19]" />

        {/* Film grain texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

        {/* Decorative animated circles */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#FFD700]/5 blur-3xl animate-spin-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#E50914]/5 blur-3xl" style={{ animation: 'spin-slow 30s linear infinite reverse' }} />
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
          <Star size={12} className="text-[#FFD700] fill-[#FFD700]" />
          <span className="text-[#FFD700] text-[10px] font-black uppercase tracking-[0.3em]">Official Fan Club</span>
          <Star size={12} className="text-[#FFD700] fill-[#FFD700]" />
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none mb-6 animate-fade-in-up delay-100 uppercase whitespace-nowrap">
          GAUTHAM RAM KARTHIK
        </h1>

        <p className="text-black text-sm sm:text-base font-serif max-w-lg mx-auto mb-10 leading-relaxed text-balance animate-fade-in-up delay-200 font-bold">
          Son of Navarasa Nayagan Karthik. Grandson of legendary R. Muthuraman. <br />
          A rising force in Tamil cinema — action hero, award-winner, icon.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
          <button
            onClick={() => document.getElementById('fan-club')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-6 py-3 bg-[#FFD700] text-[#0B0F19] rounded font-black text-sm uppercase tracking-wider hover:bg-white transition-all shadow-gold-glow hover:scale-105"
          >
            <Star size={14} fill="currentColor" />
            Join the Fan Club
          </button>
          <button
            onClick={() => document.getElementById('filmography')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white border border-white/15 rounded font-bold text-sm uppercase tracking-wider hover:bg-white/10 hover:border-[#FFD700]/40 transition-all"
          >
            <Film size={14} />
            Filmography
          </button>
        </div>

        {/* Counters */}
        <div ref={countersRef} className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-8 max-w-md mx-auto animate-fade-in-up delay-400">
          {[
            { label: 'Films', value: count.movies, suffix: '+', icon: Film },
            { label: 'Fan Members', value: count.fans.toLocaleString('en-IN'), suffix: '+', icon: Star },
            { label: 'Awards', value: count.awards, suffix: '+', icon: Award },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#FFD700] text-glow-gold">{item.value}{item.suffix}</div>
              <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-[#FFD700] transition-colors animate-float"
        aria-label="Scroll to About section"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.25em]">Scroll</span>
        <ChevronDown size={18} />
      </button>
    </section>
  );
}
