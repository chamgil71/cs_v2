import { marked } from 'marked';

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
  const cols = colsMatch ? colsMatch[1] : null;
  const blockBullet = bulletMatch ? bulletMatch[1] : null;
  const gridStyle = cols ? `style="grid-template-columns: repeat(${cols}, 1fr);"` : "";
  const itemBullet = (it: any) => it.bullet || blockBullet || null;

  // 1. Grids: icon-grid, feature-grid, badge-grid, stat-grid
  if (["icon-grid", "feature-grid", "badge-grid", "stat-grid"].includes(type)) {
    const isBadge = type === "badge-grid";
    const isFeat = type === "feature-grid";
    const isStat = type === "stat-grid";
    const clsName = isBadge ? "badge-grid" : (isFeat ? "feature-grid" : (isStat ? "stat-grid" : "icon-grid"));

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
    const it = items[0];
    const bg = "#0F172A";
    const clr = "#F1F5F9";
    const headerBg = "#1E293B";
    const title = it.title || (type === "console-box" ? "Console" : (type === "cmd-box" ? "Terminal" : "Editor"));

    return `<div style="border-radius: var(--radius); overflow: hidden; margin: 20px 0; border: 1px solid var(--border); box-shadow: var(--shadow);">
      <div style="background: ${headerBg}; padding: 8px 16px; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; font-family: var(--font-code); color: #94A3B8;">
        <div style="display: flex; gap: 6px;">
          <span style="width: 10px; height: 10px; border-radius: 50%; background: #EF4444; display: inline-block;"></span>
          <span style="width: 10px; height: 10px; border-radius: 50%; background: #F59E0B; display: inline-block;"></span>
          <span style="width: 10px; height: 10px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
        </div>
        <div style="font-weight: bold;">${escapeHtml(title)}</div>
        <div>${escapeHtml(it.tag || "")}</div>
      </div>
      <pre style="background: ${bg}; color: ${clr}; padding: 20px; font-family: var(--font-code); font-size: 0.85rem; margin: 0; overflow-x: auto; white-space: pre-wrap; word-break: break-all; text-align: left;"><code>${escapeHtml(it.desc)}</code></pre>
    </div>`;
  }

  // Fallback for list-like shortcodes: os-tabs, faq-list, step-flow, summary-bar, workflow-strip, skill-list etc.
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
    return renderClientShortcode(type.trim(), content, args.trim(), style);
  });

  let bodyHtml = "";
  if (mode === "presentation") {
    const slides = shortcodeCompiled.split(/---\r?\n/);
    bodyHtml = `<div class="slides-container" style="display:flex; flex-direction:column; gap:40px; max-width:960px; margin:0 auto; padding:40px 20px;">
      ${slides.map((s, idx) => {
        const slideHtml = marked.parse(s);
        return `<div class="slide-page" style="background:#fff; border: 1px solid var(--border); border-radius: var(--radius); padding:40px; box-shadow: var(--shadow); aspect-ratio:16/9; position:relative; display:flex; flex-direction:column; justify-content:center; overflow:hidden; box-sizing: border-box;">
          <div style="position:absolute; top:20px; right:20px; font-size:0.8rem; color:var(--text-3); font-weight:bold;">${idx + 1}</div>
          ${slideHtml}
        </div>`;
      }).join("")}
    </div>`;
  } else {
    bodyHtml = marked.parse(shortcodeCompiled) as string;
  }

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

    --font-title: 'Noto Serif KR', serif;
    --font-desc:  'Noto Sans KR', sans-serif;
    --font-note:  'JetBrains Mono', monospace;
    --font-code:  'JetBrains Mono', monospace;
    --font-tag:   'Noto Sans KR', sans-serif;
    --font-scale: 1.0;

    --size-h1: 2.2rem;
    --size-h2: 1.8rem;
    --size-h3: 1.4rem;
    --size-body-p: 0.95rem;
    --size-card-title: 1.15rem;
    --size-card-p: 0.92rem;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font-desc), sans-serif; background: var(--bg); color: var(--text); line-height: 1.7; padding: 40px 20px; }
  
  /* Container layout */
  .container { max-width: 900px; margin: 0 auto; background: #fff; padding: 40px; border-radius: var(--radius); border: 1px solid var(--border); box-shadow: var(--shadow); }
  
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
  
  /* Pre and code */
  pre { background: #0F172A; color: #F1F5F9; padding: 15px; border-radius: 8px; font-family: var(--font-code); font-size: 0.85rem; overflow-x: auto; margin: 15px 0; }
  code { font-family: var(--font-code); font-size: 0.9em; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: var(--brand-deep); }
  pre code { background: none; padding: 0; color: inherit; }
  
  /* Header banner for standalone mode */
  .standalone-banner {
    background: #fff7ed; border: 1px solid #ffedd5; color: #c2410c;
    padding: 12px 20px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 25px;
    display: flex; align-items: center; gap: 10px; font-weight: 500;
  }
</style>
</head>
<body>
  ${mode !== "presentation" ? `
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
  ` : `
    <div class="standalone-banner" style="max-width:960px; margin: 0 auto 20px auto;">
      <span>💡</span>
      <span>이 프레젠테이션 미리보기는 브라우저 내에서 직접 변환(Serverless)되었습니다.</span>
    </div>
    ${bodyHtml}
  `}
</body>
</html>`;

  return html;
}
