/* ==========================================================================
   STUDIO GHIBLI & DUAL-AXIS THEME ENGINE (ghibli-theme.js)
   - Axis 1 (Theme Style):   🌿 Ghibli  | 🎨 Mặc định   (stored in 's4_theme_style')
   - Axis 2 (Lighting Mode): 🌙 Tối     | ☀️ Sáng       (stored in 's4_vocab_dark')
   - Axis 3 (Performance):   ⚡ Siêu Nhẹ / Mượt (stored in 's4_perf_lite')
   Optimized for ultra-smooth 60-120fps performance on mobile & budget devices.
   ========================================================================== */
(function () {
  const STYLE_KEY = 's4_theme_style'; // 'ghibli' | 'default'
  const DARK_KEY = 's4_vocab_dark';   // '1' (dark) | '0' (light)
  const LITE_KEY = 's4_perf_lite';    // '1' (ultra-fast lite) | '0' (rich effects)

  // Detect base path relative to root
  const pathParts = location.pathname.replace(/\\/g, '/').split('/');
  const inSubdir = ['vocab', 'grammar', 'reading', 'listening', 'tedtalks', 'writing', 'speaking'].some(
    d => pathParts.includes(d)
  );
  const assetPrefix = inSubdir ? '../assets/ghibli/' : 'assets/ghibli/';

  const GHIBLI_QUOTES = [
    '🌿 "Mỗi từ vựng hôm nay là một hạt mầm nở hoa trong khu rừng tri thức!"',
    '✨ "Cố lên nhé! Từng bước nhỏ sẽ đưa bạn đến đích IELTS mong muốn!"',
    '🍃 "Hãy cứ đi từng bước vững chãi, như Totoro đợi xe buýt mèo dưới cơn mưa."',
    '🔥 "Calcifer truyền lửa nhiệt huyết: Hôm nay hoàn thành thêm 1 bài học nhé!"',
    '🌸 "Dù gió có thổi mạnh thế nào, đôi cánh tri thức vẫn đưa bạn bay xa."'
  ];

  function isMobileDevice() {
    return (
      window.innerWidth <= 768 ||
      (typeof window.orientation !== 'undefined') ||
      (navigator.userAgent && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    );
  }

  function getSavedStyle() {
    const s = localStorage.getItem(STYLE_KEY);
    if (s === 'ghibli' || s === 'default') return s;
    return 'ghibli';
  }

  function getSavedDark() {
    const d = localStorage.getItem(DARK_KEY);
    if (d === '1' || d === '0') return d === '1';
    localStorage.setItem(DARK_KEY, '1');
    return true;
  }

  function getSavedLite() {
    const l = localStorage.getItem(LITE_KEY);
    if (l === '1') return true;
    if (l === '0') return false;
    // On mobile devices, default to Lite Mode (1) for zero lag!
    const defLite = isMobileDevice();
    localStorage.setItem(LITE_KEY, defLite ? '1' : '0');
    return defLite;
  }

  function applyThemeState() {
    const style = getSavedStyle();
    const isDark = getSavedDark();
    const isLite = getSavedLite();
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    htmlEl.classList.toggle('theme-ghibli', style === 'ghibli');
    htmlEl.classList.toggle('dark', isDark);
    htmlEl.classList.toggle('perf-lite', isLite);

    if (bodyEl) {
      bodyEl.classList.toggle('theme-ghibli', style === 'ghibli');
      bodyEl.classList.toggle('dark', isDark);
      bodyEl.classList.toggle('perf-lite', isLite);
    }

    // Update dock buttons active state
    document.querySelectorAll('.s4-theme-opt[data-style-opt]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-style-opt') === style);
    });
    document.querySelectorAll('.s4-theme-opt[data-light-opt]').forEach(btn => {
      const targetDark = btn.getAttribute('data-light-opt') === 'dark';
      btn.classList.toggle('active', targetDark === isDark);
    });
    document.querySelectorAll('.s4-theme-opt[data-lite-opt]').forEach(btn => {
      btn.classList.toggle('active', isLite);
      btn.title = isLite
        ? 'Chế độ Siêu Nhẹ: ĐANG BẬT (Tối ưu pin & mượt mà)'
        : 'Chế độ Siêu Nhẹ: TẮT (Hiệu ứng đầy đủ)';
    });

    // Toggle sky layer & soot sprites visibility based on Lite Mode
    const sky = document.getElementById('ghibliSkyLayer');
    if (sky) sky.style.display = (!isLite && style === 'ghibli' && !isMobileDevice()) ? 'block' : 'none';

    const stage = document.getElementById('ghibliSpritesStage');
    if (stage) stage.style.display = (!isLite && style === 'ghibli' && !isMobileDevice()) ? 'flex' : 'none';

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

  // Independent control 3: Toggle Lite / Performance Mode
  window.toggleLiteMode = function () {
    const nextLite = !getSavedLite();
    localStorage.setItem(LITE_KEY, nextLite ? '1' : '0');
    applyThemeState();
  };

  // Toggle dark/light only
  window.toggleDarkModeOnly = function () {
    const nextDark = !getSavedDark();
    localStorage.setItem(DARK_KEY, nextDark ? '1' : '0');
    applyThemeState();
  };

  // Toggle Dock minimize
  window.toggleThemeDockMinimize = function () {
    const dock = document.getElementById('s4ThemeDock');
    if (dock) dock.classList.toggle('minimized');
  };

  // Apply immediately on script load
  applyThemeState();

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

  function spawnKonpeitoBurst(x, y, count = 6) {
    if (getSavedLite() || isMobileDevice()) return; // Skip DOM particle burst in Lite/Mobile mode
    const icons = ['⭐', '✨', '🍬', '🌸', '🍃'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'konpeito-star';
      el.textContent = icons[i % icons.length];
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const dist = 30 + Math.random() * 40;
      const tx = Math.round(Math.cos(angle) * dist);
      const ty = Math.round(Math.sin(angle) * dist - 20);
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.setProperty('--tx', tx + 'px');
      el.style.setProperty('--ty', ty + 'px');
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 800);
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
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0008, audioCtx.currentTime + idx * 0.07 + 0.40);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.07);
        osc.stop(audioCtx.currentTime + idx * 0.07 + 0.42);
      });
    } catch (e) {}
  }

  function initGhibliUI() {
    if (!document.body) return;
    window.toggleDark = window.toggleDarkModeOnly;

    // 0. Dedicated Fixed Ghibli Watercolor Backdrop Layer
    if (!document.getElementById('ghibliBackdropLayer')) {
      const backdrop = document.createElement('div');
      backdrop.id = 'ghibliBackdropLayer';
      backdrop.className = 'ghibli-backdrop-layer';
      document.body.insertBefore(backdrop, document.body.firstChild);
    }

    // 1. Separated Dual-Control Floating Dock with Performance (Lite) Toggle
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
        <div class="s4-dock-sep"></div>
        <button class="s4-theme-opt" data-light-opt="dark" onclick="setLightMode('dark')" title="Chế độ Tối dịu mắt">
          <span class="s4-opt-icon">🌙</span><span class="s4-opt-text"> Tối</span>
        </button>
        <button class="s4-theme-opt" data-light-opt="light" onclick="setLightMode('light')" title="Chế độ Sáng">
          <span class="s4-opt-icon">☀️</span><span class="s4-opt-text"> Sáng</span>
        </button>
        <div class="s4-dock-sep"></div>
        <button class="s4-theme-opt" data-lite-opt="lite" onclick="toggleLiteMode()" title="Chế độ Siêu Nhẹ (Tối ưu pin & mượt mà trên điện thoại)">
          <span class="s4-opt-icon">⚡</span><span class="s4-opt-text"> Mượt</span>
        </button>
        <button class="s4-dock-toggle" onclick="toggleThemeDockMinimize()" title="Thu gọn / Mở rộng">▾</button>
      `;
      document.body.appendChild(dock);
    }

    // 2. Floating Ghibli Sky Layer (Leaves & Fireflies) — DESKTOP ONLY
    const isMob = isMobileDevice();
    if (!isMob && !document.getElementById('ghibliSkyLayer')) {
      const sky = document.createElement('div');
      sky.id = 'ghibliSkyLayer';
      sky.className = 'ghibli-sky-layer';
      const particles = ['🍃', '✨', '🌿', '🌼', '✨', '🍃'];
      sky.innerHTML = particles.map((p, i) => {
        const left = (i * 17 + 8) % 95;
        const dur = 18 + (i % 4) * 4;
        const delay = -(i * 2.5);
        const drift = (i % 2 === 0 ? 65 : -55) + 'px';
        return `<span class="ghibli-leaf" style="left:${left}%;animation-duration:${dur}s;animation-delay:${delay}s;--drift:${drift};">${p}</span>`;
      }).join('');
      document.body.appendChild(sky);
    }

    // 3. Interactive Soot Sprites (Susuwatari) — DESKTOP ONLY
    if (!isMob && !document.getElementById('ghibliSpritesStage')) {
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
          spawnKonpeitoBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
          playGhibliChime();
          const bubble = document.getElementById('sootSpeechBubble');
          if (bubble) {
            bubble.textContent = GHIBLI_QUOTES[Math.floor(Math.random() * GHIBLI_QUOTES.length)];
            bubble.classList.add('show');
            setTimeout(() => bubble.classList.remove('show'), 3200);
          }
        });
      });

      window.addEventListener('mousemove', (e) => {
        if (getSavedLite() || !document.documentElement.classList.contains('theme-ghibli')) return;
        const pupils = document.querySelectorAll('.soot-pupil');
        pupils.forEach(p => {
          const rect = p.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
          const ox = Math.cos(angle) * 2.0;
          const oy = Math.sin(angle) * 2.0;
          const baseCx = p.id.startsWith('pupilL') ? 23 : 37;
          p.setAttribute('cx', (baseCx + ox).toFixed(2));
          p.setAttribute('cy', (27 + oy).toFixed(2));
        });
      }, { passive: true });
    }

    // 4. Inject Ghibli Study Banner on Portal / Home (index.html)
    const portalWrap = document.getElementById('viewPortal');
    if (portalWrap && !document.getElementById('ghibliPortalBanner')) {
      const banner = document.createElement('div');
      banner.id = 'ghibliPortalBanner';
      banner.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 16px 20px;
        margin-bottom: 18px;
        border-radius: 20px;
        border: 1.5px solid var(--border);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        flex-wrap: wrap;
      `;
      banner.innerHTML = `
        <div style="max-width: 560px;">
          <div style="display:inline-flex;align-items:center;gap:6px;background:var(--primary-soft);color:var(--hl-green);font-size:11.5px;font-weight:800;padding:4px 10px;border-radius:99px;margin-bottom:6px;">
            <span>🌿 GÓC HỌC TẬP STUDIO GHIBLI</span>
          </div>
          <div style="font-size:17px;font-weight:800;color:var(--text);line-height:1.35;">
            Chào mừng bạn đến Khu Rừng Tri Thức IELTS & Ngoại Ngữ
          </div>
          <div id="ghibliBannerQuote" style="font-size:13px;color:var(--sub-text);margin-top:4px;font-weight:600;">
            ${GHIBLI_QUOTES[0]}
          </div>
        </div>
      `;
      portalWrap.insertBefore(banner, portalWrap.firstChild);
    }

    applyThemeState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGhibliUI);
  } else {
    initGhibliUI();
  }
})();
