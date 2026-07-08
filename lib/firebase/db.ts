import { mockMode, db, auth } from './config';
import {
  collection, getDocs, addDoc, setDoc, deleteDoc,
  doc, updateDoc,
} from 'firebase/firestore';
import {
  onAuthStateChanged,
} from 'firebase/auth';
import {
  initialMovies, initialGallery, initialVideos, initialNews,
  initialCoordinators, initialDownloads, initialFanCreations,
  initialRegistrations, initialTimeline, initialUpcoming,
} from './mockData';

/* ─── LocalStorage helpers ─────────────────────────────────────── */
const DB_VERSION = 'v9_with_upcoming';

function initLS() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('grk_db_version') !== DB_VERSION) {
    ['grk_movies','grk_gallery','grk_videos','grk_news','grk_coordinators',
     'grk_downloads','grk_fan_creations','grk_registrations','grk_timeline','grk_upcoming','grk_newsletter','grk_districts']
      .forEach(k => localStorage.removeItem(k));
    localStorage.setItem('grk_db_version', DB_VERSION);
  }
  const seed = (key: string, data: unknown[]) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(data));
  };
  seed('grk_movies', initialMovies);
  seed('grk_gallery', initialGallery);
  seed('grk_videos', initialVideos);
  seed('grk_news', initialNews);
  seed('grk_coordinators', initialCoordinators);
  seed('grk_downloads', initialDownloads);
  seed('grk_fan_creations', initialFanCreations);
  seed('grk_registrations', initialRegistrations);
  seed('grk_timeline', initialTimeline);
  seed('grk_upcoming', initialUpcoming);
  seed('grk_newsletter', []);
  seed('grk_districts', [
    { id: 'd1', districtName: 'Chennai', groupLink: 'https://chat.whatsapp.com/FVyc1VH3z92C6IrAGt0p7O', president: 'Rajesh Kumar', contactNumber: '+91 98765 43210', status: 'active' },
    { id: 'd2', districtName: 'Coimbatore', groupLink: 'https://chat.whatsapp.com/B2iIm9oC3Z70M4xYeZQ9jF', president: 'Priya Sharma', contactNumber: '+91 97654 32109', status: 'active' },
    { id: 'd3', districtName: 'Madurai', groupLink: 'https://chat.whatsapp.com/KeL8q2Ro9mN7pQrStUvWxY', president: 'Arun Kumar', contactNumber: '+91 96543 21098', status: 'active' }
  ]);
  if (!localStorage.getItem('grk_admin_logged')) localStorage.setItem('grk_admin_logged', 'false');
}
if (typeof window !== 'undefined') initLS();

/* ─── Timeout wrapper ───────────────────────────────────────────── */
function withTimeout<T>(promise: Promise<T>, ms = 2000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Firestore timeout')), ms);
    promise.then(res => { clearTimeout(timer); resolve(res); },
                 err => { clearTimeout(timer); reject(err); });
  });
}

function lsGet<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(key) || '[]') as T[];
}
function lsSet(key: string, data: unknown) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(data));
}

/* ─── API Proxy Call Helper ────────────────────────────────────── */
async function callApiProxy<T>(action: string, params: any[] = []): Promise<T | null> {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, params })
    });
    if (res.status === 501) {
      // MySQL not configured, fallback silently
      return null;
    }
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data as T;
    }
  } catch (err) {
    console.error(`MySQL proxy action "${action}" failed:`, err);
  }
  return null;
}

/* ─── MOVIES ────────────────────────────────────────────────────── */
export const getMovies = async () => {
  const mysqlData = await callApiProxy<any[]>('getMovies');
  if (mysqlData !== null) return mysqlData;

  if (mockMode) return lsGet<typeof initialMovies[0]>('grk_movies');
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'movies')));
    const list: typeof initialMovies = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() } as typeof initialMovies[0]));
    return list.length > 0 ? list.sort((a, b) => Number(b.year) - Number(a.year)) : initialMovies;
  } catch { return initialMovies; }
};

export const addMovie = async (item: Omit<typeof initialMovies[0], 'id'>) => {
  const mysqlData = await callApiProxy<any>('addMovie', [item]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const list = lsGet<typeof initialMovies[0]>('grk_movies');
    const n = { id: 'm_' + Date.now(), ...item };
    list.unshift(n); lsSet('grk_movies', list); return n;
  }
  const ref = await addDoc(collection(db!, 'movies'), item);
  return { id: ref.id, ...item };
};

export const deleteMovie = async (id: string) => {
  const mysqlData = await callApiProxy<any>('deleteMovie', [id]);
  if (mysqlData !== null) return;

  if (mockMode) { lsSet('grk_movies', lsGet<{ id: string }>('grk_movies').filter(i => i.id !== id)); return; }
  await deleteDoc(doc(db!, 'movies', id));
};

export const updateMovie = async (id: string, data: Partial<typeof initialMovies[0]>) => {
  const mysqlData = await callApiProxy<any>('updateMovie', [id, data]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const list = lsGet<typeof initialMovies[0]>('grk_movies');
    const idx = list.findIndex(m => m.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...data }; lsSet('grk_movies', list); }
    return list[list.findIndex(m => m.id === id)];
  }
  await updateDoc(doc(db!, 'movies', id), data as Record<string, unknown>);
};

/* ─── UPCOMING RELEASES ─────────────────────────────────────────── */
export const getUpcomingReleases = async () => {
  const mysqlData = await callApiProxy<any[]>('getUpcomingReleases');
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const upcoming = lsGet<any>('grk_upcoming');
    return upcoming.length > 0 ? upcoming : [];
  }
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'upcoming')));
    const list: any[] = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() }));
    return list;
  } catch { return []; }
};

export const addUpcomingRelease = async (item: any) => {
  const mysqlData = await callApiProxy<any>('addUpcomingRelease', [item]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const list = lsGet<any>('grk_upcoming');
    const n = { id: 'up_' + Date.now(), ...item };
    list.unshift(n); lsSet('grk_upcoming', list); return n;
  }
  const ref = await addDoc(collection(db!, 'upcoming'), item);
  return { id: ref.id, ...item };
};

export const deleteUpcomingRelease = async (id: string) => {
  const mysqlData = await callApiProxy<any>('deleteUpcomingRelease', [id]);
  if (mysqlData !== null) return;

  if (mockMode) { lsSet('grk_upcoming', lsGet<{ id: string }>('grk_upcoming').filter(i => i.id !== id)); return; }
  await deleteDoc(doc(db!, 'upcoming', id));
};

export const updateUpcomingRelease = async (id: string, data: any) => {
  const mysqlData = await callApiProxy<any>('updateUpcomingRelease', [id, data]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const list = lsGet<any>('grk_upcoming');
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...data }; lsSet('grk_upcoming', list); return list[idx]; }
    return null;
  }
  await updateDoc(doc(db!, 'upcoming', id), data as Record<string, unknown>);
};

/* ─── TIMELINE ──────────────────────────────────────────────────── */
export const getTimeline = async () => {
  const mysqlData = await callApiProxy<any[]>('getTimeline');
  if (mysqlData !== null) return mysqlData;

  if (mockMode) return lsGet<typeof initialTimeline[0]>('grk_timeline');
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'timeline')));
    const list: typeof initialTimeline = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() } as typeof initialTimeline[0] & { id: string }));
    return list.length > 0 ? list.sort((a, b) => Number(a.year) - Number(b.year)) : initialTimeline;
  } catch { return initialTimeline; }
};

export const addTimelineItem = async (item: Omit<typeof initialTimeline[0], 'id'>) => {
  const mysqlData = await callApiProxy<any>('addTimelineItem', [item]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const list = lsGet<typeof initialTimeline[0]>('grk_timeline');
    const n = { id: 't_' + Date.now(), ...item };
    list.push(n); lsSet('grk_timeline', list); return n;
  }
  const ref = await addDoc(collection(db!, 'timeline'), item);
  return { id: ref.id, ...item };
};

export const deleteTimelineItem = async (id: string) => {
  const mysqlData = await callApiProxy<any>('deleteTimelineItem', [id]);
  if (mysqlData !== null) return;

  if (mockMode) { lsSet('grk_timeline', lsGet<{ id: string }>('grk_timeline').filter(i => i.id !== id)); return; }
  await deleteDoc(doc(db!, 'timeline', id));
};

/* ─── GALLERY ───────────────────────────────────────────────────── */
export const getGallery = async () => {
  const mysqlData = await callApiProxy<any[]>('getGallery');
  if (mysqlData !== null) return mysqlData;

  if (mockMode) return lsGet<typeof initialGallery[0]>('grk_gallery');
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'gallery')));
    const list: typeof initialGallery = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() } as typeof initialGallery[0]));
    return list.length > 0 ? list : initialGallery;
  } catch { return initialGallery; }
};

export const addGalleryItem = async (item: Omit<typeof initialGallery[0], 'id'>) => {
  const mysqlData = await callApiProxy<any>('addGalleryItem', [item]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const list = lsGet<typeof initialGallery[0]>('grk_gallery');
    const n = { id: 'g_' + Date.now(), ...item };
    list.unshift(n); lsSet('grk_gallery', list); return n;
  }
  const ref = await addDoc(collection(db!, 'gallery'), item);
  return { id: ref.id, ...item };
};

export const deleteGalleryItem = async (id: string) => {
  const mysqlData = await callApiProxy<any>('deleteGalleryItem', [id]);
  if (mysqlData !== null) return;

  if (mockMode) { lsSet('grk_gallery', lsGet<{ id: string }>('grk_gallery').filter(i => i.id !== id)); return; }
  await deleteDoc(doc(db!, 'gallery', id));
};

export const updateGalleryItem = async (id: string, data: Partial<typeof initialGallery[0]>) => {
  const mysqlData = await callApiProxy<any>('updateGalleryItem', [id, data]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const list = lsGet<typeof initialGallery[0]>('grk_gallery');
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...data }; lsSet('grk_gallery', list); return list[idx]; }
    return null;
  }
  await updateDoc(doc(db!, 'gallery', id), data as Record<string, unknown>);
};

/* ─── VIDEOS ────────────────────────────────────────────────────── */
export const getVideos = async () => {
  const mysqlData = await callApiProxy<any[]>('getVideos');
  if (mysqlData !== null) return mysqlData;

  if (mockMode) return lsGet<typeof initialVideos[0]>('grk_videos');
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'videos')));
    const list: typeof initialVideos = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() } as typeof initialVideos[0]));
    return list.length > 0 ? list : initialVideos;
  } catch { return initialVideos; }
};

export const addVideoItem = async (item: Omit<typeof initialVideos[0], 'id'>) => {
  const mysqlData = await callApiProxy<any>('addVideoItem', [item]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const list = lsGet<typeof initialVideos[0]>('grk_videos');
    const n = { id: 'v_' + Date.now(), ...item };
    list.unshift(n); lsSet('grk_videos', list); return n;
  }
  const ref = await addDoc(collection(db!, 'videos'), item);
  return { id: ref.id, ...item };
};

export const deleteVideoItem = async (id: string) => {
  const mysqlData = await callApiProxy<any>('deleteVideoItem', [id]);
  if (mysqlData !== null) return;

  if (mockMode) { lsSet('grk_videos', lsGet<{ id: string }>('grk_videos').filter(i => i.id !== id)); return; }
  await deleteDoc(doc(db!, 'videos', id));
};

export const updateVideoItem = async (id: string, data: Partial<typeof initialVideos[0]>) => {
  const mysqlData = await callApiProxy<any>('updateVideoItem', [id, data]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const list = lsGet<typeof initialVideos[0]>('grk_videos');
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...data }; lsSet('grk_videos', list); return list[idx]; }
    return null;
  }
  await updateDoc(doc(db!, 'videos', id), data as Record<string, unknown>);
};

/* ─── NEWS ──────────────────────────────────────────────────────── */
export const getNews = async () => {
  const mysqlData = await callApiProxy<any[]>('getNews');
  if (mysqlData !== null) return mysqlData;

  if (mockMode) return lsGet<typeof initialNews[0]>('grk_news');
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'news')));
    const list: typeof initialNews = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() } as typeof initialNews[0]));
    return list.length > 0 ? list : initialNews;
  } catch { return initialNews; }
};

export const addNewsItem = async (item: Omit<typeof initialNews[0], 'id' | 'date'>) => {
  const mysqlData = await callApiProxy<any>('addNewsItem', [item]);
  if (mysqlData !== null) return mysqlData;

  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  if (mockMode) {
    const list = lsGet<typeof initialNews[0]>('grk_news');
    if ((item as typeof initialNews[0]).featured) list.forEach(n => { n.featured = false; });
    const n = { id: 'n_' + Date.now(), date, ...item };
    list.unshift(n); lsSet('grk_news', list); return n;
  }
  const ref = await addDoc(collection(db!, 'news'), { ...item, date });
  return { id: ref.id, date, ...item };
};

export const deleteNewsItem = async (id: string) => {
  const mysqlData = await callApiProxy<any>('deleteNewsItem', [id]);
  if (mysqlData !== null) return;

  if (mockMode) { lsSet('grk_news', lsGet<{ id: string }>('grk_news').filter(i => i.id !== id)); return; }
  await deleteDoc(doc(db!, 'news', id));
};

export const updateNewsItem = async (id: string, data: Partial<typeof initialNews[0]>) => {
  const mysqlData = await callApiProxy<any>('updateNewsItem', [id, data]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const list = lsGet<typeof initialNews[0]>('grk_news');
    if ((data as typeof initialNews[0]).featured) list.forEach(n => { if (n.id !== id) n.featured = false; });
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...data }; lsSet('grk_news', list); return list[idx]; }
    return null;
  }
  await updateDoc(doc(db!, 'news', id), data as Record<string, unknown>);
};

/* ─── DOWNLOADS ─────────────────────────────────────────────────── */
export const getDownloads = async () => {
  const mysqlData = await callApiProxy<any[]>('getDownloads');
  if (mysqlData !== null) return mysqlData;

  if (mockMode) return lsGet<typeof initialDownloads[0]>('grk_downloads');
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'downloads')));
    const list: typeof initialDownloads = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() } as typeof initialDownloads[0]));
    return list.length > 0 ? list : initialDownloads;
  } catch { return initialDownloads; }
};

export const addDownloadItem = async (item: Omit<typeof initialDownloads[0], 'id'>) => {
  const mysqlData = await callApiProxy<any>('addDownloadItem', [item]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const list = lsGet<typeof initialDownloads[0]>('grk_downloads');
    const n = { id: 'd_' + Date.now(), ...item };
    list.unshift(n); lsSet('grk_downloads', list); return n;
  }
  const ref = await addDoc(collection(db!, 'downloads'), item);
  return { id: ref.id, ...item };
};

export const deleteDownloadItem = async (id: string) => {
  const mysqlData = await callApiProxy<any>('deleteDownloadItem', [id]);
  if (mysqlData !== null) return;

  if (mockMode) { lsSet('grk_downloads', lsGet<{ id: string }>('grk_downloads').filter(i => i.id !== id)); return; }
  await deleteDoc(doc(db!, 'downloads', id));
};

export const updateDownloadItem = async (id: string, data: Partial<typeof initialDownloads[0]>) => {
  const mysqlData = await callApiProxy<any>('updateDownloadItem', [id, data]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const list = lsGet<typeof initialDownloads[0]>('grk_downloads');
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...data }; lsSet('grk_downloads', list); return list[idx]; }
    return null;
  }
  await updateDoc(doc(db!, 'downloads', id), data as Record<string, unknown>);
};

/* ─── FAN CREATIONS ─────────────────────────────────────────────── */
export const getFanCreations = async () => {
  if (mockMode) return lsGet<typeof initialFanCreations[0]>('grk_fan_creations');
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'fan_creations')));
    const list: typeof initialFanCreations = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() } as typeof initialFanCreations[0]));
    return list.length > 0 ? list : initialFanCreations;
  } catch { return initialFanCreations; }
};

export const addFanCreation = async (item: Omit<typeof initialFanCreations[0], 'id' | 'likes' | 'likedByUser' | 'date'>) => {
  if (mockMode) {
    const list = lsGet<typeof initialFanCreations[0]>('grk_fan_creations');
    const n = { id: 'fc_' + Date.now(), likes: 0, likedByUser: false, date: 'Just now', ...item };
    list.unshift(n); lsSet('grk_fan_creations', list); return n;
  }
  const ref = await addDoc(collection(db!, 'fan_creations'), { ...item, likes: 0, likedByUser: false, date: 'Just now' });
  return { id: ref.id, ...item, likes: 0, likedByUser: false, date: 'Just now' };
};

export const likeFanCreation = async (id: string) => {
  const list = lsGet<typeof initialFanCreations[0]>('grk_fan_creations');
  const idx = list.findIndex(i => i.id === id);
  if (idx !== -1) {
    const item = list[idx];
    if (item.likedByUser) { item.likes = Math.max(0, item.likes - 1); item.likedByUser = false; }
    else { item.likes += 1; item.likedByUser = true; }
    lsSet('grk_fan_creations', list); return item;
  }
  return null;
};

/* ─── REGISTRATIONS ─────────────────────────────────────────────── */
export const getRegistrations = async () => {
  const mysqlData = await callApiProxy<any[]>('getRegistrations');
  if (mysqlData !== null) return mysqlData;

  try {
    const snap = await withTimeout(getDocs(collection(db!, 'registrations')), 2000);
    const list: typeof initialRegistrations = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() } as typeof initialRegistrations[0]));
    const local = lsGet<typeof initialRegistrations[0]>('grk_registrations');
    const merged = [...list];
    local.forEach(l => { if (!merged.some(m => m.id === l.id)) merged.unshift(l); });
    return merged.length > 0 ? merged : initialRegistrations;
  } catch {
    return lsGet<typeof initialRegistrations[0]>('grk_registrations');
  }
};

export const getRegistrationByPhone = async (phone: string) => {
  const clean = phone.trim();
  const mysqlData = await callApiProxy<any>('getRegistrationByPhone', [clean]);
  if (mysqlData !== null) return mysqlData;

  try {
    const snap = await withTimeout(getDocs(collection(db!, 'registrations')), 2000);
    const list: typeof initialRegistrations = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() } as typeof initialRegistrations[0]));
    const found = list.find(r => r.phone === clean);
    if (found) return found;
    const local = lsGet<typeof initialRegistrations[0]>('grk_registrations');
    return local.find(r => r.phone === clean) || null;
  } catch {
    const local = lsGet<typeof initialRegistrations[0]>('grk_registrations');
    return local.find(r => r.phone === clean) || null;
  }
};

export const addRegistration = async (reg: Omit<typeof initialRegistrations[0], 'id' | 'status' | 'joinedDate'>) => {
  const list = lsGet<typeof initialRegistrations[0]>('grk_registrations');
  const nextNum = list.length + 1;
  const regId = 'GRK-' + String(nextNum).padStart(9, '0');
  const joinedDate = new Date().toISOString().split('T')[0];
  const formattedReg = { id: regId, ...reg, status: 'Pending', joinedDate };

  const mysqlData = await callApiProxy<any>('addRegistration', [formattedReg]);
  if (mysqlData !== null) return mysqlData;

  list.unshift(formattedReg); lsSet('grk_registrations', list);
  if (mockMode) return formattedReg;
  try { await withTimeout(setDoc(doc(db!, 'registrations', regId), formattedReg), 2000); } catch { /* stored in LS */ }
  return formattedReg;
};

export const updateRegistrationStatus = async (id: string, status: string) => {
  const mysqlData = await callApiProxy<any>('updateRegistrationStatus', [id, status]);
  if (mysqlData !== null) return mysqlData;

  const list = lsGet<typeof initialRegistrations[0]>('grk_registrations');
  const idx = list.findIndex(r => r.id === id);
  if (idx !== -1) { list[idx].status = status; lsSet('grk_registrations', list); }
  if (mockMode) return list[idx];
  try { await withTimeout(updateDoc(doc(db!, 'registrations', id), { status }), 2000); } catch { /* stored in LS */ }
  return list[idx];
};

export const deleteRegistration = async (id: string) => {
  const mysqlData = await callApiProxy<any>('deleteRegistration', [id]);
  if (mysqlData !== null) return;

  lsSet('grk_registrations', lsGet<{ id: string }>('grk_registrations').filter(r => r.id !== id));
  if (mockMode) return;
  try { await withTimeout(deleteDoc(doc(db!, 'registrations', id)), 2000); } catch { /* stored in LS */ }
};

export const updateRegistrationPhoto = async (id: string, photo: string) => {
  const mysqlData = await callApiProxy<any>('updateRegistrationPhoto', [id, photo]);
  if (mysqlData !== null) return mysqlData;

  const list = lsGet<typeof initialRegistrations[0]>('grk_registrations');
  const idx = list.findIndex(r => r.id === id);
  if (idx !== -1) { list[idx].photo = photo; lsSet('grk_registrations', list); }
  if (mockMode) return list[idx];
  try { await withTimeout(updateDoc(doc(db!, 'registrations', id), { photo }), 2000); } catch { /* stored in LS */ }
  return list[idx];
};

/* ─── COORDINATORS ─────────────────────────────────────────────── */
export const getCoordinators = async () => {
  if (mockMode) return lsGet<typeof initialCoordinators[0]>('grk_coordinators');
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'coordinators')));
    const list: typeof initialCoordinators = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() } as typeof initialCoordinators[0]));
    return list.length > 0 ? list : initialCoordinators;
  } catch { return initialCoordinators; }
};

export const addCoordinator = async (item: Omit<typeof initialCoordinators[0], 'id'>) => {
  if (mockMode) {
    const list = lsGet<typeof initialCoordinators[0]>('grk_coordinators');
    const n = { id: 'coord_' + Date.now(), ...item };
    list.push(n); lsSet('grk_coordinators', list); return n;
  }
  const ref = await addDoc(collection(db!, 'coordinators'), item);
  return { id: ref.id, ...item };
};

export const deleteCoordinator = async (id: string) => {
  if (mockMode) { lsSet('grk_coordinators', lsGet<{ id: string }>('grk_coordinators').filter(i => i.id !== id)); return; }
  await deleteDoc(doc(db!, 'coordinators', id));
};

export const updateCoordinator = async (id: string, data: Partial<typeof initialCoordinators[0]>) => {
  if (mockMode) {
    const list = lsGet<typeof initialCoordinators[0]>('grk_coordinators');
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...data }; lsSet('grk_coordinators', list); return list[idx]; }
    return null;
  }
  await updateDoc(doc(db!, 'coordinators', id), data as Record<string, unknown>);
};

/* ─── POPUP SETTINGS ──────────────────────────────────────────────── */
export const getPopupSettings = async () => {
  if (mockMode) {
    const s = localStorage.getItem('grk_popup_settings');
    return s ? JSON.parse(s) : { popupEnabled: true, popupReleaseId: null };
  }
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'settings')));
    const doc_data = snap.docs.find(d => d.id === 'popup')?.data();
    return doc_data || { popupEnabled: true, popupReleaseId: null };
  } catch { return { popupEnabled: true, popupReleaseId: null }; }
};

export const updatePopupSettings = async (data: { popupEnabled: boolean; popupReleaseId: string | null }) => {
  if (mockMode) { localStorage.setItem('grk_popup_settings', JSON.stringify(data)); return; }
  try { await withTimeout(setDoc(doc(db!, 'settings', 'popup'), data, { merge: true })); } catch { localStorage.setItem('grk_popup_settings', JSON.stringify(data)); }
};

/* ─── NEWSLETTER SUBSCRIPTION ──────────────────────────────────────── */
export const subscribeNewsletter = async (email: string) => {
  const mysqlData = await callApiProxy<any>('subscribeNewsletter', [email]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const subs = lsGet<{ email: string; subscribedAt: string }[]>('grk_newsletter');
    if (subs.find(s => s.email === email)) return { success: false, message: 'Already subscribed' };
    const newSub = { email, subscribedAt: new Date().toISOString() };
    subs.push(newSub);
    lsSet('grk_newsletter', subs);
    return { success: true, message: 'Subscribed to newsletter' };
  }
  try {
    await withTimeout(addDoc(collection(db!, 'newsletter'), { email, subscribedAt: new Date().toISOString() }));
    return { success: true, message: 'Subscribed to newsletter' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Subscription failed' };
  }
};

export const getNewsletterSubscribers = async () => {
  const mysqlData = await callApiProxy<any[]>('getNewsletterSubscribers');
  if (mysqlData !== null) return mysqlData;

  if (mockMode) return lsGet<{ email: string; subscribedAt: string }[]>('grk_newsletter');
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'newsletter')));
    const list: any[] = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() }));
    return list;
  } catch { return []; }
};

export const removeNewsletterSubscriber = async (email: string) => {
  const mysqlData = await callApiProxy<any>('removeNewsletterSubscriber', [email]);
  if (mysqlData !== null) return;

  if (mockMode) {
    lsSet('grk_newsletter', lsGet<{ email: string }>('grk_newsletter').filter(s => s.email !== email));
    return;
  }
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'newsletter')));
    snap.forEach(d => {
      if (d.data().email === email) deleteDoc(d.ref);
    });
  } catch { }
};

/* ─── ADMIN AUTH ──────────────────────────────────────────────────── */
export const adminLogin = async (email: string, password: string) => {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Invalid credentials');
  }

  const data = await response.json();
  const u = data.user;
  lsSet('grk_admin_user', u);
  localStorage.setItem('grk_admin_logged', 'true');
  return u;
};

export const adminLogout = async () => {
  localStorage.setItem('grk_admin_logged', 'false');
  localStorage.removeItem('grk_admin_user');
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
  } catch (err) {
    console.error('Logout API Error:', err);
  }
};

export const getCurrentAdmin = (callback: (user: { email: string; name: string; role: string; district: string } | null) => void) => {
  if (mockMode) {
    const logged = localStorage.getItem('grk_admin_logged') === 'true';
    const user = logged ? lsGet<{ email: string; name: string; role: string; district: string }>('grk_admin_user')[0] ?? null : null;
    callback(Array.isArray(user) ? null : user as unknown as { email: string; name: string; role: string; district: string } | null);
    return () => {};
  }
  callback(null);
  return () => {};
};

/* ─── ID CARD GENERATION ──────────────────────────────────────────── */
export const generateIDCard = (reg: typeof initialRegistrations[0]) => {
  const districtLinks: Record<string, string> = {
    'Chennai': 'https://chat.whatsapp.com/FVyc1VH3z92C6IrAGt0p7O',
    'Coimbatore': 'https://chat.whatsapp.com/B2iIm9oC3Z70M4xYeZQ9jF',
    'Madurai': 'https://chat.whatsapp.com/KeL8q2Ro9mN7pQrStUvWxY',
    'Trichy': 'https://chat.whatsapp.com/AaBbCcDdEeFfGgHhIiJjKk',
    'Salem': 'https://chat.whatsapp.com/LoMnOpQrStUvWxYzAbCdEf',
    'Tirunelveli': 'https://chat.whatsapp.com/GhIjKlMnOpQrStUvWxYzAb',
    'Vellore': 'https://chat.whatsapp.com/CdEfGhIjKlMnOpQrStUvWx',
  };

  const districtGroupLink = districtLinks[reg.district] || 'https://chat.whatsapp.com/grk-fanclub';
  const memberID = `GRK-${reg.id.substring(0, 8).toUpperCase()}`;
  const joinDate = new Date(reg.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return {
    memberID,
    name: reg.name,
    district: reg.district,
    joinDate,
    bloodGroup: reg.bloodGroup || 'Not specified',
    districtGroupLink,
    whatsappMessage: `🎬 Welcome to GRK Official Fan Club! 🌟\n\n✅ Approved Member\n📱 Member ID: ${memberID}\n👤 Name: ${reg.name}\n📍 District: ${reg.district}\n🩸 Blood Group: ${reg.bloodGroup || 'Not specified'}\n📅 Joined: ${joinDate}\n\n🔗 Join your district group:\n${districtGroupLink}\n\nThank you for being a part of this amazing journey! 🚀\n#GauthamRamKarthik #OfficalFanClub #TamilCinema`,
    whatsappMessageTemplate: `Welcome to GRK Fan Club! Member ID: ${memberID}, Name: ${reg.name}`,
  };
};

export const sendIDCardViaWhatsApp = (idCard: ReturnType<typeof generateIDCard>) => {
  const encodedMessage = encodeURIComponent(idCard.whatsappMessage);
  return `https://wa.me/?text=${encodedMessage}`;
};

/* ─── DISTRICT MANAGEMENT ──────────────────────────────────────────── */
export interface District {
  id: string;
  districtName: string;
  groupLink: string;
  president: string;
  contactNumber: string;
  status: 'active' | 'inactive';
}

const initialDistricts: District[] = [
  { id: 'd1', districtName: 'Chennai', groupLink: 'https://chat.whatsapp.com/FVyc1VH3z92C6IrAGt0p7O', president: 'Rajesh Kumar', contactNumber: '+91 98765 43210', status: 'active' },
  { id: 'd2', districtName: 'Coimbatore', groupLink: 'https://chat.whatsapp.com/B2iIm9oC3Z70M4xYeZQ9jF', president: 'Priya Sharma', contactNumber: '+91 97654 32109', status: 'active' },
  { id: 'd3', districtName: 'Madurai', groupLink: 'https://chat.whatsapp.com/KeL8q2Ro9mN7pQrStUvWxY', president: 'Arun Kumar', contactNumber: '+91 96543 21098', status: 'active' }
];

export const getDistricts = async () => {
  const mysqlData = await callApiProxy<District[]>('getDistricts');
  if (mysqlData !== null) return mysqlData;

  if (mockMode) return lsGet<District>('grk_districts');
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'districts')));
    const list: District[] = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() } as District));
    return list.length > 0 ? list : initialDistricts;
  } catch { return initialDistricts; }
};

export const addDistrict = async (item: Omit<District, 'id'>) => {
  const mysqlData = await callApiProxy<District>('addDistrict', [item]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const list = lsGet<District>('grk_districts');
    const n = { id: 'd_' + Date.now(), ...item };
    list.push(n);
    lsSet('grk_districts', list);
    return n;
  }
  const ref = await addDoc(collection(db!, 'districts'), item);
  return { id: ref.id, ...item };
};

export const updateDistrict = async (id: string, item: Partial<District>) => {
  const mysqlData = await callApiProxy<any>('updateDistrict', [id, item]);
  if (mysqlData !== null) return;

  if (mockMode) {
    const list = lsGet<District>('grk_districts');
    const idx = list.findIndex(d => d.id === id);
    if (idx >= 0) { list[idx] = { ...list[idx], ...item }; lsSet('grk_districts', list); }
  } else {
    await withTimeout(updateDoc(doc(db!, 'districts', id), item));
  }
};

export const deleteDistrict = async (id: string) => {
  const mysqlData = await callApiProxy<any>('deleteDistrict', [id]);
  if (mysqlData !== null) return;

  if (mockMode) {
    lsSet('grk_districts', lsGet<District>('grk_districts').filter(d => d.id !== id));
  } else {
    await withTimeout(deleteDoc(doc(db!, 'districts', id)));
  }
};

/* ─── WHATSAPP MESSAGE & CARD STATUS ──────────────────────────────── */
export interface WhatsAppLog {
  id: string;
  registrationId: string;
  memberName: string;
  phoneNumber: string;
  district: string;
  status: 'pending' | 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  messageId?: string;
  sentTime?: string;
  deliveredTime?: string;
  cardUrl?: string;
  errorMessage?: string;
  retryCount: number;
}

export const createWhatsAppLog = async (reg: any): Promise<WhatsAppLog> => {
  const log: WhatsAppLog = {
    id: `wa_${Date.now()}`,
    registrationId: reg.id,
    memberName: reg.name,
    phoneNumber: reg.phone,
    district: reg.district,
    status: 'pending',
    retryCount: 0,
    sentTime: new Date().toISOString(),
  };

  const mysqlData = await callApiProxy<WhatsAppLog>('createWhatsAppLog', [log]);
  if (mysqlData !== null) return mysqlData;
  
  if (mockMode) {
    const logs = lsGet<WhatsAppLog>('grk_whatsapp_logs');
    logs.push(log);
    lsSet('grk_whatsapp_logs', logs);
  } else {
    try {
      await withTimeout(addDoc(collection(db!, 'whatsapp_logs'), log));
    } catch (err) {
      console.error('Failed to create WhatsApp log:', err);
    }
  }
  
  return log;
};

export const updateWhatsAppLogStatus = async (logId: string, status: WhatsAppLog['status'], data?: Partial<WhatsAppLog>) => {
  const mysqlData = await callApiProxy<any>('updateWhatsAppLogStatus', [logId, status, data]);
  if (mysqlData !== null) return;

  if (mockMode) {
    const logs = lsGet<WhatsAppLog>('grk_whatsapp_logs');
    const idx = logs.findIndex(l => l.id === logId);
    if (idx >= 0) {
      logs[idx] = { ...logs[idx], status, ...data };
      lsSet('grk_whatsapp_logs', logs);
    }
  } else {
    try {
      await withTimeout(updateDoc(doc(db!, 'whatsapp_logs', logId), { status, ...data }));
    } catch (err) {
      console.error('Failed to update WhatsApp log:', err);
    }
  }
};

export const getWhatsAppLogs = async () => {
  const mysqlData = await callApiProxy<WhatsAppLog[]>('getWhatsAppLogs');
  if (mysqlData !== null) return mysqlData;

  if (mockMode) return lsGet<WhatsAppLog>('grk_whatsapp_logs');
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'whatsapp_logs')));
    const list: WhatsAppLog[] = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() } as WhatsAppLog));
    return list;
  } catch { return []; }
};

/* ─── MEMBERSHIP CARD GENERATION ──────────────────────────────────── */
export interface MembershipCard {
  id: string;
  registrationId: string;
  pngUrl?: string;
  pdfUrl?: string;
  generatedAt: string;
}

export const saveMembershipCard = async (registrationId: string, pngUrl: string, pdfUrl: string): Promise<MembershipCard> => {
  const card: MembershipCard = {
    id: `card_${Date.now()}`,
    registrationId,
    pngUrl,
    pdfUrl,
    generatedAt: new Date().toISOString(),
  };

  const mysqlData = await callApiProxy<MembershipCard>('saveMembershipCard', [registrationId, pngUrl, pdfUrl]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const cards = lsGet<MembershipCard>('grk_membership_cards');
    cards.push(card);
    lsSet('grk_membership_cards', cards);
  } else {
    try {
      await withTimeout(addDoc(collection(db!, 'membership_cards'), card));
    } catch (err) {
      console.error('Failed to save membership card:', err);
    }
  }

  return card;
};

export const getMembershipCard = async (registrationId: string): Promise<MembershipCard | null> => {
  const mysqlData = await callApiProxy<MembershipCard | null>('getMembershipCard', [registrationId]);
  if (mysqlData !== null) return mysqlData;

  if (mockMode) {
    const cards = lsGet<MembershipCard>('grk_membership_cards');
    return cards.find(c => c.registrationId === registrationId) || null;
  }
  
  try {
    const snap = await withTimeout(getDocs(collection(db!, 'membership_cards')));
    let card: MembershipCard | null = null;
    snap.forEach(d => {
      if (d.data().registrationId === registrationId) {
        card = { id: d.id, ...d.data() } as MembershipCard;
      }
    });
    return card;
  } catch { return null; }
};

/* ─── INITIALIZE STORAGE FOR NEW DATA TYPES ──────────────────────────── */
const initializeNewStorage = () => {
  if (typeof window === 'undefined') return;
  const seed = (key: string, data: any[]) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(data));
  };
  seed('grk_districts', initialDistricts);
  seed('grk_whatsapp_logs', []);
  seed('grk_membership_cards', []);
};

if (typeof window !== 'undefined') {
  setTimeout(initializeNewStorage, 100);
}
