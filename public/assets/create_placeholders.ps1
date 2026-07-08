# PowerShell script to generate beautiful local SVG placeholders for Gautham Ram Karthik Fan Club

function Generate-Movie-Poster($name, $year, $genre, $filename) {
    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-$filename" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181818" />
      <stop offset="50%" stop-color="#0a0a0a" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3A8" />
      <stop offset="50%" stop-color="#FFD700" />
      <stop offset="100%" stop-color="#B8860B" />
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="400" height="600" fill="url(#bg-$filename)" />
  
  <!-- Subtle decorative grid -->
  <path d="M 0 100 L 400 100 M 0 200 L 400 200 M 0 300 L 400 300 M 0 400 L 400 400 M 0 500 L 400 500" stroke="#ffd700" stroke-width="0.5" opacity="0.05" />
  <path d="M 100 0 L 100 600 M 200 0 L 200 600 M 300 0 L 300 600" stroke="#ffd700" stroke-width="0.5" opacity="0.05" />

  <!-- Borders -->
  <rect x="15" y="15" width="370" height="570" fill="none" stroke="url(#gold-grad)" stroke-width="2" opacity="0.3" rx="4" />
  <rect x="22" y="22" width="356" height="556" fill="none" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" rx="2" />

  <!-- Film strip pattern at top and bottom -->
  <g opacity="0.15">
    <rect x="30" y="30" width="340" height="15" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="8 6" />
    <rect x="30" y="555" width="340" height="15" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="8 6" />
  </g>

  <!-- Top logo text -->
  <text x="200" y="65" font-family="'Montserrat', sans-serif" font-weight="800" font-size="11" fill="url(#gold-grad)" text-anchor="middle" letter-spacing="3">TEAM GRK PRESENTATION</text>

  <!-- Cinematic Graphic in Center -->
  <g transform="translate(200, 260)">
    <!-- Shield / Crest design -->
    <path d="M -50,-60 L 50,-60 L 40,0 L 0,40 L -40,0 Z" fill="none" stroke="url(#gold-grad)" stroke-width="1.5" opacity="0.25" />
    <!-- Giant letter -->
    <text x="0" y="12" font-family="'Montserrat', sans-serif" font-weight="900" font-size="64" fill="url(#gold-grad)" text-anchor="middle" opacity="0.12" letter-spacing="1">GRK</text>
    <!-- Gold Star -->
    <polygon points="0,-22 4,-10 16,-10 6,-3 10,9 0,2 -10,9 -6,-3 -16,-10 -4,-10" fill="url(#gold-grad)" opacity="0.8" />
  </g>

  <!-- Film Title & Info -->
  <rect x="40" y="380" width="320" height="120" fill="rgba(0,0,0,0.6)" rx="8" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
  
  <text x="200" y="415" font-family="'Montserrat', sans-serif" font-weight="800" font-size="22" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">$name</text>
  <text x="200" y="445" font-family="'Poppins', sans-serif" font-weight="600" font-size="12" fill="url(#gold-grad)" text-anchor="middle" letter-spacing="4">GAUTHAM RAM KARTHIK</text>
  <text x="200" y="475" font-family="'Poppins', sans-serif" font-weight="400" font-size="11" fill="#888888" text-anchor="middle" letter-spacing="1.5">$genre • $year • THEATRICAL RELEASE</text>

  <!-- Play icon overlay cue -->
  <circle cx="200" cy="525" r="22" fill="#E50914" opacity="0.85" />
  <polygon points="195,515 211,525 195,535" fill="#FFFFFF" />
</svg>
"@
    $svg | Out-File -FilePath "public/assets/movies/$filename" -Encoding utf8
}

function Generate-Gallery-Image($title, $category, $filename) {
    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-$filename" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1f1a10" />
      <stop offset="100%" stop-color="#0a0805" />
    </linearGradient>
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3A8" />
      <stop offset="100%" stop-color="#B8860B" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#bg-$filename)" />
  <rect x="15" y="15" width="570" height="370" fill="none" stroke="url(#gold-grad)" stroke-width="1.5" opacity="0.25" rx="5" />
  
  <!-- Modern camera grid/focus lines -->
  <path d="M 30 50 L 50 50 M 30 50 L 30 70" stroke="#FFD700" stroke-width="2" opacity="0.5" />
  <path d="M 570 50 L 550 50 M 570 50 L 570 70" stroke="#FFD700" stroke-width="2" opacity="0.5" />
  <path d="M 30 350 L 50 350 M 30 350 L 30 330" stroke="#FFD700" stroke-width="2" opacity="0.5" />
  <path d="M 570 350 L 550 350 M 570 350 L 570 330" stroke="#FFD700" stroke-width="2" opacity="0.5" />
  
  <!-- Central lens shape -->
  <circle cx="300" cy="180" r="65" fill="none" stroke="rgba(255, 215, 0, 0.15)" stroke-width="3" />
  <circle cx="300" cy="180" r="45" fill="none" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
  
  <text x="300" y="190" font-family="'Montserrat', sans-serif" font-weight="900" font-size="36" fill="url(#gold-grad)" text-anchor="middle" opacity="0.25">GRK</text>

  <!-- Title / details -->
  <rect x="0" y="300" width="600" height="100" fill="rgba(0,0,0,0.85)" />
  <text x="30" y="340" font-family="'Montserrat', sans-serif" font-weight="700" font-size="18" fill="#FFFFFF">$title</text>
  <text x="30" y="365" font-family="'Poppins', sans-serif" font-weight="600" font-size="11" fill="#FFD700" letter-spacing="2">$category</text>
  <text x="570" y="355" font-family="'Poppins', sans-serif" font-weight="400" font-size="10" fill="#666666" text-anchor="end">TEAM GRK ARCHIVE</text>
</svg>
"@
    $svg | Out-File -FilePath "public/assets/gallery/$filename" -Encoding utf8
}

function Generate-Coordinator($name, $role, $district, $filename) {
    $initials = ($name.Split(' ') | ForEach-Object { $_[0] }) -join ''
    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-$filename" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2c2c2c" />
      <stop offset="100%" stop-color="#111111" />
    </linearGradient>
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3A8" />
      <stop offset="100%" stop-color="#FFD700" />
    </linearGradient>
  </defs>
  <!-- Background circle -->
  <circle cx="100" cy="100" r="95" fill="url(#bg-$filename)" stroke="url(#gold-grad)" stroke-width="2" />
  <!-- Inner ring -->
  <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
  
  <!-- Initials text -->
  <text x="100" y="115" font-family="'Montserrat', sans-serif" font-weight="800" font-size="44" fill="url(#gold-grad)" text-anchor="middle" letter-spacing="1">$initials</text>
  
  <!-- Star symbol at bottom -->
  <polygon points="100,135 102,140 108,140 103,143 105,149 100,145 95,149 97,143 92,140 98,140" fill="#FFD700" opacity="0.8" />
</svg>
"@
    $svg | Out-File -FilePath "public/assets/coordinators/$filename" -Encoding utf8
}

function Generate-Video-Thumb($title, $category, $filename) {
    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-$filename" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a1a1a" />
      <stop offset="50%" stop-color="#0F0C08" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3A8" />
      <stop offset="100%" stop-color="#FFD700" />
    </linearGradient>
  </defs>
  <rect width="600" height="340" fill="url(#bg-$filename)" />
  <rect x="12" y="12" width="576" height="316" fill="none" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />

  <!-- Play button icon -->
  <circle cx="300" cy="150" r="35" fill="rgba(229, 9, 20, 0.9)" />
  <polygon points="292,135 315,150 292,165" fill="#FFFFFF" />
  
  <!-- Text Overlay -->
  <rect x="0" y="250" width="600" height="90" fill="rgba(0,0,0,0.8)" />
  <text x="25" y="282" font-family="'Montserrat', sans-serif" font-weight="700" font-size="15" fill="#FFFFFF">$title</text>
  <text x="25" y="308" font-family="'Poppins', sans-serif" font-weight="600" font-size="11" fill="url(#gold-grad)" letter-spacing="3">$category</text>
</svg>
"@
    $svg | Out-File -FilePath "public/assets/videos/$filename" -Encoding utf8
}

function Generate-News-Image($title, $filename) {
    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-$filename" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1f1f1f" />
      <stop offset="50%" stop-color="#0c0c0c" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3A8" />
      <stop offset="100%" stop-color="#FFD700" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bg-$filename)" />
  
  <!-- Newspaper-like decoration background -->
  <g opacity="0.03" stroke="#FFFFFF" stroke-width="1">
    <line x1="50" y1="100" x2="750" y2="100" />
    <line x1="50" y1="140" x2="750" y2="140" />
    <line x1="50" y1="180" x2="750" y2="180" />
    <line x1="50" y1="220" x2="750" y2="220" />
    <line x1="50" y1="260" x2="750" y2="260" />
    <line x1="50" y1="300" x2="750" y2="300" />
  </g>

  <!-- Logo text -->
  <text x="400" y="80" font-family="'Montserrat', sans-serif" font-weight="900" font-size="28" fill="url(#gold-grad)" text-anchor="middle" letter-spacing="8">TEAM GRK NEWS</text>
  <line x1="100" y1="110" x2="700" y2="110" stroke="url(#gold-grad)" stroke-width="1.5" opacity="0.5" />
  
  <!-- Headline -->
  <text x="400" y="240" font-family="'Montserrat', sans-serif" font-weight="800" font-size="20" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">OFFICIAL PRESS RELEASE</text>
  <circle cx="400" cy="300" r="10" fill="#E50914" />
</svg>
"@
    $svg | Out-File -FilePath "public/assets/news/$filename" -Encoding utf8
}

function Generate-Download-Item($title, $category, $filename) {
    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-$filename" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#141824" />
      <stop offset="100%" stop-color="#090b11" />
    </linearGradient>
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3A8" />
      <stop offset="100%" stop-color="#FFD700" />
    </linearGradient>
  </defs>
  <rect width="600" height="340" fill="url(#bg-$filename)" />
  <rect x="20" y="20" width="560" height="300" fill="none" stroke="url(#gold-grad)" stroke-width="1.5" opacity="0.3" rx="4" />
  
  <!-- Download symbol vector -->
  <path d="M 300 110 L 300 200 M 280 175 L 300 200 L 320 175 M 260 220 L 340 220" fill="none" stroke="#FFD700" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  
  <text x="300" y="75" font-family="'Montserrat', sans-serif" font-weight="800" font-size="12" fill="url(#gold-grad)" text-anchor="middle" letter-spacing="3">EXCLUSIVE ASSET</text>
  <text x="300" y="270" font-family="'Montserrat', sans-serif" font-weight="700" font-size="16" fill="#FFFFFF" text-anchor="middle">$title</text>
  <text x="300" y="295" font-family="'Poppins', sans-serif" font-weight="500" font-size="11" fill="#888888" text-anchor="middle" letter-spacing="2">$category</text>
</svg>
"@
    $svg | Out-File -FilePath "public/assets/downloads/$filename" -Encoding utf8
}

function Generate-Fan-Creation($user, $filename) {
    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-$filename" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1313" />
      <stop offset="100%" stop-color="#0a0505" />
    </linearGradient>
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3A8" />
      <stop offset="100%" stop-color="#FFD700" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg-$filename)" />
  <rect x="15" y="15" width="370" height="370" fill="none" stroke="url(#gold-grad)" stroke-width="1" opacity="0.25" rx="5" />
  
  <!-- Stylized paint brushes/stars to indicate art -->
  <g opacity="0.3">
    <path d="M 120 150 C 120 100, 280 100, 280 150 C 280 200, 120 200, 120 250" fill="none" stroke="#FFD700" stroke-width="2" />
    <circle cx="200" cy="200" r="50" fill="none" stroke="#FFFFFF" stroke-width="1" />
  </g>
  
  <text x="200" y="210" font-family="'Montserrat', sans-serif" font-weight="800" font-size="28" fill="url(#gold-grad)" text-anchor="middle" opacity="0.6">FAN ART</text>
  
  <rect x="0" y="320" width="400" height="80" fill="rgba(0,0,0,0.85)" />
  <text x="25" y="350" font-family="'Montserrat', sans-serif" font-weight="700" font-size="14" fill="#FFFFFF">By $user</text>
  <text x="25" y="372" font-family="'Poppins', sans-serif" font-weight="500" font-size="10" fill="#E50914" letter-spacing="1">TEAM GRK CREATIVE HUB</text>
</svg>
"@
    $svg | Out-File -FilePath "public/assets/fan_creations/$filename" -Encoding utf8
}

function Generate-Profile-Portrait($filename, $titleText) {
    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-$filename" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1F1C18" />
      <stop offset="50%" stop-color="#0D0B0A" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3A8" />
      <stop offset="50%" stop-color="#FFD700" />
      <stop offset="100%" stop-color="#B8860B" />
    </linearGradient>
  </defs>
  <rect width="500" height="650" fill="url(#bg-$filename)" />
  <rect x="20" y="20" width="460" height="610" fill="none" stroke="url(#gold-grad)" stroke-width="2.5" opacity="0.45" rx="6" />

  <!-- Shield vector -->
  <g transform="translate(250, 260)" opacity="0.3">
    <path d="M -90,-110 L 90,-110 L 70,20 L 0,110 L -70,20 Z" fill="none" stroke="url(#gold-grad)" stroke-width="3.5" />
    <text x="0" y="20" font-family="'Montserrat', sans-serif" font-weight="900" font-size="100" fill="url(#gold-grad)" text-anchor="middle">GRK</text>
  </g>
  
  <!-- Profile Vector elements -->
  <circle cx="250" cy="230" r="75" fill="none" stroke="url(#gold-grad)" stroke-width="2.5" />
  <!-- stylized silhouette bust -->
  <path d="M 180,360 C 180,300, 320,300, 320,360 L 350,420 L 150,420 Z" fill="none" stroke="url(#gold-grad)" stroke-width="2.5" />

  <text x="250" y="490" font-family="'Montserrat', sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">GAUTHAM RAM KARTHIK</text>
  <text x="250" y="525" font-family="'Poppins', sans-serif" font-weight="600" font-size="14" fill="url(#gold-grad)" text-anchor="middle" letter-spacing="5">TEAM GRK LEADER</text>
  
  <text x="250" y="580" font-family="'Poppins', sans-serif" font-weight="400" font-size="12" fill="#888888" text-anchor="middle" letter-spacing="1.5">$titleText</text>
</svg>
"@
    $svg | Out-File -FilePath "public/assets/profile/$filename" -Encoding utf8
}

# 1. MOVIE POSTERS
Generate-Movie-Poster "Mr. X" "2026" "Action" "mr_x.svg"
Generate-Movie-Poster "Bloody Politics" "2026" "Comedy" "bloody_politics.svg"
Generate-Movie-Poster "Pathu Thala" "2023" "Action" "pathu_thala.svg"
Generate-Movie-Poster "August 16, 1947" "2023" "Drama" "august_16_1947.svg"
Generate-Movie-Poster "Devarattam" "2019" "Action" "devarattam.svg"
Generate-Movie-Poster "Rangoon" "2017" "Drama" "rangoon.svg"
Generate-Movie-Poster "Ivan Thanthiran" "2017" "Action" "ivan_thanthiran.svg"
Generate-Movie-Poster "Kadal" "2013" "Romance" "kadal.svg"

# 2. GALLERY ITEMS
Generate-Gallery-Image "Gautham Ram Karthik - Portrait Shoot" "Photoshoots" "gallery_1.svg"
Generate-Gallery-Image "Manjima Mohan at Press Meet" "Movie Stills" "gallery_2.svg"
Generate-Gallery-Image "Rangoon Audio Launch Event" "Events" "gallery_3.svg"
Generate-Gallery-Image "Annual General Fan Meetup" "Fan Meetups" "gallery_4.svg"
Generate-Gallery-Image "Devarattam Promo Still" "Behind The Scenes" "gallery_5.svg"
Generate-Gallery-Image "Retro Portrait - Gautham Ram Karthik" "Photoshoots" "gallery_6.svg"

# 3. COORDINATORS
Generate-Coordinator "Saravanan Pillai" "State Coordinator" "Tamil Nadu Central" "c1.svg"
Generate-Coordinator "Karthikeyan K." "District Coordinator" "Chennai North" "c2.svg"
Generate-Coordinator "Manoj Kumar" "District Coordinator" "Madurai" "c3.svg"
Generate-Coordinator "R. Vignesh" "District Coordinator" "Coimbatore" "c4.svg"

# 4. VIDEOS
Generate-Video-Thumb "Mr. X Official Teaser | Arya, Gautham Ram Karthik" "Trailers" "teaser_1.svg"
Generate-Video-Thumb "Gautham Ram Karthik Talks About Name Change & Legacy" "Interviews" "interview_1.svg"
Generate-Video-Thumb "Pathu Thala Gunaseelan BGM Riff - Fan Edit" "Fan Edits" "fan_edit_1.svg"
Generate-Video-Thumb "Team GRK Chennai Success Meet Event Highlights" "Event Videos" "success_meet_1.svg"

# 5. NEWS
Generate-News-Image "Mr. X release announcement" "news_1.svg"
Generate-News-Image "Name change announcement" "news_2.svg"
Generate-News-Image "Wedding announcement" "news_3.svg"

# 6. DOWNLOADS
Generate-Download-Item "Mr. X Official 4K Wallpaper" "Wallpapers" "d1.svg"
Generate-Download-Item "Team GRK Official DP Frame (Gold Edition)" "DP Frames" "d2.svg"
Generate-Download-Item "Pathu Thala Action Poster" "HD Posters" "d3.svg"

# 7. FAN CREATIONS
Generate-Fan-Creation "Vignesh Artz" "fc1.svg"
Generate-Fan-Creation "Karthik Editor" "fc2.svg"

# 8. REGISTRATIONS
Generate-Coordinator "Suresh Kumar" "Member" "Chennai North" "r1.svg"

# 9. PROFILE DETAILS
Generate-Profile-Portrait "hero_bg.svg" "OFFICIAL HERO PROFILE"
Generate-Profile-Portrait "gautham_portrait.svg" "OFFICIAL BIO HEADSHOT"
Generate-Profile-Portrait "gautham_about.svg" "OFFICIAL ABOUT PORTFOLIO"

Write-Host "All premium placeholders generated successfully."
