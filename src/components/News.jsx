import React, { useState } from 'react';
import { Calendar, ArrowRight, X, Newspaper } from 'lucide-react';

const News = ({ newsItems }) => {
  const [selectedNews, setSelectedNews] = useState(null);

  const featuredItem = newsItems.find(item => item.featured) || newsItems[0];
  const regularItems = newsItems.filter(item => item.id !== (featuredItem?.id || ''));

  return (
    <section id="news" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <p className="text-primary text-xs uppercase tracking-[0.2em] font-semibold mb-2">Latest Updates</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Updates & <span className="text-primary text-glow-gold">Announcements</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-4 rounded-full" />
        </div>

        {/* Featured News Banner */}
        {featuredItem && (
          <div 
            onClick={() => setSelectedNews(featuredItem)}
            className="group relative rounded-xl overflow-hidden bg-cardBg border border-white/10 hover:border-primary/30 transition-all duration-500 mb-12 cursor-pointer shadow-2xl hover:shadow-gold-glow/10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Image */}
              <div className="lg:col-span-7 aspect-video lg:aspect-auto min-h-[300px] overflow-hidden relative">
                <img 
                  src={featuredItem.image} 
                  alt={featuredItem.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => { e.target.src = '/gautham_about.jpg'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-transparent to-transparent" />
              </div>

              {/* Text info */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest bg-primary/10 w-fit px-3 py-1 rounded-full border border-primary/25 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    Featured Update
                  </div>

                  <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight group-hover:text-primary transition-colors duration-300 leading-tight mb-4">
                    {featuredItem.title}
                  </h3>

                  <p className="text-gray-400 text-sm sm:text-base line-clamp-3 leading-relaxed mb-6">
                    {featuredItem.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Calendar size={14} />
                    <span>{featuredItem.date}</span>
                  </div>
                  
                  <button className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider group-hover:translate-x-1.5 transition-transform duration-300">
                    Read More
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular News Cards Grid */}
        {regularItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regularItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="group flex flex-col justify-between rounded-lg overflow-hidden bg-cardBg border border-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1 hover:shadow-gold-glow/10"
              >
                <div>
                  {/* Card Image */}
                  <div className="aspect-video overflow-hidden relative bg-black">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => { e.target.src = '/gautham_about.jpg'; }}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                      <Calendar size={12} />
                      <span>{item.date}</span>
                    </div>

                    <h4 className="text-white text-base font-extrabold tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-gray-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-end">
                  <button className="flex items-center gap-1 text-primary text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                    Read Full
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white/5 border border-white/5 rounded-lg">
            <p className="text-gray-400">No other announcements at this time.</p>
          </div>
        )}
      </div>

      {/* Read More Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-[#121212] rounded-xl border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header bar */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
              <span className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                <Newspaper size={14} /> Official Dispatch
              </span>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 flex-grow">
              <img 
                src={selectedNews.image} 
                alt={selectedNews.title} 
                className="w-full aspect-[2/1] object-cover rounded-lg mb-6 border border-white/5 shadow-md"
                onError={(e) => { e.target.src = '/gautham_about.jpg'; }}
              />
              
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                <Calendar size={14} />
                <span>{selectedNews.date}</span>
              </div>

              <h3 className="text-white text-xl sm:text-2xl font-extrabold tracking-tight mb-4 leading-tight">
                {selectedNews.title}
              </h3>

              <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
                {selectedNews.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default News;
