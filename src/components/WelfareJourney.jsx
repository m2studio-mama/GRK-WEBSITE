import React from 'react';
import { Heart, BookOpen, Droplets, ShieldAlert, Award, HelpingHand } from 'lucide-react';
import Odometer from './Odometer';

const missions = [
  {
    title: 'Medical Support',
    icon: Droplets,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&fit=crop&q=80',
    details: [
      'Blood Donation Camps',
      'Free Medical Camps',
      'Health Awareness Programs',
      'Emergency Blood Support'
    ]
  },
  {
    title: 'Food Distribution',
    icon: HelpingHand,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&fit=crop&q=80',
    details: [
      'Feeding Orphanage Homes',
      'Homeless Food Drives',
      'Disaster Hydration Support',
      'Festival Feast Sponsorships'
    ]
  },
  {
    title: 'Education Support',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&fit=crop&q=80',
    details: [
      'Helping Underprivileged Students',
      'Stationery & Book Distribution',
      'Educational Guidance Seminars',
      'Free Evening Tuition Support'
    ]
  },
  {
    title: 'Green Initiatives',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&fit=crop&q=80',
    details: [
      'Go-Green Awareness Drives',
      'Roadside Plantation Campaigns',
      'Seed-Ball Distribution',
      'Water Conservation Programs'
    ]
  },
  {
    title: 'Disaster Relief',
    icon: ShieldAlert,
    image: 'https://images.unsplash.com/photo-1461530867269-02dd941a5477?w=600&fit=crop&q=80',
    details: [
      'Emergency Flood Supplies',
      'Cyclone Rehabilitation Assist',
      'Essential Material Distribution',
      'Volunteer Rescue Support'
    ]
  },
  {
    title: 'Youth & Sports',
    icon: Award,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&fit=crop&q=80',
    details: [
      'District Sports Tournaments',
      'Volleyball & Chess Competitions',
      'Appreciation Awards & Cash Prizes',
      'Youth Talent Development'
    ]
  }
];

const WelfareJourney = () => {
  return (
    <section id="welfare" className="py-24 bg-background relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Welfare Journey Banner with Statistics (Full Width Edge-to-Edge) */}
      <div className="w-full relative z-10 mb-20" data-aos="fade-up" data-aos-duration="1000">
        <div className="relative overflow-hidden min-h-[400px] py-16 flex items-center justify-center bg-slate-950 border-y border-white/10 shadow-2xl">
          {/* Background image overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&fit=crop&q=80')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background" />

          {/* Banner content */}
          <div className="relative z-10 p-8 sm:p-12 text-center w-full max-w-4xl">
            <h3 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-wider mb-6">
              Welfare <span className="text-primary text-glow-gold">Journey</span>
            </h3>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-24 mb-6">
              <div className="text-center">
                <div className="flex justify-center items-center">
                  <Odometer value={15} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-widest mt-2">
                  Years of Service
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center items-center">
                  <Odometer value={8500} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-widest mt-2">
                  Welfare Works Completed
                </div>
              </div>
            </div>
            
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto italic mt-6">
              "We strive to build a strong and responsible community by organizing public welfare activities on every occasion, celebrating cinema through humanity."
            </p>
          </div>
        </div>
      </div>

      {/* Core Mission Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
          <p className="text-primary text-xs uppercase tracking-[0.2em] font-semibold mb-2">Our Pillars</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Core Welfare <span className="text-primary text-glow-gold">Missions</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {missions.map((mission, idx) => {
            const Icon = mission.icon;
            return (
              <div 
                key={idx} 
                className="group rounded-2xl bg-cardBg border border-white/10 hover:border-primary/30 transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-gold-glow/5 overflow-hidden flex flex-col"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay={idx * 100}
              >
                {/* Card Image */}
                <div className="h-48 w-full overflow-hidden relative bg-slate-950">
                  <img 
                    src={mission.image} 
                    alt={mission.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => { e.target.src = '/hero_banner.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent opacity-80" />
                  
                  {/* Icon Badge Overlay */}
                  <div className="absolute bottom-4 left-6 w-10 h-10 rounded-lg bg-background/80 backdrop-blur-md border border-primary/20 flex items-center justify-center shadow-md">
                    <Icon className="text-primary w-5 h-5" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-extrabold text-white tracking-wide mb-4 group-hover:text-primary transition-colors">
                    {mission.title}
                  </h3>
                  
                  <ul className="space-y-2">
                    {mission.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WelfareJourney;
