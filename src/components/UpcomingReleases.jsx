import React, { useState } from 'react';
import { Film, Calendar, Play } from 'lucide-react';

const upcomingMovies = [
  {
    id: 'up1',
    title: 'Mr. X',
    role: 'Special Agent (Co-lead with Arya)',
    status: 'In Production',
    releaseDate: 'Summer 2026',
    genre: 'Action Spy Thriller',
    description: 'An action-packed spy thriller following two covert operatives fighting an international conspiracy. High-octane stunts shot across Europe.',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&fit=crop&q=80',
    trailer: 'https://www.youtube.com/embed/nB5i_4Uq7xQ'
  },
  {
    id: 'up2',
    title: 'Bloody Politics',
    role: 'Ilaiyaraaja (Aspiring Politician)',
    status: 'Post-Production',
    releaseDate: 'Late 2026',
    genre: 'Political Comedy Satire',
    description: 'A sharp satirical look at modern grassroots election campaigns, charting the chaotic journey of an idealistic young social worker.',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&fit=crop&q=80',
    trailer: 'https://www.youtube.com/embed/84qX_u47YqI'
  }
];

const UpcomingReleases = () => {
  const [activeId, setActiveId] = useState('up1');

  return (
    <section id="upcoming" className="py-24 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <p className="text-primary text-xs uppercase tracking-[0.2em] font-semibold mb-2">Exclusive Preview</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Upcoming <span className="text-primary text-glow-gold">Releases</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-4 rounded-full" />
        </div>

        {/* Expanding Panels Grid */}
        <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
          {upcomingMovies.map((movie) => {
            const isActive = activeId === movie.id;
            return (
              <div
                key={movie.id}
                onMouseEnter={() => setActiveId(movie.id)}
                onClick={() => setActiveId(movie.id)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out flex-1 ${
                  isActive ? 'lg:flex-[2.5] shadow-gold-glow/20' : 'lg:flex-[1] opacity-70 hover:opacity-90'
                }`}
              >
                {/* Background Image */}
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.target.src = '/hero_banner.jpg'; }}
                />
                
                {/* Gradient Filter Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent transition-opacity duration-500 ${
                  isActive ? 'opacity-90' : 'opacity-70'
                }`} />

                {/* Content Block */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-primary text-black font-extrabold text-[10px] uppercase tracking-wider rounded-md">
                      {movie.status}
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-extrabold tracking-wide mb-2">
                    {movie.title}
                  </h3>

                  {/* Expanded Content View */}
                  <div className={`transition-all duration-700 overflow-hidden ${
                    isActive ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <p className="text-sm text-gray-300 mb-4 max-w-xl leading-relaxed">
                      {movie.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 block">Character Role</span>
                        <span className="text-xs sm:text-sm font-semibold text-primary">{movie.role}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 block">Expected Launch</span>
                        <span className="text-xs sm:text-sm font-semibold text-primary">{movie.releaseDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom details collapsed view always showing brief tagline */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
                    <Film size={14} className="text-primary" />
                    <span>{movie.genre}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcomingReleases;
