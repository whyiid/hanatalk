const CACHE = 'hanatalk-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './data.js',
  './progress.js',
  './audio.js',
  './drill.js',
  './phrasebook.js',
  './settings.js',
  './app.js',
  './audio/manifest.js',
  './manifest.json',
  './icons/icon.svg'
];
// Individual audio clips are runtime-cached on first play (see fetch handler below),
// not precached — keeps the install step small as more content is added later.

// Runtime cache is allowed for same-origin requests PLUS Google Fonts. index.html loads
// the Korean display font (Noto Sans KR) + UI fonts cross-origin from these hosts; after
// one online visit their CSS + woff2 get cached so Korean text renders correctly offline.
const RUNTIME_ORIGINS = [
  self.location.origin,
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res && res.ok && RUNTIME_ORIGINS.some(o => e.request.url.startsWith(o))) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
