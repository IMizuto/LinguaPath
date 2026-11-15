/**
 * LinguaPath - IELTS Intensive Speaking Controller
 * Tích hợp đầy đủ 6 phân hệ:
 *  - Unit 1: Academic Vocab & Idioms SRS (S4VocabEngine + adapter Speaking)
 *  - Units 2-4: Speaking Studio 5 chế độ (Sample, Shadowing CONTRACTION_MAP, Collocations, Record + Prep 60s, Review 4 tiêu chí & AI Prompt)
 *  - Unit 5: Chiến thuật & Phát âm Band 7.0-9.0 (Bài giảng + Checklist + Mini-quiz)
 *  - Unit 6: Practice Zone Phòng Thi Thật Fullscreen (Warm-up ID Check -> Part 1 Audio-only/Repeat -> Part 2 Prep 60s Lock + 120s Auto-Stop "Thank you" + Rounding-off -> Part 3 Audio-only/Repeat/Rephrase -> Examiner Report)
 */
(function (global) {
  'use strict';

  var STORAGE_DONE = 'lp_speaking_done_v1';
  var STORAGE_LAST = 'lp_speaking_last_v1';
  var STORAGE_NOTES = 'lp_speaking_notes_v1';
  var STORAGE_SUBMISSIONS = 'lp_speaking_submissions_v1';
  var STORAGE_PREFS = 'lp_speaking_prefs_v1';
  var VOCAB_SRS_KEY = 'lp_speaking_vocab_srs_v1';
  var VOCAB_DAYS_KEY = 'lp_speaking_vocab_days_v1';
  var VOCAB_SETTINGS_KEY = 'lp_speaking_vocab_settings_v1';
  var VOCAB_SESSION_KEY = 'lp_speaking_vocab_session_v1';

  var BAND_STEPS = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

  var CONTRACTION_MAP = {
    "i'm": 'i am', "you're": 'you are', "we're": 'we are', "they're": 'they are',
    "he's": 'he is', "she's": 'she is', "it's": 'it is', "that's": 'that is',
    "there's": 'there is', "here's": 'here is', "what's": 'what is', "who's": 'who is',
    "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have',
    "i'd": 'i would', "you'd": 'you would', "we'd": 'we would', "they'd": 'they would',
    "i'll": 'i will', "you'll": 'you will', "we'll": 'we will', "they'll": 'they will',
    "don't": 'do not', "doesn't": 'does not', "didn't": 'did not',
    "won't": 'will not', "wouldn't": 'would not', "can't": 'cannot',
    "couldn't": 'could not', "shouldn't": 'should not', "isn't": 'is not',
    "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not',
    "haven't": 'have not', "hasn't": 'has not', "hadn't": 'had not',
    'gonna': 'going to', 'wanna': 'want to', 'gotta': 'got to', 'kinda': 'kind of'
  };

  var NUMBER_WORD_MAP = {
    '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
    '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten'
  };

  var DISCOURSE_CONNECTORS = [
    'however', 'having said that', 'on the flip side', 'on the other hand', 'nevertheless',
    'moreover', 'furthermore', 'consequently', 'therefore', 'for instance', 'for example',
    'specifically', 'to be honest', 'to be perfectly candid', 'generally speaking', 'in hindsight',
    'ultimately', 'meanwhile', 'whereas', 'although', 'even though', 'because'
  ];

  var HESITATION_FILLERS = ['um', 'uh', 'er', 'erm', 'ah', 'like', 'basically', 'literally', 'actually'];

  var UNITS_LIST = [
    { id: 'all', pill: 'Tất cả', label: 'Tất cả' },
    { id: 'u_1', pill: 'Vocab', label: 'Vocab SRS' },
    { id: 'u_2', pill: 'P1', label: 'Part 1' },
    { id: 'u_34', pill: 'P2 & 3', label: 'Part 2 & 3' },
    { id: 'u_5', pill: 'Phát âm & CT', label: 'Phát âm & Chiến thuật' },
    { id: 'u_6', pill: 'Practice Zone', label: 'Practice Zone' }
  ];

  // State trung tâm
  var allLessons = [];
  var parsedStats = null;
  var activeLesson = null;
  var activeUnitFilter = 'u_2';
  var desktopUserCollapsed = false;
  var folderExpandState = {};   // { [folderTitle]: boolean } — chỉ render item khi folder mở
  var folderLimits = {};        // { [folderTitle]: number } — phân trang 60 bài / batch cho máy 8GB RAM
  var isAllFoldersCollapsed = true;
  var FOLDER_PAGE_SIZE = 60;

  function normalizeFilterUnit(uid) {
    return (uid === 'u_3' || uid === 'u_4' || uid === 'u_34') ? 'u_34' : (uid || 'u_2');
  }

  function getSidebarFolderKey(item, unitFilter) {
    if (!item) return '';
    if (unitFilter === 'all') return item.unitTitle;
    if (unitFilter === 'u_34') {
      return String(item.group || 'Part 2 & 3').replace(/Part 2\s*·\s*/i, 'Part 2 & 3 · ');
    }
    return item.group || item.unitTitle;
  }

  var prefs = {
    voiceAccent: 'en-GB',
    shadowSpeed: 0.95,
    pzStrictness: 'strict',
    pzStrictTimers: true,
    showVi: true,
    showRoles: true
  };

  var studioState = {
    mode: 'sample',         // 'sample' | 'shadowing' | 'drill' | 'record' | 'review'
    qIndex: 0,
    sampleIdx: 0,
    shadowIdx: 0,
    shadowResult: null,
    shadowSpokenText: '',
    shadowAudioUrl: '',
    shadowDurationSec: 0,
    shadowStatusKind: '',
    shadowStatusMsg: '',
    shadowListenAuto: false,
    drillAnswers: {},       // { [drillId]: pickedOption }
    theoryAnswers: {},      // { [qIdx]: pickedIdx }
    pronDrillScore: null,
    pronDrillTarget: '',
    prepLeftSec: 60,
    prepRunning: false,
    prepTimerId: null,
    recordingSec: 0,
    recTranscript: '',
    recWpm: 0,
    recAudioId: null,
    recAudioUrl: '',
    scores: { fc: 6.5, lr: 6.5, gra: 6.5, pr: 6.5 },
    aiFeedback: '',
    aiBandOverride: ''
  };

  var historyFilter = 'all';
  var selectedPzLessonId = 'sp_pz_full_act_1';
  var pickerCategoryFilter = 'all'; // 'all' | 'full_actual' | 'full_sample' | 'topic_p1' | 'topic_p23'
  var pickerRenderLimit = 48;
  var shadowAutoListenGen = 0;

  // State Phòng thi Practice Zone Fullscreen
  var pzExam = {
    active: false,
    lesson: null,
    strictness: 'strict',
    strictTimers: true,
    voiceLang: 'en-GB',
    peekVisible: false,
    phase: 'warmup',        // 'warmup' | 'part1' | 'part2_prep' | 'part2_talk' | 'part2_round' | 'part3' | 'report'
    subStage: 'ready',      // 'ready' | 'examiner_speaking' | 'candidate_recording' | 'stopped_notice'
    stepIndex: 0,           // Index trong Part 1 (0..7) hoặc Part 3 (0..3)
    p2PrepLeft: 60,
    p2TalkElapsed: 0,
    rephraseShown: false,
    rephraseCount: 0,
    repeatCount: 0,
    examinerSpeaking: false,
    timerId: null,
    turnElapsedSec: 0,
    startedAt: 0,
    prepNote: '',
    responses: [],          // [{ key, phase, label, question, transcript, durationSec, wpm, audioId, audioUrl, usedRephrase, usedRepeat }]
    reportScores: { fc: 6.5, lr: 6.5, gra: 6.5, pr: 6.5 },
    reportFeedback: '',
    savedToHistory: false
  };

  // =========================================================================
  // 1. TIỆN ÍCH CƠ BẢN, LƯU TRỮ & ĐỒNG BỘ
  // =========================================================================
  function escHtml(str) {
    if (global.S4UI && typeof global.S4UI.escapeHtml === 'function') {
      return global.S4UI.escapeHtml(String(str == null ? '' : str));
    }
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escJsAttr(str) {
    return escHtml(
      String(str == null ? '' : str)
        .replace(/\\/g, '\\\\')
        .replace(/\r?\n/g, ' ')
        .replace(/'/g, "\\'")
    );
  }

  function showToast(msg, type, customDuration) {
    if (global.S4UI && typeof global.S4UI.toast === 'function') {
      var dur = Number(customDuration) || (msg && String(msg).length > 65 ? 4600 : 0);
      var opts = dur ? { duration: dur } : undefined;
      global.S4UI.toast(type || 'info', msg, opts);
    }
  }

  function showMicSttWarning(code, msg) {
    showToast(msg || 'Không nhận diện được giọng nói lúc này.', 'warn', 5500);
  }

  function uiConfirm(msg, opts) {
    if (global.S4UI && typeof global.S4UI.confirm === 'function') {
      return global.S4UI.confirm(msg, opts || {});
    }
    return Promise.resolve(global.confirm ? global.confirm(msg) : true);
  }

  function uiPrompt(msg, opts) {
    if (global.S4UI && typeof global.S4UI.prompt === 'function') {
      return global.S4UI.prompt(msg, opts || {});
    }
    var val = global.prompt ? global.prompt(msg, (opts && opts.defaultValue) || '') : null;
    return Promise.resolve(val);
  }

  function loadJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed !== null && typeof parsed === 'object' ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveJson(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  function formatSec(totalSec) {
    var sec = Math.max(0, Math.floor(Number(totalSec) || 0));
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function countWords(text) {
    var clean = String(text || '').trim();
    return clean ? clean.split(/\s+/).filter(Boolean).length : 0;
  }

  function computeWpm(text, seconds) {
    var wc = countWords(text);
    if (!wc) return 0;
    var sec = Math.max(3, Number(seconds) || 0);
    return Math.round((wc * 60) / sec);
  }

  function roundIeltsBand(avg) {
    return Math.round(Number(avg || 0) * 2) / 2;
  }

  function getDoneList() {
    var arr = loadJson(STORAGE_DONE, []);
    return Array.isArray(arr) ? arr : [];
  }

  function setDoneList(arr) {
    saveJson(STORAGE_DONE, Array.isArray(arr) ? arr : []);
  }

  function isLessonDone(lessonId) {
    return getDoneList().indexOf(lessonId) !== -1;
  }

  function markLessonDone(lessonId, state) {
    var list = getDoneList();
    var idx = list.indexOf(lessonId);
    if (state && idx === -1) list.push(lessonId);
    if (!state && idx !== -1) list.splice(idx, 1);
    setDoneList(list);
    updateTopStats();
  }

  function getNotesMap() {
    return loadJson(STORAGE_NOTES, {});
  }

  function getSubmissions() {
    var arr = loadJson(STORAGE_SUBMISSIONS, []);
    return Array.isArray(arr) ? arr : [];
  }

  function saveSubmissionRecord(rec) {
    var list = getSubmissions();
    var idx = list.findIndex(function (x) { return x && x.id === rec.id; });
    if (idx !== -1) list[idx] = rec;
    else list.unshift(rec);
    if (list.length > 80) list = list.slice(0, 80);
    saveJson(STORAGE_SUBMISSIONS, list);
    updateTopStats();
    renderLobbyHistory();
  }

  function loadPrefs() {
    var saved = loadJson(STORAGE_PREFS, null);
    if (saved) prefs = Object.assign({}, prefs, saved);
  }

  function savePrefs() {
    saveJson(STORAGE_PREFS, prefs);
  }

  // =========================================================================
  // 2. INDEXEDDB AUDIO VAULT (LƯU FILE GHI ÂM CỤC BỘ KHÔNG NGỐN QUOTA)
  // =========================================================================
  var AudioVault = (function () {
    var DB_NAME = 'LinguaPathSpeakingAudio';
    var STORE_NAME = 'recordings';
    var dbPromise = null;
    var objectUrls = new Map();

    function openDb() {
      if (dbPromise) return dbPromise;
      if (typeof indexedDB === 'undefined') {
        dbPromise = Promise.resolve(null);
        return dbPromise;
      }
      dbPromise = new Promise(function (resolve) {
        try {
          var req = indexedDB.open(DB_NAME, 1);
          req.onupgradeneeded = function (e) {
            var db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
          };
          req.onsuccess = function (e) { resolve(e.target.result); };
          req.onerror = function () { resolve(null); };
        } catch (e) {
          resolve(null);
        }
      });
      return dbPromise;
    }

    function saveBlob(id, blob) {
      if (!id || !blob) return Promise.resolve(null);
      try {
        var url = URL.createObjectURL(blob);
        objectUrls.set(id, url);
      } catch (e) {}
      return openDb().then(function (db) {
        if (!db) return objectUrls.get(id) || null;
        return new Promise(function (resolve) {
          try {
            var tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).put({
              id: id,
              blob: blob,
              mimeType: blob.type || 'audio/webm',
              createdAt: Date.now()
            });
            tx.oncomplete = function () { resolve(objectUrls.get(id) || null); };
            tx.onerror = function () { resolve(objectUrls.get(id) || null); };
          } catch (e) {
            resolve(objectUrls.get(id) || null);
          }
        });
      });
    }

    function getUrl(id) {
      if (!id) return Promise.resolve('');
      if (objectUrls.has(id)) return Promise.resolve(objectUrls.get(id));
      return openDb().then(function (db) {
        if (!db) return '';
        return new Promise(function (resolve) {
          try {
            var tx = db.transaction(STORE_NAME, 'readonly');
            var req = tx.objectStore(STORE_NAME).get(id);
            req.onsuccess = function () {
              var res = req.result;
              if (res && res.blob) {
                try {
                  var url = URL.createObjectURL(res.blob);
                  objectUrls.set(id, url);
                  resolve(url);
                  return;
                } catch (e) {}
              }
              resolve('');
            };
            req.onerror = function () { resolve(''); };
          } catch (e) {
            resolve('');
          }
        });
      });
    }

    function remove(id) {
      if (!id) return Promise.resolve();
      if (objectUrls.has(id)) {
        try { URL.revokeObjectURL(objectUrls.get(id)); } catch (e) {}
        objectUrls.delete(id);
      }
      return openDb().then(function (db) {
        if (!db) return;
        return new Promise(function (resolve) {
          try {
            var tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).delete(id);
            tx.oncomplete = resolve;
            tx.onerror = resolve;
          } catch (e) { resolve(); }
        });
      });
    }

    return { saveBlob: saveBlob, getUrl: getUrl, remove: remove };
  })();

  // =========================================================================
  // 3. TEXT-TO-SPEECH ENGINE (UK / AU / US NATURAL EXAMINER)
  // =========================================================================
  var TtsEngine = (function () {
    var activeToken = 0;
    var activeSeqGen = 0;
    var activeAudioEl = null;
    var activeMediaTimeoutId = null;

    function normVoiceLang(langCode) {
      return String(langCode || '').toLowerCase().replace(/_/g, '-');
    }

    function scoreVoice(v) {
      var n = String(v && v.name || '').toLowerCase();
      var s = 0;
      if (/natural|online|neural|enhanced|premium/.test(n)) s += 50;
      if (/google|microsoft|samantha|daniel|karen|catherine|gordon|arthur|libby|ryan|sonia|natasha|william|olivia|hazel|george|susan/.test(n)) s += 25;
      if (v && v.localService === false) s += 10;
      return s;
    }

    function sortVoices(list) {
      return (list || []).slice().sort(function (a, b) {
        return scoreVoice(b) - scoreVoice(a);
      });
    }

    function pickVoiceProfile(langCode) {
      var requested = String(langCode || 'en-GB');
      if (!global.speechSynthesis || typeof global.speechSynthesis.getVoices !== 'function') {
        return { voice: null, lang: requested, pitch: 1.0, hasExact: false, fallbackKind: 'no-api' };
      }
      var voices = global.speechSynthesis.getVoices() || [];
      if (!voices.length) {
        return { voice: null, lang: requested, pitch: 1.0, hasExact: false, fallbackKind: 'empty' };
      }
      var target = normVoiceLang(requested || 'en-GB');
      var base = target.split('-')[0];
      var byLang = function (code) {
        return sortVoices(voices.filter(function (v) {
          return normVoiceLang(v.lang) === code;
        }));
      };
      var exact = voices.filter(function (v) {
        var vl = normVoiceLang(v.lang);
        if (vl === target) return true;
        if (target === 'en-au' && vl.indexOf('en') === 0 && /australia/i.test(String(v.name || ''))) return true;
        return false;
      });
      var sortedExact = sortVoices(exact);
      if (sortedExact.length) {
        return {
          voice: sortedExact[0],
          lang: sortedExact[0].lang || requested,
          pitch: 1.0,
          hasExact: true,
          fallbackKind: 'exact'
        };
      }

      var ukPrimary = byLang('en-gb')[0] || null;
      var usPrimary = byLang('en-us')[0] || null;

      // Keep AU acoustically distinct from US/UK when OS lacks en-AU:
      // 1) prefer Commonwealth variants (en-nz/en-ie/en-za), 2) distinct en-GB voice (e.g. Google UK Male vs Female),
      // 3) pitch-shifted en-GB or non-primary en-US rather than silently playing the exact US default.
      if (target === 'en-au') {
        var cwCodes = ['en-nz', 'en-ie', 'en-za'];
        for (var c = 0; c < cwCodes.length; c++) {
          var cwList = byLang(cwCodes[c]);
          if (cwList.length) {
            return { voice: cwList[0], lang: cwList[0].lang || cwCodes[c], pitch: 0.96, hasExact: false, fallbackKind: 'commonwealth' };
          }
        }
        var gbList = byLang('en-gb');
        if (gbList.length) {
          var altGb = ukPrimary
            ? gbList.filter(function (v) { return v.name !== ukPrimary.name; })[0] || null
            : gbList[0];
          if (altGb) {
            return { voice: altGb, lang: altGb.lang || 'en-GB', pitch: 0.97, hasExact: false, fallbackKind: 'alt-gb' };
          }
          return { voice: gbList[0], lang: gbList[0].lang || 'en-GB', pitch: 0.88, hasExact: false, fallbackKind: 'gb-pitch' };
        }
        var usListForAu = byLang('en-us');
        if (usListForAu.length) {
          var altUs = usPrimary
            ? usListForAu.filter(function (v) { return v.name !== usPrimary.name; })[0] || null
            : usListForAu[0];
          if (altUs) {
            return { voice: altUs, lang: altUs.lang || 'en-US', pitch: 0.92, hasExact: false, fallbackKind: 'alt-us' };
          }
          return { voice: usListForAu[0], lang: usListForAu[0].lang || 'en-US', pitch: 0.86, hasExact: false, fallbackKind: 'us-pitch' };
        }
      }

      var fallbacks = target === 'en-gb'
        ? ['en-au', 'en-nz', 'en-ie', 'en-za', 'en-us']
        : target === 'en-us'
          ? ['en-ca', 'en-gb', 'en-au']
          : [];
      for (var f = 0; f < fallbacks.length; f++) {
        var fbList = byLang(fallbacks[f]);
        if (fbList.length) {
          return { voice: fbList[0], lang: fbList[0].lang || requested, pitch: 0.98, hasExact: false, fallbackKind: 'lang-fallback' };
        }
      }

      var langPrefix = sortVoices(voices.filter(function (v) {
        return normVoiceLang(v.lang).indexOf(base) === 0;
      }));
      var picked = langPrefix[0] || null;
      return {
        voice: picked,
        lang: (picked && picked.lang) || requested,
        pitch: 1.0,
        hasExact: false,
        fallbackKind: picked ? 'prefix' : 'none'
      };
    }

    function clearMediaTimeout() {
      if (activeMediaTimeoutId) {
        clearTimeout(activeMediaTimeoutId);
        activeMediaTimeoutId = null;
      }
    }

    function stopMediaOnly() {
      clearMediaTimeout();
      if (activeAudioEl) {
        try {
          activeAudioEl.onplaying = null;
          activeAudioEl.onended = null;
          activeAudioEl.onerror = null;
          activeAudioEl.pause();
          activeAudioEl.src = '';
        } catch (e) {}
        activeAudioEl = null;
      }
    }

    function stop() {
      activeToken++;
      activeSeqGen++;
      stopMediaOnly();
      try {
        if (global.speechSynthesis) global.speechSynthesis.cancel();
      } catch (e) {}
    }

    function speak(text, opts) {
      var o = opts || {};
      var cleanText = String(text || '').replace(/\s+/g, ' ').trim();
      var token = ++activeToken;
      stopMediaOnly();
      if (!cleanText) {
        if (o.onEnd) o.onEnd();
        return token;
      }

      if (!global.speechSynthesis || typeof global.SpeechSynthesisUtterance !== 'function') {
        if (o.onStart) o.onStart();
        setTimeout(function () {
          if (token === activeToken && o.onEnd) o.onEnd();
        }, Math.min(2500, Math.max(800, cleanText.length * 35)));
        return token;
      }

      try {
        global.speechSynthesis.cancel();
      } catch (e) {}

      var lang = o.lang || prefs.voiceAccent || 'en-GB';
      var profile = pickVoiceProfile(lang);
      var utter = new global.SpeechSynthesisUtterance(cleanText);
      utter.rate = Number(o.rate || 0.96);
      utter.pitch = profile.pitch || 1.0;

      if (profile.voice) {
        utter.voice = profile.voice;
        utter.lang = profile.voice.lang || profile.lang || lang;
      } else {
        utter.lang = lang;
      }

      var finished = false;
      var finish = function () {
        if (finished) return;
        finished = true;
        if (token === activeToken && o.onEnd) o.onEnd();
      };

      utter.onstart = function () {
        if (token === activeToken && o.onStart) o.onStart();
      };
      utter.onend = finish;
      utter.onerror = finish;

      var maxWait = Math.max(3500, cleanText.length * 95);
      setTimeout(function () {
        if (!finished && token === activeToken) finish();
      }, maxWait);

      try {
        if (o.onStart) o.onStart();
        global.speechSynthesis.speak(utter);
      } catch (e) {
        finish();
      }
      return token;
    }

    function playMedia(audioUrl, fallbackText, opts) {
      var o = opts || {};
      var resolved = (global.SpeakingParser && typeof global.SpeakingParser.resolveMediaUrl === 'function')
        ? global.SpeakingParser.resolveMediaUrl(audioUrl)
        : String(audioUrl || '');

      if (!resolved || typeof Audio !== 'function') {
        return speak(fallbackText, o);
      }

      var token = ++activeToken;
      stopMediaOnly();
      try { if (global.speechSynthesis) global.speechSynthesis.cancel(); } catch (e) {}

      var fellBack = false;
      var doFallback = function () {
        if (fellBack || token !== activeToken) return;
        fellBack = true;
        stopMediaOnly();
        if (fallbackText) {
          speak(fallbackText, { lang: o.lang, rate: o.rate, onEnd: o.onEnd });
        } else if (o.onEnd) {
          o.onEnd();
        }
      };

      try {
        var el = new Audio(resolved);
        activeAudioEl = el;
        el.playbackRate = Math.max(0.6, Math.min(1.5, Number(o.rate || 1.0)));
        if (o.onStart) o.onStart();
        activeMediaTimeoutId = setTimeout(function () {
          if (!fellBack && token === activeToken && activeAudioEl === el && (el.paused || el.readyState < 2)) {
            doFallback();
          }
        }, 4500);
        el.onplaying = function () {
          clearMediaTimeout();
        };
        el.onended = function () {
          clearMediaTimeout();
          if (activeAudioEl === el) activeAudioEl = null;
          if (token === activeToken && o.onEnd) o.onEnd();
        };
        el.onerror = doFallback;
        var p = el.play();
        if (p && typeof p.catch === 'function') p.catch(doFallback);
      } catch (e) {
        doFallback();
      }
      return token;
    }

    function speakSequence(items, opts) {
      var list = (items || []).filter(Boolean);
      var o = opts || {};
      var seqId = ++activeSeqGen;
      if (!list.length) {
        if (o.onEnd) o.onEnd();
        return;
      }
      var idx = 0;
      function next() {
        if (seqId !== activeSeqGen) return;
        if (idx >= list.length) {
          if (o.onEnd) o.onEnd();
          return;
        }
        var current = list[idx++];
        var cbOpts = {
          lang: o.lang,
          rate: o.rate,
          onStart: idx === 1 ? o.onStart : null,
          onEnd: function () {
            if (seqId !== activeSeqGen) return;
            setTimeout(next, 220);
          }
        };
        if (current && typeof current === 'object') {
          playMedia(current.audioUrl || '', current.text || '', cbOpts);
        } else {
          speak(current, cbOpts);
        }
      }
      next();
    }

    if (global.speechSynthesis && global.speechSynthesis.addEventListener) {
      try { global.speechSynthesis.addEventListener('voiceschanged', function () {}); } catch (e) {}
    }

    return {
      speak: speak,
      playMedia: playMedia,
      speakSequence: speakSequence,
      getVoiceInfo: function (langCode) {
        return pickVoiceProfile(langCode || prefs.voiceAccent || 'en-GB');
      },
      stop: stop
    };
  })();

  // =========================================================================
  // 4. MICROPHONE RECORDER + SPEECH RECOGNITION + WAVEFORM ANALYSER
  // =========================================================================
  var MicEngine = (function () {
    var stream = null;
    var mediaRecorder = null;
    var audioChunks = [];
    var recognition = null;
    var analyser = null;
    var audioCtx = null;
    var rafId = null;
    var secTimerId = null;
    var sttTimerId = null;
    var isRecording = false;
    var startTs = 0;
    var committedTranscript = '';
    var sessionFinalTranscript = '';
    var finalTranscript = '';
    var interimTranscript = '';
    var sttFatal = false;
    var hasSpeechResult = false;
    var emptyRestartCount = 0;
    var lastWarnedCode = '';
    var currentCallbacks = null;
    var onAutoStopCb = null;

    var STT_FATAL_CODES = {
      'not-allowed': true,
      'service-not-allowed': true,
      'audio-capture': true,
      'language-not-supported': true,
      'network': true
    };

    var STT_ERROR_MESSAGES = {
      'not-supported': 'Trình duyệt/WebView này chưa hỗ trợ nhận diện giọng nói tự động (STT). App vẫn ghi âm để bạn nghe lại và gõ/dán văn bản so khớp.',
      'network': 'Không kết nối được máy chủ nhận diện giọng nói (lỗi mạng/VPN hoặc trình duyệt chặn Web Speech). Vẫn đang thu âm để bạn nghe lại hoặc nhập tay để chấm.',
      'not-allowed': 'Trình duyệt đang chặn quyền Microphone. Hãy bấm biểu tượng ổ khóa trên thanh địa chỉ → Cho phép Micro rồi thử lại.',
      'service-not-allowed': 'Dịch vụ nhận diện giọng nói bị chặn bởi chính sách trình duyệt/ứng dụng (cần Chrome/Edge trên HTTPS hoặc localhost).',
      'audio-capture': 'Không thu được tín hiệu từ Micro (chưa cắm mic, micro bị app khác chiếm hoặc xung đột tai nghe Bluetooth Hands-Free).',
      'language-not-supported': 'Trình duyệt không hỗ trợ gói ngôn ngữ giọng đọc đang chọn (hãy thử đổi UK/US hoặc dùng Chrome/Edge mới nhất).',
      'aborted': 'Phiên nhận diện giọng nói bị ngắt đột ngột do xung đột âm thanh. Bạn vẫn có thể tiếp tục thu âm hoặc bấm thu lại.',
      'no-speech': 'Chưa nghe thấy giọng nói rõ ràng. Hãy đưa micro lại gần hơn hoặc gõ trực tiếp văn bản nếu đang dùng thiết bị không có mic.'
    };

    function getSttConstructor() {
      return global.SpeechRecognition || global.webkitSpeechRecognition || null;
    }

    function describeSttError(code) {
      return STT_ERROR_MESSAGES[code] || ('Lỗi nhận diện giọng nói (' + (code || 'unknown') + '). Bạn vẫn có thể thu âm nghe lại hoặc nhập văn bản để chấm.');
    }

    function describeMediaError(err) {
      var name = err && err.name ? String(err.name) : '';
      var rawMsg = err && err.message ? String(err.message) : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        return STT_ERROR_MESSAGES['not-allowed'];
      }
      if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        return 'Không tìm thấy thiết bị Micro trên máy/điện thoại. Hãy cắm micro hoặc gõ trực tiếp văn bản để so khớp & chấm điểm.';
      }
      if (name === 'NotReadableError' || name === 'TrackStartError') {
        return 'Micro đang bị ứng dụng khác (Zoom, Meet, ghi âm...) chiếm quyền. Hãy đóng app khác rồi thử lại.';
      }
      if (name === 'SecurityError') {
        return 'Trình duyệt yêu cầu kết nối HTTPS hoặc localhost để mở quyền Microphone.';
      }
      return 'Không truy cập được micro (' + (rawMsg || name || 'Permission denied') + '). Bạn vẫn có thể gõ hoặc dán bài nói để phân tích & chấm điểm!';
    }

    function emitSttWarning(code) {
      var normalized = String(code || 'unknown');
      if (normalized === lastWarnedCode) return;
      lastWarnedCode = normalized;
      if (currentCallbacks && typeof currentCallbacks.onSttWarning === 'function') {
        currentCallbacks.onSttWarning(normalized, describeSttError(normalized));
      }
    }

    function stopResources() {
      isRecording = false;
      sttFatal = false;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      if (secTimerId) { clearInterval(secTimerId); secTimerId = null; }
      if (sttTimerId) { clearTimeout(sttTimerId); sttTimerId = null; }
      if (recognition) {
        try {
          recognition.onresult = null;
          recognition.onend = null;
          recognition.onerror = null;
          recognition.stop();
        } catch (e) {}
        recognition = null;
      }
      if (audioCtx) {
        try { audioCtx.close(); } catch (e) {}
        audioCtx = null;
        analyser = null;
      }
      if (stream) {
        try {
          stream.getTracks().forEach(function (t) { t.stop(); });
        } catch (e) {}
        stream = null;
      }
    }

    function startWaveLoop(barSelector) {
      if (!analyser) return;
      var dataArr = new Uint8Array(analyser.frequencyBinCount);
      function tick() {
        if (!isRecording || !analyser) return;
        analyser.getByteFrequencyData(dataArr);
        var bars = document.querySelectorAll(barSelector);
        if (bars && bars.length) {
          var step = Math.max(1, Math.floor(dataArr.length / bars.length));
          for (var i = 0; i < bars.length; i++) {
            var val = dataArr[Math.min(dataArr.length - 1, i * step)] || 0;
            var h = Math.max(6, Math.round((val / 255) * 34));
            bars[i].style.height = h + 'px';
          }
        }
        rafId = requestAnimationFrame(tick);
      }
      rafId = requestAnimationFrame(tick);
    }

    function start(opts) {
      var o = opts || {};
      if (isRecording) return Promise.resolve(false);
      TtsEngine.stop();

      currentCallbacks = o;
      onAutoStopCb = o.onFinish || null;
      committedTranscript = '';
      sessionFinalTranscript = '';
      finalTranscript = '';
      interimTranscript = '';
      audioChunks = [];
      sttFatal = false;
      hasSpeechResult = false;
      emptyRestartCount = 0;
      lastWarnedCode = '';
      startTs = Date.now();

      var canMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      var SttCtor = getSttConstructor();

      if (!canMedia && !SttCtor) {
        if (o.onUnsupported) o.onUnsupported('Trình duyệt không hỗ trợ ghi âm / nhận diện giọng nói. Bạn vẫn có thể gõ hoặc dán transcript để chấm điểm!');
        return Promise.resolve(false);
      }

      var streamPromise = canMedia
        ? navigator.mediaDevices.getUserMedia({ audio: true })
        : Promise.resolve(null);

      return streamPromise.then(function (mediaStream) {
        stream = mediaStream;
        isRecording = true;
        startTs = Date.now();

        if (stream && typeof global.MediaRecorder === 'function') {
          try {
            mediaRecorder = new global.MediaRecorder(stream);
            mediaRecorder.ondataavailable = function (ev) {
              if (ev.data && ev.data.size > 0) audioChunks.push(ev.data);
            };
            mediaRecorder.start(250);
          } catch (e) {
            mediaRecorder = null;
          }
        }

        if (stream) {
          try {
            var AC = global.AudioContext || global.webkitAudioContext;
            if (AC) {
              audioCtx = new AC();
              if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
                audioCtx.resume().catch(function () {});
              }
              var src = audioCtx.createMediaStreamSource(stream);
              analyser = audioCtx.createAnalyser();
              analyser.fftSize = 64;
              src.connect(analyser);
              startWaveLoop(o.waveSelector || '.sp-wave-bar');
            }
          } catch (e) {}
        }

        if (SttCtor) {
          try {
            recognition = new SttCtor();
            recognition.lang = o.lang || prefs.voiceAccent || 'en-GB';
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.onresult = function (ev) {
              hasSpeechResult = true;
              emptyRestartCount = 0;
              var finals = '';
              var interims = '';
              for (var i = 0; i < ev.results.length; i++) {
                var r = ev.results[i];
                if (r.isFinal) finals += r[0].transcript + ' ';
                else interims += r[0].transcript + ' ';
              }
              sessionFinalTranscript = finals.trim();
              finalTranscript = [committedTranscript, sessionFinalTranscript].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
              interimTranscript = interims.trim();
              if (currentCallbacks && currentCallbacks.onTranscript) {
                var combined = [finalTranscript, interimTranscript].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
                currentCallbacks.onTranscript(combined, Math.max(1, Math.round((Date.now() - startTs) / 1000)));
              }
            };
            recognition.onerror = function (err) {
              var code = (err && err.error) ? String(err.error) : 'no-speech';
              if (STT_FATAL_CODES[code]) {
                sttFatal = true;
                emitSttWarning(code);
                if (!mediaRecorder && isRecording) {
                  stop();
                }
                return;
              }
              if (!finalTranscript && !interimTranscript) {
                emitSttWarning(code);
              }
            };
            recognition.onend = function () {
              if (sessionFinalTranscript) {
                committedTranscript = [committedTranscript, sessionFinalTranscript].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
                finalTranscript = committedTranscript;
                sessionFinalTranscript = '';
              }
              interimTranscript = '';
              if (!isRecording || !recognition || sttFatal) return;

              if (!hasSpeechResult) {
                emptyRestartCount++;
                if (emptyRestartCount >= 3) {
                  sttFatal = true;
                  emitSttWarning('no-speech');
                  return;
                }
              } else {
                hasSpeechResult = false;
              }

              // Nghỉ nhẹ 160ms trước khi nối phiên mới để tránh xung đột phần cứng
              if (sttTimerId) clearTimeout(sttTimerId);
              sttTimerId = setTimeout(function () {
                if (!isRecording || !recognition || sttFatal) return;
                try {
                  recognition.start();
                } catch (e) {
                  sttFatal = true;
                  emitSttWarning('aborted');
                }
              }, 160);
            };
            recognition.start();
          } catch (e) {
            recognition = null;
            sttFatal = true;
            emitSttWarning('aborted');
          }
        }

        secTimerId = setInterval(function () {
          if (!isRecording) return;
          var sec = Math.max(1, Math.round((Date.now() - startTs) / 1000));
          if (currentCallbacks && currentCallbacks.onTick) currentCallbacks.onTick(sec);
          if (o.maxSeconds && sec >= o.maxSeconds) {
            stop();
          }
        }, 500);

        if (o.onStart) o.onStart();
        if (!SttCtor) {
          emitSttWarning('not-supported');
        }
        return true;
      }).catch(function (err) {
        stopResources();
        if (o.onUnsupported) {
          o.onUnsupported(describeMediaError(err));
        }
        return false;
      });
    }

    function stop() {
      if (!isRecording) return Promise.resolve(null);
      var elapsed = Math.max(1, Math.round((Date.now() - startTs) / 1000));
      var transcript = (finalTranscript + ' ' + interimTranscript).replace(/\s+/g, ' ').trim();
      var recorderRef = mediaRecorder;
      var chunksRef = audioChunks.slice();
      var finishCb = onAutoStopCb;
      mediaRecorder = null;
      audioChunks = [];
      onAutoStopCb = null;
      currentCallbacks = null;

      return new Promise(function (resolve) {
        var finalizeBlob = function (blob) {
          stopResources();
          var id = blob ? ('sp_rec_' + Date.now() + '_' + Math.floor(Math.random() * 1000)) : null;
          var saveProm = (blob && id) ? AudioVault.saveBlob(id, blob) : Promise.resolve('');
          saveProm.then(function (url) {
            var payload = {
              id: id,
              url: url || '',
              durationSec: elapsed,
              transcript: transcript,
              wpm: computeWpm(transcript, elapsed)
            };
            if (finishCb) finishCb(payload);
            resolve(payload);
          });
        };

        if (recorderRef && recorderRef.state !== 'inactive') {
          try {
            recorderRef.onstop = function () {
              var blob = chunksRef.length ? new Blob(chunksRef, { type: recorderRef.mimeType || 'audio/webm' }) : null;
              finalizeBlob(blob);
            };
            recorderRef.ondataavailable = function (ev) {
              if (ev.data && ev.data.size > 0) chunksRef.push(ev.data);
            };
            recorderRef.stop();
            return;
          } catch (e) {}
        }
        finalizeBlob(null);
      });
    }

    function cancel() {
      onAutoStopCb = null;
      currentCallbacks = null;
      var recorderRef = mediaRecorder;
      mediaRecorder = null;
      audioChunks = [];
      if (recorderRef && recorderRef.state !== 'inactive') {
        try {
          recorderRef.onstop = null;
          recorderRef.ondataavailable = null;
          recorderRef.stop();
        } catch (e) {}
      }
      stopResources();
    }

    return {
      start: start,
      stop: stop,
      cancel: cancel,
      isActive: function () { return isRecording; }
    };
  })();

  // =========================================================================
  // 5. THUẬT TOÁN SO KHỚP SHADOWING & PHÂN TÍCH TỪ VỰNG / 4 TIÊU CHÍ
  // =========================================================================
  function normalizeWordClean(raw) {
    return String(raw || '')
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, '');
  }

  function expandTextTokens(text) {
    var tokens = String(text || '')
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[—–\/]+/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
    var out = [];
    var pushNormalized = function (rawWord) {
      var mapped = NUMBER_WORD_MAP[rawWord] || rawWord;
      if (mapped) out.push(mapped);
    };
    tokens.forEach(function (tok) {
      var clean = normalizeWordClean(tok);
      if (!clean) return;
      if (CONTRACTION_MAP[clean]) {
        CONTRACTION_MAP[clean].split(' ').forEach(pushNormalized);
      } else if (clean.indexOf('-') !== -1) {
        clean.split('-').forEach(pushNormalized);
      } else {
        pushNormalized(clean);
      }
    });
    return out;
  }

  function levenshteinDist(a, b) {
    var m = a.length;
    var n = b.length;
    if (!m) return n;
    if (!n) return m;
    var prev = [];
    for (var j = 0; j <= n; j++) prev[j] = j;
    for (var i = 1; i <= m; i++) {
      var curr = [i];
      for (var k = 1; k <= n; k++) {
        var cost = a[i - 1] === b[k - 1] ? 0 : 1;
        curr[k] = Math.min(prev[k] + 1, curr[k - 1] + 1, prev[k - 1] + cost);
      }
      prev = curr;
    }
    return prev[n];
  }

  function matchShadowSentence(targetSentence, spokenText) {
    var rawTargetWords = String(targetSentence || '').trim().split(/\s+/).filter(Boolean);
    var spokenTokens = expandTextTokens(spokenText);
    var cursor = 0;
    var matchedCount = 0;

    var evaluated = rawTargetWords.map(function (origWord) {
      var parts = expandTextTokens(origWord);
      if (!parts.length) return { word: origWord, status: 'matched' };

      // Check sequential match with small lookahead window for natural speech variations
      var exactParts = 0;
      var closeParts = 0;
      var matchedSpanEnd = cursor;
      for (var p = 0; p < parts.length; p++) {
        var pw = parts[p];
        var foundAt = -1;
        var exactHit = false;
        var limit = Math.min(spokenTokens.length, cursor + 6);
        for (var j = cursor; j < limit; j++) {
          var sw = spokenTokens[j];
          if (sw === pw) {
            foundAt = j;
            exactHit = true;
            break;
          }
          if (pw.length >= 4 && (sw === pw + 's' || pw === sw + 's' || levenshteinDist(pw, sw) <= 1)) {
            foundAt = j;
          }
        }
        if (foundAt !== -1) {
          matchedSpanEnd = Math.max(matchedSpanEnd, foundAt + 1);
          if (exactHit) exactParts++;
          else closeParts++;
        }
      }
      cursor = matchedSpanEnd;
      var bestStatus = 'missed';
      if (exactParts === parts.length) bestStatus = 'matched';
      else if (exactParts + closeParts > 0) bestStatus = 'close';
      if (bestStatus === 'matched') matchedCount += 1;
      else if (bestStatus === 'close') matchedCount += 0.65;
      return { word: origWord, status: bestStatus };
    });

    var accuracy = rawTargetWords.length
      ? Math.min(100, Math.round((matchedCount / rawTargetWords.length) * 100))
      : 0;

    return {
      tokens: evaluated,
      accuracy: accuracy,
      spokenWordCount: spokenTokens.length,
      targetWordCount: rawTargetWords.length
    };
  }

  function collectTargetLexis(lesson) {
    var out = [];
    var seen = new Set();
    var addWord = function (w) {
      var str = String(w && (w.word || w) || '').trim();
      if (!str) return;
      var k = str.toLowerCase();
      if (seen.has(k)) return;
      seen.add(k);
      out.push(str);
    };
    if (!lesson) return out;
    if (Array.isArray(lesson.vocabTips)) lesson.vocabTips.forEach(addWord);
    if (Array.isArray(lesson.lexicalTargets)) lesson.lexicalTargets.forEach(addWord);
    if (Array.isArray(lesson.questions)) {
      lesson.questions.forEach(function (q) {
        if (Array.isArray(q.vocabTips)) q.vocabTips.forEach(addWord);
      });
    }
    if (lesson.part1) {
      (lesson.part1.topic1Qs || []).forEach(function (q) { (q.vocabTips || []).forEach(addWord); });
      (lesson.part1.topic2Qs || []).forEach(function (q) { (q.vocabTips || []).forEach(addWord); });
    }
    if (lesson.part3 && Array.isArray(lesson.part3.questions)) {
      lesson.part3.questions.forEach(function (q) { (q.vocabTips || []).forEach(addWord); });
    }
    return out;
  }

  function analyzeTranscriptMetrics(transcript, durationSec, targetWords) {
    var clean = String(transcript || '').trim();
    var low = clean.toLowerCase();
    var wc = countWords(clean);
    var wpm = wc ? computeWpm(clean, durationSec) : 0;

    var usedTargets = [];
    (targetWords || []).forEach(function (tw) {
      var stem = String(tw || '').replace(/^(a|an|the)\s+/i, '').trim().toLowerCase();
      if (stem.length >= 3 && low.indexOf(stem) !== -1) {
        usedTargets.push(tw);
      }
    });

    var connectorsUsed = DISCOURSE_CONNECTORS.filter(function (c) {
      return low.indexOf(c) !== -1;
    });

    var fillerMatches = 0;
    var wordTokens = low.split(/\s+/).filter(Boolean);
    wordTokens.forEach(function (tok) {
      var bare = normalizeWordClean(tok);
      if (HESITATION_FILLERS.indexOf(bare) !== -1) fillerMatches++;
    });

    var wpmDiagnosis = 'Chưa có transcript';
    if (wc > 0) {
      if (wpm < 95) wpmDiagnosis = 'Chậm (< 95 WPM) — Cần giảm ngắt quãng & giữ mạch nói';
      else if (wpm <= 155) wpmDiagnosis = 'Chuẩn tự nhiên (95–155 WPM) — Rất phù hợp Band 7.0+';
      else wpmDiagnosis = 'Hơi nhanh (> 155 WPM) — Chú ý tách nhịp & nhấn trọng âm';
    }

    return {
      wordCount: wc,
      wpm: wpm,
      wpmDiagnosis: wpmDiagnosis,
      usedTargets: usedTargets,
      targetTotal: (targetWords || []).length,
      connectorsUsed: connectorsUsed,
      fillerCount: fillerMatches
    };
  }

  function highlightCollocationsHtml(text, vocabTips) {
    var html = escHtml(text);
    (vocabTips || []).forEach(function (tip) {
      var phrase = String(tip && tip.word || '').trim();
      if (!phrase || phrase.length < 3) return;
      var escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var rx = new RegExp('(' + escaped + ')', 'gi');
      var titleText = escHtml((tip.ipa ? tip.ipa + ' • ' : '') + (tip.meaning || 'Target lexis'));
      html = html.replace(rx, '<span class="sp-colloc-hl" title="' + titleText + '">$1</span>');
    });
    return html;
  }

  // =========================================================================
  // 6. SIDEBAR, TOPBAR, TÌM KIẾM & ĐIỀU HƯỚNG UNIT
  // =========================================================================
  function updateTopStats() {
    var done = getDoneList();
    var progEl = document.getElementById('topProgText');
    if (progEl) progEl.innerHTML = '<span class="sp-prog-lbl">Đã học: </span>' + done.length + '/' + allLessons.length;

    var hist = getSubmissions();
    var cntEl = document.getElementById('topHistoryCount');
    if (cntEl) cntEl.textContent = String(hist.length);
    var lobbyCnt = document.getElementById('lobbyHistoryBadgeCount');
    if (lobbyCnt) lobbyCnt.textContent = hist.length + ' lần thi thử';

    updateDoneButtonStates();
  }

  function updateDoneButtonStates() {
    var isDone = activeLesson ? isLessonDone(activeLesson.id) : false;
    ['btnToggleVocabDone', 'btnToggleTheoryDone', 'btnToggleStudioDone'].forEach(function (id) {
      var btn = document.getElementById(id);
      if (!btn) return;
      btn.classList.toggle('btn-done', isDone);
      btn.textContent = isDone ? '✓ Đã hoàn thành' : '✓ Đánh dấu hoàn thành';
    });
  }

  function renderSidebarPills() {
    var mappedActiveUnit = activeLesson ? normalizeFilterUnit(activeLesson.unitId) : '';
    var host = document.getElementById('sidebarUnitPills');
    if (host) {
      host.innerHTML = UNITS_LIST.map(function (u) {
        var isAct = activeUnitFilter === u.id;
        return '<button type="button" class="sp-sb-pill' + (isAct ? ' active' : '') + '" onclick="window.switchSpeakingUnit(\'' + u.id + '\', { filterOnly: true })" title="' + escHtml(u.label) + '">' + escHtml(u.pill) + '</button>';
      }).join('');
    }

    UNITS_LIST.forEach(function (u) {
      if (u.id === 'all') return;
      var topBtn = document.getElementById('topBtn_' + u.id);
      if (topBtn) {
        var isAct = mappedActiveUnit === u.id || activeUnitFilter === u.id;
        topBtn.classList.toggle('active', !!isAct);
        if (isAct && window.innerWidth <= 960 && typeof topBtn.scrollIntoView === 'function') {
          try {
            topBtn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          } catch (e) {}
        }
      }
    });
  }

  function getFolderOpenState(folderTitle, folderHasActive, isFirstFolder, hasQuery) {
    if (hasQuery) return true;
    if (Object.prototype.hasOwnProperty.call(folderExpandState, folderTitle)) {
      return !!folderExpandState[folderTitle];
    }
    if (!isAllFoldersCollapsed) return true;
    return folderHasActive || isFirstFolder;
  }

  function renderSidebar() {
    var listEl = document.getElementById('lessonList');
    if (!listEl) return;

    var searchEl = document.getElementById('searchInput');
    var query = searchEl ? String(searchEl.value || '').trim() : '';
    var doneList = getDoneList();
    var doneSet = new Set(doneList);

    var targetActiveId = activeLesson ? activeLesson.id : '';
    if (activeUnitFilter === 'u_34' && activeLesson && activeLesson.unitId === 'u_4' && activeLesson.linkedPart2Id) {
      targetActiveId = activeLesson.linkedPart2Id;
    }

    var filtered = allLessons.filter(function (item) {
      if (activeUnitFilter === 'u_34') {
        if (item.unitId !== 'u_3') return false;
      } else if (activeUnitFilter !== 'all' && item.unitId !== activeUnitFilter) {
        return false;
      }
      if (!query) return true;
      var hay = [
        item.title,
        item.cleanTitle,
        item.group,
        item.unitTitle,
        item.series,
        item.cueCard && item.cueCard.prompt,
        item.part2 && item.part2.prompt
      ].filter(Boolean).join(' ');
      if (global.S4UI && typeof global.S4UI.matchesSearch === 'function') {
        return global.S4UI.matchesSearch(hay, query);
      }
      return hay.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });

    if (!filtered.length) {
      listEl.innerHTML = '<div class="sp-tip-callout" style="margin:8px 0;">Không tìm thấy chủ đề phù hợp với từ khóa "<b>' + escHtml(query) + '</b>".</div>';
      return;
    }

    var searchTotal = filtered.length;
    var cappedForSearch = false;
    if (query && filtered.length > 150) {
      filtered = filtered.slice(0, 150);
      cappedForSearch = true;
    }

    var folderMap = new Map();
    filtered.forEach(function (it) {
      var folderKey = getSidebarFolderKey(it, activeUnitFilter);
      if (!folderMap.has(folderKey)) folderMap.set(folderKey, []);
      folderMap.get(folderKey).push(it);
    });

    var toggleAllBtn = document.getElementById('btnToggleAll');
    if (toggleAllBtn) toggleAllBtn.textContent = isAllFoldersCollapsed ? 'Mở rộng' : 'Thu gọn';

    var html = '';
    if (cappedForSearch) {
      html += '<div class="sp-tip-callout" style="margin:0 0 8px;padding:7px 10px;font-size:12px;">Đang hiển thị <b>150/' + searchTotal + '</b> kết quả khớp nhất. Gõ thêm từ khóa để lọc chính xác hơn.</div>';
    }

    var folderIdx = 0;
    folderMap.forEach(function (items, folderTitle) {
      var isFirst = folderIdx === 0;
      folderIdx++;
      var hasActive = !!(targetActiveId && items.some(function (i) { return i.id === targetActiveId; }));
      var isOpen = getFolderOpenState(folderTitle, hasActive, isFirst, !!query);

      var doneInFolder = 0;
      for (var d = 0; d < items.length; d++) {
        if (doneSet.has(items[d].id)) doneInFolder++;
      }

      html += '<div class="folder-group' + (isOpen ? '' : ' collapsed') + '">';
      html += '<button type="button" class="folder-header" onclick="window._spToggleFolder(\'' + escJsAttr(folderTitle) + '\', ' + (isOpen ? 'true' : 'false') + ')">';
      html += '<span class="folder-title-wrap"><span class="folder-chevron">▼</span><span class="folder-name">' + escHtml(folderTitle) + '</span></span>';
      html += '<span class="folder-badge">' + doneInFolder + '/' + items.length + '</span>';
      html += '</button>';
      html += '<div class="folder-items">';

      if (isOpen) {
        var limit = folderLimits[folderTitle] || FOLDER_PAGE_SIZE;
        var visibleItems = items.slice(0, limit);
        if (targetActiveId && hasActive && visibleItems.every(function (x) { return x.id !== targetActiveId; })) {
          var activeRef = items.find(function (x) { return x.id === targetActiveId; });
          if (activeRef) visibleItems.unshift(activeRef);
        }

        visibleItems.forEach(function (it) {
          var isAct = targetActiveId === it.id;
          var isDone = doneSet.has(it.id) || (it.linkedPart3Id && doneSet.has(it.linkedPart3Id));
          var meta = '';
          if (it.type === 'vocab_srs') meta = it.wordCount + ' từ vựng / expressions SRS';
          else if (it.type === 'part1') meta = it.questionCount + ' câu phỏng vấn + Audio & Mẫu';
          else if (it.type === 'part2') meta = it.linkedPart3Id ? 'Cue Card (1m+2m) + Part 3 Thảo luận' : 'Cue Card • 1m Prep + 2m Long Turn';
          else if (it.type === 'part3') meta = it.questionCount + ' câu thảo luận Two-Way';
          else if (it.type === 'theory') meta = it.durationLabel || 'Phát âm & Chiến thuật';
          else if (it.type === 'practice_full') {
            var qTotal = ((it.part1 && it.part1.topic1Qs) ? it.part1.topic1Qs.length : 0)
              + ((it.part3 && it.part3.questions) ? it.part3.questions.length : 0);
            meta = (it.pzKindLabel || 'Practice Zone') + (qTotal ? (' • ' + qTotal + ' câu') : '');
          }

          html += '<button type="button" class="lesson-item' + (isAct ? ' active' : '') + (isDone ? ' done' : '') + '" onclick="window.selectSpeakingLesson(\'' + escJsAttr(it.id) + '\')">';
          html += '<div class="lesson-item-body"><div class="lesson-title">' + escHtml(it.title) + '</div><div class="lesson-meta">' + escHtml(meta) + '</div></div>';
          html += '<span class="done-badge" title="' + (isDone ? 'Đã học' : 'Chưa xong') + '">' + (isDone ? '✓' : '•') + '</span>';
          html += '</button>';
        });

        var remaining = items.length - limit;
        if (remaining > 0) {
          html += '<button type="button" class="mini-btn" style="width:100%;margin-top:4px;text-align:center;" onclick="window._spShowMoreFolder(\'' + escJsAttr(folderTitle) + '\')">⬇️ Xem thêm (' + remaining + ' mục còn lại)</button>';
        }
      }

      html += '</div></div>';
    });

    listEl.innerHTML = html;
  }

  global._spToggleFolder = function (title, wasOpen) {
    folderExpandState[title] = !wasOpen;
    renderSidebar();
  };

  global._spShowMoreFolder = function (title) {
    folderLimits[title] = (folderLimits[title] || FOLDER_PAGE_SIZE) + FOLDER_PAGE_SIZE;
    folderExpandState[title] = true;
    renderSidebar();
  };

  global.toggleAllSpeakingFolders = function () {
    isAllFoldersCollapsed = !isAllFoldersCollapsed;
    folderExpandState = {};
    renderSidebar();
  };

  global.toggleSpeakingSidebar = function (forceOpen, opts) {
    var isMobile = window.innerWidth <= 960;
    var sb = document.getElementById('speakingSidebar');
    var bd = document.getElementById('sidebarBackdrop');
    if (isMobile) {
      var nextOpen = typeof forceOpen === 'boolean' ? forceOpen : !document.body.classList.contains('sidebar-open');
      document.body.classList.toggle('sidebar-open', nextOpen);
      if (sb) sb.classList.toggle('open', nextOpen);
      if (bd) bd.classList.toggle('open', nextOpen);
    } else {
      var nextCol = typeof forceOpen === 'boolean' ? !forceOpen : !document.body.classList.contains('sidebar-collapsed');
      document.body.classList.toggle('sidebar-collapsed', nextCol);
      if (!(opts && opts.auto) && activeUnitFilter !== 'u_6') {
        desktopUserCollapsed = nextCol;
      }
      var lbl = document.querySelector('#btnToggleSidebar .s4-desk-sb-lbl');
      if (lbl) lbl.textContent = nextCol ? '▶ Mở mục lục' : '◀ Ẩn mục lục';
    }
  };

  global.switchSpeakingUnit = function (unitId, opts) {
    var targetUnit = unitId === 'all' ? 'all' : normalizeFilterUnit(unitId);
    activeUnitFilter = targetUnit;
    folderExpandState = {};
    isAllFoldersCollapsed = true;
    renderSidebarPills();
    renderSidebar();

    var o = opts || {};
    if (!o.filterOnly && targetUnit !== 'all') {
      var match = allLessons.find(function (l) {
        if (targetUnit === 'u_34') {
          return unitId === 'u_4' ? l.unitId === 'u_4' : l.unitId === 'u_3';
        }
        return l.unitId === targetUnit;
      });
      if (match) {
        global.selectSpeakingLesson(match.id);
      }
    }
  };

  global.selectSpeakingLesson = function (lessonId) {
    var lesson = global.SpeakingParser.getLessonById(lessonId);
    if (!lesson) return;

    var prevUnitId = activeLesson ? activeLesson.unitId : '';

    shadowAutoListenGen++;
    TtsEngine.stop();
    stopStudioPrepTimer();
    if (MicEngine.isActive()) MicEngine.cancel();

    activeLesson = lesson;
    try { localStorage.setItem(STORAGE_LAST, lesson.id); } catch (e) {}

    var lessonFilterUnit = normalizeFilterUnit(lesson.unitId);
    if (activeUnitFilter !== 'all' && activeUnitFilter !== lessonFilterUnit) {
      activeUnitFilter = lessonFilterUnit;
      folderExpandState = {};
    }

    var sidebarRefLesson = lesson;
    if (activeUnitFilter === 'u_34' && lesson.unitId === 'u_4' && lesson.linkedPart2Id) {
      sidebarRefLesson = global.SpeakingParser.getLessonById(lesson.linkedPart2Id) || lesson;
    }
    var targetFolderKey = getSidebarFolderKey(sidebarRefLesson, activeUnitFilter);
    if (targetFolderKey) folderExpandState[targetFolderKey] = true;

    if (window.innerWidth <= 960) {
      global.toggleSpeakingSidebar(false, { auto: true });
    } else {
      if (lesson.unitId === 'u_6' && prevUnitId !== 'u_6') {
        global.toggleSpeakingSidebar(false, { auto: true });
      } else if (lesson.unitId !== 'u_6' && (prevUnitId === 'u_6' || !prevUnitId)) {
        global.toggleSpeakingSidebar(!desktopUserCollapsed, { auto: true });
      }
    }

    resetStudioForLesson(lesson);
    renderSidebarPills();
    renderSidebar();
    routeViewForLesson(lesson);
    updateTopStats();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  global.toggleCurrentLessonDone = function () {
    if (!activeLesson) return;
    var nextState = !isLessonDone(activeLesson.id);
    markLessonDone(activeLesson.id, nextState);
    renderSidebar();
    showToast(nextState ? 'Đã đánh dấu hoàn thành bài học!' : 'Đã bỏ đánh dấu hoàn thành.', nextState ? 'success' : 'info');
  };

  global.openNextLesson = function () {
    if (!activeLesson || !allLessons.length) return;
    var pool = activeLessonsForNext();
    var idx = pool.findIndex(function (l) { return l.id === activeLesson.id; });
    var next = (idx !== -1 && idx + 1 < pool.length) ? pool[idx + 1] : pool[0];
    if (next) global.selectSpeakingLesson(next.id);
  };

  function activeLessonsForNext() {
    if (activeUnitFilter === 'u_34') {
      return allLessons.filter(function (l) { return l.unitId === activeLesson.unitId; });
    }
    if (activeUnitFilter !== 'all') {
      return allLessons.filter(function (l) { return l.unitId === activeUnitFilter; });
    }
    return allLessons;
  }

  function routeViewForLesson(lesson) {
    var vBox = document.getElementById('vocabContainer');
    var tBox = document.getElementById('theoryContainer');
    var sBox = document.getElementById('studioContainer');
    var pBox = document.getElementById('practiceZoneLobby');

    if (vBox) vBox.style.display = lesson.type === 'vocab_srs' ? 'flex' : 'none';
    if (tBox) tBox.style.display = lesson.type === 'theory' ? 'flex' : 'none';
    if (sBox) sBox.style.display = (lesson.type === 'part1' || lesson.type === 'part2' || lesson.type === 'part3') ? 'flex' : 'none';
    if (pBox) pBox.style.display = lesson.type === 'practice_full' ? 'block' : 'none';

    if (lesson.type === 'vocab_srs') renderVocabView(lesson);
    else if (lesson.type === 'theory') renderTheoryView(lesson);
    else if (lesson.type === 'practice_full') {
      selectedPzLessonId = lesson.id;
      renderPzLobby(lesson);
    } else {
      renderStudioView(lesson);
    }
  }

  // =========================================================================
  // 7. UNIT 1: SPEAKING VOCAB & IDIOMS SRS ADAPTER
  // =========================================================================
  function renderVocabView(lesson) {
    var tagEl = document.getElementById('vocabUnitTag');
    var titleEl = document.getElementById('vocabLessonTitle');
    var badgeEl = document.getElementById('vocabStepBadge');
    if (tagEl) tagEl.textContent = 'UNIT 1 • ' + (lesson.group || 'SPEAKING VOCAB & IDIOMS SRS');
    if (titleEl) titleEl.textContent = lesson.title;
    if (badgeEl) badgeEl.textContent = (lesson.wordCount || 0) + ' mục từ';

    if (!global.S4VocabEngine) return;

    // Quan trọng: S4VocabEngine kiểm tra (w.origin || w.term || w.word),
    // nên ta dời tag origin sang pos và convert examples {en, vi} sang chuỗi chuẩn!
    var adapted = (lesson.vocabList || []).map(function (w) {
      var exStrings = (w.examples || []).map(function (ex) {
        if (typeof ex === 'string') return ex;
        var enStr = String(ex.en || '');
        var rx = new RegExp('(' + String(w.word || w.term || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'i');
        var hiEn = enStr.replace(rx, '[$1]');
        return hiEn + (ex.vi ? ' (=Dịch: ' + ex.vi + ')' : '');
      });
      var tagOrigin = w.origin && w.origin !== 'Speaking' ? w.origin : '';
      var posCombined = w.pos || (tagOrigin ? '(' + tagOrigin + ')' : '');
      return {
        id: w.id,
        term: w.word || w.term,
        word: w.word || w.term,
        origin: '', // để trống để engine luôn dùng w.term làm từ chính!
        pos: posCombined,
        ipa: w.ipa || '',
        defVi: w.defVi || w.vi || '',
        defEn: w.defEn || w.en || '',
        examples: exStrings,
        topic: lesson.cleanTitle || lesson.title
      };
    });

    global.S4VocabEngine.mount('speakingVocabMount', lesson.id, adapted, lesson.title);
  }

  // =========================================================================
  // 8. UNIT 5: PHƯƠNG PHÁP, PHÁT ÂM & MINI-QUIZ
  // =========================================================================
  function upgradePronunciationHtml(rawHtml) {
    var wrap = document.createElement('div');
    wrap.innerHTML = String(rawHtml || '');

    var resolveFn = (global.SpeakingParser && global.SpeakingParser.resolveMediaUrl)
      ? global.SpeakingParser.resolveMediaUrl
      : function (p) { return p; };

    wrap.querySelectorAll('img').forEach(function (img) {
      var src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      if (src) img.setAttribute('src', resolveFn(src));
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.borderRadius = '10px';
    });

    wrap.querySelectorAll('video').forEach(function (vid) {
      var vSrc = vid.getAttribute('data-video') || vid.getAttribute('src') || '';
      if (vSrc) {
        vid.setAttribute('data-video-raw', vSrc);
        vid.setAttribute('src', resolveFn(vSrc));
      }
      vid.classList.add('sp-pronun-video');
      vid.setAttribute('controls', '');
      vid.setAttribute('playsinline', '');
      vid.setAttribute('preload', 'metadata');
      vid.style.maxWidth = '100%';
      vid.style.borderRadius = '10px';
      vid.removeAttribute('width');
    });

    wrap.querySelectorAll('.soundcite').forEach(function (sc) {
      var audioRel = sc.getAttribute('data-audio') || '';
      var ttsText = sc.getAttribute('data-tts') || '';
      var label = String(sc.textContent || '').trim();
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn mini-btn sp-inline-sound-btn';
      btn.style.margin = '3px 4px';
      if (audioRel) btn.setAttribute('data-audio', audioRel);
      if (ttsText) btn.setAttribute('data-tts', ttsText);
      btn.setAttribute('data-speak-text', label || ttsText);
      btn.textContent = '🔊 ' + (label || ttsText || 'Nghe mẫu');
      sc.parentNode.replaceChild(btn, sc);
    });

    return wrap.innerHTML;
  }

  function buildVideoCandidates(rawPath, primaryResolved) {
    var list = [];
    function pushUnique(u) {
      var val = String(u || '').trim();
      if (val && list.indexOf(val) === -1) list.push(val);
    }
    pushUnique(primaryResolved);
    var cleaned = String(rawPath || '').trim().replace(/^\/?media\//i, '').replace(/^\/+/, '');
    if (cleaned && !/^https?:\/\//i.test(cleaned)) {
      if (Array.isArray(global.S4_MEDIA_MIRRORS)) {
        global.S4_MEDIA_MIRRORS.forEach(function (base) {
          if (base) pushUnique(String(base).replace(/\/+$/, '') + '/' + cleaned);
        });
      }
      if (/^https?:\/\/study4\.com\/media\//i.test(primaryResolved)) {
        pushUnique('https://study4.com/' + cleaned);
      }
      pushUnique('./media/' + cleaned);
      pushUnique('./' + cleaned);
    }
    return list;
  }

  function attachTheoryVideoFallbacks(containerEl, lesson) {
    if (!containerEl) return;
    var firstYtUrl = '';
    if (lesson && Array.isArray(lesson.youtubes) && lesson.youtubes.length) {
      var rawY = String(lesson.youtubes[0] || '').trim();
      if (rawY) firstYtUrl = /^https?:\/\//i.test(rawY) ? rawY : ('https://www.youtube.com/watch?v=' + rawY);
    }

    containerEl.querySelectorAll('video').forEach(function (vid) {
      if (vid.getAttribute('data-sp-fallback-bound') === '1') return;
      vid.setAttribute('data-sp-fallback-bound', '1');

      var rawSrc = vid.getAttribute('data-video-raw') || vid.getAttribute('data-video') || vid.getAttribute('src') || '';
      var primaryUrl = vid.getAttribute('src') || rawSrc;
      var candidates = buildVideoCandidates(rawSrc, primaryUrl);
      if (!candidates.length) return;

      var wrap = document.createElement('div');
      wrap.className = 'sp-video-wrap';
      if (vid.parentNode) {
        vid.parentNode.insertBefore(wrap, vid);
        wrap.appendChild(vid);
      }

      var statusBar = document.createElement('div');
      statusBar.className = 'sp-video-status-bar';
      statusBar.style.display = 'none';
      wrap.appendChild(statusBar);

      var mirrorIdx = 0;

      function showRetryPanel() {
        wrap.classList.add('is-error');
        statusBar.classList.add('is-error');
        statusBar.style.display = 'flex';
        var ytBtnHtml = firstYtUrl
          ? '<a href="' + escHtml(firstYtUrl) + '" target="_blank" rel="noopener" class="btn mini-btn">▶ Xem trên YouTube</a>'
          : '';
        statusBar.innerHTML = ''
          + '<div class="sp-video-err-msg">⚠️ Video khẩu hình hiện không tải được từ CDN (mạng yếu, offline hoặc bị chặn truy cập).</div>'
          + '<div class="sp-video-fallback-actions">'
          + '  <button type="button" class="btn btn-primary sp-video-retry-btn">🔄 Thử tải lại video</button>'
          + '  <a href="' + escHtml(candidates[0]) + '" target="_blank" rel="noopener" class="btn mini-btn sp-video-direct-link">↗️ Mở video trực tiếp</a>'
          + ytBtnHtml
          + '</div>';
        var retryBtn = statusBar.querySelector('.sp-video-retry-btn');
        if (retryBtn) {
          retryBtn.onclick = function () {
            mirrorIdx = 0;
            wrap.classList.remove('is-error');
            statusBar.classList.remove('is-error');
            statusBar.style.display = 'flex';
            statusBar.innerHTML = '<span>⏳ Đang kết nối lại nguồn video...</span>';
            var baseUrl = candidates[0];
            var sep = baseUrl.indexOf('?') === -1 ? '?' : '&';
            var retryUrl = /^https?:\/\//i.test(baseUrl) ? (baseUrl + sep + 'retry=' + Date.now()) : baseUrl;
            vid.setAttribute('src', retryUrl);
            try { vid.load(); } catch (e) {}
            try {
              var pr = vid.play();
              if (pr && typeof pr.catch === 'function') pr.catch(function () {});
            } catch (e2) {}
          };
        }
      }

      vid.addEventListener('loadeddata', function () {
        wrap.classList.remove('is-error');
        statusBar.classList.remove('is-error');
        statusBar.style.display = 'none';
      });
      vid.addEventListener('canplay', function () {
        wrap.classList.remove('is-error');
        statusBar.classList.remove('is-error');
        statusBar.style.display = 'none';
      });
      vid.addEventListener('error', function () {
        mirrorIdx++;
        if (mirrorIdx < candidates.length) {
          statusBar.classList.remove('is-error');
          statusBar.style.display = 'flex';
          statusBar.innerHTML = '<span>🔄 Nguồn chính lỗi — đang thử nguồn dự phòng (' + (mirrorIdx + 1) + '/' + candidates.length + ')...</span>';
          vid.setAttribute('src', candidates[mirrorIdx]);
          try { vid.load(); } catch (e) {}
        } else {
          showRetryPanel();
        }
      });
    });
  }

  function renderTheoryView(lesson) {
    var tagEl = document.getElementById('theoryUnitTag');
    var titleEl = document.getElementById('theoryLessonTitle');
    var durEl = document.getElementById('theoryDurationTag');
    var htmlBox = document.getElementById('theoryHtmlBox');
    var chkBox = document.getElementById('theoryChecklistBox');
    var quizBox = document.getElementById('theoryQuizBox');

    if (tagEl) tagEl.textContent = 'UNIT 5 • ' + (lesson.group || 'PHÁT ÂM & CHIẾN THUẬT');
    if (titleEl) titleEl.textContent = lesson.title;
    if (durEl) durEl.textContent = lesson.durationLabel || '📖 Bài giảng';

    if (htmlBox) {
      if (lesson.subtype === 'video') {
        var vidHtml = '';
        if (lesson.youtubeId) {
          vidHtml += '<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;background:#0f172a;margin-bottom:12px;">'
            + '<iframe src="https://www.youtube-nocookie.com/embed/' + escHtml(lesson.youtubeId) + '?rel=0" title="' + escHtml(lesson.title) + '" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
            + '</div>'
            + '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px;">'
            + '  <a href="https://www.youtube.com/watch?v=' + escHtml(lesson.youtubeId) + '" target="_blank" rel="noopener" class="btn mini-btn">▶ Mở video trực tiếp trên YouTube</a>'
            + '</div>';
        }
        if (Array.isArray(lesson.pdfs) && lesson.pdfs.length) {
          vidHtml += '<div style="display:flex;flex-direction:column;gap:8px;margin-top:6px;">'
            + '<strong style="font-size:14.5px;">📄 Tài liệu PDF đi kèm bài giảng</strong>'
            + lesson.pdfs.map(function (pdfUrl, pIdx) {
              var fname = decodeURIComponent(String(pdfUrl).split('/').pop() || ('Tai-lieu-' + (pIdx + 1) + '.pdf'));
              return '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--bg,var(--box-sub));flex-wrap:wrap;">'
                + '<span style="font-weight:700;font-size:13.5px;word-break:break-word;">📕 ' + escHtml(fname) + '</span>'
                + '<a href="' + escHtml(pdfUrl) + '" target="_blank" rel="noopener" class="btn btn-primary mini-btn">⬇ Xem / Tải PDF</a>'
                + '</div>';
            }).join('')
            + '</div>';
        }
        if (Array.isArray(lesson.slides) && lesson.slides.length) {
          vidHtml += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">'
            + lesson.slides.map(function (sUrl, sIdx) {
              return '<a href="' + escHtml(sUrl) + '" target="_blank" rel="noopener" class="btn mini-btn">🖼️ Slide ' + (sIdx + 1) + '</a>';
            }).join('')
            + '</div>';
        }
        htmlBox.innerHTML = vidHtml || '<p>Video chiến thuật đang sẵn sàng.</p>';
      } else {
        var extraYt = (Array.isArray(lesson.youtubes) && lesson.youtubes.length)
          ? '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">' + lesson.youtubes.map(function (y, idx) {
            var yUrl = /^https?:\/\//i.test(y) ? y : ('https://www.youtube.com/watch?v=' + y);
            return '<a href="' + escHtml(yUrl) + '" target="_blank" rel="noopener" class="btn mini-btn">▶ Video hướng dẫn #' + (idx + 1) + '</a>';
          }).join('') + '</div>'
          : '';
        htmlBox.innerHTML = (lesson.htmlContent ? upgradePronunciationHtml(lesson.htmlContent) : '<p>Bài lý thuyết phát âm.</p>') + extraYt;
        attachTheoryVideoFallbacks(htmlBox, lesson);
      }

      if (!htmlBox._spAudioBound) {
        htmlBox._spAudioBound = true;
        htmlBox.addEventListener('click', function (ev) {
          var btn = ev.target && ev.target.closest ? ev.target.closest('.sp-inline-sound-btn') : null;
          if (!btn) return;
          var audioPath = btn.getAttribute('data-audio') || '';
          var ttsTxt = btn.getAttribute('data-tts') || btn.getAttribute('data-speak-text') || '';
          TtsEngine.playMedia(audioPath, ttsTxt, { lang: prefs.voiceAccent, rate: 0.92 });
        });
      }
    }

    if (chkBox) {
      var chks = lesson.keyChecklist || [];
      chkBox.innerHTML = '<h3 style="font-size:16px;font-weight:800;">✅ Checklist Thực Hành</h3>'
        + '<div class="sp-checklist-list">'
        + chks.map(function (c, i) {
          return '<label class="sp-checklist-item"><input type="checkbox" style="margin-top:3px;accent-color:var(--primary);"><span><b>Bước ' + (i + 1) + ':</b> ' + escHtml(c) + '</span></label>';
        }).join('')
        + '</div>';
    }

    if (quizBox) {
      var drills = Array.isArray(lesson.drills) ? lesson.drills : [];
      var qs = Array.isArray(lesson.quickPractice) ? lesson.quickPractice : [];

      if (!drills.length && !qs.length) {
        quizBox.style.display = 'none';
        quizBox.innerHTML = '';
        return;
      }
      quizBox.style.display = '';

      if (drills.length) {
        var feedbackBanner = studioState.pronDrillScore
          ? '<div class="sp-tip-callout" style="margin-bottom:10px;">🎙️ Kết quả đọc thử "<b>' + escHtml(studioState.pronDrillTarget) + '</b>": <b>' + studioState.pronDrillScore.accuracy + '%</b> khớp chuẩn' + (studioState.pronDrillScore.spoken ? (' — Nghe được: <em>' + escHtml(studioState.pronDrillScore.spoken) + '</em>') : '') + '</div>'
          : '';

        quizBox.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">'
          + '  <h3 style="font-size:16px;font-weight:800;">🔊 Listen &amp; Repeat Drills (' + drills.length + ' nhóm luyện âm)</h3>'
          + '  <div class="sp-accent-group">'
          + '    <button type="button" class="sp-accent-btn' + (prefs.voiceAccent === 'en-GB' ? ' active' : '') + '" data-accent="en-GB" onclick="window.setSpeakingVoiceAccent(\'en-GB\');window._spReRenderTheory()">🇬🇧 UK</button>'
          + '    <button type="button" class="sp-accent-btn' + (prefs.voiceAccent === 'en-AU' ? ' active' : '') + '" data-accent="en-AU" onclick="window.setSpeakingVoiceAccent(\'en-AU\');window._spReRenderTheory()">🇦🇺 AU</button>'
          + '    <button type="button" class="sp-accent-btn' + (prefs.voiceAccent === 'en-US' ? ' active' : '') + '" data-accent="en-US" onclick="window.setSpeakingVoiceAccent(\'en-US\');window._spReRenderTheory()">🇺🇸 US</button>'
          + '  </div>'
          + '</div>'
          + feedbackBanner
          + drills.map(function (dr, dIdx) {
            var rows = (dr.items || []).map(function (it, iIdx) {
              var rawSub = String(it.s || '').trim();
              var isAudioSub = /\.(mp3|wav|m4a|ogg)(\?|$)/i.test(rawSub);
              var drillAudioUrl = it.audioUrl || (isAudioSub ? rawSub : '');
              var drillSentence = (!isAudioSub && rawSub) ? rawSub : '';
              return '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 11px;border:1px solid var(--border);border-radius:10px;background:var(--bg,var(--box-sub));flex-wrap:wrap;">'
                + '  <div style="flex:1;min-width:190px;">'
                + '    <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">'
                + '      <strong style="font-size:15px;color:var(--primary);">' + escHtml(it.w) + '</strong>'
                + (it.ipa ? '<span style="font-family:monospace;font-size:13px;color:#ef4444;">' + escHtml(it.ipa) + '</span>' : '')
                + (it.vi ? '<span style="font-size:13px;color:var(--text);">— ' + escHtml(it.vi) + '</span>' : '')
                + '    </div>'
                + (drillSentence ? '<div style="font-size:12.5px;color:var(--muted);margin-top:3px;">💬 ' + escHtml(drillSentence) + '</div>' : '')
                + '  </div>'
                + '  <div style="display:flex;gap:6px;flex-wrap:wrap;">'
                + '    <button type="button" class="btn mini-btn" onclick="window._spPlayWord(\'' + escJsAttr(it.w) + '\',\'' + escJsAttr(drillAudioUrl) + '\')">🔊 Nghe mẫu</button>'
                + (drillSentence ? '<button type="button" class="btn mini-btn" onclick="window._spPlayWord(\'' + escJsAttr(drillSentence) + '\')">🔊 Câu</button>' : '')
                + '    <button type="button" class="btn mini-btn" onclick="window._spPracticePronItem(' + dIdx + ',' + iIdx + ')">🎙️ Đọc thử</button>'
                + '  </div>'
                + '</div>';
            }).join('');
            return '<div style="margin-bottom:14px;">'
              + '<div style="font-weight:800;font-size:14px;margin-bottom:6px;color:var(--hl-cyan);">📌 ' + escHtml(dr.title || ('Bài tập ' + (dIdx + 1))) + ' (' + (dr.items ? dr.items.length : 0) + ' từ)</div>'
              + '<div style="display:flex;flex-direction:column;gap:6px;">' + rows + '</div>'
              + '</div>';
          }).join('');
        return;
      }

      var correctTotal = 0;
      var answeredTotal = 0;
      qs.forEach(function (q, idx) {
        if (studioState.theoryAnswers[idx] !== undefined) {
          answeredTotal++;
          if (studioState.theoryAnswers[idx] === q.answer) correctTotal++;
        }
      });

      var qHtml = '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">'
        + '<h3 style="font-size:16px;font-weight:800;">📝 Mini-Quiz Kiểm Tra Hiểu Bài</h3>'
        + '<span class="sp-lobby-chip is-exam">Đúng: ' + correctTotal + '/' + qs.length + (answeredTotal === qs.length ? ' (Hoàn thành)' : '') + '</span>'
        + '</div>';

      qHtml += qs.map(function (q, qIdx) {
        var picked = studioState.theoryAnswers[qIdx];
        var optsHtml = (q.options || []).map(function (opt, oIdx) {
          var cls = 'sp-quiz-opt';
          if (picked !== undefined) {
            if (oIdx === q.answer) cls += ' correct';
            else if (oIdx === picked) cls += ' wrong';
          }
          return '<button type="button" class="' + cls + '" onclick="window._spAnswerTheoryQuiz(' + qIdx + ',' + oIdx + ')">'
            + String.fromCharCode(65 + oIdx) + '. ' + escHtml(opt) + '</button>';
        }).join('');

        var explainHtml = picked !== undefined && q.explain
          ? '<div class="sp-quiz-explain">💡 <b>Giải thích:</b> ' + escHtml(q.explain) + '</div>'
          : '';

        return '<div class="sp-quiz-q-item">'
          + '<div style="font-weight:800;font-size:14.5px;">Câu ' + (qIdx + 1) + ': ' + escHtml(q.q) + '</div>'
          + '<div class="sp-quiz-options">' + optsHtml + '</div>'
          + explainHtml
          + '</div>';
      }).join('');

      quizBox.innerHTML = qHtml;
    }
  }

  global._spReRenderTheory = function () {
    if (activeLesson && activeLesson.type === 'theory') renderTheoryView(activeLesson);
  };

  global._spPracticePronItem = function (dIdx, iIdx) {
    if (!activeLesson || !Array.isArray(activeLesson.drills)) return;
    var dr = activeLesson.drills[dIdx];
    var it = dr && dr.items && dr.items[iIdx];
    if (!it) return;
    var target = it.s || it.w;
    if (MicEngine.isActive()) {
      MicEngine.stop();
      return;
    }
    showToast('Hãy đọc to: "' + target + '" (tự dừng sau 7 giây)', 'info');
    MicEngine.start({
      lang: prefs.voiceAccent,
      maxSeconds: 7,
      onUnsupported: function (msg) { showToast(msg, 'warn', 5500); },
      onSttWarning: showMicSttWarning,
      onFinish: function (res) {
        var spoken = (res && res.transcript) || '';
        var m = matchShadowSentence(target, spoken);
        studioState.pronDrillTarget = target;
        studioState.pronDrillScore = { accuracy: m.accuracy, spoken: spoken };
        renderTheoryView(activeLesson);
      }
    });
  };

  global._spAnswerTheoryQuiz = function (qIdx, oIdx) {
    if (!activeLesson || activeLesson.type !== 'theory') return;
    studioState.theoryAnswers[qIdx] = oIdx;
    var qs = activeLesson.quickPractice || [];
    if (Object.keys(studioState.theoryAnswers).length >= qs.length && !isLessonDone(activeLesson.id)) {
      markLessonDone(activeLesson.id, true);
      renderSidebar();
    }
    renderTheoryView(activeLesson);
  };

  // =========================================================================
  // 9. UNITS 2-4: SPEAKING STUDIO (5 CHẾ ĐỘ TOÀN DIỆN)
  // =========================================================================
  function resetStudioForLesson(lesson) {
    shadowAutoListenGen++;
    var notes = getNotesMap();
    studioState = {
      mode: 'sample',
      qIndex: 0,
      sampleIdx: 0,
      shadowIdx: 0,
      shadowResult: null,
      shadowSpokenText: '',
      shadowAudioUrl: '',
      shadowDurationSec: 0,
      shadowStatusKind: '',
      shadowStatusMsg: '',
      shadowListenAuto: false,
      drillAnswers: {},
      theoryAnswers: {},
      pronDrillScore: null,
      pronDrillTarget: '',
      prepLeftSec: lesson.prepSeconds || 60,
      prepRunning: false,
      prepTimerId: null,
      recordingSec: 0,
      recTranscript: '',
      recWpm: 0,
      recAudioId: null,
      recAudioUrl: '',
      prepNoteText: notes[lesson.id] || '',
      scores: { fc: 6.5, lr: 6.5, gra: 6.5, pr: 6.5 },
      aiFeedback: '',
      aiBandOverride: ''
    };
  }

  function stopStudioPrepTimer() {
    if (studioState.prepTimerId) {
      clearInterval(studioState.prepTimerId);
      studioState.prepTimerId = null;
    }
    studioState.prepRunning = false;
  }

  function renderStudioPartPairBar(lesson) {
    var bar = document.getElementById('studioPartPairBar');
    if (!bar) return;
    var isPair = lesson && (lesson.type === 'part2' || lesson.type === 'part3');
    if (!isPair) {
      bar.style.display = 'none';
      bar.innerHTML = '';
      return;
    }

    var p2Id = lesson.type === 'part2' ? lesson.id : lesson.linkedPart2Id;
    var p3Id = lesson.type === 'part3' ? lesson.id : lesson.linkedPart3Id;
    var p3Lesson = p3Id ? global.SpeakingParser.getLessonById(p3Id) : null;
    var p3Count = p3Lesson ? ((p3Lesson.questions && p3Lesson.questions.length) || p3Lesson.questionCount || 0) : 0;

    if (!p2Id && !p3Id) {
      bar.style.display = 'none';
      return;
    }

    bar.style.display = 'flex';
    bar.innerHTML = ''
      + '<div class="sp-pair-switch-group" role="tablist" aria-label="Chuyển đổi Part 2 và Part 3">'
      + (p2Id
        ? '<button type="button" class="sp-pair-btn' + (lesson.type === 'part2' ? ' active' : '') + '" onclick="window.selectSpeakingLesson(\'' + escJsAttr(p2Id) + '\')">🎴 Part 2 · Cue Card <small>(1m + 2m)</small></button>'
        : '')
      + (p3Id
        ? '<button type="button" class="sp-pair-btn' + (lesson.type === 'part3' ? ' active' : '') + '" onclick="window.selectSpeakingLesson(\'' + escJsAttr(p3Id) + '\')">🧠 Part 3 · Discussion' + (p3Count ? (' <small>(' + p3Count + ' câu)</small>') : '') + '</button>'
        : '')
      + '</div>'
      + '<span class="sp-pair-hint">🔗 Cùng chủ đề · Chuyển 1 chạm</span>';
  }

  function renderStudioView(lesson) {
    var unitLabel = lesson.unitId === 'u_2'
      ? 'PART 1 • INTERVIEW TOPIC'
      : (lesson.unitId === 'u_3' ? 'PART 2 & 3 • CUE CARD LONG TURN' : 'PART 2 & 3 • TWO-WAY DISCUSSION');

    var tagEl = document.getElementById('studioUnitTag');
    var titleEl = document.getElementById('studioLessonTitle');
    if (tagEl) tagEl.textContent = unitLabel + ' • ' + (lesson.group || '');
    if (titleEl) titleEl.textContent = lesson.title;

    syncAccentButtons();
    renderStudioPartPairBar(lesson);
    renderStudioPromptCard(lesson);
    global.switchSpeakingMode(studioState.mode || 'sample');
  }

  function syncAccentButtons() {
    document.querySelectorAll('.sp-accent-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-accent') === prefs.voiceAccent);
    });
    var vSel = document.getElementById('pzVoiceSelect');
    if (vSel && vSel.value !== prefs.voiceAccent) vSel.value = prefs.voiceAccent;
    document.querySelectorAll('.sp-speed-btn').forEach(function (b) {
      b.classList.toggle('active', Math.abs(parseFloat(b.getAttribute('data-rate')) - prefs.shadowSpeed) < 0.02);
    });
  }

  global.setSpeakingVoiceAccent = function (accent) {
    prefs.voiceAccent = accent || 'en-GB';
    savePrefs();
    syncAccentButtons();
    var info = TtsEngine.getVoiceInfo(prefs.voiceAccent);
    var label = accent === 'en-GB' ? 'UK' : accent === 'en-AU' ? 'AU' : 'US';
    var msg = 'Đã chuyển giọng đọc mẫu sang ' + label;
    if (info && info.voice) {
      if (accent === 'en-AU' && !info.hasExact) {
        msg += ' (trình duyệt chưa cài en-AU nên tạm dùng giọng Commonwealth riêng: ' + info.voice.name + ' — có giọng Úc chuẩn trên Edge)';
      } else {
        msg += ' (' + info.voice.name + ')';
      }
    }
    showToast(msg, 'info');
  };

  function getActivePromptContext(lesson) {
    if (lesson.type === 'part2') {
      return {
        promptText: lesson.cueCard ? lesson.cueCard.prompt : lesson.title,
        tips: lesson.vocabTips || [],
        targetDurationLabel: '1–2 phút nói (Prep 60s)',
        rephraseQ: ''
      };
    }
    var qs = lesson.questions || [];
    var q = qs[studioState.qIndex] || qs[0] || {};
    return {
      promptText: q.q || lesson.title,
      formula: q.formula || q.structureGuide || '',
      keyIdeas: q.keyIdeas || [],
      tips: q.vocabTips || lesson.vocabTips || [],
      rephraseQ: q.rephraseQ || '',
      targetDurationLabel: lesson.type === 'part1' ? '20–30 giây' : '35–55 giây',
      questionObj: q
    };
  }

  function renderStudioPromptCard(lesson) {
    var card = document.getElementById('studioPromptCard');
    if (!card) return;

    if (lesson.type === 'part2') {
      var cc = lesson.cueCard || {};
      var bullets = (cc.bullets || []).map(function (b) {
        return '<li>' + escHtml(b) + '</li>';
      }).join('');
      var tipsHtml = (lesson.vocabTips || []).slice(0, 16).map(function (t) {
        return '<button type="button" class="sp-vocab-tip-chip" onclick="window._spPlayWord(\'' + escJsAttr(t.word) + '\')" title="' + escHtml((t.ipa ? t.ipa + ' • ' : '') + (t.meaning || '')) + '">🔊 <b>' + escHtml(t.word) + '</b> <small>' + escHtml(t.meaning || '') + '</small></button>';
      }).join('');
      var sampleSwitchHtml = (Array.isArray(lesson.sampleSets) && lesson.sampleSets.length > 1)
        ? '<div class="sp-q-strip" style="margin-top:8px;">' + lesson.sampleSets.map(function (ss, idx) {
          return '<button type="button" class="sp-q-pill' + (idx === studioState.sampleIdx ? ' active' : '') + '" onclick="window._spSelectPart2Sample(' + idx + ')">' + escHtml(ss.label || ('Sample ' + (idx + 1))) + '</button>';
        }).join('') + '</div>'
        : '';
      var linkP3Html = lesson.linkedPart3Id
        ? '<div style="margin-top:8px;display:flex;justify-content:flex-end;"><button type="button" class="mini-btn" onclick="window.selectSpeakingLesson(\'' + escHtml(lesson.linkedPart3Id) + '\')">🧠 Chuyển sang Part 3 liên quan ➜</button></div>'
        : '';

      card.innerHTML = ''
        + '<div class="sp-cue-card-box">'
        + '  <div class="sp-cue-card-tag">IELTS SPEAKING PART 2 • CUE CARD</div>'
        + '  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;">'
        + '    <strong style="font-size:16.5px;">' + escHtml(cc.prompt || lesson.title) + '</strong>'
        + '    <button type="button" class="mini-btn" onclick="window._spPlayCueCardPrompt()">🔊 Nghe đề bài</button>'
        + '  </div>'
        + '  <p style="font-size:13px;margin-top:6px;opacity:0.85;">' + escHtml(cc.intro || 'You should say:') + '</p>'
        + '  <ul>' + bullets + '</ul>'
        + '</div>'
        + sampleSwitchHtml
        + (tipsHtml ? '<div class="sp-vocab-tip-strip">' + tipsHtml + '</div>' : '')
        + linkP3Html;
      return;
    }

    // Part 1 & Part 3 Question Strip
    var qs = lesson.questions || [];
    var activeQ = qs[studioState.qIndex] || qs[0];
    var pillsHtml = qs.map(function (q, idx) {
      return '<button type="button" class="sp-q-pill' + (idx === studioState.qIndex ? ' active' : '') + '" onclick="window._spSelectStudioQuestion(' + idx + ')">Câu ' + (idx + 1) + '</button>';
    }).join('');

    var formulaText = activeQ ? (activeQ.formula || activeQ.structureGuide || '') : '';
    var ideasHtml = (activeQ && Array.isArray(activeQ.keyIdeas) && activeQ.keyIdeas.length)
      ? '<div class="sp-idea-chips">' + activeQ.keyIdeas.map(function (id) { return '<span class="sp-tag-pill">💡 ' + escHtml(id) + '</span>'; }).join('') + '</div>'
      : '';
    var vTipsHtml = (activeQ && Array.isArray(activeQ.vocabTips) && activeQ.vocabTips.length)
      ? '<div class="sp-vocab-tip-strip">' + activeQ.vocabTips.slice(0, 14).map(function (t) {
        return '<button type="button" class="sp-vocab-tip-chip" onclick="window._spPlayWord(\'' + escJsAttr(t.word) + '\')" title="' + escHtml((t.ipa ? t.ipa + ' • ' : '') + (t.meaning || '')) + '">🔊 <b>' + escHtml(t.word) + '</b> <small>' + escHtml(t.meaning || '') + '</small></button>';
      }).join('') + '</div>'
      : '';
    var linkP2Html = (lesson.type === 'part3' && lesson.linkedPart2Id)
      ? '<div class="sp-rephrase-box" style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;"><span>🎴 <b>Chủ đề Part 2 gốc:</b> ' + escHtml(lesson.cueCardSummary || lesson.cleanTitle) + '</span><button type="button" class="mini-btn" onclick="window.selectSpeakingLesson(\'' + escHtml(lesson.linkedPart2Id) + '\')">← Mở Cue Card Part 2</button></div>'
      : '';

    card.innerHTML = ''
      + '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">'
      + '  <div class="sp-q-strip">' + pillsHtml + '</div>'
      + '  <button type="button" class="mini-btn" onclick="window._spSpeakStudioQuestion()">🔊 Nghe Giám khảo hỏi</button>'
      + '</div>'
      + '<div class="sp-q-stem">' + escHtml(activeQ ? activeQ.q : lesson.title) + '</div>'
      + '<div class="sp-q-meta-row">'
      + (formulaText ? '<span class="sp-formula-pill">📐 ' + escHtml(formulaText) + '</span>' : '')
      + '  <span class="sp-tag-pill">⏱️ Chuẩn: ' + (lesson.type === 'part1' ? '20–30s' : '35–55s') + '</span>'
      + '</div>'
      + ideasHtml
      + linkP2Html
      + vTipsHtml;
  }

  function resetShadowTurnState(keepAudio) {
    shadowAutoListenGen++;
    studioState.shadowListenAuto = false;
    studioState.shadowResult = null;
    studioState.shadowSpokenText = '';
    studioState.shadowStatusKind = '';
    studioState.shadowStatusMsg = '';
    if (!keepAudio) {
      studioState.shadowAudioUrl = '';
      studioState.shadowDurationSec = 0;
    }
  }

  global._spSelectPart2Sample = function (idx) {
    TtsEngine.stop();
    if (MicEngine.isActive()) MicEngine.cancel();
    studioState.sampleIdx = idx;
    studioState.shadowIdx = 0;
    resetShadowTurnState(false);
    renderStudioPromptCard(activeLesson);
    renderStudioModePane(studioState.mode);
  };

  global._spSelectStudioQuestion = function (idx) {
    TtsEngine.stop();
    if (MicEngine.isActive()) MicEngine.cancel();
    studioState.qIndex = idx;
    studioState.shadowIdx = 0;
    resetShadowTurnState(false);
    renderStudioPromptCard(activeLesson);
    renderStudioModePane(studioState.mode);
  };

  global._spSpeakStudioQuestion = function () {
    if (!activeLesson) return;
    var ctx = getActivePromptContext(activeLesson);
    TtsEngine.speak(ctx.promptText, { lang: prefs.voiceAccent, rate: 0.95 });
  };

  global._spPlayCueCardPrompt = function () {
    if (!activeLesson || !activeLesson.cueCard) return;
    var txt = activeLesson.cueCard.prompt + '. You should say: ' + (activeLesson.cueCard.bullets || []).join(', ');
    TtsEngine.speak(txt, { lang: prefs.voiceAccent, rate: 0.94 });
  };

  global._spPlayWord = function (w, audioUrl) {
    TtsEngine.playMedia(audioUrl || '', String(w || ''), { lang: prefs.voiceAccent, rate: 0.9 });
  };

  global.switchSpeakingMode = function (mode) {
    var prevMode = studioState.mode;
    var nextMode = mode || 'sample';
    shadowAutoListenGen++;
    studioState.shadowListenAuto = false;
    if (prevMode !== nextMode && MicEngine.isActive()) {
      if (prevMode === 'record' && nextMode === 'review') {
        MicEngine.stop().then(function () {
          if (studioState.mode === 'review' && activeLesson) renderModeReview(activeLesson);
        });
      } else {
        MicEngine.cancel();
      }
    }
    studioState.mode = nextMode;
    if (nextMode !== 'shadowing' && nextMode !== 'record') TtsEngine.stop();

    ['sample', 'shadowing', 'drill', 'record', 'review'].forEach(function (m) {
      var btn = document.getElementById('modeBtn_' + m);
      var pane = document.getElementById('paneMode' + m.charAt(0).toUpperCase() + m.slice(1));
      if (btn) btn.classList.toggle('active', m === studioState.mode);
      if (pane) pane.style.display = m === studioState.mode ? 'block' : 'none';
    });

    renderStudioModePane(studioState.mode);
  };

  function getActiveSampleSegments(lesson) {
    var allSegs = global.SpeakingParser.buildSampleSentences(lesson, studioState.sampleIdx);
    if (lesson.type === 'part1' || lesson.type === 'part3') {
      var match = allSegs.filter(function (s) { return s.qIndex === studioState.qIndex; });
      return match.length ? match : allSegs.slice(0, 1);
    }
    return allSegs;
  }

  function renderStudioModePane(mode) {
    if (!activeLesson) return;
    if (mode === 'sample') renderModeSample(activeLesson);
    else if (mode === 'shadowing') renderModeShadowing(activeLesson);
    else if (mode === 'drill') renderModeDrill(activeLesson);
    else if (mode === 'record') renderModeRecord(activeLesson);
    else if (mode === 'review') renderModeReview(activeLesson);
  }

  function buildSegmentAudioItems(seg) {
    if (!seg) return [];
    if (Array.isArray(seg.rawSentences) && seg.rawSentences.length) {
      var items = seg.rawSentences.map(function (rs) {
        return { audioUrl: rs.audioUrl || '', text: rs.text || '' };
      }).filter(function (x) { return Boolean(x.text || x.audioUrl); });
      if (items.length) return items;
    }
    return [{ audioUrl: seg.audioUrl || '', text: seg.en || '' }];
  }

  // --- Mode 1: Sample Answers ---
  function renderModeSample(lesson) {
    var box = document.getElementById('sampleContentBox');
    if (!box) return;
    var viBtn = document.getElementById('btnToggleSampleVi');
    var roleBtn = document.getElementById('btnToggleSampleRoles');
    if (viBtn) viBtn.classList.toggle('active', prefs.showVi);
    if (roleBtn) roleBtn.classList.toggle('active', prefs.showRoles);

    var segs = getActiveSampleSegments(lesson);
    if (!segs.length) {
      box.innerHTML = '<div class="sp-tip-callout">Chưa có bài mẫu cho mục này.</div>';
      return;
    }

    box.innerHTML = segs.map(function (seg, idx) {
      var roleTag = prefs.showRoles && seg.roleLabel
        ? '<span class="sp-seg-role-tag">' + escHtml(seg.roleLabel) + '</span>'
        : '<span></span>';

      var rawSents = Array.isArray(seg.rawSentences) && seg.rawSentences.length
        ? seg.rawSentences
        : null;

      var bodyHtml = rawSents
        ? rawSents.map(function (rs, rIdx) {
          var hasAud = Boolean(rs.audioUrl);
          return '<span style="margin-right:5px;">'
            + '<button type="button" class="mini-btn" style="padding:1px 6px;font-size:11px;margin-right:4px;vertical-align:baseline;" onclick="window._spPlaySegmentSentence(' + idx + ',' + rIdx + ')" title="' + (hasAud ? 'Nghe giọng mẫu bản xứ MP3' : 'Nghe giọng đọc TTS') + '">🔊</button>'
            + highlightCollocationsHtml(rs.text, rs.vocabTips && rs.vocabTips.length ? rs.vocabTips : seg.vocabTips)
            + '</span>';
        }).join(' ')
        : highlightCollocationsHtml(seg.en, seg.vocabTips);

      var glossHtml = '';
      if (prefs.showVi) {
        var tips = seg.vocabTips || [];
        if (seg.vi) {
          glossHtml += '<div class="sp-seg-vi">' + escHtml(seg.vi) + '</div>';
        }
        if (tips.length) {
          glossHtml += '<div class="sp-seg-vi" style="display:flex;flex-wrap:wrap;gap:6px;padding-top:8px;">'
            + tips.map(function (t) {
              var badge = t.isExpr ? '💡 ' : '';
              return '<button type="button" class="sp-vocab-tip-chip" onclick="window._spPlayWord(\'' + escJsAttr(t.word) + '\')" title="Nhấn để nghe phát âm">'
                + badge + '<b>' + escHtml(t.word) + '</b>'
                + (t.meaning ? (' <small>→ ' + escHtml(t.meaning) + '</small>') : '')
                + '</button>';
            }).join('')
            + '</div>';
        }
      }

      return '<div class="sp-sample-segment">'
        + '  <div class="sp-sample-seg-head">'
        + '    ' + roleTag
        + '    <button type="button" class="mini-btn" onclick="window._spPlaySampleSegment(' + idx + ')">🔊 Nghe đoạn mẫu</button>'
        + '  </div>'
        + '  <div class="sp-seg-en">' + bodyHtml + '</div>'
        + glossHtml
        + '</div>';
    }).join('');
  }

  global.toggleSampleVietnamese = function () {
    prefs.showVi = !prefs.showVi;
    savePrefs();
    renderModeSample(activeLesson);
  };

  global.toggleSampleRoles = function () {
    prefs.showRoles = !prefs.showRoles;
    savePrefs();
    renderModeSample(activeLesson);
  };

  global._spPlaySegmentSentence = function (segIdx, sentIdx) {
    if (!activeLesson) return;
    var segs = getActiveSampleSegments(activeLesson);
    var seg = segs[segIdx];
    if (!seg) return;
    var rs = seg.rawSentences && seg.rawSentences[sentIdx];
    if (rs) {
      TtsEngine.playMedia(rs.audioUrl || '', rs.text || '', { lang: prefs.voiceAccent, rate: prefs.shadowSpeed });
    } else {
      TtsEngine.playMedia(seg.audioUrl || '', seg.en || '', { lang: prefs.voiceAccent, rate: prefs.shadowSpeed });
    }
  };

  global._spPlaySampleSegment = function (idx) {
    if (!activeLesson) return;
    var segs = getActiveSampleSegments(activeLesson);
    var seg = segs[idx];
    if (!seg) return;
    if (seg.audioUrl) {
      TtsEngine.playMedia(seg.audioUrl, seg.en, { lang: prefs.voiceAccent, rate: prefs.shadowSpeed });
    } else {
      TtsEngine.speakSequence(buildSegmentAudioItems(seg), { lang: prefs.voiceAccent, rate: prefs.shadowSpeed });
    }
  };

  global.playActiveSampleAudio = function () {
    if (!activeLesson) return;
    var segs = getActiveSampleSegments(activeLesson);
    if (!segs.length) return;
    var seq = [];
    segs.forEach(function (s) {
      if (s.audioUrl) seq.push({ audioUrl: s.audioUrl, text: s.en });
      else seq = seq.concat(buildSegmentAudioItems(s));
    });
    TtsEngine.speakSequence(seq, {
      lang: prefs.voiceAccent,
      rate: prefs.shadowSpeed
    });
  };

  global.copyActiveSampleText = function () {
    if (!activeLesson) return;
    var segs = getActiveSampleSegments(activeLesson);
    var text = segs.map(function (s) { return s.en; }).join('\n\n');
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('Đã copy toàn bộ bài mẫu tiếng Anh!', 'success');
      });
    } else {
      showToast('Trình duyệt chặn clipboard tự động — hãy bôi đen copy thủ công.', 'warn');
    }
  };

  // --- Mode 2: Shadowing Sentence-by-Sentence ---
  function getShadowSentences(lesson) {
    var segs = getActiveSampleSegments(lesson);
    var allSents = [];
    segs.forEach(function (s) {
      if (Array.isArray(s.rawSentences) && s.rawSentences.length) {
        s.rawSentences.forEach(function (rs) {
          if (rs && rs.text) allSents.push({ text: rs.text, audioUrl: rs.audioUrl || '', label: s.roleLabel || s.sectionLabel || '' });
        });
      } else {
        (s.sentences || []).forEach(function (sent) {
          if (sent) allSents.push({ text: sent, audioUrl: '', label: s.roleLabel || s.sectionLabel || '' });
        });
      }
    });
    return allSents;
  }

  function renderShadowTokensHtml(targetText, evalResult) {
    if (evalResult && Array.isArray(evalResult.tokens)) {
      return evalResult.tokens.map(function (t) {
        return '<span class="sp-tok ' + t.status + '">' + escHtml(t.word) + '</span>';
      }).join('');
    }
    return String(targetText || '').split(/\s+/).filter(Boolean).map(function (w) {
      return '<span class="sp-tok">' + escHtml(w) + '</span>';
    }).join('');
  }

  function renderShadowScoreHtml(evalResult) {
    if (!evalResult) return '';
    return ''
      + '<span class="sp-lobby-chip is-exam">🎯 Độ khớp: <b>' + evalResult.accuracy + '%</b></span>'
      + '<span class="sp-lobby-chip">🟢 Khớp chuẩn &nbsp; 🟠 Gần đúng &nbsp; 🔴 Cần đọc rõ hơn</span>';
  }

  function getShadowStatusInfo() {
    if (studioState.shadowStatusMsg) {
      return { kind: studioState.shadowStatusKind || 'warn', text: studioState.shadowStatusMsg };
    }
    if (MicEngine.isActive()) {
      return {
        kind: 'live',
        text: '🎙️ Đang thu âm & nhận diện giọng nói — hãy đọc to từng cụm, từ khớp chuẩn sẽ sáng xanh ngay khi bạn nói.'
      };
    }
    if (studioState.shadowListenAuto) {
      return {
        kind: 'listening',
        text: '🎧 Đang phát câu mẫu... Nói đuổi ngay sau khi máy đọc xong (micro sẽ tự bật).'
      };
    }
    if (!studioState.shadowResult && !studioState.shadowAudioUrl) {
      return {
        kind: 'ready',
        text: '💡 Bấm "🎧➔🎙️ Nghe mẫu & Tự thu" hoặc "🎙️ Bấm Nói Đuổi" để luyện đọc (có thể gõ chữ bên dưới để tự kiểm tra).'
      };
    }
    return { kind: '', text: '' };
  }

  function syncShadowStatusBannerDom() {
    var el = document.getElementById('shadowStatusBanner');
    if (!el) return;
    var info = getShadowStatusInfo();
    if (!info.text) {
      el.style.display = 'none';
      el.className = 'sp-shadow-status';
      el.textContent = '';
      return;
    }
    el.style.display = 'block';
    el.className = 'sp-shadow-status' + (info.kind ? (' is-' + info.kind) : '');
    el.textContent = info.text;
  }

  function setShadowBanner(kind, msg) {
    studioState.shadowStatusKind = kind || '';
    studioState.shadowStatusMsg = msg || '';
    syncShadowStatusBannerDom();
  }

  function updateShadowLiveUi(targetText, spokenText) {
    studioState.shadowSpokenText = spokenText;
    studioState.shadowResult = matchShadowSentence(targetText, spokenText);

    var tokensEl = document.getElementById('shadowWordsHost');
    if (tokensEl) tokensEl.innerHTML = renderShadowTokensHtml(targetText, studioState.shadowResult);

    var scoreEl = document.getElementById('shadowScoreRow');
    if (scoreEl) scoreEl.innerHTML = renderShadowScoreHtml(studioState.shadowResult);

    if (spokenText && spokenText.trim() && studioState.shadowStatusKind === 'warn' && /Chưa nghe thấy/i.test(studioState.shadowStatusMsg)) {
      setShadowBanner('', '');
    }
  }

  function renderModeShadowing(lesson) {
    var box = document.getElementById('shadowingBox');
    var badge = document.getElementById('shadowStepBadge');
    if (!box) return;

    var sents = getShadowSentences(lesson);
    if (!sents.length) {
      box.innerHTML = '<div class="sp-tip-callout">Chưa có câu shadowing cho phần này.</div>';
      return;
    }
    if (studioState.shadowIdx >= sents.length) studioState.shadowIdx = 0;
    if (studioState.shadowIdx < 0) studioState.shadowIdx = sents.length - 1;

    var cur = sents[studioState.shadowIdx];
    if (badge) badge.textContent = 'Câu ' + (studioState.shadowIdx + 1) + '/' + sents.length;

    var evalResult = studioState.shadowResult;
    var tokensHtml = renderShadowTokensHtml(cur.text, evalResult);
    var scoreHtml = renderShadowScoreHtml(evalResult);
    var statusInfo = getShadowStatusInfo();
    var micBusy = MicEngine.isActive();

    var playbackHtml = studioState.shadowAudioUrl
      ? '<div class="sp-saved-audio-bar sp-shadow-playback"><span>🎧 <b>Giọng bạn vừa thu (' + formatSec(studioState.shadowDurationSec || 1) + '):</b></span><audio controls src="' + escHtml(studioState.shadowAudioUrl) + '"></audio></div>'
      : '';

    box.innerHTML = ''
      + '<div class="sp-shadow-head-row">'
      + '  <span class="sp-seg-role-tag">' + escHtml(cur.label || 'Shadowing Drill') + '</span>'
      + '  <div class="sp-shadow-audio-actions">'
      + '    <button type="button" class="btn mini-btn" onclick="window._spPlayCurrentShadowSentence()">🔊 Nghe câu mẫu (' + prefs.shadowSpeed + 'x)</button>'
      + '    <button type="button" class="btn mini-btn sp-listen-auto-btn' + (studioState.shadowListenAuto ? ' active' : '') + '" onclick="window._spShadowListenAndRecord()">' + (studioState.shadowListenAuto ? '⏹ Hủy nghe & thu' : '🎧➔🎙️ Nghe mẫu & Tự thu') + '</button>'
      + '  </div>'
      + '</div>'
      + '<div id="shadowWordsHost" class="sp-word-tokens">' + tokensHtml + '</div>'
      + '<div id="shadowScoreRow" class="sp-shadow-score-row">' + scoreHtml + '</div>'
      + '<div id="shadowStatusBanner" class="sp-shadow-status' + (statusInfo.kind ? (' is-' + statusInfo.kind) : '') + '" style="display:' + (statusInfo.text ? 'block' : 'none') + ';">' + escHtml(statusInfo.text) + '</div>'
      + '<div class="sp-shadow-controls">'
      + '  <button type="button" class="btn btn-primary" onclick="window._spToggleShadowMic()">' + (micBusy ? '⏹ Dừng & Chấm độ khớp' : '🎙️ Bấm Nói Đuổi (Mic + STT)') + '</button>'
      + '  <button type="button" class="mini-btn" onclick="window._spScoreManualShadow()">✓ So khớp văn bản bên dưới</button>'
      + '</div>'
      + '<div id="shadowWaveRow" class="sp-wave-bars" style="display:' + (micBusy ? 'flex' : 'none') + ';">' + buildWaveBarsHtml(14) + '</div>'
      + playbackHtml
      + '<textarea id="shadowSpokenInput" class="sp-transcript-fallback" rows="2" placeholder="Lời bạn nói sẽ hiện trực tiếp tại đây (hoặc gõ nhanh nếu trình duyệt không hỗ trợ SpeechRecognition)..." oninput="window._spUpdateShadowInput(this.value)">' + escHtml(studioState.shadowSpokenText) + '</textarea>';
  }

  function buildWaveBarsHtml(n) {
    var html = '';
    for (var i = 0; i < (n || 16); i++) html += '<span class="sp-wave-bar"></span>';
    return html;
  }

  global.setShadowingSpeed = function (rate) {
    prefs.shadowSpeed = Number(rate) || 0.95;
    savePrefs();
    syncAccentButtons();
    if (studioState.mode === 'shadowing') renderModeShadowing(activeLesson);
  };

  global.stepShadowSentence = function (delta) {
    if (!activeLesson) return;
    TtsEngine.stop();
    if (MicEngine.isActive()) MicEngine.cancel();
    studioState.shadowIdx += delta;
    resetShadowTurnState(false);
    renderModeShadowing(activeLesson);
  };

  global._spPlayCurrentShadowSentence = function () {
    if (!activeLesson) return;
    shadowAutoListenGen++;
    if (studioState.shadowListenAuto) {
      studioState.shadowListenAuto = false;
      syncShadowStatusBannerDom();
      renderModeShadowing(activeLesson);
    }
    var sents = getShadowSentences(activeLesson);
    var cur = sents[studioState.shadowIdx];
    if (cur) TtsEngine.playMedia(cur.audioUrl || '', cur.text, { lang: prefs.voiceAccent, rate: prefs.shadowSpeed });
  };

  global._spShadowListenAndRecord = function () {
    if (!activeLesson) return;
    if (studioState.shadowListenAuto) {
      shadowAutoListenGen++;
      studioState.shadowListenAuto = false;
      TtsEngine.stop();
      setShadowBanner('', '');
      renderModeShadowing(activeLesson);
      return;
    }
    if (MicEngine.isActive()) {
      MicEngine.stop();
      return;
    }
    var sents = getShadowSentences(activeLesson);
    var cur = sents[studioState.shadowIdx];
    if (!cur) return;

    var gen = ++shadowAutoListenGen;
    var targetLessonId = activeLesson.id;
    var targetIdx = studioState.shadowIdx;
    studioState.shadowListenAuto = true;
    setShadowBanner('', '');
    renderModeShadowing(activeLesson);

    TtsEngine.playMedia(cur.audioUrl || '', cur.text, {
      lang: prefs.voiceAccent,
      rate: prefs.shadowSpeed,
      onEnd: function () {
        if (gen !== shadowAutoListenGen) return;
        studioState.shadowListenAuto = false;
        if (!activeLesson || activeLesson.id !== targetLessonId || studioState.mode !== 'shadowing' || studioState.shadowIdx !== targetIdx) {
          return;
        }
        global._spToggleShadowMic();
      }
    });
  };

  global._spUpdateShadowInput = function (val) {
    studioState.shadowSpokenText = val;
  };

  global._spScoreManualShadow = function () {
    if (!activeLesson) return;
    var sents = getShadowSentences(activeLesson);
    var cur = sents[studioState.shadowIdx];
    if (!cur) return;
    studioState.shadowStatusKind = '';
    studioState.shadowStatusMsg = '';
    studioState.shadowResult = matchShadowSentence(cur.text, studioState.shadowSpokenText);
    renderModeShadowing(activeLesson);
  };

  global._spToggleShadowMic = function () {
    if (!activeLesson) return;
    if (MicEngine.isActive()) {
      MicEngine.stop();
      return;
    }
    var sents = getShadowSentences(activeLesson);
    var cur = sents[studioState.shadowIdx];
    if (!cur) return;

    resetShadowTurnState(false);
    var sessionWarning = '';

    MicEngine.start({
      lang: prefs.voiceAccent,
      waveSelector: '#shadowWaveRow .sp-wave-bar',
      maxSeconds: 30,
      onStart: function () { renderModeShadowing(activeLesson); },
      onTranscript: function (txt) {
        var inp = document.getElementById('shadowSpokenInput');
        if (inp) inp.value = txt;
        updateShadowLiveUi(cur.text, txt);
      },
      onUnsupported: function (msg) {
        sessionWarning = msg;
        showToast(msg, 'warn', 5500);
        setShadowBanner('warn', msg);
      },
      onSttWarning: function (code, msg) {
        if (code !== 'no-speech') sessionWarning = msg;
        showMicSttWarning(code, msg);
        setShadowBanner('warn', msg);
      },
      onFinish: function (res) {
        if (res && res.transcript) studioState.shadowSpokenText = res.transcript;
        if (res && res.url) {
          studioState.shadowAudioUrl = res.url;
          studioState.shadowDurationSec = res.durationSec || 0;
        }
        studioState.shadowResult = matchShadowSentence(cur.text, studioState.shadowSpokenText);
        if (sessionWarning) {
          studioState.shadowStatusKind = 'warn';
          studioState.shadowStatusMsg = sessionWarning;
        } else if (!studioState.shadowSpokenText.trim() && studioState.shadowAudioUrl) {
          studioState.shadowStatusKind = 'ready';
          studioState.shadowStatusMsg = '🎙️ Đã lưu bản thu âm bên dưới để bạn tự nghe đối chiếu. Có thể gõ/dán lời vừa nói vào ô bên dưới để chấm độ khớp từng từ.';
        } else {
          studioState.shadowStatusKind = '';
          studioState.shadowStatusMsg = '';
        }
        renderModeShadowing(activeLesson);
      }
    });
  };

  // --- Mode 3: Collocation Drills ---
  function renderModeDrill(lesson) {
    var box = document.getElementById('collocationDrillBox');
    if (!box) return;
    var drills = global.SpeakingParser.buildCollocationDrills(lesson, studioState.sampleIdx);
    if (!drills.length) {
      box.innerHTML = '<div class="sp-tip-callout">Chưa có bài tập phản xạ collocation cho bài học này.</div>';
      return;
    }

    var score = 0;
    var answered = 0;
    drills.forEach(function (d) {
      var pick = studioState.drillAnswers[d.id];
      if (pick !== undefined) {
        answered++;
        if (pick.toLowerCase() === String(d.answer || '').toLowerCase()) score++;
      }
    });

    var headHtml = '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">'
      + '<h3 style="font-size:15.5px;font-weight:800;">🧩 Phản xạ Cụm từ Đắt giá (Collocations & Idioms)</h3>'
      + '<div style="display:flex;gap:8px;align-items:center;">'
      + '  <span class="sp-lobby-chip is-exam">Đúng: ' + score + '/' + drills.length + ' (' + answered + ' câu đã chọn)</span>'
      + (answered > 0 ? '<button type="button" class="mini-btn" onclick="window._spResetDrills()">↻ Làm lại</button>' : '')
      + '</div></div>';

    var listHtml = drills.map(function (d, idx) {
      var picked = studioState.drillAnswers[d.id];
      var blankDisplay = picked !== undefined
        ? '<span class="sp-drill-blank">' + escHtml(d.answer) + '</span>'
        : '<span class="sp-drill-blank">________</span>';
      var sentenceHtml = escHtml(d.promptEn).replace('________', blankDisplay);

      var optsHtml = (d.options || []).map(function (opt) {
        var cls = 'sp-drill-opt-btn';
        if (picked !== undefined) {
          if (opt.toLowerCase() === String(d.answer).toLowerCase()) cls += ' correct';
          else if (opt === picked) cls += ' wrong';
        }
        return '<button type="button" class="' + cls + '" onclick="window._spPickDrillOption(\'' + escJsAttr(d.id) + '\',\'' + escJsAttr(opt) + '\')">' + escHtml(opt) + '</button>';
      }).join('');

      var hintHtml = picked !== undefined
        ? '<div class="sp-quiz-explain">🔊 <b>' + escHtml(d.answer) + '</b> ' + escHtml(d.hintIpa || '') + ' — ' + escHtml(d.hintMeaning || '') + ' <button type="button" class="mini-btn" style="margin-left:6px;" onclick="window._spPlayWord(\'' + escJsAttr(d.fullSentenceEn) + '\')">Nghe cả câu</button></div>'
        : '<div style="font-size:12px;color:var(--muted);">Gợi ý nghĩa: ' + escHtml(d.hintMeaning || '') + '</div>';

      return '<div class="sp-drill-item">'
        + '  <div style="font-size:11.5px;font-weight:800;color:var(--hl-cyan);">CÂU ' + (idx + 1) + ' • ' + escHtml(d.sectionLabel || '') + '</div>'
        + '  <div class="sp-drill-sentence">' + sentenceHtml + '</div>'
        + '  <div class="sp-drill-options">' + optsHtml + '</div>'
        + hintHtml
        + '</div>';
    }).join('');

    box.innerHTML = headHtml + listHtml;
  }

  global._spPickDrillOption = function (drillId, optionStr) {
    studioState.drillAnswers[drillId] = optionStr;
    renderModeDrill(activeLesson);
  };

  global._spResetDrills = function () {
    studioState.drillAnswers = {};
    renderModeDrill(activeLesson);
  };

  // --- Mode 4: Self Record Studio & 60s Part 2 Prep Notepad ---
  function renderModeRecord(lesson) {
    var box = document.getElementById('recordStudioBox');
    if (!box) return;
    var ctx = getActivePromptContext(lesson);
    var micBusy = MicEngine.isActive();

    var prepSectionHtml = '';
    if (lesson.type === 'part2') {
      var timerCls = studioState.prepLeftSec <= 10 ? ' danger' : (studioState.prepLeftSec <= 20 ? ' warn' : '');
      prepSectionHtml = ''
        + '<div class="sp-prep-timer-bar">'
        + '  <div><strong>📝 Bảng Nháp Từ Khóa Part 2 (1 phút chuẩn bị)</strong><div style="font-size:12px;color:var(--muted);">Ghi nhanh bullet points theo WH-questions thay vì viết cả câu</div></div>'
        + '  <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;">'
        + '    <span id="studioPrepTimerPill" class="sp-timer-pill' + timerCls + '">⏱️ ' + formatSec(studioState.prepLeftSec) + '</span>'
        + '    <button type="button" class="mini-btn" onclick="window._spTogglePrepTimer()">' + (studioState.prepRunning ? '⏸ Tạm dừng' : '▶ Bấm giờ 60s') + '</button>'
        + '    <button type="button" class="mini-btn" onclick="window._spResetPrepTimer()">↻ Đặt lại</button>'
        + '    <button type="button" class="mini-btn" onclick="window._spFillSampleNotes()">💡 Gợi ý dàn ý</button>'
        + '  </div>'
        + '</div>'
        + '<textarea id="studioPrepNotepad" class="sp-notepad-textarea" placeholder="Ghi nhanh từ khóa cho 4 ý Cue Card..." oninput="window._spSavePrepNote(this.value)">' + escHtml(studioState.prepNoteText) + '</textarea>';
    } else {
      prepSectionHtml = ''
        + '<div class="sp-prep-timer-bar">'
        + '  <div><strong>💡 Nháp nhanh Ý chính (' + escHtml(ctx.targetDurationLabel) + ')</strong></div>'
        + '  <span class="sp-tag-pill">Đề đang chọn: ' + escHtml(ctx.promptText.slice(0, 72)) + (ctx.promptText.length > 72 ? '...' : '') + '</span>'
        + '</div>'
        + '<textarea id="studioPrepNotepad" class="sp-notepad-textarea" style="min-height:70px;" placeholder="Ghi nhanh 2–3 cụm từ vựng bạn muốn lồng ghép vào câu trả lời..." oninput="window._spSavePrepNote(this.value)">' + escHtml(studioState.prepNoteText) + '</textarea>';
    }

    var audioBarHtml = studioState.recAudioUrl
      ? '<div class="sp-saved-audio-bar"><span>🎧 <b>Bản ghi âm gần nhất (' + formatSec(studioState.recordingSec) + '):</b></span><audio controls src="' + studioState.recAudioUrl + '" style="flex:1;min-width:200px;height:36px;"></audio></div>'
      : '';

    var curWpm = computeWpm(studioState.recTranscript, studioState.recordingSec || 30);

    box.innerHTML = ''
      + prepSectionHtml
      + '<div class="sp-mic-stage">'
      + '  <button type="button" class="s4-mic-btn' + (micBusy ? ' is-recording' : '') + '" onclick="window._spToggleStudioMic()">' + (micBusy ? '⏹' : '🎙️') + '</button>'
      + '  <div style="font-weight:800;font-size:15px;">' + (micBusy ? 'Đang ghi âm & nhận diện giọng nói... (' + formatSec(studioState.recordingSec) + ')' : 'Nhấn Micro để Bắt đầu Tự Nói & Ghi âm') + '</div>'
      + '  <div style="font-size:12.5px;color:var(--muted);">Thời lượng mục tiêu: ' + escHtml(ctx.targetDurationLabel) + ' • Nhấn lại micro để kết thúc</div>'
      + '  <div id="studioWaveRow" class="sp-wave-bars" style="display:' + (micBusy ? 'flex' : 'none') + ';">' + buildWaveBarsHtml(18) + '</div>'
      + '</div>'
      + audioBarHtml
      + '<div>'
      + '  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">'
      + '    <strong style="font-size:13.5px;">🗣️ Transcript Tự Động / Chỉnh sửa Thủ công</strong>'
      + '    <div style="display:flex;gap:8px;align-items:center;">'
      + '      <span class="sp-wpm-badge">📝 ' + countWords(studioState.recTranscript) + ' từ</span>'
      + '      <span class="sp-wpm-badge">⚡ ~' + curWpm + ' WPM</span>'
      + '    </div>'
      + '  </div>'
      + '  <textarea id="studioTranscriptInput" class="sp-transcript-fallback" rows="4" placeholder="Bài nói của bạn sẽ tự động xuất hiện tại đây khi bật Mic (hoặc gõ/dán transcript để chấm 4 tiêu chí & tạo prompt AI)..." oninput="window._spUpdateStudioTranscript(this.value)">' + escHtml(studioState.recTranscript) + '</textarea>'
      + '</div>'
      + '<div style="display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;">'
      + '  <button type="button" class="btn btn-primary" onclick="window.switchSpeakingMode(\'review\')">📊 Phân tích & Chấm điểm 4 Tiêu chí ➜</button>'
      + '</div>';
  }

  global._spSavePrepNote = function (val) {
    studioState.prepNoteText = val;
    if (!activeLesson) return;
    var map = getNotesMap();
    map[activeLesson.id] = val;
    saveJson(STORAGE_NOTES, map);
  };

  global._spFillSampleNotes = function () {
    if (!activeLesson || !Array.isArray(activeLesson.prepNotesTemplate)) return;
    var filled = activeLesson.prepNotesTemplate.join('\n');
    studioState.prepNoteText = filled;
    global._spSavePrepNote(filled);
    renderModeRecord(activeLesson);
  };

  global._spTogglePrepTimer = function () {
    if (studioState.prepRunning) {
      stopStudioPrepTimer();
      renderModeRecord(activeLesson);
      return;
    }
    if (studioState.prepLeftSec <= 0) studioState.prepLeftSec = 60;
    studioState.prepRunning = true;
    renderModeRecord(activeLesson);
    studioState.prepTimerId = setInterval(function () {
      studioState.prepLeftSec = Math.max(0, studioState.prepLeftSec - 1);
      var pill = document.getElementById('studioPrepTimerPill');
      if (pill) {
        pill.textContent = '⏱️ ' + formatSec(studioState.prepLeftSec);
        pill.className = 'sp-timer-pill' + (studioState.prepLeftSec <= 10 ? ' danger' : (studioState.prepLeftSec <= 20 ? ' warn' : ''));
      }
      if (studioState.prepLeftSec <= 0) {
        stopStudioPrepTimer();
        showToast('Hết 1 phút chuẩn bị! Hãy bấm Micro để bắt đầu nói Part 2.', 'warn');
        renderModeRecord(activeLesson);
      }
    }, 1000);
  };

  global._spResetPrepTimer = function () {
    stopStudioPrepTimer();
    studioState.prepLeftSec = 60;
    renderModeRecord(activeLesson);
  };

  global._spUpdateStudioTranscript = function (val) {
    studioState.recTranscript = val;
  };

  global._spToggleStudioMic = function () {
    if (!activeLesson) return;
    if (MicEngine.isActive()) {
      MicEngine.stop();
      return;
    }
    stopStudioPrepTimer();
    studioState.recordingSec = 0;

    MicEngine.start({
      lang: prefs.voiceAccent,
      waveSelector: '#studioWaveRow .sp-wave-bar',
      maxSeconds: activeLesson.type === 'part2' ? 125 : 90,
      onStart: function () { renderModeRecord(activeLesson); },
      onTick: function (sec) {
        studioState.recordingSec = sec;
        var st = document.querySelector('#recordStudioBox .sp-mic-stage strong, #recordStudioBox .sp-mic-stage > div:nth-child(2)');
        if (st) st.textContent = 'Đang ghi âm & nhận diện giọng nói... (' + formatSec(sec) + ')';
      },
      onTranscript: function (txt, sec) {
        studioState.recTranscript = txt;
        studioState.recordingSec = sec;
        var inp = document.getElementById('studioTranscriptInput');
        if (inp) inp.value = txt;
      },
      onUnsupported: function (msg) {
        showToast(msg, 'warn', 5500);
      },
      onSttWarning: showMicSttWarning,
      onFinish: function (res) {
        if (res) {
          if (res.transcript) studioState.recTranscript = res.transcript;
          studioState.recordingSec = res.durationSec || studioState.recordingSec;
          studioState.recWpm = computeWpm(studioState.recTranscript, studioState.recordingSec);
          studioState.recAudioId = res.id;
          studioState.recAudioUrl = res.url;
        }
        renderModeRecord(activeLesson);
      }
    });
  };

  // --- Mode 5: 4-Criteria Assessment & AI Examiner Prompt Builder ---
  function buildStudioAiPrompt(lesson, metrics) {
    var ctx = getActivePromptContext(lesson);
    return [
      'You are an official IELTS Speaking Examiner. Evaluate my response strictly according to the 4 public IELTS Speaking criteria (Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation).',
      '',
      'Task Type: ' + lesson.unitTitle + ' (' + lesson.title + ')',
      'Prompt Question: ' + ctx.promptText,
      (lesson.type === 'part2' && lesson.cueCard && Array.isArray(lesson.cueCard.bullets))
        ? ('Cue Card Bullets:\n- ' + lesson.cueCard.bullets.join('\n- '))
        : '',
      'Measured Duration: ' + formatSec(studioState.recordingSec || 30) + ' | Speaking Pace: ~' + metrics.wpm + ' WPM | Word Count: ' + metrics.wordCount,
      'Candidate Transcript:',
      studioState.recTranscript || '[No transcript captured yet]',
      '',
      'Please provide:',
      '1. Estimated Band scores (0.5 increments) for FC, LR, GRA, PR and Overall Band.',
      '2. Line-by-line naturalness & grammar corrections.',
      '3. 3 idiomatic/collocational upgrades suited for Band 8.0+.',
      '4. Summary in Vietnamese + English target phrases.'
    ].filter(Boolean).join('\n');
  }

  function renderBandPillsRow(key, currentVal, handlerName) {
    return '<div class="sp-band-chips">' + BAND_STEPS.map(function (b) {
      var act = Math.abs(b - Number(currentVal || 6.5)) < 0.05;
      return '<button type="button" class="sp-band-chip' + (act ? ' active' : '') + '" onclick="window.' + handlerName + '(\'' + key + '\',' + b + ')">' + b.toFixed(1) + '</button>';
    }).join('') + '</div>';
  }

  function renderModeReview(lesson) {
    var box = document.getElementById('reviewStudioBox');
    if (!box) return;

    var targets = collectTargetLexis(lesson);
    var metrics = analyzeTranscriptMetrics(studioState.recTranscript, studioState.recordingSec || 30, targets);
    var avg = (studioState.scores.fc + studioState.scores.lr + studioState.scores.gra + studioState.scores.pr) / 4;
    var overall = roundIeltsBand(avg);
    var promptStr = buildStudioAiPrompt(lesson, metrics);

    var criteriaDefs = [
      { key: 'fc', name: '1. Fluency & Coherence (FC)', tip: 'Trôi chảy, nối ý tự nhiên, hạn chế ngập ngừng' },
      { key: 'lr', name: '2. Lexical Resource (LR)', tip: 'Collocations, idioms đúng ngữ cảnh, ít lặp từ' },
      { key: 'gra', name: '3. Grammatical Range (GRA)', tip: 'Đa dạng mệnh đề quan hệ, điều kiện, thì linh hoạt' },
      { key: 'pr', name: '4. Pronunciation (PR)', tip: 'Trọng âm từ, nối âm tự nhiên, ngữ điệu nhấn nhá' }
    ];

    var targetHitBadges = metrics.usedTargets.length
      ? metrics.usedTargets.map(function (w) { return '<span class="sp-tag-pill">✓ ' + escHtml(w) + '</span>'; }).join(' ')
      : '<span style="font-size:12.5px;color:var(--muted);">Chưa phát hiện cụm từ mục tiêu nào trong transcript.</span>';

    box.innerHTML = ''
      + '<div class="sp-metrics-grid">'
      + '  <div class="sp-metric-tile"><span class="sp-metric-lbl">Từ đã nói</span><span class="sp-metric-val">' + metrics.wordCount + '</span></div>'
      + '  <div class="sp-metric-tile"><span class="sp-metric-lbl">Tốc độ (WPM)</span><span class="sp-metric-val">' + metrics.wpm + '</span></div>'
      + '  <div class="sp-metric-tile"><span class="sp-metric-lbl">Target Lexis</span><span class="sp-metric-val">' + metrics.usedTargets.length + '/' + metrics.targetTotal + '</span></div>'
      + '  <div class="sp-metric-tile"><span class="sp-metric-lbl">Band tự chấm</span><span class="sp-metric-val" style="color:var(--hl-green);">' + overall.toFixed(1) + '</span></div>'
      + '</div>'
      + '<div class="sp-tip-callout">⚡ <b>Nhận xét tốc độ & mạch nói:</b> ' + escHtml(metrics.wpmDiagnosis) + ' • Từ nối phát hiện: <b>' + metrics.connectorsUsed.length + '</b> • Từ ngập ngừng (fillers): <b>' + metrics.fillerCount + '</b>.<div style="margin-top:6px;">🎯 <b>Cụm từ đắt giá đã dùng:</b> ' + targetHitBadges + '</div></div>'
      + '<div class="sp-rubric-grid">'
      + criteriaDefs.map(function (c) {
        return '<div class="sp-criteria-card">'
          + '  <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;"><strong>' + c.name + '</strong><span class="sp-lobby-chip is-exam">' + Number(studioState.scores[c.key]).toFixed(1) + '</span></div>'
          + '  <div style="font-size:12px;color:var(--muted);">' + c.tip + '</div>'
          + renderBandPillsRow(c.key, studioState.scores[c.key], '_spSetStudioCriterion')
          + '</div>';
      }).join('')
      + '</div>'
      + '<div class="sp-ai-prompt-box">'
      + '  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">'
      + '    <strong>🤖 Prompt Chấm Điểm Examiner Cho ChatGPT / Claude</strong>'
      + '    <button type="button" class="mini-btn" onclick="window._spCopyAiPrompt()">📋 Copy Prompt Examiner</button>'
      + '  </div>'
      + '  <textarea id="studioAiPromptText" class="sp-notepad-textarea" rows="5" readonly>' + escHtml(promptStr) + '</textarea>'
      + '  <textarea id="studioAiFeedbackInput" class="sp-notepad-textarea" rows="3" placeholder="Dán nhận xét hoặc điểm từ ChatGPT/Claude vào đây (nếu có)..." oninput="window._spUpdateStudioFeedback(this.value)">' + escHtml(studioState.aiFeedback) + '</textarea>'
      + '  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">'
      + '    <button type="button" class="btn mini-btn" onclick="window.switchSpeakingMode(\'record\')">← Quay lại sửa/ghi âm lại</button>'
      + '    <button type="button" class="btn btn-primary" onclick="window._spSaveStudioSubmission()">💾 Lưu Bài nói & Kết quả vào Lịch sử</button>'
      + '  </div>'
      + '</div>';
  }

  global._spSetStudioCriterion = function (key, val) {
    studioState.scores[key] = Number(val);
    renderModeReview(activeLesson);
  };

  global._spUpdateStudioFeedback = function (val) {
    studioState.aiFeedback = val;
  };

  global._spCopyAiPrompt = function () {
    var el = document.getElementById('studioAiPromptText');
    if (!el) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(el.value).then(function () {
        showToast('Đã copy Prompt Examiner! Hãy dán vào ChatGPT hoặc Claude.', 'success');
      });
    }
  };

  global._spSaveStudioSubmission = function () {
    if (!activeLesson) return;
    var targets = collectTargetLexis(activeLesson);
    var metrics = analyzeTranscriptMetrics(studioState.recTranscript, studioState.recordingSec || 30, targets);
    var avg = (studioState.scores.fc + studioState.scores.lr + studioState.scores.gra + studioState.scores.pr) / 4;
    var overall = roundIeltsBand(avg);
    var ctx = getActivePromptContext(activeLesson);

    var record = {
      id: 'sub_studio_' + Date.now(),
      kind: 'studio',
      lessonId: activeLesson.id,
      title: activeLesson.title,
      unitId: activeLesson.unitId,
      questionText: ctx.promptText,
      transcript: studioState.recTranscript,
      durationSec: studioState.recordingSec,
      wpm: metrics.wpm,
      wordCount: metrics.wordCount,
      usedTargets: metrics.usedTargets,
      scores: Object.assign({}, studioState.scores),
      overallBand: overall,
      aiFeedback: studioState.aiFeedback,
      audioId: studioState.recAudioId || null,
      createdAt: Date.now()
    };

    saveSubmissionRecord(record);
    if (!isLessonDone(activeLesson.id)) {
      markLessonDone(activeLesson.id, true);
      renderSidebar();
    }
    showToast('Đã lưu kết quả Studio (Band ' + overall.toFixed(1) + ') vào Lịch sử!', 'success');
  };

  // =========================================================================
  // 10. UNIT 6: PRACTICE ZONE SẢNH CHỜ & PHÒNG THI THẬT FULLSCREEN
  // =========================================================================
  function renderPzLobby(lesson) {
    if (!lesson) return;
    selectedPzLessonId = lesson.id;

    var badgeEl = document.getElementById('lobbyExaminerBadge');
    var titleEl = document.getElementById('lobbyTestTitle');
    var seriesEl = document.getElementById('lobbyTestSeries');
    var p1El = document.getElementById('lobbyPart1Summary');
    var p2El = document.getElementById('lobbyPart2Summary');
    var p3El = document.getElementById('lobbyPart3Summary');
    var strictSel = document.getElementById('pzStrictnessSelect');
    var voiceSel = document.getElementById('pzVoiceSelect');
    var timerChk = document.getElementById('pzStrictTimersCheck');
    var pairBtn = document.getElementById('btnPzPairFull');
    var pickerBtn = document.getElementById('btnOpenPzPicker');

    var persona = lesson.examinerPersona || { name: 'Examiner', accent: 'UK', lang: 'en-GB' };
    var hasP1 = lesson.part1 && ((lesson.part1.topic1Qs || []).length + (lesson.part1.topic2Qs || []).length > 0);
    var hasP23 = Boolean((lesson.part2 && lesson.part2.prompt) || (lesson.part3 && (lesson.part3.questions || []).length));
    var p1Count = hasP1
      ? ((lesson.part1.topic1Qs ? lesson.part1.topic1Qs.length : 0) + (lesson.part1.topic2Qs ? lesson.part1.topic2Qs.length : 0))
      : 0;
    var p3Count = (lesson.part3 && lesson.part3.questions) ? lesson.part3.questions.length : 0;

    if (badgeEl) badgeEl.textContent = (persona.accent === 'UK' ? '🇬🇧 ' : persona.accent === 'AU' ? '🇦🇺 ' : '🇺🇸 ') + persona.name + ' (' + persona.accent + ')';
    if (titleEl) titleEl.textContent = lesson.title;
    if (seriesEl) seriesEl.textContent = lesson.series || 'Full Academic Speaking Mock Simulation';
    if (p1El) {
      p1El.textContent = hasP1
        ? ('Interview: ' + (lesson.part1.topic1Title || 'Part 1') + (lesson.part1.topic2Title ? ' & ' + lesson.part1.topic2Title : '') + ' (' + p1Count + ' câu)')
        : '⚠️ Đề Topic Part 2+3 (không có Part 1 — hoặc bấm Ghép đủ 3 phần bên phải)';
    }
    if (p2El) {
      p2El.textContent = (lesson.part2 && lesson.part2.prompt)
        ? ('Cue Card: ' + lesson.part2.prompt)
        : '⚠️ Đề Topic Part 1 (không có Part 2 — hoặc bấm Ghép đủ 3 phần bên phải)';
    }
    if (p3El) {
      p3El.textContent = (hasP23 && p3Count)
        ? ('Two-Way Discussion: ' + (lesson.part3.topicTitle || lesson.cleanTitle || 'Part 3') + ' (' + p3Count + ' câu)')
        : (hasP23 ? 'Two-Way Discussion: Theo chủ đề Cue Card' : '⚠️ Đề Topic Part 1 (chỉ thi Part 1)');
    }

    if (pairBtn) {
      pairBtn.style.display = (lesson.pzKind === 'topic_p1' || lesson.pzKind === 'topic_p23') ? '' : 'none';
    }
    if (pickerBtn && parsedStats) {
      pickerBtn.textContent = '📚 Kho ' + parsedStats.practiceZone.toLocaleString('vi-VN') + ' Bộ Đề';
    }

    if (strictSel) strictSel.value = prefs.pzStrictness || 'strict';
    if (voiceSel) voiceSel.value = prefs.voiceAccent || lesson.examinerDefaultVoice || 'en-GB';
    if (timerChk) timerChk.checked = prefs.pzStrictTimers !== false;

    renderLobbyHistory();
  }

  global.pairAndStartFullPzExam = function () {
    var target = (activeLesson && activeLesson.type === 'practice_full')
      ? activeLesson
      : global.SpeakingParser.getLessonById(selectedPzLessonId);
    if (!target || typeof global.SpeakingParser.pairTopicWithRandomComplement !== 'function') {
      global.startRandomSpeakingExam();
      return;
    }
    var paired = global.SpeakingParser.pairTopicWithRandomComplement(target);
    if (paired) launchPzExam(paired);
  };

  function renderLobbyHistory() {
    var host = document.getElementById('lobbyHistoryList');
    if (!host) return;
    var mocks = getSubmissions().filter(function (s) { return s && s.kind === 'mock'; }).slice(0, 6);
    if (!mocks.length) {
      host.innerHTML = '<div class="sp-tip-callout" style="margin:0;">Bạn chưa hoàn thành bài thi thử phòng thi thật nào. Hãy bấm <b>Bước vào Phòng Thi Thật</b> ở trên để thử sức nhé!</div>';
      return;
    }
    host.innerHTML = mocks.map(function (m) {
      var dateStr = new Date(m.createdAt || Date.now()).toLocaleDateString('vi-VN');
      return '<div class="sp-history-item">'
        + '  <div><strong>' + escHtml(m.title) + '</strong><div style="font-size:12px;color:var(--muted);">' + dateStr + ' • ~' + (m.wpm || 0) + ' WPM • ' + (m.wordCount || 0) + ' từ</div></div>'
        + '  <div style="display:flex;align-items:center;gap:8px;">'
        + '    <span class="sp-lobby-chip is-exam">Band ' + Number(m.overallBand || 6.5).toFixed(1) + '</span>'
        + '    <button type="button" class="mini-btn" onclick="window._spViewSubmissionDetail(\'' + escHtml(m.id) + '\')">Xem chi tiết</button>'
        + '  </div>'
        + '</div>';
    }).join('');
  }

  global.runLobbyMicCheck = function () {
    var statusEl = document.getElementById('pzMicCheckStatus');
    if (statusEl) statusEl.textContent = '🔊 Đang thử phát loa Giám khảo & kiểm tra quyền Micro...';
    TtsEngine.speak('Hello, microphone check one two three. Good luck with your IELTS Speaking test.', {
      lang: (document.getElementById('pzVoiceSelect') && document.getElementById('pzVoiceSelect').value) || prefs.voiceAccent,
      rate: 0.98
    });

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (statusEl) statusEl.innerHTML = '<span style="color:var(--hl-gold);">⚠️ Trình duyệt không cấp API Micro trực tiếp — vẫn thi được bằng chế độ nhập transcript thay thế.</span>';
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (ms) {
      ms.getTracks().forEach(function (t) { t.stop(); });
      if (statusEl) statusEl.innerHTML = '<span style="color:var(--hl-green);">✅ Micro & Loa Giám khảo hoạt động ổn định! Sẵn sàng vào phòng thi.</span>';
      showToast('Kiểm tra Micro & Loa thành công!', 'success');
    }).catch(function () {
      if (statusEl) statusEl.innerHTML = '<span style="color:var(--sp-accent-rose);">⚠️ Chưa cấp quyền Micro. Bạn có thể cấp quyền trên thanh địa chỉ hoặc gõ transcript trong phòng thi.</span>';
    });
  };

  global.openPracticeZoneFromStudio = function () {
    var target = (selectedPzLessonId && global.SpeakingParser.getLessonById(selectedPzLessonId))
      || allLessons.find(function (l) { return l.unitId === 'u_6'; });
    if (target) global.selectSpeakingLesson(target.id);
    else global.switchSpeakingUnit('u_6');
  };

  global.startRandomSpeakingExam = function () {
    var rnd = global.SpeakingParser.buildRandomFullTest();
    if (!rnd) return;
    selectedPzLessonId = rnd.id;
    launchPzExam(rnd);
  };

  global.startRandomSpeakingExamFromPicker = function () {
    global.closeSpeakingTestPicker();
    global.startRandomSpeakingExam();
  };

  global.startSpeakingPracticeExam = function () {
    var target = (activeLesson && activeLesson.type === 'practice_full')
      ? activeLesson
      : global.SpeakingParser.getLessonById(selectedPzLessonId);
    if (!target) target = allLessons.find(function (l) { return l.unitId === 'u_6'; });
    if (!target) return;
    launchPzExam(target);
  };

  function getCurrentPzP1Questions(lesson) {
    var out = [];
    if (!lesson || !lesson.part1) return out;
    (lesson.part1.topic1Qs || []).forEach(function (q, idx) {
      out.push(Object.assign({}, q, {
        partLabel: 'Part 1 • Topic A: ' + (lesson.part1.topic1Title || ''),
        qNumLabel: 'Topic A · Q' + (idx + 1),
        isFirstOfTopicB: false
      }));
    });
    (lesson.part1.topic2Qs || []).forEach(function (q, idx) {
      out.push(Object.assign({}, q, {
        partLabel: 'Part 1 • Topic B: ' + (lesson.part1.topic2Title || ''),
        qNumLabel: 'Topic B · Q' + (idx + 1),
        isFirstOfTopicB: idx === 0
      }));
    });
    return out;
  }

  function clearPzTimer() {
    if (pzExam.timerId) {
      clearInterval(pzExam.timerId);
      pzExam.timerId = null;
    }
  }

  function setPzTimerText(text, toneClass) {
    var box = document.getElementById('pzExamTimerBox');
    var txt = document.getElementById('pzExamTimerText');
    if (txt) txt.textContent = text;
    if (box) {
      box.style.borderColor = toneClass === 'danger' ? '#ef4444' : (toneClass === 'warn' ? '#f59e0b' : '');
      box.style.color = toneClass === 'danger' ? '#f87171' : (toneClass === 'warn' ? '#fbbf24' : '');
    }
  }

  function updatePzHeaderChrome() {
    var titleEl = document.getElementById('pzExamTitle');
    if (titleEl && pzExam.lesson) titleEl.textContent = pzExam.lesson.title;

    var order = ['warmup', 'part1', 'part2', 'part3', 'report'];
    var curPhaseGroup = pzExam.phase.indexOf('part2') === 0 ? 'part2' : pzExam.phase;
    var curIdx = order.indexOf(curPhaseGroup);
    order.forEach(function (k, idx) {
      var el = document.getElementById('pzStep_' + k);
      if (!el) return;
      el.classList.toggle('active', idx === curIdx);
      el.classList.toggle('done', idx < curIdx);
    });

    var peekBtn = document.getElementById('btnPzPeekToggle');
    if (peekBtn) {
      var showLabel = pzExam.peekVisible ? '🙈 Ẩn chữ' : '👁️ Hiện chữ';
      peekBtn.innerHTML = showLabel;
    }
  }

  function launchPzExam(lesson) {
    TtsEngine.stop();
    stopStudioPrepTimer();
    clearPzTimer();
    if (MicEngine.isActive()) MicEngine.cancel();

    var strictSel = document.getElementById('pzStrictnessSelect');
    var voiceSel = document.getElementById('pzVoiceSelect');
    var timerChk = document.getElementById('pzStrictTimersCheck');

    prefs.pzStrictness = strictSel ? strictSel.value : prefs.pzStrictness;
    prefs.voiceAccent = voiceSel ? voiceSel.value : (lesson.examinerDefaultVoice || prefs.voiceAccent);
    prefs.pzStrictTimers = timerChk ? timerChk.checked : true;
    savePrefs();

    pzExam = {
      active: true,
      lesson: lesson,
      strictness: prefs.pzStrictness,
      strictTimers: prefs.pzStrictTimers,
      voiceLang: prefs.voiceAccent,
      peekVisible: prefs.pzStrictness === 'guided',
      phase: 'warmup',
      subStage: 'ready',
      stepIndex: 0,
      p2PrepLeft: 60,
      p2TalkElapsed: 0,
      rephraseShown: false,
      rephraseCount: 0,
      repeatCount: 0,
      examinerSpeaking: false,
      timerId: null,
      turnElapsedSec: 0,
      startedAt: Date.now(),
      prepNote: '',
      responses: [],
      reportScores: { fc: 6.5, lr: 6.5, gra: 6.5, pr: 6.5 },
      reportFeedback: '',
      savedToHistory: false
    };

    document.body.classList.add('s4-cbt-mode');
    updatePzHeaderChrome();
    enterPzPhase('warmup', 0);
  }

  global.togglePzQuestionTextPeek = function () {
    pzExam.peekVisible = !pzExam.peekVisible;
    updatePzHeaderChrome();
    renderPzStage();
  };

  global.exitPzExamToLobby = function () {
    var finishExit = function () {
      TtsEngine.stop();
      clearPzTimer();
      if (MicEngine.isActive()) MicEngine.cancel();
      pzExam.active = false;
      document.body.classList.remove('s4-cbt-mode');
      var pzBox = document.getElementById('practiceZoneLobby');
      if (pzBox) pzBox.style.display = 'block';
      if (activeLesson) renderPzLobby(pzExam.lesson || activeLesson);
    };

    if (pzExam.phase === 'report' || pzExam.responses.length === 0) {
      finishExit();
      return;
    }
    uiConfirm('Bạn muốn rời khỏi phòng thi Speaking đang diễn ra? Tiến độ lượt này sẽ không được tự động nộp.', {
      title: 'Thoát phòng thi thật',
      confirmText: 'Rời phòng thi',
      cancelText: 'Ở lại thi tiếp',
      danger: true
    }).then(function (ok) {
      if (ok) finishExit();
    });
  };

  function speakExaminerLines(lines, onComplete) {
    pzExam.examinerSpeaking = true;
    renderPzStage();
    TtsEngine.speakSequence(lines, {
      lang: pzExam.voiceLang,
      rate: 0.96,
      onEnd: function () {
        if (!pzExam.active) return;
        pzExam.examinerSpeaking = false;
        renderPzStage();
        if (onComplete) onComplete();
      }
    });
  }

  function enterPzPhase(phase, stepIndex) {
    clearPzTimer();
    pzExam.phase = phase;
    pzExam.stepIndex = stepIndex || 0;
    pzExam.subStage = 'ready';
    pzExam.turnElapsedSec = 0;
    pzExam.rephraseShown = false;
    updatePzHeaderChrome();

    var L = pzExam.lesson;
    if (!L) return;

    if (phase === 'warmup') {
      setPzTimerText('ID Check');
      var w = L.warmup || {};
      speakExaminerLines([
        w.idCheckScript || 'Good day. Can you tell me your full name please? Could I see your ID?',
        w.callNameScript || 'And what should I call you?'
      ]);
    } else if (phase === 'part1') {
      var p1Qs = getCurrentPzP1Questions(L);
      var q = p1Qs[pzExam.stepIndex];
      if (!q) {
        if (L.part2 && L.part2.prompt) enterPzPhase('part2_prep', 0);
        else finishPzExamToReport();
        return;
      }
      setPzTimerText('P1 · ' + (pzExam.stepIndex + 1) + '/' + p1Qs.length);
      var lines = [];
      if (pzExam.stepIndex === 0) lines.push((L.part1 && L.part1.intro) || 'Now in this first part, let us talk about some everyday topics.');
      else if (q.isFirstOfTopicB && L.part1 && L.part1.transition) lines.push(L.part1.transition);
      lines.push(q.q);
      speakExaminerLines(lines);
    } else if (phase === 'part2_prep') {
      if (!L.part2 || !L.part2.prompt) {
        if (L.part3 && Array.isArray(L.part3.questions) && L.part3.questions.length) enterPzPhase('part3', 0);
        else finishPzExamToReport();
        return;
      }
      pzExam.p2PrepLeft = (L.part2 && L.part2.prepSeconds) || 60;
      setPzTimerText(formatSec(pzExam.p2PrepLeft), 'warn');
      var introP2 = (L.part2 && L.part2.intro) || 'Now I am going to give you a topic and you have one minute to prepare.';
      speakExaminerLines([introP2], function () {
        if (pzExam.phase !== 'part2_prep') return;
        startP2PrepCountdown();
      });
    } else if (phase === 'part2_talk') {
      pzExam.p2TalkElapsed = 0;
      setPzTimerText('00:00 / 02:00');
      pzExam.subStage = 'examiner_speaking';
      renderPzStage();
      var cueScript = (L.part2 && L.part2.prepEndScript) || 'All right? Remember you have one to two minutes for this. Can you start speaking now, please?';
      speakExaminerLines([cueScript], function () {
        if (pzExam.phase !== 'part2_talk') return;
        startP2TalkRecording();
      });
    } else if (phase === 'part2_round') {
      setPzTimerText('Rounding');
      var roQ = (L.part2 && L.part2.roundingOffQ) || 'Do you still think about this experience today?';
      speakExaminerLines([roQ]);
    } else if (phase === 'part3') {
      var p3Qs = (L.part3 && L.part3.questions) || [];
      var p3q = p3Qs[pzExam.stepIndex];
      if (!p3q) { finishPzExamToReport(); return; }
      setPzTimerText('P3 · ' + (pzExam.stepIndex + 1) + '/' + p3Qs.length);
      var p3Lines = [];
      if (pzExam.stepIndex === 0) p3Lines.push((L.part3 && L.part3.intro) || 'Now let us discuss some more general questions.');
      p3Lines.push(p3q.q);
      speakExaminerLines(p3Lines);
    } else if (phase === 'report') {
      setPzTimerText('Hoàn tất');
      renderPzStage();
    }
  }

  function startP2PrepCountdown() {
    clearPzTimer();
    pzExam.timerId = setInterval(function () {
      pzExam.p2PrepLeft = Math.max(0, pzExam.p2PrepLeft - 1);
      setPzTimerText('Prep ' + formatSec(pzExam.p2PrepLeft), pzExam.p2PrepLeft <= 10 ? 'danger' : 'warn');
      var leftEl = document.getElementById('pzPrepClockVal');
      if (leftEl) leftEl.textContent = formatSec(pzExam.p2PrepLeft);
      if (pzExam.p2PrepLeft <= 0) {
        clearPzTimer();
        enterPzPhase('part2_talk', 0);
      }
    }, 1000);
  }

  function startP2TalkRecording() {
    clearPzTimer();
    var limitSec = (pzExam.lesson && pzExam.lesson.part2 && pzExam.lesson.part2.talkSeconds) || 120;
    pzExam.subStage = 'candidate_recording';
    pzExam.p2TalkElapsed = 0;

    var recordSlot = ensurePzResponseSlot('part2_long', 'Part 2 Long Turn', (pzExam.lesson.part2 && pzExam.lesson.part2.prompt) || '');

    MicEngine.start({
      lang: pzExam.voiceLang,
      waveSelector: '#pzExamWaveRow .sp-wave-bar',
      maxSeconds: pzExam.strictTimers ? limitSec : 240,
      onStart: function () { renderPzStage(); },
      onTick: function (sec) {
        pzExam.p2TalkElapsed = sec;
        var cls = sec >= 110 ? 'danger' : (sec >= 95 ? 'warn' : '');
        setPzTimerText(formatSec(sec) + ' / 02:00', cls);
        var clk = document.getElementById('pzTalkClockVal');
        if (clk) clk.textContent = formatSec(sec) + ' / 02:00';
        if (pzExam.strictTimers && sec >= limitSec) {
          stopP2WithExaminerThankYou();
        }
      },
      onTranscript: function (txt, sec) {
        recordSlot.transcript = txt;
        recordSlot.durationSec = sec;
        recordSlot.wpm = computeWpm(txt, sec);
        var box = document.getElementById('pzCandidateTranscriptInput');
        if (box) box.value = txt;
      },
      onUnsupported: function (msg) {
        showToast(msg, 'warn', 5500);
        // Timer vẫn chạy ở chế độ fallback để giữ trải nghiệm chuẩn 02:00
        clearPzTimer();
        pzExam.timerId = setInterval(function () {
          pzExam.p2TalkElapsed += 1;
          var s = pzExam.p2TalkElapsed;
          recordSlot.durationSec = s;
          var cls = s >= 110 ? 'danger' : (s >= 95 ? 'warn' : '');
          setPzTimerText(formatSec(s) + ' / 02:00', cls);
          var clk = document.getElementById('pzTalkClockVal');
          if (clk) clk.textContent = formatSec(s) + ' / 02:00';
          if (pzExam.strictTimers && s >= limitSec) {
            stopP2WithExaminerThankYou();
          }
        }, 1000);
      },
      onSttWarning: showMicSttWarning,
      onFinish: function (res) {
        if (res) {
          if (res.transcript) recordSlot.transcript = res.transcript;
          recordSlot.durationSec = res.durationSec || pzExam.p2TalkElapsed;
          recordSlot.wpm = computeWpm(recordSlot.transcript, recordSlot.durationSec);
          recordSlot.audioId = res.id;
          recordSlot.audioUrl = res.url;
        }
      }
    });
  }

  function stopP2WithExaminerThankYou() {
    if (pzExam.subStage === 'stopped_notice') return;
    clearPzTimer();
    pzExam.subStage = 'stopped_notice';
    MicEngine.stop().then(function () {
      var stopLine = (pzExam.lesson.part2 && pzExam.lesson.part2.stopScript) || 'Thank you very much. I will stop you there.';
      setPzTimerText('Thank you', 'warn');
      speakExaminerLines([stopLine], function () {
        if (!pzExam.active) return;
        enterPzPhase('part2_round', 0);
      });
    });
  }

  function finishPzExamToReport() {
    clearPzTimer();
    var closeLine = (pzExam.lesson.part3 && pzExam.lesson.part3.closingScript) || 'Thank you very much. That is the end of the Speaking test.';
    speakExaminerLines([closeLine], function () {
      if (!pzExam.active) return;
      enterPzPhase('report', 0);
    });
  }

  function ensurePzResponseSlot(key, label, questionText) {
    var existing = pzExam.responses.find(function (r) { return r.key === key; });
    if (existing) return existing;
    var slot = {
      key: key,
      phase: pzExam.phase,
      label: label,
      question: questionText || '',
      transcript: '',
      durationSec: 0,
      wpm: 0,
      audioId: null,
      audioUrl: '',
      usedRephrase: false,
      usedRepeat: false
    };
    pzExam.responses.push(slot);
    return slot;
  }

  function getActivePzQuestionMeta() {
    var L = pzExam.lesson;
    if (!L) return null;
    if (pzExam.phase === 'warmup') {
      return {
        key: 'warmup_id',
        label: 'Warm-up ID Check',
        qText: (L.warmup && L.warmup.idCheckScript) || 'Can you tell me your full name and show your ID?',
        rephraseText: ''
      };
    }
    if (pzExam.phase === 'part1') {
      var p1 = getCurrentPzP1Questions(L);
      var q1 = p1[pzExam.stepIndex];
      return q1 ? {
        key: 'p1_' + pzExam.stepIndex,
        label: q1.qNumLabel,
        qText: q1.q,
        rephraseText: ''
      } : null;
    }
    if (pzExam.phase === 'part2_round') {
      return {
        key: 'p2_round',
        label: 'Part 2 Rounding-off Question',
        qText: (L.part2 && L.part2.roundingOffQ) || 'Do you still remember that clearly?',
        rephraseText: ''
      };
    }
    if (pzExam.phase === 'part3') {
      var p3 = (L.part3 && L.part3.questions) || [];
      var q3 = p3[pzExam.stepIndex];
      return q3 ? {
        key: 'p3_' + pzExam.stepIndex,
        label: 'Part 3 · Question ' + (pzExam.stepIndex + 1) + '/' + p3.length,
        qText: q3.q,
        rephraseText: q3.rephraseQ || ''
      } : null;
    }
    return null;
  }

  function renderExaminerHeaderPanel(phaseTag, badgeCls, statusMsg) {
    var persona = (pzExam.lesson && pzExam.lesson.examinerPersona) || { name: 'Examiner', accent: 'UK' };
    return '<div class="sp-examiner-panel">'
      + '  <div class="sp-examiner-id">'
      + '    <div class="sp-examiner-avatar' + (pzExam.examinerSpeaking ? ' is-speaking' : '') + '">🎙️</div>'
      + '    <div>'
      + '      <strong>' + escHtml(persona.name) + ' · ' + escHtml(persona.accent) + ' IELTS Examiner</strong>'
      + '      <div style="font-size:12.5px;color:var(--muted);">' + (pzExam.examinerSpeaking ? '🔊 Giám khảo đang nói câu hỏi...' : escHtml(statusMsg)) + '</div>'
      + '    </div>'
      + '  </div>'
      + '  <span class="sp-phase-badge ' + badgeCls + '">' + escHtml(phaseTag) + '</span>'
      + '</div>';
  }

  function renderPzStage() {
    var stage = document.getElementById('pzExamStage');
    if (!stage || !pzExam.lesson) return;
    var L = pzExam.lesson;

    if (pzExam.phase === 'report') {
      renderPzReport(stage, L);
      return;
    }

    if (pzExam.phase === 'part2_prep' || pzExam.phase === 'part2_talk' || pzExam.subStage === 'stopped_notice') {
      renderPzPart2Chamber(stage, L);
      return;
    }

    // Warm-up / Part 1 / Part 2 Rounding-off / Part 3
    var meta = getActivePzQuestionMeta();
    if (!meta) return;
    var slot = ensurePzResponseSlot(meta.key, meta.label, meta.qText);
    var micBusy = MicEngine.isActive();

    var showText = pzExam.strictness === 'guided' || pzExam.peekVisible || pzExam.phase === 'warmup';
    var badgeCls = pzExam.phase === 'warmup' ? 'is-warmup' : (pzExam.phase === 'part1' ? 'is-p1' : (pzExam.phase === 'part2_round' ? 'is-p2' : 'is-p3'));

    var curtainContent = showText
      ? '<div style="font-size:18px;font-weight:800;color:var(--text);line-height:1.45;">' + escHtml(meta.qText) + '</div>'
      : '<div class="sp-curtain-blurred" aria-hidden="true">' + escHtml(meta.qText) + '</div><div style="font-size:13px;font-weight:700;color:var(--muted);">🎧 Chế độ Thi Thật đang ẩn câu hỏi — Lắng nghe Giám khảo hoặc dùng nút Repeat / Hiện chữ ở góc trên</div>';

    var rephraseBanner = '';
    if (pzExam.phase === 'part3' && meta.rephraseText) {
      if (pzExam.rephraseShown && showText) {
        rephraseBanner = '<div class="sp-rephrase-box">🔄 <b>Giám khảo diễn đạt lại:</b> ' + escHtml(meta.rephraseText) + '</div>';
      } else if (pzExam.rephraseShown) {
        rephraseBanner = '<div class="sp-rephrase-box">🔄 Giám khảo đang đọc câu diễn đạt lại bằng âm thanh...</div>';
      }
    }

    var p3RephraseBtn = (pzExam.phase === 'part3' && meta.rephraseText)
      ? '<button type="button" class="btn mini-btn" onclick="window._spPzRephrase()">🔄 "Could you rephrase that?"</button>'
      : '';

    var nextLabel = pzExam.phase === 'warmup'
      ? '✓ Xác nhận xong ID Check ➜ Vào Part 1'
      : (pzExam.phase === 'part2_round' ? '➜ Chuyển sang Part 3' : '✓ Nói xong — Câu tiếp theo ➜');

    stage.innerHTML = ''
      + '<div class="sp-exam-chamber">'
      + renderExaminerHeaderPanel(meta.label, badgeCls, micBusy ? '🎙️ Đang ghi âm câu trả lời của bạn...' : 'Nhấn Micro để trả lời hoặc nhấn Repeat nếu nghe chưa rõ')
      + '  <div class="sp-audio-curtain">'
      + curtainContent
      + '    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:4px;">'
      + '      <button type="button" class="btn mini-btn" onclick="window._spPzRepeatQuestion()">🔁 Repeat Question</button>'
      + p3RephraseBtn
      + '    </div>'
      + '  </div>'
      + rephraseBanner
      + '  <div class="sp-mic-stage">'
      + '    <button type="button" class="s4-mic-btn' + (micBusy ? ' is-recording' : '') + '" onclick="window._spPzToggleTurnMic()">' + (micBusy ? '⏹' : '🎙️') + '</button>'
      + '    <strong>' + (micBusy ? 'Đang thu âm (' + formatSec(pzExam.turnElapsedSec) + ') — Nhấn để dừng khi xong' : 'Bấm Micro để trả lời câu hỏi này') + '</strong>'
      + '    <div id="pzExamWaveRow" class="sp-wave-bars" style="display:' + (micBusy ? 'flex' : 'none') + ';">' + buildWaveBarsHtml(18) + '</div>'
      + '  </div>'
      + (slot.audioUrl ? '<div class="sp-saved-audio-bar"><span>🎧 Đã ghi âm lượt này:</span><audio controls src="' + slot.audioUrl + '" style="flex:1;height:34px;"></audio></div>' : '')
      + '  <textarea id="pzCandidateTranscriptInput" class="sp-transcript-fallback" rows="3" placeholder="Transcript câu trả lời hiện trực tiếp tại đây (hoặc gõ/dán nội dung nếu không dùng Mic)..." oninput="window._spPzUpdateTranscript(this.value)">' + escHtml(slot.transcript) + '</textarea>'
      + '  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">'
      + '    <span style="font-size:12px;color:var(--muted);">' + countWords(slot.transcript) + ' từ • ~' + computeWpm(slot.transcript, slot.durationSec || 20) + ' WPM</span>'
      + '    <button type="button" class="btn btn-primary" onclick="window._spPzAdvanceTurn()">' + nextLabel + '</button>'
      + '  </div>'
      + '</div>';
  }

  function renderPzPart2Chamber(stage, L) {
    var p2 = L.part2 || {};
    var isPrep = pzExam.phase === 'part2_prep';
    var isStopped = pzExam.subStage === 'stopped_notice';
    var recordSlot = ensurePzResponseSlot('part2_long', 'Part 2 Long Turn', p2.prompt || '');
    var bulletsHtml = (p2.bullets || []).map(function (b) { return '<li>' + escHtml(b) + '</li>'; }).join('');

    var thankYouHtml = isStopped
      ? '<div class="sp-thankyou-banner">🛑 Hết 2 phút — Giám khảo đã ngắt: <em>"' + escHtml(p2.stopScript || 'Thank you very much. I will stop you there.') + '"</em>. Đang chuyển sang câu hỏi Rounding-off...</div>'
      : '';

    var rightPanelHtml = '';
    if (isPrep) {
      rightPanelHtml = ''
        + '<div style="display:flex;flex-direction:column;gap:10px;">'
        + '  <div class="sp-prep-timer-bar">'
        + '    <div><strong>⏱️ Chuẩn bị 60 giây</strong><div style="font-size:12px;color:var(--muted);">Ghi nhanh từ khóa vào giấy nháp</div></div>'
        + '    <span id="pzPrepClockVal" class="sp-timer-pill warn">' + formatSec(pzExam.p2PrepLeft) + '</span>'
        + '  </div>'
        + '  <textarea class="sp-notepad-textarea" style="min-height:170px;" placeholder="Ghi nhanh 4–6 từ khóa chính... Hết 60 giây phòng thi sẽ tự mở Mic!" oninput="window._spPzSavePrepNote(this.value)">' + escHtml(pzExam.prepNote) + '</textarea>'
        + '  <div class="sp-tip-callout" style="margin:0;">🔒 <b>Micro đang tạm khóa trong 1 phút chuẩn bị</b> chuẩn phòng thi thật. Hết giờ Giám khảo sẽ báo bắt đầu nói.'
        + (!pzExam.strictTimers ? ' <button type="button" class="mini-btn" style="margin-top:6px;" onclick="window._spPzSkipPrep()">⏩ Bắt đầu nói luôn</button>' : '')
        + '  </div>'
        + '</div>';
    } else {
      rightPanelHtml = ''
        + '<div style="display:flex;flex-direction:column;gap:10px;">'
        + '  <div class="sp-prep-timer-bar">'
        + '    <div><strong>🎙️ Đang trình bày Part 2 (1–2 phút)</strong><div style="font-size:12px;color:var(--muted);">Tự động ngắt tại 02:00</div></div>'
        + '    <span id="pzTalkClockVal" class="sp-timer-pill">' + formatSec(pzExam.p2TalkElapsed) + ' / 02:00</span>'
        + '  </div>'
        + '  <div id="pzExamWaveRow" class="sp-wave-bars" style="display:' + (MicEngine.isActive() ? 'flex' : 'none') + ';">' + buildWaveBarsHtml(18) + '</div>'
        + '  <div style="font-size:12px;color:var(--muted);"><b>Nháp từ khóa của bạn:</b> ' + escHtml(pzExam.prepNote || '(Không có ghi chú)') + '</div>'
        + '  <textarea id="pzCandidateTranscriptInput" class="sp-transcript-fallback" rows="5" placeholder="Transcript bài nói 2 phút hiện tự động tại đây..." oninput="window._spPzUpdateTranscript(this.value)">' + escHtml(recordSlot.transcript) + '</textarea>'
        + '  <div style="display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;">'
        + '    <button type="button" class="btn btn-primary" onclick="window._spPzFinishPart2Early()">✓ Tôi đã nói xong — Dừng ghi âm ➜</button>'
        + '  </div>'
        + '</div>';
    }

    stage.innerHTML = ''
      + '<div class="sp-exam-chamber">'
      + renderExaminerHeaderPanel(isPrep ? 'PART 2 • PREP 60s' : 'PART 2 • LONG TURN 120s', 'is-p2', isPrep ? 'Đang tính giờ 1 phút chuẩn bị đề Part 2' : 'Giám khảo đang lắng nghe bài nói 1–2 phút của bạn...')
      + thankYouHtml
      + '  <div class="sp-official-cue-grid">'
      + '    <div class="sp-cue-card-box">'
      + '      <div class="sp-cue-card-tag">CANDIDATE TASK CARD</div>'
      + '      <strong style="font-size:16px;">' + escHtml(p2.prompt || L.title) + '</strong>'
      + '      <p style="font-size:12.5px;margin-top:6px;opacity:0.85;">You should say:</p>'
      + '      <ul>' + bulletsHtml + '</ul>'
      + '    </div>'
      + rightPanelHtml
      + '  </div>'
      + '</div>';
  }

  global._spPzSavePrepNote = function (val) { pzExam.prepNote = val; };
  global._spPzSkipPrep = function () {
    clearPzTimer();
    enterPzPhase('part2_talk', 0);
  };
  global._spPzFinishPart2Early = function () {
    stopP2WithExaminerThankYou();
  };

  global._spPzRepeatQuestion = function () {
    var meta = getActivePzQuestionMeta();
    if (!meta) return;
    pzExam.repeatCount++;
    var slot = ensurePzResponseSlot(meta.key, meta.label, meta.qText);
    slot.usedRepeat = true;
    speakExaminerLines([meta.qText]);
  };

  global._spPzRephrase = function () {
    var meta = getActivePzQuestionMeta();
    if (!meta || !meta.rephraseText) return;
    pzExam.rephraseShown = true;
    pzExam.rephraseCount++;
    var slot = ensurePzResponseSlot(meta.key, meta.label, meta.qText);
    slot.usedRephrase = true;
    speakExaminerLines([meta.rephraseText]);
  };

  global._spPzUpdateTranscript = function (val) {
    if (pzExam.phase === 'part2_talk') {
      var p2Slot = ensurePzResponseSlot('part2_long', 'Part 2 Long Turn', '');
      p2Slot.transcript = val;
      p2Slot.wpm = computeWpm(val, p2Slot.durationSec || pzExam.p2TalkElapsed || 60);
      return;
    }
    var meta = getActivePzQuestionMeta();
    if (!meta) return;
    var slot = ensurePzResponseSlot(meta.key, meta.label, meta.qText);
    slot.transcript = val;
    slot.wpm = computeWpm(val, slot.durationSec || pzExam.turnElapsedSec || 20);
  };

  global._spPzToggleTurnMic = function () {
    if (MicEngine.isActive()) {
      MicEngine.stop();
      return;
    }
    var meta = getActivePzQuestionMeta();
    if (!meta) return;
    var slot = ensurePzResponseSlot(meta.key, meta.label, meta.qText);
    pzExam.turnElapsedSec = 0;

    MicEngine.start({
      lang: pzExam.voiceLang,
      waveSelector: '#pzExamWaveRow .sp-wave-bar',
      maxSeconds: pzExam.phase === 'part3' ? 75 : 55,
      onStart: function () { renderPzStage(); },
      onTick: function (sec) {
        pzExam.turnElapsedSec = sec;
        var sEl = document.querySelector('#pzExamStage .sp-mic-stage strong');
        if (sEl) sEl.textContent = 'Đang thu âm (' + formatSec(sec) + ') — Nhấn để dừng khi xong';
      },
      onTranscript: function (txt, sec) {
        slot.transcript = txt;
        slot.durationSec = sec;
        slot.wpm = computeWpm(txt, sec);
        var inp = document.getElementById('pzCandidateTranscriptInput');
        if (inp) inp.value = txt;
      },
      onUnsupported: function (msg) {
        showToast(msg, 'warn', 5500);
      },
      onSttWarning: showMicSttWarning,
      onFinish: function (res) {
        if (res) {
          if (res.transcript) slot.transcript = res.transcript;
          slot.durationSec = res.durationSec || pzExam.turnElapsedSec;
          slot.wpm = computeWpm(slot.transcript, slot.durationSec);
          slot.audioId = res.id;
          slot.audioUrl = res.url;
        }
        renderPzStage();
      }
    });
  };

  global._spPzAdvanceTurn = function () {
    var finishPromise = MicEngine.isActive() ? MicEngine.stop() : Promise.resolve(null);
    finishPromise.then(function () {
      var L = pzExam.lesson;
      if (!L || !pzExam.active) return;

      if (pzExam.phase === 'warmup') {
        if (getCurrentPzP1Questions(L).length) enterPzPhase('part1', 0);
        else if (L.part2 && L.part2.prompt) enterPzPhase('part2_prep', 0);
        else enterPzPhase('part3', 0);
      } else if (pzExam.phase === 'part1') {
        var p1 = getCurrentPzP1Questions(L);
        if (pzExam.stepIndex + 1 < p1.length) {
          enterPzPhase('part1', pzExam.stepIndex + 1);
        } else if (L.part2 && L.part2.prompt) {
          enterPzPhase('part2_prep', 0);
        } else {
          finishPzExamToReport();
        }
      } else if (pzExam.phase === 'part2_round') {
        var p3List = (L.part3 && L.part3.questions) || [];
        if (p3List.length) enterPzPhase('part3', 0);
        else finishPzExamToReport();
      } else if (pzExam.phase === 'part3') {
        var p3 = (L.part3 && L.part3.questions) || [];
        if (pzExam.stepIndex + 1 < p3.length) {
          enterPzPhase('part3', pzExam.stepIndex + 1);
        } else {
          finishPzExamToReport();
        }
      }
    });
  };

  // --- Final Practice Zone Examiner Report ---
  function renderPzReport(stage, L) {
    var combinedTranscript = pzExam.responses.map(function (r) { return r.transcript; }).filter(Boolean).join(' ');
    var totalDur = pzExam.responses.reduce(function (acc, r) { return acc + (r.durationSec || 0); }, 0);
    var lexTargets = collectTargetLexis(L);
    var metrics = analyzeTranscriptMetrics(combinedTranscript, totalDur || 120, lexTargets);
    var avg = (pzExam.reportScores.fc + pzExam.reportScores.lr + pzExam.reportScores.gra + pzExam.reportScores.pr) / 4;
    var overall = roundIeltsBand(avg);

    var aiPrompt = [
      'You are a Senior IELTS Speaking Examiner. Grade this complete Mock Exam (Warm-up + Part 1 + Part 2 + Part 3).',
      'Test Title: ' + L.title,
      'Total Words Spoken: ' + metrics.wordCount + ' | Avg Pace: ~' + metrics.wpm + ' WPM | Repeat clicks: ' + pzExam.repeatCount + ' | Part 3 Rephrase clicks: ' + pzExam.rephraseCount,
      '',
      pzExam.responses.map(function (r) {
        return '[' + r.label + ']\nQ: ' + r.question + '\nA (' + formatSec(r.durationSec) + '): ' + (r.transcript || '[Audio only / No transcript]');
      }).join('\n\n'),
      '',
      'Please return Band scores (FC, LR, GRA, PR, Overall), top 5 vocabulary upgrades, grammar fixes, and concise Vietnamese examiner advice.'
    ].join('\n');

    var turnsHtml = pzExam.responses.map(function (r) {
      return '<div class="sp-report-part-card">'
        + '  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">'
        + '    <strong>' + escHtml(r.label) + '</strong>'
        + '    <span class="sp-tag-pill">' + formatSec(r.durationSec) + ' • ~' + (r.wpm || 0) + ' WPM' + (r.usedRephrase ? ' • Đã nhờ Rephrase' : '') + '</span>'
        + '  </div>'
        + '  <div style="font-size:13px;color:var(--sub-text);margin-top:4px;"><b>Q:</b> ' + escHtml(r.question) + '</div>'
        + (r.audioUrl ? '<audio controls src="' + r.audioUrl + '" style="width:100%;height:34px;margin-top:6px;"></audio>' : '')
        + '  <div style="font-size:13px;color:var(--text);margin-top:6px;background:var(--card);padding:8px 10px;border-radius:8px;border:1px solid var(--border);">' + escHtml(r.transcript || '(Chưa có transcript văn bản)') + '</div>'
        + '</div>';
    }).join('');

    stage.innerHTML = ''
      + '<div class="sp-exam-chamber sp-exam-report">'
      + renderExaminerHeaderPanel('EXAMINER FINAL REPORT', 'is-p1', 'Hoàn tất bài thi IELTS Speaking trực tiếp')
      + '  <div class="sp-metrics-grid">'
      + '    <div class="sp-metric-tile"><span class="sp-metric-lbl">Tổng từ đã nói</span><span class="sp-metric-val">' + metrics.wordCount + '</span></div>'
      + '    <div class="sp-metric-tile"><span class="sp-metric-lbl">Nhịp độ TB (WPM)</span><span class="sp-metric-val">' + metrics.wpm + '</span></div>'
      + '    <div class="sp-metric-tile"><span class="sp-metric-lbl">Target Lexis</span><span class="sp-metric-val">' + metrics.usedTargets.length + '/' + metrics.targetTotal + '</span></div>'
      + '    <div class="sp-metric-tile"><span class="sp-metric-lbl">Overall Band</span><span class="sp-metric-val" style="color:var(--hl-green);">' + overall.toFixed(1) + '</span></div>'
      + '  </div>'
      + '  <div class="sp-rubric-grid">'
      + ['fc', 'lr', 'gra', 'pr'].map(function (k) {
        var names = { fc: 'Fluency & Coherence', lr: 'Lexical Resource', gra: 'Grammatical Range', pr: 'Pronunciation' };
        return '<div class="sp-criteria-card"><strong>' + names[k] + ' (' + pzExam.reportScores[k].toFixed(1) + ')</strong>' + renderBandPillsRow(k, pzExam.reportScores[k], '_spSetPzReportScore') + '</div>';
      }).join('')
      + '  </div>'
      + '  <div class="sp-ai-prompt-box">'
      + '    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">'
      + '      <strong>🤖 Full Mock Exam AI Examiner Prompt</strong>'
      + '      <button type="button" class="mini-btn" onclick="window._spCopyPzAiPrompt()">📋 Copy Prompt toàn bộ đề</button>'
      + '    </div>'
      + '    <textarea id="pzAiPromptBox" class="sp-notepad-textarea" rows="5" readonly>' + escHtml(aiPrompt) + '</textarea>'
      + '    <textarea class="sp-notepad-textarea" rows="2" placeholder="Ghi chú tự đánh giá hoặc dán nhận xét AI..." oninput="window._spSetPzReportFeedback(this.value)">' + escHtml(pzExam.reportFeedback) + '</textarea>'
      + '    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">'
      + '      <button type="button" class="btn mini-btn" onclick="window.exitPzExamToLobby()">🚪 Về Sảnh Practice Zone</button>'
      + '      <div style="display:flex;gap:8px;flex-wrap:wrap;">'
      + '        <button type="button" class="btn mini-btn" onclick="window.startRandomSpeakingExam()">🎲 Thi thử đề Ngẫu nhiên khác</button>'
      + '        <button type="button" class="btn btn-primary" onclick="window._spSavePzReport()">' + (pzExam.savedToHistory ? '✓ Đã lưu Báo cáo' : '💾 Lưu Báo cáo Mock Test') + '</button>'
      + '      </div>'
      + '    </div>'
      + '  </div>'
      + '  <div style="display:flex;flex-direction:column;gap:8px;"><strong>🎙️ Chi tiết toàn bộ lượt trả lời (Part 1 → Part 3)</strong>' + turnsHtml + '</div>'
      + '</div>';
  }

  global._spSetPzReportScore = function (key, val) {
    pzExam.reportScores[key] = Number(val);
    renderPzStage();
  };
  global._spSetPzReportFeedback = function (val) { pzExam.reportFeedback = val; };
  global._spCopyPzAiPrompt = function () {
    var el = document.getElementById('pzAiPromptBox');
    if (el && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(el.value).then(function () {
        showToast('Đã copy Prompt chấm toàn bộ bài thi Speaking!', 'success');
      });
    }
  };
  global._spSavePzReport = function () {
    if (!pzExam.lesson) return;
    var L = pzExam.lesson;
    var combined = pzExam.responses.map(function (r) { return r.transcript; }).filter(Boolean).join(' ');
    var totalDur = pzExam.responses.reduce(function (a, r) { return a + (r.durationSec || 0); }, 0);
    var metrics = analyzeTranscriptMetrics(combined, totalDur || 120, collectTargetLexis(L));
    var overall = roundIeltsBand((pzExam.reportScores.fc + pzExam.reportScores.lr + pzExam.reportScores.gra + pzExam.reportScores.pr) / 4);

    saveSubmissionRecord({
      id: 'sub_mock_' + Date.now(),
      kind: 'mock',
      lessonId: L.id,
      title: L.title,
      unitId: 'u_6',
      transcript: combined,
      turns: pzExam.responses.map(function (r) {
        return { label: r.label, question: r.question, transcript: r.transcript, durationSec: r.durationSec, wpm: r.wpm, audioId: r.audioId };
      }),
      durationSec: totalDur,
      wpm: metrics.wpm,
      wordCount: metrics.wordCount,
      usedTargets: metrics.usedTargets,
      scores: Object.assign({}, pzExam.reportScores),
      overallBand: overall,
      aiFeedback: pzExam.reportFeedback,
      createdAt: Date.now()
    });
    if (!L.isDynamicRandom && !isLessonDone(L.id)) {
      markLessonDone(L.id, true);
      renderSidebar();
    }
    pzExam.savedToHistory = true;
    renderPzStage();
    showToast('Đã lưu Báo cáo Mock Exam (Band ' + overall.toFixed(1) + ') vào Lịch sử!', 'success');
  };

  // =========================================================================
  // 11. MODAL LỊCH SỬ BÀI NÓI & MODAL KHO 20 BỘ ĐỀ
  // =========================================================================
  global.openSpeakingHistoryModal = function () {
    var modal = document.getElementById('speakingHistoryModal');
    if (modal) modal.style.display = 'flex';
    renderHistoryModalList();
  };

  global.closeSpeakingHistoryModal = function () {
    var modal = document.getElementById('speakingHistoryModal');
    if (modal) modal.style.display = 'none';
  };

  global.filterSpeakingHistory = function (filterKey) {
    historyFilter = filterKey || 'all';
    ['all', 'mock', 'studio', 'graded'].forEach(function (k) {
      var el = document.getElementById('shFilter_' + k);
      if (el) el.classList.toggle('active', k === historyFilter);
    });
    renderHistoryModalList();
  };

  function renderHistoryModalList() {
    var listEl = document.getElementById('modalHistoryList');
    if (!listEl) return;
    var all = getSubmissions();

    var mockList = all.filter(function (x) { return x && x.kind === 'mock'; });
    var studioList = all.filter(function (x) { return x && x.kind === 'studio'; });
    var gradedList = all.filter(function (x) { return x && x.aiFeedback && x.aiFeedback.trim(); });

    var cAll = document.getElementById('shCountAll');
    var cMock = document.getElementById('shCountMock');
    var cStu = document.getElementById('shCountStudio');
    var cGra = document.getElementById('shCountGraded');
    if (cAll) cAll.textContent = String(all.length);
    if (cMock) cMock.textContent = String(mockList.length);
    if (cStu) cStu.textContent = String(studioList.length);
    if (cGra) cGra.textContent = String(gradedList.length);

    var filtered = historyFilter === 'mock' ? mockList
      : (historyFilter === 'studio' ? studioList
        : (historyFilter === 'graded' ? gradedList : all));

    if (!filtered.length) {
      listEl.innerHTML = '<div class="sp-tip-callout">Chưa có bài nói nào trong mục lọc này. Hãy ghi âm ở Speaking Studio hoặc hoàn thành bài thi ở Practice Zone!</div>';
      return;
    }

    listEl.innerHTML = filtered.map(function (item) {
      var dt = new Date(item.createdAt || Date.now()).toLocaleString('vi-VN');
      var badge = item.kind === 'mock' ? '🎯 Thi thử thật' : '🎙️ Studio';
      return '<div class="sp-history-item" id="histCard_' + escHtml(item.id) + '">'
        + '  <div style="flex:1;min-width:220px;">'
        + '    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:4px;">'
        + '      <span class="sp-lobby-chip is-accent">' + badge + '</span>'
        + '      <span class="sp-lobby-chip is-exam">Band ' + Number(item.overallBand || 6.5).toFixed(1) + '</span>'
        + '      <span style="font-size:11.5px;color:var(--muted);">' + escHtml(dt) + '</span>'
        + '    </div>'
        + '    <strong>' + escHtml(item.title) + '</strong>'
        + '    <div style="font-size:12.5px;color:var(--sub-text);margin-top:2px;">' + escHtml(item.wordCount || 0) + ' từ • ~' + escHtml(item.wpm || 0) + ' WPM</div>'
        + (item.aiFeedback ? '<div style="font-size:12px;color:var(--hl-green);margin-top:4px;">🤖 ' + escHtml(item.aiFeedback.slice(0, 140)) + '</div>' : '')
        + '  </div>'
        + '  <div style="display:flex;gap:6px;flex-wrap:wrap;">'
        + '    <button type="button" class="mini-btn" onclick="window._spViewSubmissionDetail(\'' + escHtml(item.id) + '\')">👁️ Chi tiết & Audio</button>'
        + '    <button type="button" class="mini-btn" onclick="window._spAddSubmissionFeedback(\'' + escHtml(item.id) + '\')">📝 Ghi chú AI</button>'
        + '    <button type="button" class="mini-btn" onclick="window._spDeleteSubmission(\'' + escHtml(item.id) + '\')" style="color:var(--sp-accent-rose);">🗑️</button>'
        + '  </div>'
        + '</div>';
    }).join('');
  }

  global._spViewSubmissionDetail = function (subId) {
    var rec = getSubmissions().find(function (x) { return x && x.id === subId; });
    if (!rec) return;
    global.openSpeakingHistoryModal();
    var body = document.getElementById('modalHistoryList');
    if (!body) return;

    var audioIds = [];
    if (rec.audioId) audioIds.push({ id: rec.audioId, label: 'Bản ghi âm Studio' });
    if (Array.isArray(rec.turns)) {
      rec.turns.forEach(function (t) {
        if (t.audioId) audioIds.push({ id: t.audioId, label: t.label });
      });
    }

    body.innerHTML = ''
      + '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">'
      + '  <button type="button" class="mini-btn" onclick="window._spBackHistoryList()">← Quay lại danh sách</button>'
      + '  <span class="sp-lobby-chip is-exam">Overall Band: ' + Number(rec.overallBand || 6.5).toFixed(1) + '</span>'
      + '</div>'
      + '<div class="sp-modal-detail">'
      + '  <h4 style="margin-bottom:6px;">' + escHtml(rec.title) + '</h4>'
      + '  <div id="histAudioMounts" style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;"></div>'
      + '  <div style="font-size:13px;line-height:1.65;white-space:pre-line;background:var(--card);padding:12px;border-radius:10px;border:1px solid var(--border);">'
      + (Array.isArray(rec.turns) && rec.turns.length
        ? rec.turns.map(function (t) { return '【' + escHtml(t.label) + '】\nQ: ' + escHtml(t.question) + '\nA: ' + escHtml(t.transcript || '(Không có transcript)'); }).join('\n\n')
        : escHtml(rec.transcript || '(Không có transcript văn bản)'))
      + '  </div>'
      + (rec.aiFeedback ? '<div class="sp-tip-callout">🤖 <b>Phản hồi AI:</b> ' + escHtml(rec.aiFeedback) + '</div>' : '')
      + '</div>';

    var mounts = document.getElementById('histAudioMounts');
    if (mounts && audioIds.length) {
      audioIds.forEach(function (a) {
        AudioVault.getUrl(a.id).then(function (url) {
          if (url && mounts) {
            var row = document.createElement('div');
            row.className = 'sp-saved-audio-bar';
            row.innerHTML = '<span>🎧 <b>' + escHtml(a.label) + ':</b></span><audio controls src="' + url + '" style="flex:1;height:34px;"></audio>';
            mounts.appendChild(row);
          }
        });
      });
    }
  };

  global._spBackHistoryList = function () {
    renderHistoryModalList();
  };

  global._spAddSubmissionFeedback = function (subId) {
    var list = getSubmissions();
    var item = list.find(function (x) { return x && x.id === subId; });
    if (!item) return;
    uiPrompt('Nhập điểm hoặc nhận xét từ ChatGPT / Claude cho bài "' + item.title + '":', {
      title: 'Lưu nhận xét AI',
      defaultValue: item.aiFeedback || ''
    }).then(function (txt) {
      if (txt === null) return;
      item.aiFeedback = String(txt).trim();
      saveJson(STORAGE_SUBMISSIONS, list);
      renderHistoryModalList();
      showToast('Đã cập nhật nhận xét AI!', 'success');
    });
  };

  global._spDeleteSubmission = function (subId) {
    uiConfirm('Xóa bản lưu lịch sử này (bao gồm file âm thanh cục bộ đi kèm)?', {
      title: 'Xóa lịch sử bài nói',
      confirmText: 'Xóa bỏ',
      danger: true
    }).then(function (ok) {
      if (!ok) return;
      var list = getSubmissions();
      var target = list.find(function (x) { return x && x.id === subId; });
      if (target) {
        if (target.audioId) AudioVault.remove(target.audioId);
        if (Array.isArray(target.turns)) {
          target.turns.forEach(function (t) { if (t.audioId) AudioVault.remove(t.audioId); });
        }
      }
      var next = list.filter(function (x) { return x && x.id !== subId; });
      saveJson(STORAGE_SUBMISSIONS, next);
      updateTopStats();
      renderHistoryModalList();
      renderLobbyHistory();
    });
  };

  // Modal chọn trong 20 Bộ Đề Practice Zone
  global.openSpeakingTestPicker = function () {
    var modal = document.getElementById('speakingTestPickerModal');
    if (modal) modal.style.display = 'flex';
    renderTestPickerGrid();
  };

  global.closeSpeakingTestPicker = function () {
    var modal = document.getElementById('speakingTestPickerModal');
    if (modal) modal.style.display = 'none';
  };

  global._spSetPickerCategory = function (cat) {
    pickerCategoryFilter = cat || 'all';
    pickerRenderLimit = 48;
    renderTestPickerGrid();
  };

  global._spLoadMorePicker = function () {
    pickerRenderLimit += 48;
    renderTestPickerGrid();
  };

  function renderTestPickerGrid() {
    var grid = document.getElementById('pzPickerGrid');
    if (!grid) return;
    var inp = document.getElementById('pzPickerSearchInput');
    var q = inp ? String(inp.value || '').trim() : '';

    var allPz = allLessons.filter(function (l) { return l.unitId === 'u_6'; });
    var countByCat = { all: allPz.length, full_actual: 0, full_sample: 0, topic_p1: 0, topic_p23: 0 };
    allPz.forEach(function (st) {
      if (countByCat[st.pzKind] !== undefined) countByCat[st.pzKind]++;
    });

    var sets = allPz.filter(function (l) {
      if (pickerCategoryFilter !== 'all' && l.pzKind !== pickerCategoryFilter) return false;
      if (!q) return true;
      var hay = [
        l.title,
        l.cleanTitle,
        l.series,
        l.group,
        l.part1 && l.part1.topic1Title,
        l.part2 && l.part2.prompt,
        l.part3 && l.part3.topicTitle
      ].filter(Boolean).join(' ');
      if (global.S4UI && typeof global.S4UI.matchesSearch === 'function') {
        return global.S4UI.matchesSearch(hay, q);
      }
      return hay.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });

    var pillsHtml = '<div class="sp-modal-filter-bar" style="padding:0 0 10px;border:0;margin-bottom:6px;">'
      + [
        { k: 'all', lbl: 'Tất cả (' + countByCat.all + ')' },
        { k: 'full_actual', lbl: '🔥 Actual Full (' + countByCat.full_actual + ')' },
        { k: 'full_sample', lbl: '📘 Sample Full (' + countByCat.full_sample + ')' },
        { k: 'topic_p1', lbl: '💬 Forecast P1 (' + countByCat.topic_p1 + ')' },
        { k: 'topic_p23', lbl: '🎴 Forecast P2+3 (' + countByCat.topic_p23 + ')' }
      ].map(function (c) {
        return '<button type="button" class="sp-filter-pill' + (pickerCategoryFilter === c.k ? ' active' : '') + '" onclick="window._spSetPickerCategory(\'' + c.k + '\')">' + escHtml(c.lbl) + '</button>';
      }).join('')
      + '</div>';

    if (!sets.length) {
      grid.innerHTML = pillsHtml + '<div class="sp-tip-callout">Không tìm thấy bộ đề thi thử phù hợp.</div>';
      return;
    }

    var slice = sets.slice(0, pickerRenderLimit);
    var remain = sets.length - slice.length;

    grid.innerHTML = pillsHtml + '<div class="sp-picker-grid">' + slice.map(function (st, idx) {
      var isAct = selectedPzLessonId === st.id;
      var acc = (st.examinerPersona && st.examinerPersona.accent) || 'UK';
      var flag = acc === 'UK' ? '🇬🇧 UK' : (acc === 'AU' ? '🇦🇺 AU' : '🇺🇸 US');
      var subP1 = (st.part1 && (st.part1.topic1Qs || []).length)
        ? ('<b>Part 1:</b> ' + escHtml(st.part1.topic1Title || 'Interview') + ' (' + st.part1.topic1Qs.length + ' câu)')
        : '<b>Part 1:</b> Có thể ghép thêm ngẫu nhiên';
      var subP2 = (st.part2 && st.part2.prompt)
        ? ('<b>Part 2+3:</b> ' + escHtml(st.part2.prompt))
        : '<b>Part 2+3:</b> Chủ đề luyện riêng Part 1';
      return '<div class="sp-picker-card' + (isAct ? ' active' : '') + '" onclick="window._spSelectTestFromPicker(\'' + escHtml(st.id) + '\')">'
        + '  <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">'
        + '    <span class="sp-lobby-chip is-exam">' + escHtml(st.pzKindLabel || ('Set #' + (idx + 1))) + '</span>'
        + '    <span class="sp-lobby-chip is-accent">' + flag + '</span>'
        + '  </div>'
        + '  <strong style="font-size:14px;">' + escHtml(st.title) + '</strong>'
        + '  <div style="font-size:12px;color:var(--sub-text);">' + subP1 + '</div>'
        + '  <div style="font-size:12px;color:var(--muted);">' + subP2 + '</div>'
        + '</div>';
    }).join('') + '</div>'
      + (remain > 0
        ? '<div style="text-align:center;margin-top:12px;"><button type="button" class="btn mini-btn" onclick="window._spLoadMorePicker()">⬇️ Hiển thị thêm (' + remain + ' đề còn lại)</button></div>'
        : '');
  }

  global._spSelectTestFromPicker = function (lessonId) {
    global.closeSpeakingTestPicker();
    if (pzExam.active) {
      var resolved = global.SpeakingParser.getLessonById(lessonId);
      if (resolved) launchPzExam(resolved);
    } else {
      global.selectSpeakingLesson(lessonId);
    }
  };

  function syncTopbarUnitBadges(stats) {
    if (!stats) return;
    UNITS_LIST = [
      { id: 'all', pill: 'Tất cả', label: 'Tất cả (' + stats.total + ')' },
      { id: 'u_1', pill: 'Vocab', label: 'Vocab SRS (' + stats.vocabTopics + ')' },
      { id: 'u_2', pill: 'P1', label: 'Part 1 (' + stats.part1 + ')' },
      { id: 'u_34', pill: 'P2 & 3', label: 'Part 2 & 3 (' + stats.part2 + ')' },
      { id: 'u_5', pill: 'Phát âm & CT', label: 'Phát âm & Chiến thuật (' + stats.theory + ')' },
      { id: 'u_6', pill: 'Practice Zone', label: 'Practice Zone (' + stats.practiceZone + ')' }
    ];
    var btnMap = {
      u_1: '📚 Vocab (' + stats.vocabTopics + ')',
      u_2: '💬 Part 1 (' + stats.part1 + ')',
      u_34: '🎴 Part 2 & 3 (' + stats.part2 + ')',
      u_5: '🎓 Phát âm & CT (' + stats.theory + ')',
      u_6: '🎯 Practice Zone (' + stats.practiceZone + ')'
    };
    Object.keys(btnMap).forEach(function (uid) {
      var b = document.getElementById('topBtn_' + uid);
      if (b) b.textContent = btnMap[uid];
    });
  }

  // =========================================================================
  // 12. KHỞI TẠO TOÀN BỘ PHÂN HỆ SPEAKING
  // =========================================================================
  function bindEvents() {
    if (global.S4UI && typeof global.S4UI.bindSearchBar === 'function') {
      global.S4UI.bindSearchBar({
        input: 'searchInput',
        clearBtn: 'searchInput_clear',
        searchBtn: 'searchInput_btn',
        delay: 160,
        onSearch: function () { renderSidebar(); }
      });
      global.S4UI.bindSearchBar({
        input: 'pzPickerSearchInput',
        clearBtn: 'pzPickerSearchInput_clear',
        searchBtn: 'pzPickerSearchInput_btn',
        delay: 160,
        onSearch: function () { renderTestPickerGrid(); }
      });
    } else {
      var si = document.getElementById('searchInput');
      if (si) si.addEventListener('input', renderSidebar);
    }

    var sSel = document.getElementById('pzStrictnessSelect');
    var vSel = document.getElementById('pzVoiceSelect');
    var tChk = document.getElementById('pzStrictTimersCheck');
    if (sSel) sSel.addEventListener('change', function () { prefs.pzStrictness = sSel.value; savePrefs(); });
    if (vSel) vSel.addEventListener('change', function () { global.setSpeakingVoiceAccent(vSel.value); });
    if (tChk) tChk.addEventListener('change', function () { prefs.pzStrictTimers = tChk.checked; savePrefs(); });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        global.closeSpeakingHistoryModal();
        global.closeSpeakingTestPicker();
      }
    });
  }

  function initApp() {
    if (!global.SpeakingParser || !global.STUDY4_SPEAKING_DATA) return;
    loadPrefs();

    var parsed = global.SpeakingParser.init(global.STUDY4_SPEAKING_DATA);
    allLessons = (parsed && parsed.lessons) || global.SpeakingParser.getAllLessons();
    parsedStats = (parsed && parsed.stats) || global.SpeakingParser.getStats();
    syncTopbarUnitBadges(parsedStats);

    if (global.S4VocabEngine && typeof global.S4VocabEngine.init === 'function') {
      global.S4VocabEngine.init({
        srsKey: VOCAB_SRS_KEY,
        daysKey: VOCAB_DAYS_KEY,
        settingsKey: VOCAB_SETTINGS_KEY,
        sessionKey: VOCAB_SESSION_KEY,
        supportsAu: true,
        getSrsMap: function () { return loadJson(VOCAB_SRS_KEY, {}); },
        onSaveSrs: function (map) { saveJson(VOCAB_SRS_KEY, map); },
        playWordAudio: function (wordItem, accent) {
          var phrase = typeof wordItem === 'string'
            ? wordItem
            : (wordItem && (wordItem.term || wordItem.word)) || '';
          var chosenAccent = accent || prefs.voiceAccent || 'en-GB';
          var mediaUrl = '';
          if (wordItem && typeof wordItem === 'object') {
            if (chosenAccent === 'en-US') mediaUrl = wordItem.usAudio || '';
            else if (chosenAccent === 'en-AU') mediaUrl = wordItem.auAudio || '';
            else if (chosenAccent === 'en-GB') mediaUrl = wordItem.ukAudio || wordItem.audioUrl || '';
          }
          if (mediaUrl) {
            TtsEngine.playMedia(mediaUrl, phrase, { lang: chosenAccent, rate: 0.94 });
          } else {
            TtsEngine.speak(phrase, { lang: chosenAccent, rate: 0.94 });
          }
        }
      });
    }

    bindEvents();

    // Khôi phục bài học gần nhất hoặc mặc định mở Part 1 Bài 1
    var savedLast = '';
    try { savedLast = localStorage.getItem(STORAGE_LAST) || ''; } catch (e) {}
    var initial = (savedLast && global.SpeakingParser.getLessonById(savedLast))
      || allLessons.find(function (l) { return l.unitId === 'u_2'; })
      || allLessons[0];

    if (initial) {
      activeUnitFilter = normalizeFilterUnit(initial.unitId);
      global.selectSpeakingLesson(initial.id);
    } else {
      renderSidebarPills();
      renderSidebar();
      updateTopStats();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})(window);
