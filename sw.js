// Tăng phiên bản khi thay đổi danh sách asset lõi hoặc chiến lược cache.
// Service Worker mới sẽ chờ người dùng xác nhận trước khi thay thế bản đang chạy.
const CACHE_NAME = "linguapath-cache-v91";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./assets/s4-ui.css?v=64",
  "./assets/s4-ui.js?v=63",
  "./assets/s4-whisper.js?v=4",
  "./assets/s4-whisper-worker.js?v=3",
  "./auth.js?v=31",
  "./assets/s4-vocab-engine.js?v=67",
  "./assets/s4-practice-zone.js?v=65",
  "./assets/ghibli/ghibli-theme.css?v=29",
  "./assets/ghibli/ghibli-theme.js?v=26",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./vocab/index.html",
  "./vocab/vocab_data.js",
  "./grammar/index.html",
  "./grammar/grammar_data.js",
  "./listening/index.html",
  "./listening/data/listening_manifest.js",
  "./reading/index.html",
  "./reading/data/reading_manifest.js",
  "./writing/index.html",
  "./writing/writing.css?v=9",
  "./writing/writing.js?v=10",
  "./writing/writing_parser.js?v=3",
  "./writing/writing_data.js?v=3",
  "./writing/data/writing_practice_zone.js?v=1",
  "./speaking/",
  "./speaking/index.html",
  "./speaking/speaking.css?v=8",
  "./speaking/speaking.js?v=18",
  "./speaking/speaking_parser.js?v=6",
  "./speaking/speaking_data.js?v=2",
  "./tedtalks/index.html",
  "./tedtalks/tedtalks_data.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(CORE_ASSETS.map((url) => cache.add(url)))
    ).catch(() => {})
  );
  // Không tự thay thế phiên bản đang chạy giữa lúc người dùng đang học.
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

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

// Chiến lược Network-First cho HTML/JS (để khi Admin cập nhật trên GitHub, máy người dùng tự nhận bản mới ngay),
// và rơi về Cache Offline khi mất mạng; Cache-First cho Media (Ảnh/Audio/PDF) để tải siêu nhanh & học Offline!
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isMedia = /\.(mp3|jpg|jpeg|png|gif|pdf|svg)$/i.test(url.pathname);
  if (isMedia) {
    event.respondWith((async () => {
      const cached = await caches.match(event.request, { ignoreSearch: true });
      const refresh = fetch(event.request).then((resp) => {
        if (resp && resp.ok) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resp.clone()));
        }
        return resp;
      }).catch(() => null);
      // Trả cache ngay để học offline/nhanh; âm thầm cập nhật media cho lần sau.
      if (cached) {
        event.waitUntil(refresh);
        return cached;
      }
      const fresh = await refresh;
      return fresh || Response.error();
    })());
  } else {
    event.respondWith(
      fetch(event.request.url, { cache: "no-cache", redirect: "follow" })
        .then((resp) => {
          if (resp && resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return resp;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true }))
    );
  }
});
