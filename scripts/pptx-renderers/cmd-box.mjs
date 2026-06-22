/**
 * cmd-box.mjs
 * 터미널 명령어 및 스크립트 코드 블록 숏코드
 */

export const type = ["cmd-box", "command-block"];

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  return item.items.reduce((sum, it) => {
    const codeLines = (it.desc || "").split("\n");
    const codeH = Math.max(0.4, (c.codeSize / 72) * 1.7 * codeLines.length + 0.2);
    // 코드 블록 높이 + 헤더 바 높이 0.38
    return sum + codeH + 0.38 + c.gap;
  }, 0);
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const mono = D.slide.fontMono || "Consolas";
  const r = D.slide.globalRadius || 0.08;
  
  let curY = y;
  
  for (const it of item.items) {
    const label = it.title || it.tag || "Terminal";
    const lang = it.meta || "bash";
    const codeLines = (it.desc || "").split("\n");
    
    const codeH = Math.max(0.4, (c.codeSize / 72) * 1.7 * codeLines.length + 0.2);
    const totalH = codeH + 0.38;
    
    // 1. 명령어 상자 외곽선 및 검은 배경
    slide.addShape("roundRect", {
      x, y: curY, w, h: totalH,
      rectRadius: r,
      fill: { color: "0F172A" },
      line: { color: pal.border, width: 0.75 }
    });
    
    // 2. 터미널 헤더 바
    const headerH = 0.35;
    slide.addShape("rect", {
      x, y: curY, w, h: headerH,
      fill: { color: "1E293B" },
      line: { width: 0 }
    });
    
    // 헤더 장식 바 하단 둥글기 깎기
    slide.addShape("rect", {
      x, y: curY + headerH - 0.08, w, h: 0.08,
      fill: { color: "1E293B" },
      line: { width: 0 }
    });
    
    // 헤더 라벨 텍스트 (예: Terminal)
    slide.addText(label, {
      x: x + 0.15, y: curY, w: w * 0.7, h: headerH,
      fontSize: 9, bold: true, color: pal.muted || "8892B0",
      fontFace: mono, valign: "middle"
    });
    
    // 언어 정보 텍스트 (예: bash)
    slide.addText(lang, {
      x: x + w - 1.2, y: curY, w: 1.0, h: headerH,
      fontSize: 9, color: pal.brand,
      fontFace: mono, align: "right", valign: "middle"
    });
    
    // 3. 명령어 텍스트 출력
    slide.addText(it.desc || "", {
      x: x + 0.15, y: curY + 0.38, w: w - 0.3, h: codeH - 0.05,
      fontSize: c.codeSize, color: pal.codeText || "CDD5E1",
      fontFace: mono, valign: "top", wrap: true
    });
    
    curY += totalH + c.gap;
  }
  
  return curY - y;
}
