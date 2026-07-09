'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, BookOpen, Droplets, ShieldAlert, Award, HelpingHand } from 'lucide-react';

const MISSIONS = [
  {
    title: 'Medical Support',
    icon: Droplets,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&fit=crop&q=80',
    details: ['Blood Donation Camps', 'Free Medical Camps', 'Health Awareness Programs', 'Emergency Blood Support'],
  },
  {
    title: 'Food Distribution',
    icon: HelpingHand,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&fit=crop&q=80',
    details: ['Feeding Orphanage Homes', 'Homeless Food Drives', 'Disaster Hydration Support', 'Festival Feast Sponsorships'],
  },
  {
    title: 'Education Support',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&fit=crop&q=80',
    details: ['Helping Underprivileged Students', 'Stationery & Book Distribution', 'Educational Guidance Seminars', 'Free Evening Tuition Support'],
  },
  {
    title: 'Green Initiatives',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&fit=crop&q=80',
    details: ['Go-Green Awareness Drives', 'Roadside Plantation Campaigns', 'Seed-Ball Distribution', 'Water Conservation Programs'],
  },
  {
    title: 'Disaster Relief',
    icon: ShieldAlert,
    image: 'https://images.unsplash.com/photo-1461530867269-02dd941a5477?w=600&fit=crop&q=80',
    details: ['Emergency Flood Supplies', 'Cyclone Rehabilitation Assist', 'Essential Material Distribution', 'Volunteer Rescue Support'],
  },
  {
    title: 'Youth & Sports',
    icon: Award,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&fit=crop&q=80',
    details: ['District Sports Tournaments', 'Volleyball & Chess Competitions', 'Appreciation Awards & Cash Prizes', 'Youth Talent Development'],
  },
];

function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !animated.current) {
        animated.current = true;
        const steps = 50;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const progress = step / steps;
          const ease = 1 - Math.pow(1 - progress, 3);
          setValue(Math.floor(target * ease));
          if (step >= steps) { clearInterval(timer); setValue(target); }
        }, duration / steps);
      }
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, value };
}

export default function WelfareJourney() {
  const years = useCountUp(15);
  const works = useCountUp(8500);

  return (
    <section id="welfare" className="py-24 bg-[#0B0F19] relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#FFD700]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-[#E50914]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Full-width banner */}
      <div className="w-full relative z-10 mb-20">
        <div className="relative overflow-hidden min-h-[380px] flex items-center justify-center border-y border-white/8 shadow-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&fit=crop&q=80')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#0B0F19]/60 to-[#0B0F19]" />



          <div
            ref={years.ref as React.RefObject<HTMLDivElement>}
            className="relative z-10 text-center px-4 py-12 w-full max-w-3xl mx-auto"
          >
            <h3 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-wider mb-10">
              Welfare <span className="text-[#FFD700] text-glow-gold">Journey</span>
            </h3>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-24 mb-8">
              <div className="text-center">
                <div className="text-5xl sm:text-6xl font-black text-[#FFD700] text-glow-gold">
                  {years.value}+
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-widest mt-2">Years of Service</div>
              </div>
              <div className="text-center" ref={works.ref as React.RefObject<HTMLDivElement>}>
                <div className="text-5xl sm:text-6xl font-black text-[#FFD700] text-glow-gold">
                  {works.value.toLocaleString('en-IN')}+
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-widest mt-2">Welfare Works Completed</div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto italic font-serif leading-relaxed">
              &ldquo;We strive to build a strong and responsible community by organizing public welfare activities on every occasion, celebrating cinema through humanity.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Core Mission Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[#FFD700] text-xs uppercase tracking-[0.2em] font-bold mb-3">Our Pillars</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight text-balance">
            Core Welfare <span className="text-[#FFD700] text-glow-gold">Missions</span>
          </h2>
          <div className="w-16 h-1 bg-[#FFD700] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MISSIONS.map((mission, idx) => {
            const Icon = mission.icon;
            return (
              <article
                key={idx}
                className="group rounded-2xl bg-[#111827] border border-white/8 hover:border-[#FFD700]/30 transition-all duration-300 shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Card Image */}
                <div className="h-48 w-full overflow-hidden relative bg-black">
                  <img
                    src={mission.image}
                    alt={mission.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 w-9 h-9 rounded-lg bg-[#0B0F19]/80 backdrop-blur-md border border-[#FFD700]/20 flex items-center justify-center shadow-md">
                    <Icon className="text-[#FFD700]" size={16} />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-grow">
                  <h3 className="text-lg font-black text-white tracking-wide mb-4 group-hover:text-[#FFD700] transition-colors">
                    {mission.title}
                  </h3>
                  <ul className="space-y-2">
                    {mission.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2 text-xs text-gray-400 font-serif">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
