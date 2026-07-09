'use client';

import { useState, useEffect } from 'react';
import { Users, MapPin, Phone, MessageCircle } from 'lucide-react';
import { getCoordinators } from '@/lib/firebase/db';

type Coordinator = {
  id: string;
  name: string;
  position: string;
  district: string;
  phone?: string;
  photo: string;
};

interface Props {
  refreshKey?: number;
}

export default function Officials({ refreshKey }: Props) {
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);

  useEffect(() => {
    getCoordinators().then(data => setCoordinators(data as Coordinator[]));
  }, [refreshKey]);

  return (
    <section id="officials" className="py-24 bg-[#0B0F19] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080B14] via-[#0B0F19] to-[#080B14] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-[#FFD700] text-xs uppercase tracking-[0.2em] font-bold mb-3">Official Team</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight text-balance">
            District <span className="text-[#FFD700] text-glow-gold">Coordinators</span>
          </h2>
          <div className="w-16 h-1 bg-[#FFD700] mx-auto mt-4 rounded-full" />
          <p className="text-gray-500 text-sm mt-4 max-w-xl mx-auto font-serif">
            Our dedicated coordinators manage fan activities and welfare programs across all districts of Tamil Nadu.
          </p>
        </div>

        {/* Coordinator Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coordinators.map((c, i) => (
            <div
              key={c.id}
              className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-[#FFD700]/25 transition-all duration-300 hover:-translate-y-1 text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Photo */}
              <div className="relative pt-6 pb-4 flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#FFD700]/30">
                    <img
                      src={c.photo}
                      alt={c.name}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = '/placeholder-user.jpg'; }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0B0F19]" aria-label="Active" />
                </div>
              </div>

              {/* Info */}
              <div className="px-4 pb-5">
                <h3 className="text-white font-black text-sm mb-0.5">{c.name}</h3>
                <p className="text-[#FFD700] text-[10px] font-bold uppercase tracking-wider mb-3">{c.position}</p>
                <div className="flex items-center justify-center gap-1.5 text-gray-500 text-[10px] font-semibold mb-4">
                  <MapPin size={11} className="text-[#FFD700]" />
                  {c.district}
                </div>

                {c.phone ? (
                  <a
                    href={`https://wa.me/91${c.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-700/20 border border-emerald-500/20 text-emerald-400 rounded text-[10px] font-black uppercase tracking-wider hover:bg-emerald-700/30 transition-colors"
                  >
                    <MessageCircle size={11} /> WhatsApp
                  </a>
                ) : (
                  <div className="py-2 text-gray-600 text-[10px] uppercase tracking-wider">Contact via District</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {coordinators.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-10">Coordinator information will be published soon.</p>
        )}
      </div>
    </section>
  );
}
