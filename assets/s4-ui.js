/* LinguaPath Shared UI Controller (Toast, Modal Alerts/Confirms/Prompts, Search & Lobby Helpers)
 * Expose global window.S4UI cho tất cả các trang (Home, Vocab, Grammar, Reading, Listening, Writing, TED, Speaking).
 */
(function () {
  "use strict";

  const ICONS = {
    info: "ℹ️",
    success: "✅",
    warn: "⚠️",
    error: "❌",
    danger: "🗑️",
    prompt: "📝"
  };

  function getMountHost() {
    return document.fullscreenElement || document.body || document.documentElement;
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function normalizeSearch(str) {
    return String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’‘`]/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isCbtActive() {
    return !!(document.fullscreenElement || (document.body && (document.body.classList.contains("s4-cbt-mode") || document.body.classList.contains("in-cbt-mode"))));
  }

  /* ---------------- 1. UNIFIED TOAST ---------------- */
  let activeToastTimer = null;
  function toast(typeOrOpts, msg, extraOpts) {
    let cfg;
    if (typeOrOpts && typeof typeOrOpts === "object") {
      cfg = Object.assign({}, typeOrOpts);
    } else {
      let t = typeOrOpts;
      if (t === true) t = "success";
      else if (t === false) t = "error";
      cfg = Object.assign({ type: t || "info", message: msg }, extraOpts || {});
    }

    const type = cfg.type || "info";
    const position = cfg.position || "bottom";
    const duration = Number(cfg.duration) > 0 ? Number(cfg.duration) : (type === "error" || type === "warn" ? 2600 : 1900);
    const host = getMountHost();

    let stack = document.getElementById("s4UiToastStack");
    if (!stack) {
      stack = document.createElement("div");
      stack.id = "s4UiToastStack";
      stack.className = "s4-ui-toast-stack";
    }
    if (stack.parentElement !== host) {
      host.appendChild(stack);
    }
    stack.className = "s4-ui-toast-stack" + (position === "bottom" ? " s4-ui-toast-stack--bottom" : "");

    if (activeToastTimer) {
      clearTimeout(activeToastTimer);
      activeToastTimer = null;
    }
    stack.innerHTML = "";

    const el = document.createElement("div");
    el.className = "s4-ui-toast is-" + (type === "good" ? "success" : type);
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    if (cfg.html != null) {
      el.innerHTML = String(cfg.html);
    } else {
      el.textContent = String(cfg.message || "");
    }
    stack.appendChild(el);

    requestAnimationFrame(function () {
      el.classList.add("show");
    });

    activeToastTimer = setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 200);
    }, duration);
  }

  /* ---------------- 2. UNIFIED MODAL (ALERT / CONFIRM / PROMPT) ---------------- */
  function openModal(opts) {
    return new Promise(function (resolve) {
      const host = getMountHost();
      const prevOverflow = document.body ? document.body.style.overflow : "";
      const prevFocus = document.activeElement;
      let closed = false;

      const backdrop = document.createElement("div");
      backdrop.className = "s4-ui-backdrop";

      const tone = opts.tone || "primary";
      const iconText = opts.icon || ICONS[tone] || ICONS.info;
      const titleText = opts.title || (opts.mode === "confirm" ? "Xác nhận thao tác" : opts.mode === "prompt" ? "Nhập thông tin" : "Thông báo");
      const okLabel = opts.confirmText || (opts.mode === "confirm" ? "Xác nhận" : "Đóng");
      const cancelLabel = opts.cancelText || "Hủy";

      const inputId = "s4UiDialogInput_" + Date.now();
      let inputHtml = "";
      if (opts.mode === "prompt") {
        if (opts.multiline) {
          inputHtml = `<textarea id="${inputId}" class="s4-ui-dialog-input" rows="3" placeholder="${escapeHtml(opts.placeholder || "")}" ${opts.readOnly ? "readonly" : ""}>${escapeHtml(opts.defaultValue || "")}</textarea>`;
        } else {
          inputHtml = `<input id="${inputId}" type="${escapeHtml(opts.inputType || "text")}" class="s4-ui-dialog-input" value="${escapeHtml(opts.defaultValue || "")}" placeholder="${escapeHtml(opts.placeholder || "")}" ${opts.readOnly ? "readonly" : ""}>`;
        }
      }

      const showCancel = opts.mode === "confirm" || opts.mode === "prompt";
      const okBtnClass = tone === "danger" ? "is-danger" : (tone === "success" ? "is-success" : "is-primary");

      backdrop.innerHTML = `
        <div class="s4-ui-dialog" role="dialog" aria-modal="true">
          <div class="s4-ui-dialog-head">
            <span class="s4-ui-dialog-icon is-${escapeHtml(tone)}">${escapeHtml(iconText)}</span>
            <h3 class="s4-ui-dialog-title">${escapeHtml(titleText)}</h3>
          </div>
          <div class="s4-ui-dialog-body">${opts.html != null ? opts.html : escapeHtml(opts.message || "")}</div>
          ${inputHtml}
          <div class="s4-ui-dialog-actions">
            ${showCancel ? `<button type="button" class="s4-ui-btn" data-act="cancel">${escapeHtml(cancelLabel)}</button>` : ""}
            <button type="button" class="s4-ui-btn ${okBtnClass}" data-act="ok">${escapeHtml(okLabel)}</button>
          </div>
        </div>
      `;

      function cleanup(result) {
        if (closed) return;
        closed = true;
        document.removeEventListener("keydown", onKey, true);
        backdrop.classList.remove("open");
        if (document.body) document.body.style.overflow = prevOverflow;
        setTimeout(function () {
          if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
          try { if (prevFocus && typeof prevFocus.focus === "function") prevFocus.focus({ preventScroll: true }); } catch (e) {}
        }, 140);
        resolve(result);
      }

      const inputEl = backdrop.querySelector("#" + inputId);
      const okBtn = backdrop.querySelector('[data-act="ok"]');
      const cancelBtn = backdrop.querySelector('[data-act="cancel"]');

      function confirmValue() {
        if (opts.mode === "confirm") cleanup(true);
        else if (opts.mode === "prompt") cleanup(inputEl ? inputEl.value : "");
        else cleanup(undefined);
      }
      function cancelValue() {
        if (opts.mode === "confirm") cleanup(false);
        else if (opts.mode === "prompt") cleanup(null);
        else cleanup(undefined);
      }

      function onKey(e) {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          cancelValue();
        } else if (e.key === "Enter" && !(opts.multiline && document.activeElement === inputEl)) {
          if (opts.mode === "alert" || opts.mode === "prompt") {
            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            confirmValue();
          }
        }
      }

      if (okBtn) okBtn.addEventListener("click", confirmValue);
      if (cancelBtn) cancelBtn.addEventListener("click", cancelValue);
      backdrop.addEventListener("click", function (e) {
        if (e.target === backdrop) {
          if (opts.mode === "alert") cleanup(undefined);
          else cancelValue();
        }
      });

      document.addEventListener("keydown", onKey, true);
      host.appendChild(backdrop);
      requestAnimationFrame(function () {
        backdrop.classList.add("open");
        const preferCancel = opts.mode === "confirm" && (opts.tone === "danger" || opts.tone === "warn") && cancelBtn;
        if (inputEl) {
          try { inputEl.focus({ preventScroll: true }); inputEl.select(); } catch (e) {}
        } else if (preferCancel) {
          try { cancelBtn.focus({ preventScroll: true }); } catch (e) {}
        } else if (okBtn) {
          try { okBtn.focus({ preventScroll: true }); } catch (e) {}
        }
      });
    });
  }

  function uiAlert(message, opts) {
    const o = Object.assign({ mode: "alert", message: message }, opts || {});
    if (o.asToast) {
      toast(o.tone === "danger" ? "error" : (o.tone || "info"), message, o);
      return Promise.resolve();
    }
    return openModal(o);
  }

  function uiConfirm(message, optsOrCb, maybeCb) {
    let opts = {};
    let cb = null;
    if (typeof optsOrCb === "function") {
      cb = optsOrCb;
    } else {
      opts = optsOrCb || {};
      if (typeof maybeCb === "function") cb = maybeCb;
    }
    const p = openModal(Object.assign({
      mode: "confirm",
      tone: "warn",
      icon: "❓",
      title: "Xác nhận",
      confirmText: "Tiếp tục",
      cancelText: "Hủy",
      message: message
    }, opts));
    if (cb) {
      p.then(function (ok) { if (ok) cb(); });
    }
    return p;
  }

  function uiPrompt(message, defaultValue, opts) {
    return openModal(Object.assign({
      mode: "prompt",
      tone: "primary",
      icon: "📝",
      title: "Nhập nội dung",
      confirmText: "Lưu",
      cancelText: "Hủy",
      message: message,
      defaultValue: defaultValue == null ? "" : String(defaultValue)
    }, opts || {}));
  }

  /* ---------------- 3. REUSABLE SEARCH BAR HTML & WIRING (Dùng cho Reading/Listening/Writing/Speaking) ---------------- */
  function matchesSearch(haystack, query) {
    const q = normalizeSearch(query);
    if (!q) return true;
    const h = normalizeSearch(haystack);
    if (!h) return false;
    const tokens = q.split(" ").filter(Boolean);
    return tokens.every(function (tok) { return h.indexOf(tok) !== -1; });
  }

  function syncSearchClear(inputOrId) {
    const inp = typeof inputOrId === "string" ? document.getElementById(inputOrId) : inputOrId;
    if (!inp) return;
    const field = inp.closest ? inp.closest(".s4-search-field") : inp.parentElement;
    const clr = field ? field.querySelector(".s4-search-clear") : null;
    if (clr) clr.classList.toggle("visible", !!String(inp.value || "").trim());
  }

  function bindSearchBar(cfg) {
    const o = cfg || {};
    const inp = typeof o.input === "string" ? document.getElementById(o.input) : o.input;
    if (!inp || inp.dataset.s4SearchBound === "1") return;
    inp.dataset.s4SearchBound = "1";

    const field = inp.closest ? inp.closest(".s4-search-field") : inp.parentElement;
    const grp = inp.closest ? inp.closest(".s4-search-group") : null;
    const clr = (typeof o.clearBtn === "string" ? document.getElementById(o.clearBtn) : o.clearBtn)
      || (field ? field.querySelector(".s4-search-clear") : null);
    const btn = (typeof o.searchBtn === "string" ? document.getElementById(o.searchBtn) : o.searchBtn)
      || (grp ? grp.querySelector(".s4-search-btn") : null);
    const delay = typeof o.delay === "number" ? o.delay : 150;

    let timer = null;
    let isComposing = false;

    function fire(reason, immediate) {
      if (timer) { clearTimeout(timer); timer = null; }
      const val = inp.value || "";
      syncSearchClear(inp);
      if (typeof o.onSearch !== "function") return;
      if (immediate) {
        o.onSearch(val, { immediate: true, reason: reason || "submit" });
      } else {
        timer = setTimeout(function () {
          timer = null;
          o.onSearch(inp.value || "", { immediate: false, reason: reason || "input" });
        }, delay);
      }
    }

    inp.addEventListener("compositionstart", function () { isComposing = true; });
    inp.addEventListener("compositionend", function () {
      isComposing = false;
      fire("input", false);
    });
    inp.addEventListener("input", function () {
      syncSearchClear(inp);
      if (!isComposing) fire("input", false);
    });
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        fire("enter", true);
      } else if (e.key === "Escape" && inp.value) {
        e.preventDefault();
        inp.value = "";
        fire("clear", true);
      }
    });
    if (clr) {
      clr.addEventListener("click", function () {
        inp.value = "";
        fire("clear", true);
        try { inp.focus({ preventScroll: true }); } catch (e) {}
      });
    }
    if (btn) {
      btn.addEventListener("click", function () {
        fire("submit", true);
      });
    }
    syncSearchClear(inp);
  }

  function buildSearchBarHtml(cfg) {
    const o = cfg || {};
    const id = escapeHtml(o.id || "s4SearchInput");
    const clearId = escapeHtml(o.clearId || id + "_clear");
    const btnId = escapeHtml(o.btnId || id + "_btn");
    const val = escapeHtml(o.value || "");
    const ph = escapeHtml(o.placeholder || "Tìm kiếm...");
    const hasVal = !!String(o.value || "").trim();
    const oninputAttr = o.oninput ? ` oninput="${escapeHtml(o.oninput)}"` : "";
    const onkeydownAttr = o.onkeydown ? ` onkeydown="${escapeHtml(o.onkeydown)}"` : "";
    const onclearAttr = o.onclear ? ` onclick="${escapeHtml(o.onclear)}"` : "";
    const onsubmitAttr = o.onsubmit ? ` onclick="${escapeHtml(o.onsubmit)}"` : "";
    const imeAttrs = o.trackIme
      ? ` oncompositionstart="this.dataset.composing='1'" oncompositionend="this.dataset.composing='0';if(typeof this.oninput==='function')this.oninput();"`
      : "";
    const wrapClasses = ["s4-search-group"];
    if (o.compact) wrapClasses.push("is-compact");
    if (o.wrapClass) wrapClasses.push(o.wrapClass);

    let btnHtml = "";
    if (!o.hideButton) {
      if (o.compact) {
        btnHtml = `<button type="button" id="${btnId}" class="s4-search-btn is-icon" title="${escapeHtml(o.buttonTitle || "Tìm kiếm")}" aria-label="${escapeHtml(o.buttonTitle || "Tìm kiếm")}"${onsubmitAttr}>🔍</button>`;
      } else {
        btnHtml = `<button type="button" id="${btnId}" class="s4-search-btn"${onsubmitAttr}>🔍 ${escapeHtml(o.buttonLabel || "Tìm")}</button>`;
      }
    }

    return `
      <div class="${escapeHtml(wrapClasses.join(" "))}" style="${escapeHtml(o.wrapStyle || "")}">
        <div class="s4-search-field">
          <input type="text" id="${id}" class="s4-search-input ${escapeHtml(o.inputClass || "")}" value="${val}" placeholder="${ph}" autocomplete="off"${imeAttrs}${oninputAttr}${onkeydownAttr}>
          <button type="button" id="${clearId}" class="s4-search-clear${hasVal ? " visible" : ""}" title="Xóa từ khóa" aria-label="Xóa từ khóa"${onclearAttr}>✕</button>
        </div>
        ${btnHtml}
      </div>
    `;
  }

  function formatTimer(seconds) {
    const s = Math.max(0, Math.floor(Number(seconds) || 0));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
  }

  function renderStepBadge(current, total, prefix) {
    const cur = Math.max(1, Number(current) || 1);
    const tot = Math.max(cur, Number(total) || cur);
    const lbl = escapeHtml(prefix || "Bước");
    return `<span class="s4-step-badge">${lbl} ${cur}/${tot}</span>`;
  }

  function renderSpeakingRecorderHtml(cfg) {
    const o = cfg || {};
    const btnId = escapeHtml(o.btnId || "s4SpeakRecBtn");
    const timerId = escapeHtml(o.timerId || "s4SpeakTimer");
    const statusId = escapeHtml(o.statusId || "s4SpeakStatus");
    const recording = !!o.recording;
    const label = escapeHtml(o.label || (recording ? "⏹ Dừng ghi âm" : "🎙️ Bắt đầu nói"));
    const status = escapeHtml(o.status || (recording ? "Đang ghi âm..." : "Sẵn sàng luyện nói"));
    const timeStr = escapeHtml(formatTimer(o.seconds || 0));
    const onclickAttr = o.onclick ? ` onclick="${escapeHtml(o.onclick)}"` : "";
    return `
      <div class="s4-speaking-recorder">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <button type="button" id="${btnId}" class="s4-mic-btn${recording ? " is-recording" : ""}"${onclickAttr}>${label}</button>
          <span class="s4-waveform-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <span id="${statusId}" style="font-size:13px;font-weight:700;color:var(--muted,#64748b);">${status}</span>
        </div>
        <span id="${timerId}" class="s4-step-badge" style="font-variant-numeric:tabular-nums;">⏱️ ${timeStr}</span>
      </div>
    `;
  }

  window.S4UI = {
    toast: toast,
    alert: uiAlert,
    confirm: uiConfirm,
    prompt: uiPrompt,
    escapeHtml: escapeHtml,
    normalizeSearch: normalizeSearch,
    matchesSearch: matchesSearch,
    syncSearchClear: syncSearchClear,
    bindSearchBar: bindSearchBar,
    getMountHost: getMountHost,
    buildSearchBarHtml: buildSearchBarHtml,
    formatTimer: formatTimer,
    renderStepBadge: renderStepBadge,
    renderSpeakingRecorderHtml: renderSpeakingRecorderHtml
  };
})();
