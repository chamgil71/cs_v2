/**
 * columns.mjs
 * 다단 정보 카드 격자 숏코드 (가로 분할 안분 및 세로 높이 동적 확장 지원)
 */

export const type = ["columns-grid", "columns"];

function getCardHeight(it, cardW, c, helpers) {
  let h = 0.52; // 기본 상단 패딩 및 타이틀 영역 높이
  if (it.desc) {
    const descLines = helpers.estimateLines(it.desc, cardW - 0.24, c.bodySize - 1);
    h += descLines * 0.18 + 0.08;
  }
  const example = it.meta || it.note;
  if (example) {
    const metaLines = helpers.estimateLines(example, cardW - 0.32, c.bodySize - 3);
    h += metaLines * 0.15 + 0.25;
  }
  return Math.max(1.4, h); // 최소 높이는 1.4인치로 보증
}

export function estimateHeight(item, w, D, helpers) {
  const g = D.grid;
  const c = D.card;
  
  const parsedCols = Number(helpers.parseArg(item.args, "cols", 0));
  const cols = parsedCols > 0 
    ? Math.min(item.items.length, parsedCols) 
    : Math.max(1, Math.min(item.items.length, Math.floor(w / 2.4)));
    
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
    : Math.max(1, Math.min(item.items.length, Math.floor(w / 2.4)));
    
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
    
    const color = helpers.hexClean(it.color || pal.brand);
    
    // 외곽 카드 그리기
    slide.addShape("roundRect", {
      x: cx, y: cy, w: cardW, h: maxCardH,
      rectRadius: r,
      fill: { color: pal.white },
      line: { color: pal.border, width: 0.75 }
    });
    
    // 상단 컬러 바
    slide.addShape("rect", {
      x: cx, y: cy, w: cardW, h: 0.04,
      fill: { color: color },
      line: { width: 0 }
    });
    
    // 타이틀 (문법 또는 강조 키워드)
    slide.addShape("roundRect", {
      x: cx + 0.12, y: cy + 0.12, w: cardW - 0.24, h: 0.32,
      rectRadius: 0.06,
      fill: { color: color, transparency: 93 }
    });
    
    slide.addText(it.title || "", {
      x: cx + 0.12, y: cy + 0.12, w: cardW - 0.24, h: 0.32,
      fontSize: 9.5, bold: true, color: color,
      fontFace: font, align: "center", valign: "middle"
    });
    
    let blockY = cy + 0.52;
    
    // 설명 (desc) 렌더링
    if (it.desc) {
      const descLines = helpers.estimateLines(it.desc, cardW - 0.24, c.bodySize - 1);
      const descH = descLines * 0.18 + 0.05;
      slide.addText(it.desc, {
        x: cx + 0.12, y: blockY, w: cardW - 0.24, h: descH,
        fontSize: c.bodySize - 1, color: pal.text,
        fontFace: font, align: "center", valign: "top", wrap: true
      });
      blockY += descH + 0.08;
    }
    
    // 예제 / 추가 정보 (meta/note) 렌더링
    const example = it.meta || it.note;
    if (example) {
      const metaLines = helpers.estimateLines(example, cardW - 0.32, c.bodySize - 3);
      const mBoxH = Math.min(0.65, metaLines * 0.15 + 0.15);
      
      slide.addShape("roundRect", {
        x: cx + 0.12, y: blockY, w: cardW - 0.24, h: mBoxH,
        rectRadius: 0.04,
        fill: { color: color, transparency: 96 },
        line: { width: 0 }
      });
      slide.addText(example, {
        x: cx + 0.16, y: blockY, w: cardW - 0.32, h: mBoxH,
        fontSize: c.bodySize - 3, color: pal.muted || "8892B0",
        fontFace: font, align: "center", valign: "middle", wrap: true
      });
    }
  });
  
  return Math.ceil(item.items.length / cols) * (maxCardH + g.gap);
}
