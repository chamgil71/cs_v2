/**
 * shortcode-render/lists.mjs — 목록·흐름 — workflow·step-list·compare-grid·plan-grid·columns·summary-box
 * 정본 렌더러 shortcode-render.mjs 를 200줄 규칙으로 나눈 부분(바깥에서는 shortcode-render.mjs 만 import 한다).
 * 항목 = { when(type), render(ctx) } — renderNative 가 예전 if 순서 그대로 첫 번째 맞는 분기를 쓴다(render 가 undefined 면 다음 분기로).
 */
import { emphOf } from "../library-names.mjs";
import { escapeHtml, renderInline, resolveColorKeyword, renderDesc, renderNote } from "./text.mjs";
import { splitMeta } from "./parse.mjs";

export const blocks = [
  // 3. workflow-flow (alias → step-flow 스타일로 렌더, 시각적 wf-* 클래스 유지)
  { when: (type) => type === "workflow-flow" || type === "workflow-strip", render: ({ items, alt, renderAccent, renderTextColor, badgeOf, a }) => {
    const emph = emphOf(items, a.emphasis);
    return `<div class="workflow-flow">${items.map((it, idx) => { const b = badgeOf(it, idx); return `
      <div class="wf-step${alt(it)}${emph[idx] ? " active" : ""}" ${renderAccent(it.color)}>
        ${b === null ? "" : `<div class="wf-icon" ${it.color ? `style="background:${it.color}; color:#fff;"` : ""}>${escapeHtml(b)}</div>`}
        <div class="wf-name" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        <div class="wf-tool">${escapeHtml(it.meta)}</div>
        ${idx < items.length - 1 ? `<div class="wf-arrow">→</div>` : ""}
      </div>`; }).join("")}</div>`;
  } },

  // 4. step-list (구 steps)
  { when: (type) => type === "step-list", render: ({ items, alt, renderAccent, renderTextColor, itemBullet, a }) => {
    // badge 기본 number(카탈로그) — 번호는 1·2·3(예전 그대로), icon 이면 아이콘(없으면 번호), none 이면 원 없음
    const stepBadge = (it, idx) => a.badge === "none" ? null : a.badge === "icon" && it.icon ? it.icon : String(idx + 1);
    return `<div class="step-list">${items.map((it, idx) => `
      <div class="step-item${alt(it)}" ${renderAccent(it.color)}>
        ${stepBadge(it, idx) === null ? "" : `<div class="step-num" ${it.color ? `style="background:${it.color}"` : ""}>${escapeHtml(stepBadge(it, idx))}</div>`}
        <div class="step-content">
          <div class="step-title" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
          ${renderDesc(it.desc, itemBullet(it), it.color)}
        </div>
      </div>`).join("")}</div>`;
  } },

  // 5. compare-grid
  { when: (type) => type === "compare-grid", render: ({ items, alt, renderAccent, renderTextColor, renderCompareNote, gridStyle, itemBullet }) => {
    return `<div class="compare-grid" ${gridStyle}>${items.map(it => {
      const activeNote = it.note || it.meta;
      return `
      <div class="compare-card${alt(it)}" ${renderAccent(it.color)}>
        <div class="compare-card-title" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        ${renderDesc(it.desc, itemBullet(it), it.color)}
        ${activeNote ? renderCompareNote(activeNote, it.color) : ""}
      </div>`;
    }).join("")}</div>`;
  } },

  // 6. plan-grid
  { when: (type) => type === "plan-grid", render: ({ items, alt, renderTextColor, gridStyle }) => {
    return `<div class="plan-grid" ${gridStyle}>${items.map(it => {
      const isFeat = it.featured === "true" || it.tag === "Best" || it.color;
      const highlight = isFeat ? "plan-featured" : "";
      const resColor = resolveColorKeyword(it.color);
      const style = resColor ? `style="border-color:${resColor}; box-shadow: 0 8px 24px ${resColor.startsWith("var(") ? 'color-mix(in srgb, ' + resColor + ' 20%, transparent)' : resColor + '33'};"` : "";
      const topBarStyle = resColor ? `style="background:${resColor};"` : "";
      const metaItems = splitMeta(it.meta);
      
      return `<div class="plan-card ${highlight}${alt(it)}" ${style}>
        <div class="card-top-bar" ${topBarStyle}></div>
        ${it.tag ? `<div class="plan-badge" ${topBarStyle}>${escapeHtml(it.tag)}</div>` : ""}
        <div class="plan-title" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        <ul class="plan-features">
          ${metaItems.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
        </ul>
        ${it.note ? `<div class="plan-note" ${topBarStyle}>${renderNote(it.note)}</div>` : ""}
      </div>`;
    }).join("")}</div>`;
  } },

  // 7. skill-list
  { when: (type) => type === "skill-list", render: ({ items, renderAccent, renderTextColor, itemBullet }) => {
    return `<div class="skill-list">${items.map(it => `
      <div class="skill-item" ${renderAccent(it.color)}>
        <div class="skill-icon" ${it.color ? `style="background:${it.color}22; color:${it.color};"` : ""}>${escapeHtml(it.icon)}</div>
        <div class="skill-title" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        <div class="skill-desc">${renderDesc(it.desc, itemBullet(it), it.color)}</div>
      </div>`).join("")}</div>`;
  } },

  // 8. columns-grid (compare-grid 는 alias — 동일 구조, 용도 컨텍스트만 다름)
  { when: (type) => type === "columns-grid" || type === "compare-grid", render: ({ items, alt, renderAccent, renderTextColor, renderCompareNote, gridStyle, itemBullet }) => {
    return `<div class="columns-grid" ${gridStyle}>${items.map(it => {
      const activeNote = it.note || it.meta;
      return `
      <div class="column-card${alt(it)}" ${renderAccent(it.color)}>
        <div class="card-top-bar" ${it.color ? `style="background:${resolveColorKeyword(it.color)}"` : ""}></div>
        <div class="col-title" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        ${renderDesc(it.desc, itemBullet(it), it.color)}
        ${activeNote ? renderCompareNote(activeNote, it.color) : ""}
      </div>`;
    }).join("")}</div>`;
  } },

  // 9. summary-box (구 bottom-list 호환)
  { when: (type) => type === "summary-box" || type === "bottom-list", render: ({ items, alt, renderAccent, renderTextColor, itemBullet }) => {
    const it = items[0];
    const chips = splitMeta(it.meta);
    return `<div class="summary-box${alt(it)}" ${renderAccent(it.color)}>
      <div class="bl-title" ${renderTextColor(it.color)}>${renderInline(it.title)}</div>
      ${renderDesc(it.desc, itemBullet(it), it.color)}
      ${chips.length ? `<div class="bl-chips">${chips.map(c => `<span class="bl-chip" ${it.color ? `style="background:${it.color}15; color:${it.color}"` : ""}>${escapeHtml(c)}</span>`).join('')}</div>` : ""}
    </div>`;
  } },
];
