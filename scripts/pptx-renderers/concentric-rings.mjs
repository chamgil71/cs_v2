/**
 * concentric-rings.mjs
 * 동심원 포함관계 — A⊃B⊃C 같은 계층적 포함관계를 표현하는 숏코드
 * 항목은 바깥(가장 큰 범주)에서 안쪽(가장 구체적인 범주) 순서로 작성한다.
 * 마지막 항목에 icon 이 있으면 가장 안쪽 중심에 아이콘을 얹는다.
 */

export const type = "concentric-rings";

const H = 3.4;
const OUTER_R = 1.15;
const STEP_RATIO = 0.78; // 링 하나 안쪽으로 들어갈 때마다 반지름 축소 비율

export function estimateHeight(item, w, D, helpers) {
  return H + D.card.gap;
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const items = item.items || [];
  const n = items.length;
  if (!n) return H + c.gap;

  const cx = x + w / 2;
  const visualH = H - 0.5; // 하단 범례 영역을 뺀 원 영역 높이
  const cy = y + visualH / 2;

  items.forEach((it, i) => {
    const r = OUTER_R * Math.pow(STEP_RATIO, i);
    const color = helpers.hexClean(it.color) || pal.brand;
    slide.addShape("ellipse", {
      x: cx - r, y: cy - r, w: r * 2, h: r * 2,
      fill: { color, transparency: 8 },
      line: { color: pal.white, width: 1.5 }
    });
  });

  const last = items[n - 1];
  if (last && last.icon) {
    const r = OUTER_R * Math.pow(STEP_RATIO, n - 1);
    slide.addText(last.icon, {
      x: cx - r, y: cy - r, w: r * 2, h: r * 2,
      fontSize: D.rings.centerIconFontSize, align: "center", valign: "middle", color: pal.white
    });
  }

  // 하단 범례 — 색상 칩 + 라벨을 한 줄로 나열
  const legendY = y + visualH + 0.1;
  const chipW = w / n;
  items.forEach((it, i) => {
    const color = helpers.hexClean(it.color) || pal.brand;
    const chipX = x + i * chipW;
    slide.addShape("ellipse", {
      x: chipX, y: legendY + 0.06, w: 0.12, h: 0.12,
      fill: { color }, line: { width: 0 }
    });
    slide.addText(it.title || "", {
      x: chipX + 0.16, y: legendY, w: chipW - 0.16, h: 0.24,
      fontSize: D.rings.legendFontSize, bold: true, color: pal.text2,
      fontFace: font, align: "left", valign: "middle"
    });
  });

  return H + c.gap;
}
