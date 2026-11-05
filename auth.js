/* Study4 IELTS - Hệ thống tài khoản, Hồ sơ cá nhân & Quản trị viên v7
 * - Tài khoản, hồ sơ cá nhân (Avatar, Tên, Mục tiêu Band, Mật khẩu), mã kích hoạt VIP và tiến độ học đều đồng bộ qua Firebase Realtime Database.
 * - Hỗ trợ học Offline: dữ liệu lưu cục bộ và tự động đồng bộ lên Cloud khi có mạng.
 */
(function () {
  "use strict";

  const DB = "https://study4-app-default-rtdb.firebaseio.com";
  const K = { cfg: "s4_auth_config_v2", session: "s4_auth_session_v2", cache: "s4_auth_cache_v2" };
  const P_SRS = "s4_vocab_srs_v1", P_DAYS = "s4_vocab_days_v2", P_SET = "s4_vocab_settings_v2";
  const P_GDONE = "s4_grammar_done", P_GLAST = "s4_grammar_last";
  const PROGRESS_KEYS = [P_SRS, P_DAYS, P_SET, P_GDONE, P_GLAST];
  const TOTAL_VOCAB = 1827;
  const TOTAL_GRAMMAR = 120;

  const AVATAR_PRESETS = ["🎓", "🦊", "🐼", "🦁", "🐯", "🐨", "🦉", "🦄", "🐲", "🚀", "⚡", "🌟", "💎", "🔥", "🍀", "🎯"];

  const DEFAULT_CONFIG = {
    authEnforced: true, // true = Bật quản lý (cần đăng nhập + mã VIP); false = Thử nghiệm tự do (mở 100%)
    contactNote: "Liên hệ chủ sở hữu ứng dụng để nhận Mã Kích Hoạt mở khóa toàn bộ nội dung.",
    freeVocabTopicsCount: 2,
    freeGrammarSectionsCount: 2
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
  let session = loadObj(K.session, null);   // { username, ph }
  let cache = loadObj(K.cache, {});         // { username: {username, displayName, avatar, targetBand, bio, role, status, expiresAt, passwordHash, createdAt} }

  const saveConfig = () => rawSet(K.cfg, JSON.stringify(config));
  const saveSession = () => { if (session) rawSet(K.session, JSON.stringify(session)); else rawRemove(K.session); };
  const saveCache = () => rawSet(K.cache, JSON.stringify(cache));

  const isHomePage = () => !(location.pathname.includes("/vocab/") || location.pathname.includes("/grammar/"));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Tiện ích ngày tháng, thời hạn VIP & băm mật khẩu ---------- */
  const ymd = d => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const todayNum = () => ymd(new Date());
  function parseYmd(n) {
    const s = String(n || "");
    if (!/^\d{8}$/.test(s)) return null;
    return new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8));
  }
  function addDaysYmd(base, days) {
    let d = new Date(); d.setHours(0, 0, 0, 0);
    if (base && base !== "PERM") {
      const b = parseYmd(base);
      if (b && b > d) d = b;
    }
    d.setDate(d.getDate() + Number(days));
    return String(ymd(d));
  }
  function fmtExpiry(e) {
    if (!e || e === "PERM") return "Vĩnh viễn";
    const s = String(e);
    if (!/^\d{8}$/.test(s)) return "Vĩnh viễn";
    return s.slice(6, 8) + "/" + s.slice(4, 6) + "/" + s.slice(0, 4);
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
  function vipRemainingBadgeHtml(u) {
    if (!u) return "";
    if (u.role === "admin") return `<span class="s4-vip-Remain s4-vr-perm">🛡️ Quản trị viên (Vĩnh viễn)</span>`;
    if (u.role !== "vip") return `<span class="s4-vip-Remain s4-vr-basic">🌱 Gói Cơ Bản (Chưa kích hoạt VIP)</span>`;
    const rem = daysRemaining(u.expiresAt);
    if (!Number.isFinite(rem)) return `<span class="s4-vip-Remain s4-vr-perm">♾️ VIP Vĩnh viễn</span>`;
    if (rem < 0) return `<span class="s4-vip-Remain s4-vr-exp">⚠️ Đã hết hạn (${fmtExpiry(u.expiresAt)})</span>`;
    if (rem === 0) return `<span class="s4-vip-Remain s4-vr-warn">⏳ Hết hạn hôm nay (${fmtExpiry(u.expiresAt)})</span>`;
    const cls = rem <= 7 ? "s4-vr-warn" : "s4-vr-ok";
    return `<span class="s4-vip-Remain ${cls}">⏳ Còn <b>${rem}</b> ngày (đến ${fmtExpiry(u.expiresAt)})</span>`;
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

  /* ---------- Firebase REST ---------- */
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
    if (!config.authEnforced) return true;
    const u = getCurrentUser();
    return !!u && (u.role === "admin" || u.role === "vip");
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
  const stamp = x => Math.max(Number(x && x.lastReview) || 0, Number(x && x.updatedAt) || 0);
  function mergeProgress(local, remote) {
    const out = {};
    if (local[P_SRS] !== undefined || remote[P_SRS] !== undefined) {
      const a = parseJ(local[P_SRS], {}), b = parseJ(remote[P_SRS], {});
      const m = Object.assign({}, a);
      Object.keys(b).forEach(id => { if (!a[id] || stamp(b[id]) > stamp(a[id])) m[id] = b[id]; });
      out[P_SRS] = JSON.stringify(m);
    }
    if (local[P_DAYS] !== undefined || remote[P_DAYS] !== undefined) {
      const a = parseJ(local[P_DAYS], {}), b = parseJ(remote[P_DAYS], {});
      const m = {};
      new Set(Object.keys(a).concat(Object.keys(b))).forEach(d => {
        m[d] = Array.from(new Set([].concat(Array.isArray(a[d]) ? a[d] : [], Array.isArray(b[d]) ? b[d] : [])));
      });
      out[P_DAYS] = JSON.stringify(m);
    }
    if (local[P_GDONE] !== undefined || remote[P_GDONE] !== undefined) {
      const a = parseJ(local[P_GDONE], {}), b = parseJ(remote[P_GDONE], {});
      const m = Object.assign({}, a);
      Object.keys(b).forEach(id => { if (b[id]) m[id] = true; });
      out[P_GDONE] = JSON.stringify(m);
    }
    const last = remote[P_GLAST] !== undefined ? remote[P_GLAST] : local[P_GLAST];
    if (last !== undefined) out[P_GLAST] = last;
    const set = remote[P_SET] !== undefined ? remote[P_SET] : local[P_SET];
    if (set !== undefined) out[P_SET] = set;
    return out;
  }

  function localDateStr(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function progressStats(map) {
    const srs = parseJ(map[P_SRS], {});
    const g = parseJ(map[P_GDONE], {});
    const days = parseJ(map[P_DAYS], {});
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
    const grammarDone = Object.values(g).filter(Boolean).length;
    const vocabPct = Math.min(100, Math.round(((vocabLearned + vocabIgnored) / TOTAL_VOCAB) * 100));
    const grammarPct = Math.min(100, Math.round((grammarDone / TOTAL_GRAMMAR) * 100));
    const overallPct = Math.min(100, Math.round((vocabPct * 0.7 + grammarPct * 0.3)));

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
      overallPct,
      streakDays,
      totalStudyDays,
      recent7
    };
  }
  function hasProgress(map) {
    const s = progressStats(map);
    return s.vocabLearned > 0 || s.vocabIgnored > 0 || s.grammarDone > 0;
  }

  const getSync = u => loadObj("s4_auth_sync_" + u, null);
  const setSync = (u, patch) => rawSet("s4_auth_sync_" + u, JSON.stringify(Object.assign({ base: 0, dirty: false }, getSync(u) || {}, patch)));

  let changeCounter = 0, pushTimer = null;
  function onProgressChanged() {
    if (!session) return;
    changeCounter++;
    setSync(session.username, { dirty: true });
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => { pushProgress().catch(() => {}); }, 3500);
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
    const data = readProgress();
    const body = { data: data, updatedAt: ts };
    const small = JSON.stringify(body).length < 60000;
    await db(`study4_progress/${uname}`, "PUT", body, { keepalive: !!(opts && opts.keepalive && small) });
    setSync(uname, { base: ts, dirty: changeCounter !== mark });
    const st = progressStats(data);
    db(`study4_users/${uname}`, "PATCH", {
      vocabLearned: st.vocabLearned,
      vocabIgnored: st.vocabIgnored,
      vocabMastered: st.vocabMastered,
      vocabDue: st.vocabDue,
      vocabPct: st.vocabPct,
      grammarDone: st.grammarDone,
      grammarPct: st.grammarPct,
      overallPct: st.overallPct,
      streakDays: st.streakDays,
      totalStudyDays: st.totalStudyDays,
      lastActive: new Date().toISOString()
    }).catch(() => {});
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
    const remote = await db(`study4_progress/${uname}`);
    const local = readProgress();
    const sync = getSync(uname);
    const rdata = (remote && remote.data) || {};
    const rts = (remote && remote.updatedAt) || 0;
    let target = null, needPush = false;

    if (!remote) {
      if (hasProgress(local)) needPush = true;
    } else if (forceMerge || !sync) {
      target = mergeProgress(local, rdata);
      needPush = !sameProgress(target, rdata);
    } else if (!sync.dirty) {
      if (rts > (sync.base || 0)) target = rdata;
    } else if (rts > (sync.base || 0)) {
      target = mergeProgress(local, rdata);
      needPush = true;
    } else {
      needPush = true;
    }

    let changedLocal = false;
    if (target && !sameProgress(target, local)) { writeProgress(target); changedLocal = true; }
    if (needPush) await pushProgress();
    else {
      setSync(uname, { base: remote ? rts : 0, dirty: false });
      const st = progressStats(readProgress());
      db(`study4_users/${uname}`, "PATCH", {
        vocabLearned: st.vocabLearned,
        vocabIgnored: st.vocabIgnored,
        vocabMastered: st.vocabMastered,
        vocabDue: st.vocabDue,
        vocabPct: st.vocabPct,
        grammarDone: st.grammarDone,
        grammarPct: st.grammarPct,
        overallPct: st.overallPct,
        streakDays: st.streakDays,
        totalStudyDays: st.totalStudyDays,
        lastActive: new Date().toISOString()
      }).catch(() => {});
    }
    if (changedLocal) refreshAfterDataChange("progress");
  }

  /* ---------- Cấu hình dùng chung ---------- */
  async function fetchConfig() {
    const remote = await db("study4_config");
    if (!remote || typeof remote !== "object") return false;
    const next = Object.assign({}, config);
    if (typeof remote.authEnforced === "boolean") next.authEnforced = remote.authEnforced;
    if (typeof remote.contactNote === "string" && remote.contactNote) next.contactNote = remote.contactNote;
    if (Number.isFinite(Number(remote.freeVocabTopicsCount))) next.freeVocabTopicsCount = Number(remote.freeVocabTopicsCount);
    if (Number.isFinite(Number(remote.freeGrammarSectionsCount))) next.freeGrammarSectionsCount = Number(remote.freeGrammarSectionsCount);
    const changed = canon(next) !== canon(config);
    config = next;
    saveConfig();
    return changed;
  }
  async function pushConfig() {
    await db("study4_config", "PATCH", {
      authEnforced: !!config.authEnforced,
      contactNote: config.contactNote,
      freeVocabTopicsCount: Number(config.freeVocabTopicsCount),
      freeGrammarSectionsCount: Number(config.freeGrammarSectionsCount),
      updatedAt: new Date().toISOString()
    });
  }

  /* ---------- Kiểm tra phiên đăng nhập với cloud ---------- */
  async function forceLogout(msg) {
    const cur = session;
    if (cur) {
      try { rawSet("s4_auth_profile_" + cur.username, JSON.stringify(readProgress())); } catch (e) {}
      hookSuspended = true;
      PROGRESS_KEYS.forEach(k => rawRemove(k));
      hookSuspended = false;
    }
    session = null;
    saveSession();
    if (msg) sessionStorage.setItem("s4_logout_msg", msg);
    location.reload();
  }
  async function refreshSession() {
    if (!session) return;
    let rec;
    try { rec = await db(`study4_users/${session.username}`); } catch (e) { return; }
    if (!rec || !rec.passwordHash) return forceLogout("Tài khoản không còn tồn tại.");
    if (rec.passwordHash !== session.ph) return forceLogout("Mật khẩu đã được thay đổi, vui lòng đăng nhập lại.");
    if (rec.status === "blocked") return forceLogout("Tài khoản của bạn đã bị quản trị viên khóa.");
    const before = canon(effective(cache[session.username] || {}));
    cacheUserRecord(rec, session.ph);
    const eff = effective(cache[session.username]);
    if (rec.role === "vip" && eff.role === "basic") db(`study4_users/${session.username}`, "PATCH", { role: "basic" }).catch(() => {});
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
    try { await syncProgress(true); } catch (e) { setSync(rec.username, { dirty: true }); }
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
    if (uname === "admin" && (!rec || !rec.passwordHash)) return { ok: false, needSetup: true };
    if (!rec || rec.passwordHash !== ph) return { ok: false, msg: "Tên đăng nhập hoặc mật khẩu không đúng." };
    if (rec.status === "blocked") return { ok: false, msg: "Tài khoản này đã bị quản trị viên khóa." };
    await startSession(rec, ph);
    return { ok: true };
  }

  async function setupAdmin(pass) {
    const rec = await db("study4_users/admin");
    if (rec && rec.passwordHash) return { ok: false, msg: "Tài khoản admin đã được thiết lập trước đó." };
    const ph = await hashPw("admin", pass);
    const full = Object.assign({}, rec || {}, {
      username: "admin", displayName: "Quản trị viên", avatar: "🛡️", targetBand: "8.0+", role: "admin", status: "active",
      expiresAt: "PERM", passwordHash: ph, createdAt: new Date().toISOString().slice(0, 10)
    });
    await db("study4_users/admin", "PUT", full);
    await startSession(full, ph);
    return { ok: true };
  }

  async function peekCode(code, uname) {
    const c = String(code || "").trim().toUpperCase().replace(/\s+/g, "");
    if (!/^[A-Z0-9-]{6,40}$/.test(c)) return { ok: false, msg: "Mã kích hoạt không hợp lệ." };
    let rec;
    try { rec = await db(`study4_codes/${c}`); } catch (e) { return { ok: false, msg: "Không kết nối được máy chủ để kiểm tra mã. Hãy bật mạng." }; }
    if (!rec) return { ok: false, msg: "Mã kích hoạt không tồn tại." };
    if (rec.usedBy) return { ok: false, msg: "Mã này đã được sử dụng." };
    if (rec.forUser && rec.forUser !== uname) return { ok: false, msg: `Mã này chỉ dành riêng cho tài khoản "${rec.forUser}".` };
    return { ok: true, code: c, rec: rec };
  }
  async function redeemCode(code, uname) {
    const p = await peekCode(code, uname);
    if (!p.ok) return p;
    try {
      await db(`study4_codes/${p.code}`, "PATCH", { usedBy: uname, usedAt: new Date().toISOString() });
      const check = await db(`study4_codes/${p.code}`);
      if (!check || check.usedBy !== uname) return { ok: false, msg: "Mã này vừa được người khác sử dụng." };
      const rec = await db(`study4_users/${uname}`);
      const days = Number(p.rec.days) || 0;
      let exp = "PERM";
      if (days > 0) {
        const cur = rec && rec.role === "vip" ? rec.expiresAt : null;
        exp = cur === "PERM" ? "PERM" : addDaysYmd(cur && cur !== "PERM" ? cur : null, days);
      }
      await db(`study4_users/${uname}`, "PATCH", { role: "vip", expiresAt: exp });
      if (cache[uname]) { cache[uname].role = "vip"; cache[uname].expiresAt = exp; saveCache(); }
      return { ok: true, expiresAt: exp };
    } catch (e) {
      return { ok: false, msg: "Có lỗi kết nối khi kích hoạt, vui lòng thử lại." };
    }
  }

  /* ---------- Giao diện & CSS ---------- */
  function getLogoPath() { return isHomePage() ? "icon-192.png" : "../icon-192.png"; }

  function injectStyles() {
    if (document.getElementById("s4AuthStyles")) return;
    const st = document.createElement("style");
    st.id = "s4AuthStyles";
    st.textContent = `
      .s4-user-bar { background: linear-gradient(90deg, #0f172a, #1e293b); color: #f8fafc; padding: 7px 14px; font-size: 12.5px; display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; z-index: 900; border-bottom: 1px solid #334155; width: 100%; flex-shrink: 0; box-sizing: border-box; }
      .s4-user-left, .s4-user-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .s4-profile-trigger { display: inline-flex; align-items: center; gap: 7px; padding: 3px 10px 3px 5px; border-radius: 999px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: #fff; cursor: pointer; transition: 0.15s; }
      .s4-profile-trigger:hover { background: rgba(255,255,255,0.2); }
      .s4-role-badge { padding: 2px 9px; border-radius: 999px; font-weight: 700; font-size: 11.5px; }
      .s4-role-admin { background: #dc2626; color: #fff; }
      .s4-role-vip { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; }
      .s4-role-basic { background: #334155; color: #cbd5e1; border: 1px solid #475569; }
      .s4-role-free { background: #0d9488; color: #fff; }
      .s4-top-btn { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.15s; }
      .s4-top-btn:hover { background: rgba(255,255,255,0.22); }
      .s4-top-btn.gold { background: linear-gradient(135deg, #f59e0b, #d97706); border: none; color: #fff; }
      .s4-modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.78); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 14px; }
      .s4-modal { background: #ffffff; color: #0f172a; width: 100%; max-width: 520px; border-radius: 18px; padding: 22px; box-shadow: 0 20px 50px rgba(0,0,0,0.35); max-height: 92vh; overflow-y: auto; border: 1px solid #e2e8f0; }
      .s4-modal.wide { max-width: 860px; }
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

    if (!config.authEnforced && !u) {
      bar.innerHTML = `
        <div class="s4-user-left">
          ${logoImg}
          <span class="s4-role-badge s4-role-free">🔓 Chế độ Thử nghiệm Tự do (Mở 100% nội dung)</span>
        </div>
        <div class="s4-user-right">
          <button class="s4-top-btn" onclick="window.S4Auth.openLoginModal(false)">👤 Đăng nhập / Tạo tài khoản</button>
          <button class="s4-top-btn" onclick="window.S4Auth.openInstallModal()">📲 Cài App</button>
        </div>`;
      return;
    }

    if (!u) {
      bar.innerHTML = `
        <div class="s4-user-left">${logoImg} <span>🔒 Chưa đăng nhập</span></div>
        <div class="s4-user-right">
          <button class="s4-top-btn gold" onclick="window.S4Auth.openLoginModal(true)">Đăng nhập / Đăng ký</button>
          <button class="s4-top-btn" onclick="window.S4Auth.openInstallModal()">📲 Cài App</button>
        </div>`;
      return;
    }

    const rem = daysRemaining(u.expiresAt);
    const vipDaysText = Number.isFinite(rem) ? (rem >= 0 ? ` • còn ${rem} ngày` : " • hết hạn") : " • Vĩnh viễn";
    const badge = u.role === "admin"
      ? `<span class="s4-role-badge s4-role-admin">🛡️ Admin</span>`
      : u.role === "vip"
        ? `<span class="s4-role-badge s4-role-vip">👑 VIP${vipDaysText}</span>`
        : `<span class="s4-role-badge s4-role-basic">🌱 Cơ Bản</span>`;

    bar.innerHTML = `
      <div class="s4-user-left">
        <button class="s4-profile-trigger" onclick="window.S4Auth.openProfileModal()" title="Mở Trang cá nhân & Theo dõi tiến độ">
          ${renderAvatarHtml(u.avatar, 24)}
          <b>${esc(u.displayName)}</b>
          ${u.targetBand ? `<span style="font-size:11px;opacity:.85;background:rgba(255,255,255,0.15);padding:1px 6px;border-radius:6px;">🎯 ${esc(u.targetBand)}</span>` : ""}
        </button>
        ${badge}
        ${!config.authEnforced ? `<span class="s4-role-badge s4-role-free">🔓 Đang mở tự do</span>` : ""}
      </div>
      <div class="s4-user-right">
        <button class="s4-top-btn" onclick="window.S4Auth.openProfileModal()">👤 Trang cá nhân</button>
        ${u.role !== "admin" ? `<button class="s4-top-btn gold" onclick="window.S4Auth.openActivateModal()">🔑 ${u.role === "vip" ? "Gia hạn VIP" : "Kích hoạt VIP"}</button>` : ""}
        ${u.role === "admin" ? `<button class="s4-top-btn gold" onclick="window.S4Auth.openAdminModal()">🛡️ Quản trị &amp; Cấp mã</button>` : ""}
        <button class="s4-top-btn" onclick="window.S4Auth.openInstallModal()">📲 Cài App</button>
        <button class="s4-top-btn" onclick="window.S4Auth.logout()">Đăng xuất</button>
      </div>`;
  }

  function newModal(extraClass) {
    injectStyles();
    closeModals();
    const wrap = document.createElement("div");
    wrap.className = "s4-modal-backdrop";
    wrap.id = "s4AuthModal";
    wrap.innerHTML = `<div class="s4-modal ${extraClass || ""}"></div>`;
    document.body.appendChild(wrap);
    return { wrap, box: wrap.firstChild };
  }
  function closeModals() { document.querySelectorAll("#s4AuthModal").forEach(el => el.remove()); }

  /* ---------- TRANG CÁ NHÂN (HỒ SƠ, TIẾN ĐỘ, HẠN VIP, ĐỔI TÊN/AVT/MẬT KHẨU) ---------- */
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
                <div style="font-size:12px;opacity:.8;">Hạng tài khoản</div>
                <div style="font-size:17px;font-weight:800;">🛡️ Quản Trị Viên Hệ Thống</div>
                <div style="font-size:12px;color:#4ade80;margin-top:2px;">♾️ Mở khóa toàn bộ nội dung vĩnh viễn</div>
              </div>
              <button class="s4-top-btn gold" onclick="window.S4Auth.openAdminModal()">🛡️ Bảng Quản Trị</button>
            </div>
          </div>`;
      } else if (curU.role === "vip") {
        const isPerm = !Number.isFinite(rem);
        const daysLabel = isPerm ? "♾️ Vĩnh viễn (Không giới hạn ngày)" : `⏳ Còn ${rem} ngày sử dụng (Hết hạn: ${fmtExpiry(curU.expiresAt)})`;
        const barPct = isPerm ? 100 : Math.max(5, Math.min(100, Math.round((rem / 30) * 100)));
        vipCardHtml = `
          <div class="s4-stat-box" style="background:linear-gradient(135deg,#92400e,#b45309);color:#fff;border:none;margin-bottom:14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <div>
                <div style="font-size:12px;opacity:.88;">Gói tài khoản hiện tại</div>
                <div style="font-size:17px;font-weight:800;">👑 Thành Viên VIP Full</div>
                <div style="font-size:12.5px;margin-top:3px;font-weight:600;">${daysLabel}</div>
              </div>
              <button class="s4-top-btn" style="background:rgba(255,255,255,0.2);border:none;" onclick="window.S4Auth.openActivateModal()">➕ Nạp thêm mã</button>
            </div>
            <div style="height:6px;background:rgba(255,255,255,0.22);border-radius:3px;margin-top:10px;overflow:hidden;">
              <div style="height:100%;width:${barPct}%;background:#fde047;"></div>
            </div>
          </div>`;
      } else {
        const expNote = curU.expiredVipAt ? `<div style="font-size:12px;color:#fca5a5;margin-top:2px;">⚠️ Gói VIP của bạn đã hết hạn vào ngày ${fmtExpiry(curU.expiredVipAt)}.</div>` : "";
        vipCardHtml = `
          <div class="s4-stat-box" style="margin-bottom:14px;border-color:#f59e0b;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <div>
                <div style="font-size:12px;color:#64748b;">Gói tài khoản hiện tại</div>
                <div style="font-size:16px;font-weight:800;">🌱 Gói Cơ Bản (Học thử ${config.freeVocabTopicsCount} chủ đề đầu)</div>
                ${expNote}
              </div>
              <button class="s4-top-btn gold" onclick="window.S4Auth.openActivateModal()">🔑 Kích hoạt VIP ngay</button>
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
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <span style="font-weight:800;font-size:14px;">📈 Tổng tiến độ khóa học</span>
              <span style="font-weight:800;color:#2563eb;font-size:15px;">${st.overallPct}%</span>
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
                  🔥 Chuỗi học: <b style="color:#d97706">${st.streakDays} ngày</b> • Tổng: <b>${st.totalStudyDays} ngày</b>
                </div>
              </div>
            </div>
          </div>
          <div class="s4-stat-box">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="font-weight:700;font-size:13px;">📊 Hoạt động 7 ngày gần nhất (từ vựng/ngày)</span>
              <span style="font-size:12px;color:#16a34a;font-weight:700;">🔥 Streak ${st.streakDays} ngày</span>
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
          <input class="s4-input" id="pwOld" type="password" placeholder="Nhập mật khẩu hiện tại" autocomplete="current-password">
          <label style="font-size:12.5px;font-weight:700;">Mật khẩu mới (tối thiểu 6 ký tự):</label>
          <input class="s4-input" id="pwNew" type="password" placeholder="Nhập mật khẩu mới" autocomplete="new-password">
          <label style="font-size:12.5px;font-weight:700;">Xác nhận mật khẩu mới:</label>
          <input class="s4-input" id="pwNew2" type="password" placeholder="Nhập lại mật khẩu mới" autocomplete="new-password">
          <button class="s4-btn" id="btnChangePw">🔐 Cập Nhật Mật Khẩu Mới</button>`;
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
          <button class="s4-tab ${tab === "overview" ? "active" : ""}" data-t="overview">📊 Tiến độ &amp; Hạn VIP</button>
          <button class="s4-tab ${tab === "edit" ? "active" : ""}" data-t="edit">🎨 Đổi tên &amp; Avatar</button>
          <button class="s4-tab ${tab === "pw" ? "active" : ""}" data-t="pw">🔐 Đổi mật khẩu</button>
        </div>
        ${msg ? `<div class="s4-ok">✅ ${esc(msg)}</div>` : ""}
        ${err ? `<div class="s4-err">⚠️ ${esc(err)}</div>` : ""}
        ${bodyHtml}`;

      box.querySelector("#s4Close").onclick = closeModals;
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
            await db(`study4_users/${curU.username}`, "PATCH", patch);
            Object.assign(cache[curU.username], patch);
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
            await db(`study4_users/${curU.username}`, "PATCH", { passwordHash: newHash });
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
  function openLoginModal(forceLock) {
    const { box } = newModal();
    let mode = "login";
    let flash = sessionStorage.getItem("s4_logout_msg") || "";
    sessionStorage.removeItem("s4_logout_msg");
    let busy = false;
    let setupMode = false;

    function render(errMsg, infoMsg) {
      const canClose = !forceLock || !config.authEnforced || !!getCurrentUser();
      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${getLogoPath()}" alt="Logo" style="width:36px;height:36px;border-radius:9px;">
            <h3 style="margin:0;">Study4 IELTS</h3>
          </div>
          ${canClose ? `<button class="s4-top-btn" style="color:inherit;" id="s4Close">✕</button>` : ""}
        </div>
        <p style="font-size:13px;color:#64748b;margin:8px 0 12px 0;">
          Tài khoản dùng chung trên mọi thiết bị, tiến độ học tự động lưu theo tài khoản. Gói <b>Cơ bản</b> học thử ${config.freeVocabTopicsCount} chủ đề đầu; nhập <b>Mã Kích Hoạt VIP</b> để mở toàn bộ.
        </p>
        ${setupMode ? "" : `<div class="s4-tabs">
          <button class="s4-tab ${mode === "login" ? "active" : ""}" id="tabLogin" type="button">Đăng nhập</button>
          <button class="s4-tab ${mode === "register" ? "active" : ""}" id="tabReg" type="button">Tạo tài khoản mới</button>
        </div>`}
        ${flash ? `<div class="s4-info">ℹ️ ${esc(flash)}</div>` : ""}
        ${infoMsg ? `<div class="s4-info">ℹ️ ${esc(infoMsg)}</div>` : ""}
        ${errMsg ? `<div class="s4-err">⚠️ ${esc(errMsg)}</div>` : ""}
        <form id="s4AuthForm">
          ${mode === "register" && !setupMode ? `<input class="s4-input" id="inpDisplay" placeholder="Họ tên hiển thị (VD: Minh Anh)" maxlength="40" required>` : ""}
          <input class="s4-input" id="inpUser" placeholder="Tên đăng nhập (chữ thường, số, _ ; 3-20 ký tự)" autocomplete="username" autocapitalize="off" required value="${setupMode ? "admin" : ""}" ${setupMode ? "readonly" : ""}>
          <input class="s4-input" id="inpPass" type="password" placeholder="${setupMode ? "Đặt mật khẩu Admin mới (từ 6 ký tự)" : "Mật khẩu"}" autocomplete="${mode === "login" && !setupMode ? "current-password" : "new-password"}" required>
          ${setupMode ? `<input class="s4-input" id="inpPass2" type="password" placeholder="Nhập lại mật khẩu Admin" autocomplete="new-password" required>` : ""}
          ${mode === "register" && !setupMode ? `<input class="s4-input" id="inpActKey" placeholder="🔑 Mã Kích Hoạt VIP (không bắt buộc)" style="text-transform:uppercase;">` : ""}
          <button type="submit" class="s4-btn" id="s4Submit">${setupMode ? "🛡️ Thiết lập mật khẩu Admin" : mode === "login" ? "🚀 Đăng nhập vào học" : "✨ Đăng ký & Vào học"}</button>
        </form>`;
      flash = "";
      const c = box.querySelector("#s4Close"); if (c) c.onclick = closeModals;
      const tl = box.querySelector("#tabLogin"); if (tl) tl.onclick = () => { mode = "login"; render(); };
      const tr = box.querySelector("#tabReg"); if (tr) tr.onclick = () => { mode = "register"; render(); };
      box.querySelector("#s4AuthForm").onsubmit = onSubmit;
    }

    async function onSubmit(ev) {
      ev.preventDefault();
      if (busy) return;
      const btn = box.querySelector("#s4Submit");
      const raw = box.querySelector("#inpUser").value.trim().toLowerCase();
      const pass = box.querySelector("#inpPass").value;
      busy = true; btn.disabled = true; btn.textContent = "⏳ Đang xử lý...";
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
          if (r.needSetup) { setupMode = true; busy = false; return render("", "Tài khoản Admin chưa có mật khẩu. Hãy đặt mật khẩu Admin ngay bây giờ (chỉ làm 1 lần)."); }
          if (!r.ok) throw new Error(r.msg);
          closeModals(); location.reload();
        } else {
          if (raw === "admin") throw new Error("Tên \"admin\" được dành riêng, vui lòng chọn tên khác.");
          if (pass.length < 6) throw new Error("Mật khẩu phải từ 6 ký tự trở lên.");
          const disp = (box.querySelector("#inpDisplay").value.trim() || raw).slice(0, 40);
          const actKey = (box.querySelector("#inpActKey").value || "").trim();
          let existing;
          try { existing = await db(`study4_users/${raw}`); }
          catch (e) { throw new Error("Cần có mạng để tạo tài khoản. Vui lòng kết nối internet và thử lại."); }
          if (existing && existing.passwordHash) throw new Error("Tên đăng nhập này đã có người dùng, vui lòng chọn tên khác.");
          if (actKey) { const p = await peekCode(actKey, raw); if (!p.ok) throw new Error(p.msg); }
          const ph = await hashPw(raw, pass);
          const st = progressStats(readProgress());
          const rec = {
            username: raw, displayName: disp, avatar: "🎓", targetBand: "7.0", bio: "",
            passwordHash: ph, role: "basic", status: "active", expiresAt: "PERM",
            vocabLearned: st.vocabLearned, grammarDone: st.grammarDone, overallPct: st.overallPct,
            createdAt: new Date().toISOString().slice(0, 10), lastActive: new Date().toISOString()
          };
          await db(`study4_users/${raw}`, "PUT", rec);
          if (actKey) {
            const r = await redeemCode(actKey, raw);
            if (r.ok) { rec.role = "vip"; rec.expiresAt = r.expiresAt; }
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

  function openActivateModal(lockedTitle) {
    const u = getCurrentUser();
    if (!u) return openLoginModal(true);
    const { box } = newModal();
    const rem = daysRemaining(u.expiresAt);
    const curStatus = u.role === "vip"
      ? (Number.isFinite(rem) ? `Đang là VIP (Còn <b>${rem} ngày</b>, hết hạn ${fmtExpiry(u.expiresAt)}) — nhập mã mới sẽ cộng dồn thêm ngày!` : `Đang là <b>VIP Vĩnh viễn</b>`)
      : `Đang ở <b>Gói Cơ Bản (Học thử)</b>`;

    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3>👑 Mở Khóa &amp; Gia Hạn VIP</h3>
        <button class="s4-top-btn" style="color:inherit;" id="s4Close">✕</button>
      </div>
      ${lockedTitle ? `<div style="background:#fef3c7;color:#b45309;padding:10px 12px;border-radius:10px;font-size:13px;font-weight:600;margin:10px 0;">🔒 <b>${esc(lockedTitle)}</b> yêu cầu Mã Kích Hoạt VIP để học tiếp. Toàn bộ tiến độ đã học của bạn vẫn được giữ nguyên!</div>` : ""}
      <p style="font-size:13.5px;line-height:1.55;color:#64748b;margin:8px 0 12px 0;">
        Tài khoản: <b style="color:#2563eb;">${esc(u.displayName)} (@${esc(u.username)})</b><br>
        Trạng thái: ${curStatus}<br>
        <span style="font-size:12.5px;">${esc(config.contactNote)}</span>
      </p>
      <div id="actMsg" style="display:none;padding:9px 12px;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:10px;"></div>
      <input class="s4-input" id="inpKey" placeholder="Nhập mã kích hoạt (VD: S4-ABCD-EFGH-JKLM)" style="font-family:monospace;text-transform:uppercase;" autocapitalize="characters">
      <button class="s4-btn" id="btnDoActivate">🔓 Kích Hoạt &amp; Mở Khóa Ngay</button>`;
    box.querySelector("#s4Close").onclick = closeModals;
    const btn = box.querySelector("#btnDoActivate");
    const msgEl = box.querySelector("#actMsg");
    btn.onclick = async () => {
      btn.disabled = true; btn.textContent = "⏳ Đang kiểm tra mã...";
      const res = await redeemCode(box.querySelector("#inpKey").value, u.username);
      msgEl.style.display = "block";
      if (!res.ok) {
        msgEl.style.background = "#fee2e2"; msgEl.style.color = "#dc2626";
        msgEl.textContent = "❌ " + res.msg;
        btn.disabled = false; btn.textContent = "🔓 Kích Hoạt & Mở Khóa Ngay";
        return;
      }
      msgEl.style.background = "#dcfce7"; msgEl.style.color = "#15803d";
      const newRem = daysRemaining(res.expiresAt);
      msgEl.textContent = "🎉 Kích hoạt VIP thành công" + (Number.isFinite(newRem) ? ` (Còn ${newRem} ngày - đến ${fmtExpiry(res.expiresAt)})` : " (Vĩnh viễn)") + "! Đang mở khóa...";
      setTimeout(() => { closeModals(); location.reload(); }, 900);
    };
  }

  /* ---------- BẢNG QUẢN TRỊ ADMIN NÂNG CAO ---------- */
  const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  function randomCode() {
    const arr = new Uint32Array(12);
    (window.crypto || window.msCrypto).getRandomValues(arr);
    const s = Array.from(arr).map(n => CODE_ALPHABET[n % CODE_ALPHABET.length]).join("");
    return `S4-${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;
  }
  const daysLabel = d => (Number(d) > 0 ? d + " ngày" : "Vĩnh viễn");

  function openAdminModal(startTab) {
    if (!isAdmin()) return;
    const { box } = newModal("wide");
    let tab = startTab || "users";
    let codes = null, users = null, loading = false, msg = "", fresh = [];
    let userSearch = "", userFilter = "all", inspectUser = null, inspectProgress = null;

    async function load() {
      loading = true; render();
      try {
        if (tab === "codes") codes = (await db("study4_codes")) || {};
        if (tab === "users") users = (await db("study4_users")) || {};
        msg = "";
      } catch (e) { msg = "Không tải được dữ liệu từ máy chủ. Kiểm tra kết nối mạng."; }
      loading = false; render();
    }

    function bannerHtml() {
      return config.authEnforced
        ? `<div class="s4-mode-banner" style="background:#fef3c7;color:#92400e;border:1px solid #f59e0b;">
             <div><b>🔒 ĐANG BẬT QUẢN LÝ</b><div style="font-size:12px;">Cần đăng nhập; gói Cơ bản chỉ học ${config.freeVocabTopicsCount} chủ đề đầu, muốn học tiếp phải có Mã VIP. Dữ liệu đã học được giữ nguyên.</div></div>
             <button class="s4-top-btn" style="background:#0d9488;border:none;padding:8px 12px;" data-act="mode" data-v="0">🔓 Chuyển sang Mở tự do</button>
           </div>`
        : `<div class="s4-mode-banner" style="background:#dcfce7;color:#14532d;border:1px solid #22c55e;">
             <div><b>🔓 ĐANG Ở CHẾ ĐỘ THỬ NGHIỆM TỰ DO</b><div style="font-size:12px;">Ai vào cũng học được 100% nội dung, không cần đăng nhập. Khi bật Quản lý, dữ liệu vẫn giữ nguyên nhưng phải có Mã VIP mới học tiếp.</div></div>
             <button class="s4-top-btn" style="background:#dc2626;border:none;padding:8px 12px;" data-act="mode" data-v="1">🔒 Bật Quản lý &amp; Mã VIP</button>
           </div>`;
    }

    function codesHtml() {
      const list = Object.keys(codes || {}).map(c => Object.assign({ code: c }, codes[c])).sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
      const unusedCount = list.filter(x => !x.usedBy).length;
      const rows = list.map(c => `<tr>
        <td style="font-family:monospace;font-weight:700;">${esc(c.code)}</td>
        <td>${daysLabel(c.days)}</td>
        <td>${c.forUser ? `<b>@${esc(c.forUser)}</b>` : "<i>Bất kỳ ai</i>"}</td>
        <td>${c.usedBy ? `<span style="color:#16a34a;font-weight:700;">✅ @${esc(c.usedBy)}</span>` : `<span style="color:#d97706;font-weight:700;">⏳ Chưa dùng</span>`}</td>
        <td><button class="s4-mini" data-act="copy" data-v="${esc(c.code)}">📋 Copy</button><button class="s4-mini" style="background:#ef4444;" data-act="delcode" data-v="${esc(c.code)}">Xóa</button></td>
      </tr>`).join("");
      return `
        <div style="background:#f8fafc;padding:14px;border-radius:12px;border:1px solid #e2e8f0;color:#0f172a;">
          <div style="font-weight:700;margin-bottom:8px;">🔑 Tạo Mã Kích Hoạt VIP (Tổng: ${list.length} mã • Chưa dùng: ${unusedCount})</div>
          <div style="display:grid;grid-template-columns:1fr 90px;gap:8px;">
            <select class="s4-input" id="kgDays" style="margin:0;">
              <option value="0">♾️ Vĩnh viễn</option><option value="7">⏳ 7 ngày</option><option value="30">📅 30 ngày</option><option value="90">📅 90 ngày</option><option value="365">📅 365 ngày</option>
            </select>
            <input class="s4-input" id="kgQty" type="number" min="1" max="20" value="1" style="margin:0;" title="Số lượng mã">
          </div>
          <input class="s4-input" id="kgUser" placeholder="Gán riêng cho 1 username (không bắt buộc, VD: minhanh)" style="margin-top:8px;">
          <button class="s4-btn" data-act="gen">⚡ Sinh Mã Kích Hoạt</button>
          ${fresh.length ? fresh.map(c => `<div class="s4-key-box" data-act="copy" data-v="${esc(c)}" title="Bấm để sao chép">${esc(c)}</div>`).join("") + `<div style="font-size:12px;color:#64748b;margin-top:6px;">Bấm vào mã để sao chép rồi gửi cho học viên.</div>` : ""}
        </div>
        <div class="s4-table-wrap"><table class="s4-table"><thead><tr><th>Mã VIP</th><th>Thời hạn</th><th>Dành cho</th><th>Trạng thái</th><th></th></tr></thead><tbody>${rows || `<tr><td colspan="5" style="color:#64748b;">Chưa có mã nào.</td></tr>`}</tbody></table></div>`;
    }

    function inspectModalHtml(u) {
      const vLearned = Number(u.vocabLearned) || 0;
      const vIgnored = Number(u.vocabIgnored) || 0;
      const vMastered = Number(u.vocabMastered) || 0;
      const vDue = Number(u.vocabDue) || 0;
      const gDone = Number(u.grammarDone) || 0;
      const vPct = Math.min(100, Math.round(((vLearned + vIgnored) / TOTAL_VOCAB) * 100));
      const gPct = Math.min(100, Math.round((gDone / TOTAL_GRAMMAR) * 100));
      const oPct = Math.min(100, Math.round(vPct * 0.7 + gPct * 0.3));
      const st = inspectProgress ? progressStats(inspectProgress) : null;

      return `
        <div class="s4-stat-box" style="margin-bottom:14px;border:2px solid #2563eb;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
            <div style="display:flex;align-items:center;gap:10px;">
              ${renderAvatarHtml(u.avatar, 46)}
              <div>
                <div style="font-weight:800;font-size:16px;">${esc(u.displayName || u.username)} <span style="font-weight:600;color:#64748b;font-size:13px;">(@${esc(u.username)})</span></div>
                <div style="font-size:12px;color:#64748b;">🎯 Mục tiêu Band ${esc(u.targetBand || "7.0")} • Tạo ngày: ${esc(u.createdAt || "—")} • Hoạt động: <b>${fmtRelativeTime(u.lastActive)}</b></div>
                ${u.bio ? `<div style="font-size:12px;color:#0d9488;margin-top:2px;">“${esc(u.bio)}”</div>` : ""}
              </div>
            </div>
            <button class="s4-mini" style="background:#64748b;" data-act="closeinspect">Đóng chi tiết ✕</button>
          </div>
          <div style="margin-top:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            ${vipRemainingBadgeHtml(effective(u))}
            <span class="s4-vip-Remain s4-vr-ok">🔥 Chuỗi Streak: ${st ? st.streakDays : (u.streakDays || 0)} ngày (Tổng ${st ? st.totalStudyDays : (u.totalStudyDays || 0)} ngày học)</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px;">
            <div style="padding:8px 10px;background:rgba(37,99,235,0.08);border-radius:8px;">
              <div style="font-size:11.5px;color:#64748b;">Tổng hoàn thành</div>
              <div style="font-size:18px;font-weight:800;color:#2563eb;">${oPct}%</div>
              <div class="s4-prog-track"><div class="s4-prog-bar" style="width:${oPct}%;background:#2563eb;"></div></div>
            </div>
            <div style="padding:8px 10px;background:rgba(22,163,74,0.08);border-radius:8px;">
              <div style="font-size:11.5px;color:#64748b;">Từ vựng (${vPct}%)</div>
              <div style="font-size:15px;font-weight:800;color:#16a34a;">${vLearned + vIgnored} / ${TOTAL_VOCAB}</div>
              <div style="font-size:11px;color:#64748b;">Học: ${vLearned} • Nhớ kỹ: ${vMastered} • Biết: ${vIgnored} • Ôn: ${vDue}</div>
            </div>
            <div style="padding:8px 10px;background:rgba(13,148,136,0.08);border-radius:8px;">
              <div style="font-size:11.5px;color:#64748b;">Ngữ pháp (${gPct}%)</div>
              <div style="font-size:15px;font-weight:800;color:#0d9488;">${gDone} / ${TOTAL_GRAMMAR} bài</div>
              <div class="s4-prog-track"><div class="s4-prog-bar" style="width:${gPct}%;background:#0d9488;"></div></div>
            </div>
          </div>
        </div>`;
    }

    function usersHtml() {
      const allUsers = Object.keys(users || {}).filter(k => users[k] && users[k].passwordHash).map(k => users[k]);
      const todayIsoPrefix = new Date().toISOString().slice(0, 10);
      const totalCount = allUsers.length;
      const vipActiveCount = allUsers.filter(u => effective(u).role === "vip" || u.role === "admin").length;
      const activeTodayCount = allUsers.filter(u => String(u.lastActive || "").startsWith(todayIsoPrefix)).length;
      const avgPct = totalCount ? Math.round(allUsers.reduce((acc, u) => {
        const vP = Math.min(100, Math.round((((Number(u.vocabLearned) || 0) + (Number(u.vocabIgnored) || 0)) / TOTAL_VOCAB) * 100));
        const gP = Math.min(100, Math.round(((Number(u.grammarDone) || 0) / TOTAL_GRAMMAR) * 100));
        return acc + Math.round(vP * 0.7 + gP * 0.3);
      }, 0) / totalCount) : 0;

      const q = userSearch.trim().toLowerCase();
      const filtered = allUsers.filter(u => {
        const eff = effective(u);
        const rem = daysRemaining(u.expiresAt);
        if (q && !(u.username.toLowerCase().includes(q) || String(u.displayName || "").toLowerCase().includes(q))) return false;
        if (userFilter === "vip") return eff.role === "vip";
        if (userFilter === "basic") return eff.role === "basic";
        if (userFilter === "expiring") return eff.role === "vip" && Number.isFinite(rem) && rem <= 7;
        if (userFilter === "blocked") return u.status === "blocked";
        return true;
      }).sort((a, b) => String(b.lastActive || b.createdAt || "").localeCompare(String(a.lastActive || a.createdAt || "")));

      const rows = filtered.map(it => {
        const isAdm = it.username === "admin";
        const eff = effective(it);
        const vLearned = Number(it.vocabLearned) || 0;
        const vIgnored = Number(it.vocabIgnored) || 0;
        const gDone = Number(it.grammarDone) || 0;
        const vPct = Math.min(100, Math.round(((vLearned + vIgnored) / TOTAL_VOCAB) * 100));
        const gPct = Math.min(100, Math.round((gDone / TOTAL_GRAMMAR) * 100));
        const oPct = Math.min(100, Math.round(vPct * 0.7 + gPct * 0.3));

        return `<tr>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              ${renderAvatarHtml(it.avatar, 32)}
              <div>
                <b>${esc(it.displayName || it.username)}</b> <span style="color:#64748b;font-size:11.5px;">(@${esc(it.username)})</span>
                <div style="font-size:11px;color:#64748b;">🕒 ${fmtRelativeTime(it.lastActive)} ${it.targetBand ? `• 🎯 ${esc(it.targetBand)}` : ""}</div>
              </div>
            </div>
          </td>
          <td style="min-width:175px;">
            <div style="display:flex;justify-content:space-between;font-size:11.5px;font-weight:700;">
              <span>Tổng: <b style="color:#2563eb">${oPct}%</b></span>
              <span>🔥 ${it.streakDays || 0} ngày</span>
            </div>
            <div class="s4-prog-track" style="margin:3px 0 5px 0;"><div class="s4-prog-bar" style="width:${oPct}%;background:linear-gradient(90deg,#2563eb,#16a34a);"></div></div>
            <div style="font-size:11px;color:#64748b;">
              📚 <b>${vLearned + vIgnored}</b>/${TOTAL_VOCAB} (${vPct}%) • 📘 <b>${gDone}</b>/${TOTAL_GRAMMAR} (${gPct}%)
            </div>
          </td>
          <td style="min-width:140px;">
            <select data-act="role" data-v="${esc(it.username)}" style="padding:4px 6px;border-radius:6px;margin-bottom:4px;font-weight:700;" ${isAdm ? "disabled" : ""}>
              <option value="basic" ${eff.role === "basic" ? "selected" : ""}>🌱 Cơ bản</option>
              <option value="vip" ${eff.role === "vip" ? "selected" : ""}>👑 VIP Full</option>
              <option value="admin" ${eff.role === "admin" ? "selected" : ""}>🛡️ Admin</option>
            </select>
            <div>${vipRemainingBadgeHtml(eff)}</div>
          </td>
          <td>
            <button class="s4-mini" style="background:#2563eb;" data-act="inspect" data-v="${esc(it.username)}" title="Xem chi tiết tiến độ">🔍 Chi tiết</button>
            ${isAdm ? "" : `
              <button class="s4-mini" style="background:#16a34a;" data-act="ext" data-v="${esc(it.username)}" title="Cộng thêm 30 ngày VIP">＋30 ngày</button>
              <button class="s4-mini" style="background:#0284c7;" data-act="setdays" data-v="${esc(it.username)}" title="Đặt số ngày VIP tùy ý">📅 Đặt ngày</button>
              <button class="s4-mini" style="background:#d97706;" data-act="perm" data-v="${esc(it.username)}" title="Cho VIP Vĩnh viễn">♾️</button>
              <button class="s4-mini" style="background:${it.status === "blocked" ? "#dc2626" : "#0d9488"};" data-act="block" data-v="${esc(it.username)}">${it.status === "blocked" ? "🚫 Đang khóa" : "✅ Mở"}</button>
            `}
            <button class="s4-mini" data-act="resetpw" data-v="${esc(it.username)}">🔑 Đổi MK</button>
            ${isAdm ? "" : `<button class="s4-mini" style="background:#ef4444;" data-act="deluser" data-v="${esc(it.username)}">Xóa</button>`}
          </td>
        </tr>`;
      }).join("");

      return `
        <div class="s4-kpi-grid">
          <div class="s4-stat-box" style="text-align:center;padding:9px;">
            <div style="font-size:19px;font-weight:800;color:#2563eb;">${totalCount}</div>
            <div style="font-size:11px;color:#64748b;">Tổng tài khoản</div>
          </div>
          <div class="s4-stat-box" style="text-align:center;padding:9px;">
            <div style="font-size:19px;font-weight:800;color:#d97706;">${vipActiveCount}</div>
            <div style="font-size:11px;color:#64748b;">👑 Đang có VIP</div>
          </div>
          <div class="s4-stat-box" style="text-align:center;padding:9px;">
            <div style="font-size:19px;font-weight:800;color:#16a34a;">${activeTodayCount}</div>
            <div style="font-size:11px;color:#64748b;">🔥 Học hôm nay</div>
          </div>
          <div class="s4-stat-box" style="text-align:center;padding:9px;">
            <div style="font-size:19px;font-weight:800;color:#0d9488;">${avgPct}%</div>
            <div style="font-size:11px;color:#64748b;">📈 Tiến độ TB</div>
          </div>
        </div>
        ${inspectUser && users[inspectUser] ? inspectModalHtml(users[inspectUser]) : ""}
        <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
          <input class="s4-input" id="admSearchUser" placeholder="🔍 Tìm theo tên hoặc @username..." value="${esc(userSearch)}" style="flex:1;min-width:180px;margin:0;padding:8px 11px;">
          <select class="s4-input" id="admFilterUser" style="width:auto;margin:0;padding:8px 11px;">
            <option value="all" ${userFilter === "all" ? "selected" : ""}>Tất cả (${totalCount})</option>
            <option value="vip" ${userFilter === "vip" ? "selected" : ""}>👑 Đang VIP</option>
            <option value="basic" ${userFilter === "basic" ? "selected" : ""}>🌱 Cơ bản</option>
            <option value="expiring" ${userFilter === "expiring" ? "selected" : ""}>⚠️ Sắp hết hạn (≤7 ngày)</option>
            <option value="blocked" ${userFilter === "blocked" ? "selected" : ""}>🚫 Đang khóa</option>
          </select>
        </div>
        <div class="s4-table-wrap">
          <table class="s4-table">
            <thead><tr><th>Học viên</th><th>Tiến trình học (%)</th><th>Gói &amp; Hạn VIP còn lại</th><th>Kiểm soát</th></tr></thead>
            <tbody>${rows || `<tr><td colspan="4" style="color:#64748b;text-align:center;padding:16px;">Không tìm thấy tài khoản phù hợp.</td></tr>`}</tbody>
          </table>
        </div>`;
    }

    function settingsHtml() {
      return `
        <label style="font-size:13px;font-weight:700;">🔑 Đổi mật khẩu Admin của bạn:</label>
        <input class="s4-input" id="admNewPass" type="password" placeholder="Mật khẩu mới (từ 6 ký tự, để trống nếu giữ nguyên)" autocomplete="new-password">
        <label style="font-size:13px;font-weight:700;">📢 Lời nhắn hiển thị khi người dùng bấm vào nội dung bị khóa:</label>
        <input class="s4-input" id="admNote" value="${esc(config.contactNote)}">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div><label style="font-size:13px;font-weight:700;">Số chủ đề Từ vựng học thử:</label><input class="s4-input" id="admFreeV" type="number" min="0" max="20" value="${config.freeVocabTopicsCount}"></div>
          <div><label style="font-size:13px;font-weight:700;">Số phần Grammar học thử:</label><input class="s4-input" id="admFreeG" type="number" min="0" max="30" value="${config.freeGrammarSectionsCount}"></div>
        </div>
        <button class="s4-btn" data-act="savecfg">💾 Lưu cấu hình hệ thống</button>`;
    }

    function render() {
      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${getLogoPath()}" alt="Logo" style="width:32px;height:32px;border-radius:8px;">
            <h3 style="margin:0;">🛡️ Trung Tâm Quản Trị Học Viên &amp; VIP</h3>
          </div>
          <button class="s4-top-btn" style="color:inherit;" data-act="close">✕</button>
        </div>
        ${bannerHtml()}
        <div class="s4-tabs">
          <button class="s4-tab ${tab === "users" ? "active" : ""}" data-act="tab" data-v="users">👥 Học viên &amp; Tiến độ</button>
          <button class="s4-tab ${tab === "codes" ? "active" : ""}" data-act="tab" data-v="codes">🔑 Cấp Mã Kích Hoạt</button>
          <button class="s4-tab ${tab === "settings" ? "active" : ""}" data-act="tab" data-v="settings">⚙️ Cài đặt hệ thống</button>
        </div>
        ${msg ? `<div class="s4-err">⚠️ ${esc(msg)}</div>` : ""}
        ${loading ? `<div style="padding:20px;text-align:center;color:#64748b;">⏳ Đang đồng bộ dữ liệu từ máy chủ...</div>`
          : tab === "codes" ? (codes ? codesHtml() : "") : tab === "users" ? (users ? usersHtml() : "") : settingsHtml()}`;

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
      if (act === "tab") { tab = v; fresh = []; return load(); }
      if (act === "mode") {
        if (!(await guard(async () => { config.authEnforced = v === "1"; saveConfig(); await pushConfig(); }))) return;
        location.reload(); return;
      }
      if (act === "copy") {
        try { await navigator.clipboard.writeText(v); el.textContent = el.classList.contains("s4-key-box") ? "✅ Đã sao chép: " + v : "✅ Đã copy"; } catch (e) { prompt("Sao chép mã:", v); }
        return;
      }
      if (act === "gen") {
        const days = Number(box.querySelector("#kgDays").value);
        const qty = Math.max(1, Math.min(20, Number(box.querySelector("#kgQty").value) || 1));
        const forUser = box.querySelector("#kgUser").value.trim().toLowerCase();
        if (forUser && !USER_RE.test(forUser)) { msg = "Tên tài khoản không hợp lệ."; return render(); }
        const made = [];
        if (!(await guard(async () => {
          for (let i = 0; i < qty; i++) {
            const code = randomCode();
            const rec = { days: days, createdAt: new Date().toISOString(), createdBy: "admin" };
            if (forUser) rec.forUser = forUser;
            await db(`study4_codes/${code}`, "PUT", rec);
            made.push(code);
          }
        }))) return;
        fresh = made;
        codes = (await db("study4_codes").catch(() => codes)) || codes;
        return render();
      }
      if (act === "delcode") { if (!confirm("Xóa mã " + v + "?")) return; if (await guard(() => db(`study4_codes/${v}`, "DELETE"))) { delete codes[v]; render(); } return; }
      if (act === "inspect") {
        inspectUser = v;
        inspectProgress = null;
        render();
        try {
          const p = await db(`study4_progress/${v}`);
          if (p && p.data) {
            inspectProgress = p.data;
            const st = progressStats(p.data);
            Object.assign(users[v], {
              vocabLearned: st.vocabLearned, vocabIgnored: st.vocabIgnored, vocabMastered: st.vocabMastered, vocabDue: st.vocabDue,
              grammarDone: st.grammarDone, streakDays: st.streakDays, totalStudyDays: st.totalStudyDays
            });
            render();
          }
        } catch (e) {}
        return;
      }
      if (act === "closeinspect") { inspectUser = null; inspectProgress = null; return render(); }
      if (act === "ext") {
        if (await guard(async () => {
          const r = await db(`study4_users/${v}`);
          const cur = r && r.role === "vip" ? r.expiresAt : null;
          const exp = cur === "PERM" ? "PERM" : addDaysYmd(cur, 30);
          await db(`study4_users/${v}`, "PATCH", { role: "vip", expiresAt: exp });
          users[v].role = "vip"; users[v].expiresAt = exp;
        })) render();
        return;
      }
      if (act === "setdays") {
        const rawDays = prompt(`Nhập số ngày VIP muốn cấp cho "${v}" (Tính từ hôm nay, hoặc nhập 0 để cho Vĩnh viễn):`, "30");
        if (rawDays === null) return;
        const nDays = Number(rawDays);
        if (!Number.isFinite(nDays) || nDays < 0) { msg = "Số ngày không hợp lệ."; return render(); }
        if (await guard(async () => {
          const exp = nDays === 0 ? "PERM" : addDaysYmd(null, Math.round(nDays));
          await db(`study4_users/${v}`, "PATCH", { role: "vip", expiresAt: exp });
          users[v].role = "vip"; users[v].expiresAt = exp;
        })) render();
        return;
      }
      if (act === "perm") { if (await guard(async () => { await db(`study4_users/${v}`, "PATCH", { role: "vip", expiresAt: "PERM" }); users[v].role = "vip"; users[v].expiresAt = "PERM"; })) render(); return; }
      if (act === "block") { const nx = users[v].status === "blocked" ? "active" : "blocked"; if (await guard(async () => { await db(`study4_users/${v}`, "PATCH", { status: nx }); users[v].status = nx; })) render(); return; }
      if (act === "resetpw") {
        const np = prompt("Nhập mật khẩu MỚI cho tài khoản \"" + v + "\" (từ 6 ký tự):");
        if (!np) return;
        if (np.length < 6) { msg = "Mật khẩu phải từ 6 ký tự."; return render(); }
        if (await guard(async () => { const ph = await hashPw(v, np); await db(`study4_users/${v}`, "PATCH", { passwordHash: ph }); if (session && session.username === v) { session.ph = ph; saveSession(); if (cache[v]) { cache[v].passwordHash = ph; saveCache(); } } })) { msg = ""; alert("✅ Đã đặt lại mật khẩu cho " + v + "."); }
        return;
      }
      if (act === "deluser") {
        if (!confirm("Xóa vĩnh viễn tài khoản " + v + " và toàn bộ tiến độ học của họ?")) return;
        if (await guard(async () => { await db(`study4_users/${v}`, "DELETE"); await db(`study4_progress/${v}`, "DELETE"); delete users[v]; if (inspectUser === v) inspectUser = null; })) render();
        return;
      }
      if (act === "savecfg") {
        const note = box.querySelector("#admNote").value.trim() || DEFAULT_CONFIG.contactNote;
        const fv = Math.max(0, Math.min(20, Number(box.querySelector("#admFreeV").value) || 0));
        const fg = Math.max(0, Math.min(30, Number(box.querySelector("#admFreeG").value) || 0));
        const np = box.querySelector("#admNewPass").value;
        if (np && np.length < 6) { msg = "Mật khẩu mới phải từ 6 ký tự."; return render(); }
        if (await guard(async () => {
          config.contactNote = note; config.freeVocabTopicsCount = fv; config.freeGrammarSectionsCount = fg;
          saveConfig(); await pushConfig();
          if (np) { const ph = await hashPw("admin", np); await db("study4_users/admin", "PATCH", { passwordHash: ph }); session.ph = ph; saveSession(); if (cache.admin) { cache.admin.passwordHash = ph; saveCache(); } }
        })) { alert("✅ Đã lưu cấu hình!"); render(); }
        return;
      }
    });
    box.addEventListener("change", async ev => {
      const el = ev.target.closest("[data-act='role']");
      if (!el) return;
      const uname = el.dataset.v, role = el.value;
      const patch = { role: role };
      if (role === "vip" && !(users[uname] && users[uname].expiresAt)) patch.expiresAt = "PERM";
      if (await guard(async () => { await db(`study4_users/${uname}`, "PATCH", patch); Object.assign(users[uname], patch); })) render();
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

  /* ---------- Phân quyền nội dung ---------- */
  function canAccessVocabTopic(topicName, allTopicsList) {
    if (isFullAccess()) return true;
    if (topicName === "ALL" || topicName === "ALL_DUE") return false;
    const idx = allTopicsList.indexOf(topicName);
    return idx >= 0 && idx < config.freeVocabTopicsCount;
  }
  function canAccessGrammarSection(sectionIndexZeroBased) {
    if (isFullAccess()) return true;
    return sectionIndexZeroBased < config.freeGrammarSectionsCount;
  }

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
    session = null;
    saveSession();
    location.reload();
  }

  window.S4Auth = {
    getCurrentUser, isFullAccess, isAdmin, daysRemaining,
    canAccessVocabTopic, canAccessGrammarSection,
    openLoginModal, openProfileModal, openActivateModal, openAdminModal, openInstallModal, closeModals,
    logout, syncNow: () => syncProgress(false)
  };

  /* ---------- Khởi động ---------- */
  async function boot() {
    let firstConfigChanged = false;
    if (!hadCachedConfig) {
      try { firstConfigChanged = await Promise.race([fetchConfig(), new Promise((_, rej) => setTimeout(rej, 4000))]); } catch (e) {}
    }
    renderTopBar();
    if (config.authEnforced && !getCurrentUser()) openLoginModal(true);

    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      if (window.caches) {
        caches.keys().then(keys => {
          keys.filter(k => k !== "study4-ielts-cache-v7").forEach(k => caches.delete(k));
        }).catch(() => {});
      }
      const swPath = isHomePage() ? "./sw.js" : "../sw.js";
      navigator.serviceWorker.register(swPath).then(reg => reg.update()).catch(() => {});
    }

    if (hadCachedConfig) {
      fetchConfig().then(changed => {
        if (!changed) return;
        renderTopBar();
        if (config.authEnforced && !getCurrentUser()) openLoginModal(true);
        else closeModals();
        if (!isHomePage()) reloadOnce("cfg");
      }).catch(() => {});
    } else if (firstConfigChanged && !isHomePage()) {
      reloadOnce("cfg0");
    }

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

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
