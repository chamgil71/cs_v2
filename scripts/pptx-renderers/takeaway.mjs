/**
 * takeaway.mjs
 * 핵심 요약 테이크어웨이 배너 숏코드
 */

export const type = ["takeaway-banner", "takeaway"];

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  return item.items.reduce((sum, it) => {
    const lines = helpers.estimateLines(it.desc || "", w - c.padX * 2 - 0.5, c.bodySize + 1);
    const titleH = it.title ? (c.titleSize / 72) * 1.7 + c.gap * 0.5 : 0;
    const descH = (c.bodySize + 1) / 72 * 1.7 * Math.max(1, lines);
    return sum + c.padY * 2 + titleH + descH + c.gap;
  }, 0);
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const r = D.slide.globalRadius || 0.08;
  
  let curY = y;
  
  for (const it of item.items) {
    const color = helpers.hexClean(it.color) || pal.brand;
    const lines = helpers.estimateLines(it.desc || "", w - c.padX * 2 - 0.5, c.bodySize + 1);
    
    const titleH = it.title ? (c.titleSize / 72) * 1.7 + c.gap * 0.5 : 0;
    const descH = (c.bodySize + 1) / 72 * 1.7 * Math.max(1, lines);
    const boxH = c.padY * 2 + titleH + descH;
    
    // 1. 배너 본체 사각형 (브랜드 컬러 테두리 및 매우 연한 브랜드 칼라 배경)
    slide.addShape("roundRect", {
      x, y: curY, w, h: boxH,
      rectRadius: r,
      fill: { color: color, transparency: 93 },
      line: { color: color, width: 1.5 }
    });
    
    let tx = x + c.padX;
    let tw = w - c.padX * 2;
    let textY = curY + c.padY;
    
    // 2. 좌측 대형 아이콘 (테이크어웨이 심볼)
    if (it.icon) {
      slide.addText(it.icon, {
        x: tx, y: textY, w: 0.4, h: boxH - c.padY * 2,
        fontSize: 20, valign: "middle"
      });
      tx += 0.48;
      tw -= 0.48;
    }
    
    // 3. 타이틀 렌더링
    if (it.title) {
      slide.addText(it.title, {
        x: tx, y: textY, w: tw, h: titleH,
        fontSize: c.titleSize + 1.5, bold: true, color: pal.brandDark,
        fontFace: font, valign: "top"
      });
      textY += titleH;
    }
    
    // 4. 설명 (desc) 렌더링
    if (it.desc) {
      slide.addText(it.desc, {
        x: tx, y: textY, w: tw, h: descH + 0.05,
        fontSize: c.bodySize + 1, color: pal.text,
        fontFace: font, valign: "top", wrap: true
      });
    }
    
    curY += boxH + c.gap;
  }
  
  return curY - y;
}
