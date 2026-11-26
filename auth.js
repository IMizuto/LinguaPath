/* LinguaPath - Hệ thống tài khoản, Hồ sơ cá nhân & Quản trị viên
 * - Tài khoản, hồ sơ cá nhân (Avatar, Tên, Mục tiêu Band, Mật khẩu) và tiến độ học đều đồng bộ qua Firebase Realtime Database.
 * - Hỗ trợ học Offline: dữ liệu lưu cục bộ và tự động đồng bộ lên Cloud khi có mạng.
 */
(function () {
  "use strict";

  const AUTH_SCRIPT_SRC = (typeof document !== "undefined" && document.currentScript && document.currentScript.src)
    ? document.currentScript.src
    : "";
  const APP_ROOT_URL = (() => {
    try {
      if (AUTH_SCRIPT_SRC) return new URL("./", AUTH_SCRIPT_SRC).href;
    } catch (e) {}
    return "";
  })();
  const resolveFromRoot = (relPath, fallback) => {
    try {
      if (APP_ROOT_URL) return new URL(relPath, APP_ROOT_URL).href;
    } catch (e) {}
    return fallback;
  };

  const DB = "https://study4-app-default-rtdb.firebaseio.com";
  const K = { cfg: "s4_auth_config_v2", session: "s4_auth_session_v2", cache: "s4_auth_cache_v2" };
  const P_SRS = "s4_vocab_srs_v1", P_DAYS = "s4_vocab_days_v2", P_SET = "s4_vocab_settings_v2", P_VSES = "s4_vocab_active_session_v2";
  const VOCAB_SCOPE_KEYS = [P_SRS, P_DAYS, P_SET, P_VSES];
  const P_GDONE = "s4_grammar_done", P_GLAST = "s4_grammar_last";
  const P_LDONE = "s4_listening_done", P_LLAST = "s4_listening_last_v2", P_LSRS = "s4_listening_srs_v1", P_LDAYS = "s4_listening_days_v1", P_LSET = "s4_listening_settings_v1", P_LSES = "s4_listening_vocab_session_v1", P_LPOS = "s4_listening_lesson_pos_v1", P_LNOTES = "s4_listening_notes_v1", P_LUNIT = "s4_listen_last_by_unit", P_LSUBS = "lp_listening_submissions_v1", P_LPZANS = "s4_pz_listen_answers_v1";
  const P_RDONE = "s4_reading_done", P_RLAST = "s4_reading_last_v2", P_RSRS = "s4_reading_srs_v1", P_RDAYS = "s4_reading_days_v1", P_RSET = "s4_reading_settings_v1", P_RSES = "s4_reading_vocab_session_v1", P_RNOTES = "s4_reading_notes_v1", P_RUNIT = "s4_read_last_by_unit", P_RSUBS = "lp_reading_submissions_v1", P_RPZANS = "s4_pz_read_answers_v1";
  const P_PZFLAGS = "s4_pz_review_flags_v1";
  const P_WDONE = "s4_writing_done", P_WLAST = "s4_writing_last_v1", P_WESSAYS = "s4_writing_essays_v1", P_WNOTES = "s4_writing_notes_v1", P_WSUBS = "lp_submissions_history";
  const P_SDONE = "lp_speaking_done_v1", P_SLAST = "lp_speaking_last_v1", P_SNOTES = "lp_speaking_notes_v1", P_SSUBS = "lp_speaking_submissions_v1", P_SPREFS = "lp_speaking_prefs_v1";
  const P_SSRS = "lp_speaking_vocab_srs_v1", P_SDAYS = "lp_speaking_vocab_days_v1", P_SSET = "lp_speaking_vocab_settings_v1", P_SSES = "lp_speaking_vocab_session_v1";
  const P_TDONE = "s4_ted_done", P_TLAST = "s4_ted_last", P_TPOS = "s4_ted_pos", P_TSUBVI = "s4_ted_show_vi", P_TSHADLANG = "lp_ted_shadow_lang";
  const P_IELTS_RM = "lp_ielts_roadmap_v1", P_HSK_RM = "lp_hsk_roadmap_v1", P_HMOCK = "lp_hsk_mock_results_v1", P_HMWDONE = "lp_hsk_mw_done_v1", P_FND_DONE = "lp_ielts_foundation_done_v1", P_FND_SRS = "lp_ielts_foundation_srs_v1";
  const P_HVSRS = "lp_hsk_vocab_srs_v1", P_HVDAYS = "lp_hsk_vocab_days_v1", P_HVSET = "lp_hsk_vocab_settings_v1", P_HVSES = "lp_hsk_vocab_session_v1";
  const P_HLDONE = "lp_hsk_lessons_done_v1", P_HLLAST = "lp_hsk_lessons_last_v1", P_HWBDONE = "lp_hsk_workbook_done_v1";
  const P_HGDONE = "lp_hsk_grammar_done_v1", P_HGLAST = "lp_hsk_grammar_last_v1", P_HWDONE = "lp_hsk_writing_done_v1", P_HWDRAFTS = "lp_hsk_writing_drafts_v1", P_HLISDONE = "lp_hsk_listening_done_v1", P_HLISLAST = "lp_hsk_listening_last_v1", P_HRDONE = "lp_hsk_reading_done_v1", P_HRLAST = "lp_hsk_reading_last_v1", P_HSDONE = "lp_hsk_speaking_done_v1", P_HSHOOT = "lp_hsk_shooter_best_v1", P_HSHOOTPREF = "lp_hsk_shooter_prefs_v1";
  const PROGRESS_KEYS = [
    P_SRS, P_DAYS, P_SET, P_VSES,
    P_GDONE, P_GLAST,
    P_LDONE, P_LLAST, P_LSRS, P_LDAYS, P_LSET, P_LSES, P_LPOS, P_LNOTES, P_LUNIT, P_LSUBS, P_LPZANS,
    P_RDONE, P_RLAST, P_RSRS, P_RDAYS, P_RSET, P_RSES, P_RNOTES, P_RUNIT, P_RSUBS, P_RPZANS,
    P_PZFLAGS,
    P_WDONE, P_WLAST, P_WESSAYS, P_WNOTES, P_WSUBS,
    P_SDONE, P_SLAST, P_SNOTES, P_SSUBS, P_SPREFS, P_SSRS, P_SDAYS, P_SSET, P_SSES,
    P_IELTS_RM, P_HSK_RM, P_HMOCK, P_HMWDONE, P_FND_DONE, P_FND_SRS,
    P_TDONE, P_TLAST, P_TPOS, P_TSUBVI, P_TSHADLANG,
    P_HVSRS, P_HVDAYS, P_HVSET, P_HVSES, P_HLDONE, P_HLLAST, P_HWBDONE,
    P_HGDONE, P_HGLAST, P_HWDONE, P_HWDRAFTS, P_HLISDONE, P_HLISLAST, P_HRDONE, P_HRLAST, P_HSDONE, P_HSHOOT, P_HSHOOTPREF
  ];
  const SUBMISSION_KEYS = [P_SSUBS, P_WSUBS, P_RSUBS, P_LSUBS];
  const DONE_MAP_KEYS = [P_GDONE, P_TDONE, P_HLDONE, P_HWBDONE, P_HGDONE, P_HLISDONE, P_HRDONE, P_HSDONE, P_HMWDONE, P_FND_DONE];
  const DONE_ARR_KEYS = [P_LDONE, P_RDONE, P_WDONE, P_SDONE];
  const DELETABLE_MAP_KEYS = [P_WESSAYS, P_HWDRAFTS, P_SNOTES, P_LNOTES, P_RNOTES, P_WNOTES, P_RPZANS, P_LPZANS, P_PZFLAGS];
  const isPzDraftKey = k => typeof k === "string" && /^lp_pz_draft_[A-Za-z0-9_-]+$/.test(k);
  const HTML_CACHE_KEYS = [
    "s4_listen_last_rendered_html", "s4_listen_last_sidebar_html", "s4_listen_last_lesson_cache",
    "s4_read_last_rendered_html", "s4_read_last_sidebar_html", "s4_read_last_lesson_cache"
  ];
  const TOTAL_VOCAB = 1827;
  const TOTAL_GRAMMAR = 120;
  const TOTAL_LISTENING_LESSONS = 1482;
  const TOTAL_LISTENING_VOCAB = 2176;
  const TOTAL_READING_LESSONS = 1220;
  const TOTAL_READING_VOCAB = 2969;
  const TOTAL_WRITING_LESSONS = 261;
  const TOTAL_SPEAKING_LESSONS = 2490;
  const TOTAL_SPEAKING_VOCAB = 9214;
  const TOTAL_TED_LESSONS = 202;
  const TOTAL_HSK_VOCAB = 5112;
  const TOTAL_HSK_ITEMS = 764;

  const AVATAR_PRESETS = ["🎓", "🦊", "🐼", "🦁", "🐯", "🐨", "🦉", "🦄", "🐲", "🚀", "⚡", "🌟", "💎", "🔥", "🍀", "🎯"];

  const DEFAULT_CONFIG = {
    authEnforced: false, // Mở khóa 100% tự do
    contactNote: "20% số tiền ủng hộ (Donate) sẽ được trích chuyển trực tiếp tới Mặt trận Tổ quốc Việt Nam để ủng hộ đồng bào & các hoạt động thiện nguyện.",
    bankCode: "MB",
    bankAccount: "0988888888",
    bankOwner: "HOANG NGUYEN",
    transferMemo: "UNG HO LINGUAPATH",
    freeVocabTopicsCount: 999,
    freeGrammarSectionsCount: 999
  };

  /* ---------- Truy cập localStorage gốc ---------- */
  const _setItem = Storage.prototype.setItem;
  const _removeItem = Storage.prototype.removeItem;
  const rawSet = (k, v) => _setItem.call(localStorage, k, v);
  const rawRemove = k => _removeItem.call(localStorage, k);

  function loadObj(k, fb) {
    try {
      const o = JSON.parse(localStorage.getItem(k));
      return o && typeof o === "object" ? o : fb;
    } catch (e) { return fb; }
  }

  ["s4_auth_users_v1", "s4_auth_session_v1", "s4_auth_config_v1"].forEach(k => rawRemove(k));
  Object.keys(localStorage).forEach(k => { if (k.startsWith("s4_profile_")) rawRemove(k); });

  const hadCachedConfig = !!localStorage.getItem(K.cfg);
  let config = Object.assign({}, DEFAULT_CONFIG, loadObj(K.cfg, {}));
  if (!config.contactNote || config.contactNote.includes("kích hoạt") || config.contactNote.includes("Kích Hoạt")) {
    config.contactNote = DEFAULT_CONFIG.contactNote;
  }
  let session = loadObj(K.session, null);   // { username, ph }
  let cache = loadObj(K.cache, {});         // { username: {username, displayName, avatar, targetBand, bio, role, status, expiresAt, passwordHash, createdAt} }

  const saveConfig = () => rawSet(K.cfg, JSON.stringify(config));
  const saveSession = () => { if (session) rawSet(K.session, JSON.stringify(session)); else rawRemove(K.session); };
  const saveCache = () => rawSet(K.cache, JSON.stringify(cache));

  const normalizeDirPath = p => {
    let s = String(p || "/").replace(/\\/g, "/").replace(/\/index\.html?$/i, "/");
    if (!s.endsWith("/")) s += "/";
    return s;
  };
  const isHomePage = () => {
    const p = (location.pathname || "").replace(/\\/g, "/");
    if (APP_ROOT_URL) {
      try {
        return normalizeDirPath(p) === normalizeDirPath(new URL(APP_ROOT_URL).pathname);
      } catch (e) {}
    }
    const subdirs = ["/ielts/", "/toeic/", "/hsk/", "/vocab/", "/grammar/", "/reading/", "/listening/", "/tedtalks/", "/writing/", "/speaking/"];
    return !subdirs.some(d => p.includes(d));
  };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Tiện ích ngày tháng & băm mật khẩu ---------- */
  const ymd = d => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const todayNum = () => ymd(new Date());
  function parseYmd(n) {
    const s = String(n || "");
    if (!/^\d{8}$/.test(s)) return null;
    return new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8));
  }
  // Trả về: Infinity nếu vĩnh viễn, số nguyên >= 0 nếu còn hạn, số âm nếu đã quá hạn
  function daysRemaining(expiresAt) {
    if (!expiresAt || expiresAt === "PERM") return Infinity;
    const expDate = parseYmd(expiresAt);
    if (!expDate) return Infinity;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    expDate.setHours(0, 0, 0, 0);
    return Math.round((expDate.getTime() - now.getTime()) / 86400000);
  }
  function fmtRelativeTime(iso) {
    if (!iso) return "Chưa rõ";
    const t = Date.parse(iso);
    if (!Number.isFinite(t)) return String(iso).slice(0, 10);
    const diffSec = Math.max(0, Math.floor((Date.now() - t) / 1000));
    if (diffSec < 90) return "Vừa xong";
    if (diffSec < 3600) return Math.floor(diffSec / 60) + " phút trước";
    if (diffSec < 86400) return Math.floor(diffSec / 3600) + " giờ trước";
    const days = Math.floor(diffSec / 86400);
    if (days <= 30) return days + " ngày trước";
    const d = new Date(t);
    return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
  }

  function simpleHash(str) {
    let h1 = 0xdeadbeef ^ str.length, h2 = 0x41c6ce57 ^ str.length;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return ((h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0")).toUpperCase();
  }
  async function sha256Hex(str) {
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }
    return "L" + simpleHash(str);
  }
  async function hashPwLegacy(username, pw) {
    return sha256Hex("s4|" + username + "|" + pw);
  }
  async function hashPwV2(username, pw) {
    if (window.crypto && crypto.subtle && typeof crypto.subtle.importKey === "function" && window.TextEncoder) {
      try {
        const enc = new TextEncoder();
        const baseKey = await crypto.subtle.importKey("raw", enc.encode(String(pw || "")), "PBKDF2", false, ["deriveBits"]);
        const bits = await crypto.subtle.deriveBits(
          { name: "PBKDF2", salt: enc.encode("lp-v2|" + username), iterations: 100000, hash: "SHA-256" },
          baseKey,
          256
        );
        const hex = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, "0")).join("");
        return "v2_" + hex;
      } catch (e) {}
    }
    return hashPwLegacy(username, pw);
  }
  async function hashPw(username, pw) {
    return hashPwV2(username, pw);
  }
  async function deriveReadKey(username, ph) {
    return sha256Hex("lp-read|" + username + "|" + ph);
  }
  function makeWriteProofToken(ph) {
    let rand = "";
    try {
      if (window.crypto && typeof crypto.getRandomValues === "function") {
        const arr = new Uint8Array(6);
        crypto.getRandomValues(arr);
        rand = Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
      }
    } catch (e) {}
    if (!rand) rand = Math.random().toString(36).slice(2, 12);
    return String(ph || "") + "|" + Date.now() + "_" + rand;
  }

  /* ---------- Firebase REST & Ghi Nguyên tử Chống lộ authProof ---------- */
  let legacyFirebaseRulesActive = false;

  async function db(path, method, body, opts) {
    opts = opts || {};
    const ctl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = setTimeout(() => ctl && ctl.abort(), opts.timeout || 12000);
    try {
      const init = { method: method || "GET" };
      if (body !== undefined) { init.headers = { "Content-Type": "application/json" }; init.body = JSON.stringify(body); }
      if (ctl) init.signal = ctl.signal;
      if (opts.keepalive) init.keepalive = true;
      const url = path ? `${DB}/${path}.json` : `${DB}/.json`;
      const res = await fetch(url, init);
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } finally { clearTimeout(timer); }
  }

  function isAuthDeniedErr(e) {
    const msg = String((e && e.message) || "");
    return msg.includes("HTTP 401") || msg.includes("HTTP 403");
  }

  function stripSensitiveFields(obj) {
    const out = {};
    Object.keys(obj || {}).forEach(k => {
      if (k !== "authProof" && k !== "passwordHash") out[k] = obj[k];
    });
    return out;
  }

  // Ghi nguyên tử (Multi-location PATCH /.json): đẩy mã chứng thực dùng 1 lần vào nhánh ẩn
  // study4_write_proof/$actor (.read: false) và tuyệt đối KHÔNG lưu authProof/passwordHash vào nút công khai.
  async function dbSecureWrite(actor, targetPath, payload, proofPh, opts) {
    opts = opts || {};
    const normActor = actor || (session && session.username) || "";
    const ph = proofPh || (session && session.ph) || "";
    const multi = {};
    if (normActor && ph) {
      multi[`study4_write_proof/${normActor}`] = makeWriteProofToken(ph);
    }
    if (opts.delete) {
      multi[targetPath] = null;
    } else if (opts.replace) {
      multi[targetPath] = stripSensitiveFields(payload);
    } else {
      const clean = stripSensitiveFields(payload);
      Object.keys(clean).forEach(k => {
        multi[`${targetPath}/${k}`] = clean[k];
      });
      multi[`${targetPath}/authProof`] = null;
      if (targetPath.startsWith("study4_users/")) {
        multi[`${targetPath}/passwordHash`] = null;
      }
    }

    try {
      return await db("", "PATCH", multi, opts);
    } catch (e) {
      if (!isAuthDeniedErr(e) || opts.allowLegacyFallback === false) throw e;
      legacyFirebaseRulesActive = true;
      if (opts.delete) {
        return await db(targetPath, "DELETE", undefined, opts);
      }
      const legacyBody = Object.assign({}, stripSensitiveFields(payload));
      if (ph && !opts.omitLegacyProof) legacyBody.authProof = ph;
      return await db(targetPath, opts.replace ? "PUT" : "PATCH", legacyBody, opts);
    }
  }

  // Lưu mã băm mật khẩu & readKey sang nhánh bảo mật riêng (study4_auth/$username có .read: false)
  // và tự động gỡ passwordHash + authProof khỏi nhánh hồ sơ công khai study4_users/$username.
  async function syncAuthSecret(uname, newPh, proofPh) {
    if (!uname || !newPh) return false;
    try {
      const readKey = await deriveReadKey(uname, newPh);
      await db(`study4_auth/${uname}`, "PUT", {
        passwordHash: newPh,
        readKey: readKey,
        prevPh: proofPh || newPh,
        updatedAt: Date.now()
      });
      const actor = (isAdmin() && uname !== "admin") ? "admin" : uname;
      const writePh = (actor === "admin" && proofPh) ? proofPh : newPh;
      dbSecureWrite(actor, `study4_users/${uname}`, {}, writePh, { allowLegacyFallback: false }).catch(() => {});
      return true;
    } catch (e) {
      return false;
    }
  }

  // Kiểm tra mật khẩu tương thích cả trước và sau khi cập nhật Rules mới trên Firebase Console.
  async function verifyAuthSecret(uname, ph, userRec) {
    if (!uname || !ph || !userRec) return false;
    if (userRec.passwordHash) {
      if (userRec.passwordHash !== ph) return false;
      syncAuthSecret(uname, ph, ph).catch(() => {});
      return true;
    }
    if (!userRec.username && !userRec.role) return false;
    try {
      await db(`study4_auth/${uname}/check/${ph}`);
      return true;
    } catch (e) {
      if (isAuthDeniedErr(e)) return false;
      throw e;
    }
  }

  async function readRemoteProgress(uname, ph) {
    const activePh = ph || (session && session.ph) || "";
    if (activePh) {
      try {
        const rk = await deriveReadKey(uname, activePh);
        const priv = await db(`study4_progress_priv/${uname}/${rk}`);
        if (priv && typeof priv === "object") return priv;
      } catch (e) {
        if (!isAuthDeniedErr(e)) throw e;
      }
    }
    try {
      const leg = await db(`study4_progress/${uname}`);
      if (leg && typeof leg === "object") {
        leg._fromLegacy = true;
        return leg;
      }
    } catch (e) {
      if (!isAuthDeniedErr(e)) throw e;
    }
    return null;
  }

  async function writeRemoteProgress(uname, body, ph, opts) {
    const activePh = ph || (session && session.ph) || "";
    const cleanBody = stripSensitiveFields(body);
    if (activePh) {
      try {
        const rk = await deriveReadKey(uname, activePh);
        const multi = {
          [`study4_write_proof/${uname}`]: makeWriteProofToken(activePh),
          [`study4_progress_priv/${uname}/${rk}`]: cleanBody
        };
        if (opts && opts.scrubLegacy) {
          multi[`study4_progress/${uname}`] = null;
        }
        const small = JSON.stringify(multi).length < 60000;
        await db("", "PATCH", multi, { keepalive: !!(opts && opts.keepalive && small) });
        return true;
      } catch (e) {
        if (!isAuthDeniedErr(e)) throw e;
        legacyFirebaseRulesActive = true;
      }
    }
    const legacyBody = Object.assign({}, cleanBody, { authProof: activePh });
    const small = JSON.stringify(legacyBody).length < 60000;
    await db(`study4_progress/${uname}`, "PUT", legacyBody, { keepalive: !!(opts && opts.keepalive && small) });
    return true;
  }

  /* ---------- Người dùng hiện tại ---------- */
  function effective(u) {
    if (u && u.role === "vip" && u.expiresAt && u.expiresAt !== "PERM" && todayNum() > Number(u.expiresAt)) {
      return Object.assign({}, u, { role: "basic", expiredVipAt: u.expiresAt });
    }
    return u;
  }
  function getCurrentUser() {
    if (!session || !session.username) return null;
    const u = cache[session.username];
    if (!u || u.status === "blocked") return null;
    return effective(u);
  }
  function isFullAccess() {
    return true;
  }
  function isAdmin() { const u = getCurrentUser(); return !!u && u.role === "admin"; }

  function cacheUserRecord(rec, ph) {
    const prev = cache[rec.username] || {};
    cache[rec.username] = {
      username: rec.username,
      displayName: rec.displayName || prev.displayName || rec.username,
      avatar: rec.avatar || prev.avatar || "🎓",
      targetBand: rec.targetBand || prev.targetBand || "7.0",
      bio: rec.bio !== undefined ? rec.bio : (prev.bio || ""),
      role: rec.role || "basic",
      status: rec.status || "active",
      expiresAt: rec.expiresAt || "PERM",
      createdAt: rec.createdAt || prev.createdAt || "",
      passwordHash: ph || rec.passwordHash || prev.passwordHash || ""
    };
    saveCache();
  }

  function renderAvatarHtml(avatarStr, sizePx) {
    const sz = sizePx || 26;
    const av = avatarStr || "🎓";
    if (av.startsWith("data:image/") || av.startsWith("http://") || av.startsWith("https://")) {
      return `<img src="${esc(av)}" alt="avt" style="width:${sz}px;height:${sz}px;border-radius:50%;object-fit:cover;vertical-align:middle;border:1.5px solid rgba(255,255,255,0.35);flex-shrink:0;">`;
    }
    const fontSz = Math.round(sz * 0.62);
    return `<span style="display:inline-flex;align-items:center;justify-content:center;width:${sz}px;height:${sz}px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;font-size:${fontSz}px;vertical-align:middle;flex-shrink:0;user-select:none;">${esc(av)}</span>`;
  }

  /* ---------- Tiến độ học: đọc/ghi/gộp & tính toán chỉ số chi tiết ---------- */
  function readProgress() {
    const m = {};
    PROGRESS_KEYS.forEach(k => { const v = localStorage.getItem(k); if (v !== null) m[k] = v; });
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (isPzDraftKey(k)) {
        const v = localStorage.getItem(k);
        if (v !== null && v !== "") m[k] = v;
      }
    }
    return m;
  }
  let hookSuspended = false;
  function writeProgress(map) {
    hookSuspended = true;
    try {
      PROGRESS_KEYS.forEach(k => { if (map[k] !== undefined && map[k] !== null) rawSet(k, map[k]); else rawRemove(k); });
      const existingDraftKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (isPzDraftKey(k)) existingDraftKeys.push(k);
      }
      existingDraftKeys.forEach(k => {
        if (!map || map[k] === undefined || map[k] === null || map[k] === "") rawRemove(k);
      });
      Object.keys(map || {}).forEach(k => {
        if (isPzDraftKey(k) && map[k] !== undefined && map[k] !== null && map[k] !== "") rawSet(k, String(map[k]));
      });
      HTML_CACHE_KEYS.forEach(k => rawRemove(k));
    } finally { hookSuspended = false; }
  }
  function parseJ(s, fb) { try { const o = JSON.parse(s); return o && typeof o === "object" ? o : fb; } catch (e) { return fb; } }

  /* ---------- Tombstone chống hồi sinh dữ liệu đã xóa khi đồng bộ Cloud ---------- */
  const TOMB_TTL_MS = 90 * 86400000;
  function emptyTombs() { return { subs: {}, done: {}, maps: {}, drafts: {} }; }
  function normalizeTombs(raw) {
    const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    const now = Date.now();
    const out = emptyTombs();
    const copyNested = (bn, limit) => {
      const b = src[bn];
      if (!b || typeof b !== "object" || Array.isArray(b)) return;
      Object.keys(b).forEach(k => {
        const sub = b[k];
        if (!sub || typeof sub !== "object" || Array.isArray(sub)) return;
        const pairs = Object.keys(sub)
          .map(id => [id, Number(sub[id] || 0)])
          .filter(([, ts]) => ts > 0 && (now - ts) < TOMB_TTL_MS)
          .sort((a, z) => z[1] - a[1])
          .slice(0, limit || 200);
        if (pairs.length) {
          out[bn][k] = {};
          pairs.forEach(([id, ts]) => { out[bn][k][id] = ts; });
        }
      });
    };
    copyNested("subs", 200);
    copyNested("done", 250);
    copyNested("maps", 250);
    if (src.drafts && typeof src.drafts === "object" && !Array.isArray(src.drafts)) {
      Object.keys(src.drafts)
        .map(k => [k, Number(src.drafts[k] || 0)])
        .filter(([k, ts]) => isPzDraftKey(k) && ts > 0 && (now - ts) < TOMB_TTL_MS)
        .sort((a, z) => z[1] - a[1])
        .slice(0, 200)
        .forEach(([k, ts]) => { out.drafts[k] = ts; });
    }
    return out;
  }
  function getTombstones(u) {
    if (!u) return emptyTombs();
    return normalizeTombs(loadObj("s4_auth_tombs_" + u, emptyTombs()));
  }
  function setTombstones(u, t) {
    if (!u) return;
    rawSet("s4_auth_tombs_" + u, JSON.stringify(normalizeTombs(t)));
  }
  function mergeTombstones(aRaw, bRaw) {
    const a = normalizeTombs(aRaw), b = normalizeTombs(bRaw);
    const out = emptyTombs();
    ["subs", "done", "maps"].forEach(bn => {
      new Set(Object.keys(a[bn]).concat(Object.keys(b[bn]))).forEach(k => {
        const sa = a[bn][k] || {}, sb = b[bn][k] || {};
        const merged = {};
        new Set(Object.keys(sa).concat(Object.keys(sb))).forEach(id => {
          merged[id] = Math.max(Number(sa[id] || 0), Number(sb[id] || 0));
        });
        if (Object.keys(merged).length) out[bn][k] = merged;
      });
    });
    new Set(Object.keys(a.drafts).concat(Object.keys(b.drafts))).forEach(k => {
      out.drafts[k] = Math.max(Number(a.drafts[k] || 0), Number(b.drafts[k] || 0));
    });
    return normalizeTombs(out);
  }
  function extractDoneIdSet(raw) {
    const parsed = parseJ(raw, null);
    const set = new Set();
    if (Array.isArray(parsed)) parsed.forEach(id => { if (id) set.add(String(id)); });
    else if (parsed && typeof parsed === "object") Object.keys(parsed).forEach(k => { if (parsed[k]) set.add(String(k)); });
    return set;
  }
  function recordLocalDeletionDelta(uname, k, prevVal, nextVal) {
    if (!uname) return;
    const now = Date.now();
    let changed = false;
    const tombs = getTombstones(uname);
    const ensureBucket = (bn, key) => {
      if (!tombs[bn][key]) tombs[bn][key] = {};
      return tombs[bn][key];
    };
    const isNonEmptyMapVal = v => v !== undefined && v !== null && v !== "" && v !== false;

    if (SUBMISSION_KEYS.indexOf(k) >= 0) {
      const prevArr = parseJ(prevVal, []);
      const nextArr = parseJ(nextVal, []);
      const nextIds = new Set((Array.isArray(nextArr) ? nextArr : []).map(it => it && it.id ? String(it.id) : "").filter(Boolean));
      const b = ensureBucket("subs", k);
      (Array.isArray(prevArr) ? prevArr : []).forEach(it => {
        const id = it && it.id ? String(it.id) : "";
        if (id && !nextIds.has(id)) { b[id] = now; changed = true; }
      });
      nextIds.forEach(id => { if (b[id]) { delete b[id]; changed = true; } });
    } else if (DONE_MAP_KEYS.indexOf(k) >= 0 || DONE_ARR_KEYS.indexOf(k) >= 0) {
      const prevSet = extractDoneIdSet(prevVal);
      const nextSet = extractDoneIdSet(nextVal);
      const b = ensureBucket("done", k);
      prevSet.forEach(id => { if (!nextSet.has(id)) { b[id] = now; changed = true; } });
      nextSet.forEach(id => { if (b[id]) { delete b[id]; changed = true; } });
    } else if (k === P_HWDONE) {
      const pa = parseJ(prevVal, {}), na = parseJ(nextVal, {});
      const b = ensureBucket("done", P_HWDONE);
      const buckets = new Set(["chars", "radicals", "reorder", "pinyinWrite", "makeSentence", "essays"].concat(Object.keys(pa || {}), Object.keys(na || {})));
      buckets.forEach(bk => {
        const prevB = pa && pa[bk] && typeof pa[bk] === "object" ? pa[bk] : {};
        const nextB = na && na[bk] && typeof na[bk] === "object" ? na[bk] : {};
        Object.keys(prevB).forEach(id => {
          const tk = bk + ":" + id;
          if (prevB[id] && !nextB[id]) { b[tk] = now; changed = true; }
        });
        Object.keys(nextB).forEach(id => {
          const tk = bk + ":" + id;
          if (nextB[id] && b[tk]) { delete b[tk]; changed = true; }
        });
      });
    } else if (DELETABLE_MAP_KEYS.indexOf(k) >= 0) {
      const prevObj = parseJ(prevVal, {}), nextObj = parseJ(nextVal, {});
      const b = ensureBucket("maps", k);
      Object.keys(prevObj || {}).forEach(sk => {
        if (isNonEmptyMapVal(prevObj[sk]) && !isNonEmptyMapVal(nextObj[sk])) {
          b[sk] = now; changed = true;
        }
      });
      Object.keys(nextObj || {}).forEach(sk => {
        if (isNonEmptyMapVal(nextObj[sk]) && b[sk]) {
          delete b[sk]; changed = true;
        }
      });
    } else if (isPzDraftKey(k)) {
      const hadPrev = prevVal !== null && prevVal !== undefined && String(prevVal) !== "";
      const hasNext = nextVal !== null && nextVal !== undefined && String(nextVal) !== "";
      if (hadPrev && !hasNext) { tombs.drafts[k] = now; changed = true; }
      else if (hasNext && tombs.drafts[k]) { delete tombs.drafts[k]; changed = true; }
    }
    if (changed) setTombstones(uname, tombs);
  }
  function canon(v) {
    if (Array.isArray(v)) return "[" + v.map(canon).join(",") + "]";
    if (v && typeof v === "object") return "{" + Object.keys(v).sort().map(k => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}";
    return JSON.stringify(v);
  }
  function sameProgress(a, b) {
    const allKeys = new Set(PROGRESS_KEYS);
    Object.keys(a || {}).forEach(k => { if (isPzDraftKey(k)) allKeys.add(k); });
    Object.keys(b || {}).forEach(k => { if (isPzDraftKey(k)) allKeys.add(k); });
    return Array.from(allKeys).every(k => {
      const x = a[k], y = b[k];
      if (x === undefined || y === undefined) return x === y;
      if (isPzDraftKey(k)) return String(x) === String(y);
      return canon(parseJ(x, x)) === canon(parseJ(y, y));
    });
  }
  const stamp = x => Math.max(Number(x && x.lastReview) || 0, Number(x && x.updatedAt) || 0, Number(x && x.reps) || 0);
  function mergeSrsMap(aStr, bStr) {
    const a = parseJ(aStr, {}), b = parseJ(bStr, {});
    const m = Object.assign({}, a);
    Object.keys(b).forEach(id => { if (!a[id] || stamp(b[id]) >= stamp(a[id])) m[id] = b[id]; });
    return JSON.stringify(m);
  }
  function mergeDaysMap(aStr, bStr) {
    const a = parseJ(aStr, {}), b = parseJ(bStr, {});
    const m = {};
    new Set(Object.keys(a).concat(Object.keys(b))).forEach(d => {
      m[d] = Array.from(new Set([].concat(Array.isArray(a[d]) ? a[d] : [], Array.isArray(b[d]) ? b[d] : [])));
    });
    return JSON.stringify(m);
  }
  function mergeDoneListOrMap(aStr, bStr, asArray, localTombs, remoteTombs, localTs) {
    const toIds = raw => {
      const parsed = parseJ(raw, asArray ? [] : {});
      if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
      if (parsed && typeof parsed === "object") return Object.keys(parsed).filter(k => parsed[k]).map(String);
      return [];
    };
    const lSet = new Set(toIds(aStr));
    const rSet = new Set(toIds(bStr));
    const lt = localTombs || {};
    const rt = remoteTombs || {};
    const outIds = [];
    const seen = new Set();
    const keepId = id => {
      if (seen.has(id)) return;
      const inLocal = lSet.has(id);
      const inRemote = rSet.has(id);
      if (!inLocal && inRemote && (lt[id] || rt[id])) return;
      if (inLocal && !inRemote && rt[id] && Number(rt[id]) > Number(localTs || 0)) return;
      seen.add(id);
      outIds.push(id);
    };
    lSet.forEach(keepId);
    rSet.forEach(keepId);
    if (asArray) return JSON.stringify(outIds);
    const outObj = {};
    outIds.forEach(id => { outObj[id] = true; });
    return JSON.stringify(outObj);
  }
  function mergeHskWritingDone(aStr, bStr, localTombs, remoteTombs, localTs) {
    const a = parseJ(aStr, {}), b = parseJ(bStr, {});
    const lt = localTombs || {}, rt = remoteTombs || {};
    const out = { chars: {}, radicals: {}, reorder: {}, pinyinWrite: {}, makeSentence: {}, essays: {} };
    const buckets = new Set(["chars", "radicals", "reorder", "pinyinWrite", "makeSentence", "essays"].concat(Object.keys(a), Object.keys(b)));
    buckets.forEach(bk => {
      const ba = a && a[bk] && typeof a[bk] === "object" && !Array.isArray(a[bk]) ? a[bk] : {};
      const bb = b && b[bk] && typeof b[bk] === "object" && !Array.isArray(b[bk]) ? b[bk] : {};
      const merged = {};
      new Set(Object.keys(ba).concat(Object.keys(bb))).forEach(k => {
        const tk = bk + ":" + k;
        const inL = Boolean(ba[k]), inR = Boolean(bb[k]);
        if (!inL && !inR) return;
        if (!inL && inR && (lt[tk] || rt[tk])) return;
        if (inL && !inR && rt[tk] && Number(rt[tk]) > Number(localTs || 0)) return;
        merged[k] = true;
      });
      out[bk] = merged;
    });
    return JSON.stringify(out);
  }
  function mergeRoadmapState(aStr, bStr, preferLocalScalar) {
    const a = parseJ(aStr, null), b = parseJ(bStr, null);
    const oa = a && typeof a === "object" && !Array.isArray(a) ? a : null;
    const ob = b && typeof b === "object" && !Array.isArray(b) ? b : null;
    if (!oa && !ob) return undefined;
    if (!oa) return JSON.stringify(ob);
    if (!ob) return JSON.stringify(oa);
    const toTs = v => {
      if (typeof v === "number" && Number.isFinite(v)) return v;
      if (typeof v === "string" && v.trim()) {
        const n = Number(v);
        if (Number.isFinite(n)) return n;
        const p = Date.parse(v);
        return Number.isFinite(p) ? p : 0;
      }
      return 0;
    };
    const ta = toTs(oa.updatedAt), tb = toTs(ob.updatedAt);
    const useLocal = tb !== ta ? (ta > tb) : Boolean(preferLocalScalar);
    const newer = useLocal ? oa : ob;
    const older = useLocal ? ob : oa;
    const sa = oa.skipped && typeof oa.skipped === "object" && !Array.isArray(oa.skipped) ? oa.skipped : {};
    const sb = ob.skipped && typeof ob.skipped === "object" && !Array.isArray(ob.skipped) ? ob.skipped : {};
    const skipped = {};
    new Set(Object.keys(sa).concat(Object.keys(sb))).forEach(k => {
      if (sa[k] || sb[k]) skipped[k] = true;
    });
    const out = Object.assign({}, older, newer, { skipped });
    if (newer.startLevel !== undefined) out.startLevel = newer.startLevel;
    if (newer.pace !== undefined) out.pace = newer.pace;
    out.updatedAt = tb > ta ? ob.updatedAt : (ta > tb ? oa.updatedAt : (newer.updatedAt || older.updatedAt || ""));
    return JSON.stringify(out);
  }
  function mergeHskMock(aStr, bStr) {
    const a = parseJ(aStr, {}) || {}, b = parseJ(bStr, {}) || {};
    const ba = a.bestById && typeof a.bestById === "object" ? a.bestById : {};
    const bb = b.bestById && typeof b.bestById === "object" ? b.bestById : {};
    const best = {};
    new Set(Object.keys(ba).concat(Object.keys(bb))).forEach(id => {
      const x = ba[id], y = bb[id];
      if (!x) { best[id] = y; return; }
      if (!y) { best[id] = x; return; }
      const sx = Number(x.score) || 0, sy = Number(y.score) || 0;
      if (sx !== sy) best[id] = sx > sy ? x : y;
      else best[id] = (y.passed && !x.passed) ? y : x;
      if (sx === sy && (x.passed || y.passed)) best[id] = Object.assign({}, best[id], { passed: true });
    });
    const seen = new Set(), hist = [];
    []
      .concat(Array.isArray(a.history) ? a.history : [], Array.isArray(b.history) ? b.history : [])
      .forEach(h => {
        if (!h || typeof h !== "object") return;
        const key = String(h.id) + "|" + String(h.dateIso);
        if (seen.has(key)) return;
        seen.add(key); hist.push(h);
      });
    hist.sort((p, q) => String(q.dateIso || "").localeCompare(String(p.dateIso || "")));
    return JSON.stringify({ bestById: best, history: hist.slice(0, 30) });
  }
  function mergeHskShooterBest(aStr, bStr) {
    const a = parseJ(aStr, {}), b = parseJ(bStr, {});
    return JSON.stringify({
      bestScore: Math.max(Number(a.bestScore || 0), Number(b.bestScore || 0)),
      bestCombo: Math.max(Number(a.bestCombo || 0), Number(b.bestCombo || 0)),
      totalKills: Math.max(Number(a.totalKills || 0), Number(b.totalKills || 0)),
      gamesPlayed: Math.max(Number(a.gamesPlayed || 0), Number(b.gamesPlayed || 0)),
      updatedAt: Math.max(Number(a.updatedAt || 0), Number(b.updatedAt || 0))
    });
  }
  function isDraftDoneInSrs(id, draft, srsObj, now) {
    if (!draft || typeof draft !== "object") return true;
    const st = srsObj && srsObj[id];
    if (!st || typeof st !== "object") return false;
    if (st.ignored) return true;
    const reviewedAt = Number(st.lastReview || st.updatedAt || 0);
    return reviewedAt >= Number(draft.updatedAt || 0) && Number(st.due || 0) > now;
  }
  function isSessionItemDoneInSrs(item, sessSavedAt, sessMode, srsObj, now) {
    if (!item || !item.id) return true;
    const st = srsObj && srsObj[item.id];
    if (!st || typeof st !== "object") return false;
    if (st.ignored) return true;
    const reviewedAt = Number(st.lastReview || st.updatedAt || 0);
    const inFlightRepeat = (item._lapsed && !item._relearned) || (item._hardRepeated && sessMode === "flashcard");
    const reviewedAfterSave = inFlightRepeat ? (reviewedAt > Number(sessSavedAt || 0)) : (reviewedAt >= Number(sessSavedAt || 0));
    if (reviewedAfterSave && Number(st.due || 0) > now) return true;
    if (item._new && Number(st.due || 0) > now && (sessMode === "smart" || !(item._lapsed || item._hardRepeated || item._rated))) return true;
    return false;
  }
  function filterSessionRecord(sess, srsObj, now, skipIfExtra) {
    if (!sess || !Array.isArray(sess.queue) || !sess.queue.length) return null;
    if ((skipIfExtra && sess.extraPracticeMode) || !srsObj) return sess;
    const nextQueue = sess.queue.filter(it => !isSessionItemDoneInSrs(it, sess.savedAt, sess.mode, srsObj, now));
    if (!nextQueue.length) return null;
    if (nextQueue.length === sess.queue.length) return sess;
    return Object.assign({}, sess, { queue: nextQueue });
  }
  function mergeDraftMaps(aDrafts, bDrafts, srsMap, preferLocal) {
    const a = aDrafts && typeof aDrafts === "object" && !Array.isArray(aDrafts) ? aDrafts : {};
    const b = bDrafts && typeof bDrafts === "object" && !Array.isArray(bDrafts) ? bDrafts : {};
    const srsObj = typeof srsMap === "string" ? parseJ(srsMap, null) : (srsMap && typeof srsMap === "object" ? srsMap : null);
    const now = Date.now();
    const out = {};
    new Set(Object.keys(a).concat(Object.keys(b))).forEach(id => {
      const rawA = a[id], rawB = b[id];
      const da = rawA && !isDraftDoneInSrs(id, rawA, srsObj, now) ? rawA : null;
      const dbItem = rawB && !isDraftDoneInSrs(id, rawB, srsObj, now) ? rawB : null;
      if (!da && !dbItem) return;
      if (!da) {
        if (!preferLocal) out[id] = dbItem;
        return;
      }
      if (!dbItem) { out[id] = da; return; }
      const ta = Number(da.updatedAt || 0), tb = Number(dbItem.updatedAt || 0);
      if (tb > ta) out[id] = dbItem;
      else if (ta > tb) out[id] = da;
      else out[id] = Number(dbItem.stage || 0) >= Number(da.stage || 0) ? dbItem : da;
    });
    const keys = Object.keys(out);
    if (keys.length > 500) {
      keys.sort((x, y) => Number(out[y] && out[y].updatedAt || 0) - Number(out[x] && out[x].updatedAt || 0))
        .slice(500).forEach(k => { delete out[k]; });
    }
    return out;
  }
  function mergeVocabActiveSession(aStr, bStr, srsStr, preferLocal) {
    const a = parseJ(aStr, {}), b = parseJ(bStr, {});
    const srsObj = srsStr ? parseJ(srsStr, null) : null;
    const now = Date.now();
    const out = {};
    const topics = new Set(Object.keys(a).concat(Object.keys(b)).filter(k => k !== "__drafts"));
    topics.forEach(t => {
      const va = filterSessionRecord(a[t], srsObj, now, false);
      const vb = filterSessionRecord(b[t], srsObj, now, false);
      if (!va && !vb) return;
      if (!va) {
        if (!preferLocal) out[t] = vb;
        return;
      }
      if (!vb) { out[t] = va; return; }
      out[t] = Number(vb.savedAt || 0) >= Number(va.savedAt || 0) ? vb : va;
    });
    const tKeys = Object.keys(out);
    if (tKeys.length > 60) {
      tKeys.sort((x, y) => Number(out[y] && out[y].savedAt || 0) - Number(out[x] && out[x].savedAt || 0))
        .slice(60).forEach(k => { delete out[k]; });
    }
    const drafts = mergeDraftMaps(a.__drafts, b.__drafts, srsObj, preferLocal);
    if (Object.keys(drafts).length) out.__drafts = drafts;
    return Object.keys(out).length ? JSON.stringify(out) : undefined;
  }
  function mergeEngineSessionStore(aStr, bStr, srsStr, preferLocal) {
    const a = parseJ(aStr, {}), b = parseJ(bStr, {});
    const srsObj = srsStr ? parseJ(srsStr, null) : null;
    const now = Date.now();
    const saMap = a && a.sessions && typeof a.sessions === "object" ? a.sessions : {};
    const sbMap = b && b.sessions && typeof b.sessions === "object" ? b.sessions : {};
    const sessions = {};
    new Set(Object.keys(saMap).concat(Object.keys(sbMap))).forEach(id => {
      const va = filterSessionRecord(saMap[id], srsObj, now, true);
      const vb = filterSessionRecord(sbMap[id], srsObj, now, true);
      if (!va && !vb) return;
      if (!va) {
        if (!preferLocal) sessions[id] = vb;
        return;
      }
      if (!vb) { sessions[id] = va; return; }
      sessions[id] = Number(vb.savedAt || 0) >= Number(va.savedAt || 0) ? vb : va;
    });
    const sKeys = Object.keys(sessions);
    if (sKeys.length > 60) {
      sKeys.sort((x, y) => Number(sessions[y] && sessions[y].savedAt || 0) - Number(sessions[x] && sessions[x].savedAt || 0))
        .slice(60).forEach(k => { delete sessions[k]; });
    }
    const drafts = mergeDraftMaps(a && a.drafts, b && b.drafts, srsObj, preferLocal);
    return (Object.keys(sessions).length || Object.keys(drafts).length) ? JSON.stringify({ sessions, drafts }) : undefined;
  }
  function mergeLessonPosMap(aStr, bStr) {
    const a = parseJ(aStr, {}), b = parseJ(bStr, {});
    const out = {};
    new Set(Object.keys(a).concat(Object.keys(b))).forEach(id => {
      const pa = a[id], pb = b[id];
      const va = pa && typeof pa === "object" ? pa : null;
      const vb = pb && typeof pb === "object" ? pb : null;
      if (!va && !vb) return;
      if (!va) { out[id] = vb; return; }
      if (!vb) { out[id] = va; return; }
      out[id] = Number(vb.updatedAt || 0) >= Number(va.updatedAt || 0) ? vb : va;
    });
    const keys = Object.keys(out);
    if (keys.length > 200) {
      keys.sort((x, y) => Number(out[y] && out[y].updatedAt || 0) - Number(out[x] && out[x].updatedAt || 0))
        .slice(200).forEach(k => { delete out[k]; });
    }
    return JSON.stringify(out);
  }
  /**
   * Merge two submission history arrays (Speaking, Writing, Reading/Listening PZ) deduplicated by id.
   */
  const submissionStamp = it => Math.max(
    Number(it && it.timestamp || 0),
    Number(it && it.createdAt || 0),
    Number(it && it.aiEvaluation && it.aiEvaluation.updatedAt || 0)
  );
  function mergeSubmissionHistory(aStr, bStr, maxKeep, localTombs, remoteTombs) {
    const a = parseJ(aStr, []), b = parseJ(bStr, []);
    const lt = localTombs || {}, rt = remoteTombs || {};
    const map = {};
    [].concat(Array.isArray(a) ? a : [], Array.isArray(b) ? b : []).forEach(it => {
      if (!it || typeof it !== "object" || !it.id) return;
      const id = String(it.id);
      const delTs = Math.max(Number(lt[id] || 0), Number(rt[id] || 0));
      if (delTs > 0 && delTs >= submissionStamp(it)) return;
      const prev = map[id];
      if (!prev || submissionStamp(it) >= submissionStamp(prev)) map[id] = it;
    });
    const list = Object.values(map).sort((x, y) => submissionStamp(y) - submissionStamp(x));
    return JSON.stringify(list.slice(0, maxKeep || 80));
  }
  /**
   * Merge per-lesson text notes respecting local/remote tombstones so cleared notes stay deleted.
   */
  function mergeNotesMap(localStr, remoteStr, localTombs, remoteTombs, localTs) {
    const rNotes = parseJ(remoteStr, {}), lNotes = parseJ(localStr, {});
    const lt = localTombs || {}, rt = remoteTombs || {};
    const out = {};
    new Set(Object.keys(rNotes).concat(Object.keys(lNotes))).forEach(id => {
      const lv = lNotes[id], rv = rNotes[id];
      const hasL = Boolean(lv), hasR = Boolean(rv);
      if (!hasL && hasR && (lt[id] || rt[id])) return;
      if (hasL && !hasR && rt[id] && Number(rt[id]) > Number(localTs || 0)) return;
      if (hasL) out[id] = lv;
      else if (hasR) out[id] = rv;
    });
    return JSON.stringify(out);
  }
  /**
   * Merge two key-value maps (answers, flags, prefs, drafts) respecting tombstones so retakes/deletions persist.
   */
  function mergeKeyMap(localStr, remoteStr, localTombs, remoteTombs, localTs) {
    const r = parseJ(remoteStr, {}), l = parseJ(localStr, {});
    const lt = localTombs || {}, rt = remoteTombs || {};
    const isFilled = v => v !== undefined && v !== null && v !== "" && v !== false;
    const out = {};
    new Set(Object.keys(r).concat(Object.keys(l))).forEach(k => {
      const hasL = isFilled(l[k]), hasR = isFilled(r[k]);
      if (!hasL && hasR && (lt[k] || rt[k])) return;
      if (hasL && !hasR && rt[k] && Number(rt[k]) > Number(localTs || 0)) return;
      if (hasL) out[k] = l[k];
      else if (r[k] !== undefined) out[k] = r[k];
      else if (l[k] !== undefined) out[k] = l[k];
    });
    return JSON.stringify(out);
  }
  function mergeProgress(local, remote, sync, rts, localTombsRaw, remoteTombsRaw) {
    const out = {};
    const localTs = Number((sync && sync.localTs) || 0);
    const preferLocalScalar = Boolean(sync && sync.dirty && localTs >= Number(rts || 0));
    const lT = normalizeTombs(localTombsRaw);
    const rT = normalizeTombs(remoteTombsRaw);
    // 1. SRS Maps (Vocab, Listening, Reading, Speaking, HSK Vocab, IELTS Foundation)
    [P_SRS, P_LSRS, P_RSRS, P_SSRS, P_HVSRS, P_FND_SRS].forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) out[k] = mergeSrsMap(local[k], remote[k]);
    });
    // 2. Study Days Maps (Vocab, Listening, Reading, Speaking, HSK Vocab)
    [P_DAYS, P_LDAYS, P_RDAYS, P_SDAYS, P_HVDAYS].forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) out[k] = mergeDaysMap(local[k], remote[k]);
    });
    // 3. Done Maps / Lists (respecting tombstones)
    DONE_MAP_KEYS.forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) out[k] = mergeDoneListOrMap(local[k], remote[k], false, lT.done[k], rT.done[k], localTs);
    });
    if (local[P_HWDONE] !== undefined || remote[P_HWDONE] !== undefined) {
      out[P_HWDONE] = mergeHskWritingDone(local[P_HWDONE], remote[P_HWDONE], lT.done[P_HWDONE], rT.done[P_HWDONE], localTs);
    }
    [P_IELTS_RM, P_HSK_RM].forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) {
        const v = mergeRoadmapState(local[k], remote[k], preferLocalScalar);
        if (v !== undefined) out[k] = v;
      }
    });
    if (local[P_HMOCK] !== undefined || remote[P_HMOCK] !== undefined) {
      out[P_HMOCK] = mergeHskMock(local[P_HMOCK], remote[P_HMOCK]);
    }
    if (local[P_HSHOOT] !== undefined || remote[P_HSHOOT] !== undefined) {
      out[P_HSHOOT] = mergeHskShooterBest(local[P_HSHOOT], remote[P_HSHOOT]);
    }
    DONE_ARR_KEYS.forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) out[k] = mergeDoneListOrMap(local[k], remote[k], true, lT.done[k], rT.done[k], localTs);
    });
    if (local[P_WESSAYS] !== undefined || remote[P_WESSAYS] !== undefined) {
      out[P_WESSAYS] = mergeKeyMap(local[P_WESSAYS], remote[P_WESSAYS], lT.maps[P_WESSAYS], rT.maps[P_WESSAYS], localTs);
    }
    if (local[P_HWDRAFTS] !== undefined || remote[P_HWDRAFTS] !== undefined) {
      out[P_HWDRAFTS] = mergeKeyMap(local[P_HWDRAFTS], remote[P_HWDRAFTS], lT.maps[P_HWDRAFTS], rT.maps[P_HWDRAFTS], localTs);
    }
    [P_SNOTES, P_LNOTES, P_RNOTES, P_WNOTES].forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) out[k] = mergeNotesMap(local[k], remote[k], lT.maps[k], rT.maps[k], localTs);
    });
    [P_SPREFS, P_RPZANS, P_LPZANS, P_PZFLAGS, P_LUNIT, P_RUNIT].forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) out[k] = mergeKeyMap(local[k], remote[k], lT.maps[k], rT.maps[k], localTs);
    });
    SUBMISSION_KEYS.forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) out[k] = mergeSubmissionHistory(local[k], remote[k], 80, lT.subs[k], rT.subs[k]);
    });
    // 4. TED Subtitle Position Map (keep max subtitle index per video)
    if (local[P_TPOS] !== undefined || remote[P_TPOS] !== undefined) {
      const a = parseJ(local[P_TPOS], {}), b = parseJ(remote[P_TPOS], {});
      const m = Object.assign({}, a);
      Object.keys(b).forEach(id => { m[id] = Math.max(Number(a[id]) || 0, Number(b[id]) || 0); });
      out[P_TPOS] = JSON.stringify(m);
    }
    // 5. Last Lesson & Settings keys
    [P_GLAST, P_SET, P_LLAST, P_LSET, P_RLAST, P_RSET, P_WLAST, P_SLAST, P_SSET, P_TLAST, P_TSUBVI, P_TSHADLANG, P_HVSET, P_HLLAST, P_HGLAST, P_HLISLAST, P_HRLAST, P_HSHOOTPREF].forEach(k => {
      const v = preferLocalScalar
        ? (local[k] !== undefined ? local[k] : remote[k])
        : (remote[k] !== undefined ? remote[k] : local[k]);
      if (v !== undefined) out[k] = v;
    });
    // 6. Active Vocab Sessions, Per-Word Step Drafts & Listening Lesson Positions
    if (local[P_VSES] !== undefined || remote[P_VSES] !== undefined) {
      const mergedVses = mergeVocabActiveSession(local[P_VSES], remote[P_VSES], out[P_SRS], preferLocalScalar);
      if (mergedVses !== undefined) out[P_VSES] = mergedVses;
    }
    [[P_LSES, P_LSRS], [P_RSES, P_RSRS], [P_SSES, P_SSRS], [P_HVSES, P_HVSRS]].forEach(([k, srsKey]) => {
      if (local[k] !== undefined || remote[k] !== undefined) {
        const mergedEses = mergeEngineSessionStore(local[k], remote[k], out[srsKey], preferLocalScalar);
        if (mergedEses !== undefined) out[k] = mergedEses;
      }
    });
    if (local[P_LPOS] !== undefined || remote[P_LPOS] !== undefined) {
      out[P_LPOS] = mergeLessonPosMap(local[P_LPOS], remote[P_LPOS]);
    }
    // 7. Writing Practice Zone per-task text drafts (lp_pz_draft_*), capped at 120 keys & respecting tombstones
    const draftKeys = Array.from(new Set(
      Object.keys(local || {}).concat(Object.keys(remote || {})).filter(isPzDraftKey)
    ));
    let keptDrafts = 0;
    draftKeys.forEach(k => {
      if (keptDrafts >= 120) return;
      const lv = local && local[k] ? String(local[k]) : "";
      const rv = remote && remote[k] ? String(remote[k]) : "";
      if (!lv && rv && (lT.drafts[k] || rT.drafts[k])) return;
      if (lv && !rv && rT.drafts[k] && Number(rT.drafts[k]) > localTs) return;
      const chosen = preferLocalScalar ? (lv || rv) : (rv || lv);
      if (chosen) { out[k] = chosen; keptDrafts++; }
    });
    return out;
  }

  function localDateStr(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function countDoneEntries(raw) {
    const parsed = parseJ(raw, null);
    if (Array.isArray(parsed)) return parsed.filter(Boolean).length;
    if (parsed && typeof parsed === "object") return Object.values(parsed).filter(Boolean).length;
    return 0;
  }
  function countWritingDoneEntries(raw) {
    const parsed = parseJ(raw, null);
    const ids = Array.isArray(parsed)
      ? parsed.filter(Boolean)
      : (parsed && typeof parsed === "object" ? Object.keys(parsed).filter(k => parsed[k]) : []);
    return ids.filter(id => /^writing_u[1-5]_\d+$/.test(String(id)) || /^writing_pz_(?:[1-3]|part_|pair_)/.test(String(id))).length;
  }

  function countHskWritingEntries(raw) {
    const hw = parseJ(raw, {});
    const caps = { chars: 60, radicals: 214, reorder: 40, pinyinWrite: 20, makeSentence: 20, essays: 20 };
    return Object.keys(caps).reduce((sum, bk) => {
      const b = hw && hw[bk];
      const cnt = b && typeof b === "object" ? Object.values(b).filter(Boolean).length : 0;
      return sum + Math.min(caps[bk], cnt);
    }, 0);
  }

  function countSrsEntries(raw, maxVocabIdx) {
    const srs = parseJ(raw, {});
    const now = Date.now();
    let learned = 0, ignored = 0, mastered = 0, due = 0;
    Object.keys(srs).forEach(k => {
      if (maxVocabIdx && (!/^w_(0|[1-9]\d*)$/.test(k) || Number(k.slice(2)) >= maxVocabIdx)) return;
      const st = srs[k];
      if (!st || typeof st !== "object" || Array.isArray(st)) return;
      if (st.ignored) { ignored++; return; }
      if (st.reps > 0 || st.due || st.lastReview || /^w_\d+$/.test(k)) {
        learned++;
        if (now >= Number(st.due || 0)) due++;
        else if (Number(st.interval || 0) >= 7) mastered++;
      }
    });
    return { learned, ignored, mastered, due, totalDone: learned + ignored };
  }

  function progressStats(map) {
    const vocabSrsStat = countSrsEntries(map[P_SRS], TOTAL_VOCAB);
    const vocabLearned = vocabSrsStat.learned;
    const vocabIgnored = vocabSrsStat.ignored;
    const vocabMastered = vocabSrsStat.mastered;
    const vocabDue = vocabSrsStat.due;

    const grammarDone = countDoneEntries(map[P_GDONE]);
    const listeningDone = countDoneEntries(map[P_LDONE]);
    const readingDone = countDoneEntries(map[P_RDONE]);
    const writingDone = countWritingDoneEntries(map[P_WDONE]);
    const speakingDone = countDoneEntries(map[P_SDONE]);
    const tedDone = countDoneEntries(map[P_TDONE]);

    const lisSrsStat = countSrsEntries(map[P_LSRS]);
    const readSrsStat = countSrsEntries(map[P_RSRS]);
    const speakSrsStat = countSrsEntries(map[P_SSRS]);
    const listeningWords = lisSrsStat.totalDone;
    const readingWords = readSrsStat.totalDone;
    const speakingWords = speakSrsStat.totalDone;

    // HSK 1-6 (Từ vựng SRS + 6 phân hệ bài giảng/kỹ năng)
    const hskSrsStat = countSrsEntries(map[P_HVSRS]);
    const hskWords = hskSrsStat.totalDone;
    const hskDue = hskSrsStat.due;
    const hskLessons = countDoneEntries(map[P_HLDONE]);
    const hskGrammar = countDoneEntries(map[P_HGDONE]);
    const hskWriting = countHskWritingEntries(map[P_HWDONE]);
    const hskListening = countDoneEntries(map[P_HLISDONE]);
    const hskReading = countDoneEntries(map[P_HRDONE]);
    const hskSpeaking = countDoneEntries(map[P_HSDONE]);
    const hskMockBest = (parseJ(map[P_HMOCK], {}) || {}).bestById;
    const hskMockPassed = Math.min(12, hskMockBest && typeof hskMockBest === "object" ? Object.values(hskMockBest).filter(r => r && r.passed === true).length : 0);
    const hskMwDone = countDoneEntries(map[P_HMWDONE]);
    const hskDoneItems = hskLessons + hskGrammar + hskWriting + hskListening + hskReading + hskSpeaking + hskMockPassed;
    const hskPct = Math.min(100, Math.round(((hskWords + hskDoneItems * 10) / (TOTAL_HSK_VOCAB + TOTAL_HSK_ITEMS * 10)) * 100));

    const totalWordsAll = vocabLearned + vocabIgnored + listeningWords + readingWords + speakingWords + hskWords;
    const totalLessonsAll = grammarDone + listeningDone + readingDone + writingDone + speakingDone + tedDone + hskDoneItems;
    const totalDueAll = vocabDue + lisSrsStat.due + readSrsStat.due + speakSrsStat.due + hskDue;

    const vocabPct = Math.min(100, Math.round(((vocabLearned + vocabIgnored) / TOTAL_VOCAB) * 100));
    const grammarPct = Math.min(100, Math.round((grammarDone / TOTAL_GRAMMAR) * 100));
    const overallPct = Math.min(100, Math.round(
      ((totalWordsAll + totalLessonsAll) / (TOTAL_VOCAB + TOTAL_LISTENING_VOCAB + TOTAL_READING_VOCAB + TOTAL_SPEAKING_VOCAB + TOTAL_HSK_VOCAB + TOTAL_GRAMMAR + TOTAL_LISTENING_LESSONS + TOTAL_READING_LESSONS + TOTAL_WRITING_LESSONS + TOTAL_SPEAKING_LESSONS + TOTAL_TED_LESSONS + TOTAL_HSK_ITEMS)) * 100
    ));

    // Merge study days across IELTS Vocab, Listening, Reading, Speaking & HSK Vocab for accurate streak
    const daysV = parseJ(map[P_DAYS], {});
    const daysL = parseJ(map[P_LDAYS], {});
    const daysR = parseJ(map[P_RDAYS], {});
    const daysS = parseJ(map[P_SDAYS], {});
    const daysH = parseJ(map[P_HVDAYS], {});
    const days = {};
    new Set(Object.keys(daysV).concat(Object.keys(daysL), Object.keys(daysR), Object.keys(daysS), Object.keys(daysH))).forEach(d => {
      days[d] = Array.from(new Set([].concat(
        Array.isArray(daysV[d]) ? daysV[d] : [],
        Array.isArray(daysL[d]) ? daysL[d] : [],
        Array.isArray(daysR[d]) ? daysR[d] : [],
        Array.isArray(daysS[d]) ? daysS[d] : [],
        Array.isArray(daysH[d]) ? daysH[d] : []
      )));
    });

    let streakDays = 0;
    const cur = new Date();
    if (!(Array.isArray(days[localDateStr(cur)]) && days[localDateStr(cur)].length > 0)) {
      cur.setDate(cur.getDate() - 1);
    }
    while (Array.isArray(days[localDateStr(cur)]) && days[localDateStr(cur)].length > 0) {
      streakDays++;
      cur.setDate(cur.getDate() - 1);
    }
    const totalStudyDays = Object.keys(days).filter(d => Array.isArray(days[d]) && days[d].length > 0).length;

    const recent7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = localDateStr(d);
      const cnt = Array.isArray(days[ds]) ? days[ds].length : 0;
      recent7.push({ date: ds, label: d.getDate() + "/" + (d.getMonth() + 1), count: cnt });
    }

    return {
      vocabLearned,
      vocabIgnored,
      vocabMastered,
      vocabDue,
      vocabPct,
      grammarDone,
      grammarPct,
      listeningDone,
      listeningWords,
      readingDone,
      readingWords,
      writingDone,
      speakingDone,
      speakingWords,
      tedDone,
      hskWords,
      hskDue,
      hskDoneItems,
      hskMwDone,
      hskPct,
      totalWordsAll,
      totalLessonsAll,
      totalDueAll,
      overallPct,
      streakDays,
      totalStudyDays,
      recent7
    };
  }
  function buildProgressStatsPatch(st) {
    return {
      vocabLearned: st.vocabLearned,
      vocabIgnored: st.vocabIgnored,
      vocabMastered: st.vocabMastered,
      vocabDue: st.vocabDue,
      vocabPct: st.vocabPct,
      grammarDone: st.grammarDone,
      grammarPct: st.grammarPct,
      listeningDone: st.listeningDone,
      listeningWords: st.listeningWords,
      readingDone: st.readingDone,
      readingWords: st.readingWords,
      writingDone: st.writingDone,
      speakingDone: st.speakingDone,
      speakingWords: st.speakingWords,
      tedDone: st.tedDone,
      hskWords: st.hskWords,
      hskDoneItems: st.hskDoneItems,
      hskPct: st.hskPct,
      totalWordsAll: st.totalWordsAll,
      totalLessonsAll: st.totalLessonsAll,
      overallPct: st.overallPct,
      streakDays: st.streakDays,
      totalStudyDays: st.totalStudyDays,
      lastActive: new Date().toISOString()
    };
  }
  function hasNonEmptyData(raw) {
    if (!raw) return false;
    const parsed = parseJ(raw, null);
    if (Array.isArray(parsed)) return parsed.length > 0;
    if (parsed && typeof parsed === "object") return Object.keys(parsed).some(k => Boolean(parsed[k]));
    return String(raw).trim().length > 0;
  }
  function hasRoadmapData(raw) {
    const rm = parseJ(raw, null);
    if (!rm || typeof rm !== "object" || Array.isArray(rm)) return false;
    if (rm.updatedAt) return true;
    if (rm.skipped && typeof rm.skipped === "object" && Object.keys(rm.skipped).some(k => rm.skipped[k])) return true;
    if (rm.startLevel && rm.startLevel !== "foundation") return true;
    if (rm.pace && rm.pace !== "standard") return true;
    return false;
  }
  function hasHskMockData(raw) {
    const m = parseJ(raw, null);
    if (!m || typeof m !== "object" || Array.isArray(m)) return false;
    if (m.bestById && typeof m.bestById === "object" && Object.keys(m.bestById).length > 0) return true;
    if (Array.isArray(m.history) && m.history.length > 0) return true;
    return false;
  }
  function hasProgress(map) {
    if (!map || typeof map !== "object") return false;
    const s = progressStats(map);
    if (s.totalWordsAll > 0 || s.totalLessonsAll > 0 || s.hskWords > 0 || s.hskDoneItems > 0 || s.hskMwDone > 0) return true;
    if (map[P_VSES] || map[P_LSES] || map[P_RSES] || map[P_SSES] || map[P_HVSES] || map[P_LPOS]) return true;
    if ([P_WDONE, P_WESSAYS, P_LSUBS, P_RSUBS, P_WSUBS, P_SSUBS, P_LNOTES, P_RNOTES, P_WNOTES, P_SNOTES, P_HWDRAFTS, P_HSHOOT, P_RPZANS, P_LPZANS, P_HMWDONE].some(k => hasNonEmptyData(map[k]))) return true;
    if (hasHskMockData(map[P_HMOCK]) || hasRoadmapData(map[P_IELTS_RM]) || hasRoadmapData(map[P_HSK_RM])) return true;
    return Object.keys(map).some(k => isPzDraftKey(k) && Boolean(map[k]));
  }

  const getSync = u => loadObj("s4_auth_sync_" + u, null);
  const setSync = (u, patch) => rawSet("s4_auth_sync_" + u, JSON.stringify(Object.assign({ base: 0, dirty: false, localTs: 0, resetAt: 0, vocabResetAt: 0, pendingOverwrite: null }, getSync(u) || {}, patch)));

  let changeCounter = 0, pushTimer = null, pendingOverwriteMem = null;
  function allowOverwriteOnce(scope) {
    const normScope = scope === "vocab" ? "vocab" : "all";
    const now = Date.now();
    if (!session || !session.username) return;
    const ow = { scope: normScope, ts: now, expiresAt: now + 86400000, user: session.username };
    pendingOverwriteMem = ow;
    setSync(session.username, { dirty: true, localTs: now, pendingOverwrite: ow });
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => { pushProgress().catch(() => {}); }, 250);
  }
  function onProgressChanged() {
    if (!session) return;
    changeCounter++;
    const now = Date.now();
    setSync(session.username, { dirty: true, localTs: now });
    const hasOw = Boolean(pendingOverwriteMem && pendingOverwriteMem.expiresAt > now && (!pendingOverwriteMem.user || pendingOverwriteMem.user === session.username));
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => { pushProgress().catch(() => {}); }, hasOw ? 250 : 3500);
  }
  Storage.prototype.setItem = function (k, v) {
    const isTracked = !hookSuspended && this === localStorage && (PROGRESS_KEYS.indexOf(k) >= 0 || isPzDraftKey(k));
    const prevVal = isTracked ? localStorage.getItem(k) : null;
    _setItem.call(this, k, v);
    if (isTracked) {
      if (session && session.username) recordLocalDeletionDelta(session.username, k, prevVal, String(v));
      onProgressChanged();
    }
  };
  Storage.prototype.removeItem = function (k) {
    const isTracked = !hookSuspended && this === localStorage && (PROGRESS_KEYS.indexOf(k) >= 0 || isPzDraftKey(k));
    const prevVal = isTracked ? localStorage.getItem(k) : null;
    _removeItem.call(this, k);
    if (isTracked) {
      if (session && session.username) recordLocalDeletionDelta(session.username, k, prevVal, null);
      onProgressChanged();
    }
  };

  async function pushProgress(opts) {
    if (!session) return false;
    const uname = session.username;
    const mark = changeCounter;
    const ts = Date.now();
    let data = readProgress();
    let mergedTombs = getTombstones(uname);
    const rawSync = getSync(uname);
    const sync = rawSync || {};
    const memOw = (pendingOverwriteMem && pendingOverwriteMem.expiresAt > ts && (!pendingOverwriteMem.user || pendingOverwriteMem.user === uname))
      ? pendingOverwriteMem
      : null;
    const ow = (sync.pendingOverwrite && sync.pendingOverwrite.expiresAt > ts)
      ? sync.pendingOverwrite
      : memOw;
    let nextResetAt = Number(sync.resetAt || 0);
    let nextVocabResetAt = Number(sync.vocabResetAt || 0);
    let remoteReadOk = false;
    let fromLegacy = false;

    try {
      const remote = await readRemoteProgress(uname, session.ph);
      remoteReadOk = true;
      fromLegacy = Boolean(remote && remote._fromLegacy);
      const rdata = (remote && remote.data) || {};
      const rtombs = (remote && remote.tombstones) || emptyTombs();
      const rResetAt = Number((remote && remote.resetAt) || 0);
      const rVocabResetAt = Number((remote && remote.vocabResetAt) || 0);

      if (ow && ow.scope === "all") {
        nextResetAt = Math.max(ts, rResetAt + 1);
        nextVocabResetAt = Math.max(ts, rVocabResetAt + 1);
        mergedTombs = emptyTombs();
      } else if (ow && ow.scope === "vocab") {
        mergedTombs = mergeTombstones(mergedTombs, rtombs);
        if (hasProgress(rdata)) {
          const rNonVocab = Object.assign({}, rdata);
          VOCAB_SCOPE_KEYS.forEach(k => delete rNonVocab[k]);
          const merged = mergeProgress(data, rNonVocab, { dirty: true, localTs: ts }, (remote && remote.updatedAt) || 0, mergedTombs, rtombs);
          VOCAB_SCOPE_KEYS.forEach(k => {
            if (data[k] !== undefined) merged[k] = data[k];
            else delete merged[k];
          });
          if (!sameProgress(merged, data)) { data = merged; writeProgress(merged); }
        }
        nextResetAt = Math.max(nextResetAt, rResetAt);
        nextVocabResetAt = Math.max(ts, rVocabResetAt + 1);
      } else if (rawSync && remote && rResetAt > nextResetAt) {
        data = Object.assign({}, rdata);
        writeProgress(data);
        mergedTombs = normalizeTombs(rtombs);
        nextResetAt = rResetAt;
        nextVocabResetAt = Math.max(nextVocabResetAt, rVocabResetAt);
      } else if (rawSync && remote && rVocabResetAt > nextVocabResetAt) {
        mergedTombs = mergeTombstones(mergedTombs, rtombs);
        const lWithoutVocab = Object.assign({}, data);
        VOCAB_SCOPE_KEYS.forEach(k => delete lWithoutVocab[k]);
        const merged = mergeProgress(lWithoutVocab, rdata, { dirty: true, localTs: ts }, (remote && remote.updatedAt) || 0, mergedTombs, rtombs);
        VOCAB_SCOPE_KEYS.forEach(k => {
          if (rdata[k] !== undefined) merged[k] = rdata[k];
          else delete merged[k];
        });
        if (!sameProgress(merged, data)) { data = merged; writeProgress(merged); }
        nextResetAt = Math.max(nextResetAt, rResetAt);
        nextVocabResetAt = rVocabResetAt;
      } else {
        const localTombsBefore = mergedTombs;
        mergedTombs = mergeTombstones(localTombsBefore, rtombs);
        if (hasProgress(rdata)) {
          const merged = mergeProgress(data, rdata, { dirty: true, localTs: ts }, (remote && remote.updatedAt) || 0, localTombsBefore, rtombs);
          if (!sameProgress(merged, data)) { data = merged; writeProgress(merged); }
        }
        nextResetAt = Math.max(nextResetAt, rResetAt);
        nextVocabResetAt = Math.max(nextVocabResetAt, rVocabResetAt);
      }
    } catch (e) { /* Không đọc được Cloud: vẫn đẩy bản local hiện có */ }

    if (!remoteReadOk && ow) {
      if (ow.scope === "all") {
        nextResetAt = Math.max(ts, nextResetAt + 1);
        nextVocabResetAt = Math.max(ts, nextVocabResetAt + 1);
      } else if (ow.scope === "vocab") {
        nextVocabResetAt = Math.max(ts, nextVocabResetAt + 1);
      }
    }

    setTombstones(uname, mergedTombs);
    const authProof = (session && session.ph) || "";
    const body = { data: data, tombstones: mergedTombs, updatedAt: ts };
    if (nextResetAt > 0) body.resetAt = nextResetAt;
    if (nextVocabResetAt > 0) body.vocabResetAt = nextVocabResetAt;
    await writeRemoteProgress(uname, body, authProof, {
      keepalive: !!(opts && opts.keepalive),
      scrubLegacy: fromLegacy
    });
    pendingOverwriteMem = null;
    setSync(uname, {
      base: ts,
      dirty: changeCounter !== mark,
      resetAt: nextResetAt,
      vocabResetAt: nextVocabResetAt,
      pendingOverwrite: null
    });
    const st = progressStats(data);
    dbSecureWrite(uname, `study4_users/${uname}`, buildProgressStatsPatch(st), authProof).catch(() => {});
    return true;
  }

  function reloadOnce(tag) {
    const k = "s4_reload_" + tag;
    const last = Number(sessionStorage.getItem(k) || 0);
    if (Date.now() - last < 15000) return false;
    sessionStorage.setItem(k, String(Date.now()));
    location.reload();
    return true;
  }
  function refreshAfterDataChange(tag) {
    if (isHomePage() && typeof window.updateDashboardStats === "function") { window.updateDashboardStats(); return; }
    reloadOnce(tag);
  }

  async function syncProgress(forceMerge) {
    if (!session) return;
    const uname = session.username;
    const sync = getSync(uname);
    const now = Date.now();
    const hasPendingOw = Boolean(
      (sync && sync.pendingOverwrite && sync.pendingOverwrite.expiresAt > now) ||
      (pendingOverwriteMem && pendingOverwriteMem.expiresAt > now && (!pendingOverwriteMem.user || pendingOverwriteMem.user === uname))
    );
    if (hasPendingOw) {
      await pushProgress();
      return;
    }
    const remote = await readRemoteProgress(uname, session.ph);
    const local = readProgress();
    const localTombs = getTombstones(uname);
    const rdata = (remote && remote.data) || {};
    const rtombs = (remote && remote.tombstones) || emptyTombs();
    const rts = (remote && remote.updatedAt) || 0;
    const rResetAt = Number((remote && remote.resetAt) || 0);
    const rVocabResetAt = Number((remote && remote.vocabResetAt) || 0);
    const lResetAt = Number((sync && sync.resetAt) || 0);
    const lVocabResetAt = Number((sync && sync.vocabResetAt) || 0);
    let target = null, needPush = false;
    let nextTombs = mergeTombstones(localTombs, rtombs);

    if (!remote) {
      if (hasProgress(local)) needPush = true;
    } else if (sync && rResetAt > lResetAt) {
      target = Object.assign({}, rdata);
      nextTombs = normalizeTombs(rtombs);
      needPush = false;
    } else if (sync && rVocabResetAt > lVocabResetAt) {
      if (!sync.dirty) {
        target = Object.assign({}, rdata);
      } else {
        const lWithoutVocab = Object.assign({}, local);
        VOCAB_SCOPE_KEYS.forEach(k => delete lWithoutVocab[k]);
        target = mergeProgress(lWithoutVocab, rdata, sync, rts, localTombs, rtombs);
        VOCAB_SCOPE_KEYS.forEach(k => {
          if (rdata[k] !== undefined) target[k] = rdata[k];
          else delete target[k];
        });
        needPush = !sameProgress(target, rdata);
      }
    } else if (forceMerge || !sync) {
      target = mergeProgress(local, rdata, sync, rts, localTombs, rtombs);
      needPush = !sameProgress(target, rdata) || Boolean(remote._fromLegacy);
    } else if (!sync.dirty) {
      if (rts > (sync.base || 0)) target = rdata;
    } else if (rts > (sync.base || 0)) {
      target = mergeProgress(local, rdata, sync, rts, localTombs, rtombs);
      needPush = true;
    } else {
      needPush = true;
    }

    setTombstones(uname, nextTombs);
    let changedLocal = false;
    if (target && !sameProgress(target, local)) { writeProgress(target); changedLocal = true; }
    if (needPush) {
      setSync(uname, {
        resetAt: Math.max(lResetAt, rResetAt),
        vocabResetAt: Math.max(lVocabResetAt, rVocabResetAt)
      });
      await pushProgress();
    } else {
      setSync(uname, {
        base: remote ? rts : 0,
        dirty: false,
        resetAt: Math.max(lResetAt, rResetAt),
        vocabResetAt: Math.max(lVocabResetAt, rVocabResetAt)
      });
      const st = progressStats(readProgress());
      dbSecureWrite(uname, `study4_users/${uname}`, buildProgressStatsPatch(st), (session && session.ph) || "").catch(() => {});
    }
    if (changedLocal) refreshAfterDataChange("progress");
  }

  /* ---------- Cấu hình dùng chung ---------- */
  async function fetchConfig() {
    const remote = await db("study4_config");
    if (!remote || typeof remote !== "object") return false;
    const next = Object.assign({}, config, { authEnforced: false });
    if (typeof remote.contactNote === "string") {
      if (remote.contactNote.includes("kích hoạt") || remote.contactNote.includes("Kích Hoạt")) {
        next.contactNote = DEFAULT_CONFIG.contactNote;
      } else {
        next.contactNote = remote.contactNote.slice(0, 300);
      }
    }
    // Chỉ chấp nhận cấu hình ngân hàng từ Cloud khi có cờ xác thực Admin hợp lệ
    if (remote.adminVerified === true && remote.updatedBy === "admin") {
      if (typeof remote.bankCode === "string" && /^[A-Z0-9]{2,12}$/i.test(remote.bankCode.trim())) next.bankCode = remote.bankCode.trim().toUpperCase();
      if (typeof remote.bankAccount === "string" && /^[0-9]{6,22}$/.test(remote.bankAccount.trim())) next.bankAccount = remote.bankAccount.trim();
      if (typeof remote.bankOwner === "string" && remote.bankOwner.trim().length >= 3 && remote.bankOwner.trim().length <= 50) next.bankOwner = remote.bankOwner.trim();
      if (typeof remote.transferMemo === "string" && remote.transferMemo.trim().length <= 60) next.transferMemo = remote.transferMemo.trim();
    }
    const changed = canon(next) !== canon(config);
    config = next;
    saveConfig();
    return changed;
  }
  async function pushConfig() {
    await dbSecureWrite("admin", "study4_config", {
      contactNote: config.contactNote,
      bankCode: config.bankCode,
      bankAccount: config.bankAccount,
      bankOwner: config.bankOwner,
      transferMemo: config.transferMemo,
      adminVerified: true,
      updatedBy: "admin",
      updatedAt: new Date().toISOString()
    }, (session && session.ph) || "");
  }

  /* ---------- Kiểm tra phiên đăng nhập với cloud ---------- */
  function clearLocalProgressKeys() {
    PROGRESS_KEYS.forEach(k => rawRemove(k));
    const draftKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (isPzDraftKey(k)) draftKeys.push(k);
    }
    draftKeys.forEach(k => rawRemove(k));
  }
  async function forceLogout(msg) {
    const cur = session;
    pendingOverwriteMem = null;
    if (cur) {
      try { rawSet("s4_auth_profile_" + cur.username, JSON.stringify(readProgress())); } catch (e) {}
      hookSuspended = true;
      clearLocalProgressKeys();
      hookSuspended = false;
    }
    HTML_CACHE_KEYS.forEach(k => rawRemove(k));
    session = null;
    saveSession();
    if (msg) sessionStorage.setItem("s4_logout_msg", msg);
    location.reload();
  }
  async function refreshSession() {
    if (!session) return;
    let rec;
    try { rec = await db(`study4_users/${session.username}`); } catch (e) { return; }
    if (!rec || rec.deleted || (!rec.username && !rec.passwordHash && !rec.role)) return forceLogout("Tài khoản không còn tồn tại.");
    let pwOk = true;
    try {
      pwOk = await verifyAuthSecret(session.username, session.ph, rec);
    } catch (e) {
      return;
    }
    if (!pwOk) return forceLogout("Mật khẩu đã được thay đổi, vui lòng đăng nhập lại.");
    if (rec.status === "blocked") return forceLogout("Tài khoản của bạn đã bị quản trị viên khóa.");
    const before = canon(effective(cache[session.username] || {}));
    cacheUserRecord(rec, session.ph);
    const eff = effective(cache[session.username]);
    if (rec.role === "vip" && eff.role === "basic") dbSecureWrite(session.username, `study4_users/${session.username}`, { role: "basic" }, session.ph).catch(() => {});
    if (before !== canon(eff)) {
      renderTopBar();
      if (!isHomePage()) reloadOnce("role");
    }
  }

  /* ---------- Đăng nhập / Đăng ký / Mã kích hoạt ---------- */
  const USER_RE = /^[a-z0-9_]{3,20}$/;

  async function startSession(rec, ph) {
    cacheUserRecord(rec, ph);
    session = { username: rec.username, ph: ph };
    saveSession();
    const prof = loadObj("s4_auth_profile_" + rec.username, null);
    if (prof) {
      writeProgress(mergeProgress(readProgress(), prof));
      rawRemove("s4_auth_profile_" + rec.username);
    }
    try { await syncProgress(true); } catch (e) { setSync(rec.username, { dirty: true, localTs: Date.now() }); }
  }

  async function doLogin(uname, pass) {
    const phV2 = await hashPwV2(uname, pass);
    const phV1 = await hashPwLegacy(uname, pass);
    let rec = null;
    try {
      rec = await db(`study4_users/${uname}`);
    } catch (e) {
      const c = cache[uname];
      if (c && (c.passwordHash === phV2 || c.passwordHash === phV1) && c.status !== "blocked") {
        await startSession(c, c.passwordHash);
        return { ok: true };
      }
      return { ok: false, msg: "Không kết nối được máy chủ. Hãy bật mạng để đăng nhập (lần đầu trên thiết bị này cần có mạng)." };
    }
    if (uname === "admin" && (!rec || (!rec.passwordHash && !rec.username && !rec.role))) return { ok: false, needSetup: true };
    if (!rec || rec.deleted) return { ok: false, msg: "Tên đăng nhập hoặc mật khẩu không đúng." };

    let matchedPh = "";
    try {
      if (await verifyAuthSecret(uname, phV2, rec)) {
        matchedPh = phV2;
      } else if (phV1 !== phV2 && await verifyAuthSecret(uname, phV1, rec)) {
        matchedPh = phV1;
        // Tự động nâng cấp mật khẩu cũ (SHA-256 v1) sang PBKDF2-SHA256 (v2) không gián đoạn
        const prevRemote = await readRemoteProgress(uname, phV1).catch(() => null);
        const upgraded = await syncAuthSecret(uname, phV2, phV1);
        if (upgraded) {
          matchedPh = phV2;
          if (prevRemote && prevRemote.data) {
            await writeRemoteProgress(uname, {
              data: prevRemote.data,
              tombstones: prevRemote.tombstones || emptyTombs(),
              updatedAt: prevRemote.updatedAt || Date.now()
            }, phV2, { scrubLegacy: Boolean(prevRemote._fromLegacy) }).catch(() => {});
          }
        }
      }
    } catch (e) {
      const c = cache[uname];
      if (c && (c.passwordHash === phV2 || c.passwordHash === phV1) && c.status !== "blocked") {
        await startSession(c, c.passwordHash);
        return { ok: true };
      }
      return { ok: false, msg: "Không kết nối được máy chủ xác thực. Vui lòng thử lại." };
    }
    if (!matchedPh) return { ok: false, msg: "Tên đăng nhập hoặc mật khẩu không đúng." };
    if (rec.status === "blocked") return { ok: false, msg: "Tài khoản này đã bị quản trị viên khóa." };
    await startSession(rec, matchedPh);
    return { ok: true };
  }

  async function setupAdmin(pass) {
    const rec = await db("study4_users/admin");
    if (rec && (rec.passwordHash || rec.role === "admin")) return { ok: false, msg: "Tài khoản admin đã được thiết lập trước đó." };
    const ph = await hashPw("admin", pass);
    const migrated = await syncAuthSecret("admin", ph, ph);
    const full = Object.assign({}, stripSensitiveFields(rec || {}), {
      username: "admin", displayName: "Quản trị viên", avatar: "🛡️", targetBand: "8.0+", role: "admin", status: "active",
      expiresAt: "PERM", createdAt: new Date().toISOString().slice(0, 10)
    });
    if (migrated) {
      await dbSecureWrite("admin", "study4_users/admin", full, ph, { replace: true });
    } else {
      await db("study4_users/admin", "PUT", Object.assign({}, full, { passwordHash: ph, authProof: ph }));
    }
    await startSession(full, ph);
    return { ok: true };
  }

  /* ---------- Giao diện & CSS ---------- */
  function getLogoPath() { return resolveFromRoot("icon-192.png", isHomePage() ? "icon-192.png" : "../icon-192.png"); }

  function updateSafeAreaVar() {
    try {
      const ua = navigator.userAgent || "";
      const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const isPortrait = window.innerHeight >= window.innerWidth;
      const maxDim = Math.max(window.screen.height || 0, window.screen.width || 0);
      const isStandalone = window.navigator.standalone === true ||
        (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
        (isIOS && isPortrait && Math.abs(window.innerHeight - maxDim) < 28);
      if (isIOS && isStandalone && isPortrait) {
        const inset = maxDim >= 812 ? "50px" : "24px";
        document.documentElement.style.setProperty("--s4-safe-top", inset);
      } else {
        document.documentElement.style.setProperty("--s4-safe-top", "0px");
      }
    } catch (e) {}
  }
  window.addEventListener("resize", updateSafeAreaVar);
  window.addEventListener("orientationchange", () => setTimeout(updateSafeAreaVar, 80));

  function uiIcon(name, size, fallback) {
    if (window.S4UI && typeof window.S4UI.icon === "function") {
      return window.S4UI.icon(name, size || 15);
    }
    return fallback || "";
  }

  function injectStyles() {
    updateSafeAreaVar();
    if (document.getElementById("s4AuthStyles")) return;
    const st = document.createElement("style");
    st.id = "s4AuthStyles";
    st.textContent = `
      html.s4-modal-lock, body.s4-modal-lock { overflow: hidden !important; overscroll-behavior: none !important; }
      :root { --s4-top-inset: max(env(safe-area-inset-top, 0px), var(--s4-safe-top, 0px)); }
      @media (orientation: landscape) { :root { --s4-top-inset: env(safe-area-inset-top, 0px); } }
      .s4-user-bar { position: sticky; top: 0; background: rgba(255,255,255,0.95); color: #0f172a; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); padding: calc(7px + var(--s4-top-inset, 0px)) calc(12px + env(safe-area-inset-right, 0px)) 7px calc(12px + env(safe-area-inset-left, 0px)); font-size: 12.5px; display: flex; justify-content: space-between; align-items: center; gap: 6px; flex-wrap: nowrap; z-index: 950; border-bottom: 1px solid #e2e8f0; width: 100%; max-width: 100%; flex-shrink: 0; box-sizing: border-box; touch-action: manipulation; }
      html.dark .s4-user-bar, body.dark .s4-user-bar { background: rgba(30,41,59,0.95); color: #f8fafc; border-bottom-color: #334155; }
      .s4-user-left { display: flex; align-items: center; gap: 6px; flex: 1 1 0%; min-width: 0; overflow: hidden; }
      .s4-user-right { display: flex; align-items: center; gap: 6px; flex: 0 0 auto; }
      .s4-profile-trigger { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px 3px 4px; border-radius: 999px; background: #f1f5f9; border: 1px solid #cbd5e1; color: #0f172a; cursor: pointer; transition: 0.15s; min-width: 0; max-width: 100%; flex: 0 1 auto; overflow: hidden; white-space: nowrap; font-family: inherit; font-size: 12.5px; }
      html.dark .s4-profile-trigger, body.dark .s4-profile-trigger { background: #0f172a; border-color: #334155; color: #f8fafc; }
      .s4-profile-trigger:hover { border-color: #2563eb; }
      .s4-profile-name { display: block; min-width: 0; flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 700; }
      .s4-role-badge { padding: 3px 8px; border-radius: 999px; font-weight: 700; font-size: 11px; white-space: nowrap; flex-shrink: 0; }
      .s4-role-admin { background: #dc2626; color: #fff; }
      .s4-role-vip { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; }
      .s4-role-basic { background: #e2e8f0; color: #475569; }
      html.dark .s4-role-basic, body.dark .s4-role-basic { background: #334155; color: #cbd5e1; }
      .s4-role-free { background: #0d9488; color: #fff; overflow: hidden; text-overflow: ellipsis; min-width: 0; flex-shrink: 0; }
      .s4-free-compact { display: none; }
      .s4-top-btn { display: inline-flex; align-items: center; justify-content: center; gap: 5px; background: var(--lg-wash, #f1f5f9); color: var(--lg-ink, #0f172a); border: 1px solid var(--lg-hairline, #cbd5e1); padding: 6px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; cursor: pointer; transition: 0.15s; white-space: nowrap; font-family: inherit; flex-shrink: 0; }
      html.dark .s4-top-btn, body.dark .s4-top-btn { background: var(--lg-wash, #0f172a); color: var(--lg-ink, #f8fafc); border-color: var(--lg-hairline, #334155); }
      .s4-top-btn:hover { border-color: #2563eb; }
      .s4-top-btn.gold { background: linear-gradient(135deg, #f59e0b, #d97706); border: none; color: #fff; }
      .s4-top-btn.donate { background: linear-gradient(135deg, #ec4899, #e11d48); border: none; color: #fff; box-shadow: 0 2px 8px rgba(225,29,72,0.25); }
      .s4-top-btn.donate:hover { filter: brightness(1.06); }
      .s4-pass-wrap { position: relative; width: 100%; margin-bottom: 10px; }
      .s4-pass-wrap .s4-input { margin-bottom: 0 !important; padding-right: 42px !important; }
      .s4-pass-toggle { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #64748b; font-size: 15px; padding: 4px 6px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; user-select: none; }
      .s4-pass-toggle:hover { color: #2563eb; background: rgba(37,99,235,0.08); }
      .s4-badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11.5px; font-weight: 700; white-space: nowrap; }
      .s4-badge-active { background: #dcfce7; color: #15803d; }
      .s4-badge-blocked { background: #fee2e2; color: #dc2626; }
      .s4-badge-admin { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
      .s4-badge-warn { background: #fef3c7; color: #b45309; }
      .s4-menu-wrap { position: relative; flex-shrink: 0; }
      .s4-dropdown { position: absolute; right: 0; top: calc(100% + 8px); width: min(245px, calc(100vw - 20px)); background: var(--lg-surface-strong, #ffffff); backdrop-filter: var(--lg-blur, none); -webkit-backdrop-filter: var(--lg-blur, none); color: var(--lg-ink, #0f172a); border: 1px solid var(--lg-hairline, #e2e8f0); border-radius: 16px; box-shadow: var(--lg-shadow, 0 14px 36px rgba(0,0,0,0.18)); padding: 6px; display: none; flex-direction: column; gap: 2px; z-index: 999; overscroll-behavior: contain; touch-action: manipulation; }
      html.dark .s4-dropdown, body.dark .s4-dropdown { background: var(--lg-surface-strong, #1e293b); color: var(--lg-ink, #f8fafc); border-color: var(--lg-hairline, #334155); box-shadow: var(--lg-shadow, 0 14px 36px rgba(0,0,0,0.45)); }
      .s4-dropdown.open { display: flex; }
      .s4-dd-item { display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 11px; border: none; background: transparent; color: inherit; font-family: inherit; font-size: 13px; font-weight: 600; text-align: left; border-radius: 9px; cursor: pointer; }
      .s4-dd-item:hover { background: rgba(37,99,235,0.09); color: #2563eb; }
      html.dark .s4-dd-item:hover, body.dark .s4-dd-item:hover { background: rgba(59,130,246,0.16); color: #60a5fa; }
      .s4-dd-sep { height: 1px; background: #e2e8f0; margin: 4px 6px; }
      html.dark .s4-dd-sep, body.dark .s4-dd-sep { background: #334155; }
      .s4-modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.78); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: calc(12px + var(--s4-top-inset, 0px)) calc(12px + env(safe-area-inset-right, 0px)) calc(12px + env(safe-area-inset-bottom, 0px)) calc(12px + env(safe-area-inset-left, 0px)); overscroll-behavior: contain; touch-action: none; box-sizing: border-box; }
      .s4-modal { background: var(--lg-surface-strong, #ffffff); backdrop-filter: var(--lg-blur, none); -webkit-backdrop-filter: var(--lg-blur, none); color: var(--lg-ink, #0f172a); width: 100%; max-width: 520px; border-radius: 24px; padding: 20px; box-shadow: inset 0 1.5px 0 var(--lg-rim-top, transparent), 0 20px 50px rgba(0,0,0,0.32); max-height: calc(100dvh - var(--s4-top-inset, 0px) - env(safe-area-inset-bottom, 0px) - 24px); overflow-y: auto; overflow-x: hidden; border: 1px solid var(--lg-hairline, #e2e8f0); overscroll-behavior: contain; touch-action: pan-y; -webkit-overflow-scrolling: touch; box-sizing: border-box; }
      @media (max-width: 500px) {
        .s4-user-bar { padding: calc(6px + var(--s4-top-inset, 0px)) calc(8px + env(safe-area-inset-right, 0px)) 6px calc(8px + env(safe-area-inset-left, 0px)); gap: 4px; }
        .s4-hide-sm { display: none !important; }
        .s4-free-full { display: none; }
        .s4-free-compact { display: inline; }
        .s4-top-btn { padding: 5px 7px; font-size: 11px; }
        .s4-role-badge { padding: 3px 7px; font-size: 10.5px; flex-shrink: 0; }
      }
      .s4-modal.wide { max-width: 860px; }
      .s4-donate-grid { display: grid; grid-template-columns: minmax(185px, 220px) minmax(0, 1fr); gap: 14px; align-items: center; background: var(--panel, #f8fafc); border: 1px solid var(--border, #e2e8f0); border-radius: 14px; padding: 14px; box-sizing: border-box; }
      .s4-donate-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; background: var(--bg, #fff); padding: 7px 10px; border-radius: 8px; border: 1px solid var(--border, #e2e8f0); min-width: 0; }
      .s4-donate-row-memo { display: flex; justify-content: space-between; align-items: center; gap: 8px; background: #fff1f2; border: 1.5px dashed #f43f5e; padding: 7px 10px; border-radius: 8px; min-width: 0; }
      @media (max-width: 580px) {
        .s4-modal { padding: 16px 14px; border-radius: 16px; }
        .s4-donate-grid { grid-template-columns: minmax(0, 1fr); padding: 12px 10px; gap: 12px; }
      }
      html.dark .s4-modal, body.dark .s4-modal { background: var(--lg-surface-strong, #1e293b); color: var(--lg-ink, #f8fafc); border-color: var(--lg-hairline, #334155); }
      .s4-modal h3 { margin: 0 0 6px 0; font-size: 19px; }
      .s4-input { width: 100%; padding: 10px 13px; border-radius: 10px; border: 1.5px solid #cbd5e1; background: #f8fafc; color: #0f172a; font-size: 14px; margin-bottom: 10px; outline: none; box-sizing: border-box; }
      html.dark .s4-input, body.dark .s4-input { background: #0f172a; color: #f8fafc; border-color: #334155; }
      .s4-input:focus { border-color: #2563eb; }
      .s4-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #2563eb; color: #fff; font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 4px; }
      .s4-btn:disabled { opacity: .6; cursor: wait; }
      .s4-tabs { display: flex; gap: 6px; margin: 12px 0 16px 0; background: var(--lg-seg-track, #f1f5f9); padding: 4px; border-radius: 12px; }
      html.dark .s4-tabs, body.dark .s4-tabs { background: var(--lg-seg-track, #0f172a); }
      .s4-tab { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 5px; text-align: center; padding: 8px; border-radius: 9px; font-weight: 700; font-size: 13px; cursor: pointer; border: none; background: transparent; color: var(--lg-ink-muted, #64748b); }
      .s4-tab.active { background: #2563eb; color: #fff; }
      .s4-table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin-top: 10px; }
      .s4-table th, .s4-table td { border-bottom: 1px solid #e2e8f0; padding: 9px 6px; text-align: left; vertical-align: middle; }
      html.dark .s4-table th, html.dark .s4-table td, body.dark .s4-table th, body.dark .s4-table td { border-color: #334155; }
      .s4-table-wrap { overflow-x: auto; }
      .s4-lock-tag { display: inline-block; background: #fef3c7; color: #b45309; font-size: 11px; font-weight: 800; padding: 1px 6px; border-radius: 5px; margin-left: 5px; }
      .s4-key-box { background: #f0fdf4; border: 1.5px dashed #16a34a; color: #15803d; padding: 9px 12px; border-radius: 10px; font-family: monospace; font-size: 14.5px; font-weight: 800; text-align: center; margin-top: 8px; word-break: break-all; cursor: pointer; }
      html.dark .s4-key-box, body.dark .s4-key-box { background: #064e3b; color: #dcfce7; }
      .s4-mode-banner { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 15px; border-radius: 12px; margin-bottom: 14px; font-size: 13.5px; flex-wrap: wrap; }
      .s4-mini { padding: 4px 8px; border-radius: 6px; border: none; font-size: 11.5px; font-weight: 700; cursor: pointer; color: #fff; background: #475569; margin: 1.5px; }
      .s4-err { background: #fee2e2; color: #dc2626; padding: 9px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; margin-bottom: 10px; }
      .s4-info { background: #dbeafe; color: #1e40af; padding: 9px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; margin-bottom: 10px; }
      .s4-ok { background: #dcfce7; color: #15803d; padding: 9px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; margin-bottom: 10px; }
      .s4-vip-Remain { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11.5px; font-weight: 700; }
      .s4-vr-perm { background: #dcfce7; color: #15803d; }
      .s4-vr-ok { background: #dbeafe; color: #1d4ed8; }
      .s4-vr-warn { background: #fef3c7; color: #b45309; }
      .s4-vr-exp { background: #fee2e2; color: #dc2626; }
      .s4-vr-basic { background: #f1f5f9; color: #64748b; }
      html.dark .s4-vr-basic, body.dark .s4-vr-basic { background: #334155; color: #cbd5e1; }
      .s4-stat-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; }
      html.dark .s4-stat-box, body.dark .s4-stat-box { background: #0f172a; border-color: #334155; }
      .s4-prog-track { height: 7px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin-top: 5px; }
      html.dark .s4-prog-track, body.dark .s4-prog-track { background: #334155; }
      .s4-prog-bar { height: 100%; border-radius: 4px; transition: width 0.3s; }
      .s4-avt-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 6px; margin-bottom: 12px; }
      .s4-avt-opt { aspect-ratio: 1; border-radius: 10px; border: 2px solid #e2e8f0; background: #f8fafc; font-size: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
      html.dark .s4-avt-opt, body.dark .s4-avt-opt { background: #0f172a; border-color: #334155; }
      .s4-avt-opt.active { border-color: #2563eb; background: #dbeafe; }
      .s4-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
      @media (max-width: 600px) { .s4-kpi-grid { grid-template-columns: repeat(2, 1fr); } .s4-avt-grid { grid-template-columns: repeat(6, 1fr); } }
      @keyframes s4ModalIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .s4-disc-dialog { background: var(--card, #ffffff); color: var(--text, #0f172a); border: 1.5px solid rgba(16,185,129,0.4); }
      html.dark .s4-disc-dialog, body.dark .s4-disc-dialog { background: var(--card, #1e293b); color: var(--text, #f8fafc); border-color: rgba(251,191,36,0.35); }
      .s4-disc-badge { background: rgba(16,185,129,0.14); color: #047857; border: 1px solid rgba(16,185,129,0.35); }
      html.dark .s4-disc-badge, body.dark .s4-disc-badge { background: rgba(16,185,129,0.2); color: #34d399; border-color: rgba(52,211,153,0.35); }
      .s4-disc-body { color: var(--text, #0f172a); }
      html.dark .s4-disc-body, body.dark .s4-disc-body { color: var(--text, #f1f5f9); }
      .s4-disc-box-green { background: rgba(16,185,129,0.08); }
      html.dark .s4-disc-box-green, body.dark .s4-disc-box-green { background: rgba(16,185,129,0.1); }
      .s4-disc-box-amber { background: rgba(245,158,11,0.1); }
      html.dark .s4-disc-box-amber, body.dark .s4-disc-box-amber { background: rgba(251,191,36,0.08); }
      .s4-disc-box-blue { background: rgba(37,99,235,0.08); }
      html.dark .s4-disc-box-blue, body.dark .s4-disc-box-blue { background: rgba(59,130,246,0.1); }
      .s4-disc-link { color: #1d4ed8; text-decoration: underline; font-weight: 700; }
      html.dark .s4-disc-link, body.dark .s4-disc-link { color: #60a5fa; }
      .s4-disc-foot { background: rgba(15,23,42,0.04); border-top: 1px solid var(--border, #e2e8f0); }
      html.dark .s4-disc-foot, body.dark .s4-disc-foot { background: rgba(0,0,0,0.2); border-top-color: var(--border, rgba(255,255,255,0.08)); }
    `;
    st.innerHTML += "\n@keyframes s4Pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.25); } }";
    document.head.appendChild(st);
  }

  function renderTopBar() {
    injectStyles();
    if (!isHomePage()) {
      const old = document.getElementById("s4UserTopBar");
      if (old) old.remove();
      return;
    }
    let bar = document.getElementById("s4UserTopBar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "s4UserTopBar";
      bar.className = "s4-user-bar";
      document.body.insertBefore(bar, document.body.firstChild);
    }
    const logoImg = `<img src="${getLogoPath()}" alt="Logo" style="width:22px;height:22px;border-radius:5px;vertical-align:middle;">`;
    const u = getCurrentUser();

    if (!u) {
      bar.innerHTML = `
        <div class="s4-user-left">
          ${logoImg}
          <span style="font-weight:800;font-size:13px;letter-spacing:-0.01em;">LinguaPath</span>
        </div>
        <div class="s4-user-right">
          <button class="s4-top-btn donate" onclick="window.S4Auth.openDonateModal()">${uiIcon("heart", 14, "💖")} Ủng hộ</button>
          <button class="s4-top-btn" onclick="window.S4Auth.openLoginModal(false)">${uiIcon("user", 14, "👤")} Đăng nhập</button>
          <button class="s4-top-btn" onclick="window.S4Auth.openInstallModal()">${uiIcon("download", 14, "📲")} Cài App</button>
        </div>`;
      return;
    }

    const badge = u.role === "admin"
      ? `<span class="s4-role-badge s4-role-admin" style="display:inline-flex;align-items:center;gap:4px;">${uiIcon("shield", 12, "🛡️")} Admin</span>`
      : `<span class="s4-role-badge s4-role-free" style="display:inline-flex;align-items:center;gap:4px;">${uiIcon("leaf", 12, "🌿")} Học viên</span>`;

    bar.innerHTML = `
      <div class="s4-user-left">
        <button class="s4-profile-trigger" onclick="window.S4Auth.openProfileModal()" title="Bấm để mở Hồ sơ cá nhân & Theo dõi tiến độ">
          ${renderAvatarHtml(u.avatar, 24)}
          <span class="s4-profile-name">${esc(u.displayName)}</span>
          ${u.targetBand ? `<span class="s4-hide-sm" style="display:inline-flex;align-items:center;gap:3px;font-size:11px;opacity:.85;background:rgba(37,99,235,0.12);color:#2563eb;padding:1px 6px;border-radius:6px;font-weight:700;flex-shrink:0;">${uiIcon("target", 11, "🎯")} ${esc(u.targetBand)}</span>` : ""}
        </button>
        ${badge}
      </div>
      <div class="s4-user-right">
        <button class="s4-top-btn donate" onclick="window.S4Auth.openDonateModal()">${uiIcon("heart", 14, "💖")} Ủng hộ</button>
        ${u.role === "admin" ? `<button class="s4-top-btn gold" onclick="window.S4Auth.openAdminModal()">${uiIcon("shield", 14, "🛡️")} Quản trị</button>` : ""}
        <div class="s4-menu-wrap">
          <button class="s4-top-btn" id="s4MenuToggle" onclick="event.stopPropagation();document.getElementById('s4TopDropdown').classList.toggle('open')">${uiIcon("menu", 14, "☰")} Mục ${uiIcon("chevronDown", 12, "▾")}</button>
          <div class="s4-dropdown" id="s4TopDropdown">
            <button class="s4-dd-item" onclick="window.S4Auth.openProfileModal('overview')">${uiIcon("chart", 15, "📊")} Hồ sơ &amp; Tiến độ</button>
            <button class="s4-dd-item" onclick="window.S4Auth.openProfileModal('edit')">${uiIcon("edit", 15, "🎨")} Đổi Tên &amp; Avatar</button>
            <button class="s4-dd-item" onclick="window.S4Auth.openProfileModal('pw')">${uiIcon("lock", 15, "🔐")} Đổi mật khẩu</button>
            <div class="s4-dd-sep"></div>
            ${u.role === "admin" ? `<button class="s4-dd-item" onclick="window.S4Auth.openAdminModal()">${uiIcon("shield", 15, "🛡️")} Trung tâm Quản trị</button>` : ""}
            <button class="s4-dd-item" style="color:#e11d48;font-weight:700;" onclick="window.S4Auth.openDonateModal()">${uiIcon("heart", 15, "💖")} Ủng hộ dự án</button>
            <button class="s4-dd-item" onclick="window.S4Auth.openInstallModal()">${uiIcon("download", 15, "📲")} Cài App vào MH chính</button>
            <div class="s4-dd-sep"></div>
            <button class="s4-dd-item" style="color:#dc2626;" onclick="window.S4Auth.logout()">${uiIcon("logout", 15, "🚪")} Đăng xuất</button>
          </div>
        </div>
      </div>`;
  }

  document.addEventListener("click", () => {
    const dd = document.getElementById("s4TopDropdown");
    if (dd) dd.classList.remove("open");
  });

  function newModal(extraClass) {
    injectStyles();
    closeModals();
    document.documentElement.classList.add("s4-modal-lock");
    document.body.classList.add("s4-modal-lock");
    const wrap = document.createElement("div");
    wrap.className = "s4-modal-backdrop";
    wrap.id = "s4AuthModal";
    wrap.innerHTML = `<div class="s4-modal ${extraClass || ""}"></div>`;
    wrap.addEventListener("click", (e) => {
      if (e.target === wrap) closeModals();
    });
    document.body.appendChild(wrap);
    return { wrap, box: wrap.firstChild };
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const dd = document.getElementById("s4TopDropdown");
      if (dd && dd.classList.contains("open")) {
        dd.classList.remove("open");
      }
      if (document.getElementById("s4AuthModal")) {
        closeModals();
      }
    }
  });
  function closeModals() {
    document.querySelectorAll("#s4AuthModal").forEach(el => el.remove());
    document.documentElement.classList.remove("s4-modal-lock");
    document.body.classList.remove("s4-modal-lock");
  }

  /* ---------- TRANG CÁ NHÂN (HỒ SƠ, TIẾN ĐỘ, ĐỔI TÊN/AVT/MẬT KHẨU) ---------- */
  function resizeImageToDataUrl(file, maxSize) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Không đọc được file ảnh."));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("File ảnh không hợp lệ."));
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const sz = maxSize || 96;
          canvas.width = sz;
          canvas.height = sz;
          const ctx = canvas.getContext("2d");
          const side = Math.min(img.width, img.height);
          const sx = Math.floor((img.width - side) / 2);
          const sy = Math.floor((img.height - side) / 2);
          ctx.drawImage(img, sx, sy, side, side, 0, 0, sz, sz);
          resolve(canvas.toDataURL("image/jpeg", 0.78));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function openProfileModal(startTab) {
    const u = getCurrentUser();
    if (!u) return openLoginModal(false);
    const { box } = newModal();
    let tab = startTab || "overview";
    let selAvatar = u.avatar || "🎓";
    let msg = "", err = "";

    function render() {
      const curU = getCurrentUser() || u;
      const st = progressStats(readProgress());

      let bodyHtml = "";
      if (tab === "overview") {
        const maxDayCnt = Math.max(10, ...st.recent7.map(x => x.count));
        const chartBars = st.recent7.map(d => {
          const h = d.count ? Math.max(14, Math.round((d.count / maxDayCnt) * 64)) : 4;
          return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
            <div style="font-size:10.5px;font-weight:700;color:${d.count ? "#16a34a" : "#94a3b8"};">${d.count || 0}</div>
            <div style="width:100%;max-width:28px;height:66px;display:flex;align-items:flex-end;justify-content:center;background:rgba(148,163,184,0.12);border-radius:6px;padding:2px;">
              <div style="width:100%;height:${h}px;background:${d.count ? "linear-gradient(180deg,#22c55e,#16a34a)" : "#cbd5e1"};border-radius:4px;"></div>
            </div>
            <div style="font-size:10.5px;color:#64748b;">${d.label}</div>
          </div>`;
        }).join("");

        const lisPct = Math.min(100, Math.round(((st.listeningDone + st.listeningWords) / (TOTAL_LISTENING_LESSONS + TOTAL_LISTENING_VOCAB)) * 100));
        const readPct = Math.min(100, Math.round(((st.readingDone + st.readingWords) / (TOTAL_READING_LESSONS + TOTAL_READING_VOCAB)) * 100));
        const writePct = Math.min(100, Math.round((st.writingDone / TOTAL_WRITING_LESSONS) * 100));
        const speakPct = Math.min(100, Math.round(((st.speakingDone + st.speakingWords) / (TOTAL_SPEAKING_LESSONS + TOTAL_SPEAKING_VOCAB)) * 100));
        const tedPct = Math.min(100, Math.round((st.tedDone / TOTAL_TED_LESSONS) * 100));

        bodyHtml = `
          <div class="s4-stat-box" style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:6px;">
              <span style="font-weight:800;font-size:14px;display:inline-flex;align-items:center;gap:6px;">${uiIcon("chart", 15, "📈")} Tổng tiến độ khóa học</span>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;gap:4px;font-size:11.5px;background:rgba(217,119,6,0.12);color:#d97706;padding:2px 8px;border-radius:999px;font-weight:700;">${uiIcon("flame", 12, "🔥")} Chuỗi học: ${st.streakDays} ngày (Tổng ${st.totalStudyDays} ngày)</span>
                <span style="font-weight:800;color:#2563eb;font-size:15px;">${st.overallPct}%</span>
              </div>
            </div>
            <div class="s4-prog-track"><div class="s4-prog-bar" style="width:${st.overallPct}%;background:linear-gradient(90deg,#2563eb,#0d9488);"></div></div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(195px,1fr));gap:10px;margin-top:12px;">
              <div style="padding:10px;border-radius:10px;background:rgba(37,99,235,0.07);">
                <div style="font-size:12px;color:#64748b;font-weight:600;">🧠 Từ vựng IELTS</div>
                <div style="font-size:16px;font-weight:800;color:#2563eb;margin:2px 0;">${st.vocabLearned + st.vocabIgnored} / ${TOTAL_VOCAB} <span style="font-size:12px;">(${st.vocabPct}%)</span></div>
                <div class="s4-prog-track"><div class="s4-prog-bar" style="width:${st.vocabPct}%;background:#2563eb;"></div></div>
                <div style="font-size:11px;color:#64748b;margin-top:6px;">
                  Đang học: <b>${st.vocabLearned}</b> • Nhớ kỹ: <b style="color:#16a34a">${st.vocabMastered}</b> • Đã biết: <b>${st.vocabIgnored}</b> • Cần ôn: <b style="color:#dc2626">${st.vocabDue}</b>
                </div>
              </div>
              <div style="padding:10px;border-radius:10px;background:rgba(13,148,136,0.08);">
                <div style="font-size:12px;color:#64748b;font-weight:600;">📘 Ngữ pháp IELTS</div>
                <div style="font-size:16px;font-weight:800;color:#0d9488;margin:2px 0;">${st.grammarDone} / ${TOTAL_GRAMMAR} <span style="font-size:12px;">(${st.grammarPct}%)</span></div>
                <div class="s4-prog-track"><div class="s4-prog-bar" style="width:${st.grammarPct}%;background:#0d9488;"></div></div>
                <div style="font-size:11px;color:#64748b;margin-top:6px;">
                  Đã hoàn thành: <b style="color:#16a34a">${st.grammarDone} bài</b> • Chưa học: <b>${Math.max(0, TOTAL_GRAMMAR - st.grammarDone)} bài</b> (4 chương)
                </div>
              </div>
              <div style="padding:10px;border-radius:10px;background:rgba(217,119,6,0.08);">
                <div style="font-size:12px;color:#64748b;font-weight:600;">🎧 IELTS Listening</div>
                <div style="font-size:15.5px;font-weight:800;color:#d97706;margin:2px 0;">${st.listeningDone} / ${TOTAL_LISTENING_LESSONS} bài <span style="font-size:12px;">(${lisPct}%)</span></div>
                <div class="s4-prog-track"><div class="s4-prog-bar" style="width:${lisPct}%;background:#d97706;"></div></div>
                <div style="font-size:11px;color:#64748b;margin-top:6px;">
                  Từ vựng SRS: <b>${st.listeningWords} / ${TOTAL_LISTENING_VOCAB} từ</b>
                </div>
              </div>
              <div style="padding:10px;border-radius:10px;background:rgba(21,128,61,0.08);">
                <div style="font-size:12px;color:#64748b;font-weight:600;">📖 IELTS Reading</div>
                <div style="font-size:15.5px;font-weight:800;color:#15803d;margin:2px 0;">${st.readingDone} / ${TOTAL_READING_LESSONS} bài <span style="font-size:12px;">(${readPct}%)</span></div>
                <div class="s4-prog-track"><div class="s4-prog-bar" style="width:${readPct}%;background:#15803d;"></div></div>
                <div style="font-size:11px;color:#64748b;margin-top:6px;">
                  Từ vựng SRS: <b>${st.readingWords} / ${TOTAL_READING_VOCAB} từ</b>
                </div>
              </div>
              <div style="padding:10px;border-radius:10px;background:rgba(126,34,206,0.08);">
                <div style="font-size:12px;color:#64748b;font-weight:600;">✍️ IELTS Writing</div>
                <div style="font-size:15.5px;font-weight:800;color:#7e22ce;margin:2px 0;">${st.writingDone} / ${TOTAL_WRITING_LESSONS} bài <span style="font-size:12px;">(${writePct}%)</span></div>
                <div class="s4-prog-track"><div class="s4-prog-bar" style="width:${writePct}%;background:#7e22ce;"></div></div>
                <div style="font-size:11px;color:#64748b;margin-top:6px;">
                  Bài giảng &amp; Bộ đề Practice Zone CBT
                </div>
              </div>
              <div style="padding:10px;border-radius:10px;background:rgba(225,29,72,0.08);">
                <div style="font-size:12px;color:#64748b;font-weight:600;">🗣️ IELTS Speaking</div>
                <div style="font-size:15.5px;font-weight:800;color:#e11d48;margin:2px 0;">${st.speakingDone} / ${TOTAL_SPEAKING_LESSONS} bài <span style="font-size:12px;">(${speakPct}%)</span></div>
                <div class="s4-prog-track"><div class="s4-prog-bar" style="width:${speakPct}%;background:#e11d48;"></div></div>
                <div style="font-size:11px;color:#64748b;margin-top:6px;">
                  Từ vựng SRS: <b>${st.speakingWords} / ${TOTAL_SPEAKING_VOCAB} từ</b>
                </div>
              </div>
              <div style="padding:10px;border-radius:10px;background:rgba(220,38,38,0.08);">
                <div style="font-size:12px;color:#64748b;font-weight:600;">🎙️ TED Talks Song ngữ</div>
                <div style="font-size:15.5px;font-weight:800;color:#dc2626;margin:2px 0;">${st.tedDone} / ${TOTAL_TED_LESSONS} bài <span style="font-size:12px;">(${tedPct}%)</span></div>
                <div class="s4-prog-track"><div class="s4-prog-bar" style="width:${tedPct}%;background:#dc2626;"></div></div>
              </div>
              <div style="padding:10px;border-radius:10px;background:rgba(185,28,28,0.08);">
                <div style="font-size:12px;color:#64748b;font-weight:600;">🏮 Tiếng Trung HSK 1–6</div>
                <div style="font-size:15.5px;font-weight:800;color:#b91c1c;margin:2px 0;">${st.hskDoneItems} / ${TOTAL_HSK_ITEMS} bài <span style="font-size:12px;">(${st.hskPct}%)</span></div>
                <div class="s4-prog-track"><div class="s4-prog-bar" style="width:${st.hskPct}%;background:#b91c1c;"></div></div>
                <div style="font-size:11px;color:#64748b;margin-top:6px;">
                  Từ vựng SRS: <b>${st.hskWords} / ${TOTAL_HSK_VOCAB} từ</b>${st.hskDue ? ` • Cần ôn: <b style="color:#dc2626">${st.hskDue}</b>` : ""}
                </div>
              </div>
            </div>
          </div>
          <div class="s4-stat-box">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="font-weight:700;font-size:13px;">📊 Hoạt động 7 ngày gần nhất</span>
              <span style="font-size:12px;color:#16a34a;font-weight:700;">🔥 Chuỗi ${st.streakDays} ngày liên tiếp</span>
            </div>
            <div style="display:flex;gap:6px;align-items:flex-end;padding-top:4px;">${chartBars}</div>
          </div>`;
      } else if (tab === "edit") {
        const avtGrid = AVATAR_PRESETS.map(em => `<div class="s4-avt-opt ${selAvatar === em ? "active" : ""}" data-em="${esc(em)}">${em}</div>`).join("");
        const bands = ["5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5+"].map(b => `<option value="${b}" ${curU.targetBand === b ? "selected" : ""}>🎯 Mục tiêu IELTS Band ${b}</option>`).join("");
        bodyHtml = `
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <div id="avtPreview">${renderAvatarHtml(selAvatar, 56)}</div>
            <div style="flex:1;">
              <div style="font-weight:700;font-size:13.5px;margin-bottom:4px;">Ảnh đại diện (Avatar)</div>
              <label class="s4-top-btn" style="background:#2563eb;color:#fff;display:inline-flex;cursor:pointer;">
                ${uiIcon("upload", 14, "📷")} Tải ảnh từ máy lên
                <input type="file" id="inpAvtFile" accept="image/*" style="display:none;">
              </label>
            </div>
          </div>
          <div style="font-size:12px;color:#64748b;margin-bottom:6px;">Hoặc chọn biểu tượng nhanh:</div>
          <div class="s4-avt-grid">${avtGrid}</div>
          <label style="font-size:12.5px;font-weight:700;">Họ tên hiển thị:</label>
          <input class="s4-input" id="profName" value="${esc(curU.displayName)}" maxlength="40" placeholder="Nhập tên hiển thị...">
          <label style="font-size:12.5px;font-weight:700;">Mục tiêu điểm IELTS:</label>
          <select class="s4-input" id="profBand">${bands}</select>
          <label style="font-size:12.5px;font-weight:700;">Châm ngôn / Ghi chú học tập cá nhân:</label>
          <input class="s4-input" id="profBio" value="${esc(curU.bio || "")}" maxlength="100" placeholder="VD: Quyết tâm đạt IELTS 7.5 trước tháng 12!">
          <button class="s4-btn" id="btnSaveProfile">${uiIcon("backup", 15, "💾")} Lưu Thông Tin Cá Nhân</button>`;
      } else {
        bodyHtml = `
          <label style="font-size:12.5px;font-weight:700;">Mật khẩu hiện tại:</label>
          <div class="s4-pass-wrap">
            <input class="s4-input" id="pwOld" type="password" placeholder="Nhập mật khẩu hiện tại" autocomplete="current-password">
            <button type="button" class="s4-pass-toggle" title="Hiện/Ẩn mật khẩu">${uiIcon("eye", 15, "👁️")}</button>
          </div>
          <label style="font-size:12.5px;font-weight:700;">Mật khẩu mới (tối thiểu 6 ký tự):</label>
          <div class="s4-pass-wrap">
            <input class="s4-input" id="pwNew" type="password" placeholder="Nhập mật khẩu mới" autocomplete="new-password">
            <button type="button" class="s4-pass-toggle" title="Hiện/Ẩn mật khẩu">${uiIcon("eye", 15, "👁️")}</button>
          </div>
          <label style="font-size:12.5px;font-weight:700;">Xác nhận mật khẩu mới:</label>
          <div class="s4-pass-wrap">
            <input class="s4-input" id="pwNew2" type="password" placeholder="Nhập lại mật khẩu mới" autocomplete="new-password">
            <button type="button" class="s4-pass-toggle" title="Hiện/Ẩn mật khẩu">${uiIcon("eye", 15, "👁️")}</button>
          </div>
          <button class="s4-btn" id="btnChangePw">${uiIcon("lock", 15, "")} Cập Nhật Mật Khẩu Mới</button>`;
      }

      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
          <div style="display:flex;align-items:center;gap:12px;">
            ${renderAvatarHtml(curU.avatar, 50)}
            <div>
              <h3 style="margin:0;display:flex;align-items:center;gap:6px;">
                ${esc(curU.displayName)}
                <span style="display:inline-flex;align-items:center;gap:3px;font-size:12px;font-weight:700;background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:999px;">${uiIcon("target", 12, "🎯")} Band ${esc(curU.targetBand || "7.0")}</span>
              </h3>
              <div style="font-size:12.5px;color:#64748b;">@${esc(curU.username)} ${curU.createdAt ? "• Tham gia: " + esc(curU.createdAt) : ""}</div>
              ${curU.bio ? `<div style="font-size:12px;color:#0d9488;margin-top:2px;font-style:italic;">“${esc(curU.bio)}”</div>` : ""}
            </div>
          </div>
          <button class="s4-top-btn" style="color:inherit;padding:6px 8px;" id="s4Close">${uiIcon("close", 15, "✕")}</button>
        </div>
        <div class="s4-tabs">
          <button class="s4-tab ${tab === "overview" ? "active" : ""}" data-t="overview">${uiIcon("chart", 14, "📊")} Tiến độ học tập</button>
          <button class="s4-tab ${tab === "edit" ? "active" : ""}" data-t="edit">${uiIcon("edit", 14, "🎨")} Đổi tên &amp; Avatar</button>
          <button class="s4-tab ${tab === "pw" ? "active" : ""}" data-t="pw">${uiIcon("lock", 14, "🔐")} Đổi mật khẩu</button>
        </div>
        ${msg ? `<div class="s4-ok" style="display:flex;align-items:center;gap:6px;">${uiIcon("check", 15, "✅")} <span>${esc(msg)}</span></div>` : ""}
        ${err ? `<div class="s4-err" style="display:flex;align-items:center;gap:6px;">${uiIcon("alert", 15, "⚠️")} <span>${esc(err)}</span></div>` : ""}
        ${bodyHtml}`;

      const cTop = box.querySelector("#s4Close");
      if (cTop) cTop.onclick = closeModals;
      const cBottom = box.querySelector("#s4CloseBottom");
      if (cBottom) cBottom.onclick = closeModals;
      if (typeof setupPassToggles === "function") setupPassToggles(box);
      box.querySelectorAll("[data-t]").forEach(b => {
        b.onclick = () => { tab = b.dataset.t; msg = ""; err = ""; render(); };
      });

      if (tab === "edit") {
        box.querySelectorAll("[data-em]").forEach(el => {
          el.onclick = () => { selAvatar = el.dataset.em; render(); };
        });
        const fileInp = box.querySelector("#inpAvtFile");
        if (fileInp) {
          fileInp.onchange = async ev => {
            const f = ev.target.files && ev.target.files[0];
            if (!f) return;
            try {
              selAvatar = await resizeImageToDataUrl(f, 96);
              render();
            } catch (e) { err = e.message || "Lỗi xử lý ảnh"; render(); }
          };
        }
        box.querySelector("#btnSaveProfile").onclick = async () => {
          const btn = box.querySelector("#btnSaveProfile");
          const newName = (box.querySelector("#profName").value.trim() || curU.username).slice(0, 40);
          const newBand = box.querySelector("#profBand").value;
          const newBio = box.querySelector("#profBio").value.trim().slice(0, 100);
          btn.disabled = true; btn.textContent = "⏳ Đang lưu...";
          try {
            const patch = { displayName: newName, avatar: selAvatar, targetBand: newBand, bio: newBio };
            await dbSecureWrite(curU.username, `study4_users/${curU.username}`, patch, (session && session.ph) || "");
            Object.assign(cache[curU.username], { displayName: newName, avatar: selAvatar, targetBand: newBand, bio: newBio });
            saveCache();
            renderTopBar();
            msg = "Đã cập nhật hồ sơ cá nhân thành công!";
            err = "";
          } catch (e) {
            err = "Không lưu được lên máy chủ. Vui lòng kiểm tra kết nối mạng.";
          }
          render();
        };
      } else if (tab === "pw") {
        box.querySelector("#btnChangePw").onclick = async () => {
          const oldP = box.querySelector("#pwOld").value;
          const newP = box.querySelector("#pwNew").value;
          const newP2 = box.querySelector("#pwNew2").value;
          msg = ""; err = "";
          if (!oldP || !newP) { err = "Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới."; return render(); }
          if (newP.length < 6) { err = "Mật khẩu mới phải từ 6 ký tự trở lên."; return render(); }
          if (newP !== newP2) { err = "Mật khẩu mới nhập lại chưa khớp."; return render(); }
          const oldHashV2 = await hashPwV2(curU.username, oldP);
          const oldHashV1 = await hashPwLegacy(curU.username, oldP);
          if (oldHashV2 !== session.ph && oldHashV1 !== session.ph) { err = "Mật khẩu hiện tại không đúng."; return render(); }
          const activeOldHash = session.ph;
          const btn = box.querySelector("#btnChangePw");
          btn.disabled = true; btn.textContent = "⏳ Đang cập nhật...";
          try {
            const newHash = await hashPw(curU.username, newP);
            const migrated = await syncAuthSecret(curU.username, newHash, activeOldHash);
            if (!migrated) {
              await db(`study4_users/${curU.username}`, "PATCH", { passwordHash: newHash, authProof: activeOldHash });
            }
            session.ph = newHash;
            saveSession();
            if (cache[curU.username]) { cache[curU.username].passwordHash = newHash; saveCache(); }
            pushProgress().catch(() => {});
            msg = "Đã đổi mật khẩu thành công!";
          } catch (e) {
            err = "Lỗi kết nối mạng khi đổi mật khẩu, vui lòng thử lại.";
          }
          render();
        };
      }
    }

    render();
  }

  /* ---------- ĐĂNG NHẬP / ĐĂNG KÝ ---------- */
  function setupPassToggles(container) {
    (container || document).querySelectorAll(".s4-pass-toggle").forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const wrap = btn.closest(".s4-pass-wrap");
        const inp = wrap ? wrap.querySelector("input") : null;
        if (!inp) return;
        const isPass = inp.type === "password";
        inp.type = isPass ? "text" : "password";
        btn.innerHTML = isPass ? uiIcon("eyeOff", 15, "🙈") : uiIcon("eye", 15, "👁️");
        btn.title = isPass ? "Ẩn mật khẩu" : "Hiện mật khẩu";
      };
    });
  }

  function openLoginModal(forceLock) {
    const { box } = newModal();
    let mode = "login"; // "login" | "register" | "forgot"
    let flash = sessionStorage.getItem("s4_logout_msg") || "";
    sessionStorage.removeItem("s4_logout_msg");
    let busy = false;
    let setupMode = false;

    function render(errMsg, infoMsg) {
      const canClose = !forceLock || !config.authEnforced || !!getCurrentUser();

      let bodyHtml = "";
      if (mode === "forgot") {
        bodyHtml = `
          <div style="font-weight:700;font-size:14.5px;margin-bottom:4px;color:#2563eb;">Yêu cầu hỗ trợ đặt lại mật khẩu</div>
          <div style="font-size:12.5px;color:#64748b;margin-bottom:12px;">Để bảo mật tài khoản, việc đặt lại mật khẩu khi quên mật khẩu cũ sẽ do Quản trị viên xác minh và cấp lại.</div>
          <form id="s4ForgotForm">
            <input class="s4-input" id="inpForgotUser" placeholder="Tên đăng nhập (@username)" autocomplete="username" autocapitalize="off" required>
            <input class="s4-input" id="inpForgotName" placeholder="Họ tên hiển thị đã đăng ký (để xác minh)" required>
            <button type="submit" class="s4-btn" id="btnDoForgot">Gửi Yêu Cầu Tới Quản Trị Viên</button>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;">
              <a href="#" id="linkBackLogin" style="font-size:12.5px;color:#2563eb;text-decoration:none;font-weight:700;">← Quay lại Đăng nhập</a>
            </div>
          </form>
        `;
      } else {
        bodyHtml = `
          <p style="font-size:13px;color:var(--lg-ink-muted,#64748b);margin:8px 0 12px 0;">
            Đăng nhập để lưu trữ và đồng bộ tiến độ học tập trên mọi thiết bị.
          </p>
          ${setupMode ? "" : `<div class="s4-tabs">
            <button class="s4-tab ${mode === "login" ? "active" : ""}" id="tabLogin" type="button">Đăng nhập</button>
            <button class="s4-tab ${mode === "register" ? "active" : ""}" id="tabReg" type="button">Tạo tài khoản mới</button>
          </div>`}
          <form id="s4AuthForm">
            ${mode === "register" && !setupMode ? `<input class="s4-input" id="inpDisplay" placeholder="Họ tên hiển thị (VD: Minh Anh)" maxlength="40" required>` : ""}
            <input class="s4-input" id="inpUser" placeholder="Tên đăng nhập (chữ thường, số, _ ; 3-20 ký tự)" autocomplete="username" autocapitalize="off" required value="${setupMode ? "admin" : ""}" ${setupMode ? "readonly" : ""}>
            <div class="s4-pass-wrap">
              <input class="s4-input" id="inpPass" type="password" placeholder="${setupMode ? "Đặt mật khẩu Admin mới (từ 6 ký tự)" : "Mật khẩu"}" autocomplete="${mode === "login" && !setupMode ? "current-password" : "new-password"}" required>
              <button type="button" class="s4-pass-toggle" title="Hiện/Ẩn mật khẩu">${uiIcon("eye", 15, "👁️")}</button>
            </div>
            ${setupMode ? `<div class="s4-pass-wrap"><input class="s4-input" id="inpPass2" type="password" placeholder="Nhập lại mật khẩu Admin" autocomplete="new-password" required><button type="button" class="s4-pass-toggle" title="Hiện/Ẩn mật khẩu">${uiIcon("eye", 15, "👁️")}</button></div>` : ""}
            ${mode === "login" && !setupMode ? `<div style="display:flex;justify-content:flex-end;margin-top:-4px;margin-bottom:10px;"><a href="#" id="linkForgot" style="font-size:12px;color:#2563eb;text-decoration:none;font-weight:600;">Quên mật khẩu?</a></div>` : ""}
            <button type="submit" class="s4-btn" id="s4Submit">${setupMode ? "Thiết lập mật khẩu Admin" : mode === "login" ? "Đăng nhập vào học" : "Đăng ký & Vào học"}</button>
          </form>
        `;
      }

      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${getLogoPath()}" alt="Logo" style="width:34px;height:34px;border-radius:9px;">
            <h3 style="margin:0;font-size:18px;font-weight:800;">LinguaPath</h3>
          </div>
          ${canClose ? `<button class="s4-top-btn" style="color:inherit;padding:6px 8px;" id="s4Close">${uiIcon("close", 15, "✕")}</button>` : ""}
        </div>
        ${flash ? `<div class="s4-info" style="display:flex;align-items:center;gap:6px;">${uiIcon("info", 15, "ℹ️")} <span>${esc(flash)}</span></div>` : ""}
        ${infoMsg ? `<div class="s4-info" style="display:flex;align-items:center;gap:6px;">${uiIcon("info", 15, "ℹ️")} <span>${esc(infoMsg)}</span></div>` : ""}
        ${errMsg ? `<div class="s4-err" style="display:flex;align-items:center;gap:6px;">${uiIcon("alert", 15, "⚠️")} <span>${esc(errMsg)}</span></div>` : ""}
        ${bodyHtml}
      `;

      flash = "";
      const c = box.querySelector("#s4Close"); if (c) c.onclick = closeModals;
      const tl = box.querySelector("#tabLogin"); if (tl) tl.onclick = () => { mode = "login"; render(); };
      const tr = box.querySelector("#tabReg"); if (tr) tr.onclick = () => { mode = "register"; render(); };
      const lf = box.querySelector("#linkForgot"); if (lf) lf.onclick = (e) => { e.preventDefault(); mode = "forgot"; render(); };
      const bl = box.querySelector("#linkBackLogin"); if (bl) bl.onclick = (e) => { e.preventDefault(); mode = "login"; render(); };

      setupPassToggles(box);

      const forgotForm = box.querySelector("#s4ForgotForm");
      if (forgotForm) {
        forgotForm.onsubmit = async (e) => {
          e.preventDefault();
          const uInp = (box.querySelector("#inpForgotUser").value || "").trim().toLowerCase();
          const nInp = (box.querySelector("#inpForgotName").value || "").trim().slice(0, 60);
          if (!USER_RE.test(uInp) || uInp === "admin") {
            return render("Tên đăng nhập không hợp lệ hoặc không hỗ trợ tự đặt lại.");
          }
          if (nInp.length < 2) {
            return render("Vui lòng nhập họ tên hiển thị đã đăng ký để Quản trị viên xác minh.");
          }
          try {
            // Không đọc hồ sơ study4_users ở phía client để tránh dò tên tài khoản / hiển thị công khai
            await db("study4_reset_requests/" + uInp, "PUT", {
              username: uInp,
              claimedDisplayName: nInp,
              displayName: nInp,
              requestedAt: new Date().toISOString()
            });
            mode = "login";
            render("", "Đã tiếp nhận yêu cầu. Nếu tài khoản @" + uInp + " tồn tại và thông tin xác minh khớp, Quản trị viên sẽ hỗ trợ cấp lại mật khẩu.");
          } catch (e) {
            render("Lỗi kết nối máy chủ khi gửi yêu cầu đặt lại mật khẩu.");
          }
        };
      }

      const authForm = box.querySelector("#s4AuthForm");
      if (authForm) authForm.onsubmit = onSubmit;
    }

    async function onSubmit(ev) {
      ev.preventDefault();
      if (busy) return;
      const btn = box.querySelector("#s4Submit");
      const raw = box.querySelector("#inpUser").value.trim().toLowerCase();
      const pass = box.querySelector("#inpPass").value;
      busy = true; btn.disabled = true; btn.textContent = "Đang xử lý...";
      try {
        if (setupMode) {
          if (pass.length < 6) throw new Error("Mật khẩu phải từ 6 ký tự trở lên.");
          if (pass !== box.querySelector("#inpPass2").value) throw new Error("Hai mật khẩu nhập chưa khớp.");
          const r = await setupAdmin(pass);
          if (!r.ok) throw new Error(r.msg);
          closeModals(); location.reload(); return;
        }
        if (!USER_RE.test(raw)) throw new Error("Tên đăng nhập chỉ gồm chữ không dấu, số, dấu gạch dưới (3-20 ký tự).");

        if (mode === "login") {
          const r = await doLogin(raw, pass);
          if (r.needSetup) { setupMode = true; busy = false; return render("", "Tài khoản Admin chưa có mật khẩu. Hãy đặt mật khẩu Admin ngay bây giờ."); }
          if (!r.ok) throw new Error(r.msg);
          closeModals(); location.reload();
        } else {
          if (raw === "admin") throw new Error("Tên \"admin\" được dành riêng, vui lòng chọn tên khác.");
          if (pass.length < 6) throw new Error("Mật khẩu phải từ 6 ký tự trở lên.");
          const disp = (box.querySelector("#inpDisplay").value.trim() || raw).slice(0, 40);
          let existing;
          try { existing = await db("study4_users/" + raw); }
          catch (e) { throw new Error("Cần có mạng để tạo tài khoản. Vui lòng kết nối internet và thử lại."); }
          if (existing && !existing.deleted && (existing.username || existing.passwordHash || existing.role)) throw new Error("Tên đăng nhập này đã có người dùng, vui lòng chọn tên khác.");
          const ph = await hashPw(raw, pass);
          const migrated = await syncAuthSecret(raw, ph, ph);
          const st = progressStats(readProgress());
          const rec = Object.assign({
            username: raw, displayName: disp, avatar: "🎓", targetBand: "7.0", bio: "",
            role: "basic", status: "active", expiresAt: "PERM",
            createdAt: new Date().toISOString().slice(0, 10)
          }, buildProgressStatsPatch(st));
          if (migrated) {
            await dbSecureWrite(raw, "study4_users/" + raw, rec, ph, { replace: true });
          } else {
            await db("study4_users/" + raw, "PUT", Object.assign({}, rec, { passwordHash: ph, authProof: ph }));
          }
          await startSession(rec, ph);
          closeModals(); location.reload();
        }
      } catch (e) {
        busy = false;
        render(e && e.message ? e.message : "Có lỗi xảy ra, vui lòng thử lại.");
      }
    }

    render();
  }

  function openDonateModal() {
    const u = getCurrentUser();
    const { box } = newModal("wide");

    function renderContent() {
      const bank = config.bankCode || "MB";
      const acc = config.bankAccount || "0988888888";
      const owner = config.bankOwner || "HOANG NGUYEN";
      const noteText = config.contactNote || "20% số tiền ủng hộ (Donate) sẽ được trích chuyển trực tiếp tới Mặt trận Tổ quốc Việt Nam để ủng hộ đồng bào & các hoạt động thiện nguyện.";
      const memo = config.transferMemo || ("UNG HO LINGUAPATH" + (u && u.username ? " " + u.username.toUpperCase() : ""));
      const qrUrl = "https://img.vietqr.io/image/" + encodeURIComponent(bank) + "-" + encodeURIComponent(acc) + "-compact2.svg?addInfo=" + encodeURIComponent(memo) + "&accountName=" + encodeURIComponent(owner);

      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h3 style="margin:0;font-size:17.5px;display:flex;align-items:center;gap:8px;color:#e11d48;">
            ${uiIcon("heart", 18, "💖")} <span>Ủng hộ dự án</span>
          </h3>
          <button type="button" class="s4-top-btn" style="color:inherit;padding:6px 8px;cursor:pointer;" id="s4Close" onclick="window.S4Auth.closeModals()">${uiIcon("close", 15, "✕")}</button>
        </div>

        <div style="background:linear-gradient(135deg,#fff1f2,#fef3c7);border:1px solid #fda4af;color:#881337;padding:9px 12px;border-radius:12px;margin-bottom:12px;font-size:12.5px;font-weight:600;line-height:1.45;">
          Miễn phí 100% cho cộng đồng — ${esc(noteText)}
        </div>

        <div class="s4-donate-grid">
          <div style="text-align:center;">
            <div id="qrBox" style="background:#fff;padding:8px;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.08);display:inline-flex;flex-direction:column;align-items:center;justify-content:center;min-width:192px;min-height:224px;max-width:100%;color:#0f172a;">
              <div id="qrLoading" style="font-size:12px;font-weight:600;color:#475569;padding:8px 4px;">Đang tải mã VietQR...</div>
              <img src="${qrUrl}" alt="VietQR Donate" referrerpolicy="no-referrer" decoding="async" style="width:176px;height:208px;object-fit:contain;display:block;margin:0 auto;border-radius:6px;" id="qrImg">
              <div id="qrFallback" style="display:none;width:176px;min-height:196px;padding:12px 8px;border:1.5px dashed #cbd5e1;border-radius:8px;background:#f8fafc;color:#0f172a;flex-direction:column;align-items:center;justify-content:center;gap:6px;line-height:1.45;">
                <div style="font-size:13px;font-weight:800;color:#be123c;">${esc(bank)}</div>
                <div style="font-size:13px;font-weight:800;color:#1d4ed8;word-break:break-all;">STK: ${esc(acc)}</div>
                <div style="font-size:11px;color:#475569;">Chưa tải được QR. Dùng nút Sao chép bên cạnh để chuyển khoản nhanh.</div>
                <button type="button" id="btnRetryQr" class="s4-top-btn" style="margin-top:4px;font-size:11.5px;padding:5px 10px;background:#fff;color:#0f172a;border:1px solid #cbd5e1;cursor:pointer;">${uiIcon("refresh", 13, "🔄")} Thử lại</button>
              </div>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:7px;font-size:12.5px;min-width:0;">
            <div class="s4-donate-row">
              <div style="min-width:0;overflow:hidden;text-overflow:ellipsis;"><span style="color:var(--muted,#64748b);font-size:11px;">Ngân hàng:</span><br><b style="font-size:13.5px;">${esc(bank)}</b></div>
              <button class="s4-top-btn" data-copy="${esc(bank)}" style="font-size:11px;padding:4px 9px;">Sao chép</button>
            </div>

            <div class="s4-donate-row">
              <div style="min-width:0;overflow:hidden;text-overflow:ellipsis;"><span style="color:var(--muted,#64748b);font-size:11px;">Số tài khoản:</span><br><b style="font-size:14px;letter-spacing:0.5px;color:#2563eb;">${esc(acc)}</b></div>
              <button class="s4-top-btn" data-copy="${esc(acc)}" style="font-size:11px;padding:4px 9px;">Sao chép</button>
            </div>

            <div class="s4-donate-row">
              <div style="min-width:0;overflow:hidden;text-overflow:ellipsis;"><span style="color:var(--muted,#64748b);font-size:11px;">Chủ tài khoản:</span><br><b>${esc(owner)}</b></div>
              <button class="s4-top-btn" data-copy="${esc(owner)}" style="font-size:11px;padding:4px 9px;">Sao chép</button>
            </div>

            <div class="s4-donate-row-memo">
              <div style="min-width:0;overflow:hidden;text-overflow:ellipsis;">
                <span style="color:#9f1239;font-size:11px;font-weight:700;">Nội dung CK:</span><br>
                <b style="font-size:13px;color:#e11d48;font-family:monospace;word-break:break-all;">${esc(memo)}</b>
              </div>
              <button class="s4-top-btn donate" data-copy="${esc(memo)}" style="font-size:11px;padding:4px 9px;">Sao chép</button>
            </div>
          </div>
        </div>

        <div style="margin-top:10px;display:flex;justify-content:flex-end;">
          <button type="button" class="s4-top-btn" id="s4CloseBottom" onclick="window.S4Auth.closeModals()" style="padding:7px 16px;font-size:13px;cursor:pointer;">Đóng</button>
        </div>
      `;

      const qrImg = box.querySelector("#qrImg");
      const qrLoading = box.querySelector("#qrLoading");
      const qrFallback = box.querySelector("#qrFallback");
      const btnRetryQr = box.querySelector("#btnRetryQr");
      const showQrSuccess = () => {
        if (qrLoading) qrLoading.style.display = "none";
        if (qrFallback) qrFallback.style.display = "none";
        if (qrImg) qrImg.style.display = "block";
      };
      const showQrFallback = () => {
        if (qrLoading) qrLoading.style.display = "none";
        if (qrImg) qrImg.style.display = "none";
        if (qrFallback) qrFallback.style.display = "flex";
      };
      if (qrImg) {
        qrImg.onload = () => {
          if (qrImg.naturalWidth > 0) showQrSuccess();
          else showQrFallback();
        };
        qrImg.onerror = showQrFallback;
        if (qrImg.complete) {
          if (qrImg.naturalWidth > 0) showQrSuccess();
          else showQrFallback();
        }
      }
      if (btnRetryQr && qrImg) {
        btnRetryQr.onclick = () => {
          if (qrFallback) qrFallback.style.display = "none";
          if (qrLoading) qrLoading.style.display = "block";
          qrImg.style.display = "block";
          qrImg.src = qrUrl + "&_t=" + Date.now();
        };
      }

      box.querySelector("#s4Close").onclick = closeModals;
      box.querySelectorAll("[data-copy]").forEach(btn => {
        btn.onclick = async () => {
          const val = btn.dataset.copy;
          try {
            await navigator.clipboard.writeText(val);
            const orig = btn.textContent;
            btn.textContent = "✓ Đã chép";
            setTimeout(() => { btn.textContent = orig; }, 1500);
          } catch (e) {
            if (window.S4UI && typeof window.S4UI.prompt === "function") {
              await window.S4UI.prompt("Sao chép nội dung bên dưới:", val, { title: "Sao chép thủ công", readOnly: true, confirmText: "Đóng" });
            } else {
              prompt("Sao chép:", val);
            }
          }
        };
      });
    }

    renderContent();
  }
  /* ---------- BẢNG QUẢN TRỊ ADMIN NÂNG CAO ---------- */

  function openAdminModal(startTab) {
    if (!isAdmin()) return;
    const { box } = newModal("wide");
    let tab = startTab || "users"; // "users" | "settings"
    let users = null, resetRequests = null, loading = false, msg = "";
    let userSearch = "", userFilter = "all", inspectUser = null, inspectProgress = null, searchTimer = null;

    async function load() {
      loading = true; render();
      try {
        if (tab === "users") {
          users = (await db("study4_users")) || {};
          resetRequests = (await db("study4_reset_requests").catch(() => ({}))) || {};
          // Tự động di trú mã băm mật khẩu còn sót sang nhánh bảo mật riêng study4_auth
          Object.keys(users).forEach(k => {
            if (users[k] && users[k].passwordHash) {
              syncAuthSecret(k, users[k].passwordHash, (session && session.ph) || users[k].passwordHash).catch(() => {});
            }
          });
        }
        msg = "";
      } catch (e) {
        msg = "Không tải được dữ liệu từ máy chủ. Kiểm tra kết nối mạng.";
      }
      loading = false; render();
    }

    function inspectModalHtml(u) {
      const vLearned = Number(u.vocabLearned) || 0;
      const vIgnored = Number(u.vocabIgnored) || 0;
      const vMastered = Number(u.vocabMastered) || 0;
      const vDue = Number(u.vocabDue) || 0;
      const gDone = Number(u.grammarDone) || 0;
      const lisDone = Number(u.listeningDone) || 0;
      const lisWords = Number(u.listeningWords) || 0;
      const readDone = Number(u.readingDone) || 0;
      const readWords = Number(u.readingWords) || 0;
      const writingDone = Number(u.writingDone) || 0;
      const speakingDone = Number(u.speakingDone) || 0;
      const speakingWords = Number(u.speakingWords) || 0;
      const tedDone = Number(u.tedDone) || 0;
      const hskWords = Number(u.hskWords) || 0;
      const hskDoneItems = Number(u.hskDoneItems) || 0;

      const vPct = Math.min(100, Math.round(((vLearned + vIgnored) / TOTAL_VOCAB) * 100));
      const gPct = Math.min(100, Math.round((gDone / TOTAL_GRAMMAR) * 100));
      const st = inspectProgress ? progressStats(inspectProgress) : null;
      const oPct = st ? st.overallPct : (u.overallPct || Math.round(vPct * 0.7 + gPct * 0.3));

      return `
        <div class="s4-stat-box" style="margin-bottom:14px;border:1.5px solid #2563eb;background:var(--panel,#f8fafc);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
            <div style="display:flex;align-items:center;gap:10px;">
              ${renderAvatarHtml(u.avatar, 42)}
              <div>
                <div style="font-weight:800;font-size:15.5px;">${esc(u.displayName || u.username)} <span style="font-weight:600;color:#64748b;font-size:12.5px;">(@${esc(u.username)})</span></div>
                <div style="font-size:12px;color:#64748b;">Mục tiêu: Band ${esc(u.targetBand || "7.0")} • Đăng ký: ${esc(u.createdAt || "—")} • Online: <b>${fmtRelativeTime(u.lastActive)}</b></div>
              </div>
            </div>
            <button class="s4-mini" style="background:#64748b;" data-act="closeinspect">Đóng ✕</button>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:8px;margin-top:10px;">
            <div style="padding:8px 10px;background:rgba(37,99,235,0.08);border-radius:8px;">
              <div style="font-size:11px;color:#64748b;">Tổng hoàn thành</div>
              <div style="font-size:16px;font-weight:800;color:#2563eb;">${oPct}%</div>
            </div>
            <div style="padding:8px 10px;background:rgba(22,163,74,0.08);border-radius:8px;">
              <div style="font-size:11px;color:#64748b;">Từ vựng SRS</div>
              <div style="font-size:14.5px;font-weight:800;color:#16a34a;">${vLearned + vIgnored} / ${TOTAL_VOCAB}</div>
            </div>
            <div style="padding:8px 10px;background:rgba(13,148,136,0.08);border-radius:8px;">
              <div style="font-size:11px;color:#64748b;">Ngữ pháp</div>
              <div style="font-size:14.5px;font-weight:800;color:#0d9488;">${gDone} / ${TOTAL_GRAMMAR} bài</div>
            </div>
            <div style="padding:8px 10px;background:rgba(217,119,6,0.08);border-radius:8px;">
              <div style="font-size:11px;color:#64748b;">Listening</div>
              <div style="font-size:14.5px;font-weight:800;color:#d97706;">${lisDone} bài • ${lisWords} từ</div>
            </div>
            <div style="padding:8px 10px;background:rgba(124,58,237,0.08);border-radius:8px;">
              <div style="font-size:11px;color:#64748b;">Reading</div>
              <div style="font-size:14.5px;font-weight:800;color:#7c3aed;">${readDone} bài • ${readWords} từ</div>
            </div>
            <div style="padding:8px 10px;background:rgba(147,51,234,0.08);border-radius:8px;">
              <div style="font-size:11px;color:#64748b;">Writing</div>
              <div style="font-size:14.5px;font-weight:800;color:#9333ea;">${writingDone} / ${TOTAL_WRITING_LESSONS} bài</div>
            </div>
            <div style="padding:8px 10px;background:rgba(225,29,72,0.08);border-radius:8px;">
              <div style="font-size:11px;color:#64748b;">Speaking</div>
              <div style="font-size:14.5px;font-weight:800;color:#e11d48;">${speakingDone} bài • ${speakingWords} từ</div>
            </div>
            <div style="padding:8px 10px;background:rgba(225,29,72,0.08);border-radius:8px;">
              <div style="font-size:11px;color:#64748b;">TED Talks</div>
              <div style="font-size:14.5px;font-weight:800;color:#e11d48;">${tedDone} / ${TOTAL_TED_LESSONS} bài</div>
            </div>
            <div style="padding:8px 10px;background:rgba(185,28,28,0.08);border-radius:8px;">
              <div style="font-size:11px;color:#64748b;">HSK 1–6</div>
              <div style="font-size:14.5px;font-weight:800;color:#b91c1c;">${hskDoneItems} bài • ${hskWords} từ</div>
            </div>
          </div>
        </div>`;
    }

    function usersHtml() {
      const allUsers = Object.keys(users || {}).filter(k => users[k] && !users[k].deleted && (users[k].username || users[k].passwordHash || users[k].role)).map(k => users[k]);
      const totalCount = allUsers.length;
      const activeCount = allUsers.filter(u => u.status !== "blocked").length;
      const blockedCount = allUsers.filter(u => u.status === "blocked").length;
      const resetCount = Object.keys(resetRequests || {}).length;

      const q = userSearch.trim().toLowerCase();
      const filtered = allUsers.filter(u => {
        if (q && !(u.username.toLowerCase().includes(q) || String(u.displayName || "").toLowerCase().includes(q))) return false;
        if (userFilter === "active") return u.status !== "blocked";
        if (userFilter === "blocked") return u.status === "blocked";
        if (userFilter === "reset") return resetRequests && resetRequests[u.username];
        return true;
      }).sort((a, b) => String(b.lastActive || b.createdAt || "").localeCompare(String(a.lastActive || a.createdAt || "")));

      const rows = filtered.map(it => {
        const isAdm = it.username === "admin";
        const vLearned = Number(it.vocabLearned) || 0;
        const vIgnored = Number(it.vocabIgnored) || 0;
        const gDone = Number(it.grammarDone) || 0;
        const vPct = Math.min(100, Math.round(((vLearned + vIgnored) / TOTAL_VOCAB) * 100));
        const gPct = Math.min(100, Math.round((gDone / TOTAL_GRAMMAR) * 100));
        const oPct = Number(it.overallPct) || Math.min(100, Math.round(vPct * 0.7 + gPct * 0.3));
        const hasReset = resetRequests && resetRequests[it.username];

        return `<tr>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              ${renderAvatarHtml(it.avatar, 30)}
              <div>
                <b>${esc(it.displayName || it.username)}</b> <span style="color:#64748b;font-size:11.5px;">(@${esc(it.username)})</span>
                <div style="font-size:11px;color:#64748b;">${fmtRelativeTime(it.lastActive)} ${it.targetBand ? "• Band " + esc(it.targetBand) : ""}</div>
              </div>
            </div>
          </td>
          <td style="min-width:140px;">
            <div style="display:flex;justify-content:space-between;font-size:11.5px;font-weight:700;">
              <span>Tiến độ: <b style="color:#2563eb">${oPct}%</b></span>
              <span>🔥 ${it.streakDays || 0}N</span>
            </div>
            <div class="s4-prog-track" style="margin:3px 0 4px 0;"><div class="s4-prog-bar" style="width:${oPct}%;background:linear-gradient(90deg,#2563eb,#16a34a);"></div></div>
            <div style="font-size:10.5px;color:#64748b;">Từ: ${vLearned + vIgnored}/${TOTAL_VOCAB} • NP: ${gDone}/${TOTAL_GRAMMAR}</div>
          </td>
          <td>
            ${isAdm ? '<span class="s4-badge s4-badge-admin">Quản trị viên</span>' :
              it.status === "blocked" ? '<span class="s4-badge s4-badge-blocked">Đã khóa</span>' :
              hasReset ? `<span class="s4-badge s4-badge-warn" title="Tên khai báo xác minh: ${esc(hasReset.claimedDisplayName || hasReset.displayName || '')}">Yêu cầu đặt lại MK${hasReset.claimedDisplayName ? ` (${esc(hasReset.claimedDisplayName)})` : ""}</span>` :
              '<span class="s4-badge s4-badge-active">Hoạt động</span>'}
          </td>
          <td>
            <div style="display:flex;gap:4px;flex-wrap:wrap;">
              <button class="s4-mini" style="background:#2563eb;" data-act="inspect" data-v="${esc(it.username)}" title="Xem chi tiết tiến độ">Chi tiết</button>
              <button class="s4-mini" style="background:#0284c7;" data-act="resetpw" data-v="${esc(it.username)}" title="Đặt mật khẩu mới cho học viên">Đổi MK</button>
              ${isAdm ? "" : `
                <button class="s4-mini" style="background:${it.status === "blocked" ? "#16a34a" : "#dc2626"};" data-act="block" data-v="${esc(it.username)}">${it.status === "blocked" ? "Mở khóa" : "Khóa"}</button>
                <button class="s4-mini" style="background:#64748b;" data-act="deluser" data-v="${esc(it.username)}">Xóa</button>
              `}
            </div>
          </td>
        </tr>`;
      }).join("");

      return `
        <div class="s4-kpi-grid">
          <div class="s4-stat-box" style="text-align:center;padding:9px;">
            <div style="font-size:18px;font-weight:800;color:#2563eb;">${totalCount}</div>
            <div style="font-size:11px;color:#64748b;">Tổng tài khoản</div>
          </div>
          <div class="s4-stat-box" style="text-align:center;padding:9px;">
            <div style="font-size:18px;font-weight:800;color:#16a34a;">${activeCount}</div>
            <div style="font-size:11px;color:#64748b;">Đang hoạt động</div>
          </div>
          <div class="s4-stat-box" style="text-align:center;padding:9px;">
            <div style="font-size:18px;font-weight:800;color:#dc2626;">${blockedCount}</div>
            <div style="font-size:11px;color:#64748b;">Đã bị khóa</div>
          </div>
          <div class="s4-stat-box" style="text-align:center;padding:9px;">
            <div style="font-size:18px;font-weight:800;color:#d97706;">${resetCount}</div>
            <div style="font-size:11px;color:#64748b;">Yêu cầu đặt lại MK</div>
          </div>
        </div>

        ${inspectUser && users[inspectUser] ? inspectModalHtml(users[inspectUser]) : ""}

        <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
          <input class="s4-input" id="admSearchUser" placeholder="Tìm kiếm theo tên hoặc @username..." value="${esc(userSearch)}" style="flex:1;min-width:180px;margin:0;padding:8px 11px;">
          <select class="s4-input" id="admFilterUser" style="width:auto;margin:0;padding:8px 11px;">
            <option value="all" ${userFilter === "all" ? "selected" : ""}>Tất cả (${totalCount})</option>
            <option value="active" ${userFilter === "active" ? "selected" : ""}>Hoạt động</option>
            <option value="blocked" ${userFilter === "blocked" ? "selected" : ""}>Đã khóa (${blockedCount})</option>
            <option value="reset" ${userFilter === "reset" ? "selected" : ""}>Có yêu cầu đặt lại MK (${resetCount})</option>
          </select>
        </div>

        <div class="s4-table-wrap">
          <table class="s4-table">
            <thead><tr><th>Học viên</th><th>Tiến độ học</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>${rows || `<tr><td colspan="4" style="color:#64748b;text-align:center;padding:16px;">Không tìm thấy tài khoản phù hợp.</td></tr>`}</tbody>
          </table>
        </div>`;
    }

    function settingsHtml() {
      return `
        ${legacyFirebaseRulesActive ? `<div class="s4-err" style="line-height:1.5;">🔒 <b>Cảnh báo bảo mật Firebase Rules:</b> Hệ thống phát hiện Firebase Console vẫn đang dùng bộ Rules cũ (còn lưu <code>authProof</code> trên nhánh đọc công khai). Hãy dán tệp <code>firebase-database.rules.json</code> vào <b>Firebase Console ➔ Realtime Database ➔ Rules</b> rồi đổi mật khẩu Admin mới ngay bên dưới để khóa triệt để.</div>` : `<div class="s4-info" style="line-height:1.5;">🛡️ Chế độ ghi nguyên tử chống lộ <code>authProof</code> đã bật. Nhớ cập nhật tệp <code>firebase-database.rules.json</code> lên Firebase Console để bảo vệ tối đa QR Donate &amp; dữ liệu riêng tư.</div>`}
        <div style="font-weight:800;font-size:14.5px;color:#2563eb;margin-bottom:8px;">Cấu hình Thông tin QR Ủng hộ (Donate):</div>
        <div style="margin-bottom:8px;">
          <label style="font-size:12px;font-weight:700;">Thông điệp thiện nguyện (Hiển thị nổi bật trong popup Donate):</label>
          <textarea class="s4-input" id="admNote" rows="2" style="font-family:inherit;resize:vertical;">${esc(config.contactNote || "")}</textarea>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
          <div>
            <label style="font-size:12px;font-weight:700;">Mã Ngân hàng (MB, VCB, TCB, ACB...):</label>
            <input class="s4-input" id="admBankCode" value="${esc(config.bankCode || 'MB')}" placeholder="VD: MB, VCB, TCB...">
          </div>
          <div>
            <label style="font-size:12px;font-weight:700;">Số Tài Khoản nhận tiền:</label>
            <input class="s4-input" id="admBankAcc" value="${esc(config.bankAccount || '')}" placeholder="VD: 0988888888">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
          <div>
            <label style="font-size:12px;font-weight:700;">Tên Chủ Tài Khoản (viết hoa không dấu):</label>
            <input class="s4-input" id="admBankOwner" value="${esc(config.bankOwner || '')}" placeholder="VD: HOANG NGUYEN">
          </div>
          <div>
            <label style="font-size:12px;font-weight:700;">Nội dung chuyển khoản gợi ý:</label>
            <input class="s4-input" id="admTransferMemo" value="${esc(config.transferMemo || 'UNG HO LINGUAPATH')}" placeholder="VD: UNG HO LINGUAPATH">
          </div>
        </div>

        <div style="height:1px;background:#e2e8f0;margin:14px 0;"></div>
        <div style="font-weight:800;font-size:14px;color:#0f172a;margin-bottom:8px;">Đổi mật khẩu Quản trị viên (Admin):</div>
        <div style="margin-bottom:12px;">
          <div class="s4-pass-wrap">
            <input class="s4-input" id="admNewPass" type="password" placeholder="Nhập mật khẩu Admin mới (tối thiểu 6 ký tự, để trống nếu không đổi)" autocomplete="new-password">
            <button type="button" class="s4-pass-toggle" title="Hiện/Ẩn mật khẩu">${uiIcon("eye", 15, "👁️")}</button>
          </div>
        </div>

        <button class="s4-btn" data-act="savecfg">Lưu Toàn Bộ Cài Đặt</button>`;
    }

    function render() {
      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${getLogoPath()}" alt="Logo" style="width:30px;height:30px;border-radius:8px;">
            <h3 style="margin:0;font-size:17.5px;">Quản Trị Hệ Thống</h3>
          </div>
          <button class="s4-top-btn" style="color:inherit;padding:6px 8px;" data-act="close">${uiIcon("close", 15, "✕")}</button>
        </div>
        <div class="s4-tabs">
          <button class="s4-tab ${tab === "users" ? "active" : ""}" data-act="tab" data-v="users">${uiIcon("user", 14, "👥")} Quản lý học viên</button>
          <button class="s4-tab ${tab === "settings" ? "active" : ""}" data-act="tab" data-v="settings">${uiIcon("settings", 14, "⚙️")} Cài đặt &amp; QR Donate</button>
        </div>
        ${msg ? `<div class="s4-err" style="display:flex;align-items:center;gap:6px;">${uiIcon("alert", 15, "⚠️")} <span>${esc(msg)}</span></div>` : ""}
        ${loading ? `<div style="padding:20px;text-align:center;color:#64748b;">Đang tải dữ liệu từ máy chủ...</div>`
          : tab === "users" ? (users ? usersHtml() : "") : settingsHtml()}
      `;

      setupPassToggles(box);

      const sInp = box.querySelector("#admSearchUser");
      if (sInp) {
        sInp.oninput = () => {
          userSearch = sInp.value;
          const pos = sInp.selectionStart;
          clearTimeout(searchTimer);
          searchTimer = setTimeout(() => {
            const curInp = box.querySelector("#admSearchUser");
            const curPos = curInp ? curInp.selectionStart : pos;
            render();
            const nextInp = box.querySelector("#admSearchUser");
            if (nextInp) {
              try { nextInp.focus({ preventScroll: true }); nextInp.setSelectionRange(curPos, curPos); } catch (e) {}
            }
          }, 150);
        };
      }
      const fSel = box.querySelector("#admFilterUser");
      if (fSel) {
        fSel.onchange = () => { userFilter = fSel.value; render(); };
      }
    }

    async function guard(fn) {
      try { await fn(); msg = ""; } catch (e) { msg = "Thao tác thất bại: " + (e && e.message ? e.message : "lỗi mạng"); render(); return false; }
      return true;
    }

    box.addEventListener("click", async ev => {
      const el = ev.target.closest("[data-act]");
      if (!el) return;
      const act = el.dataset.act, v = el.dataset.v;
      if (act === "close") return closeModals();
      if (act === "tab") { tab = v; return load(); }

      if (act === "inspect") {
        inspectUser = v;
        inspectProgress = null;
        render();
        try {
          const p = await db("study4_progress/" + v);
          if (p && p.data) {
            inspectProgress = p.data;
            const st = progressStats(p.data);
            Object.assign(users[v], {
              vocabLearned: st.vocabLearned, vocabIgnored: st.vocabIgnored, vocabMastered: st.vocabMastered, vocabDue: st.vocabDue,
              grammarDone: st.grammarDone, listeningDone: st.listeningDone, listeningWords: st.listeningWords,
              readingDone: st.readingDone, readingWords: st.readingWords, writingDone: st.writingDone,
              speakingDone: st.speakingDone, speakingWords: st.speakingWords, tedDone: st.tedDone,
              hskWords: st.hskWords, hskDoneItems: st.hskDoneItems,
              overallPct: st.overallPct, streakDays: st.streakDays, totalStudyDays: st.totalStudyDays
            });
            render();
          }
        } catch (e) {}
        return;
      }
      if (act === "closeinspect") { inspectUser = null; inspectProgress = null; return render(); }

      if (act === "block") {
        const nx = users[v].status === "blocked" ? "active" : "blocked";
        if (await guard(async () => {
          await dbSecureWrite("admin", "study4_users/" + v, { status: nx }, (session && session.ph) || "");
          users[v].status = nx;
        })) render();
        return;
      }

      if (act === "resetpw") {
        const np = (window.S4UI && typeof window.S4UI.prompt === "function")
          ? await window.S4UI.prompt("Nhập mật khẩu MỚI cho tài khoản \"" + v + "\" (từ 6 ký tự):", "", {
              title: "Đặt lại mật khẩu",
              placeholder: "Ít nhất 6 ký tự...",
              confirmText: "Đặt lại"
            })
          : prompt("Nhập mật khẩu MỚI cho tài khoản \"" + v + "\" (từ 6 ký tự):");
        if (!np) return;
        if (np.length < 6) { msg = "Mật khẩu phải từ 6 ký tự."; return render(); }
        if (await guard(async () => {
          const ph = await hashPw(v, np);
          const adminProof = (session && session.ph) || ph;
          const migrated = await syncAuthSecret(v, ph, adminProof);
          if (!migrated) {
            await db("study4_users/" + v, "PATCH", { passwordHash: ph, authProof: adminProof });
          }
          await dbSecureWrite("admin", "study4_reset_requests/" + v, null, adminProof, { delete: true }).catch(() => {});
          if (resetRequests) delete resetRequests[v];
          if (session && session.username === v) { session.ph = ph; saveSession(); if (cache[v]) { cache[v].passwordHash = ph; saveCache(); } }
        })) {
          msg = "";
          if (window.S4UI) {
            await window.S4UI.alert("Đã đặt lại mật khẩu cho @" + v + " thành công!", { title: "Thành công", tone: "success" });
          } else {
            alert("Đã đặt lại mật khẩu cho @" + v + " thành công!");
          }
          render();
        }
        return;
      }

      if (act === "deluser") {
        const okDel = (window.S4UI && typeof window.S4UI.confirm === "function")
          ? await window.S4UI.confirm("Xóa tài khoản " + v + " và toàn bộ tiến độ học của họ?", {
              title: "Xóa tài khoản",
              tone: "danger",
              confirmText: "Xóa tài khoản"
            })
          : confirm("Xóa tài khoản " + v + " và toàn bộ tiến độ học của họ?");
        if (!okDel) return;
        if (await guard(async () => {
          const adminProof = (session && session.ph) || "";
          await db("study4_auth/" + v, "PUT", { passwordHash: "DELETED_" + Date.now(), prevPh: adminProof, updatedAt: Date.now() }).catch(() => {});
          try {
            await dbSecureWrite("admin", "study4_users/" + v, null, adminProof, { delete: true });
          } catch (e) {
            await dbSecureWrite("admin", "study4_users/" + v, { username: v, deleted: true, status: "blocked", role: "basic" }, adminProof, { replace: true });
          }
          await dbSecureWrite("admin", "study4_progress/" + v, null, adminProof, { delete: true }).catch(() => {});
          await dbSecureWrite("admin", "study4_reset_requests/" + v, null, adminProof, { delete: true }).catch(() => {});
          delete users[v];
          if (resetRequests) delete resetRequests[v];
          if (inspectUser === v) inspectUser = null;
        })) render();
        return;
      }

      if (act === "savecfg") {
        const note = box.querySelector("#admNote").value.trim() || DEFAULT_CONFIG.contactNote;
        const bCode = (box.querySelector("#admBankCode") ? box.querySelector("#admBankCode").value.trim() : config.bankCode) || "MB";
        const bAcc = (box.querySelector("#admBankAcc") ? box.querySelector("#admBankAcc").value.trim() : config.bankAccount) || "0988888888";
        const bOwner = (box.querySelector("#admBankOwner") ? box.querySelector("#admBankOwner").value.trim().toUpperCase() : config.bankOwner) || "HOANG NGUYEN";
        const memo = (box.querySelector("#admTransferMemo") ? box.querySelector("#admTransferMemo").value.trim() : config.transferMemo) || "UNG HO LINGUAPATH";
        const np = box.querySelector("#admNewPass").value;

        if (np && np.length < 6) { msg = "Mật khẩu Admin mới phải từ 6 ký tự."; return render(); }

        if (await guard(async () => {
          config.contactNote = note;
          config.bankCode = bCode;
          config.bankAccount = bAcc;
          config.bankOwner = bOwner;
          config.transferMemo = memo;
          saveConfig();
          await pushConfig();

          if (np) {
            const oldAdminProof = (session && session.ph) || "";
            const ph = await hashPw("admin", np);
            const migrated = await syncAuthSecret("admin", ph, oldAdminProof || ph);
            if (!migrated) {
              await db("study4_users/admin", "PATCH", { passwordHash: ph, authProof: oldAdminProof || ph });
            }
            session.ph = ph;
            saveSession();
            if (cache.admin) { cache.admin.passwordHash = ph; saveCache(); }
          }
        })) {
          if (window.S4UI) {
            await window.S4UI.alert("Đã lưu cấu hình hệ thống & thông tin QR Donate thành công!", { title: "Đã lưu cấu hình", tone: "success" });
          } else {
            alert("Đã lưu cấu hình hệ thống & thông tin QR Donate thành công!");
          }
          render();
        }
        return;
      }
    });

    load();
  }
/* ---------- Cài app ---------- */
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredPrompt = e; });

  function openInstallModal() {
    const { box } = newModal();
    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="${getLogoPath()}" alt="Logo" style="width:32px;height:32px;border-radius:9px;">
          <h3 style="margin:0;font-size:17px;display:flex;align-items:center;gap:6px;">${uiIcon("smartphone", 17, "📲")} Cài App vào Màn hình chính</h3>
        </div>
        <button class="s4-top-btn" style="color:inherit;padding:6px 8px;" id="s4Close">${uiIcon("close", 15, "✕")}</button>
      </div>
      <div style="margin-top:12px;font-size:13.5px;line-height:1.55;display:flex;flex-direction:column;gap:10px;">
        <div style="background:rgba(37,99,235,0.08);border:1px solid rgba(37,99,235,0.18);padding:11px 13px;border-radius:12px;">
          <b>iPhone / iPad (iOS — Safari):</b><br>
          1. Mở trang bằng <b>Safari</b> → bấm <b>Chia sẻ</b>.<br>
          2. Chọn <b>"Thêm vào Màn hình chính"</b> → <b>Thêm</b>.
        </div>
        <div style="background:rgba(22,163,74,0.08);border:1px solid rgba(22,163,74,0.18);padding:11px 13px;border-radius:12px;">
          <b>Android (Chrome):</b><br>
          1. Mở trang bằng <b>Chrome</b> → bấm menu <b>⋮</b>.<br>
          2. Chọn <b>"Thêm vào màn hình chính"</b> / <b>"Cài đặt ứng dụng"</b>.
          ${deferredPrompt ? `<button class="s4-btn" style="background:#16a34a;margin-top:10px;" id="btnNativeInstall">${uiIcon("zap", 15, "⚡")} Cài đặt App ngay (1 chạm)</button>` : ""}
        </div>
      </div>`;
    box.querySelector("#s4Close").onclick = closeModals;
    const btn = box.querySelector("#btnNativeInstall");
    if (btn && deferredPrompt) btn.onclick = () => { deferredPrompt.prompt(); deferredPrompt = null; closeModals(); };
  }

  /* ---------- Phân quyền nội dung (Mở khóa 100% miễn phí) ---------- */
  function canAccessVocabTopic() { return true; }
  function canAccessGrammarSection() { return true; }

  async function logout() {
    const cur = session;
    if (cur) {
      let pushed = false;
      clearTimeout(pushTimer);
      try { pushed = await pushProgress(); } catch (e) {}
      if (!pushed) { try { rawSet("s4_auth_profile_" + cur.username, JSON.stringify(readProgress())); } catch (e) {} }
      else {
        rawRemove("s4_auth_sync_" + cur.username);
        rawRemove("s4_auth_tombs_" + cur.username);
      }
      hookSuspended = true;
      clearLocalProgressKeys();
      hookSuspended = false;
    }
    HTML_CACHE_KEYS.forEach(k => rawRemove(k));
    pendingOverwriteMem = null;
    session = null;
    saveSession();
    location.reload();
  }

  window.S4Auth = {
    getCurrentUser, isFullAccess, isAdmin, daysRemaining,
    canAccessVocabTopic, canAccessGrammarSection,
    openLoginModal, openProfileModal, openDonateModal, openAdminModal, openInstallModal, closeModals,
    logout, syncNow: () => syncProgress(false),
    mergeProgress: mergeProgress,
    allowOverwriteOnce: allowOverwriteOnce
  };

  /* ---------- Khởi động (Không chặn hiển thị bởi mạng) ---------- */
  async function boot() {
    try {
      if (!isHomePage()) {
        document.documentElement.lang = 'en';
      }
    } catch (e) {}

    // Vẽ thanh tài khoản & kiểm tra thông báo bản quyền NGAY LẬP TỨC (0ms chờ mạng)
    renderTopBar();
    setTimeout(checkFirstTimeCommunityDisclaimer, 250);

    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      const swPath = resolveFromRoot("sw.js", isHomePage() ? "./sw.js" : "../sw.js");
      navigator.serviceWorker.register(swPath).then(reg => reg.update()).catch(() => {});
    }

    // Tải cấu hình QR Donate ngầm ở nền, không làm đứng trang 4 giây hay reload bất ngờ
    fetchConfig().then(changed => {
      if (changed) renderTopBar();
    }).catch(() => {});

    if (session) {
      refreshSession().catch(() => {});
      syncProgress(false).catch(() => {});
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (!session) return;
    if (document.visibilityState === "hidden") {
      const s = getSync(session.username);
      if (s && s.dirty) pushProgress({ keepalive: true }).catch(() => {});
    } else {
      syncProgress(false).catch(() => {});
    }
  });
  window.addEventListener("pagehide", () => {
    if (!session) return;
    const s = getSync(session.username);
    if (s && s.dirty) pushProgress({ keepalive: true }).catch(() => {});
  });
  window.addEventListener("online", () => {
    if (!session) return;
    const s = getSync(session.username);
    if (s && s.dirty) pushProgress().catch(() => {});
  });

  
    
  /* =========================================================================
   * THÔNG BÁO TÔN TRỌNG BẢN QUYỀN & SỨ MỆNH CHIA SẺ PHI LỢI NHUẬN
   * Hiển thị 1 lần duy nhất khi người học vào web lần đầu tiên
   * ========================================================================= */
  const K_DISCLAIMER_ACK = "linguapath_disclaimer_v2";

  function checkFirstTimeCommunityDisclaimer() {
    try {
      if (localStorage.getItem(K_DISCLAIMER_ACK) === "1") return;
    } catch (e) {
      return;
    }

    if (document.getElementById("lpDisclaimerModal")) return;
    injectStyles();

    const modal = document.createElement("div");
    modal.id = "lpDisclaimerModal";
    modal.style.cssText = "display:flex;align-items:center;justify-content:center;z-index:2147483647;position:fixed;inset:0;background:rgba(15,23,42,0.74);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:16px;box-sizing:border-box;";
    modal.innerHTML = `
      <div class="s4-disc-dialog" role="dialog" aria-modal="true" style="max-width:500px;width:100%;max-height:90vh;overflow-y:auto;border-radius:22px;box-shadow:0 24px 60px rgba(0,0,0,0.45);animation:s4ModalIn 0.24s cubic-bezier(0.16,1,0.3,1);font-family:inherit;box-sizing:border-box;">
        <div style="padding:18px 20px 12px;background:linear-gradient(135deg, rgba(16,185,129,0.14), rgba(245,158,11,0.1));border-bottom:1px solid var(--border, rgba(148,163,184,0.22));display:flex;align-items:center;gap:12px;">
          <div style="width:40px;height:40px;border-radius:12px;background:var(--primary, #10b981);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 14px rgba(16,185,129,0.35);">
            ${uiIcon("leaf", 20, "🌿")}
          </div>
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <h2 style="margin:0;font-size:17px;font-weight:800;letter-spacing:-0.01em;">LinguaPath</h2>
              <span class="s4-disc-badge" style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;">Free for Community</span>
            </div>
            <p style="margin:2px 0 0;font-size:12px;color:var(--muted, #64748b);font-weight:600;">Thông báo Bản quyền &amp; Sứ mệnh Phi lợi nhuận</p>
          </div>
        </div>
        
        <div class="s4-disc-body" style="padding:16px 20px;font-size:13.5px;line-height:1.58;">
          <div style="padding:13px 15px;border-radius:14px;background:var(--lg-wash, rgba(16,185,129,0.08));border:1px solid var(--lg-hairline, rgba(16,185,129,0.25));">
            <ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:8px;">
              <li><strong>Sứ mệnh phi lợi nhuận:</strong> Hỗ trợ cộng đồng luyện thi máy tính miễn phí mọi lúc, mọi nơi.</li>
              <li><strong>Nguồn gốc tài liệu:</strong> Tham khảo và biên soạn dựa trên các khóa <strong>IELTS Fundamentals</strong> &amp; <strong>IELTS 4 Kỹ Năng</strong> của <strong>STUDY4</strong>.</li>
              <li><strong>Tôn trọng tác giả:</strong> Khuyến khích đăng ký khóa học chính thức tại <a href="https://study4.com" target="_blank" rel="noopener" class="s4-disc-link">study4.com</a> để trải nghiệm trọn vẹn dữ liệu gốc và giảng viên chấm bài.</li>
            </ul>
          </div>
        </div>
        
        <div class="s4-disc-foot" style="padding:12px 20px 16px;display:flex;align-items:center;justify-content:flex-end;gap:12px;">
          <button type="button" id="lpDisclaimerBtn" style="display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:12px;background:linear-gradient(135deg, #10b981, #059669);color:#ffffff;border:none;font-size:13.5px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(16,185,129,0.35);transition:all 0.15s ease;">
            ${uiIcon("check", 15, "🚀")} Tôi đã hiểu &amp; Bắt đầu học
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const btn = document.getElementById("lpDisclaimerBtn");
    if (btn) {
      const releaseFocus = window.S4UI?.keepDialogFocus(modal.querySelector('[role="dialog"]'), btn);
      btn.onclick = () => {
        if (releaseFocus) releaseFocus();
        try { localStorage.setItem(K_DISCLAIMER_ACK, "1"); } catch (e) {}
        modal.style.opacity = "0";
        modal.style.transition = "opacity 0.2s ease";
        setTimeout(() => modal.remove(), 210);
      };
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
