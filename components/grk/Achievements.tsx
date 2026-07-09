'use client';

import { Star } from 'lucide-react';
import { getTimeline } from '@/lib/firebase/db';
import { useEffect, useState } from 'react';

type TimelineItem = { id?: string; year: string; title: string; desc: string };

interface Props { refreshKey?: number }

export default function Achievements({ refreshKey }: Props) {
  const [items, setItems] = useState<TimelineItem[]>([]);

  useEffect(() => {
    getTimeline().then(data => setItems(data as TimelineItem[]));
  }, [refreshKey]);

  if (items.length === 0) return null;

  return (
    <section id="achievements" className="py-24 bg-[#0B0F19] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[#FFD700] text-xs uppercase tracking-[0.2em] font-bold mb-3">Hall of Fame</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight text-balance">
            Milestones & <span className="text-[#FFD700] text-glow-gold">Achievements</span>
          </h2>
          <div className="w-16 h-1 bg-[#FFD700] mx-auto mt-4 rounded-full" />
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#FFD700]/60 via-[#FFD700]/20 to-[#FFD700]/60 md:-translate-x-px" />

          <div className="space-y-10">
            {items.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={item.id || idx}
                  className={`flex items-start gap-0 md:gap-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Spacer half */}
                  <div className="hidden md:block w-1/2" />

                  {/* Dot */}
                  <div className="absolute left-5 md:left-1/2 w-8 h-8 rounded-full bg-[#0B0F19] border-2 border-[#FFD700] -translate-x-1/2 flex items-center justify-center z-10 shadow-gold-glow">
                    <Star size={12} className="text-[#FFD700] fill-[#FFD700]" />
                  </div>

                  {/* Card */}
                  <div className="w-full md:w-1/2 pl-14 md:pl-0 md:px-10">
                    <div
                      className="glass-card p-5 sm:p-7 rounded-xl border border-white/6 hover:border-[#FFD700]/25 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      <span className="inline-block text-[#0B0F19] font-black text-xs bg-[#FFD700] px-3 py-1 rounded-full mb-3 shadow-gold-glow">
                        {item.year}
                      </span>
                      <h3 className="text-white text-base sm:text-lg font-black tracking-tight mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-serif">{item.desc}</p>
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
}
