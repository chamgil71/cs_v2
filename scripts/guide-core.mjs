/**
 * guide-core.mjs
 * 환경 비의존 코어: 단일 Markdown 문서 → 가이드 HTML 문자열. fs/path 의존 없음.
 * build-guide.mjs(CLI 래퍼)와 src/lib/client-compiler.ts(브라우저 html 모드)가 공유.
 * 정본 출처: build-guide buildHtml(이미 shortcode-render/shortcode-styles 공유 모듈 사용).
 *
 * 입력 doc: { raw: string } 또는 raw 문자열.
 * 옵션: { styles, config, htmlConfig, style }  (styles=styles.json, config=pptdesign, htmlConfig=htmldesign)
 * 반환: { html, styleKey, fm } (기존 buildHtml 과 동일)
 */
import matter from "gray-matter";
import { marked } from "marked";
import {
  escapeHtml,
  buildSizeOverrideStyle,
  renderShortcode,
} from "./shortcode-render.mjs";
import { SHORTCODE_CSS } from "./shortcode-styles.mjs";
import { shortcodeBlockRe, stripHeadingAttrs } from "./library-names.mjs";
import { shapeSetCss, pickShapeSet } from "./shape-set.mjs";

export function buildHtml(doc, { styles, config, htmlConfig, style: __styleOverride, mermaidScript } = {}) {
  // 환경 비의존: config 3종 주입 (정본 build-guide 의 모듈 전역과 동일 역할)
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
  // 크기 토큰: config/htmldesign.config.json 의 htmlSize.guide 에서 로드 (하드코딩 금지 — 폴백만 리터럴)
  const sz = HTML_CONFIG?.htmlSize?.guide || {};

  const raw = String((doc && typeof doc === "object") ? (doc.raw ?? "") : (doc ?? "")).replace(/\r\n/g, "\n");
  const { data: fm, content: rawContent } = matter(raw);
  const content = stripHeadingAttrs(rawContent);   // pptgen md v2 제목 속성 {master=…} 제거
  
  const sanitizeTitle = (t) => {
    let clean = String(t ?? "").trim();
    if (clean.startsWith('"') && clean.endsWith('"')) {
      clean = clean.slice(1, -1);
    } else if (clean.startsWith("'") && clean.endsWith("'")) {
      clean = clean.slice(1, -1);
    }
    return clean.trim();
  };

  fm.title = sanitizeTitle(fm.title || "Guide");
  if (fm.subtitle) fm.subtitle = sanitizeTitle(fm.subtitle);

  const styleKey = opts.style || fm.style || "emerald";
  const style = STYLES[styleKey] || STYLES["emerald"];

  // Config에서 둥글기 값 가져오기 (없으면 0.08인치 -> 12px)
  const radiusVal = CONFIG?.slide?.globalRadius || 0.08;
  const cssRadius = radiusVal > 0 ? `${Math.round(radiusVal * 150)}px` : "0px";

  let processedContent = content.replace(shortcodeBlockRe(), (_, type, rawArgs, body) => {
    let html = renderShortcode(type, body, rawArgs);
    if (!html) return "";
    // title-size / desc-size arg가 있으면 해당 숏코드에만 CSS 변수 오버라이드
    const sizeStyle = buildSizeOverrideStyle(rawArgs || "");
    if (sizeStyle) html = `<div style="${sizeStyle}">${html}</div>`;
    // 💡 핵심: \n 뒤의 모든 공백(들여쓰기)을 제거하여 코드 블록으로 인식되는 것을 방지합니다.
    return `\n${html.replace(/\n\s+/g, '\n')}\n`;
  });

  // Replace literal '\n' and '/n' with <br>, but NOT inside fenced code blocks or inline code spans
  {
    const protected_ = [];
    const protect = (m) => { protected_.push(m); return `\x00P${protected_.length - 1}\x00`; };
    processedContent = processedContent
      .replace(/```[\s\S]*?```/g, protect)
      .replace(/`[^`\n]+`/g, protect)
      .replace(/(?<!https?:|[a-zA-Z0-9.\-_]+)(?:\\n|\/n)(?!\w)/g, "<br>")
      .replace(/\x00P(\d+)\x00/g, (_, i) => protected_[Number(i)]);
  }

  // 💡 단독 화살표 줄(↓, →, ↑, ←)을 중앙 정렬 세퍼레이터 div로 치환
  processedContent = processedContent.replace(/^\s*(↓|→|↑|←)\s*$/gm, '<div class="flow-arrow-separator">$1</div>');

  const tokens = marked.lexer(processedContent);
  let sectionNum = 0, bodyHtml = "", navLinks = [], openSection = false, openCard = false, hasMermaid = false;

  const closeCard = () => { if (openCard) { bodyHtml += `</div>`; openCard = false; } };
  const closeSection = () => { closeCard(); if (openSection) { bodyHtml += `</section>`; openSection = false; } };

  for (const tok of tokens) {
    if (tok.type === "heading" && tok.depth === 1) {
      closeSection(); sectionNum++;
      const title = marked.parser([{type: 'paragraph', tokens: tok.tokens}]).replace(/^<p>|<\/p>\n?$/g, "");
      const id = `sec-${sectionNum}`;
      bodyHtml += `<section class="section" id="${id}"><div class="section-header"><div class="section-num">${sectionNum}</div><h2>${title}</h2></div>`;
      navLinks.push(`<li><a href="#${id}">${title}</a></li>`);
      openSection = true;
    } else if (tok.type === "heading" && tok.depth === 2) {
      closeCard();
      bodyHtml += `<div class="card"><h3 class="card-title">${marked.parser([{type: 'paragraph', tokens: tok.tokens}]).replace(/^<p>|<\/p>\n?$/g, "")}</h3>`;
      openCard = true;
    } else if (tok.type === "code" && (tok.lang || "").trim().toLowerCase() === "mermaid") {
      // Mermaid 구조도 — 원문 그대로 <pre class="mermaid">에 넣어 클라이언트에서 mermaid.js 가 렌더링
      if (openCard) closeCard();
      bodyHtml += `<pre class="mermaid">${escapeHtml(tok.text)}</pre>`;
      hasMermaid = true;
    } else {
      const isShortcode = tok.raw && (
        tok.raw.includes('class="step-flow"') ||
        tok.raw.includes('class="flow"') ||
        tok.raw.includes('class="level-grid"') ||
        tok.raw.includes('class="checkpoint-grid"') ||
        tok.raw.includes('class="compare-diff"') ||
        tok.raw.includes('class="compare-before-after"') ||
        tok.raw.includes('class="takeaway-banner"') ||
        tok.raw.includes('class="takeaway"') ||
        tok.raw.includes('class="part-banner"') ||
        tok.raw.includes('class="part"') ||
        tok.raw.includes('class="chapter-list"') ||
        tok.raw.includes('class="summary-bar"') ||
        tok.raw.includes('class="git-flow-container"') ||
        tok.raw.includes('class="graph-visual"')
      );
      
      const isEmpty = !tok.raw || tok.raw.trim() === "" || tok.raw === "\n";

      // 숏코드가 나오면 기존 열린 카드가 있을 시 닫아주어 숏코드가 카드 바깥의 넓은 그리드로 렌더링되게 보장
      if (isShortcode && openCard) {
        closeCard();
      }

      if (openSection && !openCard && !isShortcode && !isEmpty) {
        bodyHtml += `<div class="card">`;
        openCard = true;
      }
      bodyHtml += marked.parser([tok]);
    }
  }
  closeSection();

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(fm.title || 'Guide')}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Noto+Serif+KR:wght@700&family=JetBrains+Mono&display=swap" rel="stylesheet">
<style>
  :root {
    --brand:      ${style.brand};
    --brand-dark: ${style.brandDark};
    --brand-deep: ${style.brandDeep};
    --brand-light:${style.brandLight};
    --brand-mid:  ${style.brandMid || style.brand};
    --brand-gradient: linear-gradient(135deg, ${style.brand}, ${style.brandDeep});
    --border:     ${style.border};
    --bg:         ${style.bg || '#F8FAFC'};
    --text:   #1A1A2E; --text-2: #475569; --text-3: #8892B0;
    --card-bg:   #fff;
    --done-subtitle-color: ${style.doneSubtitleColor || 'rgba(255,255,255,0.86)'};
    --shadow:    0 4px 24px rgba(0,0,0,0.06);
    --shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
    --radius: ${cssRadius};

    /* 💡 역할별 폰트 — 스타일별 webFont/webFontTitle 우선, 없으면 htmldesign.config.json 기본값 */
    --font-title: ${style.webFontTitle || fontTitle};
    --font-desc:  ${style.webFont || fontDesc};
    --font-note:  ${fontNote};
    --font-code:  ${fontCode};
    --font-tag:   ${fontTag};

    /* 💡 폰트 크기 일괄 스케일 배율 (설정 파일 config/htmldesign.config.json 에서 관리) */
    --font-scale: ${fontScale};

    /* 💡 크기 토큰 — config/htmldesign.config.json 의 htmlSize.guide 에서 로드 (폴백만 리터럴) */
    --size-h1: ${sz['h1'] || '2.2rem'};
    --size-h2: ${sz['h2'] || '1.8rem'};
    --size-h3: ${sz['h3'] || '1.4rem'};
    --size-body-p: ${sz['body-p'] || '0.95rem'};
    --size-card-title: ${sz['card-title'] || '1.15rem'};
    --size-card-p: ${sz['card-p'] || '0.92rem'};
    --size-stat-val: ${sz['stat-val'] || '2.4rem'};
    --size-stat-name: ${sz['stat-name'] || '1.1rem'};
    --size-stat-note: ${sz['stat-note'] || '0.8rem'};
    --size-plan-badge: ${sz['plan-badge'] || '0.75rem'};
    --size-plan-features: ${sz['plan-features'] || '0.95rem'};
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font-desc), sans-serif; background: var(--bg); color: var(--text); line-height: 1.7; }
  
  /* Navigation & Hero */
  .nav { position: sticky; top: 0; z-index: 1000; background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); height: 60px; }
  .nav-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 100%; padding: 0 24px; }
  .nav-logo { font-weight: 900; color: var(--brand); text-decoration: none; font-size: calc(1.1rem * var(--font-scale)); }
  .nav-links { display: flex; gap: 18px; list-style: none; }
  .nav-links a { text-decoration: none; color: var(--text-2); font-size: calc(14px * var(--font-scale)); font-weight: 500; transition: 0.2s; }
  .nav-links a:hover { color: var(--brand); }
  .nav-more { color: var(--text-3); font-size: calc(13px * var(--font-scale)); white-space: nowrap; padding: 0 4px; }
  .hero { background: ${style.heroGradient || 'var(--brand-dark)'}; color: white; padding: 80px 24px 60px; text-align: center; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 50%, ${style.brand}55 0%, transparent 60%); pointer-events: none; }
  .hero-inner { max-width: 760px; margin: 0 auto; position: relative; z-index: 1; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.25); border-radius: 100px; padding: 6px 16px; font-size: calc(13px * var(--font-scale)); font-weight: 500; margin-bottom: 28px; }
  .hero-badge span { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
  .hero-logo { width: 90px; height: 90px; margin: 0 auto 24px; background: rgba(255,255,255,0.12); border-radius: 24px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); font-size: calc(44px * var(--font-scale)); }
  .hero h1 { font-family: var(--font-title); font-size: calc(clamp(2rem, 5vw, 3rem) * var(--font-scale)); font-weight: 700; margin-bottom: 16px; line-height: 1.2; white-space: pre-line; }
  .hero p { font-size: calc(1.1rem * var(--font-scale)); color: ${style.subtitleColor || 'rgba(255,255,255,0.85)'}; margin-bottom: 40px; white-space: pre-line; }
  .hero-cta { display: inline-flex; align-items: center; gap: 8px; background: white; color: var(--brand-dark); font-weight: 800; font-size: calc(16px * var(--font-scale)); padding: 13px 24px; border-radius: 100px; text-decoration: none; box-shadow: var(--shadow-lg); margin-bottom: 38px; transition: transform .2s, box-shadow .2s; }
  .hero-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 44px rgba(0,0,0,0.18); }
  .hero-stats { display: flex; gap: 32px; justify-content: center; flex-wrap: wrap; }
  .hero-stat { text-align: center; }
  .hero-stat strong { display: block; font-size: calc(1.6rem * var(--font-scale)); font-weight: 700; }
  .hero-stat span { font-size: calc(0.8rem * var(--font-scale)); opacity: .7; }
  @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .6; transform: scale(1.2); } }

  /* Layout */
  main { max-width: 1100px; margin: 0 auto; padding: 60px 24px; }
  .section { margin-bottom: 80px; scroll-margin-top: 80px; }
  .section-header { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; }
  .section-num { width: 40px; height: 40px; background: var(--brand); color: #fff; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: calc(1.15rem * var(--font-scale)); }
  .section-header h2 { font-family: var(--font-title); font-size: calc(var(--size-h2) * var(--font-scale)); font-weight: 700; }
  .card { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 35px; margin-bottom: 24px; box-shadow: var(--shadow); }
  .card-title { font-family: var(--font-title); font-size: calc(var(--size-h3) * var(--font-scale)); color: var(--brand-dark); margin-bottom: 20px; border-bottom: 2px solid var(--brand-light); display: inline-block; padding-bottom: 5px; font-weight: 800;}

  /* Mermaid 다이어그램 — 세로형(TD) 등 자연 크기가 본문 폭보다 큰 경우 비율 유지하며 축소 */
  .mermaid, pre.mermaid { max-width: 100%; overflow-x: auto; }
  .mermaid svg, pre.mermaid svg { max-width: 100%; height: auto; }

${SHORTCODE_CSS}
${shapeSetCss(pickShapeSet(style.shapeSet, fm.shape))}</style>
${hasMermaid ? (mermaidScript ? `<script>${mermaidScript}</script>` : `<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>`) + `\n<script>mermaid.initialize({ startOnLoad: true, theme: "default" });</script>` : ""}
</head>
<body>
  <nav class="nav"><div class="nav-inner"><a href="#" class="nav-logo">${fm.logo ? fm.logo + " " : ""}${escapeHtml(fm.title)}</a><ul class="nav-links">${navLinks.slice(0, 7).join("")}${navLinks.length > 7 ? `<li class="nav-more">+${navLinks.length - 7}</li>` : ""}</ul></div></nav>
  <header class="hero">
    <div class="hero-inner">
      ${fm.badge ? `<div class="hero-badge"><span></span>${escapeHtml(fm.badge)}</div>` : ""}
      ${fm.logo ? `<div class="hero-logo">${escapeHtml(fm.logo)}</div>` : ""}
      <h1>${escapeHtml(fm.title)}</h1>
      <p>${escapeHtml(fm.subtitle)}</p>
      ${fm.heroCta ? `<a class="hero-cta" href="${escapeHtml(fm.heroCta.url || "#")}" target="_blank" rel="noopener">${escapeHtml(fm.heroCta.label)}</a>` : ""}
      ${fm.stats && fm.stats.length ? `<div class="hero-stats">${fm.stats.map(s => `<div class="hero-stat"><strong>${escapeHtml(s.value)}</strong><span>${escapeHtml(s.label)}</span></div>`).join("")}</div>` : ""}
    </div>
  </header>
  <main id="top">${bodyHtml}</main>
  ${fm.done ? `<section class="done-section">
    <h2>${escapeHtml(fm.done.title || "")}</h2>
    ${fm.done.subtitle ? `<p>${escapeHtml(fm.done.subtitle)}</p>` : ""}
    ${fm.done.ctaLabel ? `<a class="done-link" href="${escapeHtml(fm.done.ctaUrl || "#")}" target="_blank" rel="noopener">${escapeHtml(fm.done.ctaLabel)}</a>` : ""}
  </section>` : ""}
  ${fm.footer && fm.footer.length ? `<footer>${fm.footer.map(line => `<div>${marked.parseInline(line)}</div>`).join("")}</footer>` : ""}
  <a class="back-top" href="#top" title="맨 위로">↑</a>
<script>
function switchTab(btn,id){var w=btn.closest('.tabs-wrap');w.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active')});w.querySelectorAll('.tab-panel').forEach(function(p){p.classList.remove('active')});btn.classList.add('active');var r=btn.getRootNode();var panel=r.getElementById?r.getElementById(id):document.getElementById(id);if(panel)panel.classList.add('active');}
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('td').forEach(function(td) {
    if (td.textContent.trim() === '✓') {
      td.classList.add('check-highlight');
    }
  });
});
</script>
</body>
</html>`;

  return { html, styleKey, fm };
}

// ════════════════════════════════════════════════════════════════
//  4. CLI 진입점
// ════════════════════════════════════════════════════════════════
