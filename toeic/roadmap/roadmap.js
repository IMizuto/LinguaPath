/* LinguaPath TOEIC Roadmap Engine (Zero-overhead progress evaluator)
 * Đọc trực tiếp các khóa lp_toeic_* từ localStorage, tính % chặng/tổng,
 * gợi ý "Hôm nay học gì?" và tạo deep-link kèm from=roadmap.
 */
(function (root) {
  "use strict";

  function getData() {
    if (root && root.LP_TOEIC_ROADMAP_DATA) return root.LP_TOEIC_ROADMAP_DATA;
    if (typeof require === "function") {
      try { return require("./roadmap_data.js"); } catch (e) {}
    }
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
      startLevel: "zero",
      pace: "standard",
      skipped: {},
      updatedAt: ""
    };
  }

  function loadState() {
    var data = getData();
    var key = (data && data.STORAGE_KEY) || "lp_toeic_roadmap_v1";
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
    var key = (data && data.STORAGE_KEY) || "lp_toeic_roadmap_v1";
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
    st.startLevel = valid ? levelId : "zero";
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

  function padNum(n, width) {
    var s = String(n);
    var w = Number(width || 0);
    while (s.length < w) s = "0" + s;
    return s;
  }

  function expandIds(spec) {
    if (Array.isArray(spec)) return spec.slice();
    if (spec && typeof spec === "object" && spec.prefix) {
      var out = [];
      var start = Number(spec.start || 0);
      var end = Number(spec.end || 0);
      var pad = Number(spec.pad || 0);
      for (var i = start; i <= end; i++) {
        out.push(spec.prefix + (pad > 0 ? padNum(i, pad) : String(i)));
      }
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

  function countToeicSrs(srsObj, levelOpt, nowMs) {
    var map = (srsObj && typeof srsObj === "object" && !Array.isArray(srsObj)) ? srsObj : {};
    var learned = 0, ignored = 0, due = 0;
    var now = nowMs || Date.now();
    var prefix = levelOpt ? ("toeic" + String(levelOpt) + "_") : "";
    var keys = Object.keys(map);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (prefix && k.indexOf(prefix) !== 0) continue;
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
        srsStatCache[ck] = countToeicSrs(getRaw(key, {}), levelOpt, nowMs);
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

  function extractMockRecords(rawVal) {
    if (Array.isArray(rawVal)) return rawVal;
    if (rawVal && typeof rawVal === "object") {
      if (rawVal.bestById && typeof rawVal.bestById === "object") {
        return Object.keys(rawVal.bestById).map(function (k) {
          return Object.assign({ testId: k }, rawVal.bestById[k]);
        });
      }
      return Object.keys(rawVal).map(function (k) {
        var v = rawVal[k];
        return (v && typeof v === "object") ? Object.assign({ testId: k }, v) : null;
      }).filter(Boolean);
    }
    return [];
  }

  function evaluateMockTier(task, rawVal) {
    var list = extractMockRecords(rawVal);
    var minScore = Number(task.minScore || 0);
    var requireFull = Boolean(task.requireFull);
    var total = Math.max(1, Number(task.target || 1));
    var practiced = 0;
    var passedKeys = new Set();

    for (var i = 0; i < list.length; i++) {
      var rec = list[i];
      if (!rec || typeof rec !== "object") continue;
      practiced++;
      var isFull = rec.isFull === true || Number(rec.totalQuestions || 0) >= 200 || rec.tier === "full";
      if (requireFull && !isFull) continue;
      var score = Number(rec.totalScore != null ? rec.totalScore : (rec.score != null ? rec.score : NaN));
      var okScore = Number.isFinite(score) ? (score >= minScore) : (rec.passed === true);
      if (okScore) {
        var key = String(rec.testId || rec.id || rec.lessonId || ("m_" + i));
        passedKeys.add(key);
      }
    }

    var done = Math.min(total, passedKeys.size);
    var nextHint = done >= total
      ? ("Đã đạt mốc " + minScore + "+ ở " + total + "/" + total + " đề")
      : (practiced > 0
        ? ("Đã thi " + practiced + " lượt • Đạt mốc " + minScore + "+: " + done + "/" + total + " đề")
        : ("Chưa thi đề nào (cần đạt >= " + minScore + " điểm)"));

    return { done: done, total: total, nextHint: nextHint };
  }

  function evaluateTask(task, state, caches, data, urlPrefix) {
    var isSkipped = Boolean(state && state.skipped && state.skipped[task.id]);
    var readyMap = (data && data.READY_MODULES) || {};
    var isModuleReady = readyMap[task.module] !== false;
    var done = 0;
    var total = 1;
    var nextHint = "";
    var nextRelUrl = task.defaultUrl || task.basePath || "toeic/index.html";
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
        ? ("Đã hoàn thành đủ " + total + " " + (task.unitLabel || "bài"))
        : ("Tiếp theo: mục #" + (ids.indexOf(nextId) + 1) + "/" + total);
    } else if (task.evalType === "toeic_vocab_level") {
      var lv = Number(task.level || 1);
      var vStat = caches.getSrsStat(task.storageKey || "lp_toeic_vocab_srs_v1", lv);
      var poolTotal = (data && data.VOCAB_LEVEL_TOTALS && data.VOCAB_LEVEL_TOTALS[lv]) || Number(task.target || 1);
      total = Math.max(1, Number(task.target || poolTotal));
      done = Math.min(total, vStat.totalDone);
      dueCount = vStat.due;
      if (done >= total) {
        nextHint = "Đã học hết " + total.toLocaleString("en-US") + " từ" + (dueCount > 0 ? (" • " + dueCount + " từ đến hạn") : "");
      } else {
        nextHint = "Còn " + (total - done).toLocaleString("en-US") + " từ Chặng " + lv + (dueCount > 0 ? (" • " + dueCount + " đến hạn") : "");
      }
    } else if (task.evalType === "toeic_mock_tier") {
      var mockRes = evaluateMockTier(task, caches.getRaw(task.storageKey || "lp_toeic_mock_submissions_v1", []));
      done = mockRes.done;
      total = mockRes.total;
      nextHint = mockRes.nextHint;
    } else if (task.evalType === "due_review") {
      var allSrs = caches.getSrsStat(task.storageKey || "lp_toeic_vocab_srs_v1", 0);
      dueCount = allSrs.due;
      total = 1;
      done = (allSrs.totalDone > 0 && dueCount === 0) ? 1 : 0;
      nextHint = (allSrs.totalDone === 0)
        ? "Chưa có từ TOEIC SRS — bắt đầu học từ vựng ở các chặng trên"
        : (dueCount > 0 ? ("Còn " + dueCount.toLocaleString("en-US") + " từ TOEIC đến hạn ôn hôm nay") : "Tuyệt vời! Đã ôn sạch từ TOEIC đến hạn");
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
      isModuleReady: isModuleReady,
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
    var readyMap = data.READY_MODULES || {};

    var startCfg = (data.START_LEVELS || []).find(function (x) { return x.id === state.startLevel; }) || data.START_LEVELS[0];
    var paceCfg = (data.PACES || []).find(function (x) { return x.id === state.pace; }) || data.PACES[1];
    var startIdx = Number(startCfg.startStageIdx || 0);

    var srsAll = caches.getSrsStat("lp_toeic_vocab_srs_v1", 0);
    var dueWordsTotal = srsAll.due;
    var dueTargetUrl = applyUrlPrefix(appendFromRoadmap("toeic/vocab/index.html?filter=due"), urlPrefix);

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

    var dailyFocus = [];
    if (dueWordsTotal > 0) {
      dailyFocus.push({
        id: "focus_due_srs",
        module: "vocab",
        moduleLabel: "Ôn tập TOEIC SRS hôm nay",
        title: "Ôn " + dueWordsTotal.toLocaleString("en-US") + " từ vựng TOEIC đến hạn",
        nextHint: "Ưu tiên giữ trí nhớ mặt chữ & nghĩa thương mại trước khi nạp từ mới",
        done: 0,
        total: 1,
        pct: 0,
        unitLabel: "lượt",
        isModuleReady: readyMap.vocab !== false,
        nextUrl: dueTargetUrl,
        isDueBanner: true
      });
    }

    if (activeStage) {
      var pendingTasks = activeStage.tasks.filter(function (tk) {
        return !tk.isEffectiveDone && tk.evalType !== "due_review";
      });
      var seenModules = {};
      for (var p1 = 0; p1 < pendingTasks.length && dailyFocus.length < 4; p1++) {
        var tk1 = pendingTasks[p1];
        if (!seenModules[tk1.module]) {
          seenModules[tk1.module] = true;
          dailyFocus.push(tk1);
        }
      }
      for (var p2 = 0; p2 < pendingTasks.length && dailyFocus.length < 4; p2++) {
        var tk2 = pendingTasks[p2];
        if (dailyFocus.indexOf(tk2) === -1) {
          dailyFocus.push(tk2);
        }
      }
    }

    function computeSkillBreakdown(stagesList) {
      var defs = [
        { key: "vocab", label: "Từ vựng", icon: "vocab", color: "#2563eb" },
        { key: "grammar", label: "Ngữ pháp", icon: "grammar", color: "#0d9488" },
        { key: "listening", label: "Nghe P1–4", icon: "listening", color: "#d97706" },
        { key: "reading", label: "Đọc P5–7", icon: "reading", color: "#16a34a" }
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
    countToeicSrs: countToeicSrs,
    appendFromRoadmap: appendFromRoadmap,
    evaluateTask: evaluateTask,
    evaluateRoadmap: evaluateRoadmap
  };

  if (typeof window !== "undefined") window.LPToeicRoadmap = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
