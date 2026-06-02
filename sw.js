const CACHE_NAME = 'mundial-2026-v3'; // Cambié a v3 para forzar la actualización

// INSTALACIÓN: Borra cachés viejas y guarda la nueva
self.addEventListener('install', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // ¡Borra la versión vieja!
          }
        })
      );
    }).then(() => {
      return caches.open(CACHE_NAME).then(cache => cache.addAll([
        './',
        './index.html',
        './logo_lab_26.png?v=2'
      ]));
    })
  );
});

// ACTIVACIÓN: Toma el control inmediatamente
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// FUNCIONAMIENTO: Siempre busca el Excel fresh, el resto usa caché si no hay internet
self.addEventListener('fetch', event => {
  if (event.request.url.includes('docs.google') || event.request.url.includes('googleapis')) {
    event.respondWith(fetch(event.request)); 
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request); 
      })
    );
  }
});
