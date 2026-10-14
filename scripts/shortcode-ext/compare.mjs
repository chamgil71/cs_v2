/**
 * shortcode-ext/compare.mjs — 비교·대조 배치 HTML: compare.main-sub · balance · hbars · pair-summary.
 * 인수 뜻은 pptgen v2 렌더러(lib/renderers/v2/compare.js)와 같다:
 *   main-sub    : ratio(주 칸 비율 0.5~0.75, 카탈로그 기본값) — 항목 2개(주 / 부), 칸마다 알약 제목·설명·글머리
 *   balance     : 항목 2개를 천칭 양쪽에(아이콘·이름 + 아래 설명)
 *   hbars       : 가로 막대 스택(아이콘·이름·설명, 뒤로 갈수록 넓어짐), emphasis
 *   pair-summary: 좌우 비교 + 하단 결론 띠(header 인수 — 이 배치만 띠가 아래)
 */
import { emphOf } from "../library-names.mjs";
import { cls, clamp, glyph, pill, boxBody, band } from "./common.mjs";

const side = (it, h, extra = "") => `<div class="sx-card sx-side${extra}${cls(it)}">${pill(it.title, h, it)}${boxBody(it, h)}</div>`;

function mainSub(items, a, h) {
  const r = clamp(a.ratio, 0.5, 0.75, 0.64), [m = {}, s = {}] = items;
  return `<div class="sx-split" style="grid-template-columns:minmax(0, ${r}fr) minmax(0, ${(1 - r).toFixed(3)}fr)">${side(m, h)}${side(s, h, " sx-side-sub")}</div>`;
}

function balance(items, a, h) {
  const [l = {}, r = {}] = items;
  const pan = (it, k) => `<div class="sx-pan${cls(it)}">
      ${glyph(it.icon) ? `<div class="sx-dot${k === "r" ? "" : " sx-dot-soft"}">${h.esc(glyph(it.icon))}</div>` : ""}
      <div class="sx-title">${h.inline(it.title)}</div>${it.desc || it.meta ? `<div class="sx-sub">${h.inline(it.desc || it.meta)}</div>` : ""}
    </div>`;
  return `<div class="sx-balance">${pan(l, "l")}${pan(r, "r")}<div class="sx-beam"></div><div class="sx-fulcrum"></div></div>`;
}

function hbars(items, a, h) {
  const n = items.length, emph = emphOf(items, a.emphasis);
  return `<div class="sx-hbars">${items.map((it, i) => `
    <div class="sx-hbar${cls(it, emph[i])}" style="width:${(n > 1 ? 70 + (30 * i) / (n - 1) : 100).toFixed(1)}%">
      <div class="sx-dot">${h.esc(glyph(it.icon) || String(i + 1))}</div>
      <div class="sx-hbar-text"><div class="sx-title">${h.inline(it.title)}</div>${it.desc || it.meta ? `<div class="sx-sub">${h.inline(it.desc || h.meta(it.meta).join(" · "))}</div>` : ""}</div>
    </div>`).join("")}</div>`;
}

function pairSummary(items, a, h) {
  return `<div class="sx-split" style="grid-template-columns:repeat(${Math.max(1, items.length)}, minmax(0, 1fr))">${items.map((it) => side(it, h)).join("")}</div>${band(a.header, h, " sx-band-end")}`;
}

export const renderers = { "compare.main-sub": mainSub, "compare.balance": balance, "compare.hbars": hbars, "compare.pair-summary": pairSummary };
/** header 를 스스로 그리는 배치 — shortcode-render 의 공통 머리띠를 건너뛴다 */
export const ownHeader = ["compare.pair-summary"];

export const css = `
  .sx-split { display: grid; gap: 18px; margin: 25px 0; }
  .sx-side { display: flex; flex-direction: column; align-items: flex-start; }
  .sx-side-sub { background: color-mix(in srgb, var(--brand) 6%, var(--set-card-bg, var(--card-bg, #fff))); }
  .sx-side-sub.sc-item-alt { background: var(--card-alt-bg); }
  .sx-balance { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 18% ; padding: 0 4% 90px; margin: 25px 0; }
  .sx-pan { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; position: relative; z-index: 1; }
  .sx-pan .sx-dot { width: 76px; height: 76px; }
  .sx-beam { position: absolute; left: 10%; right: 10%; bottom: 62px; height: 6px; border-radius: 3px; background: var(--brand-dark); }
  .sx-fulcrum { position: absolute; left: calc(50% - 34px); bottom: 0; width: 68px; height: 62px; background: var(--brand); clip-path: polygon(50% 0, 100% 100%, 0 100%); }
  .sx-hbars { display: flex; flex-direction: column; gap: 10px; margin: 25px 0; }
  .sx-hbar { display: flex; align-items: center; gap: 14px; padding: 10px 18px 10px 10px; border-radius: 999px; background: var(--set-card-bg, var(--card-bg, #fff)); border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); box-shadow: var(--card-shadow, var(--shadow)); min-width: 260px; }
  .sx-hbar .sx-dot { width: 46px; height: 46px; font-size: calc(var(--size-card-p) * var(--font-scale)); }
  .sx-hbar .sx-title { margin: 0; }
  .sx-hbar-text { min-width: 0; }
  .sx-hbar.sx-emph { background: var(--brand); border-color: var(--brand); }
  .sx-hbar.sx-emph .sx-title, .sx-hbar.sx-emph .sx-sub { color: #fff; }
  .sx-hbar.sx-emph .sx-dot { background: #fff; color: var(--brand); }
  @media (max-width: 720px) { .sx-split { grid-template-columns: 1fr !important; } .sx-hbar { width: 100% !important; } }
`;
