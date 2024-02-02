self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('brasileiros-hortifruti-fiscal-cache').then((cache) => {
      return cache.addAll([
        'index.html',
        'BHFiscalFont.ttf',
        'image/icon.svg',
        'styles.css',
        'script/jquery-3.6.4.min.js',
        'script/html2canvas.min.js',
        'script/qrcode.min.js',
        'script/paypix.js',
        'script/list.js',
        'script/main.js',
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
