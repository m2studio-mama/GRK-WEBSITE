'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import {
  X, LogIn, LogOut, Users, Film, Newspaper, Image as ImgIcon,
  Plus, Trash2, RefreshCw, CheckCircle, XCircle, Clock,
  Edit3, Download, Video, LayoutDashboard, Upload, ArrowLeft, Save, Mail, Send,
} from 'lucide-react';
import {
  adminLogin, adminLogout, getCurrentAdmin,
  getMovies, addMovie, deleteMovie, updateMovie,
  getNews, addNewsItem, deleteNewsItem, updateNewsItem,
  getGallery, addGalleryItem, deleteGalleryItem, updateGalleryItem,
  getVideos, addVideoItem, deleteVideoItem, updateVideoItem,
  getDownloads, addDownloadItem, deleteDownloadItem, updateDownloadItem,
  getRegistrations, updateRegistrationStatus, deleteRegistration,
  getCoordinators, addCoordinator, deleteCoordinator,
  getUpcomingReleases, addUpcomingRelease, deleteUpcomingRelease, updateUpcomingRelease,
  getPopupSettings, updatePopupSettings,
  getNewsletterSubscribers, removeNewsletterSubscriber,
  getDistricts, getWhatsAppLogs, updateWhatsAppLogStatus,
} from '@/lib/firebase/db';
import MembershipCardPreview from './MembershipCardPreview';

type AdminUser = { email: string; name: string; role: string; district: string };
type Reg = { id: string; name: string; phone: string; district: string; city: string; email: string; bloodGroup: string; dob: string; status: string; joinedDate: string; photo?: string };

interface Props { open: boolean; onClose: () => void; onDataChange?: () => void }

  const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'registrations', label: 'Registrations', icon: Users },
  { id: 'whatsapp', label: 'WhatsApp', icon: Mail },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'upcoming', label: 'Upcoming', icon: Clock },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'gallery', label: 'Gallery', icon: ImgIcon },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'downloads', label: 'Downloads', icon: Download },
  ];

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-gray-300 text-[10px] font-black uppercase tracking-wider mb-1.5">{children}</label>;
}
function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FFD700]/50 transition-colors" />;
}
function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className="w-full bg-[#111827] border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors">
      {children}
    </select>
  );
}

export default function AdminDashboard({ open, onClose, onDataChange }: Props) {
  const { addToast } = useToast();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Add forms
  const [newMovie, setNewMovie] = useState({ name: '', year: '', genre: 'Action', character: '', poster: '', trailer: '', rating: '' });
  const [newNews, setNewNews] = useState({ title: '', summary: '', content: '', image: '', featured: false });
  const [newGallery, setNewGallery] = useState({ title: '', category: 'Photoshoots', url: '' });
  const [newVideo, setNewVideo] = useState({ title: '', category: 'Trailers', url: '', thumbnail: '' });
  const [newDownload, setNewDownload] = useState({ title: '', category: 'HD Posters', url: '', size: '' });
  const [newCoord, setNewCoord] = useState({ name: '', position: '', district: '', phone: '', photo: '' });

  // Upcoming releases
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [newUpcoming, setNewUpcoming] = useState({ title: '', releaseDate: '', genre: 'Action', character: '', poster: '', description: '' });
  
  // Popup settings
  const [popupEnabled, setPopupEnabled] = useState(true);
  const [popupReleaseId, setPopupReleaseId] = useState<string | null>(null);
  
  // Newsletter
  const [subscribers, setSubscribers] = useState<any[]>([]);

  // WhatsApp and Districts
  const [whatsappLogs, setWhatsAppLogs] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedCardMember, setSelectedCardMember] = useState<any | null>(null);

  // Data lists
  const [registrations, setRegistrations] = useState<Reg[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [coordinators, setCoordinators] = useState<any[]>([]);

  // Which item is currently being edited, per section (null = adding new)
  const [editMovieId, setEditMovieId] = useState<string | null>(null);
  const [editNewsId, setEditNewsId] = useState<string | null>(null);
  const [editGalleryId, setEditGalleryId] = useState<string | null>(null);
  const [editVideoId, setEditVideoId] = useState<string | null>(null);
  const [editDownloadId, setEditDownloadId] = useState<string | null>(null);
  const [editUpcomingId, setEditUpcomingId] = useState<string | null>(null);

  const [regFilter, setRegFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [saving, setSaving] = useState<string | null>(null);

  // Auth
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [tab, setTab] = useState('dashboard');

  // Scroll form into view when starting an edit
  const scrollFormTop = () => {
    document.getElementById('admin-form-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!open) return;
    const unsub = getCurrentAdmin(u => setAdmin(u));
    return () => { if (typeof unsub === 'function') unsub(); };
  }, [open]);

  const loadData = useCallback(async () => {
  if (!admin) return;
  setIsLoading(true);
  try {
  const [r, m, n, g, v, d, c, u, ps, subs, logs, dists] = await Promise.all([
  getRegistrations(), getMovies(), getNews(),
  getGallery(), getVideos(), getDownloads(), getCoordinators(), getUpcomingReleases(), getPopupSettings(), getNewsletterSubscribers(), getWhatsAppLogs(), getDistricts(),
  ]);
  setRegistrations(r as Reg[]);
  setMovies(m as any[]);
  setNews(n as any[]);
  setGallery(g as any[]);
  setVideos(v as any[]);
  setDownloads(d as any[]);
  setCoordinators(c as any[]);
  setUpcoming(u as any[]);
  setPopupEnabled((ps as any).popupEnabled || true);
  setPopupReleaseId((ps as any).popupReleaseId || null);
  setSubscribers(subs as any[]);
  setWhatsAppLogs(logs as any[]);
  setDistricts(dists as any[]);
  } finally { setIsLoading(false); }
  }, [admin]);

  useEffect(() => { if (admin) loadData(); }, [admin, loadData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true); setLoginError('');
    try {
      const u = await adminLogin(loginEmail, loginPassword);
      setAdmin(u as AdminUser);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setIsLogging(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setAdmin(null);
    setTab('dashboard');
  };

  const handleStatusChange = async (id: string, status: string) => {
    setSaving(id);
    try {
      const reg = registrations.find(r => r.id === id);
      if (!reg) return;

      await updateRegistrationStatus(id, status);
      setRegistrations(p => p.map(r => r.id === id ? { ...r, status } : r));

      // If approving, trigger WhatsApp automation
      if (status === 'Approved') {
        try {
          const approvalResponse = await fetch('/api/members/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              registrationId: reg.id,
              memberName: reg.name,
              phoneNumber: reg.phone,
              district: reg.district,
              email: reg.email,
              photo: reg.photo,
              designation: reg.designation || 'Fan Club Member',
            }),
          });

          if (approvalResponse.ok) {
            addToast(`Member approved! WhatsApp message will be sent automatically.`, 'success');
            await new Promise(r => setTimeout(r, 1000));
            loadData();
            return;
          } else {
            const error = await approvalResponse.json();
            addToast(`Approval failed: ${error.error}`, 'error');
          }
        } catch (err) {
          console.error('WhatsApp automation error:', err);
          addToast('Failed to approve member', 'error');
        }
      }

      addToast(`Registration marked as ${status}`, 'success');
      onDataChange?.();
    } catch (err) {
      addToast('Failed to update registration', 'error');
    } finally { setSaving(null); }
  };

  const handleDeleteReg = async (id: string) => {
    if (!confirm('Delete this registration?')) return;
    try {
      await deleteRegistration(id);
      setRegistrations(p => p.filter(r => r.id !== id));
      addToast('Registration deleted successfully', 'success');
    } catch (err) {
      addToast('Failed to delete registration', 'error');
    }
  };

  if (!open) return null;

  const filteredRegs = regFilter === 'All' ? registrations : registrations.filter(r => r.status === regFilter);

  const statusBadge = (status: string) => {
    const cfg: Record<string, string> = {
      Approved: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
      Rejected: 'bg-[#E50914]/15 text-red-400 border border-[#E50914]/20',
      Pending: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
    };
    return `inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${cfg[status] || cfg.Pending}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch bg-black/95 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Admin Dashboard">
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#0B0F19] flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="w-8 h-8 rounded-full object-contain border border-[#FFD700]/20" alt="Gautham Ram Karthik Logo" />
            <div>
              <h2 className="text-white font-black text-sm">Admin Dashboard</h2>
              {admin && <p className="text-gray-500 text-[10px]">{admin.name} · {admin.role}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {admin && (
              <>
                <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFD700] text-[#0B0F19] rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#e6c200] transition-colors">
                  <ArrowLeft size={12} /> Back to Site
                </button>
                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-400 border border-white/10 rounded text-[10px] font-bold uppercase tracking-wider hover:text-white hover:bg-white/10 transition-colors">
                  <LogOut size={12} /> Logout
                </button>
              </>
            )}
            <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close admin panel">
              <X size={20} />
            </button>
          </div>
        </div>

        {!admin ? (
          /* Login Form */
          <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <img src="/logo.png" className="w-14 h-14 rounded-full object-contain border border-[#FFD700]/20 mx-auto mb-3 shadow-gold-glow" alt="Gautham Ram Karthik Logo" />
                <h3 className="text-white text-xl font-black">Admin Login</h3>
                <p className="text-gray-500 text-xs mt-1 font-serif">Super Admin or District Coordinator access</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="admin@gauthamramkarthik.com" required />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                {loginError && (
                  <div className="p-3 rounded-lg bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] text-xs font-semibold">{loginError}</div>
                )}
                <button type="submit" disabled={isLogging}
                  className="w-full py-3 bg-[#FFD700] text-[#0B0F19] font-black uppercase tracking-wider text-xs rounded hover:bg-white transition-all shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-60">
                  {isLogging ? <><RefreshCw className="animate-spin" size={14} /> Logging in...</> : <><LogIn size={14} /> Login</>}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Dashboard */
          <div className="flex-grow flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-52 bg-[#080B14] border-r border-white/6 flex flex-col flex-shrink-0 overflow-y-auto">
              <nav className="p-3 space-y-1 flex-grow" aria-label="Admin navigation">
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      tab === t.id ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}>
                    <t.icon size={14} /> {t.label}
                  </button>
                ))}
              </nav>
              <div className="p-3 border-t border-white/6">
                <button onClick={loadData} className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 text-gray-400 border border-white/8 rounded text-[10px] font-bold uppercase tracking-wider hover:text-white hover:bg-white/10 transition-colors">
                  <RefreshCw size={11} /> Refresh
                </button>
              </div>
            </aside>

            {/* Content */}
            <main className="flex-grow overflow-y-auto p-6 bg-[#0B0F19]">
              <span id="admin-form-top" className="block" aria-hidden="true" />
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <RefreshCw className="animate-spin text-[#FFD700]" size={28} />
                </div>
              )}

              {!isLoading && tab === 'dashboard' && (
                <div>
                  <h3 className="text-white text-lg font-black mb-6">Overview</h3>

                  {/* Popup Settings */}
                  <div className="glass-card p-6 rounded-xl border border-white/6 mb-8">
                    <h4 className="text-[#FFD700] text-xs font-black uppercase tracking-wider mb-4">Upcoming Releases Popup</h4>
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="popup-toggle"
                          checked={popupEnabled}
                          onChange={async (e) => {
                            const newEnabled = e.target.checked;
                            setPopupEnabled(newEnabled);
                            await updatePopupSettings({ popupEnabled: newEnabled, popupReleaseId });
                          }}
                          className="w-4 h-4 cursor-pointer accent-[#FFD700]"
                        />
                        <label htmlFor="popup-toggle" className="text-white font-bold text-sm cursor-pointer">
                          Enable Popup Auto-Open
                        </label>
                      </div>
                      {popupEnabled && (
                        <select
                          value={popupReleaseId || ''}
                          onChange={async (e) => {
                            const relId = e.target.value || null;
                            setPopupReleaseId(relId);
                            await updatePopupSettings({ popupEnabled, popupReleaseId: relId });
                          }}
                          className="px-3 py-1.5 bg-[#111827] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#FFD700]"
                        >
                          <option value="">First Release (Default)</option>
                          {upcoming.map(rel => (
                            <option key={rel.id} value={rel.id}>{rel.title} ({new Date(rel.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'Total Members', value: registrations.length, icon: Users, color: 'text-[#FFD700]' },
                      { label: 'Pending', value: registrations.filter(r => r.status === 'Pending').length, icon: Clock, color: 'text-yellow-400' },
                      { label: 'Approved', value: registrations.filter(r => r.status === 'Approved').length, icon: CheckCircle, color: 'text-emerald-400' },
                      { label: 'Movies', value: movies.length, icon: Film, color: 'text-blue-400' },
                      { label: 'News Articles', value: news.length, icon: Newspaper, color: 'text-purple-400' },
                      { label: 'Gallery Photos', value: gallery.length, icon: ImgIcon, color: 'text-pink-400' },
                      { label: 'Videos', value: videos.length, icon: Video, color: 'text-orange-400' },
                      { label: 'Downloads', value: downloads.length, icon: Download, color: 'text-cyan-400' },
                    ].map(card => (
                      <div key={card.label} className="glass-card p-4 rounded-xl border border-white/6">
                        <card.icon size={18} className={`${card.color} mb-2`} />
                        <div className={`text-2xl font-black ${card.color}`}>{card.value}</div>
                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">{card.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent registrations */}
                  <h4 className="text-white font-black mb-3">Recent Pending Approvals</h4>
                  <div className="space-y-2">
                    {registrations.filter(r => r.status === 'Pending').slice(0, 5).map(r => (
                      <div key={r.id} className="flex items-center justify-between p-3 glass-card rounded-xl border border-white/6">
                        <div>
                          <span className="text-white text-sm font-bold">{r.name}</span>
                          <span className="text-gray-500 text-[10px] ml-2">{r.district} · {r.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleStatusChange(r.id, 'Approved')} disabled={saving === r.id}
                            className="p-1.5 rounded bg-emerald-700/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-700/40 transition-colors" aria-label="Approve">
                            <CheckCircle size={14} />
                          </button>
                          <button onClick={() => handleStatusChange(r.id, 'Rejected')} disabled={saving === r.id}
                            className="p-1.5 rounded bg-[#E50914]/15 text-red-400 border border-[#E50914]/20 hover:bg-[#E50914]/25 transition-colors" aria-label="Reject">
                            <XCircle size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {registrations.filter(r => r.status === 'Pending').length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-6">No pending approvals.</p>
                    )}
                  </div>
                </div>
              )}

              {!isLoading && tab === 'whatsapp' && (
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h3 className="text-white text-lg font-black">WhatsApp Message Logs ({whatsappLogs.length})</h3>
                  </div>

                  {whatsappLogs.length === 0 ? (
                    <div className="glass-card p-8 rounded-xl border border-white/6 text-center">
                      <Send className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400">No WhatsApp messages sent yet</p>
                      <p className="text-gray-600 text-xs mt-2">Approve member registrations to send WhatsApp messages</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {whatsappLogs.map((log: any) => (
                        <div key={log.id} className="glass-card p-4 rounded-xl border border-white/6">
                          <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                            <div className="flex-grow min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-white font-black text-sm">{log.memberName}</span>
                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                                  log.status === 'sent' ? 'bg-emerald-500/20 text-emerald-400' :
                                  log.status === 'delivered' ? 'bg-blue-500/20 text-blue-400' :
                                  log.status === 'read' ? 'bg-[#FFD700]/20 text-[#FFD700]' :
                                  log.status === 'failed' ? 'bg-[#E50914]/20 text-red-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }`}>{log.status}</span>
                              </div>
                              <div className="text-gray-500 text-[10px] space-x-3">
                                <span>{log.phoneNumber}</span>
                                <span>{log.district}</span>
                                <span>{new Date(log.sentTime || Date.now()).toLocaleString()}</span>
                              </div>
                              {log.errorMessage && <p className="text-red-400 text-[10px] mt-2">{log.errorMessage}</p>}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {log.status === 'failed' && log.retryCount < 3 && (
                                <button 
                                  onClick={async () => {
                                    try {
                                      await fetch('/api/whatsapp/send-message', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          logId: log.id,
                                          phoneNumber: log.phoneNumber,
                                          memberName: log.memberName,
                                          memberId: log.registrationId,
                                          designation: 'Fan Club Member',
                                          district: log.district,
                                          districtGroupLink: 'https://chat.whatsapp.com/grk-fanclub',
                                          retryCount: log.retryCount,
                                        }),
                                      });
                                      addToast('WhatsApp message retry queued', 'success');
                                      await new Promise(r => setTimeout(r, 1000));
                                      loadData();
                                    } catch (err) {
                                      addToast('Retry failed', 'error');
                                    }
                                  }}
                                  className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-[10px] font-bold hover:bg-yellow-500/30 transition-colors"
                                >
                                  Retry
                                </button>
                              )}
                              {log.cardUrl && (
                                <button
                                  onClick={() => window.open(log.cardUrl, '_blank')}
                                  className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-[10px] font-bold hover:bg-blue-500/30 transition-colors"
                                >
                                  Download
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-8">
                    <h4 className="text-white font-black text-sm mb-4">Districts ({districts.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {districts.map((dist: any) => (
                        <div key={dist.id} className="glass-card p-3 rounded-lg border border-white/6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-white font-black text-sm">{dist.districtName}</p>
                              <p className="text-gray-500 text-[10px]">{dist.president}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${dist.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                              {dist.status}
                            </span>
                          </div>
                          <p className="text-gray-500 text-[10px]">Contact: {dist.contactNumber}</p>
                          <a href={dist.groupLink} target="_blank" rel="noopener noreferrer" className="text-[#25D366] text-[10px] hover:underline mt-1 inline-block">
                            Join Group
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!isLoading && tab === 'newsletter' && (
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h3 className="text-white text-lg font-black">Newsletter Subscribers ({subscribers.length})</h3>
                  </div>

                  {subscribers.length === 0 ? (
                    <div className="glass-card p-8 rounded-xl border border-white/6 text-center">
                      <Mail className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400">No newsletter subscribers yet</p>
                    </div>
                  ) : (
                    <div className="glass-card rounded-xl border border-white/6 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-white/5 border-b border-white/6">
                          <tr>
                            <th className="px-4 py-3 text-left text-gray-300 font-black uppercase text-xs tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-gray-300 font-black uppercase text-xs tracking-wider">Subscribed</th>
                            <th className="px-4 py-3 text-right text-gray-300 font-black uppercase text-xs tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/6">
                          {subscribers.map((sub: any) => (
                            <tr key={sub.email} className="hover:bg-white/3 transition-colors">
                              <td className="px-4 py-3 text-white">{sub.email}</td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-right">
                                <button onClick={async () => { await removeNewsletterSubscriber(sub.email); setSubscribers(p => p.filter(s => s.email !== sub.email)); }}
                                  className="px-3 py-1 bg-[#E50914]/10 text-[#E50914] rounded hover:bg-[#E50914]/20 transition-colors text-xs font-bold">Remove</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {!isLoading && tab === 'registrations' && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <h3 className="text-white text-lg font-black">Registrations ({filteredRegs.length})</h3>
                    <div className="flex gap-1">
                      {(['All','Pending','Approved','Rejected'] as const).map(f => (
                        <button key={f} onClick={() => setRegFilter(f)}
                          className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all ${regFilter === f ? 'bg-[#FFD700] text-[#0B0F19]' : 'bg-white/5 text-gray-400 border border-white/8 hover:text-white'}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {filteredRegs.map(r => (
                      <div key={r.id} className="glass-card p-4 rounded-xl border border-white/6 flex flex-wrap items-start gap-4">
                        {r.photo && <img src={r.photo} alt={r.name} className="w-12 h-12 rounded-full object-cover border border-white/10 flex-shrink-0" />}
                        <div className="flex-grow min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-white font-black text-sm">{r.name}</span>
                            <span className={statusBadge(r.status)}>{r.status}</span>
                            <span className="text-gray-600 text-[10px] font-mono">{r.id}</span>
                          </div>
                          <div className="text-gray-500 text-[10px] space-x-3">
                            <span>{r.phone}</span>
                            <span>{r.district} · {r.city}</span>
                            <span>{r.bloodGroup}</span>
                            <span>{r.dob}</span>
                          </div>
                          <div className="text-gray-600 text-[10px] mt-0.5">{r.email}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {r.status !== 'Approved' && (
                            <button onClick={() => handleStatusChange(r.id, 'Approved')} disabled={saving === r.id}
                              className="p-1.5 rounded bg-emerald-700/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-700/40 transition-colors" aria-label="Approve">
                              <CheckCircle size={13} />
                            </button>
                          )}
                          {r.status !== 'Rejected' && (
                            <button onClick={() => handleStatusChange(r.id, 'Rejected')} disabled={saving === r.id}
                              className="p-1.5 rounded bg-[#E50914]/15 text-red-400 border border-[#E50914]/20 hover:bg-[#E50914]/25 transition-colors" aria-label="Reject">
                              <XCircle size={13} />
                            </button>
                          )}
                          <button onClick={() => handleDeleteReg(r.id)}
                            className="p-1.5 rounded bg-white/5 text-gray-500 border border-white/8 hover:text-red-400 transition-colors" aria-label="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {filteredRegs.length === 0 && <p className="text-gray-500 text-sm text-center py-12">No registrations found.</p>}
                  </div>
                </div>
              )}

              {!isLoading && tab === 'movies' && (
                <div>
                  <h3 className="text-white text-lg font-black mb-6">Movies ({movies.length})</h3>
                  {/* Add form */}
                  <div className={`glass-card p-5 rounded-xl border mb-6 ${editMovieId ? 'border-[#FFD700]/40' : 'border-white/6'}`}>
                    <h4 className="text-[#FFD700] text-xs font-black uppercase tracking-wider mb-4">{editMovieId ? 'Edit Movie' : 'Add New Movie'}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div><Label>Title</Label><Input value={newMovie.name} onChange={e => setNewMovie(p=>({...p,name:e.target.value}))} placeholder="Movie title" /></div>
                      <div><Label>Year</Label><Input value={newMovie.year} onChange={e => setNewMovie(p=>({...p,year:e.target.value}))} placeholder="2026" /></div>
                      <div><Label>Genre</Label>
                        <Select value={newMovie.genre} onChange={e => setNewMovie(p=>({...p,genre:e.target.value}))}>
                          {['Action','Drama','Romance','Comedy','Thriller'].map(g => <option key={g} value={g}>{g}</option>)}
                        </Select>
                      </div>
                      <div><Label>Character</Label><Input value={newMovie.character} onChange={e => setNewMovie(p=>({...p,character:e.target.value}))} placeholder="Character name" /></div>
                      <div><Label>Poster URL</Label><Input value={newMovie.poster} onChange={e => setNewMovie(p=>({...p,poster:e.target.value}))} placeholder="https://..." /></div>
                      <div><Label>Trailer URL</Label><Input value={newMovie.trailer} onChange={e => setNewMovie(p=>({...p,trailer:e.target.value}))} placeholder="YouTube embed URL" /></div>
                      <div><Label>Rating (optional)</Label><Input value={newMovie.rating} onChange={e => setNewMovie(p=>({...p,rating:e.target.value}))} placeholder="8.5" /></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={async () => {
                        if (!newMovie.name || !newMovie.year) return;
                        setSaving('movie');
                        try {
                          if (editMovieId) {
                            await updateMovie(editMovieId, newMovie);
                            setMovies(p => p.map(x => x.id === editMovieId ? { ...x, ...newMovie } : x));
                            setEditMovieId(null);
                          } else {
                            const m = await addMovie(newMovie); setMovies(p => [m as any, ...p]);
                          }
                          setNewMovie({ name:'',year:'',genre:'Action',character:'',poster:'',trailer:'',rating:'' }); onDataChange?.();
                        }
                        finally { setSaving(null); }
                      }} disabled={saving === 'movie'}
                        className="flex items-center gap-2 px-5 py-2 bg-[#FFD700] text-[#0B0F19] font-black text-xs uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow disabled:opacity-50">
                        {saving === 'movie' ? <><RefreshCw className="animate-spin" size={12} /> Saving...</> : editMovieId ? <><Save size={12} /> Update Movie</> : <><Plus size={12} /> Add Movie</>}
                      </button>
                      {editMovieId && (
                        <button onClick={() => { setEditMovieId(null); setNewMovie({ name:'',year:'',genre:'Action',character:'',poster:'',trailer:'',rating:'' }); }}
                          className="px-4 py-2 bg-white/5 text-gray-400 border border-white/10 rounded text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">Cancel</button>
                      )}
                    </div>
                  </div>
                  {/* Movie list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {movies.map(m => (
                      <div key={m.id} className="glass-card rounded-xl border border-white/6 overflow-hidden flex flex-col">
                        {m.poster && <img src={m.poster} alt={m.name} className="aspect-[2/1] w-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />}
                        <div className="p-4 flex-grow">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="text-white font-black text-sm">{m.name}</h5>
                              <p className="text-gray-500 text-[10px]">{m.year} · {m.genre}</p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button onClick={() => { setNewMovie({ name:m.name||'', year:m.year?.toString()||'', genre:m.genre||'Action', character:m.character||'', poster:m.poster||'', trailer:m.trailer||'', rating:m.rating?.toString()||'' }); setEditMovieId(m.id); scrollFormTop(); }}
                                className="p-1.5 text-gray-500 hover:text-[#FFD700] transition-colors" aria-label="Edit movie">
                                <Edit3 size={13} />
                              </button>
                              <button onClick={async () => { if (!confirm('Delete?')) return; await deleteMovie(m.id); setMovies(p => p.filter(x => x.id !== m.id)); onDataChange?.(); }}
                                className="p-1.5 text-gray-600 hover:text-red-400 transition-colors" aria-label="Delete movie">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && tab === 'news' && (
                <div>
                  <h3 className="text-white text-lg font-black mb-6">News ({news.length})</h3>
                  <div className={`glass-card p-5 rounded-xl border mb-6 ${editNewsId ? 'border-[#FFD700]/40' : 'border-white/6'}`}>
                    <h4 className="text-[#FFD700] text-xs font-black uppercase tracking-wider mb-4">{editNewsId ? 'Edit News Article' : 'Add News Article'}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="sm:col-span-2"><Label>Title</Label><Input value={newNews.title} onChange={e => setNewNews(p=>({...p,title:e.target.value}))} placeholder="Article title" /></div>
                      <div className="sm:col-span-2"><Label>Summary</Label><Input value={newNews.summary} onChange={e => setNewNews(p=>({...p,summary:e.target.value}))} placeholder="Short summary" /></div>
                      <div className="sm:col-span-2">
                        <Label>Content</Label>
                        <textarea value={newNews.content} onChange={e => setNewNews(p=>({...p,content:e.target.value}))} rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FFD700]/50 resize-none" placeholder="Full article content..." />
                      </div>
                      <div><Label>Image URL</Label><Input value={newNews.image} onChange={e => setNewNews(p=>({...p,image:e.target.value}))} placeholder="https://..." /></div>
                      <div className="flex items-center gap-2 pt-6">
                        <input type="checkbox" id="featured" checked={newNews.featured} onChange={e => setNewNews(p=>({...p,featured:e.target.checked}))} className="accent-[#FFD700] w-4 h-4" />
                        <label htmlFor="featured" className="text-gray-300 text-xs font-bold uppercase tracking-wider">Featured Article</label>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={async () => {
                        if (!newNews.title) return;
                        setSaving('news');
                        try {
                          if (editNewsId) {
                            await updateNewsItem(editNewsId, newNews as any);
                            setNews(p => p.map(x => x.id === editNewsId ? { ...x, ...newNews } : (newNews.featured ? { ...x, featured: false } : x)));
                            setEditNewsId(null);
                          } else {
                            const n = await addNewsItem(newNews as any); setNews(p => [n as any, ...p]);
                          }
                          setNewNews({ title:'',summary:'',content:'',image:'',featured:false }); onDataChange?.();
                        }
                        finally { setSaving(null); }
                      }} disabled={saving === 'news'}
                        className="flex items-center gap-2 px-5 py-2 bg-[#FFD700] text-[#0B0F19] font-black text-xs uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow disabled:opacity-50">
                        {saving === 'news' ? <><RefreshCw className="animate-spin" size={12} /> Saving...</> : editNewsId ? <><Save size={12} /> Update Article</> : <><Plus size={12} /> Add Article</>}
                      </button>
                      {editNewsId && (
                        <button onClick={() => { setEditNewsId(null); setNewNews({ title:'',summary:'',content:'',image:'',featured:false }); }}
                          className="px-4 py-2 bg-white/5 text-gray-400 border border-white/10 rounded text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">Cancel</button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {news.map(n => (
                      <div key={n.id} className="glass-card p-4 rounded-xl border border-white/6 flex items-start gap-4">
                        {n.image && <img src={n.image} alt={n.title} className="w-16 h-12 object-cover rounded border border-white/8 flex-shrink-0" />}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-black text-sm truncate">{n.title}</span>
                            {n.featured && <span className="text-[9px] font-black bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/20 px-1.5 py-0.5 rounded uppercase">Featured</span>}
                          </div>
                          <p className="text-gray-500 text-[10px] mt-0.5 line-clamp-1">{n.summary}</p>
                          <p className="text-gray-600 text-[9px] mt-0.5">{n.date}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => { setNewNews({ title:n.title||'', summary:n.summary||'', content:n.content||'', image:n.image||'', featured:!!n.featured }); setEditNewsId(n.id); scrollFormTop(); }}
                            className="p-1.5 text-gray-500 hover:text-[#FFD700] transition-colors" aria-label="Edit news">
                            <Edit3 size={13} />
                          </button>
                          <button onClick={async () => { if (!confirm('Delete?')) return; await deleteNewsItem(n.id); setNews(p => p.filter(x => x.id !== n.id)); onDataChange?.(); }}
                            className="p-1.5 text-gray-600 hover:text-red-400 transition-colors" aria-label="Delete news">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && tab === 'gallery' && (
                <div>
                  <h3 className="text-white text-lg font-black mb-6">Gallery ({gallery.length} photos)</h3>
                  <div className={`glass-card p-5 rounded-xl border mb-6 ${editGalleryId ? 'border-[#FFD700]/40' : 'border-white/6'}`}>
                    <h4 className="text-[#FFD700] text-xs font-black uppercase tracking-wider mb-4">{editGalleryId ? 'Edit Photo' : 'Add Photo'}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div><Label>Title</Label><Input value={newGallery.title} onChange={e => setNewGallery(p=>({...p,title:e.target.value}))} placeholder="Photo title" /></div>
                      <div><Label>Category</Label>
                        <Select value={newGallery.category} onChange={e => setNewGallery(p=>({...p,category:e.target.value}))}>
                          {['Photoshoots','Movie Stills','Events','Fan Meetups','Behind The Scenes'].map(c => <option key={c} value={c}>{c}</option>)}
                        </Select>
                      </div>
                      <div>
                        <Label>Image URL(s)</Label>
                        <Input value={newGallery.url} onChange={e => setNewGallery(p=>({...p,url:e.target.value}))} placeholder="https://url1, https://url2" />
                        <span className="text-gray-500 text-[9px] mt-1 block">For multiple photos, separate URLs with commas.</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={async () => {
                        if (!newGallery.title || !newGallery.url) return;
                        setSaving('gallery');
                        try {
                          if (editGalleryId) {
                            await updateGalleryItem(editGalleryId, newGallery);
                            setGallery(p => p.map(x => x.id === editGalleryId ? { ...x, ...newGallery } : x));
                            setEditGalleryId(null);
                          } else {
                            const g = await addGalleryItem(newGallery); setGallery(p => [g as any, ...p]);
                          }
                          setNewGallery({ title:'',category:'Photoshoots',url:'' }); onDataChange?.();
                        }
                        finally { setSaving(null); }
                      }} disabled={saving === 'gallery'}
                        className="flex items-center gap-2 px-5 py-2 bg-[#FFD700] text-[#0B0F19] font-black text-xs uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow disabled:opacity-50">
                        {saving === 'gallery' ? <><RefreshCw className="animate-spin" size={12} /> Saving...</> : editGalleryId ? <><Save size={12} /> Update Photo</> : <><Plus size={12} /> Add Photo</>}
                      </button>
                      {editGalleryId && (
                        <button onClick={() => { setEditGalleryId(null); setNewGallery({ title:'',category:'Photoshoots',url:'' }); }}
                          className="px-4 py-2 bg-white/5 text-gray-400 border border-white/10 rounded text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">Cancel</button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.map(g => (
                      <div key={g.id} className="relative group rounded-xl overflow-hidden border border-white/6 bg-[#111827]">
                        <img src={g.url} alt={g.title} className="w-full aspect-square object-cover" onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }} />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => { setNewGallery({ title:g.title||'', category:g.category||'Photoshoots', url:g.url||'' }); setEditGalleryId(g.id); scrollFormTop(); }}
                              className="p-1.5 rounded-full bg-[#FFD700]/90 text-[#0B0F19]" aria-label="Edit"><Edit3 size={11} /></button>
                            <button onClick={async () => { if (!confirm('Delete?')) return; await deleteGalleryItem(g.id); setGallery(p => p.filter(x => x.id !== g.id)); onDataChange?.(); }}
                              className="p-1.5 rounded-full bg-[#E50914]/80 text-white" aria-label="Delete"><Trash2 size={11} /></button>
                          </div>
                          <p className="text-white text-[10px] font-bold truncate">{g.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && tab === 'videos' && (
                <div>
                  <h3 className="text-white text-lg font-black mb-6">Videos ({videos.length})</h3>
                  <div className={`glass-card p-5 rounded-xl border mb-6 ${editVideoId ? 'border-[#FFD700]/40' : 'border-white/6'}`}>
                    <h4 className="text-[#FFD700] text-xs font-black uppercase tracking-wider mb-4">{editVideoId ? 'Edit Video' : 'Add Video'}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div><Label>Title</Label><Input value={newVideo.title} onChange={e => setNewVideo(p=>({...p,title:e.target.value}))} placeholder="Video title" /></div>
                      <div><Label>Category</Label>
                        <Select value={newVideo.category} onChange={e => setNewVideo(p=>({...p,category:e.target.value}))}>
                          {['Trailers','Interviews','Fan Edits','Event Videos'].map(c => <option key={c} value={c}>{c}</option>)}
                        </Select>
                      </div>
                      <div><Label>YouTube URL</Label><Input value={newVideo.url} onChange={e => setNewVideo(p=>({...p,url:e.target.value}))} placeholder="https://youtu.be/..." /></div>
                      <div><Label>Thumbnail URL</Label><Input value={newVideo.thumbnail} onChange={e => setNewVideo(p=>({...p,thumbnail:e.target.value}))} placeholder="https://..." /></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={async () => {
                        if (!newVideo.title || !newVideo.url) return;
                        setSaving('video');
                        try {
                          if (editVideoId) {
                            await updateVideoItem(editVideoId, newVideo);
                            setVideos(p => p.map(x => x.id === editVideoId ? { ...x, ...newVideo } : x));
                            setEditVideoId(null);
                          } else {
                            const v = await addVideoItem(newVideo); setVideos(p => [v as any, ...p]);
                          }
                          setNewVideo({ title:'',category:'Trailers',url:'',thumbnail:'' }); onDataChange?.();
                        }
                        finally { setSaving(null); }
                      }} disabled={saving === 'video'}
                        className="flex items-center gap-2 px-5 py-2 bg-[#FFD700] text-[#0B0F19] font-black text-xs uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow disabled:opacity-50">
                        {saving === 'video' ? <><RefreshCw className="animate-spin" size={12} /> Saving...</> : editVideoId ? <><Save size={12} /> Update Video</> : <><Plus size={12} /> Add Video</>}
                      </button>
                      {editVideoId && (
                        <button onClick={() => { setEditVideoId(null); setNewVideo({ title:'',category:'Trailers',url:'',thumbnail:'' }); }}
                          className="px-4 py-2 bg-white/5 text-gray-400 border border-white/10 rounded text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">Cancel</button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {videos.map(v => (
                      <div key={v.id} className="glass-card p-3 rounded-xl border border-white/6 flex items-center gap-4">
                        {v.thumbnail && <img src={v.thumbnail} alt={v.title} className="w-20 h-12 object-cover rounded border border-white/8 flex-shrink-0" />}
                        <div className="flex-grow min-w-0">
                          <p className="text-white font-black text-sm truncate">{v.title}</p>
                          <p className="text-gray-500 text-[10px]">{v.category}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => { setNewVideo({ title:v.title||'', category:v.category||'Trailers', url:v.url||'', thumbnail:v.thumbnail||'' }); setEditVideoId(v.id); scrollFormTop(); }}
                            className="p-1.5 text-gray-500 hover:text-[#FFD700] transition-colors" aria-label="Edit video"><Edit3 size={13} /></button>
                          <button onClick={async () => { if (!confirm('Delete?')) return; await deleteVideoItem(v.id); setVideos(p => p.filter(x => x.id !== v.id)); onDataChange?.(); }}
                            className="p-1.5 text-gray-600 hover:text-red-400 transition-colors" aria-label="Delete video"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && tab === 'downloads' && (
                <div>
                  <h3 className="text-white text-lg font-black mb-6">Downloads ({downloads.length})</h3>
                  <div className={`glass-card p-5 rounded-xl border mb-6 ${editDownloadId ? 'border-[#FFD700]/40' : 'border-white/6'}`}>
                    <h4 className="text-[#FFD700] text-xs font-black uppercase tracking-wider mb-4">{editDownloadId ? 'Edit Download Asset' : 'Add Download Asset'}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div><Label>Title</Label><Input value={newDownload.title} onChange={e => setNewDownload(p=>({...p,title:e.target.value}))} placeholder="Asset title" /></div>
                      <div><Label>Category</Label>
                        <Select value={newDownload.category} onChange={e => setNewDownload(p=>({...p,category:e.target.value}))}>
                          {['HD Posters','Wallpapers','DP Frames','Birthday Templates'].map(c => <option key={c} value={c}>{c}</option>)}
                        </Select>
                      </div>
                      <div>
                        <Label>File / Image URL(s)</Label>
                        <Input value={newDownload.url} onChange={e => setNewDownload(p=>({...p,url:e.target.value}))} placeholder="https://url1, https://url2" />
                        <span className="text-gray-500 text-[9px] mt-1 block">For multiple files, separate URLs with commas.</span>
                      </div>
                      <div><Label>File Size (optional)</Label><Input value={newDownload.size} onChange={e => setNewDownload(p=>({...p,size:e.target.value}))} placeholder="e.g. 4.2 MB" /></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={async () => {
                        if (!newDownload.title || !newDownload.url) return;
                        setSaving('download');
                        try {
                          if (editDownloadId) {
                            await updateDownloadItem(editDownloadId, newDownload);
                            setDownloads(p => p.map(x => x.id === editDownloadId ? { ...x, ...newDownload } : x));
                            setEditDownloadId(null);
                          } else {
                            const d = await addDownloadItem(newDownload); setDownloads(p => [d as any, ...p]);
                          }
                          setNewDownload({ title:'',category:'HD Posters',url:'',size:'' }); onDataChange?.();
                        }
                        finally { setSaving(null); }
                      }} disabled={saving === 'download'}
                        className="flex items-center gap-2 px-5 py-2 bg-[#FFD700] text-[#0B0F19] font-black text-xs uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow disabled:opacity-50">
                        {saving === 'download' ? <><RefreshCw className="animate-spin" size={12} /> Saving...</> : editDownloadId ? <><Save size={12} /> Update Asset</> : <><Plus size={12} /> Add Asset</>}
                      </button>
                      {editDownloadId && (
                        <button onClick={() => { setEditDownloadId(null); setNewDownload({ title:'',category:'HD Posters',url:'',size:'' }); }}
                          className="px-4 py-2 bg-white/5 text-gray-400 border border-white/10 rounded text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">Cancel</button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {downloads.map(d => (
                      <div key={d.id} className="glass-card rounded-xl border border-white/6 overflow-hidden">
                        <img src={d.url} alt={d.title} className="w-full aspect-video object-cover" onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }} />
                        <div className="p-3 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-white text-xs font-bold truncate">{d.title}</p>
                            <p className="text-gray-500 text-[10px]">{d.category} {d.size && `· ${d.size}`}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => { setNewDownload({ title:d.title||'', category:d.category||'HD Posters', url:d.url||'', size:d.size||'' }); setEditDownloadId(d.id); scrollFormTop(); }}
                              className="p-1.5 text-gray-500 hover:text-[#FFD700] transition-colors" aria-label="Edit asset"><Edit3 size={12} /></button>
                            <button onClick={async () => { if (!confirm('Delete?')) return; await deleteDownloadItem(d.id); setDownloads(p => p.filter(x => x.id !== d.id)); onDataChange?.(); }}
                              className="p-1.5 text-gray-600 hover:text-red-400 transition-colors" aria-label="Delete asset"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && tab === 'upcoming' && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <h3 className="text-white text-lg font-black">Upcoming Releases</h3>
                  </div>

                  <div className={`glass-card p-5 rounded-xl border mb-6 ${editUpcomingId ? 'border-[#FFD700]/40' : 'border-white/6'}`}>
                    <h4 className="text-[#FFD700] text-xs font-black uppercase tracking-wider mb-4">{editUpcomingId ? 'Edit Upcoming Release' : 'Add Upcoming Release'}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <input type="text" placeholder="Movie Title" value={newUpcoming.title} onChange={e => setNewUpcoming({ ...newUpcoming, title: e.target.value })} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFD700]" />
                      <input type="date" value={newUpcoming.releaseDate} onChange={e => setNewUpcoming({ ...newUpcoming, releaseDate: e.target.value })} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFD700]" />
                      <select value={newUpcoming.genre} onChange={e => setNewUpcoming({ ...newUpcoming, genre: e.target.value })} className="bg-[#111827] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFD700]">
                        <option>Action</option>
                        <option>Drama</option>
                        <option>Comedy</option>
                        <option>Thriller</option>
                        <option>Romance</option>
                      </select>
                      <input type="text" placeholder="Character Name" value={newUpcoming.character} onChange={e => setNewUpcoming({ ...newUpcoming, character: e.target.value })} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFD700]" />
                      <input type="url" placeholder="Poster Image URL" value={newUpcoming.poster} onChange={e => setNewUpcoming({ ...newUpcoming, poster: e.target.value })} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFD700]" />
                      <input type="text" placeholder="Description" value={newUpcoming.description} onChange={e => setNewUpcoming({ ...newUpcoming, description: e.target.value })} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFD700]" />
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={async () => {
                        if (!newUpcoming.title || !newUpcoming.releaseDate) return;
                        setSaving('upcoming');
                        try {
                          if (editUpcomingId) {
                            await updateUpcomingRelease(editUpcomingId, newUpcoming);
                            setUpcoming(p => p.map(x => x.id === editUpcomingId ? { ...x, ...newUpcoming } : x));
                            setEditUpcomingId(null);
                          } else {
                            const u = await addUpcomingRelease(newUpcoming); setUpcoming(p => [u as any, ...p]);
                          }
                          setNewUpcoming({ title: '', releaseDate: '', genre: 'Action', character: '', poster: '', description: '' }); onDataChange?.();
                        }
                        finally { setSaving(null); }
                      }} disabled={saving === 'upcoming'}
                        className="flex items-center gap-2 px-5 py-2 bg-[#FFD700] text-[#0B0F19] font-black text-xs uppercase tracking-wider rounded hover:bg-white transition-all shadow-gold-glow disabled:opacity-50">
                        {saving === 'upcoming' ? <><RefreshCw className="animate-spin" size={12} /> Saving...</> : editUpcomingId ? <><Save size={12} /> Update Release</> : <><Plus size={12} /> Add Release</>}
                      </button>
                      {editUpcomingId && (
                        <button onClick={() => { setEditUpcomingId(null); setNewUpcoming({ title: '', releaseDate: '', genre: 'Action', character: '', poster: '', description: '' }); }}
                          className="px-4 py-2 bg-white/5 text-gray-400 border border-white/10 rounded text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">Cancel</button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcoming.map(u => (
                      <div key={u.id} className="relative glass-card p-3 rounded-xl border border-white/6 group overflow-hidden h-80">
                        <img src={u.poster} alt={u.title} className="w-full h-full object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Crect fill=%22%231a1f2e%22 width=%22300%22 height=%22400%22/%3E%3C/svg%3E'; }} />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => { setNewUpcoming({ title: u.title, releaseDate: u.releaseDate, genre: u.genre, character: u.character, poster: u.poster, description: u.description }); setEditUpcomingId(u.id); scrollFormTop(); }}
                              className="p-1.5 rounded-full bg-[#FFD700]/90 text-[#0B0F19]" aria-label="Edit"><Edit3 size={11} /></button>
                            <button onClick={async () => { if (!confirm('Delete?')) return; await deleteUpcomingRelease(u.id); setUpcoming(p => p.filter(x => x.id !== u.id)); onDataChange?.(); }}
                              className="p-1.5 rounded-full bg-[#E50914]/80 text-white" aria-label="Delete"><Trash2 size={11} /></button>
                          </div>
                          <div>
                            <p className="text-[#FFD700] text-[10px] font-bold uppercase tracking-wider">{u.releaseDate}</p>
                            <p className="text-white text-xs font-black truncate">{u.title}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
