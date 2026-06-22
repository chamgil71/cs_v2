/**
 * summary-box.mjs
 * 하단 요약 박스 및 배지 칩 숏코드
 */

export const type = ["summary-box", "bottom-list"];

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  const bl = D.bottomList || { chipH: 0.28 };
  if (!item.items.length) return 0;
  
  const it = item.items[0];
  const points = helpers.splitMeta(it.meta);
  const bodyLines = it.desc ? helpers.estimateLines(it.desc, w - c.padX * 2, c.bodySize) : 0;
  
  const topH = Math.max(0.85, c.padY * 2 
    + (it.title ? (c.titleSize / 72) * 1.7 + c.gap : 0) 
    + (bodyLines > 0 ? (c.bodySize / 72) * 1.7 * bodyLines + c.gap : 0));
    
  if (points.length) {
    return topH + c.gap + bl.chipH + c.gap;
  }
  return topH + c.gap;
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const bl = D.bottomList || { chipH: 0.28, chipGap: 0.12, chipRadius: 0.05, fontSize: 8 };
  const font = D.slide.font;
  const r = D.slide.globalRadius || 0.08;
  
  if (!item.items.length) return 0;
  
  const it = item.items[0];
  const color = helpers.hexClean(it.color) || pal.brand;
  const points = helpers.splitMeta(it.meta);
  const bodyLines = it.desc ? helpers.estimateLines(it.desc, w - c.padX * 2, c.bodySize) : 0;
  
  const topH = Math.max(0.85, c.padY * 2 
    + (it.title ? (c.titleSize / 72) * 1.7 + c.gap : 0) 
    + (bodyLines > 0 ? (c.bodySize / 72) * 1.7 * bodyLines + c.gap : 0));
    
  // 1. 요약 박스 본체 그리기
  slide.addShape("roundRect", {
    x, y, w, h: topH,
    rectRadius: r,
    fill: it.color ? { color: color, transparency: 95 } : { color: pal.white },
    line: { color: it.color ? color : pal.border, width: 0.75 }
  });
  
  let curY = y + c.padY;
  
  // 2. 타이틀 렌더링
  if (it.title) {
    const th = (c.titleSize / 72) * 1.7;
    slide.addText(it.title, {
      x: x + c.padX, y: curY, w: w - c.padX * 2, h: th + 0.05,
      fontSize: c.titleSize, bold: true, color: it.color ? color : pal.brandDark,
      fontFace: font, valign: "top"
    });
    curY += th + c.gap;
  }
  
  // 3. 본문 텍스트 렌더링 (desc)
  if (it.desc) {
    const descH = Math.max(0.2, (c.bodySize / 72) * 1.7 * bodyLines);
    slide.addText(it.desc, {
      x: x + c.padX, y: curY, w: w - c.padX * 2, h: descH,
      fontSize: c.bodySize, color: pal.text2,
      fontFace: font, valign: "top", wrap: true
    });
  }
  
  // 4. 하단 칩 리스트 (meta) 가로 배열
  if (points.length) {
    const chipBY = y + topH + c.gap;
    const chipW = (w - (points.length - 1) * bl.chipGap) / points.length;
    
    points.forEach((pt, i) => {
      const cx = x + i * (chipW + bl.chipGap);
      
      slide.addShape("roundRect", {
        x: cx, y: chipBY, w: chipW, h: bl.chipH,
        rectRadius: bl.chipRadius,
        fill: it.color ? { color: color, transparency: 90 } : { color: pal.brandLight },
        line: { color: color, width: 0.75 }
      });
      
      slide.addText(pt, {
        x: cx + 0.08, y: chipBY, w: chipW - 0.16, h: bl.chipH,
        fontSize: bl.fontSize, bold: true, color: color,
        fontFace: font, align: "center", valign: "middle", wrap: true
      });
    });
    
    return topH + c.gap + bl.chipH + c.gap;
  }
  
  return topH + c.gap;
}
