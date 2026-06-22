/**
 * compare-split.mjs
 * 2단 대조 및 Before/After 비교 카드 숏코드
 */

export const type = ["compare-split", "compare-2col", "compare-before-after", "compare-diff"];

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  const cc = D.compare2col || { colGap: 0.25 };
  
  if (item.items.length < 2) {
    return 1.4 + c.gap;
  }
  
  const colW = (w - cc.colGap) / 2;
  const lh = (c.bodySize / 72) * 1.7;
  
  const maxH = Math.max(1.3, ...item.items.slice(0, 2).map((it, idx) => {
    const isBeforeAfter = item.type === "compare-before-after" || item.type === "compare-diff";
    const defaultColor = isBeforeAfter ? (idx === 0 ? "#EF4444" : "#10B981") : null;
    const color = helpers.hexClean(it.color || defaultColor);
    
    // desc 전체 줄바꿈 포함한 추정 높이
    const descLines = it.desc ? helpers.estimateLines(it.desc, colW - c.padX * 2, c.bodySize) : 0;
    const descH = descLines > 0 ? lh * descLines + 0.05 : 0;
      
    // meta 불릿 리스트 개수
    const metaLines = helpers.splitMeta(it.meta).length;
    
    return c.padY
      + (c.titleSize / 72) * 1.7 + c.gap
      + (it.desc ? descH + c.gap : 0)
      + metaLines * (lh + 0.05)
      + (it.note ? 0.28 + 0.12 : 0)
      + c.padY;
  }));
  
  return maxH + c.gap;
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const cc = D.compare2col || { colGap: 0.25 };
  const font = D.slide.font;
  const fontSubTitle = D.slide.fontSubTitle || font;
  const r = D.slide.globalRadius || 0.08;
  
  if (item.items.length < 2) {
    return 0; 
  }
  
  const colW = (w - cc.colGap) / 2;
  const maxH = estimateHeight(item, w, D, helpers) - c.gap;
  const lh = (c.bodySize / 72) * 1.7;
  const noteH = 0.26;
  const isBeforeAfter = item.type === "compare-before-after" || item.type === "compare-diff";
  
  item.items.slice(0, 2).forEach((it, idx) => {
    const cx = x + idx * (colW + cc.colGap);
    const isLeft = idx === 0;
    
    const defaultColor = isBeforeAfter ? (isLeft ? "#EF4444" : "#10B981") : (isLeft ? pal.brand : pal.text2);
    const color = helpers.hexClean(it.color || defaultColor);
    const cardFill = { color: color, transparency: 94 };
    
    // 1. 카드 외곽 라운드 렉트 그리기
    slide.addShape("roundRect", {
      x: cx, y, w: colW, h: maxH,
      rectRadius: r,
      fill: cardFill,
      line: { color: color, width: 1.5 }
    });
    
    // 2. 카드 상단 컬러 라인
    slide.addShape("rect", {
      x: cx, y, w: colW, h: 0.05,
      fill: { color: color },
      line: { width: 0 }
    });
    
    let curY = y + c.padY;
    
    // 3. 타이틀 렌더링
    slide.addText(it.title || (isLeft ? "Before" : "After"), {
      x: cx + c.padX, y: curY, w: colW - c.padX * 2, h: (c.titleSize / 72) * 1.7 + 0.05,
      fontSize: c.titleSize + 1.5, bold: true, color: color,
      fontFace: fontSubTitle, valign: "top"
    });
    curY += (c.titleSize / 72) * 1.7 + c.gap;
    
    // 4. 설명문 (desc) 렌더링
    if (it.desc) {
      const descLines = helpers.estimateLines(it.desc, colW - c.padX * 2, c.bodySize);
      const descH = lh * descLines + 0.05;
      slide.addText(it.desc, {
        x: cx + c.padX, y: curY, w: colW - c.padX * 2, h: descH,
        fontSize: c.bodySize, color: pal.text,
        fontFace: font, valign: "top", wrap: true
      });
      curY += descH + c.gap * 0.5;
    }
    
    // 5. 불릿 피처 리스트 (meta) 렌더링
    const bullets = helpers.splitMeta(it.meta);
    bullets.forEach(bullet => {
      slide.addText("• " + bullet, {
        x: cx + c.padX, y: curY, w: colW - c.padX * 2, h: lh + 0.05,
        fontSize: c.bodySize - 0.5, color: pal.text,
        fontFace: font, valign: "top"
      });
      curY += lh + 0.05;
    });
    
    // 6. 하단 가격/비교 참고 노트 (note) 렌더링 (카드 하단 고정)
    if (it.note) {
      const noteText = it.note.split("\n").filter(Boolean).join(" · ");
      const noteY = y + maxH - c.padY - noteH;
      
      slide.addShape("roundRect", {
        x: cx + c.padX, y: noteY, w: colW - c.padX * 2, h: noteH,
        rectRadius: 0.06,
        fill: { color: color },
        line: { width: 0 }
      });
      
      slide.addText(noteText, {
        x: cx + c.padX, y: noteY, w: colW - c.padX * 2, h: noteH,
        fontSize: c.bodySize - 3, bold: true, color: pal.white,
        fontFace: font, align: "center", valign: "middle"
      });
    }
  });
  
  return maxH + c.gap;
}
