import { pool } from '../mysql';

// ─── MOVIES ──────────────────────────────────────────────────────
export async function getMovies() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM movies ORDER BY year DESC');
  return (rows as any[]).map(r => ({ ...r, featured: !!r.featured }));
}

export async function addMovie(item: any) {
  if (!pool) return null;
  const id = 'm_' + Date.now();
  await pool.query(
    'INSERT INTO movies (id, name, year, genre, `character`, poster, trailer, rating, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, item.name, item.year, item.genre, item.character, item.poster, item.trailer, item.rating, item.featured ? 1 : 0]
  );
  return { id, ...item };
}

export async function deleteMovie(id: string) {
  if (!pool) return;
  await pool.query('DELETE FROM movies WHERE id = ?', [id]);
}

export async function updateMovie(id: string, data: any) {
  if (!pool) return null;
  const keys = Object.keys(data);
  if (keys.length > 0) {
    const setClause = keys.map(k => `${k === 'character' ? '`character`' : k} = ?`).join(', ');
    const values = keys.map(k => k === 'featured' ? (data[k] ? 1 : 0) : data[k]);
    await pool.query(`UPDATE movies SET ${setClause} WHERE id = ?`, [...values, id]);
  }
  return { id, ...data };
}

// ─── UPCOMING RELEASES ───────────────────────────────────────────
export async function getUpcomingReleases() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM upcoming');
  return rows;
}

export async function addUpcomingRelease(item: any) {
  if (!pool) return null;
  const id = 'up_' + Date.now();
  await pool.query('INSERT INTO upcoming (id, title, releaseDate, image) VALUES (?, ?, ?, ?)', [id, item.title, item.releaseDate, item.image]);
  return { id, ...item };
}

export async function deleteUpcomingRelease(id: string) {
  if (!pool) return;
  await pool.query('DELETE FROM upcoming WHERE id = ?', [id]);
}

export async function updateUpcomingRelease(id: string, data: any) {
  if (!pool) return null;
  const keys = Object.keys(data);
  if (keys.length > 0) {
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => data[k]);
    await pool.query(`UPDATE upcoming SET ${setClause} WHERE id = ?`, [...values, id]);
  }
  return { id, ...data };
}

// ─── TIMELINE ────────────────────────────────────────────────────
export async function getTimeline() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM timeline ORDER BY year ASC');
  return rows;
}

export async function addTimelineItem(item: any) {
  if (!pool) return null;
  const id = 't_' + Date.now();
  await pool.query('INSERT INTO timeline (id, year, title, description) VALUES (?, ?, ?, ?)', [id, item.year, item.title, item.description]);
  return { id, ...item };
}

export async function deleteTimelineItem(id: string) {
  if (!pool) return;
  await pool.query('DELETE FROM timeline WHERE id = ?', [id]);
}

// ─── GALLERY ─────────────────────────────────────────────────────
export async function getGallery() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM gallery');
  return rows;
}

export async function addGalleryItem(item: any) {
  if (!pool) return null;
  const id = 'g_' + Date.now();
  await pool.query('INSERT INTO gallery (id, title, category, url) VALUES (?, ?, ?, ?)', [id, item.title, item.category, item.url]);
  return { id, ...item };
}

export async function deleteGalleryItem(id: string) {
  if (!pool) return;
  await pool.query('DELETE FROM gallery WHERE id = ?', [id]);
}

export async function updateGalleryItem(id: string, data: any) {
  if (!pool) return null;
  const keys = Object.keys(data);
  if (keys.length > 0) {
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => data[k]);
    await pool.query(`UPDATE gallery SET ${setClause} WHERE id = ?`, [...values, id]);
  }
  return { id, ...data };
}

// ─── VIDEOS ──────────────────────────────────────────────────────
export async function getVideos() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM videos');
  return rows;
}

export async function addVideoItem(item: any) {
  if (!pool) return null;
  const id = 'v_' + Date.now();
  await pool.query('INSERT INTO videos (id, title, category, url, thumbnail) VALUES (?, ?, ?, ?, ?)', [id, item.title, item.category, item.url, item.thumbnail || '']);
  return { id, ...item };
}

export async function deleteVideoItem(id: string) {
  if (!pool) return;
  await pool.query('DELETE FROM videos WHERE id = ?', [id]);
}

export async function updateVideoItem(id: string, data: any) {
  if (!pool) return null;
  const keys = Object.keys(data);
  if (keys.length > 0) {
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => data[k]);
    await pool.query(`UPDATE videos SET ${setClause} WHERE id = ?`, [...values, id]);
  }
  return { id, ...data };
}

// ─── NEWS ────────────────────────────────────────────────────────
export async function getNews() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM news ORDER BY date DESC');
  return (rows as any[]).map(r => ({ ...r, featured: !!r.featured }));
}

export async function addNewsItem(item: any) {
  if (!pool) return null;
  const id = 'n_' + Date.now();
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  if (item.featured) {
    await pool.query('UPDATE news SET featured = 0');
  }
  await pool.query(
    'INSERT INTO news (id, title, summary, content, date, image, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, item.title, item.summary, item.content, date, item.image, item.featured ? 1 : 0]
  );
  return { id, date, ...item };
}

export async function deleteNewsItem(id: string) {
  if (!pool) return;
  await pool.query('DELETE FROM news WHERE id = ?', [id]);
}

export async function updateNewsItem(id: string, data: any) {
  if (!pool) return null;
  if (data.featured) {
    await pool.query('UPDATE news SET featured = 0 WHERE id != ?', [id]);
  }
  const keys = Object.keys(data);
  if (keys.length > 0) {
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => k === 'featured' ? (data[k] ? 1 : 0) : data[k]);
    await pool.query(`UPDATE news SET ${setClause} WHERE id = ?`, [...values, id]);
  }
  return { id, ...data };
}

// ─── DOWNLOADS ───────────────────────────────────────────────────
export async function getDownloads() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM downloads');
  return rows;
}

export async function addDownloadItem(item: any) {
  if (!pool) return null;
  const id = 'd_' + Date.now();
  await pool.query('INSERT INTO downloads (id, title, category, url, size) VALUES (?, ?, ?, ?, ?)', [id, item.title, item.category, item.url, item.size || '']);
  return { id, ...item };
}

export async function deleteDownloadItem(id: string) {
  if (!pool) return;
  await pool.query('DELETE FROM downloads WHERE id = ?', [id]);
}

export async function updateDownloadItem(id: string, data: any) {
  if (!pool) return null;
  const keys = Object.keys(data);
  if (keys.length > 0) {
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => data[k]);
    await pool.query(`UPDATE downloads SET ${setClause} WHERE id = ?`, [...values, id]);
  }
  return { id, ...data };
}

// ─── REGISTRATIONS ───────────────────────────────────────────────
export async function getRegistrations() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM registrations ORDER BY joinedDate DESC');
  return rows;
}

export async function getRegistrationByPhone(phone: string) {
  if (!pool) return null;
  const [rows] = await pool.query('SELECT * FROM registrations WHERE phone = ?', [phone]);
  const list = rows as any[];
  return list.length > 0 ? list[0] : null;
}

export async function addRegistration(reg: any) {
  if (!pool) return null;
  
  let regId = reg.id;
  // If the incoming ID is a legacy random 4-digit ID or empty, generate the sequential 9-digit ID
  if (!regId || regId.length <= 8) {
    try {
      const [rows]: any = await pool.query('SELECT COUNT(*) as total FROM registrations');
      const nextNum = (rows[0]?.total || 0) + 1;
      regId = 'GRK-' + String(nextNum).padStart(9, '0');
    } catch (err) {
      console.error('Failed to query registrations count:', err);
      regId = 'GRK-' + String(Date.now()).substring(4, 13);
    }
  }

  const joinedDate = reg.joinedDate || new Date().toISOString().split('T')[0];
  await pool.query(
    'INSERT INTO registrations (id, name, phone, dob, district, city, email, photo, bloodGroup, status, joinedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [regId, reg.name, reg.phone, reg.dob, reg.district, reg.city, reg.email, reg.photo || '', reg.bloodGroup, reg.status || 'Pending', joinedDate]
  );
  return { id: regId, ...reg, status: reg.status || 'Pending', joinedDate };
}

export async function updateRegistrationStatus(id: string, status: string) {
  if (!pool) return null;
  await pool.query('UPDATE registrations SET status = ? WHERE id = ?', [status, id]);
  const [rows] = await pool.query('SELECT * FROM registrations WHERE id = ?', [id]);
  const list = rows as any[];
  return list.length > 0 ? list[0] : null;
}

export async function deleteRegistration(id: string) {
  if (!pool) return;
  await pool.query('DELETE FROM registrations WHERE id = ?', [id]);
}

export async function updateRegistrationPhoto(id: string, photo: string) {
  if (!pool) return null;
  await pool.query('UPDATE registrations SET photo = ? WHERE id = ?', [photo, id]);
  const [rows] = await pool.query('SELECT * FROM registrations WHERE id = ?', [id]);
  const list = rows as any[];
  return list.length > 0 ? list[0] : null;
}

// ─── DISTRICTS ───────────────────────────────────────────────────
export async function getDistricts() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM districts');
  return rows;
}

export async function addDistrict(item: any) {
  if (!pool) return null;
  const id = 'd_' + Date.now();
  await pool.query('INSERT INTO districts (id, districtName, groupLink, president, contactNumber, status) VALUES (?, ?, ?, ?, ?, ?)', [id, item.districtName, item.groupLink, item.president, item.contactNumber, item.status]);
  return { id, ...item };
}

export async function updateDistrict(id: string, item: any) {
  if (!pool) return;
  const keys = Object.keys(item);
  if (keys.length > 0) {
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => item[k]);
    await pool.query(`UPDATE districts SET ${setClause} WHERE id = ?`, [...values, id]);
  }
}

export async function deleteDistrict(id: string) {
  if (!pool) return;
  await pool.query('DELETE FROM districts WHERE id = ?', [id]);
}

// ─── WHATSAPP COMMUNICATIONS ──────────────────────────────────────
export async function createWhatsAppLog(log: any) {
  if (!pool) return null;
  await pool.query(
    'INSERT INTO whatsapp_logs (id, registrationId, status, sentTime, retryCount) VALUES (?, ?, ?, ?, ?)',
    [log.id, log.registrationId, log.status, log.sentTime, log.retryCount]
  );
  return log;
}

export async function updateWhatsAppLogStatus(logId: string, status: string, data?: any) {
  if (!pool) return;
  const keys = data ? Object.keys(data) : [];
  const setClause = ['status = ?', ...keys.map(k => `${k} = ?`)].join(', ');
  const values = [status, ...keys.map(k => data[k]), logId];
  await pool.query(`UPDATE whatsapp_logs SET ${setClause} WHERE id = ?`, values);
}

export async function getWhatsAppLogs() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM whatsapp_logs ORDER BY sentTime DESC');
  return rows;
}

// ─── NEWSLETTER ──────────────────────────────────────────────────
export async function subscribeNewsletter(email: string) {
  if (!pool) return { success: false };
  const [rows] = await pool.query('SELECT * FROM newsletter WHERE email = ?', [email]);
  if ((rows as any[]).length > 0) return { success: false, message: 'Already subscribed' };
  await pool.query('INSERT INTO newsletter (email, subscribedAt) VALUES (?, ?)', [email, new Date().toISOString()]);
  return { success: true, message: 'Subscribed to newsletter' };
}

export async function getNewsletterSubscribers() {
  if (!pool) return [];
  const [rows] = await pool.query('SELECT * FROM newsletter');
  return rows;
}

export async function removeNewsletterSubscriber(email: string) {
  if (!pool) return;
  await pool.query('DELETE FROM newsletter WHERE email = ?', [email]);
}
