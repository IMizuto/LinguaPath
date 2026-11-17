/**
 * S4PracticeZone — Official IELTS on Computer (Inspera CBT) Simulator & Auto-Grading Engine
 * Supports Reading (184 Full Tests / 552 Passages / 7,360 Questions)
 * and Listening (133 Full Tests / 532 Recordings / 5,320 Questions)
 * Features:
 *  - True OS/Browser Fullscreen (requestFullscreen) + 100vw x 100vh Fixed CBT Shell
 *  - Top Exam Bar with Center Countdown Timer (10m/5m warnings), Audio & Volume Controls, Font Scaling (A-/A/A+)
 *  - Resizable 2-Column Split Screen (30% - 70% draggable splitter)
 *  - Text Selection Highlight (Yellow) & Notes Popover (Inspera-style)
 *  - Bottom Question Palette (Part 1..4, Q1..Q40, Review Flag, Prev/Next navigation)
 */
(function () {
  'use strict';

  const STORAGE_READ_ANS = 's4_pz_read_answers_v1';
  const STORAGE_LISTEN_ANS = 's4_pz_listen_answers_v1';
  const STORAGE_REVIEW_FLAGS = 's4_pz_review_flags_v1';

  let readAnswers = {};
  let listenAnswers = {};
  let reviewFlags = {};

  try { readAnswers = JSON.parse(localStorage.getItem(STORAGE_READ_ANS) || '{}'); } catch (e) {}
  try { listenAnswers = JSON.parse(localStorage.getItem(STORAGE_LISTEN_ANS) || '{}'); } catch (e) {}
  try { reviewFlags = JSON.parse(localStorage.getItem(STORAGE_REVIEW_FLAGS) || '{}'); } catch (e) {}

  function saveReadAnswers() {
    try { localStorage.setItem(STORAGE_READ_ANS, JSON.stringify(readAnswers)); } catch (e) {}
  }
  function saveListenAnswers() {
    try { localStorage.setItem(STORAGE_LISTEN_ANS, JSON.stringify(listenAnswers)); } catch (e) {}
  }
  function saveReviewFlags() {
    try { localStorage.setItem(STORAGE_REVIEW_FLAGS, JSON.stringify(reviewFlags)); } catch (e) {}
  }

  // =========================================================================
  // 1. UNIVERSAL IELTS ANSWER GRADER & BAND CALCULATOR
  // =========================================================================
  function normAnsStr(s) {
    let v = String(s || '')
      .replace(/[\u2018\u2019']/g, "'")
      .replace(/[\u201C\u201D"]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    v = v.replace(/^[.,;:\-]+|[.,;:\-]+$/g, '').trim();
    if (v === 't') return 'true';
    if (v === 'f') return 'false';
    if (v === 'ng' || v === 'notgiven') return 'not given';
    if (v === 'y') return 'yes';
    if (v === 'n') return 'no';
    return v;
  }

  function expandOptionalParens(str) {
    const idx = str.indexOf('(');
    if (idx === -1) return [str];
    const closeIdx = str.indexOf(')', idx);
    if (closeIdx === -1) return [str];
    const before = str.slice(0, idx);
    const inside = str.slice(idx + 1, closeIdx);
    const after = str.slice(closeIdx + 1);
    const withInside = expandOptionalParens(before + inside + after);
    const withoutInside = expandOptionalParens(before + after);
    return [...withInside, ...withoutInside];
  }

  function expandSlashVariants(str) {
    const s = str.trim();
    if (!s.includes('/')) return [s];
    const parts = s.split('/').map(p => p.trim()).filter(Boolean);
    const results = new Set(parts);
    const m = s.match(/^(.*?)\b([^\s/]+)\/([^\s/]+)\b(.*)$/);
    if (m) {
      results.add((m[1] + m[2] + m[4]).replace(/\s+/g, ' ').trim());
      results.add((m[1] + m[3] + m[4]).replace(/\s+/g, ' ').trim());
    }
    return [...results];
  }

  function getAcceptableAnswers(correctRaw) {
    const raw = String(correctRaw || '').replace(/^Đáp án đúng:\s*/i, '').trim();
    if (!raw) return [];
    const primaryChunks = raw.split(/\s*(?:\[OR\]|;|\|)\s*/i).filter(Boolean);
    const accepted = new Set();
    for (const chunk of primaryChunks) {
      const parenVariants = expandOptionalParens(chunk);
      for (const pv of parenVariants) {
        const slashVariants = expandSlashVariants(pv);
        for (const sv of slashVariants) {
          const n = normAnsStr(sv);
          if (n) accepted.add(n);
        }
      }
      const directNorm = normAnsStr(chunk);
      if (directNorm) accepted.add(directNorm);
    }
    return [...accepted];
  }

  function gradeIeltsAnswer(userRaw, correctRaw) {
    const u = normAnsStr(userRaw);
    if (!u) return { isAnswered: false, isCorrect: false };
    const accepted = getAcceptableAnswers(correctRaw);
    if (accepted.length === 0) return { isAnswered: true, isCorrect: false };
    return { isAnswered: true, isCorrect: accepted.includes(u) };
  }

  function calcIeltsBand(correctCount, totalCount) {
    if (!totalCount || totalCount <= 0) return '0.0';
    const scaled = Math.round((correctCount / totalCount) * 40);
    if (scaled >= 39) return '9.0';
    if (scaled >= 37) return '8.5';
    if (scaled >= 35) return '8.0';
    if (scaled >= 32) return '7.5';
    if (scaled >= 30) return '7.0';
    if (scaled >= 26) return '6.5';
    if (scaled >= 23) return '6.0';
    if (scaled >= 18) return '5.5';
    if (scaled >= 16) return '5.0';
    if (scaled >= 13) return '4.5';
    if (scaled >= 10) return '4.0';
    if (scaled >= 7) return '3.5';
    if (scaled >= 4) return '3.0';
    if (scaled >= 2) return '2.5';
    if (scaled >= 1) return '2.0';
    return '0.0';
  }

  // =========================================================================
  // 2. CBT FULLSCREEN, FONT SIZE, RESIZER & TIMER ENGINE
  // =========================================================================
  let timerInterval = null;
  let timerSeconds = 0;
  let timerLimitSeconds = 0;
  let timerRunning = false;
  let cbtFontClass = 'cbt-font-std'; // 'cbt-font-std' | 'cbt-font-lg' | 'cbt-font-xl'
  let cbtLeftPct = 50;
  let cbtMobileView = 'split'; // 'split' (50/50 top-bottom) | 'left' (100% prompt) | 'right' (100% answers)
  let currentFocusedQid = null;

  function formatTimer(sec) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m < 10 ? '0' + m : m}:${r < 10 ? '0' + r : r}`;
  }

  function startExamTimer(limitMinutes) {
    stopExamTimer();
    timerLimitSeconds = (limitMinutes && limitMinutes > 0) ? limitMinutes * 60 : 0;
    timerSeconds = timerLimitSeconds > 0 ? timerLimitSeconds : 0;
    timerRunning = true;
    timerInterval = setInterval(() => {
      if (!timerRunning) return;
      if (timerLimitSeconds > 0) {
        timerSeconds = Math.max(0, timerSeconds - 1);
        if (timerSeconds === 0) stopExamTimer();
      } else {
        timerSeconds++;
      }
      const el = document.getElementById('s4PzTimerText');
      if (el) el.textContent = formatTimer(timerSeconds);
      const box = document.getElementById('s4CbtTimerBox');
      if (box && timerLimitSeconds > 0) {
        box.classList.toggle('warn-5m', timerSeconds > 0 && timerSeconds <= 300);
        box.classList.toggle('warn-10m', timerSeconds > 300 && timerSeconds <= 600);
      }
    }, 1000);
  }

  function stopExamTimer() {
    timerRunning = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function enterCbtExamMode(requestBrowserFs) {
    document.body.classList.add('s4-cbt-mode');
    try {
      document.documentElement.lang = 'en';
    } catch (e) {}
    if (requestBrowserFs) {
      try {
        const docEl = document.documentElement;
        if (!document.fullscreenElement && docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        }
      } catch (e) {}
    }
    if (window.applyThemeState) window.applyThemeState();
  }

  function stopListeningPassAudio(reset = true) {
    if (typeof window.stopGlobalPassAudio === 'function') {
      window.stopGlobalPassAudio(reset);
      return;
    }
    const a = document.getElementById('globalPassAudio');
    if (!a) return;
    try { a.pause(); } catch (e) {}
    if (reset) {
      try { a.currentTime = 0; } catch (e) {}
    }
  }

  function exitCbtExamMode() {
    document.body.classList.remove('s4-cbt-mode');
    try {
      document.documentElement.lang = 'vi';
    } catch (e) {}
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) {}
    if (window.applyThemeState) window.applyThemeState();
  }

  window.s4CbtToggleFullscreen = function () {
    try {
      const docEl = document.documentElement;
      if (!document.fullscreenElement) {
        document.body.classList.add('s4-cbt-mode');
        if (docEl.requestFullscreen) docEl.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      }
    } catch (e) {}
    setTimeout(updateFullscreenBtnUI, 150);
  };

  function updateFullscreenBtnUI() {
    const btn = document.getElementById('s4CbtFsBtn');
    if (!btn) return;
    const isFs = !!document.fullscreenElement;
    btn.innerHTML = isFs ? '🗗<span class="s4-cbt-hide-mob"> Thoát Fullscreen (Esc)</span>' : '⛶<span class="s4-cbt-hide-mob"> Toàn màn hình (F11)</span>';
    btn.classList.toggle('active', isFs);
  }

  document.addEventListener('fullscreenchange', updateFullscreenBtnUI);

  window.s4CbtSetFont = function (cls) {
    cbtFontClass = cls || 'cbt-font-std';
    const splitEl = document.getElementById('s4CbtSplitArea');
    if (splitEl) {
      splitEl.classList.remove('cbt-font-std', 'cbt-font-lg', 'cbt-font-xl');
      splitEl.classList.add(cbtFontClass);
    }
    document.querySelectorAll('.s4-cbt-font-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-font') === cbtFontClass);
    });
  };

  window.s4CbtSetMobileView = function (mode) {
    cbtMobileView = mode || 'split';
    const splitEl = document.getElementById('s4CbtSplitArea');
    if (splitEl) {
      splitEl.classList.remove('mob-view-split', 'mob-view-left', 'mob-view-right');
      splitEl.classList.add('mob-view-' + cbtMobileView);
    }
    document.querySelectorAll('.s4-cbt-mob-tab[data-mview]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-mview') === cbtMobileView);
    });
  };

  function showCbtToast(msg) {
    if (window.S4UI && typeof window.S4UI.toast === 'function') {
      window.S4UI.toast({ type: 'info', message: msg, position: 'bottom', duration: 2800 });
      return;
    }
    let t = document.getElementById('s4CbtToastMsg');
    if (t) t.remove();
    t = document.createElement('div');
    t.id = 's4CbtToastMsg';
    t.style.cssText = 'position:fixed;bottom:76px;left:50%;transform:translateX(-50%);background:rgba(15,23,42,0.94);color:#f8fafc;padding:10px 16px;border-radius:12px;font-size:12.5px;font-weight:600;z-index:2147483647;box-shadow:0 10px 28px rgba(0,0,0,0.35);border:1px solid rgba(251,191,36,0.45);max-width:min(92vw,420px);text-align:center;line-height:1.45;pointer-events:none;transition:opacity 0.25s ease;';
    t.textContent = msg;
    const shell = document.getElementById('s4CbtRootShell') || document.body;
    shell.appendChild(t);
    setTimeout(() => {
      if (t) t.style.opacity = '0';
      setTimeout(() => { if (t && t.parentNode) t.remove(); }, 260);
    }, 2800);
  }

  window.s4CbtQuickHighlight = function () {
    if (!getActiveSplitRange()) {
      showCbtToast('🖍️ Hãy bôi đen một đoạn văn bản trước rồi bấm nút để Highlight!');
      return;
    }
    applySelectionHighlight(false);
    hideHighlightPopup();
  };
  window.s4CbtMobileQuickHighlight = window.s4CbtQuickHighlight;

  window.s4CbtQuickNote = function () {
    if (!getActiveSplitRange()) {
      showCbtToast('📝 Hãy bôi đen một đoạn văn bản trước rồi bấm nút để thêm Ghi chú!');
      return;
    }
    applySelectionHighlight(true);
    hideHighlightPopup();
  };

  window.s4CbtSetVolume = function (val) {
    const a = document.getElementById('globalPassAudio');
    if (a) a.volume = Math.max(0, Math.min(1, Number(val)));
  };

  let splitResizerGlobalsBound = false;
  let isDraggingResizer = false;
  let activeResizerEl = null;
  let activeSplitAreaEl = null;
  let activeLeftPaneEl = null;

  function initSplitResizer() {
    const resizer = document.getElementById('s4CbtResizer');
    const splitArea = document.getElementById('s4CbtSplitArea');
    const leftPane = document.getElementById('s4CbtLeftPane');
    if (!resizer || !splitArea || !leftPane) return;

    activeResizerEl = resizer;
    activeSplitAreaEl = splitArea;
    activeLeftPaneEl = leftPane;
    isDraggingResizer = false;
    leftPane.style.setProperty('--cbt-left-pct', cbtLeftPct + '%');

    const startDrag = () => {
      isDraggingResizer = true;
      if (activeResizerEl) activeResizerEl.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    };

    resizer.onmousedown = (e) => {
      e.preventDefault();
      startDrag();
    };
    resizer.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) startDrag();
    }, { passive: false });

    if (splitResizerGlobalsBound) return;
    splitResizerGlobalsBound = true;

    const doDrag = (clientX) => {
      if (!isDraggingResizer || !activeSplitAreaEl || !activeLeftPaneEl) return;
      const rect = activeSplitAreaEl.getBoundingClientRect();
      if (!rect.width) return;
      const relX = clientX - rect.left;
      const pct = Math.max(22, Math.min(78, Math.round((relX / rect.width) * 100)));
      cbtLeftPct = pct;
      activeLeftPaneEl.style.setProperty('--cbt-left-pct', pct + '%');
    };

    const endDrag = () => {
      if (!isDraggingResizer) return;
      isDraggingResizer = false;
      if (activeResizerEl) activeResizerEl.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', (e) => {
      if (isDraggingResizer) doDrag(e.clientX);
    });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchmove', (e) => {
      if (isDraggingResizer && e.touches && e.touches.length === 1) {
        doDrag(e.touches[0].clientX);
        e.preventDefault();
      }
    }, { passive: false });
    window.addEventListener('touchend', endDrag);
    window.addEventListener('touchcancel', endDrag);
  }

  // =========================================================================
  // 3. INSPERA HIGHLIGHT & NOTES TOOL ON TEXT SELECTION
  // =========================================================================
  let hlPopupEl = null;
  let lastValidSplitRange = null;
  let hlSelectionChangeBound = false;

  function isRangeInsideSplitArea(range) {
    const splitArea = document.getElementById('s4CbtSplitArea');
    return !!(
      range &&
      splitArea &&
      !range.collapsed &&
      range.startContainer &&
      range.startContainer.isConnected &&
      splitArea.contains(range.commonAncestorContainer) &&
      range.toString().trim()
    );
  }

  function getActiveSplitRange() {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount) {
      const live = sel.getRangeAt(0);
      if (isRangeInsideSplitArea(live)) {
        lastValidSplitRange = live.cloneRange();
        return live.cloneRange();
      }
    }
    if (lastValidSplitRange && isRangeInsideSplitArea(lastValidSplitRange)) {
      return lastValidSplitRange.cloneRange();
    }
    return null;
  }

  function ensureHighlightPopup() {
    if (hlPopupEl) return hlPopupEl;
    hlPopupEl = document.createElement('div');
    hlPopupEl.className = 's4-cbt-hl-popup';
    hlPopupEl.id = 's4CbtHlPopup';
    hlPopupEl.innerHTML = `
      <button type="button" id="s4BtnDoHl">🖍️ Highlight</button>
      <button type="button" id="s4BtnDoNote">📝 Ghi chú</button>
      <button type="button" id="s4BtnClearHl">🧹 Xóa</button>
    `;
    document.body.appendChild(hlPopupEl);

    hlPopupEl.onmousedown = (e) => e.preventDefault();

    document.getElementById('s4BtnDoHl').onclick = () => {
      applySelectionHighlight(false);
      hideHighlightPopup();
    };
    document.getElementById('s4BtnDoNote').onclick = () => {
      applySelectionHighlight(true);
      hideHighlightPopup();
    };
    document.getElementById('s4BtnClearHl').onclick = () => {
      clearSelectionHighlight();
      hideHighlightPopup();
    };
    return hlPopupEl;
  }

  function hideHighlightPopup() {
    if (hlPopupEl) hlPopupEl.style.display = 'none';
  }

  async function applySelectionHighlight(withNote) {
    const savedRange = getActiveSplitRange();
    if (!savedRange) return;
    let noteText = '';
    if (withNote) {
      const entered = (window.S4UI && typeof window.S4UI.prompt === 'function')
        ? await window.S4UI.prompt('Nhập nội dung ghi chú cho cụm từ này:', '', {
            title: 'Ghi chú đoạn văn',
            icon: '📝',
            placeholder: 'Nhập ghi chú...',
            confirmText: 'Lưu ghi chú',
            cancelText: 'Hủy'
          })
        : window.prompt('📝 Nhập nội dung ghi chú cho cụm từ này:', '');
      noteText = entered || '';
      if (!noteText.trim()) return;
    }
    const span = document.createElement('span');
    span.className = withNote ? 's4-cbt-user-note' : 's4-cbt-user-hl';
    if (withNote) {
      span.title = '📝 Ghi chú: ' + noteText;
      span.setAttribute('data-note', noteText);
      span.onclick = async (e) => {
        e.stopPropagation();
        const cur = span.getAttribute('data-note') || '';
        const updated = (window.S4UI && typeof window.S4UI.prompt === 'function')
          ? await window.S4UI.prompt('Xem / Sửa ghi chú (Xóa trắng để gỡ):', cur, {
              title: 'Ghi chú đoạn văn',
              icon: '📝',
              placeholder: 'Nhập ghi chú...',
              confirmText: 'Lưu ghi chú',
              cancelText: 'Đóng'
            })
          : window.prompt('📝 Xem / Sửa ghi chú (Xóa trắng để gỡ):', cur);
        if (updated === null) return;
        if (!updated.trim()) {
          unwrapElement(span);
        } else {
          span.setAttribute('data-note', updated);
          span.title = '📝 Ghi chú: ' + updated;
        }
      };
    } else {
      span.title = 'Bấm để xóa Highlight này';
      span.onclick = (e) => {
        e.stopPropagation();
        unwrapElement(span);
      };
    }
    try {
      savedRange.surroundContents(span);
      lastValidSplitRange = null;
      const curSel = window.getSelection();
      if (curSel) curSel.removeAllRanges();
    } catch (e) {
      // Cross-element selection fallback
      try {
        const frag = savedRange.extractContents();
        span.appendChild(frag);
        savedRange.insertNode(span);
        lastValidSplitRange = null;
        const curSel = window.getSelection();
        if (curSel) curSel.removeAllRanges();
      } catch (err) {}
    }
  }

  function unwrapElement(el) {
    if (!el || !el.parentNode) return;
    const parent = el.parentNode;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  }

  function clearSelectionHighlight() {
    const splitArea = document.getElementById('s4CbtSplitArea');
    if (!splitArea) return;
    splitArea.querySelectorAll('.s4-cbt-user-hl, .s4-cbt-user-note').forEach(unwrapElement);
    lastValidSplitRange = null;
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
  }

  function getSafePopupTopBound() {
    let safeTop = 8;
    ['.s4-cbt-header', '.s4-cbt-part-banner', '.s4-cbt-mobile-switcher'].forEach(selCss => {
      const hdr = document.querySelector(selCss);
      if (hdr && hdr.offsetHeight > 0) {
        const r = hdr.getBoundingClientRect();
        if (r.bottom > safeTop && r.top < window.innerHeight * 0.45) {
          safeTop = Math.max(safeTop, Math.ceil(r.bottom) + 6);
        }
      }
    });
    return safeTop;
  }

  function positionHighlightPopup(range) {
    if (!range || !hlPopupEl) return false;
    const rect = range.getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) return false;
    hlPopupEl.style.maxWidth = 'calc(100vw - 16px)';
    hlPopupEl.style.display = 'inline-flex';
    const pw = hlPopupEl.offsetWidth || 220;
    const ph = hlPopupEl.offsetHeight || 38;
    const safeTop = getSafePopupTopBound();
    let top = rect.top - ph - 8;
    if (top < safeTop) {
      top = rect.bottom + 8;
      if (top + ph > window.innerHeight - 8) {
        top = Math.max(safeTop, window.innerHeight - ph - 8);
      }
    }
    const left = Math.max(8, Math.min(window.innerWidth - pw - 8, rect.left + rect.width / 2 - pw / 2));
    hlPopupEl.style.top = Math.round(top) + 'px';
    hlPopupEl.style.left = Math.round(left) + 'px';
    return true;
  }

  function bindHighlightPopupEvents() {
    const splitArea = document.getElementById('s4CbtSplitArea');
    if (!splitArea) return;
    ensureHighlightPopup();

    if (!hlSelectionChangeBound) {
      hlSelectionChangeBound = true;
      let selTimer = null;
      document.addEventListener('selectionchange', () => {
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed && sel.rangeCount) {
          const r = sel.getRangeAt(0);
          if (isRangeInsideSplitArea(r)) {
            lastValidSplitRange = r.cloneRange();
            clearTimeout(selTimer);
            selTimer = setTimeout(() => {
              const cur = window.getSelection();
              if (cur && !cur.isCollapsed && cur.rangeCount && isRangeInsideSplitArea(cur.getRangeAt(0))) {
                positionHighlightPopup(cur.getRangeAt(0));
              }
            }, 80);
          }
        }
      });
    }

    const showHlIfSelected = (e) => {
      if (e && e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT')) {
        hideHighlightPopup();
        return;
      }
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.rangeCount || !isRangeInsideSplitArea(sel.getRangeAt(0))) {
          if (!e || !e.target || !e.target.closest('button, .s4-cbt-hl-popup, .s4-cbt-mob-hl-btn')) {
            lastValidSplitRange = null;
          }
          hideHighlightPopup();
          return;
        }
        const range = sel.getRangeAt(0);
        lastValidSplitRange = range.cloneRange();
        if (!positionHighlightPopup(range)) {
          hideHighlightPopup();
        }
      }, 35);
    };
    splitArea.onmouseup = showHlIfSelected;
    splitArea.ontouchend = showHlIfSelected;
  }

  // =========================================================================
  // 4. INTERACTIVE QUESTION DOM ENHANCER (FOR BOTH READING & LISTENING)
  // =========================================================================
  function enhanceQuestionsDom(rootEl, ansStore, onSave, isSubmitted) {
    if (!rootEl) return [];
    const qMetaList = [];

    rootEl.querySelectorAll('.question-group-wrapper').forEach(groupEl => {
      const ctxText = (groupEl.querySelector('.context-content')?.innerText || '').trim();
      const poolEls = [...groupEl.querySelectorAll('[data-pool-key]')];
      const poolKeys = poolEls.map(el => el.getAttribute('data-pool-key')).filter(Boolean);

      let letterChoices = [...new Set(poolKeys)];
      if (letterChoices.length === 0) {
        const rangeMatch = ctxText.match(/\b([A-Z])\s*[-–to]+\s*([A-Z])\b/);
        if (rangeMatch) {
          const startCode = rangeMatch[1].charCodeAt(0);
          const endCode = rangeMatch[2].charCodeAt(0);
          if (endCode > startCode && endCode - startCode <= 12) {
            for (let c = startCode; c <= endCode; c++) letterChoices.push(String.fromCharCode(c));
          }
        }
      }

      groupEl.querySelectorAll('.question-wrapper[data-qid]').forEach(qw => {
        const qid = qw.getAttribute('data-qid');
        const numEl = qw.querySelector('.question-number');
        const qNum = numEl ? numEl.innerText.trim() : '';
        const corrEl = qw.querySelector('.question-correct');
        const correctRaw = corrEl ? corrEl.innerText.replace(/^(?:✓\s*Đáp án chuẩn:\s*|Đáp án đúng:\s*)+/i, '').trim() : '';
        if (corrEl) {
          corrEl.innerHTML = `✓ Đáp án chuẩn: <strong>${correctRaw}</strong>`;
        }

        const userVal = ansStore[qid] || '';
        const ansContainer = qw.querySelector('.question-answers');

        if (ansContainer && !ansContainer.getAttribute('data-pz-enhanced')) {
          ansContainer.setAttribute('data-pz-enhanced', '1');

          const liItems = [...ansContainer.querySelectorAll('ul > li')];
          const existingRadios = [...ansContainer.querySelectorAll('input[type="radio"]')];
          const existingTextInp = ansContainer.querySelector('input[type="text"]');

          if (liItems.length > 0 && existingRadios.length === 0) {
            const mcqWrap = document.createElement('div');
            liItems.forEach((li, idx) => {
              const rawHtml = li.innerHTML.trim();
              const plain = li.innerText.trim();
              const m = plain.match(/^([A-Z])\b[.)\s]*/);
              const optVal = m ? m[1] : String.fromCharCode(65 + idx);
              const label = document.createElement('label');
              label.className = 's4-pz-mcq-opt';
              label.innerHTML = `<input type="radio" name="pz_q_${qid}" data-qid="${qid}" value="${optVal}" ${normAnsStr(userVal) === normAnsStr(optVal) ? 'checked' : ''}> <span>${rawHtml}</span>`;
              mcqWrap.appendChild(label);
            });
            ansContainer.innerHTML = '';
            ansContainer.appendChild(mcqWrap);
          } else if (existingRadios.length > 0) {
            existingRadios.forEach(rad => {
              rad.setAttribute('data-qid', qid);
              if (normAnsStr(userVal) === normAnsStr(rad.value)) {
                rad.checked = true;
              }
            });
          } else {
            const isTFNG = /^(TRUE|FALSE|NOT GIVEN)$/i.test(correctRaw);
            const isYNNG = /^(YES|NO|NOT GIVEN)$/i.test(correctRaw);
            const isRoman = /^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)$/i.test(correctRaw);
            const isSingleLetter = /^[A-J]$/i.test(correctRaw);

            let pills = [];
            if (isTFNG) pills = ['TRUE', 'FALSE', 'NOT GIVEN'];
            else if (isYNNG) pills = ['YES', 'NO', 'NOT GIVEN'];
            else if (isRoman) pills = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
            else if (isSingleLetter) {
              pills = letterChoices.length >= 2 ? letterChoices : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
              const corrUpper = correctRaw.toUpperCase();
              if (!pills.includes(corrUpper)) pills.push(corrUpper);
            }

            let inp = existingTextInp;
            if (!inp) {
              inp = document.createElement('input');
              inp.type = 'text';
              inp.className = 's4-pz-text-input';
              ansContainer.appendChild(inp);
            } else {
              inp.classList.add('s4-pz-text-input');
            }
            inp.setAttribute('data-qid', qid);
            inp.setAttribute('name', 'ielts_ans_' + qid);
            inp.setAttribute('lang', 'en');
            inp.setAttribute('xml:lang', 'en');
            inp.lang = 'en';
            inp.setAttribute('inputmode', 'text');
            inp.setAttribute('autocorrect', 'off');
            inp.setAttribute('autocapitalize', 'none');
            inp.setAttribute('spellcheck', 'false');
            inp.setAttribute('autocomplete', 'off');
            inp.setAttribute('enterkeyhint', 'next');
            inp.setAttribute('data-form-type', 'other');
            inp.setAttribute('data-lpignore', 'true');
            inp.setAttribute('data-1p-ignore', 'true');
            inp.placeholder = pills.length ? `Chọn hoặc gõ đáp án câu ${qNum}...` : `Nhập đáp án câu ${qNum}...`;
            inp.value = userVal;

            if (pills.length > 0) {
              const pillRow = document.createElement('div');
              pillRow.className = 's4-pz-pills-row';
              pills.forEach(pVal => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 's4-pz-choice-pill' + (normAnsStr(userVal) === normAnsStr(pVal) ? ' selected' : '');
                btn.textContent = pVal;
                btn.onclick = () => {
                  setFocusedQuestion(qid);
                  inp.value = pVal;
                  ansStore[qid] = pVal;
                  onSave();
                  pillRow.querySelectorAll('.s4-pz-choice-pill').forEach(b => b.classList.toggle('selected', b === btn));
                  updateNavButtonState(qid, true);
                };
                pillRow.appendChild(btn);
              });
              ansContainer.appendChild(pillRow);
            }
          }
        }

        qw.onclick = () => setFocusedQuestion(qid);

        qw.querySelectorAll('input[type="radio"][data-qid]').forEach(rad => {
          rad.onfocus = () => setFocusedQuestion(qid);
          rad.onchange = () => {
            setFocusedQuestion(qid);
            if (rad.checked) {
              ansStore[qid] = rad.value;
              onSave();
              updateNavButtonState(qid, true);
            }
          };
        });

        qw.querySelectorAll('input[type="text"][data-qid]').forEach(inp => {
          let isComposing = false;
          inp.addEventListener('compositionstart', () => {
            isComposing = true;
          });
          inp.addEventListener('compositionend', () => {
            isComposing = false;
            handleAnswerChange();
          });

          const handleAnswerChange = () => {
            const v = inp.value.trim();
            if (v) ansStore[qid] = v;
            else delete ansStore[qid];
            onSave();
            const pillRow = qw.querySelector('.s4-pz-pills-row');
            if (pillRow) {
              pillRow.querySelectorAll('.s4-pz-choice-pill').forEach(b => {
                b.classList.toggle('selected', normAnsStr(b.textContent) === normAnsStr(v));
              });
            }
            updateNavButtonState(qid, !!v);
          };

          inp.onfocus = () => {
            setFocusedQuestion(qid);
            setTimeout(() => {
              try { inp.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
            }, 120);
          };
          inp.oninput = (ev) => {
            if (ev && ev.isComposing) return;
            if (isComposing) return;
            handleAnswerChange();
          };
          inp.onblur = () => {
            handleAnswerChange();
          };
          inp.onkeydown = (ev) => {
            if (ev.key === 'Enter' || ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
              const allInps = [...rootEl.querySelectorAll('input[type="text"][data-qid]')];
              const idx = allInps.indexOf(inp);
              if (idx !== -1) {
                const nextIdx = ev.key === 'ArrowUp' ? idx - 1 : idx + 1;
                if (nextIdx >= 0 && nextIdx < allInps.length) {
                  ev.preventDefault();
                  allInps[nextIdx].focus();
                  try { allInps[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
                }
              }
            }
          };
        });

        const gradeRes = gradeIeltsAnswer(ansStore[qid] || '', correctRaw);
        qw.classList.remove('pz-correct', 'pz-wrong');
        let fbEl = qw.querySelector('.s4-pz-user-feedback');
        if (isSubmitted) {
          if (!fbEl) {
            fbEl = document.createElement('div');
            fbEl.className = 's4-pz-user-feedback';
            (qw.querySelector('.question-content') || qw).appendChild(fbEl);
          }
          if (gradeRes.isCorrect) {
            qw.classList.add('pz-correct');
            fbEl.style.color = '#34d399';
            fbEl.innerHTML = `✓ Chính xác! Bạn trả lời: <strong>${ansStore[qid]}</strong>`;
          } else if (gradeRes.isAnswered) {
            qw.classList.add('pz-wrong');
            fbEl.style.color = '#f87171';
            fbEl.innerHTML = `✗ Chưa đúng (Bạn chọn: <del>${ansStore[qid]}</del>)`;
          } else {
            qw.classList.add('pz-wrong');
            fbEl.style.color = '#f59e0b';
            fbEl.innerHTML = `○ Chưa trả lời câu này`;
          }
        } else if (fbEl) {
          fbEl.remove();
        }

        qMetaList.push({
          qid,
          qNum: qNum || String(qMetaList.length + 1),
          correctRaw,
          userVal: ansStore[qid] || '',
          isAnswered: gradeRes.isAnswered,
          isCorrect: gradeRes.isCorrect
        });
      });
    });

    if (!currentFocusedQid && qMetaList.length > 0) {
      setFocusedQuestion(qMetaList[0].qid);
    }

    return qMetaList;
  }

  function setFocusedQuestion(qid) {
    currentFocusedQid = String(qid);
    document.querySelectorAll('.s4-pz-qnav-btn').forEach(btn => {
      const isCur = btn.id === 's4PzNav_' + qid;
      btn.classList.toggle('current-q', isCur);
      if (isCur) {
        try { btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); } catch (e) {}
      }
    });
    const revChk = document.getElementById('s4CbtReviewChk');
    if (revChk) {
      revChk.checked = !!reviewFlags[currentFocusedQid];
    }
  }

  window.s4CbtToggleReviewCurrent = function () {
    if (!currentFocusedQid) return;
    if (reviewFlags[currentFocusedQid]) delete reviewFlags[currentFocusedQid];
    else reviewFlags[currentFocusedQid] = true;
    saveReviewFlags();
    const btn = document.getElementById('s4PzNav_' + currentFocusedQid);
    if (btn) btn.classList.toggle('flagged-review', !!reviewFlags[currentFocusedQid]);
    const revChk = document.getElementById('s4CbtReviewChk');
    if (revChk) revChk.checked = !!reviewFlags[currentFocusedQid];
  };

  window.s4CbtStepQuestion = function (delta) {
    const btns = [...document.querySelectorAll('.s4-pz-qnav-btn')];
    if (!btns.length) return;
    let curIdx = btns.findIndex(b => b.id === 's4PzNav_' + currentFocusedQid);
    if (curIdx === -1) curIdx = 0;
    const nextIdx = Math.max(0, Math.min(btns.length - 1, curIdx + delta));
    btns[nextIdx].click();
  };

  function updateNavButtonState(qid, isAnswered) {
    const btn = document.getElementById('s4PzNav_' + qid);
    if (btn && !btn.classList.contains('graded-correct') && !btn.classList.contains('graded-wrong')) {
      btn.classList.toggle('answered', !!isAnswered);
    }
    const total = document.querySelectorAll('.s4-pz-qnav-btn').length;
    const done = document.querySelectorAll('.s4-pz-qnav-btn.answered').length;
    const cntEl = document.getElementById('s4PzAnsweredCount');
    if (cntEl) cntEl.textContent = `${done}/${total}`;
    const mobCntEl = document.getElementById('s4CbtMobAnsCount');
    if (mobCntEl) mobCntEl.textContent = `${done}/${total}`;
  }

  window.s4PzScrollToQuestion = function (qid, partIdx) {
    if (window.innerWidth <= 820 && cbtMobileView === 'left') {
      window.s4CbtSetMobileView('split');
    }
    setFocusedQuestion(qid);
    if (typeof partIdx === 'number' && partIdx !== activePartIdx) {
      if (activeSkill === 'reading') {
        window.s4PzSelectReadingPart(partIdx, qid);
      } else {
        window.s4PzSelectListeningPart(partIdx, qid);
      }
      return;
    }
    const el = document.getElementById('question-wrapper-' + qid);
    if (el) {
      try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
      const inp = el.querySelector('input[type="text"]');
      if (inp) inp.focus();
    }
  };

  function buildBottomPaletteHtml(allQ, partNames, onSelectPartFnName, isSubmitted) {
    // Group questions by partIdx
    const byPart = new Map();
    partNames.forEach((name, idx) => byPart.set(idx, { name, questions: [] }));
    allQ.forEach(q => {
      const pIdx = q.partIdx || 0;
      if (!byPart.has(pIdx)) byPart.set(pIdx, { name: `Part ${pIdx + 1}`, questions: [] });
      byPart.get(pIdx).questions.push(q);
    });

    return `
      <div class="s4-cbt-bottom-bar">
        <div class="s4-cbt-part-groups">
          ${[...byPart.entries()].map(([pIdx, group]) => `
            <div class="s4-cbt-part-cluster ${pIdx === activePartIdx ? 'active' : ''}" onclick="if(event.target===this||event.target.classList.contains('s4-cbt-part-label')) ${onSelectPartFnName}(${pIdx})">
              <span class="s4-cbt-part-label">${group.name}:</span>
              ${group.questions.map(q => {
                let cls = '';
                if (isSubmitted) cls = q.isCorrect ? 'graded-correct' : 'graded-wrong';
                else if (q.isAnswered) cls = 'answered';
                if (reviewFlags[q.qid]) cls += ' flagged-review';
                if (String(currentFocusedQid) === String(q.qid)) cls += ' current-q';
                return `<button type="button" id="s4PzNav_${q.qid}" class="s4-pz-qnav-btn ${cls}" onclick="window.s4PzScrollToQuestion('${q.qid}', ${q.partIdx})">${q.qNum}</button>`;
              }).join('')}
            </div>
          `).join('')}
        </div>
        <div class="s4-cbt-bottom-actions">
          <label class="s4-cbt-ctrl-btn" style="cursor:pointer;" title="Đánh dấu câu hỏi này để kiểm tra lại trước khi nộp bài (giống thi máy IDP/BC)">
            <input type="checkbox" id="s4CbtReviewChk" onchange="window.s4CbtToggleReviewCurrent()" ${currentFocusedQid && reviewFlags[currentFocusedQid] ? 'checked' : ''} style="accent-color:#f59e0b;cursor:pointer;">
            <span>🚩 Review</span>
          </label>
          <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4CbtStepQuestion(-1)" title="Câu trước">←</button>
          <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4CbtStepQuestion(1)" title="Câu tiếp theo">→</button>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 5. READING PRACTICE ZONE ENGINE (552 PASSAGES / 184 FULL TESTS)
  // =========================================================================
  const STORAGE_READ_SUBS = 'lp_reading_submissions_v1';
  let activeSkill = 'reading';
  let activePartIdx = 0;
  let readSubmittedMap = {};
  let readFullTestMode = true; // Default to Full Test 3 Passages in CBT mode
  let readHubOpen = false;
  let readHubBook = 'ALL';
  let readHubSearch = '';

  // Reading Candidate Lobby & Exam State
  let readLobbyOpen = false;
  let activeReadLobbyLesson = null;
  let activeReadLobbyTest = null;
  let readLobbyMode = 'full'; // 'full' | 'p1' | 'p2' | 'p3'
  let readLobbyTimer = 60; // 60 | 40 | 20 | 0
  let readLobbyFont = 'cbt-font-std';
  let lastReadingSessionContext = null;

  function getReadingSubmissions() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_READ_SUBS) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveReadingSubmissionRecord(record) {
    const list = getReadingSubmissions();
    const idx = list.findIndex(r => r.id === record.id);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.unshift(record);
    }
    try {
      localStorage.setItem(STORAGE_READ_SUBS, JSON.stringify(list));
    } catch (e) {
      console.error('Không thể lưu reading submission vào localStorage', e);
    }
    updateTopReadingHistoryCount(); updateTopListeningHistoryCount();
  }

  async function deleteReadingSubmission(subId) {
    const ok = (window.S4UI && typeof window.S4UI.confirm === 'function')
      ? await window.S4UI.confirm('Bạn có chắc chắn muốn xóa bài thi Reading này khỏi lịch sử lưu trữ?', {
          title: 'Xóa bài thi Reading',
          tone: 'danger',
          confirmText: 'Xóa bài'
        })
      : confirm('Bạn có chắc chắn muốn xóa bài thi Reading này khỏi lịch sử lưu trữ?');
    if (!ok) return;
    let list = getReadingSubmissions();
    list = list.filter(r => r.id !== subId);
    try {
      localStorage.setItem(STORAGE_READ_SUBS, JSON.stringify(list));
    } catch (e) {}
    updateTopReadingHistoryCount(); updateTopListeningHistoryCount();
    if (typeof window.renderMain === 'function') window.renderMain();
    renderReadingModalHistory();
    if (window.S4UI && typeof window.S4UI.toast === 'function') {
      window.S4UI.toast('info', 'Đã xóa bài thi khỏi lịch sử.');
    }
  }

  function updateTopReadingHistoryCount() {
    const list = getReadingSubmissions();
    const el = document.getElementById('topReadingHistoryCount');
    if (el) el.textContent = String(list.length);
  }
  window.updateTopReadingHistoryCount = updateTopReadingHistoryCount;


  function buildReadingPzLessonObj(pzTest, partIdx) {
    if (!pzTest || !Array.isArray(pzTest.parts) || pzTest.parts.length === 0) return null;
    const safeIdx = Math.max(0, Math.min(pzTest.parts.length - 1, Number(partIdx) || 0));
    const p = pzTest.parts[safeIdx] || pzTest.parts[0] || {};
    const passageHtml = p.passageHtml || p.html || '';
    const questionHtml = p.questionHtml || p.html || '';
    return {
      id: `read_pz_${pzTest.id}_p${safeIdx + 1}`,
      title: `${pzTest.title} | ${p.name || `Passage ${safeIdx + 1}`}`,
      testId: pzTest.id,
      partIdx: safeIdx,
      unitId: 'u_2',
      passageHtml,
      questionHtml,
      isPzDirect: true,
      pzTestObj: pzTest,
      problem: {
        pType: 'reading_vocab',
        paragraphs: [],
        passageHtml,
        questionHtml
      }
    };
  }

  function resolveReadingPzLesson(lessonId) {
    const pzList = window.__STUDY4_READ_PZ || [];
    if (!pzList.length || lessonId == null) return null;
    const rawStr = String(lessonId);
    let foundTest = null;
    let targetPartIdx = 0;

    if (rawStr.startsWith('read_pz_')) {
      const m = rawStr.match(/^read_pz_([^_]+)(?:_p(\d+))?$/i);
      if (m) {
        foundTest = pzList.find(t => String(t.id) === String(m[1]));
        targetPartIdx = m[2] ? Math.max(0, parseInt(m[2], 10) - 1) : 0;
      }
    } else if (typeof lessonId === 'number' || (!isNaN(Number(lessonId)) && Number(lessonId) > 0)) {
      foundTest = pzList.find(t => Number(t.id) === Number(lessonId));
    }
    return buildReadingPzLessonObj(foundTest, targetPartIdx);
  }

  // Dùng HTML5 DOM parser chuẩn hóa HTML hai cột, tự động đóng thẻ mở thiếu (unbalanced <div>) và tách đúng cột trái/phải
  function normalizeReadingColHtml(rawHtml, colClass) {
    if (!rawHtml) return '';
    if (typeof document !== 'undefined') {
      const tmp = document.createElement('div');
      tmp.innerHTML = rawHtml;
      const colEl = colClass ? tmp.querySelector('.' + colClass) : null;
      return colEl ? colEl.innerHTML : tmp.innerHTML;
    }
    if (colClass) {
      const idx = rawHtml.indexOf(colClass);
      if (idx !== -1) {
        const gtIdx = rawHtml.indexOf('>', idx);
        if (gtIdx !== -1) return rawHtml.slice(gtIdx + 1);
      }
    }
    return rawHtml;
  }

  function getReadingPartSynData(les, fallbackPartIdx, synMap) {
    if (!les) return { leftHtml: '', rightHtml: '', pairs: [] };
    if (synMap && synMap[les.id]) return synMap[les.id];

    const isPz = les.isPzDirect || (les.id && String(les.id).startsWith('read_pz_'));
    if (isPz) {
      const pzList = window.__STUDY4_READ_PZ || [];
      const mId = String(les.id || '').match(/^read_pz_([^_]+)(?:_p(\d+))?$/i);
      const tId = les.testId != null ? les.testId : (mId ? mId[1] : null);
      const pIdx = typeof les.partIdx === 'number'
        ? les.partIdx
        : (mId && mId[2] ? Math.max(0, parseInt(mId[2], 10) - 1) : (fallbackPartIdx || 0));
      const fTest = les.pzTestObj || (tId != null ? pzList.find(t => String(t.id) === String(tId)) : null);
      const fPart = fTest && fTest.parts ? fTest.parts[pIdx] : null;
      const rawLeft = (fPart && fPart.passageHtml) ? fPart.passageHtml : (les.passageHtml || '');
      const rawRight = (fPart && (fPart.questionHtml || fPart.html)) ? (fPart.questionHtml || fPart.html) : (les.questionHtml || les.html || '');
      return {
        leftHtml: normalizeReadingColHtml(rawLeft, 'question-twocols-left'),
        rightHtml: normalizeReadingColHtml(rawRight, 'question-twocols-right'),
        pairs: []
      };
    }
    return { leftHtml: '', rightHtml: '', pairs: [] };
  }

  function getReadingTestSiblings(lesson, allLessons) {
    if (!lesson) return [lesson];

    // 1. Nhận diện nếu thuộc Kho đề Practice Zone (__STUDY4_READ_PZ)
    const pzList = window.__STUDY4_READ_PZ || [];
    const isPz = lesson.isPzDirect || (lesson.id && String(lesson.id).startsWith('read_pz_'));
    let pzTest = lesson.pzTestObj || null;

    if (!pzTest && lesson.testId) {
      pzTest = pzList.find(t => String(t.id) === String(lesson.testId));
    }
    if (!pzTest && lesson.id && String(lesson.id).startsWith('read_pz_')) {
      const m = String(lesson.id).match(/^read_pz_([^_]+)/i);
      if (m) pzTest = pzList.find(t => String(t.id) === String(m[1]));
    }
    if (!pzTest && isPz && activeReadLobbyTest) {
      pzTest = activeReadLobbyTest;
    }

    if (pzTest && Array.isArray(pzTest.parts) && pzTest.parts.length > 0) {
      return pzTest.parts.map((_, idx) => buildReadingPzLessonObj(pzTest, idx));
    }

    // 2. Nếu là bài học thông thường thuộc ALL_LESSONS
    const m = (lesson.title || '').match(/^(.*?)\s*[|-]\s*Passage\s*[123]\b/i);
    if (!m) return [lesson];
    const prefix = m[1].trim().toLowerCase();
    const siblings = (allLessons || []).filter(x => {
      if (x.unitId !== 'u_2') return false;
      const xm = (x.title || '').match(/^(.*?)\s*[|-]\s*Passage\s*[123]\b/i);
      return xm && xm[1].trim().toLowerCase() === prefix;
    });
    return siblings.length > 0 ? siblings : [lesson];
  }

  let readPzLoading = false;
  function ensureReadingPzLoaded(cb) {
    if (window.__STUDY4_READ_PZ) {
      cb && cb(window.__STUDY4_READ_PZ);
      return;
    }
    if (readPzLoading) {
      const iv = setInterval(() => {
        if (window.__STUDY4_READ_PZ) {
          clearInterval(iv);
          cb && cb(window.__STUDY4_READ_PZ);
        }
      }, 50);
      return;
    }
    readPzLoading = true;
    const s = document.createElement('script');
    s.src = 'data/reading_practice_zone.js?v=26';
    s.onload = () => {
      readPzLoading = false;
      cb && cb(window.__STUDY4_READ_PZ || []);
    };
    s.onerror = () => {
      readPzLoading = false;
      cb && cb([]);
    };
    document.head.appendChild(s);
  }

  function getReadingFullTestsCatalog(allLessons) {
    if (window.__STUDY4_READ_PZ && window.__STUDY4_READ_PZ.length > 0) {
      return window.__STUDY4_READ_PZ.map(t => ({
        id: t.id,
        title: t.title,
        book: getReadingBookCategory(t.title),
        passages: (t.parts || []).map((p, idx) => ({
          id: `read_pz_${t.id}_p${idx + 1}`,
          title: `${t.title} | ${p.name || `Passage ${idx + 1}`}`,
          testId: t.id,
          partIdx: idx,
          unitId: 'u_2',
          passageHtml: p.passageHtml,
          questionHtml: p.questionHtml,
          html: p.html
        })),
        parts: t.parts,
        answers: t.answers
      }));
    }
    const passages = (allLessons || []).filter(x => x.unitId === 'u_2');
    const testMap = new Map();
    passages.forEach(p => {
      const m = (p.title || '').match(/^(.*?)\s*[|-]\s*Passage\s*(\d+)/i);
      const testTitle = m ? m[1].trim() : p.title;
      const book = getReadingBookCategory(testTitle);
      if (!testMap.has(testTitle)) {
        testMap.set(testTitle, { title: testTitle, book, passages: [] });
      }
      testMap.get(testTitle).passages.push(p);
    });
    return [...testMap.values()];
  }

  function getReadingBookCategory(title) {
    const s = title || '';
    if (/Recent\s+IELTS\s+Reading\s+Actual/i.test(s) || /Actual\s*test/i.test(s)) return 'Recent Actual Tests (1–102)';
    if (/British\s+Council|Sample|BC\b/i.test(s)) return 'British Council & Samples (1–32)';
    if (/Simulation/i.test(s)) return 'Simulation Tests (1–10)';
    if (/Collection/i.test(s)) return 'IELTS Collection (1–4)';
    return 'Bộ đề khác';
  }

  function collectQuestionsFromSynHtml(rightHtml) {
    const list = [];
    if (!rightHtml) return list;
    const regex = /<div class="question-wrapper"[^>]*data-qid="(\d+)"[\s\S]*?<div class="question-number[^"]*"[^>]*>\s*<strong>(\d+)<\/strong>[\s\S]*?<div class="[^"]*question-correct[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    let m;
    while ((m = regex.exec(rightHtml)) !== null) {
      const qid = m[1];
      const qNum = m[2];
      const correctRaw = m[3].replace(/<[^>]+>/g, '').replace(/^(?:✓\s*Đáp án chuẩn:\s*|Đáp án đúng:\s*)+/i, '').trim();
      const g = gradeIeltsAnswer(readAnswers[qid] || '', correctRaw);
      list.push({ qid, qNum, correctRaw, userVal: readAnswers[qid] || '', ...g });
    }
    return list;
  }


  /**
   * Chuẩn hóa nhận diện bộ đề & số hiệu Test dùng chung cho cả Reading và Listening.
   * Quy tắc:
   * - Kiểm tra Asia Guide / Official Guide / BC Asia TRƯỚC British Council (BC) để tránh trùng BC Test.
   * - Practice Set 12 (Listening): u_4 đánh số Test 5..8 <-> u_6 / Reading đánh số Test 1..4 (offset -4).
   */
  function parseIeltsTestIdentity(rawStr, opts) {
    const skill = (opts && opts.skill) || '';
    const s = String(rawStr || '').split('|')[0].replace(/\s+/g, ' ').trim();
    if (!s) return null;

    let m = s.match(/(?:(?:bc|british\s*council)\s*asia(?:\s*guide)?|asia\s*guide|official\s*guide)\b.*?\btest\s*(\d+)(?!\d)/i);
    if (m) {
      const testNum = parseInt(m[1], 10);
      return { series: 'asia_guide', bookNum: null, testNum, key: `asia_guide:t${testNum}`, label: `Asia Guide Test ${testNum}` };
    }

    m = s.match(/(?:\bbc\b|british\s*council)\b.*?\btest\s*(\d+)(?!\d)/i);
    if (m) {
      const testNum = parseInt(m[1], 10);
      return { series: 'bc', bookNum: null, testNum, key: `bc:t${testNum}`, label: `BC Test ${testNum}` };
    }

    m = s.match(/\bcollection\s*(\d+)(?!\d).*?\btest\s*(\d+)(?!\d)/i);
    if (m) {
      const bookNum = parseInt(m[1], 10);
      const testNum = parseInt(m[2], 10);
      return { series: 'collection', bookNum, testNum, key: `collection:c${bookNum}:t${testNum}`, label: `IELTS Collection ${bookNum} Test ${testNum}` };
    }

    m = s.match(/\bsimulation(?:\s*tests?)?\b.*?\btest\s*(\d+)(?!\d)/i);
    if (m) {
      const testNum = parseInt(m[1], 10);
      return { series: 'simulation', bookNum: null, testNum, key: `simulation:t${testNum}`, label: `Simulation Test ${testNum}` };
    }

    m = s.match(/\bsample(?:\s*(?:reading|listening))?\b.*?\btest\s*(\d+)(?!\d)/i);
    if (m) {
      const testNum = parseInt(m[1], 10);
      return { series: 'sample', bookNum: null, testNum, key: `sample:t${testNum}`, label: `Sample Test ${testNum}` };
    }

    m = s.match(/\b(?:practice\s*set|cambridge)\s*(\d+)(?!\d).*?\btest\s*(\d+)(?!\d)/i);
    if (m) {
      const bookNum = parseInt(m[1], 10);
      let testNum = parseInt(m[2], 10);
      if (skill === 'listening' && bookNum === 12 && testNum >= 5 && testNum <= 8) {
        testNum -= 4;
      }
      return { series: 'practice_set', bookNum, testNum, key: `practice_set:p${bookNum}:t${testNum}`, label: `Practice Set ${bookNum} Test ${testNum}` };
    }

    m = s.match(/\bactual(?:\s*tests?)?\b.*?\btest\s*(\d+)(?!\d)/i) || s.match(/\b(?:reading|listening)\s+actual\s*(\d+)(?!\d)/i);
    if (m) {
      const testNum = parseInt(m[1], 10);
      return { series: 'actual', bookNum: null, testNum, key: `actual:t${testNum}`, label: `Actual Test ${testNum}` };
    }

    return null;
  }

  function getExplainLessonIdentity(lesson, skill) {
    if (!lesson) return null;
    return parseIeltsTestIdentity(lesson.group || '', { skill }) || parseIeltsTestIdentity(lesson.title || '', { skill });
  }

  function findReadingPzTestByKey(key) {
    const list = window.__STUDY4_READ_PZ || [];
    if (!key || !list.length) return null;
    return list.find(t => {
      const idObj = parseIeltsTestIdentity(t.title, { skill: 'reading' });
      return idObj && idObj.key === key;
    }) || null;
  }

  function findExplainLessonsForReading(targetLesson, allLessons) {
    if (!targetLesson || !allLessons) return [];
    const rawTitle = typeof targetLesson === 'string' ? targetLesson : (targetLesson.title || '');
    const ident = parseIeltsTestIdentity(rawTitle, { skill: 'reading' });
    if (ident) {
      return allLessons.filter(x => {
        if (x.unitId !== 'u_4' && !(x.id && x.id.startsWith('reading_u4_'))) return false;
        const exIdent = getExplainLessonIdentity(x, 'reading');
        return !!(exIdent && exIdent.key === ident.key);
      });
    }
    const prefix = rawTitle.replace(/\s*[|-]\s*Passage\s*\d+.*$/i, '').trim().toLowerCase();
    if (prefix) {
      return allLessons.filter(x => {
        if (x.unitId !== 'u_4' && !(x.id && x.id.startsWith('reading_u4_'))) return false;
        const g = (x.group || '').toLowerCase();
        const t = (x.title || '').toLowerCase();
        return g.includes(prefix) || t.includes(prefix);
      });
    }
    return [];
  }

  function findReadingSourcesForExplain(explainLesson, allLessons) {
    if (!explainLesson || (explainLesson.unitId !== 'u_4' && !String(explainLesson.id || '').startsWith('reading_u4_'))) {
      return { ident: null, u2Lessons: [], pzTest: null, hasPz: false };
    }
    const ident = getExplainLessonIdentity(explainLesson, 'reading');
    if (!ident) return { ident: null, u2Lessons: [], pzTest: null, hasPz: false };

    const u2Lessons = (allLessons || []).filter(x => {
      if (x.unitId !== 'u_2') return false;
      const u2Ident = parseIeltsTestIdentity(x.title, { skill: 'reading' });
      return !!(u2Ident && u2Ident.key === ident.key);
    });
    const pzLoaded = Array.isArray(window.__STUDY4_READ_PZ) && window.__STUDY4_READ_PZ.length > 0;
    const pzTest = pzLoaded ? findReadingPzTestByKey(ident.key) : null;
    const hasPz = pzLoaded
      ? !!pzTest
      : (ident.series === 'collection' || ident.series === 'simulation' || ident.series === 'bc' || ident.series === 'sample' || ident.series === 'actual');
    return { ident, u2Lessons, pzTest, hasPz };
  }

  function renderReadingPracticeView(currentLesson, allLessons) {
    activeSkill = 'reading';
    enterCbtExamMode(false);
    readLobbyOpen = false;
    readHubOpen = false;
    activeReadLobbyLesson = currentLesson;
    const isPzDirect = !!(currentLesson && (currentLesson.isPzDirect || String(currentLesson.id).startsWith('read_pz_')));
    activeReadLobbyTest = isPzDirect ? (currentLesson.pzTestObj || activeReadLobbyTest) : null;

    const synMap = window.__STUDY4_READ_SYNONYMS || {};
    const siblings = getReadingTestSiblings(currentLesson, allLessons);
    const isFull = readFullTestMode && siblings.length > 1;
    const activeLessons = isFull ? siblings : [currentLesson];
    if (activePartIdx >= activeLessons.length) activePartIdx = 0;
    const targetLesson = activeLessons[activePartIdx] || currentLesson;
    const synData = getReadingPartSynData(targetLesson, targetLesson.partIdx ?? activePartIdx, synMap);

    const sessionKey = isFull ? ('full_' + siblings[0].id) : ('single_' + currentLesson.id);
    const isSubmitted = !!readSubmittedMap[sessionKey];

    const partTitleMatch = String(targetLesson.title || '').match(/Passage\s*(\d+)/i);
    const displayPartNum = isFull
      ? (activePartIdx + 1)
      : (typeof targetLesson.partIdx === 'number'
        ? targetLesson.partIdx + 1
        : (partTitleMatch ? Number(partTitleMatch[1]) : (activePartIdx + 1)));

    const allQ = [];
    const partNames = [];
    activeLessons.forEach((les, pIdx) => {
      partNames.push(isFull ? `Part ${pIdx + 1}` : `Passage ${displayPartNum}`);
      const sd = getReadingPartSynData(les, les.partIdx ?? pIdx, synMap);
      const qs = collectQuestionsFromSynHtml(sd.rightHtml);
      qs.forEach(q => allQ.push({ ...q, partIdx: pIdx, lessonId: les.id }));
    });

    const curPartQs = allQ.filter(q => q.partIdx === activePartIdx);
    const firstQNum = curPartQs.length ? curPartQs[0].qNum : 1;
    const lastQNum = curPartQs.length ? curPartQs[curPartQs.length - 1].qNum : curPartQs.length;

    const answeredCount = allQ.filter(q => q.isAnswered).length;
    const correctCount = allQ.filter(q => q.isCorrect).length;
    const bandScore = calcIeltsBand(correctCount, allQ.length);

    if (!timerRunning && !isSubmitted && timerSeconds === 0) {
      startExamTimer(isFull ? 60 : 20);
    }

    const testPrefix = (siblings[0]?.title || '').replace(/\s*[|-]\s*Passage\s*\d+.*$/i, '').trim();
    lastReadingSessionContext = {
      lesson: currentLesson,
      allLessons,
      lessonId: currentLesson.id,
      testTitle: isFull ? testPrefix : currentLesson.title,
      testCode: isFull ? 'Full Test' : `Passage ${displayPartNum}`,
      isFull,
      correctCount,
      totalQuestions: allQ.length,
      bandScore,
      answeredCount,
      allQ
    };
    const explainLessons = findExplainLessonsForReading(targetLesson, allLessons);

    const isFs = !!document.fullscreenElement;

    return `
      <div class="s4-cbt-shell ${isSubmitted ? 's4-pz-submitted' : 's4-pz-unsubmitted'}" id="s4PzExamRoot">
        <!-- TOP EXAM HEADER BAR (INSPERA CBT STYLE - STREAMLINED) -->
        <header class="s4-cbt-header">
          <div class="s4-cbt-header-left">
            <span class="s4-cbt-brand-badge">IELTS READING</span>
            <span class="s4-cbt-test-title" title="${targetLesson.title}">${isFull ? testPrefix : targetLesson.title}</span>
            <span class="s4-cbt-mode-chip" style="background:rgba(56,189,248,0.14);color:var(--hl-cyan);border:1px solid rgba(56,189,248,0.3);padding:3px 8px;border-radius:6px;font-size:11.5px;font-weight:700;white-space:nowrap;">
              ${isFull ? `Full Test (${allQ.length} câu)` : `Passage ${displayPartNum} (${allQ.length} câu)`}
            </span>
          </div>

          <div class="s4-cbt-header-center">
            <div class="s4-cbt-timer-box" id="s4CbtTimerBox">
              <span>⏱️</span>
              <span id="s4PzTimerText">${formatTimer(timerSeconds)}</span>
              <select style="background:transparent;border:none;color:inherit;font-weight:800;font-size:12px;cursor:pointer;outline:none;" onchange="window.s4PzChangeTimer(Number(this.value))">
                <option value="${isFull ? 60 : 20}">${isFull ? '60 phút' : '20 phút'}</option>
                <option value="40">40 phút</option>
                <option value="0">Đếm xuôi</option>
              </select>
            </div>
            <span style="font-size:12.5px;font-weight:800;color:var(--muted);">Đã làm: <strong id="s4PzAnsweredCount" style="color:var(--hl-cyan);">${answeredCount}/${allQ.length}</strong></span>
          </div>

          <div class="s4-cbt-header-right">
            <div class="s4-cbt-font-group" style="display:inline-flex;gap:3px;background:var(--box-sub);padding:2px;border-radius:8px;border:1px solid var(--border);" title="Chỉnh cỡ chữ bài thi (Standard / Large / Extra Large)">
              <button type="button" class="s4-cbt-ctrl-btn s4-cbt-font-btn ${cbtFontClass === 'cbt-font-std' ? 'active' : ''}" data-font="cbt-font-std" style="border:none;padding:4px 8px;" onclick="window.s4CbtSetFont('cbt-font-std')">A</button>
              <button type="button" class="s4-cbt-ctrl-btn s4-cbt-font-btn ${cbtFontClass === 'cbt-font-lg' ? 'active' : ''}" data-font="cbt-font-lg" style="border:none;padding:4px 8px;font-size:13.5px;" onclick="window.s4CbtSetFont('cbt-font-lg')">A+</button>
              <button type="button" class="s4-cbt-ctrl-btn s4-cbt-font-btn ${cbtFontClass === 'cbt-font-xl' ? 'active' : ''}" data-font="cbt-font-xl" style="border:none;padding:4px 8px;font-size:15px;" onclick="window.s4CbtSetFont('cbt-font-xl')">A++</button>
            </div>
            <button type="button" class="s4-cbt-ctrl-btn s4-cbt-fs-btn ${isFs ? 'active' : ''}" id="s4CbtFsBtn" onclick="window.s4CbtToggleFullscreen()" title="Toàn màn hình">
              ${isFs ? '🗗<span class="s4-cbt-hide-mob"> Thoát FS</span>' : '⛶<span class="s4-cbt-hide-mob"> Toàn màn hình</span>'}
            </button>
            ${!isSubmitted ? `
              <button type="button" class="s4-cbt-submit-btn" onclick="window.s4PzSubmitReading('${sessionKey}')">✔ Nộp bài<span class="s4-cbt-hide-mob"> & Chấm điểm</span></button>
            ` : `
              <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4PzResetReading('${sessionKey}')">🔄 Làm lại</button>
            `}
            <button type="button" class="s4-cbt-ctrl-btn" onclick="window.S4PracticeZone.openReadingHistoryModal()" title="Xem lịch sử bài thi đã nộp">📜<span class="s4-cbt-hide-mob"> Lịch sử</span></button>
            <button type="button" class="s4-cbt-ctrl-btn" onclick="window.S4PracticeZone.openReadingHub()" title="Đổi đề khác trong Kho 184 Đề">📚<span class="s4-cbt-hide-mob"> Đổi đề</span></button>
            <button type="button" class="s4-cbt-ctrl-btn s4-cbt-exit-btn" onclick="window.s4PzExitExamToLobby()" title="Quay về Sảnh phòng thi">✕ <span class="s4-cbt-hide-mob">Về sảnh thi</span></button>
          </div>
        </header>

        <!-- PART INSTRUCTION BANNER OR RESULT BANNER -->
        ${isSubmitted ? `
          <div class="s4-pz-result-banner" style="margin:0;border-radius:0;border-left:none;border-right:none;padding:10px 20px;">
            <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
              <div class="s4-pz-band-circle" style="min-width:58px;height:52px;border-radius:10px;">
                <span class="s4-pz-band-num" style="font-size:20px;">${bandScore}</span>
                <span class="s4-pz-band-lbl" style="font-size:9px;">Band</span>
              </div>
              <div>
                <div style="font-size:15.5px;font-weight:800;color:var(--text);">
                  Kết quả: Đúng <span style="color:#34d399;">${correctCount} / ${allQ.length}</span> câu (${Math.round((correctCount / Math.max(1, allQ.length)) * 100)}%)
                </div>
                <div style="font-size:12.5px;color:var(--muted);">
                  ${!isPzDirect ? '💡 Đã mở khóa <strong>Đáp án chuẩn</strong> và <strong>Dẫn chứng Paraphrase Q1..Q40</strong> bên bài đọc! Bấm nhãn <strong>Q1, Q2...</strong> để đối chiếu.' : `💡 Đã mở khóa <strong>Đáp án chuẩn</strong> và phản hồi chi tiết cho <strong>${allQ.length} câu hỏi</strong>! Bấm nút câu <strong>Q1..Q${allQ.length}</strong> bên dưới để xem lại.`}
                </div>
              </div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4PzResetReading('${sessionKey}')">🔄 Làm lại bài thi</button>
              ${(!isPzDirect && synData.pairs && synData.pairs.length > 0) ? `
                <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4CbtExitReadingToMode('synonyms')">🔄 Xem Bảng Paraphrase</button>
              ` : ''}
              ${explainLessons.length > 0 ? `
                <button type="button" class="s4-cbt-submit-btn" style="background:linear-gradient(135deg, #ef4444 0%, #dc2626 100%);box-shadow:0 3px 10px rgba(239,68,68,0.35);font-weight:800;" onclick="window.s4CbtExitReadingToExplain('${explainLessons[0].id}')">🎬 Xem Video Giải Chi Tiết (${explainLessons.length} video)</button>
              ` : ''}
            </div>
          </div>
        ` : `
          <div class="s4-cbt-part-banner">
            <div>
              <strong>Part ${displayPartNum} (${targetLesson.title.split(/[|-]/).pop().trim()}):</strong>
              Read the text below and answer questions <strong>${firstQNum}–${lastQNum}</strong>.
            </div>
            <div class="s4-cbt-desktop-tip" style="font-size:12px;color:var(--muted);">
              🖍️ <em>Mẹo phòng thi: Quét chuột bôi đen từ khóa bất kỳ để <strong>Highlight vàng</strong> hoặc tạo <strong>Ghi chú (Note)</strong> • Kéo thanh ngăn <strong>⋮</strong> ở giữa để chỉnh độ rộng 2 khung.</em>
            </div>
          </div>
        `}

        <!-- MOBILE VIEW SWITCHER (ONLY VISIBLE ON SCREENS <= 820px) -->
        <div class="s4-cbt-mobile-switcher" id="s4CbtMobileSwitcher">
          <button type="button" class="s4-cbt-mob-tab ${cbtMobileView === 'split' ? 'active' : ''}" data-mview="split" onclick="window.s4CbtSetMobileView('split')">⬒ Chia đôi 50/50</button>
          <button type="button" class="s4-cbt-mob-tab ${cbtMobileView === 'left' ? 'active' : ''}" data-mview="left" onclick="window.s4CbtSetMobileView('left')">📖 Bài đọc</button>
          <button type="button" class="s4-cbt-mob-tab ${cbtMobileView === 'right' ? 'active' : ''}" data-mview="right" onclick="window.s4CbtSetMobileView('right')">✍️ Câu hỏi (<span id="s4CbtMobAnsCount">${answeredCount}/${allQ.length}</span>)</button>
          <button type="button" class="s4-cbt-mob-tab s4-cbt-mob-hl-btn" onmousedown="event.preventDefault()" onclick="window.s4CbtMobileQuickHighlight()" title="Tô vàng cụm từ đang bôi đen">🖍️</button>
        </div>

        <!-- RESIZABLE 2-COLUMN SPLIT SCREEN (LEFT: PASSAGE | RIGHT: QUESTIONS) -->
        <div class="s4-cbt-split-area ${cbtFontClass} mob-view-${cbtMobileView}" id="s4CbtSplitArea" lang="en">
          <div class="s4-cbt-pane-left" id="s4CbtLeftPane" style="--cbt-left-pct:${cbtLeftPct}%;">
            <div class="syn-col-title">
              <span>📖 READING PASSAGE ${displayPartNum}: ${targetLesson.title.split(/[|-]/).pop().trim()}</span>
              <span>${isSubmitted ? '🔍 Bấm Q1..Q40 để đối chiếu' : 'Bôi đen chữ để Highlight / Note'}</span>
            </div>
            <div id="synLeftCol">
              ${synData.leftHtml || '<div style="padding:20px;color:var(--muted);">Đang tải bài đọc...</div>'}
            </div>
          </div>

          <div class="s4-cbt-resizer" id="s4CbtResizer" title="Nắm kéo sang trái/phải để thay đổi độ rộng 2 khung">
            <div class="s4-cbt-resizer-grip"></div>
          </div>

          <div class="s4-cbt-pane-right s4-pz-container" id="s4CbtRightPane" lang="en">
            <div class="syn-col-title">
              <span>❓ QUESTIONS ${firstQNum}–${lastQNum}</span>
              <span>${isSubmitted ? 'Đã chấm điểm & hiện đáp án' : 'Chọn hoặc gõ đáp án (Enter qua câu kế)'}</span>
            </div>
            <div id="synRightCol">
              ${synData.rightHtml || '<div style="padding:20px;color:var(--muted);">Đang tải câu hỏi...</div>'}
            </div>
          </div>
        </div>

        <!-- BOTTOM QUESTION PALETTE BAR (PART 1..3 | Q1..Q40 | REVIEW FLAG) -->
        ${buildBottomPaletteHtml(allQ, partNames, 'window.s4PzSelectReadingPart', isSubmitted)}
      </div>
    `;
  }

  function mountReadingDomEvents(currentLesson, allLessons) {
    const rootEl = document.getElementById('s4PzExamRoot');
    if (!rootEl) return;
    const siblings = getReadingTestSiblings(currentLesson, allLessons);
    const isFull = readFullTestMode && siblings.length > 1;
    const sessionKey = isFull ? ('full_' + siblings[0].id) : ('single_' + currentLesson.id);
    const isSubmitted = !!readSubmittedMap[sessionKey];

    enhanceQuestionsDom(rootEl, readAnswers, () => {
      saveReadAnswers();
    }, isSubmitted);

    initSplitResizer();
    bindHighlightPopupEvents();

    if (isSubmitted && typeof window.bindSynColumnClicks === 'function') {
      window.bindSynColumnClicks();
    }
  }

  window.s4CbtExitReadingToLesson = function () {
    exitCbtExamMode();
    readLobbyOpen = false;
    readHubOpen = false;
    const isPzOnly = activeReadLobbyLesson && (activeReadLobbyLesson.isPzDirect || String(activeReadLobbyLesson.id || '').startsWith('read_pz_'));
    if (isPzOnly) {
      readHubOpen = true;
      if (typeof window.renderMain === 'function') window.renderMain();
      return;
    }
    const pzBtn = document.getElementById('topBtn_pz');
    if (pzBtn) pzBtn.classList.remove('active');
    if (typeof window.setMode === 'function') window.setMode('passage');
  };
  window.s4CbtExitReadingToMode = function (m) {
    exitCbtExamMode();
    readLobbyOpen = false;
    readHubOpen = false;
    const pzBtn = document.getElementById('topBtn_pz');
    if (pzBtn) pzBtn.classList.remove('active');
    if (typeof window.setMode === 'function') window.setMode(m);
  };
  window.s4CbtExitReadingToExplain = async function (lessonId) {
    const hasMarks = Boolean(document.querySelector('.s4-cbt-user-hl, .s4-cbt-user-note'));
    if (hasMarks) {
      const msg = 'Bạn đang có đoạn highlight hoặc ghi chú trong phiên Reading này. Khi chuyển sang Video Giải Chi Tiết, các highlight/ghi chú tạm thời sẽ được xóa (không ảnh hưởng kết quả đã nộp). Bạn có muốn tiếp tục?';
      const ok = (window.S4UI && typeof window.S4UI.confirm === 'function')
        ? await window.S4UI.confirm(msg, { title: 'Lưu ý highlight tạm thời', confirmText: 'Vẫn xem Video Giải', cancelText: 'Ở lại bài thi' })
        : window.confirm(msg);
      if (!ok) return;
    }
    exitCbtExamMode();
    readLobbyOpen = false;
    readHubOpen = false;
    const pzBtn = document.getElementById('topBtn_pz');
    if (pzBtn) pzBtn.classList.remove('active');
    if (typeof window.selectLesson === 'function') window.selectLesson(lessonId);
  };

  window.s4PzToggleReadingFullMode = function (fullFlag) {
    readFullTestMode = !!fullFlag;
    activePartIdx = 0;
    startExamTimer(readFullTestMode ? 60 : 20);
    if (typeof window.renderMain === 'function') window.renderMain();
  };

  window.s4PzSelectReadingPart = function (idx, scrollQid) {
    activePartIdx = idx;
    if (typeof window.renderMain === 'function') window.renderMain();
    if (scrollQid) {
      setTimeout(() => window.s4PzScrollToQuestion(scrollQid, idx), 60);
    }
  };

  window.s4PzChangeTimer = function (mins) {
    startExamTimer(mins);
  };

  window.s4PzSubmitReading = function (sessionKey) {
    readSubmittedMap[sessionKey] = true;
    stopExamTimer();

    // Lưu bản ghi lịch sử bài thi Reading
    if (lastReadingSessionContext) {
      const now = new Date();
      const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} • ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const ctx = lastReadingSessionContext;
      const spentMin = Math.max(1, Math.round((timerLimitSeconds - timerSeconds) / 60));
      const durationText = `${spentMin} phút`;

      const subRecord = {
        id: `r_sub_${Date.now()}`,
        skill: 'reading',
        sessionKey: sessionKey,
        lessonId: ctx.lessonId,
        testCode: ctx.testCode,
        testTitle: ctx.testTitle,
        date: dateStr,
        timestamp: Date.now(),
        duration: durationText,
        correctCount: ctx.correctCount,
        totalQuestions: ctx.totalQuestions,
        bandScore: String(ctx.bandScore),
        accuracy: Math.round((ctx.correctCount / Math.max(1, ctx.totalQuestions)) * 100),
        isFull: ctx.isFull,
        answeredCount: ctx.answeredCount
      };
      saveReadingSubmissionRecord(subRecord);
    }

    if (typeof window.renderMain === 'function') window.renderMain();
  };

  // Nút sao chép câu hỏi sai gửi AI chấm & giải thích
  window.s4PzCopyReadingAIPrompt = function (sessionKey) {
    if (!lastReadingSessionContext) {
      if (window.S4UI && typeof window.S4UI.toast === 'function') {
        window.S4UI.toast('warn', 'Chưa có thông tin bài thi!');
      } else {
        alert('Chưa có thông tin bài thi!');
      }
      return;
    }
    const ctx = lastReadingSessionContext;
    const wrongQs = (ctx.allQ || []).filter(q => !q.isCorrect);

    let wrongListText = '';
    if (wrongQs.length === 0) {
      wrongListText = 'Thí sinh đã trả lời đúng toàn bộ 40/40 câu hỏi!';
    } else {
      wrongListText = wrongQs.map(q =>
        `• Câu ${q.qNum}: Thí sinh điền "${q.userVal || '(bỏ trống)'}" ➔ Đáp án đúng: "${q.correctRaw}"`
      ).join('\n');
    }

    const aiPrompt = `Xin hãy đóng vai Giám khảo và Chuyên gia luyện thi IELTS Reading (IELTS Senior Reading Specialist). Dưới đây là kết quả làm bài thi thử của tôi:

==================================================
THÔNG TIN BÀI THI: ${ctx.testTitle}
KẾT QUẢ: Đúng ${ctx.correctCount} / ${ctx.totalQuestions} câu (Ước lượng Band ${ctx.bandScore})
==================================================

DANH SÁCH CÁC CÂU LÀM SAI CẦN GIẢI THÍCH CHI TIẾT:
${wrongListText}

YÊU CẦU PHÂN TÍCH & HƯỚNG DẪN CỦA CHUYÊN GIA:
1. Phân tích bẫy đề thi (Distractors/Paraphrase traps) ở các câu tôi đã làm sai phía trên.
2. Chỉ ra từ đồng nghĩa (Synonyms / Keywords) quyết định trong bài đọc giúp tìm ra đáp án đúng.
3. Cho tôi lời khuyên chiến thuật để không lặp lại lỗi sai tương tự ở các bài thi sau.`;

    navigator.clipboard.writeText(aiPrompt).then(() => {
      if (window.S4UI && typeof window.S4UI.toast === 'function') {
        window.S4UI.toast('success', '📋 Đã sao chép trọn vẹn Prompt giải thích câu sai vào bộ nhớ tạm!', { duration: 3200 });
      } else {
        alert('📋 Đã sao chép trọn vẹn Prompt chấm & giải thích câu sai vào bộ nhớ tạm! Bạn có thể dán (Ctrl + V) sang ChatGPT hoặc Claude để nhận giải thích chi tiết ngay!');
      }
    }).catch(() => {
      if (window.S4UI && typeof window.S4UI.prompt === 'function') {
        window.S4UI.prompt('Không thể tự sao chép tự động, hãy chọn và chép đoạn Prompt bên dưới:', aiPrompt, {
          title: 'Sao chép Prompt AI',
          multiline: true,
          readOnly: true,
          confirmText: 'Đóng'
        });
      }
    });
  };

  // Thoát phòng thi về Sảnh phòng thi Reading
  window.s4PzExitExamToLobby = function () {
    exitCbtExamMode();
    readLobbyOpen = true;
    readHubOpen = false;
    if (lastReadingSessionContext && lastReadingSessionContext.lesson) {
      activeReadLobbyLesson = lastReadingSessionContext.lesson;
    }
    if (typeof window.renderMain === 'function') window.renderMain();
  };

  window.s4PzResetReading = function (sessionKey) {
    delete readSubmittedMap[sessionKey];
    if (lastReadingSessionContext && Array.isArray(lastReadingSessionContext.allQ)) {
      lastReadingSessionContext.allQ.forEach(q => {
        if (q && q.qid) delete readAnswers[q.qid];
      });
      saveReadAnswers();
    }
    startExamTimer(readFullTestMode ? 60 : 20);
    if (typeof window.renderMain === 'function') window.renderMain();
  };

  // =========================================================================
  // GIAO DIỆN SẢNH PHÒNG THI READING (READING CANDIDATE LOBBY)
  // =========================================================================
  let readingHistoryFilter = 'all';

  function getReadingSubmissionMeta(sub) {
    const sessionKey = String(sub.sessionKey || '');
    const lessonId = sub.lessonId || sessionKey.replace(/^(full_|single_)/, '');
    const lesson = (window.ALL_LESSONS || []).find(item => item.id === lessonId);
    const isFull = typeof sub.isFull === 'boolean' ? sub.isFull : sessionKey.startsWith('full_');
    const title = sub.testTitle || (lesson && lesson.title ? lesson.title.replace(/\s*[|-]\s*Passage\s*\d+.*$/i, '').trim() : 'Bài Reading cũ');
    return {
      lessonId,
      isFull,
      title,
      testCode: sub.testCode || (isFull ? 'Full Test' : 'Reading')
    };
  }

  function renderReadingHistoryItemHtml(sub) {
    const meta = getReadingSubmissionMeta(sub);
    const correct = sub.correctCount == null ? NaN : Number(sub.correctCount);
    const total = sub.totalQuestions == null ? NaN : Number(sub.totalQuestions);
    const band = sub.bandScore == null ? NaN : Number(sub.bandScore);
    const accuracy = sub.accuracy == null ? NaN : Number(sub.accuracy);
    const hasCounts = Number.isFinite(correct) && Number.isFinite(total);
    const hasBand = Number.isFinite(band);
    const isPass = hasBand && band >= 6.5;
    const resultText = hasCounts ? `Đúng ${correct}/${total} câu (${Number.isFinite(accuracy) ? accuracy + '%' : '—'})` : 'Bản ghi cũ chưa có kết quả';
    return `
      <div class="w-history-item" id="r_sub_${sub.id}">
        <div class="w-history-left">
          <div class="w-history-title-row">
            <span class="w-history-code-tag" style="background:rgba(16, 185, 129, 0.15);color:#059669;">${meta.testCode}</span>
            <span class="w-history-title-text" title="${meta.title}">${meta.title}</span>
          </div>
          <div class="w-history-meta-row">
            <span>📅 ${sub.date || 'Vừa xong'}</span>
            <span>•</span>
            <span>⏱️ ${sub.duration || '60 phút'}</span>
            <span>•</span>
            <span>🎯 ${resultText}</span>
          </div>
        </div>

        <div class="w-history-right">
          <div class="w-history-score-badge graded">
            <div class="w-score-main" style="color:${isPass ? '#10b981' : '#f59e0b'};">${hasBand ? `🏆 Band ${band}` : '⏳ Thiếu điểm'}</div>
            <div class="w-score-sub">${resultText}</div>
          </div>
          <div class="w-history-actions">
            <button type="button" class="w-history-btn-view" onclick="window.s4PzViewReadingSubmission('${sub.id}')" title="Xem lại bài làm & đối chiếu đáp án chi tiết">
              👁️ Xem lại
            </button>
            <button type="button" class="w-history-btn-icon" onclick="window.s4PzRetakeReadingSubmission('${sub.id}')" title="Làm lại đề thi này">
              🔄
            </button>
            <button type="button" class="w-history-btn-icon del" onclick="window.s4PzDeleteReadingSubmission('${sub.id}')" title="Xóa bản ghi này">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
  }

  window.s4PzDeleteReadingSubmission = function (id) {
    deleteReadingSubmission(id);
  };

  window.s4PzViewReadingSubmission = function (subId) {
    const list = getReadingSubmissions();
    const sub = list.find(s => s.id === subId);
    if (!sub) return;

    window.S4PracticeZone.closeReadingHistoryModal();
    readLobbyOpen = false;
    readHubOpen = false;
    const meta = getReadingSubmissionMeta(sub);
    readFullTestMode = meta.isFull;
    activePartIdx = 0;
    readSubmittedMap[sub.sessionKey] = true; // Giữ trạng thái đã nộp để xem đáp án
    enterCbtExamMode(true);
    if (typeof window.selectLesson === 'function') {
      window.selectLesson(meta.lessonId, 'practice_test');
    }
  };

  window.s4PzRetakeReadingSubmission = function (subId) {
    const list = getReadingSubmissions();
    const sub = list.find(s => s.id === subId);
    if (!sub) return;

    window.S4PracticeZone.closeReadingHistoryModal();
    const meta = getReadingSubmissionMeta(sub);
    // Xóa đáp án của đề thi này để làm lại
    delete readSubmittedMap[sub.sessionKey];
    const openRetake = () => {
      readLobbyOpen = true;
      const resolvedPz = resolveReadingPzLesson(meta.lessonId);
      if (resolvedPz) {
        activeReadLobbyTest = resolvedPz.pzTestObj || null;
        activeReadLobbyLesson = resolvedPz;
      } else {
        activeReadLobbyTest = null;
        activeReadLobbyLesson = (window.ALL_LESSONS || []).find(item => item.id === meta.lessonId) || { id: meta.lessonId, title: meta.title };
      }
      readLobbyMode = meta.isFull ? 'full' : `p${(activeReadLobbyLesson.partIdx || 0) + 1}`;
      readLobbyTimer = meta.isFull ? 60 : 20;
      if (typeof window.renderMain === 'function') window.renderMain();
    };
    if (String(meta.lessonId || '').startsWith('read_pz_') && !window.__STUDY4_READ_PZ) {
      ensureReadingPzLoaded(openRetake);
    } else {
      openRetake();
    }
  };

  function renderReadingLobby(allLessons) {
    exitCbtExamMode();
    const target = activeReadLobbyLesson || (allLessons && allLessons.find(x => x.unitId === 'u_2')) || { title: 'IELTS Academic Reading Test', id: 'u2_l1' };
    const isPzTarget = !!(target && (target.isPzDirect || String(target.id || '').startsWith('read_pz_')));
    const siblings = getReadingTestSiblings(target, allLessons);
    const testPrefix = (siblings[0]?.title || target.title).replace(/\s*[|-]\s*Passage\s*\d+.*$/i, '').trim();
    const subs = getReadingSubmissions();

    const isFull = (readLobbyMode === 'full') && siblings.length > 1;
    const partIdxByMode = readLobbyMode === 'p2' ? 1 : (readLobbyMode === 'p3' ? 2 : 0);
    const displayLesson = (!isFull && siblings[partIdxByMode]) ? siblings[partIdxByMode] : target;
    const currentTitle = isFull ? `${testPrefix} (Full Test 40 câu)` : displayLesson.title;
    const explainLessons = findExplainLessonsForReading(target, allLessons);

    let historyListHtml = '';
    if (subs.length === 0) {
      historyListHtml = `
        <div class="w-history-empty">
          <span class="w-history-empty-icon">📭</span>
          <strong>Chưa có bài thi Reading nào được nộp</strong>
          <p style="margin:4px 0 0;font-size:12px;opacity:0.8;">Hãy chọn cấu hình phía trên và bấm "Bắt đầu làm bài thi" để rèn luyện ngay!</p>
        </div>
      `;
    } else {
      historyListHtml = subs.map(s => renderReadingHistoryItemHtml(s)).join('');
    }

    return `
      <div class="w-cbt-lobby" id="readingLobbyContainer">
        <div class="w-lobby-inner">
          <!-- TOP HEADER CỦA SẢNH -->
          <div class="w-lobby-header">
            <div class="w-lobby-header-badge">
              <span class="w-lobby-chip" style="background:rgba(16,185,129,0.12);color:#059669;border-color:rgba(16,185,129,0.25);">📖 IELTS READING PRACTICE ZONE</span>
              <span class="w-lobby-chip cbt">INSPERA CBT SIMULATOR</span>
            </div>
            <h1 class="w-lobby-title" id="rLobbyTestTitle">${currentTitle}</h1>
            <p class="w-lobby-subtitle">
              Phòng thi thử Reading mô phỏng 100% môi trường thi máy tính chính thức (Computer-Based Test). Vui lòng đọc kỹ hướng dẫn và tùy chỉnh cấu hình bài thi trước khi bắt đầu.
            </p>
          </div>

          <!-- LOBBY CONTENT GRID 2 CỘT -->
          <div class="w-lobby-grid">
            <!-- CỘT TRÁI: HƯỚNG DẪN & QUY CHẾ THI READING -->
            <div class="w-lobby-card w-lobby-guide-col">
              <div class="w-lobby-card-head">
                <span class="w-lobby-icon">📋</span>
                <div>
                  <h3>Cấu trúc bài thi & Hướng dẫn làm bài</h3>
                  <p>Official IELTS Academic Reading Format (3 Passages • 40 Questions)</p>
                </div>
              </div>

              <!-- Cấu trúc 3 Passages -->
              <div class="w-lobby-task-summary">
                <div class="w-lobby-task-row">
                  <div class="w-lobby-task-tag t1" style="background:#059669;">PASSAGE 1</div>
                  <div class="w-lobby-task-info">
                    <strong>${siblings[0] ? siblings[0].title.split(/[|-]/).pop().trim() : 'Passage 1'}</strong>
                    <div class="w-lobby-task-meta">
                      <span>⏱️ 20 phút</span> • <span>❓ Q1–Q13 (13 câu)</span> • <span>📊 Mức độ: Khởi động / Cơ bản</span>
                    </div>
                  </div>
                </div>

                <div class="w-lobby-task-row">
                  <div class="w-lobby-task-tag t1" style="background:#0d9488;">PASSAGE 2</div>
                  <div class="w-lobby-task-info">
                    <strong>${siblings[1] ? siblings[1].title.split(/[|-]/).pop().trim() : 'Passage 2'}</strong>
                    <div class="w-lobby-task-meta">
                      <span>⏱️ 20 phút</span> • <span>❓ Q14–Q26 (13 câu)</span> • <span>📊 Mức độ: Học thuật nâng cao</span>
                    </div>
                  </div>
                </div>

                <div class="w-lobby-task-row">
                  <div class="w-lobby-task-tag t1" style="background:#2563eb;">PASSAGE 3</div>
                  <div class="w-lobby-task-info">
                    <strong>${siblings[2] ? siblings[2].title.split(/[|-]/).pop().trim() : 'Passage 3'}</strong>
                    <div class="w-lobby-task-meta">
                      <span>⏱️ 20 phút</span> • <span>❓ Q27–Q40 (14 câu)</span> • <span>📊 Mức độ: Phân tích & Tranh luận</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quy chế phòng thi CBT -->
              <div class="w-lobby-rules">
                <div class="w-lobby-rule-item">
                  <span class="w-rule-icon">🖍️</span>
                  <div>
                    <strong>Tô vàng từ khóa (Highlight) & Ghi chú (Notes):</strong>
                    <p>Quét chuột bôi đen cụm từ bất kỳ trong bài đọc để hiện popover tô vàng hoặc tạo ghi chú giống 100% phần mềm thi máy.</p>
                  </div>
                </div>

                <div class="w-lobby-rule-item">
                  <span class="w-rule-icon">⬒</span>
                  <div>
                    <strong>Chia đôi màn hình kéo thả tự do (Split Screen):</strong>
                    <p>Nắm kéo thanh ngăn <strong>⋮</strong> ở giữa để điều chỉnh độ rộng giữa bài đọc và bảng câu hỏi theo ý muốn.</p>
                  </div>
                </div>

                <div class="w-lobby-rule-item">
                  <span class="w-rule-icon">📋</span>
                  <div>
                    <strong>Bảng điều hướng câu hỏi Q1..Q40 & Cắm cờ Review:</strong>
                    <p>Dải câu hỏi nằm cố định ở đáy màn hình. Nhấp số câu để nhảy đến ngay câu đó, nhấp Review để cắm cờ xem lại trước khi nộp.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- CỘT PHẢI: CẤU HÌNH PHÒNG THI (CANDIDATE SETTINGS) -->
            <div class="w-lobby-card w-lobby-config-col">
              <div class="w-lobby-card-head">
                <span class="w-lobby-icon">⚙️</span>
                <div>
                  <h3>Cấu hình phòng thi của bạn</h3>
                  <p>Tùy chỉnh chế độ, thời gian & cỡ chữ trước khi vào thi</p>
                </div>
              </div>

              <!-- 1. Chọn chế độ thi (Full Test hoặc 1 Passage) -->
              <div class="w-lobby-config-group">
                <label class="w-config-label">1. Chế độ làm bài:</label>
                <div class="w-config-options">
                  <label class="w-config-radio">
                    <input type="radio" name="rLobbyMode" value="full" ${readLobbyMode === 'full' ? 'checked' : ''} onchange="window.s4PzSetReadingLobbyMode('full')">
                    <div class="w-radio-box">
                      <span class="w-radio-title">Full Test</span>
                      <span class="w-radio-desc">3 Passages (40 câu)</span>
                    </div>
                  </label>
                  <label class="w-config-radio">
                    <input type="radio" name="rLobbyMode" value="p1" ${readLobbyMode === 'p1' ? 'checked' : ''} onchange="window.s4PzSetReadingLobbyMode('p1')">
                    <div class="w-radio-box">
                      <span class="w-radio-title">Passage 1</span>
                      <span class="w-radio-desc">Q1–Q13 (13 câu)</span>
                    </div>
                  </label>
                  <label class="w-config-radio">
                    <input type="radio" name="rLobbyMode" value="p2" ${readLobbyMode === 'p2' ? 'checked' : ''} onchange="window.s4PzSetReadingLobbyMode('p2')">
                    <div class="w-radio-box">
                      <span class="w-radio-title">Passage 2</span>
                      <span class="w-radio-desc">Q14–Q26 (13 câu)</span>
                    </div>
                  </label>
                  <label class="w-config-radio">
                    <input type="radio" name="rLobbyMode" value="p3" ${readLobbyMode === 'p3' ? 'checked' : ''} onchange="window.s4PzSetReadingLobbyMode('p3')">
                    <div class="w-radio-box">
                      <span class="w-radio-title">Passage 3</span>
                      <span class="w-radio-desc">Q27–Q40 (14 câu)</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- 2. Chọn thời gian đếm ngược -->
              <div class="w-lobby-config-group">
                <label class="w-config-label">2. Thời gian đếm ngược (Timer):</label>
                <div class="w-time-presets" id="rLobbyTimerPresets">
                  <button type="button" class="w-time-btn ${readLobbyTimer === 60 ? 'active' : ''}" onclick="window.s4PzSetReadingLobbyTimer(60)">60 phút (Full)</button>
                  <button type="button" class="w-time-btn ${readLobbyTimer === 40 ? 'active' : ''}" onclick="window.s4PzSetReadingLobbyTimer(40)">40 phút</button>
                  <button type="button" class="w-time-btn ${readLobbyTimer === 20 ? 'active' : ''}" onclick="window.s4PzSetReadingLobbyTimer(20)">20 phút (1P)</button>
                  <button type="button" class="w-time-btn ${readLobbyTimer === 0 ? 'active' : ''}" onclick="window.s4PzSetReadingLobbyTimer(0)">Đếm xuôi</button>
                </div>
              </div>

              <!-- 3. Cỡ chữ bài thi -->
              <div class="w-lobby-config-group">
                <label class="w-config-label">3. Cỡ chữ bài thi (Font Scaling):</label>
                <div class="w-font-presets">
                  <button type="button" class="w-font-btn ${readLobbyFont === 'cbt-font-std' ? 'active' : ''}" onclick="window.s4PzSetReadingLobbyFont('cbt-font-std')">A Tiêu chuẩn</button>
                  <button type="button" class="w-font-btn ${readLobbyFont === 'cbt-font-lg' ? 'active' : ''}" onclick="window.s4PzSetReadingLobbyFont('cbt-font-lg')">A+ Lớn</button>
                  <button type="button" class="w-font-btn ${readLobbyFont === 'cbt-font-xl' ? 'active' : ''}" onclick="window.s4PzSetReadingLobbyFont('cbt-font-xl')">A++ Rất lớn</button>
                </div>
              </div>

              <!-- 4. Nút Đổi đề thi khác sang Kho Luyện Đề -->
              <div class="w-lobby-config-group" style="background:rgba(5, 150, 105, 0.07);padding:12px 14px;border-radius:10px;border:1px dashed rgba(5, 150, 105, 0.35);">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
                  <div>
                    <span style="font-size:13px;font-weight:800;color:var(--text);display:flex;align-items:center;gap:6px;">
                      💡 Bạn muốn đổi sang đề thi khác?
                    </span>
                    <span style="font-size:11.5px;color:var(--muted);display:block;margin-top:2px;">
                      Kho 184 đề thi chuẩn Cambridge & Simulation (chọn trên Sidebar hoặc mở Kho đề)
                    </span>
                  </div>
                  <button type="button" class="s4-cbt-ctrl-btn" onclick="window.S4PracticeZone.openReadingHub()" style="padding:6px 14px;font-size:12.5px;font-weight:800;border-color:#059669;color:#059669;background:var(--card);">
                    📚 Đổi đề thi khác
                  </button>
                </div>
              </div>

              ${explainLessons.length > 0 ? `
                <!-- 5. Video bài giảng chữa chi tiết của đề này -->
                <div class="w-lobby-config-group" style="background:rgba(239, 68, 68, 0.08);padding:10px 14px;border-radius:10px;border:1px solid rgba(239, 68, 68, 0.25);">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
                    <div>
                      <span style="font-weight:800;font-size:13px;color:#ef4444;display:flex;align-items:center;gap:6px;">
                        🎬 Có Video Chữa Đề Chi Tiết (${explainLessons.length} video giải)
                      </span>
                      <span style="font-size:11.5px;color:var(--muted);display:block;margin-top:2px;">
                        Giáo viên giải thích chi tiết từng câu hỏi & dẫn chứng bài đọc
                      </span>
                    </div>
                    <button type="button" class="s4-cbt-ctrl-btn" style="border-color:#ef4444;color:#ef4444;font-weight:700;background:var(--card);padding:5px 12px;" onclick="window.s4CbtExitReadingToExplain('${explainLessons[0].id}')" title="Xem video bài giảng chữa đề này">
                      ▶ Xem Video Chữa Đề
                    </button>
                  </div>
                </div>
              ` : ''}

              <!-- Nút Bắt đầu làm bài thi CTA -->
              <div class="w-lobby-cta-zone">
                <button type="button" class="w-lobby-start-btn" onclick="window.s4PzStartReadingExamFromLobby()" style="background:linear-gradient(135deg, #059669 0%, #047857 100%);box-shadow:0 4px 14px rgba(5, 150, 105, 0.4);">
                  <span>🚀 BẮT ĐẦU LÀM BÀI THI</span>
                  <small>Tự động chuyển toàn màn hình (F11 Fullscreen)</small>
                </button>
                <button type="button" class="w-lobby-back-btn" onclick="${isPzTarget ? 'window.S4PracticeZone.openReadingHub()' : 'window.s4CbtExitReadingToLesson()'}">
                  ${isPzTarget ? '← Quay lại Kho Đề Thi Reading' : '← Quay lại giao diện học từ vựng bài đọc'}
                </button>
              </div>
            </div>
          </div>

          <!-- KHỐI LỊCH SỬ CÁC BÀI THI READING ĐÃ NỘP -->
          <div class="w-lobby-card w-lobby-history-section" id="readingLobbyHistoryCard">
            <div class="w-lobby-card-head" style="justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:10px;">
                <span class="w-lobby-icon">📜</span>
                <div>
                  <h3 style="margin:0;font-size:16px;font-weight:800;color:var(--text);">Lịch Sử Các Bài Thi Reading Từng Làm</h3>
                  <p style="margin:2px 0 0;font-size:12px;color:var(--muted);">Mã đề & thời gian bên trái • Điểm số Band bên phải • Xem lại bài làm & đối chiếu dẫn chứng</p>
                </div>
              </div>
              <span class="w-lobby-chip" style="background:rgba(16,185,129,0.12);color:#059669;">${subs.length} bài đã nộp</span>
            </div>

            <!-- Danh sách bài làm trong Sảnh -->
            <div class="w-history-list" id="readingLobbyHistoryList">
              ${historyListHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Tùy chỉnh cấu hình trong Sảnh
  window.s4PzSetReadingLobbyMode = function (m) {
    readLobbyMode = m;
    if (m === 'full') readLobbyTimer = 60;
    else readLobbyTimer = 20;
    if (typeof window.renderMain === 'function') window.renderMain();
  };
  window.s4PzSetReadingLobbyTimer = function (mins) {
    readLobbyTimer = mins;
    if (typeof window.renderMain === 'function') window.renderMain();
  };
  window.s4PzSetReadingLobbyFont = function (f) {
    readLobbyFont = f;
    cbtFontClass = f;
    if (typeof window.renderMain === 'function') window.renderMain();
  };

  // Mở Sảnh từ ngoài
  window.s4PzOpenReadingLobby = function (lessonId, isFull) {
    readHubOpen = false;
    readLobbyOpen = true;
    readLobbyTimer = isFull ? 60 : 20;

    let found = null;
    // 1. Nhận diện nếu lessonId thuộc Kho đề Practice Zone (__STUDY4_READ_PZ)
    if (lessonId != null && (String(lessonId).startsWith('read_pz_') || typeof lessonId === 'number' || (!isNaN(Number(lessonId)) && Number(lessonId) > 0))) {
      found = resolveReadingPzLesson(lessonId);
      activeReadLobbyTest = found ? (found.pzTestObj || null) : null;
    }

    // 2. Nếu không thuộc Practice Zone, tìm kiếm trong ALL_LESSONS
    if (!found) {
      const all = window.ALL_LESSONS || window.__ALL_LESSONS || [];
      const fLesson = all.find(l => l.id === lessonId);
      if (fLesson) {
        found = fLesson;
        activeReadLobbyTest = null;
      }
    }

    let resolvedPartIdx = 0;
    if (found) {
      activeReadLobbyLesson = found;
      if (typeof found.partIdx === 'number') {
        resolvedPartIdx = found.partIdx;
      } else {
        const pm = String(found.title || '').match(/Passage\s*(\d+)/i);
        if (pm) resolvedPartIdx = Math.max(0, Math.min(2, parseInt(pm[1], 10) - 1));
      }
    }
    readLobbyMode = isFull ? 'full' : `p${Math.max(1, Math.min(3, resolvedPartIdx + 1))}`;

    if (typeof window.renderMain === 'function') window.renderMain();
  };

  // Bắt đầu làm bài thi từ Sảnh (Tự động Fullscreen + CBT Mode)
  window.s4PzStartReadingExamFromLobby = function () {
    try {
      if (!document.fullscreenElement) {
        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen().catch(() => {});
      }
    } catch (e) {}

    readLobbyOpen = false;
    readHubOpen = false;
    readFullTestMode = (readLobbyMode === 'full');

    const target = activeReadLobbyLesson;
    if (!target) return;

    if (readLobbyMode === 'p1') activePartIdx = 0;
    else if (readLobbyMode === 'p2') activePartIdx = 1;
    else if (readLobbyMode === 'p3') activePartIdx = 2;
    else activePartIdx = 0;

    let launchTarget = target;
    if (!readFullTestMode) {
      const siblings = getReadingTestSiblings(target, window.ALL_LESSONS || window.__ALL_LESSONS || []);
      if (siblings[activePartIdx]) {
        launchTarget = siblings[activePartIdx];
        activeReadLobbyLesson = launchTarget;
      }
    }

    cbtFontClass = readLobbyFont;
    enterCbtExamMode(true);
    startExamTimer(readLobbyTimer);

    if (typeof window.selectLesson === 'function') {
      window.selectLesson(launchTarget.id, 'practice_test');
    }
  };

  // =========================================================================
  // MODAL LỊCH SỬ READING TRÊN TOPBAR
  // =========================================================================
  function renderReadingModalHistory() {
    const listEl = document.getElementById('readingModalHistoryList');
    if (!listEl) return;
    const allSubs = getReadingSubmissions();

    let filtered = allSubs;
    if (readingHistoryFilter === 'high') {
      filtered = allSubs.filter(s => parseFloat(s.bandScore) >= 7.0);
    } else if (readingHistoryFilter === 'low') {
      filtered = allSubs.filter(s => parseFloat(s.bandScore) < 7.0);
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="w-history-empty" style="padding:28px 14px;">
          <span class="w-history-empty-icon">📭</span>
          <strong>Không tìm thấy bài thi Reading nào phù hợp</strong>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(s => renderReadingHistoryItemHtml(s)).join('');
  }

  window.openReadingHistoryModal = function () {
    const modal = document.getElementById('readingHistoryModal');
    if (!modal) return;
    readingHistoryFilter = 'all';
    document.querySelectorAll('.r-filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.id === 'rFilter_all');
    });
    renderReadingModalHistory();
    modal.style.display = 'flex';
  };

  window.closeReadingHistoryModal = function () {
    const modal = document.getElementById('readingHistoryModal');
    if (modal) modal.style.display = 'none';
  };

  window.filterReadingHistoryModal = function (type) {
    readingHistoryFilter = type;
    document.querySelectorAll('.r-filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.id === `rFilter_${type}`);
    });
    renderReadingModalHistory();
  };

  let readHubLessonsCache = [];
  const hubSearchTimers = { reading: null, listening: null };

  function escapeAttr(s) {
    return (window.S4UI && typeof window.S4UI.escapeHtml === 'function')
      ? window.S4UI.escapeHtml(s)
      : String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function hubMatches(text, query) {
    if (window.S4UI && typeof window.S4UI.matchesSearch === 'function') {
      return window.S4UI.matchesSearch(text, query);
    }
    const q = String(query || '').trim().toLowerCase();
    return !q || String(text || '').toLowerCase().includes(q);
  }

  function renderHubSearchBar(skill, value, placeholder) {
    const id = skill === 'reading' ? 's4PzReadSearchInput' : 's4PzListenSearchInput';
    if (window.S4UI && typeof window.S4UI.buildSearchBarHtml === 'function') {
      return window.S4UI.buildSearchBarHtml({
        id: id,
        value: value || '',
        placeholder: placeholder,
        trackIme: true,
        oninput: `window.s4PzHubSearchInput('${skill}', this.value, this)`,
        onkeydown: `if(event.key==='Enter'){event.preventDefault();window.s4PzHubSearchSubmit('${skill}');}else if(event.key==='Escape'&&this.value){event.preventDefault();window.s4PzHubSearchClear('${skill}');}`,
        onclear: `window.s4PzHubSearchClear('${skill}')`,
        onsubmit: `window.s4PzHubSearchSubmit('${skill}')`
      });
    }
    return `<input type="text" id="${id}" class="s4-pz-text-input" placeholder="${escapeAttr(placeholder)}" value="${escapeAttr(value || '')}" oninput="window.s4PzHubSearchInput('${skill}', this.value, this)">`;
  }

  function getPzHubConfig(skill) {
    if (skill === 'reading') {
      return {
        skill: 'reading',
        label: 'Reading',
        tests: getReadingFullTestsCatalog(readHubLessonsCache),
        selectedBook: readHubBook,
        setBook: (b) => { readHubBook = b; },
        query: readHubSearch,
        setQuery: (q) => { readHubSearch = q; },
        getBook: (t) => t.book,
        inputId: 's4PzReadSearchInput',
        pillsId: 's4PzReadBookPills',
        wrapId: 's4PzReadResultsWrap',
        renderCard: (t) => `
          <div class="s4-pz-test-item">
            <div>
              <div style="font-size:11px;font-weight:800;color:var(--hl-cyan);text-transform:uppercase;">${escapeAttr(t.book)}</div>
              <div style="font-size:15px;font-weight:800;color:var(--text);margin-top:3px;">${escapeAttr(t.title)}</div>
              <div style="font-size:12px;color:var(--muted);margin-top:3px;">${t.passages.length} Passages • 40 câu hỏi • 60 phút • Full-Screen CBT</div>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;">
              <button class="btn btn-primary" style="flex:1;justify-content:center;" onclick="window.s4PzOpenReadingLobby('${escapeAttr(t.passages[0].id)}', true)">
                🎯 Chọn đề này (Vào sảnh)
              </button>
              ${t.passages.map((p, idx) => `
                <button class="btn" style="padding:6px 10px;font-size:12px;" onclick="window.s4PzOpenReadingLobby('${escapeAttr(p.id)}', false)" title="${escapeAttr(p.title)}">
                  P${idx + 1}
                </button>
              `).join('')}
            </div>
          </div>
        `
      };
    }
    return {
      skill: 'listening',
      label: 'Listening',
      tests: window.__STUDY4_LISTEN_PZ || [],
      selectedBook: listenHubBook,
      setBook: (b) => { listenHubBook = b; },
      query: listenHubSearch,
      setQuery: (q) => { listenHubSearch = q; },
      getBook: (t) => getListeningBookCategory(t.title),
      inputId: 's4PzListenSearchInput',
      pillsId: 's4PzListenBookPills',
      wrapId: 's4PzListenResultsWrap',
      renderCard: (t) => `
        <div class="s4-pz-test-item">
          <div>
            <div style="font-size:11px;font-weight:800;color:var(--hl-cyan);text-transform:uppercase;">${escapeAttr(getListeningBookCategory(t.title))}</div>
            <div style="font-size:15px;font-weight:800;color:var(--text);margin-top:3px;">${escapeAttr(t.title)}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:3px;">4 Recordings • 40 câu hỏi • Full-Screen CBT</div>
          </div>
          <div style="display:flex;align-items:center;gap:5px;margin-top:6px;">
            <button class="btn btn-primary" style="flex:1;min-width:0;justify-content:center;white-space:nowrap;padding:7px 6px;font-size:12px;font-weight:700;" onclick="window.S4PracticeZone.openListeningLobby(${t.id})">
              🎯 Vào sảnh thi
            </button>
            ${(t.parts || []).map((p, idx) => `
              <button class="btn" style="padding:6px 8px;font-size:12px;font-weight:700;white-space:nowrap;flex-shrink:0;" onclick="window.s4PzOpenListeningLobbySection(${t.id}, 's${idx + 1}')" title="${escapeAttr(p.name || 'Section ' + (idx + 1))}">
                S${idx + 1}
              </button>
            `).join('')}
          </div>
        </div>
      `
    };
  }

  function buildPzHubResultsHtml(skill) {
    const cfg = getPzHubConfig(skill);
    const tests = cfg.tests;
    const q = String(cfg.query || '').trim();
    const filtered = tests.filter(t => {
      const book = cfg.getBook(t);
      if (cfg.selectedBook !== 'ALL' && book !== cfg.selectedBook) return false;
      if (q && !hubMatches(t.title, q)) return false;
      return true;
    });

    const hasFilter = !!q || cfg.selectedBook !== 'ALL';
    const metaHtml = `
      <div class="s4-pz-search-meta">
        <span>
          ${hasFilter
            ? `🔍 Tìm thấy <strong>${filtered.length}</strong> / ${tests.length} bộ đề${q ? ` cho "<strong>${escapeAttr(q)}</strong>"` : ''}${cfg.selectedBook !== 'ALL' ? ` • <strong>${escapeAttr(cfg.selectedBook)}</strong>` : ''}`
            : `📚 Đang hiển thị toàn bộ <strong>${tests.length}</strong> bộ đề Full Test`}
        </span>
        ${hasFilter ? `<button type="button" class="s4-pz-clear-chip" onclick="window.s4PzResetHubSearch('${skill}')">✕ Xóa lọc</button>` : ''}
      </div>
    `;

    if (filtered.length === 0) {
      return `
        ${metaHtml}
        <div class="s4-empty-state">
          <div style="font-size:34px;">🔍</div>
          <div style="font-size:15px;font-weight:800;color:var(--text);">Không tìm thấy đề ${cfg.label} phù hợp</div>
          <div style="font-size:13px;">${q ? `Từ khóa "<strong>${escapeAttr(q)}</strong>"` : 'Bộ lọc hiện tại'} không khớp với đề nào${cfg.selectedBook !== 'ALL' ? ` trong nhóm <strong>${escapeAttr(cfg.selectedBook)}</strong>` : ''}.</div>
          <button type="button" class="btn btn-primary" onclick="window.s4PzResetHubSearch('${skill}')">↺ Xóa từ khóa & Xem tất cả (${tests.length} đề)</button>
        </div>
      `;
    }

    return `${metaHtml}<div class="s4-pz-test-grid">${filtered.map(cfg.renderCard).join('')}</div>`;
  }

  function updatePzHubResults(skill) {
    const cfg = getPzHubConfig(skill);
    const wrap = document.getElementById(cfg.wrapId);
    if (wrap) {
      wrap.innerHTML = buildPzHubResultsHtml(skill);
      return true;
    }
    return false;
  }

  window.s4PzHubSearchInput = function (skill, q, inpEl) {
    const cfg = getPzHubConfig(skill);
    const el = inpEl || document.getElementById(cfg.inputId);
    if (window.S4UI && typeof window.S4UI.syncSearchClear === 'function' && el) {
      window.S4UI.syncSearchClear(el);
    }
    if (el && el.dataset && el.dataset.composing === '1') return;
    cfg.setQuery(String(q || ''));
    clearTimeout(hubSearchTimers[skill]);
    hubSearchTimers[skill] = setTimeout(() => {
      if (!updatePzHubResults(skill) && typeof window.renderMain === 'function') {
        window.renderMain();
      }
    }, 120);
  };

  window.s4PzHubSearchSubmit = function (skill) {
    clearTimeout(hubSearchTimers[skill]);
    const cfg = getPzHubConfig(skill);
    const inp = document.getElementById(cfg.inputId);
    if (inp) {
      cfg.setQuery(inp.value || '');
      if (window.S4UI && typeof window.S4UI.syncSearchClear === 'function') {
        window.S4UI.syncSearchClear(inp);
      }
    }
    if (!updatePzHubResults(skill) && typeof window.renderMain === 'function') {
      window.renderMain();
      return;
    }
    const wrap = document.getElementById(cfg.wrapId);
    if (wrap && typeof wrap.scrollIntoView === 'function') {
      const rect = wrap.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.75) {
        try { wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
      }
    }
  };

  window.s4PzHubSearchClear = function (skill) {
    clearTimeout(hubSearchTimers[skill]);
    const cfg = getPzHubConfig(skill);
    cfg.setQuery('');
    const inp = document.getElementById(cfg.inputId);
    if (inp) {
      inp.value = '';
      if (window.S4UI && typeof window.S4UI.syncSearchClear === 'function') {
        window.S4UI.syncSearchClear(inp);
      }
      try { inp.focus({ preventScroll: true }); } catch (e) {}
    }
    if (!updatePzHubResults(skill) && typeof window.renderMain === 'function') {
      window.renderMain();
    }
  };

  window.s4PzResetHubSearch = function (skill) {
    const cfg = getPzHubConfig(skill);
    cfg.setBook('ALL');
    const pillsEl = document.getElementById(cfg.pillsId);
    if (pillsEl) {
      pillsEl.querySelectorAll('.s4-pz-book-pill').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-book') === 'ALL');
      });
    }
    window.s4PzHubSearchClear(skill);
  };

  function getReadingHubBooks() {
    return [
      'ALL',
      'Recent Actual Tests (1–102)',
      'British Council & Samples (1–32)',
      'Simulation Tests (1–10)',
      'IELTS Collection (1–4)'
    ];
  }
  function getReadingHubTitleText(tests) {
    const totalPassages = tests.reduce((acc, cur) => acc + (cur.passages ? cur.passages.length : 3), 0);
    const totalQ = tests.length * 40;
    return `Kho Luyện Đề Reading Thực Chiến (${tests.length} Đề Full Test • ${totalPassages} Passages • ${totalQ.toLocaleString()} Câu hỏi)`;
  }
  function buildReadingBookPillsHtml(tests) {
    const books = getReadingHubBooks();
    return books.map(b => {
      const count = (b === 'ALL') ? tests.length : tests.filter(t => t.book === b).length;
      if (b !== 'ALL' && count === 0) return '';
      return `
        <button type="button" data-book="${escapeAttr(b)}" class="s4-pz-book-pill ${readHubBook === b ? 'active' : ''}" onclick="window.s4PzSetReadingBook('${escapeAttr(b)}')">
          ${b === 'ALL' ? `Tất cả (${tests.length} đề)` : `${b} (${count} đề)`}
        </button>
      `;
    }).join('');
  }
  function refreshReadingHubMetaDom() {
    const tests = getReadingFullTestsCatalog(readHubLessonsCache);
    const titleEl = document.getElementById('s4PzReadHubTitle');
    if (titleEl) titleEl.textContent = getReadingHubTitleText(tests);
    const pillsEl = document.getElementById('s4PzReadBookPills');
    if (pillsEl) pillsEl.innerHTML = buildReadingBookPillsHtml(tests);
  }

  function renderReadingHub(allLessons) {
    exitCbtExamMode();
    if (Array.isArray(allLessons) && allLessons.length > 0) {
      readHubLessonsCache = allLessons;
    }
    if (!window.__STUDY4_READ_PZ) {
      ensureReadingPzLoaded(() => {
        if (document.getElementById('s4PzReadResultsWrap')) {
          refreshReadingHubMetaDom();
          updatePzHubResults('reading');
        } else if (typeof window.renderMain === 'function') {
          window.renderMain();
        }
      });
    }
    const tests = getReadingFullTestsCatalog(readHubLessonsCache);

    return `
      <div class="s4-pz-hub-card">
        <div class="s4-pz-hub-top">
          <div style="flex:1;min-width:260px;">
            <div class="lesson-unit-tag">🎯 IELTS ACADEMIC READING — COMPUTER-DELIVERED PRACTICE ZONE</div>
            <h1 class="lesson-title" id="s4PzReadHubTitle">${getReadingHubTitleText(tests)}</h1>
            <p style="font-size:13.5px;color:var(--muted);margin-top:4px;">Giao diện chuẩn 100% phần mềm thi trên máy tính (Inspera Full-Screen, chia đôi màn hình kéo thả, Highlight vàng & Ghi chú, chấm Band Score tự động).</p>
          </div>
          <div class="s4-pz-hub-search">
            ${renderHubSearchBar('reading', readHubSearch, 'Tìm tên bộ đề (VD: Actual 10, British Council)...')}
          </div>
        </div>
        <div class="s4-pz-book-pills" id="s4PzReadBookPills">
          ${buildReadingBookPillsHtml(tests)}
        </div>
        <div id="s4PzReadResultsWrap">
          ${buildPzHubResultsHtml('reading')}
        </div>
      </div>
    `;
  }

  window.s4PzSetReadingBook = function (b) {
    readHubBook = b;
    const pillsEl = document.getElementById('s4PzReadBookPills');
    if (pillsEl) {
      pillsEl.querySelectorAll('.s4-pz-book-pill').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-book') === b);
      });
    }
    if (!updatePzHubResults('reading') && typeof window.renderMain === 'function') {
      window.renderMain();
    }
  };
  window.s4PzFilterReadingHub = function (q) {
    window.s4PzHubSearchInput('reading', q);
  };
  window.s4PzStartReadingTest = function (lessonId, isFull) {
    readHubOpen = false;
    readFullTestMode = !!isFull;
    activePartIdx = 0;
    enterCbtExamMode(true);
    startExamTimer(readFullTestMode ? 60 : 20);
    if (typeof window.selectLesson === 'function') {
      window.selectLesson(lessonId, 'practice_test');
    }
  };

  // =========================================================================
  // 6. LISTENING PRACTICE ZONE ENGINE (133 FULL TESTS / 532 RECORDINGS / 5,320 QUESTIONS)
  // =========================================================================
  const STORAGE_LISTEN_SUBS = 'lp_listening_submissions_v1';
  let listenPzLoading = false;
  let activeListenTestId = null;
  let listenSubmittedMap = {};
  let listenHubOpen = false;
  let listenHubBook = 'ALL';
  let listenHubSearch = '';
  let listenLobbyOpen = true;
  let activeListenLobbyTest = null;
  let listenLobbyMode = 'full'; // 'full' | 's1' | 's2' | 's3' | 's4'
  let listenLobbyTimer = 40; // 40 | 20 | 0
  let listenLobbyFont = 'cbt-font-std';
  let lastListeningSessionContext = null;
  let listeningHistoryFilter = 'all';

  function getListeningSubmissions() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_LISTEN_SUBS) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveListeningSubmissionRecord(record) {
    const list = getListeningSubmissions();
    const idx = list.findIndex(r => r.id === record.id);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.unshift(record);
    }
    try {
      localStorage.setItem(STORAGE_LISTEN_SUBS, JSON.stringify(list));
    } catch (e) {
      console.error('Không thể lưu listening submission vào localStorage', e);
    }
    updateTopListeningHistoryCount();
  }

  async function deleteListeningSubmission(subId) {
    const ok = (window.S4UI && typeof window.S4UI.confirm === 'function')
      ? await window.S4UI.confirm('Bạn có chắc chắn muốn xóa bài thi Listening này khỏi lịch sử lưu trữ?', {
          title: 'Xóa bài thi Listening',
          tone: 'danger',
          confirmText: 'Xóa bài'
        })
      : confirm('Bạn có chắc chắn muốn xóa bài thi Listening này khỏi lịch sử lưu trữ?');
    if (!ok) return;
    let list = getListeningSubmissions();
    list = list.filter(r => r.id !== subId);
    try {
      localStorage.setItem(STORAGE_LISTEN_SUBS, JSON.stringify(list));
    } catch (e) {}
    updateTopListeningHistoryCount();
    if (typeof window.renderMain === 'function') window.renderMain();
    renderListeningModalHistory();
    if (window.S4UI && typeof window.S4UI.toast === 'function') {
      window.S4UI.toast('info', 'Đã xóa bài thi khỏi lịch sử.');
    }
  }

  function updateTopListeningHistoryCount() {
    const list = getListeningSubmissions();
    const el = document.getElementById('topListeningHistoryCount');
    if (el) el.textContent = String(list.length);
  }
  window.updateTopListeningHistoryCount = updateTopListeningHistoryCount;

  function renderListeningHistoryItemHtml(sub) {
    const isPass = parseFloat(sub.bandScore) >= 6.5;
    return `
      <div class="w-history-item" id="l_sub_${sub.id}">
        <div class="w-history-left">
          <div class="w-history-title-row">
            <span class="w-history-code-tag" style="background:rgba(59, 130, 246, 0.15);color:#2563eb;">${sub.testCode || 'Listening'}</span>
            <span class="w-history-title-text" title="${sub.testTitle}">${sub.testTitle}</span>
          </div>
          <div class="w-history-meta-row">
            <span>📅 ${sub.date || 'Vừa xong'}</span>
            <span>•</span>
            <span>⏱️ ${sub.duration || '40 phút'}</span>
            <span>•</span>
            <span>🎯 Đúng: <strong>${sub.correctCount}/${sub.totalQuestions}</strong> câu (${sub.accuracy || 0}%)</span>
          </div>
        </div>

        <div class="w-history-right">
          <div class="w-history-score-badge graded">
            <div class="w-score-main" style="color:${isPass ? '#10b981' : '#f59e0b'};">🏆 Band ${sub.bandScore || '6.0'}</div>
            <div class="w-score-sub">${sub.correctCount}/${sub.totalQuestions} câu đúng</div>
          </div>
          <div class="w-history-actions">
            <button type="button" class="w-history-btn-view" onclick="window.s4PzViewListeningSubmission('${sub.id}')" title="Xem lại bài làm & đối chiếu đáp án chi tiết">
              👁️ Xem lại
            </button>
            <button type="button" class="w-history-btn-icon" onclick="window.s4PzRetakeListeningSubmission('${sub.id}')" title="Làm lại đề thi này">
              🔄
            </button>
            <button type="button" class="w-history-btn-icon del" onclick="window.s4PzDeleteListeningSubmission('${sub.id}')" title="Xóa bản ghi này">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
  }

  window.s4PzViewListeningSubmission = function (subId) {
    const list = getListeningSubmissions();
    const sub = list.find(s => s.id === subId);
    if (!sub) return;

    if (window.S4PracticeZone && window.S4PracticeZone.closeListeningHistoryModal) {
      window.S4PracticeZone.closeListeningHistoryModal();
    }
    listenLobbyOpen = false;
    listenHubOpen = false;
    activeListenTestId = Number(sub.testId);
    activePartIdx = 0;
    listenSubmittedMap[sub.sessionKey] = true;
    enterCbtExamMode(true);
    if (typeof window.renderMain === 'function') window.renderMain();
  };

  window.s4PzRetakeListeningSubmission = function (subId) {
    const list = getListeningSubmissions();
    const sub = list.find(s => s.id === subId);
    if (!sub) return;

    if (window.S4PracticeZone && window.S4PracticeZone.closeListeningHistoryModal) {
      window.S4PracticeZone.closeListeningHistoryModal();
    }
    delete listenSubmittedMap[sub.sessionKey];
    listenLobbyOpen = true;
    const testList = window.__STUDY4_LISTEN_PZ || [];
    const found = testList.find(t => t.id === Number(sub.testId));
    if (found) {
      activeListenLobbyTest = found;
      activeListenTestId = found.id;
    }
    listenLobbyMode = 'full';
    listenLobbyTimer = 40;
    if (typeof window.renderMain === 'function') window.renderMain();
  };

  window.s4PzDeleteListeningSubmission = function (id) {
    deleteListeningSubmission(id);
  };

  function renderListeningModalHistory() {
    const el = document.getElementById('listeningModalHistoryList');
    if (!el) return;
    const subs = getListeningSubmissions();
    let filtered = subs;
    if (listeningHistoryFilter === 'high') {
      filtered = subs.filter(s => parseFloat(s.bandScore) >= 7.0);
    } else if (listeningHistoryFilter === 'low') {
      filtered = subs.filter(s => parseFloat(s.bandScore) < 7.0);
    }

    if (filtered.length === 0) {
      el.innerHTML = `
        <div class="w-history-empty" style="padding:40px 20px;">
          <span class="w-history-empty-icon">📭</span>
          <strong>Không có bài thi nào phù hợp bộ lọc</strong>
          <p style="margin:4px 0 0;font-size:12px;opacity:0.8;">Hãy chọn bộ lọc khác hoặc bắt đầu một bài thi Listening mới.</p>
        </div>
      `;
      return;
    }

    el.innerHTML = filtered.map(s => renderListeningHistoryItemHtml(s)).join('');
  }

  window.openListeningHistoryModal = function () {
    const m = document.getElementById('listeningHistoryModal');
    if (!m) return;
    m.style.display = 'flex';
    listeningHistoryFilter = 'all';
    ['all', 'high', 'low'].forEach(f => {
      const b = document.getElementById('lFilter_' + f);
      if (b) b.classList.toggle('active', f === 'all');
    });
    renderListeningModalHistory();
  };

  window.closeListeningHistoryModal = function () {
    const m = document.getElementById('listeningHistoryModal');
    if (m) m.style.display = 'none';
  };

  window.filterListeningHistoryModal = function (filter) {
    listeningHistoryFilter = filter;
    ['all', 'high', 'low'].forEach(f => {
      const b = document.getElementById('lFilter_' + f);
      if (b) b.classList.toggle('active', f === filter);
    });
    renderListeningModalHistory();
  };

  function findExplainLessonsForListening(testTitle, allLessons) {
    if (!testTitle || !allLessons) return [];
    const rawTitle = typeof testTitle === 'string' ? testTitle : (testTitle.title || '');
    const ident = parseIeltsTestIdentity(rawTitle, { skill: 'listening' });
    if (ident) {
      return allLessons.filter(x => {
        if (x.unitId !== 'u_6' && !(x.id && x.id.startsWith('listening_u6_'))) return false;
        const exIdent = getExplainLessonIdentity(x, 'listening');
        return !!(exIdent && exIdent.key === ident.key);
      });
    }

    const clean = rawTitle.toLowerCase().replace(/\b(ielts|listening|academic|general)\b/gi, '').replace(/\s+/g, ' ').trim();
    if (clean) {
      return allLessons.filter(x => {
        if (x.unitId !== 'u_6' && !(x.id && x.id.startsWith('listening_u6_'))) return false;
        const g = (x.group || '').toLowerCase().replace(/\s+/g, ' ');
        const t = (x.title || '').toLowerCase().replace(/\s+/g, ' ');
        return g.includes(clean) || t.includes(clean);
      });
    }
    return [];
  }

  function ensureListeningPzLoaded(cb) {
    if (window.__STUDY4_LISTEN_PZ) {
      cb && cb(window.__STUDY4_LISTEN_PZ);
      return;
    }
    if (listenPzLoading) {
      const iv = setInterval(() => {
        if (window.__STUDY4_LISTEN_PZ) {
          clearInterval(iv);
          cb && cb(window.__STUDY4_LISTEN_PZ);
        }
      }, 40);
      return;
    }
    listenPzLoading = true;
    const s = document.createElement('script');
    s.src = 'data/listening_practice_zone.js?v=22';
    s.onload = () => {
      listenPzLoading = false;
      cb && cb(window.__STUDY4_LISTEN_PZ || []);
    };
    s.onerror = () => {
      listenPzLoading = false;
      cb && cb([]);
    };
    document.head.appendChild(s);
  }

  function getListeningBookCategory(title) {
    const ident = parseIeltsTestIdentity(title, { skill: 'listening' });
    if (ident) {
      if (ident.series === 'actual') return 'Recent Actual Tests (1–50)';
      if (ident.series === 'asia_guide' || ident.series === 'bc') return 'British Council Official & Guide';
      if (ident.series === 'sample') return 'IELTS Sample Tests (1–20)';
      if (ident.series === 'simulation') return 'Simulation Tests (1–10)';
      if (ident.series === 'collection') return 'IELTS Collection (1–4)';
    }
    return 'Bộ đề khác';
  }

  function findListeningPzTestByKey(key) {
    const list = window.__STUDY4_LISTEN_PZ || [];
    if (!key || !list.length) return null;
    return list.find(t => {
      const tIdent = parseIeltsTestIdentity(t.title, { skill: 'listening' });
      return tIdent && tIdent.key === key;
    }) || null;
  }

  function hasListeningPzKey(identOrStr) {
    const ident = (identOrStr && typeof identOrStr === 'object' && identOrStr.key)
      ? identOrStr
      : parseIeltsTestIdentity(identOrStr, { skill: 'listening' });
    if (!ident) return false;
    const pzLoaded = Array.isArray(window.__STUDY4_LISTEN_PZ) && window.__STUDY4_LISTEN_PZ.length > 0;
    if (pzLoaded) {
      return !!findListeningPzTestByKey(ident.key);
    }
    if (ident.series === 'collection' || ident.series === 'simulation' || ident.series === 'asia_guide' || ident.series === 'actual') return true;
    if (ident.series === 'sample') return ident.testNum >= 1 && ident.testNum <= 20;
    if (ident.series === 'bc') return ident.testNum >= 1 && ident.testNum <= 9;
    return false;
  }

  function findListeningSourcesForExplain(explainLesson, allLessons) {
    if (!explainLesson || (explainLesson.unitId !== 'u_6' && !String(explainLesson.id || '').startsWith('listening_u6_'))) {
      return { ident: null, u4Lessons: [], pzTest: null, hasPz: false };
    }
    const ident = getExplainLessonIdentity(explainLesson, 'listening');
    if (!ident) return { ident: null, u4Lessons: [], pzTest: null, hasPz: false };

    const u4Lessons = (allLessons || []).filter(x => {
      if (x.unitId !== 'u_4') return false;
      const u4Ident = parseIeltsTestIdentity(x.title, { skill: 'listening' });
      return !!(u4Ident && u4Ident.key === ident.key);
    });
    const pzTest = findListeningPzTestByKey(ident.key);
    const hasPz = hasListeningPzKey(ident);
    return { ident, u4Lessons, pzTest, hasPz };
  }

  function findListeningTestForLesson(lesson) {
    const list = window.__STUDY4_LISTEN_PZ || [];
    if (!lesson || !list.length) return null;
    const ident = parseIeltsTestIdentity(lesson.title, { skill: 'listening' });
    if (ident) {
      const byKey = findListeningPzTestByKey(ident.key);
      if (byKey) return byKey;
    }
    const rawTitle = (lesson.title || '').split('|')[0].trim();
    const normT = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    for (const t of list) {
      const cand = t.title.toLowerCase().replace(/\blistening\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
      const nClean = normT.replace(/\blistening\b/g, '').replace(/\s+/g, ' ').trim();
      if (cand && (cand === nClean || t.title.toLowerCase().includes(rawTitle.toLowerCase()))) {
        return t;
      }
    }
    // Do not silently substitute the first CBT (usually Collection 1 Test 1)
    // when the selected lesson is not present in the CBT dataset.
    return null;
  }

  // =========================================================================
  // GIAO DIỆN SẢNH PHÒNG THI LISTENING (LISTENING CANDIDATE LOBBY)
  // =========================================================================
  window.s4PzSetListeningLobbyMode = function (m) {
    listenLobbyMode = m;
    if (typeof window.renderMain === 'function') window.renderMain();
  };
  window.s4PzSetListeningLobbyTimer = function (mins) {
    listenLobbyTimer = mins;
    if (typeof window.renderMain === 'function') window.renderMain();
  };
  window.s4PzSetListeningLobbyFont = function (f) {
    listenLobbyFont = f;
    cbtFontClass = f;
    if (typeof window.renderMain === 'function') window.renderMain();
  };
  window.s4PzPlayTestSound = function() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch(e) {}
  };

  window.s4PzStartListeningExamFromLobby = function () {
    try {
      if (!document.fullscreenElement) {
        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen().catch(() => {});
      }
    } catch (e) {}

    listenLobbyOpen = false;
    listenHubOpen = false;

    const list = window.__STUDY4_LISTEN_PZ || [];
    const target = activeListenLobbyTest || (activeListenTestId && list.find(t => t.id === Number(activeListenTestId))) || list[0];
    if (!target) return;
    activeListenLobbyTest = target;
    activeListenTestId = target.id;

    if (listenLobbyMode === 's1') activePartIdx = 0;
    else if (listenLobbyMode === 's2') activePartIdx = 1;
    else if (listenLobbyMode === 's3') activePartIdx = 2;
    else if (listenLobbyMode === 's4') activePartIdx = 3;
    else activePartIdx = 0;

    cbtFontClass = listenLobbyFont;
    startExamTimer(listenLobbyTimer);
    enterCbtExamMode(true);

    if (typeof window.renderMain === 'function') window.renderMain();
  };

  window.s4PzExitListeningExamToLobby = function () {
    stopListeningPassAudio(true);
    exitCbtExamMode();
    listenLobbyOpen = true;
    listenHubOpen = false;
    if (typeof window.renderMain === 'function') window.renderMain();
  };

  window.s4CbtExitListeningToExplain = function (lessonId) {
    stopListeningPassAudio(true);
    exitCbtExamMode();
    listenLobbyOpen = false;
    listenHubOpen = false;
    if (typeof window.exitListeningPzMode === 'function') {
      window.exitListeningPzMode();
    }
    if (typeof window.selectLesson === 'function') window.selectLesson(lessonId);
  };

  function renderListeningLobby(currentLesson, allLessons) {
    exitCbtExamMode();
    const list = window.__STUDY4_LISTEN_PZ || [];
    let target = activeListenLobbyTest;
    if (!target && currentLesson) {
      target = findListeningTestForLesson(currentLesson);
    }
    if (!target && activeListenTestId) {
      target = list.find(t => t.id === Number(activeListenTestId));
    }
    if (!target) {
      target = list[0] || { id: 6842, title: 'IELTS Collection 1 Listening Test 1', parts: [] };
    }
    activeListenLobbyTest = target;
    activeListenTestId = target.id;

    const parts = target.parts || [];
    const explainLessons = findExplainLessonsForListening(target.title, allLessons);
    const subs = getListeningSubmissions();

    let historyListHtml = '';
    if (subs.length === 0) {
      historyListHtml = `
        <div class="w-history-empty">
          <span class="w-history-empty-icon">📭</span>
          <strong>Chưa có bài thi Listening nào được nộp</strong>
          <p style="margin:4px 0 0;font-size:12px;opacity:0.8;">Hãy chọn cấu hình phía trên và bấm "Bắt đầu làm bài thi" để rèn luyện ngay!</p>
        </div>
      `;
    } else {
      historyListHtml = subs.map(s => renderListeningHistoryItemHtml(s)).join('');
    }

    return `
      <div class="w-cbt-lobby" id="listeningLobbyContainer">
        <div class="w-lobby-inner">
          <!-- TOP HEADER CỦA SẢNH -->
          <div class="w-lobby-header">
            <div class="w-lobby-header-badge">
              <span class="w-lobby-chip" style="background:rgba(59,130,246,0.12);color:#2563eb;border-color:rgba(59,130,246,0.25);">🎧 IELTS LISTENING PRACTICE ZONE</span>
              <span class="w-lobby-chip cbt">INSPERA CBT SIMULATOR</span>
            </div>
            <h1 class="w-lobby-title" id="lLobbyTestTitle">${target.title} (Full Test 40 câu)</h1>
            <p class="w-lobby-subtitle">
              Phòng thi thử Listening mô phỏng 100% môi trường thi máy tính chính thức (Computer-Based Test). Vui lòng kiểm tra âm lượng tai nghe, đọc kỹ hướng dẫn trước khi bấm bắt đầu.
            </p>
          </div>

          <!-- LOBBY CONTENT GRID 2 CỘT -->
          <div class="w-lobby-grid">
            <!-- CỘT TRÁI: HƯỚNG DẪN & CẤU TRÚC 4 RECORDINGS -->
            <div class="w-lobby-card w-lobby-guide-col">
              <div class="w-lobby-card-head">
                <span class="w-lobby-icon">📋</span>
                <div>
                  <h3>Cấu trúc bài thi & Hướng dẫn nghe</h3>
                  <p>Official IELTS Listening Format (4 Recordings • 40 Questions • ~30 phút)</p>
                </div>
              </div>

              <!-- Cấu trúc 4 Sections -->
              <div class="w-lobby-task-summary">
                <div class="w-lobby-task-row">
                  <div class="w-lobby-task-tag t1" style="background:#2563eb;">SECTION 1</div>
                  <div class="w-lobby-task-info">
                    <strong>${parts[0] ? parts[0].name : 'Recording 1'} (Hội thoại đời sống thường nhật)</strong>
                    <div class="w-lobby-task-meta">
                      <span>⏱️ ~7-8 phút</span> • <span>❓ Q1–Q10 (10 câu)</span> • <span>📊 Điền từ vào mẫu đơn/ghi chú</span>
                    </div>
                  </div>
                </div>

                <div class="w-lobby-task-row">
                  <div class="w-lobby-task-tag t1" style="background:#0284c7;">SECTION 2</div>
                  <div class="w-lobby-task-info">
                    <strong>${parts[1] ? parts[1].name : 'Recording 2'} (Độc thoại hướng dẫn công cộng)</strong>
                    <div class="w-lobby-task-meta">
                      <span>⏱️ ~7-8 phút</span> • <span>❓ Q11–Q20 (10 câu)</span> • <span>📊 Bản đồ, trắc nghiệm hoặc bảng</span>
                    </div>
                  </div>
                </div>

                <div class="w-lobby-task-row">
                  <div class="w-lobby-task-tag t1" style="background:#0d9488;">SECTION 3</div>
                  <div class="w-lobby-task-info">
                    <strong>${parts[2] ? parts[2].name : 'Recording 3'} (Thảo luận học thuật 2-4 người)</strong>
                    <div class="w-lobby-task-meta">
                      <span>⏱️ ~7-8 phút</span> • <span>❓ Q21–Q30 (10 câu)</span> • <span>📊 Trắc nghiệm nhiều lựa chọn & nối ý</span>
                    </div>
                  </div>
                </div>

                <div class="w-lobby-task-row">
                  <div class="w-lobby-task-tag t1" style="background:#7c3aed;">SECTION 4</div>
                  <div class="w-lobby-task-info">
                    <strong>${parts[3] ? parts[3].name : 'Recording 4'} (Bài thuyết trình / Bài giảng học thuật)</strong>
                    <div class="w-lobby-task-meta">
                      <span>⏱️ ~7-8 phút</span> • <span>❓ Q31–Q40 (10 câu)</span> • <span>📊 Ghi chép tóm tắt bài giảng khoa học</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quy chế thi Listening CBT -->
              <div class="w-lobby-rules">
                <div class="w-lobby-rule-item">
                  <span class="w-rule-icon">🎧</span>
                  <div>
                    <strong>Quy chế nghe 1 lần duy nhất:</strong>
                    <p>Trong bài thi thật, mỗi đoạn băng chỉ được phát đúng 1 lần. Bạn có thời gian đọc câu hỏi trước khi nghe và kiểm tra lại sau khi đoạn băng kết thúc.</p>
                  </div>
                </div>

                <div class="w-lobby-rule-item">
                  <span class="w-rule-icon">⌨️</span>
                  <div>
                    <strong>Điền trực tiếp trên màn hình:</strong>
                    <p>Nhấp chuột vào ô trống để gõ câu trả lời hoặc bấm chọn phương án. Sử dụng phím <strong>Tab</strong> để chuyển nhanh sang ô trống tiếp theo.</p>
                  </div>
                </div>

                <div class="w-lobby-rule-item">
                  <span class="w-rule-icon">📋</span>
                  <div>
                    <strong>Bảng điều hướng câu hỏi Q1..Q40 & Cắm cờ Review:</strong>
                    <p>Dải câu hỏi nằm cố định ở đáy màn hình. Nhấp số câu để nhảy đến ngay câu đó, nhấp Review để cắm cờ xem lại trước khi nộp.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- CỘT PHẢI: CẤU HÌNH PHÒNG THI (CANDIDATE SETTINGS) -->
            <div class="w-lobby-card w-lobby-config-col">
              <div class="w-lobby-card-head">
                <span class="w-lobby-icon">⚙️</span>
                <div>
                  <h3>Cấu hình phòng thi của bạn</h3>
                  <p>Tùy chỉnh chế độ, thời gian, âm lượng tai nghe & cỡ chữ</p>
                </div>
              </div>

              <!-- 1. Chọn chế độ thi (Full Test hoặc từng Section) -->
              <div class="w-lobby-config-group">
                <label class="w-config-label">1. Chế độ làm bài:</label>
                <div class="w-config-options">
                  <label class="w-config-radio">
                    <input type="radio" name="lLobbyMode" value="full" ${listenLobbyMode === 'full' ? 'checked' : ''} onchange="window.s4PzSetListeningLobbyMode('full')">
                    <div class="w-radio-box">
                      <span class="w-radio-title">Full Test</span>
                      <span class="w-radio-desc">4 Sections (40 câu)</span>
                    </div>
                  </label>
                  <label class="w-config-radio">
                    <input type="radio" name="lLobbyMode" value="s1" ${listenLobbyMode === 's1' ? 'checked' : ''} onchange="window.s4PzSetListeningLobbyMode('s1')">
                    <div class="w-radio-box">
                      <span class="w-radio-title">Section 1</span>
                      <span class="w-radio-desc">Q1–Q10</span>
                    </div>
                  </label>
                  <label class="w-config-radio">
                    <input type="radio" name="lLobbyMode" value="s2" ${listenLobbyMode === 's2' ? 'checked' : ''} onchange="window.s4PzSetListeningLobbyMode('s2')">
                    <div class="w-radio-box">
                      <span class="w-radio-title">Section 2</span>
                      <span class="w-radio-desc">Q11–Q20</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- 2. Chọn thời gian đếm ngược -->
              <div class="w-lobby-config-group">
                <label class="w-config-label">2. Thời gian làm bài (Timer):</label>
                <div class="w-time-presets" id="lLobbyTimerPresets">
                  <button type="button" class="w-time-btn ${listenLobbyTimer === 40 ? 'active' : ''}" onclick="window.s4PzSetListeningLobbyTimer(40)">40 phút (Chuẩn CBT)</button>
                  <button type="button" class="w-time-btn ${listenLobbyTimer === 20 ? 'active' : ''}" onclick="window.s4PzSetListeningLobbyTimer(20)">20 phút</button>
                  <button type="button" class="w-time-btn ${listenLobbyTimer === 0 ? 'active' : ''}" onclick="window.s4PzSetListeningLobbyTimer(0)">Đếm xuôi</button>
                </div>
              </div>

              <!-- 3. Thử âm lượng tai nghe -->
              <div class="w-lobby-config-group">
                <label class="w-config-label">3. Kiểm tra tai nghe & Âm lượng:</label>
                <div style="display:flex;align-items:center;gap:12px;background:var(--box-sub);padding:10px 14px;border-radius:10px;border:1px solid var(--border);">
                  <span>🔊</span>
                  <input type="range" min="0" max="1" step="0.05" value="1" style="flex:1;accent-color:var(--primary);cursor:pointer;" oninput="window.s4CbtSetVolume(this.value)">
                  <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4PzPlayTestSound()" style="font-size:12px;padding:4px 10px;">▶ Nghe thử âm mẫu</button>
                </div>
              </div>

              <!-- 4. Cỡ chữ bài thi -->
              <div class="w-lobby-config-group">
                <label class="w-config-label">4. Cỡ chữ bài thi (Font Scaling):</label>
                <div class="w-font-presets">
                  <button type="button" class="w-font-btn ${listenLobbyFont === 'cbt-font-std' ? 'active' : ''}" onclick="window.s4PzSetListeningLobbyFont('cbt-font-std')">A Tiêu chuẩn</button>
                  <button type="button" class="w-font-btn ${listenLobbyFont === 'cbt-font-lg' ? 'active' : ''}" onclick="window.s4PzSetListeningLobbyFont('cbt-font-lg')">A+ Lớn</button>
                  <button type="button" class="w-font-btn ${listenLobbyFont === 'cbt-font-xl' ? 'active' : ''}" onclick="window.s4PzSetListeningLobbyFont('cbt-font-xl')">A++ Rất lớn</button>
                </div>
              </div>

              <!-- 5. Gợi ý chọn đề thi khác -->
              <div class="w-lobby-config-group" style="background:rgba(37, 99, 235, 0.07);padding:10px 14px;border-radius:10px;border:1px dashed rgba(37, 99, 235, 0.3);">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                  <span style="font-size:12.5px;color:var(--text);display:flex;align-items:center;gap:6px;">
                    💡 <strong>Kho ${(window.__STUDY4_LISTEN_PZ || []).length || 133} Đề thi Listening:</strong> Chọn đề thi khác trên Sidebar hoặc bấm nút Đổi đề.
                  </span>
                  <button type="button" class="s4-cbt-ctrl-btn" onclick="window.S4PracticeZone.openListeningHub()" style="padding:4px 10px;font-size:12px;font-weight:700;">📚 Đổi đề</button>
                </div>
              </div>

              ${explainLessons.length > 0 ? `
                <!-- 6. Video bài giảng chữa chi tiết của đề này -->
                <div class="w-lobby-config-group" style="background:rgba(239, 68, 68, 0.08);padding:10px 14px;border-radius:10px;border:1px solid rgba(239, 68, 68, 0.25);">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
                    <div>
                      <span style="font-weight:800;font-size:13px;color:#ef4444;display:flex;align-items:center;gap:6px;">
                        🎬 Có Video Chữa Đề Chi Tiết (${explainLessons.length} video giải)
                      </span>
                      <span style="font-size:11.5px;color:var(--muted);display:block;margin-top:2px;">
                        Giáo viên giải thích chi tiết từng câu hỏi & phân tích bẫy nghe
                      </span>
                    </div>
                    <button type="button" class="s4-cbt-ctrl-btn" style="border-color:#ef4444;color:#ef4444;font-weight:700;background:var(--card);padding:5px 12px;" onclick="window.s4CbtExitListeningToExplain('${explainLessons[0].id}')" title="Xem video bài giảng chữa đề này">
                      ▶ Xem Video Chữa Đề
                    </button>
                  </div>
                </div>
              ` : ''}

              <!-- Nút Bắt đầu làm bài thi CTA -->
              <div class="w-lobby-cta-zone">
                <button type="button" class="w-lobby-start-btn" onclick="window.s4PzStartListeningExamFromLobby()" style="background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);box-shadow:0 4px 14px rgba(37, 99, 235, 0.4);">
                  <span>🚀 BẮT ĐẦU LÀM BÀI THI</span>
                  <small>Tự động chuyển toàn màn hình (F11 Fullscreen) & phát audio</small>
                </button>
                <button type="button" class="w-lobby-back-btn" onclick="window.s4CbtExitListeningToLesson()">
                  ← Quay lại giao diện luyện nghe & chép chính tả
                </button>
              </div>
            </div>
          </div>

          <!-- KHỐI LỊCH SỬ CÁC BÀI THI LISTENING ĐÃ NỘP -->
          <div class="w-lobby-card w-lobby-history-section" id="listeningLobbyHistoryCard">
            <div class="w-lobby-card-head" style="justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:10px;">
                <span class="w-lobby-icon">📜</span>
                <div>
                  <h3 style="margin:0;font-size:16px;font-weight:800;color:var(--text);">Lịch Sử Các Bài Thi Listening Từng Làm</h3>
                  <p style="margin:2px 0 0;font-size:12px;color:var(--muted);">Mã đề & thời gian bên trái • Điểm số Band bên phải • Xem lại bài làm & đối chiếu đáp án</p>
                </div>
              </div>
              <span class="w-lobby-chip" style="background:rgba(59,130,246,0.12);color:#2563eb;">${subs.length} bài đã nộp</span>
            </div>

            <!-- Danh sách bài làm trong Sảnh -->
            <div class="w-history-list" id="listeningLobbyHistoryList">
              ${historyListHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderListeningHub() {
    exitCbtExamMode();
    const list = window.__STUDY4_LISTEN_PZ || [];
    const books = [
      'ALL',
      'Recent Actual Tests (1–50)',
      'British Council Official & Guide',
      'IELTS Sample Tests (1–20)',
      'Simulation Tests (1–10)',
      'IELTS Collection (1–4)'
    ];
    const totalRecordings = list.reduce((acc, cur) => acc + (cur.parts ? cur.parts.length : 4), 0);
    const totalQ = list.length * 40;

    return `
      <div class="s4-pz-hub-card">
        <div class="s4-pz-hub-top">
          <div style="flex:1;min-width:260px;">
            <div class="lesson-unit-tag">🎯 IELTS LISTENING — COMPUTER-DELIVERED PRACTICE ZONE</div>
            <h1 class="lesson-title">Kho Luyện Đề IELTS Listening Thực Chiến (${list.length} Đề Full Test • ${totalRecordings} Recordings • ${totalQ.toLocaleString()} Câu hỏi)</h1>
            <p style="font-size:13.5px;color:var(--muted);margin-top:4px;">Giao diện chuẩn 100% phòng thi máy tính (Full-Screen, chia 2 khung Đề bài Note/Table/Map & Ô điền đáp án, chỉnh âm lượng, Highlight vàng & Ghi chú).</p>
          </div>
          <div class="s4-pz-hub-search">
            ${renderHubSearchBar('listening', listenHubSearch, 'Tìm tên đề (VD: Collection 1, Actual 10)...')}
          </div>
        </div>
        <div class="s4-pz-book-pills" id="s4PzListenBookPills">
          ${books.map(b => {
            const count = (b === 'ALL') ? list.length : list.filter(t => getListeningBookCategory(t.title) === b).length;
            if (b !== 'ALL' && count === 0) return '';
            return `
              <button type="button" data-book="${escapeAttr(b)}" class="s4-pz-book-pill ${listenHubBook === b ? 'active' : ''}" onclick="window.s4PzSetListeningBook('${escapeAttr(b)}')">
                ${b === 'ALL' ? `Tất cả (${list.length} đề)` : `${b} (${count} đề)`}
              </button>
            `;
          }).join('')}
        </div>
        <div id="s4PzListenResultsWrap">
          ${buildPzHubResultsHtml('listening')}
        </div>
      </div>
    `;
  }
function renderListeningExamView(testObj, allLessonsParam) {
    activeSkill = 'listening';
    if (!testObj) return renderListeningHub();
    enterCbtExamMode(false);
    listenLobbyOpen = false;
    listenHubOpen = false;
    activeListenLobbyTest = testObj;
    activeListenTestId = testObj.id;
    const allLessons = allLessonsParam || window.ALL_LESSONS || window.__ALL_LESSONS || [];
    lastListeningSessionContext = { test: testObj, allLessons };
    const parts = testObj.parts || [];
    if (activePartIdx >= parts.length) activePartIdx = 0;
    const curPart = parts[activePartIdx] || parts[0];
    const sessionKey = 'listen_' + testObj.id;
    const isSubmitted = !!listenSubmittedMap[sessionKey];

    const allQ = [];
    const partNames = [];
    parts.forEach((p, pIdx) => {
      partNames.push(`Part ${pIdx + 1}`);
      const regex = /<div class="question-wrapper"[^>]*\bdata-qid="(\d+)"[\s\S]*?<div class="question-number[^"]*"[^>]*>\s*<strong>(\d+)<\/strong>/gi;
      let m;
      while ((m = regex.exec(p.html)) !== null) {
        const qid = m[1];
        const qNum = m[2];
        const correctRaw = (testObj.answers && testObj.answers[qid]) || '';
        const g = gradeIeltsAnswer(listenAnswers[qid] || '', correctRaw);
        allQ.push({ qid, qNum, correctRaw, partIdx: pIdx, ...g });
      }
    });

    const curPartQs = allQ.filter(q => q.partIdx === activePartIdx);
    const firstQNum = curPartQs.length ? curPartQs[0].qNum : (activePartIdx * 10 + 1);
    const lastQNum = curPartQs.length ? curPartQs[curPartQs.length - 1].qNum : ((activePartIdx + 1) * 10);

    const answeredCount = allQ.filter(q => q.isAnswered).length;
    const correctCount = allQ.filter(q => q.isCorrect).length;
    const bandScore = calcIeltsBand(correctCount, allQ.length);

    if (!timerRunning && !isSubmitted && timerSeconds === 0) {
      startExamTimer(40);
    }

    const isFs = !!document.fullscreenElement;

    return `
      <div class="s4-cbt-shell ${isSubmitted ? 's4-pz-submitted' : 's4-pz-unsubmitted'}" id="s4PzListenExamRoot">
        <!-- TOP EXAM HEADER BAR (INSPERA CBT STYLE - STREAMLINED) -->
        <header class="s4-cbt-header">
          <div class="s4-cbt-header-left">
            <span class="s4-cbt-brand-badge" style="background:#2563eb;">IELTS LISTENING</span>
            <span class="s4-cbt-test-title" title="${testObj.title}">${testObj.title}</span>
            <span class="s4-cbt-mode-chip" style="background:rgba(59,130,246,0.14);color:#38bdf8;border:1px solid rgba(59,130,246,0.3);padding:3px 8px;border-radius:6px;font-size:11.5px;font-weight:700;white-space:nowrap;">
              ${parts.length > 1 ? 'Full Test (40 câu)' : 'Recording ' + (activePartIdx + 1)}
            </span>
          </div>

          <div class="s4-cbt-header-center">
            <div class="s4-cbt-timer-box" id="s4CbtTimerBox">
              <span>⏱️</span>
              <span id="s4PzTimerText">${formatTimer(timerSeconds)}</span>
              <select style="background:transparent;border:none;color:inherit;font-weight:800;font-size:12px;cursor:pointer;outline:none;" onchange="window.s4PzChangeTimer(Number(this.value))">
                <option value="40">40 phút</option>
                <option value="20">20 phút</option>
                <option value="0">Đếm xuôi</option>
              </select>
            </div>
            <span style="font-size:12.5px;font-weight:800;color:var(--muted);">Đã làm: <strong id="s4PzAnsweredCount" style="color:var(--hl-cyan);">${answeredCount}/${allQ.length}</strong></span>
          </div>

          <div class="s4-cbt-header-right">
            <div class="s4-cbt-vol-group" style="display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:8px;background:var(--box-sub);border:1px solid var(--border);" title="Thanh điều chỉnh âm lượng tai nghe">
              <span>🔊</span>
              <input type="range" min="0" max="1" step="0.05" value="1" style="width:60px;accent-color:var(--primary);cursor:pointer;" oninput="window.s4CbtSetVolume(this.value)">
            </div>
            <div class="s4-cbt-font-group" style="display:inline-flex;gap:3px;background:var(--box-sub);padding:2px;border-radius:8px;border:1px solid var(--border);" title="Chỉnh cỡ chữ bài thi">
              <button type="button" class="s4-cbt-ctrl-btn s4-cbt-font-btn ${cbtFontClass === 'cbt-font-std' ? 'active' : ''}" data-font="cbt-font-std" style="border:none;padding:4px 8px;" onclick="window.s4CbtSetFont('cbt-font-std')">A</button>
              <button type="button" class="s4-cbt-ctrl-btn s4-cbt-font-btn ${cbtFontClass === 'cbt-font-lg' ? 'active' : ''}" data-font="cbt-font-lg" style="border:none;padding:4px 8px;font-size:13.5px;" onclick="window.s4CbtSetFont('cbt-font-lg')">A+</button>
              <button type="button" class="s4-cbt-ctrl-btn s4-cbt-font-btn ${cbtFontClass === 'cbt-font-xl' ? 'active' : ''}" data-font="cbt-font-xl" style="border:none;padding:4px 8px;font-size:15px;" onclick="window.s4CbtSetFont('cbt-font-xl')">A++</button>
            </div>
            <button type="button" class="s4-cbt-ctrl-btn s4-cbt-fs-btn ${isFs ? 'active' : ''}" id="s4CbtFsBtn" onclick="window.s4CbtToggleFullscreen()" title="Toàn màn hình">
              ${isFs ? '🗗<span class="s4-cbt-hide-mob"> Thoát FS</span>' : '⛶<span class="s4-cbt-hide-mob"> Toàn màn hình</span>'}
            </button>
            ${!isSubmitted ? `
              <button type="button" class="s4-cbt-submit-btn" onclick="window.s4PzSubmitListening('${sessionKey}', ${testObj.id})">✔ Nộp bài<span class="s4-cbt-hide-mob"> & Chấm điểm</span></button>
            ` : `
              <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4PzResetListening('${sessionKey}', ${testObj.id})">🔄 Làm lại</button>
            `}
            <button type="button" class="s4-cbt-ctrl-btn" onclick="window.S4PracticeZone.openListeningHistoryModal()" title="Xem lịch sử bài thi đã nộp">📜<span class="s4-cbt-hide-mob"> Lịch sử</span></button>
            <button type="button" class="s4-cbt-ctrl-btn" onclick="window.S4PracticeZone.openListeningHub()" title="Đổi đề khác trong Kho ${(window.__STUDY4_LISTEN_PZ || []).length || 133} Đề">📚<span class="s4-cbt-hide-mob"> Đổi đề</span></button>
            <button type="button" class="s4-cbt-ctrl-btn s4-cbt-exit-btn" onclick="window.s4PzExitListeningExamToLobby()" title="Quay về Sảnh phòng thi">✕ <span class="s4-cbt-hide-mob">Về sảnh thi</span></button>
          </div>
        </header>

        <!-- AUDIO PLAYER + PART BANNER OR RESULT BANNER -->
        ${(() => {
          const allL = allLessonsParam || window.ALL_LESSONS || window.__ALL_LESSONS || [];
          const explainLessons = findExplainLessonsForListening(testObj.title, allL);
          return isSubmitted ? `
            <div class="s4-pz-result-banner" style="margin:0;border-radius:0;border-left:none;border-right:none;padding:10px 20px;">
              <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
                <div class="s4-pz-band-circle" style="min-width:58px;height:52px;border-radius:10px;background:rgba(59,130,246,0.18);border:1px solid rgba(59,130,246,0.4);">
                  <span class="s4-pz-band-num" style="font-size:20px;color:#38bdf8;">${bandScore}</span>
                  <span class="s4-pz-band-lbl" style="font-size:9px;">Band</span>
                </div>
                <div>
                  <div style="font-size:15.5px;font-weight:800;color:var(--text);">
                    Kết quả đề ${testObj.title}: Đúng <span style="color:#34d399;">${correctCount} / ${allQ.length}</span> câu (${Math.round((correctCount / Math.max(1, allQ.length)) * 100)}%)
                  </div>
                  <div style="font-size:12.5px;color:var(--muted);">
                    ✓ Đã hiển thị toàn bộ <strong>Đáp án chuẩn</strong> bên dưới từng câu hỏi của cả 4 Recording!
                  </div>
                </div>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4PzResetListening('${sessionKey}', ${testObj.id})">🔄 Làm lại bài thi</button>
                <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4CbtExitListeningToLesson()">📜 Xem Transcript & Chép chính tả</button>
                ${explainLessons.length > 0 ? `
                  <button type="button" class="s4-cbt-submit-btn" style="background:linear-gradient(135deg, #ef4444 0%, #dc2626 100%);box-shadow:0 3px 10px rgba(239,68,68,0.35);font-weight:800;" onclick="window.s4CbtExitListeningToExplain('${explainLessons[0].id}')">🎬 Xem Video Giải Chi Tiết (${explainLessons.length} video)</button>
                ` : ''}
              </div>
            </div>
          ` : '';
        })()}

        <div class="s4-cbt-part-banner" id="s4PzListenAudioSlot" style="gap:10px;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="bg-badge">🎧 Part ${activePartIdx + 1} (${curPart.name}) • Q${firstQNum}–${lastQNum}</span>
            <div style="display:inline-flex;gap:4px;">
              <button type="button" class="s4-cbt-ctrl-btn" onclick="seekPassAudio(-5)">⏪ -5s</button>
              <button type="button" class="s4-cbt-ctrl-btn" onclick="seekPassAudio(5)">⏩ +5s</button>
              <button type="button" class="s4-cbt-ctrl-btn speed-btn" data-rate="0.75" onclick="setPassSpeed(0.75)">0.75x</button>
              <button type="button" class="s4-cbt-ctrl-btn speed-btn btn-primary" data-rate="1" onclick="setPassSpeed(1)">1.0x</button>
              <button type="button" class="s4-cbt-ctrl-btn speed-btn" data-rate="1.25" onclick="setPassSpeed(1.25)">1.25x</button>
            </div>
          </div>
          <div id="s4CbtAudioMount" style="flex:1;min-width:220px;max-width:560px;"></div>
        </div>

        <!-- MOBILE VIEW SWITCHER (ONLY VISIBLE ON SCREENS <= 820px) -->
        <div class="s4-cbt-mobile-switcher" id="s4CbtMobileSwitcher">
          <button type="button" class="s4-cbt-mob-tab ${cbtMobileView === 'split' ? 'active' : ''}" data-mview="split" onclick="window.s4CbtSetMobileView('split')">⬒ Chia đôi 50/50</button>
          <button type="button" class="s4-cbt-mob-tab ${cbtMobileView === 'left' ? 'active' : ''}" data-mview="left" onclick="window.s4CbtSetMobileView('left')">📋 Đề bài</button>
          <button type="button" class="s4-cbt-mob-tab ${cbtMobileView === 'right' ? 'active' : ''}" data-mview="right" onclick="window.s4CbtSetMobileView('right')">✍️ Đáp án (<span id="s4CbtMobAnsCount">${answeredCount}/${allQ.length}</span>)</button>
          <button type="button" class="s4-cbt-mob-tab s4-cbt-mob-hl-btn" onmousedown="event.preventDefault()" onclick="window.s4CbtMobileQuickHighlight()" title="Tô vàng cụm từ đang bôi đen">🖍️</button>
        </div>

        <!-- RESIZABLE 2-COLUMN SPLIT SCREEN (LEFT: NOTES/TABLES/MAPS | RIGHT: ANSWER SHEET) -->
        <div class="s4-cbt-split-area ${cbtFontClass} mob-view-${cbtMobileView}" id="s4CbtSplitArea" lang="en">
          <div class="s4-cbt-pane-left" id="s4CbtLeftPane" style="--cbt-left-pct:${cbtLeftPct}%;">
            <div class="syn-col-title">
              <span>📋 PART ${activePartIdx + 1}: QUESTION PROMPTS / NOTES / TABLES / MAPS</span>
              <span>Bôi đen chữ để Highlight / Note</span>
            </div>
            <div id="s4CbtListenLeftBody"></div>
          </div>

          <div class="s4-cbt-resizer" id="s4CbtResizer" title="Nắm kéo sang trái/phải để thay đổi độ rộng 2 khung">
            <div class="s4-cbt-resizer-grip"></div>
          </div>

          <div class="s4-cbt-pane-right s4-pz-container" id="s4CbtRightPane" lang="en">
            <div class="syn-col-title">
              <span>✍️ ANSWER SHEET — QUESTIONS ${firstQNum}–${lastQNum}</span>
              <span>${isSubmitted ? 'Đã chấm điểm & hiện đáp án' : 'Gõ đáp án & nhấn Enter qua câu kế'}</span>
            </div>
            <div id="s4CbtListenRightBody"></div>
          </div>
        </div>

        <!-- Hidden raw staging container to parse and split into Left & Right panes -->
        <div id="s4CbtListenRawStaging" style="display:none;">
          ${curPart.html || ''}
        </div>

        <!-- BOTTOM QUESTION PALETTE BAR (PART 1..4 | Q1..Q40 | REVIEW FLAG) -->
        ${buildBottomPaletteHtml(allQ, partNames, 'window.s4PzSelectListeningPart', isSubmitted)}
      </div>
    `;
  }

  function mountListeningDomEvents(testObj) {
    if (!testObj) return;
    const parts = testObj.parts || [];
    const curPart = parts[activePartIdx] || parts[0];
    const sessionKey = 'listen_' + testObj.id;
    const isSubmitted = !!listenSubmittedMap[sessionKey];

    const audioMount = document.getElementById('s4CbtAudioMount') || document.getElementById('s4PzListenAudioSlot');
    const passAudio = document.getElementById('globalPassAudio');
    if (audioMount && passAudio && curPart && curPart.audioUrl) {
      if (passAudio.getAttribute('src') !== curPart.audioUrl) {
        passAudio.src = curPart.audioUrl;
      }
      passAudio.style.display = 'block';
      passAudio.style.width = '100%';
      passAudio.style.height = '34px';
      passAudio.controls = true;
      audioMount.appendChild(passAudio);
    }

    // Split raw staging HTML into Left Pane (Notes/Tables/Maps/Context) and Right Pane (Question Inputs/MCQs)
    const staging = document.getElementById('s4CbtListenRawStaging');
    const leftBody = document.getElementById('s4CbtListenLeftBody');
    const rightBody = document.getElementById('s4CbtListenRightBody');

    if (staging && leftBody && rightBody) {
      leftBody.innerHTML = '';
      rightBody.innerHTML = '';

      const groups = [...staging.querySelectorAll('.question-group-wrapper')];
      groups.forEach((gEl, gIdx) => {
        const qWrappers = [...gEl.querySelectorAll('.question-wrapper[data-qid]')];
        const qNums = qWrappers.map(qw => (qw.querySelector('.question-number')?.innerText || '').trim()).filter(Boolean);
        const rangeTitle = qNums.length > 1 ? `Questions ${qNums[0]}–${qNums[qNums.length - 1]}` : (qNums.length === 1 ? `Question ${qNums[0]}` : `Group ${gIdx + 1}`);

        // Extract context blocks for Left Pane
        const ctxEls = [...gEl.querySelectorAll('.context-content')];
        const ctxHtml = ctxEls.map(c => c.innerHTML).join('<div style="height:10px;"></div>');

        const leftCard = document.createElement('div');
        leftCard.style.cssText = 'margin-bottom:20px;padding-bottom:16px;border-bottom:1px dashed var(--border);';
        leftCard.innerHTML = `
          <div style="font-size:12.5px;font-weight:900;color:var(--hl-gold);text-transform:uppercase;margin-bottom:8px;">📌 ${rangeTitle}</div>
          <div class="context-content">${ctxHtml || '<em style="color:var(--muted);">Nghe và chọn đáp án đúng ở khung bên phải.</em>'}</div>
        `;
        leftBody.appendChild(leftCard);

        // Build clean group wrapper for Right Pane containing all question-wrappers
        const rightGroup = document.createElement('div');
        rightGroup.className = 'question-group-wrapper';
        const hiddenCtx = document.createElement('div');
        hiddenCtx.className = 'context-content';
        hiddenCtx.style.display = 'none';
        hiddenCtx.innerHTML = ctxHtml;
        rightGroup.appendChild(hiddenCtx);

        const rightHeader = document.createElement('div');
        rightHeader.style.cssText = 'font-size:12.5px;font-weight:900;color:var(--hl-cyan);text-transform:uppercase;margin-bottom:10px;';
        rightHeader.textContent = `✍️ ${rangeTitle}`;
        rightGroup.appendChild(rightHeader);

        // Also preserve any option pools (e.g. A-H boxes) in both Left and Right panes
        const pools = [...gEl.querySelectorAll('[data-pool-key]')];
        if (pools.length > 0) {
          const poolCloneWrap = document.createElement('div');
          poolCloneWrap.style.display = 'none';
          pools.forEach(p => poolCloneWrap.appendChild(p.cloneNode(true)));
          rightGroup.appendChild(poolCloneWrap);
        }

        qWrappers.forEach(qw => {
          rightGroup.appendChild(qw);
        });
        rightBody.appendChild(rightGroup);
      });
    }

    const rootEl = document.getElementById('s4PzListenExamRoot');
    if (rootEl) {
      enhanceQuestionsDom(rootEl, listenAnswers, () => {
        saveListenAnswers();
      }, isSubmitted);
    }

    initSplitResizer();
    bindHighlightPopupEvents();
  }

  window.s4CbtExitListeningToLesson = function () {
    stopListeningPassAudio(true);
    exitCbtExamMode();
    const targetKey = activeListenLobbyTest ? parseIeltsTestIdentity(activeListenLobbyTest.title, { skill: 'listening' })?.key : null;
    const allL = window.ALL_LESSONS || window.__ALL_LESSONS || [];
    const curKey = (window.currentLesson && window.currentLesson.unitId === 'u_4')
      ? parseIeltsTestIdentity(window.currentLesson.title, { skill: 'listening' })?.key
      : null;
    if (targetKey && curKey !== targetKey && allL.length) {
      const matchedU4 = allL.find(x => x.unitId === 'u_4' && parseIeltsTestIdentity(x.title, { skill: 'listening' })?.key === targetKey);
      if (matchedU4 && typeof window.selectLesson === 'function') {
        if (typeof window.exitListeningPzMode === 'function') window.exitListeningPzMode();
        window.selectLesson(matchedU4.id);
        return;
      }
    }
    if (typeof window.exitListeningPzMode === 'function') {
      window.exitListeningPzMode();
    } else {
      listenHubOpen = true;
      if (typeof window.renderMain === 'function') window.renderMain();
    }
  };

  window.s4PzSetListeningBook = function (b) {
    listenHubBook = b;
    const pillsEl = document.getElementById('s4PzListenBookPills');
    if (pillsEl) {
      pillsEl.querySelectorAll('.s4-pz-book-pill').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-book') === b);
      });
    }
    if (!updatePzHubResults('listening') && typeof window.renderMain === 'function') {
      window.renderMain();
    }
  };
  window.s4PzFilterListeningHub = function (q) {
    window.s4PzHubSearchInput('listening', q);
  };
  window.s4PzStartListeningTest = function (testId, partIdx) {
    listenHubOpen = false;
    activeListenTestId = Number(testId);
    activePartIdx = partIdx || 0;
    enterCbtExamMode(true);
    startExamTimer(40);
    if (typeof window.renderMain === 'function') window.renderMain();
  };
  window.s4PzSelectListeningPart = function (idx, scrollQid) {
    activePartIdx = idx;
    if (typeof window.renderMain === 'function') window.renderMain();
    if (scrollQid) {
      setTimeout(() => window.s4PzScrollToQuestion(scrollQid, idx), 60);
    }
  };
  window.s4PzSubmitListening = function (sessionKey, testId) {
    listenSubmittedMap[sessionKey] = true;
    stopExamTimer();

    const list = window.__STUDY4_LISTEN_PZ || [];
    const target = list.find(t => t.id === Number(testId)) || activeListenLobbyTest;
    if (target) {
      const parts = target.parts || [];
      const allQ = [];
      parts.forEach((p, pIdx) => {
        const regex = /<div class="question-wrapper"[^>]*\bdata-qid="(\d+)"[\s\S]*?<div class="question-number[^"]*"[^>]*>\s*<strong>(\d+)<\/strong>/gi;
        let m;
        while ((m = regex.exec(p.html)) !== null) {
          const qid = m[1];
          const qNum = m[2];
          const correctRaw = (target.answers && target.answers[qid]) || '';
          const g = gradeIeltsAnswer(listenAnswers[qid] || '', correctRaw);
          allQ.push({ qid, qNum, correctRaw, partIdx: pIdx, ...g });
        }
      });

      const correctCount = allQ.filter(q => q.isCorrect).length;
      const bandScore = calcIeltsBand(correctCount, allQ.length);
      saveListeningSubmissionRecord({
        id: 'lis_sub_' + Date.now(),
        testId: target.id,
        sessionKey: sessionKey,
        testTitle: target.title,
        date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        duration: '40 phút',
        bandScore: String(bandScore),
        correctCount: correctCount,
        totalQuestions: allQ.length,
        accuracy: Math.round((correctCount / Math.max(1, allQ.length)) * 100),
        timestamp: Date.now()
      });
    }

    if (typeof window.renderMain === 'function') window.renderMain();
  };
  window.s4PzResetListening = function (sessionKey, testId) {
    delete listenSubmittedMap[sessionKey];
    const list = window.__STUDY4_LISTEN_PZ || [];
    const testObj = list.find(t => t.id === Number(testId));
    if (testObj && testObj.answers) {
      Object.keys(testObj.answers).forEach(qid => delete listenAnswers[qid]);
      saveListenAnswers();
    }
    startExamTimer(40);
    if (typeof window.renderMain === 'function') window.renderMain();
  };

  // =========================================================================
  // 7. PUBLIC API EXPOSED ON window.S4PracticeZone
  // =========================================================================
  window.S4PracticeZone = {
    gradeIeltsAnswer,
    calcIeltsBand,
    enterCbtExamMode,
    exitCbtExamMode,
    isReadingLobbyOpen: () => readLobbyOpen,
    renderReadingLobby,
    openReadingLobby: window.s4PzOpenReadingLobby,
    closeReadingLobby: () => { readLobbyOpen = false; },
    setActiveReadLobbyLesson: (les) => { activeReadLobbyLesson = les; },
    getActiveReadLobbyLesson: () => activeReadLobbyLesson,
    getActiveReadLobbyTest: () => activeReadLobbyTest,
    openReadingHistoryModal: window.openReadingHistoryModal,
    closeReadingHistoryModal: window.closeReadingHistoryModal,
    filterReadingHistoryModal: window.filterReadingHistoryModal,
    getReadingSubmissions,
    saveReadingSubmissionRecord,
    isReadingHubOpen: () => readHubOpen,
    setReadingHubOpen: (flag) => {
      readHubOpen = !!flag;
      if (flag) {
        readLobbyOpen = false;
        exitCbtExamMode();
      }
    },
    openReadingHub: function () {
      exitCbtExamMode();
      readLobbyOpen = false;
      readHubOpen = true;
      if (typeof window.renderMain === 'function') window.renderMain();
    },
    openReadingLobbyDirect: function () {
      exitCbtExamMode();
      readHubOpen = false;
      const all = window.ALL_LESSONS || [];
      const current = window.currentLesson;
      const target = (current && current.unitId === 'u_2') ? current : (all.find(l => l.unitId === 'u_2') || all[0]);
      if (target && typeof window.s4PzOpenReadingLobby === 'function') {
        window.s4PzOpenReadingLobby(target.id, true);
      }
      if (typeof window.renderMain === 'function') window.renderMain();
    },
    parseIeltsTestIdentity,
    renderReadingHub,
    renderReadingPracticeView,
    mountReadingDomEvents,
    ensureReadingPzLoaded,
    resolveReadingPzLesson,
    findExplainLessonsForReading,
    findReadingSourcesForExplain,
    findReadingPzTestByKey,

    // LISTENING PUBLIC API
    ensureListeningPzLoaded,
    findExplainLessonsForListening,
    findListeningSourcesForExplain,
    findListeningPzTestByKey,
    hasListeningPzKey,
    isListeningLobbyOpen: () => listenLobbyOpen,
    renderListeningLobby,
    openListeningLobby: function (testId) {
      stopListeningPassAudio(true);
      exitCbtExamMode();
      listenLobbyOpen = true;
      listenHubOpen = false;
      const list = window.__STUDY4_LISTEN_PZ || [];
      if (testId) {
        const found = list.find(t => t.id === Number(testId));
        if (found) {
          activeListenLobbyTest = found;
          activeListenTestId = found.id;
        }
      }
      if (typeof window.renderMain === 'function') window.renderMain();
    },
    closeListeningLobby: () => { listenLobbyOpen = false; },
    setActiveListenLobbyTest: (test) => {
      activeListenLobbyTest = test;
      if (test) activeListenTestId = test.id;
    },
    openListeningHistoryModal: window.openListeningHistoryModal,
    closeListeningHistoryModal: window.closeListeningHistoryModal,
    filterListeningHistoryModal: window.filterListeningHistoryModal,
    getListeningSubmissions,
    saveListeningSubmissionRecord,
    isListeningHubOpen: () => listenHubOpen,
    setListeningHubOpen: (flag) => {
      listenHubOpen = !!flag;
      if (flag) {
        listenLobbyOpen = false;
        exitCbtExamMode();
      }
    },
    getActiveListeningTest: (currentLesson) => {
      const list = window.__STUDY4_LISTEN_PZ || [];
      if (activeListenTestId) {
        const found = list.find(t => t.id === Number(activeListenTestId));
        if (found) return found;
      }
      return findListeningTestForLesson(currentLesson);
    },
    setActiveListeningTestForLesson: (lesson) => {
      const m = (lesson?.title || '').match(/Section\s*(\d+)/i);
      const t = findListeningTestForLesson(lesson);
      if (!t) return false;
      activePartIdx = m ? Math.max(0, parseInt(m[1], 10) - 1) : 0;
      activeListenTestId = t.id;
      activeListenLobbyTest = t;
      listenHubOpen = false;
      listenLobbyOpen = true;
      exitCbtExamMode();
      if (typeof window.renderMain === 'function') window.renderMain();
      return true;
    },
    openListeningHub: function () {
      stopListeningPassAudio(true);
      exitCbtExamMode();
      listenLobbyOpen = false;
      listenHubOpen = true;
      if (typeof window.renderMain === 'function') window.renderMain();
    },
    renderListeningHub,
    renderListeningExamView,
    mountListeningDomEvents
  };

  // Tự động đồng bộ số lượng bài làm trên Topbar khi tải trang
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        updateTopReadingHistoryCount(); updateTopListeningHistoryCount();
      });
    } else {
      updateTopReadingHistoryCount(); updateTopListeningHistoryCount();
    }
  }
})();
