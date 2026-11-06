/* ==========================================================================
   STUDIO GHIBLI & LIGHTING MODE & LIQUID GLASS ENGINE (ghibli-theme.js)
   - Style:    🌿 Ghibli (default) | 🎨 Mặc định
   - Lighting: 🌙 Tối (default)   | ☀️ Sáng
   - Effects:  ✨ Bật (default)   | 💤 Tắt (Tối ưu tối đa 60-120fps cho máy yếu)
   - Liquid Glass: Frosted translucency & specular glow
   ========================================================================== */
(function () {
  const STYLE_KEY = 's4_theme_style';    // 'ghibli' | 'default'
  const DARK_KEY = 's4_vocab_dark';      // '1' (dark) | '0' (light)
  const EFFECTS_KEY = 's4_effects_enabled'; // '1' (rich) | '0' (off/lite)
  const DOCK_MIN_KEY = 's4_theme_dock_min'; // '1' (minimized) | '0' (expanded)

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
    '🌸 "Dù gió có thổi mạnh thế nào, đôi cánh tri thức vẫn đưa bạn bay xa."',
    '⭐ "Bồ Hóng tặng bạn kẹo sao may mắn: Chúc bạn học tập thăng hoa!"'
  ];

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

  function getSavedEffects() {
    const fx = localStorage.getItem(EFFECTS_KEY);
    if (fx === '1' || fx === '0') return fx === '1';
    return true; // default enabled
  }

  function getDockMinimized() {
    return localStorage.getItem(DOCK_MIN_KEY) === '1';
  }

  let leavesTimer = null;

  function showThemeToast(msg) {
    let toast = document.getElementById('s4GlobalThemeToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 's4GlobalThemeToast';
      toast.style.cssText = `
        position: fixed;
        top: 18px;
        left: 50%;
        transform: translateX(-50%) translateY(-10px);
        background: rgba(15, 23, 42, 0.92);
        color: #ffffff;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1.5px solid rgba(255, 255, 255, 0.25);
        padding: 9px 18px;
        border-radius: 999px;
        font-size: 13.5px;
        font-weight: 700;
        z-index: 99999;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.22s ease, transform 0.22s ease;
        text-align: center;
        max-width: 90vw;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    if (window._s4ToastTimer) clearTimeout(window._s4ToastTimer);
    window._s4ToastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-10px)';
    }, 2400);
  }

  function applyThemeState() {
    const style = getSavedStyle();
    const isDark = getSavedDark();
    const fxEnabled = getSavedEffects();
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    htmlEl.classList.toggle('theme-ghibli', style === 'ghibli');
    htmlEl.classList.toggle('dark', isDark);
    htmlEl.classList.toggle('fx-enabled', fxEnabled);
    htmlEl.classList.toggle('fx-disabled', !fxEnabled);

    if (bodyEl) {
      bodyEl.classList.toggle('theme-ghibli', style === 'ghibli');
      bodyEl.classList.toggle('dark', isDark);
      bodyEl.classList.toggle('fx-enabled', fxEnabled);
      bodyEl.classList.toggle('fx-disabled', !fxEnabled);
    }

    // Update Dock options active states
    document.querySelectorAll('.s4-theme-opt[data-style-opt]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-style-opt') === style);
    });
    document.querySelectorAll('.s4-theme-opt[data-light-opt]').forEach(btn => {
      const targetDark = btn.getAttribute('data-light-opt') === 'dark';
      btn.classList.toggle('active', targetDark === isDark);
    });
    document.querySelectorAll('.s4-theme-opt[data-fx-opt]').forEach(btn => {
      btn.classList.toggle('active', fxEnabled);
      const textSpan = btn.querySelector('.s4-opt-text');
      if (textSpan) textSpan.textContent = fxEnabled ? ' Hiệu ứng: Bật' : ' Hiệu ứng: Tắt';
    });

    // Update topbar icons
    document.querySelectorAll('.dark-btn, [data-dark-toggle]').forEach(btn => {
      btn.textContent = isDark ? '🌙' : '☀️';
    });
    document.querySelectorAll('[data-effects-toggle]').forEach(btn => {
      btn.textContent = fxEnabled ? '✨' : '💤';
      btn.title = fxEnabled ? 'Hiệu ứng: Đang Bật (Bấm để tắt)' : 'Hiệu ứng: Đang Tắt (Bấm để bật)';
    });

    // Handle leaves animation
    manageLeaves(style === 'ghibli' && fxEnabled);

    // Update Portal Ghibli Banner
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

  // Toggle Dark/Light
  window.toggleDarkModeOnly = function () {
    const nextDark = !getSavedDark();
    localStorage.setItem(DARK_KEY, nextDark ? '1' : '0');
    applyThemeState();
  };
  window.toggleDark = window.toggleDarkModeOnly;

  window.setThemeStyle = function (style) {
    localStorage.setItem(STYLE_KEY, style === 'ghibli' ? 'ghibli' : 'default');
    applyThemeState();
  };

  window.setLightMode = function (mode) {
    localStorage.setItem(DARK_KEY, mode === 'dark' ? '1' : '0');
    applyThemeState();
  };

  // Toggle Animation Effects (Leaves, Soot Sprites, Stars, Frosted Blur)
  window.toggleEffects = function () {
    const nextFx = !getSavedEffects();
    localStorage.setItem(EFFECTS_KEY, nextFx ? '1' : '0');
    applyThemeState();
    if (nextFx) {
      showThemeToast('✨ Hiệu ứng: ĐÃ BẬT (Kính lỏng, Lá bay, Bồ hóng)');
    } else {
      showThemeToast('💤 Hiệu ứng: ĐÃ TẮT (Tối ưu mượt mà 60-120 FPS)');
    }
  };

  // Toggle Dock Minimized
  window.toggleThemeDockMinimize = function () {
    const dock = document.getElementById('s4ThemeDock');
    if (!dock) return;
    const isMin = dock.classList.toggle('minimized');
    localStorage.setItem(DOCK_MIN_KEY, isMin ? '1' : '0');
  };

  // Falling leaves manager
  function manageLeaves(start) {
    const sky = document.getElementById('ghibliSkyLayer');
    if (!start) {
      if (leavesTimer) { clearInterval(leavesTimer); leavesTimer = null; }
      if (sky) sky.innerHTML = '';
      return;
    }
    if (!sky || leavesTimer) return;
    const leafIcons = ['🍃', '🍂', '🍁', '🌸', '✨'];
    leavesTimer = setInterval(() => {
      if (document.hidden || !document.documentElement.classList.contains('fx-enabled')) return;
      if (sky.children.length >= 7) return; // Cap at 7 leaves for high FPS
      const leaf = document.createElement('div');
      leaf.className = 'ghibli-leaf';
      leaf.textContent = leafIcons[Math.floor(Math.random() * leafIcons.length)];
      leaf.style.left = Math.random() * 96 + '%';
      const dur = 7 + Math.random() * 6;
      leaf.style.animationDuration = dur + 's';
      leaf.style.fontSize = (12 + Math.random() * 8) + 'px';
      sky.appendChild(leaf);
      setTimeout(() => leaf.remove(), dur * 1000);
    }, 2800);
  }

  // Soot Sprite SVG Generator
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

  // Star Burst Animation (Konpeito)
  function spawnKonpeitoBurst(x, y, count = 8) {
    if (!getSavedEffects()) return;
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
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      if (!audioCtx) audioCtx = new AudioCtxClass();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.04, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.36);
      });
    } catch (e) {}
  }

  // Apply immediately on script load
  applyThemeState();

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

    // 1. Sky Layer for Falling Leaves
    if (!document.getElementById('ghibliSkyLayer')) {
      const sky = document.createElement('div');
      sky.id = 'ghibliSkyLayer';
      sky.className = 'ghibli-sky-layer';
      document.body.appendChild(sky);
    }

    // 2. Liquid Glass Theme Dock (Screenshot 1: Ghibli | Gốc | Tối | Sáng | ✨ Hiệu ứng)
    if (!document.getElementById('s4ThemeDock')) {
      const dock = document.createElement('div');
      dock.id = 's4ThemeDock';
      dock.className = 's4-theme-dock' + (getDockMinimized() ? ' minimized' : '');
      dock.innerHTML = `
        <button class="s4-theme-opt" data-style-opt="ghibli" onclick="setThemeStyle('ghibli')" title="Chủ đề Studio Ghibli">
          <span class="s4-opt-icon">🌿</span><span class="s4-opt-text"> Ghibli</span>
        </button>
        <button class="s4-theme-opt" data-style-opt="default" onclick="setThemeStyle('default')" title="Chủ đề Gốc">
          <span class="s4-opt-icon">🎨</span><span class="s4-opt-text"> Gốc</span>
        </button>
        <div class="s4-dock-sep"></div>
        <button class="s4-theme-opt" data-light-opt="dark" onclick="setLightMode('dark')" title="Chế độ Tối">
          <span class="s4-opt-icon">🌙</span><span class="s4-opt-text"> Tối</span>
        </button>
        <button class="s4-theme-opt" data-light-opt="light" onclick="setLightMode('light')" title="Chế độ Sáng">
          <span class="s4-opt-icon">☀️</span><span class="s4-opt-text"> Sáng</span>
        </button>
        <div class="s4-dock-sep"></div>
        <button class="s4-theme-opt" data-fx-opt="1" onclick="toggleEffects()" title="Bật / Tắt Hiệu ứng (Lá bay, Bồ hóng, Kính lỏng)">
          <span class="s4-opt-icon">✨</span><span class="s4-opt-text"> Hiệu ứng</span>
        </button>
        <button class="s4-dock-toggle" onclick="toggleThemeDockMinimize()" title="Thu gọn / Mở rộng">▾</button>
      `;
      document.body.appendChild(dock);
    }

    // 3. Interactive Soot Sprites (Susuwatari) Stage
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

      // Eyes track mouse cursor with requestAnimationFrame throttle
      let mouseTicking = false;
      window.addEventListener('mousemove', (e) => {
        if (!mouseTicking && document.documentElement.classList.contains('theme-ghibli') && document.documentElement.classList.contains('fx-enabled')) {
          mouseTicking = true;
          requestAnimationFrame(() => {
            document.querySelectorAll('.soot-pupil').forEach(p => {
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
            mouseTicking = false;
          });
        }
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

    // 5. Observer for correct answers -> celebrate with konpeito stars!
    const observer = new MutationObserver((mutations) => {
      if (!document.documentElement.classList.contains('theme-ghibli') || !document.documentElement.classList.contains('fx-enabled')) return;
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class' && m.target.classList?.contains('correct')) {
          const rect = m.target.getBoundingClientRect();
          if (rect.width > 0) {
            spawnKonpeitoBurst(rect.left + rect.width / 2, rect.top, 6);
          }
          break;
        }
      }
    });
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });

    applyThemeState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGhibliUI);
  } else {
    initGhibliUI();
  }
})();
