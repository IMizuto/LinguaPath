const CACHE_NAME = "linguapath-cache-v126";
const CORE_ASSETS = [
  "./index.html",
  "./assets/s4-ui.css",
  "./assets/s4-ui.js",
  "./assets/s4-search-engine.js",
  "./assets/s4-global-search.js",
  "./assets/s4-whisper.js",
  "./assets/s4-whisper-worker.js",
  "./assets/s4-core.wasm",
  "./assets/s4-audio-worker.js",
  "./auth.js",
  "./assets/s4-vocab-engine.js",
  "./assets/s4-practice-zone.js",
  "./assets/ghibli/ghibli-theme.css",
  "./assets/ghibli/ghibli-theme.js",
  "./assets/ghibli/ghibli_bg.jpg",
  "./assets/ghibli/ghibli_study_banner.jpg",
  "./assets/linguapath-sakura-icon.png",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./ielts/roadmap/index.html",
  "./ielts/roadmap/roadmap_data.js",
  "./ielts/roadmap/roadmap.js",
  "./ielts/foundation/index.html",
  "./ielts/foundation/foundation_data.js",
  "./ielts/vocab/index.html",
  "./ielts/grammar/index.html",
  "./ielts/listening/index.html",
  "./ielts/reading/index.html",
  "./ielts/writing/index.html",
  "./ielts/writing/writing.css",
  "./ielts/writing/writing_parser.js",
  "./ielts/writing/writing.js",
  "./ielts/writing/data/writing_manifest.js",
  "./ielts/speaking/index.html",
  "./ielts/speaking/speaking.css",
  "./ielts/speaking/speaking_parser.js",
  "./ielts/speaking/speaking.js",
  "./tedtalks/index.html",
  "./hsk/index.html",
  "./hsk/roadmap/index.html",
  "./hsk/roadmap/roadmap_data.js",
  "./hsk/roadmap/roadmap.js",
  "./hsk/hsk-tts.js",
  "./hsk/hanzi-writer.min.js",
  "./hsk/lessons/index.html",
  "./hsk/vocab/index.html",
  "./hsk/vocab/hsk-shooter.js",
  "./hsk/grammar/index.html",
  "./hsk/writing/index.html",
  "./hsk/listening/index.html",
  "./hsk/reading/index.html",
  "./hsk/speaking/index.html",
  "./hsk/mock/index.html"
];

function canonicalCacheKey(rawUrl) {
  const u = new URL(rawUrl, self.location.href);
  let pathname = u.pathname;
  if (pathname.endsWith("/")) {
    pathname += "index.html";
  }
  return u.origin + pathname;
}

async function matchCanonical(request) {
  const key = canonicalCacheKey(request.url);
  const direct = await caches.match(key);
  if (direct) return direct;

  const u = new URL(request.url);
  if (!u.pathname.endsWith("/") && !/\.[^/]+$/.test(u.pathname)) {
    const dirHit = await caches.match(u.origin + u.pathname + "/index.html");
    if (dirHit) return dirHit;
  }
  return caches.match(request, { ignoreSearch: true });
}

function storeCanonical(rawUrl, response) {
  if (!response || !response.ok || response.status !== 200) return;
  const clone = response.clone();
  const key = canonicalCacheKey(rawUrl);
  caches.open(CACHE_NAME)
    .then((cache) => cache.put(key, clone))
    .catch(() => {});
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        CORE_ASSETS.map((asset) =>
          fetch(asset, { cache: "no-cache" }).then((resp) => {
            if (resp && resp.ok && resp.status === 200) {
              return cache.put(canonicalCacheKey(asset), resp);
            }
          })
        )
      )
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
  // Không tự cache sw.js để trình duyệt luôn kiểm tra bản cập nhật Service Worker mới nhất
  if (url.pathname.endsWith("/sw.js")) return;
  // Request Range (phát audio/video, tua) để trình duyệt tự xử lý, không trả bản 200 đầy đủ từ cache
  if (event.request.headers && typeof event.request.headers.get === "function" && event.request.headers.get("range")) return;

  const isMedia = /\.(mp3|m4a|mp4|webm|jpg|jpeg|png|gif|webp|pdf|svg|woff2?)$/i.test(url.pathname);
  if (isMedia) {
    event.respondWith(
      matchCanonical(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((resp) => {
          storeCanonical(resp.url || event.request.url, resp);
          return resp;
        });
      })
    );
  } else {
    event.respondWith(
      fetch(event.request.url, { cache: "no-cache", redirect: "follow" })
        .then((resp) => {
          storeCanonical(resp.url || event.request.url, resp);
          if (resp.redirected && event.request.mode === "navigate" && resp.url) {
            try {
              const targetUrl = new URL(resp.url);
              if (targetUrl.origin === self.location.origin) {
                return Response.redirect(resp.url, 302);
              }
            } catch (e) {}
          }
          return resp;
        })
        .catch(() => matchCanonical(event.request))
    );
  }
});
