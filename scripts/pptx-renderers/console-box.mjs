/**
 * console-box.mjs
 * 콘솔창 및 AI 프롬프트 예제 숏코드
 */

export const type = ["console-box", "prompt-example"];

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  return item.items.reduce((sum, it) => {
    const lines = helpers.estimateLines(it.desc || "", w - c.padX * 2, c.bodySize - 1);
    const titleH = (c.titleSize / 72) * 1.7;
    const descH = (c.bodySize - 1) / 72 * 1.7 * Math.max(1, lines);
    return sum + c.padY + titleH + c.gap * 0.5 + descH + c.padY + c.gap;
  }, 0);
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const mono = D.slide.fontMono || "Consolas";
  const r = D.slide.globalRadius || 0.08;
  
  let curY = y;
  
  for (const it of item.items) {
    const color = helpers.hexClean(it.color) || pal.brand;
    const lines = helpers.estimateLines(it.desc || "", w - c.padX * 2, c.bodySize - 1);
    
    const titleH = (c.titleSize / 72) * 1.7;
    const descH = (c.bodySize - 1) / 72 * 1.7 * Math.max(1, lines);
    const boxH = c.padY + titleH + c.gap * 0.5 + descH + c.padY;
    
    // 1. 외곽 사각형 카드 (검은색 톤 프롬프트 쉘)
    slide.addShape("roundRect", {
      x, y: curY, w, h: boxH,
      rectRadius: r,
      fill: { color: D.palette?.codeBg || "0D1117" },
      line: { color: color, width: 1.0 }
    });
    
    // 2. 상단 미니 브랜드 칼라 액센트 바
    slide.addShape("rect", {
      x, y: curY, w, h: 0.04,
      fill: { color: color },
      line: { width: 0 }
    });
    
    let textY = curY + c.padY;
    
    // 3. 타이틀 (예: ▶ 프롬프트)
    if (it.title) {
      slide.addText("▶ " + it.title, {
        x: x + c.padX, y: textY, w: w - c.padX * 2, h: titleH + 0.05,
        fontSize: c.titleSize, bold: true, color: D.palette?.codeText || "A8B2D8",
        fontFace: font, valign: "top"
      });
      textY += titleH + c.gap * 0.5;
    }
    
    // 4. 설명 (프롬프트 본문)
    if (it.desc) {
      slide.addText(it.desc, {
        x: x + c.padX, y: textY, w: w - c.padX * 2, h: descH + 0.05,
        fontSize: c.bodySize - 1, color: "CDD6F4",
        fontFace: mono, valign: "top", wrap: true
      });
    }
    
    curY += boxH + c.gap;
  }
  
  return curY - y;
}
