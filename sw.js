/* Pebble service worker v2.3: offline app shell (precached), pictures cached on first view */
const VERSION = 'pebble-v2.3.0';
const SHELL_CACHE = VERSION + '-shell';
const IMG_CACHE = 'pebble-img-v1';            /* kept across app updates; images are content-addressed by activity id */
const V = '2.3.0';
const REDRAWN = ['pebble-sorting-on-the-beach','beach-pebble-tower'];   /* pictures redrawn in this version: drop their old cached copies */
const PLACEHOLDER = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450"><rect width="600" height="450" fill="#F3ECE4"/><ellipse cx="300" cy="235" rx="70" ry="52" fill="#ECE3D8"/></svg>';
const SHELL = ['./','index.html','css/app.css?v='+V,'js/app.js?v='+V,'js/data.js?v='+V,'manifest.webmanifest','icons/favicon.svg','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png'];
/* cache:'reload' skips the HTTP cache, so a new version never precaches an old copy of a file */
self.addEventListener('install', e => { e.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, {cache: 'reload'})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== SHELL_CACHE && k !== IMG_CACHE).map(k => caches.delete(k))))
  .then(() => caches.open(IMG_CACHE)).then(c => c.keys().then(reqs => Promise.all(reqs.filter(r => { const u = new URL(r.url); return !u.search && REDRAWN.some(id => u.pathname.endsWith('/img/' + id + '.webp')); }).map(r => c.delete(r)))))
  .catch(() => {}).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.endsWith('.apk')) return;      /* the Android app download always comes straight from the network, never cached */
  if (url.pathname.includes('/img/')) {           /* runtime cache-first for pictures */
    e.respondWith(caches.open(IMG_CACHE).then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      try { const res = await fetch(req); if (res && res.ok) c.put(req, res.clone()); return res; }
      catch (err) { return new Response(PLACEHOLDER, {status: 200, headers: {'Content-Type': 'image/svg+xml'}}); }   /* offline and not cached yet: a soft blank tile, not a broken image */
    }));
    return;
  }
  e.respondWith(caches.open(SHELL_CACHE).then(async cache => {
    const hit = await cache.match(req, {ignoreSearch: req.mode === 'navigate'}) || (req.mode === 'navigate' ? await cache.match('index.html') : null);
    const net = fetch(req).then(res => { if (res && res.ok && res.type === 'basic') cache.put(req, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || new Response('Offline', {status: 503, headers: {'Content-Type': 'text/plain'}});
  }));
});
