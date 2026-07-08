const GAUTHAM_PORTRAIT =
  'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/e/e0/Gautham_Karthik_at_Rangoon_Audio_Launch_%28cropped%29.jpg';
const MANJIMA_PORTRAIT =
  'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/a/a6/Manjima_Mohan.png';

export const initialMovies = [
  {
    id: 'm1',
    name: 'Mr. X',
    year: '2026',
    genre: 'Action',
    character: 'Agent (Co-lead with Arya)',
    poster: GAUTHAM_PORTRAIT,
    trailer: 'https://www.youtube.com/embed/nB5i_4Uq7xQ',
    rating: '8.7',
  },
  {
    id: 'm2',
    name: 'Bloody Politics',
    year: '2026',
    genre: 'Comedy',
    character: 'Ilaiyaraaja (Aspiring Politician)',
    poster: MANJIMA_PORTRAIT,
    trailer: 'https://www.youtube.com/embed/84qX_u47YqI',
    rating: '8.2',
  },
  {
    id: 'm3',
    name: 'Pathu Thala',
    year: '2023',
    genre: 'Action',
    character: 'Gunaseelan (Undercover Cop)',
    poster: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/en/f/fd/Pathu_Thala.jpg',
    trailer: 'https://www.youtube.com/embed/zHkZ75c7-vY',
    rating: '8.4',
  },
  {
    id: 'm4',
    name: 'August 16, 1947',
    year: '2023',
    genre: 'Drama',
    character: 'Paramasivam',
    poster: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/en/c/c5/August_16_1947_poster.jpg',
    trailer: 'https://www.youtube.com/embed/D3e2rW6JjWc',
    rating: '7.8',
  },
  {
    id: 'm5',
    name: 'Devarattam',
    year: '2019',
    genre: 'Action',
    character: 'Vetri',
    poster: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/en/1/12/Devarattam.jpg',
    trailer: 'https://www.youtube.com/embed/84qX_u47YqI',
    rating: '7.2',
  },
  {
    id: 'm6',
    name: 'Rangoon',
    year: '2017',
    genre: 'Drama',
    character: 'Venkat',
    poster: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/en/a/a3/Rangoon_2017.jpg',
    trailer: 'https://www.youtube.com/embed/7r1ZtOQk_G4',
    rating: '8.1',
  },
  {
    id: 'm7',
    name: 'Ivan Thanthiran',
    year: '2017',
    genre: 'Action',
    character: 'Shakti',
    poster: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/en/0/01/Ivan_Thanthiran_Poster.jpg',
    trailer: 'https://www.youtube.com/embed/hO2r6lHj21k',
    rating: '7.9',
  },
  {
    id: 'm8',
    name: 'Kadal',
    year: '2013',
    genre: 'Romance',
    character: 'Thomas',
    poster: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/en/3/3d/Kadal_2013_poster.jpg',
    trailer: 'https://www.youtube.com/embed/R5_7Wz_B3eA',
    rating: '8.0',
  },
];

export const initialGallery = [
  { id: 'g1', title: 'Gautham Ram Karthik — Portrait Shoot', category: 'Photoshoots', url: GAUTHAM_PORTRAIT },
  { id: 'g2', title: 'Manjima Mohan at Press Meet', category: 'Movie Stills', url: MANJIMA_PORTRAIT },
  { id: 'g3', title: 'Rangoon Audio Launch Event', category: 'Events', url: GAUTHAM_PORTRAIT },
  { id: 'g4', title: 'Annual General Fan Meetup', category: 'Fan Meetups', url: GAUTHAM_PORTRAIT },
  { id: 'g5', title: 'Devarattam Promo Still', category: 'Behind The Scenes', url: MANJIMA_PORTRAIT },
  { id: 'g6', title: 'Retro Portrait — Gautham Ram Karthik', category: 'Photoshoots', url: GAUTHAM_PORTRAIT },
];

export const initialVideos = [
  { id: 'v1', title: 'Mr. X Official Teaser | Arya, Gautham Ram Karthik', category: 'Trailers', url: 'https://www.youtube.com/embed/nB5i_4Uq7xQ', thumbnail: GAUTHAM_PORTRAIT },
  { id: 'v2', title: 'Gautham Ram Karthik Talks About Name Change & Legacy', category: 'Interviews', url: 'https://www.youtube.com/embed/nB5i_4Uq7xQ', thumbnail: GAUTHAM_PORTRAIT },
  { id: 'v3', title: 'Pathu Thala Gunaseelan BGM Riff — Fan Edit', category: 'Fan Edits', url: 'https://www.youtube.com/embed/zHkZ75c7-vY', thumbnail: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/en/f/fd/Pathu_Thala.jpg' },
  { id: 'v4', title: 'Gautham Ram Karthik Chennai Success Meet Highlights', category: 'Event Videos', url: 'https://www.youtube.com/embed/84qX_u47YqI', thumbnail: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/en/a/a3/Rangoon_2017.jpg' },
];

export const initialNews = [
  {
    id: 'n1',
    title: 'Gautham Ram Karthik\'s spy action thriller "Mr. X" hits screens worldwide!',
    summary: 'Co-starring alongside Arya, Gautham Ram Karthik delivers a gripping performance as an intelligence agent in the high-stakes spy thriller.',
    content: 'The highly anticipated action thriller "Mr. X" directed by Manu Anand has made a grand worldwide release. Co-starring Arya and Gautham Ram Karthik, the film has opened to rave reviews from critics and audiences alike. Critics praised Gautham\'s intense portrayal and high-energy stunt sequences.',
    date: 'April 18, 2026',
    image: GAUTHAM_PORTRAIT,
    featured: true,
  },
  {
    id: 'n2',
    title: 'Actor Gautham Karthik officially changes screen name to "Gautham Ram Karthik"',
    summary: 'The actor added "Ram" to his name as a tribute to his grandfather veteran actor R. Muthuraman and father Karthik.',
    content: 'Tamil actor Gautham Karthik has announced that he will henceforth be credited as "Gautham Ram Karthik" in all his upcoming cinematic ventures. The name change is a heartfelt tribute to his grandfather, the legendary R. Muthuraman, and his father, Navarasa Nayagan Karthik.',
    date: 'January 15, 2025',
    image: GAUTHAM_PORTRAIT,
    featured: false,
  },
  {
    id: 'n3',
    title: 'Wedding Bells: Gautham Ram Karthik ties the knot with Manjima Mohan',
    summary: 'The Devarattam co-stars married in a beautiful private ceremony in Chennai in November 2022.',
    content: 'Co-stars turned couple Gautham Ram Karthik and Manjima Mohan officially tied the knot in Chennai. The couple, who had shared screen space in the hit rural action drama "Devarattam", shared their official wedding photos expressing gratitude to fans for their endless love.',
    date: 'November 28, 2022',
    image: MANJIMA_PORTRAIT,
    featured: false,
  },
];

export const initialCoordinators = [
  { id: 'c1', name: 'Saravanan Pillai', position: 'State Coordinator', district: 'Tamil Nadu Central', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80' },
  { id: 'c2', name: 'Karthikeyan K.', position: 'District Coordinator', district: 'Chennai North', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop&q=80' },
  { id: 'c3', name: 'Manoj Kumar', position: 'District Coordinator', district: 'Madurai', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&fit=crop&q=80' },
  { id: 'c4', name: 'R. Vignesh', position: 'District Coordinator', district: 'Coimbatore', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80' },
];

export const initialDownloads = [
  { id: 'd1', title: 'Mr. X Official 4K Wallpaper', category: 'Wallpapers', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&fit=crop&q=80', size: '5.2 MB' },
  { id: 'd2', title: 'Gautham Ram Karthik Official DP Frame (Gold Edition)', category: 'DP Frames', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&fit=crop&q=80', size: '1.4 MB' },
  { id: 'd3', title: 'Pathu Thala Action Poster', category: 'HD Posters', url: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/en/f/fd/Pathu_Thala.jpg', size: '14.1 MB' },
];

export const initialFanCreations = [
  { id: 'fc1', user: 'Vignesh Artz', type: 'Fan Arts', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&fit=crop&q=80', likes: 185, likedByUser: false, date: '1 hour ago' },
  { id: 'fc2', user: 'Karthik Editor', type: 'Fan Posters', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&fit=crop&q=80', likes: 112, likedByUser: false, date: '12 hours ago' },
];

export const initialRegistrations = [
  {
    id: 'GRK-1092',
    name: 'Suresh Kumar',
    phone: '9876543210',
    dob: '1995-08-15',
    district: 'Chennai',
    city: 'T. Nagar',
    email: 'suresh.k@gmail.com',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&fit=crop&q=80',
    bloodGroup: 'B+',
    status: 'Approved',
    joinedDate: '2026-06-01',
  },
];

export const initialUpcoming = [
  {
    id: 'up1',
    title: 'Mr. X',
    releaseDate: '2026-04-18',
    poster: GAUTHAM_PORTRAIT,
    character: 'Agent (Co-lead)',
    description: 'A high-octane spy action thriller where Gautham Ram Karthik shares screen space with Arya. Packed with international espionage, breathtaking action sequences, and emotional depth.',
    genre: 'Action/Thriller',
  },
  {
    id: 'up2',
    title: 'Bloody Politics',
    releaseDate: '2026-06-15',
    poster: MANJIMA_PORTRAIT,
    character: 'Ilaiyaraaja',
    description: 'A dark political comedy about an aspiring politician caught in unexpected hilarious situations. Gautham Ram Karthik delivers a refreshingly comedic performance.',
    genre: 'Political Comedy',
  },
];

export const initialTimeline = [
  { year: '2013', title: 'Grand Debut — Kadal', desc: 'Debuted as the lead in legendary director Mani Ratnam\'s "Kadal". Won the Vijay Award for Best Debut Actor and Filmfare Award for Best Male Debut (South).' },
  { year: '2017', title: 'Dual Box Office Success — Rangoon & Ivan Thanthiran', desc: 'Won critical acclaim for the hard-hitting Burma repatriation drama "Rangoon" and recorded major commercial success in the techno-action comedy "Ivan Thanthiran".' },
  { year: '2019', title: 'Rural Mass Hero — Devarattam', desc: 'Starred in the rural family action block "Devarattam", marking a solid transition into a mass action hero and registering massive box office numbers.' },
  { year: '2022', title: 'Wedlock with Manjima Mohan', desc: 'Tied the knot with his Devarattam co-star and prominent Tamil/Malayalam actress Manjima Mohan in a private ceremony in Chennai in November 2022.' },
  { year: '2023', title: 'Action Powerhouse — Pathu Thala & August 16', desc: 'Co-starred in the massive action hit "Pathu Thala" alongside STR, and lead the historic period drama "August 16, 1947" which garnered national acclaim.' },
  { year: '2025', title: 'Official Name Update — Gautham Ram Karthik', desc: 'Formally transitioned his screen credit to "Gautham Ram Karthik" as a tribute to grandfather veteran actor R. Muthuraman and father Karthik.' },
  { year: '2026', title: 'Spy Action Blockbuster "Mr. X" & "Bloody Politics"', desc: 'Lead the high-budget spy thriller "Mr. X" with Arya and shot for political satire "Bloody Politics". Concurrently launched the official digital Gautham Ram Karthik Fan Club Portal.' },
];
