const CACHE_NAME = 'mundial-2026-v2';
const urlsToCache = [
  './',
  './index.html',
  './logo_lab_26.png'
];

// Instalación: guarda los archivos en el celular
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

// Funcionamiento: Si hay internet, busca datos nuevos. Si no, usa los guardados.
self.addEventListener('fetch', event => {
  if (event.request.url.includes('docs.google') || event.request.url.includes('googleapis')) {
    event.respondWith(fetch(event.request)); // Siempre busca el Excel fresh
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request); // Si no hay internet, usa lo guardado
      })
    );
  }
});
