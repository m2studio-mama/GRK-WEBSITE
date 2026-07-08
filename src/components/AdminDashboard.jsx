import React, { useState, useEffect } from 'react';
import { 
  Lock, Key, ShieldAlert, LogOut, LayoutDashboard, Newspaper, 
  Image as ImageIcon, Video, Download, Users, FileSpreadsheet, 
  Trash2, Plus, X, Check, Eye, EyeOff, ExternalLink, Calendar, HelpCircle, Globe
} from 'lucide-react';
import { 
  adminLogin, 
  adminLogout, 
  getCurrentAdmin, 
  getNews, 
  addNewsItem, 
  deleteNewsItem, 
  getGallery, 
  addGalleryItem, 
  deleteGalleryItem, 
  getVideos, 
  addVideoItem, 
  deleteVideoItem, 
  getDownloads, 
  addDownloadItem, 
  deleteDownloadItem, 
  getRegistrations, 
  updateRegistrationStatus, 
  deleteRegistration 
} from '../firebase/db';

const AdminDashboard = ({ onClose, onDataChange }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState('stats'); // stats, news, gallery, videos, downloads, registrations
  const [stats, setStats] = useState({
    totalFans: 0,
    pendingFans: 0,
    newsCount: 0,
    galleryCount: 0,
    videosCount: 0,
    downloadsCount: 0
  });

  // Data lists
  const [newsList, setNewsList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [videosList, setVideosList] = useState([]);
  const [downloadsList, setDownloadsList] = useState([]);
  const [registrationsList, setRegistrationsList] = useState([]);

  // Search/Filter for registrations
  const [regSearch, setRegSearch] = useState('');
  const [regFilter, setRegFilter] = useState('All'); // All, Pending, Approved
  const [adminDistrictView, setAdminDistrictView] = useState('All');
  const [showPassword, setShowPassword] = useState(false);

  // Modals for adding items
  const [showAddModal, setShowAddModal] = useState(null); // 'news', 'gallery', 'video', 'download'
  
  // Add item form states
  const [newsForm, setNewsForm] = useState({ title: '', summary: '', content: '', image: '', featured: false });
  const [galleryForm, setGalleryForm] = useState({ title: '', category: 'Photoshoots', url: '' });
  const [videoForm, setVideoForm] = useState({ title: '', category: 'Trailers', url: '', thumbnail: '' });
  const [downloadForm, setDownloadForm] = useState({ title: '', category: 'Wallpapers', url: '', size: '' });

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = getCurrentAdmin((user) => {
      setAdminUser(user);
      if (user) {
        loadDashboardData(user);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load database items
  const loadDashboardData = async (user) => {
    const activeUser = user || adminUser;
    try {
      const [news, gall, vids, downs, regs] = await Promise.all([
        getNews(),
        getGallery(),
        getVideos(),
        getDownloads(),
        getRegistrations()
      ]);

      setNewsList(news);
      setGalleryList(gall);
      setVideosList(vids);
      setDownloadsList(downs);
      setRegistrationsList(regs);

      const visibleRegs = activeUser?.role === 'District Head'
        ? regs.filter(r => r.district && r.district.trim().toLowerCase() === activeUser.district.trim().toLowerCase())
        : regs;

      setStats({
        totalFans: visibleRegs.length,
        pendingFans: visibleRegs.filter(r => r.status === 'Pending').length,
        newsCount: news.length,
        galleryCount: gall.length,
        videosCount: vids.length,
        downloadsCount: downs.length
      });
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setLoginError('Email and Password are required');
      return;
    }
    
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const user = await adminLogin(email, password);
      setAdminUser(user);
      setActiveTab('stats');
      loadDashboardData(user);
    } catch (err) {
      setLoginError(err.message || 'Authentication failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setAdminUser(null);
    setActiveTab('stats');
  };

  // --- CRUD ACTIONS ---

  const handleAddNews = async (e) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content || !newsForm.image) {
      alert('All fields are required');
      return;
    }
    await addNewsItem(newsForm);
    setNewsForm({ title: '', summary: '', content: '', image: '', featured: false });
    setShowAddModal(null);
    loadDashboardData();
    onDataChange(); // refresh landing page state
  };

  const handleDeleteNews = async (id) => {
    if (confirm('Are you sure you want to delete this news article?')) {
      await deleteNewsItem(id);
      loadDashboardData();
      onDataChange();
    }
  };

  const handleAddGallery = async (e) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.url) {
      alert('All fields are required');
      return;
    }
    await addGalleryItem(galleryForm);
    setGalleryForm({ title: '', category: 'Photoshoots', url: '' });
    setShowAddModal(null);
    loadDashboardData();
    onDataChange();
  };

  const handleDeleteGallery = async (id) => {
    if (confirm('Are you sure you want to delete this image?')) {
      await deleteGalleryItem(id);
      loadDashboardData();
      onDataChange();
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.url || !videoForm.thumbnail) {
      alert('All fields are required');
      return;
    }
    await addVideoItem(videoForm);
    setVideoForm({ title: '', category: 'Trailers', url: '', thumbnail: '' });
    setShowAddModal(null);
    loadDashboardData();
    onDataChange();
  };

  const handleDeleteVideo = async (id) => {
    if (confirm('Are you sure you want to delete this video?')) {
      await deleteVideoItem(id);
      loadDashboardData();
      onDataChange();
    }
  };

  const handleAddDownload = async (e) => {
    e.preventDefault();
    if (!downloadForm.title || !downloadForm.url || !downloadForm.size) {
      alert('All fields are required');
      return;
    }
    await addDownloadItem(downloadForm);
    setDownloadForm({ title: '', category: 'Wallpapers', url: '', size: '' });
    setShowAddModal(null);
    loadDashboardData();
    onDataChange();
  };

  const handleDeleteDownload = async (id) => {
    if (confirm('Are you sure you want to delete this download asset?')) {
      await deleteDownloadItem(id);
      loadDashboardData();
      onDataChange();
    }
  };

  const handleUpdateStatus = async (id, status) => {
    await updateRegistrationStatus(id, status);
    loadDashboardData();
  };

  const handleDeleteReg = async (id) => {
    if (confirm('Are you sure you want to delete this registration?')) {
      await deleteRegistration(id);
      loadDashboardData();
    }
  };

  // Export to Excel / CSV Utility
  const handleExportCSV = () => {
    if (filteredRegs.length === 0) {
      alert('No registrations available to export');
      return;
    }

    const headers = ['Registration ID', 'Full Name', 'Phone', 'DOB', 'District', 'City', 'Blood Group', 'Email', 'Status', 'Joined Date'];
    const rows = filteredRegs.map((r) => [
      r.id,
      r.name,
      r.phone,
      r.dob,
      r.district,
      r.city || 'N/A',
      r.bloodGroup || 'O+',
      r.email,
      r.status,
      r.joinedDate
    ]);

    // Construct CSV String
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    rows.forEach((rowArray) => {
      const escapedRow = rowArray.map(val => `"${String(val).replace(/"/g, '""')}"`);
      csvContent += escapedRow.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Gautham_Ram_Karthik_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Extract active districts list
  const districtsList = [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 
    'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 
    'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 
    'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 
    'Thoothukudi', 'Trichy', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 
    'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
  ];

  // Filter registrations list
  const filteredRegs = registrationsList.filter((r) => {
    // Role based filtering: Super Admin can switch views between district portal views
    const matchesRole = adminUser?.role !== 'District Head' 
      ? (adminDistrictView === 'All' || (r.district && r.district.trim().toLowerCase() === adminDistrictView.trim().toLowerCase()))
      : (r.district && r.district.trim().toLowerCase() === adminUser.district.trim().toLowerCase());
    
    if (!matchesRole) return false;

    const matchesSearch = r.name.toLowerCase().includes(regSearch.toLowerCase()) || 
                          r.district.toLowerCase().includes(regSearch.toLowerCase()) ||
                          r.id.toLowerCase().includes(regSearch.toLowerCase());
    const matchesFilter = regFilter === 'All' || r.status === regFilter;
    return matchesSearch && matchesFilter;
  });

  // Render Login Card
  if (!adminUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
        <div className="relative w-full max-w-md bg-[#121212] rounded-xl border border-white/10 overflow-hidden shadow-2xl p-8">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={18} /></button>
          
          <div className="text-center mb-8">
            <img src="/logo.png" className="w-16 h-16 rounded-full border border-primary/20 mx-auto mb-4 object-contain" alt="Gautham Ram Karthik Fan Club Logo" />
            <h2 className="text-white text-2xl font-bold tracking-tight">Admin Gatekeeper</h2>
            <p className="text-gray-500 text-xs mt-1">Authenticate to access Gautham Ram Karthik Fan Club Control Center.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Admin Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600"><Lock size={14} /></span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary"
                  placeholder="admin@gauthamramkarthik.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600"><Key size={14} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-1.5 p-3 rounded bg-danger/10 border border-danger/25 text-danger text-xs font-semibold">
                <ShieldAlert size={14} />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-primary text-black font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-gold-glow flex items-center justify-center"
            >
              {isLoggingIn ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Dashboard Top Header */}
      <header className="bg-[#081630] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img src="/logo.png" className="h-8 w-8 object-contain rounded-full border border-primary/20" alt="Gautham Ram Karthik Fan Club Logo" />
          <span className="font-extrabold text-xl tracking-wider text-white">
            Gautham Ram Karthik <span className="text-primary">Fan Club</span> <span className="text-xs font-normal text-gray-500 uppercase tracking-widest border-l border-white/10 pl-3 ml-1">Admin Panel</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-white text-xs font-bold">{adminUser.name}</span>
            <span className="text-gray-500 text-[10px]">{adminUser.email}</span>
          </div>
          
          <button
            onClick={() => {
              if (window.location.pathname.includes('/admin') || window.location.search.includes('admin=')) {
                window.history.pushState({}, '', '/');
              }
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 rounded text-gray-300 text-xs font-semibold hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <Globe size={12} />
            <span>Go to Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-accent/30 rounded text-accent text-xs font-semibold hover:bg-accent hover:text-white transition-colors"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
          
          <button
            onClick={() => {
              if (window.location.pathname.includes('/admin') || window.location.search.includes('admin=')) {
                window.history.pushState({}, '', '/');
              }
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-16 md:w-64 bg-[#081630] border-r border-white/10 flex flex-col justify-between p-4">
          <div className="space-y-2">
            {[
              { id: 'stats', label: 'Stats Overview', icon: LayoutDashboard },
              { id: 'news', label: 'Updates & Announcements', icon: Newspaper, superOnly: true },
              { id: 'gallery', label: 'Manage Gallery', icon: ImageIcon, superOnly: true },
              { id: 'videos', label: 'Manage Videos', icon: Video, superOnly: true },
              { id: 'downloads', label: 'Downloads', icon: Download, superOnly: true },
              { id: 'registrations', label: 'Registrations', icon: Users }
            ].filter(tab => !tab.superOnly || adminUser?.role !== 'District Head').map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-black shadow-gold-glow'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title={tab.label}
              >
                <tab.icon size={18} className="flex-shrink-0" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="text-center text-[10px] text-gray-600 hidden md:block">
            Gautham Ram Karthik Fan Club Engine v1.0.0
          </div>
        </aside>

        {/* Dashboard Work Area */}
        <main className="flex-grow p-6 sm:p-8 overflow-y-auto bg-background">
          
          {/* STATS OVERVIEW PANEL */}
          {activeTab === 'stats' && (
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h3 className="text-white text-xl font-bold tracking-wide">Control Center Overview</h3>
                <p className="text-gray-500 text-xs mt-1">Real-time statistics and analytics of the association portal.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Total Fans Registered', value: stats.totalFans, icon: Users, color: 'text-primary', glow: 'hover:border-primary/20' },
                  { title: 'Pending Approval', value: stats.pendingFans, icon: ShieldAlert, color: 'text-danger', glow: 'hover:border-danger/20' },
                  { title: 'News Published', value: stats.newsCount, icon: Newspaper, color: 'text-blue-400', glow: 'hover:border-blue-400/20' },
                  { title: 'Asset Resources', value: stats.galleryCount + stats.videosCount + stats.downloadsCount, icon: ImageIcon, color: 'text-emerald-400', glow: 'hover:border-emerald-400/20' }
                ].map((s, idx) => (
                  <div key={idx} className={`glass-card p-6 rounded-xl border border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${s.glow}`}>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{s.title}</span>
                      <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-white/20 transition-all">
                        <s.icon className={`${s.color} w-5 h-5`} />
                      </div>
                    </div>
                    <div className="relative z-10 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white text-glow-gold tracking-tight">{s.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Guide */}
              <div className="glass-card p-6 rounded-lg border border-white/5 max-w-xl">
                <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <HelpCircle size={16} className="text-primary" />
                  Quick Administration Guide
                </h4>
                <ul className="space-y-2 text-xs text-gray-400 list-disc list-inside">
                  <li>Use <span className="text-white">Registrations</span> tab to review member registrations and generate digital IDs.</li>
                  <li>Click <span className="text-white">Export List</span> to download the active roster in standard Excel-compatible CSV format.</li>
                  <li>Publish new files or articles by selecting their respective menus and clicking <span className="text-white">Add New</span>.</li>
                </ul>
              </div>

              {/* Coordinator Activity for Super Admin / Head Office */}
              {adminUser?.role === 'Super Admin' && districtsList.length > 0 && (
                <div className="glass-card p-6 rounded-lg border border-white/5 max-w-3xl mt-6">
                  <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Users size={16} className="text-primary" />
                    District Coordinator Activity Overview
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                          <th className="p-3">District Name</th>
                          <th className="p-3 text-center">Approved Members</th>
                          <th className="p-3 text-center">Pending Review</th>
                          <th className="p-3 text-center">Total Registered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {districtsList.map((dist) => {
                          const distRegs = registrationsList.filter(r => r.district === dist);
                          const approved = distRegs.filter(r => r.status === 'Approved').length;
                          const pending = distRegs.filter(r => r.status === 'Pending').length;
                          return (
                            <tr key={dist} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-3 font-bold text-white">{dist}</td>
                              <td className="p-3 text-center text-primary font-bold">{approved}</td>
                              <td className="p-3 text-center text-accent font-semibold">{pending}</td>
                              <td className="p-3 text-center text-gray-300">{distRegs.length}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MANAGE NEWS PANEL */}
          {activeTab === 'news' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-xl font-bold tracking-wide">Manage Updates & Announcements</h3>
                  <p className="text-gray-500 text-xs mt-1">Publish or discard news bulletins and announcements.</p>
                </div>
                <button
                  onClick={() => setShowAddModal('news')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow"
                >
                  <Plus size={14} /> Add Announcement
                </button>
              </div>

              {/* News List Table */}
              <div className="glass-card rounded-lg overflow-hidden border border-white/5 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Title</th>
                      <th className="p-4">Published Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsList.map((n) => (
                      <tr key={n.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white max-w-xs truncate">{n.title}</td>
                        <td className="p-4 text-gray-400">{n.date}</td>
                        <td className="p-4">
                          {n.featured ? (
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold uppercase">Featured</span>
                          ) : (
                            <span className="text-gray-500 text-[10px]">Regular</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteNews(n.id)}
                            className="p-1.5 rounded bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white transition-all"
                            title="Delete Article"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MANAGE GALLERY PANEL */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-xl font-bold tracking-wide">Manage Gallery Assets</h3>
                  <p className="text-gray-500 text-xs mt-1">Upload photoshoots, event coverage, or behind the scenes stills.</p>
                </div>
                <button
                  onClick={() => setShowAddModal('gallery')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow"
                >
                  <Plus size={14} /> Add Image
                </button>
              </div>

              {/* Gallery Grid items list */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {galleryList.map((img) => (
                  <div key={img.id} className="group glass-card rounded-lg overflow-hidden border border-white/5 flex flex-col justify-between">
                    <div className="aspect-video overflow-hidden relative bg-black">
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 flex items-center justify-between gap-1.5">
                      <div className="overflow-hidden">
                        <p className="text-white text-[11px] font-bold truncate">{img.title}</p>
                        <p className="text-gray-500 text-[9px] font-semibold mt-0.5">{img.category}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteGallery(img.id)}
                        className="p-1.5 rounded bg-accent/10 text-accent border border-accent/25 hover:bg-accent hover:text-white transition-all"
                        title="Delete Image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MANAGE VIDEOS PANEL */}
          {activeTab === 'videos' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-xl font-bold tracking-wide">Manage Video Assets</h3>
                  <p className="text-gray-500 text-xs mt-1">Add movie trailers, interviews, and official speech reels.</p>
                </div>
                <button
                  onClick={() => setShowAddModal('video')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow"
                >
                  <Plus size={14} /> Add Video
                </button>
              </div>

              {/* Videos Table */}
              <div className="glass-card rounded-lg overflow-hidden border border-white/5 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videosList.map((vid) => (
                      <tr key={vid.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white max-w-xs truncate">{vid.title}</td>
                        <td className="p-4 text-gray-400">{vid.category}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteVideo(vid.id)}
                            className="p-1.5 rounded bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white transition-all"
                            title="Delete Video"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MANAGE DOWNLOADS PANEL */}
          {activeTab === 'downloads' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-xl font-bold tracking-wide">Manage Fan Assets</h3>
                  <p className="text-gray-500 text-xs mt-1">Manage downloadable wallpapers, posters, frames, and PSDs.</p>
                </div>
                <button
                  onClick={() => setShowAddModal('download')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow"
                >
                  <Plus size={14} /> Add Asset
                </button>
              </div>

              {/* Downloads list table */}
              <div className="glass-card rounded-lg overflow-hidden border border-white/5 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Size</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {downloadsList.map((d) => (
                      <tr key={d.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white max-w-xs truncate">{d.title}</td>
                        <td className="p-4 text-gray-400">{d.category}</td>
                        <td className="p-4 text-gray-400 font-medium">{d.size}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteDownload(d.id)}
                            className="p-1.5 rounded bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white transition-all"
                            title="Delete Asset"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MANAGE REGISTRATIONS PANEL */}
          {activeTab === 'registrations' && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Header and Download CSV */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-white text-xl font-bold tracking-wide">Manage Registrations</h3>
                  <p className="text-gray-500 text-xs mt-1">Review pending member admissions and export database list.</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-accent text-white border border-accent text-xs font-bold uppercase tracking-wider rounded hover:bg-primary hover:text-black hover:border-primary transition-all shadow-lg"
                >
                  <FileSpreadsheet size={14} /> Export List (CSV)
                </button>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
                <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-2xl">
                  <input
                    type="text"
                    placeholder="Search name, district or ID..."
                    value={regSearch}
                    onChange={(e) => setRegSearch(e.target.value)}
                    className="w-full sm:max-w-xs bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                  
                  {adminUser?.role === 'Super Admin' && (
                    <select
                      value={adminDistrictView}
                      onChange={(e) => setAdminDistrictView(e.target.value)}
                      className="bg-[#121212] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary w-full sm:max-w-xs"
                    >
                      <option value="All">All Districts (Head Office Portal)</option>
                      {districtsList.map((d) => (
                        <option key={d} value={d}>District Portal: {d}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {['All', 'Pending', 'Approved'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setRegFilter(f)}
                      className={`px-4 py-1.5 rounded border text-xs font-semibold uppercase tracking-wider transition-all ${
                        regFilter === f
                          ? 'bg-primary text-black border-primary'
                          : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Registrations Table */}
              <div className="glass-card rounded-lg overflow-hidden border border-white/5 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Member Photo</th>
                      <th className="p-4">Reg ID / Details</th>
                      <th className="p-4">District</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegs.map((r) => (
                      <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-black border border-white/10">
                            <img src={r.photo} alt={r.name} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <p className="font-extrabold text-white">{r.name}</p>
                            <span className="px-1.5 py-0.5 rounded bg-accent/20 border border-accent/30 text-accent text-[9px] font-bold">
                              {r.bloodGroup || 'O+'}
                            </span>
                          </div>
                          <p className="text-primary text-[10px] font-bold mt-0.5">{r.id}</p>
                          <p className="text-gray-500 text-[10px] mt-0.5">{r.phone} | {r.email}</p>
                        </td>
                        <td className="p-4 text-white font-medium">
                          {r.district} / {r.city || 'N/A'}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                            r.status === 'Approved' 
                              ? 'bg-primary/10 text-primary border-primary/20' 
                              : 'bg-accent/10 text-accent border-accent/20'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          {r.status === 'Pending' && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'Approved')}
                              className="p-1.5 rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-black transition-all"
                              title="Approve Member"
                            >
                              <Check size={13} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReg(r.id)}
                            className="p-1.5 rounded bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white transition-all"
                            title="Delete Member"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================
          ADD ITEM MODALS 
      ======================================================== */}

      {/* 1. Add News Modal */}
      {showAddModal === 'news' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#121212] rounded-xl border border-white/10 overflow-hidden shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-bold text-sm uppercase tracking-wider">Create News Bulletin</span>
              <button onClick={() => setShowAddModal(null)} className="text-gray-400 hover:text-white"><X size={16} /></button>
            </div>
            
            <form onSubmit={handleAddNews} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Article Title *</label>
                <input
                  type="text"
                  required
                  value={newsForm.title}
                  onChange={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="Bulleting title"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Short Summary *</label>
                <input
                  type="text"
                  required
                  value={newsForm.summary}
                  onChange={(e) => setNewsForm(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="One sentence summary"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Image URL *</label>
                <input
                  type="url"
                  required
                  value={newsForm.image}
                  onChange={(e) => setNewsForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Article Content *</label>
                <textarea
                  required
                  rows={4}
                  value={newsForm.content}
                  onChange={(e) => setNewsForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="Full bulletin content"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredNews"
                  checked={newsForm.featured}
                  onChange={(e) => setNewsForm(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-white/10 text-primary focus:ring-primary bg-white/5"
                />
                <label htmlFor="featuredNews" className="text-gray-400 text-xs font-semibold uppercase tracking-wider cursor-pointer">Set as Featured Story</label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-black font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-gold-glow"
              >
                Publish Bulletin
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Gallery Modal */}
      {showAddModal === 'gallery' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#121212] rounded-xl border border-white/10 overflow-hidden shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-bold text-sm uppercase tracking-wider">Add Gallery Image</span>
              <button onClick={() => setShowAddModal(null)} className="text-gray-400 hover:text-white"><X size={16} /></button>
            </div>

            <form onSubmit={handleAddGallery} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Image Title *</label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="E.g. Behind the scenes Pathu Thala"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Category *</label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="Photoshoots">Photoshoots</option>
                  <option value="Movie Stills">Movie Stills</option>
                  <option value="Events">Events</option>
                  <option value="Fan Meetups">Fan Meetups</option>
                  <option value="Behind The Scenes">Behind The Scenes</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Image URL *</label>
                <input
                  type="url"
                  required
                  value={galleryForm.url}
                  onChange={(e) => setGalleryForm(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-black font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-gold-glow"
              >
                Upload Image
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Video Modal */}
      {showAddModal === 'video' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#121212] rounded-xl border border-white/10 overflow-hidden shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-bold text-sm uppercase tracking-wider">Add Video Resource</span>
              <button onClick={() => setShowAddModal(null)} className="text-gray-400 hover:text-white"><X size={16} /></button>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Video Title *</label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="E.g. Audio launch full speech"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Category *</label>
                <select
                  value={videoForm.category}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="Trailers">Trailers</option>
                  <option value="Interviews">Interviews</option>
                  <option value="Fan Edits">Fan Edits</option>
                  <option value="Event Videos">Event Videos</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Youtube Embed URL *</label>
                <input
                  type="url"
                  required
                  value={videoForm.url}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="E.g. https://www.youtube.com/embed/code"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Thumbnail Image URL *</label>
                <input
                  type="url"
                  required
                  value={videoForm.thumbnail}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-black font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-gold-glow"
              >
                Publish Video
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Download Asset Modal */}
      {showAddModal === 'download' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#121212] rounded-xl border border-white/10 overflow-hidden shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-bold text-sm uppercase tracking-wider">Add Downloadable Asset</span>
              <button onClick={() => setShowAddModal(null)} className="text-gray-400 hover:text-white"><X size={16} /></button>
            </div>

            <form onSubmit={handleAddDownload} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Asset Title *</label>
                <input
                  type="text"
                  required
                  value={downloadForm.title}
                  onChange={(e) => setDownloadForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="E.g. Devarattam HD Mobile Wallpaper"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Category *</label>
                <select
                  value={downloadForm.category}
                  onChange={(e) => setDownloadForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="HD Posters">HD Posters</option>
                  <option value="Wallpapers">Wallpapers</option>
                  <option value="DP Frames">DP Frames</option>
                  <option value="Birthday Templates">Birthday Templates</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">File/Image URL *</label>
                <input
                  type="url"
                  required
                  value={downloadForm.url}
                  onChange={(e) => setDownloadForm(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="https://example.com/asset.zip"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">File Size *</label>
                <input
                  type="text"
                  required
                  value={downloadForm.size}
                  onChange={(e) => setDownloadForm(prev => ({ ...prev, size: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="E.g. 5.4 MB"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-black font-bold uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-gold-glow"
              >
                Publish Asset
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
