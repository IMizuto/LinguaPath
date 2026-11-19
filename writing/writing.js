/**
 * LinguaPath IELTS Writing Studio - Multi-Mode Controller (v2.0)
 * Quản lý 5 chế độ học tập chuyên sâu:
 * 1. Sample Essay & Song ngữ
 * 2. Luyện viết câu (Word Unscramble)
 * 3. Luyện từ vựng
 * 4. Luyện tập ngữ pháp (Grammar Practice)
 * 5. Phòng viết cả bài (Full Essay Studio)
 */

(function (global) {
  'use strict';

  const STORAGE_KEY_DONE = 's4_writing_done';
  const STORAGE_KEY_LAST = 's4_writing_last_v1';
  const STORAGE_KEY_ESSAYS = 's4_writing_essays_v1';
  const STORAGE_KEY_SUBMISSIONS = 'lp_submissions_history';

  // State
  let currentUnitId = 'u_3';
  let activeLesson = null;
  let allLessons = [];
  let currentLessonMode = 'sample'; // 'sample' | 'write' | 'vocab' | 'grammar' | 'essay'
  let showSampleMeaning = true;
  let showSampleRoles = false;
  let currentWriteIndex = 0;
  let currentActiveSubId = null;

  // Practice Zone Full Exam State
  let currentPzTask = 'task1'; // 'task1' | 'task2'
  let pzTimerInterval = null;
  let pzTimerSecondsLeft = 3600; // 60 phút
  let isPzTimerRunning = false;
  let currentReviewPzTask = 'task1';

  // Practice Zone Candidate Lobby State
  let lobbySelectedMode = 'both'; // 'both' | 'task1' | 'task2'
  let lobbySelectedTimer = 60; // 60 | 40 | 20 | 0
  let lobbySelectedFont = 'cbt-font-std'; // 'cbt-font-std' | 'cbt-font-lg' | 'cbt-font-xl'

  // Study4 Practice Zone 1,183-Prompt Lazy Bank & UI State
  let writingPzLoading = false;
  const writingPzCallbacks = [];
  let sidebarPzFilter = 'all'; // 'all' | 'full' | 'task1' | 'task2'
  let sidebarPzLimit = 30;
  let pickerState = {
    tab: 'all',       // 'all' | 'full' | 'task1' | 'task2'
    series: 'ALL',    // 'ALL' | 'actual_tests' | 'sample_pack' | 'sample_test' | 'recent_actual' | 'bc_ielts'
    query: '',
    onlySample: false,
    page: 1,
    pageSize: 24
  };

  // Timer & Autosave
  let timerInterval = null;
  let timerSecondsLeft = 1200;
  let isTimerRunning = false;
  let autoSaveTimeout = null;
  let isAllFoldersCollapsed = false;

  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatPlainTextToHtml(text) {
    return escHtml(text)
      .replace(/\n{2,}/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  function renderPzPromptHtml(taskData, fallbackText) {
    if (taskData && taskData.promptHtml && taskData.promptHtml.trim()) {
      return taskData.promptHtml;
    }
    const raw = (taskData && taskData.prompt && taskData.prompt !== 'undefined' && taskData.prompt.trim())
      ? taskData.prompt.trim()
      : '';
    if (raw) return formatPlainTextToHtml(raw);
    const hasImgs = !!(taskData && Array.isArray(taskData.images) && taskData.images.length > 0);
    if (hasImgs) {
      return '<em>(Quan sát câu hỏi và dữ liệu biểu đồ trực tiếp trong hình đề thi bên dưới. Viết tối thiểu 150 từ.)</em>';
    }
    return escHtml(fallbackText || 'Đang cập nhật đề bài...');
  }

  function renderChartImagesHtml(images, imgClass, altText) {
    const list = Array.isArray(images) ? images.filter(Boolean) : [];
    if (list.length === 0) return '';
    return list.map((src, idx) => {
      const safeSrc = escHtml(src);
      const label = list.length > 1 ? ` (Hình ${idx + 1}/${list.length})` : '';
      return `
        <img src="${safeSrc}" alt="${escHtml(altText || 'Biểu đồ đề thi')}${label}" class="${imgClass || 'w-chart-img'}" onclick="window.openLightbox('${safeSrc}')" onerror="this.alt='⚠️ Không tải được ảnh biểu đồ từ nguồn ngoài — kiểm tra kết nối mạng';this.style.minHeight='64px';">
      `;
    }).join('');
  }

  function ensureWritingPzLoaded(cb) {
    if (Array.isArray(global.__STUDY4_WRITING_PZ)) {
      if (cb) cb(global.__STUDY4_WRITING_PZ);
      return;
    }
    if (cb) writingPzCallbacks.push(cb);
    if (writingPzLoading) return;
    writingPzLoading = true;

    const s = document.createElement('script');
    s.src = 'data/writing_practice_zone.js?v=1';
    s.onload = () => {
      writingPzLoading = false;
      const loaded = Array.isArray(global.__STUDY4_WRITING_PZ) ? global.__STUDY4_WRITING_PZ : [];
      while (writingPzCallbacks.length > 0) {
        const fn = writingPzCallbacks.shift();
        try { if (fn) fn(loaded); } catch (e) { console.error('[WritingPZ]', e); }
      }
    };
    s.onerror = () => {
      writingPzLoading = false;
      while (writingPzCallbacks.length > 0) {
        const fn = writingPzCallbacks.shift();
        try { if (fn) fn([]); } catch (e) {}
      }
    };
    document.head.appendChild(s);
  }

  // =========================================================================
  // 1. KHỞI TẠO
  // =========================================================================
  function init() {
    if (typeof WritingParser === 'undefined') {
      console.error('[WritingStudio] Chưa tìm thấy WritingParser!');
      return;
    }

    WritingParser.init();
    allLessons = WritingParser.getAllLessons();

    const lastId = localStorage.getItem(STORAGE_KEY_LAST) || new URLSearchParams(window.location.search).get('id');
    const isDeferredPzId = !!(lastId && (lastId.startsWith('writing_pz_part_') || lastId.startsWith('writing_pz_pair_')));
    if (lastId) {
      const found = WritingParser.getLessonById(lastId);
      if (found) {
        currentUnitId = (found.type === 'theory') ? 'theory' : found.unitId;
        activeLesson = found;
      } else if (isDeferredPzId) {
        currentUnitId = 'u_6';
        activeLesson = allLessons.find(l => l.unitId === 'u_6') || allLessons[0];
        ensureWritingPzLoaded(() => {
          const resolved = WritingParser.getLessonById(lastId);
          if (resolved) {
            activeLesson = resolved;
            currentUnitId = 'u_6';
            setupTopSwitch();
            renderSidebar();
            loadLessonToStudio(resolved);
          }
        });
      }
    }

    if (!activeLesson && allLessons.length > 0) {
      activeLesson = allLessons.find(l => l.unitId === 'u_3') || allLessons[0];
    }

    setupTopSwitch();
    updateTopProgress();
    renderSidebar();
    renderLobbyHistory();
    if (activeLesson) {
      loadLessonToStudio(activeLesson);
    }
  }

  // =========================================================================
  // 2. TOPBAR TOP-SWITCH
  // =========================================================================
  function setupTopSwitch() {
    const btns = document.querySelectorAll('#topSwitch .top-switch-btn');
    btns.forEach(btn => btn.classList.remove('active'));

    const btnIdMap = {
      'u_3': 'topBtn_u_3',
      'u_4': 'topBtn_u_4',
      'u_5': 'topBtn_u_5',
      'theory': 'topBtn_theory',
      'u_6': 'topBtn_pz'
    };

    const targetBtnId = btnIdMap[currentUnitId];
    if (targetBtnId) {
      const activeBtn = document.getElementById(targetBtnId);
      if (activeBtn) activeBtn.classList.add('active');
    }
  }

  global.switchWritingUnit = function (unitId) {
    currentUnitId = unitId;
    setupTopSwitch();

    let targetLesson = null;
    if (unitId === 'theory') {
      targetLesson = allLessons.find(l => l.type === 'theory');
    } else if (unitId === 'u_6') {
      if (activeLesson && activeLesson.unitId === 'u_6') {
        targetLesson = activeLesson;
      } else {
        targetLesson = allLessons.find(l => l.unitId === 'u_6');
      }
      if (!Array.isArray(global.__STUDY4_WRITING_PZ)) {
        ensureWritingPzLoaded(() => {
          if (currentUnitId === 'u_6') renderSidebar();
        });
      }
    } else {
      targetLesson = allLessons.find(l => l.unitId === unitId);
    }

    renderSidebar();
    if (targetLesson) {
      global.selectWritingLesson(targetLesson.id);
    }
  };

  // =========================================================================
  // 3. TIẾN ĐỘ HỌC TẬP
  // =========================================================================
  function getCompletedLessons() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_DONE) || '[]');
    } catch (e) {
      return [];
    }
  }

  const memoryEssayDrafts = {};
  const memoryPzDrafts = {};
  let lastQuotaWarnTs = 0;

  function warnQuotaOnce() {
    const now = Date.now();
    if (now - lastQuotaWarnTs < 10000) return;
    lastQuotaWarnTs = now;
    if (window.S4UI && typeof window.S4UI.toast === 'function') {
      window.S4UI.toast('warn', 'Bộ nhớ trình duyệt sắp đầy — bản nháp đang được giữ an toàn trên RAM.', 4000);
    }
  }

  function getSavedEssays() {
    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY_ESSAYS) || '{}');
    } catch (e) {
      stored = {};
    }
    return Object.assign({}, stored, memoryEssayDrafts);
  }

  // Quản lý Lịch sử Bài Nộp (Submissions History) & Đánh giá AI
  function getWritingSubmissions() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMISSIONS) || '[]');
    } catch (e) {
      return [];
    }
  }

  function updateTopWritingHistoryCount() {
    const subs = getWritingSubmissions();
    const badgeEl = document.getElementById('lobbyHistoryBadgeCount');
    const topCountEl = document.getElementById('topHistoryCount');
    if (badgeEl) badgeEl.textContent = `${subs.length} bài đã nộp`;
    if (topCountEl) topCountEl.textContent = String(subs.length);
    return subs;
  }

  function saveWritingSubmissionRecord(record) {
    const list = getWritingSubmissions();
    const idx = list.findIndex(r => r.id === record.id);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.unshift(record); // bài mới nhất lên đầu
    }
    try {
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(list));
    } catch (e) {
      console.error('Không thể lưu submission vào localStorage', e);
    }
    renderLobbyHistory();
  }

  function renderAiEvaluationForm(subRecord) {
    const overallInput = document.getElementById('aiScoreOverall');
    const trInput = document.getElementById('aiScoreTR');
    const ccInput = document.getElementById('aiScoreCC');
    const lrInput = document.getElementById('aiScoreLR');
    const graInput = document.getElementById('aiScoreGRA');
    const fbText = document.getElementById('aiFeedbackText');
    const corText = document.getElementById('aiCorrectionsText');
    const statusEl = document.getElementById('aiSaveStatus');

    const evalData = (subRecord && subRecord.aiEvaluation) ? subRecord.aiEvaluation : {};

    if (overallInput) overallInput.value = evalData.bandOverall || '';
    if (trInput) trInput.value = evalData.bandTR || '';
    if (ccInput) ccInput.value = evalData.bandCC || '';
    if (lrInput) lrInput.value = evalData.bandLR || '';
    if (graInput) graInput.value = evalData.bandGRA || '';
    if (fbText) fbText.value = evalData.feedback || '';
    if (corText) corText.value = evalData.corrections || '';

    global.updateAiScoreBadge();

    if (statusEl) {
      if (evalData.updatedAt) {
        const d = new Date(evalData.updatedAt);
        statusEl.innerHTML = `<span style="color:#10b981;font-weight:700;">✓ Đã lưu điểm số ${evalData.bandOverall ? `Band ${evalData.bandOverall}` : ''} (${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')})</span>`;
      } else {
        statusEl.innerHTML = `<span>💡 Nhập điểm hoặc dán nhận xét của AI rồi bấm "Lưu Đánh Giá Của AI Vào Lịch Sử".</span>`;
      }
    }
  }

  global.saveCurrentAiEvaluation = function () {
    if (!currentActiveSubId) {
      if (window.S4UI) window.S4UI.toast('error', 'Không tìm thấy bài nộp tương ứng để lưu đánh giá!');
      else alert('Không tìm thấy bài nộp tương ứng để lưu đánh giá!');
      return;
    }
    const list = getWritingSubmissions();
    const sub = list.find(r => r.id === currentActiveSubId);
    if (!sub) return;

    const overall = document.getElementById('aiScoreOverall')?.value.trim() || '';
    const tr = document.getElementById('aiScoreTR')?.value.trim() || '';
    const cc = document.getElementById('aiScoreCC')?.value.trim() || '';
    const lr = document.getElementById('aiScoreLR')?.value.trim() || '';
    const gra = document.getElementById('aiScoreGRA')?.value.trim() || '';
    const feedback = document.getElementById('aiFeedbackText')?.value.trim() || '';
    const corrections = document.getElementById('aiCorrectionsText')?.value.trim() || '';

    sub.aiEvaluation = {
      bandOverall: overall,
      bandTR: tr,
      bandCC: cc,
      bandLR: lr,
      bandGRA: gra,
      feedback: feedback,
      corrections: corrections,
      updatedAt: new Date().toISOString()
    };

    saveWritingSubmissionRecord(sub);
    global.updateAiScoreBadge();

    const statusEl = document.getElementById('aiSaveStatus');
    if (statusEl) {
      const now = new Date();
      statusEl.innerHTML = `<span style="color:#10b981;font-weight:700;">✓ Đã lưu thành công điểm số ${overall ? `Band ${overall}` : ''} và nhận xét của AI vào Lịch sử! (${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')})</span>`;
    }
  };

  global.updateAiScoreBadge = function () {
    const input = document.getElementById('aiScoreOverall');
    const badgeVal = document.getElementById('aiOverallBadgeVal');
    const badge = document.getElementById('aiOverallBadge');
    if (!input || !badgeVal || !badge) return;

    const val = input.value.trim();
    if (val && !isNaN(val)) {
      badgeVal.textContent = `Band ${val}`;
      const num = parseFloat(val);
      if (num >= 7.5) {
        badge.style.background = 'rgba(16, 185, 129, 0.15)';
        badge.style.borderColor = '#10b981';
        badgeVal.style.color = '#10b981';
      } else if (num >= 6.5) {
        badge.style.background = 'rgba(37, 99, 235, 0.15)';
        badge.style.borderColor = '#2563eb';
        badgeVal.style.color = '#2563eb';
      } else {
        badge.style.background = 'rgba(245, 158, 11, 0.15)';
        badge.style.borderColor = '#f59e0b';
        badgeVal.style.color = '#f59e0b';
      }
    } else {
      badgeVal.textContent = 'Chưa chấm';
      badge.style.background = 'rgba(100, 116, 139, 0.12)';
      badge.style.borderColor = 'var(--border)';
      badgeVal.style.color = 'var(--muted)';
    }
  };

  global.pasteAiFeedbackFromClipboard = async function () {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        if (window.S4UI) window.S4UI.toast('warn', 'Bộ nhớ tạm (Clipboard) đang trống.');
        else alert('Bộ nhớ tạm (Clipboard) đang trống.');
        return;
      }
      const overallMatch = text.match(/(?:Overall|Band\s*Score|Overall\s*Band|Điểm\s*tổng)\s*[:=]?\s*([0-9](?:\.[05])?)/i);
      const trMatch = text.match(/(?:Task\s*Achievement|Task\s*Response|TR)\s*[:=]?\s*([0-9](?:\.[05])?)/i);
      const ccMatch = text.match(/(?:Coherence\s*(?:&|and)?\s*Cohesion|CC)\s*[:=]?\s*([0-9](?:\.[05])?)/i);
      const lrMatch = text.match(/(?:Lexical\s*Resource|LR|Từ\s*vựng)\s*[:=]?\s*([0-9](?:\.[05])?)/i);
      const graMatch = text.match(/(?:Grammatical\s*Range|GRA|Grammar|Ngữ\s*pháp)\s*[:=]?\s*([0-9](?:\.[05])?)/i);

      if (overallMatch) document.getElementById('aiScoreOverall').value = overallMatch[1];
      if (trMatch) document.getElementById('aiScoreTR').value = trMatch[1];
      if (ccMatch) document.getElementById('aiScoreCC').value = ccMatch[1];
      if (lrMatch) document.getElementById('aiScoreLR').value = lrMatch[1];
      if (graMatch) document.getElementById('aiScoreGRA').value = graMatch[1];

      const fbBox = document.getElementById('aiFeedbackText');
      if (fbBox) {
        if (!fbBox.value.trim()) {
          fbBox.value = text;
        } else {
          fbBox.value += '\n\n' + text;
        }
      }
      global.updateAiScoreBadge();
      if (window.S4UI) window.S4UI.toast('success', 'Đã dán và tự động nhận diện điểm số từ Clipboard!');
      else alert('Đã dán và tự động nhận diện điểm số từ Clipboard!');
    } catch (e) {
      if (window.S4UI) window.S4UI.alert('Trình duyệt yêu cầu quyền đọc Clipboard hoặc hãy dán thủ công bằng Ctrl+V vào ô nhận xét.', { title: 'Không đọc được Clipboard', tone: 'warn' });
      else alert('Trình duyệt yêu cầu quyền đọc Clipboard hoặc hãy dán thủ công bằng Ctrl+V vào ô nhận xét.');
    }
  };

  function markLessonCompleted(lessonId) {
    if (!lessonId) return;
    const doneList = getCompletedLessons();
    if (!doneList.includes(lessonId)) {
      doneList.push(lessonId);
      localStorage.setItem(STORAGE_KEY_DONE, JSON.stringify(doneList));
    }
    updateTopProgress();
    renderSidebar();
  }

  function updateTopProgress() {
    const doneList = getCompletedLessons();
    const courseDoneCount = doneList.filter(id => /^writing_u[1-5]_\d+$/.test(String(id)) || /^writing_pz_[1-3]$/.test(String(id))).length;
    const pill = document.getElementById('topProgText');
    if (pill) {
      pill.textContent = `Đã học: ${courseDoneCount} / ${allLessons.length} bài`;
    }
  }

  // =========================================================================
  // 4. RENDER SIDEBAR MỤC LỤC
  // =========================================================================
  function renderPracticeZoneSidebar(listEl, query, doneList) {
    const pzCatalog = WritingParser.getStudy4PzCatalog();
    const t1Total = pzCatalog.length ? pzCatalog.filter(p => p.tag === 'Task 1').length : 497;
    const t2Total = pzCatalog.length ? pzCatalog.filter(p => p.tag === 'Task 2').length : 686;
    const comboCount = (t1Total * t2Total).toLocaleString('en-US');

    let html = `
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
        <div style="padding:10px 12px;border-radius:10px;background:rgba(37, 99, 235, 0.1);border:1.5px solid rgba(37,99,235,0.45);cursor:pointer;display:flex;align-items:center;gap:10px;transition:all 0.2s;"
             onclick="window.openWritingTestPicker();"
             title="Mở Kho đề Practice Zone đầy đủ (1,183 đề Study4 + lọc theo nguồn/dạng bài)">
          <span style="font-size:21px;">📚</span>
          <div style="line-height:1.25;min-width:0;">
            <div style="font-size:12.5px;font-weight:800;color:var(--text);">Duyệt Kho 1,183 Đề Study4</div>
            <div style="font-size:11px;color:var(--muted);">${t1Total} Task 1 • ${t2Total} Task 2 • Lọc theo kỳ thi</div>
          </div>
        </div>
        <div style="padding:10px 12px;border-radius:10px;background:rgba(147, 51, 234, 0.12);border:1.5px dashed #9333ea;cursor:pointer;display:flex;align-items:center;gap:10px;transition:all 0.2s;"
             onclick="window.generateRandomWritingTest();"
             title="Tự động bốc ngẫu nhiên 1 Task 1 và 1 Task 2 từ kho Study4">
          <span style="font-size:21px;">🎲</span>
          <div style="line-height:1.25;min-width:0;">
            <div style="font-size:12.5px;font-weight:800;color:var(--text);">Bốc đề Full Exam ngẫu nhiên</div>
            <div style="font-size:11px;color:var(--muted);">Kho ${comboCount} tổ hợp (Task 1 + 2)</div>
          </div>
        </div>
      </div>
      <div class="w-sb-pz-pills">
        <button type="button" class="w-sb-pz-pill ${sidebarPzFilter === 'all' ? 'active' : ''}" onclick="window.setSidebarPzFilter('all')">Tất cả</button>
        <button type="button" class="w-sb-pz-pill ${sidebarPzFilter === 'full' ? 'active' : ''}" onclick="window.setSidebarPzFilter('full')">Full (3)</button>
        <button type="button" class="w-sb-pz-pill ${sidebarPzFilter === 'task1' ? 'active' : ''}" onclick="window.setSidebarPzFilter('task1')">T1 (${t1Total})</button>
        <button type="button" class="w-sb-pz-pill ${sidebarPzFilter === 'task2' ? 'active' : ''}" onclick="window.setSidebarPzFilter('task2')">T2 (${t2Total})</button>
      </div>
    `;

    const matchSidebar = (hay) => (window.S4UI && typeof window.S4UI.matchesSearch === 'function')
      ? window.S4UI.matchesSearch(hay, query)
      : (!query || String(hay || '').toLowerCase().includes(query.toLowerCase()));

    // Curated Full Tests (pz_test_1..3 + any custom active non-Study4-part PZ test)
    const curatedTests = allLessons.filter(l => {
      if (l.unitId !== 'u_6') return false;
      if (sidebarPzFilter === 'task1' || sidebarPzFilter === 'task2') return false;
      if (!query) return true;
      return matchSidebar(`${l.title} ${l.chartType || ''} ${l.questionType || ''} ${l.topic || ''}`);
    });

    if (curatedTests.length > 0) {
      const isOpen = !isAllFoldersCollapsed || query.length > 0 || sidebarPzFilter === 'full';
      html += `
        <div class="folder-group">
          <div class="folder-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'flex' : 'none'">
            <span>📁 🎯 Đề Full Chuẩn + Bài mẫu (${curatedTests.length})</span>
            <span style="font-size:10px;opacity:0.7;">▼</span>
          </div>
          <div class="folder-items" style="display:${isOpen ? 'flex' : 'none'};">
            ${curatedTests.map(it => {
              const isActive = activeLesson && activeLesson.id === it.id;
              const isDone = doneList.includes(it.id);
              return `
                <div class="lesson-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}" onclick="window.selectWritingLesson('${it.id}')">
                  <div style="min-width:0;flex:1;">
                    <div class="lesson-item-title">${escHtml(it.title)}</div>
                    <div class="lesson-item-sub">⏱️ 60p • 2 Tasks • 🏆 Bài mẫu Simon Band 8+</div>
                  </div>
                  <div class="done-badge">${isDone ? '✓' : '•'}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // Active Study4 PZ item banner if currently open and beyond current page window
    if (activeLesson && activeLesson.pzSource === 'study4') {
      html += `
        <div style="margin:6px 0 8px;padding:8px 10px;border-radius:8px;border:1.5px solid var(--primary);background:rgba(37,99,235,0.08);font-size:11.5px;">
          <div style="font-weight:800;color:var(--primary);margin-bottom:2px;">📌 Đang chọn Practice Zone:</div>
          <div style="font-weight:700;color:var(--text);line-height:1.35;">${escHtml(activeLesson.title)}</div>
        </div>
      `;
    }

    if (sidebarPzFilter !== 'full') {
      if (!pzCatalog.length) {
        html += `<div style="padding:18px 10px;text-align:center;color:var(--muted);font-size:12px;">⏳ Đang tải kho 1,183 đề Study4...</div>`;
        ensureWritingPzLoaded(() => { if (currentUnitId === 'u_6') renderSidebar(); });
      } else {
        const filteredPz = pzCatalog.filter(p => {
          if (sidebarPzFilter === 'task1' && p.tag !== 'Task 1') return false;
          if (sidebarPzFilter === 'task2' && p.tag !== 'Task 2') return false;
          if (!query) return true;
          return matchSidebar(`${p.title} ${p.subType || ''} ${p.seriesLabel || ''} ${p.prompt || ''}`);
        });

        const visiblePz = filteredPz.slice(0, sidebarPzLimit);
        const isOpen = !isAllFoldersCollapsed || query.length > 0 || sidebarPzFilter !== 'all';
        if (filteredPz.length === 0) {
          html += `<div class="s4-empty-state" style="margin-top:8px;padding:22px 12px;">
            <div style="font-size:24px;">🔍</div>
            <div style="font-size:13px;font-weight:800;color:var(--text);">Không tìm thấy đề Practice Zone</div>
            ${query ? `<div style="font-size:12px;">Từ khóa "<strong>${escHtml(query)}</strong>" không khớp đề nào.</div>` : ''}
            ${query ? `<button type="button" class="s4-pz-clear-chip" onclick="window.clearWritingSidebarSearch()">✕ Xóa tìm kiếm</button>` : ''}
          </div>`;
        } else {
          html += `
            <div class="folder-group">
              <div class="folder-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'flex' : 'none'">
                <span>📁 🌐 Kho Study4 (${filteredPz.length.toLocaleString('en-US')} đề)</span>
                <span style="font-size:10px;opacity:0.7;">▼</span>
              </div>
              <div class="folder-items" style="display:${isOpen ? 'flex' : 'none'};">
                ${visiblePz.map(p => {
                  const pid = `writing_pz_part_${p.id}`;
                  const isActive = activeLesson && activeLesson.id === pid;
                  const isDone = doneList.includes(pid);
                  const badge = p.tag === 'Task 1' ? '📊 T1' : '💡 T2';
                  const extra = [p.seriesLabel, p.sampleId ? '🏆 Bài mẫu' : '', p.partnerId ? '🔗 Cặp Full' : ''].filter(Boolean).join(' • ');
                  return `
                    <div class="lesson-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}" onclick="window.selectWritingLesson('${pid}')">
                      <div style="min-width:0;flex:1;">
                        <div class="lesson-item-title">${badge} ${escHtml(p.title)}</div>
                        <div class="lesson-item-sub">${escHtml(extra)}</div>
                      </div>
                      <div class="done-badge">${isDone ? '✓' : '•'}</div>
                    </div>
                  `;
                }).join('')}
                ${filteredPz.length > visiblePz.length ? `
                  <button type="button" class="btn mini-btn" style="width:100%;margin-top:6px;justify-content:center;font-weight:700;" onclick="window.loadMoreSidebarPz()">
                    ⬇ Xem thêm (${Math.min(40, filteredPz.length - visiblePz.length)}/${(filteredPz.length - visiblePz.length).toLocaleString('en-US')} đề còn lại)
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }
      }
    }

    listEl.innerHTML = html;
  }

  global.setSidebarPzFilter = function (filterKey) {
    sidebarPzFilter = filterKey || 'all';
    sidebarPzLimit = 30;
    renderSidebar();
  };

  global.loadMoreSidebarPz = function () {
    sidebarPzLimit += 40;
    renderSidebar();
  };

  function groupLessonsByFolder(lessons) {
    const folders = {};
    (lessons || []).forEach(l => {
      let groupName = 'Chung';
      if (l.type === 'theory') {
        groupName = (l.unitId === 'u_1') ? '📘 Lý thuyết Task 1' : '📙 Lý thuyết Task 2';
      } else if (l.chartType) {
        groupName = `📊 Dạng ${l.chartType}`;
      } else if (l.questionType) {
        groupName = `💡 ${l.questionType}`;
      } else if (l.topic) {
        groupName = `🌐 ${l.topic}`;
      } else if (l.unitId === 'u_6') {
        groupName = '🎯 Đề Thi Thử Full Exam';
      }
      if (!folders[groupName]) folders[groupName] = [];
      folders[groupName].push(l);
    });
    return folders;
  }

  function getOrderedUnitLessons(lesson) {
    if (!lesson) return [];
    const pool = (typeof WritingParser !== 'undefined' && typeof WritingParser.getAllLessons === 'function')
      ? WritingParser.getAllLessons()
      : allLessons;
    const targetUnit = (lesson.type === 'theory') ? 'theory' : lesson.unitId;
    const raw = (pool || []).filter(l => (targetUnit === 'theory' ? l.type === 'theory' : l.unitId === targetUnit));
    return Object.values(groupLessonsByFolder(raw)).flat().filter(l => l && l.type !== 'practice_full');
  }

  function updateWritingLessonNav(lesson) {
    const prevBtn = document.getElementById('btnPrevWritingLesson');
    const nextBtn = document.getElementById('btnNextWritingLesson');
    if (!prevBtn || !nextBtn) return;
    const ordered = getOrderedUnitLessons(lesson);
    const idx = lesson ? ordered.findIndex(l => l.id === lesson.id) : -1;
    const hasPrev = idx > 0;
    const hasNext = idx >= 0 && idx < ordered.length - 1;
    prevBtn.disabled = !hasPrev;
    nextBtn.disabled = !hasNext;
    prevBtn.title = hasPrev ? `Bài trước: ${ordered[idx - 1].title}` : 'Đã ở bài đầu tiên của mục này';
    nextBtn.title = hasNext ? `Bài tiếp: ${ordered[idx + 1].title}` : 'Đã ở bài cuối cùng của mục này';
  }

  global.navigateWritingLesson = function (delta) {
    if (!activeLesson) return;
    const ordered = getOrderedUnitLessons(activeLesson);
    const idx = ordered.findIndex(l => l.id === activeLesson.id);
    if (idx < 0) return;
    const nextLesson = ordered[idx + delta];
    if (!nextLesson) return;
    global.selectWritingLesson(nextLesson.id);
  };

  function renderSidebar() {
    const listEl = document.getElementById('lessonList');
    if (!listEl) return;

    const query = (document.getElementById('searchInput')?.value || '').trim();
    const doneList = getCompletedLessons();
    const essays = getSavedEssays();

    if (currentUnitId === 'u_6') {
      renderPracticeZoneSidebar(listEl, query, doneList);
      return;
    }

    let lessonsInUnit = allLessons.filter(l => {
      if (currentUnitId === 'theory') return l.type === 'theory';
      return l.unitId === currentUnitId;
    });

    if (query) {
      lessonsInUnit = lessonsInUnit.filter(l => {
        const full = l.title + ' ' + (l.topic || '') + ' ' + (l.chartType || '') + ' ' + (l.questionType || '');
        return (window.S4UI && typeof window.S4UI.matchesSearch === 'function')
          ? window.S4UI.matchesSearch(full, query)
          : full.toLowerCase().includes(query.toLowerCase());
      });
    }

    const folders = groupLessonsByFolder(lessonsInUnit);

    if (Object.keys(folders).length === 0) {
      listEl.innerHTML = `
        <div class="s4-empty-state" style="margin-top:8px;padding:24px 12px;">
          <div style="font-size:26px;">🔍</div>
          <div style="font-size:13.5px;font-weight:800;color:var(--text);">Không tìm thấy bài học phù hợp</div>
          ${query ? `<div style="font-size:12px;">Từ khóa "<strong>${escHtml(query)}</strong>" không khớp bài nào.</div>` : ''}
          ${query ? `<button type="button" class="s4-pz-clear-chip" onclick="window.clearWritingSidebarSearch()">✕ Xóa tìm kiếm</button>` : ''}
        </div>
      `;
      return;
    }

    let html = '';

    Object.entries(folders).forEach(([folderName, items]) => {
      const isOpen = !isAllFoldersCollapsed || query.length > 0;
      html += `
        <div class="folder-group">
          <div class="folder-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'flex' : 'none'">
            <span>📁 ${folderName} (${items.length})</span>
            <span style="font-size:10px;opacity:0.7;">▼</span>
          </div>
          <div class="folder-items" style="display:${isOpen ? 'flex' : 'none'};">
            ${items.map(it => {
              const isActive = activeLesson && activeLesson.id === it.id;
              const isDone = doneList.includes(it.id);
              const draft = essays[it.id];
              const subText = (it.type === 'theory')
                ? '🎬 Video bài giảng & Slide'
                : (it.unitId === 'u_6' ? '⏱️ Thi thử 60 phút • 2 Tasks' : (draft ? `✍️ Đã viết ${draft.wordCount} từ` : `Mẫu: ${it.sampleWordCount} từ • ${it.topic || it.chartType || ''}`));

              return `
                <div class="lesson-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}" onclick="window.selectWritingLesson('${it.id}')">
                  <div style="min-width:0;flex:1;">
                    <div class="lesson-item-title">${it.title}</div>
                    <div class="lesson-item-sub">${subText}</div>
                  </div>
                  <div class="done-badge" title="${isDone ? 'Đã hoàn thành' : 'Chưa hoàn thành'}">
                    ${isDone ? '✓' : '•'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    listEl.innerHTML = html;
  }

  let writingSearchTimer = null;
  global.filterWritingSidebar = function () {
    clearTimeout(writingSearchTimer);
    writingSearchTimer = setTimeout(renderSidebar, 180);
  };
  global.clearWritingSidebarSearch = function () {
    clearTimeout(writingSearchTimer);
    const inp = document.getElementById('searchInput');
    if (inp) {
      inp.value = '';
      if (window.S4UI && typeof window.S4UI.syncSearchClear === 'function') window.S4UI.syncSearchClear(inp);
      try { inp.focus({ preventScroll: true }); } catch (e) {}
    }
    renderSidebar();
  };

  global.toggleAllWritingFolders = function () {
    isAllFoldersCollapsed = !isAllFoldersCollapsed;
    const btn = document.getElementById('btnToggleAll');
    if (btn) btn.textContent = isAllFoldersCollapsed ? 'Mở rộng' : 'Thu gọn';
    renderSidebar();
  };

  // =========================================================================
  // 5. CHỌN BÀI HỌC VÀ NẠP VÀO STUDIO
  // =========================================================================
  global.selectWritingLesson = function (lessonId) {
    const sid = String(lessonId || '');
    const lesson = WritingParser.getLessonById(sid);
    if (!lesson) {
      if (sid.startsWith('writing_pz_part_') || sid.startsWith('writing_pz_pair_')) {
        ensureWritingPzLoaded(() => {
          const resolved = WritingParser.getLessonById(sid);
          if (resolved) global.selectWritingLesson(sid);
        });
      }
      return;
    }

    activeLesson = lesson;
    localStorage.setItem(STORAGE_KEY_LAST, sid);

    if (window.innerWidth <= 860) {
      global.toggleWritingSidebar(false);
    }

    renderSidebar();
    loadLessonToStudio(lesson);
  };

  function loadLessonToStudio(lesson) {
    const pzContainer = document.getElementById('practiceZoneContainer');
    const lobbyContainer = document.getElementById('practiceZoneLobby');
    const studioContainer = document.getElementById('studioContainer');
    const reviewContainer = document.getElementById('reviewContainer');

    // 0. Nếu là bài thi thử Practice Zone (Full Exam 60 phút hoặc Luyện từng Task 20p/40p)
    if (lesson.type === 'practice_full') {
      if (studioContainer) studioContainer.style.display = 'none';
      if (reviewContainer) reviewContainer.style.display = 'none';
      if (pzContainer) pzContainer.style.display = 'none';
      if (lobbyContainer) lobbyContainer.style.display = 'block';

      if (lesson.preferredMode === 'task1') {
        lobbySelectedMode = 'task1';
        lobbySelectedTimer = 20;
      } else if (lesson.preferredMode === 'task2') {
        lobbySelectedMode = 'task2';
        lobbySelectedTimer = 40;
      } else {
        lobbySelectedMode = 'both';
        lobbySelectedTimer = 60;
      }

      // Chưa kích hoạt CBT Exam Mode để thí sinh thao tác chọn cấu hình thoải mái tại sảnh
      document.body.classList.remove('s4-cbt-mode', 'in-cbt-mode');
      renderWritingLobby(lesson);
      return;
    } else {
      if (lobbyContainer) lobbyContainer.style.display = 'none';
      if (pzContainer) pzContainer.style.display = 'none';
      document.body.classList.remove('s4-cbt-mode', 'in-cbt-mode');
      if (studioContainer) studioContainer.style.display = 'flex';
      if (reviewContainer) reviewContainer.style.display = 'none';
    }

    const unitTag = document.getElementById('studioUnitTag');
    const lessonTitle = document.getElementById('studioLessonTitle');
    const timerBox = document.getElementById('studioTimer');
    const submitBtn = document.getElementById('btnSubmitEssay');
    const submitBottomBtn = document.getElementById('btnSubmitBottom');
    const modeTabs = document.getElementById('lessonModeTabs');

    if (unitTag) unitTag.textContent = `${lesson.category.toUpperCase()} • ${lesson.unitName.toUpperCase()}`;
    if (lessonTitle) lessonTitle.textContent = lesson.title;
    updateWritingLessonNav(lesson);

    // 1. Nếu là bài lý thuyết
    if (lesson.type === 'theory') {
      if (modeTabs) modeTabs.style.display = 'none';
      if (timerBox) timerBox.style.display = 'none';
      if (submitBtn) {
        submitBtn.textContent = '✓ Đã hiểu bài giảng';
        submitBtn.onclick = () => {
          markLessonCompleted(lesson.id);
          if (window.S4UI) window.S4UI.toast('success', '🎉 Đã ghi nhận hoàn thành bài học lý thuyết này!');
          else alert('🎉 Đã ghi nhận hoàn thành bài học lý thuyết này!');
        };
      }
      renderTheoryContent(lesson);
      return;
    }

    // 2. Nếu là bài thực hành (Unit 3, 4, 5) hoặc Practice Zone
    const rightPane = document.getElementById('studioRightPane');
    if (rightPane) rightPane.style.display = 'flex';
    if (modeTabs) modeTabs.style.display = 'flex';
    if (timerBox) timerBox.style.display = (currentLessonMode === 'essay') ? 'inline-flex' : 'none';
    if (submitBtn) {
      submitBtn.textContent = 'Nộp bài & Đối chiếu ➜';
      submitBtn.onclick = submitEssayAndReview;
    }
    if (submitBottomBtn) {
      submitBottomBtn.onclick = submitEssayAndReview;
    }

    // Render cột trái (Đề bài & Biểu đồ)
    renderPromptSection(lesson);

    // Mặc định về tab sample khi chọn bài mới
    currentWriteIndex = 0;
    global.switchLessonMode(currentLessonMode || 'sample');
  }

  // =========================================================================
  // 6. ĐIỀU KHIỂN CÁC CHẾ ĐỘ HỌC TẬP (5 MODES)
  // =========================================================================
  global.switchLessonMode = function (mode) {
    currentLessonMode = mode;

    // Cập nhật nút active
    document.querySelectorAll('.w-mode-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`modeBtn_${mode}`);
    if (btn) btn.classList.add('active');

    // Ẩn tất cả panes
    const panes = ['paneModeSample', 'paneModeWrite', 'paneModeVocab', 'paneModeGrammar', 'paneModeEssay'];
    panes.forEach(pId => {
      const p = document.getElementById(pId);
      if (p) p.style.display = 'none';
    });

    // Hiện pane tương ứng
    const targetMap = {
      'sample': 'paneModeSample',
      'write': 'paneModeWrite',
      'vocab': 'paneModeVocab',
      'grammar': 'paneModeGrammar',
      'essay': 'paneModeEssay'
    };

    const targetPane = document.getElementById(targetMap[mode]);
    if (targetPane) targetPane.style.display = 'flex';

    const timerBox = document.getElementById('studioTimer');
    if (timerBox) timerBox.style.display = (mode === 'essay') ? 'inline-flex' : 'none';

    if (!activeLesson) return;

    if (mode === 'sample') renderSampleMode(activeLesson);
    else if (mode === 'write') renderWriteMode(activeLesson);
    else if (mode === 'vocab') renderVocabMode(activeLesson);
    else if (mode === 'grammar') renderGrammarMode(activeLesson);
    else if (mode === 'essay') renderEssayMode(activeLesson);
  };

  function highlightSampleSentenceVocab(rawText, vocabWords, includeMeaning) {
    const baseText = String(rawText || '');
    if (!Array.isArray(vocabWords) || vocabWords.length === 0) return baseText;

    const sorted = vocabWords
      .filter(vw => vw && vw.word && String(vw.word).trim())
      .slice()
      .sort((a, b) => String(b.word).trim().length - String(a.word).trim().length);

    let segments = [{ text: baseText, locked: false }];
    sorted.forEach(vw => {
      const clean = String(vw.word).trim();
      const escaped = escapeRegExp(clean);
      const prefix = /^[a-z0-9]/i.test(clean) ? '\\b' : '';
      const suffix = /[a-z]$/i.test(clean) ? '(?:es|s|ed|ing|d)?\\b' : '';
      const re = new RegExp(prefix + '(' + escaped + suffix + ')', 'gi');
      const pill = includeMeaning && vw.meaning ? `<span class="vocab-meaning-pill">[${vw.meaning}]</span>` : '';

      const nextSegments = [];
      segments.forEach(seg => {
        if (seg.locked || !seg.text) {
          nextSegments.push(seg);
          return;
        }
        let lastIdx = 0;
        let m;
        re.lastIndex = 0;
        while ((m = re.exec(seg.text)) !== null) {
          if (m.index > lastIdx) {
            nextSegments.push({ text: seg.text.slice(lastIdx, m.index), locked: false });
          }
          nextSegments.push({ text: `<span class="vocab-word-hl">${m[1]}</span>${pill}`, locked: true });
          lastIdx = m.index + m[0].length;
          if (m[0].length === 0) {
            re.lastIndex++;
          }
        }
        if (lastIdx < seg.text.length) {
          nextSegments.push({ text: seg.text.slice(lastIdx), locked: false });
        }
      });
      segments = nextSegments;
    });

    return segments.map(s => s.text).join('');
  }

  // 6.1 MODE: BÀI MẪU & SONG NGỮ
  function renderSampleMode(lesson) {
    const box = document.getElementById('sampleContentBox');
    if (!box) return;

    if (!lesson.sampleSentences || lesson.sampleSentences.length === 0) {
      box.innerHTML = `<p style="color:var(--muted);font-style:italic;">Bài học này chưa có câu bài mẫu chi tiết.</p>`;
      return;
    }

    let html = '';
    lesson.sampleSentences.forEach((s, sIdx) => {
      const sentenceHtml = highlightSampleSentenceVocab(s.en, s.vocabWords, showSampleMeaning);

      // Nhãn vai trò câu học thuật
      let roleBadge = '';
      if (showSampleRoles && s.roleLabel) {
        const roleClass = `role-${s.role || 'detail'}`;
        roleBadge = `<span class="sentence-role-tag ${roleClass}">🏷️ ${s.roleLabel}</span> `;
      }

      html += `
        <div class="w-sample-p">
          ${roleBadge}
          <span class="w-sample-sentence" id="sentence_${sIdx}">
            ${sentenceHtml}
          </span>
        </div>
      `;
    });

    box.innerHTML = html;
  }

  global.toggleSampleMeaning = function () {
    showSampleMeaning = !showSampleMeaning;
    const btn = document.getElementById('btnToggleMeaning');
    if (btn) {
      btn.textContent = showSampleMeaning ? '🇻🇳 Đang hiện nghĩa tiếng Việt' : '🇻🇳 Ẩn nghĩa tiếng Việt';
      btn.classList.toggle('active', showSampleMeaning);
    }
    if (activeLesson) renderSampleMode(activeLesson);
  };

  global.toggleSampleRoles = function () {
    showSampleRoles = !showSampleRoles;
    const btn = document.getElementById('btnToggleRoles');
    if (btn) {
      btn.textContent = showSampleRoles ? '🏷️ Đang hiện vai trò câu' : '🏷️ Hiện vai trò câu';
      btn.classList.toggle('active', showSampleRoles);
    }
    if (activeLesson) renderSampleMode(activeLesson);
  };

  global.copySampleEssay = function () {
    if (!activeLesson || !activeLesson.sampleText) return;
    navigator.clipboard.writeText(activeLesson.sampleText).then(() => {
      if (window.S4UI) window.S4UI.toast('success', '📋 Đã sao chép toàn bộ bài mẫu Band 8.0+ vào bộ nhớ tạm!');
      else alert('📋 Đã sao chép toàn bộ bài mẫu Band 8.0+ vào bộ nhớ tạm!');
    }).catch(() => {
      if (window.S4UI) window.S4UI.prompt('Không thể sao chép tự động, hãy chọn và chép bài mẫu bên dưới:', activeLesson.sampleText, { title: 'Sao chép bài mẫu', multiline: true, readOnly: true, confirmText: 'Đóng' });
    });
  };

  // 6.2 MODE: LUYỆN VIẾT CÂU (WORD UNSCRAMBLE)
  function renderWriteMode(lesson) {
    const box = document.getElementById('writeExerciseBox');
    if (!box) return;

    const exercises = lesson.writeExercises || [];
    if (exercises.length === 0) {
      box.innerHTML = `<p style="color:var(--muted);font-style:italic;">Bài học này không có bài tập luyện viết câu.</p>`;
      return;
    }

    if (currentWriteIndex >= exercises.length) currentWriteIndex = 0;
    const ex = exercises[currentWriteIndex];

    const promptWords = ex.prompt.split('/').map(w => w.trim()).filter(Boolean);
    const promptDisplay = promptWords.join(' <span class="slash">/</span> ');

    box.innerHTML = `
      <div class="w-write-header">
        <span>✍️ BÀI TẬP VIẾT CÂU HOÀN CHỈNH</span>
        <span style="color:var(--primary);">Câu ${currentWriteIndex + 1} / ${exercises.length}</span>
      </div>

      <div class="w-write-prompt-box">
        ${promptDisplay}
      </div>

      <div class="w-write-input-box">
        <textarea class="w-write-textarea" id="writeInputArea" placeholder="Nhập câu tiếng Anh hoàn chỉnh (viết hoa chữ đầu, chia thì động từ, thêm dấu câu)..."></textarea>
      </div>

      <div class="w-write-feedback" id="writeFeedbackBox"></div>

      <div class="w-write-actions">
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary" onclick="window.checkWriteAnswer()">✓ Kiểm tra</button>
          <button class="btn mini-btn" onclick="window.showWriteHint()">💡 Xem đáp án</button>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn mini-btn" onclick="window.prevWriteExercise()" ${currentWriteIndex === 0 ? 'disabled' : ''}>◀ Câu trước</button>
          <button class="btn mini-btn" onclick="window.nextWriteExercise()" ${currentWriteIndex === exercises.length - 1 ? 'disabled' : ''}>Câu tiếp ➜</button>
        </div>
      </div>
    `;

    const inputArea = document.getElementById('writeInputArea');
    if (inputArea) inputArea.focus();
  }

  global.checkWriteAnswer = function () {
    if (!activeLesson || !activeLesson.writeExercises) return;
    const ex = activeLesson.writeExercises[currentWriteIndex];
    if (!ex) return;

    const userVal = (document.getElementById('writeInputArea')?.value || '').trim();
    const correctVal = ex.answer.trim();
    const fb = document.getElementById('writeFeedbackBox');
    if (!fb) return;

    const cleanUser = userVal.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanCorrect = correctVal.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (cleanUser === cleanCorrect) {
      fb.className = 'w-write-feedback correct';
      fb.innerHTML = `🎉 <strong>Chính xác xuất sắc!</strong> Câu viết rất chuẩn ngữ pháp và từ vựng.`;
    } else {
      fb.className = 'w-write-feedback wrong';
      fb.innerHTML = `❌ <strong>Chưa chính xác:</strong><br>• Đáp án đúng: <em style="color:#fff;">${correctVal}</em>`;
    }
  };

  global.showWriteHint = function () {
    if (!activeLesson || !activeLesson.writeExercises) return;
    const ex = activeLesson.writeExercises[currentWriteIndex];
    if (!ex) return;
    const fb = document.getElementById('writeFeedbackBox');
    if (fb) {
      fb.className = 'w-write-feedback correct';
      fb.innerHTML = `💡 <strong>Đáp án chuẩn:</strong><br><em style="color:#fff;">${ex.answer}</em>`;
    }
  };

  global.nextWriteExercise = function () {
    if (!activeLesson || !activeLesson.writeExercises) return;
    if (currentWriteIndex < activeLesson.writeExercises.length - 1) {
      currentWriteIndex++;
      renderWriteMode(activeLesson);
    }
  };

  global.prevWriteExercise = function () {
    if (currentWriteIndex > 0) {
      currentWriteIndex--;
      renderWriteMode(activeLesson);
    }
  };

  // 6.3 MODE: TỪ VỰNG ĂN ĐIỂM
  function renderVocabMode(lesson) {
    const box = document.getElementById('vocabExerciseBox');
    if (!box) return;

    const vocabList = lesson.vocabList || [];
    if (vocabList.length === 0) {
      box.innerHTML = `<p style="color:var(--muted);font-style:italic;">Chưa có danh sách từ vựng cho bài học này.</p>`;
      return;
    }

    let html = `
      <div style="font-size:13px;font-weight:800;color:var(--primary);margin-bottom:12px;text-transform:uppercase;">
        💎 TỔNG HỢP ${vocabList.length} CỤM TỪ VỰNG HỌC THUẬT GHI ĐIỂM TRONG BÀI MẪU
      </div>
      <div class="w-vocab-grid">
    `;

    vocabList.forEach(v => {
      html += `
        <div class="w-vocab-item">
          <div class="w-vocab-item-en">
            <span>${v.word}</span>
            <button style="background:none;border:none;cursor:pointer;font-size:14px;" onclick="window.speakText('${v.word.replace(/'/g, "\\'")}')" title="Phát âm">🔊</button>
          </div>
          <div class="w-vocab-item-vi">→ ${v.meaning || '(Chưa có nghĩa)'}</div>
        </div>
      `;
    });

    html += `</div>`;
    box.innerHTML = html;
  }

  global.speakText = function (text) {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
  };

  // 6.4 MODE: LUYỆN TẬP NGỮ PHÁP (GRAMMAR PRACTICE)
  function renderGrammarMode(lesson) {
    const box = document.getElementById('grammarExerciseBox');
    if (!box) return;

    const gHtml = lesson.grammarHtml || '';
    if (!gHtml) {
      box.innerHTML = `<p style="color:var(--muted);font-style:italic;">Bài học này không có bài tập ngữ pháp chuyên sâu.</p>`;
      return;
    }

    // Bóc tách grammarHtml thành các ô input tương tác
    let count = 0;
    let processedHtml = gHtml.replace(/<span class="essay-error" data-error="([^"]*)">([\s\S]*?)<\/span>/gi, (match, wrong, correct) => {
      count++;
      const cleanCorrect = correct.replace(/<[^>]*>/g, '').trim();
      const placeholder = wrong ? wrong : '...';
      return `<input type="text" class="w-grammar-input" data-index="${count}" data-correct="${cleanCorrect}" data-wrong="${wrong}" placeholder="${placeholder}" autocomplete="off" spellcheck="false">`;
    });

    processedHtml = processedHtml
      .replace(/<div class="problem-controls[\s\S]*?<\/div>/gi, '')
      .replace(/<div class="problem-grammar">/gi, '')
      .replace(/<\/div>\s*$/gi, '');

    box.innerHTML = `
      <div style="font-size:12.5px;color:var(--muted);margin-bottom:14px;line-height:1.6;">
        💡 <em>Hãy quan sát các ô trống trong bài văn dưới đây, phát hiện lỗi ngữ pháp (hoặc dạng từ sai) và gõ từ đúng vào ô trống, sau đó bấm <strong>✓ Kiểm tra</strong>:</em>
      </div>
      <div>${processedHtml}</div>
    `;

    box.querySelectorAll('.w-grammar-input').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          global.checkGrammarAnswers();
        }
      });
    });
  }

  global.checkGrammarAnswers = function () {
    const inputs = document.querySelectorAll('#grammarExerciseBox .w-grammar-input');
    if (!inputs || inputs.length === 0) return;

    let correctCount = 0;
    inputs.forEach(inp => {
      const userVal = (inp.value || '').trim().toLowerCase();
      const correctVal = (inp.dataset.correct || '').trim().toLowerCase();

      let nextEl = inp.nextElementSibling;
      if (nextEl && nextEl.classList.contains('w-grammar-hint')) {
        nextEl.remove();
      }

      if (userVal === correctVal) {
        correctCount++;
        inp.classList.remove('wrong');
        inp.classList.add('correct');
      } else {
        inp.classList.remove('correct');
        inp.classList.add('wrong');
        const hint = document.createElement('span');
        hint.className = 'w-grammar-hint';
        hint.textContent = `→ ${inp.dataset.correct}`;
        inp.insertAdjacentElement('afterend', hint);
      }
    });

    if (window.S4UI) {
      window.S4UI.alert(`Đúng ${correctCount} / ${inputs.length} vị trí!`, {
        title: 'Kết quả kiểm tra ngữ pháp',
        icon: '📊',
        tone: correctCount === inputs.length ? 'success' : 'primary',
        confirmText: 'Đóng'
      });
    } else {
      alert(`📊 Kết quả kiểm tra ngữ pháp: Đúng ${correctCount} / ${inputs.length} vị trí!`);
    }
  };

  global.showGrammarAnswers = function () {
    const inputs = document.querySelectorAll('#grammarExerciseBox .w-grammar-input');
    inputs.forEach(inp => {
      inp.value = inp.dataset.correct || '';
      inp.classList.remove('wrong');
      inp.classList.add('correct');
      let nextEl = inp.nextElementSibling;
      if (nextEl && nextEl.classList.contains('w-grammar-hint')) {
        nextEl.remove();
      }
    });
  };

  global.clearGrammarAnswers = function () {
    const inputs = document.querySelectorAll('#grammarExerciseBox .w-grammar-input');
    inputs.forEach(inp => {
      inp.value = '';
      inp.classList.remove('wrong', 'correct');
      let nextEl = inp.nextElementSibling;
      if (nextEl && nextEl.classList.contains('w-grammar-hint')) {
        nextEl.remove();
      }
    });
  };

  // 6.5 MODE: PHÒNG VIẾT CẢ BÀI
  function renderEssayMode(lesson) {
    const editor = document.getElementById('essayEditor');
    const minWEl = document.getElementById('minWordTarget');

    if (minWEl) {
      const minW = (lesson.category === 'Task 1') ? 150 : 250;
      minWEl.textContent = `(Mục tiêu: ${minW} từ)`;
    }

    const essays = getSavedEssays();
    const draft = essays[lesson.id];
    if (editor) {
      editor.value = (draft && draft.text) ? draft.text : '';
      handleEditorInput();
    }

    const duration = (lesson.category === 'Task 1') ? 1200 : 2400;
    startTimer(duration);
  }

  // =========================================================================
  // 7. RENDER ĐỀ BÀI & BIỂU ĐỒ (CỘT TRÁI)
  // =========================================================================
  function renderPromptSection(lesson) {
    const pane = document.getElementById('studioLeftPane');
    if (!pane) return;

    let chartHtml = '';
    if (lesson.images && lesson.images.length > 0) {
      chartHtml = `
        <div class="w-chart-wrap">
          ${renderChartImagesHtml(lesson.images, 'w-chart-img', 'Biểu đồ đề bài')}
          <div style="font-size:11px;color:var(--muted);margin-top:6px;">🔍 Nhấp vào ảnh để phóng to toàn màn hình</div>
        </div>
      `;
    }

    let outlineHtml = '';
    if (lesson.outline && lesson.outline.length > 0) {
      outlineHtml = `
        <div class="w-collapse-box">
          <div class="w-collapse-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
            <span>💡 Gợi ý Dàn ý 4 phần (Outline Strategy)</span>
            <span>▼</span>
          </div>
          <div class="w-collapse-body">
            ${lesson.outline.map(o => `
              <div style="margin-bottom:6px;">
                <strong style="color:var(--text);font-size:12px;">• ${o.section}:</strong> <span style="color:var(--muted);font-size:12px;">${o.guide}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    pane.innerHTML = `
      <div class="w-prompt-card">
        <div class="w-prompt-lbl">📋 ĐỀ BÀI (EXAM QUESTION)</div>
        <div class="w-prompt-desc">${lesson.prompt || 'Đang cập nhật đề bài...'}</div>
      </div>
      ${chartHtml}
      ${outlineHtml}
    `;
  }

  function renderTheoryContent(lesson) {
    const pane = document.getElementById('studioLeftPane');
    if (!pane) return;

    let videoHtml = '';
    if (lesson.youtubeId) {
      videoHtml = `
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:10px;margin-bottom:16px;background:#000;">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${lesson.youtubeId}?rel=0"
            style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      `;
    }

    let slidesHtml = '';
    if (lesson.images && lesson.images.length > 0) {
      slidesHtml = `
        <div style="margin-top:16px;">
          <h4 style="font-size:13px;font-weight:700;margin-bottom:8px;color:var(--text);">🖼️ Slide & Sơ đồ Hướng dẫn:</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:10px;">
            ${lesson.images.map(img => `
              <img src="${img}" alt="Slide" style="width:100%;border-radius:8px;border:1px solid var(--border);cursor:zoom-in;" onclick="window.openLightbox('${img}')">
            `).join('')}
          </div>
        </div>
      `;
    }

    pane.innerHTML = `
      <div>
        ${videoHtml}
        <div class="w-prompt-card">
          <div class="w-prompt-lbl">📖 Giáo Trình & Lý Thuyết Phương Pháp Viết</div>
          <div class="w-prompt-desc" style="font-size:14.5px;line-height:1.7;">
            ${lesson.htmlContent || '<p>Hãy xem kỹ video bài giảng phía trên để nắm trọn vẹn phương pháp làm bài.</p>'}
          </div>
        </div>
        ${slidesHtml}
      </div>
    `;

    // Ẩn pane right khi học lý thuyết
    const rightPane = document.getElementById('studioRightPane');
    if (rightPane) rightPane.style.display = 'none';
  }

  // =========================================================================
  // 8. TIMER & WORD COUNT & AUTOSAVE
  // =========================================================================
  function startTimer(seconds) {
    clearInterval(timerInterval);
    timerSecondsLeft = seconds;
    isTimerRunning = true;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      if (!isTimerRunning) return;
      timerSecondsLeft--;
      updateTimerDisplay();
      if (timerSecondsLeft <= 0) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        if (window.S4UI) window.S4UI.alert('Đã hết thời gian làm bài! Hãy nộp bài để đối chiếu bài mẫu Band 8.0+ nhé!', { title: 'Hết giờ làm bài', icon: '⏰', tone: 'warn', confirmText: 'Đã hiểu' });
        else alert('⏰ Đã hết thời gian làm bài! Hãy nộp bài để đối chiếu bài mẫu Band 8.0+ nhé!');
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    const timerBox = document.getElementById('studioTimer');
    if (!display || !timerBox) return;

    const m = Math.floor(timerSecondsLeft / 60);
    const s = timerSecondsLeft % 60;
    display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    timerBox.classList.remove('warn', 'danger');
    if (timerSecondsLeft <= 60) timerBox.classList.add('danger');
    else if (timerSecondsLeft <= 300) timerBox.classList.add('warn');
  }

  function countWords(str) {
    if (!str) return 0;
    const clean = str.replace(/<[^>]*>/g, ' ').replace(/[^\w\s'-]/g, ' ').trim();
    if (!clean) return 0;
    return clean.split(/\s+/).filter(Boolean).length;
  }

  function handleEditorInput() {
    const editor = document.getElementById('essayEditor');
    const badge = document.getElementById('wordCountBadge');
    const countText = document.getElementById('wordCountText');
    if (!editor || !badge || !countText) return;

    const text = editor.value;
    const count = countWords(text);
    countText.textContent = `${count} từ`;

    const minW = (activeLesson && activeLesson.category === 'Task 1') ? 150 : 250;
    if (count >= minW) {
      badge.classList.remove('under');
      badge.classList.add('ready');
    } else {
      badge.classList.remove('ready');
      badge.classList.add('under');
    }

    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      saveDraft(text, count);
    }, 1000);
  }

  function saveDraft(text, wordCount) {
    if (!activeLesson) return true;
    const essays = getSavedEssays();
    const draftObj = {
      lessonId: activeLesson.id,
      title: activeLesson.title,
      category: activeLesson.category,
      text: text,
      wordCount: wordCount,
      updatedAt: new Date().toISOString()
    };
    essays[activeLesson.id] = draftObj;
    let persisted = true;
    try {
      localStorage.setItem(STORAGE_KEY_ESSAYS, JSON.stringify(essays));
      delete memoryEssayDrafts[activeLesson.id];
    } catch (e) {
      persisted = false;
      memoryEssayDrafts[activeLesson.id] = draftObj;
      warnQuotaOnce();
    }

    const statusEl = document.getElementById('autosaveStatus');
    if (statusEl) {
      const now = new Date();
      if (persisted) {
        statusEl.innerHTML = `<span style="color:var(--primary);">✓ Đã lưu (${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')})</span>`;
      } else {
        statusEl.innerHTML = `<span style="color:#f59e0b;">⚠️ Đầy bộ nhớ — đang giữ trên RAM (${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')})</span>`;
      }
    }
    return persisted;
  }

  // =========================================================================
  // 9. REVIEW MODE (ĐỐI CHIẾU SONG SONG & CHẤM ĐIỂM)
  // =========================================================================
  let isSubmittingStudioEssay = false;

  function renderReviewPromptCard(taskKey, taskData) {
    const promptCard = document.getElementById('reviewPromptCard');
    const promptLbl = document.getElementById('reviewPromptTaskLbl');
    const promptType = document.getElementById('reviewPromptTaskType');
    const promptTitle = document.getElementById('reviewPromptTaskTitle');
    const promptText = document.getElementById('reviewPromptText');
    const chartWrap = document.getElementById('reviewChartWrap');
    const promptGrid = document.getElementById('reviewPromptGrid');
    const safeTask = taskData || {};

    if (promptCard) promptCard.style.display = 'block';
    if (promptLbl) {
      promptLbl.textContent = (taskKey === 'task1')
        ? '📊 ĐỀ BÀI TASK 1 • ACADEMIC REPORT (20 PHÚT)'
        : '💡 ĐỀ BÀI TASK 2 • DISCURSIVE ESSAY (40 PHÚT)';
    }
    if (promptType) {
      promptType.textContent = (taskKey === 'task1')
        ? (safeTask.chartType || 'Biểu đồ Task 1')
        : (safeTask.questionType || 'Nghị luận Task 2');
    }
    if (promptTitle) {
      promptTitle.textContent = safeTask.title || (taskKey === 'task1' ? 'Task 1: Academic Report' : 'Task 2: Discursive Essay');
    }
    if (promptText) {
      promptText.innerHTML = renderPzPromptHtml(safeTask);
    }

    const hasImages = !!(safeTask.images && safeTask.images.length > 0);
    if (promptGrid) {
      promptGrid.classList.toggle('has-chart', hasImages);
    }

    if (chartWrap) {
      if (hasImages) {
        chartWrap.style.display = 'block';
        chartWrap.innerHTML = `
          <div class="w-review-chart-box">
            ${renderChartImagesHtml(safeTask.images, 'w-review-chart-img', 'Biểu đồ đề thi')}
            <div class="w-review-chart-hint">🔍 Nhấp vào ảnh để phóng to toàn màn hình</div>
          </div>
        `;
      } else {
        chartWrap.style.display = 'none';
        chartWrap.innerHTML = '';
      }
    }
  }

  async function submitEssayAndReview() {
    if (!activeLesson || isSubmittingStudioEssay) return;
    isSubmittingStudioEssay = true;
    try {
      const editor = document.getElementById('essayEditor');
      const userText = editor ? editor.value.trim() : '';
      const userWords = countWords(userText);

      const isTask1 = (/task\s*1/i.test(activeLesson.category || '') || activeLesson.unitId === 'u_3');
      const minWords = isTask1 ? 150 : 250;
      if (userWords < minWords) {
        const okShort = (window.S4UI && typeof window.S4UI.confirm === 'function')
          ? await window.S4UI.confirm(`Bài viết hiện tại mới có ${userWords} từ (chưa đạt chuẩn tối thiểu ${minWords} từ của ${isTask1 ? 'Task 1' : 'Task 2'}). Bạn vẫn muốn nộp để đối chiếu với bài mẫu chứ?`, {
              title: 'Bài viết chưa đủ số từ chuẩn',
              tone: 'warn',
              confirmText: 'Vẫn nộp & Đối chiếu',
              cancelText: 'Viết tiếp'
            })
          : confirm(`Bài viết hiện tại mới có ${userWords} từ (chưa đạt chuẩn tối thiểu ${minWords} từ của ${isTask1 ? 'Task 1' : 'Task 2'}). Bạn vẫn muốn nộp để đối chiếu với bài mẫu chứ?`);
        if (!okShort) return;
      }

      saveDraft(userText, userWords);
      markLessonCompleted(activeLesson.id);

      document.getElementById('studioContainer').style.display = 'none';
      document.getElementById('reviewContainer').style.display = 'block';

      const pzTabs = document.getElementById('reviewPzTabs');
      if (pzTabs) pzTabs.style.display = 'none';

      const taskKey = (/task\s*1/i.test(activeLesson.category || '') || activeLesson.unitId === 'u_3') ? 'task1' : 'task2';
      renderReviewPromptCard(taskKey, {
        title: activeLesson.title,
        chartType: activeLesson.chartType || 'Task 1',
        questionType: activeLesson.questionType || activeLesson.category || 'Essay',
        prompt: activeLesson.prompt || '',
        promptHtml: activeLesson.promptHtml || '',
        images: activeLesson.images || []
      });

      const reviewUser = document.getElementById('reviewUserEssay');
      const reviewSample = document.getElementById('reviewSampleEssay');
      const userBadge = document.getElementById('reviewUserWordCount');
      const sampleBadge = document.getElementById('reviewSampleWordCount');

      if (reviewUser) reviewUser.textContent = userText || '(Chưa có nội dung bài viết)';
      if (reviewSample) reviewSample.textContent = activeLesson.sampleText || '(Không có bài mẫu cho bài này)';
      if (userBadge) userBadge.textContent = `${userWords} từ`;
      if (sampleBadge) sampleBadge.textContent = `${activeLesson.sampleWordCount || 0} từ`;

      const now = new Date();
      const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} • ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const subRecord = {
        id: `sub_${Date.now()}`,
        skill: 'writing',
        type: 'practice_single',
        testId: activeLesson.id,
        testCode: activeLesson.category,
        testTitle: activeLesson.title,
        date: dateStr,
        timestamp: Date.now(),
        duration: 'Bài viết Studio',
        task1: {
          title: activeLesson.title,
          chartType: activeLesson.chartType || 'Chart',
          questionType: activeLesson.questionType || 'Essay',
          prompt: activeLesson.prompt || '',
          images: activeLesson.images || [],
          userText: userText,
          wordCount: userWords,
          minWords: (activeLesson.category === 'Task 1') ? 150 : 250,
          sampleText: activeLesson.sampleText || ''
        },
        task2: null,
        aiEvaluation: {
          bandOverall: '',
          bandTR: '',
          bandCC: '',
          bandLR: '',
          bandGRA: '',
          feedback: '',
          corrections: '',
          updatedAt: null
        }
      };
      saveWritingSubmissionRecord(subRecord);
      currentActiveSubId = subRecord.id;
      renderAiEvaluationForm(subRecord);
    } finally {
      isSubmittingStudioEssay = false;
    }
  }

  // =========================================================================
  // 10. PRACTICE ZONE (OFFICIAL IELTS ON COMPUTER / INSPERA CBT SIMULATOR)
  // ĐỒNG NHẤT 100% VỚI READING & LISTENING CBT ENGINE
  // =========================================================================
  let pzResizerInitialized = false;

  function initPzResizer() {
    if (pzResizerInitialized) return;
    const resizer = document.getElementById('s4CbtResizer');
    const splitArea = document.getElementById('s4CbtSplitArea');
    const leftCol = document.getElementById('s4CbtLeftPane');
    if (!resizer || !splitArea || !leftCol) return;

    let isDragging = false;
    let startX = 0;
    let startW = 0;

    const startDrag = (clientX) => {
      isDragging = true;
      startX = clientX;
      startW = leftCol.getBoundingClientRect().width;
      resizer.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    };

    const doDrag = (clientX) => {
      if (!isDragging) return;
      const totalW = splitArea.getBoundingClientRect().width;
      if (totalW <= 0) return;
      const diff = clientX - startX;
      let newW = startW + diff;
      let pct = (newW / totalW) * 100;
      if (pct < 25) pct = 25;
      if (pct > 75) pct = 75;
      leftCol.style.setProperty('--cbt-left-pct', pct + '%');
      leftCol.style.width = pct + '%';
    };

    const stopDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      resizer.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    resizer.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startDrag(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) doDrag(e.clientX);
    });

    window.addEventListener('mouseup', stopDrag);

    // Hỗ trợ cảm ứng trên tablet/mobile
    resizer.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        startDrag(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches && e.touches.length === 1) {
        doDrag(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', stopDrag);

    pzResizerInitialized = true;
  }

  // 1. Chỉnh cỡ chữ bài thi CBT (A / A+ / A++)
  global.s4CbtSetWritingFont = function (fontClass) {
    const area = document.getElementById('s4CbtSplitArea');
    if (!area) return;
    area.classList.remove('cbt-font-std', 'cbt-font-lg', 'cbt-font-xl');
    area.classList.add(fontClass);

    document.querySelectorAll('.s4-cbt-font-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-font') === fontClass);
    });
  };

  // 2. Bật / Tắt Toàn màn hình F11
  global.togglePzFullscreen = function () {
    const btn = document.getElementById('s4CbtFsBtn');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        if (btn) btn.innerHTML = '🗗<span class="s4-cbt-hide-mob"> Thoát Fullscreen</span>';
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        if (btn) btn.innerHTML = '⛶<span class="s4-cbt-hide-mob"> Toàn màn hình</span>';
      }).catch(() => {});
    }
  };

  document.addEventListener('fullscreenchange', () => {
    const btn = document.getElementById('s4CbtFsBtn');
    if (!btn) return;
    if (document.fullscreenElement) {
      btn.innerHTML = '🗗<span class="s4-cbt-hide-mob"> Thoát Fullscreen</span>';
    } else {
      btn.innerHTML = '⛶<span class="s4-cbt-hide-mob"> Toàn màn hình</span>';
    }
  });

  // 3. THAO TÁC SẢNH PHÒNG THI PRACTICE ZONE (EXAM CANDIDATE LOBBY)
  function syncLobbyTaskRowsVisual() {
    const t1Row = document.querySelector('.w-lobby-task-row:first-child');
    const t2Row = document.querySelector('.w-lobby-task-row:last-child');
    if (t1Row) {
      t1Row.style.opacity = (lobbySelectedMode === 'task2') ? '0.45' : '1';
    }
    if (t2Row) {
      t2Row.style.opacity = (lobbySelectedMode === 'task1') ? '0.45' : '1';
    }
  }

  global.updateLobbyMode = function (mode) {
    lobbySelectedMode = mode;
    if (mode === 'task1') {
      global.setLobbyTimer(20);
    } else if (mode === 'task2') {
      global.setLobbyTimer(40);
    } else {
      global.setLobbyTimer(60);
    }
    syncLobbyTaskRowsVisual();
  };

  global.setLobbyTimer = function (mins) {
    lobbySelectedTimer = mins;
    document.querySelectorAll('#lobbyTimerPresets .w-time-btn').forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.time) === mins);
    });
  };

  global.setLobbyFont = function (fontClass) {
    lobbySelectedFont = fontClass;
    document.querySelectorAll('.w-font-presets .w-font-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.font === fontClass);
    });
  };

  function renderWritingLobby(lesson) {
    const titleEl = document.getElementById('lobbyTestTitle');
    const t1TitleEl = document.getElementById('lobbyTask1Title');
    const t2TitleEl = document.getElementById('lobbyTask2Title');

    if (titleEl) titleEl.textContent = lesson.title || 'IELTS Academic Writing Test';
    if (t1TitleEl) {
      const t1Title = lesson.fullTestSpec ? lesson.fullTestSpec.task1.title : lesson.title;
      t1TitleEl.textContent = t1Title;
    }
    if (t2TitleEl) {
      const t2Title = lesson.fullTestSpec ? lesson.fullTestSpec.task2.title : 'Task 2: Academic Essay';
      t2TitleEl.textContent = t2Title;
    }

    // Đồng bộ lại trạng thái hiển thị của các nút bấm cấu hình
    global.setLobbyTimer(lobbySelectedTimer);
    global.setLobbyFont(lobbySelectedFont);
    const radio = document.querySelector(`input[name="lobbyWritingMode"][value="${lobbySelectedMode}"]`);
    if (radio) radio.checked = true;
    syncLobbyTaskRowsVisual();

    // Render danh sách Lịch sử bài làm đã nộp trong Sảnh
    renderLobbyHistory();
  }

  // =========================================================================
  // QUẢN LÝ LỊCH SỬ BÀI THI & BÀI LÀM (SUBMISSIONS HISTORY)
  // =========================================================================
  let historyActiveFilter = 'all';

  function renderLobbyHistory() {
    const listEl = document.getElementById('lobbyHistoryList');
    const subs = updateTopWritingHistoryCount();

    if (!listEl) return;
    if (subs.length === 0) {
      listEl.innerHTML = `
        <div class="w-history-empty">
          <span class="w-history-empty-icon">📭</span>
          <strong>Chưa có bài thi nào được nộp</strong>
          <p style="margin:4px 0 0;font-size:12px;opacity:0.8;">Hãy chọn cấu hình phía trên và bấm "Bắt đầu làm bài thi" để rèn luyện ngay!</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = subs.map(sub => renderSubmissionItemHtml(sub)).join('');
  }

  function renderSubmissionItemHtml(sub) {
    const ai = sub.aiEvaluation || {};
    const hasScore = !!(ai.bandOverall && !isNaN(ai.bandOverall));
    const scoreVal = hasScore ? ai.bandOverall : null;

    let scoreBadgeHtml = '';
    if (hasScore) {
      const subScoreDetails = [
        ai.bandTR ? `TR ${ai.bandTR}` : '',
        ai.bandCC ? `CC ${ai.bandCC}` : '',
        ai.bandLR ? `LR ${ai.bandLR}` : '',
        ai.bandGRA ? `GRA ${ai.bandGRA}` : ''
      ].filter(Boolean).join(' • ');

      scoreBadgeHtml = `
        <div class="w-history-score-badge graded">
          <div class="w-score-main">🏆 Band ${scoreVal}</div>
          <div class="w-score-sub">${subScoreDetails || 'Official Band'}</div>
        </div>
      `;
    } else {
      scoreBadgeHtml = `
        <div class="w-history-score-badge pending" onclick="window.viewSubmissionDetail('${sub.id}')" style="cursor:pointer;" title="Bấm để nhập điểm & nhận xét AI">
          <div class="w-score-main">⏳ Chưa chấm</div>
          <div class="w-score-sub">Nhập điểm AI ➜</div>
        </div>
      `;
    }

    const t1Words = sub.task1 ? `${sub.task1.wordCount} từ` : null;
    const t2Words = sub.task2 ? `${sub.task2.wordCount} từ` : null;
    let wordDetails = '';
    if (t1Words && t2Words) wordDetails = `📝 Task 1: <strong>${t1Words}</strong> • 💡 Task 2: <strong>${t2Words}</strong>`;
    else if (t1Words) wordDetails = `📊 Task 1: <strong>${t1Words}</strong>`;
    else if (t2Words) wordDetails = `💡 Task 2: <strong>${t2Words}</strong>`;

    return `
      <div class="w-history-item" id="sub_item_${sub.id}">
        <div class="w-history-left">
          <div class="w-history-title-row">
            <span class="w-history-code-tag">${sub.testCode || 'Đề thi'}</span>
            <span class="w-history-title-text" title="${sub.testTitle}">${sub.testTitle}</span>
          </div>
          <div class="w-history-meta-row">
            <span>📅 ${sub.date || 'Vừa xong'}</span>
            <span>•</span>
            <span>⏱️ ${sub.duration || '60 phút'}</span>
          </div>
          <div class="w-history-words-row">
            ${wordDetails}
          </div>
        </div>

        <div class="w-history-right">
          ${scoreBadgeHtml}
          <div class="w-history-actions">
            <button type="button" class="w-history-btn-view" onclick="window.viewSubmissionDetail('${sub.id}')" title="Xem lại bài viết và đối chiếu bài mẫu kèm nhận xét AI">
              👁️ Xem lại & AI sửa
            </button>
            <button type="button" class="w-history-btn-icon" onclick="window.retakeSubmissionTest('${sub.id}')" title="Làm lại đề thi này">
              🔄
            </button>
            <button type="button" class="w-history-btn-icon del" onclick="window.deleteSubmission('${sub.id}')" title="Xóa bản ghi này">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Tự động khôi phục dữ liệu prompt/images nếu bản ghi cũ bị thiếu (Self-healing mechanism)
  function healSubmissionMissingData(sub) {
    if (!sub) return;
    const lessons = (typeof WritingParser !== 'undefined' && WritingParser.cache) ? WritingParser.getAllLessons() : allLessons;
    let modified = false;

    const baseLesson = lessons.find(l => l.id === sub.testId);

    // 1. Chữa lành Task 1
    if (sub.task1) {
      const isMissingPrompt = !sub.task1.prompt || sub.task1.prompt === 'undefined' || sub.task1.prompt.trim() === '';
      const isMissingImages = !sub.task1.images || !Array.isArray(sub.task1.images) || sub.task1.images.length === 0;

      if (isMissingPrompt || isMissingImages) {
        let match1 = null;
        if (baseLesson && baseLesson.fullTestSpec && baseLesson.fullTestSpec.task1) {
          match1 = baseLesson.fullTestSpec.task1;
        } else if (baseLesson && baseLesson.type === 'practice_task1') {
          match1 = baseLesson;
        } else {
          const cleanTitle = (sub.task1.title || '').replace(/^Task\s*1\s*:\s*/i, '').trim().toLowerCase();
          if (cleanTitle) {
            match1 = lessons.find(l => l.type === 'practice_task1' && l.title && l.title.toLowerCase().includes(cleanTitle));
          }
          if (!match1 && sub.task1.chartType) {
            match1 = lessons.find(l => l.type === 'practice_task1' && l.chartType === sub.task1.chartType && l.images && l.images.length > 0);
          }
          if (!match1) {
            match1 = lessons.find(l => l.type === 'practice_task1' && l.images && l.images.length > 0);
          }
        }

        if (match1) {
          if (isMissingPrompt) {
            sub.task1.prompt = match1.prompt || 'The chart below shows information about the given topic.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\nWrite at least 150 words.';
            modified = true;
          }
          if (isMissingImages && match1.images && match1.images.length > 0) {
            sub.task1.images = match1.images;
            modified = true;
          }
          if (!sub.task1.sampleText && match1.sampleText) {
            sub.task1.sampleText = match1.sampleText;
            modified = true;
          }
          if (!sub.task1.chartType && match1.chartType) {
            sub.task1.chartType = match1.chartType;
            modified = true;
          }
        }
      }
    }

    // 2. Chữa lành Task 2
    if (sub.task2) {
      const isMissingPrompt = !sub.task2.prompt || sub.task2.prompt === 'undefined' || sub.task2.prompt.trim() === '';

      if (isMissingPrompt) {
        let match2 = null;
        if (baseLesson && baseLesson.fullTestSpec && baseLesson.fullTestSpec.task2) {
          match2 = baseLesson.fullTestSpec.task2;
        } else if (baseLesson && baseLesson.type === 'practice_task2') {
          match2 = baseLesson;
        } else {
          const cleanTitle = (sub.task2.title || '').replace(/^Task\s*2\s*:\s*/i, '').trim().toLowerCase();
          if (cleanTitle) {
            match2 = lessons.find(l => l.type === 'practice_task2' && l.title && l.title.toLowerCase().includes(cleanTitle));
          }
          if (!match2) {
            match2 = lessons.find(l => l.type === 'practice_task2' && l.sampleText);
          }
        }

        if (match2) {
          sub.task2.prompt = match2.prompt || 'Give reasons for your answer and include any relevant examples from your own knowledge or experience.\nWrite at least 250 words.';
          if (!sub.task2.sampleText && match2.sampleText) {
            sub.task2.sampleText = match2.sampleText;
          }
          if (!sub.task2.questionType && match2.questionType) {
            sub.task2.questionType = match2.questionType;
          }
          modified = true;
        }
      }
    }

    if (modified) {
      saveWritingSubmissionRecord(sub);
    }
  }

  // Xem chi tiết bài nộp cũ (kèm điểm số và nhận xét của AI)
  global.viewSubmissionDetail = function (subId) {
    const list = getWritingSubmissions();
    const sub = list.find(r => r.id === subId);
    if (!sub) return;

    // Tự động khôi phục dữ liệu prompt/images nếu bản ghi cũ bị thiếu
    healSubmissionMissingData(sub);

    currentActiveSubId = sub.id;

    // Đóng Modal nếu đang mở
    global.closeWritingHistoryModal();

    // Ẩn Sảnh, mở Review
    document.body.classList.remove('s4-cbt-mode', 'in-cbt-mode');
    document.getElementById('practiceZoneLobby').style.display = 'none';
    document.getElementById('practiceZoneContainer').style.display = 'none';
    document.getElementById('studioContainer').style.display = 'none';
    document.getElementById('reviewContainer').style.display = 'block';

    const exitToLobbyBtn = document.getElementById('btnExitReviewToLobby');
    if (exitToLobbyBtn) exitToLobbyBtn.style.display = 'inline-block';

    if (sub.type === 'practice_full' && sub.task1 && sub.task2) {
      lobbySelectedMode = 'both';
      document.getElementById('reviewPzTabs').style.display = 'flex';
      
      activeLesson = {
        id: sub.testId,
        title: sub.testTitle,
        type: 'practice_full',
        category: 'Full Test',
        fullTestSpec: {
          testId: sub.testId,
          testTitle: sub.testTitle,
          task1: sub.task1,
          task2: sub.task2
        }
      };

      currentReviewPzTask = 'task1';
      document.getElementById('revPzBtn_task1')?.classList.add('active');
      document.getElementById('revPzBtn_task2')?.classList.remove('active');
      global.switchReviewPzTask('task1');
    } else {
      const singleTask = (sub.task2 && !sub.task1) ? sub.task2 : sub.task1;
      const singleKey = (sub.task2 && !sub.task1) ? 'task2' : ((sub.testCode && /task\s*2/i.test(sub.testCode)) ? 'task2' : 'task1');
      document.getElementById('reviewPzTabs').style.display = 'none';
      activeLesson = {
        id: sub.testId,
        title: sub.testTitle,
        type: 'practice_single',
        category: (singleKey === 'task2') ? 'Task 2' : (sub.testCode || 'Task 1'),
        prompt: (singleTask && singleTask.prompt) ? singleTask.prompt : '',
        promptHtml: (singleTask && singleTask.promptHtml) ? singleTask.promptHtml : '',
        images: (singleTask && singleTask.images) ? singleTask.images : [],
        userText: (singleTask && singleTask.userText) ? singleTask.userText : '',
        sampleText: (singleTask && singleTask.sampleText) ? singleTask.sampleText : '',
        sampleWordCount: (singleTask && singleTask.wordCount) ? singleTask.wordCount : 0
      };
      global.switchReviewPzTask(singleKey);
    }

    // Điền dữ liệu AI Evaluation
    renderAiEvaluationForm(sub);

    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nút quay lại sảnh từ màn hình Review
  global.exitReviewToLobby = function () {
    document.getElementById('reviewContainer').style.display = 'none';
    document.getElementById('practiceZoneLobby').style.display = 'block';
    if (activeLesson) {
      renderWritingLobby(activeLesson);
    }
  };

  // Làm lại đề thi đã nộp
  global.retakeSubmissionTest = function (subId) {
    const list = getWritingSubmissions();
    const sub = list.find(r => r.id === subId);
    if (!sub) return;

    global.closeWritingHistoryModal();
    healSubmissionMissingData(sub);

    const target = WritingParser.getLessonById(sub.testId) || allLessons.find(l => l.id === sub.testId);
    if (target && target.type === 'practice_full' && target.fullTestSpec) {
      global.selectWritingLesson(target.id);
    } else if (String(sub.testId || '').startsWith('writing_pz_part_') || String(sub.testId || '').startsWith('writing_pz_pair_')) {
      ensureWritingPzLoaded(() => {
        const resolved = WritingParser.getLessonById(sub.testId);
        if (resolved) {
          currentUnitId = 'u_6';
          setupTopSwitch();
          global.selectWritingLesson(resolved.id);
        }
      });
    } else {
      const retakeMode = (sub.task1 && sub.task2) ? 'both' : ((sub.task2 && !sub.task1) ? 'task2' : 'task1');
      const randomTestLesson = {
        id: sub.testId || `writing_pz_retake_${Date.now()}`,
        unitId: 'u_6',
        unitName: 'PRACTICE ZONE',
        type: 'practice_full',
        category: 'Full Test',
        preferredMode: retakeMode,
        title: sub.testTitle || 'IELTS Academic Writing Test',
        actTitle: sub.testTitle || 'IELTS Academic Writing Test',
        chartType: (sub.task1 && sub.task1.chartType) ? sub.task1.chartType : 'Chart',
        questionType: (sub.task2 && sub.task2.questionType) ? sub.task2.questionType : 'Essay',
        topic: (sub.task2 && sub.task2.topic) ? sub.task2.topic : 'General',
        prompt: 'Bài thi thử chuẩn IELTS làm lại từ Lịch sử.',
        promptHtml: '',
        sampleText: '',
        sampleSentences: [],
        sampleWordCount: 0,
        vocabList: [],
        writeExercises: [],
        exerciseTabs: null,
        outline: [],
        fullTestSpec: {
          testId: sub.testId || `retake_${Date.now()}`,
          testTitle: sub.testTitle || 'IELTS Academic Writing Test',
          task1: {
            taskId: 'task1',
            title: (sub.task1 && sub.task1.title) ? sub.task1.title : 'Task 1: Academic Report',
            chartType: (sub.task1 && sub.task1.chartType) ? sub.task1.chartType : 'Chart',
            minWords: 150,
            suggestedTime: '20 minutes',
            prompt: (sub.task1 && sub.task1.prompt && sub.task1.prompt !== 'undefined') ? sub.task1.prompt : 'Đang cập nhật đề bài Task 1...',
            promptHtml: (sub.task1 && sub.task1.promptHtml) ? sub.task1.promptHtml : '',
            images: (sub.task1 && sub.task1.images && sub.task1.images.length > 0) ? sub.task1.images : [],
            sampleText: (sub.task1 && sub.task1.sampleText) ? sub.task1.sampleText : ''
          },
          task2: {
            taskId: 'task2',
            title: (sub.task2 && sub.task2.title) ? sub.task2.title : 'Task 2: Discursive Essay',
            questionType: (sub.task2 && sub.task2.questionType) ? sub.task2.questionType : 'Essay',
            topic: (sub.task2 && sub.task2.topic) ? sub.task2.topic : 'General',
            minWords: 250,
            suggestedTime: '40 minutes',
            prompt: (sub.task2 && sub.task2.prompt && sub.task2.prompt !== 'undefined') ? sub.task2.prompt : 'Đang cập nhật đề bài Task 2...',
            promptHtml: (sub.task2 && sub.task2.promptHtml) ? sub.task2.promptHtml : '',
            images: (sub.task2 && sub.task2.images) ? sub.task2.images : [],
            sampleText: (sub.task2 && sub.task2.sampleText) ? sub.task2.sampleText : ''
          }
        }
      };

      if (!allLessons.some(l => l.id === randomTestLesson.id)) {
        allLessons.unshift(randomTestLesson);
      }
      activeLesson = randomTestLesson;
      currentUnitId = 'u_6';
      setupTopSwitch();
      renderSidebar();
      loadLessonToStudio(randomTestLesson);
    }
  };

  // Xóa bản ghi nộp bài
  global.deleteSubmission = async function (subId) {
    const ok = (window.S4UI && typeof window.S4UI.confirm === 'function')
      ? await window.S4UI.confirm('Bạn có chắc chắn muốn xóa bài thi này khỏi lịch sử lưu trữ?', {
          title: 'Xóa bài thi Writing',
          tone: 'danger',
          confirmText: 'Xóa bài'
        })
      : confirm('Bạn có chắc chắn muốn xóa bài thi này khỏi lịch sử lưu trữ?');
    if (!ok) return;
    let list = getWritingSubmissions();
    list = list.filter(r => r.id !== subId);
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(list));
    renderLobbyHistory();
    renderModalHistory();
    if (window.S4UI) window.S4UI.toast('info', 'Đã xóa bài thi khỏi lịch sử.');
  };

  // Modal Lịch sử trên Topbar
  global.openWritingHistoryModal = function () {
    const modal = document.getElementById('writingHistoryModal');
    if (!modal) return;
    historyActiveFilter = 'all';
    document.querySelectorAll('.w-filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.id === 'hFilter_all');
    });
    renderModalHistory();
    modal.style.display = 'flex';
  };

  global.closeWritingHistoryModal = function () {
    const modal = document.getElementById('writingHistoryModal');
    if (modal) modal.style.display = 'none';
  };

  global.filterHistoryModal = function (filterType) {
    historyActiveFilter = filterType;
    document.querySelectorAll('.w-filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.id === `hFilter_${filterType}`);
    });
    renderModalHistory();
  };

  function renderModalHistory() {
    const listEl = document.getElementById('modalHistoryList');
    if (!listEl) return;

    const allSubs = getWritingSubmissions();
    const gradedCount = allSubs.filter(s => s.aiEvaluation && s.aiEvaluation.bandOverall).length;
    const ungradedCount = allSubs.length - gradedCount;

    const elAll = document.getElementById('hCountAll');
    const elGraded = document.getElementById('hCountGraded');
    const elUngraded = document.getElementById('hCountUngraded');
    if (elAll) elAll.textContent = allSubs.length;
    if (elGraded) elGraded.textContent = gradedCount;
    if (elUngraded) elUngraded.textContent = ungradedCount;

    let filtered = allSubs;
    if (historyActiveFilter === 'graded') {
      filtered = allSubs.filter(s => s.aiEvaluation && s.aiEvaluation.bandOverall);
    } else if (historyActiveFilter === 'ungraded') {
      filtered = allSubs.filter(s => !s.aiEvaluation || !s.aiEvaluation.bandOverall);
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="w-history-empty" style="padding:28px 14px;">
          <span class="w-history-empty-icon">📭</span>
          <strong>Không tìm thấy bài thi nào phù hợp</strong>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(sub => renderSubmissionItemHtml(sub)).join('');
  }

  // 3A. Bắt đầu làm bài thi từ Sảnh (Tự động Fullscreen + CBT Mode)
  global.startWritingExamFromLobby = function () {
    if (!activeLesson || activeLesson.type !== 'practice_full') return;

    // 1. Tự động chuyển toàn màn hình (Fullscreen) nếu người dùng tương tác
    try {
      if (!document.fullscreenElement) {
        const el = document.documentElement;
        if (el.requestFullscreen) {
          el.requestFullscreen().catch(() => {});
        } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen().catch(() => {});
        }
      }
    } catch (err) {}

    // 2. Chuyển sang giao diện CBT Exam Mode (Ẩn Sảnh, Mở Phòng Thi)
    const lobby = document.getElementById('practiceZoneLobby');
    const pzContainer = document.getElementById('practiceZoneContainer');
    if (lobby) lobby.style.display = 'none';
    if (pzContainer) pzContainer.style.display = 'block';

    document.body.classList.add('sidebar-collapsed', 's4-cbt-mode', 'in-cbt-mode');
    const sbLbl = document.querySelector('.s4-desk-sb-lbl');
    if (sbLbl) sbLbl.textContent = '▶ Hiện mục lục';

    // 3. Cài đặt tiêu đề & cỡ chữ
    const titleEl = document.getElementById('pzTestTitle');
    if (titleEl) titleEl.textContent = activeLesson.title;
    window.s4CbtSetWritingFont(lobbySelectedFont);
    const splitEl = document.getElementById('s4CbtSplitArea');
    if (splitEl && !splitEl.classList.contains('mob-view-split') && !splitEl.classList.contains('mob-view-left') && !splitEl.classList.contains('mob-view-right')) {
      window.setPzMobileView('split');
    }

    // 4. Cài đặt Task khởi đầu theo Mode đã chọn & hiển thị tab tương ứng
    const t1Tab = document.getElementById('pzTabBtn_task1');
    const t2Tab = document.getElementById('pzTabBtn_task2');
    if (t1Tab) t1Tab.style.display = (lobbySelectedMode === 'task2') ? 'none' : '';
    if (t2Tab) t2Tab.style.display = (lobbySelectedMode === 'task1') ? 'none' : '';

    currentPzTask = (lobbySelectedMode === 'task2') ? 'task2' : 'task1';
    renderPzTask(activeLesson, currentPzTask);
    updatePzSubWordCounts(activeLesson);
    initPzResizer();

    if (t1Tab) t1Tab.classList.toggle('active', currentPzTask === 'task1');
    if (t2Tab) t2Tab.classList.toggle('active', currentPzTask === 'task2');

    // 5. Khởi động đồng hồ thời gian
    const timerSelect = document.getElementById('pzTimerSelect');
    if (timerSelect) timerSelect.value = String(lobbySelectedTimer);
    if (lobbySelectedTimer === 0) {
      window.changePzTimer(0);
    } else {
      startPzTimer(lobbySelectedTimer * 60);
    }

    // 6. Tự động focus vào ô gõ bài
    setTimeout(() => {
      const editor = document.getElementById('pzEssayEditor');
      if (editor) editor.focus();
    }, 150);
  };

  // 3B. Thoát phòng thi về Sảnh hoặc về bài học
  global.exitPzToLesson = function () {
    const pz = document.getElementById('practiceZoneContainer');
    const lobby = document.getElementById('practiceZoneLobby');
    const st = document.getElementById('studioContainer');

    // Thoát Fullscreen nếu đang bật
    if (document.fullscreenElement) {
      try {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen().catch(() => {});
      } catch (e) {}
    }
    document.body.classList.remove('s4-cbt-mode', 'in-cbt-mode');

    // Nếu đang trong phòng thi đang làm bài -> Dừng giờ & Quay về Sảnh bài thi này
    if (pz && pz.style.display !== 'none') {
      clearInterval(pzTimerInterval);
      isPzTimerRunning = false;
      pz.style.display = 'none';
      if (lobby) {
        lobby.style.display = 'block';
        if (activeLesson) renderWritingLobby(activeLesson);
      }
      return;
    }

    // Nếu đang ở Sảnh hoặc nơi khác -> Thoát ra bài học Studio thường
    if (lobby) lobby.style.display = 'none';
    if (pz) pz.style.display = 'none';
    if (st) st.style.display = 'flex';

    const firstPractice = allLessons.find(l => l.unitId === 'u_3') || allLessons[0];
    if (firstPractice) {
      global.selectWritingLesson(firstPractice.id);
    }
  };

  // 4. BỘ TẠO ĐỀ THI THỬ NGẪU NHIÊN THÔNG MINH (STUDY4 497 x 686 = 340,942+ TỔ HỢP ĐỀ)
  global.generateRandomWritingTest = function (mode = 'both', usePickerFilters = false) {
    ensureWritingPzLoaded((pzCatalog) => {
      const cat = Array.isArray(pzCatalog) ? pzCatalog : [];
      if (cat.length > 0) {
        let t1Pool = cat.filter(p => p.tag === 'Task 1');
        let t2Pool = cat.filter(p => p.tag === 'Task 2');

        if (usePickerFilters) {
          const q = (pickerState.query || '').trim();
          const filterFn = (p) => {
            if (pickerState.series !== 'ALL' && p.series !== pickerState.series) return false;
            if (pickerState.onlySample && !p.sampleId) return false;
            if (!q) return true;
            const hay = `${p.title} ${p.subType || ''} ${p.seriesLabel || ''} ${p.prompt || ''}`;
            return (window.S4UI && typeof window.S4UI.matchesSearch === 'function')
              ? window.S4UI.matchesSearch(hay, q)
              : hay.toLowerCase().includes(q.toLowerCase());
          };
          const fT1 = t1Pool.filter(filterFn);
          const fT2 = t2Pool.filter(filterFn);
          if (fT1.length > 0) t1Pool = fT1;
          if (fT2.length > 0) t2Pool = fT2;
        }

        if (t1Pool.length > 0 && t2Pool.length > 0) {
          document.getElementById('wTestPickerModal')?.remove();

          if (mode === 'task1') {
            const pick1 = t1Pool[Math.floor(Math.random() * t1Pool.length)];
            currentUnitId = 'u_6';
            setupTopSwitch();
            global.selectWritingLesson(`writing_pz_part_${pick1.id}`);
            return;
          }
          if (mode === 'task2') {
            const pick2 = t2Pool[Math.floor(Math.random() * t2Pool.length)];
            currentUnitId = 'u_6';
            setupTopSwitch();
            global.selectWritingLesson(`writing_pz_part_${pick2.id}`);
            return;
          }

          const t1 = t1Pool[Math.floor(Math.random() * t1Pool.length)];
          const t2 = t2Pool[Math.floor(Math.random() * t2Pool.length)];
          const randomTestLesson = WritingParser.buildPzPairLesson(t1.id, t2.id, `Study4 Random Exam #${t1.id}-${t2.id}`);
          if (randomTestLesson) {
            localStorage.setItem(STORAGE_KEY_LAST, randomTestLesson.id);
            activeLesson = randomTestLesson;
            currentUnitId = 'u_6';
            setupTopSwitch();
            renderSidebar();
            loadLessonToStudio(randomTestLesson);
            return;
          }
        }
      }

      // Fallback về khóa học Units 3-5 nếu kho Study4 chưa sẵn sàng
      const lessons = (typeof WritingParser !== 'undefined' && WritingParser.cache) ? WritingParser.getAllLessons() : allLessons;
      const t1List = lessons.filter(l => l.type === 'practice_task1' && l.images && l.images.length > 0 && l.sampleText);
      const t2List = lessons.filter(l => l.type === 'practice_task2' && l.prompt && l.sampleText);
      if (t1List.length === 0 || t2List.length === 0) {
        if (window.S4UI) window.S4UI.alert('Chưa tải đủ dữ liệu bài tập Task 1 và Task 2 để tạo đề thi!', { title: 'Chưa sẵn sàng dữ liệu', tone: 'warn' });
        else alert('Chưa tải đủ dữ liệu bài tập Task 1 và Task 2 để tạo đề thi!');
        return;
      }

      const t1 = t1List[Math.floor(Math.random() * t1List.length)];
      const t2 = t2List[Math.floor(Math.random() * t2List.length)];
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const fallbackLesson = {
        id: `writing_pz_random_${randomCode}`,
        unitId: 'u_6',
        unitName: 'PRACTICE ZONE',
        type: 'practice_full',
        category: 'Full Test',
        preferredMode: 'both',
        title: `Random Test #${randomCode}`,
        actTitle: `Đề thi ngẫu nhiên #${randomCode}`,
        chartType: t1.chartType || 'Chart',
        questionType: t2.questionType || 'Essay',
        topic: t2.topic || 'General',
        prompt: 'Bài thi thử chuẩn IELTS 60 phút gồm Task 1 và Task 2 ngẫu nhiên từ kho dữ liệu.',
        sampleText: '',
        sampleSentences: [],
        sampleWordCount: 0,
        vocabList: [],
        writeExercises: [],
        exerciseTabs: null,
        outline: [],
        fullTestSpec: {
          testId: `random_${randomCode}`,
          testTitle: `IELTS Academic Writing Random Test #${randomCode}`,
          task1: {
            taskId: 'task1',
            title: `Task 1: ${t1.title}`,
            chartType: t1.chartType || 'Chart',
            minWords: 150,
            suggestedTime: '20 minutes',
            prompt: t1.prompt,
            images: t1.images || [],
            sampleText: t1.sampleText
          },
          task2: {
            taskId: 'task2',
            title: `Task 2: ${t2.title}`,
            questionType: t2.questionType || 'Discursive Essay',
            topic: t2.topic || 'General',
            minWords: 250,
            suggestedTime: '40 minutes',
            prompt: t2.prompt,
            images: [],
            sampleText: t2.sampleText
          }
        }
      };

      document.getElementById('wTestPickerModal')?.remove();
      activeLesson = fallbackLesson;
      currentUnitId = 'u_6';
      setupTopSwitch();
      renderSidebar();
      loadLessonToStudio(fallbackLesson);
    });
  };

  function getFilteredPickerEntries() {
    const fullTests = allLessons.filter(l => l.unitId === 'u_6' && l.type === 'practice_full');
    const pzCatalog = WritingParser.getStudy4PzCatalog();
    const q = (pickerState.query || '').trim();
    const matchText = (hay) => (window.S4UI && typeof window.S4UI.matchesSearch === 'function')
      ? window.S4UI.matchesSearch(hay, q)
      : (!q || String(hay || '').toLowerCase().includes(q.toLowerCase()));

    const matchedFull = fullTests.filter(t => {
      if (pickerState.series !== 'ALL' || pickerState.onlySample) {
        if (pickerState.series !== 'ALL') return false;
      }
      return matchText(`${t.title} ${t.chartType || ''} ${t.questionType || ''}`);
    }).map(t => ({ kind: 'full', id: t.id, item: t }));

    const matchedPz = pzCatalog.filter(p => {
      if (pickerState.series !== 'ALL' && p.series !== pickerState.series) return false;
      if (pickerState.onlySample && !p.sampleId) return false;
      return matchText(`${p.title} ${p.subType || ''} ${p.seriesLabel || ''} ${p.prompt || ''}`);
    });

    const t1Filtered = matchedPz.filter(p => p.tag === 'Task 1');
    const t2Filtered = matchedPz.filter(p => p.tag === 'Task 2');

    let combined = [];
    if (pickerState.tab === 'full') {
      combined = matchedFull;
    } else if (pickerState.tab === 'task1') {
      combined = t1Filtered.map(p => ({ kind: 'pz', id: `writing_pz_part_${p.id}`, item: p }));
    } else if (pickerState.tab === 'task2') {
      combined = t2Filtered.map(p => ({ kind: 'pz', id: `writing_pz_part_${p.id}`, item: p }));
    } else {
      combined = matchedFull.concat(matchedPz.map(p => ({ kind: 'pz', id: `writing_pz_part_${p.id}`, item: p })));
    }

    return {
      combined,
      fullCount: matchedFull.length,
      t1Count: t1Filtered.length,
      t2Count: t2Filtered.length,
      totalStudy4: pzCatalog.length,
      totalStudy4T1: pzCatalog.filter(p => p.tag === 'Task 1').length,
      totalStudy4T2: pzCatalog.filter(p => p.tag === 'Task 2').length,
      sampleCount: pzCatalog.filter(p => p.sampleId).length
    };
  }

  function renderWritingPickerBody() {
    const bodyEl = document.getElementById('wPickerDynamicBody');
    if (!bodyEl) return;

    const pzCatalog = WritingParser.getStudy4PzCatalog();
    if (!pzCatalog.length) {
      bodyEl.innerHTML = `<div style="padding:36px 16px;text-align:center;color:var(--muted);font-weight:700;">⏳ Đang nạp kho 1,183 đề Writing Practice Zone từ Study4...</div>`;
      return;
    }

    const res = getFilteredPickerEntries();
    const totalPages = Math.max(1, Math.ceil(res.combined.length / pickerState.pageSize));
    if (pickerState.page > totalPages) pickerState.page = totalPages;
    if (pickerState.page < 1) pickerState.page = 1;

    const startIdx = (pickerState.page - 1) * pickerState.pageSize;
    const pageItems = res.combined.slice(startIdx, startIdx + pickerState.pageSize);
    const doneList = getCompletedLessons();
    const comboCount = (Math.max(1, res.t1Count) * Math.max(1, res.t2Count)).toLocaleString('en-US');

    const tabsHtml = `
      <div class="w-picker-tabs">
        <button type="button" class="w-filter-pill ${pickerState.tab === 'all' ? 'active' : ''}" onclick="window.setWritingPickerTab('all')">
          🔥 Tất cả (${(res.fullCount + res.t1Count + res.t2Count).toLocaleString('en-US')})
        </button>
        <button type="button" class="w-filter-pill ${pickerState.tab === 'full' ? 'active' : ''}" onclick="window.setWritingPickerTab('full')">
          🎯 Full Test chuẩn (${res.fullCount})
        </button>
        <button type="button" class="w-filter-pill ${pickerState.tab === 'task1' ? 'active' : ''}" onclick="window.setWritingPickerTab('task1')">
          📊 Task 1 (${res.t1Count})
        </button>
        <button type="button" class="w-filter-pill ${pickerState.tab === 'task2' ? 'active' : ''}" onclick="window.setWritingPickerTab('task2')">
          💡 Task 2 (${res.t2Count})
        </button>
      </div>
    `;

    const randomBannerHtml = `
      <div class="w-picker-random-box">
        <div style="flex:1;min-width:220px;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span style="font-size:11px;font-weight:900;color:#a855f7;text-transform:uppercase;">🎲 SMART MOCK TEST GENERATOR</span>
            <span style="font-size:10px;padding:2px 8px;border-radius:99px;background:#9333ea;color:#fff;font-weight:800;">${comboCount} TỔ HỢP ĐỀ</span>
          </div>
          <div style="font-size:13.5px;font-weight:800;color:var(--text);margin-top:3px;">Bốc ngẫu nhiên theo bộ lọc đang chọn</div>
          <div style="font-size:11.5px;color:var(--muted);margin-top:2px;">Ghép 1 Task 1 (${res.t1Count} đề) + 1 Task 2 (${res.t2Count} đề) hoặc luyện riêng từng Task</div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button type="button" class="btn btn-primary" style="background:#7c3aed;border-color:#7c3aed;font-weight:800;" onclick="window.generateRandomWritingTest('both', true)">🎲 Full Exam (60p)</button>
          <button type="button" class="btn mini-btn" onclick="window.generateRandomWritingTest('task1', true)">📊 Ngẫu nhiên T1</button>
          <button type="button" class="btn mini-btn" onclick="window.generateRandomWritingTest('task2', true)">💡 Ngẫu nhiên T2</button>
        </div>
      </div>
    `;

    let cardsHtml = '';
    if (pageItems.length === 0) {
      cardsHtml = `
        <div class="s4-empty-state" style="margin-top:6px;">
          <div style="font-size:32px;">🔍</div>
          <div style="font-size:14.5px;font-weight:800;color:var(--text);">Không có đề phù hợp với bộ lọc hiện tại</div>
          <div style="font-size:12.5px;">${pickerState.query ? `Từ khóa "<strong>${escHtml(pickerState.query)}</strong>" không khớp đề nào.` : 'Thử bỏ bớt điều kiện lọc nguồn hoặc bài mẫu.'}</div>
          <button type="button" class="btn btn-primary" onclick="window.resetWritingPickerFilters()">↺ Xóa từ khóa & Xem tất cả</button>
        </div>
      `;
    } else {
      cardsHtml = `<div class="w-picker-grid">` + pageItems.map(entry => {
        const isDone = doneList.includes(entry.id);
        const isActive = activeLesson && activeLesson.id === entry.id;
        if (entry.kind === 'full') {
          const t = entry.item;
          return `
            <div class="w-picker-card ${isActive ? 'active' : ''}" onclick="window.selectWritingPzItem('${escHtml(t.id)}')">
              <div class="w-picker-card-top">
                <span class="w-picker-tag full">🎯 FULL TEST • 60 PHÚT</span>
                <span class="w-picker-sample-badge">🏆 Bài mẫu Simon 8.0+</span>
              </div>
              <div class="w-picker-card-title">${escHtml(t.title)}</div>
              <div class="w-picker-card-meta">Task 1: ${escHtml(t.chartType || 'Chart')} • Task 2: ${escHtml(t.questionType || 'Essay')}${isDone ? ' • ✓ Đã hoàn thành' : ''}</div>
            </div>
          `;
        }
        const p = entry.item;
        const isT1 = p.tag === 'Task 1';
        const preview = (p.prompt || '').replace(/\s+/g, ' ').trim();
        const shortPrev = preview ? (preview.length > 105 ? preview.slice(0, 105) + '...' : preview) : '(Đề thi dạng ảnh biểu đồ — bấm để mở trực tiếp trong phòng thi)';
        return `
          <div class="w-picker-card ${isActive ? 'active' : ''}" onclick="window.selectWritingPzItem('writing_pz_part_${escHtml(p.id)}')">
            <div class="w-picker-card-top">
              <span class="w-picker-tag ${isT1 ? 't1' : 't2'}">${isT1 ? '📊 TASK 1' : '💡 TASK 2'} • ${escHtml(p.seriesLabel)}</span>
              ${p.sampleId ? '<span class="w-picker-sample-badge">🏆 Bài mẫu</span>' : (p.partnerId ? '<span class="w-picker-pair-badge">🔗 Ghép Full</span>' : '')}
            </div>
            <div class="w-picker-card-title">${escHtml(p.title)}</div>
            <div class="w-picker-card-prev">${escHtml(shortPrev)}</div>
            <div class="w-picker-card-meta">${escHtml(p.subType || p.tag)}${p.images && p.images.length ? ` • 🖼️ ${p.images.length} ảnh` : ''}${isDone ? ' • ✓ Đã làm' : ''}</div>
          </div>
        `;
      }).join('') + `</div>`;
    }

    const pagerHtml = totalPages > 1 ? `
      <div class="w-picker-pager">
        <button type="button" class="btn mini-btn" ${pickerState.page <= 1 ? 'disabled' : ''} onclick="window.setWritingPickerPage(${pickerState.page - 1})">◀ Trang trước</button>
        <span style="font-size:12px;font-weight:700;color:var(--muted);">Trang <strong style="color:var(--text);">${pickerState.page}</strong> / ${totalPages} (${res.combined.length.toLocaleString('en-US')} đề)</span>
        <button type="button" class="btn mini-btn" ${pickerState.page >= totalPages ? 'disabled' : ''} onclick="window.setWritingPickerPage(${pickerState.page + 1})">Trang sau ▶</button>
      </div>
    ` : '';

    bodyEl.innerHTML = randomBannerHtml + tabsHtml + cardsHtml + pagerHtml;
  }

  let pickerSearchTimer = null;
  global.filterWritingPicker = function (q, inpEl) {
    const el = inpEl || document.getElementById('wPickerSearchInput');
    if (window.S4UI && typeof window.S4UI.syncSearchClear === 'function' && el) {
      window.S4UI.syncSearchClear(el);
    }
    if (el && el.dataset && el.dataset.composing === '1') return;
    pickerState.query = String(q || '');
    pickerState.page = 1;
    clearTimeout(pickerSearchTimer);
    pickerSearchTimer = setTimeout(renderWritingPickerBody, 110);
  };
  global.submitWritingPickerSearch = function () {
    clearTimeout(pickerSearchTimer);
    const inp = document.getElementById('wPickerSearchInput');
    if (inp) {
      pickerState.query = String(inp.value || '');
      if (window.S4UI && typeof window.S4UI.syncSearchClear === 'function') {
        window.S4UI.syncSearchClear(inp);
      }
    }
    pickerState.page = 1;
    renderWritingPickerBody();
  };
  global.clearWritingPickerSearch = function () {
    clearTimeout(pickerSearchTimer);
    pickerState.query = '';
    pickerState.page = 1;
    const inp = document.getElementById('wPickerSearchInput');
    if (inp) {
      inp.value = '';
      if (window.S4UI && typeof window.S4UI.syncSearchClear === 'function') {
        window.S4UI.syncSearchClear(inp);
      }
      try { inp.focus({ preventScroll: true }); } catch (e) {}
    }
    renderWritingPickerBody();
  };
  global.resetWritingPickerFilters = function () {
    clearTimeout(pickerSearchTimer);
    pickerState.query = '';
    pickerState.tab = 'all';
    pickerState.series = 'ALL';
    pickerState.onlySample = false;
    pickerState.page = 1;
    const inp = document.getElementById('wPickerSearchInput');
    if (inp) {
      inp.value = '';
      if (window.S4UI && typeof window.S4UI.syncSearchClear === 'function') window.S4UI.syncSearchClear(inp);
    }
    const sel = document.getElementById('wPickerSeriesSelect');
    if (sel) sel.value = 'ALL';
    const chk = document.getElementById('wPickerOnlySample');
    if (chk) chk.checked = false;
    renderWritingPickerBody();
  };
  global.setWritingPickerTab = function (tab) {
    pickerState.tab = tab || 'all';
    pickerState.page = 1;
    renderWritingPickerBody();
  };
  global.setWritingPickerSeries = function (series) {
    pickerState.series = series || 'ALL';
    pickerState.page = 1;
    renderWritingPickerBody();
  };
  global.toggleWritingPickerSample = function (checked) {
    pickerState.onlySample = Boolean(checked);
    pickerState.page = 1;
    renderWritingPickerBody();
  };
  global.setWritingPickerPage = function (p) {
    pickerState.page = Number(p) || 1;
    renderWritingPickerBody();
    const bodyEl = document.getElementById('wPickerDynamicBody');
    if (bodyEl) bodyEl.scrollTop = 0;
  };
  global.selectWritingPzItem = function (lessonId) {
    document.getElementById('wTestPickerModal')?.remove();
    currentUnitId = 'u_6';
    setupTopSwitch();
    global.selectWritingLesson(lessonId);
  };

  // 5. Mở popup Đổi đề thi thử trong Kho đề Study4 (1,183 đề)
  global.openWritingTestPicker = function () {
    document.getElementById('wTestPickerModal')?.remove();
    const modal = document.createElement('div');
    modal.id = 'wTestPickerModal';
    modal.className = 'w-modal-backdrop';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    const searchHtml = (window.S4UI && typeof window.S4UI.buildSearchBarHtml === 'function')
      ? window.S4UI.buildSearchBarHtml({
          id: 'wPickerSearchInput',
          value: pickerState.query || '',
          placeholder: 'Tìm theo từ khóa, ngày [06/2020], biểu đồ Line Graph, Opinion...',
          trackIme: true,
          wrapStyle: 'flex:1;min-width:240px;',
          oninput: 'window.filterWritingPicker(this.value, this)',
          onkeydown: "if(event.key==='Enter'){event.preventDefault();window.submitWritingPickerSearch();}else if(event.key==='Escape'&&this.value){event.preventDefault();window.clearWritingPickerSearch();}",
          onclear: 'window.clearWritingPickerSearch()',
          onsubmit: 'window.submitWritingPickerSearch()'
        })
      : `<input type="text" id="wPickerSearchInput" class="search-box" style="flex:1;min-width:200px;margin:0;" placeholder="🔍 Tìm theo từ khóa, ngày [06/2020], biểu đồ Line Graph, Opinion..." value="${escHtml(pickerState.query)}" oninput="window.filterWritingPicker(this.value)">`;
    modal.innerHTML = `
      <div class="w-history-modal-box" style="max-width:980px;max-height:90vh;">
        <div class="w-history-modal-head">
          <div>
            <h3 style="margin:0;font-size:16px;font-weight:800;color:var(--text);">📚 KHO ĐỀ WRITING PRACTICE ZONE (1,183 ĐỀ STUDY4 + 3 FULL TEST)</h3>
            <div style="font-size:12px;color:var(--muted);margin-top:2px;">497 đề Task 1 • 686 đề Task 2 • Luyện từng Task (20p/40p) hoặc ghép Full Exam (60p)</div>
          </div>
          <button type="button" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--muted);" onclick="document.getElementById('wTestPickerModal')?.remove()">✕</button>
        </div>
        <div class="w-picker-controls">
          ${searchHtml}
          <select id="wPickerSeriesSelect" class="w-picker-select" onchange="window.setWritingPickerSeries(this.value)">
            <option value="ALL" ${pickerState.series === 'ALL' ? 'selected' : ''}>🌐 Tất cả nguồn (1,183)</option>
            <option value="actual_tests" ${pickerState.series === 'actual_tests' ? 'selected' : ''}>📅 Actual Tests theo ngày (632)</option>
            <option value="sample_pack" ${pickerState.series === 'sample_pack' ? 'selected' : ''}>📦 IELTS Sample Pack 1 (313)</option>
            <option value="sample_test" ${pickerState.series === 'sample_test' ? 'selected' : ''}>📝 Sample Tests 1–76 (152)</option>
            <option value="recent_actual" ${pickerState.series === 'recent_actual' ? 'selected' : ''}>🔥 Recent Actual Tests (68)</option>
            <option value="bc_ielts" ${pickerState.series === 'bc_ielts' ? 'selected' : ''}>🇬🇧 BC IELTS Writing (18)</option>
          </select>
          <label class="w-picker-check">
            <input type="checkbox" id="wPickerOnlySample" ${pickerState.onlySample ? 'checked' : ''} onchange="window.toggleWritingPickerSample(this.checked)">
            <span>🏆 Có bài mẫu (218)</span>
          </label>
        </div>
        <div id="wPickerDynamicBody" class="w-picker-scroll"></div>
      </div>
    `;
    document.body.appendChild(modal);
    renderWritingPickerBody();
    if (!Array.isArray(global.__STUDY4_WRITING_PZ)) {
      ensureWritingPzLoaded(() => renderWritingPickerBody());
    }
  };

  // 5. Chuyển đổi chế độ xem trên di động (Mobile Switcher)
  global.setPzMobileView = function (mode) {
    const area = document.getElementById('s4CbtSplitArea');
    if (!area) return;
    area.classList.remove('mob-view-split', 'mob-view-left', 'mob-view-right');
    area.classList.add(`mob-view-${mode}`);

    document.querySelectorAll('#pzMobileSwitcher .s4-cbt-mob-tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-mview') === mode);
    });
  };

  // 6. Đổi thời gian Timer (60p / 40p / 20p / đếm xuôi)
  global.changePzTimer = function (mins) {
    if (mins === 0) {
      // Đếm xuôi từ 0
      clearInterval(pzTimerInterval);
      pzTimerSecondsLeft = 0;
      isPzTimerRunning = true;
      pzTimerInterval = setInterval(() => {
        if (!isPzTimerRunning) return;
        pzTimerSecondsLeft++;
        updatePzTimerDisplay(true);
      }, 1000);
      updatePzTimerDisplay(true);
    } else {
      startPzTimer(mins * 60);
    }
  };

  function loadPracticeZone(lesson) {
    const titleEl = document.getElementById('pzTestTitle');
    if (titleEl) titleEl.textContent = lesson.title;
    const splitEl = document.getElementById('s4CbtSplitArea');
    if (splitEl && !splitEl.classList.contains('mob-view-split') && !splitEl.classList.contains('mob-view-left') && !splitEl.classList.contains('mob-view-right')) {
      window.setPzMobileView('split');
    }

    startPzTimer(3600);
    currentPzTask = 'task1';
    renderPzTask(lesson, 'task1');
    updatePzSubWordCounts(lesson);
    initPzResizer();
  }

  function startPzTimer(seconds) {
    clearInterval(pzTimerInterval);
    pzTimerSecondsLeft = seconds;
    isPzTimerRunning = true;
    updatePzTimerDisplay(false);

    pzTimerInterval = setInterval(() => {
      if (!isPzTimerRunning) return;
      pzTimerSecondsLeft--;
      updatePzTimerDisplay(false);
      if (pzTimerSecondsLeft <= 0) {
        clearInterval(pzTimerInterval);
        isPzTimerRunning = false;
        global.submitPzExamAndReview({ skipConfirm: true });
        if (window.S4UI) window.S4UI.alert('Đã hết thời gian 60 phút thi thử Full Exam! Hệ thống đã nộp bài để bạn đối chiếu bài mẫu Band 8.0+!', { title: 'Hết giờ làm bài', icon: '⏰', tone: 'warn', confirmText: 'Xem kết quả' });
        else alert('⏰ Đã hết thời gian 60 phút thi thử Full Exam! Hệ thống sẽ nộp bài để đối chiếu bài mẫu Band 8.0+!');
      }
    }, 1000);
  }

  function updatePzTimerDisplay(isCountUp = false) {
    const display = document.getElementById('pzTimerDisplay');
    const timerBox = document.getElementById('s4CbtTimerBox') || document.getElementById('pzTimer');
    if (!display || !timerBox) return;

    const m = Math.floor(pzTimerSecondsLeft / 60);
    const s = pzTimerSecondsLeft % 60;
    display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    timerBox.classList.remove('warn-10m', 'warn-5m');
    if (!isCountUp) {
      if (pzTimerSecondsLeft <= 300) timerBox.classList.add('warn-5m');
      else if (pzTimerSecondsLeft <= 600) timerBox.classList.add('warn-10m');
    }
  }

  global.togglePzTimer = function () {
    isPzTimerRunning = !isPzTimerRunning;
    const btn = document.getElementById('btnTogglePzTimer');
    if (btn) btn.textContent = isPzTimerRunning ? '⏸' : '▶';
  };

  function getPzDraftKey(testId, taskKey) {
    return `lp_pz_draft_${testId}_${taskKey}`;
  }

  function readPzDraft(testId, taskKey) {
    const key = getPzDraftKey(testId, taskKey);
    if (Object.prototype.hasOwnProperty.call(memoryPzDrafts, key)) {
      return memoryPzDrafts[key];
    }
    try {
      return localStorage.getItem(key) || '';
    } catch (e) {
      return '';
    }
  }

  function saveCurrentPzTaskDraft() {
    if (!activeLesson || activeLesson.type !== 'practice_full') return true;
    const editor = document.getElementById('pzEssayEditor');
    if (!editor) return true;
    const text = editor.value;
    const key = getPzDraftKey(activeLesson.id, currentPzTask);
    memoryPzDrafts[key] = text;
    let persisted = true;
    try {
      localStorage.setItem(key, text);
    } catch (e) {
      persisted = false;
      warnQuotaOnce();
    }
    updatePzSubWordCounts(activeLesson);
    return persisted;
  }

  function updatePzSubWordCounts(lesson) {
    const t1Text = readPzDraft(lesson.id, 'task1');
    const t2Text = readPzDraft(lesson.id, 'task2');
    const t1Words = countWords(t1Text);
    const t2Words = countWords(t2Text);
    const includeT1 = (lobbySelectedMode !== 'task2');
    const includeT2 = (lobbySelectedMode !== 'task1');
    const totalWords = (includeT1 ? t1Words : 0) + (includeT2 ? t2Words : 0);

    const sub1 = document.getElementById('pzTask1SubWord');
    const sub2 = document.getElementById('pzTask2SubWord');
    const totalEl = document.getElementById('pzTotalWordCount');
    const mobEl = document.getElementById('pzMobWordCount');

    if (sub1) sub1.textContent = `${t1Words}/150${t1Words >= 150 ? '✓' : ''}`;
    if (sub2) sub2.textContent = `${t2Words}/250${t2Words >= 250 ? '✓' : ''}`;
    if (totalEl) totalEl.textContent = `${totalWords} từ`;
    if (mobEl) mobEl.textContent = `${currentPzTask === 'task1' ? t1Words : t2Words} từ`;
  }

  global.switchPzTask = function (taskKey) {
    saveCurrentPzTaskDraft();
    currentPzTask = taskKey;

    document.getElementById('pzTabBtn_task1')?.classList.toggle('active', taskKey === 'task1');
    document.getElementById('pzTabBtn_task2')?.classList.toggle('active', taskKey === 'task2');

    if (activeLesson) {
      renderPzTask(activeLesson, taskKey);
    }
  };

  function renderPzTask(lesson, taskKey) {
    const spec = lesson.fullTestSpec;
    if (!spec) return;
    const taskData = (taskKey === 'task1') ? spec.task1 : spec.task2;
    const pane = document.getElementById('pzPromptPane');
    const leftHeader = document.getElementById('pzLeftColHeader');
    const editorHeader = document.getElementById('pzEditorHeaderLbl');
    const minWEl = document.getElementById('pzMinWordTarget');
    const editor = document.getElementById('pzEssayEditor');
    const bannerText = document.getElementById('pzPartBannerText');

    if (bannerText) {
      if (taskKey === 'task1') {
        bannerText.innerHTML = `<strong>Task 1: Academic Report (Biểu đồ):</strong> You should spend about <strong>20 minutes</strong> on this task. Write at least <strong>150 words</strong>.`;
      } else {
        bannerText.innerHTML = `<strong>Task 2: Discursive Essay (Bài luận):</strong> You should spend about <strong>40 minutes</strong> on this task. Write at least <strong>250 words</strong>.`;
      }
    }

    if (leftHeader) {
      leftHeader.textContent = (taskKey === 'task1') ? '📖 ĐỀ BÀI TASK 1 & DỮ LIỆU BIỂU ĐỒ (REPORT)' : '📖 ĐỀ BÀI TASK 2 (ESSAY PROMPT)';
    }
    if (editorHeader) {
      editorHeader.textContent = (taskKey === 'task1') ? '✍️ BÀI LÀM TASK 1 (YOUR REPORT)' : '✍️ BÀI LÀM TASK 2 (YOUR ESSAY)';
    }
    if (minWEl) {
      minWEl.textContent = `(Mục tiêu: ${taskData.minWords} từ)`;
    }

    const taskImages = (taskData.images && taskData.images.length > 0) ? taskData.images : (lesson.images || []);
    let chartHtml = '';
    if (taskImages.length > 0) {
      chartHtml = `
        <div class="w-chart-wrap" style="margin-top:14px;">
          ${renderChartImagesHtml(taskImages, 'w-chart-img', 'Biểu đồ đề thi')}
          <div style="font-size:11px;color:var(--muted);margin-top:6px;">🔍 Nhấp vào ảnh để phóng to toàn màn hình${taskImages.length > 1 ? ` (${taskImages.length} hình)` : ''}</div>
        </div>
      `;
    }

    const promptHtml = renderPzPromptHtml(taskData, lesson.prompt);

    if (pane) {
      pane.innerHTML = `
        <div class="w-prompt-card">
          <div class="w-prompt-lbl" style="font-size:12px;color:var(--primary);margin-bottom:6px;">
            ${(taskKey === 'task1') ? '📊 TASK 1 • ACADEMIC REPORT (20 PHÚT)' : '💡 TASK 2 • DISCURSIVE ESSAY (40 PHÚT)'}
          </div>
          <h2 style="font-size:17px;font-weight:800;color:var(--text);margin-bottom:10px;">${escHtml(taskData.title)}</h2>
          <div class="w-prompt-desc" style="font-size:15px;line-height:1.7;">${promptHtml}</div>
        </div>
        ${chartHtml}
      `;
    }

    const saved = readPzDraft(lesson.id, taskKey);
    if (editor) {
      editor.value = saved;
      handlePzEditorInput();
    }
  }

  function handlePzEditorInput() {
    const editor = document.getElementById('pzEssayEditor');
    const badge = document.getElementById('pzWordCountBadge');
    const countText = document.getElementById('pzWordCountText');
    if (!editor || !badge || !countText || !activeLesson) return;

    const text = editor.value;
    const count = countWords(text);
    countText.textContent = `${count} từ`;

    const minW = (currentPzTask === 'task1') ? 150 : 250;
    if (count >= minW) {
      badge.classList.remove('under');
      badge.classList.add('ready');
    } else {
      badge.classList.remove('ready');
      badge.classList.add('under');
    }

    const persisted = saveCurrentPzTaskDraft();

    const statusEl = document.getElementById('pzAutosaveStatus');
    if (statusEl) {
      const now = new Date();
      if (persisted) {
        statusEl.innerHTML = `<span style="color:var(--primary);">✓ Đã lưu tự động (${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')})</span>`;
      } else {
        statusEl.innerHTML = `<span style="color:#f59e0b;">⚠️ Đầy bộ nhớ — đang giữ trên RAM (${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')})</span>`;
      }
    }
  }

  global.clearCurrentPzTask = async function () {
    if (!activeLesson) return;
    const taskLabel = currentPzTask === 'task1' ? 'Task 1' : 'Task 2';
    const ok = (window.S4UI && typeof window.S4UI.confirm === 'function')
      ? await window.S4UI.confirm(`Bạn có chắc chắn muốn xóa toàn bộ bài làm của ${taskLabel} để viết lại?`, {
          title: `Xóa bài làm ${taskLabel}`,
          tone: 'danger',
          confirmText: 'Xóa viết lại'
        })
      : confirm(`Bạn có chắc chắn muốn xóa toàn bộ bài làm của ${taskLabel} để viết lại?`);
    if (ok) {
      const editor = document.getElementById('pzEssayEditor');
      if (editor) editor.value = '';
      saveCurrentPzTaskDraft();
      handlePzEditorInput();
      if (window.S4UI) window.S4UI.toast('info', `Đã xóa bài làm ${taskLabel}.`);
    }
  };

  global.submitPzExamAndReview = async function (opts) {
    if (!activeLesson || !activeLesson.fullTestSpec) return;
    saveCurrentPzTaskDraft();

    const includeT1 = (lobbySelectedMode !== 'task2');
    const includeT2 = (lobbySelectedMode !== 'task1');
    const isDualMode = includeT1 && includeT2;

    const t1Text = readPzDraft(activeLesson.id, 'task1');
    const t2Text = readPzDraft(activeLesson.id, 'task2');
    const t1Words = countWords(t1Text);
    const t2Words = countWords(t2Text);

    const skipConfirm = !!(opts && opts.skipConfirm === true);
    const t1Short = includeT1 && t1Words < 150;
    const t2Short = includeT2 && t2Words < 250;
    const isTooShort = t1Short || t2Short;
    if (!skipConfirm) {
      const confirmFn = (window.S4UI && typeof window.S4UI.confirm === 'function')
        ? (msg, cfg) => window.S4UI.confirm(msg, cfg)
        : (typeof window.confirm === 'function' ? (msg) => window.confirm(msg) : () => true);
      if (isTooShort) {
        const parts = [];
        if (includeT1) parts.push(`Task 1: ${t1Words}/150 từ`);
        if (includeT2) parts.push(`Task 2: ${t2Words}/250 từ`);
        const okShort = await confirmFn(
          `Bài viết chưa đạt chuẩn độ dài tối thiểu IELTS (${parts.join(' • ')}). Bạn có chắc chắn muốn nộp bài ngay không?`,
          {
            title: 'Bài viết chưa đủ độ dài tối thiểu',
            tone: 'warn',
            confirmText: 'Vẫn nộp bài',
            cancelText: 'Viết tiếp'
          }
        );
        if (!okShort) return;
      } else {
        const okSubmit = await confirmFn(
          'Bạn đã kiểm tra lại bài viết và sẵn sàng nộp để đối chiếu & chấm điểm?',
          {
            title: 'Xác nhận nộp bài Writing',
            tone: 'info',
            confirmText: 'Nộp bài',
            cancelText: 'Kiểm tra lại'
          }
        );
        if (!okSubmit) return;
      }
    }

    clearInterval(pzTimerInterval);
    isPzTimerRunning = false;
    markLessonCompleted(activeLesson.id);

    if (document.fullscreenElement) {
      try {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen().catch(() => {});
      } catch (e) {}
    }
    document.body.classList.remove('s4-cbt-mode', 'in-cbt-mode');
    const lobby = document.getElementById('practiceZoneLobby');
    if (lobby) lobby.style.display = 'none';
    document.getElementById('practiceZoneContainer').style.display = 'none';
    document.getElementById('reviewContainer').style.display = 'block';

    const pzTabs = document.getElementById('reviewPzTabs');
    if (pzTabs) pzTabs.style.display = isDualMode ? 'flex' : 'none';

    const initialReviewKey = includeT1 ? 'task1' : 'task2';
    currentReviewPzTask = initialReviewKey;
    global.switchReviewPzTask(initialReviewKey);

    // Tạo bản ghi Lịch sử nộp bài thi
    const now = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} • ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const codeMatch = activeLesson.title.match(/#\d+/);
    const testCode = isDualMode
      ? (codeMatch ? `Đề ${codeMatch[0]}` : 'Full Test')
      : (includeT1 ? 'Task 1 PZ' : 'Task 2 PZ');

    const totalSpentSec = Math.max(60, (lobbySelectedTimer > 0 ? lobbySelectedTimer * 60 : 3600) - pzTimerSecondsLeft);
    const spentMin = Math.max(1, Math.round(totalSpentSec / 60));
    const durationText = `${spentMin} phút`;

    const subRecord = {
      id: `sub_${Date.now()}`,
      skill: 'writing',
      type: isDualMode ? 'practice_full' : 'practice_single',
      testId: activeLesson.id,
      testCode: testCode,
      testTitle: activeLesson.title,
      date: dateStr,
      timestamp: Date.now(),
      duration: durationText,
      task1: includeT1 ? {
        taskId: 'task1',
        title: activeLesson.fullTestSpec ? activeLesson.fullTestSpec.task1.title : activeLesson.title,
        chartType: activeLesson.fullTestSpec ? (activeLesson.fullTestSpec.task1.chartType || 'Chart') : (activeLesson.chartType || 'Chart'),
        prompt: activeLesson.fullTestSpec ? activeLesson.fullTestSpec.task1.prompt : (activeLesson.prompt || ''),
        promptHtml: activeLesson.fullTestSpec ? (activeLesson.fullTestSpec.task1.promptHtml || '') : '',
        images: activeLesson.fullTestSpec ? (activeLesson.fullTestSpec.task1.images || []) : (activeLesson.images || []),
        userText: t1Text,
        wordCount: t1Words,
        minWords: 150,
        sampleText: activeLesson.fullTestSpec ? activeLesson.fullTestSpec.task1.sampleText : (activeLesson.sampleText || '')
      } : null,
      task2: includeT2 ? {
        taskId: 'task2',
        title: activeLesson.fullTestSpec ? activeLesson.fullTestSpec.task2.title : 'Task 2: Discursive Essay',
        questionType: activeLesson.fullTestSpec ? (activeLesson.fullTestSpec.task2.questionType || 'Essay') : (activeLesson.questionType || 'Essay'),
        topic: activeLesson.fullTestSpec ? (activeLesson.fullTestSpec.task2.topic || 'General') : (activeLesson.topic || 'General'),
        prompt: activeLesson.fullTestSpec ? activeLesson.fullTestSpec.task2.prompt : (activeLesson.prompt || ''),
        promptHtml: activeLesson.fullTestSpec ? (activeLesson.fullTestSpec.task2.promptHtml || '') : '',
        images: activeLesson.fullTestSpec ? (activeLesson.fullTestSpec.task2.images || []) : [],
        userText: t2Text,
        wordCount: t2Words,
        minWords: 250,
        sampleText: activeLesson.fullTestSpec ? activeLesson.fullTestSpec.task2.sampleText : ''
      } : null,
      aiEvaluation: {
        bandOverall: '',
        bandTR: '',
        bandCC: '',
        bandLR: '',
        bandGRA: '',
        feedback: '',
        corrections: '',
        updatedAt: null
      }
    };

    saveWritingSubmissionRecord(subRecord);
    currentActiveSubId = subRecord.id;
    renderAiEvaluationForm(subRecord);
  };

  global.switchReviewPzTask = function (taskKey) {
    if (!activeLesson) return;
    currentReviewPzTask = taskKey;

    document.getElementById('revPzBtn_task1')?.classList.toggle('active', taskKey === 'task1');
    document.getElementById('revPzBtn_task2')?.classList.toggle('active', taskKey === 'task2');

    const isFull = !!(activeLesson.type === 'practice_full' && activeLesson.fullTestSpec);
    let taskData = null;
    if (isFull) {
      taskData = (taskKey === 'task1') ? activeLesson.fullTestSpec.task1 : activeLesson.fullTestSpec.task2;
    } else {
      taskData = {
        title: activeLesson.title,
        chartType: activeLesson.chartType || 'Task',
        questionType: activeLesson.questionType || 'Essay',
        prompt: activeLesson.prompt || '',
        promptHtml: activeLesson.promptHtml || '',
        images: activeLesson.images || [],
        userText: activeLesson.userText || '',
        sampleText: activeLesson.sampleText || '',
        minWords: (activeLesson.category === 'Task 1') ? 150 : 250
      };
    }

    if (!taskData) return;

    // 1. Lấy bài làm: Ưu tiên bài đã lưu trong bản ghi lịch sử, nếu không có mới lấy từ nháp tạm
    let userText = '';
    if (taskData.userText && typeof taskData.userText === 'string' && taskData.userText.trim().length > 0) {
      userText = taskData.userText;
    } else {
      userText = readPzDraft(activeLesson.id, taskKey) || (activeLesson.userText || '');
    }

    const userWords = countWords(userText);
    const sampleText = taskData.sampleText || '';
    const sampleWords = countWords(sampleText);

    // 2. Cập nhật Khung Đề Bài & Biểu đồ Review
    renderReviewPromptCard(taskKey, taskData);

    // 3. Cập nhật bài làm & bài mẫu song song
    const reviewUser = document.getElementById('reviewUserEssay');
    const reviewSample = document.getElementById('reviewSampleEssay');
    const userBadge = document.getElementById('reviewUserWordCount');
    const sampleBadge = document.getElementById('reviewSampleWordCount');

    if (reviewUser) reviewUser.textContent = userText || '(Chưa có bài làm cho Task này)';
    if (reviewSample) {
      reviewSample.textContent = sampleText || '(Đề luyện tập Study4 Practice Zone — bấm nút "📋 Copy Prompt chấm AI" ở góc trên để gửi sang ChatGPT/Claude chấm điểm 4 tiêu chí IELTS & viết bài mẫu Band 8.0+ tham khảo.)';
    }
    if (userBadge) {
      const minW = taskData.minWords || (taskKey === 'task1' ? 150 : 250);
      userBadge.textContent = `${userWords} từ (Mục tiêu: ${minW} từ)`;
      if (userWords >= minW) {
        userBadge.style.background = 'rgba(16, 185, 129, 0.15)';
        userBadge.style.color = '#10b981';
      } else {
        userBadge.style.background = 'rgba(239, 68, 68, 0.12)';
        userBadge.style.color = '#ef4444';
      }
    }
    if (sampleBadge) sampleBadge.textContent = `${sampleWords} từ (Band 8.0+)`;
  };

  global.toggleReviewPromptCollapse = function () {
    const body = document.getElementById('reviewPromptBody');
    const btn = document.getElementById('btnToggleReviewPrompt');
    if (!body || !btn) return;

    const isCollapsed = body.style.display === 'none';
    if (isCollapsed) {
      body.style.display = 'block';
      btn.textContent = '▲ Thu gọn đề bài';
    } else {
      body.style.display = 'none';
      btn.textContent = '▼ Xem đề bài';
    }
  };

  function copyPromptForAI() {
    if (!activeLesson) return;

    if (activeLesson.type === 'practice_full' && activeLesson.fullTestSpec) {
      const spec = activeLesson.fullTestSpec;
      const includeT1 = lobbySelectedMode !== 'task2';
      const includeT2 = lobbySelectedMode !== 'task1';
      const t1User = (spec.task1 && spec.task1.userText) ? spec.task1.userText : readPzDraft(activeLesson.id, 'task1');
      const t2User = (spec.task2 && spec.task2.userText) ? spec.task2.userText : readPzDraft(activeLesson.id, 'task2');

      const sections = [];
      if (includeT1 && spec.task1) {
        sections.push(`==================================================
PHẦN 1: IELTS WRITING TASK 1 (20 PHÚT)
==================================================
ĐỀ BÀI TASK 1:
${spec.task1.prompt || spec.task1.title}

BÀI LÀM TASK 1 CỦA THÍ SINH:
${t1User || '(Chưa nhập bài làm)'}${spec.task1.sampleText ? `\n\nBÀI MẪU BAND 8.0+ THAM KHẢO TASK 1:\n${spec.task1.sampleText}` : ''}`);
      }
      if (includeT2 && spec.task2) {
        sections.push(`==================================================
PHẦN ${includeT1 ? '2' : '1'}: IELTS WRITING TASK 2 (40 PHÚT)
==================================================
ĐỀ BÀI TASK 2:
${spec.task2.prompt || spec.task2.title}

BÀI LÀM TASK 2 CỦA THÍ SINH:
${t2User || '(Chưa nhập bài làm)'}${spec.task2.sampleText ? `\n\nBÀI MẪU BAND 8.0+ THAM KHẢO TASK 2:\n${spec.task2.sampleText}` : ''}`);
      }

      const aiPrompt = `Xin hãy đóng vai Giám khảo IELTS giàu kinh nghiệm (IELTS Senior Examiner). Hãy chấm điểm chi tiết bài IELTS Writing sau đây của tôi theo 4 tiêu chí chính thức (Task Achievement/Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy).

${sections.join('\n\n')}

==================================================
YÊU CẦU NHẬN XÉT & CHẤM ĐIỂM:
1. Cho Band điểm ước lượng từng tiêu chí (TR/TA, CC, LR, GRA) và Overall Band Writing.
2. Nhận xét chi tiết ưu điểm và lỗi sai ngữ pháp/từ vựng cần khắc phục.
3. Gợi ý các câu nâng cấp Band 8.0+ hoặc viết một bài mẫu Band 8.0+ tham khảo.`;

      navigator.clipboard.writeText(aiPrompt).then(() => {
        if (window.S4UI) window.S4UI.toast('success', '📋 Đã sao chép trọn vẹn Prompt chấm AI vào bộ nhớ tạm!', { duration: 3200 });
        else alert('📋 Đã sao chép trọn vẹn Prompt chấm AI vào bộ nhớ tạm! Bạn có thể dán (Ctrl + V) sang ChatGPT hoặc Claude để nhận nhận xét ngay!');
      }).catch(() => {
        if (window.S4UI) window.S4UI.prompt('Không thể sao chép tự động, hãy chọn và chép Prompt bên dưới:', aiPrompt, { title: 'Sao chép Prompt AI', multiline: true, readOnly: true, confirmText: 'Đóng' });
      });
      return;
    }

    const editor = document.getElementById('essayEditor');
    const userText = (activeLesson.type === 'practice_single' && activeLesson.userText)
      ? activeLesson.userText.trim()
      : (editor ? editor.value.trim() : '');
    const sampleBlock = activeLesson.sampleText ? `\n\nBÀI MẪU BAND 8.0+ THAM KHẢO:\n${activeLesson.sampleText}` : '';

    const aiPrompt = `Xin hãy đóng vai Giám khảo IELTS giàu kinh nghiệm (IELTS Senior Examiner). Hãy chấm điểm chi tiết bài viết IELTS Writing sau đây của tôi theo 4 tiêu chí chính thức (Task Achievement/Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy).

ĐỀ BÀI (EXAM PROMPT):
${activeLesson.prompt || activeLesson.title}

BÀI LÀM CỦA THÍ SINH:
${userText || '(Chưa nhập bài làm)'}${sampleBlock}

Hãy chỉ rõ:
1. Band điểm ước lượng cho từng tiêu chí và Band điểm Overall.
2. Các lỗi ngữ pháp, dùng từ cần sửa.
3. Các gợi ý nâng cấp câu văn lên chuẩn Band 8.0+.`;

    navigator.clipboard.writeText(aiPrompt).then(() => {
      if (window.S4UI) window.S4UI.toast('success', '📋 Đã sao chép prompt chấm AI hoàn chỉnh vào bộ nhớ tạm!', { duration: 3200 });
      else alert('📋 Đã sao chép prompt chấm AI hoàn chỉnh vào bộ nhớ tạm! Bạn có thể dán (Ctrl + V) sang ChatGPT hoặc Claude để nhận nhận xét ngay!');
    }).catch(() => {
      if (window.S4UI) window.S4UI.prompt('Không thể sao chép tự động, hãy chọn và chép Prompt bên dưới:', aiPrompt, { title: 'Sao chép Prompt AI', multiline: true, readOnly: true, confirmText: 'Đóng' });
    });
  }

  // =========================================================================
  // 10. LIGHTBOX & SIDEBAR
  // =========================================================================
  function closeWritingMobileDrawer() {
    const sb = document.getElementById('writingSidebar');
    const bd = document.getElementById('sidebarBackdrop');
    if (sb) sb.classList.remove('open');
    if (bd) bd.classList.remove('open');
    document.body.classList.remove('sidebar-open');
  }

  global.toggleWritingSidebar = function (forcedState) {
    if (window.innerWidth <= 860) {
      const sb = document.getElementById('writingSidebar');
      const bd = document.getElementById('sidebarBackdrop');
      if (!sb || !bd) return;
      const isOpen = (typeof forcedState === 'boolean') ? forcedState : !sb.classList.contains('open');
      sb.classList.toggle('open', isOpen);
      bd.classList.toggle('open', isOpen);
      document.body.classList.toggle('sidebar-open', isOpen);
    } else {
      closeWritingMobileDrawer();
      const nextCol = (typeof forcedState === 'boolean') ? !forcedState : !document.body.classList.contains('sidebar-collapsed');
      document.body.classList.toggle('sidebar-collapsed', nextCol);
      const lbl = document.querySelector('.s4-desk-sb-lbl');
      if (lbl) {
        lbl.textContent = nextCol ? '▶ Hiện mục lục' : '◀ Ẩn mục lục';
      }
    }
  };

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeWritingMobileDrawer();
  });
  if (typeof window.matchMedia === 'function') {
    const wMq = window.matchMedia('(min-width: 861px)');
    if (wMq.addEventListener) wMq.addEventListener('change', (e) => { if (e.matches) closeWritingMobileDrawer(); });
    else if (wMq.addListener) wMq.addListener((e) => { if (e.matches) closeWritingMobileDrawer(); });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const lb = document.getElementById('chartLightbox');
    if (lb && lb.classList.contains('active')) {
      global.closeLightbox();
      return;
    }
    const hm = document.getElementById('writingHistoryModal');
    if (hm && hm.style.display && hm.style.display !== 'none') {
      global.closeWritingHistoryModal();
      return;
    }
    if (document.body.classList.contains('sidebar-open')) {
      closeWritingMobileDrawer();
    }
  });

  global.openLightbox = function (imgSrc) {
    const box = document.getElementById('chartLightbox');
    const img = document.getElementById('lightboxImg');
    if (box && img) {
      img.src = imgSrc;
      box.classList.add('active');
    }
  };

  global.closeLightbox = function (e) {
    if (e) e.stopPropagation();
    const box = document.getElementById('chartLightbox');
    if (box) box.classList.remove('active');
  };

  function escapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  // Setup Event Listeners
  function setupButtons() {
    const editor = document.getElementById('essayEditor');
    if (editor) editor.addEventListener('input', handleEditorInput);

    const pzEditor = document.getElementById('pzEssayEditor');
    if (pzEditor) pzEditor.addEventListener('input', handlePzEditorInput);

    // Studio Submit handlers được gắn trực tiếp qua .onclick trong loadLessonToStudio() để tránh kích hoạt 2 lần.

    const btnClear = document.getElementById('btnClearEditor');
    if (btnClear) {
      btnClear.addEventListener('click', async () => {
        const ok = (window.S4UI && typeof window.S4UI.confirm === 'function')
          ? await window.S4UI.confirm('Bạn có chắc chắn muốn xóa bài viết để làm lại từ đầu không?', {
              title: 'Xóa bài viết',
              tone: 'danger',
              confirmText: 'Xóa viết lại'
            })
          : confirm('Bạn có chắc chắn muốn xóa bài viết để làm lại từ đầu không?');
        if (ok) {
          editor.value = '';
          handleEditorInput();
          if (window.S4UI) window.S4UI.toast('info', 'Đã xóa bài viết hiện tại.');
        }
      });
    }

    const btnBack = document.getElementById('btnBackToStudio');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        document.getElementById('reviewContainer').style.display = 'none';
        if (activeLesson && activeLesson.type === 'practice_full') {
          document.body.classList.add('in-cbt-mode', 'sidebar-collapsed');
          document.getElementById('practiceZoneContainer').style.display = 'flex';
        } else {
          document.body.classList.remove('in-cbt-mode');
          document.getElementById('studioContainer').style.display = 'flex';
        }
      });
    }

    const btnFinish = document.getElementById('btnFinishAndNext');
    if (btnFinish) {
      btnFinish.addEventListener('click', () => {
        markLessonCompleted(activeLesson.id);
        if (window.S4UI) window.S4UI.toast('success', '🎉 Đã ghi nhận hoàn thành bài viết này vào tiến độ học tập!');
        else alert('🎉 Đã ghi nhận hoàn thành bài viết này vào tiến độ học tập!');
      });
    }

    const btnCopyAI = document.getElementById('btnCopyPromptAI');
    if (btnCopyAI) btnCopyAI.addEventListener('click', copyPromptForAI);

    if (window.S4UI && typeof window.S4UI.bindSearchBar === 'function') {
      window.S4UI.bindSearchBar({
        input: 'searchInput',
        clearBtn: 'searchInput_clear',
        searchBtn: 'searchInput_btn',
        delay: 180,
        onSearch: () => {
          clearTimeout(writingSearchTimer);
          renderSidebar();
        }
      });
    } else {
      const sbInp = document.getElementById('searchInput');
      if (sbInp) sbInp.addEventListener('input', global.filterWritingSidebar);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init(); setupButtons(); });
  } else {
    init();
    setupButtons();
  }
})(typeof window !== 'undefined' ? window : this);
