const CACHE_NAME = "linguapath-cache-v140";
const OFFLINE_CACHE = "linguapath-offline-packs-v1";
const WHISPER_CACHE = "lp-whisper-runtime-v1";
const CORE_ASSETS = [
  "./index.html",
  "./assets/s4-ui.css",
  "./assets/s4-ui.js",
  "./assets/s4-search-engine.js",
  "./assets/s4-global-search.js",
  "./assets/s4-lesson-search-data.js",
  "./assets/s4-offline.js",
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
  "./hsk/writing/radicals_214_data.js",
  "./ielts/reading/data/reading_practice_catalog.js",
  "./hsk/vocab/index.html",
  "./hsk/vocab/hsk-shooter.js",
  "./hsk/grammar/index.html",
  "./hsk/writing/index.html",
  "./hsk/listening/index.html",
  "./hsk/reading/index.html",
  "./hsk/speaking/index.html",
  "./hsk/mock/index.html",
  "./toeic/index.html",
  "./toeic/roadmap/index.html",
  "./toeic/roadmap/roadmap_data.js",
  "./toeic/roadmap/roadmap.js",
  "./toeic/vocab/index.html",
  "./toeic/vocab/data/vocab_manifest.js",
  "./toeic/grammar/index.html",
  "./toeic/listening/index.html",
  "./toeic/listening/data/listening_manifest.js",
  "./toeic/reading/index.html",
  "./toeic/reading/data/reading_manifest.js",
  "./toeic/mock/index.html",
  "./toeic/mock/data/mock_catalog.js",
  "./toeic/speaking-writing/index.html",
  "./toeic/speaking-writing/data/sw_manifest.js"
];

const OFFLINE_PACKS = {
  foundation: [
    "./ielts/foundation/index.html", "./ielts/foundation/foundation_data.js",
    "./ielts/listening/index.html", "./ielts/listening/data/listening_manifest.js",
    "./ielts/listening/data/listening_u_2.js",
    "./ielts/listening/listening_tactics_data.js",
    "./ielts/reading/reading_tactics_data.js",
    "./ielts/vocab/vocab_collocations.js",
    "./ielts/grammar/grammar_explanations.js",
    "./ielts/writing/data/writing_toolkit_data.js"
  ],
  hsk: [
    "./hsk/lessons/index.html", "./hsk/lessons/lessons_data.js", "./hsk/lessons/lessons-slides-workbook.js",
    "./hsk/vocab/vocab_examples_vi.js",
    "./hsk/speaking/index.html", "./hsk/speaking/speaking_data.js", "./hsk/hsk-tts.js",
    "./hsk/mock/index.html", "./hsk/mock/mock_data.js",
    "./hsk/mock/mock_full_13.js", "./hsk/mock/mock_full_13_p2.js",
    "./hsk/mock/mock_full_46.js", "./hsk/mock/mock_full_46_p2.js",
    "./hsk/mock/mock_hskk_data.js", "./hsk/mock/mock_hskk_p2.js"
  ],
  speaking: [
    "./ielts/speaking/index.html", "./ielts/speaking/speaking_data.js", "./ielts/speaking/speaking_toolkit_data.js",
    "./ielts/speaking/speaking.js", "./ielts/speaking/speaking_parser.js", "./ielts/speaking/speaking.css"
  ],
  ted: ["./tedtalks/index.html", "./tedtalks/tedtalks_data.js"],
  toeic: [
    "./toeic/index.html",
    "./toeic/roadmap/index.html", "./toeic/roadmap/roadmap_data.js", "./toeic/roadmap/roadmap.js",
    "./toeic/vocab/index.html", "./toeic/vocab/data/vocab_manifest.js",
    "./toeic/vocab/data/vocab_u_1.js", "./toeic/vocab/data/vocab_u_2.js",
    "./toeic/vocab/data/vocab_u_3.js", "./toeic/vocab/data/vocab_u_4.js",
    "./toeic/grammar/index.html", "./toeic/grammar/data/grammar_part1.js",
    "./toeic/grammar/data/grammar_part2.js", "./toeic/grammar/data/grammar_cheatsheets.js",
    "./toeic/listening/index.html", "./toeic/listening/data/listening_manifest.js",
    "./toeic/reading/index.html", "./toeic/reading/data/reading_manifest.js",
    "./toeic/mock/index.html", "./toeic/mock/data/mock_catalog.js",
    "./toeic/speaking-writing/index.html", "./toeic/speaking-writing/data/sw_manifest.js"
  ]
};

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
          .filter((k) => k !== CACHE_NAME && k !== OFFLINE_CACHE && k !== "transformers-cache" && !k.startsWith("lp-whisper-"))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

function whisperRuntimeUrl(url) {
  return ((url.hostname === "cdn.jsdelivr.net" && url.pathname.startsWith("/npm/@xenova/transformers@2.17.2/dist/"))
    || (url.hostname === "unpkg.com" && url.pathname.startsWith("/@xenova/transformers@2.17.2/dist/"))
    || (url.hostname === "huggingface.co" && url.pathname.startsWith("/Xenova/whisper-tiny.en/resolve/")));
}

function assetPaths(pack) {
  if (Object.prototype.hasOwnProperty.call(OFFLINE_PACKS, pack)) return OFFLINE_PACKS[pack];
  const reading = /^reading:(\d+)$/.exec(pack);
  if (reading) {
    return ["./ielts/reading/index.html", "./ielts/reading/data/reading_practice_catalog.js",
      "./ielts/reading/data/reading_manifest.js",
      "./ielts/reading/data/practice-tests/" + reading[1] + ".json"];
  }
  const toeicTest = /^toeic-test:(tm_(?:mini|full)_\d{2})$/.exec(pack);
  if (toeicTest) {
    return ["./toeic/mock/index.html", "./toeic/mock/data/mock_catalog.js",
      "./toeic/mock/data/tests/" + toeicTest[1] + ".json"];
  }
  return [];
}

self.addEventListener("message", event => {
  const message = event.data;
  const port = event.ports[0];
  if (!port || !message || typeof message.pack !== "string"
      || !["lp-download-offline", "lp-status-offline"].includes(message.type)) return;
  const files = assetPaths(message.pack);
  if (!files.length) return port.postMessage({ error: "Gói tài liệu không tồn tại." });

  event.waitUntil(caches.open(OFFLINE_CACHE).then(async cache => {
    if (message.type === "lp-status-offline") {
      const matches = await Promise.all(files.map(path => cache.match(canonicalCacheKey(path))));
      port.postMessage({ ready: matches.every(Boolean) });
      return;
    }
    let done = 0;
    for (const path of files) {
      const url = canonicalCacheKey(path);
      const response = await fetch(url, { cache: "no-cache" });
      if (!response.ok || response.status !== 200) throw new Error("Không tải được " + path);
      await cache.put(url, response);
      port.postMessage({ done: ++done, total: files.length });
    }
    port.postMessage({ ready: true });
  }).catch(error => port.postMessage({ error: error.message || "Không thể tải gói ngoại tuyến." })));
});

async function mediaRange(request, range) {
  const parsed = /^bytes=(\d*)-(\d*)$/i.exec(range.trim());
  if (!parsed || (!parsed[1] && !parsed[2])) return fetch(request);
  const cached = await matchCanonical(request);
  if (!cached || cached.status !== 200) return fetch(request);
  const audio = await cached.blob();
  const size = audio.size;
  const start = parsed[1] ? Number(parsed[1]) : Math.max(0, size - Number(parsed[2]));
  const end = parsed[1] && parsed[2] ? Math.min(size - 1, Number(parsed[2])) : size - 1;
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + size } });
  }
  return new Response(audio.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": cached.headers.get("Content-Type") || "application/octet-stream",
      "Content-Range": "bytes " + start + "-" + end + "/" + size,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes"
    }
  });
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    if (request.headers.has("range") || !whisperRuntimeUrl(url)) return;
    event.respondWith(caches.open(WHISPER_CACHE).then(async cache => {
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok && response.status === 200) await cache.put(request, response.clone()).catch(() => {});
      return response;
    }));
    return;
  }
  if (url.pathname.endsWith("/sw.js")) return;
  const range = request.headers.get("range");
  if (range) {
    event.respondWith(mediaRange(request, range));
    return;
  }

  const isMedia = /\.(mp3|m4a|mp4|webm|jpg|jpeg|png|avif|webp|pdf|svg|woff2?)$/i.test(url.pathname);
  const fetchAndStore = async () => {
    const response = await fetch(request, { cache: "no-cache", redirect: "follow" });
    storeCanonical(response.url || request.url, response);
    if (response.redirected && request.mode === "navigate" && response.url !== request.url) {
      const targetUrl = new URL(response.url);
      if (targetUrl.origin === self.location.origin) return Response.redirect(response.url, 302);
    }
    return response;
  };
  const downloaded = caches.open(OFFLINE_CACHE).then(cache => cache.match(canonicalCacheKey(request.url)));
  const refresh = downloaded.then(async cached => {
    if (!cached) return;
    try {
      const updated = await fetch(request, { cache: "no-cache", redirect: "follow" });
      if (updated.ok && updated.status === 200) {
        const cache = await caches.open(OFFLINE_CACHE);
        const core = await caches.open(CACHE_NAME);
        const key = canonicalCacheKey(request.url);
        await Promise.all([cache.put(key, updated.clone()), core.put(key, updated)]);
      }
    } catch (error) {}
  }).catch(() => {});
  event.waitUntil(refresh);
  event.respondWith(downloaded.then(async cached => {
    if (cached) {
      // Prefer the current app shell after an update while retaining downloaded lesson data.
      const core = await caches.open(CACHE_NAME);
      return await core.match(canonicalCacheKey(request.url)) || cached;
    }
    if (isMedia) return await matchCanonical(request) || fetchAndStore();
    try { return await fetchAndStore(); }
    catch (error) {
      return await matchCanonical(request) || Response.error();
    }
  }));
});
