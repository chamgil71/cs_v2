import fs from 'fs';
import path from 'path';

// ─────────────────────────────────────────────
// 1. Theme Configuration & Auto Resolution
// ─────────────────────────────────────────────

const FONT_PRESETS = {
  "nanum": {
    "body": "나눔고딕",
    "heading": "나눔바른고딕",
    "google_fonts_url": "https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700&family=Nanum+Barun+Gothic:wght@400;700&display=swap"
  },
  "noto": {
    "body": "Noto Sans KR",
    "heading": "Noto Serif KR",
    "google_fonts_url": "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@600;700&display=swap"
  },
  "human": {
    "body": "나눔고딕",
    "heading": "휴먼명조",
    "google_fonts_url": "https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700&display=swap"
  },
  "malgun": {
    "body": "맑은 고딕",
    "heading": "맑은 고딕",
    "google_fonts_url": ""
  }
};

function hexToRgb(h) {
  h = h.replace(/^#/, "");
  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('');
  }
  const num = parseInt(h, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function mixWithWhite(hexColor, opacity) {
  const [r, g, b] = hexToRgb(hexColor);
  const r2 = Math.round(r + (255 - r) * (1 - opacity));
  const g2 = Math.round(g + (255 - g) * (1 - opacity));
  const b2 = Math.round(b + (255 - b) * (1 - opacity));
  return rgbToHex(r2, g2, b2);
}

function resolveAuto(cfg) {
  const colors = cfg.theme.colors;
  const primary = colors.primary;

  if (colors.accent_bg === "auto") {
    colors.accent_bg = mixWithWhite(primary, 0.10);
  }
  if (colors.table_alt === "auto") {
    colors.table_alt = mixWithWhite(primary, 0.05);
  }
  if (colors.border === "auto") {
    colors.border = mixWithWhite(primary, 0.20);
  }
  return cfg;
}

function applyTheme(cfg, colorPreset, fontPreset) {
  const newCfg = JSON.parse(JSON.stringify(cfg));

  // 색상 교체
  const presets = cfg.theme.colors._presets || {};
  if (colorPreset && presets[colorPreset]) {
    const p = presets[colorPreset];
    newCfg.theme.colors.primary = p.primary;
    newCfg.theme.colors.primary_dark = p.primary_dark;
    newCfg.theme.colors.primary_mid = p.primary_mid;
    newCfg.theme.colors.accent_bg = "auto";
    newCfg.theme.colors.table_alt = "auto";
    newCfg.theme.colors.border = "auto";
    console.log(`✅ 색상 교체: ${colorPreset} → primary=${p.primary}`);
  } else if (colorPreset) {
    console.warn(`⚠️ 색상 프리셋 '${colorPreset}'을 찾을 수 없음. 사용 가능: ${Object.keys(presets).join(', ')}`);
  }

  // 폰트 교체
  if (fontPreset && FONT_PRESETS[fontPreset]) {
    const fp = FONT_PRESETS[fontPreset];
    newCfg.theme.fonts.body = fp.body;
    newCfg.theme.fonts.heading = fp.heading;
    newCfg.theme.fonts.google_fonts_url = fp.google_fonts_url;
    console.log(`✅ 폰트 교체: body=${fp.body}, heading=${fp.heading}`);
  } else if (fontPreset) {
    console.warn(`⚠️ 폰트 프리셋 '${fontPreset}'을 찾을 수 없음. 사용 가능: ${Object.keys(FONT_PRESETS).join(', ')}`);
  }

  newCfg.meta.name = `${cfg.meta.name} (${colorPreset || 'base'} / ${fontPreset || 'base'})`;
  return resolveAuto(newCfg);
}

// ─────────────────────────────────────────────
// 2. MD Parser
// ─────────────────────────────────────────────

function parseMd(content) {
  const tokens = [];
  const lines = content.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const stripped = line.trim();

    // ── 펜스 블록 처리 (```type ... ```) ──
    const fenceMatch = stripped.match(/^```(\w+(?::\w+)?)(.*)?$/);
    if (fenceMatch) {
      const blockType = fenceMatch[1];
      const blockMeta = fenceMatch[2] ? fenceMatch[2].trim() : "";
      const blockLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        blockLines.push(lines[i]);
        i++;
      }
      tokens.push({
        type: blockType,
        meta: blockMeta,
        content: blockLines.join("\n")
      });
      i++;
      continue;
    }

    // ── nav 블록 (---nav ... ---) ──
    if (stripped === "---nav") {
      const navLines = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "---") {
        navLines.push(lines[i]);
        i++;
      }
      tokens.push({ type: "nav", content: navLines.join("\n") });
      i++;
      continue;
    }

    // ── 섹션 구분자 (---) ──
    if (stripped === "---") {
      tokens.push({ type: "hr" });
      i++;
      continue;
    }

    // ── 문서 제목 (#) ──
    if (stripped.startsWith("# ") && !stripped.startsWith("## ")) {
      tokens.push({ type: "doc_title", content: stripped.slice(2) });
      i++;
      continue;
    }

    // ── 섹션 헤더 (## N 제목) ──
    const secMatch = stripped.match(/^## (\d+)\s+(.+)$/);
    if (secMatch) {
      tokens.push({
        type: "section_header",
        number: secMatch[1],
        content: secMatch[2]
      });
      i++;
      continue;
    }

    // ── 서브섹션 헤더 (### 제목) ──
    if (stripped.startsWith("### ")) {
      tokens.push({ type: "h3_heading", content: stripped.slice(4) });
      i++;
      continue;
    }

    // ── 표 캡션 + 표 ──
    const tableCapMatch = stripped.match(/^\*\*\[표\s*\d+\](.+)\*\*$/);
    if (tableCapMatch) {
      const caption = stripped.replace(/^\*\*|\*\*$/g, "").trim();
      const tableRows = [];
      i++;
      while (i < lines.length && lines[i].indexOf("|") !== -1) {
        const row = lines[i].trim();
        if (!row.match(/^\|[-:\s|]+\|$/)) {
          const cells = row.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
          tableRows.push(cells);
        }
        i++;
      }
      tokens.push({ type: "table", caption: caption, rows: tableRows });
      continue;
    }

    // ── 인라인 표 (캡션 없는) ──
    if (stripped.startsWith("|") && stripped.endsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].indexOf("|") !== -1) {
        const row = lines[i].trim();
        if (!row.match(/^\|[-:\s|]+\|$/)) {
          const cells = row.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
          rows.push(cells);
        }
        i++;
      }
      if (rows.length > 0) {
        tokens.push({ type: "table", caption: null, rows: rows });
      }
      continue;
    }

    // ── 날짜/부서 행 (숫자+한글 패턴) ──
    if (stripped.match(/^\d{4}\.\d+\.\d+/)) {
      tokens.push({ type: "meta_line", content: stripped });
      i++;
      continue;
    }

    // ── 계층 마커 ──
    if (stripped.startsWith("■ ")) {
      tokens.push({ type: "h1", content: stripped.slice(2) });
    } else if (stripped.startsWith("○ ")) {
      tokens.push({ type: "h2", content: stripped.slice(2) });
    } else if (stripped.startsWith("– ") || stripped.startsWith("- ")) {
      tokens.push({ type: "h3", content: stripped.replace(/^[–\-]\s/, "") });
    } else if (stripped.startsWith("* ")) {
      tokens.push({ type: "note", content: stripped.slice(2) });
    } else if (stripped.startsWith("è ")) {
      tokens.push({ type: "conclusion", content: stripped.slice(2) });
    } else if (stripped === "") {
      tokens.push({ type: "blank" });
    } else {
      tokens.push({ type: "paragraph", content: stripped });
    }

    i++;
  }

  return tokens;
}

// ─────────────────────────────────────────────
// 3. Inline Formatter
// ─────────────────────────────────────────────

function fmtInline(text, cfg) {
  // `kbd:Ctrl+K` -> <kbd>
  text = text.replace(/`kbd:([^`]+)`/g, (match, keys) => {
    return keys.split("+").map(k => `<kbd class="kbd">${k.trim()}</kbd>`).join('');
  });

  // `badge:color:text` or `badge:text`
  text = text.replace(/`badge:([^`]+)`/g, (match, content) => {
    const parts = content.split(":");
    let color = "default";
    let label = content;
    if (parts.length === 2) {
      color = parts[0];
      label = parts[1];
    }
    return `<span class="badge badge-${color}">${label}</span>`;
  });

  // **bold** -> <strong>
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // `code` -> <code>
  text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  return text;
}

// ─────────────────────────────────────────────
// 4. Component Renderers
// ─────────────────────────────────────────────

function renderInfoBox(token, cfg) {
  const comps = cfg.components.info_box;
  const meta = token.meta || "";
  const content = fmtInline(token.content, cfg);

  const variantKey = meta.startsWith(":") ? meta.slice(1).trim() : meta.trim() || "default";
  let bg, border, icon;

  if (comps.variants && comps.variants[variantKey]) {
    const v = comps.variants[variantKey];
    bg = v.background;
    border = v.border_left;
    icon = v.icon || "";
  } else {
    bg = cfg.theme.colors.accent_bg;
    border = cfg.theme.colors.primary_mid;
    icon = comps.icon || "";
  }

  const contentHtml = content.replace(/\n/g, "<br>");
  return `<div class="info-box" style="background:${bg};border-left-color:${border};">
  ${icon ? `<span class="info-icon">${icon}</span>` : ''}
  <div class="info-content">${contentHtml}</div>
</div>`;
}

function renderTipCard(token, cfg) {
  const comps = cfg.components.tip_card;
  const blockType = token.type;
  const colorKey = blockType.includes(":") ? blockType.split(":")[1] : "green";
  const borderColor = comps.color_map[colorKey] || "#3FB950";

  const lines = token.content.trim().split("\n");
  let title = "";
  const bodyLines = [];

  for (const ln of lines) {
    if (ln.startsWith("**") && ln.endsWith("**")) {
      title = ln.slice(2, -2);
    } else {
      bodyLines.push(fmtInline(ln, cfg));
    }
  }

  const titleHtml = title ? `<strong class="tip-title">${fmtInline(title, cfg)}</strong>` : "";
  const bodyHtml = bodyLines.join("<br>");

  return `<div class="tip-card" style="border-left-color:${borderColor};">
  ${titleHtml}
  <p class="tip-body">${bodyHtml}</p>
</div>`;
}

function renderTerminal(token, cfg) {
  const comps = cfg.components.terminal;
  const syn = comps.syntax;
  const meta = token.meta || "";
  const titleMatch = meta.match(/title="([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : "terminal";

  function highlight(code) {
    return code.split("\n").map(ln => {
      let lnEsc = ln.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      if (/^\s*#/.test(lnEsc)) {
        lnEsc = `<span style="color:${syn.comment}">${lnEsc}</span>`;
      } else if (/^\s*\$/.test(lnEsc)) {
        lnEsc = lnEsc.replace(/(\$\s*)(\S+)/, (m, p1, p2) => {
          return `<span style="color:${syn.command}">${p1}${p2}</span>`;
        });
      } else if (/^\w+:/.test(lnEsc)) {
        lnEsc = lnEsc.replace(/^(\w+:)/, `<span style="color:${syn.keyword}">$1</span>`);
      }
      return lnEsc;
    }).join("\n");
  }

  const highlighted = highlight(token.content);

  return `<div class="terminal">
  <div class="terminal-header">
    <span class="tl" style="background:#FF5F56"></span>
    <span class="tl" style="background:#FFBD2E"></span>
    <span class="tl" style="background:#27C93F"></span>
    <span class="terminal-title">${title}</span>
  </div>
  <pre class="terminal-body">${highlighted}</pre>
</div>`;
}

function renderFeatureCards(token, cfg) {
  const comps = cfg.components.feature_card;
  const tagColors = comps.tag_colors;
  const cards = [];

  for (const ln of token.content.trim().split("\n")) {
    if (!ln.trim()) continue;
    const parts = ln.split("|").map(p => p.trim());
    if (parts.length < 3) continue;

    const icon = parts[0] || "";
    const title = parts[1] || "";
    const desc = parts[2] || "";
    const tagRaw = parts[3] || "";

    let tagHtml = "";
    if (tagRaw.startsWith("tag:")) {
      const tagVal = tagRaw.slice(4);
      const tagParts = tagVal.split(":");
      let colorKey = "default";
      let label = tagVal;
      if (tagParts.length === 2) {
        colorKey = tagParts[0];
        label = tagParts[1];
      }

      const tipColors = cfg.components.tip_card.color_map;
      if (tipColors[colorKey]) {
        const c = tipColors[colorKey];
        tagHtml = `<span class="feature-tag" style="background:${c}22;color:${c}">${label}</span>`;
      } else {
        const tc = tagColors[colorKey] || tagColors["default"];
        tagHtml = `<span class="feature-tag" style="background:${tc.bg};color:${tc.text}">${label}</span>`;
      }
    }

    cards.push(`<div class="feature-card">
  <div class="feature-icon">${icon}</div>
  <h3 class="feature-title">${fmtInline(title, cfg)}</h3>
  <p class="feature-desc">${fmtInline(desc, cfg)}</p>
  ${tagHtml}
</div>`);
  }

  return `<div class="feature-grid">${cards.join('')}</div>`;
}

function renderFlowSteps(token, cfg) {
  const comps = cfg.components.flow_steps;
  const arrowColor = comps.arrow_color;
  const stepsRaw = token.content.trim().split("→").map(s => s.trim());
  const stepsHtml = [];

  for (const step of stepsRaw) {
    if (!step) continue;
    const parts = step.split(" ");
    let icon = "";
    let label = step;
    if (parts.length > 1) {
      icon = parts[0];
      label = parts.slice(1).join(" ");
    }
    stepsHtml.push(`<div class="flow-step">
  <div class="flow-icon">${icon}</div>
  <div class="flow-label">${label}</div>
</div>`);
  }

  const inner = stepsHtml.join(`<div class="flow-arrow" style="color:${arrowColor}">→</div>`);
  return `<div class="flow-steps">${inner}</div>`;
}

function renderGitflow(token, cfg) {
  const comps = cfg.components.git_flow;
  const branchColors = comps.branch_colors;
  const rowsHtml = [];

  for (const ln of token.content.trim().split("\n")) {
    if (!ln.trim() || !ln.includes(":")) continue;
    const [branchNameRaw, commitsRaw] = ln.split(":");
    const branchName = branchNameRaw.trim();
    const commits = commitsRaw.split(",").map(c => c.trim());
    const color = branchColors[branchName] || "#888";

    const commitsHtml = [];
    for (const c of commits) {
      if (c) {
        commitsHtml.push(
          `<div class="commit" style="border-color:${color};">` +
          `<span class="commit-label">${c}</span></div>`
        );
        commitsHtml.push(`<div class="commit-line" style="background:${color};"></div>`);
      } else {
        commitsHtml.push(`<div style="flex:0.5;height:3px"></div>`);
      }
    }

    rowsHtml.push(`<div class="branch-row">
  <div class="branch-label" style="color:${color}">${branchName}</div>
  <div class="branch-line">${commitsHtml.join('')}</div>
</div>`);
  }

  return `<div class="git-flow-container">
  <div class="flow-branches">${rowsHtml.join('')}</div>
</div>`;
}

function renderTable(token, cfg) {
  const rows = token.rows;
  const caption = token.caption;

  if (!rows || rows.length === 0) return "";

  const headerRow = rows[0];
  const bodyRows = rows.slice(1);

  const headerHtml = headerRow.map(h => `<th>${fmtInline(h, cfg)}</th>`).join('');
  let bodyHtml = "";
  bodyRows.forEach((row, idx) => {
    const alt = idx % 2 === 1 ? ' class="alt-row"' : "";
    const cells = row.map(c => `<td>${fmtInline(c, cfg)}</td>`).join('');
    bodyHtml += `<tr${alt}>${cells}</tr>`;
  });

  const capHtml = caption ? `<caption class="table-caption">${caption}</caption>` : "";

  return `<div class="table-wrapper">
  <table class="doc-table">
    ${capHtml}
    <thead><tr>${headerHtml}</tr></thead>
    <tbody>${bodyHtml}</tbody>
  </table>
</div>`;
}

const FENCE_RENDERERS = {
  "info": renderInfoBox,
  "terminal": renderTerminal,
  "cards": renderFeatureCards,
  "flow": renderFlowSteps,
  "gitflow": renderGitflow,
};

function tokensToHtml(tokens, cfg) {
  const htmlParts = [];
  const TIP_PREFIX = "tip";

  for (const tok of tokens) {
    const t = tok.type;

    if (t === "nav") {
      const links = [];
      for (const ln of tok.content.split("\n")) {
        const m = ln.trim().match(/^links:\s*(.+)/);
        if (m) {
          for (const lnk of m[1].split(",")) {
            const trimmedLnk = lnk.trim();
            const anchor = trimmedLnk.replace(/\s+/g, "-").toLowerCase();
            links.push(`<li><a href="#${anchor}">${trimmedLnk}</a></li>`);
          }
        }
      }
      htmlParts.push(`<nav class="doc-nav">
  <div class="nav-inner">
    <span class="nav-brand">${cfg.meta.name}</span>
    <ul class="nav-links">${links.join('')}</ul>
  </div>
</nav>`);
      continue;
    }

    if (t === "doc_title") {
      htmlParts.push(`<div class="doc-title-wrap"><h1 class="doc-title">${fmtInline(tok.content, cfg)}</h1></div>`);
      continue;
    }

    if (t === "meta_line") {
      htmlParts.push(`<p class="meta-line">${tok.content}</p>`);
      continue;
    }

    if (t === "section_header") {
      htmlParts.push(`<div class="section-header">
  <span class="section-num-badge">${tok.number}</span>
  <span class="section-title-text">${fmtInline(tok.content, cfg)}</span>
</div>`);
      continue;
    }

    if (t === "h3_heading") {
      htmlParts.push(`<h3 class="sub-heading">${fmtInline(tok.content, cfg)}</h3>`);
      continue;
    }

    if (t === "h1") {
      htmlParts.push(`<p class="marker-h1"><span class="m1">■</span> ${fmtInline(tok.content, cfg)}</p>`);
      continue;
    }
    if (t === "h2") {
      htmlParts.push(`<p class="marker-h2"><span class="m2">○</span> ${fmtInline(tok.content, cfg)}</p>`);
      continue;
    }
    if (t === "h3") {
      htmlParts.push(`<p class="marker-h3"><span class="m3">–</span> ${fmtInline(tok.content, cfg)}</p>`);
      continue;
    }
    if (t === "note") {
      htmlParts.push(`<p class="marker-note">* ${fmtInline(tok.content, cfg)}</p>`);
      continue;
    }
    if (t === "conclusion") {
      htmlParts.push(`<div class="conclusion-box">è ${fmtInline(tok.content, cfg)}</div>`);
      continue;
    }

    if (t === "table") {
      htmlParts.push(renderTable(tok, cfg));
      continue;
    }

    if (FENCE_RENDERERS[t]) {
      htmlParts.push(FENCE_RENDERERS[t](tok, cfg));
      continue;
    }

    if (t.startsWith(TIP_PREFIX)) {
      htmlParts.push(renderTipCard(tok, cfg));
      continue;
    }

    if (t === "paragraph" && tok.content) {
      htmlParts.push(`<p class="body-text">${fmtInline(tok.content, cfg)}</p>`);
      continue;
    }

    if (t === "hr") {
      htmlParts.push('<hr class="section-divider">');
      continue;
    }
  }

  return htmlParts.join("\n");
}

// ─────────────────────────────────────────────
// 5. CSS Generation
// ─────────────────────────────────────────────

function generateCss(cfg) {
  const c = cfg.theme.colors;
  const f = cfg.theme.fonts;
  const sz = cfg.theme.sizes;
  const sp = cfg.theme.spacing;

  const pt = (v) => `${(v * 1.333).toFixed(1)}px`;

  const bodyFont = f.body || "맑은 고딕";
  const headingFont = f.heading || "맑은 고딕";
  const fallback = f.fallback || "sans-serif";

  return `
/* ── CSS 변수 (theme token) ── */
:root {
  --c-primary:        ${c.primary};
  --c-primary-dark:   ${c.primary_dark};
  --c-primary-mid:    ${c.primary_mid};
  --c-accent-bg:      ${c.accent_bg};
  --c-table-alt:      ${c.table_alt};
  --c-border:         ${c.border};
  --c-text:           ${c.text_body};
  --c-text-muted:     ${c.text_muted};
  --c-text-on-primary:${c.text_on_primary};
  --c-background:     ${c.background};
  --c-page-bg:        ${c.page_bg};
  --f-body:           '${bodyFont}', ${fallback};
  --f-heading:        '${headingFont}', ${fallback};
  --f-code:           '${f.code || "monospace"}', monospace;
  --lh:               ${sp.line_height};
  --indent-h2:        ${sp.indent_h2_mm}mm;
  --indent-h3:        ${sp.indent_h3_mm}mm;
  --radius:           8px;
  --radius-lg:        12px;
  --shadow:           0 2px 12px rgba(0,0,0,0.07);
  --shadow-md:        0 4px 24px rgba(0,0,0,0.10);
}

/* ── 기본 리셋 ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; font-size: 16px; }
body {
  font-family: var(--f-body);
  background: var(--c-page-bg);
  color: var(--c-text);
  line-height: var(--lh);
  font-size: ${pt(sz.body)};
}

/* ── 네비게이션 ── */
.doc-nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(13,17,23,0.97);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding: 0 24px;
}
.nav-inner {
  max-width: ${cfg.output.html.max_content_width};
  margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  height: 56px;
}
.nav-brand { color: #fff; font-weight: 700; font-size: 15px; }
.nav-links { display: flex; gap: 4px; list-style: none; }
.nav-links a {
  text-decoration: none; color: #8B949E; font-size: 13px;
  padding: 5px 10px; border-radius: 6px; transition: all .2s;
}
.nav-links a:hover { background: rgba(255,255,255,0.1); color: #fff; }

/* ── 문서 래퍼 ── */
.doc-wrapper {
  max-width: ${cfg.output.html.max_content_width};
  margin: 0 auto;
  background: var(--c-background);
  padding: 40px 48px 64px;
}
@media (max-width: 720px) { .doc-wrapper { padding: 24px 20px 48px; } }

/* ── 문서 제목 ── */
.doc-title-wrap { margin-bottom: 8px; }
.doc-title {
  font-family: var(--f-heading);
  font-size: ${pt(sz.doc_title)};
  font-weight: 700;
  color: var(--c-primary-dark);
  line-height: 1.3;
}
.meta-line {
  font-size: ${pt(sz.footnote)};
  color: var(--c-text-muted);
  margin-bottom: 32px;
}

/* ── 섹션 헤더 ── */
.section-header {
  display: flex; align-items: center; gap: 10px;
  background: var(--c-primary);
  color: var(--c-text-on-primary);
  padding: 7px 16px;
  margin: 32px 0 20px;
  font-family: var(--f-heading);
  font-size: ${pt(sz.section)};
  font-weight: 700;
  border-radius: 0;
}
.section-num-badge {
  background: var(--c-text-on-primary);
  color: var(--c-primary);
  font-size: 12px; font-weight: 700;
  padding: 1px 7px; border-radius: 3px;
  flex-shrink: 0;
}

/* ── 계층 마커 ── */
.marker-h1 {
  font-size: ${pt(sz.h1)};
  font-weight: 700;
  color: var(--c-text);
  margin: 16px 0 8px;
  line-height: var(--lh);
}
.m1 { color: var(--c-primary-dark); margin-right: 4px; }

.marker-h2 {
  font-size: ${pt(sz.h2)};
  font-weight: 400;
  color: var(--c-text);
  margin: 8px 0 4px var(--indent-h2);
  line-height: var(--lh);
}
.m2 { color: var(--c-primary-mid); margin-right: 4px; }

.marker-h3 {
  font-size: ${pt(sz.h3)};
  color: var(--c-text-muted);
  margin: 4px 0 2px var(--indent-h3);
  line-height: var(--lh);
}
.m3 { color: var(--c-text-muted); margin-right: 4px; }

.marker-note {
  font-size: ${pt(sz.footnote)};
  color: var(--c-text-muted);
  margin: 2px 0 2px var(--indent-h3);
}

.sub-heading {
  font-size: ${pt(sz.h2)};
  font-weight: 700;
  color: var(--c-text);
  margin: 20px 0 12px;
}

.body-text {
  font-size: ${pt(sz.body)};
  color: var(--c-text);
  margin: 6px 0;
  line-height: var(--lh);
}

/* ── 결론 박스 ── */
.conclusion-box {
  background: var(--c-accent-bg);
  border-left: 3px solid var(--c-primary-mid);
  border-radius: 0 6px 6px 0;
  padding: 10px 16px;
  margin: 16px 0 16px var(--indent-h2);
  font-size: ${pt(sz.body)};
  line-height: var(--lh);
}

/* ── info box ── */
.info-box {
  display: flex; gap: 10px;
  border-left: 3px solid var(--c-primary-mid);
  border-radius: 0 8px 8px 0;
  padding: 12px 16px;
  margin: 14px 0;
  font-size: ${pt(sz.body)};
  line-height: var(--lh);
}
.info-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
.info-content { flex: 1; }

/* ── tip card ── */
.tip-card {
  background: var(--c-background);
  border-left: 4px solid;
  border-radius: 0 8px 8px 0;
  padding: 18px 22px;
  margin: 10px 0;
  box-shadow: var(--shadow);
}
.tip-title {
  display: block;
  margin-bottom: 5px;
  font-size: ${pt(sz.h2)};
  color: var(--c-text);
}
.tip-body {
  font-size: ${pt(sz.body)};
  color: var(--c-text-muted);
  line-height: var(--lh);
}

/* ── terminal ── */
.terminal {
  background: #0D1117;
  border-radius: var(--radius);
  border: 1px solid #30363D;
  overflow: hidden;
  margin: 16px 0;
}
.terminal-header {
  background: #161B22;
  padding: 9px 16px;
  display: flex; align-items: center; gap: 7px;
  border-bottom: 1px solid #30363D;
}
.tl { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; }
.terminal-title {
  font-size: 12px; color: #8B949E;
  margin-left: 6px; font-family: var(--f-code);
}
.terminal-body {
  padding: 16px 20px;
  font-family: var(--f-code);
  font-size: 13px;
  color: #E6EDF3;
  line-height: 1.75;
  overflow-x: auto;
  white-space: pre;
}

/* ── feature grid ── */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
  margin: 16px 0;
}
.feature-card {
  background: var(--c-background);
  border-radius: var(--radius-lg);
  padding: 22px;
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow);
  transition: transform .2s;
}
.feature-card:hover { transform: translateY(-3px); }
.feature-icon { font-size: 28px; margin-bottom: 12px; }
.feature-title { font-size: ${pt(sz.h2)}; font-weight: 700; margin-bottom: 6px; }
.feature-desc { font-size: ${pt(sz.body)}; color: var(--c-text-muted); line-height: var(--lh); }
.feature-tag {
  display: inline-block; margin-top: 10px;
  font-size: 11px; font-weight: 600;
  padding: 2px 10px; border-radius: 100px;
}

/* ── flow steps ── */
.flow-steps {
  display: flex; align-items: center;
  flex-wrap: wrap; gap: 0;
  justify-content: center;
  margin: 20px 0; padding: 24px;
  background: var(--c-background);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}
.flow-step {
  background: var(--c-background);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  padding: 14px 18px;
  text-align: center;
  min-width: 110px;
  box-shadow: var(--shadow);
}
.flow-icon { font-size: 22px; margin-bottom: 4px; }
.flow-label { font-size: 12px; font-weight: 700; color: var(--c-text); }
.flow-arrow {
  font-size: 18px; padding: 0 10px;
  color: var(--c-border);
}

/* ── git flow ── */
.git-flow-container {
  background: #0D1117;
  border-radius: var(--radius-lg);
  padding: 28px;
  border: 1px solid #30363D;
  overflow-x: auto;
  margin: 16px 0;
}
.flow-branches { display: flex; flex-direction: column; gap: 18px; min-width: 500px; }
.branch-row { display: flex; align-items: center; gap: 0; }
.branch-label { width: 80px; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.branch-line { flex: 1; display: flex; align-items: center; }
.commit {
  width: 18px; height: 18px;
  border-radius: 50%; border: 3px solid;
  flex-shrink: 0; position: relative;
}
.commit-label {
  font-size: 10px; color: #8B949E;
  position: absolute; top: 20px; left: -16px;
  white-space: nowrap;
}
.commit-line { flex: 1; height: 3px; }

/* ── 표 ── */
.table-wrapper {
  overflow-x: auto; margin: 14px 0;
  border-radius: var(--radius);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow);
}
.doc-table {
  width: 100%; border-collapse: collapse;
  font-size: ${pt(sz.table_body)};
}
.doc-table caption.table-caption {
  caption-side: top;
  text-align: center;
  font-weight: 700;
  font-size: ${pt(sz.caption)};
  padding: 8px;
  color: var(--c-text);
  background: var(--c-page-bg);
  border-bottom: 1px solid var(--c-border);
}
.doc-table thead tr {
  background: var(--c-primary-mid);
  color: var(--c-text-on-primary);
}
.doc-table th {
  padding: 8px 12px;
  font-weight: 600;
  font-size: ${pt(sz.table_header)};
  text-align: left;
}
.doc-table td {
  padding: 7px 12px;
  border-bottom: 1px solid var(--c-border);
  color: var(--c-text);
}
.doc-table tr.alt-row td { background: var(--c-table-alt); }
.doc-table tr:last-child td { border-bottom: none; }

/* ── 인라인 요소 ── */
strong { font-weight: 700; }
.inline-code {
  font-family: var(--f-code);
  font-size: 0.88em;
  background: var(--c-page-bg);
  border: 1px solid var(--c-border);
  border-radius: 3px;
  padding: 1px 5px;
}
.kbd {
  display: inline-block;
  background: var(--c-page-bg);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  padding: 1px 6px;
  font-family: var(--f-code);
  font-size: 11px;
}
.badge {
  display: inline-block;
  border-radius: 100px;
  padding: 1px 9px;
  font-size: 11px; font-weight: 600;
}

.section-divider {
  border: none; border-top: 1px solid var(--c-border);
  margin: 32px 0;
}

/* ── 인쇄 스타일 ── */
@media print {
  .doc-nav, .back-top { display: none; }
  .doc-wrapper { padding: 0; box-shadow: none; }
  .section-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .doc-table thead tr { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .terminal { border: 1px solid #ccc; }
  .terminal-body { color: #000; background: #f5f5f5; }
  .tip-card, .feature-card { box-shadow: none; border: 1px solid #ccc; }
}

/* ── 반응형 ── */
@media (max-width: 600px) {
  .nav-links { display: none; }
  .feature-grid { grid-template-columns: 1fr; }
  .flow-steps { flex-direction: column; }
  .flow-arrow { transform: rotate(90deg); }
}
`;
}

// ─────────────────────────────────────────────
// 6. HTML Assembly
// ─────────────────────────────────────────────

function buildHtml(contentHtml, css, cfg) {
  const meta = cfg.meta;
  const fontsUrl = cfg.theme.fonts.google_fonts_url || "";
  const fontLink = fontsUrl ? `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsUrl}" rel="stylesheet">` : "";

  let backTopHtml = "";
  if (cfg.output.html.back_to_top) {
    backTopHtml = `
<button class="back-top" id="backTop" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑</button>
<script>
  window.addEventListener('scroll', () => {
    document.getElementById('backTop').classList.toggle('visible', window.scrollY > 300);
  });
</script>`;
  }

  return `<!DOCTYPE html>
<html lang="${meta.lang || 'ko'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.name}</title>
  ${fontLink}
  <style>
${css}
  /* back-top */
  .back-top {
    position: fixed; bottom: 24px; right: 24px;
    width: 40px; height: 40px;
    background: var(--c-primary); color: var(--c-text-on-primary);
    border: none; border-radius: 8px;
    font-size: 16px; cursor: pointer;
    opacity: 0; transition: opacity .3s; z-index: 200;
  }
  .back-top.visible { opacity: 1; }
  </style>
</head>
<body>
${contentHtml}
${backTopHtml}
</body>
</html>`;
}

// ─────────────────────────────────────────────
// 7. Main Runner
// ─────────────────────────────────────────────

export function convert({ contentPath, templatePath, outputPath, color, font }) {
  console.log(`[1/5] 설정 로드: ${templatePath}`);
  const rawTemplate = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

  // applyTheme internally performs resolveAuto
  const cfg = applyTheme(rawTemplate, color, font);

  console.log(`[2/5] MD 파일 읽기: ${contentPath}`);
  const mdText = fs.readFileSync(contentPath, 'utf8');

  console.log("[3/5] MD 파싱...");
  const tokens = parseMd(mdText);
  console.log(`      → ${tokens.length}개 토큰 생성`);

  console.log("[4/5] HTML 변환...");
  const navTokens = tokens.filter(t => t.type === "nav");
  const otherTokens = tokens.filter(t => t.type !== "nav");

  const navHtml = tokensToHtml(navTokens, cfg);
  const bodyHtml = `<div class="doc-wrapper">\n${tokensToHtml(otherTokens, cfg)}\n</div>`;
  const contentHtml = navHtml + "\n" + bodyHtml;

  const css = generateCss(cfg);

  console.log("[5/5] HTML 파일 저장...");
  const finalHtml = buildHtml(contentHtml, css, cfg);

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, finalHtml, 'utf8');

  const sizeKb = Math.round(fs.statSync(outputPath).size / 1024);
  console.log(`\n✅ 완료: ${outputPath} (${sizeKb} KB)`);
}

// ─────────────────────────────────────────────
// 8. CLI Handler
// ─────────────────────────────────────────────

if (import.meta.url.startsWith('file:')) {
  const modulePath = path.resolve(process.argv[1]);
  const currentPath = path.resolve(new URL(import.meta.url).pathname.substring(process.platform === 'win32' ? 1 : 0));

  if (modulePath === currentPath) {
    const args = process.argv.slice(2);
    const params = {};

    for (let j = 0; j < args.length; j++) {
      if (args[j] === '--content') params.contentPath = args[++j];
      else if (args[j] === '--template') params.templatePath = args[++j];
      else if (args[j] === '--output') params.outputPath = args[++j];
      else if (args[j] === '--color') params.color = args[++j];
      else if (args[j] === '--font') params.font = args[++j];
    }

    if (!params.contentPath || !params.templatePath || !params.outputPath) {
      console.error("사용법: node scripts/designspec-md-to-html.mjs --content <content.md> --template <template.json> --output <output.html> [--color violet|teal|red|slate] [--font nanum|noto|human|malgun]");
      process.exit(1);
    }

    convert(params);
  }
}
