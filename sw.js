// Service Worker for Barans Spillverksted
const CACHE_NAME = 'spillverksted-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/main.css',
  '/css/game-selector.css',
  '/css/builder.css',
  '/css/play-mode.css',
  '/css/animations.css',
  '/js/app.js',
  '/js/game-selector.js',
  '/js/character-picker.js',
  '/js/builder/builder-core.js',
  '/js/builder/drag-drop.js',
  '/js/builder/drawing-tools.js',
  '/js/builder/block-palette.js',
  '/js/builder/canvas-manager.js',
  '/js/physics/physics-engine.js',
  '/js/physics/collision.js',
  '/js/physics/particles.js',
  '/js/utils/storage.js',
  '/js/utils/touch-handler.js',
  '/js/utils/sound-manager.js',
  '/js/utils/image-utils.js',
  '/js/data/blocks.js',
  '/js/data/characters.js',
  '/js/data/achievements.js'
];

// Install event - cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache install failed:', err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }

        return fetch(event.request).then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Return offline fallback if available
        return caches.match('/index.html');
      })
  );
});
