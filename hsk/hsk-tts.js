/* LinguaPath — HSK Mandarin TTS Engine (Pinyin-Aware Multi-Tier Fallback)
 * Tier 1 (Từ đơn / Âm tiết Pinyin / Thanh mẫu / Vận mẫu / Bộ thủ):
 *   - Studio Human Beijing Mandarin Pinyin MP3 (jsDelivr davinfifield 1,632 âm tiết, CORP: cross-origin)
 *   - PurpleCulture Pinyin MP3 (bổ sung 13 âm tiết thanh nhẹ & đặc biệt + fallback)
 * Tier 2 (Từ ghép, câu dài & fallback cho từ đơn kèm khử nhập nhằng đa âm):
 *   - Google Translate TTS zh-CN (translate.googleapis.com & translate.google.com, CORS-clean)
 * Tier 3 (Offline):
 *   - Web Speech API zh-CN (kèm ánh xạ chữ đồng âm đơn nghĩa cho từ đơn đa âm & bộ thủ)
 */
(function (global) {
  "use strict";

  let playToken = 0;
  let sharedAudio = null;
  let lastDebug = { tier: "", url: "", duration: 0, error: "", resolvedPinyin: "", ttsText: "" };

  const JSDELIVR_PINYIN_BASE = "https://cdn.jsdelivr.net/gh/davinfifield/mp3-chinese-pinyin-sound/mp3/";
  const PURPLECULTURE_PINYIN_BASE = "https://www.purpleculture.net/mp3/";

  // 5 âm thanh nhẹ có sẵn trên davinfifield/mp3-chinese-pinyin-sound
  const DAVIN_TONE5_SET = new Set(["de5", "dei5", "le5", "ma5", "ne5"]);

  // Các âm tiết thanh 1-4 xác thực không có trên davinfifield (đi thẳng PurpleCulture để tránh 404)
  const DAVIN_MISSING_SET = new Set(["diao1", "eng1", "mou3", "o1", "o4", "xiu1", "yo1"]);

  // Mặc định an toàn cho từ đơn chỉ có 1 cách đọc đứng lẻ (trợ từ thanh nhẹ & bộ thủ nét rời)
  // Khi caller truyền opts.pinyin / opts.pinyinNum thì luôn ưu tiên tuyệt đối theo Pinyin của thẻ.
  const STANDALONE_DEFAULT_PINYIN = {
    "的": "de5",
    "了": "le5",
    "吗": "ma5",
    "呢": "ne5",
    "吧": "ba5",
    "啦": "la5",
    "嘛": "ma5",
    "么": "me5",
    "们": "men5",
    "丨": "gun3",
    "丶": "zhu3",
    "丿": "pie3",
    "亅": "gou1",
    "亻": "ren2",
    "刂": "dao1",
    "氵": "shui3",
    "扌": "shou3",
    "忄": "xin1",
    "犭": "quan3",
    "纟": "mi4",
    "讠": "yan2",
    "钅": "jin1",
    "饣": "shi2",
    "阝": "fu4",
    "艹": "cao3",
    "辶": "chuo4",
    "囗": "wei2",
    "彳": "chi4",
    "灬": "huo3",
    "⺮": "zhu2",
    "⻊": "zu2",
    "廴": "yin3",
    "廾": "gong3",
    "彡": "shan1",
    "彐": "ji4"
  };

  // Ánh xạ chữ đồng âm đơn nghĩa (Monophonic Homophone) để Google TTS / Web Speech (offline)
  // vẫn phát âm ĐÚNG thanh điệu & âm tiết ngay cả khi không tải được MP3 Pinyin.
  const MONOPHONIC_CHAR_BY_SYLLABLE = {
    // 12 từ đơn đa âm HSK hay bị TTS đọc sai
    "zhi1": "知",
    "gan4": "淦",
    "tan2": "谈",
    "chong2": "虫",
    "ji4": "记",
    "juan3": "捲",
    "lou4": "漏",
    "cheng2": "成",
    "chang2": "常",
    "zhang3": "掌",
    "hai2": "孩",
    "huan2": "环",
    "jue2": "决",
    "jiao4": "叫",
    "xing2": "型",
    "hang2": "航",
    "le4": "乐",
    "yue4": "月",
    "dou1": "兜",
    "du1": "督",
    "fa1": "发",
    "fa4": "珐",
    "wei2": "维",
    "wei4": "位",
    "shao3": "少",
    "shao4": "哨",
    "hao3": "好",
    "hao4": "号",
    "jiao1": "交",
    "shu4": "树",
    "shu3": "鼠",
    "zhong3": "肿",
    "zhong4": "众",
    "jia3": "甲",
    "jia4": "架",
    "bian4": "变",
    "pian2": "便",
    "cha4": "岔",
    "cha1": "插",
    "chai1": "拆",
    "chuan2": "船",
    "zhuan4": "赚",
    "diao4": "钓",
    "tiao2": "条",
    "geng4": "更",
    "geng1": "耕",
    "jiao3": "脚",
    "jie2": "节",
    "jie1": "接",
    "jin3": "紧",
    "jin4": "进",
    "lei4": "泪",
    "lei3": "垒",
    "liang2": "良",
    "liang4": "亮",
    "lv4": "绿",
    "shuai4": "帅",
    "mo2": "魔",
    "mu2": "模",
    "qu1": "区",
    "qu3": "取",
    "san4": "散",
    "san3": "伞",
    "shan4": "善",
    "shan1": "山",
    "she3": "舍",
    "she4": "社",
    "sheng3": "省",
    "xing3": "醒",
    "si4": "四",
    "shi4": "是",
    "su4": "速",
    "xiu3": "朽",
    "tu3": "土",
    "tu4": "兔",
    "xian1": "仙",
    "xian3": "险",
    "xing1": "星",
    "xing4": "幸",
    "xue4": "穴",
    "xie3": "写",
    "ying1": "英",
    "ying4": "硬",
    "zai4": "再",
    "zai3": "宰",
    "zang1": "赃",
    "zang4": "葬",
    "chao2": "潮",
    "zhao1": "招",
    "zhe2": "哲",
    "she2": "蛇",
    "zhuan3": "转",
    "cang2": "藏",
    "dao3": "岛",
    "dao4": "到",
    // Bộ thủ nét rời / biến thể
    "gun3": "滚",
    "zhu3": "主",
    "pie3": "撇",
    "gou1": "沟",
    "ren2": "人",
    "dao1": "刀",
    "shui3": "水",
    "shou3": "手",
    "xin1": "心",
    "quan3": "犬",
    "mi4": "密",
    "yan2": "言",
    "jin1": "金",
    "shi2": "十",
    "fu4": "副",
    "cao3": "草",
    "chuo4": "绰",
    "han3": "罕",
    "chi4": "赤",
    "huo3": "火",
    "zhu2": "竹",
    "zu2": "足",
    "yin3": "引",
    "gong3": "拱",
    // Thanh mẫu & Vận mẫu thanh 1 chuẩn Bài 0.1
    "bo1": "波",
    "po1": "坡",
    "mo1": "摸",
    "fo1": "佛",
    "de1": "嘚",
    "te1": "特",
    "ne1": "呢",
    "le1": "勒",
    "a1": "阿",
    "o1": "喔",
    "e1": "婀",
    "ei1": "欸",
    "ao1": "凹",
    "ang1": "肮",
    "eng1": "鞥",
    "ya1": "鸭",
    // Trợ từ thanh nhẹ (fallback TTS khi hoàn toàn offline)
    "de5": "的",
    "le5": "了",
    "zhe5": "着",
    "ma5": "吗",
    "ne5": "呢",
    "ba5": "吧",
    "a5": "啊",
    "ya5": "呀",
    "la5": "啦"
  };

  // Từ ghép đa âm dễ bị TTS đọc lệch thanh điệu nếu chỉ truyền chữ Hán gốc
  const POLYPHONE_WORD_TTS_MAP = {
    "重重|chong2 chong2": "虫虫",
    "重重|zhong4 zhong4": "众众",
    "下载|xia4 zai4": "下在",
    "下载|xia4 zai3": "下宰",
    "泄露|xie4 lu4": "泄路",
    "泄露|xie4 lou4": "泄漏"
  };

  const TONE_CHAR_MAP = {
    "ā": ["a", 1], "á": ["a", 2], "ǎ": ["a", 3], "à": ["a", 4],
    "ē": ["e", 1], "é": ["e", 2], "ě": ["e", 3], "è": ["e", 4],
    "ī": ["i", 1], "í": ["i", 2], "ǐ": ["i", 3], "ì": ["i", 4],
    "ō": ["o", 1], "ó": ["o", 2], "ǒ": ["o", 3], "ò": ["o", 4],
    "ū": ["u", 1], "ú": ["u", 2], "ǔ": ["u", 3], "ù": ["u", 4],
    "ǖ": ["v", 1], "ǘ": ["v", 2], "ǚ": ["v", 3], "ǜ": ["v", 4],
    "ü": ["v", 0],
    "ń": ["n", 2], "ň": ["n", 3], "ǹ": ["n", 4],
    "ḿ": ["m", 2]
  };

  const PY_INITIALS = [
    "zh", "ch", "sh", "b", "p", "m", "f", "d", "t", "n", "l",
    "g", "k", "h", "j", "q", "x", "r", "z", "c", "s", "y", "w"
  ];
  const PY_FINALS = [
    "iang", "iong", "uang", "ueng", "ang", "eng", "ing", "ong",
    "iao", "iou", "uai", "uei", "ian", "uan", "van",
    "ai", "ei", "ao", "ou", "an", "en",
    "in", "un", "vn", "er", "ia", "ie", "ua", "uo", "ve", "ue",
    "iu", "ui", "a", "o", "e", "i", "u", "v"
  ];
  const VALID_PY_BASES = new Set([
    "a", "o", "e", "ai", "ei", "ao", "ou", "an", "en", "ang", "eng", "er",
    "yo", "hm", "hng", "m", "n", "ng"
  ]);
  for (let i = 0; i < PY_INITIALS.length; i++) {
    for (let j = 0; j < PY_FINALS.length; j++) {
      VALID_PY_BASES.add(PY_INITIALS[i] + PY_FINALS[j]);
    }
  }

  function normalizeBaseSyllable(base) {
    let b = String(base || "").toLowerCase().replace(/u:/g, "v").replace(/ü/g, "v");
    // Chuẩn Pinyin: sau j/q/x/y dùng u (ju, jue, qu, xu, yu, yue), chỉ giữ v cho lv/lve/nv/nve
    b = b.replace(/^([jqxy])v/, "$1u");
    return b;
  }

  function parseNumberedPinyin(pinyinNum) {
    const raw = String(pinyinNum || "").trim();
    if (!raw) return [];
    const tokens = raw
      .toLowerCase()
      .replace(/u:/g, "v")
      .replace(/ü/g, "v")
      .replace(/[，。！？、；：""''（）().,!?;:\-—…·'’]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    const out = [];
    for (let i = 0; i < tokens.length; i++) {
      const m = tokens[i].match(/^([a-z]+)([1-5])$/);
      if (!m) return [];
      const base = normalizeBaseSyllable(m[1]);
      if (!VALID_PY_BASES.has(base)) return [];
      out.push(base + m[2]);
    }
    return out;
  }

  function parseMarkedPinyin(pinyin) {
    const raw = String(pinyin || "").trim();
    if (!raw) return [];
    const clean = raw.toLowerCase().replace(/u:/g, "ü");
    const chars = [];
    for (let i = 0; i < clean.length; i++) {
      const ch = clean[i];
      if (TONE_CHAR_MAP[ch]) {
        chars.push({ c: TONE_CHAR_MAP[ch][0], t: TONE_CHAR_MAP[ch][1] });
      } else if (ch >= "a" && ch <= "z") {
        chars.push({ c: ch, t: 0 });
      } else if (ch >= "1" && ch <= "5") {
        chars.push({ digit: Number(ch) });
      } else {
        chars.push({ sep: true });
      }
    }

    const chunks = [];
    let cur = [];
    for (let i = 0; i < chars.length; i++) {
      const item = chars[i];
      if (item.sep) {
        if (cur.length) {
          chunks.push(cur);
          cur = [];
        }
      } else if (item.digit) {
        if (cur.length) {
          cur[cur.length - 1].explicitTone = item.digit;
          chunks.push(cur);
          cur = [];
        }
      } else {
        cur.push(item);
      }
    }
    if (cur.length) chunks.push(cur);

    const out = [];
    for (let cIdx = 0; cIdx < chunks.length; cIdx++) {
      const chunk = chunks[cIdx];
      const str = chunk.map((x) => x.c).join("");
      const memo = new Map();

      function seg(idx) {
        if (idx === chunk.length) return [];
        if (memo.has(idx)) return memo.get(idx);
        const maxLen = Math.min(6, chunk.length - idx);
        for (let len = maxLen; len >= 1; len--) {
          const sub = str.slice(idx, idx + len);
          const normSub = normalizeBaseSyllable(sub);
          const slice = chunk.slice(idx, idx + len);
          let tone = 0;
          let toneCount = 0;
          for (let k = 0; k < slice.length; k++) {
            if (slice[k].t > 0) {
              tone = slice[k].t;
              toneCount++;
            }
            if (slice[k].explicitTone) {
              tone = slice[k].explicitTone;
              toneCount++;
            }
          }
          if (toneCount <= 1 && VALID_PY_BASES.has(normSub)) {
            const rest = seg(idx + len);
            if (rest !== null) {
              const res = [normSub + (tone || 5)].concat(rest);
              memo.set(idx, res);
              return res;
            }
          }
        }
        if (str[idx] === "r" && idx === chunk.length - 1) {
          const res = ["r5"];
          memo.set(idx, res);
          return res;
        }
        memo.set(idx, null);
        return null;
      }

      const segmented = seg(0);
      if (segmented && segmented.length) {
        for (let s = 0; s < segmented.length; s++) out.push(segmented[s]);
      } else {
        return [];
      }
    }
    return out;
  }

  function parsePinyin(pinyin, pinyinNum) {
    if (pinyinNum) {
      const byNum = parseNumberedPinyin(pinyinNum);
      if (byNum.length) return byNum;
    }
    if (pinyin) {
      const byMarked = parseMarkedPinyin(pinyin);
      if (byMarked.length) return byMarked;
    }
    return [];
  }

  function extractCjkAndRadicalChars(text) {
    // Bao gồm CJK Unified Ideographs, Extension A, Kangxi Radicals, CJK Radicals Supplement
    return String(text || "").match(/[\u4e00-\u9fff\u3400-\u4dbf\u2e80-\u2eff\u2f00-\u2fdf]/g) || [];
  }

  function buildPinyinMp3Candidates(canonSyl) {
    const syl = String(canonSyl || "").toLowerCase();
    if (!/^[a-zv]+[1-5]$/.test(syl)) return [];
    const tone = Number(syl[syl.length - 1]);
    const jsdKey = syl.replace(/v/g, "uu");
    const pcKey = syl;

    const skipDavin = (tone === 5 && !DAVIN_TONE5_SET.has(syl)) || DAVIN_MISSING_SET.has(syl);
    const candidates = [];
    if (!skipDavin) {
      candidates.push(["pinyin_jsdelivr", JSDELIVR_PINYIN_BASE + jsdKey + ".mp3", 3200]);
    }
    candidates.push(["pinyin_purpleculture", PURPLECULTURE_PINYIN_BASE + pcKey + ".mp3", 3600]);
    return candidates;
  }

  function resolvePlan(text, opts) {
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    const o = opts || {};
    const cjkChars = extractCjkAndRadicalChars(clean);
    let syllables = parsePinyin(o.pinyin, o.pinyinNum);

    // Nếu là từ đơn 1 ký tự không có pinyin truyền vào, kiểm tra bảng mặc định an toàn (trợ từ thanh nhẹ & bộ thủ nét rời)
    if (!syllables.length && cjkChars.length === 1 && clean.length <= 2) {
      const defSyl = STANDALONE_DEFAULT_PINYIN[cjkChars[0]];
      if (defSyl) syllables = [defSyl];
    }

    // 1) Trường hợp phát âm đơn âm tiết chuẩn theo Pinyin (từ đơn 1 chữ Hán / bộ thủ / bảng Thanh mẫu - Vận mẫu)
    const isSingleSyllableTarget =
      syllables.length === 1 &&
      syllables[0] !== "r5" &&
      (o.preferPinyinAudio === true || (cjkChars.length === 1 && clean.length <= 2) || (!cjkChars.length && clean.length <= 8));

    if (isSingleSyllableTarget) {
      const canonSyl = syllables[0];
      const fallbackChar = MONOPHONIC_CHAR_BY_SYLLABLE[canonSyl] || clean;
      return {
        mode: "single_syllable",
        syllable: canonSyl,
        mp3Candidates: buildPinyinMp3Candidates(canonSyl),
        ttsText: fallbackChar,
        originalText: clean
      };
    }

    // 2) Trường hợp từ ghép đa âm có bản ánh xạ TTS chuyên biệt
    if (cjkChars.length >= 2 && syllables.length >= 2) {
      const wordKey = cjkChars.join("") + "|" + syllables.join(" ");
      if (POLYPHONE_WORD_TTS_MAP[wordKey]) {
        return {
          mode: "tts_disambiguated",
          syllable: syllables.join(" "),
          mp3Candidates: [],
          ttsText: POLYPHONE_WORD_TTS_MAP[wordKey],
          originalText: clean
        };
      }
    }

    // 3) Trường hợp từ ghép thông thường hoặc câu / đoạn văn dài
    return {
      mode: "tts_standard",
      syllable: syllables.join(" "),
      mp3Candidates: [],
      ttsText: clean,
      originalText: clean
    };
  }

  function getAudioEl() {
    if (!sharedAudio) {
      sharedAudio = new Audio();
      sharedAudio.preload = "auto";
    }
    return sharedAudio;
  }

  function stop() {
    playToken++;
    if (sharedAudio) {
      try {
        sharedAudio.pause();
        sharedAudio.removeAttribute("src");
        sharedAudio.load();
      } catch (e) {}
    }
    if ("speechSynthesis" in global) {
      try { global.speechSynthesis.cancel(); } catch (e) {}
    }
  }

  let cachedVoices = [];

  function refreshVoices() {
    try {
      if ("speechSynthesis" in global && typeof global.speechSynthesis.getVoices === "function") {
        const list = global.speechSynthesis.getVoices() || [];
        if (list.length) cachedVoices = list;
      }
    } catch (e) {}
    return cachedVoices;
  }

  function findZhVoice(list) {
    const voices = Array.isArray(list) ? list : [];
    return (
      voices.find((v) => /zh[-_]CN/i.test(v.lang) && /natural|google|xiaoxiao|yunxi/i.test(v.name || "")) ||
      voices.find((v) => /zh[-_]CN/i.test(v.lang)) ||
      voices.find((v) => /^zh/i.test(v.lang)) ||
      null
    );
  }

  function resolveZhVoiceAsync(maxWaitMs) {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in global) || typeof global.speechSynthesis.getVoices !== "function") {
        return resolve(null);
      }
      const immediate = findZhVoice(refreshVoices());
      if (immediate) return resolve(immediate);

      let done = false;
      function finish() {
        if (done) return;
        done = true;
        clearTimeout(t);
        try {
          if (global.speechSynthesis.removeEventListener) {
            global.speechSynthesis.removeEventListener("voiceschanged", onChanged);
          }
        } catch (e) {}
        resolve(findZhVoice(refreshVoices()));
      }
      function onChanged() {
        if (findZhVoice(refreshVoices())) finish();
      }
      const t = setTimeout(finish, maxWaitMs || 450);
      try {
        if (global.speechSynthesis.addEventListener) {
          global.speechSynthesis.addEventListener("voiceschanged", onChanged);
        }
      } catch (e) {}
    });
  }

  function splitByClauses(text, maxLen) {
    const pieces = text.match(/[^，,、：:]+[，,、：:]*/g) || [text];
    const out = [];
    let buf = "";
    for (let i = 0; i < pieces.length; i++) {
      const part = pieces[i].trim();
      if (!part) continue;
      if (buf && (buf.length + part.length) <= maxLen) {
        buf += part;
      } else {
        if (buf) out.push(buf);
        if (part.length <= maxLen) {
          buf = part;
        } else {
          for (let j = 0; j < part.length; j += maxLen) {
            out.push(part.slice(j, j + maxLen));
          }
          buf = "";
        }
      }
    }
    if (buf) out.push(buf);
    return out;
  }

  function splitChunks(rawText) {
    const clean = String(rawText || "").replace(/\s+/g, " ").trim();
    if (!clean) return [];
    if (clean.length <= 45) return [clean];
    const rawParts = clean.match(/[^。！？!?;；\n]+[。！？!?;；\n]*/g) || [clean];
    const parts = rawParts.map((s) => s.trim()).filter(Boolean);
    const out = [];
    for (const p of parts) {
      if (p.length <= 55) {
        out.push(p);
      } else {
        const sub = splitByClauses(p, 55);
        for (let k = 0; k < sub.length; k++) out.push(sub[k]);
      }
    }
    return out.length ? out : [clean];
  }

  function playUrlAudio(url, rate, token, tierName, loadTimeoutMs, meta) {
    return new Promise((resolve, reject) => {
      if (token !== playToken) return resolve(false);
      const audio = getAudioEl();
      let settled = false;
      let playbackGuard = null;
      const safeRate = Math.max(0.5, Math.min(1.5, Number(rate) || 1.0));
      const loadTimer = setTimeout(() => {
        if (!settled) {
          settled = true;
          cleanup();
          reject(new Error("audio_timeout"));
        }
      }, loadTimeoutMs || 4500);

      function cleanup() {
        clearTimeout(loadTimer);
        if (playbackGuard) { clearTimeout(playbackGuard); playbackGuard = null; }
        audio.onloadedmetadata = null;
        audio.onended = null;
        audio.onerror = null;
        audio.onplaying = null;
      }

      audio.onloadedmetadata = () => {
        try { audio.playbackRate = safeRate; } catch (e) {}
      };

      audio.onplaying = () => {
        clearTimeout(loadTimer);
        try { audio.playbackRate = safeRate; } catch (e) {}
        const estMs = Math.max(25000, Math.ceil(((isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 20) / safeRate) * 1000) + 5000);
        if (playbackGuard) clearTimeout(playbackGuard);
        playbackGuard = setTimeout(() => {
          if (!settled) {
            settled = true;
            cleanup();
            resolve(true);
          }
        }, estMs);
        lastDebug = {
          tier: tierName,
          url,
          duration: Number(audio.duration || 0),
          error: "",
          resolvedPinyin: (meta && meta.syllable) || "",
          ttsText: (meta && meta.ttsText) || ""
        };
      };
      audio.onended = () => {
        if (settled) return;
        settled = true;
        lastDebug = {
          tier: tierName,
          url,
          duration: Number(audio.duration || 0),
          error: "",
          resolvedPinyin: (meta && meta.syllable) || "",
          ttsText: (meta && meta.ttsText) || ""
        };
        cleanup();
        resolve(true);
      };
      audio.onerror = () => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error("audio_load_error"));
      };

      try {
        audio.pause();
        audio.defaultPlaybackRate = safeRate;
        audio.src = url;
        audio.playbackRate = safeRate;
        const p = audio.play();
        if (p && typeof p.catch === "function") {
          p.catch((err) => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(err || new Error("audio_play_rejected"));
          });
        }
      } catch (err) {
        if (!settled) {
          settled = true;
          cleanup();
          reject(err);
        }
      }
    });
  }

  async function speakWebSpeechZh(text, rate, token, meta) {
    if (token !== playToken) return false;
    if (!("speechSynthesis" in global) || typeof global.SpeechSynthesisUtterance !== "function") {
      throw new Error("no_webspeech");
    }
    const zhVoice = await resolveZhVoiceAsync(450);
    if (token !== playToken) return false;
    if (!zhVoice) {
      throw new Error("no_zh_voice_installed");
    }
    return new Promise((resolve, reject) => {
      if (token !== playToken) return resolve(false);
      try {
        global.speechSynthesis.cancel();
        const u = new global.SpeechSynthesisUtterance(text);
        u.lang = zhVoice.lang || "zh-CN";
        u.voice = zhVoice;
        u.rate = Math.max(0.5, Math.min(1.5, Number(rate) || 0.95));
        u.onend = () => {
          lastDebug = {
            tier: "webspeech",
            url: zhVoice.name,
            duration: 1,
            error: "",
            resolvedPinyin: (meta && meta.syllable) || "",
            ttsText: text
          };
          resolve(true);
        };
        u.onerror = () => reject(new Error("webspeech_error"));
        global.speechSynthesis.speak(u);
      } catch (err) {
        reject(err);
      }
    });
  }

  async function playSingleChunk(chunk, rate, token, planMeta) {
    const enc = encodeURIComponent(chunk);
    const urls = [];
    if (navigator.onLine !== false) {
      if (planMeta && Array.isArray(planMeta.mp3Candidates) && planMeta.mp3Candidates.length) {
        for (let i = 0; i < planMeta.mp3Candidates.length; i++) {
          urls.push(planMeta.mp3Candidates[i]);
        }
      }
      // Google Translate TTS (CORS-clean, đã loại bỏ Youdao bị chặn ORB trên Chromium)
      if (chunk) {
        urls.push(["gtts_api", `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=zh-CN&q=${enc}`, 5000]);
        urls.push(["gtts_twob", `https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&q=${enc}`, 5000]);
      }
    }

    for (const [tier, url, timeoutMs] of urls) {
      if (token !== playToken) return false;
      try {
        await playUrlAudio(url, rate, token, tier, timeoutMs, planMeta);
        return true;
      } catch (e) {
        lastDebug.error = `${tier}:${e && e.message ? e.message : "fail"}`;
      }
    }

    if (token !== playToken) return false;
    try {
      await speakWebSpeechZh(chunk, rate, token, planMeta);
      return true;
    } catch (e) {
      lastDebug.error = `all_failed:${e && e.message ? e.message : "fail"}`;
      return false;
    }
  }

  async function speak(text, opts) {
    const o = opts || {};
    const rate = o.rate ? o.rate : 1.0;
    const plan = resolvePlan(text, o);
    if (!plan.originalText && !plan.mp3Candidates.length) return false;

    stop();
    const myToken = playToken;

    // Ưu tiên phát âm tiết chuẩn cho từ đơn / thanh mẫu / vận mẫu / bộ thủ
    if (plan.mode === "single_syllable") {
      const ok = await playSingleChunk(plan.ttsText, rate, myToken, plan);
      if (!ok && myToken === playToken && global.S4UI && typeof global.S4UI.toast === "function") {
        global.S4UI.toast("warn", "🔇 Không thể phát âm tiếng Trung (kiểm tra mạng hoặc cài gói giọng zh-CN trên thiết bị).");
      }
      return ok;
    }

    const chunks = splitChunks(plan.ttsText);
    if (!chunks.length) return false;

    let okAny = false;
    for (const chunk of chunks) {
      if (myToken !== playToken) return okAny;
      const ok = await playSingleChunk(chunk, rate, myToken, { syllable: plan.syllable, ttsText: chunk, mp3Candidates: [] });
      if (ok) okAny = true;
      else break;
    }

    if (!okAny && myToken === playToken) {
      if (global.S4UI && typeof global.S4UI.toast === "function") {
        global.S4UI.toast("warn", "🔇 Không thể phát âm tiếng Trung (kiểm tra mạng hoặc cài gói giọng zh-CN trên thiết bị).");
      }
    }
    return okAny;
  }

  if ("speechSynthesis" in global) {
    refreshVoices();
    if (global.speechSynthesis.addEventListener) {
      try { global.speechSynthesis.addEventListener("voiceschanged", refreshVoices); } catch (e) {}
    }
  }

  global.HskTTS = {
    speak,
    stop,
    parsePinyin,
    resolvePlan,
    getLastDebug: () => Object.assign({}, lastDebug)
  };
})(window);
