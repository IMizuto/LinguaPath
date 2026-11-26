/* LinguaPath - Fundamental Vocabulary SRS Engine (Shared Module for Listening & Reading)
 * Đồng bộ 100% cơ chế học từ vựng của phần Vocabulary Fundamental (vocab/index.html):
 * - 7 chế độ: Học thông minh (Smart 4 bước trộn ngẫu nhiên), Flashcard (4 mức SM-2), Trắc nghiệm (Anh-Việt/Việt-Anh/Trộn),
 *   Luyện nghe (Chọn từ/Chính tả), Ghép cặp (6 cặp), Điền từ vào ngữ cảnh (Cloze), Danh sách từ (4 bộ lọc).
 * - Thống kê Hôm nay / Đã học / Cần ôn, bảng Chi tiết 5 cột, Lịch chuỗi ngày học, Cài đặt hạn mức từ mới/ngày.
 * - Bài tập điền từ / chính tả: Tô xanh nhẹ ô đúng, tô đỏ nhẹ ô sai kèm đáp án đúng, không tự động chuyển câu khi sai.
 */
(function () {
  "use strict";

  const DEFAULT_SETTINGS = {
    dailyNewLimit: 20,
    reviewCap: 100,
    autoAudio: true,
    queueOrder: "mix",
    bonusTodayDate: "",
    bonusTodayCount: 0
  };

  let cfg = {
    srsKey: "s4_vocab_srs_v1",
    daysKey: "s4_vocab_days_v2",
    settingsKey: "s4_vocab_settings_v2",
    sessionKey: "",
    getSrsMap: () => ({}),
    onSaveSrs: () => {},
    playWordAudio: () => {},
    getExtraModeButtonsHtml: () => ""
  };

  let dayLog = {};
  let userSettings = Object.assign({}, DEFAULT_SETTINGS);
  let words = [];
  let wordsById = new Map();
  let currentLessonId = "";
  let currentTopicTitle = "";
  let mountContainerId = "";

  let currentMode = "smart"; // 'smart' | 'flashcard' | 'quiz' | 'listen' | 'match' | 'cloze' | 'list'
  let dueOnlyMode = false;
  let quizDirection = "mix";
  let listenSubMode = "choice";
  let listFilter = "all";
  let listLimit = 100;
  let listSearch = "";
  let wordSearchIndex = null;
  let panel = ""; // '' | 'stats' | 'calendar' | 'settings'
  let calMonthOffset = 0;

  const FALLBACK_SVG = {
    graduation: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    listening: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    reading: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    sparkle: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    refresh: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    keyboard: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.001"/><path d="M10 8h.001"/><path d="M14 8h.001"/><path d="M18 8h.001"/><path d="M8 12h.001"/><path d="M12 12h.001"/><path d="M16 12h.001"/><path d="M7 16h10"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'
  };

  function vIcon(name, size, extraClass) {
    if (window.S4UI && typeof window.S4UI.icon === "function" && name !== "plus") {
      return window.S4UI.icon(name, size, extraClass);
    }
    const sz = Number(size) > 0 ? Number(size) : 15;
    const body = FALLBACK_SVG[name] || FALLBACK_SVG.sparkle;
    const cls = extraClass ? ` class="${extraClass}"` : "";
    return `<svg${cls} width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  let studyQueue = [];
  let sessionTotal = 0;
  let sessionDone = 0;
  let extraPracticeMode = false;
  let isFlipped = false;
  let cardSerial = 0;
  let cardCache = {};
  let lastPlayedSerial = -1;
  let smartTick = 0;
  let lastSmartWordId = "";
  let tapLockAt = 0;
  let matchSelected = null;
  let ansToastTimer = null;

  function injectStyles() {
    if (document.getElementById("s4VocabEngineStyles")) return;
    const st = document.createElement("style");
    st.id = "s4VocabEngineStyles";
    st.textContent = `
      .s4v-wrap { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 860px; margin: 0 auto; }
      .s4v-mode-bar { display: flex; gap: 6px; overflow-x: auto; padding: 8px 10px; background: var(--lg-surface, var(--card, var(--panel))); backdrop-filter: var(--lg-blur, blur(12px)); -webkit-backdrop-filter: var(--lg-blur, blur(12px)); border: 1px solid var(--lg-hairline, var(--border)); border-radius: 16px; scrollbar-width: none; align-items: center; flex-wrap: wrap; }
      .s4v-mode-btn { display: inline-flex; align-items: center; justify-content: center; gap: 5px; padding: 7px 12px; border-radius: 999px; border: 1px solid var(--lg-hairline, var(--border)); background: var(--lg-wash, var(--bg, var(--box-sub))); color: var(--lg-ink, var(--text)); font-weight: 600; font-size: 13px; cursor: pointer; white-space: nowrap; transition: all 0.15s ease; }
      .s4v-mode-btn:hover { border-color: var(--primary); }
      .s4v-mode-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); font-weight: 700; }

      .s4v-stats-card { background: var(--lg-surface, var(--card, var(--panel))); backdrop-filter: var(--lg-blur, blur(12px)); -webkit-backdrop-filter: var(--lg-blur, blur(12px)); border-radius: 16px; padding: 10px 14px; border: 1px solid var(--lg-hairline, var(--border)); }
      .s4v-stats-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
      .s4v-quota-pill { display: inline-flex; align-items: center; gap: 4px; background: rgba(37, 99, 235, 0.14); color: var(--primary); padding: 4px 10px; border-radius: 999px; font-weight: 700; font-size: 12.5px; }
      .s4v-stats-mini { display: inline-flex; gap: 12px; font-size: 13px; font-weight: 600; color: var(--muted); align-items: center; flex-wrap: wrap; }
      .s4v-stat-chip { display: inline-flex; align-items: center; gap: 4px; }
      .s4v-stats-btns { display: flex; gap: 6px; }
      .s4v-stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; text-align: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--lg-divider, var(--border)); }
      .s4v-stat-num { font-size: 18px; font-weight: 800; }
      .s4v-stat-label { font-size: 11.5px; color: var(--muted); }
      .s4v-panel { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--lg-divider, var(--border)); display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center; font-size: 13px; }
      .s4v-limit-select { padding: 5px 8px; border-radius: 8px; border: 1px solid var(--lg-hairline, var(--border)); background: var(--lg-wash, var(--bg, var(--box-sub))); color: var(--lg-ink, var(--text)); font-weight: 600; font-size: 13px; }

      .s4v-cal-wrap { width: 100%; max-width: 340px; }
      .s4v-cal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .s4v-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
      .s4v-cal-dow { text-align: center; font-size: 11px; color: var(--muted); font-weight: 700; }
      .s4v-cal-day { aspect-ratio: 1; border-radius: 7px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; background: var(--border); color: var(--text); line-height: 1.1; }
      .s4v-cal-day span { font-size: 9px; font-weight: 700; }
      .s4v-cal-day.lv1 { background: rgba(22,163,74,.30); }
      .s4v-cal-day.lv2 { background: rgba(22,163,74,.55); }
      .s4v-cal-day.lv3 { background: rgba(22,163,74,.78); color: #fff; }
      .s4v-cal-day.lv4 { background: #15803d; color: #fff; }
      .s4v-cal-day.today { outline: 2px solid var(--primary); outline-offset: 1px; }
      .s4v-cal-foot { display: flex; flex-wrap: wrap; gap: 6px 14px; margin-top: 10px; font-size: 12px; color: var(--muted); align-items: center; }
      .s4v-cal-legend { display: inline-flex; align-items: center; gap: 3px; }
      .s4v-cal-legend i { display: inline-block; width: 13px; height: 13px; border-radius: 3px; }

      .s4v-sess-row { display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; color: var(--muted); margin-bottom: 5px; }
      .s4v-sess-bar { height: 5px; background: var(--border); border-radius: 4px; overflow: hidden; margin-bottom: 10px; }
      .s4v-sess-bar i { display: block; height: 100%; background: var(--primary); transition: width .3s; }

      .s4v-card-box { background: var(--lg-surface, var(--card, var(--panel))); backdrop-filter: var(--lg-blur, blur(12px)); -webkit-backdrop-filter: var(--lg-blur, blur(12px)); border-radius: 18px; border: 1px solid var(--lg-hairline, var(--border)); padding: 18px 20px; box-shadow: var(--lg-shadow, 0 6px 24px rgba(0,0,0,0.06)); max-width: 100%; box-sizing: border-box; overflow-x: hidden; overflow-wrap: anywhere; }
      .s4v-top-bar { display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; color: var(--muted); margin-bottom: 12px; gap: 8px; flex-wrap: wrap; }
      .s4v-tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 700; }
      .s4v-tag.new { background: rgba(37,99,235,.16); color: var(--primary); }
      .s4v-tag.rev { background: rgba(217,119,6,.18); color: #f59e0b; }
      .s4v-steps { display: inline-flex; gap: 4px; margin-left: 8px; vertical-align: middle; }
      .s4v-steps i { width: 18px; height: 6px; border-radius: 3px; background: var(--border); display: inline-block; }
      .s4v-steps i.done { background: #10b981; }
      .s4v-steps i.cur { background: var(--primary); }
      .s4v-skip-btn { display: inline-flex; align-items: center; gap: 4px; background: var(--lg-wash, var(--bg, var(--box-sub))); border: 1px solid var(--lg-hairline, var(--border)); color: var(--muted); padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; cursor: pointer; }
      .s4v-skip-btn:hover { border-color: #f59e0b; color: #f59e0b; }

      .s4v-fc-front { text-align: center; padding: 6px 0; }
      .s4v-fc-word { font-size: 30px; font-weight: 800; color: var(--primary); }
      .s4v-fc-pos { font-size: 16px; color: var(--muted); font-weight: 500; }
      .s4v-fc-ipa { font-size: 16.5px; color: #ef4444; font-family: monospace; margin: 6px 0 10px 0; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
      .s4v-audio-row { display: flex; justify-content: center; gap: 10px; margin-bottom: 8px; }
      .s4v-audio-pill { display: inline-flex; align-items: center; justify-content: center; gap: 5px; background: var(--lg-wash, var(--bg, var(--box-sub))); border: 1px solid var(--lg-hairline, var(--border)); color: var(--lg-ink, var(--text)); padding: 6px 14px; border-radius: 999px; font-weight: 600; font-size: 13px; cursor: pointer; }
      .s4v-audio-pill:hover { border-color: var(--primary); }
      .s4v-fc-back { margin-top: 14px; padding-top: 14px; border-top: 2px dashed var(--lg-divider, var(--border)); text-align: left; }
      .s4v-def-box { font-size: 15.5px; line-height: 1.55; margin-bottom: 10px; }
      .s4v-lang-badge { display: inline-block; font-size: 10.5px; font-weight: 800; padding: 1px 6px; border-radius: 6px; margin-right: 5px; background: rgba(37, 99, 235, 0.14); color: var(--primary); letter-spacing: 0.3px; vertical-align: 1px; }
      .s4v-lang-badge.en { background: rgba(16, 185, 129, 0.14); color: #10b981; }
      .s4v-ex-box { background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.28); padding: 11px 14px; border-radius: 12px; font-size: 14px; line-height: 1.6; }
      .s4v-action-dock { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--lg-divider, var(--border)); }
      .s4v-btn-flip { display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 13px; border-radius: 14px; background: var(--primary); color: #fff; border: none; font-size: 15.5px; font-weight: 700; cursor: pointer; }
      .s4v-btn-flip.green { background: #16a34a; }
      .s4v-srs-buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
      .s4v-srs-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 11px 8px; border-radius: 999px; font-weight: 700; font-size: 13.5px; cursor: pointer; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid var(--lg-hairline, var(--border)); background: var(--lg-wash, rgba(148, 163, 184, 0.14)); color: var(--lg-ink, var(--text)); transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease; }
      .s4v-srs-btn:hover { transform: translateY(-1px); }
      .s4v-srs-btn:active { transform: scale(0.97); }
      .lp-srs-dot { width: 8px; height: 8px; border-radius: 999px; flex-shrink: 0; display: inline-block; }
      .lp-srs-kbd { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10.5px; font-weight: 800; padding: 1px 5px; border-radius: 5px; opacity: 0.78; border: 1px solid currentColor; line-height: 1.2; }
      .s4v-srs-btn.is-forget { background: rgba(239, 68, 68, 0.13); border-color: rgba(239, 68, 68, 0.36); color: #b91c1c; }
      .s4v-srs-btn.is-forget .lp-srs-dot { background: #ef4444; }
      .s4v-srs-btn.is-hard { background: rgba(245, 158, 11, 0.13); border-color: rgba(245, 158, 11, 0.36); color: #b45309; }
      .s4v-srs-btn.is-hard .lp-srs-dot { background: #f59e0b; }
      .s4v-srs-btn.is-good { background: rgba(34, 197, 94, 0.13); border-color: rgba(34, 197, 94, 0.36); color: #15803d; }
      .s4v-srs-btn.is-good .lp-srs-dot { background: #22c55e; }
      .s4v-srs-btn.is-easy { background: rgba(59, 130, 246, 0.13); border-color: rgba(59, 130, 246, 0.36); color: #1d4ed8; }
      .s4v-srs-btn.is-easy .lp-srs-dot { background: #3b82f6; }
      html.dark .s4v-srs-btn.is-forget { background: rgba(239, 68, 68, 0.20); border-color: rgba(248, 113, 113, 0.42); color: #fca5a5; }
      html.dark .s4v-srs-btn.is-hard { background: rgba(245, 158, 11, 0.20); border-color: rgba(251, 191, 36, 0.42); color: #fcd34d; }
      html.dark .s4v-srs-btn.is-good { background: rgba(34, 197, 94, 0.20); border-color: rgba(74, 222, 128, 0.42); color: #86efac; }
      html.dark .s4v-srs-btn.is-easy { background: rgba(59, 130, 246, 0.20); border-color: rgba(96, 165, 250, 0.42); color: #93c5fd; }

      .s4v-prompt-box { font-size: 17px; line-height: 1.6; padding: 14px 16px; background: var(--bg, var(--box-sub)); border: 1px solid var(--border); border-radius: 12px; max-width: 100%; overflow-wrap: anywhere; word-break: break-word; }
      .s4v-blank { color: var(--primary); font-weight: 800; border-bottom: 2px solid var(--primary); padding: 0 8px; }
      .s4v-blank.correct { color: #10b981; border-bottom-color: #10b981; }
      .s4v-blank.wrong { color: #ef4444; border-bottom-color: #ef4444; }
      .s4v-options-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 10px; margin-top: 16px; }
      .s4v-options-grid.is-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .s4v-wrap .opt-btn.quiz-opt,
      .s4v-wrap .quiz-opt {
        width: 100%;
        max-width: 100%;
        overflow-wrap: anywhere;
        word-break: break-word;
        display: flex;
        align-items: center;
        gap: 11px;
        padding: 13px 16px;
        border-radius: 12px;
        border-width: 1.5px;
        border-style: solid;
        border-color: var(--border);
        background: var(--box-sub, var(--bg, var(--card)));
        color: var(--text);
        text-align: left;
        font-size: 14.5px;
        font-weight: 500;
        line-height: 1.45;
        cursor: pointer;
        margin-bottom: 0;
        box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        transition: border-color 0.15s ease, transform 0.12s ease, background 0.15s ease, box-shadow 0.15s ease;
      }
      .s4v-wrap .opt-btn.quiz-opt:hover:not(.correct):not(.wrong),
      .s4v-wrap .quiz-opt:hover:not(.correct):not(.wrong) {
        border-color: var(--primary);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }
      .s4v-opt-key {
        flex: 0 0 26px;
        width: 26px;
        height: 26px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 800;
        background: var(--card, var(--panel));
        border: 1px solid var(--border);
        color: var(--muted);
      }
      .s4v-opt-body { flex: 1; min-width: 0; word-break: break-word; }
      .s4v-opt-pos { font-size: 12px; color: var(--muted); font-weight: 600; margin-left: 5px; }
      .s4v-wrap .opt-btn.quiz-opt.correct,
      .s4v-wrap .quiz-opt.correct {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.16);
        font-weight: 700;
      }
      .s4v-wrap .opt-btn.quiz-opt.correct .s4v-opt-key {
        background: #10b981;
        border-color: #10b981;
        color: #fff;
      }
      .s4v-wrap .opt-btn.quiz-opt.wrong,
      .s4v-wrap .quiz-opt.wrong {
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.15);
      }
      .s4v-wrap .opt-btn.quiz-opt.wrong .s4v-opt-key {
        background: #ef4444;
        border-color: #ef4444;
        color: #fff;
      }
      .s4v-wrap .spell-input,
      .s4v-wrap .text-input {
        width: 100%;
        padding: 13px 16px;
        border-radius: 12px;
        border-width: 2px;
        border-style: solid;
        border-color: var(--border);
        background: var(--box-sub, var(--bg, var(--card)));
        color: var(--text);
        font-size: 17px;
        font-weight: 700;
        outline: none;
        margin: 12px 0 4px;
        text-align: center;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .s4v-wrap .spell-input:focus,
      .s4v-wrap .text-input:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
      }
      .s4v-listen-prompt {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        text-align: center;
        font-size: 13.5px;
        font-weight: 700;
        color: var(--muted);
        padding: 9px 14px;
        border-radius: 12px;
        background: var(--lg-wash, var(--box-sub, var(--bg, var(--card))));
        border: 1px dashed var(--lg-hairline, var(--border));
        margin-bottom: 12px;
      }
      .s4v-match-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; margin-top: 16px; }
      .s4v-match-tile { padding: 12px 10px; border-radius: 12px; border: 2px solid var(--border); background: var(--bg, var(--box-sub)); text-align: center; font-size: 14px; font-weight: 600; cursor: pointer; min-height: 76px; display: flex; align-items: center; justify-content: center; user-select: none; }
      .s4v-match-tile.selected { border-color: var(--primary); background: rgba(37, 99, 235, 0.14); }
      .s4v-match-tile.matched { opacity: 0.18; pointer-events: none; border-color: #10b981; }
      .s4v-match-tile.error { border-color: #ef4444; background: rgba(239, 68, 68, 0.16); }

      .s4v-word-card { background: var(--lg-surface, var(--card, var(--panel))); border: 1px solid var(--lg-hairline, var(--border)); border-radius: 16px; padding: 16px; margin-bottom: 12px; display: flex; gap: 16px; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; }
      .s4v-step-lbl { font-size: 11px; font-weight: 800; color: var(--primary); margin-left: 5px; letter-spacing: .2px; white-space: nowrap; }
      .s4v-badge-status { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11.5px; font-weight: 700; background: rgba(16, 185, 129, 0.16); color: #10b981; }
      .s4v-badge-status.ign { background: rgba(245, 158, 11, 0.16); color: #f59e0b; }
      .s4v-finish-box { background: var(--lg-surface, var(--card, var(--panel))); backdrop-filter: var(--lg-blur, blur(12px)); -webkit-backdrop-filter: var(--lg-blur, blur(12px)); border-radius: 18px; border: 1.5px solid rgba(16, 185, 129, 0.48); padding: 32px 24px; text-align: center; }
      .s4v-finish-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 20px; }
      .s4v-btn-action { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 11px 18px; border-radius: 12px; font-weight: 700; font-size: 14px; cursor: pointer; border: none; }
      .s4v-search-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }
      .s4v-search-field {
        position: relative;
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
      }
      .s4v-search-input {
        width: 100%;
        padding: 10px 36px 10px 14px;
        border-radius: 10px;
        border: 1.5px solid var(--border);
        background: var(--card, var(--panel));
        color: var(--text);
        font-size: 14px;
        font-weight: 600;
        outline: none;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .s4v-search-input:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
      }
      .s4v-search-clear {
        position: absolute;
        right: 8px;
        width: 24px;
        height: 24px;
        border-radius: 999px;
        border: none;
        background: var(--border);
        color: var(--text);
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .s4v-search-clear:hover {
        background: var(--primary);
        color: #fff;
      }
      @media (max-width: 768px) {
        .s4v-mode-bar { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; padding: 6px 8px; }
        .s4v-mode-btn { padding: 6px 10px; font-size: 12px; flex-shrink: 0; }
        .s4v-card-box { padding: 14px 12px; border-radius: 13px; }
        .s4v-fc-word { font-size: 24px; }
        .s4v-options-grid.is-cols-2 { grid-template-columns: 1fr; }
        .s4v-wrap .opt-btn.quiz-opt,
        .s4v-wrap .quiz-opt { padding: 12px 13px; font-size: 14px; gap: 9px; }
        .s4v-stats-grid { grid-template-columns: repeat(3, 1fr); }
        .s4v-srs-buttons { grid-template-columns: repeat(2, 1fr); }
        .s4v-match-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .s4v-match-tile { min-height: 62px; font-size: 13px; padding: 8px; }
      }
    `;
    document.head.appendChild(st);
  }

  function loadJson(key, fb) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v && typeof v === "object" ? v : fb;
    } catch (e) { return fb; }
  }

  function localDateStr(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function getTodayStr() { return localDateStr(new Date()); }
  function rint(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function bumpCard() { cardSerial++; cardCache = {}; }
  function cacheGet(key, fn) { return cardCache[key] || (cardCache[key] = fn()); }
  function tapTooSoon() {
    const now = Date.now();
    if (now - tapLockAt < 320) return true;
    tapLockAt = now;
    return false;
  }

  function srsMap() { return cfg.getSrsMap() || {}; }
  function getSessionKey() {
    if (cfg.sessionKey) return cfg.sessionKey;
    return String(cfg.srsKey || "s4_vocab").replace(/_srs.*$/, "") + "_vocab_session_v1";
  }
  function readSessionStore() {
    const raw = loadJson(getSessionKey(), {});
    const sessions = raw && raw.sessions && typeof raw.sessions === "object" && !Array.isArray(raw.sessions) ? raw.sessions : {};
    const drafts = raw && raw.drafts && typeof raw.drafts === "object" && !Array.isArray(raw.drafts) ? raw.drafts : {};
    return { sessions, drafts };
  }
  function writeSessionStore(store) {
    try {
      const sKeys = Object.keys(store.sessions || {});
      if (sKeys.length > 60) {
        sKeys.sort((a, b) => (store.sessions[b].savedAt || 0) - (store.sessions[a].savedAt || 0))
          .slice(60).forEach(k => { delete store.sessions[k]; });
      }
      const dKeys = Object.keys(store.drafts || {});
      if (dKeys.length > 500) {
        dKeys.sort((a, b) => (store.drafts[b].updatedAt || 0) - (store.drafts[a].updatedAt || 0))
          .slice(500).forEach(k => { delete store.drafts[k]; });
      }
      if (Object.keys(store.sessions).length || Object.keys(store.drafts).length) {
        localStorage.setItem(getSessionKey(), JSON.stringify(store));
      } else {
        localStorage.removeItem(getSessionKey());
      }
    } catch (e) {}
  }
  function serializeQueueItem(w) {
    return {
      id: w.id,
      _new: !!w._new,
      _stage: typeof w._stage === "number" ? w._stage : (w._new ? 0 : 1),
      _mistakes: w._mistakes || 0,
      _resume: w._resume || null,
      _relearn: !!w._relearn,
      _lapsed: !!w._lapsed,
      _relearned: !!w._relearned,
      _rated: !!w._rated,
      _hardRepeated: !!w._hardRepeated,
      _task: w._task || null,
      _lastTask: w._lastTask || null
    };
  }
  function syncDraftsFromQueue(store, queue, now) {
    if (extraPracticeMode || !Array.isArray(queue)) return;
    queue.forEach(w => {
      if (!w || !w.id) return;
      const stage = typeof w._stage === "number" ? w._stage : (w._new ? 0 : 1);
      const baseStage = w._new ? 0 : 1;
      if (stage > baseStage || (w._mistakes || 0) > 0 || w._relearn || w._resume) {
        store.drafts[w.id] = {
          new: !!w._new,
          stage: stage,
          mistakes: w._mistakes || 0,
          resume: w._resume || null,
          relearn: !!w._relearn,
          lastTask: w._lastTask || null,
          updatedAt: now
        };
      }
    });
  }
  function saveSessionState(removeWordIds) {
    const store = readSessionStore();
    const now = Date.now();
    if (Array.isArray(removeWordIds)) {
      removeWordIds.forEach(id => { if (id) delete store.drafts[id]; });
    }
    syncDraftsFromQueue(store, studyQueue, now);
    if (currentLessonId) {
      if (!studyQueue || !studyQueue.length) {
        delete store.sessions[currentLessonId];
      } else {
        store.sessions[currentLessonId] = {
          mode: currentMode,
          extraPracticeMode: !!extraPracticeMode,
          savedAt: now,
          sessionTotal: sessionTotal,
          sessionDone: sessionDone,
          lastSmartWordId: lastSmartWordId || "",
          smartTick: smartTick || 0,
          queue: studyQueue.map(serializeQueueItem)
        };
      }
    }
    writeSessionStore(store);
  }
  function clearLessonSession(lessonId, dropWordIds) {
    const store = readSessionStore();
    if (lessonId) delete store.sessions[lessonId];
    if (Array.isArray(dropWordIds)) {
      dropWordIds.forEach(id => { if (id) delete store.drafts[id]; });
    }
    writeSessionStore(store);
  }
  function tryRestoreSession(lessonId, allowModeRestore) {
    if (!lessonId || !words.length) return false;
    const store = readSessionStore();
    const raw = store.sessions[lessonId];
    if (!raw || !Array.isArray(raw.queue) || !raw.queue.length) return false;

    const map = srsMap();
    const now = Date.now();
    const savedAt = Number(raw.savedAt || 0);
    const list = [];
    for (const item of raw.queue) {
      if (!item || !item.id) continue;
      const full = wordsById.get(item.id);
      if (!full) continue;
      const st = map[item.id];
      if (st && st.ignored) continue;
      if (!raw.extraPracticeMode && st) {
        const reviewedAt = Number(st.lastReview || st.updatedAt || 0);
        const inFlightRepeat = (item._lapsed && !item._relearned) || (item._hardRepeated && raw.mode === "flashcard");
        if ((inFlightRepeat ? reviewedAt > savedAt : reviewedAt >= savedAt) && Number(st.due || 0) > now) continue;
        if (item._new && st.reps > 0 && Number(st.due || 0) > now && (raw.mode === "smart" || !(item._lapsed || item._hardRepeated || item._rated))) continue;
      }
      if (!raw.extraPracticeMode && item._new && st && st.reps > 0 && !(item._lapsed || item._hardRepeated || item._rated)) continue;

      const restored = Object.assign({}, full, {
        _new: typeof item._new === "boolean" ? item._new : !isTouchedWord(full),
        _stage: typeof item._stage === "number" ? item._stage : (item._new ? 0 : 1),
        _mistakes: item._mistakes || 0,
        _resume: item._resume || null,
        _relearn: !!item._relearn,
        _lapsed: !!item._lapsed,
        _relearned: !!item._relearned,
        _rated: !!item._rated,
        _hardRepeated: !!item._hardRepeated,
        _task: item._task || null,
        _lastTask: item._lastTask || null
      });
      const d = store.drafts[item.id];
      if (!raw.extraPracticeMode && d && Number(d.updatedAt || 0) > savedAt && !(st && Number(st.lastReview || st.updatedAt || 0) >= Number(d.updatedAt || 0) && Number(st.due || 0) > now)) {
        if (typeof d.stage === "number" && d.stage !== item._stage) restored._task = null;
        restored._stage = typeof d.stage === "number" ? d.stage : restored._stage;
        restored._mistakes = d.mistakes || 0;
        restored._resume = d.resume || null;
        restored._relearn = !!d.relearn;
        restored._lastTask = d.lastTask || restored._lastTask;
      }
      list.push(restored);
    }

    if (!list.length) {
      clearLessonSession(lessonId);
      return false;
    }

    extraPracticeMode = !!raw.extraPracticeMode;
    if (allowModeRestore && raw.mode && raw.mode !== "list" && ["smart", "flashcard", "quiz", "listen", "match", "cloze"].includes(raw.mode)) {
      currentMode = raw.mode;
    }
    studyQueue = list;
    sessionTotal = Math.max(Number(raw.sessionTotal || 0), list.length + Number(raw.sessionDone || 0));
    sessionDone = Number(raw.sessionDone || 0);
    smartTick = Number(raw.smartTick || 0);
    lastSmartWordId = raw.lastSmartWordId || (studyQueue[0] && studyQueue[0].id) || "";
    isFlipped = false;
    matchSelected = null;

    for (let i = 0; i < studyQueue.length; i++) {
      if (typeof studyQueue[i]._stage !== "number") {
        studyQueue[i]._stage = studyQueue[i]._new ? 0 : 1;
        studyQueue[i]._mistakes = 0;
      }
    }
    if (currentMode === "smart" && studyQueue.length && !studyQueue[0]._task) {
      pickNextSmartItem(true);
    }
    bumpCard();
    return true;
  }

  function saveState() {
    try {
      localStorage.setItem(cfg.daysKey, JSON.stringify(dayLog));
      localStorage.setItem(cfg.settingsKey, JSON.stringify(userSettings));
    } catch (e) {}
    cfg.onSaveSrs(srsMap());
  }

  function logActivity(id) {
    const today = getTodayStr();
    const arr = dayLog[today] || (dayLog[today] = []);
    if (!arr.includes(id)) arr.push(id);
    saveState();
  }

  function getNewWordsLearnedTodayCount() {
    const today = getTodayStr();
    const map = srsMap();
    return Object.values(map).filter(st => st && !st.ignored && st.firstLearnedDate === today).length;
  }
  function getDailyTarget() {
    const bonus = userSettings.bonusTodayDate === getTodayStr() ? (userSettings.bonusTodayCount || 0) : 0;
    return Number(userSettings.dailyNewLimit) + bonus;
  }
  function getRemainingDailyNewQuota() {
    return Math.max(0, getDailyTarget() - getNewWordsLearnedTodayCount());
  }

  function dueAt(days) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + Math.max(1, Math.round(days)));
    return d.getTime();
  }
  function fuzz(i) { return i >= 7 ? Math.round(i * (0.92 + Math.random() * 0.16)) : i; }

  function rateWordSRS(id, quality, relearned) {
    const now = Date.now();
    const map = srsMap();
    let st = map[id];
    if (!st || st.ignored) st = { reps: 0, interval: 0, ease: 2.5, due: 0, lapses: 0, firstLearnedDate: getTodayStr() };
    if (!st.firstLearnedDate) st.firstLearnedDate = getTodayStr();
    st.ignored = false;

    if (quality === 0) {
      st.reps = 0;
      st.lapses = (st.lapses || 0) + 1;
      st.ease = Math.max(1.3, (st.ease || 2.5) - 0.2);
      if (relearned) { st.interval = 1; st.due = dueAt(1); }
      else { st.interval = 0; st.due = now + 10 * 60 * 1000; }
    } else {
      st.reps = (st.reps || 0) + 1;
      st.ease = st.ease || 2.5;
      if (quality === 1) {
        // "Khó": nhớ được nhưng yếu -> không tăng bậc ôn (reps giữ nguyên, tối thiểu 1) và chặn khoảng ôn tối đa 14 ngày
        st.reps = Math.max(1, st.reps - 1);
        st.interval = st.interval < 1 ? 1 : Math.min(14, Math.max(1, Math.round(st.interval * 0.5)));
        st.ease = Math.max(1.3, st.ease - 0.15);
      } else if (quality === 2) {
        st.interval = st.reps === 1 ? 1 : st.reps === 2 ? 3 : Math.max((st.interval || 1) + 1, Math.round((st.interval || 1) * st.ease));
      } else {
        st.interval = st.reps === 1 ? 4 : st.reps === 2 ? 7 : Math.max((st.interval || 1) + 2, Math.round((st.interval || 1) * st.ease * 1.3));
        st.ease = Math.min(3, st.ease + 0.15);
      }
      st.interval = Math.min(365, fuzz(st.interval));
      st.due = dueAt(st.interval);
    }
    st.lastReview = now;
    st.updatedAt = now;
    map[id] = st;
    saveState();
  }

  function rateOnce(v, q) {
    if (extraPracticeMode) { logActivity(v.id); return; }
    if (v._lapsed) {
      if (!v._relearned && q >= 1) { v._relearned = true; rateWordSRS(v.id, q >= 2 ? 2 : 1); }
      else logActivity(v.id);
      return;
    }
    if (v._rated) { logActivity(v.id); return; }
    v._rated = true;
    rateWordSRS(v.id, q);
    logActivity(v.id);
  }

  function isDueWord(v, now) {
    const st = srsMap()[v.id];
    return !!st && !st.ignored && st.reps > 0 && (!st.due || now >= st.due);
  }
  function isTouchedWord(v) {
    const st = srsMap()[v.id];
    return !!st && (st.ignored || st.reps > 0);
  }

  function randomMerge(a, b) {
    const out = []; let i = 0, j = 0;
    while (i < a.length || j < b.length) {
      const la = a.length - i, lb = b.length - j;
      if (Math.random() < la / (la + lb)) out.push(a[i++]); else out.push(b[j++]);
    }
    return out;
  }

  function buildStudyQueue(forceReset, skipDraftHydration) {
    const now = Date.now();
    const map = srsMap();
    let list = [];

    if (extraPracticeMode) {
      const learnedPool = words.filter(v => map[v.id] && !map[v.id].ignored && map[v.id].reps > 0);
      list = shuffle(learnedPool.length ? learnedPool : words).slice(0, 25);
    } else if (dueOnlyMode) {
      const cap = Number(userSettings.reviewCap) >= 9999 ? Infinity : Number(userSettings.reviewCap);
      list = words.filter(v => isDueWord(v, now))
        .sort((a, b) => (map[a.id].due || 0) - (map[b.id].due || 0))
        .slice(0, cap);
    } else {
      const cap = Number(userSettings.reviewCap) >= 9999 ? Infinity : Number(userSettings.reviewCap);
      const due = words.filter(v => isDueWord(v, now))
        .sort((a, b) => (map[a.id].due || 0) - (map[b.id].due || 0))
        .slice(0, cap);
      const quota = getRemainingDailyNewQuota();
      const fresh = words.filter(v => !isTouchedWord(v)).slice(0, quota);
      if (userSettings.queueOrder === "due_first") list = [...due, ...fresh];
      else if (userSettings.queueOrder === "new_first") list = [...fresh, ...due];
      else list = randomMerge(due, fresh);
    }

    const drafts = (!skipDraftHydration && !extraPracticeMode) ? (readSessionStore().drafts || {}) : {};
    studyQueue = list.map(w => {
      const isNew = !isTouchedWord(w);
      const item = Object.assign({ _new: isNew }, w);
      const d = drafts[w.id];
      if (d && (!isNew || d.new)) {
        item._stage = typeof d.stage === "number" ? d.stage : (isNew ? 0 : 1);
        item._mistakes = d.mistakes || 0;
        item._resume = d.resume || null;
        item._relearn = !!d.relearn;
        item._lastTask = d.lastTask || null;
      }
      return item;
    });
    sessionTopicCleanupCheck(skipDraftHydration);
    sessionTotal = studyQueue.length;
    sessionDone = 0;
    smartTick = 0;
    lastSmartWordId = "";
    isFlipped = false;
    bumpCard();
    if (currentMode === "smart" && studyQueue.length) pickNextSmartItem(true);
    saveSessionState();
  }

  function sessionTopicCleanupCheck(skipDraftHydration) {
    if (skipDraftHydration && currentLessonId) {
      clearLessonSession(currentLessonId);
    }
  }

  function makeCloze(v) {
    const ex = (v.examples || []).find(e => /<b[^>]*>[^<]+<\/b>/i.test(e));
    if (ex) {
      const answers = [normalizeAns(v.word)];
      const html = ex.replace(/<b[^>]*>([^<]+)<\/b>/gi, (m, t) => {
        answers.push(normalizeAns(t));
        return '<span class="s4v-blank blank">_____</span>';
      });
      return { html, answers };
    }
    return null;
  }

  function pickNextSmartItem(preserveFront) {
    if (!studyQueue.length) return;
    smartTick++;
    for (let i = 0; i < studyQueue.length; i++) {
      const w = studyQueue[i];
      if (typeof w._stage !== "number") {
        w._stage = w._new ? 0 : 1;
        w._mistakes = 0;
      }
    }
    let pickIdx = 0;
    if (!preserveFront) {
      const frontCount = Math.min(4, studyQueue.length);
      const candidates = [];
      for (let i = 0; i < frontCount; i++) {
        if (studyQueue[i].id !== lastSmartWordId) candidates.push(i);
      }
      pickIdx = candidates.length ? candidates[rint(0, candidates.length - 1)] : 0;
    }
    if (pickIdx > 0) {
      const picked = studyQueue.splice(pickIdx, 1)[0];
      studyQueue.unshift(picked);
    }
    const pick = studyQueue[0];
    lastSmartWordId = pick.id;

    const exclude = pick._lastTask;
    const choose = list => {
      const l = list.filter(t => t !== exclude);
      const src = l.length ? l : list;
      return src[rint(0, src.length - 1)];
    };
    if (pick._stage === 0) pick._task = "intro";
    else if (pick._stage === 1) pick._task = choose(["mcq_en2vi", "mcq_vi2en", "listen_choice"]);
    else if (pick._stage === 2) pick._task = choose(["mcq_vi2en", "listen_choice", "mcq_en2vi"]);
    else pick._task = choose(makeCloze(pick) ? ["cloze", "dictation"] : ["dictation"]);
    pick._lastTask = pick._task;
    bumpCard();
  }

  function completeSmartStep(ok) {
    if (!studyQueue.length) return;
    const v = studyQueue[0];
    const s = v._stage;

    if (s === 0) {
      v._stage = v._resume || 1;
      v._resume = null;
      v._relearn = false;
    } else if (ok) {
      if (s >= 3) {
        graduateSmartWord(v);
        return;
      }
      v._stage = s + 1;
    } else {
      v._mistakes = (v._mistakes || 0) + 1;
      v._resume = Math.max(1, s - 1);
      v._stage = 0;
      v._relearn = true;
    }
    v._task = null;

    studyQueue.shift();
    const qLen = studyQueue.length;
    let insertPos = qLen;
    if (qLen > 3) {
      if (ok || s === 0) {
        const minGap = Math.min(qLen, Math.max(4, Math.floor(qLen * 0.35)));
        const maxGap = qLen;
        insertPos = rint(minGap, maxGap);
      } else {
        const minGap = Math.min(qLen, Math.max(3, Math.floor(qLen * 0.20)));
        const maxGap = Math.min(qLen, Math.max(6, Math.floor(qLen * 0.60)));
        insertPos = rint(minGap, maxGap);
      }
    }
    studyQueue.splice(insertPos, 0, v);

    isFlipped = false;
    pickNextSmartItem();
    saveSessionState();
    renderAll();
  }

  function graduateSmartWord(v) {
    studyQueue.shift();
    const m = v._mistakes || 0;
    if (!extraPracticeMode) {
      if (v._new) rateWordSRS(v.id, m >= 2 ? 1 : 2);
      else if (m === 0) rateWordSRS(v.id, 3);
      else if (m === 1) rateWordSRS(v.id, 1);
      else rateWordSRS(v.id, 0, true);
    } else {
      logActivity(v.id);
    }
    sessionDone++;
    isFlipped = false;
    if (studyQueue.length) pickNextSmartItem(); else bumpCard();
    saveSessionState([v.id]);
    renderAll();
  }

  function advanceQueueWithQuality(q) {
    if (!studyQueue.length) return;
    const v = studyQueue.shift();
    const qLen = studyQueue.length;
    let droppedId = null;
    if (q === 0) {
      if (!v._lapsed && !extraPracticeMode) { v._lapsed = true; v._rated = true; rateWordSRS(v.id, 0); }
      else v._lapsed = true;
      logActivity(v.id);
      const minGap = qLen <= 3 ? qLen : Math.min(qLen, Math.max(3, Math.floor(qLen * 0.25)));
      const maxGap = qLen <= 3 ? qLen : Math.min(qLen, Math.max(6, Math.floor(qLen * 0.75)));
      studyQueue.splice(rint(minGap, maxGap), 0, v);
    } else if (q === 1 && !v._hardRepeated && !v._lapsed && qLen >= 3) {
      rateOnce(v, 1);
      v._hardRepeated = true;
      studyQueue.splice(rint(Math.ceil(qLen * 0.45), qLen), 0, v);
    } else {
      rateOnce(v, q);
      sessionDone++;
      droppedId = v.id;
    }
    isFlipped = false;
    bumpCard();
    saveSessionState(droppedId ? [droppedId] : undefined);
    renderAll();
  }

  function handleResult(ok) {
    if (currentMode === "smart") completeSmartStep(ok);
    else advanceQueueWithQuality(ok ? 2 : 0);
  }

  function playVocab(id, accent) {
    const v = wordsById.get(id);
    if (!v) return;
    const langMap = { uk: "en-GB", au: "en-AU", us: "en-US" };
    cfg.playWordAudio(v._raw || v, langMap[accent] || "en-US");
  }

  function autoPlayIfNeeded() {
    if (lastPlayedSerial === cardSerial || !studyQueue.length || currentMode === "list" || currentMode === "match") return;
    lastPlayedSerial = cardSerial;
    const v = studyQueue[0];
    let should = false;
    if (currentMode === "listen") should = true;
    else if (currentMode === "smart") should = ["listen_choice", "dictation"].includes(v._task) || (userSettings.autoAudio && ["intro", "mcq_en2vi"].includes(v._task));
    else if (currentMode === "flashcard") should = userSettings.autoAudio;
    else if (currentMode === "quiz") should = userSettings.autoAudio && !!(cardCache.quiz && cardCache.quiz.enToVi);
    if (should) setTimeout(() => playVocab(v.id, "uk"), 120);
  }

  function computeStats() {
    const now = Date.now();
    const map = srsMap();
    const s = { total: words.length, learning: 0, ignored: 0, due: 0, mastered: 0 };
    for (const v of words) {
      const st = map[v.id];
      if (!st) continue;
      if (st.ignored) { s.ignored++; continue; }
      if (!st.reps || st.reps <= 0) continue;
      s.learning++;
      if (!st.due || now >= st.due) s.due++;
      else if (st.interval >= 7) s.mastered++;
    }
    return s;
  }

  function calendarHtml() {
    const base = new Date();
    base.setDate(1);
    base.setMonth(base.getMonth() + calMonthOffset);
    const year = base.getFullYear(), month = base.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDow = (new Date(year, month, 1).getDay() + 6) % 7;
    const todayStr = getTodayStr();
    const keyOf = d => year + "-" + String(month + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");

    let total = 0, active = 0;
    let cells = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(n => `<div class="s4v-cal-dow">${n}</div>`).join("") + "<div></div>".repeat(startDow);
    for (let d = 1; d <= daysInMonth; d++) {
      const key = keyOf(d);
      const cnt = (dayLog[key] || []).length;
      total += cnt; if (cnt) active++;
      const lv = !cnt ? 0 : cnt < 10 ? 1 : cnt < 20 ? 2 : cnt < 40 ? 3 : 4;
      cells += `<div class="s4v-cal-day lv${lv}${key === todayStr ? " today" : ""}" title="${d}/${month + 1}: ${cnt} từ">${d}${cnt ? `<span>${cnt}</span>` : ""}</div>`;
    }

    let streak = 0;
    const cur = new Date();
    if (!(dayLog[localDateStr(cur)] || []).length) cur.setDate(cur.getDate() - 1);
    while ((dayLog[localDateStr(cur)] || []).length) { streak++; cur.setDate(cur.getDate() - 1); }

    return `<div class="s4v-cal-wrap">
      <div class="s4v-cal-head">
        <button class="s4v-mode-btn" onclick="window.S4VocabEngine.shiftCalMonth(-1)">‹</button><b>Tháng ${month + 1}/${year}</b>
        <button class="s4v-mode-btn" onclick="window.S4VocabEngine.shiftCalMonth(1)" ${calMonthOffset >= 0 ? 'disabled style="opacity:.4"' : ""}>›</button>
      </div>
      <div class="s4v-cal-grid">${cells}</div>
      <div class="s4v-cal-foot">
        <span class="s4v-stat-chip">${vIcon("flame", 13)} Chuỗi <b>${streak}</b> ngày</span><span class="s4v-stat-chip">${vIcon("calendar", 13)} <b>${active}</b> ngày học</span><span class="s4v-stat-chip">${vIcon("edit", 13)} <b>${total}</b> từ</span>
        <span class="s4v-cal-legend">Ít <i class="s4v-cal-day lv1"></i><i class="s4v-cal-day lv2"></i><i class="s4v-cal-day lv3"></i><i class="s4v-cal-day lv4"></i> Nhiều</span>
      </div>
    </div>`;
  }

  function settingsHtml() {
    const opt = (val, label, cur) => `<option value="${val}" ${String(cur) === String(val) ? "selected" : ""}>${label}</option>`;
    const limits = [10, 15, 20, 30, 50, 100, 9999].map(l => opt(l, l === 9999 ? "Không giới hạn" : l + " từ", userSettings.dailyNewLimit)).join("");
    const caps = [30, 50, 100, 200, 9999].map(l => opt(l, l === 9999 ? "Không giới hạn" : l + " từ", userSettings.reviewCap)).join("");
    const orders = [["mix", "Trộn ngẫu nhiên"], ["due_first", "Ôn trước, mới sau"], ["new_first", "Mới trước, ôn sau"]].map(o => opt(o[0], o[1], userSettings.queueOrder)).join("");
    return `<div class="s4v-panel">
      <label>Từ mới/ngày <select class="s4v-limit-select" onchange="window.S4VocabEngine.setOpt('dailyNewLimit',this.value)">${limits}</select></label>
      <label>Ôn tối đa <select class="s4v-limit-select" onchange="window.S4VocabEngine.setOpt('reviewCap',this.value)">${caps}</select></label>
      <label>Thứ tự <select class="s4v-limit-select" onchange="window.S4VocabEngine.setOpt('queueOrder',this.value)">${orders}</select></label>
      <label class="s4v-stat-chip" style="cursor:pointer"><input type="checkbox" ${userSettings.autoAudio ? "checked" : ""} onchange="window.S4VocabEngine.setOpt('autoAudio',this.checked)"> ${vIcon("volume", 14)} Tự phát âm</label>
    </div>`;
  }

  function statsCardHtml() {
    const st = computeStats();
    const target = getDailyTarget();
    const unseen = Math.max(0, st.total - st.learning - st.ignored);
    return `<div class="s4v-stats-card">
      <div class="s4v-stats-top">
        <div class="s4v-stats-mini">
          <span class="s4v-quota-pill">${vIcon("sparkle", 13)} Hôm nay ${getNewWordsLearnedTodayCount()}/${target >= 9000 ? "∞" : target}</span>
          <span class="s4v-stat-chip">${vIcon("reading", 13)} Đã học: <b style="color:var(--primary)">${st.learning}</b>/${st.total}</span>
          <span class="s4v-stat-chip">${vIcon("bell", 13)} Ôn: <b style="color:#ef4444">${st.due}</b></span>
        </div>
        <div class="s4v-stats-btns">
          <button class="s4v-mode-btn ${panel === "stats" ? "active" : ""}" onclick="window.S4VocabEngine.togglePanel('stats')">${vIcon("chart", 14)} Chi tiết</button>
          <button class="s4v-mode-btn ${panel === "calendar" ? "active" : ""}" onclick="window.S4VocabEngine.togglePanel('calendar')">${vIcon("calendar", 14)} Lịch</button>
          <button class="s4v-mode-btn ${panel === "settings" ? "active" : ""}" onclick="window.S4VocabEngine.togglePanel('settings')" title="Cài đặt" aria-label="Cài đặt">${vIcon("settings", 14)}</button>
        </div>
      </div>
      ${panel === "stats" ? `<div class="s4v-stats-grid">
        <div><div class="s4v-stat-num" style="color:var(--primary)">${st.learning}</div><div class="s4v-stat-label">Đã học</div></div>
        <div><div class="s4v-stat-num" style="color:#ef4444">${st.due}</div><div class="s4v-stat-label">Cần ôn</div></div>
        <div><div class="s4v-stat-num" style="color:#10b981">${st.mastered}</div><div class="s4v-stat-label">Nhớ kỹ</div></div>
        <div><div class="s4v-stat-num" style="color:#f59e0b">${st.ignored}</div><div class="s4v-stat-label">Đã biết</div></div>
        <div><div class="s4v-stat-num">${unseen}</div><div class="s4v-stat-label">Chưa học</div></div>
      </div>` : ""}
      ${panel === "settings" ? settingsHtml() : ""}
      ${panel === "calendar" ? `<div class="s4v-panel">${calendarHtml()}</div>` : ""}
    </div>`;
  }

  function exampleHtml(list) { return (list || []).map(e => "• " + e).join("<br>"); }
  function tagHtml(v) {
    return (v._new
      ? `<span class="s4v-tag new">${vIcon("sparkle", 12)} Từ mới</span>`
      : `<span class="s4v-tag rev">${vIcon("refresh", 12)} Ôn lại</span>`) +
      `<span style="margin-left:8px;">${v.topic || currentTopicTitle}</span>`;
  }
  const STEP_NAMES = ["Làm quen", "Nhận diện", "Nghe & Nhớ", "Ghi nhớ sâu"];
  function stepsHtml(v) {
    if (currentMode !== "smart" || typeof v._stage !== "number") return "";
    const stepNum = Math.min(4, Math.max(1, v._stage + 1));
    return `<span class="s4v-steps" title="Bước ${stepNum}/4: ${STEP_NAMES[stepNum - 1] || ""}">${[0, 1, 2, 3].map(i => `<i class="${i < v._stage ? "done" : i === v._stage ? "cur" : ""}"></i>`).join("")}<b class="s4v-step-lbl">Bước ${stepNum}/4</b></span>`;
  }
  function escHtml(str) {
    if (window.S4UI && typeof window.S4UI.escapeHtml === "function") return window.S4UI.escapeHtml(str);
    return String(str == null ? "" : str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function escJsAttr(str) {
    return String(str == null ? "" : str)
      .replace(/\\/g, "\\\\")
      .replace(/\r?\n/g, " ")
      .replace(/'/g, "\\'")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function highlightPlain(str, q) {
    if (q && window.S4SearchEngine && typeof window.S4SearchEngine.highlightHtml === "function") {
      return window.S4SearchEngine.highlightHtml(str, q);
    }
    return escHtml(str);
  }
  function highlightMultiline(str, q) {
    return String(str == null ? "" : str)
      .split(/\r?\n/)
      .map(line => highlightPlain(line, q))
      .join("<br>");
  }
  function headerHtml(v, extra) {
    return `<div class="s4v-top-bar"><div>${tagHtml(v)}${stepsHtml(v)}</div>
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;max-width:100%;">${extra || ""}<button class="s4v-skip-btn" onclick="window.S4VocabEngine.ignoreCurrentWord()">${vIcon("check", 12)} Đã biết</button></div></div>`;
  }
  function audioPillsHtml(safeId, pillStyle = "") {
    const styleAttr = pillStyle ? ` style="${pillStyle}"` : "";
    const accents = cfg && cfg.supportsAu
      ? [["uk", "UK"], ["au", "AU"], ["us", "US"]]
      : [["uk", "UK"], ["us", "US"]];
    return accents
      .map(([code, label]) => `<button class="s4v-audio-pill"${styleAttr} onclick="window.S4VocabEngine.playVocab('${safeId}','${code}')">${vIcon("volume", 14)} ${label}</button>`)
      .join("");
  }
  function audioRowHtml(v) {
    const safeId = escJsAttr(v.id);
    return `<div class="s4v-audio-row">${audioPillsHtml(safeId)}</div>`;
  }
  function backHtml(v) {
    return `<div class="s4v-fc-back"><div class="s4v-def-box"><b>Định nghĩa:</b><br>${(v.defRaw || "").replace(/\n/g, "<br>")}</div>
      ${v.examples && v.examples.length ? `<div class="s4v-ex-box"><b>Ví dụ:</b><br>${exampleHtml(v.examples)}</div>` : ""}</div>`;
  }
  function flashcardHtml(v, extraBody, actionFooter) {
    return `<div class="s4v-card-box">
      ${headerHtml(v)}
      <div class="s4v-fc-front">
        <div><span class="s4v-fc-word">${v.word}</span> <span class="s4v-fc-pos">${v.pos}</span></div>
        <div class="s4v-fc-ipa">${v.ipa}</div>${audioRowHtml(v)}
      </div>
      ${extraBody || ""}
      <div class="s4v-action-dock">${actionFooter || ""}</div>
    </div>`;
  }

  function pickDistractors(v) {
    const out = [], used = new Set([v.id]);
    const samePos = Math.random() < 0.7;
    let guard = 0;
    while (out.length < 3 && guard++ < 500 && words.length > 1) {
      const c = words[Math.floor(Math.random() * words.length)];
      if (used.has(c.id) || c.word.toLowerCase() === v.word.toLowerCase()) continue;
      if (samePos && guard < 200 && c.pos !== v.pos) continue;
      used.add(c.id); out.push(c);
    }
    return out;
  }

  /** Filter out pronunciation drill / unit-origin tags from quiz choices & hints. */
  function cleanQuizPos(pos) {
    const p = String(pos || "").trim();
    if (!p) return "";
    if (/(\(âm\s|^âm\s|listen\s*&|part\s*[123]|speaking|expression|idiom\/expr|chủ đề|luyện\s*âm)/i.test(p)) return "";
    return p;
  }

  function choiceGridHtml(choices, targetId, formatLabelFn, allowTwoCols) {
    const twoCols = allowTwoCols && choices.every(c => String(c.word || "").length <= 34);
    const items = choices.map((c, idx) => {
      const label = formatLabelFn(c);
      return `<button type="button" class="opt-btn quiz-opt" data-correct="${c.id === targetId}" onclick="window.S4VocabEngine.answerChoice(this)"><span class="s4v-opt-key">${idx + 1}</span><span class="s4v-opt-body">${label}</span></button>`;
    }).join("");
    return `<div class="s4v-options-grid${twoCols ? " is-cols-2" : ""}">${items}</div>`;
  }

  function quizHtml(v, dir) {
    const q = cacheGet("quiz", () => ({
      enToVi: dir === "en2vi" || (dir === "mix" && Math.random() < 0.5),
      choices: shuffle([v, ...pickDistractors(v)])
    }));
    const safeId = escJsAttr(v.id);
    const headerPos = cleanQuizPos(v.pos);
    const prompt = q.enToVi
      ? `<div style="text-align:center;"><div class="s4v-fc-word">${v.word} ${headerPos ? `<span class="s4v-fc-pos">${headerPos}</span>` : ""}</div>
           <div class="s4v-fc-ipa">${v.ipa} <button class="s4v-audio-pill" onclick="window.S4VocabEngine.playVocab('${safeId}','uk')" aria-label="Phát âm">${vIcon("volume", 14)}</button></div></div>`
      : `<div class="s4v-prompt-box"><b>Định nghĩa:</b><br>${(v.defRaw || "").replace(/\n/g, "<br>")}</div>`;
    const gridHtml = choiceGridHtml(
      q.choices,
      v.id,
      c => {
        if (q.enToVi) return (c.defVi || c.defRaw);
        const pos = cleanQuizPos(c.pos);
        return `<b>${c.word}</b>${pos ? `<span class="s4v-opt-pos">${pos}</span>` : ""}`;
      },
      !q.enToVi
    );
    const dirBtns = currentMode === "quiz"
      ? ["en2vi:Anh → Việt", "vi2en:Việt → Anh", "mix:Trộn"].map(s => {
          const [k, l] = s.split(":");
          return `<button class="s4v-mode-btn ${quizDirection === k ? "active" : ""}" onclick="window.S4VocabEngine.setQuizDir('${k}')">${l}</button>`;
        }).join("")
      : "";
    return `<div class="s4v-card-box">${headerHtml(v, dirBtns)}${prompt}${gridHtml}</div>`;
  }

  function normalizeAns(s) { return (s || "").toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim(); }

  function showAnsToast(ok, rightAns) {
    if (window.S4UI && typeof window.S4UI.toast === "function") {
      window.S4UI.toast(
        ok ? "success" : "error",
        ok ? "Chính xác" : "Đáp án: " + rightAns,
        { duration: ok ? 1300 : 2400 }
      );
      return;
    }
    let t = document.getElementById("s4AnsToast");
    if (!t) {
      t = document.createElement("div");
      t.id = "s4AnsToast";
      t.style.cssText = "position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:9999;padding:7px 14px;border-radius:999px;font-weight:700;font-size:13px;color:#fff;box-shadow:0 4px 14px rgba(0,0,0,0.2);pointer-events:none;transition:opacity 0.18s ease;";
      document.body.appendChild(t);
    }
    if (ansToastTimer) clearTimeout(ansToastTimer);
    t.style.background = ok ? "#16a34a" : "#dc2626";
    t.style.opacity = "1";
    t.textContent = ok ? "Chính xác" : "Đáp án: " + rightAns;
    ansToastTimer = setTimeout(() => { t.style.opacity = "0"; }, ok ? 1300 : 2400);
  }

  function textInputHtml(placeholder) {
    return `<input type="text" id="s4vAnsInput" class="text-input spell-input" style="margin-top:12px;text-align:center;" placeholder="${placeholder}" autocomplete="off" autocapitalize="off" spellcheck="false" onfocus="window.S4VocabEngine.scrollInput(this)" oninput="window.S4VocabEngine.onInputEdit(this)" onkeydown="window.S4VocabEngine.onInputKey(event)">
      <div id="s4vAnsFeedback" style="margin-top:8px;font-weight:700;font-size:14px;min-height:24px;text-align:center;"></div>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:8px;flex-wrap:wrap;">
        <button class="s4v-mode-btn active" onclick="window.S4VocabEngine.checkText()">${vIcon("check", 14)} Kiểm tra</button>
        <button class="s4v-mode-btn" onclick="window.S4VocabEngine.giveUp()">${vIcon("lightbulb", 14)} Hiện đáp án</button>
        <button class="s4v-mode-btn" id="s4vNextWrongBtn" style="display:none;background:var(--primary);color:#fff;border-color:var(--primary);" onclick="window.S4VocabEngine.nextAfterWrong()">Câu tiếp theo ${vIcon("arrowRight", 14)}</button>
      </div>`;
  }

  function listenHtml(v, sub) {
    cardCache.answers = [normalizeAns(v.word)];
    const safeId = escJsAttr(v.id);
    const cleanPos = cleanQuizPos(v.pos);
    let body;
    let promptBar;
    if (sub === "choice") {
      const choices = cacheGet("listen", () => shuffle([v, ...pickDistractors(v)]));
      promptBar = `<div class="s4v-listen-prompt">${vIcon("listening", 15)} Nghe và chọn từ chính xác</div>`;
      body = choiceGridHtml(
        choices,
        v.id,
        c => {
          const cPos = cleanQuizPos(c.pos);
          return `<b>${c.word}</b>${cPos ? `<span class="s4v-opt-pos">${cPos}</span>` : ""}`;
        },
        true
      );
    } else {
      promptBar = `<div class="s4v-listen-prompt">${vIcon("keyboard", 15)} Nghe và gõ lại từ chính xác</div>`;
      body = `<div style="text-align:center;margin-top:10px;color:var(--muted);">Nghĩa: <b>${v.defVi || v.defRaw}</b> ${cleanPos}</div>${textInputHtml("Gõ từ bạn nghe được...")}`;
    }
    const subBtns = currentMode === "listen"
      ? `<button class="s4v-mode-btn ${sub === "choice" ? "active" : ""}" onclick="window.S4VocabEngine.setListenSub('choice')">Chọn từ</button><button class="s4v-mode-btn ${sub === "dictation" ? "active" : ""}" onclick="window.S4VocabEngine.setListenSub('dictation')">Chính tả</button>`
      : "";
    return `<div class="s4v-card-box">${headerHtml(v, subBtns)}${promptBar}
      <div class="s4v-audio-row" style="margin:12px 0;">${audioPillsHtml(safeId, "font-size:15.5px;padding:10px 18px;")}</div>
      ${body}</div>`;
  }

  function clozeHtml(v) {
    const c = makeCloze(v);
    cardCache.answers = c ? c.answers : [normalizeAns(v.word)];
    const cleanPos = cleanQuizPos(v.pos);
    const hint = v.word ? `Gợi ý: <b>${v.word[0]}… (${v.word.length} ký tự)</b>` : "";
    return `<div class="s4v-card-box" style="text-align:center;">${headerHtml(v, `<span style="font-size:12.5px;color:var(--muted);">${hint}</span>`)}
      <div class="s4v-prompt-box" style="font-size:18px;margin:12px 0;text-align:left;">${c ? c.html : (v.defRaw || "").replace(/\n/g, "<br>")}</div>
      <div style="color:var(--muted);">Nghĩa: <b>${v.defVi || v.defRaw}</b> ${cleanPos}</div>
      ${textInputHtml("Nhập từ vựng...")}</div>`;
  }

  function smartHtml() {
    if (!studyQueue[0]._task) pickNextSmartItem();
    const v = studyQueue[0];
    switch (v._task) {
      case "intro": {
        const label = v._relearn ? `Đã xem lại ${vIcon("arrowRight", 15)}` : `Đã hiểu ${vIcon("arrowRight", 15)}`;
        return flashcardHtml(v, backHtml(v), `<button class="s4v-btn-flip green" onclick="window.S4VocabEngine.introDone()">${label}</button>`);
      }
      case "mcq_en2vi": return quizHtml(v, "en2vi");
      case "mcq_vi2en": return quizHtml(v, "vi2en");
      case "listen_choice": return listenHtml(v, "choice");
      case "dictation": return listenHtml(v, "dictation");
      default: return clozeHtml(v);
    }
  }

  function matchHtml() {
    const tiles = cacheGet("tiles", () => {
      const t = [];
      studyQueue.slice(0, 6).forEach(w => {
        t.push({ id: w.id, html: `<b>${w.word}</b><br><span style="font-size:12px;color:var(--muted)">${w.ipa}</span>` });
        t.push({ id: w.id, html: (w.defVi || w.defRaw || "").slice(0, 75) });
      });
      return shuffle(t);
    });
    return `<div class="s4v-card-box"><b class="s4v-stat-chip" style="color:var(--primary);">${vIcon("grid", 15)} Ghép từ với nghĩa</b>
      <div class="s4v-match-grid" id="s4vMatchGrid">${tiles.map(t => `<div class="s4v-match-tile" data-pair="${t.id.replace(/"/g, "&quot;")}" onclick="window.S4VocabEngine.clickMatchTile(this)"><div>${t.html}</div></div>`).join("")}</div></div>`;
  }

  function filterListWords() {
    const map = srsMap();
    const statusPred = v => {
      if (listFilter === "learned") return !!(map[v.id] && !map[v.id].ignored && map[v.id].reps > 0);
      if (listFilter === "ignored") return !!(map[v.id] && map[v.id].ignored);
      if (listFilter === "unseen") return !isTouchedWord(v);
      return true;
    };
    const q = (listSearch || "").trim();
    if (!q) return words.filter(statusPred);
    if (wordSearchIndex && typeof wordSearchIndex.filter === "function") {
      return wordSearchIndex.filter(q, { filterFn: statusPred });
    }
    return words.filter(v => {
      if (!statusPred(v)) return false;
      const blob = [v.word, v.defRaw, v.ipa, (v.examples || []).join(" ")].join(" ");
      if (window.S4UI && typeof window.S4UI.matchesSearch === "function") {
        return window.S4UI.matchesSearch(blob, q);
      }
      return blob.toLowerCase().includes(q.toLowerCase());
    });
  }

  function renderListBodyHtml() {
    const map = srsMap();
    const q = (listSearch || "").trim();
    const f = filterListWords();
    const cnt = fn => words.filter(fn).length;
    const btn = (k, label) => `<button class="s4v-mode-btn ${listFilter === k ? "active" : ""}" onclick="window.S4VocabEngine.setListFilter('${k}')">${label}</button>`;
    const bar = `<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center;">
      ${btn("all", `Tất cả (${words.length})`)}${btn("unseen", `Chưa học (${cnt(v => !isTouchedWord(v))})`)}
      ${btn("learned", `Đang học (${cnt(v => map[v.id] && !map[v.id].ignored && map[v.id].reps > 0)})`)}${btn("ignored", `Đã biết (${cnt(v => map[v.id] && map[v.id].ignored)})`)}
      ${q ? `<span class="s4v-stat-chip" style="font-size:12px;color:var(--muted);font-weight:700;margin-left:auto;">${vIcon("search", 13)} Khớp ${f.length} từ</span>` : ""}
    </div>`;
    const rows = f.slice(0, listLimit).map(v => {
      const st = map[v.id];
      const safeId = escJsAttr(v.id);
      const status = st && st.ignored
        ? `<span class="s4v-badge-status ign">Đã biết</span> <button class="s4v-mode-btn" style="padding:3px 8px;font-size:11.5px;" onclick="window.S4VocabEngine.unignoreWord('${safeId}')">${vIcon("refresh", 12)} Học lại</button>`
        : (st && st.reps > 0) ? `<span class="s4v-badge-status">Chu kỳ ${Math.max(1, Math.round(st.interval || 1))} ngày</span>`
        : `<button class="s4v-skip-btn" style="padding:3px 8px;font-size:11.5px;" onclick="window.S4VocabEngine.markKnown('${safeId}')">${vIcon("check", 12)} Đã biết</button>`;
      return `<div class="s4v-word-card"><div style="flex:1;min-width:230px;">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span style="font-size:20px;font-weight:800;color:var(--primary);">${highlightPlain(v.word, q)}</span><span style="color:var(--muted);">${escHtml(v.pos)}</span>
          <span style="color:#ef4444;font-family:monospace;">${escHtml(v.ipa)}</span>
          ${audioPillsHtml(safeId, "padding:3px 9px;font-size:12px;")}${status}
        </div>
        <div style="margin-top:8px;line-height:1.5;">${highlightMultiline(v.defRaw || "", q)}</div>
        ${v.examples && v.examples.length ? `<div style="margin-top:8px;font-size:14px;color:#10b981;line-height:1.55;">${exampleHtml(v.examples)}</div>` : ""}
      </div></div>`;
    }).join("");
    const more = f.length > listLimit ? `<button class="s4v-btn-action" style="background:var(--primary);color:#fff;width:100%;" onclick="window.S4VocabEngine.loadMoreList()">Hiện thêm (${f.length - listLimit})</button>` : "";
    const emptyMsg = q
      ? `<div class="s4v-card-box" style="text-align:center;">
          <div style="color:var(--muted);display:inline-flex;">${vIcon("search", 28)}</div>
          <div style="font-weight:700;margin-top:4px;">Không tìm thấy từ khớp "<strong>${escHtml(q)}</strong>"</div>
          <button type="button" class="s4v-mode-btn" style="margin-top:10px;" onclick="window.S4VocabEngine.clearListSearch()">${vIcon("close", 13)} Xóa tìm kiếm</button>
        </div>`
      : '<div class="s4v-card-box" style="text-align:center;">Không có từ nào trong mục này.</div>';
    return bar + (rows || emptyMsg) + more;
  }

  function listHtml() {
    const hasQ = !!(listSearch || "").trim();
    return `<div class="s4v-search-row">
      <div class="s4v-search-field">
        <input id="s4vListSearchInput" type="text" class="s4v-search-input" value="${escHtml(listSearch)}" placeholder="Tìm nhanh trong ${words.length} từ của bài (từ vựng, nghĩa Việt/Anh, ví dụ)..." autocomplete="off" oninput="window.S4VocabEngine.onListSearch(this.value)">
        <button id="s4vListSearchClear" type="button" class="s4v-search-clear" style="display:${hasQ ? "inline-flex" : "none"};" title="Xóa tìm kiếm" aria-label="Xóa tìm kiếm" onclick="window.S4VocabEngine.clearListSearch()">${vIcon("close", 13)}</button>
      </div>
    </div>
    <div id="s4vListBody">${renderListBodyHtml()}</div>`;
  }

  function finishHtml() {
    const map = srsMap();
    const now = Date.now();
    const dueInScope = words.filter(v => isDueWord(v, now)).length;
    const unseen = words.filter(v => !isTouchedWord(v)).length;
    const hasLearned = words.some(v => map[v.id] && !map[v.id].ignored && map[v.id].reps > 0);
    return `<div class="s4v-finish-box"><div style="color:#10b981;display:inline-flex;">${vIcon("award", 42)}</div>
      <h2 style="margin:8px 0 0 0;color:#10b981;">${extraPracticeMode ? "Xong lượt ôn luyện!" : "Hoàn thành phiên học!"}</h2>
      ${sessionDone ? `<p style="color:var(--muted);margin:8px 0 0 0;">Đã xử lý ${sessionDone} từ</p>` : ""}
      <div class="s4v-finish-actions">
        ${!extraPracticeMode && dueInScope > 0 ? `<button class="s4v-btn-action" style="background:#dc2626;color:#fff;" onclick="window.S4VocabEngine.startDueReview()">${vIcon("bell", 15)} Ôn ngay ${dueInScope} từ đến hạn</button>` : ""}
        ${extraPracticeMode ? `<button class="s4v-btn-action" style="background:var(--primary);color:#fff;" onclick="window.S4VocabEngine.exitPractice()">Quay lại học chính</button>` : ""}
        ${!extraPracticeMode && unseen > 0 ? `<button class="s4v-btn-action" style="background:var(--primary);color:#fff;" onclick="window.S4VocabEngine.addBonusNewWords(10)">${vIcon("plus", 15)} Học thêm 10 từ mới</button>` : ""}
        ${hasLearned ? `<button class="s4v-btn-action" style="background:#16a34a;color:#fff;" onclick="window.S4VocabEngine.startFreePractice()">${vIcon("refresh", 15)} Ôn luyện thêm</button>` : ""}
        <button class="s4v-btn-action" style="background:var(--lg-wash, var(--bg,var(--box-sub)));color:var(--lg-ink, var(--text));border:1px solid var(--lg-hairline, var(--border));" onclick="window.S4VocabEngine.setMode('list')">${vIcon("reading", 15)} Danh sách</button>
      </div></div>`;
  }

  function sessionBarHtml() {
    const pct = sessionTotal ? Math.round(sessionDone / sessionTotal * 100) : 0;
    const inProgress = !extraPracticeMode && (sessionDone > 0 || studyQueue.some(w => (w._mistakes || 0) > 0 || w._stage > (w._new ? 0 : 1)));
    return `<div class="s4v-sess-row">
      <span>
        ${extraPracticeMode ? "Ôn luyện (không ảnh hưởng lịch ôn)" : dueOnlyMode ? "Ôn tập từ đến hạn" : "Phiên học"}
        ${extraPracticeMode ? ` <button class="s4v-skip-btn" onclick="window.S4VocabEngine.exitPractice()">Thoát</button>` : ""}
        ${inProgress ? ` <button class="s4v-skip-btn" style="color:#ef4444;margin-left:4px;" onclick="window.S4VocabEngine.restartSession()">${vIcon("refresh", 12)} Phiên mới</button>` : ""}
      </span>
      <span>${sessionDone}/${sessionTotal}</span>
    </div>
    <div class="s4v-sess-bar"><i style="width:${pct}%"></i></div>`;
  }

  function modeBarHtml() {
    const extraLeft = cfg.getExtraModeButtonsHtml ? cfg.getExtraModeButtonsHtml() : "";
    const btn = (m, ic, label) => `<button class="s4v-mode-btn ${currentMode === m ? "active" : ""}" onclick="window.S4VocabEngine.setMode('${m}')">${vIcon(ic, 14)} ${label}</button>`;
    return `<div class="s4v-mode-bar">
      ${extraLeft}
      ${btn("smart", "graduation", "Học")}
      ${btn("flashcard", "layers", "Flashcard")}
      ${btn("quiz", "help", "Trắc nghiệm")}
      ${btn("listen", "listening", "Nghe")}
      ${btn("match", "grid", "Ghép cặp")}
      ${btn("cloze", "edit", "Điền từ")}
      ${btn("list", "reading", `Danh sách (${words.length})`)}
    </div>`;
  }

  function renderAll() {
    const container = document.getElementById(mountContainerId);
    if (!container) return;

    let bodyHtml = "";
    if (currentMode === "list") {
      bodyHtml = listHtml();
    } else if (!studyQueue.length) {
      bodyHtml = finishHtml();
    } else {
      const v = studyQueue[0];
      let cardHtml = "";
      switch (currentMode) {
        case "flashcard":
          cardHtml = isFlipped
            ? flashcardHtml(v, backHtml(v), `<div class="s4v-srs-buttons">
                <button class="s4v-srs-btn is-forget" onclick="window.S4VocabEngine.rateBtn(0)"><span class="lp-srs-dot"></span><span>Quên</span><kbd class="lp-srs-kbd">1</kbd></button>
                <button class="s4v-srs-btn is-hard" onclick="window.S4VocabEngine.rateBtn(1)"><span class="lp-srs-dot"></span><span>Khó</span><kbd class="lp-srs-kbd">2</kbd></button>
                <button class="s4v-srs-btn is-good" onclick="window.S4VocabEngine.rateBtn(2)"><span class="lp-srs-dot"></span><span>Nhớ</span><kbd class="lp-srs-kbd">3</kbd></button>
                <button class="s4v-srs-btn is-easy" onclick="window.S4VocabEngine.rateBtn(3)"><span class="lp-srs-dot"></span><span>Rất dễ</span><kbd class="lp-srs-kbd">4</kbd></button></div>`)
            : flashcardHtml(v, "", `<button class="s4v-btn-flip" onclick="window.S4VocabEngine.flipCard()">Hiện nghĩa</button>`);
          break;
        case "smart": cardHtml = smartHtml(); break;
        case "quiz": cardHtml = quizHtml(v, quizDirection); break;
        case "listen": cardHtml = listenHtml(v, listenSubMode); break;
        case "match": cardHtml = matchHtml(); break;
        default: cardHtml = clozeHtml(v);
      }
      bodyHtml = sessionBarHtml() + cardHtml;
    }

    container.innerHTML = `<div class="s4v-wrap">
      ${modeBarHtml()}
      ${statsCardHtml()}
      <div id="s4vCardHost">${bodyHtml}</div>
    </div>`;

    const inp = container.querySelector("#s4vAnsInput");
    if (inp) {
      try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); }
    }
    autoPlayIfNeeded();
  }

  // Public API methods
  window.S4VocabEngine = {
    init(options) {
      cfg = Object.assign(cfg, options || {});
      dayLog = loadJson(cfg.daysKey, {});
      userSettings = Object.assign({}, DEFAULT_SETTINGS, loadJson(cfg.settingsKey, {}));
      injectStyles();
    },

    mount(containerId, lessonId, rawWords, topicTitle, forceMode, mountOpts) {
      injectStyles();
      mountContainerId = containerId;
      currentTopicTitle = topicTitle || "";
      let spFilter = "";
      try { spFilter = new URLSearchParams(window.location.search).get("filter") || ""; } catch (e) {}
      dueOnlyMode = !!(
        (mountOpts && mountOpts.dueOnly) ||
        cfg.dueOnly ||
        forceMode === "due" ||
        spFilter === "due"
      );
      const effectiveForceMode = forceMode === "due" ? "" : forceMode;
      const allowModeRestore = !effectiveForceMode;
      if (effectiveForceMode) currentMode = effectiveForceMode;

      const normalized = (rawWords || []).map(w => {
        const wordStr = (w.origin || w.term || w.word || "").trim();
        const id = wordStr.toLowerCase();
        const posRaw = (w.pos || "").trim();
        const pos = posRaw ? (posRaw.startsWith("(") ? posRaw : `(${posRaw})`) : "";
        const defVi = w.defVi || w.vi || "";
        const defEn = w.defEn || w.en || "";
        const defRaw = (defVi ? '<span class="s4v-lang-badge">VI</span>' + defVi : "") + (defEn ? (defVi ? '\n<span class="s4v-lang-badge en">EN</span>' : '<span class="s4v-lang-badge en">EN</span>') + defEn : "");
        const examples = (w.examples || []).map(ex =>
          String(ex || "")
            .replace(/\[([^\]]+)\]/g, "<b>$1</b>")
            .replace(/\(=Dịch:\s*([^)]+)\)/g, '<br><span style="color:var(--muted);font-size:13px;">Dịch: $1</span>')
        );
        return {
          id,
          word: wordStr,
          pos,
          ipa: w.ipa || "",
          defVi,
          defEn,
          defRaw,
          topic: w.topic || topicTitle || "",
          examples,
          _raw: w
        };
      }).filter(w => w.id);

      const lessonChanged = lessonId !== currentLessonId || words.length !== normalized.length;
      words = normalized;
      wordsById = new Map(words.map(w => [w.id, w]));
      currentLessonId = lessonId;

      if (lessonChanged) {
        listSearch = "";
        listLimit = 100;
      }
      wordSearchIndex = (window.S4SearchEngine && typeof window.S4SearchEngine.createIndex === "function")
        ? window.S4SearchEngine.createIndex(words, {
            lazy: true,
            fields: [
              { name: "word", get: v => v.word, weight: 2.2 },
              { name: "defVi", get: v => v.defVi || v.defRaw, weight: 1.4 },
              { name: "defEn", get: v => v.defEn, weight: 1.1 },
              { name: "ipa", get: v => v.ipa, weight: 0.8 },
              { name: "examples", get: v => v.examples, weight: 0.75 }
            ]
          })
        : null;

      if (lessonChanged || !studyQueue.length) {
        extraPracticeMode = false;
        if (!tryRestoreSession(lessonId, allowModeRestore)) {
          if (!forceMode) currentMode = "smart";
          buildStudyQueue(true);
        }
      }
      renderAll();
    },

    getMode() { return currentMode; },

    setMode(m) {
      currentMode = m;
      isFlipped = false;
      if (m === "smart" && studyQueue.length && !studyQueue[0]._task) { pickNextSmartItem(true); }
      else bumpCard();
      if (m !== "list") saveSessionState();
      renderAll();
    },

    setQuizDir(d) { quizDirection = d; cardCache = {}; renderAll(); },
    setListenSub(d) { listenSubMode = d; cardCache = {}; renderAll(); },
    onListSearch(val) {
      listSearch = String(val == null ? "" : val);
      listLimit = 100;
      const clr = document.getElementById("s4vListSearchClear");
      if (clr) clr.style.display = listSearch.trim() ? "inline-flex" : "none";
      const body = document.getElementById("s4vListBody");
      if (body) body.innerHTML = renderListBodyHtml();
      else renderAll();
    },
    clearListSearch() {
      listSearch = "";
      listLimit = 100;
      const inp = document.getElementById("s4vListSearchInput");
      if (inp) {
        inp.value = "";
        try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); }
      }
      const clr = document.getElementById("s4vListSearchClear");
      if (clr) clr.style.display = "none";
      const body = document.getElementById("s4vListBody");
      if (body) body.innerHTML = renderListBodyHtml();
      else renderAll();
    },
    setListFilter(f) {
      listFilter = f;
      listLimit = 100;
      const body = document.getElementById("s4vListBody");
      if (currentMode === "list" && body) body.innerHTML = renderListBodyHtml();
      else renderAll();
    },
    loadMoreList() {
      listLimit += 100;
      const body = document.getElementById("s4vListBody");
      if (currentMode === "list" && body) body.innerHTML = renderListBodyHtml();
      else renderAll();
    },

    togglePanel(p) {
      panel = panel === p ? "" : p;
      renderAll();
    },
    shiftCalMonth(d) {
      calMonthOffset = Math.min(0, calMonthOffset + d);
      renderAll();
    },
    setOpt(key, val) {
      if (key === "autoAudio") { userSettings.autoAudio = !!val; saveState(); return; }
      if (key === "queueOrder") userSettings.queueOrder = val;
      else userSettings[key] = Number(val);
      saveState();
      buildStudyQueue(true);
      renderAll();
    },

    addBonusNewWords(n) {
      dueOnlyMode = false;
      const today = getTodayStr();
      if (userSettings.bonusTodayDate !== today) { userSettings.bonusTodayDate = today; userSettings.bonusTodayCount = 0; }
      userSettings.bonusTodayCount += n;
      extraPracticeMode = false;
      saveState();
      buildStudyQueue(true);
      renderAll();
    },
    startFreePractice() { extraPracticeMode = true; buildStudyQueue(true); renderAll(); },
    exitPractice() { extraPracticeMode = false; buildStudyQueue(true); renderAll(); },
    startDueReview() {
      extraPracticeMode = false;
      buildStudyQueue(true, true);
      renderAll();
    },
    async restartSession() {
      const ok = window.S4UI && typeof window.S4UI.confirm === "function"
        ? await window.S4UI.confirm("Bỏ tiến trình dở dang của phiên học này và tạo phiên mới?\n(Các từ đã học xong vẫn được giữ nguyên.)", { title: "Tạo phiên học mới", tone: "warn", confirmText: "Tạo phiên mới" })
        : confirm("Bỏ tiến trình dở dang của phiên học này và tạo phiên mới?\n(Các từ đã học xong vẫn được giữ nguyên.)");
      if (!ok) return;
      const dropIds = studyQueue.map(w => w.id);
      clearLessonSession(currentLessonId, dropIds);
      buildStudyQueue(true, true);
      renderAll();
    },

    playVocab,
    flipCard() { if (tapTooSoon()) return; isFlipped = true; tapLockAt = Date.now(); renderAll(); },
    rateBtn(q) { if (tapTooSoon()) return; advanceQueueWithQuality(q); },
    introDone() { if (tapTooSoon()) return; completeSmartStep(true); },

    ignoreCurrentWord() {
      if (!studyQueue.length) return;
      const v = studyQueue.shift();
      const map = srsMap();
      const wasNew = !isTouchedWord(v);
      map[v.id] = { ignored: true, updatedAt: Date.now() };
      sessionDone++;
      saveState();
      if (wasNew && !extraPracticeMode) {
        const queued = new Set(studyQueue.map(x => x.id));
        const rep = words.find(w => !isTouchedWord(w) && !queued.has(w.id));
        if (rep) { studyQueue.push(Object.assign({ _new: true }, rep)); sessionTotal++; }
      }
      isFlipped = false;
      bumpCard();
      if (currentMode === "smart" && studyQueue.length) pickNextSmartItem();
      saveSessionState([v.id]);
      renderAll();
    },
    markKnown(id) {
      srsMap()[id] = { ignored: true, updatedAt: Date.now() };
      saveState();
      if (!studyQueue.length) buildStudyQueue(true);
      else saveSessionState([id]);
      renderAll();
    },
    unignoreWord(id) {
      delete srsMap()[id];
      saveState();
      if (!studyQueue.length) buildStudyQueue(true);
      else saveSessionState([id]);
      renderAll();
    },

    answerChoice(btn) {
      if (tapTooSoon()) return;
      const grid = btn.parentElement;
      if (grid.dataset.locked === "1") return;
      grid.dataset.locked = "1";
      const ok = btn.dataset.correct === "true";
      btn.classList.add(ok ? "correct" : "wrong");
      if (!ok) {
        const r = grid.querySelector('[data-correct="true"]');
        if (r) r.classList.add("correct");
      }
      if (studyQueue[0]) playVocab(studyQueue[0].id, "uk");
      const serial = cardSerial;
      setTimeout(() => { if (serial === cardSerial) handleResult(ok); }, ok ? 1100 : 2200);
    },

    scrollInput(el) {
      if (!el) return;
      setTimeout(() => {
        try { el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" }); } catch (e) {}
      }, 150);
    },
    onInputEdit(inp) {
      if (!inp) return;
      inp.dataset.wrongWaiting = "0";
      inp.classList.remove("correct", "wrong");
    },
    onInputKey(ev) {
      if (ev.key === "Enter") {
        ev.preventDefault();
        const inp = document.getElementById("s4vAnsInput");
        if (inp && inp.dataset.wrongWaiting === "1") {
          handleResult(false);
          return;
        }
        window.S4VocabEngine.checkText();
      }
    },
    checkText() {
      const inp = document.getElementById("s4vAnsInput");
      if (!inp || inp.dataset.locked === "1") return;
      const answers = cardCache.answers || [];
      const ok = answers.includes(normalizeAns(inp.value));
      window.S4VocabEngine.finishText(inp, ok, false);
    },
    giveUp() {
      const inp = document.getElementById("s4vAnsInput");
      if (!inp || inp.dataset.locked === "1") return;
      window.S4VocabEngine.finishText(inp, false, true);
    },
    nextAfterWrong() {
      handleResult(false);
    },
    finishText(inp, ok, isGiveUp) {
      const rightAns = (studyQueue[0] && studyQueue[0].word) || (cardCache.answers || [""])[0];
      if (isGiveUp) inp.value = rightAns;

      inp.classList.remove("correct", "wrong");
      inp.classList.add(ok ? "correct" : "wrong");

      document.querySelectorAll("#s4vCardHost .s4v-blank").forEach(b => {
        b.classList.remove("correct", "wrong");
        b.classList.add(ok ? "correct" : "wrong");
        b.textContent = rightAns;
      });

      const fb = document.getElementById("s4vAnsFeedback");
      const nextBtn = document.getElementById("s4vNextWrongBtn");

      if (ok) {
        inp.dataset.locked = "1";
        inp.dataset.wrongWaiting = "0";
        if (fb) {
          fb.style.color = "#10b981";
          fb.innerHTML = `<span class="s4v-stat-chip">${vIcon("check", 14)} Chính xác: <b>${rightAns}</b></span>`;
        }
        if (nextBtn) nextBtn.style.display = "none";
        showAnsToast(true, rightAns);
        if (studyQueue[0]) playVocab(studyQueue[0].id, "uk");
        const passSrs = inp.dataset.hadWrong !== "1";
        const serial = cardSerial;
        setTimeout(() => { if (serial === cardSerial) handleResult(passSrs); }, 1100);
      } else {
        inp.dataset.hadWrong = "1";
        inp.dataset.wrongWaiting = "1";
        if (fb) {
          fb.style.color = "#ef4444";
          fb.innerHTML = `<span class="s4v-stat-chip">${vIcon("close", 14)} Chưa đúng — Đáp án đúng: <span class="dic-ans-hint">${rightAns}</span></span>`;
        }
        if (nextBtn) nextBtn.style.display = "inline-flex";
        if (studyQueue[0]) playVocab(studyQueue[0].id, "uk");
      }
    },

    clickMatchTile(el) {
      if (el.classList.contains("matched")) return;
      if (!matchSelected) { matchSelected = el; el.classList.add("selected"); return; }
      if (matchSelected === el) { el.classList.remove("selected"); matchSelected = null; return; }
      const prev = matchSelected;
      matchSelected = null;
      if (prev.dataset.pair === el.dataset.pair) {
        prev.classList.remove("selected");
        prev.classList.add("matched"); el.classList.add("matched");
        const idx = studyQueue.findIndex(x => x.id === el.dataset.pair);
        if (idx !== -1) {
          const matchedId = studyQueue[idx].id;
          rateOnce(studyQueue[idx], 2);
          studyQueue.splice(idx, 1);
          sessionDone++;
          saveSessionState([matchedId]);
        }
        if (!document.querySelector("#s4vMatchGrid .s4v-match-tile:not(.matched)")) {
          const serial = cardSerial;
          setTimeout(() => { if (serial === cardSerial) { bumpCard(); renderAll(); } }, 450);
        }
      } else {
        el.classList.add("error");
        setTimeout(() => { prev.classList.remove("selected"); el.classList.remove("error"); }, 450);
      }
    }
  };

  window.addEventListener("keydown", e => {
    if (!mountContainerId) return;
    const host = document.getElementById(mountContainerId);
    if (!host || host.offsetParent === null) return;
    try {
      const cs = window.getComputedStyle(host);
      if (cs && (cs.display === "none" || cs.visibility === "hidden")) return;
    } catch (err) {}
    if (document.querySelector(".s4-modal-backdrop, .s4-ui-backdrop, #lpDisclaimerModal, #s4ComingSoonModal")) return;
    const target = e.target;
    const tag = target && target.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || (target && target.isContentEditable)) return;
    if (currentMode === "list" || !studyQueue.length) return;
    const key = (e.key || "").toLowerCase();
    if (key === "x") { e.preventDefault(); window.S4VocabEngine.ignoreCurrentWord(); return; }
    if (["1", "2", "3", "4"].includes(key)) {
      const opts = document.querySelectorAll("#s4vCardHost .opt-btn");
      if (opts.length) {
        if (tapTooSoon()) return;
        const b = opts[Number(key) - 1];
        if (b) b.click();
        return;
      }
    }
    if (currentMode === "smart" && (e.code === "Space" || e.key === "Enter") && studyQueue[0] && studyQueue[0]._task === "intro") {
      e.preventDefault();
      window.S4VocabEngine.introDone();
      return;
    }
    if (currentMode === "flashcard") {
      if (e.code === "Space" || e.key === "Enter") { e.preventDefault(); if (!isFlipped) window.S4VocabEngine.flipCard(); }
      else if (isFlipped && ["1", "2", "3", "4"].includes(key)) {
        if (tapTooSoon()) return;
        window.S4VocabEngine.rateBtn(Number(key) - 1);
      }
    }
  });
})();
