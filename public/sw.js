// Service Worker for TechFest 2K26 PWA
var CACHE_NAME = 'techfest2k26-v2';
var urlsToCache = [
    '/',
    '/index.html',
    '/css/navbar.css',
    '/css/index.css',
    '/css/footer.css',
    '/css/notice_box.css',
    '/js/navbar.js',
    '/js/footer.js',
    '/js/countdown.js',
    '/js/notice.js',
    '/images/TRIVIDYA2K26_LOGO.png'
];

// Install - cache core assets
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (name) {
                    return name !== CACHE_NAME;
                }).map(function (name) {
                    return caches.delete(name);
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch - serve from cache first, fallback to network
self.addEventListener('fetch', function (event) {
    // Skip non-GET and API requests
    if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            }
            return fetch(event.request).then(function (networkResponse) {
                // Cache new resources dynamically
                if (networkResponse && networkResponse.status === 200) {
                    var responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            });
        }).catch(function () {
            // Offline fallback
            if (event.request.destination === 'document') {
                return caches.match('/index.html');
            }
        })
    );
});
