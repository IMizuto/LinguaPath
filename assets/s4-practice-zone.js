/**
 * S4PracticeZone — Official IELTS on Computer (Inspera CBT) Simulator & Auto-Grading Engine
 * Supports Reading (106 Full Tests / 318 Passages / 4,240 Questions)
 * and Listening (169 Full Tests / 676 Recordings / 6,760 Questions)
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
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      showCbtToast('🖍️ Hãy bôi đen một đoạn văn bản trước rồi bấm nút để Highlight!');
      return;
    }
    applySelectionHighlight(false);
    hideHighlightPopup();
  };
  window.s4CbtMobileQuickHighlight = window.s4CbtQuickHighlight;

  window.s4CbtQuickNote = function () {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
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

  function initSplitResizer() {
    const resizer = document.getElementById('s4CbtResizer');
    const splitArea = document.getElementById('s4CbtSplitArea');
    const leftPane = document.getElementById('s4CbtLeftPane');
    if (!resizer || !splitArea || !leftPane) return;

    leftPane.style.setProperty('--cbt-left-pct', cbtLeftPct + '%');

    let isDragging = false;
    const startDrag = (e) => {
      isDragging = true;
      resizer.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    };

    const doDrag = (clientX) => {
      if (!isDragging) return;
      const rect = splitArea.getBoundingClientRect();
      if (!rect.width) return;
      const relX = clientX - rect.left;
      const pct = Math.max(22, Math.min(78, Math.round((relX / rect.width) * 100)));
      cbtLeftPct = pct;
      leftPane.style.setProperty('--cbt-left-pct', pct + '%');
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      resizer.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    // Mouse drag
    resizer.onmousedown = (e) => {
      e.preventDefault();
      startDrag(e);
    };
    window.addEventListener('mousemove', (e) => {
      if (isDragging) doDrag(e.clientX);
    });
    window.addEventListener('mouseup', endDrag);

    // Touch drag on mobile / tablet landscape
    resizer.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        startDrag(e);
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches && e.touches.length === 1) {
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

  function applySelectionHighlight(withNote) {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    let noteText = '';
    if (withNote) {
      noteText = window.prompt('📝 Nhập nội dung ghi chú cho cụm từ này:', '') || '';
      if (!noteText.trim()) return;
    }
    const span = document.createElement('span');
    span.className = withNote ? 's4-cbt-user-note' : 's4-cbt-user-hl';
    if (withNote) {
      span.title = '📝 Ghi chú: ' + noteText;
      span.setAttribute('data-note', noteText);
      span.onclick = (e) => {
        e.stopPropagation();
        const cur = span.getAttribute('data-note') || '';
        const updated = window.prompt('📝 Xem / Sửa ghi chú (Xóa trắng để gỡ):', cur);
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
      range.surroundContents(span);
      sel.removeAllRanges();
    } catch (e) {
      // Cross-element selection fallback
      try {
        const frag = range.extractContents();
        span.appendChild(frag);
        range.insertNode(span);
        sel.removeAllRanges();
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
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
  }

  function bindHighlightPopupEvents() {
    const splitArea = document.getElementById('s4CbtSplitArea');
    if (!splitArea) return;
    ensureHighlightPopup();
    const showHlIfSelected = (e) => {
      if (e && e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT')) {
        hideHighlightPopup();
        return;
      }
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.toString().trim()) {
          hideHighlightPopup();
          return;
        }
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (!rect || (rect.width === 0 && rect.height === 0)) {
          hideHighlightPopup();
          return;
        }
        hlPopupEl.style.display = 'inline-flex';
        const top = Math.max(8, rect.top - 44);
        const left = Math.max(8, Math.min(window.innerWidth - 230, rect.left + rect.width / 2 - 95));
        hlPopupEl.style.top = top + 'px';
        hlPopupEl.style.left = left + 'px';
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
        const correctRaw = corrEl ? corrEl.innerText.replace(/^Đáp án đúng:\s*/i, '').replace(/^✓\s*Đáp án chuẩn:\s*/i, '').trim() : '';
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
  // 5. READING PRACTICE ZONE ENGINE (318 PASSAGES / 106 FULL TESTS)
  // =========================================================================
  let activeSkill = 'reading';
  let activePartIdx = 0;
  let readSubmittedMap = {};
  let readFullTestMode = true; // Default to Full Test 3 Passages in CBT mode
  let readHubOpen = false;
  let readHubBook = 'ALL';
  let readHubSearch = '';

  function getReadingTestSiblings(lesson, allLessons) {
    if (!lesson) return [lesson];
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

  function getReadingFullTestsCatalog(allLessons) {
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
    if (/Collection/i.test(s)) return 'IELTS Collection (1–6)';
    if (/Simulation/i.test(s)) return 'Simulation Tests (1–10)';
    if (/BC\s*Test|British Council/i.test(s)) return 'British Council (BC 1–9)';
    if (/Sample\s*Test/i.test(s)) return 'IELTS Sample Tests (1–20)';
    if (/Practice\s*Set/i.test(s)) return 'Practice Sets (1–15)';
    return 'Bộ đề khác';
  }

  function collectQuestionsFromSynHtml(rightHtml) {
    const list = [];
    if (!rightHtml) return list;
    const regex = /<div class="question-wrapper"\s+data-qid="(\d+)"[\s\S]*?<div class="question-number">\s*<strong>(\d+)<\/strong>[\s\S]*?<div class="mt-2 text-success question-correct">([\s\S]*?)<\/div>/gi;
    let m;
    while ((m = regex.exec(rightHtml)) !== null) {
      const qid = m[1];
      const qNum = m[2];
      const correctRaw = m[3].replace(/<[^>]+>/g, '').trim();
      const g = gradeIeltsAnswer(readAnswers[qid] || '', correctRaw);
      list.push({ qid, qNum, correctRaw, userVal: readAnswers[qid] || '', ...g });
    }
    return list;
  }

  function renderReadingPracticeView(currentLesson, allLessons) {
    activeSkill = 'reading';
    enterCbtExamMode(false);
    const synMap = window.__STUDY4_READ_SYNONYMS || {};
    const siblings = getReadingTestSiblings(currentLesson, allLessons);
    const isFull = readFullTestMode && siblings.length > 1;
    const activeLessons = isFull ? siblings : [currentLesson];
    if (activePartIdx >= activeLessons.length) activePartIdx = 0;
    const targetLesson = activeLessons[activePartIdx] || currentLesson;
    const synData = synMap[targetLesson.id] || { leftHtml: '', rightHtml: '', pairs: [] };

    const sessionKey = isFull ? ('full_' + siblings[0].id) : ('single_' + currentLesson.id);
    const isSubmitted = !!readSubmittedMap[sessionKey];

    const allQ = [];
    const partNames = [];
    activeLessons.forEach((les, pIdx) => {
      partNames.push(isFull ? `Part ${pIdx + 1}` : 'Passage');
      const sd = synMap[les.id] || {};
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
    const explainLessons = (allLessons || []).filter(x =>
      x.unitId === 'u_4' && ((x.group || '').toLowerCase().includes(testPrefix.toLowerCase()) || (x.title || '').toLowerCase().includes(testPrefix.toLowerCase()))
    );

    const isFs = !!document.fullscreenElement;

    return `
      <div class="s4-cbt-shell ${isSubmitted ? 's4-pz-submitted' : 's4-pz-unsubmitted'}" id="s4PzExamRoot">
        <!-- TOP EXAM HEADER BAR (INSPERA CBT STYLE) -->
        <header class="s4-cbt-header">
          <div class="s4-cbt-header-left">
            <span class="s4-cbt-brand-badge">IELTS READING</span>
            <span class="s4-cbt-test-title" title="${targetLesson.title}">${isFull ? testPrefix : targetLesson.title}</span>
            ${siblings.length > 1 ? `
              <button type="button" class="s4-cbt-ctrl-btn ${!isFull ? 'active' : ''}" onclick="window.s4PzToggleReadingFullMode(false)">1 Passage</button>
              <button type="button" class="s4-cbt-ctrl-btn ${isFull ? 'active' : ''}" onclick="window.s4PzToggleReadingFullMode(true)">Full Test (40 câu)</button>
            ` : ''}
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
            <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4CbtQuickHighlight()" title="Tô vàng cụm từ đang chọn">🖍️<span class="s4-cbt-hide-mob"> Highlight</span></button>
            <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4CbtQuickNote()" title="Thêm ghi chú cho cụm từ đang chọn">📝<span class="s4-cbt-hide-mob"> Note</span></button>
            <button type="button" class="s4-cbt-ctrl-btn s4-cbt-fs-btn ${isFs ? 'active' : ''}" id="s4CbtFsBtn" onclick="window.s4CbtToggleFullscreen()">
              ${isFs ? '🗗<span class="s4-cbt-hide-mob"> Thoát Fullscreen (Esc)</span>' : '⛶<span class="s4-cbt-hide-mob"> Toàn màn hình (F11)</span>'}
            </button>
            ${!isSubmitted ? `
              <button type="button" class="s4-cbt-submit-btn" onclick="window.s4PzSubmitReading('${sessionKey}')">✔ Nộp bài<span class="s4-cbt-hide-mob"> & Chấm điểm</span></button>
            ` : `
              <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4PzResetReading('${sessionKey}')">🔄 Làm lại</button>
            `}
            <button type="button" class="s4-cbt-ctrl-btn" onclick="window.S4PracticeZone.openReadingHub()" title="Đổi đề khác trong Kho 106 Đề">📚 <span class="s4-cbt-hide-mob">Đổi đề</span></button>
            <button type="button" class="s4-cbt-ctrl-btn s4-cbt-exit-btn" onclick="window.s4CbtExitReadingToLesson()" title="Thoát chế độ phòng thi về giao diện học từ vựng">✕ Thoát</button>
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
                  💡 Đã mở khóa <strong>Đáp án chuẩn</strong> và <strong>Dẫn chứng Paraphrase Q1..Q40</strong> bên bài đọc! Bấm nhãn <strong>Q1, Q2...</strong> để đối chiếu.
                </div>
              </div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="s4-cbt-ctrl-btn" onclick="window.s4CbtExitReadingToMode('synonyms')">🔄 Xem Bảng Paraphrase</button>
              ${explainLessons.length > 0 ? `
                <button class="s4-cbt-submit-btn" onclick="window.s4CbtExitReadingToExplain('${explainLessons[0].id}')">🎬 Xem Video Giải Chi Tiết</button>
              ` : ''}
            </div>
          </div>
        ` : `
          <div class="s4-cbt-part-banner">
            <div>
              <strong>Part ${activePartIdx + 1} (${targetLesson.title.split(/[|-]/).pop().trim()}):</strong>
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
          <button type="button" class="s4-cbt-mob-tab s4-cbt-mob-hl-btn" onclick="window.s4CbtMobileQuickHighlight()" title="Tô vàng cụm từ đang bôi đen">🖍️</button>
        </div>

        <!-- RESIZABLE 2-COLUMN SPLIT SCREEN (LEFT: PASSAGE | RIGHT: QUESTIONS) -->
        <div class="s4-cbt-split-area ${cbtFontClass} mob-view-${cbtMobileView}" id="s4CbtSplitArea" lang="en">
          <div class="s4-cbt-pane-left" id="s4CbtLeftPane" style="--cbt-left-pct:${cbtLeftPct}%;">
            <div class="syn-col-title">
              <span>📖 READING PASSAGE ${activePartIdx + 1}: ${targetLesson.title.split(/[|-]/).pop().trim()}</span>
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
    if (typeof window.setMode === 'function') window.setMode('passage');
  };
  window.s4CbtExitReadingToMode = function (m) {
    exitCbtExamMode();
    if (typeof window.setMode === 'function') window.setMode(m);
  };
  window.s4CbtExitReadingToExplain = function (lessonId) {
    exitCbtExamMode();
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
    if (typeof window.renderMain === 'function') window.renderMain();
  };

  window.s4PzResetReading = function (sessionKey) {
    delete readSubmittedMap[sessionKey];
    const rootEl = document.getElementById('s4PzExamRoot');
    if (rootEl) {
      rootEl.querySelectorAll('.question-wrapper[data-qid]').forEach(qw => {
        const qid = qw.getAttribute('data-qid');
        delete readAnswers[qid];
      });
      saveReadAnswers();
    }
    startExamTimer(readFullTestMode ? 60 : 20);
    if (typeof window.renderMain === 'function') window.renderMain();
  };

  function renderReadingHub(allLessons) {
    exitCbtExamMode();
    const tests = getReadingFullTestsCatalog(allLessons);
    const books = ['ALL', 'IELTS Collection (1–6)', 'Simulation Tests (1–10)', 'British Council (BC 1–9)', 'IELTS Sample Tests (1–20)', 'Practice Sets (1–15)'];
    const filtered = tests.filter(t => {
      if (readHubBook !== 'ALL' && t.book !== readHubBook) return false;
      if (readHubSearch && !t.title.toLowerCase().includes(readHubSearch.toLowerCase())) return false;
      return true;
    });

    return `
      <div class="s4-pz-hub-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
          <div>
            <div class="lesson-unit-tag">🎯 IELTS ACADEMIC READING — COMPUTER-DELIVERED PRACTICE ZONE</div>
            <h1 class="lesson-title">Kho Luyện Đề Reading Thực Chiến (${tests.length} Đề Full Test • 318 Passages • 4,240 Câu hỏi)</h1>
            <p style="font-size:13.5px;color:var(--muted);margin-top:4px;">Giao diện chuẩn 100% phần mềm thi trên máy tính (Inspera Full-Screen, chia đôi màn hình kéo thả, Highlight vàng & Ghi chú, chấm Band Score tự động).</p>
          </div>
          <input type="text" class="s4-pz-text-input" style="max-width:260px;" placeholder="🔍 Tìm tên bộ đề (VD: Collection 1)..." value="${readHubSearch.replace(/"/g, '&quot;')}" oninput="window.s4PzFilterReadingHub(this.value)">
        </div>
        <div class="s4-pz-book-pills">
          ${books.map(b => `
            <button class="s4-pz-book-pill ${readHubBook === b ? 'active' : ''}" onclick="window.s4PzSetReadingBook('${b}')">
              ${b === 'ALL' ? `Tất cả (${tests.length} đề)` : b}
            </button>
          `).join('')}
        </div>
        <div class="s4-pz-test-grid">
          ${filtered.map(t => `
            <div class="s4-pz-test-item">
              <div>
                <div style="font-size:11px;font-weight:800;color:var(--hl-cyan);text-transform:uppercase;">${t.book}</div>
                <div style="font-size:15px;font-weight:800;color:var(--text);margin-top:3px;">${t.title}</div>
                <div style="font-size:12px;color:var(--muted);margin-top:3px;">${t.passages.length} Passages • 40 câu hỏi • 60 phút • Full-Screen CBT</div>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;">
                <button class="btn btn-primary" style="flex:1;justify-content:center;" onclick="window.s4PzStartReadingTest('${t.passages[0].id}', true)">
                  ⛶ Thi Full Test (Full-Screen)
                </button>
                ${t.passages.map((p, idx) => `
                  <button class="btn" style="padding:6px 10px;font-size:12px;" onclick="window.s4PzStartReadingTest('${p.id}', false)" title="${p.title}">
                    P${idx + 1}
                  </button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  window.s4PzSetReadingBook = function (b) {
    readHubBook = b;
    if (typeof window.renderMain === 'function') window.renderMain();
  };
  window.s4PzFilterReadingHub = function (q) {
    readHubSearch = q;
    if (typeof window.renderMain === 'function') window.renderMain();
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
  // 6. LISTENING PRACTICE ZONE ENGINE (169 FULL TESTS / 676 RECORDINGS / 6,760 QUESTIONS)
  // =========================================================================
  let listenPzLoading = false;
  let activeListenTestId = null;
  let listenSubmittedMap = {};
  let listenHubOpen = true;
  let listenHubBook = 'ALL';
  let listenHubSearch = '';

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
    s.src = 'data/listening_practice_zone.js?v=21';
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
    const s = title || '';
    if (/Collection/i.test(s)) return 'IELTS Collection (1–6)';
    if (/Simulation/i.test(s)) return 'Simulation Tests (1–10)';
    if (/Actual\s*test/i.test(s)) return 'Recent Actual Tests (1–50)';
    if (/Practice\s*Set/i.test(s)) return 'Practice Sets (1–20)';
    if (/Sample/i.test(s)) return 'IELTS Sample Tests (1–20)';
    if (/BC|British Council|Official/i.test(s)) return 'BC & Official Guide';
    return 'Bộ đề khác';
  }

  function findListeningTestForLesson(lesson) {
    const list = window.__STUDY4_LISTEN_PZ || [];
    if (!lesson || !list.length) return null;
    const rawTitle = (lesson.title || '').split('|')[0].trim();
    const normT = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    for (const t of list) {
      const cand = t.title.toLowerCase().replace(/\blistening\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
      const nClean = normT.replace(/\blistening\b/g, '').replace(/\s+/g, ' ').trim();
      if (cand === nClean || t.title.toLowerCase().includes(rawTitle.toLowerCase())) {
        return t;
      }
    }
    const mCol = rawTitle.match(/Collection\s*(\d+)\s*Test\s*(\d+)/i);
    if (mCol) {
      return list.find(t => new RegExp(`Collection\\s*${mCol[1]}.*Test\\s*${mCol[2]}\\b`, 'i').test(t.title)) || null;
    }
    const mPs = rawTitle.match(/Practice\s*Set\s*(\d+).*Test\s*(\d+)/i);
    if (mPs) {
      return list.find(t => new RegExp(`Practice\\s*Set\\s*${mPs[1]}.*Test\\s*${mPs[2]}\\b`, 'i').test(t.title)) || null;
    }
    const mSim = rawTitle.match(/Simulation.*Test\s*(\d+)/i);
    if (mSim) {
      return list.find(t => new RegExp(`Simulation.*Test\\s*${mSim[1]}\\b`, 'i').test(t.title)) || null;
    }
    const mSam = rawTitle.match(/Sample.*Test\s*(\d+)/i);
    if (mSam) {
      return list.find(t => new RegExp(`(Sample|IT\\d).*Test\\s*${mSam[1]}\\b`, 'i').test(t.title)) || null;
    }
    return list[0] || null;
  }

  function renderListeningHub() {
    exitCbtExamMode();
    const list = window.__STUDY4_LISTEN_PZ || [];
    const books = [
      'ALL',
      'IELTS Collection (1–6)',
      'Simulation Tests (1–10)',
      'Recent Actual Tests (1–50)',
      'Practice Sets (1–20)',
      'BC & Official Guide'
    ];
    const filtered = list.filter(t => {
      const b = getListeningBookCategory(t.title);
      if (listenHubBook !== 'ALL' && b !== listenHubBook) return false;
      if (listenHubSearch && !t.title.toLowerCase().includes(listenHubSearch.toLowerCase())) return false;
      return true;
    });

    return `
      <div class="s4-pz-hub-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
          <div>
            <div class="lesson-unit-tag">🎯 IELTS LISTENING — COMPUTER-DELIVERED PRACTICE ZONE</div>
            <h1 class="lesson-title">Kho Luyện Đề IELTS Listening Thực Chiến (${list.length} Đề Full Test • 676 Recordings • 6,760 Câu hỏi)</h1>
            <p style="font-size:13.5px;color:var(--muted);margin-top:4px;">Giao diện chuẩn 100% phòng thi máy tính (Full-Screen, chia 2 khung Đề bài Note/Table/Map & Ô điền đáp án, chỉnh âm lượng, Highlight vàng & Ghi chú).</p>
          </div>
          <input type="text" class="s4-pz-text-input" style="max-width:260px;" placeholder="🔍 Tìm tên đề (VD: Collection 1, Actual 10)..." value="${listenHubSearch.replace(/"/g, '&quot;')}" oninput="window.s4PzFilterListeningHub(this.value)">
        </div>
        <div class="s4-pz-book-pills">
          ${books.map(b => `
            <button class="s4-pz-book-pill ${listenHubBook === b ? 'active' : ''}" onclick="window.s4PzSetListeningBook('${b}')">
              ${b === 'ALL' ? `Tất cả (${list.length} đề)` : b}
            </button>
          `).join('')}
        </div>
        <div class="s4-pz-test-grid">
          ${filtered.map(t => `
            <div class="s4-pz-test-item">
              <div>
                <div style="font-size:11px;font-weight:800;color:var(--hl-cyan);text-transform:uppercase;">${getListeningBookCategory(t.title)}</div>
                <div style="font-size:15px;font-weight:800;color:var(--text);margin-top:3px;">${t.title}</div>
                <div style="font-size:12px;color:var(--muted);margin-top:3px;">4 Recordings • 40 câu hỏi • Full-Screen CBT</div>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;">
                <button class="btn btn-primary" style="flex:1;justify-content:center;" onclick="window.s4PzStartListeningTest(${t.id}, 0)">
                  ⛶ Thi Full Test (Full-Screen)
                </button>
                ${(t.parts || []).map((p, idx) => `
                  <button class="btn" style="padding:6px 9px;font-size:12px;" onclick="window.s4PzStartListeningTest(${t.id}, ${idx})" title="${p.name}">
                    R${idx + 1}
                  </button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderListeningExamView(testObj) {
    activeSkill = 'listening';
    if (!testObj) return renderListeningHub();
    enterCbtExamMode(false);
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
        <!-- TOP EXAM HEADER BAR (INSPERA CBT STYLE) -->
        <header class="s4-cbt-header">
          <div class="s4-cbt-header-left">
            <span class="s4-cbt-brand-badge">IELTS LISTENING</span>
            <span class="s4-cbt-test-title" title="${testObj.title}">${testObj.title}</span>
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
            <div class="s4-cbt-vol-group" style="display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:8px;background:var(--box-sub);border:1px solid var(--border);" title="Thanh điều chỉnh âm lượng tai nghe chuẩn phòng thi">
              <span>🔊</span>
              <input type="range" min="0" max="1" step="0.05" value="1" style="width:66px;accent-color:var(--primary);cursor:pointer;" oninput="window.s4CbtSetVolume(this.value)">
            </div>
            <div class="s4-cbt-font-group" style="display:inline-flex;gap:3px;background:var(--box-sub);padding:2px;border-radius:8px;border:1px solid var(--border);" title="Chỉnh cỡ chữ bài thi">
              <button type="button" class="s4-cbt-ctrl-btn s4-cbt-font-btn ${cbtFontClass === 'cbt-font-std' ? 'active' : ''}" data-font="cbt-font-std" style="border:none;padding:4px 8px;" onclick="window.s4CbtSetFont('cbt-font-std')">A</button>
              <button type="button" class="s4-cbt-ctrl-btn s4-cbt-font-btn ${cbtFontClass === 'cbt-font-lg' ? 'active' : ''}" data-font="cbt-font-lg" style="border:none;padding:4px 8px;font-size:13.5px;" onclick="window.s4CbtSetFont('cbt-font-lg')">A+</button>
              <button type="button" class="s4-cbt-ctrl-btn s4-cbt-font-btn ${cbtFontClass === 'cbt-font-xl' ? 'active' : ''}" data-font="cbt-font-xl" style="border:none;padding:4px 8px;font-size:15px;" onclick="window.s4CbtSetFont('cbt-font-xl')">A++</button>
            </div>
            <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4CbtQuickHighlight()" title="Tô vàng cụm từ đang chọn">🖍️<span class="s4-cbt-hide-mob"> Highlight</span></button>
            <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4CbtQuickNote()" title="Thêm ghi chú cho cụm từ đang chọn">📝<span class="s4-cbt-hide-mob"> Note</span></button>
            <button type="button" class="s4-cbt-ctrl-btn s4-cbt-fs-btn ${isFs ? 'active' : ''}" id="s4CbtFsBtn" onclick="window.s4CbtToggleFullscreen()">
              ${isFs ? '🗗<span class="s4-cbt-hide-mob"> Thoát Fullscreen (Esc)</span>' : '⛶<span class="s4-cbt-hide-mob"> Toàn màn hình (F11)</span>'}
            </button>
            ${!isSubmitted ? `
              <button type="button" class="s4-cbt-submit-btn" onclick="window.s4PzSubmitListening('${sessionKey}')">✔ Nộp bài<span class="s4-cbt-hide-mob"> & Chấm điểm</span></button>
            ` : `
              <button type="button" class="s4-cbt-ctrl-btn" onclick="window.s4PzResetListening('${sessionKey}', ${testObj.id})">🔄 Làm lại</button>
            `}
            <button type="button" class="s4-cbt-ctrl-btn" onclick="window.S4PracticeZone.openListeningHub()">📚 <span class="s4-cbt-hide-mob">Đổi đề</span></button>
            <button type="button" class="s4-cbt-ctrl-btn s4-cbt-exit-btn" onclick="window.s4CbtExitListeningToLesson()">✕ Thoát</button>
          </div>
        </header>

        <!-- AUDIO PLAYER + PART BANNER OR RESULT BANNER -->
        ${isSubmitted ? `
          <div class="s4-pz-result-banner" style="margin:0;border-radius:0;border-left:none;border-right:none;padding:10px 20px;">
            <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
              <div class="s4-pz-band-circle" style="min-width:58px;height:52px;border-radius:10px;">
                <span class="s4-pz-band-num" style="font-size:20px;">${bandScore}</span>
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
              <button class="s4-cbt-ctrl-btn" onclick="window.s4CbtExitListeningToLesson()">📜 Xem Transcript & Chép chính tả</button>
            </div>
          </div>
        ` : ''}

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
          <button type="button" class="s4-cbt-mob-tab s4-cbt-mob-hl-btn" onclick="window.s4CbtMobileQuickHighlight()" title="Tô vàng cụm từ đang bôi đen">🖍️</button>
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
    exitCbtExamMode();
    if (typeof window.exitListeningPzMode === 'function') {
      window.exitListeningPzMode();
    } else {
      listenHubOpen = true;
      if (typeof window.renderMain === 'function') window.renderMain();
    }
  };

  window.s4PzSetListeningBook = function (b) {
    listenHubBook = b;
    if (typeof window.renderMain === 'function') window.renderMain();
  };
  window.s4PzFilterListeningHub = function (q) {
    listenHubSearch = q;
    if (typeof window.renderMain === 'function') window.renderMain();
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
  window.s4PzSubmitListening = function (sessionKey) {
    listenSubmittedMap[sessionKey] = true;
    stopExamTimer();
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
    isReadingHubOpen: () => readHubOpen,
    setReadingHubOpen: (flag) => {
      readHubOpen = !!flag;
      if (flag) exitCbtExamMode();
    },
    openReadingHub: function () {
      exitCbtExamMode();
      readHubOpen = true;
      if (typeof window.ensureSynonymsLoaded === 'function') {
        window.ensureSynonymsLoaded(() => {
          if (typeof window.renderMain === 'function') window.renderMain();
        });
      }
      if (typeof window.renderMain === 'function') window.renderMain();
    },
    renderReadingHub,
    renderReadingPracticeView,
    mountReadingDomEvents,

    ensureListeningPzLoaded,
    isListeningHubOpen: () => listenHubOpen,
    setListeningHubOpen: (flag) => {
      listenHubOpen = !!flag;
      if (flag) exitCbtExamMode();
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
      activePartIdx = m ? Math.max(0, parseInt(m[1], 10) - 1) : 0;
      const t = findListeningTestForLesson(lesson);
      if (t) activeListenTestId = t.id;
      listenHubOpen = false;
      enterCbtExamMode(true);
    },
    openListeningHub: function () {
      exitCbtExamMode();
      listenHubOpen = true;
      if (typeof window.activateListeningPzTab === 'function') {
        window.activateListeningPzTab();
      }
    },
    renderListeningHub,
    renderListeningExamView,
    mountListeningDomEvents
  };
})();
