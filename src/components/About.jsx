import React, { useState } from 'react';
import { Film, Award, Calendar, Users } from 'lucide-react';
import Odometer from './Odometer';

const StatCounter = ({ endValue, label, icon: Icon, suffix = "" }) => {
  return (
    <div className="glass-card p-6 rounded-lg text-center border border-white/10 hover:border-primary/20 transition-all duration-300">
      <div className="flex justify-center mb-3">
        <Icon className="text-primary w-8 h-8" />
      </div>
      <div className="mb-1">
        <Odometer value={endValue} suffix={suffix} />
      </div>
      <div className="text-xs sm:text-sm text-gray-200 font-bold tracking-wide uppercase">
        {label}
      </div>
    </div>
  );
};

const About = () => {
  const [activeTab, setActiveTab] = useState('bio');

  const tabs = [
    { id: 'bio', label: 'Biography' },
    { id: 'career', label: 'Career Journey' },
    { id: 'contributions', label: 'Contributions' }
  ];

  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-primary text-xs uppercase tracking-[0.2em] font-semibold mb-2">The Actor & The Legacy</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            About <span className="text-primary text-glow-gold">Gautham Ram Karthik</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-4 rounded-full" />
        </div>

        {/* Layout: Image Left, Content Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Image Column */}
          <div className="lg:col-span-5 flex justify-center" data-aos="fade-right" data-aos-duration="1000">
            <div className="relative group w-full max-w-sm sm:max-w-md">
              {/* Back Gold Border */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500" />
              
              {/* Image Frame */}
              <div className="relative rounded-lg overflow-hidden bg-black aspect-[3/4] border border-white/10 shadow-2xl">
                <img 
                  src="/gautham_about.jpg" 
                  alt="Gautham Ram Karthik Portrait" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-1">Lead Actor</p>
                  <p className="text-white text-xl font-bold tracking-wide">Tamil Cinema</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-7 flex flex-col justify-center" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
            {/* Tabs Header */}
            <div className="flex border-b border-white/10 mb-8 gap-4 sm:gap-8 overflow-x-auto pb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-sm sm:text-base font-semibold tracking-wide uppercase border-b-2 transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div className="min-h-[220px] text-gray-300 leading-relaxed text-sm sm:text-base space-y-4">
              {activeTab === 'bio' && (
                <>
                  <p>
                    Born into a legendary cinematic family on September 12th, Gautham Ram Karthik is a prominent Indian actor working primarily in Tamil cinema. He is the son of the charismatic actor Karthik Muthuraman and grandson of the iconic veteran actor R. Muthuraman.
                  </p>
                  <p>
                    Gautham spent his early life in Ooty, completing his schooling at Hebron School before pursuing his college education in Bangalore. Growing up surrounded by artistic influences, he developed a deep passion for music, sports, and eventually acting.
                  </p>
                  <p className="font-semibold text-primary">
                    He represents the third generation of the Muthuraman-Karthik legacy, bringing a unique blend of heritage and contemporary style to the screen.
                  </p>
                </>
              )}

              {activeTab === 'career' && (
                <>
                  <p>
                    Gautham Karthik was introduced to the silver screen by the legendary director Mani Ratnam in the 2013 romantic drama <span className="text-white font-medium">"Kadal"</span>. His intense performance as Thomas earned him the Vijay Award for Best Debut Actor.
                  </p>
                  <p>
                    He quickly carved a niche for himself with diverse roles. He proved his commercial viability with high-octane films like <span className="text-white font-medium">"Ivan Thanthiran"</span> and rural action dramas like <span className="text-white font-medium">"Devarattam"</span>.
                  </p>
                  <p>
                    His career-defining performance came in 2023 with <span className="text-white font-medium">"Pathu Thala"</span> alongside Silambarasan TR, and the period drama <span className="text-white font-medium">"August 16, 1947"</span>, establishing him as one of the most versatile young heroes of his generation.
                  </p>
                </>
              )}

              {activeTab === 'contributions' && (
                <>
                  <p>
                    Beyond the screen, Gautham is deeply committed to community welfare. Guided by the principles of social betterment, he actively sponsors educational assistance programs, rural welfare camps, and eye donation awareness drives through his fan network.
                  </p>
                  <p>
                    As an artist, he has always advocated for experimental cinema, supporting young, upcoming filmmakers and scriptwriters, which led to modern cult classics like <span className="text-white font-medium">"Rangoon"</span>.
                  </p>
                  <p>
                    The Gautham Ram Karthik Fan Club channels this energy, bringing together thousands of fans across districts to organize public welfare activities on special occasions.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Counter Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
          <StatCounter endValue={18} label="Movies" icon={Film} suffix="+" />
          <StatCounter endValue={6} label="Awards Won" icon={Award} />
          <StatCounter endValue={85} label="Welfare Events" icon={Calendar} suffix="+" />
          <StatCounter endValue={12400} label="Fan Members" icon={Users} suffix="+" />
        </div>
      </div>
    </section>
  );
};

export default About;
