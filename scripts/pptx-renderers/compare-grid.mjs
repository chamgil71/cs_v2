/**
 * compare-grid.mjs
 * 비교 카드 격자 및 파트 배너 숏코드 (동적 높이 및 순차 텍스트 누적 배치 적용)
 */

export const type = ["compare-grid", "level-grid", "part-banner", "part-deck"];

function getCardHeight(it, cardW, c, helpers) {
  let h = c.padY * 2;
  h += 0.38; // 타이틀 영역
  if (it.desc) {
    const descLines = helpers.estimateLines(it.desc, cardW - 0.24, c.bodySize - 1);
    h += descLines * 0.18 + 0.08;
  }
  const activeNote = it.note || it.meta;
  if (activeNote) {
    const bullets = helpers.splitMeta(activeNote);
    h += bullets.length * 0.22 + 0.15;
  }
  return Math.max(1.4, h); // 최소 높이 1.4인치 보증
}

export function estimateHeight(item, w, D, helpers) {
  const g = D.grid;
  const c = D.card;
  
  const parsedCols = Number(helpers.parseArg(item.args, "cols", 0));
  const cols = parsedCols > 0 
    ? Math.min(item.items.length, parsedCols) 
    : Math.max(1, Math.min(item.items.length, Math.floor(w / 2.4)));
    
  const cardW = (w - (cols - 1) * g.gap) / cols;
  
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
  const cardW = (w - (cols - 1) * g.gap) / cols;
  
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
    const cardBg = it.color ? { color: color, transparency: 95 } : { color: pal.white };
    
    // 외곽 카드
    slide.addShape("roundRect", {
      x: cx, y: cy, w: cardW, h: maxCardH,
      rectRadius: r,
      fill: cardBg,
      line: { color: it.color ? color : pal.border, width: 0.75 }
    });
    
    // 상단 얇은 바
    slide.addShape("rect", {
      x: cx, y: cy, w: cardW, h: 0.04,
      fill: { color: color },
      line: { width: 0 }
    });
    
    let blockY = cy + c.padY;
    
    // 타이틀
    slide.addText(it.title || "", {
      x: cx + 0.12, y: blockY, w: cardW - 0.24, h: 0.3,
      fontSize: c.titleSize, bold: true, color: it.color ? color : pal.brandDark,
      fontFace: font, valign: "middle"
    });
    blockY += 0.36;
    
    // 설명 (desc)
    if (it.desc) {
      const descLines = helpers.estimateLines(it.desc, cardW - 0.24, c.bodySize - 1);
      const descH = descLines * 0.18 + 0.05;
      slide.addText(it.desc, {
        x: cx + 0.12, y: blockY, w: cardW - 0.24, h: descH,
        fontSize: c.bodySize - 1, color: pal.text2,
        fontFace: font, valign: "top", wrap: true
      });
      blockY += descH + 0.08;
    }
    
    // 하단 서브 노트 (note/meta) 리스트 렌더링
    const activeNote = it.note || it.meta;
    if (activeNote) {
      const bullets = helpers.splitMeta(activeNote);
      const mBoxH = bullets.length * 0.22 + 0.1;
      
      slide.addShape("roundRect", {
        x: cx + 0.12, y: blockY, w: cardW - 0.24, h: mBoxH,
        rectRadius: 0.05,
        fill: { color: color, transparency: 88 },
        line: { width: 0 }
      });
      
      let bulletY = blockY + 0.05;
      bullets.forEach(bullet => {
        slide.addText("• " + bullet, {
          x: cx + 0.16, y: bulletY, w: cardW - 0.32, h: 0.2,
          fontSize: c.bodySize - 2.5, bold: true, color: color,
          fontFace: font, valign: "middle"
        });
        bulletY += 0.22;
      });
    }
  });
  
  return Math.ceil(item.items.length / cols) * (maxCardH + g.gap);
}
