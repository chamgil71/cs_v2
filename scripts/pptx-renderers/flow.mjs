/**
 * flow.mjs
 * 가로 순서 흐름 및 이정표 시각화 숏코드
 */

export const type = ["step-flow", "flow"];

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  const wf = D.workflow || { stepH: 0.95 };
  // 일반 가로 워크플로우에 위성 영역 약간 추가된 크기
  return wf.stepH + 0.3 + c.gap;
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const r = D.slide.globalRadius || 0.08;
  const wf = D.workflow || { stepH: 0.95, arrowW: 0.35 };
  
  // 화살표 숏코드 아이템 필터링
  const steps = item.items.filter(it => it.title !== "→" && it.icon !== "→");
  const n = steps.length;
  if (!n) return 0;
  
  const arrowW = wf.arrowW;
  const stepW  = (w - (n - 1) * arrowW) / n;
  const stepH  = wf.stepH + 0.3;
  
  steps.forEach((it, idx) => {
    const cx = x + idx * (stepW + arrowW);
    const isActive = it.tag === "active" || it.tag === "활성";
    
    // 브랜드 색상 및 배경 투명도 계산
    const baseColor = helpers.hexClean(it.color) || pal.brand;
    const bg = isActive
      ? { color: baseColor, transparency: 90 }
      : (it.color ? { color: baseColor, transparency: 92 } : { color: pal.brandLight });
      
    const border = isActive ? baseColor : (it.color ? baseColor : pal.border);
    const lineWidth = isActive ? 1.5 : 0.75;
    
    // 단계 상자
    slide.addShape("roundRect", {
      x: cx, y, w: stepW, h: stepH,
      rectRadius: r,
      fill: bg,
      line: { color: border, width: lineWidth }
    });
    
    // 단계 상단 컬러 띠
    slide.addShape("rect", {
      x: cx, y, w: stepW, h: 0.04,
      fill: { color: baseColor },
      line: { width: 0 }
    });
    
    // 이모지 / 아이콘
    if (it.icon && it.icon !== "•") {
      slide.addText(it.icon, {
        x: cx, y: y + 0.08, w: stepW, h: 0.3,
        fontSize: 16, align: "center", valign: "middle"
      });
    }
    
    // 단계 타이틀
    slide.addText(it.title || "", {
      x: cx + 0.06, y: y + 0.42, w: stepW - 0.12, h: 0.26,
      fontSize: c.bodySize, bold: true, color: isActive ? pal.white : pal.text,
      fontFace: font, align: "center", valign: "middle"
    });
    
    // 단계 설명 (desc)
    if (it.desc) {
      slide.addText(it.desc, {
        x: cx + 0.06, y: y + 0.7, w: stepW - 0.12, h: 0.22,
        fontSize: c.bodySize - 2, color: isActive ? pal.mutedLight || "E2E8F0" : pal.text2,
        fontFace: font, align: "center", valign: "top", wrap: true
      });
    }
    
    // 화살표 렌더링
    if (idx < steps.length - 1) {
      slide.addText("→", {
        x: cx + stepW, y: y + (stepH - 0.22) / 2, w: arrowW, h: 0.22,
        fontSize: 14, color: D.palette?.workflowArrow || "6366F1",
        align: "center", valign: "middle"
      });
    }
  });
  
  return stepH + c.gap;
}
