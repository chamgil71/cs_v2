/**
 * feature-grid.mjs
 * 개념/기능 하이라이트 격자 카드 숏코드 (동적 높이 및 일관성 있는 폰트 스케일 적용)
 */

export const type = "feature-grid";

function getCardHeight(it, cardW, c, helpers) {
  let h = 0.12;
  if (it.tag) {
    h += 0.24;
  }
  h += 0.34;
  if (it.desc) {
    const descLines = helpers.estimateLines(it.desc, cardW - 0.24, c.bodySize - 1);
    h += descLines * 0.18 + 0.12;
  }
  return Math.max(1.5, h); // 최소 높이 1.5인치 보증
}

export function estimateHeight(item, w, D, helpers) {
  const g = D.grid;
  const c = D.card;
  
  const parsedCols = Number(helpers.parseArg(item.args, "cols", 0));
  const cols = parsedCols > 0 
    ? Math.min(item.items.length, parsedCols) 
    : Math.max(1, Math.min(item.items.length, Math.floor(w / g.featureCardMinW)));
    
  const cardW = (w - g.gap * (cols - 1)) / cols;
  
  let maxCardH = 1.5;
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
    : Math.max(1, Math.min(item.items.length, Math.floor(w / g.featureCardMinW)));
  const cardW = (w - (cols - 1) * g.gap) / cols;
  
  let maxCardH = 1.5;
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
    
    // 외곽 카드
    slide.addShape("roundRect", {
      x: cx, y: cy, w: cardW, h: maxCardH,
      rectRadius: r,
      fill: { color: pal.white },
      line: { color: pal.border, width: 0.75 }
    });
    
    // 카드 상단 컬러 바
    slide.addShape("rect", {
      x: cx, y: cy, w: cardW, h: 0.04,
      fill: { color: color },
      line: { width: 0 }
    });
    
    let ty = cy + 0.12;
    
    // 뱃지 (tag)
    if (it.tag) {
      const badgeW = 0.8;
      const badgeH = 0.2;
      slide.addShape("roundRect", {
        x: cx + 0.12, y: ty, w: badgeW, h: badgeH,
        rectRadius: 0.04,
        fill: { color: pal.brandLight },
        line: { width: 0 }
      });
      slide.addText(it.tag, {
        x: cx + 0.12, y: ty, w: badgeW, h: badgeH,
        fontSize: 7.5, bold: true, color: pal.brandDark,
        fontFace: font, align: "center", valign: "middle"
      });
      ty += 0.24;
    }
    
    // 타이틀 (아이콘 포함)
    const titleText = (it.icon && it.icon !== "•" ? it.icon + " " : "") + (it.title || "");
    slide.addText(titleText, {
      x: cx + 0.12, y: ty, w: cardW - 0.24, h: 0.3,
      fontSize: c.titleSize, bold: true, color: pal.text,
      fontFace: font, valign: "middle"
    });
    ty += 0.34;
    
    // 설명 (desc)
    if (it.desc) {
      slide.addText(it.desc, {
        x: cx + 0.12, y: ty, w: cardW - 0.24, h: maxCardH - (ty - cy) - 0.08,
        fontSize: c.bodySize - 1, color: pal.text2,
        fontFace: font, valign: "top", wrap: true
      });
    }
  });
  
  return Math.ceil(item.items.length / cols) * (maxCardH + g.gap);
}
