// ====== PERSONALIZA AQUÍ ======
const CONFIG = {
  topTitle: 'La cancion de mi para ti, mi esposita',
  songTitle: 'Amor',
  artist: 'Emmanuel Cortes',
  totalPhotos: 39, // 001.jpg hasta 039.jpg
  totalVideos: 16, // 0001.mp4 hasta 0016.mp4
  secondsPerItem: 3,
  fadeDurationMs: 300,
  maxLyricsPerSide: 15
};
// ==============================

const lyricCues = [
  { start: 35.22, end: 37.78, text: "Mami, ere' lo que quiero" },
  { start: 37.78, end: 40.47, text: 'Cuando veo tu sonrisa', bold: true },
  { start: 40.47, end: 43.10, text: 'Y es lo que me debilita' },
  { start: 43.10, end: 46.75, text: 'Quiero llevarte a una cita' },
  { start: 46.75, end: 48.95, text: 'Yo te quiero enseñar todo' },
  { start: 48.93, end: 51.22, text: 'El amor que yo te tengo' },
  { start: 51.22, end: 53.60, text: 'Tan sencilla que tú eres', bold: true },
  { start: 53.60, end: 56.05, text: 'Para mí, tú eres perfecta', bold: true },
  { start: 56.05, end: 59.05, text: 'Yo te quiero amar' },
  { start: 59.05, end: 60.05, text: 'Te quiero enseñar' },
  { start: 60.05, end: 64.55, text: 'El amor y más' },
  { start: 64.55, end: 67.39, text: 'Y eres perfecta', bold: true },
  { start: 67.39, end: 69.77, text: 'Tu cuerpo hermoso', bold: true },
  { start: 69.77, end: 72.77, text: 'Que luce tan bello', bold: true },
  { start: 72.77, end: 80.96, text: 'Y esos ojitos, ni se diga más', bold: true },
  { start: 80.96, end: 81.31, text: 'Ni se diga más', bold: true },
  { start: 81.90, end: 99.22, text: '¡Ahí te va, chiquitita!', fadeAllAfter: 10 },
  { start: 99.22, end: 101.62, text: 'No quiero perder tus besos' },
  { start: 101.62, end: 104.29, text: 'Nuestra historia es un cuento' },
  { start: 104.29, end: 107.25, text: 'Mija, eres la que quiero' },
  { start: 107.25, end: 109.75, text: 'Tú eres mi gran deseo' },
  { start: 109.75, end: 112.58, text: 'Y yo te quiero enseñar todo' },
  { start: 112.58, end: 115.72, text: 'El amor que yo te tengo' },
  { start: 115.72, end: 117.62, text: 'Tan sencilla que tú eres', bold: true },
  { start: 117.62, end: 119.95, text: 'Para mí, tú eres perfecta', bold: true },
  { start: 119.95, end: 123.19, text: 'Yo te quiero amar' },
  { start: 123.19, end: 126.09, text: 'Te quiero enseñar' },
  { start: 126.09, end: 128.59, text: 'El amor y más' },
  { start: 128.59, end: 131.41, text: 'Tú eres perfecta', bold: true },
  { start: 131.41, end: 134.08, text: 'Tu cuerpo hermoso', bold: true },
  { start: 134.08, end: 136.71, text: 'Que luce tan bello', bold: true },
  { start: 136.71, end: 139.39, text: 'Y esos ojitos', bold: true },
  { start: 139.39, end: 144.55, text: 'Ni se diga más', bold: true },
  { start: 144.55, end: 152.15, text: 'Ni se diga más', bold: true },
  { start: 152.15, end: 155.15, text: '¡Hoy nomás!', fadeAllAfter: 10 }
];

const $ = id => document.getElementById(id);
const audio = $('audio'), playBtn = $('play'), video = $('video'), photo = $('photo'), heartScreen = $('heart-screen');
const lyricSides = [$('lyrics-left'), $('lyrics-right')];
const mediaFiles = [
  ...Array.from({ length: CONFIG.totalPhotos }, (_, i) => `./pics/${String(i + 1).padStart(3, '0')}.jpg`),
  ...Array.from({ length: CONFIG.totalVideos }, (_, i) => `./pics/${String(i + 1).padStart(4, '0')}.mp4`)
];
for (let i = mediaFiles.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [mediaFiles[i], mediaFiles[j]] = [mediaFiles[j], mediaFiles[i]];
}
let index = 0, timer = null, slideshowActive = false, videoRequest = 0;
let lyricCueIndex = 0, lyricSideIndex = 0, lastLyricTime = 0;
let lyricFadeTimer = null;

$('top-title').textContent = CONFIG.topTitle;
$('song-title').textContent = CONFIG.songTitle;
$('song-artist').textContent = CONFIG.artist;
document.title = CONFIG.songTitle + ' · ' + CONFIG.artist;

function scheduleNext(request) {
  if (request === videoRequest && slideshowActive) {
    timer = setTimeout(() => showMedia(index + 1), CONFIG.secondsPerItem * 1000);
  }
}
function showMedia(i) {
  if (!mediaFiles.length) return;
  index = (i + mediaFiles.length) % mediaFiles.length;
  const request = ++videoRequest;
  clearTimeout(timer);
  timer = null;
  const outgoing = !video.hidden ? video : !photo.hidden ? photo : null;
  if (outgoing) outgoing.style.opacity = '0';
  setTimeout(() => {
    if (request !== videoRequest || !slideshowActive) return;
    video.pause();
    video.hidden = true;
    photo.hidden = true;
    heartScreen.hidden = false;
    const src = mediaFiles[index];
    if (/\.(mp4|webm|ogg)$/i.test(src)) {
      video.dataset.request = String(request);
      video.src = src;
      video.load();
    } else {
      photo.dataset.request = String(request);
      photo.src = src;
    }
  }, outgoing ? CONFIG.fadeDurationMs : 0);
}
video.addEventListener('loadeddata', () => {
  const request = Number(video.dataset.request);
  if (request !== videoRequest || !slideshowActive) return;
  video.style.opacity = '0';
  video.hidden = false;
  heartScreen.hidden = true;
  video.currentTime = 0;
  requestAnimationFrame(() => {
    if (request === videoRequest) video.style.opacity = '1';
  });
  video.play().then(() => {
    scheduleNext(request);
  }).catch(() => {
    if (request === videoRequest) {
      video.hidden = true;
      heartScreen.hidden = false;
    }
  });
});
video.addEventListener('error', () => {
  if (Number(video.dataset.request) !== videoRequest) return;
  video.hidden = true;
  heartScreen.hidden = false;
  scheduleNext(videoRequest);
});
photo.addEventListener('load', () => {
  if (Number(photo.dataset.request) !== videoRequest || !slideshowActive) return;
  photo.style.opacity = '0';
  photo.hidden = false;
  heartScreen.hidden = true;
  requestAnimationFrame(() => {
    if (Number(photo.dataset.request) === videoRequest) photo.style.opacity = '1';
  });
  scheduleNext(videoRequest);
});
photo.addEventListener('error', () => {
  if (Number(photo.dataset.request) !== videoRequest) return;
  photo.hidden = true;
  heartScreen.hidden = false;
  scheduleNext(videoRequest);
});

function startSlideshow() {
  if (slideshowActive || !mediaFiles.length) return;
  slideshowActive = true;
  showMedia(index);
}
function fmt(s) { if (!isFinite(s)) return '0:00'; return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0'); }

function fadeLyric(element) {
  if (element.classList.contains('is-leaving')) return;
  element.classList.add('is-leaving');
  setTimeout(() => element.remove(), 650);
}
function fadeAllLyrics() {
  lyricSides.forEach(side => Array.from(side.children).forEach(fadeLyric));
}
function scatterLyric(element, side) {
  const maxX = Math.max(0, side.clientWidth - element.offsetWidth);
  const maxY = Math.max(0, side.clientHeight - element.offsetHeight);
  const others = Array.from(side.children).filter(other =>
    other !== element && !other.classList.contains('is-leaving')
  );
  let best = { x: 0, y: 0, score: Infinity };

  for (let attempt = 0; attempt < 60; attempt++) {
    const x = Math.random() * maxX, y = Math.random() * maxY;
    let score = 0;
    for (const other of others) {
      const overlapX = Math.max(0, Math.min(x + element.offsetWidth + 10, other.offsetLeft + other.offsetWidth + 10) - Math.max(x - 10, other.offsetLeft - 10));
      const overlapY = Math.max(0, Math.min(y + element.offsetHeight + 10, other.offsetTop + other.offsetHeight + 10) - Math.max(y - 10, other.offsetTop - 10));
      score += overlapX * overlapY;
    }
    if (score < best.score) best = { x, y, score };
    if (score === 0) break;
  }

  element.style.left = best.x + 'px';
  element.style.top = best.y + 'px';
}
function showLyric(cue, elapsed = 0) {
  const sideIndex = lyricSideIndex++ % lyricSides.length;
  const side = lyricSides[sideIndex];
  if (side.children.length >= CONFIG.maxLyricsPerSide) {
    const oldest = Array.from(side.children).find(element => !element.classList.contains('is-leaving'));
    if (oldest) fadeLyric(oldest);
  }

  const heart = document.createElement('div');
  heart.className = 'lyric-heart';
  heart.style.setProperty('--heart-scale', (0.65 + Math.random() * 0.85).toFixed(2));
  const baseFontSize = side.clientWidth <= 100 ? 0.72 : Math.min(1.05, 0.75 + side.clientWidth / 1500);
  heart.style.fontSize = (baseFontSize * (0.72 + Math.random() * 0.68)).toFixed(2) + 'rem';
  const text = document.createElement('span');
  if (cue.bold) text.classList.add('lyric-text-bold');
  text.textContent = cue.text;
  heart.appendChild(text);
  side.appendChild(heart);
  scatterLyric(heart, side);
  requestAnimationFrame(() => heart.classList.add('is-visible'));

  if (cue.fadeAllAfter !== undefined) {
    clearTimeout(lyricFadeTimer);
    const remaining = cue.fadeAllAfter - elapsed;
    if (remaining > 0) {
      lyricFadeTimer = setTimeout(() => {
        lyricFadeTimer = null;
        fadeAllLyrics();
      }, remaining * 1000);
    } else {
      fadeAllLyrics();
    }
  }
  if (cue.fadeAfter !== undefined) {
    const remaining = cue.fadeAfter - elapsed;
    if (remaining > 0) setTimeout(() => fadeLyric(heart), remaining * 1000);
    else fadeLyric(heart);
  }
}
function resetLyricsAt(time) {
  clearTimeout(lyricFadeTimer);
  lyricFadeTimer = null;
  lyricSides.forEach(side => { side.replaceChildren(); });
  lyricSideIndex = 0;
  lyricCueIndex = lyricCues.findIndex(cue => cue.start > time);
  if (lyricCueIndex === -1) lyricCueIndex = lyricCues.length;

  let lastFadedCue = -1;
  for (let i = 0; i < lyricCueIndex; i++) {
    const cue = lyricCues[i];
    if (cue.fadeAllAfter !== undefined && time >= cue.start + cue.fadeAllAfter) lastFadedCue = i;
  }
  const firstVisibleCue = Math.max(lastFadedCue + 1, lyricCueIndex - CONFIG.maxLyricsPerSide * lyricSides.length);
  for (let i = firstVisibleCue; i < lyricCueIndex; i++) {
    const cue = lyricCues[i], elapsed = time - cue.start;
    if ((cue.fadeAllAfter === undefined || elapsed < cue.fadeAllAfter) &&
      (cue.fadeAfter === undefined || elapsed < cue.fadeAfter)) showLyric(cue, elapsed);
  }
}
function updateLyrics() {
  const time = audio.currentTime;
  if (time < lastLyricTime - 0.5) resetLyricsAt(time);
  lastLyricTime = time;
  while (lyricCueIndex < lyricCues.length && lyricCues[lyricCueIndex].start <= time) {
    showLyric(lyricCues[lyricCueIndex]);
    lyricCueIndex++;
  }
}

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    if (audio.ended) {
      audio.currentTime = 0;
      index = 0;
    }
    audio.play().then(() => {
      playBtn.textContent = '⏸'; $('hint').style.opacity = 0; startSlideshow();
    }).catch(() => { $('hint').textContent = 'no se encontró audio.mp3'; });
  } else { audio.pause(); playBtn.textContent = '▶'; }
});
audio.addEventListener('ended', () => {
  audio.pause();
  slideshowActive = false;
  clearTimeout(timer);
  timer = null;
  video.pause();
  playBtn.textContent = '▶';
  playBtn.setAttribute('aria-label', 'Reproducir');
});
$('prev').addEventListener('click', () => { if (slideshowActive) showMedia(index - 1); });
$('next').addEventListener('click', () => { if (slideshowActive) showMedia(index + 1); });
$('back').addEventListener('click', () => { audio.currentTime = Math.max(0, audio.currentTime - 10); });
$('fwd').addEventListener('click', () => { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10); });

audio.addEventListener('loadedmetadata', () => { $('t-total').textContent = fmt(audio.duration); });
audio.addEventListener('timeupdate', () => {
  updateLyrics();
  $('t-now').textContent = fmt(audio.currentTime);
  $('fill').style.width = (audio.duration ? audio.currentTime / audio.duration * 100 : 0) + '%';
});
audio.addEventListener('seeking', () => {
  resetLyricsAt(audio.currentTime);
  lastLyricTime = audio.currentTime;
});
$('progress').addEventListener('click', e => {
  const r = e.currentTarget.getBoundingClientRect();
  if (audio.duration) audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
});

// ---- Pétalos y corazones cayendo (suave) ----
const canvas = $('petals'), ctx = canvas.getContext('2d');
let W, H, items = [];
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
addEventListener('resize', resize); resize();
const colors = ['#e8a5ab', '#d98a96', '#f3c6c6', '#c98b8b'];
function make(top) {
  return { x: Math.random() * W, y: top ? Math.random() * H : -20, s: 6 + Math.random() * 10,
    v: 0.4 + Math.random() * 0.8, sw: Math.random() * 6, a: Math.random() * 6.28,
    c: colors[Math.floor(Math.random() * colors.length)], heart: Math.random() < 0.25, o: 0.35 + Math.random() * 0.4 };
}
for (let i = 0; i < 26; i++) items.push(make(true));
function draw() {
  ctx.clearRect(0, 0, W, H);
  for (const p of items) {
    p.y += p.v; p.a += 0.02; p.x += Math.sin(p.a) * 0.6;
    if (p.y > H + 20) Object.assign(p, make(false));
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(p.a) * 0.8);
    ctx.globalAlpha = p.o; ctx.fillStyle = p.c;
    if (p.heart) { ctx.font = p.s * 1.6 + 'px serif'; ctx.fillText('♡', 0, 0); }
    else { ctx.beginPath(); ctx.ellipse(0, 0, p.s * 0.45, p.s * 0.8, 0, 0, 6.28); ctx.fill(); }
    ctx.restore();
  }
  if (!reduce) requestAnimationFrame(draw);
}
draw();
