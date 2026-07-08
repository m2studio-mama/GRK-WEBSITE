import { mockMode, db, auth, storage } from './config';
import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc,
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  initialMovies, 
  initialGallery, 
  initialVideos, 
  initialNews, 
  initialCoordinators, 
  initialDownloads, 
  initialFanCreations, 
  initialRegistrations,
  initialTimeline
} from './mockData';

// Helper to initialize LocalStorage collections if they don't exist
const initLocalStorageCollection = (key, initialData) => {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(initialData));
  }
};

if (mockMode) {
  const DB_VERSION = 'v8_with_cities';
  if (localStorage.getItem('grk_db_version') !== DB_VERSION) {
    localStorage.removeItem('grk_movies');
    localStorage.removeItem('grk_gallery');
    localStorage.removeItem('grk_videos');
    localStorage.removeItem('grk_news');
    localStorage.removeItem('grk_coordinators');
    localStorage.removeItem('grk_downloads');
    localStorage.removeItem('grk_fan_creations');
    localStorage.removeItem('grk_registrations');
    localStorage.removeItem('grk_timeline');
    localStorage.setItem('grk_db_version', DB_VERSION);
  }

  initLocalStorageCollection('grk_movies', initialMovies);
  initLocalStorageCollection('grk_gallery', initialGallery);
  initLocalStorageCollection('grk_videos', initialVideos);
  initLocalStorageCollection('grk_news', initialNews);
  initLocalStorageCollection('grk_coordinators', initialCoordinators);
  initLocalStorageCollection('grk_downloads', initialDownloads);
  initLocalStorageCollection('grk_fan_creations', initialFanCreations);
  initLocalStorageCollection('grk_registrations', initialRegistrations);
  initLocalStorageCollection('grk_timeline', initialTimeline);
  // Default mock admin session
  if (!localStorage.getItem('grk_admin_logged')) {
    localStorage.setItem('grk_admin_logged', 'false');
  }
}

// Timeout wrapper helper for Firestore connections to prevent hanging on uncreated databases
const withTimeout = (promise, ms = 1500) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Firestore database connection timed out. Falling back to local data."));
    }, ms);
    
    promise.then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
};

// --- MOVIES ---
export const getMovies = async () => {
  if (mockMode) {
    return JSON.parse(localStorage.getItem('grk_movies'));
  }
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, 'movies')), 1500);
    const movies = [];
    querySnapshot.forEach((doc) => movies.push({ id: doc.id, ...doc.data() }));
    return movies.length > 0 ? movies.sort((a, b) => b.year - a.year) : initialMovies;
  } catch (error) {
    console.error('Firestore getMovies error, falling back to mock:', error);
    return initialMovies;
  }
};

// --- TIMELINE ---
export const getTimeline = async () => {
  if (mockMode) {
    return JSON.parse(localStorage.getItem('grk_timeline'));
  }
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, 'timeline')), 1500);
    const timeline = [];
    querySnapshot.forEach((doc) => timeline.push({ id: doc.id, ...doc.data() }));
    return timeline.length > 0 ? timeline.sort((a, b) => a.year - b.year) : initialTimeline;
  } catch (error) {
    console.error('Firestore getTimeline error, falling back to mock:', error);
    return initialTimeline;
  }
};

// --- GALLERY ---
export const getGallery = async () => {
  if (mockMode) {
    return JSON.parse(localStorage.getItem('grk_gallery'));
  }
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, 'gallery')), 1500);
    const gallery = [];
    querySnapshot.forEach((doc) => gallery.push({ id: doc.id, ...doc.data() }));
    return gallery.length > 0 ? gallery : initialGallery;
  } catch (error) {
    console.error('Firestore getGallery error, falling back to mock:', error);
    return initialGallery;
  }
};

export const addGalleryItem = async (item) => {
  if (mockMode) {
    const gallery = JSON.parse(localStorage.getItem('grk_gallery'));
    const newItem = { id: 'g_' + Date.now(), ...item };
    gallery.unshift(newItem);
    localStorage.setItem('grk_gallery', JSON.stringify(gallery));
    return newItem;
  }
  const docRef = await addDoc(collection(db, 'gallery'), item);
  return { id: docRef.id, ...item };
};

export const deleteGalleryItem = async (id) => {
  if (mockMode) {
    let gallery = JSON.parse(localStorage.getItem('grk_gallery'));
    gallery = gallery.filter((item) => item.id !== id);
    localStorage.setItem('grk_gallery', JSON.stringify(gallery));
    return true;
  }
  await deleteDoc(doc(db, 'gallery', id));
  return true;
};

// --- VIDEOS ---
export const getVideos = async () => {
  if (mockMode) {
    return JSON.parse(localStorage.getItem('grk_videos'));
  }
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, 'videos')), 1500);
    const videos = [];
    querySnapshot.forEach((doc) => videos.push({ id: doc.id, ...doc.data() }));
    return videos.length > 0 ? videos : initialVideos;
  } catch (error) {
    console.error('Firestore getVideos error, falling back to mock:', error);
    return initialVideos;
  }
};

export const addVideoItem = async (item) => {
  if (mockMode) {
    const videos = JSON.parse(localStorage.getItem('grk_videos'));
    const newItem = { id: 'v_' + Date.now(), ...item };
    videos.unshift(newItem);
    localStorage.setItem('grk_videos', JSON.stringify(videos));
    return newItem;
  }
  const docRef = await addDoc(collection(db, 'videos'), item);
  return { id: docRef.id, ...item };
};

export const deleteVideoItem = async (id) => {
  if (mockMode) {
    let videos = JSON.parse(localStorage.getItem('grk_videos'));
    videos = videos.filter((item) => item.id !== id);
    localStorage.setItem('grk_videos', JSON.stringify(videos));
    return true;
  }
  await deleteDoc(doc(db, 'videos', id));
  return true;
};

// --- NEWS ---
export const getNews = async () => {
  if (mockMode) {
    return JSON.parse(localStorage.getItem('grk_news'));
  }
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, 'news')), 1500);
    const news = [];
    querySnapshot.forEach((doc) => news.push({ id: doc.id, ...doc.data() }));
    return news.length > 0 ? news : initialNews;
  } catch (error) {
    console.error('Firestore getNews error, falling back to mock:', error);
    return initialNews;
  }
};

export const addNewsItem = async (item) => {
  if (mockMode) {
    const news = JSON.parse(localStorage.getItem('grk_news'));
    const newItem = { id: 'n_' + Date.now(), date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), ...item };
    if (newItem.featured) {
      news.forEach(n => n.featured = false);
    }
    news.unshift(newItem);
    localStorage.setItem('grk_news', JSON.stringify(news));
    return newItem;
  }
  const docRef = await addDoc(collection(db, 'news'), item);
  return { id: docRef.id, ...item };
};

export const deleteNewsItem = async (id) => {
  if (mockMode) {
    let news = JSON.parse(localStorage.getItem('grk_news'));
    news = news.filter((item) => item.id !== id);
    localStorage.setItem('grk_news', JSON.stringify(news));
    return true;
  }
  await deleteDoc(doc(db, 'news', id));
  return true;
};

// --- COORDINATORS ---
export const getCoordinators = async () => {
  if (mockMode) {
    return JSON.parse(localStorage.getItem('grk_coordinators'));
  }
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, 'coordinators')), 1500);
    const coordinators = [];
    querySnapshot.forEach((doc) => coordinators.push({ id: doc.id, ...doc.data() }));
    return coordinators.length > 0 ? coordinators : initialCoordinators;
  } catch (error) {
    console.error('Firestore getCoordinators error:', error);
    return initialCoordinators;
  }
};

// --- DOWNLOADS ---
export const getDownloads = async () => {
  if (mockMode) {
    return JSON.parse(localStorage.getItem('grk_downloads'));
  }
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, 'downloads')), 1500);
    const downloads = [];
    querySnapshot.forEach((doc) => downloads.push({ id: doc.id, ...doc.data() }));
    return downloads.length > 0 ? downloads : initialDownloads;
  } catch (error) {
    console.error('Firestore getDownloads error:', error);
    return initialDownloads;
  }
};

export const addDownloadItem = async (item) => {
  if (mockMode) {
    const downloads = JSON.parse(localStorage.getItem('grk_downloads'));
    const newItem = { id: 'd_' + Date.now(), ...item };
    downloads.unshift(newItem);
    localStorage.setItem('grk_downloads', JSON.stringify(downloads));
    return newItem;
  }
  const docRef = await addDoc(collection(db, 'downloads'), item);
  return { id: docRef.id, ...item };
};

export const deleteDownloadItem = async (id) => {
  if (mockMode) {
    let downloads = JSON.parse(localStorage.getItem('grk_downloads'));
    downloads = downloads.filter((item) => item.id !== id);
    localStorage.setItem('grk_downloads', JSON.stringify(downloads));
    return true;
  }
  await deleteDoc(doc(db, 'downloads', id));
  return true;
};

// --- FAN CREATIONS ---
export const getFanCreations = async () => {
  if (mockMode) {
    return JSON.parse(localStorage.getItem('grk_fan_creations'));
  }
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, 'fan_creations')), 1500);
    const creations = [];
    querySnapshot.forEach((doc) => creations.push({ id: doc.id, ...doc.data() }));
    return creations.length > 0 ? creations : initialFanCreations;
  } catch (error) {
    console.error('Firestore getFanCreations error:', error);
    return initialFanCreations;
  }
};

export const addFanCreation = async (item) => {
  if (mockMode) {
    const creations = JSON.parse(localStorage.getItem('grk_fan_creations'));
    const newItem = { 
      id: 'fc_' + Date.now(), 
      likes: 0, 
      likedByUser: false, 
      date: 'Just now', 
      ...item 
    };
    creations.unshift(newItem);
    localStorage.setItem('grk_fan_creations', JSON.stringify(creations));
    return newItem;
  }
  const docRef = await addDoc(collection(db, 'fan_creations'), item);
  return { id: docRef.id, ...item };
};

export const likeFanCreation = async (id) => {
  if (mockMode) {
    const creations = JSON.parse(localStorage.getItem('grk_fan_creations'));
    const index = creations.findIndex((item) => item.id === id);
    if (index !== -1) {
      const item = creations[index];
      if (item.likedByUser) {
        item.likes = Math.max(0, item.likes - 1);
        item.likedByUser = false;
      } else {
        item.likes += 1;
        item.likedByUser = true;
      }
      localStorage.setItem('grk_fan_creations', JSON.stringify(creations));
      return item;
    }
    return null;
  }
  return null;
};

export const getRegistrations = async () => {
  if (mockMode) {
    return JSON.parse(localStorage.getItem('grk_registrations')) || [];
  }
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, 'registrations')), 2000);
    const registrations = [];
    querySnapshot.forEach((doc) => registrations.push({ id: doc.id, ...doc.data() }));
    
    // Merge database list with local storage entries to make sure all submitted items display
    const local = JSON.parse(localStorage.getItem('grk_registrations')) || [];
    const merged = [...registrations];
    local.forEach(l => {
      if (!merged.some(m => m.id === l.id)) {
        merged.unshift(l);
      }
    });
    
    return merged.length > 0 ? merged : initialRegistrations;
  } catch (error) {
    console.warn('Firestore getRegistrations failed. Falling back to LocalStorage entries...', error);
    return JSON.parse(localStorage.getItem('grk_registrations')) || initialRegistrations;
  }
};

export const getRegistrationByPhone = async (phone) => {
  const phoneClean = phone.trim();
  
  if (mockMode) {
    const registrations = JSON.parse(localStorage.getItem('grk_registrations')) || [];
    return registrations.find(r => r.phone === phoneClean) || null;
  }
  
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, 'registrations')), 2000);
    const registrations = [];
    querySnapshot.forEach((doc) => registrations.push({ id: doc.id, ...doc.data() }));
    
    // Check firestore docs first
    let found = registrations.find(r => r.phone === phoneClean);
    if (found) return found;
    
    // Check local storage fallback
    const local = JSON.parse(localStorage.getItem('grk_registrations')) || [];
    return local.find(r => r.phone === phoneClean) || null;
  } catch (err) {
    console.warn('Firebase query failed. Checking local fallback...', err);
    const local = JSON.parse(localStorage.getItem('grk_registrations')) || [];
    return local.find(r => r.phone === phoneClean) || null;
  }
};

export const addRegistration = async (reg) => {
  const regId = 'GRK-' + Math.floor(1000 + Math.random() * 9000);
  const formattedReg = {
    id: regId,
    ...reg,
    status: 'Pending',
    joinedDate: new Date().toISOString().split('T')[0]
  };

  // Always mirror in LocalStorage immediately
  const registrations = JSON.parse(localStorage.getItem('grk_registrations')) || [];
  registrations.unshift(formattedReg);
  localStorage.setItem('grk_registrations', JSON.stringify(registrations));

  if (mockMode) {
    return formattedReg;
  }
  
  try {
    // Try to write to firestore using registration ID as document path, with 2s timeout
    await withTimeout(setDoc(doc(db, 'registrations', regId), formattedReg), 2000);
    return formattedReg;
  } catch (firebaseErr) {
    console.warn('Firebase Firestore registration write failed. Handled via LocalStorage fallback.', firebaseErr);
    return formattedReg;
  }
};

export const updateRegistrationStatus = async (id, status) => {
  // Always update locally for fallback
  const registrations = JSON.parse(localStorage.getItem('grk_registrations')) || [];
  const index = registrations.findIndex((reg) => reg.id === id);
  let updatedObj = null;
  if (index !== -1) {
    registrations[index].status = status;
    localStorage.setItem('grk_registrations', JSON.stringify(registrations));
    updatedObj = registrations[index];
  }

  if (mockMode) {
    return updatedObj;
  }

  try {
    await withTimeout(updateDoc(doc(db, 'registrations', id), { status }), 2000);
    return updatedObj;
  } catch (firebaseErr) {
    console.warn('Firebase updateRegistrationStatus failed. Local update preserved.', firebaseErr);
    return updatedObj;
  }
};

export const deleteRegistration = async (id) => {
  // Always delete locally for fallback
  let registrations = JSON.parse(localStorage.getItem('grk_registrations')) || [];
  registrations = registrations.filter((reg) => reg.id !== id);
  localStorage.setItem('grk_registrations', JSON.stringify(registrations));

  if (mockMode) {
    return true;
  }

  try {
    await withTimeout(deleteDoc(doc(db, 'registrations', id)), 2000);
    return true;
  } catch (firebaseErr) {
    console.warn('Firebase deleteRegistration failed. Local delete preserved.', firebaseErr);
    return true;
  }
};

export const updateRegistrationPhoto = async (id, photo) => {
  // Always update locally for fallback
  const registrations = JSON.parse(localStorage.getItem('grk_registrations')) || [];
  const index = registrations.findIndex((reg) => reg.id === id);
  let updatedObj = null;
  if (index !== -1) {
    registrations[index].photo = photo;
    localStorage.setItem('grk_registrations', JSON.stringify(registrations));
    updatedObj = registrations[index];
  }

  if (mockMode) {
    return updatedObj;
  }

  try {
    await withTimeout(updateDoc(doc(db, 'registrations', id), { photo }), 2000);
    return updatedObj;
  } catch (firebaseErr) {
    console.warn('Firebase updateRegistrationPhoto failed. Local update preserved.', firebaseErr);
    return updatedObj;
  }
};

const TAMIL_NADU_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 
  'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 
  'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 
  'Thoothukudi', 'Trichy', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 
  'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
];

const getDistrictByEmailPrefix = (prefix) => {
  const cleanPrefix = prefix.toLowerCase().trim();
  
  // Backward compatibility legacy mappings
  if (cleanPrefix === 'gautham') return 'Madurai';
  if (cleanPrefix === 'suresh') return 'Chennai';
  if (cleanPrefix === 'karthik') return 'Coimbatore';
  if (cleanPrefix === 'raman') return 'Trichy';
  if (cleanPrefix === 'arun') return 'Salem';
  if (cleanPrefix === 'vijay') return 'Tirunelveli';
  
  // Match any of the 38 Tamil Nadu districts case-insensitively
  const found = TAMIL_NADU_DISTRICTS.find(d => d.toLowerCase() === cleanPrefix);
  return found || null;
};

// --- ADMIN AUTH ---
export const adminLogin = async (email, password) => {
  if (mockMode) {
    const emailClean = email.trim().toLowerCase();
    const passClean = password.trim();
    
    if (emailClean === 'admin@gauthamramkarthik.com' && passClean === 'password123') {
      const userObj = { email: 'admin@gauthamramkarthik.com', name: 'Super Admin', role: 'Super Admin' };
      localStorage.setItem('grk_admin_logged', 'true');
      localStorage.setItem('grk_admin_user', JSON.stringify(userObj));
      return userObj;
    }
    
    // Parse coordinator email: prefix@gauthamramkarthik.com
    const parts = emailClean.split('@');
    if (parts.length === 2 && parts[1] === 'gauthamramkarthik.com') {
      const prefix = parts[0];
      const matchedDistrict = getDistrictByEmailPrefix(prefix);
      if (matchedDistrict) {
        // Password format: prefix123 (e.g. salem123, suresh123)
        const expectedPassword = `${prefix}123`;
        if (passClean === expectedPassword) {
          const name = prefix.charAt(0).toUpperCase() + prefix.slice(1);
          const userObj = {
            email: emailClean,
            name: `${name} (${matchedDistrict} Coordinator)`,
            role: 'District Head',
            district: matchedDistrict
          };
          localStorage.setItem('grk_admin_logged', 'true');
          localStorage.setItem('grk_admin_user', JSON.stringify(userObj));
          return userObj;
        }
      }
    }
    
    throw new Error('Invalid email or password. Super Admin: admin@gauthamramkarthik.com / password123, or use your Coordinator account.');
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const emailLower = userCredential.user.email.toLowerCase();
    let role = 'Super Admin';
    let district = '';
    let name = 'Super Admin';
    
    const parts = emailLower.split('@');
    if (parts.length === 2 && parts[0] !== 'admin') {
      const prefix = parts[0];
      const matchedDistrict = getDistrictByEmailPrefix(prefix);
      if (matchedDistrict) {
        role = 'District Head';
        district = matchedDistrict;
        name = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      }
    }
    
    const userObj = { 
      email: userCredential.user.email, 
      name: role === 'Super Admin' ? 'Super Admin' : `${name} (${district} Coordinator)`, 
      role, 
      district 
    };
    
    localStorage.setItem('grk_admin_logged', 'true');
    localStorage.setItem('grk_admin_user', JSON.stringify(userObj));
    return userObj;
  } catch (firebaseErr) {
    console.warn('Firebase Login Error. Trying Local Auth Credentials Fallback...', firebaseErr);
    
    const emailClean = email.trim().toLowerCase();
    const passClean = password.trim();
    
    if (emailClean === 'admin@gauthamramkarthik.com' && passClean === 'password123') {
      const userObj = { email: 'admin@gauthamramkarthik.com', name: 'Super Admin', role: 'Super Admin' };
      localStorage.setItem('grk_admin_logged', 'true');
      localStorage.setItem('grk_admin_user', JSON.stringify(userObj));
      return userObj;
    }
    
    // Parse coordinator email: prefix@gauthamramkarthik.com
    const parts = emailClean.split('@');
    if (parts.length === 2 && parts[1] === 'gauthamramkarthik.com') {
      const prefix = parts[0];
      const matchedDistrict = getDistrictByEmailPrefix(prefix);
      if (matchedDistrict) {
        const expectedPassword = `${prefix}123`;
        if (passClean === expectedPassword) {
          const name = prefix.charAt(0).toUpperCase() + prefix.slice(1);
          const userObj = {
            email: emailClean,
            name: `${name} (${matchedDistrict} Coordinator)`,
            role: 'District Head',
            district: matchedDistrict
          };
          localStorage.setItem('grk_admin_logged', 'true');
          localStorage.setItem('grk_admin_user', JSON.stringify(userObj));
          return userObj;
        }
      }
    }
    
    throw firebaseErr;
  }
};

export const adminLogout = async () => {
  localStorage.setItem('grk_admin_logged', 'false');
  localStorage.removeItem('grk_admin_user');
  if (!mockMode) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase logout failed, session was cleaned locally.', e);
    }
  }
  return true;
};

export const getCurrentAdmin = (callback) => {
  const localAdmin = localStorage.getItem('grk_admin_user');
  const localLogged = localStorage.getItem('grk_admin_logged') === 'true';

  if (mockMode) {
    callback(localLogged && localAdmin ? JSON.parse(localAdmin) : null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      const emailLower = user.email.toLowerCase();
      let role = 'Super Admin';
      let district = '';
      let name = 'Super Admin';
      
      const parts = emailLower.split('@');
      if (parts.length === 2 && parts[0] !== 'admin') {
        const prefix = parts[0];
        const matchedDistrict = getDistrictByEmailPrefix(prefix);
        if (matchedDistrict) {
          role = 'District Head';
          district = matchedDistrict;
          name = prefix.charAt(0).toUpperCase() + prefix.slice(1);
        }
      }
      
      const userObj = { 
        email: user.email, 
        name: role === 'Super Admin' ? 'Super Admin' : `${name} (${district} Coordinator)`, 
        role, 
        district 
      };
      localStorage.setItem('grk_admin_logged', 'true');
      localStorage.setItem('grk_admin_user', JSON.stringify(userObj));
      callback(userObj);
    } else {
      if (localLogged && localAdmin) {
        callback(JSON.parse(localAdmin));
      } else {
        callback(null);
      }
    }
  });
};
