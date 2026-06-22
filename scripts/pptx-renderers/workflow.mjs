/**
 * workflow.mjs
 * 가로 프로세스 및 워크플로우 순서도 숏코드
 */

export const type = ["workflow-flow", "workflow-strip", "workflow"];

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  const wf = D.workflow || { stepH: 0.95 };
  return wf.stepH + c.gap;
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const r = D.slide.globalRadius || 0.08;
  const wf = D.workflow || { stepH: 0.95, arrowW: 0.35 };
  
  const n = item.items.length;
  if (!n) return 0;
  
  const stepH = wf.stepH;
  const arrowW = wf.arrowW;
  const stepW = (w - (n - 1) * arrowW) / n;
  
  item.items.forEach((it, idx) => {
    const cx = x + idx * (stepW + arrowW);
    const color = helpers.hexClean(it.color) || pal.brand;
    const stepBg = it.color ? { color: color, transparency: 92 } : { color: pal.brandLight };
    
    // 워크플로우 각 단계 상자
    slide.addShape("roundRect", {
      x: cx, y, w: stepW, h: stepH,
      rectRadius: r,
      fill: stepBg,
      line: { color: it.color ? color : pal.border, width: 0.75 }
    });
    
    // 단계 상단 컬러 띠
    slide.addShape("rect", {
      x: cx, y, w: stepW, h: 0.04,
      fill: { color: color },
      line: { width: 0 }
    });
    
    // 이모지 / 아이콘
    if (it.icon && it.icon !== "•") {
      slide.addText(it.icon, {
        x: cx, y: y + 0.08, w: stepW, h: 0.3,
        fontSize: 16, align: "center", valign: "middle"
      });
    }
    
    // 단계 이름
    slide.addText(it.title || "", {
      x: cx + 0.06, y: y + 0.42, w: stepW - 0.12, h: 0.26,
      fontSize: c.bodySize, bold: true, color: pal.text,
      fontFace: font, align: "center", valign: "middle"
    });
    
    // 하단 서브 정보 (meta)
    if (it.meta) {
      slide.addText(it.meta, {
        x: cx + 0.06, y: y + 0.68, w: stepW - 0.12, h: 0.18,
        fontSize: c.bodySize - 2, color: pal.text2,
        fontFace: font, align: "center", valign: "top"
      });
    }
    
    // 오른쪽 화살표 그리기 (마지막 단계 제외)
    if (idx < n - 1) {
      slide.addText("→", {
        x: cx + stepW, y: y + (stepH - 0.22) / 2, w: arrowW, h: 0.22,
        fontSize: 14, color: D.palette?.workflowArrow || "6366F1",
        align: "center", valign: "middle"
      });
    }
  });
  
  return stepH + c.gap;
}
