(function () {
  const AUTH_KEYS = {
    users: "s4_auth_users_v1",
    session: "s4_auth_session_v1",
    config: "s4_auth_config_v1"
  };

  // MẶC ĐỊNH: authEnforced = false (Chế độ Mở tự do thử nghiệm) hoặc true (Chế độ Bật Quản lý & Mã Kích Hoạt)
  const DEFAULT_CONFIG = {
    authEnforced: true, // true = Bật Quản lý (Cần Đăng nhập & Mã kích hoạt VIP); false = Tắt Quản lý (Mở tự do 100%)
    secretSalt: "STUDY4_MASTER_2026_KEY",
    contactNote: "Liên hệ chủ sở hữu ứng dụng để nhận Mã Kích Hoạt mở khóa toàn bộ nội dung.",
    cloudDbUrl: "https://study4-app-default-rtdb.firebaseio.com",
    freeVocabTopicsCount: 2,
    freeGrammarSectionsCount: 2
  };

  function loadObj(k, fb) {
    try {
      const o = JSON.parse(localStorage.getItem(k));
      return o && typeof o === "object" ? o : fb;
    } catch (e) {
      return fb;
    }
  }

  let config = Object.assign({}, DEFAULT_CONFIG, loadObj(AUTH_KEYS.config, {}));
  if (!config.cloudDbUrl) {
    config.cloudDbUrl = DEFAULT_CONFIG.cloudDbUrl;
  }
  let users = loadObj(AUTH_KEYS.users, {});
  let session = loadObj(AUTH_KEYS.session, null);

  if (!users["admin"]) {
    users["admin"] = {
      username: "admin",
      passwordHash: simpleHash("admin123"),
      displayName: "Quản trị viên (Admin)",
      role: "admin",
      status: "active",
      expiresAt: "PERM",
      createdAt: new Date().toISOString().slice(0, 10)
    };
    saveUsers();
  }

  function saveUsers() {
    localStorage.setItem(AUTH_KEYS.users, JSON.stringify(users));
  }
  function saveSession() {
    if (session) localStorage.setItem(AUTH_KEYS.session, JSON.stringify(session));
    else localStorage.removeItem(AUTH_KEYS.session);
  }
  function saveConfig() {
    localStorage.setItem(AUTH_KEYS.config, JSON.stringify(config));
  }

  function normUser(u) {
    return (u || "").trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
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

  function getLogoPath() {
    return location.pathname.includes("/vocab/") || location.pathname.includes("/grammar/")
      ? "../icon-192.png"
      : "icon-192.png";
  }

  function signActivationPayload(targetUser, expCode) {
    const raw = [targetUser.toUpperCase(), expCode.toUpperCase(), config.secretSalt].join("|");
    return simpleHash(raw).slice(0, 6);
  }

  function generateActivationKey(targetUser, expCode) {
    const u = normUser(targetUser) ? normUser(targetUser).toUpperCase() : "ALL";
    const exp = (expCode || "PERM").toUpperCase();
    const sig = signActivationPayload(u, exp);
    return `S4VIP-${u}-${exp}-${sig}`;
  }

  function verifyActivationKey(keyStr, currentUsername) {
    const clean = (keyStr || "").trim().toUpperCase();
    const parts = clean.split("-");
    if (parts.length !== 4 || parts[0] !== "S4VIP") {
      return { ok: false, msg: "Định dạng mã kích hoạt không hợp lệ (Chuẩn: S4VIP-USER-EXP-XXXXXX)." };
    }
    const targetU = parts[1];
    const exp = parts[2];
    const sig = parts[3];

    const curU = normUser(currentUsername).toUpperCase();
    if (targetU !== "ALL" && targetU !== curU) {
      return { ok: false, msg: `Mã kích hoạt này chỉ dành riêng cho tài khoản "${targetU.toLowerCase()}".` };
    }

    const expectedSig = signActivationPayload(targetU, exp);
    if (sig !== expectedSig) {
      return { ok: false, msg: "Mã kích hoạt không chính xác hoặc đã bị thay đổi." };
    }

    if (exp !== "PERM") {
      const todayNum = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
      const expNum = Number(exp);
      if (!expNum || todayNum > expNum) {
        return { ok: false, msg: "Mã kích hoạt này đã hết hạn sử dụng." };
      }
    }

    return { ok: true, expiresAt: exp };
  }

  function getCurrentUser() {
    if (!session || !session.username) return null;
    const u = users[session.username];
    if (!u || u.status === "blocked") return null;
    if (u.role === "vip" && u.expiresAt && u.expiresAt !== "PERM") {
      const todayNum = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
      if (todayNum > Number(u.expiresAt)) {
        u.role = "basic";
        saveUsers();
      }
    }
    return u;
  }

  // Nếu đang TẮT chế độ Quản lý (authEnforced === false) -> Ai cũng được mở khóa 100% nội dung!
  function isFullAccess() {
    if (!config.authEnforced) return true;
    const u = getCurrentUser();
    if (!u) return false;
    return u.role === "admin" || u.role === "vip";
  }

  function isAdmin() {
    const u = getCurrentUser();
    return !!u && u.role === "admin";
  }

  const PROGRESS_KEYS = ["s4_vocab_srs_v1", "s4_vocab_days_v2", "s4_vocab_settings_v2", "s4_grammar_done", "s4_grammar_last"];

  function snapshotCurrentProgress() {
    const snap = {};
    PROGRESS_KEYS.forEach(k => {
      const v = localStorage.getItem(k);
      if (v !== null) snap[k] = v;
    });
    return snap;
  }

  function saveUserProfileProgress(uname) {
    if (!uname) return;
    const snap = snapshotCurrentProgress();
    localStorage.setItem("s4_profile_" + uname, JSON.stringify(snap));
  }

  function loadUserProfileProgress(uname, inheritIfEmpty = false) {
    if (!uname) return;
    const raw = localStorage.getItem("s4_profile_" + uname);
    if (raw) {
      try {
        const snap = JSON.parse(raw);
        PROGRESS_KEYS.forEach(k => {
          if (snap[k] !== undefined) localStorage.setItem(k, snap[k]);
          else localStorage.removeItem(k);
        });
      } catch (e) {}
    } else if (inheritIfEmpty) {
      // Kế thừa dữ liệu học từ giai đoạn Mở tự do (Thử nghiệm) vào tài khoản vừa tạo!
      saveUserProfileProgress(uname);
    } else {
      PROGRESS_KEYS.forEach(k => localStorage.removeItem(k));
    }
  }

  // Đồng bộ Cloud (Nếu Admin gắn link Firebase Realtime DB, mọi máy sẽ tự động nhận lệnh Bật/Tắt chế độ Quản lý & đồng bộ dữ liệu theo Tài khoản!)
  async function syncCloudState() {
    const u = getCurrentUser();
    if (u) saveUserProfileProgress(u.username);
    if (!config.cloudDbUrl) return;
    try {
      const base = config.cloudDbUrl.replace(/\/+$/, "");
      const cfgRes = await fetch(`${base}/study4_config.json`);
      if (cfgRes.ok) {
        const remoteCfg = await cfgRes.json();
        if (remoteCfg && typeof remoteCfg.authEnforced === "boolean" && remoteCfg.authEnforced !== config.authEnforced) {
          config.authEnforced = remoteCfg.authEnforced;
          saveConfig();
          renderTopBar();
          if (config.authEnforced && !getCurrentUser()) openLoginModal(true);
        }
      }
      if (!u) return;
      const srs = JSON.parse(localStorage.getItem("s4_vocab_srs_v1") || "{}");
      const gDone = JSON.parse(localStorage.getItem("s4_grammar_done") || "{}");
      const vocabCount = Object.keys(srs).filter(k => /^w_\d+$/.test(k) && srs[k] && !srs[k].ignored).length;
      const grammarCount = Object.values(gDone).filter(Boolean).length;

      const res = await fetch(`${base}/study4_users/${u.username}.json`);
      if (res.ok) {
        const remote = await res.json();
        if (remote && remote.status === "blocked") {
          u.status = "blocked";
          saveUsers();
          session = null;
          saveSession();
          renderTopBar();
          if (config.authEnforced) openLoginModal(true);
          return;
        }
        if (remote && remote.role && u.role !== "admin" && u.role !== remote.role) {
          u.role = remote.role;
          saveUsers();
          renderTopBar();
        }
        // Chỉ tự khôi phục từ Cloud nếu trên Cloud thực sự có tiến độ học (> 0) còn máy hiện tại đang trống (= 0)
        const remoteHasProgress = (Number(remote?.vocabLearned) > 0 || Number(remote?.grammarDone) > 0);
        if (remote && remote.progressSnapshot && remoteHasProgress && vocabCount === 0 && grammarCount === 0 && !sessionStorage.getItem("s4_cloud_restored_" + u.username)) {
          const snap = remote.progressSnapshot;
          let restored = false;
          PROGRESS_KEYS.forEach(k => {
            if (snap[k]) { localStorage.setItem(k, snap[k]); restored = true; }
          });
          if (restored) {
            sessionStorage.setItem("s4_cloud_restored_" + u.username, "1");
            saveUserProfileProgress(u.username);
            location.reload();
            return;
          }
        }
      }

      const payload = {
        username: u.username,
        displayName: u.displayName || u.username,
        role: u.role,
        status: u.status || "active",
        vocabLearned: vocabCount,
        grammarDone: grammarCount,
        lastActive: new Date().toISOString()
      };
      if (vocabCount > 0 || grammarCount > 0) {
        payload.progressSnapshot = snapshotCurrentProgress();
      }
      await fetch(`${base}/study4_users/${u.username}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {}
  }

  async function pushCloudConfig() {
    if (!config.cloudDbUrl) return;
    try {
      const base = config.cloudDbUrl.replace(/\/+$/, "");
      await fetch(`${base}/study4_config.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authEnforced: config.authEnforced, updatedAt: new Date().toISOString() })
      });
    } catch (e) {}
  }

  function injectStyles() {
    if (document.getElementById("s4AuthStyles")) return;
    const st = document.createElement("style");
    st.id = "s4AuthStyles";
    st.textContent = `
      .s4-user-bar { background: linear-gradient(90deg, #0f172a, #1e293b); color: #f8fafc; padding: 6px 14px; font-size: 12.5px; display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; z-index: 900; border-bottom: 1px solid #334155; width: 100%; flex-shrink: 0; box-sizing: border-box; }
      .s4-user-left, .s4-user-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .s4-role-badge { padding: 2px 9px; border-radius: 999px; font-weight: 700; font-size: 11.5px; }
      .s4-role-admin { background: #dc2626; color: #fff; }
      .s4-role-vip { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; }
      .s4-role-basic { background: #334155; color: #cbd5e1; border: 1px solid #475569; }
      .s4-role-free { background: #0d9488; color: #fff; }
      .s4-top-btn { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.15s; }
      .s4-top-btn:hover { background: rgba(255,255,255,0.22); }
      .s4-top-btn.gold { background: linear-gradient(135deg, #f59e0b, #d97706); border: none; color: #fff; }
      .s4-modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.78); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 14px; }
      .s4-modal { background: #ffffff; color: #0f172a; width: 100%; max-width: 480px; border-radius: 18px; padding: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.35); max-height: 92vh; overflow-y: auto; border: 1px solid #e2e8f0; }
      .s4-modal.wide { max-width: 720px; }
      body.dark .s4-modal { background: #1e293b; color: #f8fafc; border-color: #334155; }
      .s4-modal h3 { margin: 0 0 6px 0; font-size: 20px; }
      .s4-input { width: 100%; padding: 11px 13px; border-radius: 10px; border: 1.5px solid #cbd5e1; background: #f8fafc; color: #0f172a; font-size: 14.5px; margin-bottom: 10px; outline: none; }
      body.dark .s4-input { background: #0f172a; color: #f8fafc; border-color: #334155; }
      .s4-input:focus { border-color: #2563eb; }
      .s4-btn { width: 100%; padding: 12px; border-radius: 10px; border: none; background: #2563eb; color: #fff; font-weight: 700; font-size: 14.5px; cursor: pointer; margin-top: 4px; }
      .s4-tabs { display: flex; gap: 6px; margin: 12px 0 16px 0; background: #f1f5f9; padding: 4px; border-radius: 10px; }
      body.dark .s4-tabs { background: #0f172a; }
      .s4-tab { flex: 1; text-align: center; padding: 8px; border-radius: 8px; font-weight: 700; font-size: 13.5px; cursor: pointer; border: none; background: transparent; color: #64748b; }
      .s4-tab.active { background: #2563eb; color: #fff; }
      .s4-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; }
      .s4-table th, .s4-table td { border-bottom: 1px solid #e2e8f0; padding: 8px 6px; text-align: left; }
      body.dark .s4-table th, body.dark .s4-table td { border-color: #334155; }
      .s4-lock-tag { display: inline-block; background: #fef3c7; color: #b45309; font-size: 11px; font-weight: 800; padding: 1px 6px; border-radius: 5px; margin-left: 5px; }
      .s4-key-box { background: #f0fdf4; border: 1.5px dashed #16a34a; color: #15803d; padding: 12px; border-radius: 10px; font-family: monospace; font-size: 15.5px; font-weight: 800; text-align: center; margin-top: 10px; word-break: break-all; }
      body.dark .s4-key-box { background: #064e3b; color: #dcfce7; }
      .s4-mode-banner { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 15px; border-radius: 12px; margin-bottom: 14px; font-size: 13.5px; flex-wrap: wrap; }
    `;
    document.head.appendChild(st);
  }

  function renderTopBar() {
    injectStyles();
    if (location.pathname.includes("/vocab/") || location.pathname.includes("/grammar/")) {
      const oldBar = document.getElementById("s4UserTopBar");
      if (oldBar) oldBar.remove();
      return;
    }
    const host = document.body;
    let bar = document.getElementById("s4UserTopBar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "s4UserTopBar";
      bar.className = "s4-user-bar";
      host.insertBefore(bar, host.firstChild);
    }

    const logoImg = `<img src="${getLogoPath()}" alt="Logo" style="width:22px;height:22px;border-radius:5px;vertical-align:middle;">`;
    const u = getCurrentUser();

    // Khi đang TẮT chế độ Quản lý (Chế độ Mở tự do thử nghiệm)
    if (!config.authEnforced) {
      bar.innerHTML = `
        <div class="s4-user-left">
          ${logoImg}
          <span class="s4-role-badge s4-role-free">🔓 Chế độ Thử nghiệm Tự do (Mở 100% nội dung)</span>
          ${u ? `<span>• 👤 <b>${u.displayName || u.username}</b></span>` : ""}
        </div>
        <div class="s4-user-right">
          ${u && u.role === "admin"
            ? `<button class="s4-top-btn gold" onclick="window.S4Auth.openAdminModal()">🛡️ Quản lý & Bật khóa mã</button>`
            : `<button class="s4-top-btn" onclick="window.S4Auth.openLoginModal(false)">👤 Tài khoản / Admin</button>`}
          <button class="s4-top-btn" onclick="window.S4Auth.openInstallModal()">📲 Cài App iOS/Android</button>
          ${u ? `<button class="s4-top-btn" onclick="window.S4Auth.logout()">Đăng xuất</button>` : ""}
        </div>
      `;
      return;
    }

    // Khi đang BẬT chế độ Quản lý
    if (!u) {
      bar.innerHTML = `
        <div class="s4-user-left">${logoImg} <span>🔒 Chưa đăng nhập</span></div>
        <div class="s4-user-right"><button class="s4-top-btn gold" onclick="window.S4Auth.openLoginModal(true)">Đăng nhập / Đăng ký</button></div>
      `;
      return;
    }

    const badge = u.role === "admin"
      ? `<span class="s4-role-badge s4-role-admin">🛡️ Admin</span>`
      : u.role === "vip"
      ? `<span class="s4-role-badge s4-role-vip">👑 VIP Full${u.expiresAt && u.expiresAt !== "PERM" ? " (" + u.expiresAt + ")" : ""}</span>`
      : `<span class="s4-role-badge s4-role-basic">🌱 Gói Cơ Bản (Dùng thử)</span>`;

    bar.innerHTML = `
      <div class="s4-user-left">
        ${logoImg}
        <span>👤 <b>${u.displayName || u.username}</b> (<code style="opacity:.85">${u.username}</code>)</span>
        ${badge}
      </div>
      <div class="s4-user-right">
        ${u.role === "basic" ? `<button class="s4-top-btn gold" onclick="window.S4Auth.openActivateModal()">🔑 Nhập Mã Kích Hoạt VIP</button>` : ""}
        ${u.role === "admin" ? `<button class="s4-top-btn gold" onclick="window.S4Auth.openAdminModal()">🛡️ Quản lý & Cấp mã</button>` : ""}
        <button class="s4-top-btn" onclick="window.S4Auth.openInstallModal()">📲 Cài App iOS/Android</button>
        <button class="s4-top-btn" onclick="window.S4Auth.logout()">Đăng xuất</button>
      </div>
    `;
  }

  function openLoginModal(forceLock = false) {
    injectStyles();
    closeModals();
    let mode = "login";
    const wrap = document.createElement("div");
    wrap.className = "s4-modal-backdrop";
    wrap.id = "s4AuthModal";

    function renderBox(errMsg = "") {
      wrap.innerHTML = `
        <div class="s4-modal">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:10px;">
              <img src="${getLogoPath()}" alt="Logo" style="width:36px;height:36px;border-radius:9px;">
              <h3 style="margin:0;">Study4 IELTS Account</h3>
            </div>
            ${!forceLock || !config.authEnforced || getCurrentUser() ? `<button class="s4-top-btn" style="color:inherit;" onclick="window.S4Auth.closeModals()">✕</button>` : ""}
          </div>
          <p style="font-size:13px;color:#64748b;margin:8px 0 12px 0;">
            Tiến độ học của bạn luôn được giữ nguyên. Tài khoản <b>Cơ bản</b> được học thử 2 chủ đề đầu; nhập <b>Mã Kích Hoạt VIP</b> để mở khóa toàn bộ 1,827 từ & 120 bài Grammar.
          </p>
          <div class="s4-tabs">
            <button class="s4-tab ${mode === "login" ? "active" : ""}" id="tabLogin">Đăng nhập</button>
            <button class="s4-tab ${mode === "register" ? "active" : ""}" id="tabReg">Tạo tài khoản mới</button>
          </div>
          ${errMsg ? `<div style="background:#fee2e2;color:#dc2626;padding:9px 12px;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:10px;">⚠️ ${errMsg}</div>` : ""}
          <form id="s4AuthForm">
            ${mode === "register" ? `<input class="s4-input" id="inpDisplay" placeholder="Họ tên hiển thị (VD: Minh Anh)" required>` : ""}
            <input class="s4-input" id="inpUser" placeholder="Tên đăng nhập (viết liền, VD: minhanh)" autocomplete="username" required>
            <input class="s4-input" id="inpPass" type="password" placeholder="Mật khẩu" autocomplete="current-password" required>
            ${mode === "register" ? `<input class="s4-input" id="inpActKey" placeholder="🔑 Mã Kích Hoạt VIP (Không bắt buộc - để trống nếu dùng thử)">` : ""}
            <button type="submit" class="s4-btn">${mode === "login" ? "🚀 Đăng nhập vào học" : "✨ Đăng ký & Vào học"}</button>
          </form>
        </div>
      `;

      wrap.querySelector("#tabLogin").onclick = () => { mode = "login"; renderBox(); };
      wrap.querySelector("#tabReg").onclick = () => { mode = "register"; renderBox(); };
      wrap.querySelector("#s4AuthForm").onsubmit = (ev) => {
        ev.preventDefault();
        const uname = normUser(wrap.querySelector("#inpUser").value);
        const pass = wrap.querySelector("#inpPass").value;
        if (!uname || uname.length < 3) return renderBox("Tên đăng nhập phải từ 3 ký tự chữ/số trở lên.");

        if (mode === "login") {
          const u = users[uname];
          if (!u || u.passwordHash !== simpleHash(pass)) {
            return renderBox("Tên đăng nhập hoặc mật khẩu không đúng.");
          }
          if (u.status === "blocked") {
            return renderBox("Tài khoản này đã bị quản trị viên khóa quyền truy cập.");
          }
          const prevUser = getCurrentUser();
          if (prevUser) saveUserProfileProgress(prevUser.username);
          session = { username: uname, loginAt: Date.now() };
          saveSession();
          loadUserProfileProgress(uname, true);
          syncCloudState();
          closeModals();
          location.reload();
        } else {
          if (users[uname]) return renderBox("Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác.");
          if (pass.length < 4) return renderBox("Mật khẩu phải từ 4 ký tự trở lên.");
          const disp = wrap.querySelector("#inpDisplay").value.trim() || uname;
          const actKey = (wrap.querySelector("#inpActKey")?.value || "").trim();

          let role = "basic";
          let expiresAt = "PERM";
          if (actKey) {
            const v = verifyActivationKey(actKey, uname);
            if (!v.ok) return renderBox(v.msg);
            role = "vip";
            expiresAt = v.expiresAt;
          }

          const prevUser = getCurrentUser();
          if (prevUser) saveUserProfileProgress(prevUser.username);
          users[uname] = {
            username: uname,
            passwordHash: simpleHash(pass),
            displayName: disp,
            role: role,
            status: "active",
            expiresAt: expiresAt,
            createdAt: new Date().toISOString().slice(0, 10)
          };
          saveUsers();
          session = { username: uname, loginAt: Date.now() };
          saveSession();
          loadUserProfileProgress(uname, true);
          syncCloudState();
          closeModals();
          location.reload();
        }
      };
    }

    renderBox();
    document.body.appendChild(wrap);
  }

  function openActivateModal(lockedTitle = "") {
    const u = getCurrentUser();
    if (!u) return openLoginModal(true);
    injectStyles();
    closeModals();

    const wrap = document.createElement("div");
    wrap.className = "s4-modal-backdrop";
    wrap.id = "s4AuthModal";
    wrap.innerHTML = `
      <div class="s4-modal">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3>👑 Mở Khóa Học Tiếp Toàn Bộ</h3>
          <button class="s4-top-btn" style="color:inherit;" onclick="window.S4Auth.closeModals()">✕</button>
        </div>
        ${lockedTitle ? `<div style="background:#fef3c7;color:#b45309;padding:10px 12px;border-radius:10px;font-size:13px;font-weight:600;margin:10px 0;">🔒 <b>${lockedTitle}</b> yêu cầu Mã Kích Hoạt VIP để học tiếp. Toàn bộ dữ liệu tiến độ đã học trước đó của bạn vẫn được giữ nguyên 100%!</div>` : ""}
        <p style="font-size:13.5px;line-height:1.5;color:#64748b;margin:8px 0 12px 0;">
          Tên tài khoản của bạn: <b style="color:#2563eb;font-size:15px;">${u.username}</b><br>
          <span style="font-size:12.5px;">${config.contactNote}</span>
        </p>
        <div id="actMsg" style="display:none;padding:9px 12px;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:10px;"></div>
        <input class="s4-input" id="inpKey" placeholder="Nhập mã kích hoạt (VD: S4VIP-${u.username.toUpperCase()}-PERM-XXXXXX)" style="font-family:monospace;text-transform:uppercase;">
        <button class="s4-btn" id="btnDoActivate">🔓 Kích Hoạt & Học Tiếp Ngay</button>
      </div>
    `;

    wrap.querySelector("#btnDoActivate").onclick = () => {
      const code = wrap.querySelector("#inpKey").value;
      const res = verifyActivationKey(code, u.username);
      const msgEl = wrap.querySelector("#actMsg");
      msgEl.style.display = "block";
      if (!res.ok) {
        msgEl.style.background = "#fee2e2";
        msgEl.style.color = "#dc2626";
        msgEl.textContent = "❌ " + res.msg;
        return;
      }
      u.role = "vip";
      u.expiresAt = res.expiresAt;
      saveUsers();
      syncCloudState();
      msgEl.style.background = "#dcfce7";
      msgEl.style.color = "#15803d";
      msgEl.textContent = "🎉 Kích hoạt VIP thành công! Đang mở khóa toàn bộ nội dung...";
      setTimeout(() => { closeModals(); location.reload(); }, 900);
    };

    document.body.appendChild(wrap);
  }

  function openAdminModal() {
    if (!isAdmin()) return;
    injectStyles();
    closeModals();

    let tab = "keygen";
    const wrap = document.createElement("div");
    wrap.className = "s4-modal-backdrop";
    wrap.id = "s4AuthModal";

    function renderAdmin() {
      const modeBannerHtml = config.authEnforced
        ? `<div class="s4-mode-banner" style="background:#fef3c7;color:#92400e;border:1px solid #f59e0b;">
             <div>
               <b>🔒 ĐANG BẬT CHẾ ĐỘ QUẢN LÝ (Yêu cầu Đăng nhập & Mã Kích Hoạt VIP)</b>
               <div style="font-size:12px;opacity:.9;">Người dùng giữ nguyên dữ liệu cũ nhưng phải có Mã Kích Hoạt mới học tiếp được từ Bài 3 trở đi.</div>
             </div>
             <button class="s4-top-btn" style="background:#0d9488;color:#fff;border:none;padding:8px 12px;" onclick="window.S4Auth.adminToggleEnforce(false)">🔓 Chuyển sang Mở tự do (Thử nghiệm)</button>
           </div>`
        : `<div class="s4-mode-banner" style="background:#dcfce7;color:#14532d;border:1px solid #22c55e;">
             <div>
               <b>🔓 ĐANG Ở CHẾ ĐỘ THỬ NGHIỆM TỰ DO (Không cần Đăng nhập / Mở 100%)</b>
               <div style="font-size:12px;opacity:.9;">Ai vào cũng học được toàn bộ. Khi bạn bật Quản lý lên, dữ liệu đã học vẫn giữ nguyên nhưng sẽ yêu cầu Mã Kích Hoạt để học tiếp.</div>
             </div>
             <button class="s4-top-btn" style="background:#dc2626;color:#fff;border:none;padding:8px 12px;" onclick="window.S4Auth.adminToggleEnforce(true)">🔒 Bật Quản lý & Yêu cầu Mã Kích Hoạt</button>
           </div>`;

      let bodyHtml = "";
      if (tab === "keygen") {
        bodyHtml = `
          <div style="background:#f8fafc;padding:14px;border-radius:12px;border:1px solid #e2e8f0;color:#0f172a;">
            <div style="font-weight:700;margin-bottom:8px;">🔑 Tạo Mã Kích Hoạt VIP cho bạn bè</div>
            <div style="font-size:12.5px;color:#64748b;margin-bottom:12px;">
              Nhập đúng <b>Tên tài khoản</b> mà bạn của bạn đã đăng ký trên máy họ (để mã chỉ dùng được cho đúng người đó, không gửi chùa cho người khác được), hoặc để trống nếu muốn tạo mã dùng chung.
            </div>
            <input class="s4-input" id="kgUser" placeholder="Tên tài khoản người nhận (VD: minhanh) — Để trống = Dùng chung">
            <select class="s4-input" id="kgExp">
              <option value="PERM">♾️ Vĩnh viễn (Không giới hạn ngày)</option>
              <option value="7">⏳ Có hạn 7 ngày (Dùng thử VIP)</option>
              <option value="30">📅 Có hạn 30 ngày (1 tháng)</option>
              <option value="90">📅 Có hạn 90 ngày (3 tháng)</option>
              <option value="365">📅 Có hạn 365 ngày (1 năm)</option>
            </select>
            <button class="s4-btn" id="btnGenKey">⚡ Sinh Mã Kích Hoạt</button>
            <div id="kgResult"></div>
          </div>
        `;
      } else if (tab === "users") {
        const rows = Object.values(users).map(item => `
          <tr>
            <td><b>${item.username}</b><br><span style="font-size:11.5px;color:#64748b;">${item.displayName || ""}</span></td>
            <td>
              <select onchange="window.S4Auth.adminSetRole('${item.username}', this.value)" style="padding:4px 6px;border-radius:6px;" ${item.username === "admin" ? "disabled" : ""}>
                <option value="basic" ${item.role === "basic" ? "selected" : ""}>🌱 Cơ bản</option>
                <option value="vip" ${item.role === "vip" ? "selected" : ""}>👑 VIP Full</option>
                <option value="admin" ${item.role === "admin" ? "selected" : ""}>🛡️ Admin</option>
              </select>
            </td>
            <td>
              <button class="s4-top-btn" style="background:${item.status === "blocked" ? "#dc2626" : "#16a34a"};color:#fff;" onclick="window.S4Auth.adminToggleBlock('${item.username}')" ${item.username === "admin" ? "disabled" : ""}>
                ${item.status === "blocked" ? "🚫 Đang khóa" : "✅ Hoạt động"}
              </button>
            </td>
            <td>
              ${item.username !== "admin" ? `<button class="s4-top-btn" style="background:#ef4444;color:#fff;" onclick="window.S4Auth.adminDeleteUser('${item.username}')">Xóa</button>` : ""}
            </td>
          </tr>
        `).join("");

        bodyHtml = `
          <div style="margin-bottom:14px;padding:12px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;color:#0f172a;">
            <div style="font-weight:700;margin-bottom:8px;">➕ Tạo nhanh tài khoản mới trên máy này</div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:6px;">
              <input class="s4-input" id="newU" placeholder="Username" style="margin:0;">
              <input class="s4-input" id="newP" placeholder="Mật khẩu" style="margin:0;">
              <select class="s4-input" id="newR" style="margin:0;">
                <option value="vip">👑 VIP Full</option>
                <option value="basic">🌱 Cơ bản</option>
              </select>
              <button class="s4-btn" id="btnAddU" style="width:auto;margin:0;padding:0 14px;">Thêm</button>
            </div>
          </div>
          <table class="s4-table">
            <thead><tr><th>Tài khoản</th><th>Quyền hạn</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        `;
      } else {
        bodyHtml = `
          <label style="font-size:13px;font-weight:700;">🔑 Đổi mật khẩu tài khoản Admin (Hiện tại: admin):</label>
          <input class="s4-input" id="admNewPass" type="password" placeholder="Nhập mật khẩu Admin mới (để trống nếu giữ nguyên)">
          <label style="font-size:13px;font-weight:700;">🛡️ Chuỗi khóa bí mật ký Mã Kích Hoạt (Secret Salt):</label>
          <input class="s4-input" id="admSalt" value="${config.secretSalt}">
          <label style="font-size:13px;font-weight:700;">📢 Lời nhắn hiển thị khi người dùng bấm vào bài bị khóa:</label>
          <input class="s4-input" id="admNote" value="${config.contactNote}">
          <label style="font-size:13px;font-weight:700;">☁️ Đường dẫn Firebase Realtime DB (Tùy chọn để điều khiển Bật/Tắt Quản lý từ xa cho mọi máy):</label>
          <input class="s4-input" id="admCloud" placeholder="https://ten-project-default-rtdb.firebaseio.com" value="${config.cloudDbUrl || ""}">
          <button class="s4-btn" id="btnSaveCfg">💾 Lưu Cấu Hình Quản Trị</button>
        `;
      }

      wrap.innerHTML = `
        <div class="s4-modal wide">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <img src="${getLogoPath()}" alt="Logo" style="width:32px;height:32px;border-radius:8px;">
              <h3 style="margin:0;">🛡️ Quản Trị Người Dùng & Chế Độ App</h3>
            </div>
            <button class="s4-top-btn" style="color:inherit;" onclick="window.S4Auth.closeModals()">✕</button>
          </div>
          ${modeBannerHtml}
          <div class="s4-tabs">
            <button class="s4-tab ${tab === "keygen" ? "active" : ""}" id="tKey">🔑 Cấp Mã Kích Hoạt</button>
            <button class="s4-tab ${tab === "users" ? "active" : ""}" id="tUsers">👥 Danh sách tài khoản</button>
            <button class="s4-tab ${tab === "settings" ? "active" : ""}" id="tCfg">⚙️ Cài đặt bảo mật</button>
          </div>
          ${bodyHtml}
        </div>
      `;

      wrap.querySelector("#tKey").onclick = () => { tab = "keygen"; renderAdmin(); };
      wrap.querySelector("#tUsers").onclick = () => { tab = "users"; renderAdmin(); };
      wrap.querySelector("#tCfg").onclick = () => { tab = "settings"; renderAdmin(); };

      if (tab === "keygen") {
        wrap.querySelector("#btnGenKey").onclick = () => {
          const u = wrap.querySelector("#kgUser").value;
          const expVal = wrap.querySelector("#kgExp").value;
          let expCode = "PERM";
          if (expVal !== "PERM") {
            const d = new Date();
            d.setDate(d.getDate() + Number(expVal));
            expCode = d.toISOString().slice(0, 10).replace(/-/g, "");
          }
          const key = generateActivationKey(u, expCode);
          wrap.querySelector("#kgResult").innerHTML = `
            <div class="s4-key-box">${key}</div>
            <button class="s4-btn" style="background:#16a34a;margin-top:8px;" onclick="navigator.clipboard.writeText('${key}');this.textContent='✅ Đã sao chép mã! Gửi cho bạn bè ngay'">📋 Sao chép Mã Kích Hoạt</button>
          `;
        };
      } else if (tab === "users") {
        wrap.querySelector("#btnAddU").onclick = () => {
          const u = normUser(wrap.querySelector("#newU").value);
          const p = wrap.querySelector("#newP").value;
          const r = wrap.querySelector("#newR").value;
          if (!u || !p) return alert("Vui lòng nhập đủ tên tài khoản và mật khẩu.");
          users[u] = { username: u, passwordHash: simpleHash(p), displayName: u, role: r, status: "active", expiresAt: "PERM", createdAt: new Date().toISOString().slice(0, 10) };
          saveUsers();
          renderAdmin();
        };
      } else if (tab === "settings") {
        wrap.querySelector("#btnSaveCfg").onclick = () => {
          const np = wrap.querySelector("#admNewPass").value;
          if (np && np.length >= 4) users["admin"].passwordHash = simpleHash(np);
          config.secretSalt = wrap.querySelector("#admSalt").value.trim() || DEFAULT_CONFIG.secretSalt;
          config.contactNote = wrap.querySelector("#admNote").value.trim() || DEFAULT_CONFIG.contactNote;
          config.cloudDbUrl = wrap.querySelector("#admCloud").value.trim();
          saveUsers();
          saveConfig();
          pushCloudConfig();
          alert("✅ Đã lưu cấu hình Quản trị viên!");
          renderAdmin();
        };
      }
    }

    renderAdmin();
    document.body.appendChild(wrap);
  }

  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  function openInstallModal() {
    injectStyles();
    closeModals();
    const wrap = document.createElement("div");
    wrap.className = "s4-modal-backdrop";
    wrap.id = "s4AuthModal";
    wrap.innerHTML = `
      <div class="s4-modal">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${getLogoPath()}" alt="Logo" style="width:36px;height:36px;border-radius:9px;">
            <h3 style="margin:0;">📲 Cài App vào Màn Hình Chính</h3>
          </div>
          <button class="s4-top-btn" style="color:inherit;" onclick="window.S4Auth.closeModals()">✕</button>
        </div>
        <div style="margin-top:12px;font-size:14px;line-height:1.6;">
          <div style="background:#eff6ff;color:#1e3a8a;padding:12px 14px;border-radius:12px;margin-bottom:12px;">
            <b>🍎 Trên iPhone / iPad (iOS):</b><br>
            1. Mở đường link này bằng trình duyệt <b>Safari</b>.<br>
            2. Bấm nút <b>Chia sẻ (Share - biểu tượng ô vuông có mũi tên hướng lên ⬆️)</b> ở thanh dưới cùng.<br>
            3. Cuộn xuống chọn <b>"Thêm vào Màn hình chính" (Add to Home Screen)</b> ➔ Bấm <b>Thêm (Add)</b>.<br>
            <i>✨ App sẽ xuất hiện ngoài màn hình chính với Logo mũ cử nhân STUDY4!</i>
          </div>
          <div style="background:#f0fdf4;color:#14532d;padding:12px 14px;border-radius:12px;">
            <b>🤖 Trên Điện thoại Android:</b><br>
            1. Mở đường link bằng trình duyệt <b>Chrome</b>.<br>
            2. Bấm biểu tượng <b>3 chấm dọc (⋮)</b> ở góc trên bên phải.<br>
            3. Chọn <b>"Thêm vào màn hình chính"</b> hoặc <b>"Cài đặt ứng dụng" (Install App)</b>.
            ${deferredPrompt ? `<button class="s4-btn" style="background:#16a34a;margin-top:10px;" id="btnNativeInstall">⚡ Cài đặt App ngay (1 chạm)</button>` : ""}
          </div>
        </div>
      </div>
    `;
    const btn = wrap.querySelector("#btnNativeInstall");
    if (btn && deferredPrompt) {
      btn.onclick = () => {
        deferredPrompt.prompt();
        deferredPrompt = null;
        closeModals();
      };
    }
    document.body.appendChild(wrap);
  }

  function closeModals() {
    document.querySelectorAll("#s4AuthModal").forEach(el => el.remove());
  }

  function canAccessVocabTopic(topicName, allTopicsList) {
    if (isFullAccess()) return true;
    if (topicName === "ALL" || topicName === "ALL_DUE") return false;
    const idx = allTopicsList.indexOf(topicName);
    return idx >= 0 && idx < (config.freeVocabTopicsCount || 2);
  }

  function canAccessGrammarSection(sectionIndexZeroBased) {
    if (isFullAccess()) return true;
    return sectionIndexZeroBased < (config.freeGrammarSectionsCount || 2);
  }

  window.S4Auth = {
    getCurrentUser,
    isFullAccess,
    isAdmin,
    canAccessVocabTopic,
    canAccessGrammarSection,
    openLoginModal,
    openActivateModal,
    openAdminModal,
    openInstallModal,
    closeModals,
    logout: function () {
      const cur = getCurrentUser();
      if (cur) saveUserProfileProgress(cur.username);
      session = null;
      saveSession();
      location.reload();
    },
    adminToggleEnforce: function (enforced) {
      if (!isAdmin()) return;
      config.authEnforced = !!enforced;
      saveConfig();
      pushCloudConfig();
      location.reload();
    },
    adminSetRole: function (uname, newRole) {
      if (!isAdmin() || !users[uname]) return;
      users[uname].role = newRole;
      saveUsers();
    },
    adminToggleBlock: function (uname) {
      if (!isAdmin() || !users[uname] || uname === "admin") return;
      users[uname].status = users[uname].status === "blocked" ? "active" : "blocked";
      saveUsers();
      openAdminModal();
    },
    adminDeleteUser: function (uname) {
      if (!isAdmin() || uname === "admin") return;
      if (!confirm("Xóa tài khoản " + uname + "?")) return;
      delete users[uname];
      saveUsers();
      openAdminModal();
    }
  };

  window.addEventListener("DOMContentLoaded", () => {
    renderTopBar();
    syncCloudState();
    const u = getCurrentUser();
    if (config.authEnforced && !u) {
      openLoginModal(true);
    }
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      if (window.caches) {
        caches.keys().then(keys => {
          keys.filter(k => k !== "study4-ielts-cache-v5").forEach(k => caches.delete(k));
        }).catch(() => {});
      }
      const swPath = location.pathname.includes("/vocab/") || location.pathname.includes("/grammar/") ? "../sw.js" : "./sw.js";
      navigator.serviceWorker.register(swPath).then(reg => reg.update()).catch(() => {});
    }
  });
  window.addEventListener("beforeunload", () => {
    const u = getCurrentUser();
    if (u) saveUserProfileProgress(u.username);
  });
})();
