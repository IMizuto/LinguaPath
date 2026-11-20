/* LinguaPath - Hệ thống tài khoản, Hồ sơ cá nhân & Quản trị viên
 * - Tài khoản, hồ sơ cá nhân (Avatar, Tên, Mục tiêu Band, Mật khẩu) và tiến độ học đều đồng bộ qua Firebase Realtime Database.
 * - Hỗ trợ học Offline: dữ liệu lưu cục bộ và tự động đồng bộ lên Cloud khi có mạng.
 */
(function () {
  "use strict";

  const DB = "https://study4-app-default-rtdb.firebaseio.com";
  const K = { cfg: "s4_auth_config_v2", session: "s4_auth_session_v2", cache: "s4_auth_cache_v2" };
  const P_SRS = "s4_vocab_srs_v1", P_DAYS = "s4_vocab_days_v2", P_SET = "s4_vocab_settings_v2", P_VSES = "s4_vocab_active_session_v2";
  const VOCAB_SCOPE_KEYS = [P_SRS, P_DAYS, P_SET, P_VSES];
  const P_GDONE = "s4_grammar_done", P_GLAST = "s4_grammar_last";
  const P_LDONE = "s4_listening_done", P_LLAST = "s4_listening_last_v2", P_LSRS = "s4_listening_srs_v1", P_LDAYS = "s4_listening_days_v1", P_LSET = "s4_listening_settings_v1", P_LSES = "s4_listening_vocab_session_v1", P_LPOS = "s4_listening_lesson_pos_v1", P_LNOTES = "s4_listening_notes_v1", P_LUNIT = "s4_listen_last_by_unit", P_LSUBS = "lp_listening_submissions_v1", P_LPZANS = "s4_pz_listen_answers_v1";
  const P_RDONE = "s4_reading_done", P_RLAST = "s4_reading_last_v2", P_RSRS = "s4_reading_srs_v1", P_RDAYS = "s4_reading_days_v1", P_RSET = "s4_reading_settings_v1", P_RSES = "s4_reading_vocab_session_v1", P_RUNIT = "s4_read_last_by_unit", P_RSUBS = "lp_reading_submissions_v1", P_RPZANS = "s4_pz_read_answers_v1";
  const P_PZFLAGS = "s4_pz_review_flags_v1";
  const P_WDONE = "s4_writing_done", P_WLAST = "s4_writing_last_v1", P_WESSAYS = "s4_writing_essays_v1", P_WSUBS = "lp_submissions_history";
  const P_SDONE = "lp_speaking_done_v1", P_SLAST = "lp_speaking_last_v1", P_SNOTES = "lp_speaking_notes_v1", P_SSUBS = "lp_speaking_submissions_v1", P_SPREFS = "lp_speaking_prefs_v1";
  const P_SSRS = "lp_speaking_vocab_srs_v1", P_SDAYS = "lp_speaking_vocab_days_v1", P_SSET = "lp_speaking_vocab_settings_v1", P_SSES = "lp_speaking_vocab_session_v1";
  const P_TDONE = "s4_ted_done", P_TLAST = "s4_ted_last", P_TPOS = "s4_ted_pos", P_TSUBVI = "s4_ted_show_vi";
  const PROGRESS_KEYS = [
    P_SRS, P_DAYS, P_SET, P_VSES,
    P_GDONE, P_GLAST,
    P_LDONE, P_LLAST, P_LSRS, P_LDAYS, P_LSET, P_LSES, P_LPOS, P_LNOTES, P_LUNIT, P_LSUBS, P_LPZANS,
    P_RDONE, P_RLAST, P_RSRS, P_RDAYS, P_RSET, P_RSES, P_RUNIT, P_RSUBS, P_RPZANS,
    P_PZFLAGS,
    P_WDONE, P_WLAST, P_WESSAYS, P_WSUBS,
    P_SDONE, P_SLAST, P_SNOTES, P_SSUBS, P_SPREFS, P_SSRS, P_SDAYS, P_SSET, P_SSES,
    P_TDONE, P_TLAST, P_TPOS, P_TSUBVI
  ];
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

  const isHomePage = () => {
    const p = (location.pathname || '').replace(/\\/g, '/');
    const subdirs = ['/vocab/', '/grammar/', '/reading/', '/listening/', '/tedtalks/', '/writing/', '/speaking/'];
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
  async function hashPw(username, pw) {
    const s = "s4|" + username + "|" + pw;
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }
    return "L" + simpleHash(s);
  }

  /* ---------- Firebase REST & Xác thực Chữ ký Bảo mật (authProof) ---------- */
  async function db(path, method, body, opts) {
    opts = opts || {};
    const ctl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = setTimeout(() => ctl && ctl.abort(), opts.timeout || 12000);
    try {
      const init = { method: method || "GET" };
      if (body !== undefined) { init.headers = { "Content-Type": "application/json" }; init.body = JSON.stringify(body); }
      if (ctl) init.signal = ctl.signal;
      if (opts.keepalive) init.keepalive = true;
      const res = await fetch(`${DB}/${path}.json`, init);
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } finally { clearTimeout(timer); }
  }

  // Lưu mã băm mật khẩu sang nhánh bảo mật riêng (study4_auth/$username có .read: false)
  // và tự động gỡ passwordHash khỏi nhánh hồ sơ công khai study4_users/$username khi Rules mới đã bật.
  async function syncAuthSecret(uname, newPh, proofPh) {
    if (!uname || !newPh) return false;
    try {
      await db(`study4_auth/${uname}`, "PUT", {
        passwordHash: newPh,
        prevPh: proofPh || newPh,
        updatedAt: Date.now()
      });
      db(`study4_users/${uname}`, "PATCH", {
        passwordHash: null,
        authProof: newPh
      }).catch(() => {});
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
      const msg = String((e && e.message) || "");
      if (msg.includes("HTTP 401") || msg.includes("HTTP 403")) return false;
      throw e;
    }
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
    return m;
  }
  let hookSuspended = false;
  function writeProgress(map) {
    hookSuspended = true;
    try {
      PROGRESS_KEYS.forEach(k => { if (map[k] !== undefined && map[k] !== null) rawSet(k, map[k]); else rawRemove(k); });
    } finally { hookSuspended = false; }
  }
  function parseJ(s, fb) { try { const o = JSON.parse(s); return o && typeof o === "object" ? o : fb; } catch (e) { return fb; } }
  function canon(v) {
    if (Array.isArray(v)) return "[" + v.map(canon).join(",") + "]";
    if (v && typeof v === "object") return "{" + Object.keys(v).sort().map(k => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}";
    return JSON.stringify(v);
  }
  function sameProgress(a, b) {
    return PROGRESS_KEYS.every(k => {
      const x = a[k], y = b[k];
      if (x === undefined || y === undefined) return x === y;
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
  function mergeDoneListOrMap(aStr, bStr, asArray) {
    const toIds = raw => {
      const parsed = parseJ(raw, asArray ? [] : {});
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      if (parsed && typeof parsed === "object") return Object.keys(parsed).filter(k => parsed[k]);
      return [];
    };
    const mergedIds = Array.from(new Set(toIds(aStr).concat(toIds(bStr))));
    if (asArray) return JSON.stringify(mergedIds);
    const outObj = {};
    mergedIds.forEach(id => { outObj[id] = true; });
    return JSON.stringify(outObj);
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
  function mergeSubmissionHistory(aStr, bStr, maxKeep) {
    const a = parseJ(aStr, []), b = parseJ(bStr, []);
    const map = {};
    [].concat(Array.isArray(a) ? a : [], Array.isArray(b) ? b : []).forEach(it => {
      if (!it || typeof it !== "object" || !it.id) return;
      const prev = map[it.id];
      if (!prev || submissionStamp(it) >= submissionStamp(prev)) map[it.id] = it;
    });
    const list = Object.values(map).sort((x, y) => submissionStamp(y) - submissionStamp(x));
    return JSON.stringify(list.slice(0, maxKeep || 80));
  }
  /**
   * Merge per-lesson text notes so non-empty local notes override empty remote entries.
   */
  function mergeNotesMap(localStr, remoteStr) {
    const rNotes = parseJ(remoteStr, {}), lNotes = parseJ(localStr, {});
    const out = Object.assign({}, rNotes);
    Object.keys(lNotes).forEach(id => {
      if (lNotes[id] || out[id] === undefined) out[id] = lNotes[id];
    });
    return JSON.stringify(out);
  }
  /**
   * Merge two key-value maps (answers, flags, prefs) preserving non-empty local entries on conflict.
   */
  function mergeKeyMap(localStr, remoteStr) {
    const r = parseJ(remoteStr, {}), l = parseJ(localStr, {});
    const out = Object.assign({}, r);
    Object.keys(l).forEach(k => {
      if (l[k] !== undefined && (l[k] !== "" || out[k] === undefined)) out[k] = l[k];
    });
    return JSON.stringify(out);
  }
  function mergeProgress(local, remote, sync, rts) {
    const out = {};
    const preferLocalScalar = Boolean(sync && sync.dirty && Number(sync.localTs || 0) >= Number(rts || 0));
    // 1. SRS Maps (Vocab, Listening, Reading, Speaking)
    [P_SRS, P_LSRS, P_RSRS, P_SSRS].forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) out[k] = mergeSrsMap(local[k], remote[k]);
    });
    // 2. Study Days Maps (Vocab, Listening, Reading, Speaking)
    [P_DAYS, P_LDAYS, P_RDAYS, P_SDAYS].forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) out[k] = mergeDaysMap(local[k], remote[k]);
    });
    // 3. Done Maps / Lists (Grammar & TED as Object maps; Listening, Reading, Writing & Speaking as Arrays)
    [P_GDONE, P_TDONE].forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) out[k] = mergeDoneListOrMap(local[k], remote[k], false);
    });
    [P_LDONE, P_RDONE, P_WDONE, P_SDONE].forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) out[k] = mergeDoneListOrMap(local[k], remote[k], true);
    });
    if (local[P_WESSAYS] !== undefined || remote[P_WESSAYS] !== undefined) {
      out[P_WESSAYS] = mergeKeyMap(local[P_WESSAYS], remote[P_WESSAYS]);
    }
    [P_SNOTES, P_LNOTES].forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) out[k] = mergeNotesMap(local[k], remote[k]);
    });
    [P_SPREFS, P_RPZANS, P_LPZANS, P_PZFLAGS, P_LUNIT, P_RUNIT].forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) out[k] = mergeKeyMap(local[k], remote[k]);
    });
    [P_SSUBS, P_WSUBS, P_RSUBS, P_LSUBS].forEach(k => {
      if (local[k] !== undefined || remote[k] !== undefined) out[k] = mergeSubmissionHistory(local[k], remote[k], 80);
    });
    // 4. TED Subtitle Position Map (keep max subtitle index per video)
    if (local[P_TPOS] !== undefined || remote[P_TPOS] !== undefined) {
      const a = parseJ(local[P_TPOS], {}), b = parseJ(remote[P_TPOS], {});
      const m = Object.assign({}, a);
      Object.keys(b).forEach(id => { m[id] = Math.max(Number(a[id]) || 0, Number(b[id]) || 0); });
      out[P_TPOS] = JSON.stringify(m);
    }
    // 5. Last Lesson & Settings keys
    [P_GLAST, P_SET, P_LLAST, P_LSET, P_RLAST, P_RSET, P_WLAST, P_SLAST, P_SSET, P_TLAST, P_TSUBVI].forEach(k => {
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
    [[P_LSES, P_LSRS], [P_RSES, P_RSRS], [P_SSES, P_SSRS]].forEach(([k, srsKey]) => {
      if (local[k] !== undefined || remote[k] !== undefined) {
        const mergedEses = mergeEngineSessionStore(local[k], remote[k], out[srsKey], preferLocalScalar);
        if (mergedEses !== undefined) out[k] = mergedEses;
      }
    });
    if (local[P_LPOS] !== undefined || remote[P_LPOS] !== undefined) {
      out[P_LPOS] = mergeLessonPosMap(local[P_LPOS], remote[P_LPOS]);
    }
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
    return ids.filter(id => /^writing_u[1-5]_\d+$/.test(String(id)) || /^writing_pz_[1-3]$/.test(String(id))).length;
  }

  function countSrsEntries(raw) {
    const srs = parseJ(raw, {});
    const now = Date.now();
    let learned = 0, ignored = 0, mastered = 0, due = 0;
    Object.keys(srs).forEach(k => {
      const st = srs[k];
      if (!st || typeof st !== "object") return;
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
    const srs = parseJ(map[P_SRS], {});
    const now = Date.now();
    let vocabLearned = 0, vocabIgnored = 0, vocabMastered = 0, vocabDue = 0;
    Object.keys(srs).forEach(k => {
      if (!/^w_\d+$/.test(k) || !srs[k] || typeof srs[k] !== "object") return;
      const st = srs[k];
      if (st.ignored) { vocabIgnored++; return; }
      vocabLearned++;
      if (now >= Number(st.due || 0)) vocabDue++;
      else if (Number(st.interval || 0) >= 7) vocabMastered++;
    });

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

    const totalWordsAll = vocabLearned + vocabIgnored + listeningWords + readingWords + speakingWords;
    const totalLessonsAll = grammarDone + listeningDone + readingDone + writingDone + speakingDone + tedDone;
    const totalDueAll = vocabDue + lisSrsStat.due + readSrsStat.due + speakSrsStat.due;

    const vocabPct = Math.min(100, Math.round(((vocabLearned + vocabIgnored) / TOTAL_VOCAB) * 100));
    const grammarPct = Math.min(100, Math.round((grammarDone / TOTAL_GRAMMAR) * 100));
    const overallPct = Math.min(100, Math.round(
      ((totalWordsAll + totalLessonsAll) / (TOTAL_VOCAB + TOTAL_LISTENING_VOCAB + TOTAL_READING_VOCAB + TOTAL_SPEAKING_VOCAB + TOTAL_GRAMMAR + TOTAL_LISTENING_LESSONS + TOTAL_READING_LESSONS + TOTAL_WRITING_LESSONS + TOTAL_SPEAKING_LESSONS + TOTAL_TED_LESSONS)) * 100
    ));

    // Merge study days across Vocab, Listening, Reading, Speaking for accurate streak
    const daysV = parseJ(map[P_DAYS], {});
    const daysL = parseJ(map[P_LDAYS], {});
    const daysR = parseJ(map[P_RDAYS], {});
    const daysS = parseJ(map[P_SDAYS], {});
    const days = {};
    new Set(Object.keys(daysV).concat(Object.keys(daysL), Object.keys(daysR), Object.keys(daysS))).forEach(d => {
      days[d] = Array.from(new Set([].concat(
        Array.isArray(daysV[d]) ? daysV[d] : [],
        Array.isArray(daysL[d]) ? daysL[d] : [],
        Array.isArray(daysR[d]) ? daysR[d] : [],
        Array.isArray(daysS[d]) ? daysS[d] : []
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
      totalWordsAll: st.totalWordsAll,
      totalLessonsAll: st.totalLessonsAll,
      overallPct: st.overallPct,
      streakDays: st.streakDays,
      totalStudyDays: st.totalStudyDays,
      lastActive: new Date().toISOString()
    };
  }
  function hasProgress(map) {
    const s = progressStats(map);
    return s.totalWordsAll > 0 || s.totalLessonsAll > 0 || !!(map && (map[P_VSES] || map[P_LSES] || map[P_RSES] || map[P_LPOS]));
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
    _setItem.call(this, k, v);
    if (!hookSuspended && this === localStorage && PROGRESS_KEYS.indexOf(k) >= 0) onProgressChanged();
  };
  Storage.prototype.removeItem = function (k) {
    _removeItem.call(this, k);
    if (!hookSuspended && this === localStorage && PROGRESS_KEYS.indexOf(k) >= 0) onProgressChanged();
  };

  async function pushProgress(opts) {
    if (!session) return false;
    const uname = session.username;
    const mark = changeCounter;
    const ts = Date.now();
    let data = readProgress();
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

    try {
      const remote = await db(`study4_progress/${uname}`);
      remoteReadOk = true;
      const rdata = (remote && remote.data) || {};
      const rResetAt = Number((remote && remote.resetAt) || 0);
      const rVocabResetAt = Number((remote && remote.vocabResetAt) || 0);

      if (ow && ow.scope === "all") {
        nextResetAt = Math.max(ts, rResetAt + 1);
        nextVocabResetAt = Math.max(ts, rVocabResetAt + 1);
      } else if (ow && ow.scope === "vocab") {
        if (hasProgress(rdata)) {
          const rNonVocab = Object.assign({}, rdata);
          VOCAB_SCOPE_KEYS.forEach(k => delete rNonVocab[k]);
          const merged = mergeProgress(data, rNonVocab, { dirty: true, localTs: ts }, (remote && remote.updatedAt) || 0);
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
        nextResetAt = rResetAt;
        nextVocabResetAt = Math.max(nextVocabResetAt, rVocabResetAt);
      } else if (rawSync && remote && rVocabResetAt > nextVocabResetAt) {
        const lWithoutVocab = Object.assign({}, data);
        VOCAB_SCOPE_KEYS.forEach(k => delete lWithoutVocab[k]);
        const merged = mergeProgress(lWithoutVocab, rdata, { dirty: true, localTs: ts }, (remote && remote.updatedAt) || 0);
        VOCAB_SCOPE_KEYS.forEach(k => {
          if (rdata[k] !== undefined) merged[k] = rdata[k];
          else delete merged[k];
        });
        if (!sameProgress(merged, data)) { data = merged; writeProgress(merged); }
        nextResetAt = Math.max(nextResetAt, rResetAt);
        nextVocabResetAt = rVocabResetAt;
      } else {
        if (hasProgress(rdata)) {
          const merged = mergeProgress(data, rdata, { dirty: true, localTs: ts }, (remote && remote.updatedAt) || 0);
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

    const authProof = (session && session.ph) || "";
    const body = { data: data, updatedAt: ts, authProof: authProof };
    if (nextResetAt > 0) body.resetAt = nextResetAt;
    if (nextVocabResetAt > 0) body.vocabResetAt = nextVocabResetAt;
    const small = JSON.stringify(body).length < 60000;
    await db(`study4_progress/${uname}`, "PUT", body, { keepalive: !!(opts && opts.keepalive && small) });
    pendingOverwriteMem = null;
    setSync(uname, {
      base: ts,
      dirty: changeCounter !== mark,
      resetAt: nextResetAt,
      vocabResetAt: nextVocabResetAt,
      pendingOverwrite: null
    });
    const st = progressStats(data);
    db(`study4_users/${uname}`, "PATCH", Object.assign(buildProgressStatsPatch(st), { authProof: authProof })).catch(() => {});
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
    const remote = await db(`study4_progress/${uname}`);
    const local = readProgress();
    const rdata = (remote && remote.data) || {};
    const rts = (remote && remote.updatedAt) || 0;
    const rResetAt = Number((remote && remote.resetAt) || 0);
    const rVocabResetAt = Number((remote && remote.vocabResetAt) || 0);
    const lResetAt = Number((sync && sync.resetAt) || 0);
    const lVocabResetAt = Number((sync && sync.vocabResetAt) || 0);
    let target = null, needPush = false;

    if (!remote) {
      if (hasProgress(local)) needPush = true;
    } else if (sync && rResetAt > lResetAt) {
      target = Object.assign({}, rdata);
      needPush = false;
    } else if (sync && rVocabResetAt > lVocabResetAt) {
      if (!sync.dirty) {
        target = Object.assign({}, rdata);
      } else {
        const lWithoutVocab = Object.assign({}, local);
        VOCAB_SCOPE_KEYS.forEach(k => delete lWithoutVocab[k]);
        target = mergeProgress(lWithoutVocab, rdata, sync, rts);
        VOCAB_SCOPE_KEYS.forEach(k => {
          if (rdata[k] !== undefined) target[k] = rdata[k];
          else delete target[k];
        });
        needPush = !sameProgress(target, rdata);
      }
    } else if (forceMerge || !sync) {
      target = mergeProgress(local, rdata, sync, rts);
      needPush = !sameProgress(target, rdata);
    } else if (!sync.dirty) {
      if (rts > (sync.base || 0)) target = rdata;
    } else if (rts > (sync.base || 0)) {
      target = mergeProgress(local, rdata, sync, rts);
      needPush = true;
    } else {
      needPush = true;
    }

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
      db(`study4_users/${uname}`, "PATCH", Object.assign(buildProgressStatsPatch(st), { authProof: (session && session.ph) || "" })).catch(() => {});
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
    await db("study4_config", "PATCH", {
      contactNote: config.contactNote,
      bankCode: config.bankCode,
      bankAccount: config.bankAccount,
      bankOwner: config.bankOwner,
      transferMemo: config.transferMemo,
      adminVerified: true,
      updatedBy: "admin",
      authProof: (session && session.ph) || "",
      updatedAt: new Date().toISOString()
    });
  }

  /* ---------- Kiểm tra phiên đăng nhập với cloud ---------- */
  async function forceLogout(msg) {
    const cur = session;
    pendingOverwriteMem = null;
    if (cur) {
      try { rawSet("s4_auth_profile_" + cur.username, JSON.stringify(readProgress())); } catch (e) {}
      hookSuspended = true;
      PROGRESS_KEYS.forEach(k => rawRemove(k));
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
    if (rec.role === "vip" && eff.role === "basic") db(`study4_users/${session.username}`, "PATCH", { role: "basic", authProof: session.ph }).catch(() => {});
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
    const ph = await hashPw(uname, pass);
    let rec = null;
    try {
      rec = await db(`study4_users/${uname}`);
    } catch (e) {
      const c = cache[uname];
      if (c && c.passwordHash === ph && c.status !== "blocked") { await startSession(c, ph); return { ok: true }; }
      return { ok: false, msg: "Không kết nối được máy chủ. Hãy bật mạng để đăng nhập (lần đầu trên thiết bị này cần có mạng)." };
    }
    if (uname === "admin" && (!rec || (!rec.passwordHash && !rec.username && !rec.role))) return { ok: false, needSetup: true };
    if (!rec || rec.deleted) return { ok: false, msg: "Tên đăng nhập hoặc mật khẩu không đúng." };
    let pwOk = false;
    try {
      pwOk = await verifyAuthSecret(uname, ph, rec);
    } catch (e) {
      const c = cache[uname];
      if (c && c.passwordHash === ph && c.status !== "blocked") { await startSession(c, ph); return { ok: true }; }
      return { ok: false, msg: "Không kết nối được máy chủ xác thực. Vui lòng thử lại." };
    }
    if (!pwOk) return { ok: false, msg: "Tên đăng nhập hoặc mật khẩu không đúng." };
    if (rec.status === "blocked") return { ok: false, msg: "Tài khoản này đã bị quản trị viên khóa." };
    await startSession(rec, ph);
    return { ok: true };
  }

  async function setupAdmin(pass) {
    const rec = await db("study4_users/admin");
    if (rec && (rec.passwordHash || rec.role === "admin")) return { ok: false, msg: "Tài khoản admin đã được thiết lập trước đó." };
    const ph = await hashPw("admin", pass);
    const migrated = await syncAuthSecret("admin", ph, ph);
    const full = Object.assign({}, rec || {}, {
      username: "admin", displayName: "Quản trị viên", avatar: "🛡️", targetBand: "8.0+", role: "admin", status: "active",
      expiresAt: "PERM", authProof: ph, createdAt: new Date().toISOString().slice(0, 10)
    });
    if (!migrated) full.passwordHash = ph;
    await db("study4_users/admin", "PUT", full);
    await startSession(full, ph);
    return { ok: true };
  }

  /* ---------- Giao diện & CSS ---------- */
  function getLogoPath() { return isHomePage() ? "icon-192.png" : "../icon-192.png"; }

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
      .s4-top-btn { background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; padding: 6px 10px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; transition: 0.15s; white-space: nowrap; font-family: inherit; flex-shrink: 0; }
      html.dark .s4-top-btn, body.dark .s4-top-btn { background: #0f172a; color: #f8fafc; border-color: #334155; }
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
      .s4-dropdown { position: absolute; right: 0; top: calc(100% + 8px); width: min(245px, calc(100vw - 20px)); background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 14px; box-shadow: 0 14px 36px rgba(0,0,0,0.18); padding: 6px; display: none; flex-direction: column; gap: 2px; z-index: 999; overscroll-behavior: contain; touch-action: manipulation; }
      html.dark .s4-dropdown, body.dark .s4-dropdown { background: #1e293b; color: #f8fafc; border-color: #334155; box-shadow: 0 14px 36px rgba(0,0,0,0.45); }
      .s4-dropdown.open { display: flex; }
      .s4-dd-item { display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 11px; border: none; background: transparent; color: inherit; font-family: inherit; font-size: 13px; font-weight: 600; text-align: left; border-radius: 9px; cursor: pointer; }
      .s4-dd-item:hover { background: rgba(37,99,235,0.09); color: #2563eb; }
      html.dark .s4-dd-item:hover, body.dark .s4-dd-item:hover { background: rgba(59,130,246,0.16); color: #60a5fa; }
      .s4-dd-sep { height: 1px; background: #e2e8f0; margin: 4px 6px; }
      html.dark .s4-dd-sep, body.dark .s4-dd-sep { background: #334155; }
      .s4-modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.78); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: calc(12px + var(--s4-top-inset, 0px)) calc(12px + env(safe-area-inset-right, 0px)) calc(12px + env(safe-area-inset-bottom, 0px)) calc(12px + env(safe-area-inset-left, 0px)); overscroll-behavior: contain; touch-action: none; box-sizing: border-box; }
      .s4-modal { background: #ffffff; color: #0f172a; width: 100%; max-width: 520px; border-radius: 18px; padding: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.35); max-height: calc(100dvh - var(--s4-top-inset, 0px) - env(safe-area-inset-bottom, 0px) - 24px); overflow-y: auto; overflow-x: hidden; border: 1px solid #e2e8f0; overscroll-behavior: contain; touch-action: pan-y; -webkit-overflow-scrolling: touch; box-sizing: border-box; }
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
      html.dark .s4-modal, body.dark .s4-modal { background: #1e293b; color: #f8fafc; border-color: #334155; }
      .s4-modal h3 { margin: 0 0 6px 0; font-size: 19px; }
      .s4-input { width: 100%; padding: 10px 13px; border-radius: 10px; border: 1.5px solid #cbd5e1; background: #f8fafc; color: #0f172a; font-size: 14px; margin-bottom: 10px; outline: none; box-sizing: border-box; }
      html.dark .s4-input, body.dark .s4-input { background: #0f172a; color: #f8fafc; border-color: #334155; }
      .s4-input:focus { border-color: #2563eb; }
      .s4-btn { width: 100%; padding: 12px; border-radius: 10px; border: none; background: #2563eb; color: #fff; font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 4px; }
      .s4-btn:disabled { opacity: .6; cursor: wait; }
      .s4-tabs { display: flex; gap: 6px; margin: 12px 0 16px 0; background: #f1f5f9; padding: 4px; border-radius: 10px; }
      html.dark .s4-tabs, body.dark .s4-tabs { background: #0f172a; }
      .s4-tab { flex: 1; text-align: center; padding: 8px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: none; background: transparent; color: #64748b; }
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
          <span class="s4-role-badge s4-role-free"><span class="s4-free-full">🌿 Mở miễn phí 100%</span><span class="s4-free-compact">🌿 Miễn phí</span></span>
        </div>
        <div class="s4-user-right">
          <button class="s4-top-btn donate" onclick="window.S4Auth.openDonateModal()">💖 Ủng hộ</button>
          <button class="s4-top-btn" onclick="window.S4Auth.openLoginModal(false)">👤 Đăng nhập</button>
          <button class="s4-top-btn" onclick="window.S4Auth.openInstallModal()">📲 Cài App</button>
        </div>`;
      return;
    }

    const badge = u.role === "admin"
      ? `<span class="s4-role-badge s4-role-admin">🛡️ Admin</span>`
      : `<span class="s4-role-badge s4-role-free">🌿 Học viên</span>`;

    bar.innerHTML = `
      <div class="s4-user-left">
        <button class="s4-profile-trigger" onclick="window.S4Auth.openProfileModal()" title="Bấm để mở Hồ sơ cá nhân & Theo dõi tiến độ">
          ${renderAvatarHtml(u.avatar, 24)}
          <span class="s4-profile-name">${esc(u.displayName)}</span>
          ${u.targetBand ? `<span class="s4-hide-sm" style="font-size:11px;opacity:.85;background:rgba(37,99,235,0.12);color:#2563eb;padding:1px 6px;border-radius:6px;font-weight:700;flex-shrink:0;">🎯 ${esc(u.targetBand)}</span>` : ""}
        </button>
        ${badge}
      </div>
      <div class="s4-user-right">
        <button class="s4-top-btn donate" onclick="window.S4Auth.openDonateModal()">💖 Ủng hộ</button>
        ${u.role === "admin" ? `<button class="s4-top-btn gold" onclick="window.S4Auth.openAdminModal()">🛡️ Quản trị</button>` : ""}
        <div class="s4-menu-wrap">
          <button class="s4-top-btn" id="s4MenuToggle" onclick="event.stopPropagation();document.getElementById('s4TopDropdown').classList.toggle('open')">☰ Mục ▾</button>
          <div class="s4-dropdown" id="s4TopDropdown">
            <button class="s4-dd-item" onclick="window.S4Auth.openProfileModal('overview')">📊 Hồ sơ &amp; Tiến độ cá nhân</button>
            <button class="s4-dd-item" onclick="window.S4Auth.openProfileModal('edit')">🎨 Đổi Tên, Avatar &amp; Mục tiêu</button>
            <button class="s4-dd-item" onclick="window.S4Auth.openProfileModal('pw')">🔐 Đổi mật khẩu</button>
            <div class="s4-dd-sep"></div>
            ${u.role === "admin" ? `<button class="s4-dd-item" onclick="window.S4Auth.openAdminModal()">🛡️ Trung tâm Quản trị</button>` : ""}
            <button class="s4-dd-item" style="color:#e11d48;font-weight:700;" onclick="window.S4Auth.openDonateModal()">💖 Ủng hộ dự án &amp; Mặt trận Tổ quốc</button>
            <button class="s4-dd-item" onclick="window.S4Auth.openInstallModal()">📲 Cài App vào Màn hình chính</button>
            <div class="s4-dd-sep"></div>
            <button class="s4-dd-item" style="color:#dc2626;" onclick="window.S4Auth.logout()">🚪 Đăng xuất tài khoản</button>
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
    if (e.key === "Escape" && document.getElementById("s4AuthModal")) {
      closeModals();
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
      const rem = daysRemaining(curU.expiresAt);
      let vipCardHtml = "";

      if (curU.role === "admin") {
        vipCardHtml = `
          <div class="s4-stat-box" style="background:linear-gradient(135deg,#1e293b,#0f172a);color:#fff;border:none;margin-bottom:14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <div>
                <div style="font-size:12px;opacity:.8;">Vai trò hệ thống</div>
                <div style="font-size:17px;font-weight:800;">🛡️ Quản Trị Viên Hệ Thống</div>
                <div style="font-size:12px;color:#4ade80;margin-top:2px;">🌱 Đang mở khóa miễn phí 100% cho cộng đồng</div>
              </div>
              <div style="display:flex;gap:6px;">
                <button class="s4-top-btn donate" onclick="window.S4Auth.openDonateModal()">💖 QR Ủng hộ</button>
                <button class="s4-top-btn gold" onclick="window.S4Auth.openAdminModal()">🛡️ Quản Trị</button>
              </div>
            </div>
          </div>`;
      } else {
        vipCardHtml = `
          <div class="s4-stat-box" style="background:linear-gradient(135deg,#fff1f2,#fef3c7);border:1.5px solid #fda4af;color:#881337;margin-bottom:14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <div style="max-width:340px;">
                <div style="font-size:14.5px;font-weight:800;color:#9f1239;">🌿 Tài khoản Học Viên (Mở khóa 100% trọn bộ)</div>
                <div style="font-size:12px;margin-top:3px;line-height:1.45;">🌱 20% tiền ủng hộ (Donate) được chuyển trực tiếp tới <b>Mặt trận Tổ quốc Việt Nam</b>.</div>
              </div>
              <button class="s4-top-btn donate" onclick="window.S4Auth.openDonateModal()">💖 Ủng hộ dự án</button>
            </div>
          </div>`;
      }

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

        bodyHtml = `
          ${vipCardHtml}
          <div class="s4-stat-box" style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:6px;">
              <span style="font-weight:800;font-size:14px;">📈 Tổng tiến độ khóa học</span>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:11.5px;background:rgba(217,119,6,0.12);color:#d97706;padding:2px 8px;border-radius:999px;font-weight:700;">🔥 Chuỗi học: ${st.streakDays} ngày (Tổng ${st.totalStudyDays} ngày)</span>
                <span style="font-weight:800;color:#2563eb;font-size:15px;">${st.overallPct}%</span>
              </div>
            </div>
            <div class="s4-prog-track"><div class="s4-prog-bar" style="width:${st.overallPct}%;background:linear-gradient(90deg,#2563eb,#0d9488);"></div></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;">
              <div style="padding:10px;border-radius:10px;background:rgba(37,99,235,0.07);">
                <div style="font-size:12px;color:#64748b;font-weight:600;">🧠 Từ vựng IELTS</div>
                <div style="font-size:17px;font-weight:800;color:#2563eb;margin:2px 0;">${st.vocabLearned + st.vocabIgnored} / ${TOTAL_VOCAB} <span style="font-size:12px;">(${st.vocabPct}%)</span></div>
                <div class="s4-prog-track"><div class="s4-prog-bar" style="width:${st.vocabPct}%;background:#2563eb;"></div></div>
                <div style="font-size:11px;color:#64748b;margin-top:6px;">
                  Đang học: <b>${st.vocabLearned}</b> • Nhớ kỹ: <b style="color:#16a34a">${st.vocabMastered}</b> • Đã biết: <b>${st.vocabIgnored}</b> • Cần ôn: <b style="color:#dc2626">${st.vocabDue}</b>
                </div>
              </div>
              <div style="padding:10px;border-radius:10px;background:rgba(13,148,136,0.08);">
                <div style="font-size:12px;color:#64748b;font-weight:600;">📘 Ngữ pháp IELTS</div>
                <div style="font-size:17px;font-weight:800;color:#0d9488;margin:2px 0;">${st.grammarDone} / ${TOTAL_GRAMMAR} <span style="font-size:12px;">(${st.grammarPct}%)</span></div>
                <div class="s4-prog-track"><div class="s4-prog-bar" style="width:${st.grammarPct}%;background:#0d9488;"></div></div>
                <div style="font-size:11px;color:#64748b;margin-top:6px;">
                  Đã hoàn thành: <b style="color:#16a34a">${st.grammarDone} bài</b> • Chưa học: <b>${Math.max(0, TOTAL_GRAMMAR - st.grammarDone)} bài</b> (4 chương)
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
              <label class="s4-top-btn" style="background:#2563eb;color:#fff;display:inline-block;cursor:pointer;">
                📷 Tải ảnh từ máy lên
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
          <button class="s4-btn" id="btnSaveProfile">💾 Lưu Thông Tin Cá Nhân</button>`;
      } else {
        bodyHtml = `
          <label style="font-size:12.5px;font-weight:700;">Mật khẩu hiện tại:</label>
          <div class="s4-pass-wrap">
            <input class="s4-input" id="pwOld" type="password" placeholder="Nhập mật khẩu hiện tại" autocomplete="current-password">
            <button type="button" class="s4-pass-toggle" title="Hiện/Ẩn mật khẩu">👁️</button>
          </div>
          <label style="font-size:12.5px;font-weight:700;">Mật khẩu mới (tối thiểu 6 ký tự):</label>
          <div class="s4-pass-wrap">
            <input class="s4-input" id="pwNew" type="password" placeholder="Nhập mật khẩu mới" autocomplete="new-password">
            <button type="button" class="s4-pass-toggle" title="Hiện/Ẩn mật khẩu">👁️</button>
          </div>
          <label style="font-size:12.5px;font-weight:700;">Xác nhận mật khẩu mới:</label>
          <div class="s4-pass-wrap">
            <input class="s4-input" id="pwNew2" type="password" placeholder="Nhập lại mật khẩu mới" autocomplete="new-password">
            <button type="button" class="s4-pass-toggle" title="Hiện/Ẩn mật khẩu">👁️</button>
          </div>
          <button class="s4-btn" id="btnChangePw">Cập Nhật Mật Khẩu Mới</button>`;
      }

      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
          <div style="display:flex;align-items:center;gap:12px;">
            ${renderAvatarHtml(curU.avatar, 50)}
            <div>
              <h3 style="margin:0;display:flex;align-items:center;gap:6px;">
                ${esc(curU.displayName)}
                <span style="font-size:12px;font-weight:700;background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:999px;">🎯 Band ${esc(curU.targetBand || "7.0")}</span>
              </h3>
              <div style="font-size:12.5px;color:#64748b;">@${esc(curU.username)} ${curU.createdAt ? "• Tham gia: " + esc(curU.createdAt) : ""}</div>
              ${curU.bio ? `<div style="font-size:12px;color:#0d9488;margin-top:2px;font-style:italic;">“${esc(curU.bio)}”</div>` : ""}
            </div>
          </div>
          <button class="s4-top-btn" style="color:inherit;" id="s4Close">✕</button>
        </div>
        <div class="s4-tabs">
          <button class="s4-tab ${tab === "overview" ? "active" : ""}" data-t="overview">📊 Tiến độ học tập</button>
          <button class="s4-tab ${tab === "edit" ? "active" : ""}" data-t="edit">🎨 Đổi tên &amp; Avatar</button>
          <button class="s4-tab ${tab === "pw" ? "active" : ""}" data-t="pw">🔐 Đổi mật khẩu</button>
        </div>
        ${msg ? `<div class="s4-ok">✅ ${esc(msg)}</div>` : ""}
        ${err ? `<div class="s4-err">⚠️ ${esc(err)}</div>` : ""}
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
            const patch = { displayName: newName, avatar: selAvatar, targetBand: newBand, bio: newBio, authProof: (session && session.ph) || "" };
            await db(`study4_users/${curU.username}`, "PATCH", patch);
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
          const oldHash = await hashPw(curU.username, oldP);
          if (oldHash !== session.ph) { err = "Mật khẩu hiện tại không đúng."; return render(); }
          const btn = box.querySelector("#btnChangePw");
          btn.disabled = true; btn.textContent = "⏳ Đang cập nhật...";
          try {
            const newHash = await hashPw(curU.username, newP);
            const migrated = await syncAuthSecret(curU.username, newHash, oldHash);
            if (!migrated) {
              await db(`study4_users/${curU.username}`, "PATCH", { passwordHash: newHash, authProof: oldHash });
            }
            session.ph = newHash;
            saveSession();
            if (cache[curU.username]) { cache[curU.username].passwordHash = newHash; saveCache(); }
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
        btn.textContent = isPass ? "🙈" : "👁️";
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
          <p style="font-size:13px;color:#64748b;margin:8px 0 12px 0;">
            Toàn bộ bài học đều được mở miễn phí 100%. Đăng nhập giúp bạn lưu trữ và đồng bộ tiến độ học tập tự động trên mọi thiết bị.
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
              <button type="button" class="s4-pass-toggle" title="Hiện/Ẩn mật khẩu">👁️</button>
            </div>
            ${setupMode ? `<div class="s4-pass-wrap"><input class="s4-input" id="inpPass2" type="password" placeholder="Nhập lại mật khẩu Admin" autocomplete="new-password" required><button type="button" class="s4-pass-toggle" title="Hiện/Ẩn mật khẩu">👁️</button></div>` : ""}
            ${mode === "login" && !setupMode ? `<div style="display:flex;justify-content:flex-end;margin-top:-4px;margin-bottom:10px;"><a href="#" id="linkForgot" style="font-size:12px;color:#2563eb;text-decoration:none;font-weight:600;">Quên mật khẩu?</a></div>` : ""}
            <button type="submit" class="s4-btn" id="s4Submit">${setupMode ? "Thiết lập mật khẩu Admin" : mode === "login" ? "Đăng nhập vào học" : "Đăng ký & Vào học"}</button>
          </form>
        `;
      }

      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${getLogoPath()}" alt="Logo" style="width:34px;height:34px;border-radius:9px;">
            <div style="display:flex;align-items:center;gap:6px;"><h3 style="margin:0;font-size:18px;font-weight:800;">LinguaPath</h3><span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:999px;background:rgba(16,185,129,0.18);color:#10b981;border:1px solid rgba(16,185,129,0.3);">Community</span></div>
          </div>
          ${canClose ? `<button class="s4-top-btn" style="color:inherit;" id="s4Close">✕</button>` : ""}
        </div>
        ${flash ? `<div class="s4-info">ℹ️ ${esc(flash)}</div>` : ""}
        ${infoMsg ? `<div class="s4-info">ℹ️ ${esc(infoMsg)}</div>` : ""}
        ${errMsg ? `<div class="s4-err">⚠️ ${esc(errMsg)}</div>` : ""}
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
          const nInp = (box.querySelector("#inpForgotName").value || "").trim();
          if (!USER_RE.test(uInp) || uInp === "admin") {
            return render("Tên đăng nhập không hợp lệ hoặc không hỗ trợ tự đặt lại.");
          }
          try {
            const userRec = await db("study4_users/" + uInp);
            if (!userRec || (!userRec.username && !userRec.passwordHash)) {
              return render("Không tìm thấy tài khoản @" + uInp);
            }
            const savedName = (userRec.displayName || userRec.username || "").trim().toLowerCase();
            if (savedName !== nInp.toLowerCase()) {
              return render("Họ tên hiển thị xác minh chưa khớp với thông tin đã đăng ký.");
            }
            await db("study4_reset_requests/" + uInp, "PUT", {
              username: uInp,
              displayName: userRec.displayName || uInp,
              requestedAt: new Date().toISOString()
            });
            mode = "login";
            render("", "Đã gửi yêu cầu tới Quản trị viên. Quản trị viên sẽ hỗ trợ cấp lại mật khẩu cho tài khoản @" + uInp + ".");
          } catch(e) {
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
          const rec = {
            username: raw, displayName: disp, avatar: "🎓", targetBand: "7.0", bio: "",
            role: "basic", status: "active", expiresAt: "PERM", authProof: ph,
            vocabLearned: st.vocabLearned, grammarDone: st.grammarDone, overallPct: st.overallPct,
            createdAt: new Date().toISOString().slice(0, 10), lastActive: new Date().toISOString()
          };
          if (!migrated) rec.passwordHash = ph;
          await db("study4_users/" + raw, "PUT", rec);
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
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="margin:0;font-size:18px;display:flex;align-items:center;gap:8px;color:#e11d48;">
            <span>💖</span> <span>Ủng Hộ Dự Án (Donate) &amp; Chung Tay Thiện Nguyện</span>
          </h3>
          <button type="button" class="s4-top-btn" style="color:inherit;font-size:16px;padding:4px 10px;cursor:pointer;" id="s4Close" onclick="window.S4Auth.closeModals()">✕</button>
        </div>

        <div style="background:linear-gradient(135deg,#fff1f2,#fef3c7);border:1.5px solid #fda4af;color:#881337;padding:12px 14px;border-radius:12px;margin-bottom:14px;line-height:1.55;">
          <div style="font-weight:800;font-size:14px;color:#9f1239;margin-bottom:4px;">
            Cam Kết Đồng Hành Cùng Mặt Trận Tổ Quốc Việt Nam
          </div>
          <div style="font-size:13px;">
            Toàn bộ kho từ vựng, ngữ pháp và luyện 4 kỹ năng IELTS trên hệ thống đều được <b>mở miễn phí 100%</b> cho cộng đồng.<br>
            🌱 <b>${esc(noteText)}</b>
          </div>
        </div>

        <div class="s4-donate-grid">
          <div style="text-align:center;">
            <div id="qrBox" style="background:#fff;padding:8px;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.08);display:inline-flex;flex-direction:column;align-items:center;justify-content:center;min-width:192px;min-height:224px;max-width:100%;color:#0f172a;">
              <div id="qrLoading" style="font-size:12px;font-weight:600;color:#475569;padding:8px 4px;">⏳ Đang tải mã VietQR...</div>
              <img src="${qrUrl}" alt="VietQR Donate" referrerpolicy="no-referrer" decoding="async" style="width:176px;height:208px;object-fit:contain;display:block;margin:0 auto;border-radius:6px;" id="qrImg">
              <div id="qrFallback" style="display:none;width:176px;min-height:196px;padding:12px 8px;border:1.5px dashed #cbd5e1;border-radius:8px;background:#f8fafc;color:#0f172a;flex-direction:column;align-items:center;justify-content:center;gap:6px;line-height:1.45;">
                <div style="font-size:13px;font-weight:800;color:#be123c;">🏦 ${esc(bank)}</div>
                <div style="font-size:13px;font-weight:800;color:#1d4ed8;word-break:break-all;">STK: ${esc(acc)}</div>
                <div style="font-size:11px;color:#475569;">Chưa tải được ảnh QR lúc này. Bạn hãy dùng nút <b>Sao chép</b> thông tin bên cạnh để chuyển khoản nhanh.</div>
                <button type="button" id="btnRetryQr" class="s4-top-btn" style="margin-top:4px;font-size:11.5px;padding:5px 10px;background:#fff;color:#0f172a;border:1px solid #cbd5e1;cursor:pointer;">🔄 Thử tải lại mã QR</button>
              </div>
            </div>
            <div style="font-size:11px;color:var(--muted,#64748b);margin-top:6px;">Quét mã VietQR bằng mọi ứng dụng Ngân hàng / Ví điện tử</div>
          </div>

          <div style="display:flex;flex-direction:column;gap:7px;font-size:12.5px;min-width:0;">
            <div class="s4-donate-row">
              <div style="min-width:0;overflow:hidden;text-overflow:ellipsis;"><span style="color:var(--muted,#64748b);font-size:11px;">Ngân hàng thụ hưởng:</span><br><b style="font-size:13.5px;">${esc(bank)}</b></div>
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
                <span style="color:#9f1239;font-size:11px;font-weight:700;">Nội dung chuyển khoản gợi ý:</span><br>
                <b style="font-size:13px;color:#e11d48;font-family:monospace;word-break:break-all;">${esc(memo)}</b>
              </div>
              <button class="s4-top-btn donate" data-copy="${esc(memo)}" style="font-size:11px;padding:4px 9px;">Sao chép</button>
            </div>
          </div>
        </div>

        <div style="margin-top:12px;padding:10px 12px;border-radius:10px;background:#f0fdf4;border:1px solid #bbf7d0;font-size:12.5px;color:#166534;text-align:center;font-weight:600;">
          Cảm ơn tấm lòng của bạn! Mọi sự ủng hộ đều là động lực quý báu để duy trì và hoàn thiện sớm nhất các học phần mới cho cộng đồng.
        </div>

        <div style="margin-top:10px;display:flex;justify-content:flex-end;">
          <button type="button" class="s4-top-btn" id="s4CloseBottom" onclick="window.S4Auth.closeModals()" style="padding:8px 18px;font-size:13px;cursor:pointer;">Đóng</button>
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
    let userSearch = "", userFilter = "all", inspectUser = null, inspectProgress = null;

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
              hasReset ? '<span class="s4-badge s4-badge-warn">Yêu cầu đặt lại MK</span>' :
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
            <button type="button" class="s4-pass-toggle" title="Hiện/Ẩn mật khẩu">👁️</button>
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
          <button class="s4-top-btn" style="color:inherit;" data-act="close">✕</button>
        </div>
        <div class="s4-tabs">
          <button class="s4-tab ${tab === "users" ? "active" : ""}" data-act="tab" data-v="users">👥 Quản lý học viên</button>
          <button class="s4-tab ${tab === "settings" ? "active" : ""}" data-act="tab" data-v="settings">⚙️ Cài đặt hệ thống &amp; QR Donate</button>
        </div>
        ${msg ? `<div class="s4-err">⚠️ ${esc(msg)}</div>` : ""}
        ${loading ? `<div style="padding:20px;text-align:center;color:#64748b;">Đang tải dữ liệu từ máy chủ...</div>`
          : tab === "users" ? (users ? usersHtml() : "") : settingsHtml()}
      `;

      setupPassToggles(box);

      const sInp = box.querySelector("#admSearchUser");
      if (sInp) {
        sInp.oninput = () => {
          userSearch = sInp.value;
          const pos = sInp.selectionStart;
          render();
          const nextInp = box.querySelector("#admSearchUser");
          if (nextInp) { nextInp.focus(); nextInp.setSelectionRange(pos, pos); }
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
          await db("study4_users/" + v, "PATCH", { status: nx, authProof: (session && session.ph) || "" });
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
          await db("study4_reset_requests/" + v, "DELETE").catch(() => {});
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
            await db("study4_users/" + v, "DELETE");
          } catch (e) {
            await db("study4_users/" + v, "PUT", { username: v, deleted: true, status: "blocked", role: "basic", authProof: adminProof });
          }
          await db("study4_progress/" + v, "PUT", { data: { _deleted: true }, updatedAt: Date.now(), authProof: adminProof }).catch(() => {});
          await db("study4_reset_requests/" + v, "DELETE").catch(() => {});
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
          <img src="${getLogoPath()}" alt="Logo" style="width:36px;height:36px;border-radius:9px;">
          <h3 style="margin:0;">📲 Cài App vào Màn Hình Chính</h3>
        </div>
        <button class="s4-top-btn" style="color:inherit;" id="s4Close">✕</button>
      </div>
      <div style="margin-top:12px;font-size:14px;line-height:1.6;">
        <div style="background:#eff6ff;color:#1e3a8a;padding:12px 14px;border-radius:12px;margin-bottom:12px;">
          <b>🍎 Trên iPhone / iPad (iOS):</b><br>
          1. Mở đường link này bằng trình duyệt <b>Safari</b>.<br>
          2. Bấm nút <b>Chia sẻ (ô vuông có mũi tên ⬆️)</b> ở thanh dưới cùng.<br>
          3. Chọn <b>"Thêm vào Màn hình chính"</b> ➔ bấm <b>Thêm</b>.
        </div>
        <div style="background:#f0fdf4;color:#14532d;padding:12px 14px;border-radius:12px;">
          <b>🤖 Trên điện thoại Android:</b><br>
          1. Mở đường link bằng trình duyệt <b>Chrome</b>.<br>
          2. Bấm biểu tượng <b>3 chấm dọc (⋮)</b> ở góc trên bên phải.<br>
          3. Chọn <b>"Thêm vào màn hình chính"</b> hoặc <b>"Cài đặt ứng dụng"</b>.
          ${deferredPrompt ? `<button class="s4-btn" style="background:#16a34a;margin-top:10px;" id="btnNativeInstall">⚡ Cài đặt App ngay (1 chạm)</button>` : ""}
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
      else rawRemove("s4_auth_sync_" + cur.username);
      hookSuspended = true;
      PROGRESS_KEYS.forEach(k => rawRemove(k));
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

  /* ---------- Khởi động ---------- */
  async function boot() {

    try {
      if (!isHomePage()) {
        document.documentElement.lang = 'en';
      }
    } catch (e) {}

    let firstConfigChanged = false;
    if (!hadCachedConfig) {
      try { firstConfigChanged = await Promise.race([fetchConfig(), new Promise((_, rej) => setTimeout(rej, 4000))]); } catch (e) {}
    }
    renderTopBar();
    /* Mở tự do 100% không ép đăng nhập */

    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      const swPath = isHomePage() ? "./sw.js" : "../sw.js";
      navigator.serviceWorker.register(swPath).then(reg => reg.update()).catch(() => {});
    }

    if (hadCachedConfig) {
      fetchConfig().then(changed => {
        if (!changed) return;
        renderTopBar();
        if (!isHomePage()) reloadOnce("cfg");
      }).catch(() => {});
    } else if (firstConfigChanged && !isHomePage()) {
      reloadOnce("cfg0");
    }

    if (session) {
      refreshSession().catch(() => {});
      syncProgress(false).catch(() => {});
    }
    setTimeout(checkFirstTimeCommunityDisclaimer, 250);
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

    const modal = document.createElement("div");
    modal.id = "lpDisclaimerModal";
    modal.style.cssText = "display:flex;align-items:center;justify-content:center;z-index:2147483647;position:fixed;inset:0;background:rgba(0,0,0,0.72);backdrop-filter:blur(6px);padding:16px;box-sizing:border-box;";
    modal.innerHTML = `
      <div style="background:var(--card, #1e293b);color:var(--text, #f8fafc);max-width:540px;width:100%;border-radius:18px;border:1.5px solid rgba(251,191,36,0.35);box-shadow:0 24px 60px rgba(0,0,0,0.5);overflow:hidden;animation:s4ModalIn 0.24s cubic-bezier(0.16,1,0.3,1);font-family:inherit;">
        <div style="padding:22px 24px 14px;background:linear-gradient(135deg, rgba(16,185,129,0.15), rgba(251,191,36,0.12));border-bottom:1px solid var(--border, rgba(255,255,255,0.08));display:flex;align-items:center;gap:12px;">
          <div style="width:42px;height:42px;border-radius:12px;background:var(--primary, #10b981);color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;box-shadow:0 4px 14px rgba(16,185,129,0.35);">
            🌿
          </div>
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <h2 style="margin:0;font-size:17.5px;font-weight:800;letter-spacing:-0.01em;">LinguaPath</h2>
              <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:rgba(16,185,129,0.2);color:#34d399;border:1px solid rgba(52,211,153,0.35);">Free for Community</span>
            </div>
            <p style="margin:2px 0 0;font-size:12px;color:var(--muted, #94a3b8);font-weight:500;">Thông báo Tôn trọng Bản quyền & Sứ mệnh Chia sẻ</p>
          </div>
        </div>
        
        <div style="padding:20px 24px;font-size:13.5px;line-height:1.6;color:var(--text, #f1f5f9);">
          <div style="margin-bottom:12px;padding:12px 14px;background:rgba(255,255,255,0.04);border-radius:10px;border-left:3.5px solid #10b981;">
            <strong>🤝 Sứ mệnh phi lợi nhuận:</strong> Nền tảng được xây dựng hoàn toàn phi thương mại nhằm hỗ trợ học sinh, sinh viên và cộng đồng có môi trường mô phỏng phòng thi máy tính để tự rèn luyện kỹ năng mọi lúc, mọi nơi.
          </div>
          
          <div style="margin-bottom:12px;padding:12px 14px;background:rgba(251,191,36,0.06);border-radius:10px;border-left:3.5px solid #f59e0b;">
            <strong>📚 Nguồn gốc tài liệu:</strong> Dữ liệu học thuật trong hệ thống được tham khảo và biên soạn dựa trên các khóa <strong>IELTS Fundamentals</strong> và <strong>IELTS 4 Kỹ Năng</strong> của nền tảng <strong>STUDY4</strong>.
          </div>
          
          <div style="padding:12px 14px;background:rgba(59,130,246,0.06);border-radius:10px;border-left:3.5px solid #3b82f6;font-size:13px;">
            <strong>💎 Tôn trọng tác giả:</strong> Để trải nghiệm trọn vẹn 100% dữ liệu gốc, kho đề mới nhất, bài giảng chuyên sâu và hệ thống giáo viên chấm bài tương tác, chúng tôi <strong>khuyến khích bạn đăng ký mua khóa học chính thức trực tiếp tại website chính hãng của STUDY4</strong> (<a href="https://study4.com" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:underline;font-weight:700;">study4.com</a>).
          </div>
        </div>
        
        <div style="padding:14px 24px 20px;display:flex;align-items:center;justify-content:flex-end;gap:12px;border-top:1px solid var(--border, rgba(255,255,255,0.08));background:rgba(0,0,0,0.12);">
          <button type="button" id="lpDisclaimerBtn" style="padding:10px 20px;border-radius:10px;background:linear-gradient(135deg, #10b981, #059669);color:#ffffff;border:none;font-size:13.5px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(16,185,129,0.35);transition:all 0.15s ease;">
            🚀 Tôi đã hiểu & Bắt đầu học miễn phí
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const btn = document.getElementById("lpDisclaimerBtn");
    if (btn) {
      btn.onclick = () => {
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
