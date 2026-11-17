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

  var STORAGE_AI_KEY = 'lp_ai_api_key_v1';
  var STORAGE_AI_BASE = 'lp_ai_base_url_v1';
  var DEFAULT_CLOUD_CONFIG = {
    baseUrl: '',
    apiKey: '',
    sttModel: 'whisper-1'
  };

  var scriptSrc = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src)
    ? document.currentScript.src
    : '';
  var workerUrl = scriptSrc
    ? new URL('s4-whisper-worker.js?v=3', scriptSrc).href
    : '../assets/s4-whisper-worker.js?v=3';

  var sharedAudioCtx = null;
  var workerInstance = null;
  var modelReady = false;
  var nextReqId = 1;
  var latestBlobTranscribeGen = 0;
  var pendingReqs = new Map();
  var activeProgressListeners = new Set();

  function isSupported() {
    var hasAc = Boolean(typeof global.AudioContext === 'function' || typeof global.webkitAudioContext === 'function');
    var hasWorkerOrFetch = Boolean(typeof global.Worker === 'function' || typeof global.fetch === 'function');
    return Boolean(hasAc && hasWorkerOrFetch);
  }

  function normalizeBaseUrl(raw) {
    return String(raw || '')
      .trim()
      .replace(/\/+$/, '')
      .replace(/\/(?:chat\/completions|audio\/transcriptions)$/i, '');
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

  function getCloudConfig() {
    var key = '';
    var base = '';
    try {
      if (global.localStorage) {
        key = String(global.localStorage.getItem(STORAGE_AI_KEY) || '').trim();
        base = String(global.localStorage.getItem(STORAGE_AI_BASE) || '').trim();
      }
    } catch (e) {}
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
    try {
      if (!global.localStorage) return getCloudConfig();
      if (Object.prototype.hasOwnProperty.call(o, 'apiKey')) {
        var nextKey = String(o.apiKey || '').trim();
        if (nextKey) global.localStorage.setItem(STORAGE_AI_KEY, nextKey);
        else global.localStorage.removeItem(STORAGE_AI_KEY);
      }
      if (Object.prototype.hasOwnProperty.call(o, 'baseUrl')) {
        var nextBase = String(o.baseUrl || '').trim().replace(/\/+$/, '');
        if (nextBase) global.localStorage.setItem(STORAGE_AI_BASE, nextBase);
        else global.localStorage.removeItem(STORAGE_AI_BASE);
      }
    } catch (e) {}
    return getCloudConfig();
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

  function resampleDecodedBuffer(audioBuffer) {
    var durationSec = Number(audioBuffer && audioBuffer.duration) || 0;
    var targetLen = Math.max(1, Math.ceil(durationSec * TARGET_SAMPLE_RATE));
    var OfflineAC = global.OfflineAudioContext || global.webkitOfflineAudioContext;

    if (typeof OfflineAC === 'function' && audioBuffer.sampleRate !== TARGET_SAMPLE_RATE) {
      try {
        var offline = new OfflineAC(1, targetLen, TARGET_SAMPLE_RATE);
        var src = offline.createBufferSource();
        src.buffer = audioBuffer;
        src.connect(offline.destination);
        src.start(0);
        return offline.startRendering().then(function (rendered) {
          return rendered.getChannelData(0).slice();
        }).catch(function () {
          return resampleLinear16k(mixToMonoBuffer(audioBuffer), audioBuffer.sampleRate);
        });
      } catch (e) {}
    }

    var mono = mixToMonoBuffer(audioBuffer);
    return Promise.resolve(
      audioBuffer.sampleRate === TARGET_SAMPLE_RATE
        ? mono
        : resampleLinear16k(mono, audioBuffer.sampleRate)
    );
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
      return { samples: centered, trimmedRatio: 0 };
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
    for (var i = 0; i < numFrames; i++) {
      if (frameRms[i] >= vadThresh) {
        if (firstActive === -1) firstActive = i;
        lastActive = i;
      }
    }

    // If low-amplitude speech stays uniform below threshold, avoid dropping the whole clip
    if (firstActive === -1) {
      return { samples: centered, trimmedRatio: 0 };
    }

    var startFrame = Math.max(0, firstActive - VAD_PAD_FRAMES);
    var endFrame = Math.min(numFrames, lastActive + 1 + VAD_PAD_FRAMES);
    var startSample = startFrame * VAD_FRAME_SAMPLES;
    var endSample = (endFrame >= numFrames) ? n : (endFrame * VAD_FRAME_SAMPLES);

    if (endSample - startSample < MIN_AUDIO_SAMPLES) {
      return { samples: centered, trimmedRatio: 0 };
    }

    var sliced = centered.slice(startSample, endSample);
    return {
      samples: sliced,
      trimmedRatio: Math.max(0, 1 - (sliced.length / n))
    };
  }

  function preprocessPcm16k(rawSamples) {
    if (!rawSamples || !rawSamples.length) {
      return { samples: null, rawRms: 0, rawPeak: 0, rms: 0, peak: 0, trimmedRatio: 0 };
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
        trimmedRatio: 0
      };
    }

    var vad = trimSilenceVad(centered);
    var trimmed = vad.samples;
    var trimmedEnergy = analyzeAudioEnergy(trimmed);

    var gain = 1;
    if (rawEnergy.peak >= SILENCE_PEAK_THRESHOLD && trimmedEnergy.peak > 0 && trimmedEnergy.peak < NORMALIZE_TARGET_PEAK) {
      gain = Math.min(MAX_NORMALIZE_GAIN, NORMALIZE_TARGET_PEAK / trimmedEnergy.peak);
    }

    var normalized = new Float32Array(trimmed.length);
    for (var idx = 0; idx < trimmed.length; idx++) {
      var val = trimmed[idx] * gain;
      if (val > 1) val = 1;
      else if (val < -1) val = -1;
      normalized[idx] = val;
    }

    var finalEnergy = analyzeAudioEnergy(normalized);
    return {
      samples: normalized,
      rawRms: rawEnergy.rms,
      rawPeak: rawEnergy.peak,
      rms: finalEnergy.rms,
      peak: finalEnergy.peak,
      trimmedRatio: vad.trimmedRatio
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

  function decodeBlobTo16kMono(blob) {
    if (!blob || !(blob.size > 0)) {
      return Promise.resolve({ silent: true, samples: null, wavBlob: null, rms: 0, peak: 0, rawRms: 0, rawPeak: 0, trimmedRatio: 0, durationSec: 0, sampleRate: TARGET_SAMPLE_RATE, reason: 'empty_blob' });
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
      return resampleDecodedBuffer(decoded);
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
          reason: 'too_short'
        };
      }

      var prep = preprocessPcm16k(samples16k);
      if (!prep.samples || prep.samples.length < MIN_AUDIO_SAMPLES) {
        return {
          silent: true,
          samples: null,
          wavBlob: null,
          rms: prep.rms,
          peak: prep.peak,
          rawRms: prep.rawRms,
          rawPeak: prep.rawPeak,
          trimmedRatio: prep.trimmedRatio,
          durationSec: durationSec,
          sampleRate: TARGET_SAMPLE_RATE,
          reason: 'silent_audio'
        };
      }

      var wavBlob = encodeWav16kMono(prep.samples);
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
        sampleRate: TARGET_SAMPLE_RATE
      };
    });
  }

  function cleanCloudTranscript(rawText) {
    var s = String(rawText || '');
    s = s.replace(/\[(blank_audio|music|applause|laughter|silence|noise|inaudible|crosstalk|cough|sighs?)[^\]]*\]/gi, ' ');
    s = s.replace(/\((music|applause|laughter|silence|noise|inaudible|crosstalk|cough|sighs?)[^)]*\)/gi, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    return s;
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
        return { ok: true, transcript: tx, source: 'cloud_stt', engine: model };
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
      entry.resolve({
        ok: Boolean(msg.ok && tx),
        transcript: tx,
        source: tx ? 'whisper_local' : (msg.cancelled ? 'cancelled' : 'empty_audio'),
        error: msg.error || '',
        cancelled: Boolean(msg.cancelled),
        reason: msg.cancelled ? 'cancelled' : (msg.ok ? (tx ? '' : 'empty_audio') : 'worker_transcribe_error')
      });
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
          return { ok: Boolean(tx), transcript: tx, source: tx ? 'whisper_local' : 'empty_audio' };
        }
        return res || { ok: false, transcript: '', reason: 'empty_override' };
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

    var hasOverride = typeof global.__LP_WHISPER_TRANSCRIBE_OVERRIDE === 'function';
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

    return decodeBlobTo16kMono(blob).then(function (decoded) {
      if (blobGen && blobGen !== latestBlobTranscribeGen) {
        return cancelledResult();
      }
      if (!decoded || decoded.silent || !decoded.samples) {
        return {
          ok: false,
          transcript: '',
          reason: (decoded && decoded.reason) || 'silent_audio',
          rms: decoded ? decoded.rms : 0,
          peak: decoded ? decoded.peak : 0
        };
      }

      if (hasOverride) {
        return Promise.resolve(runOverride(blob, o, decoded)).then(wrapCancel);
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
            return cloudRes;
          }
          if (o.cloudOnly === true) {
            return cloudRes || { ok: false, transcript: '', reason: 'cloud_error' };
          }
          return runLocalWorkerTranscribe(decoded.samples, o).then(wrapCancel);
        });
      }
      if (o.cloudOnly === true) {
        return {
          ok: false,
          transcript: '',
          reason: cfg.isOpenRouter ? 'openrouter_no_stt' : (isOffline ? 'offline' : 'no_cloud_config')
        };
      }

      return runLocalWorkerTranscribe(decoded.samples, o).then(wrapCancel);
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
    getSharedAudioContext: getSharedAudioContext,
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
