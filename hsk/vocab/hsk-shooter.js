/* LinguaPath — Game "🚀 Bắn từ Hán tự" (HSK 1–6 Word Shooter)
 * Supports 6 falling-word display modes (Pinyin, Nghĩa Việt, Hán-Việt, Chữ Hán, Nghe âm thanh, Tổng hợp),
 * 3 shooting modes (✍️ Viết nét Hán tự via Hanzi Writer, ⌨️ Gõ Hán tự, 🔤 Gõ Pinyin),
 * 3 fall speeds, 5 hearts, Combo, High Score (lp_hsk_shooter_best_v1), SRS integration & missed-word review.
 */
(function (global) {
  "use strict";

  const BEST_KEY = "lp_hsk_shooter_best_v1";
  const charCache = Object.create(null);

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function stripToneMarks(str) {
    return String(str || "")
      .replace(/[ǖǘǚǜüÜ]/g, "v")
      .replace(/u:/gi, "v")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function compactStr(str) {
    return String(str || "")
      .replace(/[ǖǘǚǜüÜ]/g, "v")
      .toLowerCase()
      .replace(/u:/g, "v")
      .replace(/[\s'’\-·.,!?/()]/g, "");
  }

  function shortMeaning(defVi) {
    const raw = String(defVi || "").trim();
    if (!raw) return "";
    // Remove leading parenthetical technical notes like "(tiền tố phủ định...)" if another clause exists
    const parts = raw.split(/[;；]/).map(function (p) { return p.trim(); }).filter(Boolean);
    let pick = parts[0] || raw;
    if (parts.length > 1 && /^\([^)]{12,}\)$/.test(pick)) pick = parts[1];
    pick = pick.replace(/\([^)]{18,}\)/g, "").replace(/\s+/g, " ").trim() || parts[0] || raw;
    if (pick.length > 34) pick = pick.slice(0, 32).replace(/[,\s;]+$/, "") + "…";
    return pick;
  }

  function buildPinyinAccepted(w) {
    const out = new Set();
    const pyAccent = String(w.pinyin || "").trim();
    const pyNum = String(w.pinyinNum || "").trim();

    function addBase(raw) {
      if (!raw) return;
      const cV = compactStr(raw);
      if (cV) out.add(cV);
      const strippedV = compactStr(stripToneMarks(raw));
      if (strippedV) {
        out.add(strippedV);
        if (strippedV.includes("v")) out.add(strippedV.replace(/v/g, "u"));
      }
      if (cV && cV.includes("v")) out.add(cV.replace(/v/g, "u"));
      // Allow omitting neutral tone '5' in numbered pinyin (e.g. dong1xi5 -> dong1xi)
      if (/[1-5]/.test(cV)) {
        const no5 = cV.replace(/5/g, "");
        out.add(no5);
        if (no5.includes("v")) out.add(no5.replace(/v/g, "u"));
        const noTone = cV.replace(/[1-5]/g, "");
        out.add(noTone);
        if (noTone.includes("v")) out.add(noTone.replace(/v/g, "u"));
      }
    }

    pyAccent.split("/").forEach(addBase);
    pyNum.split("/").forEach(addBase);
    return out;
  }

  function getPlainPinyinKey(w) {
    const src = String(w.pinyin || w.pinyinNum || "").split("/")[0];
    return compactStr(stripToneMarks(src)).replace(/[1-5]/g, "");
  }

  function normalizeUserPinyin(input) {
    const raw = String(input || "").trim();
    if (!raw) return { exact: "", stripped: "" };
    const exact = compactStr(raw);
    const stripped = compactStr(stripToneMarks(raw));
    return { exact: exact, stripped: stripped };
  }

  function readBest() {
    try {
      const obj = JSON.parse(localStorage.getItem(BEST_KEY) || "{}");
      return {
        bestScore: Number(obj.bestScore || 0),
        bestCombo: Number(obj.bestCombo || 0),
        totalKills: Number(obj.totalKills || 0),
        gamesPlayed: Number(obj.gamesPlayed || 0),
        updatedAt: Number(obj.updatedAt || 0)
      };
    } catch (e) {
      return { bestScore: 0, bestCombo: 0, totalKills: 0, gamesPlayed: 0, updatedAt: 0 };
    }
  }

  function writeBest(stats) {
    try { localStorage.setItem(BEST_KEY, JSON.stringify(stats)); } catch (e) {}
  }

  function fetchCharStrokeData(ch) {
    if (charCache[ch]) return Promise.resolve(charCache[ch]);
    const urls = [
      "https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/" + encodeURIComponent(ch) + ".json",
      "https://unpkg.com/hanzi-writer-data@2.0.1/" + encodeURIComponent(ch) + ".json"
    ];
    return fetch(urls[0]).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).catch(function () {
      return fetch(urls[1]).then(function (r2) {
        if (!r2.ok) throw new Error("HTTP " + r2.status);
        return r2.json();
      });
    }).then(function (data) {
      charCache[ch] = data;
      return data;
    });
  }

  /* ---------- Lightweight Web Audio Arcade SFX ---------- */
  let audioCtx = null;
  function playSfx(type, muted) {
    if (muted) return;
    try {
      const Ctx = global.AudioContext || global.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      if (type === "hit") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(1180, now + 0.09);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "char") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.07);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "miss") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(210, now);
        osc.frequency.exponentialRampToValueAtTime(95, now + 0.22);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "win") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.09);
        osc.frequency.setValueAtTime(784, now + 0.18);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {}
  }

  /* ---------- Scoped CSS ---------- */
  function injectStyles() {
    if (document.getElementById("hskShooterStyle")) return;
    const css = `
      .sh-wrap { display: flex; flex-direction: column; gap: 10px; }
      .sh-lobby { display: flex; flex-direction: column; gap: 12px; }
      .sh-hero {
        border-radius: 14px; padding: 14px 16px;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #7f1d1d 100%);
        color: #f8fafc; display: flex; justify-content: space-between; align-items: center;
        gap: 10px; flex-wrap: wrap;
      }
      .sh-hero h3 { margin: 0 0 3px; font-size: 17px; font-weight: 800; }
      .sh-hero p { margin: 0; font-size: 12.5px; color: rgba(248,250,252,0.82); line-height: 1.45; }
      .sh-best-pill {
        background: rgba(251,191,36,0.18); border: 1px solid rgba(251,191,36,0.5);
        color: #fde68a; padding: 6px 11px; border-radius: 10px; font-size: 12.5px; font-weight: 800;
        white-space: nowrap;
      }
      .sh-sec {
        background: var(--bg); border: 1px solid var(--border); border-radius: 13px; padding: 11px 12px;
      }
      .sh-sec-lbl {
        font-size: 12px; font-weight: 800; color: var(--muted); text-transform: uppercase;
        letter-spacing: 0.3px; margin-bottom: 8px;
      }
      .sh-chips { display: flex; flex-wrap: wrap; gap: 6px; }
      .sh-chip {
        padding: 7px 11px; border-radius: 10px; border: 1.5px solid var(--border);
        background: var(--card); color: var(--text); font-size: 13px; font-weight: 700;
        cursor: pointer; font-family: inherit; transition: all 0.13s ease;
      }
      .sh-chip:hover { border-color: var(--primary); }
      .sh-chip.active {
        background: rgba(220,38,38,0.14); border-color: #dc2626; color: #dc2626;
      }
      html.dark .sh-chip.active { color: #fca5a5; }
      .sh-tip-line {
        font-size: 12.5px; color: #d97706; background: rgba(217,119,6,0.12);
        border: 1px solid rgba(217,119,6,0.32); border-radius: 10px; padding: 7px 10px;
        margin-top: 8px; font-weight: 600; line-height: 1.4;
      }
      html.dark .sh-tip-line { color: #fcd34d; }

      /* Active HUD & Arena */
      .sh-hud {
        display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;
        background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 8px 11px;
        font-size: 13px; font-weight: 800;
      }
      .sh-hud-left, .sh-hud-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .sh-hearts { letter-spacing: 1px; font-size: 15px; }
      .sh-score-badge { color: var(--primary); }
      .sh-combo-badge {
        background: rgba(245,158,11,0.18); color: #d97706; padding: 2px 8px; border-radius: 99px; font-size: 12px;
      }
      html.dark .sh-combo-badge { color: #fbbf24; }

      .sh-arena-grid {
        display: grid; grid-template-columns: minmax(0, 1fr); gap: 10px; align-items: stretch;
      }
      .sh-arena-grid.write-split {
        grid-template-columns: minmax(0, 1fr) 248px;
      }
      .sh-sky {
        position: relative; width: 100%; height: 350px; border-radius: 15px; overflow: hidden;
        background: radial-gradient(circle at 20% 20%, rgba(56,189,248,0.14), transparent 40%),
                    radial-gradient(circle at 80% 15%, rgba(244,63,94,0.14), transparent 45%),
                    linear-gradient(180deg, #0b132b 0%, #162447 68%, #1e293b 100%);
        border: 2px solid rgba(148,163,184,0.32); user-select: none;
      }
      .sh-sky.danger-flash { animation: shDangerFlash 0.35s ease; }
      @keyframes shDangerFlash {
        0%, 100% { box-shadow: inset 0 0 0 0 rgba(239,68,68,0); }
        40% { box-shadow: inset 0 0 36px 8px rgba(239,68,68,0.6); }
      }
      .sh-danger-line {
        position: absolute; left: 0; right: 0; bottom: 26px; height: 2px;
        background: repeating-linear-gradient(90deg, rgba(248,113,113,0.75) 0 10px, transparent 10px 18px);
        pointer-events: none; z-index: 2;
      }
      .sh-turret {
        position: absolute; left: 50%; bottom: 4px; transform: translateX(-50%);
        width: 44px; height: 24px; border-radius: 12px 12px 4px 4px;
        background: linear-gradient(180deg, #38bdf8, #2563eb);
        border: 1.5px solid #93c5fd; box-shadow: 0 0 14px rgba(56,189,248,0.55);
        display: flex; align-items: center; justify-content: center; font-size: 13px;
        z-index: 5; pointer-events: none;
      }
      .sh-laser-svg {
        position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 6;
      }
      .sh-target {
        position: absolute; left: 0; top: 0; z-index: 4;
        min-width: 84px; max-width: 175px; padding: 6px 10px; border-radius: 11px;
        background: rgba(15, 23, 42, 0.88); color: #f8fafc;
        border: 1.5px solid rgba(148,163,184,0.48); box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        cursor: pointer; text-align: center; will-change: transform;
        transition: border-color 0.12s ease, box-shadow 0.12s ease;
      }
      .sh-target.locked {
        border-color: #fbbf24; background: rgba(30, 41, 59, 0.96);
        box-shadow: 0 0 0 2px rgba(251,191,36,0.35), 0 0 18px rgba(251,191,36,0.45);
        z-index: 5;
      }
      .sh-target.urgent {
        border-color: #f87171;
        box-shadow: 0 0 0 2px rgba(248,113,113,0.45), 0 0 18px rgba(239,68,68,0.55);
      }
      .sh-t-top {
        display: flex; justify-content: center; align-items: center; gap: 4px;
        font-size: 10px; font-weight: 800; color: #93c5fd; margin-bottom: 2px;
      }
      .sh-t-badge {
        padding: 1px 5px; border-radius: 4px; background: rgba(59,130,246,0.28); color: #bfdbfe;
      }
      .sh-t-main { font-size: 15.5px; font-weight: 800; line-height: 1.25; word-break: break-word; }
      .sh-t-main.hz { font-size: 23px; letter-spacing: 1px; }
      .sh-t-prog {
        display: flex; justify-content: center; gap: 3px; margin-top: 3px; font-size: 10px; font-weight: 800;
      }
      .sh-t-dot {
        padding: 0 4px; border-radius: 4px; background: rgba(148,163,184,0.24); color: #cbd5e1;
      }
      .sh-t-dot.done { background: rgba(16,185,129,0.35); color: #6ee7b7; }
      .sh-t-dot.cur { background: rgba(251,191,36,0.35); color: #fde68a; }
      .sh-burst {
        position: absolute; pointer-events: none; z-index: 8; font-weight: 900; font-size: 15px;
        color: #fde047; text-shadow: 0 2px 8px rgba(0,0,0,0.7);
        animation: shBurstUp 0.75s ease-out forwards;
      }
      @keyframes shBurstUp {
        0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -36px) scale(1.2); }
      }
      .sh-hit-banner {
        position: absolute; left: 10px; right: 10px; top: 8px; z-index: 7; pointer-events: none;
        display: flex; justify-content: center;
      }
      .sh-hit-pill {
        background: rgba(16,185,129,0.92); color: #fff; font-size: 12.5px; font-weight: 800;
        padding: 4px 11px; border-radius: 99px; box-shadow: 0 4px 14px rgba(0,0,0,0.3);
        max-width: 95%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .sh-hit-pill.miss { background: rgba(220,38,38,0.92); }
      .sh-pause-overlay {
        position: absolute; inset: 0; background: rgba(15,23,42,0.78); z-index: 10;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
        color: #f8fafc;
      }

      /* Weapon Dock */
      .sh-dock {
        background: var(--bg); border: 1px solid var(--border); border-radius: 14px; padding: 10px 12px;
        display: flex; flex-direction: column; gap: 8px;
      }
      .sh-type-row { display: flex; gap: 7px; align-items: center; }
      .sh-input {
        flex: 1; min-width: 0; height: 42px; border-radius: 11px; border: 2px solid var(--primary);
        background: var(--card); color: var(--text); padding: 0 12px; font-size: 16px; font-weight: 800;
        outline: none; font-family: inherit;
      }
      .sh-fire-btn {
        height: 42px; padding: 0 15px; border-radius: 11px; border: none;
        background: linear-gradient(135deg, #dc2626, #ea580c); color: #fff;
        font-size: 14px; font-weight: 800; cursor: pointer; font-family: inherit; white-space: nowrap;
      }
      .sh-writer-panel {
        display: flex; flex-direction: column; align-items: center; gap: 7px;
        background: var(--bg); border: 1px solid var(--border); border-radius: 14px; padding: 10px;
      }
      .sh-writer-head {
        width: 100%; display: flex; justify-content: space-between; align-items: center;
        gap: 6px; font-size: 12px; font-weight: 800;
      }
      .sh-mi-mini {
        position: relative; width: 204px; height: 204px; border-radius: 12px;
        border: 2px solid var(--primary); background: var(--card); overflow: hidden;
        touch-action: none; flex-shrink: 0;
      }
      .sh-mi-mini svg.sh-grid-svg {
        position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;
      }
      .sh-hw-box {
        position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; touch-action: none;
      }
      .sh-hw-box svg { display: block; width: 100%; height: 100%; touch-action: none; }
      .sh-writer-msg {
        font-size: 12px; font-weight: 700; color: var(--muted); text-align: center; min-height: 18px;
      }
      .sh-writer-msg.ok { color: var(--ok); }
      .sh-writer-msg.bad { color: var(--danger); }

      /* Game Over */
      .sh-over {
        border: 2px solid var(--primary); border-radius: 16px; padding: 20px 16px;
        background: var(--bg); text-align: center;
      }
      .sh-over-grid {
        display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px;
        margin: 14px 0;
      }
      .sh-over-box {
        background: var(--card); border: 1px solid var(--border); border-radius: 11px; padding: 10px 6px;
      }
      .sh-over-val { font-size: 20px; font-weight: 900; color: var(--primary); }
      .sh-over-lbl { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
      .sh-missed-list {
        text-align: left; background: var(--card); border: 1px solid var(--border);
        border-radius: 12px; padding: 10px 12px; margin-top: 12px; max-height: 240px; overflow-y: auto;
      }
      .sh-missed-row {
        display: flex; justify-content: space-between; align-items: center; gap: 8px;
        padding: 7px 0; border-bottom: 1px solid var(--border); font-size: 13.5px;
      }
      .sh-missed-row:last-child { border-bottom: none; }

      @media (max-width: 860px) {
        .sh-arena-grid.write-split { grid-template-columns: minmax(0, 1fr); }
        .sh-arena-grid.write-split .sh-sky { height: 248px; }
        .sh-mi-mini { width: 186px; height: 186px; }
        .sh-over-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 560px) {
        .sh-sky { height: 295px; }
        .sh-t-main { font-size: 14px; }
        .sh-t-main.hz { font-size: 20px; }
      }
    `;
    const style = document.createElement("style");
    style.id = "hskShooterStyle";
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ---------- Shooter Engine Instance ---------- */
  let activeInstance = null;

  function unmount() {
    if (!activeInstance) return;
    activeInstance.destroy();
    activeInstance = null;
  }

  function mount(container, opts) {
    unmount();
    injectStyles();
    if (!container) return;

    const options = opts || {};
    const cfg = {
      source: options.lessonPool && options.lessonPool.words && options.lessonPool.words.length ? "lesson" : "pack",
      displayMode: "vi", // pinyin | vi | hv | hanzi | audio | mix
      shootMode: "write", // write | hanzi | pinyin
      speed: "slow", // slow | medium | fast
      showOutline: false,
      muted: false
    };

    // Remember user's last shooter prefs if saved
    try {
      const saved = JSON.parse(localStorage.getItem("lp_hsk_shooter_prefs_v1") || "{}");
      if (saved.displayMode) cfg.displayMode = saved.displayMode;
      if (saved.shootMode) cfg.shootMode = saved.shootMode;
      if (saved.speed) cfg.speed = saved.speed;
      if (typeof saved.showOutline === "boolean") cfg.showOutline = saved.showOutline;
      if (typeof saved.muted === "boolean") cfg.muted = saved.muted;
    } catch (e) {}

    function savePrefs() {
      try {
        localStorage.setItem("lp_hsk_shooter_prefs_v1", JSON.stringify({
          displayMode: cfg.displayMode,
          shootMode: cfg.shootMode,
          speed: cfg.speed,
          showOutline: cfg.showOutline,
          muted: cfg.muted
        }));
      } catch (e) {}
    }

    const st = {
      phase: "lobby", // lobby | playing | over
      paused: false,
      destroyed: false,
      pool: [],
      bag: [],
      targets: [], // { uid, w, dMode, x, y, speed, el, charIdx, chars, pySet, pyKey }
      nextUid: 1,
      lockedUid: null,
      score: 0,
      combo: 0,
      maxCombo: 0,
      kills: 0,
      hearts: 5,
      missed: [], // unique missed word objects
      missedIds: new Set(),
      rafId: 0,
      lastTs: 0,
      spawnAcc: 0,
      fetchingChar: false,
      writer: null,
      writerTargetUid: null,
      writerCharIdx: -1,
      writerStrokeIdx: 0,
      writerTotalStrokes: 0,
      writerMountSeq: 0,
      writerUnavailable: false,
      hitToastTimer: 0,
      isNewRecord: false,
      customReplayPool: null
    };

    function speakWord(w) {
      if (cfg.muted || !global.HskTTS || !w) return;
      try {
        const text = typeof w === "string" ? w : (w.word || "");
        const opts = { rate: 0.95 };
        if (w && typeof w === "object") {
          if (w.pinyin) opts.pinyin = w.pinyin;
          if (w.pinyinNum) opts.pinyinNum = w.pinyinNum;
        }
        global.HskTTS.speak(text, opts);
      } catch (e) {}
    }

    function resolvePool() {
      if (st.customReplayPool && st.customReplayPool.length) return st.customReplayPool.slice();
      if (cfg.source === "lesson" && options.lessonPool && options.lessonPool.words && options.lessonPool.words.length) {
        return options.lessonPool.words.slice();
      }
      if (cfg.source === "srs" && typeof options.getSrsReviewWords === "function") {
        const rev = options.getSrsReviewWords() || [];
        if (rev.length >= 4) return rev;
      }
      if (cfg.source === "level" && typeof options.getLevelWords === "function") {
        const lv = options.getLevelWords() || [];
        if (lv.length) return lv;
      }
      const pk = typeof options.getPackWords === "function" ? (options.getPackWords() || []) : [];
      return pk;
    }

    function filterUsablePool(rawPool) {
      return (rawPool || []).filter(function (w) {
        if (!w || !w.word) return false;
        const cjk = w.word.match(/[\u4e00-\u9fff\u3400-\u4dbf\u2e80-\u2eff]/g);
        if (!cjk || !cjk.length) return false;
        if (cfg.shootMode === "write" && cjk.length > 4) return false;
        if (cfg.displayMode === "hv" && !w.hanViet) return false;
        return true;
      });
    }

    function nextWordFromBag() {
      if (!st.bag.length) {
        st.bag = st.pool.slice();
        for (let i = st.bag.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const tmp = st.bag[i];
          st.bag[i] = st.bag[j];
          st.bag[j] = tmp;
        }
      }
      // Avoid duplicate currently on screen when pool allows
      for (let k = st.bag.length - 1; k >= 0; k--) {
        const cand = st.bag[k];
        if (!st.targets.some(function (t) { return t.w.word === cand.word; })) {
          st.bag.splice(k, 1);
          return cand;
        }
      }
      return st.bag.pop();
    }

    function pickDisplayModeForSpawn() {
      if (cfg.displayMode !== "mix") return cfg.displayMode;
      let choices = ["pinyin", "vi", "hv", "hanzi", "audio"];
      if (cfg.shootMode === "pinyin") choices = ["vi", "hv", "hanzi", "audio"];
      else if (cfg.shootMode === "hanzi") choices = ["pinyin", "vi", "hv", "audio"];
      return choices[Math.floor(Math.random() * choices.length)];
    }

    function getLockedTarget() {
      if (st.lockedUid) {
        const found = st.targets.find(function (t) { return t.uid === st.lockedUid; });
        if (found) return found;
      }
      if (!st.targets.length) return null;
      // Auto-lock lowest (most urgent) target
      let lowest = st.targets[0];
      for (let i = 1; i < st.targets.length; i++) {
        if (st.targets[i].y > lowest.y) lowest = st.targets[i];
      }
      st.lockedUid = lowest.uid;
      return lowest;
    }

    function showBanner(text, isMiss) {
      const holder = container.querySelector("#shHitBanner");
      if (!holder) return;
      holder.innerHTML = `<span class="sh-hit-pill ${isMiss ? "miss" : ""}">${esc(text)}</span>`;
      clearTimeout(st.hitToastTimer);
      st.hitToastTimer = setTimeout(function () {
        if (holder) holder.innerHTML = "";
      }, 1700);
    }

    function fireLaserVisual(target, isKill) {
      const sky = container.querySelector("#shSky");
      const svg = container.querySelector("#shLaserSvg");
      if (!sky || !svg || !target || !target.el) return;
      const skyRect = sky.getBoundingClientRect();
      const tx = target.x + (target.el.offsetWidth || 90) / 2;
      const ty = target.y + (target.el.offsetHeight || 40) / 2;
      const sx = skyRect.width / 2;
      const sy = skyRect.height - 16;

      const ns = "http://www.w3.org/2000/svg";
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", String(sx));
      line.setAttribute("y1", String(sy));
      line.setAttribute("x2", String(tx));
      line.setAttribute("y2", String(ty));
      line.setAttribute("stroke", isKill ? "#fde047" : "#38bdf8");
      line.setAttribute("stroke-width", isKill ? "4" : "2.5");
      line.setAttribute("stroke-linecap", "round");
      svg.appendChild(line);
      setTimeout(function () {
        if (line.parentNode) line.parentNode.removeChild(line);
      }, 170);

      if (isKill) {
        const burst = document.createElement("div");
        burst.className = "sh-burst";
        burst.style.left = tx + "px";
        burst.style.top = ty + "px";
        burst.textContent = "+" + (100 + Math.min(st.combo, 10) * 15) + (st.combo >= 2 ? " 🔥x" + st.combo : "");
        sky.appendChild(burst);
        setTimeout(function () {
          if (burst.parentNode) burst.parentNode.removeChild(burst);
        }, 760);
      }
    }

    function updateHud() {
      const hEl = container.querySelector("#shHearts");
      const sEl = container.querySelector("#shScore");
      const cEl = container.querySelector("#shCombo");
      const kEl = container.querySelector("#shKills");
      if (hEl) hEl.textContent = "❤️".repeat(Math.max(0, st.hearts)) + "🖤".repeat(Math.max(0, 5 - st.hearts));
      if (sEl) sEl.textContent = String(st.score);
      if (cEl) cEl.textContent = "🔥 x" + st.combo;
      if (kEl) kEl.textContent = String(st.kills);
    }

    function renderTargetInner(t) {
      const badgeMap = { pinyin: "PY", vi: "VI", hv: "HV", hanzi: "汉字", audio: "🔊" };
      let mainHtml = "";
      if (t.dMode === "pinyin") {
        mainHtml = `<div class="sh-t-main">${typeof options.renderPinyin === "function" ? options.renderPinyin(t.w) : esc(t.w.pinyin)}</div>`;
      } else if (t.dMode === "vi") {
        mainHtml = `<div class="sh-t-main">${esc(shortMeaning(t.w.defVi))}</div>`;
      } else if (t.dMode === "hv") {
        mainHtml = `<div class="sh-t-main">${esc(t.w.hanViet || shortMeaning(t.w.defVi))}</div>`;
      } else if (t.dMode === "hanzi") {
        mainHtml = `<div class="sh-t-main hz">${esc(t.w.word)}</div>`;
      } else {
        mainHtml = `<div class="sh-t-main">🔊 Nghe từ</div>`;
      }

      let progHtml = "";
      if (cfg.shootMode === "write" && t.chars.length > 1) {
        progHtml = `<div class="sh-t-prog">${t.chars.map(function (c, i) {
          const cls = i < t.charIdx ? "done" : (i === t.charIdx ? "cur" : "");
          const txt = i < t.charIdx ? c : (t.dMode === "hanzi" ? c : (i + 1));
          return `<span class="sh-t-dot ${cls}">${esc(txt)}</span>`;
        }).join("")}</div>`;
      }

      return `<div class="sh-t-top"><span class="sh-t-badge">${badgeMap[t.dMode] || "HSK"}</span>${t.uid === st.lockedUid ? "<span>🎯</span>" : ""}</div>${mainHtml}${progHtml}`;
    }

    function syncTargetClasses() {
      const sky = container.querySelector("#shSky");
      const skyH = sky ? sky.clientHeight : 320;
      for (let i = 0; i < st.targets.length; i++) {
        const t = st.targets[i];
        if (!t.el) continue;
        const isLocked = t.uid === st.lockedUid;
        t.el.classList.toggle("locked", isLocked);
        t.el.classList.toggle("urgent", t.y > skyH * 0.64);
        t.el.innerHTML = renderTargetInner(t);
      }
    }

    function spawnTarget() {
      const sky = container.querySelector("#shSky");
      if (!sky) return;
      const maxSimultaneous = cfg.shootMode === "write" ? 3 : (cfg.speed === "fast" ? 5 : 4);
      if (st.targets.length >= maxSimultaneous) return;
      const w = nextWordFromBag();
      if (!w) return;

      const chars = w.word.match(/[\u4e00-\u9fff\u3400-\u4dbf\u2e80-\u2eff]/g) || [w.word];
      const dMode = pickDisplayModeForSpawn();
      const skyW = Math.max(260, sky.clientWidth || 320);

      // Base speed in px/sec (write mode slower for fair drawing)
      const baseSpeedMap = { slow: 19, medium: 31, fast: 46 };
      const writeScale = cfg.shootMode === "write" ? 0.56 : 1;
      const lvlBoost = Math.min(1.45, 1 + st.kills * 0.014);
      const speed = (baseSpeedMap[cfg.speed] || 28) * writeScale * lvlBoost * (0.9 + Math.random() * 0.22);

      const el = document.createElement("div");
      el.className = "sh-target";
      const t = {
        uid: st.nextUid++,
        w: w,
        dMode: dMode,
        x: 12,
        y: -48,
        speed: speed,
        el: el,
        charIdx: 0,
        chars: chars,
        pySet: buildPinyinAccepted(w),
        pyKey: getPlainPinyinKey(w)
      };
      el.innerHTML = renderTargetInner(t);
      el.addEventListener("click", function () {
        if (st.paused || st.phase !== "playing") return;
        st.lockedUid = t.uid;
        if (t.dMode === "audio") speakWord(t.w);
        syncTargetClasses();
        if (cfg.shootMode === "write") syncWriterToLocked(true);
        else {
          const inp = container.querySelector("#shTypeInput");
          if (inp) inp.focus();
          updateTypeClue();
        }
      });

      sky.appendChild(el);
      const cardW = Math.min(175, Math.max(88, el.offsetWidth || 110));
      const pad = 10;
      const maxX = Math.max(pad, skyW - cardW - pad);
      // Try picking a lane away from the most recent target
      let chosenX = pad + Math.random() * Math.max(1, maxX - pad);
      if (st.targets.length > 0) {
        const lastX = st.targets[st.targets.length - 1].x;
        for (let attempt = 0; attempt < 4; attempt++) {
          const candX = pad + Math.random() * Math.max(1, maxX - pad);
          if (Math.abs(candX - lastX) > Math.min(cardW * 0.85, (maxX - pad) * 0.45)) {
            chosenX = candX;
            break;
          }
        }
      }
      t.x = chosenX;
      el.style.transform = `translate3d(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px, 0)`;
      st.targets.push(t);

      if (dMode === "audio") speakWord(w);

      if (!st.lockedUid) {
        st.lockedUid = t.uid;
      }
      syncTargetClasses();
      if (cfg.shootMode === "write") syncWriterToLocked(false);
      else updateTypeClue();
    }

    function destroyTarget(t) {
      const idx = st.targets.indexOf(t);
      if (idx < 0) return;
      st.combo++;
      if (st.combo > st.maxCombo) st.maxCombo = st.combo;
      st.kills++;
      const pts = 100 + Math.min(st.combo, 10) * 15;
      st.score += pts;

      fireLaserVisual(t, true);
      playSfx("hit", cfg.muted);
      speakWord(t.w);
      showBanner(`💥 ${t.w.word} (${t.w.pinyin}) — ${shortMeaning(t.w.defVi)}`, false);

      if (typeof options.onWordResult === "function") {
        try { options.onWordResult(t.w, true); } catch (e) {}
      }

      if (t.el && t.el.parentNode) t.el.parentNode.removeChild(t.el);
      st.targets.splice(idx, 1);
      if (st.lockedUid === t.uid) st.lockedUid = null;

      updateHud();
      if (st.targets.length === 0) {
        spawnTarget();
      } else {
        getLockedTarget();
        syncTargetClasses();
        if (cfg.shootMode === "write") syncWriterToLocked(true);
        else updateTypeClue();
      }
    }

    function missTarget(t) {
      const idx = st.targets.indexOf(t);
      if (idx < 0) return;
      st.hearts = Math.max(0, st.hearts - 1);
      st.combo = 0;

      if (!st.missedIds.has(t.w.word)) {
        st.missedIds.add(t.w.word);
        st.missed.push(t.w);
      }
      if (typeof options.onWordResult === "function") {
        try { options.onWordResult(t.w, false); } catch (e) {}
      }

      playSfx("miss", cfg.muted);
      showBanner(`💔 Lọt từ: ${t.w.word} (${t.w.pinyin}) — ${shortMeaning(t.w.defVi)}`, true);
      const sky = container.querySelector("#shSky");
      if (sky) {
        sky.classList.remove("danger-flash");
        void sky.offsetWidth;
        sky.classList.add("danger-flash");
      }

      if (t.el && t.el.parentNode) t.el.parentNode.removeChild(t.el);
      st.targets.splice(idx, 1);
      if (st.lockedUid === t.uid) st.lockedUid = null;
      updateHud();

      if (st.hearts <= 0) {
        endGame();
        return;
      }

      if (st.targets.length === 0) {
        spawnTarget();
      } else {
        getLockedTarget();
        syncTargetClasses();
        if (cfg.shootMode === "write") syncWriterToLocked(true);
        else updateTypeClue();
      }
    }

    /* ---------- Hanzi Writer Shooting Dock ---------- */
    function setWriterMsg(text, cls) {
      const el = container.querySelector("#shWriterMsg");
      if (!el) return;
      el.className = "sh-writer-msg" + (cls ? " " + cls : "");
      el.textContent = text;
    }

    function syncWriterToLocked(forceRemount) {
      if (cfg.shootMode !== "write" || st.phase !== "playing") return;
      const target = getLockedTarget();
      const headEl = container.querySelector("#shWriterTargetLabel");
      const box = container.querySelector("#shHwBox");
      const fbRow = container.querySelector("#shWriteFallback");
      if (!box) return;

      if (!target) {
        if (headEl) headEl.textContent = "🎯 Đang chờ mục tiêu…";
        box.innerHTML = "";
        st.writer = null;
        return;
      }

      const ch = target.chars[target.charIdx] || target.chars[0];
      const clueTxt = target.dMode === "pinyin"
        ? target.w.pinyin
        : (target.dMode === "vi" ? shortMeaning(target.w.defVi) : (target.dMode === "hv" ? (target.w.hanViet || shortMeaning(target.w.defVi)) : (target.dMode === "hanzi" ? target.w.word : "🔊 Nghe từ")));
      if (headEl) {
        headEl.innerHTML = `🎯 <span>${esc(clueTxt)}</span> <span style="color:var(--primary);">(${target.charIdx + 1}/${target.chars.length})</span>`;
      }

      if (!forceRemount && st.writerTargetUid === target.uid && st.writerCharIdx === target.charIdx && st.writer) {
        return;
      }

      st.writerTargetUid = target.uid;
      st.writerCharIdx = target.charIdx;
      st.writerMountSeq++;
      const seq = st.writerMountSeq;
      st.writer = null;
      st.writerStrokeIdx = 0;
      st.writerUnavailable = false;
      if (fbRow) fbRow.style.display = "none";
      box.innerHTML = "";

      if (!global.HanziWriter) {
        st.writerUnavailable = true;
        if (fbRow) fbRow.style.display = "flex";
        setWriterMsg("⚠️ Chưa nạp được Hanzi Writer — dùng ô gõ nhanh bên dưới.", "bad");
        return;
      }

      st.fetchingChar = true;
      setWriterMsg("⏳ Đang nạp nét chữ…", "");
      const sz = Math.max(165, Math.round(box.clientWidth || 196));
      const isDark = document.documentElement.classList.contains("dark");
      const showOut = cfg.showOutline || target.dMode === "hanzi";

      fetchCharStrokeData(ch).then(function (strokeData) {
        st.fetchingChar = false;
        if (st.destroyed || st.phase !== "playing" || seq !== st.writerMountSeq) return;
        st.writerTotalStrokes = Array.isArray(strokeData.strokes) ? strokeData.strokes.length : 1;
        box.innerHTML = "";
        st.writer = global.HanziWriter.create(box, ch, {
          width: sz,
          height: sz,
          padding: 10,
          showCharacter: false,
          showOutline: showOut,
          strokeColor: isDark ? "#f8fafc" : "#1e293b",
          outlineColor: isDark ? "rgba(248,250,252,0.22)" : "rgba(15,23,42,0.18)",
          highlightColor: "#f59e0b",
          drawingColor: isDark ? "#38bdf8" : "#2563eb",
          drawingWidth: 16,
          showHintAfterMisses: 2,
          highlightOnComplete: true,
          leniency: 1.28,
          charDataLoader: function (c, onComplete) { onComplete(strokeData); },
          onLoadCharDataError: function () {}
        });

        setWriterMsg(`✍️ Viết chữ ${target.charIdx + 1}/${target.chars.length} (${st.writerTotalStrokes} nét) để bắn!`, "");
        st.writer.quiz({
          showHintAfterMisses: 2,
          highlightOnComplete: true,
          leniency: 1.28,
          onMistake: function (d) {
            if (seq !== st.writerMountSeq) return;
            st.writerStrokeIdx = d.strokeNum;
            setWriterMsg(`❌ Sai nét ${d.strokeNum + 1}/${st.writerTotalStrokes} — thử lại nhé!`, "bad");
          },
          onCorrectStroke: function (d) {
            if (seq !== st.writerMountSeq) return;
            st.writerStrokeIdx = d.strokeNum + 1;
            setWriterMsg(`✅ Nét ${d.strokeNum + 1}/${st.writerTotalStrokes} chuẩn!`, "ok");
          },
          onComplete: function () {
            if (seq !== st.writerMountSeq || st.phase !== "playing") return;
            const liveTarget = st.targets.find(function (x) { return x.uid === target.uid; });
            if (!liveTarget) return;
            liveTarget.charIdx++;
            if (liveTarget.charIdx < liveTarget.chars.length) {
              // Knock back slightly on multi-char progress!
              liveTarget.y = Math.max(4, liveTarget.y - 30);
              fireLaserVisual(liveTarget, false);
              playSfx("char", cfg.muted);
              syncTargetClasses();
              syncWriterToLocked(true);
            } else {
              destroyTarget(liveTarget);
            }
          }
        });
      }).catch(function () {
        st.fetchingChar = false;
        if (st.destroyed || seq !== st.writerMountSeq) return;
        st.writerUnavailable = true;
        if (fbRow) fbRow.style.display = "flex";
        setWriterMsg("⚠️ Ngoại tuyến/chữ không có dữ liệu nét — gõ Hán tự hoặc Pinyin để bắn!", "bad");
      });
    }

    /* ---------- Typing (Hanzi & Pinyin) Shooting Dock ---------- */
    function updateTypeClue() {
      const clueEl = container.querySelector("#shTypeClue");
      if (!clueEl) return;
      const t = getLockedTarget();
      if (!t) {
        clueEl.textContent = "🎯 Đang chờ từ rơi xuống…";
        return;
      }
      if (cfg.shootMode === "pinyin") {
        clueEl.innerHTML = `🎯 Mục tiêu khóa: <b>${esc(t.dMode === "hanzi" ? t.w.word : (t.dMode === "vi" ? shortMeaning(t.w.defVi) : (t.dMode === "hv" ? t.w.hanViet : (t.dMode === "audio" ? "🔊 Nghe âm thanh" : t.w.pinyin))))}</b> — Gõ Pinyin không dấu (VD: <code>xuexi</code>) hoặc kèm số thanh (<code>xue2xi2</code>) để bắn ngay!`;
      } else {
        clueEl.innerHTML = `🎯 Mục tiêu khóa: <b>${esc(t.dMode === "pinyin" ? t.w.pinyin : (t.dMode === "vi" ? shortMeaning(t.w.defVi) : (t.dMode === "hv" ? t.w.hanViet : (t.dMode === "audio" ? "🔊 Nghe âm thanh" : t.w.word))))}</b> — Gõ đúng Chữ Hán (VD: <code>学习</code>) để bắn ngay!`;
      }
    }

    function tryShootByText(rawInput, isExplicitSubmit) {
      if (st.phase !== "playing" || st.paused) return false;
      const trimmed = String(rawInput || "").trim();
      if (!trimmed) return false;

      // Sort active targets lowest first (most urgent)
      const sorted = st.targets.slice().sort(function (a, b) { return b.y - a.y; });

      if (cfg.shootMode === "hanzi") {
        const hit = sorted.find(function (t) { return t.w.word === trimmed; });
        if (hit) {
          destroyTarget(hit);
          return true;
        }
        const pref = sorted.find(function (t) { return t.w.word.startsWith(trimmed); });
        if (pref && pref.uid !== st.lockedUid) {
          st.lockedUid = pref.uid;
          syncTargetClasses();
          updateTypeClue();
        }
        if (isExplicitSubmit) {
          playSfx("miss", cfg.muted);
          showBanner("❌ Chưa khớp chữ Hán nào đang rơi!", true);
        }
        return false;
      }

      if (cfg.shootMode === "pinyin") {
        const norm = normalizeUserPinyin(trimmed);
        const hit = sorted.find(function (t) {
          return t.pySet.has(norm.exact) || t.pySet.has(norm.stripped);
        });
        if (hit) {
          destroyTarget(hit);
          return true;
        }
        const pref = sorted.find(function (t) {
          return t.pyKey && norm.stripped && t.pyKey.startsWith(norm.stripped.replace(/[1-5]/g, ""));
        });
        if (pref && pref.uid !== st.lockedUid) {
          st.lockedUid = pref.uid;
          syncTargetClasses();
          updateTypeClue();
        }
        if (isExplicitSubmit) {
          playSfx("miss", cfg.muted);
          showBanner("❌ Chưa khớp Pinyin của từ nào đang rơi!", true);
        }
        return false;
      }

      // Fallback input when write mode is offline
      const norm = normalizeUserPinyin(trimmed);
      const hitAny = sorted.find(function (t) {
        return t.w.word === trimmed || t.pySet.has(norm.exact) || t.pySet.has(norm.stripped);
      });
      if (hitAny) {
        destroyTarget(hitAny);
        return true;
      }
      return false;
    }

    /* ---------- Game Loop ---------- */
    function stepLoop(ts) {
      if (st.destroyed || st.phase !== "playing") return;
      if (!st.lastTs) st.lastTs = ts;
      const dt = Math.min(0.08, Math.max(0, (ts - st.lastTs) / 1000));
      st.lastTs = ts;

      if (!st.paused && !st.fetchingChar) {
        const spawnInterval = cfg.shootMode === "write"
          ? (cfg.speed === "fast" ? 3.8 : (cfg.speed === "medium" ? 4.8 : 6.0))
          : (cfg.speed === "fast" ? 2.1 : (cfg.speed === "medium" ? 3.0 : 4.0));
        st.spawnAcc += dt;
        if (st.spawnAcc >= spawnInterval) {
          st.spawnAcc = 0;
          spawnTarget();
        }

        const sky = container.querySelector("#shSky");
        const skyH = sky ? sky.clientHeight : 320;
        const limitY = skyH - 58;
        const toMiss = [];

        for (let i = 0; i < st.targets.length; i++) {
          const t = st.targets[i];
          t.y += t.speed * dt;
          if (t.el) {
            t.el.style.transform = `translate3d(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px, 0)`;
            if (t.y > skyH * 0.64) t.el.classList.add("urgent");
          }
          if (t.y >= limitY) toMiss.push(t);
        }

        for (let m = 0; m < toMiss.length; m++) {
          if (st.phase !== "playing") break;
          missTarget(toMiss[m]);
        }
      }

      if (st.phase === "playing" && !st.destroyed) {
        st.rafId = global.requestAnimationFrame(stepLoop);
      }
    }

    function startGame(replayWords) {
      st.customReplayPool = Array.isArray(replayWords) && replayWords.length ? replayWords : null;
      const rawPool = resolvePool();
      const usable = filterUsablePool(rawPool);
      if (!usable.length) {
        const allLv = typeof options.getLevelWords === "function" ? filterUsablePool(options.getLevelWords()) : [];
        if (!allLv.length) {
          showBanner("⚠️ Không đủ từ vựng phù hợp để bắt đầu!", true);
          return;
        }
        st.pool = allLv;
      } else {
        st.pool = usable;
      }

      savePrefs();
      if (st.rafId) global.cancelAnimationFrame(st.rafId);
      st.phase = "playing";
      st.paused = false;
      st.bag = [];
      st.targets = [];
      st.lockedUid = null;
      st.score = 0;
      st.combo = 0;
      st.maxCombo = 0;
      st.kills = 0;
      st.hearts = 5;
      st.missed = [];
      st.missedIds = new Set();
      st.lastTs = 0;
      st.spawnAcc = 0;
      st.fetchingChar = false;
      st.writer = null;
      st.writerTargetUid = null;
      st.isNewRecord = false;

      renderPlaying();
      spawnTarget();
      st.rafId = global.requestAnimationFrame(stepLoop);
    }

    function endGame() {
      if (st.rafId) {
        global.cancelAnimationFrame(st.rafId);
        st.rafId = 0;
      }
      st.phase = "over";
      st.writer = null;

      const best = readBest();
      st.isNewRecord = st.score > 0 && st.score > best.bestScore;
      const updated = {
        bestScore: Math.max(best.bestScore, st.score),
        bestCombo: Math.max(best.bestCombo, st.maxCombo),
        totalKills: best.totalKills + st.kills,
        gamesPlayed: best.gamesPlayed + 1,
        updatedAt: Date.now()
      };
      writeBest(updated);
      if (st.isNewRecord) playSfx("win", cfg.muted);
      renderGameOver(updated);
    }

    /* ---------- Views ---------- */
    function renderLobby() {
      const best = readBest();
      const packCnt = filterUsablePool(typeof options.getPackWords === "function" ? options.getPackWords() : []).length;
      const srsCnt = filterUsablePool(typeof options.getSrsReviewWords === "function" ? options.getSrsReviewWords() : []).length;
      const lvCnt = filterUsablePool(typeof options.getLevelWords === "function" ? options.getLevelWords() : []).length;
      const hasLesson = Boolean(options.lessonPool && options.lessonPool.words && options.lessonPool.words.length);
      if (cfg.source === "lesson" && !hasLesson) cfg.source = "pack";

      const displayOpts = [
        ["vi", "🇻🇳 Nghĩa Việt"],
        ["pinyin", "🗣️ Pinyin"],
        ["hv", "📜 Hán-Việt"],
        ["hanzi", "🀄 Chữ Hán"],
        ["audio", "🔊 Nghe âm thanh"],
        ["mix", "🎲 Tổng hợp"]
      ];
      const shootOpts = [
        ["write", "✍️ Viết nét Hán tự"],
        ["hanzi", "⌨️ Gõ Hán tự"],
        ["pinyin", "🔤 Gõ Pinyin"]
      ];
      const speedOpts = [
        ["slow", "🐢 Chậm (Dễ)"],
        ["medium", "⚡ Trung bình"],
        ["fast", "🚀 Nhanh"]
      ];

      let tipMsg = "";
      if (cfg.shootMode === "pinyin" && cfg.displayMode === "pinyin") {
        tipMsg = "💡 Mẹo: Bạn đang chọn rơi Pinyin & bắn bằng Gõ Pinyin — hãy thử chọn rơi Chữ Hán, Nghĩa Việt hoặc Nghe âm thanh để luyện nhớ Pinyin hiệu quả hơn nhé!";
      } else if (cfg.shootMode === "hanzi" && cfg.displayMode === "hanzi") {
        tipMsg = "💡 Mẹo: Chọn rơi Nghĩa Việt, Pinyin hoặc Nghe âm thanh sẽ giúp bạn luyện nhớ mặt chữ khi gõ Hán tự!";
      } else if (cfg.shootMode === "write") {
        tipMsg = "✍️ Mẹo: Chế độ Viết nét dùng Hanzi Writer chấm đúng từng nét theo thứ tự chuẩn — tốc độ rơi đã tự động dịu hơn để bạn kịp viết!";
      }

      container.innerHTML = `
        <div class="sh-wrap sh-lobby">
          <div class="sh-hero">
            <div>
              <h3>🚀 Game Bắn Từ Hán Tự</h3>
              <p>Các từ rơi từ trên xuống — viết đúng nét Hán tự, gõ Hán tự hoặc gõ Pinyin để khai hỏa bắn hạ trước khi chạm đáy!</p>
            </div>
            <div class="sh-best-pill">🏆 Kỷ lục: ${best.bestScore.toLocaleString("en-US")} • 🔥 Max x${best.bestCombo}</div>
          </div>

          <div class="sh-sec">
            <div class="sh-sec-lbl">1. Nguồn từ ôn tập</div>
            <div class="sh-chips">
              ${hasLesson ? `<button class="sh-chip ${cfg.source === "lesson" ? "active" : ""}" data-src="lesson">🏫 ${esc(options.lessonPool.title || "Từ mới bài giảng")} (${options.lessonPool.words.length})</button>` : ""}
              <button class="sh-chip ${cfg.source === "pack" ? "active" : ""}" data-src="pack">📦 ${esc(options.scopeTitle || "Gói hiện tại")} (${packCnt})</button>
              <button class="sh-chip ${cfg.source === "srs" ? "active" : ""}" data-src="srs">🔥 Từ đã học / SRS (${srsCnt})</button>
              <button class="sh-chip ${cfg.source === "level" ? "active" : ""}" data-src="level">📚 Toàn bộ cấp HSK (${lvCnt})</button>
            </div>
          </div>

          <div class="sh-sec">
            <div class="sh-sec-lbl">2. Kiểu hiển thị từ rơi xuống (6 chế độ)</div>
            <div class="sh-chips">
              ${displayOpts.map(function (o) {
                return `<button class="sh-chip ${cfg.displayMode === o[0] ? "active" : ""}" data-dmode="${o[0]}">${o[1]}</button>`;
              }).join("")}
            </div>
          </div>

          <div class="sh-sec">
            <div class="sh-sec-lbl">3. Cách bắn hạ mục tiêu (3 chế độ)</div>
            <div class="sh-chips">
              ${shootOpts.map(function (o) {
                return `<button class="sh-chip ${cfg.shootMode === o[0] ? "active" : ""}" data-smode="${o[0]}">${o[1]}</button>`;
              }).join("")}
            </div>
            ${cfg.shootMode === "write" ? `
              <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-size:12.5px;">
                <label style="cursor:pointer;font-weight:700;"><input type="checkbox" id="shOutlineChk" ${cfg.showOutline ? "checked" : ""}> 👁️ Hiện bóng chữ mờ trên ô viết (dễ hơn cho người mới)</label>
              </div>
            ` : ""}
            ${tipMsg ? `<div class="sh-tip-line">${tipMsg}</div>` : ""}
          </div>

          <div class="sh-sec">
            <div class="sh-sec-lbl">4. Tốc độ rơi &amp; Âm thanh</div>
            <div class="sh-chips" style="align-items:center;">
              ${speedOpts.map(function (o) {
                return `<button class="sh-chip ${cfg.speed === o[0] ? "active" : ""}" data-spd="${o[0]}">${o[1]}</button>`;
              }).join("")}
              <button class="sh-chip ${!cfg.muted ? "active" : ""}" id="shMuteToggle">${cfg.muted ? "🔇 Tắt âm" : "🔊 Bật âm"}</button>
            </div>
          </div>

          <button class="btn-primary-big" id="shStartBtn" style="margin-top:2px;">🚀 Bắt đầu bắn từ! (${filterUsablePool(resolvePool()).length} từ)</button>
        </div>
      `;

      container.querySelectorAll("[data-src]").forEach(function (b) {
        b.addEventListener("click", function () { cfg.source = b.getAttribute("data-src"); renderLobby(); });
      });
      container.querySelectorAll("[data-dmode]").forEach(function (b) {
        b.addEventListener("click", function () { cfg.displayMode = b.getAttribute("data-dmode"); savePrefs(); renderLobby(); });
      });
      container.querySelectorAll("[data-smode]").forEach(function (b) {
        b.addEventListener("click", function () {
          const next = b.getAttribute("data-smode");
          cfg.shootMode = next;
          // Auto-pick a natural non-spoiler display mode if user switches to Pinyin shooting while on Pinyin display
          if (next === "pinyin" && cfg.displayMode === "pinyin") cfg.displayMode = "hanzi";
          if (next === "hanzi" && cfg.displayMode === "hanzi") cfg.displayMode = "vi";
          savePrefs();
          renderLobby();
        });
      });
      container.querySelectorAll("[data-spd]").forEach(function (b) {
        b.addEventListener("click", function () { cfg.speed = b.getAttribute("data-spd"); savePrefs(); renderLobby(); });
      });
      const outChk = container.querySelector("#shOutlineChk");
      if (outChk) outChk.addEventListener("change", function () { cfg.showOutline = outChk.checked; savePrefs(); });
      const muteBtn = container.querySelector("#shMuteToggle");
      if (muteBtn) muteBtn.addEventListener("click", function () { cfg.muted = !cfg.muted; savePrefs(); renderLobby(); });
      const startBtn = container.querySelector("#shStartBtn");
      if (startBtn) startBtn.addEventListener("click", function () { startGame(null); });
    }

    function renderPlaying() {
      const isWrite = cfg.shootMode === "write";
      const shootLabel = isWrite ? "✍️ Viết nét" : (cfg.shootMode === "pinyin" ? "🔤 Gõ Pinyin" : "⌨️ Gõ Hán tự");
      const placeholder = cfg.shootMode === "pinyin"
        ? "Gõ Pinyin không dấu (VD: xuexi) hoặc có số thanh (xue2xi2)..."
        : "Gõ Chữ Hán tương ứng với từ đang rơi (VD: 学习)...";

      const writeDockHtml = `
        <div class="sh-writer-panel">
          <div class="sh-writer-head">
            <div id="shWriterTargetLabel" style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">🎯 Đang khóa…</div>
            <button class="pill-toggle" id="shSpeakLockBtn" title="Nghe mục tiêu">🔊</button>
          </div>
          <div class="sh-mi-mini">
            <svg class="sh-grid-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(220,38,38,0.25)" stroke-width="0.9" stroke-dasharray="3,2"/>
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(220,38,38,0.25)" stroke-width="0.9" stroke-dasharray="3,2"/>
              <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(220,38,38,0.18)" stroke-width="0.7" stroke-dasharray="2.5,2.5"/>
              <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(220,38,38,0.18)" stroke-width="0.7" stroke-dasharray="2.5,2.5"/>
            </svg>
            <div class="sh-hw-box" id="shHwBox"></div>
          </div>
          <div class="sh-writer-msg" id="shWriterMsg">✍️ Viết từng nét để bắn hạ!</div>
          <div class="ctrl-group" style="justify-content:center;">
            <button class="pill-toggle" id="shHintStrokeBtn">💡 Gợi ý nét</button>
            <button class="pill-toggle ${cfg.showOutline ? "on" : ""}" id="shToggleOutBtn">👁️ ${cfg.showOutline ? "Bóng: Hiện" : "Bóng: Ẩn"}</button>
            <button class="pill-toggle" id="shCycleTargetBtn">🎯 Đổi mục tiêu</button>
          </div>
          <div class="sh-type-row" id="shWriteFallback" style="display:none;width:100%;">
            <input class="sh-input" id="shFallbackInput" style="height:36px;font-size:14px;" placeholder="Gõ Hán tự hoặc Pinyin..." autocomplete="off">
            <button class="sh-fire-btn" id="shFallbackFire" style="height:36px;padding:0 10px;font-size:12.5px;">🔥</button>
          </div>
        </div>
      `;

      const typeDockHtml = `
        <div class="sh-dock">
          <div id="shTypeClue" style="font-size:12.5px;color:var(--muted);line-height:1.4;">🎯 Đang khóa mục tiêu…</div>
          <div class="sh-type-row">
            <input class="sh-input" id="shTypeInput" placeholder="${esc(placeholder)}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">
            <button class="sh-fire-btn" id="shFireBtn">🔥 Bắn</button>
          </div>
          <div class="ctrl-group" style="justify-content:space-between;">
            <div class="ctrl-group">
              <button class="pill-toggle" id="shSpeakLockBtn">🔊 Nghe mục tiêu</button>
              <button class="pill-toggle" id="shTypeHintBtn">💡 Gợi ý</button>
              <button class="pill-toggle" id="shCycleTargetBtn">🎯 Đổi mục tiêu</button>
            </div>
            <span style="font-size:11.5px;color:var(--muted);font-weight:700;">Chạm thẻ trên trời để khóa mục tiêu</span>
          </div>
        </div>
      `;

      container.innerHTML = `
        <div class="sh-wrap">
          <div class="sh-hud">
            <div class="sh-hud-left">
              <span class="sh-hearts" id="shHearts">❤️❤️❤️❤️❤️</span>
              <span class="sh-score-badge">🏆 <span id="shScore">0</span></span>
              <span class="sh-combo-badge" id="shCombo">🔥 x0</span>
              <span style="color:var(--muted);font-size:12px;">🎯 <span id="shKills">0</span> • ${shootLabel}</span>
            </div>
            <div class="sh-hud-right">
              <button class="pill-toggle" id="shPauseBtn">⏸️ Tạm dừng</button>
              <button class="pill-toggle" id="shStopBtn">⏹️ Dừng</button>
            </div>
          </div>

          <div class="sh-arena-grid ${isWrite ? "write-split" : ""}">
            <div class="sh-sky" id="shSky">
              <div class="sh-hit-banner" id="shHitBanner"></div>
              <svg class="sh-laser-svg" id="shLaserSvg"></svg>
              <div class="sh-danger-line"></div>
              <div class="sh-turret">🚀</div>
              <div class="sh-pause-overlay" id="shPauseOverlay" style="display:none;">
                <div style="font-size:20px;font-weight:900;">⏸️ Đang tạm dừng</div>
                <button class="btn-primary-big" id="shResumeBtn" style="width:auto;padding:10px 24px;margin:0;">▶️ Tiếp tục chơi</button>
              </div>
            </div>
            ${isWrite ? writeDockHtml : ""}
          </div>
          ${isWrite ? "" : typeDockHtml}
        </div>
      `;

      const pauseBtn = container.querySelector("#shPauseBtn");
      const pauseOverlay = container.querySelector("#shPauseOverlay");
      const resumeBtn = container.querySelector("#shResumeBtn");
      function setPaused(p) {
        st.paused = p;
        if (pauseOverlay) pauseOverlay.style.display = p ? "flex" : "none";
        if (pauseBtn) pauseBtn.textContent = p ? "▶️ Tiếp tục" : "⏸️ Tạm dừng";
        st.lastTs = 0;
      }
      if (pauseBtn) pauseBtn.addEventListener("click", function () { setPaused(!st.paused); });
      if (resumeBtn) resumeBtn.addEventListener("click", function () { setPaused(false); });
      const stopBtn = container.querySelector("#shStopBtn");
      if (stopBtn) stopBtn.addEventListener("click", endGame);

      const speakBtn = container.querySelector("#shSpeakLockBtn");
      if (speakBtn) speakBtn.addEventListener("click", function () {
        const t = getLockedTarget();
        if (t) speakWord(t.w);
      });

      const cycleBtn = container.querySelector("#shCycleTargetBtn");
      if (cycleBtn) cycleBtn.addEventListener("click", function () {
        if (st.targets.length < 2) return;
        const idx = st.targets.findIndex(function (t) { return t.uid === st.lockedUid; });
        const next = st.targets[(idx + 1) % st.targets.length];
        st.lockedUid = next.uid;
        syncTargetClasses();
        if (isWrite) syncWriterToLocked(true);
        else updateTypeClue();
      });

      if (isWrite) {
        const hintBtn = container.querySelector("#shHintStrokeBtn");
        if (hintBtn) hintBtn.addEventListener("click", function () {
          if (st.writer && st.writerStrokeIdx < st.writerTotalStrokes) {
            st.writer.highlightStroke(st.writerStrokeIdx);
            setWriterMsg(`💡 Gợi ý nét ${st.writerStrokeIdx + 1}/${st.writerTotalStrokes}!`, "");
          }
        });
        const outBtn = container.querySelector("#shToggleOutBtn");
        if (outBtn) outBtn.addEventListener("click", function () {
          cfg.showOutline = !cfg.showOutline;
          savePrefs();
          outBtn.classList.toggle("on", cfg.showOutline);
          outBtn.textContent = "👁️ " + (cfg.showOutline ? "Bóng: Hiện" : "Bóng: Ẩn");
          if (st.writer) {
            if (cfg.showOutline) st.writer.showOutline();
            else st.writer.hideOutline();
          }
        });
        function bindAutoShootInput(el, fireButton) {
          if (!el) return;
          let composing = false;
          function clearIfSame(matchedVal) {
            el.value = "";
            setTimeout(function () {
              if (el && el.value === matchedVal) el.value = "";
            }, 0);
          }
          function runMatch(isExplicit) {
            const v = el.value;
            if (!v) return;
            if (tryShootByText(v, isExplicit)) clearIfSame(v);
          }
          el.addEventListener("compositionstart", function () { composing = true; });
          el.addEventListener("compositionend", function () {
            composing = false;
            runMatch(false);
          });
          el.addEventListener("input", function (e) {
            if (cfg.shootMode === "hanzi" && (composing || (e && e.isComposing))) return;
            runMatch(false);
          });
          el.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
              e.preventDefault();
              runMatch(true);
            }
          });
          if (fireButton) {
            fireButton.addEventListener("click", function () {
              runMatch(true);
              el.focus();
            });
          }
        }
        const fbInp = container.querySelector("#shFallbackInput");
        const fbFire = container.querySelector("#shFallbackFire");
        bindAutoShootInput(fbInp, fbFire);
      } else {
        const inp = container.querySelector("#shTypeInput");
        const fireBtn = container.querySelector("#shFireBtn");
        const hintBtn = container.querySelector("#shTypeHintBtn");
        if (inp) {
          inp.focus();
          let composing = false;
          function clearHit(matchedVal) {
            inp.value = "";
            setTimeout(function () {
              if (inp && inp.value === matchedVal) inp.value = "";
            }, 0);
          }
          function runTypeShoot(isExplicit) {
            const v = inp.value;
            if (!v) return;
            if (tryShootByText(v, isExplicit)) clearHit(v);
          }
          inp.addEventListener("compositionstart", function () { composing = true; });
          inp.addEventListener("compositionend", function () {
            composing = false;
            runTypeShoot(false);
          });
          inp.addEventListener("input", function (e) {
            if (cfg.shootMode === "hanzi" && (composing || (e && e.isComposing))) return;
            runTypeShoot(false);
          });
          inp.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
              e.preventDefault();
              runTypeShoot(true);
            }
          });
          if (fireBtn) {
            fireBtn.addEventListener("click", function () {
              runTypeShoot(true);
              inp.focus();
            });
          }
        }
        if (hintBtn) {
          hintBtn.addEventListener("click", function () {
            const t = getLockedTarget();
            if (!t) return;
            if (cfg.shootMode === "pinyin") {
              showBanner(`💡 Gợi ý Pinyin: ${t.w.pinyin} (${t.w.word})`, false);
            } else {
              showBanner(`💡 Gợi ý Hán tự: ${t.w.word} (${t.w.pinyin})`, false);
            }
          });
        }
      }
    }

    function renderGameOver(bestStats) {
      const missedHtml = st.missed.length ? `
        <div class="sh-missed-list">
          <div style="font-size:12.5px;font-weight:800;color:var(--danger);margin-bottom:6px;">
            ❌ Các từ bị lọt (${st.missed.length} từ) — bấm nghe hoặc tập viết ngay:
          </div>
          ${st.missed.map(function (w, idx) {
            const wLink = typeof options.writingHref === "function"
              ? options.writingHref(w)
              : ("../writing/index.html?char=" + encodeURIComponent(w.word) + "&from=vocab");
            return `
              <div class="sh-missed-row">
                <div style="min-width:0;flex:1;">
                  <b style="font-size:18px;">${esc(w.word)}</b>
                  <span style="color:var(--primary);font-weight:700;margin-left:6px;">${esc(w.pinyin)}</span>
                  <div style="font-size:12.5px;color:var(--muted);">${esc(shortMeaning(w.defVi))}</div>
                </div>
                <div class="ctrl-group" style="flex-shrink:0;">
                  <button class="pill-toggle sh-m-spk" data-midx="${idx}">🔊</button>
                  <a class="pill-toggle" style="text-decoration:none;" href="${wLink}">✍️ Tập viết</a>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      ` : `<div style="margin-top:10px;font-size:13.5px;color:var(--ok);font-weight:700;">🌟 Tuyệt vời! Không để lọt từ nào!</div>`;

      container.innerHTML = `
        <div class="sh-wrap">
          <div class="sh-over">
            <div style="font-size:34px;">${st.isNewRecord ? "🏆" : "🚀"}</div>
            <h3 style="margin:6px 0 4px;font-size:20px;">${st.isNewRecord ? "🎉 KỶ LỤC MỚI!" : "Kết thúc lượt bắn từ"}</h3>
            <div style="font-size:13px;color:var(--muted);">Kỷ lục hiện tại: <b>${bestStats.bestScore.toLocaleString("en-US")}</b> điểm • Tổng đã hạ: <b>${bestStats.totalKills}</b> từ</div>

            <div class="sh-over-grid">
              <div class="sh-over-box"><div class="sh-over-val">${st.score.toLocaleString("en-US")}</div><div class="sh-over-lbl">Điểm lượt này</div></div>
              <div class="sh-over-box"><div class="sh-over-val" style="color:var(--ok);">${st.kills}</div><div class="sh-over-lbl">Từ bắn hạ</div></div>
              <div class="sh-over-box"><div class="sh-over-val" style="color:#d97706;">x${st.maxCombo}</div><div class="sh-over-lbl">Combo cao nhất</div></div>
              <div class="sh-over-box"><div class="sh-over-val" style="color:var(--danger);">${st.missed.length}</div><div class="sh-over-lbl">Từ bị lọt</div></div>
            </div>

            <div class="finish-actions" style="margin-top:12px;">
              <button class="btn-primary-big" id="shReplayBtn" style="width:auto;padding:11px 20px;margin:0;">🔁 Chơi lại ngay</button>
              ${st.missed.length ? `<button class="btn-primary-big blue" id="shReplayMissedBtn" style="width:auto;padding:11px 18px;margin:0;">🎯 Bắn lại ${st.missed.length} từ bị lọt</button>` : ""}
              <button class="pill-toggle" id="shBackLobbyBtn" style="padding:10px 14px;font-size:13px;">⚙️ Đổi chế độ</button>
            </div>
            ${missedHtml}
          </div>
        </div>
      `;

      const repBtn = container.querySelector("#shReplayBtn");
      if (repBtn) repBtn.addEventListener("click", function () { startGame(null); });
      const missBtn = container.querySelector("#shReplayMissedBtn");
      if (missBtn) missBtn.addEventListener("click", function () { startGame(st.missed.slice()); });
      const lobBtn = container.querySelector("#shBackLobbyBtn");
      if (lobBtn) lobBtn.addEventListener("click", function () { st.phase = "lobby"; st.customReplayPool = null; renderLobby(); });
      container.querySelectorAll(".sh-m-spk").forEach(function (b) {
        b.addEventListener("click", function () {
          const w = st.missed[Number(b.getAttribute("data-midx"))];
          if (w) speakWord(w);
        });
      });
    }

    renderLobby();

    activeInstance = {
      destroy: function () {
        st.destroyed = true;
        st.phase = "lobby";
        if (st.rafId) global.cancelAnimationFrame(st.rafId);
        clearTimeout(st.hitToastTimer);
        st.writer = null;
      }
    };
  }

  global.HskWordShooter = {
    mount: mount,
    unmount: unmount,
    getBestScore: readBest
  };
})(window);
