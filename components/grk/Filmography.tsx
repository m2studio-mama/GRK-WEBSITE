'use client';

import { useState, useEffect } from 'react';
import { Film, Star, Play, X, ChevronRight } from 'lucide-react';
import { getMovies } from '@/lib/firebase/db';
import ShareButtons from './ShareButtons';

type Movie = {
  id: string;
  name: string;
  year: string;
  genre: string;
  character: string;
  poster: string;
  trailer: string;
  rating: string;
};

const GENRES = ['All', 'Action', 'Drama', 'Romance', 'Comedy'];

interface Props { refreshKey?: number }

export default function Filmography({ refreshKey }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeGenre, setActiveGenre] = useState('All');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies().then(data => {
      setMovies(data as Movie[]);
      setLoading(false);
    });
  }, [refreshKey]);

  const filtered = activeGenre === 'All' ? movies : movies.filter(m => m.genre === activeGenre);

  // Sort: upcoming (latest year) first
  const sorted = [...filtered].sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <section id="filmography" className="py-24 bg-[#080B14] relative overflow-hidden">
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[600px] h-[600px] bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-[#FFD700] text-xs uppercase tracking-[0.2em] font-bold mb-3">Cinema</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight text-balance">
            Official <span className="text-[#FFD700] text-glow-gold">Filmography</span>
          </h2>
          <div className="w-16 h-1 bg-[#FFD700] mx-auto mt-4 rounded-full" />
        </div>

        {/* Genre Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all duration-300 ${
                activeGenre === genre
                  ? 'bg-[#FFD700]/15 text-[#FFD700] border-[#FFD700]/40'
                  : 'text-gray-400 border-white/10 bg-white/3 hover:text-white hover:border-white/25'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {sorted.map((movie, i) => (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className="group relative rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-[#FFD700]/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up bg-[#111827]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Poster */}
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img
                    src={movie.poster}
                    alt={`${movie.name} movie poster`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="p-3 rounded-full bg-[#FFD700] text-[#0B0F19] shadow-gold-glow">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                  {/* Badges */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-[#E50914] text-white px-2 py-0.5 rounded">
                      {movie.year}
                    </span>
                  </div>
                  {movie.rating && (
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/70 rounded px-1.5 py-0.5">
                      <Star size={9} className="text-[#FFD700] fill-[#FFD700]" />
                      <span className="text-white text-[9px] font-bold">{movie.rating}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-white font-black text-sm truncate">{movie.name}</h3>
                  <p className="text-gray-500 text-[10px] font-semibold truncate mt-0.5 font-serif">{movie.character}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] font-bold text-[#FFD700] uppercase tracking-wider bg-[#FFD700]/10 px-1.5 py-0.5 rounded">
                      {movie.genre}
                    </span>
                    <ChevronRight size={12} className="text-gray-600 group-hover:text-[#FFD700] transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#111827] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-gray-400 hover:text-white transition-colors"
              aria-label="Close movie details"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              {/* Poster Side */}
              <div className="aspect-[2/3] sm:aspect-auto relative">
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.name}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111827] hidden sm:block" />
              </div>

              {/* Details Side */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black bg-[#E50914] text-white px-2 py-0.5 rounded uppercase">{selectedMovie.year}</span>
                    <span className="text-[10px] font-black bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 px-2 py-0.5 rounded uppercase">{selectedMovie.genre}</span>
                  </div>
                  <h3 className="text-white text-2xl font-black mb-1">{selectedMovie.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 font-serif">as <span className="text-white font-semibold">{selectedMovie.character}</span></p>

                  {selectedMovie.rating && (
                    <div className="flex items-center gap-1.5 mb-6">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          size={14}
                          className={s <= Math.floor(Number(selectedMovie.rating) / 2) ? 'text-[#FFD700] fill-[#FFD700]' : 'text-gray-600'}
                        />
                      ))}
                      <span className="text-gray-400 text-xs ml-1 font-serif">{selectedMovie.rating}/10</span>
                    </div>
                  )}
                </div>

                {/* Trailer */}
                {selectedMovie.trailer && (
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-black mb-4">
                    <iframe
                      src={selectedMovie.trailer}
                      title={`${selectedMovie.name} Trailer`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                
                {/* Share Buttons */}
                <div className="pt-4 border-t border-white/10">
                  <ShareButtons title={selectedMovie.name} description={`${selectedMovie.character} in ${selectedMovie.name} (${selectedMovie.year})`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
