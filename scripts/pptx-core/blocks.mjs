/**
 * pptx-core/blocks.mjs — 마크다운 기본 블록(h3·h4·문단·목록·인용·코드·표·그림) 높이 추정·그리기
 * MD → PPTX 공용 코어의 부분(fs/path 없음). CLI(md-to-pptx.mjs)와 브라우저(src/lib/pptx-browser.ts)가 같은 코어를 부른다.
 * D = 이 변환 한 번의 디자인 설정(config/pptdesign.config.json 복사본 + 테마·머리말 덮어쓰기) — 부르는 쪽이 넘긴다.
 */
import { estimateLines } from "./util.mjs";

export function blockH(D, block, w) {
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

export function renderBlock(D, slide, block, x, y, w, pal) {
  const c = D.card;
  const font = D.slide.font;
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
    slide.addShape("rect", { x, y, w: c.quoteBarW, h, fill: { color: pal.brand }, line: { type: "none" } });
    slide.addShape("rect", { x: x + c.quoteBarW, y, w: w - c.quoteBarW, h, fill: { color: pal.brandLight }, line: { type: "none" } });
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
    } catch {
      slide.addShape("rect", { x, y, w, h, fill: { color: "F1F5F9" }, line: { color: pal.border, width: 0.75 } });
      slide.addText(`[이미지 표시 실패: ${block.alt || 'No Alt'} (${block.src})]`, { x, y, w, h, fontSize: D.system.imageErrorSize, align: "center", valign: "middle", color: pal.text2, fontFace: font });
    }
    return h + c.gap;
  }
  return 0;
}
