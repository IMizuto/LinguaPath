/* LinguaPath Shared UI Controller (Icons, Smart Nav, Toast, Modal Alerts/Confirms/Prompts, Search & Lobby Helpers)
 * Expose global window.S4UI cho tất cả các trang (Home, Vocab, Grammar, Reading, Listening, Writing, TED, Speaking, HSK).
 */
(function () {
  "use strict";

  const SVG_PATHS = {
    // 23 Core Roadmap & Skill Icons (100% đồng bộ ielts/roadmap/index.html)
    grammar: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/>',
    vocab: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>',
    listening: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z"/>',
    reading: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    writing: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    speaking: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>',
    tedtalks: '<rect x="2" y="6" width="20" height="12" rx="3"/><polygon points="10 9 15 12 10 15 10 9"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    play: '<polygon points="6 4 20 12 6 20 6 4"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    sparkle: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    m1: '<path d="M12 22v-9"/><path d="M15.14 8.86a4.5 4.5 0 0 1 6.36 0 4.5 4.5 0 0 1-6.36 6.36L12 12l3.14-3.14Z"/><path d="M8.86 8.86a4.5 4.5 0 0 0-6.36 0 4.5 4.5 0 0 0 6.36 6.36L12 12 8.86 8.86Z"/>',
    m2: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    m3: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>',
    m4: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    m5: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',

    // Navigation, Auth, Media, Theme & Study System Icons
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    menu: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
    backup: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
    restore: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    turtle: '<circle cx="12" cy="12" r="10"/><path d="m10 8 4 4-4 4"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    brush: '<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    refresh: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    graduation: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    map: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    error: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    briefcase: '<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    hsk: '<path d="M4 7h16"/><path d="M12 3v18"/><path d="M7 11h10v7H7z"/>',
    toeic: '<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    keyboard: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.001"/><path d="M10 8h.001"/><path d="M14 8h.001"/><path d="M18 8h.001"/><path d="M8 12h.001"/><path d="M12 12h.001"/><path d="M16 12h.001"/><path d="M7 16h10"/>',
    smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>'
  };

  const TONE_ICON_NAMES = {
    info: "info",
    primary: "info",
    success: "check",
    warn: "alert",
    error: "error",
    danger: "trash",
    prompt: "edit",
    help: "help"
  };

  function icon(name, size, extraClass) {
    const sz = Number(size) > 0 ? Number(size) : 16;
    const body = SVG_PATHS[name] || SVG_PATHS.sparkle;
    const cls = extraClass ? ` class="${escapeHtml(extraClass)}"` : "";
    return `<svg${cls} width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  function renderThemeButton(btnOrSel, isDarkOverride) {
    const btn = typeof btnOrSel === "string" ? document.querySelector(btnOrSel) : btnOrSel;
    if (!btn) return;
    const isDark = typeof isDarkOverride === "boolean"
      ? isDarkOverride
      : document.documentElement.classList.contains("dark");
    btn.setAttribute("data-lp-theme-toggle", "1");
    btn.setAttribute("data-theme-mode", isDark ? "dark" : "light");
    btn.innerHTML = icon(isDark ? "sun" : "moon", 16);
    const label = isDark
      ? "Đang ở chế độ Tối — Bấm để chuyển sang Sáng"
      : "Đang ở chế độ Sáng — Bấm để chuyển sang Tối";
    btn.title = label;
    btn.setAttribute("aria-label", label);
  }

  function inferCoursePrefix() {
    const p = (location.pathname || "").replace(/\\/g, "/").toLowerCase();
    if (p.includes("/ielts/")) return "ielts";
    if (p.includes("/hsk/")) return "hsk";
    if (p.includes("/tedtalks/")) return "ted";
    return "";
  }

  function initSmartBackButton(opts) {
    const o = opts || {};
    const el = typeof o.element === "string"
      ? document.querySelector(o.element)
      : (o.element || document.querySelector("#lpBackBtn, .lp-back-pill, a.back-btn"));
    if (!el) return false;

    let params = null;
    try { params = new URLSearchParams(location.search); } catch (e) { params = null; }
    const fromParam = params ? String(params.get("from") || "").toLowerCase() : "";
    const ref = String(document.referrer || "").toLowerCase();
    const cameFromRoadmap = fromParam === "roadmap" || (o.checkReferrer !== false && ref.includes("/roadmap/"));

    const course = o.course || inferCoursePrefix();
    const roadmapHref = o.roadmapUrl || (course === "ted" ? "../ielts/roadmap/index.html" : "../roadmap/index.html");
    const defaultHref = o.defaultUrl || el.getAttribute("href") || (course === "ielts" ? "../../index.html#ielts" : "../index.html");

    const targetHref = cameFromRoadmap ? roadmapHref : defaultHref;
    const targetLabel = cameFromRoadmap ? (o.roadmapLabel || "Lộ trình") : (o.defaultLabel || "");
    const targetTitle = cameFromRoadmap ? (o.roadmapTitle || "Quay về Lộ trình học") : (o.defaultTitle || el.getAttribute("title") || "");

    if (el.tagName === "A") {
      el.setAttribute("href", targetHref);
    } else if (cameFromRoadmap) {
      el.onclick = function (e) {
        if (e && e.preventDefault) e.preventDefault();
        location.href = targetHref;
      };
    }
    if (targetTitle) el.setAttribute("title", targetTitle);

    if (targetLabel) {
      el.innerHTML = `${icon("chevronLeft", 15)}<span>${escapeHtml(targetLabel)}</span>`;
    }
    return cameFromRoadmap;
  }

  function toggleSidebar(forceOpen) {
    const sidebar = document.getElementById("sidebar") || document.querySelector(".sidebar");
    const backdrop = document.getElementById("sidebarBackdrop") || document.querySelector(".sidebar-backdrop");
    const btn = document.getElementById("btnToggleSidebar") || document.querySelector(".menu-toggle-btn");
    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
      const willOpen = typeof forceOpen === "boolean"
        ? forceOpen
        : !(sidebar && sidebar.classList.contains("open"));
      if (sidebar) sidebar.classList.toggle("open", willOpen);
      if (backdrop) backdrop.classList.toggle("open", willOpen);
      if (btn) btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      return willOpen;
    }

    const willOpen = typeof forceOpen === "boolean"
      ? forceOpen
      : document.body.classList.contains("sidebar-collapsed");
    document.body.classList.toggle("sidebar-collapsed", !willOpen);
    if (btn) {
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      const deskLbl = btn.querySelector(".s4-desk-sb-lbl");
      if (deskLbl) {
        deskLbl.textContent = willOpen ? "Ẩn mục lục" : "Hiện mục lục";
      }
    }
    return willOpen;
  }

  function ensureAuroraLayer() {
    if (typeof document === "undefined" || !document.body) return;
    if (document.querySelector(".lp-aurora-layer, .rm-aurora-layer")) return;
    const layer = document.createElement("div");
    layer.className = "lp-aurora-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.insertBefore(layer, document.body.firstChild);
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", ensureAuroraLayer);
    } else {
      ensureAuroraLayer();
    }
  }

  function getMountHost() {
    return document.fullscreenElement || document.body || document.documentElement;
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function normalizeSearch(str) {
    return String(str || "")
      .replace(/[đĐ]/g, "d")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đð]/g, "d")
      .replace(/[üǖǘǚǜ]/g, "u")
      .replace(/[’‘`]/g, "'")
      .replace(/[-–—_/\\]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isCbtActive() {
    return !!(document.fullscreenElement || (document.body && (document.body.classList.contains("s4-cbt-mode") || document.body.classList.contains("in-cbt-mode"))));
  }

  /* ---------------- 1. UNIFIED TOAST ---------------- */
  let activeToastTimer = null;
  function toast(typeOrOpts, msg, extraOpts) {
    let cfg;
    if (typeOrOpts && typeof typeOrOpts === "object") {
      cfg = Object.assign({}, typeOrOpts);
    } else {
      let t = typeOrOpts;
      if (t === true) t = "success";
      else if (t === false) t = "error";
      cfg = Object.assign({ type: t || "info", message: msg }, extraOpts || {});
    }

    const type = cfg.type || "info";
    const position = cfg.position || "bottom";
    const duration = Number(cfg.duration) > 0 ? Number(cfg.duration) : (type === "error" || type === "warn" ? 2600 : 1900);
    const host = getMountHost();

    let stack = document.getElementById("s4UiToastStack");
    if (!stack) {
      stack = document.createElement("div");
      stack.id = "s4UiToastStack";
      stack.className = "s4-ui-toast-stack";
    }
    if (stack.parentElement !== host) {
      host.appendChild(stack);
    }
    stack.className = "s4-ui-toast-stack" + (position === "bottom" ? " s4-ui-toast-stack--bottom" : "");

    if (activeToastTimer) {
      clearTimeout(activeToastTimer);
      activeToastTimer = null;
    }
    stack.innerHTML = "";

    const el = document.createElement("div");
    el.className = "s4-ui-toast is-" + (type === "good" ? "success" : type);
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    if (cfg.html != null) {
      el.innerHTML = String(cfg.html);
    } else {
      el.textContent = String(cfg.message || "");
    }
    stack.appendChild(el);

    requestAnimationFrame(function () {
      el.classList.add("show");
    });

    activeToastTimer = setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 200);
    }, duration);
  }

  /* ---------------- 2. UNIFIED MODAL (ALERT / CONFIRM / PROMPT) ---------------- */
  function openModal(opts) {
    return new Promise(function (resolve) {
      const host = getMountHost();
      const prevOverflow = document.body ? document.body.style.overflow : "";
      const prevFocus = document.activeElement;
      let closed = false;

      const backdrop = document.createElement("div");
      backdrop.className = "s4-ui-backdrop";

      const tone = opts.tone || "primary";
      const iconHtml = opts.icon
        ? (SVG_PATHS[opts.icon] ? icon(opts.icon, 18) : escapeHtml(opts.icon))
        : icon(TONE_ICON_NAMES[tone] || "info", 18);
      const titleText = opts.title || (opts.mode === "confirm" ? "Xác nhận thao tác" : opts.mode === "prompt" ? "Nhập thông tin" : "Thông báo");
      const okLabel = opts.confirmText || (opts.mode === "confirm" ? "Xác nhận" : "Đóng");
      const cancelLabel = opts.cancelText || "Hủy";

      const inputId = "s4UiDialogInput_" + Date.now();
      let inputHtml = "";
      if (opts.mode === "prompt") {
        if (opts.multiline) {
          inputHtml = `<textarea id="${inputId}" class="s4-ui-dialog-input" rows="3" placeholder="${escapeHtml(opts.placeholder || "")}" ${opts.readOnly ? "readonly" : ""}>${escapeHtml(opts.defaultValue || "")}</textarea>`;
        } else {
          inputHtml = `<input id="${inputId}" type="${escapeHtml(opts.inputType || "text")}" class="s4-ui-dialog-input" value="${escapeHtml(opts.defaultValue || "")}" placeholder="${escapeHtml(opts.placeholder || "")}" ${opts.readOnly ? "readonly" : ""}>`;
        }
      }

      const showCancel = opts.mode === "confirm" || opts.mode === "prompt";
      const okBtnClass = tone === "danger" ? "is-danger" : (tone === "success" ? "is-success" : "is-primary");

      backdrop.innerHTML = `
        <div class="s4-ui-dialog" role="dialog" aria-modal="true">
          <div class="s4-ui-dialog-head">
            <span class="s4-ui-dialog-icon is-${escapeHtml(tone)}">${iconHtml}</span>
            <h3 class="s4-ui-dialog-title">${escapeHtml(titleText)}</h3>
          </div>
          <div class="s4-ui-dialog-body">${opts.html != null ? opts.html : escapeHtml(opts.message || "")}</div>
          ${inputHtml}
          <div class="s4-ui-dialog-actions">
            ${showCancel ? `<button type="button" class="s4-ui-btn" data-act="cancel">${escapeHtml(cancelLabel)}</button>` : ""}
            <button type="button" class="s4-ui-btn ${okBtnClass}" data-act="ok">${escapeHtml(okLabel)}</button>
          </div>
        </div>
      `;

      function cleanup(result) {
        if (closed) return;
        closed = true;
        document.removeEventListener("keydown", onKey, true);
        backdrop.classList.remove("open");
        if (document.body) document.body.style.overflow = prevOverflow;
        setTimeout(function () {
          if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
          try { if (prevFocus && typeof prevFocus.focus === "function") prevFocus.focus({ preventScroll: true }); } catch (e) {}
        }, 140);
        resolve(result);
      }

      const inputEl = backdrop.querySelector("#" + inputId);
      const okBtn = backdrop.querySelector('[data-act="ok"]');
      const cancelBtn = backdrop.querySelector('[data-act="cancel"]');

      function confirmValue() {
        if (opts.mode === "confirm") cleanup(true);
        else if (opts.mode === "prompt") cleanup(inputEl ? inputEl.value : "");
        else cleanup(undefined);
      }
      function cancelValue() {
        if (opts.mode === "confirm") cleanup(false);
        else if (opts.mode === "prompt") cleanup(null);
        else cleanup(undefined);
      }

      function onKey(e) {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          cancelValue();
        } else if (e.key === "Enter" && !(opts.multiline && document.activeElement === inputEl)) {
          if (opts.mode === "alert" || opts.mode === "prompt") {
            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            confirmValue();
          }
        }
      }

      if (okBtn) okBtn.addEventListener("click", confirmValue);
      if (cancelBtn) cancelBtn.addEventListener("click", cancelValue);
      backdrop.addEventListener("click", function (e) {
        if (e.target === backdrop) {
          if (opts.mode === "alert") cleanup(undefined);
          else cancelValue();
        }
      });

      document.addEventListener("keydown", onKey, true);
      host.appendChild(backdrop);
      requestAnimationFrame(function () {
        backdrop.classList.add("open");
        const preferCancel = opts.mode === "confirm" && (opts.tone === "danger" || opts.tone === "warn") && cancelBtn;
        if (inputEl) {
          try { inputEl.focus({ preventScroll: true }); inputEl.select(); } catch (e) {}
        } else if (preferCancel) {
          try { cancelBtn.focus({ preventScroll: true }); } catch (e) {}
        } else if (okBtn) {
          try { okBtn.focus({ preventScroll: true }); } catch (e) {}
        }
      });
    });
  }

  function uiAlert(message, opts) {
    const o = Object.assign({ mode: "alert", message: message }, opts || {});
    if (o.asToast) {
      toast(o.tone === "danger" ? "error" : (o.tone || "info"), message, o);
      return Promise.resolve();
    }
    return openModal(o);
  }

  function uiConfirm(message, optsOrCb, maybeCb) {
    let opts = {};
    let cb = null;
    if (typeof optsOrCb === "function") {
      cb = optsOrCb;
    } else {
      opts = optsOrCb || {};
      if (typeof maybeCb === "function") cb = maybeCb;
    }
    const p = openModal(Object.assign({
      mode: "confirm",
      tone: "warn",
      icon: "help",
      title: "Xác nhận",
      confirmText: "Tiếp tục",
      cancelText: "Hủy",
      message: message
    }, opts));
    if (cb) {
      p.then(function (ok) { if (ok) cb(); });
    }
    return p;
  }

  function uiPrompt(message, defaultValue, opts) {
    return openModal(Object.assign({
      mode: "prompt",
      tone: "primary",
      icon: "edit",
      title: "Nhập nội dung",
      confirmText: "Lưu",
      cancelText: "Hủy",
      message: message,
      defaultValue: defaultValue == null ? "" : String(defaultValue)
    }, opts || {}));
  }

  /* ---------------- 3. REUSABLE SEARCH BAR HTML & WIRING (Dùng cho Reading/Listening/Writing/Speaking) ---------------- */
  function isOneEditWordMatch(a, b) {
    var la = a.length;
    var lb = b.length;
    if (Math.abs(la - lb) > 1) return false;
    var i = 0;
    var j = 0;
    var edits = 0;
    while (i < la && j < lb) {
      if (a.charCodeAt(i) === b.charCodeAt(j)) {
        i++;
        j++;
      } else {
        edits++;
        if (edits > 1) return false;
        if (la > lb) i++;
        else if (lb > la) j++;
        else { i++; j++; }
      }
    }
    if (i < la || j < lb) edits++;
    return edits <= 1;
  }

  function isTokenFuzzyHit(tok, normalizedHaystack) {
    if (!tok || !normalizedHaystack) return false;
    if (normalizedHaystack.indexOf(tok) !== -1) return true;
    if (tok.length < 4) return false;
    if (window.S4SearchEngine && typeof window.S4SearchEngine.isFuzzyTokenHit === "function") {
      return window.S4SearchEngine.isFuzzyTokenHit(tok, normalizedHaystack);
    }
    var words = normalizedHaystack.split(/[\s,.;:!?()[\]{}"']+/).filter(Boolean);
    for (var i = 0; i < words.length; i++) {
      if (isOneEditWordMatch(tok, words[i])) return true;
    }
    return false;
  }

  function matchesSearch(haystack, query) {
    const q = normalizeSearch(query);
    if (!q) return true;
    const h = normalizeSearch(haystack);
    if (!h) return false;
    const tokens = q.split(" ").filter(Boolean);
    for (var i = 0; i < tokens.length; i++) {
      if (h.indexOf(tokens[i]) === -1 && !isTokenFuzzyHit(tokens[i], h)) {
        return false;
      }
    }
    return true;
  }

  function scoreSearch(haystack, query) {
    const q = normalizeSearch(query);
    if (!q) return 1000;
    const h = normalizeSearch(haystack);
    if (!h) return 0;
    if (window.S4SearchEngine && typeof window.S4SearchEngine.fuzzyScore === "function") {
      return window.S4SearchEngine.fuzzyScore(q, h);
    }
    if (h === q) return 1000;
    if (h.indexOf(q) === 0) return 940;
    const idx = h.indexOf(q);
    if (idx > 0) return /[\s,.;:!?()[\]{}"']/.test(h.charAt(idx - 1)) ? 880 : 780;
    const tokens = q.split(" ").filter(Boolean);
    if (!tokens.length) return 0;
    let sum = 0;
    for (var i = 0; i < tokens.length; i++) {
      if (h.indexOf(tokens[i]) !== -1) sum += 760;
      else if (isTokenFuzzyHit(tokens[i], h)) sum += 580;
      else return 0;
    }
    return Math.round(sum / tokens.length);
  }

  function syncSearchClear(inputOrId) {
    const inp = typeof inputOrId === "string" ? document.getElementById(inputOrId) : inputOrId;
    if (!inp) return;
    const field = inp.closest ? inp.closest(".s4-search-field") : inp.parentElement;
    const clr = field ? field.querySelector(".s4-search-clear") : null;
    if (clr) clr.classList.toggle("visible", !!String(inp.value || "").trim());
  }

  function bindSearchBar(cfg) {
    const o = cfg || {};
    const inp = typeof o.input === "string" ? document.getElementById(o.input) : o.input;
    if (!inp || inp.dataset.s4SearchBound === "1") return;
    inp.dataset.s4SearchBound = "1";

    const field = inp.closest ? inp.closest(".s4-search-field") : inp.parentElement;
    const grp = inp.closest ? inp.closest(".s4-search-group") : null;
    const clr = (typeof o.clearBtn === "string" ? document.getElementById(o.clearBtn) : o.clearBtn)
      || (field ? field.querySelector(".s4-search-clear") : null);
    const btn = (typeof o.searchBtn === "string" ? document.getElementById(o.searchBtn) : o.searchBtn)
      || (grp ? grp.querySelector(".s4-search-btn") : null);
    const delay = typeof o.delay === "number" ? o.delay : 150;

    let timer = null;
    let isComposing = false;

    function fire(reason, immediate) {
      if (timer) { clearTimeout(timer); timer = null; }
      const val = inp.value || "";
      syncSearchClear(inp);
      if (typeof o.onSearch !== "function") return;
      if (immediate) {
        o.onSearch(val, { immediate: true, reason: reason || "submit" });
      } else {
        timer = setTimeout(function () {
          timer = null;
          o.onSearch(inp.value || "", { immediate: false, reason: reason || "input" });
        }, delay);
      }
    }

    inp.addEventListener("compositionstart", function () { isComposing = true; });
    inp.addEventListener("compositionend", function () {
      isComposing = false;
      fire("input", false);
    });
    inp.addEventListener("input", function () {
      syncSearchClear(inp);
      if (!isComposing) fire("input", false);
    });
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        fire("enter", true);
      } else if (e.key === "Escape" && inp.value) {
        e.preventDefault();
        inp.value = "";
        fire("clear", true);
      }
    });
    if (clr) {
      clr.addEventListener("click", function () {
        inp.value = "";
        fire("clear", true);
        try { inp.focus({ preventScroll: true }); } catch (e) {}
      });
    }
    if (btn) {
      btn.addEventListener("click", function () {
        fire("submit", true);
      });
    }
    syncSearchClear(inp);
  }

  function buildSearchBarHtml(cfg) {
    const o = cfg || {};
    const id = escapeHtml(o.id || "s4SearchInput");
    const clearId = escapeHtml(o.clearId || id + "_clear");
    const btnId = escapeHtml(o.btnId || id + "_btn");
    const val = escapeHtml(o.value || "");
    const ph = escapeHtml(o.placeholder || "Tìm kiếm...");
    const hasVal = !!String(o.value || "").trim();
    const oninputAttr = o.oninput ? ` oninput="${escapeHtml(o.oninput)}"` : "";
    const onkeydownAttr = o.onkeydown ? ` onkeydown="${escapeHtml(o.onkeydown)}"` : "";
    const onclearAttr = o.onclear ? ` onclick="${escapeHtml(o.onclear)}"` : "";
    const onsubmitAttr = o.onsubmit ? ` onclick="${escapeHtml(o.onsubmit)}"` : "";
    const imeAttrs = o.trackIme
      ? ` oncompositionstart="this.dataset.composing='1'" oncompositionend="this.dataset.composing='0';if(typeof this.oninput==='function')this.oninput();"`
      : "";
    const wrapClasses = ["s4-search-group"];
    if (o.compact) wrapClasses.push("is-compact");
    if (o.wrapClass) wrapClasses.push(o.wrapClass);

    let btnHtml = "";
    if (!o.hideButton) {
      if (o.compact) {
        btnHtml = `<button type="button" id="${btnId}" class="s4-search-btn is-icon" title="${escapeHtml(o.buttonTitle || "Tìm kiếm")}" aria-label="${escapeHtml(o.buttonTitle || "Tìm kiếm")}"${onsubmitAttr}>${icon("search", 15)}</button>`;
      } else {
        btnHtml = `<button type="button" id="${btnId}" class="s4-search-btn"${onsubmitAttr}>${icon("search", 15)}<span>${escapeHtml(o.buttonLabel || "Tìm")}</span></button>`;
      }
    }

    return `
      <div class="${escapeHtml(wrapClasses.join(" "))}" style="${escapeHtml(o.wrapStyle || "")}">
        <div class="s4-search-field">
          <input type="text" id="${id}" class="s4-search-input ${escapeHtml(o.inputClass || "")}" value="${val}" placeholder="${ph}" autocomplete="off"${imeAttrs}${oninputAttr}${onkeydownAttr}>
          <button type="button" id="${clearId}" class="s4-search-clear${hasVal ? " visible" : ""}" title="Xóa từ khóa" aria-label="Xóa từ khóa"${onclearAttr}>${icon("close", 13)}</button>
        </div>
        ${btnHtml}
      </div>
    `;
  }

  function formatTimer(seconds) {
    const s = Math.max(0, Math.floor(Number(seconds) || 0));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
  }

  function renderStepBadge(current, total, prefix) {
    const cur = Math.max(1, Number(current) || 1);
    const tot = Math.max(cur, Number(total) || cur);
    const lbl = escapeHtml(prefix || "Bước");
    return `<span class="s4-step-badge">${lbl} ${cur}/${tot}</span>`;
  }

  function renderSpeakingRecorderHtml(cfg) {
    const o = cfg || {};
    const btnId = escapeHtml(o.btnId || "s4SpeakRecBtn");
    const timerId = escapeHtml(o.timerId || "s4SpeakTimer");
    const statusId = escapeHtml(o.statusId || "s4SpeakStatus");
    const recording = !!o.recording;
    const labelHtml = o.label
      ? escapeHtml(o.label)
      : `${icon(recording ? "stop" : "mic", 15)}<span>${recording ? "Dừng ghi âm" : "Bắt đầu nói"}</span>`;
    const status = escapeHtml(o.status || (recording ? "Đang ghi âm..." : "Sẵn sàng luyện nói"));
    const timeStr = escapeHtml(formatTimer(o.seconds || 0));
    const onclickAttr = o.onclick ? ` onclick="${escapeHtml(o.onclick)}"` : "";
    return `
      <div class="s4-speaking-recorder">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <button type="button" id="${btnId}" class="s4-mic-btn${recording ? " is-recording" : ""}"${onclickAttr}>${labelHtml}</button>
          <span class="s4-waveform-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <span id="${statusId}" style="font-size:13px;font-weight:700;color:var(--muted,#64748b);">${status}</span>
        </div>
        <span id="${timerId}" class="s4-step-badge" style="font-variant-numeric:tabular-nums;">${icon("clock", 13)}<span>${timeStr}</span></span>
      </div>
    `;
  }

  // ---------- Unified English Pronunciation Engine (IELTS & TED Talks) ----------
  let enPlayToken = 0;
  let enAudioEl = null;
  let enLastDebug = { tier: "", url: "", lang: "", text: "", error: "" };

  function cleanEnglishForSpeech(raw) {
    let s = String(raw || "")
      .replace(/[’‘`]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\/[^/\s]*[əɪʊɔɑæʌɜʃʒθðŋːˈˌ][^/]*\//g, " ")
      .replace(/\(\s*(?:n|v|adj|adv|prep|conj|pron|interj|phr|phr\.?\s*v|idiom|n\.|v\.|adj\.|adv\.|uk|us|br|am|formal|informal|plural|pl|singular|sg|c|u)\.?\s*\)/gi, " ")
      .replace(/\bsb\s*\/\s*sth\b/gi, "something")
      .replace(/\bsth\s*\/\s*sb\b/gi, "something")
      .replace(/\bsb\.?\b/gi, "somebody")
      .replace(/\bsth\.?\b/gi, "something")
      .replace(/\bs\.o\.?\b/gi, "someone");
    if (s.includes("/")) {
      const firstVariant = s.split("/")[0].trim();
      if (firstVariant.length >= 2) s = firstVariant;
    }
    return s
      .replace(/\s+/g, " ")
      .replace(/^[\s,;:\-–—]+|[\s,;:\-–—]+$/g, "")
      .trim();
  }

  function normalizeEnglishLang(lang) {
    const l = String(lang || "en-US").toLowerCase();
    if (l.startsWith("en-gb") || l === "uk" || l === "gb") return "en-GB";
    if (l.startsWith("en-au") || l === "au") return "en-AU";
    return "en-US";
  }

  function pickEnglishVoice(lang) {
    if (!("speechSynthesis" in window) || typeof window.speechSynthesis.getVoices !== "function") return null;
    const target = normalizeEnglishLang(lang).toLowerCase();
    const voices = (window.speechSynthesis.getVoices() || []).filter((v) => /^en([-_]|$)/i.test(v.lang || ""));
    if (!voices.length) return null;

    function scoreVoice(v) {
      let sc = 0;
      const vl = String(v.lang || "").toLowerCase().replace("_", "-");
      const vn = String(v.name || "").toLowerCase();
      if (vl === target) sc += 100;
      else if (vl.startsWith(target.slice(0, 5))) sc += 80;
      else if (vl.startsWith("en-us") || vl.startsWith("en-gb")) sc += 20;
      if (/natural|neural|google|online|sonia|ryan|libby|aria|guy|jenny|natasha|william|samantha|daniel|karen/.test(vn)) sc += 40;
      if (/microsoft/.test(vn) && !/natural|online/.test(vn)) sc += 10;
      if (/espeak|compact|eloquence/.test(vn)) sc -= 30;
      return sc;
    }

    voices.sort((a, b) => scoreVoice(b) - scoreVoice(a));
    return voices[0] || null;
  }

  function resolveEnglishVoiceAsync(lang, maxWaitMs) {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window) || typeof window.speechSynthesis.getVoices !== "function") {
        return resolve(null);
      }
      const immediate = pickEnglishVoice(lang);
      if (immediate) return resolve(immediate);
      let done = false;
      function finish() {
        if (done) return;
        done = true;
        clearTimeout(t);
        try {
          if (window.speechSynthesis.removeEventListener) {
            window.speechSynthesis.removeEventListener("voiceschanged", onChanged);
          }
        } catch (e) {}
        resolve(pickEnglishVoice(lang));
      }
      function onChanged() {
        if (pickEnglishVoice(lang)) finish();
      }
      const t = setTimeout(finish, maxWaitMs || 350);
      try {
        if (window.speechSynthesis.addEventListener) {
          window.speechSynthesis.addEventListener("voiceschanged", onChanged);
        }
      } catch (e) {}
    });
  }

  function stopEnglish() {
    enPlayToken++;
    if (enAudioEl) {
      try {
        enAudioEl.pause();
        enAudioEl.removeAttribute("src");
        enAudioEl.load();
      } catch (e) {}
    }
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }

  function playEnAudioUrl(url, rate, token, tierName, lang, cleanText, timeoutMs) {
    return new Promise((resolve, reject) => {
      if (token !== enPlayToken) return resolve(false);
      if (!enAudioEl) {
        enAudioEl = new Audio();
        enAudioEl.preload = "auto";
      }
      const audio = enAudioEl;
      let settled = false;
      const safeRate = Math.max(0.6, Math.min(1.5, Number(rate) || 1.0));
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          cleanup();
          reject(new Error("en_audio_timeout"));
        }
      }, timeoutMs || 3500);

      function cleanup() {
        clearTimeout(timer);
        audio.onloadedmetadata = null;
        audio.onplaying = null;
        audio.onended = null;
        audio.onerror = null;
      }

      audio.onloadedmetadata = () => {
        try { audio.playbackRate = safeRate; } catch (e) {}
      };
      audio.onplaying = () => {
        clearTimeout(timer);
        try { audio.playbackRate = safeRate; } catch (e) {}
        enLastDebug = { tier: tierName, url, lang, text: cleanText, error: "" };
      };
      audio.onended = () => {
        if (settled) return;
        settled = true;
        enLastDebug = { tier: tierName, url, lang, text: cleanText, error: "" };
        cleanup();
        resolve(true);
      };
      audio.onerror = () => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error("en_audio_error"));
      };

      try {
        audio.pause();
        audio.defaultPlaybackRate = safeRate;
        audio.src = url;
        audio.playbackRate = safeRate;
        const p = audio.play();
        if (p && typeof p.catch === "function") {
          p.catch((err) => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(err || new Error("en_audio_rejected"));
          });
        }
      } catch (err) {
        if (!settled) {
          settled = true;
          cleanup();
          reject(err);
        }
      }
    });
  }

  async function speakEnglish(text, opts) {
    const o = opts || {};
    const clean = cleanEnglishForSpeech(text);
    const lang = normalizeEnglishLang(o.lang || "en-US");
    const rate = Math.max(0.6, Math.min(1.5, Number(o.rate) || 0.95));
    const audioUrl = String(o.audioUrl || "").trim();
    const isPrivateTts = audioUrl && (audioUrl.includes("/ai_services/tts") || audioUrl.includes("study4.com/login"));

    if (!clean && (!audioUrl || isPrivateTts)) return false;

    stopEnglish();
    const myToken = enPlayToken;
    if (typeof o.onStart === "function") {
      try { o.onStart(); } catch (e) {}
    }

    const candidates = [];
    if (audioUrl && !isPrivateTts) {
      candidates.push(["direct_media", audioUrl, 3800]);
    }
    if (clean && navigator.onLine !== false && o.preferNeural !== false) {
      // 1) Từ đơn tiếng Anh: dùng Oxford/Google Studio Dictionary MP3 (gstatic, CORP: cross-origin, hoạt động mọi Referer)
      if (/^[a-z]{2,28}$/i.test(clean)) {
        const wLow = clean.toLowerCase();
        const accentCode = lang === "en-US" ? "us" : "gb";
        candidates.push([
          "gstatic_dict",
          `https://ssl.gstatic.com/dictionary/static/sounds/20200429/${encodeURIComponent(wLow)}--_${accentCode}_1.mp3`,
          3000
        ]);
      }
      // 2) Chỉ gọi Google Translate TTS nếu trang đã khai báo meta referrer=no-referrer (tránh lỗi 404/ORB khi có Referer)
      const hasNoReferrer = !!(
        typeof document !== "undefined" &&
        typeof document.querySelector === "function" &&
        document.querySelector('meta[name="referrer"][content="no-referrer"]')
      );
      if (hasNoReferrer && clean.length <= 140) {
        const enc = encodeURIComponent(clean);
        const gLang = lang === "en-GB" ? "en-GB" : (lang === "en-AU" ? "en-AU" : "en-US");
        candidates.push(["gtts_en", `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=${gLang}&q=${enc}`, 3600]);
      }
    }

    for (const [tier, url, timeoutMs] of candidates) {
      if (myToken !== enPlayToken) return false;
      try {
        const ok = await playEnAudioUrl(url, rate, myToken, tier, lang, clean, timeoutMs);
        if (ok) {
          if (myToken === enPlayToken && typeof o.onEnd === "function") {
            try { o.onEnd(); } catch (e) {}
          }
          return true;
        }
      } catch (e) {
        enLastDebug.error = `${tier}:${e && e.message ? e.message : "fail"}`;
      }
    }

    if (myToken !== enPlayToken || !clean || !("speechSynthesis" in window) || typeof window.SpeechSynthesisUtterance !== "function") {
      if (myToken === enPlayToken && typeof o.onEnd === "function") {
        try { o.onEnd(); } catch (e) {}
      }
      return false;
    }

    const voice = await resolveEnglishVoiceAsync(lang, 350);
    if (myToken !== enPlayToken) return false;

    return new Promise((resolve) => {
      try {
        window.speechSynthesis.cancel();
        const u = new window.SpeechSynthesisUtterance(clean);
        if (voice) {
          u.voice = voice;
          u.lang = voice.lang || lang;
        } else {
          u.lang = lang;
        }
        u.rate = rate;
        let done = false;
        function finish(ok) {
          if (done) return;
          done = true;
          if (ok) enLastDebug = { tier: "webspeech_en", url: voice ? voice.name : lang, lang: u.lang, text: clean, error: "" };
          if (myToken === enPlayToken && typeof o.onEnd === "function") {
            try { o.onEnd(); } catch (e) {}
          }
          resolve(ok);
        }
        u.onend = () => finish(true);
        u.onerror = () => finish(false);
        window.speechSynthesis.speak(u);
      } catch (e) {
        if (typeof o.onEnd === "function") {
          try { o.onEnd(); } catch (err) {}
        }
        resolve(false);
      }
    });
  }

  function keepDialogFocus(dialog, initialFocus, returnFocus) {
    if (!dialog) return function () {};
    const previous = returnFocus || document.activeElement;
    const focusable = () => [...dialog.querySelectorAll(
      'a[href], button, textarea, select, input, summary, [tabindex]'
    )].filter(el => !el.disabled && el.tabIndex >= 0 && el.getClientRects().length && !el.closest('[inert]'));
    function moveFocus(event) {
      if (event.key !== 'Tab') return;
      const nodes = focusable();
      const first = nodes[0] || dialog;
      const last = nodes[nodes.length - 1] || first;
      const active = document.activeElement;
      if (!dialog.contains(active) || (event.shiftKey ? active === first : active === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }
    dialog.tabIndex = -1;
    document.addEventListener('keydown', moveFocus, true);
    (initialFocus || focusable()[0] || dialog).focus({ preventScroll: true });
    return function () {
      document.removeEventListener('keydown', moveFocus, true);
      if (previous && previous.isConnected && typeof previous.focus === 'function') previous.focus({ preventScroll: true });
    };
  }

  const searchScriptHref = document.currentScript && new URL('s4-global-search.js', document.currentScript.src).href;
  let searchScript;
  function openGlobalSearch() {
    if (window.openGlobalSearchModal) {
      window.openGlobalSearchModal();
      return;
    }
    if (!searchScriptHref || searchScript) return;
    searchScript = document.createElement('script');
    searchScript.src = searchScriptHref;
    searchScript.onload = () => { if (window.openGlobalSearchModal) window.openGlobalSearchModal(); };
    searchScript.onerror = () => {
      searchScript.remove();
      searchScript = null;
      toast('warn', 'Chưa mở được tra cứu. Hãy thử lại.');
    };
    document.head.appendChild(searchScript);
  }

  document.addEventListener('keydown', function (event) {
    if (window.openGlobalSearchModal || event.isComposing || document.querySelector('#lpDisclaimerModal')) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openGlobalSearch();
    }
  });

  if (performance.getEntriesByType('navigation')[0]?.type === 'back_forward') {
    try {
      if (JSON.parse(sessionStorage.getItem('lp_global_search_v1'))?.returnUrl === location.href) {
        window.addEventListener('pageshow', openGlobalSearch, { once: true });
      }
    } catch (error) {}
  }

  window.S4UI = {
    keepDialogFocus: keepDialogFocus,
    openGlobalSearch: openGlobalSearch,
    icon: icon,
    renderThemeButton: renderThemeButton,
    initSmartBackButton: initSmartBackButton,
    toggleSidebar: toggleSidebar,
    ensureAuroraLayer: ensureAuroraLayer,
    toast: toast,
    alert: uiAlert,
    confirm: uiConfirm,
    prompt: uiPrompt,
    escapeHtml: escapeHtml,
    normalizeSearch: normalizeSearch,
    matchesSearch: matchesSearch,
    scoreSearch: scoreSearch,
    syncSearchClear: syncSearchClear,
    bindSearchBar: bindSearchBar,
    getMountHost: getMountHost,
    buildSearchBarHtml: buildSearchBarHtml,
    formatTimer: formatTimer,
    renderStepBadge: renderStepBadge,
    renderSpeakingRecorderHtml: renderSpeakingRecorderHtml,
    cleanEnglishForSpeech: cleanEnglishForSpeech,
    pickEnglishVoice: pickEnglishVoice,
    speakEnglish: speakEnglish,
    stopEnglish: stopEnglish,
    getLastEnglishDebug: () => Object.assign({}, enLastDebug)
  };
})();
