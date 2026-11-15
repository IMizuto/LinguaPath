/**
 * LinguaPath - IELTS Intensive Speaking Parser & Drill Builder (Schema v2.1)
 * Parses window.STUDY4_SPEAKING_DATA (Course 27 IELTS Intensive Speaking + Practice Zone):
 *  - u_1: Vocab & Expressions Speaking SRS (1,468 Pronunciation words + 14,071 Sample Lexis)
 *  - u_2: Part 1 Interview Topics (376 topics + native MP3 audio + glosses)
 *  - u_3: Part 2 Cue Cards (415 topics + linked Part 3)
 *  - u_4: Part 3 Two-Way Discussion (415 topics + linked Part 2)
 *  - u_5: Pronunciation & Video Strategy (34 Videos + 78 Pronunciation lessons & 139 Drills)
 *  - u_6: Practice Zone (110 Full Tests + 974 Forecast / Sample Pack sets + Random Builder)
 */
(function (global) {
  'use strict';

  var DEFAULT_MEDIA_BASE = 'https://study4.com/media/';

  var UNIT_META = {
    u_1: { id: 'u_1', title: 'Từ vựng & Idioms Speaking SRS', short: 'Vocab SRS', type: 'vocab_srs' },
    u_2: { id: 'u_2', title: 'Part 1: Interview Topics', short: 'Part 1', type: 'part1' },
    u_3: { id: 'u_3', title: 'Part 2: Cue Card Long Turn', short: 'Part 2', type: 'part2' },
    u_4: { id: 'u_4', title: 'Part 3: Two-Way Discussion', short: 'Part 3', type: 'part3' },
    u_5: { id: 'u_5', title: 'Phát âm & Chiến thuật', short: 'Chiến thuật', type: 'theory' },
    u_6: { id: 'u_6', title: 'Practice Zone — Thi thử thật', short: 'Practice Zone', type: 'practice_full' }
  };

  var _raw = null;
  var _mediaBase = DEFAULT_MEDIA_BASE;
  var _lessons = [];
  var _lessonMap = new Map();
  var _stats = null;
  var _globalVocabPool = [];
  var _part1Pool = [];
  var _part23Pool = [];
  var _pzTopicsP1 = [];
  var _pzTopicsP23 = [];

  function cloneJson(obj) {
    return obj ? JSON.parse(JSON.stringify(obj)) : obj;
  }

  function resolveMediaUrl(relPath) {
    var s = String(relPath || '').trim();
    if (!s) return '';
    if (/^https?:\/\//i.test(s) || s.indexOf('data:') === 0 || s.indexOf('blob:') === 0) return s;
    s = s.replace(/^\/?media\//i, '').replace(/^\/+/, '');
    return _mediaBase + s;
  }

  function stripNumberPrefix(title) {
    return String(title || '').replace(/^\d+\.\s*/, '').trim();
  }

  function cleanQuestionText(qStr) {
    return String(qStr || '').replace(/^\d+\.\s*/, '').replace(/\s+/g, ' ').trim();
  }

  function hashCode(str) {
    var h =  FN_OFFSET(2166136261);
    var s = String(str || '');
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function FN_OFFSET(v) { return v >>> 0; }

  function deterministicShuffle(arr, seedKey) {
    var out = arr.slice();
    var seed = hashCode(seedKey);
    for (var i = out.length - 1; i > 0; i--) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      var j = seed % (i + 1);
      var tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  function splitSentences(text) {
    var src = String(text || '').replace(/\s+/g, ' ').trim();
    if (!src) return [];
    var guarded = src
      .replace(/\b(Mr|Mrs|Ms|Dr|Prof|e\.g|i\.e|vs|etc|St)\./gi, '$1\u0001')
      .replace(/(\d+)\.(\d+)/g, '$1\u0001$2');
    var rawParts = guarded.split(/(?<=[.!?])\s+(?=[A-Z0-9"“‘])/);
    var out = [];
    for (var i = 0; i < rawParts.length; i++) {
      var clean = rawParts[i].replace(/\u0001/g, '.').trim();
      if (clean) out.push(clean);
    }
    return out.length ? out : [src];
  }

  function tokenizeWords(sentence) {
    return String(sentence || '').trim().split(/\s+/).filter(Boolean);
  }

  function toEngineVocabList(words) {
    return (words || []).map(function (w, idx) {
      var term = String(w.word || w.term || '').trim();
      var audioUrl = w.audioUrl ? resolveMediaUrl(w.audioUrl) : '';
      return {
        id: w.id || ('sp_w_' + idx),
        term: term,
        word: term,
        origin: w.origin || '',
        pos: w.pos || '',
        ipa: w.ipa || '',
        vi: w.defVi || w.vi || '',
        en: w.defEn || w.en || '',
        defVi: w.defVi || w.vi || '',
        defEn: w.defEn || w.en || '',
        examples: Array.isArray(w.examples) ? w.examples : [],
        audioUrl: audioUrl,
        ukAudio: w.ukAudio || audioUrl,
        usAudio: w.usAudio || ''
      };
    }).filter(function (item) {
      return Boolean(item.term);
    });
  }

  function dedupeVocabTips(list) {
    var out = [];
    var seen = new Set();
    for (var i = 0; i < (list || []).length; i++) {
      var t = list[i];
      if (!t || !t.word) continue;
      var k = t.word.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(t);
    }
    return out;
  }

  function parseParagraphObject(rawPara, metaInfo, lexCollector) {
    var rawSents = Array.isArray(rawPara && rawPara.s) ? rawPara.s : [];
    var sentences = [];
    var textParts = [];
    var tips = [];
    var tipSeen = new Set();

    for (var i = 0; i < rawSents.length; i++) {
      var rs = rawSents[i];
      if (!rs || !rs.t) continue;
      var txt = String(rs.t).replace(/\s+/g, ' ').trim();
      if (!txt || /^\d+\.?$/.test(txt)) continue;

      var sAudio = resolveMediaUrl(rs.a);
      var sTips = [];
      if (Array.isArray(rs.v)) {
        for (var vi = 0; vi < rs.v.length; vi++) {
          var tup = rs.v[vi];
          if (!tup || !tup[0]) continue;
          var phrase = String(tup[0]).trim();
          var meaningVi = String(tup[1] || '').trim();
          var kind = Number(tup[2] || 0);
          var tipObj = {
            word: phrase,
            ipa: '',
            meaning: meaningVi,
            kind: kind,
            isExpr: kind === 1
          };
          sTips.push(tipObj);
          var tk = phrase.toLowerCase();
          if (!tipSeen.has(tk)) {
            tipSeen.add(tk);
            tips.push(tipObj);
          }
          if (lexCollector) {
            lexCollector(phrase, meaningVi, kind, txt, metaInfo);
          }
        }
      }

      var sEdits = Array.isArray(rs.e) ? rs.e : [];
      sentences.push({
        text: txt,
        audioUrl: sAudio,
        vocabTips: sTips,
        edits: sEdits
      });
      textParts.push(txt);
    }

    var paraAudio = resolveMediaUrl(rawPara && rawPara.a);
    return {
      en: textParts.join(' '),
      vi: '',
      audioUrl: paraAudio,
      sentences: sentences,
      vocabTips: tips
    };
  }

  // Split single merged paragraph containing inline markers like "1.", "2.", "3." into multiple paragraphs
  function normalizeRawParagraphs(rawParas, expectedQCount) {
    var paras = Array.isArray(rawParas) ? rawParas : [];
    if (paras.length !== 1 || expectedQCount <= 1) return paras;

    var sList = Array.isArray(paras[0] && paras[0].s) ? paras[0].s : [];
    var buckets = [];
    var cur = null;
    for (var i = 0; i < sList.length; i++) {
      var st = sList[i];
      var txt = String((st && st.t) || '').trim();
      if (/^\d+\.?$/.test(txt)) {
        if (cur && cur.s.length) buckets.push(cur);
        cur = { s: [] };
      } else {
        if (!cur) cur = { s: [] };
        cur.s.push(st);
      }
    }
    if (cur && cur.s.length) buckets.push(cur);
    return buckets.length > 1 ? buckets : paras;
  }

  function chunkItemsIntoDecks(items, chunkSize, idPrefix, titlePrefix, groupName) {
    var decks = [];
    var minTail = Math.max(25, Math.floor(chunkSize * 0.35));
    var slices = [];
    for (var i = 0; i < items.length; i += chunkSize) {
      var remain = items.length - (i + chunkSize);
      if (remain > 0 && remain < minTail) {
        slices.push(items.slice(i));
        break;
      }
      slices.push(items.slice(i, i + chunkSize));
    }
    var totalParts = slices.length;
    for (var s = 0; s < totalParts; s++) {
      var partNo = s + 1;
      var suffix = totalParts > 1 ? (' (Phần ' + partNo + '/' + totalParts + ')') : '';
      decks.push({
        id: idPrefix + '_' + partNo,
        title: titlePrefix + suffix,
        group: groupName,
        words: slices[s]
      });
    }
    return decks;
  }

  function formatPronSummary(wordsSlice, fallbackLabel) {
    var tokens = [];
    var seen = new Set();
    for (var i = 0; i < wordsSlice.length; i++) {
      var title = String((wordsSlice[i] && wordsSlice[i].defEn) || '').trim();
      if (!title || /^Giới thiệu/i.test(title)) continue;
      var m = /(\/[^\/]+\/|-\w+|có -r)/i.exec(title);
      var tag = m ? m[1] : title.replace(/^(Phụ âm|Nguyên âm|Cụm phụ âm|Âm đuôi)\s*/i, '').trim();
      if (tag && !seen.has(tag)) {
        seen.add(tag);
        tokens.push(tag);
      }
    }
    if (!tokens.length) return fallbackLabel;
    if (tokens.length <= 4) return tokens.join(', ');
    return tokens.slice(0, 3).join(', ') + ' … ' + tokens[tokens.length - 1];
  }

  function classifyPronCategory(title) {
    var t = String(title || '');
    if (/Cụm phụ âm|âm đuôi/i.test(t)) return 'cluster';
    if (/Nguyên âm/i.test(t)) return 'vowel';
    return 'consonant';
  }

  function classifyPart1Group(quarter) {
    if (!quarter) return null;
    if (quarter === 'Q3/2026') return '🔥 Part 1 · Q3/2026 (Mới nhất)';
    if (quarter === 'Q2/2026') return '⚡ Part 1 · Q2/2026';
    if (quarter === 'Q1/2026') return '⚡ Part 1 · Q1/2026';
    if (/\/2025$/.test(quarter)) return '🗂️ Part 1 · Kho Forecast 2025';
    return '🗄️ Part 1 · Kho Forecast 2024';
  }

  function classifyPart1CoreGroup(cleanTopic) {
    var first = String(cleanTopic || '').replace(/^[^A-Za-z]+/, '').charAt(0).toUpperCase() || 'A';
    if (first <= 'F') return '🌱 Part 1 · Chủ đề Cơ bản (A–F)';
    if (first <= 'O') return '🌱 Part 1 · Chủ đề Cơ bản (G–O)';
    return '🌱 Part 1 · Chủ đề Cơ bản (P–Z)';
  }

  function classifyPart23Group(quarter) {
    if (!quarter) return null;
    if (quarter === 'Q3/2026') return '🔥 Part 2 · Q3/2026 (Mới nhất)';
    if (quarter === 'Q2/2026') return '⚡ Part 2 · Q2/2026';
    if (quarter === 'Q1/2026') return '⚡ Part 2 · Q1/2026';
    if (/\/2025$/.test(quarter)) return '🗂️ Part 2 · Kho Forecast 2025';
    return '🗄️ Part 2 · Kho Forecast 2024';
  }

  function classifyPart23CoreTheme(title, partNo) {
    var prefix = partNo === 3 ? 'Part 3' : 'Part 2';
    var t = String(title || '');
    if (/\b(person|someone|friend|family|teacher|neighbour|neighbor|old person|child|athlete|sportsperson|singer|actor|famous|colleague|leader|writer|artist)\b/i.test(t)) {
      return '👤 ' + prefix + ' · Con người (Person)';
    }
    if (/\b(place|city|town|country|building|park|garden|house|home|room|restaurant|cafe|shop|library|museum|area|street|village|destination)\b/i.test(t)) {
      return '📍 ' + prefix + ' · Địa điểm (Place)';
    }
    if (/\b(time when|occasion|event|experience|moment|day|trip|journey|holiday|celebration|party|festival|competition|game you played|something you did|first time|changed your mind)\b/i.test(t)) {
      return '⏳ ' + prefix + ' · Sự kiện & Trải nghiệm';
    }
    return '🎁 ' + prefix + ' · Đồ vật, Hoạt động & Ý tưởng';
  }

  function classifyPzTopicGroup(rawGroup) {
    var g = String(rawGroup || '');
    if (/2026/.test(g)) return '⚡ Đề Dự Đoán 2026 (Q1–Q3)';
    if (/Sample Pack/i.test(g)) return '📚 Bộ Đề Sample Packs 1 & 2';
    if (/2025/.test(g)) return '🗂️ Kho Dự Đoán 2025 (Q1–Q3)';
    return '🗄️ Kho Dự Đoán 2021–2024';
  }

  function quarterRank(str) {
    var m = /Q([1-4])\/(20\d\d)/i.exec(String(str || ''));
    if (!m) return 0;
    return Number(m[2]) * 10 + Number(m[1]);
  }

  // Từ vựng đơn phổ thông (A1–B2), trạng từ/từ đệm giao tiếp cơ bản không cần nhồi vào kho Vocab Band 7.0–9.0
  var BASIC_SPEAKING_SINGLE_WORDS = new Set([
    'actually','probably','definitely','obviously','honestly','basically','seriously',
    'certainly','usually','normally','recently','lately','nowadays','generally',
    'specifically','particularly','especially','completely','totally','literally',
    'absolutely','extremely','incredibly','surprisingly','unfortunately','fortunately',
    'personally','currently','originally','previously','eventually','immediately',
    'frequently','constantly','regularly','occasionally','sometimes','rarely',
    'moreover','furthermore','however','therefore','nevertheless','nonetheless',
    'otherwise','meanwhile','instead','besides','although','because','though',
    'whatever','whenever','wherever','everything','something','anything','nothing',
    'everyone','someone','anyone','everybody','somebody','anybody','nobody',
    'important','interesting','wonderful','amazing','awesome','fantastic',
    'terrible','horrible','beautiful','gorgeous','pretty','handsome','attractive',
    'different','similar','various','several','multiple','numerous','common',
    'popular','famous','favorite','favourite','special','ordinary','normal',
    'regular','typical','standard','classic','modern','ancient','traditional',
    'simple','complex','difficult','challenging','possible','impossible','necessary',
    'essential','helpful','useful','meaningful','powerful','peaceful','stressful',
    'cheerful','colorful','colourful','careful','grateful','thankful',
    'comfortable','enjoyable','affordable','convenient','delicious','expensive',
    'inexpensive','unfortunate','conveniences','pleasant','exciting','relaxing',
    'boring','tiring','annoying','confusing','mysterious','restless','battered',
    'morning','afternoon','evening','weekend','holiday','vacation','birthday',
    'festival','schedule','routine','homework','assignment','subject','teacher',
    'student','classmate','colleague','neighbor','neighbour','relative','parents',
    'brother','sister','children','teenager','elderly','customer','passenger',
    'activity','exercise','practice','hobby','interest','memory','experience',
    'problem','question','solution','situation','decision','opinion','example',
    'company','business','industry','economy','economics','hospital','library',
    'university','building','apartment','furniture','kitchen','bedroom','bathroom',
    'balcony','weather','climate','season','summer','winter','spring','autumn',
    'transport','vehicle','bicycle','motorbike','traffic','highway','airport',
    'internet','software','computer','keyboard','platform','website','network',
    'message','shopping','clothes','fashion','healthy','illness','medicine',
    'culture','history','science','society','country','village','downtown',
    'childhood','education','knowledge','language','speaking','listening','reading',
    'writing','improve','develop','achieve','explore','explain','describe',
    'remember','discover','consider','mention','prefer','require','provide',
    'support','include','involve','suggest','prepare','organize','organise',
    'celebrate','enjoyed','visited','watched','studied','learned','travelled',
    'traveled','working','playing','looking','thinking','talking','walking',
    'running','getting','making','taking','having','going','coming','trying',
    'feeling','finding','showing','keeping','helping','leaving','starting','living',
    'headphones','souvenirs','postcards','whiteboard','discussion','geometry',
    'algebra','formulas','swayed','calming','sketch','produce','locals','stalls',
    'piled','vendors','chains','aisles','packaged','bargain','dwellers',
    'switching','hassle','beaming','picture','teary','airfares','backyard',
    'rereading','squinting','straining','itinerary','astronomy','brand-new'
  ]);

  var FILLER_PHRASE_RE = /^(?:oh|ah|yes|no|well|plus|also|so|and|but|or|say|like|maybe|perhaps|probably|actually|basically|obviously|honestly|frankly|personally|generally|usually|sometimes|often|always|never|still|yet|though|anyway|besides|however|moreover|furthermore|therefore|meanwhile|instead|indeed|especially|particularly|definitely|absolutely|totally|really|quite|very|pretty|granted|looking back|for sure|for example|for instance|in fact|of course|i think|i mean|i guess|i suppose|i admit|i'd say|to be honest|truth be told|that'd be|that’d be|sort of|kind of|back then|all in all|by and large|on the whole|in general|after all|at first|at last|no wonder|no doubt|needless to say|not really|you know|you see|right now|these days|nowadays|as well|such as|so yeah|and so on|all the rest|or something|something like that|that kind of thing|pretty much)(?!-)\b/i;

  function isKeepableSpeakingVocab(phrase, pronWordsSet) {
    var txt = String(phrase || '').replace(/\s+/g, ' ').trim();
    if (!txt || txt.length < 4 || txt.length > 52) return false;
    if (/[,?;:!()\[\]"]/.test(txt)) return false;
    if (/^\d+$/.test(txt)) return false;

    var words = txt.split(/\s+/).filter(Boolean);
    if (words.length > 6) return false;
    if (FILLER_PHRASE_RE.test(txt)) return false;
    if (/^(don't get me wrong|to say the least|i'll admit|not to mention|to cut a long story short)/i.test(txt)) return false;

    var lower = txt.toLowerCase();
    if (words.length === 1) {
      var base = lower.replace(/[^a-z'-]/g, '');
      if (!base) return false;
      if (pronWordsSet && pronWordsSet.has(base)) return false;
      if (BASIC_SPEAKING_SINGLE_WORDS.has(base)) return false;
      var hasHyphen = base.indexOf('-') !== -1;
      if (hasHyphen) {
        return base.length >= 7 && !/^(air-con|e-book|t-shirt|ex-boy|co-work|brand-new)/i.test(base);
      }
      // Bỏ từ đơn ngắn phổ thông (< 10 ký tự), chỉ giữ từ học thuật/tả sâu Band 7.5+
      if (base.length < 10) {
        return /^(nostalgic|curriculum|sentimental|therapeutic|charismatic|authentic|versatile|memorable|resilient|elaborate|pragmatic|unanimous|ubiquitous|lucrative|ephemeral|resilience|intricate)$/i.test(base);
      }
      if (/(?:ings|ing|ed|es|s|ly)$/.test(base)) {
        var stem = base.replace(/(?:ings|ing|ed|es|s|ly)$/, '');
        if (stem.length <= 7 || (pronWordsSet && pronWordsSet.has(stem)) || BASIC_SPEAKING_SINGLE_WORDS.has(stem)) {
          return false;
        }
      }
      return true;
    }

    if (/^(a lot|lots of|so many|so much|too much|too many|very good|very nice|really good|really nice|pretty good|quite good|a bit|a little|right now|right here|right there|over there|back home|last year|next year|every day|every week|every year|every time|all day|all night|one day|some day|this time|next time|last time|first time|many people|some people|most people|young people|old people|at home|at work|at school|go home|go out|come back|get up|wake up|pick up|down to|back seat|window seat|key rings)$/i.test(lower)) {
      return false;
    }
    return true;
  }

  function classifyVocabBucket(quarterLabel) {
    var q = String(quarterLabel || '').trim();
    if (/^Q3\/2026$/i.test(q)) return 'Q3/2026';
    if (/^Q2\/2026$/i.test(q)) return 'Q2/2026';
    if (/^Q1\/2026$/i.test(q)) return 'Q1/2026';
    if (/2025$/.test(q)) return 'Kho 2025';
    if (/2024$/.test(q)) return 'Kho 2024';
    return 'Chủ đề Cốt lõi';
  }

  function buildVocabLessons(lexBucketsMap) {
    var vocabLessons = [];
    var orderCounter = 1;
    var totalWords = 0;

    // Đã xóa toàn bộ 34 bộ Phát âm (1.468 từ cơ bản) khỏi u_1 (đã có đủ ở u_5 Phát âm & CT).
    // Chỉ giữ Collocations, Idioms, Phrasal Verbs & Từ vựng C1-C2 gom gọn theo Quý / Kho.
    var bucketMeta = {
      'Q3/2026': { rank: 6, folder: '🔥 Từ vựng & Idioms · Mới nhất 2026', title: 'Q3/2026 · Collocations & Idioms' },
      'Q2/2026': { rank: 5, folder: '🔥 Từ vựng & Idioms · Mới nhất 2026', title: 'Q2/2026 · Collocations & Idioms' },
      'Q1/2026': { rank: 4, folder: '🔥 Từ vựng & Idioms · Mới nhất 2026', title: 'Q1/2026 · Collocations & Idioms' },
      'Kho 2025': { rank: 3, folder: '🗂️ Từ vựng & Idioms · Kho 2024–2025', title: 'Kho 2025 · Collocations & Idioms' },
      'Kho 2024': { rank: 2, folder: '🗂️ Từ vựng & Idioms · Kho 2024–2025', title: 'Kho 2024 · Collocations & Idioms' },
      'Chủ đề Cốt lõi': { rank: 1, folder: '💬 Từ vựng & Idioms · Chủ đề Cốt lõi', title: 'Chủ đề Cốt lõi · Collocations & Idioms' }
    };

    var sortedBuckets = Array.from(lexBucketsMap.entries()).sort(function (a, b) {
      var ra = (bucketMeta[a[0]] && bucketMeta[a[0]].rank) || 0;
      var rb = (bucketMeta[b[0]] && bucketMeta[b[0]].rank) || 0;
      if (ra !== rb) return rb - ra;
      return a[0].localeCompare(b[0]);
    });

    sortedBuckets.forEach(function (entry) {
      var bucketKey = entry[0];
      var words = entry[1];
      if (!words || !words.length) return;
      var meta = bucketMeta[bucketKey] || { folder: '💬 Từ vựng & Idioms · Chủ đề Cốt lõi', title: bucketKey + ' · Collocations & Idioms' };

      var decks = chunkItemsIntoDecks(
        words,
        105,
        'sp_v_lex_' + hashCode(bucketKey).toString(36),
        meta.title,
        meta.folder
      );
      decks.forEach(function (dk) {
        var eng = toEngineVocabList(dk.words);
        totalWords += eng.length;
        vocabLessons.push({
          id: dk.id,
          unitId: 'u_1',
          unitTitle: UNIT_META.u_1.title,
          unitShort: UNIT_META.u_1.short,
          type: 'vocab_srs',
          order: orderCounter++,
          title: dk.title,
          cleanTitle: dk.title,
          group: dk.group,
          description: 'Collocations, Idioms & Cụm diễn đạt học thuật Band 7.0–9.0 (đã lọc bỏ từ cơ bản & luyện phát âm).',
          vocabList: eng,
          wordCount: eng.length
        });
      });
    });

    return { lessons: vocabLessons, totalWords: totalWords };
  }

  function init(rawData) {
    _raw = rawData || (typeof global !== 'undefined' ? global.STUDY4_SPEAKING_DATA : null);
    _lessons = [];
    _lessonMap = new Map();
    _globalVocabPool = [];
    _part1Pool = [];
    _part23Pool = [];
    _pzTopicsP1 = [];
    _pzTopicsP23 = [];

    if (!_raw || !Array.isArray(_raw.part1)) {
      _stats = {
        total: 0,
        vocabTopics: 0,
        vocabWords: 0,
        part1: 0,
        part2: 0,
        part3: 0,
        theory: 0,
        practiceZone: 0,
        totalQuestions: 0,
        byUnit: { u_1: 0, u_2: 0, u_3: 0, u_4: 0, u_5: 0, u_6: 0 }
      };
      return { stats: _stats, lessons: _lessons };
    }

    _mediaBase = (_raw.meta && _raw.meta.mediaBase) || DEFAULT_MEDIA_BASE;

    var seenGlobalWords = new Set();
    var lexBucketsMap = new Map();
    var seenLexSrs = new Set();

    // Thu thập trước danh sách từ luyện phát âm cơ bản để loại khỏi kho Từ mới SRS (giữ bên u_5)
    var pronWordsSet = new Set();
    var videosRaw = Array.isArray(_raw.videos) ? _raw.videos : [];
    var pronRaw = Array.isArray(_raw.pronunciation) ? _raw.pronunciation : [];
    pronRaw.forEach(function (p) {
      (p.drills || []).forEach(function (dr) {
        (dr.items || []).forEach(function (it) {
          if (it && it.w) pronWordsSet.add(String(it.w).toLowerCase().trim());
        });
      });
    });

    function pushGlobalWord(word, ipa, meaning) {
      var w = String(word || '').trim();
      if (!w) return;
      var k = w.toLowerCase();
      if (seenGlobalWords.has(k)) return;
      seenGlobalWords.add(k);
      _globalVocabPool.push({ word: w, ipa: ipa || '', meaning: meaning || '' });
    }

    function collectSampleLexis(phrase, meaningVi, kind, exEn, metaInfo) {
      pushGlobalWord(phrase, '', meaningVi);
      if (!isKeepableSpeakingVocab(phrase, pronWordsSet)) return;
      var cleanPhrase = String(phrase || '').replace(/\s+/g, ' ').trim();
      var k = cleanPhrase.toLowerCase();
      if (seenLexSrs.has(k)) return;
      if (k.length > 4 && /s$/.test(k) && seenLexSrs.has(k.slice(0, -1))) return;
      seenLexSrs.add(k);

      var bKey = classifyVocabBucket(metaInfo.quarter);
      if (!lexBucketsMap.has(bKey)) lexBucketsMap.set(bKey, []);
      lexBucketsMap.get(bKey).push({
        id: 'sv_' + hashCode(k).toString(36),
        word: cleanPhrase,
        pos: kind === 1 ? '(Idiom/Expr)' : ('(' + (metaInfo.partTag || 'Speaking') + ')'),
        ipa: '',
        defVi: meaningVi || '',
        defEn: metaInfo.topic ? ('Topic: ' + metaInfo.topic) : '',
        examples: exEn ? [exEn] : []
      });
    }

    var totalQuestions = 0;

    // -----------------------------------------------------------------------
    // 1. Parse Pronunciation & Videos (u_5 Phát âm & Chiến thuật)
    // -----------------------------------------------------------------------
    var theoryLessons = [];

    videosRaw.forEach(function (v, idx) {
      theoryLessons.push({
        id: v.id || ('sp_vid_' + idx),
        actId: v.actId || '',
        unitId: 'u_5',
        unitTitle: UNIT_META.u_5.title,
        unitShort: UNIT_META.u_5.short,
        type: 'theory',
        subtype: 'video',
        order: idx + 1,
        title: v.title || ('Video ' + (idx + 1)),
        cleanTitle: stripNumberPrefix(v.title),
        group: v.group || 'Chiến thuật Speaking Video',
        durationLabel: '🎬 Video bài giảng' + (v.pdfs && v.pdfs.length ? ' + PDF' : ''),
        youtubeId: v.yt || '',
        pdfs: (v.pdfs || []).map(resolveMediaUrl),
        slides: (v.slides || []).map(resolveMediaUrl),
        htmlContent: '',
        drills: [],
        keyChecklist: [
          'Xem kỹ video hướng dẫn cấu trúc trả lời & chiến lược xử lý câu hỏi.',
          'Tải hoặc xem tài liệu PDF đi kèm để ghi chú cấu trúc trọng tâm.',
          'Thực hành ngay trên các chủ đề Part 1–3 trong Speaking Studio.'
        ],
        quickPractice: []
      });
    });

    pronRaw.forEach(function (p, idx) {
      var drills = Array.isArray(p.drills) ? p.drills : [];
      var drillWordsTotal = 0;
      var gFull = p.groupFull || p.group || 'Phát âm chuẩn Anh-Anh / Anh-Mỹ';
      var isBigVowelConsGroup = /Nguyên âm.*phụ âm/i.test(gFull);
      var pronCatKey = classifyPronCategory(p.title);
      var pronTheoryGroup = isBigVowelConsGroup
        ? (pronCatKey === 'vowel'
          ? 'Phát âm · Nguyên âm (Vowels)'
          : (pronCatKey === 'cluster' ? 'Phát âm · Cụm phụ âm & Âm đuôi' : 'Phát âm · Phụ âm (Consonants)'))
        : ('Phát âm · ' + gFull);

      drills.forEach(function (dr) {
        var items = Array.isArray(dr.items) ? dr.items : [];
        drillWordsTotal += items.length;
        items.forEach(function (it) {
          if (!it || !it.w) return;
          pushGlobalWord(it.w, it.ipa || '', it.vi || '');
        });
      });

      theoryLessons.push({
        id: p.id || ('sp_pr_' + idx),
        unitId: 'u_5',
        unitTitle: UNIT_META.u_5.title,
        unitShort: UNIT_META.u_5.short,
        type: 'theory',
        subtype: 'pronunciation',
        order: videosRaw.length + idx + 1,
        title: p.title || ('Phát âm ' + (idx + 1)),
        cleanTitle: stripNumberPrefix(p.title),
        group: pronTheoryGroup,
        durationLabel: drillWordsTotal
          ? ('🔊 ' + drills.length + ' bài luyện đọc (' + drillWordsTotal + ' từ)')
          : '📖 Lý thuyết Phát âm',
        htmlContent: p.theoryHtml || '',
        youtubes: Array.isArray(p.youtubes) ? p.youtubes : [],
        drills: drills,
        keyChecklist: [
          'Nghe kỹ âm mẫu trong bài giảng hoặc video khẩu hình.',
          'Bấm nghe từng từ & câu ví dụ trong mục Listen & Repeat rồi tự đọc theo.',
          'Kiểm tra độ khớp bằng nút Ghi âm bên dưới để luyện chuẩn âm đuôi & trọng âm.'
        ],
        quickPractice: []
      });
    });

    // Sắp xếp lại thứ tự giáo trình Unit 5: 4 chương Video Chiến thuật -> Nguyên âm -> Phụ âm -> Cụm âm & Âm đuôi -> Trọng âm -> Nhịp điệu -> Ngữ điệu -> Nối âm
    var u5GroupOrder = {
      '1. Tổng quan về IELTS Speaking': 1,
      '2. Hướng dẫn trả lời Part 1': 2,
      '3. Hướng dẫn trả lời Part 2': 3,
      '4. Hướng dẫn trả lời Part 3': 4,
      'Phát âm · Nguyên âm (Vowels)': 5,
      'Phát âm · Phụ âm (Consonants)': 6,
      'Phát âm · Cụm phụ âm & Âm đuôi': 7,
      'Phát âm · Trọng âm (Stress)': 8,
      'Phát âm · Nhịp điệu (Rhythm) và cụm từ diễn tả ý tưởng (Thought groups)': 9,
      'Phát âm · Ngữ điệu (Intonation)': 10,
      'Phát âm · Liên kết (Linking) và nối âm (Connected speech)': 11
    };
    theoryLessons.sort(function (a, b) {
      var ga = u5GroupOrder[a.group] || 99;
      var gb = u5GroupOrder[b.group] || 99;
      if (ga !== gb) return ga - gb;
      return a.order - b.order;
    });

    // -----------------------------------------------------------------------
    // 2. Parse Part 1 Topics (u_2)
    // -----------------------------------------------------------------------
    var part1Lessons = [];
    var p1RawList = Array.isArray(_raw.part1) ? _raw.part1 : [];
    p1RawList.forEach(function (p1, idx) {
      var rawQs = Array.isArray(p1.questions) ? p1.questions : [];
      var rawParas = normalizeRawParagraphs(p1.paragraphs, rawQs.length);
      var parsedParas = rawParas.map(function (rp, pi) {
        return parseParagraphObject(
          rp,
          { partTag: 'Part 1', quarter: p1.quarter || 'Chủ đề Cốt lõi', topic: p1.topic || p1.title },
          collectSampleLexis
        );
      });

      var builtQs = [];
      var qCount = Math.max(rawQs.length, parsedParas.length);
      if (qCount === 0) qCount = 1;

      for (var qi = 0; qi < qCount; qi++) {
        var qRaw = rawQs[qi];
        var pObj = parsedParas[qi] || (rawQs.length > 0 && parsedParas.length === 1 && qi === 0 ? parsedParas[0] : null);
        var qClean = qRaw
          ? cleanQuestionText(qRaw)
          : ((p1.topic || stripNumberPrefix(p1.title)) + (qCount > 1 ? ' — Câu mẫu ' + (qi + 1) : ' — Câu hỏi mẫu'));

        builtQs.push({
          q: qClean,
          formula: p1.quarter ? ('Forecast ' + p1.quarter) : 'Core Part 1',
          sampleEn: pObj ? pObj.en : '',
          sampleVi: '',
          audioUrl: pObj ? pObj.audioUrl : '',
          sentences: pObj ? pObj.sentences : [],
          vocabTips: pObj ? pObj.vocabTips : [],
          roleTags: [p1.quarter || 'Band 8.0+ Sample']
        });
      }

      totalQuestions += builtQs.length;
      var combinedTips = dedupeVocabTips(builtQs.reduce(function (acc, q) {
        return acc.concat(q.vocabTips || []);
      }, []));

      var p1CleanTopic = p1.topic || stripNumberPrefix(p1.title);
      var p1GroupName = p1.quarter
        ? classifyPart1Group(p1.quarter)
        : classifyPart1CoreGroup(p1CleanTopic);

      var lessonP1 = {
        id: p1.id,
        actId: p1.actId,
        unitId: 'u_2',
        unitTitle: UNIT_META.u_2.title,
        unitShort: UNIT_META.u_2.short,
        type: 'part1',
        order: idx + 1,
        title: p1.title,
        cleanTitle: p1CleanTopic,
        quarter: p1.quarter || '',
        group: p1GroupName,
        topicTag: p1.quarter || 'Everyday',
        questions: builtQs,
        vocabTips: combinedTips,
        questionCount: builtQs.length
      };
      part1Lessons.push(lessonP1);
      _part1Pool.push(lessonP1);
    });

    // Sắp xếp lại Part 1 theo 3 tầng: 2026 (mới nhất) -> 2025 -> 2024 -> Cơ bản A-Z
    var p1GroupOrder = {
      '🔥 Part 1 · Q3/2026 (Mới nhất)': 1,
      '⚡ Part 1 · Q2/2026': 2,
      '⚡ Part 1 · Q1/2026': 3,
      '🗂️ Part 1 · Kho Forecast 2025': 4,
      '🗄️ Part 1 · Kho Forecast 2024': 5,
      '🌱 Part 1 · Chủ đề Cơ bản (A–F)': 6,
      '🌱 Part 1 · Chủ đề Cơ bản (G–O)': 7,
      '🌱 Part 1 · Chủ đề Cơ bản (P–Z)': 8
    };
    part1Lessons.sort(function (a, b) {
      var ga = p1GroupOrder[a.group] || 99;
      var gb = p1GroupOrder[b.group] || 99;
      if (ga !== gb) return ga - gb;
      var qa = quarterRank(a.quarter);
      var qb = quarterRank(b.quarter);
      if (qa !== qb) return qb - qa;
      return a.order - b.order;
    });

    // -----------------------------------------------------------------------
    // 3. Parse Part 2 + Part 3 Topics (u_3 & u_4 linked together)
    // -----------------------------------------------------------------------
    var part2Lessons = [];
    var part3Lessons = [];
    var p23RawList = Array.isArray(_raw.part23) ? _raw.part23 : [];

    p23RawList.forEach(function (item, idx) {
      var slugNum = String(item.id || ('sp_p23_' + (idx + 1))).replace(/^sp_p23_/, '');
      var p2Id = 'sp_p2_' + slugNum;
      var p3Id = 'sp_p3_' + slugNum;
      var cc = item.cueCard || { title: item.topic || item.title, intro: 'You should say:', bullets: [] };
      var cleanTopic = item.topic || cc.title || stripNumberPrefix(item.title);

      // Build Part 2 Samples (some topics have multiple model answers!)
      var rawP2Samples = Array.isArray(item.part2Samples) ? item.part2Samples : [];
      var p2SampleSets = rawP2Samples.map(function (smp, sIdx) {
        var paras = (smp.paragraphs || []).map(function (rp, pi) {
          var parsed = parseParagraphObject(
            rp,
            { partTag: 'Part 2+3', quarter: item.quarter || 'Chủ đề Cốt lõi', topic: cleanTopic },
            collectSampleLexis
          );
          parsed.roleLabel = (rawP2Samples.length > 1 ? (smp.label + ' · ') : '') + 'Đoạn ' + (pi + 1);
          parsed.role = pi === 0 ? 'lead' : 'body';
          return parsed;
        });
        return {
          actId: smp.actId || '',
          label: smp.label || ('Sample ' + (sIdx + 1)),
          paragraphs: paras
        };
      });

      var p2AllParas = p2SampleSets.length ? p2SampleSets[0].paragraphs : [];
      var p2AllTips = dedupeVocabTips(p2SampleSets.reduce(function (acc, s) {
        (s.paragraphs || []).forEach(function (p) { acc = acc.concat(p.vocabTips || []); });
        return acc;
      }, []));

      var p2GroupName = item.quarter
        ? classifyPart23Group(item.quarter)
        : classifyPart23CoreTheme(item.title, 2);

      var lessonP2 = {
        id: p2Id,
        unitId: 'u_3',
        unitTitle: UNIT_META.u_3.title,
        unitShort: UNIT_META.u_3.short,
        type: 'part2',
        order: idx + 1,
        linkedPart3Id: p3Id,
        title: item.title,
        cleanTitle: cleanTopic,
        quarter: item.quarter || '',
        group: p2GroupName,
        cueCard: {
          prompt: cc.title || cleanTopic,
          intro: cc.intro || 'You should say:',
          bullets: Array.isArray(cc.bullets) ? cc.bullets : []
        },
        prepNotesTemplate: (cc.bullets || []).map(function (b) { return '• ' + b + ': '; }),
        sampleSets: p2SampleSets,
        sampleParagraphs: p2AllParas,
        vocabTips: p2AllTips,
        prepSeconds: 60,
        talkSeconds: 120
      };
      part2Lessons.push(lessonP2);

      // Build Part 3 Discussion Questions & Sample Answers
      var rawP3Samples = Array.isArray(item.part3Samples) ? item.part3Samples : [];
      var p3ExplicitQs = (Array.isArray(item.part3Questions) && item.part3Questions.length)
        ? item.part3Questions
        : (rawP3Samples[0] && Array.isArray(rawP3Samples[0].questions) ? rawP3Samples[0].questions : []);

      var p3BuiltQs = [];
      if (rawP3Samples.length) {
        var firstSmp = rawP3Samples[0];
        var normParas3 = normalizeRawParagraphs(firstSmp.paragraphs, p3ExplicitQs.length);
        var parsedParas3 = normParas3.map(function (rp) {
          return parseParagraphObject(
            rp,
            { partTag: 'Part 2+3', quarter: item.quarter || 'Chủ đề Cốt lõi', topic: cleanTopic },
            collectSampleLexis
          );
        });

        var p3QCount = Math.max(p3ExplicitQs.length, parsedParas3.length);
        if (p3QCount === 0) p3QCount = 1;
        for (var qi3 = 0; qi3 < p3QCount; qi3++) {
          var qStr3 = p3ExplicitQs[qi3];
          var p3Obj = parsedParas3[qi3] || (p3ExplicitQs.length > 0 && parsedParas3.length === 1 && qi3 === 0 ? parsedParas3[0] : null);
          p3BuiltQs.push({
            q: qStr3
              ? cleanQuestionText(qStr3)
              : ('Thảo luận Part 3: ' + cleanTopic + (p3QCount > 1 ? ' — Ý ' + (qi3 + 1) : '')),
            formula: item.quarter ? ('Forecast ' + item.quarter) : 'Part 3 Analysis',
            sampleEn: p3Obj ? p3Obj.en : '',
            sampleVi: '',
            audioUrl: p3Obj ? p3Obj.audioUrl : '',
            sentences: p3Obj ? p3Obj.sentences : [],
            vocabTips: p3Obj ? p3Obj.vocabTips : [],
            roleTags: ['Part 3 Academic']
          });
        }

        // Also extract vocabulary from extra Part 3 samples if any
        for (var exIdx = 1; exIdx < rawP3Samples.length; exIdx++) {
          (rawP3Samples[exIdx].paragraphs || []).forEach(function (rp) {
            parseParagraphObject(
              rp,
              { partTag: 'Part 2+3', quarter: item.quarter || 'Chủ đề Cốt lõi', topic: cleanTopic },
              collectSampleLexis
            );
          });
        }
      } else {
        p3ExplicitQs.forEach(function (qText) {
          p3BuiltQs.push({
            q: cleanQuestionText(qText),
            formula: 'Part 3 Analysis',
            sampleEn: '',
            sampleVi: '',
            audioUrl: '',
            sentences: [],
            vocabTips: [],
            roleTags: ['Part 3 Discussion']
          });
        });
      }

      totalQuestions += 1 + p3BuiltQs.length;
      var p3AllTips = dedupeVocabTips(p3BuiltQs.reduce(function (acc, q) {
        return acc.concat(q.vocabTips || []);
      }, []));

      var p3GroupName = item.quarter
        ? classifyPart23Group(item.quarter).replace('Part 2', 'Part 3')
        : classifyPart23CoreTheme(item.title, 3);

      var lessonP3 = {
        id: p3Id,
        unitId: 'u_4',
        unitTitle: UNIT_META.u_4.title,
        unitShort: UNIT_META.u_4.short,
        type: 'part3',
        order: idx + 1,
        linkedPart2Id: p2Id,
        title: item.title,
        cleanTitle: cleanTopic,
        quarter: item.quarter || '',
        group: p3GroupName,
        cueCardSummary: cc.title || cleanTopic,
        questions: p3BuiltQs,
        vocabTips: p3AllTips,
        questionCount: p3BuiltQs.length
      };
      part3Lessons.push(lessonP3);
      _part23Pool.push({ part2: lessonP2, part3: lessonP3 });
    });

    // Sắp xếp lại Part 2 & Part 3 theo 3 tầng: 2026 -> 2025 -> 2024 -> 4 Nhóm Chủ điểm
    var p23GroupOrder = {
      '🔥 Part 2 · Q3/2026 (Mới nhất)': 1,
      '⚡ Part 2 · Q2/2026': 2,
      '⚡ Part 2 · Q1/2026': 3,
      '🗂️ Part 2 · Kho Forecast 2025': 4,
      '🗄️ Part 2 · Kho Forecast 2024': 5,
      '👤 Part 2 · Con người (Person)': 6,
      '📍 Part 2 · Địa điểm (Place)': 7,
      '⏳ Part 2 · Sự kiện & Trải nghiệm': 8,
      '🎁 Part 2 · Đồ vật, Hoạt động & Ý tưởng': 9
    };
    part2Lessons.sort(function (a, b) {
      var ga = p23GroupOrder[a.group] || 99;
      var gb = p23GroupOrder[b.group] || 99;
      if (ga !== gb) return ga - gb;
      var qa = quarterRank(a.quarter);
      var qb = quarterRank(b.quarter);
      if (qa !== qb) return qb - qa;
      return a.order - b.order;
    });
    part3Lessons.sort(function (a, b) {
      var kA = String(a.group || '').replace('Part 3', 'Part 2');
      var kB = String(b.group || '').replace('Part 3', 'Part 2');
      var ga = p23GroupOrder[kA] || 99;
      var gb = p23GroupOrder[kB] || 99;
      if (ga !== gb) return ga - gb;
      var qa = quarterRank(a.quarter);
      var qb = quarterRank(b.quarter);
      if (qa !== qb) return qb - qa;
      return a.order - b.order;
    });

    // -----------------------------------------------------------------------
    // 4. Parse Practice Zone (110 Full Tests + 974 Topic Sets -> u_6)
    // -----------------------------------------------------------------------
    var pzData = _raw.practiceZone || {};
    var pzFullRaw = Array.isArray(pzData.fullTests) ? pzData.fullTests : [];
    var pzTopicsRaw = Array.isArray(pzData.topics) ? pzData.topics : [];
    var pzLessons = [];

    var personas = [
      { name: 'Examiner Eleanor', accent: 'UK', lang: 'en-GB' },
      { name: 'Examiner Liam', accent: 'AU', lang: 'en-AU' },
      { name: 'Examiner Audrey', accent: 'US', lang: 'en-US' }
    ];

    pzFullRaw.forEach(function (ft, idx) {
      var persona = personas[idx % personas.length];
      var p1Qs = (ft.part1 && Array.isArray(ft.part1.questions) ? ft.part1.questions : []).map(function (qText) {
        return { q: cleanQuestionText(qText), vocabTips: [] };
      });
      var cc2 = (ft.part23 && ft.part23.cueCard) || {};
      var p3Qs = (ft.part23 && Array.isArray(ft.part23.questions) ? ft.part23.questions : []).map(function (qText) {
        return { q: cleanQuestionText(qText), vocabTips: [] };
      });
      var isActual = ft.family === 'Recent Actual Test';

      pzLessons.push({
        id: ft.id,
        unitId: 'u_6',
        unitTitle: UNIT_META.u_6.title,
        unitShort: UNIT_META.u_6.short,
        type: 'practice_full',
        pzKind: isActual ? 'full_actual' : 'full_sample',
        pzKindLabel: isActual ? 'Recent Actual Test' : 'Sample Speaking Test',
        hasPart1: p1Qs.length > 0,
        hasPart23: Boolean(cc2.prompt || p3Qs.length),
        order: idx + 1,
        title: ft.title,
        cleanTitle: ft.title,
        series: ft.family + ' · Set #' + (ft.num || (idx + 1)),
        group: isActual ? '🔥 Recent Actual Tests (34 Full Sets)' : '📘 Sample Speaking Tests (76 Full Sets)',
        examinerDefaultVoice: persona.lang,
        examinerPersona: persona,
        warmup: {
          idCheckScript: 'Good day. My name is ' + persona.name.replace(/^Examiner\s+/, '') + '. Can you tell me your full name, please? Could I see your identification document?',
          callNameScript: 'And what should I call you today?'
        },
        part1: {
          intro: (ft.part1 && ft.part1.leadIn) || 'Now, in this first part, let us talk about some everyday topics.',
          topic1Id: (ft.part1 && ft.part1.id) || '',
          topic1Title: (ft.part1 && ft.part1.leadIn) ? ft.part1.leadIn.replace(/^Let'?s talk about\s*/i, '').replace(/\.$/, '') : 'Part 1 Interview',
          topic1Qs: p1Qs,
          topic2Id: '',
          topic2Title: '',
          topic2Qs: []
        },
        part2: {
          intro: 'Now I am going to give you a topic and I would like you to talk about it for one to two minutes. Before you talk, you will have one minute to think about what you are going to say. Here is your cue card.',
          cueId: (ft.part23 && ft.part23.id) || '',
          cueTitle: cc2.prompt || ft.title,
          prompt: cc2.prompt || ft.title,
          bullets: Array.isArray(cc2.bullets) ? cc2.bullets : [],
          prepSeconds: 60,
          talkSeconds: 120,
          prepEndScript: 'All right? Remember you have one to two minutes for this. Can you start speaking now, please?',
          stopScript: 'Thank you very much. I will stop you there.',
          roundingOffQ: 'Do you often think about this topic in daily life?'
        },
        part3: {
          intro: 'We have been talking about that topic, and now I would like to discuss some more general questions related to it.',
          topicId: (ft.part23 && ft.part23.id) || '',
          topicTitle: cc2.prompt || ft.title,
          questions: p3Qs,
          closingScript: 'Thank you very much. That is the end of the Speaking test.'
        },
        lexicalTargets: []
      });
    });

    pzTopicsRaw.forEach(function (tp, idx) {
      var persona = personas[(pzFullRaw.length + idx) % personas.length];
      var isP1Only = tp.partKind === 'Part 1';
      var qObjs = (tp.questions || []).map(function (qText) {
        return { q: cleanQuestionText(qText), vocabTips: [] };
      });
      var cc = tp.cueCard || null;

      var pzTopicLesson = {
        id: tp.id,
        pzId: tp.pzId || '',
        unitId: 'u_6',
        unitTitle: UNIT_META.u_6.title,
        unitShort: UNIT_META.u_6.short,
        type: 'practice_full',
        pzKind: isP1Only ? 'topic_p1' : 'topic_p23',
        pzKindLabel: isP1Only ? 'Forecast Part 1' : 'Forecast Part 2+3',
        hasPart1: isP1Only,
        hasPart23: !isP1Only,
        order: pzFullRaw.length + idx + 1,
        title: (isP1Only ? '[Part 1] ' : '[Part 2+3] ') + tp.title,
        cleanTitle: tp.title,
        series: (tp.group || 'Practice Zone') + ' · ' + tp.partKind,
        group: classifyPzTopicGroup(tp.group),
        examinerDefaultVoice: persona.lang,
        examinerPersona: persona,
        warmup: {
          idCheckScript: 'Good day. My name is ' + persona.name.replace(/^Examiner\s+/, '') + '. Can you tell me your full name, please? Could I see your ID?',
          callNameScript: 'And what should I call you?'
        },
        part1: isP1Only ? {
          intro: tp.leadIn || ('Now let us talk about ' + tp.title + '.'),
          topic1Id: tp.id,
          topic1Title: tp.title,
          topic1Qs: qObjs,
          topic2Id: '',
          topic2Title: '',
          topic2Qs: []
        } : null,
        part2: !isP1Only ? {
          intro: 'Now I am going to give you a topic and I would like you to talk about it for one to two minutes. Before you talk, you have one minute to think about what you are going to say.',
          cueId: tp.id,
          cueTitle: (cc && cc.prompt) || tp.title,
          prompt: (cc && cc.prompt) || ('Describe ' + tp.title),
          bullets: (cc && Array.isArray(cc.bullets)) ? cc.bullets : [],
          prepSeconds: 60,
          talkSeconds: 120,
          prepEndScript: 'All right? Remember you have one to two minutes for this. Can you start speaking now, please?',
          stopScript: 'Thank you very much. I will stop you there.',
          roundingOffQ: 'Thank you. Do you think this is common among people in your country?'
        } : null,
        part3: !isP1Only ? {
          intro: 'Now I would like to ask you some more general questions related to ' + tp.title + '.',
          topicId: tp.id,
          topicTitle: tp.title,
          questions: qObjs,
          closingScript: 'Thank you very much. That is the end of this Speaking practice.'
        } : null,
        lexicalTargets: []
      };

      pzLessons.push(pzTopicLesson);
      if (isP1Only) _pzTopicsP1.push(pzTopicLesson);
      else _pzTopicsP23.push(pzTopicLesson);
    });

    // Sắp xếp lại Practice Zone theo thứ tự ưu tiên: Actual Tests -> Forecast 2026 -> Sample Tests -> Sample Packs -> Kho 2025 -> Kho 2021-2024
    var pzGroupOrder = {
      '🔥 Recent Actual Tests (34 Full Sets)': 1,
      '⚡ Đề Dự Đoán 2026 (Q1–Q3)': 2,
      '📘 Sample Speaking Tests (76 Full Sets)': 3,
      '📚 Bộ Đề Sample Packs 1 & 2': 4,
      '🗂️ Kho Dự Đoán 2025 (Q1–Q3)': 5,
      '🗄️ Kho Dự Đoán 2021–2024': 6
    };
    pzLessons.sort(function (a, b) {
      var ga = pzGroupOrder[a.group] || 99;
      var gb = pzGroupOrder[b.group] || 99;
      if (ga !== gb) return ga - gb;
      var ra = quarterRank(a.series);
      var rb = quarterRank(b.series);
      if (ra !== rb) return rb - ra;
      return a.order - b.order;
    });

    // -----------------------------------------------------------------------
    // 5. Build dynamic Vocab SRS Decks (u_1) from curated Band 7.0–9.0 Sample Lexis
    // -----------------------------------------------------------------------
    var builtVocab = buildVocabLessons(lexBucketsMap);
    var vocabLessons = builtVocab.lessons;

    // Combine all units in canonical order
    _lessons = []
      .concat(vocabLessons)
      .concat(part1Lessons)
      .concat(part2Lessons)
      .concat(part3Lessons)
      .concat(theoryLessons)
      .concat(pzLessons);

    _lessons.forEach(function (l) {
      _lessonMap.set(l.id, l);
    });

    _stats = {
      total: _lessons.length,
      vocabTopics: vocabLessons.length,
      vocabWords: builtVocab.totalWords,
      part1: part1Lessons.length,
      part2: part2Lessons.length,
      part3: part3Lessons.length,
      theory: theoryLessons.length,
      videos: videosRaw.length,
      pronunciation: pronRaw.length,
      practiceZone: pzLessons.length,
      pzFullTests: pzFullRaw.length,
      pzTopics: pzTopicsRaw.length,
      totalQuestions: totalQuestions,
      byUnit: {
        u_1: vocabLessons.length,
        u_2: part1Lessons.length,
        u_3: part2Lessons.length,
        u_4: part3Lessons.length,
        u_5: theoryLessons.length,
        u_6: pzLessons.length
      }
    };

    return { stats: _stats, lessons: _lessons };
  }

  function ensureInitialized() {
    if (!_raw && typeof global !== 'undefined' && global.STUDY4_SPEAKING_DATA) {
      init(global.STUDY4_SPEAKING_DATA);
    }
  }

  function getAllLessons() {
    ensureInitialized();
    return _lessons.slice();
  }

  function buildRandomFullTest(opts) {
    ensureInitialized();
    if (!_part1Pool.length || !_part23Pool.length) return null;

    var o = opts || {};
    var idxA = (typeof o.p1IdxA === 'number' && _part1Pool[o.p1IdxA])
      ? o.p1IdxA
      : Math.floor(Math.random() * _part1Pool.length);
    var idxB = (typeof o.p1IdxB === 'number' && _part1Pool[o.p1IdxB] && o.p1IdxB !== idxA)
      ? o.p1IdxB
      : (idxA + 1 + Math.floor(Math.random() * Math.max(1, _part1Pool.length - 1))) % _part1Pool.length;
    var p23Idx = (typeof o.p23Idx === 'number' && _part23Pool[o.p23Idx])
      ? o.p23Idx
      : Math.floor(Math.random() * _part23Pool.length);

    var p1A = _part1Pool[idxA];
    var p1B = _part1Pool[idxB];
    var pair = _part23Pool[p23Idx];
    var p2 = pair.part2;
    var p3 = pair.part3;

    var personas = [
      { name: 'Examiner Eleanor', accent: 'UK', lang: 'en-GB' },
      { name: 'Examiner Liam', accent: 'AU', lang: 'en-AU' },
      { name: 'Examiner Audrey', accent: 'US', lang: 'en-US' }
    ];
    var persona = personas[(idxA + p23Idx) % personas.length];

    var lex = [];
    var seenLex = new Set();
    var pushTip = function (t) {
      if (!t || !t.word) return;
      var k = t.word.toLowerCase();
      if (seenLex.has(k)) return;
      seenLex.add(k);
      lex.push(t);
    };
    (p1A.vocabTips || []).forEach(pushTip);
    (p1B.vocabTips || []).forEach(pushTip);
    (p2.vocabTips || []).forEach(pushTip);
    (p3.vocabTips || []).forEach(pushTip);

    return {
      id: 'speaking_pz_rand_' + idxA + '_' + idxB + '_' + p23Idx,
      unitId: 'u_6',
      unitTitle: UNIT_META.u_6.title,
      unitShort: UNIT_META.u_6.short,
      type: 'practice_full',
      pzKind: 'full_random',
      pzKindLabel: 'Random Full Exam',
      hasPart1: true,
      hasPart23: true,
      isDynamicRandom: true,
      title: 'Random Full Exam: ' + p2.cleanTitle,
      cleanTitle: 'Random Full Exam: ' + p2.cleanTitle,
      series: 'Dynamic Practice Zone — Đề ghép chuẩn 3 Phần',
      group: '🎲 Đề thi thử Ghép ngẫu nhiên',
      examinerDefaultVoice: persona.lang,
      examinerPersona: persona,
      warmup: {
        idCheckScript: 'Good day. My name is ' + persona.name.replace(/^Examiner\s+/, '') + '. Can you tell me your full name, please? Could I see your identification document, please?',
        callNameScript: 'And what should I call you today?'
      },
      part1: {
        intro: 'Now, in this first part, let us talk about ' + p1A.cleanTitle.toLowerCase() + '.',
        topic1Id: p1A.id,
        topic1Title: p1A.cleanTitle,
        topic1Qs: cloneJson((p1A.questions || []).slice(0, 4)),
        transition: 'Thank you. Let us move on now to talk about ' + p1B.cleanTitle.toLowerCase() + '.',
        topic2Id: p1B.id,
        topic2Title: p1B.cleanTitle,
        topic2Qs: cloneJson((p1B.questions || []).slice(0, 4))
      },
      part2: {
        intro: 'Now I am going to give you a topic and I would like you to talk about it for one to two minutes. Before you talk, you will have one minute to think about what you are going to say. Here is your cue card.',
        cueId: p2.id,
        cueTitle: p2.cleanTitle,
        prompt: p2.cueCard.prompt,
        bullets: cloneJson(p2.cueCard.bullets || []),
        prepSeconds: 60,
        talkSeconds: 120,
        prepEndScript: 'All right? Remember you have one to two minutes for this. Can you start speaking now, please?',
        stopScript: 'Thank you very much. I will stop you there.',
        roundingOffQ: 'Thank you. Do you still remember this clearly?',
        sampleParagraphs: cloneJson(p2.sampleParagraphs || [])
      },
      part3: {
        intro: 'We have been talking about ' + p2.cleanTitle.toLowerCase() + ', and now I would like to discuss some more general questions related to it.',
        topicId: p3.id,
        topicTitle: p3.cleanTitle,
        questions: cloneJson((p3.questions || []).slice(0, 5)),
        closingScript: 'Thank you very much. That is the end of the Speaking test.'
      },
      lexicalTargets: lex.slice(0, 18)
    };
  }

  function pairTopicWithRandomComplement(topicLesson) {
    ensureInitialized();
    if (!topicLesson) return buildRandomFullTest();
    var base = cloneJson(topicLesson);
    if (base.pzKind === 'topic_p1') {
      var pick23 = _pzTopicsP23.length
        ? _pzTopicsP23[Math.floor(Math.random() * _pzTopicsP23.length)]
        : null;
      if (pick23) {
        base.part2 = cloneJson(pick23.part2);
        base.part3 = cloneJson(pick23.part3);
        base.title = 'Full Mock: ' + base.cleanTitle + ' + ' + pick23.cleanTitle;
      }
    } else if (base.pzKind === 'topic_p23') {
      var pick1 = _pzTopicsP1.length
        ? _pzTopicsP1[Math.floor(Math.random() * _pzTopicsP1.length)]
        : null;
      if (pick1) {
        base.part1 = cloneJson(pick1.part1);
        base.title = 'Full Mock: ' + pick1.cleanTitle + ' + ' + base.cleanTitle;
      }
    }
    base.hasPart1 = Boolean(base.part1 && (base.part1.topic1Qs || []).length);
    base.hasPart23 = Boolean(base.part2 && base.part2.prompt);
    base.pzKind = 'full_paired';
    base.pzKindLabel = 'Full Mock (Ghép đủ 3 phần)';
    base.isDynamicRandom = true;
    return base;
  }

  function getLessonById(id) {
    ensureInitialized();
    if (!id) return null;
    if (_lessonMap.has(id)) return _lessonMap.get(id);

    var mNew = /^speaking_pz_rand_(\d+)_(\d+)_(\d+)$/.exec(String(id));
    if (mNew) {
      return buildRandomFullTest({
        p1IdxA: parseInt(mNew[1], 10),
        p1IdxB: parseInt(mNew[2], 10),
        p23Idx: parseInt(mNew[3], 10)
      });
    }
    return null;
  }

  function getStats() {
    ensureInitialized();
    return cloneJson(_stats);
  }

  function getFilters() {
    ensureInitialized();
    var groups = new Set();
    var types = new Set();
    _lessons.forEach(function (l) {
      if (l.group) groups.add(l.group);
      if (l.type) types.add(l.type);
    });
    return {
      units: Object.keys(UNIT_META).map(function (k) { return cloneJson(UNIT_META[k]); }),
      groups: Array.from(groups),
      types: Array.from(types)
    };
  }

  function buildSampleSentences(lesson, sampleIdx) {
    if (!lesson) return [];
    var items = [];
    var seenTexts = new Set();

    function pushItem(obj) {
      var cleanEn = String(obj.en || '').trim();
      if (!cleanEn) return;
      var dedupeKey = obj.id + '::' + cleanEn.slice(0, 80).toLowerCase();
      if (seenTexts.has(dedupeKey)) return;
      seenTexts.add(dedupeKey);
      items.push({
        id: obj.id,
        sectionIndex: obj.sectionIndex,
        sectionLabel: obj.sectionLabel || '',
        qIndex: obj.qIndex,
        qText: obj.qText || '',
        role: obj.role || 'sample',
        roleLabel: obj.roleLabel || '',
        en: cleanEn,
        vi: String(obj.vi || '').trim(),
        audioUrl: obj.audioUrl || '',
        rawSentences: Array.isArray(obj.rawSentences) ? obj.rawSentences : [],
        words: tokenizeWords(cleanEn),
        sentences: obj.rawSentences && obj.rawSentences.length
          ? obj.rawSentences.map(function (rs) { return rs.text; })
          : splitSentences(cleanEn),
        vocabTips: obj.vocabTips || []
      });
    }

    if (lesson.type === 'part1' || lesson.type === 'part3') {
      (lesson.questions || []).forEach(function (q, qIdx) {
        pushItem({
          id: lesson.id + '_q_' + qIdx,
          sectionIndex: qIdx,
          sectionLabel: (lesson.type === 'part1' ? 'Question ' : 'Discussion Q') + (qIdx + 1),
          qIndex: qIdx,
          qText: q.q,
          role: 'full_answer',
          roleLabel: (q.roleTags && q.roleTags.length) ? q.roleTags.join(' · ') : 'Band 8.0+ Sample',
          en: q.sampleEn,
          vi: q.sampleVi,
          audioUrl: q.audioUrl || (q.sentences && q.sentences[0] && q.sentences[0].audioUrl) || '',
          rawSentences: q.sentences || [],
          vocabTips: q.vocabTips || []
        });
      });
    } else if (lesson.type === 'part2') {
      var sIdxNum = typeof sampleIdx === 'number' ? sampleIdx : 0;
      var targetParas = (lesson.sampleSets && lesson.sampleSets[sIdxNum] && lesson.sampleSets[sIdxNum].paragraphs)
        || lesson.sampleParagraphs
        || [];
      targetParas.forEach(function (p, pIdx) {
        pushItem({
          id: lesson.id + '_s' + sIdxNum + '_p_' + pIdx,
          sectionIndex: pIdx,
          sectionLabel: p.roleLabel || ('Đoạn ' + (pIdx + 1)),
          qIndex: pIdx,
          qText: lesson.cueCard ? lesson.cueCard.prompt : lesson.title,
          role: p.role || 'body',
          roleLabel: p.roleLabel || ('Đoạn ' + (pIdx + 1)),
          en: p.en,
          vi: p.vi,
          audioUrl: p.audioUrl || (p.sentences && p.sentences[0] && p.sentences[0].audioUrl) || '',
          rawSentences: p.sentences || [],
          vocabTips: p.vocabTips && p.vocabTips.length ? p.vocabTips : (lesson.vocabTips || [])
        });
      });
    } else if (lesson.type === 'practice_full') {
      var qCounter = 0;
      if (lesson.part1) {
        (lesson.part1.topic1Qs || []).forEach(function (q, idx) {
          if (q.sampleEn) pushItem({ id: lesson.id + '_p1a_' + idx, sectionIndex: qCounter++, sectionLabel: 'Part 1A · Q' + (idx + 1), qIndex: qCounter, qText: q.q, en: q.sampleEn, audioUrl: q.audioUrl, rawSentences: q.sentences, vocabTips: q.vocabTips });
        });
        (lesson.part1.topic2Qs || []).forEach(function (q, idx) {
          if (q.sampleEn) pushItem({ id: lesson.id + '_p1b_' + idx, sectionIndex: qCounter++, sectionLabel: 'Part 1B · Q' + (idx + 1), qIndex: qCounter, qText: q.q, en: q.sampleEn, audioUrl: q.audioUrl, rawSentences: q.sentences, vocabTips: q.vocabTips });
        });
      }
      if (lesson.part2 && Array.isArray(lesson.part2.sampleParagraphs)) {
        lesson.part2.sampleParagraphs.forEach(function (p, idx) {
          pushItem({ id: lesson.id + '_p2_' + idx, sectionIndex: qCounter++, sectionLabel: 'Part 2 · Đoạn ' + (idx + 1), qIndex: idx, qText: lesson.part2.prompt, en: p.en, audioUrl: p.audioUrl, rawSentences: p.sentences, vocabTips: p.vocabTips });
        });
      }
      if (lesson.part3) {
        (lesson.part3.questions || []).forEach(function (q, idx) {
          if (q.sampleEn) pushItem({ id: lesson.id + '_p3_' + idx, sectionIndex: qCounter++, sectionLabel: 'Part 3 · Q' + (idx + 1), qIndex: idx, qText: q.q, en: q.sampleEn, audioUrl: q.audioUrl, rawSentences: q.sentences, vocabTips: q.vocabTips });
        });
      }
    }

    return items;
  }

  function findPhraseMatchInText(text, phrase) {
    var cleanPhrase = String(phrase || '').replace(/\.{3}$/, '').replace(/^(a|an|the)\s+/i, '').trim();
    if (!cleanPhrase || cleanPhrase.length < 3) return null;

    var escapeRx = function (s) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    var rxExact = new RegExp('\\b' + escapeRx(cleanPhrase) + '\\b', 'i');
    var mExact = rxExact.exec(text);
    if (mExact) return { matchedText: mExact[0], index: mExact.index };

    var tokens = cleanPhrase.split(/\s+/);
    if (tokens.length >= 2) {
      var parts = tokens.map(function (tok, idx) {
        var low = tok.toLowerCase();
        if (low === "one's" || low === 'one’s') return "(?:my|our|their|his|her|one['’]s|people['’]s|your|its)";
        if (low === 'someone' || low === 'something') return '[a-z]+(?:\\s+[a-z]+)?';
        if (idx === 0 && tok.length >= 4) return escapeRx(tok) + '(?:ed|es|ing|s)?';
        return escapeRx(tok) + '(?:s|es)?';
      });
      var rxFlex = new RegExp('\\b' + parts.join('\\s+') + '\\b', 'i');
      var mFlex = rxFlex.exec(text);
      if (mFlex) return { matchedText: mFlex[0], index: mFlex.index };
    }
    return null;
  }

  function pickDistractors(answer, poolItems, seedKey) {
    var ansLow = String(answer || '').toLowerCase();
    var targetWordCount = answer.trim().split(/\s+/).length;
    var candidates = [];

    (poolItems || []).forEach(function (item) {
      var w = String(item.word || item || '').trim();
      if (!w) return;
      var low = w.toLowerCase();
      if (low === ansLow || low.indexOf(ansLow) !== -1 || ansLow.indexOf(low) !== -1) return;
      candidates.push(w);
    });

    for (var g = 0; g < _globalVocabPool.length && candidates.length < 28; g++) {
      var w = _globalVocabPool[(g * 37) % _globalVocabPool.length].word;
      var low = w.toLowerCase();
      if (low === ansLow || candidates.indexOf(w) !== -1) continue;
      if (Math.abs(w.split(/\s+/).length - targetWordCount) <= 2) {
        candidates.push(w);
      }
    }

    var sorted = deterministicShuffle(candidates, seedKey);
    var picked = [answer];
    for (var i = 0; i < sorted.length && picked.length < 4; i++) {
      if (picked.indexOf(sorted[i]) === -1) picked.push(sorted[i]);
    }
    var safetyExtras = ['on the flip side', 'a steep learning curve', 'to be honest', 'broaden my horizons'];
    for (var s = 0; s < safetyExtras.length && picked.length < 4; s++) {
      if (picked.indexOf(safetyExtras[s]) === -1 && safetyExtras[s].toLowerCase() !== ansLow) {
        picked.push(safetyExtras[s]);
      }
    }
    return deterministicShuffle(picked, seedKey + '_opts');
  }

  function buildCollocationDrills(lesson, sampleIdx) {
    ensureInitialized();
    if (!lesson) return [];
    var samples = buildSampleSentences(lesson, sampleIdx);
    if (!samples.length) return [];

    var drills = [];
    var usedBlankSentences = new Set();
    var lessonPool = lesson.vocabTips || [];

    samples.forEach(function (samp, sIdx) {
      var sents = samp.sentences || splitSentences(samp.en);
      var tips = (samp.vocabTips && samp.vocabTips.length) ? samp.vocabTips : lessonPool;

      tips.forEach(function (tip, tIdx) {
        if (drills.length >= 10) return;
        for (var i = 0; i < sents.length; i++) {
          var sent = sents[i];
          var sKey = sent.toLowerCase();
          if (usedBlankSentences.has(sKey)) continue;
          var found = findPhraseMatchInText(sent, tip.word);
          if (found) {
            usedBlankSentences.add(sKey);
            drills.push({
              id: samp.id + '_drill_' + tIdx,
              qIndex: samp.qIndex,
              sectionLabel: samp.sectionLabel || ('Item ' + (sIdx + 1)),
              qText: samp.qText || '',
              promptEn: sent.slice(0, found.index) + '________' + sent.slice(found.index + found.matchedText.length),
              fullSentenceEn: sent,
              fullPassageVi: samp.vi || '',
              answer: found.matchedText,
              options: pickDistractors(found.matchedText, lessonPool, lesson.id + '_' + drills.length),
              hintIpa: tip.ipa || '',
              hintMeaning: tip.meaning || '',
              vocabTip: tip
            });
            break;
          }
        }
      });
    });

    if (drills.length < 3) {
      samples.forEach(function (samp, sIdx) {
        if (drills.length >= 6) return;
        var sents = samp.sentences || splitSentences(samp.en);
        for (var i = 0; i < sents.length; i++) {
          var sent = sents[i];
          if (usedBlankSentences.has(sent.toLowerCase())) continue;
          var mWord = /\b([a-zA-Z]{7,})\b/.exec(sent);
          if (mWord) {
            usedBlankSentences.add(sent.toLowerCase());
            var ans = mWord[1];
            var idx = sent.indexOf(ans);
            drills.push({
              id: samp.id + '_fb_' + sIdx + '_' + i,
              qIndex: samp.qIndex,
              sectionLabel: samp.sectionLabel || ('Item ' + (sIdx + 1)),
              qText: samp.qText || '',
              promptEn: sent.slice(0, idx) + '________' + sent.slice(idx + ans.length),
              fullSentenceEn: sent,
              fullPassageVi: samp.vi || '',
              answer: ans,
              options: pickDistractors(ans, lessonPool, lesson.id + '_fb_' + drills.length),
              hintIpa: '',
              hintMeaning: 'Từ vựng học thuật trong câu',
              vocabTip: { word: ans, ipa: '', meaning: '' }
            });
          }
        }
      });
    }

    return drills;
  }

  var SpeakingParser = {
    UNIT_META: UNIT_META,
    init: init,
    getAllLessons: getAllLessons,
    getLessonById: getLessonById,
    getStats: getStats,
    getFilters: getFilters,
    toEngineVocabList: toEngineVocabList,
    buildSampleSentences: buildSampleSentences,
    buildCollocationDrills: buildCollocationDrills,
    buildRandomFullTest: buildRandomFullTest,
    pairTopicWithRandomComplement: pairTopicWithRandomComplement,
    splitSentences: splitSentences,
    resolveMediaUrl: resolveMediaUrl
  };

  global.SpeakingParser = SpeakingParser;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpeakingParser;
  }
})(typeof window !== 'undefined' ? window : globalThis);
