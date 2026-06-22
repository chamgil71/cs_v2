/**
 * stat-grid.mjs
 * 지표 및 통계 하이라이트 격자 숏코드
 */

export const type = ["stat-grid", "stat-highlight", "summary-bar"];

export function estimateHeight(item, w, D, helpers) {
  const g = D.grid;
  const c = D.card;
  const cols = Math.max(1, Math.min(item.items.length, 4));
  const cardH = 1.25;
  return Math.ceil(item.items.length / cols) * (cardH + g.gap);
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const g = D.grid;
  const c = D.card;
  const font = D.slide.font;
  const fontTitle = D.slide.fontTitle || font;
  const fontSubTitle = D.slide.fontSubTitle || font;
  const r = D.slide.globalRadius || 0.08;
  
  const cols = Math.max(1, Math.min(item.items.length, 4));
  const cardW = (w - (cols - 1) * g.gap) / cols;
  const cardH = 1.25;
  
  item.items.forEach((it, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const cx = x + col * (cardW + g.gap);
    const cy = y + row * (cardH + g.gap);
    
    const color = helpers.hexClean(it.color) || pal.brand;
    
    slide.addShape("roundRect", {
      x: cx, y: cy, w: cardW, h: cardH,
      rectRadius: r,
      fill: { color: pal.white },
      line: { color: pal.border, width: 0.75 }
    });
    
    slide.addShape("rect", {
      x: cx, y: cy, w: cardW, h: 0.04,
      fill: { color: color },
      line: { width: 0 }
    });
    
    const val = it.icon || it.title || "0";
    slide.addText(val, {
      x: cx + 0.1, y: cy + 0.12, w: cardW - 0.2, h: 0.45,
      fontSize: 24, bold: true, color: color,
      fontFace: fontTitle, align: "center", valign: "middle"
    });
    
    if (it.icon && it.title) {
      slide.addText(it.title, {
        x: cx + 0.1, y: cy + 0.62, w: cardW - 0.2, h: 0.24,
        fontSize: c.bodySize - 1.5, bold: true, color: pal.text,
        fontFace: fontSubTitle, align: "center", valign: "top"
      });
    }
    
    if (it.desc) {
      slide.addText(it.desc, {
        x: cx + 0.1, y: cy + 0.88, w: cardW - 0.2, h: cardH - 0.94,
        fontSize: c.bodySize - 3.5, color: pal.muted || "8892B0",
        fontFace: font, align: "center", valign: "top", wrap: true
      });
    }
  });
  
  return Math.ceil(item.items.length / cols) * (cardH + g.gap);
}
