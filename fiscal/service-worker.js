self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('brasileiros-hortifruti-fiscal-cache').then((cache) => {
      return cache.addAll([
        'index.html',
        'BHFiscalFont.ttf',
        'image/icon.svg',
        'style/main.css',
        'script/jquery-3.6.4.min.js',
        'script/html2canvas.min.js',
        'script/qrcode.min.js',
        'script/paypix.js',
        'script/list.js',
        'script/main.js',
        'font/BHicons/BHicons.woff2',
        'font/BHicons/BHicons.ttf',
        'font/BHicons/BHicons.svg',
        'font/UbuntuMono/1.woff2',
        'font/UbuntuMono/2.woff2',
        'font/UbuntuMono/3.woff2',
        'font/UbuntuMono/4.woff2',
        'font/UbuntuMono/5.woff2',
        'font/UbuntuMono/6.woff2',
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
