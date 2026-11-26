/* LinguaPath Acoustic DSP Web Worker (s4-core.wasm + JS fallback) */
(function (globalScope) {
  'use strict';

  var TARGET_SAMPLE_RATE = 16000;
  var SILENCE_RMS_THRESHOLD = 0.0012;
  var SILENCE_PEAK_THRESHOLD = 0.008;
  var MIN_AUDIO_SAMPLES = 1280; // 0.08s @ 16kHz
  var VAD_FRAME_SAMPLES = 320;  // 20ms @ 16kHz
  var VAD_PAD_FRAMES = 8;       // 160ms padding
  var NORMALIZE_TARGET_PEAK = 0.85;
  var MAX_NORMALIZE_GAIN = 14.0;
  var DEFAULT_MAX_CONTOUR = 96;

  var wasmPromise = null;
  var cachedWasmUrl = '';

  function resolveDefaultWasmUrl() {
    try {
      if (typeof location !== 'undefined' && location && location.href) {
        return new URL('s4-core.wasm?v=1', location.href).href;
      }
    } catch (e) {}
    return 's4-core.wasm?v=1';
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function round1(v) {
    return Math.round((Number(v) || 0) * 10) / 10;
  }

  function round2(v) {
    return Math.round((Number(v) || 0) * 100) / 100;
  }

  function round3(v) {
    return Math.round((Number(v) || 0) * 1000) / 1000;
  }

  function loadWasmExports(wasmUrl) {
    var targetUrl = String(wasmUrl || '').trim() || resolveDefaultWasmUrl();
    if (wasmPromise && cachedWasmUrl === targetUrl) {
      return wasmPromise;
    }
    cachedWasmUrl = targetUrl;
    wasmPromise = (async function () {
      if (typeof WebAssembly !== 'object') {
        throw new Error('WebAssembly unsupported');
      }
      if (typeof fetch !== 'function') {
        throw new Error('fetch unsupported in worker');
      }
      var resp = await fetch(targetUrl);
      if (!resp || !resp.ok) {
        throw new Error('HTTP ' + (resp ? resp.status : 0) + ' loading s4-core.wasm');
      }
      if (typeof WebAssembly.instantiateStreaming === 'function') {
        try {
          var ct = resp.headers && resp.headers.get ? String(resp.headers.get('content-type') || '') : '';
          if (/application\/wasm/i.test(ct)) {
            var streamed = await WebAssembly.instantiateStreaming(resp.clone());
            return streamed.instance.exports;
          }
        } catch (streamErr) {
          // Response gốc vẫn nguyên vẹn nhờ resp.clone(), rơi thẳng xuống arrayBuffer()
        }
      }
      var bytes = await resp.arrayBuffer();
      var instantiated = await WebAssembly.instantiate(bytes);
      return instantiated.instance.exports;
    })().catch(function (err) {
      wasmPromise = null;
      throw err;
    });
    return wasmPromise;
  }

  function computeToneConfidence(toneClass, slopeSemi, stdSemi, turnPos, voicedCount, minHz, maxHz) {
    if (!toneClass || voicedCount < 3 || !(maxHz > 0)) return 0;
    var rangeSemi = (minHz > 0 && maxHz > minHz) ? (12 * Math.log(maxHz / minHz) / Math.LN2) : 0;
    if (toneClass === 1) {
      var flatPen = Math.abs(slopeSemi) * 18 + stdSemi * 16;
      return Math.round(clamp(96 - flatPen, 42, 97));
    }
    if (toneClass === 2) {
      return Math.round(clamp(55 + slopeSemi * 7.5, 45, 97));
    }
    if (toneClass === 3) {
      var centerDist = Math.abs(turnPos - 0.5);
      return Math.round(clamp(62 + rangeSemi * 4.5 - centerDist * 35, 45, 96));
    }
    if (toneClass === 4) {
      return Math.round(clamp(55 + (-slopeSemi) * 7.5, 45, 97));
    }
    return 0;
  }

  function computeToneMatchPct(targetTone, detectedTone, toneConfidence, slopeSemi, stdSemi, turnPos, minHz, maxHz) {
    var t = Number(targetTone) || 0;
    if (t < 1 || t > 4) return null;
    if (!detectedTone) return 0;
    if (detectedTone === t) {
      return Math.round(clamp(72 + toneConfidence * 0.28, 72, 100));
    }
    if (t === 1) {
      return Math.round(clamp(80 - Math.abs(slopeSemi) * 12 - stdSemi * 10, 10, 78));
    }
    if (t === 2) {
      return Math.round(slopeSemi > 0 ? clamp(45 + slopeSemi * 8, 25, 82) : clamp(35 + slopeSemi * 4, 8, 35));
    }
    if (t === 3) {
      var rangeSemi = (minHz > 0 && maxHz > minHz) ? (12 * Math.log(maxHz / minHz) / Math.LN2) : 0;
      var inMid = (turnPos >= 0.2 && turnPos <= 0.85) ? 1 : 0;
      return Math.round(clamp(25 + inMid * 26 + rangeSemi * 3.5, 12, 78));
    }
    if (t === 4) {
      return Math.round(slopeSemi < 0 ? clamp(45 + (-slopeSemi) * 8, 25, 82) : clamp(35 - slopeSemi * 4, 8, 35));
    }
    return 0;
  }

  function computeAcousticTelemetry(params) {
    var engine = params.engine || 'wasm';
    var sr = params.sampleRate || TARGET_SAMPLE_RATE;
    var rawLen = params.rawLen || 0;
    var trimmedLen = params.trimmedLen || 0;
    var voicedFrames = params.voicedFrames || 0;
    var totalFrames = params.totalFrames || 0;
    var pauseCount = params.pauseCount || 0;
    var longPauseCount = params.longPauseCount || 0;
    var snrDb = Number(params.snrDb) || 0;
    var noiseFloor = Number(params.noiseFloor) || 0;
    var pitchMeanHz = Number(params.pitchMeanHz) || 0;
    var pitchStdHz = Number(params.pitchStdHz) || 0;
    var pitchStdSemitones = Number(params.pitchStdSemitones) || 0;
    var pitchMinHz = Number(params.pitchMinHz) || 0;
    var pitchMaxHz = Number(params.pitchMaxHz) || 0;
    var pitchSlopeSemitones = Number(params.pitchSlopeSemitones) || 0;
    var turnPointPos = Number(params.turnPointPos) || 0;
    var detectedTone = Number(params.detectedTone) || 0;
    var contour = Array.isArray(params.pitchContour) ? params.pitchContour : [];
    var voicedPts = 0;
    for (var i = 0; i < contour.length; i++) {
      if (contour[i] > 0) voicedPts++;
    }

    var durationSec = sr > 0 ? rawLen / sr : 0;
    var activeDurationSec = sr > 0 ? trimmedLen / sr : 0;
    var voicedDurationSec = sr > 0 ? (voicedFrames * VAD_FRAME_SAMPLES) / sr : 0;
    var voicedRatio = totalFrames > 0 ? clamp(voicedFrames / totalFrames, 0, 1) : 0;
    var articulationRatio = activeDurationSec > 0 ? clamp(voicedDurationSec / activeDurationSec, 0, 1) : 0;

    var toneConfidence = computeToneConfidence(
      detectedTone,
      pitchSlopeSemitones,
      pitchStdSemitones,
      turnPointPos,
      voicedPts,
      pitchMinHz,
      pitchMaxHz
    );
    var toneMatchPct = computeToneMatchPct(
      params.targetTone,
      detectedTone,
      toneConfidence,
      pitchSlopeSemitones,
      pitchStdSemitones,
      turnPointPos,
      pitchMinHz,
      pitchMaxHz
    );

    var intonationScore = 0;
    if (pitchMeanHz > 0 && voicedPts >= 2) {
      if (pitchStdSemitones >= 2.0 && pitchStdSemitones <= 5.2) {
        intonationScore = Math.round(clamp(84 + (1 - Math.abs(pitchStdSemitones - 3.4) / 2.2) * 14, 78, 98));
      } else if (pitchStdSemitones < 2.0) {
        intonationScore = Math.round(clamp(38 + pitchStdSemitones * 23, 35, 84));
      } else {
        intonationScore = Math.round(clamp(92 - (pitchStdSemitones - 5.2) * 6.5, 62, 92));
      }
    }

    var durScale = Math.max(1, activeDurationSec / 10);
    var pauseRate = pauseCount / durScale;
    var fluencySignalScore = voicedFrames > 0
      ? Math.round(clamp(44 + articulationRatio * 56 - Math.max(0, pauseRate - 0.8) * 9 - longPauseCount * 8, 15, 100))
      : 0;

    var snrScore = clamp(snrDb * 2.8 + 18, 12, 98);
    var clarityScore = voicedFrames > 0
      ? Math.round(clamp(snrScore * 0.74 + articulationRatio * 100 * 0.26, 15, 100))
      : 0;

    return {
      engine: engine,
      durationSec: round2(durationSec),
      activeDurationSec: round2(activeDurationSec),
      voicedDurationSec: round2(voicedDurationSec),
      voicedFrames: voicedFrames,
      totalFrames: totalFrames,
      voicedRatio: round3(voicedRatio),
      articulationRatio: round3(articulationRatio),
      pauseCount: pauseCount,
      longPauseCount: longPauseCount,
      snrDb: round2(snrDb),
      noiseFloor: Number(noiseFloor.toFixed(5)),
      pitchMeanHz: round1(pitchMeanHz),
      pitchStdHz: round2(pitchStdHz),
      pitchStdSemitones: round2(pitchStdSemitones),
      pitchMinHz: round1(pitchMinHz),
      pitchMaxHz: round1(pitchMaxHz),
      pitchSlopeSemitones: round2(pitchSlopeSemitones),
      turnPointPos: round2(turnPointPos),
      detectedTone: detectedTone,
      toneConfidence: toneConfidence,
      toneMatchPct: toneMatchPct,
      intonationScore: intonationScore,
      fluencySignalScore: fluencySignalScore,
      clarityScore: clarityScore,
      pitchContour: contour
    };
  }

  function buildSilentAcoustic(engine, durationSec) {
    return computeAcousticTelemetry({
      engine: engine,
      sampleRate: TARGET_SAMPLE_RATE,
      rawLen: Math.round((durationSec || 0) * TARGET_SAMPLE_RATE),
      trimmedLen: 0,
      voicedFrames: 0,
      totalFrames: Math.floor(((durationSec || 0) * TARGET_SAMPLE_RATE) / VAD_FRAME_SAMPLES),
      pauseCount: 0,
      longPauseCount: 0,
      snrDb: 0,
      noiseFloor: 0,
      pitchMeanHz: 0,
      pitchStdHz: 0,
      pitchStdSemitones: 0,
      pitchMinHz: 0,
      pitchMaxHz: 0,
      pitchSlopeSemitones: 0,
      turnPointPos: 0,
      detectedTone: 0,
      pitchContour: []
    });
  }

  function analyzeWithWasm(ex, samples, sr, maxContour, targetTone) {
    var n = samples.length;
    ex.wasm_reset_heap();

    var pcmPtr = ex.wasm_alloc(n * 4);
    var statsPtr = ex.wasm_alloc(16);
    var metaPtr = ex.wasm_alloc(32);
    var sumPtr = ex.wasm_alloc(32);
    if (!pcmPtr || !statsPtr || !metaPtr || !sumPtr) {
      throw new Error('Wasm memory allocation failed');
    }

    new Float32Array(ex.memory.buffer, pcmPtr, n).set(samples);
    ex.wasm_highpass_dc_rms(pcmPtr, n, sr, statsPtr);

    var statsView = new Float32Array(ex.memory.buffer, statsPtr, 4);
    var rawRms = statsView[0];
    var rawPeak = statsView[1];

    if (n < MIN_AUDIO_SAMPLES || rawRms < SILENCE_RMS_THRESHOLD || rawPeak < SILENCE_PEAK_THRESHOLD) {
      return {
        ok: true,
        silent: true,
        reason: n < MIN_AUDIO_SAMPLES ? 'too_short' : 'silent_audio',
        samples: null,
        rawRms: rawRms,
        rawPeak: rawPeak,
        rms: rawRms,
        peak: rawPeak,
        trimmedRatio: 0,
        acoustic: buildSilentAcoustic('wasm', n / sr)
      };
    }

    ex.wasm_vad_analyze(pcmPtr, n, VAD_FRAME_SAMPLES, VAD_PAD_FRAMES, metaPtr);
    var meta = new Int32Array(ex.memory.buffer, metaPtr, 8);
    var startSample = meta[0];
    var endSample = meta[1];
    var voicedFrames = meta[2];
    var totalFrames = meta[3];
    var pauseCount = meta[4];
    var longPauseCount = meta[5];
    var snrDb = meta[6] / 100;
    var noiseFloor = meta[7] / 100000;

    if (endSample - startSample < MIN_AUDIO_SAMPLES) {
      startSample = 0;
      endSample = n;
    }
    var trimmedLen = endSample - startSample;
    var trimmedRatio = Math.max(0, 1 - (trimmedLen / n));
    var trimPtr = pcmPtr + startSample * 4;

    var maxPts = maxContour > 0 ? maxContour : DEFAULT_MAX_CONTOUR;
    var contourPtr = ex.wasm_alloc(maxPts * 4);
    var ptsWritten = contourPtr
      ? ex.wasm_extract_pitch_contour(trimPtr, trimmedLen, sr, 160, 640, contourPtr, maxPts, sumPtr)
      : 0;

    var sumView = new Float32Array(ex.memory.buffer, sumPtr, 8);
    var contourArr = [];
    if (contourPtr && ptsWritten > 0) {
      var cView = new Float32Array(ex.memory.buffer, contourPtr, ptsWritten);
      for (var c = 0; c < ptsWritten; c++) {
        contourArr.push(round1(cView[c]));
      }
    }

    var pitchMeanHz = sumView[0];
    var pitchStdHz = sumView[1];
    var pitchStdSemitones = sumView[2];
    var pitchMinHz = sumView[3];
    var pitchMaxHz = sumView[4];
    var pitchSlopeSemitones = sumView[5];
    var turnPointPos = sumView[6];
    var detectedTone = pitchMeanHz > 0 ? Math.round(sumView[7]) : 0;

    var normRms = ex.wasm_normalize_softlimit(trimPtr, trimmedLen, NORMALIZE_TARGET_PEAK, MAX_NORMALIZE_GAIN);
    var normalized = new Float32Array(trimmedLen);
    normalized.set(new Float32Array(ex.memory.buffer, trimPtr, trimmedLen));

    var normPeak = 0;
    for (var i = 0; i < normalized.length; i++) {
      var a = Math.abs(normalized[i]);
      if (a > normPeak) normPeak = a;
    }

    var acoustic = computeAcousticTelemetry({
      engine: 'wasm',
      sampleRate: sr,
      rawLen: n,
      trimmedLen: trimmedLen,
      voicedFrames: voicedFrames,
      totalFrames: totalFrames,
      pauseCount: pauseCount,
      longPauseCount: longPauseCount,
      snrDb: snrDb,
      noiseFloor: noiseFloor,
      pitchMeanHz: pitchMeanHz,
      pitchStdHz: pitchStdHz,
      pitchStdSemitones: pitchStdSemitones,
      pitchMinHz: pitchMinHz,
      pitchMaxHz: pitchMaxHz,
      pitchSlopeSemitones: pitchSlopeSemitones,
      turnPointPos: turnPointPos,
      detectedTone: detectedTone,
      pitchContour: contourArr,
      targetTone: targetTone
    });

    return {
      ok: true,
      silent: false,
      samples: normalized,
      rawRms: rawRms,
      rawPeak: rawPeak,
      rms: normRms,
      peak: normPeak,
      trimmedRatio: trimmedRatio,
      acoustic: acoustic
    };
  }

  function analyzeWithJsFallback(samples, sr, targetTone) {
    var n = samples.length;
    var sum = 0;
    for (var i = 0; i < n; i++) sum += samples[i];
    var mean = sum / n;

    var centered = new Float32Array(n);
    var rawSumSq = 0;
    var rawPeak = 0;
    for (var j = 0; j < n; j++) {
      var v = samples[j] - mean;
      centered[j] = v;
      var av = Math.abs(v);
      if (av > rawPeak) rawPeak = av;
      rawSumSq += v * v;
    }
    var rawRms = Math.sqrt(rawSumSq / n);

    if (n < MIN_AUDIO_SAMPLES || rawRms < SILENCE_RMS_THRESHOLD || rawPeak < SILENCE_PEAK_THRESHOLD) {
      return {
        ok: true,
        silent: true,
        reason: n < MIN_AUDIO_SAMPLES ? 'too_short' : 'silent_audio',
        samples: null,
        rawRms: rawRms,
        rawPeak: rawPeak,
        rms: rawRms,
        peak: rawPeak,
        trimmedRatio: 0,
        acoustic: buildSilentAcoustic('js_fallback', n / sr)
      };
    }

    // Lọc thông cao 80Hz
    var rc = 1 / (2 * Math.PI * 80);
    var dt = 1 / sr;
    var alpha = rc / (rc + dt);
    if (n >= 2) {
      var prevIn = centered[0];
      var prevOut = centered[0];
      for (var k = 1; k < n; k++) {
        var x = centered[k];
        var y = alpha * (prevOut + x - prevIn);
        prevIn = x;
        prevOut = y;
        centered[k] = y;
      }
    }

    var totalFrames = Math.floor(n / VAD_FRAME_SAMPLES);
    var startSample = 0;
    var endSample = n;
    var voicedFrames = totalFrames;
    var pauseCount = 0;
    var longPauseCount = 0;
    var noiseFloor = 0;
    var snrDb = 24;

    if (totalFrames >= 3) {
      var frameRms = new Array(totalFrames);
      for (var f = 0; f < totalFrames; f++) {
        var off = f * VAD_FRAME_SAMPLES;
        var fSq = 0;
        for (var m = 0; m < VAD_FRAME_SAMPLES; m++) {
          var sm = centered[off + m];
          fSq += sm * sm;
        }
        frameRms[f] = Math.sqrt(fSq / VAD_FRAME_SAMPLES);
      }
      var sorted = frameRms.slice().sort(function (a, b) { return a - b; });
      noiseFloor = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.2))] || 0;
      var vadThresh = Math.max(0.0015, Math.min(0.012, noiseFloor * 2.2));
      var firstActive = -1;
      var lastActive = -1;
      voicedFrames = 0;
      var voicedSq = 0;
      for (var fi = 0; fi < totalFrames; fi++) {
        if (frameRms[fi] >= vadThresh) {
          if (firstActive === -1) firstActive = fi;
          lastActive = fi;
          voicedFrames++;
          voicedSq += frameRms[fi] * frameRms[fi];
        }
      }
      if (firstActive !== -1) {
        var sRun = 0;
        for (var pi = firstActive; pi <= lastActive; pi++) {
          if (frameRms[pi] < vadThresh) sRun++;
          else {
            if (sRun >= 12) pauseCount++;
            if (sRun >= 30) longPauseCount++;
            sRun = 0;
          }
        }
        var sf = Math.max(0, firstActive - VAD_PAD_FRAMES);
        var ef = Math.min(totalFrames, lastActive + 1 + VAD_PAD_FRAMES);
        var ss = sf * VAD_FRAME_SAMPLES;
        var es = ef >= totalFrames ? n : ef * VAD_FRAME_SAMPLES;
        if (es - ss >= MIN_AUDIO_SAMPLES) {
          startSample = ss;
          endSample = es;
        }
      }
      if (voicedFrames > 0) {
        var spRms = Math.sqrt(voicedSq / voicedFrames);
        snrDb = clamp(20 * Math.log(spRms / Math.max(noiseFloor, 1e-5)) / Math.LN10, -60, 90);
      }
    }

    var trimmed = centered.slice(startSample, endSample);
    var trimmedRatio = Math.max(0, 1 - (trimmed.length / n));

    var tSq = 0;
    var tPeak = 0;
    for (var ti = 0; ti < trimmed.length; ti++) {
      var at = Math.abs(trimmed[ti]);
      if (at > tPeak) tPeak = at;
      tSq += trimmed[ti] * trimmed[ti];
    }
    var tRms = Math.sqrt(tSq / trimmed.length);
    var refPeak = Math.max(tPeak, tRms * 2.2, 0.005);
    var gain = (refPeak > 0 && refPeak < NORMALIZE_TARGET_PEAK)
      ? Math.min(MAX_NORMALIZE_GAIN, NORMALIZE_TARGET_PEAK / refPeak)
      : 1;

    var normalized = new Float32Array(trimmed.length);
    var outSq = 0;
    var outPeak = 0;
    for (var ni = 0; ni < trimmed.length; ni++) {
      var xn = trimmed[ni] * gain;
      var axn = Math.abs(xn);
      var yn = axn <= 0.85 ? xn : (xn < 0 ? -1 : 1) * (0.85 + 0.14 * Math.tanh((axn - 0.85) / 0.14));
      normalized[ni] = yn;
      var ayn = Math.abs(yn);
      if (ayn > outPeak) outPeak = ayn;
      outSq += yn * yn;
    }

    var acoustic = computeAcousticTelemetry({
      engine: 'js_fallback',
      sampleRate: sr,
      rawLen: n,
      trimmedLen: normalized.length,
      voicedFrames: voicedFrames,
      totalFrames: totalFrames,
      pauseCount: pauseCount,
      longPauseCount: longPauseCount,
      snrDb: snrDb,
      noiseFloor: noiseFloor,
      pitchMeanHz: 0,
      pitchStdHz: 0,
      pitchStdSemitones: 0,
      pitchMinHz: 0,
      pitchMaxHz: 0,
      pitchSlopeSemitones: 0,
      turnPointPos: 0,
      detectedTone: 0,
      pitchContour: [],
      targetTone: targetTone
    });

    return {
      ok: true,
      silent: false,
      samples: normalized,
      rawRms: rawRms,
      rawPeak: rawPeak,
      rms: Math.sqrt(outSq / normalized.length),
      peak: outPeak,
      trimmedRatio: trimmedRatio,
      acoustic: acoustic
    };
  }

  async function processWorkerMessage(msg, customWasmLoader) {
    if (!msg || typeof msg !== 'object') return null;
    var reqId = msg.reqId;

    if (msg.type === 'init') {
      try {
        var ex = customWasmLoader ? await customWasmLoader(msg.wasmUrl) : await loadWasmExports(msg.wasmUrl);
        return { type: 'init', reqId: reqId, ok: Boolean(ex), engine: ex ? 'wasm' : 'js_fallback' };
      } catch (err) {
        return {
          type: 'init',
          reqId: reqId,
          ok: false,
          engine: 'js_fallback',
          error: (err && err.message) ? err.message : String(err || 'Wasm init failed')
        };
      }
    }

    if (msg.type === 'analyze_pcm') {
      var audio = msg.audio;
      if (audio instanceof ArrayBuffer) {
        audio = new Float32Array(audio);
      } else if (audio && !(audio instanceof Float32Array) && typeof audio.length === 'number') {
        audio = new Float32Array(audio);
      }
      var sr = Number(msg.sampleRate) > 0 ? Number(msg.sampleRate) : TARGET_SAMPLE_RATE;
      var maxContour = Number(msg.maxContourPoints) > 0 ? Number(msg.maxContourPoints) : DEFAULT_MAX_CONTOUR;
      var targetTone = Number(msg.targetTone) || 0;

      if (!(audio instanceof Float32Array) || audio.length === 0) {
        return {
          type: 'result',
          reqId: reqId,
          ok: true,
          silent: true,
          reason: 'empty_audio',
          samples: null,
          rawRms: 0,
          rawPeak: 0,
          rms: 0,
          peak: 0,
          trimmedRatio: 0,
          acoustic: buildSilentAcoustic('wasm', 0)
        };
      }

      try {
        var wasmEx = customWasmLoader ? await customWasmLoader(msg.wasmUrl) : await loadWasmExports(msg.wasmUrl);
        var res = analyzeWithWasm(wasmEx, audio, sr, maxContour, targetTone);
        res.type = 'result';
        res.reqId = reqId;
        return res;
      } catch (wasmErr) {
        var fb = analyzeWithJsFallback(audio, sr, targetTone);
        fb.type = 'result';
        fb.reqId = reqId;
        fb.wasmFallbackReason = (wasmErr && wasmErr.message) ? wasmErr.message : String(wasmErr);
        return fb;
      }
    }

    return null;
  }

  if (typeof globalScope.addEventListener === 'function' && typeof globalScope.postMessage === 'function') {
    globalScope.addEventListener('message', function (event) {
      var msg = event && event.data;
      if (!msg || typeof msg !== 'object') return;
      processWorkerMessage(msg).then(function (reply) {
        if (!reply) return;
        if (reply.samples && reply.samples.buffer instanceof ArrayBuffer) {
          globalScope.postMessage(reply, [reply.samples.buffer]);
        } else {
          globalScope.postMessage(reply);
        }
      }).catch(function (err) {
        globalScope.postMessage({
          type: 'result',
          reqId: msg.reqId,
          ok: false,
          error: (err && err.message) ? err.message : String(err || 'Audio DSP worker error')
        });
      });
    });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      processWorkerMessage: processWorkerMessage,
      analyzeWithWasm: analyzeWithWasm,
      analyzeWithJsFallback: analyzeWithJsFallback,
      computeAcousticTelemetry: computeAcousticTelemetry
    };
  }
})(typeof self !== 'undefined' ? self : globalThis);
