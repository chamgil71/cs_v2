/**
 * venn.mjs
 * 벤 다이어그램 — 두 영역이 겹칠 때 새로운 가치/의미가 발생함을 표현하는 숏코드
 */

export const type = ["venn-diagram", "venn"];

const H = 2.8;

export function estimateHeight(item, w, D, helpers) {
  return H + D.card.gap;
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const fontTitle = D.slide.fontTitle || font;

  const items = item.items || [];
  const left = items[0] || {};
  const right = items[1] || {};
  const center = items[2] || {};

  const r = 1.35;
  const overlap = 0.6;
  const centerX = x + w / 2;
  const centerY = y + H / 2;
  const leftCx = centerX - overlap;
  const rightCx = centerX + overlap;

  const leftColor = helpers.hexClean(left.color) || pal.brand;
  const rightColor = helpers.hexClean(right.color) || pal.brandDark;

  slide.addShape("ellipse", {
    x: leftCx - r, y: centerY - r, w: r * 2, h: r * 2,
    fill: { color: leftColor, transparency: 75 },
    line: { color: leftColor, width: 2 }
  });
  slide.addShape("ellipse", {
    x: rightCx - r, y: centerY - r, w: r * 2, h: r * 2,
    fill: { color: rightColor, transparency: 75 },
    line: { color: rightColor, width: 2 }
  });

  slide.addText(left.title || "", {
    x: leftCx - r, y: centerY + r - 0.45, w: r * 2 - overlap, h: 0.4,
    fontSize: D.venn.labelFontSize, bold: true, color: leftColor,
    fontFace: fontTitle, align: "center"
  });
  slide.addText(right.title || "", {
    x: rightCx - r + overlap, y: centerY + r - 0.45, w: r * 2 - overlap, h: 0.4,
    fontSize: D.venn.labelFontSize, bold: true, color: rightColor,
    fontFace: fontTitle, align: "center"
  });

  if (center.icon || center.desc || center.title) {
    if (center.icon) {
      slide.addText(center.icon, {
        x: centerX - 0.6, y: centerY - 0.55, w: 1.2, h: 0.5,
        fontSize: D.venn.centerIconFontSize, align: "center", valign: "bottom"
      });
    }
    const centerText = center.desc || center.title || "";
    if (centerText) {
      slide.addText(centerText, {
        x: centerX - 0.9, y: centerY + (center.icon ? 0 : -0.2), w: 1.8, h: 0.5,
        fontSize: D.venn.centerDescFontSize, bold: true, color: pal.text,
        fontFace: font, align: "center", valign: "top", wrap: true
      });
    }
  }

  return H + c.gap;
}
