const CACHE_NAME = 'sleep-solutions-cache-v1';
const urlsToCache = [
  'pwa.html',
  'styles.css',
  'app.js',
  'assets/data/products.json',
  'assets/images/sleep-solution-logo.png',
  'assets/images/sleep-solution-logo-secundario.png'
];


self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Precachéando recursos');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando caché antigua:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  console.log('[Service Worker] Interceptando solicitud para:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
