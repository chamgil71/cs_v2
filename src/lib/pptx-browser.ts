// @ts-nocheck
/**
 * pptx-browser.ts
 * md-to-pptx.mjs의 브라우저 호환 포트 (Node.js fs/path 제거, 직접 다운로드)
 */

import './buffer-polyfill'; // 브라우저에서 gray-matter 가 쓰는 Buffer 전역 보강 (gray-matter import 보다 위)
import STYLES_RAW from '../../config/styles.json?raw';
import DESIGN_RAW from '../../config/pptdesign.config.json?raw';
import FONT_ALIASES_RAW from '../../config/font-aliases.json?raw';
import matter from 'gray-matter';
import { marked } from 'marked';
import pptxgen from 'pptxgenjs';
// @ts-ignore
import { pptxRegistry, helpers } from '../../scripts/pptx-renderers/registry.mjs';

// ────────────────────────────────────────────────────────────────
//  설정 로드 (JSONC → JSON)
// ────────────────────────────────────────────────────────────────

function parseJsonc(src: string) {
  return JSON.parse(src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, ''));
}

const STYLES = parseJsonc(STYLES_RAW);
const FONT_ALIASES = parseJsonc(FONT_ALIASES_RAW);
let D = parseJsonc(DESIGN_RAW);

// ────────────────────────────────────────────────────────────────
//  유틸
// ────────────────────────────────────────────────────────────────

function resolveFont(name) {
  if (!name) return name;
  return FONT_ALIASES[String(name).trim()] || name;
}

function resolveDFonts() {
  const s = D.slide;
  if (s.font)        s.font        = resolveFont(s.font);
  if (s.fontTitle)   s.fontTitle   = resolveFont(s.fontTitle);
  if (s.fontSubTitle)s.fontSubTitle= resolveFont(s.fontSubTitle);
  if (s.fontMono)    s.fontMono    = resolveFont(s.fontMono);
}
resolveDFonts();

function hexClean(hex) {
  if (!hex) return null;
  hex = (hex + '').replace(/^["']|["']$/g, '').replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  return hex.length >= 6 ? hex.slice(0, 6).toUpperCase() : null;
}

function stripMd(text) {
  return (text || '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractText(tok) {
  if (!tok) return '';
  if (typeof tok.text === 'string') return tok.text;
  if (Array.isArray(tok.tokens)) return tok.tokens.map(t => extractText(t)).join('');
  return tok.raw || '';
}

function estimateLines(text, widthInch, fontSize) {
  const charsPerLine = Math.max(8, Math.floor(widthInch * 68 / (fontSize * 0.55)));
  return Math.max(1, Math.ceil((text || '').length / charsPerLine));
}

function cleanValue(v) {
  return String(v ?? '').trim().replace(/^["']|["']$/g, '');
}

function splitMeta(meta) {
  if (!meta) return [];
  return String(meta).split(/[|\n]/).map(s => s.trim().replace(/^["']|["']$/g, '').trim()).filter(Boolean);
}

function standardizeItem(item) {
  const rawName = item.name || item.title || '';
  const iconMatch = rawName.match(/^([✀-➿]|[-]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[‑-⛿]|\uD83E[\uDD10-\uDDFF])\s*(.*)$/);
  return {
    icon:     item.icon || (iconMatch ? iconMatch[1] : '') || '',
    title:    item.title || (iconMatch ? iconMatch[2] : item.name) || item.col || '',
    desc:     String(item.desc || item.description || item.tagline || item.body || '').replace(/\\n/g, '\n'),
    tag:      item.tag || item.badge || '',
    color:    item.color || '',
    featured: String(item.featured || '').trim().toLowerCase() === 'true' ? 'true' : '',
    meta:     item.meta || item.features || item.items || item.points || item.tool || '',
    note:     String(item.note || '').replace(/\\n/g, '\n'),
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
    if (inLiteralBlock && line.startsWith('    ')) {
      const val = line.slice(4);
      const sep = currentKey === 'meta' ? ' | ' : '\n';
      const existing = current[currentKey];
      current[currentKey] = (!existing || existing === '|') ? val : existing + sep + val;
      continue;
    } else { inLiteralBlock = false; }
    const firstMatch = line.match(/^\s*-\s*([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (firstMatch) {
      currentKey = firstMatch[1];
      let val = cleanValue(firstMatch[2]);
      if (val === '|') { inLiteralBlock = true; current = { [currentKey]: '' }; }
      else { current = { [currentKey]: val }; }
      items.push(current); continue;
    }
    const nextMatch = line.match(/^\s+([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (nextMatch && current) {
      currentKey = nextMatch[1];
      let val = cleanValue(nextMatch[2]);
      if (val === '|') { inLiteralBlock = true; current[currentKey] = ''; }
      else { current[currentKey] = val; }
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
      if (val === '|') { inLiteralBlock = true; continue; }
      const existing = current[currentKey];
      const sep = currentKey === 'meta' ? ' | ' : '\n';
      current[currentKey] = (!existing || existing === '|') ? val : existing + sep + val;
    }
  }
  return items.map(standardizeItem);
}

// ────────────────────────────────────────────────────────────────
//  MD 파서
// ────────────────────────────────────────────────────────────────

function parseContentParts(content) {
  const parts = [];
  const re = /^:::\s*([A-Za-z0-9_-]+)(?:[ \t]+([^\r\n]+))?[ \t]*\r?\n([\s\S]*?)(?:\r?\n|^):::[ \t]*$/gm;
  let lastIndex = 0;
  let match;
  while ((match = re.exec(content)) !== null) {
    if (match.index > lastIndex) parts.push({ kind: 'md', src: content.slice(lastIndex, match.index) });
    parts.push({ kind: 'shortcode', scType: match[1], args: match[2] || '', rawBody: match[3], items: parseShortcodeItems(match[3]) });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) parts.push({ kind: 'md', src: content.slice(lastIndex) });
  return parts;
}

function tokenToBlock(tok) {
  switch (tok.type) {
    case 'paragraph': {
      if (tok.tokens?.length === 1 && tok.tokens[0].type === 'image') {
        const img = tok.tokens[0];
        return { type: 'image', src: img.href, alt: img.text };
      }
      return { type: 'p', text: stripMd(extractText(tok)) };
    }
    case 'heading':
      if (tok.depth === 3) return { type: 'h3', text: stripMd(extractText(tok)) };
      if (tok.depth === 4) return { type: 'h4', text: stripMd(extractText(tok)) };
      return null;
    case 'list':
      return { type: tok.ordered ? 'ol' : 'ul', items: tok.items.map(item => stripMd(item.text || extractText(item))) };
    case 'blockquote':
      return { type: 'blockquote', text: stripMd((tok.tokens || []).map(t2 => extractText(t2)).join(' ')) };
    case 'code':
      return { type: 'code', lang: tok.lang || '', text: tok.text || '' };
    case 'table':
      return { type: 'table', headers: tok.header.map(h => stripMd(extractText(h))), rows: tok.rows.map(row => row.map(cell => stripMd(extractText(cell)))) };
    default: return null;
  }
}

function buildSlideDataFromContent(mdContent, styleOverride) {
  const raw = mdContent.replace(/\r\n/g, '\n');
  const { data: fm, content } = matter(raw);
  const styleKey = styleOverride || fm.style || 'ai-chat';
  const style = STYLES[styleKey] || STYLES['ai-chat'];
  const parts = parseContentParts(content);
  const sections = [];
  let currentSection = null;
  let currentCard = null;
  let sectionNum = 0;

  function closeCard() {
    if (currentCard) {
      if ((currentCard.title?.trim()) || currentCard.blocks?.length > 0) {
        if (currentSection) currentSection.items.push(currentCard);
      }
      currentCard = null;
    }
  }
  function closeSection() {
    closeCard();
    if (currentSection) {
      if (currentSection.items?.length > 0 || currentSection.title?.trim() || currentSection.config) {
        sections.push(currentSection);
      }
    }
    currentSection = null;
  }

  for (const part of parts) {
    if (part.kind === 'shortcode') {
      if (!currentSection) { sectionNum++; currentSection = { num: sectionNum, title: '', items: [] }; }
      closeCard();
      if (part.scType === 'slide-config') {
        currentSection.config = currentSection.config || {};
        for (const line of (part.rawBody || '').split(/\r?\n/)) {
          const m = line.match(/^\s*(?:-\s*)?([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
          if (m) currentSection.config[m[1].trim()] = cleanValue(m[2]);
        }
      } else {
        currentSection.items.push({ type: part.scType, args: part.args || '', items: part.items });
      }
      continue;
    }
    const tokens = marked.lexer(part.src);
    for (const tok of tokens) {
      if (tok.type === 'heading' && tok.depth === 1) {
        closeSection(); sectionNum++;
        const raw2 = stripMd(extractText(tok));
        const m = raw2.match(/^\s*(\d+)\.\s*(.+)$/);
        currentSection = { num: sectionNum, title: m ? m[2] : raw2, items: [] };
      } else if (tok.type === 'heading' && tok.depth === 2) {
        closeCard();
        const h2Title = stripMd(extractText(tok));
        if (!currentSection) { sectionNum++; currentSection = { num: sectionNum, title: h2Title, items: [] }; }
        else if (!currentSection.title) currentSection.title = h2Title;
        currentCard = { type: 'card', title: h2Title, blocks: [] };
      } else if (tok.type === 'hr') {
        closeSection();
      } else if (tok.type === 'space') {
        // ignore
      } else {
        if (!currentSection) { sectionNum++; currentSection = { num: sectionNum, title: '', items: [] }; }
        if (!currentCard) currentCard = { type: 'card', title: '', blocks: [] };
        const block = tokenToBlock(tok);
        if (block) currentCard.blocks.push(block);
      }
    }
  }
  closeSection();
  return { fm, sections, styleKey, style };
}

// ────────────────────────────────────────────────────────────────
//  높이 추정
// ────────────────────────────────────────────────────────────────

function blockH(block, w) {
  const c = D.card;
  switch (block.type) {
    case 'image': return 2.5 + c.gap;
    case 'h3': return (c.h3Size / 72) * 1.7 + c.gap;
    case 'h4': return ((c.h3Size - 1) / 72) * 1.7 + c.gap;
    case 'p': return (c.bodySize / 72) * 1.7 * estimateLines(block.text, w - c.padX * 2, c.bodySize) + c.gap;
    case 'ul': case 'ol': return (c.bodySize / 72) * 1.7 * block.items.length + c.gap;
    case 'blockquote': return Math.max(0.4, (c.bodySize / 72) * 1.7 * estimateLines(block.text, w - c.padX * 2 - c.quoteBarW - 0.1, c.bodySize) + 0.15) + c.gap;
    case 'code': return (c.codeSize / 72) * 1.7 * (block.text || '').split('\n').length + 0.2 + c.gap;
    case 'table': return 0.35 + 0.28 * (block.rows || []).length + c.gap;
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
  if (item.type === 'card') return cardH(item, w);
  const renderer = pptxRegistry.get(item.type);
  if (renderer) {
    try {
      const bh = { ...helpers, hexClean(hex) { return helpers.hexClean(hex, pal); } };
      return renderer.estimateHeight(item, w, D, bh);
    } catch { return 1.0; }
  }
  return 0;
}

// ────────────────────────────────────────────────────────────────
//  팔레트
// ────────────────────────────────────────────────────────────────

function makePalette(style) {
  const p = D.palette;
  return {
    brand:      hexClean(style.brand)      || '6366F1',
    brandDark:  hexClean(style.brandDark)  || '4338CA',
    brandDeep:  hexClean(style.brandDeep)  || '3730A3',
    brandLight: hexClean(style.brandLight) || 'EEF2FF',
    border:     hexClean(style.border)     || 'D8DCFB',
    bgDark:     p.bgDark,
    white:      p.white,
    text:       p.text,
    text2:      p.text2,
    muted:      p.muted      || '8892B0',
    mutedLight: p.mutedLight || 'CCDDDD',
    codeBg:     p.codeBg,
    codeText:   p.codeText   || 'A8B2D8',
  };
}

// ────────────────────────────────────────────────────────────────
//  블록 렌더러
// ────────────────────────────────────────────────────────────────

function renderBlock(slide, block, x, y, w, pal) {
  const c = D.card;
  const font = D.slide.font;
  const fontSubTitle = D.slide.fontSubTitle || font;
  const mono = D.slide.fontMono;

  if (block.type === 'h3') {
    const h = (c.h3Size / 72) * 1.7;
    slide.addText(block.text, { x, y, w, h: h + 0.05, fontSize: c.h3Size, bold: true, color: pal.text, fontFace: fontSubTitle, valign: 'top' });
    return h + c.gap;
  }
  if (block.type === 'h4') {
    const fs = c.h3Size - 1;
    const h = (fs / 72) * 1.7;
    slide.addText(block.text, { x, y, w, h: h + 0.05, fontSize: fs, bold: true, color: pal.text2, fontFace: fontSubTitle, valign: 'top' });
    return h + c.gap;
  }
  if (block.type === 'p') {
    const lines = estimateLines(block.text, w, c.bodySize);
    const h = Math.max(0.2, (c.bodySize / 72) * 1.7 * lines);
    slide.addText(block.text, { x, y, w, h, fontSize: c.bodySize, color: pal.text2, fontFace: font, valign: 'top', wrap: true });
    return h + c.gap;
  }
  if (block.type === 'ul' || block.type === 'ol') {
    const lineH = (c.bodySize / 72) * 1.7;
    const h = Math.max(0.2, lineH * block.items.length);
    slide.addText(block.items.map((item, i) => ({ text: (block.type === 'ol' ? `${i + 1}. ` : '• ') + item + '\n', options: { fontSize: c.bodySize, color: pal.text2, fontFace: font } })), { x, y, w, h, valign: 'top' });
    return h + c.gap;
  }
  if (block.type === 'blockquote') {
    const lines = estimateLines(block.text, w - c.quoteBarW - 0.12, c.bodySize);
    const h = Math.max(0.38, (c.bodySize / 72) * 1.7 * lines + 0.15);
    slide.addShape('rect', { x, y, w: c.quoteBarW, h, fill: { color: pal.brand }, line: { width: 0 } });
    slide.addShape('rect', { x: x + c.quoteBarW, y, w: w - c.quoteBarW, h, fill: { color: pal.brandLight }, line: { width: 0 } });
    slide.addText(block.text, { x: x + c.quoteBarW + 0.1, y: y + 0.06, w: w - c.quoteBarW - 0.14, h: h - 0.1, fontSize: c.bodySize, color: pal.brandDeep || pal.brandDark, fontFace: font, italic: true, valign: 'middle', wrap: true });
    return h + c.gap;
  }
  if (block.type === 'code') {
    const codeLines = (block.text || '').split('\n');
    const h = Math.max(0.4, (c.codeSize / 72) * 1.7 * codeLines.length + 0.2);
    slide.addShape('rect', { x, y, w, h, fill: { color: pal.codeBg || '0F172A' }, line: { color: pal.border, width: 0.75 } });
    slide.addText(block.text, { x: x + 0.12, y: y + 0.08, w: w - 0.24, h: h - 0.1, fontSize: c.codeSize, color: pal.codeText, fontFace: mono, valign: 'top', wrap: true });
    return h + c.gap;
  }
  if (block.type === 'table') {
    const headerH = 0.35, rowH = 0.28;
    const totalH = headerH + rowH * (block.rows || []).length;
    const colW = w / Math.max(1, block.headers.length);
    const tableData = [
      block.headers.map(h2 => ({ text: h2, options: { bold: true, fontSize: c.bodySize, color: pal.white, fill: { color: pal.brand }, align: 'center', valign: 'middle' } })),
      ...(block.rows || []).map((row, rIdx) => row.map(cell => {
        const isCheck = cell === '√' || cell === '✓' || cell === '✅';
        return { text: cell, options: { fontSize: c.bodySize - 1, color: isCheck ? pal.brand : pal.text2, bold: isCheck, fill: rIdx % 2 === 1 ? { color: 'FAFAFA' } : undefined, align: 'center', valign: 'middle' } };
      })),
    ];
    slide.addTable(tableData, { x, y, w, colW: block.headers.map(() => colW), rowH: [headerH, ...(block.rows || []).map(() => rowH)], border: { color: pal.border, size: 0.75 }, fontFace: font });
    return totalH + c.gap;
  }
  if (block.type === 'image') {
    const h = 2.5;
    try {
      slide.addImage({ path: block.src, x, y, w, h, altText: block.alt || 'image' });
    } catch {
      slide.addShape('rect', { x, y, w, h, fill: { color: 'F1F5F9' }, line: { color: pal.border, width: 0.75 } });
      slide.addText(`[이미지: ${block.alt || block.src}]`, { x, y, w, h, fontSize: 10, align: 'center', valign: 'middle', color: pal.text2, fontFace: font });
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
  slide.addShape('roundRect', { x, y, w, h, rectRadius: r, fill: { color: pal.white }, line: { color: pal.border, width: 0.75 } });
  let cy = y + c.padY;
  if (card.title) {
    const th = (c.titleSize / 72) * 1.7;
    slide.addText(card.title, { x: x + c.padX, y: cy, w: w - c.padX * 2, h: th + 0.05, fontSize: c.titleSize, bold: true, color: pal.brandDark, fontFace: fontSubTitle, valign: 'top' });
    cy += th + 0.05 + c.gap * 0.5;
  }
  for (const block of (card.blocks || [])) cy += renderBlock(slide, block, x + c.padX, cy, w - c.padX * 2, pal);
  return h;
}

function renderItem(slide, item, x, y, w, pal) {
  if (item.type === 'card') return renderCard(slide, item, x, y, w, pal);
  const renderer = pptxRegistry.get(item.type);
  if (renderer) {
    try {
      const bh = { ...helpers, hexClean(hex) { return helpers.hexClean(hex, pal); } };
      return renderer.render(slide, item, x, y, w, pal, D, bh);
    } catch (err) {
      console.error(`숏코드 렌더링 실패 (${item.type}):`, err);
      slide.addShape('roundRect', { x, y, w, h: 0.5, fill: { color: 'FFF1F2' }, line: { color: 'EF4444', width: 1.0 } });
      slide.addText(`[렌더링 에러: ${item.type}]`, { x: x + 0.1, y, w: w - 0.2, h: 0.5, fontSize: 9.5, color: 'B91C1C', valign: 'middle' });
      return 0.5;
    }
  }
  return 0;
}

// ────────────────────────────────────────────────────────────────
//  슬라이드 렌더러
// ────────────────────────────────────────────────────────────────

function renderCover(prs, fm, pal) {
  const slide = prs.addSlide();
  const dc = D.cover;
  const sw = D.slide.widthIn;
  const sh = D.slide.heightIn || 7.5;
  const font = D.slide.font;
  const fontTitle = D.slide.fontTitle || font;

  const customBg = hexClean(fm.coverBg);
  const customAccent = hexClean(fm.coverAccent);
  const customTextColor = hexClean(fm.coverTextColor);
  const layout = String(fm.coverLayout || 'accent-bar').trim().toLowerCase();

  const bg = customBg || pal.bgDark;
  const accent = customAccent || pal.brand;
  const textClr = customTextColor || pal.white;

  const sanitizeTitle = (t) => {
    let clean = String(t ?? '').trim();
    if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) clean = clean.slice(1, -1);
    return clean.trim();
  };

  const titleText = sanitizeTitle(fm.title || 'Guide Title');
  const titleLines = titleText ? titleText.split(/\r?\n/).length : 1;

  slide.background = { color: bg };

  if (layout === 'full-brand') {
    slide.background = { color: pal.brand };
    slide.addShape('rect', { x: 0, y: sh - 0.12, w: sw, h: 0.12, fill: { color: pal.white }, line: { width: 0 } });
    let ty = dc.titleY - 0.2;
    if (fm.logo) slide.addText(fm.logo, { x: 1.0, y: ty - 0.85, w: 1.0, h: 0.75, fontSize: dc.logoFontSize + 4, align: 'left', valign: 'middle' });
    const titleH = 1.3 + (titleLines - 1) * 0.7;
    slide.addText(titleText, { x: 1.0, y: ty, w: sw - 2.0, h: titleH, fontSize: dc.titleFontSize + 2, bold: true, color: pal.white, fontFace: fontTitle, valign: 'top' });
    ty += titleH + 0.05;
    if (fm.subtitle) slide.addText(fm.subtitle, { x: 1.0, y: ty, w: sw - 2.0, h: 0.45, fontSize: dc.subtitleFontSize + 1, color: pal.brandLight, fontFace: font });
  } else if (layout === 'minimal-dark') {
    let ty = dc.titleY;
    if (fm.logo) slide.addText(fm.logo, { x: 1.0, y: ty - 0.85, w: 1.0, h: 0.75, fontSize: dc.logoFontSize, align: 'left', valign: 'middle' });
    const titleH = 1.2 + (titleLines - 1) * 0.7;
    slide.addText(titleText, { x: 1.0, y: ty, w: sw - 2.0, h: titleH, fontSize: dc.titleFontSize, bold: true, color: textClr, fontFace: fontTitle, valign: 'top' });
    ty += titleH;
    if (fm.subtitle) slide.addText(fm.subtitle, { x: 1.0, y: ty, w: sw - 2.0, h: 0.4, fontSize: dc.subtitleFontSize, color: pal.muted, fontFace: font });
  } else {
    slide.addShape('rect', { x: dc.accentBarX, y: dc.accentBarY, w: dc.accentBarW, h: dc.accentBarH, fill: { color: accent }, line: { width: 0 } });
    let ty = dc.titleY;
    if (fm.logo) slide.addText(fm.logo, { x: dc.titleX, y: ty - 0.85, w: 0.85, h: 0.75, fontSize: dc.logoFontSize, align: 'left', valign: 'middle' });
    const titleH = 1.2 + (titleLines - 1) * 0.7;
    slide.addText(titleText, { x: dc.titleX, y: ty, w: sw - dc.titleX - 0.5, h: titleH, fontSize: dc.titleFontSize, bold: true, color: textClr, fontFace: fontTitle, valign: 'top' });
    ty += titleH;
    if (fm.subtitle) slide.addText(fm.subtitle, { x: dc.titleX, y: ty, w: sw - dc.titleX - 0.5, h: 0.4, fontSize: dc.subtitleFontSize, color: pal.muted, fontFace: font });
  }

  if (fm.stats?.length) {
    const statsY = sh - 1.8, statW = 1.6;
    fm.stats.forEach((stat, i) => {
      const sx = (layout === 'accent-bar' ? dc.titleX : 1.0) + i * (statW + 0.3);
      slide.addText(stat.value || '', { x: sx, y: statsY, w: statW, h: 0.38, fontSize: 19, bold: true, color: accent, fontFace: fontTitle });
      slide.addText(stat.label || '', { x: sx, y: statsY + 0.38, w: statW, h: 0.24, fontSize: 9.5, color: pal.muted, fontFace: font });
    });
  }
}

function renderSectionSlide(prs, section, pal, verbose = false) {
  const originalD = JSON.parse(JSON.stringify(D));
  if (section.config) {
    if (section.config.titleSize) D.card.titleSize = Number(section.config.titleSize);
    if (section.config.bodySize)  D.card.bodySize  = Number(section.config.bodySize);
  }
  try {
    const dh = D.header;
    const sw = D.slide.widthIn;
    const mx = D.slide.marginX;
    const font = D.slide.font;
    const fontTitle = D.slide.fontTitle || font;
    const bodyW = sw - mx * 2;
    const slidePal = { ...pal };
    const slideBg = (section.config?.bg) || D.palette.white;
    if (section.config?.bg) { const cb = hexClean(section.config.bg); if (cb) slidePal.white = cb; }
    if (section.config?.color) { const cc = hexClean(section.config.color); if (cc) { slidePal.text = cc; slidePal.text2 = cc; } }

    let currentSlide = prs.addSlide();
    let pageCount = 1;

    function initSlideHeader(slide, pageNum) {
      slide.background = { color: hexClean(slideBg) || 'FFFFFF' };
      slide.addShape('rect', { x: 0, y: dh.y, w: sw, h: dh.h, fill: { color: slidePal.bgDark }, line: { width: 0 } });
      const nbs = dh.numBoxSize, nby = dh.y + (dh.h - nbs) / 2;
      slide.addShape('roundRect', { x: dh.paddingX, y: nby, w: nbs, h: nbs, rectRadius: 0.1, fill: { color: slidePal.brand }, line: { width: 0 } });
      slide.addText(String(section.num), { x: dh.paddingX, y: nby, w: nbs, h: nbs, fontSize: dh.numFontSize, bold: true, color: slidePal.white, fontFace: fontTitle, align: 'center', valign: 'middle' });
      slide.addText(section.title + (pageNum > 1 ? ' (계속)' : ''), { x: dh.paddingX + nbs + 0.15, y: dh.y, w: sw - dh.paddingX - nbs - 0.25, h: dh.h, fontSize: dh.titleFontSize, bold: true, color: slidePal.white, fontFace: fontTitle, valign: 'middle' });
    }

    initSlideHeader(currentSlide, pageCount);
    let curY = D.slide.bodyTopY;

    for (const item of section.items) {
      const height = itemH(item, bodyW, slidePal);
      if (curY + height > D.slide.bodyBottomY + 0.15) {
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
  slide.addText(fm.done.title, { x: 1, y: 2.5, w: sw - 2, h: 0.8, fontSize: 36, bold: true, color: D.palette.white, fontFace: fontTitle, align: 'center' });
  if (fm.done.subtitle) slide.addText(fm.done.subtitle, { x: 1.5, y: 3.5, w: sw - 3, h: 0.6, fontSize: 16, color: pal.mutedLight, fontFace: font, align: 'center', wrap: true });
  if (fm.done.ctaLabel) slide.addText(fm.done.ctaLabel + ' →', { x: (sw - 3) / 2, y: 4.3, w: 3, h: 0.5, fontSize: 14, bold: true, color: pal.brand, fontFace: fontTitle, align: 'center' });
}

// ────────────────────────────────────────────────────────────────
//  메인 변환 함수 (브라우저 — 자동 다운로드)
// ────────────────────────────────────────────────────────────────

export async function convertMdToPptxBrowser(
  mdContent: string,
  fileName: string,
  opts: { styleOverride?: string; noCover?: boolean } = {}
): Promise<void> {
  const { styleOverride, noCover = false } = opts;
  const originalD = JSON.parse(JSON.stringify(D));

  let fm, sections, styleKey, style;
  try {
    const data = buildSlideDataFromContent(mdContent, styleOverride || undefined);
    fm = data.fm; sections = data.sections; styleKey = data.styleKey; style = data.style;

    if (style.pptxFont)         D.slide.font        = resolveFont(style.pptxFont);
    if (style.pptxFontTitle)    D.slide.fontTitle   = resolveFont(style.pptxFontTitle);
    if (style.pptxFontSubTitle) D.slide.fontSubTitle= resolveFont(style.pptxFontSubTitle);
    if (style.titleSize) D.card.titleSize = Number(style.titleSize);
    if (style.bodySize)  D.card.bodySize  = Number(style.bodySize);

    if (fm.fontFace)    D.slide.font        = resolveFont(fm.fontFace);
    if (fm.fontTitle)   D.slide.fontTitle   = resolveFont(fm.fontTitle);
    if (fm.fontSubTitle)D.slide.fontSubTitle= resolveFont(fm.fontSubTitle);
    if (fm.titleSize) D.card.titleSize = Number(fm.titleSize);
    if (fm.bodySize)  D.card.bodySize  = Number(fm.bodySize);
  } catch (err) {
    D = originalD;
    throw err;
  }

  const pal = makePalette(style);
  if (fm.brandColor) {
    const cb = hexClean(fm.brandColor);
    if (cb) { pal.brand = cb; pal.brandDark = cb; pal.brandDeep = cb; pal.brandLight = 'F0F7FF'; }
  }

  const prs = new pptxgen();
  if (D.slide.layout && D.slide.widthIn && D.slide.heightIn) {
    prs.defineLayout({ name: D.slide.layout, width: Number(D.slide.widthIn), height: Number(D.slide.heightIn) });
  }
  prs.layout = D.slide.layout || 'LAYOUT_16x9';

  try {
    if (!noCover) renderCover(prs, fm, pal);
    for (const section of sections) renderSectionSlide(prs, section, pal);
    renderDoneSlide(prs, fm, pal);
    // 브라우저에서 pptxgenjs writeFile은 자동으로 download를 트리거한다
    await prs.writeFile({ fileName });
  } finally {
    D = originalD;
  }
}
