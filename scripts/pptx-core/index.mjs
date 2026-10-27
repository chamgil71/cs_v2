/**
 * pptx-core/index.mjs — MD → PPTX 공용 코어 입구 (fs/path 없음, Node·브라우저 공용)
 *
 * HTML 의 guide-core / presentation-core 와 같은 구조: 변환 전체(파싱·테마·머리말 덮어쓰기·팔레트·
 * 표지·섹션·마무리)를 이 코어가 갖고, 부르는 쪽은 입출력만 맡는다 → 브라우저 PPTX == CLI PPTX.
 *   CLI    : scripts/md-to-pptx.mjs   (config 를 fs 로 읽고, 결과를 파일로 저장)
 *   브라우저 : src/lib/pptx-browser.ts (config 를 ?raw 로 받고, 결과를 다운로드)
 *
 *   const { prs } = buildPptx(mdText, { styles, design, fontAliases, styleOverride, noCover, verbose, label });
 *   await prs.writeFile({ fileName });   // 또는 prs.write({ outputType: "nodebuffer" })
 *
 * design 은 복사해서 쓴다(부르는 쪽 config 객체를 바꾸지 않는다 — 예전의 전역 D 복원 코드가 필요 없음).
 */
import pptxgen from "pptxgenjs";
import { shapeSetPptx, pickShapeSet } from "../shape-set.mjs";
import { buildSlideData } from "./doc.mjs";
import { hexClean, makePalette, resolveFont, resolveDFonts } from "./util.mjs";
import { renderCover, renderDoneSlide } from "./cover.mjs";
import { renderSectionSlide } from "./section.mjs";
import { attachNotesFormatter } from "./notes.mjs";

/** JSONC(줄·블록 주석 허용) 문자열 → 객체 — CLI·브라우저가 config 를 읽을 때 같이 쓴다 */
export function parseJsonc(src) {
  return JSON.parse(String(src).replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, ""));
}

export function buildPptx(rawMd, { styles, design, fontAliases = {}, styleOverride = null, noCover = false, verbose = false, label = "" } = {}) {
  const D = JSON.parse(JSON.stringify(design));
  resolveDFonts(D, fontAliases);
  const { fm, sections, styleKey, style } = buildSlideData(rawMd, styles, styleOverride);

  // Style 오버라이드 지원 (styles.json 정의 우선 적용) — alias resolve 포함
  if (style.pptxFont)       D.slide.font        = resolveFont(fontAliases, style.pptxFont);
  if (style.pptxFontTitle)  D.slide.fontTitle   = resolveFont(fontAliases, style.pptxFontTitle);
  if (style.pptxFontSubTitle) D.slide.fontSubTitle = resolveFont(fontAliases, style.pptxFontSubTitle);
  if (style.titleSize) D.card.titleSize = Number(style.titleSize);
  if (style.bodySize) D.card.bodySize = Number(style.bodySize);

  // Frontmatter 오버라이드 지원 (제목/본문/중간제목 폰트 세분화 - 최종 덮어쓰기) — alias resolve 포함
  if (fm.fontFace)    D.slide.font        = resolveFont(fontAliases, fm.fontFace);
  if (fm.fontTitle)   D.slide.fontTitle   = resolveFont(fontAliases, fm.fontTitle);
  if (fm.fontSubTitle)D.slide.fontSubTitle= resolveFont(fontAliases, fm.fontSubTitle);
  if (fm.titleSize) D.card.titleSize = Number(fm.titleSize);
  if (fm.bodySize) D.card.bodySize = Number(fm.bodySize);

  const pal = makePalette(D, style);

  // Frontmatter 브랜드 메인 컬러 강제 오버라이드 지원
  if (fm.brandColor) {
    const customBrand = hexClean(fm.brandColor);
    if (customBrand) {
      pal.brand = customBrand;
      pal.brandDark = customBrand;
      pal.brandDeep = customBrand;
      pal.brandLight = "F0F7FF"; // Prevent 8-digit hex, use 6-digit pastel blue
    }
  }
  pal.shape = shapeSetPptx(pickShapeSet(style.shapeSet, fm.shape), pal, { baseBorderWidth: D.card.borderWidth });   // 서식 세트 → helpers.cardBox (brandColor 반영 뒤)

  if (verbose) {
    console.log(`  📄 ${label}  style: ${styleKey}`);
    sections.forEach(s => console.log(`     [${s.num}] "${s.title}"  items: ${s.items.map(i => i.type).join(", ")}`));
  }
  const prs = new pptxgen();
  if (D.slide.layout && D.slide.widthIn && D.slide.heightIn) {
    prs.defineLayout({
      name: D.slide.layout,
      width: Number(D.slide.widthIn),
      height: Number(D.slide.heightIn)
    });
  }
  prs.layout = D.slide.layout || "LAYOUT_16x9";

  if (!noCover) renderCover(D, prs, fm, pal);
  for (const section of sections) renderSectionSlide(D, prs, section, pal, verbose);
  renderDoneSlide(D, prs, fm, pal);
  attachNotesFormatter(prs);   // 발표 노트: 줄마다 문단 · **굵게**(pptgen 과 같은 규칙 — notes.mjs)
  return { prs, fm, sections, styleKey, D };
}
