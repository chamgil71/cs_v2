/**
 * faq-list.mjs
 * 질문/답변 아코디언 목록 숏코드
 */

export const type = ["faq-list", "faq-accordion"];

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  return item.items.reduce((sum, it) => {
    const lines = helpers.estimateLines(it.desc || "", w - c.padX * 2, c.bodySize);
    const qH = (c.titleSize / 72) * 1.7 + 0.1;
    const aH = (c.bodySize / 72) * 1.7 * Math.max(1, lines);
    return sum + qH + aH + c.gap * 0.5 + c.gap;
  }, 0);
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const r = D.slide.globalRadius || 0.08;
  
  let curY = y;
  
  item.items.forEach((it, idx) => {
    const color = helpers.hexClean(it.color) || pal.brand;
    const lines = helpers.estimateLines(it.desc || "", w - c.padX * 2, c.bodySize);
    
    const qH = (c.titleSize / 72) * 1.7 + 0.1;
    const aH = (c.bodySize / 72) * 1.7 * Math.max(1, lines);
    const rowH = qH + aH + c.gap * 0.5;
    
    const isEven = idx % 2 === 0;
    const rowBg = it.color ? { color: color, transparency: 92 } : (isEven ? { color: pal.brandLight } : { color: pal.white });
    
    // FAQ 행 카드 외곽선
    slide.addShape("roundRect", {
      x, y: curY, w, h: rowH,
      rectRadius: r,
      fill: rowBg,
      line: { color: it.color ? color : pal.border, width: 0.75 }
    });
    
    // 왼쪽 두꺼운 장식 세로 바 (Q의 상징성 부여)
    slide.addShape("rect", {
      x, y: curY, w: 0.06, h: rowH,
      fill: { color: color },
      line: { width: 0 }
    });
    
    // Q 질문 부분
    slide.addText("Q  " + (it.title || ""), {
      x: x + 0.15, y: curY + 0.06, w: w - 0.25, h: qH,
      fontSize: c.titleSize, bold: true, color: it.color ? color : pal.brandDark,
      fontFace: font, valign: "middle"
    });
    
    // A 답변 부분
    if (it.desc) {
      slide.addText("A  " + it.desc, {
        x: x + 0.15, y: curY + 0.06 + qH, w: w - 0.25, h: aH + 0.05,
        fontSize: c.bodySize, color: pal.text2,
        fontFace: font, valign: "top", wrap: true
      });
    }
    
    curY += rowH + c.gap * 0.5;
  });
  
  return curY - y;
}
