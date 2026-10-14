/**
 * shortcode-render/sections.mjs — 구간·흐름 — part-banner·chapter-list·summary-bar·step-flow·level-grid·checkpoint·before-after·takeaway
 * 정본 렌더러 shortcode-render.mjs 를 200줄 규칙으로 나눈 부분(바깥에서는 shortcode-render.mjs 만 import 한다).
 * 항목 = { when(type), render(ctx) } — renderNative 가 예전 if 순서 그대로 첫 번째 맞는 분기를 쓴다(render 가 undefined 면 다음 분기로).
 */
import { emphOf } from "../library-names.mjs";
import { escapeHtml, renderDesc, renderNote } from "./text.mjs";

export const blocks = [
  // 19. [NEW] part-banner (구 part-deck 호환)
  { when: (type) => type === "part-banner" || type === "part-deck", render: ({ items }) => {
    return items.map(it => {
      const color = it.color || "var(--brand)";
      return `<div class="part-banner" style="--part-color: ${color};">
        <div class="part-banner-header" style="background: ${color};">
          <div class="part-banner-num-block">${escapeHtml(it.icon || "부")}</div>
          <div class="part-banner-title-block">
            <span class="part-banner-title-text">${escapeHtml(it.title)}</span>
            ${it.desc ? `<span class="part-banner-tagline">${escapeHtml(it.desc)}</span>` : ""}
            ${it.tag ? `<span class="part-banner-chapter-range">${escapeHtml(it.tag)}</span>` : ""}
          </div>
        </div>
      </div>`;
    }).join("");
  } },

  // 20. [NEW] chapter-list (시리즈 목차용 세부 챕터 목록)
  { when: (type) => type === "chapter-list", render: ({ items, alt }) => {
    const getBadgeClass = (tag) => {
      const map = { "개념": "badge-concept", "도구": "badge-tool", "사례": "badge-case", "가이드": "badge-guide", "실습": "badge-practice", "주의": "badge-warn", "핵심": "badge-practice" };
      return map[tag.trim()] || "badge-concept";
    };

    return `<div class="chapter-list">${items.map(it => `
      <div class="chapter-item${alt(it)}">
        <span class="chapter-num">${escapeHtml(it.icon)}</span>
        <div class="chapter-title">
          <strong>${escapeHtml(it.title)}</strong>
          ${it.desc ? `<span class="chapter-desc">${escapeHtml(it.desc)}</span>` : ""}
        </div>
        ${it.tag && it.tag.trim() !== "" ? `<span class="chapter-badge ${getBadgeClass(it.tag)}">${escapeHtml(it.tag)}</span>` : ""}
      </div>`).join("")}</div>`;
  } },

  // 21. [NEW] summary-bar (하단 지표 요약 수치 그리드)
  { when: (type) => type === "summary-bar", render: ({ items }) => {
    return `<div class="summary-bar">${items.map(it => {
      const rawNum = it.icon || "";
      const numMatch = rawNum.match(/^(\d+(?:\.\d+)?(?:[Kk]\+?|\+)?)\s*(.*)$/);
      const val = numMatch ? numMatch[1] : rawNum;
      const unit = numMatch ? numMatch[2] : "";

      return `<div class="summary-item">
        <span class="summary-num">${escapeHtml(val)}${unit ? `<span class="unit">${escapeHtml(unit)}</span>` : ""}</span>
        <span class="summary-label">${escapeHtml(it.title)}</span>
      </div>`;
    }).join("")}</div>`;
  } },

  // 22. step-flow (구 flow 호환 + meta 필드 지원)
  //     meta 필드를 사용하면 workflow-flow 스타일처럼 도구/코멘트를 표시할 수 있음
  //     connector: line(기본 — 카탈로그) = 단계 사이 가는 선 | none = 선 없음(화살표는 type: arrow 항목으로). arrow 는 workflow-flow 구현
  //     badge: icon | number | none, emphasis: 항목 tag(active·highlight) 또는 last|first|<번호>
  { when: (type) => type === "step-flow" || type === "flow", render: ({ items, alt, itemBullet, badgeOf, a }) => {
    const isArrow = (it) => it.type === "arrow" || it.title === "→" || it.icon === "→";
    const steps = items.filter((it) => !isArrow(it)), emph = emphOf(steps, a.emphasis);
    const line = a.connector === "line" && steps.length === items.length;   // 화살표 항목을 직접 넣었으면 선은 긋지 않는다
    return `<div class="step-flow${line ? " sf-line" : ""}">${items.map(it => {
      if (isArrow(it)) {
        return `<div class="step-flow-arrow">${escapeHtml(it.icon || "→")}</div>`;
      }
      const k = steps.indexOf(it), b = badgeOf(it, k);
      const activeClass = emph[k] ? "active" : "";
      return `<div class="step-flow-step ${activeClass}${alt(it)}">
        ${b === null ? "" : `<div class="fs-icon">${escapeHtml(b)}</div>`}
        <div class="fs-title">${escapeHtml(it.title)}</div>
        ${it.meta ? `<div class="fs-meta" style="font-size:0.75rem;color:var(--text-3);margin-top:4px;">${escapeHtml(it.meta)}</div>` : ""}
        <div class="fs-sub">${renderDesc(it.desc, itemBullet(it), it.color)}</div>
      </div>`;
    }).join("")}</div>`;
  } },

  // 23. [NEW] level-grid (레벨 스펙트럼)
  //     grow: 뒤 카드일수록 높게(1.0 = 같은 높이, 카탈로그 기본), emphasis: 항목 tag(highlight) 또는 last|first|<번호>
  { when: (type) => type === "level-grid", render: ({ items, alt, itemBullet, a }) => {
    const emph = emphOf(items, a.emphasis), n = items.length;
    const grow = Math.min(1.6, Math.max(1.0, parseFloat(a.grow) || 1.0));
    return `<div class="level-grid${grow > 1 ? " lv-grow" : ""}">${items.map((it, i) => {
      const activeClass = emph[i] ? "highlight" : "";
      return `<div class="level-card ${activeClass}${alt(it)}"${grow > 1 ? ` style="--lv-k:${Math.pow(grow, i - (n - 1)).toFixed(3)}"` : ""}>
        <div class="level-num">${escapeHtml(it.title)}</div>
        <div class="level-name">${renderDesc(it.desc, itemBullet(it), it.color)}</div>
        <div class="level-tool">${escapeHtml(it.meta)}</div>
        <div class="level-desc">${renderNote(it.note)}</div>
      </div>`;
    }).join("")}</div>`;
  } },

  // 24. [NEW] checkpoint-grid (중간 검수 포인트)
  { when: (type) => type === "checkpoint-grid", render: ({ items }) => {
    return `<div class="checkpoint-grid">${items.map(it => `
      <div class="checkpoint-item">
        <div class="ci-icon">${escapeHtml(it.icon || "📐")}</div>
        <div class="ci-text"><strong>${escapeHtml(it.title || "")}</strong><br>${escapeHtml(it.desc || "")}</div>
      </div>`).join("")}</div>`;
  } },

  // 25. before-after (전후 대조) — compare-diff / compare-before-after 는 alias
  { when: (type) => type === "before-after" || type === "compare-diff" || type === "compare-before-after", render: ({ items }) => {
    const bad = items[0] || {};
    const good = items[1] || {};
    return `<div class="compare-diff">
      <div class="before-box">
        <div class="ba-label">❌ ${escapeHtml(bad.title)}</div>
        <div class="ba-content">${escapeHtml(bad.desc).replace(/\n/g, "<br>")}</div>
      </div>
      <div class="after-box">
        <div class="ba-label">✅ ${escapeHtml(good.title)}</div>
        <div class="ba-content">${escapeHtml(good.desc).replace(/\n/g, "<br>")}</div>
      </div>
    </div>`;
  } },
];
