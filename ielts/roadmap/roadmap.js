/* LinguaPath IELTS Roadmap Engine (Zero-overhead progress evaluator)
 * Đọc trực tiếp khóa tiến độ thật từ localStorage, tính % từng mốc,
 * gợi ý "Hôm nay học gì?" và tạo deep-link nhảy thẳng tới đúng bài học tiếp theo.
 */
(function (root) {
  "use strict";

  function getData() {
    if (root && root.LP_IELTS_ROADMAP_DATA) return root.LP_IELTS_ROADMAP_DATA;
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
      startLevel: "foundation",
      pace: "standard",
      skipped: {},
      updatedAt: ""
    };
  }

  function loadState() {
    var data = getData();
    var key = (data && data.STORAGE_KEY) || "lp_ielts_roadmap_v1";
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
    var key = (data && data.STORAGE_KEY) || "lp_ielts_roadmap_v1";
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

  function countSrsEntries(srsObj, maxVocabIdx, nowMs) {
    var map = (srsObj && typeof srsObj === "object" && !Array.isArray(srsObj)) ? srsObj : {};
    var learned = 0, ignored = 0, mastered = 0, due = 0;
    var now = nowMs || Date.now();
    var keys = Object.keys(map);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (maxVocabIdx && (!/^w_(0|[1-9]\d*)$/.test(k) || Number(k.slice(2)) >= maxVocabIdx)) continue;
      var st = map[k];
      if (!st || typeof st !== "object" || Array.isArray(st)) continue;
      if (st.ignored) { ignored++; continue; }
      if (st.reps > 0 || st.due || st.lastReview || /^w_\d+$/.test(k)) {
        learned++;
        if (now >= Number(st.due || 0)) due++;
        else if (Number(st.interval || 0) >= 7) mastered++;
      }
    }
    return { learned: learned, ignored: ignored, mastered: mastered, due: due, totalDone: learned + ignored };
  }

  function isSrsDoneEntry(st, keyName) {
    if (!st || typeof st !== "object" || Array.isArray(st)) return false;
    if (st.ignored) return true;
    return Boolean(st.reps > 0 || st.due || st.lastReview || /^w_\d+$/.test(keyName));
  }

  function applyUrlPrefix(url, urlPrefix) {
    if (!url) return "#";
    if (/^(https?:|#|\/)/i.test(url)) return url;
    return (urlPrefix || "") + url;
  }

  function appendFromRoadmap(url) {
    if (!url || url === "#" || /^(https?:\/\/|mailto:|javascript:)/i.test(url)) return url;
    var hashIdx = url.indexOf("#");
    var base = hashIdx >= 0 ? url.slice(0, hashIdx) : url;
    var hash = hashIdx >= 0 ? url.slice(hashIdx) : "";
    if (/[?&]from=roadmap(?:&|$)/i.test(base)) return url;
    var sep = base.indexOf("?") >= 0 ? "&" : "?";
    return base + sep + "from=roadmap" + hash;
  }

  function resolveDueSrsTarget(dueBreakdown, urlPrefix) {
    var bd = dueBreakdown || {};
    var stores = [
      { key: "vocab", label: "Vocab", due: Number(bd.vocab || 0), path: "ielts/vocab/index.html?topic=ALL_DUE" },
      { key: "listening", label: "Listening", due: Number(bd.listening || 0), path: "ielts/listening/index.html?id=listening_u5_1" },
      { key: "reading", label: "Reading", due: Number(bd.reading || 0), path: "ielts/reading/index.html?id=reading_u3_1" },
      { key: "speaking", label: "Speaking", due: Number(bd.speaking || 0), path: "ielts/speaking/index.html?unit=u_1" }
    ];
    var best = stores[0];
    var parts = [];
    for (var i = 0; i < stores.length; i++) {
      if (stores[i].due > 0) {
        parts.push(stores[i].label + ": " + stores[i].due.toLocaleString("en-US"));
        if (best.due <= 0 || stores[i].due > best.due) {
          best = stores[i];
        }
      }
    }
    var hint = parts.length ? parts.join(" • ") : "Ôn tập từ vựng đến hạn";
    return {
      key: best.key,
      label: best.label,
      due: best.due,
      url: appendFromRoadmap(applyUrlPrefix(best.path, urlPrefix)),
      hint: hint
    };
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

    function getSrsStat(key, maxIdx) {
      var ck = key + "::" + (maxIdx || 0);
      if (!Object.prototype.hasOwnProperty.call(srsStatCache, ck)) {
        srsStatCache[ck] = countSrsEntries(getRaw(key, {}), maxIdx, nowMs);
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

  function parseBandNum(val) {
    if (val === null || val === undefined || val === "") return NaN;
    var n = Number(String(val).replace(",", ".").trim());
    return Number.isFinite(n) && n > 0 ? n : NaN;
  }

  function evaluateSubmissionsQuota(task, rawVal) {
    var list = Array.isArray(rawVal)
      ? rawVal
      : (rawVal && typeof rawVal === "object" ? Object.keys(rawVal).map(function (k) { return rawVal[k]; }) : []);
    var skill = task.skillKind || task.module || "";
    var useDistinct = task.distinctTests !== false;
    var practicedCount = 0;
    var unverifiedCount = 0;
    var passedKeys = new Set();
    var passedLinear = 0;

    for (var i = 0; i < list.length; i++) {
      var rec = list[i];
      if (!rec || typeof rec !== "object") continue;

      if (skill === "speaking" && task.requireMock && rec.kind !== "mock") {
        continue;
      }
      if (skill === "writing" && (rec.duration === "Bài viết Studio" || rec.isStudio === true || (rec.lessonId && !/^writing_pz_/i.test(String(rec.lessonId)) && !rec.task2))) {
        continue;
      }

      practicedCount++;

      var testKey = "";
      var isUnverified = false;
      var isPassed = false;

      if (skill === "listening") {
        testKey = (rec.testId !== undefined && rec.testId !== null && rec.testId !== "")
          ? ("l:" + String(rec.testId))
          : String(rec.sessionKey || rec.testTitle || rec.id || ("idx_" + i));
        var lCorrect = rec.correctCount;
        var lTotal = rec.totalQuestions;
        if (typeof lCorrect !== "number" || !Number.isFinite(lCorrect) || typeof lTotal !== "number" || !Number.isFinite(lTotal) || lTotal <= 0) {
          isUnverified = true;
        } else {
          var lMinQ = Number(task.minQuestions || 40);
          var lStructOk = lTotal >= lMinQ;
          var lScoreOk = true;
          if (task.minCorrect !== undefined && task.minCorrect !== null) {
            lScoreOk = lCorrect >= Number(task.minCorrect);
          } else if (task.minAccuracy !== undefined && task.minAccuracy !== null) {
            lScoreOk = ((lCorrect / lTotal) * 100) >= Number(task.minAccuracy);
          }
          isPassed = lStructOk && lScoreOk;
        }
      } else if (skill === "reading") {
        var rCodeRaw = String(rec.testCode || "").trim();
        var rCodeSafe = (rCodeRaw && !/^full\s*test$/i.test(rCodeRaw)) ? rCodeRaw : "";
        testKey = String(rec.lessonId || rec.testId || rCodeSafe || rec.testTitle || rec.sessionKey || rec.id || ("idx_" + i));
        var rCorrect = rec.correctCount;
        var rTotal = rec.totalQuestions;
        if (typeof rCorrect !== "number" || !Number.isFinite(rCorrect) || typeof rTotal !== "number" || !Number.isFinite(rTotal) || rTotal <= 0) {
          isUnverified = true;
        } else {
          var rMinQ = Number(task.minQuestions || 13);
          var rStructOk = rTotal >= rMinQ && (!task.requireFull || rec.isFull === true || rTotal >= 40);
          var rScoreOk = true;
          if (task.minCorrect !== undefined && task.minCorrect !== null) {
            rScoreOk = rCorrect >= Number(task.minCorrect);
          } else if (task.minAccuracy !== undefined && task.minAccuracy !== null) {
            rScoreOk = ((rCorrect / rTotal) * 100) >= Number(task.minAccuracy);
          }
          isPassed = rStructOk && rScoreOk;
        }
      } else if (skill === "writing") {
        var t1 = rec.task1 && typeof rec.task1 === "object" ? rec.task1 : null;
        var t2 = rec.task2 && typeof rec.task2 === "object" ? rec.task2 : null;
        testKey = String(
          rec.lessonId || rec.testId || rec.examId ||
          (((t1 && t1.title) || "") + "|" + ((t2 && t2.title) || "")).replace(/^\|$/, "") ||
          rec.testTitle || rec.title || rec.id || ("idx_" + i)
        );
        var hasWordMeta = Boolean((t1 && typeof t1.wordCount === "number") || (t2 && typeof t2.wordCount === "number"));
        var wBand = rec.aiEvaluation ? parseBandNum(rec.aiEvaluation.bandOverall) : NaN;
        if (!hasWordMeta && Number.isNaN(wBand)) {
          isUnverified = true;
        } else {
          var t1Ok = !t1 || Number(t1.wordCount || 0) >= Number(t1.minWords || 150);
          var t2Ok = !t2 || Number(t2.wordCount || 0) >= Number(t2.minWords || 250);
          var hasAnyText = Boolean((t1 && Number(t1.wordCount || 0) > 0) || (t2 && Number(t2.wordCount || 0) > 0));
          var wBandOk = Number.isNaN(wBand) || !task.minBand || wBand >= Number(task.minBand);
          isPassed = hasAnyText && t1Ok && t2Ok && wBandOk;
        }
      } else if (skill === "speaking") {
        testKey = String(rec.lessonId || rec.testId || rec.title || rec.id || ("idx_" + i));
        var sBand = parseBandNum(rec.overallBand);
        var sWords = typeof rec.wordCount === "number" ? rec.wordCount : NaN;
        var turnsOk = !Array.isArray(rec.turns) || rec.turns.length >= 2;
        if (Number.isNaN(sBand) && Number.isNaN(sWords)) {
          isUnverified = true;
        } else if (task.minBand && Number.isNaN(sBand)) {
          isUnverified = true;
        } else {
          var sMinW = Number(task.minWordCount || 60);
          var sWordsOk = Number.isNaN(sWords) ? Boolean(rec.transcript && String(rec.transcript).trim().length >= 80) : (sWords >= sMinW);
          var sBandOk = !task.minBand || (!Number.isNaN(sBand) && sBand >= Number(task.minBand));
          isPassed = turnsOk && sWordsOk && sBandOk;
        }
      } else {
        testKey = String(rec.testId || rec.lessonId || rec.id || ("idx_" + i));
        isPassed = true;
      }

      if (isUnverified) {
        unverifiedCount++;
      } else if (isPassed) {
        passedLinear++;
        passedKeys.add(testKey);
      }
    }

    var rawPassed = useDistinct ? passedKeys.size : passedLinear;
    var subOffset = Number(task.offset || 0);
    var total = Math.max(1, Number(task.target || 1));
    var done = Math.min(total, Math.max(0, rawPassed - subOffset));

    var hintParts = [];
    hintParts.push("Đã luyện " + practicedCount + " lượt");
    hintParts.push("Đạt mục tiêu " + done + "/" + total + " đề");
    if (unverifiedCount > 0) {
      hintParts.push(unverifiedCount + " lượt chưa xác minh");
    }

    return {
      practicedCount: practicedCount,
      passedDistinctCount: rawPassed,
      unverifiedCount: unverifiedCount,
      done: done,
      total: total,
      nextHint: hintParts.join(" • ")
    };
  }

  function evaluateTask(task, state, caches, data, urlPrefix) {
    var isSkipped = Boolean(state && state.skipped && state.skipped[task.id]);
    var done = 0;
    var total = 1;
    var nextHint = "";
    var nextRelUrl = task.defaultUrl || task.basePath || "index.html";
    var dueCount = 0;
    var practicedCount = 0;
    var unverifiedCount = 0;
    var statusCategory = "Hoàn thành bài học";

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
        nextRelUrl = task.basePath + "?id=" + encodeURIComponent(nextId);
      }
      nextHint = (done >= total)
        ? "Đã hoàn thành đủ " + total + " " + (task.unitLabel || "bài")
        : "Tiếp theo: bài #" + (ids.indexOf(nextId) + 1) + "/" + total;
    } else if (task.evalType === "vocab_range") {
      var srsMap = caches.getRaw(task.storageKey, {});
      var startIdx = Number(task.startIdx || 0);
      var endIdx = Number(task.endIdx || 0);
      total = Math.max(1, endIdx - startIdx + 1);
      for (var idx = startIdx; idx <= endIdx; idx++) {
        var wk = "w_" + idx;
        var vst = srsMap[wk];
        if (isSrsDoneEntry(vst, wk)) {
          done++;
          if (!vst.ignored && caches.now >= Number(vst.due || 0)) dueCount++;
        }
      }
      var topics = (data && data.VOCAB_TOPICS) || [];
      var topicIndices = Array.isArray(task.topicIndices) ? task.topicIndices : [];
      var nextTopicObj = topics[topicIndices[0]] || null;
      var nextTopicDone = 0, nextTopicTotal = 0;
      for (var ti = 0; ti < topicIndices.length; ti++) {
        var tp = topics[topicIndices[ti]];
        if (!tp) continue;
        var tTotal = tp.endIdx - tp.startIdx + 1;
        var tDone = 0;
        for (var wi = tp.startIdx; wi <= tp.endIdx; wi++) {
          var wk2 = "w_" + wi;
          if (isSrsDoneEntry(srsMap[wk2], wk2)) tDone++;
        }
        if (tDone < tTotal) {
          nextTopicObj = tp;
          nextTopicDone = tDone;
          nextTopicTotal = tTotal;
          break;
        }
      }
      if (nextTopicObj && task.basePath) {
        nextRelUrl = task.basePath + "?topic=" + encodeURIComponent(nextTopicObj.name);
        if (done >= total) {
          nextHint = "Đã học hết " + total + " từ" + (dueCount > 0 ? " • " + dueCount + " từ đến hạn ôn" : "");
        } else {
          nextHint = "Chủ đề: " + nextTopicObj.shortName + " (" + nextTopicDone + "/" + nextTopicTotal + ")";
        }
      }
    } else if (task.evalType === "prefix_quota") {
      var pSet = caches.getDoneSet(task.storageKey);
      var prefix = task.prefix || "";
      var matchCount = 0;
      pSet.forEach(function (id) {
        if (!prefix || id.indexOf(prefix) === 0) matchCount++;
      });
      var offset = Number(task.offset || 0);
      total = Math.max(1, Number(task.target || 1));
      done = Math.min(total, Math.max(0, matchCount - offset));
      nextHint = (done >= total)
        ? "Đạt chỉ tiêu " + total + " " + (task.unitLabel || "bài")
        : "Đã xong " + done + "/" + total + " " + (task.unitLabel || "bài") + " (còn " + (total - done) + ")";
    } else if (task.evalType === "srs_quota") {
      var sStat = caches.getSrsStat(task.storageKey, 0);
      var sOffset = Number(task.offset || 0);
      total = Math.max(1, Number(task.target || 1));
      done = Math.min(total, Math.max(0, sStat.totalDone - sOffset));
      dueCount = sStat.due;
      nextHint = (done >= total)
        ? "Đạt mốc " + total + " từ SRS"
        : "Còn " + (total - done).toLocaleString("en-US") + " từ để đạt mốc";
    } else if (task.evalType === "submissions_quota") {
      statusCategory = "Đạt mục tiêu bài luyện";
      var subEval = evaluateSubmissionsQuota(task, caches.getRaw(task.storageKey, []));
      practicedCount = subEval.practicedCount;
      unverifiedCount = subEval.unverifiedCount;
      total = subEval.total;
      done = subEval.done;
      nextHint = subEval.nextHint;
    } else if (task.evalType === "due_review") {
      var dVocab = caches.getSrsStat("s4_vocab_srs_v1", 1827);
      var dListen = caches.getSrsStat("s4_listening_srs_v1", 0);
      var dRead = caches.getSrsStat("s4_reading_srs_v1", 0);
      var dSpeak = caches.getSrsStat("lp_speaking_vocab_srs_v1", 0);
      dueCount = dVocab.due + dListen.due + dRead.due + dSpeak.due;
      var totalLearnedAny = dVocab.totalDone + dListen.totalDone + dRead.totalDone + dSpeak.totalDone;
      var dueTargetTask = resolveDueSrsTarget({
        vocab: dVocab.due,
        listening: dListen.due,
        reading: dRead.due,
        speaking: dSpeak.due
      }, urlPrefix);
      nextRelUrl = dueTargetTask.url;
      total = 1;
      done = (totalLearnedAny > 0 && dueCount === 0) ? 1 : 0;
      nextHint = (totalLearnedAny === 0)
        ? "Chưa có từ SRS nào — bắt đầu từ mốc trên"
        : (dueCount > 0 ? dueTargetTask.hint : "Đã ôn sạch từ đến hạn hôm nay");
    }

    var pct = Math.min(100, Math.round((done / total) * 100));
    var isCompleted = done >= total;
    var isEffectiveDone = isCompleted || isSkipped;
    var finalNextUrl = (task.evalType === "due_review")
      ? nextRelUrl
      : appendFromRoadmap(applyUrlPrefix(nextRelUrl, urlPrefix));

    return {
      id: task.id,
      module: task.module,
      moduleLabel: task.moduleLabel,
      icon: task.icon,
      title: task.title,
      desc: task.desc,
      evalType: task.evalType,
      unitLabel: task.unitLabel || "bài",
      criteriaLabel: task.criteriaLabel || "",
      statusCategory: statusCategory,
      practicedCount: practicedCount,
      unverifiedCount: unverifiedCount,
      done: done,
      total: total,
      pct: isSkipped ? 100 : pct,
      rawPct: pct,
      dueCount: dueCount,
      isCompleted: isCompleted,
      isSkipped: isSkipped,
      isEffectiveDone: isEffectiveDone,
      nextHint: nextHint,
      nextUrl: finalNextUrl
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

    var dVocab = caches.getSrsStat("s4_vocab_srs_v1", 1827);
    var dListen = caches.getSrsStat("s4_listening_srs_v1", 0);
    var dRead = caches.getSrsStat("s4_reading_srs_v1", 0);
    var dSpeak = caches.getSrsStat("lp_speaking_vocab_srs_v1", 0);
    var dueBreakdown = {
      vocab: dVocab.due,
      listening: dListen.due,
      reading: dRead.due,
      speaking: dSpeak.due
    };
    var dueWordsTotal = dueBreakdown.vocab + dueBreakdown.listening + dueBreakdown.reading + dueBreakdown.speaking;
    var dueTarget = resolveDueSrsTarget(dueBreakdown, urlPrefix);

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
        icon: stg.icon,
        color: stg.color,
        badge: stg.badge,
        title: stg.title,
        bandRange: stg.bandRange,
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

    // Xây dựng danh sách "Hôm nay học gì?" (tối đa 4 mục: ưu tiên ôn SRS đến hạn + đa dạng kỹ năng trong mốc hiện tại)
    var dailyFocus = [];
    if (dueWordsTotal > 0) {
      dailyFocus.push({
        id: "focus_due_srs",
        module: dueTarget.key,
        moduleLabel: "Ôn tập SRS hôm nay",
        icon: "🔔",
        title: "Ôn " + dueWordsTotal.toLocaleString("en-US") + " từ vựng đến hạn",
        nextHint: dueTarget.hint,
        done: 0,
        total: 1,
        pct: 0,
        nextUrl: dueTarget.url,
        isDueBanner: true
      });
    }

    if (activeStage) {
      var seenModules = {};
      var pendingTasks = activeStage.tasks.filter(function (tk) {
        return !tk.isEffectiveDone && tk.evalType !== "due_review";
      });
      // Lượt 1: lấy mỗi kỹ năng khác nhau 1 mục chưa xong
      for (var p1 = 0; p1 < pendingTasks.length && dailyFocus.length < 4; p1++) {
        var tk1 = pendingTasks[p1];
        if (!seenModules[tk1.module]) {
          seenModules[tk1.module] = true;
          dailyFocus.push(tk1);
        }
      }
      // Lượt 2: nếu vẫn chưa đủ 4 mục thì lấy tiếp bài chưa xong kế tiếp
      for (var p2 = 0; p2 < pendingTasks.length && dailyFocus.length < 4; p2++) {
        var tk2 = pendingTasks[p2];
        if (dailyFocus.indexOf(tk2) === -1) {
          dailyFocus.push(tk2);
        }
      }
    }

    function computeSkillBreakdown(stagesList) {
      var defs = [
        { key: "listening", label: "Nghe", icon: "listening", color: "#d97706" },
        { key: "reading", label: "Đọc", icon: "reading", color: "#16a34a" },
        { key: "speaking", label: "Nói", icon: "speaking", color: "#e11d48" },
        { key: "writing", label: "Viết", icon: "writing", color: "#9333ea" }
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
      dueBreakdown: dueBreakdown,
      dueTargetUrl: dueTarget.url,
      dueSummaryHint: dueTarget.hint,
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
    countSrsEntries: countSrsEntries,
    appendFromRoadmap: appendFromRoadmap,
    resolveDueSrsTarget: resolveDueSrsTarget,
    evaluateTask: evaluateTask,
    evaluateRoadmap: evaluateRoadmap
  };

  if (typeof window !== "undefined") window.LPIeltsRoadmap = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
