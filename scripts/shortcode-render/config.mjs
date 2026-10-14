/**
 * shortcode-render/config.mjs — slide-config(슬라이드 설정 표)
 * 정본 렌더러 shortcode-render.mjs 를 200줄 규칙으로 나눈 부분(바깥에서는 shortcode-render.mjs 만 import 한다).
 * 항목 = { when(type), render(ctx) } — renderNative 가 예전 if 순서 그대로 첫 번째 맞는 분기를 쓴다(render 가 undefined 면 다음 분기로).
 */
import { escapeHtml, cleanValue, renderDesc } from "./text.mjs";

export const blocks = [
  // 26. [NEW] takeaway-banner (구 takeaway) (Key Takeaway)
  { when: (type) => type === "takeaway-banner" || type === "takeaway", render: ({ items, itemBullet }) => {
    const it = items[0] || {};
    return `<div class="takeaway-banner">
      <div class="ta-icon">${escapeHtml(it.icon || "💡")}</div>
      <div>
        <div class="ta-label">${escapeHtml(it.title || "Key Takeaway")}</div>
        <div class="ta-text">${renderDesc(it.desc, itemBullet(it), it.color)}</div>
      </div>
    </div>`;
  } },

  { when: (type) => type === "slide-config", render: ({ a, body }) => {
    const lines = body.split(/\r?\n/);
    let bg = "", color = "";
    for (const line of lines) {
      const m = line.match(/^\s*(?:-\s*)?([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
      if (m) {
        const key = m[1].trim();
        const val = cleanValue(m[2]);
        if (key === "bg") bg = val;
        if (key === "color") color = val;
      }
    }
    if (bg || color) {
      const uid = "style-" + Math.random().toString(36).slice(2, 7);
      let styles = "";
      if (bg) {
        styles += `
          .section:has(.${uid}) { background-color: ${bg} !important; }
          .section:has(.${uid}) .card { background-color: ${bg} !important; border-color: rgba(255,255,255,0.1) !important; }
          .slide:has(.${uid}) { background-color: ${bg} !important; }
          .slide:has(.${uid}) .card { background-color: ${bg} !important; border-color: rgba(255,255,255,0.1) !important; }
        `;
      }
      if (color) {
        styles += `
          .section:has(.${uid}) { color: ${color} !important; }
          .section:has(.${uid}) h2,
          .section:has(.${uid}) h3,
          .section:has(.${uid}) p,
          .section:has(.${uid}) li,
          .section:has(.${uid}) span,
          .section:has(.${uid}) div,
          .section:has(.${uid}) strong,
          .section:has(.${uid}) a {
            color: ${color} !important;
          }
          .slide:has(.${uid}) { color: ${color} !important; }
          .slide:has(.${uid}) h1,
          .slide:has(.${uid}) h2,
          .slide:has(.${uid}) h3,
          .slide:has(.${uid}) p,
          .slide:has(.${uid}) li,
          .slide:has(.${uid}) span,
          .slide:has(.${uid}) div,
          .slide:has(.${uid}) strong,
          .slide:has(.${uid}) a {
            color: ${color} !important;
          }
        `;
      }
      return `<style>${styles}</style><div class="slide-style-trigger ${uid}" style="display:none;"></div>`;
    }
    return "";
  } },
];
