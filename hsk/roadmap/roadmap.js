/* LinguaPath HSK Roadmap Engine (Zero-overhead progress evaluator)
 * Đọc trực tiếp khóa tiến độ thật từ localStorage (8 phân hệ HSK 1–6 & HSKK),
 * tính % từng chặng, gợi ý "Hôm nay học gì?" và tạo deep-link kèm from=roadmap.
 */
(function (root) {
  "use strict";

  function getData() {
    if (root && root.LP_HSK_ROADMAP_DATA) return root.LP_HSK_ROADMAP_DATA;
    if (typeof require === "function") {
      try { return require("./roadmap_data.js"); } catch (e) {}
    }
    return null;
  }

  function getRadicalGroups() {
    if (root.LP_HSK_RADICAL_STAGE_BY_NUM) {
      return { radicals: root.LP_HSK_RADICALS_214, stageByNum: root.LP_HSK_RADICAL_STAGE_BY_NUM };
    }
    if (typeof require === "function") return require("../writing/radicals_214_data.js");
    return null;
  }

  function safeReadJson(key, fallback) {
    try {
      if (typeof localStorage === "undefined") return fallback;
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed !== null && typeof parsed === "object" ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeWriteJson(key, obj) {
    try {
      if (typeof localStorage === "undefined") return false;
      localStorage.setItem(key, JSON.stringify(obj));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getDefaultState() {
    return {
      version: 1,
      startLevel: "foundation",
      pace: "standard",
      skipped: {},
      updatedAt: ""
    };
  }

  function loadState() {
    var data = getData();
    var key = (data && data.STORAGE_KEY) || "lp_hsk_roadmap_v1";
    var raw = safeReadJson(key, null);
    var def = getDefaultState();
    if (!raw || Array.isArray(raw)) return def;
    return {
      version: 1,
      startLevel: typeof raw.startLevel === "string" ? raw.startLevel : def.startLevel,
      pace: typeof raw.pace === "string" ? raw.pace : def.pace,
      skipped: (raw.skipped && typeof raw.skipped === "object" && !Array.isArray(raw.skipped)) ? raw.skipped : {},
      updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : ""
    };
  }

  function saveState(nextState) {
    var data = getData();
    var key = (data && data.STORAGE_KEY) || "lp_hsk_roadmap_v1";
    var clean = Object.assign(getDefaultState(), nextState || {}, {
      updatedAt: new Date().toISOString()
    });
    safeWriteJson(key, clean);
    return clean;
  }

  function setStartLevel(levelId) {
    var data = getData();
    var valid = (data && data.START_LEVELS || []).some(function (x) { return x.id === levelId; });
    var st = loadState();
    st.startLevel = valid ? levelId : "foundation";
    return saveState(st);
  }

  function setPace(paceId) {
    var data = getData();
    var valid = (data && data.PACES || []).some(function (x) { return x.id === paceId; });
    var st = loadState();
    st.pace = valid ? paceId : "standard";
    return saveState(st);
  }

  function toggleSkipTask(taskId, forceValue) {
    if (!taskId) return loadState();
    var st = loadState();
    var next = (typeof forceValue === "boolean") ? forceValue : !st.skipped[taskId];
    if (next) st.skipped[taskId] = true;
    else delete st.skipped[taskId];
    return saveState(st);
  }

  function resetPrefs() {
    return saveState(getDefaultState());
  }

  function expandIds(spec) {
    if (Array.isArray(spec)) return spec.slice();
    if (spec && typeof spec === "object" && spec.prefix) {
      var out = [];
      var start = Number(spec.start || 0);
      var end = Number(spec.end || 0);
      for (var i = start; i <= end; i++) out.push(spec.prefix + i);
      return out;
    }
    return [];
  }

  function toDoneSet(raw) {
    var set = new Set();
    if (Array.isArray(raw)) {
      for (var i = 0; i < raw.length; i++) {
        if (raw[i]) set.add(String(raw[i]));
      }
    } else if (raw && typeof raw === "object") {
      var keys = Object.keys(raw);
      for (var j = 0; j < keys.length; j++) {
        if (raw[keys[j]]) set.add(keys[j]);
      }
    }
    return set;
  }

  function countHskSrs(srsObj, levelOpt, nowMs) {
    var map = (srsObj && typeof srsObj === "object" && !Array.isArray(srsObj)) ? srsObj : {};
    var learned = 0, ignored = 0, due = 0;
    var now = nowMs || Date.now();
    var prefix = levelOpt ? ("hsk" + String(levelOpt) + "_") : "";
    var keys = Object.keys(map);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (prefix) {
        if (k.indexOf(prefix) !== 0) continue;
      } else if (!/^hsk[1-6]_/.test(k)) {
        continue;
      }
      var st = map[k];
      if (!st || typeof st !== "object" || Array.isArray(st)) continue;
      if (st.ignored) {
        ignored++;
        continue;
      }
      if (Number(st.reps || 0) > 0 || st.due || st.lastReview) {
        learned++;
        if (now >= Number(st.due || 0)) due++;
      }
    }
    return {
      learned: learned,
      ignored: ignored,
      due: due,
      totalDone: learned + ignored
    };
  }

  function appendFromRoadmap(url) {
    if (!url || url === "#") return url;
    if (/[?&]from=roadmap(?:&|$)/.test(url)) return url;
    var hashIdx = url.indexOf("#");
    var hash = "";
    var base = url;
    if (hashIdx !== -1) {
      hash = url.slice(hashIdx);
      base = url.slice(0, hashIdx);
    }
    var sep = base.indexOf("?") === -1 ? "?" : "&";
    return base + sep + "from=roadmap" + hash;
  }

  function applyUrlPrefix(url, urlPrefix) {
    if (!url) return "#";
    if (/^(https?:|#|\/)/i.test(url)) return url;
    return (urlPrefix || "") + url;
  }

  function buildStorageCaches(nowMs) {
    var rawCache = {};
    var doneSetCache = {};
    var srsStatCache = {};

    function getRaw(key, fb) {
      if (!Object.prototype.hasOwnProperty.call(rawCache, key)) {
        rawCache[key] = safeReadJson(key, fb);
      }
      return rawCache[key];
    }

    function getDoneSet(key) {
      if (!Object.prototype.hasOwnProperty.call(doneSetCache, key)) {
        doneSetCache[key] = toDoneSet(getRaw(key, {}));
      }
      return doneSetCache[key];
    }

    function getSrsStat(key, levelOpt) {
      var ck = key + "::" + (levelOpt || "all");
      if (!Object.prototype.hasOwnProperty.call(srsStatCache, ck)) {
        srsStatCache[ck] = countHskSrs(getRaw(key, {}), levelOpt, nowMs);
      }
      return srsStatCache[ck];
    }

    return {
      now: nowMs || Date.now(),
      getRaw: getRaw,
      getDoneSet: getDoneSet,
      getSrsStat: getSrsStat
    };
  }

  function evaluateTask(task, state, caches, data, urlPrefix) {
    var isSkipped = Boolean(state && state.skipped && state.skipped[task.id]);
    var done = 0;
    var total = 1;
    var nextHint = "";
    var nextRelUrl = task.defaultUrl || task.basePath || "hsk/index.html";
    var dueCount = 0;

    if (task.evalType === "id_list") {
      var ids = expandIds(task.ids);
      total = Math.max(1, ids.length);
      var set = caches.getDoneSet(task.storageKey);
      var nextId = ids[0] || "";
      var foundNext = false;
      for (var i = 0; i < ids.length; i++) {
        if (set.has(ids[i])) {
          done++;
        } else if (!foundNext) {
          nextId = ids[i];
          foundNext = true;
        }
      }
      if (nextId && task.basePath) {
        var paramName = task.idParam || "id";
        nextRelUrl = task.basePath + "?" + paramName + "=" + encodeURIComponent(nextId);
      }
      nextHint = (done >= total)
        ? "Đã hoàn thành đủ " + total + " " + (task.unitLabel || "bài")
        : "Tiếp theo: mục #" + (ids.indexOf(nextId) + 1) + "/" + total;
    } else if (task.evalType === "hsk_vocab_level") {
      var lv = Number(task.level || 1);
      var vStat = caches.getSrsStat(task.storageKey || "lp_hsk_vocab_srs_v1", lv);
      var poolTotal = (data && data.VOCAB_LEVEL_TOTALS && data.VOCAB_LEVEL_TOTALS[lv]) || Number(task.target || 1);
      total = Math.max(1, Number(task.target || poolTotal));
      done = Math.min(total, vStat.totalDone);
      dueCount = vStat.due;
      if (done >= total) {
        nextHint = "Đã học hết " + total.toLocaleString("en-US") + " từ" + (dueCount > 0 ? " • " + dueCount + " từ đến hạn" : "");
      } else {
        nextHint = "Còn " + (total - done).toLocaleString("en-US") + " từ HSK " + lv + (dueCount > 0 ? " • " + dueCount + " đến hạn" : "");
      }
    } else if (task.evalType === "hsk_mw_quota") {
      var mwSet = caches.getDoneSet(task.storageKey || "lp_hsk_mw_done_v1");
      var mwOffset = Number(task.offset || 0);
      total = Math.max(1, Number(task.target || 1));
      done = Math.min(total, Math.max(0, mwSet.size - mwOffset));
      nextHint = (done >= total)
        ? "Đạt chỉ tiêu " + total + " lượng từ"
        : "Đã nắm " + done + "/" + total + " lượng từ (còn " + (total - done) + ")";
    } else if (task.evalType === "hsk_writing_bucket") {
      var wRaw = caches.getRaw(task.storageKey || "lp_hsk_writing_done_v1", {});
      var bucketObj = (wRaw && task.bucket && wRaw[task.bucket] && typeof wRaw[task.bucket] === "object") ? wRaw[task.bucket] : {};
      var bKeys = Object.keys(bucketObj);
      var bPrefix = task.prefix || "";
      var bMatch = 0;
      for (var bi = 0; bi < bKeys.length; bi++) {
        var bk = bKeys[bi];
        if (!bucketObj[bk]) continue;
        if (!bPrefix || bk.indexOf(bPrefix) === 0) bMatch++;
      }
      var bOffset = Number(task.offset || 0);
      total = Math.max(1, Number(task.target || 1));
      if (task.radicalStage) {
        var groups = getRadicalGroups();
        if (groups && Array.isArray(groups.radicals) && groups.stageByNum) {
          done = groups.radicals.filter(function (radical) {
            return groups.stageByNum.get(radical.num) === task.radicalStage && Boolean(bucketObj[radical.char]);
          }).length;
        } else if (data && data.RADICAL_CHARS_BY_STAGE && data.RADICAL_CHARS_BY_STAGE[task.radicalStage]) {
          done = Array.from(data.RADICAL_CHARS_BY_STAGE[task.radicalStage]).filter(function (ch) {
            return Boolean(bucketObj[ch]);
          }).length;
        } else {
          done = 0;
        }
        done = Math.min(total, done);
      } else {
        done = Math.min(total, Math.max(0, bMatch - bOffset));
      }
      nextHint = (done >= total)
        ? "Hoàn thành đủ " + total + " " + (task.unitLabel || "mục")
        : "Đã luyện " + done + "/" + total + " " + (task.unitLabel || "mục") + " (còn " + (total - done) + ")";
    } else if (task.evalType === "hsk_mock_level") {
      var mockRaw = caches.getRaw(task.storageKey || "lp_hsk_mock_results_v1", {});
      var bestById = (mockRaw && mockRaw.bestById && typeof mockRaw.bestById === "object") ? mockRaw.bestById : {};
      var mockIds = expandIds(task.ids);
      var mockLvPrefix = "mock_hsk" + String(task.level || 1) + "_";
      var passed = 0;
      var attempted = 0;
      if (mockIds.length) {
        total = Math.max(1, Number(task.target || mockIds.length));
        for (var mi = 0; mi < mockIds.length; mi++) {
          var rec = bestById[mockIds[mi]];
          if (rec && typeof rec === "object") {
            attempted++;
            if (rec.passed === true) passed++;
          }
        }
      } else {
        total = Math.max(1, Number(task.target || 2));
        Object.keys(bestById).forEach(function (mid) {
          if (mid.indexOf(mockLvPrefix) !== 0) return;
          var r = bestById[mid];
          if (r && typeof r === "object") {
            attempted++;
            if (r.passed === true) passed++;
          }
        });
      }
      done = Math.min(total, passed);
      if (done >= total) {
        nextHint = "Đạt ngưỡng " + total + "/" + total + " đề luyện rút gọn HSK " + (task.level || "");
      } else if (attempted > 0 && passed === 0) {
        nextHint = "Đã luyện " + attempted + " đề rút gọn • Chưa đạt ngưỡng bài luyện";
      } else {
        nextHint = "Đạt ngưỡng " + done + "/" + total + " đề luyện rút gọn HSK " + (task.level || "");
      }
    } else if (task.evalType === "due_review") {
      var allSrs = caches.getSrsStat(task.storageKey || "lp_hsk_vocab_srs_v1", 0);
      dueCount = allSrs.due;
      total = 1;
      done = (allSrs.totalDone > 0 && dueCount === 0) ? 1 : 0;
      nextHint = (allSrs.totalDone === 0)
        ? "Chưa có từ HSK SRS — bắt đầu học từ vựng ở các chặng trên"
        : (dueCount > 0 ? "Còn " + dueCount.toLocaleString("en-US") + " từ HSK đến hạn ôn hôm nay" : "Tuyệt vời! Đã ôn sạch từ HSK đến hạn");
    }

    var pct = Math.min(100, Math.round((done / total) * 100));
    var isCompleted = done >= total;
    var isEffectiveDone = isCompleted || isSkipped;

    return {
      id: task.id,
      module: task.module,
      moduleLabel: task.moduleLabel,
      title: task.title,
      desc: task.desc,
      evalType: task.evalType,
      unitLabel: task.unitLabel || "bài",
      done: done,
      total: total,
      pct: isSkipped ? 100 : pct,
      rawPct: pct,
      dueCount: dueCount,
      isCompleted: isCompleted,
      isSkipped: isSkipped,
      isEffectiveDone: isEffectiveDone,
      nextHint: nextHint,
      nextUrl: applyUrlPrefix(appendFromRoadmap(nextRelUrl), urlPrefix)
    };
  }

  function formatWeeksRange(minW, maxW, factor) {
    var a = Math.max(1, Math.round(minW * factor));
    var b = Math.max(a, Math.round(maxW * factor));
    return (a === b) ? (a + " tuần") : (a + "–" + b + " tuần");
  }

  function evaluateRoadmap(options) {
    var opts = options || {};
    var data = getData();
    if (!data) return null;

    var state = loadState();
    var caches = buildStorageCaches(opts.nowMs);
    var urlPrefix = (typeof opts.urlPrefix === "string") ? opts.urlPrefix : "../../";

    var startCfg = (data.START_LEVELS || []).find(function (x) { return x.id === state.startLevel; }) || data.START_LEVELS[0];
    var paceCfg = (data.PACES || []).find(function (x) { return x.id === state.pace; }) || data.PACES[1];
    var startIdx = Number(startCfg.startStageIdx || 0);

    var srsAll = caches.getSrsStat("lp_hsk_vocab_srs_v1", 0);
    var dueWordsTotal = srsAll.due;
    var dueTargetUrl = applyUrlPrefix(appendFromRoadmap("hsk/vocab/index.html?filter=due"), urlPrefix);

    var stagesOut = [];
    var activeStage = null;
    var sumStagePct = 0;
    var activeStageCount = 0;
    var completedTasksAll = 0;
    var totalTasksAll = 0;

    for (var s = 0; s < data.STAGES.length; s++) {
      var stg = data.STAGES[s];
      var preCompletedByLevel = s < startIdx;
      var tasksOut = [];
      var sumTaskPct = 0;
      var doneTaskCount = 0;

      for (var t = 0; t < stg.tasks.length; t++) {
        var ev = evaluateTask(stg.tasks[t], state, caches, data, urlPrefix);
        if (preCompletedByLevel && !ev.isCompleted) {
          ev.isInheritedByLevel = true;
        }
        tasksOut.push(ev);
        sumTaskPct += (ev.isEffectiveDone ? 100 : ev.rawPct);
        if (ev.isEffectiveDone) doneTaskCount++;
      }

      var stagePct = Math.min(100, Math.round(sumTaskPct / Math.max(1, tasksOut.length)));
      var isStageDone = preCompletedByLevel || (doneTaskCount >= tasksOut.length);
      var stageObj = {
        id: stg.id,
        order: stg.order,
        level: stg.level,
        icon: stg.icon,
        color: stg.color,
        badge: stg.badge,
        title: stg.title,
        levelRange: stg.levelRange,
        estWeeks: formatWeeksRange(stg.baseWeeksMin, stg.baseWeeksMax, paceCfg.factor),
        goal: stg.goal,
        tip: stg.tip,
        preCompletedByLevel: preCompletedByLevel,
        pct: preCompletedByLevel ? Math.max(stagePct, 100) : stagePct,
        rawPct: stagePct,
        doneTaskCount: doneTaskCount,
        totalTaskCount: tasksOut.length,
        isCompleted: isStageDone,
        status: "pending",
        tasks: tasksOut
      };

      if (!preCompletedByLevel) {
        activeStageCount++;
        sumStagePct += stagePct;
        totalTasksAll += tasksOut.length;
        completedTasksAll += doneTaskCount;
      }

      if (!activeStage && !isStageDone) {
        stageObj.status = "current";
        activeStage = stageObj;
      } else if (isStageDone) {
        stageObj.status = "done";
      } else {
        stageObj.status = "upcoming";
      }

      stagesOut.push(stageObj);
    }

    if (!activeStage && stagesOut.length > 0) {
      activeStage = stagesOut[stagesOut.length - 1];
    }

    var overallPct = activeStageCount > 0 ? Math.min(100, Math.round(sumStagePct / activeStageCount)) : 100;

    // Xây dựng danh sách "Hôm nay học gì?" (ưu tiên tuần tự Tuần 1: Chương 0 -> 20 cặp thanh điệu -> Bài 1)
    var dailyFocus = [];
    var warmupStatus = { needWarmup: false, c0Done: true, tonesDone: true };
    if (dueWordsTotal > 0) {
      dailyFocus.push({
        id: "focus_due_srs",
        module: "vocab",
        moduleLabel: "Ôn tập HSK SRS hôm nay",
        title: "Ôn " + dueWordsTotal.toLocaleString("en-US") + " từ vựng HSK đến hạn",
        nextHint: "Ưu tiên giữ trí nhớ mặt chữ trước khi nạp từ mới",
        done: 0,
        total: 1,
        pct: 0,
        unitLabel: "lượt",
        nextUrl: dueTargetUrl,
        isDueBanner: true
      });
    }

    if (activeStage) {
      var pendingTasks = activeStage.tasks.filter(function (tk) {
        return !tk.isEffectiveDone && tk.evalType !== "due_review";
      });

      var isHsk1Active = activeStage.id === "hsk1" && !activeStage.preCompletedByLevel;
      var c0Task = isHsk1Active ? activeStage.tasks.find(function (tk) { return tk.id === "hsk1_c0"; }) : null;
      var tonesTask = isHsk1Active ? activeStage.tasks.find(function (tk) { return tk.id === "hsk1_speak_tones"; }) : null;
      var hsk1LesTask = isHsk1Active ? activeStage.tasks.find(function (tk) { return tk.id === "hsk1_lessons"; }) : null;

      if (isHsk1Active && (c0Task || tonesTask)) {
        warmupStatus.c0Done = !c0Task || c0Task.isEffectiveDone;
        warmupStatus.tonesDone = !tonesTask || tonesTask.isEffectiveDone;
        warmupStatus.needWarmup = !warmupStatus.c0Done || !warmupStatus.tonesDone;
      }

      if (warmupStatus.needWarmup) {
        // Giữ tối giản và đúng trình tự: Tuần 1 chỉ tập trung Bước 1 (Chương 0) -> Bước 2 (Thanh điệu) -> Bước 3 (Bài 1)
        if (c0Task && !c0Task.isEffectiveDone) {
          dailyFocus.push(Object.assign({}, c0Task, {
            moduleLabel: "Bước 1 ưu tiên • Tuần 1",
            nextHint: c0Task.nextHint + " (hoàn thành 3 bài Pinyin trước khi vào Bài 1)"
          }));
          if (tonesTask && !tonesTask.isEffectiveDone && dailyFocus.length < 4) {
            dailyFocus.push(Object.assign({}, tonesTask, {
              moduleLabel: "Bước 2 kế tiếp • Thanh điệu",
              nextHint: "Luyện sau khi xong Bài 0.2 để phân biệt chuẩn 4 thanh điệu"
            }));
          }
        } else if (tonesTask && !tonesTask.isEffectiveDone) {
          dailyFocus.push(Object.assign({}, tonesTask, {
            moduleLabel: "Bước 2 ưu tiên • Thanh điệu",
            nextHint: tonesTask.nextHint + " (hoàn thành hoặc làm bài kiểm tra nhanh 5 câu để sang Bài 1)"
          }));
          if (hsk1LesTask && !hsk1LesTask.isEffectiveDone && dailyFocus.length < 4) {
            dailyFocus.push(Object.assign({}, hsk1LesTask, {
              moduleLabel: "Bước 3 kế tiếp • Hội thoại",
              nextHint: "Mở đầu giao tiếp với Bài 1: 你好! (Xin chào!)"
            }));
          }
        }
      } else {
        var seenModules = {};
        // Lượt 1: mỗi kỹ năng khác nhau 1 học phần chưa xong
        for (var p1 = 0; p1 < pendingTasks.length && dailyFocus.length < 4; p1++) {
          var tk1 = pendingTasks[p1];
          if (!seenModules[tk1.module]) {
            seenModules[tk1.module] = true;
            dailyFocus.push(tk1);
          }
        }
        // Lượt 2: nếu chưa đủ 4 thẻ thì bổ sung học phần kế tiếp chưa xong
        for (var p2 = 0; p2 < pendingTasks.length && dailyFocus.length < 4; p2++) {
          var tk2 = pendingTasks[p2];
          if (dailyFocus.indexOf(tk2) === -1) {
            dailyFocus.push(tk2);
          }
        }
      }
    }

    function computeSkillBreakdown(stagesList) {
      var defs = [
        { key: "listening", label: "Nghe", icon: "listening", color: "#d97706" },
        { key: "reading", label: "Đọc", icon: "reading", color: "#16a34a" },
        { key: "speaking", label: "Nói", icon: "speaking", color: "#e11d48" },
        { key: "writing", label: "Viết", icon: "writing", color: "#ea580c" }
      ];
      var activeList = stagesList.filter(function (s) { return !s.preCompletedByLevel; });
      if (!activeList.length) activeList = stagesList;
      var items = defs.map(function (d) {
        var sumPct = 0, cnt = 0, doneCnt = 0;
        activeList.forEach(function (st) {
          (st.tasks || []).forEach(function (tk) {
            if (tk.module !== d.key) return;
            cnt++;
            sumPct += (tk.isEffectiveDone ? 100 : tk.rawPct);
            if (tk.isEffectiveDone) doneCnt++;
          });
        });
        var pct = cnt > 0 ? Math.min(100, Math.round(sumPct / cnt)) : 0;
        return { key: d.key, label: d.label, icon: d.icon, color: d.color, pct: pct, doneTasks: doneCnt, totalTasks: cnt, isLagging: false };
      });
      var maxPct = 0, minPct = 100, minItem = null;
      items.forEach(function (it) {
        if (it.totalTasks <= 0) return;
        if (it.pct > maxPct) maxPct = it.pct;
        if (it.pct < minPct) { minPct = it.pct; minItem = it; }
      });
      var spread = maxPct - minPct;
      var laggingKey = "";
      var laggingLabel = "";
      if (minItem && maxPct > 0 && spread >= 15) {
        minItem.isLagging = true;
        laggingKey = minItem.key;
        laggingLabel = minItem.label;
      }
      return { items: items, laggingKey: laggingKey, laggingLabel: laggingLabel, spread: spread };
    }

    var skillBreakdown = computeSkillBreakdown(stagesOut);

    return {
      state: state,
      startLevel: startCfg,
      pace: paceCfg,
      overallPct: overallPct,
      completedTasks: completedTasksAll,
      totalTasks: totalTasksAll,
      dueWordsTotal: dueWordsTotal,
      warmupStatus: warmupStatus,
      dueTargetUrl: dueTargetUrl,
      skillBreakdown: skillBreakdown,
      activeStage: activeStage,
      dailyFocus: dailyFocus,
      stages: stagesOut
    };
  }

  var api = {
    loadState: loadState,
    saveState: saveState,
    setStartLevel: setStartLevel,
    setPace: setPace,
    toggleSkipTask: toggleSkipTask,
    resetPrefs: resetPrefs,
    expandIds: expandIds,
    countHskSrs: countHskSrs,
    appendFromRoadmap: appendFromRoadmap,
    evaluateTask: evaluateTask,
    evaluateRoadmap: evaluateRoadmap
  };

  if (typeof window !== "undefined") window.LPHskRoadmap = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
