/* Pebble service worker v2: offline app shell (precached), pictures cached on first view */
const VERSION = 'pebble-v2.0.0';
const SHELL_CACHE = VERSION + '-shell';
const IMG_CACHE = 'pebble-img-v1';            /* kept across app updates; images are content-addressed by activity id */
const SHELL = ['./','index.html','css/app.css?v=2.0.0','js/app.js?v=2.0.0','js/data.js?v=2.0.0','manifest.webmanifest','icons/favicon.svg','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== SHELL_CACHE && k !== IMG_CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.includes('/img/')) {           /* runtime cache-first for pictures */
    e.respondWith(caches.open(IMG_CACHE).then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      try { const res = await fetch(req); if (res && res.ok) c.put(req, res.clone()); return res; }
      catch (err) { return new Response('', {status: 504}); }
    }));
    return;
  }
  e.respondWith(caches.open(SHELL_CACHE).then(async cache => {
    const hit = await cache.match(req) || (req.mode === 'navigate' ? await cache.match('index.html') : null);
    const net = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
    return hit || (await net) || new Response('Offline', {status: 503, headers: {'Content-Type': 'text/plain'}});
  }));
});
