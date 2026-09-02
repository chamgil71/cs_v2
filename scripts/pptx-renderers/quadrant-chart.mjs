/**
 * quadrant-chart.mjs
 * 사분면 위치 차트 — 두 축(X/Y) 기준으로 여러 항목의 상대 위치를 비교하는 숏코드
 * 블록 인수: xLabel="..." yLabel="..." (공백 포함 라벨은 반드시 큰따옴표로 감쌀 것)
 * 항목 필드: title(라벨), color, fx/fy(0~1 비율, 좌하단이 0,0)
 */

export const type = "quadrant-chart";

const H = 3.4;

function parseAxisLabels(args) {
  const xLabelMatch = (args || "").match(/xLabel="([^"]*)"/);
  const yLabelMatch = (args || "").match(/yLabel="([^"]*)"/);
  return {
    xLabel: xLabelMatch ? xLabelMatch[1] : "",
    yLabel: yLabelMatch ? yLabelMatch[1] : "",
  };
}

function clamp01(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0.5;
}

export function estimateHeight(item, w, D, helpers) {
  return H + D.card.gap;
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const items = item.items || [];
  const { xLabel, yLabel } = parseAxisLabels(item.args);

  const axisLabelH = 0.3;
  const plotX = x + (yLabel ? 0.3 : 0);
  const plotY = y;
  const plotW = w - (yLabel ? 0.3 : 0);
  const plotH = H - (xLabel ? axisLabelH : 0);

  slide.addShape("roundRect", {
    x: plotX, y: plotY, w: plotW, h: plotH,
    rectRadius: 0.06,
    fill: { color: pal.white },
    line: { color: pal.border, width: 0.75 }
  });

  // 격자선(가로/세로 중앙) — line 도형 대신 얇은 rect 로 그려 음수 extent 위험 자체를 없앤다
  slide.addShape("rect", {
    x: plotX, y: plotY + plotH / 2, w: plotW, h: 0.01,
    fill: { color: pal.border }, line: { width: 0 }
  });
  slide.addShape("rect", {
    x: plotX + plotW / 2, y: plotY, w: 0.01, h: plotH,
    fill: { color: pal.border }, line: { width: 0 }
  });

  if (yLabel) {
    slide.addText(yLabel, {
      x: x, y: plotY, w: 0.3, h: plotH,
      fontSize: D.quadrant.axisLabelFontSize, bold: true, color: pal.text2,
      fontFace: font, align: "center", valign: "middle", rotate: 270
    });
  }
  if (xLabel) {
    slide.addText(xLabel, {
      x: plotX, y: plotY + plotH, w: plotW, h: axisLabelH,
      fontSize: D.quadrant.axisLabelFontSize, bold: true, color: pal.text2,
      fontFace: font, align: "center", valign: "top"
    });
  }

  const dotSize = 0.14;
  items.forEach((it) => {
    const fx = clamp01(it.fx);
    const fy = clamp01(it.fy);
    const color = helpers.hexClean(it.color) || pal.brand;
    const px = plotX + plotW * fx;
    const py = plotY + plotH * (1 - fy);

    slide.addShape("ellipse", {
      x: px - dotSize / 2, y: py - dotSize / 2, w: dotSize, h: dotSize,
      fill: { color }, line: { color: pal.white, width: 1.5 }
    });
    slide.addText(it.title || "", {
      x: px - 0.9, y: py + dotSize / 2 + 0.02, w: 1.8, h: 0.24,
      fontSize: D.quadrant.pointLabelFontSize, bold: true, color,
      fontFace: font, align: "center", valign: "top"
    });
  });

  return H + c.gap;
}
