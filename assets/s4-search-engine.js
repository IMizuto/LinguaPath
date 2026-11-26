/* LinguaPath Instant Search Engine (WebAssembly s4-core.wasm + Prefix/CJK Index + Multi-lingual Fuzzy Matching) */
(function (globalScope) {
  'use strict';

  var scriptSrc = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src)
    ? document.currentScript.src
    : '';

  function resolveWasmUrl() {
    if (scriptSrc) {
      try { return new URL('s4-core.wasm?v=1', scriptSrc).href; } catch (e) {}
    }
    var p = (typeof location !== 'undefined' && location.pathname) ? location.pathname.replace(/\\/g, '/') : '';
    var parts = p.split('/').filter(Boolean);
    var dirParts = (parts.length && parts[parts.length - 1].indexOf('.') !== -1)
      ? parts.slice(0, -1)
      : parts;
    var rootIdx = Math.max(
      dirParts.lastIndexOf('ielts'),
      dirParts.lastIndexOf('hsk'),
      dirParts.lastIndexOf('toeic')
    );
    if (rootIdx !== -1) {
      var depth = dirParts.length - rootIdx;
      return (depth >= 2 ? '../../assets/' : '../assets/') + 's4-core.wasm?v=1';
    }
    var subIdx = Math.max(
      dirParts.lastIndexOf('tedtalks'),
      dirParts.lastIndexOf('speaking')
    );
    if (subIdx !== -1) {
      var depth2 = dirParts.length - subIdx;
      return (depth2 >= 2 ? '../../assets/' : '../assets/') + 's4-core.wasm?v=1';
    }
    return 'assets/s4-core.wasm?v=1';
  }

  var wasmExports = null;
  var wasmInitPromise = null;

  function isWasmReady() {
    return Boolean(
      wasmExports
      && typeof wasmExports.wasm_reset_heap === 'function'
      && typeof wasmExports.wasm_alloc === 'function'
      && typeof wasmExports.wasm_fuzzy_token_score === 'function'
    );
  }

  function initWasm(urlOrExports) {
    if (urlOrExports && typeof urlOrExports === 'object' && typeof urlOrExports.wasm_fuzzy_token_score === 'function') {
      wasmExports = urlOrExports;
      wasmInitPromise = Promise.resolve(wasmExports);
      return wasmInitPromise;
    }
    if (isWasmReady()) {
      return Promise.resolve(wasmExports);
    }
    if (wasmInitPromise) return wasmInitPromise;

    var targetUrl = (typeof urlOrExports === 'string' && urlOrExports.trim()) ? urlOrExports.trim() : resolveWasmUrl();
    wasmInitPromise = (async function () {
      if (typeof WebAssembly !== 'object' || typeof fetch !== 'function') {
        return null;
      }
      var resp = await fetch(targetUrl);
      if (!resp || !resp.ok) return null;
      if (typeof WebAssembly.instantiateStreaming === 'function') {
        try {
          var ct = resp.headers && resp.headers.get ? String(resp.headers.get('content-type') || '') : '';
          if (/application\/wasm/i.test(ct)) {
            var streamed = await WebAssembly.instantiateStreaming(resp.clone());
            wasmExports = streamed.instance.exports;
            return wasmExports;
          }
        } catch (e) {
          // Giữ nguyên resp gốc nhờ resp.clone(), fallback thẳng xuống arrayBuffer()
        }
      }
      var buf = await resp.arrayBuffer();
      var inst = await WebAssembly.instantiate(buf);
      wasmExports = inst.instance.exports;
      return wasmExports;
    })().catch(function () {
      wasmInitPromise = null;
      return null;
    });

    return wasmInitPromise;
  }

  function withWasmPair(strA, strB, fn, fallbackFn) {
    if (!isWasmReady()) return fallbackFn();
    var a = String(strA || '');
    var b = String(strB || '');
    var ex = wasmExports;
    try {
      ex.wasm_reset_heap();
      var ptrA = ex.wasm_alloc(Math.max(2, a.length * 2));
      var ptrB = ex.wasm_alloc(Math.max(2, b.length * 2));
      if (!ptrA || !ptrB) return fallbackFn();
      var buf = ex.memory.buffer;
      var viewA = new Uint16Array(buf, ptrA, a.length);
      for (var i = 0; i < a.length; i++) viewA[i] = a.charCodeAt(i);
      var viewB = new Uint16Array(buf, ptrB, b.length);
      for (var j = 0; j < b.length; j++) viewB[j] = b.charCodeAt(j);
      return fn(ex, ptrA, a.length, ptrB, b.length);
    } catch (e) {
      return fallbackFn();
    }
  }

  var sharedLevDp = new Int32Array(128);

  function levenshteinJs(a, b) {
    var m = a.length;
    var n = b.length;
    if (!m) return n;
    if (!n) return m;
    if (m < n) {
      var tmp = a; a = b; b = tmp;
      var tm = m; m = n; n = tm;
    }
    var dp = n < 128 ? sharedLevDp : new Int32Array(n + 1);
    for (var j = 0; j <= n; j++) dp[j] = j;
    for (var i = 1; i <= m; i++) {
      var prev = dp[0];
      dp[0] = i;
      var ca = a.charCodeAt(i - 1);
      for (var k = 1; k <= n; k++) {
        var old = dp[k];
        var cost = ca === b.charCodeAt(k - 1) ? 0 : 1;
        var del = old + 1;
        var ins = dp[k - 1] + 1;
        var sub = prev + cost;
        dp[k] = del < ins ? (del < sub ? del : sub) : (ins < sub ? ins : sub);
        prev = old;
      }
    }
    return dp[n];
  }

  function lcsJs(a, b) {
    var m = a.length;
    var n = b.length;
    if (!m || !n) return 0;
    if (m < n) {
      var tmp = a; a = b; b = tmp;
      var tm = m; m = n; n = tm;
    }
    var dp = new Int32Array(n + 1);
    for (var i = 1; i <= m; i++) {
      var prev = 0;
      var ca = a.charCodeAt(i - 1);
      for (var j = 1; j <= n; j++) {
        var old = dp[j];
        if (ca === b.charCodeAt(j - 1)) dp[j] = prev + 1;
        else if (dp[j - 1] > old) dp[j] = dp[j - 1];
        prev = old;
      }
    }
    return dp[n];
  }

  function levenshtein(a, b) {
    var sa = String(a || '');
    var sb = String(b || '');
    return withWasmPair(sa, sb, function (ex, pa, la, pb, lb) {
      return ex.wasm_levenshtein_u16(pa, la, pb, lb);
    }, function () {
      return levenshteinJs(sa, sb);
    });
  }

  function lcs(a, b) {
    var sa = String(a || '');
    var sb = String(b || '');
    return withWasmPair(sa, sb, function (ex, pa, la, pb, lb) {
      return ex.wasm_lcs_u16(pa, la, pb, lb);
    }, function () {
      return lcsJs(sa, sb);
    });
  }

  function normalize(str) {
    return String(str || '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đð]/g, 'd')
      .replace(/[üǖǘǚǜ]/g, 'u')
      .replace(/[’‘`]/g, "'")
      .replace(/[-–—_/\\]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizePinyin(str) {
    return normalize(str)
      .replace(/([nljqxy])v/g, '$1u')
      .replace(/([a-z])([1-5])(?=\s|$|[a-z])/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenize(normStr) {
    if (!normStr) return [];
    return String(normStr)
      .split(/[\s,.;:!?()[\]{}"'|<>~`=+*&^%$#@]+/)
      .filter(Boolean);
  }

  function isSepCharCode(c) {
    if (c === 32 || c === 9 || c === 10 || c === 13) return true;
    if (c < 128) {
      var isDig = c >= 48 && c <= 57;
      var isUp = c >= 65 && c <= 90;
      var isLow = c >= 97 && c <= 122;
      var isApo = c === 39;
      return !(isDig || isUp || isLow || isApo);
    }
    return false;
  }

  function fuzzyScoreJs(q, doc) {
    if (!q || !doc) return 0;
    if (q === doc) return 1000;
    var phraseScore = 0;
    var pos = doc.indexOf(q);
    if (pos === 0) phraseScore = 940;
    else if (pos > 0) phraseScore = isSepCharCode(doc.charCodeAt(pos - 1)) ? 880 : 780;

    var qTokens = tokenize(q);
    var dTokens = tokenize(doc);
    if (!qTokens.length || !dTokens.length) return phraseScore;

    var matched = 0;
    var sum = 0;
    for (var i = 0; i < qTokens.length; i++) {
      var qt = qTokens[i];
      var best = 0;
      for (var j = 0; j < dTokens.length; j++) {
        var dt = dTokens[j];
        var subPos = dt.indexOf(qt);
        var s = 0;
        if (subPos === 0) {
          s = dt.length === qt.length ? 1000 : (900 - Math.min(80, (dt.length - qt.length) * 8));
        } else if (subPos > 0) {
          s = 760 - Math.min(80, subPos * 10);
        } else if (qt.length >= 3 && dt.length >= 2) {
          var maxDist = qt.length <= 4 ? 1 : 2;
          if (Math.abs(dt.length - qt.length) <= maxDist) {
            var dist = levenshteinJs(qt, dt);
            if (dist <= maxDist) {
              s = Math.max(450, 820 - dist * 160 - Math.abs(dt.length - qt.length) * 20);
            }
          }
        }
        if (s > best) {
          best = s;
          if (best === 1000) break;
        }
      }
      if (best > 0) {
        matched++;
        sum += best;
      }
    }

    var tokenScore = 0;
    if (matched > 0) {
      var avg = Math.floor(sum / qTokens.length);
      tokenScore = matched === qTokens.length
        ? avg
        : Math.floor((avg * matched * 6) / (qTokens.length * 10));
    }
    return Math.min(1000, Math.max(phraseScore, tokenScore));
  }

  function fuzzyScoreNormalized(qNorm, docNorm) {
    if (!qNorm || !docNorm) return 0;
    if (qNorm === docNorm) return 1000;
    if (qNorm.length <= 160 && docNorm.length >= 48 && docNorm.length <= 512 && isWasmReady()) {
      return withWasmPair(qNorm, docNorm, function (ex, pq, lq, pd, ld) {
        return ex.wasm_fuzzy_token_score(pq, lq, pd, ld);
      }, function () {
        return fuzzyScoreJs(qNorm, docNorm);
      });
    }
    return fuzzyScoreJs(qNorm, docNorm);
  }

  function fuzzyScore(query, docText) {
    var q = normalize(query);
    var doc = normalize(docText);
    return fuzzyScoreNormalized(q, doc);
  }

  function isFuzzyTokenHit(tok, normalizedHaystack) {
    var t = normalize(tok);
    var h = normalizedHaystack ? String(normalizedHaystack) : '';
    if (!t || !h) return false;
    if (h.indexOf(t) !== -1) return true;
    if (t.length < 4) return false;
    var words = tokenize(h);
    var maxDist = t.length >= 7 ? 2 : 1;
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (Math.abs(w.length - t.length) > maxDist) continue;
      if (levenshtein(t, w) <= maxDist) return true;
    }
    return false;
  }

  function stripHtmlTags(str) {
    var s = String(str == null ? '' : str);
    return (s.indexOf('<') !== -1 && s.indexOf('>') !== -1)
      ? s.replace(/<[^>]*>/g, ' ')
      : s;
  }

  function hasCjk(str) {
    return /[\u4e00-\u9fff\u3400-\u4dbf]/.test(str);
  }

  function addPosting(map, key, docIdx) {
    var arr = map.get(key);
    if (!arr) {
      map.set(key, [docIdx]);
    } else if (arr[arr.length - 1] !== docIdx) {
      arr.push(docIdx);
    }
  }

  function indexFuzzyToken(map, tok, docIdx) {
    if (!tok || tok.length < 4) return;
    if (tok.length >= 5) {
      addPosting(map, '3:' + tok.slice(0, 3), docIdx);
      addPosting(map, '3:' + tok.slice(2, 5), docIdx);
    } else {
      addPosting(map, '2:' + tok.slice(0, 2), docIdx);
      addPosting(map, '2:' + tok.slice(2, 4), docIdx);
    }
  }

  function createIndex(items, options) {
    var srcItems = Array.isArray(items) ? items : [];
    var opts = options || {};
    var fields = Array.isArray(opts.fields) && opts.fields.length
      ? opts.fields
      : [{ name: 'text', get: function (it) { return typeof it === 'string' ? it : JSON.stringify(it); }, weight: 1 }];

    var docs = null;
    var prefixMap = null;
    var fuzzyMap = null;
    var cjkMap = null;
    var built = false;

    function buildNow() {
      if (built) return;
      docs = new Array(srcItems.length);
      prefixMap = new Map();
      fuzzyMap = new Map();
      cjkMap = new Map();

      for (var i = 0; i < srcItems.length; i++) {
        var it = srcItems[i];
        var normFields = new Array(fields.length);
        var compactPinyinFields = new Array(fields.length);
        var combinedParts = [];

        for (var f = 0; f < fields.length; f++) {
          var fd = fields[f];
          var isFuzzyField = fields.length === 1 || f === 0 || Boolean(fd.pinyin) || Number(fd.weight) >= 1.8;
          var rawVal = typeof fd.get === 'function' ? fd.get(it) : (it && it[fd.name]);
          var rawArr = Array.isArray(rawVal) ? rawVal : [rawVal];
          if (Array.isArray(rawVal)) rawVal = rawVal.join(' ');
          if (!fd.keepHtml && rawVal != null) rawVal = stripHtmlTags(rawVal);
          var normStr = fd.pinyin ? normalizePinyin(rawVal) : normalize(rawVal);
          normFields[f] = normStr;
          var compactStr = '';
          if (fd.pinyin) {
            var seenCp = new Set();
            var cpList = [];
            for (var rp = 0; rp < rawArr.length; rp++) {
              var rv = rawArr[rp];
              if (rv == null) continue;
              if (!fd.keepHtml) rv = stripHtmlTags(rv);
              var np = normalizePinyin(rv).replace(/\s+/g, '');
              if (np && !seenCp.has(np)) {
                seenCp.add(np);
                cpList.push(np);
              }
            }
            compactStr = cpList.join(' ');
          }
          compactPinyinFields[f] = compactStr;
          if (normStr) combinedParts.push(normStr);

          var toks = tokenize(normStr);
          for (var t = 0; t < toks.length; t++) {
            var tok = toks[t];
            if (hasCjk(tok)) {
              for (var c = 0; c < tok.length; c++) {
                var code = tok.charCodeAt(c);
                if (code >= 0x3400 && code <= 0x9fff) {
                  addPosting(cjkMap, tok.charAt(c), i);
                }
              }
            } else if (tok.length >= 2) {
              var p0 = tok.slice(0, 2);
              addPosting(prefixMap, p0, i);
              if (isFuzzyField && tok.length >= 4) {
                indexFuzzyToken(fuzzyMap, tok, i);
              }
            }
          }
          if (fd.pinyin && compactPinyinFields[f].length >= 2) {
            var cpToks = compactPinyinFields[f].split(' ');
            for (var ct = 0; ct < cpToks.length; ct++) {
              var cpt = cpToks[ct];
              if (cpt.length >= 2) {
                addPosting(prefixMap, cpt.slice(0, 2), i);
                if (cpt.length >= 4) {
                  indexFuzzyToken(fuzzyMap, cpt, i);
                }
              }
            }
          }
        }

        docs[i] = {
          idx: i,
          item: it,
          fields: normFields,
          compactPy: compactPinyinFields,
          combined: combinedParts.join(' | ')
        };
      }
      built = true;
    }

    if (!opts.lazy) {
      buildNow();
    }

    function intersectSorted(a, b) {
      var res = [];
      var i = 0;
      var j = 0;
      while (i < a.length && j < b.length) {
        if (a[i] === b[j]) { res.push(a[i]); i++; j++; }
        else if (a[i] < b[j]) i++;
        else j++;
      }
      return res;
    }

    function collectFastCandidates(qNorm, qTokens, qPyTokens) {
      if (hasCjk(qNorm)) {
        var bestList = null;
        for (var c = 0; c < qNorm.length; c++) {
          var code = qNorm.charCodeAt(c);
          if (code >= 0x3400 && code <= 0x9fff) {
            var post = cjkMap.get(qNorm.charAt(c));
            if (!post || !post.length) return [];
            if (!bestList || post.length < bestList.length) bestList = post;
          }
        }
        return bestList;
      }

      if (!qTokens.length) return null;
      var lists = [];
      for (var i = 0; i < qTokens.length; i++) {
        if (qTokens[i].length < 2) return null;
        var p = prefixMap.get(qTokens[i].slice(0, 2));
        if (qPyTokens && qPyTokens[i] && qPyTokens[i].length >= 2 && qPyTokens[i].slice(0, 2) !== qTokens[i].slice(0, 2)) {
          var pAlt = prefixMap.get(qPyTokens[i].slice(0, 2));
          if (pAlt && pAlt.length) {
            if (!p || !p.length) p = pAlt;
            else {
              var mergedSet = new Set(p);
              for (var k = 0; k < pAlt.length; k++) mergedSet.add(pAlt[k]);
              p = Array.from(mergedSet).sort(function (x, y) { return x - y; });
            }
          }
        }
        if (!p || !p.length) return [];
        lists.push(p);
      }

      lists.sort(function (x, y) { return x.length - y.length; });
      var cur = lists[0];
      for (var l = 1; l < lists.length; l++) {
        cur = intersectSorted(cur, lists[l]);
        if (!cur.length) return [];
      }
      return cur;
    }

    function collectFuzzyCandidates(qTokens, qPyCompact) {
      var longTokens = (qTokens || [])
        .filter(function (tk) { return tk.length >= 4; })
        .sort(function (a, b) { return b.length - a.length; })
        .slice(0, 2);

      var seen = new Set();
      var out = [];
      var addAll = function (arr) {
        if (!arr) return;
        for (var k = 0; k < arr.length; k++) {
          if (!seen.has(arr[k])) {
            seen.add(arr[k]);
            out.push(arr[k]);
          }
        }
      };
      var pullKeys = function (tk) {
        if (!tk || tk.length < 4) return;
        if (tk.length >= 5) {
          addAll(fuzzyMap.get('3:' + tk.slice(0, 3)));
          addAll(fuzzyMap.get('3:' + tk.slice(1, 4)));
          addAll(fuzzyMap.get('3:' + tk.slice(2, 5)));
          if (tk.length >= 6) {
            addAll(fuzzyMap.get('3:' + tk.slice(3, 6)));
          }
        } else {
          addAll(fuzzyMap.get('2:' + tk.slice(0, 2)));
          addAll(fuzzyMap.get('2:' + tk.slice(1, 3)));
          addAll(fuzzyMap.get('2:' + tk.slice(2, 4)));
        }
      };

      for (var i = 0; i < longTokens.length; i++) {
        pullKeys(longTokens[i]);
      }
      if (qPyCompact && qPyCompact.length >= 5 && (!qTokens.length || qPyCompact !== qTokens[0])) {
        pullKeys(qPyCompact);
      }
      return out;
    }

    function scoreDoc(doc, qNorm, qPy, qPyCompact, qTokens, qPyTokens, allowFuzzy) {
      var bestWeighted = 0;

      for (var f = 0; f < fields.length; f++) {
        var hay = doc.fields[f];
        if (!hay) continue;
        var fd = fields[f];
        var weight = Number(fd.weight) > 0 ? Number(fd.weight) : 1.0;
        var qUse = fd.pinyin ? qPy : qNorm;
        var toksUse = fd.pinyin ? qPyTokens : qTokens;
        var rawScore = 0;

        if (hay === qUse) {
          rawScore = 1000;
        } else if (fd.pinyin && qPyCompact && (doc.compactPy[f] === qPyCompact || (doc.compactPy[f].indexOf(' ') !== -1 && (' ' + doc.compactPy[f] + ' ').indexOf(' ' + qPyCompact + ' ') !== -1))) {
          rawScore = 980;
        } else {
          var pos = hay.indexOf(qUse);
          if (pos === 0) {
            rawScore = 940;
          } else if (pos > 0) {
            rawScore = isSepCharCode(hay.charCodeAt(pos - 1)) ? 880 : 780;
          } else if (fd.pinyin && qPyCompact && qPyCompact.length >= 2 && doc.compactPy[f].indexOf(qPyCompact) !== -1) {
            rawScore = doc.compactPy[f].indexOf(qPyCompact) === 0 ? 900 : 810;
          } else if (toksUse.length > 1) {
            var allSub = true;
            for (var t = 0; t < toksUse.length; t++) {
              if (hay.indexOf(toksUse[t]) === -1) {
                allSub = false;
                break;
              }
            }
            if (allSub) rawScore = 820;
          }

          var isFuzzyField = fields.length === 1 || f === 0 || Boolean(fd.pinyin) || weight >= 1.8;
          if (rawScore === 0 && allowFuzzy && isFuzzyField) {
            if (qUse.length >= 4 && hay.length <= 160) {
              var fs = fuzzyScoreNormalized(qUse, hay);
              if (fs >= 450) rawScore = fs;
            }
            if (rawScore === 0 && fd.pinyin && qPyCompact.length >= 4 && doc.compactPy[f].length >= 4 && doc.compactPy[f].length <= 64) {
              var fsPy = fuzzyScoreNormalized(qPyCompact, doc.compactPy[f]);
              if (fsPy >= 450) rawScore = fsPy;
            }
          }
        }

        if (rawScore > 0) {
          var weighted = Math.round(rawScore * weight);
          if (weighted > bestWeighted) bestWeighted = weighted;
        }
      }

      if (bestWeighted === 0 && qTokens.length > 1) {
        var allCombined = true;
        var fuzzyUsed = false;
        for (var k = 0; k < qTokens.length; k++) {
          var tk = qTokens[k];
          if (doc.combined.indexOf(tk) === -1) {
            if (allowFuzzy && tk.length >= 4 && isFuzzyTokenHit(tk, doc.combined)) {
              fuzzyUsed = true;
            } else {
              allCombined = false;
              break;
            }
          }
        }
        if (allCombined) {
          bestWeighted = fuzzyUsed ? 520 : 680;
        }
      }

      return bestWeighted;
    }

    function search(rawQuery, searchOpts) {
      buildNow();
      var so = searchOpts || {};
      var filterFn = typeof so.filterFn === 'function' ? so.filterFn : null;
      var limit = Number(so.limit) > 0 ? Number(so.limit) : 0;
      var allowFuzzy = so.allowFuzzy !== false;
      var minScore = Number(so.minScore) > 0 ? Number(so.minScore) : 1;

      var qNorm = normalize(rawQuery);
      if (!qNorm) {
        var allOut = [];
        for (var a = 0; a < docs.length; a++) {
          if (filterFn && !filterFn(docs[a].item, a)) continue;
          allOut.push({ item: docs[a].item, idx: a, score: 1000 });
          if (limit && allOut.length >= limit) break;
        }
        return allOut;
      }

      var qPy = normalizePinyin(rawQuery);
      var qPyCompact = qPy.replace(/\s+/g, '');
      var qTokens = tokenize(qNorm);
      var qPyTokens = tokenize(qPy);
      var fastCands = collectFastCandidates(qNorm, qTokens, qPyTokens);

      var hits = [];
      var seenHits = new Set();

      var runOnList = function (candList, useFuzzy) {
        for (var ci = 0; ci < candList.length; ci++) {
          var dIdx = candList[ci];
          if (seenHits.has(dIdx)) continue;
          var doc = docs[dIdx];
          if (filterFn && !filterFn(doc.item, dIdx)) continue;
          var sc = scoreDoc(doc, qNorm, qPy, qPyCompact, qTokens, qPyTokens, useFuzzy);
          if (sc >= minScore) {
            seenHits.add(dIdx);
            hits.push({ item: doc.item, idx: dIdx, score: sc });
          }
        }
      };

      if (Array.isArray(fastCands)) {
        runOnList(fastCands, false);
        // Nếu truy vấn từ khóa khớp chính xác/chuỗi con ít hơn 3 kết quả và bật fuzzy -> mở rộng tìm mờ trên fastCands + fuzzyMap
        if (allowFuzzy && hits.length < 3 && !hasCjk(qNorm)) {
          if (fastCands.length) runOnList(fastCands, true);
          var fuzzyCands = collectFuzzyCandidates(qTokens, qPyCompact);
          if (fuzzyCands.length) runOnList(fuzzyCands, true);
        }
      } else {
        for (var di = 0; di < docs.length; di++) {
          var d = docs[di];
          if (filterFn && !filterFn(d.item, di)) continue;
          var s = scoreDoc(d, qNorm, qPy, qPyCompact, qTokens, qPyTokens, false);
          if (s >= minScore) hits.push({ item: d.item, idx: di, score: s });
        }
      }

      hits.sort(function (x, y) {
        if (y.score !== x.score) return y.score - x.score;
        return x.idx - y.idx;
      });
      return limit ? hits.slice(0, limit) : hits;
    }

    function filter(rawQuery, searchOpts) {
      return search(rawQuery, searchOpts).map(function (h) { return h.item; });
    }

    return {
      size: function () { return srcItems.length; },
      build: buildNow,
      search: search,
      filter: filter
    };
  }

  function createSubtitleIndex(lessons, opts) {
    var list = Array.isArray(lessons) ? lessons : [];
    var o = opts || {};
    var records = null;
    var built = false;

    function buildNow() {
      if (built) return;
      records = new Array(list.length);
      for (var i = 0; i < list.length; i++) {
        var L = list[i] || {};
        var titleNorm = normalize(L.title || '');
        var unitNorm = normalize(L.unit || '');
        var idxNorm = normalize(L.index != null ? String(L.index) : '');
        var rawSubs = Array.isArray(L.subs) ? L.subs : [];
        var subItems = new Array(rawSubs.length);
        var blobParts = new Array(rawSubs.length);

        for (var s = 0; s < rawSubs.length; s++) {
          var sub = rawSubs[s] || {};
          var nEn = normalize(sub.en || '');
          var nVi = normalize(sub.vi || '');
          subItems[s] = {
            subIdx: s,
            time: Number(sub.time) || 0,
            en: sub.en || '',
            vi: sub.vi || '',
            normEn: nEn,
            normVi: nVi
          };
          blobParts[s] = nEn + ' ' + nVi;
        }

        records[i] = {
          idx: i,
          item: L,
          titleNorm: titleNorm,
          unitNorm: unitNorm,
          idxNorm: idxNorm,
          subs: subItems,
          allSubsNorm: blobParts.join(' | ')
        };
      }
      built = true;
    }

    if (!o.lazy) {
      buildNow();
    }

    function search(rawQuery, searchOpts) {
      buildNow();
      var so = searchOpts || {};
      var filterFn = typeof so.filterFn === 'function' ? so.filterFn : null;
      var limit = Number(so.limit) > 0 ? Number(so.limit) : 0;
      var allowFuzzy = so.allowFuzzy !== false;
      var qNorm = normalize(rawQuery);

      if (!qNorm) {
        var all = [];
        for (var a = 0; a < records.length; a++) {
          if (filterFn && !filterFn(records[a].item, a)) continue;
          all.push({
            item: records[a].item,
            idx: a,
            score: 1000,
            titleMatched: true,
            matchedSubIdx: -1,
            matchedSubTime: 0,
            snippetEn: '',
            snippetVi: '',
            matchCount: 0
          });
          if (limit && all.length >= limit) break;
        }
        return all;
      }

      var tokens = tokenize(qNorm);
      var hits = [];

      for (var i = 0; i < records.length; i++) {
        var rec = records[i];
        if (filterFn && !filterFn(rec.item, i)) continue;

        var headerStr = (rec.idxNorm ? rec.idxNorm + ' ' : '') + rec.titleNorm + ' ' + rec.unitNorm;
        var titleScore = 0;
        if (rec.titleNorm === qNorm || rec.idxNorm === qNorm) {
          titleScore = 1000;
        } else if (rec.titleNorm.indexOf(qNorm) === 0) {
          titleScore = 960;
        } else if (headerStr.indexOf(qNorm) !== -1) {
          titleScore = 900;
        } else if (tokens.length > 0) {
          var allHead = true;
          for (var t = 0; t < tokens.length; t++) {
            if (headerStr.indexOf(tokens[t]) === -1) {
              allHead = false;
              break;
            }
          }
          if (allHead) titleScore = 860;
        }
        if (titleScore === 0 && allowFuzzy && qNorm.length >= 4) {
          var fz = fuzzyScore(qNorm, rec.titleNorm);
          if (fz >= 520) titleScore = Math.min(820, fz);
        }

        var subExactPossible = true;
        for (var k = 0; k < tokens.length; k++) {
          if (rec.allSubsNorm.indexOf(tokens[k]) === -1) {
            subExactPossible = false;
            break;
          }
        }

        var bestSub = null;
        var bestSubScore = 0;
        var matchCount = 0;

        if (subExactPossible && tokens.length > 0) {
          for (var s = 0; s < rec.subs.length; s++) {
            var sub = rec.subs[s];
            var pair = sub.normEn + ' ' + sub.normVi;
            var ok = true;
            for (var tk = 0; tk < tokens.length; tk++) {
              if (pair.indexOf(tokens[tk]) === -1) {
                ok = false;
                break;
              }
            }
            if (!ok) continue;
            matchCount++;
            var sc = 760;
            if (sub.normEn.indexOf(qNorm) !== -1 || sub.normVi.indexOf(qNorm) !== -1) {
              sc = 840;
            }
            if (sc > bestSubScore) {
              bestSubScore = sc;
              bestSub = sub;
            }
          }
        }

        var finalScore = Math.max(titleScore, bestSubScore);
        if (finalScore > 0) {
          if (titleScore > 0 && matchCount > 0) finalScore += 20;
          hits.push({
            item: rec.item,
            idx: i,
            score: Math.min(1020, finalScore),
            titleMatched: titleScore > 0,
            matchedSubIdx: bestSub ? bestSub.subIdx : -1,
            matchedSubTime: bestSub ? bestSub.time : 0,
            snippetEn: bestSub ? bestSub.en : '',
            snippetVi: bestSub ? bestSub.vi : '',
            matchCount: matchCount
          });
        }
      }

      hits.sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
        return a.idx - b.idx;
      });
      return limit ? hits.slice(0, limit) : hits;
    }

    return {
      size: function () { return list.length; },
      build: buildNow,
      search: search
    };
  }

  function escHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function highlightHtml(rawText, query) {
    var text = String(rawText == null ? '' : rawText);
    var qNorm = normalize(query);
    if (!text || !qNorm) return escHtml(text);

    var tokens = tokenize(qNorm).filter(function (t) { return t.length >= 1; });
    if (!tokens.length) return escHtml(text);
    var terms = tokens.length > 1 ? [qNorm].concat(tokens) : tokens;

    // Ánh xạ từng ký tự đã chuẩn hóa về vị trí gốc trong text để tô sáng chính xác cả chữ có dấu tiếng Việt
    var normChars = [];
    var origStart = [];
    var origEnd = [];
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      var piece = ch
        .replace(/[đĐ]/g, 'd')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đð]/g, 'd')
        .replace(/[üǖǘǚǜ]/g, 'u')
        .replace(/[’‘`]/g, "'")
        .replace(/[-–—_/\\]+/g, ' ');
      for (var p = 0; p < piece.length; p++) {
        normChars.push(piece.charAt(p));
        origStart.push(i);
        origEnd.push(i + 1);
      }
    }
    var normJoined = normChars.join('');
    var ranges = [];

    for (var t = 0; t < terms.length; t++) {
      var tok = terms[t];
      var fromIdx = 0;
      while (fromIdx < normJoined.length) {
        var hit = normJoined.indexOf(tok, fromIdx);
        if (hit === -1) break;
        var sPos = origStart[hit];
        var ePos = origEnd[hit + tok.length - 1];
        while (ePos < text.length && /[\u0300-\u036f]/.test(text.charAt(ePos))) {
          ePos++;
        }
        ranges.push([sPos, ePos]);
        fromIdx = hit + tok.length;
      }
    }

    if (!ranges.length) return escHtml(text);
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [ranges[0]];
    for (var r = 1; r < ranges.length; r++) {
      var prev = merged[merged.length - 1];
      if (ranges[r][0] <= prev[1]) {
        if (ranges[r][1] > prev[1]) prev[1] = ranges[r][1];
      } else {
        merged.push(ranges[r]);
      }
    }

    var out = '';
    var cur = 0;
    for (var m = 0; m < merged.length; m++) {
      var st = merged[m][0];
      var en = merged[m][1];
      if (st > cur) out += escHtml(text.slice(cur, st));
      out += '<mark class="s4-hl">' + escHtml(text.slice(st, en)) + '</mark>';
      cur = en;
    }
    if (cur < text.length) out += escHtml(text.slice(cur));
    return out;
  }

  if (typeof globalScope.fetch === 'function' && typeof WebAssembly === 'object') {
    initWasm().catch(function () {});
  }

  globalScope.S4SearchEngine = {
    initWasm: initWasm,
    isWasmReady: isWasmReady,
    normalize: normalize,
    normalizePinyin: normalizePinyin,
    tokenize: tokenize,
    levenshtein: levenshtein,
    lcs: lcs,
    fuzzyScore: fuzzyScore,
    isFuzzyTokenHit: isFuzzyTokenHit,
    createIndex: createIndex,
    createSubtitleIndex: createSubtitleIndex,
    highlightHtml: highlightHtml
  };
})(typeof window !== 'undefined' ? window : globalThis);
