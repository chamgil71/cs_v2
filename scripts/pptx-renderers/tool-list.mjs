/**
 * tool-list.mjs
 * 도구 및 서비스 카드 2단 레이아웃 숏코드
 */

export const type = ["tool-list", "tool-card"];

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  const tcH = 0.95;
  
  return item.items.reduce((sum, it) => {
    const metaList = helpers.splitMeta(it.meta);
    const hasMeta = metaList.length > 0;
    const cardH = tcH + (hasMeta ? 0.15 + metaList.length * 0.22 : 0);
    return sum + cardH + c.gap;
  }, 0);
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const fontSubTitle = D.slide.fontSubTitle || font;
  const r = D.slide.globalRadius || 0.08;
  const baseTcH = 0.95;
  
  let curY = y;
  
  for (const it of item.items) {
    const color = helpers.hexClean(it.color) || pal.brand;
    const metaList = helpers.splitMeta(it.meta);
    const hasMeta = metaList.length > 0;
    const cardH = baseTcH + (hasMeta ? 0.15 + metaList.length * 0.22 : 0);
    
    slide.addShape("roundRect", {
      x, y: curY, w, h: cardH,
      rectRadius: r,
      fill: { color: pal.white },
      line: { color: pal.border, width: 0.75 }
    });
    
    const sideW = 2.2;
    slide.addShape("roundRect", {
      x, y: curY, w: sideW, h: cardH,
      rectRadius: r,
      fill: { color: color },
      line: { width: 0 }
    });
    slide.addShape("rect", {
      x: x + sideW - 0.08, y: curY, w: 0.08, h: cardH,
      fill: { color: color },
      line: { width: 0 }
    });
    
    let cx = x + 0.12;
    if (it.icon && it.icon !== "•") {
      slide.addText(it.icon, {
        x: cx, y: curY, w: 0.45, h: baseTcH,
        fontSize: 20, align: "center", valign: "middle"
      });
      cx += 0.52;
    }
    
    const titleW = sideW - (cx - x) - 0.1;
    slide.addText(it.title || "Tool", {
      x: cx, y: curY + 0.12, w: titleW, h: 0.35,
      fontSize: 10.5, bold: true, color: pal.white,
      fontFace: fontSubTitle, valign: "middle"
    });
    
    if (it.tag) {
      slide.addShape("roundRect", {
        x: x + 0.15, y: curY + baseTcH - 0.38, w: sideW - 0.3, h: 0.2,
        rectRadius: 0.04,
        fill: { color: pal.white, transparency: 85 },
        line: { width: 0 }
      });
      slide.addText(it.tag, {
        x: x + 0.15, y: curY + baseTcH - 0.38, w: sideW - 0.3, h: 0.2,
        fontSize: 7.5, bold: true, color: color,
        fontFace: font, align: "center", valign: "middle"
      });
    }
    
    const rightX = x + sideW + 0.25;
    const rightW = w - sideW - 0.4;
    let textY = curY + 0.14;
    
    if (it.desc) {
      slide.addText(it.desc, {
        x: rightX, y: textY, w: rightW, h: 0.28,
        fontSize: c.bodySize, bold: true, color: pal.text,
        fontFace: font, valign: "top", wrap: true
      });
      textY += 0.34;
    }
    
    if (hasMeta) {
      metaList.forEach(m => {
        slide.addText("• " + m, {
          x: rightX, y: textY, w: rightW, h: 0.2,
          fontSize: c.bodySize - 1.5, color: pal.text2,
          fontFace: font, valign: "top"
        });
        textY += 0.22;
      });
    }
    
    curY += cardH + c.gap;
  }
  
  return curY - y;
}
