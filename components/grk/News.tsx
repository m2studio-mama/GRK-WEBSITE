'use client';

import { useState, useEffect } from 'react';
import { Newspaper, Calendar, ChevronRight, X } from 'lucide-react';
import { getNews } from '@/lib/firebase/db';
import ShareButtons from './ShareButtons';

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  image: string;
  featured: boolean;
};

interface Props {
  refreshKey?: number;
}

export default function News({ refreshKey }: Props) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selected, setSelected] = useState<NewsItem | null>(null);

  useEffect(() => {
    getNews().then(data => setNews(data as NewsItem[]));
  }, [refreshKey]);

  const featured = news.find(n => n.featured) || news[0];
  const rest = news.filter(n => n.id !== featured?.id);

  if (news.length === 0) return null;

  return (
    <section id="news" className="py-24 bg-[#080B14] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-transparent to-[#0B0F19] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-[#FFD700] text-xs uppercase tracking-[0.2em] font-bold mb-3">Latest Updates</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight text-balance">
            News & <span className="text-[#FFD700] text-glow-gold">Announcements</span>
          </h2>
          <div className="w-16 h-1 bg-[#FFD700] mx-auto mt-4 rounded-full" />
        </div>

        {/* Featured Article */}
        {featured && (
          <div
            onClick={() => setSelected(featured)}
            className="relative rounded-2xl overflow-hidden border border-white/8 hover:border-[#FFD700]/20 cursor-pointer group mb-10 transition-all duration-300"
          >
            <div className="aspect-[21/9] relative">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/70 to-transparent" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
              <span className="inline-flex items-center gap-1.5 bg-[#FFD700] text-[#0B0F19] rounded px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider mb-3 w-fit">
                <Newspaper size={10} /> Featured
              </span>
              <h3 className="text-white text-xl sm:text-3xl font-black mb-2 max-w-2xl text-balance leading-tight">{featured.title}</h3>
              <p className="text-gray-300 text-sm mb-4 max-w-xl line-clamp-2 font-serif">{featured.summary}</p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold">
                  <Calendar size={12} /> {featured.date}
                </span>
                <span className="text-[#FFD700] text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read More <ChevronRight size={13} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((item, i) => (
            <article
              key={item.id}
              onClick={() => setSelected(item)}
              className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-[#FFD700]/20 cursor-pointer group transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                />
              </div>
              <div className="p-5">
                <h3 className="text-white font-black text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#FFD700] transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-xs font-serif line-clamp-2 mb-4">{item.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-600 text-[10px] font-semibold">
                    <Calendar size={10} /> {item.date}
                  </span>
                  <span className="text-[#FFD700] text-[10px] font-black flex items-center gap-1">
                    Read <ChevronRight size={11} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>


      </div>

      {/* Article Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-md overflow-y-auto" onClick={() => setSelected(null)}>
          <div
            className="relative w-full max-w-2xl bg-[#111827] rounded-2xl border border-white/10 overflow-hidden shadow-2xl my-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="aspect-[21/9] relative">
              <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
            </div>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-gray-300 hover:text-white transition-colors" aria-label="Close article">
              <X size={18} />
            </button>
            <div className="p-6 sm:p-8">
              <span className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold mb-3">
                <Calendar size={11} /> {selected.date}
              </span>
              <h2 className="text-white text-xl sm:text-2xl font-black leading-tight mb-4 text-balance">{selected.title}</h2>
              {selected.summary && <p className="text-[#FFD700] text-sm font-semibold mb-4 font-serif">{selected.summary}</p>}
              <div className="prose prose-invert prose-sm max-w-none text-gray-400 font-serif leading-relaxed whitespace-pre-line mb-6">
                {selected.content}
              </div>
              <div className="pt-6 border-t border-white/10">
                <ShareButtons title={selected.title} description={selected.summary} />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
