/**
 * tabs.mjs
 * 다중 탭 및 컨텐츠 블록 숏코드
 */

export const type = ["tabs", "os-tabs"];

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  return item.items.reduce((sum, it) => {
    const lines = helpers.estimateLines(it.desc || "", w - c.padX * 2, c.bodySize);
    const descH = (c.bodySize / 72) * 1.7 * lines;
    return sum + 0.35 + descH + 0.2 + c.gap;
  }, 0);
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const r = D.slide.globalRadius || 0.08;
  
  let curY = y;
  
  item.items.forEach((it, idx) => {
    const tabTitle = it.title || it.tag || `Tab ${idx + 1}`;
    const lines = helpers.estimateLines(it.desc || "", w - c.padX * 2, c.bodySize);
    const descH = (c.bodySize / 72) * 1.7 * lines;
    const totalH = 0.35 + descH + 0.2;
    
    // 1. 탭 상자 외곽 둥근 사각형
    slide.addShape("roundRect", {
      x, y: curY, w, h: totalH,
      rectRadius: r,
      fill: { color: pal.white },
      line: { color: pal.border, width: 0.75 }
    });
    
    // 2. 탭 상단 바 배경
    slide.addShape("rect", {
      x, y: curY, w, h: 0.35,
      fill: { color: pal.brandLight },
      line: { width: 0 }
    });
    
    // 탭 하단 브랜드 액센트 라인
    slide.addShape("rect", {
      x, y: curY + 0.31, w, h: 0.04,
      fill: { color: pal.brand },
      line: { width: 0 }
    });
    
    // 탭 라벨 텍스트
    slide.addText(tabTitle, {
      x: x + 0.15, y: curY, w: w - 0.3, h: 0.31,
      fontSize: 10, bold: true, color: pal.brandDark,
      fontFace: font, valign: "middle"
    });
    
    // 3. 본문 내용 텍스트 (desc)
    if (it.desc) {
      slide.addText(it.desc, {
        x: x + c.padX, y: curY + 0.45, w: w - c.padX * 2, h: descH,
        fontSize: c.bodySize, color: pal.text2,
        fontFace: font, valign: "top", wrap: true
      });
    }
    
    curY += totalH + c.gap;
  });
  
  return curY - y;
}
