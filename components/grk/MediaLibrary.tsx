'use client';

import { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, X, ChevronLeft, ChevronRight, Download, Play, Film, Image as ImageIcon, DownloadCloud, Maximize } from 'lucide-react';
import { getGallery, getVideos, getDownloads } from '@/lib/firebase/db';
import JSZip from 'jszip';

type GalleryItem = { id: string; title: string; category: string; url: string };
type VideoItem = { id: string; title: string; category: string; url: string; thumbnail: string };
type DownloadItem = { id: string; title: string; category: string; url: string; size?: string };

const PHOTO_CATS = ['All', 'Photoshoots', 'Movie Stills', 'Events', 'Fan Meetups', 'Behind The Scenes'];
const VIDEO_CATS = ['All', 'Trailers', 'Interviews', 'Fan Edits', 'Event Videos'];
const DL_CATS = ['All', 'HD Posters', 'Wallpapers', 'DP Frames', 'Birthday Templates'];

function getEmbedUrl(url: string) {
  if (!url) return '';
  if (url.includes('/embed/')) return url.includes('?') ? url : `${url}?autoplay=1`;
  let id = '';
  if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1]?.split(/[?#]/)[0] ?? '';
  else if (url.includes('youtube.com/watch')) id = new URLSearchParams(url.split('?')[1]).get('v') ?? '';
  else if (url.includes('youtube.com/shorts/')) id = url.split('youtube.com/shorts/')[1]?.split(/[?#]/)[0] ?? '';
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
}

interface Props {
  refreshKey?: number;
}

export default function MediaLibrary({ refreshKey }: Props) {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const [mainTab, setMainTab] = useState<'photos' | 'videos' | 'wallpapers'>('photos');
  const [category, setCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    Promise.all([getGallery(), getVideos(), getDownloads()]).then(([g, v, d]) => {
      setGallery(g as GalleryItem[]);
      setVideos(v as VideoItem[]);
      setDownloads(d as DownloadItem[]);
    });
  }, [refreshKey]);

  const filteredPhotos = gallery.filter(i => category === 'All' || i.category === category);
  const filteredVideos = videos.filter(i => category === 'All' || i.category === category);
  const filteredDownloads = downloads.filter(i => category === 'All' || i.category === category);

  const switchTab = (tab: 'photos' | 'videos' | 'wallpapers') => {
    setMainTab(tab);
    setCategory('All');
    setLightboxIndex(null);
    setActiveVideo(null);
  };

  const triggerDownload = async (url: string, title: string) => {
    const urls = url.split(',').map(u => u.trim()).filter(Boolean);

    if (urls.length <= 1) {
      const a = document.createElement('a');
      a.href = urls[0] || url;
      a.download = title.replace(/\s+/g, '_');
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Multiple files: download as ZIP
    try {
      const zip = new JSZip();
      const folderName = title.replace(/\s+/g, '_') || 'downloads';
      const folder = zip.folder(folderName);

      const fetchPromises = urls.map(async (imgUrl, index) => {
        try {
          const response = await fetch(imgUrl);
          const blob = await response.blob();
          const ext = imgUrl.split('.').pop()?.split(/[?#]/)[0] || 'jpg';
          const fileName = `${folderName}_${index + 1}.${ext}`;
          folder?.file(fileName, blob);
        } catch (err) {
          console.error(`Failed to fetch image for ZIP: ${imgUrl}`, err);
        }
      });

      await Promise.all(fetchPromises);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to generate ZIP file:', error);
    }
  };

  const cats = mainTab === 'photos' ? PHOTO_CATS : mainTab === 'videos' ? VIDEO_CATS : DL_CATS;

  return (
    <section id="media-library" className="py-24 bg-[#0B0F19] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD700]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E50914]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-[#FFD700] text-xs uppercase tracking-[0.2em] font-bold mb-3">Visual Showcase</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight text-balance">
            Official <span className="text-[#FFD700] text-glow-gold">Media Library</span>
          </h2>
          <div className="w-16 h-1 bg-[#FFD700] mx-auto mt-4 rounded-full" />
        </div>

        {/* Main Tabs */}
        <div className="flex justify-center mb-10">
          <div className="glass-card p-1 rounded-full border border-white/10 flex flex-wrap justify-center gap-1">
            {[
              { id: 'photos' as const, label: 'Photos', icon: ImageIcon },
              { id: 'videos' as const, label: 'Videos & Trailers', icon: Film },
              { id: 'wallpapers' as const, label: 'Wallpapers & Posters', icon: DownloadCloud },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  mainTab === tab.id
                    ? 'bg-[#FFD700] text-[#0B0F19] shadow-gold-glow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon size={13} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {cats.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all duration-300 ${
                category === cat
                  ? 'bg-[#FFD700]/15 text-[#FFD700] border-[#FFD700]/40'
                  : 'text-gray-400 border-white/10 bg-white/3 hover:text-white hover:border-white/25'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PHOTOS */}
        {mainTab === 'photos' && (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-5">
            {filteredPhotos.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => { setLightboxIndex(idx); setZoomScale(1); }}
                className="break-inside-avoid mb-5 relative rounded-xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#FFD700]/25 bg-[#111827] transition-all duration-300"
              >
                <img
                  src={item.url.split(',')[0].trim()}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#FFD700] text-[9px] font-black uppercase tracking-wider bg-[#FFD700]/10 px-1.5 py-0.5 rounded-full border border-[#FFD700]/20">{item.category}</span>
                      <h4 className="text-white text-xs font-bold mt-1 line-clamp-1">{item.title}</h4>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={e => { e.stopPropagation(); triggerDownload(item.url, item.title); }} className="p-1.5 rounded-full bg-black/60 text-white hover:text-[#FFD700] border border-white/10" aria-label="Download"><Download size={11} /></button>
                      <div className="p-1.5 rounded-full bg-black/60 text-white border border-white/10"><Maximize size={11} /></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredPhotos.length === 0 && <p className="text-gray-500 text-center col-span-3 py-16 text-sm">No photos in this category.</p>}
          </div>
        )}

        {/* VIDEOS */}
        {mainTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map(vid => (
              <div
                key={vid.id}
                onClick={() => setActiveVideo(vid)}
                className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-[#FFD700]/25 transition-all duration-300 group cursor-pointer"
              >
                <div className="aspect-video relative overflow-hidden bg-black">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                    onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#FFD700] text-[#0B0F19] flex items-center justify-center shadow-gold-glow group-hover:scale-110 transition-transform">
                      <Play size={18} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/85 text-white text-[9px] font-bold uppercase border border-white/10">{vid.category}</span>
                </div>
                <div className="p-4">
                  <h4 className="text-white text-sm font-bold line-clamp-2 group-hover:text-[#FFD700] transition-colors">{vid.title}</h4>
                </div>
              </div>
            ))}
            {filteredVideos.length === 0 && <p className="text-gray-500 text-center col-span-3 py-16 text-sm">No videos in this category.</p>}
          </div>
        )}

        {/* WALLPAPERS */}
        {mainTab === 'wallpapers' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDownloads.map(asset => (
              <div key={asset.id} className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-[#FFD700]/20 transition-all duration-300 flex flex-col">
                <div className="aspect-[4/3] bg-black/60 relative overflow-hidden border-b border-white/5">
                  <img
                    src={asset.url.split(',')[0].trim()}
                    alt={asset.title}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                    onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/75 text-[#FFD700] text-[9px] font-bold uppercase border border-[#FFD700]/20">{asset.category}</span>
                  {asset.size && <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-white/10 text-gray-300 text-[8px] font-bold uppercase">{asset.size}</span>}
                </div>
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <h4 className="text-white text-xs font-bold line-clamp-2 mb-3">{asset.title}</h4>
                  <button
                    onClick={() => triggerDownload(asset.url, asset.title)}
                    className="w-full py-2 bg-[#FFD700] text-[#0B0F19] font-black uppercase tracking-wider text-[10px] rounded hover:bg-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download size={11} /> Download File
                  </button>
                </div>
              </div>
            ))}
            {filteredDownloads.length === 0 && <p className="text-gray-500 text-center col-span-4 py-16 text-sm">No downloads in this category.</p>}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && filteredPhotos.length > 0 && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 bg-black/97 backdrop-blur-md" onClick={() => setLightboxIndex(null)}>
          {/* Header */}
          <div className="w-full flex items-center justify-between py-2 px-4 z-10">
            <div className="text-white text-xs font-semibold bg-black/40 px-3.5 py-2 rounded-full border border-white/5">
              {filteredPhotos[lightboxIndex]?.title}
              <span className="text-[#FFD700] text-[9px] font-black uppercase tracking-widest ml-3 bg-[#FFD700]/10 px-2 py-0.5 rounded-full border border-[#FFD700]/20">
                {filteredPhotos[lightboxIndex]?.category}
              </span>
            </div>
            <div className="flex items-center gap-3 bg-black/60 px-4 py-1.5 rounded-full border border-white/10">
              <button onClick={e => { e.stopPropagation(); setZoomScale(s => Math.min(3, s + 0.25)); }} className="text-gray-400 hover:text-white transition-colors" aria-label="Zoom in"><ZoomIn size={16} /></button>
              <button onClick={e => { e.stopPropagation(); setZoomScale(s => Math.max(0.5, s - 0.25)); }} className="text-gray-400 hover:text-white transition-colors" aria-label="Zoom out"><ZoomOut size={16} /></button>
              <button onClick={e => { e.stopPropagation(); setZoomScale(1); }} className="text-gray-400 hover:text-white transition-colors" aria-label="Reset zoom"><RotateCcw size={16} /></button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button onClick={e => { e.stopPropagation(); triggerDownload(filteredPhotos[lightboxIndex]!.url, filteredPhotos[lightboxIndex]!.title); }} className="text-gray-400 hover:text-[#FFD700] transition-colors" aria-label="Download"><Download size={16} /></button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button onClick={() => setLightboxIndex(null)} className="text-gray-400 hover:text-[#FFD700] transition-colors" aria-label="Close"><X size={18} /></button>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex-grow w-full flex items-center justify-center overflow-hidden">
            <button onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : filteredPhotos.length - 1)); setZoomScale(1); }} className="absolute left-4 z-10 p-3 rounded-full bg-black/60 text-white hover:text-[#FFD700] border border-white/10" aria-label="Previous photo"><ChevronLeft size={20} /></button>
            <div className="max-w-full max-h-[80vh] flex items-center justify-center transition-transform duration-200" style={{ transform: `scale(${zoomScale})` }}>
              <img
                src={filteredPhotos[lightboxIndex]?.url.split(',')[0].trim()}
                alt={filteredPhotos[lightboxIndex]?.title}
                className="max-w-[90vw] max-h-[75vh] object-contain rounded border border-white/10"
                onClick={e => e.stopPropagation()}
              />
            </div>
            <button onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i !== null && i < filteredPhotos.length - 1 ? i + 1 : 0)); setZoomScale(1); }} className="absolute right-4 z-10 p-3 rounded-full bg-black/60 text-white hover:text-[#FFD700] border border-white/10" aria-label="Next photo"><ChevronRight size={20} /></button>
          </div>

          {/* Thumbnails */}
          <div className="w-full flex justify-center gap-2 pb-2 overflow-x-auto">
            {filteredPhotos.slice(0, 10).map((item, idx) => (
              <button key={item.id} onClick={e => { e.stopPropagation(); setLightboxIndex(idx); setZoomScale(1); }}
                className={`flex-shrink-0 w-14 h-10 rounded overflow-hidden border-2 transition-all ${lightboxIndex === idx ? 'border-[#FFD700] opacity-100' : 'border-white/10 opacity-50 hover:opacity-75'}`}
              >
                <img src={item.url.split(',')[0].trim()} alt={item.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setActiveVideo(null)}>
          <div className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-sm">{activeVideo.title}</h3>
              <button onClick={() => setActiveVideo(null)} className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors" aria-label="Close video"><X size={18} /></button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black">
              <iframe
                src={getEmbedUrl(activeVideo.url)}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
