/* LinguaPath S4Whisper — Shared AudioContext, VAD/Normalization & Hybrid Cloud/On-Device STT */
(function (global) {
  'use strict';

  var TARGET_SAMPLE_RATE = 16000;
  var SILENCE_RMS_THRESHOLD = 0.0012;
  var SILENCE_PEAK_THRESHOLD = 0.008;
  var MIN_AUDIO_SAMPLES = 1280; // 0.08s @ 16kHz
  var VAD_FRAME_SAMPLES = 320; // 20ms @ 16kHz
  var VAD_PAD_FRAMES = 8; // 160ms padding on each side
  var NORMALIZE_TARGET_PEAK = 0.85;
  var MAX_NORMALIZE_GAIN = 14;
  var DEFAULT_TIMEOUT_MS = 60000;
  var CLOUD_TIMEOUT_MS = 20000;
  var AUDIO_WORKER_TIMEOUT_MS = 15000;

  var STORAGE_AI_KEY = 'lp_ai_api_key_v1';
  var STORAGE_SPEAKING_KEY = 'lp_speaking_gemini_key_v1';
  var STORAGE_AI_BASE = 'lp_ai_base_url_v1';
  var DEFAULT_CLOUD_CONFIG = {
    baseUrl: '',
    apiKey: '',
    sttModel: 'whisper-1'
  };

  var scriptSrc = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src)
    ? document.currentScript.src
    : '';
  function resolveAssetUrl(fileNameWithQuery) {
    if (scriptSrc) {
      try { return new URL(fileNameWithQuery, scriptSrc).href; } catch (e) {}
    }
    var p = (typeof location !== 'undefined' && location.pathname) ? location.pathname.replace(/\\/g, '/') : '';
    var parts = p.split('/').filter(Boolean);
    var dirParts = (parts.length && parts[parts.length - 1].indexOf('.') !== -1)
      ? parts.slice(0, -1)
      : parts;
    var rootIdx = Math.max(
      dirParts.lastIndexOf('ielts'),
      dirParts.lastIndexOf('hsk'),
      dirParts.lastIndexOf('toeic')
    );
    if (rootIdx !== -1) {
      var depth = dirParts.length - rootIdx;
      return (depth >= 2 ? '../../assets/' : '../assets/') + fileNameWithQuery;
    }
    var subIdx = Math.max(
      dirParts.lastIndexOf('tedtalks'),
      dirParts.lastIndexOf('speaking')
    );
    if (subIdx !== -1) {
      var depth2 = dirParts.length - subIdx;
      return (depth2 >= 2 ? '../../assets/' : '../assets/') + fileNameWithQuery;
    }
    return 'assets/' + fileNameWithQuery;
  }
  var workerUrl = resolveAssetUrl('s4-whisper-worker.js?v=3');
  var audioWorkerUrl = resolveAssetUrl('s4-audio-worker.js?v=1');
  var coreWasmUrl = resolveAssetUrl('s4-core.wasm?v=1');

  var sharedAudioCtx = null;
  var workerInstance = null;
  var modelReady = false;
  var nextReqId = 1;
  var latestBlobTranscribeGen = 0;
  var pendingReqs = new Map();
  var activeProgressListeners = new Set();

  var audioWorkerInstance = null;
  var audioDspReady = false;
  var audioNextReqId = 1;
  var audioPendingReqs = new Map();

  function isSupported() {
    var hasAc = Boolean(typeof global.AudioContext === 'function' || typeof global.webkitAudioContext === 'function');
    var hasWorkerOrFetch = Boolean(typeof global.Worker === 'function' || typeof global.fetch === 'function');
    return Boolean(hasAc && hasWorkerOrFetch);
  }

  function isSafeAiBaseUrl(raw) {
    var s = String(raw || '').trim();
    if (!s) return true;
    try {
      var u = new URL(s);
      if (u.protocol === 'https:') return true;
      if (u.protocol === 'http:' && (u.hostname === 'localhost' || u.hostname === '127.0.0.1')) return true;
      return false;
    } catch (e) {
      return false;
    }
  }

  function normalizeBaseUrl(raw) {
    var cleaned = String(raw || '')
      .trim()
      .replace(/\/+$/, '')
      .replace(/\/(?:chat\/completions|audio\/transcriptions)$/i, '');
    if (!cleaned || !isSafeAiBaseUrl(cleaned)) return '';
    return cleaned;
  }

  function inferSttModel(baseUrl) {
    var b = String(baseUrl || '').toLowerCase();
    if (b.indexOf('fosta.app') !== -1) return 'cx/transcribe';
    if (b.indexOf('api.groq.com') !== -1) return 'whisper-large-v3-turbo';
    return DEFAULT_CLOUD_CONFIG.sttModel;
  }

  function isGoogleKey(key) {
    return /^(AIza|AQ\.)/i.test(String(key || '').trim());
  }

  function inferOpenAiBaseUrl(apiKey, rawBase) {
    var base = normalizeBaseUrl(rawBase);
    if (base) return base;
    var k = String(apiKey || '').trim();
    if (/^gsk_/i.test(k)) return 'https://api.groq.com/openai/v1';
    if (/^sk-or-/i.test(k)) return 'https://openrouter.ai/api/v1';
    if (/^sk-/i.test(k)) return 'https://api.openai.com/v1';
    return '';
  }

  function readStoragePref(key) {
    try {
      if (global.sessionStorage) {
        var sv = String(global.sessionStorage.getItem(key) || '').trim();
        if (sv) return sv;
      }
    } catch (e) {}
    try {
      if (global.localStorage) {
        var lv = String(global.localStorage.getItem(key) || '').trim();
        if (lv) return lv;
      }
    } catch (e) {}
    return '';
  }

  function getCloudConfig() {
    var key = readStoragePref(STORAGE_SPEAKING_KEY) || readStoragePref(STORAGE_AI_KEY);
    var base = readStoragePref(STORAGE_AI_BASE);
    var useKey = (key && !isGoogleKey(key)) ? key : '';
    var useBase = inferOpenAiBaseUrl(useKey, base);
    return {
      baseUrl: useBase,
      apiKey: useKey,
      sttModel: inferSttModel(useBase)
    };
  }

  function resolveTransientCloudConfig(opts) {
    var saved = getCloudConfig();
    var o = opts || {};
    var hasKeyProp = Object.prototype.hasOwnProperty.call(o, 'apiKey');
    var rawKey = hasKeyProp ? String(o.apiKey || '').trim() : saved.apiKey;
    var apiKey = (rawKey && !isGoogleKey(rawKey)) ? rawKey : '';
    var hasBaseProp = Object.prototype.hasOwnProperty.call(o, 'baseUrl');
    var rawBase = hasBaseProp
      ? String(o.baseUrl || '').trim()
      : ((hasKeyProp && apiKey !== saved.apiKey) ? '' : saved.baseUrl);
    var baseUrl = inferOpenAiBaseUrl(apiKey, rawBase);
    var isOpenRouter = /^sk-or-/i.test(apiKey) || /openrouter\.ai/i.test(baseUrl);
    var sttModel = o.sttModel || (baseUrl ? inferSttModel(baseUrl) : saved.sttModel);
    return {
      apiKey: apiKey,
      baseUrl: baseUrl,
      sttModel: sttModel,
      isOpenRouter: isOpenRouter
    };
  }

  function setCloudConfig(cfg) {
    var o = cfg || {};
    var persist = Boolean(o.persist);
    var targetStore = persist ? global.localStorage : global.sessionStorage;
    var otherStore = persist ? global.sessionStorage : global.localStorage;
    try {
      if (Object.prototype.hasOwnProperty.call(o, 'apiKey')) {
        // Tránh nhân bản API key sang STORAGE_AI_KEY khi đã lưu tại STORAGE_SPEAKING_KEY
        try { if (global.localStorage) global.localStorage.removeItem(STORAGE_AI_KEY); } catch (e) {}
        try { if (global.sessionStorage) global.sessionStorage.removeItem(STORAGE_AI_KEY); } catch (e) {}
        if (!o.useSharedSpeakingKey) {
          var nextKey = String(o.apiKey || '').trim();
          if (nextKey && targetStore) targetStore.setItem(STORAGE_AI_KEY, nextKey);
          if (otherStore) otherStore.removeItem(STORAGE_AI_KEY);
        }
      }
      if (Object.prototype.hasOwnProperty.call(o, 'baseUrl')) {
        var nextBase = normalizeBaseUrl(o.baseUrl);
        if (nextBase && targetStore) targetStore.setItem(STORAGE_AI_BASE, nextBase);
        else if (targetStore) targetStore.removeItem(STORAGE_AI_BASE);
        if (otherStore) otherStore.removeItem(STORAGE_AI_BASE);
      }
    } catch (e) {}
    return getCloudConfig();
  }

  var VOICE_AUDIO_CONSTRAINTS = {
    channelCount: { ideal: 1 },
    echoCancellation: { ideal: true },
    noiseSuppression: { ideal: true },
    autoGainControl: { ideal: true },
    sampleRate: { ideal: 48000 }
  };
  var VOICE_MIME_CANDIDATES = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4;codecs=mp4a.40.2',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg'
  ];

  function getVoiceAudioConstraints() {
    return Object.assign({}, VOICE_AUDIO_CONSTRAINTS);
  }

  function acquireVoiceStream() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      return Promise.reject(new Error('getUserMedia unsupported'));
    }
    return navigator.mediaDevices.getUserMedia({ audio: getVoiceAudioConstraints() }).catch(function (err) {
      if (err && (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError' || err.name === 'TypeError')) {
        return navigator.mediaDevices.getUserMedia({ audio: true });
      }
      throw err;
    });
  }

  function pickSupportedAudioMime() {
    if (typeof global.MediaRecorder !== 'function' || typeof global.MediaRecorder.isTypeSupported !== 'function') {
      return '';
    }
    for (var i = 0; i < VOICE_MIME_CANDIDATES.length; i++) {
      try {
        if (global.MediaRecorder.isTypeSupported(VOICE_MIME_CANDIDATES[i])) {
          return VOICE_MIME_CANDIDATES[i];
        }
      } catch (e) {}
    }
    return '';
  }

  function createVoiceRecorder(stream, opts) {
    if (typeof global.MediaRecorder !== 'function') {
      throw new Error('MediaRecorder unsupported');
    }
    var bits = (opts && opts.audioBitsPerSecond) || 48000;
    var mime = (opts && opts.mimeType) || pickSupportedAudioMime();
    var rec = null;
    try {
      rec = mime
        ? new global.MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: bits })
        : new global.MediaRecorder(stream, { audioBitsPerSecond: bits });
    } catch (e1) {
      try {
        rec = mime
          ? new global.MediaRecorder(stream, { mimeType: mime })
          : new global.MediaRecorder(stream);
      } catch (e2) {
        rec = new global.MediaRecorder(stream);
      }
    }
    rec._lpPreferredMime = rec.mimeType || mime || 'audio/webm';
    return rec;
  }

  function getSharedAudioContext() {
    var AC = global.AudioContext || global.webkitAudioContext;
    if (typeof AC !== 'function') return null;
    if (sharedAudioCtx && sharedAudioCtx.state !== 'closed') {
      if (sharedAudioCtx.state === 'suspended' || sharedAudioCtx.state === 'interrupted') {
        try { sharedAudioCtx.resume().catch(function () {}); } catch (e) {}
      }
      return sharedAudioCtx;
    }
    try {
      sharedAudioCtx = new AC();
    } catch (e) {
      sharedAudioCtx = null;
      return null;
    }
    if (sharedAudioCtx && (sharedAudioCtx.state === 'suspended' || sharedAudioCtx.state === 'interrupted')) {
      try { sharedAudioCtx.resume().catch(function () {}); } catch (err) {}
    }
    return sharedAudioCtx;
  }

  function decodeAudioBuffer(ctx, rawBuf) {
    return new Promise(function (resolve, reject) {
      var settled = false;
      var onOk = function (buf) {
        if (!settled) { settled = true; resolve(buf); }
      };
      var onErr = function (err) {
        if (!settled) { settled = true; reject(err || new Error('decodeAudioData failed')); }
      };
      try {
        var prom = ctx.decodeAudioData(rawBuf, onOk, onErr);
        if (prom && typeof prom.then === 'function') {
          prom.then(onOk, onErr);
        }
      } catch (err) {
        onErr(err);
      }
    });
  }

  function readBlobAsArrayBuffer(blob) {
    if (!blob) return Promise.reject(new Error('Missing audio blob'));
    if (typeof blob.arrayBuffer === 'function') {
      return blob.arrayBuffer();
    }
    if (typeof global.FileReader === 'function') {
      return new Promise(function (resolve, reject) {
        try {
          var reader = new global.FileReader();
          reader.onloadend = function () {
            if (reader.result instanceof ArrayBuffer) resolve(reader.result);
            else reject(new Error('Failed to read audio blob'));
          };
          reader.onerror = function () { reject(new Error('FileReader error')); };
          reader.readAsArrayBuffer(blob);
        } catch (err) {
          reject(err);
        }
      });
    }
    return Promise.reject(new Error('No blob buffer reader available'));
  }

  function mixToMonoBuffer(audioBuffer) {
    var channels = audioBuffer.numberOfChannels || 1;
    var length = audioBuffer.length || 0;
    var mono = new Float32Array(length);
    for (var ch = 0; ch < channels; ch++) {
      var chData = audioBuffer.getChannelData(ch);
      for (var i = 0; i < length; i++) {
        mono[i] += chData[i] / channels;
      }
    }
    return mono;
  }

  function resampleLinear16k(mono, srcRate) {
    if (!srcRate || srcRate === TARGET_SAMPLE_RATE) return mono;
    var ratio = srcRate / TARGET_SAMPLE_RATE;
    var outLen = Math.max(1, Math.round(mono.length / ratio));
    var out = new Float32Array(outLen);
    for (var i = 0; i < outLen; i++) {
      var pos = i * ratio;
      var i0 = Math.floor(pos);
      var i1 = Math.min(mono.length - 1, i0 + 1);
      var frac = pos - i0;
      out[i] = mono[i0] * (1 - frac) + mono[i1] * frac;
    }
    return out;
  }

  function applyHighPass80Hz(samples, sampleRate) {
    if (!samples || samples.length < 2) return samples;
    var sr = sampleRate || TARGET_SAMPLE_RATE;
    var rc = 1 / (2 * Math.PI * 80);
    var dt = 1 / sr;
    var alpha = rc / (rc + dt);
    var out = new Float32Array(samples.length);
    out[0] = samples[0];
    for (var i = 1; i < samples.length; i++) {
      out[i] = alpha * (out[i - 1] + samples[i] - samples[i - 1]);
    }
    return out;
  }

  function resampleDecodedBuffer(audioBuffer, opts) {
    var skipHighPass = Boolean(opts && opts.skipHighPass);
    var durationSec = Number(audioBuffer && audioBuffer.duration) || 0;
    var targetLen = Math.max(1, Math.ceil(durationSec * TARGET_SAMPLE_RATE));
    var OfflineAC = global.OfflineAudioContext || global.webkitOfflineAudioContext;

    if (typeof OfflineAC === 'function' && audioBuffer.sampleRate !== TARGET_SAMPLE_RATE) {
      try {
        var offline = new OfflineAC(1, targetLen, TARGET_SAMPLE_RATE);
        var src = offline.createBufferSource();
        src.buffer = audioBuffer;
        if (!skipHighPass && typeof offline.createBiquadFilter === 'function') {
          var hp = offline.createBiquadFilter();
          hp.type = 'highpass';
          hp.frequency.value = 80;
          hp.Q.value = 0.707;
          src.connect(hp);
          hp.connect(offline.destination);
        } else {
          src.connect(offline.destination);
        }
        src.start(0);
        return offline.startRendering().then(function (rendered) {
          return rendered.getChannelData(0).slice();
        }).catch(function () {
          var lin = resampleLinear16k(mixToMonoBuffer(audioBuffer), audioBuffer.sampleRate);
          return skipHighPass ? lin : applyHighPass80Hz(lin, TARGET_SAMPLE_RATE);
        });
      } catch (e) {}
    }

    var mono = mixToMonoBuffer(audioBuffer);
    var resampled = audioBuffer.sampleRate === TARGET_SAMPLE_RATE
      ? mono
      : resampleLinear16k(mono, audioBuffer.sampleRate);
    return Promise.resolve(skipHighPass ? resampled : applyHighPass80Hz(resampled, TARGET_SAMPLE_RATE));
  }

  function analyzeAudioEnergy(samples) {
    if (!samples || !samples.length) {
      return { rms: 0, peak: 0 };
    }
    var sumSq = 0;
    var peak = 0;
    for (var i = 0; i < samples.length; i++) {
      var v = Math.abs(samples[i]);
      if (v > peak) peak = v;
      sumSq += v * v;
    }
    return {
      rms: Math.sqrt(sumSq / samples.length),
      peak: peak
    };
  }

  function trimSilenceVad(centered) {
    var n = centered.length;
    var numFrames = Math.floor(n / VAD_FRAME_SAMPLES);
    if (numFrames < 3) {
      return {
        samples: centered,
        trimmedRatio: 0,
        voicedFrames: 0,
        totalFrames: numFrames,
        pauseCount: 0,
        longPauseCount: 0,
        snrDb: 0,
        noiseFloor: 0
      };
    }

    var frameRms = new Array(numFrames);
    for (var f = 0; f < numFrames; f++) {
      var offset = f * VAD_FRAME_SAMPLES;
      var sumSq = 0;
      for (var k = 0; k < VAD_FRAME_SAMPLES; k++) {
        var s = centered[offset + k];
        sumSq += s * s;
      }
      frameRms[f] = Math.sqrt(sumSq / VAD_FRAME_SAMPLES);
    }

    var sorted = frameRms.slice().sort(function (a, b) { return a - b; });
    var noiseFloor = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.2))] || 0;
    var vadThresh = Math.max(0.0015, Math.min(0.012, noiseFloor * 2.2));

    var firstActive = -1;
    var lastActive = -1;
    var voicedFrames = 0;
    var voicedSumSq = 0;
    for (var i = 0; i < numFrames; i++) {
      if (frameRms[i] >= vadThresh) {
        if (firstActive === -1) firstActive = i;
        lastActive = i;
        voicedFrames++;
        voicedSumSq += frameRms[i] * frameRms[i];
      }
    }

    // If low-amplitude speech stays uniform below threshold, avoid dropping the whole clip
    if (firstActive === -1) {
      return {
        samples: centered,
        trimmedRatio: 0,
        voicedFrames: 0,
        totalFrames: numFrames,
        pauseCount: 0,
        longPauseCount: 0,
        snrDb: 0,
        noiseFloor: noiseFloor
      };
    }

    var pauseCount = 0;
    var longPauseCount = 0;
    var silentRun = 0;
    for (var p = firstActive; p <= lastActive; p++) {
      if (frameRms[p] < vadThresh) {
        silentRun++;
      } else {
        if (silentRun >= 12) pauseCount++;
        if (silentRun >= 30) longPauseCount++;
        silentRun = 0;
      }
    }

    var speechRms = voicedFrames > 0 ? Math.sqrt(voicedSumSq / voicedFrames) : 0;
    var snrDb = voicedFrames > 0
      ? Math.max(-60, Math.min(90, 20 * Math.log(speechRms / Math.max(noiseFloor, 1e-5)) / Math.LN10))
      : 0;

    var startFrame = Math.max(0, firstActive - VAD_PAD_FRAMES);
    var endFrame = Math.min(numFrames, lastActive + 1 + VAD_PAD_FRAMES);
    var startSample = startFrame * VAD_FRAME_SAMPLES;
    var endSample = (endFrame >= numFrames) ? n : (endFrame * VAD_FRAME_SAMPLES);

    if (endSample - startSample < MIN_AUDIO_SAMPLES) {
      return {
        samples: centered,
        trimmedRatio: 0,
        voicedFrames: voicedFrames,
        totalFrames: numFrames,
        pauseCount: pauseCount,
        longPauseCount: longPauseCount,
        snrDb: snrDb,
        noiseFloor: noiseFloor
      };
    }

    var sliced = centered.slice(startSample, endSample);
    return {
      samples: sliced,
      trimmedRatio: Math.max(0, 1 - (sliced.length / n)),
      voicedFrames: voicedFrames,
      totalFrames: numFrames,
      pauseCount: pauseCount,
      longPauseCount: longPauseCount,
      snrDb: snrDb,
      noiseFloor: noiseFloor
    };
  }

  function computeJsAcousticFallback(centered, trimmed, vadMeta, sampleRate) {
    var sr = Number(sampleRate) > 0 ? Number(sampleRate) : TARGET_SAMPLE_RATE;
    var rawLen = centered ? centered.length : 0;
    var trimLen = trimmed ? trimmed.length : 0;
    var m = vadMeta || {};
    var voicedFrames = Number(m.voicedFrames) || 0;
    var totalFrames = Number(m.totalFrames) || Math.floor(rawLen / VAD_FRAME_SAMPLES);
    var pauseCount = Number(m.pauseCount) || 0;
    var longPauseCount = Number(m.longPauseCount) || 0;
    var snrDb = Number(m.snrDb) || 0;
    var noiseFloor = Number(m.noiseFloor) || 0;

    var durationSec = sr > 0 ? rawLen / sr : 0;
    var activeDurationSec = sr > 0 ? trimLen / sr : 0;
    var voicedDurationSec = sr > 0 ? (voicedFrames * VAD_FRAME_SAMPLES) / sr : 0;
    var voicedRatio = totalFrames > 0 ? Math.max(0, Math.min(1, voicedFrames / totalFrames)) : 0;
    var articulationRatio = activeDurationSec > 0 ? Math.max(0, Math.min(1, voicedDurationSec / activeDurationSec)) : 0;

    var durScale = Math.max(1, activeDurationSec / 10);
    var pauseRate = pauseCount / durScale;
    var fluencySignalScore = voicedFrames > 0
      ? Math.round(Math.max(15, Math.min(100, 44 + articulationRatio * 56 - Math.max(0, pauseRate - 0.8) * 9 - longPauseCount * 8)))
      : 0;
    var snrScore = Math.max(12, Math.min(98, snrDb * 2.8 + 18));
    var clarityScore = voicedFrames > 0
      ? Math.round(Math.max(15, Math.min(100, snrScore * 0.74 + articulationRatio * 100 * 0.26)))
      : 0;

    return {
      engine: 'js_fallback',
      durationSec: Math.round(durationSec * 100) / 100,
      activeDurationSec: Math.round(activeDurationSec * 100) / 100,
      voicedDurationSec: Math.round(voicedDurationSec * 100) / 100,
      voicedFrames: voicedFrames,
      totalFrames: totalFrames,
      voicedRatio: Math.round(voicedRatio * 1000) / 1000,
      articulationRatio: Math.round(articulationRatio * 1000) / 1000,
      pauseCount: pauseCount,
      longPauseCount: longPauseCount,
      snrDb: Math.round(snrDb * 100) / 100,
      noiseFloor: Number(noiseFloor.toFixed(5)),
      pitchMeanHz: 0,
      pitchStdHz: 0,
      pitchStdSemitones: 0,
      pitchMinHz: 0,
      pitchMaxHz: 0,
      pitchSlopeSemitones: 0,
      turnPointPos: 0,
      detectedTone: 0,
      toneConfidence: 0,
      toneMatchPct: null,
      intonationScore: 0,
      fluencySignalScore: fluencySignalScore,
      clarityScore: clarityScore,
      pitchContour: []
    };
  }

  function computePercentile98Abs(samples) {
    if (!samples || !samples.length) return 0;
    var step = Math.max(1, Math.floor(samples.length / 4000));
    var mags = [];
    for (var i = 0; i < samples.length; i += step) {
      mags.push(Math.abs(samples[i]));
    }
    if (!mags.length) return 0;
    mags.sort(function (a, b) { return a - b; });
    return mags[Math.min(mags.length - 1, Math.floor(mags.length * 0.98))] || 0;
  }

  function softLimitSample(x) {
    var ax = Math.abs(x);
    if (ax <= 0.85) return x;
    var sign = x < 0 ? -1 : 1;
    return sign * (0.85 + 0.14 * Math.tanh((ax - 0.85) / 0.14));
  }

  function preprocessPcm16k(rawSamples) {
    if (!rawSamples || !rawSamples.length) {
      return { samples: null, rawRms: 0, rawPeak: 0, rms: 0, peak: 0, trimmedRatio: 0, acoustic: computeJsAcousticFallback(null, null, null, TARGET_SAMPLE_RATE) };
    }

    var n = rawSamples.length;
    var sum = 0;
    for (var i = 0; i < n; i++) sum += rawSamples[i];
    var mean = sum / n;

    var centered = new Float32Array(n);
    for (var j = 0; j < n; j++) {
      centered[j] = rawSamples[j] - mean;
    }

    var rawEnergy = analyzeAudioEnergy(centered);
    if (n < MIN_AUDIO_SAMPLES || rawEnergy.rms < SILENCE_RMS_THRESHOLD || rawEnergy.peak < SILENCE_PEAK_THRESHOLD) {
      return {
        samples: null,
        rawRms: rawEnergy.rms,
        rawPeak: rawEnergy.peak,
        rms: rawEnergy.rms,
        peak: rawEnergy.peak,
        trimmedRatio: 0,
        acoustic: computeJsAcousticFallback(centered, null, null, TARGET_SAMPLE_RATE)
      };
    }

    var vad = trimSilenceVad(centered);
    var trimmed = vad.samples;
    var trimmedEnergy = analyzeAudioEnergy(trimmed);

    var p98 = computePercentile98Abs(trimmed) || trimmedEnergy.peak;
    var refPeak = Math.max(p98, trimmedEnergy.rms * 2.2, 0.005);
    var gain = 1;
    if (rawEnergy.peak >= SILENCE_PEAK_THRESHOLD && refPeak > 0 && refPeak < NORMALIZE_TARGET_PEAK) {
      gain = Math.min(MAX_NORMALIZE_GAIN, NORMALIZE_TARGET_PEAK / refPeak);
    }

    var normalized = new Float32Array(trimmed.length);
    for (var idx = 0; idx < trimmed.length; idx++) {
      normalized[idx] = softLimitSample(trimmed[idx] * gain);
    }

    var finalEnergy = analyzeAudioEnergy(normalized);
    return {
      samples: normalized,
      rawRms: rawEnergy.rms,
      rawPeak: rawEnergy.peak,
      rms: finalEnergy.rms,
      peak: finalEnergy.peak,
      trimmedRatio: vad.trimmedRatio,
      acoustic: computeJsAcousticFallback(centered, trimmed, vad, TARGET_SAMPLE_RATE)
    };
  }

  function writeAscii(view, offset, str) {
    for (var i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  function encodeWav16kMono(samples) {
    var len = samples ? samples.length : 0;
    var dataSize = len * 2;
    var buf = new ArrayBuffer(44 + dataSize);
    var view = new DataView(buf);

    writeAscii(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeAscii(view, 8, 'WAVE');
    writeAscii(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, TARGET_SAMPLE_RATE, true);
    view.setUint32(28, TARGET_SAMPLE_RATE * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeAscii(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    var pos = 44;
    for (var i = 0; i < len; i++) {
      var s = samples[i];
      if (s > 1) s = 1;
      else if (s < -1) s = -1;
      view.setInt16(pos, s < 0 ? Math.round(s * 32768) : Math.round(s * 32767), true);
      pos += 2;
    }
    return new global.Blob([buf], { type: 'audio/wav' });
  }

  function decodeBlobTo16kMono(blob, opts) {
    var o = opts || {};
    if (!blob || !(blob.size > 0)) {
      return Promise.resolve({
        silent: true,
        samples: null,
        wavBlob: null,
        rms: 0,
        peak: 0,
        rawRms: 0,
        rawPeak: 0,
        trimmedRatio: 0,
        durationSec: 0,
        sampleRate: TARGET_SAMPLE_RATE,
        reason: 'empty_blob',
        acoustic: computeJsAcousticFallback(null, null, null, TARGET_SAMPLE_RATE)
      });
    }
    var ctx = getSharedAudioContext();
    if (!ctx) {
      return Promise.reject(new Error('AudioContext not supported'));
    }

    var durationSec = 0;
    return readBlobAsArrayBuffer(blob).then(function (rawBuf) {
      return decodeAudioBuffer(ctx, rawBuf);
    }).then(function (decoded) {
      durationSec = Number(decoded && decoded.duration) || 0;
      return resampleDecodedBuffer(decoded, { skipHighPass: true });
    }).then(function (samples16k) {
      var tooShortRaw = !samples16k || samples16k.length < MIN_AUDIO_SAMPLES;
      if (tooShortRaw) {
        return {
          silent: true,
          samples: null,
          wavBlob: null,
          rms: 0,
          peak: 0,
          rawRms: 0,
          rawPeak: 0,
          trimmedRatio: 0,
          durationSec: durationSec,
          sampleRate: TARGET_SAMPLE_RATE,
          reason: 'too_short',
          acoustic: computeJsAcousticFallback(samples16k, null, null, TARGET_SAMPLE_RATE)
        };
      }

      return analyzeAudioPcm16k(samples16k, o).then(function (prep) {
        if (!prep || prep.silent || !prep.samples || prep.samples.length < MIN_AUDIO_SAMPLES) {
          return {
            silent: true,
            samples: null,
            wavBlob: null,
            rms: prep ? prep.rms : 0,
            peak: prep ? prep.peak : 0,
            rawRms: prep ? prep.rawRms : 0,
            rawPeak: prep ? prep.rawPeak : 0,
            trimmedRatio: prep ? prep.trimmedRatio : 0,
            durationSec: durationSec,
            sampleRate: TARGET_SAMPLE_RATE,
            reason: (prep && prep.reason) || 'silent_audio',
            acoustic: (prep && prep.acoustic) || computeJsAcousticFallback(samples16k, null, null, TARGET_SAMPLE_RATE)
          };
        }

        var wavBlob = o.skipWavEncode ? null : encodeWav16kMono(prep.samples);
        return {
          silent: false,
          samples: prep.samples,
          wavBlob: wavBlob,
          rms: prep.rms,
          peak: prep.peak,
          rawRms: prep.rawRms,
          rawPeak: prep.rawPeak,
          trimmedRatio: prep.trimmedRatio,
          durationSec: durationSec,
          sampleRate: TARGET_SAMPLE_RATE,
          acoustic: prep.acoustic || null
        };
      });
    });
  }

  function cleanCloudTranscript(rawText) {
    var s = String(rawText || '');
    s = s.replace(/\[(blank_audio|music|applause|laughter|silence|noise|inaudible|crosstalk|cough|sighs?)[^\]]*\]/gi, ' ');
    s = s.replace(/\((music|applause|laughter|silence|noise|inaudible|crosstalk|cough|sighs?)[^)]*\)/gi, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    return s;
  }

  function validateTranscriptResult(result) {
    if (!result || !result.ok || !result.transcript) return result;
    var words = String(result.transcript).toLowerCase().match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || [];
    // Require a long run that dominates the whole transcript to preserve natural repetition.
    var repeatLimit = Math.max(5, Math.ceil(words.length * 0.8));
    var run = 1;
    for (var i = 1; i < words.length; i++) {
      run = words[i] === words[i - 1] ? run + 1 : 1;
      if (run >= repeatLimit) {
        return Object.assign({}, result, { ok: false, transcript: '', reason: 'repetitive_transcript' });
      }
    }
    return result;
  }

  function transcribeWithCloudApi(wavBlob, opts) {
    var o = opts || {};
    if (!wavBlob || !wavBlob.size || typeof global.fetch !== 'function' || typeof global.FormData !== 'function') {
      return Promise.resolve({ ok: false, transcript: '', reason: 'cloud_unsupported' });
    }
    var cfg = resolveTransientCloudConfig(o);
    if (cfg.isOpenRouter) {
      return Promise.resolve({ ok: false, transcript: '', reason: 'openrouter_no_stt' });
    }
    if (!cfg.apiKey || !cfg.baseUrl) {
      return Promise.resolve({ ok: false, transcript: '', reason: 'no_cloud_config' });
    }

    var model = o.sttModel || cfg.sttModel || 'whisper-1';
    var endpoint = cfg.baseUrl + '/audio/transcriptions';
    var fd = new global.FormData();
    fd.append('model', model);
    if (model !== 'cx/transcribe') {
      fd.append('language', o.lang || 'en');
    }
    fd.append('file', wavBlob, 'speech.wav');

    var rawTimeout = Number(o.cloudTimeoutMs || o.timeoutMs);
    var timeoutMs = rawTimeout > 0 ? rawTimeout : CLOUD_TIMEOUT_MS;
    var ctrl = typeof global.AbortController === 'function' ? new global.AbortController() : null;
    var timedOut = false;
    var timerId = setTimeout(function () {
      timedOut = true;
      if (ctrl) {
        try { ctrl.abort('cloud_stt_timeout'); } catch (e) { ctrl.abort(); }
      }
    }, timeoutMs);

    return global.fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + cfg.apiKey },
      body: fd,
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (resp) {
      if (!resp.ok) {
        var httpErr = new Error('HTTP ' + resp.status);
        httpErr.isHttpError = true;
        httpErr.status = resp.status;
        throw httpErr;
      }
      return resp.json().catch(function (parseErr) {
        var err = parseErr || new Error('Invalid JSON response');
        err.isParseError = true;
        throw err;
      });
    }).then(function (data) {
      var tx = cleanCloudTranscript(data && (data.text || data.transcript || ''));
      if (tx) {
        return validateTranscriptResult({ ok: true, transcript: tx, source: 'cloud_stt', engine: model });
      }
      return { ok: false, transcript: '', reason: 'cloud_empty' };
    }).catch(function (err) {
      var isTimeout = timedOut || (err && err.name === 'AbortError');
      var isHttp = Boolean(err && err.isHttpError);
      var isParse = Boolean(err && err.isParseError);
      var reason = isTimeout ? 'cloud_timeout' : (isHttp ? 'cloud_error' : (isParse ? 'cloud_parse_error' : 'cors_or_network'));
      return {
        ok: false,
        transcript: '',
        reason: reason,
        status: (err && err.status) ? err.status : 0,
        error: (err && err.message) ? err.message : String(err || 'Cloud STT failed')
      };
    }).finally(function () {
      clearTimeout(timerId);
    });
  }

  function resetWorker(errMsg) {
    if (workerInstance) {
      try { workerInstance.terminate(); } catch (e) {}
      workerInstance = null;
    }
    modelReady = false;
    pendingReqs.forEach(function (entry) {
      if (entry.timerId) clearTimeout(entry.timerId);
      entry.resolve({ ok: false, transcript: '', reason: 'worker_error', error: errMsg || 'Worker terminated' });
    });
    pendingReqs.clear();
  }

  function handleWorkerMessage(ev) {
    var msg = ev && ev.data;
    if (!msg || typeof msg !== 'object') return;

    if (msg.type === 'progress') {
      if (msg.status === 'ready') modelReady = true;
      activeProgressListeners.forEach(function (fn) {
        try { fn(msg); } catch (e) {}
      });
      pendingReqs.forEach(function (entry) {
        if (entry.onProgress) {
          try { entry.onProgress(msg); } catch (e) {}
        }
        if (entry.armTimer && !entry.fixedTimeout) {
          entry.armTimer();
        }
      });
      return;
    }

    var reqId = msg.reqId;
    var entry = pendingReqs.get(reqId);
    if (!entry) return;
    pendingReqs.delete(reqId);
    if (entry.timerId) clearTimeout(entry.timerId);

    if (msg.type === 'ready') {
      if (msg.ok) modelReady = true;
      entry.resolve({
        ok: Boolean(msg.ok),
        error: msg.error || ''
      });
      return;
    }

    if (msg.type === 'result') {
      var tx = String(msg.transcript || '').trim();
      if (msg.ok) modelReady = true;
      entry.resolve(validateTranscriptResult({
        ok: Boolean(msg.ok && tx),
        transcript: tx,
        source: tx ? 'whisper_local' : (msg.cancelled ? 'cancelled' : 'empty_audio'),
        error: msg.error || '',
        cancelled: Boolean(msg.cancelled),
        reason: msg.cancelled ? 'cancelled' : (msg.ok ? (tx ? '' : 'empty_audio') : 'worker_transcribe_error')
      }));
    }
  }

  function ensureWorker() {
    if (typeof global.Worker !== 'function') {
      throw new Error('Web Worker not supported');
    }
    if (workerInstance) return workerInstance;
    workerInstance = new global.Worker(workerUrl);
    workerInstance.addEventListener('message', handleWorkerMessage);
    workerInstance.addEventListener('error', function (err) {
      resetWorker((err && err.message) ? err.message : 'Whisper worker crashed');
    });
    return workerInstance;
  }

  function resetAudioWorker(errMsg) {
    if (audioWorkerInstance) {
      try { audioWorkerInstance.terminate(); } catch (e) {}
      audioWorkerInstance = null;
    }
    audioDspReady = false;
    audioPendingReqs.forEach(function (entry) {
      if (entry.timerId) clearTimeout(entry.timerId);
      entry.reject(new Error(errMsg || 'Audio DSP worker terminated'));
    });
    audioPendingReqs.clear();
  }

  function handleAudioWorkerMessage(ev) {
    var msg = ev && ev.data;
    if (!msg || typeof msg !== 'object') return;
    var reqId = msg.reqId;
    var entry = audioPendingReqs.get(reqId);
    if (!entry) return;
    audioPendingReqs.delete(reqId);
    if (entry.timerId) clearTimeout(entry.timerId);

    if (msg.type === 'init') {
      if (msg.ok && msg.engine === 'wasm') audioDspReady = true;
      entry.resolve(msg);
      return;
    }

    if (msg.type === 'result') {
      if (msg.acoustic && msg.acoustic.engine === 'wasm') audioDspReady = true;
      if (msg.ok === false) {
        entry.reject(new Error(msg.error || 'Audio DSP worker failed'));
      } else {
        entry.resolve(msg);
      }
    }
  }

  function ensureAudioWorker() {
    if (typeof global.Worker !== 'function') {
      throw new Error('Web Worker not supported');
    }
    if (audioWorkerInstance) return audioWorkerInstance;
    audioWorkerInstance = new global.Worker(audioWorkerUrl);
    audioWorkerInstance.addEventListener('message', handleAudioWorkerMessage);
    audioWorkerInstance.addEventListener('error', function (err) {
      resetAudioWorker((err && err.message) ? err.message : 'Audio DSP worker crashed');
    });
    return audioWorkerInstance;
  }

  function analyzeAudioPcm16k(rawSamples, opts) {
    var o = opts || {};
    if (!rawSamples || !rawSamples.length) {
      return Promise.resolve({
        ok: true,
        silent: true,
        reason: 'empty_audio',
        samples: null,
        rawRms: 0,
        rawPeak: 0,
        rms: 0,
        peak: 0,
        trimmedRatio: 0,
        acoustic: computeJsAcousticFallback(null, null, null, TARGET_SAMPLE_RATE)
      });
    }

    var srcArr = (rawSamples instanceof Float32Array) ? rawSamples : new Float32Array(rawSamples);
    var runSyncFallback = function () {
      var prep = preprocessPcm16k(srcArr);
      return {
        ok: true,
        silent: !prep.samples || prep.samples.length < MIN_AUDIO_SAMPLES,
        reason: (!prep.samples || prep.samples.length < MIN_AUDIO_SAMPLES) ? 'silent_audio' : '',
        samples: prep.samples,
        rawRms: prep.rawRms,
        rawPeak: prep.rawPeak,
        rms: prep.rms,
        peak: prep.peak,
        trimmedRatio: prep.trimmedRatio,
        acoustic: prep.acoustic
      };
    };

    if (o.forceSyncFallback || typeof global.Worker !== 'function') {
      return Promise.resolve(runSyncFallback());
    }

    return new Promise(function (resolve) {
      var reqId = 0;
      var entry = null;
      try {
        var w = ensureAudioWorker();
        reqId = audioNextReqId++;
        var timeoutMs = Number(o.audioTimeoutMs) > 0 ? Number(o.audioTimeoutMs) : AUDIO_WORKER_TIMEOUT_MS;
        entry = {
          resolve: resolve,
          reject: function () {
            resolve(runSyncFallback());
          },
          timerId: setTimeout(function () {
            if (!audioPendingReqs.has(reqId)) return;
            audioPendingReqs.delete(reqId);
            resolve(runSyncFallback());
          }, timeoutMs)
        };
        audioPendingReqs.set(reqId, entry);
        var pcmCopy = new Float32Array(srcArr);
        w.postMessage({
          type: 'analyze_pcm',
          reqId: reqId,
          audio: pcmCopy,
          sampleRate: Number(o.sampleRate) > 0 ? Number(o.sampleRate) : TARGET_SAMPLE_RATE,
          maxContourPoints: Number(o.maxContourPoints) > 0 ? Number(o.maxContourPoints) : 96,
          targetTone: Number(o.targetTone) || 0,
          wasmUrl: o.wasmUrl || coreWasmUrl
        }, [pcmCopy.buffer]);
      } catch (err) {
        if (entry && entry.timerId) clearTimeout(entry.timerId);
        if (reqId) audioPendingReqs.delete(reqId);
        resolve(runSyncFallback());
      }
    });
  }

  function analyzeBlobAcoustics(blob, opts) {
    var o = Object.assign({}, opts || {}, { skipWavEncode: true });
    if (!blob || !(blob.size > 0)) {
      return Promise.resolve({
        ok: false,
        silent: true,
        reason: 'empty_blob',
        durationSec: 0,
        rms: 0,
        peak: 0,
        rawRms: 0,
        rawPeak: 0,
        trimmedRatio: 0,
        acoustic: computeJsAcousticFallback(null, null, null, TARGET_SAMPLE_RATE)
      });
    }
    if (!isSupported()) {
      return Promise.resolve({
        ok: false,
        silent: true,
        reason: 'unsupported',
        durationSec: 0,
        rms: 0,
        peak: 0,
        rawRms: 0,
        rawPeak: 0,
        trimmedRatio: 0,
        acoustic: computeJsAcousticFallback(null, null, null, TARGET_SAMPLE_RATE)
      });
    }
    return decodeBlobTo16kMono(blob, o).then(function (decoded) {
      return {
        ok: true,
        silent: Boolean(decoded && decoded.silent),
        reason: (decoded && decoded.reason) || '',
        durationSec: (decoded && decoded.durationSec) || 0,
        rms: (decoded && decoded.rms) || 0,
        peak: (decoded && decoded.peak) || 0,
        rawRms: (decoded && decoded.rawRms) || 0,
        rawPeak: (decoded && decoded.rawPeak) || 0,
        trimmedRatio: (decoded && decoded.trimmedRatio) || 0,
        acoustic: (decoded && decoded.acoustic) || null
      };
    }).catch(function (err) {
      return {
        ok: false,
        silent: true,
        reason: 'decode_error',
        error: (err && err.message) ? err.message : String(err),
        durationSec: 0,
        rms: 0,
        peak: 0,
        rawRms: 0,
        rawPeak: 0,
        trimmedRatio: 0,
        acoustic: null
      };
    });
  }

  function preload(onProgress) {
    if (typeof global.Worker !== 'function') {
      return Promise.resolve({ ok: false, error: 'Web Worker not supported' });
    }
    var cb = typeof onProgress === 'function' ? onProgress : null;
    if (cb) activeProgressListeners.add(cb);

    return new Promise(function (resolve) {
      var reqId = 0;
      var entry = null;
      try {
        var w = ensureWorker();
        reqId = nextReqId++;
        var timeoutMs = 120000;
        entry = {
          onProgress: cb,
          fixedTimeout: false,
          resolve: function (res) {
            if (cb) activeProgressListeners.delete(cb);
            resolve(res);
          },
          armTimer: function () {
            if (entry.timerId) clearTimeout(entry.timerId);
            entry.timerId = setTimeout(function () {
              if (!pendingReqs.has(reqId)) return;
              pendingReqs.delete(reqId);
              entry.resolve({ ok: false, error: 'Whisper preload timeout' });
            }, timeoutMs);
          }
        };
        pendingReqs.set(reqId, entry);
        entry.armTimer();
        w.postMessage({ type: 'preload', reqId: reqId });
      } catch (err) {
        if (entry && entry.timerId) clearTimeout(entry.timerId);
        if (reqId) pendingReqs.delete(reqId);
        if (cb) activeProgressListeners.delete(cb);
        resolve({ ok: false, error: (err && err.message) ? err.message : String(err) });
      }
    });
  }

  function runOverride(blob, opts, decoded) {
    try {
      return Promise.resolve(global.__LP_WHISPER_TRANSCRIBE_OVERRIDE(blob, opts, decoded)).then(function (res) {
        if (typeof res === 'string') {
          var tx = res.trim();
          return validateTranscriptResult({ ok: Boolean(tx), transcript: tx, source: tx ? 'whisper_local' : 'empty_audio' });
        }
        return validateTranscriptResult(res) || { ok: false, transcript: '', reason: 'empty_override' };
      }).catch(function (err) {
        return { ok: false, transcript: '', reason: 'override_error', error: (err && err.message) ? err.message : String(err) };
      });
    } catch (err) {
      return Promise.resolve({ ok: false, transcript: '', reason: 'override_error', error: (err && err.message) ? err.message : String(err) });
    }
  }

  function runLocalWorkerTranscribe(samples, opts) {
    var o = opts || {};
    if (typeof global.Worker !== 'function') {
      return Promise.resolve({ ok: false, transcript: '', reason: 'worker_unsupported' });
    }
    return new Promise(function (resolve) {
      var reqId = 0;
      var entry = null;
      try {
        var w = ensureWorker();
        reqId = nextReqId++;
        var timeoutMs = Number(o.timeoutMs) > 0 ? Number(o.timeoutMs) : DEFAULT_TIMEOUT_MS;
        entry = {
          onProgress: typeof o.onProgress === 'function' ? o.onProgress : null,
          fixedTimeout: Boolean(Number(o.timeoutMs) > 0),
          resolve: resolve,
          armTimer: function () {
            if (entry.timerId) clearTimeout(entry.timerId);
            entry.timerId = setTimeout(function () {
              if (!pendingReqs.has(reqId)) return;
              pendingReqs.delete(reqId);
              resolve({ ok: false, transcript: '', reason: 'timeout', error: 'Whisper transcription timed out' });
            }, timeoutMs);
          }
        };
        pendingReqs.set(reqId, entry);
        entry.armTimer();
        var pcm = new Float32Array(samples);
        w.postMessage({
          type: 'transcribe',
          reqId: reqId,
          audio: pcm,
          lang: o.lang || 'en'
        }, [pcm.buffer]);
      } catch (err) {
        if (entry && entry.timerId) clearTimeout(entry.timerId);
        if (reqId) pendingReqs.delete(reqId);
        resolve({
          ok: false,
          transcript: '',
          reason: 'worker_post_error',
          error: (err && err.message) ? err.message : String(err)
        });
      }
    });
  }

  function countSttWords(text) {
    var clean = String(text || '').toLowerCase().replace(/[^a-z0-9'\s-]/g, ' ').trim();
    if (!clean) return 0;
    return clean.split(/\s+/).filter(Boolean).length;
  }

  function isTranscriptIncomplete(spokenText, opts) {
    var o = opts || {};
    var spokenWords = countSttWords(spokenText);
    if (spokenWords === 0) return true;
    if (o.sttErrored) return true;
    var targetWords = o.targetText ? countSttWords(o.targetText) : Number(o.targetWordCount || 0);
    if (targetWords >= 4 && (spokenWords / targetWords) < 0.6) {
      return true;
    }
    var dur = Number(o.durationSec) || 0;
    if (dur >= 3.5 && spokenWords < 3) {
      return true;
    }
    return false;
  }

  function transcribeBlob(blob, opts) {
    var o = opts || {};
    if (!blob || !(blob.size > 0)) {
      return Promise.resolve({ ok: false, transcript: '', reason: 'empty_blob' });
    }

    var blobGen = o.allowConcurrent ? 0 : ++latestBlobTranscribeGen;
    var cancelledResult = function () {
      return { ok: false, transcript: '', cancelled: true, reason: 'cancelled' };
    };
    var wrapCancel = function (res) {
      if (blobGen && blobGen !== latestBlobTranscribeGen) {
        return cancelledResult();
      }
      return res;
    };

    var isLocalHost = Boolean(
      typeof location !== 'undefined' &&
      (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    );
    var hasOverride = isLocalHost && typeof global.__LP_WHISPER_TRANSCRIBE_OVERRIDE === 'function';
    if (hasOverride && o.skipDecode) {
      return Promise.resolve(runOverride(blob, o, null)).then(wrapCancel);
    }

    if (!isSupported()) {
      return hasOverride
        ? Promise.resolve(runOverride(blob, o, null)).then(wrapCancel)
        : Promise.resolve({ ok: false, transcript: '', reason: 'unsupported' });
    }

    if (typeof o.onStatus === 'function') {
      try {
        o.onStatus('⏳ Đang chuẩn hóa & phân tích giọng nói...');
      } catch (e) {}
    }

    var attachAudioTelemetry = function (res, decoded) {
      if (!res || typeof res !== 'object' || res.cancelled || !decoded) return res;
      if (decoded.acoustic && !res.acoustic) res.acoustic = decoded.acoustic;
      if (typeof res.rms !== 'number') res.rms = decoded.rms || 0;
      if (typeof res.peak !== 'number') res.peak = decoded.peak || 0;
      if (typeof res.durationSec !== 'number') res.durationSec = decoded.durationSec || 0;
      return res;
    };

    return decodeBlobTo16kMono(blob, o).then(function (decoded) {
      if (blobGen && blobGen !== latestBlobTranscribeGen) {
        return cancelledResult();
      }
      if (!decoded || decoded.silent || !decoded.samples) {
        return {
          ok: false,
          transcript: '',
          reason: (decoded && decoded.reason) || 'silent_audio',
          rms: decoded ? decoded.rms : 0,
          peak: decoded ? decoded.peak : 0,
          durationSec: decoded ? decoded.durationSec : 0,
          acoustic: decoded ? (decoded.acoustic || null) : null
        };
      }

      if (hasOverride) {
        return Promise.resolve(runOverride(blob, o, decoded)).then(function (r) {
          return wrapCancel(attachAudioTelemetry(r, decoded));
        });
      }

      var isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
      var cfg = resolveTransientCloudConfig(o);
      var hasCloudCreds = Boolean(cfg.apiKey && cfg.baseUrl && !cfg.isOpenRouter);
      var shouldTryCloud = !o.forceLocal && !cfg.isOpenRouter && !isOffline && (o.useCloudStt === true || hasCloudCreds || o.cloudOnly === true);
      if (shouldTryCloud) {
        return transcribeWithCloudApi(decoded.wavBlob, o).then(function (cloudRes) {
          if (blobGen && blobGen !== latestBlobTranscribeGen) {
            return cancelledResult();
          }
          if (cloudRes && cloudRes.ok && cloudRes.transcript) {
            return attachAudioTelemetry(cloudRes, decoded);
          }
          if (o.cloudOnly === true) {
            return attachAudioTelemetry(cloudRes || { ok: false, transcript: '', reason: 'cloud_error' }, decoded);
          }
          return runLocalWorkerTranscribe(decoded.samples, o).then(function (r) {
            if (cloudRes && cloudRes.reason === 'repetitive_transcript' && !r.ok && !r.cancelled) {
              return wrapCancel(attachAudioTelemetry(cloudRes, decoded));
            }
            return wrapCancel(attachAudioTelemetry(r, decoded));
          });
        });
      }
      if (o.cloudOnly === true) {
        return attachAudioTelemetry({
          ok: false,
          transcript: '',
          reason: cfg.isOpenRouter ? 'openrouter_no_stt' : (isOffline ? 'offline' : 'no_cloud_config')
        }, decoded);
      }

      return runLocalWorkerTranscribe(decoded.samples, o).then(function (r) {
        return wrapCancel(attachAudioTelemetry(r, decoded));
      });
    }).catch(function (err) {
      if (blobGen && blobGen !== latestBlobTranscribeGen) {
        return cancelledResult();
      }
      return {
        ok: false,
        transcript: '',
        reason: 'decode_error',
        error: (err && err.message) ? err.message : String(err)
      };
    });
  }

  global.S4Whisper = {
    isSupported: isSupported,
    isReady: function () { return modelReady; },
    isAudioDspReady: function () { return audioDspReady; },
    getSharedAudioContext: getSharedAudioContext,
    getVoiceAudioConstraints: getVoiceAudioConstraints,
    acquireVoiceStream: acquireVoiceStream,
    pickSupportedAudioMime: pickSupportedAudioMime,
    createVoiceRecorder: createVoiceRecorder,
    applyHighPass80Hz: applyHighPass80Hz,
    preprocessPcm16k: preprocessPcm16k,
    analyzeAudioPcm16k: analyzeAudioPcm16k,
    analyzeBlobAcoustics: analyzeBlobAcoustics,
    preload: preload,
    decodeBlobTo16kMono: decodeBlobTo16kMono,
    encodeWav16kMono: encodeWav16kMono,
    isTranscriptIncomplete: isTranscriptIncomplete,
    getCloudConfig: getCloudConfig,
    setCloudConfig: setCloudConfig,
    transcribeBlob: transcribeBlob,
    _getPendingCount: function () { return pendingReqs.size; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
