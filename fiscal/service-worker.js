// service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('brasileiros-hortifruti-fiscal-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/icon.png',
        '/styles.css',
        '/list.js',
        '/scripts.js',
        '/editlist.html',
        '/editlist.png',
        '/favicon.ico',
        '/icons-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
