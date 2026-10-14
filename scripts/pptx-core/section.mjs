/**
 * pptx-core/section.mjs — 섹션 슬라이드 — 머리 띠·번호, slide-config(bg·color·titleSize·bodySize·notes), 영역 넘치면 다음 장으로
 * MD → PPTX 공용 코어의 부분(fs/path 없음). CLI(md-to-pptx.mjs)와 브라우저(src/lib/pptx-browser.ts)가 같은 코어를 부른다.
 * D = 이 변환 한 번의 디자인 설정(config/pptdesign.config.json 복사본 + 테마·머리말 덮어쓰기) — 부르는 쪽이 넘긴다.
 */
import { hexClean } from "./util.mjs";
import { itemH, renderItem } from "./cards.mjs";

export function renderSectionSlide(D, prs, section, pal, verbose) {
  D = JSON.parse(JSON.stringify(D));   // 이 섹션만의 복사본 — slide-config 덮어쓰기가 다음 섹션·부르는 쪽에 새지 않게(예전 전역 D 복원과 같은 효과)
  
  if (section.config) {
    if (section.config.titleSize) D.card.titleSize = Number(section.config.titleSize);
    if (section.config.bodySize) D.card.bodySize = Number(section.config.bodySize);
  }

  {
    const dh = D.header;
    const sw = D.slide.widthIn;
    const mx = D.slide.marginX;
    const font = D.slide.font;
    const fontTitle = D.slide.fontTitle || font;
    const bodyW = sw - mx * 2;
    
    // 슬라이드 단위 팔레트 세팅
    const slidePal = { ...pal };
    const slideBg = (section.config && section.config.bg) || D.palette.white;
    
    if (section.config && section.config.bg) {
      const customBg = hexClean(section.config.bg);
      if (customBg) {
        slidePal.white = customBg;
      }
    }
    
    if (section.config && section.config.color) {
      const customColor = hexClean(section.config.color);
      if (customColor) {
        slidePal.text = customColor;
        slidePal.text2 = customColor;
      }
    }

    // 슬라이드 자동분할 헤더 초기화
    let currentSlide = prs.addSlide();
    let pageCount = 1;

    function initSlideHeader(slide, pageNum) {
      slide.background = { color: hexClean(slideBg) || "FFFFFF" };
      slide.addShape("rect", { x: 0, y: dh.y, w: sw, h: dh.h, fill: { color: slidePal.bgDark }, line: { type: "none" } });
      
      const nbs = dh.numBoxSize;
      const nby = dh.y + (dh.h - nbs) / 2;
      slide.addShape("roundRect", { x: dh.paddingX, y: nby, w: nbs, h: nbs, rectRadius: 0.1, fill: { color: slidePal.brand }, line: { type: "none" } });
      slide.addText(String(section.num), { x: dh.paddingX, y: nby, w: nbs, h: nbs, fontSize: dh.numFontSize, bold: true, color: slidePal.white, fontFace: fontTitle, align: "center", valign: "middle" });
      
      const displayTitle = section.title + (pageNum > 1 ? " (계속)" : "");
      slide.addText(displayTitle, { x: dh.paddingX + nbs + 0.15, y: dh.y, w: sw - dh.paddingX - nbs - 0.25, h: dh.h, fontSize: dh.titleFontSize, bold: true, color: slidePal.white, fontFace: fontTitle, valign: "middle" });
    }

    initSlideHeader(currentSlide, pageCount);

    // 발표스크립트(speaker notes) — ::: slide-config 의 notes: 필드. 섹션이 여러 페이지로
    // 자동분할되어도 첫 페이지에만 붙인다(섹션당 스크립트 1개라는 저작 모델과 일치).
    if (section.config && section.config.notes) {
      currentSlide.addNotes(String(section.config.notes).replace(/\\n/g, "\n"));
    }

    let curY = D.slide.bodyTopY;
    
    for (const item of section.items) {
      const height = itemH(D, item, bodyW, slidePal);
      
      if (curY + height > D.slide.bodyBottomY + 0.15) {
        if (verbose) {
          console.log(`  💡 "${section.title}": 영역 초과로 슬라이드 분할 (curY=${curY.toFixed(2)}, height=${height.toFixed(2)}, max=${D.slide.bodyBottomY})`);
        }
        pageCount++;
        currentSlide = prs.addSlide();
        initSlideHeader(currentSlide, pageCount);
        curY = D.slide.bodyTopY;
      }
      
      curY += renderItem(D, currentSlide, item, mx, curY, bodyW, slidePal) + D.card.gap;
    }
  }
}
