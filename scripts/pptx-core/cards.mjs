/**
 * pptx-core/cards.mjs — 카드(## 제목 + 블록)·숏코드 항목 높이 추정·그리기(pptx-renderers 레지스트리에 위임)
 * MD → PPTX 공용 코어의 부분(fs/path 없음). CLI(md-to-pptx.mjs)와 브라우저(src/lib/pptx-browser.ts)가 같은 코어를 부른다.
 * D = 이 변환 한 번의 디자인 설정(config/pptdesign.config.json 복사본 + 테마·머리말 덮어쓰기) — 부르는 쪽이 넘긴다.
 */
import { pptxRegistry, helpers } from "../pptx-renderers/registry.mjs";
import { blockH, renderBlock } from "./blocks.mjs";

export function cardH(D, card, w) {
  const c = D.card;
  let h = c.padY * 2;
  if (card.title) h += (c.titleSize / 72) * 1.7 + c.gap * 0.5;
  for (const b of (card.blocks || [])) h += blockH(D, b, w);
  return Math.max(0.45, h);
}

// 숏코드 블록 인자 title-size= / desc-size= → card 폰트 크기 오버라이드
// (HTML buildSizeOverrideStyle 와 대칭. 평문 숫자는 config 기본값의 배수, "18pt" 형식은 절대 pt)
export function applyShortcodeSizeArgs(baseD, args) {
  if (!args) return baseD;
  const s = String(args);
  const tm = s.match(/title-size=(\S+)/);
  const dm = s.match(/desc-size=(\S+)/);
  if (!tm && !dm) return baseD;
  const resolve = (raw, base) => {
    const v = String(raw).trim();
    if (/^\d+(\.\d+)?$/.test(v)) return parseFloat(v) * base;   // 배수
    const pt = v.match(/^(\d+(\.\d+)?)pt$/i);
    if (pt) return parseFloat(pt[1]);                          // 절대 pt
    return null;
  };
  const out = { ...baseD, card: { ...baseD.card } };
  if (tm) { const v = resolve(tm[1], baseD.card.titleSize); if (v) out.card.titleSize = v; }
  if (dm) { const v = resolve(dm[1], baseD.card.bodySize);  if (v) out.card.bodySize = v; }
  return out;
}

export function itemH(D, item, w, pal) {
  if (item.type === "card") return cardH(D, item, w);
  
  const renderer = pptxRegistry.get(item.type);
  if (renderer) {
    try {
      const boundHelpers = {
        ...helpers,
        hexClean(hex) {
          return helpers.hexClean(hex, pal);
        }
      };
      return renderer.estimateHeight(item, w, applyShortcodeSizeArgs(D, item.args), boundHelpers);
    } catch (err) {
      console.error(`  ⚠️  숏코드 높이 추정 오류 (${item.type}): ${err.message}`);
      return 1.0;
    }
  }
  
  return 0;
}

export function renderCard(D, slide, card, x, y, w, pal) {
  const c = D.card;
  const font = D.slide.font;
  const fontSubTitle = D.slide.fontSubTitle || font;
  const r = D.slide.globalRadius;
  const h = cardH(D, card, w);
  slide.addShape("roundRect", { x, y, w, h, rectRadius: r, fill: { color: pal.white }, line: { color: pal.border, width: 0.75 } });
  let cy = y + c.padY;
  if (card.title) {
    const th = (c.titleSize / 72) * 1.7;
    slide.addText(card.title, { x: x + c.padX, y: cy, w: w - c.padX * 2, h: th + 0.05, fontSize: c.titleSize, bold: true, color: pal.brandDark, fontFace: fontSubTitle, valign: "top" });
    cy += th + 0.05 + c.gap * 0.5;
  }
  for (const block of (card.blocks || [])) cy += renderBlock(D, slide, block, x + c.padX, cy, w - c.padX * 2, pal);
  return h;
}

// ════════════════════════════════════════════════════════════════
//  9. 숏코드 렌더러 디스패처 (레지스트리 위임)
// ════════════════════════════════════════════════════════════════

export function renderItem(D, slide, item, x, y, w, pal) {
  if (item.type === "card") return renderCard(D, slide, item, x, y, w, pal);
  
  const renderer = pptxRegistry.get(item.type);
  if (renderer) {
    try {
      const boundHelpers = {
        ...helpers,
        hexClean(hex) {
          return helpers.hexClean(hex, pal);
        }
      };
      return renderer.render(slide, item, x, y, w, pal, applyShortcodeSizeArgs(D, item.args), boundHelpers);
    } catch (err) {
      console.error(`  ❌ 숏코드 렌더링 실패 (${item.type}):`, err);
      slide.addShape("roundRect", { x, y, w, h: 0.5, fill: { color: "FFF1F2" }, line: { color: "EF4444", width: 1.0 } });
      slide.addText(`[숏코드 렌더링 에러: ${item.type} (${err.message})]`, { x: x + 0.1, y, w: w - 0.2, h: 0.5, fontSize: D.system.errorSize, color: "B91C1C", valign: "middle" });
      return 0.5;
    }
  }
  
  console.warn(`  ⚠️  PPTX 미구현 숏코드: "${item.type}" — 슬라이드에서 제외됨`);
  return 0;
}
