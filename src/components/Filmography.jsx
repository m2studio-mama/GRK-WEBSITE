import React, { useState } from 'react';
import { Search, Play, X, Star } from 'lucide-react';

const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  
  try {
    let videoId = '';
    if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v');
    } else if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/');
      if (parts[1]) {
        videoId = parts[1].split(/[?#]/)[0];
      }
    } else if (url.includes('youtube.com/shorts/')) {
      const parts = url.split('youtube.com/shorts/');
      if (parts[1]) {
        videoId = parts[1].split(/[?#]/)[0];
      }
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
  } catch (e) {
    console.error('Error parsing YouTube URL:', e);
  }
  return url;
};

const Filmography = ({ movies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [activeTrailer, setActiveTrailer] = useState(null);

  const genres = ['All', 'Action', 'Romance', 'Drama', 'Comedy'];

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          movie.character.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <section id="filmography" className="py-24 bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <p className="text-primary text-xs uppercase tracking-[0.2em] font-semibold mb-2">Cinematic Records</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Official <span className="text-primary text-glow-gold">Filmography</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-4 rounded-full" />
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          {/* Genre Filters */}
          <div className="flex flex-wrap gap-2 order-2 md:order-1">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 border ${
                  selectedGenre === genre
                    ? 'bg-primary text-black border-primary shadow-gold-glow'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:border-primary/40 hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:max-w-xs order-1 md:order-2">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search movie or character..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white/10 transition-all duration-300"
            />
          </div>
        </div>

        {/* Movie Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredMovies.map((movie) => (
              <div 
                key={movie.id}
                className="group relative rounded-lg overflow-hidden bg-[#121212] border border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-gold-glow"
              >
                {/* Movie Poster Wrapper */}
                <div className="aspect-[2/3] w-full overflow-hidden relative">
                  <img 
                    src={movie.poster} 
                    alt={movie.name} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Glass Card Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6" />
                </div>

                {/* Card Details (Always visible but expands/glows on hover) */}
                <div className="p-5 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-primary font-bold text-xs uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                      {movie.genre}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold">{movie.year}</span>
                  </div>
                  
                  <h3 className="text-white text-lg font-bold group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {movie.name}
                  </h3>
                  
                  <p className="text-gray-400 text-xs mt-1.5 line-clamp-1 italic">
                    as {movie.character}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="text-primary w-3.5 h-3.5 fill-current" />
                      <span className="text-white font-bold text-xs">{movie.rating}</span>
                      <span className="text-gray-500 text-[10px]">/10</span>
                    </div>

                    <button
                      onClick={() => setActiveTrailer(movie.trailer)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-accent text-white font-semibold text-xs rounded uppercase tracking-wider hover:bg-primary hover:text-black hover:border-primary transition-all duration-300 shadow-blue-glow hover:shadow-white/20"
                    >
                      <Play size={10} className="fill-current" />
                      Trailer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 border border-white/5 rounded-lg">
            <p className="text-gray-400 text-lg">No movies found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Trailer Modal Popup */}
      {activeTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-black rounded-lg border border-primary/20 overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setActiveTrailer(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:text-primary transition-colors"
            >
              <X size={20} />
            </button>
            
            {/* Aspect Ratio Video container */}
            <div className="aspect-video w-full">
              <iframe
                src={getEmbedUrl(activeTrailer)}
                title="Movie Trailer"
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
};

export default Filmography;
