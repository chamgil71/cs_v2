/**
 * shortcode-render/cards.mjs — 카드형 — grid.cards(icon-grid 계열 align·badge)·tool-list
 * 정본 렌더러 shortcode-render.mjs 를 200줄 규칙으로 나눈 부분(바깥에서는 shortcode-render.mjs 만 import 한다).
 * 항목 = { when(type), render(ctx) } — renderNative 가 예전 if 순서 그대로 첫 번째 맞는 분기를 쓴다(render 가 undefined 면 다음 분기로).
 */
import { emphOf } from "../library-names.mjs";
import { escapeHtml, renderMultiLineText, resolveColorKeyword, renderDesc } from "./text.mjs";
import { splitMeta } from "./parse.mjs";

export const blocks = [
  // 1. icon-grid (align=center|left|row) + feature-grid + badge-grid + stat-grid
  //    align=left  → skill-list 느낌 (좌측 아이콘 배경박스)
  //    align=row   → checkpoint-grid 느낌 (아이콘 좌, 텍스트 우 수평)
  //    구 이름 skill-list / checkpoint-grid 는 alias 로 동작
  { when: (type) => ["icon-grid", "feature-grid", "badge-grid", "stat-grid", "skill-list", "checkpoint-grid"].includes(type), render: ({ items, alt, renderAccent, renderTextColor, layoutAlign, gridStyle, itemBullet, badgeOf, a, type }) => {
    const isBadge = type === "badge-grid";
    const isFeat  = type === "feature-grid";
    const isStat  = type === "stat-grid";

    // alias → effective layout
    const effectiveAlign = type === "skill-list"      ? "left"
                         : type === "checkpoint-grid"  ? "row"
                         : layoutAlign;

    const isSkillLayout = !isBadge && !isFeat && !isStat && effectiveAlign === "left";
    const isRowLayout   = !isBadge && !isFeat && !isStat && effectiveAlign === "row";

    const wrapClass = isBadge      ? "badge-grid"
                    : isFeat       ? "feature-grid"
                    : isStat       ? "stat-grid"
                    : isSkillLayout ? "skill-list"
                    : isRowLayout   ? "checkpoint-grid"
                    : "icon-grid";

    const statEmph = isStat ? emphOf(items, a.emphasis) : [];
    const cardBadge = (it, i, dflt) => (isBadge || isFeat || isStat) ? (it.icon || dflt) : badgeOf(it, i, dflt);   // badge 인수는 grid.cards 만
    return `<div class="${wrapClass}" ${gridStyle}>${items.map((it, i) => {
      if (isBadge) {
        return `<div class="badge-item${alt(it)}" ${renderAccent(it.color)}>
          <div class="badge-icon">${escapeHtml(it.icon)}</div>
          <div class="badge-title" style="color: var(--text);">${escapeHtml(it.title)}</div>
          <div class="badge-tag">${escapeHtml(it.tag)}</div>
        </div>`;
      }
      if (isStat) {
        return `<div class="stat-card${alt(it)}${statEmph[i] ? " sx-emph" : ""}" ${it.color ? `style="border-top: 3px solid ${it.color};"` : `style="border-top: 3px solid var(--brand);"`}>
          <div class="stat-val" ${it.color ? `style="color:${it.color}"` : ""}>${escapeHtml(it.icon || it.title)}</div>
          ${it.icon ? `<div class="stat-name">${escapeHtml(it.title)}</div>` : ""}
          ${it.desc ? `<div class="stat-note">${renderDesc(it.desc, itemBullet(it), it.color)}</div>` : ""}
        </div>`;
      }
      if (isSkillLayout) {
        // align=left : 작은 아이콘 좌측 배경박스, 제목+설명 우측
        const b = cardBadge(it, i, "");
        return `<div class="skill-item${alt(it)}" ${renderAccent(it.color)}>
          ${b === null ? "" : `<div class="skill-icon" ${it.color ? `style="background:${it.color}22; color:${it.color};"` : ""}>${escapeHtml(b)}</div>`}
          <div class="skill-title" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
          <div class="skill-desc">${renderDesc(it.desc, itemBullet(it), it.color)}</div>
        </div>`;
      }
      if (isRowLayout) {
        // align=row : 아이콘 좌 + 텍스트 우 수평 배열
        const b = cardBadge(it, i, "📐");
        return `<div class="checkpoint-item${alt(it)}">
          ${b === null ? "" : `<div class="ci-icon">${escapeHtml(b)}</div>`}
          <div class="ci-text"><strong>${escapeHtml(it.title || "")}</strong>${it.desc ? `<br>${escapeHtml(it.desc)}` : ""}</div>
        </div>`;
      }
      // 기본(center): icon-grid 또는 feature-grid
      const cb = cardBadge(it, i, "");
      return `<div class="${isFeat ? 'feature-card' : 'icon-card'}${alt(it)}" ${renderAccent(it.color)}>
        ${isFeat && it.color ? `<div class="card-top-bar" style="background-color:${resolveColorKeyword(it.color)}"></div>` : ''}
        ${it.tag ? `<span class="feature-tag" ${it.color ? `style="background:${resolveColorKeyword(it.color)}; color:#fff;"` : ""}>${escapeHtml(it.tag)}</span>` : ""}
        ${isFeat ? `
          <div class="feature-card-title" style="color: var(--brand-dark);">
            ${it.icon ? `<span class="fc-icon">${escapeHtml(it.icon)}</span>` : ""}${renderMultiLineText(it.title, "")}
          </div>
        ` : `
          ${cb === null ? "" : `<div class="icon-card-icon" style="color: var(--brand);">${escapeHtml(cb)}</div>`}
          <div class="icon-card-title" style="color: var(--text);">${renderMultiLineText(it.title, "")}</div>
        `}
        ${renderDesc(it.desc, itemBullet(it), it.color)}
      </div>`;
    }).join("")}</div>`;
  } },

  // 2. tool-list (구 tool-box 호환)
  { when: (type) => type === "tool-list" || type === "tool-box", render: ({ items, alt }) => {
    return items.map(it => {
      const resColor = resolveColorKeyword(it.color);
      const grad = resColor ? (resColor.startsWith("var(") ? `linear-gradient(135deg, ${resColor}, color-mix(in srgb, ${resColor} 80%, black))` : `linear-gradient(135deg, ${resColor}, ${resColor}CC)`) : `var(--brand-gradient)`;
      const metaItems = splitMeta(it.meta);
      return `<div class="tool-card${alt(it)}">
        <div class="tc-header" style="background: ${grad}; color: #fff;">
          <div class="tc-icon">${escapeHtml(it.icon)}</div>
          <div class="tc-content">
            <div class="tc-name">${escapeHtml(it.title)}</div>
            <div class="tc-sub">${escapeHtml(it.desc)}</div>
          </div>
          ${it.tag ? `<div class="tc-badge">${escapeHtml(it.tag)}</div>` : ""}
        </div>
        ${metaItems.length ? `<ul class="tc-list">${metaItems.map(f => `<li>${escapeHtml(f)}</li>`).join("")}</ul>` : ""}
      </div>`;
    }).join("");
  } },
];
