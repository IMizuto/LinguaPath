const CACHE_NAME = "study4-ielts-cache-v13";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./auth.js?v=13",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./vocab/index.html",
  "./vocab/vocab_data.js",
  "./grammar/index.html",
  "./grammar/grammar_data.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Chiến lược Network-First cho HTML/JS (để khi Admin cập nhật trên GitHub, máy người dùng tự nhận bản mới ngay),
// và rơi về Cache Offline khi mất mạng; Cache-First cho Media (Ảnh/Audio/PDF) để tải siêu nhanh & học Offline!
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isMedia = /\.(mp3|jpg|jpeg|png|gif|pdf|svg)$/i.test(url.pathname);
  if (isMedia) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((resp) => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return resp;
        });
      })
    );
  } else {
    event.respondWith(
      fetch(event.request)
        .then((resp) => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
