(function () {
  "use strict";

  async function askWorker(pack, download, progress) {
    if (!navigator.serviceWorker) throw new Error("Trình duyệt chưa hỗ trợ lưu gói offline.");
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration?.active) throw new Error("Gói offline sẽ dùng được sau khi tải lại trang.");
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => finish({ error: "Tải gói quá lâu. Hãy thử lại." }), 180000);
      function finish(result) {
        clearTimeout(timer);
        channel.port1.close();
        if (result.error) reject(new Error(result.error));
        else resolve(Boolean(result.ready));
      }
      channel.port1.onmessage = ({ data }) => {
        if ("done" in data) {
          if (progress) progress(data);
        } else finish(data);
      };
      registration.active.postMessage({
        type: download ? "lp-download-offline" : "lp-status-offline",
        pack
      }, [channel.port2]);
    });
  }

  function setupButton(button) {
    const pack = button.dataset.offlinePack;
    if (!pack || button.dataset.offlineBound) return;
    button.dataset.offlineBound = "1";
    const labelEl = button.querySelector("[data-offline-label]") || button;
    const original = labelEl.textContent.trim();
    const compact = button.hasAttribute("data-offline-compact");
    const host = button.closest("[data-offline-item]") || button.parentElement;
    const status = host ? host.querySelector("[data-offline-status]") : null;
    function display(text) {
      if (status) status.textContent = text;
      else if (window.S4UI) window.S4UI.toast("info", text);
    }
    function setReadyLabel() {
      labelEl.textContent = compact ? "Cập nhật" : "Cập nhật gói đã lưu";
      button.classList.add("is-ready");
    }
    askWorker(pack, false).then(ready => {
      if (ready) {
        setReadyLabel();
        if (compact) display("Đã lưu sẵn để mở offline.");
      }
    }).catch(() => {});
    button.addEventListener("click", async () => {
      button.disabled = true;
      try {
        display("Đang tải dữ liệu…");
        await askWorker(pack, true, ({ done, total }) => display("Đã tải " + done + "/" + total + " tệp."));
        setReadyLabel();
        display(compact ? "Đã lưu sẵn để mở offline." : "Đã lưu nội dung để mở khi offline.");
      } catch (error) {
        display(error.message);
        labelEl.textContent = original;
        button.classList.remove("is-ready");
      } finally {
        button.disabled = false;
      }
    });
  }

  window.LinguaPathOffline = { setupButton, askWorker };
  document.querySelectorAll("[data-offline-pack]").forEach(setupButton);
})();
