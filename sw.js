const CACHE='ventas-v5';
const PAGE='./index.html';
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll([PAGE,
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
  ])));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys()
    .then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.mode==='navigate'||u.pathname.endsWith('index.html')||u.pathname.endsWith('/')){
    e.respondWith(fetch(e.request).then(res=>{
      caches.open(CACHE).then(c=>c.put(PAGE,res.clone()));
      return res;
    }).catch(()=>caches.match(PAGE)));
    return;
  }
  if(u.hostname.includes('cdn.jsdelivr.net')||u.hostname.includes('fonts.')){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      caches.open(CACHE).then(c=>c.put(e.request,res.clone()));
      return res;
    })));
  }
});
