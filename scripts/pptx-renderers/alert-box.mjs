/**
 * alert-box.mjs
 * 정보 및 주의/오류 알림 상자 숏코드
 */

export const type = "alert-box";

const ALERT_COLORS = {
  tip:     { bg: "F0FDF4", bar: "22C55E", title: "15803D", text: "166534" },
  warn:    { bg: "FFFBEB", bar: "F59E0B", title: "B45309", text: "92400E" },
  success: { bg: "F0FDF4", bar: "10B981", title: "065F46", text: "064E3B" },
  danger:  { bg: "FFF1F2", bar: "EF4444", title: "B91C1C", text: "991B1B" },
};

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  return item.items.reduce((sum, it) => {
    const hasIcon = !!it.icon;
    const barW = 0.08;
    const tw = w - barW - 0.14;
    const innerW = hasIcon ? tw - 0.38 : tw;
    
    const lines = helpers.estimateLines(it.desc || "", innerW, c.bodySize);
    const titleH = it.title ? (c.titleSize / 72) * 1.7 + c.gap * 0.5 : 0;
    const descH  = (c.bodySize / 72) * 1.7 * Math.max(1, lines);
    
    return sum + c.padY * 2 + titleH + descH + c.gap;
  }, 0);
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const fontSubTitle = D.slide.fontSubTitle || font;
  const r = D.slide.globalRadius || 0.08;
  
  let curY = y;
  
  for (const it of item.items) {
    const t = String(item.args || it.type || it.tag || "tip").trim().toLowerCase();
    const ac = ALERT_COLORS[t] || ALERT_COLORS.tip;
    
    const hasIcon = !!it.icon;
    const barW = 0.08;
    let tx = x + barW + 0.14;
    let tw = w - barW - 0.18;
    
    if (hasIcon) {
      tw -= 0.38;
    }
    
    const lines = helpers.estimateLines(it.desc || "", tw, c.bodySize);
    const titleH = it.title ? (c.titleSize / 72) * 1.7 + c.gap * 0.5 : 0;
    const descH  = (c.bodySize / 72) * 1.7 * Math.max(1, lines);
    const boxH   = c.padY * 2 + titleH + descH;
    
    slide.addShape("roundRect", {
      x, y: curY, w, h: boxH,
      rectRadius: r,
      fill: { color: ac.bg },
      line: { color: ac.bar, width: 1.0 }
    });
    
    slide.addShape("roundRect", {
      x, y: curY, w: barW * 3.5, h: boxH,
      rectRadius: r,
      fill: { color: ac.bar },
      line: { width: 0 }
    });
    slide.addShape("rect", {
      x: x + barW, y: curY, w: barW * 2.5, h: boxH,
      fill: { color: ac.bar },
      line: { width: 0 }
    });
    
    let textY = curY + c.padY;
    
    if (hasIcon) {
      slide.addText(it.icon, {
        x: tx - 0.38, y: textY, w: 0.35, h: 0.35,
        fontSize: 14, valign: "middle"
      });
    }
    
    if (it.title) {
      slide.addText(it.title, {
        x: tx, y: textY, w: tw, h: titleH,
        fontSize: c.titleSize, bold: true, color: ac.title,
        fontFace: fontSubTitle, valign: "top"
      });
      textY += titleH;
    }
    
    if (it.desc) {
      slide.addText(it.desc, {
        x: tx, y: textY, w: tw, h: descH + 0.05,
        fontSize: c.bodySize, color: ac.text,
        fontFace: font, valign: "top", wrap: true
      });
    }
    
    curY += boxH + c.gap;
  }
  
  return curY - y;
}
