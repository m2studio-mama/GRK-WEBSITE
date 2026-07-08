import React from 'react';
import { ChevronDown, Users, Image as ImageIcon } from 'lucide-react';

const Hero = ({ onJoinClick, onExploreClick }) => {
  return (
    <section 
      id="home" 
      className="relative h-[calc(100vh-110px)] mt-[110px] w-full flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image with Parallax & Spotlight Effect */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover lg:bg-contain bg-center bg-no-repeat scale-105 animate-zoom-in opacity-85"
        style={{ 
          backgroundImage: `url('/hero_banner.jpg')`,
        }}
      />
      
      {/* Cinematic Color Grading overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/50 to-transparent" />
      <div className="absolute inset-0 cinematic-overlay opacity-30" />
      <div className="absolute inset-0 cinematic-overlay-top opacity-30" />
      <div className="absolute inset-0 cinematic-overlay-bottom opacity-50" />

      {/* Gold & Blue Spotlight Accent Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />

      {/* Centered Hero Content */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-4 text-center sm:px-6 lg:px-8 mt-16">
        
        <h1 
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 uppercase leading-none select-none"
          style={{ textShadow: '0 4px 15px rgba(0, 0, 0, 0.95), 0 0 35px rgba(0, 0, 0, 0.9)' }}
        >
          Gautham Ram Karthik 
          <span 
            className="block text-primary text-glow-gold bg-clip-text mt-3"
            style={{ textShadow: '0 4px 15px rgba(0, 0, 0, 0.95), 0 0 35px rgba(0, 0, 0, 0.9)' }}
          >
            Fans Club
          </span>
        </h1>
        
        <p 
          className="text-gray-100 text-lg sm:text-xl font-bold italic tracking-wider mb-12 max-w-2xl mx-auto"
          style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.95)' }}
        >
          "For Fans, By Fans. Empowering Communities Through Unity and Welfare."
        </p>

        {/* Buttons Centered */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={onJoinClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-primary text-black font-extrabold text-xs uppercase tracking-widest rounded-full hover:bg-white transition-all duration-300 shadow-gold-glow hover:shadow-white/20 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Users size={14} />
            Join Fan Club
          </button>
          
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-transparent text-white border border-white/20 font-bold text-xs uppercase tracking-widest rounded-full hover:border-primary hover:text-primary transition-all duration-300 backdrop-blur-sm hover:bg-primary/5 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <ImageIcon size={14} />
            Explore Gallery
          </button>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        onClick={() => {
          const aboutSection = document.getElementById('about');
          if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50 mb-2">Scroll Down</span>
        <ChevronDown className="text-primary animate-bounce" size={20} />
      </div>
    </section>
  );
};

export default Hero;
