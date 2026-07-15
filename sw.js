const CACHE='instara-ai-rc136-v1-wipe-only-button';
const CORE=[
  './','./index.html','./bitacora-de-trabajo.html','./fondo-app.webp','./manifest.webmanifest','./sw.js',
  './assets/leaflet/leaflet.css','./assets/leaflet/leaflet.js','./assets/maplibre/maplibre-gl.css','./assets/maplibre/maplibre-gl.js','./assets/sortable.min.js',
  './assets/leaflet/images/marker-icon.png','./assets/leaflet/images/marker-icon-2x.png','./assets/leaflet/images/marker-shadow.png'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const url=new URL(e.request.url);
  if(url.origin===location.origin && (e.request.mode==='navigate' || /\.(?:html|js|css|webmanifest)$/.test(url.pathname))){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return r;}).catch(()=>new Response('',{status:503,statusText:'Offline'}))));
});

self.addEventListener('notificationclick',e=>{e.notification.close();const target=e.notification.data?.url||'#hoy';e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{for(const c of list){if('focus' in c){c.navigate('./'+target);return c.focus();}}return clients.openWindow('./'+target);}));});
