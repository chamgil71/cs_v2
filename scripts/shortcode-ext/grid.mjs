/**
 * shortcode-ext/grid.mjs — 칸 나눔 배치(회사 패턴 c01 의 상자형) + structure.pillars · structure.groups-2x3 의 HTML.
 * 칸 구조가 같은 패턴은 매개변수 하나(cols·제목 모양·원)로 묶는다 — 패턴마다 렌더러를 따로 두지 않는다.
 * 항목: title = 상자 제목, desc = 보조 줄, meta = 글머리(｜ 구분). header 인수 = 머리띠(shortcode-render 가 공통으로 그림).
 */
import { cls, bullets, boxBody, pill, glyph } from "./common.mjs";

/** 상자 N 개: cols = grid-template-columns, title = "plain"|"pill", circle = desc 를 원 안에 */
function boxes(items, h, { cols, title = "plain", circle = false, main = false }) {
  return `<div class="sx-boxes${main ? " sx-main-plus" : ""}" style="grid-template-columns:${cols}">${items.map((it, i) => `
    <div class="sx-card sx-box${cls(it)}${main && i === 0 ? " sx-box-main" : ""}">
      ${title === "pill" ? pill(it.title, h, it) : it.title ? `<div class="sx-title">${h.inline(it.title)}</div>` : ""}
      ${circle ? `<div class="sx-dot sx-dot-soft sx-box-dot">${h.esc(it.desc || String(i + 1))}</div>${bullets(h.meta(it.meta), h)}` : boxBody(it, h)}
    </div>`).join("")}</div>`;
}

const eq = (n) => (items, a, h) => boxes(items, h, { cols: `repeat(${n}, minmax(0, 1fr))` });
const ratio = (cols, title) => (items, a, h) => boxes(items, h, { cols, title });

/** 큰 원 3 — 원 안에 제목, 아래 글머리 */
function circle3(items, a, h) {
  return `<div class="sx-circles">${items.map((it) => `
    <div class="sx-circle-cell${cls(it)}">
      <div class="sx-big-circle"><span>${h.inline(it.title)}</span></div>
      ${it.desc ? `<div class="sx-sub">${h.inline(it.desc)}</div>` : ""}${bullets(h.meta(it.meta), h)}
    </div>`).join("")}</div>`;
}

/** 기반 위 기둥 — 첫 항목 = 기반(아래 띠), 나머지 = 기둥 */
function pillars(items, a, h) {
  const [base, ...cols] = items;
  return `<div class="sx-pillars">
    <div class="sx-roof"></div>
    <div class="sx-pillar-row" style="grid-template-columns:repeat(${Math.max(1, cols.length)}, minmax(0, 1fr))">${cols.map((it) => `
      <div class="sx-card sx-pillar${cls(it)}">
        ${glyph(it.icon) ? `<div class="sx-pillar-icon">${h.esc(glyph(it.icon))}</div>` : ""}
        <div class="sx-title">${h.inline(it.title)}</div>${it.desc ? h.desc(it) : ""}
      </div>`).join("")}</div>
    <div class="sx-base${cls(base)}"><strong>${h.inline(base.title)}</strong>${base.desc ? `<span>${h.inline(base.desc)}</span>` : ""}</div>
  </div>`;
}

/** 2그룹 × 원 — 그룹마다 알약 제목·설명, meta 를 원으로 */
function groups(items, a, h) {
  return `<div class="sx-groups">${items.map((it) => `
    <div class="sx-card sx-group${cls(it)}">
      ${pill(it.title, h, it)}${it.desc ? `<div class="sx-sub">${h.inline(it.desc)}</div>` : ""}
      <div class="sx-group-dots">${h.meta(it.meta).map((m) => `<div class="sx-dot sx-dot-soft">${h.esc(m)}</div>`).join("")}</div>
    </div>`).join("")}</div>`;
}

export const renderers = {
  "grid.box-1": eq(1), "grid.box-2": eq(2), "grid.box-3": eq(3), "grid.box-4": eq(4), "grid.band-box-3": eq(3),
  "grid.narrow-wide": ratio("minmax(0, 1fr) minmax(0, 2fr)"), "grid.wide-narrow": ratio("minmax(0, 2fr) minmax(0, 1fr)"),
  "grid.narrow-wide-titled": ratio("minmax(0, 1fr) minmax(0, 2fr)", "pill"), "grid.wide-narrow-titled": ratio("minmax(0, 2fr) minmax(0, 1fr)", "pill"),
  "grid.main-plus-3": (items, a, h) => boxes(items, h, { cols: "minmax(0, 1.4fr) minmax(0, 1fr)", main: true }),
  "grid.cards-icon-3": (items, a, h) => boxes(items, h, { cols: "repeat(3, minmax(0, 1fr))", title: "pill", circle: true }),
  "grid.circle-3": circle3,
  "structure.pillars": pillars,
  "structure.groups-2x3": groups,
};

export const css = `
  .sx-boxes { display: grid; gap: 18px; margin: 25px 0; }
  .sx-box { display: flex; flex-direction: column; align-items: flex-start; }
  .sx-main-plus .sx-box-main { grid-row: span 3; }
  .sx-box-dot { width: 88px; height: 88px; margin: 6px auto 4px; font-size: calc(var(--size-card-p) * var(--font-scale)); }
  .sx-boxes .sx-pill { align-self: center; }
  .sx-circles { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 24px; margin: 25px 0; }
  .sx-circle-cell { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; }
  .sx-big-circle { width: 150px; height: 150px; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 16px; background: var(--set-card-bg, var(--card-bg, #fff)); border: 3px solid var(--brand); box-shadow: var(--card-shadow, var(--shadow)); font-family: var(--font-title); font-weight: 800; font-size: calc(var(--size-card-title) * var(--font-scale)); color: var(--brand-dark); }
  .sx-pillars { margin: 25px 0; display: flex; flex-direction: column; gap: 10px; }
  .sx-roof { height: 26px; background: var(--brand-light); clip-path: polygon(4% 100%, 50% 0, 96% 100%); }
  .sx-pillar-row { display: grid; gap: 14px; padding: 0 3%; }
  .sx-pillar { text-align: center; border-top: 4px solid var(--brand); min-height: 150px; display: flex; flex-direction: column; justify-content: center; }
  .sx-pillar-icon { font-size: calc(1.8rem * var(--font-scale)); margin-bottom: 6px; }
  .sx-base { padding: 14px 20px; border-radius: var(--card-radius, var(--radius)); background: var(--brand); color: #fff; text-align: center; display: flex; gap: 12px; justify-content: center; align-items: baseline; flex-wrap: wrap; font-size: calc(var(--size-card-title) * var(--font-scale)); }
  .sx-base span { font-size: calc(var(--size-card-p) * var(--font-scale)); opacity: 0.9; }
  .sx-base.sc-item-alt { background: var(--card-alt-bg); color: var(--text); }
  .sx-groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin: 25px 0; }
  .sx-group { text-align: center; }
  .sx-group-dots { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 14px; }
  .sx-group-dots .sx-dot { width: 82px; height: 82px; font-size: calc(var(--size-card-p) * 0.95 * var(--font-scale)); font-weight: 700; }
  @media (max-width: 720px) { .sx-boxes { grid-template-columns: 1fr !important; } .sx-main-plus .sx-box-main { grid-row: auto; } }
`;
