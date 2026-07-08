import React from 'react';
import { Award, Star, Milestone } from 'lucide-react';

const Achievements = ({ timelineItems }) => {
  return (
    <section className="py-24 bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-20">
          <p className="text-primary text-xs uppercase tracking-[0.2em] font-semibold mb-2">Hall of Fame</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Milestones & <span className="text-primary text-glow-gold">Achievements</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-4 rounded-full" />
        </div>

        {/* Vertical Timeline Wrapper */}
        <div className="relative">
          {/* Vertical Middle Line (Desktop) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/80 via-accent/30 to-primary/80 -translate-x-1/2" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {timelineItems.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={idx}
                  className={`flex flex-col md:flex-row items-stretch ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Left/Right Card spacer */}
                  <div className="hidden md:block w-1/2" />

                  {/* Dot Indicator */}
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-black border-2 border-primary -translate-x-1/2 flex items-center justify-center shadow-gold-glow z-10">
                    <Star className="text-primary w-3.5 h-3.5 fill-current" />
                  </div>

                  {/* Content Card Panel */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12">
                    <div className="glass-card glass-card-hover p-6 sm:p-8 rounded-xl relative border border-white/5 hover:border-primary/20">
                      
                      {/* Year Indicator */}
                      <span className="inline-block text-black font-extrabold text-sm bg-primary px-3 py-1 rounded-full mb-4 shadow-gold-glow">
                        {item.year}
                      </span>

                      <h3 className="text-white text-lg sm:text-xl font-bold tracking-tight mb-3">
                        {item.title}
                      </h3>

                      <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
