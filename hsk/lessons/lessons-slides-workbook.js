/* LinguaPath HSK Lessons — Textbook Page Enhancer & Interactive Workbook Walkthrough Engine
 * Enhances lecture/grammar pages (TOC, section cards, click-to-pronounce) and powers
 * the 3-part graded practice workbook across all 106 HSK 0–6 lessons.
 */
(function (global) {
  "use strict";

  const WB_DONE_KEY = "lp_hsk_workbook_done_v1";

  const COMMON_CHUNKS = [
    "我们", "你们", "他们", "她们", "大家", "什么", "怎么", "怎么样", "为什么", "多少", "哪里", "哪儿",
    "可以", "应该", "必须", "需要", "想要", "希望", "觉得", "认为", "以为", "知道", "认识", "了解",
    "已经", "正在", "经常", "总是", "从来", "刚才", "马上", "一直", "还是", "或者", "虽然", "但是",
    "因为", "所以", "如果", "只要", "只有", "无论", "不管", "不仅", "而且", "除了", "以外", "于是",
    "非常", "特别", "比较", "稍微", "有点儿", "一点儿", "时候", "地方", "朋友", "老师", "同学", "先生",
    "小姐", "爸爸", "妈妈", "哥哥", "姐姐", "弟弟", "妹妹", "公司", "医院", "学校", "机场", "火车站",
    "中国", "北京", "汉语", "中文", "工作", "学习", "生活", "习惯", "问题", "办法", "机会", "影响",
    "今天", "明天", "昨天", "现在", "上午", "下午", "晚上", "周末", "以后", "以前", "这里", "那里",
    "对不起", "没关系", "不客气", "谢谢", "再见", "你好", "请问", "高兴", "喜欢", "准备", "打算"
  ];

  const state = {
    lessonId: "",
    wbDone: {},
    wbByLesson: {}, // { [lessonId]: { p1Picked, p1Graded, p2Picked, p3PickedByQ, p3GradedByQ } }
    wbwEnabled: true,
    dictIndexedCount: 0,
    lastHelpers: null
  };

  try {
    state.wbDone = JSON.parse(localStorage.getItem(WB_DONE_KEY) || "{}") || {};
  } catch (e) {
    state.wbDone = {};
  }

  function saveWbDone() {
    try {
      localStorage.setItem(WB_DONE_KEY, JSON.stringify(state.wbDone));
    } catch (e) {}
  }

  function defaultEsc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function extractZh(str) {
    const s = String(str || "").trim();
    const cleaned = s
      .replace(/\([^)]*[A-Za-zÀ-ỹ][^)]*\)/g, "")
      .replace(/（[^）]*[A-Za-zÀ-ỹ][^）]*）/g, "")
      .trim();
    const zhParts = cleaned.match(/[\u3400-\u9FFF\u3000-\u303F\uFF01-\uFF5E0-9]+/g);
    if (zhParts && zhParts.length) return zhParts.join("，");
    const anyZh = s.match(/[\u3400-\u9FFF]+/g);
    return anyZh ? anyZh.join("，") : s;
  }

  function normZh(str) {
    return String(str || "").replace(/[^\u3400-\u9FFFA-Za-z0-9]/g, "");
  }

  function seedFromStr(str) {
    let h = 2166136261 >>> 0;
    const s = String(str || "lp");
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seededShuffle(arr, seedKey) {
    const out = arr.slice();
    const rnd = mulberry32(seedFromStr(seedKey));
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  function injectPageAndWorkbookStyles() {
    if (document.getElementById("hskSlidesWorkbookStyle")) return;
    const css = `
      /* Textbook Lecture Page Layout */
      .page-toc {
        display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
        padding: 10px 12px; margin-bottom: 14px;
        background: var(--bg); border: 1px solid var(--border); border-radius: 13px;
      }
      .page-toc-label {
        font-size: 11.5px; font-weight: 800; color: var(--muted);
        text-transform: uppercase; letter-spacing: 0.35px; margin-right: 4px;
      }
      .page-toc-btn {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 5px 10px; border-radius: 99px; border: 1px solid var(--border);
        background: var(--card); color: var(--text); font-size: 12px; font-weight: 700;
        cursor: pointer; font-family: inherit; transition: all 0.14s ease;
      }
      .page-toc-btn:hover { border-color: var(--primary); color: var(--primary); }

      .lecture-sec-card {
        background: var(--card); border: 1px solid var(--border); border-radius: 14px;
        padding: 15px 17px; margin: 12px 0;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.03);
        overflow-wrap: anywhere;
      }
      .lecture-sec-head {
        display: flex; align-items: center; justify-content: space-between; gap: 8px;
        padding-bottom: 8px; margin-bottom: 10px; border-bottom: 1px solid var(--border);
      }
      .lecture-sec-title {
        margin: 0; font-size: 16.5px; font-weight: 900; color: var(--primary); line-height: 1.35;
      }
      .lecture-sec-num {
        flex-shrink: 0; font-size: 11px; font-weight: 800; padding: 2px 9px; border-radius: 99px;
        background: rgba(220, 38, 38, 0.1); color: var(--primary);
      }
      html.theme-ghibli .lecture-sec-num { background: rgba(45, 106, 79, 0.12); }

      .fullpage-divider {
        margin: 22px 0 12px; padding: 10px 14px; border-radius: 12px;
        background: var(--bg); border: 1px solid var(--border);
        border-left: 4px solid var(--primary);
        display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;
      }
      .fullpage-divider h3 {
        margin: 0; font-size: 16px; font-weight: 900; color: var(--text);
      }
      .fullpage-divider span {
        font-size: 12px; font-weight: 700; color: var(--muted);
      }

      .sl-counter-pill {
        display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 99px;
        background: rgba(220,38,38,0.12); color: var(--primary); font-size: 12.5px; font-weight: 800;
      }
      html.theme-ghibli .sl-counter-pill { background: rgba(45,106,79,0.14); }
      .sl-zh-code {
        background: rgba(37,99,235,0.11); border: 1px solid rgba(37,99,235,0.28);
        color: var(--accent); padding: 2px 7px; border-radius: 7px; cursor: pointer;
        font-family: inherit; font-weight: 800; display: inline-flex; align-items: center; gap: 3px;
        transition: all 0.12s ease;
      }
      .sl-zh-code:hover { background: rgba(37,99,235,0.2); border-color: var(--accent); }
      .sl-zh-code::after { content: "🔊"; font-size: 11px; opacity: 0.8; }

      /* Workbook Section */
      .wb-wrap { display: flex; flex-direction: column; gap: 16px; }
      .wb-sec {
        background: var(--bg); border: 1px solid var(--border); border-radius: 15px;
        padding: 15px; display: flex; flex-direction: column; gap: 11px;
      }
      .wb-sec-head {
        display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;
      }
      .wb-sec-title { margin: 0; font-size: 15.5px; font-weight: 900; color: var(--primary); }
      .wb-item {
        background: var(--card); border: 1px solid var(--border); border-radius: 12px;
        padding: 12px 13px; display: flex; flex-direction: column; gap: 9px;
      }
      .wb-q-txt { font-size: 15.5px; font-weight: 700; line-height: 1.55; overflow-wrap: anywhere; }
      .wb-blank {
        display: inline-block; min-width: 58px; padding: 1px 10px; margin: 0 3px;
        border-radius: 8px; border: 1.5px dashed var(--accent); background: rgba(37,99,235,0.08);
        color: var(--accent); text-align: center; font-weight: 800;
      }
      .wb-blank.filled { border-style: solid; background: rgba(37,99,235,0.14); }
      .wb-blank.ok { border-color: #16a34a; background: rgba(22,163,74,0.15); color: var(--ok); }
      .wb-blank.bad { border-color: #dc2626; background: rgba(220,38,38,0.14); color: var(--danger); }
      .wb-opts-row { display: flex; flex-wrap: wrap; gap: 7px; }
      .wb-opt-pill {
        padding: 7px 12px; border-radius: 10px; border: 1.5px solid var(--border);
        background: var(--bg); color: var(--text); font-size: 14px; font-weight: 700;
        cursor: pointer; font-family: inherit; transition: all 0.12s ease;
      }
      .wb-opt-pill:hover { border-color: var(--primary); }
      .wb-opt-pill.sel { background: rgba(37,99,235,0.14); border-color: var(--accent); color: var(--accent); }
      .wb-opt-pill.ok { background: rgba(22,163,74,0.16); border-color: #16a34a; color: var(--ok); }
      .wb-opt-pill.bad { background: rgba(220,38,38,0.15); border-color: #dc2626; color: var(--danger); }

      .wb-choice-col { display: flex; flex-direction: column; gap: 7px; }
      .wb-choice-btn {
        text-align: left; padding: 9px 12px; border-radius: 10px; border: 1.5px solid var(--border);
        background: var(--bg); color: var(--text); font-size: 14px; font-weight: 700;
        cursor: pointer; font-family: inherit; line-height: 1.45; overflow-wrap: anywhere;
      }
      .wb-choice-btn:hover { border-color: var(--primary); }
      .wb-choice-btn.ok { background: rgba(22,163,74,0.16); border-color: #16a34a; color: var(--ok); }
      .wb-choice-btn.bad { background: rgba(220,38,38,0.15); border-color: #dc2626; color: var(--danger); }

      .wb-tray {
        min-height: 48px; border: 1.5px dashed var(--border); border-radius: 11px;
        background: var(--bg); padding: 8px 10px; display: flex; flex-wrap: wrap; gap: 7px; align-items: center;
      }
      .wb-tile {
        padding: 6px 11px; border-radius: 9px; border: 1.5px solid var(--border);
        background: var(--card); color: var(--text); font-size: 15px; font-weight: 800;
        cursor: pointer; font-family: inherit;
      }
      .wb-tile.placed { border-color: var(--primary); background: rgba(220,38,38,0.1); color: var(--primary); }
      .wb-tile.used { opacity: 0.28; pointer-events: none; }
      .wb-fb {
        border-radius: 10px; padding: 10px 12px; font-size: 13.5px; line-height: 1.55;
        background: var(--bg); border: 1px solid var(--border);
      }
      .wb-fb.ok { border-color: rgba(22,163,74,0.45); background: rgba(22,163,74,0.09); }
      .wb-fb.bad { border-color: rgba(220,38,38,0.45); background: rgba(220,38,38,0.09); }
      .wb-ext-card {
        background: linear-gradient(135deg, rgba(220,38,38,0.07), rgba(217,119,6,0.07));
        border: 1px dashed rgba(220,38,38,0.35); border-radius: 14px; padding: 13px 15px;
        display: flex; flex-direction: column; gap: 8px;
      }
      .wb-ext-links { display: flex; gap: 8px; flex-wrap: wrap; }
      .wb-ext-btn {
        display: inline-flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: 10px;
        border: 1px solid var(--border); background: var(--card); color: var(--text);
        font-size: 12.5px; font-weight: 800; text-decoration: none;
      }
      .wb-ext-btn:hover { border-color: var(--primary); color: var(--primary); }

      @media (max-width: 640px) {
        .page-toc { padding: 8px 10px; gap: 5px; }
        .page-toc-btn { font-size: 11.5px; padding: 5px 9px; }
        .lecture-sec-card { padding: 13px; }
        .lecture-sec-title { font-size: 15.5px; }
      }

      /* Rich Teaching Cards, Auto-Pinyin & Word-by-Word Breakdown */
      .auto-py {
        color: var(--accent); font-weight: 700; font-size: 0.9em;
        margin-left: 3px; white-space: normal; overflow-wrap: anywhere;
      }
      .c0-banner {
        background: linear-gradient(135deg, rgba(22,163,74,0.09), rgba(14,165,233,0.08));
        border: 1px solid rgba(22,163,74,0.32); border-radius: 13px;
        padding: 11px 14px; margin-bottom: 13px;
        display: flex; flex-direction: column; gap: 8px;
      }
      .c0-banner-title { font-size: 13px; font-weight: 800; color: var(--text); line-height: 1.45; }
      .c0-banner-links { display: flex; flex-wrap: wrap; gap: 6px; }
      .c0-jump-btn {
        padding: 5px 10px; border-radius: 9px; border: 1px solid var(--border);
        background: var(--card); color: var(--primary); font-size: 12px; font-weight: 800;
        cursor: pointer; font-family: inherit;
      }
      .c0-jump-btn:hover { border-color: var(--primary); background: rgba(22,163,74,0.08); }

      .v-teach-grid {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 310px), 1fr));
        gap: 12px;
      }
      .v-teach-card {
        background: var(--bg); border: 1px solid var(--border); border-radius: 14px;
        padding: 14px; display: flex; flex-direction: column; gap: 9px;
        min-width: 0; max-width: 100%; overflow-wrap: anywhere;
      }
      .v-teach-head {
        display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;
      }
      .v-teach-word-row { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
      .v-teach-zh { font-size: 26px; font-weight: 900; color: var(--primary); line-height: 1.15; }
      .v-teach-py { font-size: 14px; font-weight: 800; color: var(--accent); }
      .v-teach-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 4px; }
      .v-tag {
        display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 99px;
        font-size: 11px; font-weight: 700; border: 1px solid var(--border);
        background: var(--card); color: var(--muted);
      }
      .v-tag.pos { color: var(--accent); border-color: rgba(37,99,235,0.28); background: rgba(37,99,235,0.08); }
      .v-tag.hv { color: var(--warn); border-color: rgba(217,119,6,0.3); background: rgba(217,119,6,0.08); }
      .v-teach-meaning { font-size: 14px; line-height: 1.5; color: var(--text); }
      .v-teach-note { font-size: 12.5px; line-height: 1.48; color: var(--muted); }
      .v-teach-memo {
        font-size: 12.5px; line-height: 1.48; padding: 7px 10px; border-radius: 10px;
        background: rgba(217,119,6,0.08); border: 1px dashed rgba(217,119,6,0.35); color: var(--text);
      }
      .v-colloc-row { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
      .v-colloc-lbl { font-size: 11.5px; font-weight: 800; color: var(--muted); }
      .v-colloc-btn {
        display: inline-flex; align-items: center; gap: 4px; flex-wrap: wrap;
        padding: 4px 9px; border-radius: 8px; border: 1px solid var(--border);
        background: var(--card); color: var(--text); font-size: 12px; font-weight: 700;
        cursor: pointer; font-family: inherit; max-width: 100%; text-align: left;
      }
      .v-colloc-btn:hover { border-color: var(--primary); color: var(--primary); }
      .v-colloc-btn .py-text { color: var(--accent); font-weight: 700; }
      .v-colloc-btn .vi-text { color: var(--muted); font-weight: 600; }
      .v-ex-box {
        background: var(--card); border: 1px solid var(--border); border-radius: 10px;
        padding: 8px 10px; display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;
      }
      .v-ex-zh { font-size: 14px; font-weight: 700; line-height: 1.45; }
      .v-ex-zh mark {
        background: rgba(220,38,38,0.14); color: var(--primary);
        padding: 0 3px; border-radius: 4px; font-weight: 900;
      }
      html.theme-ghibli .v-ex-zh mark { background: rgba(45,106,79,0.16); }
      .v-ex-py { font-size: 12px; color: var(--accent); margin-top: 2px; }
      .v-ex-vi { font-size: 12.5px; color: var(--muted); margin-top: 2px; line-height: 1.4; }

      /* Grammar Formula & Word-by-Word Chips */
      .gram-formula-box {
        margin: 8px 0 10px; padding: 9px 12px; border-radius: 10px;
        background: rgba(37,99,235,0.08); border: 1px solid rgba(37,99,235,0.28);
        font-size: 13.5px; font-weight: 800; color: var(--accent); line-height: 1.5;
        overflow-wrap: anywhere;
      }
      .gram-wbw-box {
        margin-top: 10px; padding-top: 9px; border-top: 1px dashed var(--border);
      }
      .gram-wbw-lbl { font-size: 11.5px; font-weight: 800; color: var(--muted); margin-bottom: 6px; }

      .dlg-scene-hdr {
        margin: 14px 0 8px; padding: 6px 11px; border-radius: 9px;
        background: rgba(220,38,38,0.08); color: var(--primary);
        font-size: 12.5px; font-weight: 800; display: inline-flex; align-items: center; gap: 6px;
      }
      html.theme-ghibli .dlg-scene-hdr { background: rgba(45,106,79,0.11); }
      .dlg-item-rich {
        flex-direction: column; align-items: stretch !important; gap: 9px !important;
      }
      .dlg-top-row {
        display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;
      }
      .dlg-wbw {
        display: flex; flex-wrap: wrap; gap: 6px; padding-top: 8px;
        border-top: 1px dashed var(--border);
      }
      .wbw-chip {
        display: inline-flex; flex-direction: column; align-items: flex-start; gap: 1px;
        padding: 5px 8px; border-radius: 9px; border: 1px solid var(--border);
        background: var(--card); cursor: pointer; font-family: inherit;
        text-align: left; max-width: 100%; transition: border-color 0.12s ease;
      }
      .wbw-chip:hover { border-color: var(--primary); }
      .wbw-chip.is-new { border-color: rgba(220,38,38,0.45); background: rgba(220,38,38,0.05); }
      html.theme-ghibli .wbw-chip.is-new { border-color: rgba(45,106,79,0.45); background: rgba(45,106,79,0.06); }
      .wbw-zh { font-size: 14px; font-weight: 800; color: var(--text); line-height: 1.25; }
      .wbw-py { font-size: 11px; font-weight: 700; color: var(--accent); line-height: 1.25; }
      .wbw-vi { font-size: 11px; color: var(--muted); line-height: 1.25; max-width: 140px; overflow-wrap: anywhere; }
      .rw-py { font-size: 12px; color: var(--accent); font-weight: 700; margin-top: 3px; }

      /* Tappable Chinese Words & Quick Dictionary Popup */
      .zh-tap {
        cursor: pointer; border-radius: 5px; padding: 0 1px;
        border-bottom: 1.5px dotted rgba(37,99,235,0.45); transition: background 0.12s ease, border-color 0.12s ease;
      }
      .zh-tap:hover, .zh-tap.is-picked {
        background: rgba(37,99,235,0.13); border-bottom-color: var(--primary); color: var(--primary);
      }
      .zh-tap-hint {
        font-size: 11.5px; color: var(--muted); font-weight: 700;
        display: inline-flex; align-items: center; gap: 4px;
      }
      .lp-wpop-backdrop {
        position: fixed; inset: 0; background: rgba(15,23,42,0.42); z-index: 998;
        display: none; backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
      }
      .lp-wpop-backdrop.show { display: block; }
      .lp-wpop-card {
        position: fixed; left: 50%; bottom: max(18px, env(safe-area-inset-bottom, 0px));
        transform: translateX(-50%); width: min(430px, calc(100vw - 24px));
        background: var(--card); color: var(--text);
        border: 1.5px solid var(--border); border-radius: 18px;
        padding: 15px 16px; z-index: 999; display: none;
        box-shadow: 0 18px 46px rgba(0,0,0,0.28);
      }
      .lp-wpop-card.show { display: block; animation: lpWpopIn 0.16s ease-out; }
      @keyframes lpWpopIn { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
      .lp-wpop-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
      .lp-wpop-zh { font-size: 30px; font-weight: 900; color: var(--primary); line-height: 1.15; }
      .lp-wpop-py { font-size: 15px; font-weight: 800; color: var(--accent); margin-left: 8px; }
      .lp-wpop-close {
        width: 30px; height: 30px; border-radius: 999px; border: 1px solid var(--border);
        background: var(--bg); color: var(--muted); cursor: pointer; font-size: 15px; font-weight: 800;
        display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .lp-wpop-close:hover { border-color: var(--primary); color: var(--primary); }
      .lp-wpop-tags { display: flex; flex-wrap: wrap; gap: 5px; margin: 7px 0 9px; }
      .lp-wpop-vi {
        font-size: 14px; line-height: 1.5; background: var(--bg);
        border: 1px solid var(--border); border-radius: 11px; padding: 9px 11px;
      }
      .lp-wpop-chars { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
      .lp-wpop-char-btn {
        padding: 4px 9px; border-radius: 8px; border: 1px solid var(--border);
        background: var(--bg); color: var(--text); font-size: 12px; font-weight: 700;
        cursor: pointer; font-family: inherit;
      }
      .lp-wpop-char-btn:hover { border-color: var(--primary); color: var(--primary); }
      .lp-wpop-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
      .lp-wpop-btn {
        flex: 1; min-width: 120px; padding: 9px 12px; border-radius: 11px;
        border: 1px solid var(--border); background: var(--bg); color: var(--text);
        font-size: 13px; font-weight: 800; cursor: pointer; text-decoration: none;
        display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-family: inherit;
      }
      .lp-wpop-btn:hover { border-color: var(--primary); color: var(--primary); }
      .lp-wpop-btn.primary {
        background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; border-color: transparent;
      }
      html.theme-ghibli .lp-wpop-btn.primary {
        background: linear-gradient(135deg, #2d6a4f, #40916c);
      }

      /* Confusable Words & Polyphones (辨析) Liquid Glass Block */
      .bx-wrap { display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px; }
      .bx-card {
        background: var(--lg-surface, var(--bg));
        backdrop-filter: var(--lg-blur, blur(10px)); -webkit-backdrop-filter: var(--lg-blur, blur(10px));
        border: 1px solid var(--lg-hairline, var(--border)); border-radius: 15px;
        padding: 14px 15px; display: flex; flex-direction: column; gap: 10px;
      }
      .bx-head {
        display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;
        padding-bottom: 8px; border-bottom: 1px dashed var(--border);
      }
      .bx-title {
        margin: 0; font-size: 15.5px; font-weight: 900; color: var(--text);
        display: inline-flex; align-items: center; gap: 7px;
      }
      .bx-badges { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; }
      .bx-badge {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 800;
        border: 1px solid var(--border); background: var(--card); color: var(--muted);
      }
      .bx-badge.pair { color: var(--accent); border-color: rgba(37,99,235,0.32); background: rgba(37,99,235,0.08); }
      .bx-badge.poly { color: var(--warn); border-color: rgba(217,119,6,0.36); background: rgba(217,119,6,0.09); }
      .bx-badge.hit { color: var(--ok); border-color: rgba(22,163,74,0.36); background: rgba(22,163,74,0.09); }
      .bx-cols {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 10px;
      }
      .bx-col {
        background: var(--card); border: 1px solid var(--border); border-radius: 12px;
        padding: 11px 12px; display: flex; flex-direction: column; gap: 7px; min-width: 0;
      }
      .bx-col-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
      .bx-zh { font-size: 22px; font-weight: 900; color: var(--primary); line-height: 1.15; }
      .bx-py { font-size: 13px; font-weight: 800; color: var(--accent); margin-left: 6px; }
      .bx-pos {
        display: inline-block; font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 6px;
        background: var(--bg); border: 1px solid var(--border); color: var(--muted); margin-top: 3px;
      }
      .bx-core { font-size: 13.5px; line-height: 1.48; color: var(--text); }
      .bx-pattern {
        font-size: 12.5px; font-weight: 700; color: var(--accent);
        background: rgba(37,99,235,0.07); border: 1px solid rgba(37,99,235,0.2);
        border-radius: 8px; padding: 5px 8px; line-height: 1.4;
      }
      .bx-ex {
        background: var(--bg); border: 1px solid var(--border); border-radius: 9px;
        padding: 7px 9px; display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;
      }
      .bx-ex-zh { font-size: 13.5px; font-weight: 700; line-height: 1.45; }
      .bx-ex-zh mark { background: rgba(220,38,38,0.14); color: var(--primary); padding: 0 3px; border-radius: 4px; font-weight: 900; }
      html.theme-ghibli .bx-ex-zh mark { background: rgba(45,106,79,0.16); }
      .bx-ex-py { font-size: 11.5px; color: var(--accent); margin-top: 2px; }
      .bx-ex-vi { font-size: 12px; color: var(--muted); margin-top: 2px; line-height: 1.38; }
      .bx-tip {
        display: flex; align-items: flex-start; gap: 7px;
        font-size: 12.8px; line-height: 1.5; color: var(--text);
        background: rgba(217,119,6,0.08); border: 1px dashed rgba(217,119,6,0.38);
        border-radius: 10px; padding: 8px 11px;
      }
      .bx-tip svg { flex-shrink: 0; margin-top: 2px; color: var(--warn); }

      /* Workbook Part 3 Typed Mode & Part 4 [A][B][C][D] Position Picker */
      .wb-mode-bar { display: inline-flex; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: var(--bg); }
      .wb-mode-btn {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 6px 11px; border: none; background: transparent; color: var(--text);
        font-size: 12px; font-weight: 800; cursor: pointer; font-family: inherit;
      }
      .wb-mode-btn.on { background: var(--primary); color: #fff; }
      .wb-type-input {
        width: 100%; padding: 10px 12px; border-radius: 11px; border: 1.5px solid var(--border);
        background: var(--bg); color: var(--text); font-size: 15.5px; font-weight: 600;
        font-family: inherit; outline: none;
      }
      .wb-type-input:focus { border-color: var(--primary); }
      .wb-type-hint { font-size: 12px; color: var(--muted); line-height: 1.45; }
      .wb-diff-ok { color: var(--ok); font-weight: 800; }
      .wb-diff-miss { color: var(--danger); font-weight: 800; text-decoration: underline wavy; }

      .wb-pos-word-row {
        display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        font-size: 13.5px; color: var(--muted);
      }
      .wb-pos-word-pill {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 4px 11px; border-radius: 999px;
        background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.34);
        color: var(--primary); font-size: 15px; font-weight: 900;
      }
      html.theme-ghibli .wb-pos-word-pill {
        background: rgba(45,106,79,0.15); border-color: rgba(45,106,79,0.38);
      }
      .wb-pos-sent {
        font-size: 16.5px; font-weight: 700; line-height: 2.05; color: var(--text);
        background: var(--bg); border: 1px solid var(--border); border-radius: 11px;
        padding: 10px 12px; overflow-wrap: anywhere;
      }
      .wb-slot-btn {
        display: inline-flex; align-items: center; justify-content: center;
        min-width: 34px; padding: 1px 8px; margin: 0 3px; border-radius: 8px;
        border: 1.5px dashed var(--accent); background: rgba(37,99,235,0.08);
        color: var(--accent); font-size: 13px; font-weight: 900; cursor: pointer;
        font-family: inherit; vertical-align: middle; transition: all 0.12s ease;
      }
      .wb-slot-btn:hover:not(:disabled) { border-style: solid; background: rgba(37,99,235,0.18); transform: translateY(-1px); }
      .wb-slot-btn.sel { border-style: solid; background: var(--accent); color: #fff; border-color: var(--accent); }
      .wb-slot-btn.ok { border-style: solid; background: #16a34a; color: #fff; border-color: #16a34a; }
      .wb-slot-btn.bad { border-style: solid; background: #dc2626; color: #fff; border-color: #dc2626; }
      .wb-inline-icon { display: inline-flex; align-items: center; gap: 6px; }
    `;
    const style = document.createElement("style");
    style.id = "hskSlidesWorkbookStyle";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function setHelpers(helpers) {
    injectPageAndWorkbookStyles();
    if (helpers) state.lastHelpers = helpers;
  }

  /* ================== DICTIONARY, AUTO-PINYIN & WORD-BY-WORD ENGINE ================== */

  const wordMap = new Map();
  const charMap = new Map();
  const collocsByChar = new Map(); // char/root -> array of vocab entries for fast collocation lookup

  const CORE_GLOSS_OVERRIDES = {
    "我": { py: "wǒ", vi: "tôi, mình" },
    "你": { py: "nǐ", vi: "bạn" },
    "您": { py: "nín", vi: "ngài, thầy/cô" },
    "他": { py: "tā", vi: "anh ấy" },
    "她": { py: "tā", vi: "cô ấy" },
    "它": { py: "tā", vi: "nó" },
    "我们": { py: "wǒmen", vi: "chúng tôi" },
    "你们": { py: "nǐmen", vi: "các bạn" },
    "他们": { py: "tāmen", vi: "họ" },
    "大家": { py: "dàjiā", vi: "mọi người" },
    "的": { py: "de", vi: "của / định ngữ" },
    "了": { py: "le", vi: "rồi / đã xong" },
    "着": { py: "zhe", vi: "đang (trạng thái)" },
    "过": { py: "guò", vi: "đã từng" },
    "得": { py: "de", vi: "được (bổ ngữ)" },
    "地": { py: "de", vi: "một cách (trạng ngữ)" },
    "吗": { py: "ma", vi: "không? (hỏi)" },
    "呢": { py: "ne", vi: "còn…? / nhỉ" },
    "吧": { py: "ba", vi: "nhé / đi / chắc là" },
    "啊": { py: "a", vi: "à / nhé (ngữ khí)" },
    "是": { py: "shì", vi: "là" },
    "在": { py: "zài", vi: "ở / đang" },
    "有": { py: "yǒu", vi: "có" },
    "没": { py: "méi", vi: "không / chưa" },
    "没有": { py: "méiyǒu", vi: "không có / chưa" },
    "不": { py: "bù", vi: "không" },
    "别": { py: "bié", vi: "đừng" },
    "很": { py: "hěn", vi: "rất" },
    "太": { py: "tài", vi: "quá" },
    "真": { py: "zhēn", vi: "thật là" },
    "最": { py: "zuì", vi: "nhất" },
    "都": { py: "dōu", vi: "đều" },
    "也": { py: "yě", vi: "cũng" },
    "还": { py: "hái", vi: "vẫn / còn" },
    "就": { py: "jiù", vi: "thì / liền / ngay" },
    "才": { py: "cái", vi: "mới (chậm/ít)" },
    "已经": { py: "yǐjīng", vi: "đã" },
    "正在": { py: "zhèngzài", vi: "đang" },
    "一直": { py: "yìzhí", vi: "suốt / luôn" },
    "非常": { py: "fēicháng", vi: "vô cùng" },
    "比较": { py: "bǐjiào", vi: "khá, tương đối" },
    "有点儿": { py: "yǒudiǎnr", vi: "hơi" },
    "一点儿": { py: "yìdiǎnr", vi: "một chút" },
    "和": { py: "hé", vi: "và" },
    "跟": { py: "gēn", vi: "cùng với" },
    "比": { py: "bǐ", vi: "so với" },
    "把": { py: "bǎ", vi: "đem / chiếc (lượng từ)" },
    "被": { py: "bèi", vi: "bị / được (bị động)" },
    "给": { py: "gěi", vi: "cho / đưa" },
    "对": { py: "duì", vi: "đối với / đúng" },
    "从": { py: "cóng", vi: "từ" },
    "到": { py: "dào", vi: "đến" },
    "往": { py: "wǎng", vi: "hướng về" },
    "向": { py: "xiàng", vi: "hướng tới" },
    "离": { py: "lí", vi: "cách (khoảng cách)" },
    "这": { py: "zhè", vi: "này" },
    "那": { py: "nà", vi: "kia / vậy thì" },
    "哪": { py: "nǎ", vi: "nào?" },
    "这儿": { py: "zhèr", vi: "ở đây" },
    "那儿": { py: "nàr", vi: "ở kia" },
    "哪儿": { py: "nǎr", vi: "ở đâu?" },
    "这里": { py: "zhèlǐ", vi: "ở đây" },
    "那里": { py: "nàlǐ", vi: "ở kia" },
    "哪里": { py: "nǎlǐ", vi: "ở đâu?" },
    "谁": { py: "shéi", vi: "ai?" },
    "什么": { py: "shénme", vi: "gì / cái gì?" },
    "怎么": { py: "zěnme", vi: "như thế nào / sao?" },
    "怎么样": { py: "zěnmeyàng", vi: "thế nào?" },
    "为什么": { py: "wèishénme", vi: "tại sao?" },
    "多少": { py: "duōshao", vi: "bao nhiêu?" },
    "几": { py: "jǐ", vi: "mấy?" },
    "多": { py: "duō", vi: "nhiều / bao nhiêu" },
    "个": { py: "gè", vi: "cái (lượng từ)" },
    "本": { py: "běn", vi: "quyển (sách)" },
    "张": { py: "zhāng", vi: "tờ, tấm, chiếc" },
    "件": { py: "jiàn", vi: "chiếc (áo) / việc" },
    "只": { py: "zhī", vi: "con / chiếc" },
    "条": { py: "tiáo", vi: "con / cái dài" },
    "杯": { py: "bēi", vi: "cốc, chén" },
    "块": { py: "kuài", vi: "đồng (tệ) / miếng" },
    "口": { py: "kǒu", vi: "miệng / nhân khẩu" },
    "岁": { py: "suì", vi: "tuổi" },
    "点": { py: "diǎn", vi: "giờ / chút" },
    "分": { py: "fēn", vi: "phút / điểm" },
    "分钟": { py: "fēnzhōng", vi: "phút" },
    "小时": { py: "xiǎoshí", vi: "tiếng, giờ" },
    "年": { py: "nián", vi: "năm" },
    "月": { py: "yuè", vi: "tháng" },
    "号": { py: "hào", vi: "ngày / số" },
    "日": { py: "rì", vi: "ngày / mặt trời" },
    "天": { py: "tiān", vi: "ngày / trời" },
    "星期": { py: "xīngqī", vi: "tuần / thứ" },
    "一": { py: "yī", vi: "một (1)" },
    "二": { py: "èr", vi: "hai (2)" },
    "两": { py: "liǎng", vi: "hai (đứng trước lượng từ)" },
    "三": { py: "sān", vi: "ba (3)" },
    "四": { py: "sì", vi: "bốn (4)" },
    "五": { py: "wǔ", vi: "năm (5)" },
    "六": { py: "liù", vi: "sáu (6)" },
    "七": { py: "qī", vi: "bảy (7)" },
    "八": { py: "bā", vi: "tám (8)" },
    "九": { py: "jiǔ", vi: "chín (9)" },
    "十": { py: "shí", vi: "mười (10)" },
    "百": { py: "bǎi", vi: "trăm" },
    "千": { py: "qiān", vi: "nghìn" },
    "万": { py: "wàn", vi: "vạn (10.000)" },
    "去": { py: "qù", vi: "đi" },
    "来": { py: "lái", vi: "đến" },
    "回": { py: "huí", vi: "về / quay lại" },
    "上": { py: "shàng", vi: "lên / trên" },
    "下": { py: "xià", vi: "xuống / dưới" },
    "进": { py: "jìn", vi: "vào" },
    "出": { py: "chū", vi: "ra" },
    "看": { py: "kàn", vi: "nhìn / xem / đọc" },
    "听": { py: "tīng", vi: "nghe" },
    "说": { py: "shuō", vi: "nói" },
    "读": { py: "dú", vi: "đọc" },
    "写": { py: "xiě", vi: "viết" },
    "吃": { py: "chī", vi: "ăn" },
    "喝": { py: "hē", vi: "uống" },
    "买": { py: "mǎi", vi: "mua" },
    "卖": { py: "mài", vi: "bán" },
    "想": { py: "xiǎng", vi: "muốn / nghĩ / nhớ" },
    "要": { py: "yào", vi: "cần / muốn / sắp" },
    "会": { py: "huì", vi: "biết (học qua) / sẽ" },
    "能": { py: "néng", vi: "có thể (khả năng)" },
    "可以": { py: "kěyǐ", vi: "có thể (được phép)" },
    "应该": { py: "yīnggāi", vi: "nên" },
    "请": { py: "qǐng", vi: "mời / xin vui lòng" },
    "喜欢": { py: "xǐhuan", vi: "thích" },
    "觉得": { py: "juéde", vi: "cảm thấy" },
    "知道": { py: "zhīdào", vi: "biết (thông tin)" },
    "认识": { py: "rènshi", vi: "quen biết" },
    "叫": { py: "jiào", vi: "tên là / gọi" },
    "做": { py: "zuò", vi: "làm" },
    "坐": { py: "zuò", vi: "ngồi / đi (xe)" },
    "住": { py: "zhù", vi: "sống, ở" },
    "学": { py: "xué", vi: "học" },
    "学习": { py: "xuéxí", vi: "học tập" },
    "好": { py: "hǎo", vi: "tốt / khỏe / xong" },
    "大": { py: "dà", vi: "to, lớn" },
    "小": { py: "xiǎo", vi: "nhỏ, bé" },
    "里": { py: "lǐ", vi: "bên trong" },
    "时候": { py: "shíhou", vi: "lúc, khi" },
    "因为": { py: "yīnwèi", vi: "bởi vì" },
    "所以": { py: "suǒyǐ", vi: "cho nên" },
    "虽然": { py: "suīrán", vi: "mặc dù" },
    "但是": { py: "dànshì", vi: "nhưng" },
    "如果": { py: "rúguǒ", vi: "nếu như" },
    "或者": { py: "huòzhě", vi: "hoặc là" },
    "还是": { py: "háishi", vi: "hay là? / vẫn" },
    "每": { py: "měi", vi: "mỗi, mọi" },
    "东西": { py: "dōngxi", vi: "đồ vật" },
    "今天": { py: "jīntiān", vi: "hôm nay" },
    "明天": { py: "míngtiān", vi: "ngày mai" },
    "昨天": { py: "zuótiān", vi: "hôm qua" },
    "现在": { py: "xiànzài", vi: "bây giờ" },
    "早上": { py: "zǎoshang", vi: "buổi sáng" },
    "上午": { py: "shàngwǔ", vi: "sáng (trước 12h)" },
    "中午": { py: "zhōngwǔ", vi: "buổi trưa" },
    "下午": { py: "xiàwǔ", vi: "buổi chiều" },
    "晚上": { py: "wǎnshang", vi: "buổi tối" },
    "中国": { py: "Zhōngguó", vi: "Trung Quốc" },
    "北京": { py: "Běijīng", vi: "Bắc Kinh" },
    "汉语": { py: "Hànyǔ", vi: "tiếng Hán" },
    "老师": { py: "lǎoshī", vi: "thầy/cô giáo" },
    "学生": { py: "xuésheng", vi: "học sinh, sinh viên" },
    "朋友": { py: "péngyou", vi: "bạn bè" },
    "对不起": { py: "duìbuqǐ", vi: "xin lỗi" },
    "没关系": { py: "méi guānxi", vi: "không sao đâu" },
    "谢谢": { py: "xièxie", vi: "cảm ơn" },
    "不客气": { py: "bú kèqi", vi: "đừng khách sáo" },
    "再见": { py: "zàijiàn", vi: "tạm biệt" }
  };

  // Extra readings for strokes, radicals, proper names & literary chars not in core HSK list
  const EXTRA_CHAR_PINYIN_VI = {
    "王": ["Wáng", "họ Vương"], "李": ["Lǐ", "họ Lý"], "张": ["Zhāng", "họ Trương"], "刘": ["Liú", "họ Lưu"],
    "陈": ["Chén", "họ Trần"], "杨": ["Yáng", "họ Dương"], "赵": ["Zhào", "họ Triệu"], "吴": ["Wú", "họ Ngô"],
    "周": ["Zhōu", "họ Chu"], "阮": ["Ruǎn", "họ Nguyễn"], "琳": ["Lín", "Lâm"], "娜": ["Nà", "Na"],
    "浩": ["Hào", "Hạo"], "凯": ["Kǎi", "Khải"], "梅": ["Méi", "Mai"], "芳": ["Fāng", "Phương"],
    "大卫": ["Dàwèi", "David"], "玛丽": ["Mǎlì", "Mary"], "马克": ["Mǎkè", "Mark"], "小刚": ["Xiǎogāng", "Tiểu Cương"],
    "小明": ["Xiǎomíng", "Tiểu Minh"], "小丽": ["Xiǎolì", "Tiểu Lệ"], "安娜": ["Ānnà", "Anna"], "保罗": ["Bǎoluó", "Paul"],
    "横": ["héng", "nét ngang"], "竖": ["shù", "nét sổ"], "撇": ["piě", "nét phẩy"], "捺": ["nà", "nét mác"],
    "提": ["tí", "nét hất"], "折": ["zhé", "nét gập"], "钩": ["gōu", "nét móc"], "点": ["diǎn", "nét chấm"],
    "丨": ["shù", "nét sổ"], "丿": ["piě", "nét phẩy"], "丶": ["diǎn", "nét chấm"], "亅": ["gōu", "nét móc"],
    "乚": ["gōu", "nét sổ cong móc"], "乛": ["zhé", "nét ngang gập"], "厶": ["sī", "bộ Tư"], "卜": ["bǔ", "bộ Bốc"],
    "宀": ["mián", "bộ Miên (mái nhà)"], "囗": ["wéi", "bộ Vi (vây quanh)"], "扌": ["shǒu", "bộ Thủ (tay)"],
    "氵": ["shuǐ", "bộ Thủy (nước)"], "亻": ["rén", "bộ Nhân đứng"], "耂": ["lǎo", "bộ Lão"],
    "匕": ["bǐ", "bộ Chủy"], "讠": ["yán", "bộ Ngôn (lời nói)"], "彳": ["chì", "bộ Xích (bước chân)"],
    "艮": ["gèn", "bộ Cấn"], "戈": ["gē", "bộ Qua"], "隹": ["zhuī", "bộ Chuy (chim ngắn đuôi)"],
    "冖": ["mì", "bộ Mịch (khăn trùm)"], "豕": ["shǐ", "bộ Thỉ (con lợn)"], "艹": ["cǎo", "bộ Thảo (cỏ)"],
    "钅": ["jīn", "bộ Kim (kim loại)"], "犭": ["quǎn", "bộ Khuyển (chó)"], "匚": ["fāng", "bộ Phương (hộp)"],
    "矢": ["shǐ", "bộ Thỉ (mũi tên)"], "灬": ["huǒ", "bộ Hỏa (4 chấm lửa)"], "冫": ["bīng", "bộ Băng (2 chấm)"],
    "冂": ["jiōng", "bộ Quynh (khung ngoài)"], "爫": ["zhǎo", "bộ Trảo (móng vuốt)"], "亠": ["tóu", "bộ Đầu"],
    "衤": ["yī", "bộ Y (áo)"], "疒": ["nè", "bộ Nạch (bệnh tật)"], "纟": ["sī", "bộ Mịch (tơ)"],
    "忄": ["xīn", "bộ Tâm đứng"], "糸": ["mì", "bộ Mịch (sợi tơ)"], "辶": ["chuò", "bộ Xước (bước đi)"],
    "刂": ["dāo", "bộ Đao đứng"], "彐": ["jì", "bộ Kệ"], "廾": ["gǒng", "bộ Củng (chắp tay)"],
    "饣": ["shí", "bộ Thực (ăn)"], "禾": ["hé", "bộ Hòa (cây lúa)"], "攵": ["pū", "bộ Phộc"],
    "勹": ["bāo", "bộ Bao"], "巳": ["sì", "bộ Tỵ"], "凵": ["kǎn", "bộ Khảm"],
    "礻": ["shì", "bộ Thị (lễ/thần)"], "阝": ["fù", "bộ Phụ / Ấp"], "夂": ["zhǐ", "bộ Truy"],
    "缶": ["fǒu", "bộ Phẫu"], "夬": ["guài", "quải"], "氺": ["shuǐ", "bộ Thủy dưới"],
    "勒": ["lè", "lặc"], "鹅": ["é", "con ngỗng"], "迂": ["yū", "vu"], "诶": ["éi", "ê (thán từ)"],
    "亨": ["hēng", "hanh"], "耶": ["yē", "da / nhé"], "蛙": ["wā", "con ếch"], "汪": ["Wāng", "họ Uông"],
    "邦": ["bāng", "bang / nước"], "曼": ["màn", "mạn / đẹp"], "夭": ["yāo", "yểu"], "刍": ["chú", "sô (cỏ)"],
    "浆": ["jiāng", "tương / nước đặc"], "尧": ["Yáo", "vua Nghiêu"], "琴": ["qín", "đàn cầm"], "娄": ["Lóu", "Lâu"],
    "奂": ["huàn", "hoán"], "吏": ["lì", "lại (quan lại)"], "酉": ["yǒu", "dậu"], "甬": ["yǒng", "dũng"],
    "祭": ["jì", "cúng tế"], "撼": ["hàn", "rung chuyển"], "酋": ["qiú", "tù trưởng"], "敕": ["chì", "sắc lệnh"],
    "涸": ["hé", "cạn khô"], "懈": ["xiè", "lơ là"], "契": ["qì", "khế ước"], "诀": ["jué", "bí quyết"],
    "槛": ["kǎn", "ngưỡng cửa"], "逾": ["yú", "vượt quá"], "卒": ["zú", "tốt / kết thúc"], "韵": ["yùn", "vần điệu"],
    "漓": ["lí", "Ly (sông)"], "匠": ["jiàng", "thợ"], "叩": ["kòu", "gõ / khấu"], "冶": ["yě", "luyện kim"],
    "苛": ["kē", "hà khắc"], "敖": ["Áo", "Ngao"], "對": ["duì", "đối / đúng"], "耒": ["lěi", "cái cày"],
    "彗": ["huì", "sao chổi"], "鸦": ["yā", "con quạ"], "骆": ["luò", "lạc đà"], "驼": ["tuó", "lạc đà"],
    "邃": ["suì", "sâu thẳm"], "豚": ["tún", "lợn con / cá heo"], "汲": ["jí", "múc nước"], "蹴": ["cù", "đá / bước"],
    "枢": ["shū", "trục chính"], "鸿": ["hóng", "chim hồng"], "韦": ["Wéi", "họ Vi"], "秉": ["bǐng", "nắm giữ"],
    "敦": ["dūn", "đôn hậu"], "糅": ["róu", "trộn lẫn"], "晦": ["huì", "tối tăm"], "涩": ["sè", "chát / khó hiểu"],
    "驭": ["yù", "điều khiển"], "遂": ["suì", "bèn / toại nguyện"], "冗": ["rǒng", "rườm rà"], "瞬": ["shùn", "chớp mắt"],
    "唤": ["huàn", "gọi"], "焕": ["huàn", "rạng rỡ"], "杏": ["xìng", "quả mơ"], "赘": ["zhuì", "rườm thừa"],
    "灼": ["zhuó", "nóng rực"], "鳞": ["lín", "vảy cá"], "刃": ["rèn", "lưỡi dao"], "倔": ["jué", "bướng bỉnh"],
    "匮": ["kuì", "thiếu hụt"], "蔚": ["wèi", "sum suê"], "僧": ["sēng", "nhà sư"], "沦": ["lún", "luân / chìm"],
    "阱": ["jǐng", "cái bẫy"], "褒": ["bāo", "khen ngợi"], "窠": ["kē", "tổ / sáo mòn"], "臼": ["jiù", "cối giã"],
    "焉": ["yān", "đâu / sao"], "诣": ["yì", "đạt tới"], "卵": ["luǎn", "trứng"], "缨": ["yīng", "tua mũ"],
    "亟": ["jí", "cấp bách"], "迭": ["dié", "thay phiên"], "榫": ["sǔn", "mộng gỗ"], "卯": ["mǎo", "lỗ mộng"],
    "锚": ["máo", "mỏ neo"], "抉": ["jué", "lựa chọn"], "荷": ["hé", "hoa sen / gánh"], "膨": ["péng", "phồng ra"],
    "胀": ["zhàng", "trương phồng"], "弈": ["yì", "đánh cờ"], "炫": ["xuàn", "khoe khoang"], "茗": ["míng", "trà ngon"],
    "婉": ["wǎn", "uyển chuyển"], "疚": ["jiù", "áy náy"], "褪": ["tùn", "cởi / phai"], "茅": ["máo", "cỏ tranh"],
    "庐": ["lú", "lều tranh"], "湛": ["zhàn", "sâu sắc"], "坊": ["fāng", "phường / xưởng"], "募": ["mù", "chiêu mộ"],
    "钵": ["bō", "bát khất thực"], "咋": ["zǎ", "sao thế"], "乍": ["zhà", "chợt / mới"], "曷": ["hé", "hà"],
    "戋": ["jiān", "nhỏ"], "尧": ["Yáo", "Nghiêu"], "戉": ["yuè", "cái búa"], "甹": ["pīng", "bình"],
    "龶": ["zhǔ", "chữ Vương"], "夋": ["qūn", "thuần"], "丩": ["jiū", "câu"], "疌": ["jié", "tiệp"],
    "誩": ["jìng", "cạnh"], "吳": ["Wú", "Ngô"]
  };

  function cleanDictVi(rawVi, maxLen) {
    if (!rawVi) return "";
    let s = String(rawVi).trim();
    // Pick concise first sense(s) before heavy parenthetical clutter
    s = s
      .replace(/\(hình thức kết hợp\)/gi, "")
      .replace(/\(dạng kết hợp\)/gi, "")
      .replace(/\(tiếng Bắc Kinh\)/gi, "")
      .replace(/\(biến thể của [^)]+\)/gi, "")
      .replace(/\(thông tục\)/gi, "")
      .replace(/\(xem [^)]+\)/gi, "")
      .replace(/~/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const parts = s.split(/\s*;\s*/).map(function (p) { return p.trim(); }).filter(Boolean);
    let out = "";
    for (let i = 0; i < parts.length; i++) {
      let cand = parts[i].replace(/^\([^)]{18,}\)\s*/, "").trim();
      if (!cand) cand = parts[i];
      if (!out) out = cand;
      else if (maxLen && (out.length + cand.length + 2) <= maxLen) out += "; " + cand;
      else break;
    }
    if (maxLen && out.length > maxLen) {
      out = out.slice(0, maxLen - 1).trim() + "…";
    }
    return out;
  }

  function registerWordEntry(word, info) {
    if (!word) return;
    const prev = wordMap.get(word);
    if (!prev || (!prev.pos && info.pos) || (!prev.vi && info.vi)) {
      wordMap.set(word, {
        word: word,
        pinyin: (info.pinyin || (prev && prev.pinyin) || "").trim(),
        vi: (info.vi || (prev && prev.vi) || "").trim(),
        hv: (info.hv || (prev && prev.hv) || "").trim(),
        pos: (info.pos || (prev && prev.pos) || "").trim(),
        radical: (info.radical || (prev && prev.radical) || "").trim(),
        level: info.level || (prev && prev.level) || 6
      });
    }
    const chars = Array.from(word);
    if (chars.length === 1) {
      if (!charMap.has(word) || (!charMap.get(word).vi && info.vi)) {
        charMap.set(word, wordMap.get(word));
      }
    } else if (info.pinyin) {
      let pys = String(info.pinyin).trim().split(/\s+/);
      if (pys.length !== chars.length) {
        const matched = String(info.pinyin).match(/[A-Za-züÜāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+[1-5]?/g);
        if (matched && matched.length === chars.length) pys = matched;
      }
      if (pys.length === chars.length) {
        const hvs = String(info.hv || "").trim().split(/\s+/);
        chars.forEach(function (ch, idx) {
          if (!charMap.has(ch)) {
            charMap.set(ch, { word: ch, pinyin: pys[idx], vi: "", hv: hvs[idx] || "" });
          }
          if (word.length >= 2 && word.length <= 4) {
            let bucket = collocsByChar.get(ch);
            if (!bucket) { bucket = []; collocsByChar.set(ch, bucket); }
            if (bucket.length < 36 && !bucket.some(function (b) { return b.word === word; })) {
              bucket.push(wordMap.get(word));
            }
          }
        });
      }
    }
  }

  // Seed core overrides & extra single characters immediately so pages work even before vocab_data.js loads
  Object.keys(CORE_GLOSS_OVERRIDES).forEach(function (w) {
    const o = CORE_GLOSS_OVERRIDES[w];
    registerWordEntry(w, { pinyin: o.py, vi: o.vi, level: 1 });
  });
  Object.keys(EXTRA_CHAR_PINYIN_VI).forEach(function (ch) {
    const pair = EXTRA_CHAR_PINYIN_VI[ch];
    registerWordEntry(ch, { pinyin: pair[0], vi: pair[1], level: 6 });
  });

  function indexLessonVocab(lessonsArr) {
    if (!Array.isArray(lessonsArr)) return;
    lessonsArr.forEach(function (l) {
      const lv = l.level || 1;
      (l.vocab || []).forEach(function (v) {
        if (!v || !v.word) return;
        registerWordEntry(v.word, {
          pinyin: v.pinyin || "",
          vi: v.vi || "",
          hv: v.hv || "",
          pos: v.pos || "",
          level: lv
        });
      });
      (l.charBreakdowns || []).forEach(function (cb) {
        if (cb && cb.char && cb.py && !charMap.has(cb.char)) {
          registerWordEntry(cb.char, { pinyin: cb.py, vi: "", level: lv });
        }
      });
    });
  }

  function indexVocabDict(vocabArr) {
    if (!Array.isArray(vocabArr) || state.dictIndexedCount >= vocabArr.length) return;
    state.dictIndexedCount = vocabArr.length;
    for (let i = 0; i < vocabArr.length; i++) {
      const v = vocabArr[i];
      if (!v || !v.word) continue;
      const ov = CORE_GLOSS_OVERRIDES[v.word];
      registerWordEntry(v.word, {
        pinyin: (ov && ov.py) ? ov.py : (v.pinyin || ""),
        vi: (ov && ov.vi) ? ov.vi : cleanDictVi(v.defVi || "", 56),
        hv: v.hanViet || "",
        pos: v.pos || "",
        radical: v.radical || "",
        level: Number(v.level || 6)
      });
    }
  }

  function buildLessonVocabLookup(lesson) {
    const localMap = new Map();
    if (lesson && Array.isArray(lesson.vocab)) {
      lesson.vocab.forEach(function (v) {
        if (v && v.word) localMap.set(v.word, v);
      });
    }
    return localMap;
  }

  function segmentZhWithGloss(zhStr, lesson) {
    const tokens = [];
    const s = String(zhStr || "");
    if (!s) return tokens;
    const localMap = buildLessonVocabLookup(lesson);
    const chars = Array.from(s);
    let i = 0;

    function lookupToken(cand) {
      if (localMap.has(cand)) {
        const lv = localMap.get(cand);
        return { zh: cand, py: lv.pinyin || "", vi: cleanDictVi(lv.vi || "", 32), isNew: true };
      }
      if (CORE_GLOSS_OVERRIDES[cand]) {
        const ov = CORE_GLOSS_OVERRIDES[cand];
        return { zh: cand, py: ov.py, vi: ov.vi, isNew: false };
      }
      if (wordMap.has(cand)) {
        const wm = wordMap.get(cand);
        return { zh: cand, py: wm.pinyin || "", vi: cleanDictVi(wm.vi || "", 30), isNew: false };
      }
      return null;
    }

    while (i < chars.length) {
      const ch = chars[i];
      if (!/[\u3400-\u9FFF]/.test(ch)) {
        // Group punctuation/ASCII runs silently (skip standalone spaces/punctuation for chips)
        i++;
        continue;
      }
      let matched = null;
      let matchLen = 1;
      const maxLen = Math.min(4, chars.length - i);
      for (let len = maxLen; len >= 2; len--) {
        const slice = chars.slice(i, i + len).join("");
        if (!/^[\u3400-\u9FFF]+$/.test(slice)) continue;
        const hit = lookupToken(slice);
        if (hit) {
          matched = hit;
          matchLen = len;
          break;
        }
      }
      if (!matched) {
        const hit1 = lookupToken(ch);
        if (hit1) matched = hit1;
        else if (charMap.has(ch)) {
          const cm = charMap.get(ch);
          matched = { zh: ch, py: cm.pinyin || "", vi: cleanDictVi(cm.vi || "", 28), isNew: false };
        } else {
          matched = { zh: ch, py: "", vi: "", isNew: false };
        }
      }
      tokens.push(matched);
      i += matchLen;
    }
    return tokens;
  }

  function autoPinyinForZh(zhStr, lesson) {
    const clean = String(zhStr || "")
      .replace(/\([^)]*[A-Za-zÀ-ỹ][^)]*\)/g, "")
      .replace(/（[^）]*[A-Za-zÀ-ỹ][^）]*）/g, "")
      .trim();
    if (!clean || !/[\u3400-\u9FFF]/.test(clean)) return "";
    const toks = segmentZhWithGloss(clean, lesson);
    const pys = toks.map(function (t) { return (t.py || t.zh || "").replace(/\s+/g, ""); }).filter(Boolean);
    return pys.join(" ");
  }

  function hasTonePinyin(str) {
    return /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(String(str || ""));
  }

  function enhanceHtmlCodes(htmlStr, lesson) {
    if (!htmlStr) return "";
    try {
      const wrap = document.createElement("div");
      wrap.innerHTML = htmlStr;
      if (typeof wrap.querySelectorAll !== "function") return htmlStr;

      // Also mark pure Chinese <b>...</b> spans (not inside <code>) so click-to-speak & auto-pinyin work
      const bolds = wrap.querySelectorAll("b");
      bolds.forEach(function (bd) {
        if (bd.closest && bd.closest("code")) return;
        const txt = (bd.textContent || "").trim();
        if (!txt || /[A-Za-zÀ-ỹ]/.test(txt)) return;
        const zhChars = txt.match(/[\u4e00-\u9fff]/g);
        if (zhChars && zhChars.length >= 2) {
          bd.classList.add("sl-zh-code");
          bd.setAttribute("onclick", "window.HskLessonSlidesWorkbook.speakCodeEl(this)");
          bd.setAttribute("title", "Bấm để nghe phát âm");
        }
      });

      wrap.querySelectorAll("code").forEach(function (cd) {
        if (/[\u4e00-\u9fff]/.test(cd.textContent || "")) {
          cd.classList.add("sl-zh-code");
          cd.setAttribute("onclick", "window.HskLessonSlidesWorkbook.speakCodeEl(this)");
          cd.setAttribute("title", "Bấm để nghe phát âm");
        }
      });

      // Second pass: add <span class="auto-py py-text"> for any .sl-zh-code missing nearby Pinyin
      wrap.querySelectorAll(".sl-zh-code").forEach(function (el) {
        const innerTxt = el.textContent || "";
        if (hasTonePinyin(innerTxt)) return;
        let nextTxt = "";
        let cur = el.nextSibling;
        while (cur && nextTxt.length < 22) {
          if (cur.nodeType === 1) {
            if (cur.classList && (cur.classList.contains("auto-py") || cur.classList.contains("sl-zh-code"))) break;
            if (/^(BR|DIV|P|LI|UL|OL|H[1-6])$/.test(cur.tagName || "")) break;
          }
          nextTxt += cur.textContent || "";
          cur = cur.nextSibling;
        }
        if (cur && cur.nodeType === 1 && cur.classList && cur.classList.contains("auto-py")) return;
        const headNext = nextTxt.slice(0, 22);
        if (hasTonePinyin(headNext) || /^\s*\((?:le|de|ma|ne|ba|zhe|a)\)/i.test(headNext)) return;
        const pureZh = innerTxt.replace(/[A-Za-z0-9._\-\/\s]+/g, " ").trim();
        const py = autoPinyinForZh(pureZh, lesson);
        if (py && /[a-züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i.test(py)) {
          const sp = document.createElement("span");
          sp.className = "auto-py py-text";
          sp.textContent = " (" + py + ")";
          if (el.parentNode) {
            el.parentNode.insertBefore(sp, el.nextSibling);
          }
        }
      });

      return wrap.innerHTML;
    } catch (e) {
      return htmlStr;
    }
  }

  function splitLectureSections(htmlStr, lesson) {
    const out = [];
    if (!htmlStr || !String(htmlStr).trim()) return out;
    try {
      const wrap = document.createElement("div");
      wrap.innerHTML = htmlStr;
      let curTitle = "";
      let curNodes = [];

      function flush() {
        if (!curNodes.length && !curTitle) return;
        const tmp = document.createElement("div");
        curNodes.forEach(function (n) { tmp.appendChild(n.cloneNode(true)); });
        const bodyHtml = enhanceHtmlCodes(tmp.innerHTML.trim(), lesson);
        if (bodyHtml || curTitle) {
          out.push({ title: curTitle || "Giảng giải trọng tâm", html: bodyHtml });
        }
        curTitle = "";
        curNodes = [];
      }

      Array.from(wrap.childNodes).forEach(function (node) {
        if (node.nodeType === 1 && node.tagName === "H3") {
          flush();
          curTitle = (node.textContent || "").trim();
        } else {
          if (node.nodeType === 3 && !String(node.textContent || "").trim()) return;
          curNodes.push(node);
        }
      });
      flush();
    } catch (e) {
      out.push({ title: "Giảng giải chi tiết", html: enhanceHtmlCodes(htmlStr, lesson) });
    }
    return out;
  }

  function scrollToSec(secId) {
    const el = document.getElementById(secId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function findCollocationsForWord(wordObj, lesson) {
    if (wordObj && Array.isArray(wordObj.collocations) && wordObj.collocations.length) {
      return wordObj.collocations.slice(0, 4);
    }
    const w = (wordObj && wordObj.word) || "";
    if (!w) return [];
    const results = [];
    const seen = new Set([w]);
    const maxLv = Math.max(2, Number((lesson && lesson.level) || 1) + 1);

    // 1. Check same lesson's vocab for compound matches containing w
    ((lesson && lesson.vocab) || []).forEach(function (lv) {
      if (results.length >= 3 || !lv || !lv.word || seen.has(lv.word)) return;
      if (lv.word.includes(w) && lv.word.length <= 4) {
        seen.add(lv.word);
        results.push({ zh: lv.word, py: lv.pinyin || "", vi: cleanDictVi(lv.vi || "", 26) });
      }
    });

    // 2. Check dictionary bucket for single-char or short words
    const targetChars = Array.from(w);
    const seedChar = targetChars[0];
    const bucket = collocsByChar.get(seedChar) || [];
    for (let i = 0; i < bucket.length && results.length < 3; i++) {
      const b = bucket[i];
      if (!b || !b.word || seen.has(b.word) || b.level > maxLv) continue;
      if (w.length === 1 || b.word.includes(w)) {
        seen.add(b.word);
        results.push({ zh: b.word, py: b.pinyin || "", vi: cleanDictVi(b.vi || "", 26) });
      }
    }
    return results.slice(0, 3);
  }

  function findExampleForWord(wordObj, lesson) {
    if (wordObj && wordObj.ex && wordObj.ex.zh && wordObj.ex.vi) {
      return wordObj.ex;
    }
    const w = (wordObj && wordObj.word) || "";
    if (!w || !lesson) return null;
    const dlgs = lesson.dialogue || [];
    for (let i = 0; i < dlgs.length; i++) {
      if (dlgs[i] && dlgs[i].zh && dlgs[i].zh.includes(w)) {
        return { zh: dlgs[i].zh, py: dlgs[i].py || autoPinyinForZh(dlgs[i].zh, lesson), vi: dlgs[i].vi || "" };
      }
    }
    const rws = lesson.rightWrong || [];
    for (let i = 0; i < rws.length; i++) {
      const rz = extractZh((rws[i] && rws[i].right) || "");
      if (rz && rz.includes(w)) {
        return { zh: rz, py: autoPinyinForZh(rz, lesson), vi: rws[i].note || "" };
      }
    }
    return null;
  }

  function highlightZhMatch(text, word, escFn) {
    const s = String(text || "");
    const w = String(word || "");
    if (!w || !s.includes(w)) return escFn(s);
    const parts = s.split(w);
    return parts.map(escFn).join("<mark>" + escFn(w) + "</mark>");
  }

  function renderRichVocabSection(lesson, helpers) {
    injectPageAndWorkbookStyles();
    if (helpers) state.lastHelpers = helpers;
    const esc = (helpers && helpers.esc) || defaultEsc;
    const escJsAttr = (helpers && helpers.escJsAttr) || defaultEsc;
    const list = (lesson && lesson.vocab) || [];
    const breakdowns = (lesson && lesson.charBreakdowns) || [];

    const barHtml = list.length ? `<div class="sound-tip-box" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
      <span>🀄 <b>Giảng giải ${list.length} từ mới trọng tâm</b> — kèm Từ loại, Chiết tự, Cụm ghép &amp; Ví dụ áp dụng (bấm 🔊 nghe · ✍️ tập viết)</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button class="ctrl-btn on" onclick="launchLessonSrs('${escJsAttr(lesson.id)}')">✨ Ôn SRS bài này (${list.length} từ)</button>
        <button class="ctrl-btn" onclick="launchLessonShooter('${escJsAttr(lesson.id)}')">🚀 Chơi Game Bắn từ (${list.length} từ)</button>
      </div>
    </div>` : "";

    const cardsHtml = list.map(function (v, idx) {
      const wm = wordMap.get(v.word) || {};
      const pos = v.pos || wm.pos || "";
      const radChar = Array.from(v.word || "")[0];
      const rad = v.radical || wm.radical || (charMap.get(radChar) && charMap.get(radChar).radical) || "";
      const extraDictVi = wm.vi && cleanDictVi(wm.vi, 70);
      const vViClean = String(v.vi || "").trim();
      const showExtraNote = v.usageNote
        ? v.usageNote
        : (extraDictVi && !vViClean.toLowerCase().includes(extraDictVi.slice(0, 12).toLowerCase()) ? extraDictVi : "");

      const matchedCb = breakdowns.find(function (cb) {
        return cb && cb.char && v.word && (v.word.includes(cb.char) || cb.char.includes(v.word));
      });
      const collocs = findCollocationsForWord(v, lesson);
      const ex = findExampleForWord(v, lesson);

      const wUrl = "../writing/index.html?char=" + encodeURIComponent(v.word || "") +
        "&py=" + encodeURIComponent(v.pinyin || "") +
        "&vi=" + encodeURIComponent(vViClean.slice(0, 80)) +
        "&from=lessons";

      return `<article class="v-teach-card">
        <div class="v-teach-head">
          <div style="min-width:0;">
            <div class="v-teach-word-row">
              <span class="v-teach-zh">${esc(v.word)}</span>
              <span class="v-teach-py py-text">${esc(v.pinyin)}</span>
            </div>
            <div class="v-teach-tags">
              ${pos ? `<span class="v-tag pos">${esc(pos)}</span>` : ""}
              ${v.hv ? `<span class="v-tag hv">HV: ${esc(v.hv)}</span>` : ""}
              ${rad ? `<span class="v-tag">Bộ: ${esc(rad)}</span>` : ""}
            </div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
            <a class="spk-btn" href="${wUrl}" title="Tập viết &amp; chấm nét chữ này">✍️</a>
            <button class="spk-btn" onclick="speakVocab(${idx})" title="Nghe phát âm">🔊</button>
          </div>
        </div>

        <div class="v-teach-meaning"><b>Nghĩa:</b> <span class="vi-text">${esc(vViClean)}</span></div>
        ${showExtraNote ? `<div class="v-teach-note vi-text">💡 <b>Mở rộng:</b> ${esc(showExtraNote)}</div>` : ""}
        ${matchedCb ? `<div class="v-teach-memo">🧩 <b>Nhớ chữ ${esc(matchedCb.char)}:</b> ${esc(matchedCb.parts)} — ${esc(matchedCb.mnemonic)}</div>` : ""}

        ${collocs.length ? `
          <div class="v-colloc-row">
            <span class="v-colloc-lbl">🔗 Cụm ghép:</span>
            ${collocs.map(function (c) {
              return `<button type="button" class="v-colloc-btn" onclick="window.HskLessonSlidesWorkbook.speakRaw('${escJsAttr(c.zh)}')" title="Bấm để nghe">
                <span>${esc(c.zh)}</span>
                ${c.py ? `<span class="py-text">${esc(c.py)}</span>` : ""}
                ${c.vi ? `<span class="vi-text">· ${esc(c.vi)}</span>` : ""}
              </button>`;
            }).join("")}
          </div>` : ""}

        ${ex ? `
          <div class="v-ex-box">
            <div style="min-width:0;">
              <div class="v-ex-zh">💬 ${highlightZhMatch(ex.zh, v.word, esc)}</div>
              ${ex.py ? `<div class="v-ex-py py-text">${esc(ex.py)}</div>` : ""}
              ${ex.vi ? `<div class="v-ex-vi vi-text">${esc(ex.vi)}</div>` : ""}
            </div>
            <button type="button" class="spk-btn" onclick="window.HskLessonSlidesWorkbook.speakRaw('${escJsAttr(ex.zh)}')" title="Nghe câu ví dụ">🔊</button>
          </div>` : ""}
      </article>`;
    }).join("");

    return barHtml + `<div class="v-teach-grid">${cardsHtml}</div>`;
  }

  function renderWbwChipsHtml(zhText, lesson, helpers) {
    const esc = (helpers && helpers.esc) || defaultEsc;
    const escJsAttr = (helpers && helpers.escJsAttr) || defaultEsc;
    const toks = segmentZhWithGloss(zhText, lesson);
    if (!toks.length) return "";
    return toks.map(function (tk) {
      return `<button type="button" class="wbw-chip ${tk.isNew ? "is-new" : ""}" onclick="window.HskLessonSlidesWorkbook.tapZhWord(event, '${escJsAttr(tk.zh)}')" title="Bấm để nghe, tra nhanh &amp; tập viết">
        <span class="wbw-zh">${esc(tk.zh)}</span>
        ${tk.py ? `<span class="wbw-py py-text">${esc(tk.py)}</span>` : ""}
        ${tk.vi ? `<span class="wbw-vi vi-text">${esc(tk.vi)}</span>` : ""}
      </button>`;
    }).join("");
  }

  function renderTappableZhHtml(zhText, lesson, helpers) {
    const esc = (helpers && helpers.esc) || defaultEsc;
    const escJsAttr = (helpers && helpers.escJsAttr) || defaultEsc;
    const s = String(zhText || "");
    if (!s) return "";
    const chars = Array.from(s);
    const segs = segmentZhWithGloss(s, lesson);
    let html = "";
    let pos = 0;
    for (let si = 0; si < segs.length; si++) {
      const tok = segs[si];
      let nonZh = "";
      while (pos < chars.length && !/[\u3400-\u9FFF]/.test(chars[pos])) {
        nonZh += chars[pos];
        pos++;
      }
      if (nonZh) html += esc(nonZh);
      const tChars = Array.from(tok.zh || "");
      const slice = chars.slice(pos, pos + tChars.length).join("");
      if (slice === tok.zh && tChars.length) {
        pos += tChars.length;
        html += `<span class="zh-tap" onclick="window.HskLessonSlidesWorkbook.tapZhWord(event, '${escJsAttr(tok.zh)}')" title="Chạm tra từ &amp; tập viết">${esc(tok.zh)}</span>`;
      } else {
        html += esc(tok.zh);
      }
    }
    if (pos < chars.length) html += esc(chars.slice(pos).join(""));
    return html;
  }

  function lookupWordInfo(zhTerm, lesson) {
    const w = String(zhTerm || "").trim();
    if (!w) return null;
    const localMap = buildLessonVocabLookup(lesson);
    const lv = localMap.get(w) || null;
    const ov = CORE_GLOSS_OVERRIDES[w] || null;
    const wm = wordMap.get(w) || null;
    const cm = charMap.get(w) || null;
    const firstCh = Array.from(w)[0] || "";
    const firstCm = charMap.get(firstCh) || null;

    const py = (lv && lv.pinyin) || (ov && ov.py) || (wm && wm.pinyin) || (cm && cm.pinyin) || autoPinyinForZh(w, lesson) || "";
    const vi = (lv && lv.vi) || (ov && ov.vi) || (wm && wm.vi) || (cm && cm.vi) || "";
    const hv = (lv && lv.hv) || (wm && wm.hv) || (cm && cm.hv) || "";
    const pos = (lv && lv.pos) || (wm && wm.pos) || (cm && cm.pos) || "";
    const radical = (lv && lv.radical) || (wm && wm.radical) || (cm && cm.radical) || (firstCm && firstCm.radical) || "";
    const level = (lv && Number(lesson && lesson.level)) || (wm && wm.level) || (cm && cm.level) || 0;

    const chars = Array.from(w).filter(function (c) { return /[\u3400-\u9FFF]/.test(c); });
    const charsBreakdown = chars.length > 1 ? chars.map(function (c) {
      const ci = charMap.get(c) || wordMap.get(c) || CORE_GLOSS_OVERRIDES[c] || {};
      return {
        ch: c,
        py: ci.pinyin || ci.py || "",
        hv: ci.hv || "",
        vi: cleanDictVi(ci.vi || "", 34)
      };
    }) : [];

    return { word: w, py: py, hv: hv, pos: pos, radical: radical, level: level, vi: vi, charsBreakdown: charsBreakdown };
  }

  function ensureWordPopupDom() {
    let bd = document.getElementById("lpWordPopupBackdrop");
    let card = document.getElementById("lpWordPopup");
    if (!bd) {
      bd = document.createElement("div");
      bd.id = "lpWordPopupBackdrop";
      bd.className = "lp-wpop-backdrop";
      bd.onclick = closeWordPopup;
      document.body.appendChild(bd);
    }
    if (!card) {
      card = document.createElement("div");
      card.id = "lpWordPopup";
      card.className = "lp-wpop-card";
      card.setAttribute("role", "dialog");
      card.setAttribute("aria-label", "Tra nhanh từ vựng Hán tự");
      document.body.appendChild(card);
    }
    if (!global._lpWpopEscBound) {
      global._lpWpopEscBound = true;
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeWordPopup();
      });
    }
    return { bd: bd, card: card };
  }

  function closeWordPopup() {
    const bd = document.getElementById("lpWordPopupBackdrop");
    const card = document.getElementById("lpWordPopup");
    if (bd) bd.classList.remove("show");
    if (card) card.classList.remove("show");
  }

  function openWordPopup(zhTerm, customInfo) {
    injectPageAndWorkbookStyles();
    const esc = (state.lastHelpers && state.lastHelpers.esc) || defaultEsc;
    const escJsAttr = (state.lastHelpers && state.lastHelpers.escJsAttr) || defaultEsc;
    const curLesson = state.lastHelpers && typeof state.lastHelpers.getCurrentLesson === "function"
      ? state.lastHelpers.getCurrentLesson() : null;
    const base = lookupWordInfo(zhTerm, curLesson) || { word: zhTerm, py: "", hv: "", pos: "", radical: "", level: 0, vi: "", charsBreakdown: [] };
    const info = Object.assign({}, base, customInfo || {});
    if (!info.word) return;

    const wUrl = "../writing/index.html?char=" + encodeURIComponent(info.word) +
      "&py=" + encodeURIComponent(info.py || "") +
      "&vi=" + encodeURIComponent(String(info.vi || "").slice(0, 80)) +
      "&from=lessons";

    const dom = ensureWordPopupDom();
    dom.card.innerHTML = `
      <div class="lp-wpop-top">
        <div style="min-width:0;">
          <div style="display:flex;align-items:baseline;flex-wrap:wrap;gap:4px;">
            <span class="lp-wpop-zh">${esc(info.word)}</span>
            ${info.py ? `<span class="lp-wpop-py">${esc(info.py)}</span>` : ""}
          </div>
          <div class="lp-wpop-tags">
            ${info.level ? `<span class="v-tag pos">HSK ${esc(info.level)}</span>` : ""}
            ${info.pos ? `<span class="v-tag pos">${esc(info.pos)}</span>` : ""}
            ${info.hv ? `<span class="v-tag hv">HV: ${esc(info.hv)}</span>` : ""}
            ${info.radical ? `<span class="v-tag">Bộ: ${esc(info.radical)}</span>` : ""}
          </div>
        </div>
        <button type="button" class="lp-wpop-close" onclick="window.HskLessonSlidesWorkbook.closeWordPopup()" aria-label="Đóng">✕</button>
      </div>
      <div class="lp-wpop-vi">
        <b>Nghĩa:</b> ${info.vi ? esc(info.vi) : '<span style="color:var(--muted);">Chưa có nghĩa tóm tắt riêng — bạn có thể bấm Tập viết để xem nét bút thuận.</span>'}
      </div>
      ${info.charsBreakdown && info.charsBreakdown.length ? `
        <div class="lp-wpop-chars">
          <span style="font-size:11.5px;color:var(--muted);font-weight:800;align-self:center;">Từng chữ:</span>
          ${info.charsBreakdown.map(function (cb) {
            return `<button type="button" class="lp-wpop-char-btn" onclick="window.HskLessonSlidesWorkbook.openWordPopup('${escJsAttr(cb.ch)}');window.HskLessonSlidesWorkbook.speakRaw('${escJsAttr(cb.ch)}')">
              <b>${esc(cb.ch)}</b> ${cb.py ? esc(cb.py) : ""}${cb.hv ? " · " + esc(cb.hv) : ""}${cb.vi ? " — " + esc(cb.vi) : ""}
            </button>`;
          }).join("")}
        </div>` : ""}
      <div class="lp-wpop-actions">
        <button type="button" class="lp-wpop-btn" onclick="window.HskLessonSlidesWorkbook.speakRaw('${escJsAttr(info.word)}', '${escJsAttr(info.py || "")}')">🔊 Nghe phát âm</button>
        <a class="lp-wpop-btn primary" href="${wUrl}">✍️ Tập viết chữ này</a>
      </div>
    `;
    dom.bd.classList.add("show");
    dom.card.classList.add("show");
  }

  function tapZhWord(ev, zhTerm) {
    if (ev && typeof ev.stopPropagation === "function") ev.stopPropagation();
    try {
      const sel = window.getSelection ? window.getSelection().toString().trim() : "";
      if (sel) return;
    } catch (e) {}
    const curLesson = state.lastHelpers && typeof state.lastHelpers.getCurrentLesson === "function"
      ? state.lastHelpers.getCurrentLesson() : null;
    const info = lookupWordInfo(zhTerm, curLesson);
    if (info && state.lastHelpers && typeof state.lastHelpers.speakZh === "function") {
      state.lastHelpers.speakZh(info.word, info.py ? { pinyin: info.py } : undefined);
    }
    openWordPopup(zhTerm, info);
  }

  function renderRichGrammarSection(lesson, helpers) {
    injectPageAndWorkbookStyles();
    if (helpers) state.lastHelpers = helpers;
    const esc = (helpers && helpers.esc) || defaultEsc;
    const grams = (lesson && lesson.grammar) || [];
    if (!grams.length) return "";

    return grams.map(function (g) {
      let body = String(g.body || "");
      let formula = g.formula ? String(g.formula) : "";
      if (!formula) {
        const fm = body.match(/<b>Công thức:?<\/b>\s*<code>([^<]+)<\/code>|Công thức:\s*<code>([^<]+)<\/code>/i);
        if (fm) {
          formula = fm[1] || fm[2] || "";
        }
      }
      const enhBody = enhanceHtmlCodes(body, lesson);

      // Extract a clean sample Chinese sentence (>= 4 chars) to show word-by-word breakdown
      let sampleSentence = "";
      const boldSent = body.match(/<b>([^<]*[\u4e00-\u9fff]{4,}[^<]*)<\/b>/);
      if (boldSent && !/[A-Za-zÀ-ỹ]/.test(boldSent[1])) {
        sampleSentence = boldSent[1].replace(/[：:]/g, "").trim();
      } else {
        const codeMatches = [...body.matchAll(/<code>([^<]+)<\/code>/g)];
        for (let ci = 0; ci < codeMatches.length; ci++) {
          const cz = extractZh(codeMatches[ci][1]);
          if (cz && Array.from(cz).length >= 4 && !cz.includes("Chủ ngữ") && !cz.includes("Động từ")) {
            sampleSentence = cz;
            break;
          }
        }
      }
      const chipsHtml = (state.wbwEnabled && sampleSentence) ? renderWbwChipsHtml(sampleSentence, lesson, helpers) : "";

      return `<div class="gram-card">
        <h4>📐 ${esc(g.title)}</h4>
        ${formula ? `<div class="gram-formula-box">🧩 Công thức: ${esc(formula)}</div>` : ""}
        <div>${enhBody}</div>
        ${chipsHtml ? `
          <div class="gram-wbw-box">
            <div class="gram-wbw-lbl">🪜 Mổ xẻ từng từ câu mẫu (bấm từng thẻ để nghe):</div>
            <div class="dlg-wbw" style="border-top:none;padding-top:0;">${chipsHtml}</div>
          </div>` : ""}
      </div>`;
    }).join("");
  }

  function renderRichDialogueSection(lesson, helpers) {
    injectPageAndWorkbookStyles();
    if (helpers) state.lastHelpers = helpers;
    const esc = (helpers && helpers.esc) || defaultEsc;
    const dlgs = (lesson && lesson.dialogue) || [];
    if (!dlgs.length) return "";

    let html = `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <button class="ctrl-btn on" onclick="speakAllDialogue()">▶️ Nghe cả bài khóa</button>
        <span class="zh-tap-hint">💡 Chạm trực tiếp vào chữ Hán để tra nhanh &amp; tập viết</span>
      </div>
      <button class="ctrl-btn ${state.wbwEnabled ? "on" : ""}" onclick="window.HskLessonSlidesWorkbook.toggleWbw()">🧩 Mổ xẻ từng từ: ${state.wbwEnabled ? "Hiện" : "Ẩn"}</button>
    </div>`;

    let lastScene = "";
    html += dlgs.map(function (d, idx) {
      let sceneHeader = "";
      const spk = String(d.speaker || "");
      const scMatch = spk.match(/^([^—\-:]+?)\s*[—\-]\s*(.+)$/);
      let dispSpeaker = spk;
      if (scMatch) {
        const scName = scMatch[1].trim();
        dispSpeaker = scMatch[2].trim();
        if (scName !== lastScene) {
          lastScene = scName;
          sceneHeader = `<div class="dlg-scene-hdr">🎬 ${esc(scName)}</div>`;
        }
      }
      const wbwHtml = state.wbwEnabled ? renderWbwChipsHtml(d.zh || "", lesson, helpers) : "";
      const tapZhHtml = renderTappableZhHtml(d.zh || "", lesson, helpers);
      return `${sceneHeader}<div class="dlg-item dlg-item-rich">
        <div class="dlg-top-row">
          <div style="min-width:0;">
            <div class="dlg-spk">${esc(dispSpeaker)}</div>
            <div class="dlg-zh">${tapZhHtml}</div>
            <div class="dlg-py py-text">${esc(d.py || autoPinyinForZh(d.zh, lesson))}</div>
            <div class="dlg-vi vi-text">${esc(d.vi)}</div>
          </div>
          <button class="spk-btn" onclick="speakDialogue(${idx})" title="Nghe câu này">🔊</button>
        </div>
        ${wbwHtml ? `<div class="dlg-wbw">${wbwHtml}</div>` : ""}
      </div>`;
    }).join("");
    return html;
  }

  function renderRichRightWrongSection(lesson, helpers) {
    injectPageAndWorkbookStyles();
    if (helpers) state.lastHelpers = helpers;
    const esc = (helpers && helpers.esc) || defaultEsc;
    const list = (lesson && lesson.rightWrong) || [];
    if (!list.length) return "";
    return `<div class="rw-list">${list.map(function (rw, idx) {
      const rightPy = hasTonePinyin(rw.right) || hasTonePinyin(rw.note)
        ? ""
        : autoPinyinForZh(extractZh(rw.right), lesson);
      return `<div class="rw-card">
        <div class="rw-pair">
          <div class="rw-box wrong">
            <div>
              <span class="rw-lbl">❌ Hay sai</span>
              <div class="rw-text">${esc(rw.wrong)}</div>
            </div>
          </div>
          <div class="rw-box right">
            <div>
              <span class="rw-lbl">✅ Nói chuẩn</span>
              <div class="rw-text">${esc(rw.right)}</div>
              ${rightPy ? `<div class="rw-py py-text">${esc(rightPy)}</div>` : ""}
            </div>
            <button class="spk-btn" onclick="speakRightWrong(${idx})" title="Nghe câu nói chuẩn">🔊</button>
          </div>
        </div>
        ${rw.note ? `<div class="rw-note">📌 <b>Lưu ý:</b> ${esc(rw.note)}</div>` : ""}
      </div>`;
    }).join("")}</div>`;
  }

  function toggleWbw() {
    state.wbwEnabled = !state.wbwEnabled;
    refreshStage();
  }

  /* ================== INLINE SVG ICONS (STROKE 1.8) ================== */
  const WB_SVG = {
    check: '<polyline points="20 6 9 17 4 12"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>',
    refresh: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    split: '<path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/>',
    keyboard: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M7 16h10"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z"/>',
    play: '<polygon points="6 4 20 12 6 20 6 4"/>',
    circle: '<circle cx="12" cy="12" r="9"/>'
  };
  function wbIcon(name, size) {
    const sz = size || 14;
    return `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${WB_SVG[name] || WB_SVG.book}</svg>`;
  }

  /* ================== CONFUSABLE WORDS & POLYPHONES (辨析) ENGINE ================== */
  const CONFUSABLE_BIANXI_DB = [
    // HSK 1
    {
      id: "bx_renshi_zhidao", level: 1, type: "pair", title: "认识 vs 知道",
      triggers: ["认识", "知道"],
      items: [
        { zh: "认识", py: "rènshi", pos: "Động từ", core: "Quen biết người, nhận mặt chữ hoặc nơi chốn qua tiếp xúc trực tiếp.", pattern: "认识 + Người / Chữ Hán / Đường đi", exZh: "我认识这位汉语老师。", exPy: "Wǒ rènshi zhè wèi Hànyǔ lǎoshī.", exVi: "Tôi quen biết thầy giáo tiếng Hán này." },
        { zh: "知道", py: "zhīdào", pos: "Động từ", core: "Biết thông tin, sự thật, lý do hoặc cả một mệnh đề.", pattern: "知道 + Sự việc / Mệnh đề", exZh: "我知道他今天不来上课。", exPy: "Wǒ zhīdào tā jīntiān bù lái shàngkè.", exVi: "Tôi biết hôm nay anh ấy không đến lớp." }
      ],
      tip: "Gặp người hoặc mặt chữ dùng 认识; biết một tin tức hay cả câu chuyện dùng 知道 (không nói 认识他不来)."
    },
    {
      id: "bx_er_liang", level: 1, type: "pair", title: "二 vs 两",
      triggers: ["二", "两"],
      items: [
        { zh: "二", py: "èr", pos: "Số từ", core: "Dùng khi đếm số, số thứ tự, ngày tháng, số điện thoại, số thập phân.", pattern: "一二三 / 第二 / 二月 / 十二", exZh: "今天是二月十二号。", exPy: "Jīntiān shì èr yuè shí'èr hào.", exVi: "Hôm nay là ngày 12 tháng 2." },
        { zh: "两", py: "liǎng", pos: "Số từ", core: "Dùng trước lượng từ để chỉ số lượng 2 đơn vị.", pattern: "两 + Lượng từ + Danh từ", exZh: "我买了两本书和两杯咖啡。", exPy: "Wǒ mǎi le liǎng běn shū hé liǎng bēi kāfēi.", exVi: "Tôi đã mua hai quyển sách và hai cốc cà phê." }
      ],
      tip: "Trước lượng từ (个, 本, 杯, 个人) dùng 两; đếm thứ tự (第二, 二楼, 二月) dùng 二."
    },
    {
      id: "bx_neng_hui_keyi", level: 1, type: "pair", title: "会 vs 能 vs 可以",
      triggers: ["会", "能", "可以"],
      items: [
        { zh: "会", py: "huì", pos: "Động từ năng nguyện", core: "Biết làm một kỹ năng nhờ học tập/rèn luyện.", pattern: "会 + Kỹ năng (说汉语 / 游泳 / 开车)", exZh: "我会说一点儿汉语。", exPy: "Wǒ huì shuō yìdiǎnr Hànyǔ.", exVi: "Tôi biết nói một chút tiếng Hán." },
        { zh: "能 / 可以", py: "néng / kěyǐ", pos: "Động từ năng nguyện", core: "能 nhấn khả năng/điều kiện khách quan; 可以 nhấn sự cho phép lịch sự.", pattern: "不能 + V (cấm) / 可以 + V + 吗？(xin phép)", exZh: "这里可以拍照吗？", exPy: "Zhèlǐ kěyǐ pāizhào ma?", exVi: "Ở đây có được phép chụp ảnh không?" }
      ],
      tip: "Học mới biết → 会; có đủ sức/điều kiện → 能; xin phép/được phép → 可以."
    },
    // HSK 2
    {
      id: "bx_bang_ti", level: 2, type: "pair", title: "帮 vs 替",
      triggers: ["帮", "替", "帮助"],
      items: [
        { zh: "帮", py: "bāng", pos: "Động từ / Giới từ", core: "Giúp đỡ ai làm việc gì (người đó có thể cùng làm hoặc nhận sự hỗ trợ).", pattern: "帮 + A + Động từ", exZh: "请你帮我拿一下行李。", exPy: "Qǐng nǐ bāng wǒ ná yíxià xíngli.", exVi: "Phiền bạn giúp tôi cầm hành lý một chút." },
        { zh: "替", py: "tì", pos: "Giới từ / Động từ", core: "Làm thay hoàn toàn vị trí của ai khi họ không thể tự làm.", pattern: "替 + A + Động từ (thay mặt)", exZh: "他生病了，我替他去开会。", exPy: "Tā shēngbìng le, wǒ tì tā qù kāihuì.", exVi: "Anh ấy ốm rồi, tôi đi họp thay anh ấy." }
      ],
      tip: "帮 = trợ giúp; 替 = thay thế hoàn toàn (A vắng mặt hoặc không tự làm được)."
    },
    {
      id: "bx_yidianr_youdianr", level: 2, type: "pair", title: "一点儿 vs 有点儿",
      triggers: ["一点儿", "有点儿"],
      items: [
        { zh: "一点儿", py: "yìdiǎnr", pos: "Số lượng từ", core: "Đứng SAU tính từ/động từ để giảm nhẹ hoặc so sánh, sắc thái trung tính/tích cực.", pattern: "Động từ/Tính từ + 一点儿", exZh: "请你说慢一点儿。", exPy: "Qǐng nǐ shuō màn yìdiǎnr.", exVi: "Xin bạn nói chậm lại một chút." },
        { zh: "有点儿", py: "yǒudiǎnr", pos: "Phó từ", core: "Đứng TRƯỚC tính từ/động từ, thường mang sắc thái phàn nàn, chưa hài lòng.", pattern: "有点儿 + Tính từ (không như ý)", exZh: "这件衣服有点儿贵。", exPy: "Zhè jiàn yīfu yǒudiǎnr guì.", exVi: "Chiếc áo này hơi đắt." }
      ],
      tip: "Nhớ vị trí: 有点儿 đứng TRƯỚC tính từ (hơi chê); 一点儿 đứng SAU tính từ/động từ (chút ít)."
    },
    {
      id: "bx_poly_hai_huan", level: 2, type: "poly", title: "Từ đa âm: 还 (hái / huán)",
      triggers: ["还", "还是", "归还"],
      items: [
        { zh: "还", py: "hái", pos: "Phó từ", core: "Vẫn còn, hơn nữa, cũng tạm được.", pattern: "还 + Động từ / Tính từ", exZh: "雨还在下，我们等一会儿吧。", exPy: "Yǔ hái zài xià, wǒmen děng yíhuìr ba.", exVi: "Trời vẫn đang mưa, chúng ta đợi một lát nhé." },
        { zh: "还", py: "huán", pos: "Động từ", core: "Trả lại đồ đã mượn (tiền, sách…).", pattern: "把 + Vật + 还给 + Người", exZh: "明天我要把书还给图书馆。", exPy: "Míngtiān wǒ yào bǎ shū huán gěi túshūguǎn.", exVi: "Ngày mai tôi phải trả sách cho thư viện." }
      ],
      tip: "Mang nghĩa 'vẫn/còn' đọc hái; mang nghĩa 'hoàn trả' (Hán Việt: hoàn) đọc huán."
    },
    // HSK 3
    {
      id: "bx_gangcai_gang", level: 3, type: "pair", title: "刚才 vs 刚",
      triggers: ["刚才", "刚"],
      items: [
        { zh: "刚才", py: "gāngcái", pos: "Danh từ chỉ thời gian", core: "Vừa nãy (cách hiện tại vài phút). Đứng trước hoặc sau chủ ngữ, đi được với phủ định 不/没.", pattern: "刚才 + S + V / S + 刚才 + 没 + V", exZh: "刚才谁给你打电话了？", exPy: "Gāngcái shéi gěi nǐ dǎ diànhuà le?", exVi: "Vừa nãy ai gọi điện cho bạn thế?" },
        { zh: "刚", py: "gāng", pos: "Phó từ", core: "Vừa mới (cảm giác ngắn theo chủ quan, có thể là vài ngày/tháng). Chỉ đứng sau chủ ngữ, không thêm 没 ngay sau.", pattern: "S + 刚 + V (+ Thời lượng)", exZh: "我刚来中国两个月。", exPy: "Wǒ gāng lái Zhōngguó liǎng ge yuè.", exVi: "Tôi mới đến Trung Quốc hai tháng." }
      ],
      tip: "刚才 là danh từ (đứng đầu câu được, chỉ vài phút trước); 刚 là phó từ (chỉ đứng sau chủ ngữ, theo sau có thể có thời lượng)."
    },
    {
      id: "bx_canjia_canguan", level: 3, type: "pair", title: "参观 vs 参加",
      triggers: ["参观", "参加"],
      items: [
        { zh: "参观", py: "cānguān", pos: "Động từ", core: "Tham quan địa điểm thực tế để xem, tìm hiểu.", pattern: "参观 + Địa điểm (博物馆 / 工厂 / 学校)", exZh: "周末我们去参观历史博物馆。", exPy: "Zhōumò wǒmen qù cānguān lìshǐ bówùguǎn.", exVi: "Cuối tuần chúng tôi đi tham quan bảo tàng lịch sử." },
        { zh: "参加", py: "cānjiā", pos: "Động từ", core: "Tham gia hoạt động, cuộc thi, buổi họp, tổ chức với vai trò thành viên.", pattern: "参加 + Hoạt động (比赛 / 会议 / 活动 / 考试)", exZh: "她报名参加了汉语演讲比赛。", exPy: "Tā bàomíng cānjiā le Hànyǔ yǎnjiǎng bǐsài.", exVi: "Cô ấy đã đăng ký tham gia cuộc thi hùng biện tiếng Hán." }
      ],
      tip: "Đi xem nơi chốn (bảo tàng, nhà máy) → 参观 (quan = nhìn xem); hòa mình vào hoạt động/cuộc thi → 参加 (gia = gia nhập)."
    },
    {
      id: "bx_juede_yiwei", level: 3, type: "pair", title: "觉得 vs 以为",
      triggers: ["觉得", "以为"],
      items: [
        { zh: "觉得", py: "juéde", pos: "Động từ", core: "Cảm thấy, cho rằng (ý kiến cá nhân trung tính, có thể đúng hoặc sai).", pattern: "S + 觉得 + Nhận định", exZh: "我觉得这家餐厅的菜很好吃。", exPy: "Wǒ juéde zhè jiā cāntīng de cài hěn hǎochī.", exVi: "Tôi thấy món ăn ở nhà hàng này rất ngon." },
        { zh: "以为", py: "yǐwéi", pos: "Động từ", core: "Tưởng rằng (suy đoán trước đó TRÁI với sự thật thực tế).", pattern: "我以为……，其实/没想到……", exZh: "我以为今天不上课，原来还要考试。", exPy: "Wǒ yǐwéi jīntiān bú shàngkè, yuánlái hái yào kǎoshì.", exVi: "Tôi tưởng hôm nay nghỉ học, hóa ra vẫn phải thi." }
      ],
      tip: "Nêu cảm nhận bình thường dùng 觉得; hễ 'tưởng nhầm' khác sự thật dùng 以为."
    },
    {
      id: "bx_poly_chang_zhang", level: 3, type: "poly", title: "Từ đa âm: 长 (cháng / zhǎng)",
      triggers: ["长", "长大", "时间长", "校长"],
      items: [
        { zh: "长", py: "cháng", pos: "Tính từ", core: "Dài (về độ dài không gian hoặc thời gian).", pattern: "很长 / 长城 / 长大衣", exZh: "这条河非常长。", exPy: "Zhè tiáo hé fēicháng cháng.", exVi: "Con sông này vô cùng dài." },
        { zh: "长", py: "zhǎng", pos: "Động từ / Danh từ", core: "Lớn lên, mọc ra; hoặc người đứng đầu (trưởng).", pattern: "长大 / 校长 / 班长", exZh: "小树很快长高了。", exPy: "Xiǎoshù hěn kuài zhǎng gāo le.", exVi: "Cây non lớn cao lên rất nhanh." }
      ],
      tip: "Dài (trường) đọc cháng; lớn lên / chức trưởng đọc zhǎng."
    },
    {
      id: "bx_poly_jue_jiao", level: 3, type: "poly", title: "Từ đa âm: 觉 (jué / jiào)",
      triggers: ["觉得", "睡觉", "感觉", "午觉"],
      items: [
        { zh: "觉", py: "jué", pos: "Động từ", core: "Cảm giác, nhận thức, tỉnh ngộ.", pattern: "觉得 / 感觉 / 觉悟", exZh: "你觉得这个方法怎么样？", exPy: "Nǐ juéde zhège fāngfǎ zěnmeyàng?", exVi: "Bạn thấy phương pháp này thế nào?" },
        { zh: "觉", py: "jiào", pos: "Danh từ", core: "Giấc ngủ.", pattern: "睡觉 / 睡午觉 / 睡懒觉", exZh: "中午我习惯睡半小时午觉。", exPy: "Zhōngwǔ wǒ xíguàn shuì bàn xiǎoshí wǔjiào.", exVi: "Buổi trưa tôi quen ngủ trưa nửa tiếng." }
      ],
      tip: "Chỉ cần đi với giấc ngủ (睡觉, 午觉) đọc jiào; còn lại (觉得, 感觉) đọc jué."
    },
    // HSK 4
    {
      id: "bx_shihe_heshi", level: 4, type: "pair", title: "适合 vs 合适",
      triggers: ["适合", "合适"],
      items: [
        { zh: "适合", py: "shìhé", pos: "Động từ", core: "Phù hợp với đối tượng nào đó — CÓ thể mang tân ngữ trực tiếp phía sau.", pattern: "A + 适合 + B (tân ngữ)", exZh: "这份工作非常适合你。", exPy: "Zhè fèn gōngzuò fēicháng shìhé nǐ.", exVi: "Công việc này vô cùng phù hợp với bạn." },
        { zh: "合适", py: "héshì", pos: "Tính từ", core: "Hợp, vừa vặn — KHÔNG mang tân ngữ trực tiếp, hay làm vị ngữ hoặc định ngữ.", pattern: "A + 很合适 / 合适的 + Danh từ", exZh: "这双鞋大小正合适。", exPy: "Zhè shuāng xié dàxiǎo zhèng héshì.", exVi: "Đôi giày này kích cỡ vừa in." }
      ],
      tip: "Phía sau có tân ngữ (适合你, 适合年轻人) bắt buộc dùng 适合; đứng cuối câu làm tính từ (很合适) hoặc trước 的 (合适的人) dùng 合适."
    },
    {
      id: "bx_jingyan_jingli", level: 4, type: "pair", title: "经验 vs 经历",
      triggers: ["经验", "经历"],
      items: [
        { zh: "经验", py: "jīngyàn", pos: "Danh từ", core: "Kinh nghiệm, bài học thực tiễn đúc kết được (không dùng làm động từ).", pattern: "有经验 / 积累经验 / 丰富的经验", exZh: "他有十年的教学经验。", exPy: "Tā yǒu shí nián de jiàoxué jīngyàn.", exVi: "Thầy ấy có mười năm kinh nghiệm giảng dạy." },
        { zh: "经历", py: "jīnglì", pos: "Danh từ / Động từ", core: "Trải nghiệm từng đi qua (danh từ) hoặc trải qua một biến cố (động từ).", pattern: "经历过 + Sự việc / 难忘的经历", exZh: "那次旅行是一段难忘的经历。", exPy: "Nà cì lǚxíng shì yí duàn nánwàng de jīnglì.", exVi: "Chuyến du lịch ấy là một trải nghiệm khó quên." }
      ],
      tip: "Kỹ năng rút ra được dùng 经验 (chỉ là danh từ); quá trình từng trải qua dùng 经历 (vừa là động từ vừa là danh từ)."
    },
    {
      id: "bx_shunbian_fangbian", level: 4, type: "pair", title: "顺便 vs 方便",
      triggers: ["顺便", "方便"],
      items: [
        { zh: "顺便", py: "shùnbiàn", pos: "Phó từ", core: "Nhân tiện làm thêm việc phụ trong lúc đang làm việc chính.", pattern: "S + Làm việc A + 顺便 + Làm việc B", exZh: "你下楼时顺便帮我拿个快递吧。", exPy: "Nǐ xiàlóu shí shùnbiàn bāng wǒ ná ge kuàidì ba.", exVi: "Khi xuống lầu bạn tiện thể lấy giúp mình gói bưu kiện nhé." },
        { zh: "方便", py: "fāngbiàn", pos: "Tính từ", core: "Thuận tiện, tiện lợi (về giao thông, thời gian, sử dụng).", pattern: "很方便 / 不方便 + Làm gì", exZh: "地铁开通以后，上班方便多了。", exPy: "Dìtiě kāitōng yǐhòu, shàngbān fāngbiàn duō le.", exVi: "Sau khi tàu điện ngầm mở tuyến, đi làm tiện hơn nhiều." }
      ],
      tip: "顺便 = tiện thể làm kèm việc khác (phó từ); 方便 = thuận tiện, dễ dàng (tính từ, có thể nói 很方便, không nói 很顺便)."
    },
    {
      id: "bx_yijian_jianyi", level: 4, type: "pair", title: "意见 vs 建议",
      triggers: ["意见", "建议"],
      items: [
        { zh: "意见", py: "yìjiàn", pos: "Danh từ", core: "Ý kiến, quan điểm đánh giá; đôi khi mang hàm ý bất mãn/phản đối (有意见).", pattern: "提意见 / 交换意见 / 对……有意见", exZh: "关于这个方案，大家有什么意见？", exPy: "Guānyú zhège fāng'àn, dàjiā yǒu shénme yìjiàn?", exVi: "Về phương án này, mọi người có ý kiến gì không?" },
        { zh: "建议", py: "jiànyì", pos: "Danh từ / Động từ", core: "Lời khuyên, đề xuất giải pháp cụ thể mang tính xây dựng.", pattern: "提出建议 / 我建议 + Mệnh đề", exZh: "我建议把会议推迟到下周一。", exPy: "Wǒ jiànyì bǎ huìyì tuīchí dào xià zhōuyī.", exVi: "Tôi đề xuất dời cuộc họp sang thứ Hai tuần sau." }
      ],
      tip: "Nêu quan điểm hoặc ý kiến phản hồi → 意见 (danh từ); đưa giải pháp/lời khuyên cụ thể → 建议 (vừa là động từ vừa là danh từ)."
    },
    {
      id: "bx_poly_xing_hang", level: 4, type: "poly", title: "Từ đa âm: 行 (xíng / háng)",
      triggers: ["行", "银行", "行业", "旅行"],
      items: [
        { zh: "行", py: "xíng", pos: "Động từ / Tính từ", core: "Đi lại, thực hiện, hoặc 'được/ổn đấy'.", pattern: "旅行 / 行动 / 这样行吗？", exZh: "我们明天八点出发，行吗？", exPy: "Wǒmen míngtiān bā diǎn chūfā, xíng ma?", exVi: "Ngày mai 8 giờ chúng ta xuất phát, được không?" },
        { zh: "行", py: "háng", pos: "Danh từ", core: "Ngành nghề, hàng lối, ngân hàng.", pattern: "银行 / 行业 / 专业对口", exZh: "他在一家国际银行工作。", exPy: "Tā zài yì jiā guójì yínháng gōngzuò.", exVi: "Anh ấy làm việc tại một ngân hàng quốc tế." }
      ],
      tip: "Đi lại / hành động / được → xíng; ngành nghề / hàng ngang / ngân hàng → háng."
    },
    {
      id: "bx_poly_zhong_chong", level: 4, type: "poly", title: "Từ đa âm: 重 (zhòng / chóng)",
      triggers: ["重要", "重新", "重复", "重视"],
      items: [
        { zh: "重", py: "zhòng", pos: "Tính từ", core: "Nặng, quan trọng, nghiêm trọng.", pattern: "重要 / 重视 / 体重", exZh: "良好的沟通习惯非常重要。", exPy: "Liánghǎo de gōutōng xíguàn fēicháng zhòngyào.", exVi: "Thói quen giao tiếp tốt vô cùng quan trọng." },
        { zh: "重", py: "chóng", pos: "Phó từ", core: "Lặp lại lần nữa, làm lại từ đầu.", pattern: "重新 / 重复 / 重逢", exZh: "这个步骤出错了，请重新检查。", exPy: "Zhège bùzhòu chūcuò le, qǐng chóngxīn jiǎnchá.", exVi: "Bước này bị sai rồi, xin hãy kiểm tra lại từ đầu." }
      ],
      tip: "Nặng / trọng yếu đọc zhòng; lặp lại (trùng lặp) đọc chóng."
    },
    // HSK 5
    {
      id: "bx_ganxiang_tihui", level: 5, type: "pair", title: "感想 vs 体会",
      triggers: ["感想", "体会"],
      items: [
        { zh: "感想", py: "gǎnxiǎng", pos: "Danh từ", core: "Cảm nghĩ, suy tưởng nảy sinh sau khi đọc sách, xem phim hay dự sự kiện (chỉ là danh từ).", pattern: "谈感想 / 读后感想", exZh: "看完这部纪录片，你有什么感想？", exPy: "Kànwán zhè bù jìlùpiàn, nǐ yǒu shénme gǎnxiǎng?", exVi: "Xem xong bộ phim tài liệu này, bạn có cảm nghĩ gì?" },
        { zh: "体会", py: "tǐhuì", pos: "Động từ / Danh từ", core: "Thấu hiểu sâu sắc qua tự thân trải nghiệm (vừa làm động từ vừa làm danh từ).", pattern: "深刻体会到…… / 学习体会", exZh: "只有亲自实践，才能体会其中的不易。", exPy: "Zhǐyǒu qīnzì shíjiàn, cái néng tǐhuì qízhōng de búyì.", exVi: "Chỉ khi tự tay thực hành mới thấu hiểu nỗi vất vả trong đó." }
      ],
      tip: "Cảm nghĩ chung chung (danh từ) → 感想; thấu hiểu từ trải nghiệm thực tế (làm động từ được: 体会到) → 体会."
    },
    {
      id: "bx_shicha_chabie", level: 5, type: "pair", title: "时差 vs 差别",
      triggers: ["时差", "差别", "差异"],
      items: [
        { zh: "时差", py: "shíchā", pos: "Danh từ", core: "Chênh lệch múi giờ giữa hai khu vực địa lý; hoặc hiện tượng lệch múi giờ khi bay xa.", pattern: "倒时差 / 有几个小时的时差", exZh: "河内和北京有一个小时的时差。", exPy: "Hénèi hé Běijīng yǒu yí ge xiǎoshí de shíchā.", exVi: "Hà Nội và Bắc Kinh chênh nhau một tiếng múi giờ." },
        { zh: "差别", py: "chābié", pos: "Danh từ", core: "Sự khác biệt, chênh lệch nói chung giữa hai sự vật/khái niệm.", pattern: "很大差别 / 没有本质差别", exZh: "这两种学习方法的效果有很大差别。", exPy: "Zhè liǎng zhǒng xuéxí fāngfǎ de xiàoguǒ yǒu hěn dà chābié.", exVi: "Hiệu quả của hai phương pháp học này có sự khác biệt rất lớn." }
      ],
      tip: "Chú ý thanh điệu và nghĩa: 时差 (chā, thanh 1) chuyên chỉ chênh lệch múi giờ; 差别 (chābié) chỉ sự khác biệt nói chung."
    },
    {
      id: "bx_fanying_pair", level: 5, type: "pair", title: "反映 vs 反应",
      triggers: ["反映", "反应"],
      items: [
        { zh: "反映", py: "fǎnyìng", pos: "Động từ", core: "Phản ánh thực trạng khách quan hoặc báo cáo ý kiến lên cấp trên.", pattern: "反映情况 / 反映问题 / 向……反映", exZh: "这部小说真实地反映了当代青年的困惑。", exPy: "Zhè bù xiǎoshuō zhēnshí de fǎnyìng le dāngdài qīngnián de kùnhuò.", exVi: "Cuốn tiểu thuyết này phản ánh chân thực nỗi trăn trở của thanh niên đương đại." },
        { zh: "反应", py: "fǎnyìng", pos: "Danh từ / Động từ", core: "Phản ứng tâm lý, sinh lý hoặc hóa học trước một tác động.", pattern: "反应很快 / 化学反应 / 引起强烈反应", exZh: "遇到突发情况时，他的反应非常敏捷。", exPy: "Yùdào tūfā qíngkuàng shí, tā de fǎnyìng fēicháng mǐnjié.", exVi: "Khi gặp tình huống bất ngờ, phản ứng của anh ấy vô cùng nhanh nhạy." }
      ],
      tip: "Cùng đọc fǎnyìng: 反映 (Ánh — như gương phản chiếu) = phản ánh/báo cáo; 反应 (Ứng — đáp lại) = phản ứng."
    },
    {
      id: "bx_poly_le_yue", level: 5, type: "poly", title: "Từ đa âm: 乐 (lè / yuè)",
      triggers: ["音乐", "快乐", "乐观", "乐器"],
      items: [
        { zh: "乐", py: "lè", pos: "Tính từ / Động từ", core: "Vui vẻ, lạc quan, sẵn lòng.", pattern: "快乐 / 乐观 / 乐于助人", exZh: "保持乐观的心态有助于克服困难。", exPy: "Bǎochí lèguān de xīntài yǒuzhùyú kèfú kùnnan.", exVi: "Giữ tâm thế lạc quan giúp ích cho việc vượt qua khó khăn." },
        { zh: "乐", py: "yuè", pos: "Danh từ", core: "Âm nhạc, nhạc cụ, bản nhạc.", pattern: "音乐 / 乐器 / 交响乐", exZh: "她从小就学习演奏传统乐器。", exPy: "Tā cóngxiǎo jiù xuéxí yǎnzòu chuántǒng yuèqì.", exVi: "Cô ấy học chơi nhạc cụ truyền thống từ nhỏ." }
      ],
      tip: "Hễ liên quan âm nhạc (音乐, 乐器, 乐团) đọc yuè; vui vẻ/lạc quan đọc lè."
    },
    // HSK 6
    {
      id: "bx_ezhi_kongzhi", level: 6, type: "pair", title: "遏制 vs 控制",
      triggers: ["遏制", "控制", "抑制"],
      items: [
        { zh: "遏制", py: "èzhì", pos: "Động từ (Văn viết)", core: "Ngăn chặn, kìm hãm xu thế tiêu cực đang lan rộng (không dùng cho máy móc).", pattern: "遏制 + Xu thế xấu (蔓延 / 通胀 / 恶化)", exZh: "各国正采取联合行动以遏制气候进一步恶化。", exPy: "Gèguó zhèng cǎiqǔ liánhé xíngdòng yǐ èzhì qìhòu jìnyíbù èhuà.", exVi: "Các nước đang hành động chung nhằm ngăn chặn khí hậu xấu đi thêm." },
        { zh: "控制", py: "kòngzhì", pos: "Động từ", core: "Kiểm soát, điều khiển ở mức ổn định (dùng rộng: cảm xúc, thiết bị, chi phí, dịch bệnh).", pattern: "控制 + Cảm xúc / Tốc độ / Chi phí", exZh: "在高压谈判中，控制情绪尤为关键。", exPy: "Zài gāoyā tánpàn zhōng, kòngzhì qíngxù yóuwéi guānjiàn.", exVi: "Trong đàm phán áp lực cao, kiểm soát cảm xúc đặc biệt then chốt." }
      ],
      tip: "遏制 là từ văn viết HSK 6, chỉ đi với xu hướng tiêu cực cần chặn đứng; 控制 trung tính, dùng được cho cả thiết bị lẫn cảm xúc."
    },
    {
      id: "bx_yuanyuan_yuanquan", level: 6, type: "pair", title: "渊源 vs 源泉",
      triggers: ["渊源", "源泉", "来源"],
      items: [
        { zh: "渊源", py: "yuānyuán", pos: "Danh từ", core: "Cội nguồn lịch sử, mối dây liên hệ truyền thống lâu đời giữa hai sự vật.", pattern: "历史渊源 / 颇有渊源", exZh: "这两种戏曲艺术有着深厚的历史渊源。", exPy: "Zhè liǎng zhǒng xìqǔ yìshù yǒuzhe shēnhòu de lìshǐ yuānyuán.", exVi: "Hai loại hình nghệ thuật hí kịch này có cội nguồn lịch sử sâu dày." },
        { zh: "源泉", py: "yuánquán", pos: "Danh từ", core: "Nguồn suối nuôi dưỡng tinh thần, sức mạnh, cảm hứng sáng tạo.", pattern: "灵感源泉 / 力量源泉 / 创作源泉", exZh: "真实的社会生活是文学创作取之不尽的源泉。", exPy: "Zhēnshí de shèhuì shēnghuó shì wénxué chuàngzuò qǔzhī bújìn de yuánquán.", exVi: "Đời sống xã hội chân thực là nguồn suối vô tận của sáng tác văn học." }
      ],
      tip: "Nói gốc gác lịch sử sâu xa → 渊源; nói nguồn nuôi dưỡng cảm hứng/sức mạnh → 源泉."
    },
    {
      id: "bx_poly_chu", level: 6, type: "poly", title: "Từ đa âm: 处 (chǔ / chù)",
      triggers: ["处理", "相处", "处于", "好处", "到处"],
      items: [
        { zh: "处", py: "chǔ", pos: "Động từ", core: "Xử lý, ở trong hoàn cảnh nào đó, chung sống với nhau.", pattern: "处理 / 处于 / 相处 / 处境", exZh: "团队成员之间应该学会融洽相处。", exPy: "Tuánduì chéngyuán zhījiān yīnggāi xuéhuì róngqià xiāngchǔ.", exVi: "Các thành viên trong nhóm nên học cách chung sống hòa thuận." },
        { zh: "处", py: "chù", pos: "Danh từ", core: "Nơi chốn, chỗ, phòng ban, điểm lợi/hại.", pattern: "到处 / 好处 / 住处 / 教务处", exZh: "适度运动对身心健康大有好处。", exPy: "Shìdù yùndòng duì shēnxīn jiànkāng dàyǒu hǎochù.", exVi: "Vận động điều độ mang lại lợi ích lớn cho sức khỏe thân tâm." }
      ],
      tip: "Làm động từ (xử lý, chung sống, ở vào thế…) đọc chǔ (thanh 3); làm danh từ (nơi chốn, lợi ích, phòng ban) đọc chù (thanh 4)."
    }
  ];

  function getConfusablesForLesson(lesson) {
    if (!lesson || Number(lesson.level) === 0) return [];
    const lv = Math.max(1, Math.min(6, Number(lesson.level) || 1));
    const corpus = [
      (lesson.vocab || []).map(function (v) { return v.word || ""; }).join(" "),
      (lesson.dialogue || []).map(function (d) { return d.zh || ""; }).join(" "),
      (lesson.grammar || []).map(function (g) { return (g.title || "") + " " + (g.body || ""); }).join(" "),
      lesson.lectureHtml || ""
    ].join(" ");

    const directHits = [];
    CONFUSABLE_BIANXI_DB.forEach(function (entry) {
      const matchedTrigger = (entry.triggers || []).find(function (t) { return t && corpus.includes(t); });
      if (matchedTrigger) {
        directHits.push({ entry: entry, isDirect: true, score: (entry.level === lv ? 10 : 5) });
      }
    });
    directHits.sort(function (a, b) { return b.score - a.score; });

    const picked = [];
    const seenIds = new Set();
    for (let i = 0; i < directHits.length && picked.length < 2; i++) {
      seenIds.add(directHits[i].entry.id);
      picked.push({ entry: directHits[i].entry, isDirect: true });
    }

    if (picked.length < 2) {
      const sameLv = CONFUSABLE_BIANXI_DB.filter(function (e) { return e.level === lv && !seenIds.has(e.id); });
      const shuffled = seededShuffle(sameLv, (lesson.id || "l") + "_bianxi");
      for (let i = 0; i < shuffled.length && picked.length < 2; i++) {
        seenIds.add(shuffled[i].id);
        picked.push({ entry: shuffled[i], isDirect: false });
      }
    }
    return picked;
  }

  function renderConfusableSection(lesson, helpers) {
    injectPageAndWorkbookStyles();
    if (helpers) state.lastHelpers = helpers;
    const esc = (helpers && helpers.esc) || defaultEsc;
    const escJsAttr = (helpers && helpers.escJsAttr) || defaultEsc;
    const list = getConfusablesForLesson(lesson);
    if (!list.length) return "";

    return `<div class="bx-wrap">${list.map(function (wrap) {
      const e = wrap.entry;
      const isPoly = e.type === "poly";
      return `<article class="bx-card">
        <div class="bx-head">
          <h4 class="bx-title">${wbIcon("split", 15)}<span>${esc(e.title)}</span></h4>
          <div class="bx-badges">
            <span class="bx-badge ${isPoly ? "poly" : "pair"}">${isPoly ? "Từ đa âm (多音字)" : "Phân biệt dễ nhầm (辨析)"}</span>
            <span class="bx-badge ${wrap.isDirect ? "hit" : ""}">${wrap.isDirect ? "Xuất hiện trong bài" : ("Trọng điểm HSK " + e.level)}</span>
          </div>
        </div>
        <div class="bx-cols">
          ${e.items.map(function (it) {
            return `<div class="bx-col">
              <div class="bx-col-top">
                <div style="min-width:0;">
                  <div><span class="bx-zh">${esc(it.zh)}</span><span class="bx-py py-text">${esc(it.py)}</span></div>
                  <span class="bx-pos">${esc(it.pos)}</span>
                </div>
                <button type="button" class="spk-btn" onclick="window.HskLessonSlidesWorkbook.speakRaw('${escJsAttr(it.zh)}','${escJsAttr(it.py)}')" title="Nghe phát âm">${wbIcon("volume", 14)}</button>
              </div>
              <div class="bx-core">${esc(it.core)}</div>
              <div class="bx-pattern">Cấu trúc: ${esc(it.pattern)}</div>
              <div class="bx-ex">
                <div style="min-width:0;">
                  <div class="bx-ex-zh">${highlightZhMatch(it.exZh, it.zh, esc)}</div>
                  <div class="bx-ex-py py-text">${esc(it.exPy)}</div>
                  <div class="bx-ex-vi vi-text">${esc(it.exVi)}</div>
                </div>
                <button type="button" class="spk-btn" onclick="window.HskLessonSlidesWorkbook.speakRaw('${escJsAttr(it.exZh)}')" title="Nghe câu ví dụ">${wbIcon("volume", 13)}</button>
              </div>
            </div>`;
          }).join("")}
        </div>
        <div class="bx-tip">${wbIcon("lightbulb", 15)}<div><b>Mẹo phân biệt nhanh:</b> ${esc(e.tip)}</div></div>
      </article>`;
    }).join("")}</div>`;
  }

  /* ================== WORKBOOK ENGINE (CHỮA BÀI TẬP THỰC CHIẾN — 4 PHẦN) ================== */

  function ensureWbLessonState(lessonId) {
    if (!state.wbByLesson[lessonId]) {
      state.wbByLesson[lessonId] = {
        p1Picked: {},
        p1Graded: false,
        p2Picked: {},
        p3PickedByQ: {},
        p3GradedByQ: {},
        p3ModeByQ: {},   // "tile" | "type"
        p3TypedByQ: {},  // raw string typed by learner
        p4Picked: {},    // { [idx]: "A"|"B"|"C"|"D" }
        p4Graded: false
      };
    }
    return state.wbByLesson[lessonId];
  }

  function buildPart1Items(l) {
    const vocab = l.vocab || [];
    const items = [];
    const usedWords = new Set();

    // Candidate Chinese sentences from dialogue + rightWrong.right
    const candidates = [];
    (l.dialogue || []).forEach(function (d) {
      if (d && d.zh) candidates.push({ zh: d.zh, py: d.py || "", vi: d.vi || "" });
    });
    (l.rightWrong || []).forEach(function (rw) {
      if (rw && rw.right) {
        const cleanZh = extractZh(rw.right);
        if (cleanZh) candidates.push({ zh: cleanZh, py: "", vi: rw.note || "" });
      }
    });

    // Sort vocab longest first so multi-char matches win over single chars
    const sortedVocab = vocab.slice().sort(function (a, b) {
      return (b.word || "").length - (a.word || "").length;
    });

    for (let ci = 0; ci < candidates.length && items.length < 4; ci++) {
      const sent = candidates[ci];
      for (let vi = 0; vi < sortedVocab.length; vi++) {
        const w = sortedVocab[vi];
        if (!w || !w.word || usedWords.has(w.word)) continue;
        const pos = sent.zh.indexOf(w.word);
        if (pos >= 0 && sent.zh.length > w.word.length + 1) {
          usedWords.add(w.word);
          const before = sent.zh.slice(0, pos);
          const after = sent.zh.slice(pos + w.word.length);
          const others = seededShuffle(
            vocab.filter(function (x) { return x.word !== w.word; }),
            l.id + "_p1_" + items.length
          ).slice(0, 3);
          const opts = seededShuffle([w].concat(others), l.id + "_p1opt_" + items.length);
          items.push({
            kind: "cloze",
            before: before,
            after: after,
            fullZh: sent.zh,
            py: sent.py,
            vi: sent.vi,
            ansWord: w.word,
            ansObj: w,
            opts: opts
          });
          break;
        }
      }
    }

    // Top up to 4 items using vocab meaning-to-hanzi if lesson sentences had fewer matches (e.g. Chương 0)
    for (let vi = 0; vi < vocab.length && items.length < 4; vi++) {
      const w = vocab[vi];
      if (!w || !w.word || usedWords.has(w.word)) continue;
      usedWords.add(w.word);
      const others = seededShuffle(
        vocab.filter(function (x) { return x.word !== w.word; }),
        l.id + "_p1v_" + items.length
      ).slice(0, 3);
      const opts = seededShuffle([w].concat(others), l.id + "_p1vopt_" + items.length);
      items.push({
        kind: "match",
        before: "",
        after: "",
        fullZh: w.word,
        py: w.pinyin || "",
        vi: w.vi || "",
        ansWord: w.word,
        ansObj: w,
        opts: opts
      });
    }

    return items;
  }

  function mutateSentenceAsDistractor(rightZh, wrongZh, seedKey) {
    const cleanR = String(rightZh || "").trim();
    const cleanW = String(wrongZh || "").trim();
    const baseZh = extractZh(cleanR) || cleanR;
    const candidates = [];

    // 1. Common grammatical traps on the Chinese portion
    if (baseZh.includes("没")) candidates.push(baseZh.replace("没", "不"));
    if (baseZh.includes("不") && !baseZh.includes("不仅") && !baseZh.includes("不是")) candidates.push(baseZh.replace("不", "没"));
    if (baseZh.includes("了")) candidates.push(baseZh.replace("了", ""));
    if (baseZh.includes("的")) candidates.push(baseZh.replace("的", ""));
    if (baseZh.includes("过")) candidates.push(baseZh.replace("过", ""));
    if (baseZh.includes("比")) candidates.push(baseZh.replace("比", "跟"));
    if (baseZh.includes("把")) candidates.push(baseZh.replace("把", "被"));
    if (baseZh.includes("被")) candidates.push(baseZh.replace("被", "把"));
    if (baseZh.includes("刚才")) candidates.push(baseZh.replace("刚才", "刚"));
    if (baseZh.includes("还是")) candidates.push(baseZh.replace("还是", "或者"));

    // 2. Swap ONLY adjacent Hanzi characters (never Latin/Vietnamese letters)
    const chars = Array.from(baseZh);
    const hanziIdx = [];
    for (let i = 0; i < chars.length; i++) {
      if (/[\u4e00-\u9fff]/.test(chars[i])) hanziIdx.push(i);
    }
    if (hanziIdx.length >= 2) {
      const pick = Math.max(0, Math.min(hanziIdx.length - 2, Math.floor(hanziIdx.length / 2) - 1));
      const a = hanziIdx[pick];
      const b = hanziIdx[pick + 1];
      if (chars[a] !== chars[b]) {
        const swapped = chars.slice();
        const tmp = swapped[a];
        swapped[a] = swapped[b];
        swapped[b] = tmp;
        candidates.push(swapped.join(""));
      }
    }

    // 3. Phonetics / explanation distractor when right/wrong contain Vietnamese notes
    if (/[A-Za-zÀ-ỹ]{3,}/.test(cleanR)) {
      candidates.push(baseZh + " (đọc nhanh, không cần biến điệu hay uốn lưỡi)");
    }

    const valid = candidates.filter(function (c) {
      return c && normZh(c) !== normZh(cleanR) && normZh(c) !== normZh(cleanW);
    });
    if (valid.length) {
      const rnd = mulberry32(seedFromStr(seedKey));
      return valid[Math.floor(rnd() * valid.length)];
    }
    return baseZh + "了吗？";
  }

  function buildPart2Items(l) {
    return (l.rightWrong || []).map(function (rw, idx) {
      const rawR = String(rw.right || "").trim();
      const rawW = String(rw.wrong || "").trim();
      const dec1 = mutateSentenceAsDistractor(rawR, rawW, l.id + "_p2_" + idx);
      const list = [{ text: rawR, ok: true }];
      if (rawW && normZh(rawW) !== normZh(rawR)) list.push({ text: rawW, ok: false });
      list.push({ text: dec1, ok: false });
      // Ensure 3 options
      const opts = seededShuffle(list.slice(0, 3), l.id + "_p2opt_" + idx);
      return {
        wrong: rawW,
        right: rawR,
        note: rw.note || "",
        opts: opts
      };
    });
  }

  function tokenizeChineseSentence(zh, lessonVocab) {
    const pure = String(zh || "")
      .replace(/[A-Za-zÀ-ỹ]+:/g, "")
      .replace(/[。？！，、；：“”‘’（）().,!?;:\s]+/g, "");
    const dict = new Set(COMMON_CHUNKS);
    (lessonVocab || []).forEach(function (v) {
      if (v && v.word) dict.add(v.word);
    });

    const tokens = [];
    let i = 0;
    while (i < pure.length) {
      let matched = "";
      for (let len = 4; len >= 2; len--) {
        if (i + len <= pure.length) {
          const sub = pure.slice(i, i + len);
          if (dict.has(sub)) {
            matched = sub;
            break;
          }
        }
      }
      if (matched) {
        tokens.push(matched);
        i += matched.length;
      } else if (i + 2 <= pure.length && !/^[的了吗呢吧着过在很没不也都要会能]$/.test(pure[i])) {
        tokens.push(pure.slice(i, i + 2));
        i += 2;
      } else {
        tokens.push(pure[i]);
        i += 1;
      }
    }

    // Compact if more than 8 tiles so mobile tray stays tidy
    while (tokens.length > 8) {
      let minIdx = 0;
      let minLen = 999;
      for (let k = 0; k < tokens.length - 1; k++) {
        const combLen = tokens[k].length + tokens[k + 1].length;
        if (combLen < minLen) {
          minLen = combLen;
          minIdx = k;
        }
      }
      tokens.splice(minIdx, 2, tokens[minIdx] + tokens[minIdx + 1]);
    }
    return tokens;
  }

  function buildPart3Items(l) {
    const dlg = l.dialogue || [];
    const picked = [];
    for (let i = 0; i < dlg.length && picked.length < 3; i++) {
      const d = dlg[i];
      if (!d || !d.zh || !d.vi) continue;
      const pureLen = normZh(d.zh).length;
      if (pureLen >= 3 && pureLen <= 28) picked.push(d);
    }
    if (!picked.length && dlg.length) picked.push(dlg[0]);

    return picked.map(function (d, idx) {
      const tokens = tokenizeChineseSentence(d.zh, l.vocab);
      const indexed = tokens.map(function (txt, ti) { return { txt: txt, origIdx: ti }; });
      let shuffled = seededShuffle(indexed, l.id + "_p3_" + idx);
      if (shuffled.length > 1 && shuffled.every(function (x, si) { return x.origIdx === si; })) {
        const tmp = shuffled[0];
        shuffled[0] = shuffled[shuffled.length - 1];
        shuffled[shuffled.length - 1] = tmp;
      }
      return {
        vi: d.vi,
        py: d.py || "",
        answerZh: d.zh,
        tokens: tokens,
        bank: shuffled
      };
    });
  }

  /* -------- Flexible Translation Grader (Hanzi or Pinyin) -------- */
  function normalizePinyinSyllables(str) {
    const toneMap = {
      "ā": "a", "á": "a", "ǎ": "a", "à": "a",
      "ē": "e", "é": "e", "ě": "e", "è": "e",
      "ī": "i", "í": "i", "ǐ": "i", "ì": "i",
      "ō": "o", "ó": "o", "ǒ": "o", "ò": "o",
      "ū": "u", "ú": "u", "ǔ": "u", "ù": "u",
      "ǖ": "v", "ǘ": "v", "ǚ": "v", "ǜ": "v", "ü": "v"
    };
    return String(str || "")
      .toLowerCase()
      .replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, function (ch) { return toneMap[ch] || ch; })
      .replace(/[0-5]/g, " ")
      .replace(/[^a-z\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function evaluateTranslationInput(userRaw, targetZh, targetPy, escFn) {
    const raw = String(userRaw || "").trim();
    if (!raw) return { mode: "empty", exact: false, pct: 0, diffHtml: "" };
    const hasZh = /[\u3400-\u9FFF]/.test(raw);
    if (hasZh) {
      const target = normZh(targetZh);
      const user = normZh(raw);
      const tChars = Array.from(target);
      const uChars = Array.from(user);
      const used = new Array(uChars.length).fill(false);
      let uPos = 0;
      let matched = 0;
      let diffHtml = "";
      for (let i = 0; i < tChars.length; i++) {
        const ch = tChars[i];
        let foundAt = -1;
        for (let j = uPos; j < uChars.length; j++) {
          if (!used[j] && uChars[j] === ch) { foundAt = j; break; }
        }
        if (foundAt !== -1) {
          used[foundAt] = true;
          uPos = foundAt + 1;
          matched++;
          diffHtml += `<span class="wb-diff-ok">${escFn(ch)}</span>`;
        } else {
          diffHtml += `<span class="wb-diff-miss">${escFn(ch)}</span>`;
        }
      }
      const denom = Math.max(tChars.length, uChars.length, 1);
      const pct = Math.round((matched / denom) * 100);
      return { mode: "zh", exact: user === target, pct: pct, diffHtml: diffHtml };
    }
    // Pinyin mode (flexible: ignores tone marks, tone numbers & spacing)
    const targetNormSpaced = normalizePinyinSyllables(targetPy || "");
    const userNormSpaced = normalizePinyinSyllables(raw);
    const tCompact = targetNormSpaced.replace(/\s+/g, "");
    const uCompact = userNormSpaced.replace(/\s+/g, "");
    if (!tCompact) return { mode: "py", exact: false, pct: 0, diffHtml: escFn(raw) };
    if (uCompact === tCompact) {
      return { mode: "py", exact: true, pct: 100, diffHtml: `<span class="wb-diff-ok">${escFn(targetPy || targetNormSpaced)}</span>` };
    }
    // Character-level ordered match on compact pinyin
    const tArr = Array.from(tCompact);
    const uArr = Array.from(uCompact);
    let uPos = 0;
    let matched = 0;
    for (let i = 0; i < tArr.length; i++) {
      for (let j = uPos; j < uArr.length; j++) {
        if (uArr[j] === tArr[i]) { matched++; uPos = j + 1; break; }
      }
    }
    const pct = Math.round((matched / Math.max(tArr.length, uArr.length, 1)) * 100);
    // Token-level visual highlight for target syllables
    const tSyls = targetNormSpaced.split(" ").filter(Boolean);
    const uSyls = userNormSpaced.split(" ").filter(Boolean);
    const diffHtml = tSyls.map(function (syl) {
      const hit = uSyls.includes(syl) || uCompact.includes(syl);
      return `<span class="${hit ? "wb-diff-ok" : "wb-diff-miss"}">${escFn(syl)}</span>`;
    }).join(" ");
    return { mode: "py", exact: pct >= 95, pct: pct, diffHtml: diffHtml };
  }

  /* -------- Part 4 Builder: [A][B][C][D] Word/Function-Word Position Picker -------- */
  const POS_FUNCTION_WORDS = {
    "也": "Phó từ '也' (cũng) luôn đứng SAU chủ ngữ và TRƯỚC động từ/tính từ (hoặc trước giới từ).",
    "都": "Phó từ '都' (đều) đứng SAU chủ ngữ số nhiều và TRƯỚC động từ/tính từ chính.",
    "很": "Phó từ mức độ '很' đứng ngay TRƯỚC tính từ hoặc động từ tâm lý.",
    "已经": "Phó từ thời gian '已经' (đã) đứng trước động từ/tính từ để biểu thị trạng thái đã xảy ra.",
    "正在": "Phó từ '正在' (đang) đứng ngay trước động từ để nhấn mạnh hành động đang diễn ra.",
    "刚才": "Danh từ thời gian '刚才' đứng trước hoặc ngay sau chủ ngữ để chỉ thời điểm vừa mới qua.",
    "刚": "Phó từ '刚' (vừa mới) đứng SAU chủ ngữ và TRƯỚC động từ.",
    "就": "Phó từ '就' luôn đứng SAU chủ ngữ và TRƯỚC vị ngữ (động từ/giới từ).",
    "才": "Phó từ '才' (mới) đứng SAU chủ ngữ/thời gian và TRƯỚC động từ chính.",
    "一直": "Phó từ '一直' (luôn/suốt) đứng trước động từ hoặc cụm giới từ để biểu thị sự liên tục.",
    "经常": "Phó từ tần suất '经常' đứng trước động từ vị ngữ.",
    "总是": "Phó từ '总是' (luôn luôn) đứng trước động từ hoặc tính từ.",
    "非常": "Phó từ mức độ '非常' đứng ngay trước tính từ hoặc động từ tâm lý.",
    "比较": "Phó từ '比较' (khá) đứng ngay trước tính từ hoặc động từ tâm lý.",
    "一定": "Phó từ '一定' (nhất định) đứng trước động từ/động từ năng nguyện để nhấn mạnh quyết tâm/suy đoán.",
    "必须": "Phó từ '必须' (nhất thiết phải) đứng trước động từ vị ngữ.",
    "还是": "Liên từ/Phó từ '还是' đứng giữa hai vế lựa chọn hoặc trước vị ngữ mang nghĩa 'vẫn nên'.",
    "或者": "Liên từ '或者' nối hai thành phần lựa chọn trong câu trần thuật.",
    "把": "Giới từ '把' đứng trước tân ngữ bị tác động và đặt trước động từ xử lý.",
    "被": "Giới từ bị động '被' đứng sau chủ ngữ chịu tác động và trước tác nhân/động từ.",
    "比": "Giới từ so sánh '比' đứng giữa đối tượng A và đối tượng B (A 比 B + Tính từ).",
    "给": "Giới từ '给' đứng trước đối tượng tiếp nhận và đặt trước động từ chính.",
    "对": "Giới từ '对' dẫn đối tượng hướng tới, đặt trước động từ/tính từ chính.",
    "从": "Giới từ '从' dẫn điểm khởi đầu (thời gian/nơi chốn), đặt trước động từ.",
    "向": "Giới từ '向' dẫn phương hướng/đối tượng, đặt trước động từ.",
    "替": "Giới từ '替' (thay cho ai) đứng trước đối tượng được làm thay và trước động từ.",
    "帮": "Động từ/Giới từ '帮' đứng trước đối tượng được giúp đỡ.",
    "没": "Phó từ phủ định '没' đứng trước động từ để phủ định sự việc đã xảy ra (hoặc trước 有).",
    "没有": "Phó từ/Động từ '没有' đứng trước động từ hoặc danh từ để biểu thị sự phủ định.",
    "不": "Phó từ phủ định '不' đứng ngay trước động từ, tính từ hoặc động từ năng nguyện.",
    "了": "Trợ từ động thái '了' đứng ngay sau động từ (hoặc cuối câu biểu thị thay đổi trạng thái).",
    "着": "Trợ từ động thái '着' gắn ngay sau động từ biểu thị trạng thái duy trì.",
    "过": "Trợ từ động thái '过' đứng ngay sau động từ biểu thị kinh nghiệm đã từng trải qua.",
    "先": "Phó từ '先' (trước hết) đứng sau chủ ngữ và trước động từ hành động đầu tiên.",
    "再": "Phó từ '再' (lại / rồi mới) đứng trước động từ chưa xảy ra."
  };

  function explainPosRule(word, lesson) {
    if (POS_FUNCTION_WORDS[word]) return POS_FUNCTION_WORDS[word];
    const info = lookupWordInfo(word, lesson);
    if (info && info.pos) {
      return `Từ "${word}" (${info.py || ""}${info.pos ? " — " + info.pos : ""}${info.vi ? ": " + info.vi : ""}) cần đặt đúng vị trí ngữ pháp này để câu tự nhiên, đúng trật tự tiếng Trung.`;
    }
    return `Đặt "${word}" tại vị trí này đảm bảo đúng trật tự Chủ ngữ – Trạng ngữ – Động từ – Tân ngữ của câu tiếng Trung chuẩn.`;
  }

  function buildPart4Items(l) {
    const items = [];
    const seenSent = new Set();
    const vocabSet = new Set((l.vocab || []).map(function (v) { return v.word; }).filter(Boolean));
    const candidates = [];

    (l.dialogue || []).forEach(function (d) {
      if (d && d.zh) candidates.push({ zh: d.zh, py: d.py || autoPinyinForZh(d.zh, l), vi: d.vi || "" });
    });
    (l.rightWrong || []).forEach(function (rw) {
      if (rw && rw.right) {
        const cz = extractZh(rw.right);
        if (cz) candidates.push({ zh: cz, py: autoPinyinForZh(cz, l), vi: rw.note || "" });
      }
    });

    for (let ci = 0; ci < candidates.length && items.length < 3; ci++) {
      const sent = candidates[ci];
      const pureSent = String(sent.zh || "").trim();
      if (!pureSent || seenSent.has(pureSent)) continue;
      const segs = segmentZhWithGloss(pureSent, l).map(function (t) { return t.zh; }).filter(Boolean);
      if (segs.length < 4) continue;

      // Pick best target token: priority 1 = function word, priority 2 = lesson vocab (>=2 chars), priority 3 = middle token
      let targetIdx = -1;
      for (let i = 0; i < segs.length; i++) {
        if (POS_FUNCTION_WORDS[segs[i]]) { targetIdx = i; break; }
      }
      if (targetIdx === -1) {
        for (let i = 0; i < segs.length; i++) {
          if (vocabSet.has(segs[i]) && segs[i].length >= 2) { targetIdx = i; break; }
        }
      }
      if (targetIdx === -1) {
        targetIdx = Math.min(segs.length - 1, Math.max(1, Math.floor(segs.length / 2)));
      }

      const targetWord = segs[targetIdx];
      const restTokens = segs.slice(0, targetIdx).concat(segs.slice(targetIdx + 1));
      const correctSlot = targetIdx; // 0..restTokens.length
      if (restTokens.length < 3) continue;

      // Choose 4 distinct slot indices in 0..restTokens.length, always including correctSlot
      const allSlots = [];
      for (let s = 0; s <= restTokens.length; s++) {
        if (s !== correctSlot) allSlots.push(s);
      }
      const distractors = seededShuffle(allSlots, (l.id || "l") + "_p4_" + items.length).slice(0, 3);
      if (distractors.length < 3) continue;

      const slots = [correctSlot].concat(distractors).sort(function (a, b) { return a - b; });
      const letters = ["A", "B", "C", "D"];
      const ansLetter = letters[slots.indexOf(correctSlot)];
      const tInfo = lookupWordInfo(targetWord, l);

      seenSent.add(pureSent);
      items.push({
        targetWord: targetWord,
        targetPy: (tInfo && tInfo.py) || autoPinyinForZh(targetWord, l),
        targetVi: (tInfo && tInfo.vi) || "",
        restTokens: restTokens,
        slots: slots, // 4 sorted insertion indices corresponding to A, B, C, D
        ansLetter: ansLetter,
        fullZh: pureSent,
        py: sent.py || "",
        vi: sent.vi || "",
        exp: explainPosRule(targetWord, l)
      });
    }

    // Fallback curated items for lessons with very short dialogues (e.g. Chương 0)
    if (!items.length) {
      const fallbacks = [
        { targetWord: "也", targetPy: "yě", targetVi: "cũng", restTokens: ["我", "是", "中国", "学生"], slots: [0, 1, 2, 3], ansLetter: "B", fullZh: "我也是中国学生。", py: "Wǒ yě shì Zhōngguó xuésheng.", vi: "Tôi cũng là học sinh Trung Quốc.", exp: POS_FUNCTION_WORDS["也"] },
        { targetWord: "很", targetPy: "hěn", targetVi: "rất", restTokens: ["今天", "天气", "好", "啊"], slots: [0, 1, 2, 4], ansLetter: "C", fullZh: "今天天气很好啊。", py: "Jīntiān tiānqì hěn hǎo a.", vi: "Thời tiết hôm nay rất đẹp.", exp: POS_FUNCTION_WORDS["很"] },
        { targetWord: "都", targetPy: "dōu", targetVi: "đều", restTokens: ["我们", "喜欢", "学习", "汉语"], slots: [0, 1, 2, 3], ansLetter: "B", fullZh: "我们都喜欢学习汉语。", py: "Wǒmen dōu xǐhuan xuéxí Hànyǔ.", vi: "Chúng tôi đều thích học tiếng Hán.", exp: POS_FUNCTION_WORDS["都"] }
      ];
      return fallbacks;
    }
    return items;
  }

  function checkAndMarkWbDone(lesson, wbSt, p1Items, p2Items, p3Items, p4Items) {
    const p1Ready = !p1Items.length || wbSt.p1Graded;
    const p2Ready = !p2Items.length || p2Items.every(function (_, i) { return wbSt.p2Picked[i] !== undefined; });
    const p3Ready = !p3Items.length || p3Items.some(function (_, i) { return wbSt.p3GradedByQ[i] === true; });
    const p4Ready = !p4Items || !p4Items.length || wbSt.p4Graded;
    if (p1Ready && p2Ready && p3Ready && p4Ready) {
      if (!state.wbDone[lesson.id]) {
        state.wbDone[lesson.id] = true;
        saveWbDone();
      }
    }
  }

  function renderWorkbookHtml(lesson, helpers) {
    injectPageAndWorkbookStyles();
    state.lastHelpers = helpers;
    const esc = helpers.esc || defaultEsc;
    const escJsAttr = helpers.escJsAttr || defaultEsc;
    const wbSt = ensureWbLessonState(lesson.id);

    const p1Items = buildPart1Items(lesson);
    const p2Items = buildPart2Items(lesson);
    const p3Items = buildPart3Items(lesson);
    const p4Items = buildPart4Items(lesson);
    const isWbDone = Boolean(state.wbDone[lesson.id]);

    // Part 1 HTML
    let p1Score = 0;
    if (wbSt.p1Graded) {
      p1Items.forEach(function (it, i) {
        if (wbSt.p1Picked[i] === it.ansWord) p1Score++;
      });
    }
    const p1Html = p1Items.length ? `
      <div class="wb-sec">
        <div class="wb-sec-head">
          <h3 class="wb-sec-title wb-inline-icon">${wbIcon("edit", 15)}<span>Phần 1 — Điền từ trọng tâm (选词填空)</span></h3>
          ${wbSt.p1Graded ? `<span class="sl-counter-pill">${wbIcon("check", 13)} Kết quả: ${p1Score}/${p1Items.length}</span>` : `<span style="font-size:12px;color:var(--muted);">${p1Items.length} câu</span>`}
        </div>
        ${p1Items.map(function (it, idx) {
          const pickedWord = wbSt.p1Picked[idx] || "";
          const isOk = wbSt.p1Graded && pickedWord === it.ansWord;
          const promptBody = it.kind === "cloze"
            ? `${esc(it.before)}<span class="wb-blank ${pickedWord ? "filled" : ""} ${wbSt.p1Graded ? (isOk ? "ok" : "bad") : ""}">${esc(pickedWord || "____")}</span>${esc(it.after)}`
            : `Chọn chữ Hán khớp với: <b>${esc(it.py)}</b> — <i>${esc(it.vi)}</i> <span class="wb-blank ${pickedWord ? "filled" : ""} ${wbSt.p1Graded ? (isOk ? "ok" : "bad") : ""}">${esc(pickedWord || "____")}</span>`;

          return `
            <div class="wb-item">
              <div class="wb-q-txt">Câu ${idx + 1}: ${promptBody}</div>
              <div class="wb-opts-row">
                ${it.opts.map(function (op) {
                  let cls = "wb-opt-pill";
                  if (wbSt.p1Graded) {
                    if (op.word === it.ansWord) cls += " ok";
                    else if (op.word === pickedWord) cls += " bad";
                  } else if (op.word === pickedWord) {
                    cls += " sel";
                  }
                  return `<button class="${cls}" ${wbSt.p1Graded ? "disabled" : ""} onclick="window.HskLessonSlidesWorkbook.pickP1('${escJsAttr(lesson.id)}',${idx},'${escJsAttr(op.word)}')">${esc(op.word)}</button>`;
                }).join("")}
              </div>
              ${wbSt.p1Graded ? `
                <div class="wb-fb ${isOk ? "ok" : "bad"}">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                    <div class="wb-inline-icon">
                      ${isOk ? wbIcon("check", 14) : wbIcon("x", 14)}
                      <span><b>${isOk ? "Chính xác!" : "Đáp án đúng: " + esc(it.ansWord)}</b>
                      <span style="color:var(--muted);"> (${esc(it.ansObj.pinyin)} — ${esc(it.ansObj.vi)})</span></span>
                    </div>
                    <button class="spk-btn" onclick="window.HskLessonSlidesWorkbook.speakRaw('${escJsAttr(it.fullZh)}')" title="Nghe câu chuẩn">${wbIcon("volume", 14)}</button>
                  </div>
                  ${it.kind === "cloze" ? `<div style="margin-top:4px;"><b>Câu chuẩn:</b> ${esc(it.fullZh)}${it.py ? ` <span class="py-text" style="color:var(--accent);">(${esc(it.py)})</span>` : ""}${it.vi ? `<div class="vi-text" style="color:var(--muted);">${esc(it.vi)}</div>` : ""}</div>` : ""}
                </div>
              ` : ""}
            </div>
          `;
        }).join("")}
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${wbSt.p1Graded
            ? `<button class="ctrl-btn" onclick="window.HskLessonSlidesWorkbook.resetP1('${escJsAttr(lesson.id)}')">${wbIcon("refresh", 13)} Làm lại Phần 1</button>`
            : `<button class="ctrl-btn on" onclick="window.HskLessonSlidesWorkbook.gradeP1('${escJsAttr(lesson.id)}')">${wbIcon("check", 13)} Chấm &amp; Xem giải thích Phần 1</button>`}
        </div>
      </div>
    ` : "";

    // Part 2 HTML
    const p2Html = p2Items.length ? `
      <div class="wb-sec">
        <div class="wb-sec-head">
          <h3 class="wb-sec-title wb-inline-icon">${wbIcon("target", 15)}<span>Phần 2 — Bắt lỗi &amp; Sửa câu sai (改错句)</span></h3>
          <span style="font-size:12px;color:var(--muted);">Chọn câu sửa đúng từ lỗi thường gặp</span>
        </div>
        ${p2Items.map(function (it, idx) {
          const pickedIdx = wbSt.p2Picked[idx];
          const answered = pickedIdx !== undefined;
          const isOk = answered && it.opts[pickedIdx] && it.opts[pickedIdx].ok;
          return `
            <div class="wb-item">
              <div style="font-size:14px;">
                <b>Câu ${idx + 1}:</b> Sửa lỗi cho câu sau:
                <span style="color:var(--danger);font-weight:800;text-decoration:line-through;margin-left:4px;">${esc(it.wrong)}</span>
              </div>
              <div class="wb-choice-col">
                ${it.opts.map(function (op, oi) {
                  let cls = "wb-choice-btn";
                  if (answered) {
                    if (op.ok) cls += " ok";
                    else if (oi === pickedIdx) cls += " bad";
                  }
                  return `<button class="${cls}" onclick="window.HskLessonSlidesWorkbook.pickP2('${escJsAttr(lesson.id)}',${idx},${oi})">${String.fromCharCode(65 + oi)}. ${esc(op.text)}</button>`;
                }).join("")}
              </div>
              ${answered ? `
                <div class="wb-fb ${isOk ? "ok" : "bad"}">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                    <span class="wb-inline-icon">${isOk ? wbIcon("check", 14) : wbIcon("x", 14)}<b>${isOk ? "Chuẩn xác!" : "Chưa đúng. Đáp án chuẩn: " + esc(it.right)}</b></span>
                    <button class="spk-btn" onclick="window.HskLessonSlidesWorkbook.speakRaw('${escJsAttr(extractZh(it.right))}')" title="Nghe câu chuẩn">${wbIcon("volume", 14)}</button>
                  </div>
                  ${it.note ? `<div style="margin-top:5px;"><b>Giải thích:</b> ${esc(it.note)}</div>` : ""}
                </div>
              ` : ""}
            </div>
          `;
        }).join("")}
      </div>
    ` : "";

    // Part 3 HTML (Supports BOTH Tile Assembly & Typed Translation Hanzi/Pinyin)
    const p3Html = p3Items.length ? `
      <div class="wb-sec">
        <div class="wb-sec-head">
          <h3 class="wb-sec-title wb-inline-icon">${wbIcon("keyboard", 15)}<span>Phần 3 — Dịch Việt → Trung: Ghép thẻ hoặc Tự gõ (翻译造句)</span></h3>
          <span style="font-size:12px;color:var(--muted);">Chuyển linh hoạt giữa Ghép thẻ &amp; Tự gõ Hán tự / Pinyin</span>
        </div>
        ${p3Items.map(function (it, qIdx) {
          const mode = wbSt.p3ModeByQ[qIdx] || "tile";
          const pickedOrder = wbSt.p3PickedByQ[qIdx] || [];
          const typedVal = wbSt.p3TypedByQ[qIdx] || "";
          const isGraded = Boolean(wbSt.p3GradedByQ[qIdx]);

          let isOk = false;
          let evalRes = null;
          if (isGraded) {
            if (mode === "type") {
              evalRes = evaluateTranslationInput(typedVal, it.answerZh, it.py || autoPinyinForZh(it.answerZh, lesson), esc);
              isOk = evalRes.exact || evalRes.pct >= 85;
            } else {
              const userStr = pickedOrder.map(function (bIdx) { return it.bank[bIdx] ? it.bank[bIdx].txt : ""; }).join("");
              isOk = normZh(userStr) === normZh(it.answerZh);
            }
          }

          return `
            <div class="wb-item">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                <div style="font-size:14.5px;font-weight:700;">Câu ${qIdx + 1}: “${esc(it.vi)}”</div>
                <div class="wb-mode-bar" role="group" aria-label="Chế độ trả lời câu ${qIdx + 1}">
                  <button type="button" class="wb-mode-btn ${mode === "tile" ? "on" : ""}" onclick="window.HskLessonSlidesWorkbook.setP3Mode('${escJsAttr(lesson.id)}',${qIdx},'tile')">${wbIcon("layers", 12)} Ghép thẻ</button>
                  <button type="button" class="wb-mode-btn ${mode === "type" ? "on" : ""}" onclick="window.HskLessonSlidesWorkbook.setP3Mode('${escJsAttr(lesson.id)}',${qIdx},'type')">${wbIcon("keyboard", 12)} Tự gõ</button>
                </div>
              </div>

              ${mode === "type" ? `
                <input type="text" class="wb-type-input" value="${esc(typedVal)}"
                  placeholder="Gõ Chữ Hán (VD: 你好) hoặc Pinyin (VD: ni hao / nǐ hǎo) rồi nhấn Enter..."
                  oninput="window.HskLessonSlidesWorkbook.setP3Typed('${escJsAttr(lesson.id)}',${qIdx},this.value)"
                  onkeydown="if(event.key==='Enter'&&!event.isComposing&&event.keyCode!==229){event.preventDefault();window.HskLessonSlidesWorkbook.gradeP3('${escJsAttr(lesson.id)}',${qIdx});}">
                <div class="wb-type-hint">Chấm linh hoạt cả Chữ Hán lẫn Pinyin (có dấu thanh, số thanh 1–5 hoặc không dấu đều được nhận diện).</div>
              ` : `
                <div class="wb-tray">
                  ${pickedOrder.length
                    ? pickedOrder.map(function (bIdx, pos) {
                        return `<button class="wb-tile placed" onclick="window.HskLessonSlidesWorkbook.unpickP3('${escJsAttr(lesson.id)}',${qIdx},${pos})">${esc(it.bank[bIdx].txt)}</button>`;
                      }).join("")
                    : `<span style="font-size:13px;color:var(--muted);">Bấm lần lượt vào các thẻ chữ bên dưới để ghép câu...</span>`}
                </div>
                <div class="wb-opts-row">
                  ${it.bank.map(function (bItem, bIdx) {
                    const used = pickedOrder.includes(bIdx);
                    return `<button class="wb-tile ${used ? "used" : ""}" onclick="window.HskLessonSlidesWorkbook.pickP3('${escJsAttr(lesson.id)}',${qIdx},${bIdx})">${esc(bItem.txt)}</button>`;
                  }).join("")}
                </div>
              `}

              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="ctrl-btn on" onclick="window.HskLessonSlidesWorkbook.gradeP3('${escJsAttr(lesson.id)}',${qIdx})">${wbIcon("check", 13)} Kiểm tra câu ${qIdx + 1}</button>
                <button class="ctrl-btn" onclick="window.HskLessonSlidesWorkbook.resetP3('${escJsAttr(lesson.id)}',${qIdx})">${wbIcon("refresh", 13)} Làm lại</button>
              </div>
              ${isGraded ? `
                <div class="wb-fb ${isOk ? "ok" : "bad"}">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                    <div style="min-width:0;">
                      <div class="wb-inline-icon">
                        ${isOk ? wbIcon("check", 14) : wbIcon("x", 14)}
                        <b>${mode === "type" && evalRes
                          ? (evalRes.exact ? "Chính xác tuyệt đối (100%)!" : (isOk ? "Đạt yêu cầu (" + evalRes.pct + "%)!" : "Chưa khớp (" + evalRes.pct + "%)."))
                          : (isOk ? "Chính xác tuyệt đối!" : "Chưa khớp đáp án chuẩn.")}</b>
                      </div>
                      ${mode === "type" && evalRes && evalRes.diffHtml ? `<div style="margin-top:4px;font-size:14px;">Đối chiếu (${evalRes.mode === "py" ? "Pinyin" : "Hán tự"}): ${evalRes.diffHtml}</div>` : ""}
                      <div style="margin-top:3px;"><b>Đáp án chuẩn:</b> ${esc(it.answerZh)}</div>
                      ${it.py ? `<div class="py-text" style="color:var(--accent);font-size:13px;">${esc(it.py)}</div>` : ""}
                    </div>
                    <button class="spk-btn" onclick="window.HskLessonSlidesWorkbook.speakRaw('${escJsAttr(it.answerZh)}')" title="Nghe câu chuẩn">${wbIcon("volume", 14)}</button>
                  </div>
                </div>
              ` : ""}
            </div>
          `;
        }).join("")}
      </div>
    ` : "";

    // Part 4 HTML — Choose exact [A][B][C][D] position for word/function word
    let p4Score = 0;
    if (wbSt.p4Graded) {
      p4Items.forEach(function (it, i) {
        if (wbSt.p4Picked[i] === it.ansLetter) p4Score++;
      });
    }
    const p4Html = p4Items.length ? `
      <div class="wb-sec">
        <div class="wb-sec-head">
          <h3 class="wb-sec-title wb-inline-icon">${wbIcon("split", 15)}<span>Phần 4 — Chọn đúng vị trí [A] [B] [C] [D] trong câu (语序填空)</span></h3>
          ${wbSt.p4Graded ? `<span class="sl-counter-pill">${wbIcon("check", 13)} Kết quả: ${p4Score}/${p4Items.length}</span>` : `<span style="font-size:12px;color:var(--muted);">Chuẩn Sách Bài Tập HSK • ${p4Items.length} câu</span>`}
        </div>
        ${p4Items.map(function (it, idx) {
          const pickedLetter = wbSt.p4Picked[idx] || "";
          const isOk = wbSt.p4Graded && pickedLetter === it.ansLetter;
          const letters = ["A", "B", "C", "D"];

          // Build sentence with inline [A] [B] [C] [D] buttons
          let sentHtml = "";
          for (let pos = 0; pos <= it.restTokens.length; pos++) {
            const slotIdx = it.slots.indexOf(pos);
            if (slotIdx !== -1) {
              const lt = letters[slotIdx];
              let sCls = "wb-slot-btn";
              if (wbSt.p4Graded) {
                if (lt === it.ansLetter) sCls += " ok";
                else if (lt === pickedLetter) sCls += " bad";
              } else if (lt === pickedLetter) {
                sCls += " sel";
              }
              const slotLabel = (wbSt.p4Graded && lt === it.ansLetter) ? `${lt}: ${it.targetWord}` : lt;
              sentHtml += `<button type="button" class="${sCls}" ${wbSt.p4Graded ? "disabled" : ""} onclick="window.HskLessonSlidesWorkbook.pickP4('${escJsAttr(lesson.id)}',${idx},'${lt}')">${esc(slotLabel)}</button>`;
            }
            if (pos < it.restTokens.length) {
              sentHtml += esc(it.restTokens[pos]);
            }
          }

          return `
            <div class="wb-item">
              <div class="wb-pos-word-row">
                <b>Câu ${idx + 1}:</b> Đặt từ/hư từ sau vào đúng vị trí trong câu:
                <span class="wb-pos-word-pill">${esc(it.targetWord)}${it.targetPy ? ` <small class="py-text" style="font-weight:700;opacity:0.85;">(${esc(it.targetPy)})</small>` : ""}</span>
                ${it.targetVi ? `<span class="vi-text" style="font-size:12.5px;">— ${esc(it.targetVi)}</span>` : ""}
              </div>
              <div class="wb-pos-sent">${sentHtml}</div>
              <div class="wb-opts-row">
                ${letters.map(function (lt) {
                  let cls = "wb-opt-pill";
                  if (wbSt.p4Graded) {
                    if (lt === it.ansLetter) cls += " ok";
                    else if (lt === pickedLetter) cls += " bad";
                  } else if (lt === pickedLetter) {
                    cls += " sel";
                  }
                  return `<button type="button" class="${cls}" ${wbSt.p4Graded ? "disabled" : ""} onclick="window.HskLessonSlidesWorkbook.pickP4('${escJsAttr(lesson.id)}',${idx},'${lt}')">Vị trí [${lt}]</button>`;
                }).join("")}
              </div>
              ${wbSt.p4Graded ? `
                <div class="wb-fb ${isOk ? "ok" : "bad"}">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                    <span class="wb-inline-icon">${isOk ? wbIcon("check", 14) : wbIcon("x", 14)}<b>${isOk ? "Chính xác! Vị trí [" + it.ansLetter + "]" : "Đáp án đúng: Vị trí [" + it.ansLetter + "]"}</b></span>
                    <button class="spk-btn" onclick="window.HskLessonSlidesWorkbook.speakRaw('${escJsAttr(it.fullZh)}')" title="Nghe câu hoàn chỉnh">${wbIcon("volume", 14)}</button>
                  </div>
                  <div style="margin-top:4px;"><b>Câu chuẩn:</b> ${highlightZhMatch(it.fullZh, it.targetWord, esc)}${it.py ? ` <span class="py-text" style="color:var(--accent);">(${esc(it.py)})</span>` : ""}</div>
                  ${it.vi ? `<div class="vi-text" style="color:var(--muted);margin-top:2px;">${esc(it.vi)}</div>` : ""}
                  <div style="margin-top:5px;"><b>Quy tắc ngữ pháp:</b> ${esc(it.exp)}</div>
                </div>
              ` : ""}
            </div>
          `;
        }).join("")}
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${wbSt.p4Graded
            ? `<button class="ctrl-btn" onclick="window.HskLessonSlidesWorkbook.resetP4('${escJsAttr(lesson.id)}')">${wbIcon("refresh", 13)} Làm lại Phần 4</button>`
            : `<button class="ctrl-btn on" onclick="window.HskLessonSlidesWorkbook.gradeP4('${escJsAttr(lesson.id)}')">${wbIcon("check", 13)} Chấm &amp; Xem giải thích Phần 4</button>`}
        </div>
      </div>
    ` : "";

    // Public YouTube links & search
    const pureTitleZh = (lesson.title || "").split("(")[0].trim();
    const ytSearchUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent((lesson.level === 0 ? "Pinyin tiếng Trung " : ("Giáo trình chuẩn HSK " + lesson.level + " ")) + pureTitleZh);
    const ytCourseAudio = (lesson.level === 0 || lesson.level === 1)
      ? `<a class="wb-ext-btn" href="https://www.youtube.com/watch?v=VLgbV1ZFlX8&list=PLDCzZfh3IvCOOwtcpBCtsBi67yNIkJ-kO" target="_blank" rel="noopener noreferrer">${wbIcon("headphones", 13)} Playlist File Nghe HSK 1 (Công khai)</a>`
      : (lesson.level === 2
        ? `<a class="wb-ext-btn" href="https://www.youtube.com/playlist?list=PLDCzZfh3IvCM5MFPF2U_L6VcCVJf4jNWi" target="_blank" rel="noopener noreferrer">${wbIcon("headphones", 13)} Playlist File Nghe HSK 2 (Công khai)</a>`
        : "");

    const wbDoneBanner = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 13px;border-radius:12px;background:var(--bg);border:1px solid ${isWbDone ? "#16a34a" : "var(--border)"};">
        <span class="wb-inline-icon" style="font-size:13.5px;font-weight:800;color:${isWbDone ? "var(--ok)" : "var(--text)"};">
          ${isWbDone ? wbIcon("check", 15) : wbIcon("edit", 15)}
          <span>${isWbDone ? "Bạn đã hoàn thành phần Chữa bài tập của bài này!" : "Hãy làm hết 4 phần thực chiến bên dưới rồi bấm Hoàn thành."}</span>
        </span>
        <button class="ctrl-btn ${isWbDone ? "on" : ""}" onclick="window.HskLessonSlidesWorkbook.toggleWbDone('${escJsAttr(lesson.id)}')">
          ${isWbDone ? wbIcon("check", 13) + " Đã xong Bài tập" : wbIcon("circle", 13) + " Đánh dấu xong Bài tập"}
        </button>
      </div>
    `;

    return `
      <div class="wb-wrap">
        ${wbDoneBanner}
        ${p1Html}
        ${p2Html}
        ${p3Html}
        ${p4Html}
        <div class="wb-ext-card">
          <div class="wb-inline-icon" style="font-size:13.5px;font-weight:800;">${wbIcon("headphones", 15)}<span>Nguồn nghe &amp; Video giảng công khai mở rộng</span></div>
          <div style="font-size:12.5px;color:var(--muted);line-height:1.5;">
            Các bài học đã được chuyển hóa thành <b>Slide giảng tương tác</b> &amp; <b>4 phần Chữa bài tập chuẩn Sách Bài Tập HSK</b> ngay trên app. Nếu bạn muốn nghe thêm bài giảng video công khai trên YouTube:
          </div>
          <div class="wb-ext-links">
            ${ytCourseAudio}
            <a class="wb-ext-btn" href="${ytSearchUrl}" target="_blank" rel="noopener noreferrer">${wbIcon("play", 13)} Tìm video giảng bài này trên YouTube</a>
          </div>
        </div>
      </div>
    `;
  }

  function refreshStage() {
    if (state.lastHelpers && typeof state.lastHelpers.renderStage === "function") {
      state.lastHelpers.renderStage();
    }
  }

  function resetForLesson(lessonId) {
    if (state.lessonId !== lessonId) {
      state.lessonId = lessonId || "";
    }
  }

  function speakCodeEl(el) {
    if (!el || !state.lastHelpers || typeof state.lastHelpers.speakZh !== "function") return;
    const zh = extractZh(el.textContent || "");
    if (zh) state.lastHelpers.speakZh(zh);
  }

  function speakRaw(text, py) {
    if (!text || !state.lastHelpers || typeof state.lastHelpers.speakZh !== "function") return;
    state.lastHelpers.speakZh(text, py ? { pinyin: py } : undefined);
  }

  function pickP1(lessonId, idx, word) {
    const wbSt = ensureWbLessonState(lessonId);
    if (wbSt.p1Graded) return;
    wbSt.p1Picked[idx] = word;
    refreshStage();
  }

  function gradeP1(lessonId) {
    const wbSt = ensureWbLessonState(lessonId);
    wbSt.p1Graded = true;
    const l = state.lastHelpers && typeof state.lastHelpers.getCurrentLesson === "function" ? state.lastHelpers.getCurrentLesson() : null;
    if (l && l.id === lessonId) {
      checkAndMarkWbDone(l, wbSt, buildPart1Items(l), buildPart2Items(l), buildPart3Items(l), buildPart4Items(l));
    }
    refreshStage();
  }

  function resetP1(lessonId) {
    const wbSt = ensureWbLessonState(lessonId);
    wbSt.p1Picked = {};
    wbSt.p1Graded = false;
    refreshStage();
  }

  function pickP2(lessonId, idx, optIdx) {
    const wbSt = ensureWbLessonState(lessonId);
    wbSt.p2Picked[idx] = optIdx;
    const l = state.lastHelpers && typeof state.lastHelpers.getCurrentLesson === "function" ? state.lastHelpers.getCurrentLesson() : null;
    if (l && l.id === lessonId) {
      checkAndMarkWbDone(l, wbSt, buildPart1Items(l), buildPart2Items(l), buildPart3Items(l), buildPart4Items(l));
    }
    refreshStage();
  }

  function pickP3(lessonId, qIdx, bankIdx) {
    const wbSt = ensureWbLessonState(lessonId);
    const arr = wbSt.p3PickedByQ[qIdx] || (wbSt.p3PickedByQ[qIdx] = []);
    if (!arr.includes(bankIdx)) arr.push(bankIdx);
    wbSt.p3GradedByQ[qIdx] = false;
    refreshStage();
  }

  function unpickP3(lessonId, qIdx, pos) {
    const wbSt = ensureWbLessonState(lessonId);
    const arr = wbSt.p3PickedByQ[qIdx];
    if (Array.isArray(arr)) arr.splice(pos, 1);
    wbSt.p3GradedByQ[qIdx] = false;
    refreshStage();
  }

  function setP3Mode(lessonId, qIdx, mode) {
    const wbSt = ensureWbLessonState(lessonId);
    wbSt.p3ModeByQ[qIdx] = mode === "type" ? "type" : "tile";
    wbSt.p3GradedByQ[qIdx] = false;
    refreshStage();
  }

  function setP3Typed(lessonId, qIdx, val) {
    const wbSt = ensureWbLessonState(lessonId);
    wbSt.p3TypedByQ[qIdx] = String(val || "");
  }

  function gradeP3(lessonId, qIdx) {
    const wbSt = ensureWbLessonState(lessonId);
    wbSt.p3GradedByQ[qIdx] = true;
    const l = state.lastHelpers && typeof state.lastHelpers.getCurrentLesson === "function" ? state.lastHelpers.getCurrentLesson() : null;
    if (l && l.id === lessonId) {
      checkAndMarkWbDone(l, wbSt, buildPart1Items(l), buildPart2Items(l), buildPart3Items(l), buildPart4Items(l));
    }
    refreshStage();
  }

  function resetP3(lessonId, qIdx) {
    const wbSt = ensureWbLessonState(lessonId);
    wbSt.p3PickedByQ[qIdx] = [];
    wbSt.p3TypedByQ[qIdx] = "";
    wbSt.p3GradedByQ[qIdx] = false;
    refreshStage();
  }

  function pickP4(lessonId, idx, letter) {
    const wbSt = ensureWbLessonState(lessonId);
    if (wbSt.p4Graded) return;
    wbSt.p4Picked[idx] = letter;
    refreshStage();
  }

  function gradeP4(lessonId) {
    const wbSt = ensureWbLessonState(lessonId);
    wbSt.p4Graded = true;
    const l = state.lastHelpers && typeof state.lastHelpers.getCurrentLesson === "function" ? state.lastHelpers.getCurrentLesson() : null;
    if (l && l.id === lessonId) {
      checkAndMarkWbDone(l, wbSt, buildPart1Items(l), buildPart2Items(l), buildPart3Items(l), buildPart4Items(l));
    }
    refreshStage();
  }

  function resetP4(lessonId) {
    const wbSt = ensureWbLessonState(lessonId);
    wbSt.p4Picked = {};
    wbSt.p4Graded = false;
    refreshStage();
  }

  function toggleWbDone(lessonId) {
    state.wbDone[lessonId] = !state.wbDone[lessonId];
    saveWbDone();
    refreshStage();
  }

  function isWbDone(lessonId) {
    return Boolean(state.wbDone[lessonId]);
  }

  global.HskLessonSlidesWorkbook = {
    setHelpers: setHelpers,
    indexVocabDict: indexVocabDict,
    indexLessonVocab: indexLessonVocab,
    enhanceHtmlCodes: enhanceHtmlCodes,
    splitLectureSections: splitLectureSections,
    autoPinyinForZh: autoPinyinForZh,
    segmentZhWithGloss: segmentZhWithGloss,
    renderRichVocabSection: renderRichVocabSection,
    renderRichGrammarSection: renderRichGrammarSection,
    renderRichDialogueSection: renderRichDialogueSection,
    renderRichRightWrongSection: renderRichRightWrongSection,
    renderConfusableSection: renderConfusableSection,
    toggleWbw: toggleWbw,
    scrollToSec: scrollToSec,
    resetForLesson: resetForLesson,
    renderWorkbookHtml: renderWorkbookHtml,
    speakCodeEl: speakCodeEl,
    speakRaw: speakRaw,
    lookupWordInfo: lookupWordInfo,
    tapZhWord: tapZhWord,
    openWordPopup: openWordPopup,
    closeWordPopup: closeWordPopup,
    pickP1: pickP1,
    gradeP1: gradeP1,
    resetP1: resetP1,
    pickP2: pickP2,
    pickP3: pickP3,
    unpickP3: unpickP3,
    setP3Mode: setP3Mode,
    setP3Typed: setP3Typed,
    gradeP3: gradeP3,
    resetP3: resetP3,
    pickP4: pickP4,
    gradeP4: gradeP4,
    resetP4: resetP4,
    toggleWbDone: toggleWbDone,
    isWbDone: isWbDone
  };
})(window);
