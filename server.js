const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = Number(process.env.PORT) || 8899;
const ALLOW_LAN = process.argv.includes('--lan') || process.env.ALLOW_LAN === '1';
const HOST = ALLOW_LAN ? '0.0.0.0' : '127.0.0.1';
const root = path.resolve(__dirname);

const COMPRESSIBLE_EXTS = new Set([
  '.html',
  '.js',
  '.css',
  '.json',
  '.svg',
  '.webmanifest',
  '.wasm'
]);
const GZIP_MIN_BYTES = 1024;

const BLOCKED_TOP_ENTRIES = new Set([
  'data_raw_backup',
  'node_modules',
  'rust-core',
  'server.js',
  'package.json',
  'package-lock.json',
  'firebase-database.rules.json'
]);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.wasm': 'application/wasm'
};

function isAllowedOrigin(origin) {
  if (!origin || typeof origin !== 'string') return false;
  try {
    const u = new URL(origin);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    if (u.hostname === '127.0.0.1' || u.hostname === 'localhost') return true;
    if (ALLOW_LAN && /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(u.hostname)) return true;
  } catch (e) {}
  return false;
}

function isBlockedPathname(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg.startsWith('.')) return true;
    if (i === 0 && BLOCKED_TOP_ENTRIES.has(seg.toLowerCase())) return true;
  }
  return false;
}

function appendVary(res, value) {
  const prev = res.getHeader('Vary');
  if (!prev) {
    res.setHeader('Vary', value);
    return;
  }
  const parts = String(prev).split(',').map((s) => s.trim()).filter(Boolean);
  if (!parts.some((p) => p.toLowerCase() === value.toLowerCase())) {
    parts.push(value);
    res.setHeader('Vary', parts.join(', '));
  }
}

function serveFile(req, res, filePath, stats) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const isCompressible = COMPRESSIBLE_EXTS.has(ext);
  res.setHeader('Content-Type', contentType);
  res.setHeader('Accept-Ranges', 'bytes');
  if (isCompressible) {
    appendVary(res, 'Accept-Encoding');
  }

  if (['.html', '.js', '.css', '.json', '.webmanifest', '.wasm'].includes(ext)) {
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  } else if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.mp3', '.m4a', '.mp4', '.webm', '.woff2'].includes(ext)) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }

  const totalSize = stats.size;
  const etag = `W/"${totalSize}-${Math.floor(stats.mtimeMs)}"`;
  res.setHeader('ETag', etag);

  if (req.headers['if-none-match'] === etag && !req.headers.range) {
    res.writeHead(304);
    res.end();
    return;
  }

  const range = req.headers.range;

  if (range && totalSize > 0) {
    const m = /^bytes=(\d*)-(\d*)$/i.exec(String(range).trim());
    let start = NaN;
    let end = NaN;
    if (m) {
      if (m[1] === '' && m[2] !== '') {
        const suffix = parseInt(m[2], 10);
        start = Math.max(0, totalSize - suffix);
        end = totalSize - 1;
      } else {
        start = parseInt(m[1], 10);
        end = m[2] !== '' ? Math.min(parseInt(m[2], 10), totalSize - 1) : totalSize - 1;
      }
    }

    if (isNaN(start) || isNaN(end) || start < 0 || start > end || start >= totalSize) {
      res.writeHead(416, {
        'Content-Range': `bytes */${totalSize}`
      });
      res.end();
      return;
    }

    const chunkSize = (end - start) + 1;
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${totalSize}`,
      'Content-Length': chunkSize
    });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath, { start, end });
    stream.on('error', () => {
      if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error');
    });
    res.on('close', () => {
      if (!stream.destroyed) stream.destroy();
    });
    stream.pipe(res);
  } else {
    const acceptEncoding = String(req.headers['accept-encoding'] || '');
    const isEncAccepted = (enc) => {
      const re = new RegExp(`(?:^|,)\\s*${enc}(?:\\s*;\\s*q=([0-9.]+))?\\s*(?:,|$)`, 'i');
      const m = re.exec(acceptEncoding);
      if (!m) return false;
      if (m[1] === undefined) return true;
      const q = parseFloat(m[1]);
      return Number.isFinite(q) && q > 0;
    };
    const canCompress = req.method === 'GET' && isCompressible && totalSize >= GZIP_MIN_BYTES;
    const useBrotli = canCompress && typeof zlib.createBrotliCompress === 'function' && isEncAccepted('br');
    const useGzip = canCompress && !useBrotli && isEncAccepted('gzip');

    if (useBrotli || useGzip) {
      res.setHeader('Content-Encoding', useBrotli ? 'br' : 'gzip');
      res.writeHead(200);

      const stream = fs.createReadStream(filePath);
      const compressor = useBrotli
        ? zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 } })
        : zlib.createGzip({ level: 6 });
      const handleErr = () => {
        if (!stream.destroyed) stream.destroy();
        if (!compressor.destroyed) compressor.destroy();
        if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain' });
        if (!res.writableEnded) res.end('Server Error');
      };
      stream.on('error', handleErr);
      compressor.on('error', handleErr);
      res.on('close', () => {
        if (!stream.destroyed) stream.destroy();
        if (!compressor.destroyed) compressor.destroy();
      });
      stream.pipe(compressor).pipe(res);
      return;
    }

    res.setHeader('Content-Length', totalSize);
    res.writeHead(200);

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error');
    });
    res.on('close', () => {
      if (!stream.destroyed) stream.destroy();
    });
    stream.pipe(res);
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return;
  }

  let parsedUrl;
  let pathname;
  try {
    parsedUrl = new URL(req.url, `http://127.0.0.1:${PORT}`);
    pathname = decodeURIComponent(parsedUrl.pathname);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  if (pathname.includes('\0') || pathname.includes('\\')) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  if (isBlockedPathname(pathname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  let filePath = path.resolve(root, '.' + pathname);
  const rel = path.relative(root, filePath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    if (stats.isDirectory()) {
      if (!pathname.endsWith('/')) {
        const redirectUrl = encodeURI(pathname) + '/' + (parsedUrl.search || '');
        res.writeHead(301, { 'Location': redirectUrl });
        res.end();
        return;
      }
      filePath = path.join(filePath, 'index.html');
      fs.stat(filePath, (indexErr, indexStats) => {
        if (indexErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Not Found');
          return;
        }
        serveFile(req, res, filePath, indexStats);
      });
      return;
    }

    serveFile(req, res, filePath, stats);
  });
});

server.listen(PORT, HOST, () => {
  const scope = ALLOW_LAN ? 'LAN (--lan)' : 'Localhost Only';
  console.log(`LinguaPath Local Server running at http://127.0.0.1:${PORT} (${scope})`);
});
