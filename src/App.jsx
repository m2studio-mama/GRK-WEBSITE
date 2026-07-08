import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import WelfareJourney from './components/WelfareJourney';
import Filmography from './components/Filmography';
import UpcomingReleases from './components/UpcomingReleases';
import MediaLibrary from './components/MediaLibrary';
import News from './components/News';
import Achievements from './components/Achievements';
import Officials from './components/Officials';
import FanClub from './components/FanClub';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import { 
  getMovies, 
  getGallery, 
  getVideos, 
  getNews, 
  getDownloads, 
  getTimeline,
  getCurrentAdmin 
} from './firebase/db';
import { Film } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Content States
  const [movies, setMovies] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [videos, setVideos] = useState([]);
  const [news, setNews] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [timeline, setTimeline] = useState([]);

  // Fetch all site content
  const loadPortalData = async () => {
    try {
      const [
        moviesData, 
        galleryData, 
        videosData, 
        newsData, 
        downloadsData, 
        timelineData
      ] = await Promise.all([
        getMovies(),
        getGallery(),
        getVideos(),
        getNews(),
        getDownloads(),
        getTimeline()
      ]);

      setMovies(moviesData);
      setGallery(galleryData);
      setVideos(videosData);
      setNews(newsData);
      setDownloads(downloadsData);
      setTimeline(timelineData);
    } catch (error) {
      console.error('Error fetching portal database contents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 120,
    });
    
    loadPortalData();

    // Check admin authentication state (to verify dashboard access works)
    const unsubscribe = getCurrentAdmin((adminUser) => {
      setIsAdminLoggedIn(!!adminUser);
    });

    // Direct access to admin panel if URL query contains ?admin=true or pathname is /admin
    const params = new URLSearchParams(window.location.search);
    if (
      params.get('admin') === 'true' || 
      window.location.pathname === '/admin' || 
      window.location.pathname === '/admin/'
    ) {
      setShowAdmin(true);
    }

    // Intersection Observer to highlight current active navigation tab
    const sections = ['home', 'about', 'welfare', 'filmography', 'upcoming', 'media-library', 'news', 'officials', 'fan-club', 'contact'];
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Refresh AOS scroll triggers when dynamic records are populated
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  }, [isLoading, movies, gallery, videos, news, downloads, timeline]);

  const triggerScroll = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elRect = el.getBoundingClientRect().top;
      const position = elRect - bodyRect - offset;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-background flex flex-col items-center justify-center text-center">
        {/* Animated Spotlight Icon */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <img 
            src="/logo.png" 
            className="w-20 h-20 rounded-full border-2 border-primary animate-pulse relative object-contain" 
            alt="Gautham Ram Karthik Fan Club Logo" 
          />
        </div>
        <h2 className="text-white text-2xl font-extrabold tracking-widest uppercase">
          GAUTHAM RAM <span className="text-primary text-glow-gold">KARTHIK</span>
        </h2>
        <p className="text-gray-500 text-xs tracking-widest uppercase mt-2 font-medium">Loading Cinematic Experience...</p>
        
        {/* Shimmer loading bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-primary w-2/3 rounded-full animate-pulse" style={{ animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-black">
      {/* Navbar navigation */}
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminClick={() => setShowAdmin(true)}
      />

      {/* Hero Section */}
      <Hero 
        onJoinClick={() => triggerScroll('fan-club')}
        onExploreClick={() => triggerScroll('media-library')}
      />

      {/* About Section */}
      <About />

      {/* Welfare Journey (Mission & Stats) */}
      <WelfareJourney />

      {/* Filmography Section */}
      <Filmography movies={movies} />

      {/* Upcoming Releases Section */}
      <UpcomingReleases />

      {/* Media Library (Photos, Videos, and Wallpapers) */}
      <MediaLibrary 
        galleryItems={gallery} 
        videoItems={videos} 
        downloadItems={downloads} 
      />

      {/* News & Updates Section (renamed to Updates & Announcements in Navbar/Footer) */}
      <News newsItems={news} />

      {/* Achievements Timeline */}
      <Achievements timelineItems={timeline} />

      {/* Fans Club Officials */}
      <Officials />

      {/* Fan Club Join Form & Status check */}
      <FanClub />

      {/* Contact Section & Footer */}
      <Contact onAdminClick={() => setShowAdmin(true)} />

      {/* Admin Dashboard overlay modal */}
      {showAdmin && (
        <AdminDashboard 
          onClose={() => setShowAdmin(false)} 
          onDataChange={loadPortalData}
        />
      )}
    </div>
  );
}

export default App;
