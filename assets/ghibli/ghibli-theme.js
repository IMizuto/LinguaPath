/* ==========================================================================
   STUDIO GHIBLI & LIGHTING MODE ENGINE (ghibli-theme.js)
   - Style:    🌿 Ghibli  (default)
   - Lighting: 🌙 Tối     | ☀️ Sáng       (stored in 's4_vocab_dark')
   - Floating dock and soot sprites removed to keep UI 100% clean & fast!
   - Dark/Light toggle handled directly by the topbar 🌙 button.
   ========================================================================== */
(function () {
  const STYLE_KEY = 's4_theme_style'; // 'ghibli' | 'default'
  const DARK_KEY = 's4_vocab_dark';   // '1' (dark) | '0' (light)
  const LITE_KEY = 's4_perf_lite';    // '1' (lite) | '0' (rich)

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

  function applyThemeState() {
    const style = getSavedStyle();
    const isDark = getSavedDark();
    const isLite = isMobileDevice();
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

    // Update topbar moon/sun icons if present
    document.querySelectorAll('.dark-btn, [data-dark-toggle]').forEach(btn => {
      btn.textContent = isDark ? '🌙' : '☀️';
    });

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

  // Toggle Dark/Light Mode from topbar 🌙 button
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

    // 1. Inject Ghibli Study Banner on Portal / Home (index.html)
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
