// v9 — the page itself is fetched fresh when online, so updates show up right away
const CACHE='stackfall-v9';
const FILES=['./','index.html','three.min.js','questions.js','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  const page=r.mode==='navigate'||r.url.endsWith('/index.html')||r.url.endsWith('/');
  if(page){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(h=>h||caches.match('index.html'))));return}
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{
    if(res.ok&&(r.url.startsWith(self.location.origin)||r.url.includes('fonts.g'))){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}
    return res})))});
