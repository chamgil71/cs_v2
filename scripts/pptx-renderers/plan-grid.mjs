/**
 * plan-grid.mjs
 * 요금제 및 티어 비교 카드 숏코드
 */

export const type = "plan-grid";

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  const pg = D.planGrid || { maxCols: 4, featureLineH: 0.22 };
  const maxFeat = Math.max(0, ...item.items.map(it => helpers.splitMeta(it.meta).length));
  return c.padY * 2 + 0.28 + 0.35 + maxFeat * pg.featureLineH + 0.32 + c.gap;
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const g = D.grid;
  const c = D.card;
  const pg = D.planGrid || { maxCols: 4, featureLineH: 0.22 };
  const font = D.slide.font;
  const fontSubTitle = D.slide.fontSubTitle || font;
  const r = D.slide.globalRadius || 0.08;
  
  const cols = Math.max(1, Math.min(item.items.length, pg.maxCols || 4));
  const cardW = (w - (cols - 1) * g.gap) / cols;
  const maxFeat = Math.max(0, ...item.items.map(it => helpers.splitMeta(it.meta).length));
  const cardH = c.padY * 2 + 0.28 + 0.35 + maxFeat * pg.featureLineH + 0.32;
  
  item.items.forEach((it, idx) => {
    if (idx >= cols) return;
    const cx = x + idx * (cardW + g.gap);
    const isFeatured = it.featured === "true" || it.tag === "Best" || it.tag === "추천";
    
    const color = helpers.hexClean(it.color) || pal.brand;
    const cardFill = it.color ? { color: color, transparency: 95 } : (isFeatured ? { color: pal.brandLight } : { color: pal.white });
    const cardLine = it.color ? color : (isFeatured ? pal.brand : pal.border);
    const lineWidth = (it.color || isFeatured) ? 1.5 : 0.75;
    
    slide.addShape("roundRect", {
      x: cx, y, w: cardW, h: cardH,
      rectRadius: r,
      fill: cardFill,
      line: { color: cardLine, width: lineWidth }
    });
    
    slide.addShape("rect", {
      x: cx, y, w: cardW, h: 0.05,
      fill: { color: color },
      line: { width: 0 }
    });
    
    let curY = y + c.padY;
    
    if (it.tag) {
      const badgeW = Math.min(cardW - 0.24, 1.1);
      const badgeH = 0.22;
      slide.addShape("roundRect", {
        x: cx + 0.12, y: curY, w: badgeW, h: badgeH,
        rectRadius: 0.06,
        fill: { color: color },
        line: { width: 0 }
      });
      slide.addText(it.tag, {
        x: cx + 0.12, y: curY, w: badgeW, h: badgeH,
        fontSize: c.bodySize - 3.5, bold: true, color: pal.white,
        fontFace: font, align: "center", valign: "middle"
      });
      curY += badgeH + 0.08;
    }
    
    slide.addText(it.title || "", {
      x: cx + 0.12, y: curY, w: cardW - 0.24, h: 0.28,
      fontSize: c.titleSize, bold: true, color: pal.text,
      fontFace: fontSubTitle, valign: "top"
    });
    curY += 0.32;
    
    const features = helpers.splitMeta(it.meta);
    features.forEach(feat => {
      slide.addText("• " + feat, {
        x: cx + 0.12, y: curY, w: cardW - 0.24, h: pg.featureLineH,
        fontSize: c.bodySize - 1, color: pal.text2,
        fontFace: font, valign: "top"
      });
      curY += pg.featureLineH;
    });
    
    const activeNote = it.note || it.desc;
    if (activeNote) {
      const noteY = y + cardH - c.padY - 0.24;
      slide.addShape("roundRect", {
        x: cx + 0.12, y: noteY, w: cardW - 0.24, h: 0.24,
        rectRadius: 0.04,
        fill: { color: color, transparency: 88 },
        line: { width: 0 }
      });
      slide.addText(activeNote, {
        x: cx + 0.12, y: noteY, w: cardW - 0.24, h: 0.24,
        fontSize: c.bodySize - 3, bold: true, color: color,
        fontFace: font, align: "center", valign: "middle"
      });
    }
  });
  
  return cardH + c.gap;
}
