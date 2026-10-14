/**
 * pptx-core/doc.mjs — MD 문서 → 섹션·카드·블록 데이터(머리말·`::: 블록`·마크다운 토큰)
 * MD → PPTX 공용 코어의 부분(fs/path 없음). CLI(md-to-pptx.mjs)와 브라우저(src/lib/pptx-browser.ts)가 같은 코어를 부른다.
 */
import matter from "gray-matter";
import { marked } from "marked";
import { parseSlideConfig } from "../shortcode-render.mjs";
import { shortcodeBlockRe, stripHeadingAttrs, resolveShortcode, markAltItems } from "../library-names.mjs";
import { parseShortcodeItems } from "./items.mjs";

export function stripMd(text) {
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

function parseContentParts(content) {
  const parts = [];
  const re = shortcodeBlockRe();   // 이름에 "." 허용(기능 이름) — library-names.mjs 단일 출처
  let lastIndex = 0;
  let match;
  while ((match = re.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ kind: "md", src: content.slice(lastIndex, match.index) });
    }
    const r = resolveShortcode(match[1], match[2] || "", "pptx");   // 기능 이름 + 정규화된 인수 → cs_v2 구현 ID
    parts.push({ kind: "shortcode", scType: r.type, args: r.args, rawBody: match[3], items: markAltItems(parseShortcodeItems(match[3])) });
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

// raw = md 원문(문자열) — 파일 읽기는 부르는 쪽(CLI·브라우저)이 한다
export function buildSlideData(rawMd, styles, styleOverride) {
  const raw = String(rawMd).replace(/\r\n/g, "\n");
  const { data: fm, content: rawContent } = matter(raw);
  const content = stripHeadingAttrs(rawContent);   // pptgen md v2 제목 속성 {master=…} 제거
  const styleKey = styleOverride || fm.style || "emerald";
  const style = styles[styleKey] || styles["emerald"];
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
        // 공용 파서 — `key: |` 여러 줄 값과 `\n` 리터럴 둘 다 줄바꿈 (pptgen 과 같은 규칙)
        currentSection.config = { ...(currentSection.config || {}), ...parseSlideConfig(part.rawBody) };
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
        // Use sequential sectionNum (not the heading number) to avoid numbering conflicts
        // when TOC sections (목차 = 1,2) and chapter sections (# 1., # 2., ...) collide.
        currentSection = { num: sectionNum, title: m ? m[2] : raw2, items: [] };
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
