/* LinguaPath On-Device Whisper STT Worker (Transformers.js + Xenova/whisper-tiny.en) */
'use strict';

let pipelinePromise = null;
let taskQueue = Promise.resolve();

function cleanWhisperTranscript(rawText) {
  let s = String(rawText || '');
  // Loai bo cac the phi ngon ngu ma Whisper hay sinh ra khi gap nhac hoac khoang lang
  s = s.replace(/\[(blank_audio|music|applause|laughter|silence|noise|inaudible|crosstalk|cough|sighs?)[^\]]*\]/gi, ' ');
  s = s.replace(/\((music|applause|laughter|silence|noise|inaudible|crosstalk|cough|sighs?)[^)]*\)/gi, ' ');
  s = s.replace(/\*[^*]{1,30}\*/g, ' ');
  s = s.replace(/[♪♫]+/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  if (!s || /^[.,!?;:\-—'"()\[\]]+$/.test(s)) return '';
  return s;
}

function getTranscriber() {
  if (pipelinePromise) return pipelinePromise;
  pipelinePromise = (async () => {
    const mod = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js');
    const { pipeline, env } = mod;
    if (env) {
      env.allowLocalModels = false;
      env.useBrowserCache = true;
    }
    return await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
      quantized: true,
      progress_callback: (info) => {
        if (!info) return;
        self.postMessage({
          type: 'progress',
          status: String(info.status || ''),
          file: String(info.file || ''),
          name: String(info.name || ''),
          progress: typeof info.progress === 'number' ? info.progress : null,
          loaded: Number(info.loaded || 0),
          total: Number(info.total || 0)
        });
      }
    });
  })().catch((err) => {
    pipelinePromise = null;
    throw err;
  });
  return pipelinePromise;
}

function enqueueWork(fn) {
  const next = taskQueue.then(fn, fn);
  taskQueue = next.catch(() => {});
  return next;
}

self.addEventListener('message', (event) => {
  const msg = event && event.data;
  if (!msg || typeof msg !== 'object') return;
  const reqId = msg.reqId;

  if (msg.type === 'preload') {
    enqueueWork(async () => {
      try {
        await getTranscriber();
        self.postMessage({ type: 'ready', reqId, ok: true });
      } catch (err) {
        self.postMessage({
          type: 'ready',
          reqId,
          ok: false,
          error: (err && err.message) ? err.message : String(err || 'Whisper preload failed')
        });
      }
    });
    return;
  }

  if (msg.type === 'transcribe') {
    const audio = msg.audio;
    enqueueWork(async () => {
      try {
        if (!(audio instanceof Float32Array) || audio.length === 0) {
          self.postMessage({ type: 'result', reqId, ok: false, transcript: '', error: 'Invalid PCM audio buffer' });
          return;
        }
        const transcriber = await getTranscriber();
        const out = await transcriber(audio, {
          chunk_length_s: 30,
          stride_length_s: 5,
          return_timestamps: false
        });
        const rawText = (out && typeof out.text === 'string')
          ? out.text
          : (Array.isArray(out) && out[0] && out[0].text ? out[0].text : '');
        const transcript = cleanWhisperTranscript(rawText);
        self.postMessage({
          type: 'result',
          reqId,
          ok: Boolean(transcript),
          transcript: transcript
        });
      } catch (err) {
        self.postMessage({
          type: 'result',
          reqId,
          ok: false,
          transcript: '',
          error: (err && err.message) ? err.message : String(err || 'Whisper transcribe failed')
        });
      }
    });
  }
});
