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
  var STORAGE_GEMINI_KEY = 'lp_speaking_gemini_key_v1';
  var VOCAB_SRS_KEY = 'lp_speaking_vocab_srs_v1';
  var VOCAB_DAYS_KEY = 'lp_speaking_vocab_days_v1';
  var VOCAB_SETTINGS_KEY = 'lp_speaking_vocab_settings_v1';
  var VOCAB_SESSION_KEY = 'lp_speaking_vocab_session_v1';

  var BAND_STEPS = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

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
    pzAutoMic: false,
    pzDialogueMode: 'offline',
    pzExaminerStyle: 'adaptive',
    pzGeminiModel: 'gemini-4-hydrogen',
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
    scores: { fc: 0, lr: 0, gra: 0, pr: 0 },
    aiFeedback: '',
    aiFeedbackAuto: false,
    aiBandOverride: '',
    autoGrade: null,
    scoreSource: '',
    gradingBusy: false,
    lastGradedKey: ''
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
    warmupStep: 0,          // 0: Hỏi tên & ID | 1: Chào theo tên & hỏi quê quán/công việc
    candidateName: '',
    stepIndex: 0,           // Index trong Part 1 (0..7) hoặc Part 3 (0..3)
    p2PrepLeft: 60,
    p2TalkElapsed: 0,
    rephraseShown: false,
    activeRephraseText: '',
    activeFollowUpQ: '',
    lastExaminerReaction: '',
    lastFollowUpBridge: '',
    clarifyShown: false,
    clarifyText: '',
    clarifyCount: 0,
    rephraseCount: 0,
    repeatCount: 0,
    followUpCount: 0,
    aiThinking: false,
    autoMic: false,
    feedCollapsed: false,
    dialogueMode: 'offline',
    examinerStyle: 'adaptive',
    resolvedStyle: 'friendly',
    styleSeed: 0,
    usedTemplates: [],
    lastReactionSource: '',
    examinerSpeaking: false,
    timerId: null,
    turnElapsedSec: 0,
    startedAt: 0,
    prepNote: '',
    dialogueHistory: [],    // [{ role, kind, phase, text, tag, ts }]
    responses: [],          // [{ key, phase, label, question, transcript, durationSec, wpm, audioId, audioUrl, usedRephrase, usedRepeat, followUpAsked, followUpQ, followUpTranscript, followUpDurationSec, followUpAudioUrl, followUpAudioId, nudgeUsed, examinerReaction }]
    reportScores: { fc: 0, lr: 0, gra: 0, pr: 0 },
    reportFeedback: '',
    reportFeedbackAuto: false,
    autoGrade: null,
    scoreSource: '',
    gradingBusy: false,
    autoGeminiTriggered: false,
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

  function isScoreUnrated(val) {
    var n = Number(val || 0);
    return !isFinite(n) || n <= 0;
  }

  function formatBandValue(val) {
    return isScoreUnrated(val) ? 'Chưa chấm' : Number(val).toFixed(1);
  }

  function formatBandChipText(val, prefix) {
    if (isScoreUnrated(val)) return 'Chưa chấm';
    return (prefix ? prefix + ' ' : '') + Number(val).toFixed(1);
  }

  function computeAverageBand(scoresObj) {
    if (!scoresObj) return 0;
    var sum = Number(scoresObj.fc || 0) + Number(scoresObj.lr || 0) + Number(scoresObj.gra || 0) + Number(scoresObj.pr || 0);
    if (sum <= 0) return 0;
    return Math.max(1.0, roundIeltsBand(sum / 4));
  }

  function applyManualBandScore(scoresObj, key, val) {
    if (!scoresObj) return;
    var num = Number(val);
    ['fc', 'lr', 'gra', 'pr'].forEach(function (k) {
      if (isScoreUnrated(scoresObj[k])) scoresObj[k] = num;
    });
    scoresObj[key] = num;
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
    if (saved) {
      prefs = Object.assign({}, prefs, saved);
      var changed = false;
      if (prefs.pzGeminiModel !== 'gemini-4-hydrogen') {
        prefs.pzGeminiModel = 'gemini-4-hydrogen';
        changed = true;
      }
      var normStyle = PzDialogueEngine.normalizeStyle(prefs.pzExaminerStyle);
      if (prefs.pzExaminerStyle !== normStyle) {
        prefs.pzExaminerStyle = normStyle;
        changed = true;
      }
      if (changed) savePrefs();
    }
  }

  function savePrefs() {
    saveJson(STORAGE_PREFS, prefs);
  }

  function getStoredGeminiKey() {
    try { return String(localStorage.getItem(STORAGE_GEMINI_KEY) || '').trim(); } catch (e) { return ''; }
  }

  function setStoredGeminiKey(val) {
    try {
      var clean = String(val || '').trim();
      if (clean) localStorage.setItem(STORAGE_GEMINI_KEY, clean);
      else localStorage.removeItem(STORAGE_GEMINI_KEY);
    } catch (e) {}
  }

  // =========================================================================
  // 2. INDEXEDDB AUDIO VAULT (LƯU FILE GHI ÂM CỤC BỘ KHÔNG NGỐN QUOTA)
  // =========================================================================
  var AudioVault = (function () {
    var DB_NAME = 'LinguaPathSpeakingAudio';
    var STORE_NAME = 'recordings';
    var dbPromise = null;
    var objectUrls = new Map();
    var blobCache = new Map();

    function cacheBlob(id, blob) {
      if (!id || !blob) return;
      blobCache.set(id, blob);
      if (blobCache.size > 12) {
        var oldestKey = blobCache.keys().next().value;
        if (oldestKey) blobCache.delete(oldestKey);
      }
    }

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
      cacheBlob(id, blob);
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

    function getBlob(id) {
      if (!id) return Promise.resolve(null);
      if (blobCache.has(id)) return Promise.resolve(blobCache.get(id));
      return openDb().then(function (db) {
        if (!db) return null;
        return new Promise(function (resolve) {
          try {
            var tx = db.transaction(STORE_NAME, 'readonly');
            var req = tx.objectStore(STORE_NAME).get(id);
            req.onsuccess = function () {
              var b = req.result && req.result.blob ? req.result.blob : null;
              if (b) cacheBlob(id, b);
              resolve(b);
            };
            req.onerror = function () { resolve(null); };
          } catch (e) { resolve(null); }
        });
      });
    }

    function remove(id) {
      if (!id) return Promise.resolve();
      blobCache.delete(id);
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

    return { saveBlob: saveBlob, getUrl: getUrl, getBlob: getBlob, remove: remove };
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

    try {
      if (global.sessionStorage) {
        global.sessionStorage.removeItem('lp_sp_stt_broken_v1');
        global.sessionStorage.removeItem('lp_sp_stt_broken_v2');
        global.sessionStorage.removeItem('lp_sp_env_banner_dismissed');
      }
    } catch (e) {}

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
              blob: blob || null,
              mimeType: (blob && blob.type) ? blob.type : '',
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
      isActive: function () { return isRecording; },
      isSttStickyBroken: function () { return false; },
      resetSticky: function () {},
      getEnvironment: function () { return {}; }
    };
  })();

  global.MicEngine = MicEngine;

  function renderSttEnvBannerHtml() {
    return '';
  }

  function syncPzLobbyEnvBanner() {}

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
      scores: { fc: 0, lr: 0, gra: 0, pr: 0 },
      aiFeedback: '',
      aiFeedbackAuto: false,
      aiBandOverride: '',
      autoGrade: null,
      scoreSource: '',
      gradingBusy: false,
      lastGradedKey: ''
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
      + renderSttEnvBannerHtml()
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
      + renderSttEnvBannerHtml()
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
    var targetVal = isScoreUnrated(currentVal) ? -1 : Number(currentVal);
    return '<div class="sp-band-chips">' + BAND_STEPS.map(function (b) {
      var act = targetVal > 0 && Math.abs(b - targetVal) < 0.05;
      return '<button type="button" class="sp-band-chip' + (act ? ' active' : '') + '" onclick="window.' + handlerName + '(\'' + key + '\',' + b + ')">' + b.toFixed(1) + '</button>';
    }).join('') + '</div>';
  }

  function getScoreSourceLabelHtml(scoreSource, gradeSource, isNotRated) {
    if (scoreSource === 'manual') {
      return '<span class="sp-tag-pill" style="background:rgba(245,158,11,0.16);color:var(--hl-gold);">✏️ Đã chỉnh tay (ưu tiên điểm bạn chọn)</span>';
    }
    if (isNotRated) {
      return '<span class="sp-tag-pill" style="background:rgba(244,63,94,0.16);color:var(--sp-accent-rose,#f43f5e);">⚠️ Chưa đủ dữ liệu — Chưa chấm</span>';
    }
    if (gradeSource === 'gemini') {
      return '<span class="sp-tag-pill" style="background:rgba(16,185,129,0.16);color:#10b981;">🤖 Tự chấm AI Examiner (gemini-4-hydrogen)</span>';
    }
    if (gradeSource === 'offline_fallback') {
      return '<span class="sp-tag-pill">⚡ Tự chấm Offline (AI dự phòng)</span>';
    }
    return '<span class="sp-tag-pill">⚡ Tự chấm Offline tức thì (0ms)</span>';
  }

  function renderAutoGradePanelHtml(opts) {
    var o = opts || {};
    var grade = o.grade;
    if (!grade) return '';
    var hasKey = Boolean(getStoredGeminiKey());
    var isNotRated = Boolean(grade.notRated) && o.scoreSource !== 'manual';
    var cf = grade.criteriaFeedback || {};
    var strengthsHtml = (grade.strengths || []).map(function (s) {
      return '<li>' + escHtml(s) + '</li>';
    }).join('');
    var imprHtml = (grade.improvements || []).map(function (s) {
      return '<li>' + escHtml(s) + '</li>';
    }).join('');

    var evidenceReasons = (grade.evidence && Array.isArray(grade.evidence.reasons) && !grade.notRated)
      ? grade.evidence.reasons
      : [];
    var evidenceBarHtml = evidenceReasons.length
      ? '<div style="font-size:12px;color:var(--hl-gold,#f59e0b);background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.28);padding:7px 10px;border-radius:8px;">📏 <b>Giới hạn theo bằng chứng:</b> ' + escHtml(evidenceReasons.join(' • ')) + '</div>'
      : '';

    var upgradesHtml = (grade.vocabUpgrades || []).length
      ? '<div class="sp-autograde-box"><strong>💎 Nâng cấp Từ vựng (Band 7.0–8.5)</strong><div style="display:flex;flex-direction:column;gap:6px;margin-top:6px;">'
        + grade.vocabUpgrades.map(function (v) {
          return '<div class="sp-upgrade-row"><div><span style="color:var(--muted);">' + escHtml(v.from || 'Gợi ý') + '</span> ➜ <b style="color:var(--hl-green);">' + escHtml(v.upgrade) + '</b></div>'
            + (v.meaningVi ? '<div style="font-size:11.5px;color:var(--muted);">' + escHtml(v.meaningVi) + '</div>' : '')
            + '</div>';
        }).join('')
        + '</div></div>'
      : '';

    var grammarHtml = (grade.grammarFixes || []).length
      ? '<div class="sp-autograde-box"><strong>🔧 Sửa &amp; Nâng cấp Ngữ pháp</strong><div style="display:flex;flex-direction:column;gap:6px;margin-top:6px;">'
        + grade.grammarFixes.map(function (g) {
          return '<div class="sp-upgrade-row"><div><span style="color:var(--sp-accent-rose,#f43f5e);">' + escHtml(g.original) + '</span> ➜ <b style="color:var(--hl-green);">' + escHtml(g.corrected) + '</b></div>'
            + (g.noteVi ? '<div style="font-size:11.5px;color:var(--muted);">' + escHtml(g.noteVi) + '</div>' : '')
            + '</div>';
        }).join('')
        + '</div></div>'
      : '';

    var quickKeyRow = !hasKey
      ? '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 10px;border-radius:8px;background:var(--card);border:1px dashed var(--border);">'
        + '  <span style="font-size:12px;color:var(--muted);flex:1;min-width:180px;">🔑 Chưa có Gemini Key — dán API Key cá nhân (Free Tier) nếu muốn chấm sâu bằng <b>gemini-4-hydrogen</b>:</span>'
        + '  <input type="password" class="sp-select" style="max-width:210px;font-size:12px;" placeholder="Dán Gemini API Key..." oninput="window._spSaveQuickGeminiKey && window._spSaveQuickGeminiKey(this.value)">'
        + '</div>'
      : '';

    var aiBtnLabel = o.busy
      ? '⏳ Đang chấm sâu với Gemini 4 Hydrogen...'
      : '🤖 Chấm sâu với AI (gemini-4-hydrogen)';

    var fmtCrit = function (k) {
      return grade.notRated ? 'Chưa chấm' : Number(grade.scores[k] || 0).toFixed(1);
    };

    var strengthBoxHtml = grade.notRated
      ? '<div class="sp-autograde-box"><strong>🎙️ Cách lấy điểm chính xác</strong><ul class="sp-autograde-list"><li>Bật Micro trên Chrome/Edge hoặc gõ/dán nội dung câu trả lời vào ô transcript bên dưới.</li><li>Cần ít nhất 3 từ tiếng Anh hợp lệ ở phần trả lời (không tính Warm-up ID Check) để hệ thống chấm Band 1.0–9.0.</li></ul></div>'
      : '<div class="sp-autograde-box"><strong>✓ Điểm mạnh</strong><ul class="sp-autograde-list">' + (strengthsHtml || '<li>Đã ghi nhận câu trả lời hợp lệ.</li>') + '</ul></div>';

    return '<div class="sp-autograde-panel" id="' + escHtml(o.panelId || 'spAutoGradePanel') + '">'
      + '  <div class="sp-autograde-head">'
      + '    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">'
      + '      <strong>🎯 Đánh giá Tự động (4 Tiêu chí IELTS)</strong>'
      + getScoreSourceLabelHtml(o.scoreSource, grade.source, isNotRated)
      + '    </div>'
      + '    <div style="display:flex;gap:6px;flex-wrap:wrap;">'
      + '      <button type="button" class="btn mini-btn" onclick="window.' + o.onRegradeOfflineFn + '()"' + (o.busy ? ' disabled' : '') + '>⚡ Chấm lại Offline</button>'
      + '      <button type="button" class="btn mini-btn" onclick="window.' + o.onRunAiFn + '()"' + ((o.busy || (!grade.hasTranscript && !o.hasAudio)) ? ' disabled' : '') + '>' + aiBtnLabel + '</button>'
      + '    </div>'
      + '  </div>'
      + quickKeyRow
      + '  <div class="sp-tip-callout" style="margin:0;"><b>Nhận xét tổng quan:</b> ' + escHtml(grade.summaryVi || '') + '</div>'
      + evidenceBarHtml
      + '  <div class="sp-autograde-criteria">'
      + '    <div class="sp-autograde-crit-item"><b>FC (' + fmtCrit('fc') + '):</b> ' + escHtml(cf.fc || '') + '</div>'
      + '    <div class="sp-autograde-crit-item"><b>LR (' + fmtCrit('lr') + '):</b> ' + escHtml(cf.lr || '') + '</div>'
      + '    <div class="sp-autograde-crit-item"><b>GRA (' + fmtCrit('gra') + '):</b> ' + escHtml(cf.gra || '') + '</div>'
      + '    <div class="sp-autograde-crit-item"><b>PR (' + fmtCrit('pr') + '):</b> ' + escHtml(cf.pr || '') + '</div>'
      + '  </div>'
      + '  <div class="sp-autograde-cols">'
      + strengthBoxHtml
      + '    <div class="sp-autograde-box"><strong>🎯 Cần cải thiện</strong><ul class="sp-autograde-list">' + imprHtml + '</ul></div>'
      + '  </div>'
      + ((upgradesHtml || grammarHtml) ? '<div class="sp-autograde-cols">' + upgradesHtml + grammarHtml + '</div>' : '')
      + (grade.prEstimatedNote
        ? '<div style="font-size:11.5px;color:' + (grade.hasRealAudio ? 'var(--hl-green,#10b981);font-weight:700' : 'var(--muted)') + ';">' + (grade.hasRealAudio ? '' : 'ℹ️ ') + escHtml(grade.prEstimatedNote) + '</div>'
        : '')
      + '</div>';
  }

  function buildCompactGradeMeta(grade, scoreSource) {
    if (!grade) return { scoreSource: scoreSource || 'manual', notRated: false };
    var resolvedSrc = scoreSource || (grade.notRated ? 'not_rated' : (grade.source === 'gemini' ? 'auto_gemini' : 'auto_offline'));
    return {
      scoreSource: resolvedSrc,
      notRated: Boolean(grade.notRated && resolvedSrc !== 'manual'),
      gradeModel: grade.model || '',
      autoGradeSummary: grade.summaryVi || '',
      criteriaFeedback: Object.assign({}, grade.criteriaFeedback || {}),
      vocabUpgrades: (grade.vocabUpgrades || []).slice(0, 5),
      grammarFixes: (grade.grammarFixes || []).slice(0, 4)
    };
  }

  function buildStudioGradePayload(lesson) {
    var ctx = getActivePromptContext(lesson);
    return {
      kind: 'studio',
      lesson: lesson,
      questionText: ctx ? ctx.promptText : '',
      transcript: studioState.recTranscript || '',
      durationSec: studioState.recordingSec || 30,
      audioId: studioState.recAudioId || null
    };
  }

  function autoTranscribeRecordingIfEmpty(res, applyFn, opts) {
    if (!res || res._transcribeDone) return Promise.resolve((res && res.transcript) || '');
    if (res._transcribePromise) return res._transcribePromise;
    var existing = String(res.transcript || '').trim();
    if (existing) {
      res._transcribeDone = true;
      return Promise.resolve(existing);
    }
    var apiKey = getStoredGeminiKey();
    if (!res.blob || !apiKey) {
      res._transcribeDone = true;
      return Promise.resolve('');
    }
    var o = opts || {};
    if (o.onStart) o.onStart();
    res._transcribePromise = PzAiExaminer.transcribeAudioWithGemini(res.blob, {
      apiKey: apiKey,
      model: prefs.pzGeminiModel,
      contextHint: o.contextHint || ''
    }).then(function (tr) {
      res._transcribeDone = true;
      var txt = (tr && tr.ok && tr.transcript) ? tr.transcript : '';
      if (txt) res.transcript = txt;
      if (applyFn) applyFn(txt, res);
      return txt;
    });
    return res._transcribePromise;
  }

  global._spSaveQuickGeminiKey = function (val) {
    setStoredGeminiKey(val);
    var lobbyInp = document.getElementById('pzGeminiKeyInput');
    if (lobbyInp && lobbyInp.value !== val) lobbyInp.value = String(val || '').trim();
  };

  function renderModeReview(lesson) {
    var box = document.getElementById('reviewStudioBox');
    if (!box) return;

    var curKey = (lesson ? lesson.id : '') + '|' + (studioState.recTranscript || '') + '|' + (studioState.recordingSec || 0);
    if (!studioState.autoGrade || studioState.lastGradedKey !== curKey) {
      var offGrade = SpeakingGrader.evaluateOffline(buildStudioGradePayload(lesson));
      studioState.autoGrade = offGrade;
      studioState.lastGradedKey = curKey;
      if (studioState.scoreSource !== 'manual' && studioState.scoreSource !== 'auto_gemini') {
        studioState.scores = Object.assign({}, offGrade.scores);
        studioState.scoreSource = offGrade.notRated ? 'not_rated' : 'auto_offline';
      }
      if (!studioState.aiFeedback || studioState.aiFeedbackAuto) {
        studioState.aiFeedback = SpeakingGrader.formatFeedbackText(offGrade);
        studioState.aiFeedbackAuto = true;
      }
    }

    var targets = collectTargetLexis(lesson);
    var metrics = analyzeTranscriptMetrics(studioState.recTranscript, studioState.recordingSec || 30, targets);
    var overall = computeAverageBand(studioState.scores);
    var overallIsUnrated = isScoreUnrated(overall);
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

    var overallLbl = studioState.scoreSource === 'manual' ? 'Band tự chấm' : 'Band dự kiến';

    box.innerHTML = ''
      + '<div class="sp-metrics-grid">'
      + '  <div class="sp-metric-tile"><span class="sp-metric-lbl">Từ đã nói</span><span class="sp-metric-val">' + metrics.wordCount + '</span></div>'
      + '  <div class="sp-metric-tile"><span class="sp-metric-lbl">Tốc độ (WPM)</span><span class="sp-metric-val">' + metrics.wpm + '</span></div>'
      + '  <div class="sp-metric-tile"><span class="sp-metric-lbl">Target Lexis</span><span class="sp-metric-val">' + metrics.usedTargets.length + '/' + metrics.targetTotal + '</span></div>'
      + '  <div class="sp-metric-tile"><span class="sp-metric-lbl">' + overallLbl + '</span><span class="sp-metric-val" style="color:' + (overallIsUnrated ? 'var(--sp-accent-rose,#f43f5e);font-size:clamp(16px,2.3vw,20px)' : 'var(--hl-green)') + ';">' + formatBandValue(overall) + '</span></div>'
      + '</div>'
      + renderAutoGradePanelHtml({
        panelId: 'studioAutoGradePanel',
        grade: studioState.autoGrade,
        busy: studioState.gradingBusy,
        hasAudio: Boolean(studioState.recAudioId),
        scoreSource: studioState.scoreSource,
        onRunAiFn: '_spRunStudioAiGrade',
        onRegradeOfflineFn: '_spRunStudioOfflineGrade'
      })
      + '<div class="sp-tip-callout">⚡ <b>Nhận xét tốc độ & mạch nói:</b> ' + escHtml(metrics.wpmDiagnosis) + ' • Từ nối phát hiện: <b>' + metrics.connectorsUsed.length + '</b> • Từ ngập ngừng (fillers): <b>' + metrics.fillerCount + '</b>.<div style="margin-top:6px;">🎯 <b>Cụm từ đắt giá đã dùng:</b> ' + targetHitBadges + '</div></div>'
      + '<div class="sp-rubric-grid">'
      + criteriaDefs.map(function (c) {
        return '<div class="sp-criteria-card">'
          + '  <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;"><strong>' + c.name + '</strong><span class="sp-lobby-chip is-exam">' + formatBandValue(studioState.scores[c.key]) + '</span></div>'
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
      + '  <textarea id="studioAiFeedbackInput" class="sp-notepad-textarea" rows="3" placeholder="Nhận xét tự động hoặc dán điểm từ ChatGPT/Claude tại đây..." oninput="window._spUpdateStudioFeedback(this.value)">' + escHtml(studioState.aiFeedback) + '</textarea>'
      + '  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">'
      + '    <button type="button" class="btn mini-btn" onclick="window.switchSpeakingMode(\'record\')">← Quay lại sửa/ghi âm lại</button>'
      + '    <button type="button" class="btn btn-primary" onclick="window._spSaveStudioSubmission()">💾 Lưu Bài nói & Kết quả vào Lịch sử</button>'
      + '  </div>'
      + '</div>';
  }

  global._spSetStudioCriterion = function (key, val) {
    studioState.scoreSource = 'manual';
    applyManualBandScore(studioState.scores, key, val);
    renderModeReview(activeLesson);
  };

  global._spUpdateStudioFeedback = function (val) {
    studioState.aiFeedbackAuto = false;
    studioState.aiFeedback = val;
  };

  global._spRunStudioOfflineGrade = function () {
    if (!activeLesson) return;
    var offGrade = SpeakingGrader.evaluateOffline(buildStudioGradePayload(activeLesson));
    studioState.autoGrade = offGrade;
    studioState.scores = Object.assign({}, offGrade.scores);
    studioState.scoreSource = offGrade.notRated ? 'not_rated' : 'auto_offline';
    if (!studioState.aiFeedback || studioState.aiFeedbackAuto) {
      studioState.aiFeedback = SpeakingGrader.formatFeedbackText(offGrade);
      studioState.aiFeedbackAuto = true;
    }
    renderModeReview(activeLesson);
    showToast(offGrade.notRated ? 'Chưa có lời nói để chấm — hãy ghi âm hoặc nhập transcript.' : ('Đã chấm lại theo bộ tiêu chí Offline (Band ' + offGrade.overallBand.toFixed(1) + ').'), offGrade.notRated ? 'warn' : 'info');
  };

  global._spRunStudioAiGrade = function () {
    if (!activeLesson || studioState.gradingBusy) return;
    var apiKey = getStoredGeminiKey();
    if (!apiKey) {
      showToast('Hãy dán Gemini API Key cá nhân (Free Tier) vào ô trên để chấm bằng gemini-4-hydrogen.', 'warn', 4200);
      return;
    }
    var targetLessonId = activeLesson.id;
    studioState.gradingBusy = true;
    renderModeReview(activeLesson);

    var preTranscribe = (!String(studioState.recTranscript || '').trim() && studioState.recAudioId)
      ? AudioVault.getBlob(studioState.recAudioId).then(function (blob) {
        if (!blob) return '';
        var ctx = getActivePromptContext(activeLesson);
        return PzAiExaminer.transcribeAudioWithGemini(blob, {
          apiKey: apiKey,
          model: prefs.pzGeminiModel,
          contextHint: ctx ? ctx.promptText : ''
        }).then(function (tr) {
          if (tr && tr.ok && tr.transcript && activeLesson && activeLesson.id === targetLessonId) {
            studioState.recTranscript = tr.transcript;
            studioState.recWpm = computeWpm(tr.transcript, studioState.recordingSec || 30);
          }
          return tr ? tr.transcript : '';
        });
      })
      : Promise.resolve(studioState.recTranscript);

    preTranscribe.then(function () {
      if (!activeLesson || activeLesson.id !== targetLessonId) return null;
      return SpeakingGrader.evaluateWithGemini(buildStudioGradePayload(activeLesson), {
        apiKey: apiKey,
        model: prefs.pzGeminiModel
      });
    }).then(function (res) {
      studioState.gradingBusy = false;
      if (!res || !activeLesson || activeLesson.id !== targetLessonId) return;
      studioState.autoGrade = res;
      if (studioState.scoreSource !== 'manual') {
        studioState.scores = Object.assign({}, res.scores);
        studioState.scoreSource = res.notRated ? 'not_rated' : (res.source === 'gemini' ? 'auto_gemini' : 'auto_offline');
      }
      if (!studioState.aiFeedback || studioState.aiFeedbackAuto) {
        studioState.aiFeedback = SpeakingGrader.formatFeedbackText(res);
        studioState.aiFeedbackAuto = true;
      }
      renderModeReview(activeLesson);
      if (res.source === 'gemini') {
        showToast('AI Examiner (gemini-4-hydrogen) đã chấm xong — Overall Band ' + res.overallBand.toFixed(1) + '!', 'success');
      } else {
        showToast('Chưa chấm được qua Gemini' + (res.fallbackReason ? (' (' + res.fallbackReason + ')') : '') + ' — đã dùng kết quả Offline dự phòng.', 'warn', 4500);
      }
    });
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
    var overall = computeAverageBand(studioState.scores);
    var ctx = getActivePromptContext(activeLesson);
    var gradeMeta = buildCompactGradeMeta(studioState.autoGrade, studioState.scoreSource);

    var record = Object.assign({
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
    }, gradeMeta);

    saveSubmissionRecord(record);
    if (!isLessonDone(activeLesson.id)) {
      markLessonDone(activeLesson.id, true);
      renderSidebar();
    }
    showToast(isScoreUnrated(overall) ? 'Đã lưu bài ghi chép (Chưa chấm Band) vào Lịch sử!' : ('Đã lưu kết quả Studio (Band ' + overall.toFixed(1) + ') vào Lịch sử!'), 'success');
  };

  // =========================================================================
  // 9B. ĐỘNG CƠ HỘI THOẠI 2 PHÍA CỤC BỘ (TIER 1 — OFFLINE NLU EXAMINER)
  // =========================================================================
  var PzDialogueEngine = (function () {
    var NAME_STOP_WORDS = {
      my: 1, name: 1, full: 1, is: 1, am: 1, im: 1, i: 1, you: 1, can: 1, call: 1,
      me: 1, please: 1, good: 1, morning: 1, afternoon: 1, evening: 1, day: 1,
      hello: 1, hi: 1, hey: 1, fine: 1, thank: 1, thanks: 1, yes: 1, yeah: 1, sure: 1,
      here: 1, id: 1, card: 1, passport: 1, today: 1, examiner: 1, sir: 1, madam: 1,
      ok: 1, okay: 1, ready: 1, check: 1, document: 1, identification: 1, uh: 1, um: 1
    };

    var ANSWER_THEMES = [
      {
        id: 'cost_money',
        label: 'the financial side',
        rx: /\b(cost\w*|pric\w+|expensive|cheap\w*|afford\w*|budget\w*|money|salar\w+|income\w*|pay\w*|earn\w*|fee\w*|saving\w*)\b/i
      },
      {
        id: 'time_routine',
        label: 'time and daily routines',
        rx: /\b(bus(?:y|ier|iest)|time|schedule\w*|hectic|deadline\w*|rush\w*|hours?|weekends?|free time|daily|every day|routine\w*)\b/i
      },
      {
        id: 'family_friends',
        label: 'family and personal relationships',
        rx: /\b(famil\w+|parents?|mother|father|mom|dad|sister\w*|brother\w*|friend\w*|relatives?|children|kids?|colleagues?)\b/i
      },
      {
        id: 'tech_digital',
        label: 'modern technology',
        rx: /\b(internet|online|phones?|smartphones?|apps?|social media|technolog\w+|tech|digital|computers?|laptops?|screens?)\b/i
      },
      {
        id: 'health_wellbeing',
        label: 'health and wellbeing',
        rx: /\b(health\w*|unhealthy|exercise\w*|sports?|stress\w*|relax\w*|sleep\w*|mental|fit|fitness)\b/i
      },
      {
        id: 'work_study',
        label: 'work and study',
        rx: /\b(jobs?|work\w*|careers?|stud(?:y|ies|ying|ied)|students?|schools?|universit\w+|colleges?|major\w*|exams?|offices?)\b/i
      },
      {
        id: 'culture_place',
        label: 'local culture and places',
        rx: /\b(cultur\w+|tradition\w*|travel\w*|countr(?:y|ies)|cit(?:y|ies)|hometown\w*|local\w*|foreign\w*|visit\w*|weather|climate)\b/i
      },
      {
        id: 'past_change',
        label: 'how things have changed over time',
        rx: /\b(used to|childhood|in the past|years ago|nowadays|chang(?:e|ed|es|ing)|modern|younger)\b/i
      },
      {
        id: 'future_plan',
        label: 'future plans',
        rx: /\b(future|plans?|planning|hope\w*|dream\w*|would like to|next year|someday|career goal)\b/i
      },
      {
        id: 'environment',
        label: 'environmental impact',
        rx: /\b(environment\w*|pollut\w+|nature|natural|green|plastic|public transport|traffic)\b/i
      }
    ];

    var REASON_RX = /\b(because|since|as\s+(?:a|the|it|they|this|that)|due\s+to|owing\s+to|the\s+reason\s+is|that'?s\s+why|so\s+that|in\s+order\s+to|helps?\s+(?:me|us|people))\b/i;
    var EXAMPLE_RX = /\b(for\s+example|for\s+instance|such\s+as|like\s+when|take\s+.+\s+as\s+an?\s+example)\b/i;
    var CONTRAST_RX = /\b(however|although|even\s+though|though|on\s+the\s+other\s+hand|it\s+depends|whereas|while|compared\s+to)\b/i;

    function normText(txt) {
      return String(txt || '').replace(/\s+/g, ' ').trim();
    }

    function wordsOf(txt) {
      var clean = normText(txt);
      return clean ? clean.split(' ').filter(Boolean) : [];
    }

    /**
     * Trích xuất tên gọi thân thiện của thí sinh từ câu trả lời Warm-up (ví dụ "My name is Minh Anh" -> "Minh Anh").
     */
    function extractCandidateName(transcript) {
      var text = normText(transcript);
      if (!text) return '';

      var candidateRaw = '';
      var patterns = [
        /(?:you\s+can\s+)?call\s+me\s+([a-zA-ZÀ-ỹ' -]{2,32})/i,
        /my\s+(?:full\s+|first\s+|given\s+)?name(?:'s|\s+is)\s+([a-zA-ZÀ-ỹ' -]{2,36})/i,
        /(?:^|[,.!?]\s*)(?:i\s+am|i'm)\s+([a-zA-ZÀ-ỹ' -]{2,30})/i
      ];
      for (var i = 0; i < patterns.length; i++) {
        var m = patterns[i].exec(text);
        if (m && m[1]) {
          candidateRaw = m[1].split(/[,.!?;]|and\s+here|here\s+is|this\s+is/i)[0].trim();
          break;
        }
      }
      if (!candidateRaw && wordsOf(text).length <= 4) {
        candidateRaw = text.replace(/[.!?,]+/g, ' ').trim();
      }
      if (!candidateRaw) return '';

      var tokens = candidateRaw
        .replace(/[^a-zA-ZÀ-ỹ'\s-]/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(function (w) {
          var low = w.toLowerCase().replace(/^'+|'+$/g, '');
          return low && low.length >= 2 && !NAME_STOP_WORDS[low];
        });

      if (!tokens.length || tokens.length > 3) return '';
      var picked = tokens.length > 2 ? tokens.slice(-2) : tokens;
      return picked.map(function (w) {
        return w.charAt(0).toUpperCase() + w.slice(1);
      }).join(' ');
    }

    function detectAnswerThemes(transcript) {
      var text = normText(transcript);
      if (!text) return [];
      var found = [];
      for (var i = 0; i < ANSWER_THEMES.length; i++) {
        if (ANSWER_THEMES[i].rx.test(text)) {
          found.push(ANSWER_THEMES[i]);
          if (found.length >= 2) break;
        }
      }
      return found;
    }

    /**
     * Nhận diện ý định giao tiếp của thí sinh (xin nhắc lại, diễn đạt lại, chưa nghĩ ra, hay trả lời nội dung).
     */
    function detectCandidateIntent(transcript) {
      var text = normText(transcript);
      var wCount = wordsOf(text).length;
      if (!wCount) return 'empty';

      var explicitRepeat = /\b(could you repeat|can you repeat|please repeat|repeat (?:that|the question)|say (?:that|it) again|didn'?t (?:catch|hear)|missed (?:that|the question)|one more time|come again)\b/i;
      var shortExcuse = /^(?:sorry|pardon|excuse me|what|huh)[.?!,\s]*$/i;
      if ((explicitRepeat.test(text) && wCount <= 16) || shortExcuse.test(text)) {
        return 'repeat';
      }

      var explicitRephrase = /\b(rephrase|paraphrase|put (?:that|it) another way|in simpler words|what do you mean|what does (?:that|it|\w+) mean|explain (?:that|the question|what you mean)|don'?t (?:really )?understand(?: the question| what you mean)?)\b/i;
      if (explicitRephrase.test(text) && wCount <= 18) {
        return 'rephrase';
      }

      var dontKnowRx = /\b(i don'?t know|i have no idea|no idea|not sure|never (?:really )?thought about|hard to say|can'?t think of)\b/i;
      if (dontKnowRx.test(text) && wCount <= 18 && !REASON_RX.test(text)) {
        return 'dont_know';
      }

      return 'answer';
    }

    function detectStance(text) {
      if (/\b(it depends|both|on the one hand|mixed feelings?)\b/i.test(text)) return 'balanced';
      if (/^(?:no|nope|not really|never|rarely|hardly|i don'?t|i dislike|i hate|not at all)\b/i.test(text)) return 'negative';
      if (/^(?:yes|yeah|yep|definitely|absolutely|of course|sure|certainly|i love|i really like|i enjoy|totally)\b/i.test(text)) return 'positive';
      return 'neutral';
    }

    function analyzeTurn(transcript, ctx) {
      var text = normText(transcript);
      var wCount = wordsOf(text).length;
      var phase = (ctx && ctx.phase) || 'part1';
      var intent = detectCandidateIntent(text);
      var hasReason = REASON_RX.test(text);
      var hasExample = EXAMPLE_RX.test(text);
      var hasContrast = CONTRAST_RX.test(text);
      var stance = detectStance(text);
      var isBareYesNo = /^(?:yes|yeah|yep|no|nope|not really|maybe|sometimes|of course|definitely)(?:\s*[,.!]?\s*(?:i\s+(?:do|don'?t|am|not|like|don'?t like|think so)))?[.!?]*$/i.test(text)
        || ((stance === 'positive' || stance === 'negative') && wCount <= 9 && !hasReason);
      var isTooShort = phase === 'part3' ? (wCount > 0 && wCount < 18) : (wCount > 0 && wCount < 11);

      return {
        text: text,
        wordCount: wCount,
        intent: intent,
        hasReason: hasReason,
        hasExample: hasExample,
        hasContrast: hasContrast,
        stance: stance,
        isBareYesNo: isBareYesNo,
        isTooShort: isTooShort,
        themes: detectAnswerThemes(text)
      };
    }

    var STYLE_CYCLE_KEY = 'lp_sp_pz_style_cycle';
    var CONCRETE_STYLE_ORDER = ['friendly', 'probing', 'strict_bc', 'casual_coach'];
    var STYLE_PROFILES = {
      friendly: {
        id: 'friendly',
        labelVi: '😊 Thân thiện & Khích lệ',
        shortTag: '😊 Thân thiện',
        temperature: 0.70,
        promptBrief: 'Warm, approachable, empathetic IELTS examiner. Acknowledge personal anecdotes genuinely, use encouraging natural language, and ask gentle personal follow-ups.'
      },
      strict_bc: {
        id: 'strict_bc',
        labelVi: '🎓 Chuẩn Hội đồng Thi (BC/IDP)',
        shortTag: '🎓 Chuẩn BC/IDP',
        temperature: 0.42,
        promptBrief: 'Formal British Council / IDP examiner. Stay polite, brisk, neutral, and composed. Keep examinerReaction brief (4-12 words) with minimal emotion or chatter, and stay strictly focused on assessment.'
      },
      probing: {
        id: 'probing',
        labelVi: '🧠 Hỏi xoáy & Phản biện Sâu',
        shortTag: '🧠 Hỏi xoáy 7.5+',
        temperature: 0.72,
        promptBrief: 'Analytical Band 7.5+ IELTS examiner. Challenge brief or one-sided viewpoints respectfully, ask incisive follow-ups (counter-examples, different generations, trade-offs, hypothetical "what if"), especially in Part 3.'
      },
      casual_coach: {
        id: 'casual_coach',
        labelVi: '💬 Tự nhiên Đời thường',
        shortTag: '💬 Tự nhiên',
        temperature: 0.78,
        promptBrief: 'Relaxed, conversational human interlocutor. Vary sentence openings organically, react directly to a vivid detail the candidate said, avoid textbook phrasing, and transition smoothly.'
      }
    };

    var PHASE_SCRIPT_POOLS = {
      warmup_id: {
        friendly: [
          'Good morning! Welcome to the Speaking test. My name is {name}. Could you tell me your full name and show me your ID, please?',
          'Hello there, nice to see you today. I am {name}, your examiner. May I have your full name and check your identification please?',
          'Hi and welcome! My name is {name}. Before we begin, could you tell me your full name and show your ID card or passport?'
        ],
        strict_bc: [
          'Good day. My name is {name}. Could you tell me your full name please, and may I see your identification?',
          'Good morning. My name is {name}. For the recording, could you state your full name and hold up your identification document, please?',
          'Hello. I am {name}, your IELTS Speaking examiner today. Please state your full name and show your ID.'
        ],
        probing: [
          'Good day, welcome in. I am {name}. Let us get started right away — could you tell me your full name and show your identification, please?',
          'Hello, my name is {name}. First, please tell me your full name clearly and let me check your ID document.'
        ],
        casual_coach: [
          'Hi! I am {name}, and I will be speaking with you today. First off, what is your full name, and could I see your ID quickly?',
          'Hello there! My name is {name}. Just to check us in — could you give me your full name and show your ID, please?'
        ]
      },
      warmup_beat2: {
        friendly: [
          'Where is your hometown, and are you working or studying at the moment?',
          'How are you feeling today? Also, could you tell me where you are from and whether you work or study?',
          'Where did you come from today, and what are you currently doing — work or study?'
        ],
        strict_bc: [
          'Where are you from, and do you currently work or study?',
          'Could you tell me where you live at the moment, and whether you are working or studying?',
          'Where is your home area, and are you a student or in full-time work?'
        ],
        probing: [
          'Tell me briefly where you are based and what keeps you busy right now — work or study?',
          'Where did you grow up, and what field are you working or studying in these days?'
        ],
        casual_coach: [
          'So, where abouts do you live, and what does a typical weekday look like for you — work or study?',
          'How is your day going so far? And tell me briefly, where are you from and do you work or study?'
        ]
      },
      part1_intro_topic: {
        friendly: [
          'Lovely, let us begin Part 1 by chatting a little about {topic}.',
          'Great — in this first part of the test, I would like to ask you a few relaxed questions about {topic}.'
        ],
        strict_bc: [
          'Now, in this first part, I would like to ask you some questions about {topic}.',
          'Let us move into Part 1. First, let us talk about {topic}.'
        ],
        probing: [
          'Alright, let us get straight into Part 1 and explore your thoughts on {topic}.',
          'Now for Part 1, I want to start by asking you specifically about {topic}.'
        ],
        casual_coach: [
          'Cool — let us kick off Part 1 with an everyday topic: {topic}.',
          'So, jumping into Part 1, let us have a quick chat about {topic}.'
        ]
      },
      part1_intro_generic: {
        friendly: [
          'Alright, let us start Part 1 with a couple of everyday topics about your life.',
          'Now in this first part, let us chat about some familiar everyday subjects.'
        ],
        strict_bc: [
          'Now, in this first part, I would like to ask you some general questions about yourself and everyday topics.',
          'Let us begin Part 1. I am going to ask you a few questions on everyday themes.'
        ],
        probing: [
          'Let us begin Part 1 now with a few everyday questions to hear your perspective.',
          'Now, in Part 1, I will ask you about some familiar routines and preferences.'
        ],
        casual_coach: [
          'Alright, let us get rolling with Part 1 and talk through a few everyday things.',
          'Great, let us dive into Part 1 with a couple of everyday topics.'
        ]
      },
      part1_transition: {
        friendly: [
          'Thank you — now let us switch gears a little and talk about {topic}.',
          'Great, I would love to ask you about one more topic now: {topic}.'
        ],
        strict_bc: [
          'Thank you. Let us move on now to talk about {topic}.',
          'Alright. Next, I would like to ask you a few questions about {topic}.'
        ],
        probing: [
          'Okay, shifting focus for the rest of Part 1 — let us discuss {topic}.',
          'Right, moving on from that — let us look at {topic}.'
        ],
        casual_coach: [
          'Nice — switching topics slightly, let us chat about {topic}.',
          'Alright, moving right along, how about we talk about {topic}?'
        ]
      },
      part2_intro: {
        friendly: [
          'Now I am going to give you a topic card and ask you to speak for one to two minutes. You have one full minute to make notes first — take your time.',
          'Wonderful, we are ready for Part 2. Here is your cue card. Have a look, use your one minute to jot down key ideas, and talk for up to two minutes.'
        ],
        strict_bc: [
          'Now I am going to give you a topic and I would like you to talk about it for one to two minutes. Before you talk, you will have one minute to think about what you are going to say. Here is your cue card.',
          'Now we move on to Part 2. You have one minute to prepare notes on this topic, and then speak for one to two minutes. Here is your task.'
        ],
        probing: [
          'Alright, let us move to the Part 2 long turn. Look closely at every point on this card — you have sixty seconds to structure a clear story before speaking for up to two minutes.',
          'Now for Part 2. Take one minute to organize your main examples and details; then you will talk for one to two minutes.'
        ],
        casual_coach: [
          'Awesome, here comes Part 2. You have got a minute to sketch a few quick keywords on your cue card, and then talk me through it for up to two minutes.',
          'Alright, next up is your cue card. Take sixty seconds to gather your thoughts, and then feel free to talk naturally for one to two minutes.'
        ]
      },
      part2_prep_end: {
        friendly: [
          'Okay, your preparation time is up. Remember you have one to two minutes — please start speaking whenever you are ready.',
          'All right, that is one minute. Whenever you are ready, please go ahead and speak for one to two minutes.'
        ],
        strict_bc: [
          'All right? Remember you have one to two minutes for this, so do not worry if I stop you. Can you start speaking now, please?',
          'Your one minute is up. Please begin speaking now.'
        ],
        probing: [
          'Time is up for preparation. Aim to develop your points with clear detail for up to two minutes — please start now.',
          'Okay, sixty seconds are up. Go ahead and present your answer clearly now.'
        ],
        casual_coach: [
          'Alright, time is up! Tell me all about it — go ahead whenever you are ready.',
          'Okay, your minute is up. Jump right in and take up to two minutes.'
        ]
      },
      part2_stop: {
        friendly: [
          'Thank you very much — I will stop you there. You shared plenty of helpful detail.',
          'Thank you, that is two minutes, so I will pause you right there.'
        ],
        strict_bc: [
          'Thank you very much. I will stop you there.',
          'Thank you. Two minutes is up — I will stop you there.'
        ],
        probing: [
          'Thank you, I will stop you at two minutes right there.',
          'Okay, thank you very much — our time for Part 2 is up.'
        ],
        casual_coach: [
          'Alright, great — let me stop you there because two minutes just flew by!',
          'Thank you very much, I will step in and stop you there.'
        ]
      },
      part3_intro_topic: {
        friendly: [
          'We have been talking about {topic}, and now I would like to explore some broader questions related to it.',
          'Thanks for that story about {topic}. In Part 3, let us discuss some wider ideas around the same theme.'
        ],
        strict_bc: [
          'We have been talking about {topic}, and now I would like to discuss with you some more general questions related to this.',
          'In Part 3, let us examine some wider social questions connected to {topic}.'
        ],
        probing: [
          'Moving into Part 3 now — let us step back from personal examples about {topic} and analyze the bigger picture.',
          'Now let us push deeper in Part 3 and debate some broader questions linked to {topic}.'
        ],
        casual_coach: [
          'That wraps up Part 2 on {topic}. Now let us zoom out a bit for Part 3 and trade views on the wider topic.',
          'Nice transition into Part 3 — building on {topic}, let us talk more broadly about how people in society see this.'
        ]
      },
      part3_intro_generic: {
        friendly: [
          'Now in Part 3, let us talk together about some broader, more abstract questions connected to that theme.',
          'Let us move into Part 3 and look at a few bigger-picture questions around this topic.'
        ],
        strict_bc: [
          'We have been talking about that topic, and now I would like to discuss with you one or two more general questions related to it.',
          'Now let us move on to Part 3 for some broader discussion questions.'
        ],
        probing: [
          'Let us step into Part 3 now — I am looking for clear analysis and wider examples on these discussion questions.',
          'Moving to Part 3: let us examine the broader social and future angles behind this topic.'
        ],
        casual_coach: [
          'Alright, onto Part 3! Let us zoom out and look at the bigger picture behind what you just described.',
          'Now for Part 3 — let us unpack some wider ideas together.'
        ]
      },
      exam_closing: {
        friendly: [
          'Thank you very much — you handled that smoothly. That is the end of the Speaking test.',
          'Wonderful, thank you for your time today. That concludes our Speaking mock test!'
        ],
        strict_bc: [
          'Thank you very much. That is the end of the Speaking test.',
          'Thank you. We have reached the end of the IELTS Speaking test.'
        ],
        probing: [
          'Thank you for sharing those arguments today. That marks the end of your Speaking test.',
          'Thank you very much — that is the end of the Speaking examination.'
        ],
        casual_coach: [
          'Awesome job wrapping that up! Thank you very much — that brings us to the end of the Speaking test.',
          'Thanks a lot for chatting with me today. That completes your Speaking test!'
        ]
      },
      rephrase_lead: {
        friendly: ['Of course — let me put that another way for you.', 'No problem at all, here is an easier way to think about it.'],
        strict_bc: ['Of course, let me rephrase the question.', 'Certainly. Let me put that another way.'],
        probing: ['Sure — let me frame that question slightly differently.', 'Allow me to clarify what I am asking there.'],
        casual_coach: ['Sure thing — let me say that in simpler words.', 'No worries, basically what I am asking is this.']
      },
      repeat_lead: {
        friendly: ['Of course, let me repeat that for you.', 'Certainly, here is the question again.'],
        strict_bc: ['Sure, let me repeat the question.', 'Yes, I will repeat that once more.'],
        probing: ['Certainly — listen carefully to the question again.', 'Of course, let me state that question again.'],
        casual_coach: ['Sure thing, here it is one more time.', 'No problem, let me say that again.']
      }
    };

    function normalizeStyle(styleKey) {
      var s = String(styleKey || '').trim();
      if (s === 'adaptive' || STYLE_PROFILES[s]) return s;
      return 'adaptive';
    }

    function resolveSessionStyle(styleKey, seedNum, opts) {
      var o = opts || {};
      var key = normalizeStyle(styleKey);
      if (STYLE_PROFILES[key]) return key;
      if (o.advanceCycle && typeof localStorage !== 'undefined') {
        try {
          var rawIdx = parseInt(localStorage.getItem(STYLE_CYCLE_KEY) || '0', 10);
          var idx = isNaN(rawIdx) ? 0 : Math.abs(rawIdx);
          localStorage.setItem(STYLE_CYCLE_KEY, String((idx + 1) % CONCRETE_STYLE_ORDER.length));
          return CONCRETE_STYLE_ORDER[idx % CONCRETE_STYLE_ORDER.length];
        } catch (e) {}
      }
      if (typeof seedNum === 'number' && seedNum > 0) {
        return CONCRETE_STYLE_ORDER[Math.abs(seedNum) % CONCRETE_STYLE_ORDER.length];
      }
      return 'friendly';
    }

    function getStyleProfile(styleKey, seedNum, opts) {
      var concreteId = resolveSessionStyle(styleKey, seedNum, opts);
      return STYLE_PROFILES[concreteId] || STYLE_PROFILES.friendly;
    }

    function pickFreshVariant(list, usedTemplates, seedNum) {
      if (!list || !list.length) return '';
      var used = Array.isArray(usedTemplates) ? usedTemplates : null;
      var avail = used
        ? list.filter(function (item) { return used.indexOf(item) === -1; })
        : list;
      if (!avail.length) avail = list;
      var pick = avail[Math.abs(seedNum || 0) % avail.length];
      if (used && pick) {
        used.push(pick);
        if (used.length > 48) used.splice(0, used.length - 48);
      }
      return pick;
    }

    function cleanTopicLabel(topicTitle) {
      var raw = String(topicTitle || '')
        .replace(/^Part\s+\d+\s*[•·\-]\s*Topic\s+[AB]:\s*/i, '')
        .replace(/^Let'?s talk about\s*/i, '')
        .replace(/^Describe\s+(?:a|an|the)?\s*/i, '')
        .replace(/[.?!]+$/, '')
        .trim();
      if (!raw) return '';
      if (/\b(actual\s+test|ielts\s+speaking|cambridge|practice\s+zone|full\s+test|mock\s+test|part\s+1\s+interview|random\s+full\s+exam|sample\s+speaking\s+test|forecast)\b/i.test(raw)) {
        return '';
      }
      if (raw.split(/\s+/).length > 8) return '';
      return raw.charAt(0).toLowerCase() + raw.slice(1);
    }

    function getPhaseScript(kind, ctx) {
      var o = ctx || {};
      var styleId = resolveSessionStyle(o.style, o.seed);
      var used = o.usedTemplates || null;
      var seed = (o.seed || 0) + String(o.topicTitle || o.examinerName || '').length;
      var topic = cleanTopicLabel(o.topicTitle || '');
      var actualKind = kind;
      if (kind === 'part1_intro') actualKind = topic ? 'part1_intro_topic' : 'part1_intro_generic';
      if (kind === 'part3_intro') actualKind = topic ? 'part3_intro_topic' : 'part3_intro_generic';

      var byKind = PHASE_SCRIPT_POOLS[actualKind] || {};
      var pool = byKind[styleId] || byKind.friendly || [];
      var chosen = pickFreshVariant(pool, used, seed);
      if (!chosen) return o.fallback || '';

      var exName = String(o.examinerName || 'Eleanor').replace(/^Examiner\s+/i, '').trim() || 'Eleanor';
      return chosen
        .replace(/\{name\}/g, exName)
        .replace(/\{topic\}/g, topic || 'everyday topics');
    }

    function buildFollowUpProbe(qText, analysis, phase, seedNum, styleKey, usedTemplates) {
      var qLower = String(qText || '').toLowerCase();
      var isP3 = phase === 'part3';
      var styleId = resolveSessionStyle(styleKey, seedNum);

      if (analysis.stance === 'balanced') {
        var balPool = styleId === 'probing'
          ? (isP3
            ? ['You say it depends — what decisive factor tips the balance for most people?', 'On balance, which side carries greater weight in modern society?']
            : ['You mentioned it depends — which situation happens more often for you personally?', 'What usually determines which way you lean on that?'])
          : (isP3
            ? ['You mentioned it depends — what main factor decides which way it goes?', 'Which factor tends to matter most in your view?']
            : ['You said it depends — what kind of situation makes you choose one over the other?', 'And which way do you tend to lean most days?']);
        return pickFreshVariant(balPool, usedTemplates, seedNum);
      }

      if (analysis.isBareYesNo && analysis.stance === 'negative') {
        var negPool = styleId === 'strict_bc'
          ? (isP3 ? ['Why do you feel that way?', 'What is the main reason behind that view?'] : ['Why not?', 'What makes you prefer not to?'])
          : styleId === 'probing'
            ? (isP3 ? ['Is there any circumstance where the opposite might actually be true?', 'What is the main drawback that puts people off, do you think?'] : ['Could anything make you change your mind about that?', 'What specifically puts you off about it?'])
            : (isP3 ? ['Why do you feel that way? What is the main reason?', 'What causes people to hold that negative view, in your opinion?'] : ['Oh, why not? What puts you off about that?', 'Have you always felt that way, or did something put you off?']);
        return pickFreshVariant(negPool, usedTemplates, seedNum);
      }

      if (analysis.isBareYesNo && analysis.stance === 'positive') {
        var posPool = styleId === 'strict_bc'
          ? (isP3 ? ['Why do you think so?', 'Could you explain your main reason?'] : ['Why do you enjoy that?', 'What do you like most about it?'])
          : styleId === 'probing'
            ? (isP3 ? ['What is the strongest argument for that, and is there any downside?', 'Does that positive impact apply to everyone equally, or only certain groups?'] : ['What is one specific thing about it that keeps you interested?', 'How would you explain why that appeals to you so much?'])
            : (isP3 ? ['What makes you feel so strongly about that?', 'Could you explain one key benefit behind that view?'] : ['Interesting — what makes you enjoy that most?', 'When did you first start enjoying that?']);
        return pickFreshVariant(posPool, usedTemplates, seedNum);
      }

      if (isP3 && analysis.hasReason && !analysis.hasExample) {
        return pickFreshVariant([
          'Could you give a specific example from your country or everyday life?',
          'Can you illustrate that point with a real-life example?',
          'How does that show up in practice where you live?'
        ], usedTemplates, seedNum);
      }

      if (/\bhow often|usually|regularly\b/.test(qLower)) {
        return pickFreshVariant([
          'And has that habit changed compared to a few years ago?',
          'Do you do that more on weekdays or at weekends, and why?',
          'What usually determines whether you keep up that routine?'
        ], usedTemplates, seedNum);
      }

      if (/\bprefer|better|favorite|favourite|kind of|type of\b/.test(qLower)) {
        return pickFreshVariant([
          'What is it about that option that appeals to you most?',
          'How does that compare with other choices people around you make?',
          'Was that always your preference, or did your taste change over time?'
        ], usedTemplates, seedNum);
      }

      if (isP3) {
        var p3Pool = styleId === 'probing'
          ? [
            'How might older generations or people in rural areas view that differently?',
            'Could there be any unintended negative consequences to that trend?',
            'What would need to change for people to behave differently in the future?',
            'Why is that issue more complex than it first appears?'
          ]
          : styleId === 'strict_bc'
            ? [
              'Why do many people feel that way nowadays?',
              'How does that affect different age groups, in your view?',
              'Could you explain why that happens in a bit more detail?'
            ]
            : [
              'Why do you think many people feel that way nowadays?',
              'How does that play out for younger versus older people in your country?',
              'Do you expect that trend to continue over the next decade?',
              'Could you back that idea up with a short example?'
            ];
        return pickFreshVariant(p3Pool, usedTemplates, seedNum);
      }

      var p1Pool = styleId === 'strict_bc'
        ? [
          'Could you tell me a little more about why?',
          'Can you give me a quick example of that?',
          'How important is that in your routine?'
        ]
        : styleId === 'probing'
          ? [
            'What specific detail makes the biggest difference to you there?',
            'Would you say that has changed much over the last few years?',
            'Why do you choose to do it that way instead of another approach?'
          ]
          : [
            'Could you tell me a little bit more about why?',
            'How does that fit into your typical day-to-day life?',
            'Can you give me a quick personal example of that?',
            'Has that always been the case for you?'
          ];
      return pickFreshVariant(p1Pool, usedTemplates, seedNum);
    }

    function buildContextualBridge(analysis, ctx) {
      var o = ctx || {};
      var seed = (o.stepIndex || 0) + analysis.wordCount + (o.sessionSeed || 0);
      var styleId = resolveSessionStyle(o.style, seed);
      var used = o.usedTemplates || null;
      var nameTail = o.candidateName && ((o.stepIndex || 0) % 3 === 1) ? (', ' + o.candidateName) : '';

      if (analysis.intent === 'empty') {
        return pickFreshVariant([
          'Right' + nameTail + ', let us continue.',
          'Okay' + nameTail + ', let us move on to the next question.'
        ], used, seed);
      }
      if (analysis.intent === 'dont_know') {
        return pickFreshVariant([
          'No problem at all' + nameTail + ' — let us try the next one.',
          'That is quite alright' + nameTail + ', let us move forward.'
        ], used, seed);
      }
      if (analysis.themes.length > 0) {
        var tLabel = analysis.themes[0].label;
        if (analysis.hasContrast) {
          return pickFreshVariant([
            'I see what you mean about balancing ' + tLabel + nameTail + '.',
            'Interesting contrast regarding ' + tLabel + nameTail + '.'
          ], used, seed);
        }
        var themePool = styleId === 'strict_bc'
          ? [
            'Thank you — noted regarding ' + tLabel + nameTail + '.',
            'I see, that clarifies your view on ' + tLabel + nameTail + '.',
            'Right, thank you for explaining the aspect of ' + tLabel + nameTail + '.'
          ]
          : styleId === 'probing'
            ? [
              'That is an interesting angle on ' + tLabel + nameTail + '.',
              'Fair point about ' + tLabel + ' — let us see how that connects next' + nameTail + '.',
              'Right, looking at ' + tLabel + ' brings up an important dimension' + nameTail + '.'
            ]
            : styleId === 'casual_coach'
              ? [
                'Totally makes sense thinking about ' + tLabel + nameTail + '.',
                'Oh nice, framing it around ' + tLabel + ' is really clear' + nameTail + '.',
                'Got it — ' + tLabel + ' clearly plays a big part there' + nameTail + '.'
              ]
              : [
                'That is a really clear point about ' + tLabel + nameTail + '.',
                'Right, so ' + tLabel + ' plays quite a role for you' + nameTail + '.',
                'I see — thinking about ' + tLabel + ' makes a lot of sense' + nameTail + '.'
              ];
        return pickFreshVariant(themePool, used, seed);
      }
      if (analysis.hasExample) {
        return pickFreshVariant([
          'That is a helpful example' + nameTail + '.',
          'Good real-life illustration' + nameTail + '.',
          'Right, that concrete example explains your view nicely' + nameTail + '.'
        ], used, seed);
      }
      if (analysis.hasContrast) {
        return pickFreshVariant([
          'Fair enough — looking at both sides makes sense' + nameTail + '.',
          'I appreciate seeing both angles there' + nameTail + '.',
          'That is a balanced way to look at it' + nameTail + '.'
        ], used, seed);
      }
      if (analysis.stance === 'positive') {
        return pickFreshVariant([
          'Okay, I see you are quite enthusiastic about that' + nameTail + '.',
          'Great, thank you for explaining why you enjoy that' + nameTail + '.',
          'Sounds like a genuinely positive experience for you' + nameTail + '.'
        ], used, seed);
      }
      if (analysis.stance === 'negative') {
        return pickFreshVariant([
          'Right, I understand why that does not appeal to you' + nameTail + '.',
          'Okay, fair point' + nameTail + '.',
          'Got it — I see why you avoid that' + nameTail + '.'
        ], used, seed);
      }

      var genericPool = styleId === 'strict_bc'
        ? ['Thank you' + nameTail + '.', 'I see, thank you' + nameTail + '.', 'Alright, moving on' + nameTail + '.']
        : styleId === 'probing'
          ? ['Interesting perspective' + nameTail + '.', 'Right, I follow your reasoning' + nameTail + '.', 'Okay, let us build on that thought' + nameTail + '.']
          : styleId === 'casual_coach'
            ? ['Nice, thanks for sharing that' + nameTail + '.', 'Got you — that makes sense' + nameTail + '.', 'Awesome, let us keep going' + nameTail + '.']
            : ['Thank you' + nameTail + ', that is interesting.', 'Right, I understand' + nameTail + '.', 'Okay, thank you for sharing that' + nameTail + '.'];
      return pickFreshVariant(genericPool, used, seed);
    }

    function buildRephraseFallback(qText, ctx) {
      if (global.SpeakingParser && typeof global.SpeakingParser.buildQuestionRephrase === 'function') {
        return global.SpeakingParser.buildQuestionRephrase(qText, ctx);
      }
      return qText ? ('In other words — ' + qText) : '';
    }

    /**
     * Quyết định bước phản hồi kế tiếp của Giám khảo theo phong cách đã chọn
     * mà vẫn bảo toàn 100% các câu hỏi gốc của đề.
     */
    function decideTurn(input) {
      var opts = input || {};
      var phase = opts.phase || 'part1';
      var stepIndex = opts.stepIndex || 0;
      var warmupStep = opts.warmupStep || 0;
      var candidateName = opts.candidateName || '';
      var meta = opts.meta || {};
      var slot = opts.slot || {};
      var activeFollowUpQ = opts.activeFollowUpQ || '';
      var usedTemplates = opts.usedTemplates || null;
      var sessionSeed = opts.sessionSeed || 0;
      var explicitStyle = opts.style || '';
      var resolvedStyle = explicitStyle ? resolveSessionStyle(explicitStyle, sessionSeed) : 'friendly';
      var transcript = normText(opts.transcript);
      var analysis = analyzeTurn(transcript, { phase: phase });

      // 1. Warm-up 2 nhịp tương tác: Hỏi tên + ID -> Chào bằng tên & mở câu Warm-up đa dạng theo phong cách
      if (phase === 'warmup') {
        if (analysis.intent === 'repeat' && warmupStep === 0) {
          var repeatId = meta.qText || 'Good day. Could you tell me your full name and show your ID, please?';
          var repLead = getPhaseScript('repeat_lead', { style: resolvedStyle, seed: sessionSeed, usedTemplates: usedTemplates }) || 'Of course, let me say that again.';
          return {
            action: 'repeat',
            intent: 'repeat',
            candidateName: candidateName,
            nextWarmupStep: 0,
            examinerReaction: repLead,
            spokenLines: [repLead, repeatId],
            followUpQuestion: '',
            rephraseText: '',
            preserveOriginalQ: true,
            analysis: analysis
          };
        }

        if (warmupStep === 0) {
          var detectedName = extractCandidateName(transcript) || candidateName;
          var greetPool = resolvedStyle === 'strict_bc'
            ? [detectedName ? ('Thank you, ' + detectedName + '.') : 'Thank you.', detectedName ? ('Very good, thank you ' + detectedName + '.') : 'Very good, thank you.']
            : resolvedStyle === 'casual_coach'
              ? [detectedName ? ('Great to meet you, ' + detectedName + '!') : 'Great to meet you!', detectedName ? ('Lovely — nice to chat with you, ' + detectedName + '.') : 'Lovely — nice to chat with you.']
              : [detectedName ? ('Thank you, ' + detectedName + '. Nice to meet you!') : 'Thank you. Nice to meet you!', detectedName ? ('Welcome to the room, ' + detectedName + '.') : 'Welcome to the room.'];
          var greeting = pickFreshVariant(greetPool, usedTemplates, sessionSeed + analysis.wordCount);
          var followGreeting = getPhaseScript('warmup_beat2', {
            style: resolvedStyle,
            seed: sessionSeed + detectedName.length,
            usedTemplates: usedTemplates
          }) || 'Where are you from, and do you currently work or study?';
          return {
            action: 'warmup_next',
            intent: analysis.intent,
            candidateName: detectedName,
            nextWarmupStep: 1,
            examinerReaction: greeting,
            followUpQuestion: followGreeting,
            spokenLines: [greeting, followGreeting],
            rephraseText: '',
            preserveOriginalQ: true,
            analysis: analysis
          };
        }

        var nameSuffix = candidateName ? (', ' + candidateName) : '';
        var ackWarmup = resolvedStyle === 'strict_bc'
          ? ('Thank you' + nameSuffix + '.')
          : ('Lovely, thank you' + nameSuffix + '.');
        if (/\b(work|working|job|company|office|engineer|teacher|developer|business|manager|freelanc\w+)\b/i.test(transcript)) {
          ackWarmup = pickFreshVariant([
            'Interesting career path' + nameSuffix + ' — good to hear.',
            'Sounds like a busy line of work' + nameSuffix + ', thank you.'
          ], usedTemplates, sessionSeed + 3);
        } else if (/\b(study|studying|student|university|college|school|major|graduat\w+)\b/i.test(transcript)) {
          ackWarmup = pickFreshVariant([
            'Great, wishing you the best with your studies' + nameSuffix + '.',
            'Sounds like an interesting major' + nameSuffix + ' — thank you.'
          ], usedTemplates, sessionSeed + 5);
        } else if (/\b(hanoi|saigon|ho chi minh|danang|city|town|province|countryside|village|hometown|feeling|great|fine|good)\b/i.test(transcript)) {
          ackWarmup = pickFreshVariant([
            'Nice to hear a bit about your background' + nameSuffix + '.',
            'Thank you for sharing that' + nameSuffix + ' — glad you are settled in.'
          ], usedTemplates, sessionSeed + 7);
        }
        return {
          action: 'advance',
          intent: analysis.intent,
          candidateName: candidateName,
          nextWarmupStep: 2,
          examinerReaction: ackWarmup,
          followUpQuestion: '',
          spokenLines: [ackWarmup],
          rephraseText: '',
          preserveOriginalQ: true,
          analysis: analysis
        };
      }

      // 2. Xử lý các yêu cầu giao tiếp trực tiếp của thí sinh (Repeat / Rephrase / Clarify)
      var qText = meta.qText || '';
      var rephraseText = meta.rephraseText || buildRephraseFallback(qText, { partTag: phase, topicTitle: opts.topicTitle || '' });

      if (analysis.intent === 'repeat') {
        var repeatLead = getPhaseScript('repeat_lead', {
          style: resolvedStyle,
          seed: sessionSeed + stepIndex,
          usedTemplates: usedTemplates
        }) || 'Sure, let me repeat that question for you.';
        return {
          action: 'repeat',
          intent: 'repeat',
          candidateName: candidateName,
          examinerReaction: repeatLead,
          spokenLines: [repeatLead, qText],
          followUpQuestion: '',
          rephraseText: rephraseText,
          preserveOriginalQ: true,
          analysis: analysis
        };
      }

      if (analysis.intent === 'rephrase' && rephraseText) {
        var repLead = getPhaseScript('rephrase_lead', {
          style: resolvedStyle,
          seed: sessionSeed + stepIndex,
          usedTemplates: usedTemplates
        }) || 'Of course, let me put that another way.';
        return {
          action: 'rephrase',
          intent: 'rephrase',
          candidateName: candidateName,
          examinerReaction: repLead,
          spokenLines: [repLead, rephraseText],
          followUpQuestion: '',
          rephraseText: rephraseText,
          preserveOriginalQ: true,
          analysis: analysis
        };
      }

      if (analysis.intent === 'dont_know' && !slot.nudgeUsed && !activeFollowUpQ) {
        var nudgeLine = 'Take your time — you can just share an example from everyday life. ' + (rephraseText || qText);
        return {
          action: 'clarify_nudge',
          intent: 'dont_know',
          candidateName: candidateName,
          examinerReaction: 'That is completely fine, take a second.',
          spokenLines: [nudgeLine],
          followUpQuestion: rephraseText || qText,
          rephraseText: rephraseText,
          preserveOriginalQ: true,
          analysis: analysis
        };
      }

      // 3. Nếu đang trả lời cho lượt Follow-up hoặc câu hỏi chính đã đủ ý -> ghi nhận ngữ cảnh & chuyển câu gốc kế tiếp
      var isProbingExplicit = explicitStyle === 'probing';
      var shouldFollowUp = !activeFollowUpQ
        && !slot.followUpAsked
        && (phase === 'part1' || phase === 'part2_round' || phase === 'part3')
        && analysis.wordCount >= 1
        && (
          analysis.isBareYesNo
          || analysis.isTooShort
          || (phase === 'part3' && !analysis.hasReason && !analysis.hasExample && analysis.wordCount < 24)
          || (isProbingExplicit && phase === 'part3' && !analysis.hasContrast && analysis.wordCount < 28)
        );

      if (shouldFollowUp) {
        var probe = buildFollowUpProbe(qText, analysis, phase, stepIndex + analysis.wordCount + sessionSeed, resolvedStyle, usedTemplates);
        var ackPool = resolvedStyle === 'strict_bc'
          ? ['I see.', 'Right.', 'Okay.']
          : (analysis.stance === 'positive'
            ? ['Oh, interesting.', 'Nice to hear that.', 'Sounds good —']
            : (analysis.stance === 'negative' ? ['I see.', 'Fair enough.', 'Oh really?'] : ['Right, thank you.', 'Interesting —', 'Got it —']));
        var leadAck = pickFreshVariant(ackPool, usedTemplates, stepIndex + sessionSeed);
        return {
          action: 'followup',
          intent: analysis.intent,
          candidateName: candidateName,
          examinerReaction: leadAck,
          followUpQuestion: probe,
          spokenLines: [leadAck + ' ' + probe],
          rephraseText: rephraseText,
          preserveOriginalQ: true,
          analysis: analysis
        };
      }

      var bridge = buildContextualBridge(analysis, {
        phase: phase,
        stepIndex: stepIndex,
        candidateName: candidateName,
        questionText: qText,
        style: resolvedStyle,
        sessionSeed: sessionSeed,
        usedTemplates: usedTemplates
      });

      return {
        action: 'advance',
        intent: analysis.intent,
        candidateName: candidateName,
        examinerReaction: bridge,
        followUpQuestion: '',
        spokenLines: bridge ? [bridge] : [],
        rephraseText: rephraseText,
        preserveOriginalQ: true,
        analysis: analysis
      };
    }

    function buildPart2StopReaction(input) {
      var o = input || {};
      var transcript = normText(o.transcript);
      var styleId = resolveSessionStyle(o.style, o.seed);
      var stopLine = o.stopScript || getPhaseScript('part2_stop', { style: styleId, seed: o.seed || 0, usedTemplates: o.usedTemplates });
      var roundingOffQ = o.roundingOffQ || 'Do you still think about this topic in daily life?';
      var nameTail = o.candidateName ? (', ' + o.candidateName) : '';
      var themes = detectAnswerThemes(transcript);
      if (wordsOf(transcript).length >= 12 && themes.length > 0) {
        var bridgeTpl = pickFreshVariant([
          'You raised some nice points about ' + themes[0].label + nameTail + '.',
          'Thank you — I especially liked how you covered ' + themes[0].label + nameTail + '.',
          'Good detail on ' + themes[0].label + nameTail + '.'
        ], o.usedTemplates, (o.seed || 0) + transcript.length);
        return {
          stopLines: [stopLine],
          roundingIntro: bridgeTpl + ' ' + roundingOffQ
        };
      }
      return {
        stopLines: [stopLine],
        roundingIntro: roundingOffQ
      };
    }

    function buildClarificationHint(qText, phase, topicTitle, styleKey) {
      var q = String(qText || '').toLowerCase();
      var cleanTopic = cleanTopicLabel(topicTitle) || 'this topic';
      var isP3 = phase === 'part3';
      var styleId = resolveSessionStyle(styleKey, q.length);
      if (/\badvantage|disadvantage|benefit|drawback|problem|positive|negative\b/.test(q)) {
        return styleId === 'probing'
          ? 'Try weighing one clear upside against an unintended side effect for different groups of people.'
          : 'Sure — you could compare one clear benefit and one possible downside for everyday people.';
      }
      if (/\bchange|past|future|nowadays|used to|modern\b/.test(q)) {
        return 'In simpler terms, try comparing how things were in the past with today, or how things might change next.';
      }
      if (/\bprefer|better|favou?rite|important|often\b/.test(q)) {
        return 'You can pick whichever option feels more practical to you and explain one personal reason why.';
      }
      if (isP3) {
        return styleId === 'probing'
          ? 'Look at society as a whole — contrast two viewpoints or mention an age-group difference with one sharp example.'
          : 'Think about people in general or your country — you can share one main reason and a short real-life example.';
      }
      return 'Just share your own everyday experience regarding ' + cleanTopic + ', and give one quick reason why.';
    }

    return {
      STYLE_PROFILES: STYLE_PROFILES,
      CONCRETE_STYLE_ORDER: CONCRETE_STYLE_ORDER,
      normalizeStyle: normalizeStyle,
      resolveSessionStyle: resolveSessionStyle,
      getStyleProfile: getStyleProfile,
      getPhaseScript: getPhaseScript,
      extractCandidateName: extractCandidateName,
      detectAnswerThemes: detectAnswerThemes,
      detectCandidateIntent: detectCandidateIntent,
      analyzeTurn: analyzeTurn,
      decideTurn: decideTurn,
      buildPart2StopReaction: buildPart2StopReaction,
      buildClarificationHint: buildClarificationHint
    };
  })();

  global.PzDialogueEngine = PzDialogueEngine;

  // =========================================================================
  // 9C. BỘ CHUYỂN ĐỔI AI EXAMINER (TIER 2 — BYOK GEMINI + FALLBACK TẦNG 1)
  // =========================================================================
  var PzAiExaminer = (function () {
    var API_ROOT = 'https://generativelanguage.googleapis.com/v1beta/models/';
    var TIMEOUT_MS = 12000;
    var ALLOWED_MODELS = ['gemini-4-hydrogen'];
    var THINKING_LEVELS = { low: 1, medium: 1, high: 1, xhigh: 1 };

    function normalizeModel(model) {
      var m = String(model || '').trim();
      return ALLOWED_MODELS.indexOf(m) !== -1 ? m : ALLOWED_MODELS[0];
    }

    function stripCodeFenceJson(rawText) {
      var s = String(rawText || '').trim();
      s = s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
      var firstBrace = s.indexOf('{');
      var lastBrace = s.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        return s.slice(firstBrace, lastBrace + 1);
      }
      return s;
    }

    function getNextCanonicalQuestion(lesson, phase, stepIndex, warmupStep) {
      if (!lesson) return '';
      if (phase === 'warmup') {
        if (warmupStep === 0) return 'Warm-up chat: hometown & work/study';
        var firstP1 = getCurrentPzP1Questions(lesson)[0];
        return firstP1 ? firstP1.q : ((lesson.part2 && lesson.part2.prompt) || '');
      }
      if (phase === 'part1') {
        var p1 = getCurrentPzP1Questions(lesson);
        if (stepIndex + 1 < p1.length) return p1[stepIndex + 1].q;
        return (lesson.part2 && lesson.part2.prompt) ? ('Part 2 Cue Card: ' + lesson.part2.prompt) : 'End of test';
      }
      if (phase === 'part2_round') {
        var firstP3 = (lesson.part3 && lesson.part3.questions && lesson.part3.questions[0]) || null;
        return firstP3 ? firstP3.q : 'End of test';
      }
      if (phase === 'part3') {
        var p3 = (lesson.part3 && lesson.part3.questions) || [];
        if (stepIndex + 1 < p3.length) return p3[stepIndex + 1].q;
        return 'End of test';
      }
      return '';
    }

    var MAX_AUDIO_BYTES = 4 * 1024 * 1024;

    function cleanAudioMime(mimeType) {
      var clean = String(mimeType || 'audio/webm').split(';')[0].trim().toLowerCase();
      return /^audio\//.test(clean) ? clean : 'audio/webm';
    }

    function arrayBufferToBase64(buf) {
      if (typeof Buffer === 'function') {
        return Buffer.from(buf).toString('base64');
      }
      var bytes = new Uint8Array(buf);
      var chunk = 0x8000;
      var bin = [];
      for (var i = 0; i < bytes.length; i += chunk) {
        bin.push(String.fromCharCode.apply(null, bytes.subarray(i, i + chunk)));
      }
      return global.btoa ? global.btoa(bin.join('')) : '';
    }

    function blobToAudioInlineData(blob) {
      if (!blob || !(blob.size > 0) || blob.size > MAX_AUDIO_BYTES) {
        return Promise.resolve(null);
      }
      var mimeType = cleanAudioMime(blob.type);
      if (typeof global.FileReader === 'function') {
        return new Promise(function (resolve) {
          try {
            var reader = new global.FileReader();
            reader.onloadend = function () {
              var res = String(reader.result || '');
              var idx = res.indexOf(',');
              var data = idx !== -1 ? res.slice(idx + 1) : '';
              resolve(data ? { inlineData: { mimeType: mimeType, data: data } } : null);
            };
            reader.onerror = function () { resolve(null); };
            reader.readAsDataURL(blob);
          } catch (e) { resolve(null); }
        });
      }
      if (typeof blob.arrayBuffer === 'function') {
        return blob.arrayBuffer().then(function (buf) {
          var b64 = arrayBufferToBase64(buf);
          return b64 ? { inlineData: { mimeType: mimeType, data: b64 } } : null;
        }).catch(function () { return null; });
      }
      return Promise.resolve(null);
    }

    function readGoogleErrorDetail(resp) {
      if (!resp || typeof resp.text !== 'function') {
        return Promise.resolve('');
      }
      return resp.text().then(function (rawErrText) {
        var detail = '';
        try {
          var obj = rawErrText ? JSON.parse(rawErrText) : null;
          detail = (obj && obj.error && obj.error.message) ? String(obj.error.message) : '';
        } catch (e) {}
        if (!detail && rawErrText) {
          detail = String(rawErrText).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        }
        return detail.length > 150 ? (detail.slice(0, 150) + '…') : detail;
      }).catch(function () { return ''; });
    }

    function callGeminiJson(opts) {
      var apiKey = String(opts.apiKey || '').trim();
      if (!apiKey || typeof fetch !== 'function') {
        return Promise.reject(new Error('Thiếu API Key hoặc trình duyệt không hỗ trợ fetch'));
      }
      var model = normalizeModel(opts.model);
      var url = API_ROOT + encodeURIComponent(model) + ':generateContent?key=' + encodeURIComponent(apiKey);
      var timeoutMs = opts.timeoutMs || TIMEOUT_MS;
      var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
      var timedOut = false;
      var timerId = setTimeout(function () {
        timedOut = true;
        if (ctrl) {
          try { ctrl.abort('timeout'); } catch (e) { ctrl.abort(); }
        }
      }, timeoutMs);

      var genConfig = {
        temperature: typeof opts.temperature === 'number' ? opts.temperature : 0.45,
        maxOutputTokens: opts.maxOutputTokens || 1024,
        thinkingConfig: {
          thinkingLevel: (opts.thinkingLevel && THINKING_LEVELS[opts.thinkingLevel]) ? opts.thinkingLevel : 'low'
        }
      };
      if (opts.jsonMode !== false) {
        genConfig.responseMimeType = 'application/json';
      }

      var userParts = [{ text: opts.userPrompt }];
      if (Array.isArray(opts.extraParts)) {
        opts.extraParts.forEach(function (ep) {
          if (ep) userParts.push(ep);
        });
      }

      var payload = {
        systemInstruction: { parts: [{ text: opts.systemPrompt }] },
        contents: [{ role: 'user', parts: userParts }],
        generationConfig: genConfig
      };

      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (resp) {
        if (!resp.ok) {
          return readGoogleErrorDetail(resp).then(function (detail) {
            throw new Error('HTTP ' + resp.status + (detail ? (' — ' + detail) : ''));
          });
        }
        return resp.json();
      }).then(function (data) {
        var cand = data && data.candidates && data.candidates[0];
        var parts = cand && cand.content && cand.content.parts;
        var raw = Array.isArray(parts)
          ? parts.map(function (p) { return (p && p.text && !p.thought) ? p.text : ''; }).join(' ').trim()
          : '';
        if (!raw) {
          var blockReason = (data && data.promptFeedback && data.promptFeedback.blockReason)
            || (cand && cand.finishReason && cand.finishReason !== 'STOP' ? cand.finishReason : '');
          throw new Error('Empty AI response' + (blockReason ? (' (' + blockReason + ')') : ''));
        }
        return raw;
      }).catch(function (err) {
        var errMsg = String((err && err.message) || err || '');
        if (timedOut || (err && err.name === 'AbortError') || /aborted/i.test(errMsg)) {
          throw new Error('Hết thời gian chờ (' + Math.round(timeoutMs / 1000) + 's), mạng chậm hoặc Gemini phản hồi lâu');
        }
        throw (err instanceof Error ? err : new Error(errMsg || 'Lỗi kết nối Gemini API'));
      }).finally(function () {
        clearTimeout(timerId);
      });
    }

    function parseAndValidateAiDecision(rawText, input, offlineDecision) {
      var parsed = JSON.parse(stripCodeFenceJson(rawText));
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON structure');
      }

      var reaction = String(parsed.examinerReaction || '').replace(/\s+/g, ' ').trim();
      if (!reaction) {
        throw new Error('Missing examinerReaction');
      }
      // Giữ phản hồi gọn tự nhiên chuẩn phòng thi (tối đa ~45 từ)
      var reactionWords = reaction.split(' ').filter(Boolean);
      if (reactionWords.length > 48) {
        reaction = reactionWords.slice(0, 48).join(' ').replace(/[,:;]+$/, '') + '.';
      }

      if (input.phase === 'warmup' && input.warmupStep === 0) {
        var aiName = PzDialogueEngine.extractCandidateName(parsed.detectedName || '') || offlineDecision.candidateName;
        var followGreeting = String(parsed.followUpQuestion || '').replace(/\s+/g, ' ').trim()
          || offlineDecision.followUpQuestion;
        return Object.assign({}, offlineDecision, {
          candidateName: aiName,
          examinerReaction: reaction,
          followUpQuestion: followGreeting,
          spokenLines: [reaction, followGreeting],
          source: 'gemini'
        });
      }

      var rawAction = String(parsed.action || 'advance').toLowerCase().trim();
      var validAction = (rawAction === 'followup' || rawAction === 'rephrase' || rawAction === 'advance')
        ? rawAction
        : 'advance';

      if (validAction === 'followup' && !input.canFollowUp) {
        validAction = 'advance';
      }

      var followUpQ = String(parsed.followUpQuestion || '').replace(/\s+/g, ' ').trim();
      var rephraseQ = String(parsed.rephraseText || '').replace(/\s+/g, ' ').trim();

      if (validAction === 'followup' && !followUpQ) {
        validAction = 'advance';
      }
      if (validAction === 'rephrase' && !rephraseQ) {
        rephraseQ = offlineDecision.rephraseText;
      }
      if (validAction === 'rephrase' && !rephraseQ) {
        validAction = 'advance';
      }

      var spokenLines = [reaction];
      if (validAction === 'followup') spokenLines.push(followUpQ);
      else if (validAction === 'rephrase') spokenLines.push(rephraseQ);

      return Object.assign({}, offlineDecision, {
        action: validAction,
        examinerReaction: reaction,
        followUpQuestion: validAction === 'followup' ? followUpQ : '',
        rephraseText: validAction === 'rephrase' ? rephraseQ : offlineDecision.rephraseText,
        spokenLines: spokenLines,
        preserveOriginalQ: true,
        source: 'gemini'
      });
    }

    function collectAvoidOpeners(dialogueHistory) {
      var list = Array.isArray(dialogueHistory) ? dialogueHistory : [];
      var out = [];
      for (var i = list.length - 1; i >= 0 && out.length < 6; i--) {
        var h = list[i];
        if (h && h.role === 'examiner' && (h.kind === 'reaction' || h.kind === 'followup' || h.kind === 'clarify')) {
          var snippet = String(h.text || '').replace(/\s+/g, ' ').trim();
          if (snippet) out.unshift(snippet.slice(0, 72));
        }
      }
      return out;
    }

    function decideTurnHybrid(input, offlineDecision) {
      var o = input || {};
      var baseOffline = Object.assign({}, offlineDecision, { source: 'offline' });
      var transcript = String(o.transcript || '').trim();

      if (
        o.mode !== 'gemini_hybrid'
        || !o.apiKey
        || typeof fetch !== 'function'
        || offlineDecision.intent === 'repeat'
        || (!transcript && o.phase !== 'warmup')
      ) {
        return Promise.resolve(baseOffline);
      }

      var styleProfile = PzDialogueEngine.getStyleProfile(o.style || 'adaptive', o.sessionSeed || 0);
      var persona = o.examinerPersona || { name: 'Examiner', accent: 'UK' };
      var avoidOpeners = collectAvoidOpeners(o.dialogueHistory);

      var canFollowUp = Boolean(
        (o.phase === 'part1' || o.phase === 'part2_round' || o.phase === 'part3')
        && !o.activeFollowUpQ
        && !(o.slot && o.slot.followUpAsked)
        && transcript
      );
      var recentHistory = (o.dialogueHistory || []).slice(-5).map(function (h) {
        return (h.role === 'examiner' ? 'Examiner: ' : 'Candidate: ') + h.text;
      }).join('\n');
      var nextCanonicalQ = getNextCanonicalQuestion(o.lesson, o.phase, o.stepIndex || 0, o.warmupStep || 0);

      var reactionLimitRule = styleProfile.id === 'strict_bc'
        ? 'Keep examinerReaction crisp and formal (4-14 words, understated British Council style).'
        : 'Keep examinerReaction vivid, varied, and concise (1 natural spoken sentence, max 25 words) reacting directly to a specific idea or word in what the candidate just said.';

      var followUpGuidance = styleProfile.id === 'probing'
        ? 'If canFollowUp is true AND the answer is brief, one-sided, lacks an example, or mentions an interesting claim (especially in Part 3), set action="followup" and ask 1 sharp analytical follow-up (e.g., trade-off, opposite view, age-group difference, or "why").'
        : 'If canFollowUp is true AND the answer is brief, unclear, Yes/No without explanation, or opens an interesting angle, set action="followup" and ask 1 short natural IELTS follow-up probe matching your examiner persona.';

      var systemPrompt = [
        'You are ' + persona.name + ' (' + (persona.accent || 'UK') + '), conducting a live two-way IELTS Speaking conversation.',
        'ACTIVE EXAMINER STYLE (' + styleProfile.id + '): ' + styleProfile.promptBrief,
        'STRICT EXAM INTEGRITY RULE: The official test questions are fixed and handled by the exam runner. NEVER skip, replace, alter, or invent main test questions, and NEVER include nextOfficialQuestionLockedByRunner inside your response.',
        reactionLimitRule,
        'ANTI-REPETITION RULE: Vary your phrasing naturally across every turn. NEVER repeat sentence openings, templates, or exact wording listed in avoidOpeners.',
        'If phase==="warmup" and warmupStep===0, acknowledge their name warmly/formally per your style, extract detectedName, and set followUpQuestion to a fresh natural IELTS warm-up question (e.g., hometown, neighborhood, work/studies, daily routine, or comfort check) matching your persona.',
        followUpGuidance,
        'If candidate explicitly asks to explain or rephrase the question, set action="rephrase" and rewrite ONLY the current question in simpler everyday English.',
        'Otherwise set action="advance" so the exam runner seamlessly delivers the next official question after your examinerReaction.',
        'Return strict JSON with keys: detectedName, action, examinerReaction, followUpQuestion, rephraseText.'
      ].join(' ');

      var userPrompt = JSON.stringify({
        phase: o.phase,
        warmupStep: o.warmupStep || 0,
        examinerStyle: styleProfile.id,
        candidateName: o.candidateName || '',
        currentQuestion: (o.activeFollowUpQ || (o.meta && o.meta.qText) || ''),
        candidateReply: transcript || '[Candidate remained silent / clicked next]',
        canFollowUp: canFollowUp,
        nextOfficialQuestionLockedByRunner: nextCanonicalQ,
        avoidOpeners: avoidOpeners,
        recentDialogue: recentHistory
      });

      return callGeminiJson({
        apiKey: o.apiKey,
        model: o.model,
        systemPrompt: systemPrompt,
        userPrompt: userPrompt,
        temperature: typeof o.temperature === 'number' ? o.temperature : styleProfile.temperature,
        timeoutMs: o.timeoutMs || TIMEOUT_MS
      }).then(function (rawText) {
        return parseAndValidateAiDecision(rawText, {
          phase: o.phase,
          warmupStep: o.warmupStep || 0,
          canFollowUp: canFollowUp
        }, offlineDecision);
      }).catch(function (err) {
        return Object.assign({}, offlineDecision, {
          source: 'offline_fallback',
          fallbackReason: err && err.message ? err.message : 'fallback'
        });
      });
    }

    function buildPart2StopReactionHybrid(input, offlinePart2) {
      var o = input || {};
      var wordLen = String(o.transcript || '').trim().split(/\s+/).filter(Boolean).length;
      if (o.mode !== 'gemini_hybrid' || !o.apiKey || typeof fetch !== 'function' || wordLen < 12) {
        return Promise.resolve(Object.assign({}, offlinePart2, { source: 'offline' }));
      }
      var styleProfile = PzDialogueEngine.getStyleProfile(o.style || 'adaptive', o.sessionSeed || 0);
      var stopLine = o.stopScript || PzDialogueEngine.getPhaseScript('part2_stop', { style: styleProfile.id, seed: o.sessionSeed || 0 });
      var roundingOffQ = o.roundingOffQ || 'Do you still think about this topic in daily life?';
      var systemPrompt = 'You are an IELTS Examiner (' + styleProfile.id + ' style: ' + styleProfile.promptBrief + ') transitioning from a candidate Part 2 long turn to a rounding-off question. Return JSON {"bridge":"1 short natural sentence (max 18 words) reacting specifically to what the candidate spoke about"}. Do NOT ask any new question.';
      var userPrompt = JSON.stringify({
        candidateName: o.candidateName || '',
        cueCardPrompt: o.prompt || '',
        candidatePart2Speech: String(o.transcript || '').slice(0, 1200)
      });

      return callGeminiJson({
        apiKey: o.apiKey,
        model: o.model,
        systemPrompt: systemPrompt,
        userPrompt: userPrompt,
        maxOutputTokens: 1024,
        thinkingLevel: 'low',
        temperature: styleProfile.temperature,
        timeoutMs: o.timeoutMs || TIMEOUT_MS
      }).then(function (raw) {
        var obj = JSON.parse(stripCodeFenceJson(raw));
        var bridge = String((obj && obj.bridge) || '').replace(/\s+/g, ' ').trim();
        if (!bridge) throw new Error('Empty Part 2 bridge');
        return {
          stopLines: [stopLine],
          roundingIntro: bridge + ' ' + roundingOffQ,
          source: 'gemini'
        };
      }).catch(function () {
        return Object.assign({}, offlinePart2, { source: 'offline_fallback' });
      });
    }

    function testConnection(opts) {
      var o = opts || {};
      var cleanKey = String(o.apiKey || '').trim();
      if (!cleanKey) return Promise.resolve({ ok: false, error: 'Chưa nhập Gemini API Key.' });
      return callGeminiJson({
        apiKey: cleanKey,
        model: o.model,
        systemPrompt: 'Reply concisely.',
        userPrompt: 'Reply with exact word: READY',
        jsonMode: false,
        maxOutputTokens: 1024,
        thinkingLevel: 'low',
        temperature: 0,
        timeoutMs: o.timeoutMs || 25000
      }).then(function (reply) {
        return { ok: true, model: normalizeModel(o.model), reply: reply };
      }).catch(function (err) {
        return { ok: false, error: (err && err.message) || 'Kết nối thất bại' };
      });
    }

    function buildClarificationHybrid(input, offlineHint) {
      var o = input || {};
      if (o.mode !== 'gemini_hybrid' || !o.apiKey || typeof fetch !== 'function') {
        return Promise.resolve({ hint: offlineHint, source: 'offline' });
      }
      var styleProfile = PzDialogueEngine.getStyleProfile(o.style || 'adaptive', o.sessionSeed || 0);
      return callGeminiJson({
        apiKey: o.apiKey,
        model: o.model,
        systemPrompt: 'You are an IELTS Examiner clarifying a question without giving away sample answers (' + styleProfile.promptBrief + '). Return JSON {"hint":"1 concise, practical sentence explaining an angle the candidate can talk about"}.',
        userPrompt: JSON.stringify({ phase: o.phase, question: o.questionText || '', topic: o.topicTitle || '' }),
        maxOutputTokens: 1024,
        thinkingLevel: 'low',
        temperature: styleProfile.temperature,
        timeoutMs: o.timeoutMs || TIMEOUT_MS
      }).then(function (raw) {
        var obj = JSON.parse(stripCodeFenceJson(raw));
        var hint = String((obj && obj.hint) || '').replace(/\s+/g, ' ').trim();
        if (!hint) throw new Error('Empty hint');
        return { hint: hint, source: 'gemini' };
      }).catch(function () {
        return { hint: offlineHint, source: 'offline_fallback' };
      });
    }

    function transcribeAudioWithGemini(blob, opts) {
      var o = opts || {};
      var apiKey = String(o.apiKey || getStoredGeminiKey() || '').trim();
      if (!apiKey || !blob || typeof fetch !== 'function') {
        return Promise.resolve({ ok: false, transcript: '', source: 'none' });
      }
      return blobToAudioInlineData(blob).then(function (inlinePart) {
        if (!inlinePart) return { ok: false, transcript: '', source: 'oversize_or_empty' };
        var ctxHint = o.contextHint ? ('Context question/sentence: "' + String(o.contextHint).slice(0, 260) + '". ') : '';
        return callGeminiJson({
          apiKey: apiKey,
          model: o.model || prefs.pzGeminiModel,
          systemPrompt: 'You are an accurate English speech-to-text transcriber. Listen carefully to the attached audio and transcribe ONLY what the speaker actually says in English (verbatim, keeping natural contractions). If audio is silent or unintelligible noise, return empty transcript "". Do not hallucinate missing words. Return strict JSON: {"transcript":"...","hasSpeech":true}',
          userPrompt: ctxHint + 'Transcribe the spoken English audio verbatim now.',
          extraParts: [inlinePart],
          thinkingLevel: 'low',
          maxOutputTokens: 2048,
          temperature: 0.1,
          timeoutMs: o.timeoutMs || 30000
        }).then(function (rawText) {
          var parsed = JSON.parse(stripCodeFenceJson(rawText));
          var tx = String((parsed && parsed.transcript) || '').replace(/\s+/g, ' ').trim();
          return { ok: Boolean(tx), transcript: tx, source: tx ? 'gemini_audio' : 'empty_audio' };
        }).catch(function (err) {
          return { ok: false, transcript: '', source: 'fallback', error: (err && err.message) ? err.message : '' };
        });
      });
    }

    return {
      decideTurnHybrid: decideTurnHybrid,
      buildPart2StopReactionHybrid: buildPart2StopReactionHybrid,
      buildClarificationHybrid: buildClarificationHybrid,
      transcribeAudioWithGemini: transcribeAudioWithGemini,
      blobToAudioInlineData: blobToAudioInlineData,
      testConnection: testConnection,
      callGeminiJson: callGeminiJson,
      stripCodeFenceJson: stripCodeFenceJson,
      normalizeModel: normalizeModel,
      parseAndValidateAiDecision: parseAndValidateAiDecision,
      getNextCanonicalQuestion: getNextCanonicalQuestion
    };
  })();

  global.PzAiExaminer = PzAiExaminer;

  // =========================================================================
  // 9D. BỘ TỰ CHẤM ĐIỂM & NHẬN XÉT 2 TẦNG (SPEAKING GRADER — OFFLINE + HYDROGEN)
  // =========================================================================
  var SpeakingGrader = (function () {
    var UPGRADE_BANK = [
      { rx: /\bvery good\b|\breally good\b|\bso good\b/i, from: 'very good / really good', upgrade: 'rewarding / exceptional / worthwhile', meaningVi: 'đáng giá / xuất sắc / bổ ích' },
      { rx: /\bvery bad\b|\breally bad\b/i, from: 'very bad / really bad', upgrade: 'detrimental / counterproductive / adverse', meaningVi: 'gây hại / phản tác dụng' },
      { rx: /\bvery important\b|\breally important\b/i, from: 'very important', upgrade: 'crucial / indispensable / paramount', meaningVi: 'then chốt / không thể thiếu' },
      { rx: /\bvery busy\b|\bso busy\b/i, from: 'very busy', upgrade: 'hectic / snowed under / pressed for time', meaningVi: 'bận rộn ngập đầu / eo hẹp thời gian' },
      { rx: /\ba lot of\b|\blots of\b/i, from: 'a lot of / lots of', upgrade: 'a wide array of / countless / a wealth of', meaningVi: 'rất nhiều / phong phú' },
      { rx: /\bvery happy\b|\breally happy\b/i, from: 'very happy', upgrade: 'over the moon / genuinely fulfilled / delighted', meaningVi: 'vui sướng / mãn nguyện' },
      { rx: /\bvery tired\b|\breally tired\b/i, from: 'very tired', upgrade: 'exhausted / drained / burnt out', meaningVi: 'kiệt sức / uể oải' },
      { rx: /\binteresting\b/i, from: 'interesting', upgrade: 'fascinating / thought-provoking / captivating', meaningVi: 'hấp dẫn / gợi suy ngẫm' }
    ];

    var SPOKEN_GRAMMAR_CHECKS = [
      { rx: /\b(peoples|childrens|informations|advices|equipments|knowledges)\b/i, noteVi: 'Danh từ không đếm được hoặc bất quy tắc — bỏ "-s" (people, children, information, advice, equipment, knowledge).', fix: function (m) { return m.replace(/s$/i, ''); } },
      { rx: /\bmore\s+(better|easier|cheaper|faster|harder|worse|bigger|smaller|older|younger)\b/i, noteVi: 'Tránh dùng "more" kèm tính từ so sánh ngắn — dùng trực tiếp "better / easier / cheaper...".', fix: function (m) { return m.replace(/^more\s+/i, ''); } },
      { rx: /\bi\s+am\s+agree\b|\bi'm\s+agree\b/i, noteVi: 'Động từ "agree" không đi sau "to be" — sửa thành "I agree" hoặc "I completely agree".', fix: function () { return 'I agree'; } },
      { rx: /\bdiscuss\s+about\b/i, noteVi: '"Discuss" là ngoại động từ, không dùng "about" theo sau ("discuss this topic").', fix: function () { return 'discuss'; } },
      { rx: /\bdepend\s+of\b|\bdepends\s+of\b/i, noteVi: 'Cụm đúng là "depend on / depends on".', fix: function (m) { return m.replace(/\bof$/i, 'on'); } },
      { rx: /\bthere\s+have\b/i, noteVi: 'Khi diễn tả sự tồn tại, dùng "there is / there are" thay cho "there have".', fix: function () { return 'there are'; } },
      { rx: /\bpeople\s+is\b/i, noteVi: '"People" luôn chia động từ số nhiều ("people are...").', fix: function () { return 'people are'; } }
    ];

    var ADV_LEXIS_RX = /\b(nowadays|crucial|significant\w*|drawback\w*|perspective\w*|sustainab\w*|cultivat\w*|overwhelm\w*|reward\w*|authentic\w*|enrich\w*|downside\w*|trade-off\w*|inevitabl\w*|beneficial|practical\w*|fulfill\w*|memorable|flexib\w*|productive|environment\w*|priorit\w*|experience\w*|communit\w*)\b/gi;

    function clampIeltsBand(val, fallback) {
      var n = Number(val);
      if (!isFinite(n) || n <= 0) n = Number(fallback) || 1.0;
      n = Math.max(1.0, Math.min(9.0, n));
      return roundIeltsBand(n);
    }

    function wordCountOf(text) {
      return String(text || '').trim().split(/\s+/).filter(function (w) { return /[a-z]/i.test(w); }).length;
    }

    function capByTable(wc, table) {
      for (var i = 0; i < table.length; i++) {
        if (wc < table[i][0]) return table[i][1];
      }
      return 9.0;
    }

    // Trần điểm theo lượng bằng chứng (số từ thực nói, tỉ lệ câu đã trả lời, độ dài Part 2).
    // Bám theo mô tả IELTS: câu trả lời quá ngắn / bỏ câu không thể chứng minh Band cao.
    var WORD_CAP_STUDIO = [[10, 3.0], [25, 4.0], [45, 5.0], [70, 6.0], [100, 7.0]];
    var WORD_CAP_FULL = [[20, 3.0], [60, 4.0], [120, 5.0], [200, 6.0], [280, 7.0]];

    function isWarmupTurn(t) {
      var key = String((t && t.key) || '');
      var lbl = String((t && t.label) || '');
      return /^warmup/i.test(key) || /^warm-?up/i.test(lbl);
    }

    function getRequiredQuestionCount(lesson) {
      if (!lesson) return 0;
      var p1Count = lesson.part1 ? ((lesson.part1.topic1Qs || []).length + (lesson.part1.topic2Qs || []).length) : 0;
      var p3Count = (lesson.part3 && Array.isArray(lesson.part3.questions)) ? lesson.part3.questions.length : 0;
      var hasP2 = Boolean(lesson.part2 && lesson.part2.prompt);
      return p1Count + p3Count + (hasP2 ? 1 : 0);
    }

    function computeEvidence(payload, wc, isFullExam) {
      var p = payload || {};
      var reasons = [];
      var wordCap = capByTable(wc, isFullExam ? WORD_CAP_FULL : WORD_CAP_STUDIO);
      if (wordCap < 9.0) reasons.push('Mới ghi nhận ' + wc + ' từ được chấm → trần ' + wordCap.toFixed(1));

      var coverageCap = 9.0;
      var answered = 0;
      var required = 0;
      var part2Words = -1;
      if (p.kind === 'pz' && Array.isArray(p.turns)) {
        var L = p.lesson || null;
        var hasP2 = Boolean(L && L.part2 && L.part2.prompt);
        required = getRequiredQuestionCount(L);
        var scored = p.turns.filter(function (t) {
          return t && !isWarmupTurn(t) && t.key !== 'p2_round';
        });
        if (!required) required = scored.length;
        answered = scored.filter(function (t) {
          return wordCountOf([t.transcript, t.followUpTranscript].filter(Boolean).join(' ')) >= 3;
        }).length;
        var p2Turn = p.turns.find(function (t) {
          return t && (t.key === 'part2_long' || /part\s*2\s*long/i.test(String(t.label || '')));
        });
        if (hasP2) part2Words = p2Turn ? wordCountOf(p2Turn.transcript) : 0;

        if (required >= 3) {
          var cov = answered / required;
          if (cov < 0.25) coverageCap = 3.5;
          else if (cov < 0.5) coverageCap = 4.5;
          else if (cov < 0.75) coverageCap = 5.5;
          else if (cov < 0.9) coverageCap = 6.5;
          if (coverageCap < 9.0) reasons.push('Trả lời ' + answered + '/' + required + ' câu → trần ' + coverageCap.toFixed(1));
        }
      }

      var overallCap = Math.min(wordCap, coverageCap);
      var caps = { fc: overallCap, lr: overallCap, gra: overallCap, pr: overallCap };
      if (part2Words >= 0 && part2Words < 40) {
        caps.fc = Math.min(caps.fc, 5.0);
        caps.lr = Math.min(caps.lr, 5.0);
        reasons.push('Part 2 chỉ ' + part2Words + ' từ (< 40) → FC/LR tối đa 5.0');
      } else if (part2Words >= 40 && part2Words < 80) {
        caps.fc = Math.min(caps.fc, 6.0);
        reasons.push('Part 2 mới ' + part2Words + ' từ (< 80) → FC tối đa 6.0');
      }

      return {
        assessedWords: wc,
        answered: answered,
        required: required,
        part2Words: part2Words,
        overallCap: overallCap,
        caps: caps,
        reasons: reasons
      };
    }

    function applyCaps(scores, caps, allowDirectAudioPr) {
      var out = {};
      ['fc', 'lr', 'gra', 'pr'].forEach(function (k) {
        out[k] = roundIeltsBand(Math.max(1.0, Math.min(Number(scores[k]) || 1.0, caps[k] || 9.0)));
      });
      // Khi chưa nghe audio trực tiếp, Pronunciation ước lượng gián tiếp nên không vượt FC quá 0.5
      if (!allowDirectAudioPr) {
        out.pr = Math.min(out.pr, roundIeltsBand(out.fc + 0.5));
      }
      return out;
    }

    function countUniqueWords(tokens) {
      var set = new Set();
      tokens.forEach(function (t) {
        if (t && t.length >= 2) set.add(t);
      });
      return set.size;
    }

    function detectRepeatedContentWords(tokens) {
      var stop = {
        the: 1, and: 1, that: 1, for: 1, with: 1, you: 1, this: 1, are: 1, have: 1, was: 1,
        were: 1, they: 1, not: 1, but: 1, from: 1, about: 1, can: 1, will: 1, just: 1, very: 1,
        really: 1, think: 1, like: 1, some: 1, more: 1, when: 1, what: 1, also: 1, because: 1,
        there: 1, their: 1, would: 1, could: 1, much: 1, many: 1, time: 1, people: 1, things: 1
      };
      var freq = {};
      tokens.forEach(function (t) {
        if (t.length >= 4 && !stop[t]) freq[t] = (freq[t] || 0) + 1;
      });
      return Object.keys(freq)
        .filter(function (k) { return freq[k] >= 4; })
        .sort(function (a, b) { return freq[b] - freq[a]; })
        .slice(0, 3);
    }

    function detectGrammarSignals(text) {
      var s = String(text || '');
      var subCount = (s.match(/\b(because|since|although|even though|whereas|while|unless|provided that|so that|whenever|even if)\b/gi) || []).length;
      var relCount = (s.match(/\b(which|who|whom|whose|where)\b|\bthat\s+(?:is|are|was|were|has|have|can|will|helps?|makes?)\b/gi) || []).length;
      var condCount = (s.match(/\b(would|could|might|if\s+[^,.!?]{2,40}\b(?:will|would|could|might|were)\b|used to)\b/gi) || []).length;
      var perfPassCount = (s.match(/\b(?:has|have|had|is|are|was|were|been)\s+[a-z]+(?:ed|en)\b/gi) || []).length;

      var fixes = [];
      for (var i = 0; i < SPOKEN_GRAMMAR_CHECKS.length && fixes.length < 4; i++) {
        var chk = SPOKEN_GRAMMAR_CHECKS[i];
        var m = chk.rx.exec(s);
        if (m) {
          fixes.push({
            original: m[0],
            corrected: chk.fix(m[0]),
            noteVi: chk.noteVi
          });
        }
      }
      return {
        subCount: subCount,
        relCount: relCount,
        condCount: condCount,
        perfPassCount: perfPassCount,
        fixes: fixes
      };
    }

    function buildCombinedExamTranscript(payload) {
      var p = payload || {};
      var turns = Array.isArray(p.turns) ? p.turns : [];
      if (turns.length) {
        return turns
          .filter(function (t) { return t && !isWarmupTurn(t); })
          .map(function (t) {
            return [t && t.transcript, t && t.followUpTranscript].filter(Boolean).join(' ').trim();
          })
          .filter(Boolean)
          .join(' ')
          .trim();
      }
      if (p.transcript && String(p.transcript).trim()) return String(p.transcript).trim();
      return '';
    }

    /**
     * Tầng 1: Tự chấm điểm & nhận xét Offline (0ms) dựa trên transcript (loại bỏ Warm-up),
     * WPM, từ nối, độ đa dạng từ vựng (Guiraud index), cấu trúc ngữ pháp và bằng chứng hoàn thành.
     */
    function evaluateOffline(payload) {
      var p = payload || {};
      var transcript = buildCombinedExamTranscript(p);
      var targets = Array.isArray(p.targetWords)
        ? p.targetWords
        : (p.lesson ? collectTargetLexis(p.lesson) : []);
      var reqCount = getRequiredQuestionCount(p.lesson);
      var isFullExam = p.kind === 'pz' && (reqCount >= 4 || !Array.isArray(p.turns) || p.turns.length >= 4);
      var turnsArr = Array.isArray(p.turns) ? p.turns : [];
      var assessedDur = turnsArr.length
        ? turnsArr.reduce(function (acc, t) {
          if (!t || isWarmupTurn(t)) return acc;
          return acc + (Number(t.durationSec) || 0) + (Number(t.followUpDurationSec) || 0);
        }, 0)
        : 0;
      var durationSec = assessedDur || Number(p.durationSec) || (isFullExam ? 120 : 30);
      var metrics = analyzeTranscriptMetrics(transcript, durationSec, targets);
      var wc = metrics.wordCount;

      if (wc < 3) {
        var warmupWords = turnsArr.filter(isWarmupTurn).reduce(function (acc, t) {
          return acc + wordCountOf(t && t.transcript);
        }, 0);
        var emptyFb = {
          fc: 'Không có lời nói phần thi chính để đánh giá độ trôi chảy.',
          lr: 'Không có từ vựng nào được ghi nhận ở phần trả lời.',
          gra: 'Không có câu nào để phân tích ngữ pháp.',
          pr: 'Không có dữ liệu giọng nói để ước lượng phát âm.'
        };
        var emptySummary = warmupWords >= 3
          ? 'CHƯA CHẤM — Bạn mới nói ở phần chào hỏi Warm-up (' + warmupWords + ' từ), chưa có câu trả lời nào trong Part 1–3. Hãy trả lời các câu hỏi thi chính hoặc nhập transcript để chấm.'
          : 'CHƯA CHẤM — hệ thống không ghi nhận lời nói nào (' + wc + ' từ). Nếu bạn đã nói mà không hiện chữ, nhận diện giọng nói (STT) trên thiết bị đang không hoạt động: hãy gõ/dán nội dung bạn đã nói vào ô transcript rồi chấm lại.';
        return {
          source: 'offline',
          model: 'offline-rubric-v2',
          hasTranscript: false,
          notRated: true,
          metrics: metrics,
          evidence: computeEvidence(p, wc, isFullExam),
          scores: { fc: 0, lr: 0, gra: 0, pr: 0 },
          overallBand: 0,
          summaryVi: emptySummary,
          criteriaFeedback: emptyFb,
          strengths: [],
          improvements: ['Trả lời bằng tiếng Anh cho từng câu hỏi (mỗi câu Part 1 khoảng 2–3 câu, Part 2 nói 1–2 phút).'],
          vocabUpgrades: [],
          grammarFixes: [],
          prEstimatedNote: '',
          gradedAt: Date.now()
        };
      }

      var telemetry = p.telemetry || {};
      var rawTokens = transcript.toLowerCase().replace(/[^a-z'\s-]/g, ' ').split(/\s+/).filter(Boolean);
      var uniqueCnt = countUniqueWords(rawTokens);
      var guiraud = wc > 0 ? (uniqueCnt / Math.sqrt(wc)) : 0;
      var advHits = (transcript.match(ADV_LEXIS_RX) || []).length;
      var repeatedWords = detectRepeatedContentWords(rawTokens);
      var gramSig = detectGrammarSignals(transcript);

      // 1. Fluency & Coherence (thang 1.0–9.0 + chuẩn hóa Full Exam vs Studio)
      var targetWc = isFullExam ? 260 : 120;
      var volRatio = Math.min(1.2, wc / targetWc);
      var fcRaw = 3.2 + volRatio * 2.55;
      if (metrics.wpm >= 95 && metrics.wpm <= 160) fcRaw += 0.95;
      else if (metrics.wpm >= 75 && metrics.wpm <= 178) fcRaw += 0.5;
      else if (wc >= 15) fcRaw += 0.1;
      fcRaw += Math.min(1.15, metrics.connectorsUsed.length * 0.28);
      var fillerRatio = wc ? (metrics.fillerCount / wc) : 0;
      if (fillerRatio > 0.06) fcRaw -= 0.6;
      else if (fillerRatio > 0.03) fcRaw -= 0.3;
      if ((telemetry.repeatCount || 0) + (telemetry.rephraseCount || 0) >= 4) fcRaw -= 0.25;
      var fcScore = clampIeltsBand(fcRaw, 2.5);

      // 2. Lexical Resource
      var lrRaw = 3.2;
      if (guiraud >= 7.2) lrRaw += 2.6;
      else if (guiraud >= 5.8) lrRaw += 2.05;
      else if (guiraud >= 4.5) lrRaw += 1.4;
      else lrRaw += 0.65;
      lrRaw += Math.min(1.0, metrics.usedTargets.length * 0.35);
      lrRaw += Math.min(1.0, advHits * 0.25);
      if (repeatedWords.length >= 2 && wc < 180) lrRaw -= 0.35;
      var lrScore = clampIeltsBand(lrRaw, 2.5);

      // 3. Grammatical Range & Accuracy
      var structDiversity =
        (gramSig.subCount > 0 ? 1 : 0)
        + (gramSig.relCount > 0 ? 1 : 0)
        + (gramSig.condCount > 0 ? 1 : 0)
        + (gramSig.perfPassCount > 0 ? 1 : 0);
      var totalComplex = gramSig.subCount + gramSig.relCount + gramSig.condCount + gramSig.perfPassCount;
      var graRaw = 3.3 + Math.min(2.0, structDiversity * 0.5) + Math.min(1.4, totalComplex * 0.22);
      if (wc >= (isFullExam ? 140 : 60)) graRaw += 0.45;
      graRaw -= Math.min(1.0, gramSig.fixes.length * 0.4);
      var graScore = clampIeltsBand(graRaw, 2.5);

      // 4. Pronunciation (ước lượng từ WPM & độ nhận diện rõ của STT)
      var prRaw = fcScore * 0.55 + lrScore * 0.45;
      if (metrics.wpm >= 98 && metrics.wpm <= 152 && fillerRatio <= 0.035) prRaw += 0.2;
      else if (metrics.wpm > 0 && (metrics.wpm < 75 || metrics.wpm > 185)) prRaw -= 0.35;
      var prScore = clampIeltsBand(prRaw, fcScore);

      var evidence = computeEvidence(p, wc, isFullExam);
      var capped = applyCaps({ fc: fcScore, lr: lrScore, gra: graScore, pr: prScore }, evidence.caps);
      fcScore = capped.fc;
      lrScore = capped.lr;
      graScore = capped.gra;
      prScore = capped.pr;

      var overallBand = roundIeltsBand((fcScore + lrScore + graScore + prScore) / 4);

      // Xây dựng nâng cấp từ vựng & gợi ý cụ thể
      var vocabUpgrades = [];
      for (var u = 0; u < UPGRADE_BANK.length && vocabUpgrades.length < 4; u++) {
        if (UPGRADE_BANK[u].rx.test(transcript)) {
          vocabUpgrades.push({
            from: UPGRADE_BANK[u].from,
            upgrade: UPGRADE_BANK[u].upgrade,
            meaningVi: UPGRADE_BANK[u].meaningVi
          });
        }
      }
      var unusedTargets = targets.filter(function (tw) {
        return metrics.usedTargets.indexOf(tw) === -1;
      });
      for (var ut = 0; ut < unusedTargets.length && vocabUpgrades.length < 5; ut++) {
        vocabUpgrades.push({
          from: '(Chưa dùng trong bài)',
          upgrade: unusedTargets[ut],
          meaningVi: 'Từ vựng mục tiêu Band 7.0+ của bài này'
        });
      }

      var grammarFixes = gramSig.fixes.slice();
      if (!grammarFixes.length && gramSig.condCount === 0) {
        grammarFixes.push({
          original: '(Thiếu câu điều kiện / giả định)',
          corrected: 'If I had more time, I would definitely explore ... / Were that to happen, people might ...',
          noteVi: 'Bổ sung 1–2 câu điều kiện loại 2 hoặc cấu trúc giả định giúp tiêu chí GRA dễ chạm Band 7.0+.'
        });
      }

      var strengths = [];
      if (metrics.wpm >= 95 && metrics.wpm <= 160) strengths.push('Tốc độ nói ổn định (~' + metrics.wpm + ' WPM), giữ được nhịp giao tiếp tự nhiên.');
      if (metrics.connectorsUsed.length >= 2) strengths.push('Sử dụng hợp lý các từ nối mạch lạc (' + metrics.connectorsUsed.slice(0, 4).join(', ') + ').');
      if (metrics.usedTargets.length > 0) strengths.push('Vận dụng được ' + metrics.usedTargets.length + ' cụm từ mục tiêu của chủ đề (' + metrics.usedTargets.slice(0, 3).join(', ') + ').');
      if (totalComplex >= 3) strengths.push('Có kết hợp câu phức (mệnh đề nguyên nhân/quan hệ/điều kiện).');
      if (!strengths.length) strengths.push('Đã hoàn thành trả lời bằng tiếng Anh với ' + wc + ' từ được ghi nhận.');

      var improvements = [];
      if (wc < (isFullExam ? 140 : 55)) improvements.push('Kéo dài câu trả lời thêm ý giải thích và 1 ví dụ cụ thể (hiện mới ghi nhận ' + wc + ' từ).');
      if (fillerRatio > 0.03) improvements.push('Giảm từ ngập ngừng ("like / um / uh", hiện có ' + metrics.fillerCount + ' lần); thay bằng "Well / To be honest".');
      if (repeatedWords.length) improvements.push('Tránh lặp lại nhiều lần các từ: ' + repeatedWords.map(function (w) { return '"' + w + '"'; }).join(', ') + ' — hãy paraphrase bằng từ đồng nghĩa.');
      if (structDiversity < 2) improvements.push('Tăng độ đa dạng ngữ pháp bằng cách thêm mệnh đề nhượng bộ (although / whereas) hoặc câu điều kiện (if... would).');
      if (!improvements.length) improvements.push('Duy trì độ ổn định này và nâng cấp thêm 1–2 collocation/idiom đắt giá cho Part 2 & Part 3.');
      if (evidence.required >= 3 && evidence.answered < evidence.required) {
        improvements.unshift('Bạn mới trả lời ' + evidence.answered + '/' + evidence.required + ' câu — bỏ câu trong phòng thi thật bị trừ nặng ở Fluency & Coherence.');
      }

      var summaryVi = 'Band ước lượng Offline: ' + overallBand.toFixed(1)
        + ' (' + wc + ' từ • ~' + metrics.wpm + ' WPM). '
        + (overallBand >= 7.0
          ? 'Nội dung triển khai tốt, mạch nối và vốn từ khá chắc; tối ưu thêm collocation C1 sẽ tiến tới 7.5–8.0.'
          : (overallBand >= 6.0
            ? 'Đáp ứng được giao tiếp cơ bản đến khá; cần mở rộng ví dụ, giảm lặp từ và thêm câu phức để vượt ngưỡng 6.5–7.0.'
            : (overallBand >= 4.5
              ? 'Câu trả lời còn ngắn hoặc thiếu liên kết; ưu tiên trả lời trọn 2–3 câu mỗi hỏi kèm lý do + ví dụ.'
              : 'Lượng lời nói quá ít để chứng minh năng lực — cần trả lời đầy đủ từng câu hỏi thì điểm mới phản ánh đúng trình độ.')));

      return {
        source: 'offline',
        model: 'offline-rubric-v2',
        hasTranscript: true,
        notRated: false,
        metrics: metrics,
        evidence: evidence,
        scores: { fc: fcScore, lr: lrScore, gra: graScore, pr: prScore },
        overallBand: overallBand,
        summaryVi: summaryVi,
        criteriaFeedback: {
          fc: 'Ghi nhận ' + wc + ' từ (~' + metrics.wpm + ' WPM), ' + metrics.connectorsUsed.length + ' từ nối, ' + metrics.fillerCount + ' từ đệm.',
          lr: 'Độ đa dạng từ gốc ~' + uniqueCnt + ' từ (chỉ số Guiraud ' + guiraud.toFixed(1) + '), dùng ' + metrics.usedTargets.length + '/' + metrics.targetTotal + ' từ vựng mục tiêu.',
          gra: 'Phát hiện ' + totalComplex + ' cấu trúc phức/mở rộng (' + gramSig.subCount + ' phụ thuộc, ' + gramSig.relCount + ' quan hệ, ' + gramSig.condCount + ' điều kiện/modal).' + (gramSig.fixes.length ? ' Cần rà soát ' + gramSig.fixes.length + ' lỗi diễn đạt.' : ''),
          pr: 'Ước lượng gián tiếp qua WPM (' + metrics.wpm + ') và độ rõ nhận diện STT (nếu cần điểm chuẩn, hãy nghe lại bản ghi âm).'
        },
        strengths: strengths.slice(0, 3),
        improvements: improvements.slice(0, 4),
        vocabUpgrades: vocabUpgrades,
        grammarFixes: grammarFixes,
        prEstimatedNote: 'Lưu ý: Chấm Offline ước lượng tiêu chí Pronunciation gián tiếp qua nhịp nói WPM & khả năng nhận diện văn bản (STT).',
        gradedAt: Date.now()
      };
    }

    function sanitizeStringArray(arr, maxLen, fallback) {
      var list = Array.isArray(arr)
        ? arr.map(function (x) { return String(x || '').replace(/\s+/g, ' ').trim(); }).filter(Boolean)
        : [];
      return (list.length ? list : (fallback || [])).slice(0, maxLen);
    }

    function parseGeminiGrade(rawText, offlineResult, opts) {
      var o = opts || {};
      var parsed = JSON.parse(PzAiExaminer.stripCodeFenceJson(rawText));
      if (!parsed || typeof parsed !== 'object' || !parsed.scores) {
        throw new Error('Invalid grading JSON payload');
      }
      var s = parsed.scores || {};
      var offS = offlineResult.scores;
      var evCaps = (offlineResult.evidence && offlineResult.evidence.caps) || { fc: 9, lr: 9, gra: 9, pr: 9 };
      var hasAudio = Boolean(o.hasRealAudio);
      var aiCapped = applyCaps({
        fc: clampIeltsBand(s.fc, offS.fc),
        lr: clampIeltsBand(s.lr, offS.lr),
        gra: clampIeltsBand(s.gra, offS.gra),
        pr: clampIeltsBand(s.pr, offS.pr)
      }, evCaps, hasAudio);
      var fc = aiCapped.fc;
      var lr = aiCapped.lr;
      var gra = aiCapped.gra;
      var pr = aiCapped.pr;
      var overallBand = roundIeltsBand((fc + lr + gra + pr) / 4);

      var cf = parsed.criteriaFeedback || {};
      var offCf = offlineResult.criteriaFeedback;
      var vocabUpgrades = Array.isArray(parsed.vocabUpgrades)
        ? parsed.vocabUpgrades.filter(function (v) { return v && (v.upgrade || v.from); }).slice(0, 5).map(function (v) {
          return {
            from: String(v.from || '').trim(),
            upgrade: String(v.upgrade || '').trim(),
            meaningVi: String(v.meaningVi || '').trim()
          };
        })
        : offlineResult.vocabUpgrades;

      var grammarFixes = Array.isArray(parsed.grammarFixes)
        ? parsed.grammarFixes.filter(function (g) { return g && (g.original || g.corrected); }).slice(0, 4).map(function (g) {
          return {
            original: String(g.original || '').trim(),
            corrected: String(g.corrected || '').trim(),
            noteVi: String(g.noteVi || '').trim()
          };
        })
        : offlineResult.grammarFixes;

      return {
        source: 'gemini',
        model: PzAiExaminer.normalizeModel(parsed.model || 'gemini-4-hydrogen'),
        hasTranscript: offlineResult.hasTranscript,
        hasRealAudio: hasAudio,
        notRated: false,
        metrics: offlineResult.metrics,
        evidence: offlineResult.evidence,
        scores: { fc: fc, lr: lr, gra: gra, pr: pr },
        overallBand: overallBand,
        summaryVi: String(parsed.summaryVi || offlineResult.summaryVi).replace(/\s+/g, ' ').trim(),
        criteriaFeedback: {
          fc: String(cf.fc || offCf.fc).trim(),
          lr: String(cf.lr || offCf.lr).trim(),
          gra: String(cf.gra || offCf.gra).trim(),
          pr: String(cf.pr || offCf.pr).trim()
        },
        strengths: sanitizeStringArray(parsed.strengths, 3, offlineResult.strengths),
        improvements: sanitizeStringArray(parsed.improvements, 4, offlineResult.improvements),
        vocabUpgrades: vocabUpgrades,
        grammarFixes: grammarFixes,
        prEstimatedNote: hasAudio
          ? '🎧 Tiêu chí Pronunciation đã được Gemini 4 Hydrogen chấm trực tiếp từ bản ghi âm giọng nói của bạn.'
          : String(parsed.prEstimatedNote || offlineResult.prEstimatedNote).trim(),
        gradedAt: Date.now()
      };
    }

    function resolveAudioInlinePart(payload) {
      var p = payload || {};
      var blobProm = p.audioBlob
        ? Promise.resolve(p.audioBlob)
        : (p.audioId ? AudioVault.getBlob(p.audioId) : Promise.resolve(null));
      return blobProm.then(function (blob) {
        return blob ? PzAiExaminer.blobToAudioInlineData(blob) : null;
      }).catch(function () { return null; });
    }

    /**
     * Tầng 2: Chấm điểm & nhận xét chuyên sâu qua gemini-4-hydrogen (thinkingLevel: 'medium').
     * Nếu có file thu âm thật (`audioId`/`audioBlob`), tự đính kèm audio để chấm trực tiếp Pronunciation.
     */
    function evaluateWithGemini(payload, opts) {
      var o = opts || {};
      var offlineResult = evaluateOffline(payload);
      var apiKey = String(o.apiKey || '').trim();
      if (!offlineResult.hasTranscript || !apiKey || typeof fetch !== 'function') {
        return Promise.resolve(offlineResult);
      }

      var p = payload || {};
      var model = PzAiExaminer.normalizeModel(o.model);
      var turnsCompact = Array.isArray(p.turns)
        ? p.turns.filter(function (t) { return t && !isWarmupTurn(t); }).slice(0, 20).map(function (t) {
          return {
            label: t.label || '',
            question: String(t.question || '').slice(0, 240),
            answer: String(t.transcript || '').trim().slice(0, 700) || '[NO ANSWER]',
            followUpQ: t.followUpQ ? String(t.followUpQ).slice(0, 200) : '',
            followUpAnswer: t.followUpTranscript ? String(t.followUpTranscript).slice(0, 450) : ''
          };
        })
        : [{ label: p.kind || 'Speaking Practice', question: String(p.questionText || '').slice(0, 300), answer: buildCombinedExamTranscript(p).slice(0, 1800) }];

      return resolveAudioInlinePart(p).then(function (audioPart) {
        var hasRealAudio = Boolean(audioPart);
        var ev = offlineResult.evidence || {};
        var prInstruction = hasRealAudio
          ? 'The candidate RAW AUDIO recording is attached! Listen closely to evaluate Pronunciation (PR) directly from phoneme clarity, word stress, sentence stress, intonation and connected speech — mention specific pronunciation observations in criteriaFeedback.pr.'
          : 'Because you evaluate transcript + WPM without raw audio, state honestly in criteriaFeedback.pr & prEstimatedNote that PR is an estimate inferred from pacing and speech recognition clarity, and keep PR within 0.5 of FC.';

        var systemPrompt = [
          'You are a Senior Certified IELTS Speaking Examiner grading a candidate fairly and strictly against the official IELTS public band descriptors (FC, LR, GRA, PR) on the full 1.0–9.0 scale in 0.5 steps.',
          'Calibration: Band 9 = fully fluent, precise, natural; Band 7 = speaks at length without noticeable effort, flexible vocabulary, frequent error-free complex sentences; Band 5 = keeps going but with repetition/self-correction, limited vocabulary, basic sentence forms; Band 4 = cannot respond without noticeable pauses, simple sentences, frequent errors; Band 3 = long pauses, very limited language, little communication; Band 2 = only isolated words; Band 1 = no rateable language.',
          'Evidence rules: grade ONLY what was actually spoken. Questions marked [NO ANSWER] count as unanswered and must lower FC (and overall). Very short or undeveloped answers cannot earn more than the evidenceCap provided. Never exceed evidenceCap. Do NOT penalize missing capitalization/punctuation artifacts from speech-to-text.',
          prInstruction,
          'Respond in strict JSON with exact keys:',
          '{"scores":{"fc":6.5,"lr":6.5,"gra":6.5,"pr":6.5},"summaryVi":"2-3 concise Vietnamese sentences","criteriaFeedback":{"fc":"Vietnamese feedback","lr":"Vietnamese feedback","gra":"Vietnamese feedback","pr":"Vietnamese feedback"},"strengths":["..."],"improvements":["..."],"vocabUpgrades":[{"from":"...","upgrade":"...","meaningVi":"..."}],"grammarFixes":[{"original":"...","corrected":"...","noteVi":"..."}],"prEstimatedNote":"..."}'
        ].join(' ');

        var userPrompt = JSON.stringify({
          testTitle: (p.lesson && p.lesson.title) || p.title || 'IELTS Speaking',
          mode: p.kind || 'pz',
          hasRealAudioAttached: hasRealAudio,
          evidence: {
            assessedWords: ev.assessedWords || offlineResult.metrics.wordCount,
            answeredQuestions: ev.answered || 0,
            requiredQuestions: ev.required || 0,
            part2Words: typeof ev.part2Words === 'number' ? ev.part2Words : -1,
            evidenceCap: ev.overallCap || 9.0
          },
          metrics: {
            wordCount: offlineResult.metrics.wordCount,
            wpm: offlineResult.metrics.wpm,
            fillers: offlineResult.metrics.fillerCount,
            usedTargetLexis: offlineResult.metrics.usedTargets.slice(0, 10)
          },
          targetSuggestions: (p.lesson ? collectTargetLexis(p.lesson) : (p.targetWords || [])).slice(0, 10),
          responses: turnsCompact
        });

        return PzAiExaminer.callGeminiJson({
          apiKey: apiKey,
          model: model,
          systemPrompt: systemPrompt,
          userPrompt: userPrompt,
          extraParts: audioPart ? [audioPart] : null,
          thinkingLevel: 'medium',
          maxOutputTokens: 2048,
          temperature: 0.35,
          timeoutMs: o.timeoutMs || 30000
        }).then(function (rawText) {
          return parseGeminiGrade(rawText, offlineResult, { hasRealAudio: hasRealAudio });
        });
      }).catch(function (err) {
        return Object.assign({}, offlineResult, {
          source: 'offline_fallback',
          fallbackReason: (err && err.message) ? err.message : 'fallback'
        });
      });
    }

    function formatFeedbackText(report) {
      if (!report) return '';
      var lines = [];
      var tag = report.source === 'gemini' ? '🤖 AI Examiner (gemini-4-hydrogen)' : '⚡ Tự chấm Offline';
      lines.push('[' + tag + ' · ' + (report.notRated ? 'CHƯA CHẤM' : 'Overall ' + Number(report.overallBand || 0).toFixed(1)) + ']');
      if (report.summaryVi) lines.push(report.summaryVi);
      if (report.evidence && report.evidence.reasons && report.evidence.reasons.length && !report.notRated) {
        lines.push('📏 Giới hạn theo bằng chứng: ' + report.evidence.reasons.join(' | '));
      }
      if (report.strengths && report.strengths.length) {
        lines.push('✓ Điểm mạnh: ' + report.strengths.join(' | '));
      }
      if (report.improvements && report.improvements.length) {
        lines.push('➜ Cần cải thiện: ' + report.improvements.join(' | '));
      }
      if (report.vocabUpgrades && report.vocabUpgrades.length) {
        lines.push('💎 Nâng cấp từ vựng: ' + report.vocabUpgrades.slice(0, 3).map(function (v) {
          return (v.from ? v.from + ' → ' : '') + v.upgrade + (v.meaningVi ? ' (' + v.meaningVi + ')' : '');
        }).join('; '));
      }
      if (report.grammarFixes && report.grammarFixes.length) {
        lines.push('🔧 Gợi ý ngữ pháp: ' + report.grammarFixes.slice(0, 2).map(function (g) {
          return g.original + ' → ' + g.corrected;
        }).join('; '));
      }
      return lines.join('\n');
    }

    return {
      clampIeltsBand: clampIeltsBand,
      computeEvidence: computeEvidence,
      evaluateOffline: evaluateOffline,
      evaluateWithGemini: evaluateWithGemini,
      parseGeminiGrade: parseGeminiGrade,
      formatFeedbackText: formatFeedbackText
    };
  })();

  global.SpeakingGrader = SpeakingGrader;

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
    syncPzLobbyDialogueUi();
    syncPzLobbyEnvBanner();

    renderLobbyHistory();
  }

  function syncPzLobbyDialogueUi() {
    var modeSel = document.getElementById('pzDialogueModeSelect');
    var styleSel = document.getElementById('pzExaminerStyleSelect');
    var modelSel = document.getElementById('pzGeminiModelSelect');
    var keyInput = document.getElementById('pzGeminiKeyInput');
    var autoMicChk = document.getElementById('pzAutoMicCheck');
    var byokBox = document.getElementById('pzGeminiByokBox');
    var statusEl = document.getElementById('pzGeminiTestStatus');

    var mode = prefs.pzDialogueMode || 'offline';
    if (modeSel) modeSel.value = mode;
    prefs.pzExaminerStyle = PzDialogueEngine.normalizeStyle(prefs.pzExaminerStyle);
    if (styleSel) styleSel.value = prefs.pzExaminerStyle;
    prefs.pzGeminiModel = PzAiExaminer.normalizeModel(prefs.pzGeminiModel);
    if (modelSel) modelSel.value = prefs.pzGeminiModel;
    if (autoMicChk) autoMicChk.checked = Boolean(prefs.pzAutoMic);
    var storedKey = getStoredGeminiKey();
    if (keyInput && document.activeElement !== keyInput) {
      keyInput.value = storedKey;
    }
    if (byokBox) {
      byokBox.style.display = mode === 'gemini_hybrid' ? 'flex' : 'none';
    }
    if (statusEl && mode === 'gemini_hybrid' && !statusEl.dataset.tested) {
      statusEl.textContent = storedKey
        ? '🔑 Đã lưu API Key cục bộ trên máy. Có thể bấm "Thử kết nối AI" hoặc vào thi ngay.'
        : '⚠️ Chưa có API Key — nếu vào thi ngay, phòng thi sẽ tự chạy bằng Tầng 1 Offline.';
    }
  }

  global.togglePzGeminiKeyVisibility = function () {
    var inp = document.getElementById('pzGeminiKeyInput');
    var btn = document.getElementById('btnToggleGeminiKeyVis');
    if (!inp) return;
    var show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    if (btn) btn.textContent = show ? '🙈' : '👁️';
  };

  global.clearPzGeminiKey = function () {
    setStoredGeminiKey('');
    var inp = document.getElementById('pzGeminiKeyInput');
    var statusEl = document.getElementById('pzGeminiTestStatus');
    if (inp) inp.value = '';
    if (statusEl) {
      delete statusEl.dataset.tested;
      statusEl.style.color = 'var(--muted)';
      statusEl.textContent = '🗑️ Đã xoá API Key khỏi trình duyệt.';
    }
    showToast('Đã xoá Gemini API Key khỏi máy.', 'info');
  };

  global.testPzGeminiConnection = function () {
    var inp = document.getElementById('pzGeminiKeyInput');
    var modelSel = document.getElementById('pzGeminiModelSelect');
    var statusEl = document.getElementById('pzGeminiTestStatus');
    var rawKey = (inp ? inp.value : getStoredGeminiKey()).trim();
    if (inp && rawKey) setStoredGeminiKey(rawKey);
    var model = PzAiExaminer.normalizeModel(modelSel ? modelSel.value : prefs.pzGeminiModel);

    if (statusEl) {
      statusEl.dataset.tested = '1';
      statusEl.style.color = 'var(--muted)';
      statusEl.textContent = '⏳ Đang kiểm tra kết nối Gemini (' + model + ')...';
    }
    PzAiExaminer.testConnection({ apiKey: rawKey, model: model }).then(function (res) {
      if (!statusEl) return;
      if (res.ok) {
        statusEl.style.color = 'var(--hl-green)';
        statusEl.textContent = '✅ Kết nối Gemini thành công (' + res.model + ')! Sẵn sàng đối đáp AI 2 phía.';
        showToast('Kết nối Gemini API thành công!', 'success');
      } else {
        statusEl.style.color = 'var(--sp-accent-rose)';
        statusEl.textContent = '⚠️ Chưa kết nối được (' + res.error + ') — phòng thi vẫn chạy mượt ở Tầng 1 Offline.';
      }
    });
  };

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
      var bandChip = (m.notRated || isScoreUnrated(m.overallBand)) ? 'Chưa chấm' : ('Band ' + Number(m.overallBand).toFixed(1));
      return '<div class="sp-history-item">'
        + '  <div><strong>' + escHtml(m.title) + '</strong><div style="font-size:12px;color:var(--muted);">' + dateStr + ' • ~' + (m.wpm || 0) + ' WPM • ' + (m.wordCount || 0) + ' từ</div></div>'
        + '  <div style="display:flex;align-items:center;gap:8px;">'
        + '    <span class="sp-lobby-chip is-exam">' + bandChip + '</span>'
        + '    <button type="button" class="mini-btn" onclick="window._spViewSubmissionDetail(\'' + escHtml(m.id) + '\')">Xem chi tiết</button>'
        + '  </div>'
        + '</div>';
    }).join('');
  }

  global.runLobbyMicCheck = function () {
    MicEngine.resetSticky();
    syncPzLobbyEnvBanner();
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
    var autoMicChk = document.getElementById('pzAutoMicCheck');
    var dModeSel = document.getElementById('pzDialogueModeSelect');
    var styleSel = document.getElementById('pzExaminerStyleSelect');
    var gModelSel = document.getElementById('pzGeminiModelSelect');
    var gKeyInp = document.getElementById('pzGeminiKeyInput');

    prefs.pzStrictness = strictSel ? strictSel.value : prefs.pzStrictness;
    prefs.voiceAccent = voiceSel ? voiceSel.value : (lesson.examinerDefaultVoice || prefs.voiceAccent);
    prefs.pzStrictTimers = timerChk ? timerChk.checked : true;
    prefs.pzAutoMic = autoMicChk ? autoMicChk.checked : Boolean(prefs.pzAutoMic);
    prefs.pzDialogueMode = dModeSel ? dModeSel.value : (prefs.pzDialogueMode || 'offline');
    prefs.pzExaminerStyle = PzDialogueEngine.normalizeStyle(styleSel ? styleSel.value : prefs.pzExaminerStyle);
    prefs.pzGeminiModel = PzAiExaminer.normalizeModel(gModelSel ? gModelSel.value : prefs.pzGeminiModel);
    if (gKeyInp && gKeyInp.value.trim()) setStoredGeminiKey(gKeyInp.value.trim());
    savePrefs();

    var sessionSeed = Date.now() % 9973;
    var resolvedStyle = PzDialogueEngine.resolveSessionStyle(prefs.pzExaminerStyle, sessionSeed, { advanceCycle: true });

    pzExam = {
      active: true,
      lesson: lesson,
      strictness: prefs.pzStrictness,
      strictTimers: prefs.pzStrictTimers,
      voiceLang: prefs.voiceAccent,
      peekVisible: prefs.pzStrictness === 'guided',
      phase: 'warmup',
      subStage: 'ready',
      warmupStep: 0,
      candidateName: '',
      stepIndex: 0,
      p2PrepLeft: 60,
      p2TalkElapsed: 0,
      rephraseShown: false,
      activeRephraseText: '',
      activeFollowUpQ: '',
      activeWarmupIdPrompt: '',
      lastExaminerReaction: '',
      lastFollowUpBridge: '',
      clarifyShown: false,
      clarifyText: '',
      clarifyCount: 0,
      rephraseCount: 0,
      repeatCount: 0,
      followUpCount: 0,
      aiThinking: false,
      autoMic: Boolean(prefs.pzAutoMic),
      feedCollapsed: false,
      dialogueMode: prefs.pzDialogueMode || 'offline',
      examinerStyle: prefs.pzExaminerStyle,
      resolvedStyle: resolvedStyle,
      styleSeed: sessionSeed,
      usedTemplates: [],
      lastReactionSource: '',
      examinerSpeaking: false,
      timerId: null,
      turnElapsedSec: 0,
      startedAt: Date.now(),
      prepNote: '',
      dialogueHistory: [],
      responses: [],
      reportScores: { fc: 0, lr: 0, gra: 0, pr: 0 },
      reportFeedback: '',
      reportFeedbackAuto: false,
      autoGrade: null,
      scoreSource: '',
      gradingBusy: false,
      autoGeminiTriggered: false,
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

  function exLine(text, kind, tag, source) {
    if (!text) return null;
    return { text: String(text), kind: kind || 'speech', tag: tag || '', source: source || '' };
  }

  function isAnswerableDialoguePhase(phase) {
    return phase === 'warmup' || phase === 'part1' || phase === 'part2_round' || phase === 'part3';
  }

  function recordPzDialogueEntry(role, kind, text, tag, meta) {
    var clean = String(text || '').trim();
    if (!clean) return;
    var m = meta || {};
    pzExam.dialogueHistory.push({
      role: role,
      kind: kind || 'turn',
      phase: pzExam.phase,
      text: clean,
      tag: tag || '',
      source: m.source || '',
      hideInStrict: Boolean(role === 'examiner' && pzExam.phase !== 'warmup'),
      ts: Date.now()
    });
    if (pzExam.dialogueHistory.length > 140) {
      pzExam.dialogueHistory = pzExam.dialogueHistory.slice(-140);
    }
  }

  function speakExaminerLines(lines, onComplete) {
    var cleanLines = (lines || []).filter(Boolean);
    var sessionStamp = pzExam.startedAt;
    cleanLines.forEach(function (ln) {
      if (typeof ln === 'object') {
        recordPzDialogueEntry('examiner', ln.kind || 'speech', ln.text, ln.tag || '', { source: ln.source || '' });
      } else {
        recordPzDialogueEntry('examiner', 'speech', ln);
      }
    });
    pzExam.examinerSpeaking = true;
    renderPzStage();
    TtsEngine.speakSequence(cleanLines, {
      lang: pzExam.voiceLang,
      rate: 0.96,
      onEnd: function () {
        if (!pzExam.active || pzExam.startedAt !== sessionStamp) return;
        pzExam.examinerSpeaking = false;
        renderPzStage();
        if (onComplete) {
          onComplete();
          return;
        }
        if (pzExam.autoMic && !pzExam.aiThinking && isAnswerableDialoguePhase(pzExam.phase) && !MicEngine.isActive()) {
          setTimeout(function () {
            if (
              pzExam.active
              && pzExam.startedAt === sessionStamp
              && pzExam.autoMic
              && !pzExam.examinerSpeaking
              && !pzExam.aiThinking
              && !MicEngine.isActive()
              && isAnswerableDialoguePhase(pzExam.phase)
            ) {
              global._spPzToggleTurnMic(true);
            }
          }, 240);
        }
      }
    });
  }

  function enterPzPhase(phase, stepIndex, opts) {
    clearPzTimer();
    var o = opts || {};
    pzExam.phase = phase;
    pzExam.stepIndex = stepIndex || 0;
    pzExam.subStage = 'ready';
    pzExam.turnElapsedSec = 0;
    pzExam.rephraseShown = false;
    pzExam.activeRephraseText = '';
    pzExam.activeFollowUpQ = '';
    pzExam.clarifyShown = false;
    pzExam.clarifyText = '';
    pzExam.lastExaminerReaction = o.bridgeLine || '';
    pzExam.lastReactionSource = o.reactionSource || '';
    if (phase === 'warmup' && !o.keepWarmupStep) {
      pzExam.warmupStep = 0;
    }
    updatePzHeaderChrome();

    var L = pzExam.lesson;
    if (!L) return;
    var bridgeTag = o.reactionSource === 'gemini' ? '🤖 Phản hồi AI' : '⚡ Phản hồi';
    var scriptCtx = {
      style: pzExam.resolvedStyle,
      seed: (pzExam.styleSeed || 0) + (pzExam.stepIndex || 0),
      usedTemplates: pzExam.usedTemplates,
      examinerName: (L.examinerPersona && L.examinerPersona.name) || ''
    };

    if (phase === 'warmup') {
      setPzTimerText('ID Check');
      var w = L.warmup || {};
      var idPrompt = PzDialogueEngine.getPhaseScript('warmup_id', Object.assign({}, scriptCtx, {
        fallback: w.idCheckScript || 'Good day. Can you tell me your full name please? Could I see your ID?'
      }));
      pzExam.activeWarmupIdPrompt = idPrompt;
      speakExaminerLines([exLine(idPrompt, 'question', 'ID Check')]);
    } else if (phase === 'part1') {
      var p1Qs = getCurrentPzP1Questions(L);
      var q = p1Qs[pzExam.stepIndex];
      if (!q) {
        if (L.part2 && L.part2.prompt) enterPzPhase('part2_prep', 0, o);
        else finishPzExamToReport();
        return;
      }
      setPzTimerText('P1 · ' + (pzExam.stepIndex + 1) + '/' + p1Qs.length);
      var lines = [];
      if (o.bridgeLine) lines.push(exLine(o.bridgeLine, 'reaction', bridgeTag, o.reactionSource));
      if (pzExam.stepIndex === 0) {
        var p1Intro = PzDialogueEngine.getPhaseScript('part1_intro', Object.assign({}, scriptCtx, {
          topicTitle: (L.part1 && L.part1.topic1Title) || '',
          fallback: (L.part1 && L.part1.intro) || 'Now in this first part, let us talk about some everyday topics.'
        }));
        lines.push(exLine(p1Intro, 'intro', 'Dẫn nhập'));
      } else if (q.isFirstOfTopicB && L.part1) {
        var p1Trans = PzDialogueEngine.getPhaseScript('part1_transition', Object.assign({}, scriptCtx, {
          topicTitle: L.part1.topic2Title || '',
          fallback: L.part1.transition || 'Thank you. Let us move on to another topic.'
        }));
        lines.push(exLine(p1Trans, 'intro', 'Chuyển chủ đề'));
      }
      lines.push(exLine(q.q, 'question', 'Câu hỏi Part 1'));
      speakExaminerLines(lines);
    } else if (phase === 'part2_prep') {
      if (!L.part2 || !L.part2.prompt) {
        if (L.part3 && Array.isArray(L.part3.questions) && L.part3.questions.length) enterPzPhase('part3', 0, o);
        else finishPzExamToReport();
        return;
      }
      pzExam.p2PrepLeft = (L.part2 && L.part2.prepSeconds) || 60;
      setPzTimerText(formatSec(pzExam.p2PrepLeft), 'warn');
      var introP2 = PzDialogueEngine.getPhaseScript('part2_intro', Object.assign({}, scriptCtx, {
        fallback: (L.part2 && L.part2.intro) || 'Now I am going to give you a topic and you have one minute to prepare.'
      }));
      var p2Lines = [];
      if (o.bridgeLine) p2Lines.push(exLine(o.bridgeLine, 'reaction', bridgeTag, o.reactionSource));
      p2Lines.push(exLine(introP2, 'intro', 'Part 2 Cue Card'));
      speakExaminerLines(p2Lines, function () {
        if (pzExam.phase !== 'part2_prep') return;
        startP2PrepCountdown();
      });
    } else if (phase === 'part2_talk') {
      pzExam.p2TalkElapsed = 0;
      setPzTimerText('00:00 / 02:00');
      pzExam.subStage = 'examiner_speaking';
      renderPzStage();
      var cueScript = PzDialogueEngine.getPhaseScript('part2_prep_end', Object.assign({}, scriptCtx, {
        fallback: (L.part2 && L.part2.prepEndScript) || 'All right? Remember you have one to two minutes for this. Can you start speaking now, please?'
      }));
      speakExaminerLines([exLine(cueScript, 'intro', 'Bắt đầu Part 2')], function () {
        if (pzExam.phase !== 'part2_talk') return;
        startP2TalkRecording();
      });
    } else if (phase === 'part2_round') {
      setPzTimerText('Rounding');
      var roQ = o.roundingIntro || (L.part2 && L.part2.roundingOffQ) || 'Do you still think about this experience today?';
      speakExaminerLines([exLine(roQ, 'question', 'Rounding-off', o.reactionSource)]);
    } else if (phase === 'part3') {
      var p3Qs = (L.part3 && L.part3.questions) || [];
      var p3q = p3Qs[pzExam.stepIndex];
      if (!p3q) { finishPzExamToReport(); return; }
      setPzTimerText('P3 · ' + (pzExam.stepIndex + 1) + '/' + p3Qs.length);
      var p3Lines = [];
      if (o.bridgeLine) p3Lines.push(exLine(o.bridgeLine, 'reaction', bridgeTag, o.reactionSource));
      if (pzExam.stepIndex === 0) {
        var p3Intro = PzDialogueEngine.getPhaseScript('part3_intro', Object.assign({}, scriptCtx, {
          topicTitle: (L.part3 && L.part3.topicTitle) || (L.part2 && L.part2.cueTitle) || '',
          fallback: (L.part3 && L.part3.intro) || 'Now let us discuss some more general questions.'
        }));
        p3Lines.push(exLine(p3Intro, 'intro', 'Dẫn nhập Part 3'));
      }
      p3Lines.push(exLine(p3q.q, 'question', 'Câu hỏi Part 3'));
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
    var sessionStartedAt = pzExam.startedAt;
    MicEngine.stop().then(function () {
      if (!pzExam.active || pzExam.startedAt !== sessionStartedAt) return;
      var stopLine = PzDialogueEngine.getPhaseScript('part2_stop', {
        style: pzExam.resolvedStyle,
        seed: pzExam.styleSeed || 0,
        usedTemplates: pzExam.usedTemplates,
        fallback: (pzExam.lesson.part2 && pzExam.lesson.part2.stopScript) || 'Thank you very much. I will stop you there.'
      });
      pzExam.lastStopLine = stopLine;
      var p2Slot = ensurePzResponseSlot('part2_long', 'Part 2 Long Turn', (pzExam.lesson.part2 && pzExam.lesson.part2.prompt) || '');
      var offlinePart2 = PzDialogueEngine.buildPart2StopReaction({
        transcript: p2Slot.transcript,
        stopScript: stopLine,
        roundingOffQ: pzExam.lesson.part2 && pzExam.lesson.part2.roundingOffQ,
        candidateName: pzExam.candidateName,
        style: pzExam.resolvedStyle,
        seed: pzExam.styleSeed || 0,
        usedTemplates: pzExam.usedTemplates
      });
      var hasHybridAi = pzExam.dialogueMode === 'gemini_hybrid' && Boolean(getStoredGeminiKey());
      var reactionPromise = hasHybridAi
        ? PzAiExaminer.buildPart2StopReactionHybrid({
          mode: pzExam.dialogueMode,
          apiKey: getStoredGeminiKey(),
          model: prefs.pzGeminiModel,
          style: pzExam.resolvedStyle,
          sessionSeed: pzExam.styleSeed || 0,
          transcript: p2Slot.transcript,
          prompt: (pzExam.lesson.part2 && pzExam.lesson.part2.prompt) || '',
          stopScript: stopLine,
          roundingOffQ: pzExam.lesson.part2 && pzExam.lesson.part2.roundingOffQ,
          candidateName: pzExam.candidateName
        }, offlinePart2)
        : Promise.resolve(Object.assign({}, offlinePart2, { source: 'offline' }));

      setPzTimerText('Thank you', 'warn');
      if (hasHybridAi) {
        pzExam.aiThinking = true;
        renderPzStage();
      } else {
        pzExam.aiThinking = false;
      }
      reactionPromise.then(function (reaction) {
        pzExam.aiThinking = false;
        if (!pzExam.active || pzExam.startedAt !== sessionStartedAt) return;
        speakExaminerLines(tagSpokenLines(reaction.stopLines, 'transition', 'Chuyển Part 2', reaction.source || 'offline'), function () {
          if (!pzExam.active || pzExam.startedAt !== sessionStartedAt) return;
          enterPzPhase('part2_round', 0, {
            roundingIntro: reaction.roundingIntro,
            reactionSource: reaction.source || 'offline'
          });
        });
      });
    });
  }

  function finishPzExamToReport(closingBridge) {
    if (pzExam.subStage === 'finishing_report') return;
    pzExam.subStage = 'finishing_report';
    clearPzTimer();
    var closeLine = PzDialogueEngine.getPhaseScript('exam_closing', {
      style: pzExam.resolvedStyle,
      seed: pzExam.styleSeed || 0,
      usedTemplates: pzExam.usedTemplates,
      fallback: (pzExam.lesson.part3 && pzExam.lesson.part3.closingScript) || 'Thank you very much. That is the end of the Speaking test.'
    });
    var src = pzExam.lastReactionSource || 'offline';
    var reactTag = src === 'gemini' ? '🤖 Phản hồi' : '⚡ Phản hồi';
    var lines = [];
    if (closingBridge) lines.push(exLine(closingBridge, 'reaction', reactTag, src));
    lines.push(exLine(closeLine, 'closing', 'Kết thúc', src));
    speakExaminerLines(lines, function () {
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
      usedRepeat: false,
      usedClarify: false,
      followUpAsked: false,
      followUpQ: '',
      followUpTranscript: '',
      followUpDurationSec: 0,
      followUpWpm: 0,
      followUpAudioId: null,
      followUpAudioUrl: '',
      nudgeUsed: false,
      examinerReaction: ''
    };
    pzExam.responses.push(slot);
    return slot;
  }

  function getPzActiveTurnFields(slot) {
    var isFu = Boolean(pzExam.activeFollowUpQ && pzExam.phase !== 'warmup' && pzExam.phase !== 'part2_talk');
    return {
      isFollowUp: isFu,
      getTranscript: function () { return isFu ? (slot.followUpTranscript || '') : (slot.transcript || ''); },
      setTranscript: function (v) { if (isFu) slot.followUpTranscript = v; else slot.transcript = v; },
      setMetrics: function (sec, wpm) {
        if (isFu) { slot.followUpDurationSec = sec; slot.followUpWpm = wpm; }
        else { slot.durationSec = sec; slot.wpm = wpm; }
      },
      getDuration: function () { return isFu ? (slot.followUpDurationSec || 0) : (slot.durationSec || 0); },
      setAudio: function (id, url) {
        if (isFu) { slot.followUpAudioId = id; slot.followUpAudioUrl = url; }
        else { slot.audioId = id; slot.audioUrl = url; }
      },
      getAudioUrl: function () { return isFu ? (slot.followUpAudioUrl || '') : (slot.audioUrl || ''); }
    };
  }

  function getActivePzQuestionMeta() {
    var L = pzExam.lesson;
    if (!L) return null;
    if (pzExam.phase === 'warmup') {
      if (pzExam.warmupStep >= 1) {
        return {
          key: 'warmup_chat',
          label: 'Warm-up · Personal Chat',
          qText: pzExam.activeFollowUpQ || 'Where are you from, and do you currently work or study?',
          rephraseText: ''
        };
      }
      return {
        key: 'warmup_id',
        label: 'Warm-up ID Check',
        qText: pzExam.activeWarmupIdPrompt || (L.warmup && L.warmup.idCheckScript) || 'Can you tell me your full name and show your ID?',
        rephraseText: ''
      };
    }
    if (pzExam.phase === 'part1') {
      var p1 = getCurrentPzP1Questions(L);
      var q1 = p1[pzExam.stepIndex];
      return q1 ? {
        key: 'p1_' + pzExam.stepIndex,
        label: q1.qNumLabel,
        topicTitle: (q1.partLabel || '').replace(/^Part\s+\d+\s*[•·\-]\s*Topic\s+[AB]:\s*/i, '').trim(),
        qText: q1.q,
        rephraseText: q1.rephraseQ || ''
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
        topicTitle: (L.part3 && L.part3.topicTitle) || (L.part2 && L.part2.title) || '',
        qText: q3.q,
        rephraseText: q3.rephraseQ || ''
      } : null;
    }
    return null;
  }

  function renderExaminerHeaderPanel(phaseTag, badgeCls, statusMsg) {
    var persona = (pzExam.lesson && pzExam.lesson.examinerPersona) || { name: 'Examiner', accent: 'UK' };
    var styleProf = PzDialogueEngine.getStyleProfile(pzExam.resolvedStyle, pzExam.styleSeed || 0);
    var stylePill = '<span class="sp-tag-pill" style="margin-left:6px;">' + escHtml(styleProf.shortTag) + '</span>';
    return '<div class="sp-examiner-panel">'
      + '  <div class="sp-examiner-id">'
      + '    <div class="sp-examiner-avatar' + (pzExam.examinerSpeaking ? ' is-speaking' : '') + '">🎙️</div>'
      + '    <div>'
      + '      <strong>' + escHtml(persona.name) + ' · ' + escHtml(persona.accent) + ' IELTS Examiner' + stylePill + '</strong>'
      + '      <div style="font-size:12.5px;color:var(--muted);">' + (pzExam.examinerSpeaking ? '🔊 Giám khảo đang nói câu hỏi...' : escHtml(statusMsg)) + '</div>'
      + '    </div>'
      + '  </div>'
      + '  <span class="sp-phase-badge ' + badgeCls + '">' + escHtml(phaseTag) + '</span>'
      + '</div>';
  }

  function renderPzDialogueFeedHtml(showText) {
    var list = pzExam.dialogueHistory || [];
    if (!list.length) return '';
    var rowsHtml = list.map(function (entry) {
      var isEx = entry.role === 'examiner';
      var who = isEx ? '🎙️ Examiner' : ('🗣️ ' + (pzExam.candidateName || 'Bạn'));
      var masked = isEx && entry.hideInStrict && !showText;
      var bodyHtml = masked
        ? '<span class="sp-chat-masked">🎧 [Lượt nói Giám khảo đang ẩn ở chế độ Thi thật — bấm "👁️ Hiện chữ" để xem]</span>'
        : escHtml(entry.text);
      return '<div class="sp-chat-row ' + (isEx ? 'is-examiner' : 'is-candidate') + '">'
        + '  <div class="sp-chat-meta"><strong>' + escHtml(who) + '</strong>' + (entry.tag ? '<span class="sp-chat-kind-tag">' + escHtml(entry.tag) + '</span>' : '') + '</div>'
        + '  <div class="sp-chat-bubble">' + bodyHtml + '</div>'
        + '</div>';
    }).join('');

    return '<div class="sp-dialogue-feed-wrap">'
      + '  <div class="sp-dialogue-feed-head">'
      + '    <span>💬 Nhật ký Hội thoại 2 Phía (' + list.length + ' lượt)</span>'
      + '    <button type="button" class="mini-btn" style="padding:2px 8px;font-size:11px;" onclick="window._spPzToggleDialogueFeed()">' + (pzExam.feedCollapsed ? '▼ Mở rộng' : '▲ Thu gọn') + '</button>'
      + '  </div>'
      + (pzExam.feedCollapsed ? '' : '<div id="pzDialogueFeedList" class="sp-dialogue-feed-list">' + rowsHtml + '</div>')
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
    var activeTurn = getPzActiveTurnFields(slot);
    var activeTranscript = activeTurn.getTranscript();
    var activeAudioUrl = activeTurn.getAudioUrl();
    var activeQPrompt = activeTurn.isFollowUp ? pzExam.activeFollowUpQ : meta.qText;
    var micBusy = MicEngine.isActive();

    var showText = pzExam.strictness === 'guided' || pzExam.peekVisible || pzExam.phase === 'warmup';
    var badgeCls = pzExam.phase === 'warmup' ? 'is-warmup' : (pzExam.phase === 'part1' ? 'is-p1' : (pzExam.phase === 'part2_round' ? 'is-p2' : 'is-p3'));

    var curtainContent = showText
      ? '<div style="font-size:18px;font-weight:800;color:var(--text);line-height:1.45;">'
        + (activeTurn.isFollowUp ? '<div style="font-size:11.5px;font-weight:800;color:#059669;margin-bottom:4px;text-transform:uppercase;">💬 Giám khảo hỏi đào sâu (Follow-up)</div>' : '')
        + escHtml(activeQPrompt)
        + '</div>'
      : '<div class="sp-curtain-blurred" aria-hidden="true">' + escHtml(activeQPrompt) + '</div><div style="font-size:13px;font-weight:700;color:var(--muted);">🎧 Chế độ Thi Thật đang ẩn câu hỏi — Lắng nghe Giám khảo hoặc dùng nút Repeat / Hiện chữ ở góc trên</div>';

    var reactionBanner = '';
    if (pzExam.lastExaminerReaction) {
      var srcBadge = pzExam.lastReactionSource === 'gemini'
        ? '<span class="sp-tag-pill" style="margin-left:6px;background:rgba(16,185,129,0.16);color:#10b981;">🤖 AI Examiner</span>'
        : '<span class="sp-tag-pill" style="margin-left:6px;">⚡ Offline 2 chiều</span>';
      reactionBanner = showText
        ? '<div class="sp-rephrase-box" style="border-color:rgba(16,185,129,0.35);">🎙️ <b>Phản hồi của Giám khảo:</b> ' + escHtml(pzExam.lastExaminerReaction) + srcBadge + '</div>'
        : '<div class="sp-rephrase-box" style="border-color:rgba(16,185,129,0.35);">🎙️ Giám khảo vừa phản hồi trực tiếp nội dung bạn nói (bấm Hiện chữ nếu muốn xem text).' + srcBadge + '</div>';
    }

    var rephraseBanner = '';
    var shownRephrase = pzExam.activeRephraseText || meta.rephraseText;
    if (meta.rephraseText && pzExam.rephraseShown) {
      if (showText && shownRephrase) {
        rephraseBanner = '<div class="sp-rephrase-box">🔄 <b>Giám khảo diễn đạt lại:</b> ' + escHtml(shownRephrase) + '</div>';
      } else {
        rephraseBanner = '<div class="sp-rephrase-box">🔄 Giám khảo đang đọc câu diễn đạt lại bằng âm thanh...</div>';
      }
    }

    var clarifyBanner = '';
    if (pzExam.clarifyShown && pzExam.clarifyText) {
      clarifyBanner = showText
        ? '<div class="sp-clarify-box">💡 <b>Giám khảo làm rõ / Gợi ý góc nhìn:</b> ' + escHtml(pzExam.clarifyText) + '</div>'
        : '<div class="sp-clarify-box">💡 Giám khảo đang giải thích góc nhìn trả lời bằng âm thanh...</div>';
    }

    var isInterviewPhase = pzExam.phase === 'part1' || pzExam.phase === 'part3';
    var rephraseBtn = (isInterviewPhase && meta.rephraseText)
      ? '<button type="button" class="btn mini-btn" onclick="window._spPzRephrase()">🔄 "Could you rephrase that?"</button>'
      : '';
    var clarifyBtn = isInterviewPhase
      ? '<button type="button" class="btn mini-btn" onclick="window._spPzClarify()"' + (pzExam.aiThinking ? ' disabled' : '') + '>💡 "Could you clarify?"</button>'
      : '';

    var nextLabel = pzExam.phase === 'warmup'
      ? (pzExam.warmupStep === 0 ? '✓ Trả lời xong tên/ID ➜ Tiếp tục chào hỏi' : '✓ Xác nhận xong Warm-up ➜ Vào Part 1')
      : (activeTurn.isFollowUp
        ? '✓ Trả lời xong câu hỏi nối — Tiếp tục ➜'
        : (pzExam.phase === 'part2_round' ? '✓ Nói xong — Phản hồi & sang Part 3 ➜' : '✓ Nói xong — Giám khảo phản hồi ➜'));

    var stageStatus = pzExam.aiThinking
      ? '🤖 AI Examiner đang lắng nghe & phản hồi câu trả lời của bạn...'
      : (micBusy ? '🎙️ Đang ghi âm câu trả lời của bạn...' : 'Nhấn Micro để trả lời trực tiếp, hoặc nói/nhấn Repeat / Rephrase / Clarify');

    var advBusy = pzExam.aiThinking || pzExam.subStage === 'finishing_report';
    var advLabel = pzExam.aiThinking
      ? '🤖 Đang chờ AI phản hồi...'
      : (pzExam.subStage === 'finishing_report' ? '🏁 Đang tổng kết bài thi...' : nextLabel);

    stage.innerHTML = ''
      + '<div class="sp-exam-chamber">'
      + renderExaminerHeaderPanel(meta.label, badgeCls, stageStatus)
      + reactionBanner
      + '  <div class="sp-audio-curtain">'
      + curtainContent
      + '    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:4px;">'
      + '      <button type="button" class="btn mini-btn" onclick="window._spPzRepeatQuestion()">🔁 Repeat Question</button>'
      + rephraseBtn
      + clarifyBtn
      + '    </div>'
      + '  </div>'
      + rephraseBanner
      + clarifyBanner
      + renderSttEnvBannerHtml()
      + '  <div class="sp-mic-stage">'
      + '    <button type="button" class="s4-mic-btn' + (micBusy ? ' is-recording' : '') + '" onclick="window._spPzToggleTurnMic()">' + (micBusy ? '⏹' : '🎙️') + '</button>'
      + '    <strong>' + (micBusy ? 'Đang thu âm (' + formatSec(pzExam.turnElapsedSec) + ') — Nhấn để dừng khi xong' : (activeTurn.isFollowUp ? 'Bấm Micro để trả lời câu hỏi vặn thêm của Giám khảo' : 'Bấm Micro để trả lời câu hỏi này')) + '</strong>'
      + '    <div id="pzExamWaveRow" class="sp-wave-bars" style="display:' + (micBusy ? 'flex' : 'none') + ';">' + buildWaveBarsHtml(18) + '</div>'
      + '  </div>'
      + '  <div class="sp-handsfree-bar">'
      + '    <button type="button" class="sp-handsfree-pill' + (pzExam.autoMic ? ' is-active' : '') + '" onclick="window._spPzToggleAutoMic()">' + (pzExam.autoMic ? '⚡ Auto-Mic Rảnh tay: ĐANG BẬT' : '🎙️ Bật Auto-Mic Rảnh tay') + '</button>'
      + '    <span class="sp-voice-cmd-tip">🗣️ Lệnh thoại tự nhiên: nói <em>"Could you repeat/rephrase that?"</em> ngay trong Mic</span>'
      + '  </div>'
      + (activeAudioUrl ? '<div class="sp-saved-audio-bar"><span>🎧 Đã ghi âm lượt này:</span><audio controls src="' + activeAudioUrl + '" style="flex:1;height:34px;"></audio></div>' : '')
      + '  <textarea id="pzCandidateTranscriptInput" class="sp-transcript-fallback" rows="3" placeholder="Transcript câu trả lời hiện trực tiếp tại đây (hoặc gõ/dán nội dung nếu không dùng Mic)..." oninput="window._spPzUpdateTranscript(this.value)">' + escHtml(activeTranscript) + '</textarea>'
      + '  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">'
      + '    <span style="font-size:12px;color:var(--muted);">' + countWords(activeTranscript) + ' từ • ~' + computeWpm(activeTranscript, activeTurn.getDuration() || 20) + ' WPM</span>'
      + '    <button type="button" class="btn btn-primary" onclick="window._spPzAdvanceTurn()"' + (advBusy ? ' disabled' : '') + '>' + advLabel + '</button>'
      + '  </div>'
      + renderPzDialogueFeedHtml(showText)
      + '</div>';

    var feedList = document.getElementById('pzDialogueFeedList');
    if (feedList) feedList.scrollTop = feedList.scrollHeight;
  }

  function renderPzPart2Chamber(stage, L) {
    var p2 = L.part2 || {};
    var isPrep = pzExam.phase === 'part2_prep';
    var isStopped = pzExam.subStage === 'stopped_notice';
    var recordSlot = ensurePzResponseSlot('part2_long', 'Part 2 Long Turn', p2.prompt || '');
    var bulletsHtml = (p2.bullets || []).map(function (b) { return '<li>' + escHtml(b) + '</li>'; }).join('');

    var thankYouHtml = isStopped
      ? '<div class="sp-thankyou-banner">🛑 Hết 2 phút — Giám khảo đã ngắt: <em>"' + escHtml(pzExam.lastStopLine || p2.stopScript || 'Thank you very much. I will stop you there.') + '"</em>. Đang chuyển sang câu hỏi Rounding-off...</div>'
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
    var activeQ = (pzExam.activeFollowUpQ && pzExam.phase !== 'warmup') ? pzExam.activeFollowUpQ : meta.qText;
    speakExaminerLines([exLine(activeQ, 'repeat', 'Nhắc lại', 'offline')]);
  };

  global._spPzRephrase = function () {
    var meta = getActivePzQuestionMeta();
    if (!meta || !meta.rephraseText) return;
    pzExam.rephraseShown = true;
    pzExam.activeRephraseText = meta.rephraseText;
    pzExam.rephraseCount++;
    var slot = ensurePzResponseSlot(meta.key, meta.label, meta.qText);
    slot.usedRephrase = true;
    var lead = PzDialogueEngine.getPhaseScript('rephrase_lead', {
      style: pzExam.resolvedStyle,
      seed: (pzExam.styleSeed || 0) + (pzExam.rephraseCount || 0),
      usedTemplates: pzExam.usedTemplates,
      fallback: 'Of course, let me put that another way.'
    });
    speakExaminerLines([
      exLine(lead, 'reaction', 'Phản hồi', 'offline'),
      exLine(meta.rephraseText, 'rephrase', 'Diễn đạt lại', 'offline')
    ]);
  };

  global._spPzClarify = function () {
    if (!pzExam.active || pzExam.aiThinking) return;
    var meta = getActivePzQuestionMeta();
    if (!meta) return;
    var slot = ensurePzResponseSlot(meta.key, meta.label, meta.qText);
    var activeQ = (pzExam.activeFollowUpQ && pzExam.phase !== 'warmup') ? pzExam.activeFollowUpQ : meta.qText;
    var topicTitle = meta.topicTitle || '';
    var offlineHint = PzDialogueEngine.buildClarificationHint(activeQ, pzExam.phase, topicTitle, pzExam.resolvedStyle);
    pzExam.clarifyCount++;
    slot.usedClarify = true;

    var apiKey = getStoredGeminiKey();
    var useHybridAi = pzExam.dialogueMode === 'gemini_hybrid' && Boolean(apiKey);
    var sessionStartedAt = pzExam.startedAt;

    if (!useHybridAi) {
      pzExam.clarifyShown = true;
      pzExam.clarifyText = offlineHint;
      pzExam.lastReactionSource = 'offline';
      speakExaminerLines([exLine(offlineHint, 'clarify', 'Gợi ý / Clarify', 'offline')]);
      return;
    }

    pzExam.aiThinking = true;
    renderPzStage();

    PzAiExaminer.buildClarificationHybrid({
      mode: pzExam.dialogueMode,
      apiKey: apiKey,
      model: prefs.pzGeminiModel,
      style: pzExam.resolvedStyle,
      sessionSeed: pzExam.styleSeed || 0,
      phase: pzExam.phase,
      questionText: activeQ,
      topicTitle: topicTitle
    }, offlineHint).then(function (res) {
      pzExam.aiThinking = false;
      if (!pzExam.active || pzExam.startedAt !== sessionStartedAt) return;
      var hint = (res && res.hint) || offlineHint;
      var src = (res && res.source) || 'offline';
      if (src === 'offline_fallback') {
        showToast('AI phản hồi chậm — dùng gợi ý Clarify Offline.', 'warn', 3200);
      }
      pzExam.clarifyShown = true;
      pzExam.clarifyText = hint;
      pzExam.lastReactionSource = src;
      speakExaminerLines([exLine(hint, 'clarify', 'Gợi ý / Clarify', src)]);
    });
  };

  global._spPzToggleAutoMic = function () {
    pzExam.autoMic = !pzExam.autoMic;
    prefs.pzAutoMic = pzExam.autoMic;
    savePrefs();
    var chk = document.getElementById('pzAutoMicCheck');
    if (chk) chk.checked = pzExam.autoMic;
    showToast(pzExam.autoMic ? 'Đã bật Auto-Mic rảnh tay sau khi Giám khảo nói.' : 'Đã tắt Auto-Mic rảnh tay.', 'info', 2500);
    renderPzStage();
  };

  global._spPzToggleDialogueFeed = function () {
    pzExam.feedCollapsed = !pzExam.feedCollapsed;
    renderPzStage();
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
    var activeTurn = getPzActiveTurnFields(slot);
    activeTurn.setTranscript(val);
    activeTurn.setMetrics(activeTurn.getDuration(), computeWpm(val, activeTurn.getDuration() || pzExam.turnElapsedSec || 20));
  };

  global._spPzToggleTurnMic = function (isAutoTriggered) {
    if (MicEngine.isActive()) {
      MicEngine.stop();
      return;
    }
    if (pzExam.aiThinking) return;
    var meta = getActivePzQuestionMeta();
    if (!meta) return;
    var slot = ensurePzResponseSlot(meta.key, meta.label, meta.qText);
    var activeTurn = getPzActiveTurnFields(slot);
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
        activeTurn.setTranscript(txt);
        activeTurn.setMetrics(sec, computeWpm(txt, sec));
        var inp = document.getElementById('pzCandidateTranscriptInput');
        if (inp) inp.value = txt;
      },
      onUnsupported: function (msg) {
        if (isAutoTriggered) {
          pzExam.autoMic = false;
          prefs.pzAutoMic = false;
          savePrefs();
          var chk = document.getElementById('pzAutoMicCheck');
          if (chk) chk.checked = false;
          renderPzStage();
          return;
        }
        showToast(msg, 'warn', 5500);
      },
      onSttWarning: showMicSttWarning,
      onFinish: function (res) {
        if (res) {
          if (res.transcript) activeTurn.setTranscript(res.transcript);
          var dur = res.durationSec || pzExam.turnElapsedSec;
          activeTurn.setMetrics(dur, computeWpm(activeTurn.getTranscript(), dur));
          activeTurn.setAudio(res.id, res.url);
        }
        renderPzStage();
      }
    });
  };

  function advancePzToNextCanonicalPhase(L, bridgeLine, reactionSource) {
    var opts = {};
    if (bridgeLine) opts.bridgeLine = bridgeLine;
    if (reactionSource) opts.reactionSource = reactionSource;
    if (pzExam.phase === 'warmup') {
      if (getCurrentPzP1Questions(L).length) enterPzPhase('part1', 0, opts);
      else if (L.part2 && L.part2.prompt) enterPzPhase('part2_prep', 0, opts);
      else enterPzPhase('part3', 0, opts);
    } else if (pzExam.phase === 'part1') {
      var p1 = getCurrentPzP1Questions(L);
      if (pzExam.stepIndex + 1 < p1.length) {
        enterPzPhase('part1', pzExam.stepIndex + 1, opts);
      } else if (L.part2 && L.part2.prompt) {
        enterPzPhase('part2_prep', 0, opts);
      } else {
        finishPzExamToReport(bridgeLine);
      }
    } else if (pzExam.phase === 'part2_round') {
      var p3List = (L.part3 && L.part3.questions) || [];
      if (p3List.length) enterPzPhase('part3', 0, opts);
      else finishPzExamToReport(bridgeLine);
    } else if (pzExam.phase === 'part3') {
      var p3 = (L.part3 && L.part3.questions) || [];
      if (pzExam.stepIndex + 1 < p3.length) {
        enterPzPhase('part3', pzExam.stepIndex + 1, opts);
      } else {
        finishPzExamToReport(bridgeLine);
      }
    }
  }

  function tagSpokenLines(lines, tailKind, tailTag, source) {
    var arr = (lines || []).filter(Boolean);
    var src = source || 'offline';
    var reactTag = src === 'gemini' ? '🤖 Phản hồi' : '⚡ Phản hồi';
    return arr.map(function (ln, idx) {
      if (typeof ln === 'object') return ln;
      var isReactionLead = arr.length > 1 && idx === 0;
      return exLine(
        ln,
        isReactionLead ? 'reaction' : tailKind,
        isReactionLead ? reactTag : tailTag,
        src
      );
    });
  }

  function applyPzTurnDecision(decision, L, slot, activeTurn, meta) {
    if (decision.candidateName) pzExam.candidateName = decision.candidateName;
    var src = decision.source || 'offline';
    pzExam.lastReactionSource = src;

    if (src === 'offline_fallback') {
      showToast('AI phản hồi chậm/gián đoạn — tự chuyển sang Tầng 1 Offline.', 'warn', 3500);
    }

    if (decision.action === 'repeat') {
      pzExam.repeatCount++;
      if (slot) slot.usedRepeat = true;
      if (activeTurn) activeTurn.setTranscript('');
      pzExam.lastExaminerReaction = decision.examinerReaction;
      speakExaminerLines(tagSpokenLines(decision.spokenLines, 'repeat', 'Nhắc lại', src));
      return;
    }

    if (decision.action === 'rephrase') {
      pzExam.rephraseShown = true;
      pzExam.activeRephraseText = decision.rephraseText || (meta && meta.rephraseText) || '';
      pzExam.rephraseCount++;
      if (slot) slot.usedRephrase = true;
      if (activeTurn) activeTurn.setTranscript('');
      pzExam.lastExaminerReaction = decision.examinerReaction;
      speakExaminerLines(tagSpokenLines(decision.spokenLines, 'rephrase', 'Diễn đạt lại', src));
      return;
    }

    if (decision.action === 'clarify_nudge') {
      if (slot) slot.nudgeUsed = true;
      if (activeTurn) activeTurn.setTranscript('');
      pzExam.lastExaminerReaction = decision.examinerReaction;
      speakExaminerLines(tagSpokenLines(decision.spokenLines, 'clarify', 'Gợi ý / Clarify', src));
      return;
    }

    if (decision.action === 'warmup_next') {
      pzExam.warmupStep = 1;
      pzExam.clarifyShown = false;
      pzExam.clarifyText = '';
      pzExam.rephraseShown = false;
      pzExam.activeFollowUpQ = decision.followUpQuestion;
      pzExam.lastExaminerReaction = decision.examinerReaction;
      speakExaminerLines(tagSpokenLines(decision.spokenLines, 'question', 'Warm-up', src));
      return;
    }

    if (decision.action === 'followup') {
      if (slot) {
        slot.followUpAsked = true;
        slot.followUpQ = decision.followUpQuestion;
        slot.examinerReaction = decision.examinerReaction;
      }
      pzExam.clarifyShown = false;
      pzExam.clarifyText = '';
      pzExam.rephraseShown = false;
      pzExam.activeFollowUpQ = decision.followUpQuestion;
      pzExam.lastExaminerReaction = decision.examinerReaction;
      pzExam.followUpCount++;
      speakExaminerLines(tagSpokenLines(decision.spokenLines, 'followup', 'Follow-up', src));
      return;
    }

    if (slot && decision.examinerReaction) {
      slot.examinerReaction = decision.examinerReaction;
    }
    advancePzToNextCanonicalPhase(L, decision.examinerReaction || '', src);
  }

  global._spPzAdvanceTurn = function () {
    if (pzExam.aiThinking || pzExam.subStage === 'finishing_report' || pzExam.subStage === 'stopped_notice') return;
    var sessionStartedAt = pzExam.startedAt;
    var finishPromise = MicEngine.isActive() ? MicEngine.stop() : Promise.resolve(null);
    finishPromise.then(function () {
      var L = pzExam.lesson;
      if (!L || !pzExam.active || pzExam.startedAt !== sessionStartedAt) return;

      var meta = getActivePzQuestionMeta();
      var slot = meta ? ensurePzResponseSlot(meta.key, meta.label, meta.qText) : null;
      var activeTurn = slot ? getPzActiveTurnFields(slot) : null;
      var curTranscript = activeTurn ? activeTurn.getTranscript() : '';
      if (curTranscript) {
        recordPzDialogueEntry('candidate', activeTurn && activeTurn.isFollowUp ? 'followup_answer' : 'answer', curTranscript, meta ? meta.label : '');
      }

      var turnCtx = {
        phase: pzExam.phase,
        stepIndex: pzExam.stepIndex,
        warmupStep: pzExam.warmupStep,
        candidateName: pzExam.candidateName,
        transcript: curTranscript,
        meta: meta,
        slot: slot,
        activeFollowUpQ: pzExam.activeFollowUpQ,
        topicTitle: L.cleanTitle || L.title,
        style: pzExam.resolvedStyle,
        sessionSeed: pzExam.styleSeed || 0,
        usedTemplates: pzExam.usedTemplates,
        examinerPersona: L.examinerPersona
      };
      var offlineDecision = PzDialogueEngine.decideTurn(turnCtx);
      var apiKey = getStoredGeminiKey();
      var useHybridAi = pzExam.dialogueMode === 'gemini_hybrid'
        && Boolean(apiKey)
        && offlineDecision.intent !== 'repeat'
        && (Boolean(String(curTranscript || '').trim()) || pzExam.phase === 'warmup');

      if (!useHybridAi) {
        pzExam.aiThinking = false;
        applyPzTurnDecision(Object.assign({}, offlineDecision, { source: 'offline' }), L, slot, activeTurn, meta);
        return;
      }

      pzExam.aiThinking = true;
      renderPzStage();

      PzAiExaminer.decideTurnHybrid(Object.assign({}, turnCtx, {
        mode: pzExam.dialogueMode,
        apiKey: apiKey,
        model: prefs.pzGeminiModel,
        lesson: L,
        dialogueHistory: pzExam.dialogueHistory
      }), offlineDecision).then(function (finalDecision) {
        pzExam.aiThinking = false;
        if (!pzExam.active || pzExam.startedAt !== sessionStartedAt) return;
        applyPzTurnDecision(finalDecision, L, slot, activeTurn, meta);
      });
    });
  };

  function collectSlotTranscript(r) {
    if (!r) return '';
    return [r.transcript, r.followUpTranscript].filter(Boolean).join(' ').trim();
  }

  function collectSlotDuration(r) {
    if (!r) return 0;
    return (r.durationSec || 0) + (r.followUpDurationSec || 0);
  }

  function buildPzGradePayload(L) {
    var combinedTranscript = pzExam.responses.map(collectSlotTranscript).filter(Boolean).join(' ');
    var totalDur = pzExam.responses.reduce(function (acc, r) { return acc + collectSlotDuration(r); }, 0);
    // Chọn bản thu âm dài nhất (ưu tiên Part 2 Long Turn) để Gemini nghe trực tiếp đánh giá Pronunciation
    var sampleAudioSlot = pzExam.responses.find(function (r) { return r && r.key === 'part2_long' && (r.audioId || r.followUpAudioId); })
      || pzExam.responses.filter(function (r) { return r && (r.audioId || r.followUpAudioId) && !/^warmup/i.test(String(r.key || '')); })
        .sort(function (a, b) { return ((b.durationSec || 0) + (b.followUpDurationSec || 0)) - ((a.durationSec || 0) + (a.followUpDurationSec || 0)); })[0]
      || null;
    return {
      kind: 'pz',
      lesson: L,
      title: L ? L.title : 'Practice Zone Mock Exam',
      transcript: combinedTranscript,
      durationSec: totalDur || 120,
      audioId: sampleAudioSlot ? (sampleAudioSlot.audioId || sampleAudioSlot.followUpAudioId || null) : null,
      turns: pzExam.responses,
      telemetry: {
        followUpCount: pzExam.followUpCount || 0,
        repeatCount: pzExam.repeatCount || 0,
        rephraseCount: pzExam.rephraseCount || 0,
        clarifyCount: pzExam.clarifyCount || 0
      }
    };
  }

  // --- Final Practice Zone Examiner Report ---
  function renderPzReport(stage, L) {
    if (!pzExam.autoGrade) {
      var initGrade = SpeakingGrader.evaluateOffline(buildPzGradePayload(L));
      pzExam.autoGrade = initGrade;
      if (pzExam.scoreSource !== 'manual' && pzExam.scoreSource !== 'auto_gemini') {
        pzExam.reportScores = Object.assign({}, initGrade.scores);
        pzExam.scoreSource = initGrade.notRated ? 'not_rated' : 'auto_offline';
      }
      if (!pzExam.reportFeedback || pzExam.reportFeedbackAuto) {
        pzExam.reportFeedback = SpeakingGrader.formatFeedbackText(initGrade);
        pzExam.reportFeedbackAuto = true;
      }
    }

    if (
      pzExam.dialogueMode === 'gemini_hybrid'
      && getStoredGeminiKey()
      && pzExam.autoGrade.hasTranscript
      && !pzExam.autoGeminiTriggered
      && !pzExam.gradingBusy
    ) {
      pzExam.autoGeminiTriggered = true;
      var stamp = pzExam.startedAt;
      setTimeout(function () {
        if (pzExam.active && pzExam.phase === 'report' && pzExam.startedAt === stamp) {
          global._spRunPzAiGrade(true);
        }
      }, 30);
    }

    var metrics = pzExam.autoGrade.metrics || analyzeTranscriptMetrics('', 120, collectTargetLexis(L));
    var overall = computeAverageBand(pzExam.reportScores);
    var overallIsUnrated = isScoreUnrated(overall);

    var aiPrompt = [
      'You are a Senior IELTS Speaking Examiner. Grade this complete Mock Exam (Warm-up + Part 1 + Part 2 + Part 3).',
      'Test Title: ' + L.title,
      'Total Words Spoken: ' + metrics.wordCount + ' | Avg Pace: ~' + metrics.wpm + ' WPM | Follow-up Probes: ' + (pzExam.followUpCount || 0) + ' | Repeat clicks: ' + pzExam.repeatCount + ' | Rephrase clicks: ' + pzExam.rephraseCount + ' | Clarify clicks: ' + (pzExam.clarifyCount || 0),
      '',
      pzExam.responses.map(function (r) {
        var block = '[' + r.label + ']\nQ: ' + r.question + '\nA (' + formatSec(r.durationSec) + '): ' + (r.transcript || '[Audio only / No transcript]');
        if (r.followUpQ) {
          block += '\nExaminer Follow-up: ' + r.followUpQ + '\nA2 (' + formatSec(r.followUpDurationSec || 0) + '): ' + (r.followUpTranscript || '[Audio only / No transcript]');
        }
        return block;
      }).join('\n\n'),
      '',
      'Please return Band scores (FC, LR, GRA, PR, Overall), top 5 vocabulary upgrades, grammar fixes, and concise Vietnamese examiner advice.'
    ].join('\n');

    var turnsHtml = pzExam.responses.map(function (r) {
      var durSum = collectSlotDuration(r);
      var combinedTurnText = collectSlotTranscript(r);
      var turnWpm = computeWpm(combinedTurnText, durSum || 20) || r.wpm || 0;
      var followUpHtml = r.followUpQ
        ? '<div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--border);">'
          + '  <div style="font-size:12.5px;color:#059669;"><b>↳ Follow-up:</b> ' + escHtml(r.followUpQ) + '</div>'
          + (r.followUpAudioUrl ? '<audio controls src="' + r.followUpAudioUrl + '" style="width:100%;height:34px;margin-top:6px;"></audio>' : '')
          + '  <div style="font-size:13px;color:var(--text);margin-top:6px;background:var(--card);padding:8px 10px;border-radius:8px;border:1px solid var(--border);">' + escHtml(r.followUpTranscript || '(Chưa có transcript câu follow-up)') + '</div>'
          + '</div>'
        : '';

      return '<div class="sp-report-part-card">'
        + '  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">'
        + '    <strong>' + escHtml(r.label) + '</strong>'
        + '    <span class="sp-tag-pill">' + formatSec(durSum) + ' • ~' + turnWpm + ' WPM' + (r.usedRepeat ? ' • Repeat' : '') + (r.usedRephrase ? ' • Rephrase' : '') + (r.usedClarify ? ' • Clarify' : '') + (r.followUpQ ? ' • Có Follow-up' : '') + '</span>'
        + '  </div>'
        + '  <div style="font-size:13px;color:var(--sub-text);margin-top:4px;"><b>Q:</b> ' + escHtml(r.question) + '</div>'
        + (r.audioUrl ? '<audio controls src="' + r.audioUrl + '" style="width:100%;height:34px;margin-top:6px;"></audio>' : '')
        + '  <div style="font-size:13px;color:var(--text);margin-top:6px;background:var(--card);padding:8px 10px;border-radius:8px;border:1px solid var(--border);">' + escHtml(r.transcript || '(Chưa có transcript văn bản)') + '</div>'
        + followUpHtml
        + '</div>';
    }).join('');

    var phaseShortLabels = {
      warmup: 'Warm-up',
      part1: 'Part 1',
      part2_prep: 'Part 2 Prep',
      part2_talk: 'Part 2 Talk',
      part2_round: 'Part 2 Round',
      part3: 'Part 3',
      report: 'Report'
    };
    var historyList = pzExam.dialogueHistory || [];
    var modeBadge = pzExam.dialogueMode === 'gemini_hybrid' ? '🤖 Hybrid Gemini' : '⚡ Offline NLU';
    var interactionBarHtml = ''
      + '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">'
      + '  <span class="sp-tag-pill">💬 Lượt hội thoại: <b>' + historyList.length + '</b></span>'
      + '  <span class="sp-tag-pill">↳ Follow-up: <b>' + (pzExam.followUpCount || 0) + '</b></span>'
      + '  <span class="sp-tag-pill">🔁/🔄/💡 Trợ giúp: <b>' + (pzExam.repeatCount || 0) + ' / ' + (pzExam.rephraseCount || 0) + ' / ' + (pzExam.clarifyCount || 0) + '</b></span>'
      + '  <span class="sp-tag-pill">' + modeBadge + '</span>'
      + '</div>';

    var dialogueTimelineHtml = historyList.length
      ? '<details id="pzReportDialogueDetails" class="sp-report-part-card">'
        + '  <summary style="cursor:pointer;font-weight:700;font-size:13.5px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">'
        + '    <span>💬 Xem toàn bộ Nhật ký Hội thoại 2 Phía (' + historyList.length + ' lượt)</span>'
        + '    <span class="sp-tag-pill">' + modeBadge + '</span>'
        + '  </summary>'
        + '  <div class="sp-dialogue-feed-list" style="margin-top:10px;max-height:320px;">'
        + historyList.map(function (entry) {
          var isEx = entry.role === 'examiner';
          var who = isEx ? '🎙️ Examiner' : ('🗣️ ' + (pzExam.candidateName || 'Bạn'));
          var phLabel = phaseShortLabels[entry.phase] || entry.phase || '';
          var metaText = who + (phLabel ? ' • ' + phLabel : '');
          return '<div class="sp-chat-row ' + (isEx ? 'is-examiner' : 'is-candidate') + '">'
            + '  <div class="sp-chat-meta"><strong>' + escHtml(metaText) + '</strong>' + (entry.tag ? '<span class="sp-chat-kind-tag">' + escHtml(entry.tag) + '</span>' : '') + '</div>'
            + '  <div class="sp-chat-bubble">' + escHtml(entry.text || '') + '</div>'
            + '</div>';
        }).join('')
        + '  </div>'
        + '</details>'
      : '';

    stage.innerHTML = ''
      + '<div class="sp-exam-chamber sp-exam-report">'
      + renderExaminerHeaderPanel('EXAMINER FINAL REPORT', 'is-p1', 'Hoàn tất bài thi IELTS Speaking trực tiếp')
      + '  <div class="sp-metrics-grid">'
      + '    <div class="sp-metric-tile"><span class="sp-metric-lbl">Từ phần thi (P1–P3)</span><span class="sp-metric-val">' + metrics.wordCount + '</span></div>'
      + '    <div class="sp-metric-tile"><span class="sp-metric-lbl">Nhịp độ TB (WPM)</span><span class="sp-metric-val">' + metrics.wpm + '</span></div>'
      + '    <div class="sp-metric-tile"><span class="sp-metric-lbl">Target Lexis</span><span class="sp-metric-val">' + metrics.usedTargets.length + '/' + metrics.targetTotal + '</span></div>'
      + '    <div class="sp-metric-tile"><span class="sp-metric-lbl">' + (pzExam.scoreSource === 'manual' ? 'Band tự chấm' : 'Overall Band') + '</span><span class="sp-metric-val" style="color:' + (overallIsUnrated ? 'var(--sp-accent-rose,#f43f5e);font-size:clamp(16px,2.3vw,20px)' : 'var(--hl-green)') + ';">' + formatBandValue(overall) + '</span></div>'
      + '  </div>'
      + interactionBarHtml
      + renderAutoGradePanelHtml({
        panelId: 'pzAutoGradePanel',
        grade: pzExam.autoGrade,
        busy: pzExam.gradingBusy,
        hasAudio: pzExam.responses.some(function (r) { return Boolean(r && (r.audioId || r.followUpAudioId) && !/^warmup/i.test(String(r.key || ''))); }),
        scoreSource: pzExam.scoreSource,
        onRunAiFn: '_spRunPzAiGrade',
        onRegradeOfflineFn: '_spRunPzOfflineGrade'
      })
      + '  <div class="sp-rubric-grid">'
      + ['fc', 'lr', 'gra', 'pr'].map(function (k) {
        var names = { fc: 'Fluency & Coherence', lr: 'Lexical Resource', gra: 'Grammatical Range', pr: 'Pronunciation' };
        return '<div class="sp-criteria-card"><strong>' + names[k] + ' (' + formatBandValue(pzExam.reportScores[k]) + ')</strong>' + renderBandPillsRow(k, pzExam.reportScores[k], '_spSetPzReportScore') + '</div>';
      }).join('')
      + '  </div>'
      + '  <div class="sp-ai-prompt-box">'
      + '    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">'
      + '      <strong>🤖 Full Mock Exam AI Examiner Prompt</strong>'
      + '      <button type="button" class="mini-btn" onclick="window._spCopyPzAiPrompt()">📋 Copy Prompt toàn bộ đề</button>'
      + '    </div>'
      + '    <textarea id="pzAiPromptBox" class="sp-notepad-textarea" rows="5" readonly>' + escHtml(aiPrompt) + '</textarea>'
      + '    <textarea class="sp-notepad-textarea" rows="3" placeholder="Nhận xét tự chấm hoặc dán nhận xét AI..." oninput="window._spSetPzReportFeedback(this.value)">' + escHtml(pzExam.reportFeedback) + '</textarea>'
      + '    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">'
      + '      <button type="button" class="btn mini-btn" onclick="window.exitPzExamToLobby()">🚪 Về Sảnh Practice Zone</button>'
      + '      <div style="display:flex;gap:8px;flex-wrap:wrap;">'
      + '        <button type="button" class="btn mini-btn" onclick="window.startRandomSpeakingExam()">🎲 Thi thử đề Ngẫu nhiên khác</button>'
      + '        <button type="button" class="btn btn-primary" onclick="window._spSavePzReport()">' + (pzExam.savedToHistory ? '✓ Đã lưu Báo cáo' : '💾 Lưu Báo cáo Mock Test') + '</button>'
      + '      </div>'
      + '    </div>'
      + '  </div>'
      + dialogueTimelineHtml
      + '  <div style="display:flex;flex-direction:column;gap:8px;"><strong>🎙️ Chi tiết toàn bộ lượt trả lời (Part 1 → Part 3)</strong>' + turnsHtml + '</div>'
      + '</div>';
  }

  global._spSetPzReportScore = function (key, val) {
    pzExam.scoreSource = 'manual';
    applyManualBandScore(pzExam.reportScores, key, val);
    renderPzStage();
  };
  global._spSetPzReportFeedback = function (val) {
    pzExam.reportFeedbackAuto = false;
    pzExam.reportFeedback = val;
  };
  global._spRunPzOfflineGrade = function () {
    if (!pzExam.lesson) return;
    var offGrade = SpeakingGrader.evaluateOffline(buildPzGradePayload(pzExam.lesson));
    pzExam.autoGrade = offGrade;
    pzExam.reportScores = Object.assign({}, offGrade.scores);
    pzExam.scoreSource = offGrade.notRated ? 'not_rated' : 'auto_offline';
    if (!pzExam.reportFeedback || pzExam.reportFeedbackAuto) {
      pzExam.reportFeedback = SpeakingGrader.formatFeedbackText(offGrade);
      pzExam.reportFeedbackAuto = true;
    }
    renderPzStage();
    showToast(offGrade.notRated ? 'Chưa ghi nhận lời nói phần thi (Part 1–3) để chấm.' : ('Đã chấm lại báo cáo theo bộ tiêu chí Offline (Band ' + offGrade.overallBand.toFixed(1) + ').'), offGrade.notRated ? 'warn' : 'info');
  };
  global._spRunPzAiGrade = function (isBackgroundAuto) {
    if (!pzExam.lesson || pzExam.gradingBusy) return;
    var apiKey = getStoredGeminiKey();
    if (!apiKey) {
      if (!isBackgroundAuto) {
        showToast('Hãy dán Gemini API Key cá nhân (Free Tier) vào ô trên để chấm bằng gemini-4-hydrogen.', 'warn', 4200);
      }
      return;
    }
    var sessionStamp = pzExam.startedAt;
    pzExam.gradingBusy = true;
    renderPzStage();

    var preTranscribeJobs = [];
    (pzExam.responses || []).forEach(function (r) {
      if (!r || /^warmup/i.test(String(r.key || ''))) return;
      if (!String(r.transcript || '').trim() && r.audioId) {
        preTranscribeJobs.push({ slot: r, audioId: r.audioId, question: r.question || '', isFollowUp: false });
      }
      if (!String(r.followUpTranscript || '').trim() && r.followUpAudioId) {
        preTranscribeJobs.push({ slot: r, audioId: r.followUpAudioId, question: r.followUpQ || r.question || '', isFollowUp: true });
      }
    });
    var preTranscribeAll = preTranscribeJobs.length
      ? Promise.all(preTranscribeJobs.map(function (job) {
        return AudioVault.getBlob(job.audioId).then(function (blob) {
          if (!blob) return '';
          return PzAiExaminer.transcribeAudioWithGemini(blob, {
            apiKey: apiKey,
            model: prefs.pzGeminiModel,
            contextHint: job.question
          }).then(function (tr) {
            if (tr && tr.ok && tr.transcript && pzExam.active && pzExam.startedAt === sessionStamp) {
              if (job.isFollowUp) {
                job.slot.followUpTranscript = tr.transcript;
                job.slot.followUpWpm = computeWpm(tr.transcript, job.slot.followUpDurationSec || 20);
              } else {
                job.slot.transcript = tr.transcript;
                job.slot.wpm = computeWpm(tr.transcript, job.slot.durationSec || 20);
              }
            }
            return tr ? tr.transcript : '';
          });
        });
      }))
      : Promise.resolve([]);

    preTranscribeAll.then(function () {
      if (!pzExam.active || pzExam.startedAt !== sessionStamp || pzExam.phase !== 'report') return null;
      return SpeakingGrader.evaluateWithGemini(buildPzGradePayload(pzExam.lesson), {
        apiKey: apiKey,
        model: prefs.pzGeminiModel
      });
    }).then(function (res) {
      pzExam.gradingBusy = false;
      if (!res || !pzExam.active || pzExam.startedAt !== sessionStamp || pzExam.phase !== 'report') return;
      pzExam.autoGrade = res;
      if (pzExam.scoreSource !== 'manual') {
        pzExam.reportScores = Object.assign({}, res.scores);
        pzExam.scoreSource = res.notRated ? 'not_rated' : (res.source === 'gemini' ? 'auto_gemini' : 'auto_offline');
      }
      if (!pzExam.reportFeedback || pzExam.reportFeedbackAuto) {
        pzExam.reportFeedback = SpeakingGrader.formatFeedbackText(res);
        pzExam.reportFeedbackAuto = true;
      }
      renderPzStage();
      if (res.source === 'gemini') {
        showToast('AI Examiner (gemini-4-hydrogen) đã hoàn tất chấm điểm — Band ' + res.overallBand.toFixed(1) + '!', 'success');
      } else if (!isBackgroundAuto) {
        showToast('Chưa chấm được qua Gemini' + (res.fallbackReason ? (' (' + res.fallbackReason + ')') : '') + ' — giữ nguyên kết quả Offline dự phòng.', 'warn', 4500);
      }
    });
  };
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
    var combined = pzExam.responses.map(collectSlotTranscript).filter(Boolean).join(' ');
    var totalDur = pzExam.responses.reduce(function (a, r) { return a + collectSlotDuration(r); }, 0);
    var metrics = (pzExam.autoGrade && pzExam.autoGrade.metrics) || analyzeTranscriptMetrics(combined, totalDur || 120, collectTargetLexis(L));
    var overall = computeAverageBand(pzExam.reportScores);
    var gradeMeta = buildCompactGradeMeta(pzExam.autoGrade, pzExam.scoreSource);

    saveSubmissionRecord(Object.assign({
      id: 'sub_mock_' + Date.now(),
      kind: 'mock',
      lessonId: L.id,
      title: L.title,
      unitId: 'u_6',
      dialogueMode: pzExam.dialogueMode || 'offline',
      followUpCount: pzExam.followUpCount || 0,
      repeatCount: pzExam.repeatCount || 0,
      rephraseCount: pzExam.rephraseCount || 0,
      clarifyCount: pzExam.clarifyCount || 0,
      transcript: combined,
      turns: pzExam.responses.map(function (r) {
        return {
          label: r.label,
          question: r.question,
          transcript: r.transcript,
          durationSec: r.durationSec,
          wpm: r.wpm,
          audioId: r.audioId,
          usedRepeat: Boolean(r.usedRepeat),
          usedRephrase: Boolean(r.usedRephrase),
          usedClarify: Boolean(r.usedClarify),
          followUpQ: r.followUpQ || '',
          followUpTranscript: r.followUpTranscript || '',
          followUpDurationSec: r.followUpDurationSec || 0,
          followUpAudioId: r.followUpAudioId || null
        };
      }),
      dialogueHistory: (pzExam.dialogueHistory || []).map(function (d) {
        return {
          role: d.role,
          kind: d.kind,
          phase: d.phase,
          text: d.text,
          tag: d.tag,
          source: d.source || ''
        };
      }),
      durationSec: totalDur,
      wpm: metrics.wpm,
      wordCount: metrics.wordCount,
      usedTargets: metrics.usedTargets,
      scores: Object.assign({}, pzExam.reportScores),
      overallBand: overall,
      aiFeedback: pzExam.reportFeedback,
      createdAt: Date.now()
    }, gradeMeta));
    if (!L.isDynamicRandom && !isLessonDone(L.id)) {
      markLessonDone(L.id, true);
      renderSidebar();
    }
    pzExam.savedToHistory = true;
    renderPzStage();
    showToast(isScoreUnrated(overall) ? 'Đã lưu bản ghi Mock Exam (Chưa chấm Band) vào Lịch sử!' : ('Đã lưu Báo cáo Mock Exam (Band ' + overall.toFixed(1) + ') vào Lịch sử!'), 'success');
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
      var bandChip = (item.notRated || isScoreUnrated(item.overallBand)) ? 'Chưa chấm' : ('Band ' + Number(item.overallBand).toFixed(1));
      return '<div class="sp-history-item" id="histCard_' + escHtml(item.id) + '">'
        + '  <div style="flex:1;min-width:220px;">'
        + '    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:4px;">'
        + '      <span class="sp-lobby-chip is-accent">' + badge + '</span>'
        + '      <span class="sp-lobby-chip is-exam">' + bandChip + '</span>'
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

    var srcBadgeHtml = rec.scoreSource === 'manual'
      ? '<span class="sp-tag-pill">✏️ Điểm chỉnh tay</span>'
      : (rec.scoreSource === 'not_rated' || rec.notRated
        ? '<span class="sp-tag-pill" style="background:rgba(244,63,94,0.16);color:var(--sp-accent-rose,#f43f5e);">⚠️ Chưa chấm</span>'
        : (rec.scoreSource === 'auto_gemini'
          ? '<span class="sp-tag-pill" style="background:rgba(16,185,129,0.16);color:#10b981;">🤖 Tự chấm gemini-4-hydrogen</span>'
          : (rec.scoreSource === 'auto_offline' ? '<span class="sp-tag-pill">⚡ Tự chấm Offline</span>' : '')));

    var extraAdviceHtml = '';
    if ((Array.isArray(rec.vocabUpgrades) && rec.vocabUpgrades.length) || (Array.isArray(rec.grammarFixes) && rec.grammarFixes.length)) {
      var upHtml = (rec.vocabUpgrades || []).slice(0, 4).map(function (v) {
        return '<li><span style="color:var(--muted);">' + escHtml(v.from || 'Gợi ý') + '</span> ➜ <b>' + escHtml(v.upgrade) + '</b></li>';
      }).join('');
      var grHtml = (rec.grammarFixes || []).slice(0, 3).map(function (g) {
        return '<li><span style="color:var(--sp-accent-rose,#f43f5e);">' + escHtml(g.original) + '</span> ➜ <b>' + escHtml(g.corrected) + '</b></li>';
      }).join('');
      extraAdviceHtml = '<div class="sp-autograde-cols" style="margin-top:8px;">'
        + (upHtml ? '<div class="sp-autograde-box"><strong>💎 Nâng cấp Từ vựng</strong><ul class="sp-autograde-list">' + upHtml + '</ul></div>' : '')
        + (grHtml ? '<div class="sp-autograde-box"><strong>🔧 Sửa Ngữ pháp</strong><ul class="sp-autograde-list">' + grHtml + '</ul></div>' : '')
        + '</div>';
    }

    body.innerHTML = ''
      + '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">'
      + '  <button type="button" class="mini-btn" onclick="window._spBackHistoryList()">← Quay lại danh sách</button>'
      + '  <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">'
      + srcBadgeHtml
      + '    <span class="sp-lobby-chip is-exam">' + ((rec.notRated || isScoreUnrated(rec.overallBand)) ? 'Overall: Chưa chấm' : ('Overall Band: ' + Number(rec.overallBand).toFixed(1))) + '</span>'
      + '  </div>'
      + '</div>'
      + '<div class="sp-modal-detail">'
      + '  <h4 style="margin-bottom:6px;">' + escHtml(rec.title) + '</h4>'
      + '  <div id="histAudioMounts" style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;"></div>'
      + '  <div style="font-size:13px;line-height:1.65;white-space:pre-line;background:var(--card);padding:12px;border-radius:10px;border:1px solid var(--border);">'
      + (Array.isArray(rec.turns) && rec.turns.length
        ? rec.turns.map(function (t) { return '【' + escHtml(t.label) + '】\nQ: ' + escHtml(t.question) + '\nA: ' + escHtml(t.transcript || '(Không có transcript)'); }).join('\n\n')
        : escHtml(rec.transcript || '(Không có transcript văn bản)'))
      + '  </div>'
      + (rec.aiFeedback ? '<div class="sp-tip-callout" style="white-space:pre-line;">🤖 <b>Phản hồi chấm điểm:</b>\n' + escHtml(rec.aiFeedback) + '</div>' : '')
      + extraAdviceHtml
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
    var aChk = document.getElementById('pzAutoMicCheck');
    var dSel = document.getElementById('pzDialogueModeSelect');
    var esSel = document.getElementById('pzExaminerStyleSelect');
    var mSel = document.getElementById('pzGeminiModelSelect');
    var kInp = document.getElementById('pzGeminiKeyInput');
    if (sSel) sSel.addEventListener('change', function () { prefs.pzStrictness = sSel.value; savePrefs(); });
    if (vSel) vSel.addEventListener('change', function () { global.setSpeakingVoiceAccent(vSel.value); });
    if (tChk) tChk.addEventListener('change', function () { prefs.pzStrictTimers = tChk.checked; savePrefs(); });
    if (aChk) aChk.addEventListener('change', function () { prefs.pzAutoMic = aChk.checked; savePrefs(); });
    if (dSel) dSel.addEventListener('change', function () { prefs.pzDialogueMode = dSel.value; savePrefs(); syncPzLobbyDialogueUi(); });
    if (esSel) esSel.addEventListener('change', function () { prefs.pzExaminerStyle = PzDialogueEngine.normalizeStyle(esSel.value); savePrefs(); });
    if (mSel) mSel.addEventListener('change', function () { prefs.pzGeminiModel = mSel.value; savePrefs(); });
    if (kInp) kInp.addEventListener('input', function () { setStoredGeminiKey(kInp.value); });

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
