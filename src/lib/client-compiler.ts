import { marked } from 'marked';
// [안정화 복원 2026-06-25] presentation/preview 회귀로 공유 렌더러(shortcode-render)·공유 CSS(SHORTCODE_CSS) 사용을 철회.
// client-compiler 는 자체 renderClientShortcode + 자체 CSS 로 복귀. (옛 CSS 제거를 통한 일관 통합은 안정화 후 재추진 — docs/plan/presentation-stabilization.md)
// 크기 토큰 단일 출처: config/htmldesign.config.json (Node 의 loadJsonWithComments 와 동일하게 주석 제거 후 파싱)
// @ts-ignore — Vite ?raw 로 원문 문자열 import
import htmlDesignRaw from '../../config/htmldesign.config.json?raw';
const HTML_DESIGN: any = (() => {
  try { return JSON.parse(String(htmlDesignRaw).replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')); }
  catch { return {}; }
})();
const HSZ_GUIDE = HTML_DESIGN?.htmlSize?.guide || {};
const HSZ_PRES = HTML_DESIGN?.htmlSize?.presentation || {};

// Fallback styles for offline mode
export const FALLBACK_STYLES: Record<string, any> = {
  "custom-blue": {
    "label": "페이퍼로지 커스텀 블루 (테스트 테마)",
    "brand": "#2789F5",
    "brandDark": "#1E71CE",
    "brandDeep": "#0F478F",
    "brandLight": "#F0F7FF",
    "border": "#D2E5FA",
    "bg": "#FAFBFD"
  },
  "ai-chat": {
    "label": "AI 챗봇 (그린)",
    "brand": "#10A37F",
    "brandDark": "#0D8065",
    "brandDeep": "#085C4A",
    "brandLight": "#E6F4F0",
    "border": "#C8E6DF",
    "bg": "#F7FBF9"
  },
  "ai-dev": {
    "label": "AI 개발 도구 (오렌지)",
    "brand": "#D97757",
    "brandDark": "#B85F3F",
    "brandDeep": "#8B4530",
    "brandLight": "#FDF0EB",
    "border": "#F0D4C4",
    "bg": "#FBF7F5"
  },
  "knowledge": {
    "label": "노트 & 지식관리 (퍼플)",
    "brand": "#6366F1",
    "brandDark": "#4F46E5",
    "brandDeep": "#3730A3",
    "brandLight": "#EEF0FE",
    "border": "#D8DCFB",
    "bg": "#F8F9FE"
  },
  "productivity": {
    "label": "생산성 유틸 (블루)",
    "brand": "#1565C0",
    "brandDark": "#0D47A1",
    "brandDeep": "#0A3578",
    "brandLight": "#E3F2FD",
    "border": "#B3E5FC",
    "bg": "#FAFBFD"
  }
};

function escapeHtml(s: string) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c as any] || c));
}

function renderInline(s: string) {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function splitMeta(meta: string) {
  if (!meta) return [];
  return String(meta)
    .split(/[|\n]/)
    .map(s => s.trim().replace(/^["']|["']$/g, "").trim())
    .filter(Boolean);
}

function standardizeItem(item: any) {
  const rawName = item.name || item.title || "";
  const iconMatch = rawName.match(/^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*(.*)$/);

  const icon =     item.icon || (iconMatch ? iconMatch[1] : "") || "";
  const title =    item.title || (iconMatch ? iconMatch[2] : item.name) || item.col || "";
  const desc =     String(item.desc || item.description || item.tagline || item.body || "").replace(/\\n/g, "\n").replace(/\/n/g, "\n");
  const tag =      item.tag || item.badge || item.type || "";
  const color =    item.color || "";
  const featured = String(item.featured || "").trim().toLowerCase() === "true" ? "true" : "";
  const bullet =   item.bullet || "";
  const meta =     String(item.meta || item.tool || item.features || item.items || item.points || "").replace(/\\n/g, "\n").replace(/\/n/g, "\n");
  const note =     String(item.note || "").replace(/\\n/g, "\n").replace(/\/n/g, "\n");

  return {
    ...item,
    icon,
    title,
    desc,
    tag,
    meta,
    note,
    color,
    featured,
    bullet,
  };
}

function parseShortcodeItems(src: string) {
  const items: any[] = [];
  let current: any = null;
  let currentKey: string | null = null;
  let inLiteralBlock = false;

  for (const line of src.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (inLiteralBlock && line.startsWith("    ")) {
      const val = line.slice(4);
      const sep = currentKey === 'meta' ? ' | ' : '\n';
      const existing = current[currentKey!];
      current[currentKey!] = (!existing || existing === '|') ? val : existing + sep + val;
      continue;
    } else {
      inLiteralBlock = false;
    }

    if (trimmed.startsWith("- ")) {
      if (current) items.push(current);
      current = {};
      const content = line.slice(line.indexOf("- ") + 2).trim();
      const colonIdx = content.indexOf(":");
      if (colonIdx >= 0) {
        const key = content.slice(0, colonIdx).trim();
        const val = content.slice(colonIdx + 1).trim();
        if (val === "|") {
          inLiteralBlock = true;
          currentKey = key;
          current[key] = "";
        } else {
          current[key] = val.replace(/^["']|["']$/g, "");
        }
      }
      continue;
    }

    if (current && trimmed.includes(":")) {
      const colonIdx = line.indexOf(":");
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      if (val === "|") {
        inLiteralBlock = true;
        currentKey = key;
        current[key] = "";
      } else {
        current[key] = val.replace(/^["']|["']$/g, "");
        currentKey = key;
      }
    }
  }
  if (current) items.push(current);
  return items.map(standardizeItem);
}

function resolveColorKeyword(color: string, style: any) {
  if (!color) return "";
  if (color.startsWith("#")) return color;
  if (color === "brand") return style.brand || "var(--brand)";
  if (color === "brandDark") return style.brandDark || "var(--brand-dark)";
  if (color === "brandDeep") return style.brandDeep || "var(--brand-deep)";
  if (color === "brandLight") return style.brandLight || "var(--brand-light)";
  if (color === "brandMid") return style.brandMid || "var(--brand-mid)";
  return color;
}

function renderDesc(text: string, bullet: string, color: string, style: any) {
  if (!text) return "";
  const lines = text.split(/\n/).map(s => s.trim()).filter(Boolean);
  const resolvedColor = resolveColorKeyword(color, style) || "var(--brand)";
  
  if (bullet || lines.length > 1) {
    const symbol = bullet || "•";
    return `<ul style="list-style:none; padding-left:0; margin: 10px 0 0 0; text-align: left;">
      ${lines.map(l => `<li style="display:flex; gap:8px; align-items:flex-start; margin-bottom:4px; font-size:0.9rem;">
        <span style="color:${resolvedColor}; font-weight:bold; flex-shrink:0;">${escapeHtml(symbol)}</span>
        <span>${escapeHtml(l)}</span>
      </li>`).join("")}
    </ul>`;
  }
  return `<p style="margin: 8px 0 0 0; font-size: 0.9rem; color: var(--text-2); text-align: left;">${escapeHtml(text)}</p>`;
}

function renderClientShortcode(type: string, body: string, args: string, style: any) {
  const items = parseShortcodeItems(body);
  if (!items.length) return "";

  const renderAccent = (color: string) => {
    if (!color) return "";
    const res = resolveColorKeyword(color, style);
    return `style="border-color: ${res}; background-color: ${res}0d;"`;
  };

  const renderTextColor = (color: string) => {
    if (!color) return "";
    const res = resolveColorKeyword(color, style);
    return `style="color: ${res};"`;
  };

  const renderCompareNote = (activeNote: string, color: string) => {
    if (!activeNote) return "";
    const metaItems = splitMeta(activeNote);
    const res = resolveColorKeyword(color, style) || "var(--brand)";
    const bgStyle = `style="background: ${res}12; color: ${res}; padding: 10px; border-radius: 6px; font-size: 0.85rem; margin-top: 10px;"`;

    if (metaItems.length > 1) {
      return `<div ${bgStyle}>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; text-align: left;">
          ${metaItems.map(f => `<li style="display: flex; gap: 6px; align-items: flex-start;">
            <span style="color: ${res}; flex-shrink: 0;">•</span>
            <span>${escapeHtml(f)}</span>
          </li>`).join("")}
        </ul>
      </div>`;
    }
    return `<div ${bgStyle}>${escapeHtml(activeNote)}</div>`;
  };

  const colsMatch = (args || "").match(/cols=(\d+)/);
  const bulletMatch = (args || "").match(/bullet=(\S+)/);
  const alignMatch = (args || "").match(/align=(\S+)/);
  const cols = colsMatch ? colsMatch[1] : null;
  const blockBullet = bulletMatch ? bulletMatch[1] : null;
  const layoutAlign = alignMatch ? alignMatch[1] : "center";
  const gridStyle = cols ? `style="grid-template-columns: repeat(${cols}, 1fr);"` : "";
  const itemBullet = (it: any) => it.bullet || blockBullet || null;

  // 1. Grids: icon-grid (+ align variants), feature-grid, badge-grid, stat-grid, skill-list, checkpoint-grid
  if (["icon-grid", "feature-grid", "badge-grid", "stat-grid", "skill-list", "checkpoint-grid"].includes(type)) {
    const isBadge = type === "badge-grid";
    const isFeat = type === "feature-grid";
    const isStat = type === "stat-grid";
    const effectiveAlign = type === "skill-list" ? "left" : type === "checkpoint-grid" ? "row" : layoutAlign;
    const isSkillLayout = !isBadge && !isFeat && !isStat && effectiveAlign === "left";
    const isRowLayout   = !isBadge && !isFeat && !isStat && effectiveAlign === "row";
    const clsName = isBadge ? "badge-grid" : isFeat ? "feature-grid" : isStat ? "stat-grid" : isSkillLayout ? "skill-list" : isRowLayout ? "checkpoint-grid" : "icon-grid";

    return `<div class="${clsName}" ${gridStyle}>${items.map(it => {
      if (isBadge) {
        return `<div class="badge-item" ${renderAccent(it.color)}>
          <div class="badge-icon">${escapeHtml(it.icon)}</div>
          <div class="badge-title" style="color: var(--text);">${escapeHtml(it.title)}</div>
          <div class="badge-tag">${escapeHtml(it.tag)}</div>
        </div>`;
      }
      if (isStat) {
        const borderClr = resolveColorKeyword(it.color, style) || "var(--brand)";
        return `<div class="stat-card" style="border-top: 3px solid ${borderClr}; font-family: var(--font-desc);">
          <div class="stat-val" style="color: ${borderClr}; font-weight: 800; font-size: 2rem; margin-bottom: 5px;">${escapeHtml(it.icon || it.title)}</div>
          ${it.icon ? `<div class="stat-name" style="font-weight: bold; font-size: 0.9rem;">${escapeHtml(it.title)}</div>` : ""}
          ${it.desc ? `<div class="stat-note">${renderDesc(it.desc, itemBullet(it), it.color, style)}</div>` : ""}
        </div>`;
      }
      if (isSkillLayout) {
        const resColor = resolveColorKeyword(it.color, style);
        return `<div class="skill-item" ${renderAccent(it.color)}>
          <div class="skill-icon" ${resColor ? `style="background:${resColor}22; color:${resColor};"` : ""}>${escapeHtml(it.icon)}</div>
          <div class="skill-title" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
          <div class="skill-desc">${renderDesc(it.desc, itemBullet(it), it.color, style)}</div>
        </div>`;
      }
      if (isRowLayout) {
        return `<div class="checkpoint-item">
          <div class="ci-icon">${escapeHtml(it.icon || "📐")}</div>
          <div class="ci-text"><strong>${escapeHtml(it.title)}</strong>${it.desc ? `<br><span style="color:var(--text-2)">${escapeHtml(it.desc)}</span>` : ""}</div>
        </div>`;
      }
      return `<div class="${isFeat ? 'feature-card' : 'icon-card'}" ${renderAccent(it.color)}>
        ${isFeat && it.color ? `<div class="card-top-bar" style="background-color:${resolveColorKeyword(it.color, style)}"></div>` : ''}
        ${it.tag ? `<span class="feature-tag" ${it.color ? `style="background:${resolveColorKeyword(it.color, style)}; color:#fff;"` : ""}>${escapeHtml(it.tag)}</span>` : ""}
        ${isFeat ? `
          <div class="feature-card-title" style="color: var(--brand-dark); font-weight: bold; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
            ${it.icon ? `<span class="fc-icon">${escapeHtml(it.icon)}</span>` : ""}${escapeHtml(it.title)}
          </div>
        ` : `
          <div class="icon-card-icon" style="color: var(--brand); font-size: 2rem; margin-bottom: 10px; text-align: center;">${escapeHtml(it.icon)}</div>
          <div class="icon-card-title" style="color: var(--text); font-weight: bold; text-align: center; margin-bottom: 8px;">${escapeHtml(it.title)}</div>
        `}
        ${renderDesc(it.desc, itemBullet(it), it.color, style)}
      </div>`;
    }).join("")}</div>`;
  }

  // 2. tool-list
  if (type === "tool-list" || type === "tool-box") {
    return items.map(it => {
      const resColor = resolveColorKeyword(it.color, style);
      const grad = resColor ? `linear-gradient(135deg, ${resColor}, ${resColor}cc)` : `var(--brand-gradient)`;
      const metaItems = splitMeta(it.meta);
      return `<div class="tool-card" style="border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin: 15px 0; box-shadow: var(--shadow);">
        <div class="tc-header" style="background: ${grad}; color: #fff; padding: 20px; display: flex; align-items: center; gap: 15px;">
          <div class="tc-icon" style="font-size: 1.8rem; background: rgba(255,255,255,0.2); width: 45px; height: 45px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">${escapeHtml(it.icon)}</div>
          <div>
            <div class="tc-name" style="font-weight: bold; font-size: 1.1rem;">${escapeHtml(it.title)}</div>
            <div style="font-size: 0.85rem; opacity: 0.9;">${escapeHtml(it.desc)}</div>
          </div>
          ${it.tag ? `<div style="margin-left: auto; font-size: 0.75rem; background: rgba(255,255,255,0.25); padding: 3px 10px; border-radius: 100px; font-weight: bold;">${escapeHtml(it.tag)}</div>` : ""}
        </div>
        ${metaItems.length ? `<ul style="padding: 15px 20px 15px 35px; background: #fafafa; font-size: 0.88rem; color: var(--text-2); line-height: 1.8; margin: 0;">${metaItems.map(f => `<li>${escapeHtml(f)}</li>`).join("")}</ul>` : ""}
      </div>`;
    }).join("");
  }

  // 3. workflow-flow
  if (type === "workflow-flow" || type === "workflow-strip") {
    return `<div class="workflow-flow" style="display: flex; gap: 15px; margin: 20px 0; overflow-x: auto; padding-bottom: 5px;">${items.map((it, idx) => `
      <div class="wf-step" ${renderAccent(it.color)} style="flex: 1; min-width: 130px; border: 1px solid var(--border); border-radius: var(--radius); padding: 15px; text-align: center; position: relative;">
        <div class="wf-icon" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 1.2rem; ${it.color ? `background:${resolveColorKeyword(it.color, style)}; color:#fff;` : "background:var(--brand-light); color:var(--brand);" }">${escapeHtml(it.icon)}</div>
        <div class="wf-name" style="font-weight: bold; font-size: 0.95rem; margin-bottom: 4px;" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        <div style="font-size: 0.8rem; color: var(--text-2);">${escapeHtml(it.meta)}</div>
        ${idx < items.length - 1 ? `<div style="position: absolute; right: -12px; top: 50%; transform: translateY(-50%); font-weight: bold; color: #cbd5e1; font-size: 1.2rem; z-index: 1;">→</div>` : ""}
      </div>`).join("")}</div>`;
  }

  // 4. step-list
  if (type === "step-list") {
    return `<div class="step-list" style="display: flex; flex-direction: column; gap: 12px; margin: 20px 0;">${items.map((it, idx) => `
      <div class="step-item" ${renderAccent(it.color)} style="display: flex; gap: 15px; border: 1px solid var(--border); border-radius: var(--radius); padding: 15px; background: #fff; box-shadow: var(--shadow);">
        <div style="width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #fff; flex-shrink: 0; ${it.color ? `background:${resolveColorKeyword(it.color, style)}` : "background:var(--brand)"}">${idx + 1}</div>
        <div>
          <div style="font-weight: bold; font-size: 1rem; margin-bottom: 4px;" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
          ${renderDesc(it.desc, itemBullet(it), it.color, style)}
        </div>
      </div>`).join("")}</div>`;
  }

  // 5. compare-grid
  if (type === "compare-grid") {
    return `<div class="compare-grid" ${gridStyle}>${items.map(it => {
      const activeNote = it.note || it.meta;
      return `
      <div class="compare-card" ${renderAccent(it.color)}>
        <div class="compare-card-title" style="font-weight: bold;" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        ${renderDesc(it.desc, itemBullet(it), it.color, style)}
        ${activeNote ? renderCompareNote(activeNote, it.color) : ""}
      </div>`;
    }).join("")}</div>`;
  }

  // 6. plan-grid
  if (type === "plan-grid") {
    return `<div class="plan-grid" ${gridStyle}>${items.map(it => {
      const isFeat = it.featured === "true" || it.tag === "Best" || it.color;
      const highlight = isFeat ? "plan-featured" : "";
      const resColor = resolveColorKeyword(it.color, style);
      const styleAttr = resColor ? `style="border-color:${resColor}; border-width: 2px;"` : "";
      const topBarStyle = resColor ? `style="background:${resColor};"` : "";
      const metaItems = splitMeta(it.meta);
      
      return `<div class="plan-card ${highlight}" ${styleAttr}>
        <div class="card-top-bar" ${topBarStyle}></div>
        ${it.tag ? `<div class="plan-badge" ${topBarStyle}>${escapeHtml(it.tag)}</div>` : ""}
        <div class="plan-title" style="font-weight: bold;" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        <ul class="plan-features">
          ${metaItems.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
        </ul>
        ${it.note ? `<div class="plan-note" ${topBarStyle}>${escapeHtml(it.note)}</div>` : ""}
      </div>`;
    }).join("")}</div>`;
  }

  // 7. skill-list
  if (type === "skill-list") {
    return `<div class="skill-list" style="display: flex; flex-direction: column; gap: 12px; margin: 20px 0;">${items.map(it => `
      <div class="skill-item" ${renderAccent(it.color)} style="display: flex; align-items: center; gap: 15px; border: 1px solid var(--border); border-radius: var(--radius); padding: 12px 20px;">
        <div class="skill-icon" style="width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; ${it.color ? `background:${resolveColorKeyword(it.color, style)}22; color:${resolveColorKeyword(it.color, style)};` : "background:var(--brand-light); color:var(--brand);" }">${escapeHtml(it.icon)}</div>
        <div style="font-weight: bold; width: 25%; font-size: 0.95rem;" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        <div style="flex: 1; font-size: 0.9rem; color: var(--text-2);">${renderDesc(it.desc, itemBullet(it), it.color, style)}</div>
      </div>`).join("")}</div>`;
  }

  // 8. columns-grid
  if (type === "columns-grid") {
    return `<div class="columns-grid" ${gridStyle}>${items.map(it => {
      const activeNote = it.note || it.meta;
      return `
      <div class="column-card" ${renderAccent(it.color)}>
        <div class="card-top-bar" ${it.color ? `style="background:${resolveColorKeyword(it.color, style)}"` : ""}></div>
        <div class="col-title" style="font-weight: bold;" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        ${renderDesc(it.desc, itemBullet(it), it.color, style)}
        ${activeNote ? renderCompareNote(activeNote, it.color) : ""}
      </div>`;
    }).join("")}</div>`;
  }

  // 9. summary-box
  if (type === "summary-box" || type === "bottom-list") {
    const it = items[0];
    const chips = splitMeta(it.meta);
    return `<div class="summary-box" ${renderAccent(it.color)}>
      <div class="bl-title" style="font-weight: bold; font-size: 1.15rem;" ${renderTextColor(it.color)}>${renderInline(it.title)}</div>
      ${renderDesc(it.desc, itemBullet(it), it.color, style)}
      ${chips.length ? `<div class="bl-chips" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px;">${chips.map(c => `<span class="bl-chip" ${it.color ? `style="background:${it.color}15; color:${it.color}"` : ""}>${escapeHtml(c)}</span>`).join('')}</div>` : ""}
    </div>`;
  }

  // 10. compare-split
  if (type === "compare-split") {
    if (items.length < 2) return renderClientShortcode("compare-grid", body, args, style);
    return `<div class="compare-2col" style="display: flex; gap: 20px; margin: 20px 0;">${items.slice(0, 2).map((it, idx) => {
      const isLeft = idx === 0;
      const bg = isLeft ? `background: ${style.brandLight || '#F0F7FF'}; border-color: ${style.brand || '#2789F5'}; border-width: 2px;` : '';
      const metaItems = splitMeta(it.meta);
      return `<div style="flex: 1; background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 25px; position: relative; overflow: hidden; box-shadow: var(--shadow); ${bg}">
        <div class="card-top-bar" style="background: ${isLeft ? (style.brand || 'var(--brand)') : 'var(--text-2)'}"></div>
        <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 15px; color: ${isLeft ? (style.brandDark || 'var(--brand-dark)') : 'var(--text)'}">${escapeHtml(it.title)}</div>
        ${it.desc ? `<div style="margin-bottom: 10px;">${renderDesc(it.desc, itemBullet(it), it.color, style)}</div>` : ""}
        ${metaItems.length ? `<ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">${metaItems.map(f => `<li style="display:flex; gap:8px;"><span style="color:${isLeft ? (style.brand || 'var(--brand)') : 'var(--text-2)'};">•</span><span>${escapeHtml(f)}</span></li>`).join('')}</ul>` : ""}
      </div>`;
    }).join("")}</div>`;
  }

  // 11. alert-box
  if (type === "alert-box" || type === "info-box") {
    const it = items[0];
    const border = resolveColorKeyword(it.color, style) || "var(--brand)";
    return `<div class="card" style="border-left: 4px solid ${border}; padding: 20px; margin: 15px 0; background: #fafafa; border-radius: var(--radius); border-top: 1px solid var(--border); border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); box-shadow: var(--shadow);">
      <div style="font-weight: bold; font-size: 1rem; color: ${border}; margin-bottom: 5px;">${escapeHtml(it.title || type.toUpperCase())}</div>
      <div style="font-size: 0.9rem; color: var(--text-2);">${escapeHtml(it.desc)}</div>
    </div>`;
  }

  // 12. console-box & cmd-box & editor-box
  if (["console-box", "cmd-box", "editor-box"].includes(type)) {
    const it = items[0] || {};
    const bg = "#0F172A";
    const clr = "#F1F5F9";
    const headerBg = "#1E293B";

    // Fallback: if no structured YAML content (desc is empty), use raw body as code content
    // and parse title/lang from args  e.g. "dev_env (javascript)" → title="dev_env", tag="javascript"
    let titleText = it.title || "";
    let tagText = it.tag || "";
    let descText = it.desc || "";
    if (!descText) {
      const argStr = (args || "").trim();
      const langMatch = argStr.match(/\((\w+)\)/);
      titleText = titleText || argStr.replace(/\(.*?\)/g, "").trim();
      tagText = tagText || (langMatch ? langMatch[1] : "");
      descText = body.trim();
    }

    const title = titleText || (type === "console-box" ? "Console" : type === "cmd-box" ? "Terminal" : "Editor");
    return `<div style="border-radius: var(--radius); overflow: hidden; margin: 20px 0; border: 1px solid var(--border); box-shadow: var(--shadow);">
      <div style="background: ${headerBg}; padding: 8px 16px; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; font-family: var(--font-code); color: #94A3B8;">
        <div style="display: flex; gap: 6px;">
          <span style="width: 10px; height: 10px; border-radius: 50%; background: #EF4444; display: inline-block;"></span>
          <span style="width: 10px; height: 10px; border-radius: 50%; background: #F59E0B; display: inline-block;"></span>
          <span style="width: 10px; height: 10px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
        </div>
        <div style="font-weight: bold;">${escapeHtml(title)}</div>
        <div>${escapeHtml(tagText)}</div>
      </div>
      <pre style="background: ${bg}; color: ${clr}; padding: 20px; font-family: var(--font-code); font-size: 0.85rem; margin: 0; overflow-x: auto; white-space: pre-wrap; word-break: break-all; text-align: left;"><code>${escapeHtml(descText)}</code></pre>
    </div>`;
  }

  // 13. step-flow
  if (type === "step-flow" || type === "flow") {
    return `<div class="step-flow">${items.map(it => {
      if (it.title === "→" || it.icon === "→") {
        return `<div class="step-flow-arrow">→</div>`;
      }
      const activeClass = it.tag === "active" ? "active" : "";
      return `<div class="step-flow-step ${activeClass}">
        <div class="fs-icon">${escapeHtml(it.icon)}</div>
        <div class="fs-title">${escapeHtml(it.title)}</div>
        ${it.meta ? `<div class="fs-meta">${escapeHtml(it.meta)}</div>` : ""}
        ${it.desc ? `<div class="fs-sub">${renderDesc(it.desc, itemBullet(it), it.color, style)}</div>` : ""}
      </div>`;
    }).join("")}</div>`;
  }

  // 14. chapter-list
  if (type === "chapter-list") {
    const getBadgeClass = (tag: string) => {
      const map: Record<string, string> = { "개념": "badge-concept", "도구": "badge-tool", "사례": "badge-case", "가이드": "badge-guide", "실습": "badge-practice", "주의": "badge-warn", "핵심": "badge-practice" };
      return map[tag.trim()] || "badge-concept";
    };
    return `<div class="chapter-list">${items.map(it => `
      <div class="chapter-item">
        <span class="chapter-num">${escapeHtml(it.icon)}</span>
        <div class="chapter-title">
          <strong>${escapeHtml(it.title)}</strong>
          ${it.desc ? `<span class="chapter-desc">${escapeHtml(it.desc)}</span>` : ""}
        </div>
        ${it.tag && it.tag.trim() !== "" ? `<span class="chapter-badge ${getBadgeClass(it.tag)}">${escapeHtml(it.tag)}</span>` : ""}
      </div>`).join("")}</div>`;
  }

  // 15. level-grid
  if (type === "level-grid") {
    return `<div class="level-grid">${items.map(it => {
      const activeClass = it.tag === "highlight" || it.featured === "true" ? "highlight" : "";
      return `<div class="level-card ${activeClass}">
        <div class="level-num">${escapeHtml(it.title)}</div>
        <div class="level-name">${it.desc ? renderDesc(it.desc, itemBullet(it), it.color, style) : ""}</div>
        ${it.meta ? `<div class="level-tool">${escapeHtml(it.meta)}</div>` : ""}
        ${it.note ? `<div class="level-desc">${escapeHtml(it.note)}</div>` : ""}
      </div>`;
    }).join("")}</div>`;
  }

  // 16. git-flow
  if (type === "git-flow" || type === "git-flow-strip") {
    return `<div class="git-flow-container"><div class="flow-branches">${items.map(it => {
      const color = it.color || "var(--brand)";
      const tags = it.tag ? it.tag.split("|").map((t: string) => t.trim()) : [];
      const metas = it.meta ? it.meta.split("|").map((m: string) => m.trim()) : [];
      const count = Math.max(tags.length, metas.length, 1);
      const commitsHtml = Array.from({ length: count }).map((_, idx) => {
        const tag = tags[idx] || "";
        const meta = metas[idx] || "";
        return `
          <div class="commit" style="border-color:${color};">
            ${tag ? `<span class="commit-label" style="background:${color};">${escapeHtml(tag)}</span>` : ""}
            ${meta ? `<span class="commit-desc">${escapeHtml(meta)}</span>` : ""}
          </div>
          ${idx < count - 1 ? `<div class="commit-line-segment" style="background:${color};"></div>` : ""}
        `;
      }).join("");
      return `<div class="branch-row">
        <div class="branch-label" style="background:${color}12; border-left:4px solid ${color}; color:${color}; font-weight:800;">${escapeHtml(it.title)}</div>
        <div class="branch-line">${commitsHtml}</div>
      </div>`;
    }).join("")}</div></div>`;
  }

  // 17. before-after / compare-diff
  if (type === "before-after" || type === "compare-diff" || type === "compare-before-after") {
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
  }

  // 18. network-box
  if (type === "network-box") {
    const mainNode = items[0] || {};
    const subNodes = items.slice(1);
    const color = resolveColorKeyword(mainNode.color, style) || "var(--brand)";
    return `<div class="graph-visual">
      <div class="graph-nodes">
        <div class="node node-main" style="background: ${color}; box-shadow: 0 0 24px ${color}88;">${escapeHtml(mainNode.title)}</div>
        ${subNodes.map((n: any, i: number) => {
          const subColor = resolveColorKeyword(n.color, style) || "var(--brand-dark)";
          return `<div class="node node-${i + 1}" style="border: 2px solid ${subColor}; color: ${subColor};">
            ${escapeHtml(n.title)}${n.meta ? `<span style="font-size:0.7rem;opacity:0.6;display:block;">${escapeHtml(n.meta)}</span>` : ""}
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }

  // 19. faq-list
  if (type === "faq-list") {
    return `<div class="faq-list">${items.map((it: any) => `
      <div class="faq-item">
        <button class="faq-q" onclick="this.closest('.faq-item').classList.toggle('open')">
          <span>${escapeHtml(it.title)}</span>
          <span class="faq-arrow">▼</span>
        </button>
        <div class="faq-a"><p style="margin:0;font-size:0.9rem;color:var(--text-2);">${escapeHtml(it.desc)}</p></div>
      </div>`).join("")}</div>`;
  }

  // 20. os-tabs
  if (type === "os-tabs") {
    const uid = "t" + Math.random().toString(36).slice(2, 7);
    const switchFn = `(function(btn,id){var w=btn.closest('.tabs-wrap');w.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active')});w.querySelectorAll('.tab-panel').forEach(function(p){p.classList.remove('active')});btn.classList.add('active');var panel=document.getElementById(id);if(panel)panel.classList.add('active');})`;
    return `<div class="tabs-wrap">
      <div class="tabs-nav">
        ${items.map((it: any, i: number) => `<button class="tab-btn${i === 0 ? " active" : ""}" onclick="${switchFn}(this,'${uid}-${i}')">${escapeHtml(it.title || it.tag || `탭 ${i+1}`)}</button>`).join("")}
      </div>
      ${items.map((it: any, i: number) => `<div class="tab-panel${i === 0 ? " active" : ""}" id="${uid}-${i}">${it.desc ? `<p style="margin:0;font-size:0.9rem;color:var(--text-2);">${escapeHtml(it.desc).replace(/\n/g, "<br>")}</p>` : ""}</div>`).join("")}
    </div>`;
  }

  // 21. takeaway-banner
  if (type === "takeaway-banner" || type === "takeaway") {
    const it = items[0] || {};
    return `<div class="takeaway-banner">
      <div class="ta-icon">${escapeHtml(it.icon || "💡")}</div>
      <div>
        <div class="ta-label">${escapeHtml(it.title || "Key Takeaway")}</div>
        <div class="ta-text">${escapeHtml(it.desc).replace(/\n/g, "<br>")}</div>
      </div>
    </div>`;
  }

  // 22. summary-bar
  if (type === "summary-bar") {
    return `<div class="summary-bar">${items.map((it: any) => {
      const rawNum = it.icon || "";
      const numMatch = rawNum.match(/^(\d+(?:\.\d+)?(?:[Kk]\+?|\+)?)\s*(.*)$/);
      const val = numMatch ? numMatch[1] : rawNum;
      const unit = numMatch ? numMatch[2] : "";
      return `<div class="summary-item">
        <span class="summary-num">${escapeHtml(val)}${unit ? `<span class="summary-unit">${escapeHtml(unit)}</span>` : ""}</span>
        <span class="summary-label">${escapeHtml(it.title)}</span>
      </div>`;
    }).join("")}</div>`;
  }

  // 23. part-banner / part-deck
  if (type === "part-banner" || type === "part-deck") {
    return items.map((it: any) => {
      const color = resolveColorKeyword(it.color, style) || "var(--brand)";
      return `<div class="part-banner">
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
  }

  // Fallback for unrecognised shortcodes
  return `<div class="card" style="padding:20px; margin:15px 0; border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow);">
    <div style="font-weight:bold; color:var(--brand); margin-bottom:10px;">[Shortcode: ${type}]</div>
    <ul style="list-style:none; padding:0; margin:0;">
      ${items.map(it => `
        <li style="margin-bottom:8px; border-bottom:1px solid #f0f0f0; padding-bottom:8px; text-align: left;">
          <strong>${escapeHtml(it.title)}</strong> ${it.tag ? `[${it.tag}]` : ""}
          <div style="font-size:0.9rem; color:var(--text-2); margin-top:4px;">${escapeHtml(it.desc)}</div>
        </li>
      `).join("")}
    </ul>
  </div>`;
}

export function clientCompileMarkdown(md: string, mode: "html" | "presentation", styleName: string, stylesList: any) {
  const resolvedStyles = (stylesList && Object.keys(stylesList).length > 0) ? stylesList : FALLBACK_STYLES;
  const style = resolvedStyles[styleName] || resolvedStyles["custom-blue"];

  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const body = match ? md.slice(match[0].length) : md;
  const title = match ? (match[1].match(/title:\s*(.*)/)?.[1] || "Guide").replace(/^["']|["']$/g, "") : "Guide";
  const subtitle = match ? (match[1].match(/subtitle:\s*(.*)/)?.[1] || "").replace(/^["']|["']$/g, "") : "";

  const shortcodeCompiled = body.replace(/:::\s*([a-zA-Z0-9_-]+)(.*?)\r?\n([\s\S]*?)\r?\n:::/g, (match, type, args, content) => {
    const html = renderClientShortcode(type.trim(), content, args.trim(), style);
    // CommonMark: HTML block terminates at first blank line (whitespace-only line).
    // Remove whitespace-only lines and collapse multi-newlines to prevent premature termination.
    const cleanHtml = html.replace(/^[ \t]+$/gm, "").replace(/\n{2,}/g, "\n");
    return `\n\n${cleanHtml}\n\n`;
  });

  if (mode === "presentation") {
    // Build slide list: frontmatter cover → h1(cover) / h2(content) / ---( break)
    const slideList: Array<{type: 'cover'|'content', title: string, body: string}> = [];
    slideList.push({ type: 'cover', title, body: subtitle });
    const tokens = (marked as any).lexer(shortcodeCompiled);
    let curSlide: {type: 'cover'|'content', title: string, body: string} | null = null;
    const flush = () => { if (curSlide && (curSlide.body.trim() || curSlide.title.trim())) { slideList.push(curSlide); } curSlide = null; };
    for (const tok of tokens) {
      if (tok.type === 'heading' && (tok as any).depth === 1) { flush(); curSlide = { type: 'cover', title: tok.text || '', body: '' }; }
      else if (tok.type === 'heading' && (tok as any).depth === 2) { flush(); curSlide = { type: 'content', title: tok.text || '', body: '' }; }
      else if (tok.type === 'hr') { flush(); }
      else if (tok.type !== 'space') { if (!curSlide) curSlide = { type: 'content', title: '', body: '' }; curSlide.body += (marked as any).parser([tok]); }
    }
    flush();
    const total = slideList.length;
    const slidesHtml = slideList.map((s, idx) => {
      if (s.type === 'cover') {
        return `<div class="slide cover"><h1>${renderInline(s.title)}</h1>${s.body ? `<div class="cover-body">${s.body}</div>` : ''}</div>`;
      }
      return `<div class="slide content"><header class="slide-header"><h2>${renderInline(s.title)}</h2><span class="slide-num">${idx + 1} / ${total}</span></header><div class="slide-body">${s.body}</div></div>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Noto+Serif+KR:wght@700&family=JetBrains+Mono&display=swap" rel="stylesheet">
<style>
  :root {
    --brand:       ${style.brand || '#6366F1'};
    --brand-dark:  ${style.brandDark || '#4F46E5'};
    --brand-deep:  ${style.brandDeep || '#3730A3'};
    --brand-light: ${style.brandLight || '#EEF0FE'};
    --brand-mid:   ${style.brandMid || '#D8DCFB'};
    --brand-gradient: linear-gradient(135deg, ${style.brandDeep || '#3730A3'}, ${style.brandDark || '#4F46E5'});
    --bg: #0b0d12; --card-bg: #11141b;
    --text: #f8fafc; --text-2: rgba(255,255,255,0.78); --text-3: #94a3b8; --text-muted: #94a3b8;
    --border: rgba(255,255,255,0.08);
    --radius: 12px;
    --font-title: ${style.webFontTitle || "'Noto Serif KR', serif"};
    --font-desc:  ${style.webFont || "'Noto Sans KR', sans-serif"};
    --font-note:  'JetBrains Mono', monospace; --font-code: 'JetBrains Mono', monospace;
    --font-scale: 1.0;
    --size-h1: ${HSZ_PRES['h1'] || '3rem'}; --size-h2: ${HSZ_PRES['h2'] || '2.6rem'}; --size-h3: ${HSZ_PRES['h3'] || '1.8rem'};
    --size-body-p: ${HSZ_PRES['body-p'] || '1.3rem'}; --size-card-title: ${HSZ_PRES['card-title'] || '1.45rem'}; --size-card-p: ${HSZ_PRES['card-p'] || '1.2rem'};
    --size-stat-val: ${HSZ_PRES['stat-val'] || '2.6rem'}; --size-stat-name: ${HSZ_PRES['stat-name'] || '1.2rem'}; --size-stat-note: ${HSZ_PRES['stat-note'] || '1.1rem'};
    --size-plan-badge: ${HSZ_PRES['plan-badge'] || '0.8rem'}; --size-plan-features: ${HSZ_PRES['plan-features'] || '1.1rem'}; --font-tag: 'Noto Sans KR', sans-serif;
    --shadow: 0 4px 24px rgba(0,0,0,0.25); --shadow-lg: 0 8px 40px rgba(0,0,0,0.3);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font-desc), sans-serif; background: var(--bg); color: var(--text); overflow: hidden; width: 100vw; height: 100vh; }
  .slides-container { display: flex; width: 100vw; height: 100vh; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none; }
  .slides-container::-webkit-scrollbar { display: none; }
  .slide { flex: 0 0 100vw; width: 100vw; height: 100vh; scroll-snap-align: start; display: flex; flex-direction: column; padding: 80px 100px; box-sizing: border-box; overflow-y: auto; background: var(--bg); }
  .slide.cover { justify-content: center; align-items: center; background: linear-gradient(135deg, var(--brand-deep), var(--brand-dark)); text-align: center; }
  .slide.cover h1 { font-family: var(--font-title); font-size: calc(var(--size-h1)*var(--font-scale)); font-weight: 900; color: #fff; margin-bottom: 24px; text-shadow: 0 4px 16px rgba(0,0,0,0.3); }
  .cover-body { max-width: 900px; margin: 20px auto 0; color: var(--brand-light); }
  .cover-body p { font-size: calc(1.4rem*var(--font-scale)); line-height: 1.8; margin-bottom: 16px; color: var(--brand-light); }
  .slide.content { justify-content: flex-start; align-items: flex-start; }
  .slide-header { width: 100%; border-bottom: 2px solid var(--brand); padding-bottom: 20px; margin-bottom: 40px; display: flex; align-items: center; justify-content: space-between; }
  .slide-header h2 { font-family: var(--font-title); font-size: calc(var(--size-h2)*var(--font-scale)); color: rgba(255,255,255,0.95); font-weight: 700; }
  .slide-num { font-family: var(--font-note); font-size: 1.1rem; color: var(--text-muted); }
  .slide-body { width: 100%; flex: 1; font-size: calc(1.3rem*var(--font-scale)); line-height: 1.8; }
  .slide-body h3 { font-family: var(--font-title); font-size: calc(var(--size-h3)*var(--font-scale)); color: var(--brand-light); margin: 20px 0 12px; }
  .slide-body p { color: var(--text-2); margin-bottom: 14px; }
  .slide-body ul,.slide-body ol { padding-left: 24px; margin-bottom: 14px; }
  .slide-body li { margin-bottom: 8px; color: var(--text-2); }
  .slide-body strong { color: #fff; font-weight: 700; }
  .slide-body pre { background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0; padding: 16px; border-radius: 8px; font-family: var(--font-code); font-size: 0.9rem; overflow-x: auto; margin: 14px 0; }
  .slide-body code { background: rgba(255,255,255,0.1); color: var(--brand-light); padding: 2px 6px; border-radius: 4px; font-size: 0.85em; font-family: var(--font-code); }
  .slide-body pre code { background: none; }
  .slide-body table { width: 100%; border-collapse: collapse; margin: 14px 0; }
  .slide-body th { background: var(--brand); color: #fff; padding: 10px 14px; text-align: center; font-size: 0.9rem; font-weight: 700; }
  .slide-body td { padding: 8px 14px; border-bottom: 1px solid rgba(255,255,255,0.07); color: var(--text-2); text-align: center; }
  /* ── shortcode card shared CSS (same as guide HTML, dark overrides below) ── */
  .icon-grid,.feature-grid,.compare-grid,.plan-grid,.columns-grid,.badge-grid { display:grid; gap:20px; margin:20px 0; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); }
  .icon-card,.feature-card,.compare-card,.column-card,.plan-card,.summary-box,.badge-item { background:var(--card-bg); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius); padding:20px; position:relative; overflow:hidden; }
  .card-top-bar { height:4px; background:var(--brand); position:absolute; top:0; left:0; right:0; }
  .feature-tag { position:absolute; top:10px; right:10px; font-size:0.7rem; font-weight:bold; padding:2px 8px; border-radius:100px; background:rgba(255,255,255,0.1); color:var(--brand-light); }
  .icon-wrap { font-size:2rem; margin-bottom:12px; }
  .icon-card-title,.feature-card-title,.compare-card-title,.col-title { font-family:var(--font-title); font-size:var(--size-card-title); font-weight:700; color:var(--text); margin-bottom:8px; }
  .icon-card p,.feature-card p,.compare-card p,.column-card p { font-size:var(--size-card-p); color:var(--text-muted); margin:0; line-height:1.55; }
  /* step-flow */
  .step-flow { display:flex; align-items:stretch; gap:15px; overflow-x:auto; padding-bottom:8px; }
  .step-flow-step { flex:1; min-width:130px; background:var(--card-bg); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius); padding:18px; text-align:center; display:flex; flex-direction:column; align-items:center; }
  .step-flow-step.active { border-color:var(--brand); }
  .fs-icon { width:45px; height:45px; margin:0 auto 10px; background:rgba(255,255,255,0.06); color:var(--brand); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.3rem; }
  .step-flow-step.active .fs-icon { background:var(--brand); color:#fff; }
  .fs-title { font-weight:800; font-size:1rem; margin-bottom:5px; color:var(--text); }
  .fs-meta { font-size:0.75rem; color:var(--text-muted); margin-top:4px; }
  .fs-sub { font-size:0.9rem; color:var(--text-muted); margin:0; }
  .step-flow-arrow { display:flex; align-items:center; justify-content:center; font-weight:900; color:rgba(255,255,255,0.2); font-size:1.5rem; flex-shrink:0; }
  /* stat-grid */
  .stat-grid { display:grid; gap:20px; margin:20px 0; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); }
  .stat-card { background:var(--card-bg); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius); padding:24px; text-align:center; }
  .stat-val { font-family:var(--font-title); font-size:2.4rem; font-weight:900; color:var(--brand); }
  .stat-name { font-size:1rem; font-weight:600; color:var(--text); margin:6px 0 4px; }
  .stat-note { font-size:0.85rem; color:var(--text-muted); }
  /* alert-box */
  .alert-box { border-left:4px solid var(--brand); background:rgba(255,255,255,0.04); padding:16px 20px; border-radius:var(--radius); margin:14px 0; }
  .alert-body p { color:var(--text-2); }
  /* summary-box */
  .summary-box { background:var(--card-bg); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius); padding:20px; }
  .summary-box p { color:var(--text-muted); }
  /* takeaway-banner */
  .takeaway-banner { display:flex; gap:16px; align-items:flex-start; background:linear-gradient(135deg,var(--brand-deep),var(--brand-dark)); border-radius:var(--radius); padding:24px 32px; margin:20px 0; color:#fff; }
  .ta-icon { font-size:1.8rem; line-height:1.2; flex-shrink:0; }
  .ta-label { font-size:1rem; font-weight:800; color:#fff; margin-bottom:6px; }
  .ta-text { font-size:0.92rem; color:rgba(255,255,255,0.8); line-height:1.6; }
  /* badge-grid */
  .badge-grid { display:flex; flex-wrap:wrap; gap:10px; margin:16px 0; }
  .badge-item { padding:6px 16px; border-radius:100px; font-size:0.85rem; font-weight:600; background:rgba(255,255,255,0.08); color:var(--text); border:none; }
  /* faq-list, step-list */
  .faq-list { margin:16px 0; }
  .step-list { margin:16px 0; }
  .faq-item { background:var(--card-bg); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius); margin-bottom:10px; overflow:hidden; }
  .step-item { background:var(--card-bg); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius); padding:16px 20px; margin-bottom:10px; }
  .faq-q { width:100%; display:flex; justify-content:space-between; align-items:center; padding:16px 20px; background:transparent; border:none; cursor:pointer; font-size:0.95rem; font-weight:700; color:var(--text); text-align:left; gap:12px; font-family:inherit; }
  .faq-q:hover { background:rgba(255,255,255,0.05); }
  .faq-item.open .faq-q { color:var(--brand); }
  .faq-arrow { transition:transform 0.2s; font-size:0.7rem; opacity:0.5; flex-shrink:0; }
  .faq-item.open .faq-arrow { transform:rotate(180deg); opacity:1; }
  .faq-a { display:none; padding:0 20px 16px; color:var(--text-muted); font-size:0.95rem; }
  .faq-item.open .faq-a { display:block; }
  .step-title { font-weight:700; color:var(--text); margin-bottom:6px; }
  .step-desc { color:var(--text-muted); font-size:0.95rem; }
  /* os-tabs */
  .tabs-wrap { margin:16px 0; border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius); overflow:hidden; }
  .tabs-nav { display:flex; background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.08); overflow-x:auto; }
  .tab-btn { padding:11px 20px; background:transparent; border:none; border-bottom:2px solid transparent; cursor:pointer; font-size:0.9rem; font-weight:600; color:var(--text-muted); white-space:nowrap; transition:0.15s; font-family:inherit; margin-bottom:-1px; }
  .tab-btn.active { color:var(--brand); border-bottom-color:var(--brand); }
  .tab-btn:hover:not(.active) { color:var(--text); }
  .tab-panel { display:none; padding:24px; }
  .tab-panel.active { display:block; }
  /* skill-list (align=left) */
  .skill-list { display:flex; flex-direction:column; gap:15px; margin:20px 0; }
  .skill-item { display:flex; align-items:center; gap:20px; background:var(--card-bg); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius); padding:15px 25px; }
  .skill-icon { width:40px; height:40px; background:rgba(255,255,255,0.08); color:var(--brand); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0; }
  .skill-title { font-weight:800; font-size:1rem; width:30%; color:var(--text); }
  .skill-desc { font-size:0.9rem; color:var(--text-muted); flex:1; }
  /* checkpoint-grid (align=row) */
  .checkpoint-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px; margin:20px 0; }
  .checkpoint-item { display:flex; align-items:center; gap:16px; background:var(--card-bg); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius); padding:18px; }
  .ci-icon { font-size:1.6rem; display:flex; align-items:center; justify-content:center; flex-shrink:0; width:42px; height:42px; background:rgba(255,255,255,0.08); border-radius:50%; color:var(--brand); }
  .ci-text { font-size:0.9rem; color:var(--text); line-height:1.4; }
  .ci-text strong { font-size:1rem; font-weight:700; color:var(--brand-light); }
  /* compare-diff */
  .compare-diff { display:flex; flex-direction:column; gap:20px; margin:20px 0; }
  .before-box,.after-box { display:flex; flex-direction:column; gap:8px; }
  .before-box { border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:20px; }
  .ba-label { font-weight:800; font-size:1rem; color:var(--text); }
  .ba-content { font-size:0.92rem; color:var(--text-muted); line-height:1.6; }
  /* network-box */
  .graph-visual { background:#0A0F1E; border-radius:var(--radius); height:280px; position:relative; margin:20px 0; overflow:hidden; }
  .graph-nodes { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; gap:20px; flex-wrap:wrap; padding:20px; }
  .node { border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:0.85rem; font-weight:700; text-align:center; padding:10px; }
  .node-main { width:90px; height:90px; color:#fff; font-size:0.95rem; }
  /* summary-bar */
  .summary-bar { margin:20px 0; padding:24px; background:rgba(255,255,255,0.05); border-radius:var(--radius); border:1px solid rgba(255,255,255,0.08); display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:20px; }
  .summary-item { display:flex; flex-direction:column; gap:4px; }
  .summary-num { font-family:var(--font-note); font-size:1.8rem; font-weight:700; color:var(--brand); line-height:1; }
  .summary-unit { font-size:0.75rem; font-weight:300; color:var(--text-muted); margin-left:2px; }
  .summary-label { font-size:0.8rem; color:var(--text-muted); }
  /* part-banner */
  .part-banner { margin-bottom:20px; }
  .part-banner-header { display:flex; align-items:center; border-radius:var(--radius); overflow:hidden; }
  .part-banner-num-block { width:52px; height:52px; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:0.85rem; font-weight:500; color:white; }
  .part-banner-title-block { flex:1; height:52px; display:flex; align-items:center; padding:0 20px; gap:12px; }
  .part-banner-title-text { font-size:0.95rem; font-weight:600; color:white; }
  .part-banner-tagline { font-size:0.8rem; color:rgba(255,255,255,0.7); font-weight:300; }
  .part-banner-chapter-range { font-size:0.75rem; color:rgba(255,255,255,0.5); margin-left:auto; letter-spacing:0.05em; }
  /* level-grid */
  .level-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:16px; margin:20px 0; }
  .level-card { background:var(--card-bg); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius); padding:20px; text-align:center; }
  .level-num { font-size:1.25rem; font-weight:900; color:var(--brand); margin-bottom:8px; }
  .level-name { font-size:0.95rem; font-weight:700; color:var(--text); }
  .level-desc { font-size:0.78rem; color:var(--text-muted); font-style:italic; margin-top:8px; }
  /* git-flow */
  .git-flow-container { background:#0F172A; padding:28px; border-radius:var(--radius); border:1px solid rgba(255,255,255,0.08); overflow-x:auto; }
  .flow-branches { display:flex; flex-direction:column; gap:20px; min-width:600px; }
  .branch-row { display:grid; grid-template-columns:140px 1fr; gap:20px; align-items:center; min-height:80px; }
  .branch-label { padding:8px 16px; border-radius:8px; font-size:0.9rem; text-align:center; }
  .branch-line { display:flex; align-items:center; flex:1; height:32px; position:relative; padding:0 10%; }
  .commit { width:18px; height:18px; background:#0F172A; border:3px solid var(--brand); border-radius:50%; position:relative; flex-shrink:0; }
  .commit-label { position:absolute; bottom:24px; left:50%; transform:translateX(-50%); color:#fff; font-size:0.72rem; font-weight:800; padding:2px 8px; border-radius:100px; white-space:nowrap; }
  .commit-desc { position:absolute; top:24px; left:50%; transform:translateX(-50%); color:#94A3B8; font-size:0.72rem; white-space:nowrap; }
  .commit-line-segment { flex:1; height:3px; min-width:30px; }
  /* nav buttons */
  .nav-btn { position:fixed; bottom:40px; z-index:1000; width:48px; height:48px; border-radius:50%; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); color:#fff; font-size:1.4rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:0.2s; backdrop-filter:blur(8px); }
  .nav-btn:hover { background:rgba(255,255,255,0.16); }
  .prev-btn { left:40px; } .next-btn { right:40px; }
</style>
</head>
<body>
<div class="slides-container" id="slidesContainer">${slidesHtml}</div>
<button class="nav-btn prev-btn" id="btnPrev">&#8592;</button>
<button class="nav-btn next-btn" id="btnNext">&#8594;</button>
<script>
  var currentIdx = 0;
  var container = document.getElementById('slidesContainer');
  var slides = container.querySelectorAll('.slide');
  var btnPrev = document.getElementById('btnPrev');
  var btnNext = document.getElementById('btnNext');
  function scrollToSlide(idx) {
    if (idx < 0 || idx >= slides.length) return;
    currentIdx = idx;
    container.scrollTo({ left: idx * window.innerWidth, behavior: 'smooth' });
    btnPrev.style.opacity = idx === 0 ? '0.3' : '1';
    btnNext.style.opacity = idx === slides.length - 1 ? '0.3' : '1';
  }
  btnPrev.addEventListener('click', function() { scrollToSlide(currentIdx - 1); });
  btnNext.addEventListener('click', function() { scrollToSlide(currentIdx + 1); });
  window.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); scrollToSlide(currentIdx + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); scrollToSlide(currentIdx - 1); }
    else if (e.key === 'Home') { e.preventDefault(); scrollToSlide(0); }
    else if (e.key === 'End') { e.preventDefault(); scrollToSlide(slides.length - 1); }
  });
  var scrollTimer;
  container.addEventListener('scroll', function() {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
      var idx = Math.round(container.scrollLeft / window.innerWidth);
      if (idx !== currentIdx) { currentIdx = idx; }
    }, 100);
  });
  scrollToSlide(0);
</script>
</body>
</html>`;
  }

  const bodyHtml = marked.parse(shortcodeCompiled) as string;

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Noto+Serif+KR:wght@700&family=JetBrains+Mono&display=swap" rel="stylesheet">
<style>
  :root {
    --brand:      ${style.brand || '#2789F5'};
    --brand-dark: ${style.brandDark || '#1E71CE'};
    --brand-deep: ${style.brandDeep || '#0F478F'};
    --brand-light:${style.brandLight || '#F0F7FF'};
    --brand-mid:  ${style.brandMid || '#D2E5FA'};
    --brand-gradient: linear-gradient(135deg, ${style.brand || '#2789F5'}, ${style.brandDeep || '#0F478F'});
    --border:     ${style.border || '#D2E5FA'};
    --bg:         ${style.bg || '#F8FAFC'};
    --text:   #1A1A2E; --text-2: #475569; --text-3: #8892B0;
    --shadow:    0 4px 24px rgba(0,0,0,0.06);
    --shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
    --radius: 12px;

    --font-title: ${style.webFontTitle || "'Noto Serif KR', serif"};
    --font-desc:  ${style.webFont || "'Noto Sans KR', sans-serif"};
    --font-note:  'JetBrains Mono', monospace;
    --font-code:  'JetBrains Mono', monospace;
    --font-tag:   ${style.webFont || "'Noto Sans KR', sans-serif"};
    --font-scale: 1.0;

    --size-h1: ${HSZ_GUIDE['h1'] || '2.2rem'};
    --size-h2: ${HSZ_GUIDE['h2'] || '1.8rem'};
    --size-h3: ${HSZ_GUIDE['h3'] || '1.4rem'};
    --size-body-p: ${HSZ_GUIDE['body-p'] || '0.95rem'};
    --size-card-title: ${HSZ_GUIDE['card-title'] || '1.15rem'};
    --size-card-p: ${HSZ_GUIDE['card-p'] || '0.92rem'};
    --size-stat-val: ${HSZ_GUIDE['stat-val'] || '2.4rem'};
    --size-stat-name: ${HSZ_GUIDE['stat-name'] || '1.1rem'};
    --size-stat-note: ${HSZ_GUIDE['stat-note'] || '0.8rem'};
    --size-plan-badge: ${HSZ_GUIDE['plan-badge'] || '0.75rem'};
    --size-plan-features: ${HSZ_GUIDE['plan-features'] || '0.95rem'};
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font-desc), sans-serif; background: var(--bg); color: var(--text); line-height: 1.7; padding: 30px 20px; }

  /* Container layout */
  .container { max-width: 1100px; margin: 0 auto; background: #fff; padding: 40px; border-radius: var(--radius); border: 1px solid var(--border); box-shadow: var(--shadow); }
  
  h1 { font-family: var(--font-title); font-size: var(--size-h1); color: var(--brand-dark); margin-bottom: 20px; border-bottom: 2px solid var(--brand-light); padding-bottom: 8px; }
  h2 { font-family: var(--font-title); font-size: var(--size-h2); color: var(--text); margin-top: 30px; margin-bottom: 15px; }
  h3 { font-family: var(--font-title); font-size: var(--size-h3); color: var(--brand-deep); margin-top: 20px; margin-bottom: 10px; }
  p { font-size: var(--size-body-p); color: var(--text-2); margin-bottom: 15px; }
  ul, ol { margin-bottom: 15px; padding-left: 20px; }
  li { margin-bottom: 6px; font-size: var(--size-body-p); }
  
  /* Grids and Cards */
  .icon-grid, .feature-grid, .compare-grid, .plan-grid, .columns-grid { display: grid; gap: 20px; margin: 20px 0; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
  
  .icon-card, .feature-card, .compare-card, .column-card, .plan-card, .summary-box, .badge-item { 
    background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; 
    position: relative; overflow: hidden; transition: 0.2s; box-shadow: var(--shadow);
  }
  .card-top-bar { height: 4px; background: var(--brand); position: absolute; top: 0; left: 0; right: 0; }
  .feature-tag { position: absolute; top: 10px; right: 10px; font-size: 0.7rem; font-weight: bold; padding: 2px 8px; border-radius: 100px; background: var(--brand-light); color: var(--brand-dark); }
  
  /* step-flow */
  .step-flow { display: flex; align-items: stretch; gap: 15px; margin: 25px 0; overflow-x: auto; padding-bottom: 10px; }
  .step-flow-step { flex: 1; min-width: 140px; background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; text-align: center; display: flex; flex-direction: column; align-items: center; box-shadow: var(--shadow); }
  .step-flow-step.active { border-color: var(--brand); }
  .fs-icon { width: 45px; height: 45px; margin: 0 auto 10px; background: var(--brand-light); color: var(--brand); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
  .step-flow-step.active .fs-icon { background: var(--brand); color: #fff; }
  .fs-title { font-weight: 800; font-size: 1rem; margin-bottom: 5px; color: var(--text); }
  .fs-meta { font-size: 0.75rem; color: var(--text-3); margin-top: 4px; }
  .fs-sub { font-size: 0.9rem; color: var(--text-2); margin: 0; }
  .step-flow-arrow { display: flex; align-items: center; justify-content: center; font-weight: 900; color: #cbd5e1; font-size: 1.5rem; flex-shrink: 0; }

  /* chapter-list */
  .chapter-list { margin-top: 0; border-left: 2px solid var(--border); margin-left: 26px; padding-left: 15px; }
  .chapter-item { display: flex; align-items: baseline; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .chapter-item:last-child { border-bottom: none; }
  .chapter-num { font-size: 11px; color: var(--text-3); min-width: 38px; flex-shrink: 0; }
  .chapter-title { font-size: 14px; color: var(--text-2); flex: 1; line-height: 1.45; }
  .chapter-title strong { font-weight: 600; color: var(--text); }
  .chapter-desc { font-size: 11px; color: var(--text-3); margin-top: 2px; display: block; }
  .chapter-badge { font-size: 10px; padding: 2px 8px; border-radius: 100px; flex-shrink: 0; font-weight: 500; }
  .badge-concept { background: #e8f0fe; color: #1a3a8c; }
  .badge-tool { background: #f0fce8; color: #1a5c20; }
  .badge-case { background: #fef3e8; color: #7c3a00; }
  .badge-guide { background: #f8e8fe; color: #5c007c; }
  .badge-practice { background: #e8fef3; color: #007c3a; }
  .badge-warn { background: #fee8e8; color: #7c0000; }

  /* level-grid */
  .level-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin: 25px 0; }
  .level-card { background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; text-align: center; box-shadow: var(--shadow); display: flex; flex-direction: column; }
  .level-card.highlight { border-color: var(--brand); background: var(--brand-light); }
  .level-num { font-size: 1.25rem; font-weight: 900; color: var(--brand); margin-bottom: 8px; }
  .level-card.highlight .level-num { color: var(--brand-dark); }
  .level-name { font-size: 0.95rem; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .level-name p { margin: 0; }
  .level-tool { font-size: 0.85rem; color: var(--text-2); font-weight: 500; margin-bottom: 8px; }
  .level-desc { font-size: 0.78rem; color: var(--text-3); font-style: italic; margin-top: auto; border-top: 1px dashed var(--border); padding-top: 8px; }

  /* git-flow */
  .git-flow-container { background: #0F172A; padding: 28px; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.08); margin: 25px 0; overflow-x: auto; }
  .flow-branches { display: flex; flex-direction: column; gap: 20px; min-width: 600px; }
  .branch-row { display: grid; grid-template-columns: 140px 1fr; gap: 20px; align-items: center; min-height: 80px; }
  .branch-label { padding: 8px 16px; border-radius: 8px; font-size: 0.9rem; text-align: center; }
  .branch-line { display: flex; align-items: center; flex: 1; height: 32px; position: relative; padding: 0 10%; }
  .commit { width: 18px; height: 18px; background: #0F172A; border: 3px solid var(--brand); border-radius: 50%; position: relative; flex-shrink: 0; }
  .commit-label { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); color: #fff; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 100px; white-space: nowrap; }
  .commit-desc { position: absolute; top: 24px; left: 50%; transform: translateX(-50%); color: #94A3B8; font-size: 0.72rem; white-space: nowrap; }
  .commit-line-segment { flex: 1; height: 3px; min-width: 30px; }

  /* Pre and code */
  pre { background: #0F172A; color: #F1F5F9; padding: 15px; border-radius: 8px; font-family: var(--font-code); font-size: 0.85rem; overflow-x: auto; margin: 15px 0; }
  code { font-family: var(--font-code); font-size: 0.9em; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: var(--brand-deep); }
  pre code { background: none; padding: 0; color: inherit; }
  
  /* Skill List (icon-grid align=left) */
  .skill-list { display: flex; flex-direction: column; gap: 15px; margin: 25px 0; }
  .skill-item { display: flex; align-items: center; gap: 20px; background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 15px 25px; box-shadow: var(--shadow); }
  .skill-icon { width: 40px; height: 40px; background: var(--brand-light); color: var(--brand); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
  .skill-title { font-weight: 800; font-size: 1rem; width: 30%; }
  .skill-desc { font-size: 0.9rem; color: var(--text-2); flex: 1; margin: 0; }

  /* Checkpoint Grid (icon-grid align=row) */
  .checkpoint-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 25px 0; }
  .checkpoint-item { display: flex; align-items: center; gap: 16px; background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; box-shadow: var(--shadow); }
  .ci-icon { font-size: 1.6rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 42px; height: 42px; background: var(--brand-light); border-radius: 50%; color: var(--brand); }
  .ci-text { font-size: 0.9rem; color: var(--text); line-height: 1.4; text-align: left; }
  .ci-text strong { font-size: 1rem; font-weight: 700; color: var(--brand-dark); }

  /* Before-After / Compare-Diff */
  .compare-diff { display: flex; flex-direction: column; gap: 20px; width: 100%; margin: 25px 0; }
  .before-box, .after-box { display: flex; flex-direction: column; gap: 8px; text-align: left; }
  .before-box { border-bottom: 1px solid var(--border); padding-bottom: 20px; }
  .ba-label { font-weight: 800; font-size: 1rem; color: var(--text); }
  .ba-content { font-size: 0.92rem; color: var(--text-2); line-height: 1.6; }

  /* Network Box */
  .graph-visual { background: #0A0F1E; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.06); height: 280px; position: relative; margin: 25px 0; overflow: hidden; }
  .graph-nodes { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap; padding: 20px; }
  .node { border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 700; text-align: center; padding: 10px; cursor: default; }
  .node-main { width: 90px; height: 90px; color: #fff; font-size: 0.95rem; }

  /* FAQ List */
  .faq-list { display: flex; flex-direction: column; gap: 8px; margin: 25px 0; }
  .faq-item { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; background: #fff; }
  .faq-q { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: transparent; border: none; cursor: pointer; font-size: 0.95rem; font-weight: 700; color: var(--text); text-align: left; gap: 12px; font-family: inherit; }
  .faq-q:hover { background: var(--brand-light); }
  .faq-item.open .faq-q { color: var(--brand-dark); background: var(--brand-light); }
  .faq-arrow { transition: transform 0.2s; font-size: 0.7rem; opacity: 0.5; flex-shrink: 0; }
  .faq-item.open .faq-arrow { transform: rotate(180deg); opacity: 1; }
  .faq-a { display: none; padding: 0 20px 16px; }
  .faq-item.open .faq-a { display: block; }

  /* OS Tabs */
  .tabs-wrap { margin: 25px 0; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .tabs-nav { display: flex; background: var(--bg); border-bottom: 1px solid var(--border); overflow-x: auto; }
  .tab-btn { padding: 11px 20px; background: transparent; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: var(--text-2); white-space: nowrap; transition: 0.15s; font-family: inherit; margin-bottom: -1px; }
  .tab-btn.active { color: var(--brand); border-bottom-color: var(--brand); background: white; }
  .tab-btn:hover:not(.active) { color: var(--text); background: rgba(0,0,0,0.03); }
  .tab-panel { display: none; padding: 24px; background: white; }
  .tab-panel.active { display: block; }

  /* Takeaway Banner */
  .takeaway-banner { display: flex; gap: 16px; align-items: flex-start; padding: 24px; background: linear-gradient(135deg, var(--brand-light) 0%, rgba(255,255,255,0.9) 100%); border-left: 5px solid var(--brand); border-radius: var(--radius); box-shadow: var(--shadow); margin: 25px 0; }
  .ta-icon { font-size: 1.8rem; line-height: 1.2; flex-shrink: 0; }
  .ta-label { font-size: 1rem; font-weight: 800; color: var(--brand-dark); margin-bottom: 6px; }
  .ta-text { font-size: 0.92rem; color: var(--text-2); line-height: 1.6; }

  /* Summary Bar */
  .summary-bar { margin: 25px 0; padding: 24px; background: var(--text); border-radius: var(--radius); display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 20px; box-shadow: var(--shadow); }
  .summary-item { display: flex; flex-direction: column; gap: 4px; }
  .summary-num { font-family: var(--font-note); font-size: 1.8rem; font-weight: 700; color: var(--bg); line-height: 1; }
  .summary-unit { font-size: 0.75rem; font-weight: 300; color: rgba(255,255,255,0.6); margin-left: 2px; }
  .summary-label { font-size: 0.8rem; color: rgba(255,255,255,0.6); }

  /* Part Banner */
  .part-banner { margin-bottom: 20px; }
  .part-banner-header { display: flex; align-items: center; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); }
  .part-banner-num-block { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem; font-weight: 500; color: white; }
  .part-banner-title-block { flex: 1; height: 52px; display: flex; align-items: center; padding: 0 20px; gap: 12px; }
  .part-banner-title-text { font-size: 0.95rem; font-weight: 600; color: white; }
  .part-banner-tagline { font-size: 0.8rem; color: rgba(255,255,255,0.7); font-weight: 300; }
  .part-banner-chapter-range { font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-left: auto; letter-spacing: 0.05em; }

  /* Header banner for standalone mode */
  .standalone-banner {
    background: #fff7ed; border: 1px solid #ffedd5; color: #c2410c;
    padding: 12px 20px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 25px;
    display: flex; align-items: center; gap: 10px; font-weight: 500;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="standalone-banner">
      <span>💡</span>
      <span>이 미리보기는 백엔드 서버 없이 브라우저 내에서 직접 변환(Serverless)되었습니다.</span>
    </div>
    <div style="margin-bottom: 30px; border-bottom: 1px dashed var(--border); padding-bottom: 20px;">
      <h1 style="border:none; margin:0 0 5px 0;">${escapeHtml(title)}</h1>
      ${subtitle ? `<div style="color:var(--text-3); font-size:1.1rem; font-family:var(--font-title);">${escapeHtml(subtitle)}</div>` : ""}
    </div>
    ${bodyHtml}
  </div>
</body>
</html>`;

  return html;
}
