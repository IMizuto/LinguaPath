const CACHE_NAME = "linguapath-cache-v92";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./assets/s4-ui.css?v=66",
  "./assets/s4-ui.js?v=65",
  "./assets/s4-whisper.js?v=4",
  "./assets/s4-whisper-worker.js?v=3",
  "./auth.js?v=32",
  "./assets/s4-vocab-engine.js?v=68",
  "./assets/s4-practice-zone.js?v=67",
  "./assets/ghibli/ghibli-theme.css?v=30",
  "./assets/ghibli/ghibli-theme.js?v=26",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./vocab/index.html",
  "./vocab/vocab_data.js",
  "./grammar/index.html",
  "./listening/index.html",
  "./listening/data/listening_manifest.js",
  "./reading/index.html",
  "./reading/data/reading_manifest.js",
  "./writing/index.html",
  "./writing/writing.css?v=10",
  "./writing/writing.js?v=12",
  "./writing/writing_parser.js?v=4",
  "./speaking/",
  "./speaking/index.html",
  "./speaking/speaking.css?v=9",
  "./speaking/speaking.js?v=20",
  "./speaking/speaking_parser.js?v=7",
  "./tedtalks/index.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(CORE_ASSETS.map((url) => cache.add(url)))
    ).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== "transformers-cache" && !k.startsWith("lp-whisper-"))
          .map((k) => caches.delete(k))
      )
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
  // Request Range (phát audio/video, tua) để trình duyệt tự xử lý, không trả bản 200 đầy đủ từ cache
  if (event.request.headers && typeof event.request.headers.get === "function" && event.request.headers.get("range")) return;

  const isMedia = /\.(mp3|m4a|mp4|webm|jpg|jpeg|png|gif|webp|pdf|svg)$/i.test(url.pathname);
  if (isMedia) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((resp) => {
          if (resp && resp.ok && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, clone))
              .catch(() => {});
          }
          return resp;
        });
      })
    );
  } else {
    event.respondWith(
      fetch(event.request.url, { cache: "no-cache", redirect: "follow" })
        .then((resp) => {
          if (resp && resp.ok && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, clone))
              .catch(() => {});
          }
          return resp;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true }))
    );
  }
});
