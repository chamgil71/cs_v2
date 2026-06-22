/**
 * git-flow.mjs
 * Git Flow 시각화 숏코드
 */

export const type = ["git-flow", "git-flow-strip"];

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  return item.items.length * (0.95 + c.gap);
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const fontSubTitle = D.slide.fontSubTitle || font;
  const r = D.slide.globalRadius || 0.08;
  
  let curY = y;
  const rowH = 0.95;
  
  item.items.forEach((it, idx) => {
    const color = helpers.hexClean(it.color) || pal.brand;
    const bgTrans = { color: color, transparency: 92 };
    
    // 1. 브랜치 행 외부 아웃라인 카드
    slide.addShape("roundRect", {
      x, y: curY, w, h: rowH,
      rectRadius: r,
      fill: { color: pal.white },
      line: { color: pal.border, width: 0.75 }
    });
    
    // 2. 왼쪽 브랜치명 라벨 배지
    const labelW = 1.3;
    const labelH = 0.5;
    const labelX = x + 0.15;
    const labelY = curY + (rowH - labelH) / 2;
    
    slide.addShape("roundRect", {
      x: labelX, y: labelY, w: labelW, h: labelH,
      rectRadius: 0.06,
      fill: bgTrans,
      line: { color: color, width: 1.5 }
    });
    
    slide.addText(it.title || "branch", {
      x: labelX + 0.05, y: labelY, w: labelW - 0.1, h: labelH,
      fontSize: c.bodySize - 1, bold: true, color: color,
      fontFace: fontSubTitle, align: "center", valign: "middle"
    });
    
    // 3. 우측 커밋 라인 축
    const lineStartX = labelX + labelW + 0.25;
    const lineEndX = x + w - 0.25;
    const lineY = curY + rowH / 2;
    const lineW = lineEndX - lineStartX;
    
    slide.addShape("rect", {
      x: lineStartX, y: lineY - 0.015, w: lineW, h: 0.03,
      fill: { color: color, transparency: 60 },
      line: { width: 0 }
    });
    
    // 4. 커밋들 그리기
    const tags = it.tag ? it.tag.split("|").map(t => t.trim()) : [];
    const metas = it.meta ? it.meta.split("|").map(m => m.trim()) : [];
    const count = Math.max(tags.length, metas.length, 1);
    const segmentW = count > 1 ? lineW / (count - 0.5) : lineW;
    
    for (let i = 0; i < count; i++) {
      const tag = tags[i] || "";
      const meta = metas[i] || "";
      const commitX = lineStartX + i * segmentW;
      const commitSize = 0.2;
      const commitY = lineY - commitSize / 2;
      
      slide.addShape("ellipse", {
        x: commitX, y: commitY, w: commitSize, h: commitSize,
        fill: { color: color },
        line: { color: pal.white, width: 1.5 }
      });
      
      if (meta) {
        slide.addText(meta, {
          x: commitX - 0.5, y: lineY + 0.12, w: 1.2, h: 0.28,
          fontSize: c.bodySize - 3.5, color: pal.text2,
          fontFace: font, align: "center", valign: "top", wrap: true
        });
      }
      
      if (tag) {
        slide.addShape("roundRect", {
          x: commitX - 0.4, y: lineY - 0.38, w: 1.0, h: 0.2,
          rectRadius: 0.04,
          fill: { color: color },
          line: { width: 0 }
        });
        slide.addText(tag, {
          x: commitX - 0.4, y: lineY - 0.38, w: 1.0, h: 0.2,
          fontSize: c.bodySize - 4, bold: true, color: pal.white,
          fontFace: font, align: "center", valign: "middle"
        });
      }
    }
    
    curY += rowH + c.gap;
  });
  
  return curY - y;
}
