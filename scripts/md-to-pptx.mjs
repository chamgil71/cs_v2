#!/usr/bin/env node
/**
 * md-to-pptx.mjs
 * Universal Schema(6대 표준 키: icon, title, desc, tag, meta, color) 기반 MD→PPTX 변환 CLI
 */

import { readFileSync, mkdirSync } from "node:fs";
import { join, dirname, basename, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import pptxgen from "pptxgenjs";
import { glob } from "node:fs/promises";
import { pptxRegistry, helpers } from "./pptx-renderers/registry.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ════════════════════════════════════════════════════════════════
//  1. Universal Schema — 6대 표준 키값
// ════════════════════════════════════════════════════════════════

function splitMeta(meta) {
  if (!meta) return [];
  return String(meta)
    .split(/[|\n]/)
    .map(s => s.trim().replace(/^["']|["']$/g, "").trim())
    .filter(Boolean);
}

function standardizeItem(item) {
  const rawName = item.name || item.title || "";
  const iconMatch = rawName.match(/^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*(.*)$/);

  const icon =     item.icon || (iconMatch ? iconMatch[1] : "") || "";
  const title =    item.title || (iconMatch ? iconMatch[2] : item.name) || item.col || "";
  const desc =     String(item.desc || item.description || item.tagline || item.body || "").replace(/\\n/g, "\n");
  const tag =      item.tag || item.badge || "";
  const color =    item.color || "";
  const featured = String(item.featured || "").trim().toLowerCase() === "true" ? "true" : "";

  // meta와 note를 보존
  const meta = item.meta || item.features || item.items || item.points || item.tool || "";
  const note = String(item.note || "").replace(/\\n/g, "\n");

  return {
    icon,
    title,
    desc,
    tag,
    meta,
    note,
    color,
    featured
  };
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

function cleanValue(v) {
  return String(v ?? "").trim().replace(/^["']|["']$/g, "");
}

// ════════════════════════════════════════════════════════════════
//  2. 설정 로드
// ════════════════════════════════════════════════════════════════

function loadJsonWithComments(filePath) {
  const src = readFileSync(filePath, "utf8")
    .replace(/\/\/[^\n]*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
  return JSON.parse(src);
}

const CONFIG_DIR = resolve(__dirname, "../config");
const STYLES = loadJsonWithComments(resolve(CONFIG_DIR, "styles.json"));
let D      = loadJsonWithComments(resolve(CONFIG_DIR, "pptdesign.config.json"));

// ════════════════════════════════════════════════════════════════
//  3. CLI 파서
// ════════════════════════════════════════════════════════════════

function parseCLI(argv) {
  const flags = { noCover: false, all: false, verbose: false };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--no-cover") { flags.noCover = true; continue; }
    if (a === "--all")      { flags.all = true; continue; }
    if (a === "--verbose")  { flags.verbose = true; continue; }
    if (a.startsWith("--")) {
      const key = a.slice(2);
      flags[key] = (!argv[i + 1] || argv[i + 1].startsWith("--")) ? true : argv[++i];
    } else {
      positional.push(a);
    }
  }
  return { positional, ...flags };
}

// ════════════════════════════════════════════════════════════════
//  4. 유틸
// ════════════════════════════════════════════════════════════════

function hexClean(hex) {
  if (!hex) return null;
  hex = (hex + "").replace(/^["']|["']$/g, "").replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
  return hex.length >= 6 ? hex.slice(0, 6).toUpperCase() : null;
}

function stripMd(text) {
  return (text || "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/~~(.+?)~~/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function extractText(tok) {
  if (!tok) return "";
  if (typeof tok.text === "string") return tok.text;
  if (Array.isArray(tok.tokens)) return tok.tokens.map(t => extractText(t)).join("");
  return tok.raw || "";
}

function estimateLines(text, widthInch, fontSize) {
  const charsPerLine = Math.max(8, Math.floor(widthInch * 68 / (fontSize * 0.55)));
  return Math.max(1, Math.ceil((text || "").length / charsPerLine));
}

// ════════════════════════════════════════════════════════════════
//  5. MD 파서
// ════════════════════════════════════════════════════════════════

function parseContentParts(content) {
  const parts = [];
  const re = /^:::\s*([A-Za-z0-9_-]+)(?:[ \t]+([^\r\n]+))?[ \t]*\r?\n([\s\S]*?)(?:\r?\n|^):::[ \t]*$/gm;
  let lastIndex = 0;
  let match;
  while ((match = re.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ kind: "md", src: content.slice(lastIndex, match.index) });
    }
    parts.push({ kind: "shortcode", scType: match[1], args: match[2] || "", rawBody: match[3], items: parseShortcodeItems(match[3]) });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push({ kind: "md", src: content.slice(lastIndex) });
  }
  return parts;
}

function tokenToBlock(tok) {
  switch (tok.type) {
    case "paragraph": {
      if (tok.tokens && tok.tokens.length === 1 && tok.tokens[0].type === "image") {
        const img = tok.tokens[0];
        return { type: "image", src: img.href, alt: img.text };
      }
      return { type: "p", text: stripMd(extractText(tok)) };
    }
    case "heading":
      if (tok.depth === 3) return { type: "h3", text: stripMd(extractText(tok)) };
      if (tok.depth === 4) return { type: "h4", text: stripMd(extractText(tok)) };
      return null;
    case "list":
      return {
        type: tok.ordered ? "ol" : "ul",
        items: tok.items.map(item => stripMd(item.text || extractText(item))),
      };
    case "blockquote": {
      const t = (tok.tokens || []).map(t2 => extractText(t2)).join(" ");
      return { type: "blockquote", text: stripMd(t) };
    }
    case "code":
      return { type: "code", lang: tok.lang || "", text: tok.text || "" };
    case "table":
      return {
        type: "table",
        headers: tok.header.map(h => stripMd(extractText(h))),
        rows: tok.rows.map(row => row.map(cell => stripMd(extractText(cell)))),
      };
    default:
      return null;
  }
}

function buildSlideData(mdPath, styleOverride) {
  const raw = readFileSync(mdPath, "utf8").replace(/\r\n/g, "\n");
  const { data: fm, content } = matter(raw);
  const styleKey = styleOverride || fm.style || "ai-chat";
  const style = STYLES[styleKey] || STYLES["ai-chat"];
  const parts = parseContentParts(content);
  const sections = [];
  let currentSection = null;
  let currentCard = null;
  let sectionNum = 0;

  function closeCard() {
    if (currentCard) {
      const hasTitle = !!(currentCard.title && currentCard.title.trim());
      const hasBlocks = currentCard.blocks && currentCard.blocks.length > 0;
      if (hasTitle || hasBlocks) {
        if (currentSection) currentSection.items.push(currentCard);
      }
      currentCard = null;
    }
  }
  function closeSection() {
    closeCard();
    if (currentSection) {
      const hasItems = currentSection.items && currentSection.items.length > 0;
      const hasTitle = !!(currentSection.title && currentSection.title.trim());
      const hasConfig = !!currentSection.config;
      
      if (hasItems || hasTitle || hasConfig) {
        sections.push(currentSection);
      }
    }
    currentSection = null;
  }

  for (const part of parts) {
    if (part.kind === "shortcode") {
      if (!currentSection) { sectionNum++; currentSection = { num: sectionNum, title: "", items: [] }; }
      closeCard();
      if (part.scType === "slide-config") {
        currentSection.config = currentSection.config || {};
        const lines = (part.rawBody || "").split(/\r?\n/);
        for (const line of lines) {
          const m = line.match(/^\s*(?:-\s*)?([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
          if (m) {
            const key = m[1].trim();
            const val = cleanValue(m[2]);
            currentSection.config[key] = val;
          }
        }
      } else {
        currentSection.items.push({ type: part.scType, args: part.args || "", items: part.items });
      }
      continue;
    }
    const tokens = marked.lexer(part.src);
    for (const tok of tokens) {
      if (tok.type === "heading" && tok.depth === 1) {
        closeSection();
        sectionNum++;
        const raw2 = stripMd(extractText(tok));
        const m = raw2.match(/^\s*(\d+)\.\s*(.+)$/);
        currentSection = { num: m ? parseInt(m[1]) : sectionNum, title: m ? m[2] : raw2, items: [] };
      } else if (tok.type === "heading" && tok.depth === 2) {
        closeCard();
        const h2Title = stripMd(extractText(tok));
        if (!currentSection) {
          sectionNum++;
          currentSection = { num: sectionNum, title: h2Title, items: [] };
        } else if (!currentSection.title) {
          currentSection.title = h2Title;
        }
        currentCard = { type: "card", title: h2Title, blocks: [] };
      } else if (tok.type === "hr") {
        closeSection();
      } else if (tok.type === "space") {
        // ignore
      } else {
        if (!currentSection) { sectionNum++; currentSection = { num: sectionNum, title: "", items: [] }; }
        if (!currentCard) currentCard = { type: "card", title: "", blocks: [] };
        const block = tokenToBlock(tok);
        if (block) currentCard.blocks.push(block);
      }
    }
  }
  closeSection();
  return { fm, sections, styleKey, style };
}

// ════════════════════════════════════════════════════════════════
//  6. 높이 추정 (레지스트리 기반 위임)
// ════════════════════════════════════════════════════════════════

function blockH(block, w) {
  const c = D.card;
  switch (block.type) {
    case "image": return 2.5 + c.gap;
    case "h3": return (c.h3Size / 72) * 1.7 + c.gap;
    case "h4": return ((c.h3Size - 1) / 72) * 1.7 + c.gap;
    case "p": return (c.bodySize / 72) * 1.7 * estimateLines(block.text, w - c.padX * 2, c.bodySize) + c.gap;
    case "ul":
    case "ol": return (c.bodySize / 72) * 1.7 * block.items.length + c.gap;
    case "blockquote": return Math.max(0.4, (c.bodySize / 72) * 1.7 * estimateLines(block.text, w - c.padX * 2 - c.quoteBarW - 0.1, c.bodySize) + 0.15) + c.gap;
    case "code": return (c.codeSize / 72) * 1.7 * (block.text || "").split("\n").length + 0.2 + c.gap;
    case "table": return 0.35 + 0.28 * (block.rows || []).length + c.gap;
    default: return 0;
  }
}

function cardH(card, w) {
  const c = D.card;
  let h = c.padY * 2;
  if (card.title) h += (c.titleSize / 72) * 1.7 + c.gap * 0.5;
  for (const b of (card.blocks || [])) h += blockH(b, w);
  return Math.max(0.45, h);
}

function itemH(item, w, pal) {
  if (item.type === "card") return cardH(item, w);
  
  const renderer = pptxRegistry.get(item.type);
  if (renderer) {
    try {
      const boundHelpers = {
        ...helpers,
        hexClean(hex) {
          return helpers.hexClean(hex, pal);
        }
      };
      return renderer.estimateHeight(item, w, D, boundHelpers);
    } catch (err) {
      console.error(`  ⚠️  숏코드 높이 추정 오류 (${item.type}): ${err.message}`);
      return 1.0;
    }
  }
  
  return 0;
}

// ════════════════════════════════════════════════════════════════
//  7. 팔레트
// ════════════════════════════════════════════════════════════════

function makePalette(style) {
  const p = D.palette;
  return {
    brand:      hexClean(style.brand)      || "6366F1",
    brandDark:  hexClean(style.brandDark)  || "4338CA",
    brandDeep:  hexClean(style.brandDeep)  || "3730A3",
    brandLight: hexClean(style.brandLight) || "EEF2FF",
    border:     hexClean(style.border)     || "D8DCFB",
    bgDark:     p.bgDark,
    white:      p.white,
    text:       p.text,
    text2:      p.text2,
    muted:      p.muted      || "8892B0",
    mutedLight: p.mutedLight || "CCDDDD",
    codeBg:     p.codeBg,
    codeText:   p.codeText   || "A8B2D8",
  };
}

// ════════════════════════════════════════════════════════════════
//  8. 마크다운 기본 블록 렌더러 (정밀 폰트 적용)
// ════════════════════════════════════════════════════════════════

function renderBlock(slide, block, x, y, w, pal) {
  const c = D.card;
  const font = D.slide.font;
  const fontTitle = D.slide.fontTitle || font;
  const fontSubTitle = D.slide.fontSubTitle || font;
  const mono = D.slide.fontMono;

  if (block.type === "h3") {
    const h = (c.h3Size / 72) * 1.7;
    slide.addText(block.text, { x, y, w, h: h + 0.05, fontSize: c.h3Size, bold: true, color: pal.text, fontFace: fontSubTitle, valign: "top" });
    return h + c.gap;
  }
  if (block.type === "h4") {
    const fs = c.h3Size - 1;
    const h = (fs / 72) * 1.7;
    slide.addText(block.text, { x, y, w, h: h + 0.05, fontSize: fs, bold: true, color: pal.text2, fontFace: fontSubTitle, valign: "top" });
    return h + c.gap;
  }
  if (block.type === "p") {
    const lines = estimateLines(block.text, w, c.bodySize);
    const h = Math.max(0.2, (c.bodySize / 72) * 1.7 * lines);
    slide.addText(block.text, { x, y, w, h, fontSize: c.bodySize, color: pal.text2, fontFace: font, valign: "top", wrap: true });
    return h + c.gap;
  }
  if (block.type === "ul" || block.type === "ol") {
    const lineH = (c.bodySize / 72) * 1.7;
    const h = Math.max(0.2, lineH * block.items.length);
    const textArr = block.items.map((item, i) => ({
      text: (block.type === "ol" ? `${i + 1}. ` : "• ") + item + "\n",
      options: { fontSize: c.bodySize, color: pal.text2, fontFace: font },
    }));
    slide.addText(textArr, { x, y, w, h, valign: "top" });
    return h + c.gap;
  }
  if (block.type === "blockquote") {
    const lines = estimateLines(block.text, w - c.quoteBarW - 0.12, c.bodySize);
    const h = Math.max(0.38, (c.bodySize / 72) * 1.7 * lines + 0.15);
    slide.addShape("rect", { x, y, w: c.quoteBarW, h, fill: { color: pal.brand }, line: { width: 0 } });
    slide.addShape("rect", { x: x + c.quoteBarW, y, w: w - c.quoteBarW, h, fill: { color: pal.brandLight }, line: { width: 0 } });
    slide.addText(block.text, {
      x: x + c.quoteBarW + 0.1, y: y + 0.06, w: w - c.quoteBarW - 0.14, h: h - 0.1,
      fontSize: c.bodySize, color: pal.brandDeep || pal.brandDark, fontFace: font, italic: true, valign: "middle", wrap: true,
    });
    return h + c.gap;
  }
  if (block.type === "code") {
    const codeLines = (block.text || "").split("\n");
    const h = Math.max(0.4, (c.codeSize / 72) * 1.7 * codeLines.length + 0.2);
    slide.addShape("rect", { x, y, w, h, fill: { color: pal.codeBg || "0F172A" }, line: { color: pal.border, width: 0.75 } });
    slide.addText(block.text, {
      x: x + 0.12, y: y + 0.08, w: w - 0.24, h: h - 0.1,
      fontSize: c.codeSize, color: pal.codeText, fontFace: mono, valign: "top", wrap: true,
    });
    return h + c.gap;
  }
  if (block.type === "table") {
    const headerH = 0.35;
    const rowH = 0.28;
    const totalH = headerH + rowH * (block.rows || []).length;
    const colW = w / Math.max(1, block.headers.length);
    const tableData = [
      block.headers.map(h2 => ({ text: h2, options: { bold: true, fontSize: c.bodySize, color: pal.white, fill: { color: pal.brand }, align: "center", valign: "middle" } })),
      ...(block.rows || []).map((row, rIdx) => row.map(cell => {
        const isEven = rIdx % 2 === 1;
        const isCheck = cell === "√" || cell === "✓" || cell === "✅";
        return { 
          text: cell, 
          options: { 
            fontSize: c.bodySize - 1, 
            color: isCheck ? pal.brand : pal.text2, 
            bold: isCheck,
            fill: isEven ? { color: "FAFAFA" } : undefined,
            align: "center",
            valign: "middle"
          } 
        };
      })),
    ];
    slide.addTable(tableData, {
      x, y, w,
      colW: block.headers.map(() => colW),
      rowH: [headerH, ...(block.rows || []).map(() => rowH)],
      border: { color: pal.border, size: 0.75 },
      fontFace: font,
    });
    return totalH + c.gap;
  }
  if (block.type === "image") {
    const h = 2.5;
    try {
      slide.addImage({
        path: block.src,
        x,
        y,
        w,
        h,
        altText: block.alt || "image"
      });
    } catch (err) {
      slide.addShape("rect", { x, y, w, h, fill: { color: "F1F5F9" }, line: { color: pal.border, width: 0.75 } });
      slide.addText(`[이미지 표시 실패: ${block.alt || 'No Alt'} (${block.src})]`, { x, y, w, h, fontSize: 10, align: "center", valign: "middle", color: pal.text2, fontFace: font });
    }
    return h + c.gap;
  }
  return 0;
}

function renderCard(slide, card, x, y, w, pal) {
  const c = D.card;
  const font = D.slide.font;
  const fontSubTitle = D.slide.fontSubTitle || font;
  const r = D.slide.globalRadius;
  const h = cardH(card, w);
  slide.addShape("roundRect", { x, y, w, h, rectRadius: r, fill: { color: pal.white }, line: { color: pal.border, width: 0.75 } });
  let cy = y + c.padY;
  if (card.title) {
    const th = (c.titleSize / 72) * 1.7;
    slide.addText(card.title, { x: x + c.padX, y: cy, w: w - c.padX * 2, h: th + 0.05, fontSize: c.titleSize, bold: true, color: pal.brandDark, fontFace: fontSubTitle, valign: "top" });
    cy += th + 0.05 + c.gap * 0.5;
  }
  for (const block of (card.blocks || [])) cy += renderBlock(slide, block, x + c.padX, cy, w - c.padX * 2, pal);
  return h;
}

// ════════════════════════════════════════════════════════════════
//  9. 숏코드 렌더러 디스패처 (레지스트리 위임)
// ════════════════════════════════════════════════════════════════

function renderItem(slide, item, x, y, w, pal) {
  if (item.type === "card") return renderCard(slide, item, x, y, w, pal);
  
  const renderer = pptxRegistry.get(item.type);
  if (renderer) {
    try {
      const boundHelpers = {
        ...helpers,
        hexClean(hex) {
          return helpers.hexClean(hex, pal);
        }
      };
      return renderer.render(slide, item, x, y, w, pal, D, boundHelpers);
    } catch (err) {
      console.error(`  ❌ 숏코드 렌더링 실패 (${item.type}):`, err);
      slide.addShape("roundRect", { x, y, w, h: 0.5, fill: { color: "FFF1F2" }, line: { color: "EF4444", width: 1.0 } });
      slide.addText(`[숏코드 렌더링 에러: ${item.type} (${err.message})]`, { x: x + 0.1, y, w: w - 0.2, h: 0.5, fontSize: 9.5, color: "B91C1C", valign: "middle" });
      return 0.5;
    }
  }
  
  console.warn(`  ⚠️  PPTX 미구현 숏코드: "${item.type}" — 슬라이드에서 제외됨`);
  return 0;
}

// ════════════════════════════════════════════════════════════════
//  10. 슬라이드 렌더러 (표지 및 섹션 렌더링)
// ════════════════════════════════════════════════════════════════

function renderCover(prs, fm, pal) {
  const slide = prs.addSlide();
  const dc = D.cover;
  const sw = D.slide.widthIn;
  const sh = D.slide.heightIn || 7.5;
  const font = D.slide.font;
  const fontTitle = D.slide.fontTitle || font;
  
  // 1. Frontmatter 색상 및 레이아웃 설정 파싱
  const customBg = hexClean(fm.coverBg);
  const customAccent = hexClean(fm.coverAccent);
  const customTextColor = hexClean(fm.coverTextColor);
  const layout = String(fm.coverLayout || "accent-bar").trim().toLowerCase();
  
  const bg = customBg || pal.bgDark;
  const accent = customAccent || pal.brand;
  const textClr = customTextColor || pal.white;
  
  // 2. 제목 정제 및 멀티라인 높이 계산
  const sanitizeTitle = (t) => {
    let clean = String(t ?? "").trim();
    if (clean.startsWith('"') && clean.endsWith('"')) {
      clean = clean.slice(1, -1);
    } else if (clean.startsWith("'") && clean.endsWith("'")) {
      clean = clean.slice(1, -1);
    }
    return clean.trim();
  };

  const titleText = sanitizeTitle(fm.title || "Guide Title");
  const titleLines = titleText ? titleText.split(/\r?\n/).length : 1;

  // 3. 배경 설정
  slide.background = { color: bg };
  
  // 4. 레이아웃에 따른 렌더링
  if (layout === "full-brand") {
    slide.background = { color: pal.brand };
    slide.addShape("rect", { x: 0, y: sh - 0.12, w: sw, h: 0.12, fill: { color: pal.white }, line: { width: 0 } });
    
    let ty = dc.titleY - 0.2;
    if (fm.logo) {
      slide.addText(fm.logo, { x: 1.0, y: ty - 0.85, w: 1.0, h: 0.75, fontSize: dc.logoFontSize + 4, align: "left", valign: "middle" });
    }
    const titleH = 1.3 + (titleLines - 1) * 0.7;
    slide.addText(titleText, { x: 1.0, y: ty, w: sw - 2.0, h: titleH, fontSize: dc.titleFontSize + 2, bold: true, color: pal.white, fontFace: fontTitle, valign: "top" });
    ty += titleH + 0.05;
    if (fm.subtitle) {
      slide.addText(fm.subtitle, { x: 1.0, y: ty, w: sw - 2.0, h: 0.45, fontSize: dc.subtitleFontSize + 1, color: pal.brandLight, fontFace: font });
      ty += 0.55;
    }
  } else if (layout === "minimal-dark") {
    let ty = dc.titleY;
    if (fm.logo) {
      slide.addText(fm.logo, { x: 1.0, y: ty - 0.85, w: 1.0, h: 0.75, fontSize: dc.logoFontSize, align: "left", valign: "middle" });
    }
    const titleH = 1.2 + (titleLines - 1) * 0.7;
    slide.addText(titleText, { x: 1.0, y: ty, w: sw - 2.0, h: titleH, fontSize: dc.titleFontSize, bold: true, color: textClr, fontFace: fontTitle, valign: "top" });
    ty += titleH;
    if (fm.subtitle) {
      slide.addText(fm.subtitle, { x: 1.0, y: ty, w: sw - 2.0, h: 0.4, fontSize: dc.subtitleFontSize, color: pal.muted, fontFace: font });
      ty += 0.5;
    }
  } else {
    slide.addShape("rect", { x: dc.accentBarX, y: dc.accentBarY, w: dc.accentBarW, h: dc.accentBarH, fill: { color: accent }, line: { width: 0 } });
    
    let ty = dc.titleY;
    if (fm.logo) {
      slide.addText(fm.logo, { x: dc.titleX, y: ty - 0.85, w: 0.85, h: 0.75, fontSize: dc.logoFontSize, align: "left", valign: "middle" });
    }
    const titleH = 1.2 + (titleLines - 1) * 0.7;
    slide.addText(titleText, { x: dc.titleX, y: ty, w: sw - dc.titleX - 0.5, h: titleH, fontSize: dc.titleFontSize, bold: true, color: textClr, fontFace: fontTitle, valign: "top" });
    ty += titleH;
    if (fm.subtitle) {
      slide.addText(fm.subtitle, { x: dc.titleX, y: ty, w: sw - dc.titleX - 0.5, h: 0.4, fontSize: dc.subtitleFontSize, color: pal.muted, fontFace: font });
      ty += 0.5;
    }
  }
  
  // 4. 하단 통계 지표
  let statsY = sh - 1.8;
  if (fm.stats?.length) {
    const statW = 1.6;
    fm.stats.forEach((stat, i) => {
      const sx = (layout === "accent-bar" ? dc.titleX : 1.0) + i * (statW + 0.3);
      slide.addText(stat.value || "", { x: sx, y: statsY, w: statW, h: 0.38, fontSize: 19, bold: true, color: accent, fontFace: fontTitle });
      slide.addText(stat.label || "", { x: sx, y: statsY + 0.38, w: statW, h: 0.24, fontSize: 9.5, color: pal.muted, fontFace: font });
    });
  }
}

function renderSectionSlide(prs, section, pal, verbose) {
  const originalD = JSON.parse(JSON.stringify(D));
  
  if (section.config) {
    if (section.config.titleSize) D.card.titleSize = Number(section.config.titleSize);
    if (section.config.bodySize) D.card.bodySize = Number(section.config.bodySize);
  }

  try {
    const dh = D.header;
    const sw = D.slide.widthIn;
    const mx = D.slide.marginX;
    const font = D.slide.font;
    const fontTitle = D.slide.fontTitle || font;
    const bodyW = sw - mx * 2;
    
    // 슬라이드 단위 팔레트 세팅
    const slidePal = { ...pal };
    const slideBg = (section.config && section.config.bg) || D.palette.white;
    
    if (section.config && section.config.bg) {
      const customBg = hexClean(section.config.bg);
      if (customBg) {
        slidePal.white = customBg;
      }
    }
    
    if (section.config && section.config.color) {
      const customColor = hexClean(section.config.color);
      if (customColor) {
        slidePal.text = customColor;
        slidePal.text2 = customColor;
      }
    }

    // 슬라이드 자동분할 헤더 초기화
    let currentSlide = prs.addSlide();
    let pageCount = 1;

    function initSlideHeader(slide, pageNum) {
      slide.background = { color: hexClean(slideBg) || "FFFFFF" };
      slide.addShape("rect", { x: 0, y: dh.y, w: sw, h: dh.h, fill: { color: slidePal.bgDark }, line: { width: 0 } });
      
      const nbs = dh.numBoxSize;
      const nby = dh.y + (dh.h - nbs) / 2;
      slide.addShape("roundRect", { x: dh.paddingX, y: nby, w: nbs, h: nbs, rectRadius: 0.1, fill: { color: slidePal.brand }, line: { width: 0 } });
      slide.addText(String(section.num), { x: dh.paddingX, y: nby, w: nbs, h: nbs, fontSize: dh.numFontSize, bold: true, color: slidePal.white, fontFace: fontTitle, align: "center", valign: "middle" });
      
      const displayTitle = section.title + (pageNum > 1 ? " (계속)" : "");
      slide.addText(displayTitle, { x: dh.paddingX + nbs + 0.15, y: dh.y, w: sw - dh.paddingX - nbs - 0.25, h: dh.h, fontSize: dh.titleFontSize, bold: true, color: slidePal.white, fontFace: fontTitle, valign: "middle" });
    }

    initSlideHeader(currentSlide, pageCount);
    
    let curY = D.slide.bodyTopY;
    
    for (const item of section.items) {
      const height = itemH(item, bodyW, slidePal);
      
      if (curY + height > D.slide.bodyBottomY + 0.15) {
        if (verbose) {
          console.log(`  💡 "${section.title}": 영역 초과로 슬라이드 분할 (curY=${curY.toFixed(2)}, height=${height.toFixed(2)}, max=${D.slide.bodyBottomY})`);
        }
        pageCount++;
        currentSlide = prs.addSlide();
        initSlideHeader(currentSlide, pageCount);
        curY = D.slide.bodyTopY;
      }
      
      curY += renderItem(currentSlide, item, mx, curY, bodyW, slidePal) + D.card.gap;
    }
  } finally {
    D = originalD;
  }
}

function renderDoneSlide(prs, fm, pal) {
  if (!fm.done?.title) return;
  const slide = prs.addSlide();
  const sw = D.slide.widthIn;
  const font = D.slide.font;
  const fontTitle = D.slide.fontTitle || font;
  slide.background = { color: pal.brandDeep || pal.brandDark };
  slide.addText(fm.done.title, { x: 1, y: 2.5, w: sw - 2, h: 0.8, fontSize: 36, bold: true, color: D.palette.white, fontFace: fontTitle, align: "center" });
  if (fm.done.subtitle) slide.addText(fm.done.subtitle, { x: 1.5, y: 3.5, w: sw - 3, h: 0.6, fontSize: 16, color: pal.mutedLight, fontFace: font, align: "center", wrap: true });
  if (fm.done.ctaLabel) slide.addText(fm.done.ctaLabel + " →", { x: (sw - 3) / 2, y: 4.3, w: 3, h: 0.5, fontSize: 14, bold: true, color: pal.brand, fontFace: fontTitle, align: "center" });
}

// ════════════════════════════════════════════════════════════════
//  11. 메인 변환 함수
// ════════════════════════════════════════════════════════════════

export async function convertMdToPptx(mdPath, opts = {}) {
  const { out, styleOverride, noCover, verbose } = opts;
  const originalD = JSON.parse(JSON.stringify(D));
  
  let fm, sections, styleKey, style;
  try {
    const data = buildSlideData(mdPath, styleOverride);
    fm = data.fm;
    sections = data.sections;
    styleKey = data.styleKey;
    style = data.style;
    
    // Style 오버라이드 지원 (styles.json 정의 우선 적용)
    if (style.pptxFont) D.slide.font = style.pptxFont;
    if (style.pptxFontTitle) D.slide.fontTitle = style.pptxFontTitle;
    if (style.pptxFontSubTitle) D.slide.fontSubTitle = style.pptxFontSubTitle;
    if (style.titleSize) D.card.titleSize = Number(style.titleSize);
    if (style.bodySize) D.card.bodySize = Number(style.bodySize);
    
    // Frontmatter 오버라이드 지원 (제목/본문/중간제목 폰트 세분화 - 최종 덮어쓰기)
    if (fm.fontFace) D.slide.font = fm.fontFace;
    if (fm.fontTitle) D.slide.fontTitle = fm.fontTitle;
    if (fm.fontSubTitle) D.slide.fontSubTitle = fm.fontSubTitle;
    if (fm.titleSize) D.card.titleSize = Number(fm.titleSize);
    if (fm.bodySize) D.card.bodySize = Number(fm.bodySize);
  } catch (err) {
    D = originalD;
    throw err;
  }

  const pal = makePalette(style);
  
  // Frontmatter 브랜드 메인 컬러 강제 오버라이드 지원
  if (fm.brandColor) {
    const customBrand = hexClean(fm.brandColor);
    if (customBrand) {
      pal.brand = customBrand;
      pal.brandDark = customBrand;
      pal.brandDeep = customBrand;
      pal.brandLight = "F0F7FF"; // Prevent 8-digit hex, use 6-digit pastel blue
    }
  }

  if (verbose) {
    console.log(`  📄 ${basename(mdPath)}  style: ${styleKey}`);
    sections.forEach(s => console.log(`     [${s.num}] "${s.title}"  items: ${s.items.map(i => i.type).join(", ")}`));
  }
  const prs = new pptxgen();
  if (D.slide.layout && D.slide.widthIn && D.slide.heightIn) {
    prs.defineLayout({
      name: D.slide.layout,
      width: Number(D.slide.widthIn),
      height: Number(D.slide.heightIn)
    });
  }
  prs.layout = D.slide.layout || "LAYOUT_16x9";
  
  try {
    if (!noCover) renderCover(prs, fm, pal);
    for (const section of sections) renderSectionSlide(prs, section, pal, verbose);
    renderDoneSlide(prs, fm, pal);
    const name = basename(mdPath, extname(mdPath));
    const outPath = out || join(D.output.dir, `${name}${D.output.suffix || ""}.pptx`);
    mkdirSync(dirname(resolve(outPath)), { recursive: true });
    await prs.writeFile({ fileName: outPath });
    console.log(`✅ ${basename(mdPath)} → ${outPath}  (섹션 ${sections.length}개)`);
    return outPath;
  } catch (err) {
    const name = basename(mdPath, extname(mdPath));
    const outPath = out || join(D.output.dir, `${name}${D.output.suffix || ""}.pptx`);
    if (err.code === "EBUSY" || err.code === "EPERM") {
      console.warn(`⚠️  PPTX 쓰기 실패 (${outPath}): 파일이 PowerPoint 등 다른 프로그램에서 열려 있어 잠겨 있습니다. 파일을 닫고 다시 시도해 주세요.`);
      return outPath;
    } else {
      console.error(`❌ PPTX 쓰기 실패 (${outPath}): ${err.message}`);
      throw err;
    }
  } finally {
    D = originalD;
  }
}

// ════════════════════════════════════════════════════════════════
//  12. CLI 진입점
// ════════════════════════════════════════════════════════════════

const isMain = process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isMain) {
  const args = parseCLI(process.argv.slice(2));

  if (!args.positional.length) {
    console.error([
      "사용법:",
      "  node scripts/md-to-pptx.mjs <input.md> [--out path.pptx] [--style key] [--no-cover] [--verbose]",
      "  node scripts/md-to-pptx.mjs --all \"mddata/*.md\"",
      "",
      `스타일 키: ${Object.keys(STYLES).filter(k => !k.startsWith("$")).join(" | ")}`,
    ].join("\n"));
    process.exit(1);
  }

  const convOpts = { out: args.out || null, styleOverride: args.style || null, noCover: !!args.noCover, verbose: !!args.verbose };

  if (args.all) {
    for (const pattern of args.positional) {
      const files = [];
      for await (const f of glob(pattern)) files.push(f);
      if (!files.length) { console.warn(`매칭 파일 없음: ${pattern}`); continue; }
      for (const f of files) await convertMdToPptx(resolve(f), { ...convOpts, out: null });
    }
  } else {
    for (const mdPath of args.positional) {
      await convertMdToPptx(resolve(mdPath), convOpts);
    }
  }
}
