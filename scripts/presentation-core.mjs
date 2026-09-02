/**
 * presentation-core.mjs
 * 환경 비의존 코어: Markdown 문서 배열 → 횡슬라이드 프레젠테이션 HTML 문자열.
 * fs/path 의존 없음. build-presentation.mjs(CLI 래퍼)와 src/lib/client-compiler.ts(브라우저)가 공유.
 * 정본 출처: build-presentation 자체 렌더러+CSS(슬라이드 튜닝, light-mode 오버라이드 포함)에서 기계적 추출.
 *
 * 입력 docs: [{ raw: string(원문 md, frontmatter 포함), basename?: string(제목 폴백) }, ...]
 * 옵션: { styles, config, htmlConfig, style }  (styles=styles.json, config=pptdesign, htmlConfig=htmldesign)
 * 반환: { html, styleKey, fm }
 */
import matter from "gray-matter";
import { marked } from "marked";
// [HTML 통합] 프레젠테이션도 가이드와 동일한 공유 숏코드 렌더러+CSS 사용 (단일 출처 — shortcode-styles.mjs 한 곳만 고치면 3종 HTML 반영)
import { renderShortcode as renderShortcodeShared } from "./shortcode-render.mjs";
import { SHORTCODE_CSS } from "./shortcode-styles.mjs";

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderInline(s) {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function cleanValue(v) {
  return String(v ?? "").trim().replace(/^["']|["']$/g, "");
}

function splitMeta(meta) {
  if (!meta) return [];
  return String(meta).split(/[|\n]/).map(s => s.trim().replace(/^["']|["']$/g, "").trim()).filter(Boolean);
}

function standardizeItem(item) {
  const rawName = item.name || item.title || "";
  const iconMatch = rawName.match(/^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*(.*)$/);
  const icon =     item.icon || (iconMatch ? iconMatch[1] : "") || "";
  const title =    item.title || (iconMatch ? iconMatch[2] : item.name) || item.col || "";
  const desc =     String(item.desc || item.description || item.tagline || item.body || "").replace(/\\n/g, "\n").replace(/\/n/g, "\n");
  const tag =      item.tag || item.badge || item.type || "";
  const color =    item.color || "";
  const featured = String(item.featured || "").trim().toLowerCase() === "true" ? "true" : "";
  const meta =     String(item.meta || item.tool || item.features || item.items || item.points || "").replace(/\\n/g, "\n").replace(/\/n/g, "\n");
  const note =     String(item.note || "").replace(/\\n/g, "\n").replace(/\/n/g, "\n");

  return { ...item, icon, title, desc, tag, meta, note, color, featured };
}

function parseShortcodeItems(src) {
  const items = [];
  let current = null;
  let currentKey = null;
  let inLiteralBlock = false;

  for (const line of src.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (inLiteralBlock && line.startsWith("    ")) {
      const val = line.slice(4);
      const sep = currentKey === 'meta' ? ' | ' : '\n';
      const existing = current[currentKey];
      current[currentKey] = (!existing || existing === '|') ? val : existing + sep + val;
      continue;
    } else {
      inLiteralBlock = false;
    }

    const firstMatch = line.match(/^\s*-\s*([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (firstMatch) {
      currentKey = firstMatch[1];
      let val = cleanValue(firstMatch[2]);
      if (val === "|") {
        inLiteralBlock = true;
        current = { [currentKey]: "" };
      } else {
        current = { [currentKey]: val };
      }
      items.push(current);
      continue;
    }

    const nextMatch = line.match(/^\s+([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (nextMatch && current) {
      currentKey = nextMatch[1];
      let val = cleanValue(nextMatch[2]);
      if (val === "|") {
        inLiteralBlock = true;
        current[currentKey] = "";
      } else {
        current[currentKey] = val;
      }
      continue;
    }

    const listMatch = line.match(/^\s+-\s+(.+)$/);
    if (listMatch && current && currentKey) {
      const val = listMatch[1].trim();
      const existing = current[currentKey];
      const sep = currentKey === 'meta' ? ' | ' : '\n';
      current[currentKey] = (!existing || existing === '|') ? val : existing + sep + val;
      continue;
    }

    if (line.match(/^\s+\S/) && current && currentKey) {
      const val = line.trim();
      if (val === '|') {
        inLiteralBlock = true;
        continue;
      }
      const existing = current[currentKey];
      const sep = currentKey === 'meta' ? ' | ' : '\n';
      current[currentKey] = (!existing || existing === '|') ? val : existing + sep + val;
    }
  }

  return items.map(standardizeItem);
}

// Render shortcode (same visual blocks as build-guide)
function renderMultiLineText(text, defaultTag = "p", customBullet = null) {
  if (!text) return "";
  const cleanText = String(text).replace(/\\n/g, "\n").replace(/\/n/g, "\n");
  const lines = cleanText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  if (lines.length <= 1 && !lines[0]?.match(/^[-*+•✅✔️]/) && !customBullet) {
    return defaultTag ? `<${defaultTag}>${escapeHtml(cleanText)}</${defaultTag}>` : escapeHtml(cleanText);
  }

  // 이모지 "✔️"의 색상을 완벽히 제어하기 위해 인라인 SVG 체크 기호를 기본값으로 탑재 (stroke="currentColor"로 color에 반응)
  const svgBullet = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-top: 4px; display: inline-block; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  const activeBullet = customBullet || null;
  const makeBulletHtml = (sym) =>
    sym ? `<span style="font-size:1.1rem;line-height:1;">${sym}</span>` : svgBullet;

  let listHtml = '<div class="multiline-list" style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px; text-align: left; width: 100%;">';
  for (const line of lines) {
    const match = line.match(/^[-*+•✅✔️]\s*(.*)$/);
    let content = match ? match[1] : line;
    if (!content.trim()) continue;

    listHtml += `<div class="multiline-item" style="display: flex; gap: 8px; align-items: flex-start; font-size: 1.1rem; color: var(--text-muted); line-height: 1.5;">
      <span class="bullet" style="color: var(--brand); flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; min-width: 16px;">${makeBulletHtml(activeBullet)}</span>
      <span class="content" style="text-align: left;">${escapeHtml(content)}</span>
    </div>`;
  }
  listHtml += '</div>';
  return listHtml;
}

function resolveColorKeyword(color) {
  if (!color) return "";
  const lower = String(color).trim().toLowerCase();
  if (lower === "main" || lower === "brand") return "var(--brand)";
  if (lower === "sub" || lower === "branddark" || lower === "brand-dark") return "var(--brand-dark)";
  if (lower === "deep" || lower === "branddeep" || lower === "brand-deep") return "var(--brand-deep)";
  if (lower === "mid" || lower === "brandmid" || lower === "brand-mid") return "var(--brand-mid)";
  if (lower === "light" || lower === "brandlight" || lower === "brand-light") return "var(--brand-light)";
  return color;
}

// [통합] 자체 renderShortcode 제거됨 — 공유 renderShortcodeShared(shortcode-render.mjs) 사용.

export function buildPresentationHtml(docs, { styles, config, htmlConfig, style: __styleOverride } = {}) {
  // 환경 비의존: config 3종을 주입받는다 (정본 build-presentation 의 모듈 전역과 동일 역할)
  const STYLES = styles || {};
  const CONFIG = config || {};
  const HTML_CONFIG = htmlConfig || {};
  const opts = { style: __styleOverride ?? null };
  const fontConfig = HTML_CONFIG?.htmlFont || {};
  const fontTitle = fontConfig.title || "'Noto Serif KR', serif";
  const fontDesc  = fontConfig.desc  || "'Noto Sans KR', sans-serif";
  const fontNote  = fontConfig.note  || "'JetBrains Mono', monospace";
  const fontCode  = fontConfig.code  || "'JetBrains Mono', monospace";
  const fontTag   = fontConfig.tag   || "'Noto Sans KR', sans-serif";
  const fontScale = fontConfig.scale || 1.0;

  const docList = Array.isArray(docs) ? docs : [docs];
  if (!docList.length) throw new Error("변환할 마크다운 문서가 지정되지 않았습니다.");

  const slides = [];
  let mainFm = null;

  // Process all files and collect their H1/H2 slide divisions!
  for (const doc of docList) {
    const raw = String(doc?.raw ?? "").replace(/\r\n/g, "\n");
    const basename = doc?.basename || "";
    const { data: fm, content } = matter(raw);

    const sanitizeTitle = (t) => {
      let clean = String(t ?? "").trim();
      if (clean.startsWith('"') && clean.endsWith('"')) {
        clean = clean.slice(1, -1);
      } else if (clean.startsWith("'") && clean.endsWith("'")) {
        clean = clean.slice(1, -1);
      }
      return clean.trim();
    };

    fm.title = sanitizeTitle(fm.title || "");
    if (fm.subtitle) fm.subtitle = sanitizeTitle(fm.subtitle);

    if (!mainFm) mainFm = fm;

    const styleKey = opts.style || fm.style || "ai-chat";
    const style = STYLES[styleKey] || STYLES["ai-chat"];

    // Parse shortcodes
    let processedContent = content.replace(/^:::\s*([A-Za-z0-9_-]+)(?:[ \t]+([^\r\n]+))?[ \t]*\r?\n([\s\S]*?)(?:\r?\n|^):::[ \t]*$/gm, (_, type, args, body) => {
      const html = renderShortcodeShared(type, body, args);
      return html ? `\n${html.replace(/\n\s+/g, '\n')}\n` : "";
    });

    // Replace literal '\n' and '/n' (not part of URLs) with <br> inside general markdown text
    processedContent = processedContent.replace(/(?<!https?:|[a-zA-Z0-9.\-_]+)(?:\\n|\/n)(?!\w)/g, "<br>");

    // 💡 단독 화살표 줄(↓, →, ↑, ←)을 중앙 정렬 세퍼레이터 div로 치환
    processedContent = processedContent.replace(/^\s*(↓|→|↑|←)\s*$/gm, '<div class="flow-arrow-separator">$1</div>');

    const tokens = marked.lexer(processedContent);
    let currentSlide = {
      type: "cover",
      title: fm.title || basename,
      body: fm.subtitle || fm.description || "",
      style
    };
    let isAfterSplit = false;

    for (const tok of tokens) {
      if (tok.type === "heading" && tok.depth === 1) {
        if (currentSlide && (currentSlide.body.trim() || currentSlide.title.trim())) {
          slides.push(currentSlide);
        }
        const title = marked.parser([{type: 'paragraph', tokens: tok.tokens}]).replace(/^<p>|<\/p>\n?$/g, "");
        currentSlide = {
          type: "cover",
          title,
          body: "",
          style
        };
        isAfterSplit = false;
      } else if (tok.type === "heading" && tok.depth === 2) {
        if (currentSlide && (currentSlide.body.trim() || currentSlide.title.trim())) {
          slides.push(currentSlide);
        }
        const title = marked.parser([{type: 'paragraph', tokens: tok.tokens}]).replace(/^<p>|<\/p>\n?$/g, "");
        currentSlide = {
          type: "content",
          title,
          body: "",
          style
        };
        isAfterSplit = false;
      } else if (tok.type === "hr") {
        if (currentSlide && (currentSlide.body.trim() || currentSlide.title.trim())) {
          slides.push(currentSlide);
        }
        currentSlide = null;
        isAfterSplit = true;
      } else if (tok.type === "space") {
        // ignore
      } else {
        if (!currentSlide) {
          if (!isAfterSplit) {
            currentSlide = {
              type: "cover",
              title: fm.title || basename,
              body: fm.subtitle || fm.description || "",
              style
            };
          } else {
            currentSlide = {
              type: "content",
              title: "",
              body: "",
              style
            };
          }
        }
        if (tok.type === "code" && (tok.lang || "").trim().toLowerCase() === "mermaid") {
          // Mermaid 구조도 — 원문 그대로 <pre class="mermaid">에 넣어 클라이언트에서 mermaid.js 가 렌더링
          currentSlide.body += `<pre class="mermaid">${escapeHtml(tok.text)}</pre>`;
        } else {
          currentSlide.body += marked.parser([tok]);
        }
      }
    }
    if (currentSlide && (currentSlide.body.trim() || currentSlide.title.trim())) {
      slides.push(currentSlide);
    }
  }

  if (!slides.length) throw new Error("변환된 슬라이드 데이터가 없습니다.");

  // Extract main style for global :root defaults
  const mainStyle = STYLES[opts.style || mainFm?.style || "ai-chat"] || STYLES["ai-chat"];

  // Generate TOC items HTML
  // 💡 커버 항목 글자색: 문서마다 다른 --brand-light(전역 :root 고정값, 첫 문서 기준)에 의존하면
  //    라이트모드에서 흰 배경 위에 옅은 파스텔 색이 겹쳐 텍스트가 거의 안 보이는 문제가 생긴다
  //    (여러 문서를 병합한 덱일수록 두드러짐). 문서 자신의 brandDark(짙고 대비가 확보된 톤)를
  //    항목별 CSS 변수로 주입해 라이트/다크 모드 모두에서 읽히도록 한다.
  const tocHtml = slides.map((s, idx) => {
    const plainTitle = s.title.replace(/<[^>]*>/g, "");
    const isCover = s.type === "cover";
    const coverStyleAttr = isCover ? ` style="--cover-color: ${(s.style || mainStyle).brandDark || (s.style || mainStyle).brand}"` : "";
    return `<div class="toc-item${isCover ? " toc-cover" : ""}" data-idx="${idx}"${coverStyleAttr} onclick="scrollToSlide(${idx}); toggleToc(false);">
      <span class="toc-num">${idx + 1}</span>
      <span class="toc-title">${escapeHtml(plainTitle)}</span>
    </div>`;
  }).join("\n");

  // Config-based border-radius
  const radiusVal = CONFIG?.slide?.globalRadius || 0.08;
  const cssRadius = radiusVal > 0 ? `${Math.round(radiusVal * 150)}px` : "12px";

  // Generate slide sections HTML with dynamic per-slide branding!
  const slidesHtml = slides.map((s, idx) => {
    const sNum = `${idx + 1} / ${slides.length}`;
    const activeStyle = s.style || STYLES["ai-chat"];
    const styleAttr = `style="--brand: ${activeStyle.brand}; --brand-dark: ${activeStyle.brandDark}; --brand-deep: ${activeStyle.brandDeep}; --brand-light: ${activeStyle.brandLight}; --brand-mid: ${activeStyle.brandMid}; --brand-gradient: linear-gradient(135deg, ${activeStyle.brand}, ${activeStyle.brandDeep});"`;

    if (s.type === "cover") {
      const coverBg = mainFm?.coverBg || "";
      const coverTextColor = mainFm?.coverTextColor || "";
      
      let coverStyle = "";
      if (coverBg) coverStyle += `background: ${coverBg}; `;
      if (coverTextColor) coverStyle += `color: ${coverTextColor}; `;
      
      const inlineStyle = coverStyle ? `style="${coverStyle}"` : "";
      
      return `<div class="slide cover" ${styleAttr} ${inlineStyle}>
        <h1 ${coverTextColor ? `style="color: ${coverTextColor}; text-shadow: none;"` : ""}>${s.title}</h1>
        ${s.body ? `<div class="cover-body" ${coverTextColor ? `style="color: ${coverTextColor};"` : ""}>${s.body}</div>` : ""}
      </div>`;
    }
    return `<div class="slide content" ${styleAttr}>
      <header class="slide-header">
        <h2>${s.title}</h2>
      </header>
      <div class="slide-body">
        ${s.body}
      </div>
    </div>`;
  }).join("\n");

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Presentation - ${mainFm?.title || 'Slide Deck'}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Noto+Serif+KR:wght@700&family=JetBrains+Mono&display=swap" rel="stylesheet">
<style>
  :root {
    --brand:      ${mainStyle.brand};
    --brand-dark: ${mainStyle.brandDark};
    --brand-deep: ${mainStyle.brandDeep};
    --brand-light: ${mainStyle.brandLight};
    --brand-mid:  ${mainStyle.brandMid};
    --brand-gradient: linear-gradient(135deg, ${mainStyle.brand}, ${mainStyle.brandDeep});
    --border:     rgba(255, 255, 255, 0.1);
    --bg:         #0b0d12; /* 💡 다크모드 기본 배경색을 변경하려면 이 값을 수정하세요! */
    --text:       #f8fafc;
    --text-muted: #94a3b8;
    --text-2:     rgba(255,255,255,0.78); /* 공유 숏코드 CSS(shortcode-styles)에서 사용 */
    --text-3:     rgba(255,255,255,0.55);
    --card-bg:    #11141b; /* 💡 다크모드 카드 배경색을 변경하려면 이 값을 수정하세요! */
    --shadow:     0 4px 24px rgba(0,0,0,0.25);
    --shadow-lg:  0 8px 40px rgba(0,0,0,0.3);
    --done-subtitle-color: rgba(255,255,255,0.85);
    --radius:     ${cssRadius};

    /* 💡 역할별 폰트 — 스타일별 webFont/webFontTitle 우선, 없으면 htmldesign.config.json 기본값 */
    --font-title: ${mainStyle.webFontTitle || fontTitle};
    --font-desc:  ${mainStyle.webFont || fontDesc};
    --font-note:  ${fontNote};
    --font-code:  ${fontCode};
    --font-tag:   ${fontTag};

    /* 💡 폰트 크기 일괄 스케일 배율 (설정 파일 config/htmldesign.config.json 에서 관리) */
    --font-scale: ${fontScale};

    /* 💡 [중앙통제] 특정 숏코드 및 컴포넌트별 폰트 크기 개별 정의 (필요 시 개별 오버라이드 가능!) */
    --size-h1: 3rem;
    --size-h2: 2.6rem;
    --size-h3: 1.8rem;
    --size-body-p: 1.3rem;
    --size-card-title: 1.45rem;
    --size-card-p: 1.2rem;
    --size-stat-val: 2.6rem;
    --size-stat-name: 1.2rem;
    --size-stat-note: 1.1rem;
    --size-plan-badge: 0.8rem;
    --size-plan-features: 1.1rem;
    --size-workflow-name: 1.15rem;
    --size-workflow-tool: 0.95rem;
  }
  body.light-mode {
    --border:     rgba(15, 23, 42, 0.08);
    --bg:         #f8fafc; /* 💡 라이트모드 기본 배경색 */
    --text:       #0f172a;
    --text-muted: #64748b;
    --text-2:     #475569;
    --text-3:     #94a3b8;
    --card-bg:    #ffffff; /* 💡 라이트모드 카드 배경색 */
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: var(--font-desc), sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    transition: background 0.3s ease, color 0.3s ease;
  }

  /* Theme Toggle Button */
  .theme-toggle-btn {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 10000;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }
  .theme-toggle-btn:hover {
    transform: scale(1.08);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  }
  body.light-mode .theme-toggle-btn {
    background: rgba(15, 23, 42, 0.05);
    border: 1px solid rgba(15, 23, 42, 0.1);
    color: #0f172a;
  }
  body.light-mode .theme-toggle-btn:hover {
    background: rgba(15, 23, 42, 0.08);
  }
  body.light-mode .theme-toggle-btn .sun-icon {
    display: block !important;
  }
  body.light-mode .theme-toggle-btn .moon-icon {
    display: none !important;
  }

  /* Light Mode Component Overrides */
  body.light-mode .slide-header h2 {
    color: var(--brand-dark);
  }
  body.light-mode .icon-card-title, 
  body.light-mode .feature-card-title, 
  body.light-mode .compare-card-title, 
  body.light-mode .col-title, 
  body.light-mode .plan-title,
  body.light-mode .stat-name {
    color: var(--text);
  }
  body.light-mode .slide-body p {
    color: var(--text-muted);
  }
  body.light-mode .icon-card p,
  body.light-mode .feature-card p,
  body.light-mode .compare-card p,
  body.light-mode .column-card p,
  body.light-mode .plan-card p,
  body.light-mode .summary-box p,
  body.light-mode .stat-card p,
  body.light-mode .stat-note p,
  body.light-mode .multiline-item {
    color: var(--text-muted);
  }
  body.light-mode .chapter-title strong {
    color: var(--text);
  }
  body.light-mode .git-flow-container {
    background: rgba(15, 23, 42, 0.02);
  }
  body.light-mode .commit-label {
    color: #fff;
  }
  body.light-mode .graph-visual {
    background: #f8fafc;
  }
  body.light-mode .node-main {
    color: #fff;
  }
  body.light-mode .alert-box {
    background: rgba(15, 23, 42, 0.03);
  }
  body.light-mode .alert-body p {
    color: var(--text-muted);
  }
  body.light-mode .compare-note {
    background: rgba(15, 23, 42, 0.03) !important;
    color: var(--text-muted) !important;
  }

  .slides-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .slides-container::-webkit-scrollbar { display: none; }

  .slide {
    flex: 0 0 100vw;
    width: 100vw;
    height: 100vh;
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    padding: 80px 100px;
    box-sizing: border-box;
    position: relative;
    overflow-y: auto;
    background: var(--bg);
  }

  /* Slide types */
  .slide.cover {
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, var(--brand-deep), var(--brand-dark));
    text-align: center;
  }
  .slide.cover h1 {
    font-family: var(--font-title);
    font-size: calc(var(--size-h1) * var(--font-scale));
    font-weight: 900;
    color: #fff;
    margin-bottom: 24px;
    text-shadow: 0 4px 16px rgba(0,0,0,0.3);
    white-space: pre-line;
  }
  .slide.cover > p {
    font-family: var(--font-desc);
    font-size: calc(1.7rem * var(--font-scale));
    color: var(--brand-light);
    max-width: 900px;
    white-space: pre-line;
  }
  .cover-body {
    max-width: 900px;
    margin: 20px auto 0;
    text-align: center;
    color: var(--brand-light);
  }
  .cover-body p {
    font-family: var(--font-desc);
    font-size: calc(1.4rem * var(--font-scale));
    line-height: 1.8;
    margin-bottom: 24px;
    color: var(--brand-light);
    white-space: pre-line;
  }
  
  .slide.content {
    justify-content: flex-start;
    align-items: flex-start;
  }

  .slide-header {
    width: 100%;
    border-bottom: 2px solid var(--brand);
    padding-bottom: 20px;
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .slide-header h2 {
    font-family: var(--font-title);
    font-size: calc(var(--size-h2) * var(--font-scale));
    color: rgba(255,255,255,0.95);
    font-weight: 700;
  }
  .slide-num {
    font-family: var(--font-note);
    font-size: calc(1.2rem * var(--font-scale));
    color: var(--text-muted);
  }

  .slide-body {
    width: 100%;
    flex: 1;
    font-size: calc(1.45rem * var(--font-scale));
    line-height: 1.8;
  }

  /* Premium Table Styles for Slides */
  table { 
    width: 100%; 
    max-width: 96%; 
    border-collapse: separate; 
    border-spacing: 0; 
    margin: 20px auto; 
    font-size: calc(0.9rem * var(--font-scale)); 
    background: rgba(255, 255, 255, 0.05); 
    border-radius: 12px; 
    overflow: hidden; 
    border: 1px solid rgba(255, 255, 255, 0.1); 
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15); 
    backdrop-filter: blur(4px); 
  }

  /* Flow Arrow Separator (↓, →, ↑, ←) Styles */
  .flow-arrow-separator {
    text-align: center;
    font-size: 1.8rem;
    font-weight: 900;
    margin: 15px 0;
    color: var(--brand);
    text-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
    animation: flowBounce 2s infinite;
  }
  @keyframes flowBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  
  .slide:not(.cover) table {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  th { 
    background: rgba(255, 255, 255, 0.15); 
    color: #fff; 
    padding: 14px 16px; 
    font-weight: 800; 
    border-bottom: 2px solid rgba(255, 255, 255, 0.2); 
    text-align: center; 
    font-size: calc(0.95rem * var(--font-scale));
    letter-spacing: -0.02em;
  }
  
  .slide:not(.cover) th {
    background: var(--brand);
    color: #fff;
    border-bottom: 2px solid var(--brand-dark);
  }

  td { 
    padding: 12px 16px; 
    border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
    text-align: center; 
    color: rgba(255, 255, 255, 0.9); 
    font-size: calc(0.85rem * var(--font-scale));
  }
  
  .slide:not(.cover) td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.85);
  }
  /* 라이트모드: 표 본문 글자색 보정 (다크용 흰색 하드코딩이 흰배경에서 안 보이던 문제) */
  body.light-mode td,
  body.light-mode .slide:not(.cover) td {
    color: var(--text-2);
    border-bottom-color: rgba(15, 23, 42, 0.08);
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:nth-child(even) { 
    background: rgba(255, 255, 255, 0.02); 
  }
  
  .slide:not(.cover) tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.03);
  }

  tr:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .slide:not(.cover) tr:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  td.check-highlight { 
    color: #34d399; 
    font-weight: 800; 
    background: rgba(52, 211, 153, 0.1); 
  }
  
  .slide:not(.cover) td.check-highlight {
    color: #34d399;
    background: rgba(52, 211, 153, 0.12);
  }
  .slide-body p { margin-bottom: 20px; color: var(--text-muted); font-size: calc(var(--size-body-p) * var(--font-scale)); }
  .slide-body h3 { font-family: var(--font-title); font-size: calc(var(--size-h3) * var(--font-scale)); color: var(--text); margin: 24px 0 12px; }

  /* ── 공유 숏코드 컴포넌트 CSS (정본: shortcode-styles.mjs — 가이드/클라이언트와 단일 출처) ──
     슬라이드 :root 의 다크 테마 변수 위에서 렌더된다. 라이트 토글은 body.light-mode 변수로 처리. */
${SHORTCODE_CSS}

  /* ── TOC Sidebar ── */
  .toc-toggle-btn {
    position: fixed;
    top: 24px;
    left: 24px;
    z-index: 10001;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }
  .toc-toggle-btn:hover {
    transform: scale(1.08);
    background: rgba(255, 255, 255, 0.15);
  }
  body.light-mode .toc-toggle-btn {
    background: rgba(15, 23, 42, 0.05);
    border: 1px solid rgba(15, 23, 42, 0.1);
    color: #0f172a;
  }
  .toc-overlay {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 9998;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(2px);
  }
  .toc-overlay.active { display: block; }
  .toc-sidebar {
    position: fixed;
    top: 0;
    left: -300px;
    width: 280px;
    height: 100vh;
    background: rgba(11, 13, 18, 0.97);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 9999;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 4px 0 32px rgba(0, 0, 0, 0.4);
  }
  .toc-sidebar.open { left: 0; }
  body.light-mode .toc-sidebar {
    background: rgba(248, 250, 252, 0.97);
    border-right: 1px solid rgba(15, 23, 42, 0.1);
    box-shadow: 4px 0 32px rgba(0, 0, 0, 0.12);
  }
  .toc-header {
    padding: 80px 20px 14px;
    font-family: var(--font-note);
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text-muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
  }
  body.light-mode .toc-header {
    border-bottom-color: rgba(15, 23, 42, 0.08);
  }
  .toc-list {
    flex: 1;
    overflow-y: auto;
    padding: 6px 0;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.1) transparent;
  }
  .toc-list::-webkit-scrollbar { width: 4px; }
  .toc-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
  .toc-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 7px 20px;
    cursor: pointer;
    transition: background 0.15s;
    border-left: 2px solid transparent;
    text-decoration: none;
  }
  .toc-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  body.light-mode .toc-item:hover {
    background: rgba(15, 23, 42, 0.05);
  }
  .toc-item.active {
    background: rgba(255, 255, 255, 0.04);
    border-left-color: var(--brand);
  }
  body.light-mode .toc-item.active {
    background: rgba(15, 23, 42, 0.04);
  }
  .toc-num {
    font-family: var(--font-note);
    font-size: 0.68rem;
    color: var(--text-muted);
    min-width: 22px;
    flex-shrink: 0;
    padding-top: 2px;
    opacity: 0.6;
  }
  .toc-item.active .toc-num { opacity: 1; color: var(--brand); }
  .toc-title {
    font-family: var(--font-desc);
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.45;
    word-break: keep-all;
  }
  .toc-item.active .toc-title { color: var(--text); }
  .toc-cover .toc-title {
    font-weight: 700;
    color: var(--cover-color, var(--brand-light, var(--brand)));
  }
  .toc-item.active.toc-cover .toc-title { color: var(--brand); }

  /* Controls */
  .controls {
    position: fixed; bottom: 30px; right: 40px; display: flex; gap: 15px; z-index: 1000;
  }
  .controls button {
    background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.1); color: #fff;
    width: 50px; height: 50px; border-radius: 50%; cursor: pointer;
    font-size: 20px; display: flex; align-items: center; justify-content: center;
    transition: 0.2s;
  }
  .controls button:hover:not(:disabled) {
    background: var(--brand); transform: scale(1.1);
  }
  .controls button:disabled {
    opacity: 0.3; cursor: not-allowed;
  }

  .progress-bar {
    position: fixed; bottom: 0; left: 0; height: 4px; background: var(--brand);
    transition: width 0.2s ease; z-index: 1000;
  }
  
  .slide-info {
    position: fixed; bottom: 43px; left: 40px; font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; color: var(--text-muted); z-index: 1000;
  }

  /* 📑 A4 Landscape PDF 인쇄 최적화 */
  @media print {
    @page {
      size: A4 landscape;
      margin: 0;
    }
    html, body {
      width: 100%;
      height: 100%;
      overflow: visible !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .theme-toggle-btn,
    .toc-toggle-btn,
    .toc-sidebar,
    .toc-overlay,
    .controls,
    .progress-bar,
    .slide-info {
      display: none !important;
    }
    .slides-container {
      display: block !important;
      width: 100% !important;
      height: auto !important;
      overflow: visible !important;
    }
    .slide {
      display: flex !important;
      flex-direction: column !important;
      width: 100vw !important;
      height: 100vh !important;
      page-break-after: always !important;
      break-after: page !important;
      position: relative !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
      padding: 60px 80px !important;
    }
  }
</style>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>mermaid.initialize({ startOnLoad: true, theme: "dark" });</script>
</head>
<body>
  <div class="slides-container" id="slides">
    ${slidesHtml}
  </div>

  <div class="slide-info" id="slideInfo"></div>
  <div class="progress-bar" id="progress"></div>

  <!-- Theme Toggle -->
  <button class="theme-toggle-btn" id="themeToggle" title="테마 전환 (다크/라이트)">
    <svg class="sun-icon" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  </button>

  <!-- TOC Toggle -->
  <button class="toc-toggle-btn" id="tocToggle" title="목차 열기/닫기 (T)">
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="0" y1="1" x2="18" y2="1"/><line x1="0" y1="7" x2="14" y2="7"/><line x1="0" y1="13" x2="18" y2="13"/>
    </svg>
  </button>

  <!-- TOC Sidebar -->
  <div class="toc-overlay" id="tocOverlay"></div>
  <nav class="toc-sidebar" id="tocSidebar">
    <div class="toc-header">목차</div>
    <div class="toc-list" id="tocList">
      ${tocHtml}
    </div>
  </nav>

  <div class="controls">
    <button id="btnPrev" title="이전 슬라이드 (← / PageUp)">←</button>
    <button id="btnNext" title="다음 슬라이드 (→ / Space / PageDown)">→</button>
  </div>

  <script>
    // os-tabs 탭 전환 (공유 렌더러가 emit 하는 onclick switchTab 과 짝)
    function switchTab(btn,id){var w=btn.closest('.tabs-wrap');w.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active')});w.querySelectorAll('.tab-panel').forEach(function(p){p.classList.remove('active')});btn.classList.add('active');var r=btn.getRootNode();var panel=r.getElementById?r.getElementById(id):document.getElementById(id);if(panel)panel.classList.add('active');}
    const container = document.getElementById('slides');
    const slides = document.querySelectorAll('.slide');
    const progress = document.getElementById('progress');
    const slideInfo = document.getElementById('slideInfo');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    let currentIdx = 0;

    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    if (localStorage.getItem('theme') === 'light' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: light)').matches)) {
      document.body.classList.add('light-mode');
    }
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // TOC Logic
    const tocSidebar = document.getElementById('tocSidebar');
    const tocOverlay = document.getElementById('tocOverlay');
    const tocItems = document.querySelectorAll('.toc-item');
    document.getElementById('tocToggle').addEventListener('click', () => toggleToc());
    tocOverlay.addEventListener('click', () => toggleToc(false));

    function toggleToc(force) {
      const isOpen = typeof force === 'boolean' ? force : !tocSidebar.classList.contains('open');
      tocSidebar.classList.toggle('open', isOpen);
      tocOverlay.classList.toggle('active', isOpen);
    }

    function updateTocActive(idx) {
      tocItems.forEach((item, i) => item.classList.toggle('active', i === idx));
      const active = tocSidebar.querySelector('.toc-item.active');
      if (active) active.scrollIntoView({ block: 'nearest' });
    }

    function update() {
      progress.style.width = ((currentIdx + 1) / slides.length * 100) + '%';
      slideInfo.textContent = 'SLIDE ' + (currentIdx + 1) + ' / ' + slides.length;
      btnPrev.disabled = currentIdx === 0;
      btnNext.disabled = currentIdx === slides.length - 1;
      updateTocActive(currentIdx);
    }

    function scrollToSlide(idx) {
      if (idx < 0 || idx >= slides.length) return;
      currentIdx = idx;
      slides[idx].scrollIntoView({ behavior: 'smooth' });
      update();
    }

    btnPrev.addEventListener('click', () => scrollToSlide(currentIdx - 1));
    btnNext.addEventListener('click', () => scrollToSlide(currentIdx + 1));

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToSlide(currentIdx + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToSlide(currentIdx - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSlide(slides.length - 1);
      } else if (e.key === 't' || e.key === 'T') {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          toggleToc();
        }
      }
    });

    // Handle touch/manual mouse scroll snapping
    let scrollTimeout;
    container.addEventListener('scroll', () => {
      scrollTimeout = setTimeout(() => {
        const width = window.innerWidth;
        const idx = Math.round(container.scrollLeft / width);
        if (idx !== currentIdx && idx >= 0 && idx < slides.length) {
          currentIdx = idx;
          update();
        }
      }, 100);
    });

    update();
  </script>
</body>
</html>`;

  return { html, styleKey: opts.style || mainFm?.style || "ai-chat", fm: mainFm };
}
