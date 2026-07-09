'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Star } from 'lucide-react';
import { getUpcomingReleases, getPopupSettings } from '@/lib/firebase/db';

interface Release {
  id: string;
  title: string;
  releaseDate: string;
  poster: string;
  character: string;
  description: string;
  genre: string;
}

interface Props { refreshKey?: number }

export default function UpcomingReleases({ refreshKey }: Props) {
  const [releases, setReleases] = useState<Release[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoOpened, setAutoOpened] = useState(false);
  const [popupSettings, setPopupSettings] = useState<{ popupEnabled: boolean; popupReleaseId: string | null }>({ popupEnabled: true, popupReleaseId: null });

  useEffect(() => {
    Promise.all([getUpcomingReleases(), getPopupSettings()]).then(([data, settings]) => {
      const releasesArray = (data || []) as Release[];
      setReleases(releasesArray);
      setPopupSettings(settings as any);
      setLoading(false);
      
      // Auto-open popup based on settings
      if (!autoOpened && settings.popupEnabled && releasesArray.length > 0) {
        let releaseToShow: Release | null = null;
        if (settings.popupReleaseId) {
          releaseToShow = releasesArray.find(r => r.id === settings.popupReleaseId) || null;
        }
        if (!releaseToShow) releaseToShow = releasesArray[0];
        setSelectedRelease(releaseToShow);
        setAutoOpened(true);
      }
    });
  }, [refreshKey, autoOpened]);

  if (loading) return <div className="h-32" />;
  if (releases.length === 0) return null;

  return (
    <>
      <section id="upcoming" className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#0B0F19] to-[#1a1f2e]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#E50914] rounded-full mb-4">
              <p className="text-xs font-black uppercase tracking-wider text-[#0B0F19]">Coming Soon</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#E50914]">Releases</span>
            </h2>
            <p className="text-gray-400 text-lg">Blockbuster movies on the horizon</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {releases.map(release => (
              <div
                key={release.id}
                onClick={() => setSelectedRelease(release)}
                className="group cursor-pointer relative h-80 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-gold-glow"
              >
                <img
                  src={release.poster}
                  alt={release.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22500%22%3E%3Crect fill=%22%231a1f2e%22 width=%22400%22 height=%22500%22/%3E%3C/svg%3E'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-black text-white mb-1 line-clamp-2">{release.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-[#FFD700] font-bold">
                    <Calendar size={14} />
                    <span>{new Date(release.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 to-[#E50914]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popup Modal */}
      {selectedRelease && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedRelease(null)} role="dialog" aria-modal="true">
          <div className="relative">
            {/* Modal Card - Compact Portrait Image, click goes to Filmography */}
            <div
              onClick={() => {
                setSelectedRelease(null);
                document.getElementById('upcoming')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 cursor-pointer"
              style={{ aspectRatio: '3/4' }}
            >
              {/* Full Background Image - Fills the card */}
              <img
                src={selectedRelease.poster}
                alt={selectedRelease.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22400%22%3E%3Crect fill=%22%231a1f2e%22 width=%22300%22 height=%22400%22/%3E%3C/svg%3E'; }}
              />
            </div>

            {/* Close Button - Circular Transparent Badge Overlapping Top Right Corner */}
            <button
              onClick={() => setSelectedRelease(null)}
              className="absolute -top-3 -right-3 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 hover:scale-110 transition-all backdrop-blur-md"
              aria-label="Close"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
