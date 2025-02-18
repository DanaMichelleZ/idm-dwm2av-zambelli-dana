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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
