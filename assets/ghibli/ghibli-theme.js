/* ==========================================================================
   STUDIO GHIBLI & DUAL-AXIS THEME ENGINE (ghibli-theme.js)
   - Axis 1 (Theme Style):   🌿 Ghibli  | 🎨 Mặc định   (stored in 's4_theme_style')
   - Axis 2 (Lighting Mode): 🌙 Tối     | ☀️ Sáng       (stored in 's4_vocab_dark')
   Both axes work independently so the user can use Ghibli Dark (Rừng Đêm)
   or Ghibli Light (Nắng Sớm), or Default Dark / Default Light at any time!
   ========================================================================== */
(function () {
  const STYLE_KEY = 's4_theme_style'; // 'ghibli' | 'default'
  const DARK_KEY = 's4_vocab_dark';   // '1' (dark) | '0' (light)
  const LITE_KEY = 's4_ghibli_lite';  // '1' (lite mode: tắt hiệu ứng nặng) | '0' (full)
  const DOCK_MIN_KEY = 's4_dock_min'; // '1' (thu gọn dock) | '0' (mở rộng)

  const FALLBACK_SVG_MAP = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z"/>',
    sparkle: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>'
  };

  function getSvgIcon(name, size) {
    if (window.S4UI && typeof window.S4UI.icon === 'function') {
      return window.S4UI.icon(name, size || 16);
    }
    const sz = size || 16;
    const body = FALLBACK_SVG_MAP[name] || FALLBACK_SVG_MAP.sparkle;
    return `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  function detectGlassTier() {
    const p = (location.pathname || '/').replace(/\\/g, '/').toLowerCase();
    const norm = p.replace(/\/index\.html?$/, '/');
    if (norm === '/' || /\/hsk\/?$/.test(norm) || /\/roadmap\/?$/.test(norm)) {
      return 'portal';
    }
    return 'study';
  }

  function ensureGlassTier() {
    const htmlEl = document.documentElement;
    if (htmlEl && !htmlEl.getAttribute('data-glass-tier')) {
      htmlEl.setAttribute('data-glass-tier', detectGlassTier());
    }
  }

  function renderThemeToggleBtn(btn, isDark) {
    if (!btn) return;
    if (window.S4UI && typeof window.S4UI.renderThemeButton === 'function') {
      window.S4UI.renderThemeButton(btn, isDark);
      return;
    }
    btn.innerHTML = getSvgIcon(isDark ? 'sun' : 'moon', 16);
    const label = isDark
      ? 'Đang ở chế độ Tối — Bấm để chuyển sang Sáng'
      : 'Đang ở chế độ Sáng — Bấm để chuyển sang Tối';
    btn.title = label;
    btn.setAttribute('aria-label', label);
    btn.setAttribute('data-mode', isDark ? 'dark' : 'light');
  }

  function syncDockToggleIcon(dock) {
    if (!dock) return;
    const toggleBtn = dock.querySelector('.s4-dock-toggle');
    if (!toggleBtn) return;
    const isMin = dock.classList.contains('minimized');
    const style = getSavedStyle();
    if (isMin) {
      toggleBtn.innerHTML = getSvgIcon(style === 'ghibli' ? 'leaf' : 'palette', 16);
      toggleBtn.title = 'Mở thanh tùy chỉnh giao diện';
      toggleBtn.setAttribute('aria-label', 'Mở thanh tùy chỉnh giao diện');
    } else {
      toggleBtn.innerHTML = getSvgIcon('chevronDown', 15);
      toggleBtn.title = 'Thu gọn thanh giao diện';
      toggleBtn.setAttribute('aria-label', 'Thu gọn thanh giao diện');
    }
  }

  // Tự động xác định thư mục chứa ghibli-theme.js (hoạt động chính xác ở mọi độ sâu thư mục)
  const currentScriptSrc = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src)
    ? document.currentScript.src
    : '';
  let assetPrefix = '';
  try {
    if (currentScriptSrc) assetPrefix = new URL('./', currentScriptSrc).href;
  } catch (e) {}
  if (!assetPrefix) {
    const pathParts = location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    const inNestedCourse = ['ielts', 'toeic', 'hsk'].some(d => pathParts.includes(d));
    const inSubdir = ['vocab', 'grammar', 'reading', 'listening', 'tedtalks', 'writing', 'speaking'].some(
      d => pathParts.includes(d)
    );
    assetPrefix = inNestedCourse ? '../../assets/ghibli/' : (inSubdir ? '../assets/ghibli/' : 'assets/ghibli/');
  }

  const GHIBLI_QUOTES = [
    '🌿 "Mỗi từ vựng hôm nay là một hạt mầm nở hoa trong khu rừng tri thức!"',
    '✨ "Cố lên nhé! Bồ hóng Susuwatari đang rắc kẹo sao Konpeito cổ vũ bạn!"',
    '🍃 "Hãy cứ đi từng bước nhỏ, như Totoro đợi xe buýt mèo dưới cơn mưa."',
    '🔥 "Calcifer truyền lửa nhiệt huyết: Hôm nay hoàn thành thêm 1 bài học nhé!"',
    '🌸 "Dù gió có thổi mạnh thế nào, đôi cánh tri thức vẫn đưa bạn bay xa."'
  ];

  function getSavedStyle() {
    const s = localStorage.getItem(STYLE_KEY);
    if (s === 'ghibli' || s === 'default') return s;
    return 'ghibli';
  }

  function getSavedDark() {
    const d = localStorage.getItem(DARK_KEY);
    if (d === '0' || d === 'false') return false;
    if (d === '1' || d === 'true') return true;
    // Default to Dark Mode ('1') so the screen is gentle on the eyes!
    localStorage.setItem(DARK_KEY, '1');
    return true;
  }

  function getSavedLite() {
    const l = localStorage.getItem(LITE_KEY);
    if (l === '1' || l === '0') return l === '1';
    // Tự động nhận diện thiết bị yếu (<= 4 CPU threads hoặc <= 4GB RAM)
    const isLowEnd = (typeof navigator !== 'undefined') && (
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4)
    );
    if (isLowEnd) {
      localStorage.setItem(LITE_KEY, '1');
      return true;
    }
    return false;
  }

  function applyThemeState() {
    ensureGlassTier();
    const style = getSavedStyle();
    const isDark = getSavedDark();
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    const isLite = getSavedLite();
    htmlEl.classList.toggle('theme-ghibli', style === 'ghibli');
    htmlEl.classList.toggle('dark', isDark);
    htmlEl.classList.toggle('ghibli-lite', isLite && style === 'ghibli');

    if (bodyEl) {
      bodyEl.classList.toggle('theme-ghibli', style === 'ghibli');
      bodyEl.classList.toggle('dark', isDark);
      bodyEl.classList.toggle('ghibli-lite', isLite && style === 'ghibli');
    }

    // Cập nhật trạng thái nút Chế độ Nhẹ
    const liteBtn = document.getElementById('btnGhibliLite');
    if (liteBtn) {
      liteBtn.style.display = style === 'ghibli' ? 'inline-flex' : 'none';
      liteBtn.classList.toggle('active', isLite);
      liteBtn.title = isLite ? "Chế độ Nhẹ: ĐANG BẬT (Đã tắt bớt hiệu ứng bay/mờ cho máy mượt)" : "Chế độ Nhẹ: ĐANG TẮT (Bấm để tắt hiệu ứng cho máy yếu)";
      const txt = liteBtn.querySelector('.s4-opt-text');
      if (txt) txt.textContent = isLite ? " Nhẹ" : " Đầy đủ";
      const icon = liteBtn.querySelector('.s4-opt-icon');
      if (icon) icon.innerHTML = getSvgIcon(isLite ? 'leaf' : 'sparkle', 14);
    }

    // Cập nhật nút Sáng/Tối trên Dock
    const dockLightBtn = document.getElementById('btnDockLightMode');
    if (dockLightBtn) {
      dockLightBtn.setAttribute('data-mode', isDark ? 'dark' : 'light');
      dockLightBtn.title = isDark ? 'Đang ở chế độ Tối — Bấm để chuyển sang Sáng' : 'Đang ở chế độ Sáng — Bấm để chuyển sang Tối';
      const icon = dockLightBtn.querySelector('.s4-opt-icon');
      if (icon) icon.innerHTML = getSvgIcon(isDark ? 'sun' : 'moon', 14);
      const txt = dockLightBtn.querySelector('.s4-opt-text');
      if (txt) txt.textContent = isDark ? ' Sáng' : ' Tối';
    }

    // Update dock buttons active state
    document.querySelectorAll('.s4-theme-opt[data-style-opt]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-style-opt') === style);
    });
    document.querySelectorAll('.s4-theme-opt[data-light-opt]').forEach(btn => {
      const targetDark = btn.getAttribute('data-light-opt') === 'dark';
      btn.classList.toggle('active', targetDark === isDark);
    });
    syncDockToggleIcon(document.getElementById('s4ThemeDock'));

    // Đồng bộ biểu tượng SVG Sáng / Tối trên tất cả các nút chuyển đổi giao diện (loại trừ nút Donate hoặc nút dock)
    document.querySelectorAll('button[onclick*="toggleDark"], .dark-btn, .theme-btn[onclick*="toggleDark"], .mode-btn[onclick*="toggleDark"], [data-lp-theme-toggle], [data-svg-toggle="theme"]').forEach(btn => {
      if (btn.classList.contains('s4-theme-opt') || btn.id === 'btnDockLightMode') return;
      if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('openDonateModal')) return;
      renderThemeToggleBtn(btn, isDark);
    });

    // Đồng bộ nút bật/tắt Ghibli Theme trên thanh topbar (ví dụ trang Writing)
    document.querySelectorAll('button[onclick*="toggleGhibliTheme"]').forEach(btn => {
      btn.innerHTML = getSvgIcon(style === 'ghibli' ? 'leaf' : 'palette', 16);
      btn.title = style === 'ghibli' ? 'Đang bật Giao diện Ghibli — Bấm để về Mặc định' : 'Đang dùng Giao diện Mặc định — Bấm để bật Ghibli';
    });

    // Cập nhật màu thanh trình duyệt (meta theme-color)
    const mt = document.getElementById('metaThemeColor');
    if (mt) {
      mt.setAttribute('content', isDark ? (style === 'ghibli' ? '#121e1a' : '#0f172a') : (style === 'ghibli' ? '#f4efe1' : '#f1f5f9'));
    }
  }

  // Independent control 1: Set Theme Style ('ghibli' | 'default')
  window.setThemeStyle = function (style) {
    localStorage.setItem(STYLE_KEY, style === 'ghibli' ? 'ghibli' : 'default');
    applyThemeState();
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(ensureGhibliFontAsync, { timeout: 1200 });
    } else {
      setTimeout(ensureGhibliFontAsync, 80);
    }
  };

  // Toggle between Ghibli and Default theme style
  window.toggleGhibliTheme = function () {
    window.setThemeStyle(getSavedStyle() === 'ghibli' ? 'default' : 'ghibli');
  };

  // Independent control 2: Set Lighting Mode ('dark' | 'light')
  window.setLightMode = function (mode) {
    const isDark = mode === 'dark';
    localStorage.setItem(DARK_KEY, isDark ? '1' : '0');
    applyThemeState();
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(ensureGhibliFontAsync, { timeout: 1200 });
    } else {
      setTimeout(ensureGhibliFontAsync, 80);
    }
  };

  // Toggle dark/light only (keeps current Ghibli/Default theme intact!)
  window.toggleDarkModeOnly = function () {
    const nextDark = !getSavedDark();
    localStorage.setItem(DARK_KEY, nextDark ? '1' : '0');
    applyThemeState();
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(ensureGhibliFontAsync, { timeout: 1200 });
    } else {
      setTimeout(ensureGhibliFontAsync, 80);
    }
  };

  // Toggle Chế độ Nhẹ cho Ghibli (Tắt bớt hiệu ứng cho máy yếu)
  window.toggleGhibliLite = function () {
    const nextLite = !getSavedLite();
    localStorage.setItem(LITE_KEY, nextLite ? '1' : '0');
    applyThemeState();
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(ensureGhibliFontAsync, { timeout: 1200 });
    } else {
      setTimeout(ensureGhibliFontAsync, 80);
    }
  };

  // Thu gọn / Mở rộng thanh Dock Ghibli ở góc phải dưới
  window.toggleThemeDockMinimize = function (forceState) {
    const dock = document.getElementById('s4ThemeDock');
    if (!dock) return;
    const nextMin = typeof forceState === 'boolean' ? forceState : !dock.classList.contains('minimized');
    dock.classList.toggle('minimized', nextMin);
    localStorage.setItem(DOCK_MIN_KEY, nextMin ? '1' : '0');
    syncDockToggleIcon(dock);
    const stage = document.getElementById('ghibliSpritesStage');
    if (stage) {
      stage.style.opacity = nextMin ? '0' : '';
      stage.style.pointerEvents = nextMin ? 'none' : '';
    }
  };

  // Khởi tạo / kích hoạt hiệu ứng Bồ Hóng cổ vũ hoạt động cả khi Dock thu gọn hoặc Ghibli Lite đang bật
  let lastCheerIdx = -1;
  window.triggerGhibliCheer = function (sourceEl) {
    let idx = Math.floor(Math.random() * GHIBLI_QUOTES.length);
    if (GHIBLI_QUOTES.length > 1 && idx === lastCheerIdx) {
      idx = (idx + 1) % GHIBLI_QUOTES.length;
    }
    lastCheerIdx = idx;
    const quote = GHIBLI_QUOTES[idx];

    playGhibliChime();

    // Xác định tâm tung kẹo sao Konpeito: ưu tiên Bồ Hóng nếu đang hiển thị, ngược lại lấy ngay tại nút bấm
    let burstX = Math.round(window.innerWidth / 2);
    let burstY = Math.round(window.innerHeight * 0.35);
    const stage = document.getElementById('ghibliSpritesStage');
    const sp = stage ? stage.querySelector('.soot-sprite') : null;
    const dock = document.getElementById('s4ThemeDock');
    const isLite = document.documentElement.classList.contains('ghibli-lite');
    const isMin = !!(dock && dock.classList.contains('minimized'));
    const spriteVisible = Boolean(
      sp && stage && !isLite && !isMin &&
      window.getComputedStyle(stage).display !== 'none' &&
      parseFloat(window.getComputedStyle(stage).opacity || '1') > 0.1
    );

    if (spriteVisible) {
      sp.classList.remove('jump');
      void sp.offsetWidth;
      sp.classList.add('jump');
      const r = sp.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        burstX = r.left + r.width / 2;
        burstY = r.top + r.height / 2;
      }
      const bubble = document.getElementById('sootSpeechBubble');
      if (bubble) {
        bubble.textContent = quote;
        bubble.classList.add('show');
        clearTimeout(bubble._hideT);
        bubble._hideT = setTimeout(() => bubble.classList.remove('show'), 3600);
      }
    } else if (sourceEl && typeof sourceEl.getBoundingClientRect === 'function') {
      const br = sourceEl.getBoundingClientRect();
      if (br.width > 0 && br.height > 0) {
        burstX = br.left + br.width / 2;
        burstY = br.top + br.height / 2;
      }
    }

    spawnKonpeitoBurst(burstX, burstY, 10);

    if (!spriteVisible) {
      if (window.S4UI && typeof window.S4UI.toast === 'function') {
        window.S4UI.toast('success', quote, { duration: 3200 });
      }
    }
  };

  // Gán ngay toggleDark và applyThemeState cho window để có thể gọi mọi lúc
  window.toggleDark = window.toggleDarkModeOnly;
  window.applyThemeState = applyThemeState;

  // Áp dụng trạng thái theme ngay lập tức khi file script tải
  applyThemeState();

  // 🔄 ĐỒNG BỘ THỜI GIAN THỰC GIỮA TẤT CẢ CÁC TAB / CỬA SỔ TRÌNH DUYỆT (Real-time Cross-tab Sync)
  window.addEventListener('storage', function (e) {
    if (!e) return;
    if (e.key === STYLE_KEY || e.key === DARK_KEY || e.key === LITE_KEY) {
      applyThemeState();
    }
    if (e.key === DOCK_MIN_KEY) {
      window.toggleThemeDockMinimize(e.newValue === '1');
    }
  });

  // Tự động kiểm tra và đồng bộ lại khi người dùng quay lại tab (focus / visibility)
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      applyThemeState();
    }
  });
  window.addEventListener('focus', function () {
    applyThemeState();
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(ensureGhibliFontAsync, { timeout: 1200 });
    } else {
      setTimeout(ensureGhibliFontAsync, 80);
    }
  });

  function buildSootSpriteSvg(idSuffix) {
    return `
      <svg viewBox="0 0 60 60" width="100%" height="100%">
        <g>
          <circle cx="30" cy="30" r="20" fill="#1c1917"/>
          <path d="M30 6 L32 11 L28 11 Z M30 54 L32 49 L28 49 Z M6 30 L11 32 L11 28 Z M54 30 L49 32 L49 28 Z
                   M13 13 L18 16 L15 19 Z M47 13 L42 16 L45 19 Z M13 47 L18 44 L15 41 Z M47 47 L42 44 L45 41 Z
                   M21 8 L24 13 L20 14 Z M39 8 L36 13 L40 14 Z M8 21 L13 24 L14 20 Z M52 21 L47 24 L46 20 Z
                   M21 52 L24 47 L20 46 Z M39 52 L36 47 L40 46 Z" fill="#1c1917"/>
          <circle cx="23" cy="27" r="6.2" fill="#ffffff"/>
          <circle class="soot-pupil" id="pupilL_${idSuffix}" cx="23" cy="27" r="2.7" fill="#090d16"/>
          <circle cx="37" cy="27" r="6.2" fill="#ffffff"/>
          <circle class="soot-pupil" id="pupilR_${idSuffix}" cx="37" cy="27" r="2.7" fill="#090d16"/>
        </g>
      </svg>
    `;
  }

  function spawnKonpeitoBurst(x, y, count = 8) {
    const icons = ['⭐', '✨', '🍬', '🌸', '🍃', '🌼'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'konpeito-star';
      el.textContent = icons[i % icons.length];
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const dist = 35 + Math.random() * 45;
      const tx = Math.round(Math.cos(angle) * dist);
      const ty = Math.round(Math.sin(angle) * dist - 25);
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.setProperty('--tx', tx + 'px');
      el.style.setProperty('--ty', ty + 'px');
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 920);
    }
  }

  let audioCtx = null;
  function playGhibliChime() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0008, audioCtx.currentTime + idx * 0.07 + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.07);
        osc.stop(audioCtx.currentTime + idx * 0.07 + 0.46);
      });
    } catch (e) {}
  }

  function ensureGhibliFontAsync() {
    try {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
      if (document.getElementById('lpQuicksandFontLink')) return;
      const link = document.createElement('link');
      link.id = 'lpQuicksandFontLink';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700;800&display=swap';
      link.media = 'print';
      link.onload = function () { link.media = 'all'; };
      document.head.appendChild(link);
    } catch (e) {}
  }

  function initGhibliUI() {
    if (!document.body) return;
    // Hook existing header dark-mode buttons so they toggle Dark/Light independently of Ghibli!
    window.toggleDark = window.toggleDarkModeOnly;

    // 0. Dedicated Fixed Ghibli Watercolor Backdrop Layer
    if (!document.getElementById('ghibliBackdropLayer')) {
      const backdrop = document.createElement('div');
      backdrop.id = 'ghibliBackdropLayer';
      backdrop.className = 'ghibli-backdrop-layer';
      document.body.insertBefore(backdrop, document.body.firstChild);
    }

    // 1. Separated Dual-Control Floating Dock (Theme: Ghibli / Mặc định | Mode: Sáng / Tối)
    if (!document.getElementById('s4ThemeDock')) {
      const isDark = getSavedDark();
      const isLite = getSavedLite();
      const dock = document.createElement('div');
      dock.id = 's4ThemeDock';
      dock.className = 's4-theme-dock';
      dock.innerHTML = `
        <button type="button" class="s4-theme-opt" data-style-opt="ghibli" onclick="event.stopPropagation();setThemeStyle('ghibli')" title="Chủ đề Studio Ghibli">
          <span class="s4-opt-icon">${getSvgIcon('leaf', 14)}</span><span class="s4-opt-text"> Ghibli</span>
        </button>
        <button type="button" class="s4-theme-opt" data-style-opt="default" onclick="event.stopPropagation();setThemeStyle('default')" title="Chủ đề Mặc định">
          <span class="s4-opt-icon">${getSvgIcon('palette', 14)}</span><span class="s4-opt-text"> Gốc</span>
        </button>
        <span class="s4-dock-sep" aria-hidden="true"></span>
        <button type="button" class="s4-theme-opt" id="btnDockLightMode" onclick="event.stopPropagation();toggleDarkModeOnly()" title="Đổi chế độ Sáng / Tối">
          <span class="s4-opt-icon">${getSvgIcon(isDark ? 'sun' : 'moon', 14)}</span><span class="s4-opt-text"> ${isDark ? 'Sáng' : 'Tối'}</span>
        </button>
        <button type="button" class="s4-theme-opt" id="btnGhibliLite" onclick="event.stopPropagation();toggleGhibliLite()" title="Bật/Tắt hiệu ứng chuyển động cho máy yếu">
          <span class="s4-opt-icon">${getSvgIcon(isLite ? 'leaf' : 'sparkle', 14)}</span><span class="s4-opt-text"> ${isLite ? 'Nhẹ' : 'Đầy đủ'}</span>
        </button>
        <button type="button" class="s4-dock-toggle" onclick="event.stopPropagation();toggleThemeDockMinimize()" title="Thu gọn thanh giao diện" aria-label="Thu gọn thanh giao diện" style="display:inline-flex;">${getSvgIcon('chevronDown', 15)}</button>
      `;
      document.body.appendChild(dock);
    }

    // 2. Floating Ghibli Sky Layer (Leaves & Fireflies)
    if (!document.getElementById('ghibliSkyLayer')) {
      const sky = document.createElement('div');
      sky.id = 'ghibliSkyLayer';
      sky.className = 'ghibli-sky-layer';
      const particles = ['🍃', '✨', '🌿', '🌼', '✨', '🍃', '🌸', '✨'];
      sky.innerHTML = particles.map((p, i) => {
        const left = (i * 13 + 7) % 95;
        const dur = 15 + (i % 5) * 3.5;
        const delay = -(i * 2.3);
        const drift = (i % 2 === 0 ? 75 : -65) + 'px';
        return `<span class="ghibli-leaf" style="left:${left}%;animation-duration:${dur}s;animation-delay:${delay}s;--drift:${drift};">${p}</span>`;
      }).join('');
      document.body.appendChild(sky);
    }

    // 3. Interactive Soot Sprites (Susuwatari) Stage — Placed at Bottom-Right above Dock
    if (!document.getElementById('ghibliSpritesStage')) {
      const stage = document.createElement('div');
      stage.id = 'ghibliSpritesStage';
      stage.className = 'ghibli-sprites-stage';
      stage.innerHTML = `
        <div class="soot-speech" id="sootSpeechBubble">✨ Bấm vào Bồ Hóng nhận kẹo sao may mắn!</div>
        <div class="soot-sprite" data-idx="0">${buildSootSpriteSvg(0)}</div>
        <div class="soot-sprite" data-idx="1">${buildSootSpriteSvg(1)}</div>
        <div class="soot-sprite" data-idx="2">${buildSootSpriteSvg(2)}</div>
      `;
      document.body.appendChild(stage);

      stage.querySelectorAll('.soot-sprite').forEach(sp => {
        sp.addEventListener('click', (ev) => {
          ev.stopPropagation();
          window.triggerGhibliCheer(sp);
        });
      });

      if (!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches)) {
        const pupilNodes = Array.from(stage.querySelectorAll('.soot-pupil')).map(p => ({
          el: p,
          baseCx: p.id.startsWith('pupilL') ? 23 : 37
        }));
        let pupilRafId = 0;
        let lastPtrX = 0;
        let lastPtrY = 0;
        window.addEventListener('mousemove', (e) => {
          const rootCls = document.documentElement.classList;
          if (document.hidden || !rootCls.contains('theme-ghibli') || rootCls.contains('ghibli-lite')) return;
          if (localStorage.getItem(DOCK_MIN_KEY) === '1') return;
          lastPtrX = e.clientX;
          lastPtrY = e.clientY;
          if (pupilRafId) return;
          pupilRafId = window.requestAnimationFrame(() => {
            pupilRafId = 0;
            const curCls = document.documentElement.classList;
            if (document.hidden || !curCls.contains('theme-ghibli') || curCls.contains('ghibli-lite')) return;
            const rects = pupilNodes.map(item => item.el.getBoundingClientRect());
            for (let i = 0; i < pupilNodes.length; i++) {
              const r = rects[i];
              if (!r.width && !r.height) continue;
              const angle = Math.atan2(lastPtrY - (r.top + r.height / 2), lastPtrX - (r.left + r.width / 2));
              pupilNodes[i].el.setAttribute('cx', (pupilNodes[i].baseCx + Math.cos(angle) * 2.1).toFixed(2));
              pupilNodes[i].el.setAttribute('cy', (27 + Math.sin(angle) * 2.1).toFixed(2));
            }
          });
        }, { passive: true });
      }
    }

    // Khôi phục trạng thái thu gọn của thanh Dock (Mặc định thu gọn gọn gàng ở <= 1366px để không bao giờ che nút Vào học)
    const savedMin = localStorage.getItem(DOCK_MIN_KEY);
    if (savedMin === '1' || (savedMin === null && window.innerWidth <= 1366)) {
      window.toggleThemeDockMinimize(true);
    }

    // Tự động ẩn Dock khi bàn phím di động đang mở (tránh che nút/ô nhập) & chỉ thu gọn khi bấm RA NGOÀI Dock
    if (!window.__s4DockGuardBound) {
      window.__s4DockGuardBound = true;
      document.addEventListener('focusin', (e) => {
        if (window.innerWidth > 768) return;
        const tag = e.target && e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.isContentEditable)) {
          if (document.body) document.body.classList.add('s4-kbd-open');
        }
      });
      document.addEventListener('focusout', () => {
        setTimeout(() => {
          const ae = document.activeElement;
          const tag = ae && ae.tagName;
          const stillEditing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (ae && ae.isContentEditable);
          if (!stillEditing && document.body) document.body.classList.remove('s4-kbd-open');
        }, 120);
      });
      document.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;
        const dock = document.getElementById('s4ThemeDock');
        if (!dock || dock.classList.contains('minimized')) return;
        const targetEl = e.target && e.target.nodeType === 1 ? e.target : null;
        if (targetEl && targetEl.closest('#s4ThemeDock, #ghibliSpritesStage')) return;
        window.toggleThemeDockMinimize(true);
      });
    }

    applyThemeState();
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(ensureGhibliFontAsync, { timeout: 1200 });
    } else {
      setTimeout(ensureGhibliFontAsync, 80);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGhibliUI);
  } else {
    initGhibliUI();
  }
})();
