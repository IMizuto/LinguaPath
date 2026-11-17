/* LinguaPath S4Whisper — On-Device Speech-to-Text Fallback via Web Worker */
(function (global) {
  'use strict';

  var TARGET_SAMPLE_RATE = 16000;
  var SILENCE_RMS_THRESHOLD = 0.0025;
  var SILENCE_PEAK_THRESHOLD = 0.015;
  var MIN_AUDIO_SAMPLES = 1600; // 0.1s @ 16kHz
  var DEFAULT_TIMEOUT_MS = 60000;

  var scriptSrc = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src)
    ? document.currentScript.src
    : '';
  var workerUrl = scriptSrc
    ? new URL('s4-whisper-worker.js', scriptSrc).href
    : '../assets/s4-whisper-worker.js';

  var workerInstance = null;
  var modelReady = false;
  var nextReqId = 1;
  var pendingReqs = new Map();
  var activeProgressListeners = new Set();

  function isSupported() {
    return Boolean(
      typeof global.Worker === 'function'
      && (typeof global.AudioContext === 'function' || typeof global.webkitAudioContext === 'function')
    );
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

  function decodeBlobTo16kMono(blob) {
    if (!blob || !(blob.size > 0)) {
      return Promise.resolve({ silent: true, samples: null, rms: 0, peak: 0, durationSec: 0, reason: 'empty_blob' });
    }
    var AC = global.AudioContext || global.webkitAudioContext;
    if (typeof AC !== 'function') {
      return Promise.reject(new Error('AudioContext not supported'));
    }

    var ctx = null;
    var durationSec = 0;
    return readBlobAsArrayBuffer(blob).then(function (rawBuf) {
      ctx = new AC();
      return ctx.decodeAudioData(rawBuf);
    }).then(function (decoded) {
      durationSec = Number(decoded && decoded.duration) || 0;
      return resampleDecodedBuffer(decoded);
    }).then(function (samples16k) {
      var energy = analyzeAudioEnergy(samples16k);
      var isTooShort = !samples16k || samples16k.length < MIN_AUDIO_SAMPLES;
      var isSilent = isTooShort || energy.rms < SILENCE_RMS_THRESHOLD || energy.peak < SILENCE_PEAK_THRESHOLD;
      if (isSilent) {
        return {
          silent: true,
          samples: null,
          rms: energy.rms,
          peak: energy.peak,
          durationSec: durationSec,
          sampleRate: TARGET_SAMPLE_RATE,
          reason: isTooShort ? 'too_short' : 'silent_audio'
        };
      }
      return {
        silent: false,
        samples: samples16k,
        rms: energy.rms,
        peak: energy.peak,
        durationSec: durationSec,
        sampleRate: TARGET_SAMPLE_RATE
      };
    }).finally(function () {
      if (ctx && typeof ctx.close === 'function') {
        try { ctx.close().catch(function () {}); } catch (e) {}
      }
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
        source: tx ? 'whisper_local' : 'empty_audio',
        error: msg.error || '',
        reason: msg.ok ? (tx ? '' : 'empty_audio') : 'worker_transcribe_error'
      });
    }
  }

  function ensureWorker() {
    if (workerInstance) return workerInstance;
    workerInstance = new global.Worker(workerUrl);
    workerInstance.addEventListener('message', handleWorkerMessage);
    workerInstance.addEventListener('error', function (err) {
      resetWorker((err && err.message) ? err.message : 'Whisper worker crashed');
    });
    return workerInstance;
  }

  function preload(onProgress) {
    if (!isSupported()) {
      return Promise.resolve({ ok: false, error: 'Web Worker or AudioContext not supported' });
    }
    var cb = typeof onProgress === 'function' ? onProgress : null;
    if (cb) activeProgressListeners.add(cb);

    return new Promise(function (resolve) {
      try {
        var w = ensureWorker();
        var reqId = nextReqId++;
        var timeoutMs = 120000;
        var entry = {
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

  function transcribeBlob(blob, opts) {
    var o = opts || {};
    if (!blob || !(blob.size > 0)) {
      return Promise.resolve({ ok: false, transcript: '', reason: 'empty_blob' });
    }

    var hasOverride = typeof global.__LP_WHISPER_TRANSCRIBE_OVERRIDE === 'function';
    if (hasOverride && o.skipDecode) {
      return runOverride(blob, o, null);
    }

    if (!isSupported()) {
      return hasOverride
        ? runOverride(blob, o, null)
        : Promise.resolve({ ok: false, transcript: '', reason: 'unsupported' });
    }

    if (typeof o.onStatus === 'function') {
      try {
        o.onStatus(modelReady ? '⏳ Đang phân tích giọng nói Offline...' : '⏬ Đang chuẩn bị bộ nhận diện Whisper Offline...');
      } catch (e) {}
    }

    return decodeBlobTo16kMono(blob).then(function (decoded) {
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
        return runOverride(blob, o, decoded);
      }

      return new Promise(function (resolve) {
        try {
          var w = ensureWorker();
          var reqId = nextReqId++;
          var timeoutMs = Number(o.timeoutMs) > 0 ? Number(o.timeoutMs) : DEFAULT_TIMEOUT_MS;
          var entry = {
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
          var pcm = decoded.samples;
          w.postMessage({
            type: 'transcribe',
            reqId: reqId,
            audio: pcm,
            lang: o.lang || 'en'
          }, [pcm.buffer]);
        } catch (err) {
          resolve({
            ok: false,
            transcript: '',
            reason: 'worker_post_error',
            error: (err && err.message) ? err.message : String(err)
          });
        }
      });
    }).catch(function (err) {
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
    preload: preload,
    decodeBlobTo16kMono: decodeBlobTo16kMono,
    transcribeBlob: transcribeBlob
  };
})(typeof window !== 'undefined' ? window : globalThis);
