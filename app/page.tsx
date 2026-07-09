'use client';

import { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/grk/Navbar';
import { ToastProvider } from '@/components/grk/ToastContext';
import HeroSection from '@/components/grk/HeroSection';
import About from '@/components/grk/About';
import WelfareJourney from '@/components/grk/WelfareJourney';
import Filmography from '@/components/grk/Filmography';
import UpcomingReleases from '@/components/grk/UpcomingReleases';
import MediaLibrary from '@/components/grk/MediaLibrary';
import News from '@/components/grk/News';
import Achievements from '@/components/grk/Achievements';
import Officials from '@/components/grk/Officials';
import FanClub from '@/components/grk/FanClub';
import Contact from '@/components/grk/Contact';
import AdminDashboard from '@/components/grk/AdminDashboard';
import WhatsAppFAB from '@/components/grk/WhatsAppFAB';
import Newsletter from '@/components/grk/Newsletter';

export default function Home() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#admin-portal') {
        setAdminOpen(true);
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret shortcut combination: Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDataChange = useCallback(() => {
    setDataVersion(v => v + 1);
  }, []);

  const openAdmin = () => setAdminOpen(true);
  const closeAdmin = () => setAdminOpen(false);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#0B0F19] flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-[#FFD700]/20 rounded-full blur-xl animate-pulse" />
          <img
            src="/logo.png"
            className="w-20 h-20 rounded-full border-2 border-[#FFD700] animate-pulse relative object-contain"
            alt="Gautham Ram Karthik Fan Club Logo"
          />
        </div>
        <h2 className="text-white text-2xl font-extrabold tracking-widest uppercase">
          GAUTHAM RAM <span className="text-[#FFD700] text-glow-gold">KARTHIK</span>
        </h2>
        <p className="text-gray-500 text-xs tracking-widest uppercase mt-2 font-medium">
          Loading Cinematic Experience...
        </p>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-6">
          <div
            className="h-full bg-[#FFD700] w-2/3 rounded-full animate-pulse"
            style={{ animationDuration: '1.5s' }}
          />
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <Navbar onAdminClick={openAdmin} />

      <main id="main-content">
        <HeroSection />
        <About refreshKey={dataVersion} />
        <WelfareJourney />
        <UpcomingReleases refreshKey={dataVersion} />
        <Filmography refreshKey={dataVersion} />
        <MediaLibrary refreshKey={dataVersion} />
        <News refreshKey={dataVersion} />
        <Achievements refreshKey={dataVersion} />
        <Officials refreshKey={dataVersion} />
        <FanClub />
        <Newsletter />
        <Contact onAdminClick={openAdmin} />
      </main>

      <AdminDashboard
        open={adminOpen}
        onClose={closeAdmin}
        onDataChange={handleDataChange}
      />

      <WhatsAppFAB />
    </ToastProvider>
  );
}
