/**
 * shortcode-render/boxes.mjs — 상자 — compare-split·alert(callout)·cmd·os-tabs·faq·console·git-flow
 * 정본 렌더러 shortcode-render.mjs 를 200줄 규칙으로 나눈 부분(바깥에서는 shortcode-render.mjs 만 import 한다).
 * 항목 = { when(type), render(ctx) } — renderNative 가 예전 if 순서 그대로 첫 번째 맞는 분기를 쓴다(render 가 undefined 면 다음 분기로).
 */
import { marked } from "marked";
import { argKeys } from "../library-names.mjs";
import { CALLOUT_ALIAS, escapeHtml, renderDesc, renderNote } from "./text.mjs";
import { splitMeta } from "./parse.mjs";

export const blocks = [
  // 10. compare-split (구 compare-2col)
  { when: (type) => type === "compare-split", render: ({ items, alt, itemBullet, args, body, renderNative }) => {
    if (items.length < 2) return renderNative("compare-grid", body, args);
    return `<div class="compare-2col">${items.slice(0, 2).map((it, idx) => {
      const isLeft = idx === 0;
      const classes = (isLeft ? "c2-card c2-left" : "c2-card c2-right") + alt(it);
      const metaItems = splitMeta(it.meta);
      const metaHtml = metaItems.length ? `<ul class="c2-list">${metaItems.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>` : "";
      const descHtml = it.desc ? `<div class="c2-desc">${renderDesc(it.desc, itemBullet(it), it.color)}</div>` : "";
      return `<div class="${classes}">
        <div class="card-top-bar"></div>
        <div class="c2-title">${escapeHtml(it.title)}</div>
        ${metaHtml}
        ${descHtml}
        ${it.note ? `<div class="c2-note">${renderNote(it.note)}</div>` : ""}
      </div>`;
    }).join("")}</div>`;
  } },

  // 11. alert-box
  { when: (type) => type === "alert-box", render: ({ items, itemBullet, a, args, body }) => {
    const typeColors = { tip: "var(--brand)", warn: "#F59E0B", success: "#22C55E", danger: "#EF4444" };
    return items.map(it => {
      // 종류 = variant=… 또는 첫 위치 인수(::: text.callout tip) — 인수 문자열 전체를 종류로 쓰지 않는다(bg=alt 등과 함께 써도 안전)
      const pos = String(args || "").trim().split(/\s+/).find((w) => w && !w.includes("="));
      const raw = String(argKeys(args).variant || pos || it.type || it.tag || a.variant || "").trim().toLowerCase();   // 마지막은 카탈로그 기본값(tip)
      const t = CALLOUT_ALIAS[raw] || raw;
      const color = typeColors[t] || "var(--brand)";
      return `<div class="alert-box alert-${t}" style="--alert-color:${color}">
        ${it.icon ? `<div class="alert-icon">${escapeHtml(it.icon)}</div>` : ""}
        <div class="alert-body">
          ${it.title ? `<strong>${escapeHtml(it.title)}</strong>` : ""}
          ${renderDesc(it.desc, itemBullet(it), it.color)}
        </div>
      </div>`;
    }).join("");
  } },

  // 12. cmd-box (구 command-block)
  { when: (type) => type === "cmd-box", render: ({ items }) => {
    return items.map(it => {
      const label = it.title || it.tag || "Terminal";
      const lang  = it.meta || "bash";
      return `<div class="cmd-block">
        <div class="cmd-header">
          <span class="cmd-label">${escapeHtml(label)}</span>
          <span class="cmd-lang">${escapeHtml(lang)}</span>
          <button class="cmd-copy" onclick="(function(b){var p=b.closest('.cmd-block').querySelector('.cmd-pre');navigator.clipboard.writeText(p.textContent.trim()).then(()=>{b.textContent='복사됨';setTimeout(()=>b.textContent='복사',1500)})})(this)">복사</button>
        </div>
        <pre class="cmd-pre"><code>${escapeHtml(it.desc)}</code></pre>
      </div>`;
    }).join("");
  } },

  // 13. os-tabs (구 tabs)
  { when: (type) => type === "os-tabs", render: ({ items }) => {
    const uid = "t" + Math.random().toString(36).slice(2, 7);
    return `<div class="tabs-wrap">
      <div class="tabs-nav">
        ${items.map((it, i) => `<button class="tab-btn${i === 0 ? " active" : ""}" onclick="switchTab(this,'${uid}-${i}')">${escapeHtml(it.title || it.tag || `탭 ${i+1}`)}</button>`).join("")}
      </div>
      ${items.map((it, i) => `<div class="tab-panel${i === 0 ? " active" : ""}" id="${uid}-${i}">${it.desc ? marked.parse(it.desc) : ""}</div>`).join("")}
    </div>`;
  } },

  // 14. faq-list (구 faq-accordion)
  { when: (type) => type === "faq-list", render: ({ items, alt, itemBullet, a }) => {
    return `<div class="faq-list">${items.map(it => `
      <div class="faq-item${alt(it)}">
        <button class="faq-q" onclick="this.closest('.faq-item').classList.toggle('open')">
          <span>${escapeHtml(it.title)}</span>
          <span class="faq-arrow">▼</span>
        </button>
        <div class="faq-a">${renderDesc(it.desc, itemBullet(it), it.color)}</div>
      </div>`).join("")}</div>`;
  } },

  // 15. console-box (구 prompt-example)
  { when: (type) => type === "console-box", render: ({ items }) => {
    return items.map(it => `
      <div class="prompt-box">
        ${it.title ? `<div class="prompt-label">${escapeHtml(it.title)}</div>` : ""}
        <pre class="prompt-content">${escapeHtml(it.desc)}</pre>
      </div>`).join("");
  } },

  // 16. [NEW] git-flow (구 git-flow-strip) (다차원 깃 플로우 브랜치 흐름 시각화)
  { when: (type) => type === "git-flow" || type === "git-flow-strip", render: ({ items, a }) => {
    return `<div class="git-flow-container"><div class="flow-branches">${items.map(it => {
      const color = it.color || "var(--brand)";
      const tags = it.tag ? it.tag.split("|").map(t => t.trim()) : [];
      const metas = it.meta ? it.meta.split("|").map(m => m.trim()) : [];
      const count = Math.max(tags.length, metas.length, 1);
      
      const commitsHtml = Array.from({ length: count }).map((_, idx) => {
        const tag = tags[idx] || "";
        const meta = metas[idx] || "";
        
        const labelHtml = tag ? `<span class="commit-label" style="background:${color};">${escapeHtml(tag)}</span>` : "";
        const descHtml = meta ? `<span class="commit-desc">${escapeHtml(meta)}</span>` : "";
        // connector: line(기본 — 카탈로그) | arrow(끝에 화살촉) | none(이음선 없음)
        const lineHtml = idx < count - 1 && a.connector !== "none" ? `<div class="commit-line-segment${a.connector === "arrow" ? " gf-arrow" : ""}" style="background:${color};${a.connector === "arrow" ? ` color:${color};` : ""}"></div>` : "";
        
        return `
          <div class="commit" style="border-color:${color};">
            ${labelHtml}
            ${descHtml}
          </div>
          ${lineHtml}
        `;
      }).join("");

      return `<div class="branch-row">
        <div class="branch-label" style="background: ${color}12; border-left: 4px solid ${color}; color: ${color}; font-weight: 800;">
          ${escapeHtml(it.title)}
        </div>
        <div class="branch-line">
          ${commitsHtml}
        </div>
      </div>`;
    }).join("")}</div></div>`;
  } },
];
