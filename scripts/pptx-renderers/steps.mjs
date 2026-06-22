/**
 * steps.mjs
 * 순서가 있는 리스트 및 학습 목차 숏코드
 */

export const type = ["step-list", "steps", "skill-list", "chapter-list"];

export function estimateHeight(item, w, D, helpers) {
  const g = D.grid;
  const c = D.card;
  const stepH = g.stepItemH || 0.65;
  return item.items.length * (stepH + c.gap);
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const g = D.grid;
  const c = D.card;
  const font = D.slide.font;
  const r = D.slide.globalRadius || 0.08;
  const stepH = g.stepItemH || 0.65;
  
  item.items.forEach((it, idx) => {
    const color = helpers.hexClean(it.color) || pal.brand;
    const cy = y + idx * (stepH + c.gap);
    
    // 1. 단계 카드 외곽 둥근 사각형
    slide.addShape("roundRect", {
      x, y: cy, w, h: stepH,
      rectRadius: r,
      fill: it.color ? { color: color, transparency: 92 } : { color: pal.white },
      line: { color: it.color ? color : pal.border, width: 0.75 }
    });
    
    // 2. 왼쪽 번호 동그라미 뱃지
    const numSize = 0.42;
    const ny = cy + (stepH - numSize) / 2;
    slide.addShape("roundRect", {
      x: x + 0.15, y: ny, w: numSize, h: numSize,
      rectRadius: 0.1,
      fill: { color: color },
      line: { width: 0 }
    });
    
    // 번호 텍스트 (아이콘에 숫자가 명시되어 있다면 해당 문자로 렌더링, 없으면 인덱스)
    const stepLabel = it.icon && isNaN(Number(it.icon)) ? it.icon : String(idx + 1);
    slide.addText(stepLabel, {
      x: x + 0.15, y: ny, w: numSize, h: numSize,
      fontSize: c.bodySize + 1, bold: true, color: pal.white,
      fontFace: font, align: "center", valign: "middle"
    });
    
    // 3. 우측 텍스트 렌더링 (타이틀, 설명)
    const tx = x + 0.15 + numSize + 0.15;
    const tw = w - 0.15 - numSize - 0.3;
    
    slide.addText(it.title || "", {
      x: tx, y: cy + 0.07, w: tw, h: 0.26,
      fontSize: c.bodySize, bold: true, color: it.color ? color : pal.text,
      fontFace: font, valign: "top"
    });
    
    if (it.desc) {
      slide.addText(it.desc, {
        x: tx, y: cy + 0.33, w: tw, h: stepH - 0.38,
        fontSize: c.bodySize - 1.5, color: pal.text2,
        fontFace: font, valign: "top", wrap: true
      });
    }
  });
  
  return item.items.length * (stepH + c.gap);
}
