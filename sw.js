const CACHE_NAME = 'mundial-2026-v4'; // Lo cambiamos a v4 para que borre el viejo

self.addEventListener('install', event => {
  // Borra versiones viejas y guarda lo básico
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => { if (key !== CACHE_NAME) return caches.delete(key); }));
    }).then(() => {
      return caches.open(CACHE_NAME).then(cache => cache.addAll([
        './',
        './index.html',
        './logo_lab_26.png?v=2',
        './icono.png'
      ]));
    })
  );
});

self.addEventListener('activate', event => {
  // Toma control inmediato
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // 1. El Excel siempre fresco
  if (event.request.url.includes('docs.google') || event.request.url.includes('googleapis')) {
    return fetch(event.request); 
  }
  
  // 2. EL ARREGLO: El index.html SIEMPRE buscalo fresco en internet para no volver a atascar colores
  if (event.request.url.endsWith('index.html') || event.request.url.endsWith('/')) {
    return fetch(event.request).then(response => {
      // Lo guardamos en caché para el modo offline, pero primero mostramos el nuevo
      const responseClone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
      return response;
    }).catch(() => {
      // Si no hay internet, mostramos el que tenemos guardado
      return caches.match(event.request);
    });
  }
  
  // 3. El resto (logo, icono) usan caché normal
  return caches.match(event.request).then(response => {
    return response || fetch(event.request); 
  });
});
