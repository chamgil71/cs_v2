/**
 * pptx-core/cover.mjs — 표지·마무리 슬라이드(머리말 title·subtitle·logo·stats·done·cover*)
 * MD → PPTX 공용 코어의 부분(fs/path 없음). CLI(md-to-pptx.mjs)와 브라우저(src/lib/pptx-browser.ts)가 같은 코어를 부른다.
 * D = 이 변환 한 번의 디자인 설정(config/pptdesign.config.json 복사본 + 테마·머리말 덮어쓰기) — 부르는 쪽이 넘긴다.
 */
import { hexClean } from "./util.mjs";

export function renderCover(D, prs, fm, pal) {
  const slide = prs.addSlide();
  const dc = D.cover;
  const sw = D.slide.widthIn;
  const sh = D.slide.heightIn || 7.5;
  const font = D.slide.font;
  const fontTitle = D.slide.fontTitle || font;
  
  // 1. Frontmatter 색상 및 레이아웃 설정 파싱
  const customBg = hexClean(fm.coverBg);
  const customAccent = hexClean(fm.coverAccent);
  const customTextColor = hexClean(fm.coverTextColor);
  const layout = String(fm.coverLayout || "accent-bar").trim().toLowerCase();
  
  const bg = customBg || pal.bgDark;
  const accent = customAccent || pal.brand;
  const textClr = customTextColor || pal.white;
  
  // 2. 제목 정제 및 멀티라인 높이 계산
  const sanitizeTitle = (t) => {
    let clean = String(t ?? "").trim();
    if (clean.startsWith('"') && clean.endsWith('"')) {
      clean = clean.slice(1, -1);
    } else if (clean.startsWith("'") && clean.endsWith("'")) {
      clean = clean.slice(1, -1);
    }
    return clean.trim();
  };

  const titleText = sanitizeTitle(fm.title || "Guide Title");
  const titleLines = titleText ? titleText.split(/\r?\n/).length : 1;

  // 3. 배경 설정
  slide.background = { color: bg };
  
  // 4. 레이아웃에 따른 렌더링
  if (layout === "full-brand") {
    slide.background = { color: pal.brand };
    slide.addShape("rect", { x: 0, y: sh - 0.12, w: sw, h: 0.12, fill: { color: pal.white }, line: { type: "none" } });
    
    let ty = dc.titleY - 0.2;
    if (fm.logo) {
      slide.addText(fm.logo, { x: 1.0, y: ty - 0.85, w: 1.0, h: 0.75, fontSize: dc.logoFontSize + 4, align: "left", valign: "middle" });
    }
    const titleH = 1.3 + (titleLines - 1) * 0.7;
    slide.addText(titleText, { x: 1.0, y: ty, w: sw - 2.0, h: titleH, fontSize: dc.titleFontSize + 2, bold: true, color: pal.white, fontFace: fontTitle, valign: "top" });
    ty += titleH + 0.05;
    if (fm.subtitle) {
      slide.addText(fm.subtitle, { x: 1.0, y: ty, w: sw - 2.0, h: 0.45, fontSize: dc.subtitleFontSize + 1, color: pal.brandLight, fontFace: font });
      ty += 0.55;
    }
  } else if (layout === "minimal-dark") {
    let ty = dc.titleY;
    if (fm.logo) {
      slide.addText(fm.logo, { x: 1.0, y: ty - 0.85, w: 1.0, h: 0.75, fontSize: dc.logoFontSize, align: "left", valign: "middle" });
    }
    const titleH = 1.2 + (titleLines - 1) * 0.7;
    slide.addText(titleText, { x: 1.0, y: ty, w: sw - 2.0, h: titleH, fontSize: dc.titleFontSize, bold: true, color: textClr, fontFace: fontTitle, valign: "top" });
    ty += titleH;
    if (fm.subtitle) {
      slide.addText(fm.subtitle, { x: 1.0, y: ty, w: sw - 2.0, h: 0.4, fontSize: dc.subtitleFontSize, color: pal.muted, fontFace: font });
      ty += 0.5;
    }
  } else {
    slide.addShape("rect", { x: dc.accentBarX, y: dc.accentBarY, w: dc.accentBarW, h: dc.accentBarH, fill: { color: accent }, line: { type: "none" } });
    
    let ty = dc.titleY;
    if (fm.logo) {
      slide.addText(fm.logo, { x: dc.titleX, y: ty - 0.85, w: 0.85, h: 0.75, fontSize: dc.logoFontSize, align: "left", valign: "middle" });
    }
    const titleH = 1.2 + (titleLines - 1) * 0.7;
    slide.addText(titleText, { x: dc.titleX, y: ty, w: sw - dc.titleX - 0.5, h: titleH, fontSize: dc.titleFontSize, bold: true, color: textClr, fontFace: fontTitle, valign: "top" });
    ty += titleH;
    if (fm.subtitle) {
      slide.addText(fm.subtitle, { x: dc.titleX, y: ty, w: sw - dc.titleX - 0.5, h: 0.4, fontSize: dc.subtitleFontSize, color: pal.muted, fontFace: font });
      ty += 0.5;
    }
  }
  
  // 4. 하단 통계 지표
  let statsY = sh - 1.8;
  if (fm.stats?.length) {
    const statW = 1.6;
    fm.stats.forEach((stat, i) => {
      const sx = (layout === "accent-bar" ? dc.titleX : 1.0) + i * (statW + 0.3);
      slide.addText(stat.value || "", { x: sx, y: statsY, w: statW, h: 0.38, fontSize: D.cover.statValueSize, bold: true, color: accent, fontFace: fontTitle });
      slide.addText(stat.label || "", { x: sx, y: statsY + 0.38, w: statW, h: 0.24, fontSize: D.cover.statLabelSize, color: pal.muted, fontFace: font });
    });
  }
}

export function renderDoneSlide(D, prs, fm, pal) {
  if (!fm.done?.title) return;
  const slide = prs.addSlide();
  const sw = D.slide.widthIn;
  const font = D.slide.font;
  const fontTitle = D.slide.fontTitle || font;
  slide.background = { color: pal.brandDeep || pal.brandDark };
  slide.addText(fm.done.title, { x: 1, y: 2.5, w: sw - 2, h: 0.8, fontSize: D.done.titleSize, bold: true, color: D.palette.white, fontFace: fontTitle, align: "center" });
  if (fm.done.subtitle) slide.addText(fm.done.subtitle, { x: 1.5, y: 3.5, w: sw - 3, h: 0.6, fontSize: D.done.subtitleSize, color: pal.mutedLight, fontFace: font, align: "center", wrap: true });
  if (fm.done.ctaLabel) slide.addText(fm.done.ctaLabel + " →", { x: (sw - 3) / 2, y: 4.3, w: 3, h: 0.5, fontSize: D.done.ctaSize, bold: true, color: pal.brand, fontFace: fontTitle, align: "center" });
}
