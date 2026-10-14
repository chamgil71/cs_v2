/**
 * shortcode-ext/data.mjs — 데이터·수치 배치 HTML: data.bars · data.gauge.
 * 인수 뜻은 pptgen v2 렌더러(lib/renderers/v2/data.js)와 같다:
 *   bars : 값 = icon(없으면 desc)의 첫 숫자, scale(linear|sqrt — 카탈로그 기본 sqrt, 극단 대비를 읽히게), emphasis
 *   gauge: 값 = icon(0~100), left/right = 호 양 끝 이름
 */
import { emphOf } from "../library-names.mjs";
import { cls, num, clamp } from "./common.mjs";

function bars(items, a, h) {
  const emph = emphOf(items, a.emphasis), f = a.scale === "linear" ? (v) => v : Math.sqrt;
  const vals = items.map((it) => Math.max(0, num(it.icon || it.desc) || 0)), max = Math.max(...vals.map(f), 0) || 1;
  return `<div class="sx-bars">${items.map((it, i) => `
    <div class="sx-bar-row${cls(it, emph[i])}">
      <div class="sx-bar-name">${h.inline(it.title)}</div>
      <div class="sx-bar-track"><div class="sx-bar-fill" style="width:${Math.max(2, (100 * f(vals[i])) / max).toFixed(1)}%"></div></div>
      <div class="sx-bar-val">${h.esc(it.icon || it.desc)}</div>
    </div>`).join("")}</div>`;
}

/** 반원 게이지 하나 — SVG 호 + 바늘. 색은 CSS 변수(stroke 는 style 로) */
function gaugeSvg(v) {
  const R = 80, cx = 100, cy = 95, t = Math.PI * (1 - v / 100);
  const x = (cx + R * Math.cos(t)).toFixed(1), y = (cy - R * Math.sin(t)).toFixed(1);
  const nx = (cx + (R - 18) * Math.cos(t)).toFixed(1), ny = (cy - (R - 18) * Math.sin(t)).toFixed(1);
  return `<svg class="sx-gauge-svg" viewBox="0 0 200 110" aria-hidden="true">
      <path d="M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}" style="fill:none;stroke:var(--brand-light);stroke-width:16;stroke-linecap:round"/>
      ${v > 0 ? `<path d="M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${x} ${y}" style="fill:none;stroke:var(--brand);stroke-width:16;stroke-linecap:round"/>` : ""}
      <line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" style="stroke:var(--text);stroke-width:4;stroke-linecap:round"/>
      <circle cx="${cx}" cy="${cy}" r="7" style="fill:var(--text)"/>
    </svg>`;
}

function gauge(items, a, h) {
  return `<div class="sx-gauges">${items.map((it) => {
    const v = clamp(num(it.icon), 0, 100, 0);
    return `<div class="sx-card sx-gauge${cls(it)}">
      ${gaugeSvg(v)}
      <div class="sx-gauge-ends"><span>${h.esc(a.left || "")}</span><strong>${h.esc(it.icon || "")}</strong><span>${h.esc(a.right || "")}</span></div>
      <div class="sx-title">${h.inline(it.title)}</div>${it.desc ? h.desc(it) : ""}
    </div>`;
  }).join("")}</div>`;
}

export const renderers = { "data.bars": bars, "data.gauge": gauge };

export const css = `
  .sx-bars { display: flex; flex-direction: column; gap: 14px; margin: 25px 0; }
  .sx-bar-row { display: grid; grid-template-columns: minmax(80px, 22%) 1fr minmax(60px, auto); gap: 14px; align-items: center; }
  .sx-bar-name { font-weight: 800; color: var(--text); font-size: calc(var(--size-card-p) * var(--font-scale)); text-align: right; }
  .sx-bar-track { height: 28px; border-radius: 6px; background: color-mix(in srgb, var(--text-3) 12%, transparent); overflow: hidden; }
  .sx-bar-fill { height: 100%; border-radius: 6px; background: color-mix(in srgb, var(--brand) 45%, transparent); }
  .sx-emph .sx-bar-fill { background: var(--brand); }
  .sx-bar-val { font-family: var(--font-title); font-weight: 900; color: var(--text-2); font-size: calc(var(--size-card-title) * var(--font-scale)); }
  .sx-emph .sx-bar-val { color: var(--brand); }
  .sc-item-alt .sx-bar-fill { background: var(--card-alt-bg); border: 1px solid var(--border); }
  .sx-gauges { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; margin: 25px 0; }
  .sx-gauge { text-align: center; }
  .sx-gauge-svg { width: 100%; max-width: 240px; height: auto; display: block; margin: 0 auto; }
  .sx-gauge-ends { display: flex; justify-content: space-between; align-items: baseline; max-width: 240px; margin: -4px auto 8px; color: var(--text-3); font-size: calc(var(--size-card-p) * 0.9 * var(--font-scale)); }
  .sx-gauge-ends strong { font-family: var(--font-title); font-size: calc(1.6rem * var(--font-scale)); color: var(--brand); }
`;
