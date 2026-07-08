'use client';

import { useRef } from 'react';
import { Calendar, Trophy, Heart, Clapperboard } from 'lucide-react';

const QUICK_FACTS = [
  { label: 'Born', value: 'May 27, 1992 • Chennai', icon: Calendar },
  { label: 'Father', value: 'Karthik (Actor)', icon: Heart },
  { label: 'Grandfather', value: 'R. Muthuraman (Legendary Actor)', icon: Trophy },
  { label: 'Debut', value: 'Kadal (2013)', icon: Clapperboard },
  { label: 'Spouse', value: 'Manjima Mohan (m. 2022)', icon: Heart },
  { label: 'Screen Name', value: 'Gautham Ram Karthik (since 2025)', icon: Trophy },
];

interface Props { refreshKey?: number }

export default function About({ refreshKey }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section id="about" className="py-24 bg-[#0B0F19] relative overflow-hidden" ref={sectionRef}>
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E50914]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <p className="text-[#FFD700] text-xs uppercase tracking-[0.2em] font-bold mb-3">Biography</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight text-balance">
            About <span className="text-[#FFD700] text-glow-gold">Gautham Ram Karthik</span>
          </h2>
          <div className="w-16 h-1 bg-[#FFD700] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Portrait + Quick Facts */}
          <div className="space-y-8">
            {/* Portrait Card */}
            <div className="relative group">
              <div className="aspect-[3/4] max-w-xs mx-auto lg:mx-0 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/gautham_about.jpg"
                  alt="Gautham Ram Karthik"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-black text-lg tracking-wide">GAUTHAM RAM KARTHIK</p>
                  <p className="text-[#FFD700] text-xs font-bold uppercase tracking-widest">Tamil Cinema Actor</p>
                </div>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="space-y-3">
              {QUICK_FACTS.map((fact, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/3 border border-white/5 hover:border-[#FFD700]/20 transition-colors">
                  <fact.icon size={14} className="text-[#FFD700] flex-shrink-0" />
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider w-20 flex-shrink-0">{fact.label}</span>
                  <span className="text-gray-200 text-xs font-semibold">{fact.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Bio */}
          <div className="space-y-10">
            {/* Bio */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Career Journey</h3>
              <div className="space-y-4 text-gray-400 text-sm leading-relaxed font-serif">
                <p>
                  Born on <strong className="text-white">May 27, 1992</strong> in Chennai, Gautham Ram Karthik is a proud third-generation actor carrying forward the legacy of Tamil cinema royalty. As the son of celebrated actor <strong className="text-white">Karthik</strong> and grandson of the legendary <strong className="text-white">R. Muthuraman</strong>, he entered the film industry with unimaginable expectations — and lived up to every one of them.
                </p>
                <p>
                  His debut in legendary director <strong className="text-white">Mani Ratnam&apos;s Kadal (2013)</strong> earned him the <strong className="text-[#FFD700]">Vijay Award for Best Debut Actor</strong> and <strong className="text-[#FFD700]">Filmfare Award for Best Male Debut (South)</strong>. From romantic dramas to rural action blockbusters, his range as an actor has only expanded with every role.
                </p>
                <p>
                  In 2025, he officially updated his screen credit to <strong className="text-white">Gautham Ram Karthik</strong> — adding "Ram" in tribute to his grandfather and father. In 2026, he delivered the spy action thriller <strong className="text-white">Mr. X</strong> alongside Arya, cementing his position as a top-tier mass hero in Tamil cinema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
