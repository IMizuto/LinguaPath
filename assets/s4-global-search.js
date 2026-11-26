/* LinguaPath Global Spotlight Search (Lazy-Loaded On-Demand for 0 ms Startup & 8 GB RAM)
 * Searches across:
 *   1. IELTS Academic Vocabulary (1,827 words)
 *   2. HSK 1-6 Vocabulary (5,112 words)
 *   3. IELTS Grammar (120 lessons), HSK Grammar (120 topics: HSK 1-6) & HSK Measure Words (168 items)
 *   4. TED Talks Bilingual Subtitles (202 talks)
 */
(function (globalScope) {
  "use strict";

  var siteRoot = document.currentScript ? new URL("../", document.currentScript.src) : new URL("./", location.href);
  var stateKey = "lp_global_search_v1";
  var releaseFocus = null;
  var DEFAULTS = {
    limitAll: 20,
    limitPerBucketInAll: 6,
    limitSingleTab: 35
  };

  var SUGGESTIONS = [
    { label: "accommodate", query: "accommodate" },
    { label: "gia dinh", query: "gia dinh" },
    { label: "nv er", query: "nv er" },
    { label: "danh tu khong dem duoc", query: "danh tu khong dem duoc" },
    { label: "climate change", query: "climate change" },
    { label: "lượng từ 个", query: "个" }
  ];

  var TABS = [
    { key: "all", label: "Tất cả", icon: "" },
    { key: "lessons", label: "Bài học", icon: "grammar" },
    { key: "ielts_vocab", label: "IELTS Vocab", icon: "vocab" },
    { key: "hsk_vocab", label: "HSK Vocab", icon: "hsk" },
    { key: "grammar", label: "Ngữ pháp", icon: "grammar" },
    { key: "ted", label: "TED Talks", icon: "tedtalks" }
  ];

  var FALLBACK_SVG = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    vocab: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>',
    hsk: '<path d="M4 7h16"/><path d="M12 3v18"/><path d="M7 11h10v7H7z"/>',
    grammar: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    tedtalks: '<rect x="2" y="6" width="20" height="12" rx="3"/><polygon points="10 9 15 12 10 15 10 9"/>',
    sparkle: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'
  };

  function gsIcon(name, size) {
    if (globalScope.S4UI && typeof globalScope.S4UI.icon === "function") {
      return globalScope.S4UI.icon(name, size || 16);
    }
    var sz = Number(size) > 0 ? Number(size) : 16;
    var body = FALLBACK_SVG[name] || FALLBACK_SVG.sparkle;
    return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }

  var store = {
    loading: false,
    loadedAll: false,
    doneCount: 0,
    totalSteps: 4,
    errorMsg: "",
    ieltsVocab: { ready: false, count: 0, index: null },
    hskVocab: { ready: false, count: 0, index: null },
    grammar: { ready: false, count: 0, index: null },
    ted: { ready: false, count: 0, index: null }
  };

  var loadPromise = null;
  var activeTab = "all";
  var currentQuery = "";
  try {
    var saved = JSON.parse(sessionStorage.getItem(stateKey));
    if (saved) {
      currentQuery = typeof saved.query === "string" ? saved.query : "";
      if (TABS.some(function (tab) { return tab.key === saved.tab; })) activeTab = saved.tab;
    }
  } catch (error) {}
  function saveSearchState(returnUrl) {
    try { sessionStorage.setItem(stateKey, JSON.stringify({ query: currentQuery, tab: activeTab, returnUrl: returnUrl || "" })); }
    catch (error) {}
  }

  function normalizeLessonText(text) {
    return String(text || "").normalize("NFD").toLowerCase().replace(/\p{M}+/gu, "")
      .replace(/đ/g, "d").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  }
  var currentItems = [];
  var selectedIdx = 0;
  var searchTimer = null;
  var modalOpen = false;
  var lastFocusedEl = null;
  var prevBodyOverflow = "";

  function stripHtmlToText(raw) {
    if (raw == null) return "";
    return String(raw)
      .replace(/<\s*(br|\/p|\/div|\/li|\/tr|\/h[1-6])\b[^>]*>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escHtml(s) {
    if (globalScope.S4UI && typeof globalScope.S4UI.escapeHtml === "function") {
      return globalScope.S4UI.escapeHtml(s);
    }
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function hlHtml(text, query) {
    if (query && globalScope.S4SearchEngine && typeof globalScope.S4SearchEngine.highlightHtml === "function") {
      return globalScope.S4SearchEngine.highlightHtml(text, query);
    }
    return escHtml(text);
  }

  function fmtTime(ms) {
    var totalSec = Math.max(0, Math.floor((ms || 0) / 1000));
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;
    return m + ":" + (s < 10 ? "0" + s : s);
  }

  function releaseGlobal(names) {
    for (var i = 0; i < names.length; i++) {
      var k = names[i];
      try { delete globalScope[k]; } catch (e) {}
      try { globalScope[k] = undefined; } catch (e2) {}
    }
  }

  function yieldFrame() {
    return new Promise(function (resolve) {
      setTimeout(resolve, 0);
    });
  }

  var loadedScripts = Object.create(null);
  function loadScriptOnce(src) {
    if (loadedScripts[src]) return loadedScripts[src];
    loadedScripts[src] = new Promise(function (resolve, reject) {
      if (typeof document === "undefined" || !document.createElement) {
        reject(new Error("DOM unavailable"));
        return;
      }
      var s = document.createElement("script");
      s.src = new URL(src, siteRoot).href;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () {
        delete loadedScripts[src];
        reject(new Error("Không thể tải " + src));
      };
      (document.head || document.documentElement || document.body).appendChild(s);
    });
    return loadedScripts[src];
  }

  function buildIeltsVocabStore() {
    if (store.ieltsVocab.ready || !globalScope.S4SearchEngine) return;
    var raw = globalScope.STUDY4_VOCAB_DATA || globalScope.LINGUAPATH_VOCAB_DATA || [];
    var slim = new Array(raw.length);
    for (var i = 0; i < raw.length; i++) {
      var v = raw[i] || {};
      var exArr = Array.isArray(v.examples) ? v.examples : [];
      var exParts = [];
      for (var j = 0; j < exArr.length; j++) {
        var cleaned = stripHtmlToText(exArr[j]).replace(/\(=Dịch:\s*/gi, "").replace(/\)\s*$/g, "");
        if (cleaned) exParts.push(cleaned);
      }
      slim[i] = {
        kind: "ielts_vocab",
        id: v.id || ("w_" + i),
        word: v.word || "",
        pos: v.pos || "",
        ipa: v.ipa || "",
        defVi: v.defVi || v.defRaw || "",
        defEn: v.defEn || "",
        topic: v.topic || "",
        exPlain: exParts.join(" • ")
      };
    }
    releaseGlobal(["STUDY4_VOCAB_DATA", "LINGUAPATH_VOCAB_DATA"]);
    store.ieltsVocab.count = slim.length;
    store.ieltsVocab.index = globalScope.S4SearchEngine.createIndex(slim, {
      lazy: true,
      fields: [
        { name: "word", get: function (it) { return it.word; }, weight: 2.3 },
        { name: "defVi", get: function (it) { return it.defVi || it.defEn; }, weight: 1.4 },
        { name: "defEn", get: function (it) { return it.defEn; }, weight: 1.1 },
        { name: "topic", get: function (it) { return it.topic; }, weight: 0.9 },
        { name: "exPlain", get: function (it) { return it.exPlain; }, weight: 0.75 }
      ]
    });
    store.ieltsVocab.ready = true;
  }

  function buildHskVocabStore() {
    if (store.hskVocab.ready || !globalScope.S4SearchEngine) return;
    var raw = globalScope.LP_HSK_VOCAB_DATA || [];
    var slim = new Array(raw.length);
    for (var i = 0; i < raw.length; i++) {
      var w = raw[i] || {};
      var exObj = (w.ex && typeof w.ex === "object") ? w.ex : null;
      var exText = exObj ? [exObj.z || "", exObj.p || "", exObj.v || exObj.e || ""].join(" ").trim() : "";
      slim[i] = {
        kind: "hsk_vocab",
        id: w.id || ("hsk_" + i),
        level: Number(w.level) || 1,
        word: w.word || "",
        trad: w.trad || "",
        pinyin: w.pinyin || "",
        pinyinNum: w.pinyinNum || "",
        hanViet: w.hanViet || "",
        defVi: w.defVi || "",
        defEn: w.defEn || "",
        radical: w.radical || "",
        exText: exText
      };
    }
    releaseGlobal(["LP_HSK_VOCAB_DATA"]);
    store.hskVocab.count = slim.length;
    store.hskVocab.index = globalScope.S4SearchEngine.createIndex(slim, {
      lazy: true,
      fields: [
        { name: "word", get: function (it) { return [it.word, it.trad]; }, weight: 2.5 },
        { name: "pinyin", get: function (it) { return [it.pinyin, it.pinyinNum]; }, weight: 2.0, pinyin: true },
        { name: "hanViet", get: function (it) { return it.hanViet; }, weight: 1.5 },
        { name: "defVi", get: function (it) { return it.defVi; }, weight: 1.35 },
        { name: "defEn", get: function (it) { return it.defEn; }, weight: 1.0 },
        { name: "radical", get: function (it) { return it.radical; }, weight: 0.8 },
        { name: "exText", get: function (it) { return it.exText; }, weight: 0.7 }
      ]
    });
    store.hskVocab.ready = true;
  }

  function buildGrammarStore() {
    if (store.grammar.ready || !globalScope.S4SearchEngine) return;
    var rawIelts = globalScope.STUDY4_GRAMMAR_DATA || globalScope.LINGUAPATH_GRAMMAR_DATA || [];
    var rawHskBase = Array.isArray(globalScope.LP_HSK_GRAMMAR_DATA) ? globalScope.LP_HSK_GRAMMAR_DATA : [];
    var rawHskAdv = Array.isArray(globalScope.LP_HSK_GRAMMAR_ADV_DATA) ? globalScope.LP_HSK_GRAMMAR_ADV_DATA : [];
    var rawHsk = rawHskBase.concat(rawHskAdv);
    var rawMw = Array.isArray(globalScope.LP_HSK_MEASURE_WORDS) ? globalScope.LP_HSK_MEASURE_WORDS : [];
    var slim = [];
    for (var i = 0; i < rawIelts.length; i++) {
      var g = rawIelts[i] || {};
      var noteTxt = g.notesHtml ? stripHtmlToText(g.notesHtml).slice(0, 1200) : "";
      slim.push({
        kind: "ielts_grammar",
        id: g.id || ("item_" + (i + 1)),
        index: g.index || (i + 1),
        unitTitle: String(g.unitTitle || "").replace("[Grammar] ", ""),
        sectionName: g.sectionName || "",
        title: g.title || "",
        isPractice: Boolean(g.isPractice),
        summaryText: noteTxt
      });
    }
    var seenHskIds = Object.create(null);
    for (var j = 0; j < rawHsk.length; j++) {
      var h = rawHsk[j] || {};
      var hid = h.id || ("hsk_g_" + j);
      if (seenHskIds[hid]) continue;
      seenHskIds[hid] = true;
      var exArr = Array.isArray(h.examples) ? h.examples : [];
      var exTxt = exArr.map(function (e) {
        return [e.zh || "", e.py || "", e.vi || ""].join(" ");
      }).join(" ").trim();
      slim.push({
        kind: "hsk_grammar",
        id: hid,
        level: Number(h.level) || 1,
        category: h.category || "",
        title: h.title || "",
        formula: h.formula || "",
        summary: h.summary || "",
        exText: exTxt
      });
    }
    var seenMwIds = Object.create(null);
    for (var m = 0; m < rawMw.length; m++) {
      var mw = rawMw[m] || {};
      var mwid = mw.id || ("mw_" + (m + 1));
      if (seenMwIds[mwid]) continue;
      seenMwIds[mwid] = true;
      var nounsArr = Array.isArray(mw.nouns) ? mw.nouns : [];
      var mwEx = (mw.ex && typeof mw.ex === "object") ? mw.ex : null;
      var mwExTxt = mwEx ? [mwEx.zh || "", mwEx.py || "", mwEx.vi || ""].join(" ").trim() : "";
      slim.push({
        kind: "hsk_mw",
        id: mwid,
        level: Number(mw.level) || 1,
        mw: mw.mw || "",
        pinyin: mw.pinyin || "",
        hv: mw.hv || "",
        category: mw.category || "",
        meaning: mw.meaning || "",
        nounsText: nounsArr.join(" • "),
        exText: mwExTxt,
        note: mw.note || ""
      });
    }
    releaseGlobal([
      "STUDY4_GRAMMAR_DATA",
      "LINGUAPATH_GRAMMAR_DATA",
      "LP_HSK_GRAMMAR_DATA",
      "LP_HSK_GRAMMAR_ADV_DATA",
      "LP_HSK_MEASURE_WORDS",
      "LP_HSK_MEASURE_QUIZ"
    ]);
    store.grammar.count = slim.length;
    store.grammar.index = globalScope.S4SearchEngine.createIndex(slim, {
      lazy: true,
      fields: [
        {
          name: "title",
          get: function (it) {
            if (it.kind === "ielts_grammar") return [it.title, it.sectionName, it.unitTitle];
            if (it.kind === "hsk_mw") return it.mw;
            return [it.title, "HSK " + it.level];
          },
          weight: 2.4
        },
        {
          name: "pinyin",
          get: function (it) {
            return it.kind === "hsk_mw" ? [it.pinyin, it.hv] : "";
          },
          weight: 2.0,
          pinyin: true
        },
        {
          name: "formula",
          get: function (it) {
            if (it.kind === "hsk_grammar") return it.formula;
            if (it.kind === "hsk_mw") return [it.meaning, it.category, "HSK " + it.level];
            return it.sectionName;
          },
          weight: 1.6
        },
        {
          name: "body",
          get: function (it) {
            if (it.kind === "ielts_grammar") return it.summaryText;
            if (it.kind === "hsk_mw") return [it.nounsText, it.exText, it.note];
            return [it.summary, it.exText];
          },
          weight: 1.1
        }
      ]
    });
    store.grammar.ready = true;
  }

  function buildTedStore() {
    if (store.ted.ready || !globalScope.S4SearchEngine) return;
    var raw = globalScope.STUDY4_TED_DATA || [];
    var slim = new Array(raw.length);
    for (var i = 0; i < raw.length; i++) {
      var t = raw[i] || {};
      var rawSubs = Array.isArray(t.subs) ? t.subs : [];
      var subSlim = new Array(rawSubs.length);
      for (var s = 0; s < rawSubs.length; s++) {
        var sub = rawSubs[s] || {};
        subSlim[s] = {
          time: Number(sub.time) || 0,
          en: sub.en || "",
          vi: sub.vi || ""
        };
      }
      slim[i] = {
        kind: "ted",
        id: t.id || ("ted_" + i),
        index: t.index != null ? t.index : (i + 1),
        title: t.title || "",
        unit: t.unit || "",
        podOffsetMs: Number(t.podOffsetMs) || 0,
        subs: subSlim
      };
    }
    releaseGlobal(["STUDY4_TED_DATA"]);
    store.ted.count = slim.length;
    store.ted.index = globalScope.S4SearchEngine.createSubtitleIndex(slim, { lazy: true });
    store.ted.ready = true;
  }

  function refreshLiveIfOpen() {
    if (!modalOpen) return;
    updateTabLabels();
    if (currentQuery.trim()) {
      executeSearch(currentQuery);
    } else {
      updateStatusLine();
    }
  }

  function ensureLoaded() {
    if (store.loadedAll) return Promise.resolve();
    if (loadPromise) return loadPromise;

    store.loading = true;
    store.errorMsg = "";
    updateStatusLine();

    var engineReady = globalScope.S4SearchEngine
      ? Promise.resolve()
      : loadScriptOnce("assets/s4-search-engine.js?v=1");

    loadScriptOnce("assets/s4-lesson-search-data.js").then(refreshLiveIfOpen).catch(function () {});
    loadPromise = engineReady.then(function () {
      if (globalScope.S4SearchEngine && typeof globalScope.S4SearchEngine.initWasm === "function") {
        globalScope.S4SearchEngine.initWasm(new URL("assets/s4-core.wasm?v=1", siteRoot).href).catch(function () {});
      }
      return loadScriptOnce("ielts/vocab/vocab_data.js");
    }).then(function () {
      return yieldFrame();
    }).then(function () {
      buildIeltsVocabStore();
      store.doneCount = 1;
      refreshLiveIfOpen();
      return loadScriptOnce("hsk/vocab/vocab_data.js");
    }).then(function () {
      return yieldFrame();
    }).then(function () {
      buildHskVocabStore();
      store.doneCount = 2;
      refreshLiveIfOpen();
      return Promise.all([
        loadScriptOnce("ielts/grammar/grammar_data.js"),
        loadScriptOnce("hsk/grammar/grammar_data.js"),
        loadScriptOnce("hsk/grammar/grammar_data_adv.js"),
        loadScriptOnce("hsk/grammar/measure_words_data.js")
      ]);
    }).then(function () {
      return yieldFrame();
    }).then(function () {
      buildGrammarStore();
      store.doneCount = 3;
      refreshLiveIfOpen();
      return loadScriptOnce("tedtalks/tedtalks_data.js");
    }).then(function () {
      return yieldFrame();
    }).then(function () {
      buildTedStore();
      store.doneCount = 4;
      store.loadedAll = true;
      store.loading = false;
      refreshLiveIfOpen();
    }).catch(function (err) {
      store.loading = false;
      store.errorMsg = (err && err.message) ? err.message : "Lỗi nạp dữ liệu tìm kiếm";
      loadPromise = null;
      refreshLiveIfOpen();
    });

    return loadPromise;
  }

  function buildDeepLink(entry, q) {
    var qEnc = encodeURIComponent(q || "");
    if (entry.bucket === "lessons") {
      var prefix = entry.item.course === "hsk" ? "hsk/lessons" : "ielts/foundation";
      return prefix + "/index.html?id=" + encodeURIComponent(entry.item.id);
    }
    if (entry.bucket === "ielts_vocab") {
      return "ielts/vocab/index.html?q=" + encodeURIComponent(entry.item.word || q || "") + "&mode=list";
    }
    if (entry.bucket === "hsk_vocab") {
      var lv = encodeURIComponent(entry.item.level || 1);
      return "hsk/vocab/index.html?level=" + lv + "&q=" + encodeURIComponent(entry.item.word || q || "") + "&mode=list";
    }
    if (entry.bucket === "grammar") {
      if (entry.item.kind === "hsk_mw") {
        var mwQuery = entry.item.mw || q || "";
        return "hsk/grammar/index.html?mode=mw&q=" + encodeURIComponent(mwQuery);
      }
      if (entry.item.kind === "hsk_grammar") {
        return "hsk/grammar/index.html?id=" + encodeURIComponent(entry.item.id) + "&level=" + encodeURIComponent(entry.item.level || 1);
      }
      return "ielts/grammar/index.html?id=" + encodeURIComponent(entry.item.id) + (qEnc ? "&q=" + qEnc : "");
    }
    if (entry.bucket === "ted") {
      var sub = typeof entry.matchedSubIdx === "number" ? entry.matchedSubIdx : -1;
      if (sub >= 0) {
        return "tedtalks/index.html?id=" + encodeURIComponent(entry.item.id) + "&mode=transcript&sub=" + sub + (qEnc ? "&q=" + qEnc : "");
      }
      return "tedtalks/index.html?id=" + encodeURIComponent(entry.item.id) + (qEnc ? "&q=" + qEnc : "");
    }
    return "#";
  }

  function queryBucket(bucketKey, q, limit) {
    if (bucketKey === "lessons") {
      var key = normalizeLessonText(q);
      if (key.length < 2) return [];
      var selectedCourse = location.hash === "#ielts" ? "ielts" : document.documentElement.dataset.course;
      return (globalScope.LP_LESSON_SEARCH_DATA || []).map(function (item) {
        var title = normalizeLessonText(item.title);
        var exact = title === key || (item.aliases || []).some(function (alias) { return normalizeLessonText(alias) === key; });
        var score = exact ? 1400 : title.startsWith(key + " ") ? 1250 : title.includes(key) ? 950 : 0;
        return { bucket: "lessons", item: item, normScore: score && score + (item.course === selectedCourse ? 40 : 0) };
      }).filter(function (entry) { return entry.normScore; })
        .sort(function (a, b) { return b.normScore - a.normScore; }).slice(0, limit);
    }
    if (bucketKey === "ielts_vocab" && store.ieltsVocab.ready) {
      return store.ieltsVocab.index.search(q, { limit: limit }).map(function (h) {
        return {
          bucket: "ielts_vocab",
          item: h.item,
          rawScore: h.score,
          normScore: Math.min(1000, Math.round(h.score / 2.3)),
          matchedSubIdx: -1
        };
      });
    }
    if (bucketKey === "hsk_vocab" && store.hskVocab.ready) {
      return store.hskVocab.index.search(q, { limit: limit }).map(function (h) {
        return {
          bucket: "hsk_vocab",
          item: h.item,
          rawScore: h.score,
          normScore: Math.min(1000, Math.round(h.score / 2.5)),
          matchedSubIdx: -1
        };
      });
    }
    if (bucketKey === "grammar" && store.grammar.ready) {
      return store.grammar.index.search(q, { limit: limit }).map(function (h) {
        return {
          bucket: "grammar",
          item: h.item,
          rawScore: h.score,
          normScore: Math.min(1000, Math.round(h.score / 2.4)),
          matchedSubIdx: -1
        };
      });
    }
    if (bucketKey === "ted" && store.ted.ready) {
      return store.ted.index.search(q, { limit: limit }).map(function (h) {
        return {
          bucket: "ted",
          item: h.item,
          rawScore: h.score,
          normScore: Math.min(1000, h.score),
          matchedSubIdx: typeof h.matchedSubIdx === "number" ? h.matchedSubIdx : -1,
          matchedSubTime: h.matchedSubTime || 0,
          snippetEn: h.snippetEn || "",
          snippetVi: h.snippetVi || "",
          matchCount: h.matchCount || 0
        };
      });
    }
    return [];
  }

  function searchAll(q, tab) {
    var trimmed = String(q || "").trim();
    if (!trimmed) return { items: [], counts: { all: 0, ielts_vocab: 0, hsk_vocab: 0, grammar: 0, ted: 0 }, elapsedMs: 0 };

    var t0 = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
    var targetTab = tab || activeTab || "all";

    if (targetTab !== "all") {
      var list = queryBucket(targetTab, trimmed, DEFAULTS.limitSingleTab);
      list.forEach(function (entry) { entry.href = new URL(buildDeepLink(entry, trimmed), siteRoot).href; });
      var countsSingle = { all: list.length, ielts_vocab: 0, hsk_vocab: 0, grammar: 0, ted: 0 };
      countsSingle[targetTab] = list.length;
      var t1s = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
      return { items: list, counts: countsSingle, elapsedMs: Math.max(0.1, t1s - t0) };
    }

    var bLessons = queryBucket("lessons", trimmed, DEFAULTS.limitPerBucketInAll);
    var bIelts = queryBucket("ielts_vocab", trimmed, DEFAULTS.limitPerBucketInAll);
    var bHsk = queryBucket("hsk_vocab", trimmed, DEFAULTS.limitPerBucketInAll);
    var bGram = queryBucket("grammar", trimmed, DEFAULTS.limitPerBucketInAll);
    var bTed = queryBucket("ted", trimmed, DEFAULTS.limitPerBucketInAll);

    // Đảm bảo mỗi phân hệ có kết quả tốt không bị kho lớn lấn át hết kết quả top
    var buckets = [bLessons, bIelts, bHsk, bGram, bTed];
    var topLeads = [];
    var rest = [];
    for (var b = 0; b < buckets.length; b++) {
      var arr = buckets[b];
      if (!arr.length) continue;
      if (arr[0].normScore >= 550) topLeads.push(arr[0]);
      else rest.push(arr[0]);
      for (var k = 1; k < arr.length; k++) rest.push(arr[k]);
    }
    topLeads.sort(function (a, b) { return b.normScore - a.normScore; });
    rest.sort(function (a, b) { return b.normScore - a.normScore; });

    var merged = topLeads.concat(rest).slice(0, DEFAULTS.limitAll);
    merged.forEach(function (entry) { entry.href = new URL(buildDeepLink(entry, trimmed), siteRoot).href; });
    var t1 = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
    return {
      items: merged,
      counts: {
        all: bLessons.length + bIelts.length + bHsk.length + bGram.length + bTed.length,
        lessons: bLessons.length,
        ielts_vocab: bIelts.length,
        hsk_vocab: bHsk.length,
        grammar: bGram.length,
        ted: bTed.length
      },
      elapsedMs: Math.max(0.1, t1 - t0)
    };
  }

  function injectStyles() {
    if (typeof document === "undefined" || document.getElementById("lpGlobalSearchStyles")) return;
    var st = document.createElement("style");
    st.id = "lpGlobalSearchStyles";
    st.textContent = [
      ".lp-gs-backdrop { position: fixed; inset: 0; z-index: 10060; background: var(--lg-modal-backdrop, rgba(15, 23, 42, 0.36)); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: none; align-items: flex-start; justify-content: center; padding: max(22px, env(safe-area-inset-top, 0px)) 12px 16px; box-sizing: border-box; }",
      ".lp-gs-backdrop.open { display: flex; animation: lpGsFade 0.16s ease; }",
      "@keyframes lpGsFade { from { opacity: 0; } to { opacity: 1; } }",
      ".lp-gs-dialog { width: 100%; max-width: 700px; max-height: min(84vh, 720px); background: var(--lg-modal-surface, linear-gradient(160deg, rgba(255,255,255,0.96), rgba(248,250,252,0.93))); backdrop-filter: blur(18px) saturate(160%); -webkit-backdrop-filter: blur(18px) saturate(160%); color: var(--lg-ink, var(--text, #0f172a)); border: 1px solid var(--lg-hairline, rgba(148,163,184,0.38)); border-radius: 24px; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24), inset 0 1.5px 0 var(--lg-rim-top, rgba(255,255,255,0.92)), inset 0 -1px 0 var(--lg-rim-bot, rgba(15,23,42,0.06)); display: flex; flex-direction: column; overflow: hidden; text-shadow: none; }",
      ".lp-gs-top { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-bottom: 1px solid var(--lg-divider, rgba(15,23,42,0.09)); background: transparent; }",
      ".lp-gs-search-pill { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; height: 42px; padding: 0 12px; border-radius: 999px; background: var(--lg-seg-track, rgba(15, 23, 42, 0.06)); border: 1.5px solid transparent; transition: background-color 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease; }",
      ".lp-gs-search-pill:focus-within { background: var(--lg-seg-active, rgba(255, 255, 255, 0.94)); border-color: var(--lg-accent, var(--primary, #2563eb)); box-shadow: 0 0 0 3px var(--lg-accent-soft, rgba(37, 99, 235, 0.14)); }",
      "html.dark .lp-gs-search-pill:focus-within { background: rgba(255, 255, 255, 0.10); }",
      ".lp-gs-icon { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--lg-accent, var(--primary, #2563eb)); opacity: 0.92; }",
      ".lp-gs-input { flex: 1; min-width: 0; width: 100%; border: none !important; outline: none !important; box-shadow: none !important; background: transparent !important; padding: 0 !important; margin: 0 !important; color: var(--lg-ink, var(--text, #0f172a)); font-size: 15.5px; font-weight: 700; font-family: inherit; -webkit-appearance: none; appearance: none; }",
      ".lp-gs-input:focus, .lp-gs-input:focus-visible { border: none !important; outline: none !important; box-shadow: none !important; }",
      ".lp-gs-input::placeholder { color: var(--lg-ink-muted, var(--muted, #64748b)); font-weight: 600; opacity: 0.9; }",
      ".lp-gs-clear-icon { border: none; background: var(--lg-divider, rgba(15,23,42,0.12)); color: var(--lg-ink, var(--text, #0f172a)); width: 22px; height: 22px; border-radius: 999px; padding: 0; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background-color 0.14s ease, transform 0.14s ease; }",
      ".lp-gs-clear-icon:hover { background: var(--lg-accent-soft); color: var(--lg-accent); }",
      ".lp-gs-btn { border: 1px solid var(--lg-hairline, rgba(148,163,184,0.36)); background: var(--lg-seg-active, rgba(255,255,255,0.88)); color: var(--lg-ink, var(--text, #0f172a)); border-radius: 999px; height: 36px; padding: 0 14px; font-size: 12.5px; font-weight: 800; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background-color 0.14s ease, border-color 0.14s ease, color 0.14s ease; }",
      "html.dark .lp-gs-btn { background: rgba(255, 255, 255, 0.08); }",
      ".lp-gs-btn:hover { border-color: var(--lg-accent, var(--primary, #2563eb)); color: var(--lg-accent, var(--primary, #2563eb)); }",
      ".lp-gs-tabs { display: flex; gap: 6px; padding: 9px 14px; border-bottom: 1px solid var(--lg-divider, rgba(15,23,42,0.09)); overflow-x: auto; scrollbar-width: none; background: transparent; }",
      ".lp-gs-tabs::-webkit-scrollbar { display: none; }",
      ".lp-gs-tab { display: inline-flex; align-items: center; gap: 5px; border: 1px solid var(--lg-hairline, rgba(148,163,184,0.34)); background: var(--lg-seg-track, rgba(15,23,42,0.05)); color: var(--lg-ink-sub, var(--muted, #475569)); border-radius: 999px; padding: 6px 12px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: inherit; transition: background-color 0.14s ease, border-color 0.14s ease, color 0.14s ease; }",
      ".lp-gs-tab:hover { border-color: var(--lg-accent, var(--primary, #2563eb)); color: var(--lg-ink, var(--text, #0f172a)); }",
      ".lp-gs-tab.active { background: var(--lg-accent, var(--primary, #2563eb)); border-color: transparent; color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.14); }",
      ".lp-gs-status { padding: 7px 14px; font-size: 11.5px; font-weight: 700; color: var(--lg-ink-sub, var(--muted, #475569)); border-bottom: 1px solid var(--lg-divider, rgba(15,23,42,0.09)); display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }",
      ".lp-gs-kbd-badge { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10.5px; font-weight: 800; padding: 2px 6px; border-radius: 6px; background: var(--lg-seg-track, rgba(15,23,42,0.08)); color: var(--lg-ink-sub, #475569); }",
      ".lp-gs-results { flex: 1; min-height: 160px; overflow-y: auto; padding: 10px 12px; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; }",
      ".lp-gs-item { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 14px; border: 1px solid transparent; text-decoration: none; color: inherit; margin-bottom: 6px; transition: background-color 0.12s ease, border-color 0.12s ease; }",
      ".lp-gs-item:hover, .lp-gs-item.is-selected { background: var(--lg-accent-soft, rgba(37, 99, 235, 0.10)); border-color: var(--lg-hairline, rgba(37, 99, 235, 0.30)); }",
      ".lp-gs-item-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }",
      ".lp-gs-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; padding: 2px 7px; border-radius: 7px; white-space: nowrap; }",
      ".lp-gs-badge.ielts_vocab { background: rgba(37, 99, 235, 0.14); color: #2563eb; }",
      ".lp-gs-badge.hsk_vocab { background: rgba(220, 38, 38, 0.14); color: #dc2626; }",
      ".lp-gs-badge.grammar { background: rgba(13, 148, 136, 0.15); color: #0f766e; }",
      ".lp-gs-badge.hsk_mw { background: rgba(217, 119, 6, 0.15); color: #b45309; }",
      ".lp-gs-badge.ted { background: rgba(234, 88, 12, 0.14); color: #c2410c; }",
      "html.dark .lp-gs-badge.ielts_vocab, body.dark .lp-gs-badge.ielts_vocab { color: #93c5fd; }",
      "html.dark .lp-gs-badge.hsk_vocab, body.dark .lp-gs-badge.hsk_vocab { color: #fca5a5; }",
      "html.dark .lp-gs-badge.grammar, body.dark .lp-gs-badge.grammar { color: #5eead4; }",
      "html.dark .lp-gs-badge.hsk_mw, body.dark .lp-gs-badge.hsk_mw { color: #fcd34d; }",
      "html.dark .lp-gs-badge.ted, body.dark .lp-gs-badge.ted { color: #fdba74; }",
      ".lp-gs-title { font-size: 14.5px; font-weight: 800; line-height: 1.35; color: var(--lg-ink, #0f172a); }",
      ".lp-gs-submeta { font-size: 12px; color: var(--lg-ink-muted, var(--muted, #64748b)); font-family: monospace; }",
      ".lp-gs-desc { font-size: 13px; color: var(--lg-ink-sub, var(--muted, #475569)); line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }",
      ".lp-gs-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; justify-content: center; }",
      ".lp-gs-chip { border: 1px solid var(--lg-hairline, rgba(148,163,184,0.38)); background: var(--lg-seg-active, rgba(255,255,255,0.88)); color: var(--lg-ink, var(--text, #0f172a)); border-radius: 999px; padding: 7px 13px; font-size: 12.5px; font-weight: 700; cursor: pointer; font-family: inherit; box-shadow: 0 1px 3px rgba(15,23,42,0.06); transition: background-color 0.14s ease, border-color 0.14s ease, color 0.14s ease, transform 0.12s ease; }",
      "html.dark .lp-gs-chip { background: rgba(255, 255, 255, 0.08); box-shadow: none; }",
      ".lp-gs-chip:hover { border-color: var(--lg-accent, var(--primary, #2563eb)); color: var(--lg-accent, var(--primary, #2563eb)); transform: translateY(-1px); }",
      ".lp-gs-foot { padding: 7px 14px; border-top: 1px solid var(--lg-divider, rgba(15,23,42,0.09)); font-size: 11.5px; color: var(--lg-ink-muted, var(--muted, #64748b)); display: flex; justify-content: flex-end; align-items: center; gap: 8px; }",
      "@media (max-width: 720px), (pointer: coarse) { .lp-gs-kbd-badge { display: none; } }",
      "@media (max-width: 560px) { .lp-gs-backdrop { padding: max(12px, env(safe-area-inset-top, 0px)) 10px 10px; } .lp-gs-dialog { max-height: 86vh; border-radius: 22px; } .lp-gs-top { padding: 10px 11px; gap: 7px; } .lp-gs-search-pill { height: 40px; padding: 0 11px; } .lp-gs-btn { height: 34px; padding: 0 12px; } .lp-gs-tabs { padding: 8px 11px; } .lp-gs-status { padding: 6px 12px; } .lp-gs-foot { display: none; } }"
    ].join("\n");
    (document.head || document.documentElement).appendChild(st);
  }

  function ensureModalDom() {
    if (typeof document === "undefined") return null;
    injectStyles();
    var existing = document.getElementById("lpGlobalSearchModal");
    if (existing) return existing;

    var wrap = document.createElement("div");
    wrap.id = "lpGlobalSearchModal";
    wrap.className = "lp-gs-backdrop";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", "Tìm kiếm toàn cục LinguaPath");
    wrap.innerHTML = [
      '<div class="lp-gs-dialog">',
      '  <div class="lp-gs-top">',
      '    <div class="lp-gs-search-pill">',
      '      <span class="lp-gs-icon">' + gsIcon("search", 17) + '</span>',
      '      <input id="lpGlobalSearchInput" class="lp-gs-input" type="text" placeholder="Tìm từ vựng, ngữ pháp, lượng từ, TED..." autocomplete="off" spellcheck="false">',
      '      <button type="button" id="lpGsClear" class="lp-gs-clear-icon" style="display:none;" title="Xóa từ khóa" aria-label="Xóa từ khóa">' + gsIcon("close", 13) + '</button>',
      '    </div>',
      '    <button type="button" id="lpGsClose" class="lp-gs-btn" title="Đóng (Esc)">Đóng</button>',
      '  </div>',
      '  <div class="lp-gs-tabs" id="lpGsTabs"></div>',
      '  <div class="lp-gs-status" id="lpGsStatus"></div>',
      '  <div class="lp-gs-results" id="lpGsResults"></div>',
      '  <div class="lp-gs-foot">',
      '    <span class="lp-gs-kbd-hint">↑↓ chọn • Enter mở • Esc đóng</span>',
      '  </div>',
      '</div>'
    ].join("");

    wrap.addEventListener("click", function (e) {
      if (e.target === wrap) close();
    });

    document.body.appendChild(wrap);

    var inp = document.getElementById("lpGlobalSearchInput");
    var clr = document.getElementById("lpGsClear");
    var cls = document.getElementById("lpGsClose");

    inp.addEventListener("input", function () {
      currentQuery = inp.value;
      clr.style.display = currentQuery ? "inline-flex" : "none";
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        executeSearch(currentQuery);
      }, 90);
    });

    inp.addEventListener("keydown", function (e) {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key === "ArrowDown") {
        if (currentItems.length) {
          e.preventDefault();
          selectedIdx = (selectedIdx + 1) % currentItems.length;
          syncSelectedItem();
        }
      } else if (e.key === "ArrowUp") {
        if (currentItems.length) {
          e.preventDefault();
          selectedIdx = (selectedIdx - 1 + currentItems.length) % currentItems.length;
          syncSelectedItem();
        }
      } else if (e.key === "Enter") {
        if (currentItems.length && currentItems[selectedIdx]) {
          e.preventDefault();
          var targetHref = currentItems[selectedIdx].href;
          if (targetHref && targetHref !== "#") {
            saveSearchState(location.href);
            globalScope.location.href = targetHref;
          }
        }
      }
    });

    clr.addEventListener("click", function () {
      currentQuery = "";
      inp.value = "";
      clr.style.display = "none";
      executeSearch("");
      try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); }
    });

    cls.addEventListener("click", close);
    renderTabs();
    return wrap;
  }

  function updateTabLabels() {
    renderTabs();
  }

  function renderTabs() {
    var host = typeof document !== "undefined" ? document.getElementById("lpGsTabs") : null;
    if (!host) return;
    var focusedTab = host.contains(document.activeElement) ? document.activeElement.getAttribute("data-tab") : null;
    host.innerHTML = TABS.map(function (tb) {
      var act = activeTab === tb.key ? " active" : "";
      var ico = tb.icon ? gsIcon(tb.icon, 13) : "";
      return '<button type="button" class="lp-gs-tab' + act + '" data-tab="' + tb.key + '">' + ico + '<span>' + escHtml(tb.label) + '</span></button>';
    }).join("");
    if (focusedTab) host.querySelector('[data-tab="' + focusedTab + '"]')?.focus({ preventScroll: true });
    host.querySelectorAll(".lp-gs-tab").forEach(function (btn) {
      btn.onclick = function () {
        activeTab = btn.getAttribute("data-tab") || "all";
        selectedIdx = 0;
        renderTabs();
        executeSearch(currentQuery);
        var inp = document.getElementById("lpGlobalSearchInput");
        if (inp) try { inp.focus({ preventScroll: true }); } catch (e) {}
      };
    });
  }

  function updateStatusLine(res) {
    var stEl = typeof document !== "undefined" ? document.getElementById("lpGsStatus") : null;
    if (!stEl) return;
    if (store.errorMsg) {
      stEl.innerHTML = '<span style="color:#ef4444;display:inline-flex;align-items:center;gap:5px;">' + gsIcon("alert", 13) + '<span>' + escHtml(store.errorMsg) + '</span></span>';
      return;
    }
    var loadText = store.loadedAll
      ? ("Sẵn sàng: " + (store.ieltsVocab.count + store.hskVocab.count).toLocaleString("en-US") + " từ • " + store.grammar.count + " ngữ pháp & lượng từ • " + store.ted.count + " TED")
      : ("Đang nạp dữ liệu (" + store.doneCount + "/" + store.totalSteps + ")...");
    if (res && currentQuery.trim()) {
      var right = "Khớp " + res.items.length + " kết quả (" + res.elapsedMs.toFixed(1) + " ms)";
      stEl.innerHTML = "<span>" + escHtml(loadText) + "</span><span>" + escHtml(right) + "</span>";
    } else {
      stEl.innerHTML = '<span>' + escHtml(loadText) + '</span><span class="lp-gs-kbd-badge">Ctrl+K</span>';
    }
  }

  function renderResultItemHtml(entry, idx, q) {
    var it = entry.item;
    var sel = idx === selectedIdx ? " is-selected" : "";
    var badge = "";
    var titleHtml = "";
    var metaHtml = "";
    var descHtml = "";

    if (entry.bucket === "lessons") {
      badge = '<span class="lp-gs-badge">' + gsIcon("grammar", 12) + '<span>Bài học ' + (it.course === "hsk" ? "HSK" : "IELTS") + '</span></span>';
      titleHtml = hlHtml(it.title, q);
      descHtml = hlHtml(it.desc, q);
    } else if (entry.bucket === "ielts_vocab") {
      badge = '<span class="lp-gs-badge ielts_vocab">' + gsIcon("vocab", 12) + '<span>IELTS Vocab</span></span>';
      titleHtml = hlHtml(it.word, q) + (it.pos ? ' <span class="lp-gs-submeta">' + escHtml(it.pos) + '</span>' : "");
      metaHtml = it.ipa ? '<span class="lp-gs-submeta">' + escHtml(it.ipa) + '</span>' : "";
      var defText = it.defVi || it.defEn || it.exPlain || "";
      descHtml = hlHtml(defText, q);
    } else if (entry.bucket === "hsk_vocab") {
      badge = '<span class="lp-gs-badge hsk_vocab">' + gsIcon("hsk", 12) + '<span>HSK ' + escHtml(it.level) + '</span></span>';
      titleHtml = hlHtml(it.word, q) + (it.pinyin ? ' <span class="lp-gs-submeta">' + escHtml(it.pinyin) + '</span>' : "");
      metaHtml = it.hanViet ? '<span class="lp-gs-submeta">[' + hlHtml(it.hanViet, q) + ']</span>' : "";
      descHtml = hlHtml(it.defVi || it.defEn || it.exText || "", q);
    } else if (entry.bucket === "grammar") {
      if (it.kind === "hsk_mw") {
        badge = '<span class="lp-gs-badge hsk_mw">' + gsIcon("layers", 12) + '<span>Lượng từ • HSK ' + escHtml(it.level) + '</span></span>';
        titleHtml = hlHtml(it.mw, q) + (it.pinyin ? ' <span class="lp-gs-submeta">' + hlHtml(it.pinyin, q) + '</span>' : "");
        metaHtml = it.hv ? '<span class="lp-gs-submeta">[' + hlHtml(it.hv, q) + ']</span>' : "";
        descHtml = hlHtml(it.meaning + (it.nounsText ? " • " + it.nounsText : ""), q);
      } else if (it.kind === "hsk_grammar") {
        badge = '<span class="lp-gs-badge grammar">' + gsIcon("grammar", 12) + '<span>HSK ' + escHtml(it.level) + ' Grammar</span></span>';
        titleHtml = hlHtml(it.title, q);
        descHtml = hlHtml(it.formula || it.summary || "", q);
      } else {
        badge = '<span class="lp-gs-badge grammar">' + gsIcon("grammar", 12) + '<span>IELTS Grammar</span></span>';
        titleHtml = hlHtml("Bài " + it.index + ": " + it.sectionName + " — " + it.title, q);
        descHtml = hlHtml(it.summaryText || it.unitTitle || "", q);
      }
    } else if (entry.bucket === "ted") {
      var hasSub = entry.matchedSubIdx >= 0 && it.subs && it.subs[entry.matchedSubIdx];
      var subTime = hasSub ? " • " + fmtTime(Math.max(0, (it.subs[entry.matchedSubIdx].time || 0) + (it.podOffsetMs || 0))) : "";
      badge = '<span class="lp-gs-badge ted">' + gsIcon("tedtalks", 12) + '<span>TED #' + escHtml(it.index) + escHtml(subTime) + '</span></span>';
      titleHtml = hlHtml(it.title, q);
      var snippet = entry.snippetEn || entry.snippetVi || it.unit || "";
      var extraLine = (entry.snippetEn && entry.snippetVi) ? (entry.snippetEn + " — " + entry.snippetVi) : snippet;
      descHtml = hlHtml(extraLine, q);
    }

    return '<a class="lp-gs-item' + sel + '" data-idx="' + idx + '" href="' + escHtml(entry.href) + '">' +
      '<div class="lp-gs-item-head">' + badge + '<span class="lp-gs-title">' + titleHtml + '</span>' + metaHtml + '</div>' +
      (descHtml ? '<div class="lp-gs-desc">' + descHtml + '</div>' : "") +
      '</a>';
  }

  function renderEmptySuggestions(host) {
    var chips = SUGGESTIONS.map(function (s) {
      var lbl = (s && typeof s === "object") ? s.label : String(s);
      var qry = (s && typeof s === "object") ? s.query : String(s);
      return '<button type="button" class="lp-gs-chip" data-suggest="' + escHtml(qry) + '">' + escHtml(lbl) + '</button>';
    }).join("");
    host.innerHTML = [
      '<div style="text-align:center;padding:22px 12px;">',
      '  <div style="font-size:13.5px;font-weight:700;color:var(--lg-ink-sub,var(--muted,#475569));">Hỗ trợ tiếng Việt không dấu, Pinyin và sửa lỗi gõ nhầm.</div>',
      '  <div class="lp-gs-chips">' + chips + '</div>',
      '</div>'
    ].join("");
    host.querySelectorAll(".lp-gs-chip").forEach(function (chip) {
      chip.onclick = function () {
        var val = chip.getAttribute("data-suggest") || "";
        var inp = document.getElementById("lpGlobalSearchInput");
        var clr = document.getElementById("lpGsClear");
        currentQuery = val;
        if (inp) inp.value = val;
        if (clr) clr.style.display = val ? "inline-flex" : "none";
        executeSearch(val);
        if (inp) try { inp.focus({ preventScroll: true }); } catch (e) {}
      };
    });
  }

  function syncSelectedItem() {
    var host = typeof document !== "undefined" ? document.getElementById("lpGsResults") : null;
    if (!host) return;
    var nodes = host.querySelectorAll(".lp-gs-item");
    nodes.forEach(function (el, idx) {
      el.classList.toggle("is-selected", idx === selectedIdx);
    });
    if (nodes[selectedIdx] && typeof nodes[selectedIdx].scrollIntoView === "function") {
      try { nodes[selectedIdx].scrollIntoView({ block: "nearest", behavior: "auto" }); } catch (e) {}
    }
  }

  function executeSearch(q) {
    var results = document.getElementById("lpGsResults");
    var focusedItem = results && results.contains(document.activeElement) ? document.activeElement : null;
    renderSearchResults(q);
    if (focusedItem && !focusedItem.isConnected) {
      var previousHref = focusedItem.getAttribute("href");
      var replacement = Array.from(results.querySelectorAll("a")).find(function (item) {
        return item.getAttribute("href") === previousHref;
      });
      (replacement || document.getElementById("lpGlobalSearchInput"))?.focus({ preventScroll: true });
    }
  }

  function renderSearchResults(q) {
    var host = typeof document !== "undefined" ? document.getElementById("lpGsResults") : null;
    var trimmed = String(q || "").trim();
    if (!trimmed) {
      currentItems = [];
      selectedIdx = 0;
      updateStatusLine(null);
      if (host) renderEmptySuggestions(host);
      return;
    }

    var res = searchAll(trimmed, activeTab);
    currentItems = res.items;
    selectedIdx = 0;
    updateStatusLine(res);
    if (!host) return;

    if (!res.items.length) {
      if (store.loading) {
        host.innerHTML = '<div style="text-align:center;padding:24px 12px;font-size:13.5px;color:var(--lg-ink-muted,var(--muted,#64748b));">Đang nạp dữ liệu (' + store.doneCount + '/' + store.totalSteps + ')...</div>';
      } else {
        host.innerHTML = '<div style="text-align:center;padding:24px 12px;"><div style="display:inline-flex;color:var(--lg-ink-muted,var(--muted,#64748b));">' + gsIcon("search", 26) + '</div><div style="font-weight:800;margin-top:6px;">Không tìm thấy kết quả phù hợp</div><div style="font-size:12.5px;color:var(--lg-ink-muted,var(--muted,#64748b));margin-top:4px;">Từ khóa "<strong>' + escHtml(trimmed) + '</strong>" không khớp mục nào.</div></div>';
      }
      return;
    }

    host.innerHTML = res.items.map(function (entry, idx) {
      return renderResultItemHtml(entry, idx, trimmed);
    }).join("");
  }

  function open(initialQuery) {
    var modal = ensureModalDom();
    if (!modal) return;
    lastFocusedEl = (typeof document !== "undefined" && document.activeElement) ? document.activeElement : null;
    if (!modalOpen && typeof document !== "undefined" && document.body && document.body.style) {
      prevBodyOverflow = document.body.style.overflow || "";
      document.body.style.overflow = "hidden";
    }
    modalOpen = true;
    modal.classList.add("open");
    if (!releaseFocus && globalScope.S4UI?.keepDialogFocus) {
      releaseFocus = globalScope.S4UI.keepDialogFocus(modal, document.getElementById("lpGlobalSearchInput"), lastFocusedEl);
    }
    if (typeof initialQuery === "string") {
      currentQuery = initialQuery;
    }
    var inp = document.getElementById("lpGlobalSearchInput");
    var clr = document.getElementById("lpGsClear");
    if (inp) {
      inp.value = currentQuery;
      setTimeout(function () {
        try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); }
      }, 20);
    }
    if (clr) clr.style.display = currentQuery.trim() ? "inline-flex" : "none";
    executeSearch(currentQuery);
    ensureLoaded();
  }

  function close() {
    var wasOpen = modalOpen;
    modalOpen = false;
    var modal = typeof document !== "undefined" ? document.getElementById("lpGlobalSearchModal") : null;
    if (modal) modal.classList.remove("open");
    if (releaseFocus) releaseFocus();
    releaseFocus = null;
    if (wasOpen) saveSearchState();
    if (wasOpen && typeof document !== "undefined" && document.body && document.body.style) {
      document.body.style.overflow = prevBodyOverflow || "";
    }
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      try { lastFocusedEl.focus({ preventScroll: true }); } catch (e) {}
    }
  }

  function isModalVisible(id) {
    var el = document.getElementById(id);
    if (!el) return false;
    if (el.style && (el.style.display === "none" || el.style.visibility === "hidden" || el.style.opacity === "0")) {
      return false;
    }
    if (typeof globalScope.getComputedStyle === "function") {
      try {
        var cs = globalScope.getComputedStyle(el);
        if (cs && (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0")) return false;
      } catch (e) {}
    }
    return true;
  }

  function hasBlockingModalOpen() {
    if (typeof document === "undefined") return false;
    return Boolean(
      isModalVisible("lpDisclaimerModal")
      || isModalVisible("s4AuthModal")
      || isModalVisible("s4ComingSoonModal")
    );
  }

  if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
    document.addEventListener("keydown", function (e) {
      if (e.isComposing || e.keyCode === 229) return;
      if ((e.ctrlKey || e.metaKey) && String(e.key || "").toLowerCase() === "k") {
        if (hasBlockingModalOpen()) return;
        e.preventDefault();
        if (modalOpen) {
          var inp = document.getElementById("lpGlobalSearchInput");
          if (inp) try { inp.focus({ preventScroll: true }); inp.select(); } catch (err) {}
        } else {
          open();
        }
        return;
      }
      if (e.key === "Escape" && modalOpen) {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    }, true);
  }

  document.addEventListener("click", function (event) {
    if (modalOpen && event.target.closest(".lp-gs-item")) saveSearchState(location.href);
  });
  window.addEventListener("pageshow", function (event) {
    if (!event.persisted && performance.getEntriesByType("navigation")[0]?.type !== "back_forward") return;
    try {
      if (JSON.parse(sessionStorage.getItem(stateKey))?.returnUrl === location.href) open();
    } catch (error) {}
  });

  globalScope.openGlobalSearchModal = function (q) {
    open(q);
  };

  globalScope.S4GlobalSearch = {
    open: open,
    close: close,
    ensureLoaded: ensureLoaded,
    searchAll: searchAll,
    getState: function () {
      return {
        open: modalOpen,
        loading: store.loading,
        loadedAll: store.loadedAll,
        doneCount: store.doneCount,
        ieltsCount: store.ieltsVocab.count,
        hskCount: store.hskVocab.count,
        grammarCount: store.grammar.count,
        tedCount: store.ted.count
      };
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
