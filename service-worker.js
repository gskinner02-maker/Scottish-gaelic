const CACHE_NAME = "gaelic-verb-trainer-v3";  // ⭐ bump this every release

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json"
];

// Install: cache fresh files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // activate immediately
});

// Activate: delete old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // take control immediately
});

// Fetch: network-first for JS, cache-first for others
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // ⭐ Always fetch fresh JS
  if (url.pathname.endsWith("script.js")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Default: cache-first
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});


