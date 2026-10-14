/**
 * shortcode-ext/text.mjs — 서술 배치 HTML: text.statement · body · quote · icon-statement · avatar.
 * 칸 뜻은 카탈로그 fields 와 pptgen v2 렌더러(lib/renderers/v2/text.js)와 같다.
 *   statement     : title = 중앙 문장, desc = 보조 문장, meta = 요약 줄(｜ 구분 → 칩). 항목 여러 개면 차례로.
 *   body          : 항목마다 desc 한 줄 — bullet 이 있으면 글머리, 없으면 문단(블록 밖 일반 마크다운과 같은 뜻)
 *   quote         : 첫 항목 = 발언(title)·출처(meta)·이니셜(icon), 나머지 = 아래 카드(title·desc)
 *   icon-statement: 큰 아이콘 + 문장 + 보조
 *   avatar        : 이니셜 원 + 이름 + 소속
 */
import { cls, glyph } from "./common.mjs";

function statement(items, a, h) {
  return `<div class="sx-statements">${items.map((it, i) => `
    <div class="sx-statement${i ? " sx-statement-more" : ""}${cls(it)}">
      <div class="sx-statement-main">${h.inline(it.title)}</div>
      ${it.desc ? `<div class="sx-statement-sub">${h.inline(it.desc)}</div>` : ""}
      ${it.meta ? `<div class="sx-chips">${h.meta(it.meta).map((m) => `<span class="sx-chip">${h.inline(m)}</span>`).join("")}</div>` : ""}
    </div>`).join("")}</div>`;
}

function body(items, a, h) {
  const out = [];
  let list = [];
  const flush = () => { if (list.length) out.push(`<ul class="sx-body-list">${list.join("")}</ul>`); list = []; };
  for (const it of items) {
    const text = it.desc || it.title;
    if (it.bullet) list.push(`<li>${h.inline(text)}</li>`);
    else { flush(); out.push(`<p>${h.inline(text)}</p>`); }
  }
  flush();
  return `<div class="sx-body">${out.join("")}</div>`;
}

function quote(items, a, h) {
  const [q = {}, ...rest] = items;
  return `<div class="sx-quote">
    <div class="sx-quote-head">
      ${q.icon ? `<div class="sx-avatar-dot">${h.esc(q.icon)}</div>` : ""}
      <blockquote class="sx-quote-text">${h.inline(q.title)}</blockquote>
    </div>
    ${q.meta ? `<div class="sx-quote-src">— ${h.inline(q.meta)}</div>` : ""}
    ${rest.length ? `<div class="sx-quote-cards" style="grid-template-columns:repeat(${rest.length}, minmax(0, 1fr))">${rest.map((it) => `
      <div class="sx-card${cls(it)}"><div class="sx-title">${h.inline(it.title)}</div>${it.desc ? h.desc(it) : ""}</div>`).join("")}</div>` : ""}
  </div>`;
}

function iconStatement(items, a, h) {
  const it = items[0] || {};
  return `<div class="sx-card sx-icon-statement${cls(it)}">
    <div class="sx-icon-big">${h.esc(glyph(it.icon) || "💡")}</div>
    <div><div class="sx-statement-main">${h.inline(it.title)}</div>${it.desc ? `<div class="sx-statement-sub">${h.inline(it.desc)}</div>` : ""}</div>
  </div>`;
}

function avatar(items, a, h) {
  return `<div class="sx-avatars">${items.map((it) => `
    <div class="sx-avatar${cls(it)}"><div class="sx-avatar-dot">${h.esc(it.icon || (it.title || "").slice(0, 1))}</div>
      <div><div class="sx-title">${h.inline(it.title)}</div>${it.desc ? `<div class="sx-sub">${h.inline(it.desc)}</div>` : ""}</div></div>`).join("")}</div>`;
}

export const renderers = { "text.statement": statement, "text.body": body, "text.quote": quote, "text.icon-statement": iconStatement, "text.avatar": avatar };

export const css = `
  .sx-statements { display: flex; flex-direction: column; gap: 22px; margin: 30px 0; text-align: center; }
  .sx-statement-main { font-family: var(--font-title); font-weight: 900; font-size: calc(var(--size-card-title) * 1.6 * var(--font-scale)); line-height: 1.35; color: var(--text); }
  .sx-statement-more .sx-statement-main { font-size: calc(var(--size-card-title) * 1.2 * var(--font-scale)); }
  .sx-statement-sub { margin-top: 10px; font-size: calc(var(--size-card-p) * 1.1 * var(--font-scale)); color: var(--text-2); }
  .sx-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 16px; }
  .sx-chip { padding: 6px 16px; border-radius: 999px; background: var(--brand-light); color: var(--brand-dark); font-weight: 700; font-size: calc(var(--size-card-p) * var(--font-scale)); }
  .sx-body { margin: 16px 0; }
  .sx-body p { margin: 0 0 12px; line-height: 1.7; color: var(--text-2); }
  .sx-body-list { margin: 0 0 12px 1.2em; padding: 0; line-height: 1.7; color: var(--text-2); }
  .sx-quote { margin: 25px 0; }
  .sx-quote-head { display: flex; gap: 22px; align-items: center; }
  .sx-quote-text { margin: 0; position: relative; padding-left: 52px; font-family: var(--font-title); font-weight: 800; font-size: calc(var(--size-card-title) * 1.45 * var(--font-scale)); line-height: 1.4; color: var(--text); border: none; background: none; border-radius: 0; box-shadow: none; }
  .sx-quote-text::before { content: "“"; position: absolute; left: 0; top: -18px; font-size: calc(4.2rem * var(--font-scale)); color: var(--brand); line-height: 1; }
  .sx-quote-src { margin: 10px 0 0 52px; color: var(--text-3); font-size: calc(var(--size-card-p) * var(--font-scale)); }
  .sx-quote-cards { display: grid; gap: 16px; margin-top: 22px; }
  .sx-avatar-dot { width: 72px; height: 72px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--brand-gradient, var(--brand)); color: #fff; font-weight: 900; font-size: calc(1.3rem * var(--font-scale)); }
  .sx-icon-statement { display: flex; gap: 24px; align-items: center; margin: 25px 0; padding: 28px; }
  .sx-icon-big { width: 96px; height: 96px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--brand-light); font-size: calc(2.6rem * var(--font-scale)); }
  .sx-icon-statement .sx-statement-main { font-size: calc(var(--size-card-title) * 1.35 * var(--font-scale)); }
  .sx-avatars { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; }
  .sx-avatar { display: flex; gap: 14px; align-items: center; }
  .sx-avatar .sx-title { margin: 0; }
`;
