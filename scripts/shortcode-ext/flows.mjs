/**
 * shortcode-ext/flows.mjs — 단계형 회사 패턴(c01)의 HTML: process.cards-arrow-4 · input-circles-4 · band-columns-3 · steps-checklist-3.
 * 항목: title = 단계 이름, desc = 원 안 글(번호·짧은 말), meta = 글머리(｜ 구분). header 인수 = 머리띠(공통).
 * band-columns-3 의 meta 는 "전 | 후 | 전 | 후 …" 짝으로 읽어 전 → 후 줄로 그린다.
 */
import { cls, bullets, pill } from "./common.mjs";

const arrow = `<div class="sx-arrow sx-flow-arrow">▶</div>`;
const joinArrows = (cells) => cells.join(arrow);

/** 카드 4단계 + 화살표: 알약 제목 · 원(desc) · 글머리 */
function cardsArrow(items, a, h) {
  return `<div class="sx-flow">${joinArrows(items.map((it, i) => `
    <div class="sx-card sx-flow-card${cls(it)}">
      ${pill(it.title, h, it)}
      <div class="sx-dot sx-dot-soft sx-flow-dot">${h.esc(it.desc || String(i + 1))}</div>
      ${bullets(h.meta(it.meta), h)}
    </div>`))}</div>`;
}

/** 원 4단계 → 하단 흐름 띠: 원(제목·desc) 사이 화살표, 원 아래 글머리 */
function inputCircles(items, a, h) {
  return `<div class="sx-flow sx-flow-circles">${joinArrows(items.map((it) => `
    <div class="sx-flow-cell${cls(it)}">
      <div class="sx-flow-circle"><strong>${h.inline(it.title)}</strong>${it.desc ? `<span>${h.inline(it.desc)}</span>` : ""}</div>
      ${bullets(h.meta(it.meta), h)}
    </div>`))}</div><div class="sx-flow-bar"></div>`;
}

/** 머리띠 + 3열: 번호 원 · 제목 · 전 → 후 짝 */
function bandColumns(items, a, h) {
  return `<div class="sx-boxes" style="grid-template-columns:repeat(${items.length}, minmax(0, 1fr))">${items.map((it, i) => {
    const m = h.meta(it.meta), pairs = [];
    for (let k = 0; k < m.length; k += 2) pairs.push([m[k], m[k + 1] || ""]);
    return `<div class="sx-card sx-bc${cls(it)}">
      <div class="sx-bc-head"><div class="sx-dot">${h.esc(it.desc || String(i + 1))}</div><div class="sx-title">${h.inline(it.title)}</div></div>
      ${pairs.map(([b, f]) => `<div class="sx-bc-pair"><span class="sx-bc-before">${h.inline(b)}</span><span class="sx-bc-to">→</span><span class="sx-bc-after">${h.inline(f)}</span></div>`).join("")}
    </div>`;
  }).join("")}</div>`;
}

/** 3단계 + 체크 목록 */
function stepsChecklist(items, a, h) {
  return `<div class="sx-flow">${joinArrows(items.map((it, i) => `
    <div class="sx-card sx-flow-card${cls(it)}">
      <div class="sx-bc-head"><div class="sx-dot">${h.esc(it.desc || String(i + 1))}</div><div class="sx-title">${h.inline(it.title)}</div></div>
      ${bullets(h.meta(it.meta), h, " sx-check")}
    </div>`))}</div>`;
}

export const renderers = {
  "process.cards-arrow-4": cardsArrow, "process.input-circles-4": inputCircles,
  "process.band-columns-3": bandColumns, "process.steps-checklist-3": stepsChecklist,
};

export const css = `
  .sx-flow { display: flex; align-items: stretch; gap: 8px; margin: 25px 0; }
  .sx-flow > .sx-card, .sx-flow > .sx-flow-cell { flex: 1; min-width: 0; }
  .sx-flow-card { display: flex; flex-direction: column; align-items: center; text-align: center; }
  .sx-flow-card .sx-list { align-self: stretch; }
  .sx-flow-dot { width: 84px; height: 84px; margin: 4px 0 6px; font-size: calc(var(--size-card-p) * var(--font-scale)); }
  .sx-flow-arrow { flex: 0 0 auto; color: var(--brand); font-size: calc(1rem * var(--font-scale)); }
  .sx-flow-circles { align-items: flex-start; }
  .sx-flow-circles .sx-flow-arrow { align-self: flex-start; margin-top: 56px; }
  .sx-flow-cell { display: flex; flex-direction: column; align-items: center; text-align: center; }
  .sx-flow-cell .sx-list { align-self: stretch; }
  .sx-flow-circle { width: 132px; height: 132px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 12px; background: var(--brand); color: #fff; box-shadow: var(--card-shadow, var(--shadow)); }
  .sx-flow-circle strong { font-family: var(--font-title); font-size: calc(var(--size-card-title) * var(--font-scale)); }
  .sx-flow-circle span { font-size: calc(var(--size-card-p) * 0.95 * var(--font-scale)); opacity: 0.9; }
  .sc-item-alt .sx-flow-circle { background: var(--card-alt-bg); color: var(--text); }
  .sx-flow-bar { height: 10px; margin: -8px 4% 25px; border-radius: 999px; background: linear-gradient(90deg, var(--brand-light), var(--brand)); clip-path: polygon(0 0, 98% 0, 100% 50%, 98% 100%, 0 100%); }
  .sx-bc-head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; align-self: stretch; }
  .sx-bc-head .sx-dot { width: 46px; height: 46px; }
  .sx-bc-head .sx-title { margin: 0; text-align: left; }
  .sx-bc-pair { display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: center; padding: 8px 0; border-top: 1px dashed var(--border); font-size: calc(var(--size-card-p) * var(--font-scale)); }
  .sx-bc-before { color: var(--text-3); text-align: right; }
  .sx-bc-to { color: var(--brand); font-weight: 900; }
  .sx-bc-after { color: var(--text); font-weight: 700; }
  @media (max-width: 720px) { .sx-flow { flex-direction: column; } .sx-flow-arrow { transform: rotate(90deg); margin: 0 !important; align-self: center !important; } }
`;
