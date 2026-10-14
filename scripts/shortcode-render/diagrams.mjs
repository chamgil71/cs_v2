/**
 * shortcode-render/diagrams.mjs — 코드·도식 — editor·network·venn·quadrant·concentric
 * 정본 렌더러 shortcode-render.mjs 를 200줄 규칙으로 나눈 부분(바깥에서는 shortcode-render.mjs 만 import 한다).
 * 항목 = { when(type), render(ctx) } — renderNative 가 예전 if 순서 그대로 첫 번째 맞는 분기를 쓴다(render 가 undefined 면 다음 분기로).
 */
import { escapeHtml, resolveColorKeyword } from "./text.mjs";

export const blocks = [
  // 17. [NEW] editor-box (VS Code 모양의 가상 코드 에디터 시뮬레이션)
  { when: (type) => type === "editor-box", render: ({ items, args, body }) => {
    // YAML 형식이 아닌 raw 마크다운 본문일 경우 폴백: args에서 title/lang 추출, 전체 body를 코드로 표시
    const hasStructured = items.some(it => it.desc);
    if (!hasStructured) {
      const argStr = (args || "").trim();
      const langMatch = argStr.match(/\((\w+)\)/);
      const filename = argStr.replace(/\(.*?\)/g, "").trim() || "code";
      const lang = langMatch ? langMatch[1] : "text";
      const rawCode = body.trim();
      const codeLines = rawCode.split('\n');
      return `<div class="editor-sim">
        <div class="editor-titlebar">
          <div class="editor-dot red"></div>
          <div class="editor-dot yellow"></div>
          <div class="editor-dot green"></div>
          <div class="editor-tab active">${escapeHtml(filename)} <span style="font-size:0.75rem;opacity:0.5;">(${escapeHtml(lang)})</span></div>
        </div>
        <div class="editor-body">
          <div class="line-nums">
            ${codeLines.map((_, i) => `<span>${i + 1}</span>`).join('')}
          </div>
          <div class="code-area"><pre><code>${escapeHtml(rawCode)}</code></pre></div>
        </div>
      </div>`;
    }
    return items.map(it => {
      const codeLines = (it.desc || "").split('\n');
      const filename = it.title || "untitled";
      const lang = it.tag || "javascript";
      return `<div class="editor-sim">
        <div class="editor-titlebar">
          <div class="editor-dot red"></div>
          <div class="editor-dot yellow"></div>
          <div class="editor-dot green"></div>
          <div class="editor-tab active">${escapeHtml(filename)} <span style="font-size:0.75rem;opacity:0.5;">(${escapeHtml(lang)})</span></div>
        </div>
        <div class="editor-body">
          <div class="line-nums">
            ${codeLines.map((_, i) => `<span>${i + 1}</span>`).join('')}
          </div>
          <div class="code-area"><pre><code>${escapeHtml(it.desc)}</code></pre></div>
        </div>
      </div>`;
    }).join("");
  } },

  // 18. [NEW] network-box (둥둥 떠다니는 은하수 지식 그래프 성단)
  { when: (type) => type === "network-box", render: ({ items }) => {
    const mainNode = items[0];
    const subNodes = items.slice(1);
    const color = mainNode.color || "var(--brand)";
    return `<div class="graph-visual">
      <div class="graph-nodes">
        <div class="node node-main" style="background: ${color}; box-shadow: 0 0 24px ${color}88;">
          ${escapeHtml(mainNode.title)}
        </div>
        ${subNodes.map((n, i) => {
          const subColor = n.color || "var(--brand-dark)";
          return `<div class="node node-${i + 1}" style="border: 2px solid ${subColor}; color: ${subColor};">
            ${escapeHtml(n.title)}
            ${n.meta ? `<span style="font-size:0.7rem; opacity:0.6; display:block;">${escapeHtml(n.meta)}</span>` : ""}
          </div>`;
        }).join("")}
      </div>
    </div>`;
  } },

  // 18-1. [NEW] venn-diagram — 두 영역의 교집합에서 새 가치가 발생함을 표현
  //   items[0]=왼쪽 원, items[1]=오른쪽 원, items[2](선택)=교집합 캡션(icon/desc)
  { when: (type) => type === "venn-diagram" || type === "venn", render: ({ items }) => {
    const left = items[0] || {};
    const right = items[1] || {};
    const center = items[2] || {};
    const leftColor = resolveColorKeyword(left.color) || "var(--brand)";
    const rightColor = resolveColorKeyword(right.color) || "var(--brand-dark)";
    const hasCenter = !!(center.icon || center.desc || center.title);
    return `<div class="venn-diagram">
      <div class="venn-circle venn-left" style="border-color:${leftColor}; background:color-mix(in srgb, ${leftColor} 16%, transparent);">
        <span class="venn-label" style="color:${leftColor};">${escapeHtml(left.title)}</span>
      </div>
      <div class="venn-circle venn-right" style="border-color:${rightColor}; background:color-mix(in srgb, ${rightColor} 16%, transparent);">
        <span class="venn-label" style="color:${rightColor};">${escapeHtml(right.title)}</span>
      </div>
      ${hasCenter ? `<div class="venn-center">
        ${center.icon ? `<span class="venn-center-icon">${escapeHtml(center.icon)}</span>` : ""}
        ${(center.desc || center.title) ? `<span class="venn-center-desc">${escapeHtml(center.desc || center.title)}</span>` : ""}
      </div>` : ""}
    </div>`;
  } },

  // 18-2. [NEW] quadrant-chart — 두 축(X/Y) 기준 여러 항목의 상대 위치 비교
  //   블록 인수: xLabel="..." yLabel="..." (따옴표 필수, 공백 포함 라벨 지원)
  //   항목 필드: title(라벨), color, fx/fy(0~1 비율, 좌하단이 0,0)
  { when: (type) => type === "quadrant-chart", render: ({ items, args }) => {
    const xLabelMatch = (args || "").match(/xLabel="([^"]*)"/);
    const yLabelMatch = (args || "").match(/yLabel="([^"]*)"/);
    const xLabel = xLabelMatch ? xLabelMatch[1] : "";
    const yLabel = yLabelMatch ? yLabelMatch[1] : "";
    const clamp01 = (v) => Math.min(1, Math.max(0, parseFloat(v)));
    return `<div class="quadrant-chart">
      ${yLabel ? `<div class="quadrant-axis-y">${escapeHtml(yLabel)}</div>` : ""}
      <div class="quadrant-plot">
        <div class="quadrant-gridline quadrant-gridline-h"></div>
        <div class="quadrant-gridline quadrant-gridline-v"></div>
        ${items.map(it => {
          const fx = Number.isFinite(clamp01(it.fx)) ? clamp01(it.fx) : 0.5;
          const fy = Number.isFinite(clamp01(it.fy)) ? clamp01(it.fy) : 0.5;
          const color = resolveColorKeyword(it.color) || "var(--brand)";
          return `<div class="quadrant-point" style="left:${(fx * 100).toFixed(1)}%; bottom:${(fy * 100).toFixed(1)}%;">
            <span class="quadrant-dot" style="background:${color};"></span>
            <span class="quadrant-point-label" style="color:${color};">${escapeHtml(it.title)}</span>
          </div>`;
        }).join("")}
      </div>
      ${xLabel ? `<div class="quadrant-axis-x">${escapeHtml(xLabel)}</div>` : ""}
    </div>`;
  } },

  // 18-3. [NEW] concentric-rings — A⊃B⊃C 같은 계층적 포함관계 (바깥→안쪽 순서로 작성)
  //   마지막 항목의 icon 이 있으면 가장 안쪽에 중심 아이콘으로 표시
  { when: (type) => type === "concentric-rings", render: ({ items }) => {
    const n = items.length;
    return `<div class="concentric-rings">
      <div class="rings-visual">
        ${items.map((it, i) => {
          const color = resolveColorKeyword(it.color) || "var(--brand)";
          return `<div class="ring ring-depth-${Math.min(i, 5)}" style="background:${color}; z-index:${i + 1};"></div>`;
        }).join("")}
        ${items[n - 1]?.icon ? `<div class="ring-center-icon" style="z-index:${n + 1};">${escapeHtml(items[n - 1].icon)}</div>` : ""}
      </div>
      <div class="rings-legend">
        ${items.map(it => `<span class="ring-legend-item"><i style="background:${resolveColorKeyword(it.color) || "var(--brand)"};"></i>${escapeHtml(it.title)}</span>`).join("")}
      </div>
    </div>`;
  } },
];
