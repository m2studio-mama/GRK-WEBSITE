import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, X, ChevronLeft, ChevronRight, Maximize, Download, Play, Film, Image as ImageIcon, DownloadCloud } from 'lucide-react';

const MediaLibrary = ({ galleryItems = [], videoItems = [], downloadItems = [] }) => {
  const [activeMainTab, setActiveMainTab] = useState('photos'); // photos, videos, wallpapers
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [activeVideo, setActiveVideo] = useState(null);

  // Categories configurations
  const photoCategories = ['All', 'Photoshoots', 'Movie Stills', 'Events', 'Fan Meetups', 'Behind The Scenes'];
  const videoCategories = ['All', 'Trailers', 'Interviews', 'Fan Edits', 'Event Videos'];
  const wallpaperCategories = ['All', 'HD Posters', 'Wallpapers', 'DP Frames', 'Birthday Templates'];

  // Handle Tab Switch
  const handleMainTabChange = (tab) => {
    setActiveMainTab(tab);
    setActiveCategory('All');
    setLightboxIndex(null);
    setActiveVideo(null);
  };

  // Filter lists based on sub-categories
  const filteredPhotos = galleryItems.filter((item) => 
    activeCategory === 'All' || item.category === activeCategory
  );

  const filteredVideos = videoItems.filter((item) => 
    activeCategory === 'All' || item.category === activeCategory
  );

  const filteredWallpapers = downloadItems.filter((item) => 
    activeCategory === 'All' || item.category === activeCategory
  );

  // Youtube URL extractor
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('/embed/')) {
      return url.includes('?') ? url : `${url}?autoplay=1`;
    }
    
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split(/[?#]/)[0];
    } else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v');
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('youtube.com/shorts/')[1]?.split(/[?#]/)[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  // Lightbox handlers
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setZoomScale(1);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setZoomScale(1);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      const prevIndex = lightboxIndex === 0 ? filteredPhotos.length - 1 : lightboxIndex - 1;
      setLightboxIndex(prevIndex);
      setZoomScale(1);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      const nextIndex = lightboxIndex === filteredPhotos.length - 1 ? 0 : lightboxIndex + 1;
      setLightboxIndex(nextIndex);
      setZoomScale(1);
    }
  };

  const zoomIn = (e) => {
    e.stopPropagation();
    setZoomScale((scale) => Math.min(3, scale + 0.25));
  };

  const zoomOut = (e) => {
    e.stopPropagation();
    setZoomScale((scale) => Math.max(0.5, scale - 0.25));
  };

  const resetZoom = (e) => {
    e.stopPropagation();
    setZoomScale(1);
  };

  const triggerDownload = (url, title) => {
    // Attempt download via link
    const a = document.createElement('a');
    a.href = url;
    a.download = title ? `${title.replace(/\s+/g, '_')}` : 'download';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section id="media-library" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-primary text-xs uppercase tracking-[0.2em] font-semibold mb-2">Visual Showcase</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Official <span className="text-primary text-glow-gold">Media Library</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-4 rounded-full" />
        </div>

        {/* Main Tab Controls */}
        <div className="flex justify-center mb-10">
          <div className="glass-card p-1 rounded-full border border-white/10 flex">
            {[
              { id: 'photos', label: 'Photos', icon: ImageIcon },
              { id: 'videos', label: 'Videos & Trailers', icon: Film },
              { id: 'wallpapers', label: 'Wallpapers & Posters', icon: DownloadCloud }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleMainTabChange(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeMainTab === tab.id
                    ? 'bg-primary text-black shadow-gold-glow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 1. PHOTOS TAB */}
        {activeMainTab === 'photos' && (
          <div className="space-y-10 animate-fade-in-up">
            {/* Sub Categories */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {photoCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase transition-all duration-300 border ${
                    activeCategory === cat
                      ? 'bg-primary/20 text-primary border-primary'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:border-primary/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Photo Masonry Grid */}
            {filteredPhotos.length > 0 ? (
              <div className="columns-1 sm:columns-2 md:columns-3 gap-6">
                {filteredPhotos.map((item, idx) => (
                  <div 
                    key={item.id}
                    onClick={() => openLightbox(idx)}
                    className="break-inside-avoid mb-6 relative rounded-lg overflow-hidden group cursor-pointer border border-white/5 bg-[#121212] transition-all duration-300 hover:border-primary/30 shadow-lg"
                  >
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="w-full h-auto object-cover transition-all duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => { e.target.src = '/gautham_about.jpg'; }}
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-primary font-bold text-[9px] uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                            {item.category}
                          </span>
                          <h4 className="text-white text-sm font-bold tracking-wide mt-1.5 line-clamp-1">{item.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); triggerDownload(item.url, item.title); }}
                            className="p-2 rounded-full bg-black/60 text-white hover:text-primary transition-colors border border-white/10 hover:bg-black/90"
                            title="Download Image"
                          >
                            <Download size={12} />
                          </button>
                          <div className="p-2 rounded-full bg-black/60 text-white hover:text-primary transition-colors border border-white/10">
                            <Maximize size={12} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 border border-white/5 rounded-lg max-w-md mx-auto">
                <p className="text-gray-400 text-sm">No photos available in this category yet.</p>
              </div>
            )}
          </div>
        )}

        {/* 2. VIDEOS TAB */}
        {activeMainTab === 'videos' && (
          <div className="space-y-10 animate-fade-in-up">
            {/* Sub Categories */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {videoCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase transition-all duration-300 border ${
                    activeCategory === cat
                      ? 'bg-primary/20 text-primary border-primary'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:border-primary/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Video Cards Grid */}
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((vid) => (
                  <div 
                    key={vid.id}
                    onClick={() => setActiveVideo(vid)}
                    className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                  >
                    {/* Thumbnail Stage */}
                    <div className="aspect-video w-full overflow-hidden relative bg-black">
                      <img 
                        src={vid.thumbnail} 
                        alt={vid.title} 
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                        onError={(e) => { e.target.src = '/gautham_about.jpg'; }}
                      />
                      {/* Play overlay button */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-gold-glow transform group-hover:scale-110 transition-transform duration-300">
                          <Play size={20} fill="currentColor" className="ml-1" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/85 text-white text-[9px] font-bold uppercase border border-white/10">
                        {vid.category}
                      </span>
                    </div>

                    {/* Title Content */}
                    <div className="p-5 flex-grow">
                      <h4 className="text-white text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {vid.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 border border-white/5 rounded-lg max-w-md mx-auto">
                <p className="text-gray-400 text-sm">No videos available in this category yet.</p>
              </div>
            )}
          </div>
        )}

        {/* 3. WALLPAPERS & POSTERS (INTEGRATED DOWNLOADS) */}
        {activeMainTab === 'wallpapers' && (
          <div className="space-y-10 animate-fade-in-up">
            {/* Sub Categories */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {wallpaperCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase transition-all duration-300 border ${
                    activeCategory === cat
                      ? 'bg-primary/20 text-primary border-primary'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:border-primary/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Asset Cards Grid */}
            {filteredWallpapers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredWallpapers.map((asset) => (
                  <div 
                    key={asset.id}
                    className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-300 flex flex-col justify-between shadow-lg"
                  >
                    {/* Thumbnail stage (if url ends in image extension, otherwise general default placeholder) */}
                    <div className="aspect-[4/3] bg-black/60 relative overflow-hidden border-b border-white/5">
                      <img 
                        src={asset.url.includes('images.weserv.nl') || asset.url.match(/\.(jpeg|jpg|gif|png)/) ? asset.url : 'https://images.weserv.nl/?url=https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300'} 
                        alt={asset.title} 
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                        loading="lazy"
                        onError={(e) => { e.target.src = '/gautham_about.jpg'; }}
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/75 text-primary text-[9px] font-bold uppercase border border-primary/20">
                        {asset.category}
                      </span>
                      {asset.size && (
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-white/10 text-gray-300 text-[8px] font-semibold uppercase tracking-wider">
                          {asset.size}
                        </span>
                      )}
                    </div>

                    {/* Metadata Card Footer */}
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <h4 className="text-white text-xs font-bold leading-normal mb-3 line-clamp-2" title={asset.title}>
                        {asset.title}
                      </h4>
                      
                      <button
                        onClick={() => triggerDownload(asset.url, asset.title)}
                        className="w-full py-2 bg-primary text-black font-bold uppercase tracking-wider text-[10px] rounded hover:bg-accent hover:text-white transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Download size={11} />
                        Download File
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 border border-white/5 rounded-lg max-w-md mx-auto">
                <p className="text-gray-400 text-sm">No downloadable files available in this category yet.</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================
          MODALS & OVERLAYS
      ======================================================== */}

      {/* 1. PHOTO LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 bg-black/95 backdrop-blur-md select-none"
          onClick={closeLightbox}
        >
          {/* Lightbox Header Controls */}
          <div className="w-full flex items-center justify-between py-2 px-4 z-10">
            <div className="text-white font-semibold text-xs sm:text-sm tracking-wide bg-black/40 px-3.5 py-2 rounded-full border border-white/5">
              {filteredPhotos[lightboxIndex].title} 
              <span className="text-primary text-[10px] font-bold uppercase tracking-widest ml-3 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">{filteredPhotos[lightboxIndex].category}</span>
            </div>
            
            <div className="flex items-center gap-3 bg-black/60 px-4 py-1.5 rounded-full border border-white/10">
              <button onClick={zoomIn} className="text-gray-400 hover:text-white transition-colors" title="Zoom In"><ZoomIn size={16} /></button>
              <button onClick={zoomOut} className="text-gray-400 hover:text-white transition-colors" title="Zoom Out"><ZoomOut size={16} /></button>
              <button onClick={resetZoom} className="text-gray-400 hover:text-white transition-colors" title="Reset Zoom"><RotateCcw size={16} /></button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button 
                onClick={(e) => { e.stopPropagation(); triggerDownload(filteredPhotos[lightboxIndex].url, filteredPhotos[lightboxIndex].title); }} 
                className="text-gray-400 hover:text-primary transition-colors" 
                title="Download Photo"
              >
                <Download size={16} />
              </button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button onClick={closeLightbox} className="text-gray-400 hover:text-primary transition-colors" title="Close Lightbox"><X size={18} /></button>
            </div>
          </div>

          {/* Lightbox Stages */}
          <div className="relative w-full flex-grow flex items-center justify-center overflow-hidden">
            <button
              onClick={handlePrev}
              className="absolute left-4 z-10 p-3 rounded-full bg-black/60 text-white hover:text-primary transition-colors border border-white/10 shadow-lg"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Image display */}
            <div className="max-w-full max-h-[80vh] flex items-center justify-center transition-transform duration-300" style={{ transform: `scale(${zoomScale})` }}>
              <img 
                src={filteredPhotos[lightboxIndex].url} 
                alt={filteredPhotos[lightboxIndex].title} 
                className="max-w-[90vw] max-h-[75vh] object-contain rounded border border-white/10"
                onClick={(e) => e.stopPropagation()} 
                onError={(e) => { e.target.src = '/gautham_about.jpg'; }}
              />
            </div>

            <button
              onClick={handleNext}
              className="absolute right-4 z-10 p-3 rounded-full bg-black/60 text-white hover:text-primary transition-colors border border-white/10 shadow-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Bottom Counter */}
          <div className="text-gray-500 text-xs py-2 bg-black/30 px-4 rounded-full border border-white/5 mb-2">
            Image {lightboxIndex + 1} of {filteredPhotos.length}
          </div>
        </div>
      )}

      {/* 2. VIDEO POPUP OVERLAY */}
      {activeVideo !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-black rounded-xl border border-white/10 overflow-hidden shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-[#121212] px-6 py-4 border-b border-white/5">
              <span className="text-white font-bold text-sm tracking-wide line-clamp-1">{activeVideo.title}</span>
              <button onClick={() => setActiveVideo(null)} className="text-gray-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Video embed Stage */}
            <div className="aspect-video w-full bg-black">
              <iframe
                src={getEmbedUrl(activeVideo.url)}
                title={activeVideo.title}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default MediaLibrary;
