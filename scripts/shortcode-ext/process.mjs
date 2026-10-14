/**
 * shortcode-ext/process.mjs — 순서·흐름 배치 HTML: process.staircase · growth · cycle-3 · zigzag.
 * 인수 뜻은 pptgen v2 렌더러(lib/renderers/v2/process.js)와 같다:
 *   staircase: grow(한 단마다 높이 배율) · emphasis(기본 last) · caption(아래 캡션), meta = 시점
 *   zigzag   : emphasis
 *   growth   : 항목 2개(이전 → 이후), icon = 수치
 */
import { emphOf } from "../library-names.mjs";
import { cls, clamp, glyph } from "./common.mjs";

const dotText = (it, i) => glyph(it.icon) || String(i + 1).padStart(2, "0");

/** 계단: 뒤로 갈수록 높아지는 단(마지막 단 = 100%) */
function staircase(items, a, h) {
  const n = items.length, grow = clamp(a.grow, 1.0, 1.6, 1.0), emph = emphOf(items, a.emphasis);
  return `<div class="sx-stairs">${items.map((it, i) => `
    <div class="sx-stair${cls(it, emph[i])}" style="--sx-k:${(Math.pow(grow, i - (n - 1))).toFixed(3)}">
      ${it.meta ? `<div class="sx-stair-meta">${h.esc(it.meta)}</div>` : ""}
      <div class="sx-card sx-stair-step">
        ${glyph(it.icon) ? `<div class="sx-stair-icon">${h.esc(glyph(it.icon))}</div>` : ""}
        <div class="sx-title">${h.inline(it.title)}</div>${it.desc ? h.desc(it) : ""}
      </div>
    </div>`).join("")}</div>${a.caption ? `<div class="sx-card sx-caption">${h.inline(a.caption)}</div>` : ""}`;
}

/** 성장 서사: 이전 → 이후 패널(이후 강조) */
function growth(items, a, h) {
  const [from = {}, to = {}] = items;
  const panel = (it, side) => `<div class="sx-card${side === "to" ? " sx-growth-to" : ""}${cls(it, side === "to")}">
      <div class="sx-growth-val">${h.esc(it.icon || it.title)}</div>
      ${it.icon ? `<div class="sx-title">${h.inline(it.title)}</div>` : ""}${it.desc ? h.desc(it) : ""}
    </div>`;
  return `<div class="sx-growth">${panel(from, "from")}<div class="sx-arrow sx-growth-arrow">➜</div>${panel(to, "to")}</div>`;
}

/** 삼각 순환: 꼭짓점 3칸 + 가운데 순환 표시 */
function cycle3(items, a, h) {
  const node = (it, i, pos) => it ? `<div class="sx-card sx-cycle-node sx-cycle-${pos}${cls(it)}">
      <div class="sx-dot">${h.esc(dotText(it, i))}</div>
      <div><div class="sx-title">${h.inline(it.title)}</div>${it.desc ? h.desc(it) : ""}</div>
    </div>` : "";
  return `<div class="sx-cycle">${node(items[0], 0, "top")}<div class="sx-cycle-mark" aria-hidden="true"></div>${node(items[1], 1, "right")}${node(items[2], 2, "left")}</div>`;
}

/** 지그재그 로드맵: 위·아래 번갈아 놓인 노드 + 가운데 점선 길 */
function zigzag(items, a, h) {
  const emph = emphOf(items, a.emphasis);
  return `<div class="sx-zigzag" style="grid-template-columns:repeat(${items.length}, minmax(0, 1fr))">${items.map((it, i) => `
    <div class="sx-zz ${i % 2 ? "sx-zz-down" : "sx-zz-up"}${cls(it, emph[i])}">
      <div class="sx-zz-text"><div class="sx-title">${h.inline(it.title)}</div>${it.desc ? h.desc(it) : ""}</div>
      <div class="sx-dot">${h.esc(dotText(it, i))}</div>
    </div>`).join("")}</div>`;
}

export const renderers = { "process.staircase": staircase, "process.growth": growth, "process.cycle-3": cycle3, "process.zigzag": zigzag };

export const css = `
  .sx-stairs { display: flex; align-items: flex-end; gap: 12px; margin: 25px 0 12px; min-height: var(--sx-stair-h, clamp(170px, 34vh, 300px)); }
  .sx-stair { flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .sx-stair-step { min-height: calc(var(--sx-stair-h, clamp(170px, 34vh, 300px)) * var(--sx-k, 1) - 30px); display: flex; flex-direction: column; justify-content: flex-start; border-top: 5px solid var(--brand-light); }
  .sx-stair.sx-emph .sx-stair-step { border-top-color: var(--brand); background: color-mix(in srgb, var(--brand) 10%, var(--set-card-bg, var(--card-bg, #fff))); }
  .sx-stair-meta { font-weight: 800; color: var(--brand-dark); font-size: calc(var(--size-card-p) * var(--font-scale)); text-align: center; }
  .sx-stair-icon { font-size: calc(1.6rem * var(--font-scale)); margin-bottom: 6px; }
  .sx-caption { margin: 8px 0 25px; text-align: center; color: var(--text-2); font-size: calc(var(--size-card-p) * var(--font-scale)); }
  .sx-growth { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1.3fr); gap: 16px; align-items: stretch; margin: 25px 0; }
  .sx-growth .sx-card { text-align: center; display: flex; flex-direction: column; justify-content: center; }
  .sx-growth-val { font-family: var(--font-title); font-weight: 900; font-size: calc(2.2rem * var(--font-scale)); color: var(--text-3); line-height: 1.1; margin-bottom: 8px; }
  .sx-growth-to .sx-growth-val { color: var(--brand); font-size: calc(2.9rem * var(--font-scale)); }
  .sx-growth-arrow { font-size: calc(2rem * var(--font-scale)); color: var(--brand); }
  .sx-cycle { display: grid; grid-template-columns: 1fr auto 1fr; grid-template-areas: "top top top" "left mark right"; gap: 16px; margin: 25px auto; max-width: 760px; align-items: center; }
  .sx-cycle-top { grid-area: top; justify-self: center; width: min(100%, 340px); }
  .sx-cycle-left { grid-area: left; } .sx-cycle-right { grid-area: right; }
  .sx-cycle-node { display: flex; gap: 14px; align-items: center; }
  .sx-cycle-node .sx-dot { width: 52px; height: 52px; }
  .sx-cycle-mark { grid-area: mark; justify-self: center; width: 56px; height: 56px; border-radius: 50%; border: 4px solid var(--brand-light); border-top-color: var(--brand); }
  .sx-zigzag { display: grid; gap: 8px; margin: 25px 0; position: relative; }
  .sx-zigzag::before { content: ""; position: absolute; left: 4%; right: 4%; top: 50%; border-top: 3px dashed var(--brand-light); }
  .sx-zz { display: grid; grid-template-rows: 1fr auto 1fr; justify-items: center; text-align: center; gap: 10px; min-height: 260px; position: relative; }
  .sx-zz .sx-dot { grid-row: 2; width: 54px; height: 54px; }
  .sx-zz-up .sx-zz-text { grid-row: 1; align-self: end; } .sx-zz-down .sx-zz-text { grid-row: 3; align-self: start; }
  @media (max-width: 720px) { .sx-growth { grid-template-columns: 1fr; } .sx-cycle { grid-template-columns: 1fr; grid-template-areas: "top" "mark" "right" "left"; } }
`;
