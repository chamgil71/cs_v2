/**
 * network-box.mjs
 * 네트워크 허브-스포크(마인드맵) 시각화 숏코드
 */

export const type = "network-box";

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  return 3.2 + c.gap;
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const fontTitle = D.slide.fontTitle || font;
  const fontSubTitle = D.slide.fontSubTitle || font;
  const r = D.slide.globalRadius || 0.08;
  const h = 3.2;
  
  if (!item.items.length) return 0;
  
  const mainNode = item.items[0];
  const subNodes = item.items.slice(1);
  
  slide.addShape("roundRect", {
    x, y, w, h,
    rectRadius: r,
    fill: { color: pal.white },
    line: { color: pal.border, width: 0.75 }
  });
  
  const centerX = x + w / 2;
  const centerY = y + h / 2;
  
  const mainW = 2.4;
  const mainH = 0.85;
  const mainX = centerX - mainW / 2;
  const mainY = centerY - mainH / 2;
  
  const subW = 2.2;
  const subH = 0.75;
  
  const offsets = [
    { dx: -2.8, dy: -0.7 },
    { dx: 2.8,  dy: -0.7 },
    { dx: -2.8, dy: 0.7 },
    { dx: 2.8,  dy: 0.7 }
  ];
  
  const actualSubs = subNodes.slice(0, 4);
  
  // 연결선 그리기
  actualSubs.forEach((node, idx) => {
    const offset = offsets[idx];
    const subX = centerX + offset.dx - subW / 2;
    const subY = centerY + offset.dy - subH / 2;
    const scX = subX + subW / 2;
    const scY = subY + subH / 2;
    
    const color = helpers.hexClean(node.color || mainNode.color) || pal.brand;
    
    slide.addShape("line", {
      x: centerX,
      y: centerY,
      w: scX - centerX,
      h: scY - centerY,
      line: { color: color, width: 2.0, dashType: "dash" }
    });
  });
  
  // 메인 노드 그리기
  const mainColor = helpers.hexClean(mainNode.color) || pal.brand;
  slide.addShape("roundRect", {
    x: mainX, y: mainY, w: mainW, h: mainH,
    rectRadius: 0.12,
    fill: { color: mainColor },
    line: { color: pal.white, width: 2 }
  });
  
  slide.addText(mainNode.title || "Main", {
    x: mainX + 0.1, y: mainY, w: mainW - 0.2, h: mainH,
    fontSize: 13, bold: true, color: pal.white,
    fontFace: fontTitle, align: "center", valign: "middle"
  });
  
  // 서브 노드들 그리기
  actualSubs.forEach((node, idx) => {
    const offset = offsets[idx];
    const subX = centerX + offset.dx - subW / 2;
    const subY = centerY + offset.dy - subH / 2;
    
    const color = helpers.hexClean(node.color || mainNode.color) || pal.brand;
    
    slide.addShape("roundRect", {
      x: subX, y: subY, w: subW, h: subH,
      rectRadius: 0.08,
      fill: { color: pal.white },
      line: { color: color, width: 1.5 }
    });
    
    slide.addShape("rect", {
      x: subX, y: subY, w: subW, h: 0.04,
      fill: { color: color },
      line: { width: 0 }
    });
    
    slide.addText(node.title || "", {
      x: subX + 0.1, y: subY + 0.08, w: subW - 0.2, h: 0.3,
      fontSize: c.bodySize - 1.5, bold: true, color: pal.text,
      fontFace: fontSubTitle, align: "center", valign: "middle"
    });
    
    if (node.meta) {
      slide.addText(node.meta, {
        x: subX + 0.1, y: subY + 0.38, w: subW - 0.2, h: 0.3,
        fontSize: c.bodySize - 3.5, color: pal.text2,
        fontFace: font, align: "center", valign: "top", wrap: true
      });
    }
  });
  
  return h + c.gap;
}
