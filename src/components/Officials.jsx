import React, { useState } from 'react';

const TAMIL_NADU_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 
  'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 
  'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 
  'Thoothukudi', 'Trichy', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 
  'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
];

const firstNames = ['Anand', 'Bala', 'Chandran', 'Dinesh', 'Elango', 'Ganesh', 'Hari', 'Ilayaraja', 'Jeeva', 'Kamal', 'Logesh', 'Mani', 'Naveen', 'Prabhu', 'Rajesh', 'Sanjay', 'Thiru', 'Vasanth', 'Yuvaraj', 'Divya', 'Priya', 'Ramya', 'Abirami', 'Kavitha'];
const lastNames = ['Kumar', 'Rajan', 'Prasad', 'Siddharth', 'Karthik', 'Murugan', 'Selvam', 'Balan', 'Pandian', 'Devi', 'Lakshmi', 'Sundaram'];

const getDeterministicCoordinator = (districtName) => {
  if (districtName === 'Chennai') return { name: 'Suresh Kumar', role: 'State President & Chennai Coordinator', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80', district: 'Chennai' };
  if (districtName === 'Madurai') return { name: 'Gautham Ram', role: 'Vice President & Madurai Coordinator', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80', district: 'Madurai' };
  if (districtName === 'Coimbatore') return { name: 'Karthik Raja', role: 'Treasurer & Coimbatore Coordinator', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop&q=80', district: 'Coimbatore' };
  if (districtName === 'Trichy') return { name: 'Ramanathan', role: 'General Secretary & Trichy Coordinator', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&fit=crop&q=80', district: 'Trichy' };
  if (districtName === 'Salem') return { name: 'Arun Prasad', role: 'State Organizer & Salem Coordinator', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&fit=crop&q=80', district: 'Salem' };
  if (districtName === 'Tirunelveli') return { name: 'Vijay Kumar', role: 'Executive Director & Tirunelveli Coordinator', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&fit=crop&q=80', district: 'Tirunelveli' };

  let hash = 0;
  for (let i = 0; i < districtName.length; i++) {
    hash = districtName.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  
  const firstName = firstNames[hash % firstNames.length];
  const lastName = lastNames[(hash + 3) % lastNames.length];
  const isFemale = firstName === 'Divya' || firstName === 'Priya' || firstName === 'Ramya' || firstName === 'Abirami' || firstName === 'Kavitha';
  
  const femaleImages = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&fit=crop&q=80'
  ];
  
  const maleImages = [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&fit=crop&q=80'
  ];
  
  const imageUrl = isFemale 
    ? femaleImages[hash % femaleImages.length] 
    : maleImages[hash % maleImages.length];
     
  return {
    name: `${firstName} ${lastName}`,
    role: `District President & ${districtName} Coordinator`,
    image: imageUrl,
    district: districtName
  };
};

const officialsList = TAMIL_NADU_DISTRICTS.map(getDeterministicCoordinator);

const Officials = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const displayedOfficials = selectedDistrict === 'All'
    ? officialsList.filter(o => ['Chennai', 'Madurai', 'Coimbatore', 'Trichy', 'Salem', 'Tirunelveli'].includes(o.district))
    : officialsList.filter(o => o.district === selectedDistrict);

  return (
    <section id="officials" className="py-24 bg-background relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-10" data-aos="fade-up" data-aos-duration="1000">
          <p className="text-primary text-xs uppercase tracking-[0.2em] font-semibold mb-2">Leadership Team</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Fans Club <span className="text-primary text-glow-gold">Officials</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-4 rounded-full" />
        </div>

        {/* District Selector Filter */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-16" data-aos="fade-up" data-aos-duration="1000">
          <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Search District Coordinator:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-[#121212] border border-white/10 rounded-lg py-2.5 px-4 text-xs font-semibold text-white focus:outline-none focus:border-primary w-full sm:max-w-xs cursor-pointer shadow-md transition-all hover:border-primary/50"
          >
            <option value="All">All Main Leaders (State Team)</option>
            {TAMIL_NADU_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d} District</option>
            ))}
          </select>
        </div>

        {/* Officials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedOfficials.map((official, idx) => (
            <div 
              key={official.district}
              className="group relative rounded-xl overflow-hidden bg-cardBg border border-white/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-gold-glow/10 animate-fade-in"
            >
              {/* Image Frame */}
              <div className="aspect-[4/5] overflow-hidden relative bg-slate-950">
                <img 
                  src={official.image} 
                  alt={official.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => { e.target.src = '/gautham_about.jpg'; }}
                />
                
                {/* Metallic Overlay Accent */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-90" />
                
                {/* District Badge */}
                <span className="absolute top-4 right-4 px-3 py-1 bg-accent/80 backdrop-blur-md border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {official.district}
                </span>
              </div>

              {/* Text Info */}
              <div className="p-6 text-center relative bg-gradient-to-b from-transparent to-[#0B0F19]/90">
                <h4 className="text-xl font-extrabold text-white tracking-wide mb-1 group-hover:text-primary transition-colors">
                  {official.name}
                </h4>
                <p className="text-xs text-gray-300 font-medium tracking-wide uppercase">
                  {official.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Officials;
