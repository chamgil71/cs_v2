/**
 * icon-grid.mjs
 * 아이콘 기반 격자 카드 및 배지 격자 숏코드 (텍스트 길이에 따른 동적 높이 확장 및 정렬 지원)
 */

export const type = ["icon-grid", "badge-grid", "checkpoint-grid"];

function getCardHeight(it, cardW, c, helpers) {
  let h = 0.55; // 아이콘(0.42) 및 타이틀 간격의 기본 높이
  if (it.title) {
    h += 0.28;
  }
  if (it.desc) {
    const descLines = helpers.estimateLines(it.desc, cardW - 0.24, c.bodySize - 1);
    h += descLines * 0.18 + 0.1;
  }
  return Math.max(1.4, h); // 최소 높이 1.4인치 보증
}

export function estimateHeight(item, w, D, helpers) {
  const g = D.grid;
  const c = D.card;
  
  const parsedCols = Number(helpers.parseArg(item.args, "cols", 0));
  const cols = parsedCols > 0 
    ? Math.min(item.items.length, parsedCols) 
    : Math.max(1, Math.min(item.items.length, Math.floor(w / g.iconCardMinW)));
    
  const cardW = (w - g.gap * (cols - 1)) / cols;
  
  let maxCardH = 1.4;
  item.items.forEach(it => {
    const h = getCardHeight(it, cardW, c, helpers);
    if (h > maxCardH) maxCardH = h;
  });
  
  const rows = Math.ceil(item.items.length / cols);
  return rows * (maxCardH + g.gap);
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const g = D.grid;
  const c = D.card;
  const font = D.slide.font;
  const r = D.slide.globalRadius || 0.08;
  
  const parsedCols = Number(helpers.parseArg(item.args, "cols", 0));
  const cols = parsedCols > 0 
    ? Math.min(item.items.length, parsedCols) 
    : Math.max(1, Math.min(item.items.length, Math.floor(w / g.iconCardMinW)));
    
  const cardW = (w - g.gap * (cols - 1)) / cols;
  
  let maxCardH = 1.4;
  item.items.forEach(it => {
    const h = getCardHeight(it, cardW, c, helpers);
    if (h > maxCardH) maxCardH = h;
  });
  
  item.items.forEach((it, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const cx = x + col * (cardW + g.gap);
    const cy = y + row * (maxCardH + g.gap);
    
    const color = helpers.hexClean(it.color);
    const hasColor = !!color;
    
    // 외곽 카드
    slide.addShape("roundRect", {
      x: cx, y: cy, w: cardW, h: maxCardH,
      rectRadius: r,
      fill: hasColor ? { color: color, transparency: 95 } : { color: pal.white },
      line: { color: color || pal.border, width: 0.75 }
    });
    
    // 색상이 있을 경우 상단 장식 미니 라인
    if (hasColor) {
      slide.addShape("rect", {
        x: cx, y: cy, w: cardW, h: 0.04,
        fill: { color: color },
        line: { width: 0 }
      });
    }
    
    let curY = cy + 0.1;
    
    // 아이콘 렌더링
    if (it.icon && it.icon !== "•") {
      slide.addText(it.icon, {
        x: cx + 0.1, y: curY, w: cardW - 0.2, h: 0.42,
        fontSize: 20, align: "center", valign: "middle"
      });
      curY += 0.45;
    }
    
    // 타이틀 렌더링
    slide.addText(it.title || "", {
      x: cx + 0.1, y: curY, w: cardW - 0.2, h: 0.28,
      fontSize: c.bodySize, bold: true, color: pal.text,
      fontFace: font, align: "center", valign: "middle"
    });
    curY += 0.32;
    
    // 설명 렌더링
    if (it.desc) {
      const remainH = maxCardH - (curY - cy) - 0.1;
      slide.addText(it.desc, {
        x: cx + 0.1, y: curY, w: cardW - 0.2, h: remainH,
        fontSize: c.bodySize - 1, color: pal.text2,
        fontFace: font, align: "center", valign: "top", wrap: true
      });
    }
  });
  
  return Math.ceil(item.items.length / cols) * (maxCardH + g.gap);
}
