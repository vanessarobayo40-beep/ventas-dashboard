const CACHE='ventas-v4';
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.add(
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
  )));
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
      .then(()=>self.clients.matchAll({includeUncontrolled:true,type:'window'}))
      .then(cs=>cs.forEach(c=>c.navigate(c.url)))
  );
});
self.addEventListener('fetch',e=>{
  if(!e.request.url.includes('cdn.jsdelivr.net'))return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    caches.open(CACHE).then(c=>c.put(e.request,res.clone()));
    return res;
  })));
});
