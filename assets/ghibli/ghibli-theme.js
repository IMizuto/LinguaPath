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

  // Detect base path relative to root
  const pathParts = location.pathname.replace(/\\/g, '/').split('/');
  const inSubdir = ['vocab', 'grammar', 'reading', 'listening', 'tedtalks', 'writing', 'speaking'].some(
    d => pathParts.includes(d)
  );
  const assetPrefix = inSubdir ? '../assets/ghibli/' : 'assets/ghibli/';

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
    if (d === '1' || d === '0') return d === '1';
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
      if (icon) icon.textContent = isLite ? "🍃" : "✨";
    }

    // Update dock buttons active state
    document.querySelectorAll('.s4-theme-opt[data-style-opt]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-style-opt') === style);
    });
    document.querySelectorAll('.s4-theme-opt[data-light-opt]').forEach(btn => {
      const targetDark = btn.getAttribute('data-light-opt') === 'dark';
      btn.classList.toggle('active', targetDark === isDark);
    });

    // Đồng bộ biểu tượng Sáng (☀️) / Tối (🌙) trên tất cả các nút chuyển đổi giao diện (loại trừ nút Donate hoặc nút dock)
    document.querySelectorAll('button[onclick*="toggleDark"], .dark-btn, .theme-btn[onclick*="toggleDark"], .mode-btn[onclick*="toggleDark"]').forEach(btn => {
      if (btn.classList.contains('s4-theme-opt')) return;
      if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('openDonateModal')) return;
      btn.textContent = isDark ? '☀️' : '🌙';
      btn.title = isDark ? 'Đang ở chế độ Tối — Bấm để chuyển sang Sáng' : 'Đang ở chế độ Sáng — Bấm để chuyển sang Tối';
    });

    // Cập nhật màu thanh trình duyệt (meta theme-color)
    const mt = document.getElementById('metaThemeColor');
    if (mt) {
      mt.setAttribute('content', isDark ? (style === 'ghibli' ? '#121e1a' : '#0f172a') : (style === 'ghibli' ? '#f4efe1' : '#f1f5f9'));
    }

    // Update Portal Ghibli Banner visibility & dark/light appearance
    const bannerBox = document.getElementById('ghibliPortalBanner');
    if (bannerBox) {
      bannerBox.style.display = style === 'ghibli' ? 'flex' : 'none';
      if (isDark) {
        bannerBox.style.background = `linear-gradient(95deg, rgba(15, 29, 23, 0.94) 0%, rgba(20, 38, 30, 0.88) 58%, rgba(15, 29, 23, 0.45) 100%), url('${assetPrefix}ghibli_study_banner.jpg') center right / cover no-repeat`;
        bannerBox.style.borderColor = 'rgba(212, 163, 115, 0.4)';
      } else {
        bannerBox.style.background = `linear-gradient(95deg, rgba(254, 250, 240, 0.95) 0%, rgba(250, 243, 224, 0.88) 58%, rgba(254, 250, 240, 0.42) 100%), url('${assetPrefix}ghibli_study_banner.jpg') center right / cover no-repeat`;
        bannerBox.style.borderColor = '#cbb894';
      }
    }
  }

  // Independent control 1: Set Theme Style ('ghibli' | 'default')
  window.setThemeStyle = function (style) {
    localStorage.setItem(STYLE_KEY, style === 'ghibli' ? 'ghibli' : 'default');
    applyThemeState();
  };

  // Independent control 2: Set Lighting Mode ('dark' | 'light')
  window.setLightMode = function (mode) {
    const isDark = mode === 'dark';
    localStorage.setItem(DARK_KEY, isDark ? '1' : '0');
    applyThemeState();
  };

  // Toggle dark/light only (keeps current Ghibli/Default theme intact!)
  window.toggleDarkModeOnly = function () {
    const nextDark = !getSavedDark();
    localStorage.setItem(DARK_KEY, nextDark ? '1' : '0');
    applyThemeState();
  };

  // Toggle Chế độ Nhẹ cho Ghibli (Tắt bớt hiệu ứng cho máy yếu)
  window.toggleGhibliLite = function () {
    const nextLite = !getSavedLite();
    localStorage.setItem(LITE_KEY, nextLite ? '1' : '0');
    applyThemeState();
  };

  // Thu gọn / Mở rộng thanh Dock Ghibli ở góc phải dưới
  window.toggleThemeDockMinimize = function (forceState) {
    const dock = document.getElementById('s4ThemeDock');
    if (!dock) return;
    const nextMin = typeof forceState === 'boolean' ? forceState : !dock.classList.contains('minimized');
    dock.classList.toggle('minimized', nextMin);
    localStorage.setItem(DOCK_MIN_KEY, nextMin ? '1' : '0');
    const toggleBtn = dock.querySelector('.s4-dock-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = nextMin ? '' : '▾';
      toggleBtn.title = nextMin ? 'Mở thanh giao diện Ghibli' : 'Thu gọn thanh giao diện';
    }
    const stage = document.getElementById('ghibliSpritesStage');
    if (stage) {
      stage.style.opacity = nextMin ? '0' : '';
      stage.style.pointerEvents = nextMin ? 'none' : '';
    }
  };

  // Gán ngay toggleDark cho window để có thể gọi mọi lúc
  window.toggleDark = window.toggleDarkModeOnly;

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
      const dock = document.createElement('div');
      dock.id = 's4ThemeDock';
      dock.className = 's4-theme-dock';
      dock.innerHTML = `
        <button class="s4-theme-opt" data-style-opt="ghibli" onclick="setThemeStyle('ghibli')" title="Chủ đề Studio Ghibli">
          <span class="s4-opt-icon">🌿</span><span class="s4-opt-text"> Ghibli</span>
        </button>
        <button class="s4-theme-opt" data-style-opt="default" onclick="setThemeStyle('default')" title="Chủ đề Mặc định">
          <span class="s4-opt-icon">🎨</span><span class="s4-opt-text"> Gốc</span>
        </button>
        <button class="s4-theme-opt" id="btnGhibliLite" onclick="toggleGhibliLite()" title="Bật/Tắt hiệu ứng chuyển động cho máy yếu">
          <span class="s4-opt-icon">🍃</span><span class="s4-opt-text"> Nhẹ</span>
        </button>
        <button class="s4-dock-toggle" onclick="toggleThemeDockMinimize()" title="Thu gọn / Mở rộng" style="display:inline-flex;">▾</button>
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
        sp.addEventListener('click', () => {
          sp.classList.remove('jump');
          void sp.offsetWidth;
          sp.classList.add('jump');
          const rect = sp.getBoundingClientRect();
          spawnKonpeitoBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
          playGhibliChime();
          const bubble = document.getElementById('sootSpeechBubble');
          if (bubble) {
            bubble.textContent = GHIBLI_QUOTES[Math.floor(Math.random() * GHIBLI_QUOTES.length)];
            bubble.classList.add('show');
            setTimeout(() => bubble.classList.remove('show'), 3600);
          }
        });
      });

      window.addEventListener('mousemove', (e) => {
        if (!document.documentElement.classList.contains('theme-ghibli')) return;
        const pupils = document.querySelectorAll('.soot-pupil');
        pupils.forEach(p => {
          const rect = p.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
          const ox = Math.cos(angle) * 2.1;
          const oy = Math.sin(angle) * 2.1;
          const baseCx = p.id.startsWith('pupilL') ? 23 : 37;
          p.setAttribute('cx', (baseCx + ox).toFixed(2));
          p.setAttribute('cy', (27 + oy).toFixed(2));
        });
      }, { passive: true });
    }

    // 4. Inject Cozy Ghibli Study Banner on Portal / Home (index.html)
    const portalWrap = document.getElementById('viewPortal');
    if (portalWrap && !document.getElementById('ghibliPortalBanner')) {
      const banner = document.createElement('div');
      banner.id = 'ghibliPortalBanner';
      banner.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 18px 22px;
        margin-bottom: 18px;
        border-radius: 22px;
        border: 2px solid var(--border);
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.16);
        flex-wrap: wrap;
      `;
      banner.innerHTML = `
        <div style="max-width: 560px;">
          <div style="display:inline-flex;align-items:center;gap:6px;background:var(--primary-soft);color:var(--hl-green);font-size:11.5px;font-weight:800;padding:4px 10px;border-radius:99px;margin-bottom:6px;">
            <span>🌿 GÓC HỌC TẬP STUDIO GHIBLI</span>
          </div>
          <div style="font-size:18px;font-weight:800;color:var(--text);line-height:1.35;">
            Chào mừng bạn đến Khu Rừng Tri Thức IELTS & Ngoại Ngữ
          </div>
          <div id="ghibliBannerQuote" style="font-size:13.5px;color:var(--sub-text);margin-top:4px;font-weight:600;">
            ${GHIBLI_QUOTES[0]}
          </div>
        </div>
        <button onclick="document.querySelector('.soot-sprite')?.click()" style="background:var(--primary);color:#fff;border:none;padding:9px 15px;border-radius:99px;font-family:inherit;font-size:12.5px;font-weight:800;cursor:pointer;box-shadow:0 4px 12px rgba(45,106,79,0.28);">
          🍬 Gọi Bồ Hóng cổ vũ
        </button>
      `;
      portalWrap.insertBefore(banner, portalWrap.firstChild);
    }

    // Khôi phục trạng thái thu gọn của thanh Dock (Trên điện thoại <= 768px tự động thu gọn mặc định để không che chữ)
    const savedMin = localStorage.getItem(DOCK_MIN_KEY);
    if (savedMin === '1' || (savedMin === null && window.innerWidth <= 768)) {
      window.toggleThemeDockMinimize(true);
    }

    applyThemeState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGhibliUI);
  } else {
    initGhibliUI();
  }
})();
